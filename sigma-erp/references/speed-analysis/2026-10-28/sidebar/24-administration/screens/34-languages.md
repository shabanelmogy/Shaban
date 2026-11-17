# شاشة: Languages

المسار في القائمة: Administration ← Languages.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `languages`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0016](../../../readable/routes/R0016--languages.js)، والأصل [raw/application.js:1508](../../../raw/application.js#L1508).
- قالب الشاشة: `~/App/common/views/languages/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `common.views.languages.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [common.views.languages.index](../../../readable/controllers/C0010--common.views.languages.index.js) | 7 | 3 |
| [common.views.languages.generateLanguageFileModal](../../../readable/controllers/C0009--common.views.languages.generateLanguageFileModal.js) | 2 | 2 |
| [common.views.languages.createOrEditModal](../../../readable/controllers/C0007--common.views.languages.createOrEditModal.js) | 3 | 2 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `common.views.languages.index`: `getLanguages`، `editLanguage`، `generateLanguageFile`، `deleteLanguage`، `createLanguage`، `setAsDefaultLanguage`، `changeTexts`.
- وحدة `common.views.languages.generateLanguageFileModal`: `cancel`، `generate`.
- وحدة `common.views.languages.createOrEditModal`: `languageChanged`، `save`، `cancel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.language.getLanguages` | POST | api/services/app/language/GetLanguages | [المصدر](../../../raw/application.js#L25517) |
| `abp.services.app.language.deleteLanguage` | POST | api/services/app/language/DeleteLanguage | [المصدر](../../../raw/application.js#L25555) |
| `abp.services.app.language.setDefaultLanguage` | POST | api/services/app/language/SetDefaultLanguage | [المصدر](../../../raw/application.js#L25571) |
| `abp.services.app.language.generateLanguageFile` | POST | api/services/app/language/GenerateLanguageFile | [المصدر](../../../raw/application.js#L25379) |
| `abp.services.app.language.getLanguageTexts` | POST | api/services/app/language/GetLanguageTexts | [المصدر](../../../raw/application.js#L25407) |
| `abp.services.app.language.createOrUpdateLanguage` | POST | api/services/app/language/CreateOrUpdateLanguage | [المصدر](../../../raw/application.js#L25202) |
| `abp.services.app.language.getLanguageForEdit` | POST | api/services/app/language/GetLanguageForEdit | [المصدر](../../../raw/application.js#L25218) |

## الصلاحيات والحقول

- صلاحية `Pages.Administration.Languages.Create`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Administration.Languages.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Administration.Languages.ChangeTexts`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Administration.Languages.Delete`: ممنوحة في السياق الملتقط.

لم تتوفر روابط حقول مثبتة من القالب. خصائص الواجهة المستخرجة آليًا موجودة في فهرس وحدات التحكم، ولا تمثل جميع حقول النموذج.

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
