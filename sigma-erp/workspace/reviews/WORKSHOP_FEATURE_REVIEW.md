# Workshop feature review

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-03 |
| Final reconciliation | 2026-10-04 |

User authorizes review and confirmed fixes for Workshop. Maintenance plan and frontend handoff are Frozen. No supplied screenshots. Existing working-tree changes include Job list/routes/service/close models and invoice-customer new files, both vocabularies and shared components; preserve them. Unrelated frontend/backend changes are excluded.

Phases: PLAN00, 0,1 discovery/freeze; 2 read/grid,3 write,4 existing actions,5 wiring,6 source reconciliation. No builds/tests/lint/browser/database/migrations/commits/push/deployment.

## Before-edit conformance

| Concern | Owning blocks | Reference / shared owner | Target evidence and required correction |
|---|---|---|---|
| List host/filter/grid | UI1/3/4/6/28 | Job list bindListQueries; styles.scss; FilterPanel/DataTable | Job already uses sigma-list-page/appFilterPanel/fill/switchMap. WorkOrder and lookup lists retain local styles; migrate to same bounded chain and resolveListPaging |
| Routed editor | UI1/13/14/19 | Job editor; EditableRows; FieldError | WorkOrder has totals in a modal: current D4-2 requires routes; other aggregates retain typed form snapshot and fixed footer |
| Dates | UI17 | date-utils; appDatePicker | Estimate editor still calls toISOString; calendars across Workshop must use structured shared entry, valid parsing and local transport |
| Failures/loading | UI22/28 | Job list defer/finalize; apiErrorMessage; StateMessage | Local extractors and duplicate inline/global feedback exist; use one feedback owner and block failed detail saves |
| Reports | UI6/20/21 | TrialBalance / StatementOfAccount, DataTable / ReportPrint | Existing report output and complete-response scope must be proven against backend before replacing native tables |
| Child CRUD scaffolds | Master5 G12 | Job/WorkOrder owning aggregate editors | Investigate reachability and direct consumers; retire only proven dead roots |

## Owner compiler feedback reconciliation — 2026-10-04

Status: Implemented — source-only. Owner verification pending: yes.

Evidence: owner attachment `C:/Users/user/.codex/attachments/f965e139-3a69-438e-ba1e-601c5db71060/Pasted text.txt`. The earlier syntax-only checks did not establish type or build conformance; the supplied compiler failures remain the acceptance evidence until the owner rebuilds.

- Job editor, Estimate editor and WorkOrder details: replace `flatMap` lookup collection with typed loops compatible with the existing `es2018` library setting. Preserve saved-option order, labels and shared `mergeSelectOptions` behavior; no compiler configuration change.
- Estimate editor/list and Lubrication create: consume the real shared `EnumOption` (`id`, `key`) without local incompatible interfaces or `value` remapping. Estimate enum dropdowns and read-label lookup now bind/use `id`, following UI16.
- Estimate invalid-row focus: resolve each typed row's invalid control before combining plain focus metadata. This removes the incompatible `FormGroup.get` overload union while retaining field priority and DOM IDs (UI19).
- Close Job: the current template already uses a primary nested `@if (data(); as closing)` inside `@else`, with all `closing` references in that block. The attached `@else if` alias error describes the earlier source; its corrected form is preserved.

Follow-up source checks: scoped search found no remaining `flatMap`, local `EnumOption`, enum `option.value` access or invalid Close Job alias. Installed TypeScript syntax parsing passed for 75 Workshop `.ts` files; Angular template parsing passed for 21 templates. Scoped `git diff --check` passed, and all eight recipe drift checks passed. These are source checks only: no type-check/build/test/lint/runtime command was executed. No API, tax, persistence or frozen business contract was changed by this follow-up.

## Smaller master-detail totals — owner request 2026-10-04

Owner requests smaller total cards to preserve detail visibility. Bounded UI change: Job editor, Estimate editor and WorkOrder details. Phase3 presentation and Phase6 source reconciliation apply; backend/actions/runtime phases are unaffected. No subagents: one shared presentation change with three direct consumers.

| Concern | Owning block | Actual reference/shared owner | Before-edit finding and intended match |
|---|---|---|---|
| Card height in detail workspaces | UI14 financial summary/action strip; UI24 shared summary/KPI cards | `SummaryCardsComponent.density`, shared `.sigma-summary-card__content`, `.sigma-summary-card__icon`, `.sigma-summary-card__value` | Existing dense uses vertical icon/copy, 8px/10px padding, 24px icon and 1.05rem value; consumers allow 140–150px height. Add opt-in slim horizontal density with 6px/10px padding, 20px icon, 6px gap and 1rem value; bind row/min140/max80 in all three. Keep shared palette, money formatting, responsive wrap, keyboard scroll and print release. No private feature CSS. |

Final status: Implemented — source-only. Owner verification pending: yes. The five application files are the shared summary component `.ts`/`.scss` and the Job/Estimate/WorkOrder editor templates. All three now use slim/row/min140/max80; values, labels, formatting and footer/table placement are retained. Shared slim styles match the documented 6px/10px padding, 20px horizontal icon, 6px gaps and 1rem figures, with existing theme/RTL/print ownership. UI14/24, UI1.65 preamble, changelog and skill/history are synchronized; eight generated packets were regenerated and drift-checked. Source syntax parsing passed for the shared component and four related templates, scoped diff review and whitespace check passed. No backend/API/mapping/domain/schema change or migration; no prohibited command run. Owner checks: detail visibility, wrapped totals/keyboard scroll, long values in Arabic/English, light/dark and print. Suggested frontend commit: `fix(workshop): reduce master-detail summary card height`.

## WorkOrder first-row discount — owner request 2026-10-04

Status: Implemented — source-only. Owner verification pending: yes. Owner asks for Discount in the first row of Create New Work Order. The shared routed editor grid (UI13; `src/styles.scss` `.sigma-editor-grid`) accepts public `--sigma-editor-columns`, default four; the WorkOrder header now selects five so Date/Customer PO/Customer/Branch/Discount occupy the first desktop row. Notes remains full-width. The same shared editor serves Create/Edit/View; existing two-/one-column responsive rules remain. One template change; no form/control/calculation/API change, backend work, migration or delegation. Scoped source comparison/whitespace inspection only; no build/test/browser verification. Owner checks desktop first row and narrow-screen wrapping. Suggested frontend commit: `fix(workorder): place discount in first header row`.

## Final reconciliation

### Three-column Job/Estimate editor — owner request 2026-10-04

Owner asks for Create Job and Create Job Estimation in three columns, ordered Details → Jobs → selected Job details. UI1 shared editor shell, UI13 routed form and UI14/24 child tables/summary own the shape; actual reference symbols are styles.scss sigma-editor-form/body/scroll/grid, FormSectionComponent fill and the two existing selected-group workspaces. Before edit: master above a two-column Jobs/details workspace, capped at 43–45% height. Final source: additive shared three-pane form/body/pane classes, 240–280px master, 170–200px Jobs, remaining width for details, 10px gaps, independent internal scroll and fixed footer/slim totals. Single-column master fields; named container uses 900px two-column and 620px stacked fallback; print releases placement. Keep one routed component for Create/Edit/View per UI13. No fields, types, group/child behavior, financial formulas, payloads, routes or API contracts change. One shared layout with two direct consumers; no delegation. Phase3 presentation/Phase6 source reconciliation apply; backend/domain-action implementation skipped.

Status: Implemented — source-only. Owner verification pending: yes. Changed application files: `src/styles.scss`, Job editor `.html`/`.scss`, JobEstimation editor `.html`/`.scss`. Both templates render master/Jobs/detail siblings through ng-container formArrayName, preserving existing group/control ancestry. Master uses shared internal scroll; retired feature workspace/capped-height/responsive selectors have no scoped consumers. Source template parsing, pane-order inspection, scoped whitespace check and recipe drift checks passed. UI1/13, UI1.66 preamble, changelog and skill/history synchronized; generated packets regenerated through the existing generator. No backend/mapping/schema change or Add-Migration. No build/test/lint/browser/database/commit/push. Owner verifies desktop three columns, sidebar/narrow-width placement, each region's scroll with many fields/groups/rows, RTL, error focus, existing WorkOrder-seeded draft, Save/Cancel and Estimate print. Suggested frontend commit: `refactor(workshop): use three-pane job editors`.

### WorkOrder Create Job action — 2026-10-04

Owner authorizes the action and explicitly chooses opening the Job form to complete and Save. Frozen amendment8 records the navigation-only workflow. UI7 typed ActionList/shared ActionButton owns the menu; UI13 existing Job routed editor and UI28 subscriptions own draft loading; UI10 shared route guard owns dirty exit. Actual references: WorkOrdersComponent.moreActions/openEditor/returnQueryParams, JobEditorComponent.loadDetails/canDeactivate/close, WorkOrderService.getDetails and JobService.AddAsync/ValidateWorkOrderAsync. Existing API permits a live tenant WorkOrder and matching customer; historical action guidance is Accepted-only. Before edit: menu action absent; Job create has no source prefill or return-to-WorkOrder branch. Final source: Accepted menu navigation with busy guard, fresh detail acceptance/loading/failure gate and Retry, typed header defaults, one-distinct-vehicle default and fixed return destination with preserved list state. Initial empty job group is created independently of user-mutation gates. Saved Job payload continues to carry WorkOrderId through the existing POST Job. No backend contract, monetary conversion, state transition or automatic persistence. One sequential workflow; no delegation. Phases0/1 evidence/freeze, 2 menu, 3 editor, 5 routing and 6 source reconciliation; domain transition implementation not applicable.

Status: Implemented — source-only. Owner verification pending: yes. Changed application files: WorkOrder list `.ts`; Job editor `.ts`/`.html`; `i18n/vocabs/en.ts`/`ar.ts` for two source-load/acceptance error keys (existing workOrder.createJob label reused). Syntax parsing passed for four scripts and the template; scoped whitespace/source comparison and job/workOrder translation parity passed; recipe drift check passed. No build/test/lint/browser/database/migration/commit/push run. No backend/mapping/schema changes or Add-Migration required. Owner verifies Accepted-only menu, pending/rejected absence, fresh load failure/retry, single/multiple/no-vehicle drafts, mandatory sales person/type/vehicle validation, one Save, same-customer server rejection, and Save/Cancel/dirty Back returning to the filtered WorkOrder list. Existing backend does not require acceptance at Save and permits multiple Jobs per order; this navigation action adds no new server restriction. Suggested frontend commit: `feat(workshop): open linked job draft from work order`.

Nine live areas were reviewed: Job, JobEstimation, LubricationJob, WorkOrder, JobCategory, LabourActivities, LabourTariff, LabourActivitiesReport and workshopVehicles. WorkshopActivity remains the existing shared activity select producer. Detailed bounded source evidence is in `Workshop/WORK_ORDER_20261003.md`, `Workshop/ESTIMATION_LUBRICATION_20261003.md`, `Workshop/SUPPORT_SCREENS_20261003.md` and `Workshop/JOB_ACTIONS_20261003.md`. Their earlier observations are historical; the root amendments below supersede their tax/concurrency/preview notes.

| Concern / target symbols | Final comparison with approved owner | Result |
|---|---|---|
| List shell/title, all live lists | Shared sigma-route-host → sigma-list-page/panel/header/table; FeatureTitle; FilterPanel with Reset; shared grid fill; toolbar suppresses duplicate Workshop title | Implemented; visual acceptance pending |
| Paging/search in Job, Estimate, WorkOrder and support lists | DEFAULT_PAGE_SIZE=15, resolveListPaging compares previous page/size, switchMap/defer owns cancellation; Search updates applied snapshot; paging/actions/export use that snapshot; cleared range/status and false invoice flags survive route return | Implemented; rapid-navigation acceptance pending |
| Routed aggregates | Job/Estimate/Lubrication/WorkOrder use typed forms, shared FormSection/EditableCollectionTable/EditableRows, fixed action footer and bounded form/row scroll; mode guards and pending-state checks; route canDeactivate prevents losing changes and blocks in-flight Save | Implemented; responsive/focus acceptance pending |
| Dates | Every Workshop calendar adopts appDatePicker; no-time single dates use dateInputMask; shared date/range/datetime validators reject partial/invalid inputs; local yyyy-MM-dd / yyyy-MM-ddTHH:mm:ss payloads | Implemented; manual input acceptance pending |
| Failure/save lifecycle | Failed detail cannot Save and has Retry; primary reads/actions/saves finalize global loader; local lookups have local busy/retry; forms and collection handlers freeze submitted snapshots; late removal confirmation rechecks eligibility | Implemented; failure-channel acceptance pending |
| Modes/lookups | View reads returned names and server totals; Job closed details are read-only; saved selected labels merge through mergeSelectOptions; Estimate vehicle requests cancel stale identity and use one inline failure owner | Implemented |
| Lubrication display exception | Detail lacks customer/vehicle display names, so existing selects remain required for View labels; returned makeAndModel remains authoritative fallback; lookup failure has inline retry without inventing a new required field | Source-supported compatibility exception |
| Estimate logs | Shared FileField/FileLink and component-owned DocumentUploadTracker retain original filename/path, pending uploads across failed Save, cleanup Retry after successful Save/discard; full notes/attachments select shared wrapped cells | Implemented; upload/orphan/long-content acceptance pending |
| Operational dialogs | Job close uses shared StateMessage, FieldError, StepForm, editable rows and SummaryCards; labour times/time logs use typed DataTable; stale IDs cancel loads, read failures retry, locked logs cannot mutate, unsaved entered minutes require discard | Implemented; dialog/runtime acceptance pending |
| Reports | Estimate collects every confirmed page via fetchAllPages; labour report producer is complete ToListAsync; shared grid/ReportPrintSession release internal bounds and preserve applied-filter scope for all-row print/Excel | Implemented; >100-row print/export acceptance pending |
| Settings | Tariff uses one typed replacement set, duplicate checking and confirmed row removal; savedRow client marker never enters payload; omitted-key deletion remains the explicit frozen business exception | Preserved; whole-set acceptance pending |
| Workshop vehicles | Actual typed POST Results metadata retained; Vehicle detail fetched once; recent movement request remains page1/10, typed and read-only; no inert View action or fabricated success | Implemented |
| WorkOrder persistence | Tracked live children; OwnsAll rejects foreign/negative/duplicate saved IDs; RemoveDroppedAsync checks omitted dependencies; scalar mapping ignores manually reconciled collection; ReconcileOwned + one SaveUpdateAsync; deletion removes owned children | Implemented; EF/history acceptance pending |
| WorkOrder workflow | Only NotAccepted can edit/accept/reject; terminal actions reject repeated attempts; Update/Accept/Reject/Remove share tenant/type application lock across check and save | Implemented for participating live paths; cross-writer residual below |
| Mapping/read shapes | Directional lean WorkOrder maps; no read→entity ReverseMap; only manually reconciled WorkOrderItems ignored; inherited isolated deep detail retained; ListVM explicit displayed/action properties | Implemented; mapping execution pending |
| Translations/shared extraction | en/ar parity; shared dates/removal/FileField metadata/print/wrapped-cell adapters are additive; owning UI5/14/17/18/21 blocks and skill/history updated, UI book1.64, packets generated by utility | Implemented; owner visual/input acceptance pending |

## Grid, filter and input contracts

| Feature | Columns beside consumed row properties | Filter/payload decisions |
|---|---|---|
| Job mixed grid | Actions, no, estimationNo, vehicle, customerName, customerCode, createdBy, totalCharges, dateAndTime, estimatedCompletionTime, branch, status, insuranceCompany; No also displays invoice state. Model: those fields + id, recordKey, recordType, hasInvoice | recordType/no/estimationNo/workOrderNo/status/hasInvoice/customerId/dateFrom/dateTo/plateNoOrChassisNo/jobType/branchId/ownership/createdBy/insuranceCompany retain producer keys. Zero enum and false flag preserved. Actions dispatch by recordType/recordKey; no new backend grid shape |
| Estimate list/report | Actions, no with approval badge, vehicle, customer, customerCode, createdBy, totalCharges, dateAndTime, status, insuranceCompany. Model: id/no/vehicle/customer/customerCode/createdBy/totalCharges/dateAndTime/status/approvalStatus/insuranceCompany/hasJob | Existing no/customerId/approvalStatus/dateFrom/dateTo/plateNoOrChassisNo/status/jobType/branchId/createdBy/insuranceCompany. Add/Update send datetime/customerId/vehicleId/mileage and full typed groups with editable fields + saved identities; names, price, charges, tax and totals omitted |
| WorkOrder | Actions/no/date/customer/customerNo/branch/vehicle/totalAmount/discount/netAmount/status; No includes acceptance badge. VM: Id/No/Date/Customer/CustomerNo/Branch/Vehicle/TotalAmount/Discount/NetAmount/Status/AcceptanceStatus | workOrderNo/customerPONo/status/acceptanceStatus/customerId/branchId/vehicleId/chassisNo/dateFrom/dateTo. Id-desc fixed ordering; no advertised sort. Add/Update header date/customerPONo/notes/customerId/branchId/discount + full WorkOrderItems description/vehicleId/amount and update-only saved id. Tax/AmountPlusTax/TotalAmount/NetAmount/state omitted |
| Category/activity | Name ↔ id/name; Name/JobType ↔ id/name/jobType | Search only; optional activity JobType editable, no invented list jobType filter. Existing backend limits retained |
| Vehicles | Actions/Plate/Make/Model/Type/KM/Fuel/Branch/Status/RegistrationExpiry/InsuranceExpiry ↔ id/isThirdParty/plateNo/make/model/vehicleType/kMs/fuel/branch/status/registrationExpiry/insuranceExpiry | Existing typed POST read filters/page/count; third-party read-only; no new write contract |
| Labour report | Job Date/Job No/Vehicle/Staff/Code/Profile/Detail/Estimated/Actual/Difference ↔ jobDate/jobNo/vehiclePlateNo/staffName/staffCode/profileName/detail/estimatedMinutes/actualMinutes/differenceMinutes; jobLabourId row identity | dateFrom/dateTo/jobNo/staffId/actualGreaterThanEstimated; complete response; backend estimated−actual owns difference; no invented totals |
| Lubrication/tariff | Owned collections rather than a new generic list | Lubrication jobDate/customerId/items(vehicleId,smr,serviceDate,consumable,quantity, saved id on update); makeAndModel omitted. Tariff vehicleTypeId/rows(staffProfileId,workshopActivityId,timeInMinutes,cost), full replacement |

RequiredIf is checked at the actual Estimate HTTP boundary: selected ItemId means UnitPrice>0; selected StaffId means Cost>0. Zero without a selected reference remains valid where the existing contract permits it. The root fixed interrupted-worker duplicate returns, retained server-derived View values, merged saved lookup labels and replaced unsuppressed vehicle display requests with typed feature-service wrappers. Existing two stale Job/activity spec imports were corrected, with no new tests or test execution.

## Owner-approved WorkOrder tax amendment

Owner: “الصح ايه مش لازم تمشى على اللى كان موجود”, then “نعم، نفس نسبة ضريبة الورشة”. Frozen amendment5 replaces the earlier client-entered absolute Tax contract.

- WorkOrderService injects existing ITaxPolicyService. Add/Update read the current standard rate server-side. GET WorkOrder/options returns only effectiveTaxRatePercent for display preview.
- Each live line amount rounds at the established two-decimal scale. VatPolicy.AllocateDocumentTax taxes the summed rounded amount once at the rate and distributes the rounded tax, with the largest amount/first-tie remainder. Persisted line Tax and AmountPlusTax are server-owned; header TotalAmount sums live gross, Discount rounds, NetAmount subtracts that absolute discount.
- Frontend Tax is read text; Add/Update cannot supply it. Preview uses shared allocateDocumentTax/roundMoney and an unavailable marker until options load; failed options blocks Save. Backend policy wins if settings change between preview and Save.
- Existing discount timing remains post-tax; no exemption input, tax-inclusive price interpretation, accounting journal, schema, backfill or mass repricing was introduced. View/print preserve existing saved tax. An authorized Edit recalculates the remaining lines using current settings.
- Job/Estimate already calculate tax server-side. Estimate preview now mirrors its source-confirmed two-decimal rounded taxable subtotal through shared documentTax; authoritative View remains the returned TaxAmount/TotalCharges. Lubrication has no tax field and gains no monetary policy.

## Actions, wiring and boundaries

Job keeps existing close/invoice-customer/time-log endpoints and atomic close-plus-optional-invoice flow. Existing invoice-customer work and its financial contract were preserved. Estimate keeps pending approval/rejection, converted-job guards and append-only logs. WorkOrder keeps its historically deferred Create Job workflow; the enabled no-op was removed, with no invented conversion endpoint. Repeated terminal approval operations now fail at the backend.

AuthGuard authenticates only; no permissions were invented or claimed secure. Existing lazy live roots and root services remain. Four proven unused frontend child CRUD roots (JobItem, JobMisc, JobExternalWork, WorkOrderItem; 52 files) and their registrations were removed after scoped sidebar/live-consumer proof. Child aggregate forms remain. Backend standalone child APIs and their old DTOs remain untouched; that compatibility isolation avoids changing unreviewed callers.

One attempted bulk shell deletion was rejected by automatic review before execution; the exact audited file manifest was subsequently removed with apply_patch. No filesystem enumeration was passed between shells, and no user/peer files were deleted outside that manifest.

## Source verification and remaining limits

Root reviewed integration source and repository diffs separately, using worker-owned complete diff evidence plus direct root review of lists/editors/actions/models/routes/services/styles, backend WorkOrder, shared adapters, localization and document changes. Source parsing is read-only and is not compilation or application verification.

| Check | Result |
|---|---|
| TypeScript source syntax, UTF-8 and local import resolution | 85 scoped files, zero unresolved imports/parse errors after repairs; two legacy dash bytes normalized to UTF-8 |
| Angular template syntax parser | 21 Workshop templates, zero errors after fixing invalid @else-if alias in Close |
| Static Workshop/shared key references | No missing statically named keys; dynamic enum/preset families reviewed from source |
| en/ar scoped parity | 823 keys in each, zero missing and zero case-only differences after final time-log keys |
| Recipe drift | All eight generated plan/phase packets pass; regenerated from canonical sources, no direct generated edits |
| Git diff whitespace | Frontend scoped paths and backend owned paths pass |
| Stale runtime roots/merge markers/native dates/UTC feature transport | No live imports of four retired roots; no scoped merge markers or native date inputs; no Workshop toISOString use. Legacy shared parseFlexibleDate remains marked Legacy and unused by these changes |
| Backend resources | Five additive WorkOrder message keys per language; existing save messages retained; both XML documents parse and have zero duplicate keys |

Runtime/build/browser/database acceptance stays pending. Relevant risks: backend mapper/deep-read behavior and tenant ownership require execution; application-lock SQL availability/timeouts must be verified. The lock serializes participating WorkOrder Update/Accept/Reject/Remove only; concurrent Job creation and retained standalone child/batch APIs do not share it, so no cross-writer guarantee is claimed. Legacy batch helpers bypass feature-specific Add/Update cores and standalone child APIs still permit old child writes; those unconsumed compatibility endpoints require a separate producer review before reuse. Financial inputs near decimal limits can overflow; no unsupported cap was invented. JavaScript previews may differ at extreme precision; persisted decimal backend values remain authoritative.

The working trees were shared with other work. External HEAD updates were observed (frontend9549b83 and backend22483bf4 at inspection), and unrelated Sales/Fleet/translation/wiring changes and externally created SalesCycleCompletion migrations were preserved. This task created no migration and performed no commit. Current WorkOrderItem entity diff is external whitespace only, excluded from task-owned changes.

## Files, phases and handoff

Exact current-path manifest is appended below. Earlier task writes incorporated by external HEAD updates are still covered by the feature/worker ownership descriptions; the manifest is a working-tree snapshot, not a claim that every external diff hunk was authored here. In mixed files, only Workshop registration/title/translation changes are task-owned.

PLAN00 and Phase0/1: existing-state discovery, impact map, approved references, frozen contracts and recorded amendments. Phase2: lists/filter/paging/typed reads/complete output. Phase3: typed aggregate/dialog fields, child ownership, upload/date/mode handling. Phase4: existing legal domain actions and failure/confirmation lifecycle. Phase5: routes/guards/providers/title/interceptor integration. Phase6: source comparisons/diff/translation/drift reconciliation. Runtime execution and schema migration are not applicable to this authorized source-only handoff; no new business feature or permission layer was added.

No Add-Migration is required for task-owned changes: no persisted entity or EF configuration changed. Owner should deploy compatible frontend/backend versions together because WorkOrder now relies on options and server-calculated tax. Suggested commits only: frontend `refactor(workshop): align screens and tax previews with shared contracts`; backend `fix(workshop): calculate work order tax and reconcile owned lines`; documentation `docs(ui): record workshop shared validation and output adapters`.

Owner verification:

1. Compile both repositories, then open every live Workshop list/editor/dialog in Arabic/English, RTL/light/dark and narrow widths; confirm one title and bounded scrolling.
2. Verify Search versus draft filter changes, Reset, zero enums/false flags, date clear/order/invalid/manual input, size15, rapid paging, stale responses and list return state.
3. Fail detail/options/lookups/Save in both Result and HTTP channels; verify Retry, one message, no stuck loader, preserved snapshot, disabled mutation and dirty navigation. Confirm successful Save/Save-and-Print navigates without duplicate discard.
4. WorkOrder: add/edit saved/new/omitted lines, reject duplicate/foreign/negative IDs and nonpositive/deleted references, check omitted used lines cannot be removed; verify owned soft deletion and Job dependency.
5. WorkOrder: configured rates including0, unequal/tiny multi-line amounts and midpoint rounding; sum allocated Tax against rounded document tax and gross/net; send forged Tax/totals/state and ensure ignored. Change settings between preview and Save, and compare old-record View with authorized Edit recalculation. Discount retains existing post-tax timing.
6. Concurrent WorkOrder edits/accept/reject/delete, repeated terminal requests, lock timeout/rollback; separately reproduce/report legacy child/batch/Job creation dependency boundaries.
7. Estimate: referenced zero prices/costs fail, allowed unreferenced zero remains; conversion/approval gates; long logs and attachment names; upload replacement/removal, failed Save, cleanup failure and retry without a second log save.
8. Job close existing/new invoice, invoice tax allocation, labour time add/delete/locked cases, dirty entered-minutes close. Tariff duplicate/omitted-key replacement. Print/Excel more than100 rows and verify the applied complete scope and restored paging.

