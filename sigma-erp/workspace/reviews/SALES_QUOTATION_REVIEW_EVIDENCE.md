# Sales Quotation — bounded review evidence

## Tabbed editor presentation contract — 2026-10-27

| Item | Frozen decision and evidence |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Authorization / scope | Owner requests splitting SalesQuotation into tabs and updating documentation. Bounded frontend presentation amendment; preserve existing business/API contracts and working-tree changes. |
| Entry and shape | pages/routing.ts SalesQuotation lazy route -> SalesQuotation_Routes -> DetailsComponent create/edit/view/details. UI screen02, UI13 full-height peer tabs, UI14 shared collection and UI21 shared print session. Existing backend Pattern2 no-posting quotation aggregate unchanged. |
| Panels | Basic Information: date, valid-until, customer, saved customer code and currency. Items: existing model/notes/quantity/price/tax table and single header Add. Payment Terms: down payment, installment count and terms/conditions. Existing summaries and Save/Close remain fixed outside the panel region. No Documents tab because this editor has no attachment contract. |
| State and guards | One persistent typed parent form and mounted controls; native hidden uses the existing global hidden rule. Switching tabs preserves row/control identity and avoids remounting DocumentCurrency and repeating its direct policy/customer reads. Shared EditorTabs owns RTL keyboard/ARIA; busy guards tab changes. No save/discard/navigation on tab change. |
| Validation / print | Select the invalid field's panel before shared focusField; empty required items selects Items/Add. Negative remaining/down-payment error opens Payment Terms. Shared ReportPrintSession temporarily reveals every panel, retains active tab and releases through afterprint/destroy; both shared FormSection and EditableCollectionTable hosts use sigma-print-flow. |
| Analysis-guide gate | Read reference entry, guide chapter6 quotation subsection and original S182 library/pages/c555b4b275c5325e.html. The source describes Lease quotation header/vehicle rows, not Sales price/payment/approval authority. Accept only header/row grouping as context; no new lease-rate, contact-person, API or financial rules. Compared current Sales contracts and sales-guide.ts quotation topic. |
| Cache/loading/query scope | No service or backend query change; preserve operational detail and writes, approved Customer source cache/watch, direct CarModel source and direct tax/financial-policy/currency reads. Mounted hidden panels prevent tab-induced bootstrap/read duplication. Existing error/Retry/page lifecycle and retained-data refresh owners remain; actual source/URL evidence reconciled at handoff. No schema/index change justified by panel composition. |
| References and packets | Initial eight-packet drift check passes. PHASE03 and existing UI1/13/14/21/22/29 rules apply; real shared EditorTabs, FormSection, EditableCollectionTable, focusField, ReportPrintService contracts inspected; shape-approved Job editor and RentalQuotation source inspected without copying legacy shell geometry. |
| Exclusions | No new fields/actions/permissions/tax/approval transitions, list/backend/source-wide modernization, migrations, builds/tests/lint/browser/DB/commits. No agents: layout, focus, printing and guide depend on the same bounded presentation contract. |

### Tabbed editor implementation and reconciliation — 2026-10-27

