# Attendance family — unified screens and folders

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

## Scope and authority

2026-10-10 user clarified that the supplied Shift/Attendance/Timesheet screens receive the same documented review and implementation, and requested Shift/Timesheet folders under Attendances matching sidebar grouping. Earlier Attendance-only exclusions are historical and superseded. This task completes Shift and Timesheet while retaining the earlier Attendance implementation.

Read F:/My Work/Sigma/AGENTS.md and sigma-screen-refactor skill; Master authority plus applicable UI/BE blocks and generated phase packets govern. Initial and final Generate-SigmaRecipes.ps1 -Check passed PLAN00 and Phases00–06. Frozen decisions/amendments: ATTENDANCE_FAMILY_DOMAIN_API_CONTRACT_FREEZE.md. Frozen consolidation plan: ATTENDANCE_FAMILY_MAINTENANCE_EVOLUTION_PLAN.md. Source only; no runtime/visual claim.

Frontend repo: F:/My Work/Sigma/SiGmaAngularFrontEnd. Backend repo: F:/My Work/Sigma/SigmaBackend. Existing unrelated dirty changes (payroll, overtime, vocabulary/resources, routing/layout, untracked HRM guide) preserved. AuthGuard/authentication exists; no authorization service invented. Unrelated features are outside scope except direct moved-service imports.

## Screenshot evidence

| Evidence | Explicit content | Source-supported decision / limit |
|---|---|---|
| Desktop/Attendance/1.PNG | Shifts Name, Total Hours, Creation Date, Shift Time; Date Range/Name; Create/View/Edit/Delete | Same four visible columns; full start/end pair; typed modal fields from actual entity. Shared owners determine design. |
| 2.PNG / 3.PNG | Attendance list and Update labels | Earlier Attendance implementation retained; only ShiftService import moved here. One-record existing contract retained. |
| 4.PNG | Staff Timesheet Month/Staff, Name/Code/Designation/Shift/Date; View | Implement monthly filter and name projection, retain existing WorkingHours/OvertimeHours/Month visible fields and Add/Edit/Delete supported by source. |
| 5.PNG | Empty monthly Update dialog, Month/Staff and Date/Absent/From/To/WH labels | No populated rows or batch contract proved. Existing source owns one-record hours CRUD. Absence/From/To/batch/payroll are not invented; no automatic calculation. |

No unresolved material decision blocks the implemented existing CRUD slice; screenshot-only monthly batch behavior is unproven and excluded. Screenshot styling is not copied.

## Decisions and matching contracts

UI01 list+controlled modal, BE1 normal entity. Job list is the approved shell/filter/grid reference, actual EditorDialog/FormSection declarations own modal composition, BranchService owns generic service conventions. No tabs because neither form has peer collections; one section. No entity/EF/schema change, no Add-Migration required.

| Grid field order | Backend ListVM beside it |
|---|---|
| Shift: name, dutyHours(number), createdAt(date), startTime custom combined with endTime | Id, nullable Name, DutyHours, nullable CreatedAt, StartTime, EndTime |
| Timesheet: staffName, code, designation, shiftName, date(date), workingHours(number), overtimeHours(number), month(date) | Id, nullable StaffName, Code, Designation, ShiftName, Date, WorkingHours, OvertimeHours, Month |

Id is action identity. Shift IsFlexible/IsEligibleForOvertime/Weekdays and heavy audit/tenant fields removed from list. Timesheet StaffId/ShiftId removed from list and retained only in editable/detail contracts. Raw lookup identities do not replace displayed names.

Shift filters dateFrom/dateTo (CreatedAt inclusive days), search (trimmed partial name), initial/reset current month. Timesheet UI/URL month maps to API Filters[monthFilter] yyyy-MM, inclusive first day/exclusive next month (safe9999-12); optional staffId, preserved Code/Designation advanced filters. The non-entity monthFilter key avoids generic Month equality being applied before the feature hook. Both use inherited known totalCount/paging/sort; only raw entity fields exposed for sorting. Paging/export/refresh use last applied Search, not drafts.

Shift Add/Update: required trimmed Name max250 (existing create API bound, not EF bound), two booleans, two 24-hour clocks, signedInt32 DutyHours/Weekdays; update Id only. Detail lean identity plus editable values, nullable stored Name preserved. Do not infer a weekday bitmask, duty-hour duration calculation, sign bound or start/end ordering. Existing duplicate-name rule retained with self exclusion; delegated generic writes preserve validation/tenant/live ownership. Clock hydration/parser preserves unchanged seconds/fractions.

Timesheet existing Add/Update/Detail: required positive StaffId/ShiftId, optional Code/Designation max100, Date/Month and nonnegative finite decimal working/overtime hours. Form allows decimals and zero; month writes first day, no UTC conversion. No payroll formula or effect added. Existing date/FK backend validation retained. Failed saves preserve form values separately from detail-load error.

