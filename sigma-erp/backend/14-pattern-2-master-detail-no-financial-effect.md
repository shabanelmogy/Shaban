## 14. Pattern 2 — Master-detail, no financial effect

> **Status: Canonical** — reference `Services/VouchersServices/PurchaseOrderService.cs` (FK checks and delete fixed 2026-10-01)

A header plus detail rows, saved as one graph. No journal voucher, no
allocation.

**Order of work in Add and Update:**

1. require the business minimum number of details;
2. validate every header FK;
3. validate every **distinct** detail FK;
4. load the header with its details, tracked;
5. map, recalculate, save once.

```csharp
if (vm.PurchaseOrderDetails?.Any() != true)
    return Fail("At least one purchase order detail is required");

if (!await UnitOfWork.Repository.ExistsAsync<Supplier>(x => x.Id == vm.SupplierId))
    return Fail("Invalid Supplier");

if (!await UnitOfWork.Repository.ExistsAsync<Branch>(x => x.Id == vm.BranchId))
    return Fail("Invalid Branch");

if (vm.JobId.HasValue &&
    !await UnitOfWork.Repository.ExistsAsync<Job>(x => x.Id == vm.JobId))
    return Fail("Invalid Job");
```

Load the aggregate with its children **tracked**, so EF can reconcile:

```csharp
var entity = await UnitOfWork.Repository.Query<PurchaseOrder>(
        e => e.Id == vm.Id, null, true, false, e => e.PurchaseOrderDetails)
    .FirstOrDefaultAsync();

if (entity is null) return Fail("PurchaseOrder not found");

Mapper.Map(vm, entity);

foreach (var detail in entity.PurchaseOrderDetails)
    detail.Recalculate();               // totals are the domain's job

UnitOfWork.Repository.Update(entity);
await UnitOfWork.SaveChangesAsync();
```

**Totals are recalculated on the server.** Never persist a total the client sent.

**Detail-only conversion provenance (owner2026-10-24).** A conversion's selected
source belongs to its destination details, including a document with only one
source. Do not duplicate that source FK on the destination master as a persisted
summary. Store the actual source-line key; where a source parent ID is also
stored, derive and validate it on the server. Input mappings ignore server-owned
provenance. Derive header display summaries, usage/billing/report/reference
membership and linked/read-only flags from live details. Remove obsolete master
entity/config/DTO/form/query paths together. The detail's own aggregate parent FK
remains ownership, not conversion provenance. Document-wide agreement, journal,
loan or quotation context remains on the owning document when it does not select
or consume source lines; do not turn it into a fictional line conversion.
Validate same tenant/supplier/
type/effective currency, unique source lines, positive quantities and current
remaining capacity under the existing source write boundary. Resolve source
prices/items/UOM on the server. Editing a retained row cannot change its source
and cannot silently introduce a new source order outside the saved contract.
Preserve model-owned draft reservation/approval/void timing: pending GRNs remain
nonconsuming, approval revalidates and consumes; PO source capacity rules below
remain separate. This general rule supersedes the earlier GRN/PR-to-PO header
compatibility summary policy; it does not authorize new multi-source eligibility,
lifecycle or accounting behavior. Historical parent-only proof protects source
references; it cannot invent precise source-line quantities. A preserved legacy
quantity fallback needs its existing source-supported rule and disjoint scope.

**GRN detail-only order reference (owner2026-10-24).** GoodsReceivedNote has no
persisted PurchaseOrderId/navigation, including the single-order case. Each linked
GoodsReceivedNoteDetail stores nullable PurchaseOrderId and PurchaseOrderDetailId;
the server derives the former from its live source line, validates saved-pair
consistency and owns both fields' provenance. The redundant order ID is not an
extra client-editable input. Manual rows have both IDs null. Keep source field
mappings explicit; remove master DTO/form/save properties and all master FK/query
branches together. Detail read projections may fall back to reliable source-line
provenance for retained rows pending a reviewed backfill. GRN list/filter/report/
bill/PO-reference readers derive membership from its details; structured rows
without reliable line proof remain review cases and cannot be attributed to an
invented source line. Manual legacy LPONo text fallback is disjoint and applies
only to wholly unstructured receipts. Do not persist a linked header LPONo
summary; display one/multiple sources from details. Dropping the old header link
requires owner migration review and preservation of historical provenance before
the column is removed; do not create migrations, run data repair or reset a database
as part of source work.

