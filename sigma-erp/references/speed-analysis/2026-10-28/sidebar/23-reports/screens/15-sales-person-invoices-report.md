# شاشة: Sales Person Invoices Report

المسار في القائمة: Reports ← Sales Person Invoices Report.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_salesPersonInvoicesReport`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0444](../../../readable/routes/R0444--tenant-crs-salespersoninvoicesreport.js)، والأصل [raw/application.js:4800](../../../raw/application.js#L4800).
- قالب الشاشة: `~/App/tenant/views/crs/reports/salesPersonInvoicesReport/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.reports.salesPersonInvoicesReport.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.reports.salesPersonInvoicesReport.index](../../../readable/controllers/C1057--tenant.views.crs.reports.salesPersonInvoicesReport.index.js) | 13 | 3 |
| [common.views.common.reportViewer](../../../readable/controllers/C0006--common.views.common.reportViewer.js) | 2 | 0 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.reports.salesPersonInvoicesReport.index`: `clearSalesPerson`، `searchUsers`، `changeAgreementCategory`، `getAgreementType`، `getlocalDateTime`، `CurrencyFormate`، `roundingforView`، `getStatus`، `exportToExcel`، `reportModal`، `rounding`، `changeInvoiceRange`، `getSalesPersonInvoiceView`.
- وحدة `common.views.common.reportViewer`: `exportToExcelFromReport`، `cancel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.directory.search` | POST | api/services/app/directory/Search | [المصدر](../../../raw/application.js#L281437) |
| `abp.services.app.commonLookup.getLocations` | POST | api/services/app/commonLookup/GetLocations | [المصدر](../../../raw/application.js#L281548) |
| `abp.services.app.saleReport.getSalesPersonInvoiceView` | POST | api/services/app/saleReport/GetSalesPersonInvoiceView | [المصدر](../../../raw/application.js#L281693) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.Lease.AgreementAdditionalCharges`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.AgreementAdditionalChargesAfterClosing`: غير ممنوحة في السياق الملتقط.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.dateRangeModel` | text |  | min=vm.dateRangeOptions.min; max=vm.dateRangeOptions.max |
| `vm.filters.salesPerson` | ui-select |  |  |
| `vm.filters.invoiceType` | ui-select |  |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