Delegation was required by Sigma AGENTS after contracts were Frozen: three non-overlapping inherited-model workers handled WorkOrder; Estimate+Lubrication; support screens then Job action dialogs. Root owned shared contracts, Job integration, deletion proof, tax amendment, translations/docs and final reconciliation. Bounded teams reduced repeated UI implementation time. Workers reached account usage limits during their final turns; root finished the remaining integration/repairs and acceptance report rather than treating interrupted worker reports as complete. No overlapping writes were intentionally delegated; existing peers were preserved.

No builds, tests, lint, browser/app verification, database commands, migrations, commits, pushes or deployment were run by this task. No Sigma MCP, Graphify or full-solution scan was used.

## Current scoped file manifest

Frontend repository: F:/My Work/Sigma/SiGmaAngularFrontEnd. Mixed wiring/vocab files include preserved external hunks; only Workshop edits are owned by this task.

```text
M	src/app/_metronic/layout/components/toolbar/toolbar.component.ts
M	src/app/_metronic/layout/layout.module.ts
M	src/app/modules/Workshop/Job/components/close-job/close-job.component.html
M	src/app/modules/Workshop/Job/components/close-job/close-job.component.scss
M	src/app/modules/Workshop/Job/components/close-job/close-job.component.ts
M	src/app/modules/Workshop/Job/components/editor/editor.component.html
M	src/app/modules/Workshop/Job/components/editor/editor.component.scss
M	src/app/modules/Workshop/Job/components/editor/editor.component.ts
M	src/app/modules/Workshop/Job/components/labour-time/labour-time.component.html
M	src/app/modules/Workshop/Job/components/labour-time/labour-time.component.scss
M	src/app/modules/Workshop/Job/components/labour-time/labour-time.component.ts
M	src/app/modules/Workshop/Job/components/list/list.component.html
M	src/app/modules/Workshop/Job/components/list/list.component.spec.ts
M	src/app/modules/Workshop/Job/components/list/list.component.ts
M	src/app/modules/Workshop/Job/components/time-logs/time-logs.component.html
M	src/app/modules/Workshop/Job/components/time-logs/time-logs.component.scss
M	src/app/modules/Workshop/Job/components/time-logs/time-logs.component.ts
M	src/app/modules/Workshop/Job/job.routes.ts
M	src/app/modules/Workshop/Job/services/job.service.ts
M	src/app/modules/Workshop/JobCategory/components/details/details.component.html
M	src/app/modules/Workshop/JobCategory/components/details/details.component.ts
M	src/app/modules/Workshop/JobCategory/components/list/list.component.html
M	src/app/modules/Workshop/JobCategory/components/list/list.component.ts
M	src/app/modules/Workshop/JobEstimation/components/editor/editor.component.html
M	src/app/modules/Workshop/JobEstimation/components/editor/editor.component.scss
M	src/app/modules/Workshop/JobEstimation/components/editor/editor.component.ts
M	src/app/modules/Workshop/JobEstimation/components/list/list.component.html
M	src/app/modules/Workshop/JobEstimation/components/list/list.component.scss
M	src/app/modules/Workshop/JobEstimation/components/list/list.component.ts
M	src/app/modules/Workshop/JobEstimation/components/logs/logs-dialog.component.html
M	src/app/modules/Workshop/JobEstimation/components/logs/logs-dialog.component.scss
M	src/app/modules/Workshop/JobEstimation/components/logs/logs-dialog.component.ts
M	src/app/modules/Workshop/JobEstimation/components/report/report.component.html
M	src/app/modules/Workshop/JobEstimation/components/report/report.component.scss
M	src/app/modules/Workshop/JobEstimation/components/report/report.component.ts
M	src/app/modules/Workshop/JobEstimation/jobestimation.routes.ts
M	src/app/modules/Workshop/JobEstimation/services/jobestimation.service.ts
D	src/app/modules/Workshop/JobExternalWork/components/details/details.component.html
D	src/app/modules/Workshop/JobExternalWork/components/details/details.component.scss
D	src/app/modules/Workshop/JobExternalWork/components/details/details.component.spec.ts
D	src/app/modules/Workshop/JobExternalWork/components/details/details.component.ts
D	src/app/modules/Workshop/JobExternalWork/components/list/list.component.html
D	src/app/modules/Workshop/JobExternalWork/components/list/list.component.scss
D	src/app/modules/Workshop/JobExternalWork/components/list/list.component.spec.ts
D	src/app/modules/Workshop/JobExternalWork/components/list/list.component.ts
D	src/app/modules/Workshop/JobExternalWork/jobexternalwork.routes.ts
D	src/app/modules/Workshop/JobExternalWork/models/create.ts
D	src/app/modules/Workshop/JobExternalWork/models/details.ts
D	src/app/modules/Workshop/JobExternalWork/models/list.ts
D	src/app/modules/Workshop/JobExternalWork/services/jobexternalwork.service.ts
D	src/app/modules/Workshop/JobItem/components/details/details.component.html
D	src/app/modules/Workshop/JobItem/components/details/details.component.scss
D	src/app/modules/Workshop/JobItem/components/details/details.component.spec.ts
D	src/app/modules/Workshop/JobItem/components/details/details.component.ts
D	src/app/modules/Workshop/JobItem/components/list/list.component.html
D	src/app/modules/Workshop/JobItem/components/list/list.component.scss
D	src/app/modules/Workshop/JobItem/components/list/list.component.spec.ts
D	src/app/modules/Workshop/JobItem/components/list/list.component.ts
D	src/app/modules/Workshop/JobItem/jobitem.routes.ts
D	src/app/modules/Workshop/JobItem/models/create.ts
D	src/app/modules/Workshop/JobItem/models/details.ts
D	src/app/modules/Workshop/JobItem/models/list.ts
D	src/app/modules/Workshop/JobItem/services/jobitem.service.ts
D	src/app/modules/Workshop/JobMisc/components/details/details.component.html
D	src/app/modules/Workshop/JobMisc/components/details/details.component.scss
D	src/app/modules/Workshop/JobMisc/components/details/details.component.spec.ts
D	src/app/modules/Workshop/JobMisc/components/details/details.component.ts
D	src/app/modules/Workshop/JobMisc/components/list/list.component.html
D	src/app/modules/Workshop/JobMisc/components/list/list.component.scss
D	src/app/modules/Workshop/JobMisc/components/list/list.component.spec.ts
D	src/app/modules/Workshop/JobMisc/components/list/list.component.ts
D	src/app/modules/Workshop/JobMisc/jobmisc.routes.ts
D	src/app/modules/Workshop/JobMisc/models/create.ts
D	src/app/modules/Workshop/JobMisc/models/details.ts
D	src/app/modules/Workshop/JobMisc/models/list.ts
D	src/app/modules/Workshop/JobMisc/services/jobmisc.service.ts
M	src/app/modules/Workshop/LabourActivities/components/details/details.component.html
M	src/app/modules/Workshop/LabourActivities/components/details/details.component.ts
M	src/app/modules/Workshop/LabourActivities/components/list/list.component.html
M	src/app/modules/Workshop/LabourActivities/components/list/list.component.spec.ts
M	src/app/modules/Workshop/LabourActivities/components/list/list.component.ts
M	src/app/modules/Workshop/LabourActivitiesReport/components/report/report.component.html
M	src/app/modules/Workshop/LabourActivitiesReport/components/report/report.component.scss
M	src/app/modules/Workshop/LabourActivitiesReport/components/report/report.component.ts
M	src/app/modules/Workshop/LabourActivitiesReport/services/labour-activities-report.service.ts
M	src/app/modules/Workshop/LabourTariff/components/labour-tariff/labour-tariff.component.html
M	src/app/modules/Workshop/LabourTariff/components/labour-tariff/labour-tariff.component.scss
M	src/app/modules/Workshop/LabourTariff/components/labour-tariff/labour-tariff.component.ts
M	src/app/modules/Workshop/LabourTariff/services/labour-tariff.service.ts
M	src/app/modules/Workshop/LubricationJob/components/create/create.component.html
M	src/app/modules/Workshop/LubricationJob/components/create/create.component.scss
M	src/app/modules/Workshop/LubricationJob/components/create/create.component.ts
M	src/app/modules/Workshop/LubricationJob/lubricationjob.routes.ts
M	src/app/modules/Workshop/LubricationJob/services/lubricationjob.service.ts
M	src/app/modules/Workshop/WorkOrder/components/details/details.component.html
M	src/app/modules/Workshop/WorkOrder/components/details/details.component.scss
M	src/app/modules/Workshop/WorkOrder/components/details/details.component.spec.ts
M	src/app/modules/Workshop/WorkOrder/components/details/details.component.ts
M	src/app/modules/Workshop/WorkOrder/components/list/list.component.html
M	src/app/modules/Workshop/WorkOrder/components/list/list.component.scss
M	src/app/modules/Workshop/WorkOrder/components/list/list.component.spec.ts
M	src/app/modules/Workshop/WorkOrder/components/list/list.component.ts
M	src/app/modules/Workshop/WorkOrder/models/create.ts
M	src/app/modules/Workshop/WorkOrder/models/details.ts
M	src/app/modules/Workshop/WorkOrder/models/list.ts
M	src/app/modules/Workshop/WorkOrder/services/workorder.service.ts
M	src/app/modules/Workshop/WorkOrder/workorder.routes.ts
D	src/app/modules/Workshop/WorkOrderItem/components/details/details.component.html
D	src/app/modules/Workshop/WorkOrderItem/components/details/details.component.scss
D	src/app/modules/Workshop/WorkOrderItem/components/details/details.component.spec.ts
D	src/app/modules/Workshop/WorkOrderItem/components/details/details.component.ts
D	src/app/modules/Workshop/WorkOrderItem/components/list/list.component.html
D	src/app/modules/Workshop/WorkOrderItem/components/list/list.component.scss
D	src/app/modules/Workshop/WorkOrderItem/components/list/list.component.spec.ts
D	src/app/modules/Workshop/WorkOrderItem/components/list/list.component.ts
D	src/app/modules/Workshop/WorkOrderItem/models/create.ts
D	src/app/modules/Workshop/WorkOrderItem/models/details.ts
D	src/app/modules/Workshop/WorkOrderItem/models/list.ts
D	src/app/modules/Workshop/WorkOrderItem/services/workorderitem.service.ts
D	src/app/modules/Workshop/WorkOrderItem/workorderitem.routes.ts
M	src/app/modules/Workshop/workshopVehicles/components/details/details.component.html
M	src/app/modules/Workshop/workshopVehicles/components/details/details.component.scss
M	src/app/modules/Workshop/workshopVehicles/components/details/details.component.ts
M	src/app/modules/Workshop/workshopVehicles/components/list/list.component.html
M	src/app/modules/Workshop/workshopVehicles/components/list/list.component.scss
M	src/app/modules/Workshop/workshopVehicles/components/list/list.component.ts
M	src/app/modules/Workshop/workshopVehicles/models/list.ts
M	src/app/modules/Workshop/workshopVehicles/services/workshopVehicles.service.ts
M	src/app/modules/i18n/vocabs/ar.ts
M	src/app/modules/i18n/vocabs/en.ts
M	src/app/modules/shared/components/data-table/data-table.component.scss
M	src/app/modules/shared/components/editable-collection-table/editable-collection-table.component.html
M	src/app/modules/shared/components/editable-collection-table/editable-collection-table.component.ts
M	src/app/modules/shared/components/file-field/file-field.component.ts
M	src/app/modules/shared/components/form-section/form-section.component.scss
M	src/app/modules/shared/service/car-model.service.ts
M	src/app/modules/shared/utils/date-utils.ts
M	src/app/modules/shared/utils/editable-rows.ts
M	src/app/pages/routing.ts
```

Backend repository: F:/My Work/Sigma/SigmaBackend. External entity whitespace and Sales migrations are excluded.

```text
M	SiGma.Business/IServices/IWorkOrderService.cs
M	SiGma.Business/MapperConfig/WorkOrderProfiler.cs
M	SiGma.Business/Services/WorkShopServices/WorkOrderService.cs
M	SiGma.Helpers/Localization/Shared/GeneralMessage.ar-SA.resx
M	SiGma.Helpers/Localization/Shared/GeneralMessage.resx
M	SiGma.ServerAPI/Controller/WorkOrderController.cs
M	SiGma.ViewModels/ViewModels/WorkOrder/WorkOrderAddVm.cs
M	SiGma.ViewModels/ViewModels/WorkOrder/WorkOrderDetailVm.cs
M	SiGma.ViewModels/ViewModels/WorkOrder/WorkOrderListVm.cs
M	SiGma.ViewModels/ViewModels/WorkOrder/WorkOrderUpdateVm.cs
A (untracked)	SiGma.ViewModels/ViewModels/WorkOrder/WorkOrderLineAddVM.cs
A (untracked)	SiGma.ViewModels/ViewModels/WorkOrder/WorkOrderLineDetailVM.cs
A (untracked)	SiGma.ViewModels/ViewModels/WorkOrder/WorkOrderLineUpdateVM.cs
A (untracked)	SiGma.ViewModels/ViewModels/WorkOrder/WorkOrderOptionsVM.cs
A (untracked)	SiGma.ViewModels/ViewModels/WorkOrder/WorkOrderReferenceVM.cs
A (untracked)	SiGma.ViewModels/ViewModels/WorkOrder/WorkOrderVehicleReferenceVM.cs
```

Instruction/document changes: F:/My Work/Sigma/.agents/skills/sigma-screen-refactor/SKILL.md; canonical sigma-erp/ui/00-preamble.md, 05-columns.md, 14-editable-collection-table.md, 17-dates.md, 18-documents-and-upload.md, 21-report-print.md; CHANGELOG.md; all eight recipe-system/generated plan/phase packets regenerated. Review artifacts: maintenance plan, contract freeze, this feature review and four bounded Workshop evidence reports.

## Numeric input and price-row refinement — 2026-10-04

Owner instruction: correct the price cell appearance and allow immediate typing into any numeric field without deleting the initial zero. Scope: the nine Workshop templates containing native numeric controls; source-only execution boundary remains in force. No supplied screenshot for this refinement. Existing tax, amount precision, calculation and payload contracts remain frozen.

Before-edit conformance evidence:

| Concern | Owning block | Inspected reference/symbol | Shared owner | Target decision |
|---|---|---|---|---|
| Row control geometry | UI14, Master5 | EditableCollectionTable SCSS numeric controls: 34px height, 7px/9px padding, top-aligned cells | Shared table stylesheet | Preserve geometry; opt-in numeric alignment/appearance uses shared styles rather than feature CSS. |
| Price/charges read cells | UI14, UI19 | Job/JobEstimation editor item price and labour charges render bare spans alongside 34px controls | Shared table value class | Add a text-only numeric value treatment on the same 34px line; preserve money formatting and derived ownership. |
| Immediate numeric overwrite | UI27; explicit owner instruction | Shared DatePickerDirective standalone declaration; existing native type=number inputs and Angular numeric controls | New opt-in NumericFocusDirective | Import in nine direct consumers; select existing content on focus and first pointer click, without clearing or writing controls, synthetic events, or changing native input type. Subsequent clicks allow ordinary caret editing; disabled/read-only inputs excluded. |
| Integration | UI1; Phase5 | Nine standalone Workshop consumers (Job editor/close/invoice/time logs, Estimate editor, WorkOrder details, LabourTariff, Lubrication create, WorkshopVehicles filters) | Direct standalone imports | Explicit input-level opt-in also works in projected templates and dialogs appended to body; retain bindings/validators/steps/IDs. |

Phases: bounded discovery and UI detail/integration/reconciliation; backend, domain actions and schema phases skipped because no domain/API change. No subagents: this is one small shared interaction with dependent consumers.

Additional owner instructions: shorten "This field is required." to "Required field" and keep the Work Order dropdown inside Create Job's Details column. Before-edit evidence: shared FieldErrorComponent resolves required through validationMessages.required; en.ts has the same sentence in four required keys (shared, Job and two existing overrides). UI19 owns the wording; update matching values without key/validator changes. Job's job-work-order p-dropdown uses sigma-field/w-100, but shared sigma-field dropdown host and label lack min-width:0/max-width bounds. UI16 owns bounded closed lookup labels; the existing shared table/filter styles already constrain them. Extend the three-pane shared editor owner to bound its dropdown host/control and ellipsize the closed label, preserving body-appended option overlays, filter/showClear and value contracts. This fixes Job and the directly related Estimate layout without feature CSS or reducing pane widths.

Final owner styling correction: the right-aligned price moved away from its column heading. Source evidence: shared table headers remain text-align:start and item price/labour charge cells are derived spans. Decision before edit: add optional public column align with default unchanged; Job/Estimate derived Price/Charges headers select center, and their numeric text selects a shared centered highlighted-value modifier. Use existing primary/surface/title theme tokens, 34px line and 6px radius; no editable input or formula change. Other consumers keep current header alignment. Owner explicitly requested a suitable color; subtle Sigma blue background with readable themed text implements that preference.

Final source reconciliation — numeric/price/lookup/wording refinement:

| Concern | Final producer / consumer evidence | Result |
|---|---|---|
| Numeric entry | NumericFocusDirective focus/pointerdown/click/reset hooks call only native select(), exclude disabled/readOnly; all 24 native number inputs across nine Workshop templates import/opt in | Matched, source-only |
| Price and charges | Shared column align binding; Job and Estimate each declare two center headers and two highlighted derived spans; shared class owns centered 34px figure, themed title text and primary/surface 12% background | Matched to final owner styling correction; no derived payload/control change |
| Lookup overflow | Shared three-pane sigma-field dropdown host/wrapper min-width0/width100%/max-width100%; label block/flex shrink/ellipsis; trigger non-shrink; Job workOrderId still uses w-100 and body overlay | Matched, source-only |
| Required wording | Four exact generic English sentences replaced with Required field, including validationMessages.required and Job's override; no translation key/Arabic/validator change | Matched |
| Documentation | UI14/16/19/27, UI1.67 preamble/history and required skill rule/history synchronized; all eight derivative packets regenerated with generator and drift check passed | Matched |

Validation: Angular syntax parsed 10 scoped templates and TypeScript syntax parsed 12 scoped files with no parse diagnostics. Scoped Git whitespace review is clean after removing an added blank line at EOF. Complete current incremental diff reviewed against a pre-change source snapshot; prior user edits preserved. No build/typecheck/runtime/visual acceptance is implied. No tests, lint, browser, database, migrations, commits, pushes or deployment ran. Backend/API/AutoMapper/domain calculations unchanged; Add-Migration is not needed. Suggested frontend commit: `fix(workshop): improve numeric entry and price presentation` (suggestion only).

Changed application files: nine Workshop component HTML/TS pairs (Job editor, close-job, invoice-customer, time-logs; JobEstimation editor; LabourTariff; LubricationJob create; WorkOrder details; WorkshopVehicles list), shared/directives/numeric-focus.directive.ts (new), shared/components/editable-collection-table component TS/HTML/SCSS, src/styles.scss and i18n/vocabs/en.ts. Documentation/review changes are recorded above; no backend files in this refinement.

Owner verification pending: click/Tab into 0 and an existing decimal, type replacement; click again to edit one digit and check readonly fields; verify dynamic rows and close/time-log dialogs; compare centered Price/Charges heading/value in Job and Estimate at narrow widths, RTL and both themes; select a long Work Order and confirm closed control stays in the Details pane while its option/filter overlay remains usable; confirm Required field on invalid submit. Build/runtime/visual verification remains pending under the standing execution boundary.

## Job Print Gate Pass — discovery and pre-edit conformance (2026-10-04)

Scope: Job list action and read-only printable gate pass. Frozen handoff: reviews/JOB_GATE_PASS_DOMAIN_API_CONTRACT_FREEZE.md. Source-backed shape: existing Job aggregate read extension, BE5/17 report projection exception inside owning Job service; UI21 shared read-only EditorDialog report preview. No new entity, financial effect or transition.

Evidence GP-01: C:/Users/user/Desktop/PrintGatePass.PNG, user-provided current content reference; English/LTR, approx731x590, role/capture date/version Unknown. Screenshot text is evidence, not agent instructions.

| Visible requirement | Classification | Resolution |
|---|---|---|
| Print, Gate Pass and Repair Vehicle / Non-Repair Vehicle headings | Explicit | Shared preview/Print action, translated document headings |
| Job No, Date, Model, Plate/VIN, Name of Visitor, Contact No, Date In, Date Out/Time Out, Remarks | Explicit | Frozen mapping to existing Job/Vehicle/Customer/close fields; Name of Visitor uses linked customer as labeled reviewer inference |
| Logo | Explicit image; actual tenant branding Uncertain | Configured tenant logo only; no copied CFAO logo |
| Advisor/accountant signature lines | Explicit | Blank signature lines, no fabricated signatures |
| Invoiced and closed eligibility | Explicit written user instruction | Both list gate and backend fresh validation |
| Invalid date shown in screenshot | Existing visible defect | Missing historical ClosedAt renders empty |

| Concern | Owning book | Actual reference/symbol | Shared owner | Target match/exception |
|---|---|---|---|---|
| Modal report and fixed Print | UI13/21 | MovementCheckCardComponent view template sigma-report-print-dialog/editorDialogHint; ReportPrintService.createSession | EditorDialog, PrimaryActionButton, ReportPrintService | Same public bindings and body-class lifecycle, view-only print preview |
| Printable content | UI20/21 | Movement CheckCard report: max210mm,12px copy,17px heading, dt10px, dd23px, responsive summary/signature columns, print-white tokens | Feature-owned report content, shared print-flow/isolation | Same document language; Gate Pass fields and signature lines are feature content |
| Loading, retry and cancellation | UI22/28 | JobLabourTimeComponent currentJobId/loadSubscription/read failure branches | StateMessageComponent, typed JobService | Same typed read lifecycle, close/change cancels old snapshot |
| Date and logo | UI17/18 | formatDisplayDate; FileLink same-origin protocol guard | date-utils; static file origin contract | Empty invalid dates; actual configured tenant logo, no arbitrary URLs |
| Eligibility/read data | BE5/17 | Job.Status,ClosedAt; HasInvoiceAsync; Repository.Query tenant/live and QueryReport fail-closed | JobService, authenticated JobController | Fresh Closed+invoice gate; DTO only print fields; projection and localized 404/409 |

Phase0/1 complete: contract Frozen before delegation. Phases2/3/5/6 apply to action/preview/read wiring; Phase4 mutation and migrations skipped. Existing Job list columns/ListVM unchanged; hasInvoice/status/recordType already supply the action gate. All unrelated dirty-tree work must be preserved.

Gate Pass continuation: both delegated workstreams stopped at the account usage limit before source edits. Root resumed and implemented both layers in the same authorized task; the backend snapshot was reused and a frontend pre-edit snapshot was captured. No unfinished agent output was integrated. UI cancellation reference in the table above is UI28 (the earlier UI25 label was a routing typo); it has been read and applied. No new shared capability was required: all presentation/print/loader/date owners are reused, so this feature-specific contract does not change canonical book guidance or the skill.

### Gate Pass final reconciliation — Implemented — source-only

Owner verification pending: yes. No unresolved business-contract decisions remain in the authorized print scope. Screenshot content is preserved through the canonical shared dialog/report pattern; the customer-as-visitor mapping remains a recorded reviewer choice under Master2, not a new persisted visitor field.

| Concern | Final source producer / consumer | Source result |
|---|---|---|
| Action eligibility | JobsComponent.actions printGatePass gates normal Job + Closed + hasInvoice===true; handler rechecks and prevents duplicate preview; existing list status/invoice fields unchanged | Matched |
| Fresh read eligibility | JobController GET gate-pass/{jobId:int} → IJobService.GetGatePassAsync → JobService tenant/live Query; invalid ID/absent record/Closed+invoice checks; final QueryReport projection repeats Closed+linked-invoice predicate | Matched; localized 400/404/409 |
| Invoice ownership | HasInvoiceAsync preserves existing live Invoice OR MiscellaneousInvoice JobNo linkage; optional cancellation token added, existing callers retain defaults; report invoice subqueries use fail-closed QueryReport | Matched; no paid/posted or permission policy added |
| Print fields | JobGatePassDto and JobGatePass have exactly the same 11 fields; DTO projection uses source Job, Vehicle, Model and Customer with individual/company phone subqueries; configured LogoPath loaded separately | Matched; no EF/model/API write changes |
| Preview lifecycle | JobGatePassComponent cancels old subscriptions on ID change/close; takeUntilDestroyed; response identity guard; both Result failure and transport failure shown inline via skipped interceptor + StateMessage; balanced loader finalize and Retry | Matched |
| Print and logo | ReportPrintService createSession owns preparation/repeat guard/cleanup; shared dialog isolation and print-flow release; Print/Close fixed footer; logo same-origin URL guard and load/error state, manual omission for slow resource | Matched; no private print/body-class lifecycle |
| Date/history | formatDisplayDate renders JobDate and ClosedAt; Date uses stored ClosedAt, Date Out includes time, missing/invalid date empty | Matched; no generated exit timestamp |
| Signature/branding | Blank advisor/accountant signature lines; no fabricated signatures; tenant logo only, missing/broken logo omitted | Matched |
| Translation/integration | 19 new job keys in each language (18 gatePass fields/messages + action); Job en/ar leaf parity 319/319, zero missing; standalone JobGatePassComponent imported by list and new model imported by service | Matched |
| Layout/theme | Report content retains reference max210mm,12px copy,17px heading,10px labels,23px read values, responsive two-column fields,48px signature gap; shared tokens on screen/white paper in print; content has one scroll owner | Source-conformant; visual/RTL/theme/print acceptance pending |

Applied phases: 0 screenshot/source discovery, 1 API contract freeze, bounded 2 action-state/read extension, 3 read-only preview, 5 standalone/API/translation wiring, 6 source reconciliation. Mutation phase4, financial calculations/AutoMapper and EF/migration work skipped: the feature only reads and prints an existing aggregate. The read document extends the owning Job service rather than creating a standalone filter/report module; this recorded exception preserves existing aggregate ownership for one record-scoped custom read.

Verification completed: 6 TypeScript and 2 Angular template syntax inspections passed; one unsupported else-if alias found during inspection was converted to a primary nested @if and reparsed. DTO/interface fields reconciled; English/Arabic Job keys and required shared Print/Close/Retry keys present; both resource XML files parsed with exactly one JobGatePassUnavailable key. Scoped Git diffs reviewed separately in both repository roots, including incremental comparison with captured pre-change files and full new-file source. Scoped diff whitespace/merge-marker checks clean. This is source inspection, not C# compilation, Angular template type checking, EF query execution or visual verification.

Changed files (Gate Pass only):

