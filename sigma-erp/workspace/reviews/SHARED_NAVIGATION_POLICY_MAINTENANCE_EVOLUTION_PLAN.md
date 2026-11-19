| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-22 |
| Authorization | Owner approves the proposed best navigation policy and asks that obsolete page reads cancel on departure |

# Shared navigation policy

## Existing state and target

The shell makes navigation/content inert during CurrentBranch.saving, but LoadingService is only a route-reset reference counter and cannot distinguish reads from writes. Feature CanDeactivate functions own richer discard/attachment/business decisions (Job is the UI10 reference); preserve them. Reviewed editor forms use appMockData/MockDataFormsModule; filter forms use appFilterPanel and are not editable-record drafts. Current root HttpClient has token/error interceptors and Sigma API origin boundary. No backend or accounting change applies.

| Concern | Classification | Frozen target |
|---|---|---|
| Shared write activity | Create | One root counter with idempotent request release, no relationship to LoadingService; only mutating Sigma API requests, conservative method classification. GET/HEAD/OPTIONS never block; explicit read context supports POST reads. No automatic retry or new write timeout policy. Release on final HttpResponse/error/unsubscribe, before feature success/failure callbacks. |
| Route policy | Extend | Central authenticated-shell canActivateChild plus canDeactivate handles menu, shortcut, imperative Router and browser history. Block during write/branch-save or pending discard. Existing feature CanDeactivate remains authoritative and is not duplicated; global draft fallback applies only where it lacks a feature guard. Do not weaken business/attachment/pending-row guards to permit read navigation. |
| Shared drafts | Extend | Register actual reactive forms through the existing shared MockDataForm owner (not generated data behavior), including forms projected in dialogs. Detect dirty enabled visible editable forms; View/read-only/pristine leaves silently, filters excluded. Defer one shared discard dialog; freeze actual form states via freezeFormStates and restore original disabled subtrees on cancel/cancelled navigation. Keep identity/lifetime checks and never mutate saved values on cancel. |
| Read cancellation | Create | Shared API interceptor captures current navigation identity. Unsubscribe page GET/HEAD/explicit-read POST after a different NavigationEnd, not NavigationStart (a rejected guard must keep the current read). Reads started for the target navigation retain its ID and continue. Context explicitly preserves root CurrentBranch/Localization/MockData preferences session reads across route changes. Cancellation is client-side and never claims server rollback. |
| Shell affordance | Extend | Header shortcuts/logo/account navigation and desktop/mobile menu indicate blocked writes and prevent interaction; keep body dialogs/failure UI usable. Shared translated status explains write/pending decision and release. Ordinary read loader does not disable navigation. Native beforeunload warns for dirty/write state; browser owns its generic message. |
| Legacy adoption boundary | Keep | No all-feature source sweep. Existing routed guards retain their own lifecycle contracts. Unregistered legacy forms require adoption in their screen review; do not claim a component-name heuristic proves all application drafts protected. New/reviewed editor forms use the shared registration owner. |

## Conformance and integration

Owning books Master4/5/7, UI1/10/22/27/28/29. References: LayoutComponent, app.config/app.routes/LayoutModule root route, LoadingService, errorInterceptor/isSigmaApiRequest, CurrentBranchService, TranslationService runtime read, MockDataFormComponent, ConfirmationDialogService, freezeFormStates, and JobEditor.canDeactivate. Preserve routes/provider identities, API payloads, session data, theme/RTL/print and editor control values. No authorization API, database, EF migration or package change.

Frozen implementation split: root owns activity service/context/interceptor, root-session opt-outs, shell affordance/translations/guides and docs; one bounded agent owns policy service/guard/form registry integration + tests and LayoutModule route guard wiring. No overlapping files. Test request success/business failure/error/cancel counters, route read cancellation versus rejected/target-navigation/session reads, dirty/pristine/view/filter/feature-guard paths, one pending confirmation and control restoration, Back/Router/menu entry and beforeunload. Existing authorized tests/build/browser apply; no commit/push/deploy/data mutations. No write timeout is invented: network timeout/failure releases the lock, with uncertain server result checked before repeat submission.

## Final reconciliation

Implementation integrated; final verification results follow below. The frozen targets above remain the decision record.

