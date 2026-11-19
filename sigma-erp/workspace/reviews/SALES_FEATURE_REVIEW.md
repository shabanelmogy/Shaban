# Sales Feature Review — current review 2026-10-26

> Current financial completion: see SALES_EQUIPMENT_FINANCIAL_COMPLETION_FEATURE_REVIEW.md and its frozen contract. Used-fleet carrying-value preparation, staged tax reconciliation and actual approved collection are now implemented in source; prior financial deferrals are superseded. Schema/build/runtime acceptance remains pending.

## Complete cycle reformulation — researched scope and implemented slice, 2026-10-27

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Scope | Confirmed operational/read/cost-validation slice of the complete reformulation; full financial redesign remains open |
| Current plan / freeze | SALES_EQUIPMENT_RENTAL_REDESIGN_MAINTENANCE_EVOLUTION_PLAN.md |

Owner asks to revisit the guessed Sales cycle, research Speed, and implement the correct cycle; later asks for complete reformulation. Screenshot111 confirms the reference Sales menu has Fleet, Sales Quotation, Sales Agreement, Due Installments and Settings. It is functional navigation evidence, not proof of journal/ownership timing. Public Speed CRS/VLS evidence explicitly describes Sales Orders as customer POs; the prior suggestion that this name must represent an internal rental execution order is superseded. No public asset-sale or equipment-specific step-by-step manual was found. The complete plan records commercial commitments, supplier procurement, physical custody, invoices and receipts separately, with primary-source links and remaining decisions. Existing actual-unit Sales and internal rental execution owners are retained rather than duplicated or silently removed.

### Confirmed implementation and contracts

- SalesAgreementService.InvoiceCore computes the actual reserved unit set whose cost will post after knowing whether the invoice completes billing, validates positive rounded cost before any save, then reuses exactly that set in the journal. This fixes an amount invoice that completes billing bypassing the cost guard. Completion also posts every still-reserved unit's cost when selected-unit invoicing finishes a balance after earlier amount stages; already Sold/Delivered unit costs are not repeated. No new account, tax, sale-state or posting-time policy was introduced.
- SalesAgreementDetailVM.CanDeliverAll and SalesAgreementItemDetailVM.CanDeliver are additive read-only capabilities. Exact current equipment state, prior delivery item/equipment IDs, full/partial billed totals, linked/legacy invoices and posted/nonvoided journals determine eligible lines. A partly invoiced line must have posted unit allocation and no unposted allocating invoice; full billing requires all related invoices posted. No chassis-label matching or client-writable capability is used. Writer guards remain authoritative.
- The existing action dialog consumes explicit capabilities, supports partial selection after full/final/legacy billing, omits already delivered units and blocks empty eligibility. Empty selection means all remaining units only when CanDeliverAll=true; partial delivery requires a current nonempty unique subset. Missing fields fail closed, so deploy backend before frontend. Existing invoice selection behavior is preserved.
- Master agreement's old generic relationship action is labelled Customer POs (Sales Orders) / أوامر شراء العميل, with an explicit explanation that linking a recorded document does not create supplier procurement, a physical sale or an internal rental order. Endpoints/IDs/relations/amount semantics are unchanged. No automatic spending cap or new customer-order creation workflow is invented.
- Existing /UserGuide/sales and /UserGuide/equipment-rental topics now explain the complete responsibilities, request source, expected installment vs actual receipt, full/partial delivery choices, and cost requirement when any invoice basis completes billing. Guides describe current behavior, not an implemented depreciation-disposal integration.

Backend scope: SalesAgreementService.cs; ViewModels/SalesAgreement/SalesAgreementDetailVm.cs and ViewModels/SalesAgreementItem/SalesAgreementItemDetailVm.cs (Git filename casing is Vm, class is VM). Frontend scope: SalesAgreement/models/details.ts and components/action-dialog/action-dialog.component.ts; existing MA sales-orders HTML; equipment-rental-orders.ts and en/ar vocabulary; both owning guides. No entity/config/controller/action route, mapping or Add/Update payload change. Explicit service projection owns the new DTO fields; existing project references and namespace imports resolve to those producers. Existing pending AsSplitQuery, Sales UI/cache/loading, guide and unrelated repository changes were preserved.

### Loading, cache, query, index and shared-owner evidence

Actual /SalesAgreement route loads SalesAgreement_Routes -> list/routed details and controlled action dialog. getDetail still calls GET SalesAgreement/GetByWithNavigationsId/{id}; the dialog's subscribed Subject/switchMap/defer sets local unitOptionsLoading, finalize releases it on failure/replacement/close/destroy, target and saved-ID checks reject late results. Mounted ReferenceLookupStatus loadingScope=dialog renders inside the body-appended EditorDialog; no global read lease behind it. Empty/error/Retry and busy/close/dirty guards are retained. Invoice/deliver writes still own one global LoadingService pair and shared shell visibility; no showPageLoading route override added. This is source evidence; runtime overlap/visibility remains pending.

Operational detail, eligibility, invoices and notes stay direct; no new cache/watch/invalidation or approved reference source was introduced. Existing full Sales and Equipment Rental cache inventories remain applicable to unchanged Customer/Branch finite bootstrap, separate watch, selected-label/draft retention, context clearing/Retry and teardown. The MA relationship remains a direct same-customer read with local StateMessage/finalize/version/identity fences. Its previously recorded all-options materialization remains a volume risk, not fixed by renaming it.

Backend detail retains bounded root/line/payment, documents, invoice links, optional legacy invoice, receipts and delivery-note reads. Eligibility adds at most one batched posted-invoice-ID query using the relevant saved IDs, not one query per unit. Existing note projection adds two internal scalar source IDs, then maps the same output DTO; no new exposed historical graph. No parallel EF or financial cache. Existing declared SalesAgreementInvoice(SubscriptionId, SalesAgreementId), unique MiscellaneousInvoiceId and conventional agreement/unit/note/invoice FK/PK coverage are the first plan checks. No new index justified for this bounded ID-set change; adding a redundant composite/covering index without plans would add write/storage costs. Actual deployed coverage and SQL translation remain unknown.

Owner performance checks: same tenant, same invoice/note/history distribution, 1/50/200 units, cold/warm approved reference cache and identical network; compare initial editor and action detail, posted-eligibility SQL count/reads/plans, payload and rendered rows, full/partial/legacy selections and failures. No measured timing or query-plan improvement claimed. Loading/cache correctness does not prove speed.

Shared conformance: current type09 EditorDialog/ReferenceLookupStatus/FieldError/StateMessage and installed MultiSelect own the interaction; no new wrapper, palette, layout stylesheet or opt-in owner. Existing MA relationship shell/Table remain, with one shared-help text. No new general reusable rule was established, so canonical books/skill/packets did not need edits/regeneration. PLAN00 plus applicable00/01/03/04/06 were used after all8 checks; list/schema/new route phases skipped because those contracts did not change.

### Source verification and remaining complete-redesign boundaries

Roslyn parsed all three backend files with zero syntax errors; project/namespace/source inclusion inspected. TypeScript/Angular parsing passed for seven scoped source/vocabulary/guide files and two templates, with all four new literal keys in both languages; broader existing equipment-source audit passed50 TS/16 HTML, imports/duplicates/literal translations. Complete task hunks and prior scoped changes reviewed separately in actual repositories; scoped whitespace checks pass, with CRLF advisories only. This is not compilation, a test run, runtime/SQL/accounting acceptance or deployed schema verification.

No new migration needed for this slice. Prior pending migrations remain separate. No build/test/lint/browser/database/migration/snapshot/commit/push/deployment or external account/mutation used. Two bounded agents: one public primary-document research, one Sales audit then isolated FE model/dialog worker after root freeze; inherited models, nonoverlapping files. Root integrated backend/semantic/guide work and final source review. Suggested backend commit: fix(sales): reconcile delivery eligibility and completion costs. Suggested frontend commit: fix(sales): clarify order responsibilities and eligible deliveries.

Remaining: cross-invoice VAT rounding policy was not approved by the owner's request for a complete reformulation; examples1000.04/1000.08 at15% can leave/overrun0.01 under current independent rounding. No hidden balancing/rewriting was implemented. For a rental operator the recommended primary sale scenario is end-of-use fleet sale, with a distinct trade-stock route where needed; current Equipment has no verified Asset identity/depreciation/disposal link, while Asset review already records missing disposal workflow. Complete financial reformulation must freeze carrying-value provenance, held-for-sale transfer vs disposal, effective control/tax dates, accounts/correction and rental posting/settlement; stock credit at original purchase price is not silently declared correct for a depreciated asset. See the plan for primary IAS16 evidence and bounded source findings. No overall financial completion is claimed.

Later owner accepts the primary used-fleet scenario. Further current Asset/Depreciation source audit confirms that scheduled monthly book values are not automatically ledger-effective: same-period snapshots lack linked-journal effectiveness filtering, prior periods may be missing, and no unit-to-asset/disposal identity exists. The new plan records the proposed return -> verified valuation -> held-for-sale transfer -> sale flow and exact unresolved financial contracts. Only that financial integration is Blocked; no assertion that the full redesign was implemented. Final incremental parse after the latest guide/eligibility edits again passed three C# files and the changed Sales guide; scoped repository whitespace checks passed using Git's actual Vm filename casing. No additional application files or schema changes followed this investigation.

## Later Fleet source-only review — 2026-10-26

Owner requested a fresh review of Sales Fleet after the presentation follow-ups, then authorized fixing the findings. Current evidence and execution are in `SALES_FLEET_REVIEW_EVIDENCE.md`, with scope/implementation amendment frozen in `SALES_FLEET_CURRENT_REVIEW_CONTRACT_FREEZE.md`. The three confirmed findings (reused editor ID lifetime, inactive-only query-state restoration and Media cleanup progress ownership) are implemented/source-reconciled, including recovery if a completed exit is cancelled by a later guard. Reserved-unit inactivity and exact text lengths remain explicit business/data-contract decisions. Prior S26 fixes preserved. Existing Sales guide Fleet notes updated in EN/AR; runtime/performance acceptance remains pending.

## Owner SalesAgreement inline filter actions — 2026-10-26

Frozen Tier S owner request: same inline Search/Reset/Excel placement as the reviewed quotation list. Active `/SalesAgreement` loads `SalesAgreement_Routes` → `SalesAgreementsComponent`; type02 list/editor with unchanged backend aggregate/read contracts. UI4's validated inline-actions contract and actual shared FilterPanelComponent own mainColumns=4, inlineActions=true, inlineActionCaption=general.actions with existing stableLayout=true. Shared caption/4px gap aligns actions to the control line independently of feedback; existing FieldError reserves date and numeric customer feedback. Four fields, validators, accessible labels, search/reset/export handlers, busy/loading, route restoration and applied paging/output query remain. No advanced template exists. Shared responsiveColumns=4 moves actions below fields at <=1365px and stacks fields at <=720px; existing collapse, RTL/theme and wrapping remain. No feature CSS/shared implementation or new canonical rule needed.

Existing Sales cache/loading/performance matrices below remain applicable: no consumed URL/query boundary, cache source/watch/invalidation, subscription/finalizer or progress host changed. No new index justified and no measured timing claim for this layout-only delta. All8 recipe checks passed before proportional Phase02/06 use; backend/write/domain phases not applicable. Existing `/UserGuide/sales` agreement topic updated in EN/AR. No agents needed for this small sequential change; no generated packet changes required. Angular template and TypeScript guide syntax parsing passed with zero errors; scoped whitespace check and complete scoped source diff review passed, preserving earlier changes. Status: Implemented — source-only; runtime/visual/narrow/RTL/theme acceptance remains pending for owner. No prohibited command or migration. Suggested FE commit: `style(sales): align agreement actions beside filters`.

## Owner SalesQuotation inline filter actions — 2026-10-26

Frozen Tier S owner placement: put the list's Search, Reset and Excel actions beside its filters. Active `/SalesQuotation` routes through `SalesQuotation_Routes` to `SalesQuotationsComponent`; type02 list/editor and current backend aggregate/read contracts remain. UI4's explicit validated-inline-action contract owns this adjustment: existing shared FilterPanel uses stableLayout=true, mainColumns=4, inlineActions=true and inlineActionCaption=general.actions. Shared CSS top-aligns fields/toolbar and reserves the same invisible caption/4px control gap for action alignment while validation feedback stays below. Reserve the customer numeric feedback using the existing FieldError owner. The four fields, labels, validators, button handlers/disabled/loading, mandatory shared Reset and form submit remain. Existing shared responsiveColumns=4 moves actions below the full-width grid at <=1365px and stacks fields at <=720px; no feature CSS or shared rule change.

Existing current Sales cache/loading/performance evidence below still applies: no URL, query, cache owner/watch/invalidation, subscribed request/finalizer, page visibility host or applied paging/export contract changes. No new index or timing improvement is justified/claimed for layout alone. All8 recipe checks passed before Phase02/06 use; backend/write/domain work skipped. Existing `/UserGuide/sales` quotation topic updated in EN/AR. No new canonical rule/packet regeneration or agents needed. Angular template and TypeScript guide syntax parsing passed with zero errors, scoped whitespace checks and complete source diff review passed, preserving prior Sales/Fleet work. Status: Implemented — source-only; visual/narrow/RTL/theme acceptance remains owner-pending. No prohibited command or migration. Suggested FE commit: `style(sales): align quotation actions beside filters`.

## Owner Fleet filter alignment — 2026-10-26

Frozen Tier S layout follow-up after owner clarification: align the existing first-row filters vertically, retaining the main/More filters arrangement. Actual `/Fleet` loads `Sales/Fleet/fleet.routes.ts` → `FleetComponent`; UI type02 list with routed editor, existing backend aggregate/read contract unchanged. UI4 and the actual `Workshop/Job/components/list` reference select the existing shared `FilterPanelComponent`. Existing default align-items:end offsets fields without feedback against the model field's reserved FieldError host. Adopt `stableLayout=true`: shared align-items:start aligns label/control starts, bounds PrimeNG hosts/labels and retains validation reserves. Preserve the original five main fields, advanced template, advanced directive/state/open-before-focus behavior, field IDs, validators, values, reset/search, applied-route filters, paging and outputs. No shared CSS, API, canonical-rule or generated-packet change is needed. Existing columns, responsive breakpoints, narrow collapse, RTL/theme and action row remain.

