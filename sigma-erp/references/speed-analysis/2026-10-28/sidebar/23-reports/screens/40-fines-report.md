# شاشة: Fines Report

المسار في القائمة: Reports ← Fines Report.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_fineReport`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0405](../../../readable/routes/R0405--tenant-crs-finereport.js)، والأصل [raw/application.js:4473](../../../raw/application.js#L4473).
- قالب الشاشة: `~/App/tenant/views/crs/reports/finesReport/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.reports.finesReport.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.reports.finesReport.index](../../../readable/controllers/C1004--tenant.views.crs.reports.finesReport.index.js) | 41 | 12 |
| [tenant.views.crs.contacts.searchContactModal](../../../readable/controllers/C0706--tenant.views.crs.contacts.searchContactModal.js) | 7 | 2 |
| [tenant.views.crs.contacts.searchContactStaffModal](../../../readable/controllers/C0708--tenant.views.crs.contacts.searchContactStaffModal.js) | 6 | 1 |
| [tenant.views.tms.dashboard.updateChargesModal](../../../readable/controllers/C1740--tenant.views.tms.dashboard.updateChargesModal.js) | 4 | 1 |
| [tenant.views.crs.reports.finesReport.attachVehicleModal](../../../readable/controllers/C1000--tenant.views.crs.reports.finesReport.attachVehicleModal.js) | 3 | 2 |
| [tenant.views.crs.reports.finesReport.viewFine](../../../readable/controllers/C1009--tenant.views.crs.reports.finesReport.viewFine.js) | 4 | 3 |
| [common.views.common.reportViewer](../../../readable/controllers/C0006--common.views.common.reportViewer.js) | 2 | 0 |
| [tenant.views.crs.reports.finesReport.createOrShowFineLogsModal](../../../readable/controllers/C1002--tenant.views.crs.reports.finesReport.createOrShowFineLogsModal.js) | 3 | 2 |
| [tenant.views.crs.reports.finesReport.updateFineModel](../../../readable/controllers/C1008--tenant.views.crs.reports.finesReport.updateFineModel.js) | 2 | 1 |
| [tenant.views.crs.reports.finesReport.updateFineDescription](../../../readable/controllers/C1007--tenant.views.crs.reports.finesReport.updateFineDescription.js) | 2 | 1 |
| [tenant.views.crs.reports.finesReport.printtemplates.printPreview](../../../readable/controllers/C1013--tenant.views.crs.reports.finesReport.printtemplates.printPreview.js) | 2 | 0 |
| [tenant.views.crs.reports.finesReport.chooseAuthorityPrint](../../../readable/controllers/C1001--tenant.views.crs.reports.finesReport.chooseAuthorityPrint.js) | 4 | 0 |
| [tenant.views.fms.vehicleAssignments.searchOrganizationContactModal](../../../readable/controllers/C1565--tenant.views.fms.vehicleAssignments.searchOrganizationContactModal.js) | 3 | 7 |
| [tenant.views.crs.contacts.createOrEditModal](../../../readable/controllers/C0703--tenant.views.crs.contacts.createOrEditModal.js) | 45 | 24 |
| [tenant.views.common.documents.uploadImageModal](../../../readable/controllers/C0363--tenant.views.common.documents.uploadImageModal.js) | 3 | 0 |
| [tenant.views.fms.organizationChart.createOrEditUnitModal](../../../readable/controllers/C1559--tenant.views.fms.organizationChart.createOrEditUnitModal.js) | 2 | 2 |
| [tenant.views.crs.contacts.uploadDocumentModal](../../../readable/controllers/C0699--tenant.views.crs.contacts.uploadDocumentModal.js) | 2 | 1 |
| [tenant.views.crs.contacts.uploadDocumentModal](../../../readable/controllers/C0711--tenant.views.crs.contacts.uploadDocumentModal.js) | 2 | 1 |
| [tenant.views.common.documents.uploadDocumentModal](../../../readable/controllers/C0362--tenant.views.common.documents.uploadDocumentModal.js) | 4 | 0 |
| [tenant.views.common.documents.addCreditCardModal](../../../readable/controllers/C0701--tenant.views.common.documents.addCreditCardModal.js) | 4 | 0 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.reports.finesReport.index`: `canUpdateFineDescription`، `isAuthorityAbuDhabi`، `isAuthorityDubai`، `resetFilters`، `dateRangeModelChanged`، `dateRangeCheck`، `serverChanged`، `searchPlateNo`، `searchCustomers`، `clearCustomer`، `searchCustomerPopoup`، `CurrencyFormate`، `roundingforView`، `searchEmplyeePopoup`، `getFinesReport`، `statusChanged`، `invoiceStatusChanged`، `fineStatusChanged`، `getlocalDateTime`، `getlocalDate`، `isIgnored`، `updateChargeAndCollection`، `searchEmployees`، `ignoreFine`، `attachVehicle`، `viewFine`، `report`، `unIgnoreFine`، `sendWhatsAppCustomerSms`، `sendEmailCustomerSms`، `openFineLogsModal`، `openUpdateFineModal`، `openUpdateFineDescription`، `fineReportPrintModal`، `fineReportPrintByAuthorityModal`، `openChooseAuthorityPrint`، `exportToExcel`، `exportToCsv`، `searchOrganizationContactPopup`، `clearCustomer`، `clearEmployee`.
- وحدة `tenant.views.crs.contacts.searchContactModal`: `searchContacts`، `cancel`، `showAddContact`، `contactSelected`، `contactEdit`، `getContactsList`، `getNameWithCode`.
- وحدة `tenant.views.crs.contacts.searchContactStaffModal`: `searchContacts`، `cancel`، `showAddContact`، `contactSelected`، `contactEdit`، `getContactsList`.
- وحدة `tenant.views.tms.dashboard.updateChargesModal`: `getlocalDateTime`، `getlocalDate`، `cancel`، `save`.
- وحدة `tenant.views.crs.reports.finesReport.attachVehicleModal`: `cancel`، `searchVehicles`، `save`.
- وحدة `tenant.views.crs.reports.finesReport.viewFine`: `openUploadDocument`، `getlocalDateTime`، `getFine`، `cancel`.
- وحدة `common.views.common.reportViewer`: `exportToExcelFromReport`، `cancel`.
- وحدة `tenant.views.crs.reports.finesReport.createOrShowFineLogsModal`: `cancel`، `saveLog`، `getlocalDateTime`.
- وحدة `tenant.views.crs.reports.finesReport.updateFineModel`: `cancel`، `save`.
- وحدة `tenant.views.crs.reports.finesReport.updateFineDescription`: `cancel`، `save`.
- وحدة `tenant.views.crs.reports.finesReport.printtemplates.printPreview`: `cancel`، `getTemplateUrl`.
- وحدة `tenant.views.crs.reports.finesReport.chooseAuthorityPrint`: `showPopup`، `fineReportPrintByDubaiAuthorityModal`، `fineReportPrintByAuthorityModal`، `cancel`.
- وحدة `tenant.views.fms.vehicleAssignments.searchOrganizationContactModal`: `contactSelected`، `organizationSelected`، `cancel`.
- وحدة `tenant.views.crs.contacts.createOrEditModal`: `localize`، `removeExternalIdRow`، `addExternalIdRow`، `getContactExternalType`، `isContactExternalType`، `getlocalDate`، `getlocalDateTime`، `getCardType`، `removeRow`، `searchSalesPersons`، `searchUsersWithDesignation`، `searchSalesPersonPopoup`، `salesPersonSelected`، `searchDebtCollectorPopoup`، `searchCustomLookup`، `getCustomLookups`، `scanDocument`، `openUploadDocument`، `openUploadPicture`، `addCreditCardRow`، `updateCreditCardRow`، `save`، `cancel`، `isPersonVerifiedChange`، `doesIdentityDoucmentExist`، `addIndentityDocument`، `getIdentificationDocumentType`، `removeIndentityDocument`، `removeDoc`، `isFieldMondatory`، `searchCountries`، `emiratesDataReader`، `emiratesDataFieldManager`، `getTariffCards`، `getTariffCardForContact`، `isDocument`، `maskCreditCard`، `getAdvanceSettings`، `getHighLightBlackListCountries`، `getNationalIdFormates`، `nationalIdFormate`، `onOverRideChange`، `resetDocumentNo`، `nationIdMaskInput`، `handleResidenceStatusChange`.
- وحدة `tenant.views.common.documents.uploadImageModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.fms.organizationChart.createOrEditUnitModal`: `save`، `cancel`.
- وحدة `tenant.views.crs.contacts.uploadDocumentModal`: `save`، `cancel`.
- وحدة `tenant.views.crs.contacts.uploadDocumentModal`: `save`، `cancel`.
- وحدة `tenant.views.common.documents.uploadDocumentModal`: `uploadHeader`، `uploader.onBeforeUploadItem`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.common.documents.addCreditCardModal`: `ab`، `cardNumberChanged`، `save`، `cancel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.uaeFine.getFiltersData` | POST | api/services/app/uaeFine/GetFiltersData | [المصدر](../../../raw/application.js#L270839) |
| `abp.services.app.commonLookup.getLocationsActiveAndInActive` | POST | api/services/app/commonLookup/GetLocationsActiveAndInActive | [المصدر](../../../raw/application.js#L270865) |
| `abp.services.app.uaeFine.getSearchPlateNo` | POST | api/services/app/uaeFine/GetSearchPlateNo | [المصدر](../../../raw/application.js#L270877) |
| `abp.services.app.directory.search` | POST | api/services/app/directory/Search | [المصدر](../../../raw/application.js#L182771) |
| `abp.services.app.uaeFine.getFinesReport` | POST | api/services/app/uaeFine/GetFinesReport | [المصدر](../../../raw/application.js#L270990) |
| `abp.services.app.directory.searchStaff` | POST | api/services/app/directory/SearchStaff | [المصدر](../../../raw/application.js#L271130) |
| `abp.services.app.uaeFine.ignoreFine` | POST | api/services/app/uaeFine/IgnoreFine | [المصدر](../../../raw/application.js#L271143) |
| `abp.services.app.uaeFine.unIgnoreFine` | POST | api/services/app/uaeFine/UnIgnoreFine | [المصدر](../../../raw/application.js#L271221) |
| `abp.services.app.uaeFine.whatsAppFromFinesReport` | POST | api/services/app/uaeFine/WhatsAppFromFinesReport | [المصدر](../../../raw/application.js#L271776) |
| `abp.services.app.uaeFine.emailFines` | POST | api/services/app/uaeFine/EmailFines | [المصدر](../../../raw/application.js#L271791) |
| `abp.services.app.uaeFine.exportToExcelView` | POST | api/services/app/uaeFine/ExportToExcelView | [المصدر](../../../raw/application.js#L271929) |
| `abp.services.app.uaeFine.exportToCsvCustom` | POST | api/services/app/uaeFine/ExportToCsvCustom | [المصدر](../../../raw/application.js#L271942) |
| `abp.services.app.directory.searchDirectoryPaged` | POST | api/services/app/directory/SearchDirectoryPaged | [المصدر](../../../raw/application.js#L184666) |
| `abp.services.app.directory.searchDirectoryStaffPaged` | POST | api/services/app/directory/SearchDirectoryStaffPaged | [المصدر](../../../raw/application.js#L185032) |
| `abp.services.app.uaeFine.updateChargeAndCollection` | POST | api/services/app/uaeFine/UpdateChargeAndCollection | [المصدر](../../../raw/application.js#L477331) |
| `abp.services.app.vehicle.searchVehiclesForFines` | POST | api/services/app/vehicle/SearchVehiclesForFines | [المصدر](../../../raw/application.js#L270252) |
| `abp.services.app.uaeFine.attachVehicleWithFine` | POST | api/services/app/uaeFine/AttachVehicleWithFine | [المصدر](../../../raw/application.js#L270262) |
| `abp.services.app.uaeFine.updateFineImage` | POST | api/services/app/uaeFine/UpdateFineImage | [المصدر](../../../raw/application.js#L272350) |
| `abp.services.app.uaeFine.getFineById` | POST | [object Object] | [المصدر](../../../raw/application.js#L272372) |
| `abp.services.app.uaeFine.getFineImage` | POST | [object Object] | [المصدر](../../../raw/application.js#L272378) |
| `abp.services.app.uaeFine.fineLogs` | POST | api/services/app/uaeFine/FineLogs | [المصدر](../../../raw/application.js#L270371) |
| `abp.services.app.uaeFine.createFineLog` | POST | api/services/app/uaeFine/CreateFineLog | [المصدر](../../../raw/application.js#L270380) |
| `abp.services.app.uaeFine.updateFine` | POST | api/services/app/uaeFine/UpdateFine | [المصدر](../../../raw/application.js#L272307) |
| `abp.services.app.uaeFine.updateFineDetail` | POST | api/services/app/uaeFine/UpdateFineDetail | [المصدر](../../../raw/application.js#L272286) |
| `abp.services.app.organizationChart.getOrganizationUnits` | POST | api/services/app/organizationChart/GetOrganizationUnits | [المصدر](../../../raw/application.js#L432892) |
| `abp.services.app.organizationChart.moveOrganizationUnit` | POST | api/services/app/organizationChart/MoveOrganizationUnit | [المصدر](../../../raw/application.js#L432955) |
| `abp.services.app.organizationChart.getOrganizationUnitAllUsers` | POST | api/services/app/organizationChart/GetOrganizationUnitAllUsers | [المصدر](../../../raw/application.js#L433187) |
| `abp.services.app.organizationChart.addUserToOrganizationUnit` | POST | api/services/app/organizationChart/AddUserToOrganizationUnit | [المصدر](../../../raw/application.js#L433107) |
| `abp.services.app.organizationChart.removeUserFromOrganizationUnit` | POST | api/services/app/organizationChart/RemoveUserFromOrganizationUnit | [المصدر](../../../raw/application.js#L433127) |
| `abp.services.app.organizationChart.isInOrganizationUnit` | POST | api/services/app/organizationChart/IsInOrganizationUnit | [المصدر](../../../raw/application.js#L433153) |
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
| `abp.services.app.organizationChart.updateOrganizationUnit` | POST | api/services/app/organizationChart/UpdateOrganizationUnit | [المصدر](../../../raw/application.js#L430943) |
| `abp.services.app.organizationChart.createOrganizationUnit` | POST | api/services/app/organizationChart/CreateOrganizationUnit | [المصدر](../../../raw/application.js#L430950) |
| `abp.services.app.person.uploadDocumentImage` | POST | api/services/app/person/UploadDocumentImage | [المصدر](../../../raw/application.js#L185476) |

## الصلاحيات والحقول

- صلاحية `Pages.TFMS.Fines.UpdateFineDescription`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.TFMS.Print.By.Authority`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.TFMS.Fines.FineReceipts`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.TFMS.Print.By.Dubai.Authority`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.TFMS.DownloadConfiscationCharges`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Delete`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.TFMS.Update.Charged.Amount`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.TFMS.Update.Collected.Amount`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.TrafficFines.UploadFineImage`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Administration.OrganizationUnits.ManageOrganizationTree`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Administration.OrganizationUnits.ManageMembers`: ممنوحة في السياق الملتقط.
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
| `vm.filters.fineNo` | text |  |  |
| `vm.filters.agreementNo` | text |  |  |
| `vm.filters.tfmsAgreementNo` | text |  |  |
| `vm.filters.server` | select |  | ng-options=server.id as server.name for server in vm.server |
| `vm.filters.fromDate` | text |  | ng-disabled=!vm.filters.enableDateRange |
| `vm.filters.fromTime` | text |  | ng-disabled=!vm.filters.enableDateRange |
| `vm.filters.toDate` | text |  | ng-disabled=!vm.filters.enableDateRange |
| `vm.filters.toTime` | text |  | ng-disabled=!vm.filters.enableDateRange |
| `vm.filters.durationType` | radio | tripDate | ng-disabled=!vm.filters.enableDateRange |
| `vm.filters.durationType` | radio | downloadDate | ng-disabled=!vm.filters.enableDateRange |
| `vm.filters.enableDateRange` | checkbox | disableDateRange |  |
| `vm.filters.durationType` | radio | receiptDate | ng-disabled=!vm.filters.enableDateRange |
| `vm.filters.enableDateRange` | checkbox | disableDateRange |  |
| `vm.filters.vehicleNoArr` | ui-select |  |  |
| `vm.filters.trafficFileIdEN` | ui-select |  |  |
| `vm.filters.fineStatus` | select |  | ng-options=status.id as status.name for status in vm.fineStatuses |
| `vm.filters.isPayable` | select |  |  |
| `vm.filters.finesWithFailedVehicleMappings` | checkbox | finesWithFailedVehicleMappings |  |
| `vm.filters.isPaid` | select |  |  |
| `vm.filters.hasBlackPoints` | select |  |  |
| `vm.filters.sharingStatus` | select |  |  |
| `vm.filters.companyCode` | text |  |  |
| `vm.filters.hasConfiscationCharges` | checkbox | hasConfiscationCharges |  |
| `vm.filters.movementType` | select | tenantType | ng-options=item.id as item.type for item in vm.movementType |
| `vm.filters.fmsAgreementNo` | text |  |  |
| `vm.filters.fmsCustomer` | text |  |  |
| `vm.filters.fmsCode` | text |  |  |
| `vm.filters.fmsEmployee` | text |  |  |
| `vm.filters.customer` | text |  |  |
| `vm.filters.customer` | ui-select |  |  |
| `vm.filters.vehicleStatus` | select |  | ng-options=status.id as status.name for status in vm.invoiceStatuses |
| `vm.filters.status` | select |  | ng-options=status.id as status.name for status in vm.statuses |
| `vm.filters.debitJvStatus` | select |  |  |
| `vm.filters.externalFinesOnly` | checkbox | externalFinesOnly |  |
| `vm.filters.fineReceiptNo` | text |  |  |
| `vm.filters.receiptRefNo` | text |  |  |
| `vm.filters.locationId` | select | locationId |  |
| `vm.filters.hasLateCharges` | select |  |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
