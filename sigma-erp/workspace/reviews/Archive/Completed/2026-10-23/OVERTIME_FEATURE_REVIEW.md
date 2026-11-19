| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

# Overtime feature review

## Scope

Frontend `SiGmaAngularFrontEnd/src/app/modules/HRM/Overtimes/Overtime` and its direct Overtime API/service. The supplied images are functional/content evidence only.

## Evidence

| Evidence | Classification | Supported behavior | Phase |
|---|---|---|---|
| `1.PNG` | Explicit visible content | Overtime list has a Date Range filter, Search action, grid, and Process Overtime entry point. Visible columns read From, To, Status, Approved By. | 0/2 |
| `2.PNG` | Explicit visible content | Process Overtime opens a month form with Process and Import actions. | 0/4 |
| Existing backend | Confirmed source | `GET /Overtime` returns CRUD overtime rows; `Staff/Overtime` provides month/staff daily overtime read/write. | 1/5 |

## Shape and references

- UI type: screen 01 list with routed editor for the existing CRUD record; the process action is a separate existing `StaffOverTime` workflow.
- Canonical references: `Workshop/Job/components/list` for list shell/filter/grid; shared `editor` shell conventions for routed details; `Staff/StaffOverTime` for the supported overtime processing workflow.
- Backend pattern: normal entity (backend pattern 1) with list filter hooks and projected list rows.
- Applied packets: `PHASE-00-discovery-evidence`, `PHASE-01-domain-api`, `PHASE-02-read-grid`, `PHASE-03-detail-write`, `PHASE-04-domain-actions`, `PHASE-05-integration-runtime`, `PHASE-06-final-reconciliation`. Packet check passed before use.

## Contract decisions

| Concern | Decision | Evidence/status |
|---|---|---|
| List fields | Staff, Month, Code, Designation, Normal OT Hours, Holiday OT Hours, Total OT Hours, Overtime Rate, Overtime Amount | Backend `OvertimeListVM`; screenshot's From/To/Status/Approved By have no producer. |
| Date filter | `fromDate` and `toDate` against persisted `Overtime.Month` | New backend list filter hook; bounded and source-supported. |
| Process | Navigate to `/StaffOverTime`, the existing month/staff process editor | Supported source workflow; no batch-process endpoint exists. |
| Import | Not implemented | Missing API, payload, validation and persistence contract. |
| Permissions | Authenticated route only | App has `AuthGuard` but no authorization mechanism. |
| Derived values | Overtime totals/rate/amount remain server-owned; add/update payload excludes audit and derived fields | Existing backend entity/VMs and backend pattern rules. |
| Default range | Current calendar month | UI block 17 currentMonthRange rule; screenshot date values are historical display evidence, not a frozen default. |

## Unresolved requirements

| Requirement | Status | Required owner decision |
|---|---|---|
| Batch Process Overtime modal/action | Missing | Define endpoint, month-only semantics, affected staff, state transition and failure/replay behavior. |
| Import action | Missing | Define file format, payload, validation, duplicate policy and persistence endpoint. |
| From/To/Status/Approved By columns | Conflicting | Add producer fields and business rules or confirm source-supported CRUD columns. |

## Verification boundary

Source-only review and diff checks are allowed. Build, tests, lint, migration, database, browser and runtime verification remain pending for the owner.

## Current reconciliation — 2026-10-10 continuation

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

This dated section supersedes the preceding substitute-navigation, blocked-import and missing-producer conclusions. The earlier review remains historical. The owner asked to complete the missing behavior as far as possible and review the business cycle at the end. The changed Frozen handoff was recorded in OVERTIME_FRONTEND_CONTRACT_FREEZE.md before implementation; its persistence clarification records the final day-key precision/index decisions. OVERTIME_MAINTENANCE_EVOLUTION_PLAN.md consolidates that plan and impact map.

### Delivered behavior and business boundary

The existing /Overtime route now defaults to monthly processing history and offers a daily-records tab. Process Overtime opens a Month dialog with Process and CSV template/file/preview/Import rows. Daily Create/View/Edit and the existing Staff Overtime entry remain available. Process summarizes the current saved daily records; each deliberate run appends an immutable summary. Import adds only new staff/day records after validating the whole batch. The service owns hour totals, historical/effective rates and rounded amounts.