Existing current Sales cache/loading/performance matrices below remain applicable: no service URL, query boundary, cache owner/watch/invalidation, request subscription/finalizer or visible progress owner changed. No query/index change is justified for a presentation-only adjustment and no measured speed claim is made. Initial recipe check passed all8 packets; Phase02 existing grid and Phase06 source reconciliation apply proportionally, backend/write/domain phases skipped. Existing `/UserGuide/sales` Fleet step updated in both languages. No agents needed for this bounded layout change. Angular template and TypeScript syntax parsing passed for all three inspected files; scoped whitespace checks and complete source diff review passed, preserving prior Sales work. Final incremental application delta is one stableLayout input and the EN/AR guide step; list TypeScript returned to its pre-follow-up state. Status: Implemented — source-only; runtime/narrow/RTL/theme acceptance remains owner-pending. No prohibited command, migration or commit run. Suggested FE commit: `fix(sales): align fleet filter controls`.

## Current Sales menu review and implementation — 2026-10-26

Owner requests current document-based review **and execution of confirmed
findings**. This section supersedes historical read-only dispositions below for
the current slice. Status: confirmed fixes implemented and source-reconciled;
owner runtime pending.
Frozen handoff: SALES_CURRENT_REVIEW_CONTRACT_FREEZE.md; tier L continuation in
SALES_MAINTENANCE_EVOLUTION_PLAN.md. No screenshot/new business requirement.

### Manifest, shapes and execution boundary

Actual sidebar declares /Fleet, /SalesQuotation, /SalesAgreement,
/DueInstallments and /UserGuide/sales. pages/routing.ts loads the corresponding
Sales routes; routed Create/View/Edit editors in all three records, legacy
details aliases preserved. Fleet owns Documents/Warranties, Quotation items +
totals/approval, Agreement items/payments/documents/invoices: type02, references
Job list/editor and shared EditorDialog/EditableCollectionTable. Domain action
windows type09; Due uses UI07 report shell with existing frozen server-paged
exception, full filtered totals and all-pages output. BE13/14 aggregates and
BE17 report, financial actions retain BE15 and current partial-invoice contract.

Current cycle/fix contracts retain per-line quotation VAT's recorded transitional
exception, stored agreement rate, minor-unit floor/installment remainder,
quotation-owned terms, ordinary receipts, unit reservations, concurrency/period/
accounting guards and partial-invoice/partial-delivery authority. No historical
unresolved document is treated as a new business requirement. AuthGuard is
authentication; no new permission engine or access rule is invented.

Initial scoped Sales UI/guide and Sales/Equipment backend source clean; unrelated
shared/Customers/Suppliers/Staff/Receipt work preserved. Repositories are the FE
and backend checkouts, not workspace root. Root owns contracts, Agreement/Due,
guide/providers/docs/backend integration and final diff; independent quotation,
Fleet and backend audits use bounded non-overlapping scopes. No build, tests,
lint, browser/runtime, database, migrations, snapshots, commit/push/deploy,
Graphify or Sigma MCP. All8 packet -Check passed before use; relevant PLAN00 and
PHASE00–06 apply only to current owned paths.

### Current confirmed findings / work

| ID | Actual source / confirmed defect | Authorized fix |
|---|---|---|
| S26-01 | Required list/editor/filter lookup pending flags are not registered to page loading; routed detail local StateMessages coexist with global reads; masks remain enabled | Existing always-mounted ReferenceLookupStatus with aggregate finite/watch flags, no per-field/page-local duplicate visual; preserve busy/error/Retry, finalize/cancel and explicit page mask suppression |
| S26-02 | SalesAgreement/SalesQuotation raw Customer/GetSelect bypass CustomerService.cacheSelect=true; Due finite source read lacks watch; Fleet Branch consumer adoption checked separately | Real source service, finite successful bootstrap, separate once-bound ReferenceLookupBindings with selected/current getters/context clearing/errorRetry/destroy. No new source opt-in or financial/availability cache |
| S26-03 | DueInstallments.output() fetchAllPages has local outputLoading only, no page count | Subscribed defer startLoading/finalize endLoading around the complete read; preserve applied query/full print/export and errors |
| S26-04 | Agreement action-dialog getDetail ignores Result failure, clears silently on transport failure, lacks Retry and can apply an old response after target replacement/close; loading text inside fields | Cancellable Subject/switchMap, target identity/id checks, one local shared status with errors/Retry and submit guard; unchanged command/payload/eligibility |
| S26-05 | LayoutModule redundantly provides the root Sales services (Agreement three entries); several Agreement/Due actual Int32 controls lack shared transport validation | Scoped provider/import removal only; int32ValueValidator with FieldError/focus, existing business bounds/requiredness retained |
| S26-06 | EquipmentService.GetManyAsync omits incoming grid while reconstructing normalized filters, so Fleet column menus do not constrain count/page/export | Encoded grid retained before existing ListQuery/ApplyGridFilters; same whitelist/parser/sort/count/page clamp and DTO |
| S26-07 | LoadAggregateAsync joins items, payments and invoice/item collections, risking a cross product | Existing tracked helper uses AsSplitQuery inside unchanged SalesAgreement lock/transaction; same children/state/tenant contract |
| S26-08 | Amount validation error can survive changing invoice basis; several numeric transports lack shared finite/Int32 validation | Amount required/finite/min only for amount basis; obsolete errors cleared on basis change. Shared FieldError and first-invalid focus; integer IDs/year/warranty/count and finite costs/prices checked without changing business bounds |
| S26-09 | Shared consumed DocumentCurrency has direct unowned reads and uncancelled replaced partner contexts | Existing shared ReferenceLookupStatus with page/dialog scope, aggregate loading/aria-busy, unsubscribe + version fence/destroy, inline partner failure/Retry and unchanged optional base-policy fallback/global feedback |

All S26-01–09 are implemented in the frozen scope. Root reviewed complete
scoped diffs; peer source audit caught Due's missing read Retry, now implemented
for the **same failed report/print/export operation** and applied query. No write
is automatically retried. Historical rounds remain labelled evidence; old line
anchors/statuses are not current rules.

### Grid, filter, editor and action contract reconciliation

| Screen | Actual columns in order / backend properties | Filters / preserved transport |
|---|---|---|
| Fleet | Actions then plateNo,make,model,vehicleType,interiorColor,isActive,saleStatus,branch,chassisNo,engineNo,purchaseDate(date),purchaseCost(money). EquipmentListVM is Id + exactly these properties | Filters[plateNo,chassisNo,carModelId,isActive,saleStatus,interiorColor,vehicleTypeId,branchId,sortField,sortOrder,grid]; default active, default branch, server count/page/clamp; real false/zero preserved and null omitted |
| Quotation | Actions; no,date(date),validUntil(date),customerName,customerCode,amount(money),status. SalesQuotationListVM Id + those seven fields | Filters[no,customerId,dateFrom,dateTo,status,sortField,sortOrder,grid]; current month/typed optional date range, applied query preserved through route/page/export |
| Agreement | Actions; no,date(date),customerName,customerCode,totalCharges(money),outstandingAmount(money),status. SalesAgreementListVM Id + those seven fields | Same list transport, current month/customer/status; server-corrected page and saved return query preserved |
| Due | agreementNo,customerName,plateNo,srNo(nonfilterable),type(enum label),dueDate(date),amount/paidAmount/remainingAmount(money),status(derived badge with displayStatus alias),overdueDays(number),chequeNo,bankName. Response Identities paymentId+agreementId and these13 fields | fromDate/toDate/customerId/agreementNo/includePaid/pageNo/pageSize/sortField/sortOrder plus Filters[grid]; current month/unpaid, server clamped page≤100, totals over full filtered scope, sequential all-pages print/Excel |

No ListVM/DTO/map/write payload change. The three record editors retain saved
owned IDs/full snapshots and explicit client-owned fields. Fleet detail uses
Documents/Warranties, shared EditableRows/FileField/DocumentUploadTracker and
cleanup-only recovery. Quotation keeps model quantity/prices, saved rate and
status-owned controls. Agreement keeps actual unit IDs, server-owned totals/
schedule amounts, editable schedule date/cheque/bank overrides and financial/
quotation locks; client previews never replace server authority. Int32/finite
transport validators do not invent positive signs, requiredness or money scale.

Actions: Fleet View/Edit/Delete/Create/Print/Excel and nested Make/Model create;
Quotation View/Edit/Delete/Print, internal/customer approve/reject, revise,
unapprove, receipt and agreement navigation; Agreement View/Edit/Delete/Print,
receipt, invoice, deliver, close/cancel; Due Search/Reset/Print/Excel. Visibility,
reason/date inputs, confirmation, busy/dirty/cleanup and authoritative backend
state/period/receipt/unit/transaction restrictions retained. Receipt inputs match
the actual embedded modal's salesAgreementId/quotationId, agreementNo and
saved/closed outputs; unrelated Receipt implementation is preserved. No new
authorization grants. Approval's existing two-stage Sales contract is retained,
not replaced with an unrelated one-stage generic cycle.

Override audit (existing reasons retained; only grid forwarding/helper query
strategy changed):

| Owner | Actual overrides | Feature-specific reason / disposition |
|---|---|---|
| EquipmentService | GetManyAsync | Existing screen filters/sort/page clamp/lean projection; reserved grid now retained before shared membership/count/page |
| EquipmentService | DetailAsync, DetailWithNavigationsAsync | Same explicit owned-detail projection instead of generic recursive graph |
| EquipmentService | AddAsync, UpdateAsync, UpdateCoreAsync, HandleActiveAsync, RemoveAsync | Tenant Equipment/Sales lock, real unit identity/dependency/sold-cost/activity and owned snapshot/deletion rules; preserved |
| SalesQuotationService | AddAsync, UpdateAsync, RemoveAsync | Quotation items/tax/terms, child IDs/soft-deleted snapshots, status/concurrency and downstream dependency guards |
| SalesQuotationService | DetailAsync, DetailWithNavigationsAsync, GetManyAsync, GetManyWithNavigationsAsync | Explicit projection/derived amount, list filters/order/page/count and bounded response; retained |
| SalesAgreementService | AddAsync, UpdateAsync, UpdateCoreAsync, RemoveAsync | Existing tenant sales transaction, actual units/source quotation/receipt locks and server schedule/financial snapshots |
| SalesAgreementService | DetailAsync, DetailWithNavigationsAsync | BuildDetail explicit complete record/currency compatibility/invoice/receipt/delivery and derived paid schedule |
| SalesAgreementService | GetManyAsync, GetManyWithNavigationsAsync, SearchColumns, ApplyListFilters, ApplyListOrder, GridFilterProjection, MaterializeListAsync | Existing source-mapped scalar search/status/money/paid fields, consistent filter/count/page/order/projection; no competing read filter engine |
| SalesQuotationController | GetListAsync | Existing quotation-specific list boundary/validation; ordinary actions stay explicit endpoints. Equipment/SalesAgreement controllers expose existing base/list and declared domain actions without new overrides |

No new override, mapper or controller/HTTP contract introduced by this slice.

### Final per-source cache gate

URLs below append to environment.baseUrl; the endpoint path and actual typed
source are recorded instead of a deployment-specific host. All list lookups use
Results<DropDownSelect>; optional common/policy reads keep Result/entity contracts.

| Actual consumed URL / service | Classification / producer evidence | Final consumer/lifetime evidence |
|---|---|---|
| Customer/GetSelect — CustomerService, through SalesQuotationService/SalesAgreementService adapters and directly in Due | Approved cacheSelect=true; Company/Individual typed writes and inherited delete invalidate Customer dependency; positive persisted company/individual imports invalidate Customer; lookup-customers post-commit tenant topic covers Company/Individual | Quotation/Agreement lists+editors and Due finite successful bootstrap then separate typed watchCustomers/watchSelectList into once-bound ReferenceLookupBindings. Current selected-ID/current-option getters, selected-only bootstrap retention, rows-direct apply on context clearing, errors/Retry/destroy; retained refresh silent |
| Branch/GetSelect — BranchService | Approved cacheSelect=true; createBranch/updateBranch/inherited delete hooks invalidate on success, lookup-branches committed topic | Fleet list+editor same finite/bootstrap/watch chain. Bootstrap marker skips repeat Branch read when another direct source fails; detail-label merge occurs once, never in the watch callback or direct-only Retry after context clear |
| CarMake/GetSelect — CarMakeService | Direct reference, no cache opt-in | Fleet finite editor batch; existing catalog create/reload/recovery retained, no invented watch/topic obligation |
| CarModel/GetSelect — SalesQuotationService; CarModel/GetMakeAndModel — CarModelService; CarModel — FleetService.getCarModels | Direct no-opt-in reference/custom/unpaged sources | Quotation models, Fleet filter make/model options and editor full typed model+make collection keep exact source/shape; failed direct reads Retry, saved labels and destroy remain. No new cache eligibility or fake list adapter |
| VehicleType/GetSelect — VehicleTypeService; Bank/GetSelect — SalesAgreementService | Direct references with no source opt-in | Finite Fleet/Agreement reads, existing errors/Retry/selected saved labels retained; no watch obligation invented |
| SettingsCommonModel/GetMySetting — CommonSettingsService via TaxSettingsService.load | Explicit singleton cache exception: success/entity only, same URL invalidation on successful settings writes and settings-common committed tenant topic | Finite optional tax-default read, page pending registered; no persistent settings watch changes an open document. Existing fallback and saved/pristine-rate behavior retained |
| Currency/GetFinancialNumberPolicy — FinancialNumberPolicyService.load | Existing direct policy service/replay contract and successful Currency writer invalidate; excluded from reference caching | Agreement preview/shared DocumentCurrency retain matching global feedback mode/coalescing, optional fallback, subscribed loading flags/finalize/destroy; no reference/precision watch |
| Partner/GetByWithNavigationsId/{id} — PartnerCurrencyLookupService; Supplier/GetByWithNavigationsId/{id} — SupplierService (shared currency owner) | Direct operational detail enrichment; no reference opt-in | Existing saved-code/base/preference precedence; actual pending page/default or inherited dialog owner. Replaced context unsubscribed + version fence; inline partner Result/HTTP failure and Retry; no parent form mutation |
| Equipment list/detail, SalesQuotation list/detail/actions, SalesAgreement list/detail/available-units/actions, SalesAgreement/due-installments, nested CarMake/CarModel writes | Direct operational/availability/financial/state contracts | Existing fresh reads/writers and finite request lifetimes retained; availability and accounting/policy are never cached merely because GET |

Source producer chain: BaseService → ReferenceLookupCacheService → root
RealtimeService and server AddSigmaRealtime committed tenant definitions; import
operators invalidate only positive persisted outcomes. Consumer bindings start
after finite success, never substitute a permanent replay or form update. Owner
runtime still needs TTL/coalescing, tenant reset/rejoin/partial-import, selected
label and quiet-refresh/network verification. Source adoption is reconciled;
network behavior is not claimed tested.

### Final loading, layout and Angular21 evidence

