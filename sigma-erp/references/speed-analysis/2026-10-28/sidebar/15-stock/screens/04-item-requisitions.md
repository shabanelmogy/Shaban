# شاشة: Item Requisitions

المسار في القائمة: Stock ← Item Requisitions.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.CRS_Requisitions`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0567](../../../readable/routes/R0567--tenant-crs-requisitions.js)، والأصل [raw/application.js:5839](../../../raw/application.js#L5839).
- قالب الشاشة: `~/App/tenant/views/stock/requisitions/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.stock.requisitions.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.stock.requisitions.index](../../../readable/controllers/C1707--tenant.views.stock.requisitions.index.js) | 16 | 4 |
| [tenant.views.crs.vouchers.purchaseRequest.createOrEditModal](../../../readable/controllers/C1407--tenant.views.crs.vouchers.purchaseRequest.createOrEditModal.js) | 31 | 15 |
| [tenant.views.stock.requisitions.createOrEditModal](../../../readable/controllers/C1706--tenant.views.stock.requisitions.createOrEditModal.js) | 10 | 4 |
| [tenant.views.stock.requisitions.printPreview](../../../readable/controllers/C1710--tenant.views.stock.requisitions.printPreview.js) | 2 | 0 |
| [tenant.views.stock.itemIssues.createOrEditModal](../../../readable/controllers/C1678--tenant.views.stock.itemIssues.createOrEditModal.js) | 11 | 5 |
| [common.views.common.reportViewer](../../../readable/controllers/C0006--common.views.common.reportViewer.js) | 2 | 0 |
| [tenant.views.crs.contacts.searchContactModal](../../../readable/controllers/C0706--tenant.views.crs.contacts.searchContactModal.js) | 7 | 2 |
| [tenant.views.fms.vehicleAssignments.searchOrganizationContactModal](../../../readable/controllers/C1565--tenant.views.fms.vehicleAssignments.searchOrganizationContactModal.js) | 3 | 7 |
| [tenant.views.crs.vouchers.purchaseRequest.openJobVehicleDetailModal](../../../readable/controllers/C1410--tenant.views.crs.vouchers.purchaseRequest.openJobVehicleDetailModal.js) | 4 | 3 |
| [tenant.views.common.approval.approvalModal](../../../readable/controllers/C0301--tenant.views.common.approval.approvalModal.js) | 14 | 5 |
| [tenant.views.crs.vouchers.purchaseRequest.approvalModal](../../../readable/controllers/C1406--tenant.views.crs.vouchers.purchaseRequest.approvalModal.js) | 8 | 3 |
| [tenant.views.crs.vouchers.bills.uploadDocumentsModal](../../../readable/controllers/C1248--tenant.views.crs.vouchers.bills.uploadDocumentsModal.js) | 3 | 0 |
| [tenant.views.crs.vouchers.purchaseRequest.printPreview](../../../readable/controllers/C1415--tenant.views.crs.vouchers.purchaseRequest.printPreview.js) | 2 | 0 |
| [tenant.views.crs.contacts.createOrEditModal](../../../readable/controllers/C0703--tenant.views.crs.contacts.createOrEditModal.js) | 45 | 24 |
| [tenant.views.fms.organizationChart.createOrEditUnitModal](../../../readable/controllers/C1559--tenant.views.fms.organizationChart.createOrEditUnitModal.js) | 2 | 2 |
| [tenant.views.common.approval.rejectionReason](../../../readable/controllers/C0303--tenant.views.common.approval.rejectionReason.js) | 3 | 0 |
| [tenant.views.crs.contacts.uploadDocumentModal](../../../readable/controllers/C0699--tenant.views.crs.contacts.uploadDocumentModal.js) | 2 | 1 |
| [tenant.views.crs.contacts.uploadDocumentModal](../../../readable/controllers/C0711--tenant.views.crs.contacts.uploadDocumentModal.js) | 2 | 1 |
| [tenant.views.common.documents.uploadDocumentModal](../../../readable/controllers/C0362--tenant.views.common.documents.uploadDocumentModal.js) | 4 | 0 |
| [tenant.views.common.documents.uploadImageModal](../../../readable/controllers/C0363--tenant.views.common.documents.uploadImageModal.js) | 3 | 0 |
| [tenant.views.common.documents.addCreditCardModal](../../../readable/controllers/C0701--tenant.views.common.documents.addCreditCardModal.js) | 4 | 0 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.stock.requisitions.index`: `dateRangeModelChanged`، `dateRangeCheck`، `getlocalDateTime`، `getJobType`، `getStatus`، `openCreateOrEditPurchaseRequestModal`، `openCreateOrEditModel`، `openViewModal`، `openprintModal`، `issueItems`، `searchJobs`، `clearJob`، `deleteItem`، `getItemRequisitions`، `exportToExcel`، `report`.
- وحدة `tenant.views.crs.vouchers.purchaseRequest.createOrEditModal`: `searchModel`، `rounding`، `roundingforView`، `searchVehicles`، `searchSupplier`، `searchSupplierPopoup`، `searchAdditionalDriverPopoup`، `onSupplierSelect`، `searchJobs`، `onJobSelectedForVoucherline`، `openJobVehicleModal`، `addRow`، `removeRow`، `changeTaxOnSupplier`، `calculateTaxPerRow`، `branchTaxCode`، `setTaxPercentOnTaxCode`، `sumAmount`، `sumAmountTax`، `getOriginalName`، `multiLevelApprovePurchaseRequest`، `approvePurchaseRequest`، `uploader.onSuccessItem`، `uploader.onErrorItem`، `uploadDocument`، `removeDocument`، `searchItems`، `calculateItemPrice`، `getUnitOfMeasures`، `save`، `cancel`.
- وحدة `tenant.views.stock.requisitions.createOrEditModal`: `getJobType`، `jobSelected`، `cancel`، `clearModelData`، `productSelected`، `addRow`، `removeRow`، `searchItems`، `searchJobs`، `save`.
- وحدة `tenant.views.stock.requisitions.printPreview`: `cancel`، `getTemplateUrl`.
- وحدة `tenant.views.stock.itemIssues.createOrEditModal`: `jobSelected`، `cancel`، `getJobType`، `clearModelData`، `productSelected`، `addRow`، `removeRow`، `searchItems`، `searchJobs`، `sumAmount`، `save`.
- وحدة `common.views.common.reportViewer`: `exportToExcelFromReport`، `cancel`.
- وحدة `tenant.views.crs.contacts.searchContactModal`: `searchContacts`، `cancel`، `showAddContact`، `contactSelected`، `contactEdit`، `getContactsList`، `getNameWithCode`.
- وحدة `tenant.views.fms.vehicleAssignments.searchOrganizationContactModal`: `contactSelected`، `organizationSelected`، `cancel`.
- وحدة `tenant.views.crs.vouchers.purchaseRequest.openJobVehicleDetailModal`: `localize`، `cancel`، `searchModel`، `getTariffGroups`.
- وحدة `tenant.views.common.approval.approvalModal`: `getRoleByUserId`، `convertTemptoUserInBranch`، `canApproveOrReject`، `canApproveOrRejectColumnWise`، `approveRow`، `rejectRow`، `cancel`، `rounding`، `getSources`، `getlocalDate`، `localize`، `getStatus`، `getRoles`، `getRole`.
- وحدة `tenant.views.crs.vouchers.purchaseRequest.approvalModal`: `canApproveOrReject`، `canApproveOrRejectColumnWise`، `approveRow`، `rejectRow`، `cancel`، `rounding`، `getlocalDate`، `localize`.
- وحدة `tenant.views.crs.vouchers.bills.uploadDocumentsModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.crs.vouchers.purchaseRequest.printPreview`: `cancel`، `getTemplateUrl`.
- وحدة `tenant.views.crs.contacts.createOrEditModal`: `localize`، `removeExternalIdRow`، `addExternalIdRow`، `getContactExternalType`، `isContactExternalType`، `getlocalDate`، `getlocalDateTime`، `getCardType`، `removeRow`، `searchSalesPersons`، `searchUsersWithDesignation`، `searchSalesPersonPopoup`، `salesPersonSelected`، `searchDebtCollectorPopoup`، `searchCustomLookup`، `getCustomLookups`، `scanDocument`، `openUploadDocument`، `openUploadPicture`، `addCreditCardRow`، `updateCreditCardRow`، `save`، `cancel`، `isPersonVerifiedChange`، `doesIdentityDoucmentExist`، `addIndentityDocument`، `getIdentificationDocumentType`، `removeIndentityDocument`، `removeDoc`، `isFieldMondatory`، `searchCountries`، `emiratesDataReader`، `emiratesDataFieldManager`، `getTariffCards`، `getTariffCardForContact`، `isDocument`، `maskCreditCard`، `getAdvanceSettings`، `getHighLightBlackListCountries`، `getNationalIdFormates`، `nationalIdFormate`، `onOverRideChange`، `resetDocumentNo`، `nationIdMaskInput`، `handleResidenceStatusChange`.
- وحدة `tenant.views.fms.organizationChart.createOrEditUnitModal`: `save`، `cancel`.
- وحدة `tenant.views.common.approval.rejectionReason`: `getlocalDate`، `localize`، `saveRejectionReason`.
- وحدة `tenant.views.crs.contacts.uploadDocumentModal`: `save`، `cancel`.
- وحدة `tenant.views.crs.contacts.uploadDocumentModal`: `save`، `cancel`.
- وحدة `tenant.views.common.documents.uploadDocumentModal`: `uploadHeader`، `uploader.onBeforeUploadItem`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.common.documents.uploadImageModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.common.documents.addCreditCardModal`: `ab`، `cardNumberChanged`، `save`، `cancel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.job.searchJobs` | POST | api/services/app/job/SearchJobs | [المصدر](../../../raw/application.js#L382820) |
| `abp.services.app.itemRequisition.deleteItemRequisition` | POST | api/services/app/itemRequisition/DeleteItemRequisition | [المصدر](../../../raw/application.js#L470264) |
| `abp.services.app.itemRequisition.getItemRequisitions` | POST | api/services/app/itemRequisition/GetItemRequisitions | [المصدر](../../../raw/application.js#L470284) |
| `abp.services.app.itemRequisition.exportToExcel` | POST | api/services/app/itemRequisition/ExportToExcel | [المصدر](../../../raw/application.js#L470302) |
| `abp.services.app.vehicleModel.searchVehicleModelsNew` | POST | api/services/app/vehicleModel/SearchVehicleModelsNew | [المصدر](../../../raw/application.js#L384601) |
| `abp.services.app.vehicle.searchVehicles` | POST | api/services/app/vehicle/SearchVehicles | [المصدر](../../../raw/application.js#L382735) |
| `abp.services.app.directory.search` | POST | api/services/app/directory/Search | [المصدر](../../../raw/application.js#L182771) |
| `abp.services.app.asset.getAssetType` | POST | api/services/app/asset/GetAssetType | [المصدر](../../../raw/application.js#L382752) |
| `abp.services.app.commonLookup.getLocations` | POST | api/services/app/commonLookup/GetLocations | [المصدر](../../../raw/application.js#L182597) |
| `abp.services.app.commonLookup.getLocationById` | POST | api/services/app/commonLookup/GetLocationById | [المصدر](../../../raw/application.js#L382944) |
| `abp.services.app.purchaseRequest.importFromExcel` | POST | [object Object] | [المصدر](../../../raw/application.js#L383162) |
| `abp.services.app.item.searchItems` | POST | api/services/app/item/SearchItems | [المصدر](../../../raw/application.js#L464645) |
| `abp.services.app.unitOfMeasure.getUnitOfMeasures` | POST | api/services/app/unitOfMeasure/GetUnitOfMeasures | [المصدر](../../../raw/application.js#L383254) |
| `abp.services.app.purchaseRequest.createOrUpdatePurchaseRequest` | POST | api/services/app/purchaseRequest/CreateOrUpdatePurchaseRequest | [المصدر](../../../raw/application.js#L383279) |
| `abp.services.app.itemRequisition.getItemRequisitionToCreatePR` | POST | api/services/app/itemRequisition/getItemRequisitionToCreatePR | [المصدر](../../../raw/application.js#L383329) |
| `abp.services.app.leaseQuotation.getLeaseQuotationToCreatePO` | POST | api/services/app/leaseQuotation/GetLeaseQuotationToCreatePO | [المصدر](../../../raw/application.js#L383355) |
| `abp.services.app.assetType.getAssetDefaultType` | POST | api/services/app/assetType/GetAssetDefaultType | [المصدر](../../../raw/application.js#L383358) |
| `abp.services.app.purchaseRequest.getPurchaseRequestForEdit` | POST | api/services/app/purchaseRequest/GetPurchaseRequestForEdit | [المصدر](../../../raw/application.js#L383384) |
| `abp.services.app.job.searchJobDetails` | POST | api/services/app/job/SearchJobDetails | [المصدر](../../../raw/application.js#L464652) |
| `abp.services.app.itemRequisition.createOrUpdateItemRequisition` | POST | api/services/app/itemRequisition/CreateOrUpdateItemRequisition | [المصدر](../../../raw/application.js#L469932) |
| `abp.services.app.itemRequisition.getItemRequisitionForEdit` | POST | api/services/app/itemRequisition/GetItemRequisitionForEdit | [المصدر](../../../raw/application.js#L464699) |
| `abp.services.app.itemIssue.createOrUpdateItemIssue` | POST | api/services/app/itemIssue/CreateOrUpdateItemIssue | [المصدر](../../../raw/application.js#L464683) |
| `abp.services.app.itemIssue.getItemIssueForEdit` | POST | api/services/app/itemIssue/GetItemIssueForEdit | [المصدر](../../../raw/application.js#L464729) |
| `abp.services.app.directory.searchDirectoryPaged` | POST | api/services/app/directory/SearchDirectoryPaged | [المصدر](../../../raw/application.js#L184666) |
| `abp.services.app.organizationChart.getOrganizationUnits` | POST | api/services/app/organizationChart/GetOrganizationUnits | [المصدر](../../../raw/application.js#L432892) |
| `abp.services.app.organizationChart.moveOrganizationUnit` | POST | api/services/app/organizationChart/MoveOrganizationUnit | [المصدر](../../../raw/application.js#L432955) |
| `abp.services.app.organizationChart.getOrganizationUnitAllUsers` | POST | api/services/app/organizationChart/GetOrganizationUnitAllUsers | [المصدر](../../../raw/application.js#L433187) |
| `abp.services.app.organizationChart.addUserToOrganizationUnit` | POST | api/services/app/organizationChart/AddUserToOrganizationUnit | [المصدر](../../../raw/application.js#L433107) |
| `abp.services.app.organizationChart.removeUserFromOrganizationUnit` | POST | api/services/app/organizationChart/RemoveUserFromOrganizationUnit | [المصدر](../../../raw/application.js#L433127) |
| `abp.services.app.organizationChart.isInOrganizationUnit` | POST | api/services/app/organizationChart/IsInOrganizationUnit | [المصدر](../../../raw/application.js#L433153) |
| `abp.services.app.commonLookup.getTariffGroups` | POST | api/services/app/commonLookup/GetTariffGroups | [المصدر](../../../raw/application.js#L384607) |
| `abp.services.app.vehicle.getNextFleetCode` | POST | api/services/app/vehicle/GetNextFleetCode | [المصدر](../../../raw/application.js#L384613) |
| `abp.services.app.user.getRoleByUserId` | POST | api/services/app/user/GetRoleByUserId | [المصدر](../../../raw/application.js#L84752) |
| `abp.services.app.approval.rejectionBySpecificUser` | POST | api/services/app/approval/RejectionBySpecificUser | [المصدر](../../../raw/application.js#L84812) |
| `abp.services.app.approval.approvalBySpecificUser` | POST | api/services/app/approval/ApprovalBySpecificUser | [المصدر](../../../raw/application.js#L84831) |
| `abp.services.app.user.getRole` | POST | api/services/app/user/GetRole | [المصدر](../../../raw/application.js#L84888) |
| `abp.services.app.approval.getApprovals` | POST | api/services/app/approval/GetApprovals | [المصدر](../../../raw/application.js#L84907) |
| `abp.services.app.purchaseRequest.voucherApprovalBySpecificUser` | POST | api/services/app/purchaseRequest/VoucherApprovalBySpecificUser | [المصدر](../../../raw/application.js#L382592) |
| `abp.services.app.purchaseRequest.voucherRejectionBySpecificUser` | POST | api/services/app/purchaseRequest/VoucherRejectionBySpecificUser | [المصدر](../../../raw/application.js#L382605) |
| `abp.services.app.purchaseRequest.getVoucherApprovals` | POST | api/services/app/purchaseRequest/GetVoucherApprovals | [المصدر](../../../raw/application.js#L382637) |
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

- صلاحية `Pages.Tenant.Vouchers.PurchaseOrders.AllActionsOnOtherBranchPurchaseOrders`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.PurchaseRequest.Approve`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Contacts.Delete`: ممنوحة في السياق الملتقط.
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
| `vm.filters.voucherNo` | text |  |  |
| `vm.filters.status` | select |  | ng-options=status.id as status.name for status in vm.statuses |
| `vm.dateRangeModel` | text |  | min=vm.dateRangeOptions.min; max=vm.dateRangeOptions.max; ng-disabled=!vm.filters.enableDateRange |
| `vm.filters.enableDateRange` | checkbox | disableDateRange |  |
| `vm.filters.job` | ui-select |  |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
