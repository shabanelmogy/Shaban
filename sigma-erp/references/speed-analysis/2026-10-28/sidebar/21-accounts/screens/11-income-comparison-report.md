# شاشة: Income Comparison Report

المسار في القائمة: Accounts ← Income Comparison Report.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_incomeComparisonReport`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0487](../../../readable/routes/R0487--tenant-crs-incomecomparisonreport.js)، والأصل [raw/application.js:5129](../../../raw/application.js#L5129).
- قالب الشاشة: `~/App/tenant/views/crs/accounting/incomeComparisonReport/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.accounting.incomeComparisonReport.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.accounting.incomeComparisonReport.index](../../../readable/controllers/C0486--tenant.views.crs.accounting.incomeComparisonReport.index.js) | 10 | 4 |
| [tenant.views.common.locations.searchContactModal](../../../readable/controllers/C0400--tenant.views.common.locations.searchContactModal.js) | 3 | 1 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.accounting.incomeComparisonReport.index`: `formatNumber`، `getlocalDate`، `roundingforView`، `currencyAndRoundingWithThree`، `getCostCenterValue`، `stateBranchPopoup`، `clearLocation`، `rounding`، `getProfitLossComparisonStatement`، `exportToExcel`.
- وحدة `tenant.views.common.locations.searchContactModal`: `cancel`، `branchSelected`، `init`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.commonLookup.getLocations` | POST | api/services/app/commonLookup/GetLocations | [المصدر](../../../raw/application.js#L123528) |
| `abp.services.app.division.searchDivisions` | POST | api/services/app/division/SearchDivisions | [المصدر](../../../raw/application.js#L123534) |
| `abp.services.app.costCenter.getCostCenters` | POST | api/services/app/costCenter/GetCostCenters | [المصدر](../../../raw/application.js#L123540) |
| `abp.services.app.incomeComparisonReport.getProfitLossComparisonStatement` | POST | api/services/app/incomeComparisonReport/GetProfitLossComparisonStatement | [المصدر](../../../raw/application.js#L123558) |
| `abp.services.app.commonLookup.getLocationsActiveAndInActive` | POST | api/services/app/commonLookup/GetLocationsActiveAndInActive | [المصدر](../../../raw/application.js#L101577) |

## الصلاحيات والحقول

لم يستخرج فحص صلاحية حرفي داخل الوحدات المرتبطة؛ افحص أيضًا شروط المسار والخادم.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.fromDateRangeModel` | text |  | min=vm.fromDateRangeOptions.min; max=vm.fromDateRangeOptions.max |
| `vm.toDateRangeModel` | text |  | min=vm.toDateRangeOptions.min; max=vm.toDateRangeOptions.max |
| `vm.filters.locationName` | text |  |  |
| `vm.filters.devisionId` | select | devisionId | ng-options=division.id as division.name for division in vm.divisions |
| `vm.filters.costCenterId` | select | costCenterId | ng-options=costCenter.id as costCenter.name for costCenter in vm.costCentersGroup1 |
| `vm.filters.costCenter2Id` | select | costCenterId | ng-options=costCenter.id as costCenter.name for costCenter in vm.costCentersGroup2 |
| `vm.filters.doNotShowAccountWithZeroActivity` | checkbox | doNotShowAccountWithZeroActivity |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
