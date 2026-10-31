# شاشة: Settings

المسار في القائمة: Administration ← Settings.

الرجوع إلى [فهرس القسم](../README.md).

معرّف المسار البرمجي: `tenant.settings`. حالة البند في التعريف المرسل: ظاهر=true، مفعّل=true. هذه ليست معاينة مرئية للشاشة.

## الأدلة والربط

- تعريف المسار: [R0103](../../../readable/routes/R0103--tenant-settings.js)، والأصل [raw/application.js:2169](../../../raw/application.js#L2169).
- قالب الشاشة: `~/App/tenant/views/common/settings/index.cshtml`.
- تقييم شروط التعريف من الإعدادات الملتقطة: `passes-static-guards`؛ قد تبقى تعبيرات ديناميكية أو فروع غير محسومة.
- طريقة ربط وحدات التحكم: `template-ng-controller-or-literal-route-controller`؛ نتيجة طلب القالب: 200.
- الوحدات المسماة داخل القالب: `tenant.views.settings.index as vm`.

## الملفات المرتبطة بالشاشة والنوافذ

| الوحدة | إجراءات الواجهة المسندة | استدعاءات الخدمات |
|---|---:|---:|
| [tenant.views.settings.index](../../../readable/controllers/C0431--tenant.views.settings.index.js) | 141 | 90 |
| [tenant.views.locations.createOrEditSalikAccountModal](../../../readable/controllers/C0429--tenant.views.locations.createOrEditSalikAccountModal.js) | 2 | 3 |
| [tenant.views.locations.createOrEditFuelAccountModal](../../../readable/controllers/C0426--tenant.views.locations.createOrEditFuelAccountModal.js) | 2 | 2 |
| [tenant.views.locations.createOrEditParkingAccountModal](../../../readable/controllers/C0428--tenant.views.locations.createOrEditParkingAccountModal.js) | 2 | 3 |
| [tenant.views.common.settings.createOrEditTrafficFileModal](../../../readable/controllers/C0430--tenant.views.common.settings.createOrEditTrafficFileModal.js) | 3 | 2 |
| [tenant.views.common.settings.createOrEditHolidayModal](../../../readable/controllers/C0427--tenant.views.common.settings.createOrEditHolidayModal.js) | 2 | 2 |

## الخطوات التي يمكن مراجعتها من المصدر

ابدأ بالوحدة المباشرة، ثم تتبع فتح النوافذ والحفظ وتغيير الحالة والطباعة أو التصدير إلى الخدمات أدناه. أسماء الإجراءات لا تثبت ترتيبًا إلزاميًا أو نتيجة مالية.

- وحدة `tenant.views.settings.index`: `searchCustomersForCompanyLinkingSetting`، `createUserUaePassNewRow`، `removeUserUaePassRow`، `getVoucherSubTypes`، `searchCountries`، `sendTestEmail`، `sendTestEmailMulitpleSmtp`، `getTariffCards`، `searchSupplier`، `searchTenantLinkedCustomer`، `selectDefaultDriverForEquipmentAgreement`، `searchTenantLinkedSupplier`، `searchCustomers`، `searchUsers`، `searchRoles`، `searchUsersTAMM`، `getFineAuthoritySupplier`، `getTenantLinkedCustomer`، `getDefaultDriver`، `getTenantLinkedSupplier`، `getContactGroups`، `posDefaultCustomerselect`، `getSettings`، `getNotificationAdvanceSetting`، `getSalikAccounts`، `getAllDarbAccounts`، `getAllParkingAccounts`، `getAllFuelAccounts`، `getTrafficFiles`، `getHolidays`، `ratechangeType`، `setActiveTabIndex`، `getExpenses`، `getExpenseType`، `saveAll`، `saveCommonSettings`، `saveNotificationSettings`، `savePaymentGatewaysSettings`، `saveDocumentNosSettings`، `saveLimousineSettings`، `saveEquipmentSettings`، `saveCostCenterSettings`، `saveRequiredFieldSettings`، `saveUserSettings`، `saveSalikSettings`، `saveFuelSettings`، `saveDarbSettings`، `saveFineSettings`، `saveEmailSettings`، `getlocalDateTime`، `getServerName`، `getType`، `DOBradioButtonValueChanged`، `createSalikAccount`، `searchAccounts`، `editSalikAccount`، `deleteSalikAccount`، `viewSalikAccount`، `createFuelAccount`، `searchAccounts`، `editFuelAccount`، `viewFuelAccount`، `createParkingAccount`، `editParkingAccount`، `deleteParkingAccount`، `viewParkingAccount`، `createTrafficFiles`، `editTrafficFile`، `deleteTrafficFile`، `viewTrafficFile`، `searchRateTypes`، `moduleChanged`، `addChargesSettingRowUpdated`، `addRowMultipleEmailSenders`، `removeChargesSettingRowUpdated`، `removeRowSmtp`، `setTaxRule`، `sortOfSettingsChanged`، `sortOfSettingsGrid`، `addAgreementDcoumentsRowUpdated`، `removeAgreementDocumentsRowUpdated`، `addAdvanceSettingDcoumentsRowUpdated`، `removeAdvanceSettingDcoumentsRowUpdated`، `addAdvanceSettingNationalIdFormatesRowUpdate`، `removeAdvanceSettingNationalIdFormatesRowUpdate`، `updateCountryId`، `advanceSettingDcoumentsRowChanged`، `isinvalidFormsAndFieldsTableFunc`، `sortOfFormsAndFieldsDocuments`، `sortOfAgreementDocuments`، `addDocumentApprovalRow`، `removeDocumentApprovalsRow`، `sortOfDocumentApprovals`، `clearUser`، `clearUserRole`، `voucherTypeChanged`، `formNfieldsAdditionalFieldChanged`، `statementOfAccountConsolidatedLinkingValidation`، `saveCompanyLinkingSettings`، `getCompanyLinkingSettings`، `removeStatementOfAccountConsolidatedLinkingRow`، `addStatementOfAccountConsolidatedLinkingRow`، `documentTypeChanged`، `localize`، `saveAdvanceSettingDocumentsSettings`، `addChargesSettingRowRental`، `addChargesSettingRowLease`، `removeChargesSettingRowRental`، `removeChargesSettingRowLease`، `cancelChargesSettings`، `saveChargesSettingsUpdate`، `saveAgreementDocumentsSettings`، `validation`، `saveDocumentApprovalsSettings`، `createHoliday`، `editHoliday`، `deleteHoliday`، `viewHoliday`، `emailTripChanged`، `emailBookingChanged`، `getNationalIdFormates`، `highLightBlackListCountry`، `validateNationalIdFormate`، `validateFormateInput`، `isInvalidNationalIdFormatFields`، `updateHighLightBlackListCountries`، `updateNatonalIdFormate`، `uploader.onSuccessItem`، `uploader.onErrorItem`، `generateApiKey`، `uploaderLogo.onSuccessItem`، `uploaderLogo.onErrorItem`، `expenseAccountCheckedOrUnchecked`، `saveExpenseAccountIds`، `saveGridOptions`، `savePaymentGatewaySettings`، `saveGoogleMapApiSettings`، `saveMultipleEmailSenders`، `saveDirectDebitAuthorizationImportSettings`، `addDDAImportField`، `removeDDAImportField`.
- وحدة `tenant.views.locations.createOrEditSalikAccountModal`: `cancel`، `save`.
- وحدة `tenant.views.locations.createOrEditFuelAccountModal`: `cancel`، `save`.
- وحدة `tenant.views.locations.createOrEditParkingAccountModal`: `cancel`، `save`.
- وحدة `tenant.views.common.settings.createOrEditTrafficFileModal`: `cancel`، `save`، `userNameOrPasswordHideOrShow`.
- وحدة `tenant.views.common.settings.createOrEditHolidayModal`: `cancel`، `save`.

## الخدمات والطلبات المعلنة

| الخدمة والإجراء | الطريقة | المسار المعلن في الوكيل | دليل الاستدعاء |
|---|---|---|---|
| `abp.services.app.directory.search` | POST | api/services/app/directory/Search | [المصدر](../../../raw/application.js#L107092) |
| `abp.services.app.country.searchCountries` | POST | api/services/app/country/SearchCountries | [المصدر](../../../raw/application.js#L105691) |
| `abp.services.app.designation.getDesignations` | POST | api/services/app/designation/GetDesignations | [المصدر](../../../raw/application.js#L109439) |
| `abp.services.app.tenantSettings.sendTestEmail` | POST | api/services/app/tenantSettings/SendTestEmail | [المصدر](../../../raw/application.js#L106960) |
| `abp.services.app.tenantSettings.sendTestEmailMultipleSmtp` | POST | api/services/app/tenantSettings/SendTestEmailMultipleSmtp | [المصدر](../../../raw/application.js#L106968) |
| `abp.services.app.tariffCard.getTariffCards` | POST | api/services/app/tariffCard/GetTariffCards | [المصدر](../../../raw/application.js#L106977) |
| `abp.services.app.commonLookup.getLocations` | POST | api/services/app/commonLookup/GetLocations | [المصدر](../../../raw/application.js#L107015) |
| `abp.services.app.tenantSettings.getAdvanceSettingsForCRSTenantSuppliers` | POST | api/services/app/tenantSettings/GetAdvanceSettingsForCRSTenantSuppliers | [المصدر](../../../raw/application.js#L107032) |
| `abp.services.app.directory.searchLinkedCustomer` | POST | api/services/app/directory/SearchLinkedCustomer | [المصدر](../../../raw/application.js#L107073) |
| `abp.services.app.directory.searchLinkedSupplier` | POST | api/services/app/directory/SearchLinkedSupplier | [المصدر](../../../raw/application.js#L107086) |
| `abp.services.app.user.searchUsersOptimized` | POST | api/services/app/user/SearchUsersOptimized | [المصدر](../../../raw/application.js#L107113) |
| `abp.services.app.user.searchRolesOptimized` | POST | api/services/app/user/SearchRolesOptimized | [المصدر](../../../raw/application.js#L107106) |
| `abp.services.app.directory.getContactInfo` | POST | api/services/app/directory/GetContactInfo | [المصدر](../../../raw/application.js#L107175) |
| `abp.services.app.directory.getLinkedCustomerInfo` | POST | api/services/app/directory/GetLinkedCustomerInfo | [المصدر](../../../raw/application.js#L107136) |
| `abp.services.app.directory.getLinkedSupplierInfo` | POST | api/services/app/directory/GetLinkedSupplierInfo | [المصدر](../../../raw/application.js#L107158) |
| `abp.services.app.contactGroup.getContactGroupsOnContactType` | POST | api/services/app/contactGroup/GetContactGroupsOnContactType | [المصدر](../../../raw/application.js#L107166) |
| `abp.services.app.tenantSettings.getAllSettings` | POST | api/services/app/tenantSettings/GetAllSettings | [المصدر](../../../raw/application.js#L107182) |
| `abp.services.app.tenantSettings.getNotificationAdvanceSetting` | POST | api/services/app/tenantSettings/GetNotificationAdvanceSetting | [المصدر](../../../raw/application.js#L107409) |
| `abp.services.app.costCenter.searchCostCenters` | POST | api/services/app/costCenter/SearchCostCenters | [المصدر](../../../raw/application.js#L107430) |
| `abp.services.app.salikAccount.getSalikAccounts` | POST | api/services/app/salikAccount/GetSalikAccounts | [المصدر](../../../raw/application.js#L107456) |
| `abp.services.app.parkingAccount.getParkingAccounts` | POST | api/services/app/parkingAccount/GetParkingAccounts | [المصدر](../../../raw/application.js#L107471) |
| `abp.services.app.fuelAccount.getAllForView` | POST | api/services/app/fuelAccount/GetAllForView | [المصدر](../../../raw/application.js#L107486) |
| `abp.services.app.holiday.getHolidays` | POST | api/services/app/holiday/GetHolidays | [المصدر](../../../raw/application.js#L107500) |
| `abp.services.app.trafficFile.getTrafficFiles` | POST | api/services/app/trafficFile/GetTrafficFiles | [المصدر](../../../raw/application.js#L107515) |
| `abp.services.app.billingMethod.getBillingMethodsWithCategory` | POST | api/services/app/billingMethod/GetBillingMethodsWithCategory | [المصدر](../../../raw/application.js#L107530) |
| `abp.services.app.expenseType.getExpenseTypes` | POST | api/services/app/expenseType/GetExpenseTypes | [المصدر](../../../raw/application.js#L107610) |
| `abp.services.app.expenseType.getExpenseTypeForEdit` | POST | api/services/app/expenseType/GetExpenseTypeForEdit | [المصدر](../../../raw/application.js#L107617) |
| `abp.services.app.tenantSettings.updateAllSettings` | غير مربوط | غير محسوم | [المصدر](../../../raw/application.js#L107629) |
| `abp.services.app.tenantSettings.updateAdvanceSettingsForCRSTenantSuppliers` | POST | api/services/app/tenantSettings/UpdateAdvanceSettingsForCRSTenantSuppliers | [المصدر](../../../raw/application.js#L107771) |
| `abp.services.app.tenantSettings.updateCommonSettings` | POST | api/services/app/tenantSettings/UpdateCommonSettings | [المصدر](../../../raw/application.js#L107790) |
| `abp.services.app.tenantSettings.updateNotificationSettings` | POST | api/services/app/tenantSettings/UpdateNotificationSettings | [المصدر](../../../raw/application.js#L107810) |
| `abp.services.app.tenantSettings.updatePaymentGatewaysSettings` | POST | api/services/app/tenantSettings/UpdatePaymentGatewaysSettings | [المصدر](../../../raw/application.js#L107826) |
| `abp.services.app.tenantSettings.updateDocumentNosSettings` | POST | api/services/app/tenantSettings/UpdateDocumentNosSettings | [المصدر](../../../raw/application.js#L107842) |
| `abp.services.app.tenantSettings.updateLimousineSettings` | POST | api/services/app/tenantSettings/UpdateLimousineSettings | [المصدر](../../../raw/application.js#L107866) |
| `abp.services.app.tenantSettings.updateEquipmentSettings` | POST | api/services/app/tenantSettings/UpdateEquipmentSettings | [المصدر](../../../raw/application.js#L107881) |
| `abp.services.app.tenantSettings.updateCostCenterSettings` | POST | api/services/app/tenantSettings/UpdateCostCenterSettings | [المصدر](../../../raw/application.js#L107911) |
| `abp.services.app.tenantSettings.updateRequiredFieldsSettings` | POST | api/services/app/tenantSettings/UpdateRequiredFieldsSettings | [المصدر](../../../raw/application.js#L107926) |
| `abp.services.app.tenantSettings.updateUserSettings` | POST | api/services/app/tenantSettings/UpdateUserSettings | [المصدر](../../../raw/application.js#L107940) |
| `abp.services.app.tenantSettings.updateSalikSettings` | POST | api/services/app/tenantSettings/UpdateSalikSettings | [المصدر](../../../raw/application.js#L107956) |
| `abp.services.app.tenantSettings.updateFuelSettings` | POST | api/services/app/tenantSettings/UpdateFuelSettings | [المصدر](../../../raw/application.js#L107971) |
| `abp.services.app.tenantSettings.updateDarbSettings` | POST | api/services/app/tenantSettings/UpdateDarbSettings | [المصدر](../../../raw/application.js#L107987) |
| `abp.services.app.tenantSettings.updateFineSettings` | POST | api/services/app/tenantSettings/UpdateFineSettings | [المصدر](../../../raw/application.js#L108020) |
| `abp.services.app.tenantSettings.updateEmailSettings` | POST | api/services/app/tenantSettings/UpdateEmailSettings | [المصدر](../../../raw/application.js#L108038) |
| `abp.services.app.account.searchAccountsForSubLookUp` | POST | api/services/app/account/SearchAccountsForSubLookUp | [المصدر](../../../raw/application.js#L108726) |
| `abp.services.app.salikAccount.deleteSalikAccount` | POST | api/services/app/salikAccount/DeleteSalikAccount | [المصدر](../../../raw/application.js#L108691) |
| `abp.services.app.parkingAccount.deleteParkingAccount` | POST | api/services/app/parkingAccount/DeleteParkingAccount | [المصدر](../../../raw/application.js#L108764) |
| `abp.services.app.trafficFile.deleteTrafficFile` | POST | api/services/app/trafficFile/DeleteTrafficFile | [المصدر](../../../raw/application.js#L108809) |
| `abp.services.app.chargesSetting.getChargesSettings` | POST | api/services/app/chargesSetting/GetChargesSettings | [المصدر](../../../raw/application.js#L108833) |
| `abp.services.app.chargesSetting.getChargesTypes` | POST | api/services/app/chargesSetting/GetChargesTypes | [المصدر](../../../raw/application.js#L108868) |
| `abp.services.app.chargesSetting.getRateTypes` | POST | api/services/app/chargesSetting/GetRateTypes | [المصدر](../../../raw/application.js#L108883) |
| `abp.services.app.approval.getApprovalSetting` | POST | api/services/app/approval/GetApprovalSetting | [المصدر](../../../raw/application.js#L109413) |
| `abp.services.app.tenantSettings.getVoucherApprovalSetting` | POST | api/services/app/tenantSettings/GetVoucherApprovalSetting | [المصدر](../../../raw/application.js#L109423) |
| `abp.services.app.tenantSettings.updateOrCreateSOAConsolidatedLinkingSettings` | POST | api/services/app/tenantSettings/UpdateOrCreateSOAConsolidatedLinkingSettings | [المصدر](../../../raw/application.js#L109484) |
| `abp.services.app.directory.getSOAConsolidatedLinkingSettings` | POST | api/services/app/directory/GetSOAConsolidatedLinkingSettings | [المصدر](../../../raw/application.js#L109494) |
| `abp.services.app.tenantSettings.getDocumentSetting` | POST | [object Object] | [المصدر](../../../raw/application.js#L109570) |
| `abp.services.app.tenantSettings.updateAdvanceSettings` | POST | api/services/app/tenantSettings/UpdateAdvanceSettings | [المصدر](../../../raw/application.js#L109667) |
| `abp.services.app.chargesSetting.updateChargesSettings` | POST | api/services/app/chargesSetting/UpdateChargesSettings | [المصدر](../../../raw/application.js#L109743) |
| `abp.services.app.tenantSettings.updateAgreementDocumentsSettings` | POST | api/services/app/tenantSettings/UpdateAgreementDocumentsSettings | [المصدر](../../../raw/application.js#L109776) |
| `abp.services.app.tenantSettings.updateApprovalsSettings` | POST | api/services/app/tenantSettings/UpdateApprovalsSettings | [المصدر](../../../raw/application.js#L109818) |
| `abp.services.app.tenantSettings.updateDocumentApprovalsSettings` | POST | api/services/app/tenantSettings/UpdateDocumentApprovalsSettings | [المصدر](../../../raw/application.js#L109837) |
| `abp.services.app.holiday.deleteHoliday` | POST | api/services/app/holiday/DeleteHoliday | [المصدر](../../../raw/application.js#L109878) |
| `abp.services.app.tenantSettings.getNationalIdFormates` | POST | [object Object] | [المصدر](../../../raw/application.js#L110010) |
| `abp.services.app.tenantSettings.getHighLightBlackListCountry` | POST | [object Object] | [المصدر](../../../raw/application.js#L110022) |
| `abp.services.app.country.getCountries` | POST | api/services/app/country/GetCountries | [المصدر](../../../raw/application.js#L110033) |
| `abp.services.app.tenantSettings.updateHighLightBlackListCountry` | POST | api/services/app/tenantSettings/UpdateHighLightBlackListCountry | [المصدر](../../../raw/application.js#L110100) |
| `abp.services.app.tenantSettings.updateNationalIdFormate` | POST | api/services/app/tenantSettings/UpdateNationalIdFormate | [المصدر](../../../raw/application.js#L110125) |
| `abp.services.app.tenantSettings.generateApiKey` | POST | api/services/app/tenantSettings/GenerateApiKey | [المصدر](../../../raw/application.js#L110254) |
| `abp.services.app.account.getAccountsOnCategory` | POST | api/services/app/account/GetAccountsOnCategory | [المصدر](../../../raw/application.js#L110317) |
| `abp.services.app.tenantSettings.updateVehicleExpensesAccountsAdvanceSettings` | POST | api/services/app/tenantSettings/UpdateVehicleExpensesAccountsAdvanceSettings | [المصدر](../../../raw/application.js#L110341) |
| `abp.services.app.tenantSettings.updateGridOptions` | POST | api/services/app/tenantSettings/UpdateGridOptions | [المصدر](../../../raw/application.js#L110359) |
| `abp.services.app.tenantSettings.getGridOptionsAdvanceSetting` | POST | api/services/app/tenantSettings/GetGridOptionsAdvanceSetting | [المصدر](../../../raw/application.js#L110365) |
| `abp.services.app.tenantSettings.updatePaymentGatewaySettings` | POST | api/services/app/tenantSettings/UpdatePaymentGatewaySettings | [المصدر](../../../raw/application.js#L110414) |
| `abp.services.app.tenantSettings.updateGoogleMapApiSettings` | POST | api/services/app/tenantSettings/UpdateGoogleMapApiSettings | [المصدر](../../../raw/application.js#L110432) |
| `abp.services.app.tenantSettings.updateMultipleSendersEmailSettings` | POST | api/services/app/tenantSettings/UpdateMultipleSendersEmailSettings | [المصدر](../../../raw/application.js#L110455) |
| `abp.services.app.tenantSettings.updateDirectDebitAuthorizationImportSetting` | POST | api/services/app/tenantSettings/UpdateDirectDebitAuthorizationImportSetting | [المصدر](../../../raw/application.js#L110470) |
| `abp.services.app.tenantSettings.getExpenseAccountsAdvanceSetting` | POST | api/services/app/tenantSettings/GetExpenseAccountsAdvanceSetting | [المصدر](../../../raw/application.js#L110490) |
| `abp.services.app.tenantSettings.getPaymentGatewayAdvanceSetting` | POST | api/services/app/tenantSettings/GetPaymentGatewayAdvanceSetting | [المصدر](../../../raw/application.js#L110500) |
| `abp.services.app.tenantSettings.getGoogleMapApiAdvanceSetting` | POST | api/services/app/tenantSettings/GetGoogleMapApiAdvanceSetting | [المصدر](../../../raw/application.js#L110506) |
| `abp.services.app.tenantSettings.getMultipleEmailSendersAdvanceSetting` | POST | api/services/app/tenantSettings/GetMultipleEmailSendersAdvanceSetting | [المصدر](../../../raw/application.js#L110513) |
| `abp.services.app.tenantSettings.getDirectDebitAuthorizationImportSetting` | POST | api/services/app/tenantSettings/GetDirectDebitAuthorizationImportSetting | [المصدر](../../../raw/application.js#L110525) |
| `abp.services.app.salikAccount.createOrUpdateSalikAccount` | POST | api/services/app/salikAccount/CreateOrUpdateSalikAccount | [المصدر](../../../raw/application.js#L105248) |
| `abp.services.app.salikAccount.getSalikAccountForView` | POST | api/services/app/salikAccount/GetSalikAccountForView | [المصدر](../../../raw/application.js#L105260) |
| `abp.services.app.salikAccount.getSalikAccountForEdit` | POST | api/services/app/salikAccount/GetSalikAccountForEdit | [المصدر](../../../raw/application.js#L105281) |
| `abp.services.app.fuelAccount.createOrUpdate` | POST | api/services/app/fuelAccount/CreateOrUpdate | [المصدر](../../../raw/application.js#L105063) |
| `abp.services.app.fuelAccount.getFuelAccountForEdit` | POST | api/services/app/fuelAccount/GetFuelAccountForEdit | [المصدر](../../../raw/application.js#L105075) |
| `abp.services.app.parkingAccount.createOrUpdateParkingAccount` | POST | api/services/app/parkingAccount/CreateOrUpdateParkingAccount | [المصدر](../../../raw/application.js#L105155) |
| `abp.services.app.parkingAccount.getParkingAccountForView` | POST | api/services/app/parkingAccount/GetParkingAccountForView | [المصدر](../../../raw/application.js#L105167) |
| `abp.services.app.parkingAccount.getParkingAccountForEdit` | POST | api/services/app/parkingAccount/GetParkingAccountForEdit | [المصدر](../../../raw/application.js#L105187) |
| `abp.services.app.trafficFile.createOrUpdateTrafficFile` | POST | api/services/app/trafficFile/CreateOrUpdateTrafficFile | [المصدر](../../../raw/application.js#L105344) |
| `abp.services.app.trafficFile.getTrafficFileForEdit` | POST | api/services/app/trafficFile/GetTrafficFileForEdit | [المصدر](../../../raw/application.js#L105364) |
| `abp.services.app.holiday.createOrUpdateHoliday` | POST | api/services/app/holiday/CreateOrUpdateHoliday | [المصدر](../../../raw/application.js#L105104) |
| `abp.services.app.holiday.getHolidayForEdit` | POST | api/services/app/holiday/GetHolidayForEdit | [المصدر](../../../raw/application.js#L105117) |

## الصلاحيات والحقول

- صلاحية `Pages.Integration.EInvoicingUAE`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.TMS.Tolls.SharingSetting`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.TMS.Tolls.EDarb.SharingSetting`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.TFMS.Fines.SharingSetting`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.FuelDataMangement.SharingSetting`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.ExpenseTypes`: غير ممنوحة في السياق الملتقط.
- صلاحية `Page.ExternaLogin.Bookings`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.FuelDataMangement.FuelAccount.Addnew`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.FuelDataMangement.FuelAccount.Edit`: غير ممنوحة في السياق الملتقط.
- صلاحية `Page.ExternaLogin.VehicleServiceBooking`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Administration.Users.AllowChangeMFASetting`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Locations.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.Locations.Delete`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.SalikAccounts.Edit`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.SalikAccounts.Delete`: ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.ParkingAccounts.AddNew`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.ParkingAccounts.Delete`: غير ممنوحة في السياق الملتقط.
- صلاحية `Pages.Tenant.ParkingAccounts.Edit`: غير ممنوحة في السياق الملتقط.

الحقول التالية مأخوذة من روابط النموذج في القالب، وليست مخطط بيانات الخادم:

| الربط | النوع | الاسم | شروط ظاهرة |
|---|---|---|---|
| `vm.settings.general.webSiteRootAddress` | text | WebSiteRootAddress | maxlength=128 |
| `vm.settings.speedCommon.timeZone` | text | TimeZone | ng-options=zone.Id as zone.DisplayName for zone in vm.settings.speedCommon.allTimeZones |
| `vm.settings.speedCommon.dateFormat` | text | dateFormat |  |
| `vm.settings.speedCommon.tenantLoginTimeOut` | text | tenantLoginTimeOut |  |
| `vm.settings.speedCommon.currencyCode` | text | currencyCode |  |
| `vm.settings.speedCommon.currencyName` | text | currencyName |  |
| `vm.settings.speedCommon.decimalCurrencyName` | text | decimalCurrencyName |  |
| `vm.settings.speedCommon.autoCalculateAmountInWords` | checkbox | AutoCalculateAmountInWords |  |
| `vm.settings.speedCommon.currencyDecimals` | text | decimalCurrencyName |  |
| `vm.settings.speedCommon.taxPercentage` | number | taxPercentage |  |
| `vm.settings.speedCommon.taxInclusive` | checkbox | TaxInclusive |  |
| `vm.settings.speedCommon.postTaxInclusive` | checkbox | PostTaxInclusive |  |
| `vm.settings.speedCommon.isTaxOptional` | checkbox | TaxOptional |  |
| `vm.filters.chargesTypesToCalculateTaxExclusively` | ui-select |  |  |
| `vm.filters.automaticallySplitFollowingCharges` | ui-select |  |  |
| `vm.settings.speedCommon.enableTDS` | checkbox | EnableTDS |  |
| `vm.settings.speedCommon.weeklyMonthlyRental` | checkbox | WeeklyMonthlyRental |  |
| `vm.settings.speedCommon.rentalGracePeriodInMinutes` | text | RentalGracePeriodInMinutes |  |
| `vm.settings.speedCommon.rentalGracePeriodInMinutesForCompany` | text | RentalGracePeriodInMinutes |  |
| `vm.settings.speedCommon.gracePeriodInHoursForIndividual` | text |  | ng-options=gpHour as gpHour for gpHour in vm.gracePeriodHours |
| `vm.settings.speedCommon.gracePeriodInHoursForCompany` | text |  | ng-options=gpHour as gpHour for gpHour in vm.gracePeriodHours |
| `vm.settings.speedCommon.hourlyRental` | checkbox | HourlyRental |  |
| `vm.settings.speedCommon.dailyInvoiceForDailyAgreement` | checkbox | DailyInvoiceForDailyAgreement |  |
| `vm.settings.speedCommon.taxOnSalikOrFineForTaxExemptedCustomers` | checkbox | TaxOnSalikOrFineForTaxExemptedCustomers |  |
| `vm.settings.speedCommon.invoiceMergingOnToDate` | checkbox | InvoiceMergingOnToDate |  |
| `vm.settings.speedCommon.invoiceMergingOnFromDate` | checkbox | InvoiceMergingOnFromDate |  |
| `vm.settings.speedCommon.invoiceMergingOnSameMonth` | checkbox | AllowInvoiceMergingOnSameMonth |  |
| `vm.settings.speedCommon.monthlyRentDailyRateFromDays` | text | MonthlyRentDailyRateFromDays |  |
| `vm.settings.speedCommon.monthlyRentDailyRateToDays` | text | MonthlyRentDailyRateToDays |  |
| `vm.settings.speedCommon.monthlyRentWeeklyRateFromDays` | text | MonthlyRentWeeklyRateFromDays |  |
| `vm.settings.speedCommon.monthlyRentWeeklyRateToDays` | text | MonthlyRentWeeklyRateToDays |  |
| `vm.settings.speedCommon.minDrivingExperience` | text | minDrivingExperience |  |
| `vm.settings.speedCommon.minDrivingAge` | text | minDrivingAge |  |
| `vm.settings.speedCommon.halfDaySlab1From` | text |  | ng-options=day.id as day.Name for day in vm.timeofDay |
| `vm.settings.speedCommon.halfDaySlab1To` | text |  | ng-options=day.id as day.Name for day in vm.timeofDay |
| `vm.settings.speedCommon.halfDaySlab2From` | text |  | ng-options=day.id as day.Name for day in vm.timeofDay |
| `vm.settings.speedCommon.halfDaySlab2To` | text |  | ng-options=day.id as day.Name for day in vm.timeofDay |
| `vm.settings.speedCommon.weekEndDay1` | text |  | ng-options=day.id as day.Name for day in vm.daysOfWeek |
| `vm.settings.speedCommon.weekEndDay2` | text |  | ng-options=day.id as day.Name for day in vm.daysOfWeek |
| `vm.settings.speedCommon.mixWeekendWithNormalRental` | checkbox | mixWeekendWithNormalRental |  |
| `vm.settings.speedCommon.weekEndKMsLimit` | text | weekEndKMsLimit |  |
| `vm.settings.speedCommon.invoicingRuleIndividual` | text |  | ng-options=invoicingRule.id as invoicingRule.name for invoicingRule in vm.invoicingRules |
| `vm.settings.speedCommon.invoicingTypeIndividual` | text |  | ng-options=invoicingType.id as invoicingType.name for invoicingType in vm.invoicingTypes |
| `vm.settings.speedCommon.invoicingRuleCorporate` | text |  | ng-options=invoicingRule.id as invoicingRule.name for invoicingRule in vm.invoicingRules |
| `vm.settings.speedCommon.invoicingTypeCorporate` | text |  | ng-options=invoicingType.id as invoicingType.name for invoicingType in vm.invoicingTypes |
| `vm.settings.speedCommon.excessKMsInvoicingRuleRental` | text |  | ng-options=invoicingRule.id as invoicingRule.name for invoicingRule in vm.excessKMsInvoicingRules |
| `vm.settings.speedCommon.leaseInvoicingRuleIndividual` | text |  | ng-options=invoicingRule.id as invoicingRule.name for invoicingRule in vm.invoicingRules |
| `vm.settings.speedCommon.leaseInvoicingTypeIndividual` | text |  | ng-options=invoicingType.id as invoicingType.name for invoicingType in vm.invoicingTypes |
| `vm.settings.speedCommon.leaseInvoicingRuleCorporate` | text |  | ng-options=invoicingRule.id as invoicingRule.name for invoicingRule in vm.invoicingRules |
| `vm.settings.speedCommon.leaseInvoicingTypeCorporate` | text |  | ng-options=invoicingType.id as invoicingType.name for invoicingType in vm.invoicingTypes |
| `vm.settings.speedCommon.excessKMsInvoicingRuleLease` | text |  | ng-options=invoicingRule.id as invoicingRule.name for invoicingRule in vm.excessKMsInvoicingRules |
| `vm.settings.speedCommon.accessoriesInvoicingRuleIndividual` | text |  | ng-options=invoicingRule.id as invoicingRule.name for invoicingRule in vm.invoicingRules |
| `vm.settings.speedCommon.accessoriesInvoicingTypeIndividual` | text |  | ng-options=invoicingType.id as invoicingType.name for invoicingType in vm.invoicingTypes |
| `vm.settings.speedCommon.accessoriesInvoicingRuleCorporate` | text |  | ng-options=invoicingRule.id as invoicingRule.name for invoicingRule in vm.invoicingRules |
| `vm.settings.speedCommon.accessoriesInvoicingTypeCorporate` | text |  | ng-options=invoicingType.id as invoicingType.name for invoicingType in vm.invoicingTypes |
| `vm.settings.speedCommon.accessoriesExcessKMsInvoicingRuleRental` | text |  | ng-options=invoicingRule.id as invoicingRule.name for invoicingRule in vm.excessKMsInvoicingRules |
| `vm.settings.speedCommon.weeklyInvoiceForWeeklyAgreement` | checkbox | WeeklyInvoiceForWeeklyAgreement |  |
| `vm.settings.speedCommon.weeklyInvoicingRule` | checkbox | weeklyInvoicingRule |  |
| `vm.settings.speedCommon.defaultInvoicingRuleforWeeklyInvoicesIndividual` | text |  | ng-options=invoicingType.id as invoicingType.name for invoicingType in vm.invoicingTypes |
| `vm.settings.speedCommon.weeklyInvoiceForWeeklyAgreementCompany` | checkbox | WeeklyInvoiceForWeeklyAgreementCompany |  |
| `vm.settings.speedCommon.weeklyInvoicingRuleCompany` | checkbox | weeklyInvoicingRuleCompany |  |
| `vm.settings.speedCommon.defaultInvoicingRuleforWeeklyInvoicesCompany` | text |  | ng-options=invoicingType.id as invoicingType.name for invoicingType in vm.invoicingTypes |
| `vm.settings.speedCommon.allowCustomerWiseSetting` | checkbox | AllowCustomerWiseSetting |  |
| `vm.settings.speedCommon.receiptOnScreenAllocationWithReceivables` | checkbox | ReceiptOnScreenAllocationWithReceivables |  |
| `vm.settings.speedCommon.receiptOnScreenAllocationWithTypesOfCharges` | checkbox | ReceiptPostAllocation |  |
| `vm.settings.speedCommon.invoicingStartDate` | input | date |  |
| `vm.settings.speedCommon.eInvoicingPostingStartDate` | input | date |  |
| `vm.settings.speedCommon.ddaReceiptsPaymentMethod` | text |  | ng-options=receiptMethod.id as receiptMethod.name for receiptMethod in vm.DdaReceiptPaymentMethods |
| `vm.settings.speedCommon.renalQuotationsValidityDays` | text | minDrivingExperience |  |
| `vm.settings.speedCommon.specialBranchwithnoFinancialeffects` | text |  | ng-options=location.id as location.name for location in vm.locations |
| `vm.settings.speedCommon.linkCRSVehicleWithWorkshopVehicleOnChassisNo` | checkbox | LinkCRSVehicleWithWorkshopVehicleOnChassisNo |  |
| `vm.settings.speedCommon.isTwoFactorAuthenticationGoogleMFA` | checkbox | TwoFactorLoginIsEnabled |  |
| `vm.settings.speedCommon.mergeEnglishArabicDescriptionAndLocationinDownloadingTamm` | checkbox | MergeEnglishArabicDescriptionAndLocationinDownloadingTamm |  |
| `vm.settings.speedCommon.enableManualAgreementNo` | checkbox | EnableManualAgreementNo |  |
| `vm.settings.speedCommon.vehicleTypeOptionalInBooking` | checkbox | VehicleTypeOptionalInBooking |  |
| `vm.settings.speedCommon.setVehicleOptionalInBookingConfirmation` | checkbox | SetVehicleOptionalInBookingConfirmation |  |
| `vm.settings.speedCommon.agreedDepositPayableUponAgreementCreationInBooking` | checkbox | AgreedDepositPayableUponAgreementCreationInBooking |  |
| `vm.settings.speedCommon.warningOnChangingBranch` | checkbox | WarningOnChangingBranch |  |
| `vm.settings.speedCommon.HideSpecificColoumnsInTripReport` | checkbox | HideSpecificColoumnsInTripReport |  |
| `vm.settings.speedCommon.enableTotalLossInAssets` | checkbox | EnableTotalLossInAssets |  |
| `vm.settings.speedCommon.makeReceiptOptionalInAdvanceTaxInvoice` | checkbox | MakeReceiptOptionalInAdvanceTaxInvoice |  |
| `vm.settings.speedCommon.autoCalculateTaxInAdvanceTaxInvoice` | checkbox | AutoCalculateTaxInAdvanceTaxInvoice |  |
| `vm.settings.speedCommon.showDescriptionForATIInLedger` | checkbox | ShowDescriptionForATIInLedger |  |
| `vm.settings.speedCommon.deleteATIReversal` | checkbox | DeleteATIReversal |  |
| `vm.settings.speedCommon.allowEnterExcessInsuranceDamageChargesManually` | checkbox | AllowEnterExcessInsuranceDamageChargesManually |  |
| `vm.settings.speedCommon.generateAdvanceTaxInvoiceFromAdvanceTaxReceipt` | checkbox | GenerateAdvanceTaxInvoiceFromAdvanceTaxReceipt |  |
| `vm.settings.speedCommon.addAdvanceInBookingasATR` | checkbox | AddAdvanceInBookingasATR |  |
| `vm.settings.speedCommon.claimChargesInTotalLoss` | checkbox | ClaimChargesInTotalLoss |  |
| `vm.settings.speedCommon.setFuelRateAutoOnAgreementCreation` | checkbox | SetFuelRateAutoOnAgreementCreation |  |
| `vm.settings.speedCommon.showVehicleReplacementFuelChargesInAgreement` | checkbox | ShowVehicleReplacementFuelChargesInAgreement |  |
| `vm.settings.speedCommon.salesPersonIsMandatoryInCustomerWhileOpeningAgreement` | checkbox | SalesPersonIsMandatoryInCustomerWhileOpeningAgreement |  |
| `vm.settings.speedCommon.salesPersonSelectionInsteadOfSearching` | checkbox | SalesPersonSelectionInsteadOfSearching |  |
| `vm.settings.speedCommon.allowItemDetailsOnBarcode` | checkbox | AllowItemDetailsOnBarcode |  |
| `vm.settings.speedCommon.donotShowUnapprovedPDC` | checkbox | DonotShowUnapprovedPDC |  |
| `vm.settings.speedCommon.agreementNoInCreditAndDebitNote` | checkbox | AgreementNoInCreditAndDebitNote |  |
| `vm.settings.speedCommon.taxInclusiveCalculationOnAssetDisposal` | checkbox | TaxInclusiveCalculationOnAssetDisposal |  |
| `vm.settings.speedCommon.excludeAssetDisposalFromReports` | checkbox | ExcludeAssetDisposalFromReports |  |
| `vm.settings.speedCommon.pendingDepreciationEditableOnAssetDisposal` | checkbox | PendingDepreciationEditableOnAssetDisposal |  |
| `vm.settings.speedCommon.allowAssetSaleInvoiceCreationDateAsAssetDisposalDate` | checkbox | AllowAssetSaleInvoiceCreationDateAsAssetDisposalDate |  |
| `vm.settings.speedCommon.createMultipleBillsOnPurchaseOrder` | checkbox | CreateMultipleBillsOnPurchaseOrder |  |
| `vm.settings.speedCommon.donotGenerateInvoiceOnAgreementClosing` | checkbox | DonotGenerateInvoiceOnAgreementClosing |  |
| `vm.settings.speedCommon.addRowInMergeInvoices` | checkbox | AddRowInMergeInvoices |  |
| `vm.settings.speedCommon.donotAddDashInVoucherNo` | checkbox | DonotAddDashInVoucherNo |  |
| `vm.settings.speedCommon.generateDaliyInvoiceForAnyPeriod` | checkbox | GenerateDaliyInvoiceForAnyPeriod |  |
| `vm.settings.speedCommon.agreementReceiptAllocateOnlyWithAgreementInvoices` | checkbox | AgreementReceiptAllocateOnlyWithAgreementInvoices |  |
| `vm.settings.speedCommon.donotAutoApproveFineBills` | checkbox | DonotAutoApproveFineBills |  |
| `vm.settings.speedCommon.showAllTypeOfPaymentsInCashDeposits` | checkbox | ShowAllTypeOfPaymentsInCashDeposits |  |
| `vm.settings.speedCommon.purchaseOrderPriceBasedOnLastSupplier` | checkbox | PurchaseOrderPriceBasedOnLastSupplier |  |
| `vm.settings.speedCommon.purchaseAndSalesHistoryInPurchaseOrder` | checkbox | PurchaseAndSalesHistoryInPurchaseOrder |  |
| `vm.settings.speedCommon.issueToJobInGrn` | checkbox | IssueToJobInGrn |  |
| `vm.settings.speedCommon.allowPartialRefund` | checkbox | allowPartialRefund |  |
| `vm.settings.speedCommon.autoCreditCardCommission` | checkbox | autoCreditCardCommission |  |
| `vm.settings.speedCommon.addPaymentInCreditCardBankTransfer` | checkbox | addPaymentInCreditCardBankTransfer |  |
| `vm.settings.speedCommon.cardTransactionBankTransferDateRangeBase` | checkbox | cardTransactionBankTransferDateRangeBase |  |
| `vm.settings.speedCommon.mergeInvoicesForAllBranches` | checkbox | mergeInvoicesForAllBranches |  |
| `vm.settings.speedCommon.enableManualBookingNo` | checkbox | EnableManualBookingNo |  |
| `vm.settings.speedCommon.enablePickAndDropLocationInAgreement` | checkbox | EnablePickAndDropLocationInAgreement |  |
| `vm.settings.speedCommon.enableTakeSignatureOnAgreementOpeninginMobileApp` | checkbox | EnableTakeSignatureOnAgreementOpeninginMobileApp |  |
| `vm.settings.speedCommon.enableTakeSignatureOnAgreementOpenedWebCreated` | checkbox | EnableTakeSignatureOnAgreementOpenedWebCreated |  |
| `vm.settings.speedCommon.poMandatoryForWorkshopMovement` | checkbox | PoMandatoryForWorkshopMovement |  |
| `vm.settings.speedCommon.notesMandatoryForWorkshopMovement` | checkbox | NotesMandatoryForWorkshopMovement |  |
| `vm.settings.speedCommon.enableFutureInvoicing` | checkbox | EnableFutureInvoicing |  |
| `vm.settings.speedCommon.locationDetailsInMovements` | checkbox | LocationDetailsInMovements |  |
| `vm.settings.speedCommon.invoiceFuelChargesOnReplacement` | checkbox | InvoiceFuelChargesOnReplacement |  |
| `vm.settings.speedCommon.allowPrintingOfVoidedVouchers` | checkbox | AllowPrintingOfVoidedVouchers |  |
| `vm.settings.speedCommon.printSaleOrderWithInvoice` | checkbox | PrintSaleOrderWithInvoice |  |
| `vm.settings.speedCommon.estimatedRevenueReportsGenerateBasedOnActualClosingCharges` | checkbox | EstimatedRevenueReportsGenerateBasedOnActualClosingCharges |  |
| `vm.settings.speedCommon.enableFutureAgreementCheckOuts` | checkbox | enableFutureAgreementCheckOuts |  |
| `vm.settings.speedCommon.enableAdditionalNotes` | checkbox | EnableAdditionalNotesField |  |
| `vm.settings.speedCommon.taxPercentageInBillAndJvImport` | checkbox | TaxPercentageInBillAndJvImport |  |
| `vm.settings.speedCommon.importVoucherLinesWithTax` | checkbox | ImportVoucherLinesWithTax |  |
| `vm.settings.speedCommon.setBillDateAsCurrentDate` | checkbox | SetBillDateAsCurrentDate |  |
| `vm.settings.speedCommon.manuallyDateChangeInFineBillGeneration` | checkbox | ManuallyDateChangeInFineBillGeneration |  |
| `vm.settings.speedCommon.allowTOSaveContactWithExpiryDoucment` | checkbox | AllowTOSaveContactWithExpiryDoucment |  |
| `vm.settings.speedCommon.vehicleRegistrationExpiryPopupOnAgreementSaving` | checkbox | VehicleRegistrationExpiryPopupOnAgreementSaving |  |
| `vm.settings.speedCommon.depreciationTillSaleDateInsteadDisposalDate` | checkbox | DepreciationTillSaleDateInsteadDisposalDate |  |
| `vm.settings.speedCommon.doNotRentMultipleVehiclesOnSameDriverCheck` | checkbox | DoNotRentMultipleVehiclesOnSameDriverCheck |  |
| `vm.settings.speedCommon.weeklyAgreementChargedMinimumOneWeek` | checkbox | WeeklyAgreementChargedMinimumOneWeek |  |
| `vm.settings.speedCommon.doNotAllowAgreementCreationIfDocumentsAreExpired` | checkbox | DoNotAllowAgreementCreationIfDocumentsAreExpired |  |
| `vm.settings.speedCommon.doNotAllowAgreementCreationIfNoDocumentsAttached` | checkbox | DoNotAllowAgreementCreationIfNoDocumentsAttached |  |
| `vm.settings.speedCommon.isFuelChargesIncluded` | checkbox | IsFuelChargesIncluded |  |
| `vm.settings.speedCommon.editDiscountwhileAgreementClosing` | checkbox | EditDiscountwhileAgreementClosing |  |
| `vm.settings.speedCommon.calculateAndShowAgreementChargesTillNow` | checkbox | CalculateAndShowAgreementChargesTillNow |  |
| `vm.settings.speedCommon.customizeRevenueLinkingForContactGroups` | checkbox | CustomizeRevenueLinkingForContactGroups |  |
| `vm.settings.speedCommon.allowAllContactGroupsInJVImportVoucherLines` | checkbox | AllowAllContactGroupsInJVImportVoucherLines |  |
| `vm.settings.speedCommon.alertsForExternalVehicle` | checkbox | AlertsForExternalVehicle |  |
| `vm.settings.speedCommon.alertsForMortgageVehicle` | checkbox | AlertsForMortgageVehicle |  |
| `vm.settings.speedCommon.creditCardLastFourDigits` | checkbox | CreditCardLastFourDigits |  |
| `vm.settings.speedCommon.manuallyConfirmBooking` | checkbox | ManuallyConfirmBooking |  |
| `vm.settings.speedCommon.enableTermsConditionsonAgreementCheckout` | checkbox | EnableTermsConditionsonAgreementCheckout |  |
| `vm.settings.speedCommon.doNotIncludeReplacementVehicles` | checkbox | DoNotIncludeReplacementVehicles |  |
| `vm.settings.speedCommon.doNotAllowReceiptCreationWithoutAgreement` | checkbox | DoNotAllowReceiptCreationWithoutAgreement |  |
| `vm.settings.speedCommon.reflectAllChargeTypesFromSettingsInRentalTariff` | checkbox | ReflectAllChargeTypesFromSettingsInRentalTariff |  |
| `vm.settings.speedCommon.chargesTypeWiseAllocationBasedOnDueAmounts` | checkbox | ChargesTypeWiseAllocationBasedOnDueAmounts |  |
| `vm.settings.speedCommon.allowReceiptOnScreenAllocationPartially` | checkbox | AllowReceiptOnScreenAllocationPartially |  |
| `vm.settings.speedCommon.allowSupplierPaymentOnScreenAllocationPartially` | checkbox | AllowSupplierPaymentOnScreenAllocationPartially |  |
| `vm.settings.speedCommon.allowToSavePaymentWithAmountLessThanOne` | checkbox | AllowToSavePaymentWithAmountLessThanOne |  |
| `vm.settings.speedCommon.useCustomerBranchForVouchers` | checkbox | UseCustomerBranchForVouchers |  |
| `vm.settings.speedCommon.isPoNoMandatoryForCompanyIn` | checkbox | IsPoNoMandatoryForCompanyIn |  |
| `vm.settings.speedCommon.vehiclSearchByChassisNo` | checkbox | VehiclSearchByChassisNo |  |
| `vm.settings.speedCommon.showBookedVehiclesInDashboard` | checkbox | ShowBookedVehiclesInDashboard |  |
| `vm.settings.speedCommon.applyPermissionOnDashboardSections` | checkbox | ApplyPermissionOnDashboardSections |  |
| `vm.settings.speedCommon.showLimoVehiclesInDashboard` | checkbox | ShowLimoVehiclesInDashboard |  |
| `vm.settings.speedCommon.showTransportVehiclesOnlyInTransportAgreements` | checkbox | ShowLimoVehiclesInDashboard |  |
| `vm.settings.speedCommon.allowAutoAllocationOnReceipts` | checkbox | AllowAutoAllocationOnReceipts |  |
| `vm.settings.speedCommon.allowAutoAllocationOnCashDeposits` | checkbox | AllowAutoAllocationOnCashDeposits |  |
| `vm.settings.speedCommon.allowBookingWhenVehicleIsInAnotherBranch` | checkbox | AllowBookingWhenVehicleIsInAnotherBranch |  |
| `vm.settings.speedCommon.showReplacementTodayVehiclesInDashboard` | checkbox | ShowReplacementTodayVehiclesInDashboard |  |
| `vm.settings.speedCommon.tariffCardExplicitSelection` | checkbox | TariffCardExplicitSelection |  |
| `vm.settings.speedCommon.makeTariffCardMandatoryInAgreementAndBooking` | checkbox | MakeTariffCardMandatoryInAgreementAndBooking |  |
| `vm.settings.speedCommon.showLimitedFieldsForAgreementsInAgreementDashboard` | checkbox | ShowLimitedFieldsForAgreementsInAgreementDashboard |  |
| `vm.settings.speedCommon.isCostCenterGroup2Enabled` | checkbox | isCostCenterGroup2Enabled |  |
| `vm.settings.speedCommon.isOnlyApprovedVoucherPrintEnabled` | checkbox | OnlyApprovedVoucherPrint |  |
| `vm.settings.speedCommon.isKMConfirmationPopupOnCheckInEnabled` | checkbox | isKMConfirmationPopupOnCheckInEnabled |  |
| `vm.settings.speedCommon.isCreateLeaseAgreementByWizardEnabled` | checkbox | isCreateLeaseAgreementByWizardEnabled |  |
| `vm.settings.speedCommon.donotChangeAutoLeaseAgreementEndDateWhileChangingMonth` | checkbox | DonotChangeAutoLeaseAgreementEndDateWhileChangingMonth |  |
| `vm.settings.speedCommon.dontAllowCheckInWith0km` | checkbox | dontAllowCheckInWith0km |  |
| `vm.settings.speedCommon.allowOverAllocate` | checkbox | allowOverAllocate |  |
| `vm.settings.speedCommon.dontPassAutoCreditNoteDurationLessThanOneMonth` | checkbox | DontPassAutoCreditNoteDurationLessThanOneMonth |  |
| `vm.settings.speedCommon.calculateClosingCreditNoteOnAgreementCharges` | checkbox | CalculateClosingCreditNoteOnAgreementCharges |  |
| `vm.settings.speedCommon.selectChargesTypeInMiscInvoice` | checkbox | SelectChargesTypeInMiscInvoice |  |
| `vm.settings.speedCommon.deleteFineBills` | checkbox | DeleteFineBills |  |
| `vm.settings.speedCommon.allowWorkshopMovementforExternalVehicleInCRS` | checkbox | AllowWorkshopMovementforExternalVehicleInCRS |  |
| `vm.settings.speedCommon.showDriverMinutesInMovements` | checkbox | ShowDriverMinutesInMovements |  |
| `vm.settings.speedCommon.allowWorkshopPO` | checkbox | AllowWorkshopPO |  |
| `vm.settings.speedCommon.dontAllowWorkshopMovementWhenAlreadyVehicleStatusIsWorkshop` | checkbox | DontAllowWorkshopMovementWhenAlreadyVehicleStatusIsWorkshop |  |
| `vm.settings.speedCommon.dontAllowAgreementExtension` | checkbox | DontAllowAgreementExtension |  |
| `vm.settings.speedCommon.disableTollsAndFinesDownloading` | checkbox | DisableTollsAndFinesDownloading |  |
| `vm.settings.speedCommon.disableKMInOutAndDriversInAgreement` | checkbox | DisableKMInOutAndDriversInAgreement |  |
| `vm.settings.speedCommon.includeCompanyDriversAndStaffAsAdditionalDrivers` | checkbox | IncludeCompanyDriversAndStaffAsAdditionalDrivers |  |
| `vm.settings.speedCommon.upGradeDownGradeAgreements` | checkbox | UpGradeDownGradeAgreements |  |
| `vm.settings.speedCommon.doNotCarryForwardSignatureOnAgreementUpgradeDowngrade` | checkbox | DoNotCarryForwardSignatureOnAgreementUpgradeDowngrade |  |
| `vm.settings.speedCommon.showAllDueVouchers` | checkbox | ShowAllDueVouchers |  |
| `vm.settings.speedCommon.showAllocationsInStatementOfAccount` | checkbox | ShowAllocationsInStatementOfAccount |  |
| `vm.settings.speedCommon.showAllocationsInCreditNote` | checkbox | ShowAllocationsInCreditNote |  |
| `vm.settings.speedCommon.doNotAllowAssetCreationIfVehicleDoestNotExist` | checkbox | DoNotAllowAssetCreationIfVehicleDoestNotExist |  |
| `vm.settings.speedCommon.stateFieldMandatoryInLocation` | checkbox | StateFieldMandatoryInLocation |  |
| `vm.settings.speedCommon.showLastJobDetailOnJobPrint` | checkbox |  |  |
| `vm.settings.speedCommon.importAndAttachPOInBill` | checkbox |  |  |
| `vm.settings.speedCommon.dontAllowPrintForUnApprovedJobEstimation` | checkbox |  |  |
| `vm.settings.speedCommon.showLogoInAppReportPrint` | checkbox |  |  |
| `vm.settings.speedCommon.allowGatePassPrintWithoutReceipt` | checkbox |  |  |
| `vm.settings.speedCommon.autoRoundingDifferenceAdjustmentInReceipts` | checkbox |  |  |
| `vm.settings.speedCommon.isMiscellaneousJobCardValueZero` | checkbox |  |  |
| `vm.settings.speedCommon.grnAsFinancialVoucher` | checkbox | GrnAsFinancialVoucher |  |
| `vm.settings.speedCommon.getSOAofCurrentBranchCustomersOnly` | checkbox | GetSOAofCurrentBranchCustomersOnly |  |
| `vm.settings.speedCommon.quotationIsMandatoryForAllIndividualCustomersForWeeklyAndMonthly` | checkbox | QuotationIsMandatoryForAllIndividualCustomersForWeeklyAndMonthly |  |
| `vm.settings.speedCommon.isAgreementAutoEndDate` | checkbox | isAgreementAutoEndDate |  |
| `vm.settings.speedCommon.branchWiseInvoicing` | checkbox | branchWiseInvoicing |  |
| `vm.settings.speedCommon.showFuelInPercentage` | checkbox | showFuelInPercentage |  |
| `vm.settings.speedCommon.calculateAmortizationForLastPeriodInsteadOfPassingPendingAmount` | checkbox | calculateAmortizationForLastPeriodInsteadOfPassingPendingAmount |  |
| `vm.settings.speedCommon.doNotClubPreviousMonthsIfAlreadyAmortized` | checkbox | doNotClubPreviousMonthsIfAlreadyAmortized |  |
| `vm.settings.speedCommon.doNotGenerateJobClosingInvoiceForInternalCustomer` | checkbox | doNotGenerateJobClosingInvoiceForInternalCustomer |  |
| `vm.settings.speedCommon.showBookingRefInSOA` | checkbox | showBookingRefInSOA |  |
| `vm.settings.speedCommon.showVoucherDetailDescriptionInSOA` | checkbox | showVoucherDetailDescriptionInSOA |  |
| `vm.settings.speedCommon.showVoucherDescriptionInSupplierOutStandingSOA` | checkbox | showVoucherDescriptionInSupplierOutStandingSOA |  |
| `vm.settings.speedCommon.showPlateNoForWorkshopInvoiceInSOA` | checkbox | showPlateNoForWorkshopInvoiceInSOA |  |
| `vm.settings.speedCommon.showPONoInInvoicingEngine` | checkbox | showPONoInInvoicingEngine |  |
| `vm.settings.speedCommon.showDescriptionForLimousineInvoiceInSOA` | checkbox | showDescriptionForLimousineInvoiceInSOA |  |
| `vm.settings.speedCommon.allowZeroValueRentalAgreement` | checkbox | allowZeroValueRentalAgreement |  |
| `vm.settings.speedCommon.considerExtraFuelInWhileFuelChargesCalculation` | checkbox | considerExtraFuelInWhileFuelChargesCalculation |  |
| `vm.settings.speedCommon.showFirstVehicleInBillSoA` | checkbox | showFirstVehicleInBillSoA |  |
| `vm.settings.speedCommon.unAllocatedAmountShowInReceivableAgeAnalysis` | checkbox | unAllocatedAmountShowInReceivableAgeAnalysis |  |
| `vm.settings.speedCommon.showOnlyStaff` | checkbox | showOnlyStaff |  |
| `vm.settings.speedCommon.showAdvancePhoneNumberInputInContacts` | checkbox | showAdvancePhoneNumberInputInContacts |  |
| `vm.settings.speedCommon.allowOnlyNumericNumberInContactNumber` | checkbox | AllowOnlyNumericNumberInContactNumber |  |
| `vm.settings.speedCommon.separateMakeAndModelInFleet` | checkbox | separateMakeAndModelInFleet |  |
| `vm.settings.speedCommon.agreementStartDateAsAdvanceAndDepositDate` | checkbox | agreementStartDateAsAdvanceAndDepositDate |  |
| `vm.settings.speedCommon.onBookingConfirmationVehicleSubstatusToBeChangedToPendingCustomerDelivery` | checkbox | onBookingConfirmationVehicleSubstatusToBeChangedToPendingCustomerDelivery |  |
| `vm.settings.speedCommon.doNotAllowDiscountInPO` | checkbox | DoNotAllowDiscountInPO |  |
| `vm.settings.speedCommon.allowGeneralBillOnCustomer` | checkbox | allowGeneralBillOnCustomer |  |
| `vm.settings.speedCommon.allowBlackListedCustomerInAgreement` | checkbox | allowBlackListedCustomerInAgreement |  |
| `vm.settings.speedCommon.allowPDCPrintingBeforeClearance` | checkbox | allowPDCPrintingBeforeClearance |  |
| `vm.settings.speedCommon.replacementOfMakeAndModelInGridForVehicles` | checkbox | replacementOfMakeAndModelInGridForVehicles |  |
| `vm.settings.speedCommon.dontAllowChassisNoDuplicationInVehicle` | checkbox | dontAllowChassisNoDuplicationInVehicle |  |
| `vm.settings.speedCommon.showCustomFieldForCheckoutCheckinMovement` | checkbox | showCustomFieldForCheckoutCheckinMovement |  |
| `vm.settings.speedCommon.showCustomField3InMovement` | checkbox | showCustomField3InMovement |  |
| `vm.settings.speedCommon.autoFixedDecimalRounding` | checkbox | autoFixedDecimalRounding |  |
| `vm.settings.speedCommon.allowDuplicateContactsPersonName` | checkbox | allowDuplicateContactsPersonName |  |
| `vm.settings.speedCommon.allowQuatityAndPriceForMiscVoucherLine` | checkbox | allowQuatityAndPriceForMiscVoucherLine |  |
| `vm.settings.speedCommon.selectToBranchInNRT` | checkbox | SelectToBranchInNRT |  |
| `vm.settings.speedCommon.showAllWorkshopMovementsInServiceLog` | checkbox | ShowAllWorkshopMovementsInServiceLog |  |
| `vm.settings.speedCommon.showFineInvoiceDetailInCustomerSOA` | checkbox | ShowFineInvoiceDetailInCustomerSOA |  |
| `vm.settings.speedCommon.showAgreementNotesInInvoiceDescription` | checkbox | ShowAgreementNotesInInvoiceDescription |  |
| `vm.settings.speedCommon.showAgreementInReceipt` | checkbox | ShowAgreementInReceipt |  |
| `vm.settings.speedCommon.showAgreementInPayment` | checkbox | ShowAgreementInPayment |  |
| `vm.settings.speedCommon.staffFineReceipt` | checkbox | StaffFineReceipt |  |
| `vm.settings.speedCommon.showOnlyDueInvoices` | checkbox | ShowOnlyDueInvoices |  |
| `vm.settings.speedCommon.showCodeNextToPlateNumber` | checkbox | ShowCodeNextToPlateNumber |  |
| `vm.settings.speedCommon.generalBillItemQuantityWise` | checkbox | GeneralBillItemQuantityWise |  |
| `vm.settings.speedCommon.attachAssetBranchWithVoucherLines` | checkbox | AttachAssetBranchWithVoucherLines |  |
| `vm.settings.speedCommon.agreementAndCustomerBalanceInAgreementView` | checkbox | AgreementAndCustomerBalanceInAgreementView |  |
| `vm.settings.speedCommon.carryforwardKMsonRAExtension` | checkbox | CarryforwardKMsonRAExtension |  |
| `vm.settings.speedCommon.showMileageInFuelInWithoutVehicleChangeOnAgreementUpgradeDowngrade` | checkbox | ShowMileageInFuelInWithoutVehicleChangeOnAgreementUpgradeDowngrade |  |
| `vm.settings.speedCommon.createCreditNotesForRentalOnly` | checkbox | CreateCreditNotesForRentalOnly |  |
| `vm.settings.speedCommon.extendLimit30Days` | checkbox | ExtendLimit30Days |  |
| `vm.settings.speedCommon.showExpiryDetailsForWarrantyOfVehicles` | checkbox | ShowExpiryDetailsForWarrantyOfVehicles |  |
| `vm.settings.speedCommon.allowMomentsForSaleVehicle` | checkbox | AllowMomentsForSaleVehicle |  |
| `vm.settings.speedCommon.showExtendedDateInLeaseAgreement` | checkbox | ShowExtendedDateInLeaseAgreement |  |
| `vm.settings.speedCommon.doNotShowAgreementNoInSOAEmail` | checkbox | DoNotShowAgreementNoInSOAEmail |  |
| `vm.settings.speedCommon.showMortgageInVehicle` | checkbox | ShowMortgageInVehicle |  |
| `vm.settings.speedCommon.showBankDetialForDebitCardInReceipt` | checkbox | ShowBankDetialForDebitCardInReceipt |  |
| `vm.settings.speedCommon.isRentalChargesEditableWhileBookingCretaion` | checkbox | IsRentalChargesEditableWhileBookingCretaion |  |
| `vm.settings.speedCommon.ignoreDebitCreditEquivalenceWhileClosingMonth` | checkbox | IgnoreDebitCreditEquivalenceWhileClosingMonth |  |
| `vm.settings.speedCommon.taxCalculationOnBillImport` | checkbox | TaxCalculationOnBillImport |  |
| `vm.settings.speedCommon.assignVehicleBranchInVoucherLine` | checkbox | AssignVehicleBranchInVoucherLine |  |
| `vm.settings.speedCommon.commercialRegistrationNumberInPrint` | checkbox | CommercialRegistrationNumberInPrint |  |
| `vm.settings.speedCommon.showTaxColumnInTollPrint` | checkbox | ShowTaxColumnInTollPrint |  |
| `vm.settings.speedCommon.showFineLogDetailInExportToExcel` | checkbox | ShowFineLogDetailInExportToExcel |  |
| `vm.settings.speedCommon.documentMustBeRequiredOnAgreementClose` | checkbox | DocumentMustBeRequiredOnAgreementClose |  |
| `vm.settings.speedCommon.showBranchColumnInTaxReturnReport` | checkbox | ShowBranchColumnInTaxReturnReport |  |
| `vm.settings.speedCommon.showRefNoFromVoucherLineInTaxReturnReport` | checkbox | ShowRefNoFromVoucherLineInTaxReturnReport |  |
| `vm.settings.speedCommon.attachVehicleWithAccountToDebit` | checkbox | AttachVehicleWithAccountToDebit |  |
| `vm.settings.speedCommon.attachVehicleWithAccountToCredit` | checkbox | AttachVehicleWithAccountToCredit |  |
| `vm.settings.speedCommon.customAmortizationIsNonFinancial` | checkbox | CustomAmortizationIsNonFinancial |  |
| `vm.settings.speedCommon.postAmortizationByPlanDateInCustomVoucher` | checkbox | PostAmortizationByPlanDateInCustomVoucher |  |
| `vm.settings.speedCommon.automaticallySetVehicleStatusNotReadyOnAgreementClosing` | checkbox | AutomaticallySetVehicleStatusNotReadyOnAgreementClosing |  |
| `vm.settings.speedCommon.enableVehicleSelectionByTypeInAgreements` | checkbox | EnableVehicleSelectionByTypeInAgreements |  |
| `vm.settings.speedCommon.termsConditionUrl` | text | TermsConditionUrl |  |
| `vm.settings.speedCommon.salesPersonDesignation` | select |  | ng-options=designation.id as designation.name for designation in vm.designationDetails |
| `vm.tenantLinkedCustomer` | ui-select |  |  |
| `vm.defaultDriverForEquipmentAgreement` | ui-select |  |  |
| `linking.supplier` | ui-select |  |  |
| `vm.filters.warrantyTypeVehicles` | ui-select |  |  |
| `vm.filters.accountsList` | ui-select |  |  |
| `vm.settings.speedCommon.vehicleRepairForLedgerAccountId` | select |  | ng-options=account.id as account.accountCode + '-' + account.name for account in vm.vehicleExpensesAccounts |
| `vm.filters.chargesType` | ui-select |  |  |
| `vm.settings.speedCommon.custodyMovementDueAmount` | text | CustodyMovementDueAmount |  |
| `vm.settings.speedCommon.isLeftHandDriving` | checkbox | IsLeftHandDriving |  |
| `vm.settings.speedCommon.showDamagesPicturesOnCheckCard` | checkbox | showDamagesPicturesOnCheckCard |  |
| `vm.settings.speedCommon.showDocumentImagesOnCheckcard` | checkbox | ShowDocumentImagesOnCheckcard |  |
| `vm.settings.speedCommon.selectCustomerFromList` | checkbox | selectCustomerFromList |  |
| `vm.profitShareForLessee` | text |  |  |
| `vm.settings.speedCommon.serviceAlertsPriorKms` | text |  |  |
| `vm.settings.speedCommon.serviceAlertsPriorDays` | text |  |  |
| `vm.apiKey` | email | ccCheckCardTo |  |
| `vm.settings.speedCommon.rateCardForWebBookingPlugin` | select |  | ng-options=tariffCard.id as tariffCard.name for tariffCard in vm.tariffCards |
| `vm.settings.speedCommon.showGroupWithAvailableVehicle` | checkbox | ShowGroupWithAvailableVehicle |  |
| `vm.settings.speedCommon.googleApiKey` | text | GoogleApiKey |  |
| `vm.settings.speedCommon.mileageUpdateAlertAfterMonths` | text |  |  |
| `vm.settings.speedCommon.invoiceDateAsGenerationDate` | checkbox | InvoiceDateAsGenerationDate |  |
| `vm.settings.speedCommon.invoiceDateAsGenerationDateForAllInvoices` | checkbox | InvoiceDateAsGenerationDateForAllInvoices |  |
| `vm.settings.speedCommon.dontCheckDepreciationAndAmortizationInFiscalMonthClosing` | checkbox | DontCheckDepreciationAndAmortizationInFiscalMonthClosing |  |
| `vm.settings.speedCommon.createNewBookingAlwaysAsConfirmed` | checkbox | CreateNewBookingAlwaysAsConfirmed |  |
| `vm.settings.speedCommon.assetDisposalPostingOptions` | radio | Setting_PostExpenseAndRevenueSeparately |  |
| `vm.settings.speedCommon.assetDisposalPostingOptions` | radio | Setting_PostNetProfitOrLoss |  |
| `vm.settings.speedCommon.estimateOrSetAssetPrice` | checkbox |  |  |
| `vm.settings.speedCommon.decliningDeprOnAssetLifeBookValue` | checkbox |  |  |
| `vm.settings.speedCommon.profitMarginOnBookValue` | text |  |  |
| `vm.settings.speedCommon.dueDefleetVehiclesReportsKMs` | text |  |  |
| `vm.settings.speedCommon.dueDefleetVehiclesReportsPeriod` | text |  |  |
| `vm.settings.speedCommon.includeBuyBack` | checkbox | IncludeBuyBack |  |
| `vm.settings.speedCommon.detailedVehicleUtilizationTimeOfDay` | input |  |  |
| `vm.settings.speedCommon.invoiceBasedOnAgreedRent` | checkbox | InvoiceBasedOnAgreedRent |  |
| `vm.settings.speedCommon.fixedCreditCardCommissionInReceipt` | checkbox | FixedCreditCardCommissionInReceipt |  |
| `vm.settings.speedCommon.makeCreditCardInfoRequiredInReceipt` | checkbox | MakeCreditCardInfoRequiredInReceipt |  |
| `vm.settings.speedCommon.addVATamountforCreditCardCommissioninReceipt` | checkbox | AddVATamountforCreditCardCommissioninReceipt |  |
| `vm.settings.speedCommon.getCloseAgreementsForDriverTimeSheet` | checkbox | GetCloseAgreementsForDriverTimeSheet |  |
| `vm.customer` | ui-select |  |  |
| `vm.expenseType` | ui-select |  |  |
| `vm.settings.speedCommon.isDataSharingEnable` | checkbox | isDataSharingEnable |  |
| `vm.settings.speedCommon.startSharingAtNightTimeOnly` | checkbox | StartSharingAtNightTimeOnly |  |
| `vm.settings.speedCommon.shareDataAfterEveryMinute` | input |  | ng-disabled=!vm.settings.speedCommon.isDataSharingEnable |
| `vm.settings.speedCommon.fuelSurchargeInvoiceClubWithFuelInvoice` | checkbox | FuelSurchargeInvoiceClubWithFuelInvoice |  |
| `vm.settings.speedCommon.percentageFuelSurchargeInvoiceClubWithFuelInvoice` | text |  | ng-readonly=!vm.settings.speedCommon.fuelSurchargeInvoiceClubWithFuelInvoice; ng-disabled=!vm.settings.speedCommon.fuelSurchargeInvoiceClubWithFuelInvoice |
| `vm.settings.speedCommon.fuelAverageUsingPettyCashPayment` | checkbox | FuelAverageUsingPettyCashPayment |  |
| `vm.settings.speedCommon.currentFuelPrice` | text | currentFuelPrice | ng-readonly=!vm.settings.speedCommon.fuelAverageUsingPettyCashPayment; ng-disabled=!vm.settings.speedCommon.fuelAverageUsingPettyCashPayment |
| `vm.settings.speedCommon.allowNonBankFinancingForAssetLoanBills` | checkbox | AllowNonBankFinancingForAssetLoanBills |  |
| `vm.settings.speedCommon.multiSelectLoanEMI` | checkbox | MultiSelectLoanEMI |  |
| `vm.settings.speedCommon.showLoanForGeneralBill` | checkbox | ShowLoanForGeneralBill |  |
| `vm.settings.speedCommon.allowAssetLoanBillEdit` | checkbox | allowAssetLoanBillEdit |  |
| `vm.settings.speedCommon.editEMIInterest` | checkbox | editEMIInterest |  |
| `vm.settings.speedCommon.enterInterestAmountForAssetLoanPaymentPlan` | checkbox | EnterInterestAmountForAssetLoanPaymentPlan |  |
| `vm.settings.speedCommon.allowResubmitOnChequeReceivables` | checkbox | AllowResubmitOnChequeReceivables |  |
| `vm.settings.speedCommon.enablePostDatedChequeDirectlyToBank` | checkbox | EnablePostDatedChequeDirectlyToBank |  |
| `vm.settings.speedCommon.enablePostDatedChequePayableDirectlyToBank` | checkbox | EnablePostDatedChequePayableDirectlyToBank |  |
| `vm.settings.speedCommon.allowToEditRVAfterChequeMature` | checkbox | AllowToEditRVAfterChequeMature |  |
| `vm.settings.speedCommon.noDuplicationOfChequeNumberInReceiptsPayments` | checkbox | noDuplicationOfChequeNumberInReceiptsPayments |  |
| `vm.settings.speedCommon.allowDateSelectionOnPdcToCdcConversion` | checkbox | AllowDateSelectionOnPdcToCdcConversion |  |
| `vm.settings.speedCommon.tenantWebSiteRootAddress` | url | tenantWebSiteRootAddress |  |
| `vm.settings.documentNos.manualAgreementNo` | checkbox | ManualAgreementNo |  |
| `vm.settings.documentNos.saleOriginCode` | checkbox | saleOriginCode |  |
| `vm.settings.documentNos.branchCode` | checkbox | branchCode |  |
| `vm.settings.documentNos.branchCode2` | checkbox | branchCode2 |  |
| `vm.settings.documentNos.typeCode` | checkbox | TypeCode |  |
| `vm.settings.documentNos.agreementYearMonth` | checkbox |  |  |
| `vm.settings.documentNos.nummericPartLength` | text |  | ng-options=numericlength as numericlength for numericlength in vm.numericLengths |
| `vm.settings.documentNos.excludeBranchPrefixForLease` | checkbox | ExcludeBranchPrefixForLease |  |
| `vm.settings.documentNos.hourly` | text | Daily |  |
| `vm.settings.documentNos.daily` | text | Daily |  |
| `vm.settings.documentNos.weekly` | text | Weekly |  |
| `vm.settings.documentNos.monthly` | text | Monthly |  |
| `vm.settings.documentNos.lease` | text | Lease |  |
| `vm.settings.documentNos.chauffeur` | text | Lease |  |
| `vm.settings.documentNos.accessories` | text | Accessories |  |
| `vm.settings.documentNos.prepaidCouponPrefix` | text |  | maxlength=3 |
| `vm.settings.documentNos.shoppingCouponPrefix` | text |  | maxlength=3 |
| `vm.settings.documentNos.redeemCouponPrefix` | text |  | maxlength=3 |
| `vm.settings.documentNos.couponNumericPartLength` | text |  | ng-options=numericlength as numericlength for numericlength in vm.numericLengths |
| `vm.settings.documentNos.rentalQuotationBranchCode` | checkbox | RentalQuotationBranchCode |  |
| `vm.settings.documentNos.rentalQuotationCodePrefix` | text |  | maxlength=5 |
| `vm.settings.documentNos.rentalQuotationYear` | checkbox |  |  |
| `vm.settings.documentNos.rentalQuotationMonth` | checkbox |  |  |
| `vm.settings.documentNos.rentalQuotationCodeNumericPart` | text |  | ng-options=invoiceNumericlength as invoiceNumericlength for invoiceNumericlength in vm.invoiceNumericLengths |
| `vm.settings.documentNos.quotationBranchCode` | checkbox | QuotationBranchCode |  |
| `vm.settings.documentNos.quotationBranchCode2` | checkbox | QuotationBranchCode2 |  |
| `vm.settings.documentNos.quotationCode` | text |  | maxlength=5 |
| `vm.settings.documentNos.quotationYear` | checkbox |  |  |
| `vm.settings.documentNos.quotationMonth` | checkbox |  |  |
| `vm.settings.documentNos.quotationNummericPartLength` | text |  | ng-options=invoiceNumericlength as invoiceNumericlength for invoiceNumericlength in vm.invoiceNumericLengths |
| `vm.settings.documentNos.leaseQuotationBranchCode` | checkbox | LeaseQuotationBranchCode |  |
| `vm.settings.documentNos.leaseQuotationBranchCode2` | checkbox | LeaseQuotationBranchCode2 |  |
| `vm.settings.documentNos.leaseQuotationCodePrefix` | text |  | maxlength=4 |
| `vm.settings.documentNos.leaseQuotationYear` | checkbox |  |  |
| `vm.settings.documentNos.leaseQuotationMonth` | checkbox |  |  |
| `vm.settings.documentNos.leaseQuotationCodeNumericPart` | text |  | ng-options=invoiceNumericlength as invoiceNumericlength for invoiceNumericlength in vm.invoiceNumericLengths |
| `vm.settings.documentNos.masterAgreementCode` | text |  | maxlength=3 |
| `vm.settings.documentNos.masterAgreementYearMonth` | checkbox |  |  |
| `vm.settings.documentNos.masterAgreementNummericPartLength` | text |  | ng-options=invoiceNumericlength as invoiceNumericlength for invoiceNumericlength in vm.invoiceNumericLengths |
| `vm.settings.documentNos.leaseMasterAgreementCode` | text |  | maxlength=3 |
| `vm.settings.documentNos.leaseMasterAgreementYearMonth` | checkbox |  |  |
| `vm.settings.documentNos.leaseMasterAgreementNummericPartLength` | text |  | ng-options=invoiceNumericlength as invoiceNumericlength for invoiceNumericlength in vm.invoiceNumericLengths |
| `vm.settings.documentNos.rentalMasterAgreementCode` | text |  | maxlength=3 |
| `vm.settings.documentNos.rentalMasterAgreementYear` | checkbox |  |  |
| `vm.settings.documentNos.rentalMasterAgreementMonth` | checkbox |  |  |
| `vm.settings.documentNos.rentalMasterAgreementNummericPartLength` | text |  | ng-options=invoiceNumericlength as invoiceNumericlength for invoiceNumericlength in vm.invoiceNumericLengths |
| `vm.settings.documentNos.chequeBatchNoCode` | text |  | maxlength=3 |
| `vm.settings.documentNos.chequeBatchNoYear` | checkbox |  |  |
| `vm.settings.documentNos.chequeBatchNoMonth` | checkbox |  |  |
| `vm.settings.documentNos.chequeBatchNoNummericPartLength` | text |  | ng-options=invoiceNumericlength as invoiceNumericlength for invoiceNumericlength in vm.invoiceNumericLengths |
| `vm.settings.documentNos.equipmentDeliveryCode` | text |  | maxlength=3 |
| `vm.settings.documentNos.equipmentDeliveryIncludeMasterAgreementNo` | checkbox |  |  |
| `vm.settings.documentNos.equipmentDeliveryNummericPartLength` | text |  | ng-options=invoiceNumericlength as invoiceNumericlength for invoiceNumericlength in vm.invoiceNumericLengths |
| `vm.settings.documentNos.bookingSaleOriginCode` | checkbox | BookingSaleOriginCode |  |
| `vm.settings.documentNos.bookingBranchCode` | checkbox | BranchCode |  |
| `vm.settings.documentNos.bookingTypeCode` | checkbox | TypeCode |  |
| `vm.settings.documentNos.bookingYearMonth` | checkbox |  |  |
| `vm.settings.documentNos.bookingNummericPartLength` | text |  | ng-options=numericlength as numericlength for numericlength in vm.numericLengths |
| `vm.settings.documentNos.bookingDaily` | text | Daily |  |
| `vm.settings.documentNos.bookingWeekly` | text | Weekly |  |
| `vm.settings.documentNos.bookingMonthly` | text | Monthly |  |
| `vm.settings.documentNos.supplierAgreementBranchCode` | checkbox | supplierAgreementBranchCode |  |
| `vm.settings.documentNos.supplierAgreementTypeCode` | text |  | maxlength=3 |
| `vm.settings.documentNos.supplierAgreementYearMonth` | checkbox |  |  |
| `vm.settings.documentNos.supplierAgreementNumericPartLength` | text |  | ng-options=numericlength as numericlength for numericlength in vm.numericLengths |
| `vm.settings.documentNos.externalDriverAgreementBranchCode` | checkbox | externalDriverAgreementBranchCode |  |
| `vm.settings.documentNos.externalDriverAgreementTypeCode` | text |  | maxlength=3 |
| `vm.settings.documentNos.externalDriverAgreementYearMonth` | checkbox |  |  |
| `vm.settings.documentNos.externalDriverAgreementNumericPartLength` | text |  | ng-options=numericlength as numericlength for numericlength in vm.numericLengths |
| `vm.settings.documentNos.invoiceBranchCode` | checkbox | InvoiceBranchCode |  |
| `vm.settings.documentNos.invoiceTypeCode` | checkbox | invoiceTypeCode |  |
| `vm.settings.documentNos.invoiceYearMonth` | checkbox | InvoiceYearMonth |  |
| `vm.settings.documentNos.invoiceNummericPartLength` | text |  | ng-options=invoiceNumericlength as invoiceNumericlength for invoiceNumericlength in vm.invoiceNumericLengths |
| `vm.settings.documentNos.assignTemporaryPrefixForUnApprovedInvoice` | text |  | maxlength=5 |
| `vm.settings.documentNos.invoiceTypeVehicleAssignment` | text |  | maxlength=3 |
| `vm.settings.documentNos.invoiceTypeRental` | text |  | maxlength=3 |
| `vm.settings.documentNos.invoiceTypeLimo` | text |  | maxlength=3 |
| `vm.settings.documentNos.invoiceTypeFine` | text |  | maxlength=3 |
| `vm.settings.documentNos.invoiceTypeSalik` | text |  | maxlength=3 |
| `vm.settings.documentNos.invoiceTypeDarb` | text |  | maxlength=3 |
| `vm.settings.documentNos.invoiceTypeLease` | text |  | maxlength=3 |
| `vm.settings.documentNos.invoiceTypeTransportation` | text |  | maxlength=3 |
| `vm.settings.documentNos.invoiceTypeMisc` | text |  | maxlength=3 |
| `vm.settings.documentNos.invoiceTypeRecoveryMisc` | text |  | maxlength=3 |
| `vm.settings.documentNos.invoiceTypeChauffeurMisc` | text |  | maxlength=3 |
| `vm.settings.documentNos.invoiceTypeExcessKMsInvoice` | text |  | maxlength=3 |
| `vm.settings.documentNos.invoiceTypeExcessInsuranceInvoice` | text |  | maxlength=3 |
| `vm.settings.documentNos.invoiceTypeAssetSale` | text |  | maxlength=3 |
| `vm.settings.documentNos.invoiceTypeAdditionalCharge` | text |  | maxlength=3 |
| `vm.settings.documentNos.invoiceTypeDamageInvoice` | text |  | maxlength=3 |
| `vm.settings.documentNos.invoiceTypeWorkshop` | text |  | maxlength=3 |
| `vm.settings.documentNos.invoiceTypeAccessories` | text |  | maxlength=3 |
| `vm.settings.documentNos.invoiceTypeAdvanceTaxInvoice` | text |  | maxlength=3 |
| `vm.settings.documentNos.invoiceTypeCDW` | text |  | maxlength=3 |
| `vm.settings.documentNos.invoiceTypePAI` | text |  | maxlength=3 |
| `vm.settings.documentNos.invoiceTypeFuel` | text |  | maxlength=3 |
| `vm.settings.documentNos.invoiceTypeMileage` | text |  | maxlength=3 |
| `vm.settings.documentNos.invoiceTypeAdditionalDriver` | text |  | maxlength=3 |
| `vm.settings.documentNos.invoiceTypeBabySeat` | text |  | maxlength=3 |
| `vm.settings.documentNos.invoiceTypeDeliveryCharges` | text |  | maxlength=3 |
| `vm.settings.documentNos.invoiceTypePreTerminationPenalty` | text |  | maxlength=3 |
| `vm.settings.documentNos.invoiceTypeTyreInsuranceCharges` | text |  | maxlength=3 |
| `vm.settings.documentNos.invoiceTypeExcessInsuranceCharges` | text |  | maxlength=3 |
| `vm.settings.documentNos.invoiceTypeWindScreenInsurance` | text |  | maxlength=3 |
| `vm.settings.documentNos.invoiceTypeCollectionCharges` | text |  | maxlength=3 |
| `vm.settings.documentNos.invoiceTypeRoadSideAssistance` | text |  | maxlength=3 |
| `vm.settings.documentNos.invoiceTypeExcessCharges` | text |  | maxlength=3 |
| `vm.settings.documentNos.invoiceTypeExtraHoursCharges` | text |  | maxlength=3 |
| `vm.settings.documentNos.invoiceTypeWaitingCharges` | text |  | maxlength=3 |
| `vm.settings.documentNos.invoiceTypeExtra2Charges` | text |  | maxlength=3 |
| `vm.settings.documentNos.invoiceTypeExtra3Charges` | text |  | maxlength=3 |
| `vm.settings.documentNos.invoiceTypeDamageChargesInvoice` | text |  | maxlength=3 |
| `vm.settings.documentNos.invoiceTypeExtra1Charges` | text |  | maxlength=3 |
| `vm.settings.documentNos.invoiceTypeExtra4Charges` | text |  | maxlength=3 |
| `vm.settings.documentNos.invoiceTypeParkingCharges` | text |  | maxlength=3 |
| `vm.settings.speedCommon.manualCreditNoteNo` | checkbox | CreditNoteNo |  |
| `vm.settings.documentNos.creditNoteBranchCode` | checkbox | creditNoteBranchCode |  |
| `vm.settings.documentNos.creditNoteBranchCode2` | checkbox | creditNoteBranchCode2 |  |
| `vm.settings.documentNos.creditNoteCode` | text |  | maxlength=5 |
| `vm.settings.documentNos.creditNoteYearMonth` | checkbox |  |  |
| `vm.settings.documentNos.creditNoteNummericPartLength` | text |  | ng-options=invoiceNumericlength as invoiceNumericlength for invoiceNumericlength in vm.invoiceNumericLengths |
| `vm.settings.documentNos.assignTemporaryPrefixForUnApprovedCredit` | text |  | maxlength=5 |
| `vm.settings.documentNos.debitNoteBranchCode` | checkbox | debitNoteBranchCode |  |
| `vm.settings.documentNos.debitNoteCode` | text |  | maxlength=5 |
| `vm.settings.documentNos.debitNoteYearMonth` | checkbox |  |  |
| `vm.settings.documentNos.debitNoteNummericPartLength` | text |  | ng-options=invoiceNumericlength as invoiceNumericlength for invoiceNumericlength in vm.invoiceNumericLengths |
| `vm.settings.documentNos.manualReceiptNo` | checkbox | ManualReceiptNo |  |
| `vm.settings.documentNos.receiptBranchCode` | checkbox | receiptBranchCode |  |
| `vm.settings.documentNos.receiptCode` | text |  | maxlength=5 |
| `vm.settings.documentNos.receiptYearMonth` | checkbox |  |  |
| `vm.settings.documentNos.receiptNummericPartLength` | text |  | ng-options=invoiceNumericlength as invoiceNumericlength for invoiceNumericlength in vm.invoiceNumericLengths |
| `vm.settings.documentNos.receiptTypeCode` | checkbox | receiptTypeCode |  |
| `vm.settings.documentNos.receiptBillingMethodCode` | checkbox |  |  |
| `vm.settings.documentNos.receiptTypeCustomer` | text |  | maxlength=3 |
| `vm.settings.documentNos.receiptTypeAdvance` | text |  | maxlength=3 |
| `vm.settings.documentNos.receiptTypeEmployee` | text |  | maxlength=3 |
| `vm.settings.documentNos.receiptTypeAdvanceTax` | text |  | maxlength=3 |
| `vm.settings.documentNos.receiptTypeAssetSale` | text |  | maxlength=3 |
| `vm.settings.documentNos.receiptTypeGeneral` | text |  | maxlength=3 |
| `vm.settings.documentNos.receiptTypeStaffAdvance` | text |  | maxlength=3 |
| `vm.settings.documentNos.receiptTypeStaffLoan` | text |  | maxlength=3 |
| `vm.settings.speedCommon.manualBillNo` | checkbox | ManualBillNo |  |
| `vm.settings.documentNos.billBranchCode` | checkbox | billBranchCode |  |
| `vm.settings.documentNos.billCode` | text |  | maxlength=5 |
| `vm.settings.documentNos.billYearMonth` | checkbox |  |  |
| `vm.settings.documentNos.billNummericPartLength` | text |  | ng-options=invoiceNumericlength as invoiceNumericlength for invoiceNumericlength in vm.invoiceNumericLengths |
| `vm.settings.documentNos.purchaseOrderBranchCode` | checkbox | poBranchCode |  |
| `vm.settings.documentNos.purchaseOrderCode` | text |  | maxlength=5 |
| `vm.settings.documentNos.purchaseOrderYearMonth` | checkbox |  |  |
| `vm.settings.documentNos.purchaseOrderNummericPartLength` | text |  | ng-options=invoiceNumericlength as invoiceNumericlength for invoiceNumericlength in vm.invoiceNumericLengths |
| `vm.settings.documentNos.purchaseRequestBranchCode` | checkbox | prBranchCode |  |
| `vm.settings.documentNos.purchaseRequestCode` | text |  | maxlength=5 |
| `vm.settings.documentNos.purchaseRequestYearMonth` | checkbox |  |  |
| `vm.settings.documentNos.purchaseRequestNummericPartLength` | text |  | ng-options=invoiceNumericlength as invoiceNumericlength for invoiceNumericlength in vm.invoiceNumericLengths |
| `vm.settings.documentNos.saleOrderBranchCode` | checkbox | soBranchCode |  |
| `vm.settings.documentNos.saleOrderCode` | text |  | maxlength=5 |
| `vm.settings.documentNos.saleOrderYearMonth` | checkbox |  |  |
| `vm.settings.documentNos.saleOrderNummericPartLength` | text |  | ng-options=invoiceNumericlength as invoiceNumericlength for invoiceNumericlength in vm.invoiceNumericLengths |
| `vm.settings.documentNos.provisionBranchCode` | checkbox | provisionBranchCode |  |
| `vm.settings.documentNos.provisionCode` | text |  | maxlength=3 |
| `vm.settings.documentNos.provisionYearMonth` | checkbox |  |  |
| `vm.settings.documentNos.provisionNummericPartLength` | text |  | ng-options=invoiceNumericlength as invoiceNumericlength for invoiceNumericlength in vm.invoiceNumericLengths |
| `vm.settings.documentNos.paymentBranchCode` | checkbox | paymentBranchCode |  |
| `vm.settings.documentNos.paymentTypeCode` | checkbox | paymentTypeCode |  |
| `vm.settings.documentNos.paymentYearMonth` | checkbox |  |  |
| `vm.settings.documentNos.paymentBillingMethodCode` | checkbox |  |  |
| `vm.settings.documentNos.paymentNummericPartLength` | text |  | ng-options=invoiceNumericlength as invoiceNumericlength for invoiceNumericlength in vm.invoiceNumericLengths |
| `vm.settings.documentNos.paymentTypeCustomer` | text |  | maxlength=3 |
| `vm.settings.documentNos.paymentTypeSupplier` | text |  | maxlength=3 |
| `vm.settings.documentNos.paymentTypeEmployee` | text |  | maxlength=3 |
| `vm.settings.documentNos.paymentTypeExpense` | text |  | maxlength=3 |
| `vm.settings.documentNos.paymentTypeDepositRefund` | text |  | maxlength=3 |
| `vm.settings.documentNos.paymentTypeGeneral` | text |  | maxlength=3 |
| `vm.settings.documentNos.paymentTypeAdvance` | text |  | maxlength=3 |
| `vm.settings.documentNos.paymentTypeStockPurchase` | text |  | maxlength=3 |
| `vm.settings.documentNos.paymentTypeSalary` | text |  | maxlength=3 |
| `vm.settings.documentNos.paymentTypeStaffAdvance` | text |  | maxlength=3 |
| `vm.settings.documentNos.paymentTypeStaffLoan` | text |  | maxlength=3 |
| `vm.settings.documentNos.jvBranchCode` | checkbox | jvBranchCode |  |
| `vm.settings.documentNos.jvCode` | text |  | maxlength=5 |
| `vm.settings.documentNos.jvYearMonth` | checkbox |  |  |
| `vm.settings.documentNos.jvNummericPartLength` | text |  | ng-options=invoiceNumericlength as invoiceNumericlength for invoiceNumericlength in vm.invoiceNumericLengths |
| `vm.settings.documentNos.cashBankDepositCode` | text |  | maxlength=5 |
| `vm.settings.documentNos.cashBankDepositYearMonth` | checkbox |  |  |
| `vm.settings.documentNos.cashBankDepositNummericPartLength` | text |  | ng-options=invoiceNumericlength as invoiceNumericlength for invoiceNumericlength in vm.invoiceNumericLengths |
| `vm.settings.documentNos.amortizationCode` | text |  | maxlength=3 |
| `vm.settings.documentNos.amortizationNummericPartLength` | text |  | ng-options=invoiceNumericlength as invoiceNumericlength for invoiceNumericlength in vm.invoiceNumericLengths |
| `vm.settings.documentNos.openingBalanceCode` | text |  | maxlength=3 |
| `vm.settings.documentNos.openingBalanceNummericPartLength` | text |  | ng-options=invoiceNumericlength as invoiceNumericlength for invoiceNumericlength in vm.invoiceNumericLengths |
| `vm.settings.documentNos.customerDepositBranchCode` | checkbox | customerDepositBranchCode |  |
| `vm.settings.documentNos.customerDepositCode` | text |  | maxlength=3 |
| `vm.settings.documentNos.customerDepositYearMonth` | checkbox |  |  |
| `vm.settings.documentNos.customerDepositNummericPartLength` | text |  | ng-options=invoiceNumericlength as invoiceNumericlength for invoiceNumericlength in vm.invoiceNumericLengths |
| `vm.settings.documentNos.depreciationCode` | text |  | maxlength=3 |
| `vm.settings.documentNos.depreciationNummericPartLength` | text |  | ng-options=invoiceNumericlength as invoiceNumericlength for invoiceNumericlength in vm.invoiceNumericLengths |
| `vm.settings.documentNos.matureChequePayableCode` | text |  | maxlength=3 |
| `vm.settings.documentNos.matureChequePayableYearMonth` | checkbox |  |  |
| `vm.settings.documentNos.matureChequePayableNummericPartLength` | text |  | ng-options=invoiceNumericlength as invoiceNumericlength for invoiceNumericlength in vm.invoiceNumericLengths |
| `vm.settings.documentNos.cancelChequePayableCode` | text |  | maxlength=3 |
| `vm.settings.documentNos.cancelChequePayableYearMonth` | checkbox |  |  |
| `vm.settings.documentNos.cancelChequePayableNummericPartLength` | text |  | ng-options=invoiceNumericlength as invoiceNumericlength for invoiceNumericlength in vm.invoiceNumericLengths |
| `vm.settings.documentNos.matureChequeReceivableCode` | text |  | maxlength=3 |
| `vm.settings.documentNos.matureChequeReceivableYearMonth` | checkbox |  |  |
| `vm.settings.documentNos.matureChequeReceivableNummericPartLength` | text |  | ng-options=invoiceNumericlength as invoiceNumericlength for invoiceNumericlength in vm.invoiceNumericLengths |
| `vm.settings.documentNos.returnChequeReceivableCode` | text |  | maxlength=3 |
| `vm.settings.documentNos.returnChequeReceivableYearMonth` | checkbox |  |  |
| `vm.settings.documentNos.returnChequeReceivableNummericPartLength` | text |  | ng-options=invoiceNumericlength as invoiceNumericlength for invoiceNumericlength in vm.invoiceNumericLengths |
| `vm.settings.documentNos.creditCardTransactionsBankTransferCode` | text |  | maxlength=4 |
| `vm.settings.documentNos.creditCardTransactionsBankTransferYearMonth` | checkbox |  |  |
| `vm.settings.documentNos.creditCardTransactionsBankTransferNummericPartLength` | text |  | ng-options=invoiceNumericlength as invoiceNumericlength for invoiceNumericlength in vm.invoiceNumericLengths |
| `vm.settings.documentNos.coA_SubAccountLength` | text |  | ng-options=numericlength as numericlength for numericlength in vm.numericLengthsAccount |
| `vm.settings.documentNos.manualCustomerCode` | checkbox | Setting_ManualCustomerCode |  |
| `vm.settings.documentNos.customerBranchCode` | checkbox | customerBranchCode |  |
| `vm.settings.documentNos.customerBranchCode2` | checkbox | customerBranchCode2 |  |
| `vm.settings.documentNos.individualCodePrefix` | text |  | maxlength=4 |
| `vm.settings.documentNos.companyCodePrefix` | text |  | maxlength=4 |
| `vm.settings.documentNos.customerCodeNumericPart` | text |  | ng-options=invoiceNumericlength as invoiceNumericlength for invoiceNumericlength in vm.invoiceNumericLengths |
| `vm.settings.documentNos.manualSupplierCode` | checkbox | Setting_ManualSupplierCode |  |
| `vm.settings.documentNos.supplierCodePrefix` | text |  | maxlength=4 |
| `vm.settings.documentNos.supplierCodeNumericPart` | text |  | ng-options=invoiceNumericlength as invoiceNumericlength for invoiceNumericlength in vm.invoiceNumericLengths |
| `vm.settings.documentNos.manualStaffCode` | checkbox | Setting_ManualStaffCode |  |
| `vm.settings.documentNos.staffCodePrefix` | text |  | maxlength=4 |
| `vm.settings.documentNos.staffCodeNumericPart` | text |  | ng-options=invoiceNumericlength as invoiceNumericlength for invoiceNumericlength in vm.invoiceNumericLengths |
| `vm.settings.documentNos.manualItemCode` | checkbox | Setting_ManualItemCode |  |
| `vm.settings.documentNos.leaseInquiryCodePrefix` | text |  | maxlength=4 |
| `vm.settings.documentNos.leaseInquiryCodeNumericPart` | text |  | ng-options=invoiceNumericlength as invoiceNumericlength for invoiceNumericlength in vm.invoiceNumericLengths |
| `vm.settings.documentNos.leaseMasterAgreementCode` | text |  | maxlength=3 |
| `vm.settings.documentNos.leaseMasterAgreementYearMonth` | checkbox |  |  |
| `vm.settings.documentNos.leaseMasterAgreementNummericPartLength` | text |  | ng-options=invoiceNumericlength as invoiceNumericlength for invoiceNumericlength in vm.invoiceNumericLengths |
| `vm.settings.documentNos.jobPrefix` | text |  | maxlength=3 |
| `vm.settings.documentNos.jobYearMonth` | checkbox |  |  |
| `vm.settings.documentNos.jobNummericPartLength` | text |  | ng-options=invoiceNumericlength as invoiceNumericlength for invoiceNumericlength in vm.invoiceNumericLengths |
| `vm.settings.documentNos.jobEstimationPrefix` | text |  | maxlength=3 |
| `vm.settings.documentNos.jobEstimationYearMonth` | checkbox |  |  |
| `vm.settings.documentNos.jobEstimationNummericPartLength` | text |  | ng-options=invoiceNumericlength as invoiceNumericlength for invoiceNumericlength in vm.invoiceNumericLengths |
| `vm.settings.documentNos.depositUsedPrefix` | text |  | maxlength=3 |
| `vm.settings.documentNos.depositUsedNumericPartLength` | text |  | ng-options=invoiceNumericlength as invoiceNumericlength for invoiceNumericlength in vm.invoiceNumericLengths |
| `vm.settings.documentNos.serviceBookingPrefix` | text | VehicleSerivceBooking |  |
| `vm.settings.documentNos.limoQuotationBranchCode` | checkbox | LimoQuotationBranchCode |  |
| `vm.settings.documentNos.limoQuotationCodePrefix` | text |  | maxlength=4 |
| `vm.settings.documentNos.limoQuotationCodeNumericPart` | text |  | ng-options=invoiceNumericlength as invoiceNumericlength for invoiceNumericlength in vm.invoiceNumericLengths |
| `vm.settings.userManagement.allowSelfRegistration` | checkbox | AllowSelfRegistration |  |
| `vm.settings.userManagement.isNewRegisteredUserActiveByDefault` | checkbox | IsNewRegisteredUserActiveByDefault |  |
| `vm.settings.userManagement.useCaptchaOnRegistration` | checkbox | UseCaptchaOnRegistration |  |
| `vm.settings.ldap.isEnabled` | checkbox | LdapIsEnabled |  |
| `vm.settings.ldap.domain` | text | LdapDomainName | maxlength=128 |
| `vm.settings.ldap.userName` | text | LdapUserName | maxlength=128 |
| `vm.settings.ldap.password` | password | LdapPassword | maxlength=128 |
| `vm.settings.userManagement.isEmailConfirmationRequiredForLogin` | checkbox | IsEmailConfirmationRequiredForLogin |  |
| `vm.settings.email.defaultFromAddress` | email | DefaultFromAddress | maxlength=256 |
| `vm.settings.email.defaultFromDisplayName` | text | DefaultFromDisplayName | maxlength=128 |
| `vm.settings.email.smtpHost` | text | SmtpHost | maxlength=64 |
| `vm.settings.email.smtpPort` | number | SmtpPort | maxlength=5 |
| `vm.settings.email.smtpEnableSsl` | checkbox | SmtpEnableSsl |  |
| `vm.settings.email.smtpUseDefaultCredentials` | checkbox | SmtpUseDefaultCredentials |  |
| `vm.settings.email.smtpDomain` | text | SmtpDomainName | maxlength=128 |
| `vm.settings.email.smtpUserName` | text | SmtpUserName | maxlength=128 |
| `vm.settings.email.smtpPassword` | password | SmtpPassword | maxlength=128 |
| `vm.settings.salik.tollsSurChargeType` | text |  | ng-options=surcharge.id as surcharge.type for surcharge in vm.tollsSurChargeType |
| `vm.settings.salik.tollsSurCharge` | text | tollsSurCharge |  |
| `vm.settings.salik.tollsInvoice` | text | tollsInvoice | ng-options=invoice.id as invoice.name for invoice in vm.invoicingOptions |
| `vm.settings.salik.tollsCutOffDate` | input | date |  |
| `vm.settings.salik.enableCompanyCode` | checkbox | enableCompanyCodeInSalikAccount |  |
| `vm.settings.salik.dontCreateReceivableOnWorkshopSalik` | checkbox | dontCreateReceivableOnWorkshopSalik |  |
| `vm.settings.salik.dateAsPostingDateSalik` | checkbox | dateAsPostingDateSalik |  |
| `vm.settings.salik.makeAllPostingGroupsOptionalSalik` | checkbox | makeAllPostingGroupsOptionalSalik |  |
| `vm.settings.salik.autoDownloadTollsThroughSDC` | checkbox | dontCreateReceivableOnWorkshopSalik |  |
| `vm.settings.salik.downloadAfterEveryMinute` | input |  | ng-disabled=!vm.settings.salik.autoDownloadTollsThroughSDC |
| `vm.settings.salik.downloadOrReconcileTollsSingleAccount` | checkbox | download/ReconcileTollsForSingleAccountAtATime |  |
| `vm.settings.salik.processSalikTollsInSDC` | checkbox | processSalikTollsInSDC |  |
| `vm.settings.salik.downloadUnchargedSalikTolls` | checkbox | downloadUnchargedSalikTolls |  |
| `vm.settings.salik.isEmailEnabled` | checkbox | isEmailNotifcationEnable |  |
| `vm.settings.salik.sendEmailAfterEveryMinute` | input |  |  |
| `vm.settings.salik.autoProcessAfterDownloading` | checkbox | salik_autoProcessAfterDownloading |  |
| `vm.settings.salik.parkingSurchargeType` | text |  | ng-options=surcharge.id as surcharge.type for surcharge in vm.parkingSurchargeType |
| `vm.settings.salik.parkingSurCharge` | text | parkingSurCharge |  |
| `vm.settings.salik.parkingInvoice` | text | parkingInvoice | ng-options=invoice.id as invoice.name for invoice in vm.invoicingOptions |
| `vm.settings.salik.parkingCutOffDate` | input | date |  |
| `vm.settings.salik.dontCreateReceivableOnWorkshopParking` | checkbox | dontCreateReceivableOnWorkshopParking |  |
| `vm.settings.salik.dateAsPostingDateParking` | checkbox | dateAsPostingDateParking |  |
| `vm.settings.salik.autoDownloadParkingThroughSDC` | checkbox | autoDownloadParkingThroughSDC |  |
| `vm.settings.salik.downloadParkingAfterEveryMinute` | input |  | ng-disabled=!vm.settings.salik.autoDownloadParkingThroughSDC |
| `vm.settings.darb.darbTollsSurChargeType` | text |  | ng-options=surcharge.id as surcharge.type for surcharge in vm.darbTollsSurChargeType |
| `vm.settings.darb.tollsSurCharge` | text | tollsSurCharge |  |
| `vm.settings.darb.tollsInvoice` | text | tollsInvoice | ng-options=invoice.id as invoice.name for invoice in vm.invoicingOptions |
| `vm.settings.darb.tollsCutOffDate` | input | date |  |
| `vm.settings.darb.dontCreateReceivableOnWorkshopDarb` | checkbox | dontCreateReceivableOnWorkshopDarb |  |
| `vm.settings.darb.dateAsPostingDateDarb` | checkbox | dateAsPostingDateDarb |  |
| `vm.settings.darb.makeAllPostingGroupsOptionalDarb` | checkbox | makeAllPostingGroupsOptionalDarb |  |
| `vm.settings.darb.autoDownloadTollsThroughSDC` | checkbox | darbAutoDownloadTollsThroughSDC |  |
| `vm.settings.darb.downloadAfterEveryMinute` | input |  | ng-disabled=!vm.settings.darb.autoDownloadTollsThroughSDC |
| `vm.settings.darb.vehiclePlateNoMapped_EnableApplicableDate` | checkbox | vehiclePlateNoMapped_EnableApplicableDate |  |
| `vm.settings.darb.processDarbTollsInSDC` | checkbox | processDarbTollsInSDC |  |
| `vm.settings.darb.autoProcessAfterDownloading` | checkbox | darb_autoProcessAfterDownloading |  |
| `vm.settings.darb.enableCompanyCode` | checkbox | enableCompanyCodeInDarbAccount |  |
| `vm.settings.darb.isEmailEnabled` | checkbox | isEmailDarbNotifcationEnable |  |
| `vm.settings.darb.sendEmailAfterEveryMinute` | input |  |  |
| `userUaePass.user` | ui-select |  | ng-disabled=vm.settings.fine.downloadingAuthorityType != 1 |
| `userUaePass.uaePass` | text | uaePass | ng-readonly=vm.settings.fine.downloadingAuthorityType != 1 |
| `vm.settings.fine.fineSurchargeType` | text |  | ng-options=surcharge.id as surcharge.type for surcharge in vm.fineSurchargeType |
| `vm.settings.fine.trafficFineSurCharge` | text | trafficFineSurCharge |  |
| `vm.settings.fine.trafficFineInvoice` | text | Invoice | ng-options=invoice.id as invoice.name for invoice in vm.invoicingOptions |
| `vm.settings.fine.trafficFineCutOffDate` | input | date |  |
| `vm.settings.fine.adjustKnowledgeFeeInSurcharge` | checkbox | AdjustKnowledgeFeeInSurcharge |  |
| `vm.settings.fine.downloadFinesOriginalAmountInsteadOfDiscounted` | checkbox | DownloadFinesOriginalAmountInsteadOfDiscounted |  |
| `vm.supplier` | ui-select |  |  |
| `vm.settings.fine.mawaquifFinesAuthorities` | text |  |  |
| `vm.settings.fine.isFineAlertOnAmountLimit` | checkbox | IsFineAlertOnAmountLimit |  |
| `vm.settings.fine.fineAlertOnAmountLimit` | text |  | ng-readonly=!vm.settings.fine.isFineAlertOnAmountLimit; ng-disabled=!vm.settings.fine.isFineAlertOnAmountLimit |
| `vm.settings.fine.isNoOfFinesMoreThanLimit` | checkbox | IsNoOfFinesMoreThanLimit |  |
| `vm.settings.fine.noOfFinesMoreThanLimit` | text |  | ng-disabled=!vm.settings.fine.isNoOfFinesMoreThanLimit; ng-readonly=!vm.settings.fine.isNoOfFinesMoreThanLimit |
| `vm.settings.fine.emailsForSendAlerts` | text |  |  |
| `vm.settings.fine.dontPostIgnoredFines` | checkbox | dontPostIgnoredFines |  |
| `vm.settings.fine.dontCreateReceivableOnStaffForOperationalNRMs` | checkbox | dontCreateReceivableOnStaffForOperationalNRMs |  |
| `vm.settings.fine.dontCreateReceivableOnWorkshop` | checkbox | dontCreateReceivableOnWorkshop |  |
| `vm.settings.fine.dateAsPostingDate` | checkbox | dateAsPostingDate |  |
| `vm.settings.fine.makeAllPostingGroupsOptionalFine` | checkbox | makeAllPostingGroupsOptionalFine |  |
| `vm.settings.fine.downloadPaidFinesOmanAlso` | checkbox | downloadPaidFinesOmanAlso |  |
| `vm.settings.fine.showCustomPlateNo` | text |  |  |
| `vm.settings.fine.shareFinesPDFs` | checkbox | shareFinesPDFs |  |
| `vm.settings.fine.excludeFinesFromSharingOnTheseAuthorities` | text |  |  |
| `vm.settings.fine.reDownloadDiscountedAbuDhabiFines` | checkbox | reDownloadDiscountedAbuDhabiFines |  |
| `vm.settings.fine.reDownloadLateChargesAbuDhabiFines` | checkbox | reDownloadLateChargesAbuDhabiFines |  |
| `vm.settings.fine.autoDownloadDubaiFineThroughSDC` | checkbox | fineAutoDownloadTollsThroughSDC |  |
| `vm.settings.fine.downloadDubaiFineAfterEveryMinute` | input |  | ng-disabled=!vm.settings.fine.autoDownloadDubaiFineThroughSDC |
| `vm.settings.fine.processFinesInSDC` | checkbox | processFinesInSDC |  |
| `vm.settings.fine.autoProcessAfterDownloading` | checkbox | fine_autoProcessAfterDownloading |  |
| `vm.settings.fine.downloadFineDescriptionLocationInEnglish` | checkbox | downloadFineDescriptionLocationInEnglish |  |
| `vm.settings.fine.downloadPayableBlackPointsFinesAsUnPayable` | checkbox | downloadPayableBlackPointsFinesAsUnPayable |  |
| `vm.settings.fine.enableCompanyCode` | checkbox | enableCompanyCodeInTrafficFile |  |
| `vm.settings.fine.downloadDubaiFinesDescriptionInEnglish` | checkbox | downloadDubaiFinesDescriptionInEnglish |  |
| `vm.settings.fuel.downloadAdnocSmartTransactionsfromInvoiceLink` | checkbox | downloadAdnocSmartTransactionsfromInvoiceLink |  |
| `vm.enabledModule` | text |  | ng-options=module.id as module.name for module in vm.modules |
| `setting.chargesTypeId` | select |  | ng-options=chargesType.id as (chargesType.name +' ('+chargesType.key+')') for chargesType in vm.chargesTypesUpdated |
| `setting.rateTypeId` | select |  | ng-options=rateType.id as rateType.name for rateType in vm.rateTypesUpdated; ng-if=vm.enabledModule ==1 \|\| vm.enabledModule ==2 \|\| vm.enabledModule == 5 \|\| vm.enabledModule == 7 \|\| vm.enabledModule == 8 \|\| vm.enabledModule == 9 |
| `setting.applyOnClosing` | checkbox | applyOnClosingForAllCharges | ng-disabled=setting.isStatic\|\|setting.isSeparatInvoice |
| `setting.isMandatory` | checkbox | isMandatoryForAllCharges | ng-disabled=setting.isStatic |
| `setting.taxable` | checkbox | taxableForAllCharges |  |
| `setting.taxRule` | select |  | ng-options=taxRule.id as taxRule.name for taxRule in vm.taxRules; ng-required=true |
| `setting.isSeparatInvoice` | checkbox | isSeparatInvoiceForAllCharges | ng-disabled=!(setting.rateTypeId==6) |
| `vm.paymentGatewaySettings.paymentMethodId` | text |  | ng-options=paymentMethod.id as paymentMethod.name for paymentMethod in vm.StipReceiptPaymentMethods |
| `vm.paymentGatewaySettings.publicKey` | text | PublicKey |  |
| `vm.paymentGatewaySettings.privateKey` | text | PrivateKey |  |
| `vm.paymentGatewaySettings.merchantId` | text | MerchantId |  |
| `vm.paymentGatewaySettings.gatewayUrl` | text | GatewayUrl |  |
| `vm.paymentGatewaySettings.encryptionKey` | text | EncryptionKey |  |
| `vm.paymentGatewaySettings.encryptionKey` | input | EncryptionKey |  |
| `vm.paymentGatewaySettings.bufferAmount` | text | BufferAmount |  |
| `vm.paymentGatewaySettings.noonCreditCardCommission` | text | noonCreditCardCommission |  |
| `vm.settings.limousine.limo_UserDefinedLocations` | checkbox | Limo_UserDefinedLocations |  |
| `vm.settings.limousine.limo_AllowTaxEditingInLimoTrip` | checkbox | Limo_AllowTaxEditingInLimoTrip |  |
| `vm.settings.limousine.limo_RestrictLocationsToTariffLocationsForCorporateCustomers` | checkbox | Limo_RestrictLocationsToTariffLocationsForCorporateCustomers |  |
| `vm.settings.limousine.trip_TrackMileage` | checkbox | trip_TrackMileage |  |
| `vm.settings.limousine.trip_CustomerSignOnFinishTrip` | checkbox | trip_CustomerSignOnFinishTrip |  |
| `vm.settings.limousine.limo_ShowCharges` | checkbox | limo_ShowCharges |  |
| `vm.settings.limousine.cancelTripInvoicing` | checkbox | limo_ShowCharges |  |
| `vm.settings.limousine.allowStatusChangeInTripEditing` | checkbox | AllowStatusChangeInTripEditing |  |
| `vm.settings.limousine.makeDropOffLocationOptionalIfPossible` | checkbox | MakeDropOffLocationOptionalIfPossible |  |
| `vm.settings.limousine.showTripFinishNotesField` | checkbox | ShowTripFinishNotesField |  |
| `vm.settings.limousine.limoDiscount` | checkbox | LimoDiscount |  |
| `vm.settings.limousine.limoCustomField` | checkbox | LimoCustomField |  |
| `vm.settings.limousine.limoCustomField1` | checkbox | LimoCustomField1 |  |
| `vm.settings.limousine.allowTripDispatchSubstatus` | checkbox | AllowTripDispatchSubstatus |  |
| `vm.settings.limousine.selectOnlyAvaialableVehicleInLimoTrip` | checkbox | SelectOnlyAvaialableVehicleInLimoTrip |  |
| `vm.settings.limousine.quantityAndRateInLimo` | checkbox | QuantityAndRateInLimo |  |
| `vm.settings.limousine.noOfTripsInLimo` | checkbox | NoOfTripsInLimo |  |
| `vm.settings.limousine.trip_CanSaveLimoInvoiceWithZeroCharges` | checkbox | trip_CanSaveLimoInvoiceWithZeroCharges |  |
| `vm.settings.limousine.assigningStepForLimoTripBeforeDispatch` | checkbox | AssigningStepForLimoTripBeforeDispatch |  |
| `vm.settings.limousine.showTripNoInEmailSubject` | checkbox | ShowTripNoInEmailSubject |  |
| `vm.settings.limousine.bypassTimeOverlappingValidationDuringDispatching` | checkbox | BypassTimeOverlappingValidationDuringDispatching |  |
| `vm.settings.limousine.manualPickUpAndDropOffDateTime` | checkbox | manualPickUpAndDropOffDateTime |  |
| `vm.settings.limousine.showStaffCarVehiclesInLimousine` | checkbox | ShowStaffCarVehiclesInLimousine |  |
| `vm.settings.limousine.doNotShowTripNoInLimoInvoice` | checkbox | DoNotShowTripNoInLimoInvoice |  |
| `vm.settings.limousine.separateDateAndTime` | checkbox | SeparateDateAndTime |  |
| `vm.settings.limousine.descriptionColumnInChargesCalculator` | checkbox | DescriptionColumnInChargesCalculator |  |
| `vm.settings.limousine.stopAutoInvoicingForIndividualCustomer` | checkbox | StopAutoInvoicingForIndividualCustomer |  |
| `vm.settings.limousine.sendEmailToContactPersonOnTripCreation` | checkbox | SendEmailToContactPersonOnTripCreation |  |
| `vm.settings.limousine.customerExperienceInTripReport` | checkbox | CustomerExperienceInTripReport |  |
| `vm.settings.limousine.monthlyTripHistoryinLimoApp` | checkbox | MonthlyTripHistoryinLimoApp |  |
| `vm.settings.limousine.donotShowExtraFieldsInTrip` | checkbox | DonotShowExtraFieldsInTrip |  |
| `vm.settings.limousine.showActiveDriversOnlyInLimoGrid` | checkbox | ShowActiveDriversOnlyInLimoGrid |  |
| `vm.settings.limousine.donotAllowToFinishTripIfStatusIsChangedFromWeb` | checkbox | DonotAllowToFinishTripIfStatusIsChangedFromWeb |  |
| `vm.settings.limousine.dontRecalculateChargesOnTripFinish` | checkbox | dontRecalculateChargesOnTripFinish |  |
| `vm.settings.limousine.allowVehicleStatusChangeOnTripStartAndDispatched` | checkbox | AllowVehicleStatusChangeOnTripStartAndDispatched |  |
| `vm.settings.limousine.trip_DriverMobileAppAcceptOrReject` | text |  | ng-options=driverMobile.id as driverMobile.Name for driverMobile in vm.driverMobileAcceptOrReject |
| `vm.filters.countryList` | ui-select |  |  |
| `vm.settings.limousine.trip_WhileDispatchingTripAllowOnlySelect` | text |  | ng-options=designation.id as designation.name for designation in vm.designationDetails |
| `vm.settings.limousine.emailTripAdded` | checkbox | generate |  |
| `vm.settings.limousine.emailTripAdded_Customer` | checkbox | generate | ng-disabled=!vm.settings.limousine.emailTripAdded |
| `vm.settings.limousine.emailTripAdded_CustomerCorporate` | checkbox | generate | ng-disabled=!vm.settings.limousine.emailTripAdded |
| `vm.settings.limousine.emailTripAdded_Guest` | checkbox | generate | ng-disabled=!vm.settings.limousine.emailTripAdded |
| `vm.settings.limousine.emailTripAdded_Admin` | checkbox | generate | ng-disabled=!vm.settings.limousine.emailTripAdded |
| `vm.settings.limousine.emailTripModified` | checkbox | generate |  |
| `vm.settings.limousine.emailTripModified_Customer` | checkbox | generate | ng-disabled=!vm.settings.limousine.emailTripModified |
| `vm.settings.limousine.emailTripModified_CustomerCorporate` | checkbox | generate | ng-disabled=!vm.settings.limousine.emailTripModified |
| `vm.settings.limousine.emailTripModified_Guest` | checkbox | generate | ng-disabled=!vm.settings.limousine.emailTripModified |
| `vm.settings.limousine.emailTripModified_Admin` | checkbox | generate | ng-disabled=!vm.settings.limousine.emailTripModified |
| `vm.settings.limousine.emailTripAddedByCustomer` | checkbox | generate |  |
| `vm.settings.limousine.emailTripAddedByCustomer_Customer` | checkbox | generate | ng-disabled=!vm.settings.limousine.emailTripAddedByCustomer |
| `vm.settings.limousine.emailTripAddedByCustomer_CustomerCorporate` | checkbox | generate | ng-disabled=!vm.settings.limousine.emailTripAddedByCustomer |
| `vm.settings.limousine.emailTripAddedByCustomer_Guest` | checkbox | generate | ng-disabled=!vm.settings.limousine.emailTripAddedByCustomer |
| `vm.settings.limousine.emailTripAddedByCustomer_Admin` | checkbox | generate | ng-disabled=!vm.settings.limousine.emailTripAddedByCustomer |
| `vm.settings.limousine.emailTripModifiedByCustomer` | checkbox | generate |  |
| `vm.settings.limousine.emailTripModifiedByCustomer_Customer` | checkbox | generate | ng-disabled=!vm.settings.limousine.emailTripModifiedByCustomer |
| `vm.settings.limousine.emailTripModifiedByCustomer_CustomerCorporate` | checkbox | generate | ng-disabled=!vm.settings.limousine.emailTripModifiedByCustomer |
| `vm.settings.limousine.emailTripModifiedByCustomer_Guest` | checkbox | generate | ng-disabled=!vm.settings.limousine.emailTripModifiedByCustomer |
| `vm.settings.limousine.emailTripModifiedByCustomer_Admin` | checkbox | generate | ng-disabled=!vm.settings.limousine.emailTripModifiedByCustomer |
| `vm.settings.limousine.emailTripDispatched` | checkbox | generate |  |
| `vm.settings.limousine.emailTripDispatched_Customer` | checkbox | generate | ng-disabled=!vm.settings.limousine.emailTripDispatched |
| `vm.settings.limousine.emailTripDispatched_CustomerCorporate` | checkbox | generate | ng-disabled=!vm.settings.limousine.emailTripDispatched |
| `vm.settings.limousine.emailTripDispatched_Guest` | checkbox | generate | ng-disabled=!vm.settings.limousine.emailTripDispatched |
| `vm.settings.limousine.emailTripDispatched_Admin` | checkbox | generate | ng-disabled=!vm.settings.limousine.emailTripDispatched |
| `vm.settings.limousine.emailTripAccepted` | checkbox | generate |  |
| `vm.settings.limousine.emailTripAccepted_Customer` | checkbox | generate | ng-disabled=!vm.settings.limousine.emailTripAccepted |
| `vm.settings.limousine.emailTripAccepted_CustomerCorporate` | checkbox | generate | ng-disabled=!vm.settings.limousine.emailTripAccepted |
| `vm.settings.limousine.emailTripAccepted_Guest` | checkbox | generate | ng-disabled=!vm.settings.limousine.emailTripAccepted |
| `vm.settings.limousine.emailTripAccepted_Admin` | checkbox | generate | ng-disabled=!vm.settings.limousine.emailTripAccepted |
| `vm.settings.limousine.emailTripRejected` | checkbox | generate |  |
| `vm.settings.limousine.emailTripRejected_Customer` | checkbox | generate | ng-disabled=!vm.settings.limousine.emailTripRejected |
| `vm.settings.limousine.emailTripRejected_CustomerCorporate` | checkbox | generate | ng-disabled=!vm.settings.limousine.emailTripRejected |
| `vm.settings.limousine.emailTripRejected_Guest` | checkbox | generate | ng-disabled=!vm.settings.limousine.emailTripRejected |
| `vm.settings.limousine.emailTripRejected_Admin` | checkbox | generate | ng-disabled=!vm.settings.limousine.emailTripRejected |
| `vm.settings.limousine.emailTripNoShow` | checkbox | generate |  |
| `vm.settings.limousine.emailTripNoShow_Customer` | checkbox | generate | ng-disabled=!vm.settings.limousine.emailTripNoShow |
| `vm.settings.limousine.emailTripNoShow_CustomerCorporate` | checkbox | generate | ng-disabled=!vm.settings.limousine.emailTripNoShow |
| `vm.settings.limousine.emailTripNoShow_Guest` | checkbox | generate | ng-disabled=!vm.settings.limousine.emailTripNoShow |
| `vm.settings.limousine.emailTripNoShow_Admin` | checkbox | generate | ng-disabled=!vm.settings.limousine.emailTripNoShow |
| `vm.settings.limousine.emailTripStarted` | checkbox | generate |  |
| `vm.settings.limousine.emailTripStarted_Customer` | checkbox | generate | ng-disabled=!vm.settings.limousine.emailTripStarted |
| `vm.settings.limousine.emailTripStarted_CustomerCorporate` | checkbox | generate | ng-disabled=!vm.settings.limousine.emailTripStarted |
| `vm.settings.limousine.emailTripStarted_Guest` | checkbox | generate | ng-disabled=!vm.settings.limousine.emailTripStarted |
| `vm.settings.limousine.emailTripStarted_Admin` | checkbox | generate | ng-disabled=!vm.settings.limousine.emailTripStarted |
| `vm.settings.limousine.emailTripFinished` | checkbox | generate |  |
| `vm.settings.limousine.emailTripFinished_Customer` | checkbox | generate | ng-disabled=!vm.settings.limousine.emailTripFinished |
| `vm.settings.limousine.emailTripFinished_CustomerCorporate` | checkbox | generate | ng-disabled=!vm.settings.limousine.emailTripFinished |
| `vm.settings.limousine.emailTripFinished_Guest` | checkbox | generate | ng-disabled=!vm.settings.limousine.emailTripFinished |
| `vm.settings.limousine.emailTripFinished_Admin` | checkbox | generate | ng-disabled=!vm.settings.limousine.emailTripFinished |
| `vm.settings.limousine.emailTripCanceled` | checkbox | generate |  |
| `vm.settings.limousine.emailTripCanceled_Customer` | checkbox | generate | ng-disabled=!vm.settings.limousine.emailTripCanceled |
| `vm.settings.limousine.emailTripCanceled_CustomerCorporate` | checkbox | generate | ng-disabled=!vm.settings.limousine.emailTripCanceled |
| `vm.settings.limousine.emailTripCanceled_Guest` | checkbox | generate | ng-disabled=!vm.settings.limousine.emailTripCanceled |
| `vm.settings.limousine.emailTripCanceled_Admin` | checkbox | generate | ng-disabled=!vm.settings.limousine.emailTripCanceled |
| `vm.settings.limousine.adminEmailAddress` | text | adminEmailAddress |  |
| `vm.settings.limousine.limoBookingEmailNotification` | text | limoBookingEmailNotification |  |
| `vm.settings.limousine.warnIfNoOfTripsExceedInDay` | text | warnIfNoOfTripsExceedInDay |  |
| `vm.settings.limousine.warnIfNoOfTripsExceedInAnHour` | text | warnIfNoOfTripsExceedInAnHour |  |
| `vm.settings.limousine.manualTripNoEnabled` | checkbox | manualTripNoEnabled |  |
| `vm.settings.limousine.additionalDriverWithTrip` | checkbox | additionalDriverWithTrip |  |
| `vm.settings.limousine.flightDetailEnabled` | checkbox | flightDetailEnabled |  |
| `vm.settings.limousine.noOfPersonsEnabled` | checkbox | noOfPersonsEnabled |  |
| `vm.settings.limousine.pickUpAddress` | checkbox | pickUpAddress |  |
| `vm.settings.limousine.dropOffAddress` | checkbox | dropOffAddress |  |
| `vm.settings.limousine.isOutOfCityPickUpLocation` | checkbox | isOutOfCityPickUpLocation |  |
| `vm.settings.limousine.isOutOfCityDropOffLocation` | checkbox | isOutOfCityDropOffLocation |  |
| `vm.settings.limousine.trip_DoNotShowCustomFieldsOnMobileApp` | checkbox | trip_DoNotShowCustomFieldsOnMobileApp |  |
| `vm.settings.limousine.trip_EnableCustomField1` | checkbox | trip_EnableCustomField1 | ng-disabled=vm.settings.limousine.trip_DoNotShowCustomFieldsOnMobileApp; ng-readonly=vm.settings.limousine.trip_DoNotShowCustomFieldsOnMobileApp |
| `vm.settings.limousine.trip_CustomField1Type` | text |  | ng-options=trip.id as trip.type for trip in vm.tripOptions; ng-disabled=!vm.settings.limousine.trip_EnableCustomField1 |
| `vm.settings.limousine.trip_EnableCustomField2` | checkbox | trip_EnableCustomField2 | ng-disabled=vm.settings.limousine.trip_DoNotShowCustomFieldsOnMobileApp; ng-readonly=vm.settings.limousine.trip_DoNotShowCustomFieldsOnMobileApp |
| `vm.settings.limousine.trip_CustomField2Type` | text |  | ng-options=trip.id as trip.type for trip in vm.tripOptions; ng-disabled=!vm.settings.limousine.trip_EnableCustomField2 |
| `vm.settings.limousine.trip_EnableCustomField3` | checkbox | trip_EnableCustomField3 | ng-disabled=vm.settings.limousine.trip_DoNotShowCustomFieldsOnMobileApp; ng-readonly=vm.settings.limousine.trip_DoNotShowCustomFieldsOnMobileApp |
| `vm.settings.limousine.trip_CustomField3Type` | text |  | ng-options=trip.id as trip.type for trip in vm.tripOptions; ng-disabled=!vm.settings.limousine.trip_EnableCustomField3 |
| `vm.settings.limousine.prepaymentMandatoryForTripCreatedThroughCorporateLogin` | checkbox | prepaymentMandatoryForTripCreatedThroughCorporateLogin |  |
| `vm.settings.limousine.prepaymentMandatoryForTripCreatedByDriverThroughMobileApp` | checkbox | prepaymentMandatoryForTripCreatedByDriverThroughMobileApp |  |
| `vm.settings.limousine.enableDriverCommissionForTrips` | checkbox | enableDriverCommissionForTrips |  |
| `grid.visible` | checkbox | grid |  |
| `vm.settings.equipment.isTimeSheetMandatoryForRentalInvoicing` | checkbox | IsTimeSheetMandatoryForRentalInvoicing |  |
| `vm.settings.costCenter.costCenterGroup1Required` | checkbox | costCenterGroup1Required |  |
| `vm.settings.costCenter.defaultCostCenterIdGroup1` | select |  | ng-options=item.id as item.name for item in vm.costCentersGroup1 |
| `vm.settings.costCenter.costCenterGroup2Required` | checkbox | costCenterGroup2Required |  |
| `vm.settings.costCenter.costCenterGroup2ForEquipmentRentalModule` | select |  | ng-options=item.id as item.name for item in vm.costCentersGroup2 |
| `vm.settings.costCenter.costCenterForExternalVehicle` | select |  | ng-options=item.id as item.name for item in vm.costCentersGroup2 |
| `vm.settings.email.defaultFromAddress` | email | DefaultFromAddress | maxlength=256 |
| `vm.settings.email.defaultFromDisplayName` | text | DefaultFromDisplayName | maxlength=128 |
| `vm.settings.email.smtpHost` | text | SmtpHost | maxlength=64 |
| `vm.settings.email.smtpPort` | number | SmtpPort | maxlength=5 |
| `vm.settings.email.smtpEnableSsl` | checkbox | SmtpEnableSsl |  |
| `vm.settings.email.smtpUseDefaultCredentials` | checkbox | SmtpUseDefaultCredentials |  |
| `vm.settings.email.smtpDomain` | text | SmtpDomainName | maxlength=128 |
| `vm.settings.email.smtpUserName` | text | SmtpUserName | maxlength=128 |
| `vm.settings.email.smtpPassword` | password | SmtpPassword | maxlength=128 |
| `vm.testEmailAddress` | text |  |  |
| `email.sender` | text | Sender | maxlength=64 |
| `email.defaultFromAddress` | email | DefaultFromAddress | maxlength=256 |
| `email.defaultFromDisplayName` | text | DefaultFromDisplayName | maxlength=128 |
| `email.smtpHost` | text | SmtpHost | maxlength=64 |
| `email.smtpPort` | number | SmtpPort | maxlength=5 |
| `email.smtpEnableSsl` | checkbox | SmtpEnableSslM_{{$index}} |  |
| `email.smtpUseDefaultCredentials` | checkbox | SmtpUseDefaultCredentialsM_{{$index}} |  |
| `email.smtpDomain` | text | SmtpDomainName | maxlength=128 |
| `email.smtpUserName` | text | SmtpUserName | maxlength=128 |
| `email.smtpPassword` | password | SmtpPassword | maxlength=128 |
| `email.testEmailAddress` | text |  |  |
| `vm.settings.requiredFieds.isFirstNameRequired` | checkbox | isFirstNameRequired |  |
| `vm.settings.requiredFieds.isMiddleNameRequired` | checkbox | isMiddleNameRequired |  |
| `vm.settings.requiredFieds.isLastNameRequired` | checkbox | isLastNameRequired |  |
| `vm.settings.requiredFieds.isGenderRequired` | checkbox | isGenderRequired |  |
| `vm.settings.requiredFieds.isEmailRequired` | checkbox | isEmailRequired |  |
| `vm.settings.requiredFieds.isNationalityRequired` | checkbox | isNationalityRequired |  |
| `vm.settings.requiredFieds.isCompanyRequired` | checkbox | isCompanyRequired |  |
| `vm.settings.requiredFieds.isNextOfKinNameRequired` | checkbox | isNextOfKinNameRequired |  |
| `vm.settings.requiredFieds.isNextOfKinContactNoRequired` | checkbox | isNextOfKinContactNoRequired |  |
| `vm.settings.requiredFieds.isMobileNoRequired` | checkbox | isMobileNoRequired |  |
| `vm.settings.requiredFieds.isTelephoneHomeRequired` | checkbox | isTelephoneHomeRequired |  |
| `vm.settings.requiredFieds.isTelephoneWorkRequired` | checkbox | isTelephoneWorkRequired |  |
| `vm.settings.requiredFieds.isAddressNoRequired` | checkbox | isAddressNoRequired |  |
| `vm.settings.requiredFieds.isCityRequired` | checkbox | isCityRequired |  |
| `vm.settings.requiredFieds.isStateRequired` | checkbox | isStateRequired |  |
| `vm.settings.requiredFieds.isZipCodeRequired` | checkbox | isZipCodeRequired |  |
| `vm.settings.requiredFieds.isCountryRequired` | checkbox | isCountryRequired |  |
| `vm.settings.requiredFieds.isDrivingExperienceRequired` | checkbox | isDrivingExperienceRequired |  |
| `vm.settings.requiredFieds.isSalesPersonRequired` | checkbox | isSalesPersonRequired |  |
| `vm.settings.requiredFieds.isNationalIdRequired` | checkbox | isNationalIdRequired |  |
| `vm.settings.requiredFieds.isCodeRequired` | checkbox | isCodeRequired |  |
| `vm.settings.requiredFieds.isDriverLicenseRequired` | checkbox | isDriverLicenseRequired |  |
| `vm.settings.requiredFieds.isReferralNameRequired` | checkbox | isReferralNameRequired |  |
| `vm.settings.requiredFieds.isReferralContactNoRequired` | checkbox | isReferralContactNoRequired |  |
| `vm.settings.requiredFieds.doNotAllowDuplicateNationalId` | checkbox | doNotAllowDuplicateNationalId |  |
| `vm.settings.requiredFieds.isResidenceStatusRequired` | checkbox | isResidenceStatusRequired |  |
| `vm.settings.requiredFieds.isDateOfBirthFeildRequired` | checkbox | isDateOfBirthFeildRequired |  |
| `vm.settings.requiredFieds.minimumAgeRequired` | text | MinimumAgeRequired |  |
| `vm.isDateOfBirthRequired` | radio | IsDateOfBirthRequired |  |
| `vm.isDateOfBirthRequired` | radio | isAgeRequired |  |
| `vm.settings.requiredFieds.isVipCustomer` | checkbox | isVipCustomer |  |
| `vm.settings.requiredFieds.isLoyalityNumber` | checkbox | isLoyalityNo |  |
| `vm.settings.requiredFieds.isReferralRequired` | checkbox | isReferral |  |
| `vm.settings.requiredFieds.individualCustomerCustomField4` | checkbox | individualCustomerCustomField4 |  |
| `vm.settings.requiredFieds.isBusinessSourceBroker` | checkbox | isBusinessSourceBroker |  |
| `vm.settings.requiredFieds.isBusinessSourceBroker_CustomFieldType` | text |  | ng-options=broker.id as broker.type for broker in vm.businessSourceBrokerOptions; ng-disabled=!vm.settings.requiredFieds.isBusinessSourceBroker |
| `vm.settings.requiredFieds.isCardLast4DigitsOnly` | checkbox | isCardLast4DigitsOnly |  |
| `vm.settings.requiredFieds.isCvv` | checkbox | isCvv |  |
| `vm.settings.requiredFieds.residenceStatus` | checkbox | residenceStatus |  |
| `vm.settings.requiredFieds.showCreationDateForIndividualCustomer` | checkbox | showCreationDateForIndividualCustomer |  |
| `vm.settings.requiredFieds.companyCustomerSalesPerson` | checkbox | companyCustomerSalesPerson |  |
| `vm.settings.requiredFieds.isTradeLicenseRequired` | checkbox | isTradeLicenseRequired |  |
| `vm.settings.requiredFieds.companyCustomerTRN` | checkbox | companyCustomerTRN |  |
| `vm.settings.requiredFieds.companyCustomerCustomField4` | checkbox | companyCustomerCustomField4 |  |
| `vm.settings.requiredFieds.showCreationDateForCompanyCustomer` | checkbox | showCreationDateForCompanyCustomer |  |
| `vm.settings.requiredFieds.vehicleLocation` | checkbox | vehicleYear |  |
| `vm.settings.requiredFieds.vehicleYear` | checkbox | vehicleYear |  |
| `vm.settings.requiredFieds.vehicleChassisNo` | checkbox | vehicleChassisNo |  |
| `vm.settings.requiredFieds.vehicleEngineNo` | checkbox | vehicleEngineNo |  |
| `vm.settings.requiredFieds.vehicleEngineCapacity` | checkbox | vehicleEngineCapacity |  |
| `vm.settings.requiredFieds.vehicleKMs` | checkbox | vehicleKMs |  |
| `vm.settings.requiredFieds.vehicleInteriorColor` | checkbox | vehicleInteriorColor |  |
| `vm.settings.requiredFieds.vehicleExteriorColor` | checkbox | vehicleExteriorColor |  |
| `vm.settings.requiredFieds.isFuelTankCapacity` | checkbox | isFuelTankCapacity |  |
| `vm.settings.requiredFieds.vehicleETag` | checkbox | vehicleETag |  |
| `vm.settings.requiredFieds.vehicleACRISSCode` | checkbox | vehicleACRISSCode |  |
| `vm.settings.requiredFieds.vehicleType` | checkbox | vehicleType |  |
| `vm.settings.requiredFieds.vehicleFleetType` | checkbox | vehicleFleetType |  |
| `vm.settings.requiredFieds.vehicleOwnership` | checkbox | vehicleOwnership |  |
| `vm.settings.requiredFieds.vehicleReturnDate` | checkbox | vehicleReturnDate |  |
| `vm.settings.requiredFieds.vehiclePurchaseDate` | checkbox | vehiclePurchaseDate |  |
| `vm.settings.requiredFieds.vehicleRegistrationDate` | checkbox | vehicleRegistrationDate |  |
| `vm.settings.requiredFieds.vehicleNextRegistrationDate` | checkbox | vehicleNextRegistrationDate |  |
| `vm.settings.requiredFieds.vehicleInsurancePolicyNumber` | checkbox | vehicleInsurancePolicyNumber |  |
| `vm.settings.requiredFieds.vehicleWarrantyInKms` | checkbox | vehicleWarrantyInKms |  |
| `vm.settings.requiredFieds.vehicleWarrantyInMonths` | checkbox | vehicleWarrantyInMonths |  |
| `vm.settings.requiredFieds.vehicleCustomField1Required` | checkbox | vehicleCustomField1Required |  |
| `vm.settings.requiredFieds.vehicleCustomField2Required` | checkbox | vehicleCustomField2Required |  |
| `vm.settings.requiredFieds.vehicleCustomField3Required` | checkbox | vehicleCustomField3Required |  |
| `vm.settings.requiredFieds.vehicleNextVehicleCustomAlert1` | checkbox | vehicleNextVehicleCustomAlert1 |  |
| `vm.settings.requiredFieds.vehicleNextVehicleCustomAlert2` | checkbox | vehicleNextVehicleCustomAlert2 |  |
| `vm.settings.requiredFieds.vehicleNotes` | checkbox | vehicleNotes |  |
| `vm.settings.requiredFieds.isInsuranceDates` | checkbox | IsInsuranceDates |  |
| `vm.settings.requiredFieds.requiredExternalVehicleOwner` | checkbox | requiredExternalVehicleOwner |  |
| `vm.settings.requiredFieds.requiredTrafficFileIdForOwnVehicle` | checkbox | requiredTrafficFileIdForOwnVehicle |  |
| `vm.settings.requiredFieds.showVehicleCost` | checkbox | requiredShowVehicleCost |  |
| `vm.settings.requiredFieds.vehicleAccidentImagesMandatory` | checkbox | requiredVehicleAccidentImagesMandatory |  |
| `vm.settings.requiredFieds.vehicle_EnableCustomField1` | checkbox | vehicle_EnableCustomField1 |  |
| `vm.settings.requiredFieds.vehicle_EnableCustomField2` | checkbox | vehicle_EnableCustomField2 |  |
| `vm.settings.requiredFieds.vehicle_EnableCustomField3` | checkbox | vehicle_EnableCustomField3 |  |
| `vm.settings.requiredFieds.vehicle_CustomAlert1` | checkbox | vehicle_CustomAlert1 |  |
| `vm.settings.requiredFieds.vehicle_CustomAlert2` | checkbox | vehicle_CustomAlert2 |  |
| `vm.settings.requiredFieds.additionalExternalVehicleOwner` | checkbox | additionalExternalVehicleOwner |  |
| `vm.settings.requiredFieds.showOnlyFewerDetailForVehicle` | checkbox | showOnlyFewerDetailForVehicle |  |
| `vm.settings.requiredFieds.showOnlyFewerDetailForVehicleType` | checkbox | showOnlyFewerDetailForVehicleType |  |
| `vm.settings.requiredFieds.investor` | checkbox | investor |  |
| `vm.settings.requiredFieds.mortgage` | checkbox | mortgage |  |
| `vm.settings.requiredFieds.gPSLocationColoumnInVehicle` | checkbox | GPSLocationColoumnInVehicle |  |
| `vm.settings.requiredFieds.leaseToOwn` | checkbox | leaseToOwn |  |
| `vm.settings.requiredFieds.markAsLegal` | checkbox | MarkAsLegal |  |
| `vm.settings.requiredFieds.purchasePrice` | checkbox | PurchasePrice |  |
| `vm.settings.requiredFieds.isAdvancePaymentRequired` | checkbox | isAdvancePaymentRequired |  |
| `vm.settings.requiredFieds.isReturnDateRequired` | checkbox | IsReturnDateRequired |  |
| `vm.settings.requiredFieds.isDepositPaymentRequired` | checkbox | isDepositPaymentRequired |  |
| `vm.settings.requiredFieds.isInsuranceCompanyAndClaimNoRequired` | checkbox | IsInsuranceCompanyAndClaimNoRequired |  |
| `vm.settings.requiredFieds.expectedEndDate` | checkbox | ExpectedEndDate |  |
| `vm.settings.requiredFieds.securityDepositDefaultExpiryDays` | text | securityDepositDefaultExpiryDays |  |
| `vm.settings.requiredFieds.vehicleFleetManagerMail` | text | VehicleFleetManagerMail |  |
| `vm.settings.requiredFieds.isReason` | checkbox | isReason |  |
| `vm.settings.requiredFieds.isReasonNote` | checkbox | isReasonNote |  |
| `vm.settings.requiredFieds.isEmployeeselectionisoptionalforControlAccounts` | checkbox | isEmployeeselectionisoptionalforControlAccounts |  |
| `vm.settings.requiredFieds.isCostCenterForJvRequired` | checkbox | isCostCenterForJvRequired |  |
| `vm.settings.requiredFieds.agreementNoFieldInJV` | checkbox | AgreementNoFieldInJV |  |
| `vm.settings.requiredFieds.isCostCenterForBillRequired` | checkbox | isCostCenterForBillRequired |  |
| `vm.settings.requiredFieds.isCustomFieldOneIsMandotoryInBill` | checkbox | isCustomFieldOneIsMandotoryInBill |  |
| `vm.settings.requiredFieds.agreementNoFieldInGeneralBill` | checkbox | agreementNoFieldInGeneralBill |  |
| `vm.settings.requiredFieds.paidToInBills` | checkbox | paidToInBills |  |
| `vm.settings.requiredFieds.isCostCenterForPaymentRequired` | checkbox | isCostCenterForPaymentRequired |  |
| `vm.settings.requiredFieds.agreementNoFieldInGeneralAndPettyCashPayments` | checkbox | agreementNoFieldInGeneralAndPettyCashPayments |  |
| `vm.settings.requiredFieds.paidToInPayments` | checkbox | paidToInPayments |  |
| `vm.settings.requiredFieds.makePONotesUnique` | checkbox | MakePONotesUnique |  |
| `vm.settings.requiredFieds.poHideDescription` | checkbox | PoHideDescription |  |
| `vm.settings.requiredFieds.poCustomFeild1` | checkbox | PoCustomFeild1 |  |
| `vm.settings.requiredFieds.poCustomFeild2` | checkbox | PoCustomFeild2 |  |
| `vm.settings.requiredFieds.poCustomFeild3` | checkbox | PoCustomFeild3 |  |
| `vm.settings.requiredFieds.poCustomFeild4` | checkbox | PoCustomFeild4 |  |
| `vm.settings.requiredFieds.poCustomDate` | checkbox | PoCustomDate |  |
| `vm.settings.requiredFieds.poCustomFeild5` | checkbox | PoCustomFeild5 |  |
| `vm.settings.requiredFieds.poCustomFeild6` | checkbox | PoCustomFeild6 |  |
| `vm.settings.requiredFieds.poCustomFeild7` | checkbox | PoCustomFeild7 |  |
| `vm.settings.requiredFieds.poCustomFeildInVoucherLines` | checkbox | PoCustomFeildInVoucherLines |  |
| `vm.settings.requiredFieds.showSupplierBankDetails` | checkbox | ShowSupplierBankDetails |  |
| `vm.settings.requiredFieds.isContactPerson` | checkbox | IsContactPerson |  |
| `vm.settings.requiredFieds.isCreditPeriod` | checkbox | IsCreditPeriod |  |
| `vm.settings.requiredFieds.showExpiryDateofDocumentsInStaff` | checkbox | ShowExpiryDateofDocumentsInStaff |  |
| `vm.settings.requiredFieds.invoice_Commision` | checkbox | vehicle_EnableCustomField2 |  |
| `vm.settings.requiredFieds.postFinancialEffectOfCommision` | checkbox | postFinancialEffectOfCommision |  |
| `vm.settings.requiredFieds.invoiceTermsAndConditionsNotes` | checkbox | invoiceTermsAndConditionsNotes |  |
| `vm.settings.requiredFieds.expectedReturnDate` | checkbox | expectedReturnDate |  |
| `vm.settings.requiredFieds.isVehicleMakeAndModelRequired` | checkbox | isVehicleMakeAndModelRequired |  |
| `vm.settings.requiredFieds.isExternalAccountCodeEnabled` | checkbox | isExternalAccountCodeEnabled |  |
| `vm.settings.requiredFieds.vehicleQualityCheckReportMandatoryForJobClosing` | checkbox |  |  |
| `vm.settings.requiredFieds.addCategoriesInJob` | checkbox |  |  |
| `vm.settings.requiredFieds.returnReasonMandatoryForItemReturn` | checkbox |  |  |
| `vm.settings.requiredFieds.simplePurchaseRequest` | checkbox |  |  |
| `vm.settings.requiredFieds.rentalQuotation_CustomField1` | checkbox |  |  |
| `vm.settings.requiredFieds.rentalQuotation_CustomField2` | checkbox |  |  |
| `vm.settings.requiredFieds.rentalQuotation_CustomField3` | checkbox |  |  |
| `vm.settings.requiredFieds.rentalQuotation_CustomField4` | checkbox |  |  |
| `vm.settings.requiredFieds.rentalQuotation_DateCustomField1` | checkbox |  |  |
| `vm.settings.requiredFieds.rentalQuotation_DateCustomField2` | checkbox |  |  |
| `vm.settings.requiredFieds.rentalQuotation_DateCustomField3` | checkbox |  |  |
| `vm.settings.requiredFieds.leaseInquiry_CustomField1` | checkbox |  |  |
| `vm.settings.requiredFieds.limoQuotation_ContactPersonName` | checkbox |  |  |
| `vm.settings.requiredFieds.limoQuotation_PaymentMethod` | checkbox |  |  |
| `vm.settings.requiredFieds.limoQuotation_PaymentTerms` | checkbox |  |  |
| `vm.settings.requiredFieds.limoQuotation_PickUpDateTime` | checkbox |  |  |
| `vm.settings.requiredFieds.limoQuotation_DropOffDateTime` | checkbox |  |  |
| `vm.settings.requiredFieds.mandatoryBatchNoCP` | checkbox |  |  |
| `vm.settings.requiredFieds.additionalBatchNoCP` | checkbox |  |  |
| `vm.settings.requiredFieds.mandatoryBatchNoCR` | checkbox |  |  |
| `vm.settings.requiredFieds.additionalBatchNoCR` | checkbox |  |  |
| `vm.settings.requiredFieds.commissionForBankTransfer` | checkbox |  |  |
| `vm.settings.requiredFieds.showPaymentMethodDetailsInExportToExcel` | checkbox |  |  |
| `vm.settings.requiredFieds.allowDuplicateManualBookingNo` | checkbox |  |  |
| `vm.settings.speedNotification.ccCheckCardTo` | email | ccCheckCardTo |  |
| `vm.settings.speedNotification.rentalIndividual` | checkbox | RentalIndividual |  |
| `vm.settings.speedNotification.rentalCompanies` | checkbox | RentalCompanies |  |
| `vm.settings.speedNotification.limoIndividual` | checkbox | LimoIndividual |  |
| `vm.settings.speedNotification.limoCompanies` | checkbox | LimoCompanies |  |
| `vm.settings.speedNotification.fineIndividual` | checkbox | FineIndividual |  |
| `vm.settings.speedNotification.fineCompanies` | checkbox | FineCompanies |  |
| `vm.settings.speedNotification.tollIndividual` | checkbox | TollIndividual |  |
| `vm.settings.speedNotification.tollCompanies` | checkbox | TollCompanies |  |
| `vm.settings.speedNotification.miscIndividual` | checkbox | MiscIndividual |  |
| `vm.settings.speedNotification.miscCompanies` | checkbox | MiscCompanies |  |
| `vm.settings.speedNotification.leaseIndividual` | checkbox | LeaseIndividual |  |
| `vm.settings.speedNotification.leaseCompanies` | checkbox | LeaseCompanies |  |
| `vm.settings.speedNotification.transportationIndividual` | checkbox | TransportationIndividual |  |
| `vm.settings.speedNotification.transportationCompanies` | checkbox | TransportationCompanies |  |
| `vm.settings.speedNotification.emailOnAgreementOpening` | checkbox | generate |  |
| `vm.settings.speedNotification.emailOnAgreementClosing` | checkbox | emailOnAgreementClosing |  |
| `vm.settings.speedNotification.emailCheckCard` | checkbox | emailCheckCard |  |
| `vm.settings.speedNotification.emailSOA` | checkbox | emailSOA |  |
| `vm.settings.speedNotification.emailFineInvoice` | checkbox | emailFineInvoice |  |
| `vm.settings.speedNotification.emailFineAuto` | checkbox | emailFineAuto |  |
| `vm.settings.speedNotification.emailAlerts` | checkbox | emailAlerts |  |
| `vm.settings.speedNotification.smsRentalInvoice` | checkbox | smsRentalInvoice |  |
| `vm.settings.speedNotification.smsLeaseInvoice` | checkbox | smsLeaseInvoice |  |
| `vm.settings.speedNotification.smsFineInvoice` | checkbox | smsFineInvoice |  |
| `vm.settings.speedNotification.smsTollsInvoice` | checkbox | smsTollsInvoice |  |
| `vm.settings.speedNotification.smsMiscInvoice` | checkbox | smsMiscInvoice |  |
| `vm.settings.speedNotification.smsOverduePayment` | checkbox | smsOverduePayment |  |
| `vm.settings.speedNotification.whatsAppSMSRentalInvoice` | checkbox | whatsAppSMSRentalInvoice |  |
| `vm.settings.speedNotification.whatsAppSMSLeaseInvoice` | checkbox | whatsAppSMSLeaseInvoice |  |
| `vm.settings.speedNotification.whatsAppSMSFineInvoice` | checkbox | whatsAppSMSFineInvoice |  |
| `vm.settings.speedNotification.whatsAppSMSTollsInvoice` | checkbox | whatsAppSMSTollsInvoice |  |
| `vm.settings.speedNotification.whatsAppSMSMiscInvoice` | checkbox | whatsAppSMSMiscInvoice |  |
| `vm.settings.speedNotification.whatsAppSMSOverduePayment` | checkbox | whatsAppSMSOverduePayment |  |
| `vm.settings.speedNotification.customEmailOrWhatsAppSMSAuto` | checkbox | CustomEmailOrWhatsAppSMSAuto |  |
| `vm.settings.speedNotification.customEmailOrWhatsAppSMSManual` | checkbox | CustomEmailOrWhatsAppSMSManual |  |
| `vm.settings.speedNotification.emailOrWhatsappSMSInReceiptAmountGreaterThanX` | text | ServiceVehicleBookingEmail |  |
| `vm.settings.speedNotification.managerPhoneNoInReceiptAmountGreaterThanX` | text | ServiceVehicleBookingEmail |  |
| `vm.settings.speedNotification.managerEmailInReceiptAmountGreaterThanX` | text | ServiceVehicleBookingEmail |  |
| `vm.settings.speedNotification.emailOrWhatsappSMSInPaymentAmountGreaterThanX` | text | ServiceVehicleBookingEmail |  |
| `vm.settings.speedNotification.managerPhoneNoInPaymentAmountGreaterThanX` | text | ServiceVehicleBookingEmail |  |
| `vm.settings.speedNotification.managerEmailInPaymentAmountGreaterThanX` | text | ServiceVehicleBookingEmail |  |
| `vm.settings.speedNotification.workShopMaintenanceManagerPhoneNo` | text | workShopMaintenanceManagerPhoneNo |  |
| `vm.settings.speedNotification.workShopMaintenanceManagerEmail` | text | workShopMaintenanceManagerEmail |  |
| `vm.settings.speedNotification.workShopGMPhoneNo` | text | workShopGMPhoneNo |  |
| `vm.settings.speedNotification.whatsAppUtilityTemplates` | checkbox | WhatsAppUtilityTemplates |  |
| `vm.settings.speedNotification.emailBookingCreatedByAdmin` | checkbox | generate |  |
| `vm.settings.speedNotification.emailBookingCreatedByAdmin_Customer` | checkbox | generate | ng-disabled=!vm.settings.speedNotification.emailBookingCreatedByAdmin |
| `vm.settings.speedNotification.emailBookingCreatedByAdmin_Admin` | checkbox | generate | ng-disabled=!vm.settings.speedNotification.emailBookingCreatedByAdmin |
| `vm.settings.speedNotification.emailBookingCreatedByCustomer` | checkbox | generate |  |
| `vm.settings.speedNotification.emailBookingCreatedByCustomer_Customer` | checkbox | generate | ng-disabled=!vm.settings.speedNotification.emailBookingCreatedByCustomer |
| `vm.settings.speedNotification.emailBookingCreatedByCustomer_Admin` | checkbox | generate | ng-disabled=!vm.settings.speedNotification.emailBookingCreatedByCustomer |
| `vm.settings.speedNotification.emailbookingModifiedByAdmin` | checkbox | generate |  |
| `vm.settings.speedNotification.emailbookingModifiedByAdmin_Customer` | checkbox | generate | ng-disabled=!vm.settings.speedNotification.emailbookingModifiedByAdmin |
| `vm.settings.speedNotification.emailbookingModifiedByAdmin_Admin` | checkbox | generate | ng-disabled=!vm.settings.speedNotification.emailbookingModifiedByAdmin |
| `vm.settings.speedNotification.emailBookingModifiedByCustomer` | checkbox | generate |  |
| `vm.settings.speedNotification.emailBookingModifiedByCustomer_Customer` | checkbox | generate | ng-disabled=!vm.settings.speedNotification.emailBookingModifiedByCustomer |
| `vm.settings.speedNotification.emailBookingModifiedByCustomer_Admin` | checkbox | generate | ng-disabled=!vm.settings.speedNotification.emailBookingModifiedByCustomer |
| `vm.settings.speedNotification.emailBookingCancelledByAdmin` | checkbox | generate |  |
| `vm.settings.speedNotification.emailBookingCancelledByAdmin_Customer` | checkbox | generate | ng-disabled=!vm.settings.speedNotification.emailBookingCancelledByAdmin |
| `vm.settings.speedNotification.emailBookingCancelledByAdmin_Admin` | checkbox | generate | ng-disabled=!vm.settings.speedNotification.emailBookingCancelledByAdmin |
| `vm.settings.speedNotification.emailBookingCancelledByCustomer` | checkbox | generate |  |
| `vm.settings.speedNotification.emailBookingCancelledByCustomer_Customer` | checkbox | generate | ng-disabled=!vm.settings.speedNotification.emailBookingCancelledByCustomer |
| `vm.settings.speedNotification.emailBookingCancelledByCustomer_Admin` | checkbox | generate | ng-disabled=!vm.settings.speedNotification.emailBookingCancelledByCustomer |
| `vm.settings.speedNotification.emailBookingNoShow` | checkbox | generate |  |
| `vm.settings.speedNotification.emailBookingNoShow_Customer` | checkbox | generate | ng-disabled=!vm.settings.speedNotification.emailBookingNoShow |
| `vm.settings.speedNotification.emailBookingNoShow_Admin` | checkbox | generate | ng-disabled=!vm.settings.speedNotification.emailBookingNoShow |
| `vm.settings.speedNotification.emailBookingClosed` | checkbox | generate |  |
| `vm.settings.speedNotification.emailBookingClosed_Customer` | checkbox | generate | ng-disabled=!vm.settings.speedNotification.emailBookingClosed |
| `vm.settings.speedNotification.emailBookingClosed_Admin` | checkbox | generate | ng-disabled=!vm.settings.speedNotification.emailBookingClosed |
| `vm.settings.speedNotification.emailBookingConfirmed` | checkbox | generate |  |
| `vm.settings.speedNotification.emailBookingConfirmed_Customer` | checkbox | generate | ng-disabled=!vm.settings.speedNotification.emailBookingConfirmed |
| `vm.settings.speedNotification.emailBookingConfirmed_Admin` | checkbox | generate | ng-disabled=!vm.settings.speedNotification.emailBookingConfirmed |
| `vm.settings.speedNotification.rentalBookingCCEmails` | text | ServiceBookingEmail |  |
| `vm.settings.speedNotification.emailCustomerExpiringDocuments` | checkbox | generate |  |
| `vm.settings.speedNotification.emailStaffExpiringDocuments` | checkbox | generate |  |
| `vm.settings.speedNotification.emailBlackPointFines` | checkbox | generate |  |
| `vm.settings.speedNotification.emailExpiredSecurityDeposits` | checkbox | generate |  |
| `vm.settings.speedNotification.autoEmailOnApproval` | checkbox | generate |  |
| `vm.settings.speedNotification.autoEmailOnCreation` | checkbox | generate |  |
| `vm.settings.speedNotification.rentalBookingCCEmails` | text | ServiceBookingEmail |  |
| `vm.settings.speedNotification.serviceBookingCCEmails` | text | ServiceVehicleBookingEmail |  |
| `vm.settings.paymentGateways.bookingPluginPaymentMethod` | text |  | ng-options=paymentMethod.id as paymentMethod.name for paymentMethod in vm.StipReceiptPaymentMethods |
| `vm.settings.paymentGateways.stripePublicKey` | text | stripePublicKey |  |
| `vm.settings.paymentGateways.stripePrivateKey` | text | stripePrivateKey |  |
| `vm.settings.paymentGateways.paymentLink` | text | paymentLink |  |
| `vm.formTypeInApproval` | text |  | ng-options=type.id as type.name for type in vm.formType |
| `vm.voucherTypeInApproval` | text |  | ng-options=type.id as type.name for type in vm.voucherTypes |
| `vm.voucherTypeInApproval` | text |  | ng-options=type.id as type.name for type in vm.assetTypes |
| `vm.voucherSubTypeInApproval` | text |  | ng-options=type.id as type.name for type in vm.voucherSubTypes |
| `setting.fromValue` | text | fromValue |  |
| `setting.toValue` | text | toValue |  |
| `setting.levelName` | text | levelName |  |
| `setting.role` | ui-select |  | ng-disabled=setting.user; ng-required=setting.role==null |
| `setting.user` | ui-select |  | ng-disabled=setting.role; ng-required=setting.user==null |
| `setting.agreementName` | text | userName |  |
| `setting.isRequired` | checkbox | requied |  |
| `setting.printWithInvoice` | checkbox | printWithInvoice |  |
| `vm.documentType` | text |  | ng-options=type.id as type.name for type in vm.documentTypes |
| `setting.identityDocumentType` | select |  | ng-options=docName.identityDocumentType as docName.name for docName in vm.documentTypesName |
| `setting.isRequired` | checkbox | requied |  |
| `fields.isRequired` | checkbox | isRequired{{$index}} | ng-disabled=fields.isDisabled |
| `feilds.isRequired` | checkbox | isRequiredMandatoryDesignation{{$index}} | ng-disabled=feilds.isDisabled |
| `row.isEnabled` | checkbox | IsAdditionalFieldsRequired_{{$index}} | ng-disabled=row.isSettingDisabled |
| `row.isEnabled` | checkbox | IsAdditionalFieldsRequired_{{$index}} | ng-disabled=row.isSettingDisabled |
| `row.value` | text |  | ng-options=option.id as option.type for option in row.options; ng-disabled=!row.isEnabled |
| `row.isEnabled` | checkbox | OtherFieldsRequired_{{$index}} |  |
| `account.isChecked` | checkbox | allInsurance |  |
| `vm.filters.showSelectedJobTypes` | ui-select |  |  |
| `vm.filters.showSelectedChargesTypes` | ui-select |  |  |
| `vm.settings.speedCommon.insteadOfItemsSelectionAllowToEnterAnyItemName` | checkbox | InsteadOfItemsSelectionAllowToEnterAnyItemName |  |
| `vm.settings.speedCommon.externalWorkshopChargesInJC` | checkbox | ExternalWorkshopChargesInJC |  |
| `vm.settings.speedCommon.minimumStockAlerts` | checkbox | MinimumStockAlerts |  |
| `vm.settings.speedCommon.allowClosedJobsInBillsLines` | checkbox | AllowClosedJobsInBillsLines |  |
| `vm.settings.speedCommon.generateWorkshopInRoundedDecimal` | checkbox | GenerateWorkshopInRoundedDecimal |  |
| `vm.settings.speedCommon.insuranceInvoiceNumberInJobDetailInsuranceReport` | checkbox | InsuranceInvoiceNumberInJobDetailInsuranceReport |  |
| `vm.settings.speedCommon.allowEditJobType` | checkbox | AllowEditJobType |  |
| `vm.settings.speedCommon.forwardVehicleDetailsFromStockPRToPOLines` | checkbox | ForwardVehicleDetailsFromStockPRToPOLines |  |
| `vm.settings.speedCommon.duplicateChassisNumberAlertOnJobCard` | checkbox | DuplicateChassisNumberAlertOnJobCard |  |
| `vm.settings.speedCommon.attachCostCentreInJVAndWorkshopInvoiceOnJobClosing` | checkbox | AttachCostCentreInJVAndWorkshopInvoiceOnJobClosing |  |
| `vm.settings.speedCommon.autosetItemPrice` | checkbox | AutosetItemPrice |  |
| `vm.settings.speedCommon.itemPricePercentage` | number | itemPricePercentage |  |
| `vm.settings.speedCommon.autoCalculatePriceOnItemAverageCost` | checkbox | AutoCalculatePriceOnItemAverageCost |  |
| `vm.settings.speedCommon.makeItemPriceEditable` | checkbox | MakeItemPriceEditable |  |
| `vm.settings.speedCommon.brokerContactGroupId` | select |  | ng-options=contactGroup.id as contactGroup.name for contactGroup in vm.contactGroups |
| `vm.settings.speedCommon.showDriverNameAndDetailInsteadOfCustomerBroker` | checkbox | ShowDriverNameAndDetailInsteadOfCustomerBroker |  |
| `vm.settings.speedCommon.hideRatesIfCustomerIsBroker` | checkbox | HideRatesIfCustomerIsBroker |  |
| `setting.country` | ui-select |  |  |
| `setting.formate` | text | formate |  |
| `vm.filters.highLightBlackListCountry` | ui-select |  |  |
| `f.propertyName` | text |  | ng-disabled=true |
| `f.mappingPropertyName` | text |  |  |
| `f.required` | checkbox |  | ng-disabled=f.requiredDisable |
| `vm.googleApiSettings.key` | text | PublicKey |  |
| `vm.settings.speedCommon.donotExpireDepositInAgreementDashboard` | checkbox | DonotExpireDepositInAgreementDashboard |  |
| `vm.settings.speedCommon.setDaysBaseOnCharges` | checkbox | SetDaysBaseOnCharges |  |
| `vm.settings.speedCommon.showParkingChargesInAgreementDashboard` | checkbox | ShowParkingChargesInAgreementDashboard |  |
| `vm.settings.speedCommon.showContactNoInDashBoard2` | checkbox | ShowContactNoInDashBoard2 |  |
| `setting.company` | ui-select |  |  |
| `setting.supplier` | ui-select |  |  |

## ما يجب حسمه في مراجعة دورة العمل

- توثيق نقطة البداية والمستند الناتج وحالاته المسموحة من الخادم.
- إثبات الربط بالمستند السابق واللاحق والصلاحية المطلوبة لكل انتقال.
- مراجعة قواعد الأرقام والضريبة والحسابات والتزامن من دليل إضافي.
- تجربة الدورة على بيئة مناسبة لاحقًا؛ هذه الحزمة لم تنفذ حفظًا أو ترحيلًا أو حذفًا.