Approval authority and attendance-derived calculation are not established by the screenshots/source. Approved By is empty, status is Processed, and no overtime approval action, automatic repricing, payroll/JV write or disbursement was added. Payroll continues consuming the existing daily amounts; the new monthly table is an operational summary, not a posting document. These choices need business-cycle acceptance, not an invented state transition.

### Functional evidence

| Evidence | Classification | Implementation/decision |
|---|---|---|
| 1.PNG: Overtimes, Date Range, Search, From/To/Status/Approved By, Process Overtime | Explicit | Shared list/filter/table; monthly runs provide the four visible fields. Approved By has no source-defined value. |
| 1.PNG: range selects periods represented by From/To | Strong inference | Monthly range intersection; daily range is inclusive day filtering. |
| 2.PNG: Month, Process, Import, close | Explicit | Shared controlled Month dialog, process command, shared CSV template/parser with preview/import, guarded close. |
| Processing recalculates attendance or replaces daily rows | Uncertain | Not done. A snapshot of the established daily source is the conservative recorded decision. |
| Import file format/replacement policy | Uncertain in screenshot; reviewer decision under owner continuation | Exact StaffId,Date,OvertimeMinutes CSV; strict dates in chosen month, positive whole minutes, 1–1000 rows; new-only atomic import. |
| Approval states, approver selection/permissions, payment | Missing business contract | Empty approver; no action or access claim. Full-cycle review remains pending. |
| Effective overtime salary/date/category/amount formula | Confirmed source | Shared extraction from StaffService retains Friday/Saturday/configured holidays, effective salary package and designation fallback, AwayFromZero rounding. |

Screenshots supplied content and action evidence; shared Sigma components own appearance, RTL, themes and responsive bounds. The screenshot's literal historical date range is not a default-date contract.

### Selected shapes and final source conformance

| Concern | Owning book | Approved reference/symbol | Shared owner | Final match or justified difference |
|---|---|---|---|---|
| Route/list bounds, title | UI1/3/6 | Workshop/Job/components/list | sigma-route-host, list panel, FeatureTitle, DataTable fill | Same bounded chain; title/actions inside primary panel, fixed filters/pager, row scroll owner. |
| Filters and applied state | UI4/17/19/28 | Job list; parseDateRange/currentMonthRange/resolveListPaging | FilterPanel, DatePicker, FieldError, date/query utils | Required typed range defaults to current month. Search applies; paging/retry/export retain the applied snapshot. switchMap cancels stale reads. |
| Grid/export | UI5–8/23 | Job list; dataTableExportRows/fetchAllPages | DataTable and export/query helpers | Real totalCount, correct types/sorts, complete active-tab export, language resolved at export time. |
| Monthly/daily tabs | UI13/27 | shared EditorTabsComponent | EditorTabs | Public workspace appearance, translated aria label, matching panel IDs. No feature tab styles. |
| Daily editor shape | UI13 D4-2/15 | Workshop/Job/components/editor | Routed sigma-editor shell | Screen02 selected because it displays authoritative totals/rate/amount. Create/View/Edit use the same routed editor; no duplicated modal editor. |
| Small month action | UI11/13/22/28, screen09 | Workshop/Job/components/close-job; shared EditorDialog | EditorDialog, confirmation service, freezeFormState | Month dialog with preview, public bounds/padding/footer, deferred dirty-close and route-exit guards. Invoice/close-job business is not copied. |
| Inputs/View | UI16/17/19/27 | shared date and scalar validators; view mode | DatePicker, FieldError, MoneyPipe, NumericFocus | Full day retained in Month; required finite nonnegative hours; bounded strings; View skips selectable-staff load and renders saved staff name. |
| Confirmation/failure lifecycle | UI9/10/22/28 | ConfirmationDialogService; apiErrorMessage | Shared confirmation/error/form helpers | Freeze during confirmation/mutation, cancellation/identity checks, both failure channels, one inline error owner and root success feedback. |
| CSV preview lifetime | UI22 | shared ImportCsvComponent | Same shared parser/template | Additive parsingChanged/fileFailed/reset; old fileImported compatibility retained; no private parser fork. Angular17 onDestroy flag ignores late callbacks. |
| Backend daily read | BE5/7/9/13 | generic Service.ApplyListFilters/MaterializeListAsync | Generic service/repository | Inherited list/count/order, inclusive date hooks and lean ProjectTo. Redundant controller GET override removed. |
| Write/calculation | BE3–5/8/18 | StaffService overtime methods; generic UOW guard | StaffOvertimePolicy, ExecuteUniqueWriteAsync | Explicit validated writes justify overrides. Same tenant/Staff guard covers daily CRUD, process/import and existing Staff overtime writer. |
| Operational history | BE2/3/5/6/9/18 | generic tenant repository, result wrappers | Repository/UOW/ToActionResult | Separate immutable operational entity with explicit paged read and single-save action; no generic history CRUD. |
| Providers/routes | UI1/2/26, phase05 | pages/routing.ts; root app module/AuthGuard | Root HttpClient, BaseService | Existing lazy route/auth entry, root OvertimeService; two redundant LayoutModule providers removed. |
| User guide | Master7 | UserGuide reader/topic models; HRM_GUIDE | Existing guide reader/menu | Updated Overtime topic only; bilingual steps reflect final routes/validation and limits. |

