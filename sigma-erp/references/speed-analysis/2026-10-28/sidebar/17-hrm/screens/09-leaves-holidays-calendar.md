# شاشة: Holidays Calendar

المسار في القائمة: HRM ← Leaves ←  Holidays Calendar.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.hrm_calendar_holiday`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0146](../../../readable/routes/R0146--tenant-hrm-calendar-holiday.js)، والأصل [raw/application.js:2547](../../../raw/application.js#L2547).
- قالب الشاشة: `~/App/tenant/views/hrm/holiday/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.common.hrm.holiday.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.common.hrm.holiday.index](../../../readable/controllers/C1586--tenant.views.common.hrm.holiday.index.js) | 12 | 3 |
| [tenant.views.crs.contacts.searchContactModal](../../../readable/controllers/C0706--tenant.views.crs.contacts.searchContactModal.js) | 7 | 2 |
| [tenant.views.hrm.holiday.createOrEditModal](../../../readable/controllers/C1585--tenant.views.hrm.holiday.createOrEditModal.js) | 2 | 2 |
| [tenant.views.hrm.holiday.viewModal](../../../readable/controllers/C1587--tenant.views.hrm.holiday.viewModal.js) | 1 | 1 |
| [tenant.views.crs.contacts.createOrEditModal](../../../readable/controllers/C0703--tenant.views.crs.contacts.createOrEditModal.js) | 45 | 24 |
| [tenant.views.crs.contacts.uploadDocumentModal](../../../readable/controllers/C0699--tenant.views.crs.contacts.uploadDocumentModal.js) | 2 | 1 |
| [tenant.views.crs.contacts.uploadDocumentModal](../../../readable/controllers/C0711--tenant.views.crs.contacts.uploadDocumentModal.js) | 2 | 1 |
| [tenant.views.common.documents.uploadDocumentModal](../../../readable/controllers/C0362--tenant.views.common.documents.uploadDocumentModal.js) | 4 | 0 |
| [tenant.views.common.documents.uploadImageModal](../../../readable/controllers/C0363--tenant.views.common.documents.uploadImageModal.js) | 3 | 0 |
| [tenant.views.common.documents.addCreditCardModal](../../../readable/controllers/C0701--tenant.views.common.documents.addCreditCardModal.js) | 4 | 0 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.common.hrm.holiday.index`: `getHolidays`، `dateRangeModelChanged`، `getlocalDateTime`، `getlocalDate`، `clearStaff`، `searchStaff`، `searchStaffPopoup`، `createHoliday`، `editHoliday`، `viewHoliday`، `deleteHoliday`، `getStatus`.
- وحدة `tenant.views.crs.contacts.searchContactModal`: `searchContacts`، `cancel`، `showAddContact`، `contactSelected`، `contactEdit`، `getContactsList`، `getNameWithCode`.
- وحدة `tenant.views.hrm.holiday.createOrEditModal`: `cancel`، `save`.
- وحدة `tenant.views.hrm.holiday.viewModal`: `cancel`.
- وحدة `tenant.views.crs.contacts.createOrEditModal`: `localize`، `removeExternalIdRow`، `addExternalIdRow`، `getContactExternalType`، `isContactExternalType`، `getlocalDate`، `getlocalDateTime`، `getCardType`، `removeRow`، `searchSalesPersons`، `searchUsersWithDesignation`، `searchSalesPersonPopoup`، `salesPersonSelected`، `searchDebtCollectorPopoup`، `searchCustomLookup`، `getCustomLookups`، `scanDocument`، `openUploadDocument`، `openUploadPicture`، `addCreditCardRow`، `updateCreditCardRow`، `save`، `cancel`، `isPersonVerifiedChange`، `doesIdentityDoucmentExist`، `addIndentityDocument`، `getIdentificationDocumentType`، `removeIndentityDocument`، `removeDoc`، `isFieldMondatory`، `searchCountries`، `emiratesDataReader`، `emiratesDataFieldManager`، `getTariffCards`، `getTariffCardForContact`، `isDocument`، `maskCreditCard`، `getAdvanceSettings`، `getHighLightBlackListCountries`، `getNationalIdFormates`، `nationalIdFormate`، `onOverRideChange`، `resetDocumentNo`، `nationIdMaskInput`، `handleResidenceStatusChange`.
- وحدة `tenant.views.crs.contacts.uploadDocumentModal`: `save`، `cancel`.
- وحدة `tenant.views.crs.contacts.uploadDocumentModal`: `save`، `cancel`.
- وحدة `tenant.views.common.documents.uploadDocumentModal`: `uploadHeader`، `uploader.onBeforeUploadItem`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.common.documents.uploadImageModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.common.documents.addCreditCardModal`: `ab`، `cardNumberChanged`، `save`، `cancel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.holiday.getHolidays` | POST | api/services/app/holiday/GetHolidays | [المصدر](../../../raw/application.js#L436992) |
| `abp.services.app.directory.search` | POST | api/services/app/directory/Search | [المصدر](../../../raw/application.js#L182771) |
| `abp.services.app.holiday.deleteHoliday` | POST | api/services/app/holiday/DeleteHoliday | [المصدر](../../../raw/application.js#L437129) |
| `abp.services.app.directory.searchDirectoryPaged` | POST | api/services/app/directory/SearchDirectoryPaged | [المصدر](../../../raw/application.js#L184666) |
| `abp.services.app.holiday.createOrUpdateHoliday` | POST | api/services/app/holiday/CreateOrUpdateHoliday | [المصدر](../../../raw/application.js#L436911) |
| `abp.services.app.holiday.getHolidayForEdit` | POST | api/services/app/holiday/GetHolidayForEdit | [المصدر](../../../raw/application.js#L436924) |
| `abp.services.app.directory.getHolidayForEdit` | غير مربوط | غير محسوم | [المصدر](../../../raw/application.js#L437230) |
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

- صلاحية `Pages.HRM.CalendarHoliday.View`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.HRM.CalendarHoliday.AddNew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.HRM.CalendarHoliday.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.HRM.CalendarHoliday.Delete`: ممنوحة في السياق الملتقط.
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
| `vm.dateRangeModel` | text |  | min=vm.dateRangeOptions.min; max=vm.dateRangeOptions.max; ng-disabled=!vm.filters.enableDateRange |
| `vm.filters.enableDateRange` | checkbox | disableDateRange |  |
| `vm.filters.name` | text |  |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
