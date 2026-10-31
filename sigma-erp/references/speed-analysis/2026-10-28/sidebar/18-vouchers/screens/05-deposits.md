# شاشة: Deposits

المسار في القائمة: Vouchers ← Deposits.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_deposits`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0306](../../../readable/routes/R0306--tenant-crs-deposits.js)، والأصل [raw/application.js:3721](../../../raw/application.js#L3721).
- قالب الشاشة: `~/App/tenant/views/crs/vouchers/deposits/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.vouchers.deposits.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.vouchers.deposits.index](../../../readable/controllers/C1295--tenant.views.crs.vouchers.deposits.index.js) | 28 | 6 |
| [tenant.views.crs.vouchers.deposits.allocationForDeposit](../../../readable/controllers/C1287--tenant.views.crs.vouchers.deposits.allocationForDeposit.js) | 10 | 7 |
| [tenant.views.crs.vouchers.deposits.allocationForDeposit2](../../../readable/controllers/C1288--tenant.views.crs.vouchers.deposits.allocationForDeposit2.js) | 12 | 7 |
| [tenant.views.crs.vouchers.deposits.depositRefund](../../../readable/controllers/C1290--tenant.views.crs.vouchers.deposits.depositRefund.js) | 9 | 6 |
| [tenant.views.crs.vouchers.deposits.printTemplates.printPreview](../../../readable/controllers/C1304--tenant.views.crs.vouchers.deposits.printTemplates.printPreview.js) | 2 | 0 |
| [tenant.views.crs.contacts.searchContactModal](../../../readable/controllers/C0706--tenant.views.crs.contacts.searchContactModal.js) | 7 | 2 |
| [tenant.views.crs.vouchers.deposits.editDeposit](../../../readable/controllers/C1293--tenant.views.crs.vouchers.deposits.editDeposit.js) | 7 | 5 |
| [tenant.views.crs.vouchers.deposits.viewModal](../../../readable/controllers/C1302--tenant.views.crs.vouchers.deposits.viewModal.js) | 9 | 6 |
| [tenant.views.crs.vouchers.deposits.renewExpiry](../../../readable/controllers/C1297--tenant.views.crs.vouchers.deposits.renewExpiry.js) | 2 | 2 |
| [tenant.views.crs.vouchers.deposits.extendHoldDaysModal](../../../readable/controllers/C1294--tenant.views.crs.vouchers.deposits.extendHoldDaysModal.js) | 2 | 2 |
| [tenant.views.crs.vouchers.allocations.createAllocation](../../../readable/controllers/C1220--tenant.views.crs.vouchers.allocations.createAllocation.js) | 11 | 3 |
| [common.views.common.reportViewer](../../../readable/controllers/C0006--common.views.common.reportViewer.js) | 2 | 0 |
| [tenant.views.crs.vouchers.deposits.transferDepositModal](../../../readable/controllers/C1299--tenant.views.crs.vouchers.deposits.transferDepositModal.js) | 3 | 3 |
| [tenant.views.crs.accounting.journal.viewModal](../../../readable/controllers/C0499--tenant.views.crs.accounting.journal.viewModal.js) | 7 | 2 |
| [tenant.views.crs.vouchers.payments.printTemplates.printPreview](../../../readable/controllers/C1386--tenant.views.crs.vouchers.payments.printTemplates.printPreview.js) | 2 | 0 |
| [tenant.views.crs.contacts.createOrEditModal](../../../readable/controllers/C0703--tenant.views.crs.contacts.createOrEditModal.js) | 45 | 24 |
| [tenant.views.crs.vouchers.deposits.uploadDocumentsModal](../../../readable/controllers/C1300--tenant.views.crs.vouchers.deposits.uploadDocumentsModal.js) | 3 | 0 |
| [tenant.views.crs.vouchers.deposits.editAllocationForDeposit](../../../readable/controllers/C1291--tenant.views.crs.vouchers.deposits.editAllocationForDeposit.js) | 7 | 2 |
| [tenant.views.crs.vouchers.deposits.editAllocationForDeposit2](../../../readable/controllers/C1292--tenant.views.crs.vouchers.deposits.editAllocationForDeposit2.js) | 9 | 2 |
| [tenant.views.crs.contacts.uploadDocumentModal](../../../readable/controllers/C0699--tenant.views.crs.contacts.uploadDocumentModal.js) | 2 | 1 |
| [tenant.views.crs.contacts.uploadDocumentModal](../../../readable/controllers/C0711--tenant.views.crs.contacts.uploadDocumentModal.js) | 2 | 1 |
| [tenant.views.common.documents.uploadDocumentModal](../../../readable/controllers/C0362--tenant.views.common.documents.uploadDocumentModal.js) | 4 | 0 |
| [tenant.views.common.documents.uploadImageModal](../../../readable/controllers/C0363--tenant.views.common.documents.uploadImageModal.js) | 3 | 0 |
| [tenant.views.common.documents.addCreditCardModal](../../../readable/controllers/C0701--tenant.views.common.documents.addCreditCardModal.js) | 4 | 0 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.vouchers.deposits.index`: `CurrencyFormate`، `roundingforView`، `changePrintingWithoutLogo`، `getTypeById`، `getlocalDateTime`، `getExpiryOrDays`، `dateRangeModelChanged`، `useDeposit`، `depositRefund`، `getCurrentDate`، `openprintModal`، `returnDeposit`، `exportToExcel`، `searchCustomers`، `searchCustomerPopoup`، `report`، `usedReport`، `editDeposit`، `createDepositChargesAllocation`، `getDeposits`، `deleteDeposit`، `viewDeposit`، `openRenewExpiry`، `extendHoldDays`، `transferDeposit`، `enterKeyPress`، `clearCustomer`، `openJournalViewModal`.
- وحدة `tenant.views.crs.vouchers.deposits.allocationForDeposit`: `amountChanged`، `getlocalDateTime`، `getlocalDate`، `cancel`، `rounding`، `searchCustomers`، `onCustomerSelect`، `sumAmount`، `searchCustomerPopoup`، `save`.
- وحدة `tenant.views.crs.vouchers.deposits.allocationForDeposit2`: `amountChanged`، `getlocalDateTime`، `getlocalDate`، `cancel`، `rounding`، `searchCustomers`، `onCustomerSelect`، `sumAmount`، `searchCustomerPopoup`، `save`، `addChargesType`، `addInHeadRow`.
- وحدة `tenant.views.crs.vouchers.deposits.depositRefund`: `amountChanged`، `getlocalDateTime`، `getlocalDate`، `cancel`، `searchCustomers`، `onCustomerSelect`، `sumAmount`، `searchCustomerPopoup`، `save`.
- وحدة `tenant.views.crs.vouchers.deposits.printTemplates.printPreview`: `cancel`، `getTemplateUrl`.
- وحدة `tenant.views.crs.contacts.searchContactModal`: `searchContacts`، `cancel`، `showAddContact`، `contactSelected`، `contactEdit`، `getContactsList`، `getNameWithCode`.
- وحدة `tenant.views.crs.vouchers.deposits.editDeposit`: `amountChangedDeposit`، `uploadDocument`، `removeDocument`، `getOriginalName`، `cancel`، `paymentMethodChanged`، `ok`.
- وحدة `tenant.views.crs.vouchers.deposits.viewModal`: `localize`، `cancel`، `getTypeById`، `roundingforView`، `useDeposit`، `getOriginalName`، `getExpiryOrDays`، `openUseDeposit`، `openRefundDeposit`.
- وحدة `tenant.views.crs.vouchers.deposits.renewExpiry`: `cancel`، `save`.
- وحدة `tenant.views.crs.vouchers.deposits.extendHoldDaysModal`: `cancel`، `save`.
- وحدة `tenant.views.crs.vouchers.allocations.createAllocation`: `refresh`، `exportToExcel`، `importResult`، `cancel`، `localize`، `rounding`، `sumAmount`، `getlocalDateTime`، `insertDueAmountOnClick`، `save`، `exportToExcelAllocations`.
- وحدة `common.views.common.reportViewer`: `exportToExcelFromReport`، `cancel`.
- وحدة `tenant.views.crs.vouchers.deposits.transferDepositModal`: `cancel`، `searchAgreement`، `save`.
- وحدة `tenant.views.crs.accounting.journal.viewModal`: `getlocalDateTime`، `rounding`، `formatNumber`، `roundingforView`، `currencyAndRoundingWithThree`، `getVoucherType`، `cancel`.
- وحدة `tenant.views.crs.vouchers.payments.printTemplates.printPreview`: `cancel`، `getTemplateUrl`.
- وحدة `tenant.views.crs.contacts.createOrEditModal`: `localize`، `removeExternalIdRow`، `addExternalIdRow`، `getContactExternalType`، `isContactExternalType`، `getlocalDate`، `getlocalDateTime`، `getCardType`، `removeRow`، `searchSalesPersons`، `searchUsersWithDesignation`، `searchSalesPersonPopoup`، `salesPersonSelected`، `searchDebtCollectorPopoup`، `searchCustomLookup`، `getCustomLookups`، `scanDocument`، `openUploadDocument`، `openUploadPicture`، `addCreditCardRow`، `updateCreditCardRow`، `save`، `cancel`، `isPersonVerifiedChange`، `doesIdentityDoucmentExist`، `addIndentityDocument`، `getIdentificationDocumentType`، `removeIndentityDocument`، `removeDoc`، `isFieldMondatory`، `searchCountries`، `emiratesDataReader`، `emiratesDataFieldManager`، `getTariffCards`، `getTariffCardForContact`، `isDocument`، `maskCreditCard`، `getAdvanceSettings`، `getHighLightBlackListCountries`، `getNationalIdFormates`، `nationalIdFormate`، `onOverRideChange`، `resetDocumentNo`، `nationIdMaskInput`، `handleResidenceStatusChange`.
- وحدة `tenant.views.crs.vouchers.deposits.uploadDocumentsModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.crs.vouchers.deposits.editAllocationForDeposit`: `cancel`، `localize`، `rounding`، `sumAmount`، `getlocalDateTime`، `insertDueAmountOnClick`، `save`.
- وحدة `tenant.views.crs.vouchers.deposits.editAllocationForDeposit2`: `cancel`، `localize`، `rounding`، `sumAmount`، `getlocalDateTime`، `insertDueAmountOnClick`، `addChargesType`، `addInHeadRow`، `save`.
- وحدة `tenant.views.crs.contacts.uploadDocumentModal`: `save`، `cancel`.
- وحدة `tenant.views.crs.contacts.uploadDocumentModal`: `save`، `cancel`.
- وحدة `tenant.views.common.documents.uploadDocumentModal`: `uploadHeader`، `uploader.onBeforeUploadItem`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.common.documents.uploadImageModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.common.documents.addCreditCardModal`: `ab`، `cardNumberChanged`، `save`، `cancel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.billingMethod.getBillingMethods` | POST | api/services/app/billingMethod/GetBillingMethods | [المصدر](../../../raw/application.js#L341367) |
| `abp.services.app.deposit.returnDeposit` | POST | api/services/app/deposit/ReturnDeposit | [المصدر](../../../raw/application.js#L340151) |
| `abp.services.app.deposit.exportToExcel` | POST | api/services/app/deposit/ExportToExcel | [المصدر](../../../raw/application.js#L340179) |
| `abp.services.app.directory.search` | POST | api/services/app/directory/Search | [المصدر](../../../raw/application.js#L182771) |
| `abp.services.app.deposit.getDeposits` | POST | api/services/app/deposit/GetDeposits | [المصدر](../../../raw/application.js#L340424) |
| `abp.services.app.deposit.deleteDeposit` | POST | api/services/app/deposit/DeleteDeposit | [المصدر](../../../raw/application.js#L340445) |
| `abp.services.app.commonLookup.getLocations` | POST | api/services/app/commonLookup/GetLocations | [المصدر](../../../raw/application.js#L182597) |
| `abp.services.app.deposit.getAllocatedAmountOnDeposit` | POST | [object Object] | [المصدر](../../../raw/application.js#L341356) |
| `abp.services.app.deposit.useDepositWithAllocations` | POST | api/services/app/deposit/UseDepositWithAllocations | [المصدر](../../../raw/application.js#L338514) |
| `abp.services.app.commonLookup.getBankAccountsForSelection` | POST | api/services/app/commonLookup/GetBankAccountsForSelection | [المصدر](../../../raw/application.js#L339610) |
| `abp.services.app.allocation.getAllocationsForEdit` | POST | api/services/app/allocation/GetAllocationsForEdit | [المصدر](../../../raw/application.js#L339295) |
| `abp.services.app.allocation.getAllocationsForEdit2` | POST | api/services/app/allocation/GetAllocationsForEdit2 | [المصدر](../../../raw/application.js#L339438) |
| `abp.services.app.deposit.depositRefund` | POST | api/services/app/deposit/DepositRefund | [المصدر](../../../raw/application.js#L339174) |
| `abp.services.app.directory.searchDirectoryPaged` | POST | api/services/app/directory/SearchDirectoryPaged | [المصدر](../../../raw/application.js#L184666) |
| `abp.services.app.deposit.createOrUpdateDeposit` | POST | api/services/app/deposit/CreateOrUpdateDeposit | [المصدر](../../../raw/application.js#L339695) |
| `abp.services.app.deposit.getDepositForEdit` | POST | api/services/app/deposit/GetDepositForEdit | [المصدر](../../../raw/application.js#L340959) |
| `abp.services.app.deposit.updateUsedDeposit` | POST | api/services/app/deposit/UpdateUsedDeposit | [المصدر](../../../raw/application.js#L341312) |
| `abp.services.app.deposit.getRefundtAmountOnDeposit` | POST | [object Object] | [المصدر](../../../raw/application.js#L341345) |
| `abp.services.app.allocation.saveAllocations` | POST | api/services/app/allocation/SaveAllocations | [المصدر](../../../raw/application.js#L339427) |
| `abp.services.app.allocation.exportToExcelReceipt` | POST | [object Object] | [المصدر](../../../raw/application.js#L319741) |
| `abp.services.app.deposit.searchAgreementForDeposit` | POST | api/services/app/deposit/SearchAgreementForDeposit | [المصدر](../../../raw/application.js#L340941) |
| `abp.services.app.deposit.transferDepositToAgreement` | POST | api/services/app/deposit/TransferDepositToAgreement | [المصدر](../../../raw/application.js#L340949) |
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
| `abp.services.app.person.uploadDocumentImage` | POST | api/services/app/person/UploadDocumentImage | [المصدر](../../../raw/application.js#L185476) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.Accounts.Journal`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Deposits.UsedDepositReport`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Deposits.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Deposits.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Deposits.Transfer`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Deposits.Refund`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Deposits.Used`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Deposits.ExportToExcel`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Deposits.Delete`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Deposits.View`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Deposits.Print`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Allocations`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Deposits.AllActionsOnOtherBranchDeposits`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Deposits.ViewOtherBranchDeposit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Deposits.ExtensionOfDeposits`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Receipts.AllActionsOnOtherBranchReceipts`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Deposits.AllActionsOnOtherBranchDeposit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Delete`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Deposits.EditUsedDeposit`: ممنوحة في السياق الملتقط.
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
| `vm.filters.agreementNo` | text |  |  |
| `vm.filters.voucherSubType` | select |  | ng-options=depositType as depositType.name for depositType in vm.depositBillingMethods |
| `vm.dateRangeModel` | text |  | min=vm.dateRangeOptions.min; max=vm.dateRangeOptions.max |
| `vm.filters.customer` | ui-select |  |  |
| `vm.filters.printingWithoutLogo` | checkbox | printingWithoutLogo |  |
| `vm.filters.customer` | ui-select |  |  |
| `vm.filters.depositsSearchFilter` | radio | all |  |
| `vm.filters.depositsSearchFilter` | radio | inHold |  |
| `vm.filters.depositsSearchFilter` | radio | expiryToday |  |
| `vm.filters.depositsSearchFilter` | radio | dueToReturn |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
