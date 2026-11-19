| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

# Dashboard progressive loading — 2026-10-25

Authority: owner asks to improve Dashboard loading with counters and explicitly
clarifies that the initial appearance has no numbers. Frozen implementation
decisions/impact/options are in DASHBOARD_LOADING_MAINTENANCE_EVOLUTION_PLAN.md;
the existing DASHBOARD_REALTIME_API_CONTRACT_FREEZE.md remains unchanged.
Operational-dashboard exception to CRUD catalog; no backend implementation.
No screenshots or unresolved material decisions.

## Delivered source

- Dashboard metadata now renders outside the snapshot gate. Snapshot GETs no
  longer start/end the global loading counter. One shared initial loading state
  and existing inline error/Retry remain; requesting still disables repeat
  refresh and marks the grid busy.
- SummaryCards gains additive valuesPending/animateValues flags (default false).
  Dashboard uses them for blank initial slots followed by animated numeric KPIs.
- Shared AnimatedCountComponent renders all Dashboard metrics, ring total and
  numeric table cells, with a 900ms cubic count from zero or the retained current
  presentation. Zero is immediate; null/non-finite stays unavailable after
  loading. Inputs remain authoritative throughout. Frames run outside Angular's
  Zone; signals notify the view, avoiding a Zone tick for each individual counter.
- Pending/reset/replacement/destruction cancel frame work via effect cleanup.
  Reduced motion, hidden-document/print reads and missing rAF show final values.
  Screen readers/print get final formatted numbers, with decorative frames hidden.
- Failed initial reads retain card metadata and Retry, without falsely showing
  empty-table feedback. Table emptiness requires loaded=true from a successful
  snapshot. Same-filter refresh retains successful values; filter/session reset
  still clears snapshots; switchMap/session-token protection remains intact.
- Updated existing bilingual Dashboard user-guide topic after source review.

## Mandatory cache source evidence

| Actual source / consumer | Classification / owner | Writers, notifications and invalidation | Final consumer evidence |
|---|---|---|---|
| GET `${environment.baseUrl}Dashboard/Snapshot?ownership=…&fleetType=…`; Result<DashboardSnapshot>; DashboardComponent → DashboardSnapshotService.getSnapshot → DashboardController.Snapshot → DashboardService.GetSnapshotAsync | Direct operational read. Fresh tenant-filtered vehicle/status and operational aggregates; no approved reference-cache opt-in or singleton source | No cache to invalidate. Existing RealtimeService.watch('dashboard'), 400ms audit, fresh read on join/rejoin, 60-second reconciliation. RealtimeServiceCollectionExtensions registers Vehicle, VehicleStatus, Branch, Booking, RentalAgreement, LeaseAgreement, WorkshopMovement, NRM, CustomerRequest, TripBooking, Job, JobEstimation, LeaseQuotation, RentalQuotation, RentalMasterAgreement, LeaseMasterAgreement, PurchaseRequest, PurchaseOrder, Receipt, CreditNote, DebitNote and JournalVoucher. RealtimeSaveChangesInterceptor/RealtimeCommitTracker publish tenant-scoped successful tracked saves and committed explicit transactions, discard failed/rolled-back changes; ambient transactions rely on periodic reconciliation. Imports use these tracked-save notifications where applicable; no cached import invalidation contract is introduced | Existing requests switchMap finite HTTP, takeUntilDestroyed; token fence before accepting response. Success replaces snapshot; Result failure and HTTP catchError set inline error; Retry retries connection+GET. Context clears snapshot/error; retained same-context refresh stays visible. No selected lookup/draft state. Existing root socket and realtime teardown preserved |
| Ownership/fleet type radio filters; DASHBOARD_FILTERS | Static local translation metadata, no GET or cache source | No writers or notifications | Typed form passes unchanged ownership/fleetType; reset keeps Own/Rental defaults |

Reference-cache bootstrap/watch bindings, selected-label merges, TTL and
reference import invalidation are not applicable to this operational snapshot.
This is source conformance, not network/session/realtime runtime acceptance.

## Final conformance and reconciliation

