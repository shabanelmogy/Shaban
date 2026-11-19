# Customer Statement of Account

## Loading follow-up — 2026-10-26

Tier S: owner reports unnecessary filter loading and requests reviewing loading for improvements. Scope: this report's progress presentation and customer reference-read lifecycle; existing financial/API/filter/output contracts stay frozen. UI type07 Report, backend pattern5 Report. No screenshots or missing business decisions. All eight recipe drift checks passed; PHASE-05 routing/lifetime checks applied proportionally with UI2/22/28/29 and Master1/5/7; no packet refresh needed.

Before-edit conformance decisions:

| Concern | Owner/reference and actual source | Decision |
|---|---|---|
| Customer filter progress | UI22; `loadCustomers`, PrimeNG Select loading input and a second StateMessage in list.html | Retain the select-local indicator/busy guard, remove the duplicate loading panel. Never show no-customers during initial loading. |
| Report progress | UI22; `search`, LoadingService, LayoutComponent showPageLoading and content overlay | `/StatementOfAccount` imports CustomerStatementRoutes → CustomerStatementComponent; no false metadata override. Keep one global host, remove duplicate report StateMessage; retain form/action guards and region aria-busy. |
| Customer cache refresh | UI2; actual BaseService read/watch and ReferenceLookupBindings public contracts inspected | Keep successful finite bootstrap, then bind one separate watch with selected-ID/current-options getters and DestroyRef cleanup. Retained-data refresh stays usable/silent; shared status shows refresh errors/Retry only, because the dropdown already owns initial progress. |
| Layout/output | UI20; actual shared ReportPage/ReportActions and current typed DataTable consumers | Retain shell, five complete local arrays, totals, tabs, print and exports. No shared presentation extraction: existing shared owners already cover this change. |

Final status: implemented for this bounded loading scope, source-only; runtime/network/timing acceptance pending. This is not a renewed full business audit of the historical review below.

### Final loading, cache and performance evidence

| Operation/source | Final producer → consumer evidence | Final ownership/recovery |
|---|---|---|
| `GET ${environment.baseUrl}Customer/GetSelect`, `Results<DropDownSelect>` | CustomerService.cacheSelect=true → BaseService.getSelectList/readReferenceSelect → ReferenceLookupCacheService.read → loadCustomers finite successful bootstrap → separate ReferenceLookupBindings.bind('customers', watchSelectList) | Only Select shows initial/no-snapshot progress and aria-busy; no separate filter loading panel/global start. takeUntilDestroyed/finalize releases initial busy and syncs control on success/false/HTTP failure/destroy. Bootstrap failure retains inline error/Retry, no watch binds until success. Empty warning excludes pending/error states. |
| Same reference source, retained refresh/context reset | Shared bind receives current customerId/current customers getters; callback updates options and syncCustomerControl only, never patches the form/report | Retained-data refresh has binding.loading=false and leaves current options/control usable; shared ReferenceLookupStatus shows errors/Retry without another spinner. refreshSelectList invalidates the exact source family. Selected label/draft survives fresh empty options; explicit context reset clears old labels, disables an empty selector and never restores prior-context labels. Shared DestroyRef tears down the watch. |
| Customer reference producers/invalidation | CustomerService.SelectAsync projects Partner Id/Name/No for this tenant, nondeleted Individual/Company rows; CompanyPartnerService and IndividualPartnerService declare selectCacheDependencies=['Customer'] and use the inherited success operator. ImportCompaniesService/ImportIndividualPartnerService refresh customers on positive savedRows. Shared URL mapping Customer→lookup-customers matches RealtimeServiceCollectionExtensions registration for Company/IndividualPartner | Existing root cache owns finite reads, notification/TTL/tab-return/context fences and retained refresh. No source-eligibility change, replay cache, socket or producer modification. Network coalescing and live tenant isolation remain owner acceptance. |
| `GET ${environment.baseUrl}Customer/Statement`, `Result<CustomerStatement>` | CustomerStatementOfAccountService.getStatement with unchanged serialized filter/inline feedback → search → subscribed defer startLoading → takeUntilDestroyed + filter value-change cancellation → finalize endLoading | One actual shell content overlay (LayoutComponent.showPageLoading defaults true on this route); duplicate report StateMessage removed. Region aria-busy and existing form/print/search/refresh/tab guards retained. Both business and HTTP errors remain inline, search/refresh retry after finalization. Same-path query/fragment changes preserve LoadingService count; real path departure resets it. |
| Local paging/print/Excel | Existing complete report arrays, typed columns, backend totals and ReportPrintService; Excel uses the active full array/grouped charges | No additional HTTP or loading overlay for local paging/export. Printing keeps existing independent form/busy protection. No API/DTO/ListVM/AutoMapper/domain-calculation change. |

Performance source audit: initial opening makes one finite customer-reference demand (fresh cache can satisfy it); mounting its separate watch reuses that source rather than adding a second adapter/request. CustomerService.SelectAsync performs one no-tracking, tenant/live/type-filtered projection ordered by PartnerType/Name, returning all matching choices; no per-option reads. Search remains one report HTTP request. GetCustomerStatementAsync has up to ten explicit database materialization/aggregate boundaries for ledger with lines (partner, AR accounts, opening sum, cutoff lines, batched allocations, current sum, deposits, batched refund dictionary, pending PDCs, advance-tax rows); outstanding skips the opening sum and empty cutoff lines skip allocations. These are source boundaries, not measured SQL commands. Sequential EF access is preserved on the existing context; no database call was found inside the allocation/line loops. History through the cutoff is required for matching; full arrays, five local pagers, complete print and active-section exports retain the frozen contract. Large customer/history/response volumes remain an owner measurement risk. This change improves progress ownership and retained refresh behavior, with no claim of faster SQL or measured load time.

Index disposition: no new index is justified by this presentation/lifetime change. Inspected actual SelectAsync predicates/order and PartnerConfig mapping/relationships plus JournalVoucherDetailConfig/JournalVoucherConfig FK mappings against the report predicates. Deployed composite coverage, cardinality, plans and IO remain unknown; do not infer an absent index from these files or add speculative schema/storage/write costs. A future measured bottleneck needs BE2's exact key/INCLUDE/filter and overlap evidence; no EF/schema/index change or migration is required here.

Comparable owner measurements pending: use the same build/API/database, tenant, customer count/history volume, customer/date/report-type filters, page size and device/network; compare at least five cold and five warm opens and report searches per version, record sample count, median/range, initial usable filters versus settled report, HTTP count/payload, SQL plans/commands/reads/duration where available and render time. Preserve the same rows/totals/output. No elapsed-time target or speed gain is invented. Check slow lookup, retained refresh and refresh failure, initial false/HTTP failure/Retry, report failure/cancel/departure, same-path URL changes, light/dark and Arabic/English. Verify one visible progress owner per operation, usable retained choices and unchanged financial results.

### Files, guide and verification

- Frontend: StatementOfAccount/components/list/list.component.html and .ts; corresponding .spec.ts mocks updated and two behavioral cases added for retained refresh/error/Retry/selected draft, context clearing and watch teardown. Existing request failure/cancellation specs remain. Tests were authored but not executed.
- Guide: `modules/UserGuide/content/customer-report-topics.ts`, existing customer statement topic, English/Arabic note on initial load, silent usable updates, failure/Retry and report progress. Reuses CUSTOMERS_GUIDE in GuideReaderComponent, `/UserGuide/customers`, existing customer sidebar guide entry and `/StatementOfAccount` topic route.
- Source verification: complete scoped four-file frontend diff reviewed; `git diff --check` passed. Installed Angular parseTemplate reported zero errors; TypeScript createSourceFile syntax parsing reported zero errors for component, spec and guide. Installed PrimeNG Select.loading declaration, ReferenceLookupBindings/Status, PrimaryActionButton global-indicator suppression, LoadingService and actual shell host were inspected. Parsing is not compilation, test execution or runtime acceptance.
- Review artifact: this existing file updated; no separate contract or checklist artifact. No new reusable convention/book/skill/packet change; existing owners and owner-requested removal of duplicate filter progress are applied directly.
- Phases: focused discovery/contract confirmation, UI loading/cache lifetime and integration source reconciliation; write/domain-action/backend implementation skipped because those contracts are unchanged. No subagents: one small sequential file set, no independent implementation workstream. Unrelated working-tree changes preserved.
- No build/test/lint/browser/application/database/migration/snapshot/commit/push/deployment/Graphify/Sigma MCP action ran. Suggested frontend commit, covering only the four files above: `fix(customer-statement): simplify loading and retain refreshed choices`.

