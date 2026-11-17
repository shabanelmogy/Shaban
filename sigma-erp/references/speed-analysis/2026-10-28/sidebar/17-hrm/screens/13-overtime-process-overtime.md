# شاشة: Process Overtime

المسار في القائمة: HRM ← Overtime ← Process Overtime.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.hrm_overtime`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0144](../../../readable/routes/R0144--tenant-hrm-overtime.js)، والأصل [raw/application.js:2533](../../../raw/application.js#L2533).
- قالب الشاشة: `~/App/tenant/views/hrm/overtime/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.common.hrm.overtime.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.common.hrm.overtime.index](../../../readable/controllers/C1598--tenant.views.common.hrm.overtime.index.js) | 17 | 5 |
| [tenant.views.hrm.overtime.overTimeProcessModal](../../../readable/controllers/C1600--tenant.views.hrm.overtime.overTimeProcessModal.js) | 9 | 3 |
| [tenant.views.hrm.overtime.createOrEditModal](../../../readable/controllers/C1596--tenant.views.hrm.overtime.createOrEditModal.js) | 9 | 5 |
| [tenant.views.hrm.overtime.updateOvertime](../../../readable/controllers/C1601--tenant.views.hrm.overtime.updateOvertime.js) | 3 | 2 |
| [tenant.views.hrm.overtime.viewModal](../../../readable/controllers/C1602--tenant.views.hrm.overtime.viewModal.js) | 2 | 1 |
| [tenant.views.hrm.overtime.overtimeApprovalModal](../../../readable/controllers/C1599--tenant.views.hrm.overtime.overtimeApprovalModal.js) | 3 | 2 |
| [tenant.views.hrm.overtime.importOvertime](../../../readable/controllers/C1597--tenant.views.hrm.overtime.importOvertime.js) | 6 | 1 |
| [tenant.views.common.hrm.payroll.editModal](../../../readable/controllers/C0378--tenant.views.common.hrm.payroll.editModal.js) | 3 | 1 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.common.hrm.overtime.index`: `isGranted`، `monthChanged`، `processReferesh`، `dateRangeModelChanged`، `dateRangeCheck`، `getOvertimes`، `process`، `save`، `deleteOvertime`، `rounding`، `processOvertimePopup`، `openCreateOrEditMOdal`، `openUpdateOvertimeModal`، `openViewModal`، `approveOvertime`، `getlocalDateTime`، `getStatusName`.
- وحدة `tenant.views.hrm.overtime.overTimeProcessModal`: `isGranted`، `cancel`، `monthChanged`، `processReferesh`، `process`، `openImportModal`، `mergeImportedOvertimes`، `save`، `rounding`.
- وحدة `tenant.views.hrm.overtime.createOrEditModal`: `isGranted`، `monthChanged`، `processReferesh`، `cancel`، `process`، `save`، `approved`، `rounding`، `openEditModal`.
- وحدة `tenant.views.hrm.overtime.updateOvertime`: `cancel`، `save`، `onOvertimeChange`.
- وحدة `tenant.views.hrm.overtime.viewModal`: `cancel`، `rounding`.
- وحدة `tenant.views.hrm.overtime.overtimeApprovalModal`: `approveOvertime`، `cancel`، `rounding`.
- وحدة `tenant.views.hrm.overtime.importOvertime`: `getlocalDate`، `cancel`، `refresh`، `loadFile`، `importData`، `resolveBoolValue`.
- وحدة `tenant.views.common.hrm.payroll.editModal`: `save`، `cancel`، `showSalaryType`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.overtime.overtimeState` | POST | api/services/app/overtime/OvertimeState | [المصدر](../../../raw/application.js#L440318) |
| `abp.services.app.overtime.getAllOvertimes` | POST | api/services/app/overtime/GetAllOvertimes | [المصدر](../../../raw/application.js#L440970) |
| `abp.services.app.overtime.getStaffsOvertimes` | POST | api/services/app/overtime/GetStaffsOvertimes | [المصدر](../../../raw/application.js#L440361) |
| `abp.services.app.overtime.save` | POST | api/services/app/overtime/Save | [المصدر](../../../raw/application.js#L440385) |
| `abp.services.app.overtime.delete` | POST | api/services/app/overtime/Delete | [المصدر](../../../raw/application.js#L441033) |
| `abp.services.app.overtime.approved` | غير مربوط | غير محسوم | [المصدر](../../../raw/application.js#L440406) |
| `abp.services.app.overtime.getOverTimeForEdit` | غير مربوط | غير محسوم | [المصدر](../../../raw/application.js#L440468) |
| `abp.services.app.overtime.createOrUpdateOvertime` | POST | api/services/app/overtime/CreateOrUpdateOvertime | [المصدر](../../../raw/application.js#L441657) |
| `abp.services.app.overtime.getOvertimeForEdit` | POST | api/services/app/overtime/GetOvertimeForEdit | [المصدر](../../../raw/application.js#L441685) |
| `abp.services.app.overtime.getOvertimeForView` | POST | api/services/app/overtime/GetOvertimeForView | [المصدر](../../../raw/application.js#L441345) |
| `abp.services.app.overtime.overTimeApproval` | POST | [object Object] | [المصدر](../../../raw/application.js#L441321) |
| `abp.services.app.overtime.importOvertimes` | POST | api/services/app/overtime/ImportOvertimes | [المصدر](../../../raw/application.js#L440760) |
| `abp.services.app.payroll.editStaffPay` | POST | api/services/app/payroll/EditStaffPay | [المصدر](../../../raw/application.js#L98419) |

## الصلاحيات والحقول

- صلاحية `Pages.HRM.Overtime.View`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.HRM.Overtime.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.HRM.Overtime.Approve`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.HRM.Overtime.Delete`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.HRM.Overtime.Import`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.HRM.Overtime.ViewApprovedOvertimeDetails`: ممنوحة في السياق الملتقط.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.dateRangeModel` | text |  | min=vm.dateRangeOptions.min; max=vm.dateRangeOptions.max; ng-disabled=!vm.filters.enableDateRange |
| `vm.filters.enableDateRange` | checkbox | disableDateRange |  |
| `vm.filters.monthYear` | input | date |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
