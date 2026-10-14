## 18. Edge cases

> **Status: Canonical**

Walk this list before calling an entity finished. Mark a row not applicable
rather than skipping it silently.

### Correction-record input policy (source-only, 2026-10-14)

The two Data Entry Correction services reuse the internal static
`Services/HelperServices/CorrectionInputPolicy` for their common write-VM
DataAnnotations, distinct positive SLA IDs, complete current eligibility checks
and tenant/folder/GUID/extension stored-path checks. Unchanged historical ID sets
and saved paths remain compatible; changed selections must be wholly eligible.
This is a domain-family validator, not a new service interface or DI data carrier.
Each service still owns tracked writes and request metadata. Their batch writers
validate every item before mutation and save once, preserving the same invariants
as single writes; inherited generic batches must not bypass domain validation.
The 10,000-character request cap leaves historical unconstrained storage intact
instead of shrinking a column without data evidence. That compatibility choice
belongs to the correction feature contract. Owner migration/build/runtime and
shared abandoned-upload expiry verification remain pending.

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

### Metadata-only AI candidate contracts (2026-10-13)

JSON output mode ensures JSON syntax, not adherence to a form's field contract.
For shared mock-data assistance, construct the prompt schema and example from
the actual requested field keys and primitive types. Opaque choice tokens remain
strings even when numeric-looking; all keys are required in the output object,
while optional field values may be null. Generic unrelated example keys/tokens
create avoidable ambiguity. Server validation still owns exact key completeness,
types, bounds and allowed choices; a prompt schema is guidance, not enforcement.

`MockDataService` is the verified source consumer after owner reports HTTP400
InvalidProviderResponse in IndividualPartner and Companies. The exact rejected
provider response was not supplied, so the original field-level cause is not
proven. One repair request is allowed after invalid JSON/envelope/candidates,
using fixed rejection codes and requested keys only. Both attempts share the
original45-second deadline/cancellation and response cap. HTTP/auth failures
are not retried; no partial output or local deterministic fallback is applied.
Diagnostics may expose bounded sanitized requested field identifiers, never
provider bodies, generated values or API credentials. Source-only conformance;
actual replay remains owner acceptance. Storage/privacy/Save contracts stay
with their existing owners and frozen feature amendments.

Owner explicitly extends synthetic generation to Card Number/CVV (2026-10-13).
Frontend marks native card inputs and sends canonical text names/lengths16/3,
never current card values. For these exact text names, MockDataService schema
adds ASCII digit pattern, example uses digit-only strings, and prompt preserves
string serialization/leading zeros. Strict ValidValue checks digits plus the
supplied bounds; invalid text follows the existing one bounded repair/all-or-
nothing rejection. No new DTO/endpoint/EF field or business input validator.
Treat these as synthetic form values, not verification of payment eligibility.

| Case | Expected |
|---|---|
| Required string `null`, `""`, or `"   "` | Rejected. `[Required]` alone does not reject whitespace — trim in the service |
| String at and over max length | Accepted at the limit, rejected above it, and the limit matches `HasMaxLength` |
| Number at min, at max, out of range | Boundaries accepted, outside rejected |
| Decimal with more scale than the column | Explicit input policy rejects excess precision or domain calculation rounds deliberately; never implicit storage rounding |
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

### Generic audit metadata capture (owner request, 2026-10-14)

The owner requested a reusable service for all entities and a backend interceptor
for the Audit Trail screen. The frozen full-stack contract is
`reviews/AUDIT_TRAIL_FULL_STACK_CONTRACT_FREEZE.md`. Preserve the current
`SiGmaDbContext.HandleAudit` tenant/creation/soft-delete owner; the configured
`AuditTrailSaveChangesInterceptor` calls the generic capture service for tracked
`EntityBase` entries and stages standalone metadata events in the **same** save
batch. No nested SaveChanges or separate commit is needed: source No/GUID are
available before a generated database ID. Use EF's pending write flags, not
original/current value equality: disconnected Update/UpdateRange entries do not
have database-original values, so comparing them discards actual UPDATE writes.
A Modified entry with scalar IsModified flags is recorded as Modified; an
IsDeleted property marked for writing true is recorded as Deleted, including
after HandleAudit converts Remove to field-only soft deletion. Physical Deleted
entries remain Deleted. Unchanged tracked saves are excluded; an explicitly
forced UPDATE or repeated true deletion-marker write is a write event even when
the database value is unchanged. Do not add a database read or rewrite EF
OriginalValues just to classify metadata. This corrects the initial transition/
value-comparison rule following the owner's missing Update/Delete report
(2026-10-14). Failed/canceled saves
detach staged events before retry; success detaches only events and preserves
the existing business affected-count result. Caller transactions and
acceptAllChangesOnSuccess retain their owners.

Capture only the frozen event identity/actor/type/action/number/date metadata,
not field-value snapshots or navigation graphs. The operational event is not
generic mutable CRUD `EntityBase`: no mutation/deletion API or source FK,
so source soft deletion cannot remove history. Read with `QueryReport<T>()`
for tenant scoping. The NameIdentifier claim remains the existing subscription
contract, not a user ID; historical actors come from captured Name claims.
Never fabricate a missing source number/date from an event timestamp or a
temporary key. Global entities, unconfigured contexts, direct SQL/bulk writes
and separate authentication are outside this tracked-save boundary. Do not
claim universal coverage or reconstruct pre-deployment history.

