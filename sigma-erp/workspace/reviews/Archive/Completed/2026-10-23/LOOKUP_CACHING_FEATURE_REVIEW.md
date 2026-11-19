# Country / UnitsOfMeasures reference lookup caching

| Field | Value |
|---|---|
| Status | Closed |
| Owner verification pending | yes |
| Date | 2026-10-23 |
| Scope | Frontend data-cache owner, Country/UOM service opt-in, indirect Country consumer, common guide and focused tests |
| Contract | `LOOKUP_CACHING_REFERENCE_DATA_CONTRACT_FREEZE.md` — Frozen |

## Outcome / manifest

Country and UnitsOfMeasures choices reuse a successful in-memory source snapshot for up to five minutes, with a 64-entry LRU cap. Identical pending reads share transport, with independent response copies for each consumer. Successful source writes invalidate both error-feedback variants before feature callbacks. Session/user/tenant/branch/language replacement cancels old requests and drops their snapshots; credential values are never keys or persisted data. Returning to the visible tab drops settled snapshots for the next lookup without cancelling pending bootstrap. Existing form selections are untouched.

Only these two data services opt in. Other dropdowns, settings, balances, available documents, list/details/export/duplicate-check reads, service-worker data groups and all backend contracts remain unchanged. The implementation follows UI2/16/22/28/29 and BE10 under Master4/5/7/8 and the skill. No API/schema, entity, DTO, calculation, AutoMapper, permission, route, layout, theme or print change. No migration required.

## Source ownership and changes

Paths in this table are relative to `F:/My Work/Sigma/SiGmaAngularFrontEnd`.

| File | Change / actual responsibility |
|---|---|
| `src/app/modules/shared/service/reference-lookup-cache.service.ts` | New root memory owner: deferred acquisition, clone boundaries, expiry/LRU, in-flight sharing/teardown, error eviction, source/session reset fences, auth/token/language and focus lifecycle |
| `src/app/modules/shared/service/base-service.service.ts` | Protected opt-in false by default; lazy resolution of shared cache only when used; optional forceRefresh; common success-only invalidation for generic post/put/delete/AddList/UpdateList |
| `src/app/modules/Administration/Country/services/country.service.ts` | Opts in ordinary select and invalidates after typed create/update; remove inherits the already-invalidating delete |
| `src/app/modules/Stock/UnitsOfMeasures/services/units-of-measures.service.ts` | Opts in ordinary select and invalidates after typed create/update/remove |
| `src/app/modules/Customers/Companies/CompanyDriver/services/companydriver.service.ts` | Existing getCountries delegates to CountryService with unchanged inline-error mode; no direct Country transport copy |
| `src/app/modules/shared/service/reference-lookup-cache.service.spec.ts` | Cache tests: concurrency/copy safety, TTL, old-observable reuse, empty/error/retry, final versus partial unsubscribe, invalidation/context fences, feedback/focus and capacity |
| `src/app/modules/shared/service/reference-lookups.integration.spec.ts` | Real service + HttpTestingController tests: opt-in, headers, CompanyDriver sharing, typed/inherited mutation success/failure, fresh non-cache paths, force refresh and actual navigation-interceptor cancellation/retry |
| `src/app/modules/UserGuide/content/shared-screen-guidance.ts` | Existing common guide gains matching English/Arabic reference-choice refresh behavior |

No feature template or control wrapper changed. All existing Country/UOM consumers inherit the behavior through their existing service instances, including ItemRequisition's generic helper. Existing page retries and `takeUntilDestroyed` remain at their actual owners. There is one root HTTP client and no additional interceptor/provider order change. The service is imported normally through the runtime graph; no broad TypeScript include or test-compilation boundary change.

## Phase and contract reconciliation

| Concern | Owning source/book | Final-source reconciliation |
|---|---|---|
| Phase0 discovery / Phase1 freeze | Inventory plan, source tables, BE10 | Country/UOM response is still the existing Results/DropDownSelect with exact id/labels/order/metadata; inactive/tenant predicates unchanged |
| Opt-in ownership | UI2, BaseService and Country/UOM | `cacheSelect` false at base and true only in two services; source-level reuse across current consumers |
| Source DTO / form / writes | BE10/UI16, existing source models | Same typed create/update/remove payloads; no field/nullability/validation change |
| Empty/failure channels | UI2/22, existing response wrapper | Successful empty array cached; false envelope/malformed success/HTTP error not retained; failure itself still reaches existing owner |
| Feedback | Base skipErrorInterceptor / errorInterceptor | Default/inline variants keyed separately; headers and mutation toast handling unchanged |
| Mutation callbacks | UI2 currency-policy precedent | Common success-only tap invalidates before downstream next; typed Country/UOM and inherited writers covered; failed writes preserve snapshot |
| Old pending result | UI28, context-version precedent | Entries removed before cancel notification; response admission checks actual current entry and current context; old observables reacquire on every subscription |
| Concurrent consumer lifetime | UI28, RxJS sharing | Copies occur after sharing; one unsubscribe leaves other consumer active; final unsubscribe aborts source and removes incomplete entry |
| Navigation | Existing navigationActivityInterceptor | No KEEP_READ_ON_NAVIGATION addition; empty completion evicts so next lookup retries; same-page navigation behavior remains existing owner |
| Limits / return to tab | Frozen technical defaults | Absolute TTL300000ms from accepted response; max64 entries, LRU on use; next-load refresh after visible focus return; pending bootstrap kept |
| Session isolation | auth-token helpers/current user/TranslateService | Scope and credential change checked on events, read subscription and response admission; no cache persistence/credential key |
| Saved selections / controls | mergeSelectOptions, CountryDriver consumer | Cache stores source envelope, not feature-merged or translated arrays; deep clones prevent consumer mutation; no values silently rewritten |
| Phase2 grid / Phase3 editor / Phase4 actions | Existing source UI and services | No grid/detail/action contract refactor; only read transport and successful write invalidation; no new domain action |
| Phase5 integration | root services/imports | Lazy cache lookup avoids injecting session/translation dependencies into unused BaseService instances; CompanyDriver uses actual Country owner |
| Phase6 / scope preservation | Complete frontend diff, backend status | Only listed source files; prior backend solution-filter edit and document deletion preserved; no commits/push/deploy/database actions |