**Purchasing and analogous stock adoption (owner2026-10-24).** PurchaseOrderDetail
stores PurchaseRequestId/PurchaseRequestDetailId, with no PR FK on PurchaseOrder.
PurchaseRequestDetail stores ItemRequisitionId/ItemRequisitionItemId, with no
requisition FK on PurchaseRequest. ItemIssueItem stores either the GRN/detail pair
or requisition/item pair, with no source FK on ItemIssue. Existing conversion
actions already know the selected source line; preserve it instead of discarding
its identity. Manual writers cannot attach source claims. Keep one live PR per
requisition under the existing requisition tenant write lock and duplicate check;
the former header unique index is replaced with detail lookup indexes. Linked
issues/PRs retain their edit/dependency rules, GRN-generated drafts retain their
void behavior and new issue approval validates all saved source pairs/item IDs.

Reference checks recognize both stored parent and actual source-line parent,
including malformed pairs, so neither source becomes mutable accidentally.
Capacity counts only consistent proof. The existing approved requisition
parent+ItemId historical policy remains when no source-line key exists; a present
but inconsistent source key blocks further capacity. Shared
ItemRequisitionSourceQuery owns this distinction for list/detail/actions and issue
approval. Source-only or mismatched rows protect both identifiable sources and
require review; do not attribute guessed quantities. This rule is reusable for
similar document-line flows, including BillDetail and financial allocation rows
that already conform. It does not remove document-wide associations.

**Compatible direct orders in supplier bills (owner2026-10-24).** BillDetail keeps
PurchaseOrderDetailId as its direct source; derive order identity from that line,
never add a master source FK. The approved purchasing contract combines several
General orders or several Job orders for the same supplier, effective currency
and selected bill branch (a null source branch may use it); never mix those types
or mix direct/manual/receipt lines. Both the operational eligible-order selector
and draft/save/preview/approval recheck eligibility and capacity. Editing preserves
retained line identity and permits only orders from the saved source set. Approved
bills invoice; pending bills reserve; rejected/voided/deleted bills release under
their existing lifecycle. Usage and SQL progress readers validate every retained
row of each touched bill and the complete compatible source set; another order
alone is not a mixed-source error. Aggregate quantity against each actual source
line without duplicating other orders' quantities. The direct selector uses the
existing Results<SelectListBaseVm> value/text contract and one batched usage read,
not cached reference choices or per-option detail requests. Bill's editable
discount retains its current policy: the initial suggestion sums each source's
proportional selected amount; this creates no new discount-consumption mechanism.
This adoption changes no physical Bill schema or financial posting lifecycle.

**Per-source discount attribution (owner2026-10-24).** An order combining requests
must retain each request's exact allocated discount independently of the order
header total. PR-to-PO persists nullable server-owned
`PurchaseOrderDetail.PurchaseRequestAllocatedDiscount` (decimal18,2); new source
writes allocate each request's rounded share deterministically over only that
request's order lines, with the final line taking the rounding residual. Header
Discount is the sum of those shares. Reservation readers group by actual source
line membership and sum its stored shares. A legacy header-discount fallback
requires the entire order to contain exactly one reliable source request, every
line linked consistently and every share null; count the saved monetary Discount
once. Mixed/partial shares or multiple unallocated sources block capacity rather
than fabricate historical attribution. Editing owned source rows rechecks every affected request under the
existing write lock and recalculates shares without mutating other saved orders.
A retained source identity/price cannot change; ordinary pending-order descriptions
remain editable under their existing contract. Removing all lines of one source
updates source membership from retained details only. Never infer
per-request historical discount by proportionally splitting a multi-source
header total; a persisted attribution needs an owner migration, not a client
input or an automatic historical repair.

