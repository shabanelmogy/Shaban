# Fleet frontend feature review and reconciliation — 2026-10-04

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Authorization | User requested review of `src/app/modules/Fleet` and documented fixes, then continued the same work |
| Boundary | Fleet Angular source, directly related DriverService environment import, and additive en/ar integration; backend read as evidence only |
| Contract | [Frozen frontend handoff](<FLEET_FRONTEND_CONTRACT_FREEZE.md>) |
| Business completion | Unsupported slices below remain Blocked; this status describes confirmed source fixes and does not close all Fleet functionality |
| Repository | `F:/My Work/Sigma/SiGmaAngularFrontEnd`; coordination/reviews directory is not the application repository |

## Manifest, authority and evidence

Reviewed all eighteen Fleet roots: Accidents, Alerts, DailyServiceLogs, DownloadProcessDarbTolls, DownloadProcessFines, DownloadProcessTolls, RepairedDamagesHistory, RepairVehicleDamages, ServiceBookings, ServiceChecklistItem1, ServiceItem, ServiceLog, SourceCode, Vehicle, vehicle-tracker, VehicleQRLabel, VehicleService, VehicleType.

Authority: `F:/My Work/Sigma/AGENTS.md`; `SIGMA_FEATURE_REVIEW_MASTER.md` and its owning blocks; `SIGMA_UI_PATTERNS.md` owning blocks for bounded lists, D4-2 aggregates, modal/action forms, reports, specialized workspaces and shared controls; backend pattern blocks only for existing producer/DTO/state evidence; required `.agents/skills/sigma-screen-refactor/SKILL.md`. Applicable phase packets 00–06 were read after the initial recipe check passed all eight recipes. The final read-only check now reports stale PHASE-01-domain-api, PHASE-03-detail-write and PHASE-04-domain-actions; canonical books prevail. Regeneration and semantic packet review are owner documentation work; generated files were not edited.

No screenshots, video or written business additions were supplied. Screenshot evidence tables are not applicable. Source-supported defects were implemented; missing business producers were not inferred from names, mock forms or similar APIs. No Maintenance / Evolution Plan was needed for these frozen, bounded conformance corrections.

Before-edit concern/reference decisions and final evidence are recorded in [Vehicle](<Fleet/VEHICLE_REVIEW.md>), [catalogs](<../../../Fleet/CATALOGS_REVIEW.md>), [operations](<Fleet/OPERATIONS_REVIEW.md>), and [reports](<../../../Fleet/REPORTS_REVIEW.md>). Those records retain the original freeze and subsequent factual corrections. Approved reference selection was made by shape: Workshop/Job list and routed editor; the approved field-only/modal and close-job references; Accounts/TrailBalance and Customers/StatementOfAccount reports. Existing reference source was read before consumer changes. Shared class names alone were not used as proof.

## Phases and decisions taken

| Phase / concern | Decision and reason |
|---|---|
| 0 discovery | Inventory actual routes, source, producer contracts and existing dirty changes. Fleet initially clean; unrelated Workshop/shared/styles/backend Sales edits and dictionary hunks preserved |
| 1 domain/API freeze | Keep endpoint verbs/names, wire fields, numeric values, server-owned calculations and status transitions. Record Tariff transport correction before implementation in Vehicle review |
| 2 read/grid | Bounded route/panel/header/filter/grid; 15-row default and 10/15/20/50/100 choices; resolveListPaging preserves previous state; use Filters only where producer accepts generic ListQuery |
| 3 detail/write | Vehicle, Accident and VehicleService use routed D4-2 editors because they own multiple child collections; small catalogs/actions retain shared EditorDialog. Typed full child snapshots and existing IDs are preserved |
| 4 actions | Retain only confirmed actions. Booking Pending edits/confirms, Confirmed closes, Closed is terminal. Insurance renewal, service completion/reminders remain supported; other Alerts variants are read-only |
| 5 integration | Dirty route guards, mode/return-query wiring, shared public input compatibility, scoped upload tracker lifetime and feedback ownership. DriverService now builds its URL from the active environment instead of environment.prod |
| 6 reconciliation | Compare producer/consumer/source/reference values, current scoped diff and untracked runtime files; source-only results below. Runtime/visual closure remains pending |
| Backend implementation | Skipped: frontend request and frozen compatible APIs. No backend source, controller/service override, AutoMapper, entity, EF configuration or domain calculation changed |
| Security | Existing AuthGuard and HTTP interceptor client retained. No permission API/access restriction invented; action visibility is presentation rather than security |
| Shared extraction | No new shared abstraction warranted. Existing DataTable, FilterPanel, editor shell/tabs, EditableRows, FileField/FileLink, upload tracker, state/error/date/enum/query/print utilities used; local copies removed |

