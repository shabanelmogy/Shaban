| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-26 |

# Dashboard cache implementation and reconciliation

## Manifest and authority

Request: apply cache to Dashboard. Scope is the routed operations overview, its typed transport, existing shared cache source policy, bilingual guide and owning documentation. Tier L for the additive shared singleton policy. Frozen plan and UI handoff: DASHBOARD_CACHE_MAINTENANCE_EVOLUTION_PLAN.md and DASHBOARD_CACHE_UI_CONTRACT_FREEZE.md. Existing backend domain/API contract remains DASHBOARD_REALTIME_API_CONTRACT_FREEZE.md. No screenshots supplied; no new business assumption, permission, field, calculation, mapping, editor, action-state or paging contract.

Shapes: existing Dashboard KPI/workspace exception (catalog has no dashboard CRUD type); backend BE17 aggregate report. References actually inspected: DashboardComponent/transport/template/SCSS; CommonSettingsService.getMySetting singleton seam; ReferenceLookupCacheService read/watch/scope/invalidation/LRU; RealtimeService; root app.config.ts; shell-header shared cache activity. No reference module was modified beyond the directly related shared cache owner explicitly required by this request.

PLAN-00 then Phase 0/1 discovery/freeze, Phase 5 cache/topic/provider integration and Phase 6 reconciliation applied. Phases 2/3/4 skipped: no paged grid, editor/save or domain action. Reviewed owning Master1/4/5/7/8, UI2/22/28/29 and relevant BE2/7/17 rules. Initial recipe check passed all eight packets. After canonical updates, all eight were regenerated through Generate-SigmaRecipes.ps1, never edited directly; final check passed. Semantic review: Phase5 keeps one source cache/socket, finite bootstrap and watch teardown; Phase6 keeps exact source identity, context/failure and guide evidence; approved reference roles were unchanged. Fingerprints are synchronization evidence only.

## Source cache inventory and conformance

| Exact source/envelope | Classification and source owner | Writers/topic/invalidation | Finite/watch/lifetime | Failure/context/form evidence | Outcome |
|---|---|---|---|---|---|
| `${environment.baseUrl}Dashboard/Snapshot?ownership=${encodeURIComponent(ownership)}&fleetType=${encodeURIComponent(fleetType)}`; Result<DashboardSnapshot> | Explicit owner-approved display-only singleton; DashboardSnapshotService.getSnapshot/watchSnapshot → ReferenceLookupCacheService.read/watch | No Dashboard writer/import. Existing committed entity writers feed tenant `dashboard`; cache.topicFor maps this exact endpoint family and full URL distinguishes filter variants. All variants invalidate on changed/rejoin. Force read invalidates the exact URL | DashboardComponent requests switchMap performs finite successful read then separate watch. Outer switchMap/takeUntilDestroyed cancels old filter/destroy; shared release unpins/cancels final unfinished consumer | Both false and HTTP failure handled; watch failure retains same-filter values/Retry. Shared contextChanges clears/cancels and defers reacquisition even before watch exists; token fence retained. Watch null clears. No filter-form writes or draft/selected-label semantics for aggregate snapshots | Matched in source; network/expiry/isolation pending |
| Ownership/fleet choices | Local typed constants/enums in dashboard.data.ts | No HTTP/writer/cache/topic needed | Existing reactive controls/default/reset | Cached result emissions never patch controls | Matched; unchanged |

Shared policy additions: Dashboard successful object entity, 60-second TTL, existing dashboard topic, data-free contextChanges observable over the existing scopeChanges owner. Other sources retain list validation/settings singleton validation, five-minute TTL, feedback identity, clone semantics and cache API compatibility. No local replay/storage cache, new socket, dependency or mutation observer. Scope includes tenant/user/branch/language and in-memory credential revision. Cache data/credentials are never persisted.

## Loading and reference conformance

