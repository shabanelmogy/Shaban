# Job — Reference Feature Review

| | |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-09-30 |
| Scope | Workshop › Job, whole feature: list, editor (create/edit/view), Close Job, Labour Time, Time Logs; backend grid/list contract. Review, then owner: "نفذ كل الملاحظات وعدل guide" (F1–F10 implemented; F11–F12 recorded) |
| Goal | Owner: "نوصل ب jobs لاقصى نظام بحيث تكون مرجع قوى" — make Job the canonical list/editor reference |
| Guides | Master; UI blocks 1, 4, 5, 6, 8, 16, 17, 19, 22, 25, 28; Backend blocks 5, 15; slice 4 of `SHARED_FILTER_PANEL_MAINTENANCE_EVOLUTION_PLAN.md` |

## Already at reference level

| Area | Evidence |
|---|---|
| Page shell, filters, grid fill | Shared `sigma-list-*`, `form[appFilterPanel]` (mandatory Reset), `app-data-table [fill]`; no feature stylesheet |
| List queries | `Subject` + `switchMap` + `defer`, duplicate-query skip, both failure channels, route state restore/write (UI 28, 22) |
| Grid contract | `JobGridRowDto` = the 12 columns + `id`, `recordKey`, `recordType`, `status` (action state) — no dead fields; sort fields whitelisted and backend-confirmed (UI 5) |
| Delete | Shared confirmation with record label/number, busy guard, page step-back when the last row is removed (UI 9) |
| Close Job | Typed dialog, discard confirmation, local wall-clock dates, both failure channels, read-only tax rate (UI 13, 19) |
| Editor | Typed forms, dirty-discard confirmation, first-invalid focus, both failure channels on save/load, lookup failures visible (UI 12, 19, 22) |

## Findings

| # | Priority | Area | Finding | Evidence | Proposed fix | Guide |
|---|---|---|---|---|---|---|
| F1 | **High** | Editor dates | `dateAndTime` / `estimatedCompletionTime` are sent with `toISOString()` (UTC, `Z`). The backend has no date converter: it stores the UTC wall time and returns it without `Z`, and the browser reads it as local. In Dubai a job saved at 10:00 shows 06:00; the list date filter (local day bounds) misplaces jobs created 00:00–04:00. The same feature's Close Job, Lease and Accidents already send local wall-clock time | `editor.component.ts` `toApiDateTime`; `close-job.component.ts` `toLocalDateTime` comment "the job dates are stored the same way"; Lease `toApiDateTime` | Shared `shared/utils/api-date.ts`: `toApiDate(date)` (`yyyy-MM-dd`), `toApiDateTime(date)` (`yyyy-MM-ddTHH:mm:ss`, local), `fromApiDateTime(text)`; use in editor, Close Job and the list filter; extend UI block 17 from date-only to date-time | UI 17 |
| F2 | **High** | Editor vehicle card | `onVehicleChange` subscribes per change with no `error` handler and no cancellation: a failed call is silent and a slow earlier response can overwrite the vehicle just chosen | `editor.component.ts` `onVehicleChange` | `vehicle$` `Subject` + `switchMap`; error → clear the card and show a lookup message | UI 22, 28 |
| F3 | Medium | List columns | No **Status** column, although Status is the default filter (Open) and drives Edit / Close / Delete visibility | `initColumns()`; `JobGridRowDto.Status` already returned | Status column: badge `cellTemplate` + translated `value` fallback (Lubrication = Open); add `"status"` to the backend sort switch and the client whitelist | UI 5 |
| F4 | Medium | List formatting | Dates use `toLocaleString()` (browser locale; mixes digits/format with the app language); total uses `toLocaleString(undefined, …)` | `initColumns()` | `DatePipe` `dd/MM/yyyy HH:mm`, `DecimalPipe` `1.2-2` through the column `value` functions | UI 17, 5 |
| F5 | Medium | Export | Dates exported as raw ISO text; no Status; the error path reads `error.message` instead of the API body; "0 rows while the grid has rows" returns silently | `exportExcel()` | Export the same formatted values as the grid plus translated Status; `error?.error?.message`; show `job.errors.export` when nothing came back | UI 8, 22 |
| F6 | Medium | Editor labour types | Labour type options are a hard-coded string list with ids = array index, duplicating `JobLabourType` (the list builds them from the enum) — a new enum member silently desynchronises ids | `labourTypeOptions` | Build from `JobLabourType` exactly like the list (one helper) | UI 16 |
| F7 | Medium | Editor tax preview | Preview = `sum × rate / 100` unrounded; the backend rounds the subtotal and then the tax (`Job.RecalculateTotals`) — the preview can differ by cents from the saved total | `taxPreview` | Round the subtotal (`roundMoney`), then the tax (`TaxSettingsService.previewTax`), exactly like the backend | UI 19, BE 15 rule 8 |
| F8 | Low | Dialogs | `extractErrorMessage` is copied verbatim in Close Job, Labour Time and Time Logs | three components | `shared/utils/api-error.ts` `apiErrorMessage(error, fallback)` | Master 5 (no duplication) |
| F9 | Low | List sort | Sortable field whitelist is a second hand-written list next to `columns` | `onLazyLoad()` | Derive it from `columns.filter(c => c.sortable)` | UI 5 |
| F10 | Low | Editor | `lookupError` checks `staff` twice | `loadLookups()` | Remove the duplicate | — |
| F11 | Low (next stage) | Editor/dialog styles | Editor SCSS 349 lines, Close Job 199, Time Logs 148, Labour Time 94 — the editor page shell and dialog bodies repeat patterns seen across screens | component SCSS | Stage 2 of the shared-components plan (editor shell), not in this pass | UI 12, 13 |
| F12 | Low (record only) | Backend | Generic `JobListVM` (base `GET Job`) carries totals, notes and detail groups no screen shows; the UI uses `workshop-grid` | `JobListVm.cs` | Keep (the generic service needs a list type); trim when the base list endpoint is retired | AGENTS list-VM rule |

