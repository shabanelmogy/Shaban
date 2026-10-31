# شاشة: Sales Quotation

المسار في القائمة: Sales ← Sales Quotation.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_salesQuotation`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0365](../../../readable/routes/R0365--tenant-crs-salesquotation.js)، والأصل [raw/application.js:4158](../../../raw/application.js#L4158).
- قالب الشاشة: `~/App/tenant/views/crs/equipmentSales/salesQuotation/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.equipmentSales.salesQuotation.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.equipmentSales.salesQuotation.index](../../../readable/controllers/C0812--tenant.views.crs.equipmentSales.salesQuotation.index.js) | 33 | 12 |
| [tenant.views.crs.contacts.searchContactModal](../../../readable/controllers/C0706--tenant.views.crs.contacts.searchContactModal.js) | 7 | 2 |
| [tenant.views.crs.vehicles.searchVehicleModal](../../../readable/controllers/C1186--tenant.views.crs.vehicles.searchVehicleModal.js) | 13 | 11 |
| [tenant.views.crs.lease.leaseQuotations.printtemplates.printPreview](../../../readable/controllers/C0883--tenant.views.crs.lease.leaseQuotations.printtemplates.printPreview.js) | 2 | 0 |
| [tenant.views.crs.equipmentSales.agreements.createOrEditModal](../../../readable/controllers/C0784--tenant.views.crs.equipmentSales.agreements.createOrEditModal.js) | 76 | 14 |
| [tenant.views.crs.vouchers.receipts.createOrEditModal](../../../readable/controllers/C1419--tenant.views.crs.vouchers.receipts.createOrEditModal.js) | 49 | 25 |
| [tenant.views.common.payments.quotationalPayment](../../../readable/controllers/C0411--tenant.views.common.payments.quotationalPayment.js) | 4 | 1 |
| [tenant.views.common.payments.silentPayment](../../../readable/controllers/C0412--tenant.views.common.payments.silentPayment.js) | 2 | 3 |
| [tenant.views.crs.lease.leaseQuotations.createOrEditModal](../../../readable/controllers/C0876--tenant.views.crs.lease.leaseQuotations.createOrEditModal.js) | 16 | 10 |
| [tenant.views.crs.equipmentSales.salesQuotation.createOrEditQuotationModal](../../../readable/controllers/C0811--tenant.views.crs.equipmentSales.salesQuotation.createOrEditQuotationModal.js) | 34 | 12 |
| [tenant.views.crs.equipmentSales.salesQuotation.printtemplates.printPreview](../../../readable/controllers/C0816--tenant.views.crs.equipmentSales.salesQuotation.printtemplates.printPreview.js) | 2 | 0 |
| [tenant.views.crs.equipmentSales.salesQuotation.viewModal](../../../readable/controllers/C0815--tenant.views.crs.equipmentSales.salesQuotation.viewModal.js) | 11 | 4 |
| [tenant.views.crs.vouchers.common.rejectReason](../../../readable/controllers/C1256--tenant.views.crs.vouchers.common.rejectReason.js) | 2 | 0 |
| [tenant.views.crs.contacts.createOrEditModal](../../../readable/controllers/C0703--tenant.views.crs.contacts.createOrEditModal.js) | 45 | 24 |
| [tenant.views.crs.equipmentSales.agreements.uploadDocumentsModal](../../../readable/controllers/C0791--tenant.views.crs.equipmentSales.agreements.uploadDocumentsModal.js) | 3 | 0 |
| [tenant.views.crs.discountCodes.applyDiscountModal](../../../readable/controllers/C0304--tenant.views.crs.discountCodes.applyDiscountModal.js) | 4 | 0 |
| [tenant.views.crs.discountCodes.applyDiscountModal](../../../readable/controllers/C0774--tenant.views.crs.discountCodes.applyDiscountModal.js) | 5 | 1 |
| [tenant.views.crs.agreements.agreementAdvanceAndDeposit](../../../readable/controllers/C0522--tenant.views.crs.agreements.agreementAdvanceAndDeposit.js) | 15 | 4 |
| [tenant.views.crs.vouchers.receipts.uploadDocumentsModal](../../../readable/controllers/C1430--tenant.views.crs.vouchers.receipts.uploadDocumentsModal.js) | 3 | 0 |
| [tenant.views.crs.vouchers.invoices.generateAdvanceTaxModal](../../../readable/controllers/C1318--tenant.views.crs.vouchers.invoices.generateAdvanceTaxModal.js) | 31 | 12 |
| [tenant.views.crs.vouchers.receipts.printTemplates.printPreview](../../../readable/controllers/C1433--tenant.views.crs.vouchers.receipts.printTemplates.printPreview.js) | 2 | 0 |
| [tenant.views.crs.lease.leaseQuotations.calculationDetail](../../../readable/controllers/C0874--tenant.views.crs.lease.leaseQuotations.calculationDetail.js) | 4 | 0 |
| [tenant.views.crs.contacts.uploadDocumentModal](../../../readable/controllers/C0699--tenant.views.crs.contacts.uploadDocumentModal.js) | 2 | 1 |
| [tenant.views.crs.contacts.uploadDocumentModal](../../../readable/controllers/C0711--tenant.views.crs.contacts.uploadDocumentModal.js) | 2 | 1 |
| [tenant.views.common.documents.uploadDocumentModal](../../../readable/controllers/C0362--tenant.views.common.documents.uploadDocumentModal.js) | 4 | 0 |
| [tenant.views.common.documents.uploadImageModal](../../../readable/controllers/C0363--tenant.views.common.documents.uploadImageModal.js) | 3 | 0 |
| [tenant.views.common.documents.addCreditCardModal](../../../readable/controllers/C0701--tenant.views.common.documents.addCreditCardModal.js) | 4 | 0 |
| [tenant.views.crs.discountCodes.verifyAuthCodeModal](../../../readable/controllers/C0778--tenant.views.crs.discountCodes.verifyAuthCodeModal.js) | 2 | 1 |
| [tenant.views.crs.vouchers.deposits.uploadDocumentsModal](../../../readable/controllers/C1300--tenant.views.crs.vouchers.deposits.uploadDocumentsModal.js) | 3 | 0 |
| [tenant.views.crs.vouchers.invoices.uploadDocumentsModal](../../../readable/controllers/C1355--tenant.views.crs.vouchers.invoices.uploadDocumentsModal.js) | 3 | 0 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.equipmentSales.salesQuotation.index`: `dateRangeModelChanged`، `dateRangeCheck`، `CurrencyFormate`، `getStatus`، `searchVehicles`، `canCreateOpenAgreement`، `searchContact`، `searchContactPopoup`، `searchVehiclePopup`، `getSalesQuotations`، `currencyAndRoundingWithThree`، `roundingforView`، `getlocalDate`، `exportToExcel`، `canCreateLPO`، `canRevise`، `leaseQuotationPrintModal`، `createSalesAgreement`، `createReceipt`، `paymentAndAddCardInQuotation`، `openSilentPaymentModal`، `quotationPrintModal`، `createNewQuotation`، `editNewLeaseQuotation`، `viewRentalQuotation`، `deleteLeaseQuotation`، `approveQuotation`، `unApproveQuotation`، `rejectQuotation`، `rejectQuotationByCustomer`، `approveQuotationByCustomer`، `enterKeyPress`، `clearCustomer`.
- وحدة `tenant.views.crs.contacts.searchContactModal`: `searchContacts`، `cancel`، `showAddContact`، `contactSelected`، `contactEdit`، `getContactsList`، `getNameWithCode`.
- وحدة `tenant.views.crs.vehicles.searchVehicleModal`: `statusChanged`، `searchModel`، `cancel`، `clearInput`، `clearVehicle`، `getlocalDateTime`، `fromDateTimeChanged`، `searchVehicles`، `searchVehiclesFilters`، `exportToExcelByAgreement`، `vehicleSelected`، `getBookingDate`، `getTeriffGroups`.
- وحدة `tenant.views.crs.lease.leaseQuotations.printtemplates.printPreview`: `cancel`، `getTemplateUrl`.
- وحدة `tenant.views.crs.equipmentSales.agreements.createOrEditModal`: `rounding`، `getlocalDateTime`، `searchAdditionalDrivers`، `addAdditionalChargeRow`، `removeAdditionalChargeRow`، `calculateAdditionalCharges`، `priceChanged`، `taxAcceptedChanged`، `roundingWithSeparator`، `onFincanceCostChanged`، `recalculateOtherChargesEMI`، `downPaymentChanged`، `recalculateAmount`، `onEmiFlagChanged`، `perInstallmentChanged`، `costPriceOrMarginChanged2`، `downPaymentOrInstallmentsChanged`، `onSalePriceChanged`، `getExcludedChargesTotal`، `getIncludedChargesTotal`، `getOtherChargesEMI`، `applyFinanceCostRules`، `removeDocument`، `getInstallmentIndex`، `getOriginalName`، `uploadDocument`، `localize`، `removeRow`، `addChargesRow`، `removeChargesRow`، `addRow`، `addQuotationRow`، `addQuotationRowAp`، `getVehicleMakeName`، `removeChequeRow`، `applyDiscount`، `calculateCharges`، `validateBaseAmount`، `setOldValues`، `onEmiValuesChange`، `redistributeField`، `syncEmiToOtherRows`، `getBaseEditableRowIndex`، `updateChequeRows`، `onBankNameChange`، `onChequeNoChange`، `onBillingMethodChange`، `onPaymentMethodChange`، `onNumOfInstallmentsChange`، `isFirstUninvoicedRow`، `calculateEachInstallment`، `addInstallmentRow`، `addChequeRow`، `agreementTypeSelected`، `searchCustomers`، `searchStaff`، `searchCustomerPopoup`، `vehicleSelected`، `searchVehicles`، `searchVehiclesForAgreement`، `customerSelected`، `save`، `cancel`، `tariffOptionSelected`، `disableRate`، `calculateDiscount`، `includedChanged`، `discountApplied`، `updateCharges`، `getTotalCharges`، `changeStatusReceiptCreation`، `changeStatusDepositCreation`، `costPriceOrMarginChanged`، `getInstallmentsTotal`، `priceChanged2`، `calculateTotalAmount`.
- وحدة `tenant.views.crs.vouchers.receipts.createOrEditModal`: `localize`، `isEnabled`، `uploadDocument`، `getOriginalName`، `billingMethodSelected`، `receiptTypeChanged`، `dateNullOrNot`، `searchAccounts`، `addRow`، `removeRow`، `searchJobs`، `getReceiptTypeName`، `contactCardSelected`، `localize`، `rounding`، `amountChanged`، `amountWithoutCommissionChanged`، `sumAmountAllocationCharges`، `insertDueAmountOnClick`، `sumAmountAllocationChargesAgreement`، `sumTotalWithAllocation`، `calculateGeneralReceiptAmount`، `getlocalDateTime`، `getlocalDate`، `cancel`، `searchCustomers`، `searchContactGeneralPayment`، `onBillingMethodChange`، `calculateCreditCardCommission`، `calculateBankTransferCommission`، `searchVehicles`، `rounding`، `onCustomerSelect`، `onCustomerSelectForAgreement`، `conversionRateChanged`، `customerCurrencyChanged`، `customerCurrencyChangedForEdit`، `sumReceiptAmount`، `autoAllocation`، `sumAmount`، `searchCustomerPopoup`، `accountChangedGeneralPayment`، `moduleChanged`، `onAgreementSelect`، `openAdvanceTaxInvoiceModal`، `save`، `removeDocument`، `saveGeneralReceipt`، `checkCurrentDate`.
- وحدة `tenant.views.common.payments.quotationalPayment`: `isOneTimePaymentOnChange`، `send`، `cancel`، `getlocalDateTime`.
- وحدة `tenant.views.common.payments.silentPayment`: `cancel`، `pay`.
- وحدة `tenant.views.crs.lease.leaseQuotations.createOrEditModal`: `rounding`، `searchContact`، `searchContactPopoup`، `searchModel`، `getStatus`، `modelSelected`، `periodChanged`، `addRow`، `removeRow`، `calculationDetail`، `calculationDetailView`، `cancel`، `calculate`، `sum`، `getcostingParameters`، `save`.
- وحدة `tenant.views.crs.equipmentSales.salesQuotation.createOrEditQuotationModal`: `rounding`، `searchSalesPersons`، `searchSalesPersonPopoup`، `salesPersonSelected`، `localize`، `isdateNull`، `getPeriodType`، `getRateType`، `vehicleTypeChanged`، `loadandApplyTariffToAllLines`، `loadandApplyTariff`، `calculateTax`، `calculateTaxForShow`، `applyTariff`، `quotationTypeChanged`، `searchContact`، `branchTaxCode`، `customerChanged`، `searchContactPopoup`، `modelSelected`، `vehicleTypeChanged`، `searchModel`، `getTariffGroups`، `getStatus`، `addRow`، `removeRow`، `cancel`، `calculateChargesForAll`، `calculateSums`، `updateCharges`، `updateChargesPF`، `downPaymentChanged`، `perInstallmentChanged`، `save`.
- وحدة `tenant.views.crs.equipmentSales.salesQuotation.printtemplates.printPreview`: `cancel`، `getTemplateUrl`.
- وحدة `tenant.views.crs.equipmentSales.salesQuotation.viewModal`: `rounding`، `localize`، `currencyAndRoundingWithThree`، `roundingforView`، `getPeriodType`، `getRateType`، `getTariffGroups`، `getStatus`، `cancel`، `calculateChargesForAll`، `calculateSums`.
- وحدة `tenant.views.crs.vouchers.common.rejectReason`: `cancel`، `save`.
- وحدة `tenant.views.crs.contacts.createOrEditModal`: `localize`، `removeExternalIdRow`، `addExternalIdRow`، `getContactExternalType`، `isContactExternalType`، `getlocalDate`، `getlocalDateTime`، `getCardType`، `removeRow`، `searchSalesPersons`، `searchUsersWithDesignation`، `searchSalesPersonPopoup`، `salesPersonSelected`، `searchDebtCollectorPopoup`، `searchCustomLookup`، `getCustomLookups`، `scanDocument`، `openUploadDocument`، `openUploadPicture`، `addCreditCardRow`، `updateCreditCardRow`، `save`، `cancel`، `isPersonVerifiedChange`، `doesIdentityDoucmentExist`، `addIndentityDocument`، `getIdentificationDocumentType`، `removeIndentityDocument`، `removeDoc`، `isFieldMondatory`، `searchCountries`، `emiratesDataReader`، `emiratesDataFieldManager`، `getTariffCards`، `getTariffCardForContact`، `isDocument`، `maskCreditCard`، `getAdvanceSettings`، `getHighLightBlackListCountries`، `getNationalIdFormates`، `nationalIdFormate`، `onOverRideChange`، `resetDocumentNo`، `nationIdMaskInput`، `handleResidenceStatusChange`.
- وحدة `tenant.views.crs.equipmentSales.agreements.uploadDocumentsModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.crs.discountCodes.applyDiscountModal`: `calculateDiscountedRate`، `calculateDiscountedPercentage`، `verifyAuthCode`، `applyDiscount`.
- وحدة `tenant.views.crs.discountCodes.applyDiscountModal`: `calculateDiscountedRate`، `calculateDiscountedPercentage`، `verifyAuthCode`، `getBranchWiseDiscount`، `applyDiscount`.
- وحدة `tenant.views.crs.agreements.agreementAdvanceAndDeposit`: `uploadDocument`، `uploadAdvanceDocument`، `removeDocument`، `removeAdvanceDocument`، `getOriginalName`، `amountChanged`، `amountChangedDeposit`، `customerCurrencyChanged`، `amountWithoutCommissionChanged`، `cancel`، `calculateCreditCardCommission`، `conversionRateChanged`، `onCustomerSelect`، `ok`، `dateNullOrNot`.
- وحدة `tenant.views.crs.vouchers.receipts.uploadDocumentsModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.crs.vouchers.invoices.generateAdvanceTaxModal`: `rounding`، `chargesTypeVoucherLine`، `getColspan`، `chargesTypeVoucherLineRepeat`، `searchRentalOrLeaseAgreement`، `localize`، `cancel`، `depositSelected`، `amountChanged`، `getlocalDateTime`، `branchTaxCode`، `onCustomerSelect`، `searchCustomers`، `searchAdvanceReceipts`، `searchAccounts`، `searchCustomerPopoup`، `uploadDocument`، `getOriginalName`، `save`، `calculateCreditAndTax`، `sumAmount`، `rounding`، `rounding`، `setTaxPercentOnTaxCode`، `calculateTaxPerRow`، `rounding`، `sumAmountTax`، `rounding`، `addRow`، `removeDocument`، `getVehicleMakeName`.
- وحدة `tenant.views.crs.vouchers.receipts.printTemplates.printPreview`: `cancel`، `getTemplateUrl`.
- وحدة `tenant.views.crs.lease.leaseQuotations.calculationDetail`: `includedChanged`، `localize`، `calculate`، `cancel`.
- وحدة `tenant.views.crs.contacts.uploadDocumentModal`: `save`، `cancel`.
- وحدة `tenant.views.crs.contacts.uploadDocumentModal`: `save`، `cancel`.
- وحدة `tenant.views.common.documents.uploadDocumentModal`: `uploadHeader`، `uploader.onBeforeUploadItem`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.common.documents.uploadImageModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.common.documents.addCreditCardModal`: `ab`، `cardNumberChanged`، `save`، `cancel`.
- وحدة `tenant.views.crs.discountCodes.verifyAuthCodeModal`: `cancel`، `verifyCode`.
- وحدة `tenant.views.crs.vouchers.deposits.uploadDocumentsModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.crs.vouchers.invoices.uploadDocumentsModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.vehicle.searchVehicles` | POST | api/services/app/vehicle/SearchVehicles | [المصدر](../../../raw/application.js#L387484) |
| `abp.services.app.directory.search` | POST | api/services/app/directory/Search | [المصدر](../../../raw/application.js#L346355) |
| `abp.services.app.commonLookup.getLocationsActiveAndInActive` | POST | api/services/app/commonLookup/GetLocationsActiveAndInActive | [المصدر](../../../raw/application.js#L219777) |
| `abp.services.app.salesQuotation.getQuotations` | POST | api/services/app/salesQuotation/GetQuotations | [المصدر](../../../raw/application.js#L218786) |
| `abp.services.app.salesQuotation.exportToExcel` | POST | api/services/app/salesQuotation/ExportToExcel | [المصدر](../../../raw/application.js#L218824) |
| `abp.services.app.chargesSetting.getChargesSettings` | POST | api/services/app/chargesSetting/GetChargesSettings | [المصدر](../../../raw/application.js#L219867) |
| `abp.services.app.salesQuotation.deleteQuotation` | POST | api/services/app/salesQuotation/DeleteQuotation | [المصدر](../../../raw/application.js#L219282) |
| `abp.services.app.salesQuotation.approveQuotation` | POST | api/services/app/salesQuotation/ApproveQuotation | [المصدر](../../../raw/application.js#L219299) |
| `abp.services.app.salesQuotation.unApproveQuotation` | POST | api/services/app/salesQuotation/UnApproveQuotation | [المصدر](../../../raw/application.js#L219318) |
| `abp.services.app.salesQuotation.rejectQuotation` | POST | api/services/app/salesQuotation/RejectQuotation | [المصدر](../../../raw/application.js#L219361) |
| `abp.services.app.salesQuotation.rejectQuotationByCustomer` | POST | api/services/app/salesQuotation/RejectQuotationByCustomer | [المصدر](../../../raw/application.js#L219399) |
| `abp.services.app.salesQuotation.approveQuotationByCustomer` | POST | api/services/app/salesQuotation/ApproveQuotationByCustomer | [المصدر](../../../raw/application.js#L219414) |
| `abp.services.app.directory.searchDirectoryPaged` | POST | api/services/app/directory/SearchDirectoryPaged | [المصدر](../../../raw/application.js#L184666) |
| `abp.services.app.vehicleModel.searchVehicleModelsNew` | POST | api/services/app/vehicleModel/SearchVehicleModelsNew | [المصدر](../../../raw/application.js#L218387) |
| `abp.services.app.vehicle.searchVehiclesPagedWorkShop` | POST | api/services/app/vehicle/SearchVehiclesPagedWorkShop | [المصدر](../../../raw/application.js#L312796) |
| `abp.services.app.vehicle.searchVehiclesPagedByAgreement` | POST | [object Object] | [المصدر](../../../raw/application.js#L312800) |
| `abp.services.app.vehicle.searchVehiclesPaged` | POST | api/services/app/vehicle/SearchVehiclesPaged | [المصدر](../../../raw/application.js#L312803) |
| `abp.services.app.vehicle.exportToExcelByAgreement` | POST | api/services/app/vehicle/ExportToExcelByAgreement | [المصدر](../../../raw/application.js#L312885) |
| `abp.services.app.commonLookup.getLocations` | POST | api/services/app/commonLookup/GetLocations | [المصدر](../../../raw/application.js#L182597) |
| `abp.services.app.commonLookup.getTariffGroups` | POST | api/services/app/commonLookup/GetTariffGroups | [المصدر](../../../raw/application.js#L219794) |
| `abp.services.app.vehicleModel.getVehicleModels` | POST | api/services/app/vehicleModel/GetVehicleModels | [المصدر](../../../raw/application.js#L346739) |
| `abp.services.app.equipmentSales.searchEquipmentsForQuotationVehicleWise` | POST | api/services/app/equipmentSales/SearchEquipmentsForQuotationVehicleWise | [المصدر](../../../raw/application.js#L205015) |
| `abp.services.app.equipmentSales.searchEquipments` | POST | api/services/app/equipmentSales/SearchEquipments | [المصدر](../../../raw/application.js#L205022) |
| `abp.services.app.equipmentSales.searchEquipmentsForAgreement` | POST | api/services/app/equipmentSales/SearchEquipmentsForAgreement | [المصدر](../../../raw/application.js#L205038) |
| `abp.services.app.billingMethod.getBillingMethods` | POST | api/services/app/billingMethod/GetBillingMethods | [المصدر](../../../raw/application.js#L134491) |
| `abp.services.app.salesAgreement.createOrUpdateAgreement` | POST | api/services/app/salesAgreement/CreateOrUpdateAgreement | [المصدر](../../../raw/application.js#L205248) |
| `abp.services.app.chargesSetting.getConfiguredChargesTypes` | POST | api/services/app/chargesSetting/GetConfiguredChargesTypes | [المصدر](../../../raw/application.js#L387052) |
| `abp.services.app.agreementAdditionalCharges.getAdditionalAgreementCharges` | POST | api/services/app/agreementAdditionalCharges/GetAdditionalAgreementCharges | [المصدر](../../../raw/application.js#L205592) |
| `abp.services.app.salesAgreement.getSalesAgreementForEdit` | POST | api/services/app/salesAgreement/GetSalesAgreementForEdit | [المصدر](../../../raw/application.js#L346763) |
| `abp.services.app.quotationVehicleWise.getQuotationForEdit` | POST | api/services/app/quotationVehicleWise/GetQuotationForEdit | [المصدر](../../../raw/application.js#L205763) |
| `abp.services.app.salesQuotation.getQuotationForEdit` | POST | api/services/app/salesQuotation/GetQuotationForEdit | [المصدر](../../../raw/application.js#L346820) |
| `abp.services.app.billingMethod.getDefaultCreditCard` | POST | api/services/app/billingMethod/GetDefaultCreditCard | [المصدر](../../../raw/application.js#L386977) |
| `abp.services.app.commonLookup.getContactCards` | POST | api/services/app/commonLookup/GetContactCards | [المصدر](../../../raw/application.js#L386984) |
| `abp.services.app.account.searchAccountsForSubLookUp` | POST | api/services/app/account/SearchAccountsForSubLookUp | [المصدر](../../../raw/application.js#L346376) |
| `abp.services.app.job.searchJobs` | POST | api/services/app/job/SearchJobs | [المصدر](../../../raw/application.js#L387128) |
| `abp.services.app.directory.searchByContactGroup` | POST | api/services/app/directory/SearchByContactGroup | [المصدر](../../../raw/application.js#L387360) |
| `abp.services.app.currency.getCurrencies` | POST | api/services/app/currency/GetCurrencies | [المصدر](../../../raw/application.js#L134369) |
| `abp.services.app.allocation.getAllocationsForEdit` | POST | api/services/app/allocation/GetAllocationsForEdit | [المصدر](../../../raw/application.js#L387494) |
| `abp.services.app.allocation.getAllocationsForReceiptBaseOnAgreement` | POST | api/services/app/allocation/GetAllocationsForReceiptBaseOnAgreement | [المصدر](../../../raw/application.js#L387554) |
| `abp.services.app.commonLookup.getBankAccountsForSelection` | POST | api/services/app/commonLookup/GetBankAccountsForSelection | [المصدر](../../../raw/application.js#L134545) |
| `abp.services.app.commonLookup.getCurrencies` | POST | api/services/app/commonLookup/GetCurrencies | [المصدر](../../../raw/application.js#L388216) |
| `abp.services.app.commonAgreement.getAllAgreementsOnCustomer` | POST | api/services/app/commonAgreement/GetAllAgreementsOnCustomer | [المصدر](../../../raw/application.js#L388011) |
| `abp.services.app.receiptChargesAllocation.getReceiptChargesAllocationsForAgreementEdit` | POST | api/services/app/receiptChargesAllocation/GetReceiptChargesAllocationsForAgreementEdit | [المصدر](../../../raw/application.js#L387987) |
| `abp.services.app.receiptSearch.getReceiptForEdit` | POST | api/services/app/receiptSearch/GetReceiptForEdit | [المصدر](../../../raw/application.js#L388043) |
| `abp.services.app.commonAgreement.getAgreement` | POST | api/services/app/commonAgreement/GetAgreement | [المصدر](../../../raw/application.js#L388176) |
| `abp.services.app.receipt.createOrUpdateReceipt` | POST | api/services/app/receipt/CreateOrUpdateReceipt | [المصدر](../../../raw/application.js#L388363) |
| `abp.services.app.receipt.createOrUpdateReceiptWithCharge` | POST | api/services/app/receipt/CreateOrUpdateReceiptWithCharge | [المصدر](../../../raw/application.js#L388423) |
| `abp.services.app.receipt.createOrUpdateReceiptPayment` | POST | api/services/app/receipt/CreateOrUpdateReceiptPayment | [المصدر](../../../raw/application.js#L388555) |
| `abp.services.app.invoice.sendEmailForInvoicePayment` | POST | api/services/app/invoice/SendEmailForInvoicePayment | [المصدر](../../../raw/application.js#L102854) |
| `abp.services.app.booking.silentPayment` | POST | api/services/app/booking/SilentPayment | [المصدر](../../../raw/application.js#L102934) |
| `abp.services.app.invoice.silentPayment` | POST | api/services/app/invoice/SilentPayment | [المصدر](../../../raw/application.js#L102942) |
| `abp.services.app.rentalQuotation.silentPayment` | POST | api/services/app/rentalQuotation/SilentPayment | [المصدر](../../../raw/application.js#L102957) |
| `abp.services.app.costSetting.getCostSettingByModel` | POST | api/services/app/costSetting/GetCostSettingByModel | [المصدر](../../../raw/application.js#L239268) |
| `abp.services.app.costParameter.getcostingParameters` | POST | api/services/app/costParameter/GetcostingParameters | [المصدر](../../../raw/application.js#L239245) |
| `abp.services.app.leaseQuotation.getLeaseQuotationForRevision` | POST | api/services/app/leaseQuotation/GetLeaseQuotationForRevision | [المصدر](../../../raw/application.js#L239257) |
| `abp.services.app.leaseQuotation.getLeaseQuotationForEdit` | POST | api/services/app/leaseQuotation/GetLeaseQuotationForEdit | [المصدر](../../../raw/application.js#L239259) |
| `abp.services.app.leaseQuotation.reviseLeaseQuotation` | POST | api/services/app/leaseQuotation/ReviseLeaseQuotation | [المصدر](../../../raw/application.js#L239301) |
| `abp.services.app.leaseQuotation.createOrUpdateLeaseQuotation` | POST | api/services/app/leaseQuotation/CreateOrUpdateLeaseQuotation | [المصدر](../../../raw/application.js#L239303) |
| `abp.services.app.directory.getContactsByCompanyId` | POST | api/services/app/directory/GetContactsByCompanyId | [المصدر](../../../raw/application.js#L218289) |
| `abp.services.app.commonLookup.getLocationById` | POST | api/services/app/commonLookup/GetLocationById | [المصدر](../../../raw/application.js#L346276) |
| `abp.services.app.salesQuotation.getQuotationForRevision` | POST | api/services/app/salesQuotation/GetQuotationForRevision | [المصدر](../../../raw/application.js#L218446) |
| `abp.services.app.salesQuotation.reviseQuotation` | POST | api/services/app/salesQuotation/ReviseQuotation | [المصدر](../../../raw/application.js#L218596) |
| `abp.services.app.salesQuotation.createOrUpdateQuotation` | POST | api/services/app/salesQuotation/CreateOrUpdateQuotation | [المصدر](../../../raw/application.js#L218598) |
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
| `abp.services.app.commonLookup.getCurrenciesAll` | POST | api/services/app/commonLookup/GetCurrenciesAll | [المصدر](../../../raw/application.js#L134377) |
| `abp.services.app.commonLookup.searchRentalOrLeaseAgreement` | POST | api/services/app/commonLookup/SearchRentalOrLeaseAgreement | [المصدر](../../../raw/application.js#L346203) |
| `abp.services.app.receipt.getAdvanceReceipts` | POST | api/services/app/receipt/GetAdvanceReceipts | [المصدر](../../../raw/application.js#L346346) |
| `abp.services.app.receipt.getAdvanceTaxReceipt` | POST | [object Object] | [المصدر](../../../raw/application.js#L346361) |
| `abp.services.app.invoice.createOrUpdateAdvanceTaxInvoice` | POST | api/services/app/invoice/CreateOrUpdateAdvanceTaxInvoice | [المصدر](../../../raw/application.js#L346448) |
| `abp.services.app.invoice.getInvoiceForEdit` | POST | api/services/app/invoice/GetInvoiceForEdit | [المصدر](../../../raw/application.js#L346755) |
| `abp.services.app.account.getAccount` | POST | api/services/app/account/GetAccount | [المصدر](../../../raw/application.js#L346904) |
| `abp.services.app.person.uploadDocumentImage` | POST | api/services/app/person/UploadDocumentImage | [المصدر](../../../raw/application.js#L185476) |
| `abp.services.app.discountAuthCode.verifyCode` | POST | api/services/app/discountAuthCode/VerifyCode | [المصدر](../../../raw/application.js#L202257) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.SalesModule.SalesQuotation.View`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.SalesModule.SalesQuotation.AddNew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.SalesModule.SalesQuotation.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.SalesModule.SalesQuotation.Delete`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.SalesModule.SalesQuotation.Revise`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.SalesModule.SalesQuotation.Approve`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.SalesModule.SalesQuotation.CustomerApproval`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.SalesModule.SalesQuotation.GenerateDownPaymentReceipt`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.SalesModule.SalesQuotation.UnApprove`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Delete`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vehicles.ViewOtherBranchVehicles`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.Edit.CanChangeRates`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.SalesModule.SalesAgreement.BackDatedEntry`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Receipts.AllActionsOnOtherBranchReceipts`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Allocations`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Receipts.CanChangeDate`: ممنوحة في السياق الملتقط.
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
- صلاحية `Pages.Tenant.SalesModule.SalesAgreement.GenerateDownPaymentReceipt`: ممنوحة في السياق الملتقط.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.filters.quotationNo` | text |  |  |
| `vm.filters.customer` | ui-select |  |  |
| `vm.dateRangeModel` | text |  | min=vm.dateRangeOptions.min; max=vm.dateRangeOptions.max; ng-disabled=!vm.filters.enableDateRange |
| `vm.filters.enableDateRange` | checkbox | disableDateRange |  |
| `vm.filters.internalStatus` | select |  | ng-options=status.id as status.name for status in vm.statuses |
| `vm.filters.externalStatus` | select |  | ng-options=status.id as status.name for status in vm.customerApprovalStatuses |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
