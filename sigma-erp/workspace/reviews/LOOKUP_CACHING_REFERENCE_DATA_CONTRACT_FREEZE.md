# Reference lookup caching — Country / UnitsOfMeasures

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-23 |
| Authorization | Owner: «تمام ابدأ» following first-step inventory and recommendation |
| Scope | Frontend shared data cache, Country, UnitsOfMeasures and existing CompanyDriver Country read; tests and common guide |

## Decision and evidence

The prior inventory plan remains a historical Draft. This handoff freezes its first implementation slices; it does not authorize caching the other 53 ordinary sources or settings. User authorization permits routine implementation choices. Five-minute absolute TTL and 64-entry LRU limit are conservative technical defaults for these two reference sources, not a business freshness promise or measured performance result. Clear settled snapshots on window focus/visible return; the next lookup rereads. Cross-user changes while a tab stays active become visible on expiry/explicit force-refresh, not instantaneous notifications.

Authority: Master4/5/7/8, UI2/16/22/28/29, BE10; recipe Check all8 passed before PHASE01/05/06 use. Apply screen-refactor skill digest. UI shape is ordinary typed lookup; backend shape is unchanged normal-entity select. No screen geometry, DTO, filters, eligibility, amounts, tenancy predicates, database, route, provider/interceptor order or service-worker change.

## Frozen contracts

- `BaseService.getSelectList<T>(options?: { skipErrorInterceptor?: boolean; forceRefresh?: boolean }): Observable<T>` preserves existing call sites and adds optional force refresh. A protected boolean `cacheSelect` defaults false. Only CountryService and UnitsOfMeasuresService opt in. Public generic response shape is unchanged.
- New root `ReferenceLookupCacheService.read<T>(url: string, load: () => Observable<T>, options?: { skipErrorInterceptor?: boolean; forceRefresh?: boolean }): Observable<T>` owns snapshots, concurrency and lifecycle. `invalidate(url: string): void` evicts both feedback modes for that source; `clear(): void` evicts every entry and cancels in-flight reads. TTL=300000ms; max entries=64, LRU on use; no persistent business-data storage.
- Read acquisition occurs at subscription time. Reusing an old observable must check current context/expiry again, not replay its old captured response. Snapshot returns and shared in-flight emissions are defensively cloned for each subscriber. Option id types/order/labels and all envelope metadata remain exact.
- Snapshot only a successful envelope with an `entities` array, including empty. HTTP errors, false `isSuccess`, malformed data and completion-without-value never remain as snapshots/in-flight entries. Preserve the existing failure response or HTTP error for consumers. Default versus skip-error requests have separate in-flight/cache keys so their existing feedback policies cannot be borrowed from another subscriber.
- One subscriber leaving does not cancel another subscriber's shared request; the final consumer leaving does abort it. Source completion, transport error and navigation cancellation evict unfinished requests. No new session-lifetime exemption is added to page reads.
- Context includes authenticated subscription/user, current branch default and current language; session credential replacement advances an in-memory generation without putting credentials in keys/logs/storage. Resolve credentials through existing `readAuthToken`/`observeAuthToken`; observe current-user and language changes too, and recheck at subscription and response boundaries. A context reset cancels/fences old pending reads and removes old snapshots. With incomplete authenticated context, do not retain results.
- Cache key additionally includes the full actual source URL and feedback mode. Initial endpoints have no parameters; future parameterized sources require a separately frozen key contract. Branch participates only as conservative invalidation context; it never changes the HTTP query or open form selections.
- Source invalidation occurs after a confirmed successful mutation and before downstream success callbacks. Generic BaseService post/put/delete and typed Country/UOM create/update/remove use one protected success-only invalidation operator. Generic inherited bulk/legacy writes in the opted-in services also invalidate. Failed writes keep the valid snapshot. Old pending reads are cancelled/fenced so they cannot repopulate after invalidation. Lists/details/exports/check-unique remain uncached.
- Country CompanyDriver `getCountries()` delegates to CountryService with its existing inline-error mode. All other consumers, including ItemRequisition's generic UOM helper, inherit service behavior without template changes. No separate component cache and no public CVA change.
- Explicit browser refresh/reload remains available. Force-refresh applies to next subscription and invalidates the source. Focus return invalidates settled snapshots only, preserving a pending page load; it does not automatically patch the values/options of an already open form.

## Conformance / reference gate

| Concern | Book | Inspected reference / owner | Target |
|---|---|---|---|
| Ordinary select and empty success | UI16/BE10 | BaseService.getSelectList, Service.SelectAsync, Repository.GetDropdownAsync; BranchService normal entity shape | Same API/envelope; explicit opt-in source only |
| Feedback | UI2/22 | BaseService skipErrorInterceptor and existing Country/UOM components | Preserve both error channels; separate feedback mode keys |
| Mutation invalidation | UI2 | FinancialNumberPolicyService.invalidate / CurrencyService typed successful-write tap | Reuse success-only timing, add in-flight fences for new cache |
| Session | UI2/28 | CurrentBranchService session-version; auth-token observeAuthToken; realtime credential observation | Shared lifecycle, no raw credential key, no generic stale replay |
| Read lifetime | UI28 | navigationActivityInterceptor and existing takeUntilDestroyed consumers | Final subscriber teardown plus existing navigation cancellation |
| Saved labels | UI16 | mergeSelectOptions and CompanyDriver consumer | Clone source snapshots; screen merge and actual historical names unchanged |
| Guide | Master7 | existing shared-screen-guidance / GuideReader | Explain reference-list refresh, expiry and session behavior in EN/AR |

## Verification and ownership

Root owns application implementation, integration, documentation authority updates, full diff and final report. A bounded test agent may own only new cache and source-integration spec files against this handoff. No overlapping files. No backend edits/migrations/commits/deployments. Existing build/test/browser authorization from this migration conversation persists; run focused cache/source HTTP tests and production compilation. Do not claim real multi-user/browser/network performance acceptance from these checks.

Required tests: sequential hits, concurrent dedup/independent clones, TTL, empty success, HTTP/declared failure Retry, last-subscriber abort versus partial teardown, empty completion/navigation cancellation, force refresh/old-observable reuse, invalidation during pending response, context/token/language/branch changes and late-response fence, focus return, bound eviction, default/inline feedback separation, Country/UOM typed and generic successful/failed writer paths, CompanyDriver delegation, non-opted-in service remains uncached, fresh list/details behavior. No persistence/API/schema/calculation/authorization contract change; Add-Migration not required.
