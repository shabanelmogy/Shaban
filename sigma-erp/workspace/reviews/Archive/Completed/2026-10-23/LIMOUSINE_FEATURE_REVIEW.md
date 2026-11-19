# Limousine feature review

| Status | Implemented — source-only |
|---|---|
| Owner verification pending | yes |

Current status includes the owner-approved partial invoice amendment at the end of this report. Earlier Blocked decisions and reconciliation below are preserved as historical evidence; they are superseded by the later approval and implementation, not silently rewritten.

## Manifest — 2026-10-07

- Request: review `src/app/modules/Limousine`, then apply confirmed corrections according to canonical documentation.
- Scope: Angular Limousine feature and directly related routes/providers/translations; inspect owning backend contracts without altering business rules or schema.
- Repository: `F:/My Work/Sigma/SiGmaAngularFrontEnd`; API evidence: `F:/My Work/Sigma/SigmaBackend`.
- Existing changes: Movements modules, shared numeric validation, translations and related compilation roots were already modified; preserve these and inspect scoped diffs separately.
- Evidence: current source; no screenshots, videos or external business requirements supplied.
- Authority: Sigma AGENTS, Master blocks 1–8, applicable UI/backend blocks and sigma-screen-refactor digest. Recipe `-Check` reports drift in PLAN-00 and phases 00/02/03/04/05/06; phase01 current. Use canonical books; regeneration and semantic review owner-pending.
- Preliminary UI shapes: normal lists/modal editors (Location, TripTypes); tariff/settings workspace; routed stateful quotation/trip editors; read-only reports; DriversTracker map exception. Verify Invoice/GridCustomization ownership before changes.
- References: Workshop/Job list and routed editor; shared EditorDialog/EditorTabs for modal composition; shared ReportPage/ReportActions and StatementOfAccount for reports.
- Applicable phases: 0 discovery, 1 contracts, 2 read/grid, 3 detail/write, conditional 4 existing domain actions, 5 integration, 6 source reconciliation.
- Authentication: existing AuthGuard/interceptor chain; no permission API exists. UI visibility is not authorization.
- Exclusions: new workflows, accounting decisions, migrations/snapshots, reference-module edits, unrelated changes, builds/tests/lint/database/browser/commits/pushes/deployment.
- Independent read-only backend-contract discovery delegated to luna_contracts (gpt-5.6-luna); root owns contract decisions and integration.

## Contracts and conformance

Source-supported contracts were frozen and implemented. Overall closure is Blocked by the invoice workflow decision below; implemented slices are source-only and owner acceptance remains pending.

## Historical reconciliation before invoice approval — 2026-10-07

The confirmed frontend/backend corrections are integrated. This report does not declare the entire module Closed: LimousineInvoice still has a material write/API conflict. No screenshots/videos were supplied, so functional evidence is current producer/consumer source, not screenshot inference. No new accounting effect, permission, schema or business transition was inferred.

| Slice | Final status | Source result / remaining boundary |
|---|---|---|
| Location / TripTypes | Implemented — source-only | Typed paged shared lists and controlled Create/View/Edit modals; actual field constraints, place search, read retries and cold frozen discard guards. Explicit lean backend list/detail contracts and one-way maps. |
| TripType tariff settings / LimousineTariff | Implemented — source-only | Actual enums, typed collection workspace, all-section full snapshot, optional matrix rates and deletion semantics retained, duplicate/FK validation and row/discard confirmations. |
| LimoQuotation | Implemented — source-only | Routed typed editor and paged list; existing approval actions, source status labels, server tax, saved View values, full export and print. Lean responses, filter/projection hooks, localized feedback and tracked update/state saves. |
| TripBooking | Implemented — source-only | Routed editor/documents, minimal projected paged list, existing workflow dialogs, shared history/status/output, protected owned-child reconciliation and one tracked save. Settings gate Finish, exports and mutations cannot overlap, restored paging is integer/capped100. |
| Three reports | Implemented — source-only | Shared bounded report/grid/summary/print owners, complete server responses and totals, applied-query identity, full output and failed lookup/report retry. No report formulas changed. |
| TripGridCustomization | Implemented — source-only | Actual Column0–7/Hide preference CRUD, minimal typed responses, enum validation and controlled modal. Application to TripBooking is Uncertain: no actual consumer/ownership contract found; no invented reader. |
| DriversTracker | Implemented — source-only | Existing Cairo map adopts bounded shared title/map. Live tracking is Missing in source; the marker is labelled map center, not claimed to be a live driver. |
| LimousineInvoice | Blocked | Existing editor/write fields differ from AddVM; AddFromScreenAsync has no owning API route. Await exact single-invoice versus selected-trip workflow decision. Feature files remain unchanged. |

