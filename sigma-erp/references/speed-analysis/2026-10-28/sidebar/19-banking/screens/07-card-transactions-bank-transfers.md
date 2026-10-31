# شاشة: Card Transactions Bank Transfers

المسار في القائمة: Banking ← Card Transactions Bank Transfers.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_creditCardTransTransfers`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0335](../../../readable/routes/R0335--tenant-crs-creditcardtranstransfers.js)، والأصل [raw/application.js:3937](../../../raw/application.js#L3937).
- قالب الشاشة: `~/App/tenant/views/crs/banking/creditCardTransBankTransfer/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.banking.creditCardTransBankTransfer.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.banking.creditCardTransBankTransfer.index](../../../readable/controllers/C0642--tenant.views.crs.banking.creditCardTransBankTransfer.index.js) | 13 | 6 |
| [tenant.views.crs.banking.creditCardTransBankTransfer.printtemplates.printPreview](../../../readable/controllers/C0647--tenant.views.crs.banking.creditCardTransBankTransfer.printtemplates.printPreview.js) | 2 | 0 |
| [tenant.views.crs.banking.creditCardTransBankTransfer.viewModal](../../../readable/controllers/C0645--tenant.views.crs.banking.creditCardTransBankTransfer.viewModal.js) | 5 | 2 |
| [common.views.common.reportViewer](../../../readable/controllers/C0006--common.views.common.reportViewer.js) | 2 | 0 |
| [tenant.views.crs.banking.creditCardTransBankTransfer.createOrEditModal](../../../readable/controllers/C0641--tenant.views.crs.banking.creditCardTransBankTransfer.createOrEditModal.js) | 15 | 6 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.banking.creditCardTransBankTransfer.index`: `dateRangeModelChanged`، `getCreditCardTransBankTransfers`، `getlocalDateTime`، `CreditCardTransTransferPrintModal`، `clearAccount`، `rounding`، `exportToExcel`، `createPopup`، `editTransaction`، `createPopup`، `view`، `report`، `delete`.
- وحدة `tenant.views.crs.banking.creditCardTransBankTransfer.printtemplates.printPreview`: `cancel`، `getTemplateUrl`.
- وحدة `tenant.views.crs.banking.creditCardTransBankTransfer.viewModal`: `rounding`، `getVoucherType`، `cancel`، `calculateBalance`، `getlocalDateTime`.
- وحدة `common.views.common.reportViewer`: `exportToExcelFromReport`، `cancel`.
- وحدة `tenant.views.crs.banking.creditCardTransBankTransfer.createOrEditModal`: `dateRangeModelChanged`، `getVoucherType`، `rounding`، `applyChangeToAll`، `save`، `filterVouchersData`، `cancel`، `applyChange`، `calculateBalance`، `getlocalDateTime`، `calculateTaxPerRow`، `commissionChange`، `taxChange`، `surchargeChanged`، `commChange`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.commonLookup.getLocationsActiveAndInActive` | POST | api/services/app/commonLookup/GetLocationsActiveAndInActive | [المصدر](../../../raw/application.js#L169204) |
| `abp.services.app.commonLookup.getBankAccountsForSelection` | POST | api/services/app/commonLookup/GetBankAccountsForSelection | [المصدر](../../../raw/application.js#L168965) |
| `abp.services.app.user.getSelectedBranchIdsByUserId` | POST | [object Object] | [المصدر](../../../raw/application.js#L169227) |
| `abp.services.app.creditCardTransBankTransfer.getCreditCardTransBankTransfers` | POST | api/services/app/creditCardTransBankTransfer/GetCreditCardTransBankTransfers | [المصدر](../../../raw/application.js#L169241) |
| `abp.services.app.creditCardTransBankTransfer.exportToExcel` | POST | api/services/app/creditCardTransBankTransfer/ExportToExcel | [المصدر](../../../raw/application.js#L169371) |
| `abp.services.app.creditCardTransBankTransfer.deleteCreditCardTransBankTransfer` | POST | api/services/app/creditCardTransBankTransfer/DeleteCreditCardTransBankTransfer | [المصدر](../../../raw/application.js#L169457) |
| `abp.services.app.creditCardTransBankTransfer.getCreditCardTransBankTransferForView` | POST | api/services/app/creditCardTransBankTransfer/GetCreditCardTransBankTransferForView | [المصدر](../../../raw/application.js#L169696) |
| `abp.services.app.commonLookup.getLocations` | POST | api/services/app/commonLookup/GetLocations | [المصدر](../../../raw/application.js#L168839) |
| `abp.services.app.billingMethod.getBillingMethods` | POST | api/services/app/billingMethod/GetBillingMethods | [المصدر](../../../raw/application.js#L168851) |
| `abp.services.app.creditCardTransBankTransfer.createOrUpdateCreditCardTransBankTransfer` | POST | api/services/app/creditCardTransBankTransfer/CreateOrUpdateCreditCardTransBankTransfer | [المصدر](../../../raw/application.js#L168881) |
| `abp.services.app.creditCardTransBankTransfer.getCreditCardTransBankTransferForEdit` | POST | api/services/app/creditCardTransBankTransfer/GetCreditCardTransBankTransferForEdit | [المصدر](../../../raw/application.js#L168931) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.Banking.CreditCardTransTransfers`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Banking.CreditCardTransBankTransfer.CashDeposits.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Banking.CreditCardTransBankTransfer.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Banking.CreditCardTransBankTransfer.CashDeposits.Delete`: ممنوحة في السياق الملتقط.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.filters.voucherNo` | text |  |  |
| `vm.dateRangeModel` | text |  | min=vm.dateRangeOptions.min; max=vm.dateRangeOptions.max |
| `vm.filters.account` | ui-select |  |  |
| `vm.filters.locationId` | select | locationId |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
