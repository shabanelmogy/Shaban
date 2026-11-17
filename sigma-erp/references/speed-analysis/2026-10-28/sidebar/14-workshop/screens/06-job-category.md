# شاشة: Job Category

المسار في القائمة: Workshop ← Job Category.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.CRS_JobCategories`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0554](../../../readable/routes/R0554--tenant-crs-jobcategories.js)، والأصل [raw/application.js:5722](../../../raw/application.js#L5722).
- قالب الشاشة: `~/App/tenant/views/workshop/jobCategories/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.workshop.jobCategories.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.workshop.jobCategories.index](../../../readable/controllers/C1790--tenant.views.workshop.jobCategories.index.js) | 5 | 2 |
| [tenant.views.workshop.jobCategories.createOrEditModal](../../../readable/controllers/C1789--tenant.views.workshop.jobCategories.createOrEditModal.js) | 2 | 2 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.workshop.jobCategories.index`: `getJobCategory`، `createJobCategory`، `editJobCategories`، `viewJobCategories`، `deleteJobCategories`.
- وحدة `tenant.views.workshop.jobCategories.createOrEditModal`: `save`، `cancel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.jobCategory.getJobCategory` | POST | api/services/app/jobCategory/GetJobCategory | [المصدر](../../../raw/application.js#L488168) |
| `abp.services.app.jobCategory.deleteJobCategory` | POST | api/services/app/jobCategory/DeleteJobCategory | [المصدر](../../../raw/application.js#L488239) |
| `abp.services.app.jobCategory.createOrUpdateJobCategory` | POST | api/services/app/jobCategory/CreateOrUpdateJobCategory | [المصدر](../../../raw/application.js#L488088) |
| `abp.services.app.jobCategory.getJobCategoryForEdit` | POST | api/services/app/jobCategory/GetJobCategoryForEdit | [المصدر](../../../raw/application.js#L488105) |

## الصلاحيات والحقول

لم يستخرج فحص صلاحية حرفي داخل الوحدات المرتبطة؛ افحص أيضًا شروط المسار والخادم.

لم تتوفر روابط حقول مثبتة من القالب. خصائص الواجهة المستخرجة آليًا موجودة في فهرس وحدات التحكم، ولا تمثل جميع حقول النموذج.

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
