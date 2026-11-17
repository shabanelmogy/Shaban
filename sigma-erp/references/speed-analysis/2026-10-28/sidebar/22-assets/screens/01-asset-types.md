# شاشة: Asset Types

المسار في القائمة: Assets ← Asset Types.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_assetTypes`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0470](../../../readable/routes/R0470--tenant-crs-assettypes.js)، والأصل [raw/application.js:5000](../../../raw/application.js#L5000).
- قالب الشاشة: `~/App/tenant/views/crs/assets/assetTypes/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.assets.assetTypes.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.assets.assetTypes.index](../../../readable/controllers/C0594--tenant.views.crs.assets.assetTypes.index.js) | 12 | 6 |
| [tenant.views.crs.assets.assetTypes.viewModal](../../../readable/controllers/C0595--tenant.views.crs.assets.assetTypes.viewModal.js) | 4 | 1 |
| [tenant.views.crs.assets.assetTypes.createOrEditModal](../../../readable/controllers/C0593--tenant.views.crs.assets.assetTypes.createOrEditModal.js) | 5 | 5 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.assets.assetTypes.index`: `searchAccounts`، `searchDepreciationMethods`، `localize`، `viewModal`، `createOrEditAssetTypeModal`، `deleteAssetType`، `getAssetCategory`، `assetCategoryChanged`، `removeRow`، `addRow`، `save`، `getAssetType`.
- وحدة `tenant.views.crs.assets.assetTypes.viewModal`: `localize`، `assetCategoryChanged`، `getAssetCategory`، `cancel`.
- وحدة `tenant.views.crs.assets.assetTypes.createOrEditModal`: `localize`، `assetCategoryChanged`، `save`، `searchAccounts`، `cancel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.account.searchAccounts` | POST | api/services/app/account/SearchAccounts | [المصدر](../../../raw/application.js#L162120) |
| `abp.services.app.assetType.deleteAssetType` | POST | api/services/app/assetType/DeleteAssetType | [المصدر](../../../raw/application.js#L162307) |
| `abp.services.app.assetType.createOrUpdateAssetType` | POST | api/services/app/assetType/CreateOrUpdateAssetType | [المصدر](../../../raw/application.js#L162107) |
| `abp.services.app.assetType.getAssetType` | POST | api/services/app/assetType/GetAssetType | [المصدر](../../../raw/application.js#L162087) |
| `abp.services.app.asset.getDepreciationMethod` | POST | api/services/app/asset/GetDepreciationMethod | [المصدر](../../../raw/application.js#L162132) |
| `abp.services.app.assetType.getAssetTypeForEdit` | POST | api/services/app/assetType/GetAssetTypeForEdit | [المصدر](../../../raw/application.js#L162142) |

## الصلاحيات والحقول

لم يستخرج فحص صلاحية حرفي داخل الوحدات المرتبطة؛ افحص أيضًا شروط المسار والخادم.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `assetType.name` | text | assetName |  |
| `assetType.depreciationMethod` | ui-select |  |  |
| `assetType.assetAccount` | ui-select |  |  |
| `assetType.accumulatedDepreciationAccount` | ui-select |  |  |
| `assetType.depreciationExpenseAccount` | ui-select |  |  |
| `assetType.category` | select |  | ng-options=category.id as category.name for category in vm.assetCategories |
| `assetType.residualValue` | number | residualValue |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
