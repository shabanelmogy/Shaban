# Reactive reference cache — shared API and notification contract

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-24 |

Implements approved reactive cache scenario; excludes any custom developer
panel/new state library per latest clarification. Existing tenant/source HTTP
envelopes and finite BaseService.getSelectList remain compatible.

## Source topics and server slice

Add source registrations only to existing AddSigmaRealtime. Exact topics:
Country→lookup-countries; UnitsOfMeasures→lookup-units-of-measures;
Supplier→lookup-suppliers; Branch→lookup-branches; Item→lookup-items;
AssetType→lookup-asset-types; Currency→lookup-currencies;
ContactGroup→lookup-contact-groups; Job→lookup-jobs; Vehicle→lookup-vehicles.
Existing RealtimeTopics/Hub/commit tracker/interceptors/publisher own audience
and delivery. ResourceChanged envelope unchanged (topic/occurredAtUtc). Auth
claim owns tenant, never a client subscription id. No row data pushed. Emit
only after successful tracked save/explicit transaction commit; rollback/failure
does not emit. Ambient/raw SQL bypass and multi-node backplane remain documented
limitations with TTL fallback; no migration/outbox/deployment changes.

## Client cache API (root ownership)

New shared model file reference-lookup-state.ts exports
ReferenceLookupState<T> { value:T|null; loading:boolean; stale:boolean;
error:string|null; updatedAt:number|null; expiresAt:number|null }.
Preserve read<T>(url,load,options):Observable<T> finite HTTP-like result/error;
add watch<T>(url,load,options):Observable<ReferenceLookupState<T>> persistent
while subscribed. Options retain skipErrorInterceptor/forceRefresh. Cache key
retains full URL/context/feedback, clones consumer values, TTL5min/LRU64.

BaseService adds public watchSelectList<T>(options?):Observable<ReferenceLookupState<T>>;
public refreshSelectList():void invalidates its plain source URL. Protected
watchReferenceSelect<T>(url,load,options) delegates only when cacheSelect=true,
otherwise EMPTY (initial getSelectList still loads operational choices).
ContactGroup adds watchSelectByType<T>(type,options?) with same encoded URL
and loader as finite getSelectByType; public refreshSelectByType(type):void.

Invalidate marks stale, fences/cancels obsolete HTTP, and restarts already
waiting finite readers transparently instead of completing forkJoin empty.
Active watches revalidate after a150ms coalescing window only while visible;
idle/hidden entries send no automatic HTTP. A finite explicit read can load
immediately. TTL triggers active refresh and idle stale marking. One request
per key, old responses cannot publish after revision/session invalidation.
Retain previous successful data through refresh/failure; watch emits error key
lookupCache.refreshFailed, stale=true and keeps retryable data. Finite callers
retain declared false envelopes or actual error channel. No cached failures as
fresh success and no retry timer loop after failure. One subscriber leaving
must not cancel another; final consumer teardown cancels unfinished requests.
Context reset/logout cancels, clears arrays and topics; watcher must reacquire
new scope safely or complete without publishing old context.

Map only the exact known source URLs to topics, share existing RealtimeService
watch subscriptions per topic across live cache entries, release when evicted/
reset. Initial join/rejoin/changed marks affected source stale; allow one
revalidation to recover join races. HTTP works if socket unavailable. Hidden
tab changes defer watches until visible. Plain visible-window focus does not
invalidate. Do not add KEEP_READ_ON_NAVIGATION exemptions.

## Consumer binding slice

Keep initial finite forkJoin/getSelectList bootstraps and financial source
loaders. After successful bootstrap bind each cached source once until component
destroy. Shared helper ReferenceLookupBindings in shared/service/
reference-lookup-bindings.ts owns idempotent registrations and aggregate signals
loading/error. API: constructor(destroyRef:DestroyRef);
bind(key:string, stream:Observable<ReferenceLookupState<Results<DropDownSelect>>>,
apply:(rows:DropDownSelect[])=>void, retry:()=>void):void;
retry():void. Use incoming successful value to update arrays only; ignore loading
states for array replacement, retain prior arrays on failure. Track each failed
source independently; no endless resubscriptions or duplicate binds on Retry.
Consumer owns current selected IDs and historical option merges; preserve
selected labels from existing arrays/details for selected IDs missing in a new
response, without clearing value/dirty state, setting defaults or triggering
supplier/tax/source cascades. Warn when active selections are no longer in fresh
options where practical via existing owner, backend validation authoritative.
Use shared small ReferenceLookupStatusComponent for aggregate loading/error/
Retry (StateMessage and existing secondary action). Attach to reviewed
purchasing/supplier consumers; excluded services' watch stream EMPTY is inert.
No source-owned amounts/tax/account/status recalculation from cache emissions.

## Work ownership and gates

Root owns cache engine/state model, BaseService/ContactGroup APIs, translations,
docs/guides/tests source, integration. Backend worker owns topic registration
only and bounded read-only publication audit. Consumer worker owns shared
ReferenceLookupBindings/Status and purchasing/supplier component TS/HTML files
only. Do not edit each other's files. Preserve dirty peer/user changes. No
build/test/lint/browser/runtime/database/migration/snapshot/commit actions.
No inspector/package/config changes beyond exact runtime component compile
entry if required. Error keys: lookupCache.refreshing, refreshFailed, retry.
Existing guide reader gets EN/AR behavior updates before final handoff.

## Reconciliation amendment — selected-label and context safety (2026-10-24)

Implementation source review found that merging persisted detail labels on every
watch emission could restore old-context labels, while treating an empty list as
a reset lost labels in unsaved drafts. Preserve the original frozen handoff above;
the shared bind signature adds two optional, source-only getters after retry:
`selectedIds?:()=>ReadonlyArray<number|string|null|undefined>` and
`currentRows?:()=>readonly DropDownSelect[]`. The helper merges only currently
selected IDs from the consumer's actual current options into fresh successes,
including empty successes. A null, nonloading, nonerror state after a successful
snapshot is an explicit context reset: clear retained rows and apply([]), without
changing form values. Later success cannot recover prior-context labels from the
cleared rows. Persisted-detail option merges remain in initial detail/bootstrap
flows, never watch callbacks. Freshness stamps are monotonic per entry to avoid
same-millisecond refreshes being incorrectly suppressed. These conservative
implementation choices realize the owner's frozen preservation/isolation rules;
no business input, endpoint or financial decision changes.

Active watches/readers are pinned during LRU trimming. The64-entry bound evicts
idle candidates; mounted consumers are never terminated merely to enforce it.
