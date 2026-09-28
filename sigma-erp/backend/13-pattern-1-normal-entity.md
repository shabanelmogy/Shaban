## 13. Pattern 1 — Normal entity

> **Status: Canonical** — reference `Services/BranchService.cs`

Inherit the base and override four things at most: the list query, duplicate
rules on Add and Update, and reference checks on Delete.

**List** — scoped query, filters, count, order, project, page:

```csharp
public override async Task<Results<BranchListVM>> GetManyAsync(ListSmBase searchModel)
{
    var pageNo   = searchModel.PageNo ?? 1;
    var pageSize = Math.Clamp(searchModel.PageSize ?? 10, 1, 100);
    var filters  = searchModel.Filters ?? [];

    var baseQuery = UnitOfWork.Repository.Query<Branch>().AsNoTracking();

    if (FilterHelper.GetInt(filters, "id") is { } id)
        baseQuery = baseQuery.Where(x => x.Id == id);

    if (FilterHelper.GetString(filters, "search") is { } search)
        baseQuery = baseQuery.Where(x =>
            x.Name.Contains(search) ||
            (x.BranchCode != null && x.BranchCode.Contains(search)));

    var total = await baseQuery.CountAsync();

    var items = await baseQuery
        .OrderByDescending(x => x.Id)
        .ProjectTo<BranchListVM>(Mapper.ConfigurationProvider)
        .Skip((pageNo - 1) * pageSize)
        .Take(pageSize)
        .ToListAsync();

    return new Results<BranchListVM> { /* see block 7 for TotalCount */ };
}
```

`FilterHelper.GetInt` / `GetString` read the `Filters[key]` dictionary the
Angular service sends, so a malformed value is simply absent rather than
silently changing the filter.

**Add** — validate duplicates before the first save:

```csharp
public override async Task<Result> AddAsync(BranchAddVM vm, CancellationToken cancellationToken)
{
    if (await UnitOfWork.Repository.ExistsAsync<Branch>(x => x.Name == vm.Name,
            cancellationToken: cancellationToken))
        return Fail("A branch with this name already exists.");

    var entity = Mapper.Map<Branch>(vm);
    await UnitOfWork.Repository.AddAsync(entity, cancellationToken);
    var result = await UnitOfWork.SaveChangesAsync(cancellationToken);

    return new Result
    {
        IsSuccess = result,
        Id = entity.Id,
        Message = result
            ? Localization.GetString(GeneralMessage.SuccessedToAdd)
            : Localization.GetString(GeneralMessage.FailedToAdd)
    };
}
```

**Update** — load first, exclude self from the duplicate check, map onto the
tracked entity:

```csharp
var entity = await UnitOfWork.Repository.FindByIdAsync<Branch>(vm.Id);
if (entity is null) return Fail("Branch not found.");

if (await UnitOfWork.Repository.ExistsAsync<Branch>(x => x.Name == vm.Name && x.Id != vm.Id))
    return Fail("A branch with this name already exists.");

Mapper.Map(vm, entity);
UnitOfWork.Repository.Update(entity);
```

**Delete** — inventory every reference from the real model, then defer to base:

```csharp
public override async Task<Result> RemoveAsync(int id)
{
    if (await UnitOfWork.Repository.ExistsAsync<Partner>(x => x.BranchId == id))
        return Fail("Cannot delete — branch is referenced by Partners.");

    // InvoiceBase is abstract — check each concrete subtype individually
    if (await UnitOfWork.Repository.ExistsAsync<Invoice>(x => x.BranchId == id))
        return Fail("Cannot delete — branch is referenced by Invoices.");
    …

    return await base.RemoveAsync(id);
}
```

Two things that example teaches: an abstract base such as `InvoiceBase` must be
checked per concrete subtype, and each blocked delete gets its own specific
message so the user knows what to clear.

**Check:** filters before count · `AsNoTracking` on read · deterministic order ·
duplicate scope matches the business key and is tenant-scoped · Update excludes
self · every reference checked before Delete · base called when its remaining
behaviour is right · localized messages.

---

