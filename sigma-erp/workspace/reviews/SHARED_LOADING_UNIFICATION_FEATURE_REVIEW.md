| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-26 |

# Shared loading unification — implementation review

Current policy (latest owner clarification2026-10-26): required routed initial/
filter bootstrap uses the single page host, never inline filter progress. Dialog
bootstrap stays local and retained-data refresh stays silent. The final section
records its implementation; earlier local-bootstrap/fallback rows are historical
and superseded by this owner decision.

Manifest: owner requests JV appearance in Customers/Suppliers/startup and removal of competing loaders. Tier L plan and UI contract Frozen in same prefix artifacts. Reference: actual JV global page loader, StateMessage and Layout, plus local JV allocation/status/log read ownership. No screenshot; source and explicit owner instruction are Confirmed evidence. Read/write/API/financial/cache eligibility contracts remain existing. UI22/24/25/27/28/29, Master1/4/5/7/8, applicable PLAN00 and phase00/01/02/03/05/06 packets; no new domain transition. Initial packet check all8 pass. Backend implementation is not in scope.

Preservation: frontend has extensive existing Customers/Receipts/shared vocab/routing changes, plus prior Suppliers current-balance work. All are retained. Root owns shared/startup/Suppliers/docs/skill/packets and integration. Any delegated worker owns Customers-only source files and disjoint guide files; no shared edits or generated packet edits by worker.

Discovery findings: JV already uses common StateMessage ring, startup has a separate modern-spinner skin; local controls use refresh/vendor spinners; Supplier dialog reads obscure global host; error interceptor double-decrements request-owned counts. Per-operation/source conformance and scoped implementation/diff evidence will be reconciled below. Runtime/build/browser/SQL/timing verification remains owner-pending.

## Implemented scope and source owners

Shapes remain UI5/7 server lists for Supplier/CompanyPartner/IndividualPartner; the existing complete/paged report shapes for Customer/Supplier reports; existing profile step forms and body-appended EditorDialog for editors/history/drill-down. Backend normal CRUD/report/aggregate contracts are unchanged; no backend source was edited by this loading task. No new field, endpoint, route, permission, accounting effect, package or migration.

| Owner | Final implementation / removed competing source |
|---|---|
| src/index.html | Single critical inline stylesheet owns sigma-loading-indicator/status/card/overlay; same JV ring36px/3px/900ms and44px card, theme fallbacks, logical sizing, reduced-motion, forced colors and print. Removed modern-spinner/rotation/pulseText palette/markup. Native body[root] bootstrap removes splash, no timer or extra CSS request |
| Layout + StateMessage | Existing shell host adopts global classes; StateMessage retains translated status/live/aria-busy/error/empty semantics. Removed duplicate component ring and shell card styling. Nonloading :where selector preserves the error color cascade |
| DataTable + PrimaryActionButton | Installed PrimeNG21 loadingicon template renders the same ring; inline button uses currentColor. Busy/disabled/aria-busy and global suppression remain. Legacy loadingIcon input accepted without competing glyph; removed refresh keyframes |
| EditorDialog | One StateMessage/card in content while saving, with aria-busy. Static Save/Print glyphs; caller still owns global write count and independent write/navigation protection. No hidden-only save indicator or second foreground spinner |
| Header | Branch loadingicon and actual background-refresh badge use same inline ring; removed branch PendingMotion and private rotation. Compact32px/confirmed branch labels, existing500ms badge gate and actual request ownership remain |
| Error interceptor | Removed both unowned endLoading calls and LoadingService injection. Feedback/401/envelope behavior unchanged; subscribed request finalizers release their own counts |
| Customers | Eight global-owned tables across seven templates explicitly disable duplicate indicator while retaining loading/busy state. Existing local statement/history/lookup status and profile forms retained. Statement report does not instantiate its tables during global loading |
| Suppliers | Five report/list tables plus drill-down explicitly suppress table masks. Supplier details and balances drill-down read use existing local StateMessage without hidden global start/end. Search is disabled while local read owns progress; drill-down exposes Retry. Lookup batches use one ReferenceLookupStatus, removing duplicate per-select icons/local messages while preserving aria-busy, failures and Retry |
| Removal closure | Login/Registration use inline ring/currentColor; deleted unused shared sigma-spinner skin/keyframes. FileField upload uses same inline ring/aria-busy, with upload/validation/tracker unchanged. Charges replaces its private animated glyph with StateMessage and removes charge-settings-spin. Only these visuals changed; no authentication/Charges request-policy refactor |
| Guides | Existing UserGuide reader and shared-screen-guidance plus Suppliers guide explain uniform startup/page/dialog progress, disabled actions, errors and Retry in Arabic/English. Previous current-balance hint/guide remains |

