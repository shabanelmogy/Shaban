# شاشة: Bills

المسار في القائمة: Vouchers ← Bills.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_bills`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0307](../../../readable/routes/R0307--tenant-crs-bills.js)، والأصل [raw/application.js:3738](../../../raw/application.js#L3738).
- قالب الشاشة: `~/App/tenant/views/crs/vouchers/bills/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.vouchers.bills.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.vouchers.bills.index](../../../readable/controllers/C1233--tenant.views.crs.vouchers.bills.index.js) | 49 | 13 |
| [tenant.views.fms.vehicleAssignments.searchOrganizationContactModal](../../../readable/controllers/C1565--tenant.views.fms.vehicleAssignments.searchOrganizationContactModal.js) | 3 | 7 |
| [tenant.views.crs.contacts.searchContactModal](../../../readable/controllers/C0706--tenant.views.crs.contacts.searchContactModal.js) | 7 | 2 |
| [tenant.views.crs.vehicles.searchVehicleModal](../../../readable/controllers/C1186--tenant.views.crs.vehicles.searchVehicleModal.js) | 13 | 11 |
| [tenant.views.crs.vouchers.bills.printTemplates.printPreview](../../../readable/controllers/C1251--tenant.views.crs.vouchers.bills.printTemplates.printPreview.js) | 2 | 0 |
| [tenant.views.crs.vouchers.bills.allocateBillModal](../../../readable/controllers/C1226--tenant.views.crs.vouchers.bills.allocateBillModal.js) | 2 | 1 |
| [common.views.common.reportViewer](../../../readable/controllers/C0006--common.views.common.reportViewer.js) | 2 | 0 |
| [tenant.views.crs.vouchers.common.rejectReason](../../../readable/controllers/C1256--tenant.views.crs.vouchers.common.rejectReason.js) | 2 | 0 |
| [tenant.views.crs.vouchers.bills.generateModal](../../../readable/controllers/C1231--tenant.views.crs.vouchers.bills.generateModal.js) | 7 | 2 |
| [tenant.views.crs.vouchers.bills.deleteFineBillsInBulkModal](../../../readable/controllers/C1230--tenant.views.crs.vouchers.bills.deleteFineBillsInBulkModal.js) | 6 | 2 |
| [tenant.views.crs.vouchers.bills.createOrEditModal](../../../readable/controllers/C1229--tenant.views.crs.vouchers.bills.createOrEditModal.js) | 58 | 30 |
| [tenant.views.crs.vouchers.bills.createOrEditAssetLoanBillLimitedModal](../../../readable/controllers/C1228--tenant.views.crs.vouchers.bills.createOrEditAssetLoanBillLimitedModal.js) | 58 | 30 |
| [tenant.views.crs.vouchers.bills.viewModal](../../../readable/controllers/C1249--tenant.views.crs.vouchers.bills.viewModal.js) | 27 | 16 |
| [tenant.views.crs.vouchers.bills.installmentPaymentModal](../../../readable/controllers/C1235--tenant.views.crs.vouchers.bills.installmentPaymentModal.js) | 21 | 4 |
| [tenant.views.crs.vouchers.bills.importBills](../../../readable/controllers/C1232--tenant.views.crs.vouchers.bills.importBills.js) | 7 | 4 |
| [tenant.views.crs.accounting.journal.viewModal](../../../readable/controllers/C0499--tenant.views.crs.accounting.journal.viewModal.js) | 7 | 2 |
| [tenant.views.fms.organizationChart.createOrEditUnitModal](../../../readable/controllers/C1559--tenant.views.fms.organizationChart.createOrEditUnitModal.js) | 2 | 2 |
| [tenant.views.crs.contacts.createOrEditModal](../../../readable/controllers/C0703--tenant.views.crs.contacts.createOrEditModal.js) | 45 | 24 |
| [tenant.views.crs.vouchers.bills.createAllocationBill](../../../readable/controllers/C1227--tenant.views.crs.vouchers.bills.createAllocationBill.js) | 7 | 2 |
| [tenant.views.crs.vouchers.bills.uploadDocumentsModal](../../../readable/controllers/C1248--tenant.views.crs.vouchers.bills.uploadDocumentsModal.js) | 3 | 0 |
| [tenant.views.crs.vouchers.bills.loanPaymentModal](../../../readable/controllers/C1236--tenant.views.crs.vouchers.bills.loanPaymentModal.js) | 22 | 3 |
| [tenant.views.crs.vouchers.invoices.allocationsViewModel](../../../readable/controllers/C1311--tenant.views.crs.vouchers.invoices.allocationsViewModel.js) | 4 | 1 |
| [tenant.views.crs.vouchers.bills.payInstallmentModal](../../../readable/controllers/C1240--tenant.views.crs.vouchers.bills.payInstallmentModal.js) | 6 | 2 |
| [tenant.views.crs.vouchers.bills.payDownpaymentModal](../../../readable/controllers/C1239--tenant.views.crs.vouchers.bills.payDownpaymentModal.js) | 6 | 3 |
| [tenant.views.crs.vouchers.bills.installmentBreakdownModal](../../../readable/controllers/C1234--tenant.views.crs.vouchers.bills.installmentBreakdownModal.js) | 8 | 1 |
| [tenant.views.crs.vouchers.bills.loanRestructureModal](../../../readable/controllers/C1237--tenant.views.crs.vouchers.bills.loanRestructureModal.js) | 5 | 1 |
| [tenant.views.crs.contacts.uploadDocumentModal](../../../readable/controllers/C0699--tenant.views.crs.contacts.uploadDocumentModal.js) | 2 | 1 |
| [tenant.views.crs.contacts.uploadDocumentModal](../../../readable/controllers/C0711--tenant.views.crs.contacts.uploadDocumentModal.js) | 2 | 1 |
| [tenant.views.common.documents.uploadDocumentModal](../../../readable/controllers/C0362--tenant.views.common.documents.uploadDocumentModal.js) | 4 | 0 |
| [tenant.views.common.documents.uploadImageModal](../../../readable/controllers/C0363--tenant.views.common.documents.uploadImageModal.js) | 3 | 0 |
| [tenant.views.common.documents.addCreditCardModal](../../../readable/controllers/C0701--tenant.views.common.documents.addCreditCardModal.js) | 4 | 0 |
| [tenant.views.crs.vouchers.bills.paySettlementModal](../../../readable/controllers/C1241--tenant.views.crs.vouchers.bills.paySettlementModal.js) | 7 | 1 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.vouchers.bills.index`: `changePrintingWithoutLogo`، `dueDateFilter`، `getStatus`، `dateRangeModelChanged`، `CurrencyFormate`، `roundingforView`، `radioButtonValueChanged`، `dateRangeCheck`، `locationPermission`، `allBranchPermission`، `clearVehicle`، `searchVehicles`، `searchSupplier`، `searchAdditionalDriverPopoup`، `searchContactPopoup`، `searchVehiclePopup`، `getBills`، `getlocalDateTime`، `approveAllMethod`، `isPrintEnabled`، `exportToExcel`، `exportToExcel2`، `openprintModal`، `exportToExcelTaxReport`، `allocateBill`، `report`، `report2`، `taxReport`، `taxReport2`، `rejectReason`، `approveBills`، `unapproveBills`، `rejectBills`، `generateFinesBills`، `deleteFinesBillsInBulk`، `openInstallmentPaymentModel`، `createBill`، `openImportBillModal`، `exportToExcelDetailed`، `importBill`، `editBill`، `editAssetLoanBillLimited`، `cloneBill`، `viewBill`، `deleteBill`، `voidBill`، `enterKeyPress`، `clearSupplier`، `openJournalViewModal`.
- وحدة `tenant.views.fms.vehicleAssignments.searchOrganizationContactModal`: `contactSelected`، `organizationSelected`، `cancel`.
- وحدة `tenant.views.crs.contacts.searchContactModal`: `searchContacts`، `cancel`، `showAddContact`، `contactSelected`، `contactEdit`، `getContactsList`، `getNameWithCode`.
- وحدة `tenant.views.crs.vehicles.searchVehicleModal`: `statusChanged`، `searchModel`، `cancel`، `clearInput`، `clearVehicle`، `getlocalDateTime`، `fromDateTimeChanged`، `searchVehicles`، `searchVehiclesFilters`، `exportToExcelByAgreement`، `vehicleSelected`، `getBookingDate`، `getTeriffGroups`.
- وحدة `tenant.views.crs.vouchers.bills.printTemplates.printPreview`: `cancel`، `getTemplateUrl`.
- وحدة `tenant.views.crs.vouchers.bills.allocateBillModal`: `ok`، `rowSelected`.
- وحدة `common.views.common.reportViewer`: `exportToExcelFromReport`، `cancel`.
- وحدة `tenant.views.crs.vouchers.common.rejectReason`: `cancel`، `save`.
- وحدة `tenant.views.crs.vouchers.bills.generateModal`: `getlocalDateTime`، `allBoxTicked`، `dateRangeModelChange`، `dateForAllBillsChange`، `generate`، `getFines`، `cancel`.
- وحدة `tenant.views.crs.vouchers.bills.deleteFineBillsInBulkModal`: `getlocalDateTime`، `dateRangeModelChange`، `allBoxTicked`، `deleteBill`، `getBills`، `cancel`.
- وحدة `tenant.views.crs.vouchers.bills.createOrEditModal`: `rounding`، `searchContactGeneralPayment`، `taxCategoryChanged`، `getOriginalName`، `uploadDocument`، `accountChanged`، `getlocalDate`، `onCustomerSelect`، `searchContact`، `searchAssignToEmployeePopoup`، `searchAdditionalDriverPopoup`، `calculateCreditAndTax`، `onSupplierSelect`، `calculateCreditAndTaxFromExcel`، `openLoanPaymentModal`، `taxAcceptedChanged`، `searchAgreements`، `considerTaxAsTaxPercentage`، `calculateTaxPerRowForImport`، `branchTaxCode`، `changeTaxOnSupplier`، `calculateTaxPerRow`، `sumAmount`، `sumAmountExcel`، `sumAmountTax`، `sumAmountGrn`، `searchAccounts`، `searchVehicles`، `searchPrepaidExpense`، `searchSupplier`، `searchVehicles`، `searchJobs`، `onItemSelected`، `searchMasterAgreement`، `searchSupplierPopoup`، `searchSupplierAndCustomerPopoup`، `searchVehiclePopup`، `getStockGrnBySupplierId`، `getAssetGrnBySupplierId`، `applyChangeToAll`، `applyChange`، `addRow`، `removeRow`، `clearBill`، `onVehicleChange`، `removeDocument`، `cancel`، `loanOptionSelected`، `searchItems`، `calculateItemPrice`، `getUnitOfMeasures`، `uploader.onSuccessItem`، `uploader.onErrorItem`، `uploaderAssetBillRows.onSuccessItem`، `uploaderAssetBillRows.onErrorItem`، `saveGrnBill`، `searchModel`، `save`.
- وحدة `tenant.views.crs.vouchers.bills.createOrEditAssetLoanBillLimitedModal`: `rounding`، `searchContactGeneralPayment`، `taxCategoryChanged`، `getOriginalName`، `uploadDocument`، `accountChanged`، `getlocalDate`، `onCustomerSelect`، `searchContact`، `searchAssignToEmployeePopoup`، `searchAdditionalDriverPopoup`، `calculateCreditAndTax`، `onSupplierSelect`، `calculateCreditAndTaxFromExcel`، `openLoanPaymentModal`، `taxAcceptedChanged`، `searchAgreements`، `considerTaxAsTaxPercentage`، `calculateTaxPerRowForImport`، `branchTaxCode`، `changeTaxOnSupplier`، `calculateTaxPerRow`، `sumAmount`، `sumAmountExcel`، `sumAmountTax`، `sumAmountGrn`، `searchAccounts`، `searchVehicles`، `searchPrepaidExpense`، `searchSupplier`، `searchVehicles`، `searchJobs`، `onItemSelected`، `searchMasterAgreement`، `searchSupplierPopoup`، `searchSupplierAndCustomerPopoup`، `searchVehiclePopup`، `getStockGrnBySupplierId`، `getAssetGrnBySupplierId`، `applyChangeToAll`، `applyChange`، `addRow`، `removeRow`، `clearBill`، `onVehicleChange`، `removeDocument`، `cancel`، `loanOptionSelected`، `searchItems`، `calculateItemPrice`، `getUnitOfMeasures`، `uploader.onSuccessItem`، `uploader.onErrorItem`، `uploaderAssetBillRows.onSuccessItem`، `uploaderAssetBillRows.onErrorItem`، `saveGrnBill`، `searchModel`، `save`.
- وحدة `tenant.views.crs.vouchers.bills.viewModal`: `rounding`، `searchContactGeneralPayment`، `getTaxCategoryName`، `getOriginalName`، `roundingforView`، `uploadDocument`، `accountChanged`، `getlocalDate`، `searchAdditionalDriverPopoup`، `taxAcceptedChanged`، `calculateTaxPerRow`، `sumAmount`، `sumAmountTax`، `searchAccounts`، `searchVehicles`، `searchPrepaidExpense`، `searchSupplier`، `searchJobs`، `clearBill`، `removeDocument`، `cancel`، `searchItems`، `calculateItemPrice`، `getUnitOfMeasures`، `getStockGrnByRefNo`، `getAssetGrnByRefNo`، `openViewAllocationsModal`.
- وحدة `tenant.views.crs.vouchers.bills.installmentPaymentModal`: `getlocalDateTime`، `localize`، `CurrencyFormate`، `round`، `payAllChanged`، `saveSelected`، `saveAllSelectedInstallments`، `addRow`، `removeRow`، `prepareInstallments`، `interestChanged`، `emiChanged`، `dateChanged`، `cancel`، `save`، `changesOccured`، `openPayInstallmentModel`، `openInstallmentBreakdownModal`، `openLoanRestructureModal`، `calculateSummary`، `refreshPaymentPlan`.
- وحدة `tenant.views.crs.vouchers.bills.importBills`: `cancel`، `refresh`، `getlocalDate`، `getBillTypeById`، `importFromExcelSample`، `importData`، `resolveBoolValue`.
- وحدة `tenant.views.crs.accounting.journal.viewModal`: `getlocalDateTime`، `rounding`، `formatNumber`، `roundingforView`، `currencyAndRoundingWithThree`، `getVoucherType`، `cancel`.
- وحدة `tenant.views.fms.organizationChart.createOrEditUnitModal`: `save`، `cancel`.
- وحدة `tenant.views.crs.contacts.createOrEditModal`: `localize`، `removeExternalIdRow`، `addExternalIdRow`، `getContactExternalType`، `isContactExternalType`، `getlocalDate`، `getlocalDateTime`، `getCardType`، `removeRow`، `searchSalesPersons`، `searchUsersWithDesignation`، `searchSalesPersonPopoup`، `salesPersonSelected`، `searchDebtCollectorPopoup`، `searchCustomLookup`، `getCustomLookups`، `scanDocument`، `openUploadDocument`، `openUploadPicture`، `addCreditCardRow`، `updateCreditCardRow`، `save`، `cancel`، `isPersonVerifiedChange`، `doesIdentityDoucmentExist`، `addIndentityDocument`، `getIdentificationDocumentType`، `removeIndentityDocument`، `removeDoc`، `isFieldMondatory`، `searchCountries`، `emiratesDataReader`، `emiratesDataFieldManager`، `getTariffCards`، `getTariffCardForContact`، `isDocument`، `maskCreditCard`، `getAdvanceSettings`، `getHighLightBlackListCountries`، `getNationalIdFormates`، `nationalIdFormate`، `onOverRideChange`، `resetDocumentNo`، `nationIdMaskInput`، `handleResidenceStatusChange`.
- وحدة `tenant.views.crs.vouchers.bills.createAllocationBill`: `cancel`، `localize`، `rounding`، `sumAmount`، `getlocalDateTime`، `insertDueAmountOnClick`، `save`.
- وحدة `tenant.views.crs.vouchers.bills.uploadDocumentsModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.crs.vouchers.bills.loanPaymentModal`: `getlocalDateTime`، `localize`، `CurrencyFormate`، `round`، `addRow`، `removeRow`، `chequeNoChanged`، `prepareInstallments`، `interestChanged`، `emiChanged`، `dateChanged`، `downpaymentChanged`، `interestAmountChanged`، `searchSupplier`، `searchSupplierPopoup`، `cancel`، `save`، `uploader.onSuccessItem`، `uploader.onErrorItem`، `calculateCreditAndTax`، `sumAmountTax`، `sumAmount`.
- وحدة `tenant.views.crs.vouchers.invoices.allocationsViewModel`: `cancel`، `sumAmount`، `localize`، `getlocalDate`.
- وحدة `tenant.views.crs.vouchers.bills.payInstallmentModal`: `getlocalDateTime`، `localize`، `CurrencyFormate`، `round`، `cancel`، `save`.
- وحدة `tenant.views.crs.vouchers.bills.payDownpaymentModal`: `getlocalDateTime`، `localize`، `CurrencyFormate`، `round`، `cancel`، `save`.
- وحدة `tenant.views.crs.vouchers.bills.installmentBreakdownModal`: `cancel`، `localize`، `round`، `sumAmount`، `getlocalDateTime`، `interestChanged`، `emiChanged`، `save`.
- وحدة `tenant.views.crs.vouchers.bills.loanRestructureModal`: `cancel`، `localize`، `round`، `getlocalDateTime`، `settleAsset`.
- وحدة `tenant.views.crs.contacts.uploadDocumentModal`: `save`، `cancel`.
- وحدة `tenant.views.crs.contacts.uploadDocumentModal`: `save`، `cancel`.
- وحدة `tenant.views.common.documents.uploadDocumentModal`: `uploadHeader`، `uploader.onBeforeUploadItem`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.common.documents.uploadImageModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.common.documents.addCreditCardModal`: `ab`، `cardNumberChanged`، `save`، `cancel`.
- وحدة `tenant.views.crs.vouchers.bills.paySettlementModal`: `getlocalDateTime`، `localize`، `CurrencyFormate`، `round`، `settlementAmountChanged`، `cancel`، `save`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.vehicle.searchVehicles` | POST | api/services/app/vehicle/SearchVehicles | [المصدر](../../../raw/application.js#L328744) |
| `abp.services.app.directory.search` | POST | api/services/app/directory/Search | [المصدر](../../../raw/application.js#L326691) |
| `abp.services.app.bill.getBills` | POST | api/services/app/bill/GetBills | [المصدر](../../../raw/application.js#L324984) |
| `abp.services.app.commonLookup.getLocationsActiveAndInActive` | POST | api/services/app/commonLookup/GetLocationsActiveAndInActive | [المصدر](../../../raw/application.js#L325001) |
| `abp.services.app.bill.approveBills` | POST | api/services/app/bill/ApproveBills | [المصدر](../../../raw/application.js#L325023) |
| `abp.services.app.bill.exportToExcel` | POST | api/services/app/bill/ExportToExcel | [المصدر](../../../raw/application.js#L325045) |
| `abp.services.app.bill.exportToExcel2` | POST | api/services/app/bill/ExportToExcel2 | [المصدر](../../../raw/application.js#L325064) |
| `abp.services.app.bill.approveBill` | POST | api/services/app/bill/ApproveBill | [المصدر](../../../raw/application.js#L325421) |
| `abp.services.app.bill.unApproveBill` | POST | api/services/app/bill/UnApproveBill | [المصدر](../../../raw/application.js#L325438) |
| `abp.services.app.bill.rejectBill` | POST | api/services/app/bill/RejectBill | [المصدر](../../../raw/application.js#L325466) |
| `abp.services.app.bill.exportToExcelDetailed` | POST | api/services/app/bill/ExportToExcelDetailed | [المصدر](../../../raw/application.js#L325609) |
| `abp.services.app.bill.deleteBill` | POST | api/services/app/bill/DeleteBill | [المصدر](../../../raw/application.js#L325640) |
| `abp.services.app.bill.voidBill` | POST | api/services/app/bill/VoidBill | [المصدر](../../../raw/application.js#L325657) |
| `abp.services.app.organizationChart.getOrganizationUnits` | POST | api/services/app/organizationChart/GetOrganizationUnits | [المصدر](../../../raw/application.js#L432892) |
| `abp.services.app.organizationChart.moveOrganizationUnit` | POST | api/services/app/organizationChart/MoveOrganizationUnit | [المصدر](../../../raw/application.js#L432955) |
| `abp.services.app.organizationChart.getOrganizationUnitAllUsers` | POST | api/services/app/organizationChart/GetOrganizationUnitAllUsers | [المصدر](../../../raw/application.js#L433187) |
| `abp.services.app.organizationChart.addUserToOrganizationUnit` | POST | api/services/app/organizationChart/AddUserToOrganizationUnit | [المصدر](../../../raw/application.js#L433107) |
| `abp.services.app.organizationChart.removeUserFromOrganizationUnit` | POST | api/services/app/organizationChart/RemoveUserFromOrganizationUnit | [المصدر](../../../raw/application.js#L433127) |
| `abp.services.app.organizationChart.isInOrganizationUnit` | POST | api/services/app/organizationChart/IsInOrganizationUnit | [المصدر](../../../raw/application.js#L433153) |
| `abp.services.app.directory.searchDirectoryPaged` | POST | api/services/app/directory/SearchDirectoryPaged | [المصدر](../../../raw/application.js#L184666) |
| `abp.services.app.vehicleModel.searchVehicleModelsNew` | POST | api/services/app/vehicleModel/SearchVehicleModelsNew | [المصدر](../../../raw/application.js#L322110) |
| `abp.services.app.vehicle.searchVehiclesPagedWorkShop` | POST | api/services/app/vehicle/SearchVehiclesPagedWorkShop | [المصدر](../../../raw/application.js#L312796) |
| `abp.services.app.vehicle.searchVehiclesPagedByAgreement` | POST | [object Object] | [المصدر](../../../raw/application.js#L312800) |
| `abp.services.app.vehicle.searchVehiclesPaged` | POST | api/services/app/vehicle/SearchVehiclesPaged | [المصدر](../../../raw/application.js#L312803) |
| `abp.services.app.vehicle.exportToExcelByAgreement` | POST | api/services/app/vehicle/ExportToExcelByAgreement | [المصدر](../../../raw/application.js#L312885) |
| `abp.services.app.commonLookup.getLocations` | POST | api/services/app/commonLookup/GetLocations | [المصدر](../../../raw/application.js#L182597) |
| `abp.services.app.commonLookup.getTariffGroups` | POST | api/services/app/commonLookup/GetTariffGroups | [المصدر](../../../raw/application.js#L313062) |
| `abp.services.app.bill.getBillForEdit` | POST | api/services/app/bill/GetBillForEdit | [المصدر](../../../raw/application.js#L328924) |
| `abp.services.app.generateFineBill.generateBills` | POST | api/services/app/generateFineBill/GenerateBills | [المصدر](../../../raw/application.js#L324325) |
| `abp.services.app.uaeFine.getFinesDueToBills` | POST | api/services/app/uaeFine/GetFinesDueToBills | [المصدر](../../../raw/application.js#L324357) |
| `abp.services.app.generateFineBill.deleteBillsInBulk` | POST | api/services/app/generateFineBill/DeleteBillsInBulk | [المصدر](../../../raw/application.js#L324203) |
| `abp.services.app.bill.getFineBillsBulk` | POST | api/services/app/bill/GetFineBillsBulk | [المصدر](../../../raw/application.js#L324219) |
| `abp.services.app.tenantSettings.getExpenseAccountsAdvanceSetting` | POST | api/services/app/tenantSettings/GetExpenseAccountsAdvanceSetting | [المصدر](../../../raw/application.js#L320768) |
| `abp.services.app.directory.searchByContactGroup` | POST | api/services/app/directory/SearchByContactGroup | [المصدر](../../../raw/application.js#L328419) |
| `abp.services.app.asset.getAssetType` | POST | api/services/app/asset/GetAssetType | [المصدر](../../../raw/application.js#L328442) |
| `abp.services.app.linkedAccount.getLoanPrepaidExpenseAccount` | POST | api/services/app/linkedAccount/GetLoanPrepaidExpenseAccount | [المصدر](../../../raw/application.js#L320999) |
| `abp.services.app.agreement.searchAgreementForVoucherLines` | POST | api/services/app/agreement/SearchAgreementForVoucherLines | [المصدر](../../../raw/application.js#L321155) |
| `abp.services.app.commonLookup.getLocationById` | POST | api/services/app/commonLookup/GetLocationById | [المصدر](../../../raw/application.js#L321235) |
| `abp.services.app.account.searchAccountsForSubLookUp` | POST | api/services/app/account/SearchAccountsForSubLookUp | [المصدر](../../../raw/application.js#L328734) |
| `abp.services.app.bill.getexpenseaccounts` | POST | api/services/app/bill/Getexpenseaccounts | [المصدر](../../../raw/application.js#L328750) |
| `abp.services.app.job.searchJobs` | POST | api/services/app/job/SearchJobs | [المصدر](../../../raw/application.js#L328770) |
| `abp.services.app.leaseMasterAgreement.searchMasterAgreementsForVouchers` | POST | api/services/app/leaseMasterAgreement/SearchMasterAgreementsForVouchers | [المصدر](../../../raw/application.js#L321644) |
| `abp.services.app.expenseType.getExpenseTypes` | POST | api/services/app/expenseType/GetExpenseTypes | [المصدر](../../../raw/application.js#L328785) |
| `abp.services.app.grn.getStockGrnBySupplierId` | POST | [object Object] | [المصدر](../../../raw/application.js#L321752) |
| `abp.services.app.grn.getAssetGrnBySupplierId` | POST | api/services/app/grn/GetAssetGrnBySupplierId | [المصدر](../../../raw/application.js#L321775) |
| `abp.services.app.item.searchItems` | POST | api/services/app/item/SearchItems | [المصدر](../../../raw/application.js#L328819) |
| `abp.services.app.unitOfMeasure.getUnitOfMeasures` | POST | api/services/app/unitOfMeasure/GetUnitOfMeasures | [المصدر](../../../raw/application.js#L328837) |
| `abp.services.app.costCenter.searchCostCenters` | POST | api/services/app/costCenter/SearchCostCenters | [المصدر](../../../raw/application.js#L328847) |
| `abp.services.app.bill.importFromExcel` | POST | [object Object] | [المصدر](../../../raw/application.js#L321934) |
| `abp.services.app.bill.assetBillImportFromExcel` | POST | [object Object] | [المصدر](../../../raw/application.js#L322026) |
| `abp.services.app.bill.createOrUpdateGrnBill` | POST | api/services/app/bill/CreateOrUpdateGrnBill | [المصدر](../../../raw/application.js#L322091) |
| `abp.services.app.bill.createOrUpdateBill` | POST | api/services/app/bill/CreateOrUpdateBill | [المصدر](../../../raw/application.js#L322159) |
| `abp.services.app.grn.getGrnForEdit` | POST | api/services/app/grn/GetGrnForEdit | [المصدر](../../../raw/application.js#L322200) |
| `abp.services.app.purchaseOrder.getPurchaseOrderForEdit` | POST | api/services/app/purchaseOrder/GetPurchaseOrderForEdit | [المصدر](../../../raw/application.js#L322237) |
| `abp.services.app.grn.getStockGrnByRefNo` | POST | [object Object] | [المصدر](../../../raw/application.js#L328873) |
| `abp.services.app.grn.getAssetGrnByRefNo` | POST | [object Object] | [المصدر](../../../raw/application.js#L328882) |
| `abp.services.app.bankAccount.getBankAccountsForSelection` | POST | api/services/app/bankAccount/GetBankAccountsForSelection | [المصدر](../../../raw/application.js#L327371) |
| `abp.services.app.paymentPlan.payInstallmentAmount` | POST | api/services/app/paymentPlan/PayInstallmentAmount | [المصدر](../../../raw/application.js#L327405) |
| `abp.services.app.paymentPlan.updatePaymentPlanLines` | POST | api/services/app/paymentPlan/UpdatePaymentPlanLines | [المصدر](../../../raw/application.js#L326165) |
| `abp.services.app.paymentPlan.getPaymentPlanToMakeInstallemntPayment` | POST | api/services/app/paymentPlan/GetPaymentPlanToMakeInstallemntPayment | [المصدر](../../../raw/application.js#L326339) |
| `abp.services.app.agreement.getChargesSettings` | POST | api/services/app/agreement/GetChargesSettings | [المصدر](../../../raw/application.js#L324464) |
| `abp.services.app.agreement.openAgreementSampleFile` | POST | api/services/app/agreement/OpenAgreementSampleFile | [المصدر](../../../raw/application.js#L324477) |
| `abp.services.app.agreement.getAgreementByManualNo` | POST | [object Object] | [المصدر](../../../raw/application.js#L324647) |
| `abp.services.app.bill.importBills` | POST | api/services/app/bill/ImportBills | [المصدر](../../../raw/application.js#L324679) |
| `abp.services.app.journal.getJournalViewForMulticurrency` | POST | api/services/app/journal/GetJournalViewForMulticurrency | [المصدر](../../../raw/application.js#L126727) |
| `abp.services.app.journal.getJournalView` | POST | api/services/app/journal/GetJournalView | [المصدر](../../../raw/application.js#L126740) |
| `abp.services.app.organizationChart.updateOrganizationUnit` | POST | api/services/app/organizationChart/UpdateOrganizationUnit | [المصدر](../../../raw/application.js#L430943) |
| `abp.services.app.organizationChart.createOrganizationUnit` | POST | api/services/app/organizationChart/CreateOrganizationUnit | [المصدر](../../../raw/application.js#L430950) |
| `abp.services.app.chargesSetting.getChargesTypes` | POST | api/services/app/chargesSetting/GetChargesTypes | [المصدر](../../../raw/application.js#L182581) |
| `abp.services.app.directory.searchSalesPersonOne` | POST | api/services/app/directory/SearchSalesPersonOne | [المصدر](../../../raw/application.js#L182778) |
| `abp.services.app.commonLookup.searchCustomLookups` | POST | api/services/app/commonLookup/SearchCustomLookups | [المصدر](../../../raw/application.js#L182861) |
| `abp.services.app.commonLookup.getCustomLookups` | POST | api/services/app/commonLookup/GetCustomLookups | [المصدر](../../../raw/application.js#L182869) |
| `abp.services.app.country.searchCountries` | POST | api/services/app/country/SearchCountries | [المصدر](../../../raw/application.js#L183560) |
| `abp.services.app.person.createOrUpdatePerson` | POST | api/services/app/person/CreateOrUpdatePerson | [المصدر](../../../raw/application.js#L183236) |
| `abp.services.app.contactGroup.getContactGroupsOnContactType` | POST | api/services/app/contactGroup/GetContactGroupsOnContactType | [المصدر](../../../raw/application.js#L183448) |
| `abp.services.app.taxCode.getTaxCodes` | POST | api/services/app/taxCode/GetTaxCodes | [المصدر](../../../raw/application.js#L183456) |
| `abp.services.app.currency.getCurrencies` | POST | api/services/app/currency/GetCurrencies | [المصدر](../../../raw/application.js#L183468) |
| `abp.services.app.tariffCard.getActiveTariffCards` | POST | api/services/app/tariffCard/GetActiveTariffCards | [المصدر](../../../raw/application.js#L183703) |
| `abp.services.app.tariffCard.getTariffCardById` | POST | api/services/app/tariffCard/GetTariffCardById | [المصدر](../../../raw/application.js#L183716) |
| `abp.services.app.person.getAdvanceSettings` | POST | api/services/app/person/GetAdvanceSettings | [المصدر](../../../raw/application.js#L183744) |
| `abp.services.app.person.getHighLightBlackListCountry` | POST | [object Object] | [المصدر](../../../raw/application.js#L183768) |
| `abp.services.app.person.getNationalIdFormate` | POST | [object Object] | [المصدر](../../../raw/application.js#L183774) |
| `abp.services.app.person.getPersonForEdit` | POST | api/services/app/person/GetPersonForEdit | [المصدر](../../../raw/application.js#L183903) |
| `abp.services.app.person.getContactCards` | POST | api/services/app/person/GetContactCards | [المصدر](../../../raw/application.js#L184004) |
| `abp.services.app.commonLookup.validateCreditLimit` | POST | api/services/app/commonLookup/ValidateCreditLimit | [المصدر](../../../raw/application.js#L184099) |
| `abp.services.app.allocation.saveAllocations` | POST | api/services/app/allocation/SaveAllocations | [المصدر](../../../raw/application.js#L325831) |
| `abp.services.app.allocation.getAllocationsForEdit` | POST | api/services/app/allocation/GetAllocationsForEdit | [المصدر](../../../raw/application.js#L320668) |
| `abp.services.app.bill.importLoanPaymentPlanFromExcel` | POST | [object Object] | [المصدر](../../../raw/application.js#L326759) |
| `abp.services.app.allocation.getAllocations` | POST | api/services/app/allocation/GetAllocations | [المصدر](../../../raw/application.js#L342588) |
| `abp.services.app.billingMethod.getBillingMethods` | POST | api/services/app/billingMethod/GetBillingMethods | [المصدر](../../../raw/application.js#L327281) |
| `abp.services.app.commonLookup.getBankAccountsForSelection` | POST | api/services/app/commonLookup/GetBankAccountsForSelection | [المصدر](../../../raw/application.js#L327290) |
| `abp.services.app.paymentPlan.payDownPaymentAmount` | POST | api/services/app/paymentPlan/PayDownPaymentAmount | [المصدر](../../../raw/application.js#L327332) |
| `abp.services.app.paymentPlan.getLoanAssetsSummary` | POST | api/services/app/paymentPlan/getLoanAssetsSummary | [المصدر](../../../raw/application.js#L327012) |
| `abp.services.app.person.uploadDocumentImage` | POST | api/services/app/person/UploadDocumentImage | [المصدر](../../../raw/application.js#L185476) |
| `abp.services.app.paymentPlan.settleAsset` | POST | api/services/app/paymentPlan/SettleAsset | [المصدر](../../../raw/application.js#L327458) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.Accounts.Journal`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Bills.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Bills.ImportBills`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Bills.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Bills.ServiceBillEdit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Bills.StockBillEdit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Bills.AssetBillEdit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Bills.StockGrnBillEdit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Bills.AssetGrnBillEdit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Bills.SaleInventoryBillEdit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Bills.AssetLoanBillEdit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Bills.AssetBillLoanLimitedEdit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Bills.Approve`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Bills.CanApproveOtherBranchBills`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Bills.UnApprove`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Bills.Reject`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Bills.View`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Bills.Delete`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Bills.Void`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Bills.AllActionsOnOtherBranchBills`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Bills.ViewOtherBranchBills`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Bills.ExportToExcelDetailed`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Bills.CloneBill`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Administration.OrganizationUnits.ManageOrganizationTree`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Administration.OrganizationUnits.ManageMembers`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Delete`: ممنوحة في السياق الملتقط.
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
| `vm.filters.voucherNo` | text |  |  |
| `vm.filters.refNo` | text |  |  |
| `vm.filters.vehicle` | ui-select |  |  |
| `vm.filters.locationId` | select | locationId |  |
| `vm.dateRangeModel` | text |  | min=vm.dateRangeOptions.min; max=vm.dateRangeOptions.max; ng-disabled=!vm.filters.enableDateRange |
| `vm.filters.enableDateRange` | checkbox | disableDateRange |  |
| `vm.filters.billDateFilter` | radio | creationDate |  |
| `vm.filters.billDateFilter` | radio | supplierBillDate |  |
| `vm.filters.billDateFilter` | radio | showOnlyDueInvoices |  |
| `vm.filters.billDueDate` | select |  | ng-options=dueDate.id as dueDate.name for dueDate in vm.billDueDate |
| `vm.filters.status` | select |  | ng-options=status.id as status.name for status in vm.statuses |
| `vm.filters.supplier` | ui-select |  |  |
| `vm.filters.requestedBy.name` | text |  |  |
| `vm.filters.approvedType` | text | billType | ng-options=approvedType.id as approvedType.name for approvedType in vm.approvedTypes |
| `vm.filters.isPaymentPlanDefined` | checkbox | isPaymentPlanDefined |  |
| `vm.filters.printingWithoutLogo` | checkbox | printingWithoutLogo |  |
| `vm.filters.dealNo` | text |  |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
