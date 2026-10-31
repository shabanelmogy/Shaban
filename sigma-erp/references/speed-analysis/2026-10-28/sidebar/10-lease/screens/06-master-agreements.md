# شاشة: Master Agreements

المسار في القائمة: Lease ← Master Agreements.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_masterAgreements`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0381](../../../readable/routes/R0381--tenant-crs-masteragreements.js)، والأصل [raw/application.js:4279](../../../raw/application.js#L4279).
- قالب الشاشة: `~/App/tenant/views/crs/lease/masterAgreements/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.lease.masterAgreements.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.lease.masterAgreements.index](../../../readable/controllers/C0886--tenant.views.crs.lease.masterAgreements.index.js) | 17 | 5 |
| [tenant.views.crs.contacts.searchContactModal](../../../readable/controllers/C0706--tenant.views.crs.contacts.searchContactModal.js) | 7 | 2 |
| [tenant.views.crs.vehicles.searchVehicleModal](../../../readable/controllers/C1186--tenant.views.crs.vehicles.searchVehicleModal.js) | 13 | 11 |
| [tenant.views.crs.lease.masterAgreements.createOrEditModal](../../../readable/controllers/C0884--tenant.views.crs.lease.masterAgreements.createOrEditModal.js) | 4 | 1 |
| [tenant.views.crs.lease.masterAgreements.masterAgreementModal](../../../readable/controllers/C0887--tenant.views.crs.lease.masterAgreements.masterAgreementModal.js) | 18 | 7 |
| [tenant.views.crs.lease.masterAgreements.masterAgreementModal](../../../readable/controllers/C0888--tenant.views.crs.lease.masterAgreements.masterAgreementModal.js) | 10 | 4 |
| [tenant.views.crs.lease.masterAgreements.extendAgreements](../../../readable/controllers/C0885--tenant.views.crs.lease.masterAgreements.extendAgreements.js) | 5 | 3 |
| [tenant.views.crs.lease.masterAgreements.printPreview](../../../readable/controllers/C0890--tenant.views.crs.lease.masterAgreements.printPreview.js) | 2 | 0 |
| [tenant.views.crs.contacts.createOrEditModal](../../../readable/controllers/C0703--tenant.views.crs.contacts.createOrEditModal.js) | 45 | 24 |
| [tenant.views.crs.lease.leaseQuotations.calculationDetail](../../../readable/controllers/C0874--tenant.views.crs.lease.leaseQuotations.calculationDetail.js) | 4 | 0 |
| [tenant.views.crs.lease.agreements.createOrEditModal](../../../readable/controllers/C0845--tenant.views.crs.lease.agreements.createOrEditModal.js) | 72 | 26 |
| [tenant.views.crs.lease.agreements.viewModal](../../../readable/controllers/C0855--tenant.views.crs.lease.agreements.viewModal.js) | 18 | 7 |
| [tenant.views.crs.contacts.uploadDocumentModal](../../../readable/controllers/C0699--tenant.views.crs.contacts.uploadDocumentModal.js) | 2 | 1 |
| [tenant.views.crs.contacts.uploadDocumentModal](../../../readable/controllers/C0711--tenant.views.crs.contacts.uploadDocumentModal.js) | 2 | 1 |
| [tenant.views.common.documents.uploadDocumentModal](../../../readable/controllers/C0362--tenant.views.common.documents.uploadDocumentModal.js) | 4 | 0 |
| [tenant.views.common.documents.uploadImageModal](../../../readable/controllers/C0363--tenant.views.common.documents.uploadImageModal.js) | 3 | 0 |
| [tenant.views.common.documents.addCreditCardModal](../../../readable/controllers/C0701--tenant.views.common.documents.addCreditCardModal.js) | 4 | 0 |
| [tenant.views.crs.agreements.expiredDocOutStandingBalanceModal](../../../readable/controllers/C0536--tenant.views.crs.agreements.expiredDocOutStandingBalanceModal.js) | 4 | 1 |
| [tenant.views.crs.discountCodes.applyDiscountModal](../../../readable/controllers/C0304--tenant.views.crs.discountCodes.applyDiscountModal.js) | 4 | 0 |
| [tenant.views.crs.discountCodes.applyDiscountModal](../../../readable/controllers/C0774--tenant.views.crs.discountCodes.applyDiscountModal.js) | 5 | 1 |
| [tenant.views.crs.agreements.driverChargesModal](../../../readable/controllers/C0534--tenant.views.crs.agreements.driverChargesModal.js) | 4 | 0 |
| [tenant.views.crs.contacts.searchSagX3ContactModal](../../../readable/controllers/C0710--tenant.views.crs.contacts.searchSagX3ContactModal.js) | 3 | 2 |
| [tenant.views.crs.contacts.searchContactOptionModal](../../../readable/controllers/C0707--tenant.views.crs.contacts.searchContactOptionModal.js) | 7 | 1 |
| [tenant.views.crs.agreements.agreementAdvanceAndDeposit](../../../readable/controllers/C0522--tenant.views.crs.agreements.agreementAdvanceAndDeposit.js) | 15 | 4 |
| [tenant.views.movements.editModal](../../../readable/controllers/C1630--tenant.views.movements.editModal.js) | 10 | 6 |
| [tenant.views.movements.viewModal](../../../readable/controllers/C1636--tenant.views.movements.viewModal.js) | 11 | 5 |
| [tenant.views.crs.companies.createOrEditModal](../../../readable/controllers/C0695--tenant.views.crs.companies.createOrEditModal.js) | 50 | 26 |
| [tenant.views.mcc.movements.movementLogsModal](../../../readable/controllers/C1632--tenant.views.mcc.movements.movementLogsModal.js) | 2 | 1 |
| [tenant.views.crs.lease.agreements.mileageChargesInfoModal](../../../readable/controllers/C0851--tenant.views.crs.lease.agreements.mileageChargesInfoModal.js) | 1 | 0 |
| [tenant.views.crs.agreements.tollsDetailModal](../../../readable/controllers/C0549--tenant.views.crs.agreements.tollsDetailModal.js) | 3 | 2 |
| [tenant.views.crs.agreements.finesDetailModal](../../../readable/controllers/C0538--tenant.views.crs.agreements.finesDetailModal.js) | 3 | 3 |
| [tenant.views.crs.agreements.parkingDetailModal](../../../readable/controllers/C0542--tenant.views.crs.agreements.parkingDetailModal.js) | 3 | 2 |
| [tenant.views.crs.vouchers.invoices.viewModal](../../../readable/controllers/C1357--tenant.views.crs.vouchers.invoices.viewModal.js) | 14 | 5 |
| [tenant.views.crs.discountCodes.verifyAuthCodeModal](../../../readable/controllers/C0778--tenant.views.crs.discountCodes.verifyAuthCodeModal.js) | 2 | 1 |
| [tenant.views.crs.vouchers.deposits.uploadDocumentsModal](../../../readable/controllers/C1300--tenant.views.crs.vouchers.deposits.uploadDocumentsModal.js) | 3 | 0 |
| [tenant.views.crs.vouchers.receipts.uploadDocumentsModal](../../../readable/controllers/C1430--tenant.views.crs.vouchers.receipts.uploadDocumentsModal.js) | 3 | 0 |
| [tenant.views.movements.uploadDocument](../../../readable/controllers/C1635--tenant.views.movements.uploadDocument.js) | 3 | 1 |
| [tenant.views.crs.companies.createOrUpdateDriverModal](../../../readable/controllers/C0696--tenant.views.crs.companies.createOrUpdateDriverModal.js) | 28 | 13 |
| [tenant.views.crs.vouchers.invoices.uploadDocumentsModal](../../../readable/controllers/C1355--tenant.views.crs.vouchers.invoices.uploadDocumentsModal.js) | 3 | 0 |
| [tenant.views.crs.vouchers.invoices.allocationsViewModel](../../../readable/controllers/C1311--tenant.views.crs.vouchers.invoices.allocationsViewModel.js) | 4 | 1 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.lease.masterAgreements.index`: `searchVehicles`، `searchContact`، `CurrencyFormate`، `searchContactPopoup`، `searchVehiclePopup`، `getmasterAgreements`، `getlocalDate`، `exportToExcel`، `createmasterAgreement`، `editMasterAgreement`، `viewMasterAgreement`، `masterAgreementModal`، `extendAgreements`، `printMasterAgreement`، `approveMasterAgreement`، `enterKeyPress`، `clearCustomer`.
- وحدة `tenant.views.crs.contacts.searchContactModal`: `searchContacts`، `cancel`، `showAddContact`، `contactSelected`، `contactEdit`، `getContactsList`، `getNameWithCode`.
- وحدة `tenant.views.crs.vehicles.searchVehicleModal`: `statusChanged`، `searchModel`، `cancel`، `clearInput`، `clearVehicle`، `getlocalDateTime`، `fromDateTimeChanged`، `searchVehicles`، `searchVehiclesFilters`، `exportToExcelByAgreement`، `vehicleSelected`، `getBookingDate`، `getTeriffGroups`.
- وحدة `tenant.views.crs.lease.masterAgreements.createOrEditModal`: `rounding`، `localize`، `cancel`، `save`.
- وحدة `tenant.views.crs.lease.masterAgreements.masterAgreementModal`: `rounding`، `localize`، `searchContact`، `CurrencyFormate`، `searchContactPopoup`، `searchModel`، `getStatus`، `modelSelected`، `periodChanged`، `addRow`، `removeRow`، `calculationDetail`، `calculationDetailView`، `cancel`، `calculate`، `sum`، `getcostingParameters`، `addAgreementUnderMasterAgreement`.
- وحدة `tenant.views.crs.lease.masterAgreements.masterAgreementModal`: `rounding`، `localize`، `cancel`، `getlocalDate`، `getAgreementStatus`، `lineWiseMonthsList`، `openViewAgreementModal`، `periodChanged`، `addAgreementUnderMasterAgreement`، `save`.
- وحدة `tenant.views.crs.lease.masterAgreements.extendAgreements`: `getlocalDateTime`، `getlocalDate`، `localize`، `cancel`، `save`.
- وحدة `tenant.views.crs.lease.masterAgreements.printPreview`: `cancel`، `getTemplateUrl`.
- وحدة `tenant.views.crs.contacts.createOrEditModal`: `localize`، `removeExternalIdRow`، `addExternalIdRow`، `getContactExternalType`، `isContactExternalType`، `getlocalDate`، `getlocalDateTime`، `getCardType`، `removeRow`، `searchSalesPersons`، `searchUsersWithDesignation`، `searchSalesPersonPopoup`، `salesPersonSelected`، `searchDebtCollectorPopoup`، `searchCustomLookup`، `getCustomLookups`، `scanDocument`، `openUploadDocument`، `openUploadPicture`، `addCreditCardRow`، `updateCreditCardRow`، `save`، `cancel`، `isPersonVerifiedChange`، `doesIdentityDoucmentExist`، `addIndentityDocument`، `getIdentificationDocumentType`، `removeIndentityDocument`، `removeDoc`، `isFieldMondatory`، `searchCountries`، `emiratesDataReader`، `emiratesDataFieldManager`، `getTariffCards`، `getTariffCardForContact`، `isDocument`، `maskCreditCard`، `getAdvanceSettings`، `getHighLightBlackListCountries`، `getNationalIdFormates`، `nationalIdFormate`، `onOverRideChange`، `resetDocumentNo`، `nationIdMaskInput`، `handleResidenceStatusChange`.
- وحدة `tenant.views.crs.lease.leaseQuotations.calculationDetail`: `includedChanged`، `localize`، `calculate`، `cancel`.
- وحدة `tenant.views.crs.lease.agreements.createOrEditModal`: `openExpiredDocAndOutStandingBalanceModal`، `addProvisionRow`، `addPreTerminationRuleRow`، `clearAdditionalDriver`، `searchGoogleLocations`، `searchUsersWithDesignation`، `salesPersonSelected`، `calculateCount`، `applyDiscount`، `disableRate`، `removeProvisionRow`، `removePreTerminationRuleRow`، `addClauseRow`، `addClauses`، `removeClauseRow`، `noOfMonthsChange`، `changeStatusReceiptCreation`، `changeStatusDepositCreation`، `localize`، `localizeChargesType`، `driverChargesPopoup`، `startDateChanged`، `searchAdditionalDrivers`، `searchStaff`، `agreementTypeSelected`، `endDateChanged`، `searchVehicles`، `searchCustomers`، `searchCustomerPopoup`، `searchDrivers`، `searchDriverPopoup`، `searchAdditionalDriverPopoup`، `vehicleSelected`، `customerSelected`، `branchTaxCode`، `branchTaxCodeForMasterAgreement`، `searchSaleOrders`، `commonDriverSearch`، `searchDrivers`، `individualCustomerRadioSelected`، `searchDrivers`، `searchDrivers`، `searchDrivers`، `driverSelected`، `additionalDriverSelected`، `searchVehiclePopup`، `addSagX3Contact`، `save`، `cancel`، `tariffOptionSelected`، `calculate`، `includedChanged`، `taxAcceptedChanged`، `discountApplied`، `changeStatusReceiptCreation`، `changeStatusDepositCreation`، `getClauses`، `firstNextButton`، `secondNextButton`، `thiredNextButton`، `secondTabPreviousButton`، `thiredTabPreviousButton`، `fourthTabPreviousButton`، `checkProvisionsRowEmpty`، `checkClausesRowEmpty`، `preTermValid`، `firstNextButton`، `secondNextButton`، `thiredNextButton`، `secondScreenPreviousButton`، `thiredScreenPreviousButton`، `fourthScreenPreviousButton`.
- وحدة `tenant.views.crs.lease.agreements.viewModal`: `getlocalDateTime`، `getlocalDate`، `localize`، `localizeChargesType`، `roundingforView`، `editMovement`، `getFuelLevel`، `viewMovement`، `openMovementLogsModal`، `viewContact`، `openMileageInfoModal`، `showTollsDetail`، `showFinesDetail`، `showParkingDetail`، `fetchParking`، `getClauses`، `cancel`، `viewInvoice`.
- وحدة `tenant.views.crs.contacts.uploadDocumentModal`: `save`، `cancel`.
- وحدة `tenant.views.crs.contacts.uploadDocumentModal`: `save`، `cancel`.
- وحدة `tenant.views.common.documents.uploadDocumentModal`: `uploadHeader`، `uploader.onBeforeUploadItem`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.common.documents.uploadImageModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.common.documents.addCreditCardModal`: `ab`، `cardNumberChanged`، `save`، `cancel`.
- وحدة `tenant.views.crs.agreements.expiredDocOutStandingBalanceModal`: `getlocalDate`، `cancel`، `rounding`، `getDocumentType`.
- وحدة `tenant.views.crs.discountCodes.applyDiscountModal`: `calculateDiscountedRate`، `calculateDiscountedPercentage`، `verifyAuthCode`، `applyDiscount`.
- وحدة `tenant.views.crs.discountCodes.applyDiscountModal`: `calculateDiscountedRate`، `calculateDiscountedPercentage`، `verifyAuthCode`، `getBranchWiseDiscount`، `applyDiscount`.
- وحدة `tenant.views.crs.agreements.driverChargesModal`: `boxTicked`، `cancel`، `applyChange`، `saveDriverCharges`.
- وحدة `tenant.views.crs.contacts.searchSagX3ContactModal`: `searchContacts`، `cancel`، `contactSelected`.
- وحدة `tenant.views.crs.contacts.searchContactOptionModal`: `searchContacts`، `cancel`، `showAddContact`، `contactSelected`، `contactEdit`، `getContactsList`، `getNameWithCode`.
- وحدة `tenant.views.crs.agreements.agreementAdvanceAndDeposit`: `uploadDocument`، `uploadAdvanceDocument`، `removeDocument`، `removeAdvanceDocument`، `getOriginalName`، `amountChanged`، `amountChangedDeposit`، `customerCurrencyChanged`، `amountWithoutCommissionChanged`، `cancel`، `calculateCreditCardCommission`، `conversionRateChanged`، `onCustomerSelect`، `ok`، `dateNullOrNot`.
- وحدة `tenant.views.movements.editModal`: `getWorkshopMovementTypes`، `getFuelLevel`، `geoLocationMap`، `getLocalize`، `cancel`، `setActiveTabIndex`، `getlocalDateTime`، `getChecklist`، `uploadDocument`، `save`.
- وحدة `tenant.views.movements.viewModal`: `getWorkshopMovementTypes`، `getFuelLevel`، `geoLocationMap`، `getLocalize`، `cancel`، `setActiveTabIndex`، `getlocalDateTime`، `getChecklist`، `uploadDocument`، `getFieldLabel`، `isCustomFieldExists`.
- وحدة `tenant.views.crs.companies.createOrEditModal`: `getCardType`، `getlocalDate`، `localize`، `getlocalDateTime`، `removeExternalIdRow`، `addExternalIdRow`، `getContactExternalType`، `isContactExternalType`، `addCreditCardRow`، `addDriverRow`، `updateCreditCardRow`، `removeRow`، `searchContacts`، `showAddContact`، `removeRowContact`، `save`، `cancel`، `addContactPersonsRow`، `changeDesignation`، `removeContactPersonsRow`، `searchSalesPersons`، `searchUsersWithDesignation`، `searchSalesPersonPopoup`، `salesPersonSelected`، `searchDebtCollectorPopoup`، `doesIdentityDoucmentExist`، `openUploadDocument`، `addIndentityDocument`، `addMandatoryDesignations`، `isCompanyVerifiedChange`، `removeIndentityDocument`، `maskCreditCard`، `removeDoc`، `getIdentificationDocumentType`، `searchCountries`، `getTariffCards`، `getTariffCardForCompany`، `isDocument`، `getDesignations`، `isFieldMondatoryForSalesPerson`، `isFieldMondatory`، `isAdditionalFieldsEnabled`، `typeOfFeild`، `onOverRideChange`، `getAdvanceSettings`، `getIndustries`، `getCompanyCustomField1`، `getCompanyCustomField2`، `getHighLightBlackListCountries`، `getCompanyCustomField3`.
- وحدة `tenant.views.mcc.movements.movementLogsModal`: `getlocalDateTime`، `cancel`.
- وحدة `tenant.views.crs.lease.agreements.mileageChargesInfoModal`: `cancel`.
- وحدة `tenant.views.crs.agreements.tollsDetailModal`: `getlocalDateTime`، `getServerName`، `cancel`.
- وحدة `tenant.views.crs.agreements.finesDetailModal`: `getlocalDateTime`، `ignoreFine`، `cancel`.
- وحدة `tenant.views.crs.agreements.parkingDetailModal`: `getlocalDateTime`، `getServerName`، `cancel`.
- وحدة `tenant.views.crs.vouchers.invoices.viewModal`: `localize`، `rounding`، `cancel`، `chargesTypeVoucherLine`، `getColspan`، `chargesTypeVoucherLineRepeat`، `currencyAndRounding`، `roundingforView`، `uploadDocument`، `getOriginalName`، `sumPerTrip`، `moduleChanged`، `sumTaxPerTrip`، `openViewAllocationsModal`.
- وحدة `tenant.views.crs.discountCodes.verifyAuthCodeModal`: `cancel`، `verifyCode`.
- وحدة `tenant.views.crs.vouchers.deposits.uploadDocumentsModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.crs.vouchers.receipts.uploadDocumentsModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.movements.uploadDocument`: `save`، `cancel`، `uploader.onSuccessItem`.
- وحدة `tenant.views.crs.companies.createOrUpdateDriverModal`: `getlocalDateTime`، `getCardType`، `removeRow`، `searchSalesPersons`، `searchSalesPersonPopoup`، `salesPersonSelected`، `getDocsByContactId`، `searchCustomLookup`، `scanDocument`، `openUploadDocument`، `addCreditCardRow`، `updateCreditCardRow`، `save`، `cancel`، `doesIdentityDoucmentExist`، `addIndentityDocument`، `getIdentificationDocumentType`، `removeIndentityDocument`، `searchCountries`، `searchCompany`، `emiratesDataReader`، `emiratesDataFieldManager`، `getTariffCards`، `isDocument`، `isFieldMondatory`، `isAdditionalFieldsEnabled`، `typeOfFeild`، `getAdvanceSettings`.
- وحدة `tenant.views.crs.vouchers.invoices.uploadDocumentsModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.crs.vouchers.invoices.allocationsViewModel`: `cancel`، `sumAmount`، `localize`، `getlocalDate`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.vehicle.searchVehicles` | POST | api/services/app/vehicle/SearchVehicles | [المصدر](../../../raw/application.js#L227419) |
| `abp.services.app.directory.search` | POST | api/services/app/directory/Search | [المصدر](../../../raw/application.js#L181132) |
| `abp.services.app.leaseMasterAgreement.getMasterLeaseAgreements` | POST | api/services/app/leaseMasterAgreement/GetMasterLeaseAgreements | [المصدر](../../../raw/application.js#L241123) |
| `abp.services.app.leaseMasterAgreement.exportToExcel` | POST | api/services/app/leaseMasterAgreement/ExportToExcel | [المصدر](../../../raw/application.js#L241158) |
| `abp.services.app.leaseMasterAgreement.approveMasterAgreement` | POST | api/services/app/leaseMasterAgreement/ApproveMasterAgreement | [المصدر](../../../raw/application.js#L241363) |
| `abp.services.app.directory.searchDirectoryPaged` | POST | api/services/app/directory/SearchDirectoryPaged | [المصدر](../../../raw/application.js#L184853) |
| `abp.services.app.vehicleModel.searchVehicleModelsNew` | POST | api/services/app/vehicleModel/SearchVehicleModelsNew | [المصدر](../../../raw/application.js#L241467) |
| `abp.services.app.vehicle.searchVehiclesPagedWorkShop` | POST | api/services/app/vehicle/SearchVehiclesPagedWorkShop | [المصدر](../../../raw/application.js#L312796) |
| `abp.services.app.vehicle.searchVehiclesPagedByAgreement` | POST | [object Object] | [المصدر](../../../raw/application.js#L312800) |
| `abp.services.app.vehicle.searchVehiclesPaged` | POST | api/services/app/vehicle/SearchVehiclesPaged | [المصدر](../../../raw/application.js#L312803) |
| `abp.services.app.vehicle.exportToExcelByAgreement` | POST | api/services/app/vehicle/ExportToExcelByAgreement | [المصدر](../../../raw/application.js#L312885) |
| `abp.services.app.commonLookup.getLocations` | POST | api/services/app/commonLookup/GetLocations | [المصدر](../../../raw/application.js#L180573) |
| `abp.services.app.commonLookup.getTariffGroups` | POST | api/services/app/commonLookup/GetTariffGroups | [المصدر](../../../raw/application.js#L313062) |
| `abp.services.app.leaseMasterAgreement.createOrUpdateMasterLeaseAgreement` | POST | api/services/app/leaseMasterAgreement/CreateOrUpdateMasterLeaseAgreement | [المصدر](../../../raw/application.js#L242139) |
| `abp.services.app.costSetting.getCostSettingByModel` | POST | api/services/app/costSetting/GetCostSettingByModel | [المصدر](../../../raw/application.js#L241485) |
| `abp.services.app.chargesSetting.getChargesSettings` | POST | api/services/app/chargesSetting/GetChargesSettings | [المصدر](../../../raw/application.js#L241976) |
| `abp.services.app.costParameter.getcostingParameters` | POST | api/services/app/costParameter/GetcostingParameters | [المصدر](../../../raw/application.js#L241741) |
| `abp.services.app.leaseMasterAgreement.getMasterLeaseAgreementForView` | POST | api/services/app/leaseMasterAgreement/GetMasterLeaseAgreementForView | [المصدر](../../../raw/application.js#L241852) |
| `abp.services.app.leaseMasterAgreement.updateScheduleLine` | POST | api/services/app/leaseMasterAgreement/UpdateScheduleLine | [المصدر](../../../raw/application.js#L242127) |
| `abp.services.app.leaseMasterAgreement.getMasterAgreementForView` | POST | api/services/app/leaseMasterAgreement/GetMasterAgreementForView | [المصدر](../../../raw/application.js#L240982) |
| `abp.services.app.leaseMasterAgreement.extendMasterLeaseAgreement` | POST | api/services/app/leaseMasterAgreement/ExtendMasterLeaseAgreement | [المصدر](../../../raw/application.js#L240980) |
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
| `abp.services.app.commonLookup.searchGooglePlaces` | POST | api/services/app/commonLookup/SearchGooglePlaces | [المصدر](../../../raw/application.js#L227110) |
| `abp.services.app.directory.searchSalesPersonActiveOne` | POST | api/services/app/directory/SearchSalesPersonActiveOne | [المصدر](../../../raw/application.js#L227116) |
| `abp.services.app.directory.searchCustomerPhoto` | POST | api/services/app/directory/SearchCustomerPhoto | [المصدر](../../../raw/application.js#L235402) |
| `abp.services.app.leaseClause.getClausesForEdit` | POST | api/services/app/leaseClause/GetClausesForEdit | [المصدر](../../../raw/application.js#L235655) |
| `abp.services.app.directory.searchPersonStaffCustomer` | POST | api/services/app/directory/SearchPersonStaffCustomer | [المصدر](../../../raw/application.js#L227344) |
| `abp.services.app.directory.searchSalesPersonWithDesignation` | POST | api/services/app/directory/SearchSalesPersonWithDesignation | [المصدر](../../../raw/application.js#L227350) |
| `abp.services.app.commonLookup.getLocationById` | POST | api/services/app/commonLookup/GetLocationById | [المصدر](../../../raw/application.js#L227578) |
| `abp.services.app.taxCode.getTaxCodeById` | POST | api/services/app/taxCode/GetTaxCodeById | [المصدر](../../../raw/application.js#L227598) |
| `abp.services.app.agreementSaleOrder.searchSaleOrdersForAgreement` | POST | api/services/app/agreementSaleOrder/SearchSaleOrdersForAgreement | [المصدر](../../../raw/application.js#L227626) |
| `abp.services.app.directory.searchForCompany` | POST | api/services/app/directory/SearchForCompany | [المصدر](../../../raw/application.js#L227693) |
| `abp.services.app.accident.checkRepeatedAccidentsOnDriver` | POST | api/services/app/accident/CheckRepeatedAccidentsOnDriver | [المصدر](../../../raw/application.js#L227739) |
| `abp.services.app.leaseAgreement.createOrUpdateLeaseAgreement` | POST | api/services/app/leaseAgreement/CreateOrUpdateLeaseAgreement | [المصدر](../../../raw/application.js#L228062) |
| `abp.services.app.vehicleAlerts.getServiceAlertForVehicle` | POST | api/services/app/vehicleAlerts/GetServiceAlertForVehicle | [المصدر](../../../raw/application.js#L228040) |
| `abp.services.app.leaseClause.getLeaseClauseTypes` | POST | api/services/app/leaseClause/GetLeaseClauseTypes | [المصدر](../../../raw/application.js#L235666) |
| `abp.services.app.leaseAgreement.getLeaseAgreementWithAdvanceAndDepositForEdit` | POST | api/services/app/leaseAgreement/GetLeaseAgreementWithAdvanceAndDepositForEdit | [المصدر](../../../raw/application.js#L228333) |
| `abp.services.app.parkingTicket.getParkingTicket` | POST | api/services/app/parkingTicket/GetParkingTicket | [المصدر](../../../raw/application.js#L145561) |
| `abp.services.app.commonAgreement.getExcessKMsOnAgreement` | POST | api/services/app/commonAgreement/GetExcessKMsOnAgreement | [المصدر](../../../raw/application.js#L235678) |
| `abp.services.app.commonAgreement.getAgreementLogs` | POST | api/services/app/commonAgreement/GetAgreementLogs | [المصدر](../../../raw/application.js#L235706) |
| `abp.services.app.leaseAgreementSearch.getLeaseAgreementForView` | POST | api/services/app/leaseAgreementSearch/GetLeaseAgreementForView | [المصدر](../../../raw/application.js#L235714) |
| `abp.services.app.person.uploadDocumentImage` | POST | api/services/app/person/UploadDocumentImage | [المصدر](../../../raw/application.js#L185476) |
| `abp.services.app.directory.getExpiredDocumentAndOutStandingBalance` | POST | api/services/app/directory/GetExpiredDocumentAndOutStandingBalance | [المصدر](../../../raw/application.js#L141621) |
| `abp.services.app.userWiseDiscount.getBranchWiseUserDiscount` | POST | api/services/app/userWiseDiscount/GetBranchWiseUserDiscount | [المصدر](../../../raw/application.js#L201812) |
| `abp.services.app.directory.searchSagX3Contacts` | POST | api/services/app/directory/SearchSagX3Contacts | [المصدر](../../../raw/application.js#L185395) |
| `abp.services.app.company.createSagX3Contact` | POST | api/services/app/company/CreateSagX3Contact | [المصدر](../../../raw/application.js#L185442) |
| `abp.services.app.commonLookup.getCurrenciesAll` | POST | api/services/app/commonLookup/GetCurrenciesAll | [المصدر](../../../raw/application.js#L134377) |
| `abp.services.app.billingMethod.getBillingMethods` | POST | api/services/app/billingMethod/GetBillingMethods | [المصدر](../../../raw/application.js#L134491) |
| `abp.services.app.commonLookup.getBankAccountsForSelection` | POST | api/services/app/commonLookup/GetBankAccountsForSelection | [المصدر](../../../raw/application.js#L134545) |
| `abp.services.app.movement.getSupportingDocuments` | POST | api/services/app/movement/GetSupportingDocuments | [المصدر](../../../raw/application.js#L450453) |
| `abp.services.app.checkList.getVehicleTypeWiseCheckList` | POST | api/services/app/checkList/GetVehicleTypeWiseCheckList | [المصدر](../../../raw/application.js#L450504) |
| `abp.services.app.checkList.getCheckList` | POST | api/services/app/checkList/GetCheckList | [المصدر](../../../raw/application.js#L450518) |
| `abp.services.app.movement.updateMovement` | POST | api/services/app/movement/UpdateMovement | [المصدر](../../../raw/application.js#L448136) |
| `abp.services.app.movement.getMovement` | POST | api/services/app/movement/GetMovement | [المصدر](../../../raw/application.js#L450612) |
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
| `abp.services.app.movement.getMovementLogs` | POST | api/services/app/movement/GetMovementLogs | [المصدر](../../../raw/application.js#L449051) |
| `abp.services.app.toll.getTolls` | POST | api/services/app/toll/GetTolls | [المصدر](../../../raw/application.js#L148586) |
| `abp.services.app.commonAgreement.getAgreement` | POST | api/services/app/commonAgreement/GetAgreement | [المصدر](../../../raw/application.js#L145578) |
| `abp.services.app.uaeFine.ignoreFine` | POST | api/services/app/uaeFine/IgnoreFine | [المصدر](../../../raw/application.js#L142477) |
| `abp.services.app.uaeFine.getFines` | POST | api/services/app/uaeFine/GetFines | [المصدر](../../../raw/application.js#L142511) |
| `abp.services.app.costCenter.searchCostCenters` | POST | api/services/app/costCenter/SearchCostCenters | [المصدر](../../../raw/application.js#L365805) |
| `abp.services.app.asset.getAssetForEdit` | POST | api/services/app/asset/GetAssetForEdit | [المصدر](../../../raw/application.js#L365812) |
| `abp.services.app.limoTrip.getInvoiceTrips` | POST | api/services/app/limoTrip/GetInvoiceTrips | [المصدر](../../../raw/application.js#L365821) |
| `abp.services.app.invoiceSearch.getInvoiceForView` | POST | api/services/app/invoiceSearch/GetInvoiceForView | [المصدر](../../../raw/application.js#L365905) |
| `abp.services.app.discountAuthCode.verifyCode` | POST | api/services/app/discountAuthCode/VerifyCode | [المصدر](../../../raw/application.js#L202257) |
| `abp.services.app.movement.addDocument` | POST | api/services/app/movement/AddDocument | [المصدر](../../../raw/application.js#L449951) |
| `abp.services.app.company.createOrUpdateCopmanyDriver` | POST | api/services/app/company/CreateOrUpdateCopmanyDriver | [المصدر](../../../raw/application.js#L181019) |
| `abp.services.app.tariffCard.getTariffCards` | POST | api/services/app/tariffCard/GetTariffCards | [المصدر](../../../raw/application.js#L181246) |
| `abp.services.app.company.getAdvanceSettingsForDriver` | POST | api/services/app/company/GetAdvanceSettingsForDriver | [المصدر](../../../raw/application.js#L181282) |
| `abp.services.app.person.getDriverForEdit` | POST | api/services/app/person/GetDriverForEdit | [المصدر](../../../raw/application.js#L181326) |
| `abp.services.app.allocation.getAllocations` | POST | api/services/app/allocation/GetAllocations | [المصدر](../../../raw/application.js#L342588) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.masterAgreements.Addnew`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.masterAgreements.Edit`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.masterAgreements.Delete`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Delete`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vehicles.ViewOtherBranchVehicles`: ممنوحة في السياق الملتقط.
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
- صلاحية `Pages.Tenant.Lease.Agreements.Edit.CanChangeRates`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Lease.Agreements.MonthChange`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Lease.Agreements.CanChangeKMOut`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Lease.Agreements.CanChangeFuelOut`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Lease.Agreements.CanOpenAgreementWithoutSaleOrderLease`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Lease.Agreements.CanChangeLeaseClauses`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Agreements.CanChangeFuelRate`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Movements.EnableMovementEditing`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Movements.EnableMovementLogs`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Receipts.CanChangeDate`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Companies.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Companies.LimitedEdit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Integration.EInvoicingUAE`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Companies.CustomerApproval`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Invoices.MultiModalMiscInvoices`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Invoices.MarkDisputed`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.Invoices.UnmarkDisputed`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Assets.Assets`: ممنوحة في السياق الملتقط.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.filters.agreementNo` | text |  |  |
| `vm.filters.approvedType` | text | invoiceType | ng-options=approvedType.id as approvedType.name for approvedType in vm.approvedTypes |
| `vm.filters.inquiryReferenceNo` | text |  |  |
| `vm.dateRangeModel` | text |  | min=vm.dateRangeOptions.min; max=vm.dateRangeOptions.max |
| `vm.filters.customer` | ui-select |  |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
