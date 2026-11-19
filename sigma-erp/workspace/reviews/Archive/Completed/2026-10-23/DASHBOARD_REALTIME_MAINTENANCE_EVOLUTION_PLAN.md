# Dashboard data and reusable real time

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-19 |
| Authorization | Owner: review Dashboard and create an appropriate SignalR service with reusable real time |

## Manifest and impact

Existing owner: `DashboardService`/`IDashboardService`; the `Agreements2` endpoint remains compatible. Dashboard currently renders static `dashboard.data.ts`; its filters have no effect. Existing October 1 review authorized UI-only work; this request supersedes that restriction for the dashboard data integration. No entity/schema/write-workflow changes.

UI shape: existing Dashboard canonical exception, shared list shell/title/filter panel, SummaryCards KPI strip, one dashboard scroll owner. Backend: pattern 5 derived operational report (BE17), not CRUD. Approved source reference: VehicleService.SearchAsync latest VehicleStatus (CreatedAt descending then Id descending); Job list query lifecycle; report QueryReport and authenticated controller contract. Summary tables retain existing semantic, unbounded-table exception to avoid nested scrolling.

Impact: extend existing dashboard service; create typed snapshot GET and filter; replace static counts and table rows; create shared SignalR transport, tenant topic hub, post-commit EF notifications; extend Program/JWT wiring only. Preserve unrelated Purchase Request, migration, navigation, topbar and translation changes present at entry. Historical review files remain intact.

| Current piece | Classification | Target |
|---|---|---|
| Dashboard service and agreement analysis | Extend/Keep | Add read snapshot without changing Agreements2 |
| Static card presentation metadata | Keep/Refactor | Content metadata retained, values supplied by snapshot |
| Hard-coded sample counts and branch rows | Replace | Tenant-scoped database aggregates |
| Filter form | Extend | Automatic reads on change; Reset preserves current own/rental defaults |
| Real time | Create | Shared authenticated topic transport and committed-change publisher |
| Existing user guide | Extend | Live status, Retry, scopes and unavailable values |

## Alternatives and decisions

Chosen: HTTP snapshot + SignalR invalidation. Pushing filter-specific snapshots duplicates query state across sockets and is rejected. Poll-only misses the requested SignalR integration. SignalR messages carry topic/time only and never accept a tenant from the browser. Topic groups derive positive tenant ID from the existing NameIdentifier claim. Reconnection rejoins topics and rereads; time-based reconciliation and manual Refresh cover missed notifications and day boundaries. Delivery is best effort; no outbox/schema/backplane is introduced. Multi-instance deployment needs a configured SignalR backplane and remains a deployment limitation.

Automatic notifications observe committed EF changes, including explicit multi-save transactions; failed/cancelled saves and rollbacks do not notify. Broadcasting failures never turn a committed domain save into failure. No database polling, commands, builds, tests, lint, browser, migrations, commits or pushes are authorized.

Reviewer decisions under Master2 standing rule: current FleetType is Rental/Replacement/Staff; do not rename these to screenshot Lease/Limousine. Counts with no persisted source (notably closed-today timestamps, some approval types and service replacement classification) remain null/unavailable, never fabricated zero. Filters apply through vehicle membership; unassigned records remain included only with all/all. Non-vehicle approval/request counts remain tenant-wide and are labelled accordingly. Today means UTC day for this read contract and is labelled/documented.

## Execution and verification

Phases 0/1: evidence and API freeze; 2: read dashboard; 5: wiring; 6: source reconciliation. Phases 3/4 do not apply: no editor/domain action. Source-only verification compares producer/consumer keys, enum and null semantics, scoped Git diffs per repository, translations, auth/tenant routing and async teardown. Owner verifies compilation, runtime, two-browser updates, reconnect, rollback, different tenants, RTL/theme/narrow layouts. No migration required.
