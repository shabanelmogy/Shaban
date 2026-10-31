// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:319309-319348
appModule.controller('tenant.views.vehicle.vehicleTypes.checklist.createOrEditModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.checkList', 'checklistId', 'vehicleTypeId',
        function ($scope, $uibModalInstance, checkListService, checklistId, vehicleTypeId) {
            var vm = this;
            vm.saving = false;
            vm.checklist = null;

            vm.save = function () {
                if (vehicleTypeId) {
                    vm.saving = true;
                    checkListService.createOrUpdateVehicleTypeWiseCheckList({
                        checklist: vm.checklist,
                        vehicleTypeId: vehicleTypeId
                    }).success(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
                else {
                    $uibModalInstance.close(vm.checklist);
                }
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
           
            function init() {
                checkListService.getCheckListForEdit({
                    id: checklistId
                }).success(function (result) {
                    vm.checklist = result;
                });
            }

            init();
        }
    ]);
