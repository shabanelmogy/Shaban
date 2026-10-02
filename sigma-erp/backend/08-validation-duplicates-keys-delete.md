## 8. Validation: duplicates, keys, delete

> **Status: Canonical**

Three checks apply to every **writable** entity in patterns 1 through 4. Reports
in pattern 5 are read-only and use their own boundary checks. For write patterns,
these checks run before the first save and are the difference between a service
and a data dump.

### What the repository already does for you

Read this first, because it decides how the checks are written.
`Repository<TContext>` resolves the tenant from the authenticated principal:

```csharp
var userClaimsPrincipal = contextAccessor.HttpContext?.User;
var userSubscriptionId  = userClaimsPrincipal?.FindFirst(ClaimTypes.NameIdentifier);
if (userSubscriptionId != null) _ = int.TryParse(userSubscriptionId.Value, out _subscriptionId);
```

and then applies tenant plus soft-delete filtering automatically to
`Query`, `ExistsAsync`, `FindByIdAsync`, `FindByAsync` and the rest:

```csharp
var query = _context.Set<T>().Where(a => a.SubscriptionId == _subscriptionId);
if (!includeDeleted)
    query = query.Where(a => a.IsDeleted != true);
```

Both default to `includeDeleted = false`. On write, `Add`/`Update` call
`SetSubscriptionIdForEntityAndChildren`, which overwrites any client-supplied
`SubscriptionId` on the entity **and its children**.

Consequences for your checks:

- **Do not add `&& x.SubscriptionId == …` yourself.** It is already applied, and
  the only value you could add is the untrusted one from the request.
- **Do not add `&& x.IsDeleted != true` yourself.** Also already applied.
- A soft-deleted record therefore does **not** block a duplicate check. If the
  business needs the name reserved even after deletion, pass
  `includeDeleted: true` deliberately and say why.
- `QueryReport<T>()` is read-only report access (`AsNoTracking`). It fails closed when
  the subscription claim is missing, but it is still not a validation tool: never use it
  for a duplicate, existence or ownership check.

### Automatic input checks (2026-10-01)

Before mapping anything, the base `AddAsync` and `UpdateAsync` run `InvalidInputAsync`:

1. **Unique columns.** The service declares them, each with its message key, and the base rejects
   a value already used by another live row of the tenant:
   ```csharp
   protected override (Expression<Func<Company, string?>> Column, string MessageKey)[] UniqueColumns =>
       [(x => x.CompanyName, "CompanyNameExists"), (x => x.VAT, "CompanyVatExists")];
   ```
