# Purchase order downstream creation

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-24 |

Owner requests creating GRN or Bill from a Purchase Order according to its type.
This extends the current purchasing cycle; preserve all frozen partial-receipt,
partial-bill and unified approval contracts. Source-only work, no migrations/
snapshots generated, edited or run, no build/tests/lint/browser/DB/commits.

## Current state and impact

PO types are General/Stock/Asset/Job. Stock/Asset already expose canCreateGrn
in list/detail and route to GoodsReceivedNote/create?sourcePurchaseOrderId=id;
the receipt writer checks approved source/type/remaining quantities. Bills from
GRN retain precise GoodsReceivedNoteDetailId and support partial requested
quantity. General/Job have no saved direct PO→Bill reference; current billing
query labels them NotApplicable and the legacy BillStatus toggle is manual.
GeneralBill supports account and JobId but its manual line preparation forces
quantity1, so merely prefilling a new bill screen would lose source identity
and quantities and would not guard duplicate billing.

| Area | Classification / proposed change |
|---|---|
| Stock/Asset GRN path | Keep existing typed create source and capacity writer |
| General/Job direct billing | Extend BillDetail with nullable PurchaseOrderDetailId + restrictive FK/index; reuse GeneralBill with source-aware line preparation |
| API/editor | Extend existing Bill service/editor with a single-PO draft selector/read; editable requested quantity/account, derived source descriptions/prices/jobs; preserve ordinary standalone bills |
| Reservation | Extend under existing PurchaseRequest write lock: live pending/approved direct bills reserve capacity; only approved counts as invoiced; exclude own bill on update/preview |
| PO list/detail/action | Extend canCreateBill alongside existing canCreateGrn; source-owned eligibility and typed navigation; recheck server writer |
| PO guards | Extend edit/delete/reject/unapprove/active guards to direct bills; no PR capacity release under a retained downstream bill |
| Billing coverage | Extend PurchasingBillingProgressQuery to direct PO lines for General/Job; keep GRN-derived Stock/Asset coverage and independent draft flag |
| Legacy manual flag | Replace operational use with actual linked bill coverage; retire manual billing toggle once direct billing is adopted |
| Bill source display | Extend PurchaseOrderNos with precise direct source union |
| PR reservation | Keep PR→PO quantities independent of invoiced quantities |
| Docs/guide | Extend used cycle contract and module guide; keep presentation shared |

## Alternatives and pending business decision

An asynchronous owner question is pending: keep Stock+Asset→GRN→Bill and
General+Job→direct Bill (recommended, matches current GRN writer), or allow
Asset→direct Bill too. Do not implement dependent mappings until answered.

Owner answered on2026-10-24: Stock+Asset through GRN, General+Job directly to
Bill, partial quantities in both. The question above is historical; mapping
is now Confirmed. Execute the exact contract in
PURCHASE_ORDER_DOWNSTREAM_CREATION_DOMAIN_API_CONTRACT_FREEZE.md.
Source-only URI prefilling without a persisted line reference is rejected:
cannot prove consumption, reservations or safe downstream mutations.

Proposed direct-slice contract to freeze after mapping confirmation: one source
PO per bill (user asks creation from that PO); retain parent supplier/currency,
source line identity, description, job and price. Existing general bill account
selection remains explicit because PO has no posting-account field. Select
partial positive integer quantities; zero omits an unselected line. GeneralBill
manual quantity1 stays unchanged, sourced lines honor requested quantity.
Server derives metadata, validates headers/ownership/type/approval/capacity and
actual posting-account eligibility. No stock movement from direct General/Job
billing; existing Bill approval creates only its real journal/effects. Existing
header discount/tax/loan inputs retain their current bill rules; do not invent
new accounting effects or silently infer accounts from free text.

A nullable source FK requires an owner-run migration, suggested name
AddBillPurchaseOrderLineSource, after source changes are complete. No automatic
legacy matching/backfill, no data deletion. Release source/schema together.

Root owns decisions, freeze, integration and final review. One bounded read-only
gpt-5.6-sol agent traced source capacity, PO guards and billing readers without
editing; confirmed impact recorded above. Implementation may be split only
after exact API/input/context contracts are Frozen with disjoint ownership.
