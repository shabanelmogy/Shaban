| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

# Bills — staged list handoff, 2026-10-20

## Owner scope and first-stage boundary

Owner asks to implement Bills incrementally and will supply details one by one. Current screenshot C:/Users/user/Desktop/1.PNG is the list stage only. Implement the list/search/read outputs in place; preserve existing Create/details navigation and every existing write/calculation. Do not redesign the editor, add approval/void/allocation/accounting mutations, fine generation, import, migrations or historical data. Future approval-cycle configuration belongs in Settings, not an editor tab. No application verification/build/test/lint/database/browser/Git writes. Owner-generated migration/snapshot and prior PO/GRN edits remain untouched.

Canonical UI list: Workshop/Job list + shared FilterPanel/DataTable/FeatureTitle/EditorDialog/ReportPage/ReportPrintService. The eventual Bill editor is screen08 financial document/backend Pattern3 (InvoiceService reference), not the nonfinancial PO pattern. This stage changes read paths only. Recipe check: eight packets current. References and Master2/4/5/7, UI1/2/3/4/6/7/19/20/21/24/29 and BE3/4/5/6/7/9/15/18/19 were consulted.

## Existing evidence and read-only decisions

Bill already exists with five enum types General0/Stock1/Asset2/StockGRN3/AssetGRN4. Current Save posts its journal immediately; no Bill ApprovalStatus, DueDate, IsVoided or DealNo fields exist. Current list uses client paging and dynamic nested probes although API provides scalar supplier/branch names; supplier filter sends ID as a name. Existing Bill.Date/SupplierBillDate, persisted total/tax, supplier, branch, CreatedBy and GRN source are real.

Screenshot Explicit: bill/supplier bill numbers; vehicle/branch/contact; date range plus Creation Date/Supplier Bill Date selection; due date, Open/Closed and approval status, Loan Bills, Deal No; grid No + approval badge, supplier bill no, PO no, date, supplier/code, amount/due/status/creator; Create/Generate Fines/Import/Report/Tax Report/Excel/Search; menu View/Print/UnApprove/Allocation/Void/Journal. Screenshot appearance is not design authority. English/LTR wide desktop visible; role/version/capture date Unknown.

Read-only reviewer decisions under the owner's standing rule:
- Contact dropdown selects the actual SupplierId; do not reuse the legacy ContactId→ContactGroupId TODO.
- Creation Date preserves existing BillSearchRequestDto.UseCreationDate=true meaning Bill.Date, not audit CreatedAt. False selects SupplierBillDate. Inclusive calendar dates. Keep existing POST search semantics unchanged.
- PO numbers: distinct live GRN source PurchaseOrder.No or LPONo values from linked BillDetail.GoodsReceivedNote; never Job.PONo, vehicle deal text or guessed source; no source means empty. Multiple sources are combined in stable order.
- Vehicles: distinct live line Vehicle.PlateNo values, stable order; no array-as-scalar probing or first-vehicle assumption.
- Amount uses persisted Bill.TotalAmount, never frontend recalculation.
- Due amount: only for a live posted nonvoid bill JV with a unique supplier A/P credit line (PartnerId=Bill.SupplierId, credit>0 and debit absent/zero) consistent with saved total. Sum ledger-effective JournalVoucherAllocation rows where that line ID occurs on either primary or allocated side, counting a row once. Due=max(0,total-allocated). No valid source yields null, not a guessed full balance or zero. This reuses existing JournalVoucherService both-sided capacity and DebitNote bill-due semantics. It creates no allocation/payment.
- Open0 if known due>0; Closed1 if known due=0; otherwise null. These describe outstanding settlement, not cash Paid/Unpaid. Expose no payment action.
- ApprovalStatus is explicitly nullable/empty pending its later source contract; do not derive Bill approval from JV posting/approval, IsActive or Settings flags. Preserve the visible column as unknown; no approval filter/action until that workflow is supplied.
- DueDate/DealNo have no confirmed universal source. Do not add misleading active filters now. Show a concise translated stage notice and record them deferred. Loan-plan due dates are not every bill's due date.

## Exact lean ordinary list contract

GET Bill uses existing ListSmBase -> Results<BillListVM>. Displayed DataTable field order (Actions first):
`id,no,approvalStatus,supplierBillNo,purchaseOrderNos,date,supplierBillDate,supplierName,supplierCode,totalAmount,dueAmount,status,createdBy,billType,branchName,vehicles,discount`.

ListVM exact PascalCase counterparts:
`Id,No,ApprovalStatus,SupplierBillNo,PurchaseOrderNos,Date,SupplierBillDate,SupplierName,SupplierCode,TotalAmount,DueAmount,Status,CreatedBy,BillType,BranchName,Vehicles,Discount`.