- Frontend repository F:/My Work/Sigma/SiGmaAngularFrontEnd: src/app/modules/Workshop/Job/components/list/list.component.ts/.html; services/job.service.ts; models/gate-pass.ts (new); components/gate-pass/gate-pass.component.ts/.html/.scss (new); src/app/modules/i18n/vocabs/en.ts and ar.ts. No shared owner, tsconfig or route changes.
- Backend repository F:/My Work/Sigma/SigmaBackend: SiGma.Business/Services/JobService.cs; IServices/IJobService.cs; SiGma.ServerAPI/Controller/JobController.cs; SiGma.ViewModels/ViewModels/Job/Dtos/JobGatePassDto.cs (new); SiGma.Helpers/Localization/Shared/GeneralMessage.resx and GeneralMessage.ar-SA.resx.
- Local artifacts: reviews/JOB_GATE_PASS_DOMAIN_API_CONTRACT_FREEZE.md and this review. Canonical packet check passed; no canonical rule change required, no generated packet edits.

No Add-Migration needed. Suggested frontend commit: `feat(workshop): add closed-job gate pass print preview`. Suggested backend commit: `feat(job): expose validated gate pass print data`. Suggestions only; no commits made.

Owner manual verification: select Closed status in Jobs (existing default filter is Open), locate a normal invoiced Job and open More Actions → Print Gate Pass; confirm an Open, uninvoiced or Lubrication Job has no action. Check direct endpoint failure for ineligible/foreign/deleted records and cancellation; check individual/company contacts, Plate+VIN, long/Arabic remarks and blank historical close time. Verify configured/missing/broken/slow logo, Retry and Close while loading. Print/cancel/reprint on A4 and narrow/RTL/dark theme, confirming only the preview prints, signatures remain blank and screen/scroll state returns. Owner must validate C# compilation and EF projection translation as part of runtime acceptance.

Agent utilization: gatepass_backend and gatepass_frontend were assigned independent frozen BE/FE file ownership to reduce elapsed time; they stopped at usage limits without source changes, and root completed/integrated both workstreams. No prohibited builds, tests, lint, browser/application verification, database commands, migrations, snapshots, commits, pushes or deployment ran. Unrelated pre-existing changes were preserved.

## Gate Pass spacing refinement — 2026-10-04

Owner instruction: balance Gate Pass internal spacing and leave a small area below the signatures. UI-only refinement of the frozen read/print contract; no new screenshot or domain decision. Selected shape remains UI21 read-only dialog report. Recipe drift check for this continuation passed all eight packets; source-only execution remains in force.

Before-edit conformance:

| Concern | Owning block | Inspected reference / shared owner | Target match or owner-authorized refinement |
|---|---|---|---|
| Content inset and bottom space | UI13/21; Master5 | EditorDialog content.is-padded = 14px on screen; styles.scss sigma-report-print-dialog clears shared padding on paper; Movement CheckCard report max210mm with zero content padding | Keep the shared shell unchanged; Gate Pass document adds logical 8px top / 10px sides / 20px bottom padding with border-box sizing. This feature-specific deviation is authorized by the current owner request and retains inset on paper. |
| Section rhythm | UI21 | CheckCard h1 18px end margin, read values 23px minimum and signature gap 48px; Gate Pass currently h1 18px + h2 10px start/18px end, fields 10px/16px gap | Gate Pass headings use 12px then 20px separation, fields 12px rows/24px columns. Retain read-value typography, 48px signing space, 20px signature column gap and narrow one-column fields. |
| Print / scroll | UI21 | Gate Pass body sigma-print-flow, ReportPrintService and shared dialog isolation | Preserve one internal scroll owner and shared print lifecycle; document bottom padding follows signatures in both screen and print. No fixed height or page-height calculation. |

No subagents: this is one small stylesheet adjustment below the independent-workstream delegation gate. No generic book/skill rule change is warranted for this feature-specific spacing preference.

Spacing reconciliation: Implemented — source-only; owner verification pending yes. Changed only frontend components/gate-pass/gate-pass.component.scss plus this review. Full scoped new-file source and incremental no-index diff against the pre-change snapshot were reviewed; whitespace and merge-marker inspection are clean. Final inset 8px top/10px sides/20px bottom, heading gaps 12px/20px and fields 12px/24px match the recorded owner refinement. Shared shell, print flow, typography and 48px signing space remain intact. Bounded phases0/3/6 apply; backend/API/domain/AutoMapper/schema and mutation phases skipped because this is CSS-only. No Add-Migration required. Suggested frontend commit: `fix(workshop): balance gate pass spacing` (suggestion only). No builds/tests/lint/browser/application/database/migration/commit/push/deployment commands ran. Owner visual acceptance: inspect preview and printed paper in both directions, check narrow layout and modest space below signature labels.

## Application-wide numeric replacement — 2026-10-04

Status: Frozen for the bounded implementation; owner verification pending yes. Owner explicitly extends numeric immediate replacement to the whole application. This supersedes UI27's previous legacy adoption-on-review scope. No screenshot, backend or financial contract changes.

| Concern | Owning block | Inspected reference / shared owner | Frozen decision before edit |
|---|---|---|---|
| Root lifecycle | UI1/27; Phase5 | AppComponent starts/stops GlobalInputClearService; service uses DOCUMENT/NgZone and document delegated events | Add root GlobalNumericFocusService with matching start/stop lifecycle; delegated document events automatically cover lazy views, dynamically inserted rows and body-appended dialogs. No full-solution scan/template retrofit. |
| Numeric entry | UI27 | NumericFocusDirective.selectValue uses select(), first pointer entry then later caret clicks | Promote behavior into one shared service. Existing directive retains opt-in appearance only and no duplicate listeners. Match native input[type=number] and PrimeNG input.p-inputnumber-input[role=spinbutton]; do not infer numeric data from ordinary text/tel/inputmode fields. |
| PrimeNG cursor | UI27, actual installed PrimeNG inputnumber source | onInputClick calls initCursor; onInputFocus only emits; actual numeric input has p-inputnumber-input + spinbutton | focusin and click selection run in bubble phase after the widget's own handlers. Pointerdown tracks only a primary left entry into an unfocused editable input; later clicks retain normal caret behavior. |
| Value safety / cleanup | UI27 | Existing directive excludes disabled/readOnly and writes no data; GlobalInputClearService owns an unrelated clear action | Selection only, without value writes/events/dirty state/min-max-step/parse-format changes. Reset pointer state on cancellation/focusout; remove document listeners on root destroy. |
| Documentation | UI27; learning protocol | Current rule is general but legacy scope and interaction ownership are directive-based | Update owning UI27 block, version/history and required skill rule/history; regenerate packets with the generator. Keep numeric appearance opt-in, without new global styling. |

Phases: bounded 0 discovery, existing UI-only contract freeze, 3 shared interaction, 5 root wiring, 6 reconciliation. Backend/API/domain actions/schema/AutoMapper skipped. One sequential shared owner and its root consumer; no subagents because independent workstreams would duplicate ownership/context.

Application-wide numeric reconciliation — Implemented — source-only; owner verification pending yes.

| Concern | Final source evidence | Result |
|---|---|---|
| Root wiring | AppComponent constructor injects root GlobalNumericFocusService; ngOnInit starts, ngOnDestroy stops it; imported transitively by existing app entry | Matched; no extra provider, route or tsconfig entry required |
| Selection | Document pointerdown capture records primary left entry; focusin/click bubble select native number or PrimeNG numeric spinbutton after widget cursor logic; later clicks leave caret untouched | Matched to frozen interaction |
| Safety | editableNumericInput excludes :disabled (including disabled fieldsets) and readOnly; only select() is called; no value writes, dispatched events or form changes | Matched; parse/min/max/step/precision/calculation contracts intact |
| Shared ownership | NumericFocusDirective retains original selector/standalone host class with no HostListeners; one application-wide selection service owns five paired add/remove listeners outside Angular zone | Matched; dynamic/lazy/body-portal inputs require no template changes |
| Documentation | UI27, UI1.68 preamble, CHANGELOG and skill rule/revision history reconciled; all eight packets regenerated and -Check passed | Matched; feature-only Gate Pass spacing remains in this review |

Changed application files for numeric scope: src/app/app.component.ts; src/app/modules/shared/service/global-numeric-focus.service.ts (new); src/app/modules/shared/directives/numeric-focus.directive.ts (existing untracked prior work refined). Complete scoped tracked/new-file source and incremental snapshots were reviewed. TypeScript syntax parsing on the three files and whitespace/merge-marker inspection on these and Gate Pass SCSS reported no findings. No application compilation, typecheck or runtime pass is implied. Gate Pass spacing result is recorded above. Unrelated user edits preserved.

Frontend phases0/3/5/6 and bounded UI interaction contract apply; backend/API/domain calculations/AutoMapper/state transition/schema work skipped. No Add-Migration required. Suggested frontend commit: `fix(ui): select numeric values on entry across the application` (suggestion only). Documentation suggestion: `docs(ui): promote global numeric replacement owner` (suggestion only). No subagents for this one shared owner and dependent wiring. No builds/tests/lint/browser/application/database/migration/commit/push/deployment commands ran.

Owner verification: in an existing screen outside Workshop, enter zero and a decimal using click and Tab, type a replacement, then click again to edit one digit; repeat on native and PrimeNG numbers, dynamic rows and body-appended dialogs. Verify readonly/disabled fields, spinner/arrow stepping and unchanged validators/form values before typing. Confirm Gate Pass inset and 20px space below signatures in preview/print. Build and runtime/visual acceptance remain pending under project instructions.

## بطء فتح نافذة عرض مركبات الورشة — ٢٠٢٦-١٠-٣١

الحالة Frozen (نتيجة مراجعة مصدرية فقط، لا عقد تنفيذ جديد)؛ Owner verification pending yes. بلاغ المالك «View Vehicles بتاخد وقت كبير فى الفتح» عومل كتشخيص أداء محدود دون تعديل مصدر التطبيق. النطاق هو /workshopVehicles عبر pages/routing.ts:856 وworkshopVehicles_Routes والقائمة openView ثم WorkshopVehicleDetailsComponent؛ العنوان الحرفي workshopVehicles.viewVehiclesTitle يثبت أنه ليس محرر FleetVehicle أو Sales/Fleet.

المرجع: UI01/13 modal، UI02/22/28/29 وBE7/2؛ حزمةPHASE03 بعد نجاح Check للحزم الثماني. دليل التحليل: المدخل الموحد،2026-10-28/sidebar/14-workshop/screens/01-vehicles.md (R0549/C1833)، وC1833 الأصلي raw/application.js:499231-499448، SHA256 09C1F8BFD1B8A1B187E4C142FFF22AE7F0E70784DDC5D53E2060C7A2DC931D34. دليل Sigma الحالي UserGuide/content/workshop-guide.ts موضوع /workshopVehicles مقروء. دليل المرجع يثبت مجموعات بيانات/مستندات/حركات، ولا يثبت SQL أو مدة فتح سيجما. هذه الشريحة لا تغطي فجوات حقول المرجع الأوسع ولا تعتمد قواعد صلاحياته.

النتيجة الأولى، أولوية مرتفعة: GET Vehicle/GetByWithNavigationsId/{id} عبر WorkshopVehiclesService.getVehicleDetails ليس قراءة محددة لهذه النافذة. VehicleController يرث SiGmaControllerBase:61-63 → Service.DetailWithNavigationsAsync:1308-1322 → Repository.GetByIdDeepAsync:455 وما بعده → LoadNavigationsRecursiveAsync:475. الدالة تتبع كل EF navigation وتحملها تسلسليًا ثم تتعمق في الأبناء والمراجع، مع visited لمنع الدورات لكنه لا يحدد ميزانية بيانات الشاشة. Vehicle له Branch/Make/Model/VehicleType/CostCenterGroup/Documents/Warranties؛ CostCenterGroup يملك CostCenters، وبيانات الضمان نفسها غير معروضة في النافذة. لذلك يوجد عمل واستعلامات متغيرة وفق حجم graph قبل وصول رد التفاصيل، رغم أن الواجهة بدأت طلب HTTP واحدًا. لا قياس SQL/مدة أو عدد أوامر ثابت مدّعى.

النتيجة الثانية: إغلاق النافذة يهدم المكوّن فتُلغي takeUntilDestroyed اشتراك العميل، لكن action الموروث لا يستقبل CancellationToken وDetailWithNavigationsAsync يستدعي deep read دون token؛ لا مصدر يثبت توقف عمل الباك إند عند مغادرة الطلب. هذا قد يهدر عمل فتح/إغلاق سريع، ولا يُجزم أنه السبب الوحيد لبطء فتح واحد.

ما استُبعد: لا طلب تفاصيل مكرر مؤكد؛ ngOnInit يطلب مرة. الحركات ليست ضمن المسار الحرج الأول؛ تُجلب عند اختيار recentMovements فقط وبحد10 عبر CollectionMovement/GetMovements?pageNo=1&pageSize=10&plateNo. صور المستندات لا تُركب حتى اختيار documents، لكن مجموعة Documents نفسها تصل داخل رد التفاصيل. لا lookup bootstrap داخل نافذة العرض، ولا GET مرجع قابل للكاش؛ detail/history قراءات تشغيلية مباشرة، ولا يوصى بتخزينها مؤقتًا لإخفاء query graph. قراءات فلاتر القائمة خارج شريحة فتح النافذة ولم تتغير.

التحميل: loadDetails يبدأ loadingDetails والعداد العالمي داخل الاشتراك مع finalize/end وDestroyRef؛ تبويب التفاصيل يظهر StateMessage محليًا لأن body-appended dialog يغطي shell. تحميل الحركات له lease وStateMessage محلي؛ errors/Retry موجودان. تبديل التبويب أثناء بقاء detail pending قد يخفي indicator المحلي الخاص به لأن موضعه داخل detail panel، وهي فجوة مصدرية إضافية لتوحيد progress داخل غلاف الحوار عند التنفيذ؛ لا ادعاء تحقق ظهور runtime. recent table لا يرتبط بـloading input، فلا table mask إضافي من هذا الربط.

الإصلاح المقترح: قراءة DTO محددة بلا tracking من خدمة المركبات/الورشة لحقول النافذة وأسماء مراجعها فقط، مع مستندات مملوكة للمركبة بقراءة محدودة منفصلة أو projection مضبوط، وإزالة التعمق/الضمانات غير المستهلكة من مسار هذه النافذة. لا تعديل generic repository ولا تغيير endpoint مشترك يقطع مستهلكي Fleet. يجمد كل producer/consumer وشكل النتيجة أولًا قبل التنفيذ؛ يبقى tenant/live وحفظ أسماء المراجع التاريخية وقواعد الطباعة/الحركات كما هو. تمرير cancellation من action إلى القراءة وتصنيف تقدم الحوار ضمن نفس الشريحة. لا حاجة لتغيير حسابات/صلاحيات/كتابات.

الفهارس: VehicleConfig يسمي جدول Vehicle ولا يضيف فهرس أداء؛ لقطة EF للكيان تؤكد المفتاح Id وفهارس FK الموجودة. بحث detail بالمفتاح Id مع شرط المستأجر والحذف لا يبرر فهرسًا مركبًا جديدًا من المصدر وحده؛ جذر المشكلة traversal/شكل القراءة. لا فهرس جديد مقترح الآن، ولا schema/migration. الخطط والفهارس المنشورة وتوزيع البيانات غير مقاسة؛ تفحص owner SQL plan بعد projection قبل اقتراح INCLUDE أو تكرارPK/FK.

القياس المتبقي: نفس المركبة/المستأجر والفرع والبيئة والشبكة، عينات cold/warm، مع عدد المستندات والضمانات ومراكز التكلفة المرتبطة؛ وقت من النقر إلى محتوى usable، مدة HTTP وحجم الرد وعدد/مدة SQL والـrender، ثم فتح/إغلاق سريع وتبديل التبويبات وRetry. تقارن القراءة الحالية والمحددة مع نفس القيم والحقول والطباعة. لا ادعاء سرعة مقاسة أو نسبة تحسن. لا ملفات تطبيق/دليل مستخدم تغيرت لأن المهمة تشخيص فقط؛ أضيفت هذه النتيجة للمراجعة الحالية. لا build/test/lint/browser/DB/migration/commit/push أو وكلاء؛ المسار مترابط وصغير ولا يستفيد من تكرار مسحه.

## عقد تحسين فتح عرض المركبة — ٢٠٢٦-١٠-٣١

| البند | القرار |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| التفويض | المالك: «تمام نفذ المناسب للتحسين» بعد التشخيص السابق |
| النطاق | نافذة WorkshopVehicleDetailsComponent ومسار قراءة WorkshopService فقط؛ generic Vehicle detail وباقي المستهلكين لا يتغيرون |
| الشكل | UI01/13 modal reader؛ BE7 screen-owned no-tracking projection، لا كتابة أو حسابات أو أذونات أو schema |
| المسار الجديد | GET Workshop/vehicles/{id:int} → Result<WorkshopVehicleDetailDto>؛ IWorkshopService.GetWorkshopVehicleDetailsAsync(id, cancellationToken)؛ action يستخدم ToActionResult |
| الفشل | Result false ورسالة FailedToFound المعهودة عند root غير موجود/غير حي/خارج المستأجر؛ HTTP/false envelope يظهران خطأ مع Retry |
| الهوية والتاريخ | Repository.Query<Vehicle>(Id) يفرض tenant/live؛ المراجع التاريخية داخل المستأجر تشمل deleted names عمدًا؛ لا اعتبارها اختيارات قابلة للحفظ |
| الحقول | id,plateNo,year,chassisNo,engineNo,engineCapacity,kMs,interiorColor,exteriorColor,fuelTankCapacity,eTag,acrissCode,purchaseDate,fleetType,ownership,registrationDate,nextRegistrationDate,insuranceDate,nextInsuranceDate,insurancePolicyNo,warrantyInKms,warrantyInMonths,fleetNo,customFiled1,notes؛ branch/make/model/vehicleType/costCenterGroup كمرجع id/name أو null؛ documents كمصفوفة id/documentNumber/documentPath |
| مصدر الحقول | نفس Vehicle scalar values وأسماء المراجع المعروضة الحالية؛ WarrantyInKms true integer يبقى كما هو وKMs double read لا سياسة أرقام جديدة؛ Return Date المعروض — يبقى كما هو |
| المستندات | قراءة ثانية فقط بعد root success من ارتباط Vehicle.Documents الحالي؛ tenant/live على المستندات، ترتيبId ثابت؛ لا فرض VehicleId CLR غير موجود؛ لا حذف مستند/تغيير paths |
| الميزانية | header projection بالـjoins المستأجرية المحددة وAsNoTracking، ثم documents projection؛ لا recursive Includes أو materialized entities أو EF متوازٍ على نفسContext؛ cancellation token إلى القراءتين |
| واجهة TypeScript | WorkshopVehicleDetails مستقل بنفس shape المصغر، لا استيراد VehicleDetailsDTO الأوسع من Fleet؛ خدمة النافذة وحدها تعتمد URL الجديد |
| عمر القراءة | إلغاء قديم عند تغير id وإغلاق/هدم/تغير السياق؛ revision/id/visible gates للنجاح والخطأ وfinalize balanced؛ context reset يمسح detail/history ولا يعيد oldid تلقائيًا، يطلب إعادة فتح السجل |
| الحركات | CollectionMovement/GetMovements تبقى fresh عند اختيار recentMovements بحد10؛ فشل قابل لإعادة المحاولة؛ لا طلب حركات في الفتح الأول |
| التحميل | global lease start/finalize محفوظ؛ مؤشر محلي StateMessage واحد في غلاف الحوار لأي detail/history pending بصرف النظر عن التبويب؛ busy/aria-busy/errors/Retry بلا table mask جديد |
| الطباعة | نفس تصرف/محتوى الطباعة الحالي؛ لا توسيعها لتبويبات/قراءات جديدة؛ cancelPending عند invalidation |
| الكاش | كلا detail/history direct operational؛ لا cache جديد/مفتاح/TTL ولا تغيير lookup-list watches/invalidation |
| الفهرس | لا فهرس جديد مبرر لمفتاح root Id وFK documents المصدرية القائمة؛ يراجع plan/timing لاحقًا؛ لا migration |
| التوثيق | تحديث موضوع UserGuide/workshop والمراجعة الحالية، وقواعد مشتركة فقط عند تعلم قاعدة جديدة فعلية |
| التنفيذ | مصدر فقط؛ parser/diff/namespace/project-inclusion؛ لا build/test/lint/browser/DB أو commit |

مرجع التحليل ومقارنة دورة C1833/دليل المستخدم كما في التشخيص السابق، والقراءة المحددة تمتثلBE7، ولا تنقل server/business غير مثبت من Speed. حزمPHASE01/03/05/06 تستخدم بتناسب بعدCheck ناجح؛ Phase02/04 لا تغيير لهما. ملفات التطبيق المستهدفة للقراءة جديدة أو نظيفة قبل الشريحة، ودليل المستخدم قد يملك تعديلات أخرى محفوظة. فصل متوازٍ بعد تجميد العقد: وكيل backend يملك DTO/interface/service/controller؛ وكيلfrontend يملك model/service/details TS/HTML فقط؛ root يملك الدليل/الدمج/التوثيق والمراجعة النهائية.

## تنفيذ تحسين عرض مركبات الورشة ومطابقته — ٢٠٢٦-١٠-٣١

| البند | النتيجة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| التفويض/العقد | نُفّذ العقد المصغر المجمد أعلاه بعد طلب المالك التنفيذ؛ لا قرار أعمال متبقٍ لهذه الشريحة |
| الشريحة | PHASE01 عقد قراءة، PHASE03 العرض، PHASE05 endpoint/lifetime، PHASE06 المطابقة؛ لا تغيير grid/write/domain phases |

التغيير: أضيف GET Workshop/vehicles/{id:int} في WorkshopController → IWorkshopService.GetWorkshopVehicleDetailsAsync → WorkshopService. استُبدل مسار النافذة فقط عبر WorkshopVehiclesService.getVehicleDetails. بقي Vehicle/GetByWithNavigationsId العام والمستودع العام وقائمة Workshop/vehicles كما كانت، فلا تغيير مستهلكي Fleet. قراءة header تستخدم Repository.Query<Vehicle>(Id).AsNoTracking مع خمسة LEFT JOINs على Branch/CarMake/CarModel/VehicleType/CostCenterGroup؛ جميع مصادر المراجع Query(includeDeleted:true) مستأجرية لحفظ الاسم التاريخي، ولا materialized reference entities أو التعمق في CostCenters/Warranties. قراءة documents بعد نجاح الرأس تستخدم root.SelectMany(vehicle.Documents) والترشيح الصريح document.SubscriptionId وIsDeleted!=true وترتيبId، فلا CLR FK جديد أو مخطط جديد. CancellationToken من action يصل FirstOrDefaultAsync وToListAsync. فشل عدم وجود المركبة يستخدم FailedToFound/Result الحالي ويحوّل ToActionResult الحالة وفق القاعدة الحالية؛ auth موروث من SiGmaControllerBase ولا permission مختلقة.

مطابقة الحقول: نموذج WorkshopVehicleDetails مستقل بالواجهة وWorkshopVehicleDetailDto بالباك إند، مع نوعين مستقلين للمرجع والمستند. تطابقت أسماء الحقول الرئيسية الـ31 مصدرّيًا بلا نقص/زيادة؛ القيم العددية/التواريخ والـenum والمحارف الموروثة eTag/acrissCode/customFiled1/kMs محفوظة. فرز المستندات أصبح صريحًا حسبId، والهوية/الرقم/المسار كافية لمعرض الصور الحالي؛ لا مصدر يستهلك document audit أو warranties بالنافذة. الحقول الظاهرة ومجموعاتها والـReturn Date غير المتاح والطباعة الحالية محفوظة؛ لا ادعاء مطابقة المرجع الكامل أو إضافة حقول Speed المؤجلة. لا AutoMapper جديد مطلوب لأن DTO يُبنى من projection مباشرة، ولا writes/calculations/transactions أو Add-Migration.

العمر والتحميل والكاش:

| القراءة الفعلية | التصنيف والمالك | المطابقة النهائية |
|---|---|---|
| GET Workshop/vehicles/{id} عبر WorkshopVehiclesService.getVehicleDetails | direct operational؛ لا cache source أو TTL/writer/invalidation/watch لأن القراءة لا تشترك في reference cache | defer يبدأ flags/lease عند subscribe؛ finalize يحرر started lease فقط؛ takeUntil cancelReads وDestroyRef؛ defaultIfEmpty يتحول إلى خطأ قابل لإعادة المحاولة؛ نجاح/خطأ محميان revision/id/visible/context. Root DTO id يجب أن يطابق السجل المختار |
| GET CollectionMovement/GetMovements?pageNo=1&pageSize=10&plateNo عبر getRecentMovements | direct operational history؛ لا cache جديد؛ يلزم اختيار recentMovements واللوحة المحملة | يحتفظ بالـ10 والـRetry وmovementsLoaded، ولا يتصل ضمن الفتح الأول؛ نفس cancel/revision/lease وحماية اللوحة |
| تبديلID/الإغلاق/الهدم | read cancellation وcancelPendingprint فقط | لا نتيجة قديمة تعيد ملء السجل؛ لا كتابة مستقلة موجودة لتغيير سلامتها |
| ReferenceLookupCacheService.contextChanges | إشعار بياناته فارغة لإبطال جلسة العرض، وليس opt-in للكاش | تمسح المركبة والحركات والهوية والتبويب والأخطاء السابقة؛ رسالة general.screenContextChanged الموجودة ar/en؛ Retry/print/تنقل السجل ممنوعة حتى إعادة الفتح، فلا طلب oldID في سياق جديد |
| التقدم المرئي | global LoadingService lease مع StateMessage محلي واحد في غلاف EditorDialog الذي يغطي shell | الموضع خارج panels لا يختفي بتبديل التبويب، aria-busy والـdisabled/errors/Retry محفوظة؛ لا indicator داخل panels/table mask ثانٍ |

لم تتغير قراءات bootstrap فلاتر القائمة أو writers/import invalidation للمصادر المرجعية؛ لا انتقال تأهيل أو تخزين جديد لأي GET. مراجعة سياق/كاش القائمة الأوسع ليست نتيجة مطابقة النافذة التشغيلية ولا تغييرًا مخفيًا ضمن هذه الشريحة. التصميم/width/breakpoints/SCSS وEditorTabs وEditorDialog المشتركة باقية؛ لا إصلاحات تنسيق خارج طلب الأداء. لم تظهر قدرة مشتركة مفقودة تستحق wrapper/extraction؛ BE7/UI22/28 يملكون هذه القاعدة بالفعل، فلا قاعدة كتاب/مهارة جديدة ولا توليد حزم غير لازم.

