# شاشة: Project Dashboard

المسار في القائمة: Project Dashboard.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.projectsDashboard`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0128](../../../readable/routes/R0128--tenant-projectsdashboard.js)، والأصل [raw/application.js:2415](../../../raw/application.js#L2415).
- قالب الشاشة: `~/App/tenant/views/common/projectsDashboard/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.common.projectsDashboard.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.common.projectsDashboard.index](../../../readable/controllers/C0420--tenant.views.common.projectsDashboard.index.js) | 40 | 12 |
| [tenant.views.common.projectsDashboard.importFeedbackTaskModal](../../../readable/controllers/C0419--tenant.views.common.projectsDashboard.importFeedbackTaskModal.js) | 2 | 0 |
| [tenant.views.common.projectsDashboard.feedbackTasksFilters](../../../readable/controllers/C0417--tenant.views.common.projectsDashboard.feedbackTasksFilters.js) | 3 | 0 |
| [tenant.views.common.projectsDashboard.gapPointFilters](../../../readable/controllers/C0418--tenant.views.common.projectsDashboard.gapPointFilters.js) | 3 | 0 |
| [tenant.views.common.projectsDashboard.releaseTasksModal](../../../readable/controllers/C0421--tenant.views.common.projectsDashboard.releaseTasksModal.js) | 5 | 1 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.common.projectsDashboard.index`: `multilineStringToHTMLWordBreak`، `exportFeedbackTasksToExcel`، `exportGapPointsToExcel`، `getMilestoneStatus`، `getlocalDateTime`، `getInvoiceStatus`، `getPaymentMilestoneStatus`، `importFeedbackTasks`، `importFeedbackTaskList`، `openFeedbackFilter`، `openGapPointFilter`، `clearFilter`، `getTaskStatus`، `getChargingType`، `getCategory`، `getLocalDate`، `setOriginalValue`، `focusDescription`، `autoResizeTextarea`، `gapPointSearch`، `sortGapPoint`، `feedbackSearch`، `sortFeedbackTasks`، `handleEnterKey`، `addNewTask`، `selectProject`، `getOpenProjects`، `getTasksByProjectId`، `getGAPPointsByProjectId`، `getPlannedReleases`، `getClosedReleases`، `openReleaseTasks`، `getProjectMilestone`، `unCheckCriticalTask`، `saveOrCreateTaskOnBlur`، `getModuleCategory`، `downloadAndOpen`، `getOriginalName`، `getFormattedDetailText`، `getProjectWorkScope`.
- وحدة `tenant.views.common.projectsDashboard.importFeedbackTaskModal`: `save`، `cancel`.
- وحدة `tenant.views.common.projectsDashboard.feedbackTasksFilters`: `dateRangeCheck`، `save`، `cancel`.
- وحدة `tenant.views.common.projectsDashboard.gapPointFilters`: `dateRangeCheck`، `save`، `cancel`.
- وحدة `tenant.views.common.projectsDashboard.releaseTasksModal`: `multilineStringToHTMLWordBreak`، `getReleaseTasks`، `getTaskStatus`، `getLocalDate`، `cancel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.customerCareTenant.exportFeedbackTasksToExcel` | POST | api/services/app/customerCareTenant/ExportFeedbackTasksToExcel | [المصدر](../../../raw/application.js#L103945) |
| `abp.services.app.customerCareTenant.exportGapPointsToExcel` | POST | api/services/app/customerCareTenant/ExportGapPointsToExcel | [المصدر](../../../raw/application.js#L103963) |
| `abp.services.app.customerCareTenant.importTasksList` | POST | api/services/app/customerCareTenant/ImportTasksList | [المصدر](../../../raw/application.js#L104052) |
| `abp.services.app.customerCareTenant.getOpenProjects` | POST | api/services/app/customerCareTenant/GetOpenProjects | [المصدر](../../../raw/application.js#L104418) |
| `abp.services.app.customerCareTenant.getTasksByProjectId` | POST | api/services/app/customerCareTenant/GetTasksByProjectId | [المصدر](../../../raw/application.js#L104440) |
| `abp.services.app.customerCareTenant.getGAPPointsByProjectId` | POST | api/services/app/customerCareTenant/GetGAPPointsByProjectId | [المصدر](../../../raw/application.js#L104459) |
| `abp.services.app.customerCareTenant.getPlannedReleases` | POST | api/services/app/customerCareTenant/GetPlannedReleases | [المصدر](../../../raw/application.js#L104475) |
| `abp.services.app.customerCareTenant.getClosedReleases` | POST | api/services/app/customerCareTenant/GetClosedReleases | [المصدر](../../../raw/application.js#L104489) |
| `abp.services.app.customerCareTenant.getMilestonesByProjectId` | POST | api/services/app/customerCareTenant/GetMilestonesByProjectId | [المصدر](../../../raw/application.js#L104517) |
| `abp.services.app.customerCareTenant.createOrEditProjectTask` | POST | api/services/app/customerCareTenant/CreateOrEditProjectTask | [المصدر](../../../raw/application.js#L104609) |
| `abp.services.app.customerCareTenant.getProjectWorkScope` | POST | api/services/app/customerCareTenant/GetProjectWorkScope | [المصدر](../../../raw/application.js#L104665) |
| `abp.services.app.customerCareTenant.getReleaseTasksByReleaseId` | POST | api/services/app/customerCareTenant/GetReleaseTasksByReleaseId | [المصدر](../../../raw/application.js#L104716) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.Support.ProjectsDashboard.Add`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Support.ProjectsDashboard.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Support.ProjectsDashboard.Import`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Support.ProjectsDashboard.Export`: ممنوحة في السياق الملتقط.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `module.checked` | checkbox |  |  |
| `vm.newTask.title` | text |  |  |
| `row.title` | textarea |  | ng-readonly=!vm.permissions.edit |
| `row.description` | textarea |  | ng-readonly=!vm.permissions.edit |
| `row.critical` | checkbox |  |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
