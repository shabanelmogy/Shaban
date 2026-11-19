# Attendance family — Staff Timesheet frontend notes

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

Bounded worker handoff, 2026-10-10. This does not declare the complete family implementation finished. Root owns final integration, translations, guide, backend reconciliation and the complete family report. Authority: Sigma AGENTS.md; sigma-screen-refactor skill; canonical UI01 screen catalog and its owning UI blocks; root-frozen ATTENDANCE_FAMILY_DOMAIN_API_CONTRACT_FREEZE.md with the monthFilter and route consolidation amendments. Root confirmed initial recipe drift check passed. No documentation-rule change or packet generation was needed in this workstream.

## Owned files and decisions

All source writes were confined to `SiGmaAngularFrontEnd/src/app/modules/HRM/Attendances/StaffTimesheet`, already moved by root from `HRM/StaffTimesheets/StaffTimesheet`:

- `components/list/list.component.ts` and `.html`: typed shared list, current-month/staff main filters, preserved code/designation advanced filters, server paging/sorting, all-page Excel, lookup/list recovery, modal host and deletion.
- `components/details/details.component.ts`, `.html`, `.scss`: one typed controlled Create/View/Edit editor, shared form section, validators and guarded exits.
- `models/create.ts`, `details.ts`, `list.ts`: lean frozen write/detail/grid contracts.
- `services/attendanceTimesheet.service.ts`: existing `AttendanceTimesheetService` root identity with typed endpoint-specific methods.
- `stafftimesheet.routes.ts`: list and compatibility modes with CanDeactivate.
- Removed generated list/details `.spec.ts` files: list imported unrelated widgets `ListsComponent`; details was a constructor-only smoke test without provider/required input setup. They supplied no behavior coverage. No tests were run or added.

The empty existing list SCSS is unused; the consumer selects shared layout owners without stylesheet copies. Details SCSS only supplies `:host { display: contents; }`.

Grid columns beside ListVM properties: Name/staffName, Code/code, Designation/designation, Shift/shiftName, Date/date, Working Hours/workingHours, Overtime Hours/overtimeHours, Month/month. `id:number` is action identity only. No raw StaffId/ShiftId, tenant, audit or state fields are returned to the grid. Names are nullable and not raw-entity sortable; actual scalar fields are sortable.

Add contains staffId, shiftId, code, designation, date, month, workingHours and overtimeHours; Update adds only id. Detail adds id and optional nullable stored staffName/shiftName. Source-backed FK values are positive required Int32; code/designation optional max100; Date and Month required; working/overtime required finite nonnegative numbers (zero remains zero, empty remains invalid). No invented hour derivation, payroll calculation, absence/from/to fields or monthly batch API. Month write transport is the first day of the selected month, without UTC conversion.

The sidebar's `/StaffTimesheet` singular route is canonical. Root consolidates that old Staff owner and `/StaffTimesheets` plural HRM compatibility route onto this one relocated owner. This worker returns to singular with applied state. Compatibility create/view/edit/details routes all render list + the same modal; valid changed route IDs remount the child, invalid IDs close the previous editor and show an error. Valid route IDs are positive Int32.

`month` is the UI/control/route-state name; `monthFilter` is the frozen API filter key. Using `Filters[month]` would trigger the generic producer's date equality before the feature's month-range hook. StaffId/code/designation retain their existing generic keys. Main filters default/reset to current month + null Staff; advanced code/designation reset to empty. Empty month is unbounded and survives URL restore using the paging-state marker. Partial/invalid month remains visible and invalid.

## Final conformance evidence

| Concern | Canonical/shared reference | Actual consumer match |
|---|---|---|
| Shell/title | UI1/3, Workshop Job list, FeatureTitle/styles.scss | sigma-route-host → sigma-list-page/panel/header/table; title inside panel; no card/panel/header CSS |
| Filter structure | UI4, Job list, FilterPanel and actual `.directives.ts` exports | mainColumns2/stableLayout; month+Staff main, code+designation appFilterAdvanced; advancedOpen model and count names; mandatory Reset; toolbar owns actions because advanced filters exist |
| Grid/pager | UI5/6, Job list, DataTable/resolveListPaging | one typed fill grid, API totalCount; shared15 initial size + 10/15/20/50/100; sortable whitelist from columns; resolved paging before assigning state |
| Requests | UI2/22/28, Job bindListQueries, Results/Result | Subject + switchMap + defer; old page cancellation; finalized loader; both declared and transport errors; skip-error headers; no feature success toast |
| Export | UI8, Job, fetchAllPages/dataTableExportRows | all pages100 each; same applied filters/sort/visible columns, click-time translation; no partial file on a failed page |
| Modal | UI13 actual EditorDialog declaration/control composition | explicit modes, default1040 shared width, max90dvh, contentPadded true, focusOnShow false; intrinsic flex-fill form/body/scroll, one FormSection |
| Date/month controls | UI17, DatePickerDirective/date-utils | Date|string|null; structured masks; month view mm/yy and mm/yyyy hint; monthValueValidator/parseMonthValue; toPickerDate hydration; no private parser/UTC |
| Hours/validation | UI19/27, scalar-validators/NumericFocusDirective/FieldError | finiteNumberValidator + required/min0; native step any without rounding; appNumericFocus appearance and root selection owner; first invalid focusField; error component below every validated editor control |
| View/lookups | UI15/16, saved names + mergeSelectOptions | saved read text; no Save; Edit/Close; Staff lookup also serves list filter, Shift requested for edit/create only; input-ready signal prevents stale computed readiness; both failure channels with Retry |
| Save/recovery | UI22, form-state owner | separate loadError/saveError; failed Save keeps entered values; shared freezeFormState restores only active editor; successful Save marks pristine, closes changed(true), refreshes applied query |
| Discard/routes | UI10/28, ConfirmationDialogService/form-state | one deferred decision for X/Cancel/Escape/CanDeactivate, captured id/mode and pending gate, no old decision enables/closes replacement editor; keyed identity remount |
| Delete | UI7/9, confirmDelete preset | translated record/warning/subtitle, one confirmation/request, inline failure keeps row, successful last-row deletion backs up one page and refreshes applied filters |
| Provider | UI1/2/26/phase05, root app client | service providedIn root, inherited HttpClient, existing StaffTimesheet endpoint, no client/Auth/permission fork; external routing/provider edits root-owned |
| Shared extraction | Master5/UI30 | all reusable parsing, query, date, errors, export, confirmation, field/focus/form-state owners reused; no new reusable copy or shared change |

