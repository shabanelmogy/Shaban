# شاشة: Quotations

المسار في القائمة: Equipment Rental ←  Quotations.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_ersQuotation`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0660](../../../readable/routes/R0660--tenant-crs-ersquotation.js)، والأصل [raw/application.js:6520](../../../raw/application.js#L6520).
- قالب الشاشة: `~/App/tenant/views/ers/quotation/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.ers.quotations.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.ers.quotations.index](../../../readable/controllers/C1494--tenant.views.ers.quotations.index.js) | 27 | 9 |
| [tenant.views.crs.contacts.searchContactModal](../../../readable/controllers/C0706--tenant.views.crs.contacts.searchContactModal.js) | 7 | 2 |
| [tenant.views.ers.quotation.printTemplates.printPreview](../../../readable/controllers/C1497--tenant.views.ers.quotation.printTemplates.printPreview.js) | 2 | 0 |
| [common.views.common.reportViewer](../../../readable/controllers/C0006--common.views.common.reportViewer.js) | 2 | 0 |
| [tenant.views.ers.quotation.createOrEditModal](../../../readable/controllers/C1492--tenant.views.ers.quotation.createOrEditModal.js) | 13 | 6 |
| [tenant.views.ers.quotation.createOrEditModal](../../../readable/controllers/C1493--tenant.views.ers.quotation.createOrEditModal.js) | 21 | 10 |
| [tenant.views.crs.vouchers.purchaseOrders.createOrEditModal](../../../readable/controllers/C1396--tenant.views.crs.vouchers.purchaseOrders.createOrEditModal.js) | 32 | 17 |
| [tenant.views.ers.masterAgreements.createOrEditModal](../../../readable/controllers/C1485--tenant.views.ers.masterAgreements.createOrEditModal.js) | 4 | 1 |
| [tenant.views.crs.contacts.createOrEditModal](../../../readable/controllers/C0703--tenant.views.crs.contacts.createOrEditModal.js) | 45 | 24 |
| [tenant.views.crs.vouchers.purchaseRequest.openJobVehicleDetailModal](../../../readable/controllers/C1410--tenant.views.crs.vouchers.purchaseRequest.openJobVehicleDetailModal.js) | 4 | 3 |
| [tenant.views.crs.vouchers.purchaseOrders.purchaseAndSalesHistoryModal](../../../readable/controllers/C1400--tenant.views.crs.vouchers.purchaseOrders.purchaseAndSalesHistoryModal.js) | 11 | 2 |
| [tenant.views.fms.vehicleAssignments.searchOrganizationContactModal](../../../readable/controllers/C1565--tenant.views.fms.vehicleAssignments.searchOrganizationContactModal.js) | 3 | 7 |
| [tenant.views.crs.vouchers.purchaseOrders.uploadDocumentsModal](../../../readable/controllers/C1284--tenant.views.crs.vouchers.purchaseOrders.uploadDocumentsModal.js) | 3 | 0 |
| [tenant.views.crs.vouchers.deposits.purchaseOrders.printPreview](../../../readable/controllers/C1405--tenant.views.crs.vouchers.deposits.purchaseOrders.printPreview.js) | 2 | 0 |
| [tenant.views.crs.contacts.uploadDocumentModal](../../../readable/controllers/C0699--tenant.views.crs.contacts.uploadDocumentModal.js) | 2 | 1 |
| [tenant.views.crs.contacts.uploadDocumentModal](../../../readable/controllers/C0711--tenant.views.crs.contacts.uploadDocumentModal.js) | 2 | 1 |
| [tenant.views.common.documents.uploadDocumentModal](../../../readable/controllers/C0362--tenant.views.common.documents.uploadDocumentModal.js) | 4 | 0 |
| [tenant.views.common.documents.uploadImageModal](../../../readable/controllers/C0363--tenant.views.common.documents.uploadImageModal.js) | 3 | 0 |
| [tenant.views.common.documents.addCreditCardModal](../../../readable/controllers/C0701--tenant.views.common.documents.addCreditCardModal.js) | 4 | 0 |
| [tenant.views.fms.organizationChart.createOrEditUnitModal](../../../readable/controllers/C1559--tenant.views.fms.organizationChart.createOrEditUnitModal.js) | 2 | 2 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.ers.quotations.index`: `dateRangeCheck`، `dateRangeModelChanged`، `CurrencyFormate`، `getQuotationType`، `getStatus`، `searchContact`، `searchContactPopoup`، `getQuotations`، `getlocalDate`، `exportToExcel`، `openprintModal`، `report`، `canPrint`، `canCreateMasterAgreementAndPO`، `canRevise`، `createPOQuotation`، `createMasterAgreement`، `createQuotation`، `editQuotation`، `viewQuotation`، `deleteQuotation`، `approveQuotation`، `rejectQuotation`، `approveQuotationByCustomer`، `rejectQuotationByCustomer`، `enterKeyPress`، `clearCustomer`.
- وحدة `tenant.views.crs.contacts.searchContactModal`: `searchContacts`، `cancel`، `showAddContact`، `contactSelected`، `contactEdit`، `getContactsList`، `getNameWithCode`.
- وحدة `tenant.views.ers.quotation.printTemplates.printPreview`: `cancel`، `getTemplateUrl`.
- وحدة `common.views.common.reportViewer`: `exportToExcelFromReport`، `cancel`.
- وحدة `tenant.views.ers.quotation.createOrEditModal`: `rounding`، `localize`، `getRateType`، `vehicleTypeChanged`، `quotationTypeChanged`، `searchContact`، `searchContactPopoup`، `getTariffGroups`، `getStatus`، `addRow`، `removeRow`، `cancel`، `save`.
- وحدة `tenant.views.ers.quotation.createOrEditModal`: `rounding`، `localize`، `getPeriodType`، `getRateType`، `vehicleTypeChanged`، `quotationTypeChanged`، `searchContact`، `searchContactPerson`، `customerChanged`، `searchContactPopoup`، `modelSelected`، `vehicleTypeChanged`، `searchModel`، `getTariffGroups`، `getStatus`، `addRow`، `removeRow`، `addAttachementRow`، `removeAttachmentRow`، `cancel`، `save`.
- وحدة `tenant.views.crs.vouchers.purchaseOrders.createOrEditModal`: `getWorkTypeText`، `supplierSelected`، `rounding`، `roundingforView`، `openJobVehicleModal`، `searchVehicles`، `searchSupplier`، `purchaseAndSalesHistoryModel`، `searchSupplierPopoup`، `searchAdditionalDriverPopoup`، `addRow`، `removeRow`، `clearOrder`، `branchTaxCode`، `setTaxPercentOnTaxCode`، `calculateTaxPerRow`، `searchMasterAgreement`، `sumAmount`، `sumAmountTax`، `searchItems`، `pOUnitPriceBasedOnLastSupplier`، `calculateItemPrice`، `getUnitOfMeasures`، `searchJobs`، `onItemSelected`، `onJobSelectedForVoucherline`، `uploadDocument`، `getOriginalName`، `removeDocument`، `save`، `cancel`، `searchModel`.
- وحدة `tenant.views.ers.masterAgreements.createOrEditModal`: `rounding`، `localize`، `cancel`، `save`.
- وحدة `tenant.views.crs.contacts.createOrEditModal`: `localize`، `removeExternalIdRow`، `addExternalIdRow`، `getContactExternalType`، `isContactExternalType`، `getlocalDate`، `getlocalDateTime`، `getCardType`، `removeRow`، `searchSalesPersons`، `searchUsersWithDesignation`، `searchSalesPersonPopoup`، `salesPersonSelected`، `searchDebtCollectorPopoup`، `searchCustomLookup`، `getCustomLookups`، `scanDocument`، `openUploadDocument`، `openUploadPicture`، `addCreditCardRow`، `updateCreditCardRow`، `save`، `cancel`، `isPersonVerifiedChange`، `doesIdentityDoucmentExist`، `addIndentityDocument`، `getIdentificationDocumentType`، `removeIndentityDocument`، `removeDoc`، `isFieldMondatory`، `searchCountries`، `emiratesDataReader`، `emiratesDataFieldManager`، `getTariffCards`، `getTariffCardForContact`، `isDocument`، `maskCreditCard`، `getAdvanceSettings`، `getHighLightBlackListCountries`، `getNationalIdFormates`، `nationalIdFormate`، `onOverRideChange`، `resetDocumentNo`، `nationIdMaskInput`، `handleResidenceStatusChange`.
- وحدة `tenant.views.crs.vouchers.purchaseRequest.openJobVehicleDetailModal`: `localize`، `cancel`، `searchModel`، `getTariffGroups`.
- وحدة `tenant.views.crs.vouchers.purchaseOrders.purchaseAndSalesHistoryModal`: `CurrencyFormate`، `roundingforView`، `dateRangeCheck`، `dateRangeModelChanged`، `isPrintEnabled`، `getlocalDateTime`، `getPurchaseHistory`، `customFilter`، `getSaleHistory`، `openprintModal`، `cancel`.
- وحدة `tenant.views.fms.vehicleAssignments.searchOrganizationContactModal`: `contactSelected`، `organizationSelected`، `cancel`.
- وحدة `tenant.views.crs.vouchers.purchaseOrders.uploadDocumentsModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.crs.vouchers.deposits.purchaseOrders.printPreview`: `cancel`، `getTemplateUrl`.
- وحدة `tenant.views.crs.contacts.uploadDocumentModal`: `save`، `cancel`.
- وحدة `tenant.views.crs.contacts.uploadDocumentModal`: `save`، `cancel`.
- وحدة `tenant.views.common.documents.uploadDocumentModal`: `uploadHeader`، `uploader.onBeforeUploadItem`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.common.documents.uploadImageModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.common.documents.addCreditCardModal`: `ab`، `cardNumberChanged`، `save`، `cancel`.
- وحدة `tenant.views.fms.organizationChart.createOrEditUnitModal`: `save`، `cancel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.directory.search` | POST | api/services/app/directory/Search | [المصدر](../../../raw/application.js#L182771) |
| `abp.services.app.quotation.getQuotations` | POST | api/services/app/quotation/GetQuotations | [المصدر](../../../raw/application.js#L407852) |
| `abp.services.app.quotation.exportToExcel` | POST | api/services/app/quotation/ExportToExcel | [المصدر](../../../raw/application.js#L407889) |
| `abp.services.app.quotation.deleteQuotation` | POST | api/services/app/quotation/DeleteQuotation | [المصدر](../../../raw/application.js#L408176) |
| `abp.services.app.quotation.approveQuotation` | POST | api/services/app/quotation/ApproveQuotation | [المصدر](../../../raw/application.js#L408195) |
| `abp.services.app.quotation.rejectQuotation` | POST | api/services/app/quotation/RejectQuotation | [المصدر](../../../raw/application.js#L408213) |
| `abp.services.app.quotation.approveQuotationByCustomer` | POST | api/services/app/quotation/ApproveQuotationByCustomer | [المصدر](../../../raw/application.js#L408230) |
| `abp.services.app.quotation.rejectQuotationByCustomer` | POST | api/services/app/quotation/RejectQuotationByCustomer | [المصدر](../../../raw/application.js#L408248) |
| `abp.services.app.commonLookup.getLocations` | POST | api/services/app/commonLookup/GetLocations | [المصدر](../../../raw/application.js#L182597) |
| `abp.services.app.directory.searchDirectoryPaged` | POST | api/services/app/directory/SearchDirectoryPaged | [المصدر](../../../raw/application.js#L184666) |
| `abp.services.app.eRSTariff.getTariff` | POST | api/services/app/eRSTariff/GetTariff | [المصدر](../../../raw/application.js#L407382) |
| `abp.services.app.chargesSetting.getChargesSettings` | POST | api/services/app/chargesSetting/GetChargesSettings | [المصدر](../../../raw/application.js#L407160) |
| `abp.services.app.commonLookup.getTariffGroups` | POST | api/services/app/commonLookup/GetTariffGroups | [المصدر](../../../raw/application.js#L384607) |
| `abp.services.app.quotation.getQuotationForEdit` | POST | api/services/app/quotation/GetQuotationForEdit | [المصدر](../../../raw/application.js#L407610) |
| `abp.services.app.quotation.createOrUpdateQuotation` | POST | api/services/app/quotation/CreateOrUpdateQuotation | [المصدر](../../../raw/application.js#L407672) |
| `abp.services.app.directory.getContactsByCompanyId` | POST | api/services/app/directory/GetContactsByCompanyId | [المصدر](../../../raw/application.js#L407488) |
| `abp.services.app.vehicleModel.searchVehicleModelsNew` | POST | api/services/app/vehicleModel/SearchVehicleModelsNew | [المصدر](../../../raw/application.js#L384601) |
| `abp.services.app.quotation.getQuotationForRevision` | POST | api/services/app/quotation/GetQuotationForRevision | [المصدر](../../../raw/application.js#L407608) |
| `abp.services.app.quotation.reviseQuotation` | POST | api/services/app/quotation/ReviseQuotation | [المصدر](../../../raw/application.js#L407670) |
| `abp.services.app.vehicle.searchVehicles` | POST | api/services/app/vehicle/SearchVehicles | [المصدر](../../../raw/application.js#L380113) |
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
| `abp.services.app.masterAgreement.createOrUpdateMasterAgreement` | POST | api/services/app/masterAgreement/CreateOrUpdateMasterAgreement | [المصدر](../../../raw/application.js#L405452) |
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
| `abp.services.app.vehicle.getNextFleetCode` | POST | api/services/app/vehicle/GetNextFleetCode | [المصدر](../../../raw/application.js#L384613) |
| `abp.services.app.stockReport.getItemsPurchaseHistory` | POST | api/services/app/stockReport/GetItemsPurchaseHistory | [المصدر](../../../raw/application.js#L382076) |
| `abp.services.app.stockReport.getItemsSaleHistory` | POST | api/services/app/stockReport/GetItemsSaleHistory | [المصدر](../../../raw/application.js#L382155) |
| `abp.services.app.organizationChart.getOrganizationUnits` | POST | api/services/app/organizationChart/GetOrganizationUnits | [المصدر](../../../raw/application.js#L432892) |
| `abp.services.app.organizationChart.moveOrganizationUnit` | POST | api/services/app/organizationChart/MoveOrganizationUnit | [المصدر](../../../raw/application.js#L432955) |
| `abp.services.app.organizationChart.getOrganizationUnitAllUsers` | POST | api/services/app/organizationChart/GetOrganizationUnitAllUsers | [المصدر](../../../raw/application.js#L433187) |
| `abp.services.app.organizationChart.addUserToOrganizationUnit` | POST | api/services/app/organizationChart/AddUserToOrganizationUnit | [المصدر](../../../raw/application.js#L433107) |
| `abp.services.app.organizationChart.removeUserFromOrganizationUnit` | POST | api/services/app/organizationChart/RemoveUserFromOrganizationUnit | [المصدر](../../../raw/application.js#L433127) |
| `abp.services.app.organizationChart.isInOrganizationUnit` | POST | api/services/app/organizationChart/IsInOrganizationUnit | [المصدر](../../../raw/application.js#L433153) |
| `abp.services.app.person.uploadDocumentImage` | POST | api/services/app/person/UploadDocumentImage | [المصدر](../../../raw/application.js#L185476) |
| `abp.services.app.organizationChart.updateOrganizationUnit` | POST | api/services/app/organizationChart/UpdateOrganizationUnit | [المصدر](../../../raw/application.js#L430943) |
| `abp.services.app.organizationChart.createOrganizationUnit` | POST | api/services/app/organizationChart/CreateOrganizationUnit | [المصدر](../../../raw/application.js#L430950) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.ERS.Quotations.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.ERS.Quotations.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.ERS.Quotations.Delete`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.ERS.Quotations.View`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.ERS.Quotations.InternallyApprove`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.ERS.Quotations.InternallyReject`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.ERS.Quotations.ApproveByCustomer`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.ERS.Quotations.RejectByCustomer`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.ERS.Quotations.Revise`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.ERS.Quotations.Print`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.ERS.Quotations.CreatePO`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.ERS.Quotations.CreateMasterAgreement`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.ERS.Quotations.EditApprovedQuotation`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Delete`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.PurchaseOrders.AllActionsOnOtherBranchPurchaseOrders`: ممنوحة في السياق الملتقط.
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
- صلاحية `Pages.Administration.OrganizationUnits.ManageOrganizationTree`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Administration.OrganizationUnits.ManageMembers`: ممنوحة في السياق الملتقط.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.filters.quotationNo` | text |  |  |
| `vm.filters.locationId` | select | type | ng-options=l.id as l.name for l in vm.locations |
| `vm.dateRangeModel` | text |  | min=vm.dateRangeOptions.min; max=vm.dateRangeOptions.max; ng-disabled=!vm.filters.enableDateRange |
| `vm.filters.enableDateRange` | checkbox | disableDateRange |  |
| `vm.filters.customer` | ui-select |  |  |
| `vm.filters.status` | select |  | ng-options=status.id as status.name for status in vm.statuses |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
