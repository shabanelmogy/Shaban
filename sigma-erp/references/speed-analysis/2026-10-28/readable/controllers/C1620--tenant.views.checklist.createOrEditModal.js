// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:445199-445232
appModule.controller('tenant.views.checklist.createOrEditModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.checkList', 'checklistId',
        function ($scope, $uibModalInstance, checkListService, checklistId) {
            var vm = this;
            vm.saving = false;
            vm.checklist = null;

            vm.save = function () {
                vm.saving = true;
                checkListService.createOrUpdateCheckList({
                    checklist: vm.checklist,
                }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function() {
                    vm.saving = false;
                });
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
