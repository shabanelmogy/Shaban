# شاشة: Payments

المسار في القائمة: Vouchers ← Payments.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_payments`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0328](../../../readable/routes/R0328--tenant-crs-payments.js)، والأصل [raw/application.js:3883](../../../raw/application.js#L3883).
- قالب الشاشة: `~/App/tenant/views/crs/vouchers/payments/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.vouchers.payments.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.vouchers.payments.index](../../../readable/controllers/C1379--tenant.views.crs.vouchers.payments.index.js) | 39 | 17 |
| [tenant.views.fms.vehicleAssignments.searchOrganizationContactModal](../../../readable/controllers/C1565--tenant.views.fms.vehicleAssignments.searchOrganizationContactModal.js) | 3 | 7 |
| [tenant.views.crs.contacts.searchContactModal](../../../readable/controllers/C0706--tenant.views.crs.contacts.searchContactModal.js) | 7 | 2 |
| [tenant.views.crs.vehicles.searchVehicleModal](../../../readable/controllers/C1186--tenant.views.crs.vehicles.searchVehicleModal.js) | 13 | 11 |
| [tenant.views.crs.vouchers.payments.printTemplates.printPreview](../../../readable/controllers/C1386--tenant.views.crs.vouchers.payments.printTemplates.printPreview.js) | 2 | 0 |
| [tenant.views.crs.accounting.journal.viewModal](../../../readable/controllers/C0499--tenant.views.crs.accounting.journal.viewModal.js) | 7 | 2 |
| [tenant.views.crs.vouchers.payments.createOrEditModal](../../../readable/controllers/C1376--tenant.views.crs.vouchers.payments.createOrEditModal.js) | 61 | 35 |
| [tenant.views.crs.vouchers.payments.createOrEditPdcPaymentsModal](../../../readable/controllers/C1377--tenant.views.crs.vouchers.payments.createOrEditPdcPaymentsModal.js) | 50 | 21 |
| [tenant.views.crs.vouchers.payments.editChequeDetails](../../../readable/controllers/C1378--tenant.views.crs.vouchers.payments.editChequeDetails.js) | 3 | 2 |
| [tenant.views.crs.vouchers.payments.viewModal](../../../readable/controllers/C1384--tenant.views.crs.vouchers.payments.viewModal.js) | 37 | 22 |
| [common.views.common.reportViewer](../../../readable/controllers/C0006--common.views.common.reportViewer.js) | 2 | 0 |
| [tenant.views.crs.vouchers.allocations.createAllocation](../../../readable/controllers/C1220--tenant.views.crs.vouchers.allocations.createAllocation.js) | 11 | 3 |
| [tenant.views.fms.organizationChart.createOrEditUnitModal](../../../readable/controllers/C1559--tenant.views.fms.organizationChart.createOrEditUnitModal.js) | 2 | 2 |
| [tenant.views.crs.contacts.createOrEditModal](../../../readable/controllers/C0703--tenant.views.crs.contacts.createOrEditModal.js) | 45 | 24 |
| [tenant.views.crs.vouchers.payments.uploadDocumentsModal](../../../readable/controllers/C1383--tenant.views.crs.vouchers.payments.uploadDocumentsModal.js) | 3 | 0 |
| [tenant.views.common.hrm.payrolls.viewModal](../../../readable/controllers/C0388--tenant.views.common.hrm.payrolls.viewModal.js) | 3 | 1 |
| [tenant.views.common.hrm.deduction.createOrEditModal](../../../readable/controllers/C0369--tenant.views.common.hrm.deduction.createOrEditModal.js) | 12 | 6 |
| [tenant.views.crs.contacts.uploadDocumentModal](../../../readable/controllers/C0699--tenant.views.crs.contacts.uploadDocumentModal.js) | 2 | 1 |
| [tenant.views.crs.contacts.uploadDocumentModal](../../../readable/controllers/C0711--tenant.views.crs.contacts.uploadDocumentModal.js) | 2 | 1 |
| [tenant.views.common.documents.uploadDocumentModal](../../../readable/controllers/C0362--tenant.views.common.documents.uploadDocumentModal.js) | 4 | 0 |
| [tenant.views.common.documents.uploadImageModal](../../../readable/controllers/C0363--tenant.views.common.documents.uploadImageModal.js) | 3 | 0 |
| [tenant.views.common.documents.addCreditCardModal](../../../readable/controllers/C0701--tenant.views.common.documents.addCreditCardModal.js) | 4 | 0 |
| [tenant.views.common.hrm.deduction.deductionPayrollLineModal](../../../readable/controllers/C0371--tenant.views.common.hrm.deduction.deductionPayrollLineModal.js) | 5 | 2 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.vouchers.payments.index`: `changePrintingWithoutLogo`، `dateRangeModelChanged`، `CurrencyFormate`، `roundingforView`، `dateRangeCheck`، `searchAdditionalDriverPopoup`، `allBranchPermission`، `onlyBranchPermission`، `searchVehicles`، `searchContact`، `searchContactPopoup`، `approveAllMethod`، `locationPermission`، `searchVehiclePopup`، `getPayments`، `getPaymentType`، `getlocalDateTime`، `isPrintEnabled`، `exportToExcel`، `whatsAppSMS`، `whatsAppSMSPaymentIsMoreThanXAmount`، `emailPaymentIsMoreThanXAmount`، `openprintModal`، `openJournalViewModal`، `createPayments`، `createPDCPayments`، `editPayment`، `editChequeDetails`، `viewPayment`، `deletePayment`، `voidPayment`، `enterKeyPress`، `approvePayment`، `unapprovePayment`، `createAllocation`، `createAllocationForCustomerPayment`، `report`، `taxReport`، `clearCustomer`.
- وحدة `tenant.views.fms.vehicleAssignments.searchOrganizationContactModal`: `contactSelected`، `organizationSelected`، `cancel`.
- وحدة `tenant.views.crs.contacts.searchContactModal`: `searchContacts`، `cancel`، `showAddContact`، `contactSelected`، `contactEdit`، `getContactsList`، `getNameWithCode`.
- وحدة `tenant.views.crs.vehicles.searchVehicleModal`: `statusChanged`، `searchModel`، `cancel`، `clearInput`، `clearVehicle`، `getlocalDateTime`، `fromDateTimeChanged`، `searchVehicles`، `searchVehiclesFilters`، `exportToExcelByAgreement`، `vehicleSelected`، `getBookingDate`، `getTeriffGroups`.
- وحدة `tenant.views.crs.vouchers.payments.printTemplates.printPreview`: `cancel`، `getTemplateUrl`.
- وحدة `tenant.views.crs.accounting.journal.viewModal`: `getlocalDateTime`، `rounding`، `formatNumber`، `roundingforView`، `currencyAndRoundingWithThree`، `getVoucherType`، `cancel`.
- وحدة `tenant.views.crs.vouchers.payments.createOrEditModal`: `searchVehicles`، `searchContactGeneralPayment`، `searchJobs`، `rounding`، `localize`، `onCustomerSelect`، `onCustomerSelectForAgreement`، `onAgreementSelect`، `getOriginalName`، `uploader.onSuccessItem`، `uploader.onErrorItem`، `uploadDocument`، `insertDueAmountOnClick`، `searchAdditionalDriverPopoup`، `conversionRateChanged`، `customerCurrencyChanged`، `customerCurrencyChangedForEdit`، `paymentTypeChanged`، `accountChanged`، `accountChangedForImport`، `accountChangedGeneralPayment`، `accountChangedGeneralPaymentEdit`، `onContactChange`، `amountChanged`، `searchAgreements`، `searchContactForSubLookUp`، `searchContact`، `onPaidToSelect`، `searchAssignToEmployeePopoup`، `searchAccounts`، `getPayrolls`، `filterPayrolls`، `onBusinessUnitChange`، `onPayrollChange`، `viewPayrollById`، `openAdvanceOrLoanPaymentModal`، `updateAmountFromPayroll`، `payrollTypes`، `searchVehicles`، `sumAmountTax`، `searchPrepaidExpense`، `sumAmountExpensePaymentReverse`، `sumAmount`، `currencyCodeChangedOnPaymentMethod`، `sumAmountAllocation`، `getlocalDateTime`، `searchItems`، `calculateItemPrice`، `getUnitOfMeasures`، `calculateTaxPerRow`، `searchContactPopoup`، `searchVehiclePopup`، `addRow`، `removeRow`، `cancel`، `save`، `removeDocument`، `checkCurrentDate`، `branchTaxCode`، `setTaxPercentOnTaxCode`، `loadCostCenterInLine`.
- وحدة `tenant.views.crs.vouchers.payments.createOrEditPdcPaymentsModal`: `searchVehicles`، `searchContactGeneralPayment`، `searchJobs`، `rounding`، `localize`، `getOriginalName`، `uploader.onSuccessItem`، `uploader.onErrorItem`، `uploadDocument`، `insertDueAmountOnClick`، `searchAdditionalDriverPopoup`، `paymentTypeChanged`، `accountChanged`، `accountChangedForImport`، `accountChangedGeneralPayment`، `accountChangedGeneralPaymentEdit`، `onContactChange`، `amountChanged`، `searchContactForSubLookUp`، `searchContact`، `searchAccounts`، `searchVehicles`، `sumAmountTax`، `searchPrepaidExpense`، `sumAmountExpensePaymentReverse`، `sumAmount`، `sumAmountAllocation`، `sumAmountAllocation2`، `getlocalDateTime`، `searchItems`، `calculateItemPrice`، `getUnitOfMeasures`، `calculateTaxPerRow`، `searchContactPopoup`، `searchVehiclePopup`، `addRow`، `removeRow`، `cancel`، `setAutoAllocationNowAount`، `setAllocation`، `save`، `removeDocument`، `checkCurrentDate`، `loadCostCenterInLine`، `addChequeRow`، `removeChequeRow`، `getkeys`، `processChequeNo`، `chequeDateChanged`، `chequeAmountChanged`.
- وحدة `tenant.views.crs.vouchers.payments.editChequeDetails`: `save`، `cancel`، `getpaymentForEdit`.
- وحدة `tenant.views.crs.vouchers.payments.viewModal`: `searchVehicles`، `searchContactGeneralPayment`، `searchJobs`، `rounding`، `roundingforView`، `localize`، `getOriginalName`، `uploadDocument`، `insertDueAmountOnClick`، `searchAdditionalDriverPopoup`، `paymentTypeChanged`، `accountChangedGeneralPayment`، `accountChangedGeneralPaymentEdit`، `onContactChange`، `amountChanged`، `searchContact`، `searchAccounts`، `searchVehicles`، `sumAmountTax`، `searchPrepaidExpense`، `sumAmountExpensePaymentReverse`، `sumAmount`، `sumAmountAllocation`، `getlocalDateTime`، `searchItems`، `calculateItemPrice`، `getUnitOfMeasures`، `calculateTaxPerRow`، `searchContactPopoup`، `searchVehiclePopup`، `payrollTypes`، `getDepartmentName`، `addRow`، `cancel`، `checkCurrentDate`، `viewPayrollById`، `loadCostCenterInLine`.
- وحدة `common.views.common.reportViewer`: `exportToExcelFromReport`، `cancel`.
- وحدة `tenant.views.crs.vouchers.allocations.createAllocation`: `refresh`، `exportToExcel`، `importResult`، `cancel`، `localize`، `rounding`، `sumAmount`، `getlocalDateTime`، `insertDueAmountOnClick`، `save`، `exportToExcelAllocations`.
- وحدة `tenant.views.fms.organizationChart.createOrEditUnitModal`: `save`، `cancel`.
- وحدة `tenant.views.crs.contacts.createOrEditModal`: `localize`، `removeExternalIdRow`، `addExternalIdRow`، `getContactExternalType`، `isContactExternalType`، `getlocalDate`، `getlocalDateTime`، `getCardType`، `removeRow`، `searchSalesPersons`، `searchUsersWithDesignation`، `searchSalesPersonPopoup`، `salesPersonSelected`، `searchDebtCollectorPopoup`، `searchCustomLookup`، `getCustomLookups`، `scanDocument`، `openUploadDocument`، `openUploadPicture`، `addCreditCardRow`، `updateCreditCardRow`، `save`، `cancel`، `isPersonVerifiedChange`، `doesIdentityDoucmentExist`، `addIndentityDocument`، `getIdentificationDocumentType`، `removeIndentityDocument`، `removeDoc`، `isFieldMondatory`، `searchCountries`، `emiratesDataReader`، `emiratesDataFieldManager`، `getTariffCards`، `getTariffCardForContact`، `isDocument`، `maskCreditCard`، `getAdvanceSettings`، `getHighLightBlackListCountries`، `getNationalIdFormates`، `nationalIdFormate`، `onOverRideChange`، `resetDocumentNo`، `nationIdMaskInput`، `handleResidenceStatusChange`.
- وحدة `tenant.views.crs.vouchers.payments.uploadDocumentsModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.common.hrm.payrolls.viewModal`: `showSalaryType`، `cancel`، `rounding`.
- وحدة `tenant.views.common.hrm.deduction.createOrEditModal`: `cancel`، `getLocalize`، `searchStaff`، `searchVoucher`، `onVoucherSelect`، `rounding`، `getStatusTypes`، `getDeductionEmiStatus`، `searchStaffPopoup`، `onStaffSelect`، `opendeductionLineModal`، `save`.
- وحدة `tenant.views.crs.contacts.uploadDocumentModal`: `save`، `cancel`.
- وحدة `tenant.views.crs.contacts.uploadDocumentModal`: `save`، `cancel`.
- وحدة `tenant.views.common.documents.uploadDocumentModal`: `uploadHeader`، `uploader.onBeforeUploadItem`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.common.documents.uploadImageModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.common.documents.addCreditCardModal`: `ab`، `cardNumberChanged`، `save`، `cancel`.
- وحدة `tenant.views.common.hrm.deduction.deductionPayrollLineModal`: `searchReceiptVoucher`، `onVoucherKeyPress`، `getlocalDate`، `save`، `cancel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.vehicle.searchVehicles` | POST | api/services/app/vehicle/SearchVehicles | [المصدر](../../../raw/application.js#L377330) |
| `abp.services.app.directory.search` | POST | api/services/app/directory/Search | [المصدر](../../../raw/application.js#L95706) |
| `abp.services.app.payment.approvePayments` | POST | api/services/app/payment/ApprovePayments | [المصدر](../../../raw/application.js#L375020) |
| `abp.services.app.billingMethod.getBillingMethods` | POST | api/services/app/billingMethod/GetBillingMethods | [المصدر](../../../raw/application.js#L377781) |
| `abp.services.app.payment.getPayments` | POST | api/services/app/payment/GetPayments | [المصدر](../../../raw/application.js#L375091) |
| `abp.services.app.commonLookup.getLocationsActiveAndInActive` | POST | api/services/app/commonLookup/GetLocationsActiveAndInActive | [المصدر](../../../raw/application.js#L375138) |
| `abp.services.app.payment.exportToExcel` | POST | api/services/app/payment/ExportToExcel | [المصدر](../../../raw/application.js#L375171) |
| `abp.services.app.payment.sendPaymentWhatsAppSMSManual` | POST | api/services/app/payment/SendPaymentWhatsAppSMSManual | [المصدر](../../../raw/application.js#L375320) |
| `abp.services.app.payment.sendPaymentWhatsAppSMSManualAmountGreateThanXAmount` | POST | api/services/app/payment/SendPaymentWhatsAppSMSManualAmountGreateThanXAmount | [المصدر](../../../raw/application.js#L375335) |
| `abp.services.app.payment.sendPaymentEmailManualAmountGreateThanXAmount` | POST | api/services/app/payment/SendPaymentEmailManualAmountGreateThanXAmount | [المصدر](../../../raw/application.js#L375350) |
| `abp.services.app.payment.deletePayment` | POST | api/services/app/payment/DeletePayment | [المصدر](../../../raw/application.js#L375552) |
| `abp.services.app.payment.voidPayment` | POST | api/services/app/payment/VoidPayment | [المصدر](../../../raw/application.js#L375571) |
| `abp.services.app.payment.approvePayment` | POST | api/services/app/payment/ApprovePayment | [المصدر](../../../raw/application.js#L375624) |
| `abp.services.app.payment.unApprovePayment` | POST | api/services/app/payment/UnApprovePayment | [المصدر](../../../raw/application.js#L375665) |
| `abp.services.app.organizationChart.getOrganizationUnits` | POST | api/services/app/organizationChart/GetOrganizationUnits | [المصدر](../../../raw/application.js#L432892) |
| `abp.services.app.organizationChart.moveOrganizationUnit` | POST | api/services/app/organizationChart/MoveOrganizationUnit | [المصدر](../../../raw/application.js#L432955) |
| `abp.services.app.organizationChart.getOrganizationUnitAllUsers` | POST | api/services/app/organizationChart/GetOrganizationUnitAllUsers | [المصدر](../../../raw/application.js#L433187) |
| `abp.services.app.organizationChart.addUserToOrganizationUnit` | POST | api/services/app/organizationChart/AddUserToOrganizationUnit | [المصدر](../../../raw/application.js#L433107) |
| `abp.services.app.organizationChart.removeUserFromOrganizationUnit` | POST | api/services/app/organizationChart/RemoveUserFromOrganizationUnit | [المصدر](../../../raw/application.js#L433127) |
| `abp.services.app.organizationChart.isInOrganizationUnit` | POST | api/services/app/organizationChart/IsInOrganizationUnit | [المصدر](../../../raw/application.js#L433153) |
| `abp.services.app.directory.searchDirectoryPaged` | POST | api/services/app/directory/SearchDirectoryPaged | [المصدر](../../../raw/application.js#L184666) |
| `abp.services.app.vehicleModel.searchVehicleModelsNew` | POST | api/services/app/vehicleModel/SearchVehicleModelsNew | [المصدر](../../../raw/application.js#L312735) |
| `abp.services.app.vehicle.searchVehiclesPagedWorkShop` | POST | api/services/app/vehicle/SearchVehiclesPagedWorkShop | [المصدر](../../../raw/application.js#L312796) |
| `abp.services.app.vehicle.searchVehiclesPagedByAgreement` | POST | [object Object] | [المصدر](../../../raw/application.js#L312800) |
| `abp.services.app.vehicle.searchVehiclesPaged` | POST | api/services/app/vehicle/SearchVehiclesPaged | [المصدر](../../../raw/application.js#L312803) |
| `abp.services.app.vehicle.exportToExcelByAgreement` | POST | api/services/app/vehicle/ExportToExcelByAgreement | [المصدر](../../../raw/application.js#L312885) |
| `abp.services.app.commonLookup.getLocations` | POST | api/services/app/commonLookup/GetLocations | [المصدر](../../../raw/application.js#L182597) |
| `abp.services.app.commonLookup.getTariffGroups` | POST | api/services/app/commonLookup/GetTariffGroups | [المصدر](../../../raw/application.js#L313062) |
| `abp.services.app.journal.getJournalViewForMulticurrency` | POST | api/services/app/journal/GetJournalViewForMulticurrency | [المصدر](../../../raw/application.js#L126727) |
| `abp.services.app.journal.getJournalView` | POST | api/services/app/journal/GetJournalView | [المصدر](../../../raw/application.js#L126740) |
| `abp.services.app.tenantSettings.getExpenseAccountsAdvanceSetting` | POST | api/services/app/tenantSettings/GetExpenseAccountsAdvanceSetting | [المصدر](../../../raw/application.js#L373133) |
| `abp.services.app.directory.searchByContactGroup` | POST | api/services/app/directory/SearchByContactGroup | [المصدر](../../../raw/application.js#L376802) |
| `abp.services.app.job.searchJobDetails` | POST | api/services/app/job/SearchJobDetails | [المصدر](../../../raw/application.js#L373159) |
| `abp.services.app.commonLookup.getCurrencies` | POST | api/services/app/commonLookup/GetCurrencies | [المصدر](../../../raw/application.js#L377950) |
| `abp.services.app.commonAgreement.getAllAgreementsOnCustomer` | POST | api/services/app/commonAgreement/GetAllAgreementsOnCustomer | [المصدر](../../../raw/application.js#L370752) |
| `abp.services.app.payment.importFromExcel` | POST | [object Object] | [المصدر](../../../raw/application.js#L373212) |
| `abp.services.app.currency.getCurrencies` | POST | api/services/app/currency/GetCurrencies | [المصدر](../../../raw/application.js#L183468) |
| `abp.services.app.account.getStaffAccounts` | POST | api/services/app/account/GetStaffAccounts | [المصدر](../../../raw/application.js#L377288) |
| `abp.services.app.agreement.searchAgreementForVoucherLines` | POST | api/services/app/agreement/SearchAgreementForVoucherLines | [المصدر](../../../raw/application.js#L371606) |
| `abp.services.app.account.searchAccountsForSubLookUp` | POST | api/services/app/account/SearchAccountsForSubLookUp | [المصدر](../../../raw/application.js#L377319) |
| `abp.services.app.payroll.getPayrollsForPayment` | POST | api/services/app/payroll/GetPayrollsForPayment | [المصدر](../../../raw/application.js#L371666) |
| `abp.services.app.department.getDepartment` | POST | api/services/app/department/GetDepartment | [المصدر](../../../raw/application.js#L377802) |
| `abp.services.app.payment.getexpenseaccounts` | POST | api/services/app/payment/Getexpenseaccounts | [المصدر](../../../raw/application.js#L377386) |
| `abp.services.app.item.searchItems` | POST | api/services/app/item/SearchItems | [المصدر](../../../raw/application.js#L377651) |
| `abp.services.app.unitOfMeasure.getUnitOfMeasures` | POST | api/services/app/unitOfMeasure/GetUnitOfMeasures | [المصدر](../../../raw/application.js#L377669) |
| `abp.services.app.expenseType.getExpenseTypes` | POST | api/services/app/expenseType/GetExpenseTypes | [المصدر](../../../raw/application.js#L377826) |
| `abp.services.app.payment.createOrUpdatePayment` | POST | api/services/app/payment/CreateOrUpdatePayment | [المصدر](../../../raw/application.js#L372500) |
| `abp.services.app.allocation.getAllocationsForEdit` | POST | api/services/app/allocation/GetAllocationsForEdit | [المصدر](../../../raw/application.js#L319750) |
| `abp.services.app.commonLookup.getBankAccountsForSelection` | POST | api/services/app/commonLookup/GetBankAccountsForSelection | [المصدر](../../../raw/application.js#L377873) |
| `abp.services.app.commonLookup.getLocationById` | POST | api/services/app/commonLookup/GetLocationById | [المصدر](../../../raw/application.js#L372604) |
| `abp.services.app.costCenter.searchCostCenters` | POST | api/services/app/costCenter/SearchCostCenters | [المصدر](../../../raw/application.js#L377887) |
| `abp.services.app.payment.getPaymentForEdit` | POST | api/services/app/payment/GetPaymentForEdit | [المصدر](../../../raw/application.js#L374555) |
| `abp.services.app.commonLookup.getCurrenciesAll` | POST | api/services/app/commonLookup/GetCurrenciesAll | [المصدر](../../../raw/application.js#L377955) |
| `abp.services.app.commonAgreement.getAgreement` | POST | api/services/app/commonAgreement/GetAgreement | [المصدر](../../../raw/application.js#L372737) |
| `abp.services.app.payment.createOrUpdatePdcPayment` | POST | api/services/app/payment/CreateOrUpdatePdcPayment | [المصدر](../../../raw/application.js#L374379) |
| `abp.services.app.payment.updatePaymentChequeDetails` | POST | api/services/app/payment/UpdatePaymentChequeDetails | [المصدر](../../../raw/application.js#L374778) |
| `abp.services.app.payment.getPaymentForChequeEdit` | POST | api/services/app/payment/GetPaymentForChequeEdit | [المصدر](../../../raw/application.js#L374792) |
| `abp.services.app.job.searchJobs` | POST | api/services/app/job/SearchJobs | [المصدر](../../../raw/application.js#L376809) |
| `abp.services.app.payment.getPaymentForView` | POST | api/services/app/payment/GetPaymentForView | [المصدر](../../../raw/application.js#L377941) |
| `abp.services.app.allocation.saveAllocations` | POST | api/services/app/allocation/SaveAllocations | [المصدر](../../../raw/application.js#L319704) |
| `abp.services.app.allocation.exportToExcelReceipt` | POST | [object Object] | [المصدر](../../../raw/application.js#L319741) |
| `abp.services.app.organizationChart.updateOrganizationUnit` | POST | api/services/app/organizationChart/UpdateOrganizationUnit | [المصدر](../../../raw/application.js#L430943) |
| `abp.services.app.organizationChart.createOrganizationUnit` | POST | api/services/app/organizationChart/CreateOrganizationUnit | [المصدر](../../../raw/application.js#L430950) |
| `abp.services.app.chargesSetting.getChargesTypes` | POST | api/services/app/chargesSetting/GetChargesTypes | [المصدر](../../../raw/application.js#L182581) |
| `abp.services.app.directory.searchSalesPersonOne` | POST | api/services/app/directory/SearchSalesPersonOne | [المصدر](../../../raw/application.js#L182778) |
| `abp.services.app.commonLookup.searchCustomLookups` | POST | api/services/app/commonLookup/SearchCustomLookups | [المصدر](../../../raw/application.js#L182861) |
| `abp.services.app.commonLookup.getCustomLookups` | POST | api/services/app/commonLookup/GetCustomLookups | [المصدر](../../../raw/application.js#L182869) |
| `abp.services.app.country.searchCountries` | POST | api/services/app/country/SearchCountries | [المصدر](../../../raw/application.js#L183560) |
| `abp.services.app.person.createOrUpdatePerson` | POST | api/services/app/person/CreateOrUpdatePerson | [المصدر](../../../raw/application.js#L183236) |
| `abp.services.app.contactGroup.getContactGroupsOnContactType` | POST | api/services/app/contactGroup/GetContactGroupsOnContactType | [المصدر](../../../raw/application.js#L183448) |
| `abp.services.app.taxCode.getTaxCodes` | POST | api/services/app/taxCode/GetTaxCodes | [المصدر](../../../raw/application.js#L183456) |
| `abp.services.app.tariffCard.getActiveTariffCards` | POST | api/services/app/tariffCard/GetActiveTariffCards | [المصدر](../../../raw/application.js#L183703) |
| `abp.services.app.tariffCard.getTariffCardById` | POST | api/services/app/tariffCard/GetTariffCardById | [المصدر](../../../raw/application.js#L183716) |
| `abp.services.app.person.getAdvanceSettings` | POST | api/services/app/person/GetAdvanceSettings | [المصدر](../../../raw/application.js#L183744) |
| `abp.services.app.person.getHighLightBlackListCountry` | POST | [object Object] | [المصدر](../../../raw/application.js#L183768) |
| `abp.services.app.person.getNationalIdFormate` | POST | [object Object] | [المصدر](../../../raw/application.js#L183774) |
| `abp.services.app.person.getPersonForEdit` | POST | api/services/app/person/GetPersonForEdit | [المصدر](../../../raw/application.js#L183903) |
| `abp.services.app.person.getContactCards` | POST | api/services/app/person/GetContactCards | [المصدر](../../../raw/application.js#L184004) |
| `abp.services.app.commonLookup.validateCreditLimit` | POST | api/services/app/commonLookup/ValidateCreditLimit | [المصدر](../../../raw/application.js#L184099) |
| `abp.services.app.payroll.getPayroll` | POST | api/services/app/payroll/GetPayroll | [المصدر](../../../raw/application.js#L100016) |
| `abp.services.app.deduction.getStaffAdvanceOrLoanPayments` | POST | [object Object] | [المصدر](../../../raw/application.js#L95716) |
| `abp.services.app.deduction.createOrUpdateDeduction` | POST | api/services/app/deduction/CreateOrUpdateDeduction | [المصدر](../../../raw/application.js#L95857) |
| `abp.services.app.salaryItemsSetting.getSalaryItemTypes` | POST | api/services/app/salaryItemsSetting/GetSalaryItemTypes | [المصدر](../../../raw/application.js#L95868) |
| `abp.services.app.payment.getSalaryItemTypes` | غير مربوط | غير محسوم | [المصدر](../../../raw/application.js#L95884) |
| `abp.services.app.deduction.getDeductionForEdit` | POST | api/services/app/deduction/GetDeductionForEdit | [المصدر](../../../raw/application.js#L95903) |
| `abp.services.app.person.uploadDocumentImage` | POST | api/services/app/person/UploadDocumentImage | [المصدر](../../../raw/application.js#L185476) |
| `abp.services.app.deduction.getReceiptVoucherForDeduction` | POST | api/services/app/deduction/GetReceiptVoucherForDeduction | [المصدر](../../../raw/application.js#L95995) |
| `abp.services.app.deduction.addCashDeductionPayrollLine` | POST | api/services/app/deduction/AddCashDeductionPayrollLine | [المصدر](../../../raw/application.js#L96060) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.Vouchers.Payments.View`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Payments.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Payments.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Payments.Approve`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Payments.CanApproveBranchPayments`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Payments.UnApprove`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Payments.Allocation`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Payments.Delete`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Payments.Void`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Payments.Print`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Payments.AllActionsOnOtherBranchPayments`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Payments.ViewOtherBranchPayments`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Accounts.Journal`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Payments.BulkPdcPayment`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Administration.OrganizationUnits.ManageOrganizationTree`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Administration.OrganizationUnits.ManageMembers`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Delete`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vehicles.ViewOtherBranchVehicles`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Receipts.ImportAllocations`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.TariffCards`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Customers.EnableCreditPeriod`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Customers.EnableCreditLimit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Administration.Tenant.Integration.Fusion.Mappings`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Customers.ContactCards`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Customers.ContactCards.Add`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Customers.ContactCards.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Customers.ContactCards.Delete`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Customers.ContactCards.ViewCreditCardWithLastFourDigit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Customers.ContactCards.ViewFullCreditCardDetails`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.CustomerApproval`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.LimitedEdit`: ممنوحة في السياق الملتقط.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.filters.voucherNo` | text |  |  |
| `vm.filters.paymentType` | select |  | ng-options=payment.voucherSubTypeId as payment.name for payment in vm.paymentTypes |
| `vm.filters.locationId` | select | locationId |  |
| `vm.filters.approvedType` | text | paymentType | ng-options=approvedType.id as approvedType.name for approvedType in vm.approvedTypes |
| `vm.dateRangeModel` | text |  | min=vm.dateRangeOptions.min; max=vm.dateRangeOptions.max; ng-disabled=!vm.filters.enableDateRange |
| `vm.filters.enableDateRange` | checkbox | disableDateRange |  |
| `vm.filters.customer` | ui-select |  |  |
| `vm.filters.requestedBy.name` | text |  |  |
| `vm.filters.billingMethodId` | select |  | ng-options=billingMethod.id as billingMethod.name for billingMethod in vm.billingMethods |
| `vm.filters.unAllocatedPayments` | text | unAllocatedPayments | ng-options=allocatedType.id as allocatedType.name for allocatedType in vm.allocatedTypes |
| `vm.filters.voidedOnly` | checkbox | voidedOnly |  |
| `vm.filters.printingWithoutLogo` | checkbox | printingWithoutLogo |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