Source conformance is not proof of visual, keyboard, browser or compilation acceptance.

### Grid ↔ frontend ↔ backend DTO

| Grid order (type) / action need | Frontend property | Backend property |
|---|---|---|
| Daily Actions first; identity | id | OvertimeListVM.Id |
| Staff (text) | staff.name | Staff.Name (OvertimeStaffListVM: Id,Name only) |
| Date (date) | month | Month |
| Code (text) | code | Code |
| Designation (text) | designation | Designation |
| Normal hours (number) | normalOTHours | NormalOTHours |
| Holiday hours (number) | holidayOTHours | HolidayOTHours |
| Total hours (number) | totalOTHours | TotalOTHours |
| Rate (money) | overtimeRate | OvertimeRate |
| Amount (money) | overtimeAmount | OvertimeAmount |
| Run identity, no row mutations | id | OvertimeProcessRunDto.Id |
| From (date), To (date) | from, to | From, To |
| Status (translated text), Approved By (empty text) | status, approvedBy | Status, ApprovedBy |
| Records, Employees (number) | recordCount, staffCount | RecordCount, StaffCount |
| Total hours (number), Total amount (money) | totalHours, totalAmount | TotalHours, TotalAmount |

Daily ListVM exactly: Id, Staff{Id,Name}, Month, Code, Designation, NormalOTHours, HolidayOTHours, TotalOTHours, OvertimeRate, OvertimeAmount. Run DTO exactly: Id, From, To, Status, ApprovedBy, RecordCount, StaffCount, TotalHours, TotalAmount. Removed daily ListVM StaffId and inherited No/SubscriptionId/GUID/audit/deletion/activation/validation/change members; oversized StaffDetailVM replaced with two-field staff display DTO. Unconsumed OvertimeFullListVM removed. Status/ApprovedBy do not offer sort because no changing approval state exists; stored date/count/hour/amount fields sort with deterministic Id tie break.

### Filters, routes, paging and export

| Control/state | Transport | Backend owner | Behavior |
|---|---|---|---|
| Date range | Filters[fromDate], Filters[toDate], yyyy-MM-dd | Daily ApplyListFilters; run read | Current-month default; required valid ordered pair; inclusive daily dates, overlapping monthly periods. |
| Paging | pageNo/pageSize | Inherited daily normalization; run normalization | 1-based, size max100, exact CountAsync metadata. Run defaults to page1/size10 if omitted; frontend always supplies both. Large run offsets use long before bounds check. |
| Sort | Filters[sortField], Filters[sortOrder] | Daily generic stored/reference-name sort; run allowlist | -1 descending, 1 ascending. Derived status/empty approver not sortable. |
| Applied state | URL tab/fromDate/toDate/pageNo/pageSize/sortField/sortOrder | readListRoute/writeListRoute | Editor return/paging/retry/export use last Search, not draft controls. |
| Export | Repeated pages of size100, same applied filters/order | fetchAllPages; active typed columns | Full matching rows; partial/failed page rejects export, inline error; filters/routes blocked during export. |
| /Overtime | list route | Existing lazy entry + list canDeactivate | Monthly default; guard delegates pending/dirty process dialog. |
| create, view/:id, edit/:id | explicit route data | Daily details + canDeactivate | Pristine/View silent exit, dirty confirm, mutation/confirmation exit blocked. |
| details/:id | legacy link | explicit View | Compatibility retained, read-only. |
| /StaffOverTime | existing monthly staff editor | Existing source route | Separate secondary action, unchanged business. |

