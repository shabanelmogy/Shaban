// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:116494-116534
appModule.controller('tenant.views.crs.accessories.accessoriesItems.onfleetModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.accessory', 'vehicleId',
        function ($scope, $uibModalInstance, accessoriesService, vehicleId) {

            var vm = this;
            vm.saving = false;
            vm.isEditMod = false;

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };


            function init() {
                accessoriesService.getAccessoryForEdit({
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
                accessoriesService.onfleetAccessory({
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
