# شاشة: Trips

المسار في القائمة: Limousine ← Trips.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_limo`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0228](../../../readable/routes/R0228--tenant-crs-limo.js)، والأصل [raw/application.js:3139](../../../raw/application.js#L3139).
- قالب الشاشة: `~/App/tenant/views/crs/limousine/trips/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.limousine.trips.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.limousine.trips.index](../../../readable/controllers/C0925--tenant.views.crs.limousine.trips.index.js) | 49 | 19 |
| [tenant.views.crs.contacts.searchContactModal](../../../readable/controllers/C0706--tenant.views.crs.contacts.searchContactModal.js) | 7 | 2 |
| [common.views.common.reportViewer](../../../readable/controllers/C0006--common.views.common.reportViewer.js) | 2 | 0 |
| [tenant.views.crs.vehicles.searchVehicleModal](../../../readable/controllers/C1186--tenant.views.crs.vehicles.searchVehicleModal.js) | 13 | 11 |
| [tenant.views.crs.limousine.trips.processPaymentModal](../../../readable/controllers/C0929--tenant.views.crs.limousine.trips.processPaymentModal.js) | 10 | 10 |
| [tenant.views.crs.limousine.trips.printtemplates.printPreview](../../../readable/controllers/C0939--tenant.views.crs.limousine.trips.printtemplates.printPreview.js) | 2 | 0 |
| [tenant.views.crs.limousine.trips.createOrEditModal](../../../readable/controllers/C0920--tenant.views.crs.limousine.trips.createOrEditModal.js) | 52 | 21 |
| [tenant.views.crs.limousine.trips.updateVehicleModal](../../../readable/controllers/C0934--tenant.views.crs.limousine.trips.updateVehicleModal.js) | 5 | 2 |
| [tenant.views.crs.limousine.trips.dispatchTripModal](../../../readable/controllers/C0921--tenant.views.crs.limousine.trips.dispatchTripModal.js) | 7 | 6 |
| [tenant.views.crs.limousine.trips.assigningTripModal](../../../readable/controllers/C0916--tenant.views.crs.limousine.trips.assigningTripModal.js) | 7 | 6 |
| [tenant.views.crs.limousine.trips.viewTripModal](../../../readable/controllers/C0937--tenant.views.crs.limousine.trips.viewTripModal.js) | 15 | 4 |
| [tenant.views.crs.limousine.trips.startTripModal](../../../readable/controllers/C0932--tenant.views.crs.limousine.trips.startTripModal.js) | 2 | 2 |
| [tenant.views.crs.limousine.trips.finishTripModal](../../../readable/controllers/C0923--tenant.views.crs.limousine.trips.finishTripModal.js) | 6 | 4 |
| [tenant.views.crs.limousine.trips.logTripModal](../../../readable/controllers/C0927--tenant.views.crs.limousine.trips.logTripModal.js) | 3 | 1 |
| [tenant.views.crs.limousine.trips.updateChargesModal](../../../readable/controllers/C0933--tenant.views.crs.limousine.trips.updateChargesModal.js) | 5 | 2 |
| [tenant.views.crs.limousine.trips.uploadTripModal](../../../readable/controllers/C0936--tenant.views.crs.limousine.trips.uploadTripModal.js) | 12 | 8 |
| [tenant.views.crs.vouchers.invoices.createOrEditModal](../../../readable/controllers/C1315--tenant.views.crs.vouchers.invoices.createOrEditModal.js) | 46 | 16 |
| [tenant.views.crs.contacts.createOrEditModal](../../../readable/controllers/C0703--tenant.views.crs.contacts.createOrEditModal.js) | 45 | 24 |
| [tenant.views.crs.contacts.searchContactOptionModal](../../../readable/controllers/C0707--tenant.views.crs.contacts.searchContactOptionModal.js) | 7 | 1 |
| [tenant.views.crs.limousine.trips.selectChauffeurModal](../../../readable/controllers/C0931--tenant.views.crs.limousine.trips.selectChauffeurModal.js) | 6 | 1 |
| [tenant.views.crs.limousine.trips.uploadDocumentsModal](../../../readable/controllers/C0935--tenant.views.crs.limousine.trips.uploadDocumentsModal.js) | 3 | 0 |
| [tenant.views.crs.limousine.trips.changeChargesModal](../../../readable/controllers/C0917--tenant.views.crs.limousine.trips.changeChargesModal.js) | 17 | 1 |
| [tenant.views.crs.vouchers.invoices.createOrEditLimoModal](../../../readable/controllers/C1314--tenant.views.crs.vouchers.invoices.createOrEditLimoModal.js) | 33 | 8 |
| [tenant.views.crs.limousine.trips.createLogModal](../../../readable/controllers/C0919--tenant.views.crs.limousine.trips.createLogModal.js) | 3 | 1 |
| [tenant.views.crs.vouchers.invoices.changeChargesModal](../../../readable/controllers/C1313--tenant.views.crs.vouchers.invoices.changeChargesModal.js) | 6 | 0 |
| [tenant.views.crs.vouchers.invoices.uploadDocumentsModal](../../../readable/controllers/C1355--tenant.views.crs.vouchers.invoices.uploadDocumentsModal.js) | 3 | 0 |
| [tenant.views.crs.vouchers.invoices.searchTripModal](../../../readable/controllers/C1352--tenant.views.crs.vouchers.invoices.searchTripModal.js) | 3 | 1 |
| [tenant.views.crs.vouchers.invoices.printTemplates.printPreview](../../../readable/controllers/C1359--tenant.views.crs.vouchers.invoices.printTemplates.printPreview.js) | 6 | 0 |
| [tenant.views.crs.contacts.uploadDocumentModal](../../../readable/controllers/C0699--tenant.views.crs.contacts.uploadDocumentModal.js) | 2 | 1 |
| [tenant.views.crs.contacts.uploadDocumentModal](../../../readable/controllers/C0711--tenant.views.crs.contacts.uploadDocumentModal.js) | 2 | 1 |
| [tenant.views.common.documents.uploadDocumentModal](../../../readable/controllers/C0362--tenant.views.common.documents.uploadDocumentModal.js) | 4 | 0 |
| [tenant.views.common.documents.uploadImageModal](../../../readable/controllers/C0363--tenant.views.common.documents.uploadImageModal.js) | 3 | 0 |
| [tenant.views.common.documents.addCreditCardModal](../../../readable/controllers/C0701--tenant.views.common.documents.addCreditCardModal.js) | 4 | 0 |
| [tenant.views.crs.limousine.trips.driverForcedSelectionReasonModal](../../../readable/controllers/C0922--tenant.views.crs.limousine.trips.driverForcedSelectionReasonModal.js) | 2 | 0 |
| [tenant.views.crs.limousine.trips.chargesTypeCalcDetailModal](../../../readable/controllers/C0918--tenant.views.crs.limousine.trips.chargesTypeCalcDetailModal.js) | 6 | 0 |
| [tenant.views.crs.vouchers.invoices.searchandAddMultipleTripsModal](../../../readable/controllers/C1351--tenant.views.crs.vouchers.invoices.searchandAddMultipleTripsModal.js) | 5 | 3 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.limousine.trips.index`: `applyChange`، `CurrencyFormate`، `isPrepaymentRequired`، `locationPermission`، `changeVehicle`، `getTripStatus`، `getTripSubStatus`، `uploader.onSuccessItem`، `uploader.onErrorItem`، `searchVehicles`، `searchVehiclesWithTariffGroup`، `searchCustomers`، `searchDrivers`، `searchSuppliers`، `searchCustomerPopoup`، `searchDriverPopoup`، `searchSupplierPopoup`، `report`، `searchVehiclePopoup`، `clearCustomer`، `clearDriver`، `clearVehicle`، `clearSupplier`، `getlocalDateTime`، `getlocalDateTimeNoYear`، `getTrips`، `updateChargesPermission`، `printAll`، `changeColumnOrdering`، `processPayment`، `TripPrintModal`، `exportToExcel`، `createTrip`، `dispatchTrip`، `assigningTrip`، `viewTrip`، `editTrip`، `startTrip`، `finishTrip`، `logTrip`، `updateCharges`، `cancelTrip`، `noShowTrip`، `driverReady`، `driverMoved`، `deleteTrip`، `generateInvoice`، `enterKeyPress`، `mRefNoEnterKeyPress`.
- وحدة `tenant.views.crs.contacts.searchContactModal`: `searchContacts`، `cancel`، `showAddContact`، `contactSelected`، `contactEdit`، `getContactsList`، `getNameWithCode`.
- وحدة `common.views.common.reportViewer`: `exportToExcelFromReport`، `cancel`.
- وحدة `tenant.views.crs.vehicles.searchVehicleModal`: `statusChanged`، `searchModel`، `cancel`، `clearInput`، `clearVehicle`، `getlocalDateTime`، `fromDateTimeChanged`، `searchVehicles`، `searchVehiclesFilters`، `exportToExcelByAgreement`، `vehicleSelected`، `getBookingDate`، `getTeriffGroups`.
- وحدة `tenant.views.crs.limousine.trips.processPaymentModal`: `CurrencyFormate`، `getCurrentBalance`، `searchCountries`، `allTripsReportsChecked`، `tripsReportChecked`، `cancel`، `processPaymentAndCreateReceipt`، `proceedPayment`، `submitBillingDetail`، `proceedPaymentThroughCreditBalance`.
- وحدة `tenant.views.crs.limousine.trips.printtemplates.printPreview`: `cancel`، `getTemplateUrl`.
- وحدة `tenant.views.crs.limousine.trips.createOrEditModal`: `rounding`، `getTripStatus`، `searchModel`، `externalVehicleSelected`، `onKMsChange`، `vehicleSelected`، `driverSelected`، `searchAdditionalDrivers`، `searchAdditionalDriverPopoup`، `trustSrc`، `branchTaxCode`، `customerSelected`، `loadContactPerson`، `loadContactPersonForEdit`، `invoiceSelected`، `removeDriver`، `clearAdditionalDriver`، `searchVehiclePopup`، `selectChauffeurPopup`، `tripTypeSelected`، `tripTypesFilter`، `getlocalDateTime`، `getlocalTime`، `pickupDateTimeChanged`، `dropOffDateTimeChanged`، `swapLocations`، `cancel`، `searchCustomers`، `searchSuppliers`، `searchCustomLookup`، `searchDrivers`، `openMapUrl`، `searchLocations`، `searchVehicles`، `tariffGroupChanged`، `pickupLocationSelected`، `dropOffLocationSelected`، `uploadDocument`، `getOriginalName`، `removeDocument`، `taxCategoryChanged`، `emptyDropOffTime`، `emptyPickUpTime`، `clearIfPlaceholder`، `changeCharges`، `searchInvoicePopoup`، `searchCustomerPopoup`، `saveAndPrint`، `checkNoOfTrips`، `saveTrip`، `save`، `resetFields`.
- وحدة `tenant.views.crs.limousine.trips.updateVehicleModal`: `searchVehicles`، `searchVehiclePopoup`، `clearVehicle`، `save`، `cancel`.
- وحدة `tenant.views.crs.limousine.trips.dispatchTripModal`: `searchVehicles`، `searchDrivers`، `cancel`، `vehicleSelected`، `driverSelected`، `selectChauffeurPopup`، `save`.
- وحدة `tenant.views.crs.limousine.trips.assigningTripModal`: `searchVehicles`، `searchDrivers`، `cancel`، `vehicleSelected`، `driverSelected`، `selectChauffeurPopup`، `save`.
- وحدة `tenant.views.crs.limousine.trips.viewTripModal`: `locationPermission`، `showDispatchButton`، `dispatchTrip`، `getTripStatus`، `getTaxCategory`، `trustSrc`، `getlocalDateTime`، `getlocalTime`، `cancel`، `getOriginalName`، `openMapUrl`، `viewCharges`، `viewLimoInvoice`، `getChecklist`، `loadContactPersonForEdit`.
- وحدة `tenant.views.crs.limousine.trips.startTripModal`: `cancel`، `save`.
- وحدة `tenant.views.crs.limousine.trips.finishTripModal`: `rounding`، `dropOffDateTimeChanged`، `changeCharges`، `onKMsChange`، `cancel`، `save`.
- وحدة `tenant.views.crs.limousine.trips.logTripModal`: `cancel`، `getlocalDateTime`، `createLog`.
- وحدة `tenant.views.crs.limousine.trips.updateChargesModal`: `cancel`، `getlocalDateTime`، `sumCharges`، `localize`، `save`.
- وحدة `tenant.views.crs.limousine.trips.uploadTripModal`: `cancel`، `getlocalDateTime`، `tripTypeSelected`، `searchLocations`، `tripTypesFilter`، `searchCustomers`، `searchCustomerPopoup`، `clearCustomer`، `customerSelected`، `getlocalDateTime`، `save`، `generateImportedTrips`.
- وحدة `tenant.views.crs.vouchers.invoices.createOrEditModal`: `rounding`، `toggleChargesAccountMode`، `oneTimeCheckBoxChanged1`، `calculateCharges`، `chargesTypeVoucherLine`، `getColspan`، `chargesTypeVoucherLineRepeat`، `sumPerTrip`، `sumTaxPerTrip`، `rounding`، `editTripChargesModal`، `uploadDocument`، `getOriginalName`، `searchRentalOrLeaseAgreement`، `branchTaxCode`، `setTaxPercentOnTaxCode`، `moduleChanged`، `localize`، `agreementChanged`، `cancel`، `sumAmount`، `rounding`، `totalAmount`، `changeChargesType`، `calculateTaxPerRow`، `rounding`، `sumAmountTax`، `taxAcceptedChanged`، `addRow`، `calculateCreditAndTax`، `addRowlimo`، `getlocalDateTime`، `addLimoRow`، `removeRow`، `removeLimoRow`، `onCustomerSelect`، `onClosedAgreementChange`، `searchCustomers`، `searchItems`، `searchAccounts`، `uploader.onSuccessItem`، `uploader.onErrorItem`، `searchVehicles`، `searchCustomerPopoup`، `save`، `removeDocument`.
- وحدة `tenant.views.crs.contacts.createOrEditModal`: `localize`، `removeExternalIdRow`، `addExternalIdRow`، `getContactExternalType`، `isContactExternalType`، `getlocalDate`، `getlocalDateTime`، `getCardType`، `removeRow`، `searchSalesPersons`، `searchUsersWithDesignation`، `searchSalesPersonPopoup`، `salesPersonSelected`، `searchDebtCollectorPopoup`، `searchCustomLookup`، `getCustomLookups`، `scanDocument`، `openUploadDocument`، `openUploadPicture`، `addCreditCardRow`، `updateCreditCardRow`، `save`، `cancel`، `isPersonVerifiedChange`، `doesIdentityDoucmentExist`، `addIndentityDocument`، `getIdentificationDocumentType`، `removeIndentityDocument`، `removeDoc`، `isFieldMondatory`، `searchCountries`، `emiratesDataReader`، `emiratesDataFieldManager`، `getTariffCards`، `getTariffCardForContact`، `isDocument`، `maskCreditCard`، `getAdvanceSettings`، `getHighLightBlackListCountries`، `getNationalIdFormates`، `nationalIdFormate`، `onOverRideChange`، `resetDocumentNo`، `nationIdMaskInput`، `handleResidenceStatusChange`.
- وحدة `tenant.views.crs.contacts.searchContactOptionModal`: `searchContacts`، `cancel`، `showAddContact`، `contactSelected`، `contactEdit`، `getContactsList`، `getNameWithCode`.
- وحدة `tenant.views.crs.limousine.trips.selectChauffeurModal`: `getChauffeurQueue`، `changeBranchDriver`، `redButtonClicked`، `openViewTripModal`، `cancel`، `contactSelected`.
- وحدة `tenant.views.crs.limousine.trips.uploadDocumentsModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.crs.limousine.trips.changeChargesModal`: `cancel`، `rounding`، `taxCategoryChanged`، `onChangeTaxCategory`، `sumCharges`، `sumChargesTax`، `calculateCharges`، `calculateDiscountCharges`، `branchTaxCode`، `setTaxPercentOnTaxCode`، `calculateTaxPerRow`، `calculationDetail`، `getlocalDateTime`، `markManualCharges`، `localize`، `save`، `showCalculationDetail`.
- وحدة `tenant.views.crs.vouchers.invoices.createOrEditLimoModal`: `rounding`، `getColspan`، `chargesTypeVoucherLineRepeat`، `sumPerTrip`، `sumTaxPerTrip`، `localize`، `rounding`، `editTripChargesModal`، `branchTaxCode`، `moduleChanged`، `localize`، `agreementChanged`، `cancel`، `calculateTaxPerRow`، `sumAmountTax`، `taxAcceptedChanged`، `addRow`، `getlocalDateTime`، `addLimoRow`، `searchAndAddMultipleTrips`، `uploadDocument`، `getOriginalName`، `searchTrips`، `tripSelected`، `removeLimoRow`، `searchCustomers`، `searchVehicles`، `searchCustomerPopoup`، `setTaxPercentOnTaxCode`، `onCustomerSelect`، `save`، `removeDocument`، `normalizeTripCharges`.
- وحدة `tenant.views.crs.limousine.trips.createLogModal`: `cancel`، `getlocalDateTime`، `save`.
- وحدة `tenant.views.crs.vouchers.invoices.changeChargesModal`: `cancel`، `rounding`، `sumChargesTax`، `calculateTaxPerRow`، `getlocalDateTime`، `save`.
- وحدة `tenant.views.crs.vouchers.invoices.uploadDocumentsModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.crs.vouchers.invoices.searchTripModal`: `searchTrips`، `save`، `cancel`.
- وحدة `tenant.views.crs.vouchers.invoices.printTemplates.printPreview`: `exportToPDF`، `exportToWord`، `exportPrintToWord`، `cancel`، `ok`، `getTemplateUrl`.
- وحدة `tenant.views.crs.contacts.uploadDocumentModal`: `save`، `cancel`.
- وحدة `tenant.views.crs.contacts.uploadDocumentModal`: `save`، `cancel`.
- وحدة `tenant.views.common.documents.uploadDocumentModal`: `uploadHeader`، `uploader.onBeforeUploadItem`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.common.documents.uploadImageModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.common.documents.addCreditCardModal`: `ab`، `cardNumberChanged`، `save`، `cancel`.
- وحدة `tenant.views.crs.limousine.trips.driverForcedSelectionReasonModal`: `ok`، `cancel`.
- وحدة `tenant.views.crs.limousine.trips.chargesTypeCalcDetailModal`: `rounding`، `calculateTotalFare`، `calculateChargesPerRow`، `localize`، `cancel`، `save`.
- وحدة `tenant.views.crs.vouchers.invoices.searchandAddMultipleTripsModal`: `cancel`، `getlocalDateTime`، `applyChange`، `save`، `getTrips`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.commonLookup.getTariffGroups` | POST | api/services/app/commonLookup/GetTariffGroups | [المصدر](../../../raw/application.js#L364723) |
| `abp.services.app.commonLookup.getLocationsActiveAndInActive` | POST | api/services/app/commonLookup/GetLocationsActiveAndInActive | [المصدر](../../../raw/application.js#L250901) |
| `abp.services.app.commonLookup.getTripTypes` | POST | api/services/app/commonLookup/GetTripTypes | [المصدر](../../../raw/application.js#L364730) |
| `abp.services.app.vehicle.searchVehicles` | POST | api/services/app/vehicle/SearchVehicles | [المصدر](../../../raw/application.js#L343292) |
| `abp.services.app.directory.search` | POST | api/services/app/directory/Search | [المصدر](../../../raw/application.js#L343285) |
| `abp.services.app.directory.searchDriverForLimoGrid` | POST | api/services/app/directory/SearchDriverForLimoGrid | [المصدر](../../../raw/application.js#L250940) |
| `abp.services.app.limoTripSearch.getTrips` | POST | api/services/app/limoTripSearch/GetTrips | [المصدر](../../../raw/application.js#L251134) |
| `abp.services.app.limoTripExport.exportToExcel` | POST | api/services/app/limoTripExport/ExportToExcel | [المصدر](../../../raw/application.js#L251703) |
| `abp.services.app.limoTrip.cancelTrip` | POST | api/services/app/limoTrip/CancelTrip | [المصدر](../../../raw/application.js#L251928) |
| `abp.services.app.limoTrip.noShowTrip` | POST | api/services/app/limoTrip/NoShowTrip | [المصدر](../../../raw/application.js#L251943) |
| `abp.services.app.limoTrip.driverReady` | POST | api/services/app/limoTrip/DriverReady | [المصدر](../../../raw/application.js#L251958) |
| `abp.services.app.limoTrip.driverMoved` | POST | api/services/app/limoTrip/DriverMoved | [المصدر](../../../raw/application.js#L251973) |
| `abp.services.app.limoTrip.deleteTrip` | POST | api/services/app/limoTrip/DeleteTrip | [المصدر](../../../raw/application.js#L251988) |
| `abp.services.app.limoTrip.getTripForEdit` | POST | api/services/app/limoTrip/GetTripForEdit | [المصدر](../../../raw/application.js#L254027) |
| `abp.services.app.invoice.generateLimoInvoices` | POST | api/services/app/invoice/GenerateLimoInvoices | [المصدر](../../../raw/application.js#L252019) |
| `abp.services.app.directory.getContactInfo` | POST | api/services/app/directory/GetContactInfo | [المصدر](../../../raw/application.js#L254924) |
| `abp.services.app.tenantSettings.getGridOptionsAdvanceSetting` | POST | api/services/app/tenantSettings/GetGridOptionsAdvanceSetting | [المصدر](../../../raw/application.js#L252107) |
| `abp.services.app.directory.searchDirectoryPaged` | POST | api/services/app/directory/SearchDirectoryPaged | [المصدر](../../../raw/application.js#L184853) |
| `abp.services.app.vehicleModel.searchVehicleModelsNew` | POST | api/services/app/vehicleModel/SearchVehicleModelsNew | [المصدر](../../../raw/application.js#L248764) |
| `abp.services.app.vehicle.searchVehiclesPagedWorkShop` | POST | api/services/app/vehicle/SearchVehiclesPagedWorkShop | [المصدر](../../../raw/application.js#L312796) |
| `abp.services.app.vehicle.searchVehiclesPagedByAgreement` | POST | [object Object] | [المصدر](../../../raw/application.js#L312800) |
| `abp.services.app.vehicle.searchVehiclesPaged` | POST | api/services/app/vehicle/SearchVehiclesPaged | [المصدر](../../../raw/application.js#L312803) |
| `abp.services.app.vehicle.exportToExcelByAgreement` | POST | api/services/app/vehicle/ExportToExcelByAgreement | [المصدر](../../../raw/application.js#L312885) |
| `abp.services.app.commonLookup.getLocations` | POST | api/services/app/commonLookup/GetLocations | [المصدر](../../../raw/application.js#L342874) |
| `abp.services.app.statementOfAccounts.getCurrentBalanceByContactId` | POST | api/services/app/statementOfAccounts/GetCurrentBalanceByContactId | [المصدر](../../../raw/application.js#L253429) |
| `abp.services.app.country.searchCountries` | POST | api/services/app/country/SearchCountries | [المصدر](../../../raw/application.js#L183560) |
| `abp.services.app.directory.updateContactInfo` | POST | api/services/app/directory/UpdateContactInfo | [المصدر](../../../raw/application.js#L253521) |
| `abp.services.app.receipt.processPaymentAndCreateReceipt` | غير مربوط | غير محسوم | [المصدر](../../../raw/application.js#L253540) |
| `abp.services.app.receipt.createLimoCCReceipt` | POST | api/services/app/receipt/CreateLimoCCReceipt | [المصدر](../../../raw/application.js#L253562) |
| `abp.services.app.receipt.getPaymentUrl` | POST | api/services/app/receipt/GetPaymentUrl | [المصدر](../../../raw/application.js#L253582) |
| `abp.services.app.receipt.proceedPaymentThroughCreditBalance` | POST | api/services/app/receipt/ProceedPaymentThroughCreditBalance | [المصدر](../../../raw/application.js#L253598) |
| `abp.services.app.limoTrip.getTripsForPaymentProcessing` | POST | api/services/app/limoTrip/GetTripsForPaymentProcessing | [المصدر](../../../raw/application.js#L253611) |
| `abp.services.app.directory.searchPersonStaffCustomer` | POST | api/services/app/directory/SearchPersonStaffCustomer | [المصدر](../../../raw/application.js#L248803) |
| `abp.services.app.limoTrip.getStaffShiftByVehicleOrDriver` | POST | api/services/app/limoTrip/GetStaffShiftByVehicleOrDriver | [المصدر](../../../raw/application.js#L247894) |
| `abp.services.app.commonLookup.getLocationById` | POST | api/services/app/commonLookup/GetLocationById | [المصدر](../../../raw/application.js#L342913) |
| `abp.services.app.limoTrip.getContactPersonsByCustomer` | POST | [object Object] | [المصدر](../../../raw/application.js#L254908) |
| `abp.services.app.commonLookup.searchContact` | POST | api/services/app/commonLookup/SearchContact | [المصدر](../../../raw/application.js#L254391) |
| `abp.services.app.commonLookup.searchCustomLookups` | POST | api/services/app/commonLookup/SearchCustomLookups | [المصدر](../../../raw/application.js#L182861) |
| `abp.services.app.directory.searchStaff` | POST | api/services/app/directory/SearchStaff | [المصدر](../../../raw/application.js#L247865) |
| `abp.services.app.commonLookup.searchLimoPlaces` | POST | api/services/app/commonLookup/SearchLimoPlaces | [المصدر](../../../raw/application.js#L254371) |
| `abp.services.app.googleMapAPI.getDistanceWithTime` | POST | api/services/app/googleMapAPI/GetDistanceWithTime | [المصدر](../../../raw/application.js#L249450) |
| `abp.services.app.limoTrip.calculateCharges` | POST | api/services/app/limoTrip/CalculateCharges | [المصدر](../../../raw/application.js#L250471) |
| `abp.services.app.limoQuotation.getQuotationForEdit` | POST | api/services/app/limoQuotation/GetQuotationForEdit | [المصدر](../../../raw/application.js#L249764) |
| `abp.services.app.limoTrip.getPerDayAndHourTripCount` | POST | api/services/app/limoTrip/GetPerDayAndHourTripCount | [المصدر](../../../raw/application.js#L249959) |
| `abp.services.app.limoTrip.createOrUpdateTrip` | POST | api/services/app/limoTrip/CreateOrUpdateTrip | [المصدر](../../../raw/application.js#L250088) |
| `abp.services.app.invoice.createOrUpdateInvoice` | POST | api/services/app/invoice/CreateOrUpdateInvoice | [المصدر](../../../raw/application.js#L343427) |
| `abp.services.app.limoTrip.updateVehicle` | POST | api/services/app/limoTrip/UpdateVehicle | [المصدر](../../../raw/application.js#L254096) |
| `abp.services.app.limoTrip.dispatchTrip` | POST | api/services/app/limoTrip/DispatchTrip | [المصدر](../../../raw/application.js#L250311) |
| `abp.services.app.limoTrip.assignTrip` | POST | api/services/app/limoTrip/AssignTrip | [المصدر](../../../raw/application.js#L247968) |
| `abp.services.app.limoTripSearch.getCheckList` | POST | api/services/app/limoTripSearch/GetCheckList | [المصدر](../../../raw/application.js#L254901) |
| `abp.services.app.limoTripSearch.getTripForView` | POST | api/services/app/limoTripSearch/GetTripForView | [المصدر](../../../raw/application.js#L254937) |
| `abp.services.app.limoTrip.startTrip` | POST | api/services/app/limoTrip/StartTrip | [المصدر](../../../raw/application.js#L253917) |
| `abp.services.app.limoTrip.finishTrip` | POST | api/services/app/limoTrip/FinishTrip | [المصدر](../../../raw/application.js#L250503) |
| `abp.services.app.tripType.getTripTypeSettingForEdit` | POST | api/services/app/tripType/GetTripTypeSettingForEdit | [المصدر](../../../raw/application.js#L250523) |
| `abp.services.app.limoTrip.getTripLogs` | POST | api/services/app/limoTrip/GetTripLogs | [المصدر](../../../raw/application.js#L252999) |
| `abp.services.app.limoTrip.updateCharges` | POST | api/services/app/limoTrip/UpdateCharges | [المصدر](../../../raw/application.js#L254487) |
| `abp.services.app.googleMapAPI.getMap` | POST | api/services/app/googleMapAPI/GetMap | [المصدر](../../../raw/application.js#L254251) |
| `abp.services.app.limoTrip.importFromExcel` | POST | [object Object] | [المصدر](../../../raw/application.js#L254530) |
| `abp.services.app.limoTrip.generateImportedTrips` | POST | api/services/app/limoTrip/GenerateImportedTrips | [المصدر](../../../raw/application.js#L254594) |
| `abp.services.app.commonLookup.searchAgreementByNoForInvoice` | POST | api/services/app/commonLookup/SearchAgreementByNoForInvoice | [المصدر](../../../raw/application.js#L343774) |
| `abp.services.app.commonAgreement.getAllAgreementsOnCustomer` | POST | api/services/app/commonAgreement/GetAllAgreementsOnCustomer | [المصدر](../../../raw/application.js#L343841) |
| `abp.services.app.commonAgreement.getOpenAgreementsOnCustomer` | POST | api/services/app/commonAgreement/GetOpenAgreementsOnCustomer | [المصدر](../../../raw/application.js#L344434) |
| `abp.services.app.commonAgreement.getClosedAgreementsOnCustomer` | POST | api/services/app/commonAgreement/GetClosedAgreementsOnCustomer | [المصدر](../../../raw/application.js#L344437) |
| `abp.services.app.item.searchItems` | POST | api/services/app/item/SearchItems | [المصدر](../../../raw/application.js#L344461) |
| `abp.services.app.account.searchAccountsForSubLookUp` | POST | api/services/app/account/SearchAccountsForSubLookUp | [المصدر](../../../raw/application.js#L344471) |
| `abp.services.app.invoice.importFromExcel` | POST | [object Object] | [المصدر](../../../raw/application.js#L344510) |
| `abp.services.app.chargesSetting.getConfiguredChargesTypes` | POST | api/services/app/chargesSetting/GetConfiguredChargesTypes | [المصدر](../../../raw/application.js#L344683) |
| `abp.services.app.limoTrip.getInvoiceTrips` | POST | api/services/app/limoTrip/GetInvoiceTrips | [المصدر](../../../raw/application.js#L344716) |
| `abp.services.app.costCenter.searchCostCenters` | POST | api/services/app/costCenter/SearchCostCenters | [المصدر](../../../raw/application.js#L344748) |
| `abp.services.app.invoice.getInvoiceForEdit` | POST | api/services/app/invoice/GetInvoiceForEdit | [المصدر](../../../raw/application.js#L344757) |
| `abp.services.app.chargesSetting.getChargesTypes` | POST | api/services/app/chargesSetting/GetChargesTypes | [المصدر](../../../raw/application.js#L182581) |
| `abp.services.app.directory.searchSalesPersonOne` | POST | api/services/app/directory/SearchSalesPersonOne | [المصدر](../../../raw/application.js#L182778) |
| `abp.services.app.commonLookup.getCustomLookups` | POST | api/services/app/commonLookup/GetCustomLookups | [المصدر](../../../raw/application.js#L182869) |
| `abp.services.app.person.createOrUpdatePerson` | POST | api/services/app/person/CreateOrUpdatePerson | [المصدر](../../../raw/application.js#L183236) |
| `abp.services.app.contactGroup.getContactGroupsOnContactType` | POST | api/services/app/contactGroup/GetContactGroupsOnContactType | [المصدر](../../../raw/application.js#L183448) |
| `abp.services.app.taxCode.getTaxCodes` | POST | api/services/app/taxCode/GetTaxCodes | [المصدر](../../../raw/application.js#L183456) |
| `abp.services.app.currency.getCurrencies` | POST | api/services/app/currency/GetCurrencies | [المصدر](../../../raw/application.js#L183468) |
| `abp.services.app.tariffCard.getActiveTariffCards` | POST | api/services/app/tariffCard/GetActiveTariffCards | [المصدر](../../../raw/application.js#L183703) |
| `abp.services.app.tariffCard.getTariffCardById` | POST | api/services/app/tariffCard/GetTariffCardById | [المصدر](../../../raw/application.js#L183716) |
| `abp.services.app.person.getAdvanceSettings` | POST | api/services/app/person/GetAdvanceSettings | [المصدر](../../../raw/application.js#L183744) |
| `abp.services.app.person.getHighLightBlackListCountry` | POST | [object Object] | [المصدر](../../../raw/application.js#L183768) |
| `abp.services.app.person.getNationalIdFormate` | POST | [object Object] | [المصدر](../../../raw/application.js#L183774) |
| `abp.services.app.person.getPersonForEdit` | POST | api/services/app/person/GetPersonForEdit | [المصدر](../../../raw/application.js#L183903) |
| `abp.services.app.person.getContactCards` | POST | api/services/app/person/GetContactCards | [المصدر](../../../raw/application.js#L184004) |
| `abp.services.app.commonLookup.validateCreditLimit` | POST | api/services/app/commonLookup/ValidateCreditLimit | [المصدر](../../../raw/application.js#L184099) |
| `abp.services.app.limoTrip.getChauffeurQueue` | POST | api/services/app/limoTrip/GetChauffeurQueue | [المصدر](../../../raw/application.js#L253836) |
| `abp.services.app.commonLookup.searchTripsForInvoice` | POST | api/services/app/commonLookup/SearchTripsForInvoice | [المصدر](../../../raw/application.js#L364764) |
| `abp.services.app.invoice.getLimoInvoiceForEdit` | POST | api/services/app/invoice/GetLimoInvoiceForEdit | [المصدر](../../../raw/application.js#L343500) |
| `abp.services.app.limoTrip.addTripLog` | POST | api/services/app/limoTrip/AddTripLog | [المصدر](../../../raw/application.js#L248566) |
| `abp.services.app.person.uploadDocumentImage` | POST | api/services/app/person/UploadDocumentImage | [المصدر](../../../raw/application.js#L185476) |
| `abp.services.app.limoTripSearch.searchTripsToInvoice` | POST | api/services/app/limoTripSearch/SearchTripsToInvoice | [المصدر](../../../raw/application.js#L364738) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.Limousine.Import`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Limousine.Trips.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Limousine.Trips.Tentative`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Limousine.Trips`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Limousine.Trips.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Limousine.Trips.EditFinishTrip`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Limousine.Trips.EditInvoicedTrip`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Limousine.Trips.Dispatch`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Limousine.Trips.Start`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Limousine.Trips.Finish`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Limousine.Trips.Cancel`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Limousine.Trips.ViewTripLogs`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Limousine.Trips.Delete`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Limousine.CustomerWebApp`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Limousine.Trips.ChangeCharges`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Limousine.Trips.CanViewCharges`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Limousine.Trips.ViewOtherBranchTrips`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Limousine.Trips.AllActionsOnOtherBranchTrips`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Limousine.Process_CreditCard.Payment`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Delete`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vehicles.ViewOtherBranchVehicles`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Limousine.Trips.CanSelectOtherGroupsVehicleOnDispatchment`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Limousine.Trips.CanEnterChangeDriverCommision`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Invoices.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Invoices.MultiModalMiscInvoices`: ممنوحة في السياق الملتقط.
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
- صلاحية `Pages.Tenant.Vouchers.Invoices.AllActionsOnOtherBranchInvoices`: ممنوحة في السياق الملتقط.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.filters.tripNo` | text |  |  |
| `vm.filters.manualTripNo` | text |  |  |
| `vm.filters.fromDate` | input |  |  |
| `vm.filters.toDate` | input |  |  |
| `vm.filters.locationId` | select | locationId |  |
| `vm.filters.guestName` | text |  |  |
| `vm.filters.vehicle` | ui-select |  |  |
| `vm.filters.customer` | ui-select |  |  |
| `vm.filters.driver` | ui-select |  |  |
| `vm.filters.invoicedUnInvoiced` | select | locationId | ng-options=invoiced.id as invoiced.name for invoiced in vm.tripsInvoiced |
| `vm.filters.tripTypeId` | select | tripTypeId | ng-options=tripType.id as tripType.name for tripType in vm.tripTypes |
| `vm.filters.supplier` | ui-select |  |  |
| `vm.filters.prepaymentStatus` | select | tripTypeId | ng-options=prepaymentStatus.id as prepaymentStatus.name for prepaymentStatus in vm.prepaymentStatuses |
| `vm.filters.tariffGroupId` | select | vehicleType | ng-options=group.id as group.title for group in vm.tariffGroups |
| `vm.filters.limoCustomField` | text |  |  |
| `vm.filters.limoCustomField1` | text |  |  |
| `vm.filters.customField1` | text |  |  |
| `vm.filters.tripSubStatus` | select | tripTypeId | ng-options=subStatus.id as subStatus.name for subStatus in vm.tripSubStatus |
| `vm.filters.zeroAmountTrips` | checkbox | ZeroAmountTrips |  |
| `vm.filters.isOutOfCityPickUpLocation` | checkbox | IsOutOfCityPickUpLocation |  |
| `vm.filters.isOutOfCityDropOffLocation` | checkbox | IsOutOfCityDropOffLocation |  |
| `vm.filters.isPortalTripsOnly` | checkbox | IsPortalTripsOnly |  |
| `vm.filters.showTripsWithZeroTime` | checkbox | ShowTripsWithZeroTime |  |
| `vm.filters.tripsWithWaitingTime` | checkbox | tripsWithWaitingTime |  |
| `vm.filters.externalVehicleTrips` | checkbox | externalVehicleTrips |  |
| `vm.filters.waitingMinutesThreshold` | text |  | ng-if=vm.filters.tripsWithWaitingTime && !vm.isCustomerLogin |
| `tripStatusRow.selected` | checkbox | tripStatusRow{{$index}} |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