Absent/empty date keys are tolerated by backend direct reads; the UI requires both. Zero hours are valid, negative/NaN/nonfinite are invalid. There are no boolean, enum or multi-select filters to invent. Date parse failure does not silently truncate a day into month start.

### Detail and editable contracts

| Field | Form / frontend | Detail DTO | Add/Update | Ownership and validation |
|---|---|---|---|---|
| Identity | route id number | Id | Update Id only | Server identity; invalid/missing detail blocks mutation. |
| Employee | nullable number, required int32/positive/current selection | StaffId nullable for legacy rows; Staff{Id,Name} | StaffId positive | Tenant/live FK checked on server; lookup failure blocks save and has Retry. View uses saved name. |
| Code/Designation | strings, max100, trimmed; empty→null | Nullable text | Nullable max100 | Client editable; server validation repeated. |
| Date | Date/string/null, full real day | Month DateTime | Required nullable DateTime Month | Nullable input detects omission; server normalizes only time to day. Chosen staff/day unique, excluding self. |
| Normal/Holiday hours | number/null, required finite/min0 | Decimal hours | Nonnegative decimal with storage bound | Must match weekday/holiday category; positive hours cannot precede joining. |
| Total/Rate/Amount | saved read-only values | Persisted authoritative totals | Omitted | Backend owns sum, effective/historical rate, rounded amount. Edit explicitly labels figures as last saved values. |

No tenant, document number, audit, deletion, approval, computed total/rate/amount is accepted as an editable input. Import inputs are month plus staffId/date/overtimeMinutes only. CSV preview is a command batch, not an aggregate replacement snapshot; omitted daily rows are not removed.

### Actions and reference inventory

| Reference action | Target classification | Reason |
|---|---|---|
| Job list Create/View/Edit | Supported | Existing daily entity supports these modes and typed routes. |
| Job Delete | Supported in daily View | Existing delete endpoint; shared confirmation, dependency check and applied-list return. |
| Job Search/Reset/Export | Supported | Daily and monthly read contracts and complete export. |
| Close-job dialog open/retry/submit/close/escape | Supported interaction | Shared controlled month dialog; failed process/import stays open for correction/retry. |
| Job labour time, quality check, logs, estimation, invoice, close/cancel | Not Applicable | Overtime has no Job/vehicle/time-log/invoice aggregate or job state transition. Monthly history is its own operational record. |
| Close-job invoice charge lines/vehicles/steps/add-remove lines/previous | Not Applicable | No invoice or vehicle collection exists in the overtime month command. |
| Overtime Process/Import | Supported from screenshots/owner continuation | New complete slices below. |
| Approve/Pay/Post/Activate history | Not Applicable to the chosen source-supported cycle | No authority/payment/posting contract for overtime snapshots; no action promised. |

