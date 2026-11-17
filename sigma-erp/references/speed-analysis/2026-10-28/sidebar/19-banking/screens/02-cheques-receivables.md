# شاشة: Cheques Receivables

المسار في القائمة: Banking ← Cheques Receivables.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_chequesReceivables`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0456](../../../readable/routes/R0456--tenant-crs-chequesreceivables.js)، والأصل [raw/application.js:4906](../../../raw/application.js#L4906).
- قالب الشاشة: `~/App/tenant/views/crs/banking/chequesReceivables/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.banking.chequesReceivables.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.banking.chequesReceivables.index](../../../readable/controllers/C0631--tenant.views.crs.banking.chequesReceivables.index.js) | 25 | 7 |
| [tenant.views.crs.banking.chequesReceivables.addBulkCheckReceivable](../../../readable/controllers/C0625--tenant.views.crs.banking.chequesReceivables.addBulkCheckReceivable.js) | 4 | 1 |
| [tenant.views.crs.contacts.searchContactModal](../../../readable/controllers/C0706--tenant.views.crs.contacts.searchContactModal.js) | 7 | 2 |
| [tenant.views.crs.banking.chequesReceivables.matureChequeModal](../../../readable/controllers/C0632--tenant.views.crs.banking.chequesReceivables.matureChequeModal.js) | 4 | 3 |
| [tenant.views.crs.banking.chequesReceivables.returnChequeModal](../../../readable/controllers/C0638--tenant.views.crs.banking.chequesReceivables.returnChequeModal.js) | 4 | 2 |
| [tenant.views.crs.banking.chequesReceivables.bounceChequeModal](../../../readable/controllers/C0626--tenant.views.crs.banking.chequesReceivables.bounceChequeModal.js) | 3 | 1 |
| [common.views.common.reportViewer](../../../readable/controllers/C0006--common.views.common.reportViewer.js) | 2 | 0 |
| [tenant.views.crs.banking.ChequesReceivables.printtemplates.printPreview](../../../readable/controllers/C0640--tenant.views.crs.banking.ChequesReceivables.printtemplates.printPreview.js) | 2 | 0 |
| [tenant.views.crs.banking.chequesReceivables.maturePendingCheque](../../../readable/controllers/C0633--tenant.views.crs.banking.chequesReceivables.maturePendingCheque.js) | 5 | 3 |
| [tenant.views.crs.banking.chequesReceivables.bulkConvertPdcToCdc](../../../readable/controllers/C0627--tenant.views.crs.banking.chequesReceivables.bulkConvertPdcToCdc.js) | 6 | 0 |
| [tenant.views.crs.banking.chequesReceivables.convertToCdcModal](../../../readable/controllers/C0629--tenant.views.crs.banking.chequesReceivables.convertToCdcModal.js) | 3 | 0 |
| [tenant.views.crs.banking.chequesReceivables.convertToCdcModal](../../../readable/controllers/C0630--tenant.views.crs.banking.chequesReceivables.convertToCdcModal.js) | 3 | 0 |
| [tenant.views.crs.banking.chequesReceivables.resubmitChequeModal](../../../readable/controllers/C0637--tenant.views.crs.banking.chequesReceivables.resubmitChequeModal.js) | 3 | 1 |
| [tenant.views.crs.banking.chequesReceivables.pdcReceivableModal](../../../readable/controllers/C0634--tenant.views.crs.banking.chequesReceivables.pdcReceivableModal.js) | 8 | 7 |
| [tenant.views.crs.banking.chequesReceivables.bulkPdcReceivableModal](../../../readable/controllers/C0628--tenant.views.crs.banking.chequesReceivables.bulkPdcReceivableModal.js) | 10 | 6 |
| [tenant.views.crs.contacts.createOrEditModal](../../../readable/controllers/C0703--tenant.views.crs.contacts.createOrEditModal.js) | 45 | 24 |
| [tenant.views.crs.contacts.uploadDocumentModal](../../../readable/controllers/C0699--tenant.views.crs.contacts.uploadDocumentModal.js) | 2 | 1 |
| [tenant.views.crs.contacts.uploadDocumentModal](../../../readable/controllers/C0711--tenant.views.crs.contacts.uploadDocumentModal.js) | 2 | 1 |
| [tenant.views.common.documents.uploadDocumentModal](../../../readable/controllers/C0362--tenant.views.common.documents.uploadDocumentModal.js) | 4 | 0 |
| [tenant.views.common.documents.uploadImageModal](../../../readable/controllers/C0363--tenant.views.common.documents.uploadImageModal.js) | 3 | 0 |
| [tenant.views.common.documents.addCreditCardModal](../../../readable/controllers/C0701--tenant.views.common.documents.addCreditCardModal.js) | 4 | 0 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.banking.chequesReceivables.index`: `printAll`، `addPdcReceivableBulk`، `dateRangeModelChanged`، `locationPermission`، `searchCustomers`، `searchCustomerPopoup`، `getlocalDateTime`، `matureCheque`، `returnCheque`، `bounceCheque`، `getChequeStatus`، `clearCustomer`، `getChequesReceivables`، `enterKeyPress`، `getReportUrl`، `report`، `ChequeReceivablePrintModal`، `getMaturePendingCheques`، `bulkConvertPdcToCdc`، `convertToCdc`، `resubmitCheque`، `addOrEditPdcReceivable`، `addOrEditBulkPdcReceivable`، `deletePdcReceivable`، `exportToExcel`.
- وحدة `tenant.views.crs.banking.chequesReceivables.addBulkCheckReceivable`: `refresh`، `getlocalDate`، `cancel`، `importData`.
- وحدة `tenant.views.crs.contacts.searchContactModal`: `searchContacts`، `cancel`، `showAddContact`، `contactSelected`، `contactEdit`، `getContactsList`، `getNameWithCode`.
- وحدة `tenant.views.crs.banking.chequesReceivables.matureChequeModal`: `getlocalDateTime`، `save`، `matureChequePdc`، `cancel`.
- وحدة `tenant.views.crs.banking.chequesReceivables.returnChequeModal`: `getlocalDateTime`، `save`، `returnChequePdc`، `cancel`.
- وحدة `tenant.views.crs.banking.chequesReceivables.bounceChequeModal`: `getlocalDateTime`، `save`، `cancel`.
- وحدة `common.views.common.reportViewer`: `exportToExcelFromReport`، `cancel`.
- وحدة `tenant.views.crs.banking.ChequesReceivables.printtemplates.printPreview`: `cancel`، `getTemplateUrl`.
- وحدة `tenant.views.crs.banking.chequesReceivables.maturePendingCheque`: `getlocalDateTime`، `allBoxTicked`، `getChequesReceivables`، `save`، `cancel`.
- وحدة `tenant.views.crs.banking.chequesReceivables.bulkConvertPdcToCdc`: `getCheque`، `getlocalDateTime`، `hasSelection`، `toggleAll`، `cancel`، `save`.
- وحدة `tenant.views.crs.banking.chequesReceivables.convertToCdcModal`: `isDateValid`، `save`، `cancel`.
- وحدة `tenant.views.crs.banking.chequesReceivables.convertToCdcModal`: `isDateValid`، `save`، `cancel`.
- وحدة `tenant.views.crs.banking.chequesReceivables.resubmitChequeModal`: `getlocalDateTime`، `save`، `cancel`.
- وحدة `tenant.views.crs.banking.chequesReceivables.pdcReceivableModal`: `getlocalDateTime`، `searchCustomers`، `searchAgreements`، `onAgreementCheckBox`، `onAgreementSelection`، `searchCustomerPopoup`، `save`، `cancel`.
- وحدة `tenant.views.crs.banking.chequesReceivables.bulkPdcReceivableModal`: `getlocalDateTime`، `onAgreementCheckBox`، `onAgreementSelection`، `searchCustomers`، `onCustomerChange`، `searchAgreements`، `searchCustomerPopoup`، `preparePdcRows`، `save`، `cancel`.
- وحدة `tenant.views.crs.contacts.createOrEditModal`: `localize`، `removeExternalIdRow`، `addExternalIdRow`، `getContactExternalType`، `isContactExternalType`، `getlocalDate`، `getlocalDateTime`، `getCardType`، `removeRow`، `searchSalesPersons`، `searchUsersWithDesignation`، `searchSalesPersonPopoup`، `salesPersonSelected`، `searchDebtCollectorPopoup`، `searchCustomLookup`، `getCustomLookups`، `scanDocument`، `openUploadDocument`، `openUploadPicture`، `addCreditCardRow`، `updateCreditCardRow`، `save`، `cancel`، `isPersonVerifiedChange`، `doesIdentityDoucmentExist`، `addIndentityDocument`، `getIdentificationDocumentType`، `removeIndentityDocument`، `removeDoc`، `isFieldMondatory`، `searchCountries`، `emiratesDataReader`، `emiratesDataFieldManager`، `getTariffCards`، `getTariffCardForContact`، `isDocument`، `maskCreditCard`، `getAdvanceSettings`، `getHighLightBlackListCountries`، `getNationalIdFormates`، `nationalIdFormate`، `onOverRideChange`، `resetDocumentNo`، `nationIdMaskInput`، `handleResidenceStatusChange`.
- وحدة `tenant.views.crs.contacts.uploadDocumentModal`: `save`، `cancel`.
- وحدة `tenant.views.crs.contacts.uploadDocumentModal`: `save`، `cancel`.
- وحدة `tenant.views.common.documents.uploadDocumentModal`: `uploadHeader`، `uploader.onBeforeUploadItem`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.common.documents.uploadImageModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.common.documents.addCreditCardModal`: `ab`، `cardNumberChanged`، `save`، `cancel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.commonLookup.getLocationsActiveAndInActive` | POST | api/services/app/commonLookup/GetLocationsActiveAndInActive | [المصدر](../../../raw/application.js#L167542) |
| `abp.services.app.directory.search` | POST | api/services/app/directory/Search | [المصدر](../../../raw/application.js#L182771) |
| `abp.services.app.chequesReceivables.getChequesReceivables` | POST | api/services/app/chequesReceivables/GetChequesReceivables | [المصدر](../../../raw/application.js#L168223) |
| `abp.services.app.chequesReceivables.convertToCdc` | POST | api/services/app/chequesReceivables/ConvertToCdc | [المصدر](../../../raw/application.js#L167974) |
| `abp.services.app.chequesReceivables.deletePdcReceivable` | POST | api/services/app/chequesReceivables/DeletePdcReceivable | [المصدر](../../../raw/application.js#L168038) |
| `abp.services.app.chequesReceivables.exportToExcel` | POST | api/services/app/chequesReceivables/ExportToExcel | [المصدر](../../../raw/application.js#L168060) |
| `abp.services.app.chequesReceivables.importPdcReceivableData` | POST | api/services/app/chequesReceivables/ImportPdcReceivableData | [المصدر](../../../raw/application.js#L166976) |
| `abp.services.app.directory.searchDirectoryPaged` | POST | api/services/app/directory/SearchDirectoryPaged | [المصدر](../../../raw/application.js#L184666) |
| `abp.services.app.chequesReceivables.matureCheque` | POST | api/services/app/chequesReceivables/MatureCheque | [المصدر](../../../raw/application.js#L168114) |
| `abp.services.app.chequesReceivables.matureChequePdc` | POST | api/services/app/chequesReceivables/MatureChequePdc | [المصدر](../../../raw/application.js#L168134) |
| `abp.services.app.bankAccount.getBankAccountsForSelection` | POST | api/services/app/bankAccount/GetBankAccountsForSelection | [المصدر](../../../raw/application.js#L167365) |
| `abp.services.app.chequesReceivables.returnCheque` | POST | api/services/app/chequesReceivables/ReturnCheque | [المصدر](../../../raw/application.js#L168657) |
| `abp.services.app.chequesReceivables.returnChequePdc` | POST | api/services/app/chequesReceivables/ReturnChequePdc | [المصدر](../../../raw/application.js#L168671) |
| `abp.services.app.chequesReceivables.bounceCheque` | POST | api/services/app/chequesReceivables/BounceCheque | [المصدر](../../../raw/application.js#L167071) |
| `abp.services.app.chequesReceivables.pendingMatureCheque` | POST | api/services/app/chequesReceivables/PendingMatureCheque | [المصدر](../../../raw/application.js#L168245) |
| `abp.services.app.chequesReceivables.resubmitCheque` | POST | api/services/app/chequesReceivables/ResubmitCheque | [المصدر](../../../raw/application.js#L168609) |
| `abp.services.app.commonAgreement.searchAgreementsByAgreementNo` | POST | api/services/app/commonAgreement/SearchAgreementsByAgreementNo | [المصدر](../../../raw/application.js#L167254) |
| `abp.services.app.chequesReceivables.updatePdcReceivable` | POST | api/services/app/chequesReceivables/UpdatePdcReceivable | [المصدر](../../../raw/application.js#L168369) |
| `abp.services.app.chequesReceivables.createOrUpdatePdcReceivable` | POST | api/services/app/chequesReceivables/CreateOrUpdatePdcReceivable | [المصدر](../../../raw/application.js#L168373) |
| `abp.services.app.billingMethod.getBillingMethods` | POST | api/services/app/billingMethod/GetBillingMethods | [المصدر](../../../raw/application.js#L167374) |
| `abp.services.app.chequesReceivables.getPdcReceivableForEdit` | POST | api/services/app/chequesReceivables/GetPdcReceivableForEdit | [المصدر](../../../raw/application.js#L167386) |
| `abp.services.app.chequesReceivables.createBulkPdcReceivables` | POST | api/services/app/chequesReceivables/CreateBulkPdcReceivables | [المصدر](../../../raw/application.js#L167349) |
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

- صلاحية `Pages.Tenant.Banking.ChequesReceivables.EditNonFinancialPDC`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Banking.ChequesReceivables.DeleteNonFinancialPDC`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Banking.ChequesReceivables.ResubmitCheque`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Banking.ChequesReceivables.BulkConvertPdcToCdc`: غير ممنوحة في السياق الملتقط.
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
| `vm.filters.type` | select | type | ng-options=chequeType.id as chequeType.name for chequeType in vm.chequeTypes |
| `vm.dateRangeModel` | text |  | min=vm.dateRangeOptions.min; max=vm.dateRangeOptions.max; ng-disabled=!vm.filters.enableDateRange |
| `vm.filters.enableDateRange` | checkbox | disableDateRange |  |
| `vm.filters.dateTimeType` | radio | chequeDate |  |
| `vm.filters.dateTimeType` | radio | creationDate |  |
| `vm.filters.customer` | ui-select |  |  |
| `vm.filters.locationId` | select | locationId |  |
| `vm.filters.agreementNo` | text |  |  |
| `vm.filters.batchNo` | text |  |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
