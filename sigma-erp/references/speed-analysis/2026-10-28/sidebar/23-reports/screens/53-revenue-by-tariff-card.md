# شاشة: Revenue by Tariff Card

المسار في القائمة: Reports ← Revenue by Tariff Card.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.report_EstimateRevenueByTariffCard`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0520](../../../readable/routes/R0520--tenant-report-estimaterevenuebytariffcard.js)، والأصل [raw/application.js:5411](../../../raw/application.js#L5411).
- قالب الشاشة: `~/App/tenant/views/crs/reports/estimatedRevenueByTariffCard/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.estimatedRevenueByTariffCard.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.estimatedRevenueByTariffCard.index](../../../readable/controllers/C0997--tenant.views.crs.estimatedRevenueByTariffCard.index.js) | 10 | 3 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.estimatedRevenueByTariffCard.index`: `dateRangeModelChanged`، `locationPermission`، `getlocalDateTime`، `getlocalDate`، `currencyFormate`، `roundingforView`، `calculateLengthOfRevenue`، `calculateRevenuePerDay`، `exportToExcel`، `getEstimatedRevenueByTariffCard`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.commonLookup.getLocationsActiveAndInActive` | POST | api/services/app/commonLookup/GetLocationsActiveAndInActive | [المصدر](../../../raw/application.js#L269729) |
| `abp.services.app.estimatedRevenue.getTariffCards` | POST | api/services/app/estimatedRevenue/GetTariffCards | [المصدر](../../../raw/application.js#L269736) |
| `abp.services.app.estimatedRevenue.getEstimatedRevenueByTariffCard` | POST | api/services/app/estimatedRevenue/GetEstimatedRevenueByTariffCard | [المصدر](../../../raw/application.js#L269848) |

## الصلاحيات والحقول

لم يستخرج فحص صلاحية حرفي داخل الوحدات المرتبطة؛ افحص أيضًا شروط المسار والخادم.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.dateRangeModel` | text |  | min=vm.dateRangeOptions.min; max=vm.dateRangeOptions.max; ng-disabled=!vm.filters.enableDateRange |
| `vm.filters.locationId` | select | locationId |  |
| `vm.filters.tariffCardId` | select | tariffCardId | ng-options=type.id as type.title for type in vm.tariffCards |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
