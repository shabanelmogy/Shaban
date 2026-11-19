| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

# Purchase Orders backend implementation notes — 2026-10-20

This records only the bounded backend slice. It does not close the Purchase Orders feature or its frontend work.

## Canonical conformance

| Concern | Book/packet | Actual reference or owner | Final source match |
|---|---|---|---|
| Aggregate writes and child snapshot | BE8/14; PHASE-01/03 | `PurchaseOrderService.UpdateOrdersAsync`, existing PR capacity policy | Tracked owned-child reconciliation, ownership checks and one save retained; PR quantity/discount/source locks retained |
| Manual approval | BE12/14/18; PHASE-04 | `PurchaseRequest.RecordApprovalDecision`, `PurchaseRequestService.DecideApprovalAsync` | Pending to Approved/Rejected only, append-only real log, status/log atomic, 409 conflict behavior |
| Lean paged list | BE7/9/13; PHASE-02 | base `Service.GetManyAsync` hooks and `PurchaseRequestService` projection | Count-before-page, paging clamp, stable allowlisted sorting, exact lean contract; compatibility search unchanged |
| VAT and totals | BE1/15 | `VatPolicy.AllocateDocumentTax` | All new/edited orders allocate once-rounded VAT per rate; persisted line totals and projected document totals stay server-owned |
| Activation/delete/concurrency | BE8/12/14 | base activation/remove helpers; PR approval concurrency pattern | Terminal orders blocked, child-only updates force root approval concurrency token, conflicts return 409 |

## Exact API and model contracts

- `POType`: `GeneralPO = 0`, `StockPO = 1`, `AssetPO = 2`, `JobPO = 3`.
- `GET PurchaseOrder`: `Results<PurchaseOrderListVM>` with `Id`, `No`, `POType`, `Date`, `ApprovedStatus`, `BillStatus`, `SupplierQuotationNo`, `SupplierName`, `SupplierCode`, `BranchName`, `JobName`, `Vehicles`, `MasterAgreementNo`, `Notes`, `TotalAmount`, `AmountPlusTax`, `Discount`, `NetAmount`, `CanEdit`, `CanDelete`, and reserved `CanCreateGrn`.
- `GET PurchaseOrder/{id}/approval`: `Result<PurchaseOrderApprovalVM>` with `PurchaseOrderId`, `No`, `SupplierName`, `Amount`, `ApprovalStatus`, `CanApprove`, `CanReject`, and `History` (`Id`, `ApprovalStatus`, `StatusDate`, `User`).
- `POST PurchaseOrder/{id}/approval`: `PurchaseOrderApprovalDecisionVM { ApprovalStatus }`; accepts only `Approved` or `Rejected` while pending.
- Compatibility `PUT PurchaseOrder/{id}/toggle-approval` now performs pending-to-approved only and never reverses.
- Existing `POST PurchaseOrder/search` request/response is unchanged for equipment consumers.
- `PurchaseOrderDetailVM` adds `SupplierCode`, `EquipmentQuotationId`, `EquipmentQuotationNo`, `PurchaseRequestId`, `PurchaseRequestNo`, totals and `CanEdit`/`CanDelete`/`CanCreateGrn`.
- `PurchaseOrderDetailDetailVM` adds nullable `PurchaseRequestDetailId` and uses lean identity.

## Schema impact and owner action

- New `PurchaseOrderApprovalLog` table with tenant/order/time/id index and restricted FK.
- `PurchaseOrder.ApprovedStatus` receives pending default/sentinel and concurrency-token metadata.
- No enum column migration is required for `JobPO = 3`; existing enum values remain unchanged.
- Owner migration required: `Add-Migration AddPurchaseOrderManualApproval`.

## Decisions and bounded deviations

- Live GRNs now drive `CanCreateGrn` through `IGoodsReceivedNoteService.ReceivableOrderIdsAsync`; pending legacy POs linked by `PurchaseOrderId` or the legacy `LPONo` + supplier identity are blocked from edit, delete and rejection.
- `MasterAgreementNo` retains the frozen compatibility projection from `Job.PONo`.
- Money precision remains the frozen PO `decimal(18,2)` contract; no broader tenant-decimal migration was introduced.
- No configurable approval levels, roles, reasons, UnApprove or Bill creation was added.
- PR-linked updates reject new child rows without persisted source identity; existing sourced rows remain full-snapshot edits under source reference, capacity and discount locks.
- Inherited `GetAllWithNavigations` materializes the same lean list contract rather than using an unavailable AutoMapper list map.
- Bill add/update operations that reference GRNs now execute under the shared `PurchaseRequest` application lock and its owning read-committed transaction. Every referenced GRN is freshly required to be live, non-void and owned by the bill supplier before the existing bill/JV multi-save sequence begins. GRN-referenced inherited bulk bill writes are rejected; unrelated bulk behavior is unchanged. No posting, journal, tax, bill lifecycle or FK behavior was changed.
- `PurchaseOrderDetail.Recalculate` rounds `UnitPrice` at the decimal(18,2) storage source with `FinancialNumberPolicy` before multiplying quantity, then derives amount and tax at the same two-decimal owner. API VMs continue to reject extra-scale money through `NonnegativeStoredDecimal`; domain rounding also protects non-VM construction paths. The PO storage preflight includes header `Discount`. No schema change is required.

## Verification boundary

Source diff, symbols, resource pairs, contract members, merge markers and whitespace were reviewed. Build, tests, lint, migrations, database, browser, runtime, commits and pushes were not run. Owner compilation, migration application, concurrency replay, API replay and database verification remain pending.


Root reconciliation amendment: the earlier Job.PONo-based MasterAgreementNo claim is superseded by PURCHASE_ORDERS_CONTRACT_FREEZE.md. The wire key/column remain but are empty because no true master-agreement source exists; no sorting by that alias remains. Angular Edit now reads the supplier-specific current tax rate for both routed and embedded entry, updates nonzero preview rates and retains optional zero only where policy allows it.
