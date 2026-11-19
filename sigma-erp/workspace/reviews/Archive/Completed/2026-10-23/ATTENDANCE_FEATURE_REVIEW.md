| | |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

# Attendance feature review and contract freeze

## Scope

Frontend feature `SiGmaAngularFrontEnd/src/app/modules/HRM/Attendances/Attendance` only. The adjacent Shift and HRM StaffTimesheet folders shown in screenshots are separate routes and contracts, so they are contextual evidence and remain outside this change.

## Screen type and references

- Screen type: UI screen 01, list with modal editor. The record has fields only and no source-backed child collection or posting workflow.
- Canonical references: `Workshop/Job/components/list` for the list shell and `Staff/StaffTimesheet/components/{list,details}` for the typed list/dialog lifecycle.
- Owning blocks: UI 1, 2, 3, 4, 5, 6, 7, 9, 10, 13, 15, 16, 17, 19, 22, 23, 24, 25, 26, 27, 28, 29; backend BE 3, 7, 9, 13.

## Screenshot evidence classification

| Screenshot | Explicit visible evidence | Inferred/unknown | Decision |
|---|---|---|---|
| 2 | Attendance title, date range, Staff filter, Search, columns Staff/Code/Designation/Shift/Date/Check In/Out/Check In2/Out2, update action | Server paging, lookup endpoint, error/loading states | Adopt visible fields and filters through shared canonical controls. |
| 3 | Update Attendance dialog with Date, Staff lookup, row labels and Close/Update actions | Whether it saves one row or many rows and the API payload | API source exposes generic Attendance CRUD only; implement one-record create/view/edit editor and retain all server fields. |
| 1, 4, 5 | Neighboring Shift and Staff Timesheet screens | They are not under requested feature folder and their DTOs differ | Contextual only; no source edits. |

## Frozen contracts

- List filters: optional `dateFrom`, `dateTo`, and `staffId`; date range is hydrated with shared date utilities and serialized as date-only values.
- List columns: `staffName`, `code`, `designation`, `shiftName`, `date`, `checkIn`, `checkOut`, `checkIn2`, `checkOut2`. `id`, `staffId`, and `shiftId` remain identity/lookup support. The list VM does not carry audit or tenant fields.
- Editor inputs: `staffId`, `code`, `designation`, `shiftId`, `isAbsent`, `date`, `checkIn`, `checkOut`, `checkIn2`, `checkOut2`. `id` is added only for update. `subscriptionId` and audit/soft-delete fields are excluded.
- Lookups: existing `Staff/GetSelect` and `Shift/GetSelect`; failures are owned inline with Retry before create/edit.
- Actions: View/Edit/Delete row actions use shared action and confirmation owners. Create opens the same editor in create mode. No bulk update endpoint is invented.
- Error handling: both `isSuccess: false` and transport `error` paths set visible translated state; loaders finalize on every path.
- Route contract: list route plus compatibility `create`, `view/:id`, `edit/:id`, and `details/:id` routes with editor mode metadata; dirty close is guarded by the existing confirmation service.

## Conformance table

| Concern | Book block | Reference | Target decision |
|---|---|---|---|
| Shell/scroll | UI 1 | Workshop Job list | `sigma-route-host` + shared list panel; one grid scroll owner |
| Filters | UI 4 | shared FilterPanel + StaffTimesheet list | date range + staff, mandatory Reset/Search |
| Grid | UI 5/6 | shared DataTable | typed columns, server paging/sort, current-page report |
| Actions | UI 7/9 | StaffTimesheet list | View/Edit/Delete, shared delete confirmation |
| Editor | UI 13/15 | StaffTimesheet details | one controlled EditorDialog with create/view/edit modes |
| Dates | UI 17 | shared date-utils | date range parsing and date-only transport |
| Failure states | UI 22 | StaffTimesheet list/details | inline translated error/retry plus finalize |
| Translation/theme | UI 23/24/25 | shared tokens/components | EN/AR `attendance.*` keys, no feature color CSS |

## Open/owner verification

Runtime, API, build, RTL/theme and visual acceptance remain owner-pending under source-only verification rules.

## Contract amendment — 2026-10-10 continuation (Frozen)

The original frontend-only statement above is retained as history. Directly related Attendance backend DTOs, mapping and query hooks are now included because the visible staff/shift names and date-range filters were not produced by the old API. No entity/EF change is needed.

