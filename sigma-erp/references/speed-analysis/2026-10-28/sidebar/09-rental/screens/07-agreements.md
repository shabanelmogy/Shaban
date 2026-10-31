# شاشة: Agreements

المسار في القائمة: Rental ← Agreements.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_agreements`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0279](../../../readable/routes/R0279--tenant-crs-agreements.js)، والأصل [raw/application.js:3528](../../../raw/application.js#L3528).
- قالب الشاشة: `~/App/tenant/views/crs/agreements/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.agreements.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.agreements.index](../../../readable/controllers/C0539--tenant.views.agreements.index.js) | 74 | 24 |
| [tenant.views.common.payments.emailLinkToCharge](../../../readable/controllers/C0410--tenant.views.common.payments.emailLinkToCharge.js) | 4 | 2 |
| [tenant.views.common.payments.silentPayment](../../../readable/controllers/C0412--tenant.views.common.payments.silentPayment.js) | 2 | 3 |
| [common.views.common.reportViewer](../../../readable/controllers/C0006--common.views.common.reportViewer.js) | 2 | 0 |
| [tenant.views.crs.agreements.printPreview](../../../readable/controllers/C0557--tenant.views.crs.agreements.printPreview.js) | 2 | 0 |
| [tenant.views.crs.agreements.editSalesPersonModal](../../../readable/controllers/C0535--tenant.views.crs.agreements.editSalesPersonModal.js) | 5 | 5 |
| [tenant.views.crs.agreements.viewModal](../../../readable/controllers/C0553--tenant.views.crs.agreements.viewModal.js) | 25 | 6 |
| [tenant.views.crs.agreements.agreementAdditionalCharges](../../../readable/controllers/C0521--tenant.views.crs.agreements.agreementAdditionalCharges.js) | 8 | 4 |
| [tenant.views.crs.agreements.addOrViewSaleOrder](../../../readable/controllers/C0520--tenant.views.crs.agreements.addOrViewSaleOrder.js) | 7 | 3 |
| [tenant.views.crs.agreements.billingHistoryModal](../../../readable/controllers/C0527--tenant.views.crs.agreements.billingHistoryModal.js) | 4 | 3 |
| [tenant.views.crs.agreements.createOrEditModal](../../../readable/controllers/C0530--tenant.views.crs.agreements.createOrEditModal.js) | 80 | 38 |
| [tenant.views.crs.agreements.changeDeliveryDateModal](../../../readable/controllers/C0528--tenant.views.crs.agreements.changeDeliveryDateModal.js) | 2 | 2 |
| [tenant.views.crs.agreements.closeAgreementModal](../../../readable/controllers/C0529--tenant.views.crs.agreements.closeAgreementModal.js) | 35 | 13 |
| [tenant.views.crs.agreements.preCloseAgreementModal](../../../readable/controllers/C0544--tenant.views.crs.agreements.preCloseAgreementModal.js) | 30 | 9 |
| [tenant.views.crs.coupons.createOrEditCouponModel](../../../readable/controllers/C0716--tenant.views.crs.coupons.createOrEditCouponModel.js) | 8 | 6 |
| [tenant.views.crs.agreements.replaceVehicleModal](../../../readable/controllers/C0547--tenant.views.crs.agreements.replaceVehicleModal.js) | 9 | 8 |
| [tenant.views.crs.agreements.deliveryModal](../../../readable/controllers/C0533--tenant.views.crs.agreements.deliveryModal.js) | 8 | 5 |
| [tenant.views.crs.agreements.replaceDriverModal](../../../readable/controllers/C0546--tenant.views.crs.agreements.replaceDriverModal.js) | 8 | 5 |
| [tenant.views.crs.agreements.extendCutShortAgreementModal](../../../readable/controllers/C0537--tenant.views.crs.agreements.extendCutShortAgreementModal.js) | 30 | 8 |
| [tenant.views.crs.agreements.upgradeAgreementModal](../../../readable/controllers/C0550--tenant.views.crs.agreements.upgradeAgreementModal.js) | 45 | 18 |
| [tenant.views.crs.vouchers.deposits.createDeposit](../../../readable/controllers/C1289--tenant.views.crs.vouchers.deposits.createDeposit.js) | 8 | 7 |
| [tenant.views.crs.vouchers.receipts.createOrEditImportAllocationsModal](../../../readable/controllers/C1418--tenant.views.crs.vouchers.receipts.createOrEditImportAllocationsModal.js) | 45 | 20 |
| [tenant.views.crs.vouchers.receipts.createOrEditModal](../../../readable/controllers/C1419--tenant.views.crs.vouchers.receipts.createOrEditModal.js) | 49 | 25 |
| [tenant.views.crs.contacts.searchContactModal](../../../readable/controllers/C0706--tenant.views.crs.contacts.searchContactModal.js) | 7 | 2 |
| [tenant.views.crs.agreements.agreementLogsModal](../../../readable/controllers/C0526--tenant.views.crs.agreements.agreementLogsModal.js) | 2 | 1 |
| [tenant.views.crs.agreements.agreementDocumentsModalU](../../../readable/controllers/C0525--tenant.views.crs.agreements.agreementDocumentsModalU.js) | 12 | 4 |
| [tenant.views.crs.agreements.agreementDiscountsPeriodWiseModal](../../../readable/controllers/C0523--tenant.views.crs.agreements.agreementDiscountsPeriodWiseModal.js) | 5 | 2 |
| [tenant.views.crs.agreements.paymentInstructionsModal](../../../readable/controllers/C0543--tenant.views.crs.agreements.paymentInstructionsModal.js) | 12 | 4 |
| [tenant.views.mcc.movements.movementLogsModal](../../../readable/controllers/C1632--tenant.views.mcc.movements.movementLogsModal.js) | 2 | 1 |
| [tenant.views.crs.contacts.createOrEditModal](../../../readable/controllers/C0703--tenant.views.crs.contacts.createOrEditModal.js) | 45 | 24 |
| [tenant.views.crs.companies.createOrEditModal](../../../readable/controllers/C0695--tenant.views.crs.companies.createOrEditModal.js) | 50 | 26 |
| [tenant.views.crs.vehicles.viewModal](../../../readable/controllers/C1200--tenant.views.crs.vehicles.viewModal.js) | 19 | 6 |
| [tenant.views.crs.agreements.mileageChargesInfoModal](../../../readable/controllers/C0541--tenant.views.crs.agreements.mileageChargesInfoModal.js) | 1 | 0 |
| [tenant.views.crs.agreements.printtemplates.printReplacementPreview](../../../readable/controllers/C0560--tenant.views.crs.agreements.printtemplates.printReplacementPreview.js) | 5 | 1 |
| [tenant.views.movements.editModal](../../../readable/controllers/C1630--tenant.views.movements.editModal.js) | 10 | 6 |
| [tenant.views.movements.viewModal](../../../readable/controllers/C1636--tenant.views.movements.viewModal.js) | 11 | 5 |
| [tenant.views.crs.agreements.tollsDetailModal](../../../readable/controllers/C0549--tenant.views.crs.agreements.tollsDetailModal.js) | 3 | 2 |
| [tenant.views.crs.agreements.darbsDetailModal](../../../readable/controllers/C0532--tenant.views.crs.agreements.darbsDetailModal.js) | 3 | 2 |
| [tenant.views.crs.agreements.parkingDetailModal](../../../readable/controllers/C0542--tenant.views.crs.agreements.parkingDetailModal.js) | 3 | 2 |
| [tenant.views.crs.agreements.finesDetailModal](../../../readable/controllers/C0538--tenant.views.crs.agreements.finesDetailModal.js) | 3 | 3 |
| [tenant.views.crs.vouchers.invoices.viewModal](../../../readable/controllers/C1357--tenant.views.crs.vouchers.invoices.viewModal.js) | 14 | 5 |
| [tenant.views.crs.vouchers.payments.createOrEditModal](../../../readable/controllers/C1376--tenant.views.crs.vouchers.payments.createOrEditModal.js) | 61 | 35 |
| [tenant.views.crs.discountCodes.applyDiscountModal](../../../readable/controllers/C0304--tenant.views.crs.discountCodes.applyDiscountModal.js) | 4 | 0 |
| [tenant.views.crs.discountCodes.applyDiscountModal](../../../readable/controllers/C0774--tenant.views.crs.discountCodes.applyDiscountModal.js) | 5 | 1 |
| [tenant.views.crs.agreements.expiredDocOutStandingBalanceModal](../../../readable/controllers/C0536--tenant.views.crs.agreements.expiredDocOutStandingBalanceModal.js) | 4 | 1 |
| [tenant.views.crs.vehicles.searchVehicleModal](../../../readable/controllers/C1186--tenant.views.crs.vehicles.searchVehicleModal.js) | 13 | 11 |
| [tenant.views.crs.vehicles.addExternalVehicle](../../../readable/controllers/C1158--tenant.views.crs.vehicles.addExternalVehicle.js) | 6 | 4 |
| [tenant.views.crs.contacts.searchContactOptionModal](../../../readable/controllers/C0707--tenant.views.crs.contacts.searchContactOptionModal.js) | 7 | 1 |
| [tenant.views.crs.contacts.searchSagX3ContactModal](../../../readable/controllers/C0710--tenant.views.crs.contacts.searchSagX3ContactModal.js) | 3 | 2 |
| [tenant.views.crs.agreements.driverChargesModal](../../../readable/controllers/C0534--tenant.views.crs.agreements.driverChargesModal.js) | 4 | 0 |
| [tenant.views.common.authorizationCodes.verifyAuthCodeModal](../../../readable/controllers/C0308--tenant.views.common.authorizationCodes.verifyAuthCodeModal.js) | 3 | 1 |
| [tenant.views.crs.agreements.agreementAdvanceAndDeposit](../../../readable/controllers/C0522--tenant.views.crs.agreements.agreementAdvanceAndDeposit.js) | 15 | 4 |
| [tenant.views.crs.vouchers.invoices.generateFineModal](../../../readable/controllers/C1324--tenant.views.crs.vouchers.invoices.generateFineModal.js) | 20 | 8 |
| [tenant.views.crs.vehicles.updateMileageAlertModal](../../../readable/controllers/C1194--tenant.views.crs.vehicles.updateMileageAlertModal.js) | 2 | 1 |
| [tenant.views.crs.vouchers.deposits.uploadDocumentsModal](../../../readable/controllers/C1300--tenant.views.crs.vouchers.deposits.uploadDocumentsModal.js) | 3 | 0 |
| [tenant.views.crs.vouchers.deposits.printTemplates.printPreview](../../../readable/controllers/C1304--tenant.views.crs.vouchers.deposits.printTemplates.printPreview.js) | 2 | 0 |
| [tenant.views.crs.vouchers.invoices.generateAdvanceTaxModal](../../../readable/controllers/C1318--tenant.views.crs.vouchers.invoices.generateAdvanceTaxModal.js) | 31 | 12 |
| [tenant.views.crs.vouchers.receipts.printTemplates.printPreview](../../../readable/controllers/C1433--tenant.views.crs.vouchers.receipts.printTemplates.printPreview.js) | 2 | 0 |
| [tenant.views.crs.vouchers.receipts.uploadDocumentsModal](../../../readable/controllers/C1430--tenant.views.crs.vouchers.receipts.uploadDocumentsModal.js) | 3 | 0 |
| [tenant.views.crs.contacts.uploadDocumentModal](../../../readable/controllers/C0699--tenant.views.crs.contacts.uploadDocumentModal.js) | 2 | 1 |
| [tenant.views.crs.contacts.uploadDocumentModal](../../../readable/controllers/C0711--tenant.views.crs.contacts.uploadDocumentModal.js) | 2 | 1 |
| [tenant.views.common.documents.uploadImageModal](../../../readable/controllers/C0363--tenant.views.common.documents.uploadImageModal.js) | 3 | 0 |
| [tenant.views.crs.agreements.uploadAgreementDocumentModal](../../../readable/controllers/C0551--tenant.views.crs.agreements.uploadAgreementDocumentModal.js) | 3 | 1 |
| [tenant.views.common.documents.uploadDocumentModal](../../../readable/controllers/C0362--tenant.views.common.documents.uploadDocumentModal.js) | 4 | 0 |
| [tenant.views.common.documents.addCreditCardModal](../../../readable/controllers/C0701--tenant.views.common.documents.addCreditCardModal.js) | 4 | 0 |
| [tenant.views.crs.companies.createOrUpdateDriverModal](../../../readable/controllers/C0696--tenant.views.crs.companies.createOrUpdateDriverModal.js) | 28 | 13 |
| [tenant.views.crs.vehicles.printDocumentModel](../../../readable/controllers/C1178--tenant.views.crs.vehicles.printDocumentModel.js) | 1 | 1 |
| [tenant.views.movements.uploadDocument](../../../readable/controllers/C1635--tenant.views.movements.uploadDocument.js) | 3 | 1 |
| [tenant.views.crs.vouchers.invoices.uploadDocumentsModal](../../../readable/controllers/C1355--tenant.views.crs.vouchers.invoices.uploadDocumentsModal.js) | 3 | 0 |
| [tenant.views.crs.vouchers.invoices.allocationsViewModel](../../../readable/controllers/C1311--tenant.views.crs.vouchers.invoices.allocationsViewModel.js) | 4 | 1 |
| [tenant.views.crs.vouchers.payments.uploadDocumentsModal](../../../readable/controllers/C1383--tenant.views.crs.vouchers.payments.uploadDocumentsModal.js) | 3 | 0 |
| [tenant.views.fms.vehicleAssignments.searchOrganizationContactModal](../../../readable/controllers/C1565--tenant.views.fms.vehicleAssignments.searchOrganizationContactModal.js) | 3 | 7 |
| [tenant.views.common.hrm.payrolls.viewModal](../../../readable/controllers/C0388--tenant.views.common.hrm.payrolls.viewModal.js) | 3 | 1 |
| [tenant.views.common.hrm.deduction.createOrEditModal](../../../readable/controllers/C0369--tenant.views.common.hrm.deduction.createOrEditModal.js) | 12 | 6 |
| [tenant.views.crs.vouchers.payments.printTemplates.printPreview](../../../readable/controllers/C1386--tenant.views.crs.vouchers.payments.printTemplates.printPreview.js) | 2 | 0 |
| [tenant.views.crs.discountCodes.verifyAuthCodeModal](../../../readable/controllers/C0778--tenant.views.crs.discountCodes.verifyAuthCodeModal.js) | 2 | 1 |
| [tenant.views.crs.vouchers.invoices.addMissingFineModal](../../../readable/controllers/C1309--tenant.views.crs.vouchers.invoices.addMissingFineModal.js) | 8 | 5 |
| [tenant.views.fms.organizationChart.createOrEditUnitModal](../../../readable/controllers/C1559--tenant.views.fms.organizationChart.createOrEditUnitModal.js) | 2 | 2 |
| [tenant.views.common.hrm.deduction.deductionPayrollLineModal](../../../readable/controllers/C0371--tenant.views.common.hrm.deduction.deductionPayrollLineModal.js) | 5 | 2 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.agreements.index`: `searchOwner`، `getContactType`، `getVehicleType`، `resetFilters`، `clearModel`، `searchModel`، `dateRangeModelChanged`، `locationPermissionEditDelete`، `isDeliveryNotPending`، `searchUsers`، `searchUsersWithDesignation`، `searchSaleOrigin`، `searchAgreementGroup`، `searchSupplierContact`، `searchProjects`، `onChangeComplimentary`، `locationPermissionClose`، `getlocalDateTime`، `statusChanged`، `getlocalDate`، `getlocalizedString`، `whatsAppSMSOpen`، `whatsAppSMSClose`، `dateRangeCheck`، `exportToExcel`، `emailLinkToCharge`، `manuallySendOpeningAgreementEmail`، `manuallySendClosingAgreementEmail`، `openSilentPaymentModal`، `exportToExcelDetailed`، `report`، `printAgreement`، `editSalesPerson`، `agreementAdditionalCharges`، `createOrViewSaleOrders`، `changeDeliveryDate`، `viewAgreement`، `viewBillingHistory`، `createAgreement`، `editAgreement`، `closeAgreement`، `preCloseAgreement`، `rounding`، `upgradeAgreement`، `unCloseAgreement`، `searchCreatedBy`، `searchCustomers`، `searchvehicleOwners`، `searchvehicleOwnersPopoup`، `searchCustomerPopoup`، `getAgreements`، `onPageSizeChange`، `paginate`، `deleteAgreement`، `voidAgreement`، `openAgreementLogsModal`، `openAgreementDocumentsModal`، `openAgreementDiscountsModal`، `openPaymentInstructionsModal`، `clearCustomer`، `clearUser`، `clearVehicleOwner`، `clearSalesPerson`، `clearSaleOrigin`، `clearProject`، `clearAgreementGroups`، `clearInsuranceCompany`، `replaceVehicle`، `replaceDriver`، `addDeliveryMovement`، `extendAgreement`، `cutShortAgreement`، `addReceipt`، `createDeposit`.
- وحدة `tenant.views.common.payments.emailLinkToCharge`: `isOneTimePaymentOnChange`، `send`، `cancel`، `getlocalDateTime`.
- وحدة `tenant.views.common.payments.silentPayment`: `cancel`، `pay`.
- وحدة `common.views.common.reportViewer`: `exportToExcelFromReport`، `cancel`.
- وحدة `tenant.views.crs.agreements.printPreview`: `cancel`، `getTemplateUrl`.
- وحدة `tenant.views.crs.agreements.editSalesPersonModal`: `getlocalDateTime`، `clearSalesPerson`، `save`، `cancel`، `searchStaff`.
- وحدة `tenant.views.crs.agreements.viewModal`: `getlocalDateTime`، `openMovementLogsModal`، `getlocalDate`، `currencyAndRoundingWithThree`، `roundingforView`، `localize`، `localizeChargesType`، `getFuelLevel`، `rounding`، `calculate`، `viewContact`، `viewVehicle`، `openMileageInfoModal`، `printModel`، `editMovement`، `viewMovement`، `showTollsDetail`، `showDarbsDetail`، `showParkingDetail`، `fetchParking`، `showFinesDetail`، `cancel`، `totalDaysAndTime`، `viewInvoice`، `getOutStandingBalance`.
- وحدة `tenant.views.crs.agreements.agreementAdditionalCharges`: `searchAdditionalDrivers`، `searchAdditionalDriverPopoup`، `addRow`، `removeRow`، `calculateCharges`، `getAgreementTypeName`، `cancel`، `save`.
- وحدة `tenant.views.crs.agreements.addOrViewSaleOrder`: `getlocalDateTime`، `cancel`، `rounding`، `addRow`، `removeRow`، `searchSaleOrders`، `save`.
- وحدة `tenant.views.crs.agreements.billingHistoryModal`: `getlocalDate`، `cancel`، `rounding`، `addCustomerPayment`.
- وحدة `tenant.views.crs.agreements.createOrEditModal`: `searchProjects`، `getlocalDateTime`، `isQuotationMandatory`، `getDateTariffCard`، `searchGoogleLocations`، `agreementTypeChange`، `getTariffCards`، `getTariffCardForAgreement`، `localize`، `localizeChargesType`، `startDateChanged`، `shouldDisableRateOtherThanRent`، `shouldDisableRow`، `applyDiscount`، `agreementTypeSelected`، `updateEndDateTimeWithStartDate`، `restrictEndTime`، `onStartDateChanged`، `onEndDateChanged`، `searchVehicles`، `searchCustomers`، `searchUsersWithDesignation`، `salesPersonSelected`، `searchStaff`، `searchSaleOrigin`، `endDateChanged`، `searchCustomerPopoup`، `searchDrivers`، `searchSupplierContact`، `searchDriverPopoup`، `searchSupplierPopoup`، `driverChargesPopoup`، `clearAdditionalDriver`، `searchAdditionalDrivers`، `searchAdditionalDriverPopoup`، `tariffCardChanged`، `vehicleSelected`، `changesRegardingQuotationCharges`، `quotationSelected`، `splitChargesForBroker`، `calculateCount`، `openExpiredDocAndOutStandingBalanceModal`، `getOutStandingBalance`، `changeTariffBasedOnCustomerCurrency`، `customerSelected`، `branchTaxCode`، `isBlackListedCustomerCheck`، `onCustomerSelect`، `commonDriverSearch`، `searchDrivers`، `individualCustomerRadioSelected`، `searchDrivers`، `searchDrivers`، `searchDrivers`، `getSaleOrders`، `saleOrderChanged`، `driverSelected`، `additionalDriverSelected`، `searchVehiclePopup`، `addExternalVehiclePopup`، `addExternalVehiclePopup`، `addSagX3Contact`، `save`، `cancel`، `unCheckAllCharges`، `tariffOptionSelected`، `disableRate`، `calculate`، `includedChanged`، `taxAcceptedChanged`، `discountApplied`، `changeStatusReceiptCreation`، `changeStatusDepositCreation`، `totalDaysAndTime`، `otherPickUpLocationChanged`، `otherDropoffLocationChanged`، `complimentaryOnChange`، `rentOnChange`، `getAuthorizedUserName`، `amountChangedDeposit`.
- وحدة `tenant.views.crs.agreements.changeDeliveryDateModal`: `save`، `cancel`.
- وحدة `tenant.views.crs.agreements.closeAgreementModal`: `localize`، `localizeChargesType`، `getlocalDateTime`، `getAgreementType`، `tariffOptionSelected`، `calculateMileage`، `includedChanged`، `getFuelLevel`، `searchGoogleLocations`، `endDateChanged`، `calculate`، `sumCharges`، `taxAcceptedChanged`، `tollsCount`، `openMileageInfoModal`، `chargesAcceptanceChanged`، `generateFineInvoice`، `totalDaysAndTime`، `save`، `showTollsDetail`، `showFinesDetail`، `showParkingDetail`، `cancel`، `callbackOnComplete`، `downloadTollsV3`، `sendCaptcha`، `focusWindow`، `closeAllTabs`، `fetchTolls`، `fetchDarbTolls`، `fetchFines`، `fetchParking`، `showError`، `hasError`، `ok`.
- وحدة `tenant.views.crs.agreements.preCloseAgreementModal`: `localize`، `localizeChargesType`، `getlocalDateTime`، `getAgreementType`، `tariffOptionSelected`، `includedChanged`، `getFuelLevel`، `searchGoogleLocations`، `endDateChanged`، `calculate`، `sumCharges`، `taxAcceptedChanged`، `tollsCount`، `openMileageInfoModal`، `chargesAcceptanceChanged`، `save`، `showTollsDetail`، `showFinesDetail`، `showParkingDetail`، `cancel`، `sendCaptcha`، `focusWindow`، `closeAllTabs`، `fetchTolls`، `fetchDarbTolls`، `fetchFines`، `fetchParking`، `showError`، `hasError`، `ok`.
- وحدة `tenant.views.crs.coupons.createOrEditCouponModel`: `save`، `isCouponDateEmpty`، `searchContacts`، `searchContactsPopoup`، `cancel`، `searchLuckyDraws`، `clearLuckyDraw`، `getCouponForEdit`.
- وحدة `tenant.views.crs.agreements.replaceVehicleModal`: `searchVehicles`، `searchGoogleLocations`، `getAgreementTypeName`، `getlocalDateTime`، `getFuelLevel`، `vehicleSelected`، `cancel`، `save`، `generateFineInvoices`.
- وحدة `tenant.views.crs.agreements.deliveryModal`: `searchVehicles`، `searchDrivers`، `getAgreementTypeName`، `getlocalDateTime`، `getFuelLevel`، `vehicleSelected`، `cancel`، `save`.
- وحدة `tenant.views.crs.agreements.replaceDriverModal`: `searchDrivers`، `searchVehicles`، `getAgreementTypeName`، `getlocalDateTime`، `getFuelLevel`، `vehicleSelected`، `cancel`، `save`.
- وحدة `tenant.views.crs.agreements.extendCutShortAgreementModal`: `agreementTypeDisableCheck`، `localize`، `applyDiscount`، `agreementTypeSelected`، `searchVehicles`، `searchCustomers`، `searchStaff`، `searchCustomerPopoup`، `updateMileage`، `searchDrivers`، `searchDriverPopoup`، `searchAdditionalDrivers`، `searchAdditionalDriverPopoup`، `vehicleSelected`، `customerSelected`، `driverSelected`، `additionalDriverSelected`، `searchVehiclePopup`، `save`، `cancel`، `tariffOptionSelected`، `disableRate`، `calculate`، `includedChanged`، `taxAcceptedChanged`، `discountApplied`، `changeStatusReceiptCreation`، `changeStatusDepositCreation`، `totalDaysAndTime`، `updateEndDateTimeWithStartDate`.
- وحدة `tenant.views.crs.agreements.upgradeAgreementModal`: `getlocalDateTime`، `getAgreementTypeName`، `agreementTypeChanged`، `getFuelLevel`، `endDateChanged`، `calculate`، `calculateMileage`، `mileageInChanged`، `sumCharges`، `taxAcceptedChanged`، `searchGoogleLocations`، `carryFwdKmsToggle`، `otherPickUpLocationChanged`، `otherDropoffLocationChanged`، `showTollsDetail`، `showFinesDetail`، `cancel`، `fetchTolls`، `fetchDarbTolls`، `closeAllTabs`، `fetchFines`، `localize`، `startDateChanged`، `agreementTypeSelected`، `endDateChangedOpen`، `searchVehicles`، `searchCustomers`، `searchCustomerPopoup`، `searchDrivers`، `searchDriverPopoup`، `searchAdditionalDrivers`، `searchAdditionalDriverPopoup`، `searchStaff`، `searchUsersWithDesignation`، `vehicleSelected`، `customerSelected`، `driverSelected`، `additionalDriverSelected`، `searchVehiclePopup`، `tariffOptionSelected`، `calculateOpen`، `includedChanged`، `taxAcceptedChangedOpen`، `discountApplied`، `save`.
- وحدة `tenant.views.crs.vouchers.deposits.createDeposit`: `uploadDocument`، `removeDocument`، `getOriginalName`، `amountChanged`، `depositSubTypeChanged`، `amountChangedDeposit`، `cancel`، `ok`.
- وحدة `tenant.views.crs.vouchers.receipts.createOrEditImportAllocationsModal`: `refresh`، `export`، `isEnabled`، `onBillingMethodChange`، `billingMethodSelected`، `calculateBankTransferCommission`، `receiptTypeChanged`، `dateNullOrNot`، `searchAccounts`، `addRow`، `removeRow`، `searchJobs`، `getReceiptTypeName`، `contactCardSelected`، `localize`، `rounding`، `amountChanged`، `amountWithoutCommissionChanged`، `sumAmountAllocationCharges`، `insertDueAmountOnClick`، `sumAmountAllocationChargesAgreement`، `sumTotalWithAllocation`، `calculateGeneralReceiptAmount`، `getlocalDateTime`، `getlocalDate`، `cancel`، `searchCustomers`، `searchContactGeneralPayment`، `calculateCreditCardCommission`، `searchVehicles`، `autoAllocation`، `rounding`، `onCustomerSelect`، `conversionRateChanged`، `customerCurrencyChanged`، `customerCurrencyChangedForEdit`، `sumReceiptAmount`، `sumAmount`، `searchCustomerPopoup`، `accountChangedGeneralPayment`، `moduleChanged`، `openAdvanceTaxInvoiceModal`، `save`، `saveGeneralReceipt`، `checkCurrentDate`.
- وحدة `tenant.views.crs.vouchers.receipts.createOrEditModal`: `localize`، `isEnabled`، `uploadDocument`، `getOriginalName`، `billingMethodSelected`، `receiptTypeChanged`، `dateNullOrNot`، `searchAccounts`، `addRow`، `removeRow`، `searchJobs`، `getReceiptTypeName`، `contactCardSelected`، `localize`، `rounding`، `amountChanged`، `amountWithoutCommissionChanged`، `sumAmountAllocationCharges`، `insertDueAmountOnClick`، `sumAmountAllocationChargesAgreement`، `sumTotalWithAllocation`، `calculateGeneralReceiptAmount`، `getlocalDateTime`، `getlocalDate`، `cancel`، `searchCustomers`، `searchContactGeneralPayment`، `onBillingMethodChange`، `calculateCreditCardCommission`، `calculateBankTransferCommission`، `searchVehicles`، `rounding`، `onCustomerSelect`، `onCustomerSelectForAgreement`، `conversionRateChanged`، `customerCurrencyChanged`، `customerCurrencyChangedForEdit`، `sumReceiptAmount`، `autoAllocation`، `sumAmount`، `searchCustomerPopoup`، `accountChangedGeneralPayment`، `moduleChanged`، `onAgreementSelect`، `openAdvanceTaxInvoiceModal`، `save`، `removeDocument`، `saveGeneralReceipt`، `checkCurrentDate`.
- وحدة `tenant.views.crs.contacts.searchContactModal`: `searchContacts`، `cancel`، `showAddContact`، `contactSelected`، `contactEdit`، `getContactsList`، `getNameWithCode`.
- وحدة `tenant.views.crs.agreements.agreementLogsModal`: `getlocalDateTime`، `cancel`.
- وحدة `tenant.views.crs.agreements.agreementDocumentsModalU`: `getlocalDateTime`، `tabSelected`، `getAllAgreementDocumentsSettings`، `addIndentityDocument`، `doesIdentityDoucmentExist`، `cancel`، `openUploadDocument`، `getIdentificationDocumentType`، `removeIndentityDocument`، `openAgreementDocumentsModal`، `removeAgreementDocument`، `save`.
- وحدة `tenant.views.crs.agreements.agreementDiscountsPeriodWiseModal`: `getlocalDateTime`، `cancel`، `addRow`، `removeRow`، `save`.
- وحدة `tenant.views.crs.agreements.paymentInstructionsModal`: `getlocalDateTime`، `getPaymentMethod`، `addRow`، `removeRow`، `paymentMethodChanged`، `chequeNoChanged`، `chequeDateChanged`، `chequeMethodChanged`، `chequeBankChanged`، `cancel`، `startDateChanged`، `save`.
- وحدة `tenant.views.mcc.movements.movementLogsModal`: `getlocalDateTime`، `cancel`.
- وحدة `tenant.views.crs.contacts.createOrEditModal`: `localize`، `removeExternalIdRow`، `addExternalIdRow`، `getContactExternalType`، `isContactExternalType`، `getlocalDate`، `getlocalDateTime`، `getCardType`، `removeRow`، `searchSalesPersons`، `searchUsersWithDesignation`، `searchSalesPersonPopoup`، `salesPersonSelected`، `searchDebtCollectorPopoup`، `searchCustomLookup`، `getCustomLookups`، `scanDocument`، `openUploadDocument`، `openUploadPicture`، `addCreditCardRow`، `updateCreditCardRow`، `save`، `cancel`، `isPersonVerifiedChange`، `doesIdentityDoucmentExist`، `addIndentityDocument`، `getIdentificationDocumentType`، `removeIndentityDocument`، `removeDoc`، `isFieldMondatory`، `searchCountries`، `emiratesDataReader`، `emiratesDataFieldManager`، `getTariffCards`، `getTariffCardForContact`، `isDocument`، `maskCreditCard`، `getAdvanceSettings`، `getHighLightBlackListCountries`، `getNationalIdFormates`، `nationalIdFormate`، `onOverRideChange`، `resetDocumentNo`، `nationIdMaskInput`، `handleResidenceStatusChange`.
- وحدة `tenant.views.crs.companies.createOrEditModal`: `getCardType`، `getlocalDate`، `localize`، `getlocalDateTime`، `removeExternalIdRow`، `addExternalIdRow`، `getContactExternalType`، `isContactExternalType`، `addCreditCardRow`، `addDriverRow`، `updateCreditCardRow`، `removeRow`، `searchContacts`، `showAddContact`، `removeRowContact`، `save`، `cancel`، `addContactPersonsRow`، `changeDesignation`، `removeContactPersonsRow`، `searchSalesPersons`، `searchUsersWithDesignation`، `searchSalesPersonPopoup`، `salesPersonSelected`، `searchDebtCollectorPopoup`، `doesIdentityDoucmentExist`، `openUploadDocument`، `addIndentityDocument`، `addMandatoryDesignations`، `isCompanyVerifiedChange`، `removeIndentityDocument`، `maskCreditCard`، `removeDoc`، `getIdentificationDocumentType`، `searchCountries`، `getTariffCards`، `getTariffCardForCompany`، `isDocument`، `getDesignations`، `isFieldMondatoryForSalesPerson`، `isFieldMondatory`، `isAdditionalFieldsEnabled`، `typeOfFeild`، `onOverRideChange`، `getAdvanceSettings`، `getIndustries`، `getCompanyCustomField1`، `getCompanyCustomField2`، `getHighLightBlackListCountries`، `getCompanyCustomField3`.
- وحدة `tenant.views.crs.vehicles.viewModal`: `getlocalDateTime`، `getVehicleExternalType`، `getChassisType`، `getVehicleWarrantyType`، `getWarrantyPeriod`، `getCostCenterGroup`، `getFuelLevel`، `openPrintModal`، `searchModel`، `getMovementStatus`، `viewMovement`، `searchTariffGroups`، `cancel`، `isAdditionalFieldsEnabled`، `isFieldMondatory`، `typeOfFeild`، `getAdvanceSettings`، `isDocument`، `isDocumentSepr`.
- وحدة `tenant.views.crs.agreements.mileageChargesInfoModal`: `cancel`.
- وحدة `tenant.views.crs.agreements.printtemplates.printReplacementPreview`: `getFuelLevel`، `getlocalDateTime`، `getlocalDate`، `cancel`، `getChecklist`.
- وحدة `tenant.views.movements.editModal`: `getWorkshopMovementTypes`، `getFuelLevel`، `geoLocationMap`، `getLocalize`، `cancel`، `setActiveTabIndex`، `getlocalDateTime`، `getChecklist`، `uploadDocument`، `save`.
- وحدة `tenant.views.movements.viewModal`: `getWorkshopMovementTypes`، `getFuelLevel`، `geoLocationMap`، `getLocalize`، `cancel`، `setActiveTabIndex`، `getlocalDateTime`، `getChecklist`، `uploadDocument`، `getFieldLabel`، `isCustomFieldExists`.
- وحدة `tenant.views.crs.agreements.tollsDetailModal`: `getlocalDateTime`، `getServerName`، `cancel`.
- وحدة `tenant.views.crs.agreements.darbsDetailModal`: `getlocalDateTime`، `getServerName`، `cancel`.
- وحدة `tenant.views.crs.agreements.parkingDetailModal`: `getlocalDateTime`، `getServerName`، `cancel`.
- وحدة `tenant.views.crs.agreements.finesDetailModal`: `getlocalDateTime`، `ignoreFine`، `cancel`.
- وحدة `tenant.views.crs.vouchers.invoices.viewModal`: `localize`، `rounding`، `cancel`، `chargesTypeVoucherLine`، `getColspan`، `chargesTypeVoucherLineRepeat`، `currencyAndRounding`، `roundingforView`، `uploadDocument`، `getOriginalName`، `sumPerTrip`، `moduleChanged`، `sumTaxPerTrip`، `openViewAllocationsModal`.
- وحدة `tenant.views.crs.vouchers.payments.createOrEditModal`: `searchVehicles`، `searchContactGeneralPayment`، `searchJobs`، `rounding`، `localize`، `onCustomerSelect`، `onCustomerSelectForAgreement`، `onAgreementSelect`، `getOriginalName`، `uploader.onSuccessItem`، `uploader.onErrorItem`، `uploadDocument`، `insertDueAmountOnClick`، `searchAdditionalDriverPopoup`، `conversionRateChanged`، `customerCurrencyChanged`، `customerCurrencyChangedForEdit`، `paymentTypeChanged`، `accountChanged`، `accountChangedForImport`، `accountChangedGeneralPayment`، `accountChangedGeneralPaymentEdit`، `onContactChange`، `amountChanged`، `searchAgreements`، `searchContactForSubLookUp`، `searchContact`، `onPaidToSelect`، `searchAssignToEmployeePopoup`، `searchAccounts`، `getPayrolls`، `filterPayrolls`، `onBusinessUnitChange`، `onPayrollChange`، `viewPayrollById`، `openAdvanceOrLoanPaymentModal`، `updateAmountFromPayroll`، `payrollTypes`، `searchVehicles`، `sumAmountTax`، `searchPrepaidExpense`، `sumAmountExpensePaymentReverse`، `sumAmount`، `currencyCodeChangedOnPaymentMethod`، `sumAmountAllocation`، `getlocalDateTime`، `searchItems`، `calculateItemPrice`، `getUnitOfMeasures`، `calculateTaxPerRow`، `searchContactPopoup`، `searchVehiclePopup`، `addRow`، `removeRow`، `cancel`، `save`، `removeDocument`، `checkCurrentDate`، `branchTaxCode`، `setTaxPercentOnTaxCode`، `loadCostCenterInLine`.
- وحدة `tenant.views.crs.discountCodes.applyDiscountModal`: `calculateDiscountedRate`، `calculateDiscountedPercentage`، `verifyAuthCode`، `applyDiscount`.
- وحدة `tenant.views.crs.discountCodes.applyDiscountModal`: `calculateDiscountedRate`، `calculateDiscountedPercentage`، `verifyAuthCode`، `getBranchWiseDiscount`، `applyDiscount`.
- وحدة `tenant.views.crs.agreements.expiredDocOutStandingBalanceModal`: `getlocalDate`، `cancel`، `rounding`، `getDocumentType`.
- وحدة `tenant.views.crs.vehicles.searchVehicleModal`: `statusChanged`، `searchModel`، `cancel`، `clearInput`، `clearVehicle`، `getlocalDateTime`، `fromDateTimeChanged`، `searchVehicles`، `searchVehiclesFilters`، `exportToExcelByAgreement`، `vehicleSelected`، `getBookingDate`، `getTeriffGroups`.
- وحدة `tenant.views.crs.vehicles.addExternalVehicle`: `localize`، `cancel`، `searchModel`، `getTeriffGroups`، `searchSupplier`، `save`.
- وحدة `tenant.views.crs.contacts.searchContactOptionModal`: `searchContacts`، `cancel`، `showAddContact`، `contactSelected`، `contactEdit`، `getContactsList`، `getNameWithCode`.
- وحدة `tenant.views.crs.contacts.searchSagX3ContactModal`: `searchContacts`، `cancel`، `contactSelected`.
- وحدة `tenant.views.crs.agreements.driverChargesModal`: `boxTicked`، `cancel`، `applyChange`، `saveDriverCharges`.
- وحدة `tenant.views.common.authorizationCodes.verifyAuthCodeModal`: `cancel`، `rounding`، `verify`.
- وحدة `tenant.views.crs.agreements.agreementAdvanceAndDeposit`: `uploadDocument`، `uploadAdvanceDocument`، `removeDocument`، `removeAdvanceDocument`، `getOriginalName`، `amountChanged`، `amountChangedDeposit`، `customerCurrencyChanged`، `amountWithoutCommissionChanged`، `cancel`، `calculateCreditCardCommission`، `conversionRateChanged`، `onCustomerSelect`، `ok`، `dateNullOrNot`.
- وحدة `tenant.views.crs.vouchers.invoices.generateFineModal`: `getlocalDateTime`، `allBoxTicked`، `nextSearch`، `previousAgreement`، `nextAgreement`، `previousInvoice`، `finishInvoice`، `cancel`، `searchFines`، `getlocalDate`، `showFinesOnVehicleReplacement`، `ignoreFine`، `generateInvoice`، `addMissingFine`، `callbackOnComplete`، `showError`، `sendCaptcha`، `focusWindow`، `closeAllTabs`، `ok`.
- وحدة `tenant.views.crs.vehicles.updateMileageAlertModal`: `cancel`، `save`.
- وحدة `tenant.views.crs.vouchers.deposits.uploadDocumentsModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.crs.vouchers.deposits.printTemplates.printPreview`: `cancel`، `getTemplateUrl`.
- وحدة `tenant.views.crs.vouchers.invoices.generateAdvanceTaxModal`: `rounding`، `chargesTypeVoucherLine`، `getColspan`، `chargesTypeVoucherLineRepeat`، `searchRentalOrLeaseAgreement`، `localize`، `cancel`، `depositSelected`، `amountChanged`، `getlocalDateTime`، `branchTaxCode`، `onCustomerSelect`، `searchCustomers`، `searchAdvanceReceipts`، `searchAccounts`، `searchCustomerPopoup`، `uploadDocument`، `getOriginalName`، `save`، `calculateCreditAndTax`، `sumAmount`، `rounding`، `rounding`، `setTaxPercentOnTaxCode`، `calculateTaxPerRow`، `rounding`، `sumAmountTax`، `rounding`، `addRow`، `removeDocument`، `getVehicleMakeName`.
- وحدة `tenant.views.crs.vouchers.receipts.printTemplates.printPreview`: `cancel`، `getTemplateUrl`.
- وحدة `tenant.views.crs.vouchers.receipts.uploadDocumentsModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.crs.contacts.uploadDocumentModal`: `save`، `cancel`.
- وحدة `tenant.views.crs.contacts.uploadDocumentModal`: `save`، `cancel`.
- وحدة `tenant.views.common.documents.uploadImageModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.crs.agreements.uploadAgreementDocumentModal`: `save`، `cancel`، `uploader.onSuccessItem`.
- وحدة `tenant.views.common.documents.uploadDocumentModal`: `uploadHeader`، `uploader.onBeforeUploadItem`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.common.documents.addCreditCardModal`: `ab`، `cardNumberChanged`، `save`، `cancel`.
- وحدة `tenant.views.crs.companies.createOrUpdateDriverModal`: `getlocalDateTime`، `getCardType`، `removeRow`، `searchSalesPersons`، `searchSalesPersonPopoup`، `salesPersonSelected`، `getDocsByContactId`، `searchCustomLookup`، `scanDocument`، `openUploadDocument`، `addCreditCardRow`، `updateCreditCardRow`، `save`، `cancel`، `doesIdentityDoucmentExist`، `addIndentityDocument`، `getIdentificationDocumentType`، `removeIndentityDocument`، `searchCountries`، `searchCompany`، `emiratesDataReader`، `emiratesDataFieldManager`، `getTariffCards`، `isDocument`، `isFieldMondatory`، `isAdditionalFieldsEnabled`، `typeOfFeild`، `getAdvanceSettings`.
- وحدة `tenant.views.crs.vehicles.printDocumentModel`: `cancel`.
- وحدة `tenant.views.movements.uploadDocument`: `save`، `cancel`، `uploader.onSuccessItem`.
- وحدة `tenant.views.crs.vouchers.invoices.uploadDocumentsModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.crs.vouchers.invoices.allocationsViewModel`: `cancel`، `sumAmount`، `localize`، `getlocalDate`.
- وحدة `tenant.views.crs.vouchers.payments.uploadDocumentsModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.fms.vehicleAssignments.searchOrganizationContactModal`: `contactSelected`، `organizationSelected`، `cancel`.
- وحدة `tenant.views.common.hrm.payrolls.viewModal`: `showSalaryType`، `cancel`، `rounding`.
- وحدة `tenant.views.common.hrm.deduction.createOrEditModal`: `cancel`، `getLocalize`، `searchStaff`، `searchVoucher`، `onVoucherSelect`، `rounding`، `getStatusTypes`، `getDeductionEmiStatus`، `searchStaffPopoup`، `onStaffSelect`، `opendeductionLineModal`، `save`.
- وحدة `tenant.views.crs.vouchers.payments.printTemplates.printPreview`: `cancel`، `getTemplateUrl`.
- وحدة `tenant.views.crs.discountCodes.verifyAuthCodeModal`: `cancel`، `verifyCode`.
- وحدة `tenant.views.crs.vouchers.invoices.addMissingFineModal`: `clearCustomer`، `searchVehicles`، `vehicleChanged`، `localize`، `searchCustomers`، `searchCustomerPopoup`، `save`، `cancel`.
- وحدة `tenant.views.fms.organizationChart.createOrEditUnitModal`: `save`، `cancel`.
- وحدة `tenant.views.common.hrm.deduction.deductionPayrollLineModal`: `searchReceiptVoucher`، `onVoucherKeyPress`، `getlocalDate`، `save`، `cancel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.commonLookup.searchContact` | POST | api/services/app/commonLookup/SearchContact | [المصدر](../../../raw/application.js#L142601) |
| `abp.services.app.vehicleModel.searchPreUsedVehicleModels` | POST | api/services/app/vehicleModel/SearchPreUsedVehicleModels | [المصدر](../../../raw/application.js#L142738) |
| `abp.services.app.directory.search` | POST | api/services/app/directory/Search | [المصدر](../../../raw/application.js#L342377) |
| `abp.services.app.directory.searchSalesPerson` | POST | api/services/app/directory/SearchSalesPerson | [المصدر](../../../raw/application.js#L142823) |
| `abp.services.app.saleOrigin.getSaleOrigins` | POST | api/services/app/saleOrigin/GetSaleOrigins | [المصدر](../../../raw/application.js#L137625) |
| `abp.services.app.agreementGroup.getAgreementGroups` | POST | api/services/app/agreementGroup/GetAgreementGroups | [المصدر](../../../raw/application.js#L137631) |
| `abp.services.app.directory.searchByContactGroup` | POST | api/services/app/directory/SearchByContactGroup | [المصدر](../../../raw/application.js#L371614) |
| `abp.services.app.customerProject.getCustomerProject` | POST | api/services/app/customerProject/GetCustomerProject | [المصدر](../../../raw/application.js#L137165) |
| `abp.services.app.agreementSMS.sendAgreementOpenWhatsAppSMSManual` | POST | api/services/app/agreementSMS/SendAgreementOpenWhatsAppSMSManual | [المصدر](../../../raw/application.js#L143383) |
| `abp.services.app.agreementSMS.sendAgreementCloseWhatsAppSMSManual` | POST | api/services/app/agreementSMS/SendAgreementCloseWhatsAppSMSManual | [المصدر](../../../raw/application.js#L143398) |
| `abp.services.app.rentalAgreementExport.exportToExcelNormalView` | POST | api/services/app/rentalAgreementExport/ExportToExcelNormalView | [المصدر](../../../raw/application.js#L143434) |
| `abp.services.app.agreement.manuallySendOpeningAgreementEmail` | POST | api/services/app/agreement/ManuallySendOpeningAgreementEmail | [المصدر](../../../raw/application.js#L143485) |
| `abp.services.app.agreement.manuallySendClosingAgreementEmail` | POST | api/services/app/agreement/ManuallySendClosingAgreementEmail | [المصدر](../../../raw/application.js#L143499) |
| `abp.services.app.rentalAgreementExport.exportToExcelView` | POST | api/services/app/rentalAgreementExport/ExportToExcelView | [المصدر](../../../raw/application.js#L143542) |
| `abp.services.app.agreement.getAgreementDocumentsForEdit` | POST | api/services/app/agreement/GetAgreementDocumentsForEdit | [المصدر](../../../raw/application.js#L135469) |
| `abp.services.app.agreement.uncloseAgreement` | POST | api/services/app/agreement/UncloseAgreement | [المصدر](../../../raw/application.js#L144102) |
| `abp.services.app.user.searchUsers` | POST | api/services/app/user/SearchUsers | [المصدر](../../../raw/application.js#L144113) |
| `abp.services.app.chargesSetting.getChargesSettings` | POST | api/services/app/chargesSetting/GetChargesSettings | [المصدر](../../../raw/application.js#L144122) |
| `abp.services.app.rentalAgreementSearch.agreementsGridView` | POST | api/services/app/rentalAgreementSearch/AgreementsGridView | [المصدر](../../../raw/application.js#L144249) |
| `abp.services.app.agreement.deleteAgreement` | POST | api/services/app/agreement/DeleteAgreement | [المصدر](../../../raw/application.js#L144297) |
| `abp.services.app.agreement.voidAgreement` | POST | api/services/app/agreement/VoidAgreement | [المصدر](../../../raw/application.js#L144313) |
| `abp.services.app.commonLookup.getLocationsActiveAndInActive` | POST | api/services/app/commonLookup/GetLocationsActiveAndInActive | [المصدر](../../../raw/application.js#L179440) |
| `abp.services.app.booking.sendEmailForBookingPayment` | POST | api/services/app/booking/SendEmailForBookingPayment | [المصدر](../../../raw/application.js#L102751) |
| `abp.services.app.invoice.sendEmailForInvoicePayment` | POST | api/services/app/invoice/SendEmailForInvoicePayment | [المصدر](../../../raw/application.js#L102761) |
| `abp.services.app.booking.silentPayment` | POST | api/services/app/booking/SilentPayment | [المصدر](../../../raw/application.js#L102934) |
| `abp.services.app.invoice.silentPayment` | POST | api/services/app/invoice/SilentPayment | [المصدر](../../../raw/application.js#L102942) |
| `abp.services.app.rentalQuotation.silentPayment` | POST | api/services/app/rentalQuotation/SilentPayment | [المصدر](../../../raw/application.js#L102957) |
| `abp.services.app.commonLookup.getLocations` | POST | api/services/app/commonLookup/GetLocations | [المصدر](../../../raw/application.js#L180573) |
| `abp.services.app.agreement.updateSalesPerson` | POST | api/services/app/agreement/UpdateSalesPerson | [المصدر](../../../raw/application.js#L141485) |
| `abp.services.app.directory.searchSalesPersonWithDesignation` | POST | api/services/app/directory/SearchSalesPersonWithDesignation | [المصدر](../../../raw/application.js#L149485) |
| `abp.services.app.staff.getStaffForEdit` | POST | api/services/app/staff/GetStaffForEdit | [المصدر](../../../raw/application.js#L139097) |
| `abp.services.app.agreement.getAgreementWithAdvanceAndDepositForEdit` | POST | api/services/app/agreement/GetAgreementWithAdvanceAndDepositForEdit | [المصدر](../../../raw/application.js#L142299) |
| `abp.services.app.directory.searchCustomerPhoto` | POST | api/services/app/directory/SearchCustomerPhoto | [المصدر](../../../raw/application.js#L137823) |
| `abp.services.app.parkingTicket.getParkingTicket` | POST | api/services/app/parkingTicket/GetParkingTicket | [المصدر](../../../raw/application.js#L145561) |
| `abp.services.app.commonAgreement.getExcessKMsOnAgreement` | POST | api/services/app/commonAgreement/GetExcessKMsOnAgreement | [المصدر](../../../raw/application.js#L150484) |
| `abp.services.app.commonAgreement.getAgreementLogs` | POST | api/services/app/commonAgreement/GetAgreementLogs | [المصدر](../../../raw/application.js#L135530) |
| `abp.services.app.directory.getCustomerOutstandingBalance` | POST | api/services/app/directory/GetCustomerOutstandingBalance | [المصدر](../../../raw/application.js#L137905) |
| `abp.services.app.rentalAgreementSearch.getAgreementForView` | POST | api/services/app/rentalAgreementSearch/GetAgreementForView | [المصدر](../../../raw/application.js#L150530) |
| `abp.services.app.agreementAdditionalCharges.saveAdditionalRentalAgreementCharges` | POST | api/services/app/agreementAdditionalCharges/SaveAdditionalRentalAgreementCharges | [المصدر](../../../raw/application.js#L134127) |
| `abp.services.app.chargesSetting.getConfiguredChargesTypes` | POST | api/services/app/chargesSetting/GetConfiguredChargesTypes | [المصدر](../../../raw/application.js#L387052) |
| `abp.services.app.agreementAdditionalCharges.getAdditionalAgreementCharges` | POST | api/services/app/agreementAdditionalCharges/GetAdditionalAgreementCharges | [المصدر](../../../raw/application.js#L134157) |
| `abp.services.app.agreementSaleOrder.searchSaleOrdersForAgreement` | POST | api/services/app/agreementSaleOrder/SearchSaleOrdersForAgreement | [المصدر](../../../raw/application.js#L133960) |
| `abp.services.app.agreementSaleOrder.updateSaleOrdersForAgreement` | POST | api/services/app/agreementSaleOrder/UpdateSaleOrdersForAgreement | [المصدر](../../../raw/application.js#L133967) |
| `abp.services.app.agreementSaleOrder.getAgreementSaleOrders` | POST | api/services/app/agreementSaleOrder/GetAgreementSaleOrders | [المصدر](../../../raw/application.js#L133979) |
| `abp.services.app.commonAgreement.getAgreement` | POST | api/services/app/commonAgreement/GetAgreement | [المصدر](../../../raw/application.js#L372737) |
| `abp.services.app.receiptSearch.getReceivedVouchersByAgreementId` | POST | api/services/app/receiptSearch/GetReceivedVouchersByAgreementId | [المصدر](../../../raw/application.js#L135647) |
| `abp.services.app.refund.getRefundsByAgreementId` | POST | api/services/app/refund/GetRefundsByAgreementId | [المصدر](../../../raw/application.js#L135658) |
| `abp.services.app.commonLookup.searchGooglePlaces` | POST | api/services/app/commonLookup/SearchGooglePlaces | [المصدر](../../../raw/application.js#L148814) |
| `abp.services.app.tariffCard.getActiveTariffCardsPeriodWise` | POST | api/services/app/tariffCard/GetActiveTariffCardsPeriodWise | [المصدر](../../../raw/application.js#L137218) |
| `abp.services.app.tariffCard.getTariffCardById` | POST | api/services/app/tariffCard/GetTariffCardById | [المصدر](../../../raw/application.js#L180067) |
| `abp.services.app.vehicle.searchVehicles` | POST | api/services/app/vehicle/SearchVehicles | [المصدر](../../../raw/application.js#L342298) |
| `abp.services.app.directory.searchSalesPersonActiveOne` | POST | api/services/app/directory/SearchSalesPersonActiveOne | [المصدر](../../../raw/application.js#L137606) |
| `abp.services.app.directory.searchPersonStaffCustomer` | POST | api/services/app/directory/SearchPersonStaffCustomer | [المصدر](../../../raw/application.js#L137735) |
| `abp.services.app.currency.getCurrencies` | POST | api/services/app/currency/GetCurrencies | [المصدر](../../../raw/application.js#L134369) |
| `abp.services.app.commonLookup.getCurrencies` | POST | api/services/app/commonLookup/GetCurrencies | [المصدر](../../../raw/application.js#L372716) |
| `abp.services.app.rentalQuotation.getQuotationsByContactId` | POST | api/services/app/rentalQuotation/GetQuotationsByContactId | [المصدر](../../../raw/application.js#L137971) |
| `abp.services.app.commonLookup.getLocationById` | POST | api/services/app/commonLookup/GetLocationById | [المصدر](../../../raw/application.js#L346276) |
| `abp.services.app.directory.searchForCompany` | POST | api/services/app/directory/SearchForCompany | [المصدر](../../../raw/application.js#L138144) |
| `abp.services.app.agreementSaleOrder.getAgreementSaleOrdersByContactId` | POST | api/services/app/agreementSaleOrder/GetAgreementSaleOrdersByContactId | [المصدر](../../../raw/application.js#L138188) |
| `abp.services.app.rentalQuotation.getQuotationForEdit` | POST | api/services/app/rentalQuotation/GetQuotationForEdit | [المصدر](../../../raw/application.js#L138198) |
| `abp.services.app.accident.checkRepeatedAccidentsOnDriver` | POST | api/services/app/accident/CheckRepeatedAccidentsOnDriver | [المصدر](../../../raw/application.js#L138254) |
| `abp.services.app.commonLookup.validateCreditLimit` | POST | api/services/app/commonLookup/ValidateCreditLimit | [المصدر](../../../raw/application.js#L180328) |
| `abp.services.app.agreement.createOrUpdateAgreement` | POST | api/services/app/agreement/CreateOrUpdateAgreement | [المصدر](../../../raw/application.js#L138749) |
| `abp.services.app.agreement.advanceInvoiceOnCreation` | POST | api/services/app/agreement/AdvanceInvoiceOnCreation | [المصدر](../../../raw/application.js#L142019) |
| `abp.services.app.vehicleAlerts.getServiceAlertForVehicle` | POST | api/services/app/vehicleAlerts/GetServiceAlertForVehicle | [المصدر](../../../raw/application.js#L138725) |
| `abp.services.app.commonLookup.getUser` | POST | api/services/app/commonLookup/GetUser | [المصدر](../../../raw/application.js#L139120) |
| `abp.services.app.agreementGroup.getDefaultGroupId` | POST | api/services/app/agreementGroup/GetDefaultGroupId | [المصدر](../../../raw/application.js#L139192) |
| `abp.services.app.agreement.changeDeliveryDate` | POST | api/services/app/agreement/ChangeDeliveryDate | [المصدر](../../../raw/application.js#L135685) |
| `abp.services.app.agreement.getAgreement` | POST | api/services/app/agreement/GetAgreement | [المصدر](../../../raw/application.js#L135702) |
| `abp.services.app.invoice.generatFineInvoiceByAgreementId` | POST | api/services/app/invoice/GeneratFineInvoiceByAgreementId | [المصدر](../../../raw/application.js#L136089) |
| `abp.services.app.agreement.closeAgreement` | POST | api/services/app/agreement/CloseAgreement | [المصدر](../../../raw/application.js#L136200) |
| `abp.services.app.rentalAgreementSearch.getAgreementForClosing` | POST | api/services/app/rentalAgreementSearch/GetAgreementForClosing | [المصدر](../../../raw/application.js#L136357) |
| `abp.services.app.toll.prepareDataForExtension` | POST | api/services/app/toll/PrepareDataForExtension | [المصدر](../../../raw/application.js#L149033) |
| `abp.services.app.uaeFine.getTrafficFilesOnVehicles` | POST | api/services/app/uaeFine/GetTrafficFilesOnVehicles | [المصدر](../../../raw/application.js#L146694) |
| `abp.services.app.toll.getTolls` | POST | api/services/app/toll/GetTolls | [المصدر](../../../raw/application.js#L141214) |
| `abp.services.app.uaeFine.getFines` | POST | api/services/app/uaeFine/GetFines | [المصدر](../../../raw/application.js#L142511) |
| `abp.services.app.parkingTicket.getParkingTicketOnClosingAgreement` | POST | api/services/app/parkingTicket/GetParkingTicketOnClosingAgreement | [المصدر](../../../raw/application.js#L136950) |
| `abp.services.app.agreement.preCloseAgreement` | POST | api/services/app/agreement/PreCloseAgreement | [المصدر](../../../raw/application.js#L146291) |
| `abp.services.app.rentalAgreementSearch.getAgreementForPreClosing` | POST | api/services/app/rentalAgreementSearch/GetAgreementForPreClosing | [المصدر](../../../raw/application.js#L146431) |
| `abp.services.app.coupon.createOrUpdateCoupon` | POST | api/services/app/coupon/CreateOrUpdateCoupon | [المصدر](../../../raw/application.js#L186149) |
| `abp.services.app.luckyDraw.search` | POST | api/services/app/luckyDraw/Search | [المصدر](../../../raw/application.js#L186203) |
| `abp.services.app.coupon.getCouponForEdit` | POST | api/services/app/coupon/GetCouponForEdit | [المصدر](../../../raw/application.js#L186217) |
| `abp.services.app.agreementReplacement.replaceVehicle` | POST | api/services/app/agreementReplacement/ReplaceVehicle | [المصدر](../../../raw/application.js#L148212) |
| `abp.services.app.commonLookup.getReplacementReasons` | POST | api/services/app/commonLookup/GetReplacementReasons | [المصدر](../../../raw/application.js#L148244) |
| `abp.services.app.agreement.addDeliveryMovement` | غير مربوط | غير محسوم | [المصدر](../../../raw/application.js#L141349) |
| `abp.services.app.replacementReason.getReplacementReasons` | POST | api/services/app/replacementReason/GetReplacementReasons | [المصدر](../../../raw/application.js#L141366) |
| `abp.services.app.commonAgreement.updateFuelRate` | POST | api/services/app/commonAgreement/UpdateFuelRate | [المصدر](../../../raw/application.js#L141378) |
| `abp.services.app.agreementReplacement.replaceDriver` | POST | api/services/app/agreementReplacement/ReplaceDriver | [المصدر](../../../raw/application.js#L148010) |
| `abp.services.app.commonAgreement.getAgreementForDriverReplacement` | POST | api/services/app/commonAgreement/GetAgreementForDriverReplacement | [المصدر](../../../raw/application.js#L148033) |
| `abp.services.app.agreement.extendCutShortAgreement` | POST | api/services/app/agreement/ExtendCutShortAgreement | [المصدر](../../../raw/application.js#L142010) |
| `abp.services.app.trafficFile.getTrafficFiles` | POST | api/services/app/trafficFile/GetTrafficFiles | [المصدر](../../../raw/application.js#L348984) |
| `abp.services.app.directory.searchSalesPersonOne` | POST | api/services/app/directory/SearchSalesPersonOne | [المصدر](../../../raw/application.js#L179720) |
| `abp.services.app.rentalAgreementSearch.getAgreementForUpgrade` | POST | api/services/app/rentalAgreementSearch/GetAgreementForUpgrade | [المصدر](../../../raw/application.js#L149659) |
| `abp.services.app.agreement.upgradeOrDowngradeAgreement` | POST | api/services/app/agreement/UpgradeOrDowngradeAgreement | [المصدر](../../../raw/application.js#L149791) |
| `abp.services.app.billingMethod.getDefaultCreditCard` | POST | api/services/app/billingMethod/GetDefaultCreditCard | [المصدر](../../../raw/application.js#L386977) |
| `abp.services.app.deposit.createDepositForAgreement` | POST | api/services/app/deposit/CreateDepositForAgreement | [المصدر](../../../raw/application.js#L338766) |
| `abp.services.app.deposit.createDepositWithChargeForAgreement` | POST | api/services/app/deposit/CreateDepositWithChargeForAgreement | [المصدر](../../../raw/application.js#L338783) |
| `abp.services.app.billingMethod.getBillingMethods` | POST | api/services/app/billingMethod/GetBillingMethods | [المصدر](../../../raw/application.js#L134491) |
| `abp.services.app.commonLookup.getBankAccountsForSelection` | POST | api/services/app/commonLookup/GetBankAccountsForSelection | [المصدر](../../../raw/application.js#L134545) |
| `abp.services.app.deposit.getDepositForEdit` | POST | api/services/app/deposit/GetDepositForEdit | [المصدر](../../../raw/application.js#L338884) |
| `abp.services.app.commonLookup.getContactCards` | POST | api/services/app/commonLookup/GetContactCards | [المصدر](../../../raw/application.js#L386984) |
| `abp.services.app.account.searchAccountsForSubLookUp` | POST | api/services/app/account/SearchAccountsForSubLookUp | [المصدر](../../../raw/application.js#L346376) |
| `abp.services.app.job.searchJobs` | POST | api/services/app/job/SearchJobs | [المصدر](../../../raw/application.js#L387128) |
| `abp.services.app.allocation.getAllocationsForEdit` | POST | api/services/app/allocation/GetAllocationsForEdit | [المصدر](../../../raw/application.js#L372574) |
| `abp.services.app.receiptChargesAllocation.getReceiptChargesAllocationsForAgreementEdit` | POST | api/services/app/receiptChargesAllocation/GetReceiptChargesAllocationsForAgreementEdit | [المصدر](../../../raw/application.js#L387987) |
| `abp.services.app.commonAgreement.getAllAgreementsOnCustomer` | POST | api/services/app/commonAgreement/GetAllAgreementsOnCustomer | [المصدر](../../../raw/application.js#L370752) |
| `abp.services.app.receiptSearch.getReceiptForEdit` | POST | api/services/app/receiptSearch/GetReceiptForEdit | [المصدر](../../../raw/application.js#L388043) |
| `abp.services.app.receipt.createOrUpdateReceipt` | POST | api/services/app/receipt/CreateOrUpdateReceipt | [المصدر](../../../raw/application.js#L388363) |
| `abp.services.app.receipt.createOrUpdateReceiptWithCharge` | POST | api/services/app/receipt/CreateOrUpdateReceiptWithCharge | [المصدر](../../../raw/application.js#L388423) |
| `abp.services.app.receipt.createOrUpdateReceiptPayment` | POST | api/services/app/receipt/CreateOrUpdateReceiptPayment | [المصدر](../../../raw/application.js#L388555) |
| `abp.services.app.allocation.getAllocationsForReceiptBaseOnAgreement` | POST | api/services/app/allocation/GetAllocationsForReceiptBaseOnAgreement | [المصدر](../../../raw/application.js#L387554) |
| `abp.services.app.directory.searchDirectoryPaged` | POST | api/services/app/directory/SearchDirectoryPaged | [المصدر](../../../raw/application.js#L184853) |
| `abp.services.app.agreement.getAgreementDocumentsSettings` | POST | api/services/app/agreement/GetAgreementDocumentsSettings | [المصدر](../../../raw/application.js#L135205) |
| `abp.services.app.agreement.deleteAgreementDocument` | POST | api/services/app/agreement/DeleteAgreementDocument | [المصدر](../../../raw/application.js#L135453) |
| `abp.services.app.agreement.saveAgreementDocuments` | POST | api/services/app/agreement/SaveAgreementDocuments | [المصدر](../../../raw/application.js#L135487) |
| `abp.services.app.commonAgreement.getPeriodWiseDiscountsByAgreementId` | POST | api/services/app/commonAgreement/GetPeriodWiseDiscountsByAgreementId | [المصدر](../../../raw/application.js#L134728) |
| `abp.services.app.commonAgreement.createOrUpdateAgreementDiscounts` | POST | api/services/app/commonAgreement/CreateOrUpdateAgreementDiscounts | [المصدر](../../../raw/application.js#L134755) |
| `abp.services.app.bankAccount.getBankAccountsForSelection` | POST | api/services/app/bankAccount/GetBankAccountsForSelection | [المصدر](../../../raw/application.js#L145656) |
| `abp.services.app.commonAgreement.createOrUpdatePaymentInstruction` | POST | api/services/app/commonAgreement/CreateOrUpdatePaymentInstruction | [المصدر](../../../raw/application.js#L145814) |
| `abp.services.app.commonAgreement.getPaymentInstructionsByAgreementId` | POST | api/services/app/commonAgreement/GetPaymentInstructionsByAgreementId | [المصدر](../../../raw/application.js#L145828) |
| `abp.services.app.movement.getMovementLogs` | POST | api/services/app/movement/GetMovementLogs | [المصدر](../../../raw/application.js#L449051) |
| `abp.services.app.chargesSetting.getChargesTypes` | POST | api/services/app/chargesSetting/GetChargesTypes | [المصدر](../../../raw/application.js#L179287) |
| `abp.services.app.commonLookup.searchCustomLookups` | POST | api/services/app/commonLookup/SearchCustomLookups | [المصدر](../../../raw/application.js#L180737) |
| `abp.services.app.commonLookup.getCustomLookups` | POST | api/services/app/commonLookup/GetCustomLookups | [المصدر](../../../raw/application.js#L182869) |
| `abp.services.app.country.searchCountries` | POST | api/services/app/country/SearchCountries | [المصدر](../../../raw/application.js#L181210) |
| `abp.services.app.person.createOrUpdatePerson` | POST | api/services/app/person/CreateOrUpdatePerson | [المصدر](../../../raw/application.js#L183236) |
| `abp.services.app.contactGroup.getContactGroupsOnContactType` | POST | api/services/app/contactGroup/GetContactGroupsOnContactType | [المصدر](../../../raw/application.js#L181124) |
| `abp.services.app.taxCode.getTaxCodes` | POST | api/services/app/taxCode/GetTaxCodes | [المصدر](../../../raw/application.js#L179267) |
| `abp.services.app.tariffCard.getActiveTariffCards` | POST | api/services/app/tariffCard/GetActiveTariffCards | [المصدر](../../../raw/application.js#L180054) |
| `abp.services.app.person.getAdvanceSettings` | POST | api/services/app/person/GetAdvanceSettings | [المصدر](../../../raw/application.js#L183744) |
| `abp.services.app.person.getHighLightBlackListCountry` | POST | [object Object] | [المصدر](../../../raw/application.js#L183768) |
| `abp.services.app.person.getNationalIdFormate` | POST | [object Object] | [المصدر](../../../raw/application.js#L183774) |
| `abp.services.app.person.getPersonForEdit` | POST | api/services/app/person/GetPersonForEdit | [المصدر](../../../raw/application.js#L183903) |
| `abp.services.app.person.getContactCards` | POST | api/services/app/person/GetContactCards | [المصدر](../../../raw/application.js#L181343) |
| `abp.services.app.directory.getDriverForCompany` | POST | [object Object] | [المصدر](../../../raw/application.js#L179552) |
| `abp.services.app.company.deleteCompanyDriver` | POST | [object Object] | [المصدر](../../../raw/application.js#L179593) |
| `abp.services.app.company.createOrUpdateCompany` | POST | api/services/app/company/CreateOrUpdateCompany | [المصدر](../../../raw/application.js#L179662) |
| `abp.services.app.designation.getDesignations` | POST | api/services/app/designation/GetDesignations | [المصدر](../../../raw/application.js#L180086) |
| `abp.services.app.company.getCompanyForEdit` | POST | api/services/app/company/GetCompanyForEdit | [المصدر](../../../raw/application.js#L180102) |
| `abp.services.app.company.getContactCards` | POST | api/services/app/company/GetContactCards | [المصدر](../../../raw/application.js#L180183) |
| `abp.services.app.company.getAdvanceSettings` | POST | api/services/app/company/GetAdvanceSettings | [المصدر](../../../raw/application.js#L180386) |
| `abp.services.app.industry.getIndustries` | POST | api/services/app/industry/GetIndustries | [المصدر](../../../raw/application.js#L180410) |
| `abp.services.app.company.getCompanyCustomField1` | POST | api/services/app/company/GetCompanyCustomField1 | [المصدر](../../../raw/application.js#L180419) |
| `abp.services.app.company.getCompanyCustomField2` | POST | api/services/app/company/GetCompanyCustomField2 | [المصدر](../../../raw/application.js#L180428) |
| `abp.services.app.company.getHighLightBlackListCountry` | POST | [object Object] | [المصدر](../../../raw/application.js#L180436) |
| `abp.services.app.company.getCompanyCustomField3` | POST | api/services/app/company/GetCompanyCustomField3 | [المصدر](../../../raw/application.js#L180441) |
| `abp.services.app.vehicleModel.searchVehicleModelsNew` | POST | api/services/app/vehicleModel/SearchVehicleModelsNew | [المصدر](../../../raw/application.js#L305950) |
| `abp.services.app.vehicle.getVehicleMovements` | POST | [object Object] | [المصدر](../../../raw/application.js#L316432) |
| `abp.services.app.vehicle.getAdvanceSettings` | POST | api/services/app/vehicle/GetAdvanceSettings | [المصدر](../../../raw/application.js#L316465) |
| `abp.services.app.vehicleAttachment.getVehicleAttachmentsByVehicle` | POST | api/services/app/vehicleAttachment/GetVehicleAttachmentsByVehicle | [المصدر](../../../raw/application.js#L316489) |
| `abp.services.app.vehicle.getVehicleForView` | POST | api/services/app/vehicle/GetVehicleForView | [المصدر](../../../raw/application.js#L316519) |
| `abp.services.app.agreementPrint.printReplacement` | POST | api/services/app/agreementPrint/PrintReplacement | [المصدر](../../../raw/application.js#L151387) |
| `abp.services.app.movement.getSupportingDocuments` | POST | api/services/app/movement/GetSupportingDocuments | [المصدر](../../../raw/application.js#L450453) |
| `abp.services.app.checkList.getVehicleTypeWiseCheckList` | POST | api/services/app/checkList/GetVehicleTypeWiseCheckList | [المصدر](../../../raw/application.js#L450504) |
| `abp.services.app.checkList.getCheckList` | POST | api/services/app/checkList/GetCheckList | [المصدر](../../../raw/application.js#L450518) |
| `abp.services.app.movement.updateMovement` | POST | api/services/app/movement/UpdateMovement | [المصدر](../../../raw/application.js#L448136) |
| `abp.services.app.movement.getMovement` | POST | api/services/app/movement/GetMovement | [المصدر](../../../raw/application.js#L450612) |
| `abp.services.app.uaeFine.ignoreFine` | POST | api/services/app/uaeFine/IgnoreFine | [المصدر](../../../raw/application.js#L348885) |
| `abp.services.app.costCenter.searchCostCenters` | POST | api/services/app/costCenter/SearchCostCenters | [المصدر](../../../raw/application.js#L372625) |
| `abp.services.app.asset.getAssetForEdit` | POST | api/services/app/asset/GetAssetForEdit | [المصدر](../../../raw/application.js#L365812) |
| `abp.services.app.limoTrip.getInvoiceTrips` | POST | api/services/app/limoTrip/GetInvoiceTrips | [المصدر](../../../raw/application.js#L365821) |
| `abp.services.app.invoiceSearch.getInvoiceForView` | POST | api/services/app/invoiceSearch/GetInvoiceForView | [المصدر](../../../raw/application.js#L365905) |
| `abp.services.app.tenantSettings.getExpenseAccountsAdvanceSetting` | POST | api/services/app/tenantSettings/GetExpenseAccountsAdvanceSetting | [المصدر](../../../raw/application.js#L370572) |
| `abp.services.app.job.searchJobDetails` | POST | api/services/app/job/SearchJobDetails | [المصدر](../../../raw/application.js#L370598) |
| `abp.services.app.payment.importFromExcel` | POST | [object Object] | [المصدر](../../../raw/application.js#L370811) |
| `abp.services.app.account.getStaffAccounts` | POST | api/services/app/account/GetStaffAccounts | [المصدر](../../../raw/application.js#L371571) |
| `abp.services.app.agreement.searchAgreementForVoucherLines` | POST | api/services/app/agreement/SearchAgreementForVoucherLines | [المصدر](../../../raw/application.js#L371606) |
| `abp.services.app.payroll.getPayrollsForPayment` | POST | api/services/app/payroll/GetPayrollsForPayment | [المصدر](../../../raw/application.js#L371666) |
| `abp.services.app.department.getDepartment` | POST | api/services/app/department/GetDepartment | [المصدر](../../../raw/application.js#L371673) |
| `abp.services.app.payment.getexpenseaccounts` | POST | api/services/app/payment/Getexpenseaccounts | [المصدر](../../../raw/application.js#L371869) |
| `abp.services.app.item.searchItems` | POST | api/services/app/item/SearchItems | [المصدر](../../../raw/application.js#L372198) |
| `abp.services.app.unitOfMeasure.getUnitOfMeasures` | POST | api/services/app/unitOfMeasure/GetUnitOfMeasures | [المصدر](../../../raw/application.js#L372216) |
| `abp.services.app.expenseType.getExpenseTypes` | POST | api/services/app/expenseType/GetExpenseTypes | [المصدر](../../../raw/application.js#L372351) |
| `abp.services.app.payment.createOrUpdatePayment` | POST | api/services/app/payment/CreateOrUpdatePayment | [المصدر](../../../raw/application.js#L372500) |
| `abp.services.app.payment.getPaymentForEdit` | POST | api/services/app/payment/GetPaymentForEdit | [المصدر](../../../raw/application.js#L372667) |
| `abp.services.app.commonLookup.getCurrenciesAll` | POST | api/services/app/commonLookup/GetCurrenciesAll | [المصدر](../../../raw/application.js#L134377) |
| `abp.services.app.userWiseDiscount.getBranchWiseUserDiscount` | POST | api/services/app/userWiseDiscount/GetBranchWiseUserDiscount | [المصدر](../../../raw/application.js#L201812) |
| `abp.services.app.directory.getExpiredDocumentAndOutStandingBalance` | POST | api/services/app/directory/GetExpiredDocumentAndOutStandingBalance | [المصدر](../../../raw/application.js#L141621) |
| `abp.services.app.vehicle.searchVehiclesPagedWorkShop` | POST | api/services/app/vehicle/SearchVehiclesPagedWorkShop | [المصدر](../../../raw/application.js#L312796) |
| `abp.services.app.vehicle.searchVehiclesPagedByAgreement` | POST | [object Object] | [المصدر](../../../raw/application.js#L312800) |
| `abp.services.app.vehicle.searchVehiclesPaged` | POST | api/services/app/vehicle/SearchVehiclesPaged | [المصدر](../../../raw/application.js#L312803) |
| `abp.services.app.vehicle.exportToExcelByAgreement` | POST | api/services/app/vehicle/ExportToExcelByAgreement | [المصدر](../../../raw/application.js#L312885) |
| `abp.services.app.commonLookup.getTariffGroups` | POST | api/services/app/commonLookup/GetTariffGroups | [المصدر](../../../raw/application.js#L305957) |
| `abp.services.app.vehicle.getNextFleetCode` | POST | api/services/app/vehicle/GetNextFleetCode | [المصدر](../../../raw/application.js#L305969) |
| `abp.services.app.directory.searchSagX3Contacts` | POST | api/services/app/directory/SearchSagX3Contacts | [المصدر](../../../raw/application.js#L185395) |
| `abp.services.app.company.createSagX3Contact` | POST | api/services/app/company/CreateSagX3Contact | [المصدر](../../../raw/application.js#L185442) |
| `abp.services.app.authorizationCode.verifyCode` | POST | api/services/app/authorizationCode/VerifyCode | [المصدر](../../../raw/application.js#L85555) |
| `abp.services.app.uaeFine.processFines` | POST | api/services/app/uaeFine/ProcessFines | [المصدر](../../../raw/application.js#L348778) |
| `abp.services.app.uaeFine.getPendingFines` | POST | api/services/app/uaeFine/GetPendingFines | [المصدر](../../../raw/application.js#L348860) |
| `abp.services.app.invoice.generateFineInvoices` | POST | api/services/app/invoice/GenerateFineInvoices | [المصدر](../../../raw/application.js#L348911) |
| `abp.services.app.vehicle.updateMileage` | POST | api/services/app/vehicle/UpdateMileage | [المصدر](../../../raw/application.js#L314576) |
| `abp.services.app.commonLookup.searchRentalOrLeaseAgreement` | POST | api/services/app/commonLookup/SearchRentalOrLeaseAgreement | [المصدر](../../../raw/application.js#L346203) |
| `abp.services.app.receipt.getAdvanceReceipts` | POST | api/services/app/receipt/GetAdvanceReceipts | [المصدر](../../../raw/application.js#L346346) |
| `abp.services.app.receipt.getAdvanceTaxReceipt` | POST | [object Object] | [المصدر](../../../raw/application.js#L346361) |
| `abp.services.app.invoice.createOrUpdateAdvanceTaxInvoice` | POST | api/services/app/invoice/CreateOrUpdateAdvanceTaxInvoice | [المصدر](../../../raw/application.js#L346448) |
| `abp.services.app.vehicleModel.getVehicleModels` | POST | api/services/app/vehicleModel/GetVehicleModels | [المصدر](../../../raw/application.js#L346739) |
| `abp.services.app.invoice.getInvoiceForEdit` | POST | api/services/app/invoice/GetInvoiceForEdit | [المصدر](../../../raw/application.js#L346755) |
| `abp.services.app.salesAgreement.getSalesAgreementForEdit` | POST | api/services/app/salesAgreement/GetSalesAgreementForEdit | [المصدر](../../../raw/application.js#L346763) |
| `abp.services.app.salesQuotation.getQuotationForEdit` | POST | api/services/app/salesQuotation/GetQuotationForEdit | [المصدر](../../../raw/application.js#L346820) |
| `abp.services.app.account.getAccount` | POST | api/services/app/account/GetAccount | [المصدر](../../../raw/application.js#L346904) |
| `abp.services.app.person.uploadDocumentImage` | POST | api/services/app/person/UploadDocumentImage | [المصدر](../../../raw/application.js#L185476) |
| `abp.services.app.agreement.saveAgreementDocument` | POST | api/services/app/agreement/SaveAgreementDocument | [المصدر](../../../raw/application.js#L149864) |
| `abp.services.app.company.createOrUpdateCopmanyDriver` | POST | api/services/app/company/CreateOrUpdateCopmanyDriver | [المصدر](../../../raw/application.js#L181019) |
| `abp.services.app.tariffCard.getTariffCards` | POST | api/services/app/tariffCard/GetTariffCards | [المصدر](../../../raw/application.js#L181246) |
| `abp.services.app.company.getAdvanceSettingsForDriver` | POST | api/services/app/company/GetAdvanceSettingsForDriver | [المصدر](../../../raw/application.js#L181282) |
| `abp.services.app.person.getDriverForEdit` | POST | api/services/app/person/GetDriverForEdit | [المصدر](../../../raw/application.js#L181326) |
| `abp.services.app.vehicle.getVehicleForEdit` | POST | api/services/app/vehicle/GetVehicleForEdit | [المصدر](../../../raw/application.js#L312225) |
| `abp.services.app.movement.addDocument` | POST | api/services/app/movement/AddDocument | [المصدر](../../../raw/application.js#L449951) |
| `abp.services.app.allocation.getAllocations` | POST | api/services/app/allocation/GetAllocations | [المصدر](../../../raw/application.js#L342588) |
| `abp.services.app.organizationChart.getOrganizationUnits` | POST | api/services/app/organizationChart/GetOrganizationUnits | [المصدر](../../../raw/application.js#L432892) |
| `abp.services.app.organizationChart.moveOrganizationUnit` | POST | api/services/app/organizationChart/MoveOrganizationUnit | [المصدر](../../../raw/application.js#L432955) |
| `abp.services.app.organizationChart.getOrganizationUnitAllUsers` | POST | api/services/app/organizationChart/GetOrganizationUnitAllUsers | [المصدر](../../../raw/application.js#L433187) |
| `abp.services.app.organizationChart.addUserToOrganizationUnit` | POST | api/services/app/organizationChart/AddUserToOrganizationUnit | [المصدر](../../../raw/application.js#L433107) |
| `abp.services.app.organizationChart.removeUserFromOrganizationUnit` | POST | api/services/app/organizationChart/RemoveUserFromOrganizationUnit | [المصدر](../../../raw/application.js#L433127) |
| `abp.services.app.organizationChart.isInOrganizationUnit` | POST | api/services/app/organizationChart/IsInOrganizationUnit | [المصدر](../../../raw/application.js#L433153) |
| `abp.services.app.payroll.getPayroll` | POST | api/services/app/payroll/GetPayroll | [المصدر](../../../raw/application.js#L100016) |
| `abp.services.app.deduction.getStaffAdvanceOrLoanPayments` | POST | [object Object] | [المصدر](../../../raw/application.js#L95716) |
| `abp.services.app.deduction.createOrUpdateDeduction` | POST | api/services/app/deduction/CreateOrUpdateDeduction | [المصدر](../../../raw/application.js#L95857) |
| `abp.services.app.salaryItemsSetting.getSalaryItemTypes` | POST | api/services/app/salaryItemsSetting/GetSalaryItemTypes | [المصدر](../../../raw/application.js#L95868) |
| `abp.services.app.payment.getSalaryItemTypes` | غير مربوط | غير محسوم | [المصدر](../../../raw/application.js#L95884) |
| `abp.services.app.deduction.getDeductionForEdit` | POST | api/services/app/deduction/GetDeductionForEdit | [المصدر](../../../raw/application.js#L95903) |
| `abp.services.app.discountAuthCode.verifyCode` | POST | api/services/app/discountAuthCode/VerifyCode | [المصدر](../../../raw/application.js#L202257) |
| `abp.services.app.trafficFine.getMovementOnVehicle` | POST | api/services/app/trafficFine/GetMovementOnVehicle | [المصدر](../../../raw/application.js#L342313) |
| `abp.services.app.customer.getSurcharge` | POST | [object Object] | [المصدر](../../../raw/application.js#L342333) |
| `abp.services.app.trafficFine.createOrUpdateTrafficFine` | POST | api/services/app/trafficFine/CreateOrUpdateTrafficFine | [المصدر](../../../raw/application.js#L342413) |
| `abp.services.app.organizationChart.updateOrganizationUnit` | POST | api/services/app/organizationChart/UpdateOrganizationUnit | [المصدر](../../../raw/application.js#L430943) |
| `abp.services.app.organizationChart.createOrganizationUnit` | POST | api/services/app/organizationChart/CreateOrganizationUnit | [المصدر](../../../raw/application.js#L430950) |
| `abp.services.app.deduction.getReceiptVoucherForDeduction` | POST | api/services/app/deduction/GetReceiptVoucherForDeduction | [المصدر](../../../raw/application.js#L95995) |
| `abp.services.app.deduction.addCashDeductionPayrollLine` | POST | api/services/app/deduction/AddCashDeductionPayrollLine | [المصدر](../../../raw/application.js#L96060) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.Vouchers.Receipts.ImportAllocations`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.EmailLinkToCharge`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.ChargeCard`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.AgreementGroups`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.PreClose.EditPreClose`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.ReplaceVehicle`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.ReplaceDriver`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.Close`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.PreClose`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.Extend`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.CutShort`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.UnClose`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.Delete`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.Void`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.UpGrade`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.ManuallySendOpeningAgreementEmail`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.AgreementAdditionalCharges`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.AllActionsOnOtherBranchAgreements`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.ViewOtherBranchAgreements`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Receipts.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.ExtendCutShort`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.DeliveryMovement`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.CanOpenAgreementWithoutSaleOrderRental`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.CanChangeSalesPerson`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.CanUpdatePaymentInstructions`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.AgreementDiscountsPeriodWise`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.BillingHistory`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.ExportToExcel`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.ExportToExcelDetailed`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.CouponsAndLuckyDraw.Create`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Movements.EnableMovementEditing`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vehicles.View`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Movements.EnableMovementLogs`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.AgreementAdditionalCharges.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.AgreementAdditionalCharges.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.AgreementAdditionalCharges.Delete`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Payments.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.Edit.CanChangeRates`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.CanChangeFuelRate`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.Edit.EditLimitedRates`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.AllowKMsLimitandExcessEditable`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.CanChangeAdvanceAmount`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.AllowComplimentaryAgreement`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.CanChangeKMOut`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.CanChangeFuelOut`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.CanChangeChargesOnClosing`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.CanChangeOnlyRecurringCharges`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.CanChangeDiscount`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.PreClose.AllowLimitedUsersToEditOneTimeChargesOnPreClose`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Lease.Agreements.CanChangeKMOut`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Lease.Agreements.CanChangeFuelOut`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vehicles.Alerts`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Receipts.AllActionsOnOtherBranchReceipts`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Allocations`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Receipts.CanChangeDate`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Delete`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.AgreementDocuments.AddDocument`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.AgreementDocuments.EditDocument`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.AgreementDocuments.DeleteDocument`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.AgreementDiscountsPeriodWise.Add`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.AgreementDiscountsPeriodWise.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.AgreementDiscountsPeriodWise.Delete`: ممنوحة في السياق الملتقط.
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
- صلاحية `Pages.Tenant.Companies.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Companies.LimitedEdit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Integration.EInvoicingUAE`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Companies.CustomerApproval`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vehicles.AllActionsOnOtherBranchVehicles`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Invoices.MultiModalMiscInvoices`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Invoices.MarkDisputed`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Invoices.UnmarkDisputed`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Assets.Assets`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Payments.AllActionsOnOtherBranchPayments`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vehicles.ViewOtherBranchVehicles`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.SalesModule.SalesAgreement.GenerateDownPaymentReceipt`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.SalesModule.SalesQuotation.GenerateDownPaymentReceipt`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Administration.OrganizationUnits.ManageOrganizationTree`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Administration.OrganizationUnits.ManageMembers`: ممنوحة في السياق الملتقط.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.filters.agreementNo` | text |  |  |
| `vm.filters.manualAgreementNo` | text |  |  |
| `vm.filters.locationId` | select | locationId | ng-options=location.id as location.name for location in vm.locations |
| `vm.filters.pickupLocation` | text |  |  |
| `vm.filters.plateNo` | text |  |  |
| `vm.filters.permanentVehicle` | checkbox | PermanentVehicle_Rental |  |
| `vm.dateRangeModel` | text |  | min=vm.dateRangeOptions.min; max=vm.dateRangeOptions.max; ng-disabled=!vm.filters.enableDateRange |
| `vm.filters.enableDateRange` | checkbox | disableDateRange |  |
| `vm.filters.customer` | ui-select |  |  |
| `vm.filters.selectedStatus` | select |  | ng-options=status.id as status.name for status in vm.statuses |
| `vm.filters.agreementType` | select | agreementType | ng-options=item.id as item.type for item in vm.agreementTypes |
| `vm.filters.makeAndModel` | ui-select |  |  |
| `vm.filters.modelYear` | text |  |  |
| `vm.filters.masterAgreementNo` | text |  |  |
| `vm.filters.createdBy` | ui-select |  |  |
| `vm.filters.salesPerson` | ui-select |  |  |
| `vm.filters.salesPerson` | select | salePerson | ng-options=status as status.name for status in vm.userList |
| `vm.filters.insuranceCompany` | ui-select |  |  |
| `vm.filters.insuranceClaimNo` | text |  |  |
| `vm.filters.poNo` | text |  |  |
| `vm.filters.saleOrder` | text |  |  |
| `vm.filters.vehicleOwnership` | select | ownership | ng-options=ownership.value as ownership.key for ownership in vm.rentalAgreementOwnerships |
| `vm.filters.saleOrigin` | ui-select |  |  |
| `vm.selectComplimentaryOption` | ui-select |  |  |
| `vm.filters.agreementGroupId` | select |  | ng-options=ag.id as ag.name for ag in vm.agreementGroups |
| `vm.filters.projectName` | ui-select |  |  |
| `vm.filters.isOverDueClosing` | checkbox | IsOverDueClosing |  |
| `vm.filters.vehicleOwner` | ui-select |  |  |
| `vm.filters.vehicleCheckedInButAgreementDueToClose` | checkbox | VehicleCheckedInButAgreementDueToClose |  |
| `vm.filters.upgradeDownGrade` | checkbox | UpGradeDownGradeAgreements |  |
| `vm.filters.extendedAgreement` | checkbox | ExtendedAgreement |  |
| `vm.filters.printingWithoutLogo` | checkbox | printingWithoutLogo |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
