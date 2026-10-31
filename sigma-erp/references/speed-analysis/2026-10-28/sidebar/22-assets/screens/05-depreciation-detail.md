# شاشة: Depreciation Detail

المسار في القائمة: Assets ← Depreciation Detail.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_depreciationDetail`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0473](../../../readable/routes/R0473--tenant-crs-depreciationdetail.js)، والأصل [raw/application.js:5023](../../../raw/application.js#L5023).
- قالب الشاشة: `~/App/tenant/views/crs/assets/depreciationDetail/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.assets.depreciationDetail.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.assets.depreciationDetail.index](../../../readable/controllers/C0597--tenant.views.crs.assets.depreciationDetail.index.js) | 12 | 5 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.assets.depreciationDetail.index`: `CurrencyFormate`، `ConvertToNumFormate`، `getlocalDateTime`، `getlocalDateTimeShort`، `getAssetSearch`، `getLocationName`، `getLocationNameTwo`، `clearAsset`، `sumDep`، `sumOfDepreciation`، `exportToExcelMethod`، `getDepreciationDetail`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.asset.getAssetType` | POST | api/services/app/asset/GetAssetType | [المصدر](../../../raw/application.js#L162705) |
| `abp.services.app.depreciationDetail.getAssetSearch` | POST | api/services/app/depreciationDetail/GetAssetSearch | [المصدر](../../../raw/application.js#L162714) |
| `abp.services.app.commonLookup.getLocations` | POST | api/services/app/commonLookup/GetLocations | [المصدر](../../../raw/application.js#L162721) |
| `abp.services.app.depreciationDetail.exportToExcel` | POST | api/services/app/depreciationDetail/ExportToExcel | [المصدر](../../../raw/application.js#L162771) |
| `abp.services.app.depreciationDetail.getDepreciationDetail` | POST | api/services/app/depreciationDetail/GetDepreciationDetail | [المصدر](../../../raw/application.js#L162783) |

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
