// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:127513-128189
appModule.controller('tenant.views.crs.accounting.linkAccounts.index', [
        '$scope', 'abp.services.app.account', 'abp.services.app.linkedAccount', 'abp.services.app.linkedPrepaidExpense', 'utilities', 'abp.services.app.bankAccount', 'abp.services.app.chargesSetting', 'abp.services.app.contactGroup', '$filter', 'abp.services.app.itemType', 'abp.services.app.jobCategory', 'abp.services.app.commonLookup',
        'abp.services.app.tenantSettings',
        function ($scope, accountService, linkedAccountService, linkedPrepaidExpenseService, utilities, bankAccountService, chargesSettingService, contactGroupService, $filter, itemTypeService,jobCategoryService, commonLookupService,
            tenantSettingsService) {
            var vm = this;
            vm.loading = false;
            vm.chargesSettings = [];
            vm.isWorkshopFeatureEnabled = abp.features.isEnabled("WORKSHOP");
            vm.customizeRevenueLinkingForContactGroups = utilities.parseBoolean(abp.setting.get("App.General.CustomizeRevenueLinkingForContactGroups"));
            vm.islinkCrsToWorkShopEnabled = abp.features.isEnabled("CRS.CustomFeatures.LinkCrsToWorkShop");
            vm.isCreateBillInCRSOnJobClosingEnabled = abp.features.isEnabled("CRS.CustomFeatures.LinkCrsToWorkShop.CreateBillInCRSOnJobClosing");
            //vm.islinkCrsToWorkShopTanantNameIdHasValue = abp.features.getValue("CRS.CustomFeatures.LinkCrsToWorkShop.TenantNameId");
            vm.islinkWorkShopToCrsTenantNameHasValue = abp.features.getValue("CRS.CustomFeatures.LinkCrsToWorkShop.CRSTenantName");
            var jobType = abp.setting.get("App.Speed.Common.ShowSelectedJobTypes")
            vm.jobTypes = jobType ? angular.fromJson(jobType) : new Array();
            if (!vm.jobTypes || vm.jobTypes.length <= 0)
                vm.jobTypes = utilities.getJobTypes();
            var selectedChargesTypes = abp.setting.get("App.Speed.Common.ShowSelectedChargesTypes")
            vm.selectedChargesTypes = selectedChargesTypes ? angular.fromJson(selectedChargesTypes) : new Array();
            vm.isEnabledChargesTypeWiseLinkingForWorkShop = abp.features.isEnabled("CRS.CustomFeatures.ChargesTypeWiseLinkingForWorkShop");

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            vm.billingMethodsLocationId = null;
            vm.defaultContactGroupStaff = null;
            vm.defaultContactGroupForStaff = null;
            vm.locations = [];
            vm.filters = {
                accountNo: '',
                bankName: '',
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize
            };

            var externalEquipmentChargesTypes = [1, 26, 27, 68, 71]; // rent,moblization,demoblization,extrahour,attachment

            function linkAccountLineObject() {
                var line = new Object();
                line.chargesTypeId = null;
                line.description = '';
                line.accountId = null;
                line.rateTypeId = null;
                line.contactCategory = 2;
                line.module = vm.enabledModule;
                return line;
            }
            //function linkAccountLineObjectForChargesType() {
            //    var line = new Object();
            //    line.chargesTypeId = null;
            //    line.description = '';
            //    line.accountId = null;
            //    line.rateTypeId = null;
            //    line.contactCategory = 1;
            //    line.module = 6;
            //    return line;
            //}

            function linkAccountLineObjectForExternalParameter(externalParameter) {
                var line = new Object();
                line.chargesTypeId = null;
                line.description = '';
                line.accountId = null;
                line.rateTypeId = null;
                line.externalParameter = externalParameter;
                line.module = vm.enabledModule;
                return line;
            }

            vm.modules = [];
            if (abp.features.isEnabled("CRS.Rental"))
                vm.modules.push({ name: 'Rental', id: 1 });
            if (abp.features.isEnabled("CRS.Lease"))
                vm.modules.push({ name: 'Lease', id: 2 });
            if (abp.features.isEnabled("CRS.Limo"))
                vm.modules.push({ name: 'Limousine', id: 3 });
            if (abp.features.isEnabled("CRS.Transportation"))
                vm.modules.push({ name: 'Transportation', id: 4 });
            if (abp.features.isEnabled("CRS.Chauffeur"))
                vm.modules.push({ name: 'Chauffeur', id: 5 });
            if (abp.features.isEnabled("WORKSHOP"))
                vm.modules.push({ name: 'Workshop', id: 6 });
            if (abp.features.isEnabled("ERS"))
                vm.modules.push({ name: app.localize('Equipment'), id: 7 });
            if (abp.features.isEnabled("CRS.AccessoriesRental"))
                vm.modules.push({ name: app.localize('Accessories'), id: 8 });
            if (abp.features.isEnabled("CRS.SalesModule"))
                vm.modules.push({ name: app.localize('Sales'), id: 9 });
            //if (abp.features.isEnabled("ERS.Lease"))
            //    vm.modules.push({ name: app.localize('EquipmentLease'), id: 8 });

            vm.enabledModule = vm.modules.length > 0 ? vm.modules[0].id : null;

            //vm.jobExpensesAccounts = [
            //    { id: 1, name: app.localize("RoutineService"), jobType: null },
            //    { id: 2, name: app.localize("MechanicalService"), jobType: null },
            //    { id: 3, name: app.localize("ElectricalService"), jobType: null },
            //    { id: 4, name: app.localize("DentingAndPainting"), jobType: null },
            //    { id: 5, name: app.localize("AccidentService"), jobType: null },
            //    { id: 6, name: app.localize("ACService"), jobType: null },
            //    { id: 7, name: app.localize("BreakdownService"), jobType: null },
            //    { id: 8, name: app.localize("TyreService"), jobType: null }
            //];
            vm.getJobTypeName = function (jobType) {
                if (jobType === 1) {
                    return "Routine Service";
                }
                else if (jobType === 2) {
                    return "Mechanical Service";
                }
                else if (jobType === 3) {
                    return "Electrical Service";
                }
                else if (jobType === 4) {
                    return "Denting & Painting";
                }
                else if (jobType === 5) {
                    return "Accident Service";
                }
                else if (jobType === 6) {
                    return "AC Service";
                }
                else if (jobType === 7) {
                    return "Breakdown Service";
                }
                else if (jobType === 8) {
                    return "Tyre Service";
                }
                else if (jobType === 9) {
                    return "Unit Maintenance";
                }
                else if (jobType === 10) {
                    return "Unit Repair";
                }
                else if (jobType === 11) {
                    return "Regular Lubrications";
                }
            };

            vm.searchAccounts = function ($select, accountCategory) {
                if ($select.search == "") { vm.accounts = null; return null; }
                return accountService.searchAccounts({ filter: $select.search, isLeaf: true, accountCategory: accountCategory }).then(function (response) {
                    vm.accounts = response.data.items;
                });
            };

            vm.addStaffContactGroupRow = function () {

                vm.linkAccounts.push({ account: null, contactGroup: vm.defaultContactGroupStaff, contactGroupId: vm.defaultContactGroupStaff.id });
            };
            
            vm.addStaffContactGroupRowForStaff = function () {

                vm.linkAccounts.push({ account: null, contactGroup: vm.defaultContactGroupForStaff, contactGroupId: vm.defaultContactGroupForStaff.id });
            };
            vm.removeStaffContactGroupRow = function (row) {
                var item = vm.linkAccounts.indexOf(row);
                vm.linkAccounts.splice(item, 1);
            };
            vm.getContactType = function (type) {
                if (type == 1)
                    return 'Staff';
                else if (type == 2)
                    return 'Customer';
                else if (type == 3)
                    return 'Supplier';
                else if (type == 6)
                    return 'CorporateDriver';
                else if (type == 7)
                    return 'CompanyContact';
                return '';
            };

            vm.getBillingMethodCategory = function (type) {
                if (type == 0)
                    return app.localize('BothReceiptsAndPayments');
                if (type == 1)
                    return 'Receipts';
                else if (type == 2)
                    return 'Payments';
                return '';
            };

            vm.generalFilter = function (item) {
                if (item.generalTypeId != null && item.generalTypeId > 0 && item.generalTypeId != 7 && item.generalTypeId != 8 && item.generalTypeId != 11) {
                    return true;
                }
                return false;
            };

            //vm.chargesFilter = function (item) {
            //    if (item.chargesTypeId != null && item.chargesTypeId > 0 && item.chargesTypeId != 1) {
            //        return true;
            //    }
            //    return false;
            //};

            vm.chargesFilter = function (item) {
                if (item.chargesTypeId != null && !item.externalParameter && item.chargesTypeId > 0 && item.module == vm.enabledModule && !item.contactCategory && item.contactCategory != 2) {
                    return true;
                }
                return false;
            };
            //vm.chargesFilterPersonAndCompany = function (item) {
            //    if (item.module == 6 && item.contactCategory && (item.contactCategory == 1 || item.contactCategory == 2)) {
            //        return true;
            //    }
            //    return false;
            //};
            vm.chargesFilterCompany = function (item) {
                if (item.module == vm.enabledModule && item.contactCategory && item.contactCategory == 2) {
                    return true;
                }
                return false;
            };

            vm.chargesFilterExternalEquipment = function (item) {
                if (item.module == vm.enabledModule && item.externalParameter == 1) {
                    return true;
                }
                return false;
            };

            vm.chargesFilterExternalOperator = function (item) {
                if (item.module == vm.enabledModule && item.externalParameter == 2) {
                    return true;
                }
                return false;
            };

            vm.chargesFilterRent = function (item) {
                var check = utilities.parseBoolean(abp.setting.get("App.General.WeeklyMonthlyRental"));
                if ((item.chargesTypeId != null && item.chargesTypeId > 0 && item.chargesTypeId == 1) || (item.generalTypeId && (item.generalTypeId == 7 || item.generalTypeId == 8) && check) || (item.generalTypeId && item.generalTypeId == 11 && abp.features.isEnabled("CRS.Lease"))) {
                    return true;
                }
                return false;
            };

            vm.billingMethodFilter = function (item) {
                if (!item.billingMethod)
                    return false;
                if (item.billingMethodId != null && item.billingMethodId > 0 && item.billingMethod.type != 5 && item.locationId == vm.billingMethodsLocationId) {
                    return true;
                }
                return false;
            };

            vm.contactGroupFilter = function (item) {
                if (item.contactGroupId != null && item.contactGroupId > 0 && item.contactGroup.contactType != 1 && !item.chargesTypeId) {
                    return true;
                }
                return false;
            };
            vm.contactGroupStaffFilter = function (item) {
                if (item.contactGroupId != null && item.contactGroupId > 0 && item.contactGroup.contactType == 1) {
                    return true;
                }
                return false;
            };
            vm.localize = function (input) {
                if (input == null)
                    return "";

                return app.localize(input);
            };

            vm.removeRow = function (obj) {
                var index = vm.linkedPrepaidExpense.indexOf(obj);
                vm.linkedPrepaidExpense.splice(index, 1);
                linkedPrepaidExpenseService.DeleteLinkedPrepaidExpense(obj);

            };
            //vm.jobTypes = [
            //    { id: 1, name: app.localize("RoutineService") },
            //    { id: 2, name: app.localize("MechanicalService") },
            //    { id: 3, name: app.localize("ElectricalService") },
            //    { id: 4, name: app.localize("DentingAndPainting") },
            //    { id: 5, name: app.localize("AccidentService") },
            //    { id: 6, name: app.localize("ACService") },
            //    { id: 7, name: app.localize("BreakdownService") },
            //    { id: 8, name: app.localize("TyreService") },
            //    { id: 9, name: app.localize("UnitMaintenance") },
            //    { id: 10, name: app.localize("UnitRepair") },
            //    { id: 11, name: app.localize("RegularLubrications") },
            //];
            vm.addRow = function () {
                vm.linkedPrepaidExpense.push(prepaidExpenseLineObject());

            };
            vm.addRowStockLinkAccount = function () {
                vm.stocklinkAccount.push(stockLinkLineObject());

            };
            vm.addRowStockLinkAccountRevenue = function () {
                vm.stocklinkAccount.push(stockRevenueLinkLineObject());

            };
            vm.removeRowStockLinkAccount = function (obj) {
                var index = vm.stocklinkAccount.indexOf(obj);
                vm.stocklinkAccount.splice(index, 1);
                linkedAccountService.deleteStockLinkAccount(obj);

            };
            vm.removeRowStockLinkAccountRevenue = function (obj) {
                var index = vm.stocklinkAccount.indexOf(obj);
                vm.stocklinkAccount.splice(index, 1);
                linkedAccountService.deleteStockLinkAccount(obj);

            };


            vm.addExternalParameterLinkChargesRow = function (externalParameter) {
                vm.linkAccounts.push(linkAccountLineObjectForExternalParameter(externalParameter));
            };

            vm.addLinkChargesRow = function () {
                vm.linkAccounts.push(linkAccountLineObject());
            };
            //vm.addLinkChargesRowForChargesType = function () {
            //    vm.linkAccounts.push(linkAccountLineObjectForChargesType());
            //};
            vm.removeLinkChargesRow = function (linkAccount) {

                var index = vm.linkAccounts.indexOf(linkAccount);
                vm.linkAccounts.splice(index, 1);
                //  linkedPrepaidExpenseService.DeleteLinkedPrepaidExpense(obj);
            };
            function prepaidExpenseLineObject() {
                var line = new Object();
                line.contactId = 12,
                    line.staffGroupId = 2;
                return line;
            }
            function stockLinkLineObject() {
                var line = new Object();
                line.jobType = null;
                line.jobCategory = null;
                line.accountId = null;
                line.itemTypeId = null;
                line.jobCategoryId = null;
                line.type = 3;
                    
                
                return line;
            }

            function stockRevenueLinkLineObject() {
                var line = new Object();
                line.jobCategory = null;
                line.accountId = null;
                line.itemTypeId = null;
                line.jobCategoryId = null;
                line.type = 2;
                    
                
                return line;
            }

            function getLocations() {
                commonLookupService.getLocationsActiveAndInActive({}).success(function (data) {
                    vm.locations = data.items;
                    initiliazePaymentMethodsBranchWise();
                });
            }

            vm.saveLinkedPrepaidExpense = function () {
                vm.saving = true;
                linkedPrepaidExpenseService.createOrUpdateLinkedPrepaidExpense({
                    linkedPrepaidExpense: vm.linkedPrepaidExpense
                }).success(function (data) {
                    init();
                }).finally(function () {
                    vm.saving = false;
                });
            };
            function getChargesSettings() {
                vm.loading = true;

                chargesSettingService.getChargesSettings({ module: 1 }).success(function (data) {
                    vm.chargesSettings = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };
            vm.save = function () {
                vm.saving = true;
                linkedAccountService.createOrUpdateLinkedAccount({
                    linkedAccount: vm.linkAccounts,
                    linkedPrepaidExpense: vm.linkedPrepaidExpense,
                    bankAccount: vm.bankAccounts,
                    itemType: vm.itemTypes,
                    jobCategory: vm.jobCategory,
                    stocklinkAccount: vm.stocklinkAccount,
                    cRSAccountLinkings: vm.jobExpensesAccounts
                }).success(function (data) {


                    abp.notify.info(app.localize('SavedSuccessfully'));
                    init(true);
                }).finally(function () {
                    vm.saving = false;
                });
            };

            function getBankAccounts() {
                vm.loading = true;

                bankAccountService.getBankAccountsForSelection(vm.filters).success(function (data) {

                    vm.bankAccounts = data.items;



                }).finally(function () {
                    vm.loading = false;
                });
            };


            function getItemType() {
                vm.loading = true;
                itemTypeService.getItemTypes().success(function (data) {
                    vm.itemTypes = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };
            function geJobCategory() {
                vm.loading = true;
                jobCategoryService.getJobCategory() .success(function (data) {
                    vm.jobCategory = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };
            function getStockLinkAccount() {
                vm.loading = true;
                linkedAccountService.getStockLinkAccounts().success(function (data) {
                    vm.stocklinkAccount = data;
                }).finally(function () {
                    vm.loading = false;
                });
            };
            vm.getJobTypeName = function (jobType) {
                if (jobType === 1) {
                    return "Routine Service";
                }
                else if (jobType === 2) {
                    return "Mechanical Service";
                }
                else if (jobType === 3) {
                    return "Electrical Service";
                }
                else if (jobType === 4) {
                    return "Denting & Painting";
                }
                else if (jobType === 5) {
                    return "Accident Service";
                }
                else if (jobType === 6) {
                    return "AC Service";
                }
                else if (jobType === 7) {
                    return "Breakdown Service";
                }
                else if (jobType === 8) {
                    return "Tyre Service";
                }
                else if (jobType === 9) {
                    return "Unit Maintenance";
                }
                else if (jobType === 10) {
                    return "Unit Repair";
                }
                else if (jobType === 11) {
                    return "Regular Lubrications";
                }
            };

            function getLinkedPrepaidExpense() {
                vm.loading = true;
                linkedPrepaidExpenseService.getLinkedPrepaidExpense().success(function (data) {
                    vm.linkedPrepaidExpense = data.items;
                }).finally(function () {
                    vm.loading = false;
                });

            }

            function getChargesTypes() {
                chargesSettingService.getChargesTypes().success(function (data) {
                    vm.chargesTypes = data;
                    vm.chargesTypes.forEach(e => e.name = app.localize(e.name));
                    //if (vm.selectedChargesTypes !== null) {
                    //    vm.chargesTypesForPersonAndCompany = vm.chargesTypes.filter(e => vm.selectedChargesTypes.map(x => x.id).includes(e.id));
                    //}
                    vm.chargesTypesForExternalEquipment = vm.chargesTypes.filter(e => externalEquipmentChargesTypes.includes(e.id));
                    vm.chargesTypesForExternalOperator = vm.chargesTypes.filter(e => e.id == 70);
                }).finally(function () {
                    vm.loading = false;
                });
            }

            function getRateTypes() {
                vm.loading = true;
                chargesSettingService.getRateTypes().success(function (data) {
                    vm.rateTypes = data;
                }).finally(function () {
                    vm.loading = false;
                });
            }
            function getContactGroups() {
                vm.loading = true;
                contactGroupService.getContactGroupsOnContactType({ contactType: 1 }).success(function (result) {
                    vm.contactGroups = result.items;
                    vm.defaultContactGroupForStaff = $filter('filter')(result.items, {
                        isDefault: true
                    }, true)[0];
                }).finally(function () { vm.loading = false; });
            }

            function getCustomerContactGroups() {
                vm.loading = true;
                contactGroupService.getContactGroupsOnContactType({ contactType: 2 }).success(function (result) {
                    vm.customerContactGroups = result.items;
                    vm.defaultContactGroupStaff = $filter('filter')(result.items, {
                        isDefault: true
                    }, true)[0];
                }).finally(function () { vm.loading = false; });
            }


            //vm.branchSelected = function () {
            //    var selectedLocationId = vm.billingMethodsLocationId;
            //    if (!selectedLocationId)
            //        return;

            //    var billingMethods = vm.linkAccounts.filter(item => !item.locationId && item.billingMethodId != null && item.billingMethodId > 0 && item.billingMethod.type != 5);
            //    billingMethods.forEach(e => {
            //        var billingMethodOnBranch = vm.linkAccounts.find(r => r.locationId == selectedLocationId && r.billingMethodId == e.billingMethodId);
            //        if (!billingMethodOnBranch) {
            //            vm.linkAccounts.push({
            //                locationId: selectedLocationId,
            //                billingMethod: e.billingMethod,
            //                billingMethodId: e.billingMethodId
            //            });
            //        }
            //    });

            //};

            function initiliazePaymentMethodsBranchWise() {

                var distinctBillingMethodIds = [...new Set(vm.linkAccounts.filter(item =>
                    item.billingMethodId != null
                    && item.billingMethodId > 0
                    && item.billingMethod!=null
                    && item.billingMethod.type != 5).map(e => e.billingMethodId)
                )];

                var distinctBillingMethods = distinctBillingMethodIds.map(id => {
                    return {
                        billingMethodId: id,
                        billingMethod: vm.linkAccounts.find(e => e.billingMethodId == id).billingMethod
                    }
                });

                // for locationId Null
                distinctBillingMethods.forEach(bm => {
                    if (!vm.linkAccounts.some(s => s.billingMethodId == bm.billingMethodId && !s.locationId)) {
                        vm.linkAccounts.push({
                            billingMethod: bm.billingMethod,
                            billingMethodId: bm.billingMethodId
                        });
                    }
                });

                vm.locations.forEach(e => {
                    distinctBillingMethods.forEach(bm => {
                        if (!vm.linkAccounts.some(s => s.billingMethodId == bm.billingMethodId && s.locationId == e.id)) {
                            vm.linkAccounts.push({
                                locationId: e.id,
                                billingMethod: bm.billingMethod,
                                billingMethodId: bm.billingMethodId
                            });
                        }
                    });
                });
            }
            function getJobExpensesAccounts() {
                vm.loading = true;
                var accountCategory = 5; //expenses category
                accountService.getAccountsFromCRStenant({ id: accountCategory }).success(function (data) {
                    if (data)
                    vm.crsExpensesAccounts = data.items;
                    getExpenseAccountsAdvanceSetting();

                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.expenseAccountCheckedOrUnchecked = function (account) {
                if (vm.vehicleExpensesAccounts) {
                    vm.vehicleExpensesAccounts.filter(e => e.parentId === account.id)
                        .forEach((row) => row.isChecked = account.isChecked);
                }
            };

            vm.saveExpenseAccounts = function () {
                //var accountIdsToReturn = vm.jobExpensesAccounts;
                vm.saving = true;
                var settingName = "AdvanceSettings.CRSTenantJobExpenseAccounts.JobExpenseAccounts";
                let advanceSetting = {
                    name: settingName,
                    cRSAccountLinkings: vm.jobExpensesAccounts
                };

                linkedAccountService.updateCRSTenantJobExpenseAccounts(advanceSetting)
                    .success(function () {
                        vm.loading = false;
                        abp.notify.info(app.localize('SavedSuccessfully'));
                    }).error(function (error) {
                        vm.loading = false;
                    }).finally(function () {
                        vm.saving = false;
                    });
            };

            function getExpenseAccountsAdvanceSetting() {
                linkedAccountService.getCRSTenantJobExpenseAccountsAdvanceSetting()
                    .success(function (result) {
                        vm.jobExpensesAccounts = result;

                    });
            }

            function init(settingAccount = false) {
                vm.loading = true;

                linkedAccountService.getLinkedAccountsForEdit().success(function (data) {
                    console.log(data.items);
                    vm.linkAccounts = data.items;
                    if (vm.selectedChargesTypes != null && vm.selectedChargesTypes.length > 0 && vm.isEnabledChargesTypeWiseLinkingForWorkShop) {
                        vm.selectedChargesTypes.forEach(settingCharges => {
                            if (!settingAccount) {
                                var existedChargesType = vm.linkAccounts.find(e => e.chargesTypeId == settingCharges.id && e.module == 6);
                                if (!existedChargesType) {
                                    vm.linkAccounts.push({ account: null, chargesTypeId: settingCharges.id, chargesType: settingCharges, module: 6 });
                                }
                            }
                        })
                    }
                    getLocations();
                    getLinkedPrepaidExpense();
                    getChargesTypes();
                    getRateTypes();
                    getBankAccounts();
                    getContactGroups();
                    getCustomerContactGroups();
                    getItemType();
                    geJobCategory();
                    getStockLinkAccount();
                    getChargesSettings();

                    getJobExpensesAccounts();
                    // vm.branchSelected();
                }).finally(function () {
                    vm.loading = false;
                });

            }
            init();

        }
    ]);