| Concern | Authority / reference / actual owners | Final source result |
|---|---|---|
| Presentation | UI24; SummaryCardsComponent.formattedValue/valueTitle; AnimatedCountComponent | Existing card geometry, accents, hints/formatters and default consumers retained; optional pending blanks title/suffix/hints; one shared counter adopted by KPI, badge, total and table consumers |
| Data | Existing API freeze; DashboardSnapshotService.getSnapshot/ DashboardService.GetSnapshotAsync | No DTO/filter/endpoint/calculation change. Animated intermediate values never replace snapshot; ring segments still derive from true values |
| State/lifetime | UI22/28; DashboardComponent.ngOnInit/requestSnapshot/sameSession; effect onCleanup | Local initial status, both failure channels, retained refresh, clear on filter/session change, HTTP/watch/frame teardown |
| Theme/RTL/accessibility | UI24/25/27/29; existing surrounding styles, shared count inline host | No palette/layout fork or focus target; tabular values inherit typography/color; accessible/print text remains final; motion preference honored at animation start |
| Source inclusion | Angular installed effect/CreateEffectOptions declarations; imports and tsconfig.app.json | Component effect auto-cleans on destruction; standalone direct imports in both consumers; one explicit app files entry added, preserving all pre-existing additions |
| Guide | Master7; UserGuide/content/dashboard-guide.ts; GuideReaderComponent DASHBOARD_GUIDE registration | Existing Dashboard topic gains English/Arabic loading/motion/refresh/null note. /UserGuide/dashboard and /dashboard preserved; existing guide navigation retained |
| Shared extraction | Master5 | Counter behavior repeated across multiple numeric regions extracted into AnimatedCountComponent; SummaryCards extended through public flags; no private markup copied |

## Files and verification

Frontend repository: `F:/My Work/Sigma/SiGmaAngularFrontEnd`.
Changed Dashboard component TS/HTML, DashboardCards component TS/HTML,
SummaryCards component TS/HTML, added shared/components/animated-count/
animated-count.component.ts, updated dashboard-guide.ts and added its runtime
source entry to tsconfig.app.json. The other pre-existing tsconfig and workspace
changes were preserved.

Documentation repository: `F:/My Work/Shaban Documents/Shaban`.
Updated UI22/UI24 and CHANGELOG; local screen skill updated with owning-rule
reference and revision row. Generator refreshed all eight packets; source hash
changes reach UI22-dependent phase00/02/03/04/05/06 and UI24-dependent
phase02/03/04 as declared in the manifest.
Reviewed generated roles/instructions against canonical source; no template or
manifest change, and no direct generated-file edits. Initial and final recipe
checks passed all eight. Documentation edits compared against a pre-edit copy
to distinguish this task from existing uncommitted documentation work.

Applied discovery0, preserved/froze consumed API1 and shared presentation plan,
integration5, reconciliation6. Grid-query/editor/domain-action phases2–4 are
inapplicable. Source checks: complete scoped frontend diff and new file read,
documentation additions reviewed, imports/types/guide routes and numeric table
columns checked, whitespace and merge-marker checks clear. No backend changes,
AutoMapper/domain formula/schema changes or migration. No agents: bounded
sequential shared-owner edits do not offer independent non-overlapping work.

No builds, tests, lint, browser/application verification, database commands,
migrations, commits, pushes or deployment were run. Build/runtime/visual
acceptance remains pending; performance/latency improvements are not measured.

Owner checks: open Dashboard with slow networking; confirm labels/cards appear
before blank values count on success, zero/null differ, reduced motion is
immediate, refresh/filter changes and failed-read Retry recover, navigation
during animation leaves no callbacks/errors, and both themes/directions/mobile
and print show correct final values. No migration command is needed.

Suggested frontend commit: `feat(dashboard): show cards before data and animate counts`.
Suggested documentation commit: `docs(sigma): record progressive dashboard count presentation`.

## Owner follow-up and final reconciliation — 2026-10-25

The owner reports remaining Loading, authorizes Dashboard backend performance,
and confirms moving blank number slots during waiting followed by count-up.
This amendment supersedes the initial shared loading-message delivery above;
it does not erase the historical decision. The plan's dated amendment freezes
the expanded slice before delegation/implementation.

### Final visible behavior and integration

Removed the Dashboard initial loading StateMessage. Added only Dashboard route
data requiresBranchContext=false/showPageLoading=false: Layout renders the
tenant-wide read independently of current-branch bootstrap and suppresses this
route's page overlay without resetting/changing LoadingService. Its actual
deepest-route data is read initially and on NavigationEnd. Default true policies
preserve other routes. The existing navigationPolicyGuard now awaits the
coalesced finite CurrentBranchService.load before activating branch-dependent
targets, including immediate Dashboard departure during startup. firstValueFrom
resumes in a Promise microtask after forkJoin emission/completion/finalize, so
the target's first read receives finalized defaults. Existing read failure/Retry,
write/saving checks, draft exit guards and session recovery remain; no chosen
branch or access rule is invented.