- List shape is exactly `Id, StaffName, Code, Designation, ShiftName, Date, CheckIn, CheckOut, CheckIn2, CheckOut2`; the nine displayed columns above plus Id only. Remove editor-only StaffId, ShiftId and IsAbsent from ListVM and Angular list model; names come from projected navigations, not client lookup-dependent list rendering.
- Detail retains Id, StaffId/StaffName, ShiftId/ShiftName and all editable inputs. Add/Update retain required positive StaffId/ShiftId, optional Code/Designation (100-character maximum), required calendar Date, IsAbsent, and four optional `TimeSpan?` clocks. Entity clocks and strings are already nullable, so nullable write contracts preserve existing missing values without migration. An empty clock is null; it is never fabricated as midnight. Unchanged saved clock seconds/fractions use shared `time-utils` transport; changed clocks follow the same parser.
- Backend validates required date and required tenant-owned foreign keys using existing validation owners; no unique staff/day key or time-pair/absence clearing rule is invented. Other attendance writers select latest rows when duplicates exist, so uniqueness would be an unsupported restriction.
- List export uses the existing all-pages helper and shared column mapping with the applied filter/sort snapshot. It is an approved-list reference capability, independent of screenshots.
- Backend owner: normal entity pattern, generic service/controller inheritance; overrides only date validation, date-range filtering and narrow list projection. Existing duty-schedule method and endpoint stay compatible.
- Editor save errors are separate from read errors, retain form values, and allow retry. Pending discard is deferred and freezes/restores the same form with the shared owner.
- Reference correction: StaffTimesheet is compatibility/source evidence only. Canonical dialog ownership is UI13's actual shared EditorDialog declarations/composition and shared FormSection; Fleet/Vehicle currently uses a routed editor and is not a modal reference. Canonical list integration remains Workshop Job. UI10 shared freezeFormState and UI17 shared date/time utilities own the reused behavior.
- Existing Delete now uses the shared guarded `RemoveWithChildrenAsync(id, CancellationToken.None)` owner, with no owned navigations. Entity/configuration evidence establishes only outgoing Staff/Shift references and no inbound Attendance FK. This preserves deletion of unreferenced records and adds the canonical usage check.
- Screenshots 1/4/5 are adjacent feature evidence outside the actual `Attendances/Attendance` folder. Screenshot 3's empty row area does not prove atomic multi-staff update; source-backed single-record CRUD is the reviewer decision under the standing rule. No batch endpoint or persisted state is added.

## Final manifest and decisions

| Item | Final evidence/decision |
|---|---|
| User request | 2026-10-10: review `src/app/modules/HRM/Attendances` and apply documented changes; subsequent `كمل` continues implementation |
| Source ownership | Frontend and SigmaBackend are separate Git repositories; review artifacts are local under Sigma/reviews |
| Existing changes | Both repositories already contained extensive unrelated modifications; vocabularies/resources and untracked hrm-guide were already changed. Only Attendance additions were made to those shared files |
| Frozen handoff | ATTENDANCE_DOMAIN_API_CONTRACT_FREEZE.md consolidates the dated amendment above; original narrower statements remain historical |
| PLAN-00 | Not required: routine replacement of one simple CRUD screen, no new persisted state or changed accounting/business lifecycle |
| Shape | screen01 list/modal + BE13 normal entity; source has no totals, children, posting or approval |
| Reference | Workshop Job list for list shell/filter/grid/paging/export; actual shared EditorDialog/FormSection and UI13 composition for modal. StaffTimesheet used only as compatibility evidence |
| Phase packets | PHASE-00 through PHASE-06 applied; initial recipe drift check passed; no canonical/template/manifest changes needed regeneration |
| Conditional exclusions | Nested dialogs/tabs/steps/children/uploads/reports/posting not applicable: corresponding domain data/workflows do not exist |
| Auth/permissions | Existing root token+error interceptor chain and authenticated shell; no authorization service invented. Create/Edit/Delete are future authorization candidates with POST/PUT/DELETE Attendance endpoints |
| Migration | None: entity, lengths, nullability, EF configuration, indices and relationships unchanged; only DTO nullability follows the existing entity |
| Calculations | None added. Absence does not clear clocks or calculate deductions. Server-owned fields never enter writes |

All screenshots are English/LTR desktop captures; role, capture date and product version are Unknown. S1=1.PNG shifts list, S2=2.PNG attendance list, S3=3.PNG attendance dialog, S4=4.PNG timesheet list, S5=5.PNG timesheet dialog. The user's original absolute image paths are C:/Users/user/Desktop/Attendance/{1..5}.PNG. Visible content is Explicit; paging/lookup persistence and empty-dialog batch semantics are inferred/unknown, resolved from current source as above. Screenshot styling is not implementation authority.

The final grid/property comparison, filters, write controls, endpoints, mode recovery and override reasons are in the frozen handoff. The original visible Id link is represented by shared View action and the record-ID subtitle; raw Staff/Shift lookup IDs display their actual names. Existing domain inputs remain in the editor, including the second time pair missing from the old frontend form.

