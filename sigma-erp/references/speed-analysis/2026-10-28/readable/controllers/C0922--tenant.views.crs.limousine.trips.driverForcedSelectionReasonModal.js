// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:250340-250365
appModule.controller('tenant.views.crs.limousine.trips.driverForcedSelectionReasonModal',
        ['$scope', '$uibModal', '$uibModalInstance','uiGridConstants',
            function ($scope, $uibModal, $uibModalInstance, uiGridConstants) {
                var vm = this;
                vm.reasonName = null;
                vm.selectionReasons = [
                    { id: 1, name: "Back to back trips" },
                    {
                        id: 2, name: "Driver stuck in traffic"
                    },
                    {
                        id: 3, name: "Assigned for hourly trips "
                    },
                    {
                        id: 4, name: "Assigned driver close to the pickup location"
                    },
                ];

                vm.ok = function () {
                    $uibModalInstance.close(vm.reasonName);
                };

                vm.cancel = function () {
                    $uibModalInstance.dismiss();
                };
            }]);
