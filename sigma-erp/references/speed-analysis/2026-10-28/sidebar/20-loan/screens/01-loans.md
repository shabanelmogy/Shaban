# شاشة: Loans

المسار في القائمة: Loan ← Loans.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_LoanSummary`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0453](../../../readable/routes/R0453--tenant-crs-loansummary.js)، والأصل [raw/application.js:4881](../../../raw/application.js#L4881).
- قالب الشاشة: `~/App/tenant/views/crs/loan/loanSummary/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.loan.loanSummary.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.loan.loanSummary.index](../../../readable/controllers/C0947--tenant.views.crs.loan.loanSummary.index.js) | 10 | 2 |
| [tenant.views.crs.loan.loanSummaryh.dealViewModal](../../../readable/controllers/C0946--tenant.views.crs.loan.loanSummaryh.dealViewModal.js) | 6 | 2 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.loan.loanSummary.index`: `dateRangeCheck`، `localize`، `CurrencyFormate`، `getlocalDateTime`، `getLoadData`، `rounding`، `searchFinancingBankAccount`، `clearFinancingBankAccount`، `openDealViewModal`، `exportToExcel`.
- وحدة `tenant.views.crs.loan.loanSummaryh.dealViewModal`: `getlocalDateTime`، `localize`، `currencyFormat`، `rounding`، `cancel`، `calculateSummary`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.paymentPlan.getLoanSummary` | POST | api/services/app/paymentPlan/GetLoanSummary | [المصدر](../../../raw/application.js#L256149) |
| `abp.services.app.directory.search` | POST | api/services/app/directory/Search | [المصدر](../../../raw/application.js#L256170) |
| `abp.services.app.bankAccount.getBankAccountsForSelection` | POST | api/services/app/bankAccount/GetBankAccountsForSelection | [المصدر](../../../raw/application.js#L255999) |
| `abp.services.app.paymentPlan.getPaymentPlanToMakeInstallemntPayment` | POST | api/services/app/paymentPlan/GetPaymentPlanToMakeInstallemntPayment | [المصدر](../../../raw/application.js#L256054) |

## الصلاحيات والحقول

لم يستخرج فحص صلاحية حرفي داخل الوحدات المرتبطة؛ افحص أيضًا شروط المسار والخادم.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.dateRangeModel` | text |  | min=vm.dateRangeOptions.min; max=vm.dateRangeOptions.max; ng-disabled=!vm.filters.enableDateRange |
| `vm.filters.enableDateRange` | checkbox | disableDateRange |  |
| `vm.filters.refNo` | text |  |  |
| `vm.filters.financingBankAccount` | ui-select |  |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
