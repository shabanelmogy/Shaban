# Labour Activities Feature Review

| | |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-09-28 |
| Request | "refactor : src\app\modules\Workshop\LabourActivities" with three screenshots; owner follow-up: "what is in the screenshot has priority" |
| Screen type | UI `ui/screens/01-list-with-modal-editor.md` (List + Modal) |
| Backend pattern | 1 Normal entity (`BranchService` reference) |
| Packets | All 8 stale at start (owner regeneration pending); canonical blocks used directly |

## Evidence

| ID | File | State | Metadata |
|---|---|---|---|
| E1 | `1.PNG` | List | Locale en, LTR, desktop; role, date, version Unknown |
| E2 | `2.PNG` | List with row action menu open | As E1 |
| E3 | `3.PNG` | Create dialog | As E1 |

### Functional Evidence Table

| Evidence | Classification | Required behaviour | Owning phase | Guide-compliant implementation |
|---|---|---|---|---|
| E1 title "Labour Activities / Manage Labour Activities" | Explicit | Page title and subtitle | 2 | `app-feature-title` inside the panel (UI 3) |
| E1 "Create New Labour Activity" | Explicit | Create action | 2, 3 | Primary action in the title slot opens the editor dialog (UI 3, 13) |
| E1 columns Name, Job Type | Explicit | Two display columns | 1, 2 | `app-data-table`; ListVM = `Id`, `Name`, `JobType` |
| E1 blank Job Type cells | Explicit | Job Type may be empty | 1 | `JobType?` nullable end to end |
| E1 pager, 10 per page, "1 - 10 of 13" | Explicit | Server paging, 10 default | 1, 2 | `GetManyAsync` override, size 10 clamped 1–100, `TotalCount` returned |
| E1 row order (alphabetical) | Strong inference | Deterministic order | 1 | `OrderBy(Name).ThenBy(Id)` |
| E1 column header chevrons | Uncertain | Sort/filter menu | — | Not implemented; columns not sortable (Master 2: a visible column does not prove sortable) |
| E2 View, Edit, Delete | Explicit | Three row actions | 2, 4 | Shared action list; Delete through `ConfirmationDialogService` (UI 7, 9) |
| E3 dialog "Create New Labour Activity", Name, Job Type dropdown, Cancel, Save | Explicit | Create editor | 3 | `app-editor-dialog` with typed form (UI 13) |

### Column Contract Table

| Visible label | Proposed field | Source DTO field | Display transformation | Filterable | Sortable | Exported | Confidence |
|---|---|---|---|---|---|---|---|
| Name | `name` | `LabourActivitiesListVm.Name` | none | Yes — kept existing name search | No | No | Confirmed |
| Job Type | `jobType` | `LabourActivitiesListVm.JobType` (new) | `labourActivities.jobTypes.<Key>` | No | No | No | Confirmed after the E4 decision |

Grid columns `name, jobType` ↔ ListVM `Id, Name, JobType` (plus the inherited `ListBaseVm` members).

## Decisions

