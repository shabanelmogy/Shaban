// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:82454-82657
appModule.controller('host.views.tenants.cloneTenantModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.tenant', 'abp.services.app.commonLookup', 'tenant', 'abp.services.app.tenantCloning',
        function ($scope, $uibModalInstance, tenantService, commonLookupService, tenant, tenantCloningService) {
            var vm = this;

            vm.saving = false;
            vm.saveButtonText = "Saving"
            vm.featureCloning = false;
            vm.userCloning = false;
            vm.permissionsCloning = false;
            vm.settingCloning = false;
            vm.advanceSettingCloning = false;
            vm.locationCloning = false;

            vm.hideFeatureCloning = false;
            vm.hideUserCloning = false;
            vm.hideSettingCloning = false;
            vm.hideAdvanceSettingCloning = false;
            vm.hideLocationCloning = false;

            vm.setRandomPassword = false;
            vm.useHostDb = true;
            vm.editions = [];
            vm.previousTenant = tenant
            vm.tenant = {
                isActive: true,
                shouldChangePasswordOnNextLogin: false,
                sendActivationEmail: false,
                editionId: 0
            };
            vm.featureEditData = null;
            vm.tenantTypes = [
                { type: "Trial", id: 1 },
                { type: "Test", id: 2 },
                { type: "Production", id: 3 },
                { type: "CRN", id: 4 }
            ];

            vm.getEditionValue = function (item) {

                return parseInt(item.value);
            };

            //vm.getfeatures = function ()
            //{
            //    tenantCloningService.convertSettingsTenant(
            //        vm.previousTenant.id, vm.tenant.id
            //    ).success(function (result) {
            //        vm.featureEditData = result;
            //    });
            //};
            vm.featuresClone = function () {

                vm.featureCloning = true;
                tenantCloningService.cloneTenantFeatures(
                    vm.previousTenant.id, vm.tenant.id
                ).success(function (result) {
                    vm.featureEditData = result;
                    //abp.notify.info(app.localize('SavedSuccessfully'));
                }).finally(function () {
                    vm.featureCloning = false;
                    vm.hideFeatureCloning = true;
                    vm.usersClone();
                });
            };
            vm.usersClone = function () {

                vm.userCloning = true;
                tenantCloningService.cloneTenantUsers(
                    vm.previousTenant.id, vm.tenant.id
                ).success(function (result) {
                    vm.featureEditData = result;
                    //abp.notify.info(app.localize('SavedSuccessfully'));
                }).finally(function () {
                    vm.userCloning = false;
                    vm.hideUserCloning = true;
                    vm.settingsClone();
                });
            };
            vm.permissionsCloning = function () {

                vm.permissionsCloning = true;
            };
            vm.settingsClone = function () {

                vm.settingCloning = true;
                tenantCloningService.cloneTenantSettings(
                    vm.previousTenant.id, vm.tenant.id
                ).success(function (result) {
                    vm.featureEditData = result;
                    //abp.notify.info(app.localize('SavedSuccessfully'));
                }).finally(function () {
                    vm.settingCloning = false;
                    vm.hideSettingCloning = true;
                    vm.advanceSettingsClone();
                });
            };
            vm.advanceSettingsClone = function () {
                vm.advanceSettingCloning = true;
                tenantCloningService.cloneTenantAdvanceSettings(
                    vm.previousTenant.id, vm.tenant.id
                ).success(function (result) {
                    vm.featureEditData = result;
                    //abp.notify.info(app.localize('SavedSuccessfully'));
                }).finally(function () {
                    vm.advanceSettingCloning = false;
                    vm.hideAdvanceSettingCloning = true;
                    vm.locationsClone();
                });
            };
            vm.locationsClone = function () {
                vm.locationCloning = true;
                tenantCloningService.convertLocationsOfTenant(
                    vm.previousTenant.id, vm.tenant.id
                ).success(function (result) {
                    vm.featureEditData = result;
                    //abp.notify.info(app.localize('SavedSuccessfully'));
                }).finally(function () {
                    vm.locationCloning = false;
                    vm.hideLocationCloning = true;
                    vm.userAccountsClone();

                });
            };
            vm.userAccountsClone = function () {
                vm.locationCloning = true;
                tenantCloningService.cloneTenantUserAccounts(
                    vm.previousTenant.id, vm.tenant.id
                ).success(function (result) {
                    vm.featureEditData = result;
                    //abp.notify.info(app.localize('SavedSuccessfully'));
                }).finally(function () {
                    vm.locationCloning = false;
                    vm.hideLocationCloning = true;
                    abp.notify.info(app.localize('ClonedSuccessfully'));
                    vm.saving = false;
                    $uibModalInstance.close();

                });
            };
            vm.save = function () {
                if (vm.setRandomPassword) {
                    vm.tenant.adminPassword = null;
                }

                if (vm.tenant.editionId == 0) {
                    vm.tenant.editionId = null;
                }

                vm.saving = true;

                tenantService.createTenant(vm.tenant)
                    .success(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        //$uibModalInstance.close();
                    }).finally(function () {
                        //vm.saving = false;
                        vm.clone();
                    });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.clone = function () {
                tenantService.getTenants({ tenancyName: vm.tenant.tenancyName })
                    .success(function (data) {
                        vm.tenant = data.items[0]
                    }).finally(function () {
                        //vm.saving = false;
                        vm.saveButtonText = "Cloning"
                        vm.featuresClone();
                    });

            };

            function init() {
                commonLookupService.getEditionsForCombobox({}).success(function (result) {
                    vm.editions = result.items;
                    vm.editions.unshift({ value: "0", displayText: app.localize('NotAssigned') });
                });

                tenantService.getTenantForEdit({
                    id: tenant.id
                }).success(function (result) {
                    vm.previousTenant = result;
                    vm.currentConnectionString = result.connectionString;
                    vm.tenant.editionId = vm.previousTenant.editionId || 0;

                    if (vm.previousTenant.tenantType == 0) {
                        vm.tenant.tenantType = null;
                    }
                    else {
                        vm.tenant.tenantType = vm.previousTenant.tenantType
                    }
                    //vm.getfeatures();
                    //vm.tenantTypeChange();
                });
            }

            init();
        }
    ]);