**Source-use projection (owner 2026-10-22).** Purchase Request → Purchase Order
is the first reusable quantity-consumption example. Count only live source lines
with positive quantity and positive quantities on live PO lines under live POs
linked back to the same request/line; a saved Pending PO already consumes
source capacity, while a Rejected PO releases its quantity and allocated source
discount without deleting its historical link (owner correction 2026-10-22).
Deleting an eligible pending PO also releases capacity. Derive NoQuantity/Open/
PartiallyUsed/Closed per request on read, separate from approval and billing.
The display percentage is the arithmetic mean of each positive line's clamped
used/requested ratio, with 0 for Open, 100 for Closed, 0.01–99.99 for
PartiallyUsed after two-decimal rounding, and null for NoQuantity;
do not add different UOMs. Batch the line/usage read for the current page,
and expose the same read-only fields in saved details. Freeze a different
downstream linkage/denominator before applying this pattern to another model.

**Retained one-to-one identity and live navigation rows (2026-10-21).** A soft
delete retains the unique foreign-key slot. Editing an owned one-to-one reference
must reconcile the retained draft instance rather than soft-delete it and insert
another with the same unique parent FK. When the confirmed draft workflow can
turn that reference off and on, reuse the same slot only after proving that no
retained financial history forbids correction; never revive paid/revised source
history or hard-delete it to release the key. Explicitly reconcile its owned
rows and derived values through their domain owner. Bills' editable loan plan is
the source example; no schema change or automatic historical backfill is implied.

A repository filter on the query root does not prove that EF navigation Includes
exclude soft-deleted children. Live financial-state readers must exclude deleted
source rows and still validate every remaining row's tenant and shape. Historical
payment/link proof keeps its stricter retained-history rules. Bills' retained
journal rebuild after UnApprove/reapproval exposed this distinction; do not
remove historical rows or weaken cash proof to repair a live-source read.

**Detail references — every distinct id must exist.** `ExistsAsync(x => ids.Contains(x.Id))` is
true when *one* id exists, so an unknown id passes beside a real one. The reference validates
all detail references in one helper built on the base `AllExistAsync` (block 8):

```csharp
if (await InvalidDetailReferenceAsync(vm.PurchaseOrderDetails.Select(d =>
        (d.ItemId, d.AssetTypeId, d.VehicleId, d.UnitsOfMeasuresId, d.JobId))) is { } referenceError)
    return Fail(referenceError);
```

**Delete removes the details too.** `RemoveAsync` is overridden with
`RemoveWithChildrenAsync(id, ct, x => x.PurchaseOrderDetails)`, so the lines are soft-deleted with
the header and no report counts lines of a deleted document.

Also decide and document, per feature:

- nothing about omitted vs empty: the contract is a **full snapshot** (owner decision D4-3,
  2026-10-01). The client always sends the whole collection; a saved row carries its id, a new
  row has none, a missing row is removed, and an empty list clears the collection only when the
  business minimum allows zero rows. The base `UpdateAsync` still treats a `null` collection as
  "leave alone" for old clients; new and reviewed screens never send `null`;
- whether a detail id from the client is verified to belong to **this** parent
  and tenant before it is updated or removed;
- status transitions as explicit methods with legal source/target checks, as
  `ToggleApprovalStatusAsync` and `ToggleBillStatusAsync` do.

### Owned rows on update — which way (Canonical, 2026-10-01)

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

### Quotation domain-action specialization — Canonical

`SiGma.Business/Services/SalesQuotationService.cs` plus its interface and
controller are the complete reference for a quotation action lifecycle. A
quotation type may expose fewer transitions. Do not copy every Sales action;
freeze the feature's own state, payload, dependency, route, and target-state
contract first.

Keep the generic service and controller bases. Override only the CRUD/read
methods that require feature-specific validation, aggregate-child
reconciliation, deletion dependencies, or projection. Do not override a method
merely to call another override or delegate to `base`. Add explicit service
interface and controller methods only for confirmed domain transitions.

#### Mandatory action inventory and override audit

Read the approved reference completely before implementation: interface,
service, controller, request DTOs, ListVM/action state, and owning Angular action
service/menu. Record every public reference action even when the target will not
support it.

| Reference action | Target decision | Exact source -> target state | Payload/dependency evidence |
|---|---|---|---|
| | Supported / Not Applicable / Missing / Conflicting | | |

