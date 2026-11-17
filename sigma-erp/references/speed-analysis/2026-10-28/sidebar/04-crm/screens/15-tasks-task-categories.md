# شاشة: Task Categories

المسار في القائمة: CRM ← Tasks ← Task Categories.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_taskCategories`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0258](../../../readable/routes/R0258--tenant-crs-taskcategories.js)، والأصل [raw/application.js:3358](../../../raw/application.js#L3358).
- قالب الشاشة: `~/App/tenant/views/crs/crm/tasks/taskCategories/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.taskCategories.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.taskCategories.index](../../../readable/controllers/C0748--tenant.views.taskCategories.index.js) | 7 | 2 |
| [tenant.views.taskCategories.createOrEditModal](../../../readable/controllers/C0747--tenant.views.taskCategories.createOrEditModal.js) | 2 | 3 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.taskCategories.index`: `locationPermission`، `getCategories`، `exportToExcel`، `createCategory`، `editCategory`، `viewCategory`، `deleteCategory`.
- وحدة `tenant.views.taskCategories.createOrEditModal`: `cancel`، `save`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.cRMCampaign.exportToExcel` | غير مربوط | غير محسوم | [المصدر](../../../raw/application.js#L194803) |
| `abp.services.app.cRMCampaign.deleteCategory` | غير مربوط | غير محسوم | [المصدر](../../../raw/application.js#L194843) |
| `abp.services.app.cRMCampaign.updateCategory` | غير مربوط | غير محسوم | [المصدر](../../../raw/application.js#L194669) |
| `abp.services.app.cRMCampaign.createCategory` | غير مربوط | غير محسوم | [المصدر](../../../raw/application.js#L194676) |
| `abp.services.app.cRMCampaign.getCategoryForEdit` | غير مربوط | غير محسوم | [المصدر](../../../raw/application.js#L194688) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.TaskCategories`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.TaskCategories.Create`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.TaskCategories.Edit`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.TaskCategories.Delete`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.TaskCategories.Export`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Customers.AllActionsOnOtherBranchCustomers`: ممنوحة في السياق الملتقط.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.filters.name` | text |  |  |
| `vm.filters.isActive` | select |  | ng-options=active as (active ? 'Yes' : 'No') for active in [true, false] |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