The removal inventory searched actual application source and shared native styles for spinner classes and private spin/rotation keyframes. The removed shapes are modern-spinner, sigma-spinner, charge-settings-spin, StateMessage's old ring copy, PrimaryActionButton/EditorDialog refresh animations and header rotation. Ordinary Refresh/Retry glyphs remain actions. AnimatedCount/PendingMotion data placeholders remain their documented presentation owner; they are not an alternative request-loading skin. PrimeNG vendor sources were not edited. No unrelated screen's loading lifetime was rewritten.

## Active route, loading request and visibility reconciliation

Actual lazy route/component imports were traced, including JVs' Layout/StateMessage path as the reference. The twelve Customers/Suppliers routes below have no effective showPageLoading=false override; Layout's content host renders one page StateMessage. StateMessage is inside body-appended dialogs when local visibility is necessary. LoadingService and NavigationActivityService remain separate. Immediate guards and render-safe publication, query/fragment-only pending preservation and actual parsed path-tree departure reset were preserved.

| Active route / operations | Request lifetime and sole visible owner | Errors, busy and cancellation |
|---|---|---|
| /CompanyPartner, /IndividualPartner list/search/page/export/detail/write/delete/group change | Existing global subscribed start/finalize; explicit list table suppression. Profile routed form reads/writes stay global; auxiliary lookup status local; EditorDialog group save now foreground StateMessage | Existing identity/destroy/closing/discard guards and errors/Retry retained; no request source change |
| /Alerts initial/search/refresh | Customer/Alerts direct read global; Customer/GetSelect finite bootstrap local reference status | Existing replacement/destroy cleanup, list/table busy, lookup and operational recovery retained |
| /DebtCollection report/write/reload | Global report/follow-up save/blacklist save + reload; follow-up history local StateMessage, table suppressed | Existing local read cancellation and errors/Retry; disabled save and write safety unchanged |
| /followUpReport report/search/user summary | Existing global report; two tables explicitly suppressed. User/Customer bootstrap local status | Existing switchMap/finalize/destroy, busy/errors/Retry preserved; paging/output local |
| /BalancesSummary report/server page/all-page export | Global count/finalize; explicit report table suppression. Statement dialog uses existing local StateMessage without global ownership | Statement local form busy/disabled and error/recovery remain; cancel on close/replace/destroy preserved |
| /ReceivableAgeAnalysis report | Global full report; table explicit suppression; five filter lookup sources local reference status | Existing finalize, busy/output lock, failure/Retry and destroy retained |
| /StatementOfAccount report | Global report count/finalize; result tables absent while loading; Customer select local reference status | Existing form guards and both failure channels retained; no new indicator |
| /Supplier list/search/page/sort/export/delete/save | Existing defer start and finalize on completion/error/replacement/destroy. One shell owner; explicit list suppression, write saves additionally have visible foreground dialog host | Existing loadingList/saving/deleting/form/close guards and error/Retry retained. Interceptor no longer consumes other requests' counts |
| Supplier Create/View/Edit dialog detail | loadingDetails sets local status before read; finalize clears on complete/error/unsubscribe; removed global start/end for this read | Existing form disable/mode/focus, identity guard and destroy cleanup retained; loadError + Retry; lookups appear after detail status |
| /SupplierStatement report | Global report/search/output data read; two tables explicit suppression. Supplier options finite bootstrap local reference status | Existing finalize/busy/output and errors/Retry retained |
| /SupplierBalancesSummary main report | Global report data read; table suppression. Branch/Supplier/Staff forkJoin local aggregate status | Existing disabled/printing/errors/Retry retained |
| Supplier balances statement drill-down | switchMap/defer sets loadingStatement and disables form; local StateMessage visible inside EditorDialog. No global count; table mask and Search spinner suppressed | finalize enables form/clears busy on complete/error/cancel; explicit Retry reuses loadStatement; existing close/identity/destroy signal retained |
| /PayableAgeAnalysis report | Global report read; explicit table suppression. Supplier + typed group bootstrap share local status | Existing form/output guards, independent source errors/Retry and finalize preserved |
| All retained-cache refresh | Shared cache source, silent local update, header actual-request badge uses common ring | Existing retained options/watch/error/Retry/tenant cleanup; no global busy count |
| Startup; login/register; FileField; Charges removal closure | Same primitive replaces old shape only. Existing pending/uploading/loading source and ownership kept | Existing authentication/financial/upload flow and guards unchanged; no new subscription/timer/cache |

