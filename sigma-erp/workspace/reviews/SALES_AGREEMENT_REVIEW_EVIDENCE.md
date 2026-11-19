# Sales Agreement — bounded review evidence

## Agreement Information split amendment — 2026-10-27

| Item | Frozen presentation decision |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Authorization | Owner explicitly requests splitting Agreement Information into two tabs, then says continue. Supersedes that portion of the consolidation below only. |
| Final tab contract | Agreement Information keeps customer/currency/date/source references/commercial terms. New Units tab owns the existing equipment/price collection, with the same Add/Remove/eligibility/financial-lock behavior. Payment Terms and Schedule, Documents and conditional saved Transactions remain as consolidated. New agreements therefore have four tabs; saved activity adds the fifth only when present. |
| State/validation/print | Existing persistent form/panels, busy/dirty gates and print-all media remain. Unit empty/duplicate/selection/price errors select Units before shared focus; header errors select Agreement Information; financial/schedule errors select Schedule. No new request/service/model/backend/schema change. |
| Scope and authority | Same actual route, shared EditorTabs/FormSection and UI13/14/21 rules, existing guide/reference applicability. Eight-packet drift check passes; no new reusable rule or canonical/skill change required. Bounded sequential presentation slice, no agents. |

Owner amendment in the same task: totals move below the tab-body region and above Save/Close, matching the existing shared document editor and SalesQuotation composition. Same summary cards/data/format retained; no new total calculation or visual owner.

### Final reconciliation of tab consolidation, split and totals placement

| Item | Final source result |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Final panels | Agreement Information, Units, Payment Terms and Schedule, Documents; conditional Transactions when loaded invoices/deliveries/receipts exist. Financial inputs moved beside schedule, all three history tables grouped without changing their columns/rows/actions. Empty histories produce no spare tabs. |
| Scoped source | SalesAgreement Details TS/HTML, EN/AR vocabularies and Sales user-guide content. Existing shared showTitle contract suppresses repeated headings without losing Add/Generate. No shared owner edits required in this consolidation/split task. Prior unrelated source changes preserved. |
| Validation and state | Unit missing/duplicate/selection/price -> Units; customer/date/commercial terms -> Information; financial/schedule controls and first-installment errors -> Schedule. Same persistent typed form, row factories, eligibility/read-only/financial lock/busy guards. Unknown/removed activity tab rejected; refreshed empty activity falls back to Information. |
| Totals / scroll / print | One summary host outside sigma-editor-body, before footer; uses existing summary component/slim row/8px gap as SalesQuotation. Shared form/body flex chain retains one internal active-panel scroll and fixed title/tab strip/totals/footer. Persistent core panels print through existing screen-only visibility rules; available history tables remain printed; no print-only data fetch or truncation. |
| Guide / translations | sales-guide.ts /SalesAgreement topic updated bilingually for four creation tabs, conditional activity, bottom totals, validation and complete print. Existing /UserGuide/sales reader/menu retained. New agreementInformation/unitsTab/paymentAndSchedule/activity keys present in both vocabs; old history labels retained for distinct subsections. |
| Source-only verification | Complete scoped component diffs inspected; no new symbol imports/project references needed; literal tab keys and tab/panel ARIA IDs reconciled. Whitespace/conflict checks and final recipe Check pass. No compiler/runtime success claimed. No new reusable lesson beyond UI13/14/21, so no further canonical/skill/packet edits. |
| Cache/loading/performance | /SalesAgreement actual route and existing request owners unchanged. Direct SalesAgreement/GetByWithNavigationsId/{id}, SalesQuotation detail preload and SalesAgreement/available-units retain operational contracts. Customer/GetSelect retains approved BaseService source/watch, selected label/draft/reset/Retry/DestroyRef behavior and Customer writers/import topic coverage. Bank/GetSelect remains source-supported direct read; Common settings singleton tax source and direct Currency/GetFinancialNumberPolicy/partner currency read retain their existing owners. Tab switching does not remount these panels/read owners or introduce a call. Save/domain/uploads/cleanup global owner and dialogs' local status unchanged; no new loader. No query/page/volume/index/schema change justified by regrouping; existing backend SQL-plan recommendations remain separately pending. No measured speed claim. |
| Phases / schema | Bounded discovery and frozen presentation amendments, Phase03 implementation, Phase06 reconciliation; backend/read-grid/domain/routing changes not needed. No API/DTO/mapper/calculation/schema change; no migration. |
| Owner acceptance | Create/Edit/View retain values across tabs, correct invalid-tab focus, row Add/Remove and upload cleanup; totals stay below active content on long/short/narrow/intermediate/wide layouts, EN/AR/RTL/themes. Saved no-history/each-history/all-history views, activity fallback, print from each tab includes all data/headings/totals. Comparable network/render timing remains owner-pending if measured; no build/tests/lint/browser/database performed. |
| Boundaries / team / suggested commit | No migrations/snapshot/commits/push/deploy/Graphify/Sigma MCP executed; no agents for this sequential slice. Frontend suggestion: refactor(sales-agreement): organize tabs and place totals above footer. |

