# شاشة: Roles

المسار في القائمة: Administration ← Roles.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `roles`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0013](../../../readable/routes/R0013--roles.js)، والأصل [raw/application.js:1479](../../../raw/application.js#L1479).
- قالب الشاشة: `~/App/common/views/roles/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `common.views.roles.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [common.views.roles.index](../../../readable/controllers/C0033--common.views.roles.index.js) | 4 | 2 |
| [common.views.roles.createOrEditModal](../../../readable/controllers/C0032--common.views.roles.createOrEditModal.js) | 2 | 2 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `common.views.roles.index`: `getRoles`، `editRole`، `deleteRole`، `createRole`.
- وحدة `common.views.roles.createOrEditModal`: `save`، `cancel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.role.getRoles` | POST | api/services/app/role/GetRoles | [المصدر](../../../raw/application.js#L28745) |
| `abp.services.app.role.deleteRole` | POST | api/services/app/role/DeleteRole | [المصدر](../../../raw/application.js#L28761) |
| `abp.services.app.role.createOrUpdateRole` | POST | api/services/app/role/CreateOrUpdateRole | [المصدر](../../../raw/application.js#L28650) |
| `abp.services.app.role.getRoleForEdit` | POST | api/services/app/role/GetRoleForEdit | [المصدر](../../../raw/application.js#L28666) |

## الصلاحيات والحقول

- صلاحية `Pages.Administration.Roles.Create`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Administration.Roles.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Administration.Roles.Delete`: ممنوحة في السياق الملتقط.

لم تتوفر روابط حقول مثبتة من القالب. خصائص الواجهة المستخرجة آليًا موجودة في فهرس وحدات التحكم، ولا تمثل جميع حقول النموذج.

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
