# Purchase order downstream conversion contract

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-24 |

Owner explicitly confirms StockPO/AssetPO→GRN→Bill and GeneralPO/JobPO→direct
Bill with partial quantities. Preserve approved-only source, unified approval,
financial effects and PR→PO reservation contracts. Extend existing Bill editor,
not a parallel invoice writer or client-only source copy. A direct-source bill
uses existing GeneralBill; its JobId snapshots the source PO line/header.
One source PO per direct bill, all its selected lines keyed; no mixed manual,
receipt or other-PO lines. Other bill types keep their current contracts.

## Persistence and detail/input contract

BillDetail gains nullable PurchaseOrderDetailId and navigation; Restrict FK/index
in BillDetailConfig. Add/Update line VMs and TS ordinary line DTO gain nullable
PurchaseOrderDetailId (optional in TS for standalone compatibility). Direct
inputs own source-line ID, requested positive integer quantity and posting
AccountId only; server replaces description/price/job from live source and
rejects any GRN reference, foreign source or mixed sources. Source has no
posting account: retain explicit GeneralBill account selection and backend
operational account checks. No guessing an account by free text.

BillDetailDetailVM/TS include nullable PurchaseOrderDetailId, PurchaseOrderId,
PurchaseOrderNo for saved source identity and View/Edit rehydration. Derive
parent/no through exact FK. CopyEditableLine, approval input, source snapshot
matching and mutation/bulk guards carry the FK. A linked bill cannot drop its
source or switch PO through edit. Manual GeneralBill retains quantity1;
direct-source GeneralBill honors selected source quantity and saved price.

## Read API and UI

GET /Bill/purchase-order-draft/{id:int}?excludeBillId=<optional> returns
Result<BillPurchaseOrderDraftVM>. Header: purchaseOrderId:number, no:string|null,
poType:number, supplierId:number, supplierName:string|null, branchId:number|null,
branchName:string|null, currencyId:number|null, currencyCode:string|null,
discount:decimal (original PO discount, informational/default only),
lines: BillPurchaseOrderDraftLineVM[]. Line: purchaseOrderDetailId:number,
description:string|null, quantityOrdered:int, invoicedQuantity:long,
reservedQuantity:long, remainingQuantity:int, unitPrice:decimal, jobId:int|null,
jobNo:string|null. One named DTO per source file, correct namespaces/imports.
Source and exclude ID are tenant-owned/live; exclude must be a saved bill
linked to this PO, never a way to ignore another bill. Return positive-quantity
source lines with remaining0 too for truthful capacities and saved selections;
refuse malformed/unknown retained history rather than allocate by amount.

PO list/detail gain server canCreateBill: approved live General/Job, valid live
supplier, positive remaining source quantities, no diagnostic corruption.
Existing canCreateGrn handles only Stock/Asset. Row action and saved View header
reuse shared actions/PrimaryActionButton; route to
/Bill/create?sourcePurchaseOrderId=id. Bill editor hydrates draft after lookups,
locks source supplier/type and any prescribed branch; a PO with no branch
requires normal explicit bill branch selection. Preserve source currency.
Use existing editable collection/quantity/select owners to choose quantities
and accounts; price/description/job metadata read-only.0 omits a source row;
at least one positive line. Edit reloads context excluding own persisted bill
and restores quantities/accounts by source key; no silent identity reset.
Saved View uses persisted snapshot, with source number and actual quantities.
Keep existing header supplier-invoice/discount/tax/loan/date inputs and server
rules. A proportional PO discount may prefill the invoice on initial selection;
invoice discount remains explicit editable input, not a new allocation policy.
Totals/loan preview reuse existing POST Bill/preview, including source branch.
Source loading/error/retry participates in busy/save/dirty/cancel lifecycle.

## Capacity, transitions and progress

Under existing PurchaseRequest tenant write lock: resolve approved PO with
same supplier/defined branch/currency. Capacity per positive source line is
ordered quantity less other live nonvoid pending/approved BillDetail quantities
with that FK; unknown status or invalid linkage fails closed. Approved alone
counts invoiced; pending alone reserves; rejected/deleted/void releases.
Recheck Add/Update/Approve (exclude current bill). UnApprove remains reserved
as Pending under original financial dependency/period guards. Preserve stock/JV
owners; direct General/Job creates no GRN or stock effect. Immutable source
snapshots are checked at approval, not trusted from a saved ID alone.

PurchasingBillingProgressQuery.Orders branches by PO type, derives General/Job
coverage from exact direct FK and keeps Stock/Asset via GRN. Include malformed,
unknown and over-capacity cases as NeedsReview. List/detail/filter/count/export
consume same query and draft reservation flag. Bill source-number reader unions
direct and GRN paths. Legacy manual BillStatus is no longer a user-writable
coverage truth for any PO type; remove toggle UI and reject legacy toggle.
PO edit/delete/reject/unapprove/deactivate guards block retained direct pending/
approved source Bills as well as existing receipt dependencies. Check under the
same mutation lock; don't release PR capacity beneath a retained bill.
PR quantity reservation stays based on retained PO quantities, not bill status.

## Implementation boundaries and validation

Root owns PurchaseOrderService, PurchasingBillingProgressQuery, PO VM fields,
PO frontend models/list/details/service and guides/docs/integration. Backend
worker owns BillService partials/IBillService/BillController, BillDetail entity/
config/VMs/profiles and new source draft VMs, backend localized resources.
Frontend worker owns Bill editor/model/service and Bill-specific EN/AR keys.
No concurrent file ownership. No reference module modifications. Root merges,
reconciles DTO/API/imports/namespaces and scoped diffs, notifies owner to run
Add-Migration AddBillPurchaseOrderLineSource; never generate/edit/run migrations
or snapshots. No builds/tests/lint/runtime/browser/database/commits authorized.
No data reset/backfill. Source-only acceptance remains pending on compiler,
concurrent capacity, partial sources, state transitions, currency/branch/jobs,
report/filter/export and both UI entry points.
