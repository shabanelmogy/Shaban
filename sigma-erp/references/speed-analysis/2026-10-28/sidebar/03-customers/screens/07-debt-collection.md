# شاشة: Debt Collection

المسار في القائمة: Customers ← Debt Collection.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_debtCollection`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0172](../../../readable/routes/R0172--tenant-crs-debtcollection.js)، والأصل [raw/application.js:2754](../../../raw/application.js#L2754).
- قالب الشاشة: `~/App/tenant/views/crs/debtCollection/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.debtCollection.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.debtCollection.index](../../../readable/controllers/C0768--tenant.views.crs.debtCollection.index.js) | 27 | 2 |
| [tenant.views.crs.reports.receivableAgeAnalysis.details](../../../readable/controllers/C1038--tenant.views.crs.reports.receivableAgeAnalysis.details.js) | 6 | 0 |
| [tenant.views.crs.debtCollection.followupModal](../../../readable/controllers/C0767--tenant.views.crs.debtCollection.followupModal.js) | 5 | 1 |
| [tenant.views.crs.debtCollection.customerBlackListModal](../../../readable/controllers/C0766--tenant.views.crs.debtCollection.customerBlackListModal.js) | 2 | 1 |
| [tenant.views.crs.debtCollection.createFollowupModal](../../../readable/controllers/C0765--tenant.views.crs.debtCollection.createFollowupModal.js) | 2 | 1 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.debtCollection.index`: `getFollowupsDueToday`، `periodChange`، `periodChangeDay`، `periodChangeDate`، `calculateperioddays`، `upperDateChanged`، `rounding`، `addRowDay`، `addRowDate`، `removeRowDay`، `removeRowDate`، `CurrencyFormate`، `formatBalance`، `getlocalDate`، `searchUsers`، `clearSalesPerson`، `getYearMonth`، `filterExceedCreditLimitRecords`، `getAgeAnalysisReport`، `showAllDetails`، `showDetailLines`، `followup`، `openCustomerBlackListModal`، `dateRangeModelChanged`، `dateRangeCheck`، `exportToExcel`، `displayContactNos`.
- وحدة `tenant.views.crs.reports.receivableAgeAnalysis.details`: `cancel`، `rounding`، `getlocalDateTime`، `CurrencyFormate`، `getVoucherType`، `exportToExcel`.
- وحدة `tenant.views.crs.debtCollection.followupModal`: `loadMoreFollowups`، `getlocalDate`، `getlocalDateTime`، `addfollowup`، `cancel`.
- وحدة `tenant.views.crs.debtCollection.customerBlackListModal`: `save`، `cancel`.
- وحدة `tenant.views.crs.debtCollection.createFollowupModal`: `save`، `cancel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.directory.search` | POST | api/services/app/directory/Search | [المصدر](../../../raw/application.js#L200537) |
| `abp.services.app.debtCollection.getAgeAnalysisReportView` | POST | api/services/app/debtCollection/GetAgeAnalysisReportView | [المصدر](../../../raw/application.js#L200637) |
| `abp.services.app.debtCollection.getContactPaymentFollowup` | POST | api/services/app/debtCollection/GetContactPaymentFollowup | [المصدر](../../../raw/application.js#L200265) |
| `abp.services.app.debtCollection.blackListContact` | POST | api/services/app/debtCollection/BlackListContact | [المصدر](../../../raw/application.js#L200235) |
| `abp.services.app.debtCollection.saveContactPaymentFollowup` | POST | api/services/app/debtCollection/SaveContactPaymentFollowup | [المصدر](../../../raw/application.js#L200208) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.Agreements.ViewOtherBranchAgreements`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Reports.CanSeeAllCustomerDebtCollection`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Reports.ShowCustomersWithoutDebtCollector`: ممنوحة في السياق الملتقط.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.filters.asOfDate` | text | date |  |
| `vm.filters.contactCategory` | select | account | ng-options=item.id as item.name for item in vm.contactCategories |
| `vm.filters.status` | select |  | ng-options=status.id as status.name for status in vm.statuses |
| `vm.filters.agreementType` | select | agreementType | ng-options=item.id as item.type for item in vm.agreementTypes |
| `vm.filters.contactBlackList` | select | contactBlackList | ng-options=item.id as item.type for item in vm.isBlackListedFilter |
| `vm.filters.module` | text | module | ng-options=module.id as module.name for module in vm.modules |
| `vm.dueToday` | checkbox |  |  |
| `vm.dateRangeModel` | text |  | min=vm.dateRangeOptions.min; max=vm.dateRangeOptions.max |
| `vm.filters.isPromised` | checkbox |  |  |
| `vm.showExceedLimitOnly` | checkbox |  |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
