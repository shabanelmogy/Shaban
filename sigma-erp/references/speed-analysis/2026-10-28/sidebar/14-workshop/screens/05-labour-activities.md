# شاشة: Labour Activities

المسار في القائمة: Workshop ← Labour Activities.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.CRS_LabourActivities`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0555](../../../readable/routes/R0555--tenant-crs-labouractivities.js)، والأصل [raw/application.js:5730](../../../raw/application.js#L5730).
- قالب الشاشة: `~/App/tenant/views/workshop/LabourActivities/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.workshop.labourActivities.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.workshop.labourActivities.index](../../../readable/controllers/C1818--tenant.views.workshop.labourActivities.index.js) | 6 | 2 |
| [tenant.views.workshop.labourActivities.createOrEditModal](../../../readable/controllers/C1817--tenant.views.workshop.labourActivities.createOrEditModal.js) | 2 | 2 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.workshop.labourActivities.index`: `showJobType`، `getLabourActivities`، `createLabourActivity`، `editLabourActivity`، `viewLabourActivity`، `deleteLabourActivity`.
- وحدة `tenant.views.workshop.labourActivities.createOrEditModal`: `save`، `cancel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.labourActivity.getLabourActivities` | POST | api/services/app/labourActivity/GetLabourActivities | [المصدر](../../../raw/application.js#L496220) |
| `abp.services.app.labourActivity.deleteLabourActivity` | POST | api/services/app/labourActivity/DeleteLabourActivity | [المصدر](../../../raw/application.js#L496291) |
| `abp.services.app.labourActivity.createOrUpdateLabourActivity` | POST | api/services/app/labourActivity/CreateOrUpdateLabourActivity | [المصدر](../../../raw/application.js#L496123) |
| `abp.services.app.labourActivity.getLabourActivityForEdit` | POST | api/services/app/labourActivity/GetLabourActivityForEdit | [المصدر](../../../raw/application.js#L496140) |

## الصلاحيات والحقول

لم يستخرج فحص صلاحية حرفي داخل الوحدات المرتبطة؛ افحص أيضًا شروط المسار والخادم.

لم تتوفر روابط حقول مثبتة من القالب. خصائص الواجهة المستخرجة آليًا موجودة في فهرس وحدات التحكم، ولا تمثل جميع حقول النموذج.

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
