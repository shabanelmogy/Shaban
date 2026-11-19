# Fleet operations frontend review — 2026-10-04

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Scope | Fleet/Accidents, Alerts, ServiceBookings, ServiceLog frontend only |
| Contract handoff | ../FLEET_FRONTEND_CONTRACT_FREEZE.md |
| Evidence | Current Angular services/models + owning AccidentService, FleetAlertsService, VehicleServiceBookingService, ServiceLogService read only |

## Manifest and decisions before implementation
No screenshots supplied. Preserve endpoints, payload fields, numeric enums, backend calculation/state and append-only service logs/history. Accident is routed D4-2 (damageCharges and images); ServiceBookings one small item collection remains modal. Alerts action dialogs and variant lists retain prior FLEET_ALERTS_FEATURE_REVIEW decisions. AuthGuard only; no permissions invented. Phases 0/1 frozen by root; applicable 2/3/4/5 source fixes then 6 source reconciliation. Backend/mapping/schema changes excluded; no migration.

## Before conformance
| Concern | Owning block | Actual reference | Shared owner | Before / target |
|---|---|---|---|---|
| Container fill list | UI1/3/6 | Workshop/Job/components/list/list.component.html/ts | styles.scss, FeatureTitle, DataTable | Partial HTML shell present; host/import/SCSS/filter still custom → match bounded shared chain |
| Filters/date/paging | UI4/6/17 | Job list appFilterPanel/appDatePicker, resolveListPaging | FilterPanelDirective, DatePickerDirective, list-query/date-utils | legacy controls/local helpers → shared owner, 15 default and 10/15/20/50/100 options |
| Routed aggregate | UI1/13/14 D4-2 | Workshop/Job/components/editor/editor.component.html | sigma-editor shell, FormSection, EditableCollectionTable | Accident modal with two collections → create/edit/view routes and preserved list params |
| Action/modal state | UI13/19/22/28 | Workshop/Job/components/close-job, Fleet/VehicleService/components/details | EditorDialog, StateMessage, FieldError | custom states/local paint → shared components, single error owner and loader finalization |
| Upload lifecycle | UI18 | shared/service/document-upload-tracker.service.ts | DocumentUploadTracker/FileUploadService.upload/remove | Accident legacy uploadFile/private sets → tracker, retain failed cleanup for retry |
| Variant actions | UI6/7/26 | Fleet Alerts prior review, existing services/reminders | DataTable selection, ConfirmationDialog | Insurance only selectable → Services selection for reminders; three read-only variants preserved |

## Frozen API, columns and filters
| Feature | Grid fields beside returned list properties | Filter transport |
|---|---|---|
| Accidents | id; vehicle, accidentDateTime, movementType, refNo, whoseFault, notes, excessCharges, invoicedStatus, createdBy | Generic Filters dateFrom/dateTo/vehicleId/movementType/invoicedStatus/driverId/driverAgeFrom/driverAgeTo + paging/sort; Report top-level same keys, null size complete response |
| ServiceBookings | id + canEdit/canConfirm/canClose; vehicle, customer, serviceDateTime, contactNo, currentKMs, status, notes, serviceItems (exact source columns retained) | Generic Filters plateNo/customerId/statuses comma list/dateFrom/dateTo + paging/sort; Export top-level status repetition and null size complete response |
| ServiceLog | id; plateNo, makeAndModel, dueDate, dueKMs, performedDate, performedKMs, poNo, service, notes, serviceItems, performedItems, amount, workTypes | Top-level PlateNo/DateFrom/DateTo/InternalWorkshopId/ServiceItems/WorkType/PageNo/PageSize/SortField/SortOrder |
| Alerts | variant typed columns() retains endpoint fields; id/vehicleId/serviceId selection/action identities | Top-level existing FleetAlertSearch; null PageSize explicitly means unpaged in FleetAlertsService.ResolvePage |