## Columns beside returned properties

| Consumer | Displayed columns | Returned model fields / action metadata |
|---|---|---|
| Vehicle | plateNo, makeName, modelName, vehicleTypeName, color, status, branchName, kMs, fuel, nextRegistrationDate, nextInsuranceDate, fleetNo, engineCapacity, customField1 | Same VehicleListVM fields; id, vehicleTypeId, hasTariff required by row actions |
| ServiceItem | name | id, name |
| SourceCode | name, code | id, name, code |
| VehicleType | name, detail, notes | id, name, detail, notes |
| VehicleService | name, dueAtKMs, orMonths | id, name, dueAtKMs, orMonths |
| Accident | vehicle, accidentDateTime, movementType, refNo, whoseFault, notes, excessCharges, invoicedStatus, createdBy | These fields plus id; legacy vehicleId retained under response compatibility freeze |
| ServiceBookings | bookingNo, customerName, agreementNo, plateNo, makeAndModel, serviceDateTime, notes, cancellationReason, status | Same fields plus id, canEdit, canConfirm, canClose |
| ServiceLog | plateNo, makeAndModel, dueDate, dueKMs, performedDate, performedKMs, poNo, service, notes, serviceItems, performedItems, amount, workTypes | Same fields plus id; append-only Create/View exception |
| DailyServiceLogs document | serialNo, jobNo, vehicleNo, make, model, customer, mobileNo, services, mileage, dateAndTime, amount, amountCollected, amountPending | Exact DailyServiceReportRow fields; returned split/value metrics are additional document sections, not hidden grid fields |
| QR document | plateNo, qrValue | id, plateNo, qrValue; complete Generate contract distinct from paged CRUD list |
| Alerts variants | Actual variant columns and IDs in `FleetAlertsComponent.columns()` and operations review | Frozen FleetAlertDTO and minimum vehicle/service action identities retained. Existing backend overfetch is a compatibility exception, not a lean projection claim |

Vehicle uses top-level VehicleSearchVM filters; Accident/Bookings generic lists use shared Filters serialization, while their Report/Export endpoints keep top-level binding. ServiceLog and Alerts retain top-level search keys. Catalog Filters remain unchanged. Totals come from backend response metadata; visible client row numbers do not replace backend totals. No response DTO was silently narrowed in the backend.

## Final source conformance and reconciliation

