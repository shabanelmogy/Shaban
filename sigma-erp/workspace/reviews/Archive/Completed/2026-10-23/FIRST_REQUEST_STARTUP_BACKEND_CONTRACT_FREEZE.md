# First-request startup: backend handoff

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-14 |
| Plan | FIRST_REQUEST_STARTUP_MAINTENANCE_EVOLUTION_PLAN.md |

| Contract | Frozen decision and evidence |
|---|---|
| Scope/owner | API-owned StartupWarmupService and explicit Program registration; net10 Web SDK already supplies IHostedService; no canonical CRUD shape applies |
| Lifetime | One singleton IHostedService per host; StartAsync awaits warm-up before the server starts under current sequential host defaults; no recurring/background timer |
| Scope | CreateAsyncScope owns existing mapper/context dependencies; scope is disposed on success, failure and cancellation |
| Enabled | Configuration `StartupWarmup:Enabled`, default true; false logs skipped and returns; no new required appsettings key |
| Mapper | Resolve existing IMapper.ConfigurationProvider; no new/changed profiles, configuration validation or CompileMappings across all profiles |
| Model | Resolve SiGmaDbContext and force `.Model` initialization; no generated model, snapshot or EF configuration edit |
| Connection | Only after successful model resolution, call OpenConnectionAsync with host-linked five-second cancellation deadline; close in finally; no statement, read, save, migration or tenant selection |
| Failure | Best effort per stage; log stage, duration and exception type only; failed mapper does not prevent model warm-up; failed model skips connection; host-start cancellation rethrows |
| Timing | Separate AutoMapper configuration, EF model and SQL connection stages; model timing includes DbContext construction; SQL timing includes close; no absolute speed claim |
| Compatibility | Auth/Branch contracts, claims, DTOs, rows, mapping rules, calculations and configured/effective database destination preserved |
| Hosting | No active IIS config edit; operational guide covers module-dependent preload, out-of-process keepalive and on-demand startup limitation |
| Migration | Not required: zero schema/data changes |
| Verification | Source-only now; owner build/local cold start/log/Branch comparison, cancellation/outage/disable checks pending |

There is no grid, filter, Add/Update, detail, action-state or screen-guide contract to freeze. No endpoint or status payload is introduced. Raw exception text is deliberately excluded from the new diagnostic logs. Full driver/OS cancellation responsiveness and actual startup duration require owner runtime evidence.
