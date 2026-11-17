# شاشة: Revenue Analysis

المسار في القائمة: Reports ← Revenue Analysis.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.report_RevenueAnalysis`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0523](../../../readable/routes/R0523--tenant-report-revenueanalysis.js)، والأصل [raw/application.js:5441](../../../raw/application.js#L5441).
- قالب الشاشة: `~/App/tenant/views/crs/reports/revenueAnalysis/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.revenueAnalysis.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.revenueAnalysis.index](../../../readable/controllers/C1043--tenant.views.crs.revenueAnalysis.index.js) | 13 | 3 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.revenueAnalysis.index`: `localize`، `dateRangeModelChanged`، `locationPermission`، `getlocalDateTime`، `getlocalDate`، `currencyFormate`، `roundingforView`، `getPerColumTotal`، `calculateLengthOfRevenue`، `rounding`، `calculateRevenuePerDay`، `exportToExcel`، `getEstimatedRevenueByVehicleType`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.commonLookup.getLocationsActiveAndInActive` | POST | api/services/app/commonLookup/GetLocationsActiveAndInActive | [المصدر](../../../raw/application.js#L279254) |
| `abp.services.app.estimatedRevenue.getVehicleTypes` | POST | api/services/app/estimatedRevenue/GetVehicleTypes | [المصدر](../../../raw/application.js#L279261) |
| `abp.services.app.estimatedRevenue.getRevenueAnalysis` | POST | api/services/app/estimatedRevenue/GetRevenueAnalysis | [المصدر](../../../raw/application.js#L279397) |

## الصلاحيات والحقول

لم يستخرج فحص صلاحية حرفي داخل الوحدات المرتبطة؛ افحص أيضًا شروط المسار والخادم.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.dateRangeModel` | text |  | min=vm.dateRangeOptions.min; max=vm.dateRangeOptions.max; ng-disabled=!vm.filters.enableDateRange |
| `vm.filters.locationId` | select | locationId |  |
| `vm.filters.vehicleTypeId` | select | vehicleTypeId | ng-options=type.id as type.title for type in vm.vehicleTypes |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
