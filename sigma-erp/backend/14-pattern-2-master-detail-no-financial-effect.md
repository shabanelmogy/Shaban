## 14. Pattern 2 — Master-detail, no financial effect

**Topic files of this block** (read only the one the task needs; they are part of this block):

- [Owned rows on update](14/01-owned-rows-on-update.md)
- [Quotation domain-action specialization](14/02-quotation-domain-actions.md)
- [Explicit transaction boundary](14/03-explicit-transaction-boundary.md)

> **Status: Canonical** — reference `Services/VouchersServices/PurchaseOrderService.cs` (FK checks and delete fixed 2026-10-01)

A header plus detail rows, saved as one graph. No journal voucher, no
allocation.

**Order of work in Add and Update:**

1. require the business minimum number of details;
2. validate every header FK;
3. validate every **distinct** detail FK;
4. load the header with its details, tracked;
5. map, recalculate, save once.

```csharp
if (vm.PurchaseOrderDetails?.Any() != true)
    return Fail("At least one purchase order detail is required");

if (!await UnitOfWork.Repository.ExistsAsync<Supplier>(x => x.Id == vm.SupplierId))
    return Fail("Invalid Supplier");

if (!await UnitOfWork.Repository.ExistsAsync<Branch>(x => x.Id == vm.BranchId))
    return Fail("Invalid Branch");

if (vm.JobId.HasValue &&
    !await UnitOfWork.Repository.ExistsAsync<Job>(x => x.Id == vm.JobId))
    return Fail("Invalid Job");
```

Load the aggregate with its children **tracked**, so EF can reconcile:

```csharp
var entity = await UnitOfWork.Repository.Query<PurchaseOrder>(
        e => e.Id == vm.Id, null, true, false, e => e.PurchaseOrderDetails)
    .FirstOrDefaultAsync();

if (entity is null) return Fail("PurchaseOrder not found");

Mapper.Map(vm, entity);

foreach (var detail in entity.PurchaseOrderDetails)
    detail.Recalculate();               // totals are the domain's job

UnitOfWork.Repository.Update(entity);
await UnitOfWork.SaveChangesAsync();
```

**Totals are recalculated on the server.** Never persist a total the client sent.

**Detail-only conversion provenance (owner2026-10-24).** A conversion's selected
source belongs to its destination details, including a document with only one
source. Do not duplicate that source FK on the destination master as a persisted
summary. Store the actual source-line key; where a source parent ID is also
stored, derive and validate it on the server. Input mappings ignore server-owned
provenance. Derive header display summaries, usage/billing/report/reference
membership and linked/read-only flags from live details. Remove obsolete master
entity/config/DTO/form/query paths together. The detail's own aggregate parent FK
remains ownership, not conversion provenance. Document-wide agreement, journal,
loan or quotation context remains on the owning document when it does not select
or consume source lines; do not turn it into a fictional line conversion.
Validate same tenant/supplier/
type/effective currency, unique source lines, positive quantities and current
remaining capacity under the existing source write boundary. Resolve source
prices/items/UOM on the server. Editing a retained row cannot change its source
and cannot silently introduce a new source order outside the saved contract.
Preserve model-owned draft reservation/approval/void timing: pending GRNs remain
nonconsuming, approval revalidates and consumes; PO source capacity rules below
remain separate. This general rule supersedes the earlier GRN/PR-to-PO header
compatibility summary policy; it does not authorize new multi-source eligibility,
lifecycle or accounting behavior. Historical parent-only proof protects source
references; it cannot invent precise source-line quantities. A preserved legacy
quantity fallback needs its existing source-supported rule and disjoint scope.

