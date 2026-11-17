// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:86174-86223
appModule.controller('tenant.views.common.businessUnits.searchGroupName',
        ['$scope', '$uibModal', '$uibModalInstance', 'utilities', 'abp.services.app.commonLookup',
            function ($scope, $uibModal, $uibModalInstance, utilities, commonLookupService) {

                var vm = this;

                vm.filters = {

                };
                var groupBy = function (data, key) {
                    let groupByArray = data.reduce((r, a) => {
                        r[a[key]] = [...r[a[key]] || [], a];
                        return r;
                    }, {});
                    return groupByArray;
                };

                function getGroupNames() {
                    commonLookupService.getGroupNameForBusinessUnit({}).success(function (data) {
                        vm.locations = data.items;
                        vm.groupByGroupName = groupBy(vm.locations, 'groupName');
                        vm.dataToIterate = [];
                        angular.forEach(vm.groupByGroupName, function (value, key) {
                            var result = [];
                            if (key == "null") {
                                result.groupName = 'No Group';
                            }
                            else {
                                result.groupName = key;
                            }
                            result.rowData = angular.copy(value);
                            vm.dataToIterate.push(result);
                        });
                    });
                };

                vm.cancel = function () {
                    $uibModalInstance.dismiss();
                };

                vm.branchSelected = function (business) {
                    $uibModalInstance.close(business);
                };

                vm.init = function () {
                    getGroupNames();
                };

                vm.init();
            }]);