List properties are preserved under freeze even where legacy API overfetch exists. Accident writes retain all saved child IDs, complete image/charge snapshots; no server tenant/audit/calculation fields added. Book/confirmation/state changes are frontend presentation and reliability only. ServiceBookings Pending can edit/confirm; Confirmed can close; Closed terminal. ServiceLog create/view only. Insurance batch renewal, Services single-row completion + batch reminder confirmation; registration/mileage/warranty read only.

## Final reconciliation
Implementation and source reconciliation below supersede the earlier pending entry. Build/test/lint/browser/database/manual theme/RTL/print acceptance remains pending owner; none authorized to execute. This is a bounded worker handoff; root owns the complete Fleet diff review and final integration.

## Final source reconciliation — 2026-10-04

The Frozen contract remains unchanged. Backend controller overrides were checked before changing request serialization: `SiGma.ServerAPI/Controller/AccidentController.cs:15–20` and `VehicleServiceBookingController.cs:16–21` set `PageNo=1` and `PageSize=null` for Report/Export. Omitting page size from their top-level frontend requests therefore preserves complete responses. The ordinary generic list serializers continue to send Filters; ServiceLog and Alerts keep their existing top-level search contracts.

The earlier ServiceBookings grid row recorded legacy DTO fields rather than the current columns. This is a factual evidence correction, not a contract change:

| Feature | Final visible columns | Final minimum identities / state | List properties and compatibility |
|---|---|---|---|
| Accidents | vehicle, accidentDateTime, movementType, refNo, whoseFault, notes, excessCharges, invoicedStatus, createdBy | id | AccidentListItem contains these plus id and existing vehicleId; retained response compatibility under the freeze |
| ServiceBookings | bookingNo, customerName, agreementNo, plateNo, makeAndModel, serviceDateTime, notes, cancellationReason, status | id, canEdit, canConfirm, canClose | VehicleServiceBookingListDTO matches the displayed fields and these action-state properties |
| ServiceLog | plateNo, makeAndModel, dueDate, dueKMs, performedDate, performedKMs, poNo, service, notes, serviceItems, performedItems, amount, workTypes | id | FleetServiceLogListDTO matches the displayed fields plus id |
| Alerts | existing type-specific columns in FleetAlertsComponent.columns() | id / vehicleId / serviceId for existing selection and actions | Existing FleetAlertDTO retained; endpoint overfetch remains a Frozen compatibility exception, not a claim of lean backend projection |