| Item | Final source evidence |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Implemented files | SalesQuotation/components/details/details.component.ts/html/scss; i18n/vocabs/en.ts and ar.ts; UserGuide/content/sales-guide.ts. Existing pending lookup/loading/validation changes in these files preserved. |
| Source conformance | EditorTabs public typed EditorTab key/input/output contract imported by the standalone consumer; workspace appearance, stable tab/panel ARIA IDs, nonshrinking strip. Three zero-basis shared flex-root panes use the existing global hidden rule; basic/payment have one editor-scroll, Items keeps FormSection fill and shared table sticky/frame scrolling. Removed obsolete40% stacked-header allocation. Existing summary/footer remain outside bounded panes. |
| Actions/fields | One persistent form, all existing field names/limits/IDs/row factories/validators/payload mapping retained. Terms/conditions moved into Payment Terms. Exactly one Items header Add; no child addLabel. View still uses the same disabled form and existing read labels; no new permission/action. |
| Validation | Empty items opens Items and focuses header Add. Header and payment controls carry typed owning-tab keys before shared focusField; row errors select Items, and excessive down payment selects Payment Terms. Shared focus waits for rendered layout and scrolls the existing region. |
| Printing | ReportPrintService.createSession owns printing signal, render-frame preparation and afterprint/destroy release. Every panel is revealed while printing, active tab remains unchanged, and all bounded section/table hosts use sigma-print-flow. Busy includes print and disables tab/action changes. No feature print timer or direct window.print. |
| Documentation | Updated bilingual Sales Quotation topic in sales-guide.ts, existing /UserGuide/sales reader/menu: three tabs, fields, totals, invalid Save, read-only View and all-section Print. Promoted mounted read-owner lifetime to UI13 and the execution skill with a revision row; no competing shared component/style/cache introduced. |
| API/domain/mapper/schema | Existing frozen quotation business/read/write/action contracts retained. No backend, AutoMapper, domain calculations, DTO, entity, EF/index, migration or snapshot change. No Add-Migration required. List/columns/filters out of scope and preserved. |
| Performance | Existing editor bootstrap still launches detail and permitted lookups; selected panels do not invoke any service or recreate DocumentCurrency. Zero new request/query paths from switching tabs; source evidence is not measured network/SQL/render speed. Root/owned-row volumes and SQL plans unchanged by this presentation task; no index justified for panel switching. Owner compares identical tenant/document/row count/build/device conditions, cold/warm loads and repeated tab/print use, capturing request count, payload and render time. No baseline or speed claim fabricated. |
| Loading conformance | Actual /SalesQuotation lazy route has no showPageLoading=false; LayoutComponent defaults true and owns its shell overlay. Detail/save/domain actions retain existing start/finalize pairs and DestroyRef cancellation, detail/lookup inline failure and Retry, mutations interceptor feedback. ReferenceLookupStatus owns required page bootstrap. DocumentCurrency retains its shared page-scope status and cancellation/Retry. Hidden persistent panels do not reset pending progress; shared route/query lifetime unchanged. Runtime visibility pending. |
| Source verification | Complete scoped component diffs reviewed; imports resolve to real shared files/public declarations. No new runtime entry or project references. New translation keys sections/basicInformation exist once in both SalesQuotation vocabularies. Source whitespace/conflict checks and final eight-packet Check pass; no application compiler or runtime success claimed. |
| Phase boundaries | Applied bounded discovery/current-contract amendment, Phase03 presentation and Phase06 source reconciliation. Phase01/02/04/05 implementation skipped because API/list/actions/routing unchanged. Existing guide/reader reused; no new workflow. |
| Owner acceptance | Create/Edit: enter header, add multiple lines, change payment terms, switch panels and confirm draft/dirty/value retention; invalid header/row/payment and empty items; busy confirmation/save/read prevents switching. View and Print from each panel include all sections/rows/totals and restore the selected tab. Check narrow/intermediate/wide/short-height, EN/AR, RTL/themes and print pages; browser/build/tests not run. |
| Suggested commits / commands | Frontend suggestion: refactor(sales-quotation): organize editor into persistent tabs. Documentation suggestion: docs(sigma): document quotation tabs and persistent read owners. No build, tests, lint, browser/runtime, DB, migration, commit, push, deployment, Graphify or Sigma MCP executed. No agents needed for this sequential presentation slice. |

Affected editor cache/read inventory (actual paths; no eligibility changed):

| URL / consumer | Existing source classification and lifetime |
|---|---|
| SalesQuotation/GetByWithNavigationsId/{id} / SalesQuotationService.getDetail | Direct operational detail; finite response and inline failure/Retry, no cache/watch. POST/PUT SalesQuotation and existing action URLs stay mutations. |
| Customer/GetSelect / getCustomers -> CustomerService | Approved BaseService/ReferenceLookupCacheService source. Successful finite bootstrap before separate watchCustomers binding; selected-ID/current-option getters retain labels/drafts, context clearing and destroy lifetime remain. Company/Individual writers and positive imports invalidate Customer source; lookup-customers realtime topic names the actual producer types. No new writer introduced. |
| CarModel/GetSelect / getCarModels | Documented direct source: no opted-in source service; finite reads and selected saved labels preserved, no implicit cache. |
| SettingsCommonModel/GetMySetting / TaxSettingsService -> CommonSettingsService | Explicit shared settings-cache singleton source; scoped exact-URL cache, success-only Common writes invalidate and settings-common tenant topic exists. Existing optional tax-default/failure policy retained, no new permanent replay or financial rule. |
| Currency/GetFinancialNumberPolicy / DocumentCurrency -> FinancialNumberPolicyService | Existing direct financial-policy contract/coalescing; no reference-cache opt-in/watch. Same mounted DocumentCurrency retains the request lifetime across tabs. |
| Partner/GetByWithNavigationsId/{id} / DocumentCurrency -> PartnerCurrencyLookupService.getCustomer | Direct operational customer billing/currency read for unsaved partner context; persisted saved currency precedence, replacement cancellation, error/Retry and teardown unchanged. No cache/watch. |

