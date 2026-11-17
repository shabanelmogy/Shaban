# شاشة: Detailed Vehicle Utilization Report

المسار في القائمة: Reports ← Detailed Vehicle Utilization Report.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_detailedVehicleUtilizationReport`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0434](../../../readable/routes/R0434--tenant-crs-detailedvehicleutilizationreport.js)، والأصل [raw/application.js:4716](../../../raw/application.js#L4716).
- قالب الشاشة: `~/App/tenant/views/crs/reports/detailedVehicleUtilizationReport/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.reports.detailedVehicleUtilizationReport.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.reports.detailedVehicleUtilizationReport.index](../../../readable/controllers/C0990--tenant.views.crs.reports.detailedVehicleUtilizationReport.index.js) | 6 | 1 |
| [tenant.views.crs.reports.detailedVehicleUtilizationReport.vehicleUtilizationDetail](../../../readable/controllers/C0991--tenant.views.crs.reports.detailedVehicleUtilizationReport.vehicleUtilizationDetail.js) | 2 | 0 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.reports.detailedVehicleUtilizationReport.index`: `getlocalDateTime`، `getlocalDay`، `roundingforView`، `exportToExcelMethod`، `getDetailedVehicleUtilizationReport`، `report`.
- وحدة `tenant.views.crs.reports.detailedVehicleUtilizationReport.vehicleUtilizationDetail`: `cancel`، `exportToExcel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.detailedVehicleUtilization.getDetailedVehicleUtilizationReport` | POST | api/services/app/detailedVehicleUtilization/GetDetailedVehicleUtilizationReport | [المصدر](../../../raw/application.js#L268679) |

## الصلاحيات والحقول

لم يستخرج فحص صلاحية حرفي داخل الوحدات المرتبطة؛ افحص أيضًا شروط المسار والخادم.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.filters.monthYear` | input | date |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
