// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:28613-28636
appModule.controller('common.views.profile.verifyTransactionPasswordModal', [
        '$scope', 'appSession', '$uibModalInstance', 'abp.services.app.profile',
        function ($scope, appSession, $uibModalInstance, profileService) {
            var vm = this;

            vm.saving = false;
            vm.passwordInfo = null; 

            vm.save = function () {
                vm.saving = true;
                profileService.verifyTransactionPassword({ id: vm.passwordInfo })
                    .success(function () {
                        abp.notify.info(app.localize('PasswordVerifiedSuccessfully'));
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
