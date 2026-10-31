# شاشة: Settings

المسار في القائمة: HRM ← Administration ← Settings.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.hrm_settings`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0153](../../../readable/routes/R0153--tenant-hrm-settings.js)، والأصل [raw/application.js:2603](../../../raw/application.js#L2603).
- قالب الشاشة: `~/App/tenant/views/common/hrm/settings/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.common.hrm.settings as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.common.hrm.settings](../../../readable/controllers/C0395--tenant.views.common.hrm.settings.js) | 9 | 5 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.common.hrm.settings`: `getLocalize`، `isGranted`، `addSalaryItem`، `removeSalaryItem`، `saveHrmSettings`، `getSettings`، `save`، `isDisabledSaveBtn`، `sortOfSalaryItemsChanged`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.payStructureSetting.getAll` | POST | api/services/app/payStructureSetting/GetAll | [المصدر](../../../raw/application.js#L100966) |
| `abp.services.app.salaryItemsSetting.getSalaryItemTypes` | POST | api/services/app/salaryItemsSetting/GetSalaryItemTypes | [المصدر](../../../raw/application.js#L101000) |
| `abp.services.app.tenantSettings.updateHrmSettings` | POST | api/services/app/tenantSettings/UpdateHrmSettings | [المصدر](../../../raw/application.js#L101037) |
| `abp.services.app.tenantSettings.getAllSettings` | POST | api/services/app/tenantSettings/GetAllSettings | [المصدر](../../../raw/application.js#L101052) |
| `abp.services.app.payStructureSetting.createOrUpdate` | POST | api/services/app/payStructureSetting/CreateOrUpdate | [المصدر](../../../raw/application.js#L101120) |

## الصلاحيات والحقول

لم يستخرج فحص صلاحية حرفي داخل الوحدات المرتبطة؛ افحص أيضًا شروط المسار والخادم.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `si.salaryItemId` | select |  | ng-options=obj.id as vm.getLocalize(obj.type) for obj in vm.salaryTypes\| filter:{ category: 1 }; ng-disabled=!vm.isGranted('Pages.HRM.PayStructure.Settings.Edit') |
| `si.formula` | text | name | ng-disabled=!vm.isGranted('Pages.HRM.PayStructure.Settings.Edit') \|\|si.salaryItemId==1 \|\|si.salaryItemId==29 |
| `si.salaryItemId` | select |  | ng-options=obj.id as vm.getLocalize(obj.type) for obj in vm.salaryTypes\| filter:{ category: 2 }; ng-disabled=!vm.isGranted('Pages.HRM.PayStructure.Settings.Edit') |
| `si.formula` | text | name | ng-disabled=!vm.isGranted('Pages.HRM.PayStructure.Settings.Edit') |
| `si.salaryItemId` | select |  | ng-options=obj.id as vm.getLocalize(obj.type) for obj in vm.salaryTypes\| filter:{ category: 3 }; ng-disabled=!vm.isGranted('Pages.HRM.PayStructure.Settings.Edit') |
| `si.salaryItemId` | select |  | ng-options=obj.id as vm.getLocalize(obj.type) for obj in vm.salaryTypes\| filter:{ category: 4 }; ng-disabled=!vm.isGranted('Pages.HRM.PayStructure.Settings.Edit') |
| `si.formula` | text | name | ng-disabled=!vm.isGranted('Pages.HRM.PayStructure.Settings.Edit') |
| `si.salaryItemId` | select |  | ng-options=obj.id as vm.getLocalize(obj.type) for obj in vm.salaryTypes\| filter:{ category: 5 }; ng-disabled=!vm.isGranted('Pages.HRM.PayStructure.Settings.Edit') |
| `si.formula` | text | name | ng-disabled=!vm.isGranted('Pages.HRM.PayStructure.Settings.Edit') |
| `vm.settings.hrm.employerMolNumber` | text | Weekly |  |
| `vm.settings.hrm.employerBankRoutingCode` | text | Weekly |  |
| `vm.settings.hrm.accountLinkingType` | text |  | ng-options=accountLinkingType.id as accountLinkingType.name for accountLinkingType in vm.accountLinkingTypes |
| `vm.settings.hrm.monthDaysCalculationRule` | text |  | ng-options=type.id as type.name for type in vm.daysPerMonthCalculationMethod |
| `vm.settings.hrm.gratuityDaysForFirstFiveYears` | text | minDrivingExperience |  |
| `vm.settings.hrm.gratuityDaysAfterFiveYears` | text | minDrivingExperience |  |
| `vm.filters.salaryItemsForLeaveSalaryCalculation` | ui-select |  |  |
| `vm.settings.hrm.isPreviousMonthOvertimeForPayrollProcess` | checkbox | IsPreviousMonthOvertimeForPayrollProcess |  |
| `vm.settings.hrm.isPreviousMonthSalesCommissionForPayrollProcess` | checkbox | IsPreviousMonthSalesCommissionForPayrollProcess |  |
| `vm.settings.hrm.isBusinessUnitsWisePayrollProcess` | checkbox | IsBusinessUnitsWisePayrollProcess |  |
| `vm.settings.hrm.departmentwiseSalaryPaymentForPayroll` | checkbox | DepartmentwiseSalaryPaymentForPayroll |  |
| `vm.settings.hrm.staffPayrollJournalWithoutContact` | checkbox | StaffPayrollJournalWithoutContact |  |
| `vm.settings.hrm.showDeleteOptionForApprovedLeave` | checkbox | ShowDeleteOptionForApprovedLeave |  |
| `vm.settings.hrm.showNormalAndHolidayOverTimeHoursInProcessedPayroll` | checkbox | ShowNormalAndHolidayOverTimeHoursInProcessedPayroll |  |
| `vm.settings.hrm.attendanceDeductionEnabled` | checkbox | AttendanceDeductionEnabled |  |
| `vm.settings.hrm.attendanceRegularizationLimit` | number | AttendanceRegularizationLimit | min=0; max=31 |
| `vm.settings.hrm.attendanceGracePeriodMinutes` | number | AttendanceGracePeriodMinutes | min=0 |
| `vm.settings.hrm.payrollCutoffDay` | number | PayrollCutoffDay | min=1; max=28 |
| `vm.settings.hrm.minimumOvertimeMinutesPerDay` | number | MinimumOvertimeMinutesPerDay | min=1 |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
