# شاشة: Process Payroll

المسار في القائمة: HRM ← Payroll ← Process Payroll.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.hrm_payroll`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0130](../../../readable/routes/R0130--tenant-hrm-payroll.js)، والأصل [raw/application.js:2430](../../../raw/application.js#L2430).
- قالب الشاشة: `~/App/tenant/views/common/hrm/payroll/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.common.hrm.payroll.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.common.hrm.payroll.index](../../../readable/controllers/C0379--tenant.views.common.hrm.payroll.index.js) | 10 | 5 |
| [tenant.views.common.hrm.payroll.editModal](../../../readable/controllers/C0378--tenant.views.common.hrm.payroll.editModal.js) | 3 | 1 |
| [tenant.views.common.hrm.payroll.payrollDetailModal](../../../readable/controllers/C0380--tenant.views.common.hrm.payroll.payrollDetailModal.js) | 4 | 1 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.common.hrm.payroll.index`: `isGranted`، `monthChanged`، `processReferesh`، `process`، `save`، `approved`، `rounding`، `openEditModal`، `openPayrollDetailModal`، `getAllBusinessUnits`.
- وحدة `tenant.views.common.hrm.payroll.editModal`: `save`، `cancel`، `showSalaryType`.
- وحدة `tenant.views.common.hrm.payroll.payrollDetailModal`: `rounding`، `cancel`، `getlocalDate`، `salaryType`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.payroll.processState` | POST | api/services/app/payroll/ProcessState | [المصدر](../../../raw/application.js#L98476) |
| `abp.services.app.payroll.process` | POST | api/services/app/payroll/Process | [المصدر](../../../raw/application.js#L98516) |
| `abp.services.app.payroll.save` | POST | api/services/app/payroll/Save | [المصدر](../../../raw/application.js#L98572) |
| `abp.services.app.payroll.approved` | POST | [object Object] | [المصدر](../../../raw/application.js#L98592) |
| `abp.services.app.businessUnit.getBusinessUnits` | POST | api/services/app/businessUnit/GetBusinessUnits | [المصدر](../../../raw/application.js#L98700) |
| `abp.services.app.payroll.editStaffPay` | POST | api/services/app/payroll/EditStaffPay | [المصدر](../../../raw/application.js#L98419) |
| `abp.services.app.salaryItemsSetting.getSalaryItemTypes` | POST | api/services/app/salaryItemsSetting/GetSalaryItemTypes | [المصدر](../../../raw/application.js#L98753) |

## الصلاحيات والحقول

لم يستخرج فحص صلاحية حرفي داخل الوحدات المرتبطة؛ افحص أيضًا شروط المسار والخادم.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.filters.monthYear` | input | date |  |
| `vm.businessUnitId` | select | exteriorColor | ng-options=unit.id as unit.name for unit in vm.businessUnits |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
