# Dashboard data and reusable SignalR — implementation and reconciliation

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-19 |
| Request | Review Dashboard and create an appropriate SignalR service with reusable real time |
| Plan | DASHBOARD_REALTIME_MAINTENANCE_EVOLUTION_PLAN.md — Frozen |
| API handoff | DASHBOARD_REALTIME_API_CONTRACT_FREEZE.md — Frozen, including recorded source reconciliation amendments |
| Repositories | F:/My Work/Sigma/SiGmaAngularFrontEnd and F:/My Work/Sigma/SigmaBackend |
| Final source baselines | Frontend HEAD 8e6d51ec; backend HEAD 5279b1b4 |

## Result

The Dashboard now requests a typed, authenticated tenant snapshot instead of
rendering sample numbers. Ownership/fleet filters query the actual source.
SignalR sends topic invalidations after tracked changes commit; the consumer
rereads with its current filters. One shared connection supports multiple
consumers/topics, retry/reconnect/rejoin and session/last-consumer teardown.
Current persisted states determine figures; unavailable facts remain null and
display an explained em dash. The old Agreements2 operation remains compatible.

No entity, EF configuration, migration, model snapshot, domain mutation,
accounting calculation or existing permission policy was changed. The initial
working trees contained unrelated Purchase Request, navigation, topbar, guide
and translation changes. They were preserved. Later source-only Git inspection
showed those unrelated changes incorporated in the current HEADs; this task
performed no commit, reset, checkout or restoration of them. The final scoped
diff was reviewed against those current repository HEADs separately.

## Scope, shapes and phases

Dashboard retains its existing documented UI exception: shared route/list shell,
FeatureTitle, FilterPanel, SummaryCards headline strip and one Dashboard scroll
owner. Detailed grouped metric panels and semantic unbounded summary tables
retain the existing Dashboard presentation; this request adds data/lifecycle
integration, not a new visual system. Backend follows BE17 Pattern 5 derived
operational report, with QueryReport and SQL aggregate projections, no CRUD.

| Phase | Applied result / exclusion |
|---|---|
| PLAN-00 | Existing owners/alternatives/impact classified; Frozen before source implementation |
| 0 | Source, screenshots and existing historical reviews reconciled |
| 1 | Filter/snapshot/null/derivation/topic/security boundaries frozen |
| 2 | Actual read data, filters and typed complete summary tables integrated |
| 3 | Not applicable: no editor, add, update, child-write or upload workflow |
| 4 | Not applicable: no state-changing Dashboard action; Refresh/Retry are reads |
| 5 | DI, JWT hub path, topic registry, EF callbacks, root client and route verified in source |
| 6 | Complete scoped diffs, producer/consumer fields, translations and shared extraction reconciled |

The recipe check passed initially. After UI2/BE17 and preamble/digest/changelog
updates, the generator refreshed PLAN-00 and PHASE-00 through PHASE-06; the
subsequent check passed all eight. Semantic review retained phase ownership,
read/report exceptions, one root HTTP client, source-only verification and
frozen-contract gates. Generated files were never edited directly.

## Functional evidence

All three images are English LTR desktop captures. Role, capture date, product
version and acceptance status are unknown. They supply content evidence only;
sample numbers were not imported as data, and screenshot appearance was not
copied over approved shared presentation.

### E1 — Desktop/1.PNG

| Evidence | Classification | Required behavior | Phase / implementation |
|---|---|---|---|
| Ownership/fleet choices | Explicit | Filter operational overview | 1/2: typed actual OwnershipType and FleetType string contracts |
| Vehicles, bookings, rental/lease, workshop, NRM, limousine groups | Explicit | Read source-backed figures in their groups | 1/2: complete snapshot count dictionary; new missing groups added |
| Vehicle distribution | Explicit content; calculation unknown | Same current-status population for ring and counters | Backend latest live VehicleStatus; disjoint chart groups |
| Check availability | Explicit historical link; target absent | No invented workflow | Prior approved Dashboard decision retained: no target screen, no link |

### E2 — Desktop/2.PNG

