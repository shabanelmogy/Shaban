# شاشة: Jobs

المسار في القائمة: Workshop ← Jobs.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.CRS_jobs`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0552](../../../readable/routes/R0552--tenant-crs-jobs.js)، والأصل [raw/application.js:5704](../../../raw/application.js#L5704).
- قالب الشاشة: `~/App/tenant/views/workshop/Jobs/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.workshop.jobs.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.workshop.jobs.index](../../../readable/controllers/C1806--tenant.views.workshop.jobs.index.js) | 32 | 17 |
| [tenant.views.crs.contacts.searchContactModal](../../../readable/controllers/C0706--tenant.views.crs.contacts.searchContactModal.js) | 7 | 2 |
| [tenant.views.workshop.Jobs.createOrEditModal](../../../readable/controllers/C1803--tenant.views.workshop.Jobs.createOrEditModal.js) | 40 | 24 |
| [tenant.views.workshop.Jobs.createOrEditLubricationJobModal](../../../readable/controllers/C1802--tenant.views.workshop.Jobs.createOrEditLubricationJobModal.js) | 20 | 7 |
| [common.views.common.reportViewer](../../../readable/controllers/C0006--common.views.common.reportViewer.js) | 2 | 0 |
| [tenant.views.workshop.jobs.editPurchaseOrderModel](../../../readable/controllers/C1804--tenant.views.workshop.jobs.editPurchaseOrderModel.js) | 4 | 3 |
| [tenant.views.workshop.Jobs.printTemplates.printPreview](../../../readable/controllers/C1816--tenant.views.workshop.Jobs.printTemplates.printPreview.js) | 2 | 0 |
| [tenant.views.workshop.jobs.gatePassModal](../../../readable/controllers/C1805--tenant.views.workshop.jobs.gatePassModal.js) | 4 | 1 |
| [tenant.views.workshop.jobs.viewModal](../../../readable/controllers/C1814--tenant.views.workshop.jobs.viewModal.js) | 7 | 5 |
| [tenant.views.workshop.jobEstimations.jobLogModal](../../../readable/controllers/C1794--tenant.views.workshop.jobEstimations.jobLogModal.js) | 4 | 1 |
| [tenant.views.workshop.jobs.vehicleQualityCheckModal](../../../readable/controllers/C1813--tenant.views.workshop.jobs.vehicleQualityCheckModal.js) | 5 | 2 |
| [tenant.views.workshop.jobs.closeWorkShop](../../../readable/controllers/C1800--tenant.views.workshop.jobs.closeWorkShop.js) | 26 | 8 |
| [tenant.views.workshop.jobs.createInvoiceOnOpenJob](../../../readable/controllers/C1801--tenant.views.workshop.jobs.createInvoiceOnOpenJob.js) | 24 | 7 |
| [tenant.views.workshop.jobs.jobTimeModal](../../../readable/controllers/C1809--tenant.views.workshop.jobs.jobTimeModal.js) | 7 | 2 |
| [tenant.views.workshop.jobEstimations.createOrEditModal](../../../readable/controllers/C1792--tenant.views.workshop.jobEstimations.createOrEditModal.js) | 33 | 19 |
| [tenant.views.crs.contacts.createOrEditModal](../../../readable/controllers/C0703--tenant.views.crs.contacts.createOrEditModal.js) | 45 | 24 |
| [tenant.views.workshop.serviceItems.serviceItemsSelectorModal](../../../readable/controllers/C1821--tenant.views.workshop.serviceItems.serviceItemsSelectorModal.js) | 3 | 0 |
| [tenant.views.crs.vehicles.searchVehicleModal](../../../readable/controllers/C1186--tenant.views.crs.vehicles.searchVehicleModal.js) | 13 | 11 |
| [tenant.views.crs.vehicles.createOrEditModal](../../../readable/controllers/C1163--tenant.views.crs.vehicles.createOrEditModal.js) | 34 | 13 |
| [tenant.views.crs.vehicles.addExternalWorkshopVehicle](../../../readable/controllers/C1159--tenant.views.crs.vehicles.addExternalWorkshopVehicle.js) | 5 | 3 |
| [tenant.views.stock.requisitions.createOrEditModal](../../../readable/controllers/C1706--tenant.views.stock.requisitions.createOrEditModal.js) | 10 | 4 |
| [tenant.views.stock.itemReturns.createOrEditModal](../../../readable/controllers/C1681--tenant.views.stock.itemReturns.createOrEditModal.js) | 11 | 5 |
| [tenant.views.stock.itemIssues.createOrEditModal](../../../readable/controllers/C1678--tenant.views.stock.itemIssues.createOrEditModal.js) | 11 | 5 |
| [tenant.views.workshop.jobEstimations.viewModal](../../../readable/controllers/C1798--tenant.views.workshop.jobEstimations.viewModal.js) | 6 | 4 |
| [tenant.views.workshop.jobEstimations.createLogModal](../../../readable/controllers/C1791--tenant.views.workshop.jobEstimations.createLogModal.js) | 5 | 1 |
| [tenant.views.common.supportRequests.uploadDocumentsModal](../../../readable/controllers/C0438--tenant.views.common.supportRequests.uploadDocumentsModal.js) | 3 | 0 |
| [tenant.views.workshop.jobs.jobLogModal](../../../readable/controllers/C1808--tenant.views.workshop.jobs.jobLogModal.js) | 9 | 3 |
| [tenant.views.crs.contacts.uploadDocumentModal](../../../readable/controllers/C0699--tenant.views.crs.contacts.uploadDocumentModal.js) | 2 | 1 |
| [tenant.views.crs.contacts.uploadDocumentModal](../../../readable/controllers/C0711--tenant.views.crs.contacts.uploadDocumentModal.js) | 2 | 1 |
| [tenant.views.common.documents.uploadDocumentModal](../../../readable/controllers/C0362--tenant.views.common.documents.uploadDocumentModal.js) | 4 | 0 |
| [tenant.views.common.documents.uploadImageModal](../../../readable/controllers/C0363--tenant.views.common.documents.uploadImageModal.js) | 3 | 0 |
| [tenant.views.common.documents.addCreditCardModal](../../../readable/controllers/C0701--tenant.views.common.documents.addCreditCardModal.js) | 4 | 0 |
| [tenant.views.common.makes.createOrEditModal](../../../readable/controllers/C0401--tenant.views.common.makes.createOrEditModal.js) | 2 | 2 |
| [tenant.views.common.vehiclemodels.createOrEditModal](../../../readable/controllers/C0444--tenant.views.common.vehiclemodels.createOrEditModal.js) | 3 | 3 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.workshop.jobs.index`: `getLabourActivitiesSearch`، `clearInsuranceCompany`، `clearSalesPerson`، `searchInsuranceCompany`، `roundingforView`، `addJobEstimation`، `searchUsers`، `searchUserssalep`، `createOrEditJob`، `createLubricationJob`، `dateRangeCheck`، `dateRangeModelChanged`، `searchCustomers`، `searchCustomerPopoup`، `getJobs`، `exportToExcelDetail`، `exportToExcel`، `report`، `clearCustomer`، `getStatusString`، `deleteJob`، `cancelJob`، `editPurchaseOrderModel`، `openprintModal`، `openprintModalGatePass`، `openJobViewModel`، `openJobLogModal`، `openVehicleQualityCheckModal`، `close`، `createInvoice`، `jobTime`، `getlocalDateTime`.
- وحدة `tenant.views.crs.contacts.searchContactModal`: `searchContacts`، `cancel`، `showAddContact`، `contactSelected`، `contactEdit`، `getContactsList`، `getNameWithCode`.
- وحدة `tenant.views.workshop.Jobs.createOrEditModal`: `localize`، `addJobDetail`، `addJobCharge`، `removeElementFromList`، `jobTypeOnChange`، `cancel`، `searchItems`، `openServiceItemsSelector`، `getAdditionalFields`، `branchTaxCode`، `customerSelected`، `calculateItemPrice`، `calculateLabourCharges`، `calculateJobDetailTotals`، `calculateTax`، `calculateJobTotals`، `searchVehicles`، `searchVehiclePopup`، `searchCustomers`، `searchSalesPerson`، `round`، `calculateDiscountOnRow`، `getServiceItems`، `searchInsuranceCompany`، `getServicesByModel`، `getServicesByVehicleId`، `getLabourTariffForJob`، `filterTariffLine`، `searchCustomerPopoup`، `searchStaff`، `getLabourActivitiesSearch`، `isTypeDuplicated`، `showHideServiceAlert`، `checkTypeDuplication`، `checkChassisNo`، `save`، `addExternalWorkshopVehiclePopup`، `openItemRequisition`، `openItemReturn`، `openItemIssue`.
- وحدة `tenant.views.workshop.Jobs.createOrEditLubricationJobModal`: `cancel`، `searchItems`، `openServiceItemsSelector`، `customerSelected`، `searchVehicles`، `searchVehiclePopup`، `searchCustomers`، `round`، `searchCustomerPopoup`، `save`، `addVehicle`، `addNewItem`، `addJobCharge`، `removeElementFromList`، `selectedVehicle`، `addExternalWorkshopVehiclePopup`، `openItemRequisition`، `openItemReturn`، `openItemIssue`، `validateForm`.
- وحدة `common.views.common.reportViewer`: `exportToExcelFromReport`، `cancel`.
- وحدة `tenant.views.workshop.jobs.editPurchaseOrderModel`: `cancel`، `save`، `searchLPONo`، `updatePO`.
- وحدة `tenant.views.workshop.Jobs.printTemplates.printPreview`: `cancel`، `getTemplateUrl`.
- وحدة `tenant.views.workshop.jobs.gatePassModal`: `cancel`، `getFaultValue`، `getlocalDateTime`، `getDate`.
- وحدة `tenant.views.workshop.jobs.viewModal`: `cancel`، `getlocalDateTime`، `getAdditionalFields`، `getFaultValue`، `getJobTypeName`، `getInsuranceTypeName`، `viewRelatedEstimation`.
- وحدة `tenant.views.workshop.jobEstimations.jobLogModal`: `cancel`، `getlocalDateTime`، `getOriginalName`، `createLog`.
- وحدة `tenant.views.workshop.jobs.vehicleQualityCheckModal`: `cancel`، `getlocalDateTime`، `getOriginalName`، `uploadDocument`، `save`.
- وحدة `tenant.views.workshop.jobs.closeWorkShop`: `cancel`، `getJobType`، `getInsuranceType`، `getlocalDateTime`، `damageChargesChanged`، `removeRow`، `rounding`، `sumAmountTax`، `cancel`، `localize`، `calculateTaxPerRow`، `calculateTaxPerRowCompnay`، `addRow`، `getlocalDateTime`، `generateInvoices`، `closeJob`، `closeWorkShopInsurance`، `sumInsuranceCompanyAmount`، `searchVehicles`، `nextSearch`، `previousAgreement`، `nextAgreement`، `previousInvoice`، `finishInvoice`، `sumInsuranceTax`، `sumCustomerTax`.
- وحدة `tenant.views.workshop.jobs.createInvoiceOnOpenJob`: `cancel`، `getJobType`، `getInsuranceType`، `getlocalDateTime`، `damageChargesChanged`، `removeRow`، `rounding`، `sumAmountTax`، `cancel`، `localize`، `calculateTaxPerRow`، `addRow`، `generateInvoices`، `createInvoice`، `closeWorkShopInsurance`، `sumInsuranceCompanyAmount`، `searchVehicles`، `nextSearch`، `previousAgreement`، `nextAgreement`، `previousInvoice`، `finishInvoice`، `sumInsuranceTax`، `sumCustomerTax`.
- وحدة `tenant.views.workshop.jobs.jobTimeModal`: `cancel`، `getJobType`، `getInsuranceType`، `getlocalDateTime`، `damageChargesChanged`، `openjobLogModal`، `getEstimation`.
- وحدة `tenant.views.workshop.jobEstimations.createOrEditModal`: `localize`، `addJobDetail`، `addJobCharge`، `removeElementFromList`، `jobTypeOnChange`، `cancel`، `searchItems`، `branchTaxCode`، `customerSelected`، `openServiceItemsSelector`، `getServiceItems`، `calculateTax`، `calculateJobEstimationTotals`، `searchInsuranceCompany`، `getServicesByModel`، `calculateDiscountOnRow`، `getLabourTariffForJob`، `getLabourTariffForJobEdit`، `filterTariffLine`، `calculateItemPrice`، `itemSelected`، `calculateLabourCharges`، `calculateJobDetailTotals`، `calculateEstimationTotals`، `searchVehicles`، `searchVehiclePopup`، `searchCustomers`، `searchCustomerPopoup`، `getLabourActivitiesSearch`، `isTypeDuplicated`، `checkTypeDuplication`، `save`، `addExternalWorkshopVehiclePopup`.
- وحدة `tenant.views.crs.contacts.createOrEditModal`: `localize`، `removeExternalIdRow`، `addExternalIdRow`، `getContactExternalType`، `isContactExternalType`، `getlocalDate`، `getlocalDateTime`، `getCardType`، `removeRow`، `searchSalesPersons`، `searchUsersWithDesignation`، `searchSalesPersonPopoup`، `salesPersonSelected`، `searchDebtCollectorPopoup`، `searchCustomLookup`، `getCustomLookups`، `scanDocument`، `openUploadDocument`، `openUploadPicture`، `addCreditCardRow`، `updateCreditCardRow`، `save`، `cancel`، `isPersonVerifiedChange`، `doesIdentityDoucmentExist`، `addIndentityDocument`، `getIdentificationDocumentType`، `removeIndentityDocument`، `removeDoc`، `isFieldMondatory`، `searchCountries`، `emiratesDataReader`، `emiratesDataFieldManager`، `getTariffCards`، `getTariffCardForContact`، `isDocument`، `maskCreditCard`، `getAdvanceSettings`، `getHighLightBlackListCountries`، `getNationalIdFormates`، `nationalIdFormate`، `onOverRideChange`، `resetDocumentNo`، `nationIdMaskInput`، `handleResidenceStatusChange`.
- وحدة `tenant.views.workshop.serviceItems.serviceItemsSelectorModal`: `selectionCommit`، `selectAllChange`، `cancel`.
- وحدة `tenant.views.crs.vehicles.searchVehicleModal`: `statusChanged`، `searchModel`، `cancel`، `clearInput`، `clearVehicle`، `getlocalDateTime`، `fromDateTimeChanged`، `searchVehicles`، `searchVehiclesFilters`، `exportToExcelByAgreement`، `vehicleSelected`، `getBookingDate`، `getTeriffGroups`.
- وحدة `tenant.views.crs.vehicles.createOrEditModal`: `removeImage`، `warrantyPeriodSelection`، `getCostCenterGroup`، `removeRow`، `addRow`، `isVehicleExternalType`، `removewarrantyRow`، `addwarrantyRow`، `searchMake`، `searchModel`، `searchOwner`، `cancel`، `vehicleInsuranceDateAdd`، `vehicleRegistrationDateAdd`، `createMake`، `createVehicleModel`، `locationPermission`، `getTeriffGroups`، `getSourceCode`، `getCostCenters`، `GetTypeOrOwnership`، `openUploadDocument`، `save`، `removeDocuments`، `openUploadDocumentModel`، `removeDocument`، `isDocument`، `isDocumentSepr`، `isAdditionalFieldsEnabled`، `isFieldMondatory`، `typeOfFeild`، `getAdvanceSettings`، `getInsuranceCompanies`، `getPlateNo`.
- وحدة `tenant.views.crs.vehicles.addExternalWorkshopVehicle`: `localize`، `cancel`، `searchModel`، `getTariffGroups`، `save`.
- وحدة `tenant.views.stock.requisitions.createOrEditModal`: `getJobType`، `jobSelected`، `cancel`، `clearModelData`، `productSelected`، `addRow`، `removeRow`، `searchItems`، `searchJobs`، `save`.
- وحدة `tenant.views.stock.itemReturns.createOrEditModal`: `cancel`، `jobSelected`، `getJobType`، `clearModelData`، `productSelected`، `addRow`، `removeRow`، `searchItems`، `searchJobs`، `sumAmount`، `save`.
- وحدة `tenant.views.stock.itemIssues.createOrEditModal`: `jobSelected`، `cancel`، `getJobType`، `clearModelData`، `productSelected`، `addRow`، `removeRow`، `searchItems`، `searchJobs`، `sumAmount`، `save`.
- وحدة `tenant.views.workshop.jobEstimations.viewModal`: `cancel`، `localize`، `getlocalDateTime`، `getFaultValue`، `getJobTypeName`، `getInsuranceTypeName`.
- وحدة `tenant.views.workshop.jobEstimations.createLogModal`: `cancel`، `getlocalDateTime`، `getOriginalName`، `uploadDocument`، `save`.
- وحدة `tenant.views.common.supportRequests.uploadDocumentsModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.workshop.jobs.jobLogModal`: `cancel`، `removeRow`، `deleteRow`، `getJobType`، `getInsuranceType`، `getlocalDateTime`، `getJobChargeTimeLogs`، `calculateTotalMinutes`، `save`.
- وحدة `tenant.views.crs.contacts.uploadDocumentModal`: `save`، `cancel`.
- وحدة `tenant.views.crs.contacts.uploadDocumentModal`: `save`، `cancel`.
- وحدة `tenant.views.common.documents.uploadDocumentModal`: `uploadHeader`، `uploader.onBeforeUploadItem`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.common.documents.uploadImageModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.common.documents.addCreditCardModal`: `ab`، `cardNumberChanged`، `save`، `cancel`.
- وحدة `tenant.views.common.makes.createOrEditModal`: `save`، `cancel`.
- وحدة `tenant.views.common.vehiclemodels.createOrEditModal`: `searchMake`، `save`، `cancel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.designation.getDesignations` | POST | api/services/app/designation/GetDesignations | [المصدر](../../../raw/application.js#L489112) |
| `abp.services.app.labourActivity.getLabourActivitiesSearch` | POST | api/services/app/labourActivity/GetLabourActivitiesSearch | [المصدر](../../../raw/application.js#L488769) |
| `abp.services.app.itemType.getItemTypes` | POST | api/services/app/itemType/GetItemTypes | [المصدر](../../../raw/application.js#L493560) |
| `abp.services.app.directory.search` | POST | api/services/app/directory/Search | [المصدر](../../../raw/application.js#L182771) |
| `abp.services.app.commonLookup.searchUsers` | POST | api/services/app/commonLookup/SearchUsers | [المصدر](../../../raw/application.js#L493588) |
| `abp.services.app.jobCategory.getJobCategory` | POST | api/services/app/jobCategory/GetJobCategory | [المصدر](../../../raw/application.js#L492719) |
| `abp.services.app.job.getJobs` | POST | api/services/app/job/GetJobs | [المصدر](../../../raw/application.js#L493762) |
| `abp.services.app.job.exportToExcelDetail` | POST | api/services/app/job/ExportToExcelDetail | [المصدر](../../../raw/application.js#L493798) |
| `abp.services.app.job.exportToExcel` | POST | api/services/app/job/ExportToExcel | [المصدر](../../../raw/application.js#L493829) |
| `abp.services.app.job.deleteJob` | POST | api/services/app/job/DeleteJob | [المصدر](../../../raw/application.js#L494066) |
| `abp.services.app.job.cancelJob` | POST | api/services/app/job/CancelJob | [المصدر](../../../raw/application.js#L494086) |
| `abp.services.app.job.validateGatePass` | POST | api/services/app/job/ValidateGatePass | [المصدر](../../../raw/application.js#L494133) |
| `abp.services.app.user.getSelectedBranchIdsByUserId` | POST | [object Object] | [المصدر](../../../raw/application.js#L494276) |
| `abp.services.app.commonLookup.getLocationsActiveAndInActive` | POST | api/services/app/commonLookup/GetLocationsActiveAndInActive | [المصدر](../../../raw/application.js#L494285) |
| `abp.services.app.job.closeJob` | POST | api/services/app/job/CloseJob | [المصدر](../../../raw/application.js#L491249) |
| `abp.services.app.directory.searchDirectoryPaged` | POST | api/services/app/directory/SearchDirectoryPaged | [المصدر](../../../raw/application.js#L184666) |
| `abp.services.app.item.searchItems` | POST | api/services/app/item/SearchItems | [المصدر](../../../raw/application.js#L464645) |
| `abp.services.app.tenantSettings.getDocumentSetting` | POST | [object Object] | [المصدر](../../../raw/application.js#L495760) |
| `abp.services.app.commonLookup.getLocationById` | POST | api/services/app/commonLookup/GetLocationById | [المصدر](../../../raw/application.js#L488411) |
| `abp.services.app.vehicle.searchVehiclesForWorkshop` | POST | api/services/app/vehicle/SearchVehiclesForWorkshop | [المصدر](../../../raw/application.js#L488747) |
| `abp.services.app.vehicleService.getVehicleServiceForEdit` | POST | api/services/app/vehicleService/GetVehicleServiceForEdit | [المصدر](../../../raw/application.js#L488505) |
| `abp.services.app.vehicleService.getVehicleServicesByModelOrDefault` | POST | api/services/app/vehicleService/GetVehicleServicesByModelOrDefault | [المصدر](../../../raw/application.js#L488593) |
| `abp.services.app.job.getVehicleServices` | POST | api/services/app/job/GetVehicleServices | [المصدر](../../../raw/application.js#L492666) |
| `abp.services.app.labourTariff.getLabourTariffByVehicleType` | POST | api/services/app/labourTariff/GetLabourTariffByVehicleType | [المصدر](../../../raw/application.js#L488639) |
| `abp.services.app.directory.searchStaff` | POST | api/services/app/directory/SearchStaff | [المصدر](../../../raw/application.js#L492731) |
| `abp.services.app.job.checkDuplicateChassisNo` | POST | [object Object] | [المصدر](../../../raw/application.js#L492784) |
| `abp.services.app.job.createOrUpdateJob` | POST | api/services/app/job/CreateOrUpdateJob | [المصدر](../../../raw/application.js#L492835) |
| `abp.services.app.chargesSetting.getChargesTypes` | POST | api/services/app/chargesSetting/GetChargesTypes | [المصدر](../../../raw/application.js#L490706) |
| `abp.services.app.workOrder.getWorkOrderForEdit` | POST | api/services/app/workOrder/GetWorkOrderForEdit | [المصدر](../../../raw/application.js#L491898) |
| `abp.services.app.jobEstimation.getJobEstimationForEdit` | POST | api/services/app/jobEstimation/GetJobEstimationForEdit | [المصدر](../../../raw/application.js#L490699) |
| `abp.services.app.job.getJobForEdit` | POST | api/services/app/job/GetJobForEdit | [المصدر](../../../raw/application.js#L488849) |
| `abp.services.app.bill.getBillForEdit` | POST | api/services/app/bill/GetBillForEdit | [المصدر](../../../raw/application.js#L495816) |
| `abp.services.app.vehicleService.getVehicleServices` | POST | api/services/app/vehicleService/GetVehicleServices | [المصدر](../../../raw/application.js#L489126) |
| `abp.services.app.labourActivity.getLabourActivities` | POST | api/services/app/labourActivity/GetLabourActivities | [المصدر](../../../raw/application.js#L490661) |
| `abp.services.app.job.createOrUpdateLubricationJob` | POST | api/services/app/job/CreateOrUpdateLubricationJob | [المصدر](../../../raw/application.js#L491882) |
| `abp.services.app.job.updatePo` | POST | api/services/app/job/UpdatePo | [المصدر](../../../raw/application.js#L493412) |
| `abp.services.app.purchaseOrder.searchLPONo` | POST | api/services/app/purchaseOrder/SearchLPONo | [المصدر](../../../raw/application.js#L493422) |
| `abp.services.app.job.getPrintForGatePass` | POST | api/services/app/job/GetPrintForGatePass | [المصدر](../../../raw/application.js#L493495) |
| `abp.services.app.jobEstimation.getJobLogs` | POST | api/services/app/jobEstimation/GetJobLogs | [المصدر](../../../raw/application.js#L489807) |
| `abp.services.app.job.addVehicleQualityCheckReport` | POST | api/services/app/job/AddVehicleQualityCheckReport | [المصدر](../../../raw/application.js#L495691) |
| `abp.services.app.job.getVehicleQualityCheckReportForEdit` | POST | [object Object] | [المصدر](../../../raw/application.js#L495701) |
| `abp.services.app.chargesSetting.getConfiguredChargesTypes` | POST | api/services/app/chargesSetting/GetConfiguredChargesTypes | [المصدر](../../../raw/application.js#L491501) |
| `abp.services.app.job.getJobForClosing` | POST | api/services/app/job/GetJobForClosing | [المصدر](../../../raw/application.js#L491618) |
| `abp.services.app.job.closeWorkShop` | POST | api/services/app/job/CloseWorkShop | [المصدر](../../../raw/application.js#L491682) |
| `abp.services.app.vehicle.searchVehicles` | POST | api/services/app/vehicle/SearchVehicles | [المصدر](../../../raw/application.js#L312838) |
| `abp.services.app.job.createInvoice` | POST | api/services/app/job/CreateInvoice | [المصدر](../../../raw/application.js#L491666) |
| `abp.services.app.job.getJobTime` | POST | api/services/app/job/GetJobTime | [المصدر](../../../raw/application.js#L494688) |
| `abp.services.app.jobEstimation.createOrUpdateJobEstimation` | POST | api/services/app/jobEstimation/CreateOrUpdateJobEstimation | [المصدر](../../../raw/application.js#L488829) |
| `abp.services.app.commonLookup.getLocations` | POST | api/services/app/commonLookup/GetLocations | [المصدر](../../../raw/application.js#L307287) |
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
| `abp.services.app.vehicleModel.searchVehicleModelsNew` | POST | api/services/app/vehicleModel/SearchVehicleModelsNew | [المصدر](../../../raw/application.js#L306019) |
| `abp.services.app.vehicle.searchVehiclesPagedWorkShop` | POST | api/services/app/vehicle/SearchVehiclesPagedWorkShop | [المصدر](../../../raw/application.js#L312796) |
| `abp.services.app.vehicle.searchVehiclesPagedByAgreement` | POST | [object Object] | [المصدر](../../../raw/application.js#L312800) |
| `abp.services.app.vehicle.searchVehiclesPaged` | POST | api/services/app/vehicle/SearchVehiclesPaged | [المصدر](../../../raw/application.js#L312803) |
| `abp.services.app.vehicle.exportToExcelByAgreement` | POST | api/services/app/vehicle/ExportToExcelByAgreement | [المصدر](../../../raw/application.js#L312885) |
| `abp.services.app.commonLookup.getTariffGroups` | POST | api/services/app/commonLookup/GetTariffGroups | [المصدر](../../../raw/application.js#L306025) |
| `abp.services.app.vehicleModel.searchVehicleMakes` | POST | api/services/app/vehicleModel/SearchVehicleMakes | [المصدر](../../../raw/application.js#L307225) |
| `abp.services.app.commonLookup.searchContact` | POST | api/services/app/commonLookup/SearchContact | [المصدر](../../../raw/application.js#L307244) |
| `abp.services.app.sourceCode.getSourceCodes` | POST | api/services/app/sourceCode/GetSourceCodes | [المصدر](../../../raw/application.js#L307408) |
| `abp.services.app.costCenter.searchCostCenters` | POST | api/services/app/costCenter/SearchCostCenters | [المصدر](../../../raw/application.js#L307414) |
| `abp.services.app.vehicle.createOrUpdateVehicle` | POST | api/services/app/vehicle/CreateOrUpdateVehicle | [المصدر](../../../raw/application.js#L307542) |
| `abp.services.app.uaeFine.getFiltersData` | POST | api/services/app/uaeFine/GetFiltersData | [المصدر](../../../raw/application.js#L307655) |
| `abp.services.app.vehicle.getAdvanceSettings` | POST | api/services/app/vehicle/GetAdvanceSettings | [المصدر](../../../raw/application.js#L307684) |
| `abp.services.app.vehicle.getInsuranceCompanies` | POST | api/services/app/vehicle/GetInsuranceCompanies | [المصدر](../../../raw/application.js#L307711) |
| `abp.services.app.vehicle.getVehicleForEdit` | POST | api/services/app/vehicle/GetVehicleForEdit | [المصدر](../../../raw/application.js#L307756) |
| `abp.services.app.vehicle.getNextFleetCode` | POST | api/services/app/vehicle/GetNextFleetCode | [المصدر](../../../raw/application.js#L306031) |
| `abp.services.app.job.searchJobDetails` | POST | api/services/app/job/SearchJobDetails | [المصدر](../../../raw/application.js#L464652) |
| `abp.services.app.itemRequisition.createOrUpdateItemRequisition` | POST | api/services/app/itemRequisition/CreateOrUpdateItemRequisition | [المصدر](../../../raw/application.js#L469932) |
| `abp.services.app.itemRequisition.getItemRequisitionForEdit` | POST | api/services/app/itemRequisition/GetItemRequisitionForEdit | [المصدر](../../../raw/application.js#L464699) |
| `abp.services.app.job.getItemReturnRows` | POST | api/services/app/job/GetItemReturnRows | [المصدر](../../../raw/application.js#L465122) |
| `abp.services.app.itemReturn.createOrUpdateItemReturn` | POST | api/services/app/itemReturn/CreateOrUpdateItemReturn | [المصدر](../../../raw/application.js#L465227) |
| `abp.services.app.itemReturn.getItemReturnForEdit` | POST | api/services/app/itemReturn/GetItemReturnForEdit | [المصدر](../../../raw/application.js#L465243) |
| `abp.services.app.itemIssue.createOrUpdateItemIssue` | POST | api/services/app/itemIssue/CreateOrUpdateItemIssue | [المصدر](../../../raw/application.js#L464683) |
| `abp.services.app.itemIssue.getItemIssueForEdit` | POST | api/services/app/itemIssue/GetItemIssueForEdit | [المصدر](../../../raw/application.js#L464729) |
| `abp.services.app.jobEstimation.addJobLog` | POST | api/services/app/jobEstimation/AddJobLog | [المصدر](../../../raw/application.js#L488304) |
| `abp.services.app.job.deleteJobTimeLogs` | POST | api/services/app/job/DeleteJobTimeLogs | [المصدر](../../../raw/application.js#L494520) |
| `abp.services.app.job.getJobChargeTimeLogs` | POST | api/services/app/job/GetJobChargeTimeLogs | [المصدر](../../../raw/application.js#L494554) |
| `abp.services.app.job.createJobTimeLogs` | POST | api/services/app/job/CreateJobTimeLogs | [المصدر](../../../raw/application.js#L494568) |
| `abp.services.app.person.uploadDocumentImage` | POST | api/services/app/person/UploadDocumentImage | [المصدر](../../../raw/application.js#L185476) |
| `abp.services.app.make.createOrUpdateMake` | POST | api/services/app/make/CreateOrUpdateMake | [المصدر](../../../raw/application.js#L101617) |
| `abp.services.app.make.getMakeForEdit` | POST | api/services/app/make/GetMakeForEdit | [المصدر](../../../raw/application.js#L101632) |
| `abp.services.app.make.searchMakes` | POST | api/services/app/make/SearchMakes | [المصدر](../../../raw/application.js#L115400) |
| `abp.services.app.vehicleModel.createOrUpdateVehicleModel` | POST | api/services/app/vehicleModel/CreateOrUpdateVehicleModel | [المصدر](../../../raw/application.js#L115409) |
| `abp.services.app.vehicleModel.getVehicleModelForEdit` | POST | api/services/app/vehicleModel/GetVehicleModelForEdit | [المصدر](../../../raw/application.js#L115424) |

## الصلاحيات والحقول

- صلاحية `Pages.WORKSHOP.JobEstimations.Create`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.WORKSHOP.Jobs.CreateInvoiceOnOpenJob`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Delete`: ممنوحة في السياق الملتقط.
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
- صلاحية `Pages.Tenant.Vehicles.ViewOtherBranchVehicles`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vehicles.AllActionsOnOtherBranchVehicles`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vehicles.CanChangeFleetType`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vehicles.CanChangeOwnership`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.SourceCodes`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vehicles.AllowEditNextRegistrationDate`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vehicles.AllowEditNextInsuranceDate`: ممنوحة في السياق الملتقط.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.filters.jobNo` | text |  |  |
| `vm.filters.estimationNo` | text |  |  |
| `vm.filters.workOrderNo` | text |  |  |
| `vm.filters.jobType` | select |  | ng-options=jobType.id as jobType.name for jobType in vm.jobTypes |
| `vm.dateRangeModel` | text |  | min=vm.dateRangeOptions.min; max=vm.dateRangeOptions.max; ng-disabled=!vm.filters.enableDateRange |
| `vm.filters.enableDateRange` | checkbox | disableDateRange |  |
| `vm.filters.filter` | text |  |  |
| `vm.filters.customer` | ui-select |  |  |
| `vm.filters.status` | select |  | ng-options=status.id as status.name for status in vm.statuses |
| `vm.filters.locationId` | select | locationId |  |
| `vm.filters.ownership` | select |  | ng-options=ownership.id as ownership.name for ownership in vm.ownership |
| `vm.filters.createdBy` | ui-select |  |  |
| `vm.filters.insuranceCompany` | ui-select |  |  |
| `vm.filters.salesPerson` | ui-select |  |  |
| `vm.filters.jobCategoryId` | select |  | ng-options=jobCategory.id as jobCategory.name for jobCategory in vm.jobCategories |
| `vm.filters.labourTypeId` | select |  | ng-options=labour.id as labour.name for labour in vm.labourTypes |
| `vm.filters.itemTypeId` | select |  | ng-options=item.id as item.name for item in vm.itemTypes |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