## Owner follow-up: first filter row — 2026-10-03

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Authorization | Put the first two filters together with Report Type in one row |
| Scope | StatementOfAccount/components/list/list.component.html only; earlier working-tree changes preserved |

The later presentation decision is frozen in CUSTOMER_STATEMENT_FRONTEND_CONTRACT_FREEZE.md. Type07 Report remains on UI20's shared report strip and the checked PHASE-02 packet. Source discovery identifies Date Range and Customer as the first two filters. They now share one full-width wrapping flex row with Report Type, in that order; Include Inactive and the existing action toolbar follow. Report Type options use the same flex/wrap utilities inside the labelled radiogroup. Existing Bootstrap mw-100 removes the shared fields'300px cap for this row; their equal flex basis/growth and170px minimum remain owned by styles.scss. Shared narrow-screen rules release the minimum and stack the fields. No feature filter SCSS, duplicated strip surface, or shared-component change.

| Concern | Final conformance evidence |
|---|---|
| Shared visual owner | UI4/20, actual Accounts/TrailBalance report filter HTML and styles.scss report-field/control/check/actions values inspected; existing shared strip and34px controls retained. Bootstrap utilities are defined by the imported utility owner. |
| Filter form / accessibility | Angular template AST reports main-row fields dateRange/customerId/reportType, all five existing control bindings including both reportType choices under filterForm, Search submit search(), followed by the inactive label and action toolbar. Existing IDs, associated labels, radiogroup and control values retained. |
| Behavior / contracts | HTML placement only. Existing initial/reset values, validation, load/print busy gates, inline error owner, applied filters, request cancellation, grids and full print/export semantics retained. No TypeScript, translation, backend/DTO/AutoMapper/calculation/schema/migration change. |
| Verification | Complete one-file frontend Git diff reviewed; scoped diff --check passed. Angular parseTemplate returned no syntax errors. Source inspection establishes placement and bindings; no build/runtime/visual verification is claimed. |

Phase02 presentation and its scoped source reconciliation applied; other implementation phases skipped because no workflow/API change. All eight recipe drift checks passed. No subagents for this small sequential layout change; no screenshots or unresolved new business decisions. No prohibited build/test/lint/browser/application/DB/migration/snapshot/commit/push/deployment/Graphify/Sigma MCP action was run. Suggested frontend commit: `fix(customer-statement): align primary filters in one row`.

Owner visual verification pending: check the three fields share one row at normal desktop width in English/Arabic and light/dark themes; confirm narrow-width wrapping, radio selection, Include Inactive and Search/Refresh/Reset/Print/Excel behavior. Existing broader review acceptance below remains historical and separate.

### Report Type blue and row separation follow-up

Implemented — source-only; owner visual verification pending. Owner requested the usual blue for Report Type and a small separation between rows. Changed the same Statement HTML plus src/styles.scss: opt-in sigma-report-filter-choice on the existing radiogroup uses Sigma primary#3498db, primary-hover and shared focus-ring tokens for selected/hover/focus states; other groups do not opt in. Existing PrimeNG radio IDs, labels, ledger/outstanding values, form parent and disabled behavior retained. Installed Lara rules were inspected: their hard-coded blue cannot be changed by setting native accent-color. The shared owner overrides those rules without feature-local/deep selectors or a separate palette. row-gap-3 on this form supplies0.75rem from the actual Metronic spacer map; first-row gap/wrapping is retained.

Conformance: UI20/24 own report styling and primary tokens; UI20 opt-in radio recipe and skill §6.1/history are synchronized with the final shared rules (book1.57). Row spacing is recorded only in this feature's frozen amendment. Eight generated packets regenerated with the official generator and checked OK; templates/reference ownership/report business semantics remain unchanged. No hand-edited generated file.

Source verification: complete frontend scoped HTML/styles diff reviewed; diff --check passed. Angular parser reports no template errors and the same two reportType bindings; PostCSS parsed all four added shared state rules and their declared token values. No translation/TypeScript/API/DTO/backend/AutoMapper/domain/schema/migration change. Focused Phase02 appearance/source reconciliation only, no subagents or prohibited commands. Suggested frontend commit: `style(customer-statement): use Sigma radio accent and separate filter rows`. Owner acceptance: check selection/hover/keyboard focus/loading disabled states in both themes and languages, and the gap/wrapping between rows. No runtime/visual acceptance claimed.

## Owner follow-up: title and filter card width — 2026-10-02

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Authorization | Owner requests the title card match the filter card width in StatementOfAccount, then extends the same request to ReceivableAgeAnalysis, with documentation. |
| Scope | One presentation rule in the two existing type 07 report templates and their shared global style; prior working-tree changes retained. |

Before-edit decision: extend the existing shared report styles with opt-in `sigma-report-panel--aligned-title`, adopted by these two panels. Its title uses `margin-inline: 0`, matching the filter strip's zero inline margins. Retain the existing title's block spacing and panel padding. Do not change all report consumers or add feature-local CSS. This explicit owner choice supersedes the earlier Trial Balance title-inline conformance for this report only.

| Concern | Owning block | Actual reference/value | Shared owner and target comparison |
|---|---|---|---|
| Report shell | UI 1/20 | TrailBalance list SCSS: panel padding 16px 14px 14px, responsive 12px 10px; title margin -8px -6px 16px | `src/styles.scss` owns the same bounded report shell; StatementOfAccount title is its direct child. Keep shell/block spacing; owner authorizes changing only title inline margins. |
| Matching card edges | UI 3/20 | `feature-title.component.scss`: host margin 8px 8px 16px; global report override -8px -6px 16px; `.sigma-report-filter-panel`: margin 0 0 6px | Current title is 12px wider than filter. Shared opt-in clears only title inline margins; both siblings stretch to the same panel content width at every breakpoint and direction. |
| Contracts and output | Master 4/7 | Existing typed report controls, tables, actions, response and print bindings in list HTML | No filter, column, DTO, paging, action, calculation, route, provider or translation change in this follow-up; this is not a new full report audit. |

Phases: focused Phase 2 layout correction and Phase 6 scoped reconciliation; backend/write/domain-action/runtime phases are not applicable. No screenshot or missing business decision. Shared-extraction gate: one global modifier for both consumers. No migration or backend/mapping change. Root handles this small shared rule without subagents because parallel work would add coordination overhead. Implementation and final source checks pending.

## Review and confirmed fixes — 2026-10-02

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Authorization | Review StatementOfAccount and fix issues if found |
| Frozen handoffs | CUSTOMER_STATEMENT_FRONTEND_CONTRACT_FREEZE.md; CUSTOMER_STATEMENT_BACKEND_CONTRACT_FREEZE.md |

Scope: existing frontend report, its directly related Customer/Statement API and English/Arabic labels. UI type 07 Report and Backend Pattern 5 read semantics; existing owner-approved null filters, tabs, fill grids/local paging, neutral exports and full-report print remain. No screenshot evidence or new business workflow. Recipe drift check all eight OK. Both frozen handoffs record pre-edit evidence and the final filter/column/response/totals contracts. Prior uncommitted changes are preserved, including other report methods in CustomerService.cs and other translation blocks. Concurrent edits detected during discovery were paused; the owner explicitly stopped the other session and authorized continuation (كمل انا وقفت).