| Concern / owner | Actual final evidence | Result |
|---|---|---|
| Active route / UI1/22 | pages/routing.ts imports real pages/dashboard component and explicitly sets showPageLoading:false, requiresBranchContext:false | Existing silent Dashboard exception retained |
| Initial/filter/forced reads | reading set inside subscribed defer, finite finalize clears on success/false/HTTP/cancel; requesting computed with cacheRefreshing | Busy stays truthful without a global loader |
| Shared watch refresh | state.loading → cacheRefreshing; watch finalize clears; backgroundRefreshing → existing ShellHeader badge | No duplicate local spinner or parallel badge |
| Errors/Retry | Finite tap/catchError; watch state.error; existing StateMessage and Retry button; Refresh/Retry forceRefresh:true | Retained same-filter values; no success-cache of failed responses |
| Cancellation/context | switchMap and takeUntilDestroyed; sameSession token check; shared revision/generation fencing; contextChanges immediate clear + timer(0) cancellable reacquisition | Fixes same-token reset during pending finite bootstrap; no prior-context remerge |
| Full width / UI1/Master5 | Host inherits global `.sigma-route-host` display:block/height:100%/min-width:0. `.sigma-list-page` and `.sigma-list-panel` remain stretching column flex tracks; no feature :host geometry override. Feature `.dashboard-scroll` owns internal overflow; card grid breakpoints 1199.98/767.98 remain | No layout changes; empty/loading/error/populated share same outer shell. Sidebar, breakpoint/intermediate widths, RTL/theme visual measurements pending |
| Root HTTP / UI2/26 | providedIn:root adapter; app.config.ts single provideHttpClient with token/error/navigation interceptors; unchanged X-Skip-Error-Interceptor header | Existing auth/tenant boundary; no permission invention |

Normal reconciliation uses shared watch expiry after each successful snapshot, rather than competing cache TTL and feature-success timers. The existing 60-second component timer now retries only visible failed reads; closed views tear down, hidden views do not auto-read. Manual Refresh always bypasses a fresh cache. Same-filter route/filter return can reuse a fresh snapshot; changed filter clears old values before applying the matching cached/new result.

## Query, speed and index evidence

DashboardController authenticated GET Snapshot → DashboardService.GetSnapshotAsync → QueryReport sources. QueryReport preserves AsNoTracking, tenant equality/fail-closed and nullable live predicate IsDeleted != true. Backend unchanged. The source has 12 sequential ReadSnapshotSectionAsync terminal boundaries: vehicles, bookings, rentals, leases, open agreement branches, workshop categories, NRM categories, requests, trips, jobs, estimations, approvals. Seven scalar aggregate sections return at most one row; other sections return grouped dimensions/branches/categories and bounded approval entries. No per-row HTTP/EF round trips or individual operational-record materialization. Complete summaries intentionally have no paging. Correlated latest-state logic is reused across query boundaries; this is not a claim about actual SQL plans or command latency.

Source-level change: before, every route/filter/reconciliation trigger requested HTTP; now a fresh identical scoped-filter read can be served in memory and pending reads share work. Real source changes, reconnect, expiry and manual Refresh still read authoritative HTTP. No elapsed-speed claim is made.

| Expensive shape / mapping | Existing source coverage | Disposition / costs / acceptance |
|---|---|---|
| Latest VehicleStatuses per tenant/vehicle ordered CreatedAt DESC, Id DESC | `(SubscriptionId, VehicleId, CreatedAt DESC, Id DESC)` INCLUDE `(Status, IsDeleted)` | No duplicate index proposed; source-declared coverage. History writes/storage incur index cost; actual plan/IO pending |
| Latest WorkshopMovement per tenant/vehicle ordered DateOf DESC, Id DESC | `(SubscriptionId, VehicleId, DateOf DESC, Id DESC)` INCLUDE `(Type, IsDeleted)`; separate tenant/date index serves another shape | Keep existing coverage; VehicleId-only FK index does not replace latest-history ordering. Plan/cardinality/maintenance evidence pending |
| Latest NRM per tenant/vehicle ordered DateAndTime DESC, Id DESC | `(SubscriptionId, VehicleId, DateAndTime DESC, Id DESC)` INCLUDE `(Type, IsDeleted)` | Keep existing coverage; no active-only filter that excludes null soft-delete rows |

Configs, current snapshot and existing migration `20261026042041_AddProvisionScheduleAndContacts` already declare these indexes. They were inspected read-only; none edited. Their deployment/application is unknown. Earlier loading review's proposal/migration recommendation is historical; this cache task requires **no new migration**. No new index is justified by this frontend reuse change without production plan evidence.

