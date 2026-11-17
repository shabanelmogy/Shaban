// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:309563-309608
appModule.controller('tenant.views.crs.vehicles.defleetModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.vehicle', 'vehicleId',
        function ($scope, $uibModalInstance, vehicleService, vehicleId) {

            var vm = this;
            vm.saving = false;
            vm.isEditMod = false;

            vm.filters = {
                name: '',
                makeId: null
            };
            vm.save = function () {
                vm.saving = true;
                vehicleService.defleetVehicle({
                    vehicleId: vm.vehicle.id,
                    defleetDate: vm.vehicle.deFleetDate,
                    deFleetReason: vm.vehicle.deFleetReason,
                }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function init() {
                vehicleService.getVehicleForEdit({
                    id: vehicleId
                }).success(function (result) {
                    vm.vehicle = result;
                    if (vm.vehicle.id > 0) {
                        vm.isEditMod = true;
                    } else {
                        vm.isEditMod = false;
                    }
                });
            }

            init();
        }
    ]);
