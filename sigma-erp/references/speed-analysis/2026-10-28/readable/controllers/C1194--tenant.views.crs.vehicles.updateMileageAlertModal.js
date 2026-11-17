// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:314556-314586
appModule.controller('tenant.views.crs.vehicles.updateMileageAlertModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.vehicle', 'mileageAlert',
        function ($scope, $uibModalInstance, vehicleAppService, mileageAlert) {

            var vm = this;
            vm.saving = false;
            vm.isEditMod = false;

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
           
            function init() {
                vm.loading = true;
                vm.mileageAlert = mileageAlert;
                vm.loading = false;
            }
            vm.save = function () {
                vm.saving = true;
                vm.mileageAlert.vehicleId = vm.mileageAlert.id;
                vehicleAppService.updateMileage(vm.mileageAlert).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close(vm.mileageAlert.updatedKms);
                }).finally(function () {
                    vm.saving = false;
                });
            };

            init();
        }
    ]);
