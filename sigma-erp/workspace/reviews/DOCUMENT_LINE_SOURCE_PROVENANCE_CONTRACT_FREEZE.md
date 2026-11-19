# Detail-only conversion provenance across document cycles

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-24 |

Owner explicitly requires PO PurchaseRequestId in details only, and generalizes
the GRN correction across purchasing and analogous document-line conversions.
Supersedes PO header compatibility identity in
PURCHASE_REQUEST_PO_MULTI_SOURCE_CONTRACT_FREEZE.md. Existing source policies,
single/multiple selection eligibility, quantity/discount/approval/accounting and
stock timing remain unchanged. Generalization does not invent a conversion flow
or turn document-wide contract/journal/loan relationships into line provenance.

## Frozen PO implementation handoff

Remove PurchaseOrder.PurchaseRequestId/PurchaseRequest, header EF relation/index,
header detail DTO ID/number and Angular header read/fallback. Add nullable
PurchaseOrderDetail.PurchaseRequestId/PurchaseRequest with Restrict FK and tenant
index beside existing PurchaseRequestDetailId. Server derives/validates the pair
from live tenant source lines; manual lines both null. Ordinary editable DTOs do
not gain redundant source IDs; input maps explicitly ignore server-owned IDs/navs.
Existing single/multiple conversion commands remain supported and derive all
source identity from selected detail IDs. Source draft/command route IDs remain
transient source selection, never PO master storage.

Preserve persisted per-source allocated discount. Reservation/approval/update
must group actual reliable line membership, never removed header. Legacy null
discount-share fallback uses whole-order proof of exactly one source request,
all lines proven/consistent, no partial shares, and the existing header discount
amount once; never split a multi-source historical discount by guesswork.
Ambiguous stored request-only/mismatched pairs block related source capacity and
source mutation; do not silently treat them as manual. No invented source line.
PR references/progress/filter/dropdown, capacity and approve/delete/unapprove
readers derive from details and validate consistent source pairs. Preserve
existing public consumption status enum; ambiguous capacity is unavailable,
without inventing a new status or presenting it as authoritative quantity proof.

Ownership: core worker only PurchaseOrderService, PO master/detail entities and
configs, PO header/detail VMs/profilers. Reader worker only PurchaseRequestService
and its directly related read/reference policy files, no PO core edits. Root
owns Angular, other-cycle discovery/integration, books/skill/generated packets,
user guide and final review. No overlapping edits or unrelated dirty cleanup.

Owner migration recommendation: MovePurchaseRequestReferenceToOrderDetails;
preserve old header provenance and backfill reliable line pairs before dropping
the header column. Header-only history requires explicit owner review/reset;
no guessed associations or automatic deletion. No agent migration/snapshot/DB,
build/test/lint/runtime/browser/commit commands are authorized.

## Cross-cycle application boundary

Use detail source-line keys as authority for conversion/quantity/amount origin;
parent source IDs, when stored, are derived and validated by the server per row.
Display header summaries from details without persisted duplicate master keys.
The detail's own aggregate parent FK is ownership, not removable provenance.
Existing document-wide journal, payment-plan, contract, approval-history and
quotation association semantics remain unless they actually represent selected
source lines. No financial settlement or lifecycle change is implied.

Initial inventory: GRN detail source pair already conforms. Bill has no source
master FK; its GRN/detail and direct PO-detail refs are in BillDetail. Purchase
Return's financial source is SourceJournalVoucherDetailId in its details. Credit/
debit note allocation source IDs are already in details. ItemIssue currently
has header GRN/requisition references and requires tracing its existing item
conversion semantics before the analogous bounded handoff is frozen. Sales
order agreement and PO EquipmentQuotation associations require classification
as document context versus line conversion, not blind removal. Record discovery
evidence and source conformance in the accompanying review/impact map.

## Frozen requisition and issue amendment

Discovery proves both existing ItemRequisition action commands already select
RequisitionItemId. GRN approval creates issue items one-for-one from saved GRN
details. Therefore apply the same detail-only persistence without inventing a
new selection or allowing mixed-source documents.

Remove ItemIssue header GoodsReceivedNoteId/navigation and
ItemRequisitionId/navigation. Add nullable source pairs on ItemIssueItem:
GoodsReceivedNoteId/GoodsReceivedNoteDetailId and
ItemRequisitionId/ItemRequisitionItemId, with source navigations, Restrict FKs and
tenant indexes. Server-generated issue writers set pairs from their actual
selected/saved line. Manual issue inputs/maps cannot set/overwrite them. Keep
linked issues read-only, GRN-linked draft deletion blocked, and all current
approval/void/unapprove/reversal/stock/branch/job locks and timing unchanged.
New approval requires consistent live tenant source pairs and item identity;
no GRN/requisition mixture or new multi-requisition feature is introduced.

Remove PurchaseRequest header ItemRequisitionId/navigation. Add nullable
ItemRequisitionId/ItemRequisitionItemId pairs/navigations to PR details, set only
by the existing requisition conversion action from selected RequisitionItemId.
Source PR remains protected against ordinary edit; references/actions/lists
derive linked state from details. Preserve one live PR per requisition through
the existing tenant requisition unique-write boundary and action duplicate
check, replacing the removed header filtered unique index with detail reference
indexes; ordinary inputs cannot create source claims.

Root owns ItemRequisitionService and GoodsReceivedNoteService producer/readers,
PR/ItemIssue entities/configs/maps/read VMs as needed and Angular/guide/docs.
Issue worker owns ItemIssueService only. PR reader worker additionally replaces
PR header requisition checks in PurchaseRequestService only with detail Any
membership. Workers do not touch each other's owners. Root reviews all consumers.

Existing historical approved issue quantities remain attributed by their stored
source parent and ItemId under the existing unique-item requisition contract;
source-line keys are not guessed. New rows carry exact source-line keys and
approval validates them. Invalid source proof blocks new approval/capacity as
applicable, while live-reference checks recognize parent-only retained provenance.
No historical data mutation is run. Owner migration expands to include these
source pairs, reliable old-header/line backfill and dropped master FKs/indexes;
suggested combined name: MoveDocumentSourceReferencesToDetails.
