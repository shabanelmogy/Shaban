## 12. Activate and deactivate

> **Status: Canonical** — the base validates every target (2026-09-30)

`POST /<Entity>/handleActivate` maps to `HandleActiveAsync` and takes:

```csharp
public class ActiveVm
{
    public List<int> Ids { get; set; } = null!;
    public bool IsActive { get; set; }
}
```

The base implementation (`Service.HandleActiveAsync`, `virtual` since 2026-09-30) is a
validated bulk mutation — it checks every target before mutating any target:

- `Ids` null or empty → `ActivationNoRecords`;
- duplicate ids are collapsed;
- any id not found in the caller's tenant → `ActivationRecordsNotFound`, and nothing changes;
- success and failure messages are localized (`ActivationSucceeded`, `ActivationFailed`).

**Activation changes one field (2026-10-02).** Load every target tracked in the write
context, change `IsActive`, and call `UnitOfWork.SaveChangesAsync` directly. Do not call
`Repository.Update`/`UpdateRange` for these tracked rows: it marks unrelated scalar fields
modified and can overwrite another request's name or notes with an older snapshot. The
tenant-filtered load retains the original SubscriptionId concurrency value. An unchanged
active state is successful under the shared zero-change save contract (block 5). This does
not add a version check for concurrent changes to IsActive itself. Source-only correction;
owner concurrency verification pending.

Tenant and soft-delete scoping come from the repository, so a cross-tenant id counts as not
found. Override only for an entity rule, and call the base for the mutation:

```csharp
public override async Task<Result> HandleActiveAsync(ActiveVm activeVm)
{
    // Deactivating? Apply the same references Delete checks, when the entity requires it.
    if (activeVm is { IsActive: false, Ids.Count: > 0 } &&
        await UnitOfWork.Repository.ExistsAsync<Partner>(x => activeVm.Ids.Contains(x.BranchId)))
        return BusinessFailure("BranchDeactivateReferenced");

    return await base.HandleActiveAsync(activeVm);
}
```

Default rule: deactivation is allowed while the row is referenced (deactivating only removes it
from new selections). An entity that must block it overrides, as above, and records why.
`JournalVoucherService` and `OpeningBalanceServiceBase` still re-implement the interface
member explicitly (written before the base was virtual); move them to `override` when they are
next touched.

**Check:** `Ids` null and empty handled · duplicates collapsed · found count equals
requested count before mutating · deactivation rules stated relative to Delete ·
partial success never reported as success · tracked activation saves only changed IsActive
values without forcing full-row updates.

---
