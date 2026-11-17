# شاشة: Depreciation

المسار في القائمة: Assets ← Depreciation.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_depreciation`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0471](../../../readable/routes/R0471--tenant-crs-depreciation.js)، والأصل [raw/application.js:5007](../../../raw/application.js#L5007).
- قالب الشاشة: `~/App/tenant/views/crs/assets/depreciation/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.assets.depreciation.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.assets.depreciation.index](../../../readable/controllers/C0596--tenant.views.crs.assets.depreciation.index.js) | 7 | 2 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.assets.depreciation.index`: `CurrencyFormate`، `getlocalDateTime`، `sumAmount`، `save`، `exportToExcelMethod`، `getDepreciation`، `calculationDetail`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.depreciation.createDepreciation` | POST | api/services/app/depreciation/CreateDepreciation | [المصدر](../../../raw/application.js#L162511) |
| `abp.services.app.depreciation.prepareDepreciation` | POST | api/services/app/depreciation/PrepareDepreciation | [المصدر](../../../raw/application.js#L162591) |

## الصلاحيات والحقول

لم يستخرج فحص صلاحية حرفي داخل الوحدات المرتبطة؛ افحص أيضًا شروط المسار والخادم.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.filters.monthYear` | input | date |  |
| `vm.filters.rerunDepreciationForDisposedAsset` | checkbox | RerunDepreciationForDisposedAsset | ng-disabled=vm.rerunDepreciationForDisposedAssetLoading |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
