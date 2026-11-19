# Supplier goods return and linked financial credit

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-25 |

Owner decisions: physical return and financial settlement are separate linked
actions; approved returns reopen receiving capacity on the same purchase order;
billed returns credit the exact original bill lines, including their allocated
discount and stored tax. A paid bill leaves a supplier debit balance; never
fabricate an allocation or pay the supplier again. Currency work stays excluded.

Extend the existing PurchaseReturn aggregate with Kind (Financial=0, Goods=1,
GoodsCredit=2), ApprovedAt, and owned PurchaseReturnGoodsLine rows. Rows retain
GoodsReceivedNoteDetailId, optional BillDetailId and optional SourceReturnLineId
(self-reference for credit). Source conversion identities stay on rows. Store
positive integer Quantity; the server owns AccountId, NetAmount, TaxAmount and
all totals. Existing financial returns keep their current route and treatment.

Goods uses live approved receipts for the same supplier and branch. Separate
unbilled capacity from quantities in each approved bill line; draft bills reserve
their quantity and cannot be returned as unbilled. Pending/approved goods returns
reserve source quantities. Validate source pair, tenant, positive quantities and
no duplicate segment, recheck at approval. Approval deducts available stock for
item lines, never below zero, and creates no journal. Asset receipt quantities
are tracked against their exact receipt line; this creates no fixed-asset
disposal/depreciation transaction. Physical return is a purchasing receipt
correction, not a substitute for disposing an in-service asset.

Only approved nonvoid Goods rows reduce inventory and net PO receipt usage.
Unbilled pending/approved returns reduce billable receipt quantities. A billed
return does not release original bill consumption a second time. Undo/void Goods
is blocked by retained linked credit rows and by replacement receipts that need
its reopened PO capacity. Source receipt and bill mutations are blocked by live
return row references. Keep terminal rejection, reasoned unapproval and Log.

GoodsCredit is created explicitly from an approved Goods return, selecting
positive quantities of its billed rows. One credit can contain several original
bills for the same supplier/branch/currency. Pending/approved credits reserve
source return quantities; rejected/voided credits release financial capacity.
The server derives each original bill's posted net line value after allocated
document discount and stored line tax, then derives cumulative quantity slices
so final rounding exhausts the exact amount without overcredit. Approval uses
Dr supplier control, Cr the original line's account for net and Cr the original
Tax Paid account for tax; require current source proof and owned posted Bill JV.
The financial credit creates no second stock movement. Settlement with bills is
independent through the existing supplier debit allocation workflow.

Posting proof amendment: BillDetail stores nullable PostedNetAmount and
PostedTaxAccountId during its existing journal rebuild, using that builder's
actual discount allocation and resolved Tax Paid account. Credits consume these
snapshots, not a fresh discount distribution or current tax-account setting.
Old bill lines without proof remain unavailable for automatic credit until their
own permitted draft/reapproval workflow records it; no guessed backfill.

API: GET PurchaseReturn/goods-sources?supplierId&branchId&excludeReturnId? returns
Result<List<PurchaseReturnGoodsSourceVM>>; each source has receipt detail, optional
bill detail, saved document/item labels and AvailableQuantity. POST goods and
PUT goods/{id} accept date, branchId, supplierId, detail and owned line inputs
{id,goodsReceivedNoteDetailId,billDetailId?,quantity}. POST {id}/goods-credit
accepts {date,lines:[{sourceReturnLineId,quantity}]}; returns the created credit ID.
Existing detail/list add kind and actual progress; detail has goodsLines with
saved labels, quantity/net/tax and credited/reserved quantities. Shared approval,
void and Log endpoints remain the action owners. Generic financial POST/PUT must
not mutate a Goods/GoodsCredit aggregate. Derived credits are not manually edited.

Lock order: JournalVoucherAllocation, ItemRequisition (stock), PurchaseRequest
(source capacity), consistent with existing stock/receipt writers. Every goods
write and state action rechecks under these locks; source readers and reports use
one approved-goods-return query. New schemas require owner-generated migration.
No database or migration/snapshot edits are authorized to the agent.

UI: existing PurchaseReturn list offers Financial and Goods creation. Goods
editor uses the shared routed financial shell, source-line picker with quantities,
saved read labels, shared approval panel/tab/status dialog, Log and typed reason
dialog. Apply stages selected rows; only editor Save persists. Saved Goods shows
returned/credit quantities and Create financial credit for eligible billed rows.
Credit View shows original sources and read-only calculated amounts. Retain all
existing financial-return behavior and shared PrimeNG presentation owners.

## Source-conformance amendment — 2026-10-25

Unapproval/void is blocked by active Pending/Approved nonvoid credits and
replacement receipt quantities; rejected/voided credits release reservations.
This clarifies the earlier "retained linked credit" wording: historical final
credit records remain traceable and cannot reopen, but do not reserve capacity.
Pending documents with retained approval decisions cannot be deleted. Source
Bill/GRN guards protect active dependencies and preserve historical source proof.
Original posted net/tax-account snapshots are copied from the detached journal
builder to tracked BillDetail rows in the approval transaction, including proven
zero-value sources. Storage follows FinancialNumberPolicy ledger precision.
Several original supplier control accounts are preserved as separate debit lines
in one credit, grouped by original account; no current setting reassigns them.
UI composite segments keep stable numeric adapter IDs for receipt+bill pairs.
Goods View shows credited/reserved quantities; derived credit shows original net/
tax and a read-only source-return link. Same-route ID changes reload the record.
Bill's received-source response adds ReturnedQuantity independently of Reserved;
remaining capacity excludes both. Angular displays and validates that new field.
