# شاشة: Depreciation Summary

المسار في القائمة: Assets ← Depreciation Summary.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_depreciationSummary`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0472](../../../readable/routes/R0472--tenant-crs-depreciationsummary.js)، والأصل [raw/application.js:5015](../../../raw/application.js#L5015).
- قالب الشاشة: `~/App/tenant/views/crs/assets/depreciationSummary/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.assets.depreciationSummary.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.assets.depreciationSummary.index](../../../readable/controllers/C0599--tenant.views.crs.assets.depreciationSummary.index.js) | 8 | 5 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.assets.depreciationSummary.index`: `CurrencyFormate`، `getlocalDateTime`، `getLocationName`، `getLocationNameTwo`، `getAssetSearch`، `clearAsset`، `exportToExcelMethod`، `getDepreciationSummary`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.asset.getAssetType` | POST | api/services/app/asset/GetAssetType | [المصدر](../../../raw/application.js#L163001) |
| `abp.services.app.commonLookup.getLocations` | POST | api/services/app/commonLookup/GetLocations | [المصدر](../../../raw/application.js#L163008) |
| `abp.services.app.depreciationSummary.getAssetSearch` | POST | api/services/app/depreciationSummary/GetAssetSearch | [المصدر](../../../raw/application.js#L163028) |
| `abp.services.app.depreciationSummary.exportToExcel` | POST | api/services/app/depreciationSummary/ExportToExcel | [المصدر](../../../raw/application.js#L163044) |
| `abp.services.app.depreciationSummary.getDepreciationSummary` | POST | api/services/app/depreciationSummary/GetDepreciationSummary | [المصدر](../../../raw/application.js#L163055) |

## الصلاحيات والحقول

لم يستخرج فحص صلاحية حرفي داخل الوحدات المرتبطة؛ افحص أيضًا شروط المسار والخادم.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.dateRangeModel` | text |  | min=vm.dateRangeOptions.min; max=vm.dateRangeOptions.max |
| `vm.filters.assetType` | select |  | ng-options=assetType as assetType.name for assetType in vm.assetTypes |
| `vm.filters.asset` | ui-select |  |  |
| `vm.filters.locationId` | select | locationId | ng-options=location.id as location.name for location in vm.locations |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
