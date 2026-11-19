| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner runtime verification pending | yes |

# Purchase Order receipt progress — 2026-10-22

## Evidence and decision

Purchase Request consumption is the first implemented example. For a Stock or Asset Purchase Order, the downstream source is an approved, non-void Goods Received Note with a saved `PurchaseOrderId` and detail-level `PurchaseOrderDetailId`; historical approved or legacy-null approval receipts count. Draft/rejected/voided receipts do not use capacity. General and Workshop Job orders have no GRN receipt path. A historical unlinked GRN may carry the same supplier and LPO number; this can reserve capacity but cannot always be attributed to a PO line reliably. The current two-value `BillStatus` is a manually toggled bookkeeping flag, not evidence of a posted Bill and not part of this progress axis.

| Field | Frozen decision |
|---|---|
| Status | NotApplicable for General/Job; NoQuantity for Stock/Asset without positive source lines; Open when no effective quantity is received; PartiallyUsed when some received and some remain; Closed when every positive line is fully received; NeedsReview when an effective historical unlinked receipt matches the PO or a linked receipt has untraceable lines. |
| Percentage | Mean of each positive PO line's clamped received/ordered ratio, rounded to two decimals; null for NotApplicable, NoQuantity and NeedsReview. Never sum incompatible UOMs. |
| Source integrity | Only live PO detail/GRN detail rows and live approved/nonvoid GRN parent with matching PO parent/detail contribute. A historical ambiguous receipt never falsely closes an order. |
| Filtering | Filter all six statuses in SQL before count/page and applied export. Read status is derived, not persisted. |
| Presentation | Separate receipt status and percentage from approval and billing in list and saved details. Do not relabel manual `BillStatus` as proof of invoicing. |

## Conformance map

| Concern | Owner | Reference | Target |
|---|---|---|---|
| Derived read | Master 4, BE14 | PurchaseRequestService `GetConsumptionAsync`; GoodsReceivedNoteService `ReceivableOrderIdsAsync` | Batched per-page PO progress with GRN approval/void and legacy rules. |
| Filter/count/export | BE9, UI4/5 | PurchaseRequestService consumption filter; PO list shared filter/table | Filter in service before count/page; list route and export share filter. |
| Screen | UI13/14/21, Master7 | PO list/editor and in-app guide | Translated badge, percentage and saved detail, no new layout control. |

## Remaining independent billing decision

Stock/Asset Bills link to a GRN, but General/Job Bills do not have a reliable direct PO/detail source key. Their manually writable `BillStatus` cannot prove Not Billed/Partially Billed/Billed. A separate bill-link contract must be frozen before replacing that field across all PO types. This receipt progress does not mutate `BillStatus` or payment/accounting effects.

## Source reconciliation

- `PurchaseOrderService` derives the read values in a batch for paged list rows and the saved detail, and applies the six-state SQL filter before the base list count and page. Effective receipts require an approved (or historical null-approval), non-void, live GRN and a positive live detail quantity. Untraceable linked rows and matching unlinked historical receipts become NeedsReview.
- The C# read DTOs and TypeScript list/detail models share enum values 0–5, `receiptStatus`, `receiptPercent` and the `receiptStatus` filter key. The PO list restores/resets the filter, shows translated badge/percentage, and passes the filter through report/export. Saved details show the read-only status. English/Arabic vocabulary and the in-app Purchase Orders guide were updated.
- The existing manual `BillStatus`, approval workflow, GRN capacity rules and accounting effects remain untouched. No entity/configuration/schema field was added; no migration is required.
- Scoped backend/frontend `git diff --check` passed. The recipe-system `Generate-SigmaRecipes.ps1 -Check` passed all eight packets. Source inspection matched the PO list/detail filter and result paths; no build, test, lint, database, migration or browser verification was run under `AGENTS.md`.
- Owner acceptance still needs compilation and runtime checks for the SQL filter (especially legacy NeedsReview), list paging/export, a partially received stock/asset PO, and General/Job NotApplicable. Existing unrelated dirty files, including a user-created migration and model snapshot, were preserved.
