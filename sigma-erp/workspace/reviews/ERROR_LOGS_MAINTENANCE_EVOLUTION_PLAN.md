| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

# Error Logs maintenance/evolution plan — 2026-10-14

Outcome: review Administration/ErrorLogs against the canonical books and implement confirmed fixes. The owner explicitly selected **create automatic error logging in SigmaBackend** during this task after discovery found no ErrorLogs backend. No retention/deletion, permission system, request-body logging, historical reconstruction or business-write changes are authorized.

## Existing-state inventory and logic ambiguity register

| Concern | Source/current behavior | Decision/evidence |
|---|---|---|
| List | ErrorLogs/list: ms-lib, no initial request; search reads an unpopulated allData array; required user selection uses an ID as text | Replace presentation and broken read path with shared list/query owners |
| Detail | ErrorLogs/details: read-only GET errorLogs/GetById/{id}; no transport recovery; create route redirects | One controlled read-only modal; retain details deep-link compatibility; redirect obsolete create alias |
| Backend | No ErrorLog entity/controller/service in the actual repository; AccountingConfigurationExceptionMiddleware handles known domain/conflict errors only | Owner confirmed creating automatic logging; new operational owner |
| Tenant | Repository.QueryReport and AuditTrailSaveChangesInterceptor use authenticated NameIdentifier as subscription, Name as actor | Keep existing claim semantics; positive subscription required; do not fabricate a tenant |
| Persistence | AuditTrailEntry is standalone operational metadata, not mutable EntityBase; sealed configurations are assembly-discovered | Same operational shape for ErrorLogEntry, independently saved after a failed request |
| Client / impersonation | Screenshot shows Client column; source has optional clientName, but no trusted client/impersonation producer | Client remains null; remove unsupported impersonation claim/display. No fake metadata |
| Diagnostics | Parameters and exceptionMessage exist only in legacy detail contract | Parameters becomes method + route **template** + status/trace context, never actual parameters. Diagnostics contains exception type/method frames, never raw Message, file paths, SQL or body |

All required decisions are Confirmed or reviewer decisions under the owner's Master2 standing rule. No unresolved material decision remains. Static screenshot does not prove advanced-filter contents, row selection or mutation workflows.

## Impact map and gap decisions

| Area | Classification | Owner/consumer | Impact |
|---|---|---|---|
| Entity/config/read DTOs/service/controller | Create | Backend operational logs; Angular list/detail/export | New tenant ErrorLogEntry table; lean read contracts |
| HTTP capture and safe 500 response | Create | ServerAPI middleware + fresh scoped writer; existing accounting middleware | Authenticated tenant unexpected exceptions and returned5xx; skip canceled requests, known domain/conflict exceptions and ErrorLogs endpoint recursion |
| Program | Extend | Existing root DI/pipeline | Register writer; capture middleware inside accounting middleware, before authentication/authorization/controller execution |
| List/filter/query/export | Replace | Existing ErrorLogs route + shared DataTable/FilterPanel/date-utils/list-query | Real paged reads, current-month defaults, optional username; snapshot cutoff shared by paging/export |
| Detail and aliases | Refactor | Shared EditorDialog; old /details/:id | Read-only viewer with recovery; no writes |
| Guide/translations | Extend | Existing Administration module guide and EN/AR vocabs | Explain final screen and capture limits |

## Options and owner decision

An external logging service would preserve another system's ownership but no location/contract was supplied. Creating a native automatic store enables the requested screen and follows the standalone operational-event precedent. Reusing AuditTrail was rejected: successful business-change metadata and failed HTTP diagnostics are different contracts. Generic CRUD was rejected because operators must not create/edit/delete error history. Owner selected native automatic capture on2026-10-14.

## Target, compatibility and migration

Exact contracts: `ERROR_LOGS_FULL_STACK_CONTRACT_FREEZE.md`. Capture is best effort, one independent fresh-context save with bounded timeout, no retry/nested failed-business save. Store UTC; expose UTC wall-clock values without an offset marker and label UTC explicitly. No accounting calculation; stopwatch owns duration milliseconds. Raw exception messages/stacks/values are excluded. Known business conflicts retain their existing response owner. Returned5xx stores a safe status description.

New table/config require owner-run `Add-Migration AddAutomaticErrorLogs` and deployment **before enabling the new server pipeline**. No migration/snapshot/database command by agents. No historical backfill. Existing routes remain usable, and API names follow legacy frontend URL expectations. Capture failure preserves the original response/error and emits only safe logger metadata. Removing the middleware registration is a reversible rollout fallback; do not delete stored rows.

## Dependency-ordered slices / verification matrix

1. Phase0 discovery/evidence and plan; Phase1 freeze entity/API/capture boundaries.
2. Independent backend implementation and frontend shared list/modal implementation against that freeze.
3. Root Phase5 Program/integration and guide; Phase6 complete scoped diffs and contract comparison.

Source verification: exact columns/DTOs, filters/count/sort/cutoff, tenant predicates, capture exclusions, independent write lifetime, safe responses, one feedback owner, imports/translation parity, routes, guide and whitespace. Build/tests/lint/runtime/browser/database/migrations/commits/push/deploy are owner-only. Owner checks: migration, protected reads/cross-tenant detail, actual unexpected exception/returned500/request cancellation/capture failure, rapid paging/research, full export, EN/AR/RTL/themes and responsive/short-height scroll/focus.

Packets: initial -Check found all8 stale fingerprints. Templates/manifest reviewed against Master0–8, UI shared-owner references and BE operational/report boundaries; no new semantic authority was needed. Regenerated all8 via generator and -Check passed. Applied PLAN00 and PHASE00/01/02/03(view-only)/05/06; Phase04 skipped (no domain transitions).
