# شاشة: Revenue by Vehicle Type

المسار في القائمة: Reports ← Revenue by Vehicle Type.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.report_EstimateRevenueByVehicleType`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0518](../../../readable/routes/R0518--tenant-report-estimaterevenuebyvehicletype.js)، والأصل [raw/application.js:5391](../../../raw/application.js#L5391).
- قالب الشاشة: `~/App/tenant/views/crs/reports/estimatedRevenueByVehicleType/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.estimatedRevenueByVehicleType.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.estimatedRevenueByVehicleType.index](../../../readable/controllers/C0998--tenant.views.crs.estimatedRevenueByVehicleType.index.js) | 10 | 4 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.estimatedRevenueByVehicleType.index`: `dateRangeModelChanged`، `locationPermission`، `getlocalDateTime`، `getlocalDate`، `currencyFormate`، `roundingforView`، `calculateLengthOfRevenue`، `calculateRevenuePerDay`، `exportToExcel`، `getEstimatedRevenueByVehicleType`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.commonLookup.getLocationsActiveAndInActive` | POST | api/services/app/commonLookup/GetLocationsActiveAndInActive | [المصدر](../../../raw/application.js#L269933) |
| `abp.services.app.estimatedRevenue.getVehicleTypes` | POST | api/services/app/estimatedRevenue/GetVehicleTypes | [المصدر](../../../raw/application.js#L269940) |
| `abp.services.app.estimatedRevenue.getTariffCards` | POST | api/services/app/estimatedRevenue/GetTariffCards | [المصدر](../../../raw/application.js#L269947) |
| `abp.services.app.estimatedRevenue.getEstimatedRevenueByVehicleType` | POST | api/services/app/estimatedRevenue/GetEstimatedRevenueByVehicleType | [المصدر](../../../raw/application.js#L270057) |

## الصلاحيات والحقول

لم يستخرج فحص صلاحية حرفي داخل الوحدات المرتبطة؛ افحص أيضًا شروط المسار والخادم.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.dateRangeModel` | text |  | min=vm.dateRangeOptions.min; max=vm.dateRangeOptions.max; ng-disabled=!vm.filters.enableDateRange |
| `vm.filters.locationId` | select | locationId |  |
| `vm.filters.vehicleTypeId` | select | vehicleTypeId | ng-options=type.id as type.title for type in vm.vehicleTypes |
| `vm.filters.tariffCardId` | select | tariffCardId | ng-options=type.id as type.title for type in vm.tariffCards |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
