// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:28359-28382
appModule.controller('common.views.profile.changeTransactionPasswordModal', [
        '$scope', 'appSession', '$uibModalInstance', 'abp.services.app.profile',
        function ($scope, appSession, $uibModalInstance, profileService) {
            var vm = this;

            vm.saving = false;
            vm.passwordInfo = null;

            vm.save = function () {
                vm.saving = true;
                profileService.changeTransactionPassword(vm.passwordInfo)
                    .success(function () {
                        abp.notify.info(app.localize('YourPasswordHasChangedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
        }
    ]);
