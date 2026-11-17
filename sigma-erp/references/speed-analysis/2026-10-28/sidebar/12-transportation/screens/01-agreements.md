# شاشة: Agreements

المسار في القائمة:  Transportation ← Agreements.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_transAgreements`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0274](../../../readable/routes/R0274--tenant-crs-transagreements.js)، والأصل [raw/application.js:3490](../../../raw/application.js#L3490).
- قالب الشاشة: `~/App/tenant/views/crs/transportation/agreements/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.transportation.agreements.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.transportation.agreements.index](../../../readable/controllers/C1142--tenant.views.transportation.agreements.index.js) | 25 | 6 |
| [common.views.common.reportViewer](../../../readable/controllers/C0006--common.views.common.reportViewer.js) | 2 | 0 |
| [tenant.views.crs.contacts.searchContactModal](../../../readable/controllers/C0706--tenant.views.crs.contacts.searchContactModal.js) | 7 | 2 |
| [tenant.views.crs.vehicles.searchVehicleModal](../../../readable/controllers/C1186--tenant.views.crs.vehicles.searchVehicleModal.js) | 13 | 11 |
| [tenant.views.crs.transportation.agreements.printtemplates.printPreview](../../../readable/controllers/C1147--tenant.views.crs.transportation.agreements.printtemplates.printPreview.js) | 2 | 0 |
| [tenant.views.crs.transportation.agreements.viewModal](../../../readable/controllers/C1145--tenant.views.crs.transportation.agreements.viewModal.js) | 5 | 1 |
| [tenant.views.crs.transportation.agreements.createOrEditModal](../../../readable/controllers/C1141--tenant.views.crs.transportation.agreements.createOrEditModal.js) | 15 | 7 |
| [tenant.views.crs.transportation.agreements.closeAgreementModal](../../../readable/controllers/C1140--tenant.views.crs.transportation.agreements.closeAgreementModal.js) | 3 | 2 |
| [tenant.views.crs.agreements.closeAgreementModal](../../../readable/controllers/C0529--tenant.views.crs.agreements.closeAgreementModal.js) | 35 | 13 |
| [tenant.views.crs.contacts.createOrEditModal](../../../readable/controllers/C0703--tenant.views.crs.contacts.createOrEditModal.js) | 45 | 24 |
| [tenant.views.crs.agreements.mileageChargesInfoModal](../../../readable/controllers/C0541--tenant.views.crs.agreements.mileageChargesInfoModal.js) | 1 | 0 |
| [tenant.views.crs.agreements.tollsDetailModal](../../../readable/controllers/C0549--tenant.views.crs.agreements.tollsDetailModal.js) | 3 | 2 |
| [tenant.views.crs.agreements.finesDetailModal](../../../readable/controllers/C0538--tenant.views.crs.agreements.finesDetailModal.js) | 3 | 3 |
| [tenant.views.crs.agreements.parkingDetailModal](../../../readable/controllers/C0542--tenant.views.crs.agreements.parkingDetailModal.js) | 3 | 2 |
| [tenant.views.crs.contacts.uploadDocumentModal](../../../readable/controllers/C0699--tenant.views.crs.contacts.uploadDocumentModal.js) | 2 | 1 |
| [tenant.views.crs.contacts.uploadDocumentModal](../../../readable/controllers/C0711--tenant.views.crs.contacts.uploadDocumentModal.js) | 2 | 1 |
| [tenant.views.common.documents.uploadDocumentModal](../../../readable/controllers/C0362--tenant.views.common.documents.uploadDocumentModal.js) | 4 | 0 |
| [tenant.views.common.documents.uploadImageModal](../../../readable/controllers/C0363--tenant.views.common.documents.uploadImageModal.js) | 3 | 0 |
| [tenant.views.common.documents.addCreditCardModal](../../../readable/controllers/C0701--tenant.views.common.documents.addCreditCardModal.js) | 4 | 0 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.transportation.agreements.index`: `dateRangeModelChanged`، `locationPermissionEditDelete`، `formatNumber`، `locationPermissionClose`، `getlocalDateTime`، `report`، `getlocalDate`، `getTransAgreementStatus`، `searchCustomers`، `searchCustomerPopoup`، `searchDrivers`، `searchDriverPopoup`، `searchVehiclePopup`، `clearCustomer`، `clearDriver`، `clearVehicle`، `getlocalizedString`، `getTransAgreements`، `transAgreementPrintModal`، `exportToExcel`، `viewTransAgreement`، `createAgreement`، `editTransAgreement`، `closeTransAgreement`، `deleteTransAgreement`.
- وحدة `common.views.common.reportViewer`: `exportToExcelFromReport`، `cancel`.
- وحدة `tenant.views.crs.contacts.searchContactModal`: `searchContacts`، `cancel`، `showAddContact`، `contactSelected`، `contactEdit`، `getContactsList`، `getNameWithCode`.
- وحدة `tenant.views.crs.vehicles.searchVehicleModal`: `statusChanged`، `searchModel`، `cancel`، `clearInput`، `clearVehicle`، `getlocalDateTime`، `fromDateTimeChanged`، `searchVehicles`، `searchVehiclesFilters`، `exportToExcelByAgreement`، `vehicleSelected`، `getBookingDate`، `getTeriffGroups`.
- وحدة `tenant.views.crs.transportation.agreements.printtemplates.printPreview`: `cancel`، `getTemplateUrl`.
- وحدة `tenant.views.crs.transportation.agreements.viewModal`: `localizeWeekDays`، `localize`، `getlocalDateTime`، `getlocalTime`، `cancel`.
- وحدة `tenant.views.crs.transportation.agreements.createOrEditModal`: `localizeWeekDays`، `localize`، `searchVehicles`، `searchCustomers`، `searchCustomerPopoup`، `searchDrivers`، `searchDriverPopoup`، `searchVehiclePopup`، `removeRow`، `addRow`، `searchLocations`، `getlocalDateTime`، `getlocalTime`، `cancel`، `save`.
- وحدة `tenant.views.crs.transportation.agreements.closeAgreementModal`: `getlocalDateTime`، `cancel`، `closeTransAgreement`.
- وحدة `tenant.views.crs.agreements.closeAgreementModal`: `localize`، `localizeChargesType`، `getlocalDateTime`، `getAgreementType`، `tariffOptionSelected`، `calculateMileage`، `includedChanged`، `getFuelLevel`، `searchGoogleLocations`، `endDateChanged`، `calculate`، `sumCharges`، `taxAcceptedChanged`، `tollsCount`، `openMileageInfoModal`، `chargesAcceptanceChanged`، `generateFineInvoice`، `totalDaysAndTime`، `save`، `showTollsDetail`، `showFinesDetail`، `showParkingDetail`، `cancel`، `callbackOnComplete`، `downloadTollsV3`، `sendCaptcha`، `focusWindow`، `closeAllTabs`، `fetchTolls`، `fetchDarbTolls`، `fetchFines`، `fetchParking`، `showError`، `hasError`، `ok`.
- وحدة `tenant.views.crs.contacts.createOrEditModal`: `localize`، `removeExternalIdRow`، `addExternalIdRow`، `getContactExternalType`، `isContactExternalType`، `getlocalDate`، `getlocalDateTime`، `getCardType`، `removeRow`، `searchSalesPersons`، `searchUsersWithDesignation`، `searchSalesPersonPopoup`، `salesPersonSelected`، `searchDebtCollectorPopoup`، `searchCustomLookup`، `getCustomLookups`، `scanDocument`، `openUploadDocument`، `openUploadPicture`، `addCreditCardRow`، `updateCreditCardRow`، `save`، `cancel`، `isPersonVerifiedChange`، `doesIdentityDoucmentExist`، `addIndentityDocument`، `getIdentificationDocumentType`، `removeIndentityDocument`، `removeDoc`، `isFieldMondatory`، `searchCountries`، `emiratesDataReader`، `emiratesDataFieldManager`، `getTariffCards`، `getTariffCardForContact`، `isDocument`، `maskCreditCard`، `getAdvanceSettings`، `getHighLightBlackListCountries`، `getNationalIdFormates`، `nationalIdFormate`، `onOverRideChange`، `resetDocumentNo`، `nationIdMaskInput`، `handleResidenceStatusChange`.
- وحدة `tenant.views.crs.agreements.mileageChargesInfoModal`: `cancel`.
- وحدة `tenant.views.crs.agreements.tollsDetailModal`: `getlocalDateTime`، `getServerName`، `cancel`.
- وحدة `tenant.views.crs.agreements.finesDetailModal`: `getlocalDateTime`، `ignoreFine`، `cancel`.
- وحدة `tenant.views.crs.agreements.parkingDetailModal`: `getlocalDateTime`، `getServerName`، `cancel`.
- وحدة `tenant.views.crs.contacts.uploadDocumentModal`: `save`، `cancel`.
- وحدة `tenant.views.crs.contacts.uploadDocumentModal`: `save`، `cancel`.
- وحدة `tenant.views.common.documents.uploadDocumentModal`: `uploadHeader`، `uploader.onBeforeUploadItem`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.common.documents.uploadImageModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.common.documents.addCreditCardModal`: `ab`، `cardNumberChanged`، `save`، `cancel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.directory.search` | POST | api/services/app/directory/Search | [المصدر](../../../raw/application.js#L182771) |
| `abp.services.app.commonLookup.getLocations` | POST | api/services/app/commonLookup/GetLocations | [المصدر](../../../raw/application.js#L182597) |
| `abp.services.app.transAgreement.getTransAgreements` | POST | api/services/app/transAgreement/GetTransAgreements | [المصدر](../../../raw/application.js#L299516) |
| `abp.services.app.transAgreement.exportToExcel` | POST | api/services/app/transAgreement/ExportToExcel | [المصدر](../../../raw/application.js#L299671) |
| `abp.services.app.transAgreement.deleteTransAgreement` | POST | api/services/app/transAgreement/DeleteTransAgreement | [المصدر](../../../raw/application.js#L299772) |
| `abp.services.app.directory.searchDirectoryPaged` | POST | api/services/app/directory/SearchDirectoryPaged | [المصدر](../../../raw/application.js#L184666) |
| `abp.services.app.vehicleModel.searchVehicleModelsNew` | POST | api/services/app/vehicleModel/SearchVehicleModelsNew | [المصدر](../../../raw/application.js#L312735) |
| `abp.services.app.vehicle.searchVehiclesPagedWorkShop` | POST | api/services/app/vehicle/SearchVehiclesPagedWorkShop | [المصدر](../../../raw/application.js#L312796) |
| `abp.services.app.vehicle.searchVehiclesPagedByAgreement` | POST | [object Object] | [المصدر](../../../raw/application.js#L312800) |
| `abp.services.app.vehicle.searchVehiclesPaged` | POST | api/services/app/vehicle/SearchVehiclesPaged | [المصدر](../../../raw/application.js#L312803) |
| `abp.services.app.vehicle.searchVehicles` | POST | api/services/app/vehicle/SearchVehicles | [المصدر](../../../raw/application.js#L299073) |
| `abp.services.app.vehicle.exportToExcelByAgreement` | POST | api/services/app/vehicle/ExportToExcelByAgreement | [المصدر](../../../raw/application.js#L312885) |
| `abp.services.app.commonLookup.getTariffGroups` | POST | api/services/app/commonLookup/GetTariffGroups | [المصدر](../../../raw/application.js#L313062) |
| `abp.services.app.transAgreement.getTransAgreementForEdit` | POST | api/services/app/transAgreement/GetTransAgreementForEdit | [المصدر](../../../raw/application.js#L299241) |
| `abp.services.app.commonLookup.searchTransportationLocations` | POST | api/services/app/commonLookup/SearchTransportationLocations | [المصدر](../../../raw/application.js#L299190) |
| `abp.services.app.transAgreement.createOrUpdateTransAgreement` | POST | api/services/app/transAgreement/CreateOrUpdateTransAgreement | [المصدر](../../../raw/application.js#L299228) |
| `abp.services.app.transAgreement.closeTransAgreement` | POST | api/services/app/transAgreement/CloseTransAgreement | [المصدر](../../../raw/application.js#L299011) |
| `abp.services.app.transAgreement.getTransAgreement` | POST | api/services/app/transAgreement/GetTransAgreement | [المصدر](../../../raw/application.js#L299022) |
| `abp.services.app.commonLookup.searchGooglePlaces` | POST | api/services/app/commonLookup/SearchGooglePlaces | [المصدر](../../../raw/application.js#L135899) |
| `abp.services.app.invoice.generatFineInvoiceByAgreementId` | POST | api/services/app/invoice/GeneratFineInvoiceByAgreementId | [المصدر](../../../raw/application.js#L136089) |
| `abp.services.app.agreement.closeAgreement` | POST | api/services/app/agreement/CloseAgreement | [المصدر](../../../raw/application.js#L136200) |
| `abp.services.app.rentalAgreementSearch.getAgreementForClosing` | POST | api/services/app/rentalAgreementSearch/GetAgreementForClosing | [المصدر](../../../raw/application.js#L136357) |
| `abp.services.app.toll.prepareDataForExtension` | POST | api/services/app/toll/PrepareDataForExtension | [المصدر](../../../raw/application.js#L136644) |
| `abp.services.app.uaeFine.getTrafficFilesOnVehicles` | POST | api/services/app/uaeFine/GetTrafficFilesOnVehicles | [المصدر](../../../raw/application.js#L136690) |
| `abp.services.app.toll.getTolls` | POST | api/services/app/toll/GetTolls | [المصدر](../../../raw/application.js#L148586) |
| `abp.services.app.uaeFine.getFines` | POST | api/services/app/uaeFine/GetFines | [المصدر](../../../raw/application.js#L142511) |
| `abp.services.app.parkingTicket.getParkingTicketOnClosingAgreement` | POST | api/services/app/parkingTicket/GetParkingTicketOnClosingAgreement | [المصدر](../../../raw/application.js#L136950) |
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
| `abp.services.app.commonAgreement.getAgreement` | POST | api/services/app/commonAgreement/GetAgreement | [المصدر](../../../raw/application.js#L145578) |
| `abp.services.app.uaeFine.ignoreFine` | POST | api/services/app/uaeFine/IgnoreFine | [المصدر](../../../raw/application.js#L142477) |
| `abp.services.app.parkingTicket.getParkingTicket` | POST | api/services/app/parkingTicket/GetParkingTicket | [المصدر](../../../raw/application.js#L145561) |
| `abp.services.app.person.uploadDocumentImage` | POST | api/services/app/person/UploadDocumentImage | [المصدر](../../../raw/application.js#L185476) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.Transportation.Agreements`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Transportation.Agreements.Open`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Transportation.Agreements.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Transportation.Agreements.Close`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Transportation.Agreements.Delete`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Delete`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vehicles.ViewOtherBranchVehicles`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.CanChangeChargesOnClosing`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.CanChangeOnlyRecurringCharges`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.CanChangeDiscount`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.PreClose.AllowLimitedUsersToEditOneTimeChargesOnPreClose`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.AllActionsOnOtherBranchAgreements`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.ViewOtherBranchAgreements`: ممنوحة في السياق الملتقط.
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
| `vm.filters.agreementNo` | text |  |  |
| `vm.dateRangeModel` | text |  | min=vm.dateRangeOptions.min; max=vm.dateRangeOptions.max |
| `vm.filters.status` | select |  | ng-options=status.id as status.name for status in vm.statuses |
| `vm.filters.customer` | ui-select |  |  |
| `vm.filters.plateNo` | text |  |  |
| `vm.filters.driver` | ui-select |  |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
