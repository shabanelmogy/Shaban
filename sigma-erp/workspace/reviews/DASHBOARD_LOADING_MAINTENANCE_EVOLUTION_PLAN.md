| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

# Dashboard progressive loading — 2026-10-25

Owner authorizes Dashboard loading improvement and explicitly clarifies: render
initially without numbers, then count to the returned values. Limited shared
presentation extension uses PLAN-00 before implementation (Master1 tier L).
No business/API ambiguity. No screenshots. Existing operational-dashboard
exception remains; no CRUD/editor shape or backend implementation applies.

## Inventory, impact and classification

| Area / owner | Existing evidence | Classification / frozen target | Phase |
|---|---|---|---|
| DashboardComponent / template | snapshot gate hides all cards; foreground read starts global LoadingService | Refactor: render metadata immediately; local request state, blank initial values; retain existing cancellation, filters, session fences, errors and Retry | 0/5 |
| SummaryCardsComponent | UI24 owns KPI value layout/formatting; all other consumers need their existing immediate output | Extend with valuesPending and animateValues (both false by default); Dashboard explicitly enables them within requested scope | 5 |
| DashboardCardsComponent | metric badges, ring total and table counts duplicate number presentation | Adopt one new shared AnimatedCountComponent for these counts | 5 |
| Animated count | No existing counter owner found in shared component source | Create shared presentation-only component; no fetches, business calculations or cache | 5 |
| DashboardSnapshotService / DashboardService | existing Result<DashboardSnapshot>, direct Dashboard/Snapshot operational aggregation | Keep unchanged; counts remain authoritative, null remains unavailable | 1 unchanged |
| Dashboard guide | existing bilingual topic and reader registration | Extend loading/animation explanation | 6 |

## Options and decisions

| Option | Trade-off | Decision |
|---|---|---|
| Animate the stored snapshot | Mixes transitional values with authoritative ring/aggregation data | Reject |
| Feature-specific counters for KPIs, badges and table cells | Repeated lifecycle/accessibility code and private SummaryCards markup | Reject |
| Shared count presentation; shared SummaryCards public extension | One lifecycle owner; additive defaults preserve unrelated financial/report consumers | Frozen |

## Frozen contracts

- Render card labels/icons/links and ring track immediately. Pending numeric
  slots reserve a line but contain no numbers, zero or unavailable dash.
- Initial/filter-clear loading uses one shared StateMessage and local aria-busy;
  Dashboard does not start the shell loading overlay for snapshot reads.
- Once successful data arrives, finite numbers animate from zero over 900ms;
  changed retained values animate from the current display; unchanged values
  do not restart. Final displayed value is exactly the supplied value.
- Null/non-finite values show an em dash after loading, never count as zero.
  Empty-table feedback appears only after loading settles. Initial failure leaves
  labels available, shows existing error/Retry and unavailable values.
- Shared counter: value:number|null, pending:boolean, digitsInfo:string; defaults
  null/false/1.0-0. Screen readers and print receive the final formatted value;
  decorative intermediate values are hidden from accessibility and print.
  Reduced motion/hidden document/no animation API shows final values immediately.
  Cancel frames on replacement, context clear and destruction.
- SummaryCards public flags default false because this owner request explicitly
  scopes animation to Dashboard. Other consumers retain exact existing output.
- No API, schema, permission, precision, formula, AutoMapper or backend change.
  Existing filters, realtime topic and 60-second reconciliation remain.

## Conformance before edits

| Concern | Authority | Reference symbol / shared owner | Target |
|---|---|---|---|
| KPI layout and formatting | UI24; Master5 | SummaryCardsComponent.formattedValue/valueTitle | preserve geometry and default behavior; extend public API |
| Busy/error | UI22/28 | StateMessageComponent; DashboardComponent requests/sameSession | local initial status, both failure channels, retained-data refresh |
| Accessibility/themes | UI24/25/27/29 | existing summary value markup; shared tokens | no new palette; stable final accessible/printed value and reduced motion |
| Source cache | UI2; Master5 | DashboardSnapshotService.getSnapshot → DashboardService.GetSnapshotAsync | direct operational read; no reference-cache opt-in |
| Guide | Master7 | dashboard-guide.ts; /UserGuide/dashboard → /dashboard | bilingual loading explanation |

