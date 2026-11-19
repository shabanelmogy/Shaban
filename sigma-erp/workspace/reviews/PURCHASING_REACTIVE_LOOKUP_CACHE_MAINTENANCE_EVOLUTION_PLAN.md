# Reactive purchasing reference cache

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-24 |

Owner authorizes implementing the recommended combined TTL + SignalR refresh
policy. Later clarification excludes custom cache inspector and new NgRx/
TanStack dependencies: keep existing shared owners and no developer panel.
The earlier LOOKUP_CACHING_REALTIME_MAINTENANCE_EVOLUTION_PLAN remains a
historical two-source Draft; this approval covers currently reviewed reference
sources and open purchasing/supplier choices. No build/test/runtime/DB execution.

| Area | Existing owner | Classification / confirmed target |
|---|---|---|
| Reference cache | ReferenceLookupCacheService | Extend finite read compatibility with a separate active-watch state stream, TTL timers and race-safe invalidation |
| Source transport | BaseService + ContactGroup typed selector | Extend watchSelectList/watchSelectByType; finite getSelectList unchanged |
| Open choices | Existing PR/PO/GRN/Bill/Return and Supplier list/editor/report bootstrap arrays | Extend active bindings after bootstrap; patch option arrays only, preserve selected IDs/drafts/saved labels |
| Socket | Existing root RealtimeService | Keep one ref-counted authenticated connection and connected/changed envelope |
| Server publication | Existing entity-topic registration, commit tracker, publisher | Extend ten source topics; retain claim-derived tenant audience and post-commit timing |
| UI refresh status | Existing shared StateMessage/FieldError/action owners | Small shared binding/status owner for loading/error/retry; no screen palettes or new cache viewer |
| Libraries | Existing RxJS/Angular/SignalR | Keep; no NgRx/TanStack installation or inspector |
| Operational data | Document candidates/remaining quantities/searches/rates/account operational choices | Keep direct reads outside reviewed reference URLs |

Choose invalidate-and-reload through HTTP rather than pushing option arrays.
Expiry is the fallback for disconnected/missed/bypass notifications. Only active
visible consumers trigger automatic HTTP; idle snapshots become stale for next
demand. Explicit retry may load directly. Server delivery remains bounded/non-
durable; no outbox/backplane/database change. Root keeps frozen contracts,
integration, source diff and guide; disjoint backend and consumer slices may
run after freeze. Current shared PrimeNG controls/typed envelopes retained.

Conformance: UI2/16/22/28 existing cache/Base/UOM typed writes and real-time
owner; UI13 shared EditorDialog/StateMessage for presentation if needed; BE10
select identity and current server RealtimeCommitTracker/RealtimeTopics for
post-commit publication. No new financial/action permission contract. Initial
recipe Check all8 passed. Final source-only reconciliation and guide required.
