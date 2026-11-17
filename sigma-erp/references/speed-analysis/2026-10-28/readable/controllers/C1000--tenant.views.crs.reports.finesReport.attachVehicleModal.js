// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:270236-270274
appModule.controller('tenant.views.crs.reports.finesReport.attachVehicleModal',
        ['$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.uaeFine', 'finesData', 'abp.services.app.vehicle',
        function ($scope, $uibModal, $uibModalInstance, finesService, finesData, vehicleService) {

            var vm = this;
            vm.fines = finesData;
            vm.saving = false;
            vm.vehicle = null;
            vm.applyToAll = false;

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.searchVehicles = function ($select) {
                if ($select.search == "") { vm.vehicles = null; return null; }
                return vehicleService.searchVehiclesForFines({
                    plateNo: $select.search,
                    includeDefleeted: true,
                }).then(function (response) {
                    vm.vehicles = response.data.items;
                });
            };

            vm.save = function () {
                vm.saving = true;
                finesService.attachVehicleWithFine({
                    fineId: vm.fines.id,
                    vehicelId: vm.vehicle.id,
                    applyToAll: vm.applyToAll,
                }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                }).finally(function () {
                    vm.saving = false;
                    $uibModalInstance.close(true);
                });
            };

        }]);