Confirmed findings fixed: null ageing summary fabricated zeros; failures also displayed no-data messages; five local pagers omitted translated text; voucher/deposit-status identities stayed English in Arabic; includeInactive label was ambiguous; filters could invalidate a document during print preparation. Backend findings: refund amount used cumulative consumption and refund date used deposit creation; ledger allocation columns stayed zero; header allocations chose the first credit without paired capacity/cutoff reconciliation; advance ages could be negative; beginning balance materialized rows before summing; invalid filters and missing AR configuration did not reliably fail with localized messages.

### Files changed in this task

| Repository | Owned edits |
|---|---|
| SiGmaAngularFrontEnd | StatementOfAccount/components/list/list.component.ts and .html; StatementOfAccount/models/list.ts; customerStatement block only in modules/i18n/vocabs/en.ts and ar.ts |
| SigmaBackend | GetCustomerStatementAsync only in SiGma.Business/Services/Customers/CustomerService.cs; CustomerStatementDepositDto.Refunded in SiGma.Helpers/Reports/CustomerReports/CustomerStatementDto.cs; three GeneralMessage entries in SiGma.Helpers/Localization/Shared/GeneralMessage.resx and GeneralMessage.ar-SA.resx |
| Review artifacts | This section; CUSTOMER_STATEMENT_FRONTEND_CONTRACT_FREEZE.md and CUSTOMER_STATEMENT_BACKEND_CONTRACT_FREEZE.md |

Statement SCSS, shared components/styles, routes/providers and existing specs were reviewed but not changed by this task. Their existing working-tree changes remain owned by earlier work. Both source repositories were identified and their scoped diffs reviewed separately; the temporary discovery snapshots distinguish this task from preexisting changes. The service comparison after removing the statement method returns exact equality outside that method (normalizing line endings only).

### Decisions and final conformance

| Concern / owner | Reference and final source evidence | Result |
|---|---|---|
| UI shape, bounded layout, theme — UI 1/3/20/24–25 | Approved Accounts/TrailBalance report reference, report-page/report-actions and shared styles; existing sigma-route-host, report-page--fill, flex/min-height chain and structural-only Statement SCSS retained | Source conforms; no visual verification claim |
| Columns/response — Master 4/5, UI 20, BE 17/18 | Ledger: date, voucherType, voucherNo, description, age, poNo, allocations, debit, credit, dueAmount (outstanding), runningBalance. Advance uses the same list minus poNo. Deposits: depositNo, type, date, agreementNo, amount, used, refunded, refundDate, status. PDC: chequeNo, chequeDate, bank, amount. Ageing: seven existing bucket fields plus balance. Corresponding DTO property lists are side by side in the frontend handoff | Report DTOs, no ListVM or unused new fields. Existing optional journal IDs are populated; Angular has no need to consume them |
| Grid/paging — UI 5/6/20 | BalancesSummary/shared DataTable fill and local-paging reference; five lazy=false/fill grids retain complete arrays, independent offsets and shared size options; all bind customerStatement.showingEntries | Counts/totals, print and exports cover complete responses rather than a selected page |
| Errors/nullable states — UI 6/20/22/28 | All five grids bind showEmpty=!errorMessage and distinguish not-run prompts from successful empty output; ageingRows returns [] for null; both request failure channels and lookup retry/finalize remain | Inline error has one owner, no fabricated summary row |
| Translation/export — UI 8/16/23 | Explicit known backend enum maps resolve labels at display/export time; unknown identities and configured payment names remain verbatim; raw voucher identity owns grouped export keys | English/Arabic keys match, language switching keeps stable grouping and current labels |
| Print/filter lifecycle — UI 13/20/21/27/28 | ReportPrintService afterPrint and false-return restore the form/customer state; printing disables form, navigation, query/retry/reset/export actions; existing render frame, all panels, paginator suspension and destruction cancellation remain | Full-report print contract preserved; owner print/cancel acceptance pending |
| Route/provider/security — UI 1/22/29, Phase 05 | pages/routing.ts lazy StatementOfAccount route -> CustomerStatementRoutes -> standalone component; existing root service and Layout provider retained; AppModule owns one intercepted HttpClient; X-Skip-Error-Interceptor and Accept-Language retained; inherited backend Authorize and AuthGuard verified | Existing GET route/wrapper/filter keys preserved. Current UI 1 supersedes Phase 05's old Layout-owned HttpClient wording; no new permission system |
| Boundary/read/query — BE 3/5/17 | Customer lookup producer limits types to Individual/Company; API now matches those identities, positive customer, ordered complete dates and ledger/outstanding modes. QueryReport roots, live same-tenant posted/nonvoid journals, max end-day guard and localized BusinessFailure keys; beginning/current use SQL SumAsync | Invalid/ineligible requests and missing AR links fail explicitly; no financial mutation |
| Allocations — BE 17 | Both eligible customer AR sides loaded through toDate; allocation Date/Id order; explicit detail link or persisted source journal; opposite-sign header queues in detail-Id order; paired remaining-capacity guard; ledger output filtered to fromDate after matching | Ledger allocation display now populated; outstanding matching preserves signed ledger net; future/deleted/foreign/unposted/voided sides cannot reduce balances |
| Refunds/age/order — Master 4, BE 17/18 | RefundDepositAsync stores refund JV and increments cumulative UsedAmount. Report sums qualifying customer debit in that linked live posted/nonvoid JV; Used subtracts only that refund, RefundDate uses JV.Date. Advance age matches Math.Max(0, (Today-Date.Date).Days), Date/Id order; PDC adds Id tie-breaker | Refunded becomes decimal?/number|null in producer/consumer; absent legacy refund renders dash in grid, print and export |
| Calculations/mapping/schema — Master 4/7, BE 4/9/17 | Backend owns balances, allocations, refund split and age. DTO projections are explicit; existing Customer service/controller and legacy DTO file organization kept for compatibility | No AutoMapper mapping/Ignore/ReverseMap changes, new entity, EF configuration, posting rule, domain transition, transaction, schema or migration |

Total scope is explicit: beginning is before fromDate; ledger debit/credit/till-running totals cover the displayed date range; outstanding remaining/ageing covers eligible AR rows through toDate; current balance has no date filter. Age remains based on backend Today and the existing seven inclusive buckets. Deposits/PDCs remain whole-customer sections independent of dates. Advance section retains its original date range and net/running semantics, with matched AR allocation information where eligible. No backend Skip/Take was introduced.

### Source arithmetic and verification evidence

| Case | Final source consequence |
|---|---|
| Debit 100, credit 40, allocation 40 | Remaining +60/0; net +60 is preserved |
| Debit 100, credit 100, allocation 100 | Both remaining amounts zero; no outstanding rows |
| Debit 100, unapplied credit 40 | Remaining +100/-40; total +60, signed credit retained |
| Debit 100, credits 15 and 25, header allocation 40 | Consume credits by Id, both become zero; debit remains 60 |
| Requested match 120 against debit 100/credit 40 | Apply only 40; neither side exceeds its capacity |
| Future allocation/source, non-AR or another customer side | Ignore match; eligible debit remains outstanding |
| Deposit use 20 plus refund 80 | Cumulative UsedAmount 100 projects Used 20, Refunded 80 and persisted JV date |
| Legacy refunded deposit without eligible refund JV | Refunded/RefundDate null; Used retains cumulative amount because split is unknown |

