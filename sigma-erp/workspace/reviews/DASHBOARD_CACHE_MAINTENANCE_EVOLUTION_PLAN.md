| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-26 |

# Dashboard snapshot cache

Authority: owner requests applying cache to Dashboard. This explicitly opts in the display snapshot only; it never authorizes caching operational decisions or writer preconditions. Tier L because the existing shared cache gains a narrowly identified singleton source. PLAN-00 drift check passed before use. Implementation is authorized by the request, so this plan feeds implementation without a further approval step.

## Existing state, impact and gap decisions

| Area / owner | Existing state and consumers | Classification / target | Impact / phase |
|---|---|---|---|
| DashboardSnapshotService.getSnapshot | Root HttpClient; finite Result<DashboardSnapshot>; DashboardComponent only | Extend through existing ReferenceLookupCacheService | Frontend source adapter; 0/1/5 |
| ReferenceLookupCacheService | Scoped memory, clones, coalescing, revision fencing, 64 idle/LRU bound, watchers, existing realtime topics, header activity | Extend exact Dashboard/Snapshot singleton recognition, 60-second TTL and dashboard topic; preserve other source contracts | Shared source policy only; 5 |
| DashboardComponent | Per-filter switchMap, inline errors/Retry, token fence, 400ms event coalescing, 60-second reconciliation | Refactor to finite cache read then mounted shared watch; shared expiry owns normal 60-second reconciliation; remove duplicated feature topic refresh loop; retain visible failure-only periodic retry, manual forced reads and local busy | Dashboard only; 5 |
| Dashboard backend | Existing authenticated aggregate report; committed-change dashboard topic | Keep API, calculations, queries, topic dependencies and tenant scope | Read-only audit; 1/6 |
| Dashboard user guide | Existing bilingual topic and reader registration | Extend with reuse/freshness/force-refresh explanation | Content only; 6 |
| Canonical UI2 / skill | Singleton recognition currently settings only | Extend documented explicit source exception and digest together; regenerate derivative packets | Documentation; 6 |

## Ambiguity / decision review

| Decision | Status / evidence | Resolution |
|---|---|---|
| Cache eligibility | Confirmed: explicit owner request, read-only display report | Dashboard display snapshot only; no write-time use |
| Freshness | Derived: existing 60-second operational reconciliation | Absolute 60-second cache TTL, retain current reconciliation; manual Refresh/Retry force HTTP |
| Identity | Confirmed: two existing string filters and shared scoped cache | Full encoded ownership/fleetType URL, same feedback mode; session/tenant/user/branch/language fences inherited |
| Coherence | Confirmed: existing tenant dashboard topic and committed writer tracking | Invalidate all cached filter variants on connected/changed; active filter revalidates; idle variants stay stale until demand |
| Business/API/calculation decisions | Confirmed: existing DASHBOARD_REALTIME_API_CONTRACT_FREEZE | Unchanged; no material open decision or new policy |

## Options

| Option | Correctness / compatibility | Maintenance / risk | Decision |
|---|---|---|---|
| Feature-local replay/storage cache | Duplicates session, expiry and cancellation behavior | Another cache and invalidation owner | Reject |
| Server/distributed cache | Requires separate tenancy/deployment/writer design | Wider backend and infrastructure scope | Reject for this request |
| Existing shared cache with exact singleton policy | Preserves authoritative HTTP, current realtime and root client | Small additive source policy; unrelated sources retain five-minute TTL and list envelopes | Select |

## Frozen target and compatibility

GET Dashboard/Snapshot?ownership=<encoded>&fleetType=<encoded>, Result<DashboardSnapshot>, remains unchanged. Only successful non-null object entities are cached. No failed response becomes a successful cache entry. Finite bootstrap binds one separate shared watch after success; filter replacement/session destruction tears down the old watch. Context-reset null clears displayed values. Revalidation retains same-filter values; errors use the existing inline error/Retry and shared header refresh activity. Initial Dashboard loading stays locally silent with decorative number placeholders; no page loader is introduced. No draft/selected-label semantics apply to this aggregate snapshot; local enum filter controls remain unchanged.

No schema, migration, API, data backfill, permission, mapping, calculation or deployment changes. Rollback is the scoped frontend diff; persistent data is unaffected. Existing settings/reference cache public APIs and TTL remain compatible.

## Implementation and verification

1. Phase 0/1: root traces actual /dashboard route and freezes this plan plus existing API contract.
2. Phase 5: root extends shared policy and adapter/component. Independent read-only backend/performance audit may run after freeze; no overlapping edits.
3. Phase 6: root reconciles complete scoped diff, guide, canonical digest and regenerated packets; record source evidence in DASHBOARD_CACHE_FEATURE_REVIEW.md.

Source checks cover success/false/HTTP-error, cancellation, clone/key/expiry/topic wiring, manual force read, filter reuse, scope reset and cleanup. Owner checks cover compilation, network coalescing, same-filter return within/after 60 seconds, simultaneous filters, manual/periodic/reconnect invalidation, HTTP failure/Retry, hidden return, logout/login and branch/language isolation. Compare cold/warm request counts and timings against the same tenant/data/network/filter conditions; runtime/browser/SQL/build/tests remain pending and are not authorized. Open decisions: none for this slice. Backend query/index evidence is reconciled in the implementation report; no schema change is authorized.