| # | Decision | Evidence |
|---|---|---|
| D1 | **Conflicting → resolved.** Source had `Type : LabourType` (AirFilter…); screenshot shows Job Type with `JobType` values. Owner: the screenshot has priority. Added `JobType? JobType` (optional, E1 blank cells) to entity and VMs; removed `Type` from Add/Update/Detail/List VMs and the UI | Owner, 2026-09-28 |
| D2 | **Reviewer default (conservative).** Entity property `Type` and its column are **kept** so existing data is not destroyed; nothing reads or writes it. New rows get the enum default. Dropping it is a separate owner decision | No destructive change without instruction |
| D3 | Existing rows: `JobType` starts empty (null); no backfill, because `LabourType` values do not map to `JobType` | Master 2 rule 3 |
| D4 | Duplicate `Name` rejected on Add and Update (Update excludes self), name trimmed | Backend Pattern 1 (block 13) |
| D5 | Name input capped at 50 in the UI: `UpdateBaseVmWithName` allows 50 while `AddBaseVmWithName` allows 250 | Shared base VMs; see risks |
| D6 | Kept the existing name search as a compact filter strip; no Job Type filter (not shown, not existing) | Master 2 "Screenshots do not prove completeness" |
| D7 | Routed `details/:id` and `create` removed; Create/View/Edit open one controlled dialog | UI block 13 mandatory CRUD modal rule; E3 |
| D8 | View is read-only with no primary action (`[primaryActionVisible]` false in View) | Skill §7.2 / UI 15 |
| D9 | No manual success toast; the error interceptor owns mutation toasts | UI backlog 31 |
| D11 | **Owner feedback 2026-09-28:** editor body had no padding (fields touched the dialog edge). Root cause: `app-editor-dialog` sets the body padding to 0 and every consumer padded itself. Fixed with the shared opt-in `[contentPadded]`, enabled here; rule added to UI block 13 *Body padding*, backlog 36, and skill §7 4a | Owner screenshot `4.png` |
| D12 | **Owner runtime report 2026-09-28:** Edit threw `SubscriptionId cannot be changed for existing LabourActivities records` (`Repository.ProtectTenantOwnershipForWriteGraph`). Cause: the Update map copied `UpdateBaseVm.SubscriptionId` (0, not sent by the client) onto the tracked entity. Fixed: Update map ignores `SubscriptionId` and `No`, per backend block 4 and backlog 2. The skill digest lacked the rule; added to §8.2 item 5 and the §10 checklist | Owner stack trace |
| D10 | Delete: no entity references `LabourActivities` (no FK found), so the base `RemoveAsync` is used | Source search |

## Files changed

Frontend (`SiGmaAngularFrontEnd`): `Workshop/LabourActivities/` routes, models (`list`, `details`, `create`), service, list component (ts/html/scss), details → `LabourActivityEditorComponent` (ts/html/scss/spec); `i18n/vocabs/en.ts`, `ar.ts` (`labourActivities` block; Arabic block was missing before).

Backend (`SigmaBackend`): `SiGma.Helpers/Models/LabourActivities.cs`; `LabourActivitiesAddVm`, `UpdateVm`, `DetailVm`, `ListVm`; `LabourActivitiesProfile.cs` (four one-way maps, `ReverseMap` removed); `LabourActivitiesService.cs` (`GetManyAsync`, `AddAsync`, `UpdateAsync`).

## Migration

**Owner must run `Add-Migration`**: new nullable `int` column `JobType` on `LabourActivities`. No column removed.

## Suggested names (Master block 7)

```text
Backend migration:  Add-Migration AddJobTypeToLabourActivities

SigmaBackend (stage only the seven LabourActivities files listed above):
feat(labour-activities): add optional job type and paged name search

- JobType? on entity and Add/Update/Detail/List VMs; legacy Type kept, not exposed
- GetManyAsync with name search, TotalCount, page size 10 clamped 1-100
- duplicate name rejected on add and update; ReverseMap removed
- update map ignores SubscriptionId and No (fixes tenant guard on edit)
- requires migration AddJobTypeToLabourActivities

SiGmaAngularFrontEnd (commit 1 — shared shell, editor-dialog.component.{ts,html,scss}):
feat(editor-dialog): add opt-in contentPadded body inset

- body lines up with header and footer; off by default, existing editors unchanged

SiGmaAngularFrontEnd (commit 2 — LabourActivities files, en.ts, ar.ts):
refactor(labour-activities): move to shared list and editor dialog

- app-feature-title, compact name filter, app-data-table with server paging
- Create/View/Edit in one app-editor-dialog; routed details/create removed
- job type column and optional dropdown; en/ar translations
```

## Risks and owner verification

- Not compiled. Check: `LabourActivityEditorComponent` rename (spec updated); `pTemplate` inside `p-dropdown`; `JobType? JobType` member naming in the entity and VMs.
- `LabourActivitiesFullListVm` still declares `Type`; it has no mapping or consumer and was left untouched.
- Shared base VM name limits differ (Add 250 / Update 50); a name longer than 50 created elsewhere cannot be updated. Shared base, out of scope.
- Manual checks: list loads 10 rows sorted by name; search by name; paging; Create with and without Job Type; duplicate name message; View is read-only; Edit saves; dirty close asks to discard; Delete confirms and refreshes; Arabic/RTL and dark theme; the page never scrolls, grid rows scroll and the paginator stays at the bottom.
