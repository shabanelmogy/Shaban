# شاشة: NRMs

المسار في القائمة: Movements ← NRMs.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_staffMovements`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0295](../../../readable/routes/R0295--tenant-crs-staffmovements.js)، والأصل [raw/application.js:3636](../../../raw/application.js#L3636).
- قالب الشاشة: `~/App/tenant/views/crs/staffMovements/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.staffMovements.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.staffMovements.index](../../../readable/controllers/C1119--tenant.views.staffMovements.index.js) | 22 | 6 |
| [tenant.views.crs.contacts.searchContactModal](../../../readable/controllers/C0706--tenant.views.crs.contacts.searchContactModal.js) | 7 | 2 |
| [tenant.views.movements.printTemplates.printPreview](../../../readable/controllers/C1638--tenant.views.movements.printTemplates.printPreview.js) | 2 | 0 |
| [tenant.views.crs.staffMovement.createOrEditModal](../../../readable/controllers/C1118--tenant.views.crs.staffMovement.createOrEditModal.js) | 11 | 9 |
| [tenant.views.crs.staffMovements.closeStaffMovement](../../../readable/controllers/C1117--tenant.views.crs.staffMovements.closeStaffMovement.js) | 6 | 4 |
| [tenant.views.crs.contacts.createOrEditModal](../../../readable/controllers/C0703--tenant.views.crs.contacts.createOrEditModal.js) | 45 | 24 |
| [tenant.views.crs.vehicles.searchWithAccessoriesVehicles](../../../readable/controllers/C1187--tenant.views.crs.vehicles.searchWithAccessoriesVehicles.js) | 8 | 5 |
| [tenant.views.crs.contacts.uploadDocumentModal](../../../readable/controllers/C0699--tenant.views.crs.contacts.uploadDocumentModal.js) | 2 | 1 |
| [tenant.views.crs.contacts.uploadDocumentModal](../../../readable/controllers/C0711--tenant.views.crs.contacts.uploadDocumentModal.js) | 2 | 1 |
| [tenant.views.common.documents.uploadDocumentModal](../../../readable/controllers/C0362--tenant.views.common.documents.uploadDocumentModal.js) | 4 | 0 |
| [tenant.views.common.documents.uploadImageModal](../../../readable/controllers/C0363--tenant.views.common.documents.uploadImageModal.js) | 3 | 0 |
| [tenant.views.common.documents.addCreditCardModal](../../../readable/controllers/C0701--tenant.views.common.documents.addCreditCardModal.js) | 4 | 0 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.staffMovements.index`: `getMovementSubType`، `locationPermissionClose`، `locationPermissionEditDelete`، `getlocalDateTime`، `getlocalDate`، `getlocalizedString`، `searchCustomers`، `clearStaff`، `statusChanged`، `searchCustomerPopoup`، `getStaffMovements`، `getDriverMinutes`، `whatsAppSMS`، `sendEmail`، `checkCard`، `dateRangeCheck`، `exportToExcel`، `createStaffMovement`، `editStaffMovement`، `closeStaffMovement`، `viewStaffMovement`، `deleteStaffMovement`.
- وحدة `tenant.views.crs.contacts.searchContactModal`: `searchContacts`، `cancel`، `showAddContact`، `contactSelected`، `contactEdit`، `getContactsList`، `getNameWithCode`.
- وحدة `tenant.views.movements.printTemplates.printPreview`: `cancel`، `getTemplateUrl`.
- وحدة `tenant.views.crs.staffMovement.createOrEditModal`: `getMovementSubType`، `movementSubTypeChanged`، `localize`، `searchVehicles`، `searchCustomers`، `searchCustomerPopoup`، `searchDrivers`، `vehicleSelected`، `searchVehiclePopup`، `save`، `cancel`.
- وحدة `tenant.views.crs.staffMovements.closeStaffMovement`: `getMovementSubType`، `searchVehicles`، `getlocalDateTime`، `getFuelLevel`، `cancel`، `save`.
- وحدة `tenant.views.crs.contacts.createOrEditModal`: `localize`، `removeExternalIdRow`، `addExternalIdRow`، `getContactExternalType`، `isContactExternalType`، `getlocalDate`، `getlocalDateTime`، `getCardType`، `removeRow`، `searchSalesPersons`، `searchUsersWithDesignation`، `searchSalesPersonPopoup`، `salesPersonSelected`، `searchDebtCollectorPopoup`، `searchCustomLookup`، `getCustomLookups`، `scanDocument`، `openUploadDocument`، `openUploadPicture`، `addCreditCardRow`، `updateCreditCardRow`، `save`، `cancel`، `isPersonVerifiedChange`، `doesIdentityDoucmentExist`، `addIndentityDocument`، `getIdentificationDocumentType`، `removeIndentityDocument`، `removeDoc`، `isFieldMondatory`، `searchCountries`، `emiratesDataReader`، `emiratesDataFieldManager`، `getTariffCards`، `getTariffCardForContact`، `isDocument`، `maskCreditCard`، `getAdvanceSettings`، `getHighLightBlackListCountries`، `getNationalIdFormates`، `nationalIdFormate`، `onOverRideChange`، `resetDocumentNo`، `nationIdMaskInput`، `handleResidenceStatusChange`.
- وحدة `tenant.views.crs.vehicles.searchWithAccessoriesVehicles`: `searchWithAccessoriesVehiclesPaged`، `cancel`، `clearInput`، `getlocalDateTime`، `fromDateTimeChanged`، `searchVehicles`، `vehicleSelected`، `getBookingDate`.
- وحدة `tenant.views.crs.contacts.uploadDocumentModal`: `save`، `cancel`.
- وحدة `tenant.views.crs.contacts.uploadDocumentModal`: `save`، `cancel`.
- وحدة `tenant.views.common.documents.uploadDocumentModal`: `uploadHeader`، `uploader.onBeforeUploadItem`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.common.documents.uploadImageModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.common.documents.addCreditCardModal`: `ab`، `cardNumberChanged`، `save`، `cancel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.directory.search` | POST | api/services/app/directory/Search | [المصدر](../../../raw/application.js#L182771) |
| `abp.services.app.nrm.getNRM` | POST | api/services/app/nrm/GetNRM | [المصدر](../../../raw/application.js#L294576) |
| `abp.services.app.nrm.sendNRMWhatsAppSMSManual` | POST | api/services/app/nrm/SendNRMWhatsAppSMSManual | [المصدر](../../../raw/application.js#L294728) |
| `abp.services.app.nrm.sendNRMEmailManual` | POST | api/services/app/nrm/SendNRMEmailManual | [المصدر](../../../raw/application.js#L294743) |
| `abp.services.app.nrm.exportToExcelNRM` | POST | api/services/app/nrm/ExportToExcelNRM | [المصدر](../../../raw/application.js#L294788) |
| `abp.services.app.nrm.deleteNRM` | POST | api/services/app/nrm/DeleteNRM | [المصدر](../../../raw/application.js#L294866) |
| `abp.services.app.directory.searchDirectoryPaged` | POST | api/services/app/directory/SearchDirectoryPaged | [المصدر](../../../raw/application.js#L184666) |
| `abp.services.app.vehicle.searchWithAccessoriesVehicles` | POST | api/services/app/vehicle/SearchWithAccessoriesVehicles | [المصدر](../../../raw/application.js#L294218) |
| `abp.services.app.commonLookup.getLocations` | POST | api/services/app/commonLookup/GetLocations | [المصدر](../../../raw/application.js#L313326) |
| `abp.services.app.nrm.createOrUpdateNRM` | POST | api/services/app/nrm/CreateOrUpdateNRM | [المصدر](../../../raw/application.js#L294368) |
| `abp.services.app.vehicleAlerts.getServiceAlertForVehicle` | POST | api/services/app/vehicleAlerts/GetServiceAlertForVehicle | [المصدر](../../../raw/application.js#L294379) |
| `abp.services.app.nrm.getNRMForEdit` | POST | api/services/app/nrm/GetNRMForEdit | [المصدر](../../../raw/application.js#L294136) |
| `abp.services.app.vehicle.searchVehicles` | POST | api/services/app/vehicle/SearchVehicles | [المصدر](../../../raw/application.js#L294069) |
| `abp.services.app.nrm.closeNRM` | POST | api/services/app/nrm/CloseNRM | [المصدر](../../../raw/application.js#L294113) |
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
| `abp.services.app.vehicleModel.searchVehicleModelsNew` | POST | api/services/app/vehicleModel/SearchVehicleModelsNew | [المصدر](../../../raw/application.js#L313133) |
| `abp.services.app.vehicle.searchVehiclesPagedWorkShop` | POST | api/services/app/vehicle/SearchVehiclesPagedWorkShop | [المصدر](../../../raw/application.js#L313182) |
| `abp.services.app.vehicle.searchWithAccessoriesVehiclesPaged` | POST | api/services/app/vehicle/SearchWithAccessoriesVehiclesPaged | [المصدر](../../../raw/application.js#L313184) |
| `abp.services.app.commonLookup.getTariffGroups` | POST | api/services/app/commonLookup/GetTariffGroups | [المصدر](../../../raw/application.js#L313333) |
| `abp.services.app.person.uploadDocumentImage` | POST | api/services/app/person/UploadDocumentImage | [المصدر](../../../raw/application.js#L185476) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.StaffMovements`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.StaffMovements.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.StaffMovements.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.StaffMovements.Close`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.StaffMovements.Export`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.StaffMovements.Delete`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.StaffMovements.AllActionsOnOtherBranchStaffMovements`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Delete`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.StaffMovements.CanChangeKMOut`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.StaffMovements.CanChangeFuelOut`: ممنوحة في السياق الملتقط.
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
- صلاحية `Pages.Tenant.Vehicles.ViewOtherBranchVehicles`: ممنوحة في السياق الملتقط.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.filters.movementNo` | text |  |  |
| `vm.filters.movementSubType` | select | outDetail_fuelPercentage | ng-options=movement.id as movement.name for movement in vm.movementSubTypes |
| `vm.filters.IsCompleted` | select | outDetail_fuelPercentage |  |
| `vm.dateRangeModel` | text |  | min=vm.dateRangeOptions.min; max=vm.dateRangeOptions.max; ng-disabled=!vm.filters.enableDateRange |
| `vm.filters.enableDateRange` | checkbox | disableDateRange |  |
| `vm.filters.plateNo` | text |  |  |
| `vm.filters.customer` | ui-select |  |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