| Action | Source→target state | API/service slice | UI/dependency/concurrency/failure/refresh |
|---|---|---|---|
| Daily Add | No staff/day→one valid daily row | POST Overtime; IOvertimeService/AddAsync | Typed editor, current staff required; Staff write lock, server calculation and duplicate check; both failure channels inline; success root toast and applied-list return. |
| Daily Update | Saved daily row→validated same row | PUT Overtime with Id + editable inputs; UpdateAsync | Saved rate retained for same staff/day; unchanged hours preserve nonnegative amount snapshot; moved staff/day resolves effective rate; dirty/form freeze and same lock; success returns list. |
| Daily Delete | Live row→soft deleted | DELETE Overtime?id; RemoveAsync→RemoveWithChildrenAsync | Shared confirmDelete; tenant/dependency checked; same Staff lock; errors inline, success returns last applied list. |
| Process | Valid live month rows→new immutable Processed summary | POST Overtime/process {month:yyyy-MM}; ProcessAsync | Month input; rejects empty month, duplicate days, negative/inconsistent hours/amounts and missing price. Same Staff lock, one save. No input rows rewritten. Refresh monthly tab with applied filters. |
| Import | Valid 1–1000 new keys→new daily rows | POST Overtime/import {month,rows:[{staffId,date,overtimeMinutes}]}; ImportAsync | Exact template/strict dates/int32/minutes/month/duplicate preview. Server validates all references/keys/calculations before attaching, bulk source queries, one save and same lock. Invalid or existing key rejects whole batch. Refresh daily tab with applied filters. |
| Discard | Editable unsaved state→exit only after decision | Local ConfirmationDialogService | Deferred, form/preview freeze and session/identity guards; menu/back/escape covered, repeated close/mutation blocked. |

No inbound OvertimeId FK was found in scoped staff entities. The inherited repository checks actual EF inbound references on deletion rather than bypassing usage rules. Existing payroll snapshots read/copy daily amounts, not a direct daily-row delete relationship.

Authorization candidates for a future real permission mechanism: daily POST/PUT/DELETE, POST process and POST import. Currently AuthGuard/authenticated API apply; visible/disabled controls are not authorization.

### Backend overrides, maps and calculations

| Override | Reason |
|---|---|
| ApplyListFilters | Inclusive daily date keys are not generic property matches. |
| MaterializeListAsync | Project only the displayed fields/slim staff DTO. |
| AddAsync / UpdateAsync | Authoritative total/rate/amount, tenant FK/day/category/joining/duplicate checks, shared Staff concurrency guard. |
| AddListAsync / UpdateListAsync | Existing bulk paths must obey the same invariants; prepare whole command before mutation. |
| RemoveAsync | Serialize deletion with the other Staff overtime writes; retain inherited dependency-aware soft delete. |
| Controller generic reads/detail/select/activation | Inherited; no redundant override. Explicit process/import/history methods are new domain endpoints. |

AutoMapper retains only Staff→OvertimeStaffListVM and Overtime→List/Detail one-way read maps. All daily write entry points are explicitly overridden and construct authoritative fields, so unused write maps and every ReverseMap were removed; no unnecessary Ignore calls.

StaffOvertimePolicy is a shared extraction of the exact existing source hierarchy, holiday rule and rounding. Normal rate uses effective SalaryType.Overtime Type0 then designation hourly rate; holiday Type1 falls back to normal. Amount = hours × rate rounded to two decimals AwayFromZero. Existing StaffService uses the helper without changing its save policy. New daily CRUD preserves same staff/day historical rate; metadata-only updates preserve the saved amount when hours match; new/moved rows resolve effective rate. Zero hours clear the rate and produce zero amount. Process sums persisted values rather than repricing.

### Changed files and ownership

Frontend owned files under src/app/modules/HRM/Overtimes/Overtime: list TS/HTML, details TS/HTML, overtime.routes.ts, models/create.ts/details.ts/list.ts, new models/processing.ts and components/process/process.component.ts/html, services/overtime.service.ts. The formerly empty SCSS files remain empty; no feature style fork.

Direct frontend integration: src/app/_metronic/layout/layout.module.ts (only Overtime import/providers removed); src/app/modules/i18n/vocabs/en.ts/ar.ts (only overTime block authored here); shared/components/import-csv/import-csv.component.ts/html (additive lifecycle); UserGuide/content/hrm-guide.ts (only Overtime topic).

Backend owned files: SiGma.Business/IServices/IOvertimeService.cs, MapperConfig/OvertimeProfiler.cs, Services/OvertimeService.cs, Services/StaffServices/StaffService.cs (helper extraction/call sites), new StaffOvertimePolicy.cs; SiGma.ServerAPI/Controller/OvertimeController.cs; SiGma.ViewModels/ViewModels/Overtime Add/Update/Detail/List VMs, removed FullListVM and new StaffListVM/ProcessRequest/ProcessRunDto/ImportRequest/ImportRow; SiGma.Helpers/Models/Staffs/OvertimeProcessRun.cs; SiGma.DataAccess/Configuration/OvertimeConfig.cs/new OvertimeProcessRunConfig.cs; SiGma.DataAccess/SiGmaDbContext.cs (OvertimeProcessRuns only); GeneralMessage.resx/ar-SA.resx (11 Overtime keys only).