Packet maintenance: generator refreshed all eight outputs after UI13 promotion; semantic review checks the existing UI13 full-height/print rule, phase boundaries and approved reference roles. Final generator Check is the source-of-truth drift result; generated files were not hand-edited.

| Field | Value |
|---|---|
| Status | Draft |
| Owner verification pending | yes |
| Date | 2026-10-04 |
| Request | Read-only review of `src/app/modules/Sales` |
| Ownership | SalesQuotation frontend, Sales reason dialog/status helper, directly owning quotation backend |
| Contract | Existing Frozen `SALES_CYCLE_CONTRACT_FREEZE.md`; no contract or application changes |

Source review only. Root reports the eight current recipe drift checks as passed. Authority: full Sigma AGENTS, sigma-screen-refactor skill, canonical screen 02 and 09; Master 4–5, UI 1/13/14/19/21/22/28/30, BE 3/4/7/14/19 and applicable Phase 1–4 packets. Approved reference source inspected: Workshop Job list/editor/close-job, PurchaseOrderService and the single-collection RentalQuotation editor. The RentalQuotation source retains legacy shell details, so owning book values prevail over those details.

## Confirmed findings

### SQ-01 — P1: removed lines still contribute to saved payment terms

`F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/SalesQuotationService.cs:128` marks omitted children through `DeleteRange`, then `:156` recalculates payment terms before saving. `F:/My Work/Sigma/SigmaBackend/SiGma.Repos/Repository/Repository.cs:189` only calls `RemoveRange`; the children remain in the collection and their `IsDeleted` value changes only during `HandleAudit` at save (`F:/My Work/Sigma/SigmaBackend/SiGma.DataAccess/SiGmaDbContext.cs:483`). Domain totals filter `IsDeleted`, not EF state (`F:/My Work/Sigma/SigmaBackend/SiGma.Helpers/Models/Sales/SalesQuotation.cs:32`).

Trigger: retain one of two existing lines with gross 105 each, down payment 0 and two installments. The detail after save has total 105 but persisted remaining amount 210 and per installment 105. An API update with a down payment above the retained total can also pass the pre-save check. Exclude omitted children from the in-memory calculation before the one save, using the canonical reconciler/removed-row handling. Do not add another save solely to fix calculation order.

### SQ-02 — P1: quotation state checks do not protect concurrent writes

`F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/SalesQuotationService.cs:98` checks editability before awaited validation and mapping; `:464` checks a transition source before an unconditional tracked save at `:469`. `SalesQuotationConfig.Status` is not a concurrency token; the common model registers only SubscriptionId as a token. There is no conditional status update, lock, or state-root check for child-only updates.

Trigger: an edit loads Pending, a concurrent request approves it, and the edit resumes and saves new prices/lines while the quotation remains approved. Concurrent approve/reject requests can also both pass the Pending check and overwrite the terminal outcome. Unapprove checks downstream agreement/receipt existence separately at `:378–385`; a receipt created between that check and save is not protected by a dependency invariant. Apply one documented strategy to all participating writes and dependencies, including a forced root-state check for child-only changes. EF's one-save transaction does not protect earlier state/dependency reads (BE14).

### SQ-03 — P2: backend VAT and row gross disagree with the document preview

`F:/My Work/Sigma/SigmaBackend/SiGma.Helpers/Models/Sales/SalesQuotationItem.cs:19` independently rounds tax for each line; quotation totals sum those line taxes. The frontend summary uses per-rate `documentTax` at `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Sales/SalesQuotation/components/details/details.component.ts:202`, but row gross at `:285` independently rounds each line too.

Trigger: two net lines of 0.10 at 5% with currency precision 2. Preview document VAT is 0.01, total 0.21; each row shows gross 0.11, and the backend persists VAT 0.02, total 0.22. Saved remaining amount and installments therefore change relative to the preview. Use `VatPolicy.CalculateDocumentTax`/`AllocateDocumentTax` and the frontend allocation counterpart, sharing the backend precision. D4-4 owns per-rate document rounding; this is a concrete current discrepancy, not a new tax business decision.

### SQ-04 — P2: asynchronous settings load leaves the initial line on the default rate

`F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Sales/SalesQuotation/components/details/details.component.ts:250` subscribes to settings without handling the returned rate, immediately creates the first row at `:260`, and snapshots `taxSettings.ratePercent()` at `:479`. `TaxSettingsService` begins at 5 and asynchronously sets the configured rate; no subscription/effect updates pristine new line controls.