## Tab consolidation amendment — 2026-10-27

| Item | Frozen presentation decision |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Authorization | Owner requests organizing tabs and removing excess tabs in the same Sales Agreement editor. Supersedes the earlier five-tab presentation only; no business/API change. |
| Core tabs | Agreement Information: existing customer/date/source/terms and units. Payment Terms and Schedule: move existing financial inputs beside the unchanged installment schedule. Documents: retain file editing/upload/cleanup. |
| Saved activity | Replace separate Delivery Notes and Receipts tabs and the invoice table inside Details with one Transactions tab containing distinct invoice/delivery/receipt sections. Show only when the loaded agreement has actual activity; hide empty activity sections. Creation has three useful tabs. No record, field, table column, history row, navigation action or backend data removed. |
| Validation/state/print | Keep existing pane instances and busy/dirty/readonly/financial-lock guards. Retarget financial control/date errors to Schedule, preserve unit/header errors in Details, and fall back to Details if activity disappears on refresh. Existing print media prints all mounted panels; conditional activity is only absent when its source arrays are empty. |
| Authority and evidence | Existing route/shape/source/user guide and shared UI13/14/21/22/29 inspected; initial eight-packet Check passes. Earlier analysis-guide/source comparison remains applicable; cosmetic regrouping adds no commercial or financial rule. Required tab names translated in EN/AR. No new shared capability needed; existing EditorTabs/FormSection/DataTable own the composition. |
| Cache/performance/scope | No new request, read owner, cache eligibility, service/DTO/calculation/index/schema change. Same detail arrays supply activity. This sequential layout/focus/guide slice does not warrant agents. No builds/tests/lint/browser/DB/migrations/commits. |

## Repeated tab-title correction — 2026-10-27

| Item | Decision and evidence |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Scope / authorization | Owner asks removing repeated tab names in Create New Sales Agreement. Tier S presentation correction in the common Create/Edit/View editor; retain tab labels, section actions, inner distinct subsection names and printed section headings. Existing source edits preserved. |
| Actual entry / shape | /SalesAgreement -> SalesAgreement_Routes -> DetailsComponent; UI screen02 peer tabs, existing backend Pattern2 Save and financial actions unchanged. Real EditorTabs tab keys/labels match the five top-level FormSection titles. Child tables already suppress their own headings. |
| Shared owner contract | FormSection.showHeading=false removes the complete header, including projected Add/mock controls, so it is insufficient. Add default-true showTitle to suppress only repeated noncollapsible heading labels on screen while retaining actions and print headings. Collapsible disclosure keeps its label. Adopt false only for the five repeated top-level Sales Agreement sections; distinct Items/Financial Terms/Invoice History headings stay. |
| Analysis / API | Reference entry and guide chapter6/S182 quotation context read earlier; no original reference can prescribe this Sigma-only repeated label. Functional analysis not applicable to this cosmetic element; existing Sales agreement contract/user-guide workflow compared and preserved. No new field, permission, calculation or business/API decision. |
| Cache/loading/performance | No request/service/cache/lookup/lifecycle/query/schema change. Same routed panel/form instances, tab ARIA, loading/error/Retry and Add/Save behavior retained. No index or measurement claim justified for suppressing a repeated heading; runtime visual/print check pending. |
| Guides / packets / team | Master1/4/5/7, UI13 real shared FormSection and EditorTabs contracts; initial eight-packet Check passes, Phase03 applicable. New reusable owner contract goes into UI13 and skill, packets regenerate afterward. No agents: tightly coupled small shared/consumer change. |

