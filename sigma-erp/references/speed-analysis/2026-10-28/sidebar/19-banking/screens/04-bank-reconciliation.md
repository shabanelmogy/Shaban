# شاشة: Bank Reconciliation

المسار في القائمة: Banking ← Bank Reconciliation.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_bankReconciliation`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0462](../../../readable/routes/R0462--tenant-crs-bankreconciliation.js)، والأصل [raw/application.js:4940](../../../raw/application.js#L4940).
- قالب الشاشة: `~/App/tenant/views/crs/banking/bankReconciliation/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.banking.bankReconciliation.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.banking.bankReconciliation.index](../../../readable/controllers/C0603--tenant.views.crs.banking.bankReconciliation.index.js) | 13 | 7 |
| [tenant.views.crs.banking.BankReconciliation.printPreview](../../../readable/controllers/C0604--tenant.views.crs.banking.BankReconciliation.printPreview.js) | 2 | 0 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.banking.bankReconciliation.index`: `rounding`، `filterChanged`، `getlocalDateTime`، `bankDataAll`، `getBankAccounts`، `locationPermission`، `getBankReconciliation`، `calculateBalance`، `bankReconciliationReportModal`، `reconcileUnReconcileVoucher`، `save`، `clear`، `exportToExcel`.
- وحدة `tenant.views.crs.banking.BankReconciliation.printPreview`: `cancel`، `getTemplateUrl`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.commonLookup.getBankAccountsForSelection` | POST | api/services/app/commonLookup/GetBankAccountsForSelection | [المصدر](../../../raw/application.js#L163464) |
| `abp.services.app.commonLookup.getLocations` | POST | api/services/app/commonLookup/GetLocations | [المصدر](../../../raw/application.js#L163480) |
| `abp.services.app.billingMethod.getBillingMethods` | POST | api/services/app/billingMethod/GetBillingMethods | [المصدر](../../../raw/application.js#L163493) |
| `abp.services.app.bankReconciliation.getBankEntryOfReconciliation` | POST | api/services/app/bankReconciliation/GetBankEntryOfReconciliation | [المصدر](../../../raw/application.js#L163505) |
| `abp.services.app.bankReconciliation.reconcileVoucher` | POST | api/services/app/bankReconciliation/ReconcileVoucher | [المصدر](../../../raw/application.js#L163575) |
| `abp.services.app.bankReconciliation.unReconcileVoucher` | POST | api/services/app/bankReconciliation/UnReconcileVoucher | [المصدر](../../../raw/application.js#L163583) |
| `abp.services.app.bankReconciliation.createOrUpdateReconciliation` | POST | api/services/app/bankReconciliation/CreateOrUpdateReconciliation | [المصدر](../../../raw/application.js#L163609) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.Vouchers.Receipts.ViewOtherBranchReceipts`: ممنوحة في السياق الملتقط.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.filters.linkedAccount` | ui-select |  | ng-disabled=vm.enable |
| `vm.filters.bankStatementBalance` | text |  | ng-disabled=vm.enable |
| `vm.filters.bankStatmentDate` | input | date | ng-disabled=vm.enable |
| `vm.lastReconciliationDate` | input | date |  |
| `vm.lastReconciledBalance` | text |  |  |
| `vm.reconciledBalance` | text |  |  |
| `vm.diff` | text |  |  |
| `vm.filters.billingMethodId` | select |  | ng-options=billingMethod.id as billingMethod.name for billingMethod in vm.billingMethods |
| `vm.allReconciled` | checkbox | allReconciled |  |
| `row.reconciled` | checkbox | reconciled |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