AnimatedCount's pending host adds a decorative CSS highlight for the *real*
pending duration (1.4s repeating cycle; no numbers/progress estimate), then
removes it and starts the existing 900ms count. Minimum3ch/1em slot, inherited
colors/typography, shared Sigma tokens; reduced-motion/forced-colors stop motion,
print hides the highlight, accessible values remain final. No Loading text,
spinner, overlay or numeric placeholder was added. Same-filter refresh keeps
values. Initial/filter/session clear blanks values; failure ends pending and
uses existing inline error/Retry. A connected notification arriving during an
active read no longer queues a redundant second read; changed events, later
reconnections and the 60-second reconciliation remain.

### Backend contract and performance evidence

Backend shape: BE17 operational snapshot, explicit authenticated read controller
and report service, no CRUD or AutoMapper. GET Dashboard/Snapshot query/envelope,
DTOs, every count key, null-versus-zero, ownership/fleetType predicates,
tenant-wide approvals, missing vehicle behavior, latest-state ordering and UTC
day semantics remain frozen. The mandatory cache source row above still applies:
this is a direct operational read with fresh server aggregates, not an opted-in
reference cache. No writer/import/topic contract was changed.

| Previous source path | Final source in DashboardService.GetSnapshotAsync | Source result / pending verification |
|---|---|---|
| Vehicle status aggregate + idle aggregate + fleet aggregate, three commands | One SQL branch/name/fleet/status GroupBy; derive totals and idle DTO sums from aggregate groups | Three to one; no individual records/ID lists; SQL branch/id ordering retained before stable regrouping |
| Operational estimates + tenant pending approvals, two commands | One grouped left join against unique filtered vehicle IDs; Count all tenant rows and matching operational rows | Two to one; all/all includes NULL/unmatched VehicleId; filtered view matches old Any rule |
| Ten approval CountAsync commands | Ten exact per-table QueryReport/Where/GroupBy scalar projections combined by Concat; explicit zero defaults, at most ten rows | Ten to one; unsupported null unchanged, JV/opening/void/pending rules intact; EF10 SQL translation requires owner run |
| Repeated jobs DATEDIFF(day,…) | Boundaries today-2/-5/-8/-10, half-open adjacent ranges | Equivalent UTC day partition including future jobs in first bucket; no per-row date function |
| Historical agreement/request/trip rows contributing zero | Prefilter to open or today for agreements/requests; contributing trip states, Finished only today | Same aggregate inputs with zero-contributing rows removed |

Source terminal asynchronous SQL reads reduce **24 to12**. This is a source
command count, not a claim of halved response time. Reads remain sequential on
one scoped DbContext, tenant/soft-delete no-tracking through QueryReport,
cancellation and original exceptions remain. Added DueApprovals at the end of
DashboardSnapshotSection, preserving existing enum values; ErrorLogsMiddleware's
IsDefined/ToString reader supports the new combined diagnostic section. Existing
unused diagnostic enum values remain for historical log compatibility.

### Supporting indexes and migration boundary

Added source declarations only:
- New sealed VehicleStatusConfig: SubscriptionId/VehicleId/CreatedAt DESC/Id DESC,
  includes Status/IsDeleted. Existing plural VehicleStatuses DbSet mapping stays.
- WorkshopMovementConfig: SubscriptionId/VehicleId/DateOf DESC/Id DESC,
  includes Type/IsDeleted; existing date index retained.
- NRMConfig: SubscriptionId/VehicleId/DateAndTime DESC/Id DESC,
  includes Type/IsDeleted.

No IsDeleted=0 filter: the live nullable predicate also admits NULL rows.
ApplyConfigurationsFromAssembly includes sealed config; actual EF10.0.13 local
package declarations support IsDescending and IncludeProperties; DataAccess
GlobalUsing and Helpers project reference resolve entity/index APIs. No new
namespace/project inclusion is needed. Source audit corrected a potential
singular table mapping before delivery. No existing index was removed and no
speculative extra fleet index was added. Index write/storage overhead and
production-like execution plans remain owner checks.

Owner must create/review/apply migration **AddDashboardSnapshotReadIndexes**.
The agent did not create/edit/run any migration or model snapshot; pre-existing
owner migration/snapshot files were preserved. Existing schema benefits from
query consolidation immediately after code deployment; new index benefit
requires the owner's migration workflow.

### Final files, authority and verification

