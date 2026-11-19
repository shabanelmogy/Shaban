# First-request startup improvement

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-14 |
| Authorization | Owner asked for an improvement, then delegated the technical choice: `شوف المناسب`. Owner subsequently confirmed the delay also occurs locally. |

## Outcome and scope

Move reusable first-use initialization into ServerAPI startup and expose separate internal timings. This is a backend infrastructure change, not a screen implementation. The cause and the performance gain are unmeasured; there is no promise to eliminate all request latency.

Scope: `SigmaBackend/SiGma.ServerAPI/Program.cs`, one API-owned startup service and its operational guide. Read-only dependencies: ServerAPI DI registration, SiGmaDbContext and the existing Angular login/header request flow. Preserve existing user edits. The scoped startup files were clean at discovery. Existing BranchService and navbar edits were observed in the preceding investigation and remain untouched.

## Existing state and ambiguity register

| Evidence | Current behavior | Classification |
|---|---|---|
| Angular AuthService.login and environment files | Login uses a different base URL from the operations API | Confirmed |
| NavbarComponent.ngOnInit/getListItems | Header requests the Branch list after login | Confirmed |
| SiGmaDbContext.Model/OnModelCreating | 355 DbSet declarations; sealed EF configurations applied from the assembly; no startup model initialization | Confirmed |
| ServerAPI DependencyResolver | Existing AutoMapper configuration is resolved on use; Business assembly broadly scanned | Confirmed |
| SiGmaDbContext.OnConfiguring | SQL provider is unconditionally pointed at a remote SQL server, including local API operation | Confirmed; no credentials reproduced |
| Owner report | Delay also occurs with local API | Explicit |
| Exact dominant cost | EF model, mapper initialization, SQL connection, query compilation or SQL execution | Uncertain; owner timings required; does not block safe eager initialization |
| Hosting preload/module availability | IIS configuration targets out-of-process, but installed modules and provider controls are unknown | Uncertain; deployment changes excluded |

## Impact and gap decisions

| Area | Decision | Producer/consumer and effect |
|---|---|---|
| API startup | Extend | Program registers one IHostedService; host awaits startup initialization |
| Startup initialization | Create | API assembly owns one hosted service; dedicated disposable scope uses existing mapper and context registrations |
| EF model, mapping profiles, tenants, CRUD | Keep | No model edits, mappings, tenant selection, API payload or repository changes |
| SQL connection | Extend | One open/close attempt with a five-second cancellation deadline; no SQL statement or tenant data access |
| Diagnostics | Create | Structured stage/duration/result logs; no connection strings, exception messages, user values or secrets |
| Active IIS configuration | Keep | Deployment guide describes optional preload; no automatic web.config change |
| Operations guide | Create | Developer/host-owner instructions, local measurement, enable/disable switch and rollback |

## Options and technical decision

| Option | Compatibility / maintenance / cost | Decision |
|---|---|---|
| Startup warm-up with stage timings | Uses net10 and EF10 APIs already available; no schema change or generated model; shifts initialization into process startup | Selected |
| Compiled EF model | Could reduce initialization cost, but requires generation/build plus maintenance after model edits; benefit unmeasured | Deferred until timings justify it; no build authorization |
| DbContext pooling | Addresses repeated context setup; requires separate state/lifetime review and does not prove a first-model improvement | Not selected |
| Cache Branch rows | Introduces tenant-scoped caching and invalidation; first-request root cause unproven | Not selected |
| AlwaysRunning/Preload or keepalive | Useful for on-demand hosting; needs hosting/module availability and deployment ownership | Guide only |
| Change SQL destination/OnConfiguring | Changes which database the app uses; could alter data visibility | Excluded; requires explicit database-target decision |

The owner delegated technical selection; none of these choices changes business policy. The service remains best-effort: failures are logged and ordinary request behavior remains available. Host startup cancellation propagates. SQL deadline does not cap synchronous EF/mapper initialization or driver cleanup.

## Frozen target, compatibility and verification

Target handoff: `FIRST_REQUEST_STARTUP_BACKEND_CONTRACT_FREEZE.md`. No entity, EF configuration, API contract, calculation, permission or data change; no migration/backfill. Global startup does not manufacture a tenant or call Branch without authentication. The warm-up runs once per process start, not per login. Default enabled; `StartupWarmup:Enabled=false` disables it without source edits.

Plan slices: Phase 0 scoped source discovery; Phase 1 infrastructure/compatibility freeze; Phase 5 service wiring and operational guide; Phase 6 complete scoped diff and source reconciliation. Phases 2–4 are not applicable: no list, editor or domain-action change.

Source verification: inspect registration before builder.Build; verify singleton hosted service creates/disposes its own scope, awaits each stage, handles failed model/mapper/connection independently, propagates host cancellation, closes connection, emits only safe metadata, and invokes no SaveChanges/SQL statement. Inspect complete scoped diff and whitespace/merge markers. Owner checks: build, cold restart, logs, first Branch timing vs repeat, connection outage and disable switch. No build/test/database/runtime/browser/deployment command may be executed in this task.

Rollback: set `StartupWarmup__Enabled=false`; revert only this task's Program registration and new service if needed. On-demand IIS can still charge startup time to its first HTTP request; this change alone is not evidence of production TTFB improvement. Remote SQL round-trip latency and first Branch query compilation remain.

## Guide and reference conformance

| Concern | Owning block | Reference / shared owner | Target |
|---|---|---|---|
| Infrastructure shape | Master 1/4/5; backend preamble/5 | Existing Program and DependencyResolver; no canonical CRUD screen matches | Explicit operational exception; host owns startup |
| Scoped context lifetime | BE5 | Existing AddDbContext registration and BE5 isolated-scope guidance | Resolve in an async scope, never inject scoped context into singleton |
| DI scan | BE5 | DependencyResolver.FromAssemblyOf<AccountService>() | New service in API assembly; explicit registration; existing scan unchanged |
| Tenant/privacy boundary | BE18 | DbContext model and connection APIs | No tenant/entity query, save, credentials or raw exception text |
| Source-only handoff | Master7; Phase05/06 | Review artifact | Runtime gain remains owner verification |

Recipe `-Check` passed for all packets on 2026-10-14. Used PLAN00 and scoped Phase00/01/05/06 sections. No packet/book change required; these are feature-specific technical decisions, not a new canonical rule. No subagents: implementation is one short dependent startup workstream. No in-app guide impact: no user-facing screen/workflow change.

Primary platform evidence: [EF startup/model caching](https://learn.microsoft.com/en-us/ef/core/performance/advanced-performance-topics#compiled-models), [hosted-service lifecycle and scope](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/host/hosted-services?view=aspnetcore-10.0), [IIS preload](https://learn.microsoft.com/en-us/aspnet/core/host-and-deploy/iis/#application-initialization-module-and-idle-timeout).
