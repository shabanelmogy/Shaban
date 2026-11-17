# شاشة: Rental Planner

المسار في القائمة: Rental ← Rental Planner.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_rentalPlanner`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0300](../../../readable/routes/R0300--tenant-crs-rentalplanner.js)، والأصل [raw/application.js:3676](../../../raw/application.js#L3676).
- قالب الشاشة: `~/App/tenant/views/crs/rentalPlanner/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.rentalplanner.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.rentalplanner.index](../../../readable/controllers/C0964--tenant.views.rentalplanner.index.js) | 23 | 4 |
| [tenant.views.crs.workshopMovements.viewModal](../../../readable/controllers/C1461--tenant.views.crs.workshopMovements.viewModal.js) | 5 | 2 |
| [tenant.views.crs.staffMovements.closeStaffMovement](../../../readable/controllers/C1117--tenant.views.crs.staffMovements.closeStaffMovement.js) | 6 | 4 |
| [tenant.views.crs.agreements.viewModal](../../../readable/controllers/C0553--tenant.views.crs.agreements.viewModal.js) | 25 | 6 |
| [tenant.views.crs.lease.agreements.viewModal](../../../readable/controllers/C0855--tenant.views.crs.lease.agreements.viewModal.js) | 18 | 7 |
| [tenant.views.crs.rentalPlanner.createOrEditModal](../../../readable/controllers/C0963--tenant.views.crs.rentalPlanner.createOrEditModal.js) | 45 | 17 |
| [tenant.views.workshop.jobs.viewModalRental](../../../readable/controllers/C1815--tenant.views.workshop.jobs.viewModalRental.js) | 5 | 2 |
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
| [tenant.views.crs.lease.agreements.mileageChargesInfoModal](../../../readable/controllers/C0851--tenant.views.crs.lease.agreements.mileageChargesInfoModal.js) | 1 | 0 |
| [tenant.views.crs.contacts.searchContactModal](../../../readable/controllers/C0706--tenant.views.crs.contacts.searchContactModal.js) | 7 | 2 |
| [tenant.views.crs.vehicles.searchVehicleModal](../../../readable/controllers/C1186--tenant.views.crs.vehicles.searchVehicleModal.js) | 13 | 11 |
| [tenant.views.crs.bookings.bookingAdvance](../../../readable/controllers/C0659--tenant.views.crs.bookings.bookingAdvance.js) | 3 | 2 |
| [tenant.views.crs.discountCodes.applyDiscountModal](../../../readable/controllers/C0304--tenant.views.crs.discountCodes.applyDiscountModal.js) | 4 | 0 |
| [tenant.views.crs.discountCodes.applyDiscountModal](../../../readable/controllers/C0774--tenant.views.crs.discountCodes.applyDiscountModal.js) | 5 | 1 |
| [tenant.views.crs.contacts.uploadDocumentModal](../../../readable/controllers/C0699--tenant.views.crs.contacts.uploadDocumentModal.js) | 2 | 1 |
| [tenant.views.crs.contacts.uploadDocumentModal](../../../readable/controllers/C0711--tenant.views.crs.contacts.uploadDocumentModal.js) | 2 | 1 |
| [tenant.views.common.documents.uploadDocumentModal](../../../readable/controllers/C0362--tenant.views.common.documents.uploadDocumentModal.js) | 4 | 0 |
| [tenant.views.common.documents.uploadImageModal](../../../readable/controllers/C0363--tenant.views.common.documents.uploadImageModal.js) | 3 | 0 |
| [tenant.views.common.documents.addCreditCardModal](../../../readable/controllers/C0701--tenant.views.common.documents.addCreditCardModal.js) | 4 | 0 |
| [tenant.views.crs.companies.createOrUpdateDriverModal](../../../readable/controllers/C0696--tenant.views.crs.companies.createOrUpdateDriverModal.js) | 28 | 13 |
| [tenant.views.crs.vehicles.printDocumentModel](../../../readable/controllers/C1178--tenant.views.crs.vehicles.printDocumentModel.js) | 1 | 1 |
| [tenant.views.movements.uploadDocument](../../../readable/controllers/C1635--tenant.views.movements.uploadDocument.js) | 3 | 1 |
| [tenant.views.crs.vouchers.invoices.uploadDocumentsModal](../../../readable/controllers/C1355--tenant.views.crs.vouchers.invoices.uploadDocumentsModal.js) | 3 | 0 |
| [tenant.views.crs.vouchers.invoices.allocationsViewModel](../../../readable/controllers/C1311--tenant.views.crs.vouchers.invoices.allocationsViewModel.js) | 4 | 1 |
| [tenant.views.crs.discountCodes.verifyAuthCodeModal](../../../readable/controllers/C0778--tenant.views.crs.discountCodes.verifyAuthCodeModal.js) | 2 | 1 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.rentalplanner.index`: `getzoomLevel`، `zoomIn`، `zoomOut`، `SetupPrototypes`، `openViewAgreementModal`، `getlocalDate`، `GetEndOfPeriod`، `GotoTimeShift_Clicked`، `GetSelectedPeriod`، `dateRangeChange`، `reduceDay`، `addDay`، `addBooking`، `editBooking`، `getFormatedDate`، `SelectPeriod`، `update`، `FillSchedule`، `CreateSections`، `FillSections`، `createOrUpdateResourceTimeline`، `initalize`، `init`.
- وحدة `tenant.views.crs.workshopMovements.viewModal`: `getlocalDateTime`، `getFuelLevel`، `openJobViewModel`، `cancel`، `getOriginalName`.
- وحدة `tenant.views.crs.staffMovements.closeStaffMovement`: `getMovementSubType`، `searchVehicles`، `getlocalDateTime`، `getFuelLevel`، `cancel`، `save`.
- وحدة `tenant.views.crs.agreements.viewModal`: `getlocalDateTime`، `openMovementLogsModal`، `getlocalDate`، `currencyAndRoundingWithThree`، `roundingforView`، `localize`، `localizeChargesType`، `getFuelLevel`، `rounding`، `calculate`، `viewContact`، `viewVehicle`، `openMileageInfoModal`، `printModel`، `editMovement`، `viewMovement`، `showTollsDetail`، `showDarbsDetail`، `showParkingDetail`، `fetchParking`، `showFinesDetail`، `cancel`، `totalDaysAndTime`، `viewInvoice`، `getOutStandingBalance`.
- وحدة `tenant.views.crs.lease.agreements.viewModal`: `getlocalDateTime`، `getlocalDate`، `localize`، `localizeChargesType`، `roundingforView`، `editMovement`، `getFuelLevel`، `viewMovement`، `openMovementLogsModal`، `viewContact`، `openMileageInfoModal`، `showTollsDetail`، `showFinesDetail`، `showParkingDetail`، `fetchParking`، `getClauses`، `cancel`، `viewInvoice`.
- وحدة `tenant.views.crs.rentalPlanner.createOrEditModal`: `searchGoogleLocations`، `rounding`، `otherPickUpLocationChanged`، `otherDropoffLocationChanged`، `localize`، `searchVehicles`، `driverSelected`، `searchDrivers`، `commonDriverSearch`، `searchDrivers`، `searchDriverPopoup`، `changeStatusReceiptCreation`، `searchVehiclePopup`، `agreementTypeSelected`، `startDateChanged`، `endDateChanged`، `calculate`، `tariffGroupSelected`، `tariffOptionSelected`، `disableRate`، `searchCustomers`، `searchCustomerPopoup`، `searchDrivers`، `vehicleSelected`، `getTariffCards`، `getTariffCards`، `tariffCardSelected`، `onCustomerSelect`، `individualCustomerRadioSelected`، `searchDrivers`، `searchDrivers`، `searchDrivers`، `onVehicleSelect`، `save`، `applyDiscount`، `cancel`، `getTariffLocations`، `getTariffGroups`، `includedChanged`، `taxAcceptedChanged`، `showTaxCollectionReport`، `totalDaysAndTime`، `sendBookingEmail`، `printBooking`، `resetFields`.
- وحدة `tenant.views.workshop.jobs.viewModalRental`: `cancel`، `getFaultValue`، `getJobTypeName`، `getInsuranceTypeName`، `viewRelatedEstimation`.
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
- وحدة `tenant.views.crs.lease.agreements.mileageChargesInfoModal`: `cancel`.
- وحدة `tenant.views.crs.contacts.searchContactModal`: `searchContacts`، `cancel`، `showAddContact`، `contactSelected`، `contactEdit`، `getContactsList`، `getNameWithCode`.
- وحدة `tenant.views.crs.vehicles.searchVehicleModal`: `statusChanged`، `searchModel`، `cancel`، `clearInput`، `clearVehicle`، `getlocalDateTime`، `fromDateTimeChanged`، `searchVehicles`، `searchVehiclesFilters`، `exportToExcelByAgreement`، `vehicleSelected`، `getBookingDate`، `getTeriffGroups`.
- وحدة `tenant.views.crs.bookings.bookingAdvance`: `amountChanged`، `cancel`، `ok`.
- وحدة `tenant.views.crs.discountCodes.applyDiscountModal`: `calculateDiscountedRate`، `calculateDiscountedPercentage`، `verifyAuthCode`، `applyDiscount`.
- وحدة `tenant.views.crs.discountCodes.applyDiscountModal`: `calculateDiscountedRate`، `calculateDiscountedPercentage`، `verifyAuthCode`، `getBranchWiseDiscount`، `applyDiscount`.
- وحدة `tenant.views.crs.contacts.uploadDocumentModal`: `save`، `cancel`.
- وحدة `tenant.views.crs.contacts.uploadDocumentModal`: `save`، `cancel`.
- وحدة `tenant.views.common.documents.uploadDocumentModal`: `uploadHeader`، `uploader.onBeforeUploadItem`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.common.documents.uploadImageModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.common.documents.addCreditCardModal`: `ab`، `cardNumberChanged`، `save`، `cancel`.
- وحدة `tenant.views.crs.companies.createOrUpdateDriverModal`: `getlocalDateTime`، `getCardType`، `removeRow`، `searchSalesPersons`، `searchSalesPersonPopoup`، `salesPersonSelected`، `getDocsByContactId`، `searchCustomLookup`، `scanDocument`، `openUploadDocument`، `addCreditCardRow`، `updateCreditCardRow`، `save`، `cancel`، `doesIdentityDoucmentExist`، `addIndentityDocument`، `getIdentificationDocumentType`، `removeIndentityDocument`، `searchCountries`، `searchCompany`، `emiratesDataReader`، `emiratesDataFieldManager`، `getTariffCards`، `isDocument`، `isFieldMondatory`، `isAdditionalFieldsEnabled`، `typeOfFeild`، `getAdvanceSettings`.
- وحدة `tenant.views.crs.vehicles.printDocumentModel`: `cancel`.
- وحدة `tenant.views.movements.uploadDocument`: `save`، `cancel`، `uploader.onSuccessItem`.
- وحدة `tenant.views.crs.vouchers.invoices.uploadDocumentsModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.crs.vouchers.invoices.allocationsViewModel`: `cancel`، `sumAmount`، `localize`، `getlocalDate`.
- وحدة `tenant.views.crs.discountCodes.verifyAuthCodeModal`: `cancel`، `verifyCode`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.make.getMakes` | POST | api/services/app/make/GetMakes | [المصدر](../../../raw/application.js#L260645) |
| `abp.services.app.rentalPlanner.getVehicleWithAgreements` | POST | api/services/app/rentalPlanner/GetVehicleWithAgreements | [المصدر](../../../raw/application.js#L261649) |
| `abp.services.app.chargesSetting.getChargesSettings` | POST | api/services/app/chargesSetting/GetChargesSettings | [المصدر](../../../raw/application.js#L261676) |
| `abp.services.app.job.getWorkoderAndJobsForRentalTenant` | POST | api/services/app/job/GetWorkoderAndJobsForRentalTenant | [المصدر](../../../raw/application.js#L399707) |
| `abp.services.app.workshopMovement.getWorkshopMovementForEdit` | POST | api/services/app/workshopMovement/GetWorkshopMovementForEdit | [المصدر](../../../raw/application.js#L399749) |
| `abp.services.app.vehicle.searchVehicles` | POST | api/services/app/vehicle/SearchVehicles | [المصدر](../../../raw/application.js#L312838) |
| `abp.services.app.commonLookup.getLocations` | POST | api/services/app/commonLookup/GetLocations | [المصدر](../../../raw/application.js#L180573) |
| `abp.services.app.nrm.closeNRM` | POST | api/services/app/nrm/CloseNRM | [المصدر](../../../raw/application.js#L294113) |
| `abp.services.app.nrm.getNRMForEdit` | POST | api/services/app/nrm/GetNRMForEdit | [المصدر](../../../raw/application.js#L294136) |
| `abp.services.app.directory.searchCustomerPhoto` | POST | api/services/app/directory/SearchCustomerPhoto | [المصدر](../../../raw/application.js#L235402) |
| `abp.services.app.parkingTicket.getParkingTicket` | POST | api/services/app/parkingTicket/GetParkingTicket | [المصدر](../../../raw/application.js#L145561) |
| `abp.services.app.commonAgreement.getExcessKMsOnAgreement` | POST | api/services/app/commonAgreement/GetExcessKMsOnAgreement | [المصدر](../../../raw/application.js#L235678) |
| `abp.services.app.commonAgreement.getAgreementLogs` | POST | api/services/app/commonAgreement/GetAgreementLogs | [المصدر](../../../raw/application.js#L235706) |
| `abp.services.app.directory.getCustomerOutstandingBalance` | POST | api/services/app/directory/GetCustomerOutstandingBalance | [المصدر](../../../raw/application.js#L150506) |
| `abp.services.app.rentalAgreementSearch.getAgreementForView` | POST | api/services/app/rentalAgreementSearch/GetAgreementForView | [المصدر](../../../raw/application.js#L150530) |
| `abp.services.app.leaseClause.getClausesForEdit` | POST | api/services/app/leaseClause/GetClausesForEdit | [المصدر](../../../raw/application.js#L235655) |
| `abp.services.app.leaseClause.getLeaseClauseTypes` | POST | api/services/app/leaseClause/GetLeaseClauseTypes | [المصدر](../../../raw/application.js#L235666) |
| `abp.services.app.leaseAgreementSearch.getLeaseAgreementForView` | POST | api/services/app/leaseAgreementSearch/GetLeaseAgreementForView | [المصدر](../../../raw/application.js#L235714) |
| `abp.services.app.commonLookup.searchGooglePlaces` | POST | api/services/app/commonLookup/SearchGooglePlaces | [المصدر](../../../raw/application.js#L259876) |
| `abp.services.app.directory.search` | POST | api/services/app/directory/Search | [المصدر](../../../raw/application.js#L181132) |
| `abp.services.app.tariffCard.getTariffCards` | POST | api/services/app/tariffCard/GetTariffCards | [المصدر](../../../raw/application.js#L181246) |
| `abp.services.app.directory.searchForCompany` | POST | api/services/app/directory/SearchForCompany | [المصدر](../../../raw/application.js#L260244) |
| `abp.services.app.booking.createOrUpdateBooking` | POST | api/services/app/booking/CreateOrUpdateBooking | [المصدر](../../../raw/application.js#L260353) |
| `abp.services.app.tariffLocation.getTariffLocations` | POST | api/services/app/tariffLocation/GetTariffLocations | [المصدر](../../../raw/application.js#L260439) |
| `abp.services.app.commonLookup.getTariffGroups` | POST | api/services/app/commonLookup/GetTariffGroups | [المصدر](../../../raw/application.js#L313062) |
| `abp.services.app.booking.getBookingWithAdvanceForEdit` | POST | api/services/app/booking/GetBookingWithAdvanceForEdit | [المصدر](../../../raw/application.js#L260532) |
| `abp.services.app.booking.sendBookingEmail` | POST | api/services/app/booking/SendBookingEmail | [المصدر](../../../raw/application.js#L260598) |
| `abp.services.app.job.viewJobForRentalTenant` | POST | api/services/app/job/ViewJobForRentalTenant | [المصدر](../../../raw/application.js#L495957) |
| `abp.services.app.labourActivity.getLabourActivities` | POST | api/services/app/labourActivity/GetLabourActivities | [المصدر](../../../raw/application.js#L495996) |
| `abp.services.app.movement.getMovementLogs` | POST | api/services/app/movement/GetMovementLogs | [المصدر](../../../raw/application.js#L449051) |
| `abp.services.app.chargesSetting.getChargesTypes` | POST | api/services/app/chargesSetting/GetChargesTypes | [المصدر](../../../raw/application.js#L179287) |
| `abp.services.app.directory.searchSalesPersonOne` | POST | api/services/app/directory/SearchSalesPersonOne | [المصدر](../../../raw/application.js#L179720) |
| `abp.services.app.commonLookup.searchCustomLookups` | POST | api/services/app/commonLookup/SearchCustomLookups | [المصدر](../../../raw/application.js#L180737) |
| `abp.services.app.commonLookup.getCustomLookups` | POST | api/services/app/commonLookup/GetCustomLookups | [المصدر](../../../raw/application.js#L182869) |
| `abp.services.app.country.searchCountries` | POST | api/services/app/country/SearchCountries | [المصدر](../../../raw/application.js#L181210) |
| `abp.services.app.person.createOrUpdatePerson` | POST | api/services/app/person/CreateOrUpdatePerson | [المصدر](../../../raw/application.js#L183236) |
| `abp.services.app.contactGroup.getContactGroupsOnContactType` | POST | api/services/app/contactGroup/GetContactGroupsOnContactType | [المصدر](../../../raw/application.js#L181124) |
| `abp.services.app.taxCode.getTaxCodes` | POST | api/services/app/taxCode/GetTaxCodes | [المصدر](../../../raw/application.js#L179267) |
| `abp.services.app.currency.getCurrencies` | POST | api/services/app/currency/GetCurrencies | [المصدر](../../../raw/application.js#L180047) |
| `abp.services.app.tariffCard.getActiveTariffCards` | POST | api/services/app/tariffCard/GetActiveTariffCards | [المصدر](../../../raw/application.js#L180054) |
| `abp.services.app.tariffCard.getTariffCardById` | POST | api/services/app/tariffCard/GetTariffCardById | [المصدر](../../../raw/application.js#L180067) |
| `abp.services.app.person.getAdvanceSettings` | POST | api/services/app/person/GetAdvanceSettings | [المصدر](../../../raw/application.js#L183744) |
| `abp.services.app.person.getHighLightBlackListCountry` | POST | [object Object] | [المصدر](../../../raw/application.js#L183768) |
| `abp.services.app.person.getNationalIdFormate` | POST | [object Object] | [المصدر](../../../raw/application.js#L183774) |
| `abp.services.app.person.getPersonForEdit` | POST | api/services/app/person/GetPersonForEdit | [المصدر](../../../raw/application.js#L183903) |
| `abp.services.app.person.getContactCards` | POST | api/services/app/person/GetContactCards | [المصدر](../../../raw/application.js#L181343) |
| `abp.services.app.commonLookup.validateCreditLimit` | POST | api/services/app/commonLookup/ValidateCreditLimit | [المصدر](../../../raw/application.js#L180328) |
| `abp.services.app.commonLookup.getLocationsActiveAndInActive` | POST | api/services/app/commonLookup/GetLocationsActiveAndInActive | [المصدر](../../../raw/application.js#L179440) |
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
| `abp.services.app.vehicleModel.searchVehicleModelsNew` | POST | api/services/app/vehicleModel/SearchVehicleModelsNew | [المصدر](../../../raw/application.js#L312735) |
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
| `abp.services.app.toll.getTolls` | POST | api/services/app/toll/GetTolls | [المصدر](../../../raw/application.js#L141214) |
| `abp.services.app.commonAgreement.getAgreement` | POST | api/services/app/commonAgreement/GetAgreement | [المصدر](../../../raw/application.js#L142528) |
| `abp.services.app.uaeFine.ignoreFine` | POST | api/services/app/uaeFine/IgnoreFine | [المصدر](../../../raw/application.js#L142477) |
| `abp.services.app.uaeFine.getFines` | POST | api/services/app/uaeFine/GetFines | [المصدر](../../../raw/application.js#L142511) |
| `abp.services.app.costCenter.searchCostCenters` | POST | api/services/app/costCenter/SearchCostCenters | [المصدر](../../../raw/application.js#L365805) |
| `abp.services.app.asset.getAssetForEdit` | POST | api/services/app/asset/GetAssetForEdit | [المصدر](../../../raw/application.js#L365812) |
| `abp.services.app.limoTrip.getInvoiceTrips` | POST | api/services/app/limoTrip/GetInvoiceTrips | [المصدر](../../../raw/application.js#L365821) |
| `abp.services.app.invoiceSearch.getInvoiceForView` | POST | api/services/app/invoiceSearch/GetInvoiceForView | [المصدر](../../../raw/application.js#L365905) |
| `abp.services.app.directory.searchDirectoryPaged` | POST | api/services/app/directory/SearchDirectoryPaged | [المصدر](../../../raw/application.js#L184666) |
| `abp.services.app.vehicle.searchVehiclesPagedWorkShop` | POST | api/services/app/vehicle/SearchVehiclesPagedWorkShop | [المصدر](../../../raw/application.js#L312796) |
| `abp.services.app.vehicle.searchVehiclesPagedByAgreement` | POST | [object Object] | [المصدر](../../../raw/application.js#L312800) |
| `abp.services.app.vehicle.searchVehiclesPaged` | POST | api/services/app/vehicle/SearchVehiclesPaged | [المصدر](../../../raw/application.js#L312803) |
| `abp.services.app.vehicle.exportToExcelByAgreement` | POST | api/services/app/vehicle/ExportToExcelByAgreement | [المصدر](../../../raw/application.js#L312885) |
| `abp.services.app.billingMethod.getBillingMethods` | POST | api/services/app/billingMethod/GetBillingMethods | [المصدر](../../../raw/application.js#L171247) |
| `abp.services.app.commonLookup.getBankAccountsForSelection` | POST | api/services/app/commonLookup/GetBankAccountsForSelection | [المصدر](../../../raw/application.js#L171259) |
| `abp.services.app.userWiseDiscount.getBranchWiseUserDiscount` | POST | api/services/app/userWiseDiscount/GetBranchWiseUserDiscount | [المصدر](../../../raw/application.js#L201812) |
| `abp.services.app.person.uploadDocumentImage` | POST | api/services/app/person/UploadDocumentImage | [المصدر](../../../raw/application.js#L185476) |
| `abp.services.app.company.createOrUpdateCopmanyDriver` | POST | api/services/app/company/CreateOrUpdateCopmanyDriver | [المصدر](../../../raw/application.js#L181019) |
| `abp.services.app.company.getAdvanceSettingsForDriver` | POST | api/services/app/company/GetAdvanceSettingsForDriver | [المصدر](../../../raw/application.js#L181282) |
| `abp.services.app.person.getDriverForEdit` | POST | api/services/app/person/GetDriverForEdit | [المصدر](../../../raw/application.js#L181326) |
| `abp.services.app.vehicle.getVehicleForEdit` | POST | api/services/app/vehicle/GetVehicleForEdit | [المصدر](../../../raw/application.js#L312225) |
| `abp.services.app.movement.addDocument` | POST | api/services/app/movement/AddDocument | [المصدر](../../../raw/application.js#L449951) |
| `abp.services.app.allocation.getAllocations` | POST | api/services/app/allocation/GetAllocations | [المصدر](../../../raw/application.js#L342588) |
| `abp.services.app.discountAuthCode.verifyCode` | POST | api/services/app/discountAuthCode/VerifyCode | [المصدر](../../../raw/application.js#L202257) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.Movements.EnableMovementEditing`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vehicles.View`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Movements.EnableMovementLogs`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Bookings.AllActionsOnOtherBranchBookings`: ممنوحة في السياق الملتقط.
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
- صلاحية `Pages.Tenant.Contacts.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.LimitedEdit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Companies.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Companies.LimitedEdit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Integration.EInvoicingUAE`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Companies.CustomerApproval`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vehicles.AllActionsOnOtherBranchVehicles`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Invoices.MultiModalMiscInvoices`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Invoices.MarkDisputed`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Invoices.UnmarkDisputed`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Assets.Assets`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Delete`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vehicles.ViewOtherBranchVehicles`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Receipts.CanChangeDate`: ممنوحة في السياق الملتقط.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.dateRangeModel` | text |  | min=vm.dateRangeOptions.min; max=vm.dateRangeOptions.max |
| `vm.make` | select | make | ng-options=make.name as make.name for make in vm.makes |
| `vm.plateNo` | text |  |  |
| `vm.zoomLevel.label` | text |  |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