| Evidence | Classification | Required behavior | Phase / implementation |
|---|---|---|---|
| Idle vehicles per branch and six state columns | Explicit | Complete branch summary | 1/2: idleVehicles DTO and same ordered columns |
| Open agreements per branch, daily/weekly/monthly/lease/total | Explicit | Complete agreement summary | 1/2: openAgreements DTO using nonvoid open rental/lease rows |
| Sorting/paging/export | Uncertain, not demonstrated | No invented action | No paging/export/row actions introduced; these are small grouped summaries |

### E3 — Desktop/3.PNG

| Evidence | Classification | Required behavior | Phase / implementation |
|---|---|---|---|
| Fleet totals and hired classifications | Explicit | Preserve counts and classification labels | Actual fleet enum categories; hired table clearly labelled open agreements by kind |
| Customer requests, WIP day buckets, pending estimations | Explicit | Source-backed sections | Status/CreatedAt/Job DateAndTime/ApprovalStatus projections |
| Approval categories | Explicit | Each category remains visible | Proven pending-state queries; unsupported categories unavailable |
| Close timestamps/service replacement formula | Uncertain source | Never invent zero or new historical facts | Null values with translated unavailable explanation |

## Decisions and final data contract

| Concern | Final decision and evidence |
|---|---|
| Endpoint | GET Dashboard/Snapshot, Result<DashboardSnapshotDto>, query filter + CancellationToken, Authorize on the new action only |
| Existing API | Agreements2 and SearchAgreementAnalysisAsync body/auth behavior retained |
| Tenancy | Every read uses QueryReport; tenant is the existing NameIdentifier claim; no client tenant parameter |
| Aggregation | Database GroupBy/Count/Sum, sequential awaits on one context, complete filtered grouped rows; no domain-record materialization/N+1 |
| Time | One UTC day captured at request start; [today,tomorrow); age buckets disjoint, future open jobs in first bucket; completion timestamp displayed UTC |
| Current vehicle status | Latest live status by CreatedAt descending then Id; anti-join explicitly handles null-date ties, matching VehicleService ordering |
| Status chart | Hired/Rented combined; Workshop/Maintenance combined; Idle five states excludes separately displayed NotReady; remaining literal/unknown states separate |
| Idle table | Six states including NotReady; table total represents Idle + NotReady, not Idle alone |
| Workshop/NRM | Latest dated movement per current matching vehicle classifies it; unclassified/Breakdown not relabelled; headline workshop uses vehicle count |
| Agreement table | Open, nonvoid rental/lease agreement count by current vehicle branch; all/all includes unassigned records with nullable branch |
| Hired classification | Open agreement population, not distinct physical vehicles; only Lease PermanentVehicle gives permanent/temporary; unavailable classifications null |
| Approvals/requests | Tenant-wide, labelled independent of vehicle filters; pending state does not promise domain-action eligibility |
| Unsupported figures | Closed-today agreement/request counts; company/invoice/bill/payment/asset approval categories; unsupported hired classifications stay unavailable |
| Header KPIs | Authoritative vehicle/booking/workshop counts; complete rental+lease open sum; approval headline unavailable if any category lacks a source |
| Mapping | Direct aggregate DTO projection; no AutoMapper profile or ignores/ReverseMap needed |
| Calculation ownership | Backend owns source populations/buckets/totals; Angular only presents or combines complete returned counts for headlines |
| Overrides | Dashboard is a dedicated report service/interface; no generic service/controller overrides added |
| Entity/write decisions | Not applicable: no add/update/detail DTO, duplicate/FK/delete/numbering/approval transition or persistence change |
| Migration | Not required; no schema-impact changes in this task |
| Authorization | Existing authentication plus tenant isolation; no new roles/permission API; no claim that navigation visibility secures operations |

Exact query derivations and every count suffix are recorded in
`DASHBOARD_REALTIME_BACKEND_NOTES.md`; exact frontend consumption is recorded in
`DASHBOARD_REALTIME_FRONTEND_NOTES.md`. Root compared both suffix lists, including
all null keys, rather than relying on a shared path or earlier conformance claim.
There is no unresolved key/enum/nullable-field mismatch in the scoped source.
Unavailable facts are explicit nonblocking read-model limitations, not complete
implementations of their absent domain workflows.

### Filter contract

| UI property | Query key / VM property | Accepted values | Default / absence / invalid behavior |
|---|---|---|---|
| ownership | ownership / Ownership:string | all, own, external, buyBack | UI Own; API omission all; empty/unknown/false/zero rejected by validation |
| fleetType | fleetType / FleetType:string | all, rental, replacement, staff | UI Rental; API omission all; empty/unknown/false/zero rejected by validation |

