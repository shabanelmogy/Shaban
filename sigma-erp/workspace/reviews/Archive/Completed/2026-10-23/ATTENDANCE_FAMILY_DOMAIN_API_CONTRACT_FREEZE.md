# Attendance family scope amendment — 2026-10-10

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

User clarified that screenshot-listed Shift and Staff Timesheet receive the same documented screen treatment as Attendance, and explicitly requested moving their Angular folders under Attendances to match sidebar grouping. This supersedes the earlier Attendance-only exclusion, preserving that historical review. Scope: HRM Shift and HRM StaffTimesheet, their directly related contracts, import consumers and HRM guide. Other Staff-module monthly tools remain separate; only relocated ShiftService import paths change there.

## Shapes and references

Both: UI01 paged list with controlled modal editor; BE1 normal entity. Approved reference: Workshop/Job list for shell/filter/grid; actual shared EditorDialog/FormSection for modal composition; BranchService for inherited generic read/write boundaries. No totals, financial effects, children, uploads, approval or posting. Recipes initial -Check passed PLAN00 and Phases00–06. Phases00–06 applicable; PLAN00 not needed for this bounded established CRUD modernization. Screenshots 1,4,5 are functional evidence, not design authority.

## Shift frozen contract

Grid beside ListVM: name/Name, dutyHours/DutyHours, createdAt/CreatedAt (date), startTime/StartTime + endTime/EndTime combined into Shift Time; id/Id only for action identity. No editor-only flags/Weekdays/audit/tenant fields. StartTime and EndTime retained as scalars so one translated grid/export column can display both, without a new persisted calculation.

Filters: dateFrom/dateTo on CreatedAt (inclusive days) and search (trimmed partial Name); empty date/name means unbounded; initial/reset current month. Generic ListSmBase paging/sort/count. Sort actual entity fields only. Typed Results wraps list; getAllList uses shared all-pages helper.

Add editable fields: name string required max250 (existing entity/add name bound), isFlexible bool, isEligibleForOvertime bool, startTime/endTime required clock TimeSpan represented as HH:mm:ss[.fraction], dutyHours/weekdays signed required Int32. Update adds id only. Detail Id + these fields; no server audit/tenant fields. Preserve dutyHours and weekdays as independently editable source integers; no invented duration formula, weekday mask or overnight restriction. Explicit Add/Update name attributes align both contracts to entity max250 without changing schema. Names trim; existing name duplicate rule retained, update excludes self. Existing clock input establishes 0<=clock<24h transport; no start/end ordering rule.

GET /Shift; GET /Shift/GetByWithNavigationsId/{id}; POST/PUT /Shift; DELETE /Shift?id=...; existing select API remains. Retain generic controller. Shift Add/Update delegate inherited validation and persistence after business checks. Replace custom GetMany with ApplyListFilters plus projection hook to restore tenant/live generic bounds, count and sorting. Delete through RemoveWithChildrenAsync; inbound Staff, StaffTimesheet and Attendance all block deletion; no owned collections. Resource keys are localized. Entity/configuration/migrations untouched. No migration required; existing name uniqueness remains application-level with race risk, no index added.

## HRM Staff Timesheet frozen contract

Grid beside ListVM: staffName/StaffName, code/Code, designation/Designation, shiftName/ShiftName, date/Date (date), workingHours/WorkingHours, overtimeHours/OvertimeHours, month/Month (date); id/Id only for actions. Remove ListVM StaffId/ShiftId; detail alone retains identifiers. Existing working/overtime/month values remain visible even though screenshot4 shows fewer fields.

Filters month (yyyy-MM) on persisted Month with >=firstDay and <nextMonth, safe final-year bound; staffId optional positive Int32. Initial/reset current month. Shared month validation/picker/parser, never raw UTC conversions. Generic paging/count/sort. Names need projection and are not offered as raw property sort.

Add/Update/Detail retain existing source contract: positive required StaffId/ShiftId, optional code/designation max100, required full Date and Month, workingHours/overtimeHours required finite nonnegative decimals. FE month calendar transports first day of selected month; hydrate from stored Month. No derived payroll/time formula. Existing service default date check, generic FK checks and safe delete remain; add only month filter hook and trim ListVM. Existing stored nullable relationships can render empty names without invented values; edits require current server-valid IDs.

