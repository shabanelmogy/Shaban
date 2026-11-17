// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:247380-247424
appModule.controller('tenant.views.crs.limousine.tariffGroups.createOrEditModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.tariffGroup', 'tariffGroupId', 'FileUploader',
        function ($scope, $uibModalInstance, tariffGroupService, tariffGroupId, fileUploader) {

            var vm = this;
            vm.saving = false;
            vm.tariffGroup = null;
            vm.isEditMod = false;
           
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.save = function () {
                vm.saving = true;               

                tariffGroupService.createOrUpdateTariffGroup({
                    tariffGroup: vm.tariffGroup
                }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });

            };

            function init() {
                tariffGroupService.getTariffGroupForEdit({
                    id: tariffGroupId
                }).success(function (result) {
                    vm.tariffGroup = result;

                    if (vm.tariffGroup.id > 0) {
                        vm.isEditMod = true;
                    } else {
                        vm.isEditMod = false;
                    }
                });

            }

            init();
        }
    ]);
