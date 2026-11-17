// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:317920-317968
appModule.controller('tenant.views.crs.vehicles.sourceCodes.createOrEditModal', [
        '$uibModalInstance', 'abp.services.app.sourceCode', 'sourceCodeId', 'isViewModal',
        function ($uibModalInstance, sourceCodeService, sourceCodeId, isViewModal) {

            var vm = this;
            vm.isViewModal = isViewModal;
            
            vm.saving = false;
            vm.sourceCode = null;
            vm.isEditMod = false;
            
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.save = function () {

                vm.saving = true;
                sourceCodeService.createOrUpdateSourceCode({
                    sourceCode: vm.sourceCode
                }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });

            };
            
            function init() {

                sourceCodeService.getSourceCodeForEdit({
                    id: sourceCodeId
                }).success(function (result) {
                    vm.sourceCode = result;
                   
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