GET /StaffTimesheet; GET /StaffTimesheet/GetByWithNavigationsId/{id}; POST/PUT /StaffTimesheet; DELETE /StaffTimesheet?id=...; select Staff/Shift through existing APIs. The screenshot5 empty monthly editor shows Date/Absent/From/To/WH labels but does not supply saved-row or batch contract; current source owns one-record hours CRUD. No fabricated absence/from/to fields, monthly batch API or payroll effect. Create/View/Edit/Delete fully implemented for existing records.

## Integration, actions and failure contract

New folders: src/app/modules/HRM/Attendances/Shift and .../StaffTimesheet, siblings of Attendance. Move in PowerShell after verifying targets inside FE repository; adjust lazy route imports, LayoutModule provider imports and all direct ShiftService consumers including test import. Keep public URLs /Shift and /StaffTimesheets and old details/:id/create aliases; add view/edit aliases, each renders list + controlled editor. Actual sidebar route spelling is authoritative. Root intercepted HttpClient retained; no feature client fork.

Typed forms, matching EN/AR keys. One internal scroll owner, sigma-route-host/list-page/list-panel/list-header/list-table + DataTable fill=true. Shared FilterPanel stableLayout, mainColumns2, inlineActions/caption; mandatory Reset. Shared EditorDialog contentPadded=true, focusOnShow=false, max90dvh and one FormSection; View saved values/Edit/Close, no Save. Both failure channels inline via skip-error header; global success toast retained. All-page Excel with translated visible columns/applied snapshot/current sort. Separate load/save errors; save failure retains controls. Latest list query cancels old request. Dirty X/Cancel/Escape/back uses deferred shared discard and frozen form state; route ID changes remount child after guard. Delete confirmation, safe backend, applied-filter refresh/last-row page backup. HRM user guide extended for both screens by root.

Reference action coverage: View/Edit/Delete supported; Job lubrication create, labour time, invoice, close/cancel, quality, logs, estimation, gatepass not applicable: neither Shift nor StaffTimesheet has those workshop aggregates/states/endpoints. Save/Search/Reset/export need no confirmation. Delete only is Phase4. Authentication exists, no invented permissions.

## Pre-edit conformance table

| Concern | Owning block/reference/actual shared owner | Existing deviation -> target |
|---|---|---|
| Shell/title | UI1/3, Job list, styles.scss/FeatureTitle | Legacy card/absent container-fill -> shared shell |
| Filters/grid | UI4/5/6, Job list, FilterPanel/DataTable | ms-lib table-list -> typed fill grid and applied state |
| Modal/fields | UI13/15/17/19, EditorDialog/FormSection/FieldError | Bootstrap routed raw forms -> controlled shared modal/validators |
| Async/errors | UI2/22/28, generic wrappers/root interceptors | success-only subscriptions -> both failures/finalize/cancellation |
| Discard/delete | UI9/10, ConfirmationDialogService/form-state | immediate exits/deletes -> guarded interactions |
| API | BE3–9/13, BranchService/generic Service | Shift bespoke bypass, Timesheet IDs list -> inherited boundaries/lean contracts |
| Guide | Master7, HRM_GUIDE existing reader | missing topics -> bilingual source-backed handoff |

No build/test/lint/typecheck/runtime/browser/database/migration/commit/push/deployment authorized. Final source reconciliation and owner acceptance are separate.

## Frozen amendments from producer and routing discovery

1. Generic Service property filtering applies Month equality before ApplyListFilters. Therefore UI month stays `month`, route state stays `month`, serialized API key becomes `monthFilter` (yyyy-MM). The feature hook reads monthFilter. This avoids a redundant GetMany override and retains the entire month.
2. 250 is the verified existing AddBaseVmWithName bound, not an EF entity bound. Shift entity Name and CreatedAt are nullable; read contracts preserve that. Both writes align to the existing create bound250 via explicit attributes; no schema change. Required UI clock/int entry does not redefine existing nonnullable server scalar omission/default-zero semantics.
3. Actual sidebar links Timesheet to `/StaffTimesheet` (singular), whose prior Staff/StaffTimesheet owner uses the same entity/API and same editable fields as old HRM plural `/StaffTimesheets`. User explicitly requests Timesheet under Attendances; unify both lazy routes onto the relocated single owner. Preserve prior singular Code/Designation filters as advanced fields beside main Month/Staff. Keep both URLs; guide and editor return use sidebar's singular URL. Remove redundant prior Staff/StaffTimesheet implementation after consumer and working-tree audit: its only tracked modification is this task's ShiftService import relocation, no pre-existing user changes or untracked files. Update LayoutModule imports/providers to one service owner. This amendment supersedes the earlier statement that this duplicate remains separate.
