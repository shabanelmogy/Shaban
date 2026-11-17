# شاشة: Leave Opening Balance

المسار في القائمة: HRM ← Administration ← Leave Opening Balance.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.hrm_leaveOpeningBalance`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0151](../../../readable/routes/R0151--tenant-hrm-leaveopeningbalance.js)، والأصل [raw/application.js:2587](../../../raw/application.js#L2587).
- قالب الشاشة: `~/App/tenant/views/common/hrm/leaveOpeningBalance/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.common.hrm.leaveOpeningBalance.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.common.hrm.leaveOpeningBalance.index](../../../readable/controllers/C0376--tenant.views.common.hrm.leaveOpeningBalance.index.js) | 5 | 4 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.common.hrm.leaveOpeningBalance.index`: `save`، `getLeaveOpeningBalanceList`، `getAllLeaveOpeningBalance`، `removeLeaveOpeningBalanceRow`، `addLeaveOpeningBalanceRow`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.leaveOpeningBalance.createOrUpdateLeaveOpeningBalance` | POST | api/services/app/leaveOpeningBalance/CreateOrUpdateLeaveOpeningBalance | [المصدر](../../../raw/application.js#L97775) |
| `abp.services.app.leaveType.getLeaveType` | POST | api/services/app/leaveType/GetLeaveType | [المصدر](../../../raw/application.js#L97747) |
| `abp.services.app.leaveOpeningBalance.getLeaveOpeningBalancesForEdit` | POST | [object Object] | [المصدر](../../../raw/application.js#L97756) |

## الصلاحيات والحقول

لم يستخرج فحص صلاحية حرفي داخل الوحدات المرتبطة؛ افحص أيضًا شروط المسار والخادم.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.leaveTypeId` | select | itemTypeId | ng-options=leaveType.id as leaveType.name for leaveType in vm.leaveTypes |
| `row.cutOfDate` | input | fromDate_dateTime | ng-required=true |
| `row.openingBalance` | number |  |  |
| `row.lastRejoiningDate` | input | fromDate_dateTime | ng-required=true |
| `row.lastTicketIssuanceDate` | input | fromDate_dateTime | ng-required=true |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