| Path / concern | Actual compared producer and consumer | Outcome / practical limit |
|---|---|---|
| Bounded list chain | Fleet route hosts, sigma-list page/panel/header/table and DataTable fill; shared UI1 styles and Workshop/Job reference values | Local page-height/palette/pager copies removed. Main filters <=6 with advanced remainder and shared Reset; rows/paging match shared values. Visual shell sizing still owner-pending |
| Vehicle route modes | FleetVehicle_Routes create/view/edit and legacy details/:id view alias; VehicleDetailsComponent.canDeactivate | D4-2 with fixed footer, shared tabs and query-preserving return. Navigation blocks saving/upload/cleanup and confirms draft exit |
| Vehicle form/DTO | buildPayload vs VehicleAddVM/VehicleUpdateVM; shared document factory vs CustomerDocumentAddVM; warranty DTOs | All existing scalar inputs retained. IsActive and FleetNo are explicit client-editable fields. Documents/warranties preserve IDs; required/local dates and expiry ordering, integer quantities and field error/focus align with source |
| Vehicle child storage | FileField controls, DocumentUploadTracker pending/removed paths, save/discard/cleanup retry | Form disabled after payload capture and through pending discard cleanup. Failed write keeps saved files. Failed cleanup remains retry-only; Save is not repeated. Hidden tab rows remain mounted to avoid upload teardown |
| Vehicle/Tariff transport | TariffController/GetTariffByVehicleTypeId and TariffService.UpdateAsync; Rental/RentalTariff owning models and new Fleet tariff editor | Legacy fullDay/cdwInsure/mileageOk model removed with no remaining consumer. Existing Daily/null-card tariff uses rentalRates/protections/mileage/extras, saved IDs, actual enum values incl Vacation, and server duplicate rules. No new tariff selection/formula/API |
| Tariff load/write | VehicleTariffComponent.load/save/canDeactivate | Controls disabled until valid details load; typed row controls, shared confirmed removals, inline read/write failures, dirty exit and list-state return |
| Request cancellation | Fleet paged lists' Subject/switchMap/defer/finalize; read services' skip headers | Prior reads cannot overwrite later applied queries; inline errors use apiErrorMessage. Loads/errors/retries and count/pager updates stay screen-owned |
| Complete Vehicle output | VehicleSearchVM PageSize default20 vs VehicleService.SearchAsync PageSize null; search serializer explicit `pageSize=` | Print/export explicitly request pageNo1/pageSize null. Shared dataTableExportRows uses actual columns/date formats. Separate output preparation and print flags prevent list finalization from unlocking output early |
| Other complete outputs | AccidentController.Report and BookingController.Export force pageNo1/pageSize null; Daily LoadDailyJobs/GetReport and QR Generate materialize complete filtered arrays | Report/print/export consume complete producer results. No completeness claim based solely on endpoint names. All printed layers use sigma-print-flow and shared session, rather than printing a paged viewport |
| Daily metric meaning | BuildReceiptMetrics payment-method codes vs DailyServiceLogs.valueSections | receiptsForDay now uses paymentMethods label namespace; values and amount calculations remain backend-owned |
| Catalogs | ServiceItem/SourceCode shared modal modes; VehicleType fields/groups; VehicleService full checklist/parts/profiles snapshots | Details retries, stale response guards, typed validation, active enum translations. VehicleService routed aggregate and confirmed picker deselection preserve controls and saved IDs |
| Operations | Frozen booking status flags; Accident movement/image/charge ownership; Alerts existing action endpoints | Confirmations, busy guards, field focus, inline failure channels and refresh are integrated. Batch Services reminder button is visible; completion rejects invalid identity/KMs. Accident multi-image native picker retains shared validation/tracker as explicit multiple-file exception |
| Success owner | Standard mutations vs Vehicle/VehicleType/Accident save+cleanup, Accident delete+cleanup+refresh, make/model create+refresh | Standard interceptor success remains single-owned. Required composite requests suppress X-Skip-Success-Toast and show one final response success after follow-ups/loading complete. Empty response messages stay silent for save cleanup; Retry repeats only required follow-up work |
| View labels | Vehicle saved reference names; QR detail contains IDs without saved Branch/TariffGroup names | Vehicle View skips edit lookups. QR View keeps ancillary label resolution as a recorded source-supported exception; failed lookup remains visible/retryable |
| Translation/control integration | Shared FilterPanel advancedControls/advancedOpen/busy, EditableCollectionTable fillHeight, stable unique row input IDs/header keys; en/ar | Corrected unsupported public inputs, invalid else-if aliases, wrong control error links, duplicate warranty ID and image header tracking. Twelve existing legacy checklist label references receive missing translations without changing its business contract |
| Specialized missing producers | processing/damage/tracker/checklist source inventory | Only confirmed presentation/date/state improvements; no invented imports, repairs, history, coordinates, fake results or destructive route removal |

The report-filter exception is explicit: UI20's generic fetch lock conflicts with UI28's filter-edit cancellation flow in Daily/history/repair. These reads keep filters editable to cancel the in-flight read and clear stale output; Search is guarded and printing is locked. QR generation retains its reactive busy lock. This is a recorded integration decision, not a claim that every generic recipe instruction was copied. The existing VehicleQRLabel routed CRUD navigation is preserved under freeze despite its small form; changing it into a modal would alter the retained workflow.

## Blocked business slices and exact decisions required

| Slice | Missing evidence / owner decision |
|---|---|
| ServiceChecklistItem1 | Reachable legacy product/loyalty boilerplate lacks a corresponding backend controller/service/DTO family. Supply its actual CRUD/child contract or decide its route disposition before business refactor |
| DownloadProcessTolls / Fines / DarbTolls | No download/process producer, account/authentication contract or state transition exists for these forms. Supply endpoints, DTOs, matching/deduplication and processing rules; TrafficFine CRUD is not an approved importer substitute |
| RepairVehicleDamages | Vehicle context search exists; no repair command/payload or mutation-state contract. Supply the repair producer and rule before enabling the action |
| RepairedDamagesHistory | Vehicle context exists; no dated repaired-damage report response. Supply its history producer/filter/row contract |
| vehicle-tracker | No coordinates/live location producer. Supply source, identity/time contract and polling/update behavior; existing empty marker and Cairo center/honest hint retained |

