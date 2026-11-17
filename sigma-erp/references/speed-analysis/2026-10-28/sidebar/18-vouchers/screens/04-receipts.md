# شاشة: Receipts

المسار في القائمة: Vouchers ← Receipts.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_receipts`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0304](../../../readable/routes/R0304--tenant-crs-receipts.js)، والأصل [raw/application.js:3705](../../../raw/application.js#L3705).
- قالب الشاشة: `~/App/tenant/views/crs/vouchers/receipts/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.vouchers.receipts.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.vouchers.receipts.index](../../../readable/controllers/C1424--tenant.views.crs.vouchers.receipts.index.js) | 36 | 17 |
| [tenant.views.crs.vouchers.receipts.printTemplates.printPreview](../../../readable/controllers/C1433--tenant.views.crs.vouchers.receipts.printTemplates.printPreview.js) | 2 | 0 |
| [tenant.views.crs.contacts.searchContactModal](../../../readable/controllers/C0706--tenant.views.crs.contacts.searchContactModal.js) | 7 | 2 |
| [tenant.views.crs.vouchers.receipts.createOrEditModal](../../../readable/controllers/C1419--tenant.views.crs.vouchers.receipts.createOrEditModal.js) | 49 | 25 |
| [tenant.views.crs.vouchers.receipts.createOrEditImportAllocationsModal](../../../readable/controllers/C1418--tenant.views.crs.vouchers.receipts.createOrEditImportAllocationsModal.js) | 45 | 20 |
| [tenant.views.crs.vouchers.receipts.noonPaymentsModal](../../../readable/controllers/C1425--tenant.views.crs.vouchers.receipts.noonPaymentsModal.js) | 17 | 6 |
| [tenant.views.crs.vouchers.receipts.createOrEditModal2](../../../readable/controllers/C1420--tenant.views.crs.vouchers.receipts.createOrEditModal2.js) | 45 | 21 |
| [tenant.views.crs.vouchers.receipts.importDdaOneModal](../../../readable/controllers/C1423--tenant.views.crs.vouchers.receipts.importDdaOneModal.js) | 6 | 4 |
| [tenant.views.crs.vouchers.receipts.importCcReceiptsModal](../../../readable/controllers/C1421--tenant.views.crs.vouchers.receipts.importCcReceiptsModal.js) | 5 | 3 |
| [tenant.views.crs.vouchers.receipts.viewModal](../../../readable/controllers/C1431--tenant.views.crs.vouchers.receipts.viewModal.js) | 26 | 15 |
| [tenant.views.crs.vouchers.allocations.createAllocation](../../../readable/controllers/C1220--tenant.views.crs.vouchers.allocations.createAllocation.js) | 11 | 3 |
| [tenant.views.crs.vouchers.allocations.createAllocation2](../../../readable/controllers/C1221--tenant.views.crs.vouchers.allocations.createAllocation2.js) | 12 | 6 |
| [tenant.views.crs.vouchers.receipts.receiptChargesAllocation](../../../readable/controllers/C1427--tenant.views.crs.vouchers.receipts.receiptChargesAllocation.js) | 6 | 2 |
| [tenant.views.crs.vouchers.receipts.agreementReceiptChargesAllocation](../../../readable/controllers/C1416--tenant.views.crs.vouchers.receipts.agreementReceiptChargesAllocation.js) | 5 | 2 |
| [common.views.common.reportViewer](../../../readable/controllers/C0006--common.views.common.reportViewer.js) | 2 | 0 |
| [tenant.views.crs.accounting.journal.viewModal](../../../readable/controllers/C0499--tenant.views.crs.accounting.journal.viewModal.js) | 7 | 2 |
| [tenant.views.crs.contacts.createOrEditModal](../../../readable/controllers/C0703--tenant.views.crs.contacts.createOrEditModal.js) | 45 | 24 |
| [tenant.views.crs.vouchers.receipts.uploadDocumentsModal](../../../readable/controllers/C1430--tenant.views.crs.vouchers.receipts.uploadDocumentsModal.js) | 3 | 0 |
| [tenant.views.crs.vouchers.invoices.generateAdvanceTaxModal](../../../readable/controllers/C1318--tenant.views.crs.vouchers.invoices.generateAdvanceTaxModal.js) | 31 | 12 |
| [tenant.views.crs.contacts.uploadDocumentModal](../../../readable/controllers/C0699--tenant.views.crs.contacts.uploadDocumentModal.js) | 2 | 1 |
| [tenant.views.crs.contacts.uploadDocumentModal](../../../readable/controllers/C0711--tenant.views.crs.contacts.uploadDocumentModal.js) | 2 | 1 |
| [tenant.views.common.documents.uploadDocumentModal](../../../readable/controllers/C0362--tenant.views.common.documents.uploadDocumentModal.js) | 4 | 0 |
| [tenant.views.common.documents.uploadImageModal](../../../readable/controllers/C0363--tenant.views.common.documents.uploadImageModal.js) | 3 | 0 |
| [tenant.views.common.documents.addCreditCardModal](../../../readable/controllers/C0701--tenant.views.common.documents.addCreditCardModal.js) | 4 | 0 |
| [tenant.views.crs.vouchers.invoices.uploadDocumentsModal](../../../readable/controllers/C1355--tenant.views.crs.vouchers.invoices.uploadDocumentsModal.js) | 3 | 0 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.vouchers.receipts.index`: `locationPermission`، `locationPermission`، `CurrencyFormate`، `roundingforView`، `changePrintingWithoutLogo`، `allBranchPermission`، `dateRangeCheck`، `getlocalDateTime`، `dateRangeModelChanged`، `whatsAppSMS`، `whatsAppSMSPaymentIsMoreThanXAmount`، `emailPaymentIsMoreThanXAmount`، `exportToExcel`، `approveAllMethod`، `searchCustomers`، `openprintModal`، `getReportUrl`، `searchCustomerPopoup`، `noonPaymentsModal`، `reportWithAllocatedInvoices`، `report`، `createReceipt`، `importDda`، `importCcReceipts`، `editReceipt`، `createAllocation`، `createReceiptChargesAllocation`، `getReceipts`، `deleteReceipt`، `voidReceipt`، `viewReceipt`، `enterKeyPress`، `clearCustomer`، `openJournalViewModal`، `approveReceipts`، `unapproveReceipt`.
- وحدة `tenant.views.crs.vouchers.receipts.printTemplates.printPreview`: `cancel`، `getTemplateUrl`.
- وحدة `tenant.views.crs.contacts.searchContactModal`: `searchContacts`، `cancel`، `showAddContact`، `contactSelected`، `contactEdit`، `getContactsList`، `getNameWithCode`.
- وحدة `tenant.views.crs.vouchers.receipts.createOrEditModal`: `localize`، `isEnabled`، `uploadDocument`، `getOriginalName`، `billingMethodSelected`، `receiptTypeChanged`، `dateNullOrNot`، `searchAccounts`، `addRow`، `removeRow`، `searchJobs`، `getReceiptTypeName`، `contactCardSelected`، `localize`، `rounding`، `amountChanged`، `amountWithoutCommissionChanged`، `sumAmountAllocationCharges`، `insertDueAmountOnClick`، `sumAmountAllocationChargesAgreement`، `sumTotalWithAllocation`، `calculateGeneralReceiptAmount`، `getlocalDateTime`، `getlocalDate`، `cancel`، `searchCustomers`، `searchContactGeneralPayment`، `onBillingMethodChange`، `calculateCreditCardCommission`، `calculateBankTransferCommission`، `searchVehicles`، `rounding`، `onCustomerSelect`، `onCustomerSelectForAgreement`، `conversionRateChanged`، `customerCurrencyChanged`، `customerCurrencyChangedForEdit`، `sumReceiptAmount`، `autoAllocation`، `sumAmount`، `searchCustomerPopoup`، `accountChangedGeneralPayment`، `moduleChanged`، `onAgreementSelect`، `openAdvanceTaxInvoiceModal`، `save`، `removeDocument`، `saveGeneralReceipt`، `checkCurrentDate`.
- وحدة `tenant.views.crs.vouchers.receipts.createOrEditImportAllocationsModal`: `refresh`، `export`، `isEnabled`، `onBillingMethodChange`، `billingMethodSelected`، `calculateBankTransferCommission`، `receiptTypeChanged`، `dateNullOrNot`، `searchAccounts`، `addRow`، `removeRow`، `searchJobs`، `getReceiptTypeName`، `contactCardSelected`، `localize`، `rounding`، `amountChanged`، `amountWithoutCommissionChanged`، `sumAmountAllocationCharges`، `insertDueAmountOnClick`، `sumAmountAllocationChargesAgreement`، `sumTotalWithAllocation`، `calculateGeneralReceiptAmount`، `getlocalDateTime`، `getlocalDate`، `cancel`، `searchCustomers`، `searchContactGeneralPayment`، `calculateCreditCardCommission`، `searchVehicles`، `autoAllocation`، `rounding`، `onCustomerSelect`، `conversionRateChanged`، `customerCurrencyChanged`، `customerCurrencyChangedForEdit`، `sumReceiptAmount`، `sumAmount`، `searchCustomerPopoup`، `accountChangedGeneralPayment`، `moduleChanged`، `openAdvanceTaxInvoiceModal`، `save`، `saveGeneralReceipt`، `checkCurrentDate`.
- وحدة `tenant.views.crs.vouchers.receipts.noonPaymentsModal`: `roundingforView`، `getInvoiceTypeById`، `checkSelectedInvoices`، `getlocalDateTime`، `searchCustomers`، `searchCustomerPopoup`، `clearCustomer`، `getlocalDate`، `allBoxTicked`، `getInvoicingRule`، `getInvoicingType`، `cancel`، `getBufferAmountFromSetting`، `searchUsers`، `resendEmail`، `getInvoicesForPayment`، `processPayments`.
- وحدة `tenant.views.crs.vouchers.receipts.createOrEditModal2`: `getOriginalName`، `uploadDocument`، `billingMethodSelected`، `onBillingMethodChange`، `receiptTypeChanged`، `searchAccounts`، `addRow`، `removeRow`، `searchJobs`، `getReceiptTypeName`، `amountWithoutCommissionChanged`، `contactCardSelected`، `localize`، `rounding`، `agreementAmountChanged`، `amountChanged`، `sumAmountAllocationCharges`، `sumAmountAllocationChargesAgreement`، `calculateCreditCardCommission`، `isAgreementAllocationAmount`، `sumTotalWithAllocation`، `calculateGeneralReceiptAmount`، `getlocalDateTime`، `getlocalDate`، `cancel`، `searchCustomers`، `searchContactGeneralPayment`، `searchVehicles`، `addAgreement`، `searchRentalOrLeaseAgreement`، `autoAllocation`، `addInHeadRow`، `moduleChanged`، `addChargesType`، `onCustomerSelect`، `sumReceiptAmount`، `sumAmount`، `searchCustomerPopoup`، `accountChangedGeneralPayment`، `dateNullOrNot`، `removeDocument`، `openAdvanceTaxInvoiceModal`، `save`، `saveGeneralReceipt`، `checkCurrentDate`.
- وحدة `tenant.views.crs.vouchers.receipts.importDdaOneModal`: `refresh`، `cancel`، `getlocalDate`، `checkForBankAccount`، `onDateChange`، `importData`.
- وحدة `tenant.views.crs.vouchers.receipts.importCcReceiptsModal`: `refresh`، `cancel`، `getlocalDate`، `checkForBankAccount`، `importData`.
- وحدة `tenant.views.crs.vouchers.receipts.viewModal`: `billingMethodSelected`، `uploadDocument`، `receiptTypeChanged`، `searchAccounts`، `roundingforView`، `getReceiptTypeName`، `contactCardSelected`، `localize`، `rounding`، `amountChanged`، `sumAmountAllocationCharges`، `sumTotalWithAllocation`، `calculateGeneralReceiptAmount`، `getlocalDateTime`، `getlocalDate`، `cancel`، `searchCustomers`، `searchContactGeneralPayment`، `searchVehicles`، `onCustomerSelect`، `sumReceiptAmount`، `sumAmount`، `accountChangedGeneralPayment`، `openprintModal`، `getOriginalName`، `checkCurrentDate`.
- وحدة `tenant.views.crs.vouchers.allocations.createAllocation`: `refresh`، `exportToExcel`، `importResult`، `cancel`، `localize`، `rounding`، `sumAmount`، `getlocalDateTime`، `insertDueAmountOnClick`، `save`، `exportToExcelAllocations`.
- وحدة `tenant.views.crs.vouchers.allocations.createAllocation2`: `cancel`، `localize`، `rounding`، `sumAmount`، `getlocalDateTime`، `insertDueAmountOnClick`، `addAgreement`، `searchRentalOrLeaseAgreement`، `addInHeadRow`، `addChargesType`، `isAgreementAllocationAmount`، `save`.
- وحدة `tenant.views.crs.vouchers.receipts.receiptChargesAllocation`: `cancel`، `rounding`، `localize`، `sumAmount`، `getlocalDateTime`، `save`.
- وحدة `tenant.views.crs.vouchers.receipts.agreementReceiptChargesAllocation`: `cancel`، `localize`، `sumAmount`، `getlocalDateTime`، `save`.
- وحدة `common.views.common.reportViewer`: `exportToExcelFromReport`، `cancel`.
- وحدة `tenant.views.crs.accounting.journal.viewModal`: `getlocalDateTime`، `rounding`، `formatNumber`، `roundingforView`، `currencyAndRoundingWithThree`، `getVoucherType`، `cancel`.
- وحدة `tenant.views.crs.contacts.createOrEditModal`: `localize`، `removeExternalIdRow`، `addExternalIdRow`، `getContactExternalType`، `isContactExternalType`، `getlocalDate`، `getlocalDateTime`، `getCardType`، `removeRow`، `searchSalesPersons`، `searchUsersWithDesignation`، `searchSalesPersonPopoup`، `salesPersonSelected`، `searchDebtCollectorPopoup`، `searchCustomLookup`، `getCustomLookups`، `scanDocument`، `openUploadDocument`، `openUploadPicture`، `addCreditCardRow`، `updateCreditCardRow`، `save`، `cancel`، `isPersonVerifiedChange`، `doesIdentityDoucmentExist`، `addIndentityDocument`، `getIdentificationDocumentType`، `removeIndentityDocument`، `removeDoc`، `isFieldMondatory`، `searchCountries`، `emiratesDataReader`، `emiratesDataFieldManager`، `getTariffCards`، `getTariffCardForContact`، `isDocument`، `maskCreditCard`، `getAdvanceSettings`، `getHighLightBlackListCountries`، `getNationalIdFormates`، `nationalIdFormate`، `onOverRideChange`، `resetDocumentNo`، `nationIdMaskInput`، `handleResidenceStatusChange`.
- وحدة `tenant.views.crs.vouchers.receipts.uploadDocumentsModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.crs.vouchers.invoices.generateAdvanceTaxModal`: `rounding`، `chargesTypeVoucherLine`، `getColspan`، `chargesTypeVoucherLineRepeat`، `searchRentalOrLeaseAgreement`، `localize`، `cancel`، `depositSelected`، `amountChanged`، `getlocalDateTime`، `branchTaxCode`، `onCustomerSelect`، `searchCustomers`، `searchAdvanceReceipts`، `searchAccounts`، `searchCustomerPopoup`، `uploadDocument`، `getOriginalName`، `save`، `calculateCreditAndTax`، `sumAmount`، `rounding`، `rounding`، `setTaxPercentOnTaxCode`، `calculateTaxPerRow`، `rounding`، `sumAmountTax`، `rounding`، `addRow`، `removeDocument`، `getVehicleMakeName`.
- وحدة `tenant.views.crs.contacts.uploadDocumentModal`: `save`، `cancel`.
- وحدة `tenant.views.crs.contacts.uploadDocumentModal`: `save`، `cancel`.
- وحدة `tenant.views.common.documents.uploadDocumentModal`: `uploadHeader`، `uploader.onBeforeUploadItem`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.common.documents.uploadImageModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.common.documents.addCreditCardModal`: `ab`، `cardNumberChanged`، `save`، `cancel`.
- وحدة `tenant.views.crs.vouchers.invoices.uploadDocumentsModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.receipt.sendReceiptWhatsAppSMSManual` | POST | api/services/app/receipt/SendReceiptWhatsAppSMSManual | [المصدر](../../../raw/application.js#L391303) |
| `abp.services.app.receipt.sendReceiptWhatsAppSMSManualAmountGreateThanXAmount` | POST | api/services/app/receipt/SendReceiptWhatsAppSMSManualAmountGreateThanXAmount | [المصدر](../../../raw/application.js#L391318) |
| `abp.services.app.receipt.sendReceiptEmailManualAmountGreateThanXAmount` | POST | api/services/app/receipt/SendReceiptEmailManualAmountGreateThanXAmount | [المصدر](../../../raw/application.js#L391333) |
| `abp.services.app.receipt.exportToExcel` | POST | api/services/app/receipt/ExportToExcel | [المصدر](../../../raw/application.js#L391353) |
| `abp.services.app.receipt.approvereceipt` | غير مربوط | غير محسوم | [المصدر](../../../raw/application.js#L391367) |
| `abp.services.app.directory.search` | POST | api/services/app/directory/Search | [المصدر](../../../raw/application.js#L346355) |
| `abp.services.app.commonLookup.validateCheque` | POST | [object Object] | [المصدر](../../../raw/application.js#L393936) |
| `abp.services.app.billingMethod.getBillingMethods` | POST | api/services/app/billingMethod/GetBillingMethods | [المصدر](../../../raw/application.js#L393749) |
| `abp.services.app.commonLookup.getLocationsActiveAndInActive` | POST | api/services/app/commonLookup/GetLocationsActiveAndInActive | [المصدر](../../../raw/application.js#L393756) |
| `abp.services.app.receiptSearch.getReceipts` | POST | api/services/app/receiptSearch/GetReceipts | [المصدر](../../../raw/application.js#L391807) |
| `abp.services.app.receipt.deleteReceipt` | POST | api/services/app/receipt/DeleteReceipt | [المصدر](../../../raw/application.js#L391828) |
| `abp.services.app.receipt.voidReceipt` | POST | api/services/app/receipt/VoidReceipt | [المصدر](../../../raw/application.js#L391846) |
| `abp.services.app.receipt.approveReceipt` | POST | api/services/app/receipt/ApproveReceipt | [المصدر](../../../raw/application.js#L391925) |
| `abp.services.app.receipt.unApproveReceipt` | POST | api/services/app/receipt/UnApproveReceipt | [المصدر](../../../raw/application.js#L391941) |
| `abp.services.app.directory.searchDirectoryPaged` | POST | api/services/app/directory/SearchDirectoryPaged | [المصدر](../../../raw/application.js#L184666) |
| `abp.services.app.billingMethod.getDefaultCreditCard` | POST | api/services/app/billingMethod/GetDefaultCreditCard | [المصدر](../../../raw/application.js#L388750) |
| `abp.services.app.commonLookup.getContactCards` | POST | api/services/app/commonLookup/GetContactCards | [المصدر](../../../raw/application.js#L393485) |
| `abp.services.app.account.searchAccountsForSubLookUp` | POST | api/services/app/account/SearchAccountsForSubLookUp | [المصدر](../../../raw/application.js#L346376) |
| `abp.services.app.chargesSetting.getConfiguredChargesTypes` | POST | api/services/app/chargesSetting/GetConfiguredChargesTypes | [المصدر](../../../raw/application.js#L387052) |
| `abp.services.app.job.searchJobs` | POST | api/services/app/job/SearchJobs | [المصدر](../../../raw/application.js#L388928) |
| `abp.services.app.directory.searchByContactGroup` | POST | api/services/app/directory/SearchByContactGroup | [المصدر](../../../raw/application.js#L393741) |
| `abp.services.app.commonLookup.getLocations` | POST | api/services/app/commonLookup/GetLocations | [المصدر](../../../raw/application.js#L182597) |
| `abp.services.app.currency.getCurrencies` | POST | api/services/app/currency/GetCurrencies | [المصدر](../../../raw/application.js#L183468) |
| `abp.services.app.vehicle.searchVehicles` | POST | api/services/app/vehicle/SearchVehicles | [المصدر](../../../raw/application.js#L393766) |
| `abp.services.app.allocation.getAllocationsForEdit` | POST | api/services/app/allocation/GetAllocationsForEdit | [المصدر](../../../raw/application.js#L319997) |
| `abp.services.app.allocation.getAllocationsForReceiptBaseOnAgreement` | POST | api/services/app/allocation/GetAllocationsForReceiptBaseOnAgreement | [المصدر](../../../raw/application.js#L387554) |
| `abp.services.app.commonLookup.getBankAccountsForSelection` | POST | api/services/app/commonLookup/GetBankAccountsForSelection | [المصدر](../../../raw/application.js#L393810) |
| `abp.services.app.commonLookup.getCurrencies` | POST | api/services/app/commonLookup/GetCurrencies | [المصدر](../../../raw/application.js#L386042) |
| `abp.services.app.commonAgreement.getAllAgreementsOnCustomer` | POST | api/services/app/commonAgreement/GetAllAgreementsOnCustomer | [المصدر](../../../raw/application.js#L389491) |
| `abp.services.app.receiptChargesAllocation.getReceiptChargesAllocationsForAgreementEdit` | POST | api/services/app/receiptChargesAllocation/GetReceiptChargesAllocationsForAgreementEdit | [المصدر](../../../raw/application.js#L385052) |
| `abp.services.app.receiptSearch.getReceiptForEdit` | POST | api/services/app/receiptSearch/GetReceiptForEdit | [المصدر](../../../raw/application.js#L393994) |
| `abp.services.app.commonAgreement.getAgreement` | POST | api/services/app/commonAgreement/GetAgreement | [المصدر](../../../raw/application.js#L394082) |
| `abp.services.app.receipt.createOrUpdateReceipt` | POST | api/services/app/receipt/CreateOrUpdateReceipt | [المصدر](../../../raw/application.js#L389922) |
| `abp.services.app.receipt.createOrUpdateReceiptWithCharge` | POST | api/services/app/receipt/CreateOrUpdateReceiptWithCharge | [المصدر](../../../raw/application.js#L386687) |
| `abp.services.app.receipt.createOrUpdateReceiptPayment` | POST | api/services/app/receipt/CreateOrUpdateReceiptPayment | [المصدر](../../../raw/application.js#L390010) |
| `abp.services.app.noonPayment.getNoonPaymentBufferAmount` | POST | api/services/app/noonPayment/GetNoonPaymentBufferAmount | [المصدر](../../../raw/application.js#L392174) |
| `abp.services.app.noonPayment.processPayments` | POST | api/services/app/noonPayment/ProcessPayments | [المصدر](../../../raw/application.js#L392288) |
| `abp.services.app.noonPayment.getInvoicesForPayment` | POST | api/services/app/noonPayment/GetInvoicesForPayment | [المصدر](../../../raw/application.js#L392231) |
| `abp.services.app.chargesSetting.getConfiguredChargesTypesDistinct` | POST | api/services/app/chargesSetting/GetConfiguredChargesTypesDistinct | [المصدر](../../../raw/application.js#L319874) |
| `abp.services.app.commonLookup.searchRentalOrLeaseAgreement` | POST | api/services/app/commonLookup/SearchRentalOrLeaseAgreement | [المصدر](../../../raw/application.js#L346203) |
| `abp.services.app.allocation.getAgreementsAllocations` | POST | api/services/app/allocation/GetAgreementsAllocations | [المصدر](../../../raw/application.js#L319863) |
| `abp.services.app.allocation.getAllocationsForEdit2` | POST | api/services/app/allocation/GetAllocationsForEdit2 | [المصدر](../../../raw/application.js#L319970) |
| `abp.services.app.receipt.importDdaReceiptsData` | POST | api/services/app/receipt/ImportDdaReceiptsData | [المصدر](../../../raw/application.js#L390877) |
| `abp.services.app.tenantSettings.getDirectDebitAuthorizationImportSetting` | POST | api/services/app/tenantSettings/GetDirectDebitAuthorizationImportSetting | [المصدر](../../../raw/application.js#L390915) |
| `abp.services.app.receipt.importCcReceiptsData` | POST | api/services/app/receipt/ImportCcReceiptsData | [المصدر](../../../raw/application.js#L390281) |
| `abp.services.app.commonLookup.getCurrenciesAll` | POST | api/services/app/commonLookup/GetCurrenciesAll | [المصدر](../../../raw/application.js#L394037) |
| `abp.services.app.allocation.saveAllocations` | POST | api/services/app/allocation/SaveAllocations | [المصدر](../../../raw/application.js#L319957) |
| `abp.services.app.allocation.exportToExcelReceipt` | POST | [object Object] | [المصدر](../../../raw/application.js#L319741) |
| `abp.services.app.receiptChargesAllocation.createOrUpdateReceiptChargesAllocations` | POST | api/services/app/receiptChargesAllocation/CreateOrUpdateReceiptChargesAllocations | [المصدر](../../../raw/application.js#L393026) |
| `abp.services.app.receiptChargesAllocation.getReceiptChargesAllocationsForEdit` | POST | api/services/app/receiptChargesAllocation/GetReceiptChargesAllocationsForEdit | [المصدر](../../../raw/application.js#L393036) |
| `abp.services.app.receiptChargesAllocation.createOrUpdateReceiptChargesAllocationsOnAgreement` | POST | api/services/app/receiptChargesAllocation/CreateOrUpdateReceiptChargesAllocationsOnAgreement | [المصدر](../../../raw/application.js#L385041) |
| `abp.services.app.journal.getJournalViewForMulticurrency` | POST | api/services/app/journal/GetJournalViewForMulticurrency | [المصدر](../../../raw/application.js#L126727) |
| `abp.services.app.journal.getJournalView` | POST | api/services/app/journal/GetJournalView | [المصدر](../../../raw/application.js#L126740) |
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

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.Accounts.Journal`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Receipts.ImportAllocations`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Receipts.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Receipts.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Receipts.Delete`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Receipts.ExportToExcel`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Receipts.Void`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Receipts.View`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Receipts.Print`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Allocations`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Receipts.AllActionsOnOtherBranchReceipts`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Receipts.ViewOtherBranchReceipts`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Receipts.AllowReAllocationOfAllocated`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Receipts.ReceiptAllocationWithInvoicesReport`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Receipts.CanApproveOtherBranchReceipts`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Receipts.Approve`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Receipts.UnApprove`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Receipts.NoonPayments`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Delete`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Receipts.CanChangeDate`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Invoices.Addnew.CanBulkGenerateForAnyAsOfDate`: ممنوحة في السياق الملتقط.
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
- صلاحية `Pages.Tenant.SalesModule.SalesQuotation.GenerateDownPaymentReceipt`: ممنوحة في السياق الملتقط.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.filters.voucherNo` | text |  |  |
| `vm.filters.agreementNo` | text |  |  |
| `vm.filters.voucherSubTypeId` | select |  | ng-options=receipt.voucherSubTypeId as receipt.name for receipt in vm.receiptTypes |
| `vm.filters.locationId` | select | locationId |  |
| `vm.dateRangeModel` | text |  | min=vm.dateRangeOptions.min; max=vm.dateRangeOptions.max; ng-disabled=!vm.filters.enableDateRange |
| `vm.filters.enableDateRange` | checkbox | disableDateRange |  |
| `vm.filters.billingMethodId` | select |  | ng-options=billingMethod.id as billingMethod.name for billingMethod in vm.billingMethods |
| `vm.filters.customer` | ui-select |  |  |
| `vm.filters.unAllocatedReceipts` | text | unAllocatedReceipts | ng-options=allocatedType.id as allocatedType.name for allocatedType in vm.allocatedTypes |
| `vm.filters.approvedType` | text | receiptType | ng-options=approvedType.id as approvedType.name for approvedType in vm.approvedTypes |
| `vm.filters.module` | text | module | ng-options=module.id as module.name for module in vm.modules |
| `vm.filters.voidedOnly` | checkbox | voidedOnly |  |
| `vm.filters.printingWithoutLogo` | checkbox | printingWithoutLogo |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