### Approved-reference action coverage

| Workshop Job reference action | Attendance classification | Domain reason |
|---|---|---|
| View | Supported | same saved-record read |
| Edit | Supported | editable Attendance fields; no approval state |
| Delete | Supported | existing Attendance remove endpoint; shared confirmation and guarded service |
| Labour time | Not Applicable | no Job labour collection in Attendance |
| Invoice customer | Not Applicable | no invoice/customer financial aggregate |
| Close | Not Applicable | no Job lifecycle/closed state |
| Cancel | Not Applicable | no job cancellation state; editor Cancel is dirty exit only |
| Quality check | Not Applicable | no job inspection collection |
| Log | Not Applicable | no Attendance operation-log contract |
| Estimation | Not Applicable | no linked estimate |
| Print gate pass | Not Applicable | no gate-pass/invoiced-closed Job workflow |

Create, Search, Reset and all-pages Excel are supported list controls. Save belongs to Phase3; Delete alone requires Phase4. No ordinary Save/Search/Export confirmation was introduced.

## Final source conformance evidence

| Concern | Target consumer and producer / compared contract | Result |
|---|---|---|
| Layout | AttendancesComponent host=sigma-route-host; HTML sigma-list-page/panel/header/table; Job reference same shared owners; DataTable fill=true and one lazyLoad output | Source matched; runtime visual pending |
| Filters/actions | appFilterPanel mainColumns2, stableLayout, inlineActions+shared caption; date range one field/two months; Reset delegated; PrimaryActionButton; no filter SCSS | Source matched; two actual fields justify public column input |
| Grid | columns nine fields alongside backend ListVM nine fields+Id; actions first generated by shared DataTable; date type; known API totalCount | Source matched |
| Paging | onLazyLoad resolves previous state before writes; ignores only surface mutations/dialogs, permits switchMap cancellation while list loads; initial list starts independently of lookups | Source matched |
| Applied state | activeFilters cloned for request, Excel and returnQueryParams; draft edits without Search do not affect refresh/export; cleared date range survives route restoration | Source matched |
| Editor | DetailsComponent projects one FormSection into actual EditorDialog; mode=create/view/edit; contentPadded/focusOnShow=false; auto-height flex-fill on form/body/scroll; default shared width/max90dvh; no copied colors | Source matched; focus/scroll/RTL/theme owner acceptance pending |
| Dates/clocks | appDatePicker, shared dateValue/dateRange validators, toPickerDate/toApiDate; time-utils hydration/parser receives original saved value; nullable blank clocks stay null | Source matched; manual typing/precision pending |
| Failure/success | requests opt out of global error presentation; safe API message + both failure paths; separate loadError/saveError; global mutation success toast retained; finalize on completion/cancel/destroy | Source matched |
| Discard | canDeactivate defer captures identity/mode, shared freezeFormState, duplicate pending guard, stale response check; all modal exits use requestClose; success marks pristine | Source matched; navigation acceptance pending |
| Route identity | route paramMap + keyed editorIdentities remount after successful CanDeactivate; invalid identity closes previous child | Audit finding repaired |
| Names/projection | AttendanceProfiler scalar Staff.Name/Shift.Name; MaterializeListAsync ProjectTo after inherited query/count/order/page | Source matched; EF/AutoMapper acceptance pending |
| Delete | confirmation -> deleteAttendance -> inherited controller -> AttendanceService.RemoveAsync -> guarded helper -> one save -> applied query refresh/last-row page backup | Source matched |
| Providers | root AttendanceService/BaseService HttpClient -> AppModule withInterceptors(tokenInterceptor,errorInterceptor); LayoutModule provides no extra client | Source matched |
| Guide | HRM_GUIDE existing reader registration; Attendance topic route /Attendance; sidebar-menu-data userGuide.hrmMenuEntry -> /UserGuide/hrm | Source matched; reader/navigation/print pending |

## Changed files and guide handoff

Frontend root: `F:/My Work/Sigma/SiGmaAngularFrontEnd`.

- Existing `src/app/modules/HRM/Attendances/Attendance`: routes, list TS/HTML, details TS/HTML/SCSS, models create/details/list, service. Empty list SCSS is no longer a consumer dependency.
- Removed two obsolete generated smoke specs: list spec instantiated an unrelated widgets ListsComponent; details spec had no providers or required inputs and covered only construction. No replacement mirror tests or tests run.
- `src/app/modules/i18n/vocabs/en.ts` and `ar.ts`: matching attendance block.
- Existing untracked `src/app/modules/UserGuide/content/hrm-guide.ts`: one bilingual Attendance topic; existing unrelated HRM topics preserved.

Backend root: `F:/My Work/Sigma/SigmaBackend`.

