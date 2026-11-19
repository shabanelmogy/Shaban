# First-request startup: implementation and reconciliation

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-14 |
| Plan | FIRST_REQUEST_STARTUP_MAINTENANCE_EVOLUTION_PLAN.md — Frozen |
| Backend handoff | FIRST_REQUEST_STARTUP_BACKEND_CONTRACT_FREEZE.md — Frozen |

## Manifest and evidence

Owner requested an improvement and delegated the technical choice, then confirmed
the symptom occurs locally too. Implemented the Frozen plan's startup warm-up and
measurement slice. No performance measurement, log capture or application run was
performed. The exact original bottleneck remains Uncertain and non-blocking for
this reversible technical slice.

Repository: `F:/My Work/Sigma/SigmaBackend`, verified with `git rev-parse`.
Backend shape: process-start infrastructure; not a CRUD/list/editor/report.
UI shape: not applicable. Existing BranchService, navbar and other owner changes
were preserved. All modified/new application files are owned by this task.

The read-only evidence is the Angular AuthService login URL, navbar Branch request,
Program's context registration, DependencyResolver's mapper registration and
Business-only scan, and SiGmaDbContext's 355 DbSet declarations/OnModelCreating.
No screenshot evidence was supplied. Local API still points at remote SQL through
OnConfiguring; this task does not change that destination or reproduce credentials.

## Files changed

| Path (relative to SigmaBackend) | Change |
|---|---|
| SiGma.ServerAPI/Program.cs | Import API Services namespace; register StartupWarmupService once before builder.Build |
| SiGma.ServerAPI/Services/StartupWarmupService.cs | New singleton IHostedService with scoped mapper/model/connection stages, timing, cancellation, best-effort failure and default-on disable switch |
| SiGma.ServerAPI/Documentation/StartupWarmupGuide.md | New developer/hosting-owner operational guide, local baseline procedure, limitations and rollback |

Local review artifacts: this report, the Frozen maintenance/evolution plan and the
Frozen backend contract above. No canonical book, skill or generated packet edits:
these remain feature-specific decisions with pending performance validation.

## Decisions and conformance reconciliation

| Concern / owning block | Actual symbol and final source | Result |
|---|---|---|
| Infrastructure exception; Master1/4 and BE preamble | Program.AddHostedService<StartupWarmupService>; no controller/service CRUD pattern introduced | Matches Frozen plan |
| Host lifetime; Master5 and Phase05 | StartAsync awaits sequential stage helpers under existing default host startup; no BackgroundService timer or Task.Run | Source matched; listen ordering requires owner observation |
| Scope isolation; BE5 | StartAsync.CreateAsyncScope / await using; singleton constructor contains only factory/config/logger | Scoped dependencies disposed; no scoped-context singleton capture |
| DI scan; BE5 | DependencyResolver.FromAssemblyOf<AccountService>; new class is in API assembly | Existing Business scan preserved; explicit hosted registration only |
| Model; BE2/18 | Existing registered SiGmaDbContext; WarmStageAsync forces context.Model | No EF configuration/entity/snapshot/model change |
| Mapper; BE5 | Resolve existing IMapper.ConfigurationProvider in the temporary scope | Configuration eager-loaded; no profile edits, CompileMappings or validation across all profiles |
| No-tenant startup; BE18 | WarmConnectionAsync uses only Database.OpenConnectionAsync/CloseConnectionAsync | No Branch/entity queries, fabricated claims, saves, statements or migrations |
| Cancellation/failure; BE18 and Master5 | Linked five-second opening deadline; close in finally; host cancellation rethrows; independent stage helper logs failed stage | Best effort; provider cancellation/cleanup responsiveness remains runtime pending |
| Privacy; BE18 | Logs contain fixed stage, duration and exception type; no raw exception passed to logger | New logs omit connection details, credentials and user data |
| Compatibility; Master4/7 | Auth/Branch routes, request/response, tenant rules, mapping rules, calculations, database destination unchanged | No consumer/API/schema change |
| Recovery; Master5/7 | StartupWarmup:Enabled defaults true; false exits before scope creation | Owner can disable through configuration |

