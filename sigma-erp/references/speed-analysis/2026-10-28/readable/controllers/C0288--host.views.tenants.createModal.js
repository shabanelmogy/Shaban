// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:82660-82797
appModule.controller('host.views.tenants.createModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.tenant', 'abp.services.app.commonLookup', 'abp.services.app.businessDivision', 'abp.services.app.cloud',
        function ($scope, $uibModalInstance, tenantService, commonLookupService, businessDivisionService, cloudService) {
           
           var vm = this; 
            vm.saving = false;
            vm.setRandomPassword = false;
            vm.editions = [];
            vm.tenant = {
                isActive: true,
                shouldChangePasswordOnNextLogin: false,
                sendActivationEmail: false,
                editionId: 0,
                databaseId: 0
            };
            vm.exteranlyHide = false;
            vm.tenantTypes = [
            { type: "Trial", id: 1 },
            { type: "Test", id: 2 },
            { type: "Production", id: 3 },
            { type: "CRN", id: 4 },
            { type: "Support", id: 5 }
            ];
            vm.setDatabase = function () {
                if (vm.tenant.businessDivisionId) {
                    vm.items = vm.databases.filter(c => c.divisionId == vm.tenant.businessDivisionId);
                }
                
            }
            vm.applicationChange = function (app) {
                vm.tenant.appId = app.id;
                if (app.hosting == 2) {
                    vm.exteranlyHide = true;
                    vm.tenant.databaseId = null;
                    vm.useHostDb = false;
                    vm.currentConnectionString = null;
                    vm.tenant.adminEmailAddress = null;
                    vm.tenant.adminPassword = null;
                    vm.tenant.adminPasswordRepeat = null;
                    vm.setRandomPassword = null;
                    vm.tenant.shouldChangePasswordOnNextLogin = null;
                    vm.tenant.sendActivationEmail = null;
                }
                else {
                    vm.exteranlyHide = false;
                }
            };
            vm.getEditionValue = function (item) {
                
                return parseInt(item.value);
            };
           /* vm.setConnectionString = function () {
                if (vm.tenant.databaseId)
                    vm.currentConnectionString = vm.databases.find(c => c.id == vm.tenant.databaseId).connectionString;
                else
                    vm.currentConnectionString=null
            };*/

            vm.save = function () {
                if (vm.setRandomPassword) {
                    vm.tenant.adminPassword = null;
                }

                if (vm.tenant.editionId == 0) {
                    vm.tenant.editionId = null;
                }
                
               /* if (vm.useHostDb) {
                    vm.tenant.connectionString = null;
                }
                else {
                    vm.tenant.connectionString = vm.currentConnectionString;
                }*/
                vm.saving = true;
                
                tenantService.createTenant(vm.tenant)
                    .success(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            commonLookupService.getEditionsForCombobox({}).success(function (result) {
                vm.editions = result.items;
                vm.editions.unshift({ value: "0", displayText: app.localize('NotAssigned') });
            });
            /*function init() {
                
                vm.useHostDb = false;
                tenantService.getTenantForEdit({
                    id: 0
                }).success(function (result) {
                    vm.tenant = result;
                    vm.currentConnectionString = result.connectionString;
                    vm.tenant.editionId = vm.tenant.editionId || 0;

                    if (vm.tenant.tenantType == 0) {
                        vm.tenant.tenantType = null;
                    }
                    //vm.tenantTypeChange();
                });
            }*/
            vm.getbusinessDivisions = function () {
                vm.loading = true;
                businessDivisionService.getBusinessDivisions().success(function (data) {
                    vm.businessDivisions = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            }
            vm.getHostDB = function () {
                vm.loading = true;
                cloudService.getDatabases().success(function (data) {
                    vm.databases = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            }
            vm.getApplications = function () {
                vm.loading = true;
                cloudService.getApplications().success(function (data) {
                    vm.applications = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            }
            vm.getApplications();
            vm.getHostDB();
            vm.getbusinessDivisions();
           // init();
        }
    ]);