Additional frontend files: Layout TS/HTML, pages/routing.ts,
shared/utils/navigation-policy.guard.ts, shared/animated-count component and
Dashboard TS/HTML; bilingual dashboard-guide.ts updated in its registered
/UserGuide/dashboard topic linking /dashboard. Existing guide reader/menu reuse
and nonanimated consumers' default flags remain. Backend files: DashboardService,
DashboardSnapshotSection, NRMConfig, WorkshopMovementConfig and new
VehicleStatusConfig. No API/controller/DTO/payload/mapping/business formula edits.

Updated UI1/22/24 and BE17, local execution skill/revision row and CHANGELOG in
the same task. Regenerated all eight packets via generator; final -Check passes
all eight. Semantically reconciled route policy to UI1, blank motion to UI22/24,
SQL aggregates/index boundary to BE2/17 and final source; generated phase role
ownership remains unchanged. Documentation additions compared with saved
pre-edit content to preserve unrelated in-progress documentation.

Applied phases0/1 for expanded source discovery and unchanged API freeze, read
query2 for backend aggregate optimization, integration5 and final6. No editor,
write, financial action or screenshot extraction; phases3/4 not applicable.
Scoped complete diffs reviewed separately in frontend/backend/documentation
repositories, plus new files read directly. Whitespace/merge-marker checks,
imports/source inclusion, SQL predicate/count equivalence, route/guard lifetime,
guide bilingual text and cache classification reviewed. No known unapproved
scoped source mismatch remains; runtime/build evidence is explicitly pending.

Agents used under the workspace independent-workstream gate after root freeze:
luna_explorer (gpt-5.6-luna) read-only Dashboard backend/branch activation audit;
sol_worker (gpt-5.6-sol) owned DashboardService plus appended diagnostic enum,
then read-only index/final backend audit. Root owned frontend/config/docs and
integration/final review. Two bounded independent streams reduced wall-clock
without overlapping edits. Root integrated the branch-finalize ordering and
existing table-name corrections; agents did not declare feature completion.

No build/test/lint/browser/application/database/migration/commit/push/deployment
commands were run. Owner acceptance: slow initial Snapshot and branch reads
still show Dashboard cards and moving blank slots; success starts counters;
failure shows Retry; filter reset/session change/nav during pending safely clear
or cancel; immediate navigation to dependent screen waits for branch defaults;
other pages keep loading policy. Verify theme/RTL/mobile/reduced motion/print,
SQL translation of grouped/Concat counts, old/new count parity on boundary/null
cases, and timings/logical reads plus index write cost after owner migration.

Suggested commits: frontend `feat(dashboard): show silent pending slots before counts`;
backend `perf(dashboard): consolidate snapshot aggregates and index latest history`;
documentation `docs(sigma): record silent dashboard and snapshot performance contracts`.

## Motion refinement — owner request2026-10-25

Tier S: owner asks for better animation. Existing shared AnimatedCount remains
the visual/lifetime owner (UI24/28); no feature markup/palette fork or request
change. Before edits, compare existing 1.4s background-position strip against
the new three-stroke breathing placeholder with a transform-driven light sweep,
then a short fade/rise into the authoritative count. Reserve final formatted
width to avoid digit-width jumps; lengthen the count to1100ms with quartic
ease-out, keeping exact final numbers and null/zero behavior. Reduced motion,
forced colors, print and accessible final text retain their existing contracts.
Root owns this one sequential component refinement; no parallel agents apply.
Cache source matrix and backend/query/index migration decisions above remain
unchanged. Source/guide/docs reconciliation follows; runtime acceptance pending.

Implemented the refinement in the existing shared AnimatedCount TS inline
template/styles only, plus the existing bilingual dashboard-guide.ts note.
Pending renders three aria-hidden strokes with staggered opacity/scaleY and a
transform sweep; resolved numbers mount with360ms fade/rise. A hidden final-text
grid sizer reserves their final formatted width during initial count; intermediate
visual text remains aria-hidden. Counts use1100ms quartic ease-out and retain
frame cleanup, unchanged-value behavior, immediate zero and unavailable dash.
Reduced motion disables CSS/replaces counts immediately; forced colors uses
static system-color strokes; print shows only final text. No visible loading
message, fake values, artificial request delay or per-card style override.