| Operation | Subscribed owner / visibility / recovery |
|---|---|
| All four initial/filter bootstraps | Mounted ReferenceLookupStatus receives finite loading + no-snapshot binding state and releases its identity lease on finalize/state/destruction. LayoutComponent showPageLoading defaults true for all four routes and renders the shell host. No filter spinner/local page StateMessage; error/Retry remains |
| Page list/detail/report/month/action/delete/save/export reads/writes | Existing global start/finalize/switchMap/destroy retained; Due all-page output now uses subscribed defer start/end. Page masks false and shared primary ring suppression retain busy/disabled. Report Retry uses saved applied query, output Retry its original operation kind |
| Agreement invoice/delivery context | Body-appended EditorDialog with one local ReferenceLookupStatus/StateMessage, target/id Result validation, switchMap/close replacement cancellation, inline errors/Retry and guarded Submit. No hidden page count for its context read; write keeps global count and shared foreground saving host |
| Nested catalog dialogs and shared currency | Existing dialog-local feedback remains; currency uses inherited local status when under EditorDialog, page default otherwise. Saved currency display/parent draft/financial policy unchanged |
| Navigation / overlaps | Shared LoadingService preserves same parsed-path query/fragment updates and resets actual path departure; lookup leases follow consumer destruction. Independent NavigationActivityService write safety remains unchanged. No per-feature timer/loader/skin |

Width source chain: active pages/routing import → sigma-route-host → shared
sigma-list-page/panel or sigma-editor-page/panel and form/body/scroll; Due uses
appReportPage/sigma-report-panel and table fill. Scoped Fleet SCSS contains no
host geometry; Quotation local header/items flex split owns inner panes only,
with print overflow/height release; Agreement active-tab display owns only inner
panels; Due field template/640px checkbox reset stays inside shared strip.
No feature host display:flex row overrides or competing outer width found.
Shared owners in _sigma-content-layout, filter/report/editor/table styles keep
outer edges and internal scroll; actual empty/loading/error/populated widths,
sidebar states/intermediate/narrow/short-height, RTL/LTR/theme/focus/print remain
unmeasured owner acceptance. Source class presence is not a visual pass.

Angular21 adoption: active components use standalone imports, inject/signals/
computed, typed reactive controls and @if/@for; subscriptions use DestroyRef/
takeUntilDestroyed, list requests switchMap and the corrected action context
cancels replacements. Retained @Input/@Output/decorator forms and root Zone/
HttpClient are supported; no blanket experimental Signal Forms/zoneless/OnPush
migration. Only scoped Sales root provider duplicates/imports removed from
LayoutModule; its unrelated providers remain. No route/permission mechanism or
controller response contract changed.

### Performance, query and index handoff

| Actual boundary | Source budget / before-after | Owner measurement / risk |
|---|---|---|
| Fleet list/filter/export | Each page one HTTP, count + bounded projected page. Previously grid discarded, now same shared scalar membership filter before count/order/page and all-page export | Actual filtered SQL/rows/count/last-page clamp/error400 and full export parity; no latency claim |
| Quotation list/detail/save | Count + projected page; explicit detail projection (not recursive) plus optional base-currency compatibility reads. Items tax calls use the existing scoped TaxPolicy snapshot, so not a settings-query N+1 | Cold/warm payload/SQL/CPU, large model/item arrays, saved totals/rates; no new tax cache |
| Agreement list/detail | Count + projected page; BuildDetail explicit header/items/payments, separate documents/invoice-link/receipt/delivery reads, optional legacy/base currency fallbacks. Current invoice-linked schema-read fallback retained | Up to multiple materializations, data-dependent owned records; verify actual EF split/translation/command volume, current partial invoices and totals at volume |
| Agreement writes/actions | Existing LoadAggregateAsync sibling collection join → explicit AsSplitQuery under existing tenant transaction/lock | Removes query-shape Cartesian multiplication; increases separate command count, not a measured speed claim. Verify tracked identity, children/state, lock/isolation/rollback and SQL plan under many items/payments/invoices |
| Due report | SQL full-filtered aggregate totals/count + ordered bounded page, whole-schedule receipt allocation before range/filter retained; output reads successive100-row pages | Actual SQL translation/plan/IO and complete totals/output, deleted/voided receipt and allocation ordering parity; loading change does not measure speed |
| Approved references | Previously raw Customer reads per consumer and missing active watches; source service now coalesces exact approved URL/cache identity with selected options and committed revalidation | Same cold/warm data/cache sample; request count/bytes/TTFB/usable content versus required completion; no claim that fewer source calls proves speed |
| Currency enrichment | Shared broad Partner deep endpoint remains recursive, now replaced contexts unsubscribe and progress/error/Retry owned | Root PK read needs no extra index. A narrow shared currency DTO/endpoint needs a separate cross-consumer contract; do not narrow an existing broad endpoint speculatively. This source-volume risk is explicitly deferred, not claimed optimized |

Exact index evaluation (proposals only; no schema edit/command):

| Workload / existing coverage | Candidate or no-new-index decision | Benefit / overlap / costs / verification |
|---|---|---|
| Fleet optional tenant/branch/activity filters; current SaleStatus and conventional relation indexes | Compare Equipment `(SubscriptionId, BranchId, IsActive, Id)` only if branch-selected plans dominate; optional INCLUDE `(PlateNo, CarModelId, VehicleTypeId, PurchaseDate, PurchaseCost)` only if proven lookup removal | May support that compound predicate, not every optional-filter combination. Partially overlaps FK/sale-status singles; wide include adds storage/write cost. Evaluate existing deployed keys/cardinality/plans before choosing; no filtered live predicate assumed |
| Quotation/Agreement list date/status/number | No new index proposed: existing `(SubscriptionId, Date)`, Status, unique scoped No and agreement quotation indexes are relevant | Contains on number/customer/plate is not made seekable by an ordinary text index. Actual grid-derived expressions and selectivity require SQL plan evidence |
| Due schedule range/allocation; existing payment `(SalesAgreementId, Date)` | No additional index justified before plans; compare existing coverage first, since complete predecessor allocation plus optional filters is not just a simple date seek | Avoid speculative duplicate date/order indexes and costly wide SrNo includes; transformed numeric serial order may still sort. Existing FK/date plan + row counts/IO must establish the bottleneck |
| Receipt agreement collection; existing agreement FK and unique filtered quotation receipt index | Conditional candidate `(SubscriptionId, SalesAgreementId, IsVoided)` INCLUDE `(Amount, SalesQuotationId)`; compare a quotation-led alternative only for a proven dominant join | Could cover live collection sums; FK/index overlap and mutation costs required. No IsDeleted=0 filtered recommendation until actual null/live SQL proves compatibility; deployed manual indexes/stats unknown |
| Partner currency / tracked detail by ID | No new index | PK/owned FK reads; extra indexes cannot solve recursive graph breadth or collection cross products |

Reproducible owner checks: same build/device/network/API+DB/tenant/branch/
language/data snapshot and filter/page; record unit/customer counts, quotation
items, agreement items/payments/invoices/receipts and Due range size. Take five
cold-cache and five warm samples; report each/median, no unsupported percentile.
Separate usable content/required reads, HTTP counts/bytes/TTFB, SQL commands/
logical reads/rows/time/plan and rendering CPU. Compare exact rows/order/totals/
filters/count/page/export, financial/state/tenant history, failure/Retry and
cancellation. No numeric performance target or measured result is claimed.

### Final source reconciliation and deliverables

- Applied discovery/freeze, read/grid, editor/detail, scoped action-context,
  integration and final reconciliation phases; no new accounting/domain schema
  phase or migration. Existing full cycle contracts retained.
- Changed frontend: Fleet4, Quotation5, Agreement list/editor/action/service6,
  Due2, shared DocumentCurrency, scoped Layout providers, Sales guide and paired
  currency-error translations. Backend: EquipmentService + SalesAgreementService
  only (grid forwarding/split query). No DTO/map/entity/configuration change.
- Existing UserGuide/content/sales-guide.ts covers all four topic routes and
  current child windows in Arabic/English. Existing reader and sidebar
  /UserGuide/sales retained; explanation updated for page/dialog loading, quiet
  refresh/selection/Retry and output behavior. No business/API internals inserted.
- Reusable normalized-grid guidance promoted to BE9, shared currency loading to
  UI22, execution skill/digest/history updated together. Generated PLAN00 and
  PHASE00–06 regenerated via generator only; semantic review confirms new
  provenance, existing shared/list/editor/report references, same source-only
  boundary. All8 -Check passes.
- Root reviewed complete scoped FE/backend diffs and shared contracts. Syntax-only
  TypeScript/Angular parsing:22 files +2 inline templates, zero errors; Roslyn
  syntax-only parsing:2 backend files, zero errors. Scoped diff --check passed.
  These do not establish compilation/type safety/runtime or EF translation.
- Bounded luna agents owned Quotation, Fleet and backend discovery; after root
  shared freeze, the two UI agents implemented only their module files. Root
  integrated cache/context corrections, owned backend fixes and final report.
  Peer source audit of Agreement/Due/currency found the now-fixed missing Due
  Retry. Non-overlap reduced repeated scans; root retains final accountability.
- No Add-Migration required by these changes. Historic Sales partial-invoice /
  concurrency schema handoffs remain owner work; database application unknown.
  No prohibited execution performed. Runtime/cache/DI/visual, SQL/EF/concurrency/
  accounting acceptance remains owner-pending; broad Partner currency endpoint
  risk explicitly deferred to a cross-consumer API contract.
- Suggested FE commit: `fix(sales): unify read progress and reactive reference consumers`.
  Suggested BE commit: `fix(sales): preserve fleet grid rules and split aggregate reads`.
  Suggestions only; no commit/push executed.

## Historical reviews and evidence — 2026-10-04 onward

> **Current review: Round 3 below, 2026-10-04.** Earlier rounds and their anchors are historical evidence. Round 3 assesses the owner's latest changes against `SALES_REVIEW_FIXES_CONTRACT_FREEZE.md`, including its recorded follow-ups; its dispositions supersede the Round 2 priority table. Fixed means the reported trigger is addressed in source; owner runtime verification remains pending.

| Field | Value |
|---|---|
| Status | Draft |
| Owner verification pending | yes |
| Scope | Read-only review of SiGmaAngularFrontEnd/src/app/modules/Sales and directly owning backend/API and existing Receipt/invoice integrations |
| User request | راجع : src\app\modules\Sales |
| Source changes authorized | No; current task is an unqualified review |
| Canonical authority | F:/My Work/Sigma/AGENTS.md; Master, UI and backend books in F:/My Work/Shaban Documents/Shaban/sigma-erp; sigma-screen-refactor skill |
| Contract baseline | SALES_CYCLE_CONTRACT_FREEZE.md, Frozen 2026-10-03, with its recorded revisions |
| Recipe check | All eight packets OK 2026-10-04 |

## Manifest and evidence boundaries

Current screens: SalesQuotation, SalesAgreement, Fleet, DueInstallments; Sales/shared reason dialog and status mapping. Existing dirty-tree changes include Fleet/quotation/agreement modifications, sale-status model, and removal of standalone quotation-item/agreement-item/payment modules. Their original author is not established in this task; review the current complete source rather than overwriting or reverting them. No new screenshots/videos or business instructions; historical quotation report is background only and its retired guide references are not followed. The older Blocked maintenance plan is historical: the Frozen Sales Cycle contract explicitly resolves its D1–D7 and subsequent decisions.

Selected shapes and references: Quotation and Agreement type02 routed document editors (UI1/13/14, approved Job editor shell and PurchaseOrder aggregate); Agreement invoice action financial pattern BE15. Fleet has two editable collections (Documents and Warranties), so D4-2 selects type02 routed editor, using Job editor/shared routed shell; its current modal is known legacy drift. The initial one-collection classification was corrected after reading both FormArrays (Fleet details TS:130–131). Due Installments is the existing frozen paged operational report exception: UI20 page/grid/totals, paged response retained (not silently changed to a complete array), UI6 server grid and BE17 report projection/read rules. Actions collecting reason/date use type09 shared EditorDialog reference Close Job. Root provider path AppModule interceptor client, root feature services; no authorization mechanism exists beyond authentication/backend validation.

Applicable read-only phases:0 discovery/evidence,1 existing-contract comparison,2 lists/report/filter/paging,3 details/write-model audit,4 action-state audit,5 integration,6 source reconciliation. No new contract freeze or implementation claimed. Builds/tests/lint/runtime/browser/database/migration/commits/pushes/deployment/Graphify/Sigma MCP prohibited under current instructions.

Audit ownership: independent read-only agreement, quotation and Fleet audits use inherited-model subagents; root owns scope, existing frozen contract selection, DueInstallments, cross-service Receipt wiring, routes/translations and integration/reconciliation. Agents may write only their named evidence artifacts and cannot change source. Parallel work reduces elapsed time because owning module files do not overlap; no model override was selected. Main report remains root-owned.

## Findings

Read-only audit completed. Findings remain unimplemented; source-only evidence does not imply runtime acceptance. The priority table below consolidates the bounded reports and root integration audit.


## Prioritized findings

P1 is data/business-integrity risk; P2 is functional correctness or reliable workflow; P3 observations appear in the bounded evidence tables. Concurrent interleavings below are demonstrated from read/write ordering and missing state protection, not executed runtime races.

