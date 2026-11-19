## 18. Edge cases

**Topic files of this block** (read only the one the task needs; they are part of this block):

- [Generic audit metadata capture](18/01-audit-metadata.md)
- [Outbound message outcomes and HTTP error history](18/02-outbound-and-http-history.md)
- [Correction-record input policy and AI candidate contracts](18/03-ai-candidates-and-correction-input.md)

> **Status: Canonical**

Walk this list before calling an entity finished. Mark a row not applicable
rather than skipping it silently.

### Tenant ownership

`SubscriptionId` is server-owned. `SiGmaDbContext.SaveChangesAsync` stamps it
from the authenticated claim on insert and throws `InvalidOperationException`
if an existing row's value changes. Never assign it in a service, a child loop,
or a mapping (`item.SubscriptionId = entity.SubscriptionId` is wrong), and never
accept it from a payload.

**Missing subscription (owner-approved R2, 2026-10-03).** Ordinary EntityBase
Repository reads and writes require the resolved claim to be a positive integer;
missing, nonnumeric, zero or negative values throw `SubscriptionRequiredException`
before querying or mutating the graph. The existing exception middleware returns
HTTP401 with the localized `FailToAuth` Result. Keep the guard on operations,
not construction: login/service resolution and global entities need no tenant.
UOW rejects pending tenant writes before numbering; DbContext rejects them before
audit/SQL in all sync/async SaveChanges overloads, including direct context saves.
An unchanged or global-only save remains allowed. Never fall back to a tenant
from the entity, payload or a default ID. Background tenant writes need an
explicit trusted context; no implicit System bypass exists. `QueryReport` keeps
its separate empty fail-closed/global contract (block 17). The NameIdentifier
claim convention itself remains the current contract (backlog 11).

### Input

### Shared quantity/hour/meter policy (owner foundation decision,2026-10-30)

Current data is experimental and does not justify preserving accidental numeric
precision. Reuse `SiGma.Helpers.Helpers.QuantityNumberPolicy` for reviewed
fractional quantities, hours and meter readings: storage precision18, scale6,
`HasValidScale` to reject excess input precision and `RoundCalculatedQuantity`
only at an explicitly owned derived-calculation boundary. Rounding reuses
`FinancialNumberPolicy.RoundingMode` (half away from zero); the quantity policy
does not use currency decimal places or reprice money/tax. Keep amounts under
the financial owner and true counts/identities under their integer contracts.
Domain owners retain signs, bounds, units and formulas. A justified lower scale
is permitted explicitly; no feature-local copy of the default precision/helper.
Reconcile entity/configuration, all write/read DTOs, filters, aggregates,
snapshots, reports and Angular consumers together before accepting fractions.
No rounding of submitted values or silent truncation to integers. This policy
does not authorize migration creation, data reset or database execution.

### Records and relationships

**Shared calendar and clock bounds (source-only, 2026-10-12).** Monthly readers
that accept December9999 reuse `CalendarMonthBounds.FromStart` with a normalized
first-day midnight. It returns inclusive month end without constructing year10000;
ordinary lower maximum-year contracts remain unchanged. Clock writers reuse
`ClockTimePolicy.IsValid` for nullable values in `[00:00,24:00)`; it establishes no
overnight or punch-order policy. A minute-only editor preserving unchanged
seconds is a feature transport decision, not permission to truncate stored values.
Consumers: Staff Duty/OT and Attendance. Database/runtime verification pending.

| Case | Expected |
|---|---|
| Valid create, valid update | Succeeds |
| Update a missing id | Business failure, no disclosure |
| Update a soft-deleted row | Not found — the repository filters it |
| Update a row from another tenant | Not found, and the response does not reveal that it exists |
| Duplicate on create | Rejected |
| Duplicate on update, unchanged row | **Accepted** — the self-exclusion works |
| FK that does not exist | Rejected |
| FK that exists in another tenant | Rejected, and treated identically to not existing |
| FK that is inactive | Rejected where inactive rows are not selectable |
| Optional FK omitted vs sent as `0` | Omitted is fine; `0` is invalid, not "none" |
| Dependent pair mismatched, e.g. Role not in the given Department | Rejected |
| Self-reference, `ParentId == Id` | Rejected |
| Longer hierarchy cycle A→B→C→A | Rejected |
| Child collection omitted vs empty | Documented and different only if intended |
| Child id belonging to another parent | Rejected |
| Duplicate rows inside one child collection | Rejected or merged, per the documented rule |
| Delete with no references | Succeeds, soft delete applied |
| Delete after another request changes unrelated fields | Only IsDeleted/DeletedBy/DeletedAt are written; the other request's values remain (shared HandleAudit, block 8) |
| Pending scalar edits followed by Remove on the same row | Delete writes its three fields only; original concurrency values preserved, other tracked entities' edits retained (block 8) |
| Delete with each blocking reference | Blocked with a message naming that blocker |
| Delete a row already soft-deleted | Idempotent or a clear failure, not an exception |

### Operational