GET Shift/StaffTimesheet; detail GetByWithNavigationsId/{id}; POST/PUT and DELETE?id unchanged. Select APIs and root token/error interceptor retained. Explicit inline failure requests use X-Skip-Error-Interceptor; mutation success stays with the global interceptor. Both failure channels handled and loading ends on cancellation/destroy.

View/Edit/Delete supported. Reference Job lubrication create/labour-time/invoice/close/cancel/quality/logs/estimate/gatepass are not applicable because these simple entities have no workshop aggregate/state/endpoint. Ordinary Save/Search/Reset/Excel need no confirmation. Delete requires shared confirmation, usage-safe backend deletion and applied-search refresh with page backup. Shift inbound Staff/StaffTimesheet/Attendance all block delete through shared EF usage inspection. Neither entity owns child rows; soft delete uses one SaveChanges, no explicit transaction.

## Folder and integration result

```text
src/app/modules/HRM/Attendances/
  Shift/
  Attendance/
  StaffTimesheet/
```

This lists the actual sidebar order. Empty old HRM Shifts/StaffTimesheets directories removed after move. Public /Shift and /Attendance retained. Both /StaffTimesheet (actual sidebar) and /StaffTimesheets (legacy HRM URL) now lazy-load one relocated StaffTimesheet owner. create/view/edit/details aliases render the same list+editor and use CanDeactivate. Route paramMap and keyed child remount ensure a changed valid ID loads the right record; invalid IDs close the old child. X/Cancel/Escape/back share deferred discard with form-state freeze; pristine/view leaves silently.