Existing realtime registration covers all 22 consumed persisted source entity types, including Branch labels and approval sources. Commit tracking publishes after matching-tenant successful implicit save or explicit commit; failure/cancellation/rollback is discarded. Raw SQL/bulk/external/background/no-claim and ambient-transaction bypass, bounded/coalesced nondurable queue delivery and missing backplane remain best-effort limits covered by TTL/visible-return/manual reads. No new backend guarantee is claimed.

Owner measurement: compare the same tenant and record distribution, own/rental and all/all filters, environment/build, device/network, cold versus warm state, and at least five comparable repetitions. Record first usable/settled data, HTTP count/payload/network duration, backend/SQL command/IO/plan time where available, and rendering separately. Include route return/filter return within and after 60 seconds, a changed entity, reconnect, slow/error/cancel and empty summaries. Target is source-equivalent output with reused fresh reads and no duplicate normal TTL/periodic request; timing results and SQL plan acceptance remain pending.

## Guide and documentation

Updated `src/app/modules/UserGuide/content/dashboard-guide.ts` in both languages. Existing GuideReaderComponent registers DASHBOARD_GUIDE, section id dashboard, topic route /dashboard; existing USER_GUIDE_ROUTES :sectionId exposes /UserGuide/dashboard. Existing sidebar Dashboard entry still opens /dashboard and existing module guide links open the shared guide reader; no duplicate guide/viewer/menu was introduced. Coverage: filter-specific reuse up to a minute, forced Refresh/Retry, live/periodic reconciliation, hidden/closed handling and context clearing. Reader navigation/RTL/theme/print acceptance pending.

Owning UI2 singleton exception/context-reset seam and UI22 Dashboard loading wording updated; execution skill rule plus dated revision updated in the same task. No new generic cache eligibility or broader operational-policy rule.

## Final reconciliation and checks

| Contract/path | Final comparison | Status |
|---|---|---|
| API/filter/response/calculation | Existing endpoint and complete DTO/count semantics unchanged; encoded same two filter values | Source matched |
| Fresh cache/force read | Canonical full URL used by read/watch; force true on Refresh/Retry; exact source TTL only | Source matched |
| Invalidations/lifetime | Existing dashboard topic, shared scope reset, once-mounted watch, teardown/hidden/visible policy | Source matched; runtime pending |
| Failure/recovery | Both initial channels and retained watch failure; visible failure-only retry; context-reset cancellation/rebootstrap | Source matched; runtime pending |
| Guide/docs | Bilingual current behavior, UI2/22 + digest + generator | Source matched |

Reviewed complete scoped frontend diff; no stale imports, new translation keys, API mismatch, merge markers or whitespace errors. Four touched TypeScript files parsed with the installed TypeScript createSourceFile parser: zero syntax diagnostics; this is not compilation or a test run. Scoped git diff --check passed for frontend and documentation. Existing unrelated frontend/backend/instruction changes were preserved. Workspace root is not treated as Git owner; frontend and documentation repository diffs reviewed separately; backend audit was read-only.

Manual owner checks: compile and inspect console; verify warm reuse and explicit forced network read; change filters rapidly/Reset; confirm distinct scoped values; simulate false envelope and transport failure/Retry; change branch/language and logout/login during cold/forced read; confirm immediate old-context clear and new read; expire/rejoin/hide-return; navigate away during a slow request; verify local busy, initial placeholders and header badge. Build/tests/lint/browser/runtime/database/migrations/commit/push/deploy/Graphify/Sigma MCP were not run.

One inherited-model luna_explorer-style subagent performed disjoint read-only backend/query/index evidence and a focused source audit after root froze contracts. This reduced repeated backend scanning while root owned implementation/docs; it found the pending-finite context reset defect, which root fixed through the existing shared owner. Its follow-up identified duplicate cancellation/restart during token replacement: deferred context reacquisition now uses requestSnapshot(false), allowing an already-started auth bootstrap to finish. Root reviewed the final scoped diff and owns integration and completion. No overlapping edits or subagent source changes.

Suggested frontend commit: `feat(dashboard): cache scoped snapshots with live revalidation`.
Suggested documentation commit: `docs(dashboard): document scoped snapshot cache lifecycle`.
No backend commit or Add-Migration command is required for this task.