| Concern | Owning block | Compared source/reference | Shared owner and final match |
|---|---|---|---|
| Route exit decisions | UI10/28 | Installed Router getRouteGuards; JobEditor.canDeactivate; LayoutModule.routes | Shell always-run CanDeactivate owns one fallback, child activation checks busy state; existing feature guards retain their decisions. Real Router tests cover nested, query, parameter, shell departure and browser history. |
| Draft identity and control state | UI10 | MockDataFormComponent; freezeFormState | Registers the actual lazy form even when mock generation is disabled. Captures only visible enabled dirty editors, freezes root subtrees once, preserves values and disabled controls, and restores only the same live form owner. |
| API activity | UI22 | app.config single HttpClient; token/error interceptors; isSigmaApiRequest | One independent idempotent write counter, released before feature response/error callbacks. Existing client, authentication, error handling, URLs and payloads preserved. |
| Advisory duplicate checks | UI22/28 | BaseService.checkUnique; UniqueValueCheckRequest read-only contract | Explicitly marks this shared POST as read-only, retaining method/body/headers while allowing departure and cancelling the obsolete request. No endpoint-name heuristic. |
| Page read lifecycle | UI28 | Installed Router currentNavigation/lastSuccessfulNavigation signals; NavigationEnd; HttpTestingController | Cancels subscribed page reads on a different successful navigation; rejected navigation and target-navigation reads are retained. Tests assert actual transport cancellation. |
| Session reads | UI22/28 | CurrentBranchService; TranslationService/LanguageService; MockDataService.settings | Explicit context retains root branch, language dictionary/options and preferences reads. Ordinary screen language-options reads remain cancellable. |
| Shell presentation and access | UI1/24/27 | LayoutComponent header/aside/mobile menu and existing shell sizing | Native inert prevents menu/header interaction only during writes/decisions; ordinary read loading keeps navigation available. Status text uses translated shared chrome; beforeunload warns for registered drafts/writes. |
| Documentation | Master7/8 | Existing UserGuide reader, shared-screen-guidance and administration-guide | Both guide languages explain departure, read cancellation, drafts and uncertain save results. UI10/22/28 and skill revision synchronized; all eight derivative packets regenerated and checked. |

Scope boundary: no backend, API contract, route catalog, provider-registry, package, database, migration, commit, push or deployment change. Legacy forms without shared registration or an existing feature guard are not claimed as protected. Interactive localhost visual/print acceptance remains owner-pending because the available browser inventory exposes no application tab.

### Verification evidence

- Targeted policy/router/interceptor/shell checks: 25/25 passed. Final whole frontend suite: 536/536 passed in57.674s; `.angular/navigation-policy/targeted-tests.log` and `full-suite.log`. Browser Back uses the real Router location-change listener. No Angular component diagnostics or runtime errors in the final suite. The same150 reactive-disabled warning occurrences are present in the earlier517-test suite; no diagnostic suppression was added.
- ESLint over all changed/new TypeScript/templates reports only the six unchanged constructor-injection findings at TranslationService lines67–72. Running ESLint against that file from HEAD reproduces the exact six findings; no newly introduced lint finding. Evidence: `lint.log` and `lint-translation-baseline.log`. Whitespace diff check passed.
- Source reconciliation preserved the LayoutModule provider registry and root single HttpClient/auth/hash route configuration; only the shared guards/interceptor were added. Reviewed Company/Individual save callbacks mark their forms pristine; PurchaseRequest retains its existing richer CanDeactivate. No global save-value mutation or mark-pristine behavior was introduced.
- Canonical UI10/22/28 and skill revised together, all eight packets regenerated and final read-only generator check passed. Semantic review retains the phase gates, existing feature guard authority, explicit session-read contexts, and documented legacy adoption boundary.
- Final shared-service reconciliation identified BaseService.checkUnique as a confirmed read-only POST (declared advisory/read-only in source). It now uses the frozen explicit-read context; the added HTTP test checks unchanged method/body/headers, no write lock and actual cancellation. Its two existing constructor-injection lint findings are reproduced from HEAD as well. Final verification after this amendment is recorded below.
- Final amended full suite: **537/537 passed**, 68.148s, `.angular/navigation-policy/full-suite-final.log`. Combined lint boundary is eight pre-existing constructor-injection findings (six TranslationService, two BaseService), each reproduced from HEAD, with no new lint finding. The final source diff and provider/route/client wiring were reviewed; no ignored compiler/runtime diagnostic, package/budget change or unrelated edit was introduced.
- Final amended production build: **exit0**, 166.939s, UTC2026-10-22T19:23:27.906Z; `.angular/navigation-policy/production-final.log`. Initial5.74MB; the same six existing size-budget warning categories (initial, Auth, DataTable, FilterPanel, EditableCollectionTable, Receipt) and no compilation errors. Final tests retain the same150 reactive-disabled warning occurrences, zero Angular component diagnostics and zero runtime errors. Final whitespace check and all8 recipe checks passed. No interactive localhost/print acceptance is claimed.

