# شاشة: Alerts

المسار في القائمة: Fleet ← Alerts.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_alerts`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0356](../../../readable/routes/R0356--tenant-crs-alerts.js)، والأصل [raw/application.js:4088](../../../raw/application.js#L4088).
- قالب الشاشة: `~/App/tenant/views/crs/vehicles/alerts.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.vehicles.alert as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.vehicles.alert](../../../readable/controllers/C1160--tenant.views.crs.vehicles.alert.js) | 24 | 19 |
| [tenant.views.crs.vehicles.renewInsuranceModal](../../../readable/controllers/C1183--tenant.views.crs.vehicles.renewInsuranceModal.js) | 2 | 1 |
| [tenant.views.crs.vehicles.renewRegistrationModal](../../../readable/controllers/C1184--tenant.views.crs.vehicles.renewRegistrationModal.js) | 2 | 1 |
| [tenant.views.crs.vehicles.renewCustomAlert1Modal](../../../readable/controllers/C1181--tenant.views.crs.vehicles.renewCustomAlert1Modal.js) | 2 | 1 |
| [tenant.views.crs.vehicles.renewCustomAlert2Modal](../../../readable/controllers/C1182--tenant.views.crs.vehicles.renewCustomAlert2Modal.js) | 2 | 1 |
| [tenant.views.crs.vehicles.updateServiceModal](../../../readable/controllers/C1195--tenant.views.crs.vehicles.updateServiceModal.js) | 2 | 2 |
| [tenant.views.crs.workshopMovements.createOrEditModal](../../../readable/controllers/C1457--tenant.views.crs.workshopMovements.createOrEditModal.js) | 17 | 13 |
| [tenant.views.crs.vehicles.updateVehicleServiceModal](../../../readable/controllers/C1196--tenant.views.crs.vehicles.updateVehicleServiceModal.js) | 2 | 3 |
| [tenant.views.crs.vehicles.updateMileageAlertModal](../../../readable/controllers/C1194--tenant.views.crs.vehicles.updateMileageAlertModal.js) | 2 | 1 |
| [tenant.views.crs.workshopMovements.uploadDocumentsModal](../../../readable/controllers/C1460--tenant.views.crs.workshopMovements.uploadDocumentsModal.js) | 3 | 0 |
| [tenant.views.crs.vouchers.purchaseOrders.createOrEditModal](../../../readable/controllers/C1396--tenant.views.crs.vouchers.purchaseOrders.createOrEditModal.js) | 32 | 17 |
| [tenant.views.crs.contacts.searchContactModal](../../../readable/controllers/C0706--tenant.views.crs.contacts.searchContactModal.js) | 7 | 2 |
| [tenant.views.crs.vehicles.searchVehicleModal](../../../readable/controllers/C1186--tenant.views.crs.vehicles.searchVehicleModal.js) | 13 | 11 |
| [tenant.views.crs.vouchers.purchaseRequest.openJobVehicleDetailModal](../../../readable/controllers/C1410--tenant.views.crs.vouchers.purchaseRequest.openJobVehicleDetailModal.js) | 4 | 3 |
| [tenant.views.crs.vouchers.purchaseOrders.purchaseAndSalesHistoryModal](../../../readable/controllers/C1400--tenant.views.crs.vouchers.purchaseOrders.purchaseAndSalesHistoryModal.js) | 11 | 2 |
| [tenant.views.fms.vehicleAssignments.searchOrganizationContactModal](../../../readable/controllers/C1565--tenant.views.fms.vehicleAssignments.searchOrganizationContactModal.js) | 3 | 7 |
| [tenant.views.crs.vouchers.purchaseOrders.uploadDocumentsModal](../../../readable/controllers/C1284--tenant.views.crs.vouchers.purchaseOrders.uploadDocumentsModal.js) | 3 | 0 |
| [tenant.views.crs.vouchers.deposits.purchaseOrders.printPreview](../../../readable/controllers/C1405--tenant.views.crs.vouchers.deposits.purchaseOrders.printPreview.js) | 2 | 0 |
| [tenant.views.crs.contacts.createOrEditModal](../../../readable/controllers/C0703--tenant.views.crs.contacts.createOrEditModal.js) | 45 | 24 |
| [tenant.views.fms.organizationChart.createOrEditUnitModal](../../../readable/controllers/C1559--tenant.views.fms.organizationChart.createOrEditUnitModal.js) | 2 | 2 |
| [tenant.views.crs.contacts.uploadDocumentModal](../../../readable/controllers/C0699--tenant.views.crs.contacts.uploadDocumentModal.js) | 2 | 1 |
| [tenant.views.crs.contacts.uploadDocumentModal](../../../readable/controllers/C0711--tenant.views.crs.contacts.uploadDocumentModal.js) | 2 | 1 |
| [tenant.views.common.documents.uploadDocumentModal](../../../readable/controllers/C0362--tenant.views.common.documents.uploadDocumentModal.js) | 4 | 0 |
| [tenant.views.common.documents.uploadImageModal](../../../readable/controllers/C0363--tenant.views.common.documents.uploadImageModal.js) | 3 | 0 |
| [tenant.views.common.documents.addCreditCardModal](../../../readable/controllers/C0701--tenant.views.common.documents.addCreditCardModal.js) | 4 | 0 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.vehicles.alert`: `disbleDateRange`، `clearSearchFilter`، `statusFilterChanged`، `getlocalDateTime`، `getRenewType`، `getVehicleStatus`، `allBoxTicked`، `getWarrantyType`، `getWarrantyPeriod`، `getAlerts`، `renew`، `updateService`، `clearModelData`، `searchModel`، `searchMake`، `openWorkShopMovement`، `updateVehicleService`، `exportToExcel`، `updateMileage`، `checkCheckeditems`، `mileageEmailAllChanged`، `serviceEmailAllChanged`، `emailAlerts`، `getEmailCount`.
- وحدة `tenant.views.crs.vehicles.renewInsuranceModal`: `cancel`، `save`.
- وحدة `tenant.views.crs.vehicles.renewRegistrationModal`: `cancel`، `save`.
- وحدة `tenant.views.crs.vehicles.renewCustomAlert1Modal`: `cancel`، `save`.
- وحدة `tenant.views.crs.vehicles.renewCustomAlert2Modal`: `cancel`، `save`.
- وحدة `tenant.views.crs.vehicles.updateServiceModal`: `cancel`، `save`.
- وحدة `tenant.views.crs.workshopMovements.createOrEditModal`: `movementSubTypeChanged`، `uploadDocument`، `removeDocument`، `getOriginalName`، `addPurchaseOrder`، `localize`، `searchVehicles`، `searchDriver`، `updatePurchaseOrder`، `searchDriverPopoup`، `searchSupplierPopoup`، `vehicleSelected`، `searchVehiclePopup`، `searchSupplier`، `searchPurchaseOrder`، `save`، `cancel`.
- وحدة `tenant.views.crs.vehicles.updateVehicleServiceModal`: `save`، `cancel`.
- وحدة `tenant.views.crs.vehicles.updateMileageAlertModal`: `cancel`، `save`.
- وحدة `tenant.views.crs.workshopMovements.uploadDocumentsModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.crs.vouchers.purchaseOrders.createOrEditModal`: `getWorkTypeText`، `supplierSelected`، `rounding`، `roundingforView`، `openJobVehicleModal`، `searchVehicles`، `searchSupplier`، `purchaseAndSalesHistoryModel`، `searchSupplierPopoup`، `searchAdditionalDriverPopoup`، `addRow`، `removeRow`، `clearOrder`، `branchTaxCode`، `setTaxPercentOnTaxCode`، `calculateTaxPerRow`، `searchMasterAgreement`، `sumAmount`، `sumAmountTax`، `searchItems`، `pOUnitPriceBasedOnLastSupplier`، `calculateItemPrice`، `getUnitOfMeasures`، `searchJobs`، `onItemSelected`، `onJobSelectedForVoucherline`، `uploadDocument`، `getOriginalName`، `removeDocument`، `save`، `cancel`، `searchModel`.
- وحدة `tenant.views.crs.contacts.searchContactModal`: `searchContacts`، `cancel`، `showAddContact`، `contactSelected`، `contactEdit`، `getContactsList`، `getNameWithCode`.
- وحدة `tenant.views.crs.vehicles.searchVehicleModal`: `statusChanged`، `searchModel`، `cancel`، `clearInput`، `clearVehicle`، `getlocalDateTime`، `fromDateTimeChanged`، `searchVehicles`، `searchVehiclesFilters`، `exportToExcelByAgreement`، `vehicleSelected`، `getBookingDate`، `getTeriffGroups`.
- وحدة `tenant.views.crs.vouchers.purchaseRequest.openJobVehicleDetailModal`: `localize`، `cancel`، `searchModel`، `getTariffGroups`.
- وحدة `tenant.views.crs.vouchers.purchaseOrders.purchaseAndSalesHistoryModal`: `CurrencyFormate`، `roundingforView`، `dateRangeCheck`، `dateRangeModelChanged`، `isPrintEnabled`، `getlocalDateTime`، `getPurchaseHistory`، `customFilter`، `getSaleHistory`، `openprintModal`، `cancel`.
- وحدة `tenant.views.fms.vehicleAssignments.searchOrganizationContactModal`: `contactSelected`، `organizationSelected`، `cancel`.
- وحدة `tenant.views.crs.vouchers.purchaseOrders.uploadDocumentsModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.crs.vouchers.deposits.purchaseOrders.printPreview`: `cancel`، `getTemplateUrl`.
- وحدة `tenant.views.crs.contacts.createOrEditModal`: `localize`، `removeExternalIdRow`، `addExternalIdRow`، `getContactExternalType`، `isContactExternalType`، `getlocalDate`، `getlocalDateTime`، `getCardType`، `removeRow`، `searchSalesPersons`، `searchUsersWithDesignation`، `searchSalesPersonPopoup`، `salesPersonSelected`، `searchDebtCollectorPopoup`، `searchCustomLookup`، `getCustomLookups`، `scanDocument`، `openUploadDocument`، `openUploadPicture`، `addCreditCardRow`، `updateCreditCardRow`، `save`، `cancel`، `isPersonVerifiedChange`، `doesIdentityDoucmentExist`، `addIndentityDocument`، `getIdentificationDocumentType`، `removeIndentityDocument`، `removeDoc`، `isFieldMondatory`، `searchCountries`، `emiratesDataReader`، `emiratesDataFieldManager`، `getTariffCards`، `getTariffCardForContact`، `isDocument`، `maskCreditCard`، `getAdvanceSettings`، `getHighLightBlackListCountries`، `getNationalIdFormates`، `nationalIdFormate`، `onOverRideChange`، `resetDocumentNo`، `nationIdMaskInput`، `handleResidenceStatusChange`.
- وحدة `tenant.views.fms.organizationChart.createOrEditUnitModal`: `save`، `cancel`.
- وحدة `tenant.views.crs.contacts.uploadDocumentModal`: `save`، `cancel`.
- وحدة `tenant.views.crs.contacts.uploadDocumentModal`: `save`، `cancel`.
- وحدة `tenant.views.common.documents.uploadDocumentModal`: `uploadHeader`، `uploader.onBeforeUploadItem`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.common.documents.uploadImageModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.common.documents.addCreditCardModal`: `ab`، `cardNumberChanged`، `save`، `cancel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.vehicleAlerts.getInsuranceAlerts` | POST | api/services/app/vehicleAlerts/GetInsuranceAlerts | [المصدر](../../../raw/application.js#L306220) |
| `abp.services.app.vehicleAlerts.getRegistrationAlerts` | POST | api/services/app/vehicleAlerts/GetRegistrationAlerts | [المصدر](../../../raw/application.js#L306229) |
| `abp.services.app.vehicleAlerts.getServiceAlerts` | POST | api/services/app/vehicleAlerts/GetServiceAlerts | [المصدر](../../../raw/application.js#L314671) |
| `abp.services.app.vehicleAlerts.getMileageAlerts` | POST | api/services/app/vehicleAlerts/GetMileageAlerts | [المصدر](../../../raw/application.js#L306249) |
| `abp.services.app.vehicleAlerts.getWarrantyAlerts` | POST | api/services/app/vehicleAlerts/GetWarrantyAlerts | [المصدر](../../../raw/application.js#L306268) |
| `abp.services.app.vehicleAlerts.getVehicleCustomAlerts1` | POST | api/services/app/vehicleAlerts/GetVehicleCustomAlerts1 | [المصدر](../../../raw/application.js#L306280) |
| `abp.services.app.vehicleAlerts.getVehicleCustomAlerts2` | POST | api/services/app/vehicleAlerts/GetVehicleCustomAlerts2 | [المصدر](../../../raw/application.js#L306291) |
| `abp.services.app.vehicleModel.searchVehicleModelsNew` | POST | api/services/app/vehicleModel/SearchVehicleModelsNew | [المصدر](../../../raw/application.js#L384601) |
| `abp.services.app.vehicleModel.searchVehicleMakes` | POST | api/services/app/vehicleModel/SearchVehicleMakes | [المصدر](../../../raw/application.js#L306465) |
| `abp.services.app.vehicleAlerts.exportToExcelInsuranceAlerts` | POST | api/services/app/vehicleAlerts/ExportToExcelInsuranceAlerts | [المصدر](../../../raw/application.js#L306542) |
| `abp.services.app.vehicleAlerts.exportToExcelRegisterationAlerts` | POST | api/services/app/vehicleAlerts/ExportToExcelRegisterationAlerts | [المصدر](../../../raw/application.js#L306550) |
| `abp.services.app.vehicleAlerts.exportToExcelServiceAlerts` | POST | api/services/app/vehicleAlerts/ExportToExcelServiceAlerts | [المصدر](../../../raw/application.js#L306558) |
| `abp.services.app.vehicleAlerts.exportToExcelMileageAlerts` | POST | api/services/app/vehicleAlerts/ExportToExcelMileageAlerts | [المصدر](../../../raw/application.js#L306566) |
| `abp.services.app.vehicleAlerts.exportToExcelGetVehicleCustomAlerts1` | POST | api/services/app/vehicleAlerts/ExportToExcelGetVehicleCustomAlerts1 | [المصدر](../../../raw/application.js#L306574) |
| `abp.services.app.vehicleAlerts.exportToExcelGetVehicleCustomAlerts2` | POST | api/services/app/vehicleAlerts/ExportToExcelGetVehicleCustomAlerts2 | [المصدر](../../../raw/application.js#L306582) |
| `abp.services.app.vehicleAlerts.exportToExcelWarrantyAlerts` | POST | api/services/app/vehicleAlerts/ExportToExcelWarrantyAlerts | [المصدر](../../../raw/application.js#L306590) |
| `abp.services.app.commonLookup.getLocationsActiveAndInActive` | POST | api/services/app/commonLookup/GetLocationsActiveAndInActive | [المصدر](../../../raw/application.js#L306622) |
| `abp.services.app.vehicleAlertEmail.emailVehicleAlertMileageDetails` | POST | api/services/app/vehicleAlertEmail/EmailVehicleAlertMileageDetails | [المصدر](../../../raw/application.js#L306685) |
| `abp.services.app.vehicleAlertEmail.emailVehicleAlertServiceDetails` | POST | api/services/app/vehicleAlertEmail/EmailVehicleAlertServiceDetails | [المصدر](../../../raw/application.js#L306705) |
| `abp.services.app.vehicleAlerts.renewInsurance` | POST | api/services/app/vehicleAlerts/RenewInsurance | [المصدر](../../../raw/application.js#L312438) |
| `abp.services.app.vehicleAlerts.renewRegistration` | POST | api/services/app/vehicleAlerts/RenewRegistration | [المصدر](../../../raw/application.js#L312474) |
| `abp.services.app.vehicleAlerts.renewCustomAlert1` | POST | api/services/app/vehicleAlerts/RenewCustomAlert1 | [المصدر](../../../raw/application.js#L312368) |
| `abp.services.app.vehicleAlerts.renewCustomAlert2` | POST | api/services/app/vehicleAlerts/RenewCustomAlert2 | [المصدر](../../../raw/application.js#L312403) |
| `abp.services.app.vehicleService.getVehicleServicesByModelOrDefault` | POST | api/services/app/vehicleService/GetVehicleServicesByModelOrDefault | [المصدر](../../../raw/application.js#L314668) |
| `abp.services.app.vehicleServiceLog.createServiceLog` | غير مربوط | غير محسوم | [المصدر](../../../raw/application.js#L314625) |
| `abp.services.app.vehicle.searchVehicles` | POST | api/services/app/vehicle/SearchVehicles | [المصدر](../../../raw/application.js#L312838) |
| `abp.services.app.directory.search` | POST | api/services/app/directory/Search | [المصدر](../../../raw/application.js#L182771) |
| `abp.services.app.commonLookup.getLocations` | POST | api/services/app/commonLookup/GetLocations | [المصدر](../../../raw/application.js#L182597) |
| `abp.services.app.commonLookup.searchVouchers` | POST | api/services/app/commonLookup/SearchVouchers | [المصدر](../../../raw/application.js#L398751) |
| `abp.services.app.workshopMovement.createOrUpdateWorkshopMovement` | POST | api/services/app/workshopMovement/CreateOrUpdateWorkshopMovement | [المصدر](../../../raw/application.js#L398861) |
| `abp.services.app.vehicleAlerts.getServiceAlertForVehicle` | POST | api/services/app/vehicleAlerts/GetServiceAlertForVehicle | [المصدر](../../../raw/application.js#L398877) |
| `abp.services.app.workshopMovement.getWorkshopMovementForEdit` | POST | api/services/app/workshopMovement/GetWorkshopMovementForEdit | [المصدر](../../../raw/application.js#L398904) |
| `abp.services.app.vehicleAlerts.updateVehicleService` | POST | api/services/app/vehicleAlerts/UpdateVehicleService | [المصدر](../../../raw/application.js#L314712) |
| `abp.services.app.vehicle.updateMileage` | POST | api/services/app/vehicle/UpdateMileage | [المصدر](../../../raw/application.js#L314576) |
| `abp.services.app.asset.getAssetType` | POST | api/services/app/asset/GetAssetType | [المصدر](../../../raw/application.js#L380132) |
| `abp.services.app.commonLookup.getLocationById` | POST | api/services/app/commonLookup/GetLocationById | [المصدر](../../../raw/application.js#L380231) |
| `abp.services.app.leaseMasterAgreement.searchMasterAgreementsForVouchers` | POST | api/services/app/leaseMasterAgreement/SearchMasterAgreementsForVouchers | [المصدر](../../../raw/application.js#L380296) |
| `abp.services.app.item.searchItems` | POST | api/services/app/item/SearchItems | [المصدر](../../../raw/application.js#L380419) |
| `abp.services.app.purchaseOrder.getPOUnitPriceBasedOnLastSupplier` | POST | api/services/app/purchaseOrder/GetPOUnitPriceBasedOnLastSupplier | [المصدر](../../../raw/application.js#L380428) |
| `abp.services.app.unitOfMeasure.getUnitOfMeasures` | POST | api/services/app/unitOfMeasure/GetUnitOfMeasures | [المصدر](../../../raw/application.js#L380461) |
| `abp.services.app.job.searchJobs` | POST | api/services/app/job/SearchJobs | [المصدر](../../../raw/application.js#L380472) |
| `abp.services.app.purchaseOrder.createOrUpdatePurchaseOrder` | POST | api/services/app/purchaseOrder/CreateOrUpdatePurchaseOrder | [المصدر](../../../raw/application.js#L380537) |
| `abp.services.app.purchaseRequest.getPurchaseRequestForEdit` | POST | api/services/app/purchaseRequest/GetPurchaseRequestForEdit | [المصدر](../../../raw/application.js#L380585) |
| `abp.services.app.assetType.getAssetDefaultType` | POST | api/services/app/assetType/GetAssetDefaultType | [المصدر](../../../raw/application.js#L380652) |
| `abp.services.app.commonQuotation.getLeaseQuotationToCreatePO` | POST | api/services/app/commonQuotation/GetLeaseQuotationToCreatePO | [المصدر](../../../raw/application.js#L380649) |
| `abp.services.app.purchaseOrder.getPurchaseOrderForEdit` | POST | api/services/app/purchaseOrder/GetPurchaseOrderForEdit | [المصدر](../../../raw/application.js#L380678) |
| `abp.services.app.directory.searchDirectoryPaged` | POST | api/services/app/directory/SearchDirectoryPaged | [المصدر](../../../raw/application.js#L184666) |
| `abp.services.app.vehicle.searchVehiclesPagedWorkShop` | POST | api/services/app/vehicle/SearchVehiclesPagedWorkShop | [المصدر](../../../raw/application.js#L312796) |
| `abp.services.app.vehicle.searchVehiclesPagedByAgreement` | POST | [object Object] | [المصدر](../../../raw/application.js#L312800) |
| `abp.services.app.vehicle.searchVehiclesPaged` | POST | api/services/app/vehicle/SearchVehiclesPaged | [المصدر](../../../raw/application.js#L312803) |
| `abp.services.app.vehicle.exportToExcelByAgreement` | POST | api/services/app/vehicle/ExportToExcelByAgreement | [المصدر](../../../raw/application.js#L312885) |
| `abp.services.app.commonLookup.getTariffGroups` | POST | api/services/app/commonLookup/GetTariffGroups | [المصدر](../../../raw/application.js#L384607) |
| `abp.services.app.vehicle.getNextFleetCode` | POST | api/services/app/vehicle/GetNextFleetCode | [المصدر](../../../raw/application.js#L384613) |
| `abp.services.app.stockReport.getItemsPurchaseHistory` | POST | api/services/app/stockReport/GetItemsPurchaseHistory | [المصدر](../../../raw/application.js#L382076) |
| `abp.services.app.stockReport.getItemsSaleHistory` | POST | api/services/app/stockReport/GetItemsSaleHistory | [المصدر](../../../raw/application.js#L382155) |
| `abp.services.app.organizationChart.getOrganizationUnits` | POST | api/services/app/organizationChart/GetOrganizationUnits | [المصدر](../../../raw/application.js#L432892) |
| `abp.services.app.organizationChart.moveOrganizationUnit` | POST | api/services/app/organizationChart/MoveOrganizationUnit | [المصدر](../../../raw/application.js#L432955) |
| `abp.services.app.organizationChart.getOrganizationUnitAllUsers` | POST | api/services/app/organizationChart/GetOrganizationUnitAllUsers | [المصدر](../../../raw/application.js#L433187) |
| `abp.services.app.organizationChart.addUserToOrganizationUnit` | POST | api/services/app/organizationChart/AddUserToOrganizationUnit | [المصدر](../../../raw/application.js#L433107) |
| `abp.services.app.organizationChart.removeUserFromOrganizationUnit` | POST | api/services/app/organizationChart/RemoveUserFromOrganizationUnit | [المصدر](../../../raw/application.js#L433127) |
| `abp.services.app.organizationChart.isInOrganizationUnit` | POST | api/services/app/organizationChart/IsInOrganizationUnit | [المصدر](../../../raw/application.js#L433153) |
| `abp.services.app.chargesSetting.getChargesTypes` | POST | api/services/app/chargesSetting/GetChargesTypes | [المصدر](../../../raw/application.js#L182581) |
| `abp.services.app.directory.searchSalesPersonOne` | POST | api/services/app/directory/SearchSalesPersonOne | [المصدر](../../../raw/application.js#L182778) |
| `abp.services.app.commonLookup.searchCustomLookups` | POST | api/services/app/commonLookup/SearchCustomLookups | [المصدر](../../../raw/application.js#L182861) |
| `abp.services.app.commonLookup.getCustomLookups` | POST | api/services/app/commonLookup/GetCustomLookups | [المصدر](../../../raw/application.js#L182869) |
| `abp.services.app.country.searchCountries` | POST | api/services/app/country/SearchCountries | [المصدر](../../../raw/application.js#L183560) |
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
| `abp.services.app.organizationChart.updateOrganizationUnit` | POST | api/services/app/organizationChart/UpdateOrganizationUnit | [المصدر](../../../raw/application.js#L430943) |
| `abp.services.app.organizationChart.createOrganizationUnit` | POST | api/services/app/organizationChart/CreateOrganizationUnit | [المصدر](../../../raw/application.js#L430950) |
| `abp.services.app.person.uploadDocumentImage` | POST | api/services/app/person/UploadDocumentImage | [المصدر](../../../raw/application.js#L185476) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.WorkshopMovements.CanChangeKMOut`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.WorkshopMovements.CanChangeFuelOut`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.PurchaseOrders.AllActionsOnOtherBranchPurchaseOrders`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Delete`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vehicles.ViewOtherBranchVehicles`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Administration.OrganizationUnits.ManageOrganizationTree`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Administration.OrganizationUnits.ManageMembers`: ممنوحة في السياق الملتقط.
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
| `vm.filters.type` | radio | radioInsurance |  |
| `vm.filters.type` | radio | radioRegistration |  |
| `vm.filters.type` | radio | radioMileage |  |
| `vm.filters.type` | radio | radioWarranty |  |
| `vm.filters.type` | radio | radioServices |  |
| `vm.filters.type` | radio | radioCustomAlert1 |  |
| `vm.filters.type` | radio | radioCustomAlert2 |  |
| `vm.filters.plateNo` | text |  |  |
| `vm.filters.make` | ui-select |  |  |
| `vm.filters.model` | ui-select |  |  |
| `vm.filters.status` | select |  | ng-options=status as status.name for status in vm.statuses |
| `vm.filters.locationId` | select | locationId |  |
| `vm.filters.ownership` | select | ownership | ng-options=ownership.value as ownership.key for ownership in vm.vehicleOwnerships |
| `vm.allInsurance` | checkbox | allInsurance |  |
| `row.generate` | checkbox | generate |  |
| `vm.allRegistration` | checkbox | allRegistration |  |
| `row.generate` | checkbox | generate |  |
| `vm.serviceEmailAll` | checkbox |  |  |
| `row.generate` | checkbox |  | ng-disabled=!row.email |
| `vm.mileageEmailAll` | checkbox |  |  |
| `row.generate` | checkbox |  | ng-disabled=!row.email |
| `vm.allVehicleCustomAlerts1` | checkbox | allInsurance |  |
| `row.generate` | checkbox | generate |  |
| `vm.allVehicleCustomAlerts2` | checkbox | allVehicleCustomAlerts2 |  |
| `row.generate` | checkbox | generate |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
