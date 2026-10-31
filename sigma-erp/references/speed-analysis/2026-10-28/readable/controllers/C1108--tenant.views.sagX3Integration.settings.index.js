// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:292513-292600
appModule.controller('tenant.views.sagX3Integration.settings.index', [
        '$scope', 'abp.services.app.sagX3Setting', 'abp.services.app.account', 'abp.services.app.commonLookup',
        function ($scope, sagX3SettingService, accountService, commonLookupService) {

            var vm = this;
            vm.loading = false;
            vm.saving = false;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.configuration = {
                sagX3Mappings: []
            }

            vm.locations = [];
            function getLocations() {
                commonLookupService.getLocations({
                }).success(function (data) {
                    vm.locations = data.items;
                });
            };

            vm.addRow = function () {
                if (vm.configuration)
                    vm.configuration.sagX3Mappings.push({
                        speedAccount: null,
                        sagX3Account: null
                    });
            };

            vm.removerow = function (row) {
                var index = vm.configuration.sagX3Mappings.indexOf(row);
                vm.configuration.sagX3Mappings.splice(index, 1);
            };
            
            vm.searchAccounts = function ($select) {
                if ($select.search == "") {
                    vm.accounts = null;
                    return null;
                }
                //,isLeaf:true
                return accountService.searchAccountsForSubLookUp({ filter: $select.search, isLeaf: true, accountCategory: vm.accountCategory }).then(function (response) {
                    vm.accounts = response.data.items;
                });
            };

            function getallsettings() {
                vm.loading = true;
                sagX3SettingService.getSageX3Settings().success(function (result) {
                    vm.settings = result;
                    if (vm.settings && vm.settings.configuration) {
                        vm.configuration = vm.settings.configuration;
                    }
                }).finally(function () {
                    if (!vm.configuration || vm.configuration.sagX3Mappings.length == 0)
                        vm.addRow();
                    vm.loading = false;
                });
            };

            vm.save = function () {
                vm.saving = true;
                vm.loading = true;
                vm.settings.dataToShare = 4;
                vm.settings.sharingFormat = 0;
                vm.settings.isActive = 1;
                vm.configuration.postingStartDate = moment(vm.configuration.postingStartDate).startOf('day');
                vm.settings.configuration = vm.configuration;
                sagX3SettingService.updateAllSettings(vm.settings).success(function (result) {
                    vm.loading = false;
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    getallsettings();
                }).finally(function () {
                    vm.saving = false;
                })
            }

            function init() {
                getallsettings();
                getLocations();
            }


            init();
        }
    ]);