Pre-existing unrelated changes in both repositories, including payroll/leaves/attendance/job code, translations, DbContext additions, migrations/model snapshot and HRM guide topics, were preserved. Their presence in Git diff is not evidence that this task authored or validated their business.

### Schema and compatibility

Owner must run Add-Migration AddOvertimeProcessingAndDayUniqueness. No migration with that class name existed in the scoped migrations directory when checked.

Schema changes: new tenant-scoped OvertimeProcessRun table, required Status max20, count fields, hours decimal(22,6), amount decimal(18,2), subscription/from/id index; daily NormalOTHours/HolidayOTHours/TotalOTHours decimal(22,6) retain the previous 16 integer digits; persisted shadow OvertimeDay = CONVERT(date,Month); OvertimeDeletedKey = CASE WHEN IsDeleted=1 THEN Id ELSE 0 END; unique (SubscriptionId,StaffId,OvertimeDay,OvertimeDeletedKey), filtered only on nonnull StaffId. Live false/NULL deletion states both use key0; deleted rows use their Id. Existing rate/amount precision remains (18,2); no daily column dropped or business record backfilled/repriced.

Before applying, review all live staff/calendar-day duplicates including IsDeleted NULL and legacy time portions, and decide explicitly how to resolve them. An index cannot be created over duplicate keys. Review generated DDL together with unrelated pending migrations; this task did not create/edit/run migrations, snapshots or cleanup.

Lean DTOs remove unused fields; old clients sending unknown derived/audit properties no longer control them. The legacy detail URL remains View. Builds/EF query translation/computed-key DDL and server/client contract acceptance remain owner verification risks.

### User guide and documentation maintenance

Updated src/app/modules/UserGuide/content/hrm-guide.ts, Overtime topic at /Overtime inside the existing /UserGuide/hrm reader. Sidebar owner is components/sidebar/sidebar-menu/sidebar-menu-data.ts → userGuide.hrmMenuEntry → /UserGuide/hrm; reader already imports HRM_GUIDE. No duplicate viewer or menu.

Covered in English/Arabic: current list tabs/filter/paging/export, daily Create/View/Edit/Delete, Staff Overtime, full dates and category/joining/duplicate constraints, effective/historical rates, month processing history, template/exact columns/preview/new-only atomic import, clear/cancel/retry, empty approval and separate payroll/payment. Content was reconciled with final routes and service rules; guide navigation/RTL/theme/print acceptance is pending.

Shared CSV lifecycle learning promoted in the same task to canonical UI22 and sigma-screen-refactor skill plus revision row. All eight packets were refreshed through Generate-SigmaRecipes.ps1: plan-00-maintenance-evolution and phase-00-discovery-evidence through phase-06-final-reconciliation. Semantic review checked UI22 dependency/provenance, controlled editor D4-2, shared dialog/tab ownership and phase05 root-client/AuthGuard roles against the canonical blocks; no template/reference-role change was needed. Final generator -Check passed all eight.

### Verification and remaining owner acceptance

Performed: complete scoped tracked diffs reviewed separately in SiGmaAngularFrontEnd and SigmaBackend; new files read in full; exact producer/consumer/routes/shared API/mapper/write-rule comparisons; merge-marker/stale ms-lib/table-list/type/mapping scan; git diff --check passed scoped changes (line-ending notices only); new-source whitespace scan found only untouched existing spec-file whitespace; localized resource XML read/parity with 11 Overtime keys each and no duplicate Overtime keys; Check-Translations.ps1 -Block overTime passed 49 EN / 49 AR, zero missing/case-only keys; initial and final recipe drift checks passed.

Phases 00–06 applied, with phase04 limited to the frozen process/import/delete slices. Planning decisions and impact map are recorded in the freeze/plan; no payment, approval, automatic attendance, feature printing, attachment upload or unrelated business refactor was applicable.

Manual acceptance:

