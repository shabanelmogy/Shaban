# شاشة: Chart Of Accounts

المسار في القائمة: Accounts ← Chart Of Accounts.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_coa`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0466](../../../readable/routes/R0466--tenant-crs-coa.js)، والأصل [raw/application.js:4967](../../../raw/application.js#L4967).
- قالب الشاشة: `~/App/tenant/views/crs/accounting/coa/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.accounting.coa.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.accounting.coa.index](../../../readable/controllers/C0482--tenant.views.crs.accounting.coa.index.js) | 9 | 4 |
| [tenant.views.crs.accounting.coa.createOrEditModal](../../../readable/controllers/C0481--tenant.views.crs.accounting.coa.createOrEditModal.js) | 2 | 2 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.accounting.coa.index`: `toggleActiveStatus`، `rounding`، `exportToExcel`، `hasInactiveParent`، `getAccounts`، `createAccount`، `editAccount`، `deleteAccount`، `initializeChartOfAccounts`.
- وحدة `tenant.views.crs.accounting.coa.createOrEditModal`: `save`، `cancel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.account.toggleAccountActiveStatus` | POST | api/services/app/account/ToggleAccountActiveStatus | [المصدر](../../../raw/application.js#L122670) |
| `abp.services.app.account.getAccounts` | POST | api/services/app/account/GetAccounts | [المصدر](../../../raw/application.js#L122811) |
| `abp.services.app.account.deleteAccount` | POST | api/services/app/account/DeleteAccount | [المصدر](../../../raw/application.js#L122856) |
| `abp.services.app.account.initializeChartOfAccounts` | POST | api/services/app/account/InitializeChartOfAccounts | [المصدر](../../../raw/application.js#L122929) |
| `abp.services.app.account.createOrUpdateAccount` | POST | api/services/app/account/CreateOrUpdateAccount | [المصدر](../../../raw/application.js#L122593) |
| `abp.services.app.account.getAccountForEdit` | POST | api/services/app/account/GetAccountForEdit | [المصدر](../../../raw/application.js#L122609) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.Accounts.ChartofAccounts.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Accounts.ChartofAccounts.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Accounts.ChartofAccounts.Delete`: ممنوحة في السياق الملتقط.

لم تتوفر روابط حقول مثبتة من القالب. خصائص الواجهة المستخرجة آليًا موجودة في فهرس وحدات التحكم، ولا تمثل جميع حقول النموذج.

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