### Final source reconciliation

| Item | Result |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Source changes | Shared FormSection TS/HTML/SCSS adds default-true showTitle; five repeated SalesAgreement top-level titles opt out. Screen media hides label/icon/description and removes actionless header rows; real projected/mock controls remain. Nonrepeated subheadings and collapsible disclosure labels retained. Print media keeps original headings. No showHeading removal or feature deep CSS. |
| Style contract check | Scoped selectors apply to the owner header; native descendant action matching in :has accommodates projected controls. Installed Angular compiler ShadowCss source reviewed for selector scoping; compiler not executed. Existing logical spacing, tokens, wrapping, theme and RTL remain shared. Default true leaves unrelated consumers unchanged. |
| Guide and learning | Updated bilingual Sales Agreement steps in UserGuide/content/sales-guide.ts, existing /UserGuide/sales reader/menu. UI13 and skill revision describe title-only suppression versus whole-header removal, action preservation and print behavior. Generator refreshed all eight packets; affected UI13 provenance retained in Phase03/04/06, semantic phase/reference boundaries reviewed and final Check passed. |
| Preserved contracts | Same five tabs/ARIA identities, same form controls/models/rows/Add Document/Generate/Save/confirmation/print owner. No imports/types/project wiring or translations added. API/mapper/domain/index/schema unchanged; no migration. No request/cache/loading lifetime change or performance claim. |
| Verification | Complete scoped shared-component and agreement-template diffs reviewed, including pre-existing user edits; whitespace/conflict checks passed. App/source compile and runtime/print acceptance pending. No build/tests/lint/browser/runtime/DB/migrations/snapshot/commit/push/deploy/Graphify/Sigma MCP executed. |
| Owner checks | Create/Edit/View each tab name appears once on screen; Details still names distinct Units/Financial Terms/Invoice History. Documents retains Add Document, supported Generate actions remain and blank/read-only panels have no empty heading row. Print includes section names. Check EN/AR, RTL/themes and narrow widths. |
| Suggested commits | Frontend: fix(sales-agreement): suppress repeated tab section titles. Documentation: docs(sigma): document title-only form section headings. |

| Field | Value |
|---|---|
| Status | Draft |
| Owner verification pending | yes |
| Date | 2026-10-04 |
| Scope | Read-only SalesAgreement UI, owning service/controller/interface, aggregate, configuration, input/read VMs and mapping; invoice/delivery paths inside the service |
| Authority | `AGENTS.md`, sigma-screen-refactor skill, canonical Master/UI/Backend blocks and Frozen `SALES_CYCLE_CONTRACT_FREEZE.md` |
| Verification | Source only. Root's recipe drift check passed all 8 packets. No builds, tests, lint, browser/application, database, migrations, commits, pushes, Graphify or Sigma MCP |

## Manifest and baseline

- UI shape: screen 02 routed aggregate editor with list; screen 09 typed Invoice/Deliver action dialog. Several collections, totals and domain actions justify routed Create/Edit/View. The Save path is backend pattern 2; Invoice is a pattern 3 multi-save financial transaction. Deliver/Cancel/Close are stateful aggregate actions.
- References: Workshop Job list/editor for shared list/editor shell; Job close-job for typed action-dialog shell; shared confirmation, editable collection, file field/tracker and print owners. Canonical BE 14 owns tracked aggregate reconciliation and BE 15 owns invoice/accounting/VAT.
- Relevant guides read: Master 4–5; UI screen catalog/types 02/09 and applicable shell, tabs/dialogs, editable collections, view, discard, lookup, upload, loading/errors, cancellation and backlog; BE 14–15 and backlog. Generated Phases 2–4 inspected; root owns full phase reconciliation.
- No new screenshots or business decisions were supplied for this Sales review. Frozen Sales Cycle lifecycle and accounting rules remain authoritative; historical maintenance-plan findings are compared with current source, not reopened wholesale.
- Direct source reviewed in full: SalesAgreement FE TS/HTML/SCSS/models/service/routes; owning BE service/controller/interface/entity/config/VM/profile files. Shared dependency reads were bounded to actual called helpers. Root owns DueInstallments, receipts, global routes/translations; this report does not duplicate their findings.
- Current scoped Git baseline: frontend has only three inherited one-line edits changing `salesAgreement.status` to `general.status` (list TS, list HTML, details TS). Those edits are consistent with the existing generic key. Owning backend files have no scoped changes. Functional findings below are **current inherited defects**, not defects introduced by those three lines. No agent source edits.

