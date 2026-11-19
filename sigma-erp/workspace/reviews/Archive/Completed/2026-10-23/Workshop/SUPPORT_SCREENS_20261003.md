# Workshop support screens source implementation

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Scope | JobCategory, LabourActivities, LabourTariff, LabourActivitiesReport, workshopVehicles |
| Authority | Sigma AGENTS.md, screen skill, frozen Workshop maintenance plan and frontend handoff; root recipe drift check passed |

## Before-edit conformance

| Concern | Book | Actual reference / shared owner | Target source finding |
|---|---|---|---|
| List bounded shell/filter/table | UI1/3/4/6 | Job list bindListQueries; FilterPanelComponent; DataTableComponent fill | JobCategoriesComponent/LabourActivitiesComponent/WorkshopVehiclesComponent use feature shell/filter SCSS; no reset; paging helper absent |
| Dialog lifecycle and validation | UI10/13/19/22/28 | Fleet VehicleService details requestClose; EditorDialogComponent; FieldErrorComponent; StateMessageComponent | Category/activity load blocks save on error but has no retry, loading is not guarded in save; controls remain mutable on persistence; local validation/error markup |
| Settings set | UI1/13/14/16 | Link Accounts details workspace tabs; EditableRows and EditableCollectionTableComponent | LabourTariffComponent owns replacement set, manually duplicates rows add/remove/replace, error and field markup |
| Report complete output | UI6/17/20/21/22 | StatementOfAccount shared report panel/grid/printing; TrailBalance report strip; ReportPrintService createSession; date-utils | LabourActivitiesReportComponent native table, local date parser and shell; no applied filter label or reset. Producer GetReportAsync does ToListAsync with no Skip/Take and no counts; all rows are returned |
| Vehicle producer | UI2/28 | WorkshopService.SearchWorkshopVehiclesAsync returns Results with page/count; CollectionMovementController.GetMovementsAsync → CollectionMovementService.GetMovements → Results<MovementDto> | Service fabricates success/default metadata via any; detail loads twice; movement map uses any, ignores declared failure |

Frozen business invariants: tariff whole-set replacement/omitted-key deletion and duplicate rejection remain by explicit historical D4; backend report owns estimated-minus-actual difference. LabourActivities GetManyAsync consumes only search despite handoff mentioning jobType filtering; preserve existing search UI and report mismatch to root. Vehicle compatibility POST route and third-party read-only behavior remain. No backend/schema/calculation/permission change.

## Final reconciliation

| Target / consumer | Final producer/value comparison | Source result |
|---|---|---|
| Category/activity lists | sigma-route-host → sigma-list-page/panel/header/table; FilterPanel main field search + appFilterActions and mandatory reset; shared grid fill/paging/counts; resolveListPaging before writes; switchMap/defer finalizes primary loader; applied search retained while paging | Matched UI1/3/4/6/28; names and nullable activity JobType preserved |
| Category/activity dialogs | Shared padded EditorDialog modes; loading/loadError block save; retryDetails; controlled discard preset; FieldError; StateMessage; form disabled during Save and restored after failure; next checks visible/id; typed {name} / {name,jobType} add, identity on update | Matched UI10/13/15/19/22/28; Name limit remains smaller backend update bound 50 |
| Tariff workspace | Shared editor page/panel and workspace tabs; fixed title/Save/type selector; one bounded editable rows viewport; EditableRows add/replace/duplicate/remove + canMutate; savedRow client marker is excluded from write payload; no feature palette, field-error or shell CSS | Matched UI1/13/14/19/22; settings replacement exception retained |
| Tariff producer | LabourRateService.SaveTariffAsync identifies set by vehicleTypeId; key staffProfileId/workshopActivityId; validates nonnegative integer time/cost and rejects duplicates; deletes omitted keys; one backend save | Preserved frozen D4. No generic upsert omission reinterpretation |
| LabourActivitiesReport request/data | getReport serializes only dateFrom/dateTo/jobNo/staffId/actualGreaterThanEstimated via toFilterParams; backend GetReportAsync ToListAsync without Skip/Take; complete rows, inclusive day range; backend estimated - (actual ?? 0) | Matched complete collection contract. False flag explicitly serializes false, equivalent producer meaning to absence |
| Labour report controls/output | Shared report fill shell/strip, appDatePicker and parseDateRange/currentMonthRange; applied successful scope and captured staff label retained while draft edits occur; form disabled while load/print; reset clears results; shared grid uses rows.length for local count, DEFAULT_PAGE_SIZE/resolveListPaging; print createSession disables paginator+scrolling and releases sigma-print-flow; Excel maps complete rows at click-time translation | Matched UI6/17/20/21/22. No existing totals/cards, so no invented summary formula |
| Workshop vehicles request | POST Workshop/vehicles spreads typed ordinary filters and pageNo/pageSize; WorkshopService.SearchWorkshopVehiclesAsync returns actual Results entities/page/count; removed fabricated success/entity-list fallback | Matched frozen compatibility read. Query cancels prior request; unsaved filter edits do not alter paging scope; empty final page retries preceding page |
| Vehicle details / recent movement | Vehicle detail fetched once; late response requires visible/id; screen name title + plate subtitle; shared states/retries/read fields/tabs; CollectionMovement GetMovements requests page1/10 and returns Results<MovementDto>, used fields explicitly typed including isClosed/movementKey | Matched, recent ten transport kept. Removed inert row View button with no action; View Movements Log remains. Shared movement table/status keys; empty is not a failure |
| Error ownership | Every owned inline list/detail/report/tariff request uses X-Skip-Error-Interceptor and apiErrorMessage; lookup requests opt into BaseService/CarModelService skip option; standard save/delete success remains global interceptor | Matched UI22. Root owns required shared helper and i18n integration |

Columns versus producer properties: Category Name ↔ id/name. Activity Name/JobType ↔ id/name/jobType. Vehicle Actions, Plate, Make, Model, Vehicle Type, KM, Fuel, Branch, Status, Registration Expiry, Insurance Expiry ↔ id/isThirdParty/plateNo/make/model/vehicleType/kMs/fuel/branch/status/registrationExpiry/insuranceExpiry. Report Job Date, Job No, Vehicle, Staff, Staff Code, Profile, Detail, Estimated, Actual, Difference ↔ jobDate/jobNo/vehiclePlateNo/staffName/staffCode/profileName/detail/estimatedMinutes/actualMinutes/differenceMinutes; jobLabourId is row identity, jobId remains existing response compatibility.

The owned frontend diff and final source were reviewed; git diff --check passes. External HEAD advanced during task (root reported 9549b83); preserved its baseline, so some earlier task changes now appear in that baseline rather than the remaining diff. No backend changed, schema effect, AutoMapper change or migration. No screenshots supplied. No build/test/lint/browser/database/migration/commit/push run. UI compile, rapid paging/refresh, rejected requests and retries, dirty close, tariff omitted-key replacement, report >100 rows print/export, Arabic/RTL/dark/narrow layout remain owner verification.

Root integration keys were sent for jobCategory.discard, labourTariff.discard, labourActivitiesReport.appliedFilters and workshopVehicles errors/movement labels/columns. Suggested frontend commit: `refactor(workshop): align support screens with shared UI contracts`.
