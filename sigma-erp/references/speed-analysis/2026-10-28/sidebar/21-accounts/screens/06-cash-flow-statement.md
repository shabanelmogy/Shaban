# شاشة: Cash Flow Statement

المسار في القائمة: Accounts ← Cash Flow Statement.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_cashFlowStatement`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0497](../../../readable/routes/R0497--tenant-crs-cashflowstatement.js)، والأصل [raw/application.js:5221](../../../raw/application.js#L5221).
- قالب الشاشة: `~/App/tenant/views/crs/accounting/cashFlowStatement/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.accounting.cashFlowStatement.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.accounting.cashFlowStatement.index](../../../readable/controllers/C0479--tenant.views.crs.accounting.cashFlowStatement.index.js) | 11 | 3 |
| [tenant.views.crs.accounting.cashFlowStatement.cashFlowSettingsModal](../../../readable/controllers/C0478--tenant.views.crs.accounting.cashFlowStatement.cashFlowSettingsModal.js) | 3 | 3 |
| [tenant.views.crs.accounting.cashFlowStatement.selectAccountModal](../../../readable/controllers/C0480--tenant.views.crs.accounting.cashFlowStatement.selectAccountModal.js) | 4 | 1 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.accounting.cashFlowStatement.index`: `currencyAndRoundingWithThree`، `roundingforView`، `getlocalDateTime`، `getFiscalYears`، `getMonthYear`، `getMonths`، `rounding`، `formatNumber`، `openSettingModal`، `exportToExcel`، `getcashFlowStatements`.
- وحدة `tenant.views.crs.accounting.cashFlowStatement.cashFlowSettingsModal`: `selectAccount`، `save`، `cancel`.
- وحدة `tenant.views.crs.accounting.cashFlowStatement.selectAccountModal`: `accountCheckedOrUnchecked`، `getAccounts`، `save`، `cancel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.fiscalYear.getFiscalYearsDesc` | POST | api/services/app/fiscalYear/GetFiscalYearsDesc | [المصدر](../../../raw/application.js#L122380) |
| `abp.services.app.fiscalMonth.getFiscalMonths` | POST | api/services/app/fiscalMonth/GetFiscalMonths | [المصدر](../../../raw/application.js#L122400) |
| `abp.services.app.cashFlowStatement.getCashFlowStatement` | POST | api/services/app/cashFlowStatement/GetCashFlowStatement | [المصدر](../../../raw/application.js#L122522) |
| `abp.services.app.cashFlowStatement.getTemplate` | POST | api/services/app/cashFlowStatement/GetTemplate | [المصدر](../../../raw/application.js#L122298) |
| `abp.services.app.account.getAccounts` | POST | api/services/app/account/GetAccounts | [المصدر](../../../raw/application.js#L122307) |
| `abp.services.app.cashFlowStatement.saveCashFlowTemplate` | POST | api/services/app/cashFlowStatement/SaveCashFlowTemplate | [المصدر](../../../raw/application.js#L122315) |
| `abp.services.app.account.getAccountsOnCategory` | POST | api/services/app/account/GetAccountsOnCategory | [المصدر](../../../raw/application.js#L122558) |

## الصلاحيات والحقول

- صلاحية `Pages.Administration.Tenant.Settings`: ممنوحة في السياق الملتقط.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.filters.fiscalYear` | select | fiscalYearId | ng-options=fiscalYear as vm.getlocalDateTime(fiscalYear.startDate) + ' to ' + vm.getlocalDateTime(fiscalYear.endDate) for fiscalYear in vm.fiscalYears |
| `vm.filters.isFascalMonthActive` | checkbox | Company_Inactive |  |
| `vm.filters.fiscalMonth` | select | fiscalMonthId | ng-options=fiscalMonth as vm.getlocalDateTime(fiscalMonth.startDate) + ' to ' + vm.getlocalDateTime(fiscalMonth.endDate) for fiscalMonth in vm.fiscalMonths |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
