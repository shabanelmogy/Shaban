# Labour Tariff Feature Review

| | |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-09-28 |
| Request | "refactor : src\app\modules\Workshop\JobLabour"; then "correct route name to LabourTarriff and complete with screens shoot", "rename folder name in front end", and the two correct screenshots (`8.png`, `9.png`) |
| Screen type | UI `ui/screens/06-tabbed-settings-workspace.md` (tabbed settings workspace with an editable collection, UI block 14) |
| Backend pattern | 4 Settings (reference `ChargeSettingsService`) |
| Packets | `-Check` 8 × OK before and after the guide update |

## Evidence

| ID | File | State | Metadata |
|---|---|---|---|
| E0 | `5.png`–`7.png` | Labour Activities list and dialog | **Conflicting** — a different feature; not used |
| E1 | `8.png` | Labour Tariff, Default tab, five rows | Locale en, LTR, desktop; role, date, version Unknown |
| E2 | `9.png` | Labour Tariff, Vehicle Type Wise tab, vehicle type selected, one empty row | As E1 |

### Functional Evidence Table

| Evidence | Classification | Required behaviour | Owning phase | Guide-compliant implementation |
|---|---|---|---|---|
| E1 "Labour Tariff / Manage Labour Rate" | Explicit | Title and subtitle | 2 | `app-feature-title` in the panel (UI 3) |
| E1/E2 tabs Default, Vehicle Type Wise | Explicit | Two tariff sets | 1, 3 | `app-editor-tabs appearance="workspace"` |
| E2 "Vehicle Type" dropdown above the rows | Explicit | Vehicle type selects the set; it is not a row column | 1, 3 | Compact filter strip (UI 4); rows load per vehicle type |
| E1 columns Staff Profile, Activity, Time (mins), Cost | Explicit | Four editable row fields | 1, 3 | `app-editable-collection-table` (UI 14) |
| E1 red × per row | Explicit | Remove a row | 3 | Shared Remove plus confirmation; persisted on Save |
| E1 "Add Row" | Explicit | Add an empty row | 3 | Shared Add action (position owned by the component) |
| E1/E2 Save | Explicit | Save the set | 3 | `app-primary-action-button` in the title slot; full replacement of the set |
| E2 Save shown disabled on an empty row | Strong inference | Save blocked while a row is incomplete | 3 | Save validates and focuses the first invalid cell (UI 19) |

## Decisions

| # | Decision | Evidence |
|---|---|---|
| D1 | Route `/JobLabour` → `/LabourTariff`; folder `Workshop/JobLabour` → `Workshop/LabourTariff`; `labourtariff.routes.ts` / `LabourTariff_Routes`. "Tarriff" in the request read as "Tariff" (menu label) | Owner |
| D2 | Screen type 06 + UI 14; backend Pattern 4. Old screen was a hand-built form array with immediate per-row delete | Catalog question 3 |
| D3 | Tariff set = Default (no vehicle type) or one vehicle type. Default scope: `VehicleTypeId == null && LabourType != VehicleTypeWise`; vehicle scope: `VehicleTypeId == id`. `LabourType` normalised on write | E1, E2; stored rows came from the old `EditList` with `LabourType` set |
| D4 | Logical key inside a set: `(StaffProfileId, WorkshopActivityId)`. Duplicate keys **rejected** (UI alert + server `LabourRateDuplicateRow`), not last-wins: every row is edited on screen | BE 16 duplicate policy |
| D5 | Full replacement per set: omitted keys are soft-deleted; empty list allowed (each removal was confirmed) | BE 16 |
| D6 | Legacy duplicate rows collapse on read to the lowest Id and are removed on the next Save | BE 16 |
| D7 | Stale references (deleted staff profile or activity) are returned as null so the user picks a valid one; Save re-checks existence in the tenant — the same predicate as the `GetSelect` lookups | BE 16 "Settings references must stay selectable" |
| D8 | `SyncByKeyAsync` **not used**: it reads and delete-by-omits the whole tenant table, so saving the Default set would delete every vehicle set. Reconciliation runs in the set's scoped query, one `SaveChangesAsync` | `ServiceHelper.cs:91`; guide updated (below) |
| D9 | Validation: staff profile and activity required; time whole minutes ≥ 0; cost ≥ 0 (old inputs had `min="0"`) | Reviewer default, source-supported |
| D10 | Lookups use the existing `GetSelect` endpoints (UI 16); the unused `Lookups` endpoint is removed | UI 16 |
| D11 | Tab or vehicle-type change and route exit with unsaved rows ask to discard (UI 10); rows and vehicle type are disabled while saving | UI 10, 28 |
| D12 | `subscriptionId` is no longer sent; the tenant is server-owned | Skill §8.2 item 5 |
| D13 | Unique index on the logical key **not added**: it needs a migration and may fail on existing duplicates. Owner decision | BE 16 check list; open |
| D14 | The Arabic `sideMenu.workshops` block and `sideMenu.workshop` were missing (the menu showed English); added | UI 23 |

