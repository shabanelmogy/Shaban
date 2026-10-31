# شاشة: Statement of Account

المسار في القائمة: Suppliers ← Statement of Account.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_supplierStatementOfAccounts`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0387](../../../readable/routes/R0387--tenant-crs-supplierstatementofaccounts.js)، والأصل [raw/application.js:4331](../../../raw/application.js#L4331).
- قالب الشاشة: `~/App/tenant/views/crs/reports/statementOfAccounts/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.reports.statementOfAccounts.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.reports.statementOfAccounts.index](../../../readable/controllers/C1066--tenant.views.crs.reports.statementOfAccounts.index.js) | 32 | 19 |
| [tenant.views.crs.contacts.searchInActiveContactModal](../../../readable/controllers/C0709--tenant.views.crs.contacts.searchInActiveContactModal.js) | 7 | 2 |
| [tenant.views.crs.reports.statementOfAccounts.printtemplates.printPreview](../../../readable/controllers/C1070--tenant.views.crs.reports.statementOfAccounts.printtemplates.printPreview.js) | 2 | 0 |
| [tenant.views.crs.vouchers.allocations.createAllocation](../../../readable/controllers/C1220--tenant.views.crs.vouchers.allocations.createAllocation.js) | 11 | 3 |
| [tenant.views.crs.vouchers.allocations.createAllocation2](../../../readable/controllers/C1221--tenant.views.crs.vouchers.allocations.createAllocation2.js) | 12 | 6 |
| [tenant.views.crs.contacts.createOrEditModal](../../../readable/controllers/C0703--tenant.views.crs.contacts.createOrEditModal.js) | 45 | 24 |
| [tenant.views.crs.contacts.searchContactModal](../../../readable/controllers/C0706--tenant.views.crs.contacts.searchContactModal.js) | 7 | 2 |
| [tenant.views.crs.contacts.uploadDocumentModal](../../../readable/controllers/C0699--tenant.views.crs.contacts.uploadDocumentModal.js) | 2 | 1 |
| [tenant.views.crs.contacts.uploadDocumentModal](../../../readable/controllers/C0711--tenant.views.crs.contacts.uploadDocumentModal.js) | 2 | 1 |
| [tenant.views.common.documents.uploadDocumentModal](../../../readable/controllers/C0362--tenant.views.common.documents.uploadDocumentModal.js) | 4 | 0 |
| [tenant.views.common.documents.uploadImageModal](../../../readable/controllers/C0363--tenant.views.common.documents.uploadImageModal.js) | 3 | 0 |
| [tenant.views.common.documents.addCreditCardModal](../../../readable/controllers/C0701--tenant.views.common.documents.addCreditCardModal.js) | 4 | 0 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.reports.statementOfAccounts.index`: `rounding`، `formatBalance`، `filterAgreements`، `dateRangeModelChanged`، `radioButtonValueChanged`، `getContactType`، `getlocalDate`، `getlocalDateNew`، `getVoucherType`، `searchCustomers`، `onCustomerSelect`، `onAgreementSelect`، `clearAgreementFilter`، `searchCustomerPopoup`، `CurrencyFormate`، `formatBalanceAsDrCr`، `getdebitAndCredit`، `getReceivableAgeAnalysisReport`، `getPayableAgeAnalysisReport`، `getStatementOfAccounts`، `getTypeById`، `localize`، `getDepositsOnCustomerData`، `getPendingPdcs`، `getAdvanceTaxInvoice`، `contactGroupStaffFilter`، `exportToExcel`، `exportToExcelChargesTypewise`، `emailStatementOfAccount`، `whatsAppSmsStatementOfAccount`، `StatementOfAccountPrintModal`، `createAllocation`.
- وحدة `tenant.views.crs.contacts.searchInActiveContactModal`: `searchContacts`، `cancel`، `showAddContact`، `contactSelected`، `contactEdit`، `getContactsList`، `getNameWithCode`.
- وحدة `tenant.views.crs.reports.statementOfAccounts.printtemplates.printPreview`: `cancel`، `getTemplateUrl`.
- وحدة `tenant.views.crs.vouchers.allocations.createAllocation`: `refresh`، `exportToExcel`، `importResult`، `cancel`، `localize`، `rounding`، `sumAmount`، `getlocalDateTime`، `insertDueAmountOnClick`، `save`، `exportToExcelAllocations`.
- وحدة `tenant.views.crs.vouchers.allocations.createAllocation2`: `cancel`، `localize`، `rounding`، `sumAmount`، `getlocalDateTime`، `insertDueAmountOnClick`، `addAgreement`، `searchRentalOrLeaseAgreement`، `addInHeadRow`، `addChargesType`، `isAgreementAllocationAmount`، `save`.
- وحدة `tenant.views.crs.contacts.createOrEditModal`: `localize`، `removeExternalIdRow`، `addExternalIdRow`، `getContactExternalType`، `isContactExternalType`، `getlocalDate`، `getlocalDateTime`، `getCardType`، `removeRow`، `searchSalesPersons`، `searchUsersWithDesignation`، `searchSalesPersonPopoup`، `salesPersonSelected`، `searchDebtCollectorPopoup`، `searchCustomLookup`، `getCustomLookups`، `scanDocument`، `openUploadDocument`، `openUploadPicture`، `addCreditCardRow`، `updateCreditCardRow`، `save`، `cancel`، `isPersonVerifiedChange`، `doesIdentityDoucmentExist`، `addIndentityDocument`، `getIdentificationDocumentType`، `removeIndentityDocument`، `removeDoc`، `isFieldMondatory`، `searchCountries`، `emiratesDataReader`، `emiratesDataFieldManager`، `getTariffCards`، `getTariffCardForContact`، `isDocument`، `maskCreditCard`، `getAdvanceSettings`، `getHighLightBlackListCountries`، `getNationalIdFormates`، `nationalIdFormate`، `onOverRideChange`، `resetDocumentNo`، `nationIdMaskInput`، `handleResidenceStatusChange`.
- وحدة `tenant.views.crs.contacts.searchContactModal`: `searchContacts`، `cancel`، `showAddContact`، `contactSelected`، `contactEdit`، `getContactsList`، `getNameWithCode`.
- وحدة `tenant.views.crs.contacts.uploadDocumentModal`: `save`، `cancel`.
- وحدة `tenant.views.crs.contacts.uploadDocumentModal`: `save`، `cancel`.
- وحدة `tenant.views.common.documents.uploadDocumentModal`: `uploadHeader`، `uploader.onBeforeUploadItem`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.common.documents.uploadImageModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.common.documents.addCreditCardModal`: `ab`، `cardNumberChanged`، `save`، `cancel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.directory.search` | POST | api/services/app/directory/Search | [المصدر](../../../raw/application.js#L182771) |
| `abp.services.app.commonAgreement.getAllAgreementsOnCustomer` | POST | api/services/app/commonAgreement/GetAllAgreementsOnCustomer | [المصدر](../../../raw/application.js#L283842) |
| `abp.services.app.receivableAgeAnalysisReport.getAgeAnalysisReport` | POST | api/services/app/receivableAgeAnalysisReport/GetAgeAnalysisReport | [المصدر](../../../raw/application.js#L283928) |
| `abp.services.app.payableAgeAnalysisReport.getAgeAnalysisReport` | POST | api/services/app/payableAgeAnalysisReport/GetAgeAnalysisReport | [المصدر](../../../raw/application.js#L283938) |
| `abp.services.app.statementOfAccounts.getOutStandingInvoices` | POST | api/services/app/statementOfAccounts/GetOutStandingInvoices | [المصدر](../../../raw/application.js#L283964) |
| `abp.services.app.statementOfAccounts.getBills` | POST | api/services/app/statementOfAccounts/GetBills | [المصدر](../../../raw/application.js#L283998) |
| `abp.services.app.statementOfAccounts.getOutStandings` | POST | api/services/app/statementOfAccounts/GetOutStandings | [المصدر](../../../raw/application.js#L284009) |
| `abp.services.app.statementOfAccounts.getStatementOfAccounts` | POST | api/services/app/statementOfAccounts/GetStatementOfAccounts | [المصدر](../../../raw/application.js#L284018) |
| `abp.services.app.statementOfAccounts.getDepositsOnCustomer` | POST | api/services/app/statementOfAccounts/GetDepositsOnCustomer | [المصدر](../../../raw/application.js#L284060) |
| `abp.services.app.statementOfAccounts.getPendingPdcs` | POST | api/services/app/statementOfAccounts/GetPendingPdcs | [المصدر](../../../raw/application.js#L284073) |
| `abp.services.app.statementOfAccounts.getAdvanceTaxInvoice` | POST | api/services/app/statementOfAccounts/GetAdvanceTaxInvoice | [المصدر](../../../raw/application.js#L284086) |
| `abp.services.app.statementOfAccounts.exportToExcelOutStandingInvoices` | POST | api/services/app/statementOfAccounts/ExportToExcelOutStandingInvoices | [المصدر](../../../raw/application.js#L284129) |
| `abp.services.app.statementOfAccounts.exportToExcelOutStandingBills` | POST | api/services/app/statementOfAccounts/ExportToExcelOutStandingBills | [المصدر](../../../raw/application.js#L284138) |
| `abp.services.app.statementOfAccounts.exportToExcelLedger` | POST | api/services/app/statementOfAccounts/ExportToExcelLedger | [المصدر](../../../raw/application.js#L284146) |
| `abp.services.app.statementOfAccounts.exportToExcelDueInvoices` | POST | api/services/app/statementOfAccounts/ExportToExcelDueInvoices | [المصدر](../../../raw/application.js#L284165) |
| `abp.services.app.statementOfAccounts.emailStatementOfAccountDetails` | POST | api/services/app/statementOfAccounts/EmailStatementOfAccountDetails | [المصدر](../../../raw/application.js#L284184) |
| `abp.services.app.statementOfAccounts.whatsAppSmsStatementOfAccountDetails` | POST | api/services/app/statementOfAccounts/WhatsAppSmsStatementOfAccountDetails | [المصدر](../../../raw/application.js#L284201) |
| `abp.services.app.commonLookup.validateCheque` | POST | [object Object] | [المصدر](../../../raw/application.js#L284236) |
| `abp.services.app.statementOfAccounts.getLinkedAccountsForEdit` | POST | api/services/app/statementOfAccounts/GetLinkedAccountsForEdit | [المصدر](../../../raw/application.js#L284298) |
| `abp.services.app.directory.searchDirectoryPaged` | POST | api/services/app/directory/SearchDirectoryPaged | [المصدر](../../../raw/application.js#L184666) |
| `abp.services.app.allocation.saveAllocations` | POST | api/services/app/allocation/SaveAllocations | [المصدر](../../../raw/application.js#L319957) |
| `abp.services.app.allocation.exportToExcelReceipt` | POST | [object Object] | [المصدر](../../../raw/application.js#L319741) |
| `abp.services.app.allocation.getAllocationsForEdit` | POST | api/services/app/allocation/GetAllocationsForEdit | [المصدر](../../../raw/application.js#L319997) |
| `abp.services.app.commonLookup.searchRentalOrLeaseAgreement` | POST | api/services/app/commonLookup/SearchRentalOrLeaseAgreement | [المصدر](../../../raw/application.js#L319850) |
| `abp.services.app.allocation.getAgreementsAllocations` | POST | api/services/app/allocation/GetAgreementsAllocations | [المصدر](../../../raw/application.js#L319863) |
| `abp.services.app.chargesSetting.getConfiguredChargesTypesDistinct` | POST | api/services/app/chargesSetting/GetConfiguredChargesTypesDistinct | [المصدر](../../../raw/application.js#L319874) |
| `abp.services.app.allocation.getAllocationsForEdit2` | POST | api/services/app/allocation/GetAllocationsForEdit2 | [المصدر](../../../raw/application.js#L319970) |
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

- صلاحية `Pages.Tenants.Customers.StatementOfExport`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenants.Customers.StatementOfAccountsEmail`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenants.Suppliers.StatementOfAccountsEmail`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Receipts.AllowReAllocationOfAllocated`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Allocations`: ممنوحة في السياق الملتقط.
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
| `vm.dateRangeModel` | text |  | min=vm.dateRangeOptions.min; max=vm.dateRangeOptions.max; ng-disabled=!vm.filters.enableDateRange |
| `vm.filters.enableDateRange` | checkbox | disableDateRange |  |
| `vm.filters.customer` | ui-select |  |  |
| `vm.filters.inActive` | checkbox | Contact_Inactive |  |
| `vm.filters.agreement` | ui-select |  | ng-disabled=vm.filters.customer == null |
| `vm.filters.voucherWithoutAgreementNo` | checkbox |  | ng-disabled=vm.filters.customer == null |
| `vm.filters.module` | text | module | ng-options=module.id as module.name for module in vm.modules |
| `vm.filters.accountId` | select | account | ng-options=act.account.id as act.account.accountCode+ ' '+act.account.name for act in vm.linkAccounts \|filter: vm.contactGroupStaffFilter |
| `vm.filters.statementOfAccountSearchFilter` | radio | ledgerReport |  |
| `vm.filters.statementOfAccountSearchFilter` | radio | outstanding |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
