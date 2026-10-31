# شاشة: Delivery Notes

المسار في القائمة: Equipment Rental ← Delivery Notes.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.ers_deliveries`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0662](../../../readable/routes/R0662--tenant-ers-deliveries.js)، والأصل [raw/application.js:6542](../../../raw/application.js#L6542).
- قالب الشاشة: `~/App/tenant/views/ers/deliveries/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.ers.deliveries.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.ers.deliveries.index](../../../readable/controllers/C1468--tenant.views.ers.deliveries.index.js) | 40 | 10 |
| [common.views.common.reportViewer](../../../readable/controllers/C0006--common.views.common.reportViewer.js) | 2 | 0 |
| [tenant.views.ers.deliveries.printTemplates.printPreview](../../../readable/controllers/C1474--tenant.views.ers.deliveries.printTemplates.printPreview.js) | 2 | 0 |
| [tenant.views.ers.deliveries.viewModal](../../../readable/controllers/C1473--tenant.views.ers.deliveries.viewModal.js) | 6 | 3 |
| [tenant.views.ers.rental.agreements.createOrEditModal](../../../readable/controllers/C1499--tenant.views.ers.rental.agreements.createOrEditModal.js) | 26 | 9 |
| [tenant.views.ers.deliveries.deliveryModal](../../../readable/controllers/C1467--tenant.views.ers.deliveries.deliveryModal.js) | 5 | 2 |
| [tenant.views.ers.deliveries.changeInvoingStartDateModal](../../../readable/controllers/C1464--tenant.views.ers.deliveries.changeInvoingStartDateModal.js) | 5 | 2 |
| [tenant.views.ers.deliveries.changeClosingDateModal](../../../readable/controllers/C1463--tenant.views.ers.deliveries.changeClosingDateModal.js) | 5 | 2 |
| [tenant.views.ers.deliveries.closeEquipmentAgreementModal](../../../readable/controllers/C1465--tenant.views.ers.deliveries.closeEquipmentAgreementModal.js) | 10 | 4 |
| [tenant.views.ers.rental.agreements.replaceEquipmentModal](../../../readable/controllers/C1502--tenant.views.ers.rental.agreements.replaceEquipmentModal.js) | 9 | 5 |
| [tenant.views.ers.rental.agreements.replaceOperatorModal](../../../readable/controllers/C1503--tenant.views.ers.rental.agreements.replaceOperatorModal.js) | 8 | 6 |
| [tenant.views.crs.agreements.deliveryModal](../../../readable/controllers/C0533--tenant.views.crs.agreements.deliveryModal.js) | 8 | 5 |
| [tenant.views.crs.vouchers.deposits.createDeposit](../../../readable/controllers/C1289--tenant.views.crs.vouchers.deposits.createDeposit.js) | 8 | 7 |
| [tenant.views.crs.vouchers.receipts.createOrEditModal](../../../readable/controllers/C1419--tenant.views.crs.vouchers.receipts.createOrEditModal.js) | 49 | 25 |
| [tenant.views.crs.contacts.searchContactModal](../../../readable/controllers/C0706--tenant.views.crs.contacts.searchContactModal.js) | 7 | 2 |
| [tenant.views.crs.agreements.agreementLogsModal](../../../readable/controllers/C0526--tenant.views.crs.agreements.agreementLogsModal.js) | 2 | 1 |
| [tenant.views.crs.agreements.agreementDocumentsModal](../../../readable/controllers/C0524--tenant.views.crs.agreements.agreementDocumentsModal.js) | 12 | 4 |
| [tenant.views.crs.contacts.createOrEditModal](../../../readable/controllers/C0703--tenant.views.crs.contacts.createOrEditModal.js) | 45 | 24 |
| [tenant.views.crs.discountCodes.applyDiscountModal](../../../readable/controllers/C0304--tenant.views.crs.discountCodes.applyDiscountModal.js) | 4 | 0 |
| [tenant.views.crs.discountCodes.applyDiscountModal](../../../readable/controllers/C0774--tenant.views.crs.discountCodes.applyDiscountModal.js) | 5 | 1 |
| [tenant.views.crs.vehicles.addExternalVehicle](../../../readable/controllers/C1158--tenant.views.crs.vehicles.addExternalVehicle.js) | 6 | 4 |
| [tenant.views.crs.vehicles.searchVehicleModal](../../../readable/controllers/C1186--tenant.views.crs.vehicles.searchVehicleModal.js) | 13 | 11 |
| [tenant.views.crs.agreements.printPreview](../../../readable/controllers/C0557--tenant.views.crs.agreements.printPreview.js) | 2 | 0 |
| [tenant.views.crs.vouchers.deposits.uploadDocumentsModal](../../../readable/controllers/C1300--tenant.views.crs.vouchers.deposits.uploadDocumentsModal.js) | 3 | 0 |
| [tenant.views.crs.vouchers.deposits.printTemplates.printPreview](../../../readable/controllers/C1304--tenant.views.crs.vouchers.deposits.printTemplates.printPreview.js) | 2 | 0 |
| [tenant.views.crs.vouchers.receipts.uploadDocumentsModal](../../../readable/controllers/C1430--tenant.views.crs.vouchers.receipts.uploadDocumentsModal.js) | 3 | 0 |
| [tenant.views.crs.vouchers.invoices.generateAdvanceTaxModal](../../../readable/controllers/C1318--tenant.views.crs.vouchers.invoices.generateAdvanceTaxModal.js) | 31 | 12 |
| [tenant.views.crs.vouchers.receipts.printTemplates.printPreview](../../../readable/controllers/C1433--tenant.views.crs.vouchers.receipts.printTemplates.printPreview.js) | 2 | 0 |
| [tenant.views.crs.contacts.uploadDocumentModal](../../../readable/controllers/C0699--tenant.views.crs.contacts.uploadDocumentModal.js) | 2 | 1 |
| [tenant.views.crs.contacts.uploadDocumentModal](../../../readable/controllers/C0711--tenant.views.crs.contacts.uploadDocumentModal.js) | 2 | 1 |
| [tenant.views.common.documents.uploadImageModal](../../../readable/controllers/C0363--tenant.views.common.documents.uploadImageModal.js) | 3 | 0 |
| [tenant.views.common.documents.uploadDocumentModal](../../../readable/controllers/C0362--tenant.views.common.documents.uploadDocumentModal.js) | 4 | 0 |
| [tenant.views.common.documents.addCreditCardModal](../../../readable/controllers/C0701--tenant.views.common.documents.addCreditCardModal.js) | 4 | 0 |
| [tenant.views.crs.discountCodes.verifyAuthCodeModal](../../../readable/controllers/C0778--tenant.views.crs.discountCodes.verifyAuthCodeModal.js) | 2 | 1 |
| [tenant.views.crs.vouchers.invoices.uploadDocumentsModal](../../../readable/controllers/C1355--tenant.views.crs.vouchers.invoices.uploadDocumentsModal.js) | 3 | 0 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.ers.deliveries.index`: `dateRangeModelChanged`، `searchSupplier`، `locationPermissionEditDelete`، `isDeliveryNotPending`، `searchUsers`، `locationPermissionClose`، `getlocalDateTime`، `statusChanged`، `getlocalDate`، `getlocalizedString`، `dateRangeCheck`، `exportToExcel`، `getDeliveryStatus`، `report`، `printAgreement`، `viewDelivery`، `viewAgreement`، `createAgreement`، `editAgreement`، `deliverEquipment`، `changeInvoicingStartDate`، `changeDeliveryClosingDate`، `approveDeliveryLevel1`، `approveDeliveryLevel2`، `closeEquipmentDeliveryAgreement`، `unCloseAgreement`، `searchCustomers`، `searchCustomerPopoup`، `getAgreements`، `deleteAgreement`، `openAgreementLogsModal`، `openAgreementDocumentsModal`، `clearCustomer`، `clearSalesPerson`، `clearInsuranceCompany`، `replaceEquipment`، `replaceOperator`، `addDeliveryMovement`، `addReceipt`، `createDeposit`.
- وحدة `common.views.common.reportViewer`: `exportToExcelFromReport`، `cancel`.
- وحدة `tenant.views.ers.deliveries.printTemplates.printPreview`: `cancel`، `getTemplateUrl`.
- وحدة `tenant.views.ers.deliveries.viewModal`: `getlocalDateTime`، `localize`، `getAgreementStatus`، `getAgreementType`، `cancel`، `totalDaysAndTime`.
- وحدة `tenant.views.ers.rental.agreements.createOrEditModal`: `getlocalDateTime`، `searchGoogleLocations`، `agreementTypeChange`، `localize`، `startDateChanged`، `addExternalEquipmentPopup`، `applyDiscount`، `agreementTypeSelected`، `endDateChanged`، `searchVehicles`، `searchCustomers`، `searchSupplier`، `searchCustomerPopoup`، `vehicleSelected`، `customerSelected`، `searchSaleOrders`، `searchVehiclePopup`، `save`، `cancel`، `tariffOptionSelected`، `disableRate`، `calculate`، `includedChanged`، `taxAcceptedChanged`، `discountApplied`، `totalDaysAndTime`.
- وحدة `tenant.views.ers.deliveries.deliveryModal`: `getlocalDateTime`، `localize`، `endDateChanged`، `save`، `cancel`.
- وحدة `tenant.views.ers.deliveries.changeInvoingStartDateModal`: `getlocalDateTime`، `localize`، `endDateChanged`، `save`، `cancel`.
- وحدة `tenant.views.ers.deliveries.changeClosingDateModal`: `getlocalDateTime`، `localize`، `endDateChanged`، `save`، `cancel`.
- وحدة `tenant.views.ers.deliveries.closeEquipmentAgreementModal`: `localize`، `getlocalDateTime`، `getAgreementType`، `includedChanged`، `endDateChanged`، `calculate`، `sumCharges`، `taxAcceptedChanged`، `save`، `cancel`.
- وحدة `tenant.views.ers.rental.agreements.replaceEquipmentModal`: `searchVehicles`، `getAgreementTypeName`، `getlocalDateTime`، `getFuelLevel`، `vehicleSelected`، `cancel`، `save`، `searchVehiclePopup`، `addExternalEquipmentPopup`.
- وحدة `tenant.views.ers.rental.agreements.replaceOperatorModal`: `searchSupplier`، `searchVehicles`، `getAgreementTypeName`، `getlocalDateTime`، `getFuelLevel`، `vehicleSelected`، `cancel`، `save`.
- وحدة `tenant.views.crs.agreements.deliveryModal`: `searchVehicles`، `searchDrivers`، `getAgreementTypeName`، `getlocalDateTime`، `getFuelLevel`، `vehicleSelected`، `cancel`، `save`.
- وحدة `tenant.views.crs.vouchers.deposits.createDeposit`: `uploadDocument`، `removeDocument`، `getOriginalName`، `amountChanged`، `depositSubTypeChanged`، `amountChangedDeposit`، `cancel`، `ok`.
- وحدة `tenant.views.crs.vouchers.receipts.createOrEditModal`: `localize`، `isEnabled`، `uploadDocument`، `getOriginalName`، `billingMethodSelected`، `receiptTypeChanged`، `dateNullOrNot`، `searchAccounts`، `addRow`، `removeRow`، `searchJobs`، `getReceiptTypeName`، `contactCardSelected`، `localize`، `rounding`، `amountChanged`، `amountWithoutCommissionChanged`، `sumAmountAllocationCharges`، `insertDueAmountOnClick`، `sumAmountAllocationChargesAgreement`، `sumTotalWithAllocation`، `calculateGeneralReceiptAmount`، `getlocalDateTime`، `getlocalDate`، `cancel`، `searchCustomers`، `searchContactGeneralPayment`، `onBillingMethodChange`، `calculateCreditCardCommission`، `calculateBankTransferCommission`، `searchVehicles`، `rounding`، `onCustomerSelect`، `onCustomerSelectForAgreement`، `conversionRateChanged`، `customerCurrencyChanged`، `customerCurrencyChangedForEdit`، `sumReceiptAmount`، `autoAllocation`، `sumAmount`، `searchCustomerPopoup`، `accountChangedGeneralPayment`، `moduleChanged`، `onAgreementSelect`، `openAdvanceTaxInvoiceModal`، `save`، `removeDocument`، `saveGeneralReceipt`، `checkCurrentDate`.
- وحدة `tenant.views.crs.contacts.searchContactModal`: `searchContacts`، `cancel`، `showAddContact`، `contactSelected`، `contactEdit`، `getContactsList`، `getNameWithCode`.
- وحدة `tenant.views.crs.agreements.agreementLogsModal`: `getlocalDateTime`، `cancel`.
- وحدة `tenant.views.crs.agreements.agreementDocumentsModal`: `getlocalDateTime`، `tabSelected`، `getAllAgreementDocumentsSettings`، `addIndentityDocument`، `doesIdentityDoucmentExist`، `cancel`، `openUploadDocument`، `getIdentificationDocumentType`، `removeIndentityDocument`، `openAgreementDocumentsModal`، `removeAgreementDocument`، `save`.
- وحدة `tenant.views.crs.contacts.createOrEditModal`: `localize`، `removeExternalIdRow`، `addExternalIdRow`، `getContactExternalType`، `isContactExternalType`، `getlocalDate`، `getlocalDateTime`، `getCardType`، `removeRow`، `searchSalesPersons`، `searchUsersWithDesignation`، `searchSalesPersonPopoup`، `salesPersonSelected`، `searchDebtCollectorPopoup`، `searchCustomLookup`، `getCustomLookups`، `scanDocument`، `openUploadDocument`، `openUploadPicture`، `addCreditCardRow`، `updateCreditCardRow`، `save`، `cancel`، `isPersonVerifiedChange`، `doesIdentityDoucmentExist`، `addIndentityDocument`، `getIdentificationDocumentType`، `removeIndentityDocument`، `removeDoc`، `isFieldMondatory`، `searchCountries`، `emiratesDataReader`، `emiratesDataFieldManager`، `getTariffCards`، `getTariffCardForContact`، `isDocument`، `maskCreditCard`، `getAdvanceSettings`، `getHighLightBlackListCountries`، `getNationalIdFormates`، `nationalIdFormate`، `onOverRideChange`، `resetDocumentNo`، `nationIdMaskInput`، `handleResidenceStatusChange`.
- وحدة `tenant.views.crs.discountCodes.applyDiscountModal`: `calculateDiscountedRate`، `calculateDiscountedPercentage`، `verifyAuthCode`، `applyDiscount`.
- وحدة `tenant.views.crs.discountCodes.applyDiscountModal`: `calculateDiscountedRate`، `calculateDiscountedPercentage`، `verifyAuthCode`، `getBranchWiseDiscount`، `applyDiscount`.
- وحدة `tenant.views.crs.vehicles.addExternalVehicle`: `localize`، `cancel`، `searchModel`، `getTeriffGroups`، `searchSupplier`، `save`.
- وحدة `tenant.views.crs.vehicles.searchVehicleModal`: `statusChanged`، `searchModel`، `cancel`، `clearInput`، `clearVehicle`، `getlocalDateTime`، `fromDateTimeChanged`، `searchVehicles`، `searchVehiclesFilters`، `exportToExcelByAgreement`، `vehicleSelected`، `getBookingDate`، `getTeriffGroups`.
- وحدة `tenant.views.crs.agreements.printPreview`: `cancel`، `getTemplateUrl`.
- وحدة `tenant.views.crs.vouchers.deposits.uploadDocumentsModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.crs.vouchers.deposits.printTemplates.printPreview`: `cancel`، `getTemplateUrl`.
- وحدة `tenant.views.crs.vouchers.receipts.uploadDocumentsModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.crs.vouchers.invoices.generateAdvanceTaxModal`: `rounding`، `chargesTypeVoucherLine`، `getColspan`، `chargesTypeVoucherLineRepeat`، `searchRentalOrLeaseAgreement`، `localize`، `cancel`، `depositSelected`، `amountChanged`، `getlocalDateTime`، `branchTaxCode`، `onCustomerSelect`، `searchCustomers`، `searchAdvanceReceipts`، `searchAccounts`، `searchCustomerPopoup`، `uploadDocument`، `getOriginalName`، `save`، `calculateCreditAndTax`، `sumAmount`، `rounding`، `rounding`، `setTaxPercentOnTaxCode`، `calculateTaxPerRow`، `rounding`، `sumAmountTax`، `rounding`، `addRow`، `removeDocument`، `getVehicleMakeName`.
- وحدة `tenant.views.crs.vouchers.receipts.printTemplates.printPreview`: `cancel`، `getTemplateUrl`.
- وحدة `tenant.views.crs.contacts.uploadDocumentModal`: `save`، `cancel`.
- وحدة `tenant.views.crs.contacts.uploadDocumentModal`: `save`، `cancel`.
- وحدة `tenant.views.common.documents.uploadImageModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.common.documents.uploadDocumentModal`: `uploadHeader`، `uploader.onBeforeUploadItem`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.common.documents.addCreditCardModal`: `ab`، `cardNumberChanged`، `save`، `cancel`.
- وحدة `tenant.views.crs.discountCodes.verifyAuthCodeModal`: `cancel`، `verifyCode`.
- وحدة `tenant.views.crs.vouchers.invoices.uploadDocumentsModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.directory.search` | POST | api/services/app/directory/Search | [المصدر](../../../raw/application.js#L346355) |
| `abp.services.app.equipmentDeliverySearch.exportToExcel` | POST | api/services/app/equipmentDeliverySearch/ExportToExcel | [المصدر](../../../raw/application.js#L401241) |
| `abp.services.app.equipmentDelivery.approveDeliveryLevel1` | POST | api/services/app/equipmentDelivery/ApproveDeliveryLevel1 | [المصدر](../../../raw/application.js#L401570) |
| `abp.services.app.equipmentDelivery.approveDeliveryLevel2` | POST | api/services/app/equipmentDelivery/ApproveDeliveryLevel2 | [المصدر](../../../raw/application.js#L401589) |
| `abp.services.app.chargesSetting.getChargesSettings` | POST | api/services/app/chargesSetting/GetChargesSettings | [المصدر](../../../raw/application.js#L401630) |
| `abp.services.app.equipmentDeliverySearch.getAgreements` | POST | api/services/app/equipmentDeliverySearch/GetAgreements | [المصدر](../../../raw/application.js#L401695) |
| `abp.services.app.equipmentDelivery.deleteAgreement` | POST | api/services/app/equipmentDelivery/DeleteAgreement | [المصدر](../../../raw/application.js#L401710) |
| `abp.services.app.commonLookup.getLocationsActiveAndInActive` | POST | api/services/app/commonLookup/GetLocationsActiveAndInActive | [المصدر](../../../raw/application.js#L401802) |
| `abp.services.app.designation.getDesignations` | POST | api/services/app/designation/GetDesignations | [المصدر](../../../raw/application.js#L410844) |
| `abp.services.app.synch.getAllCheckListItems` | POST | api/services/app/synch/GetAllCheckListItems | [المصدر](../../../raw/application.js#L402602) |
| `abp.services.app.equipmentDeliverySearch.getEquipmentRentalAgreementForView` | POST | api/services/app/equipmentDeliverySearch/GetEquipmentRentalAgreementForView | [المصدر](../../../raw/application.js#L402618) |
| `abp.services.app.commonLookup.searchGooglePlaces` | POST | api/services/app/commonLookup/SearchGooglePlaces | [المصدر](../../../raw/application.js#L409015) |
| `abp.services.app.vehicle.searchVehicles` | POST | api/services/app/vehicle/SearchVehicles | [المصدر](../../../raw/application.js#L312838) |
| `abp.services.app.agreementSaleOrder.searchSaleOrdersForAgreement` | POST | api/services/app/agreementSaleOrder/SearchSaleOrdersForAgreement | [المصدر](../../../raw/application.js#L409232) |
| `abp.services.app.equipmentRentalAgreement.createOrUpdateAgreement` | POST | api/services/app/equipmentRentalAgreement/CreateOrUpdateAgreement | [المصدر](../../../raw/application.js#L409352) |
| `abp.services.app.equipmentRentalAgreement.getEquipmentAgreementForEdit` | POST | api/services/app/equipmentRentalAgreement/GetEquipmentAgreementForEdit | [المصدر](../../../raw/application.js#L409580) |
| `abp.services.app.equipmentDelivery.deliverEquipment` | POST | api/services/app/equipmentDelivery/DeliverEquipment | [المصدر](../../../raw/application.js#L400816) |
| `abp.services.app.equipmentDelivery.getEquipmentDeliveryForEdit` | POST | api/services/app/equipmentDelivery/GetEquipmentDeliveryForEdit | [المصدر](../../../raw/application.js#L399919) |
| `abp.services.app.equipmentDelivery.changeInvoicingStartDate` | POST | api/services/app/equipmentDelivery/ChangeInvoicingStartDate | [المصدر](../../../raw/application.js#L399984) |
| `abp.services.app.equipmentDelivery.changeDeliveryClosingDate` | POST | api/services/app/equipmentDelivery/ChangeDeliveryClosingDate | [المصدر](../../../raw/application.js#L399901) |
| `abp.services.app.equipmentDelivery.closeEquipmentAgreement` | POST | api/services/app/equipmentDelivery/CloseEquipmentAgreement | [المصدر](../../../raw/application.js#L400167) |
| `abp.services.app.commonLookup.getLocations` | POST | api/services/app/commonLookup/GetLocations | [المصدر](../../../raw/application.js#L313017) |
| `abp.services.app.equipmentDeliverySearch.getEquipmentAgreementForClosing` | POST | api/services/app/equipmentDeliverySearch/GetEquipmentAgreementForClosing | [المصدر](../../../raw/application.js#L400200) |
| `abp.services.app.equipmentAgreementReplacement.replaceEquipment` | POST | api/services/app/equipmentAgreementReplacement/ReplaceEquipment | [المصدر](../../../raw/application.js#L410697) |
| `abp.services.app.commonLookup.getReplacementReasons` | POST | api/services/app/commonLookup/GetReplacementReasons | [المصدر](../../../raw/application.js#L410769) |
| `abp.services.app.commonAgreement.getAgreement` | POST | api/services/app/commonAgreement/GetAgreement | [المصدر](../../../raw/application.js#L388176) |
| `abp.services.app.equipmentAgreementReplacement.replaceOperator` | POST | api/services/app/equipmentAgreementReplacement/ReplaceOperator | [المصدر](../../../raw/application.js#L410931) |
| `abp.services.app.commonAgreement.getAgreementForOperatorReplacement` | POST | api/services/app/commonAgreement/GetAgreementForOperatorReplacement | [المصدر](../../../raw/application.js#L410952) |
| `abp.services.app.agreement.addDeliveryMovement` | غير مربوط | غير محسوم | [المصدر](../../../raw/application.js#L141349) |
| `abp.services.app.replacementReason.getReplacementReasons` | POST | api/services/app/replacementReason/GetReplacementReasons | [المصدر](../../../raw/application.js#L141366) |
| `abp.services.app.commonAgreement.updateFuelRate` | POST | api/services/app/commonAgreement/UpdateFuelRate | [المصدر](../../../raw/application.js#L141378) |
| `abp.services.app.billingMethod.getDefaultCreditCard` | POST | api/services/app/billingMethod/GetDefaultCreditCard | [المصدر](../../../raw/application.js#L386977) |
| `abp.services.app.deposit.createDepositForAgreement` | POST | api/services/app/deposit/CreateDepositForAgreement | [المصدر](../../../raw/application.js#L338766) |
| `abp.services.app.deposit.createDepositWithChargeForAgreement` | POST | api/services/app/deposit/CreateDepositWithChargeForAgreement | [المصدر](../../../raw/application.js#L338783) |
| `abp.services.app.billingMethod.getBillingMethods` | POST | api/services/app/billingMethod/GetBillingMethods | [المصدر](../../../raw/application.js#L387454) |
| `abp.services.app.commonLookup.getBankAccountsForSelection` | POST | api/services/app/commonLookup/GetBankAccountsForSelection | [المصدر](../../../raw/application.js#L387571) |
| `abp.services.app.deposit.getDepositForEdit` | POST | api/services/app/deposit/GetDepositForEdit | [المصدر](../../../raw/application.js#L338884) |
| `abp.services.app.commonLookup.getContactCards` | POST | api/services/app/commonLookup/GetContactCards | [المصدر](../../../raw/application.js#L386984) |
| `abp.services.app.account.searchAccountsForSubLookUp` | POST | api/services/app/account/SearchAccountsForSubLookUp | [المصدر](../../../raw/application.js#L346376) |
| `abp.services.app.chargesSetting.getConfiguredChargesTypes` | POST | api/services/app/chargesSetting/GetConfiguredChargesTypes | [المصدر](../../../raw/application.js#L387052) |
| `abp.services.app.job.searchJobs` | POST | api/services/app/job/SearchJobs | [المصدر](../../../raw/application.js#L387128) |
| `abp.services.app.directory.searchByContactGroup` | POST | api/services/app/directory/SearchByContactGroup | [المصدر](../../../raw/application.js#L387360) |
| `abp.services.app.currency.getCurrencies` | POST | api/services/app/currency/GetCurrencies | [المصدر](../../../raw/application.js#L183468) |
| `abp.services.app.allocation.getAllocationsForEdit` | POST | api/services/app/allocation/GetAllocationsForEdit | [المصدر](../../../raw/application.js#L387494) |
| `abp.services.app.allocation.getAllocationsForReceiptBaseOnAgreement` | POST | api/services/app/allocation/GetAllocationsForReceiptBaseOnAgreement | [المصدر](../../../raw/application.js#L387554) |
| `abp.services.app.commonLookup.getCurrencies` | POST | api/services/app/commonLookup/GetCurrencies | [المصدر](../../../raw/application.js#L388216) |
| `abp.services.app.commonAgreement.getAllAgreementsOnCustomer` | POST | api/services/app/commonAgreement/GetAllAgreementsOnCustomer | [المصدر](../../../raw/application.js#L388011) |
| `abp.services.app.receiptChargesAllocation.getReceiptChargesAllocationsForAgreementEdit` | POST | api/services/app/receiptChargesAllocation/GetReceiptChargesAllocationsForAgreementEdit | [المصدر](../../../raw/application.js#L387987) |
| `abp.services.app.receiptSearch.getReceiptForEdit` | POST | api/services/app/receiptSearch/GetReceiptForEdit | [المصدر](../../../raw/application.js#L388043) |
| `abp.services.app.receipt.createOrUpdateReceipt` | POST | api/services/app/receipt/CreateOrUpdateReceipt | [المصدر](../../../raw/application.js#L388363) |
| `abp.services.app.receipt.createOrUpdateReceiptWithCharge` | POST | api/services/app/receipt/CreateOrUpdateReceiptWithCharge | [المصدر](../../../raw/application.js#L388423) |
| `abp.services.app.receipt.createOrUpdateReceiptPayment` | POST | api/services/app/receipt/CreateOrUpdateReceiptPayment | [المصدر](../../../raw/application.js#L388555) |
| `abp.services.app.directory.searchDirectoryPaged` | POST | api/services/app/directory/SearchDirectoryPaged | [المصدر](../../../raw/application.js#L184666) |
| `abp.services.app.commonAgreement.getAgreementLogs` | POST | api/services/app/commonAgreement/GetAgreementLogs | [المصدر](../../../raw/application.js#L135530) |
| `abp.services.app.agreement.getAgreementDocumentsSettings` | POST | api/services/app/agreement/GetAgreementDocumentsSettings | [المصدر](../../../raw/application.js#L134817) |
| `abp.services.app.agreement.deleteAgreementDocument` | POST | api/services/app/agreement/DeleteAgreementDocument | [المصدر](../../../raw/application.js#L135083) |
| `abp.services.app.agreement.getAgreementDocuments` | POST | api/services/app/agreement/GetAgreementDocuments | [المصدر](../../../raw/application.js#L135108) |
| `abp.services.app.agreement.saveAgreementDocuments` | POST | api/services/app/agreement/SaveAgreementDocuments | [المصدر](../../../raw/application.js#L135138) |
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
| `abp.services.app.userWiseDiscount.getBranchWiseUserDiscount` | POST | api/services/app/userWiseDiscount/GetBranchWiseUserDiscount | [المصدر](../../../raw/application.js#L201812) |
| `abp.services.app.vehicleModel.searchVehicleModelsNew` | POST | api/services/app/vehicleModel/SearchVehicleModelsNew | [المصدر](../../../raw/application.js#L312735) |
| `abp.services.app.commonLookup.getTariffGroups` | POST | api/services/app/commonLookup/GetTariffGroups | [المصدر](../../../raw/application.js#L313062) |
| `abp.services.app.vehicle.getNextFleetCode` | POST | api/services/app/vehicle/GetNextFleetCode | [المصدر](../../../raw/application.js#L305969) |
| `abp.services.app.vehicle.searchVehiclesPagedWorkShop` | POST | api/services/app/vehicle/SearchVehiclesPagedWorkShop | [المصدر](../../../raw/application.js#L312796) |
| `abp.services.app.vehicle.searchVehiclesPagedByAgreement` | POST | [object Object] | [المصدر](../../../raw/application.js#L312800) |
| `abp.services.app.vehicle.searchVehiclesPaged` | POST | api/services/app/vehicle/SearchVehiclesPaged | [المصدر](../../../raw/application.js#L312803) |
| `abp.services.app.vehicle.exportToExcelByAgreement` | POST | api/services/app/vehicle/ExportToExcelByAgreement | [المصدر](../../../raw/application.js#L312885) |
| `abp.services.app.commonLookup.searchRentalOrLeaseAgreement` | POST | api/services/app/commonLookup/SearchRentalOrLeaseAgreement | [المصدر](../../../raw/application.js#L346203) |
| `abp.services.app.commonLookup.getLocationById` | POST | api/services/app/commonLookup/GetLocationById | [المصدر](../../../raw/application.js#L346276) |
| `abp.services.app.receipt.getAdvanceReceipts` | POST | api/services/app/receipt/GetAdvanceReceipts | [المصدر](../../../raw/application.js#L346346) |
| `abp.services.app.receipt.getAdvanceTaxReceipt` | POST | [object Object] | [المصدر](../../../raw/application.js#L346361) |
| `abp.services.app.invoice.createOrUpdateAdvanceTaxInvoice` | POST | api/services/app/invoice/CreateOrUpdateAdvanceTaxInvoice | [المصدر](../../../raw/application.js#L346448) |
| `abp.services.app.vehicleModel.getVehicleModels` | POST | api/services/app/vehicleModel/GetVehicleModels | [المصدر](../../../raw/application.js#L346739) |
| `abp.services.app.invoice.getInvoiceForEdit` | POST | api/services/app/invoice/GetInvoiceForEdit | [المصدر](../../../raw/application.js#L346755) |
| `abp.services.app.salesAgreement.getSalesAgreementForEdit` | POST | api/services/app/salesAgreement/GetSalesAgreementForEdit | [المصدر](../../../raw/application.js#L346763) |
| `abp.services.app.salesQuotation.getQuotationForEdit` | POST | api/services/app/salesQuotation/GetQuotationForEdit | [المصدر](../../../raw/application.js#L346820) |
| `abp.services.app.account.getAccount` | POST | api/services/app/account/GetAccount | [المصدر](../../../raw/application.js#L346904) |
| `abp.services.app.person.uploadDocumentImage` | POST | api/services/app/person/UploadDocumentImage | [المصدر](../../../raw/application.js#L185476) |
| `abp.services.app.discountAuthCode.verifyCode` | POST | api/services/app/discountAuthCode/VerifyCode | [المصدر](../../../raw/application.js#L202257) |

## الصلاحيات والحقول

- صلاحية `Pages.ERS.Rental.Agreement`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.ERS.Rental.Agreements.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.ERS.EquipmentDelivery.ApprovalLevelOne`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.ERS.EquipmentDelivery.ApprovalLevelTwo`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.ERS.Rental.Agreements.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.ERS.Rental.Agreements.ReplaceVehicle`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.ERS.Rental.Agreements.Close`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.ERS.Rental.Agreements.UnClose`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.ERS.Rental.Agreements.Delete`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.ERS.Rental.Agreements.AllActionsOnOtherBranchAgreements`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.ERS.Rental.Agreements.ViewOtherBranchAgreements`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Receipts.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.ERS.Rental.Agreements.Edit.CanChangeRates`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.ERS.Rental.Agreements.CanOpenAgreementWithoutSaleOrder`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.AllActionsOnOtherBranchAgreements`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.ViewOtherBranchAgreements`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Receipts.AllActionsOnOtherBranchReceipts`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Allocations`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Receipts.CanChangeDate`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Delete`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.AgreementDocuments.AddDocument`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.AgreementDocuments.EditDocument`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.AgreementDocuments.DeleteDocument`: ممنوحة في السياق الملتقط.
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
- صلاحية `Pages.Tenant.SalesModule.SalesAgreement.GenerateDownPaymentReceipt`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.SalesModule.SalesQuotation.GenerateDownPaymentReceipt`: ممنوحة في السياق الملتقط.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.filters.agreementNo` | text |  |  |
| `vm.filters.masterAgreementNo` | text |  |  |
| `vm.filters.locationId` | select | locationId |  |
| `vm.filters.plateNo` | text |  |  |
| `vm.dateRangeModel` | text |  | min=vm.dateRangeOptions.min; max=vm.dateRangeOptions.max; ng-disabled=!vm.filters.enableDateRange |
| `vm.filters.enableDateRange` | checkbox | disableDateRange |  |
| `vm.filters.agreementType` | select | agreementType | ng-options=item.id as item.type for item in vm.agreementTypes |
| `vm.filters.status` | select |  | ng-options=status.id as status.name for status in vm.statuses |
| `vm.filters.customer` | ui-select |  |  |
| `vm.filters.poNo` | text |  |  |
| `vm.filters.saleOrder` | text |  |  |
| `vm.filters.vehicleOwnership` | select | ownership | ng-options=ownership.value as ownership.key for ownership in vm.rentalAgreementOwnerships |
| `vm.filters.operatorSupplier` | ui-select |  |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
