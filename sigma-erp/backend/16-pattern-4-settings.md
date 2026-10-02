## 16. Pattern 4 — Settings

> **Status: Canonical** — owner decision 2026-10-01. Shared owner:
> `Services/HelperServices/ServiceHelper.cs` (`IServiceHelper`). References:
> `FieldsSettingsService` (single rows), `NotificationsSettingsModelService` and
> `EmailTemplateService` (several rows by key).

A settings screen saves settings, not records. Do not force it into record CRUD, and do not
write a save loop of your own: every settings service persists through `IServiceHelper` and
saves once. There are exactly **two shapes**:

| Shape | The screen | Save rule | Helper |
|---|---|---|---|
| **Single row** | one row of settings for the tenant (Common, Workshop, Account, Equipment, each block of Fields settings) | update the row; create it when it does not exist | `GetSingleAsync` / `UpsertSingleAsync` |
| **Several rows** | several rows of the same subject, each identified by a key (booking notifications by `Action`, email templates by `TemplateType`, charge settings by module/charge/rate type) | each incoming row updates the row with its key, or is added; rows not sent stay as they are | `UpsertByKeyAsync` |

Nothing is deleted by omission. A screen on which the user removes a settings row does it
with an explicit row Delete action (confirmation, UI block 9), not by leaving the row out of
the Save payload.

### Single row

A single-row setting derives from the shared bases (2026-10-01) and writes no code of its own:

```csharp
public interface IWorkshopSettingService
    : IService<WorkshopSettingAddVM, WorkshopSettingUpdateVM, WorkshopSettingDetailVM, WorkshopSettingListVM>,
      ISingleRowSettingsService<WorkshopSettingAddVM, WorkshopSettingDetailVM> { }

public class WorkshopSettingService
    : SingleRowSettingsService<WorkshopSettingAddVM, WorkshopSettingUpdateVM, WorkshopSettingDetailVM,
        WorkshopSettingListVM, WorkshopSetting>, IWorkshopSettingService
{
    public WorkshopSettingService(IUnitOfWork<SiGmaDbContext> unitOfWork, IMapper mapper,
        IStringLocalizer<GeneralMessage> localization, IServiceHelper settings)
        : base(unitOfWork, mapper, localization, settings) { }
}

public class WorkshopSettingController
    : SingleRowSettingsControllerBase<WorkshopSettingAddVM, WorkshopSettingUpdateVM, WorkshopSettingDetailVM,
        WorkshopSettingListVM, IWorkshopSettingService> { … }
```

- `GET {controller}/Mine` returns the tenant's row, or a success with no entity (the screen shows its defaults).
- `PUT {controller}/Mine` saves it: update, or create when it does not exist.
- The inherited `AddAsync` (legacy POST) is overridden to do the same, so an older client never adds a second row.
- Validation that the setting needs goes in a `SaveMineAsync` override that calls the base.
- Angular calls `getMine<Result<Dto>>()` and `saveMine<Result<Dto>>(payload)` from `BaseService` (UI block 2).

- The read returns the tenant's row, or `null`. The screen then shows its defaults; the read
  never inserts.
- The row is the **latest** one (`Id` descending), so legacy duplicate rows cannot make reads
  and writes land on different rows. The owner removes existing duplicates (decision
  2026-10-01). After that, a unique index on `SubscriptionId` (filtered `[IsDeleted] = 0`) is
  added per entity when its screen is reviewed, with the owner running the migration.
- The endpoints are *get* and *save* only. There is no list, add or delete endpoint for a
  single-row setting, and the Angular screen never lists rows, takes "the last one" or
  POSTs a new row on every save.
- `GetSingleAsListAsync` and `UpsertAsync(list)` keep the older list-shaped contract (a list
  with zero or one item) that `FieldsSettingsService` and the Fields screen use. New screens use
  the single-object methods.
- Every other service that needs the setting reads it through its owner (for example
  `ITaxPolicyService` for common tax settings), never with its own
  `Query<T>().FirstOrDefault()`.

### Several rows