| ID | Priority | Source evidence | Trigger and consequence | Recommended owning change |
|---|---|---|---|---|
| S01 | P1 | BE SalesAgreementService.cs:56,179,240,288; SalesQuotationService.cs:98,464; EquipmentService.cs:171,187; owning state configs | State checks occur before unprotected writes. Two reservations/invoices/deliveries can pass the same source state; an ordinary stale Equipment update can restore Reserved/active after Sold/inactive; an edit can change an already approved quotation. Number counters protect numbers, not these earlier eligibility reads. | One coordinated atomic/concurrency strategy for aggregate, unit and dependent writers; protect child-only quotation edits as well. Root consolidated SA-01/SQ-02/FLEET-01 without counting the same race twice. |
| S02 | P1 | BE SalesQuotationService.cs:128,156; SalesQuotation.cs:32; Repository.cs:189; SiGmaDbContext.cs:483 | Remove one of two saved gross105 rows, downPayment0, installments2: deleted state is converted to IsDeleted only at Save, after payment recalculation. Saved remaining stays210/perInstallment105 while retained total becomes105; down-payment-over-total validation can pass incorrectly. | Exclude omitted children from the tracked in-memory calculation before the single save. |
| S03 | P1 | BE SalesAgreementService.cs:751,124; FE SalesAgreement details.component.ts:882 | Save direct agreement at5%, change settings15%, edit notes/documents without receipts: backend recalculates at15 while preview uses saved5. | Preserve stored TaxPercent on Update; resolve default on Create only. |
| S04 | P1 | BE ReceiptService.cs:35,59,716–732; ReceiptConfig/SalesAgreementConfig | Two80 receipts against100 outstanding can both pass Sum before either protected write; both saves can produce160 collected. Validation precedes the transaction and does not lock/update the agreement. A delayed request can obtain a fresh unique number after the other commit while retaining its stale balance check. | Include outstanding/state validation and receipt persistence in the same protected agreement collection boundary; a receipt-number guard alone is insufficient. |
| S05 | P1 | BE ReceiptService.cs:379–430; SalesAgreementService.cs:323–336,646–659 | Void the last receipt of a Closed agreement: received decreases and outstanding becomes positive while Status remainsClosed. Unvoid a previously voided receipt after cancel or replacement collection: ToggleVoid bypasses agreement-state/outstanding eligibility and may restore invalid/excess collection. | Reconcile receipt amount/link/remove/void/unvoid with the agreement lifecycle. The exact choice between preventing a reversal and an explicit reopen workflow is Uncertain and must be frozen before implementation; no automatic accounting or state policy was invented. |
| S06 | P1 | BE EquipmentService.cs:195–200; DeliveryNote.cs:32,54; generic parent-only RemoveAsync | Delete a unit with no sales item but a live rental DeliveryNote: only sales references are checked, so it can disappear while rented; Documents/Warranties remain live. | Canonical dependency-aware aggregate deletion with owned children. Scoped manifestation of known BE backlog31/23, not a new generic-engine finding. |
| S07 | P2 | BE SalesAgreementService.cs:109–131 | Keep itemid10, change its unit A→B: release uses omitted item IDs only, so A staysReserved after its link is overwritten. | Release all old-minus-final unit IDs, including substitutions on retained rows. |
| S08 | P2 | BE SalesQuotationItem.cs:19; FE SalesQuotation details.component.ts:202,285 | Two net0.10 lines at5% show document preview0.21 but per-line backend/rows0.22. VAT rounding changes final balance/installments. | Existing per-rate document VAT/allocation owners and backend precision. Known BE backlog24, concrete Sales manifestation. |
| S09 | P2 | FE SalesQuotation details.component.ts:250,260,479 | Initial row snapshots default5 before asynchronous mandatory15 tax settings load; read-only rate remains5 and API rejects Save. | Apply configured defaults to pristine new rows after settings load; preserve saved rates/intentional optional choices. |
| S10 | P2 | FE SalesAgreement details.component.ts:844; BE service:102–127 | Change price/discount after a manual installment-date override: frontend regeneration discards the overridden date even though backend accepts it. | Retain dates by SrNo when date-producing terms have not changed. |
| S11 | P2 | BE SalesAgreement.cs:85; service ValidateFinancials; matching FE preview | Remaining0.04 /6 at2 decimals produces five0.01 rows and last−0.01. Allocation/report cannot classify the negative row consistently. | Amend the frozen rounding formula to guarantee nonnegative amounts (e.g. minor-unit distribution), then update domain and preview together. Current formula is itself deficient; no silent rewrite. |
| S12 | P2 | FE SalesAgreement details.component.ts:577,610,621; Fleet details.component.ts:1196,1210 | Agreement allows route exit while saving and dirty route exit skips discard cleanup; both editors close on cleanup failure, losing retry state and orphaning uploads. | Shared upload/cleanup lifecycle, reject busy exit, preserve failed paths for cleanup-only retry without repeating successful save. |
| S13 | P2 | FE SalesAgreement details.component.ts:789–801; BE service:773–782; Fleet details.component.html:259/BE EquipmentService.cs:164 | Quotation-owned downPayment/count/terms look editable but are overwritten from the quote; sold unit cost looks editable but backend silently retains old posted cost. Root/first-date controls also conflict with receipt financial lock. | Align form read-only states with source ownership; clarify quote terms/date ownership where Frozen wording is ambiguous. |
| S14 | P2 | FE SalesAgreement details.component.ts:403 | Failed source-quotation preload in Create shows Retry, but retry only handles non-null saved agreement recordId. | Retry the actual active source context. |
| S15 | P2 | FE Fleet details.component.ts:961–965; CustomerDocumentAdd/UpdateVM and DateAfter | Document number/issue/expiry are optional in form but required by API; equal dates pass UI but fail strict DateAfter. | Reuse existing shared document validation/presentation; do not weaken backend contract. |
| S16 | P2 | BE EquipmentService.cs:265; EquipmentConfig | Concurrent creates/updates can pass custom duplicate-plate Exists checks; no matching unique plate invariant/guarded write exists. | Normalize and freeze the business key; shared guarded write plus matching index, owner-run schema work if authorized. |
| S17 | P2 | Quotation service:45,90–95/details:419,439,444; Agreement preload/lookups; DueInstallments list:218,222–225 | Detail/lookups have global interceptor error feedback plus local inline warnings/errors without skip header. Required failed lookups also lack useful retry. | One feedback owner, matching suppression option and actual retry; shared service consumers must be reconciled together. |
| S18 | P2 | FE SalesQuotation list.component.ts:305 | Server clamps deleted last page to page2 but UI remainspage3 because returned PageNo is ignored. | Reconcile returned paging/route state. DueInstallments already reads corrected pageNo. |
| S19 | P2 | BE SalesAgreementService.cs:443–480,486–543 | Every paged DueInstallments request materializes all matching agreements, their entire schedules and receipts, then allocates/counts/sums/sorts/pages in memory. Repeated pages recompute everything; pageSize100 does not bound work. | Preserve whole-schedule allocation and full filtered totals while designing bounded/database aggregation/projection; do not replace with a misleading page-only total. Runtime load sizing remains pending. |
| S20 | P2 | BE SalesAgreementService.cs:899; Frozen contract D11 | Allocation orders Date before Type. Moving a down-payment date later than an installment lets the installment receive money first, while D11 describes downPayment first then installment date/SrNo. | Conflicting allocation-order contract; resolve once for details/report/receipt-default consumers before changing financial-derived outputs. |

The bounded reports preserve all exact anchors, reproducible examples and lower-priority conformance findings:

- SALES_AGREEMENT_REVIEW_EVIDENCE.md: SA-01–08 plus SA-C1–6.
- SALES_QUOTATION_REVIEW_EVIDENCE.md: SQ-01–06 and drift tables.
- SALES_FLEET_REVIEW_EVIDENCE.md: FLEET-01–06 and grid/DTO/state/print evidence.

## Grid, ListVM and filter reconciliation

| Surface | Exact displayed column fields, in order (Actions first where present) | Current backend response properties / disposition |
|---|---|---|
| Quotation | Actions; no,date,validUntil,customerName,customerCode,amount,status | id plus exactly those seven columns. Matched. |
| Agreement | Actions; no,date,customerName,customerCode,totalCharges,outstandingAmount,status | id plus exactly those seven columns. Matched. |
| Fleet | Actions; plateNo,make,model,vehicleType,interiorColor,isActive,saleStatus,branch,chassisNo,engineNo,purchaseDate,purchaseCost | id plus displayed fields AND engineCapacity/fuelTankCapacity. Both were removed from grid/Excel in the pending diff but remain in ListVM; print also lacksinteriorColor. Intended content removal is Uncertain, so do not silently narrow API or restore fields without documenting the selected column/output contract. |
| Due Installments | agreementNo,customerName,plateNo,srNo,type,dueDate,amount,paidAmount,remainingAmount,status,overdueDays,chequeNo,bankName | Same13 plus paymentId(dataKey),agreementId(frozen identity). Numeric enums match. Results include items,totalAmount,totalPaidAmount,totalRemainingAmount,totalCount,totalPages,pageNo,pageSize. Totals cover all filtered rows after includePaid, not only page. |

| Surface | Effective filters and serialization | Defaults / validation |
|---|---|---|
| Quotation/Agreement | Filters[no,customerId,dateFrom,dateTo,status,sortField,sortOrder] plus pageNo/pageSize; toListParams; case-insensitive backend dictionary | Currentmonth, page15; deterministic ID ties, switchMap/defer. Quotation invalid typed date-range handling is a lower-priority UI17/19 gap; do not silently drop invalid range. |
| Fleet | Filters[plateNo,chassisNo,interiorColor,branchId,carModelId,vehicleTypeId,isActive,saleStatus,sortField,sortOrder] plus paging | Active=true; page15. False is retained; cleared values omitted. To seeSold/Delivered, clearActive/selectInactive. |
| Due | fromDate,toDate,includePaid,pageNo,pageSize,sortField,sortOrder; customerId/agreementNo only when meaningful | Currentmonth/allcustomers/includePaid=false/page15; backend clamp1–100; inclusiveToDate via next-dayexclusive; client rejects missing/invalid/reversedrange. ToDate9999-12-31 can overflow AddDays(1); boundary validation is an additional low-risk follow-up at service:442. |

DueReport source positives: full schedule allocation before range filtering, receipt source includes quotation and agreement receipts, voided/deleted excluded, authoritative totals and deterministic paymentId ties, both failure channels inline with skiperror header, cancellation via switchMap, balanced loader, applied-query paging and server pageNo correction. It has no Print/Excel promise today; adding complete output requires freezing full-dataset access, never printing/exporting only the page. Customer lookup uses the inherited skipErrorInterceptor option but does not pass it (S17).

## UI and reference conformance

| Concern | Owning book / actual reference | Shared owner / actual result |
|---|---|---|
| List shells | UI1/3/4/6; Job list host/panel/title/filter/fill table | Current Sales lists use shared bounded shell and grid, no feature list SCSS. Exact read contracts above. Source match; visual acceptance pending. |
| Routed documents | UI1/13/14; Job editor | Quotation/Agreement use shared routed form/body/scroll/footer, typed rows and shared SummaryCards; quote item collection/totals/Add placement does not fully match the bounded collection reference. Workshop's user-specific three-pane/slim layout is not automatically copied into Sales. |
| Fleet editor | UI13 D4-2; Job routed editor | Two editable collections demand type02, but current main list opens shared modal with legacy custom controls/file lifecycle. Known legacy shape, not a reason to redefine canonical criteria. |
| Paged report | UI20/6/24; TrialBalance report language, existing BalancesSummary paged transport inspected | Due has correct server paging/totals but uses sigma-list-page/filter shell, not mandatory appReportPage/report strip/action hosts. Existing BalancesSummary reference also still carries list shell; factual source confirms a transitional example, not book conformance. Record drift without changing paging. |
| Action dialog | UI13/19; close-job typed shared EditorDialog | Agreement title/subtitle/failure/save bindings reuse owners; projected zero-basis clipped form lacks documented auto-height versus bounded-inner-scroll strategy, a potential short/narrow content issue pending runtime evidence. Shared reason dialog conforms. |
| Upload/validation | UI17/18/19/22/27/28; shared FileField/FileLink/DocumentUploadTracker/FieldError/DatePicker/global numeric selection | Concrete mismatches S12/S15/S17; Fleet retains bespoke uploads/raw saved paths, picker-only calendars, EnumToArray and local field styles. Quotation lacks first-invalid focus/integer validation; no global numeric-template retrofit is needed because root selection service already covers native/PrimeNG controls. |
| Print/export | UI8/20/21; ReportPrintService/fetchAllPages/shared table output | Quotation/Agreement use shared print and complete-array export. Fleet complete-page loop throws on failure but columns differ and print uses legacy native table; pending-timer/destroy behavior and actual layout are owner checks. |
| Style/theme | UI24/25 | Shared title/table/totals tokens are used by lists and routed documents. Fleet editor palette and sizing remain legacy; source-only inspection does not validate dark/RTL/narrow appearance. |

## Domain, request and action decisions

Existing decisions are audited, not amended:

- Quotation state sequence Pending/Internal/Customer/Converted and internal/customer rejection, revise/unapprove remain the Frozen workflow; CustomerRejected gets no invented revision action. Item standalone CRUD is removed/NonController; agreement children are behind the aggregate.
- Agreement Open→Invoiced→Delivered→Closed; Cancel/Delete onlyOpen with no live agreementreceipt; invoice creates Sales MiscellaneousInvoice and posted balanced JV, requires unitcost>0, makes unitsSold/inactive; delivery creates per-unit SDN. Accounts and period are checked in the invoice transaction. Ordinary Save has no journal effect. Concurrency remains S01.
- Client writes contain editable inputs only; no financial totals/status/tenant/number. Root updateid and saved childids plus full snapshots carry ownership. Server recalculation and tracked child reconciliation exist; specific defects above prevent a blanket conformance claim.
- AutoMapper: explicit one-way mapping/manual aggregate ownership inspected; unnecessary inherited Ignore/read plumbing/redundant forwarding overrides/nested named ItemInput remain structural follow-ups. No map changes in this audit.
- Tenant/authentication: root AppModule has the interceptor-equipped HttpClient; feature URLs use environment.baseUrl; AuthGuard protects layout; API controller authorization inherited. LayoutModule still redundantly provides some Sales root services (including repeated SalesAgreementService); this is known UI1/backlog17 gradual cleanup, not a second HTTP-client finding. No permissions claimed or invented.
- Authorization candidates for future permission work: quotation approve/reject/revise/unapprove/delete; agreement invoice/deliver/close/cancel/delete; Equipment activate/delete; receipt collection/void/unvoid. Endpoint visibility is not authorization. Existing deferred authorization decision is preserved.
- Dates and quoted terms after receipt, allocation ordering, negative-rounding policy and intended removedFleet columns are the explicit Conflicting/Uncertain decisions. Their source/effect is described above; no missing external business evidence is fabricated.

## Routes, translations and integration

Actual page imports and sidebar catalog agree: /SalesQuotation, /SalesAgreement, /Fleet, /DueInstallments. Quotation/Agreement support create/edit/view with dirty guards and historical details alias; Fleet uses current embedded editor with surviving compatibility routes. Removed SalesAgreementItem/Payment and SalesQuotationItem are absent from active routing/provider/explicit compilation references. No dead-module imports were found in scoped current wiring.

ReceiptCreate from SalesAgreement carries salesAgreementId, fetches typed agreement details, forces customer and defaults to first unpaid schedule row. Backend Add/Update enforces current eligible state and outstanding for ordinary saves; the race/reversal gaps remain S04/S05. Receipt persistence returns to /Receipt by current source; no new return-navigation contract was invented. MiscellaneousInvoice Update/Delete protects agreement-owned invoices through IsSalesAgreementInvoiceAsync.

English/Arabic leaf comparison recomputed from current source: Fleet110/110, Quotation113/113, Agreement161/160 (missingArabic salesAgreement.document), Due40/40. All statically used Sales keys resolve in both languages; five enum-root strings are object prefixes with valid descendants, not missing leaf keys. salesAgreement.document is currently unused, so this is minor translation debt, not broken current control text. Historical239-missingFleet-key assertion no longer matches current source and is not carried as a current finding.

