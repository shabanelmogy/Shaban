# شاشة: Link Accounts

المسار في القائمة: Accounts ← Link Accounts.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_linkAccounts`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0499](../../../readable/routes/R0499--tenant-crs-linkaccounts.js)، والأصل [raw/application.js:5236](../../../raw/application.js#L5236).
- قالب الشاشة: `~/App/tenant/views/crs/accounting/linkAccounts/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.accounting.linkAccounts.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.accounting.linkAccounts.index](../../../readable/controllers/C0501--tenant.views.crs.accounting.linkAccounts.index.js) | 31 | 21 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.accounting.linkAccounts.index`: `getJobTypeName`، `searchAccounts`، `addStaffContactGroupRow`، `addStaffContactGroupRowForStaff`، `removeStaffContactGroupRow`، `getContactType`، `getBillingMethodCategory`، `generalFilter`، `chargesFilter`، `chargesFilterCompany`، `chargesFilterExternalEquipment`، `chargesFilterExternalOperator`، `chargesFilterRent`، `billingMethodFilter`، `contactGroupFilter`، `contactGroupStaffFilter`، `localize`، `removeRow`، `addRow`، `addRowStockLinkAccount`، `addRowStockLinkAccountRevenue`، `removeRowStockLinkAccount`، `removeRowStockLinkAccountRevenue`، `addExternalParameterLinkChargesRow`، `addLinkChargesRow`، `removeLinkChargesRow`، `saveLinkedPrepaidExpense`، `save`، `getJobTypeName`، `expenseAccountCheckedOrUnchecked`، `saveExpenseAccounts`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.account.searchAccounts` | POST | api/services/app/account/SearchAccounts | [المصدر](../../../raw/application.js#L127655) |
| `abp.services.app.linkedPrepaidExpense.DeleteLinkedPrepaidExpense` | غير مربوط | غير محسوم | [المصدر](../../../raw/application.js#L127783) |
| `abp.services.app.linkedAccount.deleteStockLinkAccount` | POST | api/services/app/linkedAccount/DeleteStockLinkAccount | [المصدر](../../../raw/application.js#L127820) |
| `abp.services.app.commonLookup.getLocationsActiveAndInActive` | POST | api/services/app/commonLookup/GetLocationsActiveAndInActive | [المصدر](../../../raw/application.js#L127873) |
| `abp.services.app.linkedPrepaidExpense.createOrUpdateLinkedPrepaidExpense` | POST | api/services/app/linkedPrepaidExpense/CreateOrUpdateLinkedPrepaidExpense | [المصدر](../../../raw/application.js#L127881) |
| `abp.services.app.chargesSetting.getChargesSettings` | POST | api/services/app/chargesSetting/GetChargesSettings | [المصدر](../../../raw/application.js#L127892) |
| `abp.services.app.linkedAccount.createOrUpdateLinkedAccount` | POST | api/services/app/linkedAccount/CreateOrUpdateLinkedAccount | [المصدر](../../../raw/application.js#L127900) |
| `abp.services.app.bankAccount.getBankAccountsForSelection` | POST | api/services/app/bankAccount/GetBankAccountsForSelection | [المصدر](../../../raw/application.js#L127921) |
| `abp.services.app.itemType.getItemTypes` | POST | api/services/app/itemType/GetItemTypes | [المصدر](../../../raw/application.js#L127935) |
| `abp.services.app.jobCategory.getJobCategory` | POST | api/services/app/jobCategory/GetJobCategory | [المصدر](../../../raw/application.js#L127943) |
| `abp.services.app.linkedAccount.getStockLinkAccounts` | POST | api/services/app/linkedAccount/GetStockLinkAccounts | [المصدر](../../../raw/application.js#L127951) |
| `abp.services.app.linkedPrepaidExpense.getLinkedPrepaidExpense` | POST | api/services/app/linkedPrepaidExpense/GetLinkedPrepaidExpense | [المصدر](../../../raw/application.js#L127995) |
| `abp.services.app.chargesSetting.getChargesTypes` | POST | api/services/app/chargesSetting/GetChargesTypes | [المصدر](../../../raw/application.js#L128004) |
| `abp.services.app.chargesSetting.getRateTypes` | POST | api/services/app/chargesSetting/GetRateTypes | [المصدر](../../../raw/application.js#L128019) |
| `abp.services.app.contactGroup.getContactGroupsOnContactType` | POST | api/services/app/contactGroup/GetContactGroupsOnContactType | [المصدر](../../../raw/application.js#L128037) |
| `abp.services.app.account.getAccountsFromCRStenant` | POST | api/services/app/account/GetAccountsFromCRStenant | [المصدر](../../../raw/application.js#L128106) |
| `abp.services.app.linkedAccount.updateCRSTenantJobExpenseAccounts` | POST | api/services/app/linkedAccount/UpdateCRSTenantJobExpenseAccounts | [المصدر](../../../raw/application.js#L128132) |
| `abp.services.app.linkedAccount.getCRSTenantJobExpenseAccountsAdvanceSetting` | POST | api/services/app/linkedAccount/GetCRSTenantJobExpenseAccountsAdvanceSetting | [المصدر](../../../raw/application.js#L128144) |
| `abp.services.app.linkedAccount.getLinkedAccountsForEdit` | POST | api/services/app/linkedAccount/GetLinkedAccountsForEdit | [المصدر](../../../raw/application.js#L128154) |

## الصلاحيات والحقول

لم يستخرج فحص صلاحية حرفي داخل الوحدات المرتبطة؛ افحص أيضًا شروط المسار والخادم.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `linkAccount.account` | ui-select |  |  |
| `vm.enabledModule` | text |  | ng-options=module.id as module.name for module in vm.modules |
| `linkAccount.account` | ui-select |  |  |
| `linkAccount.chargesTypeId` | select |  | ng-options=chargesType.id as chargesType.name for chargesType in vm.chargesTypes |
| `linkAccount.rateTypeId` | select |  |  |
| `linkAccount.account` | ui-select |  |  |
| `linkAccount.chargesTypeId` | select |  | ng-options=chargesType.id as chargesType.name for chargesType in vm.chargesTypesForExternalEquipment |
| `linkAccount.rateTypeId` | select |  |  |
| `linkAccount.account` | ui-select |  |  |
| `linkAccount.chargesTypeId` | select |  | ng-options=chargesType.id as chargesType.name for chargesType in vm.chargesTypesForExternalOperator |
| `linkAccount.rateTypeId` | select |  |  |
| `linkAccount.account` | ui-select |  |  |
| `linkAccount.contactGroup` | ui-select |  |  |
| `linkAccount.chargesTypeId` | select |  | ng-options=chargesTypeDetail.chargesType.id as chargesTypeDetail.chargesType.name for chargesTypeDetail in vm.chargesSettings |
| `linkAccount.account` | ui-select |  |  |
| `linkAccount.account` | ui-select |  |  |
| `linkAccount.contactGroup` | ui-select |  |  |
| `linkAccount.account` | ui-select |  |  |
| `vm.billingMethodsLocationId` | select | locationId |  |
| `linkAccount.account` | ui-select |  |  |
| `bankAccount.linkedAccount` | ui-select |  |  |
| `linkAccount.prepaidAccount` | ui-select |  |  |
| `linkAccount.expenseAccount` | ui-select |  |  |
| `itemType.account` | ui-select |  |  |
| `itemType.jobCategoryId` | select |  | ng-options=jobCategory.id as jobCategory.name for jobCategory in vm.jobCategory |
| `itemType.itemTypeId` | select |  | ng-options=itemType.id as itemType.name for itemType in vm.itemTypes |
| `itemType.account` | ui-select |  |  |
| `itemType.jobCategoryId` | select |  | ng-options=jobCategory.id as jobCategory.name for jobCategory in vm.jobCategory |
| `itemType.jobType` | select |  | ng-options=jobType.id as jobType.name for jobType in vm.jobTypes |
| `itemType.itemTypeId` | select |  | ng-options=itemType.id as itemType.name for itemType in vm.itemTypes |
| `itemType.account` | ui-select |  |  |
| `row.accountId` | ui-select |  |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