### Decisions and evidence

| Concern | Decision / source evidence |
|---|---|
| Authority and packets | Canonical Master/UI/Backend books and sigma-screen-refactor digest used. Initial recipe check: phase01 current; PLAN00 and phases00/02/03/04/05/06 stale. Owner must regenerate and semantically review derivative packets; no generated packet edited. |
| Shapes / references | UI01 normal list + controlled shared EditorDialog for masters/grid preferences; UI02 routed financial/owned-child editors for quotation/trips; tariff collection/settings workspace; UI20 complete reports; map exception. Workshop/Job owns the list/routed comparison; shared modal declarations own the controlled modal alternative. Fleet/Vehicle is routed, not a modal reference. Historical correction recorded in the grid freeze. |
| Action classification | Master View/Edit/Delete and TripType tariff settings Supported. Trip Assign/Dispatch/Start/Finish/NoShow/Cancel/History/Print Supported by exact existing endpoints/state rules. Quotation InternalApprove/InternalReject/CustomerApprove/CustomerReject/Revise Supported by source. Job invoice/close/gate-pass/labour-time or unrelated approve/post/void workflows Not Applicable to these records. Invoice generation remains Blocked. Backend repeats state/invoiced/foreign-key/overlap validation. |
| Inputs and reads | Explicit write payloads contain only editable fields; Update adds id. Existing Invoiced remains the source-supported trip editor/API input; accounting ownership redesign is outside the task. List responses have only display + identity/action fields. Detail responses flatten saved names and omit unused navigation/tenant/audit plumbing. Generic class-detail/no-list-base constraints verified in Service/interface/controller. |
| Paging/filter transport | Generic exact count and cap100 retained; shared toListParams/toFilterParams/toQueryParams/resolveListPaging/route-state owners. Explicit Search snapshot survives refresh/navigation. Inline reads cancel older requests. Calendar end filters include the final day; trip precise timestamp caller semantics remain. Existing case-insensitive trip filter keys retained. |
| Maps | Conventional one-way maps; explicit name/address/amount mapping only where needed. Trip Update Documents Ignore is necessary because tracked rows are reconciled, not replaced by AutoMapper. No unused ReverseMap. Declaration-only quotation/trip/grid FullListVMs removed after targeted consumer searches. |
| Calculations | Trip net/amount = server charges + tax − discount; quotation tax owned by ITaxPolicyService/settings, total is preview only. Derived net/total omitted from writes. View displays saved amounts/tax. Utilization server summary and existing report formulas retained; named projection record moved to its own file. |
| Child persistence | Trip OwnsAll validates nonnegative/unique/live/owned child IDs before mapping. Live documents must match parent tenant; Detail excludes deleted/cross-tenant rows. Full snapshots use ReconcileOwned; legacy explicit null leaves documents unchanged. Delete soft-deletes parent and owned rows, retaining history/state rules. One SaveChanges and EF implicit transaction; no extra transaction or reservation. |
| Integration/access | Existing lazy route, AuthGuard and interceptor architecture retained. Explicit list-only modal routes; routed create/view/edit and legacy trip/quotation compatibility redirects. Removed duplicate Limousine module providers (all actual services already providedIn root), including unchanged Invoice service. Toolbar title suppressed only for refactored feature-owned titles. No invented authorization/permission API; UI visibility is not security. |
| Build entries | Inspected actual tsconfig.app.json: it contains no obsolete Limousine runtime entries. The fragment's proposed old-tariff entry removal is Not Applicable. No broad include or unrelated configuration edit made. Existing spec imports were repaired after renames; no tests added or run. |
| Shared owners / learning | Adopted existing table/filter/dialog/editor/error/date/upload/summary/print/enum owners. The short report form-disable effect is feature behavior composition of existing owners, not a new reusable visual/date/query/error abstraction. No verified new general rule established; no book/skill learning change required. |