**GRN detail-only order reference (owner2026-10-24).** GoodsReceivedNote has no
persisted PurchaseOrderId/navigation, including the single-order case. Each linked
GoodsReceivedNoteDetail stores nullable PurchaseOrderId and PurchaseOrderDetailId;
the server derives the former from its live source line, validates saved-pair
consistency and owns both fields' provenance. The redundant order ID is not an
extra client-editable input. Manual rows have both IDs null. Keep source field
mappings explicit; remove master DTO/form/save properties and all master FK/query
branches together. Detail read projections may fall back to reliable source-line
provenance for retained rows pending a reviewed backfill. GRN list/filter/report/
bill/PO-reference readers derive membership from its details; structured rows
without reliable line proof remain review cases and cannot be attributed to an
invented source line. Manual legacy LPONo text fallback is disjoint and applies
only to wholly unstructured receipts. Do not persist a linked header LPONo
summary; display one/multiple sources from details. Dropping the old header link
requires owner migration review and preservation of historical provenance before
the column is removed; do not create migrations, run data repair or reset a database
as part of source work.

**Purchasing and analogous stock adoption (owner2026-10-24).** PurchaseOrderDetail
stores PurchaseRequestId/PurchaseRequestDetailId, with no PR FK on PurchaseOrder.
PurchaseRequestDetail stores ItemRequisitionId/ItemRequisitionItemId, with no
requisition FK on PurchaseRequest. ItemIssueItem stores either the GRN/detail pair
or requisition/item pair, with no source FK on ItemIssue. Existing conversion
actions already know the selected source line; preserve it instead of discarding
its identity. Manual writers cannot attach source claims. Keep one live PR per
requisition under the existing requisition tenant write lock and duplicate check;
the former header unique index is replaced with detail lookup indexes. Linked
issues/PRs retain their edit/dependency rules, GRN-generated drafts retain their
void behavior and new issue approval validates all saved source pairs/item IDs.

Reference checks recognize both stored parent and actual source-line parent,
including malformed pairs, so neither source becomes mutable accidentally.
Capacity counts only consistent proof. The existing approved requisition
parent+ItemId historical policy remains when no source-line key exists; a present
but inconsistent source key blocks further capacity. Shared
ItemRequisitionSourceQuery owns this distinction for list/detail/actions and issue
approval. Source-only or mismatched rows protect both identifiable sources and
require review; do not attribute guessed quantities. This rule is reusable for
similar document-line flows, including BillDetail and financial allocation rows
that already conform. It does not remove document-wide associations.

**Compatible direct orders in supplier bills (owner2026-10-24).** BillDetail keeps
PurchaseOrderDetailId as its direct source; derive order identity from that line,
never add a master source FK. The approved purchasing contract combines several
General orders or several Job orders for the same supplier, effective currency
and selected bill branch (a null source branch may use it); never mix those types
or mix direct/manual/receipt lines. Both the operational eligible-order selector
and draft/save/preview/approval recheck eligibility and capacity. Editing preserves
retained line identity and permits only orders from the saved source set. Approved
bills invoice; pending bills reserve; rejected/voided/deleted bills release under
their existing lifecycle. Usage and SQL progress readers validate every retained
row of each touched bill and the complete compatible source set; another order
alone is not a mixed-source error. Aggregate quantity against each actual source
line without duplicating other orders' quantities. The direct selector uses the
existing Results<SelectListBaseVm> value/text contract and one batched usage read,
not cached reference choices or per-option detail requests. Bill's editable
discount retains its current policy: the initial suggestion sums each source's
proportional selected amount; this creates no new discount-consumption mechanism.
This adoption changes no physical Bill schema or financial posting lifecycle.