| Closure field | Value |
|---|---|
| Status | Closed |
| Owner verification pending | yes |
| Result | Shared navigation policy implemented and scoped source diff reviewed;537 tests and production build pass |
| Remaining boundary | Owner interactive acceptance; existing budget/lint/reactive-disabled debt; legacy editor registration adoption during each screen review |

### Guard ordering refinement before verification

Installed Angular21 router getRouteGuards reruns a reused component's CanDeactivate when runGuardsAndResolvers is always. Use that existing shell route exit hook as the single dirty-decision owner, including child/query/parameter changes and shell departure; canActivateChild checks only busy state. This avoids replay/subscription caches and duplicate parent/leaf confirmations. Feature CanDeactivate still owns decisions when its own route will be checked (changed config/params or its explicit query/always mode). Keep the fallback for query changes where the feature's default guard would not run. Source evidence: @angular/router/fesm2022/_router-chunk.mjs getRouteGuards/shouldRunGuardsAndResolvers. Validate with real Router tests, not only fabricated snapshots.

### Frozen correction — same-page query synchronization (2026-10-22)

Owner reports Individual Edit contact group disabled after the navigation change. Source trace: IndividualPartnersComponent.ngOnInit starts joined branch/group lookups, then search writes list state through writeListRoute (Router.navigate queryParams/replaceUrl). The action requires contactGroupsReady, set only by the joined response. Cancelling reads on every new navigation ID completes that join without a value on a same-page query update, leaving readiness false without an HTTP error.

Freeze the correction in the existing interceptor: capture navigation ID plus the target/current parsed URL path (including path/matrix/outlet identity), ignore query and fragment changes, and cancel only on a different successful page path. Preserve target-navigation/session read exceptions and write tracking. Same-page search/paging stale requests remain owned by existing switchMap/identity guards. No Individual action gate is removed, no endpoint or business contract changes, and no per-screen opt-out is added. Applicable UI shape is type03 step-form record (the Individual list/editor is its approved reference); actual shared cancellation owner is UI28/Phase5. Compare against Individual.bindListQueries and writeListRoute; no backend shape applies. Regression tests cover joined lookup readiness across query updates, different-record paths and real departure; update UI28, skill and shared user guidance before final reconciliation. Earlier closure/test evidence above remains historical.

#### Correction reconciliation

| Concern | Canonical owner and actual source | Final conformance |
|---|---|---|
| Disabled action | UI7; IndividualPartnersComponent.actions/loadLookups | Preserve contactGroupsReady/saving gate and HTTP failure retry. No Individual action or business-rule source edit. |
| Read lifetime | UI28; navigationActivityInterceptor; writeListRoute; Individual.bindListQueries | Capture navigation identity and serialize the full UrlTree root without query/fragment. Preserve joined lookups on query sync, cancel different record/matrix/outlet paths, keep feature switchMap and session exceptions. |
| User instructions | Master7; existing shared-screen-guidance and UserGuide reader | EN/AR guidance explicitly says same-screen search/paging preserves lookup loading; no new guide route. |

Before-fix regression reproduced: joined lookup test failed because the group request was cancelled by a query-only NavigationEnd (query-regression-before.log,1 failed/6 passed). Final full suite **539/539 passed**,67.200s; query-fix-full-suite-final.log. Final production build **exit0**,153.024s,UTC2026-10-22T19:35:52.259Z; query-fix-production-final.log. Initial5.74MB with the same six existing size-budget warning categories; no budget/diagnostic suppression. Scoped ESLint exit0 (query-fix-lint-final.log), frontend whitespace diff check passes. Source and complete current interceptor/spec/guide diff reviewed. UI28+skill rule and revision row synchronized, all8 packets regenerated semantically retaining phase/reference roles, final generator check all8 OK.

Only shared interceptor/spec/user-guide application files changed in this correction. No backend/API/payload/provider/route catalog/permission/schema/migration changes. No commit/push/deploy/DB commands or subagents; this was one small sequential debugging stream. Browser interaction is not claimed. Owner acceptance: refresh Individual once, let group lookups finish and open Edit contact group; search/paging on the same screen should keep lookup loading alive, while actual page departure still aborts obsolete reads. Existing false-success/HTTP-error lookup handling and retry remain unchanged.

| Correction closure | Value |
|---|---|
| Status | Closed |
| Owner verification pending | yes |
| Result | Query-navigation regression repaired in shared owner;539 tests and production build pass |
| Suggested frontend commit | fix: preserve page lookups during query navigation |