### Grid columns beside actual response properties

| List | Visible columns (plus shared actions) | ListVM properties |
|---|---|---|
| Location | shortName, searchGoogleLocations, detail | id, shortName, searchGoogleLocations, detail |
| TripType | name | id, name |
| Quotation | no, createdAt, customerName, internal approval, customer approval | id, no, createdAt, customerId (identity/context), customerName, status (both approval columns/actions) |
| TripBooking | no, tripTypeName, customerName, guestName, pickUpDateAndTime, dropOffDateAndTime, pickUpLocationName, dropOffLocationName, vehicleTypeName, vehiclePlateNo, driverName, notes, status, amount, fromAddress, toAddress | Those16 fields + id, invoiced, externalVehicle, searchVehicleByAny, vehicleId, driverId, charges, tax, endKms (existing workflow initialization/eligibility) |
| TripGridCustomization | column, hide | id, column, hide |
| Utilization report | date, optional hour, tripsCount, kmsCount, chargesSum | Complete report rows: same fields; server summary retained separately |
| Chauffeur report | tripNo, pickUpDateTime, dropOffDateTime, pickUpLocation, dropOffLocation, chauffeurName, reason | Complete report rows: same fields |
| Tariff report | location1/location2 where applicable, vehicleType, rateType, rate | Complete section item: same fields; source category/customer/ordered section context retained |

Tariff is a complete-scope editor, not a paged ListVM. Each owning freeze and implementation fragment records detailed Add/Update/Detail/filter/action tables and conformance references.

### Phase accounting

| Phase | Applied / skipped |
|---|---|
| 0 Discovery | Applied: actual sources, documentation drift, existing changes and reference shapes. No screenshot extraction: none supplied. |
| 1 Domain/API | Frozen for implemented slices; material invoice write handoff Blocked. Separate historical amendments record lean response/reference changes. |
| 2 Read/grid | Applied to confirmed lists/reports and full filtered output; Invoice list refactor remains dependent on its unresolved owning workflow. |
| 3 Detail/write | Applied to confirmed editors/collections/documents. Skipped for read-only reports/map; Invoice affected work paused. |
| 4 Actions | Applied to existing trip/quotation state actions and ordinary delete/discard confirmations only. No unsupported accounting/new workflow implemented. |
| 5 Integration | Scoped route/provider/interceptor/standalone/title/import source reconciliation applied. Runtime/browser execution prohibited and pending. |
| 6 Reconciliation | Source integration and verification recorded; whole-feature closure Blocked by Invoice and all runtime acceptance pending. |

### Required invoice decision

Frontend `LimousineInvoiceCreateDTO` sends fromDate/toDate/branch/driver/amountPlusTax/createdBy and optional id; server `LimousineInvoiceAddVM` instead owns branchId/module/tripNo/pickUpDate/driverId/customerId/amount/tax (derived TotalAmount). Existing controller is generic. `ILimousineInvoiceService.AddFromScreenAsync(IEnumerable<LimousineInvoiceScreenItemDto>)` exists, but the controller does not expose it. `TripBooking/ForLimoInvoices` is a candidate read, not proof of the intended invoice write workflow.

Required owner direction: **create/edit individual invoices using the existing generic API contract, or generate invoices from selected trips using the existing screen service through an explicitly approved API contract?** This affects accounting/write behavior, not a harmless layout choice. No elapsed wait or “continue” message chooses either option. Pending clarification was presented during implementation; independent slices continued.

