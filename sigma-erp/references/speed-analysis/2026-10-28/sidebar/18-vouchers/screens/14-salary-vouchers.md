# شاشة: Salary Vouchers

المسار في القائمة: Vouchers ← Salary Vouchers.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_salaryVouchers`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0311](../../../readable/routes/R0311--tenant-crs-salaryvouchers.js)، والأصل [raw/application.js:3764](../../../raw/application.js#L3764).
- قالب الشاشة: `~/App/tenant/views/crs/vouchers/salaryVouchers/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.vouchers.salaryVouchers.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.vouchers.salaryVouchers.index](../../../readable/controllers/C1436--tenant.views.crs.vouchers.salaryVouchers.index.js) | 14 | 4 |
| [tenant.views.crs.vouchers.salaryVouchers.viewModal](../../../readable/controllers/C1438--tenant.views.crs.vouchers.salaryVouchers.viewModal.js) | 6 | 1 |
| [common.views.common.reportViewer](../../../readable/controllers/C0006--common.views.common.reportViewer.js) | 2 | 0 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.vouchers.salaryVouchers.index`: `CurrencyFormate`، `roundingforView`، `salaryVoucherTypes`، `dateRangeCheck`، `dateRangeModelChanged`، `isPrintEnabled`، `getAllBusinessUnits`، `getlocalDateTime`، `getSalaryVouchers`، `exportToExcel`، `report`، `viewSalaryVoucher`، `deletePurchaseOrder`، `enterKeyPress`.
- وحدة `tenant.views.crs.vouchers.salaryVouchers.viewModal`: `CurrencyFormate`، `roundingforView`، `salaryVoucherTypes`، `getlocalDateTime`، `cancel`، `getSalaryVoucherForView`.
- وحدة `common.views.common.reportViewer`: `exportToExcelFromReport`، `cancel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.businessUnit.getBusinessUnits` | POST | api/services/app/businessUnit/GetBusinessUnits | [المصدر](../../../raw/application.js#L394816) |
| `abp.services.app.salaryVoucher.getSalaryVouchers` | POST | api/services/app/salaryVoucher/GetSalaryVouchers | [المصدر](../../../raw/application.js#L394858) |
| `abp.services.app.salaryVoucher.exportToExcel` | POST | api/services/app/salaryVoucher/ExportToExcel | [المصدر](../../../raw/application.js#L394872) |
| `abp.services.app.purchaseOrder.deletePurchaseOrder` | POST | api/services/app/purchaseOrder/DeletePurchaseOrder | [المصدر](../../../raw/application.js#L395004) |
| `abp.services.app.salaryVoucher.getSalaryVoucherForEdit` | POST | api/services/app/salaryVoucher/GetSalaryVoucherForEdit | [المصدر](../../../raw/application.js#L395155) |

## الصلاحيات والحقول

- صلاحية `Pages.HRM.SalaryVoucher.View`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.HRM.SalaryVoucher.Delete`: ممنوحة في السياق الملتقط.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.dateRangeModel` | text |  | min=vm.dateRangeOptions.min; max=vm.dateRangeOptions.max; ng-disabled=!vm.filters.enableDateRange |
| `vm.filters.enableDateRange` | checkbox | disableDateRange |  |
| `vm.filters.voucherNo` | text |  |  |
| `vm.filters.salaryVoucherType` | text | salaryVoucherType | ng-options=salaryVoucherType.id as salaryVoucherType.name for salaryVoucherType in vm.salaryVoucherType |
| `vm.filters.businessUnitId` | select | exteriorColor | ng-options=unit.id as unit.name for unit in vm.businessUnits |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
