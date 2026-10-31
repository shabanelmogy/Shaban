# شاشة: Traffic Fines

المسار في القائمة: Vouchers ← Traffic Fines.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_trafficFines`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0289](../../../readable/routes/R0289--tenant-crs-trafficfines.js)، والأصل [raw/application.js:3601](../../../raw/application.js#L3601).
- قالب الشاشة: `~/App/tenant/views/crs/fines/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.fines.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.fines.index](../../../readable/controllers/C0826--tenant.views.crs.fines.index.js) | 23 | 8 |
| [tenant.views.crs.fines.importTrafficFines](../../../readable/controllers/C0825--tenant.views.crs.fines.importTrafficFines.js) | 5 | 1 |
| [tenant.views.crs.vouchers.receipts.createOrEditModal](../../../readable/controllers/C1419--tenant.views.crs.vouchers.receipts.createOrEditModal.js) | 49 | 25 |
| [tenant.views.crs.fines.createInvoiceFromFines](../../../readable/controllers/C0822--tenant.views.crs.fines.createInvoiceFromFines.js) | 10 | 4 |
| [tenant.views.crs.reports.finesReport.printtemplates.printPreview](../../../readable/controllers/C1013--tenant.views.crs.reports.finesReport.printtemplates.printPreview.js) | 2 | 0 |
| [tenant.views.crs.fines.createOrEditModal](../../../readable/controllers/C0823--tenant.views.crs.fines.createOrEditModal.js) | 11 | 7 |
| [tenant.views.crs.receipts.vouchers.chargeTrafficFineModal](../../../readable/controllers/C1417--tenant.views.crs.receipts.vouchers.chargeTrafficFineModal.js) | 5 | 6 |
| [tenant.views.crs.vouchers.receipts.uploadDocumentsModal](../../../readable/controllers/C1430--tenant.views.crs.vouchers.receipts.uploadDocumentsModal.js) | 3 | 0 |
| [tenant.views.crs.contacts.searchContactModal](../../../readable/controllers/C0706--tenant.views.crs.contacts.searchContactModal.js) | 7 | 2 |
| [tenant.views.crs.vouchers.invoices.generateAdvanceTaxModal](../../../readable/controllers/C1318--tenant.views.crs.vouchers.invoices.generateAdvanceTaxModal.js) | 31 | 12 |
| [tenant.views.crs.vouchers.receipts.printTemplates.printPreview](../../../readable/controllers/C1433--tenant.views.crs.vouchers.receipts.printTemplates.printPreview.js) | 2 | 0 |
| [tenant.views.crs.contacts.createOrEditModal](../../../readable/controllers/C0703--tenant.views.crs.contacts.createOrEditModal.js) | 45 | 24 |
| [tenant.views.crs.companies.createOrEditModal](../../../readable/controllers/C0695--tenant.views.crs.companies.createOrEditModal.js) | 50 | 26 |
| [tenant.views.crs.staff.createOrEditModal](../../../readable/controllers/C1112--tenant.views.crs.staff.createOrEditModal.js) | 28 | 17 |
| [tenant.views.crs.vouchers.invoices.uploadDocumentsModal](../../../readable/controllers/C1355--tenant.views.crs.vouchers.invoices.uploadDocumentsModal.js) | 3 | 0 |
| [tenant.views.crs.contacts.uploadDocumentModal](../../../readable/controllers/C0699--tenant.views.crs.contacts.uploadDocumentModal.js) | 2 | 1 |
| [tenant.views.crs.contacts.uploadDocumentModal](../../../readable/controllers/C0711--tenant.views.crs.contacts.uploadDocumentModal.js) | 2 | 1 |
| [tenant.views.common.documents.uploadDocumentModal](../../../readable/controllers/C0362--tenant.views.common.documents.uploadDocumentModal.js) | 4 | 0 |
| [tenant.views.common.documents.uploadImageModal](../../../readable/controllers/C0363--tenant.views.common.documents.uploadImageModal.js) | 3 | 0 |
| [tenant.views.common.documents.addCreditCardModal](../../../readable/controllers/C0701--tenant.views.common.documents.addCreditCardModal.js) | 4 | 0 |
| [tenant.views.crs.companies.createOrUpdateDriverModal](../../../readable/controllers/C0696--tenant.views.crs.companies.createOrUpdateDriverModal.js) | 28 | 13 |
| [tenant.views.crs.staff.printDocumenetModel](../../../readable/controllers/C1114--tenant.views.crs.staff.printDocumenetModel.js) | 3 | 1 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.fines.index`: `go`، `sendCaptcha`، `initFineDownloader`، `CurrencyFormate`، `roundingforView`، `openTrafficFinesModal`، `importTrafficFines`، `dateRangeCheck`، `getTrafficFines`، `searchVehicles`، `clearVehicle`، `localize`، `getTrafficFines`، `createInvoiceFromFines`، `createReceiptFromInvoice`، `getlocalDateTime`، `openPrintModal`، `exportToExcel`، `viewTrafficFine`، `createTrafficFine`، `editTrafficFine`، `chargeTrafficFine`، `deleteTrafficFine`.
- وحدة `tenant.views.crs.fines.importTrafficFines`: `cancel`، `refresh`، `getlocalDate`، `importData`، `resolveBoolValue`.
- وحدة `tenant.views.crs.vouchers.receipts.createOrEditModal`: `localize`، `isEnabled`، `uploadDocument`، `getOriginalName`، `billingMethodSelected`، `receiptTypeChanged`، `dateNullOrNot`، `searchAccounts`، `addRow`، `removeRow`، `searchJobs`، `getReceiptTypeName`، `contactCardSelected`، `localize`، `rounding`، `amountChanged`، `amountWithoutCommissionChanged`، `sumAmountAllocationCharges`، `insertDueAmountOnClick`، `sumAmountAllocationChargesAgreement`، `sumTotalWithAllocation`، `calculateGeneralReceiptAmount`، `getlocalDateTime`، `getlocalDate`، `cancel`، `searchCustomers`، `searchContactGeneralPayment`، `onBillingMethodChange`، `calculateCreditCardCommission`، `calculateBankTransferCommission`، `searchVehicles`، `rounding`، `onCustomerSelect`، `onCustomerSelectForAgreement`، `conversionRateChanged`، `customerCurrencyChanged`، `customerCurrencyChangedForEdit`، `sumReceiptAmount`، `autoAllocation`، `sumAmount`، `searchCustomerPopoup`، `accountChangedGeneralPayment`، `moduleChanged`، `onAgreementSelect`، `openAdvanceTaxInvoiceModal`، `save`، `removeDocument`، `saveGeneralReceipt`، `checkCurrentDate`.
- وحدة `tenant.views.crs.fines.createInvoiceFromFines`: `amountChanged`، `save`، `getlocalDateTime`، `getlocalDate`، `searchVehicles`، `rounding`، `agreementCategory`، `calculateTaxPerRow`، `sumAmountTax`، `cancel`.
- وحدة `tenant.views.crs.reports.finesReport.printtemplates.printPreview`: `cancel`، `getTemplateUrl`.
- وحدة `tenant.views.crs.fines.createOrEditModal`: `clearCustomer`، `searchCustomers`، `searchCustomerPopoup`، `uploader.onSuccessItem`، `searchVehicles`، `roundingforView`، `localize`، `viewContact`، `vehicleChanged`، `save`، `cancel`.
- وحدة `tenant.views.crs.receipts.vouchers.chargeTrafficFineModal`: `amountChanged`، `save`، `getlocalDateTime`، `getlocalDate`، `cancel`.
- وحدة `tenant.views.crs.vouchers.receipts.uploadDocumentsModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.crs.contacts.searchContactModal`: `searchContacts`، `cancel`، `showAddContact`، `contactSelected`، `contactEdit`، `getContactsList`، `getNameWithCode`.
- وحدة `tenant.views.crs.vouchers.invoices.generateAdvanceTaxModal`: `rounding`، `chargesTypeVoucherLine`، `getColspan`، `chargesTypeVoucherLineRepeat`، `searchRentalOrLeaseAgreement`، `localize`، `cancel`، `depositSelected`، `amountChanged`، `getlocalDateTime`، `branchTaxCode`، `onCustomerSelect`، `searchCustomers`، `searchAdvanceReceipts`، `searchAccounts`، `searchCustomerPopoup`، `uploadDocument`، `getOriginalName`، `save`، `calculateCreditAndTax`، `sumAmount`، `rounding`، `rounding`، `setTaxPercentOnTaxCode`، `calculateTaxPerRow`، `rounding`، `sumAmountTax`، `rounding`، `addRow`، `removeDocument`، `getVehicleMakeName`.
- وحدة `tenant.views.crs.vouchers.receipts.printTemplates.printPreview`: `cancel`، `getTemplateUrl`.
- وحدة `tenant.views.crs.contacts.createOrEditModal`: `localize`، `removeExternalIdRow`، `addExternalIdRow`، `getContactExternalType`، `isContactExternalType`، `getlocalDate`، `getlocalDateTime`، `getCardType`، `removeRow`، `searchSalesPersons`، `searchUsersWithDesignation`، `searchSalesPersonPopoup`، `salesPersonSelected`، `searchDebtCollectorPopoup`، `searchCustomLookup`، `getCustomLookups`، `scanDocument`، `openUploadDocument`، `openUploadPicture`، `addCreditCardRow`، `updateCreditCardRow`، `save`، `cancel`، `isPersonVerifiedChange`، `doesIdentityDoucmentExist`، `addIndentityDocument`، `getIdentificationDocumentType`، `removeIndentityDocument`، `removeDoc`، `isFieldMondatory`، `searchCountries`، `emiratesDataReader`، `emiratesDataFieldManager`، `getTariffCards`، `getTariffCardForContact`، `isDocument`، `maskCreditCard`، `getAdvanceSettings`، `getHighLightBlackListCountries`، `getNationalIdFormates`، `nationalIdFormate`، `onOverRideChange`، `resetDocumentNo`، `nationIdMaskInput`، `handleResidenceStatusChange`.
- وحدة `tenant.views.crs.companies.createOrEditModal`: `getCardType`، `getlocalDate`، `localize`، `getlocalDateTime`، `removeExternalIdRow`، `addExternalIdRow`، `getContactExternalType`، `isContactExternalType`، `addCreditCardRow`، `addDriverRow`، `updateCreditCardRow`، `removeRow`، `searchContacts`، `showAddContact`، `removeRowContact`، `save`، `cancel`، `addContactPersonsRow`، `changeDesignation`، `removeContactPersonsRow`، `searchSalesPersons`، `searchUsersWithDesignation`، `searchSalesPersonPopoup`، `salesPersonSelected`، `searchDebtCollectorPopoup`، `doesIdentityDoucmentExist`، `openUploadDocument`، `addIndentityDocument`، `addMandatoryDesignations`، `isCompanyVerifiedChange`، `removeIndentityDocument`، `maskCreditCard`، `removeDoc`، `getIdentificationDocumentType`، `searchCountries`، `getTariffCards`، `getTariffCardForCompany`، `isDocument`، `getDesignations`، `isFieldMondatoryForSalesPerson`، `isFieldMondatory`، `isAdditionalFieldsEnabled`، `typeOfFeild`، `onOverRideChange`، `getAdvanceSettings`، `getIndustries`، `getCompanyCustomField1`، `getCompanyCustomField2`، `getHighLightBlackListCountries`، `getCompanyCustomField3`.
- وحدة `tenant.views.crs.staff.createOrEditModal`: `getPaymentModeName`، `salaryTypeInString`، `addContactBankAccountRow`، `removeContactBankAccountRow`، `clearStaff`، `salaryType`، `searchStaff`، `searchStaffPopoup`، `openPrintModal`، `cancel`، `doesIdentityDoucmentExist`، `getAllDivisions`، `addIndentityDocument`، `openUploadDocument`، `getAllBusinessUnits`، `getAllSponsorships`، `addRow`، `removeRow`، `removeIndentityDocument`، `getIdentificationDocumentType`، `save`، `payCalculate`، `searchCountries`، `emiratesDataReader`، `getDocsByContactId`، `emiratesDataFieldManager`، `isDocument`، `salaryCalculation`.
- وحدة `tenant.views.crs.vouchers.invoices.uploadDocumentsModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.crs.contacts.uploadDocumentModal`: `save`، `cancel`.
- وحدة `tenant.views.crs.contacts.uploadDocumentModal`: `save`، `cancel`.
- وحدة `tenant.views.common.documents.uploadDocumentModal`: `uploadHeader`، `uploader.onBeforeUploadItem`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.common.documents.uploadImageModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.common.documents.addCreditCardModal`: `ab`، `cardNumberChanged`، `save`، `cancel`.
- وحدة `tenant.views.crs.companies.createOrUpdateDriverModal`: `getlocalDateTime`، `getCardType`، `removeRow`، `searchSalesPersons`، `searchSalesPersonPopoup`، `salesPersonSelected`، `getDocsByContactId`، `searchCustomLookup`، `scanDocument`، `openUploadDocument`، `addCreditCardRow`، `updateCreditCardRow`، `save`، `cancel`، `doesIdentityDoucmentExist`، `addIndentityDocument`، `getIdentificationDocumentType`، `removeIndentityDocument`، `searchCountries`، `searchCompany`، `emiratesDataReader`، `emiratesDataFieldManager`، `getTariffCards`، `isDocument`، `isFieldMondatory`، `isAdditionalFieldsEnabled`، `typeOfFeild`، `getAdvanceSettings`.
- وحدة `tenant.views.crs.staff.printDocumenetModel`: `openPrintModal`، `cancel`، `getIdentificationDocumentType`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.trafficFile.getTrafficFiles` | POST | api/services/app/trafficFile/GetTrafficFiles | [المصدر](../../../raw/application.js#L222862) |
| `abp.services.app.trafficFine.getTrafficFines` | POST | api/services/app/trafficFine/GetTrafficFines | [المصدر](../../../raw/application.js#L223016) |
| `abp.services.app.vehicle.searchVehicles` | POST | api/services/app/vehicle/SearchVehicles | [المصدر](../../../raw/application.js#L222322) |
| `abp.services.app.invoiceSearch.getInvoiceForView` | POST | api/services/app/invoiceSearch/GetInvoiceForView | [المصدر](../../../raw/application.js#L223049) |
| `abp.services.app.trafficFine.createOrUpdateTrafficFine` | POST | api/services/app/trafficFine/CreateOrUpdateTrafficFine | [المصدر](../../../raw/application.js#L222449) |
| `abp.services.app.trafficFine.exportToExcel` | POST | api/services/app/trafficFine/ExportToExcel | [المصدر](../../../raw/application.js#L223282) |
| `abp.services.app.trafficFine.deleteTrafficFine` | POST | api/services/app/trafficFine/DeleteTrafficFine | [المصدر](../../../raw/application.js#L223376) |
| `abp.services.app.trafficFine.importTrafficFines` | POST | api/services/app/trafficFine/ImportTrafficFines | [المصدر](../../../raw/application.js#L222794) |
| `abp.services.app.billingMethod.getDefaultCreditCard` | POST | api/services/app/billingMethod/GetDefaultCreditCard | [المصدر](../../../raw/application.js#L386977) |
| `abp.services.app.commonLookup.getContactCards` | POST | api/services/app/commonLookup/GetContactCards | [المصدر](../../../raw/application.js#L386984) |
| `abp.services.app.account.searchAccountsForSubLookUp` | POST | api/services/app/account/SearchAccountsForSubLookUp | [المصدر](../../../raw/application.js#L346376) |
| `abp.services.app.chargesSetting.getConfiguredChargesTypes` | POST | api/services/app/chargesSetting/GetConfiguredChargesTypes | [المصدر](../../../raw/application.js#L387052) |
| `abp.services.app.job.searchJobs` | POST | api/services/app/job/SearchJobs | [المصدر](../../../raw/application.js#L387128) |
| `abp.services.app.directory.search` | POST | api/services/app/directory/Search | [المصدر](../../../raw/application.js#L181132) |
| `abp.services.app.directory.searchByContactGroup` | POST | api/services/app/directory/SearchByContactGroup | [المصدر](../../../raw/application.js#L387360) |
| `abp.services.app.billingMethod.getBillingMethods` | POST | api/services/app/billingMethod/GetBillingMethods | [المصدر](../../../raw/application.js#L385199) |
| `abp.services.app.commonLookup.getLocations` | POST | api/services/app/commonLookup/GetLocations | [المصدر](../../../raw/application.js#L180573) |
| `abp.services.app.currency.getCurrencies` | POST | api/services/app/currency/GetCurrencies | [المصدر](../../../raw/application.js#L180047) |
| `abp.services.app.allocation.getAllocationsForEdit` | POST | api/services/app/allocation/GetAllocationsForEdit | [المصدر](../../../raw/application.js#L387494) |
| `abp.services.app.allocation.getAllocationsForReceiptBaseOnAgreement` | POST | api/services/app/allocation/GetAllocationsForReceiptBaseOnAgreement | [المصدر](../../../raw/application.js#L387554) |
| `abp.services.app.commonLookup.getBankAccountsForSelection` | POST | api/services/app/commonLookup/GetBankAccountsForSelection | [المصدر](../../../raw/application.js#L385206) |
| `abp.services.app.commonLookup.getCurrencies` | POST | api/services/app/commonLookup/GetCurrencies | [المصدر](../../../raw/application.js#L388216) |
| `abp.services.app.commonAgreement.getAllAgreementsOnCustomer` | POST | api/services/app/commonAgreement/GetAllAgreementsOnCustomer | [المصدر](../../../raw/application.js#L388011) |
| `abp.services.app.receiptChargesAllocation.getReceiptChargesAllocationsForAgreementEdit` | POST | api/services/app/receiptChargesAllocation/GetReceiptChargesAllocationsForAgreementEdit | [المصدر](../../../raw/application.js#L387987) |
| `abp.services.app.receiptSearch.getReceiptForEdit` | POST | api/services/app/receiptSearch/GetReceiptForEdit | [المصدر](../../../raw/application.js#L385212) |
| `abp.services.app.commonAgreement.getAgreement` | POST | api/services/app/commonAgreement/GetAgreement | [المصدر](../../../raw/application.js#L388176) |
| `abp.services.app.receipt.createOrUpdateReceipt` | POST | api/services/app/receipt/CreateOrUpdateReceipt | [المصدر](../../../raw/application.js#L388363) |
| `abp.services.app.receipt.createOrUpdateReceiptWithCharge` | POST | api/services/app/receipt/CreateOrUpdateReceiptWithCharge | [المصدر](../../../raw/application.js#L388423) |
| `abp.services.app.receipt.createOrUpdateReceiptPayment` | POST | api/services/app/receipt/CreateOrUpdateReceiptPayment | [المصدر](../../../raw/application.js#L388555) |
| `abp.services.app.trafficFine.createInvoiceFromTrafficFine` | POST | api/services/app/trafficFine/CreateInvoiceFromTrafficFine | [المصدر](../../../raw/application.js#L222007) |
| `abp.services.app.trafficFine.getImageForShow` | POST | api/services/app/trafficFine/GetImageForShow | [المصدر](../../../raw/application.js#L222470) |
| `abp.services.app.trafficFine.getMovementOnVehicle` | POST | api/services/app/trafficFine/GetMovementOnVehicle | [المصدر](../../../raw/application.js#L222406) |
| `abp.services.app.trafficFine.getTrafficFineForEdit` | POST | api/services/app/trafficFine/GetTrafficFineForEdit | [المصدر](../../../raw/application.js#L222463) |
| `abp.services.app.trafficFine.chargeTrafficFine` | POST | api/services/app/trafficFine/ChargeTrafficFine | [المصدر](../../../raw/application.js#L385139) |
| `abp.services.app.commonAgreement.getOpenAgreementsOnCustomer` | POST | api/services/app/commonAgreement/GetOpenAgreementsOnCustomer | [المصدر](../../../raw/application.js#L385180) |
| `abp.services.app.commonAgreement.getClosedAgreementsOnCustomer` | POST | api/services/app/commonAgreement/GetClosedAgreementsOnCustomer | [المصدر](../../../raw/application.js#L385183) |
| `abp.services.app.directory.searchDirectoryPaged` | POST | api/services/app/directory/SearchDirectoryPaged | [المصدر](../../../raw/application.js#L184666) |
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
| `abp.services.app.chargesSetting.getChargesTypes` | POST | api/services/app/chargesSetting/GetChargesTypes | [المصدر](../../../raw/application.js#L179287) |
| `abp.services.app.directory.searchSalesPersonOne` | POST | api/services/app/directory/SearchSalesPersonOne | [المصدر](../../../raw/application.js#L179720) |
| `abp.services.app.commonLookup.searchCustomLookups` | POST | api/services/app/commonLookup/SearchCustomLookups | [المصدر](../../../raw/application.js#L180737) |
| `abp.services.app.commonLookup.getCustomLookups` | POST | api/services/app/commonLookup/GetCustomLookups | [المصدر](../../../raw/application.js#L182869) |
| `abp.services.app.country.searchCountries` | POST | api/services/app/country/SearchCountries | [المصدر](../../../raw/application.js#L181210) |
| `abp.services.app.person.createOrUpdatePerson` | POST | api/services/app/person/CreateOrUpdatePerson | [المصدر](../../../raw/application.js#L183236) |
| `abp.services.app.contactGroup.getContactGroupsOnContactType` | POST | api/services/app/contactGroup/GetContactGroupsOnContactType | [المصدر](../../../raw/application.js#L181124) |
| `abp.services.app.taxCode.getTaxCodes` | POST | api/services/app/taxCode/GetTaxCodes | [المصدر](../../../raw/application.js#L179267) |
| `abp.services.app.tariffCard.getActiveTariffCards` | POST | api/services/app/tariffCard/GetActiveTariffCards | [المصدر](../../../raw/application.js#L180054) |
| `abp.services.app.tariffCard.getTariffCardById` | POST | api/services/app/tariffCard/GetTariffCardById | [المصدر](../../../raw/application.js#L180067) |
| `abp.services.app.person.getAdvanceSettings` | POST | api/services/app/person/GetAdvanceSettings | [المصدر](../../../raw/application.js#L183744) |
| `abp.services.app.person.getHighLightBlackListCountry` | POST | [object Object] | [المصدر](../../../raw/application.js#L183768) |
| `abp.services.app.person.getNationalIdFormate` | POST | [object Object] | [المصدر](../../../raw/application.js#L183774) |
| `abp.services.app.person.getPersonForEdit` | POST | api/services/app/person/GetPersonForEdit | [المصدر](../../../raw/application.js#L183903) |
| `abp.services.app.person.getContactCards` | POST | api/services/app/person/GetContactCards | [المصدر](../../../raw/application.js#L181343) |
| `abp.services.app.commonLookup.validateCreditLimit` | POST | api/services/app/commonLookup/ValidateCreditLimit | [المصدر](../../../raw/application.js#L180328) |
| `abp.services.app.commonLookup.getLocationsActiveAndInActive` | POST | api/services/app/commonLookup/GetLocationsActiveAndInActive | [المصدر](../../../raw/application.js#L179440) |
| `abp.services.app.directory.getDriverForCompany` | POST | [object Object] | [المصدر](../../../raw/application.js#L179552) |
| `abp.services.app.company.deleteCompanyDriver` | POST | [object Object] | [المصدر](../../../raw/application.js#L179593) |
| `abp.services.app.company.createOrUpdateCompany` | POST | api/services/app/company/CreateOrUpdateCompany | [المصدر](../../../raw/application.js#L179662) |
| `abp.services.app.designation.getDesignations` | POST | api/services/app/designation/GetDesignations | [المصدر](../../../raw/application.js#L293348) |
| `abp.services.app.company.getCompanyForEdit` | POST | api/services/app/company/GetCompanyForEdit | [المصدر](../../../raw/application.js#L180102) |
| `abp.services.app.company.getContactCards` | POST | api/services/app/company/GetContactCards | [المصدر](../../../raw/application.js#L180183) |
| `abp.services.app.company.getAdvanceSettings` | POST | api/services/app/company/GetAdvanceSettings | [المصدر](../../../raw/application.js#L180386) |
| `abp.services.app.industry.getIndustries` | POST | api/services/app/industry/GetIndustries | [المصدر](../../../raw/application.js#L180410) |
| `abp.services.app.company.getCompanyCustomField1` | POST | api/services/app/company/GetCompanyCustomField1 | [المصدر](../../../raw/application.js#L180419) |
| `abp.services.app.company.getCompanyCustomField2` | POST | api/services/app/company/GetCompanyCustomField2 | [المصدر](../../../raw/application.js#L180428) |
| `abp.services.app.company.getHighLightBlackListCountry` | POST | [object Object] | [المصدر](../../../raw/application.js#L180436) |
| `abp.services.app.company.getCompanyCustomField3` | POST | api/services/app/company/GetCompanyCustomField3 | [المصدر](../../../raw/application.js#L180441) |
| `abp.services.app.division.getDivisions` | POST | api/services/app/division/GetDivisions | [المصدر](../../../raw/application.js#L292959) |
| `abp.services.app.businessUnit.getBusinessUnits` | POST | api/services/app/businessUnit/GetBusinessUnits | [المصدر](../../../raw/application.js#L293035) |
| `abp.services.app.sponsorship.getAllActiveSponsorships` | POST | api/services/app/sponsorship/GetAllActiveSponsorships | [المصدر](../../../raw/application.js#L293041) |
| `abp.services.app.shift.getShifts` | POST | api/services/app/shift/GetShifts | [المصدر](../../../raw/application.js#L293047) |
| `abp.services.app.department.getDepartment` | POST | api/services/app/department/GetDepartment | [المصدر](../../../raw/application.js#L293053) |
| `abp.services.app.directory.getContactInfo` | POST | api/services/app/directory/GetContactInfo | [المصدر](../../../raw/application.js#L293061) |
| `abp.services.app.staffRole.getStaffRole` | POST | api/services/app/staffRole/GetStaffRole | [المصدر](../../../raw/application.js#L293068) |
| `abp.services.app.leaveType.getLeaveType` | POST | api/services/app/leaveType/GetLeaveType | [المصدر](../../../raw/application.js#L293075) |
| `abp.services.app.staff.createOrUpdateStaff` | POST | api/services/app/staff/CreateOrUpdateStaff | [المصدر](../../../raw/application.js#L293184) |
| `abp.services.app.staff.getPayCalculate` | POST | api/services/app/staff/GetPayCalculate | [المصدر](../../../raw/application.js#L293203) |
| `abp.services.app.staff.getStaffForEdit` | POST | api/services/app/staff/GetStaffForEdit | [المصدر](../../../raw/application.js#L293866) |
| `abp.services.app.salaryItemsSetting.getSalaryItemTypes` | POST | api/services/app/salaryItemsSetting/GetSalaryItemTypes | [المصدر](../../../raw/application.js#L293444) |
| `abp.services.app.person.uploadDocumentImage` | POST | api/services/app/person/UploadDocumentImage | [المصدر](../../../raw/application.js#L185476) |
| `abp.services.app.company.createOrUpdateCopmanyDriver` | POST | api/services/app/company/CreateOrUpdateCopmanyDriver | [المصدر](../../../raw/application.js#L181019) |
| `abp.services.app.tariffCard.getTariffCards` | POST | api/services/app/tariffCard/GetTariffCards | [المصدر](../../../raw/application.js#L181246) |
| `abp.services.app.company.getAdvanceSettingsForDriver` | POST | api/services/app/company/GetAdvanceSettingsForDriver | [المصدر](../../../raw/application.js#L181282) |
| `abp.services.app.person.getDriverForEdit` | POST | api/services/app/person/GetDriverForEdit | [المصدر](../../../raw/application.js#L181326) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.TrafficFines.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.TrafficFines.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.TrafficFines.Delete`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.TrafficFines.ImportTrafficFines`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Receipts.AllActionsOnOtherBranchReceipts`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Allocations`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Receipts.CanChangeDate`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Delete`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.SalesModule.SalesAgreement.GenerateDownPaymentReceipt`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.SalesModule.SalesQuotation.GenerateDownPaymentReceipt`: ممنوحة في السياق الملتقط.
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
- صلاحية `Pages.Tenant.Companies.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Companies.LimitedEdit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Integration.EInvoicingUAE`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Companies.CustomerApproval`: غير ممنوحة في السياق الملتقط.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.filters.fineNo` | text |  |  |
| `vm.filters.notChargedFines` | checkbox | NotChargedFines |  |
| `vm.dateRangeModel` | text |  | min=vm.dateRangeOptions.min; max=vm.dateRangeOptions.max; ng-disabled=!vm.filters.enableDateRange |
| `vm.filters.enableDateRange` | checkbox | disableDateRange |  |
| `vm.filters.dateType` | radio | ByFineDate |  |
| `vm.filters.dateType` | radio | ByCreateDate |  |
| `vm.filters.vehicle` | ui-select |  |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