Trigger: first visit to Create in a session where Common tax is 15 and tax is mandatory. The first row retains 5 after the settings response. The UI displays 5 as read-only, and `TaxPolicyService.ResolveRateAsync` rejects Save because it accepts 15 only. Initialize or update pristine new row defaults when settings arrive, without overwriting saved rates or deliberate optional zero selections. UI19 explicitly limits default updates to pristine inputs.

### SQ-05 — P2: detail and lookup failures have two presentation owners and no lookup retry

`F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Sales/SalesQuotation/services/salesquotation.service.ts:45` requests detail without `X-Skip-Error-Interceptor`, while editor `:439/:444` renders inline failure and Retry. Customer/model calls likewise omit skip-error, while `details.component.ts:419` and list `lookupError` render warnings. Both declared and transport errors therefore reach the global API dialog plus an inline error/warning. Required editor dropdown lookup failures have no explicit Retry, so a transient failure leaves Create unusable until reopening.

Choose one feedback owner per operation. Keep an inline recovery path only with request suppression; ordinary mutation interceptor ownership is already consistent. The shared detail consumer in Receipt means any request option change must preserve that consumer's intended error owner.

### SQ-06 — P2: list ignores the server's corrected page after count changes

Backend `GetManyAsync` clamps `pageNo` to the last page and returns the corrected PageNo/PageSize. `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Sales/SalesQuotation/components/list/list.component.ts:305` applies rows and total only.

Trigger: page 3 was valid when opened; another user removes rows so only two pages remain. Refresh asks for page 3, server returns page 2 rows, but the controlled paginator remains on page 3. Row content, range and page controls disagree until the user navigates. Reconcile the returned paging state and route parameters, following the controlled list contract.

## Contract and state inventory

| Concern | Current source contract |
|---|---|
| UI/BE shape | Screen 02 routed quotation document editor; BE Pattern 2 aggregate with quotation lifecycle specialization, no journal on quotation Save |
| Grid columns | no, date, validUntil, customerName, customerCode, amount, status |
| ListVM properties | id, no, date, validUntil, customerName, customerCode, status, amount — exact visible shape plus id |
| Filters | no, customerId, dateFrom, dateTo, status; current-month default; sort inside Filters; BE also accepts unused legacy exactDate/internalApprovalStatus/customerApprovalStatus |
| Paging/export | shared DEFAULT_PAGE_SIZE, options 10/15/20/50/100; switchMap + defer list stream, real Count/TotalPages, deterministic tie-breakers; fetchAllPages + translated DataTable export rows |
| Detail | header identity/date/validity/customer labels/status/reason/terms/payment terms/totals; items with id/model/name/notes/unit/unitPrice/taxPercentage/amount/amountWithTax |
| Add | date, validUntil?, customerId, termsAndConditions?, downPayment, numberOfInstallments, items(modelId/notes/unit/unitPrice/taxPercentage) |
| Update | Add plus root id and saved child ids; full snapshot; saved ids checked for duplication and parent ownership |
| Calculation ownership | amount/gross/remaining/perInstallment excluded from write payload, backend owns persisted results; observed SQ-01/SQ-03 failures remain |
| State | Pending=1, InternallyApproved=2, InternallyRejected=3, CustomerApproved=4, CustomerRejected=5, Converted=6; enum parity verified |
| Child CRUD | Angular standalone SalesQuotationItem module absent; BE SalesQuotationItemController is NonController; service/VM remnants remain but no standalone HTTP controller |
| Mapping | explicit one-way maps; Update Items ignore justified by manual reconciliation; SubscriptionId/No ignores obsolete because UpdateBaseVm contains Id only |
| Tenant boundary | Repository.Query/Exists tenant/live scope; no client tenant/status/No/derived values in write models |

| Action | Source → target / owning validation | UI |
|---|---|---|
| Internal approve | Pending → InternallyApproved | confirmation |
| Internal reject | Pending → InternallyRejected; trimmed reason 5–500 | typed shared Sales reason dialog |
| Customer approve | InternallyApproved → CustomerApproved; validity date not passed | confirmation; expiry display gate |
| Customer reject | InternallyApproved → CustomerRejected; reason 5–500 | typed shared Sales reason dialog |
| Revise | InternallyApproved → Pending; clear reason | confirmation |
| Unapprove | CustomerApproved → InternallyApproved; no live non-cancelled agreement/non-void receipt | warning confirmation; SQ-02 dependency race remains |
| Open agreement | CustomerApproved and not expired → agreement Create route; agreement service owns conversion | route navigation |
| Down-payment receipt | CustomerApproved or Converted on backend; positive down payment/no live receipt; no quotation state change | UI exposes only CustomerApproved; Receipt owns actual save |
| Edit/Delete | Pending or InternallyRejected; editing rejection returns Pending | route/confirmation; SQ-02 state race remains |