Authority: `F:/My Work/Sigma/AGENTS.md`, Explicit direct review-and-refactor: “If a required business or API decision remains Missing, Conflicting, or Uncertain … pause only the affected implementation … request direction rather than inventing a contract.” LimousineInvoice is deliberately not claimed conformant. Its legacy scaffolding remains an open finding until this decision is frozen.

### Source verification and limits

- Scoped frontend/backend diffs reviewed in their actual Git repositories by bounded owners and root integration. Root reconciled DTOs/endpoints, generic constraints/hooks, maps, parent/child ownership, calculation boundaries, routes/providers/titles, status/action labels, paging/state and error owners. New/untracked runtime contracts were inspected separately.
- Final TypeScript AST and Angular template syntax parsing/local import-path resolution: **70 TS files,18 templates,0 errors**. This includes unchanged feature scaffolds; syntax success does not resolve the invoice contract. Results in `Limousine/SOURCE_VERIFICATION.json`. No type checker or Angular/.NET compiler ran.
- Static translation-key audit: **0 missing EN,0 missing AR**. Canonical Check-Translations across the11 touched feature/general blocks: **391 keys each;0 missing/0 case differences**. Enum labels use actual shared helpers; other feature keys are complete literals. Backend resource XML parses with **748 unique keys in each file,0 duplicate keys**;89 feature feedback keys integrated while historical stored notes are preserved.
- Both scoped `git diff --check` passes are clean. Merge-marker/stale import/private UTC/raw table checks reconcile to replaced source; legacy Invoice remains excluded from implementation closure. Existing unrelated Movements, shared validators and their translation content preserved. Task-owned translation insertions and EOF whitespace cleaned only; no business translations overwritten.
- No entities/EF/schema changed. **No Add-Migration required.** Migrations and snapshots untouched.
- Builds/tests/lint/browser/application/database/migrations/commits/push/deploy/Sigma MCP/Graphify were **not run**. Runtime/visual/concurrency/accounting acceptance remains owner-pending.

### Remaining risks and owner acceptance

1. Freeze the invoice decision before implementing that slice; live tracker data and grid preference application need their own real API/ownership decisions if later requested.
2. Compile frontend/backend. Parser checks cannot prove TypeScript types, template input compatibility, AutoMapper projection SQL translation or EF soft-delete/concurrency execution.
3. Exercise paging/filter/URL restore (fractional/oversized legacy state, final day, invoiced=false), rapid overlapping reads, final-row deletion and full filtered export/print after language changes.
4. Exercise all Create/Edit/View modes, required lookup/settings failures and Retry, saved labels absent from lookups, manual tax settings, local date/time round trips and readonly saved totals.
5. Exercise owned document add/update/remove/foreign-id/duplicate-id/deleted-id validation, simultaneous uploads, failed Save retaining values, and saved/discard cleanup retry without another successful mutation. Compare persistence/soft deletion/history in one save.
6. Exercise each legal and rejected trip/quotation action, busy double-clicks, dirty close/X/Escape/router/browser exit, cancelled pending decisions, reused record URLs, concurrent modifications and overlapping allocation writers. Existing availability prechecks do not prove serialization between simultaneous writers; no new locking policy was invented.
7. Compare complete report/grid Excel/print rows and server totals; cancel/fail print and check loader/form restoration. Verify narrow/LTR/Arabic RTL/light/dark, keyboard focus/accessibility, one title and the documented internal scroll owner.
8. Regenerate and semantically review stale recipe packets. Neither source implementation nor parser evidence marks runtime acceptance Closed.

### Handoffs, files and suggested commits

