# شاشة: Budget

المسار في القائمة: Accounts ← Budget.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_budget`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0503](../../../readable/routes/R0503--tenant-crs-budget.js)، والأصل [raw/application.js:5267](../../../raw/application.js#L5267).
- قالب الشاشة: `~/App/tenant/views/crs/accounting/budget/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.accounting.budget.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.accounting.budget.index](../../../readable/controllers/C0476--tenant.views.crs.accounting.budget.index.js) | 11 | 3 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.accounting.budget.index`: `getlocalDateTime`، `getFiscalYears`، `CurrencyFormate`، `getMonth`، `createOrUpdateBudget`، `getBudget`، `rounding`، `getTotalByRow`، `getTotalByMonth`، `getTotal`، `exportToExcel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.fiscalYear.getFiscalYears` | POST | api/services/app/fiscalYear/GetFiscalYears | [المصدر](../../../raw/application.js#L121998) |
| `abp.services.app.budget.craeteOrUpdateBuget` | POST | api/services/app/budget/CraeteOrUpdateBuget | [المصدر](../../../raw/application.js#L122022) |
| `abp.services.app.budget.getBudget` | POST | api/services/app/budget/GetBudget | [المصدر](../../../raw/application.js#L122037) |

## الصلاحيات والحقول

لم يستخرج فحص صلاحية حرفي داخل الوحدات المرتبطة؛ افحص أيضًا شروط المسار والخادم.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.fiscalYear` | select | fiscalYearId | ng-options=fiscalYear as vm.getlocalDateTime(fiscalYear.startDate) + ' to ' + vm.getlocalDateTime(fiscalYear.endDate) for fiscalYear in vm.fiscalYears |
| `vm.filters.accountCategory` | select |  | ng-options=name for (name,value) in vm.AccountCategory |
| `elem.amount` | number |  |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