| Concern | Owning block and actual shared/reference comparison | Final source evidence / result |
|---|---|---|
| List shell, title and scrolling | UI1/3/6; Workshop/Job list host/header/FilterPanel/DataTable | All four lists use sigma-route-host → sigma-list-page/panel/header/table with app-feature-title inside header, appFilterPanel and app-data-table fill. Removed private shell, filter, table and palette SCSS; remaining Accident SCSS owns pane allocation and image preview geometry only. Runtime scroll/RTL/theme acceptance pending. |
| Paging, cancellation and errors | UI2/5/6/19/22/28; list-query, date-utils, apiErrorMessage, StateMessage and Job list | Default 15, 10/15/20/50/100 options; list cancellation starts loading within defer after prior request finalization. Inline read/write HTTP calls opt out of the global error owner; both isSuccess=false and transport errors handled. |
| Filters and options | UI4/16/17; FilterPanel, DatePicker, enumOptions and TranslateOptionsPipe | Three range filters display two calendars. ServiceLog/renewal single date masks use dd/mm/yyyy. Time fields retain shared time guards. Numeric enums keep their wire IDs; Alerts ownership is a string enum and deliberately retains keyed string options. Ordinary server selects use their owning service.getSelectList with inline feedback. |
| Accident routed aggregate | UI1/13/14/15; Workshop/Job routed editor, FormSection, EditableCollectionTable and EditableRows | Create/edit/view routes preserve list query state. Create and edit both guard unsaved exit. Shared table public inputs are fillHeight/stickyHeader; no nonexistent fill input. EditableRows owns add/remove/replace, preserves charge/image IDs and the complete typed child snapshots. |
| Accident dependent lookups and validation | UI16/17/22/28; Subject/switchMap and backend AccidentService validation | Dependent vehicle/movement reads cancel obsolete requests; save gates while reads run. Driver-age integer range 0–120/order matches SiGma.Business/Services/AccidentService.cs:47–49. Optional whoseFault clearing normalizes safely to null. Explicit all-date marker preserves cleared dates after editor return. |
| Accident stored-file lifecycle | UI18; DocumentUploadTracker, FileUploadService.upload/remove and FileLinkComponent | Shared validation/tracker owns uploaded paths and failed cleanup retries. Existing native multiple image picker is retained because shared FileField supports a single stored file; this compatibility choice preserves the existing multiple-image workflow, not a parallel lifecycle or styling owner. Saved files use FileLink and existing preview. Canceled removal cannot delete a referenced file because finishSave removes referenced paths from the tracked removed set. |
| Accident composite save/delete | UI7/18/19/22/28; mutation interceptor headers plus DocumentUploadTracker | Successful write commits snapshot once; failed post-save cleanup keeps the editor and Retry runs cleanup only. Delete retains failed image paths and pending state; Retry executes only cleanup and reload, never repeats DELETE. Composite mutations opt out of early success toast, with one final success after cleanup/reload and global-loader release. A separate delete-cleanup message accurately identifies an already deleted record. |
| Accident report | UI20/21; ReportPrintService | Existing complete report producer retained; reporting remains locked until shared afterPrint, or resets on print failure. Print data clears through shared completion. |
| Bookings edit/history/action state | UI7/13/14/15/19/22/28; EditorDialog, shared confirmation, mergeSelectOptions | Typed nonNullable text controls; failed initial details/lookups gate save and show retry. Historical selected agreement labels merge through shared helper while preserving option metadata. Selected service items and notes preserve existing payload. History identifies bookingNo. Pending edit/confirm, Confirmed close, Closed terminal remain unchanged; confirmation-pending flags prevent overlapping transitions. |
| Alerts variant actions and print | UI7/13/19/21/22/26/28; EditorTabs, ConfirmationDialog and ReportPrintService | Insurance batch renewal preserved; Services selectable for batch reminders, toolbar action restored, single-row completion retained. Registration/mileage/warranty remain read-only. Variant switching gates while print/export/reminder workflow runs; printing ends through afterPrint. Completion KMs integer validator agrees with existing backend input. |
| ServiceLog operational exception | UI13/15/16/17/19/22/28; Fleet/VehicleService details and EditorDialog | Append-only create/view retained, no edit/delete introduced. Lookup failures have independent retry and gate create; typed KMs/date payloads preserved. View uses sigma-field read presentation and MoneyPipe; translated vehicle identifier appears in dialog subtitle. |
| Focus and child accessibility | UI27; focusField and EditableRows; actual shared row context exposes index | Invalid submissions in all operation editors/actions focus the first invalid field through shared focusField. Accident charge cells and Booking item notes have matching IDs; Accident charge inputs carry translated aria labels. Image headers are distinct because shared EditableCollectionTable tracks column.header. |
| Translation and direct dependencies | UI23; shared select owners / active environment | Root integrates en/ar keys: accidents.removeChargeMessage, accidents.removeImageMessage, accidents.imageFileName, accidents.imagePreview, accidents.errors.deleteImageCleanup, fleetAlerts.remindersConfirmTitle/Message and fleetServiceLog.viewSubtitle. Shared DriverService active environment correction is root-owned and directly supports the Accident driver select. No new runtime TS file or tsconfig entry required. |

### Files and scope

Application changes are confined to 35 tracked frontend files in this workstream:

