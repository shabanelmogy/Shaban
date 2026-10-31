// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:104901-104934
appModule.controller('tenant.views.replacementReasons.createOrEditModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.replacementReason', 'reasonId',
        function ($scope, $uibModalInstance, replacementReasonService, reasonId) {
            var vm = this;
            vm.saving = false;
            vm.reason = null;

            vm.save = function () {
                vm.saving = true;
                replacementReasonService.createOrUpdateReplacementReason({
                    reason : vm.reason,
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
                replacementReasonService.getReplacementReasonForEdit({
                    id: reasonId
                }).success(function (result) {
                    vm.reason = result;
                });
            }

            init();
        }
    ]);
