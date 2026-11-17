# شاشة: Custom Amortization Vouchers

المسار في القائمة: Vouchers ← Custom Amortization Vouchers.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_loanAmortization`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0318](../../../readable/routes/R0318--tenant-crs-loanamortization.js)، والأصل [raw/application.js:3813](../../../raw/application.js#L3813).
- قالب الشاشة: `~/App/tenant/views/crs/vouchers/loanAmortization/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.vouchers.loanAmortization.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.vouchers.loanAmortization.index](../../../readable/controllers/C1372--tenant.views.crs.vouchers.loanAmortization.index.js) | 22 | 8 |
| [tenant.views.crs.vouchers.loanAmortization.createOrEditModal](../../../readable/controllers/C1371--tenant.views.crs.vouchers.loanAmortization.createOrEditModal.js) | 31 | 16 |
| [common.views.common.reportViewer](../../../readable/controllers/C0006--common.views.common.reportViewer.js) | 2 | 0 |
| [tenant.views.crs.vouchers.loanAmortization.uploadDocumentsModal](../../../readable/controllers/C1373--tenant.views.crs.vouchers.loanAmortization.uploadDocumentsModal.js) | 3 | 0 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.vouchers.loanAmortization.index`: `dateRangeModelChanged`، `locationPermission`، `CurrencyFormate`، `roundingforView`، `locationPermission`، `allBranchPermission`، `approveAllMethod`، `dateRangeCheck`، `getLoanAmortization`، `getlocalDateTime`، `exportToExcel`، `exportToExcelDetailed`، `openprintModal`، `report`، `createLoanAmortization`، `salikVoucherDetails`، `editLoanAmortization`، `viewLoanAmortization`، `deleteLoanAmortization`، `enterKeyPress`، `approveJVs`، `unapproveJV`.
- وحدة `tenant.views.crs.vouchers.loanAmortization.createOrEditModal`: `rounding`، `roundingforView`، `searchAccounts`، `searchContact`، `uploadDocument`، `getOriginalName`، `accountChanged`، `searchPrepaidExpense`، `isStockAccount`، `productSelected`، `searchVehicles`، `searchItems`، `searchJobs`، `searchMasterAgreement`، `considerTaxAsTaxPercentage`، `sumAmount`، `sumAmountExcel`، `sumAmountBeforeSaving`، `refresh`، `importData`، `getlocalDate`، `addRow`، `removeRow`، `cancel`، `calculateTotal`، `uploader.onSuccessItem`، `uploader.onErrorItem`، `isVehicleCategory`، `isdateNull`، `save`، `removeDocument`.
- وحدة `common.views.common.reportViewer`: `exportToExcelFromReport`، `cancel`.
- وحدة `tenant.views.crs.vouchers.loanAmortization.uploadDocumentsModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.loanAmortization.approvejVs` | غير مربوط | غير محسوم | [المصدر](../../../raw/application.js#L369792) |
| `abp.services.app.loanAmortization.getLoanAmortization` | POST | api/services/app/loanAmortization/GetLoanAmortization | [المصدر](../../../raw/application.js#L369831) |
| `abp.services.app.commonLookup.getLocationsActiveAndInActive` | POST | api/services/app/commonLookup/GetLocationsActiveAndInActive | [المصدر](../../../raw/application.js#L369090) |
| `abp.services.app.loanAmortization.exportToExcel` | غير مربوط | غير محسوم | [المصدر](../../../raw/application.js#L369862) |
| `abp.services.app.loanAmortization.exportToExcelDetailed` | غير مربوط | غير محسوم | [المصدر](../../../raw/application.js#L369875) |
| `abp.services.app.loanAmortization.deleteLoanAmortization` | POST | api/services/app/loanAmortization/DeleteLoanAmortization | [المصدر](../../../raw/application.js#L370049) |
| `abp.services.app.loanAmortization.approveJV` | غير مربوط | غير محسوم | [المصدر](../../../raw/application.js#L370072) |
| `abp.services.app.loanAmortization.unApproveJV` | غير مربوط | غير محسوم | [المصدر](../../../raw/application.js#L370088) |
| `abp.services.app.tenantSettings.getExpenseAccountsAdvanceSetting` | POST | api/services/app/tenantSettings/GetExpenseAccountsAdvanceSetting | [المصدر](../../../raw/application.js#L368855) |
| `abp.services.app.account.searchAccountsForSubLookUp` | POST | api/services/app/account/SearchAccountsForSubLookUp | [المصدر](../../../raw/application.js#L368881) |
| `abp.services.app.directory.searchByContactGroup` | POST | api/services/app/directory/SearchByContactGroup | [المصدر](../../../raw/application.js#L368889) |
| `abp.services.app.loanAmortization.getexpenseaccounts` | POST | api/services/app/loanAmortization/Getexpenseaccounts | [المصدر](../../../raw/application.js#L369024) |
| `abp.services.app.loanAmortization.isStockAccount` | POST | api/services/app/loanAmortization/IsStockAccount | [المصدر](../../../raw/application.js#L369031) |
| `abp.services.app.vehicle.searchVehicles` | POST | api/services/app/vehicle/SearchVehicles | [المصدر](../../../raw/application.js#L369046) |
| `abp.services.app.item.searchItems` | POST | api/services/app/item/SearchItems | [المصدر](../../../raw/application.js#L369053) |
| `abp.services.app.job.searchJobs` | POST | api/services/app/job/SearchJobs | [المصدر](../../../raw/application.js#L369060) |
| `abp.services.app.leaseMasterAgreement.searchMasterAgreementsForVouchers` | POST | api/services/app/leaseMasterAgreement/SearchMasterAgreementsForVouchers | [المصدر](../../../raw/application.js#L369067) |
| `abp.services.app.commonLookup.getLocations` | POST | api/services/app/commonLookup/GetLocations | [المصدر](../../../raw/application.js#L369084) |
| `abp.services.app.costCenter.searchCostCenters` | POST | api/services/app/costCenter/SearchCostCenters | [المصدر](../../../raw/application.js#L369096) |
| `abp.services.app.division.searchDivisions` | POST | api/services/app/division/SearchDivisions | [المصدر](../../../raw/application.js#L369105) |
| `abp.services.app.loanAmortization.importFromExcel` | POST | [object Object] | [المصدر](../../../raw/application.js#L369507) |
| `abp.services.app.loanAmortization.createOrUpdateLoanAmortization` | POST | api/services/app/loanAmortization/CreateOrUpdateLoanAmortization | [المصدر](../../../raw/application.js#L369644) |
| `abp.services.app.loanAmortization.getLoanAmortizationForEdit` | POST | api/services/app/loanAmortization/GetLoanAmortizationForEdit | [المصدر](../../../raw/application.js#L369680) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.Vouchers.LoanAmortization.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.LoanAmortization.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.LoanAmortization.View`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.LoanAmortization.Delete`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.JVs.AllActionsOnOtherBranchJVs`: ممنوحة في السياق الملتقط.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.filters.voucherNo` | text |  |  |
| `vm.filters.locationId` | select | locationId |  |
| `vm.dateRangeModel` | text |  | min=vm.dateRangeOptions.min; max=vm.dateRangeOptions.max; ng-disabled=!vm.filters.enableDateRange |
| `vm.filters.enableDateRange` | checkbox | disableDateRange |  |
| `vm.filters.amount` | text |  |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
