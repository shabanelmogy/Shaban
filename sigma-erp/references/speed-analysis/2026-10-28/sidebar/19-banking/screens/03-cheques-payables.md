# شاشة: Cheques Payables

المسار في القائمة: Banking ← Cheques Payables.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_chequesPayables`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0458](../../../readable/routes/R0458--tenant-crs-chequespayables.js)، والأصل [raw/application.js:4918](../../../raw/application.js#L4918).
- قالب الشاشة: `~/App/tenant/views/crs/banking/chequesPayables/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.banking.chequesPayables.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.banking.chequesPayables.index](../../../readable/controllers/C0617--tenant.views.crs.banking.chequesPayables.index.js) | 24 | 8 |
| [tenant.views.crs.contacts.searchContactModal](../../../readable/controllers/C0706--tenant.views.crs.contacts.searchContactModal.js) | 7 | 2 |
| [tenant.views.crs.banking.chequesPayables.matureChequeModal](../../../readable/controllers/C0618--tenant.views.crs.banking.chequesPayables.matureChequeModal.js) | 3 | 2 |
| [tenant.views.crs.banking.chequesPayables.cancelChequeModal](../../../readable/controllers/C0614--tenant.views.crs.banking.chequesPayables.cancelChequeModal.js) | 3 | 1 |
| [tenant.views.crs.banking.chequesPayables.maturePendingPayableCheque](../../../readable/controllers/C0619--tenant.views.crs.banking.chequesPayables.maturePendingPayableCheque.js) | 5 | 3 |
| [tenant.views.crs.banking.chequesReceivables.bulkConvertPdcToCdc](../../../readable/controllers/C0627--tenant.views.crs.banking.chequesReceivables.bulkConvertPdcToCdc.js) | 6 | 0 |
| [tenant.views.crs.banking.chequesPayables.printtemplates.printPreview](../../../readable/controllers/C0624--tenant.views.crs.banking.chequesPayables.printtemplates.printPreview.js) | 2 | 0 |
| [tenant.views.crs.banking.chequesPayables.pdcPayableModal](../../../readable/controllers/C0620--tenant.views.crs.banking.chequesPayables.pdcPayableModal.js) | 5 | 6 |
| [tenant.views.crs.banking.chequesPayables.addBulkCheckPayable](../../../readable/controllers/C0613--tenant.views.crs.banking.chequesPayables.addBulkCheckPayable.js) | 4 | 1 |
| [tenant.views.crs.banking.chequesReceivables.convertToCdcModal](../../../readable/controllers/C0629--tenant.views.crs.banking.chequesReceivables.convertToCdcModal.js) | 3 | 0 |
| [tenant.views.crs.banking.chequesReceivables.convertToCdcModal](../../../readable/controllers/C0630--tenant.views.crs.banking.chequesReceivables.convertToCdcModal.js) | 3 | 0 |
| [common.views.common.reportViewer](../../../readable/controllers/C0006--common.views.common.reportViewer.js) | 2 | 0 |
| [tenant.views.crs.banking.chequesPayables.createOrEditChequeBatchModal](../../../readable/controllers/C0616--tenant.views.crs.banking.chequesPayables.createOrEditChequeBatchModal.js) | 13 | 5 |
| [tenant.views.crs.contacts.createOrEditModal](../../../readable/controllers/C0703--tenant.views.crs.contacts.createOrEditModal.js) | 45 | 24 |
| [tenant.views.crs.contacts.uploadDocumentModal](../../../readable/controllers/C0699--tenant.views.crs.contacts.uploadDocumentModal.js) | 2 | 1 |
| [tenant.views.crs.contacts.uploadDocumentModal](../../../readable/controllers/C0711--tenant.views.crs.contacts.uploadDocumentModal.js) | 2 | 1 |
| [tenant.views.common.documents.uploadDocumentModal](../../../readable/controllers/C0362--tenant.views.common.documents.uploadDocumentModal.js) | 4 | 0 |
| [tenant.views.common.documents.uploadImageModal](../../../readable/controllers/C0363--tenant.views.common.documents.uploadImageModal.js) | 3 | 0 |
| [tenant.views.common.documents.addCreditCardModal](../../../readable/controllers/C0701--tenant.views.common.documents.addCreditCardModal.js) | 4 | 0 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.banking.chequesPayables.index`: `printAll`، `dateRangeModelChanged`، `locationPermission`، `searchCustomers`، `searchCustomerPopoup`، `getlocalDateTime`، `getChequeStatus`، `clearCustomer`، `getChequesPayables`، `getReportUrl`، `matureCheque`، `cancelCheque`، `enterKeyPress`، `getMaturePendingPayableCheques`، `bulkConvertPdcToCdc`، `getBankName`، `printCheque`، `addPdcPayable`، `addPdcPayableBulk`، `deletePdcPayable`، `convertToCdc`، `exportToExcel`، `report`، `addChequeBatch`.
- وحدة `tenant.views.crs.contacts.searchContactModal`: `searchContacts`، `cancel`، `showAddContact`، `contactSelected`، `contactEdit`، `getContactsList`، `getNameWithCode`.
- وحدة `tenant.views.crs.banking.chequesPayables.matureChequeModal`: `getlocalDateTime`، `save`، `cancel`.
- وحدة `tenant.views.crs.banking.chequesPayables.cancelChequeModal`: `cancel`، `getlocalDateTime`، `save`.
- وحدة `tenant.views.crs.banking.chequesPayables.maturePendingPayableCheque`: `getlocalDateTime`، `allBoxTicked`، `getChequesPayables`، `save`، `cancel`.
- وحدة `tenant.views.crs.banking.chequesReceivables.bulkConvertPdcToCdc`: `getCheque`، `getlocalDateTime`، `hasSelection`، `toggleAll`، `cancel`، `save`.
- وحدة `tenant.views.crs.banking.chequesPayables.printtemplates.printPreview`: `cancel`، `getTemplateUrl`.
- وحدة `tenant.views.crs.banking.chequesPayables.pdcPayableModal`: `getlocalDateTime`، `searchCustomers`، `searchCustomerPopoup`، `save`، `cancel`.
- وحدة `tenant.views.crs.banking.chequesPayables.addBulkCheckPayable`: `refresh`، `getlocalDate`، `cancel`، `importData`.
- وحدة `tenant.views.crs.banking.chequesReceivables.convertToCdcModal`: `isDateValid`، `save`، `cancel`.
- وحدة `tenant.views.crs.banking.chequesReceivables.convertToCdcModal`: `isDateValid`، `save`، `cancel`.
- وحدة `common.views.common.reportViewer`: `exportToExcelFromReport`، `cancel`.
- وحدة `tenant.views.crs.banking.chequesPayables.createOrEditChequeBatchModal`: `searchCustomers`، `searchSupplierPopoup`، `onFirstChequeNoChanged`، `onFirstAmountChanged`، `onFirstBankAccountChanged`، `onFirstBillingMethodChanged`، `onDateChanged`، `onNoOfChequesChanged`، `addRow`، `removeRow`، `getTotalAmount`، `save`، `cancel`.
- وحدة `tenant.views.crs.contacts.createOrEditModal`: `localize`، `removeExternalIdRow`، `addExternalIdRow`، `getContactExternalType`، `isContactExternalType`، `getlocalDate`، `getlocalDateTime`، `getCardType`، `removeRow`، `searchSalesPersons`، `searchUsersWithDesignation`، `searchSalesPersonPopoup`، `salesPersonSelected`، `searchDebtCollectorPopoup`، `searchCustomLookup`، `getCustomLookups`، `scanDocument`، `openUploadDocument`، `openUploadPicture`، `addCreditCardRow`، `updateCreditCardRow`، `save`، `cancel`، `isPersonVerifiedChange`، `doesIdentityDoucmentExist`، `addIndentityDocument`، `getIdentificationDocumentType`، `removeIndentityDocument`، `removeDoc`، `isFieldMondatory`، `searchCountries`، `emiratesDataReader`، `emiratesDataFieldManager`، `getTariffCards`، `getTariffCardForContact`، `isDocument`، `maskCreditCard`، `getAdvanceSettings`، `getHighLightBlackListCountries`، `getNationalIdFormates`، `nationalIdFormate`، `onOverRideChange`، `resetDocumentNo`، `nationIdMaskInput`، `handleResidenceStatusChange`.
- وحدة `tenant.views.crs.contacts.uploadDocumentModal`: `save`، `cancel`.
- وحدة `tenant.views.crs.contacts.uploadDocumentModal`: `save`، `cancel`.
- وحدة `tenant.views.common.documents.uploadDocumentModal`: `uploadHeader`، `uploader.onBeforeUploadItem`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.common.documents.uploadImageModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.common.documents.addCreditCardModal`: `ab`، `cardNumberChanged`، `save`، `cancel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.commonLookup.getLocationsActiveAndInActive` | POST | api/services/app/commonLookup/GetLocationsActiveAndInActive | [المصدر](../../../raw/application.js#L165569) |
| `abp.services.app.directory.search` | POST | api/services/app/directory/Search | [المصدر](../../../raw/application.js#L182771) |
| `abp.services.app.chequesPayables.getChequesPayables` | POST | api/services/app/chequesPayables/GetChequesPayables | [المصدر](../../../raw/application.js#L166194) |
| `abp.services.app.chequesPayables.deletePdcPayable` | POST | api/services/app/chequesPayables/DeletePdcPayable | [المصدر](../../../raw/application.js#L165954) |
| `abp.services.app.chequesPayables.convertToCdc` | POST | api/services/app/chequesPayables/ConvertToCdc | [المصدر](../../../raw/application.js#L165984) |
| `abp.services.app.chequesPayables.exportToExcel` | POST | api/services/app/chequesPayables/ExportToExcel | [المصدر](../../../raw/application.js#L166005) |
| `abp.services.app.billingMethod.getBillingMethods` | POST | api/services/app/billingMethod/GetBillingMethods | [المصدر](../../../raw/application.js#L165435) |
| `abp.services.app.directory.searchDirectoryPaged` | POST | api/services/app/directory/SearchDirectoryPaged | [المصدر](../../../raw/application.js#L184666) |
| `abp.services.app.chequesPayables.matureCheque` | POST | api/services/app/chequesPayables/MatureCheque | [المصدر](../../../raw/application.js#L166099) |
| `abp.services.app.bankAccount.getBankAccountsForSelection` | POST | api/services/app/bankAccount/GetBankAccountsForSelection | [المصدر](../../../raw/application.js#L165426) |
| `abp.services.app.chequesPayables.cancelCheque` | POST | api/services/app/chequesPayables/CancelCheque | [المصدر](../../../raw/application.js#L165180) |
| `abp.services.app.chequesPayables.pendingMatureCheque` | POST | api/services/app/chequesPayables/PendingMatureCheque | [المصدر](../../../raw/application.js#L166218) |
| `abp.services.app.chequesPayables.updatePdcPayable` | POST | api/services/app/chequesPayables/UpdatePdcPayable | [المصدر](../../../raw/application.js#L166319) |
| `abp.services.app.chequesPayables.createOrUpdatePdcPayable` | POST | api/services/app/chequesPayables/CreateOrUpdatePdcPayable | [المصدر](../../../raw/application.js#L166328) |
| `abp.services.app.chequesPayables.getPdcPayableForEdit` | POST | api/services/app/chequesPayables/GetPdcPayableForEdit | [المصدر](../../../raw/application.js#L166365) |
| `abp.services.app.chequesPayables.importPdcPayableData` | POST | api/services/app/chequesPayables/ImportPdcPayableData | [المصدر](../../../raw/application.js#L165087) |
| `abp.services.app.chequesPayables.getChequeBatchForEdit` | غير مربوط | غير محسوم | [المصدر](../../../raw/application.js#L165446) |
| `abp.services.app.chequesPayables.createOrUpdateChequeBatch` | POST | api/services/app/chequesPayables/CreateOrUpdateChequeBatch | [المصدر](../../../raw/application.js#L165477) |
| `abp.services.app.chargesSetting.getChargesTypes` | POST | api/services/app/chargesSetting/GetChargesTypes | [المصدر](../../../raw/application.js#L182581) |
| `abp.services.app.commonLookup.getLocations` | POST | api/services/app/commonLookup/GetLocations | [المصدر](../../../raw/application.js#L182597) |
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
| `abp.services.app.person.uploadDocumentImage` | POST | api/services/app/person/UploadDocumentImage | [المصدر](../../../raw/application.js#L185476) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.Banking.ChequesPayables.EditNonFinancialPDC`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Banking.ChequesPayables.DeleteNonFinancialPDC`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Banking.ChequesPayables.BulkConvertPdcToCdc`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Delete`: ممنوحة في السياق الملتقط.
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
| `vm.filters.chequeNo` | text |  |  |
| `vm.filters.status` | select | status | ng-options=item.id as item.status for item in vm.chequeStatus |
| `vm.filters.billingMethodId` | select |  | ng-options=billingMethod.id as billingMethod.name for billingMethod in vm.billingMethods |
| `vm.dateRangeModel` | text |  | min=vm.dateRangeOptions.min; max=vm.dateRangeOptions.max; ng-disabled=!vm.filters.enableDateRange |
| `vm.filters.enableDateRange` | checkbox | disableDateRange |  |
| `vm.filters.dateTimeType` | radio | chequeDate |  |
| `vm.filters.dateTimeType` | radio | creationDate |  |
| `vm.filters.customer` | ui-select |  |  |
| `vm.filters.locationId` | select | locationId |  |
| `vm.filters.batchNo` | text |  |  |
| `vm.filters.refNo` | text |  |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