## Verified actionable functional findings

### SA-01 — P1: lifecycle checks are not protected from concurrent writers

Primary evidence: `F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/SalesAgreementService.cs:56`, `:179`, `:240`, `:288`; owning `SalesAgreementConfig.cs`, `SalesAgreementItemConfig.cs:22`, `EquipmentConfig.cs`; shared DbContext tenant concurrency declaration.

Two requests can read an Available unit and both reserve it for separate direct agreements: the item index on SaleFleetId is non-unique, Equipment.SaleStatus has no concurrency token, and Add has no lock/conditional state update. Similarly two Invoice requests can both load Open before either enters its transaction, then create separate posted invoices/JVs and overwrite InvoiceId; Deliver can insert duplicate delivery notes because Invoiced is read without an atomic transition and no unique agreement-item note key exists. Concurrent Cancel or Delete versus Invoice can also act from the same Open snapshot. SubscriptionId concurrency protects tenant ownership only and does not change during these operations. Number counters protect document numbers, not the earlier eligibility read; a delayed second request can reserve its number after the first commit while keeping the stale state snapshot.

Recommendation: freeze one coordinated aggregate/unit state-write strategy and recheck eligibility within its protected boundary. A single-save transaction alone does not protect preceding reads (BE 14–15). Root's receipt-cap/void races are separate findings. No runtime race was executed.

### SA-02 — P1: ordinary editing reprices saved VAT from current settings

Primary evidence: `F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/SalesAgreementService.cs:751` and `:124`; frontend `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Sales/SalesAgreement/components/details/details.component.ts:882`.

For a saved direct Open agreement without receipts, PrepareAsync always calls ResolveTaxRateAsync(null), so Update recalculates at today's Common rate. Example: save at 5%, change settings to 15%, edit only notes/documents; the unchanged sale now saves 15% VAT and different total/schedule. The editor explicitly previews the saved TaxPercent, so the user sees the former total while the server commits another one. Canonical BE 15 rule 8 requires preserving the document snapshot on edit.

Recommendation: resolve settings only for new direct agreements and use the persisted TaxPercent for updates; preserve quotation-derived rate rules separately. No stored records were edited.

### SA-03 — P2: changing the unit on a retained row strands the previous reservation

Primary evidence: `F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/SalesAgreementService.cs:109`–`:131`; UI unit selector is editable for a direct agreement without receipts.

Change item id 10 from unit A to B and save. Release selection only collects old units belonging to **omitted item IDs**. Id 10 remains in the request, so A is not collected before CopyUnit overwrites its reference. B becomes Reserved, while A remains Reserved with no live agreement item to release it on later cancellation/deletion. It disappears from available-unit selection indefinitely.

Recommendation: retain all old unit IDs before reconciliation and release the old-minus-final unit set, including changed retained rows. This is distinct from the concurrent reservation race.

### SA-04 — P2: the preview overwrites user-edited schedule dates

Primary evidence: `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Sales/SalesAgreement/components/details/details.component.ts:844`; backend `SalesAgreementService.cs:102`–`:127`.

Set a payment's due date manually, return to Details, and change a unit price or discount. RegenerateSchedule saves old cheque/bank values but always assigns the generated row.date, discarding the manual date before Save. Backend termsChanged excludes price/discount and would accept the override in these cases (`applyDates: !termsChanged`), so the loss is client-side and contradicts the payment-date override contract.

Recommendation: preserve dates by SrNo whenever date-producing terms have not changed; regenerate dates only for the explicitly defined agreement-date/first-date/count changes. Keep backend-authoritative amounts.

