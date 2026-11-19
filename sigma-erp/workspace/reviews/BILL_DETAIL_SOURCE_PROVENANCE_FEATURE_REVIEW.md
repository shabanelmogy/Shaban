# Bill source provenance conformance review

| Item | Value |
|---|---|
| Status | Closed |
| Owner verification pending | yes |
| Date | 2026-10-24 |
| Scope | Source-read-only answer to whether Bill conforms to detail-only conversion provenance |

Tier S bounded review, not a complete accounting/security/performance audit.
Applied Master1/5, BE14/15 and existing partial-GRN-billing/direct-PO contracts;
shared routed financial editor and existing BillService are the actual owners.
Initial generator Check passed all eight; no canonical change or packet refresh
needed. No screenshot, runtime evidence, source edits, builds/tests/lint/browser,
database, migration or commit operations. Owner continuation means finish this
review, not invent a new multi-PO billing feature.

| Concern | Source evidence | Finding |
|---|---|---|
| Master storage | Helpers/Models/Vouchers/Bill.cs | No source PurchaseOrderId or GoodsReceivedNoteId on Bill. JournalVoucherId/loan relationship remain document-wide effects, not line provenance |
| GRN source | BillDetail.cs, BillDetailConfig.cs; BillService.PrepareLinesAsync | Persisted GoodsReceivedNoteId + GoodsReceivedNoteDetailId only on details, Restrict FKs. Server loads source detail, checks optional submitted parent, then saves its actual parent/item/UOM/price metadata |
| Direct PO source | BillDetail.PurchaseOrderDetailId; BillService.PurchaseOrderSource.cs | Actual source line persisted on detail. Source PO parent is derived through that line; read mapper exposes parent ID/number per row. No redundant stored master PO FK required |
| Header selection array | BillAdd/UpdateVM.GoodsReceivedNoteIds; Angular buildPayload | Transient selection/set-consistency input, not an entity column or persisted master relationship. Angular rebuilds it from positive selected detail rows; server compares it to their actual parents |
| Partial capacity | ReceivedLineUsageAsync / DirectPurchaseOrderUsageAsync | Approved bills count as invoiced, pending bills reserve; current bill excluded on edit. Positive/unique selections and capacity checked per actual source detail. Broken/duplicate old links block further source use rather than guessing |
| Save/update/approve | BillService.PrepareLinesAsync and PrepareApprovalAsync | Shared preparation reused; approval rechecks source/quantity/currency and saved snapshot. Existing tenant write boundary remains; no new financial or stock timing implied |
| Frontend reload/save | Bill details hydration and buildPayload | Reload source identities from saved billDetails; map update IDs by source-line identity; payload sends selected detail keys/quantities. No persisted master source dependency found |
| Existing scope limitation | PrepareDirectPurchaseOrderLinesAsync + editor purchaseOrderDraft | Direct General/Job PO billing currently accepts one PO per bill, with partial quantities. Several compatible GRNs can supply a bill. Detail-only storage does not itself enable multiple direct POs; that would be a separate business/UI contract change |

Conclusion: Bill already conforms to the requested source-storage rule; no
additional Bill schema change is needed for this correction. No confirmed defect
was found in this bounded provenance review. This does not certify all Bill
financial calculations or runtime behavior. Unchanged source diff; actual EF SQL,
concurrent partial reservations, save/reopen/approve/unapprove/void/delete and
frontend rendering remain owner verification. Suggested commit/migration: none
for this read-only review.
