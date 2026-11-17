# شاشة: Debit Notes

المسار في القائمة: Vouchers ← Debit Notes.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_debitNotes`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0322](../../../readable/routes/R0322--tenant-crs-debitnotes.js)، والأصل [raw/application.js:3842](../../../raw/application.js#L3842).
- قالب الشاشة: `~/App/tenant/views/crs/vouchers/debitNotes/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.vouchers.debitNotes.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.vouchers.debitNotes.index](../../../readable/controllers/C1278--tenant.views.crs.vouchers.debitNotes.index.js) | 34 | 11 |
| [tenant.views.crs.contacts.searchContactModal](../../../readable/controllers/C0706--tenant.views.crs.contacts.searchContactModal.js) | 7 | 2 |
| [tenant.views.crs.vouchers.debitNotes.createOrEditModal](../../../readable/controllers/C1276--tenant.views.crs.vouchers.debitNotes.createOrEditModal.js) | 25 | 8 |
| [common.views.common.reportViewer](../../../readable/controllers/C0006--common.views.common.reportViewer.js) | 2 | 0 |
| [tenant.views.crs.vouchers.debitNotes.createOrEditOnAccountModal](../../../readable/controllers/C1277--tenant.views.crs.vouchers.debitNotes.createOrEditOnAccountModal.js) | 34 | 15 |
| [tenant.views.crs.vouchers.allocations.createAllocation](../../../readable/controllers/C1220--tenant.views.crs.vouchers.allocations.createAllocation.js) | 11 | 3 |
| [tenant.views.crs.vouchers.debitNotes.printTemplates.printPreview](../../../readable/controllers/C1286--tenant.views.crs.vouchers.debitNotes.printTemplates.printPreview.js) | 2 | 0 |
| [tenant.views.crs.vouchers.common.rejectReason](../../../readable/controllers/C1256--tenant.views.crs.vouchers.common.rejectReason.js) | 2 | 0 |
| [tenant.views.crs.accounting.journal.viewModal](../../../readable/controllers/C0499--tenant.views.crs.accounting.journal.viewModal.js) | 7 | 2 |
| [tenant.views.crs.contacts.createOrEditModal](../../../readable/controllers/C0703--tenant.views.crs.contacts.createOrEditModal.js) | 45 | 24 |
| [tenant.views.crs.vouchers.debitNotes.uploadDocumentsModal](../../../readable/controllers/C1402--tenant.views.crs.vouchers.debitNotes.uploadDocumentsModal.js) | 3 | 0 |
| [tenant.views.crs.vouchers.creditNotes.allocatedNowForOpeningBalanceModal](../../../readable/controllers/C1257--tenant.views.crs.vouchers.creditNotes.allocatedNowForOpeningBalanceModal.js) | 9 | 3 |
| [tenant.views.crs.contacts.uploadDocumentModal](../../../readable/controllers/C0699--tenant.views.crs.contacts.uploadDocumentModal.js) | 2 | 1 |
| [tenant.views.crs.contacts.uploadDocumentModal](../../../readable/controllers/C0711--tenant.views.crs.contacts.uploadDocumentModal.js) | 2 | 1 |
| [tenant.views.common.documents.uploadDocumentModal](../../../readable/controllers/C0362--tenant.views.common.documents.uploadDocumentModal.js) | 4 | 0 |
| [tenant.views.common.documents.uploadImageModal](../../../readable/controllers/C0363--tenant.views.common.documents.uploadImageModal.js) | 3 | 0 |
| [tenant.views.common.documents.addCreditCardModal](../../../readable/controllers/C0701--tenant.views.common.documents.addCreditCardModal.js) | 4 | 0 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.vouchers.debitNotes.index`: `changePrintingWithoutLogo`، `dateRangeModelChanged`، `dateRangeCheck`، `CurrencyFormate`، `locationPermission`، `allBranchPermission`، `searchCustomers`، `searchCustomerPopoup`، `getlocalDateTime`، `isPrintEnabled`، `getDebitNoteTypeById`، `report`، `report2`، `taxReport`، `taxReport2`، `createDebitNote`، `createDebitNoteOnAccount`، `editDebitNote`، `viewDebitNote`، `exportToExcel`، `exportToExcel2`، `approveAllMethod`، `deleteDebitNote`، `createAllocation`، `voidDebitNote`، `clearCustomer`، `getDebitNotes`، `enterKeyPress`، `roundingforView`، `openprintModal`، `approveDebitNote`، `unapproveDebitNote`، `rejectDebitNote`، `openJournalViewModal`.
- وحدة `tenant.views.crs.contacts.searchContactModal`: `searchContacts`، `cancel`، `showAddContact`، `contactSelected`، `contactEdit`، `getContactsList`، `getNameWithCode`.
- وحدة `tenant.views.crs.vouchers.debitNotes.createOrEditModal`: `localize`، `rounding`، `agreementChanged`، `cancel`، `customerSettings`، `roundingforView`، `CurrencyFormate`، `sumAmount`، `taxAcceptedChanged`، `addRow`، `removeRow`، `uploadDocument`، `getOriginalName`، `removeDocument`، `onCustomerSelect`، `moduleChanged`، `allocatedNowForOpeningBalance`، `searchCustomers`، `searchAccounts`، `searchVehicles`، `searchCustomerPopoup`، `getlocalDateTime`، `sumAmountAllocation`، `save`، `localize`.
- وحدة `common.views.common.reportViewer`: `exportToExcelFromReport`، `cancel`.
- وحدة `tenant.views.crs.vouchers.debitNotes.createOrEditOnAccountModal`: `onAgreementSelection`، `localize`، `rounding`، `agreementChanged`، `cancel`، `customerSettings`، `roundingforView`، `CurrencyFormate`، `GetCostCenterName`، `searchAgreements`، `calculateCreditAndTax`، `onTaxChange`، `sumAmountTaxEditable`، `sumAmount`، `taxAcceptedChanged`، `addRow`، `removeRow`، `branchTaxCode`، `onCustomerSelect`، `moduleChanged`، `searchCustomers`، `searchAccounts`، `searchVehicles`، `searchCustomerPopoup`، `getlocalDateTime`، `sumAmountAllocation`، `searchPrepaidExpense`، `uploadDocument`، `getOriginalName`، `removeDocument`، `save`، `localize`، `uploader.onSuccessItem`، `uploader.onErrorItem`.
- وحدة `tenant.views.crs.vouchers.allocations.createAllocation`: `refresh`، `exportToExcel`، `importResult`، `cancel`، `localize`، `rounding`، `sumAmount`، `getlocalDateTime`، `insertDueAmountOnClick`، `save`، `exportToExcelAllocations`.
- وحدة `tenant.views.crs.vouchers.debitNotes.printTemplates.printPreview`: `cancel`، `getTemplateUrl`.
- وحدة `tenant.views.crs.vouchers.common.rejectReason`: `cancel`، `save`.
- وحدة `tenant.views.crs.accounting.journal.viewModal`: `getlocalDateTime`، `rounding`، `formatNumber`، `roundingforView`، `currencyAndRoundingWithThree`، `getVoucherType`، `cancel`.
- وحدة `tenant.views.crs.contacts.createOrEditModal`: `localize`، `removeExternalIdRow`، `addExternalIdRow`، `getContactExternalType`، `isContactExternalType`، `getlocalDate`، `getlocalDateTime`، `getCardType`، `removeRow`، `searchSalesPersons`، `searchUsersWithDesignation`، `searchSalesPersonPopoup`، `salesPersonSelected`، `searchDebtCollectorPopoup`، `searchCustomLookup`، `getCustomLookups`، `scanDocument`، `openUploadDocument`، `openUploadPicture`، `addCreditCardRow`، `updateCreditCardRow`، `save`، `cancel`، `isPersonVerifiedChange`، `doesIdentityDoucmentExist`، `addIndentityDocument`، `getIdentificationDocumentType`، `removeIndentityDocument`، `removeDoc`، `isFieldMondatory`، `searchCountries`، `emiratesDataReader`، `emiratesDataFieldManager`، `getTariffCards`، `getTariffCardForContact`، `isDocument`، `maskCreditCard`، `getAdvanceSettings`، `getHighLightBlackListCountries`، `getNationalIdFormates`، `nationalIdFormate`، `onOverRideChange`، `resetDocumentNo`، `nationIdMaskInput`، `handleResidenceStatusChange`.
- وحدة `tenant.views.crs.vouchers.debitNotes.uploadDocumentsModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.crs.vouchers.creditNotes.allocatedNowForOpeningBalanceModal`: `searchAccounts`، `rounding`، `sumAmount`، `searchRentalOrLeaseAgreement`، `cancel`، `localize`، `addRow`، `removeRow`، `save`.
- وحدة `tenant.views.crs.contacts.uploadDocumentModal`: `save`، `cancel`.
- وحدة `tenant.views.crs.contacts.uploadDocumentModal`: `save`، `cancel`.
- وحدة `tenant.views.common.documents.uploadDocumentModal`: `uploadHeader`، `uploader.onBeforeUploadItem`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.common.documents.uploadImageModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.common.documents.addCreditCardModal`: `ab`، `cardNumberChanged`، `save`، `cancel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.directory.search` | POST | api/services/app/directory/Search | [المصدر](../../../raw/application.js#L182771) |
| `abp.services.app.debitNote.exportToExcel` | POST | api/services/app/debitNote/ExportToExcel | [المصدر](../../../raw/application.js#L336792) |
| `abp.services.app.debitNote.exportToExcel2` | POST | api/services/app/debitNote/ExportToExcel2 | [المصدر](../../../raw/application.js#L336803) |
| `abp.services.app.debitNote.approveDebitNotes` | POST | api/services/app/debitNote/ApproveDebitNotes | [المصدر](../../../raw/application.js#L336818) |
| `abp.services.app.debitNote.deleteDebitNote` | POST | api/services/app/debitNote/DeleteDebitNote | [المصدر](../../../raw/application.js#L336829) |
| `abp.services.app.debitNote.voidDebitNote` | POST | api/services/app/debitNote/VoidDebitNote | [المصدر](../../../raw/application.js#L336865) |
| `abp.services.app.commonLookup.getLocationsActiveAndInActive` | POST | api/services/app/commonLookup/GetLocationsActiveAndInActive | [المصدر](../../../raw/application.js#L336889) |
| `abp.services.app.debitNote.getDebitNotes` | POST | api/services/app/debitNote/GetDebitNotes | [المصدر](../../../raw/application.js#L336912) |
| `abp.services.app.debitNote.approveDebitNote` | POST | api/services/app/debitNote/ApproveDebitNote | [المصدر](../../../raw/application.js#L337080) |
| `abp.services.app.debitNote.unApproveDebitNote` | POST | api/services/app/debitNote/UnApproveDebitNote | [المصدر](../../../raw/application.js#L337096) |
| `abp.services.app.debitNote.rejectDebitNote` | POST | api/services/app/debitNote/RejectDebitNote | [المصدر](../../../raw/application.js#L337144) |
| `abp.services.app.directory.searchDirectoryPaged` | POST | api/services/app/directory/SearchDirectoryPaged | [المصدر](../../../raw/application.js#L184666) |
| `abp.services.app.account.searchAccountsForSubLookUp` | POST | api/services/app/account/SearchAccountsForSubLookUp | [المصدر](../../../raw/application.js#L336057) |
| `abp.services.app.vehicle.searchVehicles` | POST | api/services/app/vehicle/SearchVehicles | [المصدر](../../../raw/application.js#L336065) |
| `abp.services.app.debitNote.createOrUpdateDebitNote` | POST | api/services/app/debitNote/CreateOrUpdateDebitNote | [المصدر](../../../raw/application.js#L335361) |
| `abp.services.app.chargesSetting.getConfiguredChargesTypes` | POST | api/services/app/chargesSetting/GetConfiguredChargesTypes | [المصدر](../../../raw/application.js#L336240) |
| `abp.services.app.commonLookup.getLocations` | POST | api/services/app/commonLookup/GetLocations | [المصدر](../../../raw/application.js#L182597) |
| `abp.services.app.allocation.getAllocationsForEdit` | POST | api/services/app/allocation/GetAllocationsForEdit | [المصدر](../../../raw/application.js#L319750) |
| `abp.services.app.debitNote.getDebitNoteForEdit` | POST | api/services/app/debitNote/GetDebitNoteForEdit | [المصدر](../../../raw/application.js#L336357) |
| `abp.services.app.costCenter.searchCostCenters` | POST | api/services/app/costCenter/SearchCostCenters | [المصدر](../../../raw/application.js#L335607) |
| `abp.services.app.agreement.searchAgreementForVoucherLines` | POST | api/services/app/agreement/SearchAgreementForVoucherLines | [المصدر](../../../raw/application.js#L335632) |
| `abp.services.app.commonLookup.getLocationById` | POST | api/services/app/commonLookup/GetLocationById | [المصدر](../../../raw/application.js#L335923) |
| `abp.services.app.commonAgreement.getAllAgreementsOnCustomer` | POST | api/services/app/commonAgreement/GetAllAgreementsOnCustomer | [المصدر](../../../raw/application.js#L336026) |
| `abp.services.app.jV.getexpenseaccounts` | POST | api/services/app/jV/Getexpenseaccounts | [المصدر](../../../raw/application.js#L336139) |
| `abp.services.app.debitNote.createOrUpdateDebitNoteOnAccount` | POST | api/services/app/debitNote/CreateOrUpdateDebitNoteOnAccount | [المصدر](../../../raw/application.js#L336223) |
| `abp.services.app.debitNote.importFromExcel` | POST | [object Object] | [المصدر](../../../raw/application.js#L336290) |
| `abp.services.app.allocation.saveAllocations` | POST | api/services/app/allocation/SaveAllocations | [المصدر](../../../raw/application.js#L319704) |
| `abp.services.app.allocation.exportToExcelReceipt` | POST | [object Object] | [المصدر](../../../raw/application.js#L319741) |
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
| `abp.services.app.currency.getCurrencies` | POST | api/services/app/currency/GetCurrencies | [المصدر](../../../raw/application.js#L183468) |
| `abp.services.app.tariffCard.getActiveTariffCards` | POST | api/services/app/tariffCard/GetActiveTariffCards | [المصدر](../../../raw/application.js#L183703) |
| `abp.services.app.tariffCard.getTariffCardById` | POST | api/services/app/tariffCard/GetTariffCardById | [المصدر](../../../raw/application.js#L183716) |
| `abp.services.app.person.getAdvanceSettings` | POST | api/services/app/person/GetAdvanceSettings | [المصدر](../../../raw/application.js#L183744) |
| `abp.services.app.person.getHighLightBlackListCountry` | POST | [object Object] | [المصدر](../../../raw/application.js#L183768) |
| `abp.services.app.person.getNationalIdFormate` | POST | [object Object] | [المصدر](../../../raw/application.js#L183774) |
| `abp.services.app.person.getPersonForEdit` | POST | api/services/app/person/GetPersonForEdit | [المصدر](../../../raw/application.js#L183903) |
| `abp.services.app.person.getContactCards` | POST | api/services/app/person/GetContactCards | [المصدر](../../../raw/application.js#L184004) |
| `abp.services.app.commonLookup.validateCreditLimit` | POST | api/services/app/commonLookup/ValidateCreditLimit | [المصدر](../../../raw/application.js#L184099) |
| `abp.services.app.account.searchAccounts` | POST | api/services/app/account/SearchAccounts | [المصدر](../../../raw/application.js#L329686) |
| `abp.services.app.commonLookup.searchRentalOrLeaseAgreement` | POST | api/services/app/commonLookup/SearchRentalOrLeaseAgreement | [المصدر](../../../raw/application.js#L329705) |
| `abp.services.app.chargesSetting.getConfiguredChargesTypesDistinct` | POST | api/services/app/chargesSetting/GetConfiguredChargesTypesDistinct | [المصدر](../../../raw/application.js#L329715) |
| `abp.services.app.person.uploadDocumentImage` | POST | api/services/app/person/UploadDocumentImage | [المصدر](../../../raw/application.js#L185476) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.Accounts.Journal`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.DebitNotes.OnAccount.CreateOnAccount`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.DebitNotes.CounterPayable.CreateCounterPayable`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.DebitNotes.OnAccount.EditOnAccount`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.DebitNotes.CounterPayable.EditCounterPayable`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.DebitNotes.OnAccount.ViewOnAccount`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.DebitNotes.CounterPayable.ViewCounterPayable`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.DebitNotes.OnAccount.DeleteOnAccount`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.DebitNotes.CounterPayable.DeleteCounterPayable`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.DebitNotes.Approve`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.DebitNotes.CanApproveBranchDebitNotes`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.DebitNotes.UnApprove`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.DebitNotes.Reject`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.DebitNotes.ExportToExcel`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.DebitNotes.Void`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.DebitNotes.View`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.DebitNotes.Print`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Allocations`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.DebitNotes.AllActionsOnOtherBranchDebitNotes`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.DebitNotes.ViewOtherBranchDebitNotes`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Delete`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Receipts.ImportAllocations`: غير ممنوحة في السياق الملتقط.
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
| `vm.filters.debitNoteType` | text | creditNoteType | ng-options=debitNote.id as debitNote.name for debitNote in vm.debitNoteTypes |
| `vm.filters.approvedType` | text | debitNoteType | ng-options=approvedType.id as approvedType.name for approvedType in vm.approvedTypes |
| `vm.filters.jobNo` | text |  |  |
| `vm.dateRangeModel` | text |  | min=vm.dateRangeOptions.min; max=vm.dateRangeOptions.max; ng-disabled=!vm.filters.enableDateRange |
| `vm.filters.enableDateRange` | checkbox | disableDateRange |  |
| `vm.filters.customer` | ui-select |  |  |
| `vm.filters.locationId` | select | locationId |  |
| `vm.filters.agreementNo` | text |  |  |
| `vm.filters.refNo2` | text |  |  |
| `vm.filters.module` | text | module | ng-options=module.id as module.name for module in vm.modules |
| `vm.filters.voidedOnly` | checkbox | voidedOnly |  |
| `vm.filters.printingWithoutLogo` | checkbox | printingWithoutLogo |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
