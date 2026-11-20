<!-- Part of backend block 18: see ../18-edge-cases.md. Same status and authority as the block. -->

### Generic audit metadata capture
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

#### Reusing the document action log for another model
**Unified approval adoption.** Save a new document
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

**Document-cycle review sequence.** For purchasing or another
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

**Type-directed downstream creation.** A source document's
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
