# شاشة: Vehicle Charged vs Driven

المسار في القائمة: Reports ← Vehicle Charged vs Driven.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.report_VehicleChargedVsDriven`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0517](../../../readable/routes/R0517--tenant-report-vehiclechargedvsdriven.js)، والأصل [raw/application.js:5380](../../../raw/application.js#L5380).
- قالب الشاشة: `~/App/tenant/views/crs/reports/vehicleChargedVsDriven/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.vehicleChagredVsDrivenReport.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.vehicleChagredVsDrivenReport.index](../../../readable/controllers/C1082--tenant.views.crs.vehicleChagredVsDrivenReport.index.js) | 8 | 3 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.vehicleChagredVsDrivenReport.index`: `dateRangeModelChanged`، `roundingforView`، `locationPermission`، `getlocalDateTime`، `getlocalDate`، `getPercentage`، `exportToExcelMethod`، `getVehicleChargedVsDriven`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.commonLookup.getLocationsActiveAndInActive` | POST | api/services/app/commonLookup/GetLocationsActiveAndInActive | [المصدر](../../../raw/application.js#L286834) |
| `abp.services.app.vehicleChargedVsDriven.getVehicleTypes` | POST | api/services/app/vehicleChargedVsDriven/GetVehicleTypes | [المصدر](../../../raw/application.js#L286841) |
| `abp.services.app.vehicleChargedVsDriven.getVehicleChargedVsDriven` | POST | api/services/app/vehicleChargedVsDriven/GetVehicleChargedVsDriven | [المصدر](../../../raw/application.js#L286939) |

## الصلاحيات والحقول

لم يستخرج فحص صلاحية حرفي داخل الوحدات المرتبطة؛ افحص أيضًا شروط المسار والخادم.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.dateRangeModel` | text |  | min=vm.dateRangeOptions.min; max=vm.dateRangeOptions.max; ng-disabled=!vm.filters.enableDateRange |
| `vm.filters.enableDateRange` | checkbox | disableDateRange |  |
| `vm.filters.locationId` | select | locationId |  |
| `vm.filters.vehicleTypeId` | select | vehicleTypeId | ng-options=type.id as type.title for type in vm.vehicleTypes |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