These are arithmetic consequences of the inspected source, not executed tests. Checked translation parity: en 98/ar 98, no missing keys or case differences. Both resource XML files parse and have the same three unique nonempty CustomerStatement entries. Scoped frontend/backend git diff --check passes (only Git line-ending notices); no scoped conflict markers. Full feature TS/HTML/SCSS/model/service/route and changed resource/DTO/method diffs reviewed; no stale added imports or incompatible consumer identified. Initial and pre-implementation checks passed all eight generated packets. The final recheck detected later documentation drift: Phase 01 still passes; Plan 00 and Phases 00/02/03/04/05/06 are stale. Current canonical owning blocks were used for final reconciliation, including UI 20's required actual report-source evidence and BE 17's allocation invariants; no stale packet was treated as authority. Packet regeneration and semantic review belong to the documentation owner; no generated file was edited in this task. No new reusable helper or rule was established, so no skill/book promotion is required.

Phases 00/01/02/05/06 apply: discovery, recorded contract freeze/amendments, report reads/UI, wiring inspection and final source reconciliation. Phases 03/04 are skipped: no detail/write workflow or domain action. No screenshots/videos were supplied; no new Missing/Conflicting requirement blocks the implemented corrections. Existing PONo has no confirmed source in inspected journal/invoice models and remains nullable; no relationship was invented. Voided-deposit history policy remains unchanged. Legacy refund provenance and that policy remain explicit limitations rather than fabricated results.

Agent utilization: one luna_explorer on gpt-5.6-luna performed bounded read-only API/writer discovery and a follow-up final backend audit after handoffs were frozen. No agent wrote files. Root integrated findings, performed all source edits and reviewed the complete scoped diffs. This avoided duplicate frontend review and merge risk while reducing backend tracing time; the smallest team was used.

Late ownership reconciliation: unrelated translation-block changes appeared during final read-only checks. The owner-authorized customerStatement block remained compatible; no further source writes were made over the shared vocab files. The owned Statement feature files and backend statement method retain the inspected corrections. Discovery backups are textual evidence; their BOM/header difference is not claimed as an owned application change.

### Owner verification and commit suggestions

Owner verification pending: compile frontend/backend and verify EF translation of the report projections, then exercise ledger/outstanding against known postings and allocations (partial/full/multiline/unapplied/future/ineligible/over-capacity cases); verify cumulative use/refund split, refund date and missing historical JV; invalid dates/mode/customer, inactive filters and missing account links in both languages. Check initial/loading/error/empty states, every section export beyond one page, language switching, RTL/light/dark/narrow layout, independent pagination, full print/cancel and form restoration. Include a customer with long history to assess the complete allocation read/query parameter/performance behavior.

Add-Migration is not required: no schema changes. Suggested frontend commit: `fix(customer-statement): correct report states and localized output`. Suggested backend commit: `fix(customer-statement): reconcile allocations and refund projections`. Suggestions only; stage/review only owned hunks because both repositories contain unrelated changes. No builds, tests, lint, browser/application checks, database commands, Graphify, Sigma MCP, migrations, commits, pushes or deployment were run. Previous sections below remain historical.

## Shared export button colour — 2026-10-02

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Authorization | Owner rejects the green export buttons and requests continuing the correction |
| Scope | Shared report export variant in src/styles.scss; UI 20, preamble/changelog, skill and generated packets |

| Concern | Owning block / actual reference | Shared owner / frozen target |
|---|---|---|
| Secondary export appearance | UI 20/24/25; Accounts/TrailBalance list btn-excel uses the export variant; Statement HTML uses it for both exports | src/styles.scss owns the variant. Replace green with global text, strong-border and soft-surface tokens, then primary border/balance text and a 7% primary surface on hover/focus. This owner-approved palette change applies to existing shared consumers, without feature overrides. |
| Theme cascade | Existing green base, hover and later dark base in shared styles; root/dark token definitions | Remove the hard-coded dark export block; both themes use the same token rules, so the later dark base cannot suppress hover/focus. Icons already inherit the button foreground. |
| Behaviour / compatibility | Existing shared consumers: TrailBalance, BalanceSheet, LabourActivitiesReport, ReceivableAgeAnalysis and StatementOfAccount | Colour only. Preserve enabled/disabled guards, selected-tab exports, spacing, wrapping, print hiding, financial/API contracts and other action variants. |

Pre-edit packet check all eight OK. Small sequential style correction; no subagents. Discovery/freeze, focused UI action work and source reconciliation apply; backend/domain/write/runtime phases do not. No supplied screenshot or unresolved business decision.

Final reconciliation: shared export base uses strong-border/text/soft-surface tokens; hover and focus-visible use the primary/balance/surface tokens. Hard-coded green and later dark export block removed. Existing inherited icon foreground and disabled opacity unchanged; no feature source, export logic or accounting contract modified. Scoped frontend and canonical-book diffs reviewed, whitespace/conflict checks clean. UI 20, preamble/changelog 1.41 and skill digest/history updated together. All eight generated packets regenerated and checked OK; semantic review retains report reference ownership and existing read/export/paging semantics. Documentation reference checker passes: every checked reference resolves. No backend/schema/migration/translation changes. No builds, tests, lint, browser/app/database verification, commits, pushes or deployment. Owner visual acceptance pending: inspect enabled/disabled exports in light/dark, hover and keyboard focus. Suggested frontend commit: fix(reports): use neutral shared export button colours (not created).

## Remove duplicate screen headings — 2026-10-02

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Authorization | Owner requests removing the extra table heading because the tab already names the section |
| Reference / target | UI 13/20 tab label and matching panel aria-labelledby identify the section on screen. Hide all five panel h2 elements only in screen media; retain headings in full-report print under UI 21 because navigation is no-print. No gap remains above the filling grid. |
| Scope | StatementOfAccount SCSS; UI 20/21, preamble/changelog, skill and packets. No table, paging, export, API or calculation changes. |

Pre-edit source confirms five panel headings and the existing print-only tab-navigation contract; packet drift check all eight OK. Small sequential style change, source-only; no build/test/lint/browser/app/database execution or subagents.

Final reconciliation: screen-media selector hides all panel h2 elements with display:none, removing their layout space; five print headings and matching aria-labelledby panel bindings retained. Five filling grids/pagers unchanged. Frontend/documentation diff checks pass. UI 20/21, preamble/changelog 1.40 and skill §6.1/history updated; eight packets regenerated and -Check all OK. No runtime/browser/build/tests, new translations, backend/schema change or migration. Owner visual/print acceptance pending. Earlier fixed-above-grid screen-heading evidence below is superseded.

## Active-section exports — 2026-10-02

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Authorization | Owner reports both export actions exporting the first tab; corrective action follows the selected section |
| Scope | StatementOfAccount TS/HTML; owning UI 8/20, preamble/changelog, skill and packets |

| Concern | Owning block / actual source reference | Frozen target |
|---|---|---|
| Regular Excel | UI 8; shared dataTableExportRows; five typed section column definitions | Dispatch from active typed tab to its complete array and current grid columns. Use shared export formatting and translate headers at click time. No page slicing/request; section/mode-specific file names. This supersedes the earlier ledger-only export scope. |
| Available/empty action | Current buttons both depend on ledgerLines length; tabs already expose complete section counts | Bind regular button to successful report and selected section count, so populated secondary sections export even with an empty ledger. Empty selected sections remain disabled; printing/loading disables actions. |
| Charges typewise | Current existing Map formula and StatementLedgerLine response fields | Use the active voucher-bearing collection: ledger/outstanding or advance invoices. Retain the existing debit/credit/due aggregation formula. Show/enable this export only for those applicable sections; deposit/PDC/ageing rows have no voucher-type debit/credit contract. No invented aggregation. |
| Layout/print/accounting | UI 6/13/21; existing fill/paging/print implementation | Preserve four tabs, radios, footer position, complete arrays/backend totals, full-report print and paging behavior. No API/backend/schema change. |

All eight generated packets checked OK before edits. Small sequential corrective change; existing unrelated changes preserved. No build/test/lint/browser/app/database commands, commits, push or subagents.

### Active-export final reconciliation

