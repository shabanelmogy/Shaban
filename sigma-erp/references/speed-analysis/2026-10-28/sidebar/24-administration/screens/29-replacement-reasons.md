# شاشة: Replacement Reasons

المسار في القائمة: Administration ← Replacement Reasons.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.replacementReasons`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0508](../../../readable/routes/R0508--tenant-replacementreasons.js)، والأصل [raw/application.js:5302](../../../raw/application.js#L5302).
- قالب الشاشة: `~/App/tenant/views/common/replacementReasons/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.replacementReasons.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.replacementReasons.index](../../../readable/controllers/C0425--tenant.views.replacementReasons.index.js) | 4 | 2 |
| [tenant.views.replacementReasons.createOrEditModal](../../../readable/controllers/C0424--tenant.views.replacementReasons.createOrEditModal.js) | 2 | 2 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.replacementReasons.index`: `getReplacementReasons`، `createReplacementReason`، `editReplacementReason`، `deleteReplacementReason`.
- وحدة `tenant.views.replacementReasons.createOrEditModal`: `save`، `cancel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.replacementReason.getReplacementReasons` | POST | api/services/app/replacementReason/GetReplacementReasons | [المصدر](../../../raw/application.js#L104984) |
| `abp.services.app.replacementReason.deleteReplacementReason` | POST | api/services/app/replacementReason/DeleteReplacementReason | [المصدر](../../../raw/application.js#L105021) |
| `abp.services.app.replacementReason.createOrUpdateReplacementReason` | POST | api/services/app/replacementReason/CreateOrUpdateReplacementReason | [المصدر](../../../raw/application.js#L104910) |
| `abp.services.app.replacementReason.getReplacementReasonForEdit` | POST | api/services/app/replacementReason/GetReplacementReasonForEdit | [المصدر](../../../raw/application.js#L104925) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.ReplacementReasons.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.ReplacementReasons.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.ReplacementReasons.Delete`: ممنوحة في السياق الملتقط.

لم تتوفر روابط حقول مثبتة من القالب. خصائص الواجهة المستخرجة آليًا موجودة في فهرس وحدات التحكم، ولا تمثل جميع حقول النموذج.

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
