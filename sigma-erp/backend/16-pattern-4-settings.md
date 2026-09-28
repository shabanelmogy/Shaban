## 16. Pattern 4 — Settings

> **Status: Canonical** — reference `Services/AdministrationsServices/ChargeSettingsService.cs`

A settings screen loads and saves a whole set. Do not force it into record CRUD.

The interface does **not** extend `IService`; it declares just the two real
operations:

```csharp
public class ChargeSettingsService : IChargeSettingsService
{
    private readonly IUnitOfWork<SiGmaDbContext> UnitOfWork;
    private readonly IStringLocalizer<GeneralMessage> Localization;
    private readonly IServiceHelper ServiceHelper;
    …
}
```

Define the **logical key** that identifies one setting. For Charge Settings it is
`(ModuleType, ChargeType, RateType)`. Collapse duplicates in the incoming
payload deliberately, then sync by that key:

```csharp
public async Task<Result> UpdateSettingsAsync(ChargeSettingsAddVM addVm, CancellationToken cancellationToken)
{
    if (addVm == null)
        return new Result { IsSuccess = false, Message = Localization["InvalidRequest"] };

    // Duplicate policy: deterministic last-wins on the logical key
    var distinct = addVm.ChargeSettings
        .GroupBy(x => (x.ModuleType, x.ChargeType, x.RateType))
        .Select(g => g.Last())
        .ToList();

    await ServiceHelper.SyncByKeyAsync<ChargeSettingsListVM, ChargeSettings,
            (ModuleType, ChargeTypes, RateTypeSettings)>(
        distinct,
        vm => (vm.ModuleType, vm.ChargeType, vm.RateType),
        e  => (e.ModuleType,  e.ChargeType,  e.RateType),
        cancellationToken);

    await UnitOfWork.SaveChangesAsync(cancellationToken);

    return new Result { IsSuccess = true, Message = Localization["SavedSuccessfully"] };
}
```

`ServiceHelper.SyncByKeyAsync` lives in
`Services/HelperServices/ServiceHelper.cs`. Read it before relying on it, and
confirm its query scope, delete-by-omission behaviour and save semantics match
the contract you intend.

**Verified 2026-09-28 — the snippet above is not what the reference does.**
`SyncByKeyAsync` loads every non-deleted row of the entity for the tenant
(`FindAllByAsync<TEntity>()`, no predicate) and deletes each one whose key the
payload omits. It therefore fits only a table that holds exactly one settings
set per tenant. The reference `ChargeSettingsService` no longer calls it: it
validates the whole request, loads the existing rows, deletes omitted keys and
extra legacy duplicates, updates matches, adds the rest, and saves once. Follow
that shape. When one table holds several sets partitioned by a dimension (for
example `LabourRateService`: the Default tariff plus one set per vehicle type),
run that reconciliation inside the set's own scoped query, and never call
`SyncByKeyAsync` for one partition, because it would delete every other set.

Decide explicitly and write it down:

| Decision | Options |
|---|---|
| Replacement or patch | Full replacement: an omitted key means delete. Patch: absence means leave alone. Never guess. |
| Empty list | Delete all, only when the API contract says so; otherwise reject. |
| Duplicate keys in payload | Reject as user error, or deterministic last-wins as above. |
| Missing settings on read | Empty response, seeded defaults, or calculated defaults. |

Return settings in a deterministic order so the UI is stable, and add a
tenant-scoped unique index on the logical key so duplicate rows cannot make
behaviour ambiguous. Make the sync atomic: a validation or save failure must
leave the previous set untouched.

### Settings references must stay selectable on read and write

When a setting maps to another entity, the predicate that defines a valid write
reference must also define what the user can select. For example, an accounting
mapping that requires a posting account must expose only posting accounts in its
lookup (`AllowChildren == false`) and must re-check that same predicate on Save.
Do not let the UI offer a value that the write contract will deterministically
reject.

Persisted settings can outlive the selectability of their target: a referenced
row may be deleted, deactivated, converted to a parent/non-posting account, or
otherwise stop satisfying the domain predicate. On read, do not echo that stale
id as though it were still a valid selected option and then let a whole-set Save
fail because the user never touched that row. Return the setting's logical key
but expose the stale target as **unselected/unlinked**, so the user can choose a
currently valid target and the next replacement save reconciles the stale
reference. The database is not mutated by this read normalization. Save still
validates every supplied id to protect against stale clients and races.

If clearing the stale target would hide information the user must explicitly
resolve, add a typed warning/error field to the read contract; do not weaken the
write validator or re-include invalid targets in the dropdown.

For a full-replacement settings contract, persisted duplicate physical rows may
exist from legacy code or a schema period before the unique index. Do not echo
those duplicates to the UI and then reject the unchanged full-set payload. Collapse
read rows to one deterministic logical row, keep request-side duplicate validation
strict for genuinely duplicated user input, and let reconciliation keep one stored
row while deleting the extra legacy rows in the same atomic Save. If the incoming
payload does not make the desired value unambiguous, fail with the duplicate key
details instead of guessing.

When legacy and canonical stored representations normalize to the same logical
key, the canonical representation wins deterministically even when its mapped
target is intentionally null/unlinked. A legacy value is only a read fallback
when no canonical stored representation exists. Normalize any type-specific
dimensions that are fixed by the contract (for example `BankAccounts` uses
`Value = null`, `JobType = null`, and `LinkSection = Default`) so the next full
replacement Save can reconcile the persisted row to canonical form.

Do not add caching for a settings review, and do not use client ids as ownership
or logical-key proof.

**Check:** logical key defined and validated · every key enum checked with
`Enum.IsDefined` · replacement vs patch documented · duplicate policy explicit ·
sync is tenant-scoped and atomic · one `SaveChangesAsync` · deterministic read
order · unique index on the key.

---

