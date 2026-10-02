## 18. Edge cases

> **Status: Canonical**

Walk this list before calling an entity finished. Mark a row not applicable
rather than skipping it silently.

### Tenant ownership

`SubscriptionId` is server-owned. `SiGmaDbContext.SaveChangesAsync` stamps it
from the authenticated claim on insert and throws `InvalidOperationException`
if an existing row's value changes. Never assign it in a service, a child loop,
or a mapping (`item.SubscriptionId = entity.SubscriptionId` is wrong), and never
accept it from a payload.

### Input

| Case | Expected |
|---|---|
| Required string `null`, `""`, or `"   "` | Rejected. `[Required]` alone does not reject whitespace — trim in the service |
| String at and over max length | Accepted at the limit, rejected above it, and the limit matches `HasMaxLength` |
| Number at min, at max, out of range | Boundaries accepted, outside rejected |
| Decimal with more scale than the column | Rounded deliberately, not truncated by chance |
| Negative amount or quantity | Rejected unless the business allows it |
| Enum sent as an undefined number | Rejected via `Enum.IsDefined`; never silently mapped to the default member |
| Nullable enum omitted | Distinct from an invalid value |
| Date `0001-01-01` or `DateTime.MinValue` | Rejected when a real date is required |
| Reversed range, `from > to` | Rejected |
| Equal boundaries, `from == to` | Explicitly allowed or rejected, documented |
| Date-only value near midnight | Calendar date preserved; no UTC conversion. See UI block 17 |
| Leap day, month end | Accepted |
| Duplicate value differing only by case or spacing | Matches the documented normalization rule |

### Records and relationships

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

**Check:** every applicable row exercised or explicitly marked not applicable ·
boundary values tested at the boundary, not near it · cross-tenant cases behave
identically to not-found · every "documented" decision is actually written down
in the feature's notes or this book.

---

