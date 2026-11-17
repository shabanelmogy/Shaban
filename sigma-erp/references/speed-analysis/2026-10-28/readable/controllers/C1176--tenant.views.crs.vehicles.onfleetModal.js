// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:311846-311886
appModule.controller('tenant.views.crs.vehicles.onfleetModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.vehicle','vehicleId',
        function ($scope, $uibModalInstance, vehicleService,vehicleId) {

            var vm = this;
            vm.saving = false;
            vm.isEditMod = false;

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
            vm.save = function () {
                vm.saving = true;
                vehicleService.onfleetVehicle({
                    vehicleId: vm.vehicle.id,
                    onfleetDate: vm.vehicle.onfleetDate,
                }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };

            init();
        }
    ]);
