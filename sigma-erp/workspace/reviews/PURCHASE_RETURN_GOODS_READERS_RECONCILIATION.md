# Purchase return goods readers reconciliation

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-25 |

## Authority and shape

Implemented against `PURCHASE_RETURN_GOODS_CONTRACT_FREEZE.md`, backend blocks
14, 15, 17 and 18, and generated packet `PHASE-01-domain-api` after a successful
recipe drift check. The selected shape is a line-proven master/detail purchasing
conversion with an approved physical stock effect and a separately approved
financial-credit effect. No migration, snapshot, database, build, test, runtime,
browser or commit operation was performed.

## Reconciled paths

| Concern | Reader/writer path | Result |
|---|---|---|
| Shared physical-return proof | `SupplierGoodsReturnQueryExtensions.WhereApprovedGoodsReturn` | Counts only positive live lines whose return is approved Goods, nonvoid, tenant-consistent, and whose exact live GRN detail/header has the same supplier and branch. Pending Goods reserves producer capacity but has no reader-side stock or receipt effect. |
| Available branch balance | `StockBranchBalanceReader.GetAvailableAsync` | Approved item returns to suppliers subtract from the source item at the return header branch. Asset lines do not enter item stock and no asset-disposal effect is invented. Existing issue/transfer/item-return paths remain unchanged. |
| Stock summary | `StockReportsService.GetStockSummaryAsync` | Approved physical supplier returns subtract from current quantity, including optional branch filtering. |
| Detailed stock | `StockReportsService.GetDetailedStockReportAsync` | Approved physical supplier returns use `ApprovedAt`, reduce beginning balance before the applied period, and appear as period out quantity within the applied period. |
| GRN prepare/save/approval validation | `GoodsReceivedNoteService.PrepareLinesAsync` | Approved Goods quantities reopen the exact PO-detail capacity derived through the source GRN detail. Existing disjoint manual legacy fallback remains unchanged. |
| GRN chooser and creation gate | `ReceivableOrderIdsAsync`, `CanCreateReceiptAsync`, `GetPurchaseOrdersAsync` | Net received quantity is approved receipt quantity minus approved exact-source Goods quantity. Fully returned quantities reopen the same order line. |
| GRN draft | `GetPurchaseOrderDraftAsync` | `AlreadyReceived` and `RemainingQuantity` use net received quantity and preserve existing ambiguous legacy handling. |
| PO receipt status and percentage | `FilterByReceiptStatus`, `GetReceiptProgressAsync` | Open/partial/closed status and percentage use net receipt quantities by exact PO detail. A fully returned quantity is open again; no legacy quantity is attributed to an unproven line. |
| Pending receiving report | `StockReportsService.GetGrnPendingReportAsync` | Approved Goods quantities subtract from received quantity using the exact source GRN detail's PO detail and item. Existing wholly-unstructured legacy fallback remains disjoint. |
| Receipt/PO billing progress | `PurchasingBillingProgressQuery.Receipts/Orders` | Only approved, live, exact-source GoodsCredit lines reduce approved invoiced quantity. Physical Goods alone does not uninvoice billed goods. Direct General/Job order billing remains on the unchanged direct-order path. Draft credit reservations do not count as invoiced reductions. |
| Consumer integration | `GoodsReceivedNoteService` and `PurchaseOrderService` billing projections | Both SQL-composable progress consumers pass the same return-line query; no master return source ID is introduced. |

## Owner acceptance cases

| Case | Source-only expected result |
|---|---|
| Approved Stock Goods return | Available item stock decreases at the return branch; summary and detailed reports agree. |
| Pending, rejected or voided Goods return | No stock or PO receipt-progress effect. Pending capacity remains producer-owned. |
| Approved Asset Goods return | PO receipt capacity reopens; item stock is unchanged and no disposal is created. |
| Approved Goods return against a fully received PO line | The same PO detail becomes receivable for the returned quantity; draft remaining quantity, PO status/percent and Pending Receiving agree. |
| Replacement receipt | Its own GRN detail is counted normally; the original return is counted once through its original source line. |
| Billed physical return without credit | Approved invoiced coverage remains unchanged. |
| Approved GoodsCredit | Net invoiced receipt and PO coverage reduce once through the exact original BillDetail/source receipt line. |
| Pending/rejected/voided GoodsCredit | Approved invoiced coverage is unchanged. |
| General or Job direct bill | Existing direct PO billing status and reservations remain unchanged. |
| Legacy unstructured GRN | Existing LPONo/item fallback remains disjoint; a Goods row cannot manufacture precise legacy provenance. |

## Remaining concerns

- Owner build and EF translation verification remain pending. In particular,
  the correlated approved-return and approved-credit sums must be exercised
  against the owner-generated schema migration.
- Runtime acceptance must cover branch and tenant isolation, approval/void timing,
  integer overflow boundaries, replacement receipt creation, and matching values
  across list filters, export and report totals.
- The existing item issue source validator reads GRN source identity for issue
  provenance, not aggregate available balance; no additional stock-total reader
  outside the owned files was found. Its behavior was not changed.
- Producer-side capacity, approval/reversal guards, bill consumption and schema
  are owned by the root workstream and must be reconciled with these readers in
  final integration.