## Verification and delivery

Apply bounded phases 0/1 (existing API freeze), presentation/integration5 and
reconciliation6. Grid query/editor/domain-action phases2–4 do not apply.
Review complete scoped frontend/docs diffs, source inclusion/imports, null/zero,
frame cleanup, English/Arabic guide and packet regeneration after owning-rule
updates. Build/tests/lint/browser/database remain owner-only. No migration.
One small sequential shared-owner change; parallel agents would overlap the
same templates/contracts, so none are needed.

## Owner amendment — no visible loading and backend performance (2026-10-25)

The owner reports remaining Loading and explicitly requires the page to appear
without Loading, then additionally authorizes backend performance improvements.
This supersedes the earlier local initial StateMessage decision; keep the
historical decision above as evidence rather than silently rewriting it.

Frozen next slice:
- Remove Dashboard's initial visible loading StateMessage. Keep actual busy
  guards, blank pending values, error/Retry and accessible aria-busy.
- Dashboard is independent of the saved working branch: Snapshot accepts only
  ownership/fleetType and is tenant-scoped. Add explicit route metadata
  `requiresBranchContext: false` and `showPageLoading: false`, read by Layout
  on initial activation and navigation. Defaults preserve every other route's
  branch bootstrap and loader. Dashboard renders while branch reads complete;
  branch error/Retry stays in the existing topbar. Keep branch-save/write/inert
  and session recovery guards. Never reset a shared loading counter to hide it.
- Coalesce the connection bootstrap with an already active snapshot read;
  actual changed notifications and later reconnect refreshes remain active.
- Keep BE17's same Result<DashboardSnapshotDto>, nullable counts, all keys,
  UTC dates, filtered/tenant-wide populations and authentication/tenant fences.
  Aggregate the vehicle branch/fleet/status populations in SQL once and reuse
  grouped counts for headline, fleet and idle summary; no full fleet/ID loading.
- Combine pending-estimation operational and tenant counts in one grouped SQL
  read with a left join to unique filtered Vehicle IDs; count tenant rows once
  and matching operational rows separately. No EXISTS inside an aggregate.
- Replace job DATEDIFF buckets with equivalent UTC half-open boundaries,
  including future dates. Exclude closed historical agreements and inactive
  customer/trip populations that contribute zero to every requested metric
  before aggregate; keep existing source selection/status/null rules.
- Reads remain sequential on the scoped DbContext. Preserve cancellation and
  diagnostic section tagging; no cross-request cache, raw SQL batching or
  parallel operations on the same context. Evaluate supporting source indexes
  separately; no database command/migration/snapshot edits.

Work split after freeze: root owns Layout/Dashboard/routes/guides/docs and final
integration; bounded backend worker owns DashboardService.GetSnapshotAsync
only. Read-only explorer identified repeated latest-status scans, duplicate
estimation counts and repeated DATEDIFF. Source diff and equivalence review are
required; actual SQL plans/timing/build remain owner verification.

Additional frozen performance slice: replace the ten independent supported
approval-count round trips with one LINQ Concat/UNION ALL of grouped per-table
pending counts. Each table keeps its exact existing predicate and QueryReport
scope; empty groups map to zero. Reuse the already read estimate tenant count.
Add one server-owned diagnostic enum value DueApprovals at the end (existing
enum values unchanged) for this combined query. This uses no raw SQL or cache
and materializes at most one count row per supported category.

Frozen supporting-index slice: add nonunique latest-row indexes on
VehicleStatus (SubscriptionId, VehicleId, CreatedAt DESC, Id DESC),
WorkshopMovement (SubscriptionId, VehicleId, DateOf DESC, Id DESC), and NRM
(SubscriptionId, VehicleId, DateAndTime DESC, Id DESC), including the projected
Status/Type and IsDeleted. These match actual anti-join equality/order keys.
Keep existing indexes. No IsDeleted=0 filtered index: QueryReport's nullable
IsDeleted != true contract also includes NULL. New sealed VehicleStatusConfig
is discovered by existing assembly registration. Defer speculative Vehicle/
other indexes until actual plans justify them. Owner must create/review/apply
AddDashboardSnapshotReadIndexes; this task creates no migration/snapshot and
executes no database command. Index write/storage cost and measured query-plan
benefit remain owner verification.
