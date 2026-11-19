# Purchasing progress and invoice coverage

Source-confirmed corrective addendum: pending GRN report must select only Approved orders, matching the receipt creation picker. Voided Bills release receipt reservation; they must also be excluded consistently from the GRN operational Void guard/list/detail CanVoid. Historical references still block Edit/Delete. Return draft deletion must use existing owned-child deletion instead of leaving live detail rows; no posted document becomes deletable and existing state/concurrency guards remain. These are demonstrated cross-path corrections, not new financial effects. View permission catalog markers are metadata only; endpoint source validation and inherited authentication are actual controls.

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-24 |

Later owner-approved amendment2026-10-24: GeneralPO/JobPO now bill directly via
precise BillDetail.PurchaseOrderDetailId; Stock/Asset retain the GRN path.
PURCHASE_ORDER_DOWNSTREAM_CREATION_DOMAIN_API_CONTRACT_FREEZE.md supersedes
the General/Job NotApplicable/manual-flag scope below, with actual derived
coverage and pending reservations for all supported types. Earlier decisions
remain historical evidence, not current guidance for those amended readers.

Confirmed compatible slice: PR quantity consumption and PO effective receipt usage remain their existing line-based states. Add a distinct read-only `billingStatus` enum: NotApplicable0, NotInvoiced1, PartiallyInvoiced2, Invoiced3, NeedsReview4; `hasDraftBillReservation:boolean` independently reports saved live nonvoid pending Bill references. Only approved Bills count as invoiced, per owner's explicit answer. Unknown approval legacy Bills are NeedsReview; never silently approved. Rejected/void/deleted Bills do not count as invoice or draft reservation; unknown legacy references conservatively block capacity until review. Existing Bill writer currently reserves an entire GRN; intra-GRN split is a separate pending owner decision and is not inferred from line description/amount. No source line FK or migration introduced in this slice.

PO Stock/Asset coverage is quantity per positive PO line, via effective approved-or-established-legacy nonvoid GRN lines linked to the actual PO detail, whose receipt has an approved nonvoid live Bill. None→NotInvoiced; some→PartiallyInvoiced; every line covered→Invoiced. No adding unlike units or averaging monetary values to decide completion. PO receipt NeedsReview/NoQuantity propagates NeedsReview, Workshop without real receipt source is NotApplicable. Existing legacy BillStatus is not evidence of coverage and stays persisted only for backward guard compatibility; manual toggle becomes rejected for receipt-backed Stock/Asset POs so future display cannot be manually falsified. Existing source/approval/period/financial guards remain in force.

GRN coverage uses full-receipt snapshot invariant: no approved Bill→NotInvoiced; one approved Bill→Invoiced; multiple conflicting references, unknown approval or ineffective receipt→NeedsReview/NotApplicable. No partial invoice claim for a single GRN without a precise source-line contract. Draft reservation is shown separately and is not an invoice. New read fields in PO/GRN list VMs, corresponding typed Angular DTOs and status columns; generic grid numeric/boolean filters must be computed in SQL before count/page/export through the same projection. Dedicated status filters must use that projection. No client-editable billing status, no extra persisted status flag, no financial journal changes or automatic state writes on GET.

Existing generic PO BillStatus filter/column should show derived billingStatus instead (stable new enum field/key; old stored property remains API compatibility only). No new percent field needed. Actual UI grid columns include billingStatus and hasDraftBillReservation; DTOs contain those fields. Root owns shared projection/new helper queries, PO/GRN integration after backend/UI log workers finish their owned files, UI translations/guides. Projection logic is one owner reused by ordinary rendering and grid filtering; no page-local status filter. Schema unchanged, owner compilation/runtime pending.
