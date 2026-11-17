// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:224464-224615
appModule.controller('tenant.views.integration.tars.settings.index', [
        '$scope', 'abp.services.app.tarsSetting', 'abp.services.app.commonLookup', 'abp.services.app.tenantSettings', 'abp.services.app.contactGroup','abp.services.app.directory',
        function ($scope, tarsSettingService, commonLookupService, tenantSettingsService, contactGroupService,directoryService) {

            var vm = this;
            vm.loading = false;
            vm.saving = false;
            vm.customers = [];
            vm.ignoredCustomersArray = [];
            vm.tarsSetting =
            {
                emails: null,
                contactGroupId:null
            }

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.configuration = {
                trafficFileCredentials: [],
                ignoredTrafficFileIds: [],
            };

            vm.trafficFiles = [];
            function getTrafficFiles() {
                tarsSettingService.getTrafficFiles({
                }).success(function (data) {
                    vm.trafficFiles = data;
                    getallsettings();
                });
            };

            vm.changeIgnoredTrafficFile = function () {
                vm.configuration.ignoredTrafficFileIds = [];
                if (vm.configuration.ignoredTrafficFilesArray.length > 0) {
                    angular.forEach(vm.configuration.ignoredTrafficFilesArray, function (value) {
                        vm.configuration.ignoredTrafficFileIds.push(value.id);
                    });
                }
            }
            vm.changeIgnoredCustomers = function () {
                vm.tarsSetting.customersToIgnore = [];
                if (vm.ignoredCustomersArray.length > 0) {
                    angular.forEach(vm.ignoredCustomersArray, function (value) {
                        vm.tarsSetting.customersToIgnore.push(value.id);
                    });
                }
            }

            vm.addRow = function () {
                if (vm.configuration)
                    if (!vm.configuration.trafficFileCredentials)
                        vm.configuration.trafficFileCredentials = [];
                    vm.configuration.trafficFileCredentials.push({
                        trafficFileId: '',
                        clientId: '',
                        clientSecret: '',
                        agencyDid: ''
                    });
            };

            vm.removerow = function (row) {
                var index = vm.configuration.trafficFileCredentials.indexOf(row);
                vm.configuration.trafficFileCredentials.splice(index, 1);
            };

            vm.searchCustomers = function ($select) {
                if (!$select.search) return;
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                var contactCategory = null;
                
                return directoryService.search({ keyword: $select.search, contactType: 2, activeOnly: true, includeSalesPerson: true, contactCategory: contactCategory }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };

            function getallsettings() {
                vm.loading = true;
                tarsSettingService.getTarsSettings().success(function (result) {
                    vm.settings = result;
                    if (vm.settings && vm.settings.configuration) {
                        vm.configuration = vm.settings.configuration;
                        vm.configuration.ignoredTrafficFilesArray = [];
                        if (!vm.configuration.ignoredTrafficFileIds) vm.configuration.ignoredTrafficFileIds = [];
                        vm.configuration.ignoredTrafficFileIds.forEach(function (ignoredTrafficFileId, index) {
                            for (var i = 0; i < vm.trafficFiles.length; i++) {
                                if (vm.trafficFiles[i].id == ignoredTrafficFileId) {
                                    vm.configuration.ignoredTrafficFilesArray.push(vm.trafficFiles[i]);
                                }
                            }
                        });
                    }
                }).finally(function () {
                    vm.loading = false;
                });
            };




            //Tars Setting Start
            vm.searchContactGroups = function () {
                contactGroupService.getContactGroups().then(function (response) {
                    vm.ContactGroupsData = response.data.items;
                });
            };
            vm.save = function () {
                vm.saving = true;
                vm.loading = true;
               
                tenantSettingsService.updateTarsSetting(vm.tarsSetting);
                vm.settings.dataToShare = 6;
                vm.settings.sharingFormat = 0;
                vm.settings.isActive = 1;
                vm.settings.configuration = vm.configuration;
                tarsSettingService.updateAllSettings(vm.settings).success(function (result) {
                    vm.loading = false;
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    getallsettings();
                }).finally(function () {
                    vm.saving = false;
                })
            }

            function getTarsSetting() {
                tenantSettingsService.getTarsSetting({
                }).success(function (data) {
                    debugger;
                    data.contactGroupId = parseInt(data.contactGroupId);
                    
                    vm.tarsSetting = data;

                    directoryService.searchByIds({ ids: vm.tarsSetting.customersToIgnore}).then(function (response) {
                        vm.ignoredCustomersArray = response.data.items;
                    });


                });
            };

            //Tars Setting END
            function init() {
                //getLocations();
                getTrafficFiles();
                getTarsSetting();
                vm.searchContactGroups();
                //getallsettings();
            }
            init();
        }
    ]);