Duplicate Staff/StaffTimesheet source retired only after all11 files were confirmed tracked, no untracked files and no prior edits (only this task's relocated import). Existing Code/Designation searches retained as advanced filters. LayoutModule old StaffTimesheetService provider removed; one AttendanceTimesheetService owner remains. Existing unrelated provider duplication is not broadened into a global refactor. Compiler existing explicit paths searched, no old module entries found, no include/lib widening or preemptive files entries.

## Changed files

- Frontend HRM/Attendances/Shift: routes; components/list TS+HTML (empty old SCSS unused); components/details TS+HTML+SCSS; models create/details/list; services/shift.service.ts. Old HRM/Shifts/Shift removed by relocation. Two obsolete generated smoke specs removed (unrelated widgets list; provider/input-free constructor only).
- Frontend HRM/Attendances/StaffTimesheet: routes; list TS+HTML; details TS+HTML+SCSS; models create/details/list; attendanceTimesheet.service.ts. Old HRM/StaffTimesheets/StaffTimesheet removed by relocation; duplicate Staff/StaffTimesheet implementation retired; two obsolete HRM smoke specs removed.
- Frontend pages/routing.ts: exactly three relevant lazy imports; unrelated payroll additions preserved. LayoutModule: two relocated imports, duplicate owner import/provider removed; unrelated overtime changes preserved.
- Direct ShiftService import consumers: Attendance list, Staff details, StaffDutySchedule list and its existing spec. No feature behavior changes in those consumers.
- Frontend en.ts/ar.ts: matching shift block and staffTimesheet name/save/delete/export keys only; previous additions preserved. UserGuide/content/hrm-guide.ts: bilingual Shift and Timesheet topics, existing Attendance/HRM topics preserved.
- Backend ShiftService; Shift Add/Update/Detail/List DTOs; unused declaration-only ShiftFullListVM removed. StaffTimesheetService adds monthFilter hook; StaffTimesheetListVM removes editor IDs. GeneralMessage.resx/ar-SA: ShiftNameExists/ShiftNotFound/ShiftClockInvalid/EntityAttendance/EntityStaffTimesheet only; prior additions preserved.
- ShiftProfiler already had four one-way maps and remains unchanged. StaffTimesheetProfiler already flattens nullable names; unchanged. Controllers/interfaces/entities/EF/snapshots/migrations unchanged.

## Final source conformance

| Concern | Actual producer/consumer comparison | Result |
|---|---|---|
| Layout/title | Both host sigma-route-host + sigma-list-page/panel/header/table, FeatureTitle action slot; shared styles own container-fill/no page scroll | Matched source; visual pending |
| Filters | Shift mainColumns2/stableLayout/inlineActions+caption; Timesheet main2/stableLayout+shared advanced code/designation, shared Reset/actions | Matched public inputs; responsive/RTL pending |
| Grid/export | DataTable fill=true/known count/one lazyLoad, own visible columns reused by dataTableExportRows; fetchAllPages/current translation/applied filters | Matched source; multi-page runtime pending |
| Forms/modal | EditorDialog contentPadded=true/focusOnShow=false/max90dvh/default width; one FormSection and autoheight form/body/scroll; only host display:contents SCSS | Matched exact shared declarations; focus/theme pending |
| Controls | DatePicker + shared day/month/time parsing/validators, NumericFocus native number appearance; FieldError and first-invalid focus | Matched imports/standalone bindings; keyboard/typing pending |
| Read/write/error | lean DTOs beside grid/forms, skip-error typed Results/Result, latest-read switchMap and finalize, separate loadError/saveError and frozen retained controls | Matched source |
| Guard/identity | list route guard delegates child deferred discard; keyed param ID remount and invalid reset | Matched source; browser navigation pending |
| Delete | ConfirmationDialogService -> feature delete -> inherited controller -> RemoveWithChildrenAsync -> applied snapshot/page backup | Matched source; usage checks pending |
| Backend projection | Shift MaterializeListAsync selects lean scalar VM; Timesheet existing ProjectTo joins names | Matched source; EF/AutoMapper runtime pending |
| Provider/routes | moved imports resolve, both Timesheet URLs one owner, root interceptor-enabled HttpClient preserved | Matched source; navigation pending |
| Guide | HRM_GUIDE existing reader, /UserGuide/hrm existing HRM menu; topics /Shift and /StaffTimesheet matching sidebar, prerequisites/filters/CRUD/failures/discard/delete/limits | Matched source; reader/print pending |

Shift overrides: SearchColumns Name declaration, ApplyListFilters day bounds, MaterializeListAsync scalar projection, Add/Update trim/duplicates/clock checks, Remove usage-safe delete. Timesheet adds only month bounds to existing justified projection/date checks/delete overrides. No unnecessary detail/select/controller override.

Complete scoped source/diffs reviewed in each actual repository, including old-vs-relocated files, shared consumer diffs and authored vocabulary/resource/guide deltas. Backend worker and Timesheet worker reviewed owned full diffs; root reviewed final source, DTO producers, shared public owners and integration. Focused read-only Shift audit found no actionable issue. Scoped tracked git diff --check passes; moved untracked files inspected directly for whitespace/import/public bindings and worker path audit. No stale old paths, legacy table-list/ms-lib, merge markers, copied styles, raw UTC conversion or widened compiler config. Resource XML/duplicate keys passed source checks. LF/CRLF future Git warnings do not represent whitespace failures.

Shared-extraction gate: reused existing shell/DataTable/FilterPanel/EditorDialog/FormSection/FieldError/StateMessage, date/month/clock/Int32/number utilities, freezeFormState, route/paging/export/error helpers. No new reusable mechanism or guidance needed; existing owning books/skill already require uniform screen treatment. Canonical books/skill/packet templates unchanged, no regeneration required; final drift check passed.

Phases00 evidence,01 freeze,02 read/grid,03 detail/write,04 delete,05 move/integration and06 reconciliation applied; PLAN00 consolidation frozen before duplicate removal. Children/uploads/posting/financial calculations/report/approval phases not applicable to these simple CRUD entities.

Agents: one inherited-model backend worker exclusively owned Shift/Timesheet BE contracts/services/resources; one inherited-model frontend worker exclusively owned relocated Timesheet feature; root owned freeze/Shift FE/folder move/import consumers/guide/integration. Backend then audited Shift FE read-only. Two independent workstreams after freeze reduced sequential work, no overlapping edits.

## Limits and owner acceptance

No migration required. Known preserved source limits: Shift application-level uniqueness has check/save race without a unique index/lock; no schema/index work authorized. Nonnullable Shift TimeSpan/Int32 omitted JSON retains default zero; UI required entry does not establish server presence. Inherited bulk methods bypass single-row checks; no batch caller added. Timesheet default Date/Month sentinel rejects0001-01-01 midnight; existing base concurrent update behavior remains. No claim of complete monthly batch or payroll workflow.

Owner verification:
1. Compile FE/BE; verify serializer and AutoMapper/EF projection, required/nullable clocks and numeric values.
2. Navigate sidebar Shift/Attendance/Timesheet and legacy Timesheets URL; check one owner, compatibility IDs, modal modes and return filters.
3. Check EN/AR, RTL/light/dark, narrow/desktop equal card edges, internal grid/form scroll, fixed paginator/footer, focus/Escape and invalid field messages.
4. Search currentmonth and older/cleared dates; name/Month/Staff/advanced Code/Designation; malformed/partial month/date, month including stored non-first-day Month and9999-12; rapid page/sort/size changes and all-page Excel/current translated headings.
5. Create/Edit/View each record; integer Shift fields, valid midnight clocks/seconds/fractions, Timesheet zero/fractional hours, blank and negative hours; provoke duplicate/read/lookup/save errors and retry retained values.
6. Dirty X/Cancel/Escape/back, cancel discard, change valid/invalid routed ID; verify visible record/save ID and field states.
7. Delete cancellation, each Shift usage blocker (Staff/Attendance/Timesheet), foreign/deleted ID, last-row later-page backup; preserved applied query.
8. Open HRM guide, Shift/Timesheet links and bilingual content/print. Existing Staff guide singular link remains usable.

No build/test/lint/typecheck/runtime/browser/database/migration/commit/push/deployment run. Suggested scoped commits only:
- Frontend: `refactor(attendance): unify shift and timesheet screens and folders`
- Backend: `refactor(attendance): align shift and timesheet contracts`

Stage only enumerated feature files and authored shared deltas; preserve unrelated working-tree changes. Review artifacts remain local/unversioned under project instructions.