| Frozen concern | Final source evidence | Result |
|---|---|---|
| Selected section Excel | Exhaustive typed switch contains ledger, deposits, pending-pdcs, advance-tax and ageing. Five dataTableExportRows calls use corresponding full arrays and current typed columns; no slice or tablePaging reference | Conforms; exports include every selected-section row with shared grid formatting and conditional columns |
| Availability/current language | Regular action/method use activeRowCount, successful report and loading/printing guards. Headers translate at click time; section/mode included in both file names | Conforms; secondary data can export with an empty ledger, empty selected data cannot |
| Specialized export | chargeLines selects ledger/advance only; supportsChargesExport controls button visibility and method guard. Replacing chargeLines with ledgerLines yields the exact previous grouping method versus HEAD | Conforms; aggregation formula unchanged, no first-tab fallback on incompatible sections |
| Layout/print/API | Five fill bindings and print cleanup remain; columns, pagination functions and backend report arrays unchanged. One getStatement call site; no export request added | Conforms; print still covers all applicable sections |

UI 8/20, preamble/changelog 1.39 and skill §6.1/history reconciled. Eight packets regenerated and -Check all OK. Scoped frontend/documentation git diff --check passes; no feature conflict markers. No new translations/shared API/backend/schema change or migration. No build/test/lint/browser/app/database commands, commit or push. Source-only; owner acceptance pending for every section export, empty ledger/populated secondary section, language switch, row count beyond one local page, and voucher-type output. Earlier ledger-only export evidence below is historical and superseded. Suggested frontend commit: `fix(customer-statement): export the active report section` (not created).

## Owner-approved bottom paginator — 2026-10-02

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Authorization | Owner reports the paginator in the middle of the screen and asks to place it at the card bottom |
| Scope | StatementOfAccount TS/HTML/SCSS; shared DataTable public scroll-to-start adapter; UI 6/20/21, skill and packets |

| Concern | Owning block / actual reference | Frozen target |
|---|---|---|
| Footer placement | UI 6 fill mode; actual BalancesSummary main app-data-table fill=true; shared fill stylesheet | Use existing shared fill mode on every active section in screen media. Pass remaining card height through shrinking flex layers; shared grid row wrapper is the only active scroll owner and paginator stays at the card bottom. No feature PrimeNG/pager overrides or viewport arithmetic. |
| Tab layout and scroll | UI 13/20; existing four mode-specific tabs and shared grid | Outer report frame becomes a layout boundary with overflow hidden; section heading stays above the filling grid. Tab selection resets rows through shared DataTable.scrollToStart(), backed by the installed PrimeNG public Table.scrollTo API; feature does not inspect internal DOM. Local page/size retained. |
| Print | UI 21; existing printing signal/ReportPrintService | Screen binds fill=true and scrollable=!printing(). Preparation retains full arrays and disables pagination/scroll bounds; print uses existing shared flow rules, releases flex panel structure into document flow and prints all sections. |

The owner's request supersedes the earlier external-frame scroll ownership for screen display only. Mode conditions, columns, paging, filters, totals, export and backend contracts stay intact. Drift check all eight OK before edits. Small sequential change, no subagents or runtime/build/test/lint/browser/database commands.

### Bottom-paginator final reconciliation

| Frozen concern | Final source evidence | Result |
|---|---|---|
| Card-bottom placement | All five grids bind fill=true and scrollable=!printing(); frame is flex column/overflow hidden, layout and active panel use flex 1 1 auto with min-height 0, heading nonshrinking. Existing shared fill wrapper flexes rows and pins its paginator below them | Conforms in source; short/empty/full-page and narrow viewport visual acceptance pending |
| One scroll owner and shared styles | Only active grid row wrapper scrolls; inactive panels hidden only for screen. Feature SCSS has no PrimeNG/pager/deep/viewport-arithmetic rule and no former min-height 100% | Conforms; palette/pager behavior remain the shared BalancesSummary reference |
| Navigation and paging | QueryList of shared DataTableComponent instances delegates tab reset to scrollToStart, which uses installed PrimeNG public Table.scrollTo({top:0,left:0}). All five controlled pagination bindings and the existing helper remain; one getStatement call site | Conforms; feature does not inspect internal table DOM or change paging/data to scroll |
| Full print | printing selects scrollable=false and disables paginator, so the existing shared flow branch removes fill bounds. sigma-print-flow releases frame/layout bounds with important rules; print panel/layout display block and mode-applicable tables flow vertically | Conforms in source; print/cancel restoration remains runtime acceptance |

Scoped frontend/documentation diff checks pass; no scoped conflict markers. UI 6/20/21, preamble/changelog 1.38 and skill §6.1/history updated together; eight packets regenerated and -Check all OK. No new translation, API/permission/accounting/schema change or migration. No tests/build/lint/browser/app/database commands, commit or push. Existing unrelated changes retained. Earlier external-frame scrolling evidence below is historical and superseded for this screen variant. Suggested frontend commit: `fix(customer-statement): pin section paginators to card bottom` (not created).

## Owner-approved local pagination — 2026-10-02

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Authorization | Owner accepts local pagination with 10/20/50/100 options while printing/exporting every report row |
| Scope | StatementOfAccount list TS/HTML; shared DataTable flow-mode print pager hiding; owning UI 6/20/21, skill and generated packets |

| Concern | Owning block / actual reference | Frozen target |
|---|---|---|
| Paging | UI 6; BalancesSummary statement-dialog lazy=false/paginator=true; shared DataTable input/output implementation | Enable local paginator on every section. Use shared default page size (currently 20) and default 10/20/50/100 choices, section array length as count, independent controlled first/size per tab and shared resolveListPaging before writes. No new API requests or server paging. |
| Filters and navigation | UI 20/13; existing report mode radios, activeTab and filter subscription | Preserve each tab's page/size while navigating. Filter changes, Reset and valid Search/Refresh reset offsets to zero and preserve chosen sizes; existing active-tab behavior retained. |
| Full print | UI 21; ReportPrintService afterPrint callback; installed PrimeNG dataToRender | Temporarily disable all section paginators for print, wait one render frame, print all applicable sections and restore paging on afterPrint/cancel/failure. Preserve controlled page/size, ignore preparation-time paging events and cancel scheduled preparation on destroy. Hide pager controls in shared report-flow print rules. |
| Export and totals | Existing buildExportRows/buildChargesTypewiseExportRows, report signals | Keep complete response arrays, exports, totals and counts independent of the selected local page; no calculations/API/schema change. |

This owner-approved follow-up supersedes the earlier paginator=false-only presentation. Existing shared grid defaults and unrelated changes are preserved. All eight packets checked OK before implementation. No build/test/lint/browser/app/database execution, commits, push or subagents.

### Local-pagination final reconciliation

| Frozen concern | Final source evidence | Result |
|---|---|---|
| Local independent pages | All five section definitions bind lazy=false, paginator=!printing(), scrollable=false, complete section count, controlled first/size and keyed paginationChange. Shared default size currently 20 and default choices 10/20/50/100 reused | Conforms; four applicable tabs per mode, no backend paging or extra calls |
| Paging normalization/reset | onTablePage uses resolveListPaging against the previous section state before immutable updates; identical state skipped. Both filter subscription and validated search reset pageNo only, retaining sizes; tab selection does not write paging | Conforms; filter/Reset/Search/Refresh first-page behavior and independent navigation state preserved |
| Complete print and restoration | printing signal turns all paginators off before requestAnimationFrame, ReportPrintService.afterPrint restores it, false return and invalidated preparation restore it too; destroy callback cancels queued printFrame. Paging events ignored while preparing. Existing screen-only inactive-panel CSS retained; shared flow print CSS hides p-paginator | Conforms in source; full-report print/cancel/failure and page restoration remain owner runtime acceptance |
| Data/export compatibility | Five full response arrays remain value inputs; one getStatement call site; tablePaging absent from existing buildExportRows and charge aggregation; backend totals/column definitions unchanged | Conforms; page selection affects presentation only |