## Proposed implementation order

| Step | Findings | Files | Migration |
|---|---|---|---|
| 1 | F1 (shared date helpers + UI 17 date-time rule) | `shared/utils/api-date.ts`, Job editor, Close Job, list | None; existing test jobs saved in UTC stay shifted (test data) |
| 2 | F2, F6, F7, F10 | Job editor | None |
| 3 | F3, F4, F5, F9 | Job list (+ one backend sort case) | None |
| 4 | F8 | `shared/utils/api-error.ts`, three dialogs | None |
| — | F11, F12 | Recorded for later | — |

## Owner verification (after implementation)

Save a job at 10:00 → list and editor show 10:00; a job created at 01:00 appears under today's
date filter; switch vehicles quickly → the card shows the last one; Status column sorts and
shows Open/Closed; export has formatted dates and Status; tax preview equals the saved total.

## Implementation (2026-09-30)

| Finding | Change |
|---|---|
| F1 | `shared/utils/date-utils.ts`: `toApiDate`, `toApiDateTime` (local, no `Z`), `formatDisplayDate`; Job editor and Close Job send local wall-clock; list date filter uses `toApiDate` |
| F2 | Editor `vehicleLookup$` `Subject` + `switchMap`; card cleared while loading; `job.errors.vehicleDetails` on failure; saved vehicle fields shown only while that vehicle is selected (`showsSavedVehicle`) |
| F3 | Status column (`sigma-status-badge`, Open = success, Closed = neutral, Lubrication = Open) with translated `value`; backend sort `"status"` in `JobService` grid switch; `job.columns.status` (en/ar) |
| F4 | Grid dates `formatDisplayDate(…, true)` (`dd/MM/yyyy HH:mm`); totals `roundMoney` + 2 decimals |
| F5 | Export: same formatted values + translated Status; `apiErrorMessage`; zero rows while the grid has rows → `job.errors.export` |
| F6 | Editor labour type options built from `JobLabourType` |
| F7 | `roundMoney` added to `shared/utils/financial-number.util.ts`; tax preview = `previewTax(roundMoney(subtotal), rate)`, total = rounded subtotal + tax |
| F8 | `shared/utils/api-error.ts` `apiErrorMessage`; the three dialog copies removed |
| F9 | Sort whitelist derived from the sortable columns |
| F10 | Duplicate `staff` check removed |
| Shared | `sigma-status-badge` (+ `--success`/`--info`/`--warning`/`--danger`, light/dark) in `src/styles.scss` |
| Guide | UI 0.85: blocks 5, 16, 17, 19, 22, 28; skill pre-flight item + revision row; CHANGELOG; packets 8×OK |