Reset restores Own/Rental. Changes automatically request the new filter set and
immediately clear the previous-filter snapshot. An effective vehicle filter
uses matching live-vehicle membership for operational rows; all/all includes
unassigned rows. No implicit branch or authorization predicate was invented.

### Table columns beside response fields

| Table | Displayed column order = frontend field order | Backend DTO properties in the same order | Additional identity only |
|---|---|---|---|
| Idle vehicles | branch, pendingCustomerDelivery, pendingWorkshopDelivery, notReady, available, readyToGo, custody, total | Branch, PendingCustomerDelivery, PendingWorkshopDelivery, NotReady, Available, ReadyToGo, Custody, Total | BranchId; frontend rowKey derived from it |
| Open agreements | branch, daily, weekly, monthly, lease, total | Branch, Daily, Weekly, Monthly, Lease, Total | BranchId; frontend rowKey derived from it |
| Hired agreement kinds | type, permanentCar, serviceReplacement, temporaryCar, total | Type, PermanentCar, ServiceReplacement, TemporaryCar, Total | Type also stable identity |

These are response section DTOs, not ListVMs. No sort/filter/export action is
inferred from a visible column. Type labels are translated; absent branch names
use translated Unavailable; nullable numbers preserve em dash. Backend supplies
table totals, and there is no local paging or page-total substitution.

## Runtime wiring and reusable owners

| Producer/owner | Contract | Consumer / behavior | Cleanup/boundary |
|---|---|---|---|
| Dashboard route | /dashboard → standalone DashboardComponent | Root provided DashboardSnapshotService → root interceptor-equipped HttpClient | Existing authenticated route/menu retained; no new client provider |
| Snapshot service | environment.baseUrl + Dashboard/Snapshot; skip-error header | Single switchMap/defer HTTP pipeline; safe inline apiErrorMessage for declared/transport failures | takeUntilDestroyed; finalize releases foreground global loader |
| RealtimeHub | /hubs/realtime; Subscribe/Unsubscribe registered topic | Group tenant:{claim}:{topic}; ResourceChanged {topic,occurredAtUtc} | Authorize, positive tenant, close at auth expiration; no client publish/tenant arg |
| JWT handler | access_token query only on hub path boundary | Browser WebSocket/SSE authentication | HTTP bearer behavior unchanged; token never logged by added code |
| Topic definitions | dashboard + all 22 persisted dependency types | EF interceptor registry lookup | Add another topic/dependency definition instead of another hub |
| Commit tracker | SavingChanges stage; SavedChanges or explicit TransactionCommitted release | Bounded publisher queue coalesces 250ms; sends invalidation only | Failed/cancelled save and full rollback discard pending notifications |
| Shared RealtimeService | watch(topic), status(), retry() | One ref-counted session socket; initial/final-close retry, automatic reconnect and rejoin | Last consumer/logout/replacement stops old connection and invalidates callbacks |
| Shared auth-token utility | readAuthToken, observeAuthToken | HTTP interceptor, socket, Dashboard HTTP-session guard | Distinct auth/storage + guarded microtask after login storage; removes listener on unsubscribe |
| Dashboard refresh lifecycle | 400ms notification coalescing, 60s reconciliation, Refresh/Retry | One in-flight request; background activity schedules one trailing refresh, foreground/filter request cancels old HTTP | Captured-session guard and destroy-owned timers prevent stale writes |

Retry/Refresh are read-only and need no confirmation. Same-filter refresh errors
retain last successful values with stale feedback; connection failures show
recovery state without reporting an invented successful live connection.

To reuse: register a `RealtimeTopicDefinition` with its actual source types in
the server composition owner, expose the feature's typed HTTP read, and consume
`RealtimeService.watch('registered-topic')` with the same cancellable read and
rejoin/reconciliation pattern. No feature-specific domain service broadcast is
needed for tracked EF writes. `IRealtimePublisher` remains available only for a
producer that can establish its own committed persistence boundary.

## Final source conformance

