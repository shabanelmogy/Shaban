## 13. Pattern 1 — Normal entity

> **Status: Canonical** — reference `Services/BranchService.cs` (rewritten on the base hooks
> 2026-10-01)

Inherit the base and override only what the entity really needs:
- the list's feature filters (and the order, when it is not newest first);
- the business-key duplicate rule on Add and Update;
- the reference checks on Delete.

Everything else — paging, the total, the generic `Filters[key]` match, mapping, saving and
messages — comes from the base `Service`.

**List — hooks, not a rewritten `GetManyAsync`** (owner decision D5-1):

```csharp
/// Filters[search]: name or branch code. Keys that name a property (for example id) are matched by the base.
protected override IQueryable<Branch> ApplyListFilters(IQueryable<Branch> query, Dictionary<string, string> filters)
{
    if (FilterHelper.GetString(filters, "search")?.Trim() is { Length: > 0 } search)
        query = query.Where(x => x.Name.Contains(search) || (x.BranchCode != null && x.BranchCode.Contains(search)));
    return query;
}
```

The base `GetManyAsync` runs one query:
1. tenant and soft-delete scope;
2. the generic match (`Filters[key]` for keys that name a property: equality, or `Contains` for text);
3. `ApplyListFilters`;
4. `CountAsync`;
5. `ApplyListOrder`, in `sortOrder` (-1 descending): a `sortField` that names a stored column sorts by it, one that names a reference navigation sorts by its `Name` (`branch` → `Branch.Name`), anything else keeps `Id` descending; then `Id` as the tie-breaker;
6. paging clamped by `NormalizePaging` (block 9);
7. mapping to the ListVM.

It returns `TotalCount` and `TotalPages`. Steps 1–3 are `ListQuery(filters)`, which an export of the same rows reuses.

**What a list service writes (2026-10-01), and nothing more:**

| Need | Write |
|---|---|
| Filter on a column (`branchId`, `email`, a flag) | nothing: the generic `Filters[key]` match does it |
| The `search` box | `protected override Expression<Func<T, string?>>[] SearchColumns => [x => x.Name, x => x.No, …];` |
| Sort by a column or a navigation's name | nothing |
| A business filter (a date range, "has an open agreement") | `ApplyListFilters`, with that filter only |
| Sort by a computed value | `ApplyListOrder` with `SortField`/`SortBy` for that key, `base.ApplyListOrder` for the rest. Prefer a non-sortable column when sorting it has no business use |

References: `IndividualPartnerService` and `CompanyService`, which declare the search columns and one business filter each.

**Navigation names in the list.** The base loads the page's entities and maps them, so a ListVM
member read from a navigation (`Branch.Name`, `ContactGroup.Name`) comes back empty. Override
`MaterializeListAsync(query)` with `ProjectTo<TListVm>(Mapper.ConfigurationProvider)`: EF then
selects only the list columns with the joins they need (reference `IndividualPartnerService`,
2026-10-01). Stored columns and navigation names sort in the base; only a computed column needs an
`ApplyListOrder` override.

Override `GetManyAsync` itself only when the list is not one entity:
- a projection over several sources (the Job grid: `Concat` of Job and Lubrication Job, block 18);
- a grouped read model;
- a report.

Record the reason in the review (Master block 4, override justification).

**Add and Update** — trim the business key, check duplicates (excluding self on Update),
then let the base map and save:

```csharp
public override async Task<Result> AddAsync(BranchAddVM vm, CancellationToken cancellationToken)
{
    vm.Name = vm.Name?.Trim() ?? string.Empty;
    // The name is the business key; comparison follows the database collation (case-insensitive).
    if (await UnitOfWork.Repository.ExistsAsync<Branch>(x => x.Name == vm.Name, cancellationToken: cancellationToken))
        return BusinessFailure("BranchNameExists");

    return await base.AddAsync(vm, cancellationToken);
}

public override async Task<Result> UpdateAsync(BranchUpdateVM vm)
{
    vm.Name = vm.Name?.Trim() ?? string.Empty;
    if (!await UnitOfWork.Repository.ExistsAsync<Branch>(x => x.Id == vm.Id))
        return BusinessFailure("BranchNotFound", StatusCodes.Status404NotFound);

    if (await UnitOfWork.Repository.ExistsAsync<Branch>(x => x.Name == vm.Name && x.Id != vm.Id))
        return BusinessFailure("BranchNameExists");

    return await base.UpdateAsync(vm);
}
```

- **Business key.** Back the duplicate rule with a unique index on `(SubscriptionId, Name)`, filtered to `[IsDeleted] = 0` (block 2), so two concurrent requests cannot both insert.
- **Messages.** Every message is a `GeneralMessage` key in `.resx` **and** `.ar-SA.resx`, returned with `BusinessFailure(key, statusCode?)` (block 5). The request culture comes from the UI language, so an Arabic user reads Arabic.
- **Foreign keys.** Header FKs are checked with `ExistsAsync` (tenant-scoped). Id lists use `AllExistAsync<T>(ids)` (block 8).

**Delete** — inventory every foreign reference from the real model, one message each, then
defer to the base:

```csharp
public override async Task<Result> RemoveAsync(int id)
{
    if (await UnitOfWork.Repository.ExistsAsync<Partner>(x => x.BranchId == id))
        return BusinessFailure("BranchReferencedByPartners");
    // InvoiceBase is abstract — each concrete subtype is checked separately.
    if (await UnitOfWork.Repository.ExistsAsync<Invoice>(x => x.BranchId == id))
        return BusinessFailure("BranchReferencedByInvoices");
    …
    return await base.RemoveAsync(id);
}
```

- **Abstract bases.** An abstract base such as `InvoiceBase` is checked per concrete subtype.
- **One message per blocker.** Each blocked delete gets its own message, so the user knows what to clear.
- **Owned children.** A normal entity has none. If it does, use `RemoveWithChildrenAsync` (block 8) instead of `base.RemoveAsync`.

**Check:**
- **List:** no `GetManyAsync` override for filters — `ApplyListFilters`, and `ApplyListOrder` only for a business order.
- **Duplicate:** the business key is trimmed; duplicates are checked on Add and on Update excluding self; a filtered unique index backs them.
- **References:** every foreign reference is checked before Delete, abstract bases per subtype.
- **Base and messages:** the base is called for map/save/remove; every message is a `BusinessFailure` key present in both `.resx` files; no literal English `Fail("…")` in new code.

---