No row may disappear between discovery and implementation. `Not Applicable`
requires a concrete domain reason. For example, a Sales down-payment receipt is
not applicable to a quotation without down-payment and receipt aggregates.

Audit inherited methods separately:

| Virtual method | Override? | Required feature-specific behavior |
|---|---|---|
| `AddAsync` | Yes / No | Business validation or aggregate construction only |
| `UpdateAsync` | Yes / No | State lock or aggregate-child reconciliation only |
| `RemoveAsync` | Yes / No | Dependency/state-aware deletion only |
| `DetailAsync` / `DetailWithNavigationsAsync` | Yes / No independently | A distinct consumed projection, never delegation for symmetry |
| `GetManyAsync` / `GetManyWithNavigationsAsync` | Yes / No independently | A distinct filter/projection contract, never delegation for symmetry |

If the third column is empty, inherit the base implementation. An override that
only calls `base`, forwards to another override, or exists because the reference
has one must be removed. Run a scoped `override` search again during Phase 6 and
reconcile it with this table.

Every supported quotation transition must:

1. reload the current quotation inside the request boundary;
2. validate the legal source state and every readiness/dependency invariant;
3. validate a reason/note/date payload only when that field is part of the
   confirmed request contract;
4. mutate only server-owned workflow fields;
5. persist once through the scoped `DbContext` (`SaveChangesAsync` for a
   tracked mutation, or one conditional `ExecuteUpdateAsync` when atomic
   source-state matching is required) unless the documented workflow has a real
   multi-save or multi-boundary transaction requirement;
6. return the standard `Result`, with an actionable failure for invalid state,
   stale UI, missing dependency, or blocked reversal.

For state stored on more than one field, every predicate and mutation must name
the full source and target tuples. Example: `Approved/Pending ->
Approved/Approved`, not merely "set CustomerApproval to Approved". The ListVM
flag and the service predicate must describe the same tuple.

Choose and record a concurrency strategy for both the state row and its
dependencies. A conditional update can atomically match the source state, but a
separate `Any`/`Exists` dependency check is not automatically atomic with that
update. Use an applicable transaction/isolation or database invariant when the
dependency may be created concurrently, or report the residual race explicitly;
do not claim the action is concurrency-safe merely because each query is valid.

The common action shapes are internal approve/reject, customer approve/reject,
revise, unapprove, and creation of a downstream agreement or receipt. Their
names do not standardize their implementation: existing quotation families use
different HTTP verbs, routes, reason payloads, revision semantics, and dependent
record checks. Preserve the owning feature's real contract; never manufacture a
shared route or silently map CustomerRejected to Revised.

The complete Sales reference freezes these cases:

| Sales reference action | Legal transition | Extra contract |
|---|---|---|
| Internally approve | Pending to InternallyApproved | Revalidate quotation readiness |
| Internally reject | Pending to InternallyRejected | Required trimmed reason, 5..500 characters |
| Customer approve | InternallyApproved to CustomerApproved | Server-owned state only |
| Customer reject | InternallyApproved to CustomerRejected | Required trimmed reason, 5..500 characters |
| Revise | InternallyApproved to Pending | Clear rejection reason; revision copy/numbering is separate unless explicitly implemented |
| Unapprove | CustomerApproved to InternallyApproved | Block when a dependent agreement or receipt exists |
| Generate down-payment receipt | CustomerApproved remains CustomerApproved | Requires a positive down payment and no existing receipt; this is Sales-specific, not a generic quotation action |

For a quotation with split internal/customer fields, preserve the same logical
cycle by validating both source fields and changing only the fields named by the
frozen contract. For example, internal approval can leave customer approval
Pending, customer approval can leave internal approval Approved, Revise can
return both fields to the editable Pending combination, and Unapprove can revert
only customer approval after dependency checks. Do not add the Sales receipt
action to a quotation that has no down-payment and receipt domain.

When list visibility depends on multiple approval axes or dependency checks,
project the minimum explicit `Can*` booleans required by the Angular action
menu. A single-status quotation may expose its public status enum instead. In
both shapes the backend transition method repeats the complete validation; a
`Can*` flag is presentation state, not authorization or concurrency control.

