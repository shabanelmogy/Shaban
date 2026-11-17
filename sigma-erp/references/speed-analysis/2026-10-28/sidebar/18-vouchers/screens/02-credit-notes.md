# شاشة: Credit Notes

المسار في القائمة: Vouchers ← Credit Notes.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_creditNotes`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0321](../../../readable/routes/R0321--tenant-crs-creditnotes.js)، والأصل [raw/application.js:3834](../../../raw/application.js#L3834).
- قالب الشاشة: `~/App/tenant/views/crs/vouchers/creditNotes/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.vouchers.creditNotes.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.vouchers.creditNotes.index](../../../readable/controllers/C1263--tenant.views.crs.vouchers.creditNotes.index.js) | 44 | 16 |
| [tenant.views.crs.contacts.searchContactModal](../../../readable/controllers/C0706--tenant.views.crs.contacts.searchContactModal.js) | 7 | 2 |
| [tenant.views.crs.vouchers.creditNotes.createOrEditModal](../../../readable/controllers/C1260--tenant.views.crs.vouchers.creditNotes.createOrEditModal.js) | 27 | 10 |
| [tenant.views.crs.vouchers.creditNotes.viewModalOnDeliveryNote](../../../readable/controllers/C1271--tenant.views.crs.vouchers.creditNotes.viewModalOnDeliveryNote.js) | 7 | 3 |
| [tenant.views.crs.vouchers.creditNotes.createOrEditModalOnAccount](../../../readable/controllers/C1261--tenant.views.crs.vouchers.creditNotes.createOrEditModalOnAccount.js) | 34 | 17 |
| [tenant.views.crs.vouchers.creditNotes.createOrEditBulkModal](../../../readable/controllers/C1259--tenant.views.crs.vouchers.creditNotes.createOrEditBulkModal.js) | 16 | 6 |
| [tenant.views.crs.vouchers.creditNotes.createOrEditModalOnDeliveryNote](../../../readable/controllers/C1262--tenant.views.crs.vouchers.creditNotes.createOrEditModalOnDeliveryNote.js) | 23 | 10 |
| [common.views.common.reportViewer](../../../readable/controllers/C0006--common.views.common.reportViewer.js) | 2 | 0 |
| [tenant.views.crs.vouchers.creditNotes.printTemplates.printPreview](../../../readable/controllers/C1273--tenant.views.crs.vouchers.creditNotes.printTemplates.printPreview.js) | 2 | 0 |
| [tenant.views.crs.vouchers.common.rejectReason](../../../readable/controllers/C1256--tenant.views.crs.vouchers.common.rejectReason.js) | 2 | 0 |
| [tenant.views.crs.vouchers.allocations.createAllocation](../../../readable/controllers/C1220--tenant.views.crs.vouchers.allocations.createAllocation.js) | 11 | 3 |
| [tenant.views.crs.accounting.journal.viewModal](../../../readable/controllers/C0499--tenant.views.crs.accounting.journal.viewModal.js) | 7 | 2 |
| [tenant.views.crs.contacts.createOrEditModal](../../../readable/controllers/C0703--tenant.views.crs.contacts.createOrEditModal.js) | 45 | 24 |
| [tenant.views.crs.vouchers.creditNotes.uploadDocumentsModal](../../../readable/controllers/C1270--tenant.views.crs.vouchers.creditNotes.uploadDocumentsModal.js) | 3 | 0 |
| [tenant.views.crs.vouchers.creditNotes.allocatedNowForOpeningBalanceModal](../../../readable/controllers/C1257--tenant.views.crs.vouchers.creditNotes.allocatedNowForOpeningBalanceModal.js) | 9 | 3 |
| [tenant.views.crs.vouchers.creditNotes.allocatedNowOnChargesTypeModal](../../../readable/controllers/C1258--tenant.views.crs.vouchers.creditNotes.allocatedNowOnChargesTypeModal.js) | 4 | 1 |
| [tenant.views.crs.vouchers.creditNotes.searchAllocations](../../../readable/controllers/C1267--tenant.views.crs.vouchers.creditNotes.searchAllocations.js) | 6 | 1 |
| [tenant.views.crs.contacts.uploadDocumentModal](../../../readable/controllers/C0699--tenant.views.crs.contacts.uploadDocumentModal.js) | 2 | 1 |
| [tenant.views.crs.contacts.uploadDocumentModal](../../../readable/controllers/C0711--tenant.views.crs.contacts.uploadDocumentModal.js) | 2 | 1 |
| [tenant.views.common.documents.uploadDocumentModal](../../../readable/controllers/C0362--tenant.views.common.documents.uploadDocumentModal.js) | 4 | 0 |
| [tenant.views.common.documents.uploadImageModal](../../../readable/controllers/C0363--tenant.views.common.documents.uploadImageModal.js) | 3 | 0 |
| [tenant.views.common.documents.addCreditCardModal](../../../readable/controllers/C0701--tenant.views.common.documents.addCreditCardModal.js) | 4 | 0 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.vouchers.creditNotes.index`: `changePrintingWithoutLogo`، `searchUsers`، `searchUsersWithDesignation`، `searchUser`، `getCreditNoteTypeById`، `dateRangeModelChanged`، `CurrencyFormate`، `dateRangeCheck`، `locationPermission`، `allBranchPermission`، `searchCustomers`، `searchCustomerPopoup`، `getlocalDateTime`، `createCreditNote`، `createCreditNoteBulk`، `isPrintEnabled`، `createCreditOnAccountNote`، `createCreditNoteOnDelivery`، `editCreditNote`، `viewCreditNote`، `viewCreditNoteOnAccount`، `exportToExcel`، `exportToExcel2`، `roundingforView`، `approveAllMethod`، `report`، `report2`، `taxReport`، `taxReport2`، `deleteCreditNote`، `voidCreditNote`، `clearCustomer`، `getCreditNotes`، `clearSalesPerson`، `enterKeyPress`، `whatsAppSMS`، `sendEmail`، `openprintModal`، `approveCreditNote`، `unapproveCreditNote`، `rejectCreditNote`، `clearSalesPerson`، `createAllocation`، `openJournalViewModal`.
- وحدة `tenant.views.crs.contacts.searchContactModal`: `searchContacts`، `cancel`، `showAddContact`، `contactSelected`، `contactEdit`، `getContactsList`، `getNameWithCode`.
- وحدة `tenant.views.crs.vouchers.creditNotes.createOrEditModal`: `localize`، `currencyAndRoundingWithThree`، `rounding`، `customerSettings`، `uploadDocument`، `getOriginalName`، `getAmountInWords`، `moduleChanged`، `isCounterReceivableCreditNote`، `isAssetSaleInvoice`، `showAllocation`، `onAllocationAmountChanged`، `canEditAllocatedAmount`، `onAssetSalesInvoiceOnlyChanged`، `isAssetSalesInvoiceEdit`، `sumAmountAllocation`، `onCustomerSelect`، `onCustomerSelectForAgreement`، `onAgreementSelect`، `getlocalDateTime`، `allocatedNowForOpeningBalance`، `searchCustomers`، `searchCustomerPopoup`، `manuallyAllocatedPopup`، `save`، `removeDocument`، `cancel`.
- وحدة `tenant.views.crs.vouchers.creditNotes.viewModalOnDeliveryNote`: `localize`، `rounding`، `getlocalDateTime`، `getlocalDate`، `cancel`، `uploadDocument`، `getOriginalName`.
- وحدة `tenant.views.crs.vouchers.creditNotes.createOrEditModalOnAccount`: `localize`، `rounding`، `searchAgreements`، `onAgreementSelection`، `uploadDocument`، `getOriginalName`، `sumAmountAllocation`، `currencyAndRoundingWithThree`، `onCustomerSelect`، `onCustomerSelectForAgreement`، `onAgreementSelect`، `moduleChanged`، `getlocalDateTime`، `getlocalDate`، `allocatedNowForOpeningBalance`، `searchCustomers`، `searchJobs`، `searchContact`، `searchVehicles`، `searchCustomerPopoup`، `searchAccounts`، `save`، `branchTaxCode`، `setTaxPercentOnTaxCode`، `removeDocument`، `cancel`، `uploader.onSuccessItem`، `uploader.onErrorItem`، `addRow`، `removeRow`، `sumAmountTax`، `accountChanged`، `calculateTaxPerRow`، `calculateDebitAndTax`.
- وحدة `tenant.views.crs.vouchers.creditNotes.createOrEditBulkModal`: `dateRangeModelChange`، `dateRangeCheck`، `searchAgreementGroup`، `localize`، `rounding`، `customerSettings`، `sumAmountAllocation`، `amountInWords`، `getCustomersAllocations`، `getlocalDateTime`، `manuallyAllocatedPopup`، `searchAllocationsPopup`، `searchAllocations`، `toggleBtnDisable`، `save`، `cancel`.
- وحدة `tenant.views.crs.vouchers.creditNotes.createOrEditModalOnDeliveryNote`: `localize`، `rounding`، `branchTaxCode`، `setTaxPercentOnTaxCode`، `calculateTax`، `onCustomerSelect`، `invoiceSelected`، `getlocalDateTime`، `getlocalDate`، `searchCustomers`، `searchContact`، `searchCustomerPopoup`، `sumAmount`، `searchInvoices`، `searchDeliveryNotes`، `getHourlyRate`، `uploadDocument`، `getOriginalName`، `save`، `removeDocument`، `cancel`، `addRow`، `removeRow`.
- وحدة `common.views.common.reportViewer`: `exportToExcelFromReport`، `cancel`.
- وحدة `tenant.views.crs.vouchers.creditNotes.printTemplates.printPreview`: `cancel`، `getTemplateUrl`.
- وحدة `tenant.views.crs.vouchers.common.rejectReason`: `cancel`، `save`.
- وحدة `tenant.views.crs.vouchers.allocations.createAllocation`: `refresh`، `exportToExcel`، `importResult`، `cancel`، `localize`، `rounding`، `sumAmount`، `getlocalDateTime`، `insertDueAmountOnClick`، `save`، `exportToExcelAllocations`.
- وحدة `tenant.views.crs.accounting.journal.viewModal`: `getlocalDateTime`، `rounding`، `formatNumber`، `roundingforView`، `currencyAndRoundingWithThree`، `getVoucherType`، `cancel`.
- وحدة `tenant.views.crs.contacts.createOrEditModal`: `localize`، `removeExternalIdRow`، `addExternalIdRow`، `getContactExternalType`، `isContactExternalType`، `getlocalDate`، `getlocalDateTime`، `getCardType`، `removeRow`، `searchSalesPersons`، `searchUsersWithDesignation`، `searchSalesPersonPopoup`، `salesPersonSelected`، `searchDebtCollectorPopoup`، `searchCustomLookup`، `getCustomLookups`، `scanDocument`، `openUploadDocument`، `openUploadPicture`، `addCreditCardRow`، `updateCreditCardRow`، `save`، `cancel`، `isPersonVerifiedChange`، `doesIdentityDoucmentExist`، `addIndentityDocument`، `getIdentificationDocumentType`، `removeIndentityDocument`، `removeDoc`، `isFieldMondatory`، `searchCountries`، `emiratesDataReader`، `emiratesDataFieldManager`، `getTariffCards`، `getTariffCardForContact`، `isDocument`، `maskCreditCard`، `getAdvanceSettings`، `getHighLightBlackListCountries`، `getNationalIdFormates`، `nationalIdFormate`، `onOverRideChange`، `resetDocumentNo`، `nationIdMaskInput`، `handleResidenceStatusChange`.
- وحدة `tenant.views.crs.vouchers.creditNotes.uploadDocumentsModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.crs.vouchers.creditNotes.allocatedNowForOpeningBalanceModal`: `searchAccounts`، `rounding`، `sumAmount`، `searchRentalOrLeaseAgreement`، `cancel`، `localize`، `addRow`، `removeRow`، `save`.
- وحدة `tenant.views.crs.vouchers.creditNotes.allocatedNowOnChargesTypeModal`: `cancel`، `saveAllocateCharges`، `rounding`، `changeAllocateAmount`.
- وحدة `tenant.views.crs.vouchers.creditNotes.searchAllocations`: `localize`، `rounding`، `getlocalDateTime`، `dateRangeModelChange`، `cancel`، `search`.
- وحدة `tenant.views.crs.contacts.uploadDocumentModal`: `save`، `cancel`.
- وحدة `tenant.views.crs.contacts.uploadDocumentModal`: `save`، `cancel`.
- وحدة `tenant.views.common.documents.uploadDocumentModal`: `uploadHeader`، `uploader.onBeforeUploadItem`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.common.documents.uploadImageModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.common.documents.addCreditCardModal`: `ab`، `cardNumberChanged`، `save`، `cancel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.commonLookup.searchUsers` | POST | api/services/app/commonLookup/SearchUsers | [المصدر](../../../raw/application.js#L332294) |
| `abp.services.app.directory.searchSalesPerson` | POST | api/services/app/directory/SearchSalesPerson | [المصدر](../../../raw/application.js#L332301) |
| `abp.services.app.directory.search` | POST | api/services/app/directory/Search | [المصدر](../../../raw/application.js#L182771) |
| `abp.services.app.creditNote.exportToExcel` | POST | api/services/app/creditNote/ExportToExcel | [المصدر](../../../raw/application.js#L332629) |
| `abp.services.app.creditNote.exportToExcel2` | POST | api/services/app/creditNote/ExportToExcel2 | [المصدر](../../../raw/application.js#L332650) |
| `abp.services.app.creditNote.approveCreditNotes` | POST | api/services/app/creditNote/ApproveCreditNotes | [المصدر](../../../raw/application.js#L332669) |
| `abp.services.app.creditNote.deleteCreditNote` | POST | api/services/app/creditNote/DeleteCreditNote | [المصدر](../../../raw/application.js#L332749) |
| `abp.services.app.creditNote.voidCreditNote` | POST | api/services/app/creditNote/VoidCreditNote | [المصدر](../../../raw/application.js#L332767) |
| `abp.services.app.commonLookup.getLocationsActiveAndInActive` | POST | api/services/app/commonLookup/GetLocationsActiveAndInActive | [المصدر](../../../raw/application.js#L330173) |
| `abp.services.app.creditNote.getCreditNotes` | POST | api/services/app/creditNote/GetCreditNotes | [المصدر](../../../raw/application.js#L332825) |
| `abp.services.app.creditNote.sendCreditNoteWhatsAppSMSManual` | POST | api/services/app/creditNote/SendCreditNoteWhatsAppSMSManual | [المصدر](../../../raw/application.js#L333030) |
| `abp.services.app.creditNote.sendCreditNoteEmailManual` | POST | api/services/app/creditNote/SendCreditNoteEmailManual | [المصدر](../../../raw/application.js#L333045) |
| `abp.services.app.creditNote.approveCreditNote` | POST | api/services/app/creditNote/ApproveCreditNote | [المصدر](../../../raw/application.js#L333076) |
| `abp.services.app.creditNote.unApproveCreditNote` | POST | api/services/app/creditNote/UnApproveCreditNote | [المصدر](../../../raw/application.js#L333092) |
| `abp.services.app.creditNote.rejectCreditNote` | POST | api/services/app/creditNote/RejectCreditNote | [المصدر](../../../raw/application.js#L333140) |
| `abp.services.app.directory.searchDirectoryPaged` | POST | api/services/app/directory/SearchDirectoryPaged | [المصدر](../../../raw/application.js#L184666) |
| `abp.services.app.commonAgreement.getAllAgreementsOnCustomer` | POST | api/services/app/commonAgreement/GetAllAgreementsOnCustomer | [المصدر](../../../raw/application.js#L331227) |
| `abp.services.app.commonLookup.getVoucherReasons` | POST | api/services/app/commonLookup/GetVoucherReasons | [المصدر](../../../raw/application.js#L332168) |
| `abp.services.app.allocation.getAllocationsForEdit2` | POST | api/services/app/allocation/GetAllocationsForEdit2 | [المصدر](../../../raw/application.js#L330674) |
| `abp.services.app.allocation.getAllocationsForEdit` | POST | api/services/app/allocation/GetAllocationsForEdit | [المصدر](../../../raw/application.js#L319750) |
| `abp.services.app.commonLookup.getLocations` | POST | api/services/app/commonLookup/GetLocations | [المصدر](../../../raw/application.js#L182597) |
| `abp.services.app.creditNote.createOrUpdateCreditNote` | POST | api/services/app/creditNote/CreateOrUpdateCreditNote | [المصدر](../../../raw/application.js#L330251) |
| `abp.services.app.creditNote.getCreditNoteForEdit` | POST | api/services/app/creditNote/GetCreditNoteForEdit | [المصدر](../../../raw/application.js#L331792) |
| `abp.services.app.commonAgreement.getAgreement` | POST | api/services/app/commonAgreement/GetAgreement | [المصدر](../../../raw/application.js#L331843) |
| `abp.services.app.creditNote.getCreditNoteOnDeliveryForView` | POST | api/services/app/creditNote/GetCreditNoteOnDeliveryForView | [المصدر](../../../raw/application.js#L334355) |
| `abp.services.app.agreement.searchAgreementForVoucherLines` | POST | api/services/app/agreement/SearchAgreementForVoucherLines | [المصدر](../../../raw/application.js#L331036) |
| `abp.services.app.job.searchJobs` | POST | api/services/app/job/SearchJobs | [المصدر](../../../raw/application.js#L331336) |
| `abp.services.app.directory.searchByContactGroup` | POST | api/services/app/directory/SearchByContactGroup | [المصدر](../../../raw/application.js#L332016) |
| `abp.services.app.vehicle.searchVehicles` | POST | api/services/app/vehicle/SearchVehicles | [المصدر](../../../raw/application.js#L331370) |
| `abp.services.app.account.searchAccountsForSubLookUp` | POST | api/services/app/account/SearchAccountsForSubLookUp | [المصدر](../../../raw/application.js#L331407) |
| `abp.services.app.creditNote.createOrUpdateOnAccountCreditNote` | POST | api/services/app/creditNote/CreateOrUpdateOnAccountCreditNote | [المصدر](../../../raw/application.js#L331491) |
| `abp.services.app.commonLookup.getLocationById` | POST | api/services/app/commonLookup/GetLocationById | [المصدر](../../../raw/application.js#L331915) |
| `abp.services.app.creditNote.importFromExcel` | POST | [object Object] | [المصدر](../../../raw/application.js#L331568) |
| `abp.services.app.costCenter.searchCostCenters` | POST | api/services/app/costCenter/SearchCostCenters | [المصدر](../../../raw/application.js#L331778) |
| `abp.services.app.agreementGroup.getAgreementGroups` | POST | api/services/app/agreementGroup/GetAgreementGroups | [المصدر](../../../raw/application.js#L329928) |
| `abp.services.app.allocation.getAllocationsForBulkEdit` | POST | api/services/app/allocation/GetAllocationsForBulkEdit | [المصدر](../../../raw/application.js#L330025) |
| `abp.services.app.commonLookup.searchInvoices` | POST | api/services/app/commonLookup/SearchInvoices | [المصدر](../../../raw/application.js#L332072) |
| `abp.services.app.commonLookup.searchDeliveryNotes` | POST | api/services/app/commonLookup/SearchDeliveryNotes | [المصدر](../../../raw/application.js#L332083) |
| `abp.services.app.commonLookup.getInvoiceHourlyRate` | POST | api/services/app/commonLookup/GetInvoiceHourlyRate | [المصدر](../../../raw/application.js#L332097) |
| `abp.services.app.creditNote.createOrUpdateCreditNoteOnDelivery` | POST | api/services/app/creditNote/CreateOrUpdateCreditNoteOnDelivery | [المصدر](../../../raw/application.js#L332126) |
| `abp.services.app.creditNote.getCreditNoteOnDeliveryForEdit` | POST | api/services/app/creditNote/GetCreditNoteOnDeliveryForEdit | [المصدر](../../../raw/application.js#L332177) |
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
| `abp.services.app.creditNote.getChargesTypeAllocations` | POST | api/services/app/creditNote/GetChargesTypeAllocations | [المصدر](../../../raw/application.js#L329795) |
| `abp.services.app.commonLookup.round` | غير مربوط | غير محسوم | [المصدر](../../../raw/application.js#L333831) |
| `abp.services.app.person.uploadDocumentImage` | POST | api/services/app/person/UploadDocumentImage | [المصدر](../../../raw/application.js#L185476) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.Accounts.Journal`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.CreditNotes.OnAccount.CreateOnAccount`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.CreditNotes.CounterReceivable.CreateCounterReceivable`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.CreditNotes.OnDeliveryNote.CreateOnDeliveryNote`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.CreditNotes.BulkAllocation`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.CreditNotes.OnAccount.EditOnAccount`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.CreditNotes.CounterReceivable.EditCounterReceivable`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.CreditNotes.OnDeliveryNote.EditOnDeliveryNote`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.CreditNotes.OnAccount.ViewOnAccount`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.CreditNotes.OnAccount.ViewCounterReceivable`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.CreditNotes.CounterReceivable.ViewOnDeliveryNote`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.CreditNotes.OnAccount.DeleteOnAccount`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.CreditNotes.CounterReceivable.DeleteCounterReceivable`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.CreditNotes.OnDeliveryNote.DeleteOnDeliveryNote`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.CreditNotes.Approve`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.CreditNotes.CanApproveBranchCreditNotes`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.CreditNotes.UnApprove`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.CreditNotes.Reject`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.CreditNotes.ExportToExcel`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.CreditNotes.Void`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.CreditNotes.View`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.CreditNotes.Print`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Allocations`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.CreditNotes.AllActionsOnOtherBranchCreditNotes`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.CreditNotes.ViewOtherBranchCreditNotes`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Delete`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.AgreementGroups`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Lease.AgreementAdditionalCharges`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.AgreementAdditionalChargesAfterClosing`: غير ممنوحة في السياق الملتقط.
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
| `vm.filters.creditNoteType` | text | creditNoteType | ng-options=creditNote.id as creditNote.name for creditNote in vm.creditNoteTypes |
| `vm.filters.agreementNo` | text |  |  |
| `vm.filters.module` | text | module | ng-options=module.id as module.name for module in vm.modules |
| `vm.dateRangeModel` | text |  | min=vm.dateRangeOptions.min; max=vm.dateRangeOptions.max; ng-disabled=!vm.filters.enableDateRange |
| `vm.filters.enableDateRange` | checkbox | disableDateRange |  |
| `vm.filters.customer` | ui-select |  |  |
| `vm.filters.locationId` | select | locationId |  |
| `vm.filters.approvedType` | text | creditNoteType | ng-options=approvedType.id as approvedType.name for approvedType in vm.approvedTypes |
| `vm.filters.createdBy` | ui-select |  |  |
| `vm.filters.salesPerson` | ui-select |  |  |
| `vm.filters.salesPerson` | select | salePerson | ng-options=status as status.name for status in vm.userList |
| `vm.filters.approvedBy` | ui-select |  |  |
| `vm.filters.voidedOnly` | checkbox | voidedOnly |  |
| `vm.filters.printingWithoutLogo` | checkbox | printingWithoutLogo |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
