| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

# Audit Trail read API handoff

## Ownership status

| Slice | Status | Evidence |
|---|---|---|
| Row/user/result DTOs | Implemented | Separate projection contracts under `SiGma.Helpers/Dtos/AuditTrail` |
| Bound filter model | Implemented | `AuditTrailFilterVM : ListSmBase` retains the inherited ordinary MVC-bound `Filters` auto-property, sets page defaults in its constructor, and normalizes the comparer after binding |
| Read service contract/query | Implemented | `IAuditTrailService` and `AuditTrailService`; no generic CRUD base and no AutoMapper |
| Authenticated GET controller | Implemented | Exact lowercase `audittrail` route with GET root and GET `GetUsers`; no mutation endpoints |
| Localized API validation | Implemented | Five Audit Trail-only keys added to the existing dirty EN/AR `GeneralMessage` resources |
| Registration | Existing owner reused | Business interface scan discovers `IAuditTrailService`; no `Program.cs` edit |
| Persistence/entity/config/interceptor | Peer-owned | Read service consumes the frozen `AuditTrailEntry` shape without editing peer files |
| Build/runtime/database | Pending owner | Prohibited for this source-only workstream |

## Exact validation and query contract

- MVC binds `pageNo`, `pageSize`, `snapshotId`, and `Filters[...]`. Defaults are page 1 and size 15. Supplied page sizes clamp to 10..100. Page numbers below 1, negative snapshots, and paging offsets beyond `Int32` are rejected. Malformed integer binding remains the standard `[ApiController]` safe 400 path.
- `AuditTrailFilterVM` inherits the canonical `ListSmBase`; its constructor sets page 1 and size 15. The inherited `Filters` auto-property is normalized with `StringComparer.OrdinalIgnoreCase` after MVC binding. Its setter does not copy or transform MVC's object-keyed bracket values.
- `fromDate` and `toDate` are mandatory and parsed only with invariant `yyyy-MM-dd`. The range must be ordered, and `toDate` must be before `9999-12-31`. The event query uses `DateTime >= fromDate` and `DateTime < toDate.AddDays(1)` without timezone conversion.
- Optional `recordNo` and `recordType` are trimmed substring filters. Optional `user` is a trimmed exact match against captured `Username`.
- Allowed sort fields are `dateTime`, `username`, `recordType`, `recordNo`, `recordAction`, and `recordDate`, case-insensitively. Sort order is `1` or `-1`; omission defaults to `dateTime` descending. Every sort adds `Id` in the same direction as a stable tie-break.
- The tenant base query is `Repository.QueryReport<AuditTrailEntry>()`, preserving its fail-closed subscription behavior: a missing or invalid subscription produces an empty query. The initial `snapshotId` is the tenant maximum event `Id`, or 0 for an empty tenant. A supplied nonnegative cutoff is reused as-is. `Id <= snapshotId` is applied before filters, count, ordering, `Skip`, and `Take`.
- `TotalCount` is counted after tenant/snapshot/date/optional filters and before paging. Rows project only `Id`, `DateTime`, `Username`, `RecordType`, nullable `RecordNo`, `RecordAction`, and nullable `RecordDate` into `AuditTrailResults`, which also returns the fixed `SnapshotId`. After SQL materialization, event `DateTime` is explicitly marked `Unspecified` so the normalized UTC wall clock is transported without `Z` or an offset; it is not converted. `RecordDate` remains the nullable source-domain calendar value.
- `GetUsers` reads the same tenant query, selects distinct captured usernames, orders them, and returns `Id = Username` and `Value = Username`. It does not query local users or authentication identifiers.

## Source checks

| Check | Result |
|---|---|
| Recipe drift check | `PLAN-00` and `PHASE-00` through `PHASE-06` reported OK before packet use |
| Frozen contract/entity compatibility | DTO projection and query properties match the peer-owned `AuditTrailEntry` source |
| Tenant/snapshot/filter/count/page order | Inspected directly in `AuditTrailService.GetAsync` |
| Stable allowlisted sorting | Six allowlisted fields plus same-direction `Id` tie-break inspected |
| Mutation/CRUD/AutoMapper absence | No write endpoint, generic CRUD inheritance, write DTO, detail DTO, or mapper added |
| Route/authentication | `[Authorize]`, `[ApiController]`, and `[Route("audittrail")]` inspected |
| Resource XML | Both modified RESX files parsed successfully as XML; Audit Trail additions are bilingual |
| Whitespace/merge markers | Scoped `git diff --check` and direct source searches completed with no finding |

The shared-extraction gate found no reusable missing backend capability: this query's snapshot semantics and validation are specific to the Audit Trail report, while tenant scoping, result envelopes, localization, and interface-scan registration already use shared owners.

Owner compilation/startup and API request replay remain pending. The broader feature still requires owner-run `Add-Migration AddAuditTrailEntries` for the peer-owned entity/configuration work; this API slice creates no schema itself.