| Concern / owner | Compared target symbols / values | Result |
|---|---|---|
| UI1/3 shell/title | Dashboard sigma-route-host/list/page/panel/header; FeatureTitle; no viewport arithmetic | Matched existing shared shell; unchanged Dashboard-specific content layout |
| UI4 filters | FilterPanel mainColumns4/inlineActions/stableLayout/busy public inputs; two wide radio groups; Reset callback | Matched declarations; radio labels/fieldset/legend retained |
| UI24 KPI strip | kpis(): readonly SummaryCard[], number/text/hintKey; SummaryCards public cards/ariaLabel | Matched current owner; no copied KPI tile internals |
| UI22/28 read states | Dashboard requests switchMap/defer/finalize, skip-error header, both failure channels, auth snapshot guard | Matched; foreground loading pairs and background trailing read reviewed |
| BE17 reports | GetSnapshotAsync QueryReport for every source, same complete filter population, SQL aggregate shapes | Source matched; EF translation/performance owner-pending |
| BE17 current state | VehicleService.SearchAsync CreatedAt/Id ordering vs dashboard anti-join | Matched, including missing status distinct from Available |
| Route/provider | routing.ts Dashboard entry; AppModule single HttpClient; root provided services | Matched; no feature HttpClient/HttpClientModule/manual HTTP bearer |
| Contract keys/tables | Backend notes key set vs dashboard.data.ts suffixes and snapshot interfaces/columns | Matched producer/consumer names/nullability; stable row tracking |
| Responsive/RTL/theme | Existing grid breaks1200/768, ring576, shared filters720; metric text wraps; theme tokens/logical sides | Source behavior retained; intermediate-width/RTL/theme visual acceptance pending |
| Guide | DASHBOARD_GUIDE id dashboard registered in GuideReader; UserGuide :sectionId route; existing User Guide navigation | Matched bilingual actual behavior; owner reader/runtime acceptance pending |
| Shared extraction | Realtime transport, topic registry, commit tracking, auth-token observer/read owner; Dashboard adopts them | Implemented; UI2/BE17, preambles, skill/history and generated packets synchronized |

No Dashboard print/export feature was introduced. Existing unrelated report
print behavior and other screen consumers retain their owners. No general
Dashboard screen type or new design system was added as part of service work.

## Changed files

Frontend repository:

- `package.json`, `package-lock.json` — @microsoft/signalr10.0.0 and its dependency tree. Installed with scripts disabled; unrelated install-only dev metadata additions removed.
- `src/app/pages/dashboard/dashboard.component.{ts,html,scss}` — source snapshot lifecycle/states/Refresh and removal of unused static date chip styles.
- `src/app/pages/dashboard/dashboard.data.ts` — presentation metadata only, actual filters, missing groups; sample counts/branch rows removed.
- `src/app/pages/dashboard/dashboard-snapshot.service.ts` — new typed read transport.
- `src/app/pages/dashboard/models/dashboard-snapshot.interface.ts` — new typed response sections.
- `src/app/pages/dashboard/models/dashboard-card.interface.ts`, `dashboard-filter.interface.ts` — nullable values/stable identity and exact filter unions.
- `src/app/pages/dashboard/dashboard-cards/dashboard-cards.component.{ts,html,scss}` — nullable display, stable table identity, translated kind labels, wrapping metric labels, source-based ring.
- `src/app/modules/shared/models/realtime.ts`, `service/realtime.service.ts`, `utils/auth-token.ts` — shared typed transport/session owners.
- `src/app/modules/shared/interceptores/token.interceptor.ts` — reuse same token-read owner; HTTP header/language/paging behavior retained.
- `src/app/modules/i18n/vocabs/en.ts`, `ar.ts` — Dashboard block only.
- `src/app/modules/UserGuide/content/dashboard-guide.ts` — existing guide updated.

Backend repository:

