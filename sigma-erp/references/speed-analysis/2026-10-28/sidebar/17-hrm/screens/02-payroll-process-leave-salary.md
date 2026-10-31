# شاشة: Process Leave Salary

المسار في القائمة: HRM ← Payroll ← Process Leave Salary.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.hrm_leaveSalaryPayroll`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0131](../../../readable/routes/R0131--tenant-hrm-leavesalarypayroll.js)، والأصل [raw/application.js:2438](../../../raw/application.js#L2438).
- قالب الشاشة: `~/App/tenant/views/common/hrm/leaveSalaryPayroll/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.common.hrm.leaveSalaryPayroll.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.common.hrm.leaveSalaryPayroll.index](../../../readable/controllers/C0377--tenant.views.common.hrm.leaveSalaryPayroll.index.js) | 18 | 11 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.common.hrm.leaveSalaryPayroll.index`: `isGranted`، `clearStaff`، `getlocalDate`، `calculateTotal`، `calculateTicket`، `searchStaff`، `searchStaffPopoup`، `getStaffRecentLeaveDetails`، `getStaffRecentTicketDetails`، `calculateEligibleValue`، `checkAirTicketForFirstTime`، `ontTicketPriceChange`، `process`، `processReferesh`، `approved`، `rounding`، `save`، `getAllBusinessUnits`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.designation.getDesignations` | POST | api/services/app/designation/GetDesignations | [المصدر](../../../raw/application.js#L97838) |
| `abp.services.app.directory.searchStaffForHrm` | POST | api/services/app/directory/SearchStaffForHrm | [المصدر](../../../raw/application.js#L97875) |
| `abp.services.app.staff.getStaffForEdit` | POST | api/services/app/staff/GetStaffForEdit | [المصدر](../../../raw/application.js#L97888) |
| `abp.services.app.leaveSalaryPayroll.getStaffRecentLeaveDetails` | POST | [object Object] | [المصدر](../../../raw/application.js#L97912) |
| `abp.services.app.leaveSalaryPayroll.getStaffRecentTicketDetails` | POST | [object Object] | [المصدر](../../../raw/application.js#L97945) |
| `abp.services.app.leaveSalaryPayroll.getReJoiningDate` | POST | [object Object] | [المصدر](../../../raw/application.js#L98110) |
| `abp.services.app.payroll.processLeaveTicket` | POST | api/services/app/payroll/ProcessLeaveTicket | [المصدر](../../../raw/application.js#L98117) |
| `abp.services.app.payroll.leaveProcessState` | POST | api/services/app/payroll/LeaveProcessState | [المصدر](../../../raw/application.js#L98248) |
| `abp.services.app.payroll.approved` | POST | [object Object] | [المصدر](../../../raw/application.js#L98289) |
| `abp.services.app.payroll.save` | POST | api/services/app/payroll/Save | [المصدر](../../../raw/application.js#L98345) |
| `abp.services.app.businessUnit.getBusinessUnits` | POST | api/services/app/businessUnit/GetBusinessUnits | [المصدر](../../../raw/application.js#L98364) |

## الصلاحيات والحقول

لم يستخرج فحص صلاحية حرفي داخل الوحدات المرتبطة؛ افحص أيضًا شروط المسار والخادم.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.staff` | ui-select |  |  |
| `vm.staff.designationId` | select |  | ng-disabled=true; ng-options=designation.id as designation.name for designation in vm.designationDetails |
| `vm.staff.businessUnitId` | select |  | ng-disabled=true; ng-options=unit.id as unit.name for unit in vm.businessUnits |
| `vm.leaveSalaryPayroll.ticketPrice` | number |  |  |
| `vm.isPayFullTicketPriceAndAdjustInSalary` | checkbox | isPayFullTicketPriceAndAdjustInSalary |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
