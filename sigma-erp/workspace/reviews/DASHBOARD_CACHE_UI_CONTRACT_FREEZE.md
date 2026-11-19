| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-26 |

# Dashboard cache UI handoff

Owner authority: apply cache to Dashboard. Plan: DASHBOARD_CACHE_MAINTENANCE_EVOLUTION_PLAN.md. Existing domain/API authority: DASHBOARD_REALTIME_API_CONTRACT_FREEZE.md; no backend API or calculation amendment.

| Contract | Frozen decision / producer → consumer |
|---|---|
| Active route and shape | pages/routing.ts `/dashboard` → pages/dashboard/DashboardComponent; existing KPI-dashboard exception, BE17 aggregate report, no CRUD/ListVM/editor/export |
| Transport | Root DashboardSnapshotService → interceptor-enabled HttpClient → GET Dashboard/Snapshot?ownership=<encoded>&fleetType=<encoded>, Result<DashboardSnapshot>; unchanged filter values/defaults and envelope |
| Source eligibility | Explicit owner-approved display-only singleton; never a write-time operational/financial authority |
| Cache identity | Shared scoped memory + full encoded two-filter URL + skipErrorInterceptor:true; no credentials in URL/storage/logs |
| Freshness | Shared absolute 60-second TTL for this source only; other sources retain existing five-minute TTL |
| Coherence | Existing tenant dashboard topic invalidates all cached filter variants; existing shared 150ms coalescing, authoritative HTTP and revision fencing; idle/hidden views do not auto-read |
| Bootstrap/watch | Finite success before separate watch; same switchMap lifetime ends watch on replacement/destroy; no reference-option binding or fake list envelope |
| Context | Shared data-free contextChanges event clears/cancels immediately and schedules cancellable reacquisition; covers same-token branch/language changes during a finite read before watch exists; watch null reset never restores old-context values |
| Errors | Finite false response and HTTP errors preserve inline localized feedback; refresh failure retains current-filter snapshot and existing Retry; no failed envelope cached as success |
| Actions | Refresh/Retry force HTTP; filter change/Reset/route return may reuse a fresh matching cache; no form writes from watch emissions |
| Periodic reconciliation | Shared mounted visible-watch expiry revalidates successful snapshots; one visible failure-only 60-second retry handles failed bootstrap or refresh without duplicating successful refresh loops |
| Loading | Dashboard showPageLoading:false/requiresBranchContext:false remain; local finite-reading + cache-loading combine into busy/disabled/aria-busy; initial placeholders and shared retained-refresh header badge remain sole presentation owners |
| Guide | Existing bilingual dashboard guide, existing UserGuide reader and route; explain reuse, minute TTL, force refresh, hidden/closed behavior and context separation |

Scope-reset recovery is a source-supported implementation refinement discovered during audit, not a business-policy change. No schema/migration/mapping/permission/calculation change or material unresolved decision. Runtime/network/SQL/build/test acceptance is pending for the owner.