Global read/write controls retain [loading] and disabled contracts; showLoadingIndicator=false changes presentation only. The subsequent owner correction below supersedes the initial interpretation allowing independent auxiliary/global indicators to coexist: only the foreground owner remains visible. Runtime stack/timing and assistive announcement remain separate acceptance evidence.

## Cache gate — unchanged source adoption

The actual producer/consumer source matrices in CUSTOMERS_MODULE_FULL_STACK_REVIEW.md and SUPPLIERS_FULL_STACK_REVIEW.md were reconciled against the current consumers; this task adds no GET/cache/watch or invalidation behavior. URLs below use configured environment.baseUrl. Symbols are the existing shared service owners, not a feature-local cache.

| Consumed URL / source symbol | Classification, writer/invalidation and watch evidence | Final consumer conformance |
|---|---|---|
| Customer/GetSelect — shared CustomerService | Approved reference; CompanyPartner/IndividualPartner successful writes and positive-saved-row imports invalidate dependencies; lookup-customers | Statement, balances, aging, alerts and follow-up finite successful bootstrap, separate once-bound ReferenceLookupBindings watch, selected/current getters, context clearing, failure/Retry and destroy retained |
| Branch/GetSelect — BranchService | Approved reference; successful typed/inherited writes invalidate; lookup-branches | Lists/editors/driver and balance/aging filters retain finite read then watch, current branch/default/manual-selection policy |
| ContactGroup/GetSelectByType/Customer — ContactGroupService | Approved typed reference; successful group writes/default-group customer writers/imports invalidate dependency; lookup-contact-groups | Customer lists/editors/aging preserve exact type identity, selected options, watch/Retry/teardown |
| Country/GetSelect — CountryService | Approved reference; successful typed/inherited writes; lookup-countries | Customer editor/driver and Supplier editor finite read then watch; selected country/address labels retained without draft writes |
| Currency/GetSelect — CurrencyService | Approved reference; successful typed/inherited writes; lookup-currencies | Customer/Supplier editors and Customer aging retain finite bootstrap/watch; no financial-policy/rate caching |
| Supplier/GetSelect — SupplierSharedService/SupplierService | Approved reference; successful Supplier writes/inherited delete and positive-saved-row import invalidation; lookup-suppliers | All Supplier report filters retain finite success then separate watch/current option getters, context clear, failure/Retry and teardown |
| ContactGroup/GetSelectByType/Supplier — ContactGroupService | Approved typed reference; group writes/default-group Supplier writers/import dependency; lookup-contact-groups | Supplier editor/aging retain finite read then distinct typed watch; selected labels/drafts/context/failure preserved |
| Staff/GetSelect — StaffService | Direct reference without source opt-in, cacheSelect=false | Customer editors/balances/aging and Supplier balances finite direct bootstrap, failures/Retry; no invented watch/cache requirement |
| User/GetSelect — UserzService | Direct reference without source opt-in | Follow-up filter finite read/Retry; unchanged direct exception |
| TariffCard/GetSelect — TariffCardService | Direct reference without source opt-in | Customer profile finite read/Retry; no new local cache |
| Customer/Supplier list, detail, reports, history, validation, uploads and writes | Direct operational/financial reads, not reference opt-in; unchanged APIs/service methods | Existing request lifecycle/identity/teardown preserved; no response caching or policy change |
| Startup/auth/Charges visual closure | Startup uses no GET; existing auth operations/Charges source untouched | No new lookup/cache eligibility decision; shared presentation only |

Shared chain remains BaseService readReferenceSelect/watchReferenceSelect/success invalidation → ReferenceLookupCacheService topic/source identity → ReferenceLookupBindings finite bootstrap, independent watch, selected/current options, null-context reset and takeUntilDestroyed. Retained refresh stays silent with existing header badge; successful imports invalidate only when persisted rows exist. Source conformance is separate from pending TTL/network/tenant/rejoin/partial import acceptance.

## Load-speed, query and index gate

This is a presentation/count-ownership correction: **HTTP/query/page/response volume is unchanged, and no measured speed improvement is claimed.** One inline critical stylesheet adds no first-paint request. Moving Supplier dialog reads to local status changes visibility/count ownership, not execution order or data scope. No new per-row, serial, duplicate read or EF parallel work was introduced. Existing performance findings remain valid.

