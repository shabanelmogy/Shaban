# شاشة: Monthly Invoicing Report

المسار في القائمة: Reports ← Monthly Invoicing Report.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.report_MonthlyInvoicingReport`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0534](../../../readable/routes/R0534--tenant-report-monthlyinvoicingreport.js)، والأصل [raw/application.js:5550](../../../raw/application.js#L5550).
- قالب الشاشة: `~/App/tenant/views/crs/reports/monthlyInvoicingReport/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.reports.monthlyInvoicingReport.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.reports.monthlyInvoicingReport.index](../../../readable/controllers/C1022--tenant.views.crs.reports.monthlyInvoicingReport.index.js) | 12 | 4 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.reports.monthlyInvoicingReport.index`: `getlocalDateTime`، `locationPermission`، `searchSalesPersonPopoup`، `clearSalesPerson`، `searchUsers`، `searchUsersWithDesignation`، `formatBalanceAsDrCr`، `CurrencyFormate`، `roundingforView`، `rounding`، `getMonthlyInvoicingReport`، `exportToExcel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.commonLookup.getLocationsActiveAndInActive` | POST | api/services/app/commonLookup/GetLocationsActiveAndInActive | [المصدر](../../../raw/application.js#L273941) |
| `abp.services.app.directory.search` | POST | api/services/app/directory/Search | [المصدر](../../../raw/application.js#L273971) |
| `abp.services.app.directory.searchSalesPerson` | POST | api/services/app/directory/SearchSalesPerson | [المصدر](../../../raw/application.js#L273981) |
| `abp.services.app.monthlyInvoicingReport.getMonthlyInvoicingReport` | POST | api/services/app/monthlyInvoicingReport/GetMonthlyInvoicingReport | [المصدر](../../../raw/application.js#L274022) |

## الصلاحيات والحقول

لم يستخرج فحص صلاحية حرفي داخل الوحدات المرتبطة؛ افحص أيضًا شروط المسار والخادم.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.filters.monthYear` | input | date |  |
| `vm.filters.salesPerson` | ui-select |  |  |
| `vm.filters.salesPerson` | select | salePerson | ng-options=status as status.name for status in vm.userList |
| `vm.filters.locationId` | select | locationId |  |
| `vm.filters.contactCategory` | select |  | ng-options=customerType.id as customerType.name for customerType in vm.customerTypes |
| `vm.filters.agreementType` | select | agreementType | ng-options=item.id as item.type for item in vm.agreementTypes |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
