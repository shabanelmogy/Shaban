# شاشة: Master Agreements

المسار في القائمة: Equipment Rental ← Master Agreements.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_ersMasterAgreements`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0661](../../../readable/routes/R0661--tenant-crs-ersmasteragreements.js)، والأصل [raw/application.js:6530](../../../raw/application.js#L6530).
- قالب الشاشة: `~/App/tenant/views/ers/masterAgreements/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.ers.masterAgreements.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.ers.masterAgreements.index](../../../readable/controllers/C1486--tenant.views.ers.masterAgreements.index.js) | 21 | 6 |
| [tenant.views.crs.contacts.searchContactModal](../../../readable/controllers/C0706--tenant.views.crs.contacts.searchContactModal.js) | 7 | 2 |
| [tenant.views.ers.masterAgreements.printTemplates.printPreview](../../../readable/controllers/C1491--tenant.views.ers.masterAgreements.printTemplates.printPreview.js) | 2 | 0 |
| [common.views.common.reportViewer](../../../readable/controllers/C0006--common.views.common.reportViewer.js) | 2 | 0 |
| [tenant.views.ers.masterAgreements.viewModal](../../../readable/controllers/C1490--tenant.views.ers.masterAgreements.viewModal.js) | 9 | 2 |
| [tenant.views.ers.masterAgreements.addOrViewSaleOrder](../../../readable/controllers/C1483--tenant.views.ers.masterAgreements.addOrViewSaleOrder.js) | 7 | 3 |
| [tenant.views.ers.masterAgreements.masterAgreementModal](../../../readable/controllers/C1487--tenant.views.ers.masterAgreements.masterAgreementModal.js) | 21 | 7 |
| [tenant.views.crs.contacts.createOrEditModal](../../../readable/controllers/C0703--tenant.views.crs.contacts.createOrEditModal.js) | 45 | 24 |
| [tenant.views.ers.rental.agreements.viewModal](../../../readable/controllers/C1505--tenant.views.ers.rental.agreements.viewModal.js) | 10 | 2 |
| [tenant.views.ers.lease.agreements.viewModal](../../../readable/controllers/C1480--tenant.views.ers.lease.agreements.viewModal.js) | 10 | 2 |
| [tenant.views.ers.rental.agreements.createOrEditModal](../../../readable/controllers/C1499--tenant.views.ers.rental.agreements.createOrEditModal.js) | 26 | 9 |
| [tenant.views.ers.lease.agreements.createOrEditModal](../../../readable/controllers/C1476--tenant.views.ers.lease.agreements.createOrEditModal.js) | 27 | 9 |
| [tenant.views.ers.masterAgreements.changeAccessoryChargesModal](../../../readable/controllers/C1484--tenant.views.ers.masterAgreements.changeAccessoryChargesModal.js) | 9 | 1 |
| [tenant.views.ers.deliveries.createOrEditModal](../../../readable/controllers/C1466--tenant.views.ers.deliveries.createOrEditModal.js) | 11 | 5 |
| [tenant.views.crs.vehicles.searchVehicleModal](../../../readable/controllers/C1186--tenant.views.crs.vehicles.searchVehicleModal.js) | 13 | 11 |
| [tenant.views.ers.deliveries.viewModal](../../../readable/controllers/C1473--tenant.views.ers.deliveries.viewModal.js) | 6 | 3 |
| [tenant.views.crs.contacts.uploadDocumentModal](../../../readable/controllers/C0699--tenant.views.crs.contacts.uploadDocumentModal.js) | 2 | 1 |
| [tenant.views.crs.contacts.uploadDocumentModal](../../../readable/controllers/C0711--tenant.views.crs.contacts.uploadDocumentModal.js) | 2 | 1 |
| [tenant.views.common.documents.uploadDocumentModal](../../../readable/controllers/C0362--tenant.views.common.documents.uploadDocumentModal.js) | 4 | 0 |
| [tenant.views.common.documents.uploadImageModal](../../../readable/controllers/C0363--tenant.views.common.documents.uploadImageModal.js) | 3 | 0 |
| [tenant.views.common.documents.addCreditCardModal](../../../readable/controllers/C0701--tenant.views.common.documents.addCreditCardModal.js) | 4 | 0 |
| [tenant.views.crs.companies.createOrEditModal](../../../readable/controllers/C0695--tenant.views.crs.companies.createOrEditModal.js) | 50 | 26 |
| [tenant.views.crs.agreements.mileageChargesInfoModal](../../../readable/controllers/C0541--tenant.views.crs.agreements.mileageChargesInfoModal.js) | 1 | 0 |
| [tenant.views.crs.agreements.printtemplates.printReplacementPreview](../../../readable/controllers/C0560--tenant.views.crs.agreements.printtemplates.printReplacementPreview.js) | 5 | 1 |
| [tenant.views.movements.viewModal](../../../readable/controllers/C1636--tenant.views.movements.viewModal.js) | 11 | 5 |
| [tenant.views.crs.discountCodes.applyDiscountModal](../../../readable/controllers/C0304--tenant.views.crs.discountCodes.applyDiscountModal.js) | 4 | 0 |
| [tenant.views.crs.discountCodes.applyDiscountModal](../../../readable/controllers/C0774--tenant.views.crs.discountCodes.applyDiscountModal.js) | 5 | 1 |
| [tenant.views.crs.vehicles.addExternalVehicle](../../../readable/controllers/C1158--tenant.views.crs.vehicles.addExternalVehicle.js) | 6 | 4 |
| [tenant.views.crs.agreements.printPreview](../../../readable/controllers/C0557--tenant.views.crs.agreements.printPreview.js) | 2 | 0 |
| [tenant.views.crs.companies.createOrUpdateDriverModal](../../../readable/controllers/C0696--tenant.views.crs.companies.createOrUpdateDriverModal.js) | 28 | 13 |
| [tenant.views.movements.uploadDocument](../../../readable/controllers/C1635--tenant.views.movements.uploadDocument.js) | 3 | 1 |
| [tenant.views.crs.discountCodes.verifyAuthCodeModal](../../../readable/controllers/C0778--tenant.views.crs.discountCodes.verifyAuthCodeModal.js) | 2 | 1 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.ers.masterAgreements.index`: `enterKeyPress`، `dateRangeCheck`، `dateRangeModelChanged`، `CurrencyFormate`، `searchContact`، `getAgreementType`، `searchContactPopoup`، `openprintModal`، `getMasterAgreements`، `getlocalDate`، `exportToExcel`، `report`، `approveMasterAgreement`، `createOrViewSaleOrders`، `createQuotation`، `editQuotation`، `viewMasterAgreement`، `masterAgreementModal`، `deleteMasterAgreement`، `enterKeyPress`، `clearCustomer`.
- وحدة `tenant.views.crs.contacts.searchContactModal`: `searchContacts`، `cancel`، `showAddContact`، `contactSelected`، `contactEdit`، `getContactsList`، `getNameWithCode`.
- وحدة `tenant.views.ers.masterAgreements.printTemplates.printPreview`: `cancel`، `getTemplateUrl`.
- وحدة `common.views.common.reportViewer`: `exportToExcelFromReport`، `cancel`.
- وحدة `tenant.views.ers.masterAgreements.viewModal`: `rounding`، `localize`، `cancel`، `getlocalDate`، `getAgreementType`، `getPeriodType`، `getAgreementStatus`، `viewAgreement`، `createIndividaulAgreement`.
- وحدة `tenant.views.ers.masterAgreements.addOrViewSaleOrder`: `getlocalDateTime`، `cancel`، `rounding`، `addRow`، `removeRow`، `searchSaleOrders`، `save`.
- وحدة `tenant.views.ers.masterAgreements.masterAgreementModal`: `rounding`، `localize`، `cancel`، `getlocalDate`، `getAgreementType`، `getPeriodType`، `getAgreementStatus`، `getDeliveryStatus`، `calculateUnitRate`، `changeAccessoryCharges`، `createDeliveryNote`، `searchVehicles`، `searchVehiclePopup`، `openViewDeliveryNoteModal`، `addExtraSchdule`، `removeScheduleLine`، `deleteDeliveryNote`، `redeliver`، `operatorChanged`، `disableOperatorCheckbox`، `save`.
- وحدة `tenant.views.crs.contacts.createOrEditModal`: `localize`، `removeExternalIdRow`، `addExternalIdRow`، `getContactExternalType`، `isContactExternalType`، `getlocalDate`، `getlocalDateTime`، `getCardType`، `removeRow`، `searchSalesPersons`، `searchUsersWithDesignation`، `searchSalesPersonPopoup`، `salesPersonSelected`، `searchDebtCollectorPopoup`، `searchCustomLookup`، `getCustomLookups`، `scanDocument`، `openUploadDocument`، `openUploadPicture`، `addCreditCardRow`، `updateCreditCardRow`، `save`، `cancel`، `isPersonVerifiedChange`، `doesIdentityDoucmentExist`، `addIndentityDocument`، `getIdentificationDocumentType`، `removeIndentityDocument`، `removeDoc`، `isFieldMondatory`، `searchCountries`، `emiratesDataReader`، `emiratesDataFieldManager`، `getTariffCards`، `getTariffCardForContact`، `isDocument`، `maskCreditCard`، `getAdvanceSettings`، `getHighLightBlackListCountries`، `getNationalIdFormates`، `nationalIdFormate`، `onOverRideChange`، `resetDocumentNo`، `nationIdMaskInput`، `handleResidenceStatusChange`.
- وحدة `tenant.views.ers.rental.agreements.viewModal`: `getlocalDateTime`، `localize`، `getAgreementType`، `getFuelLevel`، `viewContact`، `openMileageInfoModal`، `printModel`، `viewMovement`، `cancel`، `totalDaysAndTime`.
- وحدة `tenant.views.ers.lease.agreements.viewModal`: `getlocalDateTime`، `localize`، `getAgreementType`، `getFuelLevel`، `viewContact`، `openMileageInfoModal`، `printModel`، `viewMovement`، `cancel`، `totalDaysAndTime`.
- وحدة `tenant.views.ers.rental.agreements.createOrEditModal`: `getlocalDateTime`، `searchGoogleLocations`، `agreementTypeChange`، `localize`، `startDateChanged`، `addExternalEquipmentPopup`، `applyDiscount`، `agreementTypeSelected`، `endDateChanged`، `searchVehicles`، `searchCustomers`، `searchSupplier`، `searchCustomerPopoup`، `vehicleSelected`، `customerSelected`، `searchSaleOrders`، `searchVehiclePopup`، `save`، `cancel`، `tariffOptionSelected`، `disableRate`، `calculate`، `includedChanged`، `taxAcceptedChanged`، `discountApplied`، `totalDaysAndTime`.
- وحدة `tenant.views.ers.lease.agreements.createOrEditModal`: `getlocalDateTime`، `noOfMonthsChange`، `searchGoogleLocations`، `agreementTypeChange`، `localize`، `startDateChanged`، `applyDiscount`، `agreementTypeSelected`، `endDateChanged`، `searchVehicles`، `searchCustomers`، `searchSupplier`، `searchCustomerPopoup`، `vehicleSelected`، `customerSelected`، `searchSaleOrders`، `searchVehiclePopup`، `addExternalEquipmentPopup`، `save`، `cancel`، `tariffOptionSelected`، `disableRate`، `calculate`، `includedChanged`، `taxAcceptedChanged`، `discountApplied`، `totalDaysAndTime`.
- وحدة `tenant.views.ers.masterAgreements.changeAccessoryChargesModal`: `searchVehicles`، `searchVehiclePopup`، `cancel`، `rounding`، `getlocalDateTime`، `localize`، `calculateSum`، `save`، `showCalculationDetail`.
- وحدة `tenant.views.ers.deliveries.createOrEditModal`: `getlocalDateTime`، `localize`، `agreementTypeSelected`، `searchSupplier`، `save`، `cancel`، `tariffOptionSelected`، `disableRate`، `calculate`، `totalDaysAndTime`، `selectAllChange`.
- وحدة `tenant.views.crs.vehicles.searchVehicleModal`: `statusChanged`، `searchModel`، `cancel`، `clearInput`، `clearVehicle`، `getlocalDateTime`، `fromDateTimeChanged`، `searchVehicles`، `searchVehiclesFilters`، `exportToExcelByAgreement`، `vehicleSelected`، `getBookingDate`، `getTeriffGroups`.
- وحدة `tenant.views.ers.deliveries.viewModal`: `getlocalDateTime`، `localize`، `getAgreementStatus`، `getAgreementType`، `cancel`، `totalDaysAndTime`.
- وحدة `tenant.views.crs.contacts.uploadDocumentModal`: `save`، `cancel`.
- وحدة `tenant.views.crs.contacts.uploadDocumentModal`: `save`، `cancel`.
- وحدة `tenant.views.common.documents.uploadDocumentModal`: `uploadHeader`، `uploader.onBeforeUploadItem`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.common.documents.uploadImageModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.common.documents.addCreditCardModal`: `ab`، `cardNumberChanged`، `save`، `cancel`.
- وحدة `tenant.views.crs.companies.createOrEditModal`: `getCardType`، `getlocalDate`، `localize`، `getlocalDateTime`، `removeExternalIdRow`، `addExternalIdRow`، `getContactExternalType`، `isContactExternalType`، `addCreditCardRow`، `addDriverRow`، `updateCreditCardRow`، `removeRow`، `searchContacts`، `showAddContact`، `removeRowContact`، `save`، `cancel`، `addContactPersonsRow`، `changeDesignation`، `removeContactPersonsRow`، `searchSalesPersons`، `searchUsersWithDesignation`، `searchSalesPersonPopoup`، `salesPersonSelected`، `searchDebtCollectorPopoup`، `doesIdentityDoucmentExist`، `openUploadDocument`، `addIndentityDocument`، `addMandatoryDesignations`، `isCompanyVerifiedChange`، `removeIndentityDocument`، `maskCreditCard`، `removeDoc`، `getIdentificationDocumentType`، `searchCountries`، `getTariffCards`، `getTariffCardForCompany`، `isDocument`، `getDesignations`، `isFieldMondatoryForSalesPerson`، `isFieldMondatory`، `isAdditionalFieldsEnabled`، `typeOfFeild`، `onOverRideChange`، `getAdvanceSettings`، `getIndustries`، `getCompanyCustomField1`، `getCompanyCustomField2`، `getHighLightBlackListCountries`، `getCompanyCustomField3`.
- وحدة `tenant.views.crs.agreements.mileageChargesInfoModal`: `cancel`.
- وحدة `tenant.views.crs.agreements.printtemplates.printReplacementPreview`: `getFuelLevel`، `getlocalDateTime`، `getlocalDate`، `cancel`، `getChecklist`.
- وحدة `tenant.views.movements.viewModal`: `getWorkshopMovementTypes`، `getFuelLevel`، `geoLocationMap`، `getLocalize`، `cancel`، `setActiveTabIndex`، `getlocalDateTime`، `getChecklist`، `uploadDocument`، `getFieldLabel`، `isCustomFieldExists`.
- وحدة `tenant.views.crs.discountCodes.applyDiscountModal`: `calculateDiscountedRate`، `calculateDiscountedPercentage`، `verifyAuthCode`، `applyDiscount`.
- وحدة `tenant.views.crs.discountCodes.applyDiscountModal`: `calculateDiscountedRate`، `calculateDiscountedPercentage`، `verifyAuthCode`، `getBranchWiseDiscount`، `applyDiscount`.
- وحدة `tenant.views.crs.vehicles.addExternalVehicle`: `localize`، `cancel`، `searchModel`، `getTeriffGroups`، `searchSupplier`، `save`.
- وحدة `tenant.views.crs.agreements.printPreview`: `cancel`، `getTemplateUrl`.
- وحدة `tenant.views.crs.companies.createOrUpdateDriverModal`: `getlocalDateTime`، `getCardType`، `removeRow`، `searchSalesPersons`، `searchSalesPersonPopoup`، `salesPersonSelected`، `getDocsByContactId`، `searchCustomLookup`، `scanDocument`، `openUploadDocument`، `addCreditCardRow`، `updateCreditCardRow`، `save`، `cancel`، `doesIdentityDoucmentExist`، `addIndentityDocument`، `getIdentificationDocumentType`، `removeIndentityDocument`، `searchCountries`، `searchCompany`، `emiratesDataReader`، `emiratesDataFieldManager`، `getTariffCards`، `isDocument`، `isFieldMondatory`، `isAdditionalFieldsEnabled`، `typeOfFeild`، `getAdvanceSettings`.
- وحدة `tenant.views.movements.uploadDocument`: `save`، `cancel`، `uploader.onSuccessItem`.
- وحدة `tenant.views.crs.discountCodes.verifyAuthCodeModal`: `cancel`، `verifyCode`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.directory.search` | POST | api/services/app/directory/Search | [المصدر](../../../raw/application.js#L181132) |
| `abp.services.app.masterAgreement.getMasterAgreements` | POST | api/services/app/masterAgreement/GetMasterAgreements | [المصدر](../../../raw/application.js#L405596) |
| `abp.services.app.masterAgreement.exportToExcel` | POST | api/services/app/masterAgreement/ExportToExcel | [المصدر](../../../raw/application.js#L405633) |
| `abp.services.app.masterAgreement.approveMasterAgreement` | POST | api/services/app/masterAgreement/ApproveMasterAgreement | [المصدر](../../../raw/application.js#L405751) |
| `abp.services.app.masterAgreement.deleteMasterAgreement` | POST | api/services/app/masterAgreement/DeleteMasterAgreement | [المصدر](../../../raw/application.js#L405836) |
| `abp.services.app.commonLookup.getLocations` | POST | api/services/app/commonLookup/GetLocations | [المصدر](../../../raw/application.js#L180573) |
| `abp.services.app.directory.searchDirectoryPaged` | POST | api/services/app/directory/SearchDirectoryPaged | [المصدر](../../../raw/application.js#L184666) |
| `abp.services.app.chargesSetting.getChargesSettings` | POST | api/services/app/chargesSetting/GetChargesSettings | [المصدر](../../../raw/application.js#L406149) |
| `abp.services.app.masterAgreement.getMasterAgreementForView` | POST | api/services/app/masterAgreement/GetMasterAgreementForView | [المصدر](../../../raw/application.js#L406361) |
| `abp.services.app.masterAgreement.searchSaleOrdersForAgreement` | POST | api/services/app/masterAgreement/SearchSaleOrdersForAgreement | [المصدر](../../../raw/application.js#L405260) |
| `abp.services.app.masterAgreement.updateSaleOrdersForAgreement` | POST | api/services/app/masterAgreement/UpdateSaleOrdersForAgreement | [المصدر](../../../raw/application.js#L405267) |
| `abp.services.app.masterAgreement.getAgreementSaleOrders` | POST | api/services/app/masterAgreement/GetAgreementSaleOrders | [المصدر](../../../raw/application.js#L405279) |
| `abp.services.app.masterAgreement.updateScheduleLineErs` | POST | api/services/app/masterAgreement/UpdateScheduleLineErs | [المصدر](../../../raw/application.js#L406136) |
| `abp.services.app.vehicle.searchVehicles` | POST | api/services/app/vehicle/SearchVehicles | [المصدر](../../../raw/application.js#L312838) |
| `abp.services.app.equipmentDelivery.deleteDeliveryNote` | POST | api/services/app/equipmentDelivery/DeleteDeliveryNote | [المصدر](../../../raw/application.js#L406274) |
| `abp.services.app.masterAgreement.createOrUpdateMasterAgreement` | POST | api/services/app/masterAgreement/CreateOrUpdateMasterAgreement | [المصدر](../../../raw/application.js#L406339) |
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
| `abp.services.app.designation.getDesignations` | POST | api/services/app/designation/GetDesignations | [المصدر](../../../raw/application.js#L180086) |
| `abp.services.app.equipmentRentalAgreementSearch.getEquipmentRentalAgreementForView` | POST | api/services/app/equipmentRentalAgreementSearch/GetEquipmentRentalAgreementForView | [المصدر](../../../raw/application.js#L411276) |
| `abp.services.app.equipmentLeaseAgreementSearch.getEquipmentLeaseAgreementForView` | POST | api/services/app/equipmentLeaseAgreementSearch/GetEquipmentLeaseAgreementForView | [المصدر](../../../raw/application.js#L404938) |
| `abp.services.app.commonLookup.searchGooglePlaces` | POST | api/services/app/commonLookup/SearchGooglePlaces | [المصدر](../../../raw/application.js#L403087) |
| `abp.services.app.agreementSaleOrder.searchSaleOrdersForAgreement` | POST | api/services/app/agreementSaleOrder/SearchSaleOrdersForAgreement | [المصدر](../../../raw/application.js#L403271) |
| `abp.services.app.equipmentRentalAgreement.createOrUpdateAgreement` | POST | api/services/app/equipmentRentalAgreement/CreateOrUpdateAgreement | [المصدر](../../../raw/application.js#L409352) |
| `abp.services.app.equipmentRentalAgreement.getEquipmentAgreementForEdit` | POST | api/services/app/equipmentRentalAgreement/GetEquipmentAgreementForEdit | [المصدر](../../../raw/application.js#L409580) |
| `abp.services.app.equipmentLeaseAgreement.createOrUpdateAgreement` | POST | api/services/app/equipmentLeaseAgreement/CreateOrUpdateAgreement | [المصدر](../../../raw/application.js#L403395) |
| `abp.services.app.equipmentLeaseAgreement.getAgreementWithForEdit` | POST | api/services/app/equipmentLeaseAgreement/GetAgreementWithForEdit | [المصدر](../../../raw/application.js#L403638) |
| `abp.services.app.equipmentDelivery.createOrUpdateAgreement` | POST | api/services/app/equipmentDelivery/CreateOrUpdateAgreement | [المصدر](../../../raw/application.js#L400433) |
| `abp.services.app.synch.getAllCheckListItems` | POST | api/services/app/synch/GetAllCheckListItems | [المصدر](../../../raw/application.js#L402602) |
| `abp.services.app.equipmentDelivery.getEquipmentDeliveryForEdit` | POST | api/services/app/equipmentDelivery/GetEquipmentDeliveryForEdit | [المصدر](../../../raw/application.js#L400640) |
| `abp.services.app.vehicleModel.searchVehicleModelsNew` | POST | api/services/app/vehicleModel/SearchVehicleModelsNew | [المصدر](../../../raw/application.js#L305950) |
| `abp.services.app.vehicle.searchVehiclesPagedWorkShop` | POST | api/services/app/vehicle/SearchVehiclesPagedWorkShop | [المصدر](../../../raw/application.js#L312796) |
| `abp.services.app.vehicle.searchVehiclesPagedByAgreement` | POST | [object Object] | [المصدر](../../../raw/application.js#L312800) |
| `abp.services.app.vehicle.searchVehiclesPaged` | POST | api/services/app/vehicle/SearchVehiclesPaged | [المصدر](../../../raw/application.js#L312803) |
| `abp.services.app.vehicle.exportToExcelByAgreement` | POST | api/services/app/vehicle/ExportToExcelByAgreement | [المصدر](../../../raw/application.js#L312885) |
| `abp.services.app.commonLookup.getTariffGroups` | POST | api/services/app/commonLookup/GetTariffGroups | [المصدر](../../../raw/application.js#L305957) |
| `abp.services.app.equipmentDeliverySearch.getEquipmentRentalAgreementForView` | POST | api/services/app/equipmentDeliverySearch/GetEquipmentRentalAgreementForView | [المصدر](../../../raw/application.js#L402618) |
| `abp.services.app.person.uploadDocumentImage` | POST | api/services/app/person/UploadDocumentImage | [المصدر](../../../raw/application.js#L185476) |
| `abp.services.app.commonLookup.getLocationsActiveAndInActive` | POST | api/services/app/commonLookup/GetLocationsActiveAndInActive | [المصدر](../../../raw/application.js#L179440) |
| `abp.services.app.directory.getDriverForCompany` | POST | [object Object] | [المصدر](../../../raw/application.js#L179552) |
| `abp.services.app.company.deleteCompanyDriver` | POST | [object Object] | [المصدر](../../../raw/application.js#L179593) |
| `abp.services.app.company.createOrUpdateCompany` | POST | api/services/app/company/CreateOrUpdateCompany | [المصدر](../../../raw/application.js#L179662) |
| `abp.services.app.company.getCompanyForEdit` | POST | api/services/app/company/GetCompanyForEdit | [المصدر](../../../raw/application.js#L180102) |
| `abp.services.app.company.getContactCards` | POST | api/services/app/company/GetContactCards | [المصدر](../../../raw/application.js#L180183) |
| `abp.services.app.company.getAdvanceSettings` | POST | api/services/app/company/GetAdvanceSettings | [المصدر](../../../raw/application.js#L180386) |
| `abp.services.app.industry.getIndustries` | POST | api/services/app/industry/GetIndustries | [المصدر](../../../raw/application.js#L180410) |
| `abp.services.app.company.getCompanyCustomField1` | POST | api/services/app/company/GetCompanyCustomField1 | [المصدر](../../../raw/application.js#L180419) |
| `abp.services.app.company.getCompanyCustomField2` | POST | api/services/app/company/GetCompanyCustomField2 | [المصدر](../../../raw/application.js#L180428) |
| `abp.services.app.company.getHighLightBlackListCountry` | POST | [object Object] | [المصدر](../../../raw/application.js#L180436) |
| `abp.services.app.company.getCompanyCustomField3` | POST | api/services/app/company/GetCompanyCustomField3 | [المصدر](../../../raw/application.js#L180441) |
| `abp.services.app.agreementPrint.printReplacement` | POST | api/services/app/agreementPrint/PrintReplacement | [المصدر](../../../raw/application.js#L151387) |
| `abp.services.app.movement.getSupportingDocuments` | POST | api/services/app/movement/GetSupportingDocuments | [المصدر](../../../raw/application.js#L450453) |
| `abp.services.app.checkList.getVehicleTypeWiseCheckList` | POST | api/services/app/checkList/GetVehicleTypeWiseCheckList | [المصدر](../../../raw/application.js#L450504) |
| `abp.services.app.checkList.getCheckList` | POST | api/services/app/checkList/GetCheckList | [المصدر](../../../raw/application.js#L450518) |
| `abp.services.app.movement.getMovement` | POST | api/services/app/movement/GetMovement | [المصدر](../../../raw/application.js#L450612) |
| `abp.services.app.userWiseDiscount.getBranchWiseUserDiscount` | POST | api/services/app/userWiseDiscount/GetBranchWiseUserDiscount | [المصدر](../../../raw/application.js#L201812) |
| `abp.services.app.vehicle.getNextFleetCode` | POST | api/services/app/vehicle/GetNextFleetCode | [المصدر](../../../raw/application.js#L305969) |
| `abp.services.app.company.createOrUpdateCopmanyDriver` | POST | api/services/app/company/CreateOrUpdateCopmanyDriver | [المصدر](../../../raw/application.js#L181019) |
| `abp.services.app.tariffCard.getTariffCards` | POST | api/services/app/tariffCard/GetTariffCards | [المصدر](../../../raw/application.js#L181246) |
| `abp.services.app.company.getAdvanceSettingsForDriver` | POST | api/services/app/company/GetAdvanceSettingsForDriver | [المصدر](../../../raw/application.js#L181282) |
| `abp.services.app.person.getDriverForEdit` | POST | api/services/app/person/GetDriverForEdit | [المصدر](../../../raw/application.js#L181326) |
| `abp.services.app.movement.addDocument` | POST | api/services/app/movement/AddDocument | [المصدر](../../../raw/application.js#L449951) |
| `abp.services.app.discountAuthCode.verifyCode` | POST | api/services/app/discountAuthCode/VerifyCode | [المصدر](../../../raw/application.js#L202257) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.ERS.MasterAgreements.Detail`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.ERS.MasterAgreements.Approve`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.ERS.MasterAgreements.Print`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.ERS.MasterAgreements.SaleOrders`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.ERS.MasterAgreements.Delete`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Delete`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.ERS.EquipmentDelivery.Delete`: ممنوحة في السياق الملتقط.
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
- صلاحية `Pages.ERS.Rental.Agreements.Edit.CanChangeRates`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.ERS.Rental.Agreements.CanOpenAgreementWithoutSaleOrder`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vehicles.ViewOtherBranchVehicles`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Companies.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Companies.LimitedEdit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Integration.EInvoicingUAE`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Companies.CustomerApproval`: غير ممنوحة في السياق الملتقط.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.filters.agreementNo` | text |  |  |
| `vm.filters.quotationNo` | text |  |  |
| `vm.filters.plateNo` | text |  |  |
| `vm.filters.approvedType` | text | invoiceType | ng-options=approvedType.id as approvedType.name for approvedType in vm.approvedTypes |
| `vm.dateRangeModel` | text |  | min=vm.dateRangeOptions.min; max=vm.dateRangeOptions.max; ng-disabled=!vm.filters.enableDateRange |
| `vm.filters.enableDateRange` | checkbox | disableDateRange |  |
| `vm.filters.customer` | ui-select |  |  |
| `vm.filters.locationId` | select | type | ng-options=l.id as l.name for l in vm.locations |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
