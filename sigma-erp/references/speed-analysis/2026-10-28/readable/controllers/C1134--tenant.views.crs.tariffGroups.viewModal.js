// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:298365-298395
appModule.controller('tenant.views.crs.tariffGroups.viewModal', [
        '$scope', '$uibModalInstance',  'abp.services.app.tariffGroup', 'tariffGroupId',
        function ($scope, $uibModalInstance,  tariffGroupService, tariffGroupId) {

            var vm = this;
            vm.saving = false;
            vm.isEditMod = false;
            
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };


            
            function init() {
                tariffGroupService.getTariffGroupForEdit({
                    id: tariffGroupId
                }).success(function (result) {
                    vm.tariffGroup = result;
                    if (vm.tariffGroup.id > 0) {
                        vm.isEditMod = true;
                    } else {
                        vm.tariffGroup.acrissCategoryId = null;
                        vm.isEditMod = false;
                    }
                });
            }

            init();
        }
    ]);
