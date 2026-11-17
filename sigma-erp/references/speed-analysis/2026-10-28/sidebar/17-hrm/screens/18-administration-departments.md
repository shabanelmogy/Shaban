# شاشة: Departments

المسار في القائمة: HRM ← Administration ← Departments.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.hrm_department`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0139](../../../readable/routes/R0139--tenant-hrm-department.js)، والأصل [raw/application.js:2498](../../../raw/application.js#L2498).
- قالب الشاشة: `~/App/tenant/views/hrm/department/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.hrm.department.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.hrm.department.index](../../../readable/controllers/C1583--tenant.views.hrm.department.index.js) | 7 | 3 |
| [tenant.views.hrm.department.createOrEditModal](../../../readable/controllers/C1582--tenant.views.hrm.department.createOrEditModal.js) | 2 | 3 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.hrm.department.index`: `searchButtonCLick`، `searchItems`، `getDepartments`، `addDepartment`، `viewDepartment`، `editDepartment`، `DeleteDepartment`.
- وحدة `tenant.views.hrm.department.createOrEditModal`: `save`، `cancel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.department.getDepartment` | POST | api/services/app/department/GetDepartment | [المصدر](../../../raw/application.js#L436676) |
| `abp.services.app.department.deleteDepartment` | POST | [object Object] | [المصدر](../../../raw/application.js#L436746) |
| `abp.services.app.department.createOrUpdateDepartment` | POST | api/services/app/department/CreateOrUpdateDepartment | [المصدر](../../../raw/application.js#L436517) |
| `abp.services.app.department.getDepartmentForEdit` | POST | [object Object] | [المصدر](../../../raw/application.js#L436534) |

## الصلاحيات والحقول

- صلاحية `Pages.HRM.Department.Create`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.HRM.Department.View`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.HRM.Department.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.HRM.Department.Delete`: ممنوحة في السياق الملتقط.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.filters.departmentName` | text |  |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
