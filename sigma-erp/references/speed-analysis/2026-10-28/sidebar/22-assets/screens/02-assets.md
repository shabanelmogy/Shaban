# شاشة: Assets

المسار في القائمة: Assets ← Assets.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.crs_assets`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0467](../../../readable/routes/R0467--tenant-crs-assets.js)، والأصل [raw/application.js:4975](../../../raw/application.js#L4975).
- قالب الشاشة: `~/App/tenant/views/crs/assets/assets/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.crs.assets.assets.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.crs.assets.assets.index](../../../readable/controllers/C0584--tenant.views.crs.assets.assets.index.js) | 23 | 10 |
| [tenant.views.crs.assets.assets.printtemplates.printPreview](../../../readable/controllers/C0590--tenant.views.crs.assets.assets.printtemplates.printPreview.js) | 2 | 0 |
| [tenant.views.crs.assets.assets.salePriceModal](../../../readable/controllers/C0587--tenant.views.crs.assets.assets.salePriceModal.js) | 5 | 2 |
| [common.views.common.reportViewer](../../../readable/controllers/C0006--common.views.common.reportViewer.js) | 2 | 0 |
| [tenant.views.crs.assets.assets.createOrEditModal](../../../readable/controllers/C0580--tenant.views.crs.assets.assets.createOrEditModal.js) | 29 | 11 |
| [tenant.views.crs.assets.assets.disposalApprovalModal](../../../readable/controllers/C0582--tenant.views.crs.assets.assets.disposalApprovalModal.js) | 15 | 8 |
| [tenant.views.common.approval.approvalViewModal](../../../readable/controllers/C0302--tenant.views.common.approval.approvalViewModal.js) | 10 | 3 |
| [tenant.views.crs.assets.assets.disposeAsset](../../../readable/controllers/C0583--tenant.views.crs.assets.assets.disposeAsset.js) | 37 | 14 |
| [tenant.views.crs.assets.assets.viewModal](../../../readable/controllers/C0588--tenant.views.crs.assets.assets.viewModal.js) | 12 | 3 |
| [tenant.views.crs.assets.assets.depreciationDetailModal](../../../readable/controllers/C0581--tenant.views.crs.assets.assets.depreciationDetailModal.js) | 5 | 1 |
| [tenant.views.crs.contacts.searchContactModal](../../../readable/controllers/C0706--tenant.views.crs.contacts.searchContactModal.js) | 7 | 2 |
| [tenant.views.crs.vouchers.bills.uploadDocumentsModal](../../../readable/controllers/C1248--tenant.views.crs.vouchers.bills.uploadDocumentsModal.js) | 3 | 0 |
| [tenant.views.crs.contacts.searchContactOptionModal](../../../readable/controllers/C0707--tenant.views.crs.contacts.searchContactOptionModal.js) | 7 | 1 |
| [tenant.views.crs.contacts.createOrEditModal](../../../readable/controllers/C0703--tenant.views.crs.contacts.createOrEditModal.js) | 45 | 24 |
| [tenant.views.crs.contacts.uploadDocumentModal](../../../readable/controllers/C0699--tenant.views.crs.contacts.uploadDocumentModal.js) | 2 | 1 |
| [tenant.views.crs.contacts.uploadDocumentModal](../../../readable/controllers/C0711--tenant.views.crs.contacts.uploadDocumentModal.js) | 2 | 1 |
| [tenant.views.common.documents.uploadDocumentModal](../../../readable/controllers/C0362--tenant.views.common.documents.uploadDocumentModal.js) | 4 | 0 |
| [tenant.views.common.documents.uploadImageModal](../../../readable/controllers/C0363--tenant.views.common.documents.uploadImageModal.js) | 3 | 0 |
| [tenant.views.common.documents.addCreditCardModal](../../../readable/controllers/C0701--tenant.views.common.documents.addCreditCardModal.js) | 4 | 0 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.crs.assets.assets.index`: `CurrencyFormate`، `getLocationName`، `getLocationNameTwo`، `getlocalDateTime`، `dateRangeCheck`، `rounding`، `printAssetPrintModal`، `assetSalePriceModal`، `report`، `exportToExcel`، `rejectDisposal`، `approveDisposal`، `viewApprovals`، `createAsset`، `viewAsset`، `editAsset`، `disposeAsset`، `deleteAsset`، `searchAssets`، `clearParentAsset`، `dateRangeModelChanged`، `getAssets`، `enterKeyPress`.
- وحدة `tenant.views.crs.assets.assets.printtemplates.printPreview`: `cancel`، `getTemplateUrl`.
- وحدة `tenant.views.crs.assets.assets.salePriceModal`: `rounding`، `getCostCenterGroup`، `cancel`، `depreciationPopUp`، `changeSalePriceByUser`.
- وحدة `common.views.common.reportViewer`: `exportToExcelFromReport`، `cancel`.
- وحدة `tenant.views.crs.assets.assets.createOrEditModal`: `getCostCenterGroup`، `zerofyMinValue`، `rounding`، `getlocalDateTime`، `depreciationMethodChanged`، `removeRow`، `changeAsset`، `calculateTotalAttachmentCost`، `prepareCustomDepreciationTable`، `sumCustomYearDepreciation`، `addRow`، `addRowPermanent`، `searchAssetsWithNullParentId`، `searchAssetsWithNullParentIdR`، `deprStartDateChange`، `purchaseDateChange`، `inServiceDateChange`، `searchSupplier`، `searchSupplierPopoup`، `searchAssets`، `clearParentAsset`، `checkDuplicationOfAttachments`، `save`، `setDepreciationMethods`، `setResidualValue`، `setAssetLife`، `setAnnualDeprPercentage`، `setOpeningDepr`، `cancel`.
- وحدة `tenant.views.crs.assets.assets.disposalApprovalModal`: `rounding`، `getlocalDateTime`، `isDocument`، `getDisposalType`، `getOriginalName`، `cancel`، `depreciationPopUp`، `changeSalePriceByUser`، `getRoleByUserId`، `getRoles`، `getRole`، `canApproveOrRejectColumnWise`، `canApproveOrReject`، `approveRow`، `save`.
- وحدة `tenant.views.common.approval.approvalViewModal`: `getRoleByUserId`، `canApproveOrReject`، `canApproveOrRejectColumnWise`، `cancel`، `rounding`، `getlocalDate`، `localize`، `getStatus`، `getRoles`، `getRole`.
- وحدة `tenant.views.crs.assets.assets.disposeAsset`: `zerofyMinValue`، `addCustomDisposalType`، `removeDocument`، `getOriginalName`، `rounding`، `uploadDocument`، `disposalDateChanged`، `disposalTypeChange`، `searchCustomerPopoup`، `setVoucherLineForTotalLossDisposal`، `searchContact`، `searchCustomers`، `customerSelected`، `getCustomDisposal`، `getPendingDepreciation`، `pendingDepreciationChanged`، `addRow`، `removeRow`، `calculateDebitCreditSum`، `soldToContactChanged`، `onDiscountChange`، `salePriceChanged`، `salePriceWithTaxChanged`، `salePriceWithoutTaxChanged`، `taxChanged`، `changeTaxOrNetPrice`، `salePriceWODiscountChanged`، `getEffectiveSalePrice`، `getProfitOrLossAmount`، `searchAccounts`، `onClaimChargesChange`، `isDeprEndDateForSaleDate`، `save`، `searchVehicles`، `cancel`، `accountChangedForTax`، `accountChanged`.
- وحدة `tenant.views.crs.assets.assets.viewModal`: `rounding`، `getlocalDateTime`، `getLocationName`، `getLocationNameTwo`، `uploadDocument`، `isDocument`، `getCostCenterGroup`، `getOriginalName`، `cancel`، `depreciationPopUp`، `changeSalePriceByUser`، `viewAsset`.
- وحدة `tenant.views.crs.assets.assets.depreciationDetailModal`: `CurrencyFormate`، `ConvertToNumFormate`، `getlocalDateTime`، `cancel`، `getlocalDateTimeShort`.
- وحدة `tenant.views.crs.contacts.searchContactModal`: `searchContacts`، `cancel`، `showAddContact`، `contactSelected`، `contactEdit`، `getContactsList`، `getNameWithCode`.
- وحدة `tenant.views.crs.vouchers.bills.uploadDocumentsModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.crs.contacts.searchContactOptionModal`: `searchContacts`، `cancel`، `showAddContact`، `contactSelected`، `contactEdit`، `getContactsList`، `getNameWithCode`.
- وحدة `tenant.views.crs.contacts.createOrEditModal`: `localize`، `removeExternalIdRow`، `addExternalIdRow`، `getContactExternalType`، `isContactExternalType`، `getlocalDate`، `getlocalDateTime`، `getCardType`، `removeRow`، `searchSalesPersons`، `searchUsersWithDesignation`، `searchSalesPersonPopoup`، `salesPersonSelected`، `searchDebtCollectorPopoup`، `searchCustomLookup`، `getCustomLookups`، `scanDocument`، `openUploadDocument`، `openUploadPicture`، `addCreditCardRow`، `updateCreditCardRow`، `save`، `cancel`، `isPersonVerifiedChange`، `doesIdentityDoucmentExist`، `addIndentityDocument`، `getIdentificationDocumentType`، `removeIndentityDocument`، `removeDoc`، `isFieldMondatory`، `searchCountries`، `emiratesDataReader`، `emiratesDataFieldManager`، `getTariffCards`، `getTariffCardForContact`، `isDocument`، `maskCreditCard`، `getAdvanceSettings`، `getHighLightBlackListCountries`، `getNationalIdFormates`، `nationalIdFormate`، `onOverRideChange`، `resetDocumentNo`، `nationIdMaskInput`، `handleResidenceStatusChange`.
- وحدة `tenant.views.crs.contacts.uploadDocumentModal`: `save`، `cancel`.
- وحدة `tenant.views.crs.contacts.uploadDocumentModal`: `save`، `cancel`.
- وحدة `tenant.views.common.documents.uploadDocumentModal`: `uploadHeader`، `uploader.onBeforeUploadItem`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.common.documents.uploadImageModal`: `uploadHeader`، `uploader.onSuccessItem`، `cancel`.
- وحدة `tenant.views.common.documents.addCreditCardModal`: `ab`، `cardNumberChanged`، `save`، `cancel`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.commonLookup.getLocations` | POST | api/services/app/commonLookup/GetLocations | [المصدر](../../../raw/application.js#L182597) |
| `abp.services.app.commonLookup.getTariffGroups` | POST | api/services/app/commonLookup/GetTariffGroups | [المصدر](../../../raw/application.js#L160797) |
| `abp.services.app.asset.exportToExcelThroughView` | POST | api/services/app/asset/ExportToExcelThroughView | [المصدر](../../../raw/application.js#L160995) |
| `abp.services.app.asset.rejectDisposal` | POST | api/services/app/asset/RejectDisposal | [المصدر](../../../raw/application.js#L161036) |
| `abp.services.app.asset.deleteAsset` | POST | api/services/app/asset/DeleteAsset | [المصدر](../../../raw/application.js#L161167) |
| `abp.services.app.asset.getAssetType` | POST | api/services/app/asset/GetAssetType | [المصدر](../../../raw/application.js#L159280) |
| `abp.services.app.asset.approveDisposal` | POST | api/services/app/asset/ApproveDisposal | [المصدر](../../../raw/application.js#L159739) |
| `abp.services.app.asset.search` | POST | api/services/app/asset/Search | [المصدر](../../../raw/application.js#L159330) |
| `abp.services.app.asset.getAssets` | POST | api/services/app/asset/GetAssets | [المصدر](../../../raw/application.js#L161234) |
| `abp.services.app.fiscalYear.getFirstFiscalYear` | POST | api/services/app/fiscalYear/GetFirstFiscalYear | [المصدر](../../../raw/application.js#L161240) |
| `abp.services.app.asset.changeSalePriceByUser` | POST | api/services/app/asset/ChangeSalePriceByUser | [المصدر](../../../raw/application.js#L161653) |
| `abp.services.app.asset.getAssetForView` | POST | api/services/app/asset/GetAssetForView | [المصدر](../../../raw/application.js#L161689) |
| `abp.services.app.asset.setParentIdAsNullForDeletedRow` | POST | api/services/app/asset/SetParentIdAsNullForDeletedRow | [المصدر](../../../raw/application.js#L159115) |
| `abp.services.app.asset.searchAssetsWithNullParentId` | POST | api/services/app/asset/SearchAssetsWithNullParentId | [المصدر](../../../raw/application.js#L159236) |
| `abp.services.app.costCenter.searchCostCenters` | POST | api/services/app/costCenter/SearchCostCenters | [المصدر](../../../raw/application.js#L159253) |
| `abp.services.app.asset.getDepreciationMethod` | POST | api/services/app/asset/GetDepreciationMethod | [المصدر](../../../raw/application.js#L159289) |
| `abp.services.app.directory.search` | POST | api/services/app/directory/Search | [المصدر](../../../raw/application.js#L182771) |
| `abp.services.app.asset.createOrUpdateAsset` | POST | api/services/app/asset/CreateOrUpdateAsset | [المصدر](../../../raw/application.js#L159372) |
| `abp.services.app.asset.getAssetForEdit` | POST | api/services/app/asset/GetAssetForEdit | [المصدر](../../../raw/application.js#L159416) |
| `abp.services.app.user.getRoleByUserId` | POST | api/services/app/user/GetRoleByUserId | [المصدر](../../../raw/application.js#L84942) |
| `abp.services.app.user.getRole` | POST | api/services/app/user/GetRole | [المصدر](../../../raw/application.js#L85007) |
| `abp.services.app.approval.approvalBySpecificUser` | POST | api/services/app/approval/ApprovalBySpecificUser | [المصدر](../../../raw/application.js#L159693) |
| `abp.services.app.profile.verifyTransactionPassword` | POST | api/services/app/profile/VerifyTransactionPassword | [المصدر](../../../raw/application.js#L159722) |
| `abp.services.app.approval.getApprovals` | POST | api/services/app/approval/GetApprovals | [المصدر](../../../raw/application.js#L85026) |
| `abp.services.app.account.getAccountForEdit` | POST | api/services/app/account/GetAccountForEdit | [المصدر](../../../raw/application.js#L159929) |
| `abp.services.app.directory.searchByContactGroup` | POST | api/services/app/directory/SearchByContactGroup | [المصدر](../../../raw/application.js#L160147) |
| `abp.services.app.contactGroup.getContactGroupsOnContactTypeAndIsDefault` | POST | api/services/app/contactGroup/GetContactGroupsOnContactTypeAndIsDefault | [المصدر](../../../raw/application.js#L160164) |
| `abp.services.app.linkedAccount.getLinkedAccountByContactGroupId` | POST | api/services/app/linkedAccount/GetLinkedAccountByContactGroupId | [المصدر](../../../raw/application.js#L160178) |
| `abp.services.app.asset.getAccumulatedDepreciationForAsset` | POST | api/services/app/asset/GetAccumulatedDepreciationForAsset | [المصدر](../../../raw/application.js#L160189) |
| `abp.services.app.depreciation.getPendingDepreciation` | POST | api/services/app/depreciation/GetPendingDepreciation | [المصدر](../../../raw/application.js#L160223) |
| `abp.services.app.account.searchAccountsForSubLookUp` | POST | api/services/app/account/SearchAccountsForSubLookUp | [المصدر](../../../raw/application.js#L160400) |
| `abp.services.app.asset.disposeAssetWithDiscount` | POST | api/services/app/asset/DisposeAssetWithDiscount | [المصدر](../../../raw/application.js#L160444) |
| `abp.services.app.asset.disposeAsset` | POST | api/services/app/asset/DisposeAsset | [المصدر](../../../raw/application.js#L160464) |
| `abp.services.app.vehicle.searchVehicles` | POST | api/services/app/vehicle/SearchVehicles | [المصدر](../../../raw/application.js#L160488) |
| `abp.services.app.asset.getAssetForDisposal` | POST | api/services/app/asset/GetAssetForDisposal | [المصدر](../../../raw/application.js#L160658) |
| `abp.services.app.linkedAccount.getLinkedAccountId_for_GeneralType` | POST | api/services/app/linkedAccount/GetLinkedAccountId_for_GeneralType | [المصدر](../../../raw/application.js#L160673) |
| `abp.services.app.depreciationDetail.getDepreciationDetailByAssetId` | POST | api/services/app/depreciationDetail/GetDepreciationDetailByAssetId | [المصدر](../../../raw/application.js#L159516) |
| `abp.services.app.directory.searchDirectoryPaged` | POST | api/services/app/directory/SearchDirectoryPaged | [المصدر](../../../raw/application.js#L184853) |
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
| `abp.services.app.person.uploadDocumentImage` | POST | api/services/app/person/UploadDocumentImage | [المصدر](../../../raw/application.js#L185476) |

## الصلاحيات والحقول

- صلاحية `Pages.Tenant.Assets.Assets.Addnew`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Assets.Assets.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Assets.Assets.Delete`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Assets.Assets`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Assets.Assets.Dispose`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Assets.DisposalApproval`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Assets.DisposalRejection`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Vouchers.JVs.AllActionsOnOtherBranchJVs`: ممنوحة في السياق الملتقط.
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

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.filters.assetNo` | text |  |  |
| `vm.filters.title` | text |  |  |
| `vm.filters.plateNo` | text |  |  |
| `vm.filters.parentAsset` | ui-select |  |  |
| `vm.dateRangeModel` | text |  | min=vm.dateRangeOptions.min; max=vm.dateRangeOptions.max; ng-disabled=!vm.filters.enableDateRange |
| `vm.filters.enableDateRange` | checkbox | disableDateRange |  |
| `vm.filters.dateTimeType` | radio | purchaseDate |  |
| `vm.filters.dateTimeType` | radio | disposalDate |  |
| `vm.filters.dateTimeType` | radio | activeInThisPeriod |  |
| `vm.filters.isDisposed` | select |  | ng-options=status.id as status.name for status in vm.statuses |
| `vm.filters.assetType` | select |  | ng-options=assetType as assetType.name for assetType in vm.assetTypes |
| `vm.filters.chassisNo` | text | chassisNo |  |
| `vm.filters.isDisposalApprovalPending` | checkbox | isDisposalApprovalPending |  |
| `vm.filters.tariffGroupId` | select | vehicleType | ng-options=group.id as group.title for group in vm.tariffGroups |
| `vm.filters.locationId` | select | locationId | ng-options=location.id as location.name for location in vm.locations |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
