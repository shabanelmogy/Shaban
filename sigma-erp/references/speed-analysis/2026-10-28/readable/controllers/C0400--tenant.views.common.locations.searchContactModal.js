// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:101558-101604
appModule.controller('tenant.views.common.locations.searchContactModal',
        ['$scope', '$uibModal', '$uibModalInstance', 'utilities', 'abp.services.app.commonLookup',
            function ($scope, $uibModal, $uibModalInstance, utilities, commonLookupService) {

                var vm = this;
                vm.isAccountFeatureEnabled = abp.features.isEnabled("CRS.Accounts");
                vm.isVipCustomer = utilities.parseBoolean(abp.setting.get("App.General.IsVipCustomer"));
                vm.filters = {

                };
                var groupBy = function (data, key) {
                    let groupByArray = data.reduce((r, a) => {
                        r[a[key]] = [...r[a[key]] || [], a];
                        return r;
                    }, {});
                    return groupByArray;
                };

                function getLocations() {
                    commonLookupService.getLocationsActiveAndInActive({}).success(function (data) {
                        vm.locations = data.items;
                        vm.groupByStateData = groupBy(vm.locations, 'state');
                        vm.dataToIterate = [];
                        angular.forEach(vm.groupByStateData, function (value, key) {
                            var result = [];
                            result.state = key;
                            result.rowData = angular.copy(value);
                            vm.dataToIterate.push(result);
                        });

                    });
                };

                vm.cancel = function () {
                    $uibModalInstance.dismiss();
                };

                vm.branchSelected = function (branch) {
                    $uibModalInstance.close(branch);
                };

                vm.init = function () {
                    getLocations();
                };

                vm.init();
            }]);