**Quotation check:** inherited ordinary operations retained · only necessary
overrides · one interface/controller/service method per supported transition ·
exact verb/route/payload frozen · legal source and target states documented ·
reversal dependency checks · server-owned state only · standard Result · ListVM
contains only displayed values plus minimum action state · every reference
action classified · every override justified · dependency concurrency decision
recorded.

**Check:** minimum detail count enforced · header and distinct detail FKs
validated by count, not `Any` · aggregate loaded tracked with children · child
ids proven to belong to this parent and tenant · totals recalculated server-side ·
full-snapshot collections (D4-3) · one save, or a transaction when there are
several.

### Explicit transaction boundary — Canonical

Decide from the number of `SaveChangesAsync` calls reachable on **one execution
path**, not from the number of save statements visible in the method. Do not
open an explicit transaction solely for atomicity when a path performs one save through one scoped
`DbContext`, including a tracked parent-and-children graph: EF Core's implicit
transaction makes that save atomic.

Use an explicit transaction only when one reachable business path performs
multiple saves that must succeed or fail together, spans multiple `DbContext`
instances or other independent persistence boundaries in one consistency
boundary, or interleaves other database work that makes partial persistence
invalid. Multiple repositories sharing one scoped `DbContext` and one save do
not by themselves require an explicit transaction. Open it before the first
mutation and include every dependent save. A conditional workflow may therefore
use an explicit transaction on its multi-save branch while its one-save branch
uses the implicit transaction.

**Check/save concurrency is a separate reason for isolation.** One-save atomicity does not
protect earlier duplicate/range reads. For declared `UniqueColumns`, base Add/Update use the
shared UnitOfWork application-lock boundary; Company and Individual import chunks use the
same entity/tenant resource and recheck live keys inside it (block 8). A navigation graph
alone does not require that boundary. Reusable default-group creation precedes it and all
aggregate mutation. Temporal-overlap checks retain their separate range-isolation rule in
block 8. Owner runtime verification covers races, timeout/deadlock outcomes and rollback.

Private helpers that call `SaveChangesAsync` do not start nested transactions
when every owning method already opens the transaction and the helper receives
the same scoped unit of work and `DbContext`. That transaction ownership is part
of the helper contract: a new caller without an owning transaction must add one
around the complete workflow or change the helper contract deliberately.

When a transaction is removed or retained during review, leave the applicable
short source comment at the decision point:

```csharp
// Removed: EF Core implicit transaction is sufficient.
// Kept: Multiple SaveChangesAsync() calls must be committed atomically.
```

Current source reconciliation:

| Source | Decision and evidence |
|---|---|
| `Services/Bases/Service.cs` — `UpdateAsync` | One save makes the graph atomic. When `UniqueColumns` exists, a shared explicit application-lock transaction also protects the earlier duplicate checks; otherwise the save uses EF Core's implicit transaction. Runtime verification remains required for collection add, update and remove cases. The comprehensive customer source review separately records defects in the legacy detached update's one-to-one ownership and saved-child mapping. |
| `Services/SeedDataService.cs` — `SeedSetting` | Insert and update saves are in mutually exclusive branches. One invocation reaches one save, so no explicit transaction is required. |
| `Services/VouchersServices/PurchaseOrderService.cs` — `ToggleBillStatusAsync` | The early not-approved path returns after its optional save; the approved path performs its separate save. No invocation reaches both saves, so no explicit transaction is required. |
| Private journal-voucher helpers | Remain transaction-free when their owning methods open the transaction before the first mutation and pass the same scoped unit of work and `DbContext`; they must not create a nested transaction. |
| `Services/VouchersServices/MiscellaneousInvoiceService.cs` — `AddAsync` | `AddAsync` always runs in one explicit transaction (re-verified 2026-10-01): it saves the invoice, builds the journal and, when the invoice produces journal lines, posts it and links it, then commits; a journal posting failure rolls everything back. The former separate invoice-only path no longer exists. Manually verify a successful save and a failing journal (nothing persisted). |

This reconciliation changes transaction ownership only. It does not by itself
change APIs, DTOs, mappings, calculations, entities, EF configuration or schema,
and therefore does not require a migration. Source-level transaction decisions
are complete when the table still matches current control flow; the named
runtime checks remain owner verification, not unresolved contract decisions.

---