1. Review duplicate legacy staff/day data and migration DDL, create/apply the suggested migration in the owner's workflow, then build frontend/backend. This is required before testing the new history endpoints.
2. Verify current-month Search, both tabs, ascending/descending paging, last-page refresh, Retry retaining last applied filters, full export after a language change, and editor return to the same tab/filter/page/order.
3. Create normal weekday and holiday rows; reject wrong category, negative hours, missing date/staff, pre-joining positive hours and duplicate day. Confirm server totals and request absence of tenant/audit/derived fields. Check existing rate/amount preservation on metadata-only edit and date/staff changes.
4. Simulate detail/staff/save/delete failures; View should remain readable without current staff lookup, editing must await a valid lookup. Confirm deferred dirty discard, no stale route response, form freeze, cancel/back/menu during save, and dependency-aware delete.
5. Process a valid month; compare counts/hours/amount to daily source, repeat deliberately to obtain another history row, then edit source and confirm old summary remains unchanged. Empty/duplicate/unpriced/inconsistent source should fail without a new summary. Payroll/JV must not be changed by Process.
6. Download/import CSV with 1, 1000 and 1001 rows, wrong headers/date/month, duplicate days, nonexistent staff, existing daily key, null row/direct API, invalid/replaced file and partial-invalid batch. No partial rows should save. Verify success/error/close/reopen/parsing and pending-route guards.
7. Check full-day/strict month boundaries, keyboard focus/escape, Arabic RTL, dark/light themes, narrow heights/widths, overlays and the one internal scroll owner. Preview must not create a second dialog scroll owner.
8. Review the complete overtime→payroll→approval/payment business cycle and decide the overtime approval authority, real import feed, attendance generation and any future historical repricing policy. These effects are not implemented or claimed.
9. Read the HRM guide in English and Arabic, follow its screen links, and verify guide navigation/print behavior.

Builds, tests, lint, database commands, migrations, model snapshot edits, browser/runtime verification, Graphify, Sigma MCP, commits/pushes/deployment and external data actions were not run by this task.

### Agent utilization and suggested commits

daily_editor (sol_worker role, inherited parent model, no override) owned only daily details TS/HTML and create/detail models, then gave bounded read-only audits. Its changes were integrated and subsequent findings fixed by root. overtime_backend (sol_worker role, inherited parent model, no override) owned the intended backend stream but stopped at an account usage limit without source edits; root completed all backend implementation. Two bounded, nonoverlapping streams were delegated after contract freeze to reduce elapsed time; root retained cross-layer decisions/diff review/reconciliation.

- Frontend: feat(overtime): add monthly processing and validated csv import
- Backend: feat(overtime): validate daily records and retain monthly summaries
- Documentation repository: docs(ui-book): record csv preview lifecycle and refresh packets

Suggested messages cover only the owned files above; no commits were created. Instruction/review artifacts remain local under F:/My Work/Sigma until the owner's documented version-control move.

## Compiler feedback correction — 2026-10-10

Owner reported CS7036 at OvertimeService.RemoveAsync: RemoveWithChildrenAsync requires its second CancellationToken argument. Frozen correction scope is that single call; no API/business/schema change. BE5's deferred D5-2 contract leaves RemoveAsync(int id) without a cancellation parameter; BE8's canonical call and current Service.RemoveWithChildrenAsync declaration require an explicit token. Reference conformance: DriverService.RemoveAsync passes CancellationToken.None to the same shared owner.

Changed SiGma.Business/Services/OvertimeService.cs to call RemoveWithChildrenAsync(id, CancellationToken.None) inside the existing ExecuteUniqueWriteAsync<Staff> wrapper. Retain locking, usage validation, soft-delete and existing save ownership. Source baseline comparison verifies that only this exact argument changed and all earlier pending user edits remain intact. Scoped diff/whitespace check is source-only; owner compilation remains pending. Initial recipe -Check passed all eight packets. Backend integration/reconciliation apply; UI/evidence/contracts/guide/maps/calculations/migration are unaffected. No subagent because this is one sequential call-site fix. No build, test, lint, migration, database/browser/runtime command, commit, push or deployment was run.

Suggested backend commit for this fix only: `fix(overtime): pass cancellation token to delete helper`.