Scoped frontend/documentation git diff --check passes; no scoped conflict markers. UI 6/20/21, preamble/changelog 1.37 and skill §6.1/history reconciled; eight packets regenerated and subsequent -Check reports all OK. Existing unrelated shared DEFAULT_PAGE_SIZE=20 retained, not changed in this follow-up. No new translations, shared paging/print service API changes, backend/schema/migrations or runtime/build/test/lint/browser execution. Owner verification pending for pagination navigation, page-size changes on page 1, filter/search resets, empty tabs, RTL and full-print/cancel restoration. Suggested frontend commit: `fix(customer-statement): restore local pagination with full-report print` (not created).

## Owner-approved shared tables — 2026-10-02

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Authorization | Owner asks every tab table to use the table presentation used in BalancesSummary |
| Scope | StatementOfAccount five section-table definitions; shared DataTable external-scroll option; UI 6/20/21, skill and generated packets |

| Concern | Owner / actual reference | Frozen target |
|---|---|---|
| Component and palette | UI 5/6; BalancesSummary main and statement-dialog app-data-table consumers; actual shared TS/HTML/SCSS | Replace all five native definitions with typed app-data-table columns, shared light/dark heads, rows, borders, hover and empty state. Owner explicitly overrides UI 20's earlier native-table palette for this report; no local palette or PrimeNG style copy. |
| Report contract | UI 20; existing response models and conditional columns | Keep all section fields/order, money/date formatting, dash fallback, debit/credit balance direction, due column only in Outstanding, four tabs per mode and radio buttons. Keep arrays/report totals/export/API unchanged. |
| Scroll and full data | Shared DataTable currently always scrolls internally; existing report one-frame owner | Add opt-in scrollable=false, default true for existing lists. Report passes lazy=false and paginator=false; no internal bound/scroll, sorting, paging, actions or selection. External frame retains both axes and sticky headers; public min-width variable preserves section width. |
| Print and accessibility | UI 13/21; previous tab implementation | Preserve screen-only hidden panels, matching panel IDs and headings. New shared external-scroll variant releases internal wrappers and forces printable light surfaces/full rows; no active-tab print filtering. Empty ageing stays empty until response. |

All eight packets checked OK before this follow-up. Small sequential change; no subagents, backend/schema change, build/test/lint/browser/app execution or database commands.

### Shared-table final reconciliation

| Frozen concern | Source evidence | Result |
|---|---|---|
| Same shared grid as BalancesSummary | Five app-data-table consumers replace all five native definitions; typed DataTableColumn models; zero feature-local PrimeNG markup/palette | Conforms to the owner's reference and explicit presentation override |
| Column and value preservation | Header sequence matches HEAD for ledger 11, advance 10, deposits 9, PDCs 4, ageing 8 definitions (42 in total including mode-conditional Due). Advance columns reuse ledger columns minus PO number. Date/dash fallbacks, Money formatting, debit/credit balance direction preserved | Conforms; no totals or export/API mapping changed |
| Full rows and one frame | All five consumers explicitly lazy=false/paginator=false/scrollable=false; shared flow modifier clears internal bounds/overflow; one external frame and original min widths through public variables. Local installed PrimeNG dataToRender slices only if paginator is true | Conforms in source, no implicit ten-row limit |
| Tab/radio behavior | Two original radio controls, four applicable tabs per mode, original deposits/ageing conditions and panel ARIA relationships retained | Conforms |
| Empty and print behavior | Original empty-message keys retained; ageingRows empty until response, existing null-summary zero fallback only after response. Shared flow print rules remove minimum table width, wrap cells and use white surfaces; inactive panels hidden only for screen | Conforms in source; populated/empty visual and print acceptance pending |
| Shared compatibility | scrollable input defaults true; true branch retains original scroll height/scrollable/fill bindings and styles; false branch ignores fill class | Existing list consumers preserve their defaults; runtime verification pending |

All 64 single-quoted customerStatement keys referenced by the current TS/template exist in both en/ar; existing menu and empty-state keys reused, no new translations. Scoped frontend and documentation git diff --check passes. UI 6/20/21, preamble/changelog 1.36 and skill §6.1/history updated; all eight generated packets regenerated, subsequent -Check all OK. Earlier simultaneous-table and native-table evidence below is historical and superseded by the two owner-approved follow-ups above. No backend/schema/migration needed; no app/build/test/lint/browser/database command, commit or push performed. Suggested frontend commit: `refactor(customer-statement): use shared tabbed report tables` (not created).

## Owner-approved tabbed presentation — 2026-10-02

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Authorization | Owner accepts section tabs and asks to change the appearance; follow-up confirms four tabs with the existing Ledger/Outstanding radio buttons |
| Scope | StatementOfAccount list TS/HTML/SCSS; shared EditorTabs optional row-count badge; owning UI books, skill and generated packets |

This supersedes the earlier simultaneous, evenly distributed table presentation. It remains UI 07 Report / backend 5 Report: tabs navigate existing response sections and never create CRUD, paging, new API requests or accounting calculations.

| Concern | Owning block | Actual approved reference / shared owner | Frozen target |
|---|---|---|---|
| Navigation presentation | UI 13 | Link Accounts details app-editor-tabs appearance workspace; shared editor-tabs TS/HTML/SCSS | Reuse shared workspace tabs, typed keys and existing translation labels; add optional count to EditorTab and render/style the badge in the shared component only. Default consumers without count retain their existing rendering. |
| Report layout | UI 20 | Accounts/TrailBalance chrome; StatementOfAccount's current five tables | Keep filters, contact details, backend totals and tabs outside the single shared table-frame scroll owner. One section visible on screen; remove the old space-evenly distribution. |
| Sections and counts | Existing CustomerStatement response and template | ledgerLines, deposits, pendingPDCs, advanceTaxInvoiceLines, rendered ageing summary row | Four tabs in each mode: Ledger includes deposits; Outstanding substitutes ageing for deposits. Ledger/outstanding, PDCs and advance invoices are common. Counts describe rendered response rows; the ageing table has zero rows before a successful report and one aggregate row after it. Empty tabs remain available for inspection. |
| Selection and accessibility | UI 13/27 | Shared tablist roving focus, RTL arrows/Home/End, panel ID contract | Ledger initial/default tab; filter changes and Reset select Ledger; Refresh retains the selected section. Panel IDs and aria-labelledby match shared tab IDs; switching tabs resets the one frame's scroll position without moving keyboard focus off the tab. |
| Print and export | UI 21/8 | ReportPrintService; sigma-print-flow | Keep all applicable sections in the DOM, hide inactive panels only with screen-media CSS, hide tab navigation in print, print all applicable sections with headings. Existing Excel actions retain their current typed export scope. |

The recipe drift check passed for all eight packets before work. The optional badge and tabbed-report print guidance will be recorded in their owning blocks and skill, then packets regenerated from their source templates. No backend changes, tests/build/browser execution, database commands or migrations are in scope. One sequential UI change; no subagents.

### Final source reconciliation

| Frozen concern | Final source evidence | Result |
|---|---|---|
| Shared workspace navigation | EditorTabsComponent import, typed StatementTabKey and computed tabs; optional EditorTab.count rendered/styled in the shared component | Conforms; consumers omitting count retain their existing markup |
| Mode-specific sections | Existing radios and template conditions unchanged; computed list has four tabs per mode, deposits in Ledger and ageing in Outstanding | Conforms to owner clarification and actual source. The initial preliminary five/three count was corrected before handoff; no section business rule changed |
| Data and layout | Five table definitions, 42 scoped headers, three colspan bindings and all 80 matched row/summary references retain their exact sequence versus HEAD; one frame, filters/contact/totals/tabs outside it | Conforms; old simultaneous space-evenly layout replaced by one visible section |
| Selection and accessibility | Primary tab selected initially/on filter valueChanges; same-filter Refresh does not change it; matching panel IDs/aria-labelledby, tabindex 0, shared RTL/roving focus; selected frame scroll resets | Conforms in source; keyboard and viewport behavior require owner runtime acceptance |
| Print and export | Inactive visibility belongs only to @media screen; all mode-applicable panel DOM retained; no-print tab strip; existing ReportPrintService and export methods unchanged | Conforms in source; browser print pagination requires owner acceptance |
| Counts and labels | Response arrays own row counts, aggregate ageing row uses report success presence; undefined badge omitted and zero rendered; all reused labels/menu key found in en/ar sources | Conforms; no new translation keys or fabricated amounts |