- `SiGma.Business/Services/AttendanceService.cs`, `MapperConfig/AttendanceProfiler.cs`.
- `SiGma.ViewModels/ViewModels/Attendance/{AttendanceAddVm,AttendanceUpdateVm,AttendanceDetailVm,AttendanceListVm}.cs`; unused `AttendanceFullListVm.cs` removed.
- `SiGma.Helpers/Localization/Shared/GeneralMessage.resx` and `GeneralMessage.ar-SA.resx`: AttendanceDateRequired only; unrelated resource additions preserved.

Guide: `/UserGuide/hrm`, existing `userGuide.hrmMenuEntry` under HRM. Topic `sideMenu.attendances.attendance`, route `/Attendance`, covers prerequisites, current-month search/reset/clear, all-pages Excel, Create/View/Edit, required date/staff/shift and lengths, optional clocks, absence, retry/retained failed-save values, dirty discard and confirmed Delete. Explanation matches the one-record source contract and promises no batch payroll effect. No new reader, guide route or sidebar entry needed.

## Reconciliation and owner verification

Complete scoped Attendance diffs reviewed separately in both repositories, plus authored Attendance vocab/resource and HRM-guide additions. Exact shared imports/public inputs, generic Result wrappers, nullable contracts, stale symbols, route/provider chain, mappings, merge markers and whitespace checked. Final `git diff --check` passes scoped changed tracked files. Final Generate-SigmaRecipes.ps1 -Check passes PLAN00 and every Phase00–06 packet without drift. Runtime feature files remain on the existing compiler entry/import convention; no broad include or compiler options were added.

Shared-extraction gate: reused existing DataTable, FilterPanel, EditorDialog, FormSection, FieldError, StateMessage, primary button, date/time parsing/validation, Int32 validation, form-state snapshot, applied route utilities, API error formatting and all-pages/column export helpers. No new repeated shared mechanism qualified; business-specific Attendance fields/query bounds stay in the feature. No reusable rule was added, so owning books/skill and generated packets did not change.

Agent utilization: one bounded backend worker with inherited model owned only Attendance backend DTOs/service/mapper and its new resource key, while root owned the frontend and contracts. It then audited source read-only and found the route identity bug, integrated and repaired by root. Two non-overlapping concrete workstreams met the project delegation gate and reduced sequential implementation time; no overlapping edits.

Owner acceptance remains pending:

1. Compile frontend/backend; verify AutoMapper/EF name projection and JSON nullable clock reads/writes.
2. Check EN/AR, RTL, light/dark, desktop/narrow layout, internal scrolling, keyboard focus/return/Escape.
3. Search current month, clear/reset range, invalid partial/reversed dates, staff filter, every pager-size change and rapid paging; verify latest request wins and Excel spans multiple pages with current translated headers.
4. Create/Edit/View with both time pairs, blank clocks and saved seconds/fractions; induce lookup/read/save failures, retry and confirm values remain intact; dirty X/Cancel/Escape/back, including cancellation.
5. Navigate between valid and invalid compatibility IDs, confirm dirty decision, and ensure the URL/visible record/save ID agree.
6. Delete an unreferenced row, cancel confirmation and delete the last row on a later page; verify guarded missing/reference failure and retained applied filters.
7. Open HRM guide and Attendance topic link; verify bilingual explanations/print.

Known source-existing boundaries: single-row Date==default rejects 0001-01-01 midnight; inherited bulk Add/Update bypass single-row validation and are not called by this frontend; existing duty-schedule read retains its conditional tenant predicate and December9999 overflow risk outside the frozen CRUD slice. The app has authentication but no authorization mechanism. No schema migration is required.

No build/test/lint/typecheck/runtime/browser/database/migration/commit/push/deployment command was run. Source conformance is not a runtime pass. Suggested scoped commits only:

- Frontend: `refactor(attendance): adopt shared list and guarded editor`
- Backend: `refactor(attendance): align read and write contracts`

Stage only the enumerated Attendance files and authored shared-file additions; unrelated working-tree changes are excluded from these suggestions.

## Later user scope clarification — 2026-10-10

The user clarified that Shift and Staff Timesheet in the supplied screenshots receive the same documented treatment, and explicitly requested their folders under Attendances to match sidebar grouping. The Attendance-only exclusions above record the earlier interpretation and are superseded by ATTENDANCE_FAMILY_DOMAIN_API_CONTRACT_FREEZE.md and ATTENDANCE_FAMILY_FEATURE_REVIEW.md. ShiftService now resides under HRM/Attendances/Shift; Attendance's direct import follows it. Both Timesheet URLs use the single relocated HRM/Attendances/StaffTimesheet owner, with prior Code/Designation filters retained.