## Contract (frozen and implemented)

```text
GET  LabourRate/Tariff[?vehicleTypeId=]  → Result<LabourRateRowVM[]>
PUT  LabourRate/Tariff  { vehicleTypeId: int?, rows: LabourRateRowVM[] } → Result
LabourRateRowVM { staffProfileId: int?, workshopActivityId: int?, timeInMinutes: int?, cost: decimal? }
```

Removed endpoints (no other consumer found): base CRUD from `SiGmaControllerBase`, `EditList`, `GetLabours`, `Lookups`, `Bulk`, `Vehicle/{id}`, `Vehicle/Bulk`.

## Files changed

Backend (`SigmaBackend`): `ILabourRateService.cs`, `LabourRateService.cs`, `LabourRateController.cs`, `LabourRateProfiler.cs` (now empty), `LabourRateRowVM.cs`, new `LabourRateSaveVM.cs`, `GeneralMessage.resx` and `GeneralMessage.ar-SA.resx` (six `LabourRate*` messages).

Frontend (`SiGmaAngularFrontEnd`): `Workshop/LabourTariff/` (moved from `JobLabour`; new `models/labour-tariff.ts`, `services/labour-tariff.service.ts`; rewritten component ts/html/scss; routes with the discard guard); `pages/routing.ts`; `sidebar-menu.component.ts`; `layout.module.ts` (`LabourTariffService` provider); `en.ts`, `ar.ts` (`jobLabour` → `labourTariff`; Arabic side menu).

Documentation: backend block 16 (verified `SyncByKeyAsync` scope; reference no longer uses it), backend 0.18, `CHANGELOG.md`, skill §8.1 item 4 and history row; packets regenerated.

## Owner actions

- **Delete dead files** (the agent was not permitted to delete):
  - Backend `SiGma.ViewModels/ViewModels/LabourRate/`: `LabourRateAddVM.cs`, `LabourRateUpdateVM.cs`, `LabourRateDetailVM.cs`, `LabourRateListVM.cs`, `LabourRateLookupsVM.cs`, `VehicleLabourRateBulkRequestVM.cs`, `LabourActivitiesDeleteVm.cs`; optionally the now-empty `LabourRateProfiler.cs`.
  - Frontend `Workshop/LabourTariff/`: `enums/labourType.ts`, `models/create.ts`, `services/joblabour.service.ts`.
- **No migration**: no entity or EF configuration changed. D13 would need one later.

## Suggested names (Master block 7)

```text
SigmaBackend:
refactor(labour-rate): labour tariff as a settings set per vehicle type

- GET/PUT LabourRate/Tariff replace the CRUD, EditList, Bulk and Lookups endpoints
- full replacement per set; duplicate staff+activity rejected; stale references returned unselected
- scoped reconciliation, one save; tenant no longer taken from the client
- six LabourRate messages in en and ar resources

SiGmaAngularFrontEnd:
refactor(labour-tariff): rename route and folder, move to settings workspace

- /JobLabour -> /LabourTariff, Workshop/JobLabour -> Workshop/LabourTariff
- editor tabs, vehicle type filter, shared editable collection table, confirmed remove
- discard guard on tab, vehicle type and route exit; labourTariff translations; Arabic side menu
```

## Risks and owner verification

- Not compiled. Check: `NonNullableFormBuilder.control<number | null>` typing; `p-dropdown [ariaLabel]`; generic `let-control` typing in the row template; `SiGma.Helpers.Models.Vehicles.VehicleType` resolution.
- Rows stored as `VehicleTypeWise` with no vehicle type belong to no set; they stay in the table, invisible.
- Any external client of the removed endpoints breaks (none found in the Angular app).
- Manual checks: Default loads stored rows in insertion order; Add Row, fill, Save, reload; remove asks, Save deletes; duplicate staff+activity shows the alert and blocks Save; Vehicle Type Wise shows the prompt until a vehicle type is chosen; switching tab or vehicle type with edits asks to discard; route exit with edits asks; a deleted staff profile shows as empty and flagged; Arabic/RTL (side menu now Arabic), dark theme; the page never scrolls, only the rows frame.