| Boundary | Reconciled source behavior / data scope |
|---|---|
| Customer companies/individuals | One list GET per server page; initial two lookups, editor six source reads (possibly cache hits), edit detail one GET; export100 rows per request. Existing write+refresh/validation/upload behavior unchanged |
| Alerts/debt/follow-up | Alerts report1 + Customer lookup1 on cold bootstrap; Debt report1 bounded to100 and history1 when opened, writes then reload; follow-up2 lookups + report1. Local paging/output unchanged |
| Customer statement/balances/aging | Statement Customer lookup1 + report1; balances3 lookups + server-page report and ceil(count/100) export calls; aging5 lookups + complete IncludeAllRows report1 then local paging. No new materialization |
| Supplier list/editor | One list request per server page; three editor lookup sources; Edit/View detail1. Existing deep detail graph risk F6 remains outside this loading task; save/delete + refresh unchanged |
| Supplier reports | Statement existing7/8 materialization boundaries without/with fromDate after earlier approved current-balance SUM; balances complete response then local paging; aging complete response and existing O(S×L) risk F7. Dialog Statement uses the exact same request/data contract |

No new index is proposed for this correction: predicates/joins/order/SQL/page contracts were not edited, so an index would not address removed visual skins or count release. Existing exact Supplier index proposals and Customers index dispositions remain in their reviews with overlap/write/storage/plan verification requirements; no schema/migration or database command was run. This is not a claim that deployed indexes are sufficient or a closure of prior performance findings.

Reproducible owner before/after protocol: same build mode/device/network/API/DB/tenant/branch/language/data snapshot; record row counts/date filters/page sizes. Capture five cold and five warm opens per representative small/large route, per-sample and median startup first paint/usable UI, required-data completion, HTTP counts/bytes/TTFB, SQL commands/rows/logical reads/duration/plan and rendering. Compare identical rows/totals/filter/page/export/action results. Include concurrent reads with one error, replacement/cancel, dialog read/save, retained cache refresh, same-path query/fragment and actual departure. No timing samples or feature duration target were available under source-only execution.

## Verification, documentation and final reconciliation

| Gate | Result |
|---|---|
| Frozen plan/handoff | Followed; inline-source refinement recorded before implementation. Visual-only removal closure recorded before its edits |
| Scoped diff review | Root reviewed shared/startup/Suppliers and Customers worker diffs, preserving pre-existing Customers/Receipts/backend/current-balance work; only loading task hunks claimed here. Final added auth/Charges/FileField/native-style visual diffs reviewed |
| Static parsing | Final TypeScript createSourceFile:10 files; Angular parseTemplate:21 external templates + FileField inline template; HtmlParser:index; PostCSS:critical inline CSS. Zero diagnostics. No build/test/lint was run |
| Styling/accessibility source | One spin keyframe in the common critical source; no remaining identified old class consumers; error color cascade preserved, solid button currentColor, RTL logical borders, reduced-motion/forced-color/print hooks; no runtime visibility claim |
| Documentation | UI22 owning common source/operation rules; UI24 icon contract/decorative placeholders and UI1 branch contract reconciled. Skill digest + dated revision row updated together. Existing shared and Supplier in-app guides updated |
| Generated packets | PLAN00 and PHASE00–06 regenerated only through generator; semantic review keeps correct canonical/reference dependencies, no obsolete private-loader prescription or template conflict. Final -Check passed all8 after the last canonical edit |
| Financial/API/cache | Current-balance date/hint preserved. No backend/schema/API/financial/filter/page/count/write-rule/cache eligibility change |
| Remaining earlier findings | Supplier F1/F2/F3 addressed by these source changes; F4 freeze helper, F5 exact payable-account slot, F6 detail graph and F7 aging CPU remain outside this loading request. Prior unresolved Customers financial/business decisions remain outside scope |
| Runtime/owner acceptance | Pending startup/auth/app shell/dialog/table/button/upload/Charges visual behavior, slow/offline/error/Retry/cancel/overlap, keyboard/screen reader, narrow/desktop/RTL/light/dark/reduced motion/forced colors/print and performance/SQL measurements. No build/test/browser/database/migration run |
| RTL derivative asset | TranslationService links assets/css/style.rtl.css for RTL. Its checked-in generated output still contains the now-unused sigma-spinner rules; all actual consumers and its Sass source definition were removed. UI25 requires regeneration through scripts/build-rtl.mjs, while workspace AGENTS prohibits builds. Do not edit generated CSS by hand or run its Sass build here. Owner must run npm run rtl, then npm run rtl:check as part of the allowed build handoff; source appearance already uses the common inline ring and no old class is instantiated |

