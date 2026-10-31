# شاشة: Agreements Report

المسار في القائمة: Reports ← Agreements Report.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.report_AgreementsReport`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0587](../../../readable/routes/R0587--tenant-report-agreementsreport.js)، والأصل [raw/application.js:5968](../../../raw/application.js#L5968).
- قالب الشاشة: `~/App/tenant/views/crs/reports/agreementsReport/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.agreementsReport.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.agreementsReport.index](../../../readable/controllers/C0967--tenant.views.agreementsReport.index.js) | 19 | 6 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.agreementsReport.index`: `searchSaleOrigin`، `clearSaleOrigin`، `getDiscountedRate`، `getlocalDateTime`، `dateRangeModelChanged`، `searchUsers`، `getlocalDateTime`، `getAgreementsByCategory`، `getFleetType`، `statusChanged`، `getlocalDate`، `roundingforView`، `dateRangeCheck`، `getAgreements`، `searchCustomers`، `clearCustomer`، `clearSalesPerson`، `exportToExcel`، `getStatus`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.saleOrigin.getSaleOrigins` | POST | api/services/app/saleOrigin/GetSaleOrigins | [المصدر](../../../raw/application.js#L262837) |
| `abp.services.app.commonLookup.getLocationsActiveAndInActive` | POST | api/services/app/commonLookup/GetLocationsActiveAndInActive | [المصدر](../../../raw/application.js#L262874) |
| `abp.services.app.directory.search` | POST | api/services/app/directory/Search | [المصدر](../../../raw/application.js#L263052) |
| `abp.services.app.commonAgreement.getAllAgreementsReport` | POST | api/services/app/commonAgreement/GetAllAgreementsReport | [المصدر](../../../raw/application.js#L263040) |
| `abp.services.app.commonAgreement.exportToExcelAgreementsReport` | POST | api/services/app/commonAgreement/ExportToExcelAgreementsReport | [المصدر](../../../raw/application.js#L263068) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.Agreements.ViewOtherBranchAgreements`: ممنوحة في السياق الملتقط.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.filters.agreementNo` | text |  |  |
| `vm.filters.plateNo` | text |  |  |
| `vm.filters.modelYear` | text |  |  |
| `vm.filters.locationId` | select | locationId |  |
| `vm.filters.vehicleType` | select | vehicleType | ng-options=vehicleType.value as vehicleType.key for vehicleType in vm.vehicleTypes |
| `vm.dateRangeModel` | text |  | min=vm.dateRangeOptions.min; max=vm.dateRangeOptions.max; ng-disabled=!vm.filters.enableDateRange |
| `vm.filters.enableDateRange` | checkbox | disableDateRange |  |
| `vm.filters.agreementCategory` | select | AgreementCategories | ng-options=item.id as item.type for item in vm.agreementCategories |
| `vm.filters.agreementType` | select | agreementType | ng-options=item.id as item.type for item in vm.agreementTypes |
| `vm.filters.status` | select |  | ng-options=status.id as status.name for status in vm.statuses |
| `vm.filters.customer` | ui-select |  |  |
| `vm.filters.salesPerson` | ui-select |  |  |
| `vm.filters.saleOrigin` | ui-select |  |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
