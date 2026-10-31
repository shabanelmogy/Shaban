# شاشة: Bank Accounts

المسار في القائمة: Banking ← Bank Accounts.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_bankAccounts`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0455](../../../readable/routes/R0455--tenant-crs-bankaccounts.js)، والأصل [raw/application.js:4899](../../../raw/application.js#L4899).
- قالب الشاشة: `~/App/tenant/views/crs/banking/bankAccounts/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.banking.bankAccounts.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.banking.bankAccounts.index](../../../readable/controllers/C0602--tenant.views.crs.banking.bankAccounts.index.js) | 7 | 2 |
| [tenant.views.crs.banking.bankAccounts.createOrEditModal](../../../readable/controllers/C0601--tenant.views.crs.banking.bankAccounts.createOrEditModal.js) | 2 | 3 |
| [tenant.views.crs.banking.bankAccounts.chequaPrintingSettingModal](../../../readable/controllers/C0600--tenant.views.crs.banking.bankAccounts.chequaPrintingSettingModal.js) | 3 | 1 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.banking.bankAccounts.index`: `getBankAccount`، `exportToExcel`، `openChequaPrintingSettingModal`، `createBankAccount`، `editBankAccount`، `viewBankAccount`، `deleteBankAccount`.
- وحدة `tenant.views.crs.banking.bankAccounts.createOrEditModal`: `save`، `cancel`.
- وحدة `tenant.views.crs.banking.bankAccounts.chequaPrintingSettingModal`: `getlocalDateTime`، `save`، `cancel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.bankAccount.getBankAccounts` | POST | api/services/app/bankAccount/GetBankAccounts | [المصدر](../../../raw/application.js#L163291) |
| `abp.services.app.bankAccount.deleteBankAccount` | POST | api/services/app/bankAccount/DeleteBankAccount | [المصدر](../../../raw/application.js#L163376) |
| `abp.services.app.currency.getCurrencies` | POST | api/services/app/currency/GetCurrencies | [المصدر](../../../raw/application.js#L163139) |
| `abp.services.app.bankAccount.createOrUpdateBankAccount` | POST | api/services/app/bankAccount/CreateOrUpdateBankAccount | [المصدر](../../../raw/application.js#L163158) |
| `abp.services.app.bankAccount.getBankAccountForEdit` | POST | api/services/app/bankAccount/GetBankAccountForEdit | [المصدر](../../../raw/application.js#L163178) |
| `abp.services.app.bankAccount.saveChequePrintingSetting` | POST | api/services/app/bankAccount/SaveChequePrintingSetting | [المصدر](../../../raw/application.js#L163098) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.Banking.BankAccounts`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Banking.BankAccounts.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Banking.BankAccounts.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Banking.BankAccounts.Delete`: ممنوحة في السياق الملتقط.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.filters.filter` | text |  |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
