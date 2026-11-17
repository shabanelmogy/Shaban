# شاشة: Ledger

المسار في القائمة: Accounts ← Ledger.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_ledger`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0501](../../../readable/routes/R0501--tenant-crs-ledger.js)، والأصل [raw/application.js:5253](../../../raw/application.js#L5253).
- قالب الشاشة: `~/App/tenant/views/crs/accounting/ledger/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.accounting.ledger.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.accounting.ledger.index](../../../readable/controllers/C0500--tenant.views.crs.accounting.ledger.index.js) | 19 | 10 |
| [tenant.views.common.locations.searchContactModal](../../../readable/controllers/C0400--tenant.views.common.locations.searchContactModal.js) | 3 | 1 |
| [tenant.views.crs.vouchers.invoices.createOrEditLimoModal](../../../readable/controllers/C1314--tenant.views.crs.vouchers.invoices.createOrEditLimoModal.js) | 33 | 8 |
| [tenant.views.crs.vouchers.receipts.viewModal](../../../readable/controllers/C1431--tenant.views.crs.vouchers.receipts.viewModal.js) | 26 | 15 |
| [tenant.views.crs.vouchers.creditNotes.createOrEditModal](../../../readable/controllers/C1260--tenant.views.crs.vouchers.creditNotes.createOrEditModal.js) | 27 | 10 |
| [tenant.views.crs.vouchers.creditNotes.createOrEditModalOnAccount](../../../readable/controllers/C1261--tenant.views.crs.vouchers.creditNotes.createOrEditModalOnAccount.js) | 34 | 17 |
| [tenant.views.crs.vouchers.debitNotes.createOrEditModal](../../../readable/controllers/C1276--tenant.views.crs.vouchers.debitNotes.createOrEditModal.js) | 25 | 8 |
| [tenant.views.crs.vouchers.deposits.viewModal](../../../readable/controllers/C1302--tenant.views.crs.vouchers.deposits.viewModal.js) | 9 | 6 |
| [tenant.views.crs.vouchers.purchaseOrders.createOrEditModal](../../../readable/controllers/C1396--tenant.views.crs.vouchers.purchaseOrders.createOrEditModal.js) | 32 | 17 |
| [tenant.views.crs.vouchers.cashWithdrawals.viewModal](../../../readable/controllers/C1254--tenant.views.crs.vouchers.cashWithdrawals.viewModal.js) | 4 | 1 |
| [tenant.views.crs.vouchers.bills.viewModal](../../../readable/controllers/C1249--tenant.views.crs.vouchers.bills.viewModal.js) | 27 | 16 |
| [tenant.views.crs.vouchers.payments.viewModal](../../../readable/controllers/C1384--tenant.views.crs.vouchers.payments.viewModal.js) | 37 | 22 |
| [tenant.views.crs.vouchers.jvs.createOrEditModal](../../../readable/controllers/C1362--tenant.views.crs.vouchers.jvs.createOrEditModal.js) | 29 | 19 |
| [tenant.views.crs.vouchers.salaryVouchers.viewModal](../../../readable/controllers/C1438--tenant.views.crs.vouchers.salaryVouchers.viewModal.js) | 6 | 1 |
| [tenant.views.crs.vouchers.stockAdjustment.createOrEdit](../../../readable/controllers/C1449--tenant.views.crs.vouchers.stockAdjustment.createOrEdit.js) | 19 | 11 |
| [tenant.views.crs.vouchers.bankDeposits.viewModal](../../../readable/controllers/C1225--tenant.views.crs.vouchers.bankDeposits.viewModal.js) | 3 | 2 |
| [tenant.views.stock.purchaseReturns.createOrEditModal](../../../readable/controllers/C1692--tenant.views.stock.purchaseReturns.createOrEditModal.js) | 17 | 7 |
| [tenant.views.stock.stockTransfer.createOrEditModal](../../../readable/controllers/C1711--tenant.views.stock.stockTransfer.createOrEditModal.js) | 8 | 5 |
| [tenant.views.stock.itemReturns.createOrEditModal](../../../readable/controllers/C1681--tenant.views.stock.itemReturns.createOrEditModal.js) | 11 | 5 |
| [tenant.views.stock.itemIssues.createOrEditModal](../../../readable/controllers/C1678--tenant.views.stock.itemIssues.createOrEditModal.js) | 11 | 5 |
| [tenant.views.crs.banking.cashBankDeposit.createOrEditModal](../../../readable/controllers/C0606--tenant.views.crs.banking.cashBankDeposit.createOrEditModal.js) | 12 | 9 |
| [tenant.views.crs.vouchers.invoices.changeChargesModal](../../../readable/controllers/C1313--tenant.views.crs.vouchers.invoices.changeChargesModal.js) | 6 | 0 |
| [tenant.views.crs.vouchers.invoices.searchTripModal](../../../readable/controllers/C1352--tenant.views.crs.vouchers.invoices.searchTripModal.js) | 3 | 1 |
| [tenant.views.crs.vouchers.invoices.searchandAddMultipleTripsModal](../../../readable/controllers/C1351--tenant.views.crs.vouchers.invoices.searchandAddMultipleTripsModal.js) | 5 | 3 |
| [tenant.views.crs.vouchers.invoices.uploadDocumentsModal](../../../readable/controllers/C1355--tenant.views.crs.vouchers.invoices.uploadDocumentsModal.js) | 3 | 0 |
| [tenant.views.crs.contacts.searchContactModal](../../../readable/controllers/C0706--tenant.views.crs.contacts.searchContactModal.js) | 7 | 2 |
| [tenant.views.crs.vouchers.invoices.printTemplates.printPreview](../../../readable/controllers/C1359--tenant.views.crs.vouchers.invoices.printTemplates.printPreview.js) | 6 | 0 |
| [tenant.views.crs.vouchers.receipts.uploadDocumentsModal](../../../readable/controllers/C1430--tenant.views.crs.vouchers.receipts.uploadDocumentsModal.js) | 3 | 0 |
| [tenant.views.crs.vouchers.receipts.printTemplates.printPreview](../../../readable/controllers/C1433--tenant.views.crs.vouchers.receipts.printTemplates.printPreview.js) | 2 | 0 |
| [tenant.views.crs.vouchers.creditNotes.uploadDocumentsModal](../../../readable/controllers/C1270--tenant.views.crs.vouchers.creditNotes.uploadDocumentsModal.js) | 3 | 0 |
| [tenant.views.crs.vouchers.creditNotes.allocatedNowForOpeningBalanceModal](../../../readable/controllers/C1257--tenant.views.crs.vouchers.creditNotes.allocatedNowForOpeningBalanceModal.js) | 9 | 3 |
| [tenant.views.crs.vouchers.creditNotes.allocatedNowOnChargesTypeModal](../../../readable/controllers/C1258--tenant.views.crs.vouchers.creditNotes.allocatedNowOnChargesTypeModal.js) | 4 | 1 |
| [tenant.views.crs.vouchers.debitNotes.uploadDocumentsModal](../../../readable/controllers/C1402--tenant.views.crs.vouchers.debitNotes.uploadDocumentsModal.js) | 3 | 0 |
| [tenant.views.crs.vouchers.deposits.allocationForDeposit](../../../readable/controllers/C1287--tenant.views.crs.vouchers.deposits.allocationForDeposit.js) | 10 | 7 |
| [tenant.views.crs.vouchers.deposits.editAllocationForDeposit](../../../readable/controllers/C1291--tenant.views.crs.vouchers.deposits.editAllocationForDeposit.js) | 7 | 2 |
| [tenant.views.crs.vouchers.deposits.editAllocationForDeposit2](../../../readable/controllers/C1292--tenant.views.crs.vouchers.deposits.editAllocationForDeposit2.js) | 9 | 2 |
| [tenant.views.crs.vouchers.deposits.allocationForDeposit2](../../../readable/controllers/C1288--tenant.views.crs.vouchers.deposits.allocationForDeposit2.js) | 12 | 7 |
| [tenant.views.crs.vouchers.deposits.depositRefund](../../../readable/controllers/C1290--tenant.views.crs.vouchers.deposits.depositRefund.js) | 9 | 6 |
| [tenant.views.crs.vouchers.purchaseRequest.openJobVehicleDetailModal](../../../readable/controllers/C1410--tenant.views.crs.vouchers.purchaseRequest.openJobVehicleDetailModal.js) | 4 | 3 |
| [tenant.views.crs.vouchers.purchaseOrders.purchaseAndSalesHistoryModal](../../../readable/controllers/C1400--tenant.views.crs.vouchers.purchaseOrders.purchaseAndSalesHistoryModal.js) | 11 | 2 |
| [tenant.views.fms.vehicleAssignments.searchOrganizationContactModal](../../../readable/controllers/C1565--tenant.views.fms.vehicleAssignments.searchOrganizationContactModal.js) | 3 | 7 |
| [tenant.views.crs.vouchers.purchaseOrders.uploadDocumentsModal](../../../readable/controllers/C1284--tenant.views.crs.vouchers.purchaseOrders.uploadDocumentsModal.js) | 3 | 0 |
| [tenant.views.crs.vouchers.deposits.purchaseOrders.printPreview](../../../readable/controllers/C1405--tenant.views.crs.vouchers.deposits.purchaseOrders.printPreview.js) | 2 | 0 |
| [tenant.views.crs.vouchers.bills.uploadDocumentsModal](../../../readable/controllers/C1248--tenant.views.crs.vouchers.bills.uploadDocumentsModal.js) | 3 | 0 |
| [tenant.views.crs.vouchers.invoices.allocationsViewModel](../../../readable/controllers/C1311--tenant.views.crs.vouchers.invoices.allocationsViewModel.js) | 4 | 1 |
| [tenant.views.crs.vouchers.payments.uploadDocumentsModal](../../../readable/controllers/C1383--tenant.views.crs.vouchers.payments.uploadDocumentsModal.js) | 3 | 0 |
| [tenant.views.crs.vehicles.searchVehicleModal](../../../readable/controllers/C1186--tenant.views.crs.vehicles.searchVehicleModal.js) | 13 | 11 |
| [tenant.views.common.hrm.payrolls.viewModal](../../../readable/controllers/C0388--tenant.views.common.hrm.payrolls.viewModal.js) | 3 | 1 |
| [tenant.views.crs.vouchers.jvs.uploadDocumentsModal](../../../readable/controllers/C1368--tenant.views.crs.vouchers.jvs.uploadDocumentsModal.js) | 3 | 0 |
| [tenant.views.crs.vouchers.jvs.printTemplates.printPreview](../../../readable/controllers/C1370--tenant.views.crs.vouchers.jvs.printTemplates.printPreview.js) | 2 | 0 |
| [tenant.views.crs.vouchers.jvs.printTemplates.printPreview](../../../readable/controllers/C1394--tenant.views.crs.vouchers.jvs.printTemplates.printPreview.js) | 2 | 0 |
| [tenant.views.stock.purchaseReturns.allocatedNowOnItemModal](../../../readable/controllers/C1691--tenant.views.stock.purchaseReturns.allocatedNowOnItemModal.js) | 4 | 1 |
| [tenant.views.crs.contacts.createOrEditModal](../../../readable/controllers/C0703--tenant.views.crs.contacts.createOrEditModal.js) | 45 | 24 |
| [tenant.views.crs.vouchers.payments.printTemplates.printPreview](../../../readable/controllers/C1386--tenant.views.crs.vouchers.payments.printTemplates.printPreview.js) | 2 | 0 |
| [tenant.views.fms.organizationChart.createOrEditUnitModal](../../../readable/controllers/C1559--tenant.views.fms.organizationChart.createOrEditUnitModal.js) | 2 | 2 |
| [tenant.views.crs.contacts.uploadDocumentModal](../../../readable/controllers/C0699--tenant.views.crs.contacts.uploadDocumentModal.js) | 2 | 1 |
| [tenant.views.crs.contacts.uploadDocumentModal](../../../readable/controllers/C0711--tenant.views.crs.contacts.uploadDocumentModal.js) | 2 | 1 |
| [tenant.views.common.documents.uploadDocumentModal](../../../readable/controllers/C0362--tenant.views.common.documents.uploadDocumentModal.js) | 4 | 0 |
| [tenant.views.common.documents.uploadImageModal](../../../readable/controllers/C0363--tenant.views.common.documents.uploadImageModal.js) | 3 | 0 |
| [tenant.views.common.documents.addCreditCardModal](../../../readable/controllers/C0701--tenant.views.common.documents.addCreditCardModal.js) | 4 | 0 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.accounting.ledger.index`: `formatNumber`، `currencyAndRoundingWithThree`، `rounding`، `roundingforView`، `setPrintDateTime`، `clearLocation`، `stateBranchPopoup`، `getlocalDate`، `getVoucherType`، `openVoucher`، `accountChanged`، `searchVehicles`، `searchAccounts`، `searchContact`، `clearContact`، `getLedgerView`، `exportToExcel`، `getDrCr`، `absValue`.
- وحدة `tenant.views.common.locations.searchContactModal`: `cancel`، `branchSelected`، `init`.
- وحدة `tenant.views.crs.vouchers.invoices.createOrEditLimoModal`: `rounding`، `getColspan`، `chargesTypeVoucherLineRepeat`، `sumPerTrip`، `sumTaxPerTrip`، `localize`، `rounding`، `editTripChargesModal`، `branchTaxCode`، `moduleChanged`، `localize`، `agreementChanged`، `cancel`، `calculateTaxPerRow`، `sumAmountTax`، `taxAcceptedChanged`، `addRow`، `getlocalDateTime`، `addLimoRow`، `searchAndAddMultipleTrips`، `uploadDocument`، `getOriginalName`، `searchTrips`، `tripSelected`، `removeLimoRow`، `searchCustomers`، `searchVehicles`، `searchCustomerPopoup`، `setTaxPercentOnTaxCode`، `onCustomerSelect`، `save`، `removeDocument`، `normalizeTripCharges`.
- وحدة `tenant.views.crs.vouchers.receipts.viewModal`: `billingMethodSelected`، `uploadDocument`، `receiptTypeChanged`، `searchAccounts`، `roundingforView`، `getReceiptTypeName`، `contactCardSelected`، `localize`، `rounding`، `amountChanged`، `sumAmountAllocationCharges`، `sumTotalWithAllocation`، `calculateGeneralReceiptAmount`، `getlocalDateTime`، `getlocalDate`، `cancel`، `searchCustomers`، `searchContactGeneralPayment`، `searchVehicles`، `onCustomerSelect`، `sumReceiptAmount`، `sumAmount`، `accountChangedGeneralPayment`، `openprintModal`، `getOriginalName`، `checkCurrentDate`.
- وحدة `tenant.views.crs.vouchers.creditNotes.createOrEditModal`: `localize`، `currencyAndRoundingWithThree`، `rounding`، `customerSettings`، `uploadDocument`، `getOriginalName`، `getAmountInWords`، `moduleChanged`، `isCounterReceivableCreditNote`، `isAssetSaleInvoice`، `showAllocation`، `onAllocationAmountChanged`، `canEditAllocatedAmount`، `onAssetSalesInvoiceOnlyChanged`، `isAssetSalesInvoiceEdit`، `sumAmountAllocation`، `onCustomerSelect`، `onCustomerSelectForAgreement`، `onAgreementSelect`، `getlocalDateTime`، `allocatedNowForOpeningBalance`، `searchCustomers`، `searchCustomerPopoup`، `manuallyAllocatedPopup`، `save`، `removeDocument`، `cancel`.
- وحدة `tenant.views.crs.vouchers.creditNotes.createOrEditModalOnAccount`: `localize`، `rounding`، `searchAgreements`، `onAgreementSelection`، `uploadDocument`، `getOriginalName`، `sumAmountAllocation`، `currencyAndRoundingWithThree`، `onCustomerSelect`، `onCustomerSelectForAgreement`، `onAgreementSelect`، `moduleChanged`، `getlocalDateTime`، `getlocalDate`، `allocatedNowForOpeningBalance`، `searchCustomers`، `searchJobs`، `searchContact`، `searchVehicles`، `searchCustomerPopoup`، `searchAccounts`، `save`، `branchTaxCode`، `setTaxPercentOnTaxCode`، `removeDocument`، `cancel`، `uploader.onSuccessItem`، `uploader.onErrorItem`، `addRow`، `removeRow`، `sumAmountTax`، `accountChanged`، `calculateTaxPerRow`، `calculateDebitAndTax`.
- وحدة `tenant.views.crs.vouchers.debitNotes.createOrEditModal`: `localize`، `rounding`، `agreementChanged`، `cancel`، `customerSettings`، `roundingforView`، `CurrencyFormate`، `sumAmount`، `taxAcceptedChanged`، `addRow`، `removeRow`، `uploadDocument`، `getOriginalName`، `removeDocument`، `onCustomerSelect`، `moduleChanged`، `allocatedNowForOpeningBalance`، `searchCustomers`، `searchAccounts`، `searchVehicles`، `searchCustomerPopoup`، `getlocalDateTime`، `sumAmountAllocation`، `save`، `localize`.
- وحدة `tenant.views.crs.vouchers.deposits.viewModal`: `localize`، `cancel`، `getTypeById`، `roundingforView`، `useDeposit`، `getOriginalName`، `getExpiryOrDays`، `openUseDeposit`، `openRefundDeposit`.
- وحدة `tenant.views.crs.vouchers.purchaseOrders.createOrEditModal`: `getWorkTypeText`، `supplierSelected`، `rounding`، `roundingforView`، `openJobVehicleModal`، `searchVehicles`، `searchSupplier`، `purchaseAndSalesHistoryModel`، `searchSupplierPopoup`، `searchAdditionalDriverPopoup`، `addRow`، `removeRow`، `clearOrder`، `branchTaxCode`، `setTaxPercentOnTaxCode`، `calculateTaxPerRow`، `searchMasterAgreement`، `sumAmount`، `sumAmountTax`، `searchItems`، `pOUnitPriceBasedOnLastSupplier`، `calculateItemPrice`، `getUnitOfMeasures`، `searchJobs`، `onItemSelected`، `onJobSelectedForVoucherline`، `uploadDocument`، `getOriginalName`، `removeDocument`، `save`، `cancel`، `searchModel`.
- وحدة `tenant.views.crs.vouchers.cashWithdrawals.viewModal`: `cancel`، `getlocalDateTime`، `roundingforView`، `getlocalDate`.
- وحدة `tenant.views.crs.vouchers.bills.viewModal`: `rounding`، `searchContactGeneralPayment`، `getTaxCategoryName`، `getOriginalName`، `roundingforView`، `uploadDocument`، `accountChanged`، `getlocalDate`، `searchAdditionalDriverPopoup`، `taxAcceptedChanged`، `calculateTaxPerRow`، `sumAmount`، `sumAmountTax`، `searchAccounts`، `searchVehicles`، `searchPrepaidExpense`، `searchSupplier`، `searchJobs`، `clearBill`، `removeDocument`، `cancel`، `searchItems`، `calculateItemPrice`، `getUnitOfMeasures`، `getStockGrnByRefNo`، `getAssetGrnByRefNo`، `openViewAllocationsModal`.
- وحدة `tenant.views.crs.vouchers.payments.viewModal`: `searchVehicles`، `searchContactGeneralPayment`، `searchJobs`، `rounding`، `roundingforView`، `localize`، `getOriginalName`، `uploadDocument`، `insertDueAmountOnClick`، `searchAdditionalDriverPopoup`، `paymentTypeChanged`، `accountChangedGeneralPayment`، `accountChangedGeneralPaymentEdit`، `onContactChange`، `amountChanged`، `searchContact`، `searchAccounts`، `searchVehicles`، `sumAmountTax`، `searchPrepaidExpense`، `sumAmountExpensePaymentReverse`، `sumAmount`، `sumAmountAllocation`، `getlocalDateTime`، `searchItems`، `calculateItemPrice`، `getUnitOfMeasures`، `calculateTaxPerRow`، `searchContactPopoup`، `searchVehiclePopup`، `payrollTypes`، `getDepartmentName`، `addRow`، `cancel`، `checkCurrentDate`، `viewPayrollById`، `loadCostCenterInLine`.
- وحدة `tenant.views.crs.vouchers.jvs.createOrEditModal`: `rounding`، `roundingforView`، `searchAccounts`، `searchContact`، `uploadDocument`، `getOriginalName`، `accountChanged`، `searchPrepaidExpense`، `isStockAccount`، `productSelected`، `searchVehicles`، `searchItems`، `searchJobs`، `searchAgreements`، `searchMasterAgreement`، `considerTaxAsTaxPercentage`، `sumAmount`، `sumAmountExcel`، `sumAmountBeforeSaving`، `getlocalDate`، `addRow`، `removeRow`، `cancel`، `uploader.onSuccessItem`، `uploader.onErrorItem`، `isbranchNull`، `isdateNull`، `save`، `removeDocument`.
- وحدة `tenant.views.crs.vouchers.salaryVouchers.viewModal`: `CurrencyFormate`، `roundingforView`، `salaryVoucherTypes`، `getlocalDateTime`، `cancel`، `getSalaryVoucherForView`.
- وحدة `tenant.views.crs.vouchers.stockAdjustment.createOrEdit`: `searchAccounts`، `roundingforView`، `searchContact`، `changeInOut`، `accountChanged`، `searchItems`، `productSelected`، `searchJobs`، `totalAmount`، `sumAmount`، `getlocalDate`، `addRow`، `removeRow`، `cancel`، `uploader.onSuccessItem`، `uploader.onErrorItem`، `isbranchNull`، `isdateNull`، `save`.
- وحدة `tenant.views.crs.vouchers.bankDeposits.viewModal`: `cancel`، `save`، `roundingforView`.
- وحدة `tenant.views.stock.purchaseReturns.createOrEditModal`: `localize`، `rounding`، `getVoucherSubTypeName`، `cancel`، `roundingforView`، `sumAmount`، `taxAcceptedChanged`، `onSupplierSelect`، `moduleChanged`، `searchSuppliers`، `searchAccounts`، `manuallyAllocatedPopup`، `searchSupplierPopoup`، `getlocalDateTime`، `sumAmountAllocation`، `save`، `localize`.
- وحدة `tenant.views.stock.stockTransfer.createOrEditModal`: `cancel`، `clearModelData`، `productSelected`، `addRow`، `removeRow`، `searchItems`، `getBranchTo`، `save`.
- وحدة `tenant.views.stock.itemReturns.createOrEditModal`: `cancel`، `jobSelected`، `getJobType`، `clearModelData`، `productSelected`، `addRow`، `removeRow`، `searchItems`، `searchJobs`، `sumAmount`، `save`.
- وحدة `tenant.views.stock.itemIssues.createOrEditModal`: `jobSelected`، `cancel`، `getJobType`، `clearModelData`، `productSelected`، `addRow`، `removeRow`، `searchItems`، `searchJobs`، `sumAmount`، `save`.
- وحدة `tenant.views.crs.banking.cashBankDeposit.createOrEditModal`: `rounding`، `getVoucherType`، `applyChangeToAll`، `autoAllocation`، `changeRoundOffAmount`، `save`، `cancel`، `applyChange`، `calculateBalance`، `formatNumber`، `getlocalDateTime`، `filterVouchersData`.
- وحدة `tenant.views.crs.vouchers.invoices.changeChargesModal`: `cancel`، `rounding`، `sumChargesTax`، `calculateTaxPerRow`، `getlocalDateTime`، `save`.
- وحدة `tenant.views.crs.vouchers.invoices.searchTripModal`: `searchTrips`، `save`، `cancel`.
- وحدة `tenant.views.crs.vouchers.invoices.searchandAddMultipleTripsModal`: `cancel`، `getlocalDateTime`، `applyChange`، `save`، `getTrips`.
- وحدة `tenant.views.crs.vouchers.invoices.uploadDocumentsModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.crs.contacts.searchContactModal`: `searchContacts`، `cancel`، `showAddContact`، `contactSelected`، `contactEdit`، `getContactsList`، `getNameWithCode`.
- وحدة `tenant.views.crs.vouchers.invoices.printTemplates.printPreview`: `exportToPDF`، `exportToWord`، `exportPrintToWord`، `cancel`، `ok`، `getTemplateUrl`.
- وحدة `tenant.views.crs.vouchers.receipts.uploadDocumentsModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.crs.vouchers.receipts.printTemplates.printPreview`: `cancel`، `getTemplateUrl`.
- وحدة `tenant.views.crs.vouchers.creditNotes.uploadDocumentsModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.crs.vouchers.creditNotes.allocatedNowForOpeningBalanceModal`: `searchAccounts`، `rounding`، `sumAmount`، `searchRentalOrLeaseAgreement`، `cancel`، `localize`، `addRow`، `removeRow`، `save`.
- وحدة `tenant.views.crs.vouchers.creditNotes.allocatedNowOnChargesTypeModal`: `cancel`، `saveAllocateCharges`، `rounding`، `changeAllocateAmount`.
- وحدة `tenant.views.crs.vouchers.debitNotes.uploadDocumentsModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.crs.vouchers.deposits.allocationForDeposit`: `amountChanged`، `getlocalDateTime`، `getlocalDate`، `cancel`، `rounding`، `searchCustomers`، `onCustomerSelect`، `sumAmount`، `searchCustomerPopoup`، `save`.
- وحدة `tenant.views.crs.vouchers.deposits.editAllocationForDeposit`: `cancel`، `localize`، `rounding`، `sumAmount`، `getlocalDateTime`، `insertDueAmountOnClick`، `save`.
- وحدة `tenant.views.crs.vouchers.deposits.editAllocationForDeposit2`: `cancel`، `localize`، `rounding`، `sumAmount`، `getlocalDateTime`، `insertDueAmountOnClick`، `addChargesType`، `addInHeadRow`، `save`.
- وحدة `tenant.views.crs.vouchers.deposits.allocationForDeposit2`: `amountChanged`، `getlocalDateTime`، `getlocalDate`، `cancel`، `rounding`، `searchCustomers`، `onCustomerSelect`، `sumAmount`، `searchCustomerPopoup`، `save`، `addChargesType`، `addInHeadRow`.
- وحدة `tenant.views.crs.vouchers.deposits.depositRefund`: `amountChanged`، `getlocalDateTime`، `getlocalDate`، `cancel`، `searchCustomers`، `onCustomerSelect`، `sumAmount`، `searchCustomerPopoup`، `save`.
- وحدة `tenant.views.crs.vouchers.purchaseRequest.openJobVehicleDetailModal`: `localize`، `cancel`، `searchModel`، `getTariffGroups`.
- وحدة `tenant.views.crs.vouchers.purchaseOrders.purchaseAndSalesHistoryModal`: `CurrencyFormate`، `roundingforView`، `dateRangeCheck`، `dateRangeModelChanged`، `isPrintEnabled`، `getlocalDateTime`، `getPurchaseHistory`، `customFilter`، `getSaleHistory`، `openprintModal`، `cancel`.
- وحدة `tenant.views.fms.vehicleAssignments.searchOrganizationContactModal`: `contactSelected`، `organizationSelected`، `cancel`.
- وحدة `tenant.views.crs.vouchers.purchaseOrders.uploadDocumentsModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.crs.vouchers.deposits.purchaseOrders.printPreview`: `cancel`، `getTemplateUrl`.
- وحدة `tenant.views.crs.vouchers.bills.uploadDocumentsModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.crs.vouchers.invoices.allocationsViewModel`: `cancel`، `sumAmount`، `localize`، `getlocalDate`.
- وحدة `tenant.views.crs.vouchers.payments.uploadDocumentsModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.crs.vehicles.searchVehicleModal`: `statusChanged`، `searchModel`، `cancel`، `clearInput`، `clearVehicle`، `getlocalDateTime`، `fromDateTimeChanged`، `searchVehicles`، `searchVehiclesFilters`، `exportToExcelByAgreement`، `vehicleSelected`، `getBookingDate`، `getTeriffGroups`.
- وحدة `tenant.views.common.hrm.payrolls.viewModal`: `showSalaryType`، `cancel`، `rounding`.
- وحدة `tenant.views.crs.vouchers.jvs.uploadDocumentsModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.crs.vouchers.jvs.printTemplates.printPreview`: `cancel`، `getTemplateUrl`.
- وحدة `tenant.views.crs.vouchers.jvs.printTemplates.printPreview`: `cancel`، `getTemplateUrl`.
- وحدة `tenant.views.stock.purchaseReturns.allocatedNowOnItemModal`: `cancel`، `saveAllocateCharges`، `rounding`، `changeAllocateAmount`.
- وحدة `tenant.views.crs.contacts.createOrEditModal`: `localize`، `removeExternalIdRow`، `addExternalIdRow`، `getContactExternalType`، `isContactExternalType`، `getlocalDate`، `getlocalDateTime`، `getCardType`، `removeRow`، `searchSalesPersons`، `searchUsersWithDesignation`، `searchSalesPersonPopoup`، `salesPersonSelected`، `searchDebtCollectorPopoup`، `searchCustomLookup`، `getCustomLookups`، `scanDocument`، `openUploadDocument`، `openUploadPicture`، `addCreditCardRow`، `updateCreditCardRow`، `save`، `cancel`، `isPersonVerifiedChange`، `doesIdentityDoucmentExist`، `addIndentityDocument`، `getIdentificationDocumentType`، `removeIndentityDocument`، `removeDoc`، `isFieldMondatory`، `searchCountries`، `emiratesDataReader`، `emiratesDataFieldManager`، `getTariffCards`، `getTariffCardForContact`، `isDocument`، `maskCreditCard`، `getAdvanceSettings`، `getHighLightBlackListCountries`، `getNationalIdFormates`، `nationalIdFormate`، `onOverRideChange`، `resetDocumentNo`، `nationIdMaskInput`، `handleResidenceStatusChange`.
- وحدة `tenant.views.crs.vouchers.payments.printTemplates.printPreview`: `cancel`، `getTemplateUrl`.
- وحدة `tenant.views.fms.organizationChart.createOrEditUnitModal`: `save`، `cancel`.
- وحدة `tenant.views.crs.contacts.uploadDocumentModal`: `save`، `cancel`.
- وحدة `tenant.views.crs.contacts.uploadDocumentModal`: `save`، `cancel`.
- وحدة `tenant.views.common.documents.uploadDocumentModal`: `uploadHeader`، `uploader.onBeforeUploadItem`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.common.documents.uploadImageModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.common.documents.addCreditCardModal`: `ab`، `cardNumberChanged`، `save`، `cancel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.commonLookup.getLocationsActiveAndInActive` | POST | api/services/app/commonLookup/GetLocationsActiveAndInActive | [المصدر](../../../raw/application.js#L397088) |
| `abp.services.app.costCenter.searchCostCenters` | POST | api/services/app/costCenter/SearchCostCenters | [المصدر](../../../raw/application.js#L397113) |
| `abp.services.app.journal.getLedgerViewForMulticurrency` | POST | api/services/app/journal/GetLedgerViewForMulticurrency | [المصدر](../../../raw/application.js#L127457) |
| `abp.services.app.journal.getLedgerView` | POST | api/services/app/journal/GetLedgerView | [المصدر](../../../raw/application.js#L127465) |
| `abp.services.app.vehicle.searchVehicles` | POST | api/services/app/vehicle/SearchVehicles | [المصدر](../../../raw/application.js#L312838) |
| `abp.services.app.account.searchAccountsForSubLookUpInLedger` | POST | api/services/app/account/SearchAccountsForSubLookUpInLedger | [المصدر](../../../raw/application.js#L127414) |
| `abp.services.app.directory.searchByContactGroup` | POST | api/services/app/directory/SearchByContactGroup | [المصدر](../../../raw/application.js#L396893) |
| `abp.services.app.journal.exportLedgerToExcel` | POST | api/services/app/journal/ExportLedgerToExcel | [المصدر](../../../raw/application.js#L127485) |
| `abp.services.app.commonLookup.getTariffGroups` | POST | api/services/app/commonLookup/GetTariffGroups | [المصدر](../../../raw/application.js#L313062) |
| `abp.services.app.commonLookup.getLocations` | POST | api/services/app/commonLookup/GetLocations | [المصدر](../../../raw/application.js#L182597) |
| `abp.services.app.commonLookup.getLocationById` | POST | api/services/app/commonLookup/GetLocationById | [المصدر](../../../raw/application.js#L380231) |
| `abp.services.app.commonLookup.searchTripsForInvoice` | POST | api/services/app/commonLookup/SearchTripsForInvoice | [المصدر](../../../raw/application.js#L364764) |
| `abp.services.app.directory.search` | POST | api/services/app/directory/Search | [المصدر](../../../raw/application.js#L182771) |
| `abp.services.app.invoice.createOrUpdateInvoice` | POST | api/services/app/invoice/CreateOrUpdateInvoice | [المصدر](../../../raw/application.js#L343427) |
| `abp.services.app.invoice.getLimoInvoiceForEdit` | POST | api/services/app/invoice/GetLimoInvoiceForEdit | [المصدر](../../../raw/application.js#L343500) |
| `abp.services.app.commonLookup.getContactCards` | POST | api/services/app/commonLookup/GetContactCards | [المصدر](../../../raw/application.js#L393485) |
| `abp.services.app.allocation.getAgreementsAllocations` | POST | api/services/app/allocation/GetAgreementsAllocations | [المصدر](../../../raw/application.js#L393502) |
| `abp.services.app.account.searchAccountsForSubLookUp` | POST | api/services/app/account/SearchAccountsForSubLookUp | [المصدر](../../../raw/application.js#L466775) |
| `abp.services.app.billingMethod.getBillingMethods` | POST | api/services/app/billingMethod/GetBillingMethods | [المصدر](../../../raw/application.js#L338998) |
| `abp.services.app.allocation.getAllocationsForEdit2` | POST | api/services/app/allocation/GetAllocationsForEdit2 | [المصدر](../../../raw/application.js#L338558) |
| `abp.services.app.allocation.getAllocationsForEdit` | POST | api/services/app/allocation/GetAllocationsForEdit | [المصدر](../../../raw/application.js#L339295) |
| `abp.services.app.commonLookup.getBankAccountsForSelection` | POST | api/services/app/commonLookup/GetBankAccountsForSelection | [المصدر](../../../raw/application.js#L339111) |
| `abp.services.app.commonLookup.validateCheque` | POST | [object Object] | [المصدر](../../../raw/application.js#L393936) |
| `abp.services.app.receiptSearch.getReceiptForEdit` | POST | api/services/app/receiptSearch/GetReceiptForEdit | [المصدر](../../../raw/application.js#L393994) |
| `abp.services.app.commonLookup.getCurrenciesAll` | POST | api/services/app/commonLookup/GetCurrenciesAll | [المصدر](../../../raw/application.js#L377955) |
| `abp.services.app.commonAgreement.getAgreement` | POST | api/services/app/commonAgreement/GetAgreement | [المصدر](../../../raw/application.js#L331843) |
| `abp.services.app.commonAgreement.getAllAgreementsOnCustomer` | POST | api/services/app/commonAgreement/GetAllAgreementsOnCustomer | [المصدر](../../../raw/application.js#L331227) |
| `abp.services.app.commonLookup.getVoucherReasons` | POST | api/services/app/commonLookup/GetVoucherReasons | [المصدر](../../../raw/application.js#L331329) |
| `abp.services.app.creditNote.createOrUpdateCreditNote` | POST | api/services/app/creditNote/CreateOrUpdateCreditNote | [المصدر](../../../raw/application.js#L330868) |
| `abp.services.app.creditNote.getCreditNoteForEdit` | POST | api/services/app/creditNote/GetCreditNoteForEdit | [المصدر](../../../raw/application.js#L331792) |
| `abp.services.app.agreement.searchAgreementForVoucherLines` | POST | api/services/app/agreement/SearchAgreementForVoucherLines | [المصدر](../../../raw/application.js#L366767) |
| `abp.services.app.job.searchJobs` | POST | api/services/app/job/SearchJobs | [المصدر](../../../raw/application.js#L397065) |
| `abp.services.app.creditNote.createOrUpdateOnAccountCreditNote` | POST | api/services/app/creditNote/CreateOrUpdateOnAccountCreditNote | [المصدر](../../../raw/application.js#L331491) |
| `abp.services.app.creditNote.importFromExcel` | POST | [object Object] | [المصدر](../../../raw/application.js#L331568) |
| `abp.services.app.debitNote.createOrUpdateDebitNote` | POST | api/services/app/debitNote/CreateOrUpdateDebitNote | [المصدر](../../../raw/application.js#L335361) |
| `abp.services.app.chargesSetting.getConfiguredChargesTypes` | POST | api/services/app/chargesSetting/GetConfiguredChargesTypes | [المصدر](../../../raw/application.js#L466934) |
| `abp.services.app.debitNote.getDebitNoteForEdit` | POST | api/services/app/debitNote/GetDebitNoteForEdit | [المصدر](../../../raw/application.js#L335408) |
| `abp.services.app.deposit.updateUsedDeposit` | POST | api/services/app/deposit/UpdateUsedDeposit | [المصدر](../../../raw/application.js#L341312) |
| `abp.services.app.deposit.getRefundtAmountOnDeposit` | POST | [object Object] | [المصدر](../../../raw/application.js#L341345) |
| `abp.services.app.deposit.getAllocatedAmountOnDeposit` | POST | [object Object] | [المصدر](../../../raw/application.js#L339066) |
| `abp.services.app.deposit.getDepositForEdit` | POST | api/services/app/deposit/GetDepositForEdit | [المصدر](../../../raw/application.js#L341482) |
| `abp.services.app.asset.getAssetType` | POST | api/services/app/asset/GetAssetType | [المصدر](../../../raw/application.js#L328442) |
| `abp.services.app.leaseMasterAgreement.searchMasterAgreementsForVouchers` | POST | api/services/app/leaseMasterAgreement/SearchMasterAgreementsForVouchers | [المصدر](../../../raw/application.js#L366774) |
| `abp.services.app.item.searchItems` | POST | api/services/app/item/SearchItems | [المصدر](../../../raw/application.js#L464645) |
| `abp.services.app.purchaseOrder.getPOUnitPriceBasedOnLastSupplier` | POST | api/services/app/purchaseOrder/GetPOUnitPriceBasedOnLastSupplier | [المصدر](../../../raw/application.js#L380428) |
| `abp.services.app.unitOfMeasure.getUnitOfMeasures` | POST | api/services/app/unitOfMeasure/GetUnitOfMeasures | [المصدر](../../../raw/application.js#L377669) |
| `abp.services.app.purchaseOrder.createOrUpdatePurchaseOrder` | POST | api/services/app/purchaseOrder/CreateOrUpdatePurchaseOrder | [المصدر](../../../raw/application.js#L380537) |
| `abp.services.app.vehicleModel.searchVehicleModelsNew` | POST | api/services/app/vehicleModel/SearchVehicleModelsNew | [المصدر](../../../raw/application.js#L312735) |
| `abp.services.app.purchaseRequest.getPurchaseRequestForEdit` | POST | api/services/app/purchaseRequest/GetPurchaseRequestForEdit | [المصدر](../../../raw/application.js#L380585) |
| `abp.services.app.assetType.getAssetDefaultType` | POST | api/services/app/assetType/GetAssetDefaultType | [المصدر](../../../raw/application.js#L380652) |
| `abp.services.app.commonQuotation.getLeaseQuotationToCreatePO` | POST | api/services/app/commonQuotation/GetLeaseQuotationToCreatePO | [المصدر](../../../raw/application.js#L380649) |
| `abp.services.app.purchaseOrder.getPurchaseOrderForEdit` | POST | api/services/app/purchaseOrder/GetPurchaseOrderForEdit | [المصدر](../../../raw/application.js#L380678) |
| `abp.services.app.cashWithdrawalSearch.getCashWithdrawalForView` | POST | api/services/app/cashWithdrawalSearch/GetCashWithdrawalForView | [المصدر](../../../raw/application.js#L329551) |
| `abp.services.app.bill.getexpenseaccounts` | POST | api/services/app/bill/Getexpenseaccounts | [المصدر](../../../raw/application.js#L328750) |
| `abp.services.app.expenseType.getExpenseTypes` | POST | api/services/app/expenseType/GetExpenseTypes | [المصدر](../../../raw/application.js#L377826) |
| `abp.services.app.grn.getStockGrnByRefNo` | POST | [object Object] | [المصدر](../../../raw/application.js#L328873) |
| `abp.services.app.grn.getAssetGrnByRefNo` | POST | [object Object] | [المصدر](../../../raw/application.js#L328882) |
| `abp.services.app.bankAccount.getBankAccountsForSelection` | POST | api/services/app/bankAccount/GetBankAccountsForSelection | [المصدر](../../../raw/application.js#L328892) |
| `abp.services.app.bill.getBillForEdit` | POST | api/services/app/bill/GetBillForEdit | [المصدر](../../../raw/application.js#L328924) |
| `abp.services.app.currency.getCurrencies` | POST | api/services/app/currency/GetCurrencies | [المصدر](../../../raw/application.js#L183468) |
| `abp.services.app.account.getStaffAccounts` | POST | api/services/app/account/GetStaffAccounts | [المصدر](../../../raw/application.js#L377288) |
| `abp.services.app.payment.getexpenseaccounts` | POST | api/services/app/payment/Getexpenseaccounts | [المصدر](../../../raw/application.js#L377386) |
| `abp.services.app.department.getDepartment` | POST | api/services/app/department/GetDepartment | [المصدر](../../../raw/application.js#L377802) |
| `abp.services.app.payment.getPaymentForView` | POST | api/services/app/payment/GetPaymentForView | [المصدر](../../../raw/application.js#L377941) |
| `abp.services.app.commonLookup.getCurrencies` | POST | api/services/app/commonLookup/GetCurrencies | [المصدر](../../../raw/application.js#L377950) |
| `abp.services.app.tenantSettings.getExpenseAccountsAdvanceSetting` | POST | api/services/app/tenantSettings/GetExpenseAccountsAdvanceSetting | [المصدر](../../../raw/application.js#L396852) |
| `abp.services.app.jV.getexpenseaccounts` | POST | api/services/app/jV/Getexpenseaccounts | [المصدر](../../../raw/application.js#L366720) |
| `abp.services.app.jV.isStockAccount` | POST | api/services/app/jV/IsStockAccount | [المصدر](../../../raw/application.js#L366731) |
| `abp.services.app.division.searchDivisions` | POST | api/services/app/division/SearchDivisions | [المصدر](../../../raw/application.js#L397122) |
| `abp.services.app.jV.importFromExcel` | POST | [object Object] | [المصدر](../../../raw/application.js#L367126) |
| `abp.services.app.jV.createOrUpdateJV` | POST | api/services/app/jV/CreateOrUpdateJV | [المصدر](../../../raw/application.js#L367337) |
| `abp.services.app.jV.getLinkedAccountId` | POST | api/services/app/jV/GetLinkedAccountId | [المصدر](../../../raw/application.js#L367367) |
| `abp.services.app.jV.getJVForEdit` | POST | api/services/app/jV/GetJVForEdit | [المصدر](../../../raw/application.js#L367384) |
| `abp.services.app.salaryVoucher.getSalaryVoucherForEdit` | POST | api/services/app/salaryVoucher/GetSalaryVoucherForEdit | [المصدر](../../../raw/application.js#L395155) |
| `abp.services.app.stockAdjustment.createOrUpdateStockAdjustment` | POST | api/services/app/stockAdjustment/CreateOrUpdateStockAdjustment | [المصدر](../../../raw/application.js#L397434) |
| `abp.services.app.stockAdjustment.getStockAdjustmentForEdit` | POST | api/services/app/stockAdjustment/GetStockAdjustmentForEdit | [المصدر](../../../raw/application.js#L397469) |
| `abp.services.app.bankDeposit.createOrUpdateBankDeposit` | POST | api/services/app/bankDeposit/CreateOrUpdateBankDeposit | [المصدر](../../../raw/application.js#L320467) |
| `abp.services.app.bankDeposit.getBankDepositForEdit` | POST | api/services/app/bankDeposit/GetBankDepositForEdit | [المصدر](../../../raw/application.js#L320482) |
| `abp.services.app.purchaseReturn.createOrUpdatePurchaseReturn` | POST | api/services/app/purchaseReturn/CreateOrUpdatePurchaseReturn | [المصدر](../../../raw/application.js#L466918) |
| `abp.services.app.purchaseReturn.getPurchaseReturnForEdit` | POST | api/services/app/purchaseReturn/GetPurchaseReturnForEdit | [المصدر](../../../raw/application.js#L466968) |
| `abp.services.app.stockTransfer.createOrUpdateStockTransfer` | POST | api/services/app/stockTransfer/CreateOrUpdateStockTransfer | [المصدر](../../../raw/application.js#L470732) |
| `abp.services.app.stockTransfer.getStockTransferForEdit` | POST | api/services/app/stockTransfer/GetStockTransferForEdit | [المصدر](../../../raw/application.js#L470748) |
| `abp.services.app.job.getItemReturnRows` | POST | api/services/app/job/GetItemReturnRows | [المصدر](../../../raw/application.js#L465122) |
| `abp.services.app.job.searchJobDetails` | POST | api/services/app/job/SearchJobDetails | [المصدر](../../../raw/application.js#L464652) |
| `abp.services.app.itemReturn.createOrUpdateItemReturn` | POST | api/services/app/itemReturn/CreateOrUpdateItemReturn | [المصدر](../../../raw/application.js#L465227) |
| `abp.services.app.itemReturn.getItemReturnForEdit` | POST | api/services/app/itemReturn/GetItemReturnForEdit | [المصدر](../../../raw/application.js#L465243) |
| `abp.services.app.itemIssue.createOrUpdateItemIssue` | POST | api/services/app/itemIssue/CreateOrUpdateItemIssue | [المصدر](../../../raw/application.js#L464683) |
| `abp.services.app.itemRequisition.getItemRequisitionForEdit` | POST | api/services/app/itemRequisition/GetItemRequisitionForEdit | [المصدر](../../../raw/application.js#L464699) |
| `abp.services.app.itemIssue.getItemIssueForEdit` | POST | api/services/app/itemIssue/GetItemIssueForEdit | [المصدر](../../../raw/application.js#L464729) |
| `abp.services.app.cashBankDeposit.createOrUpdateCashDeposit` | POST | api/services/app/cashBankDeposit/CreateOrUpdateCashDeposit | [المصدر](../../../raw/application.js#L164076) |
| `abp.services.app.cashBankDeposit.getCashDepositForEdit` | POST | api/services/app/cashBankDeposit/GetCashDepositForEdit | [المصدر](../../../raw/application.js#L164243) |
| `abp.services.app.cashBankDeposit.getCashDepositForEditView` | POST | api/services/app/cashBankDeposit/GetCashDepositForEditView | [المصدر](../../../raw/application.js#L164223) |
| `abp.services.app.commonLookup.getTripTypes` | POST | api/services/app/commonLookup/GetTripTypes | [المصدر](../../../raw/application.js#L364730) |
| `abp.services.app.limoTripSearch.searchTripsToInvoice` | POST | api/services/app/limoTripSearch/SearchTripsToInvoice | [المصدر](../../../raw/application.js#L364738) |
| `abp.services.app.directory.searchDirectoryPaged` | POST | api/services/app/directory/SearchDirectoryPaged | [المصدر](../../../raw/application.js#L184666) |
| `abp.services.app.account.searchAccounts` | POST | api/services/app/account/SearchAccounts | [المصدر](../../../raw/application.js#L329686) |
| `abp.services.app.commonLookup.searchRentalOrLeaseAgreement` | POST | api/services/app/commonLookup/SearchRentalOrLeaseAgreement | [المصدر](../../../raw/application.js#L329705) |
| `abp.services.app.chargesSetting.getConfiguredChargesTypesDistinct` | POST | api/services/app/chargesSetting/GetConfiguredChargesTypesDistinct | [المصدر](../../../raw/application.js#L329715) |
| `abp.services.app.creditNote.getChargesTypeAllocations` | POST | api/services/app/creditNote/GetChargesTypeAllocations | [المصدر](../../../raw/application.js#L329795) |
| `abp.services.app.deposit.useDepositWithAllocations` | POST | api/services/app/deposit/UseDepositWithAllocations | [المصدر](../../../raw/application.js#L338514) |
| `abp.services.app.allocation.saveAllocations` | POST | api/services/app/allocation/SaveAllocations | [المصدر](../../../raw/application.js#L339427) |
| `abp.services.app.deposit.depositRefund` | POST | api/services/app/deposit/DepositRefund | [المصدر](../../../raw/application.js#L339174) |
| `abp.services.app.vehicle.getNextFleetCode` | POST | api/services/app/vehicle/GetNextFleetCode | [المصدر](../../../raw/application.js#L384613) |
| `abp.services.app.stockReport.getItemsPurchaseHistory` | POST | api/services/app/stockReport/GetItemsPurchaseHistory | [المصدر](../../../raw/application.js#L382076) |
| `abp.services.app.stockReport.getItemsSaleHistory` | POST | api/services/app/stockReport/GetItemsSaleHistory | [المصدر](../../../raw/application.js#L382155) |
| `abp.services.app.organizationChart.getOrganizationUnits` | POST | api/services/app/organizationChart/GetOrganizationUnits | [المصدر](../../../raw/application.js#L432892) |
| `abp.services.app.organizationChart.moveOrganizationUnit` | POST | api/services/app/organizationChart/MoveOrganizationUnit | [المصدر](../../../raw/application.js#L432955) |
| `abp.services.app.organizationChart.getOrganizationUnitAllUsers` | POST | api/services/app/organizationChart/GetOrganizationUnitAllUsers | [المصدر](../../../raw/application.js#L433187) |
| `abp.services.app.organizationChart.addUserToOrganizationUnit` | POST | api/services/app/organizationChart/AddUserToOrganizationUnit | [المصدر](../../../raw/application.js#L433107) |
| `abp.services.app.organizationChart.removeUserFromOrganizationUnit` | POST | api/services/app/organizationChart/RemoveUserFromOrganizationUnit | [المصدر](../../../raw/application.js#L433127) |
| `abp.services.app.organizationChart.isInOrganizationUnit` | POST | api/services/app/organizationChart/IsInOrganizationUnit | [المصدر](../../../raw/application.js#L433153) |
| `abp.services.app.allocation.getAllocations` | POST | api/services/app/allocation/GetAllocations | [المصدر](../../../raw/application.js#L342588) |
| `abp.services.app.vehicle.searchVehiclesPagedWorkShop` | POST | api/services/app/vehicle/SearchVehiclesPagedWorkShop | [المصدر](../../../raw/application.js#L312796) |
| `abp.services.app.vehicle.searchVehiclesPagedByAgreement` | POST | [object Object] | [المصدر](../../../raw/application.js#L312800) |
| `abp.services.app.vehicle.searchVehiclesPaged` | POST | api/services/app/vehicle/SearchVehiclesPaged | [المصدر](../../../raw/application.js#L312803) |
| `abp.services.app.vehicle.exportToExcelByAgreement` | POST | api/services/app/vehicle/ExportToExcelByAgreement | [المصدر](../../../raw/application.js#L312885) |
| `abp.services.app.payroll.getPayroll` | POST | api/services/app/payroll/GetPayroll | [المصدر](../../../raw/application.js#L100016) |
| `abp.services.app.purchaseReturn.getItemAllocations` | POST | api/services/app/purchaseReturn/GetItemAllocations | [المصدر](../../../raw/application.js#L466524) |
| `abp.services.app.chargesSetting.getChargesTypes` | POST | api/services/app/chargesSetting/GetChargesTypes | [المصدر](../../../raw/application.js#L182581) |
| `abp.services.app.directory.searchSalesPersonOne` | POST | api/services/app/directory/SearchSalesPersonOne | [المصدر](../../../raw/application.js#L182778) |
| `abp.services.app.commonLookup.searchCustomLookups` | POST | api/services/app/commonLookup/SearchCustomLookups | [المصدر](../../../raw/application.js#L182861) |
| `abp.services.app.commonLookup.getCustomLookups` | POST | api/services/app/commonLookup/GetCustomLookups | [المصدر](../../../raw/application.js#L182869) |
| `abp.services.app.country.searchCountries` | POST | api/services/app/country/SearchCountries | [المصدر](../../../raw/application.js#L183560) |
| `abp.services.app.person.createOrUpdatePerson` | POST | api/services/app/person/CreateOrUpdatePerson | [المصدر](../../../raw/application.js#L183236) |
| `abp.services.app.contactGroup.getContactGroupsOnContactType` | POST | api/services/app/contactGroup/GetContactGroupsOnContactType | [المصدر](../../../raw/application.js#L183448) |
| `abp.services.app.taxCode.getTaxCodes` | POST | api/services/app/taxCode/GetTaxCodes | [المصدر](../../../raw/application.js#L183456) |
| `abp.services.app.tariffCard.getActiveTariffCards` | POST | api/services/app/tariffCard/GetActiveTariffCards | [المصدر](../../../raw/application.js#L183703) |
| `abp.services.app.tariffCard.getTariffCardById` | POST | api/services/app/tariffCard/GetTariffCardById | [المصدر](../../../raw/application.js#L183716) |
| `abp.services.app.person.getAdvanceSettings` | POST | api/services/app/person/GetAdvanceSettings | [المصدر](../../../raw/application.js#L183744) |
| `abp.services.app.person.getHighLightBlackListCountry` | POST | [object Object] | [المصدر](../../../raw/application.js#L183768) |
| `abp.services.app.person.getNationalIdFormate` | POST | [object Object] | [المصدر](../../../raw/application.js#L183774) |
| `abp.services.app.person.getPersonForEdit` | POST | api/services/app/person/GetPersonForEdit | [المصدر](../../../raw/application.js#L183903) |
| `abp.services.app.person.getContactCards` | POST | api/services/app/person/GetContactCards | [المصدر](../../../raw/application.js#L184004) |
| `abp.services.app.commonLookup.validateCreditLimit` | POST | api/services/app/commonLookup/ValidateCreditLimit | [المصدر](../../../raw/application.js#L184099) |
| `abp.services.app.organizationChart.updateOrganizationUnit` | POST | api/services/app/organizationChart/UpdateOrganizationUnit | [المصدر](../../../raw/application.js#L430943) |
| `abp.services.app.organizationChart.createOrganizationUnit` | POST | api/services/app/organizationChart/CreateOrganizationUnit | [المصدر](../../../raw/application.js#L430950) |
| `abp.services.app.person.uploadDocumentImage` | POST | api/services/app/person/UploadDocumentImage | [المصدر](../../../raw/application.js#L185476) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.Vouchers.Invoices.AllActionsOnOtherBranchInvoices`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Receipts.AllActionsOnOtherBranchReceipts`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Receipts.NoonPayments`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Allocations`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.CreditNotes.AllActionsOnOtherBranchCreditNotes`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.DebitNotes.AllActionsOnOtherBranchDebitNotes`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Deposits.Transfer`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Deposits.Refund`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Deposits.Used`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Deposits.EditUsedDeposit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.PurchaseOrders.AllActionsOnOtherBranchPurchaseOrders`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Bills.AllActionsOnOtherBranchBills`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.JVs.AllActionsOnOtherBranchJVs`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Delete`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Deposits.AllActionsOnOtherBranchDeposit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Administration.OrganizationUnits.ManageOrganizationTree`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Administration.OrganizationUnits.ManageMembers`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vehicles.ViewOtherBranchVehicles`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.TariffCards`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Customers.EnableCreditPeriod`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Customers.EnableCreditLimit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Administration.Tenant.Integration.Fusion.Mappings`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Customers.ContactCards`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Customers.ContactCards.Add`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Customers.ContactCards.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Customers.ContactCards.Delete`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Customers.ContactCards.ViewCreditCardWithLastFourDigit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Customers.ContactCards.ViewFullCreditCardDetails`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.CustomerApproval`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.LimitedEdit`: ممنوحة في السياق الملتقط.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.dateRangeModel` | text |  | min=vm.dateRangeOptions.min; max=vm.dateRangeOptions.max |
| `vm.filters.account` | ui-select |  |  |
| `vm.filters.locationName` | text |  |  |
| `vm.filters.contact` | ui-select |  |  |
| `vm.filters.vehicle` | ui-select |  |  |
| `vm.filters.costCenterId` | select |  | ng-options=item.id as item.name for item in vm.costCentersGroup1 |
| `vm.filters.costCenter2Id` | select |  | ng-options=item.id as item.name for item in vm.costCentersGroup2 |
| `vm.filters.chassisNoOrPlateNo` | text |  |  |
| `vm.filters.showInOriginalCurrency` | checkbox | showInOriginalCurrency |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
