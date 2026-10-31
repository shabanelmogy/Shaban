# شاشة: Task Master

المسار في القائمة: CRM ← Tasks ← Task Master.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_taskMaster`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0255](../../../readable/routes/R0255--tenant-crs-taskmaster.js)، والأصل [raw/application.js:3337](../../../raw/application.js#L3337).
- قالب الشاشة: `~/App/tenant/views/crs/crm/tasks/taskMaster/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.taskMaster.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.taskMaster.index](../../../readable/controllers/C0751--tenant.views.taskMaster.index.js) | 7 | 2 |
| [tenant.views.taskMaster.createOrEditModal](../../../readable/controllers/C0750--tenant.views.taskMaster.createOrEditModal.js) | 2 | 3 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.taskMaster.index`: `locationPermission`، `getTasks`، `exportToExcel`، `createTask`، `editTask`، `viewTask`، `deleteTask`.
- وحدة `tenant.views.taskMaster.createOrEditModal`: `cancel`، `save`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.cRMCampaign.exportToExcel` | غير مربوط | غير محسوم | [المصدر](../../../raw/application.js#L195162) |
| `abp.services.app.cRMCampaign.deleteTask` | غير مربوط | غير محسوم | [المصدر](../../../raw/application.js#L195202) |
| `abp.services.app.cRMCampaign.updateTask` | غير مربوط | غير محسوم | [المصدر](../../../raw/application.js#L195009) |
| `abp.services.app.cRMCampaign.createTask` | غير مربوط | غير محسوم | [المصدر](../../../raw/application.js#L195016) |
| `abp.services.app.cRMCampaign.getTaskForEdit` | غير مربوط | غير محسوم | [المصدر](../../../raw/application.js#L195028) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.TaskMaster`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.TaskMaster.Create`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.TaskMaster.Edit`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.TaskMaster.Delete`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.TaskMaster.Export`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Customers.AllActionsOnOtherBranchCustomers`: ممنوحة في السياق الملتقط.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.filters.name` | text |  |  |
| `vm.filters.category` | select |  | ng-options=cat for cat in vm.categories |
| `vm.filters.type` | select |  | ng-options=type for type in vm.types |
| `vm.filters.isApprovalRequired` | select |  | ng-options=req as (req ? 'Yes' : 'No') for req in [true, false] |
| `vm.filters.isActive` | select |  | ng-options=active as (active ? 'Yes' : 'No') for active in [true, false] |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
