# شاشة: Workshop Movements

المسار في القائمة: Movements ← Workshop Movements.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_workshopMovements`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0296](../../../readable/routes/R0296--tenant-crs-workshopmovements.js)، والأصل [raw/application.js:3645](../../../raw/application.js#L3645).
- قالب الشاشة: `~/App/tenant/views/crs/workshopMovements/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.workshopMovements.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.workshopMovements.index](../../../readable/controllers/C1459--tenant.views.workshopMovements.index.js) | 24 | 6 |
| [tenant.views.crs.contacts.searchContactModal](../../../readable/controllers/C0706--tenant.views.crs.contacts.searchContactModal.js) | 7 | 2 |
| [tenant.views.movements.printTemplates.printPreview](../../../readable/controllers/C1638--tenant.views.movements.printTemplates.printPreview.js) | 2 | 0 |
| [tenant.views.crs.workshopMovements.createOrEditModal](../../../readable/controllers/C1457--tenant.views.crs.workshopMovements.createOrEditModal.js) | 17 | 13 |
| [tenant.views.crs.workshopMovements.closeModal](../../../readable/controllers/C1456--tenant.views.crs.workshopMovements.closeModal.js) | 9 | 5 |
| [tenant.views.crs.workshopMovements.viewModal](../../../readable/controllers/C1461--tenant.views.crs.workshopMovements.viewModal.js) | 5 | 2 |
| [tenant.views.crs.workshopMovements.importWorkShopMovementModel](../../../readable/controllers/C1458--tenant.views.crs.workshopMovements.importWorkShopMovementModel.js) | 3 | 2 |
| [tenant.views.crs.contacts.createOrEditModal](../../../readable/controllers/C0703--tenant.views.crs.contacts.createOrEditModal.js) | 45 | 24 |
| [tenant.views.crs.workshopMovements.uploadDocumentsModal](../../../readable/controllers/C1460--tenant.views.crs.workshopMovements.uploadDocumentsModal.js) | 3 | 0 |
| [tenant.views.crs.vouchers.purchaseOrders.createOrEditModal](../../../readable/controllers/C1396--tenant.views.crs.vouchers.purchaseOrders.createOrEditModal.js) | 32 | 17 |
| [tenant.views.crs.vehicles.searchVehicleModal](../../../readable/controllers/C1186--tenant.views.crs.vehicles.searchVehicleModal.js) | 13 | 11 |
| [tenant.views.workshop.jobs.viewModalRental](../../../readable/controllers/C1815--tenant.views.workshop.jobs.viewModalRental.js) | 5 | 2 |
| [tenant.views.crs.contacts.uploadDocumentModal](../../../readable/controllers/C0699--tenant.views.crs.contacts.uploadDocumentModal.js) | 2 | 1 |
| [tenant.views.crs.contacts.uploadDocumentModal](../../../readable/controllers/C0711--tenant.views.crs.contacts.uploadDocumentModal.js) | 2 | 1 |
| [tenant.views.common.documents.uploadDocumentModal](../../../readable/controllers/C0362--tenant.views.common.documents.uploadDocumentModal.js) | 4 | 0 |
| [tenant.views.common.documents.uploadImageModal](../../../readable/controllers/C0363--tenant.views.common.documents.uploadImageModal.js) | 3 | 0 |
| [tenant.views.common.documents.addCreditCardModal](../../../readable/controllers/C0701--tenant.views.common.documents.addCreditCardModal.js) | 4 | 0 |
| [tenant.views.crs.vouchers.purchaseRequest.openJobVehicleDetailModal](../../../readable/controllers/C1410--tenant.views.crs.vouchers.purchaseRequest.openJobVehicleDetailModal.js) | 4 | 3 |
| [tenant.views.crs.vouchers.purchaseOrders.purchaseAndSalesHistoryModal](../../../readable/controllers/C1400--tenant.views.crs.vouchers.purchaseOrders.purchaseAndSalesHistoryModal.js) | 11 | 2 |
| [tenant.views.fms.vehicleAssignments.searchOrganizationContactModal](../../../readable/controllers/C1565--tenant.views.fms.vehicleAssignments.searchOrganizationContactModal.js) | 3 | 7 |
| [tenant.views.crs.vouchers.purchaseOrders.uploadDocumentsModal](../../../readable/controllers/C1284--tenant.views.crs.vouchers.purchaseOrders.uploadDocumentsModal.js) | 3 | 0 |
| [tenant.views.crs.vouchers.deposits.purchaseOrders.printPreview](../../../readable/controllers/C1405--tenant.views.crs.vouchers.deposits.purchaseOrders.printPreview.js) | 2 | 0 |
| [tenant.views.fms.organizationChart.createOrEditUnitModal](../../../readable/controllers/C1559--tenant.views.fms.organizationChart.createOrEditUnitModal.js) | 2 | 2 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.workshopMovements.index`: `locationPermissionClose`، `locationPermissionEditDelete`، `statusChanged`، `completionCheck`، `getlocalDateTime`، `getlocalDate`، `getlocalizedString`، `searchSupplier`، `clearSupplier`، `searchSupplierPopoup`، `getWorkshopMovements`، `getDriverMinutes`، `sendEmail`، `whatsAppSMS`، `checkCard`، `dateRangeCheck`، `exportToExcel`، `createWorkshopMovement`، `editWorkshopMovement`، `closeWorkshopMovement`، `viewWorkshopMovement`، `deleteWorkshopMovement`، `uploader.onSuccessItem`، `uploader.onErrorItem`.
- وحدة `tenant.views.crs.contacts.searchContactModal`: `searchContacts`، `cancel`، `showAddContact`، `contactSelected`، `contactEdit`، `getContactsList`، `getNameWithCode`.
- وحدة `tenant.views.movements.printTemplates.printPreview`: `cancel`، `getTemplateUrl`.
- وحدة `tenant.views.crs.workshopMovements.createOrEditModal`: `movementSubTypeChanged`، `uploadDocument`، `removeDocument`، `getOriginalName`، `addPurchaseOrder`، `localize`، `searchVehicles`، `searchDriver`، `updatePurchaseOrder`، `searchDriverPopoup`، `searchSupplierPopoup`، `vehicleSelected`، `searchVehiclePopup`، `searchSupplier`، `searchPurchaseOrder`، `save`، `cancel`.
- وحدة `tenant.views.crs.workshopMovements.closeModal`: `getlocalDateTime`، `getlocalDate`، `rounding`، `getFuelLevel`، `searchDriverPopoup`، `searchDriver`، `cancel`، `save`، `openJobViewModel`.
- وحدة `tenant.views.crs.workshopMovements.viewModal`: `getlocalDateTime`، `getFuelLevel`، `openJobViewModel`، `cancel`، `getOriginalName`.
- وحدة `tenant.views.crs.workshopMovements.importWorkShopMovementModel`: `cancel`، `getlocalDateTime`، `generateImportedOpeningBalances`.
- وحدة `tenant.views.crs.contacts.createOrEditModal`: `localize`، `removeExternalIdRow`، `addExternalIdRow`، `getContactExternalType`، `isContactExternalType`، `getlocalDate`، `getlocalDateTime`، `getCardType`، `removeRow`، `searchSalesPersons`، `searchUsersWithDesignation`، `searchSalesPersonPopoup`، `salesPersonSelected`، `searchDebtCollectorPopoup`، `searchCustomLookup`، `getCustomLookups`، `scanDocument`، `openUploadDocument`، `openUploadPicture`، `addCreditCardRow`، `updateCreditCardRow`، `save`، `cancel`، `isPersonVerifiedChange`، `doesIdentityDoucmentExist`، `addIndentityDocument`، `getIdentificationDocumentType`، `removeIndentityDocument`، `removeDoc`، `isFieldMondatory`، `searchCountries`، `emiratesDataReader`، `emiratesDataFieldManager`، `getTariffCards`، `getTariffCardForContact`، `isDocument`، `maskCreditCard`، `getAdvanceSettings`، `getHighLightBlackListCountries`، `getNationalIdFormates`، `nationalIdFormate`، `onOverRideChange`، `resetDocumentNo`، `nationIdMaskInput`، `handleResidenceStatusChange`.
- وحدة `tenant.views.crs.workshopMovements.uploadDocumentsModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.crs.vouchers.purchaseOrders.createOrEditModal`: `getWorkTypeText`، `supplierSelected`، `rounding`، `roundingforView`، `openJobVehicleModal`، `searchVehicles`، `searchSupplier`، `purchaseAndSalesHistoryModel`، `searchSupplierPopoup`، `searchAdditionalDriverPopoup`، `addRow`، `removeRow`، `clearOrder`، `branchTaxCode`، `setTaxPercentOnTaxCode`، `calculateTaxPerRow`، `searchMasterAgreement`، `sumAmount`، `sumAmountTax`، `searchItems`، `pOUnitPriceBasedOnLastSupplier`، `calculateItemPrice`، `getUnitOfMeasures`، `searchJobs`، `onItemSelected`، `onJobSelectedForVoucherline`، `uploadDocument`، `getOriginalName`، `removeDocument`، `save`، `cancel`، `searchModel`.
- وحدة `tenant.views.crs.vehicles.searchVehicleModal`: `statusChanged`، `searchModel`، `cancel`، `clearInput`، `clearVehicle`، `getlocalDateTime`، `fromDateTimeChanged`، `searchVehicles`، `searchVehiclesFilters`، `exportToExcelByAgreement`، `vehicleSelected`، `getBookingDate`، `getTeriffGroups`.
- وحدة `tenant.views.workshop.jobs.viewModalRental`: `cancel`، `getFaultValue`، `getJobTypeName`، `getInsuranceTypeName`، `viewRelatedEstimation`.
- وحدة `tenant.views.crs.contacts.uploadDocumentModal`: `save`، `cancel`.
- وحدة `tenant.views.crs.contacts.uploadDocumentModal`: `save`، `cancel`.
- وحدة `tenant.views.common.documents.uploadDocumentModal`: `uploadHeader`، `uploader.onBeforeUploadItem`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.common.documents.uploadImageModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.common.documents.addCreditCardModal`: `ab`، `cardNumberChanged`، `save`، `cancel`.
- وحدة `tenant.views.crs.vouchers.purchaseRequest.openJobVehicleDetailModal`: `localize`، `cancel`، `searchModel`، `getTariffGroups`.
- وحدة `tenant.views.crs.vouchers.purchaseOrders.purchaseAndSalesHistoryModal`: `CurrencyFormate`، `roundingforView`، `dateRangeCheck`، `dateRangeModelChanged`، `isPrintEnabled`، `getlocalDateTime`، `getPurchaseHistory`، `customFilter`، `getSaleHistory`، `openprintModal`، `cancel`.
- وحدة `tenant.views.fms.vehicleAssignments.searchOrganizationContactModal`: `contactSelected`، `organizationSelected`، `cancel`.
- وحدة `tenant.views.crs.vouchers.purchaseOrders.uploadDocumentsModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.crs.vouchers.deposits.purchaseOrders.printPreview`: `cancel`، `getTemplateUrl`.
- وحدة `tenant.views.fms.organizationChart.createOrEditUnitModal`: `save`، `cancel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.directory.search` | POST | api/services/app/directory/Search | [المصدر](../../../raw/application.js#L380122) |
| `abp.services.app.workshopMovement.getWorkshopMovements` | POST | api/services/app/workshopMovement/GetWorkshopMovements | [المصدر](../../../raw/application.js#L399233) |
| `abp.services.app.workshopMovement.sendWorkShopMovementEmailManual` | POST | api/services/app/workshopMovement/SendWorkShopMovementEmailManual | [المصدر](../../../raw/application.js#L399379) |
| `abp.services.app.workshopMovement.sendWorkshopMovementWhatsAppSMSManual` | POST | api/services/app/workshopMovement/SendWorkshopMovementWhatsAppSMSManual | [المصدر](../../../raw/application.js#L399394) |
| `abp.services.app.workshopMovement.exportToExcelWorkshopMovements` | POST | api/services/app/workshopMovement/ExportToExcelWorkshopMovements | [المصدر](../../../raw/application.js#L399434) |
| `abp.services.app.workshopMovement.deleteWorkshopMovement` | POST | api/services/app/workshopMovement/DeleteWorkshopMovement | [المصدر](../../../raw/application.js#L399525) |
| `abp.services.app.directory.searchDirectoryPaged` | POST | api/services/app/directory/SearchDirectoryPaged | [المصدر](../../../raw/application.js#L184666) |
| `abp.services.app.vehicleService.getVehicleServicesByModelOrDefault` | POST | api/services/app/vehicleService/GetVehicleServicesByModelOrDefault | [المصدر](../../../raw/application.js#L398570) |
| `abp.services.app.vehicleAlerts.getServiceAlerts` | POST | api/services/app/vehicleAlerts/GetServiceAlerts | [المصدر](../../../raw/application.js#L398615) |
| `abp.services.app.vehicle.searchVehicles` | POST | api/services/app/vehicle/SearchVehicles | [المصدر](../../../raw/application.js#L312838) |
| `abp.services.app.commonLookup.getLocations` | POST | api/services/app/commonLookup/GetLocations | [المصدر](../../../raw/application.js#L313017) |
| `abp.services.app.commonLookup.searchVouchers` | POST | api/services/app/commonLookup/SearchVouchers | [المصدر](../../../raw/application.js#L398751) |
| `abp.services.app.workshopMovement.createOrUpdateWorkshopMovement` | POST | api/services/app/workshopMovement/CreateOrUpdateWorkshopMovement | [المصدر](../../../raw/application.js#L398861) |
| `abp.services.app.vehicleAlerts.getServiceAlertForVehicle` | POST | api/services/app/vehicleAlerts/GetServiceAlertForVehicle | [المصدر](../../../raw/application.js#L398877) |
| `abp.services.app.workshopMovement.getWorkshopMovementForEdit` | POST | api/services/app/workshopMovement/GetWorkshopMovementForEdit | [المصدر](../../../raw/application.js#L399749) |
| `abp.services.app.workshopMovement.closeWorkshopMovement` | POST | api/services/app/workshopMovement/CloseWorkshopMovement | [المصدر](../../../raw/application.js#L398412) |
| `abp.services.app.job.getJobsForRentalTenant` | POST | api/services/app/job/GetJobsForRentalTenant | [المصدر](../../../raw/application.js#L398444) |
| `abp.services.app.job.getWorkoderAndJobsForRentalTenant` | POST | api/services/app/job/GetWorkoderAndJobsForRentalTenant | [المصدر](../../../raw/application.js#L399707) |
| `abp.services.app.workshopMovement.importFromExcel` | POST | [object Object] | [المصدر](../../../raw/application.js#L398983) |
| `abp.services.app.workshopMovement.generateImportedOpeningBalances` | غير مربوط | غير محسوم | [المصدر](../../../raw/application.js#L399029) |
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
| `abp.services.app.asset.getAssetType` | POST | api/services/app/asset/GetAssetType | [المصدر](../../../raw/application.js#L380132) |
| `abp.services.app.commonLookup.getLocationById` | POST | api/services/app/commonLookup/GetLocationById | [المصدر](../../../raw/application.js#L380231) |
| `abp.services.app.leaseMasterAgreement.searchMasterAgreementsForVouchers` | POST | api/services/app/leaseMasterAgreement/SearchMasterAgreementsForVouchers | [المصدر](../../../raw/application.js#L380296) |
| `abp.services.app.item.searchItems` | POST | api/services/app/item/SearchItems | [المصدر](../../../raw/application.js#L380419) |
| `abp.services.app.purchaseOrder.getPOUnitPriceBasedOnLastSupplier` | POST | api/services/app/purchaseOrder/GetPOUnitPriceBasedOnLastSupplier | [المصدر](../../../raw/application.js#L380428) |
| `abp.services.app.unitOfMeasure.getUnitOfMeasures` | POST | api/services/app/unitOfMeasure/GetUnitOfMeasures | [المصدر](../../../raw/application.js#L380461) |
| `abp.services.app.job.searchJobs` | POST | api/services/app/job/SearchJobs | [المصدر](../../../raw/application.js#L380472) |
| `abp.services.app.purchaseOrder.createOrUpdatePurchaseOrder` | POST | api/services/app/purchaseOrder/CreateOrUpdatePurchaseOrder | [المصدر](../../../raw/application.js#L380537) |
| `abp.services.app.vehicleModel.searchVehicleModelsNew` | POST | api/services/app/vehicleModel/SearchVehicleModelsNew | [المصدر](../../../raw/application.js#L384601) |
| `abp.services.app.purchaseRequest.getPurchaseRequestForEdit` | POST | api/services/app/purchaseRequest/GetPurchaseRequestForEdit | [المصدر](../../../raw/application.js#L380585) |
| `abp.services.app.assetType.getAssetDefaultType` | POST | api/services/app/assetType/GetAssetDefaultType | [المصدر](../../../raw/application.js#L380652) |
| `abp.services.app.commonQuotation.getLeaseQuotationToCreatePO` | POST | api/services/app/commonQuotation/GetLeaseQuotationToCreatePO | [المصدر](../../../raw/application.js#L380649) |
| `abp.services.app.purchaseOrder.getPurchaseOrderForEdit` | POST | api/services/app/purchaseOrder/GetPurchaseOrderForEdit | [المصدر](../../../raw/application.js#L380678) |
| `abp.services.app.vehicle.searchVehiclesPagedWorkShop` | POST | api/services/app/vehicle/SearchVehiclesPagedWorkShop | [المصدر](../../../raw/application.js#L312796) |
| `abp.services.app.vehicle.searchVehiclesPagedByAgreement` | POST | [object Object] | [المصدر](../../../raw/application.js#L312800) |
| `abp.services.app.vehicle.searchVehiclesPaged` | POST | api/services/app/vehicle/SearchVehiclesPaged | [المصدر](../../../raw/application.js#L312803) |
| `abp.services.app.vehicle.exportToExcelByAgreement` | POST | api/services/app/vehicle/ExportToExcelByAgreement | [المصدر](../../../raw/application.js#L312885) |
| `abp.services.app.commonLookup.getTariffGroups` | POST | api/services/app/commonLookup/GetTariffGroups | [المصدر](../../../raw/application.js#L384607) |
| `abp.services.app.job.viewJobForRentalTenant` | POST | api/services/app/job/ViewJobForRentalTenant | [المصدر](../../../raw/application.js#L495957) |
| `abp.services.app.labourActivity.getLabourActivities` | POST | api/services/app/labourActivity/GetLabourActivities | [المصدر](../../../raw/application.js#L495996) |
| `abp.services.app.person.uploadDocumentImage` | POST | api/services/app/person/UploadDocumentImage | [المصدر](../../../raw/application.js#L185476) |
| `abp.services.app.vehicle.getNextFleetCode` | POST | api/services/app/vehicle/GetNextFleetCode | [المصدر](../../../raw/application.js#L384613) |
| `abp.services.app.stockReport.getItemsPurchaseHistory` | POST | api/services/app/stockReport/GetItemsPurchaseHistory | [المصدر](../../../raw/application.js#L382076) |
| `abp.services.app.stockReport.getItemsSaleHistory` | POST | api/services/app/stockReport/GetItemsSaleHistory | [المصدر](../../../raw/application.js#L382155) |
| `abp.services.app.organizationChart.getOrganizationUnits` | POST | api/services/app/organizationChart/GetOrganizationUnits | [المصدر](../../../raw/application.js#L432892) |
| `abp.services.app.organizationChart.moveOrganizationUnit` | POST | api/services/app/organizationChart/MoveOrganizationUnit | [المصدر](../../../raw/application.js#L432955) |
| `abp.services.app.organizationChart.getOrganizationUnitAllUsers` | POST | api/services/app/organizationChart/GetOrganizationUnitAllUsers | [المصدر](../../../raw/application.js#L433187) |
| `abp.services.app.organizationChart.addUserToOrganizationUnit` | POST | api/services/app/organizationChart/AddUserToOrganizationUnit | [المصدر](../../../raw/application.js#L433107) |
| `abp.services.app.organizationChart.removeUserFromOrganizationUnit` | POST | api/services/app/organizationChart/RemoveUserFromOrganizationUnit | [المصدر](../../../raw/application.js#L433127) |
| `abp.services.app.organizationChart.isInOrganizationUnit` | POST | api/services/app/organizationChart/IsInOrganizationUnit | [المصدر](../../../raw/application.js#L433153) |
| `abp.services.app.organizationChart.updateOrganizationUnit` | POST | api/services/app/organizationChart/UpdateOrganizationUnit | [المصدر](../../../raw/application.js#L430943) |
| `abp.services.app.organizationChart.createOrganizationUnit` | POST | api/services/app/organizationChart/CreateOrganizationUnit | [المصدر](../../../raw/application.js#L430950) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.WorkshopMovements`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.WorkshopMovements.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.WorkshopMovements.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.WorkshopMovements.Close`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.WorkshopMovements.Export`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.WorkshopMovements.Delete`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.WorkshopMovements.AllActionsOnOtherBranchWorkshopMovements`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Delete`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.WorkshopMovements.CanChangeKMOut`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.WorkshopMovements.CanChangeFuelOut`: ممنوحة في السياق الملتقط.
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
- صلاحية `Pages.Tenant.Vouchers.PurchaseOrders.AllActionsOnOtherBranchPurchaseOrders`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vehicles.ViewOtherBranchVehicles`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Administration.OrganizationUnits.ManageOrganizationTree`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Administration.OrganizationUnits.ManageMembers`: ممنوحة في السياق الملتقط.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.filters.movementNo` | text |  |  |
| `vm.filters.IsCompleted` | select | outDetail_fuelPercentage |  |
| `vm.dateRangeModel` | text |  | min=vm.dateRangeOptions.min; max=vm.dateRangeOptions.max; ng-disabled=!vm.filters.enableDateRange |
| `vm.filters.enableDateRange` | checkbox | disableDateRange |  |
| `vm.filters.plateNo` | text |  |  |
| `vm.filters.contact` | ui-select |  |  |
| `vm.filters.isJobCompleted` | checkbox | creditInvoice |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