Ordinary Save/Search/paging/Export/Print are not domain transitions. Busy flags and finalize cleanup are present. View shows labels and disables the form; create/edit uses one typed FormArray/EditableRows. Shared reason dialog has typed 5–500 validation, controlled dirty discard, busy close protection and correct title/subtitle. No frontend permission mechanism is invented; visibility is presentation.

## Canonical drift and lower-priority follow-ups

| Concern | Current evidence / disposition |
|---|---|
| List shell | Shared route/list/panel/title/filter/table fill chain matches consumers; no feature SCSS or legacy table wrapper |
| Routed collection layout | Editor puts header, item section, payment terms and totals inside one `sigma-editor-scroll`; item section lacks fill/table fillHeight and Add lives inside the table. UI13 approved bounded collection variant instead gives the collection remaining height, section-header Add, row scroll and fixed summary. Recorded conformance drift; source has one pane scroll so no claim of browser-page overflow |
| Validation focus/parity | Save marks controls touched but does not focus first invalid. Integer unit/installment controls have min/max only; decimal values pass Angular validators and fail int API binding. unitPrice frontend lacks API maximum. Maximum date maps to dateRequired instead of a contextual future-date message |
| Failure localization | service static Success/Fail at lines595–599 returns literal English, ignoring the injected localizer; Arabic UI sees English backend business failures. Dynamic invalid-transition text likewise bypasses localization |
| Lean details | SalesQuotationDetailVM and item detail inherit unused tenant/audit/flags and child No through DetailBaseVm; BE3 permits explicit lean details. Verify all actual detail consumers before narrowing |
| Override audit | DetailAsync and DetailWithNavigationsAsync both forward to same GetDetailAsync; GetManyWithNavigationsAsync forwards to GetManyAsync; Controller.GetListAsync just repeats the base. BE14 requires justification per consumed distinct behavior, not symmetry |
| Class layout/shared helpers | nested named ItemInput record struct at service:601 violates one named class/record per file; private Clean/TryGetFilter parsers and manual child loop duplicate established owners. These are conformance findings, not independently proven functional failures |
| Print | ReportPrintService owns print; outer bounded layers carry sigma-print-flow; no bare window.print. Auto-print uses uncancelled setTimeout rather than a destroy-aware pending print lifecycle. Actual print/RTL/dark/narrow acceptance pending |
| Date filter | Search does not reject invalid filterForm; parseDateRange null values can discard invalid typed range instead of explaining it. Date range template lacks date field feedback. Recovery should retain the typed invalid input |
| Contracts changed | None. Frozen business lifecycle remains historical authority. CustomerRejected has no revision action by existing contract; do not invent one |

## Source-only reconciliation

- Frontend repository root verified as `F:/My Work/Sigma/SiGmaAngularFrontEnd`. Complete scoped working diff is two status-label corrections (`salesQuotation.status` → `general.status`) in list TS/HTML; staged scoped diff empty. No untracked scoped quotation/shared files.
- Backend repository root verified as `F:/My Work/Sigma/SigmaBackend`. Quotation-owned scoped status/working/staged diff empty; current committed source reviewed. No untracked scoped files.
- Scoped diff whitespace checks and merge-marker searches produced no issues. No application, configuration, instruction, contract or main review edits made by this agent.
- Discovery/domain/read/detail/actions audited; root owns integration/final full-Sales reconciliation. No screenshots supplied for this Sales request. Findings are source-supported; no runtime verification claimed.
- Migration: none created/edited/run. Existing Frozen cycle's owner-run SalesCycleCompletion remains historical pending schema work; this audit does not establish deployment/migration application. A status concurrency token can use existing persisted Status without a new column; specific implementation/migration decisions wait for the authorized fixes.
- No builds, tests, lint, browser automation, app verification, database commands, Graphify, Sigma MCP, migrations, commits or pushes run.
- Manual owner checks after authorized fixes: remove saved lines then compare remaining/installment; concurrent approve/reject and edit/approve; two small taxed lines and non-2 currency precision; fresh-session mandatory non-default tax; lookup/detail failure/retry; page count shrink; long item collection and print/RTL/theme.
- Suggested future commit messages only: frontend `fix(sales): reconcile quotation previews, tax defaults and list recovery`; backend `fix(sales): reconcile quotation payment terms, VAT and lifecycle concurrency`.
