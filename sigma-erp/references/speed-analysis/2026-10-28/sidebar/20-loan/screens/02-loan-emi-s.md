# شاشة: Loan EMI's

المسار في القائمة: Loan ← Loan EMI's.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_Loan`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0452](../../../readable/routes/R0452--tenant-crs-loan.js)، والأصل [raw/application.js:4873](../../../raw/application.js#L4873).
- قالب الشاشة: `~/App/tenant/views/crs/loan/loanEmi/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.loan.loanEmi.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.loan.loanEmi.index](../../../readable/controllers/C0945--tenant.views.crs.loan.loanEmi.index.js) | 13 | 2 |
| [tenant.views.crs.vouchers.bills.payInstallmentModal](../../../readable/controllers/C1240--tenant.views.crs.vouchers.bills.payInstallmentModal.js) | 6 | 2 |
| [tenant.views.crs.vouchers.bills.payAllInstallmentsModal](../../../readable/controllers/C1238--tenant.views.crs.vouchers.bills.payAllInstallmentsModal.js) | 9 | 1 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.loan.loanEmi.index`: `rounding`، `payAllChanged`، `CurrencyFormate`، `getStatus`، `dateRangeCheck`، `openPayInstallmentModel`، `saveSelected`، `saveAllSelectedLoans`، `localize`، `getlocalDateTime`، `getlocalDate`، `getLoadData`، `exportToExcel`.
- وحدة `tenant.views.crs.vouchers.bills.payInstallmentModal`: `getlocalDateTime`، `localize`، `CurrencyFormate`، `round`، `cancel`، `save`.
- وحدة `tenant.views.crs.vouchers.bills.payAllInstallmentsModal`: `CurrencyFormate`، `round`، `getPrincipal`، `updateTotals`، `cancel`، `saveAll`، `importData`، `downloadSample`، `processAll`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.paymentPlan.payInstallmentAmount` | POST | api/services/app/paymentPlan/PayInstallmentAmount | [المصدر](../../../raw/application.js#L327213) |
| `abp.services.app.paymentPlan.getLoanData` | POST | api/services/app/paymentPlan/GetLoanData | [المصدر](../../../raw/application.js#L255889) |
| `abp.services.app.bankAccount.getBankAccountsForSelection` | POST | api/services/app/bankAccount/GetBankAccountsForSelection | [المصدر](../../../raw/application.js#L327371) |

## الصلاحيات والحقول

لم يستخرج فحص صلاحية حرفي داخل الوحدات المرتبطة؛ افحص أيضًا شروط المسار والخادم.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.dateRangeModel` | text |  | min=vm.dateRangeOptions.min; max=vm.dateRangeOptions.max; ng-disabled=!vm.filters.enableDateRange |
| `vm.filters.enableDateRange` | checkbox | disableDateRange |  |
| `vm.filters.status` | select |  | ng-options=status.id as status.name for status in vm.statuses |
| `vm.filters.refNo` | text |  |  |
| `vm.filters.selectToPay` | checkbox |  |  |
| `vm.filters.payAll` | checkbox |  |  |
| `loan.isSelected` | checkbox | selected |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