### SA-05 — P2: rounding can create a negative last installment

Primary evidence: `F:/My Work/Sigma/SigmaBackend/SiGma.Helpers/Models/Sales/SalesAgreement.cs:85`; service ValidateFinancials and frontend schedulePreview mirror this formula.

At two decimals, remaining 0.04 across six installments gives PerInstallment=0.01, five rows totaling0.05, and final row−0.01. ValidateFinancials checks the header balance/count but never checks generated row amounts. The schedule sums to the total yet contains a negative amount; allocation clamps capacity to zero, so the negative row produces a negative remaining amount and inconsistent due-row/paid classification.

This edge case exposes a limitation in the **frozen formula itself**, not merely implementation drift. Recommendation: amend that calculation handoff to distribute integer minor units or otherwise guarantee nonnegative rows, then update producer and preview together. Do not silently invent a different installment policy during this read-only audit.

### SA-06 — P2: route exit permits navigation during Save and bypasses upload cleanup

Primary evidence: `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Sales/SalesAgreement/components/details/details.component.ts:621`, `:610`, `:577`.

canDeactivate returns true when saving. An external navigation/browser Back therefore destroys the component and unsubscribes the Save request, leaving its committed outcome uncertain and skipping finishSave. Dirty route exits only mark allowNavigation; unlike the Cancel/Back-button path, they never call uploads.discard, so unsaved uploaded files remain orphaned. Both finishSave and discard also close on failed-path lists/errors instead of retaining the editor for cleanup Retry. Document row removal and tabs are not guarded against upload/cleanup, so a uploading file-field can be destroyed before its returned path reaches the tracker.

Recommendation: use one exit/cleanup lifecycle across Cancel and route guards, reject navigation during save/upload/cleanup, and retain failed cleanup paths with an explicit retry that never repeats successful persistence. UI18 requires this. Workshop Job's canDeactivate explicitly returns false while saving/loading; it is the inspected reference for the busy gate. Server expiry remains best effort fallback, not client cleanup evidence.

### SA-07 — P2: quotation-owned inputs remain editable but are ignored on Save

Primary evidence: `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Sales/SalesAgreement/components/details/details.component.ts:789`–`:801`; backend `F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/SalesAgreementService.cs:773`–`:782`.

In a quotation-derived agreement without receipts the frontend locks customer/discount/item prices but leaves down payment, installment count and terms editable. ApplyTerms nevertheless takes those values from the quotation, silently discarding edits. Changing count/down payment can also make a previously valid preview fail server validation. After a receipt exists, the same Terms field switches to accepting input.TermsAndConditions, adding state-dependent unexplained behavior.

Recommendation: reconcile field ownership with the frozen quotation input handoff: show genuinely quotation-owned fields read-only; if agreement terms are editable, preserve that input consistently. Root must record any necessary contract clarification rather than reinterpret financial ownership locally.

### SA-08 — P2: Retry does nothing after failed quotation preload

Primary evidence: `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Sales/SalesAgreement/components/details/details.component.ts:403`; shared error branch `details.component.html:67`.

Open Create from a quotation and let the quotation detail request fail. The editor displays an error and Retry, but retry() only reloads when recordId is non-null. Create has null recordId, so the advertised recovery never requests that quotation again.

Recommendation: retry the actual active source (saved agreement or source quotation) with the same loading/error lifecycle.

## Canonical drift and lower-risk follow-ups