The single shared startup owner avoids duplicating work in login, navbar or every
endpoint. No repeated feature helper qualified for a further shared extraction.
There is no in-app screen guide requirement here: no user-facing route, action,
validation or workflow changed. The operational guide is developer documentation.

## Verification and phase record

- PLAN00: alternatives and impact mapped, technical selection Frozen before code.
- Phase00: scoped evidence and ownership established.
- Phase01: infrastructure/compatibility handoff Frozen; no DTO/schema changes.
- Phase05: service registration and async lifecycle implemented; operational guide reconciled.
- Phase06: complete scoped tracked diff and complete new service/guide content
  inspected; registration, API signatures, failure/cancellation paths, privacy,
  merge markers and whitespace checked. No unmatched source contract finding.
- Phases02–04 skipped: list/detail/write/domain actions untouched.

Recipe -Check passed initially and after implementation for all packets. Used
PLAN00, PHASE00/01/05/06 applicable sections and BE2/5/18/19, Master1/3/4/5/7.
Packet provenance/gates were reviewed against the read owning blocks; no packet
drift or regeneration was needed. The canonical Angular wiring reference rows
are not applicable to backend-only host initialization.

Independent read-only audit: reused `frontend_login_trace` explorer on
gpt-5.6-luna for the bounded new-service/Program vs frozen-contract comparison.
Root owned implementation, operational guide and final reconciliation. No agent
source edits or overlapping ownership. Reuse allowed code lifecycle audit to run
while root reconciled documentation; no new agents/model upgrades. Audit found
no concrete source/contract defect. It noted connection close could mask an open
failure if cleanup also throws; this is an unproven diagnostic limitation, not
evidence of leaked state or a required behavior gap.

Existing assets report EF10.0.9/AutoMapper14; Web SDK net10/implicit usings supply
the hosting, DI, config and logging APIs. Official EF10 reference confirms
OpenConnectionAsync(token) and CloseConnectionAsync signatures. This source
check is not compilation certification. No tests added for this wiring-only
change; builds, tests, lint, migrations, database commands, runtime/browser
verification, commits, pushes and deployment were not run. Graphify and Sigma
MCP were not used.

## Remaining risks and owner handoff

1. Build ServerAPI normally and cold-start locally. Review separate
   `AutoMapper configuration`, `EF model` and `SQL connection` completion/warning
   logs before `Now listening`.
2. Compare first/repeated Branch TTFB with warm-up enabled and disabled. Include
   total process time-to-ready: warm-up moves work to startup, without proving
   faster overall startup. A delay after every login while the API stays running
   requires request/query/network profiling rather than another startup fix.
3. EF/model and mapper initialization are synchronous and not capped by the
   connection's five-second cancellation deadline. Driver cleanup is awaited.
   Verify normal startup duration, cancellation and isolated connection outage.
4. SQL network latency, Branch query compilation/execution and mapper execution
   plan compilation remain. Compiled model generation was deferred until stage
   timings justify its maintenance cost, not described as implemented.
5. An on-demand hosted process still starts on its first user request. Confirm
   hosting support before enabling IIS Application Initialization/AlwaysRunning/
   Preload or an external keepalive. No active IIS config was changed here.
6. Disable with `StartupWarmup__Enabled=false` and restart if necessary; verify
   disabled log and absence of a warm-up connection attempt. Follow the complete
   owner checklist in Documentation/StartupWarmupGuide.md.

Migration: **not required**. No domain/accounting calculation or persisted data
change. Source implementation is complete; runtime/performance acceptance pending.

Suggested backend commit (suggestion only):
`feat(startup): warm shared dependencies before serving requests`
covers only the three source/documentation paths listed above.