- `SiGma.Business/IServices/IDashboardService.cs`, `Services/DashboardService.cs` — new read contract/aggregation.
- `SiGma.ViewModels/ViewModels/Dashboard/DashboardSnapshotFilterVM.cs` — new allowlisted query filter.
- `SiGma.Helpers/Dtos/Dashboard/DashboardSnapshotDto.cs`, `DashboardIdleVehicleRowDto.cs`, `DashboardOpenAgreementRowDto.cs`, `DashboardHiredVehicleRowDto.cs` — new read DTOs.
- `SiGma.ServerAPI/Controller/DashboardController.cs` — new Snapshot action.
- `SiGma.ServerAPI/Program.cs`, `Extensions/DependencyResolver.cs` — composition/JWT hub wiring.
- `SiGma.ServerAPI/Realtime/IRealtimePublisher.cs`, `RealtimePublisher.cs`, `RealtimeHub.cs`, `RealtimeNotification.cs`, `RealtimeTopicDefinition.cs`, `RealtimeTopics.cs`, `RealtimeCommitTracker.cs`, `RealtimeSaveChangesInterceptor.cs`, `RealtimeTransactionInterceptor.cs`, `RealtimeServiceCollectionExtensions.cs` — shared delivery, groups, dependencies and postcommit observation.

Documentation:

- Review-folder plan, API freeze, backend/frontend notes and this full-stack reconciliation.
- Canonical UI2/BE17 and UI/BE preambles, CHANGELOG, sigma-screen-refactor digest/history; generated PLAN-00/PHASE-00..06 through the generator only.
- Historical DASHBOARD_FEATURE_REVIEW.md and DASHBOARD_FINAL_RECONCILIATION.md retained as historical records.

## Verification, limitations and owner steps

Source checks: separate complete scoped Git diffs inspected in both repositories,
new untracked source files read, no stale DashboardKpi/DASHBOARD_KPIS reference,
no index row tracking/merge markers/forbidden newer JS APIs in scoped changes,
imports/public component inputs compared, DTO/route/key/enum/null contracts
reconciled. Final whitespace check clean. Translation check: en126/ar126,
missing0/0, case-only0. Installed SignalR10 declarations, EF10 interceptor XML
and ASP.NET dispatcher reference confirm the used API symbols; these checks
do not certify compilation or runtime.

1. Owner builds each repository, then confirms Snapshot GET200 with bearer auth,
   expected400 for invalid filter strings and rejection without authentication.
2. Owner checks each operational counter/table against known records, all/all
   and selected ownership/fleet values, including unassigned/deleted rows and
   UTC day/age boundaries. Raw existing operational dates are wall-clock values;
   runtime acceptance must confirm this explicitly chosen UTC cutoff suits them.
3. Owner verifies grouped/latest-state/union EF queries translate on the actual
   SQL Server provider and measures the24 sequential aggregate reads per snapshot
   with realistic data/concurrent viewers. Sections are eventual-consistent,
   not one transactionally frozen database snapshot.
4. Owner opens two sessions in one tenant: commit a relevant existing workflow
   and observe the other Dashboard refresh. Check explicit multi-save commit,
   rollback/cancel, burst writes, and that last-consumer departure stops its socket.
5. Owner checks different tenants cannot receive one another's notifications or
   snapshot data; logout, same-tab re-login and cross-tab credential replacement
   cancel old reads and sockets. Reconnect must rejoin and fetch fresh data.
6. Owner interrupts the network/server, verifies visible disconnected/stale/error
   and Retry states, then restoration/rejoin. Periodic60s reads recover missed
   notifications and date-derived changes without user edits.
7. Owner checks English/Arabic, light/dark and narrow/intermediate widths around
   the documented breakpoints; title/filter fixed and single dashboard scroll
   region, complete tables, wrapped labels and existing links remain usable.
8. Owner opens `/UserGuide/dashboard` through the existing User Guide reader;
   verify filters/reset, live/retry/stale, UTC, source limits and tenant-wide scope.

Delivery is bounded best effort in this process. Ambient transactions, direct SQL,
ExecuteUpdate/Delete or other writes bypassing the registered EF callbacks use
periodic/manual reconciliation. There is no durable outbox/backplane. Multiple
server instances require a configured SignalR backplane and appropriate routing;
the bearer-only client currently sends no cross-origin credentials. These are
explicit deployment/coverage limitations, not hidden guarantees.

No build, test, lint, browser/application runtime, database, migration, commit,
push or deployment command was run. Only source/documentation checks and
dependency installation with scripts disabled were performed. No Add-Migration
is needed for this task.

## Delegation and suggested commits

After root discovery/contract freeze, two inherited-model workers owned disjoint
backend snapshot and frontend Dashboard files; a bounded inherited-model read-only
auditor reviewed shared real-time infrastructure. Root owned architecture,
SignalR/session/commit wiring, source integration, docs and complete final diff.
Parallel backend/UI work reduced sequential waiting; the focused auditor caught
login emission/storage ordering, fixed through one shared observer. No worker
changed an overlapping owner file; no agent declared overall completion.

