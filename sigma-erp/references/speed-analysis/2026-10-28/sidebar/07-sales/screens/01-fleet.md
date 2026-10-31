# شاشة: Fleet

المسار في القائمة: Sales ← Fleet.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_equipments`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0363](../../../readable/routes/R0363--tenant-crs-equipments.js)، والأصل [raw/application.js:4143](../../../raw/application.js#L4143).
- قالب الشاشة: `~/App/tenant/views/crs/equipmentSales/equipments/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.equipmentSales.equipments.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.equipmentSales.equipments.index](../../../readable/controllers/C0800--tenant.views.crs.equipmentSales.equipments.index.js) | 44 | 12 |
| [tenant.views.crs.contacts.searchContactModal](../../../readable/controllers/C0706--tenant.views.crs.contacts.searchContactModal.js) | 7 | 2 |
| [tenant.views.crs.vehicles.createOrShowVehicleLogsModal](../../../readable/controllers/C1167--tenant.views.crs.vehicles.createOrShowVehicleLogsModal.js) | 3 | 2 |
| [tenant.views.crs.vehicles.investorLogsModal](../../../readable/controllers/C1174--tenant.views.crs.vehicles.investorLogsModal.js) | 5 | 1 |
| [tenant.views.crs.agreements.viewAgreementsHistoryModal](../../../readable/controllers/C0552--tenant.views.crs.agreements.viewAgreementsHistoryModal.js) | 4 | 1 |
| [common.views.common.reportViewer](../../../readable/controllers/C0006--common.views.common.reportViewer.js) | 2 | 0 |
| [tenant.views.crs.vehicles.updateMileageAlertModal](../../../readable/controllers/C1194--tenant.views.crs.vehicles.updateMileageAlertModal.js) | 2 | 1 |
| [tenant.views.crs.vehicles.statusDetailModal](../../../readable/controllers/C1193--tenant.views.crs.vehicles.statusDetailModal.js) | 7 | 2 |
| [tenant.views.crs.equipmentSales.equipments.viewModal](../../../readable/controllers/C0802--tenant.views.crs.equipmentSales.equipments.viewModal.js) | 19 | 6 |
| [tenant.views.crs.vehicles.viewBookingModal](../../../readable/controllers/C1199--tenant.views.crs.vehicles.viewBookingModal.js) | 29 | 10 |
| [tenant.views.crs.vehicles.defleetModal](../../../readable/controllers/C1170--tenant.views.crs.vehicles.defleetModal.js) | 2 | 2 |
| [tenant.views.crs.vehicles.changeStatus](../../../readable/controllers/C1161--tenant.views.crs.vehicles.changeStatus.js) | 6 | 5 |
| [tenant.views.crs.vehicles.onfleetModal](../../../readable/controllers/C1176--tenant.views.crs.vehicles.onfleetModal.js) | 2 | 2 |
| [tenant.views.crs.equipmentSales.equipments.createOrEditModal](../../../readable/controllers/C0799--tenant.views.crs.equipmentSales.equipments.createOrEditModal.js) | 33 | 14 |
| [tenant.views.crs.vehicles.openDamageRevenueLedger](../../../readable/controllers/C1177--tenant.views.crs.vehicles.openDamageRevenueLedger.js) | 16 | 8 |
| [tenant.views.crs.tariffs.createOrEditModal](../../../readable/controllers/C1137--tenant.views.crs.tariffs.createOrEditModal.js) | 10 | 3 |
| [tenant.views.crs.contacts.createOrEditModal](../../../readable/controllers/C0703--tenant.views.crs.contacts.createOrEditModal.js) | 45 | 24 |
| [tenant.views.crs.vehicles.createOrShowInvestorLogsModal](../../../readable/controllers/C1166--tenant.views.crs.vehicles.createOrShowInvestorLogsModal.js) | 3 | 3 |
| [tenant.views.crs.vehicles.printDocumentModel](../../../readable/controllers/C1178--tenant.views.crs.vehicles.printDocumentModel.js) | 1 | 1 |
| [tenant.views.movements.viewModal](../../../readable/controllers/C1636--tenant.views.movements.viewModal.js) | 11 | 5 |
| [tenant.views.common.payments.silentPayment](../../../readable/controllers/C0412--tenant.views.common.payments.silentPayment.js) | 2 | 3 |
| [tenant.views.common.payments.emailLinkToCharge](../../../readable/controllers/C0410--tenant.views.common.payments.emailLinkToCharge.js) | 4 | 2 |
| [tenant.views.crs.vouchers.receipts.createOrEditModal](../../../readable/controllers/C1419--tenant.views.crs.vouchers.receipts.createOrEditModal.js) | 49 | 25 |
| [tenant.views.crs.bookings.createOrEditModal](../../../readable/controllers/C0662--tenant.views.crs.bookings.createOrEditModal.js) | 59 | 23 |
| [tenant.views.crs.bookings.viewModal](../../../readable/controllers/C0668--tenant.views.crs.bookings.viewModal.js) | 8 | 1 |
| [tenant.views.crs.bookings.confirmBooking](../../../readable/controllers/C0661--tenant.views.crs.bookings.confirmBooking.js) | 7 | 3 |
| [tenant.views.crs.agreements.createOrEditModal](../../../readable/controllers/C0530--tenant.views.crs.agreements.createOrEditModal.js) | 80 | 38 |
| [tenant.views.crs.bookings.printtemplates.printPreview](../../../readable/controllers/C0670--tenant.views.crs.bookings.printtemplates.printPreview.js) | 2 | 0 |
| [tenant.views.crs.vehicles.selectCheckList](../../../readable/controllers/C1188--tenant.views.crs.vehicles.selectCheckList.js) | 2 | 0 |
| [tenant.views.common.documents.uploadImageModal](../../../readable/controllers/C0363--tenant.views.common.documents.uploadImageModal.js) | 3 | 0 |
| [tenant.views.common.makes.createOrEditModal](../../../readable/controllers/C0401--tenant.views.common.makes.createOrEditModal.js) | 2 | 2 |
| [tenant.views.common.vehiclemodels.createOrEditModal](../../../readable/controllers/C0444--tenant.views.common.vehiclemodels.createOrEditModal.js) | 3 | 3 |
| [tenant.views.common.documents.uploadDocumentModal](../../../readable/controllers/C0362--tenant.views.common.documents.uploadDocumentModal.js) | 4 | 0 |
| [tenant.views.common.locations.searchContactModal](../../../readable/controllers/C0400--tenant.views.common.locations.searchContactModal.js) | 3 | 1 |
| [tenant.views.crs.contacts.uploadDocumentModal](../../../readable/controllers/C0699--tenant.views.crs.contacts.uploadDocumentModal.js) | 2 | 1 |
| [tenant.views.crs.contacts.uploadDocumentModal](../../../readable/controllers/C0711--tenant.views.crs.contacts.uploadDocumentModal.js) | 2 | 1 |
| [tenant.views.common.documents.addCreditCardModal](../../../readable/controllers/C0701--tenant.views.common.documents.addCreditCardModal.js) | 4 | 0 |
| [tenant.views.movements.uploadDocument](../../../readable/controllers/C1635--tenant.views.movements.uploadDocument.js) | 3 | 1 |
| [tenant.views.crs.vouchers.receipts.uploadDocumentsModal](../../../readable/controllers/C1430--tenant.views.crs.vouchers.receipts.uploadDocumentsModal.js) | 3 | 0 |
| [tenant.views.crs.vouchers.invoices.generateAdvanceTaxModal](../../../readable/controllers/C1318--tenant.views.crs.vouchers.invoices.generateAdvanceTaxModal.js) | 31 | 12 |
| [tenant.views.crs.vouchers.receipts.printTemplates.printPreview](../../../readable/controllers/C1433--tenant.views.crs.vouchers.receipts.printTemplates.printPreview.js) | 2 | 0 |
| [tenant.views.crs.bookings.uploadDocumentsModal](../../../readable/controllers/C0667--tenant.views.crs.bookings.uploadDocumentsModal.js) | 3 | 0 |
| [tenant.views.crs.contacts.searchContactOptionModal](../../../readable/controllers/C0707--tenant.views.crs.contacts.searchContactOptionModal.js) | 7 | 1 |
| [tenant.views.crs.vehicles.searchVehicleModal](../../../readable/controllers/C1186--tenant.views.crs.vehicles.searchVehicleModal.js) | 13 | 11 |
| [tenant.views.crs.vehicles.addExternalVehicle](../../../readable/controllers/C1158--tenant.views.crs.vehicles.addExternalVehicle.js) | 6 | 4 |
| [tenant.views.crs.agreements.agreementAdvanceAndDeposit](../../../readable/controllers/C0522--tenant.views.crs.agreements.agreementAdvanceAndDeposit.js) | 15 | 4 |
| [tenant.views.crs.discountCodes.applyDiscountModal](../../../readable/controllers/C0304--tenant.views.crs.discountCodes.applyDiscountModal.js) | 4 | 0 |
| [tenant.views.crs.discountCodes.applyDiscountModal](../../../readable/controllers/C0774--tenant.views.crs.discountCodes.applyDiscountModal.js) | 5 | 1 |
| [tenant.views.crs.agreements.expiredDocOutStandingBalanceModal](../../../readable/controllers/C0536--tenant.views.crs.agreements.expiredDocOutStandingBalanceModal.js) | 4 | 1 |
| [tenant.views.crs.contacts.searchSagX3ContactModal](../../../readable/controllers/C0710--tenant.views.crs.contacts.searchSagX3ContactModal.js) | 3 | 2 |
| [tenant.views.crs.agreements.driverChargesModal](../../../readable/controllers/C0534--tenant.views.crs.agreements.driverChargesModal.js) | 4 | 0 |
| [tenant.views.common.authorizationCodes.verifyAuthCodeModal](../../../readable/controllers/C0308--tenant.views.common.authorizationCodes.verifyAuthCodeModal.js) | 3 | 1 |
| [tenant.views.crs.agreements.printPreview](../../../readable/controllers/C0557--tenant.views.crs.agreements.printPreview.js) | 2 | 0 |
| [tenant.views.crs.vouchers.invoices.uploadDocumentsModal](../../../readable/controllers/C1355--tenant.views.crs.vouchers.invoices.uploadDocumentsModal.js) | 3 | 0 |
| [tenant.views.crs.vouchers.deposits.uploadDocumentsModal](../../../readable/controllers/C1300--tenant.views.crs.vouchers.deposits.uploadDocumentsModal.js) | 3 | 0 |
| [tenant.views.crs.discountCodes.verifyAuthCodeModal](../../../readable/controllers/C0778--tenant.views.crs.discountCodes.verifyAuthCodeModal.js) | 2 | 1 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.equipmentSales.equipments.index`: `CurrencyFormate`، `dateRangeModelChanged`، `purchaseDateRangeModelChanged`، `getlocalDate`، `isDateBefore`، `getFuelLevel`، `disbleDateRange`، `getVehicleValue`، `getOwnershipValue`، `localize`، `statusChanged`، `searchModel`، `searchvehicleOwners`، `searchvehicleOwnersPopoup`، `locationPermission`، `getMakeAndModel`، `getModelYear`، `getVehicleType`، `getOwnershipName`، `openVehicleLogsModal`، `openInvestorLogsModal`، `viewAgreementsHistoryModal`، `report`، `detailReport`، `updateMileage`، `openStatusDetailModal`، `clearVehicleOwner`، `stateChanged`، `enterKeyPress`، `getVehicles`، `clearModel`، `viewVehicle`، `viewBooking`، `defleetVehicle`، `changeVehicleStatus`، `onfleetVehicle`، `exportToExcel`، `vehicleDetailExportToExcel`، `damageRevenueLedger`، `createEquipment`، `editVehicle`، `deleteVehicle`، `getAccrissCode`، `defineTariff`.
- وحدة `tenant.views.crs.contacts.searchContactModal`: `searchContacts`، `cancel`، `showAddContact`، `contactSelected`، `contactEdit`، `getContactsList`، `getNameWithCode`.
- وحدة `tenant.views.crs.vehicles.createOrShowVehicleLogsModal`: `cancel`، `saveLog`، `getlocalDateTime`.
- وحدة `tenant.views.crs.vehicles.investorLogsModal`: `openVehicleLogsModal`، `getVehicleLogs`، `getlocalDate`، `getlocalDateTime`، `cancel`.
- وحدة `tenant.views.crs.agreements.viewAgreementsHistoryModal`: `getlocalDateTime`، `localize`، `cancel`، `getAgreementsHistory`.
- وحدة `common.views.common.reportViewer`: `exportToExcelFromReport`، `cancel`.
- وحدة `tenant.views.crs.vehicles.updateMileageAlertModal`: `cancel`، `save`.
- وحدة `tenant.views.crs.vehicles.statusDetailModal`: `getlocalDateTime`، `getlocalDate`، `localize`، `cancel`، `loadSubStatusforNrmandWorkshop`، `getMakeModelYear`، `exportToExcel`.
- وحدة `tenant.views.crs.equipmentSales.equipments.viewModal`: `getlocalDateTime`، `getVehicleExternalType`، `getChassisType`، `getVehicleWarrantyType`، `getWarrantyPeriod`، `getCostCenterGroup`، `getFuelLevel`، `openPrintModal`، `searchModel`، `getMovementStatus`، `viewMovement`، `searchTariffGroups`، `cancel`، `isAdditionalFieldsEnabled`، `isFieldMondatory`، `typeOfFeild`، `getAdvanceSettings`، `isDocument`، `isDocumentSepr`.
- وحدة `tenant.views.crs.vehicles.viewBookingModal`: `dateRangeModelChanged`، `isEnabled`، `locationPermission`، `getlocalDateTime`، `getlocalDate`، `clearCustomer`، `openSilentPaymentModal`، `getlocalizedString`، `emailLinkToCharge`، `addReceipt`، `exportToExcel`، `report`، `createBooking`، `viewBooking`، `editBooking`، `confirmBooking`، `cancel`، `searchCustomers`، `searchCustomerPopoup`، `getBookings`، `getBookingForEdit`، `cancelBooking`، `noShowBooking`، `openAgreement`، `deleteBooking`، `markCloseBooking`، `statusChanged`، `getReportUrl`، `printBooking`.
- وحدة `tenant.views.crs.vehicles.defleetModal`: `save`، `cancel`.
- وحدة `tenant.views.crs.vehicles.changeStatus`: `cancel`، `getCheckedItems`، `searchCustomers`، `openSelectCheckListModal`، `openUploadDocument`، `save`.
- وحدة `tenant.views.crs.vehicles.onfleetModal`: `cancel`، `save`.
- وحدة `tenant.views.crs.equipmentSales.equipments.createOrEditModal`: `warrantyPeriodSelection`، `getCostCenterGroup`، `removeRow`، `addRow`، `isVehicleExternalType`، `removewarrantyRow`، `addwarrantyRow`، `searchMake`، `searchModel`، `searchOwner`، `cancel`، `vehicleInsuranceDateAdd`، `vehicleRegistrationDateAdd`، `createMake`، `createVehicleModel`، `locationPermission`، `getTeriffGroups`، `getCostCenters`، `GetTypeOrOwnership`، `openUploadDocument`، `save`، `removeDocuments`، `openUploadDocumentModel`، `onExternalChange`، `isDocument`، `isDocumentSepr`، `isAdditionalFieldsEnabled`، `isFieldMondatory`، `typeOfFeild`، `getAdvanceSettings`، `getInsuranceCompanies`، `searchSuppliers`، `searchSupplierPopoup`.
- وحدة `tenant.views.crs.vehicles.openDamageRevenueLedger`: `formatNumber`، `rounding`، `cancel`، `setPrintDateTime`، `clearLocation`، `stateBranchPopoup`، `getlocalDate`، `getVoucherType`، `accountChanged`، `searchVehicles`، `searchAccounts`، `searchContact`، `clearContact`، `clearVehicle`، `getDamageRevenueLedger`، `exportToExcel`.
- وحدة `tenant.views.crs.tariffs.createOrEditModal`: `getlocalDateTime`، `getDateTariffCard`، `getTariffCards`، `localize`، `agreementTypeChanged`، `addTariffLine`، `removeTariffLine`، `save`، `cancel`، `tariffCardChanged`.
- وحدة `tenant.views.crs.contacts.createOrEditModal`: `localize`، `removeExternalIdRow`، `addExternalIdRow`، `getContactExternalType`، `isContactExternalType`، `getlocalDate`، `getlocalDateTime`، `getCardType`، `removeRow`، `searchSalesPersons`، `searchUsersWithDesignation`، `searchSalesPersonPopoup`، `salesPersonSelected`، `searchDebtCollectorPopoup`، `searchCustomLookup`، `getCustomLookups`، `scanDocument`، `openUploadDocument`، `openUploadPicture`، `addCreditCardRow`، `updateCreditCardRow`، `save`، `cancel`، `isPersonVerifiedChange`، `doesIdentityDoucmentExist`، `addIndentityDocument`، `getIdentificationDocumentType`، `removeIndentityDocument`، `removeDoc`، `isFieldMondatory`، `searchCountries`، `emiratesDataReader`، `emiratesDataFieldManager`، `getTariffCards`، `getTariffCardForContact`، `isDocument`، `maskCreditCard`، `getAdvanceSettings`، `getHighLightBlackListCountries`، `getNationalIdFormates`، `nationalIdFormate`، `onOverRideChange`، `resetDocumentNo`، `nationIdMaskInput`، `handleResidenceStatusChange`.
- وحدة `tenant.views.crs.vehicles.createOrShowInvestorLogsModal`: `save`، `searchInvestor`، `cancel`.
- وحدة `tenant.views.crs.vehicles.printDocumentModel`: `cancel`.
- وحدة `tenant.views.movements.viewModal`: `getWorkshopMovementTypes`، `getFuelLevel`، `geoLocationMap`، `getLocalize`، `cancel`، `setActiveTabIndex`، `getlocalDateTime`، `getChecklist`، `uploadDocument`، `getFieldLabel`، `isCustomFieldExists`.
- وحدة `tenant.views.common.payments.silentPayment`: `cancel`، `pay`.
- وحدة `tenant.views.common.payments.emailLinkToCharge`: `isOneTimePaymentOnChange`، `send`، `cancel`، `getlocalDateTime`.
- وحدة `tenant.views.crs.vouchers.receipts.createOrEditModal`: `localize`، `isEnabled`، `uploadDocument`، `getOriginalName`، `billingMethodSelected`، `receiptTypeChanged`، `dateNullOrNot`، `searchAccounts`، `addRow`، `removeRow`، `searchJobs`، `getReceiptTypeName`، `contactCardSelected`، `localize`، `rounding`، `amountChanged`، `amountWithoutCommissionChanged`، `sumAmountAllocationCharges`، `insertDueAmountOnClick`، `sumAmountAllocationChargesAgreement`، `sumTotalWithAllocation`، `calculateGeneralReceiptAmount`، `getlocalDateTime`، `getlocalDate`، `cancel`، `searchCustomers`، `searchContactGeneralPayment`، `onBillingMethodChange`، `calculateCreditCardCommission`، `calculateBankTransferCommission`، `searchVehicles`، `rounding`، `onCustomerSelect`، `onCustomerSelectForAgreement`، `conversionRateChanged`، `customerCurrencyChanged`، `customerCurrencyChangedForEdit`، `sumReceiptAmount`، `autoAllocation`، `sumAmount`، `searchCustomerPopoup`، `accountChangedGeneralPayment`، `moduleChanged`، `onAgreementSelect`، `openAdvanceTaxInvoiceModal`، `save`، `removeDocument`، `saveGeneralReceipt`، `checkCurrentDate`.
- وحدة `tenant.views.crs.bookings.createOrEditModal`: `searchGoogleLocations`، `rounding`، `otherPickUpLocationChanged`، `otherDropoffLocationChanged`، `localize`، `removeDocument`، `getOriginalName`، `uploadDocument`، `searchVehicles`، `searchSaleOrigin`، `searchStaff`، `searchUsersWithDesignation`، `driverSelected`، `searchDrivers`، `commonDriverSearch`، `searchDrivers`، `searchDriverPopoup`، `searchAdditionalDriverPopoup`، `clearAdditionalDriver`، `clearVehicle`، `searchAdditionalDrivers`، `changeStatusReceiptCreation`، `changeStatusDepositCreation`، `searchVehiclePopup`، `agreementTypeSelected`، `startDateChanged`، `endDateChanged`، `calculate`، `advanceOrDepositChanged`، `tariffGroupSelected`، `tariffOptionSelected`، `disableRate`، `searchCustomers`، `searchCustomerPopoup`، `addExternalVehiclePopup`، `searchDrivers`، `vehicleSelected`، `getTariffCards`، `getTariffCardForBooking`، `tariffCardSelected`، `onCustomerSelect`، `branchTaxCode`، `individualCustomerRadioSelected`، `searchDrivers`، `searchDrivers`، `searchDrivers`، `onVehicleSelect`، `save`، `applyDiscount`، `cancel`، `getTariffLocations`، `getTariffGroups`، `includedChanged`، `taxAcceptedChanged`، `showTaxCollectionReport`، `totalDaysAndTime`، `sendBookingEmail`، `printBooking`، `resetFields`.
- وحدة `tenant.views.crs.bookings.viewModal`: `rounding`، `roundingforView`، `localize`، `disableRate`، `cancel`، `getOriginalName`، `uploadDocument`، `totalDaysAndTime`.
- وحدة `tenant.views.crs.bookings.confirmBooking`: `localize`، `searchVehiclePopup`، `searchVehicles`، `onVehicleSelect`، `calculate`، `confirm`، `cancel`.
- وحدة `tenant.views.crs.agreements.createOrEditModal`: `searchProjects`، `getlocalDateTime`، `isQuotationMandatory`، `getDateTariffCard`، `searchGoogleLocations`، `agreementTypeChange`، `getTariffCards`، `getTariffCardForAgreement`، `localize`، `localizeChargesType`، `startDateChanged`، `shouldDisableRateOtherThanRent`، `shouldDisableRow`، `applyDiscount`، `agreementTypeSelected`، `updateEndDateTimeWithStartDate`، `restrictEndTime`، `onStartDateChanged`، `onEndDateChanged`، `searchVehicles`، `searchCustomers`، `searchUsersWithDesignation`، `salesPersonSelected`، `searchStaff`، `searchSaleOrigin`، `endDateChanged`، `searchCustomerPopoup`، `searchDrivers`، `searchSupplierContact`، `searchDriverPopoup`، `searchSupplierPopoup`، `driverChargesPopoup`، `clearAdditionalDriver`، `searchAdditionalDrivers`، `searchAdditionalDriverPopoup`، `tariffCardChanged`، `vehicleSelected`، `changesRegardingQuotationCharges`، `quotationSelected`، `splitChargesForBroker`، `calculateCount`، `openExpiredDocAndOutStandingBalanceModal`، `getOutStandingBalance`، `changeTariffBasedOnCustomerCurrency`، `customerSelected`، `branchTaxCode`، `isBlackListedCustomerCheck`، `onCustomerSelect`، `commonDriverSearch`، `searchDrivers`، `individualCustomerRadioSelected`، `searchDrivers`، `searchDrivers`، `searchDrivers`، `getSaleOrders`، `saleOrderChanged`، `driverSelected`، `additionalDriverSelected`، `searchVehiclePopup`، `addExternalVehiclePopup`، `addExternalVehiclePopup`، `addSagX3Contact`، `save`، `cancel`، `unCheckAllCharges`، `tariffOptionSelected`، `disableRate`، `calculate`، `includedChanged`، `taxAcceptedChanged`، `discountApplied`، `changeStatusReceiptCreation`، `changeStatusDepositCreation`، `totalDaysAndTime`، `otherPickUpLocationChanged`، `otherDropoffLocationChanged`، `complimentaryOnChange`، `rentOnChange`، `getAuthorizedUserName`، `amountChangedDeposit`.
- وحدة `tenant.views.crs.bookings.printtemplates.printPreview`: `cancel`، `getTemplateUrl`.
- وحدة `tenant.views.crs.vehicles.selectCheckList`: `cancel`، `save`.
- وحدة `tenant.views.common.documents.uploadImageModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.common.makes.createOrEditModal`: `save`، `cancel`.
- وحدة `tenant.views.common.vehiclemodels.createOrEditModal`: `searchMake`، `save`، `cancel`.
- وحدة `tenant.views.common.documents.uploadDocumentModal`: `uploadHeader`، `uploader.onBeforeUploadItem`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.common.locations.searchContactModal`: `cancel`، `branchSelected`، `init`.
- وحدة `tenant.views.crs.contacts.uploadDocumentModal`: `save`، `cancel`.
- وحدة `tenant.views.crs.contacts.uploadDocumentModal`: `save`، `cancel`.
- وحدة `tenant.views.common.documents.addCreditCardModal`: `ab`، `cardNumberChanged`، `save`، `cancel`.
- وحدة `tenant.views.movements.uploadDocument`: `save`، `cancel`، `uploader.onSuccessItem`.
- وحدة `tenant.views.crs.vouchers.receipts.uploadDocumentsModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.crs.vouchers.invoices.generateAdvanceTaxModal`: `rounding`، `chargesTypeVoucherLine`، `getColspan`، `chargesTypeVoucherLineRepeat`، `searchRentalOrLeaseAgreement`، `localize`، `cancel`، `depositSelected`، `amountChanged`، `getlocalDateTime`، `branchTaxCode`، `onCustomerSelect`، `searchCustomers`، `searchAdvanceReceipts`، `searchAccounts`، `searchCustomerPopoup`، `uploadDocument`، `getOriginalName`، `save`، `calculateCreditAndTax`، `sumAmount`، `rounding`، `rounding`، `setTaxPercentOnTaxCode`، `calculateTaxPerRow`، `rounding`، `sumAmountTax`، `rounding`، `addRow`، `removeDocument`، `getVehicleMakeName`.
- وحدة `tenant.views.crs.vouchers.receipts.printTemplates.printPreview`: `cancel`، `getTemplateUrl`.
- وحدة `tenant.views.crs.bookings.uploadDocumentsModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.crs.contacts.searchContactOptionModal`: `searchContacts`، `cancel`، `showAddContact`، `contactSelected`، `contactEdit`، `getContactsList`، `getNameWithCode`.
- وحدة `tenant.views.crs.vehicles.searchVehicleModal`: `statusChanged`، `searchModel`، `cancel`، `clearInput`، `clearVehicle`، `getlocalDateTime`، `fromDateTimeChanged`، `searchVehicles`، `searchVehiclesFilters`، `exportToExcelByAgreement`، `vehicleSelected`، `getBookingDate`، `getTeriffGroups`.
- وحدة `tenant.views.crs.vehicles.addExternalVehicle`: `localize`، `cancel`، `searchModel`، `getTeriffGroups`، `searchSupplier`، `save`.
- وحدة `tenant.views.crs.agreements.agreementAdvanceAndDeposit`: `uploadDocument`، `uploadAdvanceDocument`، `removeDocument`، `removeAdvanceDocument`، `getOriginalName`، `amountChanged`، `amountChangedDeposit`، `customerCurrencyChanged`، `amountWithoutCommissionChanged`، `cancel`، `calculateCreditCardCommission`، `conversionRateChanged`، `onCustomerSelect`، `ok`، `dateNullOrNot`.
- وحدة `tenant.views.crs.discountCodes.applyDiscountModal`: `calculateDiscountedRate`، `calculateDiscountedPercentage`، `verifyAuthCode`، `applyDiscount`.
- وحدة `tenant.views.crs.discountCodes.applyDiscountModal`: `calculateDiscountedRate`، `calculateDiscountedPercentage`، `verifyAuthCode`، `getBranchWiseDiscount`، `applyDiscount`.
- وحدة `tenant.views.crs.agreements.expiredDocOutStandingBalanceModal`: `getlocalDate`، `cancel`، `rounding`، `getDocumentType`.
- وحدة `tenant.views.crs.contacts.searchSagX3ContactModal`: `searchContacts`، `cancel`، `contactSelected`.
- وحدة `tenant.views.crs.agreements.driverChargesModal`: `boxTicked`، `cancel`، `applyChange`، `saveDriverCharges`.
- وحدة `tenant.views.common.authorizationCodes.verifyAuthCodeModal`: `cancel`، `rounding`، `verify`.
- وحدة `tenant.views.crs.agreements.printPreview`: `cancel`، `getTemplateUrl`.
- وحدة `tenant.views.crs.vouchers.invoices.uploadDocumentsModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.crs.vouchers.deposits.uploadDocumentsModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.crs.discountCodes.verifyAuthCodeModal`: `cancel`، `verifyCode`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.vehicleModel.searchPreUsedVehicleModels` | POST | api/services/app/vehicleModel/SearchPreUsedVehicleModels | [المصدر](../../../raw/application.js#L211851) |
| `abp.services.app.directory.search` | POST | api/services/app/directory/Search | [المصدر](../../../raw/application.js#L305964) |
| `abp.services.app.commonLookup.getTariffGroups` | POST | api/services/app/commonLookup/GetTariffGroups | [المصدر](../../../raw/application.js#L305957) |
| `abp.services.app.commonLookup.getLocationsActiveAndInActive` | POST | api/services/app/commonLookup/GetLocationsActiveAndInActive | [المصدر](../../../raw/application.js#L101577) |
| `abp.services.app.uaeFine.getFiltersData` | POST | api/services/app/uaeFine/GetFiltersData | [المصدر](../../../raw/application.js#L211438) |
| `abp.services.app.vehicle.getBookedVehicles` | POST | api/services/app/vehicle/GetBookedVehicles | [المصدر](../../../raw/application.js#L212326) |
| `abp.services.app.equipmentSales.getEquipments` | POST | api/services/app/equipmentSales/GetEquipments | [المصدر](../../../raw/application.js#L212338) |
| `abp.services.app.equipmentSales.exportToExcel` | POST | api/services/app/equipmentSales/ExportToExcel | [المصدر](../../../raw/application.js#L212486) |
| `abp.services.app.vehicle.getVehiclesDetailExportToExcel` | POST | api/services/app/vehicle/GetVehiclesDetailExportToExcel | [المصدر](../../../raw/application.js#L212512) |
| `abp.services.app.equipmentSales.deleteEquipment` | POST | api/services/app/equipmentSales/DeleteEquipment | [المصدر](../../../raw/application.js#L212584) |
| `abp.services.app.vehicle.getVehicleTariffGroupAcrissTypes` | POST | api/services/app/vehicle/GetVehicleTariffGroupAcrissTypes | [المصدر](../../../raw/application.js#L212632) |
| `abp.services.app.directory.searchDirectoryPaged` | POST | api/services/app/directory/SearchDirectoryPaged | [المصدر](../../../raw/application.js#L184853) |
| `abp.services.app.vehicle.getVehicleLogs` | POST | api/services/app/vehicle/GetVehicleLogs | [المصدر](../../../raw/application.js#L308293) |
| `abp.services.app.vehicle.createVehicleLog` | POST | api/services/app/vehicle/CreateVehicleLog | [المصدر](../../../raw/application.js#L308302) |
| `abp.services.app.vehicleInvestorsLog.getLogsForVehicle` | POST | api/services/app/vehicleInvestorsLog/GetLogsForVehicle | [المصدر](../../../raw/application.js#L311236) |
| `abp.services.app.rentalAgreementSearch.getAgreementsHistory` | POST | api/services/app/rentalAgreementSearch/GetAgreementsHistory | [المصدر](../../../raw/application.js#L150025) |
| `abp.services.app.vehicle.updateMileage` | POST | api/services/app/vehicle/UpdateMileage | [المصدر](../../../raw/application.js#L314576) |
| `abp.services.app.vehicle.getVehiclesStatusDetail` | POST | api/services/app/vehicle/GetVehiclesStatusDetail | [المصدر](../../../raw/application.js#L314497) |
| `abp.services.app.vehicle.exportToExcelDashBoard` | POST | api/services/app/vehicle/ExportToExcelDashBoard | [المصدر](../../../raw/application.js#L314542) |
| `abp.services.app.vehicleModel.searchVehicleModelsNew` | POST | api/services/app/vehicleModel/SearchVehicleModelsNew | [المصدر](../../../raw/application.js#L305950) |
| `abp.services.app.commonLookup.getLocations` | POST | api/services/app/commonLookup/GetLocations | [المصدر](../../../raw/application.js#L313017) |
| `abp.services.app.vehicle.getVehicleMovements` | POST | [object Object] | [المصدر](../../../raw/application.js#L213049) |
| `abp.services.app.vehicle.getAdvanceSettings` | POST | api/services/app/vehicle/GetAdvanceSettings | [المصدر](../../../raw/application.js#L211467) |
| `abp.services.app.vehicleAttachment.getVehicleAttachmentsByVehicle` | POST | api/services/app/vehicleAttachment/GetVehicleAttachmentsByVehicle | [المصدر](../../../raw/application.js#L213106) |
| `abp.services.app.vehicle.getVehicleForView` | POST | api/services/app/vehicle/GetVehicleForView | [المصدر](../../../raw/application.js#L213135) |
| `abp.services.app.bookingExport.exportToExcel` | POST | api/services/app/bookingExport/ExportToExcel | [المصدر](../../../raw/application.js#L315751) |
| `abp.services.app.chargesSetting.getChargesSettings` | POST | api/services/app/chargesSetting/GetChargesSettings | [المصدر](../../../raw/application.js#L315945) |
| `abp.services.app.bookingSearch.getBookings` | POST | api/services/app/bookingSearch/GetBookings | [المصدر](../../../raw/application.js#L315976) |
| `abp.services.app.booking.getBookingForEdit` | POST | api/services/app/booking/GetBookingForEdit | [المصدر](../../../raw/application.js#L171568) |
| `abp.services.app.booking.cancelBooking` | POST | api/services/app/booking/CancelBooking | [المصدر](../../../raw/application.js#L316004) |
| `abp.services.app.booking.noShowBooking` | POST | api/services/app/booking/NoShowBooking | [المصدر](../../../raw/application.js#L316020) |
| `abp.services.app.booking.deleteBooking` | POST | api/services/app/booking/DeleteBooking | [المصدر](../../../raw/application.js#L316095) |
| `abp.services.app.booking.markCloseBooking` | POST | api/services/app/booking/MarkCloseBooking | [المصدر](../../../raw/application.js#L316112) |
| `abp.services.app.vehicle.defleetVehicle` | POST | api/services/app/vehicle/DefleetVehicle | [المصدر](../../../raw/application.js#L309577) |
| `abp.services.app.vehicle.getVehicleForEdit` | POST | api/services/app/vehicle/GetVehicleForEdit | [المصدر](../../../raw/application.js#L312225) |
| `abp.services.app.commonLookup.getNotReadyReasons` | POST | api/services/app/commonLookup/GetNotReadyReasons | [المصدر](../../../raw/application.js#L306762) |
| `abp.services.app.checkList.getCheckList` | POST | api/services/app/checkList/GetCheckList | [المصدر](../../../raw/application.js#L450518) |
| `abp.services.app.vehicle.changeVehicleSubStatus` | POST | api/services/app/vehicle/ChangeVehicleSubStatus | [المصدر](../../../raw/application.js#L306851) |
| `abp.services.app.vehicle.onfleetVehicle` | POST | api/services/app/vehicle/OnfleetVehicle | [المصدر](../../../raw/application.js#L311873) |
| `abp.services.app.vehicleModel.searchVehicleMakes` | POST | api/services/app/vehicleModel/SearchVehicleMakes | [المصدر](../../../raw/application.js#L211019) |
| `abp.services.app.commonLookup.searchContact` | POST | api/services/app/commonLookup/SearchContact | [المصدر](../../../raw/application.js#L308256) |
| `abp.services.app.costCenter.searchCostCenters` | POST | api/services/app/costCenter/SearchCostCenters | [المصدر](../../../raw/application.js#L311975) |
| `abp.services.app.equipmentSales.createOrUpdateEquipment` | POST | api/services/app/equipmentSales/CreateOrUpdateEquipment | [المصدر](../../../raw/application.js#L211332) |
| `abp.services.app.vehicle.getInsuranceCompanies` | POST | api/services/app/vehicle/GetInsuranceCompanies | [المصدر](../../../raw/application.js#L211494) |
| `abp.services.app.equipmentSales.getEquipmentForEdit` | POST | api/services/app/equipmentSales/GetEquipmentForEdit | [المصدر](../../../raw/application.js#L211540) |
| `abp.services.app.journal.getDamageRevenueLedger` | POST | api/services/app/journal/GetDamageRevenueLedger | [المصدر](../../../raw/application.js#L312172) |
| `abp.services.app.vehicle.searchVehicles` | POST | api/services/app/vehicle/SearchVehicles | [المصدر](../../../raw/application.js#L312838) |
| `abp.services.app.account.searchAccountsForSubLookUp` | POST | api/services/app/account/SearchAccountsForSubLookUp | [المصدر](../../../raw/application.js#L346376) |
| `abp.services.app.directory.searchByContactGroup` | POST | api/services/app/directory/SearchByContactGroup | [المصدر](../../../raw/application.js#L137688) |
| `abp.services.app.vehicle.getVehicleById` | POST | api/services/app/vehicle/GetVehicleById | [المصدر](../../../raw/application.js#L312131) |
| `abp.services.app.journal.exportDamageRevenueLedgerToExcel` | POST | api/services/app/journal/ExportDamageRevenueLedgerToExcel | [المصدر](../../../raw/application.js#L312192) |
| `abp.services.app.tariffCard.getTariffCards` | POST | api/services/app/tariffCard/GetTariffCards | [المصدر](../../../raw/application.js#L298630) |
| `abp.services.app.tariff.createOrUpdateTariff` | POST | api/services/app/tariff/CreateOrUpdateTariff | [المصدر](../../../raw/application.js#L298731) |
| `abp.services.app.tariff.getTariffForEdit` | POST | api/services/app/tariff/GetTariffForEdit | [المصدر](../../../raw/application.js#L298755) |
| `abp.services.app.chargesSetting.getChargesTypes` | POST | api/services/app/chargesSetting/GetChargesTypes | [المصدر](../../../raw/application.js#L182581) |
| `abp.services.app.directory.searchSalesPersonOne` | POST | api/services/app/directory/SearchSalesPersonOne | [المصدر](../../../raw/application.js#L182778) |
| `abp.services.app.commonLookup.searchCustomLookups` | POST | api/services/app/commonLookup/SearchCustomLookups | [المصدر](../../../raw/application.js#L182861) |
| `abp.services.app.commonLookup.getCustomLookups` | POST | api/services/app/commonLookup/GetCustomLookups | [المصدر](../../../raw/application.js#L182869) |
| `abp.services.app.country.searchCountries` | POST | api/services/app/country/SearchCountries | [المصدر](../../../raw/application.js#L183560) |
| `abp.services.app.person.createOrUpdatePerson` | POST | api/services/app/person/CreateOrUpdatePerson | [المصدر](../../../raw/application.js#L183236) |
| `abp.services.app.contactGroup.getContactGroupsOnContactType` | POST | api/services/app/contactGroup/GetContactGroupsOnContactType | [المصدر](../../../raw/application.js#L183448) |
| `abp.services.app.taxCode.getTaxCodes` | POST | api/services/app/taxCode/GetTaxCodes | [المصدر](../../../raw/application.js#L183456) |
| `abp.services.app.currency.getCurrencies` | POST | api/services/app/currency/GetCurrencies | [المصدر](../../../raw/application.js#L134369) |
| `abp.services.app.tariffCard.getActiveTariffCards` | POST | api/services/app/tariffCard/GetActiveTariffCards | [المصدر](../../../raw/application.js#L183703) |
| `abp.services.app.tariffCard.getTariffCardById` | POST | api/services/app/tariffCard/GetTariffCardById | [المصدر](../../../raw/application.js#L137231) |
| `abp.services.app.person.getAdvanceSettings` | POST | api/services/app/person/GetAdvanceSettings | [المصدر](../../../raw/application.js#L183744) |
| `abp.services.app.person.getHighLightBlackListCountry` | POST | [object Object] | [المصدر](../../../raw/application.js#L183768) |
| `abp.services.app.person.getNationalIdFormate` | POST | [object Object] | [المصدر](../../../raw/application.js#L183774) |
| `abp.services.app.person.getPersonForEdit` | POST | api/services/app/person/GetPersonForEdit | [المصدر](../../../raw/application.js#L183903) |
| `abp.services.app.person.getContactCards` | POST | api/services/app/person/GetContactCards | [المصدر](../../../raw/application.js#L184004) |
| `abp.services.app.commonLookup.validateCreditLimit` | POST | api/services/app/commonLookup/ValidateCreditLimit | [المصدر](../../../raw/application.js#L138450) |
| `abp.services.app.vehicleInvestorsLog.createOrUpdate` | POST | api/services/app/vehicleInvestorsLog/CreateOrUpdate | [المصدر](../../../raw/application.js#L308232) |
| `abp.services.app.vehicleInvestorsLog.closeInvestorLog` | POST | api/services/app/vehicleInvestorsLog/CloseInvestorLog | [المصدر](../../../raw/application.js#L308243) |
| `abp.services.app.movement.getSupportingDocuments` | POST | api/services/app/movement/GetSupportingDocuments | [المصدر](../../../raw/application.js#L450453) |
| `abp.services.app.checkList.getVehicleTypeWiseCheckList` | POST | api/services/app/checkList/GetVehicleTypeWiseCheckList | [المصدر](../../../raw/application.js#L450504) |
| `abp.services.app.movement.getMovement` | POST | api/services/app/movement/GetMovement | [المصدر](../../../raw/application.js#L450612) |
| `abp.services.app.booking.silentPayment` | POST | api/services/app/booking/SilentPayment | [المصدر](../../../raw/application.js#L102934) |
| `abp.services.app.invoice.silentPayment` | POST | api/services/app/invoice/SilentPayment | [المصدر](../../../raw/application.js#L102942) |
| `abp.services.app.rentalQuotation.silentPayment` | POST | api/services/app/rentalQuotation/SilentPayment | [المصدر](../../../raw/application.js#L102957) |
| `abp.services.app.booking.sendEmailForBookingPayment` | POST | api/services/app/booking/SendEmailForBookingPayment | [المصدر](../../../raw/application.js#L102751) |
| `abp.services.app.invoice.sendEmailForInvoicePayment` | POST | api/services/app/invoice/SendEmailForInvoicePayment | [المصدر](../../../raw/application.js#L102761) |
| `abp.services.app.billingMethod.getDefaultCreditCard` | POST | api/services/app/billingMethod/GetDefaultCreditCard | [المصدر](../../../raw/application.js#L386977) |
| `abp.services.app.commonLookup.getContactCards` | POST | api/services/app/commonLookup/GetContactCards | [المصدر](../../../raw/application.js#L386984) |
| `abp.services.app.chargesSetting.getConfiguredChargesTypes` | POST | api/services/app/chargesSetting/GetConfiguredChargesTypes | [المصدر](../../../raw/application.js#L387052) |
| `abp.services.app.job.searchJobs` | POST | api/services/app/job/SearchJobs | [المصدر](../../../raw/application.js#L387128) |
| `abp.services.app.billingMethod.getBillingMethods` | POST | api/services/app/billingMethod/GetBillingMethods | [المصدر](../../../raw/application.js#L134491) |
| `abp.services.app.allocation.getAllocationsForEdit` | POST | api/services/app/allocation/GetAllocationsForEdit | [المصدر](../../../raw/application.js#L387494) |
| `abp.services.app.allocation.getAllocationsForReceiptBaseOnAgreement` | POST | api/services/app/allocation/GetAllocationsForReceiptBaseOnAgreement | [المصدر](../../../raw/application.js#L387554) |
| `abp.services.app.commonLookup.getBankAccountsForSelection` | POST | api/services/app/commonLookup/GetBankAccountsForSelection | [المصدر](../../../raw/application.js#L134545) |
| `abp.services.app.commonLookup.getCurrencies` | POST | api/services/app/commonLookup/GetCurrencies | [المصدر](../../../raw/application.js#L137871) |
| `abp.services.app.commonAgreement.getAllAgreementsOnCustomer` | POST | api/services/app/commonAgreement/GetAllAgreementsOnCustomer | [المصدر](../../../raw/application.js#L388011) |
| `abp.services.app.receiptChargesAllocation.getReceiptChargesAllocationsForAgreementEdit` | POST | api/services/app/receiptChargesAllocation/GetReceiptChargesAllocationsForAgreementEdit | [المصدر](../../../raw/application.js#L387987) |
| `abp.services.app.receiptSearch.getReceiptForEdit` | POST | api/services/app/receiptSearch/GetReceiptForEdit | [المصدر](../../../raw/application.js#L388043) |
| `abp.services.app.commonAgreement.getAgreement` | POST | api/services/app/commonAgreement/GetAgreement | [المصدر](../../../raw/application.js#L388176) |
| `abp.services.app.receipt.createOrUpdateReceipt` | POST | api/services/app/receipt/CreateOrUpdateReceipt | [المصدر](../../../raw/application.js#L388363) |
| `abp.services.app.receipt.createOrUpdateReceiptWithCharge` | POST | api/services/app/receipt/CreateOrUpdateReceiptWithCharge | [المصدر](../../../raw/application.js#L388423) |
| `abp.services.app.receipt.createOrUpdateReceiptPayment` | POST | api/services/app/receipt/CreateOrUpdateReceiptPayment | [المصدر](../../../raw/application.js#L388555) |
| `abp.services.app.commonLookup.searchGooglePlaces` | POST | api/services/app/commonLookup/SearchGooglePlaces | [المصدر](../../../raw/application.js#L137197) |
| `abp.services.app.saleOrigin.getSaleOrigins` | POST | api/services/app/saleOrigin/GetSaleOrigins | [المصدر](../../../raw/application.js#L137625) |
| `abp.services.app.directory.searchSalesPersonWithDesignation` | POST | api/services/app/directory/SearchSalesPersonWithDesignation | [المصدر](../../../raw/application.js#L137618) |
| `abp.services.app.directory.searchSalesPersonActiveOne` | POST | api/services/app/directory/SearchSalesPersonActiveOne | [المصدر](../../../raw/application.js#L137606) |
| `abp.services.app.directory.searchPersonStaffCustomer` | POST | api/services/app/directory/SearchPersonStaffCustomer | [المصدر](../../../raw/application.js#L137735) |
| `abp.services.app.tariffCard.getActiveTariffCardsForPeriod` | POST | api/services/app/tariffCard/GetActiveTariffCardsForPeriod | [المصدر](../../../raw/application.js#L172148) |
| `abp.services.app.commonLookup.getLocationById` | POST | api/services/app/commonLookup/GetLocationById | [المصدر](../../../raw/application.js#L346276) |
| `abp.services.app.directory.searchForCompany` | POST | api/services/app/directory/SearchForCompany | [المصدر](../../../raw/application.js#L138144) |
| `abp.services.app.booking.createOrUpdateBooking` | POST | api/services/app/booking/CreateOrUpdateBooking | [المصدر](../../../raw/application.js#L172471) |
| `abp.services.app.tariffLocation.getTariffLocations` | POST | api/services/app/tariffLocation/GetTariffLocations | [المصدر](../../../raw/application.js#L172561) |
| `abp.services.app.booking.getBookingWithAdvanceForEdit` | POST | api/services/app/booking/GetBookingWithAdvanceForEdit | [المصدر](../../../raw/application.js#L172669) |
| `abp.services.app.booking.sendBookingEmail` | POST | api/services/app/booking/SendBookingEmail | [المصدر](../../../raw/application.js#L172782) |
| `abp.services.app.bookingSearch.getBookingForView` | POST | api/services/app/bookingSearch/GetBookingForView | [المصدر](../../../raw/application.js#L174389) |
| `abp.services.app.booking.confirmBooking` | POST | api/services/app/booking/ConfirmBooking | [المصدر](../../../raw/application.js#L171551) |
| `abp.services.app.customerProject.getCustomerProject` | POST | api/services/app/customerProject/GetCustomerProject | [المصدر](../../../raw/application.js#L137165) |
| `abp.services.app.tariffCard.getActiveTariffCardsPeriodWise` | POST | api/services/app/tariffCard/GetActiveTariffCardsPeriodWise | [المصدر](../../../raw/application.js#L137218) |
| `abp.services.app.agreementGroup.getAgreementGroups` | POST | api/services/app/agreementGroup/GetAgreementGroups | [المصدر](../../../raw/application.js#L137631) |
| `abp.services.app.directory.searchCustomerPhoto` | POST | api/services/app/directory/SearchCustomerPhoto | [المصدر](../../../raw/application.js#L137823) |
| `abp.services.app.directory.getCustomerOutstandingBalance` | POST | api/services/app/directory/GetCustomerOutstandingBalance | [المصدر](../../../raw/application.js#L137905) |
| `abp.services.app.rentalQuotation.getQuotationsByContactId` | POST | api/services/app/rentalQuotation/GetQuotationsByContactId | [المصدر](../../../raw/application.js#L137971) |
| `abp.services.app.agreementSaleOrder.getAgreementSaleOrdersByContactId` | POST | api/services/app/agreementSaleOrder/GetAgreementSaleOrdersByContactId | [المصدر](../../../raw/application.js#L138188) |
| `abp.services.app.rentalQuotation.getQuotationForEdit` | POST | api/services/app/rentalQuotation/GetQuotationForEdit | [المصدر](../../../raw/application.js#L138198) |
| `abp.services.app.accident.checkRepeatedAccidentsOnDriver` | POST | api/services/app/accident/CheckRepeatedAccidentsOnDriver | [المصدر](../../../raw/application.js#L138254) |
| `abp.services.app.agreement.createOrUpdateAgreement` | POST | api/services/app/agreement/CreateOrUpdateAgreement | [المصدر](../../../raw/application.js#L138749) |
| `abp.services.app.agreement.advanceInvoiceOnCreation` | POST | api/services/app/agreement/AdvanceInvoiceOnCreation | [المصدر](../../../raw/application.js#L138762) |
| `abp.services.app.vehicleAlerts.getServiceAlertForVehicle` | POST | api/services/app/vehicleAlerts/GetServiceAlertForVehicle | [المصدر](../../../raw/application.js#L138725) |
| `abp.services.app.staff.getStaffForEdit` | POST | api/services/app/staff/GetStaffForEdit | [المصدر](../../../raw/application.js#L139097) |
| `abp.services.app.commonLookup.getUser` | POST | api/services/app/commonLookup/GetUser | [المصدر](../../../raw/application.js#L139120) |
| `abp.services.app.agreement.getAgreementWithAdvanceAndDepositForEdit` | POST | api/services/app/agreement/GetAgreementWithAdvanceAndDepositForEdit | [المصدر](../../../raw/application.js#L139165) |
| `abp.services.app.agreementGroup.getDefaultGroupId` | POST | api/services/app/agreementGroup/GetDefaultGroupId | [المصدر](../../../raw/application.js#L139192) |
| `abp.services.app.make.createOrUpdateMake` | POST | api/services/app/make/CreateOrUpdateMake | [المصدر](../../../raw/application.js#L101617) |
| `abp.services.app.make.getMakeForEdit` | POST | api/services/app/make/GetMakeForEdit | [المصدر](../../../raw/application.js#L101632) |
| `abp.services.app.make.searchMakes` | POST | api/services/app/make/SearchMakes | [المصدر](../../../raw/application.js#L115400) |
| `abp.services.app.vehicleModel.createOrUpdateVehicleModel` | POST | api/services/app/vehicleModel/CreateOrUpdateVehicleModel | [المصدر](../../../raw/application.js#L115409) |
| `abp.services.app.vehicleModel.getVehicleModelForEdit` | POST | api/services/app/vehicleModel/GetVehicleModelForEdit | [المصدر](../../../raw/application.js#L115424) |
| `abp.services.app.person.uploadDocumentImage` | POST | api/services/app/person/UploadDocumentImage | [المصدر](../../../raw/application.js#L185476) |
| `abp.services.app.movement.addDocument` | POST | api/services/app/movement/AddDocument | [المصدر](../../../raw/application.js#L449951) |
| `abp.services.app.commonLookup.searchRentalOrLeaseAgreement` | POST | api/services/app/commonLookup/SearchRentalOrLeaseAgreement | [المصدر](../../../raw/application.js#L346203) |
| `abp.services.app.receipt.getAdvanceReceipts` | POST | api/services/app/receipt/GetAdvanceReceipts | [المصدر](../../../raw/application.js#L346346) |
| `abp.services.app.receipt.getAdvanceTaxReceipt` | POST | [object Object] | [المصدر](../../../raw/application.js#L346361) |
| `abp.services.app.invoice.createOrUpdateAdvanceTaxInvoice` | POST | api/services/app/invoice/CreateOrUpdateAdvanceTaxInvoice | [المصدر](../../../raw/application.js#L346448) |
| `abp.services.app.vehicleModel.getVehicleModels` | POST | api/services/app/vehicleModel/GetVehicleModels | [المصدر](../../../raw/application.js#L346739) |
| `abp.services.app.invoice.getInvoiceForEdit` | POST | api/services/app/invoice/GetInvoiceForEdit | [المصدر](../../../raw/application.js#L346755) |
| `abp.services.app.salesAgreement.getSalesAgreementForEdit` | POST | api/services/app/salesAgreement/GetSalesAgreementForEdit | [المصدر](../../../raw/application.js#L346763) |
| `abp.services.app.salesQuotation.getQuotationForEdit` | POST | api/services/app/salesQuotation/GetQuotationForEdit | [المصدر](../../../raw/application.js#L346820) |
| `abp.services.app.account.getAccount` | POST | api/services/app/account/GetAccount | [المصدر](../../../raw/application.js#L346904) |
| `abp.services.app.vehicle.searchVehiclesPagedWorkShop` | POST | api/services/app/vehicle/SearchVehiclesPagedWorkShop | [المصدر](../../../raw/application.js#L312796) |
| `abp.services.app.vehicle.searchVehiclesPagedByAgreement` | POST | [object Object] | [المصدر](../../../raw/application.js#L312800) |
| `abp.services.app.vehicle.searchVehiclesPaged` | POST | api/services/app/vehicle/SearchVehiclesPaged | [المصدر](../../../raw/application.js#L312803) |
| `abp.services.app.vehicle.exportToExcelByAgreement` | POST | api/services/app/vehicle/ExportToExcelByAgreement | [المصدر](../../../raw/application.js#L312885) |
| `abp.services.app.vehicle.getNextFleetCode` | POST | api/services/app/vehicle/GetNextFleetCode | [المصدر](../../../raw/application.js#L305969) |
| `abp.services.app.commonLookup.getCurrenciesAll` | POST | api/services/app/commonLookup/GetCurrenciesAll | [المصدر](../../../raw/application.js#L134377) |
| `abp.services.app.userWiseDiscount.getBranchWiseUserDiscount` | POST | api/services/app/userWiseDiscount/GetBranchWiseUserDiscount | [المصدر](../../../raw/application.js#L201812) |
| `abp.services.app.directory.getExpiredDocumentAndOutStandingBalance` | POST | api/services/app/directory/GetExpiredDocumentAndOutStandingBalance | [المصدر](../../../raw/application.js#L141621) |
| `abp.services.app.directory.searchSagX3Contacts` | POST | api/services/app/directory/SearchSagX3Contacts | [المصدر](../../../raw/application.js#L185395) |
| `abp.services.app.company.createSagX3Contact` | POST | api/services/app/company/CreateSagX3Contact | [المصدر](../../../raw/application.js#L185442) |
| `abp.services.app.authorizationCode.verifyCode` | POST | api/services/app/authorizationCode/VerifyCode | [المصدر](../../../raw/application.js#L85555) |
| `abp.services.app.discountAuthCode.verifyCode` | POST | api/services/app/discountAuthCode/VerifyCode | [المصدر](../../../raw/application.js#L202257) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.SalesModule.EquipmentSales.AddNew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.SalesModule.EquipmentSales.View`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.SalesModule.EquipmentSales.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.SalesModule.EquipmentSales.Delete`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.SalesModule.EquipmentSales.ExportToExcel`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vehicles.ViewOtherBranchVehicles`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Tariff`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.ERS.Rental.Tariff`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.ERS.Lease.Tariff`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Delete`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vehicles.AllActionsOnOtherBranchVehicles`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Bookings.EmailLinkToCharge`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Bookings.ChargeCard`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Bookings`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Bookings.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Bookings.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Bookings.ExportToExcel`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Bookings.Delete`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Bookings.OpenAgreement`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Bookings.Cancel`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Bookings.ConfirmBooking`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Bookings.MarkClosed`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Bookings.NoShow`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Bookings.AllActionsOnOtherBranchBookings`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Bookings.ViewOtherBranchBookings`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vehicles.CanChangeFleetType`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vehicles.CanChangeOwnership`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Administration.Tenant.Integration.Fusion.Mappings`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vehicles.AllowEditNextRegistrationDate`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vehicles.AllowEditNextInsuranceDate`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Reports.DamageRevenueLedger`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.TariffCards`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Customers.EnableCreditPeriod`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Customers.EnableCreditLimit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Customers.ContactCards`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Customers.ContactCards.Add`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Customers.ContactCards.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Customers.ContactCards.Delete`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Customers.ContactCards.ViewCreditCardWithLastFourDigit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Customers.ContactCards.ViewFullCreditCardDetails`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.CustomerApproval`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.LimitedEdit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Receipts.AllActionsOnOtherBranchReceipts`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Allocations`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Receipts.CanChangeDate`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Bookings.Addnew.CanChangeRates`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Bookings.Addnew.EditLimitedRates`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Bookings.Addnew.CanChangeMileage`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Bookings.Edit.CanChangeRates`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Bookings.Edit.EditLimitedRates`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Bookings.Edit.EditMileageRates`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.Edit.CanChangeRates`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.CanChangeFuelRate`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.Edit.EditLimitedRates`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.AllowKMsLimitandExcessEditable`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.CanChangeAdvanceAmount`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.AllowComplimentaryAgreement`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.CanChangeKMOut`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.CanChangeFuelOut`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.AgreementGroups`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.CanOpenAgreementWithoutSaleOrderRental`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.SalesModule.SalesAgreement.GenerateDownPaymentReceipt`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.SalesModule.SalesQuotation.GenerateDownPaymentReceipt`: ممنوحة في السياق الملتقط.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.filters.plateNo` | text |  |  |
| `vm.filters.chassisNo` | text |  |  |
| `vm.filters.locationId` | select | locationId |  |
| `vm.filters.exteriorColor` | text |  |  |
| `vm.vehicle.model` | ui-select |  |  |
| `vm.filters.tariffGroupId` | select | vehicleType | ng-options=group.id as group.title for group in vm.tariffGroups |
| `vm.filters.tariffGroupId` | select | vehicleType | ng-options=group.id as group.title for group in vm.tariffGroups |
| `vm.filters.status` | select |  | ng-options=status as status.name for status in vm.statuses |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