These blocks prevent claiming complete Fleet business closure. Unavailable states remain honest; only affected functionality is paused. No material reviewer business assumption was introduced.

## Verification performed and pending

Performed source-only:

- Current scoped Git diff reviewed across the frontend repository, with worker-owned full diffs and root integration review; new tariff TS/HTML and wire-enums.ts explicitly read because ordinary git diff omits untracked files.
- TypeScript createSourceFile syntax parsing: 123 Fleet TS plus two vocabulary TS files; Angular parseTemplate syntax parsing: 33 Fleet HTML; zero syntax diagnostics. This does not establish type/template compilation.
- Scoped existing component binding inspection against shared public inputs plus independent Vehicle audit; corrected utility function accidentally included in component imports. No remaining unknown shared component binding in this source inspection.
- Literal translation-key inspection and AST parity: no missing Fleet literal references. Canonical Check-Translations over all actual touched Fleet namespaces: en1218/ar1218, missing en0/ar0, case-only0. Existing shared mangeDetails references are checked individually rather than repairing unrelated global vocabulary debt.
- Final scoped git diff --check: exit0. No merge markers. Direct environment URL/imports, routes, providers/interceptor headers, child IDs, DTOs, upload recovery and single feedback ownership checked. Syntax parsing is a read-only source check, not a build/test/lint run.

Owner pending:

1. Compile Angular and run relevant authorized checks. New tariff component/wire enum are imported by the route/consumers. Keep existing tsconfig pattern; add an exact runtime entry only if compilation reports a missing-file diagnostic, never a broad feature include.
2. Verify create/edit/view and return filters/page/sort; dirty Back/browser navigation; booking Confirm/Close and Alerts selection/actions; retry delayed/failed reads and both Result false/HTTP error channels.
3. Verify document/image uploads, canceled drafts, failed writes, failed post-save/delete cleanup and repeated Retry without duplicate writes; check saved child IDs and canceled removals/picker deselection.
4. Verify invalid/partial dates, focus and keyboard navigation, RTL/light/dark/narrow widths and the fixed shell with exactly one internal scroll owner.
5. Verify complete export with >20 vehicles and complete multi-page printed reports/labels; afterPrint must release locks. Verify Daily receipt labels and server-calculated values.
6. Resolve blocked business producers separately before marking the whole Fleet feature Closed. Regenerate and semantically review the stale documentation packets.

No builds, tests, lint, browser automation/application verification, database commands, migrations, model snapshot edits, commits, pushes, deployments, Sigma MCP or Graphify were run. Existing processing specs were reconciled to the changed dateRange control without running tests. Backend/mappings/calculations/schema are unchanged; Add-Migration is not required, and no migration name is suggested.

Suggested frontend commit only: `refactor(fleet): align screens with canonical UI and safe async workflows`.

## Business comparison and guide handoff — 2026-10-08

The user requested that ambiguous Fleet business behavior be completed by comparison with established ERP practice and recorded in the guide. The source remains authoritative for implemented behavior. Odoo's Fleet documentation supports scheduled/performed services with vendor, cost and odometer; SAP's maintenance documentation separates notification/order processing from completion confirmation and records performer, timing, materials, costs and counter readings. These sources support a recommended plan → booking/request → execution confirmation → reconciliation lifecycle, but do not authorize a new Sigma API, state machine, permission, importer, GPS provider or accounting posting.

The new draft plan is [FLEET_MAINTENANCE_EVOLUTION_PLAN.md](<../../../FLEET_MAINTENANCE_EVOLUTION_PLAN.md>). The in-app guide is src/app/modules/UserGuide/content/fleet-guide.ts, registered in the existing reader and linked under the Fleet sidebar. It covers the current Fleet routes, marks the legacy checklist, RepairVehicleDamages, RepairedDamagesHistory, the three external-charge screens and VehicleTracker unavailable where source producers are missing, and lists the exact decisions required before implementation. This is documentation-only; the plan is Draft and owner verification remains pending.

## Agent utilization

