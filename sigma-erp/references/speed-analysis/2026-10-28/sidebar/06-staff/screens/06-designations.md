# شاشة: Designations

المسار في القائمة: Staff ← Designations.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.CRS_designation`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0583](../../../readable/routes/R0583--tenant-crs-designation.js)، والأصل [raw/application.js:5942](../../../raw/application.js#L5942).
- قالب الشاشة: `~/App/tenant/views/common/designations/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.common.designations.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.common.designations.index](../../../readable/controllers/C0359--tenant.views.common.designations.index.js) | 6 | 2 |
| [tenant.views.common.designations.createOrEditModal](../../../readable/controllers/C0358--tenant.views.common.designations.createOrEditModal.js) | 2 | 2 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.common.designations.index`: `getStaffCategories`، `getDesignations`، `createDesignation`، `editDesignation`، `viewDesignation`، `deleteDesignation`.
- وحدة `tenant.views.common.designations.createOrEditModal`: `save`، `cancel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.designation.getDesignations` | POST | api/services/app/designation/GetDesignations | [المصدر](../../../raw/application.js#L94426) |
| `abp.services.app.designation.deleteDesignation` | POST | api/services/app/designation/DeleteDesignation | [المصدر](../../../raw/application.js#L94487) |
| `abp.services.app.designation.createOrUpdateDesignation` | POST | api/services/app/designation/CreateOrUpdateDesignation | [المصدر](../../../raw/application.js#L94317) |
| `abp.services.app.designation.getDesignationForEdit` | POST | api/services/app/designation/GetDesignationForEdit | [المصدر](../../../raw/application.js#L94334) |

## الصلاحيات والحقول

لم يستخرج فحص صلاحية حرفي داخل الوحدات المرتبطة؛ افحص أيضًا شروط المسار والخادم.

لم تتوفر روابط حقول مثبتة من القالب. خصائص الواجهة المستخرجة آليًا موجودة في فهرس وحدات التحكم، ولا تمثل جميع حقول النموذج.

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