| ID | Concern | Evidence and consequence | Owning block / disposition |
|---|---|---|---|
| SA-C1 | Auto-height action form uses a zero-basis clipped shell without the required sizing/scroll strategy | action-dialog.component.ts:61 uses sigma-editor-form; app-editor-dialog has neither definite height nor the documented maxHeight/flex-fill/inner-scroll chain. Global sigma-editor-form is flex:1 1 0, min-height:0, overflow:hidden. Long Deliver content at narrow/short sizes lacks an inner scroll owner. | UI13 canonical conformance failure; potential collapsed/clipped content remains runtime verification pending. Use content-sized strategy or deliberate bounded chain. |
| SA-C2 | Duplicate lookup/preload failure presentation | getCustomers/getBanks/getAvailableUnits and quotationService.getDetail do not suppress global error presentation, while loadLookups/loadQuotation also show inline errors. Unlike getDetail/list, these calls have no X-Skip-Error-Interceptor. | UI22 single feedback owner. Recovery for lookups is also absent from the warning. Root owns quotation service; coordinate its option before changing shared calls. |
| SA-C3 | Public Update bypasses canonical protected UpdateCoreAsync structure | SalesAgreementService public UpdateAsync performs tracked reconciliation itself; BE14 requires the base public guard plus protected core. No UniqueColumns are declared here, so bypass is not reported as an existing duplicate-lock loss by itself. | Canonical structural drift; migrate only in an authorized implementation, preserving real aggregate rules. |
| SA-C4 | Receipt lock is partly hidden from controls | Backend FinancialTermsChange locks Date and FirstInstallmentDate after receipt; applyEditability disables other financial terms but leaves these editable. | UI/BE field-state mismatch. Frozen contract says editable dates without separating root versus schedule dates; root should clarify the exact contract, then align UI. Payment-row date overrides are accepted. |
| SA-C5 | Read override symmetry | GetManyWithNavigationsAsync merely forwards GetManyAsync; custom BuildDetail is needed for consumed receipt-aware details, while unused navigated-list forwarding requires independent justification. | BE14 override audit; not a functional defect. Root should check direct consumer requirement before recommending removal. |
| SA-C6 | Historical allocation order conflict | OrderSchedule sorts Date before Type (service:899); frozen D11 describes DownPayment first, then installment date/SrNo. A manually earlier installment date receives money before the down-payment row. | Contract drift; also consumed by DueInstallments, so root should reconcile once with that owning audit. No independent due-report rewrite. |

## Grid, write, and action contracts

| Concern | Current exact target | Evidence / disposition |
|---|---|---|
| Grid vs ListVM | Actions; no/string, date/date, customerName/string, customerCode/string, totalCharges/money, outstandingAmount/money, status/status. FE and BE properties: id,no,date,customerName,customerCode,totalCharges,outstandingAmount,status | Exact seven displayed properties + id. No audit/tenant/editor payload in ListVM. Status and outstanding drive actions. |
| Filters | no, customerId, dateFrom, dateTo, status; sortField/sortOrder inside Filters; current-month default | toListParams, inherited ListQuery generic scalar matching, custom Date filters, customer-name/code order. Count/page from base; server paging. Unknown keys ignored by shared base. |
| Read/export | switchMap list, finalize loading, both failure channels inline with skip header; fetchAllPages export | Source conforms. Grid/order shared with translated export; no client page-only export observed. Runtime translation/grid pending root. |
| Routes | list,create,edit/:id,view/:id; details/:id alias →view/:id | Single editor, explicit modes; list return applied filters/page/sort preserved. Dirty/busy exit defects SA-06. |
| Add/Update | quotationId?,customerId,date,terms,documents,discount,downPayment,count,firstDate; items[id on update,unitId,price]; schedule[srNo,date,chequeNo,bankId] | Derived tax/totals/status/tenant/number/audit omitted. Typed raw-value payload. Items OwnsAll checked; reconciliation retains tracked rows. SA-02/03/04/07 persist/preview inconsistencies. |
| Detail | typed lean header/financial snapshot, items, payments/paid state, deliveries and receipts | Explicit projection plus bounded related queries; no per-row query loop. Current field schema matches FE. |
| FK / state | tenant/live Repository scope, customer Individual/Company, distinct units/models/chassis, quotation matching, Bank AllExistAsync, Open edit/delete/cancel | Read checks present. Concurrent state/unit exclusion is not protected (SA-01). No permission API invented. |
| Mapping | One root entity→ListVM map; explicit service projections and aggregate construction | No ReverseMap/extra Ignore; ReconcileOwned custom callback avoids map requirements for item updates. Inherited all-list map lacks receipt outstanding calculation; no current owning FE consumer uses it. |
| Financial save | VAT on document net, discount before VAT, backend schedule and last-row remainder | Correct ownership/basic calculation; tax snapshot update defect and negative last installment remain SA-02/05. |
| Invoice | Open→Invoiced; invoiceDate≥agreementDate, positive unit cost; resolve accounts; save Misc invoice + posted JV + InvoiceId + unit Sold/inactive in explicit transaction | Customer debit; revenue/VAT credits; cost debit/stock credit. Catch posting failure rollback. No forbidden migration/source changes; concurrency SA-01. |
| Deliver | Invoiced→Delivered; date≥invoice date; per-unit SDN; unit Delivered | Typed dialog and backend service counterpart. Duplicate prevention concurrent gap SA-01. |
| Close | Delivered and received≥total→Closed | UI requires outstanding===0, backend rechecks receipts; receipt void/unvoid integration findings are root-owned. |
| Delete/Cancel | Open, no live agreement receipt; release units; quote→CustomerApproved; Delete removes owned rows; Cancel stores reason | Reusable delete confirmation / typed reason dialog. Backend guards current state once; concurrent races remain. Quote receipt eligibility is kept as frozen D7, not reinterpreted. |

