# شاشة: Point In Time Sales Performance Report

المسار في القائمة: Reports ← Point In Time Sales Performance Report.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.report_PointInTimeSalesPerformanceReport`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0528](../../../readable/routes/R0528--tenant-report-pointintimesalesperformancereport.js)، والأصل [raw/application.js:5491](../../../raw/application.js#L5491).
- قالب الشاشة: `~/App/tenant/views/crs/reports/pointInTime/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.reports.pointInTime.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.reports.pointInTime.index](../../../readable/controllers/C1034--tenant.views.crs.reports.pointInTime.index.js) | 8 | 3 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.reports.pointInTime.index`: `getAgreementType`، `currencyFormat`، `roundingforView`، `searchUsers`، `searchUsersWithDesignation`، `clearSalesPerson`، `exportToExcel`، `getPointInTimeSalePerformanceReport`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.directory.search` | POST | api/services/app/directory/Search | [المصدر](../../../raw/application.js#L276788) |
| `abp.services.app.directory.searchSalesPerson` | POST | api/services/app/directory/SearchSalesPerson | [المصدر](../../../raw/application.js#L276796) |
| `abp.services.app.agreementSalePerformanceReport.getPointInTimeSalePerformanceReport` | POST | api/services/app/agreementSalePerformanceReport/GetPointInTimeSalePerformanceReport | [المصدر](../../../raw/application.js#L276895) |

## الصلاحيات والحقول

لم يستخرج فحص صلاحية حرفي داخل الوحدات المرتبطة؛ افحص أيضًا شروط المسار والخادم.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.date` | input |  |  |
| `vm.filters.salesPerson` | ui-select |  |  |
| `vm.filters.salesPerson` | select | salePerson | ng-options=status as status.name for status in vm.userList |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