الأداء والفهارس: قبل التعديل source graph recursive ومتغير حسب العلاقات؛ بعده موضعا materialization محددان فقط (header+owned documents) بلا traversal أو لكل child read، مع تجاهل الاستعلام الثاني عند root failure. هذه مقارنة عمل مصدرية وليست SQL timing مقاسًا. Child collection محفوظة كاملة للمركبة لأن النافذة تعرضها؛ لا truncation/تغيير page/count. Snapshot قرأته فقط يثبت Vehicle PK Id وفهارس FK، وCustomerDocument index VehicleId عند9122 وارتباطVehicle.Documents عند35662 وما بعدها؛ لا مبرر لإضافة فهرس بديل أو INCLUDE دون خطة منشورة/قياس. لا schema/index/migration أو مخاطر كتابة/تخزين جديدة. يظل قياس before/after المشروط في التشخيص السابق متبقيًا، مع ترجمة EF/query plan واختبارات إلغاء الطلب والخطأ والتبديل السريع والبيانات الكبيرة وRTL/theme والطباعة. لا نسبة تحسن مُدّعاة.

التوثيق والملفات: ستة ملفات Backend (service/interface/controller وثلاث DTOs) وخمسة Frontend (model/service/details TS+HTML ودليل UserGuide/content/workshop-guide.ts). الدليل العربي/الإنجليزي عبر /UserGuide/workshop يشرح البيانات والمستندات والحركات عند اختيارها وإعادة المحاولة والإغلاق وتغير السياق. رُوجع بعد التنفيذ لمطابقة رد القراءة النهائي؛ لا نشر أو مسار دليل جديد.

الفحوص: راجع root الفرق الكامل لكل الملفات المتتبعة في الجذرين ومحتوى الملفات الجديدة وحافظ على بقية الشجرة؛ git diff --check ناجح. نجح تحليل TypeScript للملفات الأربعة والقالب Angular، وRoslyn syntax للستة Backend؛ المطابقة المصدرية للـ31 حقلًا ناجحة. namespace للأنواع الثلاثة يطابق usings، Business→ViewModels وServerAPI→Business ومصدرSDK تلقائي؛ model الواجهة مستوردtransitively من الخدمة والمكوّن فلا include واسع أو tsconfig جديد. فحص الحزم الثمانية نجح قبل الاستخدام ولا canonical/manifest تغير. لا يُدعى semantic compilation أو runtime/SQL/render من syntax.

التفويض المتوازي: root جمّد العقد واحتفظ بالدمج والمراجعة والتوثيق. استُخدم وكيلان بالموديل الموروث فقط: workshop_vehicle_backend يملك ستة ملفات الباك إند، وworkshop_vehicle_frontend يملك أربعة ملفات الواجهة؛ لا overlap، واختير الفصل لتقليل وقت التنفيذ بعد استقرار العقد. root راجع المخرجات وطلب حماية lease started النهائية ثم أعاد فحص المصدر. لا build/test/lint/browser/DB/migration/commit/push/deploy أو تغييرات مرجعية محظورة.

رسائل commit مقترحة فقط: backend — perf(workshop): project vehicle view details without recursive graph loading؛ frontend — perf(workshop): use scoped vehicle details and cancel stale reads. يجب مطابقة الواجهة والباك إند المعدلين عند المعاينة؛ لا ترحيل قاعدة بيانات مطلوب.

## عقد تصحيح زر سجل حركات المركبة — ٢٠٢٦-١٠-٣١

الحالة Frozen؛ Owner verification pending yes. المالك أوضح أن VIEW MOVEMENTS LOG يجب أن يفتح سجل المركبة مثل رابط Speed /tenant/mcc/movements/010125151030.0. الدليل المحلي R0240 raw/application.js:3220 يعرّف :plateNo، وC1631 raw/application.js:448205-449023 أسطر814-817 يملأ plateNo ويلغي dateRange عند الدخول باللوحة. C1833 يملك مرجع viewMovementLogs المعلّق عند92-96؛ يُقبل معنى رابط اللوحة الذي أوضحه المالك صراحةً، ولا تُنقل صلاحية أو field/server workflow من JavaScript. لم يُسجل دخول خارجي أو تُشغل صفحة Speed؛ الرابط مثال وظيفي ومدعوم بالمصادر المحلية.

النطاق S: WorkshopVehicleDetailsComponent.viewMovementsLog وdisabled الخاص بزرها، ودليلUserGuide/workshop فقط. pages/routing.ts:442 يعرّف /logsMovement عندالجذر؛ /Movements/logsMovement غيرموجود. LogsMovement.restoreRoute يستهلك query plateNo وdateRangeCleared أصلًا، وngOnInit يطبّق الفلتر ويطلب أولصفحة؛ لا حاجة لمسار عرض/شاشة جديدة أو حرفيةSpeedداخلSigma. الإصلاح المجمد: navigate(['/logsMovement'],{queryParams:{plateNo:trimmedPlate,dateRangeCleared:true}}) بعد captureقبلclose، مع منع blankplate/oldcontext/busy/printing/invisible. توجد مبادئ UI01/28 وPHASE05 والقراء المشترك readListRoute، وحزمالثمانيةنجحتCheckقبلالاستخدام. يبقى المسار العام الافتراضي/Reset/الفلاتر/الـContains/paging/exports كماهي؛ لا تغيير API أو قيودأعمال. نفستبويبالمتصفحكماالتصرفالحالي، ولا نقل خاصية فتحنافذةجديدةمنتعليقمرجعي غيرنافذ.

## تنفيذ تصحيح زر سجل حركات المركبة — ٢٠٢٦-١٠-٣١

الحالة Implemented — source-only؛ تحقق المالك المتبقي yes. نُفذ العقد السابق في TS/HTML للنافذة ودليلUserGuide/content/workshop-guide.ts بالعربية والإنجليزية عبر /UserGuide/workshop. الزر يذهب إلى /logsMovement?plateNo=<plate>&dateRangeCleared=true، ويحفظ اللوحة كنص (بمافيها النقطة والجزءالعشري المثال) قبل إغلاق الحوار. لا حساب أو تحويل رقم للوحة. مع غياب لوحة لا انتقال إلى سجل عام غيرمفلتر، وbusy/context/printing guards باقية.

المطابقة: routeالجذر موجود؛ readListRoute/restoreRoute يقرآن queryالنصية وعلمإلغاءالفترة قبلbuildFilters/loadData؛ parseDateRange(null) لايرسلfromDate/toDate، ويظلpage default15/max100 وcount والتصديرالمطبق كماكانت. UI01/28/PHASE05/06 استُخدمتبتناسب؛ لا backend/grid/write/actionphase أو migration. المرجع R0240/C1631 أعلاه يفسرالقيمةكـplateNo ويستدعيالسجلبلاdatefilter؛ قبولمعنىالرابطلااستنساخdomain/path ولاsecurityrules. يبقىالصعودالتدريجيالسابقأوكلإصلاحالقراءةالأخيرمحفوظًا.

التحميل/الكاش/الأداء: لا قراءة جديدة في نافذةالمركبة أو opt-in للكاش؛ السجل يستخدم GET CollectionMovement/GetMovements عبر LogsMovementService.getList بالفلترالمطبق والـstart/finalize/switchMap/error/Retry الحالي. الدخولبلاحدتاريخقديغطيحركاتأكثر، لكنهpagedولايرجعكلالسجلات؛ لاindexجديدمبررلإصلاحمسارعميل، وSQL/timing/networkمتبقيةكمافيالمراجعاتالسابقة. لم تتغير مصادرlookup أو writers/watch/tenant notifications ولاglobal/local visibleowners؛ لا ادعاءمطابقةكلقائمةالسجلمنهذاالتغييرالمحدود.

نجحsyntax للمكوّنوالدليل وقالبAngular وdiff --check؛ روجعفرقالمتابعةمعالإصلاحالسابقفيالملفاتنفسهاومسارالاستقبالوعقدالـquery. لا build/test/lint/browser/DB/migration/commit/push، ولاوكلاءلتغييرتسلسليصغير. لا قاعدةمشتركةجديدةأوكتب/مهارةتحتاجتحديثًا؛ Checkالحزمالثمانيناجحقبلالاستخدام. قبولالمالكالمتبقي: النقرعلىالزر بعداكتمالالقراءة، فتحسجلنفساللوحةبلافترةوبدايةالصفحةالأولى، البحثوالـResetوالعودةوعدمإرسالاللوحةعندالسياقالملغي. رسالةcommitمقترحةفقط: fix(workshop): link vehicle movement log with plate filter.

## عقد تنسيق أوامر العمل وتبويبات المحرر — ٢٠٢٦-١٠-٣١

الحالة Frozen؛ Owner verification pending yes. نطاق المتابعة: طلب فصل بادج القبول عن رقم الأمر، ثم طلب تحويل Create New Work Order إلى تابات؛ الطلبان محفوظان في المهمة نفسها. المسار pages/routing.ts:849 → WorkOrder_Routes → routed WorkOrderDetailsComponent في create/edit/view، مع قائمة WorkOrdersComponent. النمط UI02 routed master-detail / UI13 full-height record tabs؛ المراجع الفعلية EditorTabs/FormSection/EditableCollectionTable وWorkshop/Job editor؛ لا تقليد تقسيم نافذة أو API من ميزة أخرى.

التعديل المجمد: يظل بادج القبول داخل خلية رقم الأمر كما كان، داخل مجموعة flex/wrap/gap-2 موجودة في sigma-utilities لضمان مسافة واتجاه منطقيين دون تغيير table-cell display أو البادج المشترك. للمحرر تبويبان بالمسميات الموجودة workOrder.details وworkOrder.items: البيانات/الملاحظات في الأول، صفوف البنود في الثاني، مع نفس parent FormGroup وFormArray وبقاء sections mounted وإخفاء غير المختار عبر sigma-u-d-none. شريط التبويب ثابت خارجform، والتبويب يملأ باقي المساحة؛ تزال نسبة توزيع الصفين الحالية. الإجماليات وأفعال الحفظ خارج جسم التبويب كما كانت. فتح تبويب الخطأ قبل focusField؛ غياب البنود يفتح تبويب البنود. يمنع التبديل أثناء الحفظ/تحميل detail/discard/تأكيد إزالة صف/الطباعة. الطباعة تكشف القسمين مهما كان التبويب المختار وتخفي الشريط، دون تغيير الكميات/الضريبة/discount/حالة القبول أو API.

بوابة المرجع: مدخل speed-analysis وملف2026-10-28/sidebar/14-workshop/screens/02-work-orders.md المقروء يربط R0550/C1823/C1822؛ يثبت محتوى رقم الأمر/حالة القبول ورأسه وبنوده، ولا يملك تنسيق gap أو توزيع تبويبات سيجما. لا صورة مرفقة ولا تغيير عقد أعمال/صلاحية/حساب، ولا يدعى استكمال كل فجوات المرجع بتعديل العرض. الدليل الأصلي العام للورشةS113 المقروء في المهمة يعالج المنتج لا هندسة هذا التخطيط؛ Not applicable لأبعاد البادج/التبويب المحددة بطلب المالك وUI06/13. حزمPHASE02/03/05/06 الحالية بعد Check ناجح؛ لا backend/domain/schema phases أو migration.

## تنفيذ تبويبات أوامر العمل وفصل البادج — ٢٠٢٦-١٠-٣١

| البند | النتيجة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| النطاق | طلبا المالك الخاصان بتداخل شارة القبول مع الرقم وتبويبات إنشاء أمر العمل |
| القرارات | لا حقول أو حسابات أو حالات أو API جديدة؛ تغيير العرض عبر المالكين الموجودين فقط |

عولج قالب الرقم في قائمة أوامر العمل بمجموعة من أدوات التنسيق الموجودة: flex + wrap + align-items-center + gap-2. كانت عقدتا الرقم والبـادج متجاورتين بلا مسافة مضمونة بعد معالجة whitespace في القالب؛ أصبح الفصل 0.5rem، ويمكن للبادج الانتقال لسطر ثانٍ عندما لا تتسع الخلية. لا display:flex على td ولا تغيير اتجاه أفقي أو ترتيب أعمدة أو source/value callback للتصفية/التصدير. يظل الرقم وحالة القبول في نفس العمود، وملف SCSS للقائمة لم يتغير.

استُخدم EditorTabs المشترك بظهور workspace الأفقي للمحرر الموجّه. تبويب التفاصيل يضم الرأس والملاحظات، وتبويب البنود يضم المجموعة الحالية كاملة. شريط التنقل خارج form بارتفاعه الطبيعي وflex-shrink:0؛ جسم النموذج يتبع sigma-editor-body المتاح الارتفاع. أزيل توزيع الصفين 0.9fr/1.5fr من SCSS؛ كل قسم نشط يملأ المساحة عبر flex:1 1 0/min-height:0. يتمرر الرأس داخل work-order-header-scroll، والبنود داخل EditableCollectionTable fillHeight/sticky frame كما كانت. لا حساب viewport جديد أو صفحة تتمرر. الإجماليات والفوتر باقيان خارج جسم التبويب.

مطابقة السلوك: نفس parent FormGroup وFormArray والقسمين mounted طوال الجلسة؛ sigma-u-d-none ذات !important تخفي القسم غير المختار، فلا تعيد التهيئة أو تبدل draft أو تطلق reads. الـIDs والـaria-labelledby تطابق EditorTabs idPrefix=work-order-editor. التبديل ممنوع أثناء Save/detail/discard/تأكيد إزالة صف/Print؛ مفتوح في View عند الاستقرار. focusFirstInvalid يختار التفاصيل لأول خطأ رأس ثم focusField المشترك، أو البنود لخطأ صف/المجموعة الفارغة. عند ReportPrintSession.printing تكشف اللوحتان، والشريط no-print، وتحرر sigma-print-flow المشتركة حدود scroll/flex/section؛ لا طباعة التبويب الظاهر وحده. showTitle=false يخفي عنوان القسم المكرر على الشاشة ويحفظ عنوانه للطباعة وأفعال Add/mock المشتركة. تسري البنية على Create/Edit/View لأنها نفس شاشة الحقول ووفق UI13؛ لم تضف صفحة أو route.

المطابقة المرجعية: قُرئ C1822 من لقطة2026-10-28 (raw/application.js:496641-497111) مع R0550/ملف Work Orders المذكور بالعقد. قُبل وجود الرأس/الملاحظات/البنود وحالة القبول كما في دليل سيجما الحالي، وبقيت ميزات المرجع الأخرى خارج شريحة التنسيق؛ لا استيراد approval/accounting أو model من تعليق أو JavaScript. UI06 يملك خلايا الجدول والـmiddle alignment، UI13 يملك tabs/print/validation، وsigma-utilities يملك gap/wrap. لا حاجة لمكوّن/غلاف مشترك منافس أو قاعدة مهارة/كتاب جديدة؛ استُعملت العقود العامة الموجودة، والحزم الثماني نجحت Check قبل الاستخدام دون تعديل مصادرها.

جرد القراءات والتحميل والكاش لهذه الشريحة:

| المصدر الفعلي | وضع المصدر والأثر |
|---|---|
| Customer/GetSelect عبر CustomerService، وBranch/GetSelect عبر BranchService، وVehicle/GetSelect عبر VehicleService | المصادر الثلاثة cacheSelect=true كما كانت؛ finite bootstrap الحالي وmergeSavedOptions والقيم ثابتة، ولا أي قراءة عند تغيير التبويب. لا تبني هذه المتابعة watch/tenant lifecycle غير الموجود ولا تدعي مطابقة شاملة للشاشة |
| GET WorkOrder/options عبر getOptions | direct operational/tax policy، يبقى جديدًا بلا cache opt-in أو تغيير معدل الضريبة |
| GET WorkOrder/GetByWithNavigationsId/{id} عبر getDetails | direct detail، يبدأ loadingData/global lease وينهي finalize كما كان، ولا طلب جديد لكل panel |
| GET WorkOrder مع list params وقراءة جميع الصفحات للتصدير | نفس filtros/count/page/column-value؛ لا أثر لـwrapper الرقم على query أو القائمة |
| POST/PUT WorkOrder وعمليات القبول/الرفض/الحذف | لا تغيير payload أو domain transition/permissions أو كتابة/حذف فعلي جديد |

لا تغيير successful writers/import invalidation أو المصادر/الأهلية؛ فجوات المصدر السابقة في bootstrap loader/watch/lifecycle الأوسع لا تعالجها التبويبات ولا يُدّعى أنها مكتملة من تعديل العرض. لم يتغير subscribed start/finalize أو الأخطاء/Retry أو global/local owners، ولم يضف indicator؛ flags الحالية تقيد التبويب والحفظ. الأداء: نفس عدد القراءات والحقول والردود، والقسمان يظلان mounted لحفظ العمر؛ لا ادعاء تسريع مقاس. لا predicates/joins/order/SQL تغيرت، فلا فهرس أو schema/migration مبرر، ولا Add-Migration. القياس والقبول المرئي متبقيان بنفس البيئة وحجم الصفوف/الخيارات والحالتين cold/warm عند السماح بالتشغيل.

ملفات التطبيق الخمسة: قائمة WorkOrder HTML، محرر WorkOrder TS/HTML/SCSS، وUserGuide/content/workshop-guide.ts. حُدث موضوع /UserGuide/workshop بالعربية والإنجليزية لشرح التبويبات والمسودة/الإجماليات والتحقق والطباعة والفاصل بين الرقم والبادج. حُفظت تغييرات مركبات الورشة والأدلة الأخرى القائمة. نجح parser للـTS والدليل وقالبَي Angular وdiff --check؛ روجع الفرق الكامل للنطاق في مستودع الواجهة، بما فيه إزالة نسبة التخطيط وتطابق معرّفات التبويبات والقيم/الحقول. لا Backend/Mapper/Entity أو ترجمات جديدة؛ المسميات الموجودة أعيد استخدامها.

القبول المتبقي: أرقام طويلة وحالات قبول مختلفة بالعربي/الإنجليزي، ضيق عمود الرقم، تغيير التبويب مع مسودة وصفوف وقيم مالية، خطأ رأس مخفي وخطأ صف/بنود فارغة، Save/Save and Print وView/Edit، طباعة من أي تبويب، ارتفاع وعرض ضيقان وRTL/light/dark. لا build/test/lint/browser/DB/migration/commit/push/deploy. لا وكلاء إضافية لأن النطاق مرتبط بنفس مكوّن المحرر، وإصلاح قالب الرقم صغير اكتمل محليًا قبل التبويبات؛ التنسيق المتوازي لن يقلل زمنًا ذا معنى. رسالة commit مقترحة فقط: refactor(work-orders): add editor tabs and space number status badge.

## فصل رقم أمر العمل عن شارة القبول — ٢٠٢٦-١٠-٣١

الحالة Implemented — source-only؛ Owner verification pending yes. طلب المالك اللاحق «عايز عمود للبادج وعمود للرقم» ينسخ قرار الجمع السابق في خلية واحدة. عقد الشريحة S مجمد بهذا الطلب: عمود no برقم الأمر وحده، يليه acceptanceStatus بعنوان حالة القبول، مع نفس القيم والألوان وبلا تغيير تبويبات المحرر أو API.

طُبق UI05/06 عبر DataTableColumn type=status وstatus callback، بدل قالب noTemplate والـViewChild/imports الخاصة به. أزيل القالب المركب كله، وأصبح عرض/تصدير الرقم مستقلًا؛ يملك formatter المشترك ترجمة البادج في عموده الجديد للطباعة وExcel. استُخدمت acceptanceStatus الحقيقية الموجودة في WorkOrderListModel وWorkOrderListVM وخيارات enum0/1/2؛ يدعم backend ApplyGridFilters الحقل الموجود قبل Count/page، لذلك أضيفت خيارات تصفية رقمية بنفس نمط عمود الحالة الحالي. لا عمود نقل مختلق أو sort غير مدعوم أو تغيير API/فلتر الرأس. ترتيب الأعمدة: الإجراءات المشتركة، الرقم، حالة القبول، التاريخ، العميل، رقم العميل، الفرع، المركبة، الإجمالي، الخصم، الصافي، حالة الأمر. خصائص الرد الحالية تغطيها مع Id؛ لا إضافة Backend.

المراجع والمسار والقراءات والدليل المرجعي C1822/R0550 كما في شريحة أوامر العمل السابقة؛ تبقى مجموعات الرأس والبنود والملاحظات والتبويبات كما نُفذت. المطلوب قرار عرض صريح وليس استنتاجًا من مرجع Speed. حزم المراجعة الثماني نجحت Check قبل الاستخدام، وUI05 وformatter/table status الفعليان مقروءان. لا قاعدة مشتركة جديدة تحتاج كتابًا أو مهارة؛ استُعمل المالك الحالي. جرد الكاش والتحميل السابق لم يتغير: نفس lookup/bootstrap/direct detail/options/list/outputs والـwriters/lifetimes/Retry، ولا طلب جديد لكل خلية. لا استعلام أو فهرس جديد مبرر لفصل حقلين موجودين، ولا schema/migration أو ادعاء تحسن سرعة مقاس.

الملفات: WorkOrder list TS/HTML ودليل UserGuide/content/workshop-guide.ts عبر /UserGuide/workshop، مع شرح العمودين والتصفية والتقرير/Excel بالعربية والإنجليزية. نجح تحليل صياغة TS والدليل وقالب Angular وdiff --check؛ روجع الفرق الكامل للنطاق وحُفظت تعديلات التبويبات السابقة. المعاينة التشغيلية والقياسات متبقية: حالتا العرض العربي/الإنجليزي، القبول/الرفض/الانتظار، فلتر كل عمود، والطباعة وExcel. لا build/test/lint/browser/DB/migration/commit/push أو وكلاء لتغيير قالب صغير متسلسل. رسالة commit مقترحة فقط: fix(work-orders): split number and acceptance status columns.

## عقد تصحيح إظهار بنود أمر العمل — ٢٠٢٦-١٠-٣١

الحالة Frozen؛ Owner verification pending yes. بلاغ المالك «Work Order بيتعرض من غير Items» يراجع شريحة تبويبات المحرر السابقة. فحص المصدر لا يثبت رد شبكة فعليًا: WorkOrderDetailVM/WorkOrderProfiler يعرّفان WorkOrderItems، وخدمة الواجهة تستقبل نفس الاسم workOrderItems، ثم rows.replace يملأ parent FormArray. لا مصدر مؤكد يبرر تبديل اسم الحقل أو استحداث API أو بنود بديلة. لوحة البنود حاليًا mounted مخفية منذ أول render، وجدولها يعتمد ContentChild على controls قابلة للتعديل أثناء الرد غير المتزامن.

الاختيار المحافظ لهذا البلاغ: إبقاء FormArray والـEditableRows في الأب، وتهيئة عرض لوحة البنود فقط عند اختيارها أو printing، لأنها لا تملك request/subscription أو upload owner يستوجب البقاء mounted (UI13). الاحتفاظ بالملاحظات/الرأس كما هي. عرض عدد البنود بقدرة count الموجودة في EditorTabs، وإظهار البنود المحفوظة مباشرة بعد تحميل سجل في وضع View عند وجودها، دون تغيير تبويب البداية للإنشاء أو شروط الحفظ. لا اختراع سجلات أو fallback من اسم خاصية غير معتمد. الرد الناجح يجب أن يحتوي مصفوفة workOrderItems؛ غيابها يفشل برسالة التحميل/Retry الحالية بدل تحويل الرد الناقص بصمت إلى []. مصفوفة فارغة حقيقية تبقى حالة فارغة ولا تتولد لها بيانات. الطباعة تستمر في تركيب القسمين قبل الإخراج.

الشريحة مصدرية UI13/14/22/28 وPHASE03/06 بتناسب بعدCheck ناجح للحزم الثماني. عقد البيانات/الكاش/الاستعلام والمالية في المراجعة السابقة ثابت؛ لا تغيير Backend أو Mapper/Schema/Index. هذه معالجة موضع العرض/تهيئته والتحقق من اكتمال الرد، وليست ادعاء إعادة إنتاج سبب البلاغ داخل المتصفح أو إثبات تعديل قاعدة البيانات.

## تنفيذ تصحيح ظهور بنود أمر العمل — ٢٠٢٦-١٠-٣١

الحالة Implemented — source-only؛ Owner verification pending yes. نُفذ العقد المصغر السابق في WorkOrder details TS/HTML ودليل UserGuide/content/workshop-guide.ts. الجدول يُركب عند اختيار البنود أو أثناء الطباعة، وتبقى القيم والصفوف والهوية وEditableRows في FormGroup/FormArray الأب. لا قراءة شبكة داخل لوحة البنود؛ التسجيل العرضي في سياق mock data يظل مملوكًا للمكوّن المشترك وينتهي عند هدم العرض. لذلك لا يُعاد تحميل مصدر أو فقد مسودة عند تبديل التبويب. يفتح View البنود المحفوظة مباشرة عندما يكون عددها أكبر من صفر؛ الإنشاء يحتفظ ببداية التفاصيل. يعرض EditorTabs عدد الصفوف من itemsArray.length، بما فيها صفر حقيقي.

تحقق الرد صار صريحًا: لا تُقبل نتيجة ناجحة بلا مصفوفة workOrderItems، وتظهر failedToLoadDetails/Retry الحالية بدل إسقاط البيانات إلى []. يمرر populateForm المصفوفة المطلوبة مباشرة إلى rows.replace؛ لا alias أو بند بديل أو اشتراط جديد على العدد. Response false يستخدم خطأه الحالي، والرد الناقص يستخدم رسالة فشل القراءة حتى لا يُعرض successful message كخطأ. تبقى صفوف الخادم/المبالغ/الضريبة/المركبة والقيم التاريخية وقواعد الحفظ/الإجماليات كما هي. عند printing يُركّب قسم البنود بغض النظر عن activeTab ويكشف الرأس كما قبل، مع نفس خدمة الطباعة وحدود scroll.

فحص المنتج الخلفي: WorkOrderDetailVM يعلن List<WorkOrderLineDetailVM> WorkOrderItems=[]، وWorkOrderProfiler يربط WorkOrderItem/WorkOrderLineDetailVM بالاتجاه الصحيح، والمسار المستهلك GET WorkOrder/GetByWithNavigationsId/{id} يصل detail الموروث؛ لم يظهر اختلاف أسماء مثبت يستلزم تغيير Backend. هذه أدلة مصدر، لا ادعاء أن الرد الفعلي في التشغيل فُحص أو أن السبب الوحيد أعيد إنتاجه. إذا كانت المصفوفة الفعلية فارغة، تُعرض حالة empty ولا تُختلق بنود. لا تعديل عام في ContentChild أو كشف تلقائي لكل التبويبات.