```csharp
var saved = await ServiceHelper.UpsertByKeyAsync<RentalBookingNotificationListVM, RentalBookingNotification, BookingAction>(
    addVm.RentalBookingNotifications,
    x => x.Action,      // key of the incoming row
    x => x.Action,      // key of the stored row
    cancellationToken);
if (!saved.IsSuccess) return saved;   // nothing is saved
await UnitOfWork.SaveChangesAsync(cancellationToken);
```

- **Keys.** The key is the business key of one row. A composite key is a tuple:
  `x => (x.ModuleType, x.ChargeType, x.RateType)`.
- **Invalid keys.** An undefined enum key fails the whole call (`SettingsInvalidKey`) before
  anything is saved. When the payload repeats a key, the last row wins.
- **Partitioned rows.** A setting kept per partition (for example Labour Rate per vehicle type)
  passes `scope: x => x.VehicleTypeId == vehicleTypeId`, so only that partition's rows are
  matched.
- **One save.** A screen that saves several shapes at once (Fields, Notifications) calls the
  helper for each part and saves once at the end, so one failure saves nothing.

**Legacy — moved when the screen is reviewed.**
- **CRUD base:** about 68 settings services still expose the generic record CRUD
  (`Service<…>`). Settings screens verified 2026-10-01 (Angular screen → controller → service):

  | State | Screens (controller) |
  |---|---|
  | ~~Read the last row; POST adds a new row on every save~~ — **moved 2026-10-01** to `SingleRowSettingsService` + `getMine`/`saveMine` | Workshop, Broker, DDA, HRM, Limousine, Payment Gateway |
  | Read the last row; own Add/Update override that updates the first row | Cost Centers (`SettingsCostCentersModel`) |
  | Read the last row; saves with PUT only (first save when no row exists not verified) | API Key (`ApiKeySetting`) |
  | Own `GetMySetting` + POST or PUT | Common (`SettingsCommonModel`), Document Number (`SettingsDocumentNumberModel`) |
  | Already on `IServiceHelper` | Fields, Notifications, Email Templates |

  With the six screens moved, the owner can remove duplicate rows: no screen adds rows any more.
  The Limousine readers in `LimoQuotationService`/`TripBookingService` read the latest row too.
- **Own reconcile loops:** `ChargeSettingsService` and `LabourRateService` delete omitted keys
  in their own reconcile loop.
- **Own endpoints:** `SettingsCommonModel` and `SettingsDocumentNumberModel` have their own
  `GetMySetting` endpoints.

Each of these moves to the shape above in its review. The former
`ServiceHelper.SyncByKeyAsync` (delete by omission over the whole tenant table) was removed on
2026-10-01; it had no callers.

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
currently valid target and the next Save replaces the stale
reference. The database is not mutated by this read normalization. Save still
validates every supplied id to protect against stale clients and races.

If clearing the stale target would hide information the user must explicitly
resolve, add a typed warning/error field to the read contract; do not weaken the
write validator or re-include invalid targets in the dropdown.

Persisted duplicate physical rows may exist from legacy code or a period before the unique
index. The helper resolves them to the latest row for both read and write, so the screen never
shows duplicates and an unchanged Save never fails on them. The owner removes the extra rows
(decision 2026-10-01); a service does not delete them as a side effect of Save. Request-side
duplicate keys follow the helper rule (the last row wins).

When legacy and canonical stored representations normalize to the same logical
key, the canonical representation wins deterministically even when its mapped
target is intentionally null/unlinked. A legacy value is only a read fallback
when no canonical stored representation exists. Normalize any type-specific
dimensions that are fixed by the contract (for example `BankAccounts` uses
`Value = null`, `JobType = null`, and `LinkSection = Default`) so the next Save
updates the persisted row to canonical form.

Do not add caching for a settings review, and do not use client ids as ownership
or logical-key proof.

**Check:** shape chosen — single row or several rows · persisted only through `IServiceHelper`
(`GetSingleAsync`/`UpsertSingleAsync` or `UpsertByKeyAsync`) and one `SaveChangesAsync` · no
delete by omission; removal is an explicit row action · key is the business key, enum keys
validated by the helper, the `Result` checked before saving · partitioned rows pass `scope` ·
no list/add/delete endpoint and no "take the last row" Angular logic for a single-row setting ·
other services read the setting through its owner · unique index on `SubscriptionId` (single
row) or on the key (several rows) added when the screen is reviewed.

---

