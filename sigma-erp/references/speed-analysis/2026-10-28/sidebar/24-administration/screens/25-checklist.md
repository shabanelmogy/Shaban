# شاشة: Checklist

المسار في القائمة: Administration ← Checklist.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.mcc_checklist`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0336](../../../readable/routes/R0336--tenant-mcc-checklist.js)، والأصل [raw/application.js:3954](../../../raw/application.js#L3954).
- قالب الشاشة: `~/App/tenant/views/mcc/checklist/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.checklist.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.checklist.index](../../../readable/controllers/C1621--tenant.views.checklist.index.js) | 4 | 2 |
| [tenant.views.checklist.createOrEditModal](../../../readable/controllers/C1620--tenant.views.checklist.createOrEditModal.js) | 2 | 2 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.checklist.index`: `getChecklist`، `createChecklistItem`، `editChecklistItem`، `deleteChecklistItem`.
- وحدة `tenant.views.checklist.createOrEditModal`: `save`، `cancel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.checkList.getCheckList` | POST | api/services/app/checkList/GetCheckList | [المصدر](../../../raw/application.js#L445289) |
| `abp.services.app.checkList.deleteCheckList` | POST | api/services/app/checkList/DeleteCheckList | [المصدر](../../../raw/application.js#L445326) |
| `abp.services.app.checkList.createOrUpdateCheckList` | POST | api/services/app/checkList/CreateOrUpdateCheckList | [المصدر](../../../raw/application.js#L445208) |
| `abp.services.app.checkList.getCheckListForEdit` | POST | api/services/app/checkList/GetCheckListForEdit | [المصدر](../../../raw/application.js#L445223) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.Checklist.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.VMIWorkshop.Checklist.Addnew`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.VMIGeneric.Checklist.Addnew`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Checklist.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.VMIWorkshop.Checklist.Edit`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.VMIGeneric.Checklist.Edit`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Checklist.Delete`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.VMIWorkshop.Checklist.Delete`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.VMIGeneric.Checklist.Delete`: غير ممنوحة في السياق الملتقط.

لم تتوفر روابط حقول مثبتة من القالب. خصائص الواجهة المستخرجة آليًا موجودة في فهرس وحدات التحكم، ولا تمثل جميع حقول النموذج.

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