التحميل والكاش والأداء: نفس جرد Customer/Branch/Vehicle sources وخيارات WorkOrder/options والسياسة المباشرة وdetail الموثق في الشريحة السابقة، دون GET جديد عند التبديل أو cache أو writers/watch/invalidation جديدة. start/finalize/global page owner وfailure/Retry كما كانت؛ لا تعديل schema/queries/predicates/order أو index، ولا فهرس جديد مبرر لإعادة تركيب العرض. القياس قبل/بعد والظهور الفعلي يبقيان متبقيين؛ لا ادعاء نسبة سرعة أو اكتمال كاش الشاشة الأوسع. تُطبق PHASE03/06 فقط بعد Check ناجح للحزم الثماني؛ لا عقد حسابات/API/Mapper جديد.

الفحوص: نجح parser للمكوّن والدليل وقالب Angular وdiff --check؛ روجعت مناطق التركيب/الطباعة والتحقق وFormArray مع الفرق الحالي السابق. أُضيف شرح العدد وفتح البنود المحفوظة وRetry في /UserGuide/workshop بالعربية والإنجليزية. تحقق المالك المتبقي: View لسجل له بنود والتحقق من الأوصاف والمركبات والأرقام، تبديل التفاصيل والبنود، إنشاء/تعديل وإزالة صفوف دون فقد المسودة، خطأ قراءة/Retry ورد ناقص، وسجل بلا بنود حقيقية والطباعة من أي تبويب وRTL/theme/الارتفاع الضيق. لا build/test/lint/browser/DB/migration/commit أو وكلاء لتعديل عرض متسلسل محدود. لا قاعدة مشتركة جديدة تحتاج تحديث كتاب/مهارة؛ هذا استخدام UI13 القائم مع قارئ الأب. رسالة commit مقترحة فقط: fix(work-orders): initialize item panel on display and validate loaded rows.

## مسافة زر سجل الحركات داخل عرض المركبات — ٢٠٢٦-١٠-٣١

الحالة Implemented — source-only؛ Owner verification pending yes. المالك طلب مسافات حول View Movements Log ثم أكد «فى View vehicles». الشريحة S محددة بزر WorkshopVehicleDetailsComponent داخل recentMovements؛ قورنت بـUI13/24 وأدوات Sigma الموجودة بعدCheck ناجح للحزم الثماني. أضيفت حاوية sigma-u-p-3 (0.75rem من كل جانب) حول PrimaryActionButton، وno-print على الحاوية؛ لا تغيير قياس الزر أو نمطه أو handler/disabled أو URL أو جدول الحركات. مصدر sigma-utilities الحالي يعرّف p-3، فلا CSS محلي أو قدرة مشتركة جديدة أو تحديث كتاب/مهارة لازم. مرجع C1833 ومسار الشاشة والعقد المرجعي المقروءان في الشريحة السابقة مستمران؛ هذا تنسيق حدده المالك وليس عقد أعمال مستنتجًا من Speed.

أُوضح موضع الزر أسفل جدول الحركات في دليل UserGuide/content/workshop-guide.ts بالعربية والإنجليزية عبر /UserGuide/workshop. نجح تحليل قالب Angular والدليل وdiff --check، ورُوجع نطاق HTML حول الحاوية مع الحفاظ على تغييرات الأداء والتنقل السابقة. لا تغيير طلبات أو query/index/cache/writers/watch/invalidation أو start/finalize/Retry، ولا تحسين سرعة مقاس أو فهرس/migration مبرر لمسافة عرض. لا backend أو قراءات/كتابات جديدة. المعاينة المرئية للفراغ والاتجاهين والعرض الضيق والطباعة متبقية. لا build/test/lint/browser/DB/migration/commit أو وكلاء لتغيير حاوية صغيرة. رسالة commit مقترحة فقط: fix(workshop): add clearance around vehicle movement log button.

## عقد عرض تفاصيل الحركة من حركات المركبة الأخيرة — ٢٠٢٦-١٠-٣١

الحالة Frozen؛ Owner verification pending yes. طلب المالك «نفس View ده بكل تفاصيله ... جنب كل سطر ... فى view vehicles». التفسير المصدرّي الأقرب لعبارة recent documents هو تبويب Recent Movements الموجود فعليًا في View Vehicles؛ فهو جدول الحركات، بينما Documents معرض ملفات بلا صفوف حركات. لا سؤال ولا إنشاء تبويب موازٍ.

النطاق: WorkshopVehicleDetailsComponent وجدوله، النموذج WorkshopRecentMovement، وWorkshopVehiclesComponent/route guard، مع MovementCheckCardComponent الحالي ومجموعات بياناته الكاملة. يُستخدم نفس app-movement-check-card الذي يستضيفه /logsMovement، لا نسخة قالب/normalizers أو طلب جديد لكلصف. المصدر الحالي CollectionMovement/GetMovements يرد MovementDto ذات source/movementId/movementKey ومعلوماتالخروج/الدخول والمرجع/التواصل؛ تُحفظ كاملة بامتداد/إعادةاستخدام LogsMovementListDTO بدل subset السابق، دون تغيير endpoint/page10 أو قواعد الفلترة.

المجمد: ActionList عام view في DataTable actions وفق UI07، لكل مصدر مدعوم بنفس الخمسة في سجل الحركات. تمرير الصف نفسه أو snapshot كامل مع source+movementId إلى نفس المكوّن، مع تعطيل أي فتح آخر أثناء عرض الحركة أو تحميل/طباعة/إبطال السياق. closed المقبول من طفل الحركة يمسح اختياره مباشرة؛ لا إعادة guard. يبقى طفل الحركة mounted خارج تغييرات تبويب الأب، وتُمنع أفعال الأب/إغلاقه أثناء وجوده؛ مسار الخروج من route يفوض canDeactivate عبر القائمة → تفاصيل المركبة → قارئ الحركة لحفظ ملف الرفع/الكتابة/التأكيد. لا يقطع السياق كتابة أُرسلت بالفعل.

إبطال السياق في قارئ الحركة المشترك سيستخدم إشعار contextChanges الموجود: إلغاء reads/print preparation ومسح البيانات وإبطال retry/new uploads حتى إعادة الفتح؛ يبقى write busy الحقيقي حتى finalize المستقل حتى لا يختفي طفل يرفع ملفًا. لا تغيير API أو صلاحيات upload أو حالة الحركة؛ هذا UI28 fencing ووراثة نفس العرض من المستهلكين. root يملك logsMovement view TS/HTML والدليل/الدمج؛ وكيل frontend المعاد استخدامه يملك Workshop/workshopVehicles details TS/HTML وmodels/list وlist TS/routes فقط. لا overlap، ولا تعديل sharedcontrols/Backend/Docs من الوكيل.

حزم المراجعة الحالية متسقة؛ الشريحة UI05/07/13/15/28 وPHASE02/03/05/06 بتناسب. تبويبات/مستندات/رفع/إجاباتالفحص/الرسوم غيرالمتاحة في C1636/R0240 وC1833 هي نفس حدود المصدر الحالية، ولا إضافة سجل أو صلاحية من JavaScript. لا تحميل حركات أو تفاصيل مسبق لكل صف؛ تحسينات القراءة الأولى/NRM/lazy tabs السابقة تنتقل تلقائيًا للمستهلك الجديد. دليل UserGuide/workshop وmovements يُحدث بعد الدمج، والـruntime/SQL/سرعة النقر متبقية.

## توضيح زر العرض الوحيد للحركة — ٢٠٢٦-١٠-٣١

الحالة Frozen؛ Owner verification pending yes. توضيح المالك: «خليه زر view على شكل عين لان مفيش غيره» يبدّل presentation إجراء الصف الجديد من قائمة إلى أيقونة مباشرة داخل Recent Movements في View Vehicles. القرار: امتداد public singleActionAsIcon في ActionButton وDataTable المشتركين؛ opt-in هنا فقط لأن الطلب سمّى هذا الإجراء/الموضع، بينما نمط القائمة الحالي مقرر في UI07 لبقية المستهلكين. يظهر زر واحد native بأيقونة الإجراء وtitle/aria-label مترجمين حين يوجد إجراء مرئي واحد؛ صفر يخفيه وأكثر من واحد يحتفظ بالقائمة. لا قالب إجراء خاص بالميزة أو تغيير execute/visible/disabled/confirmation/domain contracts. Method مشترك واحد يعيد فحص membership/visibility/disabled عند النقر؛ التصدير والطباعة يستبعدان الأفعال كما كانا. تُوثق القدرة في UI07 والمهارة والحزم عبر المولد، وتستخدمها DataTable الحالية بلا field/DTO/query جديد.

## تنفيذ عرض الحركة الكامل بزر العين داخل عرض المركبات — ٢٠٢٦-١٠-٣١

الحالة Implemented — source-only؛ Owner verification pending yes. أصبح لكل حركة مدعومة في Recent Movements زر عين مباشر يفتح نفس MovementCheckCardComponent المستخدم في سجل الحركات، بكل تبويباته الستة وتفاصيله وأخطاءه وإعادة المحاولة والطباعة وسياسة مستندات الاتفاقية الحالية. الإغلاق المقبول يعيد المستخدم لعرض المركبة. يظل Documents معرض الملفات؛ لم يُنشأ تبويب حركات موازٍ أو نسخة من قارئ الحركة، ولم تُختلق بيانات غير متاحة في مصدر الحركة.

أصبح WorkshopRecentMovement مرادفًا لـLogsMovementListDTO لحفظ استجابة CollectionMovement/GetMovements كاملة، بما فيها source/movementId/movementKey وبيانات الخروج والدخول والمرجع والتواصل. لم يتغير endpoint أو حجم آخر عشر حركات. يقبل الفتح المصادر Agreement/CollectionMovement/DeliveryMovement/NRM/WorkshopMovement فقط، وهوية صحيحة موجودة في الصفوف الحالية، مع snapshot كامل ومنع التكرار أثناء القراءة والطباعة أو إبطال السياق ووجود قارئ مفتوح. لا طلب تفصيلي لكل صف أو prefetch؛ الطلب يبدأ بالنقر فقط، وتنتقل إليه قراءة NRM المصغرة والتحميل عند اختيار تبويب المستندات أو الفحص الموضحان في مراجعة الحركات.

واجهة الأفعال المشتركة: DataTable.singleActionAsIcon مدخل اختياري قيمته الافتراضية false، يمر إلى ActionButton.singleActionAsIcon. تفعيله لهذا الجدول وحده يختار الزر عند إجراء مرئي واحد؛ صفر يخفيه وأكثر من واحد يبقي القائمة. الزر native يستخدم bi-eye واسم View المترجم في title/aria-label، مع disabled الحالي وسلوك Enter/Space الأصلي؛ الأيقونة مخفية عن قارئ الشاشة. runAction يعيد فحص عضوية الإجراء وvisible/disabled لكل من النقر المباشر وأمر القائمة، ولا يتغير نموذج القائمة المستقر أو تصدير البيانات أو الطباعة. القدرة موثقة في UI07 والمهارة مع سطر مراجعة؛ لا قالب خاص بالميزة أو غلاف PrimeNG جديد أو لون محلي.

عمر النافذتين: قارئ الحركة مركب خارج panels والأب، ويمنع الأب تغيير المركبة أو التبويب والطباعة والتنقل إلى السجل وإغلاقه أثناء فتحه. مسار canDeactivate يفوض من القائمة إلى تفاصيل المركبة ثم قارئ الحركة نفسه، وbeforeunload يراعي الرفع/الطباعة/التأكيد والمسودة الفعلية. closed لا يعيد طلب الحارس. عند تغير السياق تمسح قراءات المركبة وتبطل جلسة الطفل من إشعار السياق المشترك؛ يظل الطفل موجودًا لحفظ حاجز الكتابة المرسلة حتى finalize المستقل، دون تطبيق نتيجة قديمة أو إعادة كتابة. تفاصيل هذا السياج في مراجعة قارئ الحركات. ضُبط flex/overflow لسلسلة عرض المركبة الحالية لإبقاء آخر صف وزر السجل قابلين للوصول في ارتفاع قصير، وشريط التبويبات لا ينكمش؛ حدود الحجم والطباعة الحالية محفوظة.

التحميل والكاش: قراءة المركبة Workshop/vehicles/{id} وCollectionMovement/GetMovements قراءات تشغيلية مباشرة كما في الشريحة السابقة، والأخيرة تبدأ عند تبويب الحركات مرة ناجحة لكل جلسة مع Retry صريح. لا source cache opt-in أو writer/invalidation/watch جديد؛ يحتفظ إشعار السياق وإلغاء reads الحاليان بملكيتهما. قارئ الحركة المشترك يستخدم direct detail ومؤشره المحلي لأن الحوار يغطي shell، والمستندات direct operational/policy، والفحص direct reference بلا source opt-in؛ لا cache مصطنع. لا تغيير query/predicates/schema أو فهرس جديد مبرر لزر صف؛ تحسين استعلام NRM موثق منفصلًا بلا migration. فتح النافذة لا يثبت سرعة مقاسة أو مطابقة cache/loading لكامل الشاشات خارج النطاق.

المراجع: بقيت أدلة Speed المحلية C1833 وC1636/R0240 من لقطة٢٠٢٦-١٠-٢٨ والعقود المجمدة السابقة وحدودها؛ الطلب يقر إعادة استخدام العرض الحالي، ولا يقر صلاحية أو أثر حسابي جديدًا. حُدث دليل /UserGuide/workshop في UserGuide/content/workshop-guide.ts بالعربية والإنجليزية لزر العين وعودة الإغلاق والتفاصيل الستة. دليل /UserGuide/movements يشرح lazy reads والسياق. لا استدعاء خارجي للمرجع.

المطابقة: نُفذت ملفات workshopVehicles الستة (details TS/HTML/SCSS، list TS، model list، routes)، والمالكان المشتركان ActionButton/DataTable في أربعة ملفات، وقارئ الحركة المشترك ودليلا المستخدم ضمن نطاقهما. الوكيل الأمامي المعاد استخدامه بالموديل الموروث نفذ الملفات الخمسة المعزولة بعد تجميد العقد؛ root نفذ SCSS والقدرة المشتركة والسياج والدليل وراجع الدمج والفرق. لم يتداخل مع الوكيل الخلفي الذي يملك NRM فقط. الحزم الثماني تولدت بالمولد بعد تحديث UI07/13/15 والمهارة ونجح Check مجددًا؛ المراجعة الدلالية تؤكد مدخلًا افتراضيًا محافظًا وحارس قراءة قابلًا للإلغاء دون تجاوز كتابة فعلية، لا تغيير عقد أعمال.

نجح تحليل صياغة TypeScript وقوالب Angular وفحص diff --check للنطاق، مع مراجعة كامل تغييرات المصدر والملفات الجديدة ذات الصلة. التحقق مصدرّي؛ لم ينفذ build/test/lint/browser/DB/migration/commit/push. يبقى قبول المالك التشغيلي: زر العين للخمسة مصادر والنقر الأول/لوحة المفاتيح، منع فتح مكرر، التبويبات الستة وRetry والطباعة ورفع المستند، الرجوع وإغلاق النافذتين، تبديل السياق أثناء القراءة والرفع، RTL/themes والعرض القصير، وقياس cold/warm مماثل قبل/بعد. رسائل commit مقترحة فقط: feat(workshop): open full movement view with direct row eye action؛ docs(ui): document pure-view close and direct single actions.

## عقد تحسين فتح إنشاء المهمة وتبويب تفاصيلها — ٢٠٢٦-١٠-٣١

| البند | القرار |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| النطاق | طلب المالك تسريع Create Job وتصغير الإجماليات إلى صف واحد، ثم جعل تفاصيل JOB تبويبات |
| الشكل | واجهة UI02 routed master/detail الحالية بثلاثة أعمدة؛ الخلفية نمط aggregate القائم، لا تغيير حسابات أو كتابة |
| التبويبات | التفاصيل العامة، الأصناف، العمالة، المتفرقات، الأعمال الخارجية داخل عمود تفاصيل المجموعة فقط؛ EditorTabs مشترك، form/arrays ثابتة، تركيب المجموعة/اللوحة المختارة وحدها، فتح لوحة الخطأ قبل التركيز |
| الإجماليات | SummaryCards slim الحالية مع columns=6 وverticalPadding=4، ست قيم حالية في صف واحد عبر public API، دون CSS داخلي أو صيغة حسابية جديدة؛ الوصول للقيم عبر title والطباعة الطبيعية محفوظان |
| الفتح | فصل نتائج قوائم الاختيار بدل حجبها جميعًا خلف forkJoin9؛ تأجيل Item/StaffProfile/Workshop إلى تبويبها، نجاح كل مصدر يحتفظ به للجلسة وRetry للفاشل فقط |
| الكاش | Customer/GetSelect وVehicle/GetSelect وItem/GetSelect opted-in فعلًا؛ finite bootstrap ثم separate ReferenceLookupBindings watch بنفس feedback مع حفظ selected labels وعدم تعديلform؛ باقي GetSelect مباشرة بلا opt-in |
| التحميل والعمر | ReferenceLookupStatus للـrequired routed lookup page host؛ إلغاء reads ورفض النتائج عند context invalidation/DestroyRef، منع أفعال جديدة حتى إعادة الفتح، حفظ كتابة أرسلت بالفعل وحاجز خروجها |
| API/الخلفية | عقود endpoints الحالية مجمدة؛ تدقيق مصدري مستقل محدود للـJob/options ومصادر الاختيار والفهارس قبل اقتراح أي تحسين خلفي. لا صلاحيات/مالية/schema/migration جديدة |

الدليل المرجعي: مدخل speed-analysis، شاشة Jobs من لقطة2026-10-28 (R0552/C1803) وشرح الدليل ومصدر الإنشاء المحفوظ؛ تستخدم مجموعات العمل والرسوم كدليل محتوى فقط. الخادم والمالية وصلاحياته ليست مثبتة من JavaScript. مصادر سيجما: /Job/create عبر pages/routing.ts:804 وJob_Routes إلى JobEditorComponent. قبل التعديل loadLookups يجمع9 مصادر ويؤخر تطبيق كل نتيجة حتى الأبطأ؛ جميع جداول كل المجموعات مركبة ومخفية بـCSS؛ SummaryCards row تحت1100px تلتف رغمslim/max80. الدليل الحالي /UserGuide/workshop مقروء. PHASE03/05/06 بتناسب بعد Check ناجح؛ لا طلب مراجعة شامل لبقية Job workflow. root يملك واجهةJob والدليل والدمج؛ التدقيق الخلفي مستقل read-only بلا تعديل، ولا إجراء تشغيل أو قاعدة بيانات.

تعديل العقد بعد تتبع المصدر: JobService.GetOptionsAsync يقرأ UNION/Distinct/OrderBy لأسماء CreatedBy من Job وLubricationJob رغم أن محررJob يستهلك نسبة الضريبة فقط. القرار Frozen: وسيط اختياري includeCreatedByUsers=true في service/controller options الحالي؛ القائمة وبقية المستهلكين يحافظون على defaulttrue ونفس DTO، ومحررJob يطلبfalse فيتجاوز union ويعيد createdByUsers فارغة مع قراءة TaxPolicy الطازجة نفسها. لا cache للسياسة أو تغيير payload مالي/EF. الوكيل الخلفي يملك تعديل interface/service/controller الحاليين فقط بعد هذاالتجميد؛ root يملك client/editor/docs. فحص المصدر دون build/runtime/SQL.

## تنفيذ تحسين فتح إنشاء المهمة وتبويب تفاصيلها — ٢٠٢٦-١٠-٣١

| البند | النتيجة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| الشرائح | اكتشاف/تجميد متناسبان، PHASE03 للواجهة وPHASE05 للربط وPHASE06 للمطابقة؛ PHASE01 مقتصر على وسيط options الاختياري. لا تغيير grid/list/domain-actions أو حسابات/ترحيل |

أصبحت تفاصيل المجموعة المختارة خمسة تبويبات مشتركة: التفاصيل والأصناف والعمالة والمتفرقات والأعمال الخارجية، داخل العمود الثالث الحالي. بقيت بيانات الرأس وقائمة المجموعات بموضعهما. يُركب محتوى المجموعة والتبويب المختارين فقط بدل تركيب أربع جداول لكل مجموعة ثم إخفائها بـCSS؛ FormGroup/FormArray وصفوفها وهوياتها تبقى مملوكة للأب، بما فيها قيم اللوحات غير المركبة. الأعداد في التبويبات من المصفوفات نفسها. الحفظ يحدد أول مجموعة غير صالحة ويفتح لوحة الحقل غير الصالح قبل التركيز؛ التبديل محروس أثناء الحفظ والتأكيد ولا يعدل المسودة. لا حقول أو validations أو payloads أو aliases أو نتائج مالية جديدة.

انتقلت SummaryCards إلى أسفل مساحة الأعمدة الثلاثة لتأخذ العرض المتاح كاملًا وتسمح بقراءة الست قيم في صف واحد. المدخلات الحالية slim/row/columns6/verticalPadding4/maxHeight80، وmx-2 لمحاذاة inset8px وmb-2 لمسافة الفوتر من الأدوات الموجودة. لا CSS داخلي/لون/خط/أيقونة محلية، ولا تغيير ترتيب أو معادلات الأصناف/العمالة/المتفرقات/الخارجي/الضريبة/الإجمالي؛ الست قيم الحالية وMoney format وtitle للقيمة الكاملة محفوظة. العرض الضيق يبقي ستة أعمدة وفق طلب المالك ومدخل columns الحالي، مع text access والمحدودية المشتركة؛ قبول القراءة المرئي متبقٍ. الطباعة الطبيعية للمكوّن المشترك تحرر اللف والارتفاع؛ لا أمر طباعة وثيقة في محرر Job أصلًا، وGate Pass المطبوع من القائمة لم يتغير.

| موضوع المطابقة | الكتاب والمالك الفعلي | نتيجة المصدر |
|---|---|---|
| العرض/التمرير | UI1، styles.scss sigma-route-host/editor-page/panel/form/body وثلاثةpane عند900/620؛ editor.scss لا يضيق جذر الشاشة | نفس سلسلة fill بعرض المساحة، header/footer ثابتان، تمرير الرأس وقائمة المجموعات وتفاصيل المختار داخلي؛ لا page-height calc أو CSS جديد |
| التبويبات | UI13، EditorTabsComponent workspace + tabId/panelId/RTL keyboard | خمس مفاتيح محلية حقيقية، ariaLabel وtabpanel/aria-labelledby المتطابقان، نموذج أب ثابت؛ لا نسخ تحكم PrimeNG أو تابات محلية |
| صفوف الأطفال | UI14، EditableCollectionTable/EditableRows/FormArray | بنود/عمالة/متفرقات/خارجي كما كانت؛ تركيب الجدول النشط دون فقد الصفوف أو الصفوف المخفية في الحفظ |
| الكروت | UI24/3، SummaryCards public columns/verticalPadding/row/slim؛ sigma-utilities mx2/mb2 | قدرة حالية دون تحديث كتاب/مهارة أو غلاف جديد؛ الموضع بعرض مساحة العمل بناء على طلب المالك |
| التحميل | UI22، ReferenceLookupStatus.ngOnChanges/ngOnDestroy → LoadingService.setPageLookupLoading؛ layout.component shell host | lookup batch من flags فعلية، لا inline spinner مكرر؛ Job route لا suppress showPageLoading والـshell computed يسمح بها |
| العمر/الأخطاء | UI28، cancelReads/DestroyRef/switchMap، ConfirmationDialogService، defaultIfEmpty | إنهاء قراءة عند المغادرة/السياق، رفض القديم، errors/Retry؛ الكتابة المرسلة خارج cancelReads ولا تتكرر |

الفتح الأول يقرأ ستة مصادر مستقلة بدل forkJoin تسعة: Customer وVehicle وStaff وWorkOrder وJob/options بالإضافة إلى WorkshopActivity للتبويب العام. تُطبق كل نتيجة ناجحة فور وصولها دون انتظار باقي القوائم. Item يؤجل للأصناف، StaffProfile للعمالة، Workshop للأعمال الخارجية، والمتفرقات لا تحتاج قائمة. مصدر Staff واحد يخدم مندوب المبيعات وصفوف العمالة كما كان؛ لا طلب موظفين مكرر. لا يعاد طلب مصدر ناجح عند التبديل؛ الخطأ أو النجاح الفارغ يبقى حالة صريحة وRetry يعيد الفاشل فقط، دون retry آلي أو طلبات متوازية مكررة لنفس المصدر. هذه حالة خيارات داخل عمر المحرر وليست خدمة cache جديدة.

| URL/رمز المستهلك | الكاش والبدء والعمر النهائي |
|---|---|
| Customer/GetSelect عبر CustomerService.getSelectList | source cacheSelect=true؛ finite read ثم watchSelectList بنفس skipErrorInterceptor عبر ReferenceLookupBindings، selectedCustomer/currentOptions/disableRetained=true؛ يبدأ عند الفتح |
| Vehicle/GetSelect عبر VehicleService.getSelectList | نفس المالك المرجعي الحالي، selectedVehicle؛ يبدأ عند الفتح |
| Item/GetSelect عبر ItemService.getSelectList | نفس المالك المرجعي الحالي، selected IDs من صفوف كل المجموعات؛ يبدأ عند أول فتح الأصناف |
| Staff/GetSelect عبر StaffService.getSelectList | direct reference بلا opt-in؛ مصدر واحد للرأس والعمالة، لا watch inert أو cache جديد |
| WorkshopActivity/GetSelect عبر WorkshopActivityService | direct reference بلا opt-in؛ يبدأ عند فتح التفاصيل، لأن serviceId في هذه اللوحة |
| WorkOrder/GetSelect عبر WorkOrderService | direct operational source بلا opt-in؛ يبدأ عند الفتح ويحفظ workOrderId/label الحاليين |
| StaffProfile/GetSelect عبر StaffProfileService | direct reference بلا opt-in؛ أول فتح العمالة |
| Workshop/GetSelect عبر WorkshopService | direct reference بلا opt-in؛ أول فتح الأعمال الخارجية |
| Job/options?includeCreatedByUsers=false عبر JobService.getOptions(false) | direct policy؛ نسبة الضريبة الطازجة فقط للمحرر، لا cache لسياسة أو finance؛ المصدر نفسه يرجع شكل JobOptions مع createdByUsers=[] |
| Job/{id} عبر getDetails (Edit/View) وWorkOrder/GetByWithNavigationsId/{id} عند sourceWorkOrderId | direct operational محفوظان، defaultIfEmpty/failure/Retry وإلغاء القراءة/lease finalize؛ لا prefetch عام في إنشاء عادي |
| Vehicle/GetByWithNavigationsId/{id} عبر JobService.getVehicleDetails عند اختيار مركبة | direct operational قائم؛ switchMap يلغي الهوية السابقة، global start/finalize وaria-busy وRetry للفشل. لم يُضيق هذا العقد العام أو يضاف إليه cache |

