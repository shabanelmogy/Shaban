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
`reviews/Archive/Completed/2026-10-23/AUDIT_TRAIL_FULL_STACK_CONTRACT_FREEZE.md`. Preserve the current
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

The owner's 2026-10-22 document-log decision supersedes the earlier metadata-only
capture boundary: retain identity/actor/type/action/number/date and add a bounded
reason plus a JSON snapshot of persisted scalar fields. For tracked modifications,
include a before value only when the source has a proven database-original
snapshot; a disconnected update with no reliable original shows the submitted
after value without inventing history. The current `CaptureChanges` implementation
still tests original/current inequality, which does not itself prove original
provenance for detached writes. Review and correct that implementation before
claiming before-value accuracy for every document. Creation/deletion capture
scalar after/before values. Never traverse navigation graphs, and redact secrets, credentials,
tokens, card security fields and private keys; omit oversized/unsupported values.
The caller may annotate a tracked business entity with a semantic action and
reason before its one SaveChanges. The interceptor infers an approval transition
or void only from a genuinely changed tracked state field when no explicit
annotation exists. Ordinary writes remain Created/Modified/Deleted. The shared
record-log reader stays tenant-scoped and feature endpoints retain their own
view permission and identity check. Existing metadata-only rows remain valid;
do not fabricate their missing details. This capture still excludes direct SQL,
bulk updates, and writes outside the tracked tenant DbContext.

#### Reusing the document action log for another model (owner decision 2026-10-22)

**Unified approval adoption (owner2026-10-24; Master4/UI7).** Save a new document
as Pending. Only Pending→Approved/Rejected and guarded Approved→Pending are
legal; Rejected is terminal, with no direct Approved→Rejected shortcut. Keep the
existing enum values and use one typed decision payload (status, optional reason)
per model. Reject and UnApprove require a trimmed reason1..500. Persist append-only
previous/new state, actor, time and reason; do not invent old reasons. The approval
read context provides identical canApprove/canUnapprove/canReject to the saved
tab and status dialog. Writers recheck under their model's source/financial lock,
reject stale/legacy/voided states, and never use a display flag as authorization.
UnApprove removes the real owned effect atomically: source-only documents check
downstream references; stock documents prove stock removal and linked issue guards;
financial documents validate owned unshared journals, allocation/payment/loan
dependencies and original open fiscal period before unposting. Preserve journal
identity/history, rebuild only at explicit reapproval, and keep reservations per
their frozen owner. Pending Save does not post or silently regenerate an old
journal. The concrete first rollout is PR/PO/GRN/Bill/PurchaseReturn in
PURCHASING_UNIFIED_APPROVAL_DOMAIN_API_CONTRACT_FREEZE.md; models without a frozen
approval lifecycle do not gain an endpoint or placeholder journal by imitation.

**Document-cycle review sequence (owner2026-10-24).** For purchasing or another
linked document cycle, inventory every source/converter/downstream writer before
changing state or adding Log. Record approval, quantity use, invoicing,
reservation and financial settlement as separate axes. Quantity Open means no
effective use, Partially Used means some but not all positive source-line
capacities used, and Closed means every such line consumed; zero quantity and
ambiguous legacy identity have explicit non-success states. Do not aggregate
unlike units or infer quantity completion from invoice value. Invoicing uses
approved effective invoice quantities against precise source-line identities;
pending invoice quantities reserve capacity but do not count as invoiced.
Recheck total approved plus pending reservations under the same writer lock,
excluding the current document when updating. Delete/Reject/Void and UnApprove
follow the model's existing guards; returning an invoice to Pending retains its
reservation. No manual flag or read-time write substitutes for actual coverage.

**Type-directed downstream creation (owner2026-10-24).** A source document's
Create Receipt/Create Invoice action is backed by a saved source-line key,
not a browser copy of amounts/descriptions. Keep the source's downstream
eligibility and each destination's draft/read/preview/write/approve validators
consistent. Destination writes re-resolve live source ownership, type, approved
state, supplier/defined branch/effective currency, immutable snapshots and
remaining quantity under the existing capacity lock. Pending destinations
reserve, approved destinations consume, rejected/voided/deleted release per
their frozen lifecycle. Source edit/delete/unapprove/reject guards must include
all retained downstream paths before releasing upstream reservations.
Partial editing can change selected lines within the same immutable parent;
existing line IDs cannot be rebound to another source key. Unknown/malformed
retained links block capacity rather than silently freeing it. No placeholder
stock/journal effect or manual completion toggle. The concrete PO mapping is
Stock/Asset→GRN→Bill and General/Job→direct GeneralBill; exact DTOs and guards
live in PURCHASE_ORDER_DOWNSTREAM_CREATION_DOMAIN_API_CONTRACT_FREEZE.md.

