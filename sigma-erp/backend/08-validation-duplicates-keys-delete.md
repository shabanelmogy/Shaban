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
- One fail-open path exists: `QueryReport<T>()` returns the **unfiltered** set when
  the subscription claim is missing, or when `T` has no `SubscriptionId`/
  `IsDeleted` property. Never use it for a validation check. Backlog item 10.

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
- back the rule with a unique index from step 2, or two concurrent requests can
  both pass the check and both insert;
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

**Many ids from a detail collection** — compare counts. This is the one that is
easy to get wrong:

```csharp
var itemIds = vm.PurchaseOrderDetails
    .Where(d => d.ItemId.HasValue)
    .Select(d => d.ItemId!.Value)
    .Distinct()
    .ToList();

if (itemIds.Count > 0)
{
    var foundCount = await UnitOfWork.Repository.Query<Item>()
        .Where(x => itemIds.Contains(x.Id))
        .Select(x => x.Id)
        .Distinct()
        .CountAsync();

    if (foundCount != itemIds.Count) return Fail("Invalid Item references");
}
```

`ExistsAsync<Item>(x => itemIds.Contains(x.Id))` is **not** equivalent — it returns
true when a single requested id exists, so an unknown id passes alongside a real
sibling. `PurchaseOrderService` currently has that defect; backlog item 3.

Also validate:

- **dependent combinations**, not just each id alone — a Role must belong to the
  supplied Department, a CarModel to the supplied CarMake;
- **self-reference and cycles** for any hierarchy: reject
  `vm.ParentId == vm.Id`, then walk the chain to reject a longer loop;
- **selectability**, when inactive rows exist but must not be chosen — add
  `&& x.IsActive == true` to the predicate.

A client-supplied navigation object is never proof of anything. Read the id and
verify it.

### 3. Reference check before delete

Before removing a row, inventory everything that points at it, from the current
EF model rather than memory, and block with a message naming the blocker.

```csharp
public override async Task<Result> RemoveAsync(int id)
{
    if (await UnitOfWork.Repository.ExistsAsync<Partner>(x => x.BranchId == id))
        return Fail("Cannot delete — branch is referenced by Partners.");

    // InvoiceBase is abstract — EF maps concrete subtypes, so check each one
    if (await UnitOfWork.Repository.ExistsAsync<Invoice>(x => x.BranchId == id))
        return Fail("Cannot delete — branch is referenced by Invoices.");
    if (await UnitOfWork.Repository.ExistsAsync<LimousineInvoice>(x => x.BranchId == id))
        return Fail("Cannot delete — branch is referenced by Limousine Invoices.");
    if (await UnitOfWork.Repository.ExistsAsync<MiscellaneousInvoice>(x => x.BranchId == id))
        return Fail("Cannot delete — branch is referenced by Miscellaneous Invoices.");
    // … EquipmentRentalInvoice, TransportationInvoice, RentalQuotation, PurchaseOrder

    return await base.RemoveAsync(id);
}
```

How to build that list — do not guess:

1. search the model for the FK property name, e.g. `BranchId`;
2. add the semantic references that do **not** carry the obvious name —
   attendance, history, log and report tables that reference the row another way;
3. for an abstract base such as `InvoiceBase`, list every concrete subtype
   separately; a check against the base does not compile to one table;
4. give each blocker its own message so the user knows what to clear first;
5. finish with `base.RemoveAsync(id)` when the base behaviour — soft delete,
   `DeletedAt`, `DeletedBy` — is what you want.

Two more rules:

- **owned children are not blockers.** Detail rows the aggregate owns should
  cascade or be soft-deleted with the parent, per the step 2 configuration. Only
  *foreign* references block.
- **bulk delete validates every target before mutating any target**, so a
  partially applied delete is impossible.

### Where each check belongs, by pattern

| Check | Normal | Master-detail | Master-detail + financial | Settings |
|---|---|---|---|---|
| Duplicate on Add | Business key | Document number, normalized first | Document number, normalized first | Logical key, in payload and in store |
| Duplicate on Update | Exclude self | Exclude self | Exclude self | Not applicable — sync by key |
| Header FK exists | Each FK | Each FK | Each FK plus accounts and fiscal period | Enum keys via `Enum.IsDefined` |
| Detail FK exists | Not applicable | Distinct ids, count compare | Distinct ids, count compare | Not applicable |
| Child belongs to parent | Not applicable | Required | Required | Not applicable |
| Reference check on Delete | Required | Required, plus document state | Blocked when posted, approved, or allocated | Usually delete-by-omission |

**Check:** duplicate checked on Add and on Update excluding self · duplicate scope
is the business key and is backed by a unique index · strings normalized before
comparison · every required FK verified, optional FKs only when supplied ·
collections verified by distinct count, never `Any` · dependent combinations and
hierarchy cycles rejected · no manual tenant or soft-delete predicate added ·
`QueryReport` never used for validation · all references inventoried before
delete with specific messages · abstract bases expanded to concrete subtypes ·
owned children not treated as blockers · bulk delete validates all before
mutating any.

---

