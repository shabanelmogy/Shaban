# شاشة: Inquiries

المسار في القائمة: Lease ← Inquiries.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_leaseInquiries`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0374](../../../readable/routes/R0374--tenant-crs-leaseinquiries.js)، والأصل [raw/application.js:4230](../../../raw/application.js#L4230).
- قالب الشاشة: `~/App/tenant/views/crs/lease/leaseInquiries/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.lease.leaseInquiries.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.lease.leaseInquiries.index](../../../readable/controllers/C0868--tenant.views.crs.lease.leaseInquiries.index.js) | 17 | 4 |
| [tenant.views.crs.contacts.searchContactModal](../../../readable/controllers/C0706--tenant.views.crs.contacts.searchContactModal.js) | 7 | 2 |
| [tenant.views.crs.lease.leaseInquiries.createOrEditModal](../../../readable/controllers/C0866--tenant.views.crs.lease.leaseInquiries.createOrEditModal.js) | 13 | 8 |
| [tenant.views.crs.lease.leaseInquiries.changeLeaseInquiryStage](../../../readable/controllers/C0865--tenant.views.crs.lease.leaseInquiries.changeLeaseInquiryStage.js) | 3 | 1 |
| [tenant.views.crs.lease.leaseInquiries.leaseInquiryLogs](../../../readable/controllers/C0869--tenant.views.crs.lease.leaseInquiries.leaseInquiryLogs.js) | 2 | 1 |
| [tenant.views.crs.lease.leaseQuotations.createOrEditQuotationModal](../../../readable/controllers/C0877--tenant.views.crs.lease.leaseQuotations.createOrEditQuotationModal.js) | 24 | 12 |
| [tenant.views.crs.contacts.createOrEditModal](../../../readable/controllers/C0703--tenant.views.crs.contacts.createOrEditModal.js) | 45 | 24 |
| [tenant.views.crs.vehicles.searchVehicleModal](../../../readable/controllers/C1186--tenant.views.crs.vehicles.searchVehicleModal.js) | 13 | 11 |
| [tenant.views.crs.lease.leaseQuotations.calculationQuotationDetail](../../../readable/controllers/C0875--tenant.views.crs.lease.leaseQuotations.calculationQuotationDetail.js) | 8 | 1 |
| [tenant.views.crs.contacts.uploadDocumentModal](../../../readable/controllers/C0699--tenant.views.crs.contacts.uploadDocumentModal.js) | 2 | 1 |
| [tenant.views.crs.contacts.uploadDocumentModal](../../../readable/controllers/C0711--tenant.views.crs.contacts.uploadDocumentModal.js) | 2 | 1 |
| [tenant.views.common.documents.uploadDocumentModal](../../../readable/controllers/C0362--tenant.views.common.documents.uploadDocumentModal.js) | 4 | 0 |
| [tenant.views.common.documents.uploadImageModal](../../../readable/controllers/C0363--tenant.views.common.documents.uploadImageModal.js) | 3 | 0 |
| [tenant.views.common.documents.addCreditCardModal](../../../readable/controllers/C0701--tenant.views.common.documents.addCreditCardModal.js) | 4 | 0 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.lease.leaseInquiries.index`: `getlocalizedString`، `dateRangeCheck`، `searchContact`، `searchContactPopoup`، `getLeaseInquiry`، `getlocalDateTime`، `exportToExcel`، `deleteLeaseInquiry`، `openViewInquiry`، `openEditInquiry`، `openleaseQuotation`، `openLeaseInquiryStage`، `openLeaseInquiryLog`، `createLeaseInquiry`، `deleteExpensePayment`، `enterKeyPress`، `clearCustomer`.
- وحدة `tenant.views.crs.contacts.searchContactModal`: `searchContacts`، `cancel`، `showAddContact`، `contactSelected`، `contactEdit`، `getContactsList`، `getNameWithCode`.
- وحدة `tenant.views.crs.lease.leaseInquiries.createOrEditModal`: `getlocalizedString`، `searchVehicles`، `searchModel`، `searchContact`، `searchSalePerson`، `searchContactPerson`، `getTariffGroups`، `searchContactPopoup`، `searchVehiclePopup`، `addRow`، `removeRow`، `cancel`، `save`.
- وحدة `tenant.views.crs.lease.leaseInquiries.changeLeaseInquiryStage`: `getlocalDateTime`، `cancel`، `save`.
- وحدة `tenant.views.crs.lease.leaseInquiries.leaseInquiryLogs`: `getlocalDateTime`، `cancel`.
- وحدة `tenant.views.crs.lease.leaseQuotations.createOrEditQuotationModal`: `rounding`، `localize`، `getPeriodType`، `getRateType`، `vehicleTypeChanged`، `roundingforView`، `quotationTypeChanged`، `calculationDetail`، `calculationDetailView`، `qunatityChanged`، `calculate`، `modelSelected`، `searchContact`، `searchContactPerson`، `customerChanged`، `searchContactPopoup`، `searchModel`، `getTariffGroups`، `getStatus`، `addRow`، `removeRow`، `cancel`، `getcostingParameters`، `save`.
- وحدة `tenant.views.crs.contacts.createOrEditModal`: `localize`، `removeExternalIdRow`، `addExternalIdRow`، `getContactExternalType`، `isContactExternalType`، `getlocalDate`، `getlocalDateTime`، `getCardType`، `removeRow`، `searchSalesPersons`، `searchUsersWithDesignation`، `searchSalesPersonPopoup`، `salesPersonSelected`، `searchDebtCollectorPopoup`، `searchCustomLookup`، `getCustomLookups`، `scanDocument`، `openUploadDocument`، `openUploadPicture`، `addCreditCardRow`، `updateCreditCardRow`، `save`، `cancel`، `isPersonVerifiedChange`، `doesIdentityDoucmentExist`، `addIndentityDocument`، `getIdentificationDocumentType`، `removeIndentityDocument`، `removeDoc`، `isFieldMondatory`، `searchCountries`، `emiratesDataReader`، `emiratesDataFieldManager`، `getTariffCards`، `getTariffCardForContact`، `isDocument`، `maskCreditCard`، `getAdvanceSettings`، `getHighLightBlackListCountries`، `getNationalIdFormates`، `nationalIdFormate`، `onOverRideChange`، `resetDocumentNo`، `nationIdMaskInput`، `handleResidenceStatusChange`.
- وحدة `tenant.views.crs.vehicles.searchVehicleModal`: `statusChanged`، `searchModel`، `cancel`، `clearInput`، `clearVehicle`، `getlocalDateTime`، `fromDateTimeChanged`، `searchVehicles`، `searchVehiclesFilters`، `exportToExcelByAgreement`، `vehicleSelected`، `getBookingDate`، `getTeriffGroups`.
- وحدة `tenant.views.crs.lease.leaseQuotations.calculationQuotationDetail`: `includedChanged`، `localize`، `CurrencyFormate`، `currencyAndRounding`، `calculateEmi`، `ok`، `cancel`، `modelSelected`.
- وحدة `tenant.views.crs.contacts.uploadDocumentModal`: `save`، `cancel`.
- وحدة `tenant.views.crs.contacts.uploadDocumentModal`: `save`، `cancel`.
- وحدة `tenant.views.common.documents.uploadDocumentModal`: `uploadHeader`، `uploader.onBeforeUploadItem`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.common.documents.uploadImageModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.common.documents.addCreditCardModal`: `ab`، `cardNumberChanged`، `save`، `cancel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.directory.search` | POST | api/services/app/directory/Search | [المصدر](../../../raw/application.js#L182771) |
| `abp.services.app.leaseInquiry.getLeaseInquiries` | POST | api/services/app/leaseInquiry/GetLeaseInquiries | [المصدر](../../../raw/application.js#L237080) |
| `abp.services.app.leaseInquiry.exportToExcel` | POST | api/services/app/leaseInquiry/ExportToExcel | [المصدر](../../../raw/application.js#L237109) |
| `abp.services.app.leaseInquiry.deleteLeaseInquiry` | POST | api/services/app/leaseInquiry/DeleteLeaseInquiry | [المصدر](../../../raw/application.js#L237221) |
| `abp.services.app.directory.searchDirectoryPaged` | POST | api/services/app/directory/SearchDirectoryPaged | [المصدر](../../../raw/application.js#L184666) |
| `abp.services.app.vehicle.searchVehicles` | POST | api/services/app/vehicle/SearchVehicles | [المصدر](../../../raw/application.js#L312838) |
| `abp.services.app.vehicleModel.searchVehicleModelsNew` | POST | api/services/app/vehicleModel/SearchVehicleModelsNew | [المصدر](../../../raw/application.js#L312735) |
| `abp.services.app.directory.searchForCompany` | POST | api/services/app/directory/SearchForCompany | [المصدر](../../../raw/application.js#L239742) |
| `abp.services.app.commonLookup.getTariffGroups` | POST | api/services/app/commonLookup/GetTariffGroups | [المصدر](../../../raw/application.js#L313062) |
| `abp.services.app.leaseInquiry.createOrUpdateLeaseInquiry` | POST | api/services/app/leaseInquiry/CreateOrUpdateLeaseInquiry | [المصدر](../../../raw/application.js#L236712) |
| `abp.services.app.leaseInquiry.getLeaseInquiryForEdit` | POST | api/services/app/leaseInquiry/GetLeaseInquiryForEdit | [المصدر](../../../raw/application.js#L239826) |
| `abp.services.app.leaseInquiry.updateLeaseInquiryStage` | POST | api/services/app/leaseInquiry/UpdateLeaseInquiryStage | [المصدر](../../../raw/application.js#L236541) |
| `abp.services.app.leaseInquiry.getLeaseInquiryLogs` | POST | api/services/app/leaseInquiry/GetLeaseInquiryLogs | [المصدر](../../../raw/application.js#L237427) |
| `abp.services.app.eRSTariff.getTariff` | POST | api/services/app/eRSTariff/GetTariff | [المصدر](../../../raw/application.js#L239399) |
| `abp.services.app.costSetting.getCostSettingByModel` | POST | api/services/app/costSetting/GetCostSettingByModel | [المصدر](../../../raw/application.js#L238873) |
| `abp.services.app.costParameter.getcostingParameters` | POST | api/services/app/costParameter/GetcostingParameters | [المصدر](../../../raw/application.js#L239851) |
| `abp.services.app.leaseQuotation.getLeaseQuotationForRevision` | POST | api/services/app/leaseQuotation/GetLeaseQuotationForRevision | [المصدر](../../../raw/application.js#L239864) |
| `abp.services.app.leaseQuotation.getLeaseQuotationForEdit` | POST | api/services/app/leaseQuotation/GetLeaseQuotationForEdit | [المصدر](../../../raw/application.js#L239866) |
| `abp.services.app.leaseQuotation.reviseLeaseQuotation` | POST | api/services/app/leaseQuotation/ReviseLeaseQuotation | [المصدر](../../../raw/application.js#L239903) |
| `abp.services.app.leaseQuotation.createOrUpdateLeaseQuotation` | POST | api/services/app/leaseQuotation/CreateOrUpdateLeaseQuotation | [المصدر](../../../raw/application.js#L239905) |
| `abp.services.app.chargesSetting.getChargesTypes` | POST | api/services/app/chargesSetting/GetChargesTypes | [المصدر](../../../raw/application.js#L182581) |
| `abp.services.app.commonLookup.getLocations` | POST | api/services/app/commonLookup/GetLocations | [المصدر](../../../raw/application.js#L313017) |
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
| `abp.services.app.vehicle.searchVehiclesPagedWorkShop` | POST | api/services/app/vehicle/SearchVehiclesPagedWorkShop | [المصدر](../../../raw/application.js#L312796) |
| `abp.services.app.vehicle.searchVehiclesPagedByAgreement` | POST | [object Object] | [المصدر](../../../raw/application.js#L312800) |
| `abp.services.app.vehicle.searchVehiclesPaged` | POST | api/services/app/vehicle/SearchVehiclesPaged | [المصدر](../../../raw/application.js#L312803) |
| `abp.services.app.vehicle.exportToExcelByAgreement` | POST | api/services/app/vehicle/ExportToExcelByAgreement | [المصدر](../../../raw/application.js#L312885) |
| `abp.services.app.person.uploadDocumentImage` | POST | api/services/app/person/UploadDocumentImage | [المصدر](../../../raw/application.js#L185476) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.Lease.Inquiry.Stage`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Delete`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Lease.CostSettings.ManageVehicleCost`: ممنوحة في السياق الملتقط.
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
| `vm.filters.inquiryNo` | text |  |  |
| `vm.dateRangeModel` | text |  | min=vm.dateRangeOptions.min; max=vm.dateRangeOptions.max; ng-disabled=!vm.filters.enableDateRange |
| `vm.filters.enableDateRange` | checkbox | disableDateRange |  |
| `vm.filters.leaseInquiryStage` | select | leaseInquiryStage | ng-options=stage.value as stage.key for stage in vm.leaseInquiryStage |
| `vm.filters.customer` | ui-select |  |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