Delegation: one disjoint Customers-only sol_worker reviewed existing flows and added eight explicit table suppressions across seven templates. Root owned shared contract, source/docs/guide integration, removal closure and final reconciliation. Worker did not edit shared owners or generated packets. No source changes from other in-progress work were reverted.

Final scoped frontend diff --check passed (startup/layout/shared owners, Customers/Suppliers, guide, auth/Charges closure and native styles). Source inventory finds no old modern-spinner/sigma-spinner/charge-settings-spin/request refresh-spin consumer in that closure; the shared critical ring owns the only replacement animation. Documentation and packet checks are source evidence, not proof of runtime speed or visibility. Implementation handoff complete for this request; owner runtime acceptance remains explicitly pending.

## Owner-reported Individual duplicate — single visible owner follow-up

Owner reports two loading indicators in IndividualPartner, requires one visible indicator as a general behavior documented for every page, and explicitly requests Customers/Suppliers confirmation afterward. Tier S correction within this existing shared handoff; its Frozen amendment records the source-supported fix before editing. No new feature contract/artifact or delegate is needed for this tightly shared change. Applied discovery/contract amendment, shared integration and final reconciliation; domain/backend/read/write/action phases unchanged.

**Confirmed cause:** active IndividualPartner routes import IndividualPartnersComponent and DetailsComponent. List getAll and detail getDetails have paired global start/finalize while lookup bootstrap has its own ReferenceLookupStatus (StateMessage). Table/button suppression covered only those controls. The translucent shell mask left local StateMessage visible, so matching ring appearance did not ensure one visible indicator. This source finding supports the user's report; no browser reproduction was run.

**General fix:** the single critical style owner in index.html now uses actual rendered host/portal selectors. While the shell loading host exists, covered routed StateMessage loading hosts and common rings are hidden; errors/empty states are untouched. A modal loading StateMessage replaces background shell/routed progress, even without a global count. EditorDialog saving hides covered local StateMessages, retaining its own foreground status. A routed/modal StateMessage takes precedence over compact inline action/upload rings. Ending page progress exposes any still-pending local read automatically; existing request flags/counters/finalize/error/Retry never clear early. No feature opt-in, new host, service counter, timer, request or serialization. Installed PrimeNG21 Dialog appendContainer moves its wrapper to body, matching the shared EditorDialog appendTo=body contract; local dialog progress is outside the routed subtree.

### Customers and Suppliers confirmation — source evidence

| Screen/route | Final loading owners and duplicate disposition |
|---|---|
| IndividualPartner list/create/view/edit/details | Global list/detail/write + local aggregate options: common shell precedence removes the reported overlap. Lookup-only Create retains one reference status. Contact-group dialog has one reference status; saving foreground replaces covered states |
| CompanyPartner list/profile/driver draft | Same common page/lookup precedence; group dialog and body-appended driver draft have foreground local status, now replacing any background route lookup status as well. Existing busy/discard/write guards retained |
| Customer Alerts | Global list + one Customer reference status; no per-select publisher loader; table explicitly suppressed |
| Customer DebtCollection | Global report/save + one reference status; body-dialog follow-up history local StateMessage/Retry with table mask false; modal precedence hides background page progress |
| Customer followUpReport | Global report + one aggregate reference status; two report table indicators false |
| Customer BalancesSummary | Global report/export + one aggregate options status; statement dialog local StateMessage and disabled search/table mask false; modal precedence retained |
| Customer ReceivableAgeAnalysis | Global report + one aggregate options status; table indicator false |
| Customer StatementOfAccount | Global report + one reference status; report tables not instantiated while loading; no additional table loading input |
| Supplier list/editor | Global list/save + local body-dialog detail/lookup status. Detail and lookups are mutually exclusive template branches. Saving overlay replaces covered dialog/route indicators; list table mask false |
| Supplier Statement | Global report + aggregate Supplier options; two table masks false; common page precedence |
| Supplier BalancesSummary | Global report + aggregate Branch/Supplier/Staff status; local statement dialog StateMessage/Retry, disabled search and table false; modal precedence |
| Supplier PayableAgeAnalysis | Global report + one aggregate Supplier/group lookup status; table false; common page precedence |