UI blocks 13/20/21, UI preamble/changelog 1.35 and skill §6.1/7/history updated together. All eight packets regenerated with Generate-SigmaRecipes.ps1 and subsequent -Check returns OK for all eight. Scoped frontend/documentation git diff --check passes; no scoped conflict markers. Existing Companies/Individual changes remain untouched. Backend contracts, calculations, route, permissions and schema unchanged; no migration needed. No app/build/test/lint/browser execution performed. Owner acceptance remains pending for light/dark, RTL, narrow screens, keyboard navigation, populated/empty modes and full-report print.

---

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-02 |

Implementation follows `CUSTOMER_STATEMENT_MAINTENANCE_EVOLUTION_PLAN.md` (Frozen), including the owner's Trial Balance correction. UI 07 Report / backend 5 Report; no CRUD or paging. Canonical Master/UI/backend blocks governed because recipe drift check found generated packets stale. No screenshot supplied; existing source is Explicit content/contract evidence. Visual runtime conformance is Uncertain until owner verification.

## Reference conformance and decisions

### Read-only question: PartnerId 10 rows absent from statement (2026-10-02)

Traced frontend filter serialization and backend GetCustomerStatementAsync without DB/app execution or source edits. JournalVoucherDetail PartnerId alone does not define the report population. CustomerService derives allowed AccountIds from tenant-scoped LinkAccounts Contacts slots joined to nondeleted Customer ContactGroups; detail Query further requires same subscription/nondeleted detail, AccountId membership, non-null posted/nonvoided parent voucher. Ledger date range uses JournalVoucher.Date inclusively; earlier qualifying lines contribute only to beginning balance. Outstanding reads through end date and skips net balances fully allocated as of end date. Posting LinkAccountLookup likewise resolves the partner's contact-group account, so no source evidence establishes that this account restriction is a defect by itself. Missing/changed mappings can exclude historical lines, but that is a conditional finding, not a diagnosis of this customer's data.

Exact cause/count for PartnerId 10 remains Uncertain: no actual rows, active subscription, selected mode or dates supplied. Asked the owner for mode/date range. Backend source unchanged, no accounting fix assumed or permission/schema change. Database commands remain prohibited without explicit current-task authorization; none ran. Need compare actual missing detail IDs/account IDs/voucher status/date and allocation state to these conditions before diagnosing a specific data defect.

### Owner follow-up: section heading inset and even spacing (2026-10-02)

The Frozen plan records the user-approved section structure change before editing. Added one statement-tables-layout.sigma-print-flow wrapper inside the existing results frame: 8px inset keeps headings away from the border; min-height 100%, space-evenly and a 12px minimum gap distribute unused screen height around the selected-mode tables. Sections retain natural height with flex 0 0 auto, so long data grows into the one existing scroll frame rather than compressing rows. Heading/table gap is 8px. No palette, row density, filters, financial data, API, route, or shared style changes; no new shared capability to promote. UI 20/21 section-structure/print authority retained.

Source checks retain five tables / 42 scoped headers / one scroll frame / one print-flow content wrapper; no extra feature scrollbar or viewport height calculation. Scoped whitespace diff passes. Existing values, columns and success guards unchanged. Source-only; actual short/tall viewport distribution and print pagination remain owner acceptance. No new tests or prohibited commands. Small change handled by root. Suggested frontend commit: `style(customer-statement): space report sections evenly` (not created); no migration/backend change.

### Owner follow-up: empty preview and Trial Balance relocation (2026-10-02)

This follow-up supersedes this review's earlier current-month default and initial-output hiding statements for Customer Statement only. The Frozen plan addendum records the owner's explicit exception and before-edit reference map. Initial and Reset dateRange/customerId are null. Tables for the selected mode render headers and empty messages before search; contact/KPIs and ageing values still require a successful response. No report request or fabricated financial response is used to preview the layout. Existing date/customer validation and print/export guards remain.

Moved all five Trial Balance source files byte-for-byte from Reports/TrailBalance to Accounts/TrailBalance. SHA256 comparison after move reports five files, zero content mismatches, old folder absent; actual Reports_Routes and LayoutModule imports now point to Accounts. The public /Reports/TrialBalance URL/sidebar links retain compatibility. Relative model/service imports keep their valid depth; no new compilation roots. Canonical UI preamble/20/catalog/screen 07 reference paths updated; historical reviews/change rows retain history. UI version 1.33 and skill §6.1/history document the owner exception; no other screen default changed. No backend, calculation, API, schema, or permission changes. No migration needed.

Root handles this small follow-up without further agents. Existing request-state specs now supply dates explicitly in successful-request scenarios because the default is blank; no new tests were added or run. Scoped current-source/diff/import/translation/whitespace verification applies below; owner browser/build/tests/print verification still pending. Suggested frontend follow-up commit: `refactor(reports): preview empty statement and relocate trial balance`; documentation `docs(ui): update report defaults and trial balance reference`. Neither created. Prohibited execution commands remain unrun.

Follow-up verification: five template tables / 42 scoped headers / one results frame retained; response alias gates contact, KPIs and ageing numbers only. Local imports in both feature folders resolve (zero misses); no source references to the old Trial Balance path or merge markers in scoped consumers. Scoped diff whitespace checks and current-book link checks pass (zero misses). English/Arabic customerStatement parity remains 75 keys each, zero missing/case differences. Generated packets remain stale. Runtime/visual acceptance remains pending; the full book checker was not used because its unscoped solution scan conflicts with AGENTS.md.

The first draft did not sufficiently match the documented reference: secondary button roles, panel spacing and added zebra/hover rows diverged. The owner identified this; those differences were corrected in source. This record does not retroactively describe the first draft as compliant. The conformance table in the Frozen plan now maps UI 1/3/4/20/21/22/24 to actual `Reports/TrailBalance` HTML/SCSS/TS and shared owners. Final source matches its report strip, panel/title values, action role colours, plain rows and dense themed header values. Container fill, shared date entry, MoneyPipe, reactive disable and real submit follow their governing blocks instead of copying legacy reference defects.

| Decision | Classification | Evidence / resulting behavior |
|---|---|---|
| Shape | Keep | One sectioned read-only response, five native tables, no row actions or paging; UI 07/20 |
| Layout | Refactor | Shared report shell, actual Trial Balance page/panel/title insets and radius; exactly one results frame; title/filter/contact/errors/summary outside it |
| Filters | Refactor | Shared report strip, labelled two-month range/current-month defaults; Customer lookup, ledger/outstanding and includeInactive retained |
| Actions | Keep/Extend | Search/Refresh/Print/two Excel exports retained; Reset and failed-lookup Retry added; reference report role colours and responsive group |
| Tables | Refactor | Actual reference header text/background/borders/shadow/padding/line-height; 34px header and 30px plain body; no zebra/hover additions; logical numeric alignment and scoped headers |
| Requests/state | Refactor | Positive customer ID and real ordered dates; guard overlap, disable form, cancel when filters change, clear stale report; retain selections on failure, finalize every outcome |
| Error owner | Extend | Both report and lookup explicitly suppress interceptor presentation and show one inline error per failure; safe API message/fallback; no duplicate report alert |
| Amounts/totals | Keep | Same response-only KPIs and Dr/Cr magnitude presentation; shared MoneyPipe formats display, does not recalculate balances |
| Exports | Refactor | Same complete ledger response, raw numeric fields and existing charges-type grouping; translated headers built at click time |
| Route/client | Keep | Existing route/menu and root interceptor-equipped HttpClient; no new provider or manual Bearer |
| Backend/schema | Keep | Read-only trace; no endpoint/DTO/formula/entity/config/AutoMapper changes or migration |