Source comparison against saved pre-edit component and UI24/skill/CHANGELOG
content reviewed. Guide matches the final appearance; same registered Dashboard
topic/reader/route is reused. Updated canonical UI24 and skill with revision row,
regenerated through the generator; all eight packet checks pass. UI24-dependent
phase02/03/04 provenance refreshed and semantically compared; no packet edit.
Scoped whitespace/merge-marker checks clear. Phases0/5/6 apply proportionally;
API/backend/read/write/action phases unchanged. No backend/migration change in
this refinement; existing owner index migration requirement above still applies.
No agents used for this single shared-owner change. No build/test/lint/browser,
database/migration/commit/push/deployment commands run. Owner checks remain the
pending→number transition, long requests, null/zero, filters/navigation during
animation, both directions/themes, small badges/KPIs, reduced motion and print.
Suggested frontend commit: `style(dashboard): refine pending and count animations`.

## Stable card sizing and branch waiting motion — frozen slice2026-10-25

Owner requests cards at their final width/height from first render, and the same
waiting animation in the working-branch dropdown. Shapes: existing operational
Dashboard exception and shared shell branch select; backend contracts unchanged.
UI24 shared sizing/motion, UI1/22 branch lifetime, Master5 loading/cache/performance
gates apply. Before edits: grid spans already determine widths; absent table
bodies, pending-versus-resolved line heights, hidden KPI hints and variable
number widths change height. Branch select currently has no pending motion.

Frozen target: fixed360px Dashboard table-card block at all data states, with
real headers present immediately and a bounded scrollable table area; pending
decorative rows never imply branch identities or counts. Other metric-card
heights derive from static labels and fixed number slots. SummaryCards gets an
optional reservedHintKey public input for Dashboard: reserve value/hint line space
through pending, hide hint content without removing its space, preserve the
real hints. Count slots keep the same1.2em line box in both states. Numeric metric
columns reserve their width with accessible full values; grid spans remain
responsive, and print releases table bounds. This intentionally replaces
variable table height because the server row count is unknown before response.

Extract the existing three-stroke animation into shared PendingMotionComponent,
adopt inside AnimatedCount and shell branch select loading-icon slot; no copied
CSS/second feedback owner. Use installed PrimeNG public loading/loadingicon
contracts and keep current selected branch labels while pending. Both Options
and Mine are local auxiliary reads owned by CurrentBranchService.load/forkJoin;
no global loading counter or cache eligibility change. Save/error/Retry/disabled
and session fences unchanged. Root owns shared motion/cards/docs; bounded worker
may own only shell-header TS/HTML and administration guide after shared API exists.
No new queries/indexes or backend edits. Existing source-only performance/index
evidence remains; measure cold/warm layout and branch network timing with same
tenant/filter/viewport/data, five samples each, before/after; no speed claim.

### Final source conformance

Implemented the existing Dashboard grid widths unchanged, fixed360px table
frames, immediate real headers and four aria-hidden decorative rows. Each
bounded table area has tabindex/region/label/aria-busy, stable scrollbar gutter,
sticky headings and both-axis scroll; notes/headers do not shrink. Table layout
is fixed with25% for the row label, equally shared75% numeric columns and
180+96*(column count-1)px minimum table width, preventing the response content
from recalculating columns. Labels wrap, full numeric values remain accessible
and titled, print releases the frame/overflow/minimum/column widths. This keeps
all returned rows reachable at every result size instead of guessing how many
rows the server will return. Numerical metric columns use a7ch/44px minimum
fixed region. AnimatedCount now has a constant1.2em line and3ch minimum in both
states, constrained ellipsis/full title and final-text sizer; no numeric fake.

SummaryCards.reservedHintKey is additive/null by default; Dashboard opts into
its existing long unavailable explanation as the reserved hint for every KPI.
The shared ordinary hint layout remains present with visibility hidden and
aria-hidden for pending or no current hint. Thus hiding/showing unavailable
notes cannot change the KPI row height. Its original translated value appears
only for a genuinely unavailable measure. No private card CSS copied.

Extracted UI24's existing stroke/sweep to PendingMotionComponent, preserving
timings/colors/reduced-motion/forced-colors/print with1.2em host height. Counts,
decorative table cells and the branch dropdown import it. One explicit source
entry in tsconfig.app.json preserves the user's other additions. No new runtime
library, HTTP request, delayed completion or percentage/counter for the branch.

### Mandatory request/loading/cache evidence