Static Angular template inventory covers **18 Customers templates +5 Suppliers templates**: all **10 Customer +6 Supplier tables with a loading binding explicitly suppress their indicator**; **12 Customer +4 Supplier ReferenceLookupStatus consumers** delegate to the common StateMessage; **2 Customer +2 Supplier explicit local StateMessages** retain dialog detail/history/statement ownership. No p-* publisher loading input remains in either module's templates. Profile validation/save buttons retain their common loading/busy contract; common status precedence includes inline/upload rings. Shared agreement history remains one local StateMessage and suppressed table. These counts describe source nodes, not simultaneous runtime nodes or a measured network trace.

Cache/performance gate delta: all consumed URLs, finite bootstrap/watch/selected-label/context/Retry/teardown and successful writer/import invalidations are unchanged; the earlier detailed cache/source matrix remains current. Zero added HTTP/SQL requests, no page/count/filter/financial changes, no query/index/schema edits; no new index justified for visibility-only precedence. The earlier reproducible owner measurement and deployed-index verification protocol remains pending, with no latency claim. The separate generated RTL asset pending build note remains unchanged; the new visibility rules are critical native CSS, not duplicated in that asset.

Documentation/guide handoff: UI22 explicitly distinguishes one visible indicator from merely sharing a ring and requires page+lookup, lookup-only, modal+background and save+lookup conformance for every page. Skill rule + revision row and integration/final packet templates updated in the same task. Shared in-app guidance and Suppliers guide now describe foreground precedence rather than one indicator per independent operation. All eight packets regenerated via generator, with PHASE05/06 semantics reviewed and final -Check passing all8.

Verification: Angular parseTemplate parsed all23 scoped module templates; HtmlParser parsed index; TypeScript createSourceFile parsed both edited guide files; PostCSS parsed23 critical-style rules. Zero diagnostics; frontend scoped whitespace/diff review passed. Optional selector-parser package was unavailable and was not installed; no selector-parser result is claimed. Root reviewed the actual five common visibility selectors against Layout/StateMessage/EditorDialog/PrimeNG portal source, with no business source edits. Builds/tests/lint/browser/database/migrations/commits were not run. Runtime confirmation of one visible indicator, dialog stacking, errors/cancel/overlap, light/dark/RTL/motion/screen reader remains owner-pending; source confirmation is complete for Customers/Suppliers.

## Latest owner clarification — page progress for Statement/filter bootstrap

The owner explicitly requires Statement of Account loading on the page, not in
filters, as a uniform behavior, and asks to update the documents. This overrides
earlier local-auxiliary/fallback presentation in workspace guidance, Master5,
UI22, skill and this report; no financial/cache policy is overridden. The same
existing Frozen handoff records the amendment before source edits. Root handled
this sequential shared change without additional delegation.

| Shared owner | Current implementation / lifecycle evidence |
|---|---|
| LoadingService | Existing subscribed pending count unchanged. New identity-owned pageLookups Set contributes to isLoading and the same coalesced BehaviorSubject/NgZone publication. setPageLookupLoading adds/deletes only its owner, idempotently; no lookup release consumes a request count. reset clears request counts; live lookup identities follow mounted component lifetime and release on destruction. Query/fragment-only preservation remains |
| ReferenceLookupStatus | Defaults loadingScope to page via LOOKUP_LOADING_SCOPE; ngOnChanges synchronizes existing loading state into its identity lease, ngOnDestroy removes only its own lease. Page template renders errors/Retry but **no inline loading StateMessage**; dialog scope retains one local StateMessage. No additional HTTP/watch/timer or cache source |
| EditorDialog | Provides LOOKUP_LOADING_SCOPE=dialog through providers, so view/projected/nested status consumers inherit dialog progress. This preserves Supplier editor, customer group changes, driver draft and other existing shared dialogs; no global lookup count is added behind their mask. Explicit loadingScope supports an approved nonstandard dialog |
| Layout | Same existing showPageLoading metadata, one page host/card, no second host. Lookup-only pending work now activates that host; finishing operational work cannot hide it while the lookup Set remains nonempty |