This metadata owner must not impose a new length bound on an existing unbounded
source No or actor claim: explicitly select nvarchar(max), without truncation
or an indexed max column. BE2's ordinary client-owned string/VM bound rule still
applies elsewhere. Stable CLR/action names keep their declared bounds. This is
the source-supported compatibility exception from the frozen generic-capture
decision, not a rule to make ordinary business inputs unbounded.

Audit Trail uses count-before-page, stable Id ties and a tenant event-ID cutoff
shared by applied paging and full Excel. New events require a new Search;
later-page failure aborts output. The cutoff excludes ordinary later inserts,
but does not claim database snapshot isolation for concurrent transactions.
Deploy the owner-generated event-table migration before enabling the
interceptor. Source conformance leaves owner build/save/rollback/retry/transaction
acceptance pending.

### Outbound message outcomes (2026-10-14)

An operational message log is an append-only event, not a mutable CRUD entity.
Keep its read controller authenticated and its query on the existing
`Repository.QueryReport` tenant boundary. Use a lean row contract, filter before
count/page, stable Id ties and an event-ID cutoff for applied paging/full outputs.
The cutoff excludes ordinary later inserts; it is not database snapshot isolation.
An explicitly frozen strict operational read may reject malformed supplied
date/enum/sort/paging values instead of widening the query. Use FilterHelper for
optional raw values; the feature owns exact date grammar and strict validation.

When two real email producers share the same SMTP helper, reuse the shared
`IMessageDeliveryService`/`MessageDeliveryService` transport/outcome owner.
Its typed internal request carries actual message/SMTP inputs and is never a
public client-write payload. Validate normalized actual From/To and subject
against the event's storage bounds before sending. Record those same values;
do not truncate the address or subject actually sent. An optional contact-name
snapshot may be bounded explicitly; missing context/CC stays empty. Never persist
message bodies, credentials, provider exception text or fabricated recipient names.

Check cancellation before starting a new attempt. Once transport completes,
append its accepted/failed result independently of request cancellation in an
isolated scope, so event recording cannot save another caller's tracked changes.
Derive tenant only from authenticated server context and validate the isolated
scope's tenant. Persist a stable safe translation key for failure text, so display
and export follow the reader's current language. Internally log append failure
without emitting provider/credential diagnostics to the user.

SMTP acceptance is authoritative for the transport outcome, not proof of final
inbox receipt. A later event-write failure must not reclassify an accepted send,
retry it, or imply that no email went out. Report accepted-but-log-unavailable
separately from rejected-and-log-unavailable. In a partial batch, retain each
outcome and disclose earlier accepted count; no automatic resend. A simulation
is not delivery evidence and creates no Delivered log. New history begins with
future recorded attempts; deploy the owner-generated migration first.

Source consumers: SMTP test and Fleet service reminders. CC is nullable for the
existing grid but current transport has no CC input; no CC delivery is claimed.
Source-only conformance leaves build, real SMTP, cancellation/partial outcomes,
tenant isolation, log-failure recovery and print/Excel acceptance with the owner.

### Automatic HTTP error history (2026-10-14)

When the owner requests automatic HTTP error history, keep its append-only
operational entity separate from mutable CRUD and successful-save audit events.
Capture only authenticated requests with the existing positive subscription
claim, and scope reads with `QueryReport<T>()`. A middleware owner may capture
unexpected exceptions and returned5xx once; known business/conflict exceptions
retain their existing response owner, aborted requests and the log reader's
own endpoints are excluded. Background/global work and pre-deployment history
are outside this boundary; do not claim universal capture.

Never save the failed request's tracked business graph. Use a fresh DI scope
and context, suppress ambient business-transaction enlistment, apply a bounded
timeout and perform one append save using EF's implicit transaction. Persistence
failure must preserve the original response/error; fallback logging contains
type-only metadata, without the exception object. Suppression creates no new
business transaction and does not change the caller's commit/rollback owner.

Store bounded actor/controller/action/connection/browser metadata, UTC time
and backend Stopwatch duration. No trusted client-name source means null.
Request context contains method, route **template**, status and trace reference,
never actual route/query/body values, credentials or cookies. Diagnostic text
may include exception type and method identities, excluding raw Message,
ToString, source paths and SQL. An unexpected exception returns a safe localized
500 Result when the response has not started; otherwise preserve propagation.
Use explicit authenticated read-only controller/service contracts, lean
grid/detail projections and stable count-before-page/Id-tie/cutoff export.

Evidence: frozen `reviews/ERROR_LOGS_FULL_STACK_CONTRACT_FREEZE.md`,
`ErrorLogsMiddleware`, `ErrorLogWriter`, `ErrorLogEntry` and `ErrorLogsService`.
New tables require owner-generated migrations before activation. Source-only;
owner build/tenant/exception/cancellation/store-failure acceptance remains pending.

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

