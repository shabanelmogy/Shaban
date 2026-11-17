# شاشة: Process Final Settlement

المسار في القائمة: HRM ← Payroll ← Process Final Settlement.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.hrm_finalSettlement`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0132](../../../readable/routes/R0132--tenant-hrm-finalsettlement.js)، والأصل [raw/application.js:2446](../../../raw/application.js#L2446).
- قالب الشاشة: `~/App/tenant/views/common/hrm/finalSettlement/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.common.hrm.finalSettlement.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.common.hrm.finalSettlement.index](../../../readable/controllers/C0375--tenant.views.common.hrm.finalSettlement.index.js) | 19 | 11 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.common.hrm.finalSettlement.index`: `isGranted`، `clearStaff`، `getlocalDate`، `calculateTotal`، `calculateTicket`، `searchStaff`، `searchStaffPopoup`، `getStaffRecentLeaveDetails`، `getStaffRecentTicketDetails`، `calculateEligibleValue`، `checkAirTicketForFirstTime`، `ontTicketPriceChange`، `process`، `processReferesh`، `approved`، `rounding`، `calculateTenureAndCompletedYears`، `save`، `getAllBusinessUnits`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.designation.getDesignations` | POST | api/services/app/designation/GetDesignations | [المصدر](../../../raw/application.js#L97002) |
| `abp.services.app.directory.searchStaffForHrm` | POST | api/services/app/directory/SearchStaffForHrm | [المصدر](../../../raw/application.js#L97040) |
| `abp.services.app.staff.getStaffForEdit` | POST | api/services/app/staff/GetStaffForEdit | [المصدر](../../../raw/application.js#L97054) |
| `abp.services.app.leaveSalaryPayroll.getStaffRecentLeaveDetails` | POST | [object Object] | [المصدر](../../../raw/application.js#L97082) |
| `abp.services.app.leaveSalaryPayroll.getStaffRecentTicketDetails` | POST | [object Object] | [المصدر](../../../raw/application.js#L97117) |
| `abp.services.app.leaveSalaryPayroll.getReJoiningDate` | POST | [object Object] | [المصدر](../../../raw/application.js#L97287) |
| `abp.services.app.payroll.processLeaveTicket` | POST | api/services/app/payroll/ProcessLeaveTicket | [المصدر](../../../raw/application.js#L97300) |
| `abp.services.app.payroll.leaveProcessState` | POST | api/services/app/payroll/LeaveProcessState | [المصدر](../../../raw/application.js#L97434) |
| `abp.services.app.payroll.approved` | POST | [object Object] | [المصدر](../../../raw/application.js#L97475) |
| `abp.services.app.payroll.save` | POST | api/services/app/payroll/Save | [المصدر](../../../raw/application.js#L97642) |
| `abp.services.app.businessUnit.getBusinessUnits` | POST | api/services/app/businessUnit/GetBusinessUnits | [المصدر](../../../raw/application.js#L97661) |

## الصلاحيات والحقول

لم يستخرج فحص صلاحية حرفي داخل الوحدات المرتبطة؛ افحص أيضًا شروط المسار والخادم.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.staff` | ui-select |  |  |
| `vm.staff.designationId` | select |  | ng-disabled=true; ng-options=designation.id as designation.name for designation in vm.designationDetails |
| `vm.lastWorkingDay` | input | date |  |
| `vm.staff.businessUnitId` | select | exteriorColor | ng-disabled=true; ng-options=unit.id as unit.name for unit in vm.businessUnits |
| `vm.leaveSalaryPayroll.ticketPrice` | number |  |  |
| `vm.isPayFullTicketPriceAndAdjustInSalary` | checkbox | isPayFullTicketPriceAndAdjustInSalary |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