## Final source-only reconciliation and handoff

| Check | Result |
|---|---|
| User scope | Read-only current Sales source and directly required dependencies; no application/config/contract/canonical-instruction edits |
| Phases | 0 discovery;1 existing Frozen contract comparison;2 read/report;3 detail/write audit;4 actions;5 integration;6 reconciliation applied as read-only review. Implementation/new plan/contract amendments skipped because not requested. |
| Evidence/diff | Each agent read full owned current source and scoped diffs/newfiles; root reviewed Sales routing/provider diff, Due current source and Receipt integration. Current agreement/quotation owning BE and Receipt scope are clean in Git; existing FE changes preserved. Shared provider/routing unrelated Workshop removals observed but not audited as Sales changes. |
| Static source inspection | 31 non-spec TypeScript files and7 Angular templates parsed with zero syntax diagnostics; scoped Git whitespace/merge-marker inspections clean. No Angular typecheck, C# compile, EF translation/query execution or runtime acceptance implied. |
| API producers/consumers | Lists/write/details/action endpoints and numeric enums match current DTOs; functional/semantic differences remain enumerated instead of falsely marked matched. |
| Migration | Existing20261004014650_SalesCycleCompletion(.cs/.Designer.cs) already present; applied DB state Unknown. No new source/schema changes, so no new Add-Migration recommendation. Do not generate duplicate migration from older pending artifact. A future uniqueplate index may require owner-run migration only after decision/implementation. |
| Files changed by this review | Only reviews/SALES_FEATURE_REVIEW.md and three bounded *_REVIEW_EVIDENCE.md artifacts. Application/frontend/backend files unchanged by all reviewers. |
| Commits | No application commit suggestion for a read-only deliverable. Future authorized fix suggestions only: FE fix(sales): reconcile financial previews and editor recovery; BE fix(sales): protect lifecycle writes and reconcile document calculations. No commit/push run. |
| Agents | Three inherited-model bounded read-only audits (agreement, quotation, Fleet) after existing freeze/drift gate; root integrated and spot-verified high-risk evidence, handled Due/receipts/routes/translations. No overlapping application writes; no further agents. |
| Prohibited execution | No builds/tests/lint/browser/application/database/migrations/snapshot edits/commits/pushes/deployment/Graphify/Sigma MCP. Recipe-check and source parse/read commands only. |

Manual owner verification remains pending. After authorized fixes: concurrent reserve/invoice/deliver/Equipment edit/receipt collections; quotation remove-lines balances and per-rate VAT; edit agreement after setting changes; swap units/release stock; preserve manual due dates and exercise tiny balance/many installments; closed/cancelled receipt reversal policy; delete rented units; mandatory document/date validation; save/upload/discard/cleanup Retry and failed-source Retry; server last-page clamp; high-volume Due report with consistent full-scope totals; complete output columns/RTL/dark/narrow/print. Existing migration application and builds are owner responsibilities. Current review completion does not mean Sales feature readiness or implementation completion.

## Round 2 — owner changes re-reviewed, 2026-10-04

| Field | Current disposition |
|---|---|
| Status | Draft |
| Owner verification pending | yes |
| Request | انا عدلت بعض الملاحظات راجع تانى; كمل |
| Scope | Source-read-only Sales re-review; directly owning Equipment, SalesAgreement, SalesQuotation, Receipt, financial policy, state configurations and output contracts |
| Contract | Existing Frozen cycle, plus Frozen `SALES_REVIEW_FIXES_CONTRACT_FREEZE.md` F1–F13; amendments are acknowledged rather than treating superseded decisions as unresolved |
| Original S01–S20 | 16 Fixed in source; 4 Partial (S01, S05, S12, S19). Fixed is limited to the original trigger and the amended contract; it does not imply all adjacent paths or runtime checks passed |
| Recipe drift | PHASE-01-domain-api, PHASE-03-detail-write and PHASE-04-domain-actions stale; other five packets OK. Canonical owning blocks used. Stale packets need regeneration and semantic review by their owner; none edited here |
| Review write | This report only. No application, configuration, canonical documentation, frozen contract, migration or snapshot edits |

### Original findings: current status and evidence

Paths below are relative to the applicable FE/BE repository. Current line anchors are source-only observations, not executed races.

| ID | Round 2 | Current evidence / practical limit |
|---|---|---|
| S01 | Partial | Agreement add/update/remove/cancel/invoice/deliver/close now take the tenant SalesAgreement application lock (`SalesAgreementService.cs:38–59`). State tokens and forced quotation-root modification protect stale status writes and child-only edits. Equipment uses a different lock, and quotation Unapprove does not participate in the sales lock: R2-02/R2-03 remain. |
| S02 | Fixed | `SalesQuotationService.cs:128–134` removes omitted children from `entity.Items` before recalculation at161. The original removed-line inflation trigger is addressed. |
| S03 | Fixed | Update passes `entity.TaxPercent` to Prepare; `SalesAgreementService.cs:772–785` uses stored rate and resolves settings only without a snapshot. |
| S04 | Fixed | Direct linked collections now open a transaction and acquire the SalesAgreement lock before balance/state validation (`ReceiptService.cs:30–44,106–124`; UOW:66–99). The original two concurrent 80-against-100 direct receipts are serialized. Quotation-link cap and stale link classification are separate remaining gaps R2-01/R2-04. |
| S05 | Partial | Void/delete reopens an underpaid Closed agreement in the lock-owned transaction; unvoid validates direct agreement state/balance and quotation duplicate/live-agreement balance (`ReceiptService.cs:809–862`). F4 resolves the formerly uncertain reversal policy. Editing a receipt that remains linked to a Closed agreement is still rejected before the new reopen code: R2-06. |
| S06 | Fixed | Equipment uses `RemoveWithChildrenAsync(...Documents,...Warranties)` at205–206. Shared EF-reference inspection checks foreign usages, including rental/sales delivery notes; owned rows are marked before the save. Original sequential dependency/child-cleanup defect addressed; generic concurrent dependency checks are not claimed proven. |
| S07 | Fixed | Release uses old unit IDs minus final unit IDs, including retained-row substitutions (`SalesAgreementService.cs:149–150`). |
| S08 | Fixed under F13 | Quotation preview now sums rounded per-line tax/amounts (`details.component.ts:200–202,286–291`) like the current backend; original .21-versus-.22 mismatch removed. F13 explicitly selected this compatibility formula. This does not claim adoption of the canonical per-rate document VAT policy: BE15/backlog24 still records that separate transition. |
| S09 | Fixed | Settings subscription calls `applyDefaultTaxRate`; only new pristine rate controls are updated, saved rows/dirty optional choices preserved (`SalesQuotation/details.component.ts:249–252,489–495`). |
| S10 | Fixed | Saved/generated date-term key and SrNo lookup keep manual dates while date/count terms are unchanged (`SalesAgreement/details.component.ts:831,900–935`). Price/discount/down-payment edits change amounts without discarding date overrides. |
| S11 | Fixed | F7 supersedes the old rounding contract. Domain `FloorMoney`, quotation `MidpointRounding.ToZero` and shared Sales preview produce .00 regular installments and .04 remainder for .04/6; the last row stays nonnegative. Source arithmetic only, no test suite run. |
| S12 | Partial | Agreement guards busy exits, discards uploads on confirmed route exit, saves destination and retains cleanup-only Retry. Fleet now uses the same tracker and busy/failed-cleanup recovery, with both modal-host and routed guards. Fleet loses the requested route after cleanup failure/Retry: R2-07. |
| S13 | Fixed | Quote-owned agreement terms/down payment/count/discount/customer/prices are disabled/read outputs; receipt locks root/first date. Sold/Delivered Fleet cost is read-only; BE rejects a changed cost instead of ignoring it. Relevant owning fields and F8 reconciled. |
| S14 | Fixed | Create retains `sourceQuotationId`, Retry chooses that source and the template exposes the button when it exists (`SalesAgreement/details.component.ts:178,277,423–426`; HTML:76–80). |
| S15 | Fixed | Fleet document number/non-whitespace and issue/expiry controls required; shared `documentDatesValidator` rejects expiry <= issue; matching field/group error bindings present (Fleet TS:1016–1026; HTML:360,382,405–406). |
| S16 | Fixed under F1 | Equipment Add/Update duplicate check and write share `ExecuteUniqueWriteAsync<Equipment>` (85–88). F1 deliberately chooses participating-writer serialization and defers a normalized unique plate index; lack of that index is not repeated as a violation of this amended contract. |
| S17 | Fixed | Scoped details/lookup calls suppress interceptor feedback and local warnings provide retry. Due customer select passes the inherited skip option. Receipt's quotation-detail consumer was inspected and retains its own local error path after the shared service change. Mutation failure ownership remains interceptor-owned. |
| S18 | Fixed | Quotation list follows returned PageNo and rewrites route/query dedup state (`SalesQuotation/list.component.ts:315–322`). Fleet's removed empty-page recovery is a distinct regression, R2-08. |
| S19 | Partial | Candidate date filter, prior-schedule allocation and received sums moved into SQL projection, reducing old graph materialization. `ToListAsync` still precedes IncludePaid filtering, count, totals, ordering and Skip/Take (`SalesAgreementService.cs:508–563`), contrary to F9. R2-05. |
| S20 | Fixed | Type precedes date/numeric serial in shared detail allocation/order. Due correlated sum also prioritizes type and uses length/lexical serial ordering for the generated 0..120 serials. Detail returns ordered rows to Receipt's first-unpaid default; F10 preserved. Historical malformed serial/EF translation acceptance pending. |

### Remaining priority findings and regressions

| ID | Priority | Current source | Reproducible trigger and consequence | Owning correction |
|---|---|---|---|---|
| R2-01 | P1 | BE `ReceiptService.cs:34–44,112–124,752–753,865–940` | A quotation is Converted with down payment20 and its agreement total100. Void the quotation receipt, then collect100 directly and optionally Close. Add a new receipt with only `SalesQuotationId`: the quote still passes Converted/no-other-live-quote-receipt/equal-down-payment checks. `ResolveSalesAgreementAsync` immediately returns because SalesAgreementId is null. Add therefore collects another20, including against a Closed agreement. Update can reach the same bypass. The sales lock serializes this invalid operation but does not validate its balance. | Reuse a single collection eligibility rule for quotation Add/Update/unvoid when a live agreement exists, including state and combined agreement/quotation outstanding; retain pre-conversion down-payment semantics. The existing unvoid path already contains the missing live-agreement check. |
| R2-02 | P1 | BE `SalesQuotationService.cs:376–402,460–485`; `ReceiptService.cs:30–44` | Unapprove checks no live receipt, then pauses. A quotation-linked receipt Add runs under the SalesAgreement lock, sees CustomerApproved and commits. Unapprove subsequently loads the still-CustomerApproved root and saves InternallyApproved. Its status token still matches because receipt creation did not change that status. Result: collected money against a quotation whose approval was reverted. | Make the dependent quotation transition participate in the same owner lock and re-read downstream eligibility inside it; a root status token alone does not protect rows written by ReceiptService. Residual S01, not a second count of the old generic concurrency finding. |
| R2-03 | P1 | BE `EquipmentService.cs:85–88,143–178`; `SalesAgreementService.cs:59,208–212,273–278`; `EquipmentConfig.cs:16–22` | Invoice reads a Reserved active unit cost100 under the SalesAgreement lock. Equipment Update, under the different Equipment lock, changes cost to200 and commits while status/active remain Reserved/true. Invoice then posts cost100 and makes the unit Sold/inactive. Both concurrency predicates still match, leaving posted stock/cost100 against saved carrying cost200. Rejecting cost changes after Sold does not protect this earlier read. | Coordinate participating unit updates with sale invoicing, or protect the cost read with an appropriate concurrency predicate/version and atomic retry boundary. Preserve existing duplicate-plate serialization and accounting rollback. Residual S01. |
| R2-04 | P1 | BE `ReceiptService.cs:106–109,238–242,407–411,780–790` | Lock selection and old-link snapshot are read before the protected boundary. Example: Remove snapshots an unlinked receipt and pauses; another Update links it to a sales agreement and commits; Remove then loads the newly linked receipt, deletes it without the sales lock and performs reopen as a second unprotected save. Close can read the old receipt total, then commit Closed after deletion/reopen saw Delivered, producing Closed with outstanding. Update can likewise reopen the stale old agreement rather than the actual link it replaced. | Re-read and protect the actual before/after links and lock decision atomically, including a receipt changing from unlinked to linked while a request waits. Do not use the pre-lock snapshot as authoritative. F1 expressly includes the before and after links. |
| R2-05 | P2 | BE `SalesAgreementService.cs:463–508,510–567` | Page size15 with 100,000 candidate payments still reads 100,000 projected rows, constructs every row, filters paid rows, sums and sorts them in memory. Each page repeats that work. SQL correlated sums are an improvement but F9's SQL IncludePaid/count/totals/order/page are not implemented. | Keep the paid/remaining projection queryable through effective filtering and execute database totals/count and deterministic paged rows. Retain full filtered totals and whole-schedule allocation; verify translation/query plan with the owner after source correction. |
| R2-06 | P2 | BE `ReceiptService.cs:120–124,763–764,212–213` | A Closed agreement includes an unposted/unapproved receipt eligible for ordinary editing. Reducing its amount while retaining the same SalesAgreementId is refused by the unconditional Open/Invoiced/Delivered eligibility check. Execution never reaches `ReopenClosedAgreementAsync`, although F4 expressly includes editing a receipt that creates outstanding. Moving the receipt to an unrelated context can reach reopen, so the policy is inconsistently applied. | Separate edit/reversal eligibility from new collection eligibility for the existing receipt, preserve allocation/posting/period guards, and atomically reopen Closed to Delivered when the accepted edit reduces collection, as F4 requires. |
| R2-07 | P2 | FE `Fleet/fleet.routes.ts:6–9`; `Fleet/details.component.ts:371–412,1237–1245`; host list `canDeactivate` | Navigate from a dirty Fleet editor to another route, confirm discard, and fail file deletion. The guard correctly cancels navigation. Cleanup Retry later calls `finish(false)`, which either closes the embedded modal on the Fleet list or navigates a routed editor to /Fleet. Neither guard nor editor retains the originally requested destination. Agreement already preserves `nextState.url` and resumes it. | Pass/store the destination through the Fleet host/route guards and resume it after successful cleanup-only Retry, keeping ordinary Cancel's return-to-list behavior. |
| R2-08 | P2 | FE `Fleet/list.component.ts:285–296`, diff removes old `loadFleet` empty-page retry; BE `EquipmentService.cs:24,56–74` | Another user deletes/filters out the last row on Fleet page3 while this editor is open. Close the editor with a change: refreshed page3 has no rows but totalCount shows two pages. The new subscriber only sets rows/count; Equipment backend does not clamp the page. The previous empty-page recovery was removed, so the grid remains empty on a nonexistent page despite matching records. | Restore bounded empty-page recovery or freeze/implement backend page clamping and follow returned page metadata consistently. Local one-row-delete decrement does not cover external changes or editor refresh. |