مالك الكاش المرجعي الحقيقي ReferenceLookupCacheService عبر BaseService.readReferenceSelect، والـwriters الناجحون Customer inherited post/put/delete/refresh وVehicle/Item add/update/delete/import-style paths التي تمر invalidateSelectOnSuccess/invalidateSelectSource يظلون كما هم. topicFor يربط lookup-customers/lookup-vehicles/lookup-items باتصال Realtime الحالي؛ TTL/rejoin/invalidation/tenant scope من المالك المشترك بلا socket أو watch جديد في الخدمات. التسجيل في الشاشة مرة لكل مصدر ناجح وينتهي مع DestroyRef أو إبطال السياق. قراءة bootstrap finite لا توضع في forkJoin مع stream لا ينتهي. تحديث الخيارات يحتفظ بالمعرف/الاسم المختارين من المسودة الحالية، ويعطل الخيار التاريخي الغائب بدل إتاحته لاختيار جديد؛ الأولوية للصف العائد من المصدر. لا إعادة دمج خيارات saved غير مختارة بعد تعديل المسودة، ولا تغيير قيم controls أو dirty أو أسعار/ضريبة من watch emission. الخطأ أثناء refresh يحتفظ بالخيارات ويقدم Retry؛ retained-data refresh صامت وفق المالك، والطلب الأول أو Retry غير المستند إلى snapshot يشارك loader الصفحة.

إبطال السياق يمسح تفاصيل/خيارات/سياسة العرض ويلغي القراءات والمراقبات والتحضير/التأكيد الخاص بالخروج، ويخفي النموذج برسالة إعادة الفتح. يمنع Retry/tab/group/save/edit/vehicle read جديدًا؛ لا يملأ استجابة قديمة الشاشة. لا يُلغى Save المرسل مع cancelReads ولا يكرر، وتبقى saving/hard exit guard حتى finalize؛ callback القديم لا ينقل أو يعيد تمكين النموذج. تأكيد حذف صف المملوك لـEditableRows يحتفظ بحاجزه حتى ينتهي؛ canMutate المحدث يمنع تنفيذ قرار قديم بعد السياق. لا تغيير عقد التخلص من المسودة أو write-time validation. أخطاء التفاصيل والمصدر تبقى بمالكها، ولا loading StateMessage مكرر فوق shell.

تحسين الخلفية المثبت: JobService.GetOptionsAsync كان يبني ثم ينفذ UNION+OrderBy+ToListAsync لأسماء CreatedBy من Job وLubricationJob الحية للمستأجر قبل قراءة TaxPolicy رغم أن محرر المهمة يستهلك effectiveTaxRatePercent وحده. صار المعامل includeCreatedByUsers اختياريًا وقيمته الافتراضية true في JobController/IJobService/JobService؛ false يتجاوز إنشاء/تنفيذ استعلام الأسماء ويترك tax policy والفشل/DTO كما كانا. قائمة Job ما زالت تطلب getOptions() الافتراضي وتستلم الأسماء. لا تعديل حسابات Job.RecalculateTotals أو Add/Update/Mapper/domain validation أو الصلاحيات أو transactions/EF أو models. دليل namespace/projrefs ثابت لأن لا نوع جديد؛ Roslyn syntax للثلاثة صفر أخطاء، وليس build.

الحدود الباقية من تدقيق الاستعلامات: Customer وStaff GetSelect إسقاطات محددة، بينما المسار الموروث Service.SelectAsync → Repository.GetDropdownAsync يقرأ صفوفًا كاملة ثم يعكس Id/Value/No في الذاكرة لمصادر Vehicle/Item/WorkshopActivity/WorkOrder/StaffProfile/Workshop، دون graph متشعب. لم يُغير المالك العام أو دلالة labels/No/order في هذا الإصلاح المحدود؛ هذه فرصة تحسين أوسع بعد قياس حجوم المصادر ومراعاة كل المستهلكين. القراءة التفصيلية لمركبة مختارة/أمر عمل مصدر ليست جزءًا من فتح Create فارغ، وقد تتطلب قياسًا منفصلًا. لا ادعاء أن مصدر SQL أو الشبكة الوحيد للبلاغ أعيد إنتاجه.

الفهارس: JobConfig/لقطة النموذج القائمة يثبتان SubscriptionId/Status وSubscriptionId/JobEstimationId ومفاتيح العلاقات؛ إعداد LubricationJob يثبت PK وفهرس العميل، دون فهرس خاص بالـCreatedBy. لم يبق استعلام منشئين على مسار إنشاء المهمة حتى يُبرر فهرس له؛ لا فهرس جديد/INCLUDE/filter أو schema/migration في هذه الشريحة. فهرس للقائمة أو للقوائم الموروثة لا يُقترح بلا plan/IO/cardinality يثبت فائدته مقابل تداخل وتكلفة كتابة/تخزين. لا Add-Migration مطلوب.

الأدلة المرجعية: قرئ مدخل speed-analysis ودليل٢٠٢٦-١٠-٢٧ (يربط S113 بمنتج الورشة ولا يقدم عقد API خاصًا لهذا المحرر)، والأصل المحفوظ library/pages/90c6e368ce903381.html لشرح الورشة، وشاشة14-workshop/screens/04-jobs.md ودورة الورشة المختارة ومتحكم C1803 من لقطة٢٠٢٦-١٠-٢٨. بصمة C1803 SHA256: 8E1C0EF2E411C774A182BEFE346D1E6047B31B4A107F73CB2BAB965AC87262E7. الدليل البرمجي يثبت مجموعات المهام ورسوم الأصناف/العمالة/المتفرقات/الخارجي والإجماليات؛ التبويبات والكثافة اختارهما المالك في طلبه، لا يُستنتج تصميم من Speed. تصنيف المطابقة: الحقول والمجموعات والصفوف والإجماليات الحالية محفوظة ومطابقة للنطاق؛ المتغيرات المالية/الصلاحيات/reference features الإضافية خارج هذا الإصلاح، وليست مستبعدة من هدف التكافؤ العام أو مثبتة من frontend. لا screenshot جديد أو جمع مرجعي أو وصول خارجي.

التحقق: فحص صياغة TS لملفي المحرر والخدمة والدليل، وقالب Angular، وdiff --check، ومراجعة فرق الواجهة والخلفية والربط/العقود/المفاتيح المستخدمة. الحزم الثماني نجح Check لها قبل الاستخدام وبقيت دون تغيير لأن القدرات المشتركة موجودة أصلًا؛ لا قاعدة قابلة لإعادة الاستخدام جديدة تتطلب كتابًا/مهارة/توليدًا. دليل /UserGuide/workshop في UserGuide/content/workshop-guide.ts محدث بالعربية والإنجليزية للتبويبات والحفظ والتحميل المتدرج والخيارات والإبطال. source conformance منفصل عن المعاينة والقياس. لا build/test/lint/browser/DB/migration/commit/push/deploy.

التحقق التشغيلي المتبقي: خمس عينات إنشاء بارد وخمس دافئة على نفس tenant/API/build/جهاز/شبكة وأعداد العملاء/المركبات/الأصناف/الأعمال نفسها؛ تسجيل first usable content وsettled required data وHTTP/payload/SQL plan-duration إن أتيح، ومقارنة نفس شاشة النطاق قبل/بعد. الميزانية المصدرية 6 مصادر أولية بدل9 (قد تكون4HTTP عند hit مرجعي حديث للعميل/المركبة)، مع0جداول أطفال في أول لوحة بدل4لكل مجموعة؛ لا زمن أو نسبة تحسن مقاسان. افتح كل تبويب ثم عد إليه، جرّب فشل/Retry ونجاح فارغ وتحديث cache مع خيار تاريخي، وغيّر المجموعة بعد إدخال/حذف صفوف، والحفظ مع حقل خاطئ في لوحة مخفية، ومصدرWorkOrder مفرد/متعدد المركبات، وسجلات Edit/View مغلقة، والخروج/السياق أثناء القراءة والحفظ والتأكيد. راجع row واحد للكروت والقراءة بالأرقام الكبيرة والارتفاع الضيق/طرفي900و620 وRTL/theme وفوتر ثابت دون page scroll.

التوزيع: root يملك editor TS/HTML وJobService Angular والدليل والمراجعة والدمج؛ الوكيل job_open_query_audit بالموديل الموروث نفذ تدقيق الاستعلامات ثم ملفات JobController/IJobService/JobService الثلاثة المعزولة بعد تجميد المعامل. مساران مستقلان دون overlap قللا وقت مراجعة المصدر ولم يعدلا بقية تغييرات المستخدم. رسائل commit مقترحة فقط: frontend — perf(jobs): defer editor lookups and tab selected job details؛ backend — perf(jobs): skip creator options when opening editor. يلزم تشغيل النسختين المتوافقتين للمعاينة، ولا ترحيل.

### تصحيح نوع المركبة عند الإنشاء من أمر عمل — ٢٠٢٦-١٠-٣١

الحالة Implemented — source-only؛ Owner verification pending yes. أبلغ المالك TS2322 عند editor.component.ts:445 لأن vehicleId الممرر إلى patchValue استُنتج unknown من تجميع الهويات. ثُبت مصدر التجميع Set<number> والمصفوفة number[] والمتغير number|null صراحة، مع نفس حارس typeof/positive ونفس قاعدة الاختيار التلقائي لمركبة واحدة مميزة فقط. عند الصفر أو تعدد المركبات يبقى null، و??null يحمي الفهرس دون cast أو تحويل قيمة مجهولة إلى رقم. قورنت WorkOrderDetailsDTO.workOrderItems.vehicleId (number|null|undefined) بـJobControls.vehicleId (number|null) وonVehicleChange؛ لا تغيير نموذج/API أو حسابات أو كاش/طلبات/فهارس أو سلوك تبويبات. دليل /UserGuide/workshop الحالي ما زال يصف السلوك الفعلي ولا يحتاج نصًا مختلفًا لتصحيح نوع فقط. الشريحة S تتبع UI2/16 وMaster5/7 وPHASE03/06 المتناسبين؛ أدلة C1803/R0552 والتحليل السابق سارية ولا دليل أعمال جديد في البلاغ. نجح Check للحزم الثماني، وفحص صياغة المصدر والفروق المصدرية؛ التحقق الدلالي من compiler والبناء عند المالك، لا build/test/lint/browser/DB/migration/commit/push. لا وكلاء لتعديل نوعين متسلسل محدود، ولا قاعدة مشتركة جديدة. لا Add-Migration. رسالة frontend مقترحة فقط: fix(jobs): type work order vehicle selection explicitly.

### عقد منع التمرير الأفقي للتبويبات — ٢٠٢٦-١٠-٣١

الحالة Frozen؛ Owner verification pending yes. طلب المالك بعد تبويباتJob «مش عايز سكرول عرضى فى التابات». presentation عامة قابلة لإعادة الاستخدام فتطبق وفق تعليمات المالك العامة في EditorTabs المشترك دون opt-in خاص بالشاشة: التبويبات الأفقية تلف صفوفًا حسب المساحة، والأزرار والعناوين الطويلة تنكمش وتلتف داخل عرض الحاوية بدل إخفاء أو إسقاط أفعال. يعالج المالك min-width:max-content وnowrap وoverflow-x:auto الحاليين، ويحفظ workspace/underline والأيقونات/العدد/الفوكس وRTL/theme والترتيب وIDs والأحداث ونموذجالأب. الـhorizontal host لاينكمش رأسيًا حتى تبقى الصفوف ظاهرة؛ vertical يحتفظ بتمريره الرأسي وUp/Down وحدودقائمته. لا مصادرأعمال/API/كاش/تحميل/فهارس تتغير، ولا تبويبات رأسية أو حذف تبويب مفترض. UI13/25/27 والمهارة والحزم عبر المولد تُحدث في المهمة، ودليلJob يوضح اللف؛ أدلةSpeedالمحفوظة السابقة C1803/R0552 للمحتوى فقط، والمالك مرجع هذا العرض. لاوكلاء لتعديل مشترك متسلسل محدود.

توضيح المالك اللاحق يحدّث العقد السابق قبل التسليم: «قلل العرض او المسافات بيحيث يكون كلهم فى صف واحد من غير سكرول». الحالة Frozen؛ المعتمد الآن صف أفقي واحد تتشارك أزراره العرض المتاح، مع حشو/فجوات/أيقونات أصغر في المالك المشترك، وعناوين قابلة للالتفاف داخل الأزرار بدل نقل التبويبات لصف ثانٍ. لا حذف تبويب أو عنوان/عدد أو إضافة scrollbar أو CSS خاص بـJob؛ التبويبات الرأسية وقواعدها الحالية باقية. هذا التوضيح يحل محل اقتراح لف صفوف التبويبات السابق؛ المالك اعتمد صفًا واحدًا لا صفوفًا متعددة.

### تنفيذ صف التبويبات المضغوط دون تمرير أفقي — ٢٠٢٦-١٠-٣١

الحالة Implemented — source-only؛ Owner verification pending yes. نُفذ توضيح المالك الأخير، لا اقتراح الصفوف المتعددة: EditorTabs الأفقي يوزع الأزرار بالتساوي عبر flex1/1/0 وmin-width0/max-width100%، في صف واحد nowrap، مع gap3px للشريط وحشو6px وفجوة4px داخل الأزرار وارتفاع أدنى36px. أيقونةworkspace20px بدل28px، glyph12px، وcount min18px بدل22px وحشو3px. حجم خط العنوان11px محفوظ، والعنوان الطويل يلتف داخل زرّه دون حذف كلمة أو إخفاء تبويب/أيقونة/عدد. overflow-x:clip يكمل احتواء العناصر التي صُححت أبعادها وليس إخفاء سكة عناصر غير قابلة للوصول. horizontal host غير منكمش رأسيًا؛ نفسالخمسة تظهر فيصفواحد بالمكوّن، ولاfeature CSS أوpublic opt-in. الوضع الرأسي يستمر بالقواعد الأقدم والتمريرالرأسي/UpDown وحجومه؛ حُصر media padding10px القديم بالرأسي حتى لا يعيد توسيع الأزرار الأفقية على الهاتف. جميع current shared consumers يرثون القاعدة العامة وفق standing owner presentation، وJob يستخدمه أصلًا؛ لا تغيير template/IDs/keyboard/events/controls/active tab أوlookup/save/read lifetime.

مطابقة المصدر: UI13/25/27 مقابل editor-tabs.component.scss والـTS/HTML الحقيقيين؛ :not(vertical) أعلى specificity من workspace القديم، وmin-width0 يلغيmax-content، وflex1/1/0 يلغي1/0/auto، وعناوينnowrap تُلغى فيالأفقي فقط. لا overrides منافسة في Job أوstyles.scss للاسمين workspace/vertical. فحصPostCSSsyntax للملف نجح، وتحليلTS لدليل workshop نجح، وdiff --check للنطاق نجح وروجع فرقالمصدر. لا فحصمتصفح أوgeometry أوbuild/test/lint. دليل /UserGuide/workshop يشرح صفًا مصغرًا واحدًا لا لفالتبويباتلصفوف. حُدث UI13 والمهارة معrevision مطابق في نفسالمهمة، وتولدت الحزم الثماني بالمولد ثم نجحCheck؛ المراجعةالدلالية تحفظمالكالتبويباتالمشترك والأرقامالمثبتة أعلاه وvertical exception ولا تنقل أيعقدأعمال.

جرد requests/cache/loading/writers/invalidation/watch/context والفهارس كمافي شريحةJob السابقة بلاrequest/service/API/predicate/join أوEF جديد؛ لا قياسسرعة أوفهرس/migration مبرر لتغييرحشو/عرضأزرار. أدلةSpeed للمجموعاتوالحقول مستمرة، وقرارالكثافةوالصف من المالك لاالمرجع. PHASE03/06 فقط؛ backend/domain/action contracts لا تتغير، وMapper/calculations خارجالتعديل. لاوكلاء لأنالتغييرمتسلسلومحدود. قبولالمالكالمتبقي: تبويباتJobالخمسة بترجماتEN/AR وعددصفر/كبير، نقر/LeftRight/HomeEnd/فوكسبالتبديل، حدود900و620 والعرضالقصير وRTL/light/dark، وثلاثةأنواعمنالمستهلكينالآخرين(underline/workspace/vertical) للتأكدمنوضوحالعناوين وعدمقصها أوإدخالسطر/scrollأفقي. لا build/test/lint/browser/DB/migration/commit/push/deploy؛ ولاAdd-Migration. رسالةfrontendمقترحةفقط: fix(ui): fit horizontal editor tabs into one compact row.

توضيح إضافي قبل التسليم: يطلب المالك تقليلًا بسيطًا للحشو حتى لا ينزل عنوان أي تبويب لسطرين. الحالة Frozen؛ تقليل الحشو الأفقي من6إلى4px مع بقاءالرأسي6px، وتوزيع العرض حسب طول المحتوى بـflex1/1/auto بدل المساواةالقسرية. عنوان التبويب nowrap؛ فيعرضشديدالضيق فقط يختصر داخلزرّه معtitle مترجم يحفظ قراءةالاسمكاملًا بدل تمددالشريط/قصزر. كلتبويب يحتفظ بالاسم الكامل فيDOM والـaccessible name، ولااختفاءلإجراء. لا زيادةخطأوصفرpadding، ولا تغييرالأيقونات/الأعداد/الارتفاع36 أوتفاعلvertical. هذا يحل محل قرارلفالعنوانداخلزرّه وقاعدةequalbasis، ويبقيصفالتبويباتالواحددونscroll.

النتيجة النهائية بعد تقليل الحشو الإضافي: Implemented — source-only؛ Owner verification pending yes. تعدّل horizontal button padding إلى6px block/4px inline بدل6px من كلجانب، وflex إلى1/1/auto حتى يحصل الاسم الأطول على عرض مناسب بدل مساواةالمسارات. label nowrap معellipsis محدودعندالضيق وtitle مترجم علىالزر؛ لا انتقالعنوانلسطرثانٍ أوسكةscrollأفقية، والاسمكامل فيDOM/accessible name. القيمالأخرىمنالشريحةالسابقةباقية، والعموديلايتغير. هذه المطابقة الحالية تحل محل أرقامpadding6/equalbasis ولفالعنوان في وصف التنفيذ السابق أعلاه. راجعrootفرقSCSS وHTMLبالكامل؛ نجحPostCSSparse وAngulartemplateparse وصياغةدليلTS وdiff --check. حُدثUI13/المهارة/revision/دليلworkshop بنفسالأرقاموالسلوك، وأُعيدتوليدالثمانيحزمبالمولدثمCheckناجحمعمراجعةدلاليةللمدخلاتدونقدراتأوعقودمتنافسة. لاAPI/query/cache/loading/index/schema/migration جديدة، ولااختباراتأوبناءأومتصفحأوقاعدةبيانات. قبولالمالكالبصريالمتبقييشملتأكدالأسماءفيصفواحدداخلعرضJobالحالي، pointer/keyboard وRTL/themeوالأسماءالطويلةعندالضيق. رسالةfrontendمقترحةفقط: fix(ui): tighten editor tab padding and keep labels on one line.

### المسافة أسفل ملاحظات تفاصيل المهمة — ٢٠٢٦-١٠-٣١

الحالة Implemented — source-only؛ Owner verification pending yes. طلب المالك مسافة بسيطة تحتNotes فيJob Details. الشريحةS المجمدة بهذاالطلب تضيف sigma-u-mb-2 إلىمجموعةحقلjob-notes فقط، أي8px logical bottom margin منsigma-utilities الحالية؛ عرضCreate/Edit/View يستهلكالقالبنفسه. المالك UI1 لأدواتالمسافات/field group وUI13 لنفسالمحرر، ولا CSS/قاعدةمشتركة جديدةأوتغييرفيالتمرير/الفوتر/حقولالنموذج. دليل /UserGuide/workshop محدث بموضع إدخال المعلومات الإضافية فيNotes؛ لا أرقامCSS فيإرشادالمستخدم. أدلةC1803/R0552 السابقةللمحتوىسارية، والطلب نفسه إثباتالمسافة فلاعقدأعمالجديد. لا تغييرAPI/query/index/cache/loading/writer/watch/context أوحسابات؛ لا فهرس/migration أوقياسأداء مبرر. حزمPHASE03/06 بعدCheckناجحللثماني، وفحصصياغةالقالب/الدليل وdiff --check ومراجعةالفرق المحدد؛ المعاينةمتبقيةللإنشاء/العرضوالاتجاهينوالعرضالقصير. لاوكلاءلتعديلعنصرعرضواحد، ولاbuild/test/lint/browser/DB/migration/commit/push. رسالةfrontendمقترحةفقط: fix(jobs): add bottom spacing below notes.

### عقد توسيع تكلفة العمالة في تفاصيل المهمة — ٢٠٢٦-١٠-٣١

الحالة Frozen؛ Owner verification pending yes. طلب المالك تكبيرCost فيLabour قليلًا. القرار: labourColumns.cost minWidth من100إلى140px عبر metadata الحالية، وtableMinWidth للعمالة من880إلى920px للمحافظة على حيز بقيةالأعمدة، بلا CSS/inputwidthمحلي أوتغييرالأصناف/الخارجي. UI14: المالك EditableCollectionTable يمررcolumn.minWidth إلىcol/th فيجدولfixed، والمدخل الرقمي يملأخليتهبالأسلوبالمشترك. لا API/قيمة/صيغة/رقم/دقة/validations أوكاش/تحميل/استعلامات/فهارس جديدة. أدلةSpeed والحقولمنشريحةJobالأصليةسارية؛ المالك يقررالعرضفقط. PHASE03/06 متناسبانبعدCheckناجح، دونوكلاءلتغييرعرضواحد.

النتيجة: Implemented — source-only؛ Owner verification pending yes. نُفذcost minWidth140 وجدولLabour minWidth920 بالقيم المجمدة أعلاه. روجع موضع عمودCost والمدخل formControlName=cost وحدودالجدول؛ الأعمدةالأخرىومعادلةخصم/رسومالعمالةبلا تغيير. دليل /UserGuide/workshop محدث بخانةCost وتمييزهاعنالخصم/الرسوم، دونتعليماتCSS للمستخدم. نجحTSsyntax للملفوالدليل وAngulartemplateparser وdiff --check؛ الحزمحاليةبلا قاعدةمشتركةجديدة أوتوليدلازم. الفحصمصدريلايثبتقياسعرضداخلالمتصفح؛ قبولالمعاينةبقيمكبيرةوعرضضيقوRTL/themeمتبقٍ. لاقراءةإضافيةأوسلوكcache/loading/SQL/index أوmigration، ولاbuild/test/lint/browser/DB/commit/push. رسالةfrontendمقترحةفقط: fix(jobs): widen labour cost input.

### عقد تحميل رقم أمر العمل عند إنشاء المهمة منه — ٢٠٢٦-١٠-٣١

الحالة Frozen؛ Owner verification pending yes. أوضح المالك أن رقمWorkOrder يتحمل معإنشاءJob بعدرسالةاختلافالعميل. السيناريوالمصدريالمعتمد: Create Job منأمرعملمقبول، وهوالمسارالقائم openCreateJob→/Job/create?sourceWorkOrderId؛ لااختيارعشوائيلأمرعملعندإنشاءمستقل ولاعقدترقيمجديد. المصدرالحالييفعلfreshload ويملأworkOrderId/customerId بالفعل، لكنيرسمهمابصورتينقابلتينللتغيير. القرار: عرضرقمأمرالعملمباشرةمنsource.no للقراءةفيالإنشاءالمرتبط، وعرضالعميلالمرتبطعندمايحملالمصدرcustomerIdصالحًا؛ إذاالمصدرلاأسمىعميلًايبقىالاختيارالإلزاميالمعهودمتاحًا. يبقىالنموذج/PayloadمعرفيهماكماهماوخادمValidateWorkOrderAsyncالسلطةالأخيرة. إلغاءGetSelectأوامرالعملفيالمسارالمرتبطلقراءةغيرمستهلكة؛ الإنشاءالمستقلوالتعديللايتغيراختيارهما. استخدامsigma-field__read الحاليمعمعرّفللlabel، واستكمالالحقولباقٍدونصنعأمرعملأوتغييررقم. المصدرنفسهaccepted/failure/Retry/context/destroy وملءPO/Notes/مركبةواحدةوالرجوعللقائمةمحفوظون. UI13/15/16/22/28 وPHASE03/05/06 متناسبون؛ Backend/مالية/حسابات/Mapper/schemaلايتغيرون. دليلSpeedC1803:708 فمايليه يثبتتحميلWorkOrderعندoptions.workOrderIdوإعدادisFromWorkOrder؛ لايثبتقيودالخادم، فتُحفظقاعدةسيجماالموجودة. لاوكلاءلمسارواحدمتداخل.

النتيجة Implemented — source-only؛ Owner verification pending yes. يظهر رقمأمرالعملفيالإنشاءالمرتبطكقيمةقراءةمباشرةمنsource.no عبرsourceWorkOrderNumber، والعميلمنsource.customer/nameوفallback منخياراتنفسcustomerId، بدلإبقاءالقائمتينقابلتينللتغييربعدالتحميل. hasSourceCustomer يقتصرعلىرقمموجب؛ إذاالمصدرلاأسمىعميلًاتظلخانةاختيارهالإلزامية. لاformControl.disabled جديديفقدالقيممنgetRawValue، ولاoverwriteفيSave، وتستمرمعرفاتworkOrderId/customerIdالمحملةبالعقدنفسهإلىPOST Job والتحققالمصدريالحالي. isWorkOrderLinkedCreation يقتصرعلىmodecreate/sourceWorkOrderId؛ الإنشاءالمستقلوالتعديل/Viewكماكانا. أُسقطWorkOrder/GetSelectمنbootstrapالمرتبطفقطلعدموجودselectorمستهلك؛ قراءةتفاصيلالمصدرالطازجةتظلمالكالرقم/العميلودونانتظارقائمةالأوامر. اسم/رقمالمصدرلايتأثرانبردقائمةبطيء، وRetry/acceptance/إلغاءالسياق/DestroyRef/global loaderوالـdirty/Saveguardsباقية.

