# GRN purchase-order provenance in details only

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-24 |

Owner explicitly corrects GRN after the compact picker work: PURCHASE ORDER ID
is recorded in DETAIL only, not MASTER. Supersedes the GRN_MULTI_SOURCE contract's
header ID compatibility summary. PR-to-PO header policy is outside this amendment.

Root discovery: GoodsReceivedNote has PurchaseOrderId/navigation+FK/index; each
GoodsReceivedNoteDetail has PurchaseOrderDetailId only, and detail PO ID is currently
projected from that source line. Writes/approval and PO progress/reference readers
still contain header ID branches. UI form/DTO also carries header ID. This task
removes the header member across all directly affected owners, not only nulling
the request property. Existing LPONo remains optional manual free text, never a
new structured-source ID or persisted single-source summary for linked GRNs.

Frozen persistence/API: remove GoodsReceivedNote.PurchaseOrderId/PurchaseOrder,
header EF relation/index, and header Add/Update/Detail DTO property. Add nullable
GoodsReceivedNoteDetail.PurchaseOrderId + PurchaseOrder navigation/FK Restrict and
tenant/order index. Each linked line retains existing PurchaseOrderDetailId.
The server sets its PurchaseOrderId from the loaded live source detail and checks
saved row provenance consistency; manual lines have both IDs null. The client
continues sending only the selectable source-detail ID; no writable redundant PO
ID is needed. Input maps ignore server-owned detail PO ID/navigation. Detail read
DTO already contains PO ID/number; project from its stored detail reference with
source-detail fallback for retained rows whose new detail PO ID is not backfilled.
No property is added to ordinary client-editable VMs merely to duplicate a source.

GRN validation/approval/capacity/immutable saved source set/currency derive all
sources from line-level provenance. Preserve supplier/type/effective currency,
duplicate/whole quantity, actual stock/bill/approval guards and unique-write lock.
No linked GRN persists a header order ID or synthesizes a header LPONo summary.
List/advanced search/tax report show source membership/number/count from details;
manual LPONo display/fallback remains disjoint from structured source lines.
PO receipt status/quantities/billing/reservations/references and bill source label/
pending-stock readers use detail PO ID or its actual source-detail navigation,
never the removed header. A detail PO ID without a reliable source line is
historical ambiguous proof, not permission to invent or count quantities against
an arbitrary source line. Existing manual legacy number fallback remains scoped
and disjoint; never double count a linked row.

Angular removes header control, Add/Update/Detail property and related patch/
disable/fallback logic. Linked state and source reload derive from detail rows;
route/sourceChoice remains temporary navigation context, not persisted header.
Detail PO ID/number disabled form fields remain display/retry context. Main Save
retains per-line PurchaseOrderDetailId and excludes header purchaseOrderId.
Compact picker, retained choices, local Apply and main Save remain unchanged.

Ownership: GRN core worker owns GoodsReceivedNoteService, GRN/master+detail
entities/configs, header/detail VMs and GRN profilers. Adjacent reader worker owns
PurchaseOrderService receipt-only sections, BillService source-label read only,
StockReportsService receipt-source reads and PurchasingBillingProgressQuery if
needed. Root owns Angular, guide/books/skill/generated packets, integrations and
final whole-scope source audit. Do not overlap these files or revert peer/user work.

Required owner migration: MoveGrnPurchaseOrderReferenceToDetails. Must inspect/
preserve historical header provenance before dropping the column: backfill detail
PO IDs from reliable source-detail links; header-only ambiguous history needs
owner review or an explicit owner development reset. No automatic deletion or
guessing. Agents must NOT create/edit/run migrations/snapshots/database work.
No builds/tests/lint/runtime/browser/commits are authorized. No permissions,
journal, stock or approval timing change is authorized.
