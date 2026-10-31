// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:61755-61901
appModule.controller('host.views.companies.openAcceptOrCloseRequestModal', [
        '$scope','$filter', '$uibModal', '$uibModalInstance', 'companyId', 'isChangeRequest', 'abp.services.app.carRental', 'pageName',
        function ($scope, $filter, $uibModal, $uibModalInstance, companyId, isChangeRequest, carRentalService, pageName) {
            var vm = this;
            vm.saving = false;
            vm.isEditMod = false;
            $scope.showAllData = false;
            $scope.jsonDataDiff = null;
            $scope.previousData = {};
            $scope.filter = {
                showAllData: false
            }
            vm.enumStatus = [
                { name: "Pending", id: 0 },
                { name: "Accepted", id: 1 },
                { name: "Rejected", id: 2 },
            ];
            $scope.$watch('showAllData', function (showAllData) {
                
                if (!showAllData) {
                    // Calculate the differences between jsonDataNew and jsonDataOld
                    $scope.jsonDataDiff = findDifferences($scope.jsonDataNew, $scope.jsonDataOld);

                    // Check if there are no differences; if so, clear the jsonDataDiff
                    if (Object.keys($scope.jsonDataDiff).length === 0) {
                        $scope.jsonDataDiff = null;
                    }
                } else {
                    // If "Show all Data" is checked, clear the differences
                    $scope.jsonDataDiff = null;
                }
            });
            function findDifferences(obj1, obj2) {
                var result = {};

                // Recursively compare objects and arrays
                function diff(obj1, obj2, path) {
                    for (var key in obj1) {
                        if (angular.isObject(obj1[key])) {
                            if (!obj2 || !obj2.hasOwnProperty(key)) {
                                // If key is in obj1 but not in obj2, mark as added
                                result[path + key] =  obj1[key] ;
                                $scope.previousData[path + key] = null;
                            } else {
                                // Compare nested objects
                                diff(obj1[key], obj2[key], path + key + '.');
                            }
                        } else if (angular.isArray(obj1[key])) {
                            if (!obj2 || !angular.isArray(obj2[key])) {
                                // If key is an array in obj1 but not in obj2, mark as added
                                result[path + key] =  obj1[key] ;
                                $scope.previousData[path + key] = null;
                            } else {
                                // Compare arrays
                                var arrayDiff = obj1[key].filter(function (item) {
                                    return obj2[key].indexOf(item) === -1;
                                });

                                if (arrayDiff.length > 0) {
                                    result[path + key] = arrayDiff ;
                                    $scope.previousData[path + key] = obj2[key];
                                }
                            }
                        } else {
                            if (!obj2 || !obj2.hasOwnProperty(key)) {
                                // If key is in obj1 but not in obj2, mark as added
                                result[path + key] = obj1[key];
                                $scope.previousData[path + key] = null;
                            } else if (!angular.equals(obj1[key], obj2[key])) {
                                // If values are different, mark as modified
                                result[path + key] = obj1[key];
                                $scope.previousData[path + key] = obj2[key];
                            }
                        }
                    }

                    // Check for keys in obj2 that are not in obj1 (marked as deleted)
                    if (obj2) {
                        for (var key in obj2) {
                            if (!obj1 || !obj1.hasOwnProperty(key)) {
                                result[path + key] =  obj1[key];
                                $scope.previousData[path + key] = obj2[key];
                            }
                        }
                    }
                }

                diff(obj1, obj2, '');
                return result   ;
            }
            $scope.$watch('jsonData', function (json) {
                $scope.jsonString = $filter('json')(json);
            }, true);
            $scope.$watch('jsonString', function (json) {
                try {
                    $scope.jsonData = JSON.parse(json);
                    $scope.wellFormed = true;
                } catch (e) {
                    $scope.wellFormed = false;
                }
            }, true);
            vm.company = {
                contactPersons: new Array(),
                address: {
                    city: null,
                    country: null,
                    state: null,
                }
            };
            vm.reject = function () {
                carRentalService.updateApprovalChangeLog(companyId, vm.enumStatus[2].id).success(function (data) {
                    abp.notify.info(app.localize('Request Rejected'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            }
            vm.save = function () {
                vm.saving = true;
                console.log(pageName);
                carRentalService.updateApprovalChangeLog(companyId, vm.enumStatus[1].name, vm.carRentaId).success(function () {
                    abp.notify.info(app.localize('Request Saved Successfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            function init() {
                vm.saving = true;
                if (companyId) {
                    carRentalService.getOneChangeLogFromCarRental(companyId).success(function (data) {
                        vm.carRentalId = data.carRentalId
                        var resultNew = data.newData
                        $scope.jsonDataNew = resultNew
                        var resultOld = data.oldData
                        $scope.jsonDataOld = resultOld
                        vm.saving = false;
                        $scope.showAllData = true;                                      
                    });
                }
            }
            init();
        }
    ]);