Approved Job actions classified by frozen contract: View/Edit/Delete supported; workshop creation/lubrication, labour time, invoice, close/cancel, quality, logs, estimation and gatepass not applicable because this record has no such workshop aggregates/states/endpoints. Ordinary Save/Search/Reset/export have no confirmation. Delete endpoint is an authorization candidate for the future permission inventory; no permission API was invented.

## Verification and integration handoff

Read the exact shared imports/declarations for DataTable, EditorDialog, FormSection, FilterPanel/FilterActions/FilterAdvanced, FieldError, StateMessage, DatePicker, NumericFocus, form-state, select-options, date-utils, scalar validators and list-query/route-state. Inspected effective ES2018/dom libraries; no newer JS APIs or compiler config changes introduced. Complete owned old/new diff reviewed via read-only HEAD file comparison in two batches, including model/service/routes/deleted stale specs. Final source scan covers import paths, forbidden legacy/untyped constructs, merge markers, encoding, trailing whitespace and contract/property names. This is source evidence, not compilation or runtime acceptance.

Final bounded source audit: 11 owned source files and 53 local import paths inspected; zero missing paths, conflict markers, trailing whitespace, legacy/untyped TypeScript patterns or encoding issues. Scoped frontend git diff --check passed for the old and relocated paths; newly untracked files were also inspected directly. Compared actual StaffTimesheetListVM/AddVM/UpdateVM/DetailVM and StaffServices/StaffTimesheetService.ApplyListFilters: all eight displayed fields + Id align; monthFilter producer is present; IDs, nullable strings, date/month and nonnegative decimal attributes align. No compilation is implied.

Root translation additions requested (existing other feature keys retained): staffTimesheet.name, staffTimesheet.errors.save, staffTimesheet.errors.delete, staffTimesheet.errors.export, in EN/AR. Root must verify translations after its edit and update HRM guide topic covering month/staff plus preserved advanced code/designation filters, Create/View/Edit/Delete, validations, errors/retry/discard and complete Excel. Root owns old owner removal, public aliases, all direct import consumers and existing explicit tsconfig paths. No source guide edit by this worker.

Phases consumed: frozen00/01 input; implementation02 read/grid,03 write/editor,04 Delete; phase05 owned child route/service/events; phase06 bounded diff reconciliation. PLAN00, children, document/upload, posting/financial actions, totals and report printing not applicable. Backend code/mapping/domain/entity untouched by this worker; backend worker/root owns corresponding frozen ListVM/month producer. No migration needed for this frontend contract.

Owner checks after integrated handoff: build frontend/backend; exercise both public route spellings and create/view/edit/details deep links; dirty changes while changing id/back/X/Escape/Cancel; clear/partial/current-month/year0001/9999 filters; advanced code/designation plus Staff filtering; size-only page changes and slow request cancellation; save0/fractional/negative/empty hours; failed lookups/detail/save/delete/export with Retry and retained values; full filtered translated export count; last row of later page deletion; narrow LTR/RTL/light/dark/keyboard focus trap/return and no page scrolling; guide topic accuracy.

Known limits: source-supported one-record hours CRUD does not implement screenshot5's empty monthly absence/from/to batch table; no payroll formula. Saved missing/deleted references may display historical labels but backend FK validation remains authoritative. Browser floating number precision and server decimal transport are the existing contract; no new precision cap was invented. Owner compilation, runtime, visual and persistence acceptance pending.

Suggested frontend commit (only a suggestion): `refactor(attendance): unify shift and staff timesheet screens and folders`.

No builds, tests, lint, typecheck, runtime, browser, database commands, migration/snapshot edits, commits, pushes or deployments were performed. Unrelated user/root/peer changes were preserved. Worker used inherited model and no child agent.
