<!-- Part of backend block 14: see ../14-pattern-2-master-detail-no-financial-effect.md. Same status and authority as the block. -->

### Owned rows on update — which way
| The aggregate has | Update with | Reference |
|---|---|---|
| Reviewed owned collections or owned references (documents, cards, address, billing) | Override protected `UpdateCoreAsync` with tracked load and existing reconciliation helpers; public Update delegates to the base guard | `IndividualPartnerService` |
| Owned rows that have their own owned rows (a company's drivers and their documents) | Override protected `UpdateCoreAsync` on a tracked load with `ReconcileOwned`; public `UpdateAsync` delegates to the base | `CompanyService` |

**Tracked ownership before mapping (2026-10-01 comprehensive customer fixes).** A saved
reference id must belong to this aggregate, not merely exist in the tenant. Load the live
owned collections and references tracked, check `OwnsAll` and `OwnsReference`, then
map the request directly onto retained tracked instances. Ignore manually reconciled
navigations in the Update profile. Never attach a request-created graph first or map
a newly constructed child entity onto a saved entity: absent request fields such as
`No` can overwrite stored values. Individual now uses the existing tracked core
pattern for this reason. The legacy generic Update implementation is unchanged for
unreviewed consumers; its engine repair remains a separate task (backlog 32).

**Unchanged snapshots are successful updates.** After loading the existing aggregate and
validating the request, an unchanged snapshot is successful. Shared UnitOfWork sync/async
save returns true after SaveChanges completes, including zero affected rows; exceptions
and tenant-ownership conflicts still fail. `SaveUpdateAsync` delegates to that one rule.
Do not force an Update on the entire graph to make a no-op return an affected row.

**Grandchildren: an explicit override.** AutoMapper clears a destination collection and refills it
with new objects. Its own documentation says to use AutoMapper.Collection when that is not wanted.
The base therefore reconciles one level only, and a removed grandchild would stay saved. Such an
aggregate overrides protected `UpdateCoreAsync` on a tracked load, inside the base's
`UniqueColumns` write guard (block 8). Public `UpdateAsync` resolves saving master-data
helpers first, then delegates to the base:

1. Resolve every value that saves on its own first (the default contact group), before entering
   the base write guard and before aggregate mutations.
2. Inside the protected core, load exactly the rows the editor owns (filtered includes,
   `AsSplitQuery()`).
3. Check `OwnsAll`/`OwnsReference` for every collection, nested ones included.
4. Check each dropped child with `InUseAsync<TChild>` (block 8).
5. Map the scalars with the owned navigations ignored in the profile, run `ReconcileOwned` and
   `ReconcileReference`, then save once.

| Member | Use |
|---|---|
| `OwnsAll(incoming, current)` / `OwnsReference(incoming, current)` | Saved ids are this record's live rows |
| `ReconcileOwned(current, incoming, update?, removing?)` | One collection: deletes the missing, maps the kept, adds the new; `update` handles a row's own children, `removing` removes them first |
| `ReconcileReference(incoming, current)` | A one-to-one owned row: null removes it, otherwise the input maps onto the saved row and keeps its id |

A removed row stays in its collection and keeps its foreign key; `SaveChanges` turns the delete
into a soft delete. `DriverService` uses the same override because `CompanyService` maps drivers
through the driver profile, whose owned navigations must stay ignored. Making the base reconcile
grandchildren for every screen is backlog 32.

**Default contact group (G16, 2026-10-01; replaces the earlier note that gave Company an owning
transaction).** `GetOrCreateDefaultGroupIdAsync` saves the default group and its account by
itself. That group is reusable master data: a group left behind by a failed customer save is
valid, not partial persistence. Resolve it outside the caller's aggregate transaction and
before any tracked mapping, removal or other mutation: its save can flush the entire scoped
context. Individual and Company follow that ordering. Their base write guard takes an
application lock in a ReadCommitted transaction for duplicate checks and the save (block 8);
it never includes default-group creation. A single tracked Driver save uses the implicit
transaction.

**Shared customer helpers (`Services/Customers`, 2026-10-01).** Individual and Company use the
same pieces:

- `AgreementStatusFilter.Apply` — the open/closed agreement filter of both customer lists;
- `IContactGroupAccountService.CustomerGroupIdAsync` — default resolution and Customer-type
  validation for CRUD, group actions and import; it rejects absent authentication before
  any saving helper;
- write-VM `DateAfter` and `NotFutureDate` — API date checks, with equivalent explicit
  validation where custom import bypasses these VMs (block 3);
- `CustomerContactGroupUpdateVM` — the contact-group change of every customer list.

Keep Company ownership readable in private `OwnsEveryRow`. Use base `RemoveDroppedAsync`
for omitted drivers/contacts (same `MarkRemovedAsync` usage/owned-row checks), and
`SaveUpdateAsync` for one save and the standard localized result. These helpers add no saves
or nested transactions. Added-row numbering is shared at UnitOfWork save (block 11).

A customer service adds only what is its own.

**One agreement history (2026-10-01).** `Services/AgreementServices/AgreementHistory.cs` reads
the rental and lease agreements of one customer, vehicle or driver
(`LoadAsync(customerId:|vehicleId:|driverId:)`), newest first, into `AgreementHistoryVM`. It
returns them with `AsResults`, or `NotFound(message)` when the record does not exist.

- **Readers:** Individual, Company and Vehicle use it, with no history query of their own.
- **Status:** the read returns `IsClosed` as a boolean, never a status text, so the client
  translates it.
- **Transportation agreements:** not included. They are not `Agreement` rows, and Speed
  Auto shows rental and lease only.
