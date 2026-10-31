# شاشة: Cash Deposits

المسار في القائمة: Banking ← Cash Deposits .

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_cashBankDeposit`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0334](../../../readable/routes/R0334--tenant-crs-cashbankdeposit.js)، والأصل [raw/application.js:3928](../../../raw/application.js#L3928).
- قالب الشاشة: `~/App/tenant/views/crs/banking/cashBankDeposit/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.banking.cashBankDeposit.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.banking.cashBankDeposit.index](../../../readable/controllers/C0607--tenant.views.crs.banking.cashBankDeposit.index.js) | 12 | 6 |
| [tenant.views.crs.banking.cashBankDeposit.printtemplates.printPreview](../../../readable/controllers/C0612--tenant.views.crs.banking.cashBankDeposit.printtemplates.printPreview.js) | 2 | 0 |
| [tenant.views.crs.banking.cashBankDeposit.viewModal](../../../readable/controllers/C0610--tenant.views.crs.banking.cashBankDeposit.viewModal.js) | 5 | 2 |
| [common.views.common.reportViewer](../../../readable/controllers/C0006--common.views.common.reportViewer.js) | 2 | 0 |
| [tenant.views.crs.banking.cashBankDeposit.createOrEditModal](../../../readable/controllers/C0606--tenant.views.crs.banking.cashBankDeposit.createOrEditModal.js) | 12 | 9 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.banking.cashBankDeposit.index`: `rounding`، `dateRangeModelChanged`، `exportToExcel`، `getCashDeposits`، `getlocalDateTime`، `cashBankDepositPrintModal`، `clearAccount`، `createPopup`، `edit`، `view`، `report`، `delete`.
- وحدة `tenant.views.crs.banking.cashBankDeposit.printtemplates.printPreview`: `cancel`، `getTemplateUrl`.
- وحدة `tenant.views.crs.banking.cashBankDeposit.viewModal`: `rounding`، `getVoucherType`، `cancel`، `formatNumber`، `getlocalDateTime`.
- وحدة `common.views.common.reportViewer`: `exportToExcelFromReport`، `cancel`.
- وحدة `tenant.views.crs.banking.cashBankDeposit.createOrEditModal`: `rounding`، `getVoucherType`، `applyChangeToAll`، `autoAllocation`، `changeRoundOffAmount`، `save`، `cancel`، `applyChange`، `calculateBalance`، `formatNumber`، `getlocalDateTime`، `filterVouchersData`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.commonLookup.getLocationsActiveAndInActive` | POST | api/services/app/commonLookup/GetLocationsActiveAndInActive | [المصدر](../../../raw/application.js#L164299) |
| `abp.services.app.user.getSelectedBranchIdsByUserId` | POST | [object Object] | [المصدر](../../../raw/application.js#L164318) |
| `abp.services.app.commonLookup.getBankAccountsForSelection` | POST | api/services/app/commonLookup/GetBankAccountsForSelection | [المصدر](../../../raw/application.js#L164176) |
| `abp.services.app.cashBankDeposit.exportToExcel` | POST | api/services/app/cashBankDeposit/ExportToExcel | [المصدر](../../../raw/application.js#L164356) |
| `abp.services.app.cashBankDeposit.getCashDeposits` | POST | api/services/app/cashBankDeposit/GetCashDeposits | [المصدر](../../../raw/application.js#L164369) |
| `abp.services.app.cashBankDeposit.deleteCashDeposit` | POST | api/services/app/cashBankDeposit/DeleteCashDeposit | [المصدر](../../../raw/application.js#L164574) |
| `abp.services.app.cashBankDeposit.getCashDepositForView` | POST | api/services/app/cashBankDeposit/GetCashDepositForView | [المصدر](../../../raw/application.js#L164779) |
| `abp.services.app.commonLookup.getLocations` | POST | api/services/app/commonLookup/GetLocations | [المصدر](../../../raw/application.js#L163984) |
| `abp.services.app.billingMethod.getBillingMethods` | POST | api/services/app/billingMethod/GetBillingMethods | [المصدر](../../../raw/application.js#L164044) |
| `abp.services.app.cashBankDeposit.createOrUpdateCashDeposit` | POST | api/services/app/cashBankDeposit/CreateOrUpdateCashDeposit | [المصدر](../../../raw/application.js#L164076) |
| `abp.services.app.cashBankDeposit.getCashDepositForEdit` | POST | api/services/app/cashBankDeposit/GetCashDepositForEdit | [المصدر](../../../raw/application.js#L164243) |
| `abp.services.app.cashBankDeposit.getCashDepositForEditView` | POST | api/services/app/cashBankDeposit/GetCashDepositForEditView | [المصدر](../../../raw/application.js#L164223) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.Banking.CashDeposits`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Banking.CashDeposits.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Banking.CashDeposits.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Bookings.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Banking.CashDeposits.Delete`: ممنوحة في السياق الملتقط.

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
