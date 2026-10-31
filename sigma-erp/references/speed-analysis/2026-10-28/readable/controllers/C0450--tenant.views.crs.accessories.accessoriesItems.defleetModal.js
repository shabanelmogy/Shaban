// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:115880-115926
appModule.controller('tenant.views.crs.accessories.accessoriesItems.defleetModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.accessory', 'vehicleId',
        function ($scope, $uibModalInstance, accessoriesService, vehicleId) {

            var vm = this;
            vm.saving = false;
            vm.isEditMod = false;

            vm.filters = {
                name: '',
                makeId: null
            };
            vm.save = function () {

                vm.saving = true;
                accessoriesService.defleetAccessory({
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

            init();
        }
    ]);