Id numeric; dates nullable; names/reference strings nullable; monetary values decimal nullable; BillType0..4 nullable; ApprovalStatus enum nullable always null in this stage; Status nullable Open0/Closed1. No children/documents/loan plan/tenant/delete/audit timestamps or unused FK IDs/flags on list. Only row action is existing View navigation, so no speculative canEdit/canDelete flags.

Main filters: no, supplierBillNo, vehicleId, branchId, dateRange(use dateFrom/dateTo), supplierId. Header compact radio group useCreationDate and Loan Bills checkbox. Advanced: status, billType, id, supplierCode, discount and search. Checkbox unchecked means no loan-only filter; checked sends isLoan=true. Backend may accept explicit isLoan=false as false, never drop it. Current month/working branch default/reset. No active approval/due-date/deal filter until real contracts arrive.

Exact backend keys: no/supplierBillNo/supplierCode/search contains; id/supplierId/branchId/vehicleId positive int; billType0..4; status Open0/Closed1 on known due only; isLoan bool; useCreationDate bool defaulttrue; dateFrom/dateTo inclusive selected date; discount decimal exact. Search covers bill number, supplier bill number, supplier name/code. Malformed values follow FilterHelper absent behavior. Shared toListParams, enum0/false preservation, Count before page, clamp1..100, stable allowlisted sort + Id tie-break. Sort actual scalar columns; PurchaseOrderNos/Vehicles/ApprovalStatus not sortable. Due/status only where computed source valid. No client filtering of one page.

## Read outputs, compatibility and exclusions

Report and Excel fetch all matching pages100 using applied filter/sort snapshot; fail complete output on any page failure. Shared report modal prints all result rows with applied context. Tax report uses separate paged GET Bill/tax-report with same filters/order/count. Exact report fields: Id,No,Date,SupplierBillNo,SupplierBillDate,SupplierName,SupplierCode,BranchName,BillType,SubTotal,Discount,TaxAdjustment,TotalTax,TotalAmount. Persisted tax figures only; no recalculation/tax-return claim.

Keep existing POST Bill/search and loan-payment-plan endpoint untouched. Keep inherited mutation transport methods in Angular BillService used by old editor. Existing create/details routes remain for navigation; list route gains shared guard only for pending report/print interaction if needed. Do not change old editor/DTOs this stage. No row Edit/Delete/UnApprove/Allocation/Void/Journal/new approval mutation. Row Print awaits supplied saved-document details; list/report print works now. Generate Fines/Import await their own source and screen details and do not receive fake buttons.

## File ownership after freeze

Backend worker: BillService read members only (preserve writes exactly), IBillService additive tax-report read, BillController read routes, BillListVM lean, new BillTaxReportVM and one-per-file internal read carriers if needed, list mapping only in BillProfiler. No other backend file edits.
Frontend worker: Bills/Bill list component TS/HTML/SCSS, models/list.ts, services/bill.service.ts, bill.routes.ts if guard needed; remove now-unused grid-row.ts. Preserve details/create models/components. Translation fragment only in reviews, not actual dictionaries. No unrelated dead-root cleanup.
Root: authorities/freeze/plan, translation integration, in-app bill list guide only, direct consumer checks and complete scoped reconciliation. Existing dirty files are preserved; no overlap.

## Acceptance

Trace each field/filter/derived amount producer and consumer, named imports/namespaces, standalone public APIs, all list variants and compatibility consumers. Source syntax and diff checks only. Owner later verifies real paging/EF projections/allocations on both sides, null historical sources, type0/false filters, complete outputs, themes/RTL/responsiveness/printing. No schema delta is needed for the read stage. Stage1 implementation does not certify or complete the later Bill editor or financial workflow.

## Integration clarifications — 2026-10-20

These clarify the frozen read implementation without authorizing new business behavior. DueAmount and Status are not sortable, alongside ApprovalStatus, PurchaseOrderNos and Vehicles; Status remains a server filter on the valid outstanding source. Allowlisted persisted scalar sorts and an Id descending tie-break keep pages stable. GET Bill and GET Bill/tax-report default to page1/15 when both paging arguments are absent; supplied paging uses the shared positive normalization and100-row cap. Existing GetAllWithNavigations remains an explicit unpaged compatibility read.

The current editor returns to bare /Bill and drops query parameters. A single typed, cloned in-memory BillService snapshot, scoped to the current user/subscription, restores the applied query only when the URL contains no list-state keys. Explicit URL state stays authoritative; no persistent storage or editor modification is introduced.
