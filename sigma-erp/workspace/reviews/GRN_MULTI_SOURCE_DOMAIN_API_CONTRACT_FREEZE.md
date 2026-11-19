# GRN multi-source contract

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-24 |

Supersedes GRN_CONTRACT_FREEZE single-order restriction per explicit owner request.
API: retain GET GoodsReceivedNote/purchase-orders (supplierId,grnType) and GET
purchase-order-draft/{id} (optional caller-owned excludeGrnId), POST/PUT unchanged.
Create/update source payload authority is each purchaseOrderDetailId. Header
purchaseOrderId is compatibility input, not authority over line source membership;
if supplied it must belong to the selected order set. Manual receipts have no
source IDs; reject mixed or duplicate IDs, invalid/nonapproved/deleted/wrong-
supplier/type orders, mismatching effective currencies, and quantities beyond
current available capacity. Resolve prices/items/UOM/tax server-side as before.
For derived one-order receipt retain header ID/no; for multiple use null ID/no.
No schema additions. Edit cannot switch the source of a retained saved row or
add a source order not belonging to that saved receipt; deletion/subsets allowed
under existing reference guards. Approval revalidates all sources under existing
tenant PurchaseRequest write lock. Existing default currency resolver remains
server-owned. Authoritative capacity is live approved (or legacy-null) nonvoid
receipt lines, never pending/rejected/deleted; legacy ambiguous guards preserved.

Extend GrnDetailDetailVm (actual named DTO file GoodsReceivedNoteDetailDetailVm.cs)
with nullable int PurchaseOrderId and string PurchaseOrderNo; map from live
PurchaseOrderDetail->PurchaseOrder. Frontend GoodsReceivedNoteDetailDetailsDTO
adds nullable purchaseOrderId,purchaseOrderNo. Picker uses current draft shape;
its adapter retains the full source line plus owning draft and selected quantity.
No new endpoint/DI/permission shape. Draft exclusion recognizes actual source
line membership rather than single header ID only.

PO/progress/reference readers use PurchaseOrderDetail.PurchaseOrderId whenever
source line FK exists; retain explicit fallback/ambiguity only for old receipts
without valid line links. Cover use/receipt progress, billing/draft reservations,
create eligibility, deletion/unapproval/close and log readers in direct scope.
Billing remains tied to the particular receipt line; count its actual source PO.

UI: new shared source picker uses existing EditorDialog/DataTable/quantity owners;
no new palette/state library. Optional preselected PO, order list, fresh selected
order lines with ordered/received/remaining and editable selected quantities.
Retain picks across orders, enforce positive whole quantities<=remaining and
consistent supplier/type/currency before Apply. Cancel changes no parent state;
explicit Apply replaces receipt rows only after existing dirty replace consent.
No-load-selected opens the picker; selected opens that order. Route create-from-
PO opens that PO in picker rather than accepting all lines. New source selection
only on create; saved provenance remains visible in details and print.

Layout: one row with source at logical start and Add at logical end; no source
error or validation overlay on controls. On narrow widths controls shrink; full
labels remain accessible. Errors/Retry in their own region. Root completes guide,
canonical shared behavior and skill update; regenerate/check packets.


## Integration contract amendment — 2026-10-24

Read coverage: list and tax-report DTOs add integer SourceOrderCount; multi-source
rows display a translated count instead of an empty LPO. The existing advanced
LPO-number filter matches actual live source-order numbers as well as legacy
header text. That many-source display column disables its generic scalar column
filter; sorting retains the existing header LPONo order. Details/print expose
all source numbers via per-line provenance; no fabricated concatenation in the
50-character persisted header. Existing general search columns are unchanged.
Shared picker adds applyPending/applyError to retain parent dirty-consent and
validation ownership without hiding errors behind the modal.