مراجعةالمرجع: C1803:708–725 يمررoptions.workOrderIdإلىgetWorkOrderForEditويملأcustomer/workOrderRefNo؛ قورنبالمسارالحاليWorkOrder.openCreateJobوloadSourceWorkOrderوValidateWorkOrderAsync. المعتمدتحميلرقم/هويةالمصدرومعرفعميله، واستُبعدتfirst-vehicle/legacyoptionsالتلقائيةوغيرهاالمختلفةعنالعقدمقابلzero/one/manyvehiclesالقائم. لاصلاحيةأوحالةاعتمادجديدةأوتجاوزتحققالخادم؛ هذاحفظربطالمصدرفيعرضالإنشاءوفقالمعنىالأقربللطلب. الحقولالماليةوأرقامJob/WorkOrderلاتُولدأوتتغيرهنا.

الكاش/التحميل/الأداء: بقيCustomer/Vehicle/Item finite+watchمنأصحابهاوpolicydirectوcontext/datafencingكمافيالجردالسابق. مصدرWorkOrder/GetSelectdirectلايُطلبفيالمسارالمرتبط؛ لاcacheopt-in/writer/import/invalidation جديد. WorkOrderdetailقراءةfreshواحدةبالهويةالمستأجريةوخاصيةRetryالحالية، وNo/Customerالمرتبطانمنها؛ بقيةمعلوماتالمصدر/المركبةوقواعدSQLالموثقةسابقًابلا تغيير. لاتغييرpredicate/join/EF/schemaأواستدعاءلكلصفولاindexجديدمبررلعرضقراءةوتجاوزlookupغيرمستهلك. لاAdd-Migrationولازمنتحسنمقاس؛ يُقارنالمالكنفسالأمر/tenant/cache/networkأمامنسختهالسابقةعندالمعاينة.

روجعفرقeditor TS/HTMLوالدليلوالمسار/payload/نوعالمصدر؛ نجحparserللملفينوالقالبوdiff --check. دليل /UserGuide/workshop محدثبإظهارالرقمتلقائيًاوعميلالمصدرواستكمالالمسودةوالعميلالفارغ/Retry. حزمPHASE03/05/06متسقةمنCheckالحالي؛ لاقدرةمشتركةجديدةتحتاجكتابًا/مهارةأوتوليدًا. تحققالمتبقي: Create Jobمنأمرمقبولورقم/اسمطويلين، نفسمعرفيالعميلوالأمرفيالطلب، فشل/Retry، صفرفرد/متعددالمركبات، أمرلاأسمىعميلًا، Save/Cancelللعودةلقائمةالأوامربمرشحاتها، وتغيرالسياقأثناءread/save، والإنشاءالمستقلوEdit/Viewللتحققمنبقاءاختيارها. لاوكلاءلشريحةمرتبطةواحدةولاbuild/test/lint/browser/DB/migration/commit/push. frontendcommitمقترحفقط: fix(jobs): display source work order and customer on linked creation.

### عقد استكمال بيانات أمر العمل المتاحة في مسودة المهمة — ٢٠٢٦-١٠-٣١

| البند | القرار |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| النطاق | متابعة تحميل المركبة ثم طلب المالك مراجعة كل المعلومات الممكن تحميلها منWorkOrder عند إنشاءJob منه؛ تنفيذ المطابقات الواضحة فقط |
| العقود الخلفية | WorkOrderDetailVM/LineDetailVM/VehicleReferenceVM وJobAddVM وVehicleDetailVM الحالية كماهي؛ التدقيق الخلفي read-only، ولا API/DTO/حسابات جديدة |
| المصدر والهوية | نفس fresh WorkOrder GetByWithNavigationsId منsourceWorkOrderId، نجاح/قبول/مصفوفةبنودصحيحة وهويةالمصدر قبلhydration؛ tenant/live كماالمنتج |
| بيانات الرأس | id/no→workOrderId/رقمه، customerId/name→العميل، customerPONo→poNo، notes→notes؛ الحالية محفوظة، الرقم والعميلالمحددبالمصدرقراءةفقط |
| المركبة الواحدة | Id/PlateNo منWorkOrderItems للمركبة المميزة الوحيدة: تعبئةvehicleId تلقائيًا وعرضتسميتهاقراءةفقطمثلعميلالمصدر؛ لااختيارأولسطرعندتعددالهويات |
| المركبات المتعددة/الفارغة | إنوجدت عدةمركبات، اختيارواحدة منخياراتVehicle/GetSelectالحاليةالمتقاطعمعهوياتالأمر، دونإتاحةمرجعمحذوفبناءعلىتسميةتاريخية. إنلمتوجدأيمركبةتظلخانةالاختيارالإلزاميةالعامةالحالية؛ لاطلبلكلمركبة |
| تفاصيل المركبة | DTOداخلالأمرمحدودId/PlateNo فقط؛ منطلبVehicle/GetByWithNavigationsIdالقائم للمختارة: make/model/year/chassis للعرض، kMs→mileage للمسودةالمرتبطةفقطمادامحقلالعدادpristine. لاcastلمرجعأمرالعملإلىVehicleDetailsDTO، ولاكتابةفوقالعدادالمدخليدويًا أوالمحفوظفيEdit |
| الأوصاف | أوصافWorkOrderItemsالمرتبطةبالمركبةالمختارة، ومعهاالبنودالتيبلاVehicleId، تنسخكنصتفاصيلفيالمجموعةالابتدائيةالجديدةفقطإذاكانحقلتفاصيلهاpristineوصفوفأطفالهافارغة. لاجمعأوصافمركباتأخرى، ولااستبدالمسودةيدويةأوصفوفموجودة، ولامعرفاتأطفالWorkOrderفيJob |
| الحقول غيرالمتطابقة | تاريخأمرالعمللايحل محلتاريخإنشاءالمهمة/موعدإكمالها؛ branchلاtargetفيJobAdd؛ status/acceptanceلاينسخان؛ amount/tax/discount/totalsلاتنقلالتزامًابعدموجودتصنيفأصناف/عمالة/متفرقات/خارجي. يظلالنوع/الخدمة/الموظفون/الأصنافوالورشومندوبالمبيعاتوالموعد وفقعقودهاالحالية، ولا افتراضمنالنص |

المراجعالمقروءة: UI13/15/16/19/22/28 وMaster5/7؛ PHASE03/05/06 الحاليةبعدCheckناجح. C1803:707–728 منلقطة2026-10-28 يملأالمركبةوعدادهاوالعميلومرجعالأمرويبدأتاريخالمهمةالآن؛ قورنبأدلةR0552/S113والعقدالحاليودليلworkshop. المعتمدالمحتوىالمتوافق، والمستبعداختيارأولمركبةوإسقاطماليغيرموجود. فحصالخلفيةتأكدأنWorkOrderVehicleReferenceVM يحويId/PlateNoفقط، وأنالمراجعالتاريخيةلا تثبتأهليةاختيارحاليوأنالتحققالخلفيالقائميطابقالعميلدونادعاءقيدجديدعلىالمركبة. rootيملكواجهةJobوالدليل/الدمج، والوكيلjob_open_query_auditبالموديلالموروثدققDTO/Map/Sourceوالخياراتدونتعديلأوتشغيل؛ لاownershipمتداخل. لاschema/migration أوفهرسمقترحلتعبئةحقولمننفسالقراءات.

### مطابقة تحميل بيانات أمر العمل إلى المهمة — ٢٠٢٦-١٠-٣١

| البند | النتيجة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| ملفات التطبيق | محرر Job في TS/HTML، ودليل UserGuide/content/workshop-guide.ts؛ لا تعديل خلفي في هذه الشريحة |
| المراحل | اكتشاف وتجميد ثم PHASE03/05/06 بتناسب؛ لا read-grid/domain-action/financial-write refactor |

تم حصر حقول المنتج الفعلي قبل النقل، وليس الحقول التي قد يحملها الكيان المحمل داخليًا. WorkOrderDetailVM وWorkOrderLineDetailVM يحددان البيانات المتاحة، وWorkOrderVehicleReferenceVM يحصر المركبة في Id/PlateNo؛ WorkOrderProfiler يربط هذا النوع تحديدًا. تفاصيل المركبة الكاملة تأتي من الطلب الحالي Vehicle/GetByWithNavigationsId، ولا يوجد cast أو توسيع وهمي لمرجع المركبة داخل أمر العمل. راجع الجذر هذه DTOs والربط وعقد VehicleDetailVM/JobAddVM، وأكمل الوكيل الخلفي نفسه تدقيقًا مصدرّيًا مستقلاً دون تعديل.

| حقل أمر العمل أو المصدر المرتبط | المقابل النهائي في المهمة | التصنيف |
|---|---|---|
| المعرف والرقم | workOrderId وقيمة رقم المصدر المقروءة مباشرة | مطابق؛ الرقم كما ينتجه WorkOrderDetailVM الحالي، دون توليد رقم جديد |
| العميل ومعرفه واسمه | customerId وتسمية المصدر، مع اختيار مطلوب إذا لم يحدد الأمر عميلًا | مطابق للعقد السابق |
| رقم أمر شراء العميل | poNo | محمل، قابل للاستكمال كما كان |
| ملاحظات الأمر | notes | محملة كما كانت |
| معرف المركبة ولوحتها داخل البنود | vehicleId ولوحة المصدر؛ مركبة مميزة واحدة تُملأ وتُعرض مباشرة | مطابق؛ تكرار المركبة بين البنود لا يصنع تعددًا وهميًا |
| عدة هويات مركبات | اختيار صريح من تقاطع مركبات الأمر وخيارات مصدر المركبات الحالي | مطابق لحد المهمة التي تحمل مركبة واحدة؛ لا اختيار أول سطر أو خلط مركبات |
| عدم وجود مركبة في الأمر | الاختيار العام الإلزامي الحالي | المصدر لا يملك قيمة تُنقل؛ لا اختيار افتراضي مخترع |
| وصف كل بند | نص المجموعة الابتدائية للبنود المطابقة للمركبة المختارة، مع البنود التي لا تحدد مركبة | مطابق نصيًا دون نقل ID البند أو تصنيف مالي؛ نصوص المركبات الأخرى تبقى خارج المهمة الحالية |
| عداد المركبة | mileage من KMs→kMs عبر قراءة تفاصيل المركبة الحالية | محمل في الإنشاء المرتبط فقط عندما يكون الحقل pristine وقيمة العداد رقمًا محدودًا غير سالب؛ قيمة المستخدم وEdit/View التاريخية محفوظتان |
| ماركة/موديل/سنة/شاسيه المركبة | حقول العرض الحالية من make/model/year/chassisNo | محملة بعد اختيار المركبة، دون طلب منفصل لكل حقل أو لكل بند |
| تاريخ أمر العمل | لا يطابق تاريخ إنشاء Job أو موعد إكماله | لا ينقل؛ مرجع C1803 يبدأ Job بتاريخ الآن صراحةً |
| الفرع | لا حقل مقابل في JobAddVM | فجوة عقد قائمة، لا حقل أو علاقة جديدة لهذا التحميل |
| الحالة والقبول | لا تنسخان إلى حالة Job | تحافظ المهمة على إنشائها وحالاتها الحالية؛ شرط قبول المصدر في الواجهة محفوظ |
| مبلغ/ضريبة/إجمالي بند الأمر، خصم الأمر وإجمالياته | لا تطابق مصفوفات أصناف/عمالة/متفرقات/خارجي في Job | لا نقل مالي دون عقد تصنيف/حسابات؛ يظل خادم Job يحسب من تفاصيله |
| مندوب المبيعات، نوع المهمة، الخدمة، الأصناف، الموظفون/أنواعهم، الورش وموعد الإكمال | ليست بيانات موجودة في WorkOrderDetailVM/LineDetailVM | تبقى خيارات/حقول Job الحالية لاستكمالها؛ لا استنتاج من الوصف أو اختلاق معرفات |

تفاصيل التنفيذ: sourceVehicleIds محسوبة من signal المصدر ومصفوفة أرقام محددة النوع، وتستبعد القيم غير الرقمية وغير الموجبة وتزيل التكرار. hasSingleSourceVehicle يعرض اللوحة مباشرة دون قائمة قابلة لتغيير ربط المركبة الوحيدة، مع حارس الهوية الفارغة. selectableVehicleOptions محسوبة من الهويات وخيارات المصدر؛ يعاد ترشيح القائمة عند تغير بياناتها فقط، دون إعادة مسح الأسطول على كل change detection. عند تعدد المركبات لا يحوّل اسم تاريخي إلى أهلية اختيار: الترشيح يستهلك نفس خيارات Vehicle/GetSelect الحالية وdisabled metadata. هذا قيد خيارات واجهة، وليس ادعاء تحقق عضوية خلفي جديد؛ الخادم يحتفظ بوجود المركبة وتطابق عميل أمر العمل وقواعده السابقة.

يحمّل نفس onVehicleChange تفاصيل المركبة المختارة ويلغي القراءة السابقة عبر switchMap وcancelReads وDestroyRef. استجابة التفاصيل لا تُقبل إلا إذا طابقت معرف المركبة الحالي. العداد يُملأ كنص من القيمة الرقمية الحالية دون تقريب محلي أو سياسة دقة جديدة، ولا تُستبدل قيمة dirty. عند تبديل المركبة يُعاد حقل عداد pristine إلى الافتراضي الحالي ريثما يصل المصدر الجديد، بدل إبقاء عداد مركبة سابقة. الفشل يبقى برسالة وRetry والـglobal start/finalize وaria-busy الحاليين، ولا يتجاوز حفظًا أو يكرر كتابة.

تعبئة الأوصاف تقتصر على المجموعة الأولى الجديدة الوحيدة، وحقل detail غير المعدل، ومصفوفات الأطفال الأربع الفارغة. تُحفظ النصوص غير الفارغة بترتيب المصدر ويفصلها سطر جديد، دون هويات أطفال أمر العمل أو مبالغهم. عند اختيار مركبة أخرى لا تتغير أوصاف كتبها المستخدم أو مجموعة ذات أطفال، ولا تُحذف مسودة أو صف. لا تغيير jobType/service/validations؛ النوع المطلوب يظل مطلوبًا لأن الأمر لا يملكه. التحقق من هوية المصدر ومصفوفة workOrderItems صار صريحًا قبل تعبئة النموذج، والرد الناقص/غير المطابق يعرض فشل المصدر مع Retry بدل throw أو مسودة من سجل آخر.

الأداء والتحميل والكاش: لا URL جديد أو N+1؛ قراءة أمر العمل الحالية مرة واحدة، وقراءة تفاصيل للمركبة المختارة فقط كما كانت قبل هذه الشريحة. لا قراءات لكل مركبة في الأمر أو لكل وصف، ولا إلغاء للطلب المالي أو cache له. جرد Customer/Vehicle/Item المعتمد وfinite bootstrap ثم ReferenceLookupBindings/watch، وselected labels/disabled retained choice وwriters/imports/invalidation/topic/TTL/context clearing، كما في مطابقة Job السابقة. مصدر أمر العمل والـvehicle detail قراءتان تشغيليتان مباشرتان، بلا opt-in أو watch جديد؛ يبقى إلغاء WorkOrder/GetSelect غير المستهلك في الإنشاء المرتبط. لا predicate/join/schema أو index جديد مبرر لتعبئة حقول من نفس البيانات. يبقى مسار WorkOrder detail العام المتشعب وVehicle detail العام فرصة قياس مستقلة؛ لم تُدعَ سرعة مقاسة أو يتغير عقدهما الواسع أو تتوازى EF queries على DbContext واحد.

المراجع والمطابقة: C1803 من لقطة٢٠٢٦-١٠-٢٨، الأسطر٧٠٧–٧٢٨، يثبت إعلان تحميل المصدر ومركبته وعدادها والعميل والمرجع وتاريخ جديد. طُبق هدف المحتوى الموافق واحتُفظ بعقد سيجما للمركبات المتعددة، واستُبعد اختيار أول مركبة والمالية غير المعلنة. دليل الشرح S113 لا يقدم DTO تفصيليًا آخر؛ لا screenshot أو استدعاء خارجي أو حقيقة خادم مستنتجة من Speed. UI13/15/16/19/22/28 وMaster5/7 مالكو العرض والقراءات وحفظ المسودة. الحزم الحالية نجح Check لها؛ لا قدرة مشتركة جديدة أو قاعدة تتطلب تعديل كتاب/مهارة أو توليد حزم.

نجح فحص صياغة TS للمحرر والدليل وقالب Angular وdiff --check، وروجعت مواضع النقل والهوية وDOM/labels وpayload مقابل المصدر. لا backend change أو Mapper/namespace جديد أو Add-Migration. دليل /UserGuide/workshop محدث بالعربية والإنجليزية للبيانات المنقولة، مركبة واحدة/عدة/فارغة، العداد القابل للتعديل، وشروط عدم استبدال نص المستخدم. توزيع العمل: root يملك الملفات الثلاثة والدليل والمراجعة والدمج؛ job_open_query_audit بالموديل الموروث دقق حقول الخلفية والمرجع وحماية التاريخ دون تحرير، لتقليل زمن التتبع دون تعارض ملفات. لا build/test/lint/browser/DB/migration/commit/push/deploy.

قبول المالك التشغيلي المتبقي: أمر بمركبة واحدة، عدة بنود لنفس المركبة، عدة مركبات، بلا مركبة؛ الأوصاف المشتركة/المختارة دون وصف مركبة أخرى؛ قيمة عداد صفر/موجود/غير متاحة وتعديل المستخدم أثناء رد بطيء وRetry؛ إضافة صف أو مجموعة ثم تبديل المركبة دون فقد النص أو الأطفال؛ رد مصدر ناقص أو معرف خاطئ؛ Edit/View والإنشاء المستقل لا تُستبدل بياناتها؛ حفظ يرسل نفس معرفات المصدر وقيم المجموعة الجديدة دون IDs من بنود الأمر؛ إغلاق/سياق أثناء read/save وRTL/theme والعرض الضيق. قياس cold/warm قبل/بعد على نفس الأمر وحجم الخيارات وبيئةAPI/الشبكة مع first usable/settled data وHTTP/SQL عند إتاحتها؛ لا أرقام مدة أو تحسن مصطنعة. رسالة frontend مقترحة فقط: feat(jobs): hydrate compatible work order and vehicle draft fields.

### عقد استكمال تحميل أمر العمل المختار داخل إنشاء المهمة — ٢٠٢٦-١٠-٣١

الحالة Frozen؛ Owner verification pending yes. بعد بلاغ المالك استمرار غياب تفاصيل أمر العمل، كشف التتبع أن hydration لا يبدأ إلا منsourceWorkOrderId فيالمسار؛ p-selectداخلJob/createلايحملonChangeللمصدر. نطاق الإصلاح هو المسار الناقص داخل الإنشاء، مع استمرار الإنشاء من قائمة أوامر العمل. لا ادعاء إعادة إنتاج الشاشة تشغيليًا أو تغيير شاشةView WorkOrder غير المذكورة فيسياقإنشاءJob.

المجمد: هوية مصدر نشطة فيsignal مستقلة عن هوية مسار الرجوع الأصلية. اختيار WorkOrder داخلCreate يقرأ تفاصيلهالطازجة بنفسgetterوالقبول والتحقق والـglobal lease؛ يعبئالرقم/العميل/PO/Notes/المركبةوالأوصافوالعدادوفقالعقدالسابق. اختيارالمصدرمنداخلCreateيبقىقائمةحتىيمكنتغييرهأومسحه؛ الإنشاءالقادممنمسارWorkOrderيبقىرقمهثابتًا. fail/RetryأوالردالناقصيمنعSaveبالحارسحتىتطابقتفاصيلالمصدرالمختار؛ القائمةاليدويةتعادإتاحتهابعدالفشللاختيارأمرآخرأومسحالرابط. مسحالرابطاليدوييحفظقيمالمسودةولايمسحصفوفًا/نصوصًا؛ يرجعلاختياراتالإنشاءالمستقل. قيمPO/Notes/العدادوالأوصافالمعدلةلايسمحالتحميلباستبدالها، ولاتُعادform.pristineلعمليةاختيارقامبهاالمستخدم. هوياتالمصدر/المركبةوالـlabelsهيالمقابلالمقصودلاختيارالأمر، والكتابةالخلفيةوقواعدالحساباتكماهي.

يحفظالمسارidالتنقلالأصليومرشحاتالرجوع؛ مراقبةcache/مصادرهاكماهي، ولاcacheأوAPIجديد. مصدرمتعددالمركباتيحفظقائمةالاختيار، والمركبةالوحيدةقراءةفقط. سياقجديديلغيreadsولايعيدكتابةSave، وswitchMapالمركبةيلغيقراءةالمركبةالسابقةعندبدءمصدرجديد. UI13/16/22/28ومالكوهاالحاليون، وPHASE03/05/06بعدCheckناجح. أدلةC1803/R0552وحصرDTOالمقروءانفيالشريحةالسابقةساريان؛ الطلبالعلاجييؤكدمسارالمستهلكالناقصدونتوسيعالقواعدالماليةأواختيارأولمركبة. لاوكلاءلمسارواحديتداخلTS/HTMLوالدليل، ولامخططأوفهرسلتغييرحدثاختيار.

### عقد تحصين قارئ بنود عرض أمر العمل — ٢٠٢٦-١٠-٣١

الحالة Frozen؛ Owner verification pending yes. أكد المالك أن Items لا تظهر حتى عند View من قائمة WorkOrder. تتبع frontend والخلفية مستقلاً لم يثبت إسقاطًا في API/Mapper أو سبب الرد الفعلي؛ لا يجوز ادعاء إعادة الإنتاج أو تعديل البيانات/الخادم افتراضًا. القرار التنفيذي المحافظ لمعالجة مسار العرض المبلغ عنه: View يقرأ details.workOrderItems مباشرة داخل DataTable المشترك، بدل الاعتماد على FormArray ثم projected editable row template للقراءة. Create/Edit يبقيان EditableCollectionTable/FormArray/EditableRows دون إعادة كتابة الحفظ. تظل tabs/count/فتح البنود/ملءالنموذج/التحقق منarray والـRetry كماهي. لا aliases أو fallbackبنود مصطنعة ولا تغير حقول أو مبالغ.

أعمدة جدول View المجمدة: description، vehicle.plateNo (نفسfallbackالمرئيالحالي)، amount، tax، amountPlusTax؛ أنواعmoney الثلاثة من البياناتالسلطوية نفسها، بعروض300/230/140/140/140px، بلاactions أوpaging/lazy/filter/sortتغير ترتيب أو نطاق المستند. DataTable UI6/15 مالكقارئالصفوف، وFormSection/UI1/13 مالكfill/scroll/print؛ [scrollable]=true/scrollHeightflex بمالك واحد، والطباعةتحررالحدودالمشتركةوتعرضكلالبنود. UI14 يبقىمالكاستخدامCreate/Edit. هذهإعادةربطعرضبالردوتحصينمحددبسبببلاغالمالك، لاإثباتسببقالبأوقاعدةبيانات.

الملكية: workshop_vehicle_frontend يملكWorkOrder/details TS/HTML/SCSSفقطبعدهذاالتجميد، ولايعدلدليلًا/Job/Shared/Backend؛ root يملكJobالمتوازيودليلworkshopوالتقاريروالدمج. الخلفيةقرأهاjob_open_query_auditفقط: GetByWithNavigationsId→DetailWithNavigationsAsync→GetByIdDeepAsync يحملworkOrderItemsالحيةويحافظعلى tenant؛ FKوالـMapوالـsave reconciliationمتطابقةمصدرّيًا. لاAPI/query/cache/index/schemaمطلوبلتبديلقارئالعرض، والردالفعليةعدده/محتواهوعرضهالتشغيليباقيانتحققالمالك. أدلةR0550/C1822/C1823 وUI6/13/14/15/21/22/28 وPHASE03/05/06 بتناسببعدCheck، لاworkflowماليأومحاسبيجديد.

نتيجة ربط اختيار الأمر داخل إنشاء المهمة: Implemented — source-only؛ Owner verification pending yes. أضيف onWorkOrderChange إلىالقائمةالحقيقية فيJob/create، وكانت بلا حدث يقرأالمصدر. selectedWorkOrderId signal يفصلالمصدرالنشطعنsourceWorkOrderIdالخاصبالتنقل/الرجوع. كلاالمسارين يستخدمloadSourceWorkOrderنفسهوتحققهويةالردومصفوفتهوقبولالأمر؛ المصدرالنشطيدخلحارسcanMutate، فلاSaveقبلتحميلتفاصيلالهويةالمختارة. قادمWorkOrderيبقىرقمهقراءةفقط، بينماالمختارمنداخلCreateيبقىقائمةقابلةللتغيير/المسح، وتنتقلقيودعميلالمصدرومركبةواحدة/اختيارعدةلكليهما.

القراءةتلتقطidوتفحصالهويةفيالنجاحوالخطأ، وتلغيقراءةالمركبةالسابقةعندبدءمصدرجديد، وتحتفظبglobal start/finalize وcancelReads/DestroyRef. الفشليعرضRetryويبقيSaveمحروسًا؛ مسارالاختياراليدوييعيدتمكينالنموذجبعدfinalizeحتىيمكنتغييرالأمرأومسحه، بينمافشلالمصدرالقادممنالمساريبقىإصلاحهRetryأوالخروجكماكان. مسحالرابطاليدويلايمسحعميلًا/مركبة/صفوفًا/نصًا، ويعيدتفاصيلالمركبةالمحتفظبهافقطإذاكانتغيرمحملةولاقراءةنشطة. guardيمنعتغييرهويةأثناءSave/read/confirmationويرجعقيمةالاختيارالسابقةإنوصلحدثمتأخر. عندتغيرالسياقتُصفّرهويةالمصدرالنشطة، والكتابةالمرسلةلاتُلغىولاتتكرر.

التحميلاليدوييحفظdirtystate: تغييرالاختياريميزحقلهمعدلًا، وloadSourceWorkOrderلايعيدpristineإلاافتتاحًاابتدائيًابلامسودةيدوية. PO/Notesتُملآنفقطعندمايكونحقلهماغيرمعدل، والعدادوالأوصافبشروطالحمايةالموثقةسابقًا؛ العميل/المركبةمراجعالمصدرالمقصودلاختيارالأمر. لايحذفالمسارمجموعةأوطفلًاأويتغيرعقدAdd/Update/حساباتالخادم. Edit/Viewيحافظانعلىعقدهما؛ حدثالتحميلالإضافيمقصورعلىCreate.

