| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

# GRN backend implementation notes

## Scope status

| Concern | Status | Evidence / note |
|---|---|---|
| GRN entity and EF lifecycle | Implemented — source-only | Nullable historical `Date`, nullable `PurchaseOrderId`, line `PurchaseOrderDetailId`, server-owned `IsVoided`/`VoidReason`; migration required. |
| Lean list/detail/write contracts | Implemented — source-only | Frozen property names retained. Selector uses existing `SelectListBaseVm` (`value`, `text`). Existing POST `search` compatibility remains. |
| Tax report contract | Implemented — source-only | `GET GoodsReceivedNote/tax-report` reuses the list filters/order/paging and projects persisted live-line totals without child payloads. |
| Linked PO capacity | Implemented — source-only | All GRN writers and void/delete use `ExecuteUniqueWriteAsync<PurchaseRequest>`; saved source values are re-read and snapped inside the lock. `ReceivableOrderIdsAsync` is the bounded batched PO-list eligibility owner; `CanCreateReceiptAsync` delegates to it. |
| Legacy LPONo capacity | Implemented — source-only | Same supplier/no/item-or-asset receipts reserve capacity; duplicate matching source lines fail closed. Historical rows are not rewritten. |
| Aggregate update/delete | Implemented — source-only | Tracked full-snapshot ownership, dropped-child reconciliation, terminal/bill/issue guards, bulk bypasses blocked. |
| Issue to Job provenance | Implemented — source-only | Stock-only Add creates grouped `ItemIssue` rows in the same graph save; `ItemIssue.GoodsReceivedNoteId` added and source-linked issues cannot be edited. |
| Supplier tax estimate | Implemented — source-only | Supplier rate is backend-owned; rounded document tax is allocated through `VatPolicy.AllocateDocumentTax`; no accounting journal added. |
| Void lifecycle | Implemented — source-only | One-way active-to-void action with required max-500 reason; bill/issue references block void; lines/history retained. |
| Direct stock readers | Implemented — source-only | Stock summary, detailed stock, purchases detail and GRN pending receipt totals exclude voided GRNs. |
| Resource messages | Implemented — source-only | EN/AR keys appended while preserving PO worker keys. |

## Exact API handoff

- `GET GoodsReceivedNote` accepts `ListSmBase`; filters: `no`, `lpoNo`, `supplierBillNo`, `branchId`, `supplierId`, `dateFrom`, `dateTo`, `grnType`, `isVoided`, `jobId`.
- `GET GoodsReceivedNote/purchase-orders?supplierId=&grnType=` returns `Results<SelectListBaseVm>` with `value`, `text`, `localizedText`.
- `GET GoodsReceivedNote/purchase-order-draft/{id}?excludeGrnId=` returns `GoodsReceivedNotePurchaseOrderDraftVM` with `purchaseOrderId`, `no`, `grnType`, `supplierId`, `supplierName`, `lines`.
- Draft line fields: `purchaseOrderDetailId`, `itemId`, `itemName`, `assetTypeId`, `assetTypeName`, `description`, `unitsOfMeasuresId`, `uoM`, `unitPrice`, `quantityOrdered`, `alreadyReceived`, `remainingQuantity`.
- `POST GoodsReceivedNote/{id}/void` body: `{ "reason": string }`.
- `GET GoodsReceivedNote/tax-report` accepts `ListSmBase` and returns `Results<GoodsReceivedNoteTaxReportVM>`. Fields: `id`, `no`, `date`, `grnType`, `lpoNo`, `billNo`, `supplierBillNo`, `supplierName`, `supplierCode`, `branchName`, `jobName`, `isVoided`, `totalAmount`, `taxAmount`, `netAmount`.
- Manual unlinked line rule: `quantityOrdered >= quantityReceived`; server read value `alreadyReceived = 0` for new unlinked lines.

## Schema / owner verification

Suggested migration: `AddGoodsReceivedNotePurchaseOrderLifecycle` for GRN date/source/void columns, line source FK/index, and ItemIssue source FK/index. No migration or snapshot was created or edited.

Build, tests, lint, database, browser and runtime checks were prohibited and remain pending. Required runtime checks include concurrent linked receipts, legacy ambiguous source lines, linked edit with `excludeGrnId`, issue graph save, bill/issue action locks, void exclusion from each stock report, list projection translation and supplier VAT allocation.

## Source conformance and deviations

The implementation follows backend blocks 1–11, 14 and 18: persisted entity/config, lean typed contracts, explicit maps, Pattern 2 tracked aggregate, tenant/live reference validation, server calculations, stable paged list hooks, source lock and transition guards. The approved Pattern 2 PurchaseOrder reference was inspected but not modified by this worker.

One contract wording named `DropDownSelect`; that type does not exist in the backend. The existing canonical `SelectListBaseVm` was used without changing route semantics, and the frontend adapter was notified. The authorized tax-report route is a later frozen-contract amendment recorded by the root. No other frozen API deviation was identified.

The final source audit also verified that both inherited detail routes use the same lean projection, all list routes use the explicit list projection, aggregate bulk/activation bypasses are blocked, bill locks test live bill-root existence rather than bill display text, and soft delete retains owned receipt history. Historical `GRNType` value `0` remains the existing valid `StockGRN`; new nullable source/date columns preserve historical rows. Migration generation and existing-data inspection remain owner-run work, so actual deployed defaults and historical data distributions are not certified by this source-only pass.

## Root final integration corrections

Repeated void and a newly referenced receipt return409, with localized success messages. Legacy duplicate-source ambiguity counts a stable source snapshot rather than the shrinking draft result. Void exclusion belongs to the GoodsReceivedNote purchases query, not PurchaseOrder (which has no IsVoided member). Bill selector now consumes canonical GRN root IDs through GrnService after the dead detail UI/service removal. Final integrated source-only evidence is in PURCHASE_ORDERS_FULL_STACK_REVIEW.md; no additional migration/snapshot/build/runtime action was taken.