Source inventory selected only ReferenceLookupStatus consumers: **36 HTML
templates /39 status nodes**. Five direct dialog ancestors are EditorDialog
(PurchaseRequest creation, Amortization, both Customer group dialogs, Supplier
editor); no direct raw p-dialog consumer was found. Company driver fields inherit
through DriverDraftComponent's EditorDialog. Other current routed consumers
inherit page scope without per-screen opt-in. This is a shared-consumer impact
inventory, not a new review or source change to unrelated reference modules.
The provider/projection mechanism is supported by
[Angular's official injector contract](https://v20.angular.dev/guide/di/hierarchical-dependency-injection#providers-vs-viewproviders);
runtime DI/portal verification remains pending.

### Required Customers/Suppliers and Statement reconciliation

| Path | Producer → consumer → visible owner / recovery |
|---|---|
| /StatementOfAccount | Actual CustomerStatementRoutes → CustomerStatementComponent; loadCustomers uses Customer/GetSelect through existing shared service, loadingCustomers true then finite finalize false, both failure channels and explicit Retry. Always-mounted ReferenceLookupStatus observes loadingCustomers or referenceLookups.loading; default page scope activates Layout even before any Search. Report's existing global start/finalize composes with that lease; errors/selection/control sync/watch/teardown unchanged |
| /SupplierStatement | Actual SupplierStatementRoutes → SupplierStatementComponent; loadSuppliers uses Supplier/GetSelect, loadingSuppliers true and finalize false, failure/Retry preserved. Always-mounted status uses default page scope. Report global count unchanged; no inline filter loading branch remains. Summary/current-balance date/hint and period semantics unchanged |
| Other Customer routes | Company/Individual lists and routed profiles, Alerts, balances, aging and follow-up existing status nodes inherit page bootstrap. Their report/list/write counters, all10 explicit table suppressions, reference error/Retry and context/watch/draft/teardown remain. Contact-group and driver bootstrap inherit dialog scope; statement/history dialogs keep existing local read status |
| Other Supplier routes | Supplier list/count/write untouched; body-editor detail/lookup remains local via shared dialog provider. Balances Branch/Supplier/Staff and aging Supplier/group required bootstrap use page leases; report counts and all6 table suppressions unchanged. Statement drill-down read remains local/Retry |
| Cache refresh | ReferenceLookupBindings uses state.loading && state.value===null; retained snapshot revalidation never acquires a blocking page lease. Existing sources/writers/import invalidation/topics/selected-label/context/failure/Retry/teardown from the detailed cache matrix above remain unchanged |

Source conformance: Report and lookup may finish in either order; the getter
retains progress for any remaining request count or lookup identity. Releasing
one owner cannot clear another, repeated true inputs cannot double-count, and
destruction cannot decrement an independent request. Cached bootstrap finishing
within the same turn retains existing coalesced no-flash publication. These are
source-path findings, not executed overlap/timing tests.

Documentation: workspace loading guidance, Master5, UI2 and UI22 now explicitly
say required initial/filter bootstrap uses page progress; obsolete slow-lookup
local-fallback wording was reconciled. Skill rule and dated history row updated
together; PHASE03/05/06 templates require page-only bootstrap and dialog scope
checks. All8 packets regenerated via generator and final -Check passed. Shared
in-app guide, Suppliers guide, and Customer Statement topic updated; the latter
previously described progress beside filters and now describes page-only progress.

Verification:6 edited TypeScript sources parsed; all36 consumer templates plus
shared lookup template and Layout parsed (38 total), zero diagnostics. Scoped
frontend/docs diff --check passed; root reviewed complete scoped source changes,
imports/type export/provider registration and generated rule semantics. No new
Angular component/compiler root, translation key, API/backend/schema/migration
or dependency. No builds/tests/lint/browser/database/commit commands run.

Performance/index delta: **zero added HTTP/SQL calls or changed query/page/data
volume**; no serialization/cache eligibility changes. This affects visible page
busy duration, not request speed; no measured speed claim. No new index is
justified by presentation leases, and existing feature index dispositions remain
pending under the earlier owner measurement protocol. Owner acceptance compares
cold/warm lookup-only and report opens, same device/network/tenant/data/context,
five samples and median, completion in both orders, false/HTTP failures/Retry,
query-only/path departure, projected dialog, retained refresh and accessibility/
RTL/theme/motion. All runtime/SQL/timing evidence remains pending. Prior generated
RTL asset build handoff is unchanged; no new appearance asset was introduced.

## إصلاح تمرير مؤشر التحميل في النوافذ الصغيرة — ١ نوفمبر ٢٠٢٦

العقد المجمد لشريحة إصلاح عرض صغيرة: يملك src/index.html المظهر المشترك الوحيد للتحميل، ويملك EditorDialog موضع تغطية الحفظ. sigma-loading-card الحالي يجمع overflow:auto وmax-block-size:100% مع محتوى رأسي كبير وحشو28×24؛ داخل جسم نافذة صغير تصبح البطاقة نفسها منطقة تمرير. القرار هو تكيف تلقائي حسب ارتفاع مساحة الغطاء، لا تغيير ارتفاع النافذة ولا إخفاء تمرير محتواها أو إضافة spinner. يحتفظ العرض الاعتيادي بمظهره، ويصبح العرض المضغوط حلقة ونصًا في صف واحد مع حشو أقل وعدم تمرير البطاقة، ومع عنوان كامل للنص الطويل. غطاء الحفظ داخل EditorDialog يقل حشوه إلى8px. لا مدخل جديد أو opt-in لكل شاشة، وكل مستهلك الغطاء الحالي يرث التكيف.

النطاق UI22/24/25 والمالك المشترك فقط؛ PHASE05/06 بتناسب بعد Check ناجح للثمانية. قراءة مرجع Speed غير منطبقة على خلل هندسة كارت تحميل Sigma المشترك؛ نقطة التحليل المرجعي تمت مراجعتها في نفس الجلسة، ولا عقد أعمال أو server rule مستنتج من صورة. لا backend أو query/cache/request جديد. تُحدث قاعدة UI22 والمهارة مع صف تاريخ ثم الحزم عبر المولد؛ يبقى القياس والمعاينة عند المالك. لا وكلاء: السبب وإصلاحه في مسار عرض مترابط صغير.

### المصالحة النهائية لإصلاح مؤشر النافذة الصغيرة

نُفذت الشريحة في أربعة ملفات واجهة: CSS الحرج داخل src/index.html، وحشو غطاء EditorDialog، وعنوان نص التحميل في قالب StateMessage، ودليل Administration في /UserGuide/administration. الحاوية المطلقة المحددة بالحواف تملك قياسها، ولا يغير size containment ارتفاع جسم النموذج. تعالج استعلامات الارتفاع160/56px مساحة الغطاء نفسها؛ حجم الحلقة والحشو واتجاه العرض يتكيفون، والبطاقة المضغوطة لا تملك overflow:auto. النص المتاح لقارئ الشاشة باقٍ كاملًا، والعنوان يتيح قراءة النص المختصر؛ حالات empty/error لا يتغير ترتيبها أو عنوانها.

تتبع مستهلك نافذة قصيرة فعلية: /UnitsOfMeasures → UnitsOfMeasuresComponent → UnitOfMeasureEditor → app-editor-dialog[saving] → app-editor-dialog-progress → StateMessage.sigma-loading-card. حفظ المصدر يتابع علم saving الحالي، وغطاء الحفظ الحالي هو المالك المرئي دون إنشاء اشتراك أو تأخير. تفاصيل النافذة وReferenceLookupStatus المحلي يحتفظان بمسار StateMessage المباشر؛ لا تغيير لعداد LoadingService أو error/Retry أو disable/aria-busy أو cancellation. لا GET جديد أو opt-in كاش أو writer/import أو tenant topic جديد؛ جرد مصادر الشاشات السابقة محفوظ. لا query أو بيانات أو مفاتيح أو ترتيب أو فهرس مختلف، ولا قياس سرعة جديد أو Add-Migration.

نُقلت القاعدة إلى UI22 والمهارة مع صف تاريخ 2026-11-01 في المهمة نفسها. أُعيد توليد PLAN00 وPHASE00–06 بالمولد فقط، وروجعت تغييرات provenance/الكتل دون تغيير الأدوار المرجعية أو عقود الحزم؛ نجح Check للثمانية. روجع كامل فرق الواجهة الأربع وفرق UI22 وصياغة المهارة. نجح تحليل CSS الحرج وSCSS النافذة وقالب Angular ودليل TypeScript وgit diff --check. حُفظت تغييرات بحث وحدات القياس والدليل الآخر الموجودة مسبقًا. لا اختبار أو بناء أو lint أو متصفح أو قاعدة بيانات أو نشر أو commit. التحقق المرئي عند المالك: حفظ نافذة الاسم الصغيرة، وحفظ نافذة أطول، وتصغير ارتفاع النافذة، والنص العربي الطويل/RTL والمظهر الداكن، والتأكد أن كارت التحميل بلا تمرير وأن تمرير النموذج الطبيعي باقٍ. لا يُدعى قبول هندسي مقاس من فحص الصياغة.

رسالة حفظ مقترحة للواجهة: fix(loading): adapt overlay cards to short modal content

رسالة حفظ مقترحة للوثائق: docs(ui): define compact loading for short overlays