التحققالمصدري: روجعتوصيلp-select→handler→هويةنشطة→getterالحالي→patch→المركبةوالأوصاف→Savepayload وcloseالذييستخدمهويةالمسارالأصليةفقط. نجحTSsyntaxوالقالبودليلworkshopوdiff --check؛ دليل/UserGuide/workshopيوضحالاختيارمنالداخلومعالجةالفشلومسحالربطوحفظالمدخلات. لاURLs/DTOs/Mapper/schemaجديدةولاشروطquery/indexتتغير، والجردالسابقلكاشCustomer/Vehicle/Item/watches/writers/tenant/lookupglobalstatusكماهو. هناكقراءةتفاصيلواحدةعنداختيارصريحلأمر، وقراءةالمركبةالمختارةالقائمة؛ لاقراءةلكلبندأومركبةولافهرس/migrationمبرر. لاعدداولسرعةمقاسانولاادعاءعرضردمتصفح. الحزمحاليةبعدCheck، ولاكتاب/مهارةأومولدلازمإذلاقدرةمشتركةجديدة.

قبولالتشغيلالمتبقي: فتحCreateمنJobsواختيارأمرمقبول، عميل/PO/Notesومركبةواحدة/عدة/بلامركبةوالعدادوالأوصاف؛ فشل/Retry/اختيارآخر/مسح؛ كتابةNotes/PO/Mileage/Detailوصفوفقبلتغييرالأمرللتأكدمنحفظالمسودة؛ تكرارالنقرأوالسياقأثناءload/save؛ الخروجمعdirtyوالرجوعإلىWorkOrderبالمرشحاتعندالدخولمنه. لاتشغيلbuild/test/lint/browser/DB/migration/commit/push، ولاوكلاءلهذاالمسارالمتداخل؛ الوكيلانالمعاداستخدامهمادققامشكلةعرضبنودWorkOrderالموازيةفيملفاتمنفصلة. رسالةfrontendمقترحةفقط: fix(jobs): hydrate work order selected inside create form.

### مطابقة قارئ بنود عرض أمر العمل — ٢٠٢٦-١٠-٣١

| البند | النتيجة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| النطاق | تحصين عرض Items من قائمة WorkOrder، بالتوازي مع إصلاح اختيار المصدر داخل Create Job |

أصبح وضع View يربط جدول القراءة مباشرة بمصفوفة workOrderItems في تفاصيل الرد الناجح، بخمسة أعمدة: description، vehicleId مع تسمية plateNo/name، amount، tax، amountPlusTax. حقول DTO المناظرة هي المجموعة نفسها، مع id مفتاح الصف؛ بقيت بقية DTO للهوية/الرأس/الإجماليات كما كانت. الأعمدة بعروض300/230/140/140/140، والوصف يستخدم cellClass المشترك sigma-data-table__cell--wrap؛ DataTableColumn لا يملك wrap:true ولذلك لم تُضف خاصية وهمية. المال يمر type money بالمالك المشترك نفسه، دون preview أو استنتاج ضريبة جديدة. لا filter/sort/actions/paging/lazy تغير ترتيب المستند أو نطاقه. جدول Create/Edit وEditableRows/FormArray والحفظ بقيت كما كانت، ولم تُعد كتابة منطق البنود أو إجمالياتها.

الجدول يُركب عند تفاصيل ناجحة فقط؛ لا يُعرض رد فاشل كمصفوفة فارغة، والعدّاد في View يُقرأ من مصفوفة التفاصيل نفسها بدل FormArray قديم قد يبقى بعد فشل Retry. count في Create/Edit يظل من المصفوفة القابلة للتحرير. تبويب Items يُفتح عند وجود بنود محفوظة، وتُحفظ رسالة empty لرد ناجح فارغ فقط، وmissing-array/false-envelope/HTTP failure تظهر فشل القراءة وRetry. لا row alias أو صف مصطنع أو تضييق لصفوف الخادم. هذا ربط قراءة مباشر لمعالجة البلاغ وتحصين نقطة العرض؛ لا ادعاء بأن سبب التشغيل الأصلي أُعيد إنتاجه أو أن رد الخادم الفعلي احتوى صفوفًا.

هندسة العرض والطباعة: FormSection fill وwork-order-lines flex1/min0 يظلان مالكي اللوحة في سلسلة الصفحة/Form، وDataTable fill/scrollable للقراءة داخلها، بدون SCSS/غلاف جديد أو ارتفاع viewport محلي. عند printing تعطل fill/scrollable ويتفعل printAllRows في DataTable، مع sigma-print-flow القائم؛ تُركب لوحة البنود والرأس كلاهما ويعرض مسار الطباعة جميع الصفوف. formatter money يتطابق مع MoneyPipe السابق. title/tabs/summary/footer ثابتة خارج تموضع الصفوف، وView لا يعتمد على row template لتكوين البيانات.

التحميل: أُزيل StateMessage loading المكرر فوق المحرر مع إزالة import غير المستخدم، وتظل قراءة التفاصيل global start/finalize في LoadingService الحالي، وWorkOrder route لا يعطل shell loader. form aria-busy يحتفظ بعلم قراءة/حفظ، وDataTable [loading] مع showLoadingIndicator=false يحتفظ بالانشغال دون mask آخر. الأخطاء وRetry وحراس التبويبات/الحفظ/الخروج والطباعة كما كانت. في View لا توجد bootstrap lookups: بيانات العميل/الفرع/المركبة من DTO؛ detail direct operational بلا source cache opt-in أو watch/writer/invalidation جديد. مصادر Create/Edit الحالية خارج تغيير القارئ، ولا تُدّعى مطابقة كاش تلك المسارات بالكامل بهذا الإصلاح.

التتبع الخلفي المستقل لم يجد إسقاطًا مصدرّيًا مثبتًا للبنود: SiGmaControllerBase.GetByWithNavigationsId→Service.DetailWithNavigationsAsync→Repository.GetByIdDeepAsync، بسياق قراءة مستقل tenant/live للجذر. فرع collection يحمّل IsDeleted!=true حتى لو منع recursion إلى inverse؛ لا يصح نسب الغياب إلى منع الدوران. WorkOrderDetailVM.WorkOrderItems وWorkOrderItem→WorkOrderLineDetailVM موجودان؛ Ignore للمجموعة في Update→Entity فقط. علاقة WorkOrderId المطلوبة وفهرسها في الإعداد/لقطة النموذج، والحفظ يلزم بنودًا ويجري OwnsAll/RemoveDropped/ReconcileOwned ثم save. لا تغيير خلفي أو mapping/schema/index أو migration مبرر لبلاغ العرض دون إثبات رد/بيانات التشغيل. يبقى generic deep read ملاحظة أداء منفصلة؛ لم يُستبدل افتراضًا ولا شُغل SQL أو قياس.

المطابقة المرجعية: R0550/C1822/C1823 من لقطة٢٠٢٦-١٠-٢٨ تدعم مستند أمر العمل وبنوده وفتح Job من المصدر؛ دليل الدورة والشرح السابقان مرجع محتوى، وليس أيقونات/تصميمًا أو صلاحيات مثبتة. UI6/13/14/15/21/22/28 والمالكون الفعليون DataTable/FormSection/EditorTabs/ReportPrintService جرى تطبيق عقودهم الحالية، بلا قدرة مشتركة جديدة أو كتاب/مهارة/packet template جديد. الحزم الحالية متسقة بعد Check؛ لا edit-generated يدوي.

الملفات: WorkOrder details TS/HTML فقط من الوكيل الأمامي، ودليل /UserGuide/workshop من الجذر مع وصف أعمدة البنود والطباعة. روجع الفرق الكامل في المستودع الأمامي مع الحفاظ على التبويبات والتغييرات السابقة؛ الجذر أضاف حارس نجاح القراءة لجدول View وعدّاده من الرد. نجح TS parser لملفات WorkOrder/Job/الدليل وقالباهما وdiff --check. الوكيل workshop_vehicle_frontend بالموديل الموروث دقق ونفذ النطاق المعزول بعد التجميد، والوكيل job_open_query_audit دقق الخلفية read-only؛ root يملك Job والدليل والعقود والدمج والمراجعة النهائية. هذا فصل متوازي بلا تعارض قلل زمن تتبع المسارين. لا build/test/lint/browser/DB/migration/commit/push/deploy ولا Add-Migration.

قبول المالك المتبقي: View من WorkOrder لقيد له بنود محفوظة مع مطابقة count والرد للجدول والحقول الخمسة، سجل فارغ حقيقي، ورد ناقص/فاشل وRetry دون false empty/count قديم؛ تبديل التفاصيل/البنود والفتح الأول، Create/Edit/Add/Remove والحسابات كما كانت، وطباعة من كلا التبويبين لكل الصفوف/الرأس، والارتفاع الضيق وRTL/themes. عند إتاحة التشغيل تُسجل حالة الشبكة الفعلية وعدد workOrderItems مع زمن الاستجابة/الرسم بنفس tenant/المستند/حجم بيانات بارد ودافئ؛ لا زمن مقاس في هذه المهمة. إن عاد الرد فارغًا بالفعل، فلا يصح اختلاق البنود من totals أو نسبه إلى العرض دون فحص البيانات المأذون. رسالة frontend مقترحة فقط: fix(work-orders): render view items directly from detail response.

### عقد توحيد تصميم إنشاء تقدير العمل مع إنشاء المهمة — ٢٠٢٦-١٠-٣١

| البند | القرار |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| النطاق | طلب المالك جعلCreate Job Estimation مثل التصميم الحالي لـCreate Job؛ نفس shared three-pane routed editor، لا نقل عقود إنشاءJob أوحقولهغيرالموجودة |
| تفاصيل المجموعة | EditorTabs workspace المضغوط الحالي دونscroll أفقي، أربعةتبويباتلحقولالتقديرالحقيقية: التفاصيل/الأصناف/العمالة/المتفرقات؛ لا إضافةExternalWork غيرموجودفيJobEstimationAdd/Details |
| الإجماليات | الخمسقيمالحاليةslim/row/columns5/verticalPadding4/maxHeight80، أسفلعرضالأعمدةالثلاثةمعmx2/mb2كماJob؛ لااختلاقسادسقيمةأوإجمالي |
| الأعمدة والحقول | الحقولالرئيسيةوقائمةالمجموعاتكماهي، تقليلمسافاتبنيةالتفاصيلللقيمالمشابهةفيJob، labourCost140بدل105وعرضالجدول+35لإبقاءباقيالأعمدة؛ لا حقولأوملاحظاتأوPO/sourceOrderجديدة |
| العمر والتحقق والطباعة | form/arraysالأبثابتة، تركيبالمجموعةواللوحةالمختارتينفقطإلافترةprintSession.printingحيثتركبكلالمجموعاتواللوحاتلإخراجالمستندالحاليالكامل؛ فتحلوحةالحقلغيرالصالحقبلfocus؛ حفظحراسSave/confirm/approval |
| gates | نفسAPI/DTO/Mapper/حساباتوضريبةوموافقاتوطباعةالمراجع الحالية؛ توصيلReferenceLookupStatus للـrouted bootstrap وصفاتwatchالمصادرالمعتمدةفعلًا، وحمايةالسياق/reads/كتابةمرسلة، دونopt-in جديدأوcache للسياسة |

المسار/المصدر: pages/routing→JobEstimation_Routes/create/edit/view→JobEstimationEditorComponent، وهوالشكلUI02بحسبUI13D4-2؛مرجعالهندسةJobEditorوثلاثةpaneفيstyles.scss، أماالصفوفEditableCollectionTable/EditableRows، والتبويباتEditorTabs، والأرقامSummaryCardsمنمالكيهاالمشتركينالحقيقيين. الأطوال/حشوالمكونالعامكماوثقUI13، والإجمالياتpublicAPIمنUI24، ونمطالإخراجReportPrintSessionمنUI21. PHASE03/05/06بتناسببعدCheckللثماني؛ لاكتابةBackendأوgrid/domain-action. جردالطلبينالتشغيليينdetail/vehicleوالـlookupستةمنمصادرهاالحقيقيةيُطابقUI2/22/28؛ لا تغييرصلاحياتأوفرضقواعدمالية.

المراجعالمقروءة: speed-analysis entryوالدليلS113/دورةالورشةوالصفحة14-workshop/03-job-estimations(R0551/C1792)منلقطة2026-10-28ومتحكمالإنشاءالمحفوظ؛ مجموعات/رسومالتقديرمرجعوظيفي، لاAPIأوصلاحيةأوتصميممعتمد. حقولسيجماالإضافية/الناقصةمقابلالمرجعتبقىبسجلالميزة، ولانقلأعمالخارجيةماليمجردأنهافيJobمعطلبتنسيق. العرضالمطبوعالحالييمتلكprintAfterLoad/ReportPrintSession؛ signalالطباعةيُستخدمللحفاظعلىكلالمجموعاتلااللوحةالمختارةوحدها. المصدرالحاليبلاdirtydiffللتقدير، وبقيةتغييراتالمستخدمباقية. rootيملكواجهةالتقديرودليلهاوالدمج، والتدقيقالخلفيالمحدودread-onlyيمكنفصلهبعدهذاالتجميددونتداخل.

### عقد فصل حالة تقدير العمل عن الرقم — ٢٠٢٦-١٠-٣١

الحالة Frozen؛ Owner verification pending yes. طلب المالك عمود حالة مستقلًا عن الرقم فيJob Estimations. المصدرالمثبت: estimateNumberTemplate يجمعnoمعشارةapprovalStatus، بينماstatus(open/closed)لهعمودمستقلبالفعل. القرار: no نصيرقمي فقط، وعمودapprovalStatus بعده باستخدامtype=statusوالشارةالمشتركةومفتاحالعنوانالقائمjobEstimation.filters.approvalStatus. قيمApproved0/NotApproved1/Rejected2وترجماتهاوألوانهاالحاليةمحفوظة، وعمودstatusالحاليتبقىدلالتهالمنفصلة. لاDataModel/DTO/SQL/payload/موافقات جديدة. عمودapprovalالجديدلايفرضsort/filterخادمجديدًا؛ التحليلالمصدرىأكدأنsort switchلايقبلapprovalStatus، فتكونsortablefalse/filterablefalseوتستمرتصفيةالاعتمادالموجودةفيfilterFormبمفتاحهاالحالي. Numberفرزهوفلترهالحاليانلايتغيران، وdataTableExportRowsيستفيدمنالوصفينالمنفصلين. إزالةقالبالرقموViewChild/import/helperاليتيمفقطبعدتتبعالاستخدامات، دونتغييرالأكشناتأوالتقريرالمستقل.

UI5/6/7/8/23وPHASE02/06بعدCheckالحالي؛ Backend/API/listVMمجمدانعلىحقولهماالحالية(no/approvalStatus/statusكلهاحاضرة). أدلةR0551/C1793والقائمةالحاليةوالدليل، والتصحيحتصريحعرضمنالمالكدونقاعدةخادمجديدة. agentworkshop_vehicle_frontendيملكEstimation/list TS/HTMLفقطبعداكتمالHTML/SCSSالمحرر؛ rootيمتلكEditorTSوالدليلوالتقاريروالدمج، ولا تداخلملفات. لاbackend/schemaأوindexمقترحلعمودعرض، ولاحاجةلإضافةترجمةمكررة.

تعديل نطاق مخرجات عمود الحالة قبل التسليم: الحالةFrozen. تقريرقائمةالتقديراتالمستقلينتجJobEstimationListRow نفسهويملكcolumnsمستقلةللطباعة/Excel؛ تُضافapprovalStatusبعدnoبعارضالحالةالمشتركوالقيم/الترجماتنفسهالكييظهرالعمودالمنفصلفيالمخرجاتكذلك. لا تغييرقراءاتfetchAllPages/الفلاتر/count/totalsأوصيغأعمال، ولاfilter/sort جديدللعمود. rootيملكإضافةوصفالعمودفيreport.tsإلىجانبالتوثيق؛ وكيلالقائمةلايلمسالتقرير. دلالةstatusالموجودة(Open/Closed)باقيةمستقلةعندالتصديروالطباعة.

### عقد توسيع بحث أنشطة العمالة ودمج صف الأزرار — ٢٠٢٦-١٠-٣١

الحالة Frozen؛ Owner verification pending yes. طلب المالك تكبير مربع بحثLabour Activities ووضع البحث والأزرار فيصفواحد. المسارالفعليpages/routing:835→LabourActivities_Routes→LabourActivitiesComponent؛ form[appFilterPanel]حاليًايستعملmainColumns6الافتراضيةلحقلبحثواحد، ولايفعلinlineActions، بينماResetمملوكالمكونوSearchفيappFilterActions. القرارالمتناسِبSهو[mainColumns]=1/[inlineActions]=trueفقطبالواجهةالعامةالقائمة. بذلكيأخذالبحثالمساحةالمتبقيةبجوارReset/Searchفيالشريطالمشترك، دونعرضثابتأوتحريكCreateخارجFeatureTitleأوتغييرevent/منطقبحثأوألوان/CSSمخصص. UI4/3/6ومالكوFilterPanel/PrimaryActionButtonالحقيقيون، وPHASE02/06بعدCheckناجح؛ مصدرC1818/R0555يدعمالبحثفقطولايفرضالتنسيق. لاAPI/كاش/query/schemaأوفهرسمختلفمنضبطعرضالأعمدة.

### عقد توسيع بحث تصنيفات الأعمال ودمج صف الأزرار — ٢٠٢٦-١٠-٣١

الحالة Frozen؛ Owner verification pending yes. طلب المالك تطبيق مربع بحث واسع وفي صف الأزرار علىJob Category. نفسالنمطالمثبتفيLabourActivities: حقلبحثواحدداخلFilterPanelبـmainColumns6الافتراضيةوinlineActionsغيرمفعلة؛ [mainColumns]=1/[inlineActions]=trueهماالقدرةالعامةالقائمة، دونCSSأوعرضثابتأوتغييرtoolbar/Reset/Searchhandlers. المسارJobCategory_RoutesالقائميصلJobCategoriesComponent؛ المصدرGET JobCategoryبمرشحيgrid/searchوpagingكماهو. أدلةR0554/C1790ودليلS113والشرحالمحليوتصنيفnormal-entityقائمةومحررمودال، UI3/4/6وPHASE02/06بتناسببعدCheckالحالي. لا backend/query/index/DTO/sourceCache أوصلاحياتجديدة؛ كلتاشريحتيالبحثصغيرتانتتنفذانفيالجذرلأنتفويضهمايضيفكلفةأعلىمنوقتتعديلمدخلين.
### مصالحة تصميم تقدير العمل وبحث القوائم — ٢٠٢٦-١٠-٣١

الحالة: نُفذ النطاق المجمد وروجع فرق المصدر؛ التحقق التشغيلي عند المالك. تشمل هذه الشريحة الطلبات الأربعة: مطابقة تصميم محرر تقدير العمل مع المهمة، فصل حالة الاعتماد عن الرقم، وتوسيع البحث مع الأزرار في صف واحد لأنشطة العمالة وتصنيفات الأعمال.

| الجزء | التنفيذ النهائي ودليل المصدر |
|---|---|
| محرر التقدير | بقي الشكل ذو الأعمدة الثلاثة؛ تفاصيل المجموعة في EditorTabs بأربع لوحات: معلومات، أصناف، عمالة، متفرقات. تظهر المجموعة واللوحة المختارتان فقط، وتظل FormArrays والمسودة كاملة. تُفتح لوحة الخطأ قبل التركيز عند التحقق. التنقل بين المجموعات متاح في العرض أيضًا. |
| الإجماليات | خمس بطاقات موجودة أسفل النموذج في صف مصغر عبر SummaryCards؛ لم تُنقل حقول أو أعمال خارجية غير موجودة في عقد التقدير. اتسع حقل تكلفة العمالة. |
| الطباعة | إشارة ReportPrintSession تركب جميع المجموعات واللوحات قبل الطباعة الحالية، مع إخفاء شريط التبويبات ورفع قيود العرض والطول في نمط الطباعة. المعاينة الفعلية لكل المجموعات ما زالت معلقة. |
| القائمة والمخرجات | الرقم نص مستقل، يليه عمود حالة الاعتماد بالعارض المشترك. حالة الفتح والإغلاق تبقى عمودًا آخر. الطباعة والتصدير في التقرير المستقل يحملان العمود نفسه. لا فرز أو فلتر عمود جديد غير مدعوم بالخادم؛ فلتر الاعتماد القائم محفوظ. |
| بحث القائمتين | استُخدمت واجهة FilterPanel القائمة: mainColumns=1 وinlineActions=true. يأخذ الحقل المساحة المتبقية بجوار البحث وإعادة الضبط. لا CSS محلي أو عرض ثابت أو تغيير في الأحداث والعنوان وأزرار الإنشاء. |

مطابقة العقد: أعمدة قائمة التقدير تستهلك حقول ListVM الموجودة: no، approvalStatus، vehicle، customer، customerCode، createdBy، totalCharges، dateAndTime، status، insuranceCompany؛ وتبقى id وhasJob لخدمات الإجراءات القائمة. لا تعديل API أو DTO أو Mapper أو حسابات وضريبة وموافقات أو تحويل إلى مهمة. تمت مراجعة الفروق المحددة للمحرر والقائمة والتقرير والبحث والدليل، مع حفظ تغييرات المستخدم الأخرى.

مطابقة التحميل والكاش: ستة مصادر bootstrap منتهية للتقدير، ثم watch منفصل للمصادر الثلاثة المعتمدة فعلًا. الجدول التالي يسجل التبني الفعلي، وليس أسماء imports فقط:

| المصدر والمالك | التصنيف النهائي والحماية |
|---|---|
| Customer/GetSelect عبر CustomerService؛ Vehicle/GetSelect عبر VehicleService؛ Item/GetSelect عبر ItemService | cacheSelect=true في مصادرها، والقراءة والمراقبة عبر BaseService وReferenceLookupCacheService. الربط بعد النجاح عبر ReferenceLookupBindings، مع الاحتفاظ بتسمية الاختيار الحالي وتعطيل الخيار المحتفظ به إذا غاب من المصدر؛ لا تبديل قيمة المسودة. |
| إبطال المصادر السابقة | كُتّاب BaseService الناجحون يستعملون invalidateSelectOnSuccess وinvalidateSelectSource، وrefreshSelectList للإعادة. قنوات المالك المشترك lookup-customers وlookup-vehicles وlookup-items والتبليغ عن تغيير السياق باقية؛ تغطية الكُتّاب والاستيراد المشتركة كما في جرد هذه الميزة السابق، ولم يُضف كاتب جديد. |
| WorkshopActivity/GetSelect وStaff/GetSelect | قراءة مباشرة من المصدر الحالي دون cacheSelect opt-in؛ لا تخزين محلي أو مراقبة وهمية. |
| JobEstimation/options | سياسة ضريبة مباشرة حديثة من ITaxPolicy؛ مستبعدة من تخزين المراجع. |
| JobEstimation detail وVehicle/GetByWithNavigationsId | قراءات تشغيلية مباشرة. التفاصيل عبر global start/finalize، والمركبة عبر switchMap وstart/finalize مع تحقق الهوية وإظهار الخطأ وإعادة المحاولة. |

تملك ReferenceLookupStatus التحميل المطلوب الأولي على مستوى الصفحة، دون مؤشر inline ثانٍ لقراءة التفاصيل. aria-busy وحراس التحرير والخطأ والإعادة محفوظة. تلغى القراءات والمراقبة عند تبدل السياق أو تدمير المكون، وتُخفى بيانات السياق السابق ويُعطل النموذج؛ الكتابة المرسلة لا تدخل cancelReads ولا يعاد تمكين نموذج السياق المنتهي. تبقى مراقبة تحديث الكاش المحتفظ بالبيانات صامتة وفق المالك المشترك. مطابقة المصدر مثبتة؛ رؤية اللودر والشبكة والإلغاء الفعلي تحتاج تشغيلًا عند المالك.

الأداء والفهارس: لم تزد طلبات bootstrap الستة ولم تُضف قراءة لكل صف. خُفض تركيب جداول تفاصيل المجموعات إلى اللوحة الحالية، مع تركيب الكل للطباعة فقط؛ هذا تحسين مصدر لا قياس سرعة. الإسقاط الخلفي المحدود لتفاصيل التقدير يتضمن ثلاث مجموعات أطفال، وقد تتطلب تعددية Includes قياس SQL لتقييم تضاعف الصفوف. خيارات المركبة والصنف والنشاط وبعض تفاصيل المركبة العامة باقية على مصادرها، دون إعادة تصميم API في طلب التنسيق. قوائم أنشطة العمالة والتصنيفات تبقى tenant/live وName.Contains مع Count والترتيب بالاسم ثم الهوية والإسقاط وSkip/Take. تغطي الفهارس القائمة هوية التقدير وعلاقاته وهوية الاشتراك/الرقم ومفاتيح المجموعات والأطفال؛ لا predicate أو join أو ترتيب جديد يبرر فهرسًا لهذه الشريحة، ولا تغيير مخطط. قياس فتح بارد/دافئ بنفس بيانات المستخدم والفرع وعدد المجموعات والصفوف، وتفصيل الشبكة وSQL والتركيب ومقارنة قبل/بعد، ما زال معلقًا؛ لا ادعاء زمن مقاس.

المراجع: الأدلة المحلية S113 وR0551/C1792/C1793 للتقدير، وR0555/C1818 للعمالة وR0554/C1790 للتصنيفات من لقطة ٢٠٢٦-١٠-٢٨ روجعت في العقود أعلاه. تنسيق Sigma يتبع UI4/5/6/8/13/21/22/24؛ لا تحويل لإعلان مرجعي إلى قواعد مالية أو صلاحيات. اكتمل دليل المستخدم في UserGuide/content/workshop-guide.ts، داخل مسار /UserGuide/workshop، للتبويبات والإجماليات وعمود الاعتماد والبحث الواسع.

التحقق النهائي: نجحت صياغة أربعة ملفات TypeScript وأربعة قوالب Angular وتنسيق محرر التقدير، وgit diff --check. نجح Check للحزم الثماني بعد مراجعة الفروق. لا تغيير كتاب أو مهارة أو قدرة مشتركة جديدة يستلزم إعادة توليد؛ استُخدمت الواجهات العامة القائمة. لا build أو اختبارات أو متصفح أو قاعدة بيانات أو migration أو commit. راجع وكيل مستقل الخلفية قراءة فقط، ونفذ وكيل الواجهة ملفات HTML/SCSS والقائمة المفوضة؛ ملك الجذر TypeScript للمحرر والتقرير والدليل والدمج والمصالحة، دون تداخل ملكية. نفذ الجذر تعديلي البحث الصغيرين مباشرة.

رسالة حفظ مقترحة للواجهة: feat(workshop): align estimation editor and simplify catalogue filters. لا تغيير خلفي أو Add-Migration لهذه الشريحة.

