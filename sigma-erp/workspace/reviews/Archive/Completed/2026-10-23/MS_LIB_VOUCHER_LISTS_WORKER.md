# Voucher list ms-lib removal worker

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-15 |

Bounded worker ownership:23 ordinary list consumers under Vouchers. Excluded the five Invoice candidate/detail subcomponents, all shared/config/guides/translations/backend files. Preserved peer/user changes; no prohibited commands run. Frozen root plan is MS_LIB_REMOVAL_MAINTENANCE_EVOLUTION_PLAN.md.

## Files and presentation contract

For each feature below, changed components/list/list.component.ts and .html in place; added models/grid-row.ts. Existing empty list SCSS stays empty. Total46 existing files plus23 imported presentation-model files.

- Bills/Bill
- Bills/BillDetail
- CreditNote
- DebitNotes/DebitNote
- GRNs/GoodsReceivedNote
- GRNs/GoodsReceivedNoteDetail
- Invoices/InvoiceBase
- Invoices/MiscellaneousInvoice
- Invoices/MiscInvoiceItem
- JVs
- Payments/Payment
- Payments/PaymentDetail
- Provisions/Provision
- Provisions/ProvisionDetail
- PurchaseOrders/PurchaseOrder
- PurchaseOrders/PurchaseOrderDetail
- PurchaseRequests/PurchaseRequest
- PurchaseRequests/PurchaseRequestDetail
- PurchaseReturns/PurchaseReturn
- PurchaseReturns/PurchaseReturnDetail
- Receipts/Receipt
- SalaryVouchers/SalaryVoucher
- TrafficFines/TrafficFine

Each list selects the UI1/3/4/5/6 shared list shell, FeatureTitle/PrimaryActionButton, FilterPanel and exactly one DataTable (fill=true, lazy=false, controlled shared15 local paging). Retained data columns enable sortable:true for the existing local-array sort; no server sort fields are serialized (root UI5 clarification). Existing service get/lookup/delete endpoints, query aliases, create paths, id/details links, displayed column sequence and source fields remain. Local keyboard and All/Active/InActive/Delete filtering remain source-backed. Deleted filtering deliberately retains the existing capitalized Deleted source field; this change adds no new deletion semantics.

Every GridRow retains its feature DTO via intersection and declares explicit scalar display fields; each column references one declared field. Its feature-owned projection reads the previous raw/nested display paths, returns empty for absent values and keeps raw DTO properties for real actions. No shared weak column type, legacy wrapper or invented transport contract.138 displayed columns pass the field-declaration source check. No complete-result claim: local paging operates only on the array returned by the unchanged existing API call.

| Feature | Previous source display paths (retained) | Search |
|---|---|---|
| Bills/Bill | id, no, billType, supplierBillNo, date, supplierBillDate, supplier.name, supplier.no, branch.name, billDetails.vehicleId, discount | existing server field search + local keyboard/status |
| Bills/BillDetail | name, sku, categoryName, createdBy, createdAt | local keyboard/status only |
| CreditNote | id, creditNoteNo, type, createdAt, branchName, contactName | existing server field search + local keyboard/status |
| DebitNotes/DebitNote | type, createdAt, branchName, supplierName | existing server field search + local keyboard/status |
| GRNs/GoodsReceivedNote | no, supplierBillDate, lpoNo, supplierBillNo, supplierName, supplierId, branchId | existing server field search + local keyboard/status |
| GRNs/GoodsReceivedNoteDetail | name, sku, categoryName, createdBy, createdAt | local keyboard/status only |
| Invoices/InvoiceBase | name, sku, categoryName, createdBy, createdAt | local keyboard/status only |
| Invoices/MiscellaneousInvoice | name, sku, categoryName, createdBy, createdAt | local keyboard/status only |
| Invoices/MiscInvoiceItem | name, sku, categoryName, createdBy, createdAt | local keyboard/status only |
| JVs | id, no, date, branch.name | existing server field search + local keyboard/status |
| Payments/Payment | id, paymentType, date, branch.name, customer.name, paymentMethod.name | existing server field search + local keyboard/status |
| Payments/PaymentDetail | name, sku, categoryName, createdBy, createdAt | local keyboard/status only |
| Provisions/Provision | no, contact, entryDate, title, dayOfMonth, numberOfMonths, isCompleted | existing server field search + local keyboard/status |
| Provisions/ProvisionDetail | name, sku, categoryName, createdBy, createdAt | local keyboard/status only |
| PurchaseOrders/PurchaseOrder | id, no, date, supplierQuotationNo, supplierName, notes, branchName, discount | existing server field search + local keyboard/status |
| PurchaseOrders/PurchaseOrderDetail | name, sku, categoryName, createdBy, createdAt | local keyboard/status only |
| PurchaseRequests/PurchaseRequest | id, no, purchaseRequestType, date, purchaseRequestDetails.vehicleId, supplierQuotationNo, supplierName, supplierId, purchaseRequestDetails.amountPlusTax, discount | existing server field search + local keyboard/status |
| PurchaseRequests/PurchaseRequestDetail | name, sku, categoryName, createdBy, createdAt | local keyboard/status only |
| PurchaseReturns/PurchaseReturn | purchaseReturnNo, purchaseReturnDate, purchaseReturnDate, purchaseReturnDate, branch.name, supplier.name | existing server field search + local keyboard/status |
| PurchaseReturns/PurchaseReturnDetail | name, sku, categoryName, createdBy, createdAt | local keyboard/status only |
| Receipts/Receipt | no, date, receiptType, branch.name, contact.name, contact.no, agreement.no, allocationStatus, amount | existing server field search + local keyboard/status |
| SalaryVouchers/SalaryVoucher | no, salaryVoucherNo, date, voucherType, totalAmount | existing server field search + local keyboard/status |
| TrafficFines/TrafficFine | id, fineNo, vehicle.plateNo, fineDateTime, amount | existing server field search + local keyboard/status |