### Current conformance, contracts and verification

- F11 Fleet columns now match ListVM and print/Excel: Actions; plateNo, make, model, vehicleType, interiorColor, isActive, saleStatus, branch, chassisNo, engineNo, purchaseDate, purchaseCost. Backend ListVM = id plus those twelve fields. engineCapacity/fuelTankCapacity are intentionally removed by the amendment, not an unresolved contract decision. Print includes interiorColor. Existing other grid/filter/API shapes in the first review are retained.
- F12 caps the exclusive end for `DateTime.MaxValue.Date`; old ToDate overflow addressed. SA-C1 action dialog uses maxHeight90dvh and content-sized form/body/scroll flex chain; source conformance fixed, visual acceptance pending.
- Fleet remains a modal with two editable collections; canonical type02/routed-editor D4-2 deviation remains. Tracker reuse repairs its lifecycle but does not establish shared file-field presentation, structured date inputs, layout/style/accessibility conformance. Due still uses the list shell rather than UI20 report hosts. The earlier lower-priority quotation focus/integer-validation and mapping/override/provider observations are not silently closed. Agreement now has protected UpdateCoreAsync, but its custom public lock wrapper still bypasses the base public entry; remaining structural justification is separate from the verified business lock.
- No new business decision taken by this re-review. F4/F7/F8/F10/F11 resolve the original uncertainties. F13 keeps quotation preview compatible with current per-line backend tax; canonical per-rate document VAT remains an explicitly recorded separate conformance transition, not falsely claimed implemented.
- Current static inspection: 32 non-spec Sales TypeScript files, seven external Angular templates and two inline templates parsed with zero syntax diagnostics. Scoped Git whitespace checks returned no errors; no merge markers in Sales. This is parsing only, not Angular typechecking, C# compilation, EF SQL translation, tests or application verification.
- Current translation leaves: Fleet111/111, Quotation113/113, Agreement161/161, Due40/40. All312 statically named Sales translation references resolve in both language trees (enum-root references are objects with descendants). New BE `SalesAgreementUnitCostLocked` exists in en/ar resources. The original unused Arabic document-key debt is fixed.
- Request/detail/list models and service producers/consumers were reconciled, including Fleet purchaseCost and saleStatus, source-quotation/Receipt shared detail suppression, route guards and imported new installment-preview helper. Unrelated Workshop/Gate Pass dirty changes preserved and excluded.
- Migration: state concurrency configuration changed since the first review. The owner's fix freeze requests `Add-Migration SalesConcurrencyTokens` to reconcile the model snapshot (expected empty Up/Down). Existing `SalesCycleCompletion` files still present; applied database state Unknown. No migrations/snapshot files created, edited, executed or regenerated by this review.
- Each repository's scoped dirty diff/current source was inspected separately, including FE new files and the directly relevant BE configuration/domain/resource/DTO changes. No source fixes claimed. Suggested future fix commit subjects only: FE `fix(sales): preserve cleanup destinations and recover fleet paging`; BE `fix(sales): reconcile collection eligibility and shared write boundaries`. No commits made.
- Phases0–6 applied as read-only discovery/contract comparison/grid/detail/action/integration/reconciliation; implementation, documentation promotion and migration execution skipped because this request is a re-review. Earlier bounded audit artifacts are retained as historical Round1 evidence; Round2 is consolidated here. Existing-agent follow-up attempts produced no usable Round2 output, so the root completed the second audit locally; no additional agents spawned or application writes delegated.
- Owner checks pending after correction: quote-linked receipt after conversion/full payment/Close; unapprove versus receipt creation; cost edit versus invoice posting; unlinked-to-linked receipt remove/update/void versus Close; Closed receipt reduction; SQL report paging/full totals/IncludePaid/date boundaries at volume; Fleet guard cleanup failure then Retry to the requested route; external last-page deletion/editor refresh. Builds, tests, accounting/EF/database acceptance, narrow/RTL/dark/print and migration application remain owner responsibilities.
- Prohibited commands were not run: no builds/tests/lint/browser/application/database/migrations/snapshot edits/commits/push/deployment/Graphify/Sigma MCP. Only source reads/diffs/parsing, recipe check and this review-artifact update. A suspected enum-comparison language issue was rejected using the official [C# comparison operator reference](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/operators/comparison-operators), which explicitly permits enumeration comparisons; it is not a reported compilation defect.

Re-review complete as a source-only deliverable. Sales is not reconciled for closure while the priority findings and recorded conformance deviations remain.

## Round 3 — latest owner changes re-reviewed, 2026-10-04

| Field | Current disposition |
|---|---|
| Status | Draft |
| Owner verification pending | yes |
| Request | انا عدلت الملاحظات راجع تانى |
| Scope | Source-read-only latest Sales changes and the directly owning Receipt, Equipment, quotation/agreement lifecycle and Due report producer/consumer paths |
| Contract | Existing Frozen cycle and fix contract F1–F13, with Sections 4–5 implementation/follow-up records; no business rule amended by this review |
| Round 2 priority findings | 5 Fixed in source (R2-01/02/03/05/07); 3 Open (R2-04/06/08) |
| Original findings | The four Partial dispositions S01/S05/S12/S19 remain; closing five narrower triggers does not close their remaining integration/conformance concerns |
| Recipe drift | PHASE-01-domain-api, PHASE-03-detail-write and PHASE-04-domain-actions stale; other five packets OK. Canonical owning books used; no packet regeneration performed |
| Review write | This report only; application/configuration/instruction/contract/migration/snapshot files unchanged by the reviewers |

### Round 2 findings: current source evidence

Paths are relative to the applicable FE/BE repository. Anchors describe current source, not executed concurrency tests.

| ID | Priority | Round 3 | Evidence and practical limit |
|---|---|---|---|
| R2-01 | P1 | Fixed | BE `ReceiptService.cs:855–875` now resolves the live agreement behind a quotation, checks its collection state and combines direct/quotation-linked receipts for outstanding. Both Add and Update call the helper at896/922; Unvoid calls it at847. The reported converted/full-paid/Closed quotation bypass is addressed. This does not resolve existing Closed-receipt edit eligibility (R2-06). |
| R2-02 | P1 | Fixed | BE `SalesQuotationService.cs:376–405`: public Unapprove now wraps its core in `ExecuteUniqueWriteAsync<SalesAgreement>`. Receipt/agreement existence and status checks execute inside the same tenant sales boundary used by collection/conversion. The reported check-then-receipt race is addressed in source. |
| R2-03 | P1 | Fixed | BE `EquipmentConfig.cs:11` makes PurchaseCost a concurrency token as well as the existing status/active predicates. Invoice reads tracked units and changes their final state inside the atomic SalesAgreement write. A same-status cost edit after invoice's read now conflicts on the final unit write, rather than silently posting the earlier cost; the outer transaction owns rollback of invoice/JV writes. Actual concurrency/accounting rollback remains an owner check. |
| R2-04 | P1 | Open | BE `ReceiptService.cs:106–109,238–242,407–411,780–786` still selects the lock and captures old links before the protected boundary. An unlinked receipt can become linked before Remove/Toggle loads it, leaving the mutation outside the sales lock. Update can also retain stale before-links while waiting. No receipt link concurrency predicate or atomic revalidation closes this gap. |
| R2-05 | P2 | Fixed | BE `SalesAgreementService.cs:478–586`: received/previous-allocation projections stay queryable; IncludePaid is applied at525, SQL aggregate count/full-filtered totals at527–536, deterministic order/page and lean projection precede ToListAsync at586. Only the requested page is mapped in memory. The original full-candidate materialization is removed. EF translation and the query plan at volume are unverified, especially the grouped joins/Concat/whole-schedule allocation query. |
| R2-06 | P2 | Open | BE `ReceiptService.cs:120–124,763–764`: updating a receipt with the same Closed SalesAgreementId is still rejected by new-collection state eligibility before the tracked receipt/edit guards and reopen logic at212–213. F4's accepted edit that restores outstanding cannot reach its required Closed→Delivered transition. |
| R2-07 | P2 | Fixed | FE `Fleet/fleet.routes.ts:6–9`, list `canDeactivate:161–162`, details `canDeactivate:373–397` now forward/store `nextState.url`. Successful discard-only Retry at415–420 sets the editor finished and resumes `navigateByUrl(exitUrl)`. Ordinary Cancel retains its existing return-to-list/modal-close behavior. Failed cleanup then Retry navigation remains an owner runtime check. |
| R2-08 | P2 | Open | FE `Fleet/list.component.ts:291–296` follows returned pageNo, but BE `EquipmentService.cs:24,56–72` still returns the requested page and applies Skip without upper clamping. The new frontend comment claiming server clamping is inconsistent with the actual producer. Empty-page recovery remains absent. |

### Remaining actionable findings

1. **R2-04 / P1 — protect actual receipt links inside the write boundary.** Remove snapshots an unlinked receipt; another Update links it to a Delivered sales agreement and commits; Remove then loads/deletes that newly linked receipt without the sales lock. Close may have read the old collection total and commit Closed after the deletion's reopen check saw Delivered. A Closed agreement with outstanding is still possible. Read/protect/revalidate the actual before/after links atomically, including unlinked→linked transitions; do not treat the pre-lock snapshot as authoritative. Preserve existing posting, allocation and period guards.
2. **R2-06 / P2 — distinguish existing receipt edits from new collection.** An unposted, unapproved, unallocated receipt can be included in Close's collection total. Reducing that receipt while retaining its Closed agreement link currently fails before the reopen step. For an otherwise eligible edit under F4, evaluate its actual existing link and accepted financial effect inside the same transaction, then reopen to Delivered if outstanding returns. Keep new collections disallowed on Closed agreements and retain all existing edit restrictions.
3. **R2-08 / P2 — complete Fleet paging recovery across producer and consumer.** On page3, size15, an external deletion can leave totalCount30/totalPages2 while refresh still requests page3. Backend returns no rows and pageNo3; following that metadata cannot recover. Restore bounded empty-page recovery, or implement upper page clamping in the owning backend and consistently consume it. Local one-row-delete decrement does not cover external changes/editor refresh. Correct the frontend's server-clamping claim with the implemented behavior.

### Conformance and verification handoff

- Applied read-only phases0–6 against the existing Frozen contracts. Canonical Master block7 and the owning routed aggregate/action/report blocks (BE14/15/17), plus applicable UI blocks and the required sigma-screen-refactor skill, remain the authority. Quotation/Agreement retain type02 routed ownership; invoice retains its accounting owner. No new plan, write contract or source refactor introduced.
- Previously recorded deviations remain: Fleet's modal with two editable collections versus canonical routed type02; Due's list shell versus UI20 report hosts; Fleet shared field/date/style/accessibility presentation and lower-priority focus/integer-validation/mapping/provider observations. Source changes in this round do not establish visual acceptance or close these items. Per-line quotation tax remains the recorded F13 compatibility transition.
- Static inspection completed: 32 non-spec Sales TypeScript files, seven external Angular templates and two inline templates parsed with zero syntax diagnostics. Scoped FE/BE Git whitespace inspection found no whitespace errors (only line-ending notices); scoped merge-marker search found no matches. These are source checks, not Angular typechecking, C# compilation, EF translation or runtime verification.
- Current producer/consumer reconciliation includes the real Equipment paging producer, Fleet host/routed guards, quotation collection helper callers, Unapprove's shared lock, invoice's tracked cost concurrency and Due's query/page/result mapping. No additional concrete regression was established in the latest fixes. Translation/resource verification from Round2 remains historical evidence; it was not rerun as a new runtime check.
- A 49-file hash comparison of the Sales source and owning service audit set at the beginning/end showed no changes during this review. The newly relevant Equipment configuration was inspected separately. Unrelated Workshop/Gate Pass changes were preserved and excluded.
- One bounded inherited-model frontend agent re-reviewed R2-07/08 after the existing freeze; root handled financial/lifecycle/query evidence and independently spot-checked both frontend paths and their backend producer. No application writes delegated; no new evidence artifact needed beyond this consolidated round.
- Migration handoff remains owner-pending: the fix contract requests `Add-Migration SalesConcurrencyTokens` to reconcile concurrency metadata, now including PurchaseCost (expected empty Up/Down for metadata-only changes). No matching migration filename was found. Existing SalesCycleCompletion files remain present; database application state Unknown. No migration/snapshot generation, reads of snapshot content, edits or execution performed here.
- Owner verification still required: converted quotation receipt/full-payment/Closed and Unvoid; Unapprove versus receipt creation; same-status cost edit versus invoice with accounting rollback; receipt unlink/relink/remove/void versus Close; accepted Closed receipt reduction; Due SQL translation, full-filtered totals, allocation/date boundaries and query plan at volume; Fleet cleanup failure→Retry to destination and external last-page deletion/editor refresh; build/typecheck and narrow/RTL/dark/print acceptance. Source-review completion does not establish Sales readiness.
- Prohibited execution not performed: builds/tests/lint/runtime/browser/application/database/migrations/snapshot edits/commits/push/deployment/Graphify/Sigma MCP. Review-artifact update, source reads/diffs/parsing, recipe check and primary-source reference verification only. No new commit created or suggested as completed.

Round 3 source re-review complete. Three priority findings and the recorded conformance/owner checks remain open.

## Targeted CS1525 correction — 2026-10-04

| Field | Disposition |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Request/evidence | Owner supplied CS1525, Invalid expression term '&&', SalesAgreementService.cs:490 |
| Source change | BE `SiGma.Business/Services/SalesAgreementService.cs:459,490`: rename the date-bound local `from` to `fromDate` at its declaration and query use |
| Cause | The contextual query keyword `from` is parsed as query syntax at this position instead of the intended date-bound identifier; Roslyn reproduced the exact diagnostic before the change |
| Shape/conformance | Existing BE17 paged read-only Due report within its Frozen Sales service ownership. Rename only; date inclusivity, collection/allocation formulas, query composition, filters, totals, ordering, paging and request/response contracts retained. No new shared extraction needed |
| Verification | Roslyn CSharpSyntaxTree.ParseText on the entire current service: before, one error CS1525 at490; after, zero syntax errors. Complete scoped file diff inspected; Git whitespace check clean except line-ending notice; no merge markers. Syntax parsing only, no compilation or EF execution |
| Phases | Existing discovery/contract evidence reused; targeted read-query correction and source reconciliation applied. Detail/actions/Angular changes not applicable |
| Unchanged boundaries | No frontend/DTO/mapping/domain/EF/schema/permission/accounting changes; no migration required for this rename. Earlier owner-pending concurrency migration and Round3 findings remain separate |
| Recipe check | PHASE01/03/04 still stale; other five OK. Canonical Master7/BE17 and required skill used; packets not edited/regenerated |
| Owner checks | Compile the Business project and execute Due report to verify EF translation/paging/totals; no build, tests, runtime, database or browser commands run by the agent |
| Suggested BE commit | `fix(sales): avoid query keyword in installment date filter` — suggestion only; no commit/push performed |
| Agents | None; this two-line sequential syntax fix does not meet the delegation gate |

This targeted fix corrects the owner-reported syntax defect missed by the earlier C# source inspection; the previous Round3 completion remains limited to its stated source checks and does not imply compilation passed.

## Quotation detail Action Button — 2026-10-04

| Field | Decision / pre-implementation evidence |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| User scope | Add UnApprove and Open Agreement; user selected details screen and then specified placement inside Action Button |
| Owning shape | Existing type02 routed SalesQuotation editor; expose the two existing list actions in its View header through the shared ActionButtonComponent |
| UnApprove contract | CustomerApproved only; shared warning confirmation; existing POST SalesQuotation/{id}/unapprove, null body; backend retains shared SalesAgreement lock and dependent receipt/agreement checks; success reloads authoritative details |
| Open Agreement contract | CustomerApproved, non-expired quotation; existing /SalesAgreement/create?salesQuotationId={id} preloads quotation/customer/terms/items. This is the existing list's creation-editor action, not a new lookup of a converted agreement |
| Conformance | UI7 SalesQuotation list actions/confirmAction → typed ActionList/detail header; UI9 ConfirmationDialogService → existing warning and identity; UI13 routed editor + existing shared FeatureTitle action slot → existing ActionButton actionTemplate; UI22 mutation interceptor → one feedback owner and both failure-channel cleanup; UI23 existing EN/AR keys → no new keys |
| Boundaries | No backend/API/DTO/EF/schema/calculation/permission change; no migration needed. Existing list action inventory remains unchanged. No new screenshots or missing business decision |
| Recipe drift | PHASE01/03/04 stale; canonical books used; other five packets OK. No generated packet edits |

Final source reconciliation:

- Changed FE `SalesQuotation/components/details/details.component.ts`, `.html` and `salesquotation.routes.ts`; updated this report. Existing owner edits in the same detail files were inspected and preserved. No backend or shared-component edits.
- Added typed `ActionList<SalesQuotationDetailModel>` for the two requested actions. The View header renders the existing shared ActionButtonComponent `actionTemplate` with the current detail as its row via NgTemplateOutlet, reusing its dropdown/portal/icons/translations and shared FeatureTitle action slot. No custom dropdown, sizing, colour or CSS copied. Header/back/close/print/edit actions observe the new busy state.
- UnApprove retains CustomerApproved visibility and backend dependency validation. A guarded shared warning dialog includes quotation/customer identity; confirming sends one existing typed request; successful response reloads server detail/status; failed Result/HTTP leaves the record intact and releases busy state, with mutation feedback owned by the interceptor. Open Agreement retains the existing list's non-expired CustomerApproved gate and typed create-route preload. No new write payload or calculated values.
- Both `view/:id` and historical `details/:id` now use the existing canDeactivate guard so a pending confirmation/mutation cannot be abandoned through route navigation. Idle read-only View still leaves directly; existing Create/Edit dirty behavior retained.
- Parsed the changed detail TypeScript, route TypeScript and Angular HTML: zero syntax diagnostics. AST-based source lookup confirmed all seven requested quotation label/confirmation/identity keys in both EN/AR. Scoped Git diff/whitespace and merge-marker checks clean apart from line-ending notices. Shared ActionButton's static template query/imports, backend POST route/state lock, and agreement query-param preload were traced from source. No Angular typecheck/build/runtime/browser tests performed.
- Applied bounded discovery/contract reuse, requested header/action implementation, route integration and source reconciliation; other grids/editors/backend changes out of scope. No new schema/migration. Suggested FE commit: `feat(sales): expose quotation detail actions`. No commit/push performed. No agents used: this small, sequential editor integration did not meet the delegation gate.
- Owner checks pending: View a CustomerApproved quotation, inspect both menu entries, confirm/cancel UnApprove, exercise blocked dependency/HTTP failure and double clicks, verify authoritative reload to InternallyApproved, then Open Agreement with a valid quote and inspect preload; expired/other-status quotes must omit unavailable actions. Check narrow/RTL/dark/print rendering and the shared template/portal in the header. Other Sales review findings remain separate.
- Prohibited commands not run: builds/tests/lint/browser/application/database/migrations/snapshot edits/commits/push/deployment/Graphify/Sigma MCP.

## Quotation filter alignment correction — 2026-10-04

| Field | Disposition |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Request | Sales Quotation: الفلاتر مش فى نفس المستوى |
| Source evidence | Date-range filter already reserves its validation message through FieldError, making its field taller. Shared FilterPanel default grid uses align-items:end, which lowers neighboring shorter fields relative to the date label/control |
| Decision / conformance | UI4 Stable editing layout and required skill §3.4: opt into existing `[stableLayout]="true"`; shared FilterPanelComponent host modifier uses top alignment and bounds PrimeNG widths. Actual shared implementation and SupplierBalancesSummary's opt-in inspected. Preserve reserved date feedback via UI19; no local height/spacing CSS |
| Changed files | FE `SalesQuotation/components/list/list.component.html`: one stableLayout binding; this review report. Existing owner validation/status/lookup-retry edits preserved |
| Shape / scope | Existing shared list filter strip. Columns, fields, date validation, Search/Reset, paging, API/model/mapping/calculation contracts unchanged; no backend/shared style changes or migration |
| Verification | Angular template parsed with zero errors; complete scoped Git diff inspected; whitespace and merge-marker checks clean apart from line-ending notice. No browser/visual verification or build performed |
| Phases / recipes | Existing contract/discovery reused; bounded Phase2 presentation fix and Phase6 source reconciliation. PHASE01/03/04 still stale, other five OK; canonical sources used, no packet regeneration. Other implementation phases not applicable |
| Owner check | Verify labels/control top edges with valid/invalid date input, EN/AR, narrow viewport and dark theme; frontend build remains owner-pending |
| Suggested FE commit | `fix(sales): align quotation filters with reserved feedback` — suggestion only |
| Agents / boundaries | No agents: one-binding fix does not meet delegation gate. No builds/tests/lint/browser/application/database/migrations/snapshot edits/commits/push/deployment/Graphify/Sigma MCP |

## Quotation row downstream navigation follow-up — 2026-10-04

| Field | Frozen decision before implementation |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Request | UnApprove/Open Agreement missing in a quotation row; owner answered شوف المناسب to the question about the row's state |
| Evidence | Existing row menu already contains both entries for CustomerApproved=4. Both enums match and backend projects Status directly. Converted=6 currently omits Open Agreement despite having an existing downstream agreement; the current action always targets Create |
| Decision | Retain UnApprove's existing CustomerApproved→InternallyApproved rule, shared confirmation, and server dependency checks. InternallyApproved uses the existing Revise/customer-approval workflow; Converted cannot unapprove a dependent agreement. Do not widen status transitions to make an invalid button appear |
| Open Agreement | CustomerApproved + non-expired + no live agreement → existing Create preload. An existing non-cancelled agreement → its owning read-only /SalesAgreement/view/{id}, including Converted/expired quotation. Use the persisted live relation, never infer an agreement id from quotation id |
| Read contract amendment | Add nullable salesAgreementId to quotation List and Detail responses/FE models, server-selected from same-tenant, non-deleted, non-cancelled SalesAgreement records with the matching SalesQuotationId. No new entity/schema/write fields/endpoints. This extends the previous downstream creation-only action decision with existing-agreement navigation |
| Conformance | UI7 typed ActionList + existing shared action button; BE3/7 minimum navigation identity consumed by row action; BE4 existing one-way detail projection with explicit service-owned link; UI13/15 owning agreement View route; shared helper used by list/detail to keep eligibility consistent. Shared components unchanged |
| Scope | Complete only this navigation read/consumer slice; no financial calculations/approval/accounting state changes. Preserve unrelated dirty changes and previous fixes |

Final source reconciliation:

- FE changes: quotation list/detail components, sales-quotation.model.ts and quotation-state.ts. Both action consumers use the same canOpenQuotationAgreement helper: an actual live agreement id opens the owning View route; otherwise a valid CustomerApproved quotation opens the existing Create preload. The row's requested actions now have transient request disabling; backend remains the authoritative UnApprove guard. No new HTML/style/shared-component changes in this follow-up.
- BE changes: SalesQuotationService.cs, SalesQuotationProfiler.cs, SalesQuotationListVm.cs and SalesQuotationDetailVm.cs. Nullable SalesAgreementId is read-only action/navigation identity, not a grid column or client write field. List selects it within its paged SQL projection (no per-row requests); Detail fills it with one bounded lookup after finding the quotation. Both select latest id deterministically among matching non-cancelled records. Repository.Query's default tenant and live-record filters were inspected; no cancellation/deletion record is returned. Existing agreement View revalidates ownership on loading.
- Mapping decision: explicit Ignore for SalesAgreementId in the existing read maps is necessary because SalesQuotation has no reverse agreement navigation; the service owns its scoped query. No ReverseMap, new entity relation, persisted property, calculated value, permission or accounting transition added. The grid columns remain no/date/validUntil/customerName/customerCode/amount/status plus actions; ListVM also carries id and the newly consumed salesAgreementId action identity.
- Complete scoped FE/BE diffs inspected separately, including actual Git filename casing for both Vm files; unrelated and earlier owner/agent edits preserved. Four changed TypeScript files parsed with zero syntax errors. Roslyn parsed all four changed C# files with zero syntax errors. Whitespace/merge-marker checks clean apart from line-ending notices; no build/typecheck/EF query execution/runtime verification claimed. Existing EN/AR labels reused.
- No migration required: response-only fields/projections. Suggested commits only: FE `fix(sales): open linked agreements from quotation actions`; BE `feat(sales): return quotation agreement navigation identity`. None committed/pushed.
- Owner checks pending: CustomerApproved without agreement and valid date shows both actions; expiry hides creation but keeps UnApprove; Converted with live agreement shows Open Agreement and routes to that id; cancelled/deleted/other-tenant links are excluded; cancelled agreement restoring CustomerApproved permits eligible creation; UnApprove blocks live receipts/agreements server-side; compare list and View behavior; compile both repositories and verify the correlated list projection's SQL translation. The user's actual reported row state was not supplied, so this follow-up does not claim runtime reproduction of that row.
- Bounded discovery/contract amendment, read projections, action/route integration and source reconciliation applied. No ordinary Save/domain-action backend behavior changed. Recipe drift remains PHASE01/03/04 stale, five OK; canonical UI7/13/15 and BE3/4/7 used. No agents: this coupled navigation contract was implemented locally to avoid cross-layer coordination overhead. No prohibited builds/tests/lint/browser/application/database/migrations/snapshot edits/commits/push/deployment/Graphify/Sigma MCP performed.

Follow-up DueInstallments translation failure — 2026-10-08: owner supplied the actual InvalidOperationException from SalesAgreementService.GetDueInstallmentsAsync line 579. The failed SQL translation is caused by object null checks (`r != null` / `b != null`) on left-joined grouped aggregate projections in the totals query, before database execution; it is not an empty-result condition. Fixed in `SiGma.Business/Services/SalesAgreementService.cs` by projecting received and allocated-before sums as nullable scalar decimals through `AsQueryable().Sum(...)`, then coalescing `r.Amount`/`b.Amount` to zero. This keeps database aggregation, allocation order, paid/remaining clamp, totals, filter, sort, page and export/print contracts unchanged and avoids client materialization. Source grep confirms no old grouped-object null predicate remains; scoped backend diff/whitespace review passed. Backend compilation and endpoint execution remain owner-pending because builds/runtime are prohibited; no UI/guide change was needed because visible behavior and workflow are unchanged. Suggested backend commit: `fix(sales): make due installment aggregates translatable`. The supplied log contained an Authorization bearer token; it was not copied into project artifacts.

Packet refresh — 2026-10-08: at the owner's request, regenerated all derivative recipe packets from the canonical Master/UI/Backend books using `Generate-SigmaRecipes.ps1`; `-Check` now returns OK for PLAN-00 and PHASE-00 through PHASE-06. This supersedes prior stale-packet notes in this review's earlier historical entries; generated files remain derivative and were not edited directly. The current Sales review uses the refreshed Phase 01 domain/API, Phase 02 report/grid, Phase 03 editor/write, Phase 04 action, Phase 05 integration and Phase 06 reconciliation packets.

DueInstallments summary layout follow-up — 2026-10-08: switched the report totals to the shared `app-summary-cards` `slim` density and added a 12px host margin before the table. The Agreement No filter now fills its field width for consistent alignment with the other controls. Only scoped FE template/component style and the existing Sales guide text changed; no API, backend, schema, calculation, or shared-component contract changed. Source-only validation remains owner-pending for build/runtime and visual acceptance.

DueInstallments filter alignment follow-up — 2026-10-08: the filter strip now uses the shared inline grid with four filter columns and the report actions in the same desktop row. Agreement No uses the standard form-control surface plus shared filter tokens for matching border, focus, height and width. Responsive behavior remains owned by the shared report-filter breakpoints; no API, backend or calculation contract changed.

DueInstallments visual correction — 2026-10-08: aligned the filter strip with the canonical inline report pattern by reserving the actions caption track, grouping the action controls, using an explicit three-field plus checkbox/actions grid, and switching Agreement No to the shared PrimeNG input-text control. This corrects the cramped checkbox/action spacing while preserving responsive shared breakpoints and all report behavior.

DueInstallments checkbox alignment follow-up — 2026-10-08: vertically offset the Include paid installments control to the same baseline as the labeled date/customer/agreement inputs in the inline strip, with a mobile reset at the shared stacked breakpoint. No behavior or contract change.

## Sales cycle comparison with Odoo and SAP — 2026-10-08

| Field | Value |
|---|---|
| Status | Implemented — source-only review artifact |
| Owner verification pending | yes |
| User request | مراجعة دورة العمل في `src/app/modules/Sales` ومقارنتها مع Odoo وSAP |
| Scope | SalesQuotation, SalesAgreement, Sales Fleet, Receipt collection, invoice/delivery/close actions and DueInstallments |
| Application source changed in this review | No; only this review artifact was updated |
| Recipe check | PLAN-00 and PHASE-00 through PHASE-06 all OK on 2026-10-08 |
| Verification boundary | Source inspection only; no build, test, runtime, database or accounting posting execution |

### الدورة الموجودة فعليًا في Sigma

1. **Sales Fleet** يجهز الوحدة القابلة للبيع. اختيار الوحدة في العقد يتطلب أن تكون نشطة ومتاحة، لها موديل وشاسيه، ولا توجد لها حركة إيجار مفتوحة.
2. **Sales Quotation** يثبت العميل والموديل والكمية والسعر والمقدم وعدد الأقساط والصلاحية. يبدأ `Pending`، ثم يمر باعتماد داخلي، ثم موافقة العميل. الرفض يسجل السبب، وانتهاء الصلاحية يمنع موافقة العميل أو إنشاء عقد جديد.
3. **Sales Agreement** يمكن إنشاؤه من عرض موافق عليه أو مباشرة. هنا فقط تختار الوحدة الفعلية؛ الحفظ يجعل الحالة `Open`، يحجز الوحدات، ويحوّل العرض المرتبط إلى `Converted`.
4. **الخطة المالية والتحصيل** منفصلان: `DownPayment` وجدول الأقساط مبالغ مستحقة، أما المبلغ المدفوع فعليًا فيأتي من سندات قبض فعالة. يمكن تسجيل أكثر من سند قبض، ويمنع مسار التحصيل أن يتجاوز الرصيد المتبقي للعقد، مع احتساب سند مقدم العرض المرتبط مرة واحدة.
5. **Invoice** متاح للعقد المفتوح أو المفوتر جزئيًا. يمكن إنشاء فاتورة كاملة، أو فاتورة مبلغ/مرحلة قبل الضريبة، أو فاتورة لوحدات محددة. ينشئ النظام لكل طلب فاتورة بيع وقيدًا محاسبيًا مرحّلًا، يحسب المتبقي المفوتر، ويمنع تجاوز إجمالي العقد أو تكرار تخصيص الوحدة. الوحدة المرتبطة بفاتورة وحدات تصبح `Sold` وغير نشطة، ويستخدم العقد `PartiallyInvoiced` حتى اكتمال الفوترة ثم `Invoiced`.
6. **Deliver** متاح بعد الفاتورة والقيد المرحّل. في الفوترة الجزئية لا يقبل إلا الوحدات المرتبطة بالفاتورة، وينشئ مستند تسليم لكل وحدة؛ ويمكن تسليم الوحدات على دفعات، فتظهر `PartiallyDelivered` قبل اكتمال التسليم. لا يشترط المصدر اكتمال السداد قبل التسليم.
7. **DueInstallments** يعرض الاستحقاقات والمدفوع والمتبقي والتأخير، و**Close** لا ينجح إلا بعد التسليم ووصول المتبقي إلى صفر. الإلغاء قبل الفاتورة يحرر الحجز؛ والسند الملغى أو المخفض يعيد العقد المغلق إلى `Delivered` عند رجوع رصيد.

### المقارنة المرجعية

| المرحلة | Sigma الحالي | Odoo الرسمي | SAP S/4HANA الرسمي | الحكم |
|---|---|---|---|---|
| العرض والقبول | عرض مستقل مع اعتماد داخلي ثم موافقة عميل صريحة | العرض المؤكد يتحول إلى Sales Order، ويمكن استخدام التوقيع الإلكتروني أو الدفع الإلكتروني لتأكيده ([Odoo create quotations](https://www.odoo.com/documentation/19.0/applications/sales/sales/sales_quotations/create_quotations.html)) | quotation/order جزء من سلسلة presales؛ أمر البيع هو طلب تسليم محدد ويمكن أن تبدأ منه عمليات التسليم ([SAP sales order management](https://help.sap.com/docs/SAP_S4HANA_ON-PREMISE/7b24a64d9d0941bda1afa753263d9e39/733f9756c5708251e10000000a4450e5.html)) | اعتماد Sigma الإضافي صالح كضبط داخلي، لكنه قرار خاص بالنظام وليس خطوة عامة لازمة في Odoo/SAP. |
| الالتزام بالوحدة | العقد يختار chassis فعليًا ويحوله إلى `Reserved` | Sales Order يعتمد منتجات وكميات، والتنفيذ المخزني يتم عبر delivery/fulfillment | Sales Order يحتوي بنودًا وجدولة وتسليمًا، مع آليات توفر وحجز حسب الإعداد | Sigma مناسب لبيع أصول مركبية محددة؛ لا نحذف الحجز الفعلي عند المقارنة العامة. |
| المقدم | مبلغ مستحق في الخطة؛ التحصيل الفعلي سند قبض، وليس فاتورة مقدم مستقلة | Odoo يفرق صراحة بين down-payment invoice وpayment terms/installments، ويمكن إنشاء فاتورة مقدم ثم فاتورة نهائية تخصم المقدم ([Odoo down payments](https://www.odoo.com/documentation/19.0/applications/sales/sales/invoicing/down_payment.html), [payment terms](https://www.odoo.com/documentation/19.0/applications/finance/accounting/customer_invoices/payment_terms.html)) | SAP ينشئ down-payment request كـ billing document، ثم يسجل incoming payment، وتتم التسوية في الفاتورة النهائية ([SAP down payment requests](https://help.sap.com/docs/SAP_S4HANA_CLOUD/a376cd9ea00d476b96f18dea1247e6a5/ec72898c1cd246ad9ebfe14b8ebd8c22.html), [SAP final billing settlement](https://help.sap.com/docs/SAP_S4HANA_CLOUD/a376cd9ea00d476b96f18dea1247e6a5/da6eb6535fe6b74ce10000000a174cb4.html)) | Sigma صحيح في فصل المستحق عن المدفوع ومنع تجاوز الإجمالي، لكنه لا يطبق حاليًا نموذج فاتورة مقدم/تسوية Odoo/SAP. |
| الفوترة | يدعم فاتورة كاملة أو عدة فواتير جزئية بالمبلغ/المرحلة أو بوحدات محددة، مع سجل فرعي للفواتير مع بقاء `InvoiceId` القديم للقراءة | يمكن إنشاء down-payment invoice ثم regular/final invoice، وتوجد سياسات فوترة متعددة | الفوترة قد تكون delivery-related أو order-related، مع billing plans وpartial/final billing ([SAP billing document creation](https://help.sap.com/docs/SAP_S4HANA_ON-PREMISE/e322becd165844e5868e590bc8efafaf/6ea89f4943e94ba082090dc4b5df126b.html), [SAP billing plans](https://help.sap.com/docs/SAP_S4HANA_CLOUD/a376cd9ea00d476b96f18dea1247e6a5/51b19f90b37b41579d0547d1bfe834f1.html)) | الفجوة الأساسية تقلصت: ما زال نموذج مقدم مفوتر/تسوية مستقلة غير مطبق، لكن تعدد الفواتير الجزئية أصبح مدعومًا مع حد إجمالي واضح. |
| التسليم | بعد الفاتورة المرحّلة فقط؛ الفاتورة المرتبطة بوحدات تسمح بتسليم تلك الوحدات فقط، والفاتورة المبلغية لا تختار وحدة عشوائية | Odoo يربط التدفق بالترتيب والتسليم والفاتورة، وتحدد سياسة الفوترة هل الأساس ordered أو delivered quantities ([Odoo sales](https://www.odoo.com/documentation/19.0/applications/sales/sales.html)) | SAP يسمح بالفوترة المرتبطة بالتسليم أو بالأمر؛ في سيناريو down payment قد توجد قيود تسليم حتى سداد المقدم ([SAP manage sales orders](https://help.sap.com/docs/SAP_S4HANA_CLOUD/a376cd9ea00d476b96f18dea1247e6a5/e7f14402cf5846b4b3d0d677c15414b1.html)) | Sigma يفرض الفاتورة المرحّلة قبل التسليم ويحافظ على حد مادي واضح للوحدة، مع استمرار سياسة السماح بالتسليم قبل اكتمال السداد. |
| الإغلاق والتحصيل | إغلاق بعد التسليم والمتبقي صفر، مع تقرير DueInstallments | Odoo ينهي الدورة بتسوية الفاتورة والدفع والمتابعة ([Odoo customer invoices](https://www.odoo.com/documentation/19.0/applications/finance/accounting/customer_invoices.html)) | SAP يفصل التسليم والفوترة والتحصيل والتسوية ضمن سلسلة المستندات | قاعدة الإغلاق في Sigma واضحة ومناسبة، مع الحاجة إلى تقرير/حالة موحدة إذا أضيفت فواتير متعددة لاحقًا. |

### النتائج والقرارات المطلوبة

- **الدورة الحالية متماسكة** لبيع وحدة مملوكة للشركة: `Quotation → approval → Agreement/reservation → receipts → partial/final invoices → unit delivery → collection/close`. لا توجد فجوة تمنع شرح الدورة الأساسية للعميل.
- **المقدم غير المدفوع ممكن حاليًا**: كتابة `DownPayment` لا تسجل تحصيلًا؛ سند القبض هو الذي يزيد المدفوع. ويمكن تكرار سندات القبض ما دام مجموع الفعال منها لا يتجاوز إجمالي العقد.
- **الفواتير الجزئية أصبحت ضمن العقد**: طبقة `SalesAgreementInvoice` تربط كل فاتورة فرعية بالعقد وببنود الوحدات عند الحاجة، وتعرض المفوتر وغير المفوتر. الطلب المبلغي لا يحدد أصلًا للتسليم، بينما طلب الوحدات يحدد الوحدات القابلة للتسليم.
- **التسليم لا يتطلب السداد الكامل**؛ الشرط الحالي هو فاتورة وقيد مرحّل، بينما الإغلاق هو الذي يتطلب الرصيد صفرًا. هذا قرار تجاري يجب تثبيته قبل إضافة حظر تسليم بسبب المقدم.
- **الضريبة مصدرها الإعدادات مع تثبيت snapshot**: عرض السعر يمر عبر `ITaxPolicyService`، والعقد المحول يحتفظ بنسبة العرض، والعقد المباشر يحل النسبة من الإعدادات. لا ينبغي إعادة حساب عقد محفوظ بنسبة جديدة عند تغيير الإعدادات.
- **الفرق المقارن الأهم**: Odoo/SAP يميزان مستند طلب المقدم عن سند التحصيل وعن الفاتورة النهائية؛ Sigma يملك خطة استحقاق وسند قبض وقيد فاتورة نهائي، لكنه لا يملك مستند down-payment invoice أو billing plan متعدد الفواتير.

### توصية دورة العمل للعميل

اعرض الدورة الحالية كما هي في Sigma، وسمِّ `DownPayment` **مقدمًا مستحقًا** حتى يُحفظ سند قبض، وسمِّ `Receipt` **تحصيلًا فعليًا**. الفاتورة الجزئية قد تكون لمبلغ/مرحلة أو لوحدات محددة؛ لا يتم تسليم وحدة إلا إذا كانت مرتبطة بفاتورة وحدات مرحّلة، وتظل قاعدة الحماية: `إجمالي الفواتير + التسويات ≤ إجمالي العقد`.

### تنفيذ قرار الفاتورة الجزئية — 2026-10-08

تم تطبيق العقد المجمد في `reviews/Archive/Completed/2026-10-23/SALES_PARTIAL_INVOICE_CONTRACT_FREEZE.md`: دعم فواتير الوحدات وفواتير المبلغ/المرحلة، سجل فواتير فرعي، حالات `PartiallyInvoiced` و`PartiallyDelivered`، وتحديد الوحدات المسموح بتسليمها بعد ترحيل فاتورتها. دليل Sales يشرح الاختيار وقاعدة عدم تجاوز إجمالي العقد. لم يتم إنشاء migration أو snapshot أو تشغيل build/tests؛ يلزم على مالك المستودع تنفيذ `Add-Migration SalesAgreementPartialInvoices` ثم مراجعة واختبار الحالات المذكورة في عقد التجميد.

### تحسينات واجهة عرض السعر — 2026-10-08

| الملاحظة | التنفيذ | المالك المشترك | التحقق |
|---|---|---|---|
| طلب توسيط عناصر جدول `Items` رأسيًا | أضيف متغير اختياري على `app-editable-collection-table` يوسّط خلايا الجسم والقائمة الناتجة للإجراءات في Sales Quotation، مع إبقاء العناوين والمستهلكين الآخرين بمحاذاة أعلى افتراضيًا | `editable-collection-table.component.scss`، UI14 | تحقق المصدر تم؛ الفحص البصري والتحقق من الأخطاء وRTL بانتظار المالك |
| توسيط عناصر جدول `Items` في Sales Agreement | أعيد استخدام نفس المتغير الاختياري على جدول البنود فقط؛ جدول خطة السداد والمستندات يحتفظان بالمحاذاة الافتراضية | `editable-collection-table.component.scss`، UI14 | تحقق المصدر تم؛ الفحص البصري والتحقق من الأخطاء وRTL بانتظار المالك |
| طلب مسافة بسيطة أسفل كروت الإجماليات | أضيف هامش سفلي 8px على موضع `app-summary-cards` في Sales Quotation، مع الإبقاء على مالك الكروت المشترك | UI24 / موضع الشاشة | تحقق المصدر تم؛ التحقق البصري بانتظار المالك |

### توافق تحميل التفاصيل مع قاعدة البيانات السابقة — 2026-10-08

قراءة تفاصيل Sales Agreement تتعامل مع غياب جدول `SalesAgreementInvoice` الناتج عن عدم تطبيق Migration الفواتير الجزئية، فتستمر في عرض العقد وبيانات الفاتورة القديمة. هذا توافق مؤقت للقراءة فقط؛ لا يفعّل إنشاء الفواتير الجزئية أو سجلها. يجب على مالك قاعدة البيانات تنفيذ `Add-Migration SalesAgreementPartialInvoices` وتطبيقها قبل استخدام الفوترة الجزئية.

### مراجعة حداثة دليل Sales — 2026-10-08

دليل `UserGuide/sales` مسجل في القارئ على المسار `/UserGuide/sales` ويغطي الوضع الحالي للموافقتين، حجز الوحدات، المقدم والتحصيل، الفواتير المتعددة بالمبلغ أو الوحدات، حد إجمالي العقد، التسليم الجزئي، Due Installments والإغلاق. تم تصحيح وصف تكلفة الشراء ليذكر أن التكلفة مطلوبة للفواتير النهائية أو المرتبطة بوحدات، بينما فاتورة المبلغ/المرحلة الجزئية لا تختار وحدة ولا تتطلب تكلفة شرائها. تظل إتاحة الفوترة الجزئية في قاعدة البيانات معلقة حتى تطبيق Migration `SalesAgreementPartialInvoices`.
