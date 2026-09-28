## 12. Activate and deactivate

> **Status: Transitional** — the base does not validate its targets, see below

`POST /<Entity>/handleActivate` maps to `HandleActiveAsync` and takes:

```csharp
public class ActiveVm
{
    public List<int> Ids { get; set; } = null!;
    public bool IsActive { get; set; }
}
```

The base implementation:

```csharp
public async Task<Result> HandleActiveAsync(ActiveVm activeVm)
{
    var entities = (await UnitOfWork.Repository
        .FindByAsync<TEntity>(a => activeVm.Ids.Contains(a.Id))).ToList();

    entities.ForEach(a => a.IsActive = activeVm.IsActive);
    UnitOfWork.Repository.UpdateRange(entities);
    var result = await UnitOfWork.SaveChangesAsync();
    …
}
```

Tenant and soft-delete scoping come from the repository, so cross-tenant ids
cannot be flipped — they are simply not returned.

**Two defects.** This is a bulk mutation, and the rule for any bulk operation is
that it validates every target before mutating any target:

1. **Partial success reported as success.** Send five ids where three exist and
   the call activates three and returns success. The caller cannot tell.
2. **No null guard.** `Ids` is declared `null!`, so an omitted `Ids` throws inside
   `Contains` rather than returning a validation failure.

Override when the entity's active state matters:

```csharp
public override async Task<Result> HandleActiveAsync(ActiveVm activeVm)
{
    if (activeVm?.Ids is not { Count: > 0 })
        return Fail("No records were supplied.");

    var ids = activeVm.Ids.Distinct().ToList();

    var entities = (await UnitOfWork.Repository
        .FindByAsync<Branch>(a => ids.Contains(a.Id))).ToList();

    if (entities.Count != ids.Count)
        return Fail("One or more records were not found.");

    // Deactivating? Check the same references Delete checks.
    if (!activeVm.IsActive)
        foreach (var id in ids)
            if (await UnitOfWork.Repository.ExistsAsync<Partner>(x => x.BranchId == id))
                return Fail("Cannot deactivate a branch that is referenced by Partners.");

    entities.ForEach(a => a.IsActive = activeVm.IsActive);
    UnitOfWork.Repository.UpdateRange(entities);
    …
}
```

Deactivation is a soft form of removal, so if a row cannot be deleted while
referenced, decide explicitly whether it can be deactivated while referenced.

Backlog item 16.

**Check:** `Ids` null and empty handled · duplicates collapsed · found count equals
requested count before mutating · deactivation rules stated relative to Delete ·
partial success never reported as success.

---