Canonical AGENTS.md authorized delegation after the root freeze. Disjoint catalog, operations and reports workers were used because the eighteen-module review has independent contracts/files and parallel inspection reduces elapsed time. Earlier lower-cost worker attempts were interrupted by usage limits; resumptions inherited the root model. Final catalog/report and operations workers implemented bounded source findings in their owned modules; a focused Vehicle auditor was read-only, with root implementing findings. Root owned Vehicle/tracker, dictionaries, the direct shared import, integration and this report. No peer edits were reverted or overlapping source ownership authorized. Available task summaries do not establish token/cost accounting; no measured savings are claimed.

## Files in the current scoped source diff

The list below is the actual frontend scoped diff plus untracked source at reconciliation. The dictionaries contained unrelated pre-existing edits; only required Fleet additions/formatting were integrated, preserving those hunks. Review artifacts are local files under `F:/My Work/Sigma/reviews`, outside the application repositories.

- `src/app/modules/Fleet/Accidents/components/editor/editor.component.html`
- `src/app/modules/Fleet/Accidents/components/editor/editor.component.scss`
- `src/app/modules/Fleet/Accidents/components/editor/editor.component.ts`
- `src/app/modules/Fleet/Accidents/components/list/list.component.html`
- `src/app/modules/Fleet/Accidents/components/list/list.component.scss`
- `src/app/modules/Fleet/Accidents/components/list/list.component.ts`
- `src/app/modules/Fleet/Accidents/fleet-accidents.routes.ts`
- `src/app/modules/Fleet/Accidents/services/accidents.service.ts`
- `src/app/modules/Fleet/Alerts/components/complete-service-dialog/complete-service-dialog.component.html`
- `src/app/modules/Fleet/Alerts/components/complete-service-dialog/complete-service-dialog.component.scss`
- `src/app/modules/Fleet/Alerts/components/complete-service-dialog/complete-service-dialog.component.ts`
- `src/app/modules/Fleet/Alerts/components/list/list.component.html`
- `src/app/modules/Fleet/Alerts/components/list/list.component.scss`
- `src/app/modules/Fleet/Alerts/components/list/list.component.ts`
- `src/app/modules/Fleet/Alerts/components/renew-insurance-dialog/renew-insurance-dialog.component.html`
- `src/app/modules/Fleet/Alerts/components/renew-insurance-dialog/renew-insurance-dialog.component.scss`
- `src/app/modules/Fleet/Alerts/components/renew-insurance-dialog/renew-insurance-dialog.component.ts`
- `src/app/modules/Fleet/Alerts/services/fleet-alerts.service.ts`
- `src/app/modules/Fleet/DailyServiceLogs/components/report/report.component.html`
- `src/app/modules/Fleet/DailyServiceLogs/components/report/report.component.scss`
- `src/app/modules/Fleet/DailyServiceLogs/components/report/report.component.ts`
- `src/app/modules/Fleet/DailyServiceLogs/services/daily-service-logs.service.ts`
- `src/app/modules/Fleet/DownloadProcessDarbTolls/components/list/list.component.html`
- `src/app/modules/Fleet/DownloadProcessDarbTolls/components/list/list.component.scss`
- `src/app/modules/Fleet/DownloadProcessDarbTolls/components/list/list.component.spec.ts`
- `src/app/modules/Fleet/DownloadProcessDarbTolls/components/list/list.component.ts`
- `src/app/modules/Fleet/DownloadProcessFines/components/list/list.component.html`
- `src/app/modules/Fleet/DownloadProcessFines/components/list/list.component.scss`
- `src/app/modules/Fleet/DownloadProcessFines/components/list/list.component.spec.ts`
- `src/app/modules/Fleet/DownloadProcessFines/components/list/list.component.ts`
- `src/app/modules/Fleet/DownloadProcessTolls/components/list/list.component.html`
- `src/app/modules/Fleet/DownloadProcessTolls/components/list/list.component.scss`
- `src/app/modules/Fleet/DownloadProcessTolls/components/list/list.component.spec.ts`
- `src/app/modules/Fleet/DownloadProcessTolls/components/list/list.component.ts`
- `src/app/modules/Fleet/RepairVehicleDamages/components/fleet-repair-vehicle-damages.component.html`
- `src/app/modules/Fleet/RepairVehicleDamages/components/fleet-repair-vehicle-damages.component.scss`
- `src/app/modules/Fleet/RepairVehicleDamages/components/fleet-repair-vehicle-damages.component.ts`
- `src/app/modules/Fleet/RepairedDamagesHistory/components/list/list.component.html`
- `src/app/modules/Fleet/RepairedDamagesHistory/components/list/list.component.scss`
- `src/app/modules/Fleet/RepairedDamagesHistory/components/list/list.component.ts`
- `src/app/modules/Fleet/ServiceBookings/components/editor/editor.component.html`
- `src/app/modules/Fleet/ServiceBookings/components/editor/editor.component.scss`
- `src/app/modules/Fleet/ServiceBookings/components/editor/editor.component.ts`
- `src/app/modules/Fleet/ServiceBookings/components/history/history.component.html`
- `src/app/modules/Fleet/ServiceBookings/components/history/history.component.scss`
- `src/app/modules/Fleet/ServiceBookings/components/history/history.component.ts`
- `src/app/modules/Fleet/ServiceBookings/components/list/list.component.html`
- `src/app/modules/Fleet/ServiceBookings/components/list/list.component.scss`
- `src/app/modules/Fleet/ServiceBookings/components/list/list.component.ts`
- `src/app/modules/Fleet/ServiceBookings/services/vehicle-service-bookings.service.ts`
- `src/app/modules/Fleet/ServiceItem/components/details/details.component.html`
- `src/app/modules/Fleet/ServiceItem/components/details/details.component.scss`
- `src/app/modules/Fleet/ServiceItem/components/details/details.component.ts`
- `src/app/modules/Fleet/ServiceItem/components/list/list.component.html`
- `src/app/modules/Fleet/ServiceItem/components/list/list.component.scss`
- `src/app/modules/Fleet/ServiceItem/components/list/list.component.ts`
- `src/app/modules/Fleet/ServiceItem/serviceitem.routes.ts`
- `src/app/modules/Fleet/ServiceItem/services/serviceitem.service.ts`
- `src/app/modules/Fleet/ServiceLog/components/details/details.component.html`
- `src/app/modules/Fleet/ServiceLog/components/details/details.component.scss`
- `src/app/modules/Fleet/ServiceLog/components/details/details.component.ts`
- `src/app/modules/Fleet/ServiceLog/components/list/list.component.html`
- `src/app/modules/Fleet/ServiceLog/components/list/list.component.scss`
- `src/app/modules/Fleet/ServiceLog/components/list/list.component.ts`
- `src/app/modules/Fleet/ServiceLog/services/servicelogs.service.ts`
- `src/app/modules/Fleet/SourceCode/components/details/details.component.html`
- `src/app/modules/Fleet/SourceCode/components/details/details.component.scss`
- `src/app/modules/Fleet/SourceCode/components/details/details.component.ts`
- `src/app/modules/Fleet/SourceCode/components/list/list.component.html`
- `src/app/modules/Fleet/SourceCode/components/list/list.component.scss`
- `src/app/modules/Fleet/SourceCode/components/list/list.component.ts`
- `src/app/modules/Fleet/SourceCode/services/sourcecode.service.ts`
- `src/app/modules/Fleet/Vehicle/components/details/details.component.html`
- `src/app/modules/Fleet/Vehicle/components/details/details.component.scss`
- `src/app/modules/Fleet/Vehicle/components/details/details.component.ts`
- `src/app/modules/Fleet/Vehicle/components/list/list.component.html`
- `src/app/modules/Fleet/Vehicle/components/list/list.component.scss`
- `src/app/modules/Fleet/Vehicle/components/list/list.component.ts`
- `src/app/modules/Fleet/Vehicle/components/tariff/tariff.component.html` (new)
- `src/app/modules/Fleet/Vehicle/components/tariff/tariff.component.ts` (new)
- `src/app/modules/Fleet/Vehicle/fleet-vehicle.routes.ts`
- `src/app/modules/Fleet/Vehicle/models/create.ts`
- `src/app/modules/Fleet/Vehicle/models/details.ts`
- `src/app/modules/Fleet/Vehicle/models/wire-enums.ts` (new)
- `src/app/modules/Fleet/Vehicle/services/vehicle.service.ts`
- `src/app/modules/Fleet/VehicleQRLabel/components/details/details.component.html`
- `src/app/modules/Fleet/VehicleQRLabel/components/details/details.component.scss`
- `src/app/modules/Fleet/VehicleQRLabel/components/details/details.component.ts`
- `src/app/modules/Fleet/VehicleQRLabel/components/list/list.component.html`
- `src/app/modules/Fleet/VehicleQRLabel/components/list/list.component.scss`
- `src/app/modules/Fleet/VehicleQRLabel/components/list/list.component.ts`
- `src/app/modules/Fleet/VehicleQRLabel/services/vehicleqrlabel.service.ts`
- `src/app/modules/Fleet/VehicleService/components/details/details.component.html`
- `src/app/modules/Fleet/VehicleService/components/details/details.component.scss`
- `src/app/modules/Fleet/VehicleService/components/details/details.component.ts`
- `src/app/modules/Fleet/VehicleService/components/list/list.component.html`
- `src/app/modules/Fleet/VehicleService/components/list/list.component.scss`
- `src/app/modules/Fleet/VehicleService/components/list/list.component.ts`
- `src/app/modules/Fleet/VehicleService/fleet-vehicle-service.routes.ts`
- `src/app/modules/Fleet/VehicleService/services/fleet-vehicle-service.service.ts`
- `src/app/modules/Fleet/VehicleType/components/details/details.component.html`
- `src/app/modules/Fleet/VehicleType/components/details/details.component.scss`
- `src/app/modules/Fleet/VehicleType/components/details/details.component.ts`
- `src/app/modules/Fleet/VehicleType/components/list/list.component.html`
- `src/app/modules/Fleet/VehicleType/components/list/list.component.scss`
- `src/app/modules/Fleet/VehicleType/components/list/list.component.ts`
- `src/app/modules/Fleet/VehicleType/components/manage-groups/manage-groups.component.html`
- `src/app/modules/Fleet/VehicleType/components/manage-groups/manage-groups.component.scss`
- `src/app/modules/Fleet/VehicleType/components/manage-groups/manage-groups.component.ts`
- `src/app/modules/Fleet/VehicleType/services/vehicle-type.service.ts`
- `src/app/modules/Fleet/vehicle-tracker/components/vehicle-tracker.component.html`
- `src/app/modules/Fleet/vehicle-tracker/components/vehicle-tracker.component.scss`
- `src/app/modules/Fleet/vehicle-tracker/components/vehicle-tracker.component.ts`
- `src/app/modules/i18n/vocabs/ar.ts`
- `src/app/modules/i18n/vocabs/en.ts`
- `src/app/modules/shared/service/driver.service.ts`

