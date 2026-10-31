# شاشة: Opening Balances

المسار في القائمة: Accounts ← Opening Balances.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_openingBalances`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0505](../../../readable/routes/R0505--tenant-crs-openingbalances.js)، والأصل [raw/application.js:5281](../../../raw/application.js#L5281).
- قالب الشاشة: `~/App/tenant/views/crs/accounting/openingBalances/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.accounting.openingBalances.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.accounting.openingBalances.index](../../../readable/controllers/C0517--tenant.views.crs.accounting.openingBalances.index.js) | 103 | 51 |
| [tenant.views.crs.accounting.openingBalances.editPrepaidOpeningBalance](../../../readable/controllers/C0510--tenant.views.crs.accounting.openingBalances.editPrepaidOpeningBalance.js) | 4 | 5 |
| [tenant.views.crs.loan.loanSummaryh.dealViewModal](../../../readable/controllers/C0946--tenant.views.crs.loan.loanSummaryh.dealViewModal.js) | 6 | 2 |
| [tenant.views.crs.accounting.openingBalances.addPrepaidOpeningBalance](../../../readable/controllers/C0506--tenant.views.crs.accounting.openingBalances.addPrepaidOpeningBalance.js) | 8 | 4 |
| [tenant.views.crs.accounting.openingBalances.importOpeningBalanceModal](../../../readable/controllers/C0514--tenant.views.crs.accounting.openingBalances.importOpeningBalanceModal.js) | 5 | 4 |
| [tenant.views.crs.accounting.openingBalances.addCustomerOpeningBalance](../../../readable/controllers/C0505--tenant.views.crs.accounting.openingBalances.addCustomerOpeningBalance.js) | 7 | 3 |
| [tenant.views.crs.accounting.openingBalances.addCostCenterOpeningBalances](../../../readable/controllers/C0504--tenant.views.crs.accounting.openingBalances.addCostCenterOpeningBalances.js) | 7 | 5 |
| [tenant.views.crs.accounting.openingBalances.addAccountOpeningBalances](../../../readable/controllers/C0503--tenant.views.crs.accounting.openingBalances.addAccountOpeningBalances.js) | 7 | 3 |
| [tenant.views.crs.accounting.openingBalances.addStockOpeningBalances](../../../readable/controllers/C0507--tenant.views.crs.accounting.openingBalances.addStockOpeningBalances.js) | 9 | 4 |
| [tenant.views.crs.vouchers.allocations.createAllocation](../../../readable/controllers/C1220--tenant.views.crs.vouchers.allocations.createAllocation.js) | 11 | 3 |
| [tenant.views.crs.accounting.openingBalances.editCustomerOpeningBalance](../../../readable/controllers/C0509--tenant.views.crs.accounting.openingBalances.editCustomerOpeningBalance.js) | 5 | 4 |
| [tenant.views.crs.accounting.openingBalances.addSupplierOpeningBalance](../../../readable/controllers/C0508--tenant.views.crs.accounting.openingBalances.addSupplierOpeningBalance.js) | 7 | 3 |
| [tenant.views.crs.accounting.openingBalances.editSupplierOpeningBalance](../../../readable/controllers/C0511--tenant.views.crs.accounting.openingBalances.editSupplierOpeningBalance.js) | 5 | 4 |
| [tenant.views.crs.accounting.openingBalances.importPrepaidOpeningBalanceModal](../../../readable/controllers/C0515--tenant.views.crs.accounting.openingBalances.importPrepaidOpeningBalanceModal.js) | 3 | 3 |
| [tenant.views.crs.accounting.openingBalances.importSupplierOpeningBalanceModal](../../../readable/controllers/C0516--tenant.views.crs.accounting.openingBalances.importSupplierOpeningBalanceModal.js) | 4 | 3 |
| [tenant.views.crs.accounting.openingBalances.importDepositOpeningBalanceModal](../../../readable/controllers/C0513--tenant.views.crs.accounting.openingBalances.importDepositOpeningBalanceModal.js) | 6 | 5 |
| [tenant.views.crs.accounting.openingBalances.importAssetLoansModal](../../../readable/controllers/C0512--tenant.views.crs.accounting.openingBalances.importAssetLoansModal.js) | 20 | 2 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.accounting.openingBalances.index`: `searchContacts`، `searchItems`، `searchVehicles`، `clearContact`، `clearSupplier`، `setImportFlag`، `searchRentalOrLeaseAgreement`، `searchAsset`، `searchAccounts`، `CurrencyFormate`، `localize`، `addRow`، `addCostCenterRow`، `addCustomerRow`، `addSupplierRow`، `addStaffRow`، `addStockRow`، `addAssetRow`، `removeRow`، `removeRowCustomer`، `removeRowCostCenter`، `removeSupplierRow`، `removeStaffRow`، `removeStockRow`، `individaulContactFilter`، `openingBalanceFilter`، `customerFilter`، `supplierFilter`، `staffFilter`، `assetFilter`، `clearItem`، `onChangeOfContact`، `onChangeOfAsset`، `changeProduct`، `save`، `searchVehicles`، `exportToExcelForPrepaid`، `searchAccountOpeningBalance`، `searchPrepaidOpeningBalance`، `searchCostCenterOpeningBalance`، `searchStockOpeningBalance`، `roundingforView`، `editPrepaidOpeningBalance`، `deletePrepaidOpeningBalance`، `exportToExcelForDeposit`، `searchDepositOpeningBalance`، `searchAssetLoans`، `searchOtherLoans`، `viewAssetLoan`، `openAssetLoanModal`، `deleteAssetLoan`، `deleteOtherLoan`، `deleteDepositOpeningBalance`، `searchCustomerOpeningBalance`، `saveCostCenterOpeningBalance`، `saveCustomerOpeningBalance`، `saveSupplierOpeningBalance`، `initStaffOpeningBalance`، `saveStaffOpeningBalance`، `addPrepaidOpeningBalance`، `saveStockOpeningBalance`، `uploader.onSuccessItem`، `uploader.onErrorItem`، `uploaderStock.onSuccessItem`، `uploaderStock.onErrorItem`، `closeImportResultModal`، `addCustomerOpeningBalance`، `createOrEditCostCenterOpeningBalance`، `addCostCenterOpeningBalance`، `editCostCenterOpeningBalance`، `createOrEditAccountOpeningBalance`، `addAccountOpeningBalance`، `editAccountOpeningBalance`، `createOrEditStockOpeningBalance`، `addStockOpeningBalance`، `editStockOpeningBalance`، `getlocalDateTime`، `createAllocation`، `editCustomerOpeningBalance`، `deleteCustomerOpeningBalance`، `deleteCostCenterOpeningBalance`، `deleteAccountOpeningBalance`، `deleteStockOpeningBalance`، `customerTabSelected`، `searchSupplierOpeningBalance`، `addSupplierOpeningBalance`، `editSupplierOpeningBalance`، `deleteSupplierOpeningBalance`، `uploaderSupplier.onSuccessItem`، `uploaderSupplier.onErrorItem`، `uploaderAccounts.onSuccessItem`، `uploaderAccounts.onErrorItem`، `uploaderCostCenter.onSuccessItem`، `uploaderCostCenter.onErrorItem`، `uploaderPrepaidOpening.onSuccessItem`، `uploaderPrepaidOpening.onErrorItem`، `searchAccounts`، `clearPrepaidAccount`، `exportToExcel`، `uploaderDepositOpening.onSuccessItem`، `uploaderDepositOpening.onErrorItem`، `uploaderAssetLoans.onSuccessItem`، `uploaderAssetLoans.onErrorItem`.
- وحدة `tenant.views.crs.accounting.openingBalances.editPrepaidOpeningBalance`: `searchAccounts`، `cancel`، `save`، `searchVehicles`.
- وحدة `tenant.views.crs.loan.loanSummaryh.dealViewModal`: `getlocalDateTime`، `localize`، `currencyFormat`، `rounding`، `cancel`، `calculateSummary`.
- وحدة `tenant.views.crs.accounting.openingBalances.addPrepaidOpeningBalance`: `searchAccounts`، `cancel`، `localize`، `addPrepaidRow`، `removeRowPrepaid`، `searchVehicles`، `clearVehicle`، `save`.
- وحدة `tenant.views.crs.accounting.openingBalances.importOpeningBalanceModal`: `cancel`، `searchRentalOrLeaseAgreement`، `searchContacts`، `getlocalDateTime`، `generateImportedOpeningBalances`.
- وحدة `tenant.views.crs.accounting.openingBalances.addCustomerOpeningBalance`: `searchContacts`، `searchRentalOrLeaseAgreement`، `cancel`، `localize`، `addCustomerRow`، `removeRowCustomer`، `save`.
- وحدة `tenant.views.crs.accounting.openingBalances.addCostCenterOpeningBalances`: `searchAccounts`، `cancel`، `localize`، `addCostCenterRow`، `removeRowCostCenter`، `save`، `init`.
- وحدة `tenant.views.crs.accounting.openingBalances.addAccountOpeningBalances`: `searchAccounts`، `cancel`، `localize`، `addRow`، `removeRow`، `save`، `init`.
- وحدة `tenant.views.crs.accounting.openingBalances.addStockOpeningBalances`: `cancel`، `searchItems`، `changeProduct`، `localize`، `addStockRow`، `removeStockRow`، `loadExistingData`، `save`، `init`.
- وحدة `tenant.views.crs.vouchers.allocations.createAllocation`: `refresh`، `exportToExcel`، `importResult`، `cancel`، `localize`، `rounding`، `sumAmount`، `getlocalDateTime`، `insertDueAmountOnClick`، `save`، `exportToExcelAllocations`.
- وحدة `tenant.views.crs.accounting.openingBalances.editCustomerOpeningBalance`: `searchContacts`، `searchRentalOrLeaseAgreement`، `localize`، `save`، `cancel`.
- وحدة `tenant.views.crs.accounting.openingBalances.addSupplierOpeningBalance`: `searchContacts`، `searchRentalOrLeaseAgreement`، `cancel`، `localize`، `addSupplierRow`، `removeRowSupplier`، `save`.
- وحدة `tenant.views.crs.accounting.openingBalances.editSupplierOpeningBalance`: `searchContacts`، `searchRentalOrLeaseAgreement`، `localize`، `save`، `cancel`.
- وحدة `tenant.views.crs.accounting.openingBalances.importPrepaidOpeningBalanceModal`: `cancel`، `getlocalDateTime`، `generateImportedOpeningBalances`.
- وحدة `tenant.views.crs.accounting.openingBalances.importSupplierOpeningBalanceModal`: `cancel`، `searchContacts`، `getlocalDateTime`، `generateImportedOpeningBalances`.
- وحدة `tenant.views.crs.accounting.openingBalances.importDepositOpeningBalanceModal`: `cancel`، `searchRentalOrLeaseAgreement`، `searchContacts`، `getlocalDate`، `getLocalCreditCardExpiry`، `generateImportedOpeningBalances`.
- وحدة `tenant.views.crs.accounting.openingBalances.importAssetLoansModal`: `cancel`، `getLocalDate`، `groupInstallmentsByDeal`، `linkInstallmentsToAssetLoans`، `createBatches`، `processBatch`، `processBatchesConcurrently`، `generateImportedAssetLoans`، `updateBatchResults`، `updateOriginalData`، `updateProgress`، `toggleInstallments`، `getErrorMessage`، `hasError`، `isDuplicate`، `isGenerated`، `isProcessing`، `getStatusClass`، `getStatusText`، `getOverallProgress`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.account.getAccounts` | POST | api/services/app/account/GetAccounts | [المصدر](../../../raw/application.js#L130348) |
| `abp.services.app.directory.search` | POST | api/services/app/directory/Search | [المصدر](../../../raw/application.js#L129304) |
| `abp.services.app.item.searchItems` | POST | api/services/app/item/SearchItems | [المصدر](../../../raw/application.js#L128938) |
| `abp.services.app.vehicle.searchVehicles` | POST | api/services/app/vehicle/SearchVehicles | [المصدر](../../../raw/application.js#L128817) |
| `abp.services.app.commonLookup.searchRentalOrLeaseAgreement` | POST | api/services/app/commonLookup/SearchRentalOrLeaseAgreement | [المصدر](../../../raw/application.js#L129748) |
| `abp.services.app.asset.search` | POST | api/services/app/asset/Search | [المصدر](../../../raw/application.js#L130407) |
| `abp.services.app.account.searchAccountsForSubLookUp` | POST | api/services/app/account/SearchAccountsForSubLookUp | [المصدر](../../../raw/application.js#L128401) |
| `abp.services.app.commonLookup.getLocations` | POST | api/services/app/commonLookup/GetLocations | [المصدر](../../../raw/application.js#L130063) |
| `abp.services.app.openingBalance.createOrUpdateOpeningBalance` | POST | api/services/app/openingBalance/CreateOrUpdateOpeningBalance | [المصدر](../../../raw/application.js#L130701) |
| `abp.services.app.openingBalance.getOpeningBalancesForEdit` | POST | api/services/app/openingBalance/GetOpeningBalancesForEdit | [المصدر](../../../raw/application.js#L130713) |
| `abp.services.app.openingBalance.getValidAccountOpeningBalances` | POST | api/services/app/openingBalance/GetValidAccountOpeningBalances | [المصدر](../../../raw/application.js#L130798) |
| `abp.services.app.openingBalance.getCustomerOpeningBalances` | POST | api/services/app/openingBalance/GetCustomerOpeningBalances | [المصدر](../../../raw/application.js#L130865) |
| `abp.services.app.openingBalance.exportToExcelPrepaid` | POST | api/services/app/openingBalance/ExportToExcelPrepaid | [المصدر](../../../raw/application.js#L130895) |
| `abp.services.app.openingBalance.getPrepaidOpeningBalances` | POST | api/services/app/openingBalance/GetPrepaidOpeningBalances | [المصدر](../../../raw/application.js#L130919) |
| `abp.services.app.openingBalance.deletePrepaidOpeningBalance` | POST | api/services/app/openingBalance/DeletePrepaidOpeningBalance | [المصدر](../../../raw/application.js#L131057) |
| `abp.services.app.openingBalance.exportDepositOpeningBalances` | POST | api/services/app/openingBalance/ExportDepositOpeningBalances | [المصدر](../../../raw/application.js#L131072) |
| `abp.services.app.bill.getAssetLoans` | POST | api/services/app/bill/GetAssetLoans | [المصدر](../../../raw/application.js#L131317) |
| `abp.services.app.bill.deleteAssetLoans` | POST | api/services/app/bill/DeleteAssetLoans | [المصدر](../../../raw/application.js#L131374) |
| `abp.services.app.openingBalance.getDepositOpeningBalances` | POST | api/services/app/openingBalance/GetDepositOpeningBalances | [المصدر](../../../raw/application.js#L131399) |
| `abp.services.app.openingBalance.deleteDepositOpeningBalance` | POST | api/services/app/openingBalance/DeleteDepositOpeningBalance | [المصدر](../../../raw/application.js#L131513) |
| `abp.services.app.openingBalance.getCostCenterOpeningBalances` | POST | api/services/app/openingBalance/GetCostCenterOpeningBalances | [المصدر](../../../raw/application.js#L131539) |
| `abp.services.app.openingBalance.createOrUpdateCostCenterOpeningBalance` | POST | api/services/app/openingBalance/CreateOrUpdateCostCenterOpeningBalance | [المصدر](../../../raw/application.js#L128613) |
| `abp.services.app.openingBalance.createOrUpdateCustomerOpeningBalance` | POST | api/services/app/openingBalance/CreateOrUpdateCustomerOpeningBalance | [المصدر](../../../raw/application.js#L131608) |
| `abp.services.app.openingBalance.createOrUpdateSupplierOpeningBalance` | POST | api/services/app/openingBalance/CreateOrUpdateSupplierOpeningBalance | [المصدر](../../../raw/application.js#L131629) |
| `abp.services.app.openingBalance.getStaffOpeningBalancesForEdit` | POST | api/services/app/openingBalance/GetStaffOpeningBalancesForEdit | [المصدر](../../../raw/application.js#L131639) |
| `abp.services.app.openingBalance.createOrUpdateStaffOpeningBalance` | POST | api/services/app/openingBalance/CreateOrUpdateStaffOpeningBalance | [المصدر](../../../raw/application.js#L131651) |
| `abp.services.app.openingBalance.getStockOpeningBalances` | POST | api/services/app/openingBalance/GetStockOpeningBalances | [المصدر](../../../raw/application.js#L131660) |
| `abp.services.app.openingBalance.createOrUpdateStockOpeningBalance` | غير مربوط | غير محسوم | [المصدر](../../../raw/application.js#L131760) |
| `abp.services.app.openingBalance.importFromExcelInventory` | POST | [object Object] | [المصدر](../../../raw/application.js#L131894) |
| `abp.services.app.openingBalance.createOrEditStockOpeningBalance` | POST | api/services/app/openingBalance/CreateOrEditStockOpeningBalance | [المصدر](../../../raw/application.js#L129028) |
| `abp.services.app.openingBalance.deleteCustomerOpeningBalance` | POST | api/services/app/openingBalance/DeleteCustomerOpeningBalance | [المصدر](../../../raw/application.js#L132494) |
| `abp.services.app.openingBalance.deleteOpeningBalanceEntry` | POST | [object Object] | [المصدر](../../../raw/application.js#L132538) |
| `abp.services.app.openingBalance.getSupplierOpeningBalances` | POST | api/services/app/openingBalance/GetSupplierOpeningBalances | [المصدر](../../../raw/application.js#L132562) |
| `abp.services.app.openingBalance.deleteSupplierOpeningBalance` | POST | api/services/app/openingBalance/DeleteSupplierOpeningBalance | [المصدر](../../../raw/application.js#L132696) |
| `abp.services.app.account.searchAccounts` | POST | api/services/app/account/SearchAccounts | [المصدر](../../../raw/application.js#L128774) |
| `abp.services.app.openingBalance.importFromExcelAccounts` | POST | [object Object] | [المصدر](../../../raw/application.js#L132932) |
| `abp.services.app.openingBalance.createOrUpdateAccountOpeningBalance` | POST | api/services/app/openingBalance/CreateOrUpdateAccountOpeningBalance | [المصدر](../../../raw/application.js#L128461) |
| `abp.services.app.openingBalance.importFromExcelCostCenter` | POST | [object Object] | [المصدر](../../../raw/application.js#L132945) |
| `abp.services.app.openingBalance.exportToExcel` | POST | api/services/app/openingBalance/ExportToExcel | [المصدر](../../../raw/application.js#L132996) |
| `abp.services.app.openingBalance.exportToExcelStock` | POST | api/services/app/openingBalance/ExportToExcelStock | [المصدر](../../../raw/application.js#L133005) |
| `abp.services.app.openingBalance.exportToExcelStaff` | POST | api/services/app/openingBalance/ExportToExcelStaff | [المصدر](../../../raw/application.js#L133015) |
| `abp.services.app.openingBalance.exportToExcelAccounts` | POST | api/services/app/openingBalance/ExportToExcelAccounts | [المصدر](../../../raw/application.js#L133024) |
| `abp.services.app.openingBalance.exportToExcelCostCenters` | POST | api/services/app/openingBalance/ExportToExcelCostCenters | [المصدر](../../../raw/application.js#L133033) |
| `abp.services.app.costCenter.searchCostCenters` | POST | api/services/app/costCenter/SearchCostCenters | [المصدر](../../../raw/application.js#L128545) |
| `abp.services.app.openingBalance.updatePrepaidOpeningBalance` | POST | api/services/app/openingBalance/UpdatePrepaidOpeningBalance | [المصدر](../../../raw/application.js#L129262) |
| `abp.services.app.openingBalance.getPrepaidOpeningBalanceForEdit` | POST | api/services/app/openingBalance/GetPrepaidOpeningBalanceForEdit | [المصدر](../../../raw/application.js#L129285) |
| `abp.services.app.bankAccount.getBankAccountsForSelection` | POST | api/services/app/bankAccount/GetBankAccountsForSelection | [المصدر](../../../raw/application.js#L255999) |
| `abp.services.app.paymentPlan.getPaymentPlanToMakeInstallemntPayment` | POST | api/services/app/paymentPlan/GetPaymentPlanToMakeInstallemntPayment | [المصدر](../../../raw/application.js#L256054) |
| `abp.services.app.openingBalance.generateImportedPrepaidOpeningBalances` | POST | api/services/app/openingBalance/GenerateImportedPrepaidOpeningBalances | [المصدر](../../../raw/application.js#L130136) |
| `abp.services.app.commonLookup.searchContact` | POST | api/services/app/commonLookup/SearchContact | [المصدر](../../../raw/application.js#L129756) |
| `abp.services.app.openingBalance.importFromExcel` | POST | [object Object] | [المصدر](../../../raw/application.js#L129961) |
| `abp.services.app.openingBalance.generateImportedOpeningBalances` | POST | api/services/app/openingBalance/GenerateImportedOpeningBalances | [المصدر](../../../raw/application.js#L130007) |
| `abp.services.app.openingBalance.addCustomerOpeningBalance` | POST | api/services/app/openingBalance/AddCustomerOpeningBalance | [المصدر](../../../raw/application.js#L128739) |
| `abp.services.app.openingBalance.getCostCenterOpeningBalanceForEdit` | POST | [object Object] | [المصدر](../../../raw/application.js#L128474) |
| `abp.services.app.openingBalance.getStockOpeningBalanceForEdit` | POST | [object Object] | [المصدر](../../../raw/application.js#L129048) |
| `abp.services.app.allocation.saveAllocations` | POST | api/services/app/allocation/SaveAllocations | [المصدر](../../../raw/application.js#L319704) |
| `abp.services.app.allocation.exportToExcelReceipt` | POST | [object Object] | [المصدر](../../../raw/application.js#L319741) |
| `abp.services.app.allocation.getAllocationsForEdit` | POST | api/services/app/allocation/GetAllocationsForEdit | [المصدر](../../../raw/application.js#L319750) |
| `abp.services.app.openingBalance.updateCustomerOpeningBalance` | POST | api/services/app/openingBalance/UpdateCustomerOpeningBalance | [المصدر](../../../raw/application.js#L129207) |
| `abp.services.app.openingBalance.getCustomerOpeningBalanceForEdit` | POST | api/services/app/openingBalance/GetCustomerOpeningBalanceForEdit | [المصدر](../../../raw/application.js#L129221) |
| `abp.services.app.openingBalance.addSupplierOpeningBalance` | POST | api/services/app/openingBalance/AddSupplierOpeningBalance | [المصدر](../../../raw/application.js#L129170) |
| `abp.services.app.openingBalance.updateSupplierOpeningBalance` | POST | api/services/app/openingBalance/UpdateSupplierOpeningBalance | [المصدر](../../../raw/application.js#L129322) |
| `abp.services.app.openingBalance.getSupplierOpeningBalanceForEdit` | POST | api/services/app/openingBalance/GetSupplierOpeningBalanceForEdit | [المصدر](../../../raw/application.js#L129336) |
| `abp.services.app.openingBalance.importFromExcelPrepaidBalance` | POST | [object Object] | [المصدر](../../../raw/application.js#L130089) |
| `abp.services.app.openingBalance.importFromExcelSupplier` | POST | [object Object] | [المصدر](../../../raw/application.js#L130218) |
| `abp.services.app.openingBalance.generateImportedOpeningBalancesSupplier` | POST | api/services/app/openingBalance/GenerateImportedOpeningBalancesSupplier | [المصدر](../../../raw/application.js#L130264) |
| `abp.services.app.billingMethod.getBillingMethods` | POST | api/services/app/billingMethod/GetBillingMethods | [المصدر](../../../raw/application.js#L129794) |
| `abp.services.app.openingBalance.importFromExcelDepositBalance` | POST | [object Object] | [المصدر](../../../raw/application.js#L129816) |
| `abp.services.app.openingBalance.generateImportedDepositOpeningBalances` | POST | api/services/app/openingBalance/GenerateImportedDepositOpeningBalances | [المصدر](../../../raw/application.js#L129871) |
| `abp.services.app.bill.importAssetLoansAndInstallmentsFromExcel` | POST | [object Object] | [المصدر](../../../raw/application.js#L129443) |
| `abp.services.app.bill.generateImportedAssetBills` | POST | api/services/app/bill/GenerateImportedAssetBills | [المصدر](../../../raw/application.js#L129516) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.Vouchers.Receipts.ImportAllocations`: غير ممنوحة في السياق الملتقط.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.filters.prepaidAccount` | ui-select |  |  |
| `voucherLine.account` | ui-select |  |  |
| `voucherLine.debit` | text |  |  |
| `voucherLine.credit` | text |  |  |
| `vm.filters.prepaidAccount` | ui-select |  |  |
| `vm.filters.locationId` | select | locationId | ng-options=location.id as location.name for location in vm.locations |
| `vm.filters.costCenterId` | select | costCenterId | ng-options=costCenter.id as costCenter.name for costCenter in vm.costCenters |
| `vm.filters.contact` | ui-select |  |  |
| `vm.filters.voucherDetails` | text |  |  |
| `vm.filtersSupplier.contact` | ui-select |  |  |
| `row.contact` | ui-select |  |  |
| `row.locationId` | select |  | ng-options=location.id as location.name for location in vm.locations |
| `row.date` | input | date_dateTime |  |
| `row.notes` | text | notes |  |
| `row.debit` | number |  |  |
| `row.credit` | number |  |  |
| `vm.filters.product` | ui-select |  |  |
| `vm.filters.locationId` | select | locationId | ng-options=location.id as location.name for location in vm.locations |
| `vm.filters.prepaidAccount` | ui-select |  |  |
| `vm.filters.vehicle` | ui-select |  |  |
| `vm.filters.voucherDetails` | text |  |  |
| `vm.filters.agreementNo` | text |  |  |
| `vm.filters.customerCode` | text |  |  |
| `vm.filters.refNo` | text |  |  |
| `vm.filters.vehicle` | ui-select |  |  |
| `vm.filters.refNo` | text |  |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
