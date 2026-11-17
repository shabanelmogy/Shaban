# شاشة: Administration

المسار في القائمة: CRM ← Administration.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_payableAgeAnalysis`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0429](../../../readable/routes/R0429--tenant-crs-payableageanalysis.js)، والأصل [raw/application.js:4665](../../../raw/application.js#L4665).
- قالب الشاشة: `~/App/tenant/views/crs/reports/payableAgeAnalysis/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.reports.payableAgeAnalysis.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.reports.payableAgeAnalysis.index](../../../readable/controllers/C1032--tenant.views.crs.reports.payableAgeAnalysis.index.js) | 20 | 5 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.reports.payableAgeAnalysis.index`: `periodChange`، `periodChangeDay`، `periodChangeDate`، `calculateperioddays`، `upperDateChanged`، `rounding`، `addRowDay`، `addRowDate`، `removeRowDay`، `removeRowDate`، `CurrencyFormate`، `formatBalance`، `getlocalDate`، `searchCustomers`، `searchUsers`، `clearSupplier`، `getYearMonth`، `getAgeAnalysisReport`، `exportDetailExcel`، `exportToExcel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.contactGroup.getContactGroupsOnContactType` | POST | api/services/app/contactGroup/GetContactGroupsOnContactType | [المصدر](../../../raw/application.js#L276420) |
| `abp.services.app.directory.search` | POST | api/services/app/directory/Search | [المصدر](../../../raw/application.js#L276437) |
| `abp.services.app.payableAgeAnalysisReport.getAgeAnalysisReport` | POST | api/services/app/payableAgeAnalysisReport/GetAgeAnalysisReport | [المصدر](../../../raw/application.js#L276511) |
| `abp.services.app.payableAgeAnalysisReport.exportToExcelDetail` | POST | api/services/app/payableAgeAnalysisReport/ExportToExcelDetail | [المصدر](../../../raw/application.js#L276525) |

## الصلاحيات والحقول

لم يستخرج فحص صلاحية حرفي داخل الوحدات المرتبطة؛ افحص أيضًا شروط المسار والخادم.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.filters.asOfDate` | input | date |  |
| `vm.filters.supplier` | ui-select |  |  |
| `vm.filters.groups` | ui-select |  |  |
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
