# شاشة: Purchase Orders

المسار في القائمة: Vouchers ← Purchase Orders.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_purchaseOrders`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0310](../../../readable/routes/R0310--tenant-crs-purchaseorders.js)، والأصل [raw/application.js:3756](../../../raw/application.js#L3756).
- قالب الشاشة: `~/App/tenant/views/crs/vouchers/purchaseOrders/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.vouchers.purchaseOrders.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.vouchers.purchaseOrders.index](../../../readable/controllers/C1398--tenant.views.crs.vouchers.purchaseOrders.index.js) | 30 | 10 |
| [tenant.views.fms.vehicleAssignments.searchOrganizationContactModal](../../../readable/controllers/C1565--tenant.views.fms.vehicleAssignments.searchOrganizationContactModal.js) | 3 | 7 |
| [tenant.views.crs.contacts.searchContactModal](../../../readable/controllers/C0706--tenant.views.crs.contacts.searchContactModal.js) | 7 | 2 |
| [tenant.views.stock.grns.createOrEditModal](../../../readable/controllers/C1671--tenant.views.stock.grns.createOrEditModal.js) | 27 | 15 |
| [tenant.views.crs.vouchers.bills.createOrEditModal](../../../readable/controllers/C1229--tenant.views.crs.vouchers.bills.createOrEditModal.js) | 58 | 30 |
| [tenant.views.crs.vouchers.deposits.purchaseOrders.printPreview](../../../readable/controllers/C1405--tenant.views.crs.vouchers.deposits.purchaseOrders.printPreview.js) | 2 | 0 |
| [common.views.common.reportViewer](../../../readable/controllers/C0006--common.views.common.reportViewer.js) | 2 | 0 |
| [tenant.views.crs.vouchers.purchaseOrders.generateBills](../../../readable/controllers/C1397--tenant.views.crs.vouchers.purchaseOrders.generateBills.js) | 11 | 3 |
| [tenant.views.crs.vouchers.purchaseOrders.createOrEditModal](../../../readable/controllers/C1396--tenant.views.crs.vouchers.purchaseOrders.createOrEditModal.js) | 32 | 17 |
| [tenant.views.crs.vouchers.common.rejectReason](../../../readable/controllers/C1256--tenant.views.crs.vouchers.common.rejectReason.js) | 2 | 0 |
| [tenant.views.fms.organizationChart.createOrEditUnitModal](../../../readable/controllers/C1559--tenant.views.fms.organizationChart.createOrEditUnitModal.js) | 2 | 2 |
| [tenant.views.crs.contacts.createOrEditModal](../../../readable/controllers/C0703--tenant.views.crs.contacts.createOrEditModal.js) | 45 | 24 |
| [tenant.views.stock.grns.uploadDocumentsModal](../../../readable/controllers/C1675--tenant.views.stock.grns.uploadDocumentsModal.js) | 3 | 0 |
| [tenant.views.crs.vouchers.bills.uploadDocumentsModal](../../../readable/controllers/C1248--tenant.views.crs.vouchers.bills.uploadDocumentsModal.js) | 3 | 0 |
| [tenant.views.crs.vouchers.bills.loanPaymentModal](../../../readable/controllers/C1236--tenant.views.crs.vouchers.bills.loanPaymentModal.js) | 22 | 3 |
| [tenant.views.crs.vehicles.searchVehicleModal](../../../readable/controllers/C1186--tenant.views.crs.vehicles.searchVehicleModal.js) | 13 | 11 |
| [tenant.views.crs.vouchers.bills.printTemplates.printPreview](../../../readable/controllers/C1251--tenant.views.crs.vouchers.bills.printTemplates.printPreview.js) | 2 | 0 |
| [tenant.views.crs.vouchers.purchaseRequest.openJobVehicleDetailModal](../../../readable/controllers/C1410--tenant.views.crs.vouchers.purchaseRequest.openJobVehicleDetailModal.js) | 4 | 3 |
| [tenant.views.crs.vouchers.purchaseOrders.purchaseAndSalesHistoryModal](../../../readable/controllers/C1400--tenant.views.crs.vouchers.purchaseOrders.purchaseAndSalesHistoryModal.js) | 11 | 2 |
| [tenant.views.crs.vouchers.purchaseOrders.uploadDocumentsModal](../../../readable/controllers/C1284--tenant.views.crs.vouchers.purchaseOrders.uploadDocumentsModal.js) | 3 | 0 |
| [tenant.views.crs.contacts.uploadDocumentModal](../../../readable/controllers/C0699--tenant.views.crs.contacts.uploadDocumentModal.js) | 2 | 1 |
| [tenant.views.crs.contacts.uploadDocumentModal](../../../readable/controllers/C0711--tenant.views.crs.contacts.uploadDocumentModal.js) | 2 | 1 |
| [tenant.views.common.documents.uploadDocumentModal](../../../readable/controllers/C0362--tenant.views.common.documents.uploadDocumentModal.js) | 4 | 0 |
| [tenant.views.common.documents.uploadImageModal](../../../readable/controllers/C0363--tenant.views.common.documents.uploadImageModal.js) | 3 | 0 |
| [tenant.views.common.documents.addCreditCardModal](../../../readable/controllers/C0701--tenant.views.common.documents.addCreditCardModal.js) | 4 | 0 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.vouchers.purchaseOrders.index`: `CurrencyFormate`، `roundingforView`، `dateRangeCheck`، `dateRangeModelChanged`، `locationPermission`، `allBranchPermission`، `searchAdditionalDriverPopoup`، `searchSupplier`، `clearSupplier`، `clearVehicle`، `searchVehicles`، `searchContactPopoup`، `isPrintEnabled`، `getlocalDateTime`، `createGrnOnPo`، `createBillOnPO`، `getPurchaseOrders`، `exportToExcel`، `exportToExcelDetailed`، `openprintModal`، `report`، `generateBillsOnPOs`، `createPurchaseOrder`، `viewPurchaseOrder`، `editPurchaseOrder`، `deletePurchaseOrder`، `enterKeyPress`، `approvePurchaseOrder`، `unApprovePurchaseOrder`، `rejectPurchaseOrder`.
- وحدة `tenant.views.fms.vehicleAssignments.searchOrganizationContactModal`: `contactSelected`، `organizationSelected`، `cancel`.
- وحدة `tenant.views.crs.contacts.searchContactModal`: `searchContacts`، `cancel`، `showAddContact`، `contactSelected`، `contactEdit`، `getContactsList`، `getNameWithCode`.
- وحدة `tenant.views.stock.grns.createOrEditModal`: `searchModel`، `searchVehicles`، `rounding`، `roundingforView`، `searchSupplier`، `supplierChanged`، `searchLPONo`، `poSelected`، `getUnitOfMeasures`، `searchSupplierPopoup`، `uploadDocument`، `getOriginalName`، `removeDocument`، `searchItems`، `addRow`، `removeRow`، `sumAmount`، `sumAmountTax`، `calculateTaxPerRow`، `calculateQtyAlreadyReceived`، `calculateQtyOrdered`، `calculateItemPrice`، `dateChanged`، `calculatePriceAndTax`، `searchJobs`، `save`، `cancel`.
- وحدة `tenant.views.crs.vouchers.bills.createOrEditModal`: `rounding`، `searchContactGeneralPayment`، `taxCategoryChanged`، `getOriginalName`، `uploadDocument`، `accountChanged`، `getlocalDate`، `onCustomerSelect`، `searchContact`، `searchAssignToEmployeePopoup`، `searchAdditionalDriverPopoup`، `calculateCreditAndTax`، `onSupplierSelect`، `calculateCreditAndTaxFromExcel`، `openLoanPaymentModal`، `taxAcceptedChanged`، `searchAgreements`، `considerTaxAsTaxPercentage`، `calculateTaxPerRowForImport`، `branchTaxCode`، `changeTaxOnSupplier`، `calculateTaxPerRow`، `sumAmount`، `sumAmountExcel`، `sumAmountTax`، `sumAmountGrn`، `searchAccounts`، `searchVehicles`، `searchPrepaidExpense`، `searchSupplier`، `searchVehicles`، `searchJobs`، `onItemSelected`، `searchMasterAgreement`، `searchSupplierPopoup`، `searchSupplierAndCustomerPopoup`، `searchVehiclePopup`، `getStockGrnBySupplierId`، `getAssetGrnBySupplierId`، `applyChangeToAll`، `applyChange`، `addRow`، `removeRow`، `clearBill`، `onVehicleChange`، `removeDocument`، `cancel`، `loanOptionSelected`، `searchItems`، `calculateItemPrice`، `getUnitOfMeasures`، `uploader.onSuccessItem`، `uploader.onErrorItem`، `uploaderAssetBillRows.onSuccessItem`، `uploaderAssetBillRows.onErrorItem`، `saveGrnBill`، `searchModel`، `save`.
- وحدة `tenant.views.crs.vouchers.deposits.purchaseOrders.printPreview`: `cancel`، `getTemplateUrl`.
- وحدة `common.views.common.reportViewer`: `exportToExcelFromReport`، `cancel`.
- وحدة `tenant.views.crs.vouchers.purchaseOrders.generateBills`: `searchAccounts`، `getlocalDateTime`، `roundingforView`، `roundAmount`، `getPurchaseOrders`، `getlocalDate`، `allBoxTicked`، `boxTicked`، `cancel`، `save`، `generate`.
- وحدة `tenant.views.crs.vouchers.purchaseOrders.createOrEditModal`: `getWorkTypeText`، `supplierSelected`، `rounding`، `roundingforView`، `openJobVehicleModal`، `searchVehicles`، `searchSupplier`، `purchaseAndSalesHistoryModel`، `searchSupplierPopoup`، `searchAdditionalDriverPopoup`، `addRow`، `removeRow`، `clearOrder`، `branchTaxCode`، `setTaxPercentOnTaxCode`، `calculateTaxPerRow`، `searchMasterAgreement`، `sumAmount`، `sumAmountTax`، `searchItems`، `pOUnitPriceBasedOnLastSupplier`، `calculateItemPrice`، `getUnitOfMeasures`، `searchJobs`، `onItemSelected`، `onJobSelectedForVoucherline`، `uploadDocument`، `getOriginalName`، `removeDocument`، `save`، `cancel`، `searchModel`.
- وحدة `tenant.views.crs.vouchers.common.rejectReason`: `cancel`، `save`.
- وحدة `tenant.views.fms.organizationChart.createOrEditUnitModal`: `save`، `cancel`.
- وحدة `tenant.views.crs.contacts.createOrEditModal`: `localize`، `removeExternalIdRow`، `addExternalIdRow`، `getContactExternalType`، `isContactExternalType`، `getlocalDate`، `getlocalDateTime`، `getCardType`، `removeRow`، `searchSalesPersons`، `searchUsersWithDesignation`، `searchSalesPersonPopoup`، `salesPersonSelected`، `searchDebtCollectorPopoup`، `searchCustomLookup`، `getCustomLookups`، `scanDocument`، `openUploadDocument`، `openUploadPicture`، `addCreditCardRow`، `updateCreditCardRow`، `save`، `cancel`، `isPersonVerifiedChange`، `doesIdentityDoucmentExist`، `addIndentityDocument`، `getIdentificationDocumentType`، `removeIndentityDocument`، `removeDoc`، `isFieldMondatory`، `searchCountries`، `emiratesDataReader`، `emiratesDataFieldManager`، `getTariffCards`، `getTariffCardForContact`، `isDocument`، `maskCreditCard`، `getAdvanceSettings`، `getHighLightBlackListCountries`، `getNationalIdFormates`، `nationalIdFormate`، `onOverRideChange`، `resetDocumentNo`، `nationIdMaskInput`، `handleResidenceStatusChange`.
- وحدة `tenant.views.stock.grns.uploadDocumentsModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.crs.vouchers.bills.uploadDocumentsModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.crs.vouchers.bills.loanPaymentModal`: `getlocalDateTime`، `localize`، `CurrencyFormate`، `round`، `addRow`، `removeRow`، `chequeNoChanged`، `prepareInstallments`، `interestChanged`، `emiChanged`، `dateChanged`، `downpaymentChanged`، `interestAmountChanged`، `searchSupplier`، `searchSupplierPopoup`، `cancel`، `save`، `uploader.onSuccessItem`، `uploader.onErrorItem`، `calculateCreditAndTax`، `sumAmountTax`، `sumAmount`.
- وحدة `tenant.views.crs.vehicles.searchVehicleModal`: `statusChanged`، `searchModel`، `cancel`، `clearInput`، `clearVehicle`، `getlocalDateTime`، `fromDateTimeChanged`، `searchVehicles`، `searchVehiclesFilters`، `exportToExcelByAgreement`، `vehicleSelected`، `getBookingDate`، `getTeriffGroups`.
- وحدة `tenant.views.crs.vouchers.bills.printTemplates.printPreview`: `cancel`، `getTemplateUrl`.
- وحدة `tenant.views.crs.vouchers.purchaseRequest.openJobVehicleDetailModal`: `localize`، `cancel`، `searchModel`، `getTariffGroups`.
- وحدة `tenant.views.crs.vouchers.purchaseOrders.purchaseAndSalesHistoryModal`: `CurrencyFormate`، `roundingforView`، `dateRangeCheck`، `dateRangeModelChanged`، `isPrintEnabled`، `getlocalDateTime`، `getPurchaseHistory`، `customFilter`، `getSaleHistory`، `openprintModal`، `cancel`.
- وحدة `tenant.views.crs.vouchers.purchaseOrders.uploadDocumentsModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.crs.contacts.uploadDocumentModal`: `save`، `cancel`.
- وحدة `tenant.views.crs.contacts.uploadDocumentModal`: `save`، `cancel`.
- وحدة `tenant.views.common.documents.uploadDocumentModal`: `uploadHeader`، `uploader.onBeforeUploadItem`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.common.documents.uploadImageModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.common.documents.addCreditCardModal`: `ab`، `cardNumberChanged`، `save`، `cancel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.directory.search` | POST | api/services/app/directory/Search | [المصدر](../../../raw/application.js#L326691) |
| `abp.services.app.vehicle.searchVehicles` | POST | api/services/app/vehicle/SearchVehicles | [المصدر](../../../raw/application.js#L312838) |
| `abp.services.app.commonLookup.getLocationsActiveAndInActive` | POST | api/services/app/commonLookup/GetLocationsActiveAndInActive | [المصدر](../../../raw/application.js#L381189) |
| `abp.services.app.purchaseOrder.getPurchaseOrders` | POST | api/services/app/purchaseOrder/GetPurchaseOrders | [المصدر](../../../raw/application.js#L380860) |
| `abp.services.app.purchaseOrder.exportToExcel` | POST | api/services/app/purchaseOrder/ExportToExcel | [المصدر](../../../raw/application.js#L381302) |
| `abp.services.app.purchaseOrder.exportToExcelDetailed` | POST | api/services/app/purchaseOrder/ExportToExcelDetailed | [المصدر](../../../raw/application.js#L381311) |
| `abp.services.app.purchaseOrder.deletePurchaseOrder` | POST | api/services/app/purchaseOrder/DeletePurchaseOrder | [المصدر](../../../raw/application.js#L381569) |
| `abp.services.app.purchaseOrder.approvePurchaseOrder` | POST | api/services/app/purchaseOrder/ApprovePurchaseOrder | [المصدر](../../../raw/application.js#L381594) |
| `abp.services.app.purchaseOrder.unApprovePurchaseOrder` | POST | api/services/app/purchaseOrder/UnApprovePurchaseOrder | [المصدر](../../../raw/application.js#L381611) |
| `abp.services.app.purchaseOrder.rejectPurchaseOrder` | POST | api/services/app/purchaseOrder/RejectPurchaseOrder | [المصدر](../../../raw/application.js#L381664) |
| `abp.services.app.organizationChart.getOrganizationUnits` | POST | api/services/app/organizationChart/GetOrganizationUnits | [المصدر](../../../raw/application.js#L432892) |
| `abp.services.app.organizationChart.moveOrganizationUnit` | POST | api/services/app/organizationChart/MoveOrganizationUnit | [المصدر](../../../raw/application.js#L432955) |
| `abp.services.app.organizationChart.getOrganizationUnitAllUsers` | POST | api/services/app/organizationChart/GetOrganizationUnitAllUsers | [المصدر](../../../raw/application.js#L433187) |
| `abp.services.app.organizationChart.addUserToOrganizationUnit` | POST | api/services/app/organizationChart/AddUserToOrganizationUnit | [المصدر](../../../raw/application.js#L433107) |
| `abp.services.app.organizationChart.removeUserFromOrganizationUnit` | POST | api/services/app/organizationChart/RemoveUserFromOrganizationUnit | [المصدر](../../../raw/application.js#L433127) |
| `abp.services.app.organizationChart.isInOrganizationUnit` | POST | api/services/app/organizationChart/IsInOrganizationUnit | [المصدر](../../../raw/application.js#L433153) |
| `abp.services.app.directory.searchDirectoryPaged` | POST | api/services/app/directory/SearchDirectoryPaged | [المصدر](../../../raw/application.js#L184666) |
| `abp.services.app.vehicleModel.searchVehicleModelsNew` | POST | api/services/app/vehicleModel/SearchVehicleModelsNew | [المصدر](../../../raw/application.js#L384601) |
| `abp.services.app.purchaseOrder.searchLPONo` | POST | api/services/app/purchaseOrder/SearchLPONo | [المصدر](../../../raw/application.js#L463015) |
| `abp.services.app.asset.getAssetType` | POST | api/services/app/asset/GetAssetType | [المصدر](../../../raw/application.js#L380132) |
| `abp.services.app.grn.getGrnLinesByParentVoucherId` | POST | api/services/app/grn/GetGrnLinesByParentVoucherId | [المصدر](../../../raw/application.js#L463033) |
| `abp.services.app.unitOfMeasure.getUnitOfMeasures` | POST | api/services/app/unitOfMeasure/GetUnitOfMeasures | [المصدر](../../../raw/application.js#L380461) |
| `abp.services.app.commonLookup.getLocations` | POST | api/services/app/commonLookup/GetLocations | [المصدر](../../../raw/application.js#L313017) |
| `abp.services.app.item.searchItems` | POST | api/services/app/item/SearchItems | [المصدر](../../../raw/application.js#L380419) |
| `abp.services.app.grn.getGrnByParentVoucherId` | POST | api/services/app/grn/GetGrnByParentVoucherId | [المصدر](../../../raw/application.js#L463262) |
| `abp.services.app.purchaseOrder.getPOById` | POST | [object Object] | [المصدر](../../../raw/application.js#L463282) |
| `abp.services.app.job.searchJobDetails` | POST | api/services/app/job/SearchJobDetails | [المصدر](../../../raw/application.js#L463316) |
| `abp.services.app.grn.createOrUpdateGrn` | POST | api/services/app/grn/CreateOrUpdateGrn | [المصدر](../../../raw/application.js#L463339) |
| `abp.services.app.purchaseOrder.getPurchaseOrderForEdit` | POST | api/services/app/purchaseOrder/GetPurchaseOrderForEdit | [المصدر](../../../raw/application.js#L380678) |
| `abp.services.app.grn.getGrnForEdit` | POST | api/services/app/grn/GetGrnForEdit | [المصدر](../../../raw/application.js#L323932) |
| `abp.services.app.tenantSettings.getExpenseAccountsAdvanceSetting` | POST | api/services/app/tenantSettings/GetExpenseAccountsAdvanceSetting | [المصدر](../../../raw/application.js#L322500) |
| `abp.services.app.directory.searchByContactGroup` | POST | api/services/app/directory/SearchByContactGroup | [المصدر](../../../raw/application.js#L322525) |
| `abp.services.app.linkedAccount.getLoanPrepaidExpenseAccount` | POST | api/services/app/linkedAccount/GetLoanPrepaidExpenseAccount | [المصدر](../../../raw/application.js#L322731) |
| `abp.services.app.agreement.searchAgreementForVoucherLines` | POST | api/services/app/agreement/SearchAgreementForVoucherLines | [المصدر](../../../raw/application.js#L322887) |
| `abp.services.app.commonLookup.getLocationById` | POST | api/services/app/commonLookup/GetLocationById | [المصدر](../../../raw/application.js#L380231) |
| `abp.services.app.account.searchAccountsForSubLookUp` | POST | api/services/app/account/SearchAccountsForSubLookUp | [المصدر](../../../raw/application.js#L380823) |
| `abp.services.app.bill.getexpenseaccounts` | POST | api/services/app/bill/Getexpenseaccounts | [المصدر](../../../raw/application.js#L323319) |
| `abp.services.app.job.searchJobs` | POST | api/services/app/job/SearchJobs | [المصدر](../../../raw/application.js#L380472) |
| `abp.services.app.leaseMasterAgreement.searchMasterAgreementsForVouchers` | POST | api/services/app/leaseMasterAgreement/SearchMasterAgreementsForVouchers | [المصدر](../../../raw/application.js#L380296) |
| `abp.services.app.expenseType.getExpenseTypes` | POST | api/services/app/expenseType/GetExpenseTypes | [المصدر](../../../raw/application.js#L323475) |
| `abp.services.app.grn.getStockGrnBySupplierId` | POST | [object Object] | [المصدر](../../../raw/application.js#L323484) |
| `abp.services.app.grn.getAssetGrnBySupplierId` | POST | api/services/app/grn/GetAssetGrnBySupplierId | [المصدر](../../../raw/application.js#L323507) |
| `abp.services.app.costCenter.searchCostCenters` | POST | api/services/app/costCenter/SearchCostCenters | [المصدر](../../../raw/application.js#L323607) |
| `abp.services.app.bill.importFromExcel` | POST | [object Object] | [المصدر](../../../raw/application.js#L323666) |
| `abp.services.app.bill.assetBillImportFromExcel` | POST | [object Object] | [المصدر](../../../raw/application.js#L323758) |
| `abp.services.app.bill.createOrUpdateGrnBill` | POST | api/services/app/bill/CreateOrUpdateGrnBill | [المصدر](../../../raw/application.js#L323823) |
| `abp.services.app.bill.createOrUpdateBill` | POST | api/services/app/bill/CreateOrUpdateBill | [المصدر](../../../raw/application.js#L323891) |
| `abp.services.app.bill.getBillForEdit` | POST | api/services/app/bill/GetBillForEdit | [المصدر](../../../raw/application.js#L323990) |
| `abp.services.app.bill.createBillForPo` | POST | api/services/app/bill/CreateBillForPo | [المصدر](../../../raw/application.js#L380952) |
| `abp.services.app.purchaseOrder.getPOUnitPriceBasedOnLastSupplier` | POST | api/services/app/purchaseOrder/GetPOUnitPriceBasedOnLastSupplier | [المصدر](../../../raw/application.js#L380428) |
| `abp.services.app.purchaseOrder.createOrUpdatePurchaseOrder` | POST | api/services/app/purchaseOrder/CreateOrUpdatePurchaseOrder | [المصدر](../../../raw/application.js#L380537) |
| `abp.services.app.purchaseRequest.getPurchaseRequestForEdit` | POST | api/services/app/purchaseRequest/GetPurchaseRequestForEdit | [المصدر](../../../raw/application.js#L380585) |
| `abp.services.app.assetType.getAssetDefaultType` | POST | api/services/app/assetType/GetAssetDefaultType | [المصدر](../../../raw/application.js#L380652) |
| `abp.services.app.commonQuotation.getLeaseQuotationToCreatePO` | POST | api/services/app/commonQuotation/GetLeaseQuotationToCreatePO | [المصدر](../../../raw/application.js#L380649) |
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
| `abp.services.app.bankAccount.getBankAccountsForSelection` | POST | api/services/app/bankAccount/GetBankAccountsForSelection | [المصدر](../../../raw/application.js#L326426) |
| `abp.services.app.bill.importLoanPaymentPlanFromExcel` | POST | [object Object] | [المصدر](../../../raw/application.js#L326759) |
| `abp.services.app.vehicle.searchVehiclesPagedWorkShop` | POST | api/services/app/vehicle/SearchVehiclesPagedWorkShop | [المصدر](../../../raw/application.js#L312796) |
| `abp.services.app.vehicle.searchVehiclesPagedByAgreement` | POST | [object Object] | [المصدر](../../../raw/application.js#L312800) |
| `abp.services.app.vehicle.searchVehiclesPaged` | POST | api/services/app/vehicle/SearchVehiclesPaged | [المصدر](../../../raw/application.js#L312803) |
| `abp.services.app.vehicle.exportToExcelByAgreement` | POST | api/services/app/vehicle/ExportToExcelByAgreement | [المصدر](../../../raw/application.js#L312885) |
| `abp.services.app.commonLookup.getTariffGroups` | POST | api/services/app/commonLookup/GetTariffGroups | [المصدر](../../../raw/application.js#L384607) |
| `abp.services.app.vehicle.getNextFleetCode` | POST | api/services/app/vehicle/GetNextFleetCode | [المصدر](../../../raw/application.js#L384613) |
| `abp.services.app.stockReport.getItemsPurchaseHistory` | POST | api/services/app/stockReport/GetItemsPurchaseHistory | [المصدر](../../../raw/application.js#L382076) |
| `abp.services.app.stockReport.getItemsSaleHistory` | POST | api/services/app/stockReport/GetItemsSaleHistory | [المصدر](../../../raw/application.js#L382155) |
| `abp.services.app.person.uploadDocumentImage` | POST | api/services/app/person/UploadDocumentImage | [المصدر](../../../raw/application.js#L185476) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.Vouchers.PurchaseOrders.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.PurchaseOrders.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.PurchaseOrders.View`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.PurchaseOrders.Approve`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.PurchaseOrders.CanApproveOtherPurchaseOrders`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.PurchaseOrders.Reject`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.PurchaseOrders.ExportToExcel`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.PurchaseOrders.UnApprove`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.PurchaseOrders.Delete`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.PurchaseOrders.AllActionsOnOtherBranchPurchaseOrders`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.PurchaseOrders.ViewOtherBranchPurchaseOrders`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Administration.OrganizationUnits.ManageOrganizationTree`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Administration.OrganizationUnits.ManageMembers`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Delete`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Bills.AllActionsOnOtherBranchBills`: ممنوحة في السياق الملتقط.
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
- صلاحية `Pages.Tenant.Vehicles.ViewOtherBranchVehicles`: ممنوحة في السياق الملتقط.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.filters.voucherNo` | text |  |  |
| `vm.filters.refNo` | text |  |  |
| `vm.filters.locationId` | select | locationId |  |
| `vm.filters.requestedBy.name` | text |  |  |
| `vm.dateRangeModel` | text |  | min=vm.dateRangeOptions.min; max=vm.dateRangeOptions.max; ng-disabled=!vm.filters.enableDateRange |
| `vm.filters.enableDateRange` | checkbox | disableDateRange |  |
| `vm.filters.dueDateRange` | checkbox | showOnlyDueInvoices |  |
| `vm.filters.vehicle` | ui-select |  |  |
| `vm.filters.supplier` | ui-select |  |  |
| `vm.filters.chassisNo` | text |  |  |
| `vm.filters.approvedType` | text | invoiceType | ng-options=approvedType.id as approvedType.name for approvedType in vm.approvedTypes |
| `vm.filters.billStatus` | text | billStatus | ng-options=billStatus.id as billStatus.name for billStatus in vm.billStatus |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