Documentation conformance follow-up — 2026-10-08: refreshed recipe packets were checked before this pass and all PLAN-00/PHASE-00..06 checks returned OK. Fleet list filters now opt into the shared stable layout; simple catalog/tracker filters use the shared inline action placement; report filters use the stable report strip; all Fleet PrimeNG calendars explicitly preserve invalid typed input with `keepInvalid=true` and editable input with `readonlyInput=false`; VehicleQRLabel list transport now uses `DEFAULT_PAGE_SIZE`. The Sales guide Fleet topic was updated to describe the stable filter/More filters/Search/Reset workflow. No endpoint, DTO, persistence, calculation, permission or blocked-workflow assumption was introduced. Source-only validation and owner visual/build/runtime acceptance remain pending.

### FleetAccidents filter refinement — 2026-10-08

Scope frozen by owner request: use More filters and correct Driver Age Range presentation. UI shape remains a list with routed editor; frontend-only Phase 2 refinement, no API/query/calculation changes. No delegation: one small, sequential UI task.

| Concern | Owning book | Reference / shared owner | Target decision |
|---|---|---|---|
| Main and advanced filters | UI4 | Workshop/Job list template; FilterPanelComponent and FilterAdvancedDirective | Date range, vehicle and movement type remain main (3 columns); invoice status, driver, age enable and From/To use advanced (5 columns). Closing retains draft values; Reset retains current defaults/search page 1. |
| Age checkbox and inputs | UI4 | FilterPanel shared --check and sigma-filter-field rules | Native 15px primary checkbox precedes label on 34px control line; equal grid tracks and visible From/To labels replace feature range wrapper and CSS. Preserve readonly when unchecked, limits and search validation. |
| Guide completion | Master7 | fleet-guide.ts topic /FleetAccidents, reader /UserGuide/fleet and Fleet sidebar guide entry | Explain More filters, enable age range, enter whole numbers 0–120 with To >= From, then Search. |

