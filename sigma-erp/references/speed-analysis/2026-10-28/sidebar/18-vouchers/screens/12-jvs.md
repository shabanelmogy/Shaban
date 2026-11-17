# شاشة: JVs

المسار في القائمة: Vouchers ← JVs.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_jvs`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0317](../../../readable/routes/R0317--tenant-crs-jvs.js)، والأصل [raw/application.js:3805](../../../raw/application.js#L3805).
- قالب الشاشة: `~/App/tenant/views/crs/vouchers/jvs/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.vouchers.jvs.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.vouchers.jvs.index](../../../readable/controllers/C1364--tenant.views.crs.vouchers.jvs.index.js) | 36 | 12 |
| [tenant.views.crs.contacts.searchContactModal](../../../readable/controllers/C0706--tenant.views.crs.contacts.searchContactModal.js) | 7 | 2 |
| [tenant.views.crs.vehicles.searchVehicleModal](../../../readable/controllers/C1186--tenant.views.crs.vehicles.searchVehicleModal.js) | 13 | 11 |
| [tenant.views.crs.vouchers.jvs.createOrEditModal](../../../readable/controllers/C1362--tenant.views.crs.vouchers.jvs.createOrEditModal.js) | 29 | 19 |
| [tenant.views.crs.vouchers.jvs.printTemplates.printPreview](../../../readable/controllers/C1370--tenant.views.crs.vouchers.jvs.printTemplates.printPreview.js) | 2 | 0 |
| [tenant.views.crs.vouchers.jvs.printTemplates.printPreview](../../../readable/controllers/C1394--tenant.views.crs.vouchers.jvs.printTemplates.printPreview.js) | 2 | 0 |
| [tenant.views.crs.vouchers.jvs.allocateJvModalForSelect](../../../readable/controllers/C1360--tenant.views.crs.vouchers.jvs.allocateJvModalForSelect.js) | 2 | 1 |
| [tenant.views.crs.vouchers.jvs.fineDetailsModel](../../../readable/controllers/C1363--tenant.views.crs.vouchers.jvs.fineDetailsModel.js) | 3 | 1 |
| [tenant.views.crs.vouchers.jvs.tollsDetailModal](../../../readable/controllers/C1367--tenant.views.crs.vouchers.jvs.tollsDetailModal.js) | 7 | 3 |
| [common.views.common.reportViewer](../../../readable/controllers/C0006--common.views.common.reportViewer.js) | 2 | 0 |
| [tenant.views.crs.accounting.journal.viewModal](../../../readable/controllers/C0499--tenant.views.crs.accounting.journal.viewModal.js) | 7 | 2 |
| [tenant.views.crs.contacts.createOrEditModal](../../../readable/controllers/C0703--tenant.views.crs.contacts.createOrEditModal.js) | 45 | 24 |
| [tenant.views.crs.vouchers.jvs.uploadDocumentsModal](../../../readable/controllers/C1368--tenant.views.crs.vouchers.jvs.uploadDocumentsModal.js) | 3 | 0 |
| [tenant.views.crs.vouchers.jvs.createAllocationJv](../../../readable/controllers/C1361--tenant.views.crs.vouchers.jvs.createAllocationJv.js) | 7 | 2 |
| [tenant.views.crs.contacts.uploadDocumentModal](../../../readable/controllers/C0699--tenant.views.crs.contacts.uploadDocumentModal.js) | 2 | 1 |
| [tenant.views.crs.contacts.uploadDocumentModal](../../../readable/controllers/C0711--tenant.views.crs.contacts.uploadDocumentModal.js) | 2 | 1 |
| [tenant.views.common.documents.uploadDocumentModal](../../../readable/controllers/C0362--tenant.views.common.documents.uploadDocumentModal.js) | 4 | 0 |
| [tenant.views.common.documents.uploadImageModal](../../../readable/controllers/C0363--tenant.views.common.documents.uploadImageModal.js) | 3 | 0 |
| [tenant.views.common.documents.addCreditCardModal](../../../readable/controllers/C0701--tenant.views.common.documents.addCreditCardModal.js) | 4 | 0 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.vouchers.jvs.index`: `dateRangeModelChanged`، `locationPermission`، `CurrencyFormate`، `roundingforView`، `locationPermission`، `allBranchPermission`، `getAssetSearch`، `approveAllMethod`، `onVoucherSubTypeChange`، `getVoucherSubTypeById`، `dateRangeCheck`، `searchVehicles`، `searchSupplier`، `searchContactPopoup`، `searchVehiclePopup`، `getJVs`، `getlocalDateTime`، `exportToExcel`، `exportToExcelDetailed`، `openprintModal`، `report`، `createJV`، `salikVoucherDetails`، `editJV`، `cloneJV`، `viewJV`، `fineDetails`، `deleteJV`، `voidJV`، `allocateJV`، `enterKeyPress`، `clearSupplier`، `clearAsset`، `openJournalViewModal`، `approveJVs`، `unapproveJV`.
- وحدة `tenant.views.crs.contacts.searchContactModal`: `searchContacts`، `cancel`، `showAddContact`، `contactSelected`، `contactEdit`، `getContactsList`، `getNameWithCode`.
- وحدة `tenant.views.crs.vehicles.searchVehicleModal`: `statusChanged`، `searchModel`، `cancel`، `clearInput`، `clearVehicle`، `getlocalDateTime`، `fromDateTimeChanged`، `searchVehicles`، `searchVehiclesFilters`، `exportToExcelByAgreement`، `vehicleSelected`، `getBookingDate`، `getTeriffGroups`.
- وحدة `tenant.views.crs.vouchers.jvs.createOrEditModal`: `rounding`، `roundingforView`، `searchAccounts`، `searchContact`، `uploadDocument`، `getOriginalName`، `accountChanged`، `searchPrepaidExpense`، `isStockAccount`، `productSelected`، `searchVehicles`، `searchItems`، `searchJobs`، `searchAgreements`، `searchMasterAgreement`، `considerTaxAsTaxPercentage`، `sumAmount`، `sumAmountExcel`، `sumAmountBeforeSaving`، `getlocalDate`، `addRow`، `removeRow`، `cancel`، `uploader.onSuccessItem`، `uploader.onErrorItem`، `isbranchNull`، `isdateNull`، `save`، `removeDocument`.
- وحدة `tenant.views.crs.vouchers.jvs.printTemplates.printPreview`: `cancel`، `getTemplateUrl`.
- وحدة `tenant.views.crs.vouchers.jvs.printTemplates.printPreview`: `cancel`، `getTemplateUrl`.
- وحدة `tenant.views.crs.vouchers.jvs.allocateJvModalForSelect`: `ok`، `rowSelected`.
- وحدة `tenant.views.crs.vouchers.jvs.fineDetailsModel`: `getlocalDateTime`، `cancel`، `exportToExcel`.
- وحدة `tenant.views.crs.vouchers.jvs.tollsDetailModal`: `getlocalDateTime`، `getRoundFigure`، `getlocalDate`، `exportToExcel`، `getServerName`، `cancel`، `printTolls`.
- وحدة `common.views.common.reportViewer`: `exportToExcelFromReport`، `cancel`.
- وحدة `tenant.views.crs.accounting.journal.viewModal`: `getlocalDateTime`، `rounding`، `formatNumber`، `roundingforView`، `currencyAndRoundingWithThree`، `getVoucherType`، `cancel`.
- وحدة `tenant.views.crs.contacts.createOrEditModal`: `localize`، `removeExternalIdRow`، `addExternalIdRow`، `getContactExternalType`، `isContactExternalType`، `getlocalDate`، `getlocalDateTime`، `getCardType`، `removeRow`، `searchSalesPersons`، `searchUsersWithDesignation`، `searchSalesPersonPopoup`، `salesPersonSelected`، `searchDebtCollectorPopoup`، `searchCustomLookup`، `getCustomLookups`، `scanDocument`، `openUploadDocument`، `openUploadPicture`، `addCreditCardRow`، `updateCreditCardRow`، `save`، `cancel`، `isPersonVerifiedChange`، `doesIdentityDoucmentExist`، `addIndentityDocument`، `getIdentificationDocumentType`، `removeIndentityDocument`، `removeDoc`، `isFieldMondatory`، `searchCountries`، `emiratesDataReader`، `emiratesDataFieldManager`، `getTariffCards`، `getTariffCardForContact`، `isDocument`، `maskCreditCard`، `getAdvanceSettings`، `getHighLightBlackListCountries`، `getNationalIdFormates`، `nationalIdFormate`، `onOverRideChange`، `resetDocumentNo`، `nationIdMaskInput`، `handleResidenceStatusChange`.
- وحدة `tenant.views.crs.vouchers.jvs.uploadDocumentsModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.crs.vouchers.jvs.createAllocationJv`: `cancel`، `localize`، `rounding`، `sumAmount`، `getlocalDateTime`، `insertDueAmountOnClick`، `save`.
- وحدة `tenant.views.crs.contacts.uploadDocumentModal`: `save`، `cancel`.
- وحدة `tenant.views.crs.contacts.uploadDocumentModal`: `save`، `cancel`.
- وحدة `tenant.views.common.documents.uploadDocumentModal`: `uploadHeader`، `uploader.onBeforeUploadItem`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.common.documents.uploadImageModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.common.documents.addCreditCardModal`: `ab`، `cardNumberChanged`، `save`، `cancel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.depreciationSummary.getAssetSearch` | POST | api/services/app/depreciationSummary/GetAssetSearch | [المصدر](../../../raw/application.js#L367645) |
| `abp.services.app.jV.approvejVs` | غير مربوط | غير محسوم | [المصدر](../../../raw/application.js#L367660) |
| `abp.services.app.vehicle.searchVehicles` | POST | api/services/app/vehicle/SearchVehicles | [المصدر](../../../raw/application.js#L366746) |
| `abp.services.app.directory.search` | POST | api/services/app/directory/Search | [المصدر](../../../raw/application.js#L182771) |
| `abp.services.app.jV.getJVs` | POST | api/services/app/jV/GetJVs | [المصدر](../../../raw/application.js#L367777) |
| `abp.services.app.commonLookup.getLocationsActiveAndInActive` | POST | api/services/app/commonLookup/GetLocationsActiveAndInActive | [المصدر](../../../raw/application.js#L366799) |
| `abp.services.app.jV.exportToExcel` | POST | api/services/app/jV/ExportToExcel | [المصدر](../../../raw/application.js#L367815) |
| `abp.services.app.jV.exportToExcelDetailed` | POST | api/services/app/jV/ExportToExcelDetailed | [المصدر](../../../raw/application.js#L367835) |
| `abp.services.app.jV.deleteJV` | POST | api/services/app/jV/DeleteJV | [المصدر](../../../raw/application.js#L368116) |
| `abp.services.app.jV.voidJV` | POST | api/services/app/jV/VoidJV | [المصدر](../../../raw/application.js#L368133) |
| `abp.services.app.jV.approveJV` | POST | api/services/app/jV/ApproveJV | [المصدر](../../../raw/application.js#L368198) |
| `abp.services.app.jV.unApproveJV` | POST | api/services/app/jV/UnApproveJV | [المصدر](../../../raw/application.js#L368214) |
| `abp.services.app.directory.searchDirectoryPaged` | POST | api/services/app/directory/SearchDirectoryPaged | [المصدر](../../../raw/application.js#L184666) |
| `abp.services.app.vehicleModel.searchVehicleModelsNew` | POST | api/services/app/vehicleModel/SearchVehicleModelsNew | [المصدر](../../../raw/application.js#L312735) |
| `abp.services.app.vehicle.searchVehiclesPagedWorkShop` | POST | api/services/app/vehicle/SearchVehiclesPagedWorkShop | [المصدر](../../../raw/application.js#L312796) |
| `abp.services.app.vehicle.searchVehiclesPagedByAgreement` | POST | [object Object] | [المصدر](../../../raw/application.js#L312800) |
| `abp.services.app.vehicle.searchVehiclesPaged` | POST | api/services/app/vehicle/SearchVehiclesPaged | [المصدر](../../../raw/application.js#L312803) |
| `abp.services.app.vehicle.exportToExcelByAgreement` | POST | api/services/app/vehicle/ExportToExcelByAgreement | [المصدر](../../../raw/application.js#L312885) |
| `abp.services.app.commonLookup.getLocations` | POST | api/services/app/commonLookup/GetLocations | [المصدر](../../../raw/application.js#L182597) |
| `abp.services.app.commonLookup.getTariffGroups` | POST | api/services/app/commonLookup/GetTariffGroups | [المصدر](../../../raw/application.js#L313062) |
| `abp.services.app.tenantSettings.getExpenseAccountsAdvanceSetting` | POST | api/services/app/tenantSettings/GetExpenseAccountsAdvanceSetting | [المصدر](../../../raw/application.js#L366527) |
| `abp.services.app.currency.getCurrencies` | POST | api/services/app/currency/GetCurrencies | [المصدر](../../../raw/application.js#L183468) |
| `abp.services.app.account.searchAccountsForSubLookUp` | POST | api/services/app/account/SearchAccountsForSubLookUp | [المصدر](../../../raw/application.js#L366560) |
| `abp.services.app.directory.searchByContactGroup` | POST | api/services/app/directory/SearchByContactGroup | [المصدر](../../../raw/application.js#L366568) |
| `abp.services.app.jV.getexpenseaccounts` | POST | api/services/app/jV/Getexpenseaccounts | [المصدر](../../../raw/application.js#L366720) |
| `abp.services.app.jV.isStockAccount` | POST | api/services/app/jV/IsStockAccount | [المصدر](../../../raw/application.js#L366731) |
| `abp.services.app.item.searchItems` | POST | api/services/app/item/SearchItems | [المصدر](../../../raw/application.js#L366753) |
| `abp.services.app.job.searchJobs` | POST | api/services/app/job/SearchJobs | [المصدر](../../../raw/application.js#L366760) |
| `abp.services.app.agreement.searchAgreementForVoucherLines` | POST | api/services/app/agreement/SearchAgreementForVoucherLines | [المصدر](../../../raw/application.js#L366767) |
| `abp.services.app.leaseMasterAgreement.searchMasterAgreementsForVouchers` | POST | api/services/app/leaseMasterAgreement/SearchMasterAgreementsForVouchers | [المصدر](../../../raw/application.js#L366774) |
| `abp.services.app.costCenter.searchCostCenters` | POST | api/services/app/costCenter/SearchCostCenters | [المصدر](../../../raw/application.js#L366805) |
| `abp.services.app.division.searchDivisions` | POST | api/services/app/division/SearchDivisions | [المصدر](../../../raw/application.js#L366814) |
| `abp.services.app.jV.importFromExcel` | POST | [object Object] | [المصدر](../../../raw/application.js#L367126) |
| `abp.services.app.jV.createOrUpdateJV` | POST | api/services/app/jV/CreateOrUpdateJV | [المصدر](../../../raw/application.js#L367337) |
| `abp.services.app.jV.getLinkedAccountId` | POST | api/services/app/jV/GetLinkedAccountId | [المصدر](../../../raw/application.js#L367367) |
| `abp.services.app.jV.getJVForEdit` | POST | api/services/app/jV/GetJVForEdit | [المصدر](../../../raw/application.js#L366325) |
| `abp.services.app.uaeFine.getFineByJV` | POST | api/services/app/uaeFine/GetFineByJV | [المصدر](../../../raw/application.js#L367519) |
| `abp.services.app.toll.tollDetailsExportToExcel` | POST | api/services/app/toll/TollDetailsExportToExcel | [المصدر](../../../raw/application.js#L368597) |
| `abp.services.app.toll.getTollsForDetails` | POST | api/services/app/toll/GetTollsForDetails | [المصدر](../../../raw/application.js#L368644) |
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
| `abp.services.app.allocation.saveAllocations` | POST | api/services/app/allocation/SaveAllocations | [المصدر](../../../raw/application.js#L366418) |
| `abp.services.app.allocation.getAllocationsForEdit` | POST | api/services/app/allocation/GetAllocationsForEdit | [المصدر](../../../raw/application.js#L366443) |
| `abp.services.app.person.uploadDocumentImage` | POST | api/services/app/person/UploadDocumentImage | [المصدر](../../../raw/application.js#L185476) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.Accounts.Journal`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.JVs.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.JVs.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.JVs.View`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.JVs.Delete`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.JVs.Void`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.JVs.Print`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.JVs.AllActionsOnOtherBranchJVs`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.JVs.EditAllocation`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.JVs.ViewOtherBranchJVs`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.JVs.CanApproveOtherBranchJVs`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.JVs.Approve`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.JVs.UnApprove`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.JVs.CloneJV`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Delete`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vehicles.ViewOtherBranchVehicles`: ممنوحة في السياق الملتقط.
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
| `vm.filters.locationId` | select | locationId |  |
| `vm.dateRangeModel` | text |  | min=vm.dateRangeOptions.min; max=vm.dateRangeOptions.max; ng-disabled=!vm.filters.enableDateRange |
| `vm.filters.enableDateRange` | checkbox | disableDateRange |  |
| `vm.filters.postingGroupId` | select | postingGroupId | ng-options=postingGroup.id as postingGroup.name for postingGroup in vm.postingGroups |
| `vm.filters.approvedType` | text | jVType | ng-options=approvedType.id as approvedType.name for approvedType in vm.approvedTypes |
| `vm.filters.amount` | text |  |  |
| `vm.filters.voucherSubTypeId` | text | voucherSubType | ng-options=voucherSubType.id as voucherSubType.name for voucherSubType in  vm.voucherSubTypes |
| `vm.filters.jobNo` | text |  |  |
| `vm.filters.voidedOnly` | checkbox | voidedOnly |  |
| `vm.filters.asset` | ui-select |  |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
