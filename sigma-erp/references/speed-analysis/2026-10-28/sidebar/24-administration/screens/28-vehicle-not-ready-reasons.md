# شاشة: Vehicle Not Ready Reasons

المسار في القائمة: Administration ← Vehicle Not Ready Reasons.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.reasons`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0507](../../../readable/routes/R0507--tenant-reasons.js)، والأصل [raw/application.js:5295](../../../raw/application.js#L5295).
- قالب الشاشة: `~/App/tenant/views/common/notReadyReason/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.notReadyReason.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.notReadyReason.index](../../../readable/controllers/C0407--tenant.views.notReadyReason.index.js) | 4 | 2 |
| [tenant.views.notReadyReason.createOrEditModal](../../../readable/controllers/C0406--tenant.views.notReadyReason.createOrEditModal.js) | 2 | 2 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.notReadyReason.index`: `getReasons`، `createReason`، `editReason`، `deleteReason`.
- وحدة `tenant.views.notReadyReason.createOrEditModal`: `save`، `cancel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.reason.getReasons` | POST | api/services/app/reason/GetReasons | [المصدر](../../../raw/application.js#L102143) |
| `abp.services.app.reason.deleteReason` | POST | api/services/app/reason/DeleteReason | [المصدر](../../../raw/application.js#L102180) |
| `abp.services.app.reason.createOrUpdateReason` | POST | api/services/app/reason/CreateOrUpdateReason | [المصدر](../../../raw/application.js#L102060) |
| `abp.services.app.reason.getReasonForEdit` | POST | api/services/app/reason/GetReasonForEdit | [المصدر](../../../raw/application.js#L102076) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.Reasons.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Reasons.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Reasons.Delete`: ممنوحة في السياق الملتقط.

لم تتوفر روابط حقول مثبتة من القالب. خصائص الواجهة المستخرجة آليًا موجودة في فهرس وحدات التحكم، ولا تمثل جميع حقول النموذج.

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
