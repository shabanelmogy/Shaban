// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:82800-82923
appModule.controller('host.views.tenants.editModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.tenant', 'abp.services.app.commonLookup', 'tenantId', 'abp.services.app.directory', 'abp.services.app.businessDivision', 'abp.services.app.cloud',
        function ($scope, $uibModalInstance, tenantService, commonLookupService, tenantId, directoryService, businessDivisionService, cloudService) {
            var vm = this;

            vm.saving = false;
            vm.tenant = null;
            vm.currentConnectionString = null;
            vm.editions = [];
            vm.isCompanyRequired = null;

            vm.searchContact = function ($select) {
                return directoryService.search({ keyword: $select.search, contactType: 2, contactCategory: 2 }).then(function (response) {
                    vm.contacts = response.data.items;
                });
            };

            vm.tenantTypeChange = function () {
                debugger;
                if (vm.tenant.tenantType === 3) {
                    vm.isCompanyRequired = true;
                } else {
                    vm.isCompanyRequired = false;
                }
            }

            vm.save = function () {
                if (vm.tenant.editionId == 0) {
                    vm.tenant.editionId = null;
                }
                //if (vm.tenant.tenantType == 0) {
                //    vm.tenant.tenantType = null;
                //}

                vm.saving = true;
                tenantService.updateTenant(vm.tenant)
                    .success(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
            };

            vm.tenantTypes = [
                { type: "Trial", id: 1 },
                { type: "Test", id: 2 },
                { type: "Production", id: 3 },
                { type: "CRN", id: 4 },
                { type: "Support", id: 5 }
            ];

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.getEditionValue = function (item) {
                return parseInt(item.value);
            };

            function init() {
                commonLookupService.getEditionsForCombobox({}).success(function (result) {
                    vm.editions = result.items;
                    vm.editions.unshift({ value: "0", displayText: app.localize('NotAssigned') });
                });

                tenantService.getTenantForEdit({
                    id: tenantId
                }).success(function (result) {
                    vm.tenant = result;
                    vm.currentConnectionString = result.connectionString;
                    vm.tenant.editionId = vm.tenant.editionId || 0;

                    if (vm.tenant.tenantType == 0) {
                        vm.tenant.tenantType = null;
                    }
                    vm.tenantTypeChange();
                    vm.getApplications();
                    vm.getHostDB();
                });
            }
            vm.getbusinessDivisions = function () {
                vm.loading = true;
                businessDivisionService.getBusinessDivisions().success(function (data) {
                    vm.businessDivisions = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            }
            vm.getbusinessDivisions();
            vm.getHostDB = function () {
                vm.loading = true;
                cloudService.getDatabases().success(function (data) {
                    vm.databases = data.items;
                    vm.setDatabase();
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
            vm.setConnectionString = function () {
                if (vm.tenant.databaseId)
                    vm.tenant.connectionString = vm.databases.find(c => c.id == vm.tenant.databaseId).connectionString;
                else
                    vm.tenant.connectionString = null
            };
            vm.setDatabase = function () {
                if (vm.tenant.businessDivisionId) {
                    vm.items = vm.databases.filter(c => c.divisionId == vm.tenant.businessDivisionId);
                }

            }
            
            init();
        }
    ]);