- Accidents: editor and list TS/HTML/SCSS; fleet-accidents.routes.ts; services/accidents.service.ts (8).
- Alerts: complete-service-dialog, list and renew-insurance-dialog TS/HTML/SCSS; services/fleet-alerts.service.ts (10).
- ServiceBookings: editor, history and list TS/HTML/SCSS; services/vehicle-service-bookings.service.ts (10).
- ServiceLog: details and list TS/HTML/SCSS; services/servicelogs.service.ts (7).

Unchanged logical model and route files remain untouched; root-owned dictionaries/shared changes are reported by root. Phase 0/1 decisions were Frozen by root; phases 2/3/4/5 applied as above; this worker's bounded Phase 6 reconciliation is source-only. No screenshots supplied, so no screenshot Missing/Conflicting requirements are asserted. No new business or API decision, backend source, AutoMapper, domain calculation or schema change; Add-Migration is not required.

### Verification and owner handoff

- Reviewed source against existing backend producers, payloads, route guards, shared component public inputs, state transitions and upload cleanup ownership; inspected the four-directory Git source diff in the frontend repository. Full Fleet reconciliation remains root-owned.
- Scoped git diff --check passed (exit 0); no merge markers, environment.prod imports or error: () => undefined remain in these four directories. Git line-ending warnings are conversion notices rather than whitespace failures.
- Root reported the final parser pass after the focus/image-header corrections: zero diagnostics across 125 TS files (123 Fleet plus en/ar dictionaries) and 33 HTML files; no missing literal translation keys. Syntax parsing is not Angular type/template compilation or runtime acceptance.
- No builds, tests, lint, browser/application verification, database commands, migrations, commits, pushes or deployment executed. Possible compilation/runtime risks remain until owner validation because source parsing cannot prove Angular bindings, browser focus/printing, or HTTP/backend behavior.
- Owner: compile; verify narrow/RTL/light/dark fixed-shell scrolling; initial lookup/details failures and retry; booking Confirm/Close lock behavior; Accident stale dependent lookups, null optional fault, date-filter return, multi-upload validation, saved child IDs, discarded edits, failed save/delete cleanup Retry without repeated mutation; batch reminders and insurance renewal; report/print completion; ServiceLog create/view and date/KMs validation.

Suggested frontend commit: `refactor(fleet): align operation screens with shared UI and preserve workflow cleanup`. Suggestion only; no commit performed. The final-audit worker used no subagents and preserved peer/root ownership.

## Accident driver-age filter presentation follow-up — 2026-10-04

Before edit: native age inputs were nested directly in a feature flex wrapper, outside the shared FilterPanel `.sigma-filter-field > input` paint/focus selectors. The checkbox and two raw controls therefore did not match neighboring 34px themed filters. User requested improved driver-age range formatting.

Decision/reference: UI4, Workshop/Job stableLayout/filter fields and actual FilterPanel SCSS direct-child input selectors. Keep the age checkbox plus from/to controls as one of six main filters and preserve driverAgeEnabled, readonly behavior, numeric limits and exact query/reset semantics. No API/business change. Each age input is now a direct child of a nested shared sigma-filter-field; the feature owns only a balanced minmax/auto/minmax range geometry. Checkbox/labels use existing shared utilities, IDs/for/aria-controls identify the group and controls, and the panel opts into stableLayout. No feature paint, borders, focus, theme or viewport calculation introduced.

Status: Implemented — source-only; owner visual verification pending. Only Accident list HTML/SCSS changed; this local fix does not warrant subagents. Recipe check repeats existing stale phase01/03/04 warning; canonical UI4 and valid phase02 govern. Source syntax/whitespace and exact follow-up diff are reviewed before handoff; no build/test/browser/database/migration/commit commands run. Owner checks range alignment on narrow/RTL/light/dark layouts and keyboard input. Suggested frontend commit: `fix(accidents): align driver age range with shared filters`.