**Per-source discount attribution (owner2026-10-24).** An order combining requests
must retain each request's exact allocated discount independently of the order
header total. PR-to-PO persists nullable server-owned
`PurchaseOrderDetail.PurchaseRequestAllocatedDiscount` (decimal18,2); new source
writes allocate each request's rounded share deterministically over only that
request's order lines, with the final line taking the rounding residual. Header
Discount is the sum of those shares. Reservation readers group by actual source
line membership and sum its stored shares. A legacy header-discount fallback
requires the entire order to contain exactly one reliable source request, every
line linked consistently and every share null; count the saved monetary Discount
once. Mixed/partial shares or multiple unallocated sources block capacity rather
than fabricate historical attribution. Editing owned source rows rechecks every affected request under the
existing write lock and recalculates shares without mutating other saved orders.
A retained source identity/price cannot change; ordinary pending-order descriptions
remain editable under their existing contract. Removing all lines of one source
updates source membership from retained details only. Never infer
per-request historical discount by proportionally splitting a multi-source
header total; a persisted attribution needs an owner migration, not a client
input or an automatic historical repair.

**Source-use projection (owner 2026-10-22).** Purchase Request → Purchase Order
is the first reusable quantity-consumption example. Count only live source lines
with positive quantity and positive quantities on live PO lines under live POs
linked back to the same request/line; a saved Pending PO already consumes
source capacity, while a Rejected PO releases its quantity and allocated source
discount without deleting its historical link (owner correction 2026-10-22).
Deleting an eligible pending PO also releases capacity. Derive NoQuantity/Open/
PartiallyUsed/Closed per request on read, separate from approval and billing.
The display percentage is the arithmetic mean of each positive line's clamped
used/requested ratio, with 0 for Open, 100 for Closed, 0.01–99.99 for
PartiallyUsed after two-decimal rounding, and null for NoQuantity;
do not add different UOMs. Batch the line/usage read for the current page,
and expose the same read-only fields in saved details. Freeze a different
downstream linkage/denominator before applying this pattern to another model.

**Retained one-to-one identity and live navigation rows (2026-10-21).** A soft
delete retains the unique foreign-key slot. Editing an owned one-to-one reference
must reconcile the retained draft instance rather than soft-delete it and insert
another with the same unique parent FK. When the confirmed draft workflow can
turn that reference off and on, reuse the same slot only after proving that no
retained financial history forbids correction; never revive paid/revised source
history or hard-delete it to release the key. Explicitly reconcile its owned
rows and derived values through their domain owner. Bills' editable loan plan is
the source example; no schema change or automatic historical backfill is implied.

A repository filter on the query root does not prove that EF navigation Includes
exclude soft-deleted children. Live financial-state readers must exclude deleted
source rows and still validate every remaining row's tenant and shape. Historical
payment/link proof keeps its stricter retained-history rules. Bills' retained
journal rebuild after UnApprove/reapproval exposed this distinction; do not
remove historical rows or weaken cash proof to repair a live-source read.

**Detail references — every distinct id must exist.** `ExistsAsync(x => ids.Contains(x.Id))` is
true when *one* id exists, so an unknown id passes beside a real one. The reference validates
all detail references in one helper built on the base `AllExistAsync` (block 8):

```csharp
if (await InvalidDetailReferenceAsync(vm.PurchaseOrderDetails.Select(d =>
        (d.ItemId, d.AssetTypeId, d.VehicleId, d.UnitsOfMeasuresId, d.JobId))) is { } referenceError)
    return Fail(referenceError);
```

**Delete removes the details too.** `RemoveAsync` is overridden with
`RemoveWithChildrenAsync(id, ct, x => x.PurchaseOrderDetails)`, so the lines are soft-deleted with
the header and no report counts lines of a deleted document.

Also decide and document, per feature:

- nothing about omitted vs empty: the contract is a **full snapshot** (owner decision D4-3,
  2026-10-01). The client always sends the whole collection; a saved row carries its id, a new
  row has none, a missing row is removed, and an empty list clears the collection only when the
  business minimum allows zero rows. The base `UpdateAsync` still treats a `null` collection as
  "leave alone" for old clients; new and reviewed screens never send `null`;
- whether a detail id from the client is verified to belong to **this** parent
  and tenant before it is updated or removed;
- status transitions as explicit methods with legal source/target checks, as
  `ToggleApprovalStatusAsync` and `ToggleBillStatusAsync` do.