Exact source changes are recorded in `Limousine/FILES_CHANGED.md`, grouped by actual repository, including deleted/new files. Detailed bounded evidence: MASTERS_IMPLEMENTATION.md, REPORTS_IMPLEMENTATION.md, QUOTATION_IMPLEMENTATION.md, TRIPS_EDITOR_IMPLEMENTATION.md, GRID_CUSTOMIZATION_IMPLEMENTATION.md under `reviews/Limousine`. Frozen handoffs are the five sibling LIMOUSINE_*_CONTRACT_FREEZE.md files; amendments preserve historical decisions.

Root final additions: lean master DetailVMs, owned document DetailVM/tenant guard/soft delete, generic trip hooks/controller, tracked write saves and quotation UpdateCore hook, localization/resources, typed trip workflow list, shared toolbar/provider cleanup, map shell, paging/discard/settings/export-race corrections and final source checks. Suggested commits only:

- Frontend: `refactor(limousine): align typed screens and reports with shared patterns`
- Backend: `refactor(limousine): narrow read contracts and reconcile owned trip documents`

### Agent utilization

Controlled delegation followed frozen contracts and non-overlapping ownership. Initial luna_contracts used the offered gpt-5.6-luna for bounded read-only source tracing. masters_worker/quotation_worker/reports_worker owned independent frontend slices (quotation's four backend files explicitly assigned); subsequent masters_finish_audit/quotation_finish_audit/trips_editor_finish used inherited orchestration models, with no unnecessary override. Masters owned Location/TripTypes/Tariff/reports, quotation owned its editor/list/backend plus a separately frozen grid slice, trips editor owned details/models/routes only. Root retained trip list/service/backend/shared resources and whole-feature decisions/integration. At most three worker streams plus root; bounded follow-ups reused existing agents. Delegation shortened parallel screen work without overlapping translations/shared files and reserved root judgment for material contracts. Final read-only trip-list audit identified settings/export/fractional-page issues; root corrected them before handoff. Agents did not declare overall closure. No exact monetary/time metric is available; no cost estimate is invented.

## Final reconciliation after owner-approved partial invoices — 2026-10-07

The owner selected trip-based generation (“تمام طبق”), then explicitly allowed multiple partial invoices and required their sum never exceed the trip total. The affected handoff was Frozen in LIMOUSINE_INVOICE_CONTRACT_FREEZE.md and implemented end-to-end. This resolves the historical invoice decision above. Detailed final producer/consumer/conformance/action/evidence tables and owner checks are in Limousine/INVOICE_IMPLEMENTATION.md.

| Slice / previous decision | Current final result |
|---|---|
| LimousineInvoice | Implemented — source-only. Paged shared list; readonly saved View/Print; complete candidate workspace with billed/remaining and selected gross portions. GET Candidates and POST Generate exposed; typed payload/result matches producer; full filtered print/Excel |
| Global trip cap | Shared backend balance/pricing policy plus tenant/type lock across participating dedicated/generic invoice and trip price/Finish/Cancel/Delete writers. Requested gross must be positive, currency-scale-valid and at most actual remaining. Invoice/flag/journal multi-saves are one all-or-fail transaction using existing accounting writer |
| Tax/discount | Total=Charges−Discount+stored Tax. Saved trip tax allocated to each part; exact remaining tax consumed on final part. Current tax settings never reprice saved trip source |
| Invoiced ownership | Supersedes historical editable input: derived Fully invoiced means positive total fully covered. Removed from Trip Add/Update VMs/payloads; readonly UI; actual sums enrich list/plain/deep details and filters. List minimal action state now includes billedAmount |
| Trip lifecycle | Price Update/UpdateList/Finish cannot lower total below billed or leave inconsistent remaining tax; Cancel/Delete reject any positive billed amount, including a partial invoice. Existing other state/history/owned-child rules retained |
| Compatibility | Old candidate reads use actual remaining and expose balances, avoiding legacy flags. Dedicated legacy writers route to the same pricing/accounting owner. Generic unposted edits preserve partial gross, exclude self for cap, refresh old/new trip flags; posted/approved/voided/missing-journal/allocated edits/deletes rejected |
| Other slices | Previously implemented source-only results above retained. DriversTracker live data remains Missing and grid preference application Uncertain for a future business request; neither was invented |

Invoice grid columns are no,tripNo,invoiceDate,pickupDateTime,customerName,driverName,amount,tax,totalAmount; ListVM is exactly those +id. Detail adds vehicle/location/description/branch. New request sends invoiceDate and items[{tripBookingId,totalAmount}] only. Source labels, customer/driver/branch, saved tax/discount, numbering and tenant belong to backend. Existing lazy route/AuthGuard/interceptors retained; new create/view routes and feature title aligned. No new permission mechanism or posted correction screen.

Phases0–6 now applied to the invoice handoff as well; no affected implementation remains blocked by the original API decision. No screenshot supplied. Canonical books and applicable skill/reference owners used after recipe drift check. Frozen trip handoff carries an explicit later amendment; prior historical decisions preserved. Controlled reused invoice_frontend/invoice_writer agents owned non-overlapping files; root integrated policy, services/trip guards, resources and final reconciliation.

Current verification supersedes historical counts:70 runtime TS files/18 templates parsed with0 syntax/local-import errors; static translation audit0 missing EN/AR; twelve-block canonical parity439 keys each/0 missing/0 case differences; backend resource XML766 unique keys each/0 duplicates. Scoped frontend/backend git diff --check clean; complete scoped source reviewed by workers/root, including new contracts. Exact combined inventory is105 frontend and47 backend paths in Limousine/FILES_CHANGED.md. No entity/EF/schema change, Add-Migration not required; migrations/snapshots untouched. No builds/tests/lint/runtime/browser/database/Graphify/Sigma MCP/commits/push/deploy executed.

Owner acceptance remains required for compilation/projection SQL, multiple partials and final tax residue, invalid/over-remaining inputs, two-user billing/price races, whole-batch rollback on accounting failure, tenant/soft-delete and old flags, posted/unposted guards, preserved other invoice types and dirty/read/print/export/RTL/theme/narrow/keyboard behavior. The lock protects participating writers; arbitrary SQL/future bypass writers are outside that guarantee. Live voided invoices conservatively consume the cap; no existing-data repair was performed. Packet regeneration and semantic review remain pending. Source-only implementation is complete; runtime acceptance is not Closed.

## Compiler feedback repair and financial review clarification — 2026-10-07

Status: Implemented — source-only; owner verification pending: yes. User supplied four compiler diagnostics on three frontend files, then asked whether booking financial entries had been reviewed. This is a bounded repair within the existing approved contracts; no domain/API/schema/configuration/shared-control changes. No screenshots supplied. Recipe -Check still reports the same drift; canonical Master5/UI1/4/10/19 and actual shared declarations govern the fix.

| Compiler finding | Corrected source / conformance evidence |
|---|---|
| LimoQuotation list TS2322 reserveMessage boolean | The actual FieldErrorComponent input is a translation-key string. Use reserveMessage="validationMessages.date", matching Workshop Job list and canonical UI4/19. Preserve reserved feedback and date validation |
| Location editor two TS2345 string-or-object arguments | Handle the selected LocationSearchDTO object first; derive searchText with an explicit typeof-string conditional before string-only setValue/searchPlaces calls. Text entry, object selection, cleared-input behavior and dirty state retained; no cast or compiler-option workaround |
| TripGridCustomization editor TS2367 impossible View comparison | Earlier canDeactivate excludes View and captures the edit mode. Finalizer already checks current mode equals that captured mode; remove its redundant View comparison. Same-record/visible/ready/busy restoration and intentionally disabled controls retained under UI10 |

Changed application files: SiGmaAngularFrontEnd/src/app/modules/Limousine/LimoQuotation/components/list/list.component.html; Location/components/details/details.component.ts; TripGridCustomization/components/details/details.component.ts. Complete current methods/public contracts compared and scoped diffs reviewed. Syntax/local-import parsing still70 TS/18 templates/0 errors and scoped git diff --check clean. Targeted Limousine template search found no remaining boolean reserveMessage=true. Parsing does not certify these compiler diagnostics are absent; owner rerun of Angular build remains pending. No build/tests/lint/browser/database/commit/deploy run by the agent. No backend source changed in this repair. Phases2/3/5/6 applied to the bounded source compatibility repair; new domain/action design and migrations Not Applicable. Existing book/skill consumer-contract and discard rules already cover these findings; no new reusable rule required.

Financial review answer is source-specific: TripBookingService.AddAsync saves the booking and creation history, with no journal creation. The limousine invoice path in InvoiceService.BuildAndPostInvoiceJVAsync debits the customer account by gross, credits the configured Limousine/Rental revenue account by net, and credits TaxCollected by tax when positive. It verifies linked accounts, invoice-date fiscal availability, equal total debit/credit and one positive side per line, then uses the existing SaveAndPostJVAsync resolver. These financial writer/cap/transaction paths were reviewed in the partial-invoice reconciliation. Actual configured account IDs, persisted journal results and runtime rollback/concurrency were not checked against a database and remain owner-pending; this is not a completed accounting-data audit.

## Deposit / advance follow-up — source review, 2026-10-07

User asked about a booking with deposit or advance. This follow-up reviews existing settlement ownership; it does not authorize or implement a new accounting contract. No application source changed in this follow-up. Canonical BE15 distinguishes advance receipt (customer credit allocated to later invoices) from refundable deposit receipt (Customer Deposits Payable; no automatic invoice netting). Existing UI/invoice source remains as approved.

Trip price and gross billing capacity are separate from payment settlement. A trip total1000 with allocated advance300 may still have limousine invoices summing1000; settlement leaves700 payable. Never reduce the trip's invoice cap to700 or bill1300 by counting the advance again. For partial invoices, settlement is allocated against each saved invoice's outstanding balance, bounded by both unused payment source and target outstanding.

| Existing path | Verified source / open boundary |
|---|---|
| Limousine new generation | No deposit/advance/receipt selection or auto-settlement call in LimousineInvoice component/payload/service or dedicated Generate. This implementation guarantees billed gross capacity, not automatic payment allocation |
| Customer deposit | CustomerDepositService.GetOutstandingInvoicesAsync includes LimousineInvoice. UseDepositAsync explicitly debits CustomerDepositsPayableAccount and credits customer AR, tracks UsedAmount and usage and posts a JV in its transaction. CustomerDepositUsageAddVM has no target-invoice allocations; Use does not create JournalVoucherAllocation rows. Therefore a customer credit movement is not proof that a specific limousine invoice has been settled |
| Tax advance | InvoiceService.AllocateTaxAdvanceAsync accepts same-customer InvoiceBase targets excluding AdvanceTax, so limousine can be a target. It validates target outstanding under the allocation lock and posts CustomerAdvances Dr / customer AR Cr |
| Confirmed source-consumption mismatch | AllocateTaxAdvanceCoreAsync computes already-used source with AllocatedJournalVoucherId==advanceInvoice.JournalVoucherId, but creates allocation rows with AllocatedJournalVoucherId==newJvId. GetTaxAdvanceAllocationDetailsAsync repeats the original-id lookup. Generated settlement JV has no persisted original advance identity in this flow. Previous use can be missed by the source-cap check/display, permitting reuse across different targets while their individual capacities pass. Existing source comment explicitly leaves original-source tracking contract unresolved; the earlier limousine writer work preserved it. No runtime exploit/data check performed |

Deposit/advance settlement is therefore not declared complete or safe for automatic booking integration. It needs a frozen original-payment/usage identity and reversal contract plus source/target capacity reconciliation before enabling that integration. Keep refundable security deposits separate until an explicit Use action. No accounting source migration, history repair, automatic deduction or broad Receipt/Deposit refactor inferred from this question. Scope of this read was the named invoice/deposit writer and DTO/model/controller paths, not a full financial subsystem audit; builds/database/tests remain unrun.