### Driver-age placement refinement — 2026-10-04

User explicitly requested the age controls in the second row. Before-edit placement decision: preserve five ordinary main filters in a five-column shared main grid; put the age group afterward with sigma-filter-field--full, constrained to min(100%,360px) rather than stretching two numeric inputs across the whole strip. These are existing FilterPanel mainColumns and shared full-span facilities; no shared layout/theme changes. Wide view gets a dedicated second row; shared three-/one-column narrow breakpoints remain responsive. Control values, IDs, enabled/readonly behavior and request logic stay the same. Only list HTML/SCSS changed; source-only verification and visual owner acceptance boundary remain as above.

### Accident repeated error follow-up — 2026-10-04

User reported the error shown twice in the Accident screen. Source evidence: list and filter-option requests each own inline failures, and the template independently rendered filterError/optionError/listError/actionError. Equal backend messages could therefore appear in multiple banners although services correctly suppress interceptor error presentation. UI22's single-owner presentation and shared StateMessage remain the reference.

Changed only Accident list TS/HTML: one visibleErrors display projection retains each distinct translated visible message once, while preserving individual request error signals and their retry actions. Compare current-language text at rendering time, so raw/backend text and translated keys resolving to the same text are coalesced; differing failures remain visible. Successful applyListResult clears a previous list failure, including delete-cleanup refresh recovery. No API, filter/layout, translation, state-transition or shared component change. Source-only checks: syntax parsing and scoped whitespace/diff review; build/browser reproduction remains owner-pending. No subagent for the bounded fix; no prohibited commands run. Suggested frontend commit: `fix(accidents): deduplicate inline error messages`.

### FleetServiceLog filter alignment — 2026-10-04

User requested the filters in one row. Compared UI4 / Workshop Job stableLayout with ServiceLog: five filters used the default six-column end-aligned grid; the date field reserves feedback height while other fields do not, so controls appear on different lines. Set existing FilterPanel mainColumns=5 and stableLayout=true. The five fields occupy one equal-width row in wide layouts, with top-aligned labels/controls and bounded picker/dropdown labels. Existing shared three-/one-column breakpoints retain narrow responsiveness. No local SCSS, shared style, validation, query or API changes. Only ServiceLog list HTML changed. Template syntax and scoped diff/whitespace inspected; no build/tests/browser run. Owner visual acceptance pending. No subagent for this one-binding fix. Suggested frontend commit: fix(servicelog): align five filters in a stable row.

### FleetServiceBookings filter alignment — 2026-10-04

User requested the same row alignment correction as FleetServiceLog. UI4/reference shared FilterPanel comparison: four fields used six end-aligned columns; reserved date feedback shifted the other controls. Set mainColumns=4 and stableLayout=true; status multiSelect host/root use existing w-100 utilities so it fills its field. Wide layouts have one equal-width row; shared narrow breakpoints remain. Only list HTML changed, no query/validation/API/shared style changes. Source syntax/whitespace review performed; owner visual verification pending, no builds/tests/browser commands or subagents. Suggested frontend commit: fix(servicebookings): align filters in a stable row.

Documentation conformance follow-up — 2026-10-08: refreshed recipe packets were checked before this pass and all PLAN-00/PHASE-00..06 checks returned OK. Fleet list filters now opt into the shared stable layout; simple catalog/tracker filters use the shared inline action placement; report filters use the stable report strip; all Fleet PrimeNG calendars explicitly preserve invalid typed input with `keepInvalid=true` and editable input with `readonlyInput=false`; VehicleQRLabel list transport now uses `DEFAULT_PAGE_SIZE`. The Sales guide Fleet topic was updated to describe the stable filter/More filters/Search/Reset workflow. No endpoint, DTO, persistence, calculation, permission or blocked-workflow assumption was introduced. Source-only validation and owner visual/build/runtime acceptance remain pending.
