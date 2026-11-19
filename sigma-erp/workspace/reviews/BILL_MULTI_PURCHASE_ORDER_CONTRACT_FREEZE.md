# Multiple compatible direct purchase orders in one supplier bill

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-24 |

Owner rejects leaving Bill's single-PO restriction while generalizing document
source behavior across the purchasing cycle. Authorizes implementation, not just
review. Supersedes the single-direct-PO limitation in the read-only Bill
provenance review and earlier direct-source policy. Existing upstream PR->PO and
PO->GRN multi-source behavior remains. Supplier bills combine compatible General
POs or compatible Job POs, never a mix of those types, with the same supplier,
effective currency and bill branch (source branch null may use the selected bill
branch; a nonnull source branch must match). Every actual source remains on
BillDetail.PurchaseOrderDetailId; derive order identity from the source line,
no master FK and no schema change for Bill.

Add operational GET Bill/purchase-orders with supplierId and branchId required,
optional poType (General=0/Job=3), currencyId and excludeBillId. Returns existing
Results<SelectListBaseVm> (value = string ID, text = label, optional localizedText;
normal metadata), eligible live approved
orders with available positive quantities, plus valid retained source membership
when editing. Filters and authority repeated in draft/save. Use one batched
usage query for candidates, no per-option detail prefetch and no reference cache.
Keep GET purchase-order-draft/{id} response unchanged and allow excluding the
current bill when that order is one of its actual proven detail sources.

Save/preview/update/approve derive distinct orders from selected line IDs, validate
same supplier/type/currency and compatible bill branch, positive unique quantity,
real live approved tenant sources, item/account/job snapshots and capacity. No
GRN/manual/direct-PO line mixture. Edit preserves each retained source-line ID
and cannot introduce an order outside the saved source set; removing all selected
rows of a source drops it from membership. Recheck reservations under current
tenant write lock. Approved quantities invoice, pending reserve, rejected/voided/
deleted release as currently; periods/loans/VAT/financial posting unchanged.
All usage/billing-progress/mutation readers must stop declaring a valid
multi-order bill invalid simply because another row comes from a different PO.
They instead validate each row plus the entire bill's compatible source set.

Angular uses existing shared compact SourceDocumentPicker with internal document
navigation, retained Back/Cancel baseline and inline requested quantity. Blank
selection opens eligible orders; route source opens its details. Insert stages
selected lines in main Bill Details, no persistence in picker. Main editor can
choose further compatible orders, review source number per group/line, adjust
quantity/account and Save once. Supplier/branch/type/currency remain consistent
with retained sources. Existing multi-GRN billing continues unchanged; it
already persists exact sources per line and supports partial quantities.
Saved View/reload/print derive all source numbers from bill details; retain
quantities/accounts on retry/edit, stale source fails visibly with recovery.
Discount default is the sum of existing per-source proportional suggestions
for selected quantities; user editable bill discount remains its existing
contract, not a new source discount-consumption mechanism.

Ownership: backend worker owns BillService.PurchaseOrderSource.cs, IBillService,
BillController and operational select DTO only if needed. Frontend worker owns
Bill editor TS/HTML/SCSS/spec plus Bill service/models. Root owns
PurchasingBillingProgressQuery direct-order reads, directly affected BillService
currency/read helpers if needed, guide/translations/books/skill/packets, scope
audit and complete diff integration. Workers preserve dirty changes and do not
overlap. No builds/tests/lint/browser/runtime/DB/migrations/snapshots/commits.
No new physical Bill schema or migration is required.

Cycle classification: quantity-selecting procurement sources (PR->PO, PO->GRN,
GRN/General-or-Job PO->Bill) use detail provenance and approved compatible
multi-source selection. Requisition/stock issue retain job/branch-owned source
actions and exact source rows; this instruction does not merge distinct jobs or
generated issue reversal ownership. Financial return/allocation flows already
select several compatible targets at detail level. Document-wide journals,
contracts and loans are not source-line selection.