For each transition trace tenant/branch/currency, parent and child ownership,
tax and rounding, approval/unapproval/rejection, deletion/void, posting period,
stock/asset/Job/requisition effects, payment/allocation/loan dependencies and
report/filter/count/export readers. Review tracked versus bulk/external audit
capture and source-owned journal/stock identity. Log reads expose only the
validated document and explicitly owned related records; log adoption does not
authorize a state transition or manufacture pre-capture history. Document
source-only evidence, known gaps and owner runtime checks separately. Exact
model state graphs and source granularity remain feature contracts; do not
apply purchasing's journal/physical-return behavior to unrelated documents.
Current implementation evidence: purchasing log/status/source-line handoffs in
reviews/PURCHASING_*2026_10_24* and PURCHASING_PARTIAL_GRN_BILLING_DOMAIN_API_CONTRACT_FREEZE.md.

Treat automatic write capture and business transitions as separate contracts.
The configured interceptor records a successful tracked `EntityBase` create,
modified scalar write, or delete in the source `SaveChanges` batch. A failed,
canceled, or rolled-back save must leave no event. It does not make approval,
rejection, return-to-pending, or void legal. Freeze the model's state graph,
downstream dependencies, reason requirement, effect timing, period/financial or
stock guards, and legacy rows first (Master block 4; BE14/15). The backend
rechecks them during each transition; an action menu is not a guard.

For a domain action, annotate the tracked root with a stable semantic action
name and optional validated reason in `AuditTrailActionContext` before the same
save. Clear the annotation on completion/failure; do not insert a second audit
record or commit the log independently. Automatic inference currently recognizes
only a changed `ApprovalStatus`/`ApprovedStatus` as `ApprovalChanged` and a
false-to-true `IsVoided` as `Voided`; other status fields remain `Modified`
without an explicit action. A true soft-delete write is `Deleted`. The log
describes the performed write and never substitutes for the model's decision
history, voucher, inventory movement, or approval eligibility.

The feature read endpoint first resolves a live, tenant-owned source document
and applies its view-access contract. Pass its stable CLR record type and GUID
to the tenant-scoped `AuditTrailService.GetRecordAsync`. For an aggregate, pass
only verified child GUIDs owned by that root, including retained soft-deleted
children when their history belongs in the log. Never accept related GUIDs from
the browser. The central reader orders by descending event ID; older metadata-
only rows have no field detail. Decide which child, voucher, allocation, or
stock events actually belong to this document; do not show unrelated events
merely because the same workflow touched them.

| Adoption decision | Required evidence before exposing Log |
|---|---|
| Write inventory | Identify tracked saves versus SQL/bulk/external writers; list uncovered actions honestly. |
| Transition contract | Freeze legal states, dependencies, reason and side effects; annotate semantic writes where inference is insufficient. |
| Record identity | Prove tenant-owned root existence, stable type/GUID and every related child GUID, including deletion retention. |
| Read contract | Add a typed, authenticated, view-checked endpoint returning central rows; do not expose the generic stream as a public document selector. |
| Field detail | Keep scalar bounds/redaction and prove before-value provenance; never display a guessed prior value. |
| UI and help | Reuse UI block 7's read-only viewer, translations, empty/error/retry and document user guide. |
| Acceptance | Verify create/edit/delete/decision, child removal, failure/rollback/retry, tenant isolation and old rows after the owner applies the audit migration. |

The operational event is not
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
ToString, source paths and SQL. Numeric SQL provider Number/State/Class may be
included to identify the failure category without provider text. A composed read
may stamp a server-owned enum stage on a rethrown exception; the diagnostic owner
validates the exact enum type and defined value before rendering its name. Never
append arbitrary Exception.Data values or feature/request strings. Preserve the
original exception/stack and cancellation; markers must not suppress an error or
replace failure with empty data. Dashboard's24 sequential read stages are the
first consumer after a500 report whose safe30-frame stack omitted the service
and provider category. Source-only; the next owner reproduction must establish
the actual failing SQL code/stage before any root-cause claim.
An unexpected exception returns a safe localized
500 Result when the response has not started; otherwise preserve propagation.
Use explicit authenticated read-only controller/service contracts, lean
grid/detail projections and stable count-before-page/Id-tie/cutoff export.

Evidence: frozen `reviews/Archive/Completed/2026-10-23/ERROR_LOGS_FULL_STACK_CONTRACT_FREEZE.md`,
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