## Actions, failures and lifetime

Real row actions on GRN/PurchaseOrder/PurchaseRequest now use DataTable actions (Edit existing route; Delete existing method). Successful Delete refreshes after acceptance, removing the previous premature duplicate refresh in PO/PR. Console-only loyalty/house-account/tag/delete placeholder menus on generated lists are not advertised as implemented business actions. Credit/Debit create variants keep their existing type query parameter and now occupy labelled shared title actions.

List reads use Subject/switchMap/defer, takeUntilDestroyed and finalize, restoring the global spinner on success/failure/cancel/destroy. Declared failure and HTTP failure set local failure state and clear stale rows; the existing global interceptor retains error-dialog ownership. Lookup reads keep existing calls and teardown, mark failure on declared/HTTP failure without another page spinner or duplicate dialog. Lookup arrays update immutably to notify computed options.

Shared type:date renders canonical dd/MM/yyyy instead of legacy dd/MMMM/yyyy; root approved the UI5 formatting amendment. Preserves returned values and date-only granularity. Existing readonly calendar selection remains, now through DatePickerDirective. Search controls keep original raw form keys; shared Reset reloads default server request where existing server search exists.

## Existing limitations deliberately preserved

- 10 generated product-like lists have Name/SKU/Category/CreatedBy/CreatedAt columns inconsistent with declared voucher DTOs (BillDetail, GRNDetail, InvoiceBase, MiscellaneousInvoice, MiscInvoiceItem, PaymentDetail, ProvisionDetail, PurchaseOrderDetail, PurchaseRequestDetail, PurchaseReturnDetail). Their source paths and old product/details links remain; absent fields remain blank. This library removal does not invent correct voucher business columns or repair those destinations.
- Other stale/nested paths include TrafficFine vehicle.plateNo despite scalar vehicleId; Payment branch/customer/paymentMethod names absent from list DTO; Receipt nested branch despite a string DTO and missing contact/agreement/status fields; Bill billDetails.vehicleId and PurchaseRequest purchaseRequestDetails.* read an array/nondeclared path and remain blank when source is not an object. These need separate business-contract review.
- PurchaseReturn retains three displayed purchaseReturnDate columns under Date In/Date Out/Purchase Return Date. Duplicate search controls bound to the exact same purchaseReturnDate key are consolidated to one source-key date field with the first original label; no From/To API invented.
- DebitNote's old search handler maps contactName although its visible lookup is supplierName; retained rather than silently replacing a query contract. Credit/Debit search still uses the same explicit Number conversion/aliases.
- MiscellaneousInvoice DTO lacks id; projection uses a runtime id only if returned, otherwise old blank links become safely inactive.
- User-guide, toolbar integration, general.id and purchaseRequest.supplierCode bilingual key completion are root-owned and now source-verified present. No source outside worker ownership edited.

## Source verification

- 46 TypeScript files and23 Angular templates parsed with installed TypeScript/Angular compiler parser APIs: zero syntax errors. This is source parsing, not build/type checking.
- Source import-path check passed. Direct shared declarations inspected: DataTableColumn/Component/PaginationEvent, FilterPanel public inputs, filter directives, DatePickerDirective, FeatureTitle/PrimaryActionButton, list-query paging signature. All used controls registered standalone.
- Column/endpoint/link preservation audit:23 lists,138 displayed columns, previous link destinations and service get owners match; each has one shared table, no old ms-lib/ColType/ListCol/TableList references.
- Complete scoped tracked diff captured for review at C:/Users/user/AppData/Local/Temp/sigma-voucher-complete.diff; diff --check passed for owned files. New models inspected directly and parsed. Root owns final integrated diff reconciliation.
- No builds/tests/lint/browser/DB/migrations/commits/push/deploy executed.

Owner verifies compilation then representative list search/reset/local keyboard/status/paging, links/create variants/delete failure behavior, empty/HTTP failure, short/narrow viewport, LTR/RTL and both themes. No backend/API/formula/migration change; Add-Migration not required. Suggested frontend commit (root integrates): refactor(vouchers): replace ms-lib lists with shared data table.

