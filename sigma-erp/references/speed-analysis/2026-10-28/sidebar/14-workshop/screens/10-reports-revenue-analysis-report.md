# شاشة: Revenue Analysis Report

المسار في القائمة: Workshop ← Reports ← Revenue Analysis Report.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.CRS_RevenueAnalysisReport`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0558](../../../readable/routes/R0558--tenant-crs-revenueanalysisreport.js)، والأصل [raw/application.js:5760](../../../raw/application.js#L5760).
- قالب الشاشة: `~/App/tenant/views/workshop/workshopReports/revenueAnalysisReport/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.workshop.workshopReports.revenueAnalysisReport.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.workshop.workshopReports.revenueAnalysisReport.index](../../../readable/controllers/C1830--tenant.views.workshop.workshopReports.revenueAnalysisReport.index.js) | 9 | 2 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.workshop.workshopReports.revenueAnalysisReport.index`: `getlocalDateTime`، `roundingforView`، `CurrencyFormate`، `rounding`، `getDesignationName`، `totalTimeWorkedInHours`، `totatAmountByRow`، `getRevenueReport`، `exportToExcel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.designation.getDesignations` | POST | api/services/app/designation/GetDesignations | [المصدر](../../../raw/application.js#L498581) |
| `abp.services.app.revenueAnalysisReport.getRevenueReport` | POST | api/services/app/revenueAnalysisReport/GetRevenueReport | [المصدر](../../../raw/application.js#L498621) |

## الصلاحيات والحقول

لم يستخرج فحص صلاحية حرفي داخل الوحدات المرتبطة؛ افحص أيضًا شروط المسار والخادم.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.filters.designationId` | select |  | ng-options=designation.id as designation.name for designation in vm.designations |
| `vm.filters.monthYear` | input | date |  |
| `vm.filters.plateNo` | text |  |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