All reference report actions are classified: Search/Refresh/Reset/Excel supported through existing feature requests/state and explicit handlers; Trial Balance account-ledger drilldown/tree toggling do not apply to this flat sectioned customer document. No unclassified business action was removed. Authorization candidates remain viewing a customer's financial statement and printing/exporting it; authentication and tenant boundaries stay existing, role permissions remain owner-deferred (UI 26). No permission mechanism invented.

## Filter, column and backend correspondence

`GET Customer/Statement` still sends exactly `Filters[customerId]`, `Filters[fromDate]`, `Filters[toDate]`, `Filters[reportType]`, `Filters[includeInactive]`. `toFilterParams` retains false/zero and excludes only empty string/null/undefined; unpaged report gets no page or sort. IDs become positive numbers; dates are local yyyy-MM-dd. Date default changes month-to-date to current month per UI 17/20.

| Visible section/columns | Existing response properties |
|---|---|
| Contact name/code, Tel1, Tel2, mobile, email | contact.name/customerCode/tel1/tel2/mobileNo/email |
| Ledger date, voucher type/no, description, age, PO no, allocations, debit, credit, optional due, running balance | ledgerLines: date/voucherType/voucherNo/description/age/poNo/allocations/debit/credit/dueAmount/runningBalance |
| Deposits (ledger only): no/type/date/agreement/amount/used/refunded/refund date/status | deposits: depositNo/type/date/agreementNo/amount/used/refunded/refundDate/status |
| Pending PDC: cheque no/date/bank/amount | pendingPDCs: chequeNo/chequeDate/bank/amount |
| Advance tax: ledger columns except PO no | advanceTaxInvoiceLines: matching StatementLedgerLine fields |
| Outstanding ageing: seven intervals and balance | ageingSummary.p1_0_30 through p7_181_Plus, balance |
| Beginning, total debit/credit, due, ending, current KPIs | beginningBalance/totalDebit/totalCredit/outstandingTotal/endingBalanceTill/currentBalance; existing outstanding ending uses outstandingTotal |

Backend evidence: `Controller/CustomerController.cs`, `SiGmaControllerBase` [Authorize], `SiGma.Helpers/Reports/CustomerReports/CustomerStatementDto.cs`, `ICustomerService`, `CustomerService.GetCustomerStatementAsync`. Query helper supplies existing tenant scope/no tracking; posted/nonvoided AR rows and deterministic date/detail ordering. End date remains inclusive; beginning before start, ledger within window, effective outstanding allocations through end. Age remains backend today-based; current balance is all posted history. Deposits/PDCs retain existing non-date-filtered semantics; advance-tax uses the date window. Frontend changes none of these formulas. No persisted/schema change: owner does not need `Add-Migration`.

## Shared extraction and maintenance procedure

Shared owners extended: `list-query.ts` toFilterParams reused by toListParams; `BaseService.getSelectList<T>(options?)` optional inline-error ownership; global opt-in report shell/frame/table/action-group styles; shared primary button compact report context. Other report consumers adopt during their own review. Feature SCSS now holds column/contact/section structure only. Existing report page/actions, date picker/utilities, MoneyPipe, state message, API error and focus helpers reused.

UI 2/16/20 updated for shared APIs/layout, UI 24/30 reconciled for this consumer, UI preamble/CHANGELOG 1.32 and project skill §3.2/6.1/history updated. The owner's maintenance concern also adds the evidence gate to AGENTS.md, canonical Master 5/preamble/CHANGELOG 1.25 and skill: before edits record the actual reference map; reconcile it before handoff; book changes cannot justify an unapproved deviation. Existing artifacts carry evidence, no additional checklist artifact required.

The calling coordination folder `C:/Users/user/Documents/ChatGPT/sigma` had no AGENTS.md. A small entry-point AGENTS.md now points to the authoritative `F:/My Work/Sigma/AGENTS.md` before source investigation/editing, including its required skill/books. It does not copy their rules. This makes the instructions discoverable from this workspace; it does not excuse the initial conformance failure (the books were read in this task).

## Source-only verification

- Reviewed complete scoped diffs/current source in frontend and documentation Git repositories, including prior changes in shared files; preserved prior shell/appbar work. Frontend file set: feature list TS/HTML/SCSS/spec/service; shared list-query/base-service/primary-button SCSS; styles.scss; en/ar. Backend Git status remains clean. AGENTS.md, skill and local review artifacts are outside those actual Git repositories; owner-managed instruction-layer move remains deferred.
- Translation checker: 75 customerStatement keys each language, zero missing/case differences. Every one of 74 referenced feature/general/menu keys exists in both languages. All local feature TS imports resolve. No scoped merge markers or new post-ES2018 APIs.
- Source tables: five tables, 42 scoped headers, one keyboard-focusable table frame; original 24 row/deposit/PDC field references preserved. One rendered report error binding; success-only contact/KPIs/output. Native widths and conditional columns retained. Shared print releases bounds and explicitly resets header/body/summary to white.
- Root route/menu/client source traced; no route or compilation-root additions needed. Scoped git diff --check passes in both affected repositories. Scoped changed-book Markdown links resolve. New shared classes/types/paths match their source owners.
- Five meaningful request-state specs replace unrelated widget boilerplate: validation, serialization/overlap/HTTP failure, business failure, cancellation and lookup retry. Written and inspected only, not executed.
- Full `Check-BookReferences.ps1` not run: it scans whole solutions with no scoped option, conflicting with root AGENTS prohibition. Scoped reference/link/symbol inspection used; full owner check and generated recipe regeneration/semantic review remain pending. Recipe drift remains existing and is not silently repaired.

## Phases, remaining verification and handoff

Applied maintenance/discovery/freeze, report UI/request refactor, shared extraction, integration and final source reconciliation. Skipped entity/write/financial-action/migration phases because this request changes a read-only frontend. No unresolved Missing business requirement. Owner's reference correction supersedes initial styling choices; no unapproved source discrepancy remains known. Runtime/visual results remain Uncertain, not certified.

Owner acceptance: compile and run scoped specs; check ledger/outstanding with many and empty rows; partial/reversed/impossible dates; lookup and report failure/retry; reset and changing filters; no overlapping/stale result; Excel headers after language switch and original numeric values; full multi-page printing; narrow/short viewports, keyboard focus, Arabic RTL/English LTR and light/dark. Source-only risks include Angular/PrimeNG control/template behavior, available-height pressure on short screens and browser print pagination. Existing backend age/date-scope semantics need business confirmation only if a future change is requested.

Agent utilization: existing `topbar_menus` worker owned feature TS/service/spec; `topbar_styles` worker owned feature HTML/SCSS after frozen APIs. Inherited Terra worker routing was unavailable; inherited fallback worker settings used without a requested override. Independent bounded ownership reduced sequential logic/presentation review; root integrated shared styles/helpers/translations, owner's correction, books, instructions and evidence. Workers and root performed source review only. No overlapping worker writes.

No builds, tests, lint, browser/app execution, database commands, migrations, Graphify, Sigma MCP, commits, push or deployment ran. Source/translation/drift read-only checks only.

Suggested commits (not created): frontend `refactor(customer-statement): align shared report and request handling`; documentation `docs(sigma): require reference conformance evidence`; coordination workspace `docs(sigma): point workspace to project instructions` (new untracked entry-point file reviewed in full; target exists). No backend commit or migration needed. F:/My Work/Sigma root instruction/review files remain local until their owner-managed documentation move.
