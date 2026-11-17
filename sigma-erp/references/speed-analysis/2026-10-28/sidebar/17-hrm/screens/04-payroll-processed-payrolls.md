# شاشة: Processed Payrolls

المسار في القائمة: HRM ← Payroll ← Processed Payrolls.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.hrm_payrolls`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0133](../../../readable/routes/R0133--tenant-hrm-payrolls.js)، والأصل [raw/application.js:2454](../../../raw/application.js#L2454).
- قالب الشاشة: `~/App/tenant/views/common/hrm/payrolls/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.common.hrm.payrolls.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.common.hrm.payrolls.index](../../../readable/controllers/C0383--tenant.views.common.hrm.payrolls.index.js) | 16 | 6 |
| [tenant.views.common.hrm.payrolls.viewModal](../../../readable/controllers/C0388--tenant.views.common.hrm.payrolls.viewModal.js) | 3 | 1 |
| [tenant.views.common.hrm.payrolls.editModal](../../../readable/controllers/C0382--tenant.views.common.hrm.payrolls.editModal.js) | 5 | 1 |
| [tenant.views.common.hrm.payrolls.printTemplates.printPreview](../../../readable/controllers/C0389--tenant.views.common.hrm.payrolls.printTemplates.printPreview.js) | 2 | 0 |
| [tenant.views.common.hrm.payrolls.payrollApprovalModal](../../../readable/controllers/C0384--tenant.views.common.hrm.payrolls.payrollApprovalModal.js) | 11 | 2 |
| [tenant.views.common.hrm.payrolls.payrollDetailModal](../../../readable/controllers/C0385--tenant.views.common.hrm.payrolls.payrollDetailModal.js) | 11 | 4 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.common.hrm.payrolls.index`: `isGranted`، `dateRangeModelChanged`، `statusChanged`، `dateRangeCheck`، `getPayrolls`، `openViewModal`، `openEditModal`، `openPrintModal`، `locationPermission`، `getlocalDateTime`، `exportToExcel`، `exportToExcel`، `openSalaryVoucherModal`، `approvePayroll`، `getAllBusinessUnits`، `generateWpsReport`.
- وحدة `tenant.views.common.hrm.payrolls.viewModal`: `showSalaryType`، `cancel`، `rounding`.
- وحدة `tenant.views.common.hrm.payrolls.editModal`: `showSalaryType`، `cancel`، `rounding`، `openPayrollDetailModal`، `filteredPayrollDetails`.
- وحدة `tenant.views.common.hrm.payrolls.printTemplates.printPreview`: `cancel`، `getTemplateUrl`.
- وحدة `tenant.views.common.hrm.payrolls.payrollApprovalModal`: `CurrencyFormate`، `roundingforView`، `getType`، `salaryVoucherTypes`، `dateRangeCheck`، `dateRangeModelChanged`، `isPrintEnabled`، `getlocalDateTime`، `approvePayroll`، `getPayroll`، `cancel`.
- وحدة `tenant.views.common.hrm.payrolls.payrollDetailModal`: `cancel`، `toggleCheckbox`، `cancel`، `roundingforView`، `getPayrollDetail`، `savePayrollDetail`، `refreshDeductions`، `openEditDeductionModal`، `salaryType`، `formatDateOnly`، `rounding`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.payroll.getPayrolls` | POST | api/services/app/payroll/GetPayrolls | [المصدر](../../../raw/application.js#L99053) |
| `abp.services.app.person.exportToExcelTenant` | POST | api/services/app/person/ExportToExcelTenant | [المصدر](../../../raw/application.js#L99254) |
| `abp.services.app.payroll.payrollDetailsExportToExcel` | POST | api/services/app/payroll/PayrollDetailsExportToExcel | [المصدر](../../../raw/application.js#L99267) |
| `abp.services.app.payroll.approved` | POST | [object Object] | [المصدر](../../../raw/application.js#L99301) |
| `abp.services.app.businessUnit.getBusinessUnits` | POST | api/services/app/businessUnit/GetBusinessUnits | [المصدر](../../../raw/application.js#L99314) |
| `abp.services.app.payroll.generateWpsReport` | POST | [object Object] | [المصدر](../../../raw/application.js#L99324) |
| `abp.services.app.payroll.getPayroll` | POST | api/services/app/payroll/GetPayroll | [المصدر](../../../raw/application.js#L98905) |
| `abp.services.app.salaryVoucher.getPayrollRecord` | POST | [object Object] | [المصدر](../../../raw/application.js#L99473) |
| `abp.services.app.salaryVoucher.getPayrollDetailsByPayrollId` | POST | api/services/app/salaryVoucher/GetPayrollDetailsByPayrollId | [المصدر](../../../raw/application.js#L99490) |
| `abp.services.app.payroll.getPayrollDetailForEdit` | POST | api/services/app/payroll/GetPayrollDetailForEdit | [المصدر](../../../raw/application.js#L99597) |
| `abp.services.app.payroll.savePayrollDetail` | POST | api/services/app/payroll/SavePayrollDetail | [المصدر](../../../raw/application.js#L99625) |
| `abp.services.app.payroll.getUpdatedDeductions` | POST | api/services/app/payroll/GetUpdatedDeductions | [المصدر](../../../raw/application.js#L99638) |
| `abp.services.app.salaryItemsSetting.getSalaryItemTypes` | POST | api/services/app/salaryItemsSetting/GetSalaryItemTypes | [المصدر](../../../raw/application.js#L99695) |

## الصلاحيات والحقول

- صلاحية `Pages.HRM.Payrolls.View`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.HRM.Payrolls.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.HRM.Payrolls.Export`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.HRM.Payrolls.Print`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.HRM.SalaryVoucher.View`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.HRM.SalaryVoucher.Delete`: ممنوحة في السياق الملتقط.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.dateRangeModel` | text |  | min=vm.dateRangeOptions.min; max=vm.dateRangeOptions.max; ng-disabled=!vm.filters.enableDateRange |
| `vm.filters.enableDateRange` | checkbox | disableDateRange |  |
| `vm.filters.type` | select | itemTypeId | ng-options=payrollType.id as payrollType.name for payrollType in vm.payrollTypes |
| `vm.businessUnitId` | select | exteriorColor | ng-options=unit.id as unit.name for unit in vm.businessUnits |
| `vm.filters.showApprovalPendingPayrolls` | checkbox | ShowApprovalPendingPayrolls |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
