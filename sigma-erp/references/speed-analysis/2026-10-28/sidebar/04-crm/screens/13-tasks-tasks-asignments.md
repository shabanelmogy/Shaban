# شاشة: Tasks & Asignments

المسار في القائمة: CRM ← Tasks ← Tasks & Asignments.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_taskAssignment`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0256](../../../readable/routes/R0256--tenant-crs-taskassignment.js)، والأصل [raw/application.js:3344](../../../raw/application.js#L3344).
- قالب الشاشة: `~/App/tenant/views/crs/crm/tasks/taskAssignment/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.taskAssignment.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.taskAssignment.index](../../../readable/controllers/C0746--tenant.views.taskAssignment.index.js) | 7 | 1 |
| [tenant.views.taskAssignment.createOrEditModal](../../../readable/controllers/C0745--tenant.views.taskAssignment.createOrEditModal.js) | 2 | 3 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.taskAssignment.index`: `locationPermission`، `getAssignments`، `exportToExcel`، `createAssignment`، `editAssignment`، `viewAssignment`، `deleteAssignment`.
- وحدة `tenant.views.taskAssignment.createOrEditModal`: `cancel`، `save`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.cRMCampaign.exportToExcel` | غير مربوط | غير محسوم | [المصدر](../../../raw/application.js#L194592) |
| `abp.services.app.cRMCampaign.updateAssignment` | غير مربوط | غير محسوم | [المصدر](../../../raw/application.js#L194410) |
| `abp.services.app.cRMCampaign.createAssignment` | غير مربوط | غير محسوم | [المصدر](../../../raw/application.js#L194417) |
| `abp.services.app.cRMCampaign.getAssignmentForEdit` | غير مربوط | غير محسوم | [المصدر](../../../raw/application.js#L194429) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.TaskAssignment`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.TaskAssignment.Create`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.TaskAssignment.Edit`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.TaskAssignment.Delete`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.TaskAssignment.Export`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Customers.AllActionsOnOtherBranchCustomers`: ممنوحة في السياق الملتقط.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.filters.taskNumber` | text |  |  |
| `vm.filters.startDate` | date |  |  |
| `vm.filters.endDate` | date |  |  |
| `vm.filters.statusFilter` | radio |  |  |
| `vm.filters.statusFilter` | radio |  |  |
| `vm.filters.statusFilter` | radio |  |  |
| `vm.filters.statusFilter` | radio |  |  |
| `vm.filters.taskMaster` | select |  | ng-options=task.name for task in vm.taskMasters |
| `vm.filters.status` | select |  | ng-options=status for status in vm.statuses |
| `vm.filters.user` | ui-select |  |  |
| `vm.filters.resourceId` | text |  |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