| Case | Expected |
|---|---|
| Page 1, last page, page past the end | Empty list, not an error |
| `pageSize=0` or a huge `pageSize` | Clamped, per block 9 |
| Zero results | `IsSuccess = true` with an empty list — an empty result is not a failure |
| `TotalCount` on a partial last page | Exact, never derived from `TotalPages × PageSize` |
| Filter key with the wrong casing | Matched case-insensitively — block 9 |
| Malformed filter value | Treated as absent, never as a different filter |
| Duplicate submit of the same create | Blocked by the duplicate rule and by a unique index |
| Two concurrent updates to one row | Behaviour known and documented; last-write-wins is a decision, not an accident |
| Failure between parent save and child save | Transaction rolls both back |
| Failure after the document saves but before the voucher | Transaction rolls back the document too — pattern 15 |
| Bulk activate where some ids are missing | Whole call fails; nothing is flipped — block 12 |
| Unauthenticated request | 401 before any service code runs |
| Ordinary tenant read/write reached with an invalid subscription claim | 401/FailToAuth before repository work or tenant persistence; no tenant-0 fallback |
| Report reached with no subscription claim | Returns nothing — `QueryReport` fails closed, block 17 |
| Export whose second page fails | Whole export fails; no partial file |
| Upload with a wrong extension, oversized, or a spoofed MIME | Rejected server-side, not only in the client |
| Empty lookup for a dropdown | Success with an empty list — block 10 |

### The response contract

| Case | Expected |
|---|---|
| Business failure | `IsSuccess = false` with an actionable localized message |
| Not found, or another tenant's row | Same response shape; no existence disclosure |
| Unexpected exception | Logged internally; a safe message returned |
| Any failure | No stack trace, SQL, connection string, token or file path in the response |
| Partial write | Never reported as success |

### Removing or renaming a member

A change that removes or renames an entity property, a ViewModel/DTO member, a
service or interface method, or a whole type is not finished until every
consumer compiles against it. Why: a consumer outside the feature folder (for example a
conversion that builds the entity in another service) still sets the old member and the
project fails to build (`CS0117`).

In the same change:

1. Search the whole backend for the removed name as a **symbol**, not only in
   the feature folder: object initializers (`new Job { ApprovalStatus = … }`),
   LINQ predicates and projections, AutoMapper `ForMember`, EF configuration,
   other services that create or read the entity (conversions such as estimate
   → job, reports, resolvers), controllers, and seed data. The search is
   targeted at the removed symbol; it is not a full-solution review.
2. Tell apart same-named members of **other** types (for example
   `JobEstimation.ApprovalStatus` stays) by reading each hit, not by counting hits.
3. Remove or adapt every hit that belongs to the removed member, and list them in
   the report.
4. When the removed property was persisted, the report tells the owner to run
   `Add-Migration` with a suggested name (Master block 7); the snapshot still
   holds the column until then.
5. Search the **Angular app** too when the member was part of an API contract:
   models, services and endpoints, list columns, filters, row-action
   visibility, editor lock or read-only checks, export mappings and
   translations. The compiler does not catch these. A check on a field the API
   no longer returns reads `undefined` and fails silently: row actions disappear,
   an editor opens locked, and buttons call deleted endpoints.

**Adding a member to a combined projection.** When one DTO is projected from
several sources and joined with `Concat`/`Union` (for example the Jobs grid:
`Job` rows + `LubricationJob` rows into `JobGridRowDto`), a member added to one
projection must be assigned in **every** projection, with a typed `null` when a
source has no value (`Status = (Status?)null`). It compiles either way; EF fails
only at run time with *"Unable to translate set operations when both sides don't
assign values to the same properties"*. When adding a member,
search the service for other projections of the same DTO.

**Reading a build error list after such a change.** A project that fails to
compile leaves its downstream projects building against the last good reference
assembly. A downstream error such as `CS1061 'ILabourRateService' does not
contain a definition for 'GetTariffAsync'` for a member that exists in source
is then a cascade, not a second defect. Fix the first failing upstream project
(`SiGma.Helpers` → `SiGma.ViewModels`, `SiGma.DataAccess`, `SiGma.Repos` →
`SiGma.Business` → `SiGma.ServerAPI`, per the `ProjectReference` entries),
rebuild, and only then read the downstream errors.

Before changing every downstream consumer, group diagnostics by project and
error code. For `CS0246` on a new type, locate its declaration and confirm an
explicit `using`/fully qualified name or a global using **in the referencing
project**. A successful source search for a member does not prove its containing
assembly compiled. Owner evidence on 2026-10-21: four unresolved `Currency`
types in `SiGma.Helpers` produced dependent `CS1061`/`CS0117` messages for
financial-document currency members in DataAccess and Business. Source-only
repair of the namespace does not prove that the owner's rebuild will clear
every dependent diagnostic; inspect the fresh error list afterward.

**Check:** every applicable row exercised or explicitly marked not applicable ·
boundary values tested at the boundary, not near it · cross-tenant cases behave
identically to not-found · every "documented" decision is actually written down
in the feature's notes or this book.

---
