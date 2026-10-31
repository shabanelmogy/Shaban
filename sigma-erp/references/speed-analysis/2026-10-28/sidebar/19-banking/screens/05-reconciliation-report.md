# شاشة: Reconciliation Report

المسار في القائمة: Banking ← Reconciliation Report.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_reconciliationReport`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0463](../../../readable/routes/R0463--tenant-crs-reconciliationreport.js)، والأصل [raw/application.js:4948](../../../raw/application.js#L4948).
- قالب الشاشة: `~/App/tenant/views/crs/banking/reconciledReport/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.banking.reconciledReport.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.banking.reconciledReport.index](../../../readable/controllers/C0648--tenant.views.crs.banking.reconciledReport.index.js) | 8 | 5 |
| [tenant.views.crs.banking.reconciledReport.printPreview](../../../readable/controllers/C0649--tenant.views.crs.banking.reconciledReport.printPreview.js) | 2 | 0 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.banking.reconciledReport.index`: `dateRangeCheck`، `getlocalDateTime`، `getBankAccounts`، `locationPermission`، `deleteReconciliation`، `bankReconciledReportPrintModal`، `exportToExcel`، `getBankReconciliation`.
- وحدة `tenant.views.crs.banking.reconciledReport.printPreview`: `cancel`، `getTemplateUrl`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.commonLookup.getBankAccountsForSelection` | POST | api/services/app/commonLookup/GetBankAccountsForSelection | [المصدر](../../../raw/application.js#L169838) |
| `abp.services.app.commonLookup.getLocations` | POST | api/services/app/commonLookup/GetLocations | [المصدر](../../../raw/application.js#L169854) |
| `abp.services.app.bankReconciliation.deleteReconciliation` | POST | api/services/app/bankReconciliation/DeleteReconciliation | [المصدر](../../../raw/application.js#L169867) |
| `abp.services.app.bankReconciliation.exportToExcel` | POST | api/services/app/bankReconciliation/ExportToExcel | [المصدر](../../../raw/application.js#L169993) |
| `abp.services.app.bankReconciliation.getReconciledReport` | POST | api/services/app/bankReconciliation/GetReconciledReport | [المصدر](../../../raw/application.js#L170003) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.Banking.DeleteReconciliation`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Receipts.ViewOtherBranchReceipts`: ممنوحة في السياق الملتقط.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.dateRangeModel` | text |  | min=vm.dateRangeOptions.min; max=vm.dateRangeOptions.max; ng-disabled=!vm.filters.enableDateRange |
| `vm.filters.enableDateRange` | checkbox | disableDateRange |  |
| `vm.filters.linkedAccount` | ui-select |  | ng-disabled=vm.enable |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
