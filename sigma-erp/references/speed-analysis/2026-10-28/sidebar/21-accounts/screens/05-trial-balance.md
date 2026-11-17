# شاشة: Trial Balance

المسار في القائمة: Accounts ← Trial Balance.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_trialBalance`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0496](../../../readable/routes/R0496--tenant-crs-trialbalance.js)، والأصل [raw/application.js:5213](../../../raw/application.js#L5213).
- قالب الشاشة: `~/App/tenant/views/crs/accounting/trialBalance/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.accounting.trialBalance.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.accounting.trialBalance.index](../../../readable/controllers/C0518--tenant.views.crs.accounting.trialBalance.index.js) | 15 | 8 |
| [tenant.views.common.locations.searchContactModal](../../../readable/controllers/C0400--tenant.views.common.locations.searchContactModal.js) | 3 | 1 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.accounting.trialBalance.index`: `rounding`، `currencyAndRoundingWithThree`، `roundingforView`، `formatNumber`، `getlocalDate`، `openLedger`، `stateBranchPopoup`، `clearLocation`، `exportToExcel2`، `getTrialBalance`، `getDebitTrialBalance`، `exportToExcel`، `debitwiseExportToExcel`، `getDepths`، `getDebitDepths`.
- وحدة `tenant.views.common.locations.searchContactModal`: `cancel`، `branchSelected`، `init`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.commonLookup.getLocationsActiveAndInActive` | POST | api/services/app/commonLookup/GetLocationsActiveAndInActive | [المصدر](../../../raw/application.js#L101577) |
| `abp.services.app.division.searchDivisions` | POST | api/services/app/division/SearchDivisions | [المصدر](../../../raw/application.js#L133288) |
| `abp.services.app.costCenter.searchCostCenters` | POST | api/services/app/costCenter/SearchCostCenters | [المصدر](../../../raw/application.js#L133327) |
| `abp.services.app.journal.exportToExcel2TrialBalance` | POST | api/services/app/journal/ExportToExcel2TrialBalance | [المصدر](../../../raw/application.js#L133378) |
| `abp.services.app.journal.getTrialBalanceForMultiCurrency` | POST | api/services/app/journal/GetTrialBalanceForMultiCurrency | [المصدر](../../../raw/application.js#L133421) |
| `abp.services.app.journal.getTrialBalance` | POST | api/services/app/journal/GetTrialBalance | [المصدر](../../../raw/application.js#L133403) |
| `abp.services.app.journal.getDebitorTrialBalance` | POST | api/services/app/journal/GetDebitorTrialBalance | [المصدر](../../../raw/application.js#L133431) |

## الصلاحيات والحقول

لم يستخرج فحص صلاحية حرفي داخل الوحدات المرتبطة؛ افحص أيضًا شروط المسار والخادم.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.filters.locationName` | text |  |  |
| `vm.filters.devisionId` | select | devisionId | ng-options=division.id as division.name for division in vm.divisions |
| `vm.dateRangeModel` | text |  | min=vm.dateRangeOptions.min; max=vm.dateRangeOptions.max |
| `vm.filters.costCenterId` | select |  | ng-options=item.id as item.name for item in vm.costCentersGroup1 |
| `vm.filters.costCenter2Id` | select |  | ng-options=item.id as item.name for item in vm.costCentersGroup2 |
| `vm.filters.doNotShowAccountWithZeroActivity` | checkbox | doNotShowAccountWithZeroActivity |  |
| `vm.filters.doNotShowAccountWithEndingBalance` | checkbox | doNotShowAccountWithEndingBalance |  |
| `vm.filters.isLeafAccount` | checkbox | isLeafAccount |  |
| `vm.filters.depth` | select | depth | ng-options=depth.id as depth.name for depth in vm.depths |
| `vm.filters.locationName` | text |  |  |
| `vm.filters.devisionId` | select | devisionId | ng-options=division.id as division.name for division in vm.divisions |
| `vm.dateRangeModel` | text |  | min=vm.dateRangeOptions.min; max=vm.dateRangeOptions.max |
| `vm.filters.costCenterId` | select |  | ng-options=item.id as item.name for item in vm.costCentersGroup1 |
| `vm.filters.costCenter2Id` | select |  | ng-options=item.id as item.name for item in vm.costCentersGroup2 |
| `vm.filters.doNotShowAccountWithZeroActivity` | checkbox | doNotShowAccountWithZeroActivity |  |
| `vm.filters.doNotShowAccountWithEndingBalance` | checkbox | doNotShowAccountWithEndingBalance |  |
| `vm.filters.isLeafAccount` | checkbox | isLeafAccount |  |
| `vm.filters.depth` | select | depth | ng-options=depth.id as depth.name for depth in vm.depths |
| `vm.filters.locationName` | text |  |  |
| `vm.filters.devisionId` | select | devisionId | ng-options=division.id as division.name for division in vm.divisions |
| `vm.dateRangeModel` | text |  | min=vm.dateRangeOptions.min; max=vm.dateRangeOptions.max |
| `vm.filters.costCenterId` | select |  | ng-options=item.id as item.name for item in vm.costCentersGroup1 |
| `vm.filters.costCenter2Id` | select |  | ng-options=item.id as item.name for item in vm.costCentersGroup2 |
| `vm.filters.doNotShowAccountWithZeroActivity` | checkbox | doNotShowAccountWithZeroActivity |  |
| `vm.filters.doNotShowAccountWithEndingBalance` | checkbox | doNotShowAccountWithEndingBalance |  |
| `vm.filters.isLeafAccount` | checkbox | isLeafAccount |  |
| `vm.filters.depositDepth` | select | depositDepth | ng-options=depositDepth.id as depositDepth.name for depositDepth in vm.debitDepths |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
