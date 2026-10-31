# شاشة: Currencies

المسار في القائمة: Administration ← Currencies.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.currencies`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0160](../../../readable/routes/R0160--tenant-currencies.js)، والأصل [raw/application.js:2661](../../../raw/application.js#L2661).
- قالب الشاشة: `~/App/tenant/views/common/currencies/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.common.currencies.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.common.currencies.index](../../../readable/controllers/C0325--tenant.views.common.currencies.index.js) | 6 | 3 |
| [tenant.views.common.currencies.createOrEditModal](../../../readable/controllers/C0324--tenant.views.common.currencies.createOrEditModal.js) | 2 | 2 |
| [tenant.views.common.currencies.viewModal](../../../readable/controllers/C0326--tenant.views.common.currencies.viewModal.js) | 1 | 1 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.common.currencies.index`: `getCurrencies`، `createCurrency`، `editCurrency`، `viewCurrency`، `deleteCurrency`، `makeBase`.
- وحدة `tenant.views.common.currencies.createOrEditModal`: `save`، `cancel`.
- وحدة `tenant.views.common.currencies.viewModal`: `cancel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.currency.getCurrencies` | POST | api/services/app/currency/GetCurrencies | [المصدر](../../../raw/application.js#L87095) |
| `abp.services.app.currency.deleteCurrency` | POST | api/services/app/currency/DeleteCurrency | [المصدر](../../../raw/application.js#L87152) |
| `abp.services.app.currency.makeBaseCurrency` | POST | api/services/app/currency/MakeBaseCurrency | [المصدر](../../../raw/application.js#L87167) |
| `abp.services.app.currency.createOrUpdateCurrency` | POST | api/services/app/currency/CreateOrUpdateCurrency | [المصدر](../../../raw/application.js#L86991) |
| `abp.services.app.currency.getCurrencyForEdit` | POST | api/services/app/currency/GetCurrencyForEdit | [المصدر](../../../raw/application.js#L87200) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.Currencies`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Currencies.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Currencies.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Currencies.Delete`: ممنوحة في السياق الملتقط.

لم تتوفر روابط حقول مثبتة من القالب. خصائص الواجهة المستخرجة آليًا موجودة في فهرس وحدات التحكم، ولا تمثل جميع حقول النموذج.

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