Suggested messages, staging only the files listed above:

```text
SigmaBackend:
feat(dashboard): add snapshots and reusable realtime

SiGmaAngularFrontEnd:
feat(dashboard): load live metrics with shared SignalR client

Documentation owner:
docs(patterns): document reusable realtime read invalidation
```

Authoritative external implementation references consulted for SignalR lifecycle
and EF callback behavior: [Microsoft SignalR client](https://learn.microsoft.com/aspnet/core/signalr/javascript-client),
[Microsoft EF interceptors](https://learn.microsoft.com/ef/core/logging-events-diagnostics/interceptors).
Project contracts and installed declarations remained the source-specific owners.

## Runtime follow-up — reported Snapshot500 (2026-10-19)

Owner supplied GET /Dashboard/Snapshot?ownership=own&fleetType=rental returning
HTTP500. The Error Logs entry reports Microsoft.Data.SqlClient.SqlException,
19540ms duration and ExecuteReaderAsync frames. The stored diagnostic deliberately
omits raw exception messages/SQL and truncates frames before the owning service;
it therefore cannot identify the failed section or SQL error number. Root cause
is not confirmed: this evidence does not establish LINQ translation failure,
missing schema, timeout or another provider error.

Scope amendment before edits: preserve the existing snapshot data contract and
safe generic500 response; stamp one server-owned allowlisted Dashboard read-stage
identifier on a rethrown exception, and extend existing sanitized Error Logs
diagnostics with that identifier and SQL Number/State/Class numeric metadata.
No raw exception message, SQL, parameters, credentials or record values are added.
This diagnostic correction makes the owner's next reproduction actionable;
it does not claim the underlying500 is fixed. All application/runtime/database
execution remains owner-only. Source-only review must reconcile stage wrappers,
safe metadata filtering, unchanged error propagation and guide troubleshooting.

Diagnostic correction implemented and source-reviewed:

- DashboardService wraps exactly24 existing awaited SQL reads in one private
  generic ReadSnapshotSectionAsync method. The original queries, sequential
  execution, filters, values, cancellation token and response shape are unchanged.
  Exceptions are stamped with a typed DashboardSnapshotSection then rethrown;
  OperationCanceledException is not intercepted and no fallback dataset is returned.
- New Helpers/Enum/DashboardSnapshotSection.cs and
  Helpers/Helpers/DashboardSnapshotDiagnostics.cs share the enum and metadata key.
  No entity/schema/DTO property was added.
- ErrorLogsMiddleware renders numeric SQL Number/State/Class and accepts only a
  defined DashboardSnapshotSection value. Metadata appears before the30 stack
  frames so truncation cannot hide it. Raw messages/SQL/Data strings remain excluded.
  Existing generic500, tenant capture, persistence and expected-conflict handling
  remain unchanged. Historical error records are untouched.
- Dashboard and Error Logs in-app guide content now explains the safe diagnostic
  fields and troubleshooting/reproduction path. Existing /UserGuide/dashboard and
  /UserGuide/administration reader registrations remain; source conformance checked.
- BE18, backend preamble0.84, skill revision and CHANGELOG synchronized; all eight
  packets regenerated through the generator, semantic review retained source-only
  boundaries/privacy and the final -Check passed.
- Scoped diff/whitespace/read-boundary review passed. No build, test, lint,
  browser, runtime, database, migration, commit or push was run. No migration needed.
  This follow-up stayed local: one sequential diagnostic workstream did not meet
  the delegation gate. Suggested backend commit after owner review:
  `fix(dashboard): expose safe read failure diagnostics`; frontend guide-only
  suggestion: `docs(dashboard): explain server failure diagnostics`.

Outstanding evidence: owner restarts the backend to load the change, reproduces
Dashboard once, and reads the newest error entry's first three lines containing
SQL Number and Dashboard section. Root-cause repair is still pending that
evidence; provider SqlException plus19540ms alone is insufficient to choose a
schema, query or timeout change safely.

### Subsequent reproduction and stale executable evidence

Owner supplied a second Snapshot500 at2026-10-19 12:18UTC (4925ms). It still
contains neither SQL Number nor Dashboard section, and includes the old direct
GetSnapshotAsync stack without the read-stage helper.

Read-only host metadata identifies listener7178 as process50064, executing
`F:/My Work/Sigma/SigmaBackend/SiGma.ServerAPI/bin/Debug/net10.0/SiGma.ServerAPI.exe`.
Observed UTC timestamps:

| Item | UTC timestamp |
|---|---|
| SiGma.Business.dll | 11:48:18 |
| SiGma.ServerAPI.dll | 11:48:48 |
| SiGma.ServerAPI.exe | 11:48:49 |
| Process start | 11:49:03 |
| DashboardService.cs diagnostic edit | 12:06:14 |
| ErrorLogsMiddleware.cs diagnostic edit | 12:06:14 |

Thus the running build predates the diagnostic source change. Cairo times are
14:48/14:49 versus15:06 respectively. The exact source project is correct; the
executable needs an owner Rebuild and restart, not another source workaround.
Stop the current backend, Rebuild SiGma.ServerAPI (including referenced projects)
from this repository, then start it and reproduce once. If the build fails, its
first compiler error is the next required evidence; otherwise collect the new
SQL Number/stage. This establishes stale diagnostic binaries, not the underlying
SQL root cause. No application source changed in this follow-up; only this review
was appended. Inspection used listener/process/file metadata only, with no API,
browser, database, build/test/lint, process termination or deployment operation.

### SQL207 localized to the existing Purchase Request schema prerequisite

Owner reproduction at2026-10-19 12:23UTC (5835ms) now reports
`SQL Number: 207; State: 1; Class: 16` and
`Dashboard section: PurchaseRequestApprovals`. The diagnostic build is active.
SQL207 means an invalid column name; elapsed time is not evidence of a timeout.
Primary reference:
https://learn.microsoft.com/en-us/sql/relational-databases/errors-events/mssqlserver-207-database-engine-error

Source reconciliation:

- `SiGma.Business/Services/DashboardService.cs:337` counts tenant-visible live
  PurchaseRequests with `ApprovalStatus == ApprovalStatus.NotApproved`. The
  entity declares this persisted status and the existing configuration maps it.
- Existing migration
  `SiGma.DataAccess/Migrations/20261018050112_AddPurchaseRequestManualApproval.cs:14`
  adds `PurchaseRequest.ApprovalStatus` as required int with default1. It also
  adds the approval-log table and PR/PO links. It is currently the latest
  migration present in source; no duplicate migration is needed.
- `PURCHASE_REQUEST_MANUAL_APPROVAL_2026-10-18.md` explicitly left generating
  and applying that schema change with the owner. A migration file is now
  present, but neither database migration history nor the actual table schema
  has been inspected in this task. The missing ApprovalStatus column due to
  an unapplied migration is therefore the source-supported leading diagnosis,
  not a directly verified column name: the safe log intentionally omits the
  provider message containing that name.

The query matches the frozen pending-approval contract. No source workaround,
fake zero, catch-and-ignore207, or hand-written replacement column was added.
The original Dashboard implementation introduces no schema of its own; it does
require the schema of the existing features it reads, including this PR change.

Owner next step: verify that EF tooling targets the same database as the
running backend, then apply the existing migration from Visual Studio Package
Manager Console in the SigmaBackend solution:

```powershell
Update-Database -Migration 20261018050112_AddPurchaseRequestManualApproval -Project SiGma.DataAccess -StartupProject SiGma.ServerAPI -Context SiGmaDbContext
```

This also applies earlier pending migrations on the path to the target. Review
their normal owner deployment prerequisites. Do not create another Add-Migration
for this error. After successful update, reopen Dashboard and verify this
Snapshot request and its pending PR count. If tooling reports no migrations
applied while the same error persists, reconcile the runtime/tooling database
targets and the actual PurchaseRequest columns before changing the query.

This follow-up changes only this review artifact. Packet drift check passed for
all8 packets; backend diff whitespace check passed. No application source,
migration, model snapshot, or database was modified. No build/test/lint, browser,
API replay, database command, migration execution, commit/push or deployment
was run. No agents were used for this sequential diagnosis. Runtime resolution
remains owner-pending under AGENTS.md migration boundary (lines488–490), and
the issue is not claimed fixed merely from source evidence.