Recipe check: PHASE-02 is current; PHASE-03 remains stale from the previous UI14 update and is not used by this list-only refinement. Generated files not edited.

Reconciliation: Implemented — source-only; owner verification pending: yes. Final source matches the table above: standalone FilterAdvancedDirective import/registration, one reactive form, 3 main/5 advanced tracks, shared native checkbox/34px controls, no age-specific filter SCSS, unchanged Search/Reset/query/route restore and existing EN/AR labels. fleet-guide.ts now covers the /FleetAccidents filter workflow in both languages; /UserGuide/fleet reader/sidebar entry verified in source. No new reusable rule or shared extraction was needed because UI4 already owns all presentation.

Verification: scoped Angular HTML parser and TypeScript syntax parser passed; scoped git diff --check passed and complete Accidents list diff reviewed with existing calendar edits preserved. Guide content reviewed. Owner should check More filters open/close with values retained, age From/To alignment, unchecked readonly fields, valid/invalid ranges, Reset, narrow layout, RTL and dark theme. No build/tests/lint/browser/database/migration/commit/push/deploy run. No backend/DTO/mapping/calculation/schema change; Phases 1/3/4/5 not changed. Suggested frontend commit: fix(fleet-accidents): organize advanced filters and age fields

Owner correction — 2026-10-08: From/To must appear when Driver Age Range is checked. Replaced readonly always-visible fields with an Angular @if around both age fields; checkbox exposes the expanded state and references visible inputs only. Existing FormControls preserve draft values; existing search logic excludes ages while unchecked, and Reset still clears them. This supersedes the prior readonly-presentation decision only. Fleet guide EN/AR updated. Scoped syntax/diff checks passed; owner visual/checkbox/RTL acceptance pending, no prohibited commands run.

