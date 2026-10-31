# شاشة: Custom Lookups

المسار في القائمة: Administration ← Custom Lookups.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.customLookups`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0338](../../../readable/routes/R0338--tenant-customlookups.js)، والأصل [raw/application.js:3970](../../../raw/application.js#L3970).
- قالب الشاشة: `~/App/tenant/views/common/customLookups/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.customLookups.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.customLookups.index](../../../readable/controllers/C0335--tenant.views.customLookups.index.js) | 5 | 3 |
| [tenant.views.customLookups.createOrEditModal](../../../readable/controllers/C0334--tenant.views.customLookups.createOrEditModal.js) | 3 | 2 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.customLookups.index`: `getLookupData`، `createCustomLookup`، `editCustomLookup`، `deleteCustomLookup`، `customFieldChanged`.
- وحدة `tenant.views.customLookups.createOrEditModal`: `save`، `cancel`، `getTitle`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.customLookup.getLookupData` | POST | api/services/app/customLookup/GetLookupData | [المصدر](../../../raw/application.js#L88268) |
| `abp.services.app.customLookup.getEnabledCustomSelectionFields` | POST | api/services/app/customLookup/GetEnabledCustomSelectionFields | [المصدر](../../../raw/application.js#L88278) |
| `abp.services.app.customLookup.deleteCustomLookup` | POST | api/services/app/customLookup/DeleteCustomLookup | [المصدر](../../../raw/application.js#L88319) |
| `abp.services.app.customLookup.createOrUpdateCustomLookup` | POST | api/services/app/customLookup/CreateOrUpdateCustomLookup | [المصدر](../../../raw/application.js#L88154) |
| `abp.services.app.customLookup.getCustomLookupForEdit` | POST | api/services/app/customLookup/GetCustomLookupForEdit | [المصدر](../../../raw/application.js#L88179) |

## الصلاحيات والحقول

لم يستخرج فحص صلاحية حرفي داخل الوحدات المرتبطة؛ افحص أيضًا شروط المسار والخادم.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.selectedCustomFieldName` | select |  | ng-options=customField.fieldName as customField.fieldDetail for customField in vm.customFields |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