## Documentation and packet maintenance

Canonical UI2 now owns the selective reference-cache contract; the skill checklist and its revision-history row were updated together, with a canonical changelog entry. This is a data-source policy, not a shared-presentation opt-in. The existing settings-review no-new-cache boundary in BE16 remains intact. Broader lookup/settings cache lifecycle findings in the original inventory are not silently implemented.

Ran generator after the canonical change, regenerated all8 packets through the official generator, and reran `-Check` successfully. Semantically checked the changed UI2 fingerprint in Phase5 against the actual source opt-in/lifetime contract; packet ownership, API/backend boundaries and approved reference roles remain unchanged. No generated packet was edited directly.

Guide handoff: existing `SHARED_SCREEN_GUIDANCE` is rendered through the current GuideReader module overview. Existing route/menu registration `UserGuide/:sectionId` is reused; no new menu or disconnected guide. EN/AR content names countries/UOM only, maximum reuse period, next-load behavior after saving/tab return/context change, preserved open selections, explicit reload for another user's immediate edits and retryable errors. No offline or instantaneous multi-user synchronization claim.

## Verification

| Check | Evidence / result |
|---|---|
| Production build | Exit0; 193.297s, UTC2026-10-23 04:33:32; initial3.81MB. Same six pre-existing size-warning categories: initial, Auth, DataTable, FilterPanel, EditableCollectionTable and Receipt. No budget/diagnostic suppression. `.angular/lookup-cache/build.log` |
| Full tests | Exit0, **545/545 SUCCESS** (529 existing +16 new), total63.717s, tests61.409s. Includes new service/HTTP tests and existing navigation/consumer suites. `.angular/lookup-cache/suite-final.log` |
| Scoped lint | New cache/tests and other changed files exit0 (`lint-new.log`). BaseService still reports two constructor `prefer-inject` findings; the same two findings are reproducible from HEAD (`lint-baseline.log`). Existing explicit constructor contract retained; no rule suppression or unrelated injection migration |
| Source checks | Frontend full scoped diff plus all3 new files reviewed, no merge markers/trailing whitespace; only2 opt-in owners; API dataGroups still0. Backend prior2 changes unchanged. Final recipe Check all8 current |
| Real API / browser / multi-user / performance | Not run; automated HTTP tests mock responses. No measured production request-volume/latency/cache-hit claim |

Intermediate test attempts are diagnostic history, not final verification: the first targeted run exposed fixture mistakes (HttpTestingController match consumption, missing list filters); the first full compile caught an out-of-scope fixture helper. These were corrected in tests, without a product workaround or suppression. Final result is recorded above only after the final suite finishes.

Final suite console inspection found no Angular runtime/template error or failing assertion. Existing Karma image-fixture404 warnings (`light.png`/`dark.png`) remain visible; these were not hidden or repaired outside scope. A bounded peer source audit of the cache found no confirmed correctness defect. Closure here means implementation and automated checks; owner verification remains pending for the real API/data journeys below.

## Owner acceptance and operational limits

1. Open Company, Individual and nested CompanyDriver successively; confirm countries display identically and repeated same-context/feedback reads within the policy do not issue extra Country transport.
2. Create/rename/delete a Country or UOM, then reopen a consuming lookup; confirm a fresh read and updated choices. Failed save must preserve the previous valid choices.
3. Switch branch/language/account and rapidly navigate during lookup loading; verify fresh context, no stale options, normal Retry/loading completion and unchanged manual/saved selection semantics.
4. Edit a source in another tab/user session; return to the consuming tab and reload the lookup/screen. Returning invalidates reusable snapshots; already-open arrays do not update automatically. For immediate refresh without waiting, reload the screen. Server still validates all submitted references.

Cross-user edits in a continuously active tab are bounded by next-load TTL/force-refresh/reload; there is no new broadcast/server-version contract. The five-minute limit governs source reuse, not continuous automatic refresh of an open form. No permanent data storage or offline business workflow is added.

## Suggested commits

Frontend suggestion only (not executed):

```text
feat(lookups): cache country and unit choices within the current session
```

Documentation-owner suggestion only (not executed):

```text
docs(ui-book): define selective reference lookup cache lifecycle
```

No backend commit or Add-Migration is needed. All runtime/browser/data acceptance limits above remain explicit after automated verification.