### FleetDailyServiceLogs blank-report correction — 2026-10-08

Frozen source-supported correction within the authorized Fleet implementation: route, endpoint and query are valid; DailyServiceLogReportDto and GetReportAsync supply date, serviceActivity, collectionOutstanding, receiptsForMonth, receiptsForDay, openingJobs, purchasesTillDate, paymentsOutstanding and serviceRows. The Angular model additionally invented jobsPendingClosing. valueSections passed that undefined property to metricCards, whose rows.map throws after a successful response. Remove only that unsupported Angular field/section; do not invent a pending-job producer or zero financial values.

| Concern | Book / reference | Shared owner | Final target |
|---|---|---|---|
| Complete report DTO | UI2/20, DailyServiceLogReportDto / GetReportAsync | Feature response contract | Exact nine producer fields above; remove jobsPendingClosing only |
| Document presentation | UI20; Customers/StatementOfAccount list and existing daily report | ReportPage, ReportActions, DataTable, SummaryCards | Keep all supported sections, single document frame, existing server figures/print/export |
| User guide | Master7; fleet-guide.ts topic /FleetDailyServiceLogs | Existing /UserGuide/fleet reader/sidebar | Correct single-date, auto-load/Refresh workflow and supported sections |

Phase2 source repair only; backend/schema/formulas/actions unchanged. No subagents: small sequential mismatch correction. Recipe Phase2 current, Phase3 stale (unrelated UI14; not consumed). Runtime proof remains owner pending; source proves an undefined.map fault path.

Reconciliation: Implemented — source-only; owner verification pending: yes. Removed the unsupported field and its sole section consumer. All nine frontend report fields align by name with the current backend DTO; no API change. Existing calendar/stable-strip edits preserved. Fleet guide explains the actual single date, automatic today load, Refresh, document print and service-row export. Scoped Angular/TypeScript syntax and DTO field comparison passed, git diff --check passed, scoped source diff reviewed. Owner should open the report with a successful API response, confirm all supported sections render even with no daily jobs, then check Refresh/Print/Excel. No build/tests/lint/browser/database/migration/commit/push/deploy. No shared rule/extraction needed. Suggested frontend commit: fix(daily-service-logs): match sections to report response

DailyServiceLogs internal spacing — 2026-10-08: owner requests internal spacing. UI20 document frame/feature placement and UI24 shared card/table owners retained. Existing Bootstrap p-3 adds a consistent 16px inner inset to the report content; mb-2 gives section headings 8px before their table/cards; existing 12px sibling-section gap retained. No card/table-internal CSS or financial/data/API change. Guide section-reading note updated in EN/AR. Scoped HTML/guide syntax and diff whitespace checks passed; source diff reviewed, owner visual/RTL/narrow/print verification pending. No prohibited commands run; no delegation needed. Suggested frontend commit: fix(daily-service-logs): improve report content spacing
