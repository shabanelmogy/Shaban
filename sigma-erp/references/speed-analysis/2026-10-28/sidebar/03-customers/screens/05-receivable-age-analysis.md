# شاشة: Receivable Age Analysis

المسار في القائمة: Customers ← Receivable Age Analysis.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_receivableAgeAnalysis`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0428](../../../readable/routes/R0428--tenant-crs-receivableageanalysis.js)، والأصل [raw/application.js:4657](../../../raw/application.js#L4657).
- قالب الشاشة: `~/App/tenant/views/crs/reports/receivableAgeAnalysis/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.reports.receivableAgeAnalysis.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.reports.receivableAgeAnalysis.index](../../../readable/controllers/C1039--tenant.views.crs.reports.receivableAgeAnalysis.index.js) | 26 | 9 |
| [tenant.views.crs.reports.receivableAgeAnalysis.details](../../../readable/controllers/C1038--tenant.views.crs.reports.receivableAgeAnalysis.details.js) | 6 | 0 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.reports.receivableAgeAnalysis.index`: `roundingforView`، `periodChange`، `periodChangeDay`، `periodChangeDate`، `calculateperioddays`، `upperDateChanged`، `rounding`، `addRowDay`، `addRowDate`، `removeRowDay`، `removeRowDate`، `CurrencyFormate`، `formatBalance`، `getlocalDate`، `searchCustomers`، `searchUsers`، `searchUsersWithDesignation`، `clearCustomer`، `clearSalesPerson`، `getYearMonth`، `getAgeAnalysisReport`، `showDetailLines`، `exportToExcel`، `exportDetailExcel`، `showAllDetails`، `getCurrencies`.
- وحدة `tenant.views.crs.reports.receivableAgeAnalysis.details`: `cancel`، `rounding`، `getlocalDateTime`، `CurrencyFormate`، `getVoucherType`، `exportToExcel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.contactGroup.getContactGroupsOnContactType` | POST | api/services/app/contactGroup/GetContactGroupsOnContactType | [المصدر](../../../raw/application.js#L277941) |
| `abp.services.app.directory.search` | POST | api/services/app/directory/Search | [المصدر](../../../raw/application.js#L277959) |
| `abp.services.app.directory.searchSalesPersonOne` | POST | api/services/app/directory/SearchSalesPersonOne | [المصدر](../../../raw/application.js#L277966) |
| `abp.services.app.receivableAgeAnalysisReport.getAgeAnalysisReportSp` | POST | api/services/app/receivableAgeAnalysisReport/GetAgeAnalysisReportSp | [المصدر](../../../raw/application.js#L278063) |
| `abp.services.app.receivableAgeAnalysisReport.exportToExcelDetail` | POST | api/services/app/receivableAgeAnalysisReport/ExportToExcelDetail | [المصدر](../../../raw/application.js#L278222) |
| `abp.services.app.user.getSelectedBranchIdsByUserId` | POST | [object Object] | [المصدر](../../../raw/application.js#L278330) |
| `abp.services.app.commonLookup.getLocationsActiveAndInActive` | POST | api/services/app/commonLookup/GetLocationsActiveAndInActive | [المصدر](../../../raw/application.js#L278339) |
| `abp.services.app.currency.getCurrencies` | POST | api/services/app/currency/GetCurrencies | [المصدر](../../../raw/application.js#L278351) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.Agreements.ViewOtherBranchAgreements`: ممنوحة في السياق الملتقط.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.filters.asOfDate` | text | date |  |
| `vm.filters.customer` | ui-select |  |  |
| `vm.filters.customer` | ui-select |  |  |
| `vm.filters.module` | text | module | ng-options=module.id as module.name for module in vm.modules |
| `vm.filters.groups` | ui-select |  |  |
| `vm.filters.groups` | ui-select |  |  |
| `vm.filters.customerCategory` | select | customerCategory | ng-options=category.id as category.name for category in vm.customerCategories |
| `vm.filters.status` | select |  | ng-options=status.id as status.name for status in vm.statuses |
| `vm.filters.salesPerson` | ui-select |  |  |
| `vm.filters.salesPerson` | select | salePerson | ng-options=status as status.name for status in vm.userList |
| `vm.filters.locationId` | select | locationId |  |
| `vm.filters.currency` | select |  | ng-options=currency as (currency.name + ' (' + currency.code + ')') for currency in vm.currencies |
| `vm.period` | checkbox | Period |  |
| `vm.periodby` | radio | periodby |  |
| `vm.periodby` | radio | periodby |  |
| `row.fromDay` | number |  |  |
| `row.toDay` | number |  |  |
| `row.lowerDate` | text | date |  |
| `row.upperDate` | text | date |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