| Actual route/request/consumer | Classification and visible owner | Lifetime / errors / context / final evidence |
|---|---|---|
| pages/routing.ts dashboard → DashboardComponent → DashboardSnapshotService GET Dashboard/Snapshot (Result<DashboardSnapshot>) | Direct operational read; approved silent page policy showPageLoading=false/requiresBranchContext=false | Existing finite switchMap/takeUntilDestroyed/finalize, token fence, null on filter/session reset; shared count/table placeholders while real pending, retained refresh keeps data, Result/HTTP error and Retry retained. No global start/end or additional spinner; the rendered fixed frame changes no query/cache contract |
| Layout → ShellHeaderComponent → CurrentBranchService.load GET `${environment.baseUrl}/CurrentBranch/Options` (Results<CurrentBranchOption>) and GET /CurrentBranch/Mine (Result<CurrentBranch>) | Direct auxiliary session-context reads, no reference-cache source opt-in. Single local visible owner: PrimeNG Select loadingicon → PendingMotion; loading/aria-busy uses actual branches.loading() | Existing finite forkJoin Options+Mine, shared pendingLoad, reading flag and finalize readiness; KEEP_READ_ON_NAVIGATION owns session lifetime. Session version fences both failures/context; selected branch retained on retry and no invented default. Header Retry invokes same load. No cache watch/invalidation adoption required for these documented direct context reads |
| CurrentBranchService.change PUT /CurrentBranch/Mine | Existing save/saving/inert/global error feedback unchanged; read animation does not claim a write result | Server-authoritative selection committed only on success; failed save retains previous branch. Successful writer returns confirmed branch; no reference-cache invalidation/topic invented |

Installed PrimeNG21.2.22 template/type evidence: loading/loadingicon are public;
loadingicon replaces the built-in spinner inside .p-select-dropdown. Root added
data-loading and the <=359.98px CSS exception: label hides while the32px trigger
shows the same animation, preserving width, title/aria-label and selected model.
At other widths selected labels stay visible. The existing shell branch error
row/Retry and saving/editor guards remain. No timer, second loading indicator,
shared LoadingService reset or route-policy generalization.

### Performance/index gate and verification

No new request or backend query. Snapshot remains12 terminal source read
boundaries from the previous authorized optimization; timing/SQL-plan evidence
still pending. Branch load uses two concurrent HTTP calls on distinct server
requests: Options projects Id/Name/BranchCode/BranchCode2 sorted Name/Id over
live tenant active branches, complete small option set; Mine projects one saved
branch with tenant/user predicate and joined live active branch. No per-row
request/Include/duplicate initialization was introduced. Existing Branch index
(SubscriptionId,Name) and UserBranchPreference (SubscriptionId,UserName) already
match these source predicates; no measured plan gap justifies another index
for this appearance change. No EF/schema/migration change in this slice;
previous Dashboard index migration remains an owner action, not re-executed.

Reproducible owner checks: same tenant/account, same own/rental filters and
known branch count, same language/theme and viewport widths around360/576/768/
1200px; five cold and five warm opens before/after. Record card bounding boxes
before response/after response, layout shifts, request/payload/SQL duration and
render time. Inject slow Options/Mine and Snapshot plus empty/error/retry and
many-row results; confirm card boxes unchanged, dropdown motion visible without
extra request/loader, selected labels retained, long values/labels reachable,
keyboard scrolling, RTL/themes/reduced motion/print. No measured result or
universal timing threshold is claimed. Four decorative rows bound pending DOM
independently of branch count; server result rendering remains complete.

Updated dashboard-guide.ts (stable layout/internal scroll/placeholder meaning/
print) and administration-guide.ts (branch read motion), preserving registered
/UserGuide/dashboard and /UserGuide/administration readers/topics/navigation.
UI1/UI24, skill revision and CHANGELOG updated together. Regenerated all eight
packets with refreshed UI1/UI24 dependencies and semantically reviewed shared
ownership/layout/branch exception; final -Check passes all eight.

Root reviewed full scoped frontend diff, new shared source, import/source
inclusion, whitespace/merge markers and documentation deltas. Bounded
luna_explorer (gpt-5.6-luna) implemented only shell-header TS/HTML and bilingual
administration guide while root handled shared/cards/docs; sol_worker
(gpt-5.6-sol) read-only audited stable geometry and publisher slot. Root fixed
the discovered auto table-layout width drift and tiny-width trigger visibility.
No overlapping writes; root owns final integration. Backend untouched in this
slice. Phases0/5/6 apply; no new API/domain/grid-query/editor/action contract.
No screenshot claim, material missing decision, or scoped source mismatch.
No build/test/lint/browser/database/migration/commit/push/deployment commands
run. Runtime/visual/build acceptance remains pending.

Suggested frontend commit: `fix(dashboard): reserve card frames and share branch loading motion`.