## Conformance evidence and source reconciliation

| Concern | Book / actual reference symbol | Shared owner | Target comparison |
|---|---|---|---|
| List layout, filters/grid | UI1/4/6; Job list bounded wrapper and fill table | styles.scss, FeatureTitle, FilterPanel, DataTable | Target uses same sigma-route-host/list chain; no list SCSS; fill=true, four filters, fixed paginator. Source matched. |
| Routed form | UI1/13; Job editor form/body/scroll/footer | styles.scss, FormSection | Target uses one scroll pane and fixed footer. Several tabs are valid existing domain groups; no need to copy Job's owner-specific three-pane layout. |
| Child rows | UI14; Job editor EditableRows / projected row cells | EditableRows, EditableCollectionTable | Unit collection uses helper and stable control objects. Payment/document management has custom paths and lifecycle issues; no false blanket match. |
| Modes / saved labels | UI15/16; Job view mode and lookup-specific loading | typed detail/lookup boundaries | Save absent in View, read text identity, edit-only lookups skipped. Quote/receipt field-lock differences SA-07/C4. |
| Dirty exit / uploads | UI10/18; Job editor canDeactivate; DocumentUploadTracker | ConfirmationDialog, upload tracker | Target confirmation exists but busy guard/discard/cleanup retry do not match. SA-06. |
| Action dialog | UI13/19; Job close-job app-editor-dialog with typed form and padded body | EditorDialog, FieldError, DatePicker | Translated title + record subtitle; contentPadded=true; saving/confirmation guards; missing size/inner scroll strategy SA-C1. |
| Failure / requests | UI22/28; Job list stream and skip header | interceptor + apiErrorMessage | List/details matched; preload/lookups double presentation SA-C2. |
| Print | UI21; shared ReportPrintService and sigma-print-flow release | ReportPrintService + shared styles | All editor tabs stay mounted; inactive hiding applies only on screen. Actual printing/page breaks/logo not verified. |
| Totals | UI24; SummaryCards density/layout public inputs | SummaryCards | Target dense/row/min140, no maxHeight; source shared owner matched. Owner's Workshop slim preference is not assumed universal. |

No source was changed. BE scoped diff is empty; frontend complete three-line diff reviewed and source files read, including current models/templates. No merge markers or whitespace errors found in the owning diff. Suggested commits/new migration are **not applicable to this read-only audit**. Root confirms the preexisting owner-created `20261004014650_SalesCycleCompletion` migration exists; its applied database state is Unknown. Do not generate a duplicate from the historical frozen artifact. No migration was opened, generated, edited or run by this agent. Root owns final version/prohibited-command reconciliation.

Manual owner verification after an authorized fix: reserve one unit concurrently; invoice/deliver one agreement concurrently; edit a direct agreement after a tax-setting change; switch a retained row's unit; preserve an overridden due date after price change; exercise tiny remaining balance/many installments; leave during Save/upload and retry cleanup failure; force quotation preload failure and Retry; inspect Deliver on short/narrow screens, plus RTL/dark/print. No runtime pass is implied.

Agent utilization: bounded inherited-model read-only agreement audit delegated by root after frozen contract/drift gate. No further subagents; all source ownership preserved. Report integration and overall closure remain root-owned.
