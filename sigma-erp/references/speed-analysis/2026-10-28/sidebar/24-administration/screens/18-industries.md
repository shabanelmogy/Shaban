# شاشة: Industries

المسار في القائمة: Administration ← Industries.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.industry`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0155](../../../readable/routes/R0155--tenant-industry.js)، والأصل [raw/application.js:2618](../../../raw/application.js#L2618).
- قالب الشاشة: `~/App/tenant/views/common/industries/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.industries.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.industries.index](../../../readable/controllers/C0397--tenant.views.industries.index.js) | 4 | 2 |
| [tenant.views.industries.createOrEditModal](../../../readable/controllers/C0396--tenant.views.industries.createOrEditModal.js) | 2 | 2 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.industries.index`: `getIndustries`، `createIndustry`، `editIndustry`، `deleteIndustry`.
- وحدة `tenant.views.industries.createOrEditModal`: `save`، `cancel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.industry.getIndustries` | POST | api/services/app/industry/GetIndustries | [المصدر](../../../raw/application.js#L101284) |
| `abp.services.app.industry.deleteIndustry` | POST | api/services/app/industry/DeleteIndustry | [المصدر](../../../raw/application.js#L101321) |
| `abp.services.app.industry.createOrUpdateIndustry` | POST | api/services/app/industry/CreateOrUpdateIndustry | [المصدر](../../../raw/application.js#L101205) |
| `abp.services.app.industry.getIndustryForEdit` | POST | api/services/app/industry/GetIndustryForEdit | [المصدر](../../../raw/application.js#L101220) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.Industry.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Industry.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Industry.Delete`: ممنوحة في السياق الملتقط.

لم تتوفر روابط حقول مثبتة من القالب. خصائص الواجهة المستخرجة آليًا موجودة في فهرس وحدات التحكم، ولا تمثل جميع حقول النموذج.

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
