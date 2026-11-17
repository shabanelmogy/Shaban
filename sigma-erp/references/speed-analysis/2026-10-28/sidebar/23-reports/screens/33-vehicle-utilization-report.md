# شاشة: Vehicle Utilization Report

المسار في القائمة: Reports ← Vehicle Utilization Report.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_VehicleUtilizationReport`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0436](../../../readable/routes/R0436--tenant-crs-vehicleutilizationreport.js)، والأصل [raw/application.js:4733](../../../raw/application.js#L4733).
- قالب الشاشة: `~/App/tenant/views/crs/reports/vehicleUtilizationReport/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.reports.vehicleUtilizationReport.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.reports.vehicleUtilizationReport.index](../../../readable/controllers/C1106--tenant.views.crs.reports.vehicleUtilizationReport.index.js) | 9 | 3 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.reports.vehicleUtilizationReport.index`: `calcTotalVehical`، `getRoundFigure`، `searchMake`، `roundingforView`، `searchModel`، `clearMake`، `clearModel`، `exportToExcelMethod`، `getVehicleUtilizationReport`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.make.searchPreUsedMakes` | POST | api/services/app/make/SearchPreUsedMakes | [المصدر](../../../raw/application.js#L292199) |
| `abp.services.app.vehicleModel.searchPreUsedVehicleModels` | POST | api/services/app/vehicleModel/SearchPreUsedVehicleModels | [المصدر](../../../raw/application.js#L292211) |
| `abp.services.app.vehicleUtilizationReport.getVehicleUtilizationReport` | POST | api/services/app/vehicleUtilizationReport/GetVehicleUtilizationReport | [المصدر](../../../raw/application.js#L292320) |

## الصلاحيات والحقول

لم يستخرج فحص صلاحية حرفي داخل الوحدات المرتبطة؛ افحص أيضًا شروط المسار والخادم.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.dateRangeModel` | text |  | min=vm.dateRangeOptions.min; max=vm.dateRangeOptions.max |
| `vm.filters.make` | ui-select |  |  |
| `vm.filters.model` | ui-select |  |  |
| `vm.filters.vehicleOwnership` | select | ownership | ng-options=ownership.value as ownership.key for ownership in vm.rentalAgreementOwnerships |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
