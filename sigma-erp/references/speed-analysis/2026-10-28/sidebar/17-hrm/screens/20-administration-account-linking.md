# شاشة: Account Linking

المسار في القائمة: HRM ← Administration ← Account Linking.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.hrm_accountLinking`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0152](../../../readable/routes/R0152--tenant-hrm-accountlinking.js)، والأصل [raw/application.js:2595](../../../raw/application.js#L2595).
- قالب الشاشة: `~/App/tenant/views/common/hrm/accountLinking/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.common.hrm.accountLinking.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.common.hrm.accountLinking.index](../../../readable/controllers/C0368--tenant.views.common.hrm.accountLinking.index.js) | 12 | 7 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.common.hrm.accountLinking.index`: `searchAccounts`، `addStaffContactGroupRow`، `addStaffContactGroupRowForStaff`، `removeStaffContactGroupRow`، `localize`، `removeRow`، `onAccountChange`، `getAllPayrollAccounts`، `getPayrollAccounts`، `save`، `getAllBusinessUnits`، `getAllDivisions`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.account.searchAccounts` | POST | api/services/app/account/SearchAccounts | [المصدر](../../../raw/application.js#L95511) |
| `abp.services.app.linkedPrepaidExpense.DeleteLinkedPrepaidExpense` | غير مربوط | غير محسوم | [المصدر](../../../raw/application.js#L95543) |
| `abp.services.app.payrollAccountLinked.getPayrollLinkedAccountsForEdit` | POST | [object Object] | [المصدر](../../../raw/application.js#L95557) |
| `abp.services.app.payrollAccountLinked.createOrUpdatePayrollLinkedAccount` | POST | api/services/app/payrollAccountLinked/CreateOrUpdatePayrollLinkedAccount | [المصدر](../../../raw/application.js#L95604) |
| `abp.services.app.businessUnit.getBusinessUnits` | POST | api/services/app/businessUnit/GetBusinessUnits | [المصدر](../../../raw/application.js#L95621) |
| `abp.services.app.division.getDivisions` | POST | api/services/app/division/GetDivisions | [المصدر](../../../raw/application.js#L95635) |

## الصلاحيات والحقول

لم يستخرج فحص صلاحية حرفي داخل الوحدات المرتبطة؛ افحص أيضًا شروط المسار والخادم.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.businessUnitId` | text |  | ng-options=unit.id as unit.name for unit in vm.businessUnits |
| `vm.divisionId` | text |  | ng-options=division.id as division.name for division in vm.divisions |
| `linkAccount.staffLedgerAccount` | ui-select |  | ng-disabled=!(linkAccount.salaryItemTypeId === 51 \|\| linkAccount.salaryItemTypeId === 52 \|\| linkAccount.salaryItemTypeId === 55 \|\| linkAccount.salaryItemTypeId === 101\|\| linkAccount.salaryItemTypeId === 104) |
| `linkAccount.expenseLedgerAccount` | ui-select |  | ng-disabled=linkAccount.salaryItemTypeId === 29 \|\| linkAccount.salaryItemTypeId === 51 \|\| linkAccount.salaryItemTypeId === 52 \|\| linkAccount.salaryItemTypeId === 55 \|\| linkAccount.salaryItemTypeId === 101\|\| linkAccount.salaryItemTypeId === 104 |
| `linkAccount.provisionLedgerAccount` | ui-select |  | ng-disabled=!(linkAccount.salaryItemTypeId === 41 \|\| linkAccount.salaryItemTypeId === 44 \|\| linkAccount.salaryItemTypeId === 81) |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