2. **References.** For every foreign key in the request (the record's own and its nested rows':
   address, billing, child lines), the base checks that the chosen id is a live row of the tenant.
   It reads the keys from the EF model and fails with `ReferenceNotFound` ("a selected value from
   {table} no longer exists"). Only an absent/null optional id means nothing was chosen;
   a supplied foreign key must be positive. This does not reject the identity 0 of a new owned row.
   `MissingReferenceAsync` skips `IsBaseLinking()` inheritance keys: their `Id`
   identifies the row itself, not a user-selected base entity. New nested rows
   with `Id = 0` remain valid in an Update snapshot; saved row ownership is
   checked separately. All ordinary business FKs keep positive/live/tenant checks.

When two users save the same value at the same moment, both pass check 1 and the unique index refuses
the second save. That is answered once, in `AccountingConfigurationExceptionMiddleware` (409,
`RecordAlreadyExists`): a service does not wrap its save in `try/catch (DbUpdateException)`.
SQL deadlocks (1205), whether raised by a query or wrapped by a save, and
`DbUpdateConcurrencyException` are also answered centrally with localized 409
`ConcurrentWriteConflict`. Reload/review is required; never blindly retry an aggregate write.

The service keeps only the rules the base cannot know: a date order, a state, an accounting rule.
An override that replaces the base Add or Update calls `InvalidInputAsync(vm, id)` itself
(reference `CompanyService.UpdateCoreAsync`). Sections 1 and 2 below explain what these checks do and
how to write a rule the base cannot express.

### 1. Duplicate check

**Add** — reject before mapping or saving:

```csharp
if (await UnitOfWork.Repository.ExistsAsync<Branch>(
        x => x.Name == vm.Name, cancellationToken: cancellationToken))
    return Fail("A branch with this name already exists.");
```

**Update** — the same rule, excluding the record being edited:

```csharp
if (await UnitOfWork.Repository.ExistsAsync<Branch>(
        x => x.Name == vm.Name && x.Id != vm.Id))
    return Fail("A branch with this name already exists.");
```

Forgetting `x.Id != vm.Id` is the classic bug: saving a record without changing
its name reports a duplicate against itself.

Rules:

- the duplicate scope is the **real business key**, not whatever is convenient —
  a code, or a composite such as `(BranchId, Code)`;
- normalize before comparing. Trim first, and decide case behaviour explicitly;
  `Contains` and `==` follow the database collation, so state the intent
  rather than relying on it;
- back the rule with a unique index from step 2. When inheritance splits the business key
  and its tenant/live-row scope across tables, an ordinary filtered index cannot express that
  key: serialize participating duplicate-check writes with the shared
  `UnitOfWork.ExecuteUniqueWriteAsync<TEntity>` (owner decision 2026-10-01). It takes an
  Exclusive SQL Server application lock per entity type and authenticated subscription before
  duplicate reads, inside a ReadCommitted transaction. Base Add/Update apply it when
  `UniqueColumns` is declared; custom aggregate updates override protected `UpdateCoreAsync`.
  Custom writers, including Company and Individual import chunks, use the same boundary and
  recheck live keys inside it. A pre-flight import snapshot alone is insufficient. Preserve
  partial-chunk commit semantics. The lock waits at most 10 seconds; timeout, cancellation or
  deadlock outcomes stop the write with localized 409. Never blindly retry or claim all
  deadlocks impossible. An owned transaction commits only success and disposes on every exit;
  an existing outer transaction remains the caller's responsibility. This protects participating
  writers, not arbitrary SQL or future bypass writers; a database invariant still requires a
  deliberate schema design. A graph alone does not require an extra transaction;
- for a child collection, uniqueness is usually **within the parent**, so include
  the parent key in the predicate.

### Temporal-range business keys

A time period can be unique without being valid. Accounting periods such as fiscal
years must also reject **overlap**: an incoming range `[StartDate, EndDate]`
overlaps an existing range when `existing.StartDate <= EndDate &&
existing.EndDate >= StartDate`. Apply the same rule on Update while excluding the
current row. If downstream posting resolves one period for a date, allowing two
matching periods at setup time is a configuration defect, not a resolver concern.

When overlapping writes can race, keep the overlap check and the save in a
`Serializable` transaction (or an equivalent database-safe range-lock design);
an ordinary unique index cannot protect two different but overlapping ranges.

Changing period boundaries must preserve dependent accounting data. Before saving
a new range, verify linked dated records still fit the range and that invariants
such as an Opening Balance date matching the fiscal-year start still hold. Do not
silently re-home vouchers, month-close rows, budgets or opening balances as a side
effect of editing the period master.

If the period is soft-deletable, its ordinary exact-key unique index must follow the
repository's active-row semantics with a filter such as `[IsDeleted] = 0`; otherwise
a deleted setup row passes the service duplicate check but blocks recreation at the
database layer.

### 2. Foreign key existence check

Every incoming id must be proven to exist before the save. Because the
repository scopes by tenant, `ExistsAsync` also proves the row belongs to the
caller's tenant — that is the ownership check, so do not re-implement it with a
raw `DbContext.Set<T>()` or a bare `FindById`.

The base checks every reference in the request automatically (*Automatic input checks* above); write
one by hand only for an id the EF model does not hold as a foreign key.

**Required single FK:**

```csharp
if (!await UnitOfWork.Repository.ExistsAsync<Supplier>(x => x.Id == vm.SupplierId))
    return Fail("Invalid Supplier");
```

**Optional single FK** — only check when supplied:

```csharp
if (vm.JobId.HasValue &&
    !await UnitOfWork.Repository.ExistsAsync<Job>(x => x.Id == vm.JobId))
    return Fail("Invalid Job");
```

**Many ids from a detail collection** — every distinct id must exist. Use the base helper
`AllExistAsync<T>(ids)` (distinct count compared in the database; null ids ignored):

```csharp
if (!await AllExistAsync<Item>(vm.PurchaseOrderDetails.Select(d => d.ItemId)))
    return Fail("Invalid Item references");
```

`ExistsAsync<Item>(x => itemIds.Contains(x.Id))` is **not** equivalent — it returns
true when a single requested id exists, so an unknown id passes alongside a real
sibling. `PurchaseOrderService` had that defect in ten checks until 2026-10-01 (backlog 3).

Also validate:

- **dependent combinations**, not just each id alone — a Role must belong to the
  supplied Department, a CarModel to the supplied CarMake;
- **reference type**, when one table serves several businesses: Company and Individual create,
  update, contact-group actions and import accept `ContactType.Customer` groups only.
  `IContactGroupAccountService.CustomerGroupIdAsync(chosen)` resolves the default for absence
  and returns null for a supplied group of the wrong type or a missing/foreign/deleted group.
  Resolve it before tracked mutations because default creation may save the scoped context.
  Shared existence validation proves tenant/liveness, but not domain type;
- **self-reference and cycles** for any hierarchy: reject
  `vm.ParentId == vm.Id`, then walk the chain to reject a longer loop;
- **selectability**, when inactive rows exist but must not be chosen — add
  `&& x.IsActive == true` to the predicate.

A client-supplied navigation object is never proof of anything. Read the id and
verify it.

### 3. Reference check before delete (automatic, 2026-10-01)

A record that something still points at is never deleted. The base finds those references in the
EF model, so nobody lists them by hand and a reference added later is checked with no code.

`RemoveWithChildrenAsync(id, ct, owned…)` does the whole delete:

1. **Not found:** returns 404 when the record is missing.
2. **In use:** `InUseAsync` checks every table with a foreign key to the entity or one of its
   base types. The first live row blocks the delete with `RecordInUse` ("used in {table}"). The
   table name comes from the `Entity<Type>` key, or from the type name in words.
3. **Delete:** soft-deletes the record and the owned rows named in `owned`. Those rows belong to
   the record, so they never block.

```csharp
// Individual, Driver: the whole delete
public override Task<Result> RemoveAsync(int id)
    => RemoveWithChildrenAsync(id, CancellationToken.None,
        x => x.Documents, x => x.CreditCards, x => x.PartnerAddress, x => x.BillingInfo);
```

A child with usages of its own (a company's driver or contact person) is checked with
`InUseAsync<TChild>(childId, owned…)` before it is dropped from a snapshot or deleted with its
parent. Company adds only that check and its drivers' documents and address (reference
`CompanyService`).

Rules:

- **owned children are not blockers.** They are deleted with the parent, because every delete is a
  soft delete and EF cascade never reaches them. Never pass a foreign relation (a branch, another
  document) as owned.
- **Inheritance links are not usages.** `InUseAsync` skips EF foreign keys for
  which `IsBaseLinking()` is true: a derived row and its base row represent the
  same entity. Under TPT, counting Company → Partner would prevent a company
  from deleting itself. Keep ordinary external and self-referencing business
  foreign keys subject to usage checks; never skip a whole table.
- **No hand-written reference lists.** No `ExistsAsync` chains and no per-service blocker
  messages. Add an `Entity<Type>` key in both `GeneralMessage` files when a table's name should be
  translated.
- **No extra code where the base does the job.** No manual `Context.Remove` of an owned row, no
  tracked load only to delete, no not-found check before the helper.
- **Services on `base.RemoveAsync` are not checked yet.** A service without owned rows that still
  relies on `base.RemoveAsync` gets no usage check until backlog 31 moves it into the base delete.
- **bulk delete validates every target before mutating any target**, so a
  partially applied delete is impossible.

### Where each check belongs, by pattern

| Check | Normal | Master-detail | Master-detail + financial | Settings |
|---|---|---|---|---|
| Duplicate on Add | Business key | Document number, normalized first | Document number, normalized first | Logical key, in payload and in store |
| Duplicate on Update | Exclude self | Exclude self | Exclude self | Not applicable — upsert by key (block 16) |
| Header FK exists | Each FK | Each FK | Each FK plus accounts and fiscal period | Enum keys via `Enum.IsDefined` |
| Detail FK exists | Not applicable | Distinct ids, count compare | Distinct ids, count compare | Not applicable |
| Child belongs to parent | Not applicable | Required | Required | Not applicable |
| Reference check on Delete | Required | Required, plus document state | Blocked when posted, approved, or allocated | Explicit row Delete only; never by omission (block 16) |

**Check:** duplicate checked on Add and on Update excluding self · duplicate scope
is the business key and is backed by a unique index · strings normalized before
comparison · every required FK verified, optional FKs only when supplied ·
collections verified by distinct count, never `Any` · dependent combinations and
hierarchy cycles rejected · no manual tenant or soft-delete predicate added ·
`QueryReport` never used for validation · all references inventoried before
delete with specific messages · abstract bases expanded to concrete subtypes ·
owned children soft-deleted with the parent through `RemoveWithChildrenAsync` · collections
checked with `AllExistAsync` · bulk delete validates all before
mutating any.

---
