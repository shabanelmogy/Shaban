// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:28238-28264
appModule.controller('common.views.profile.changePassword', [
        '$scope', 'appSession', '$uibModalInstance', 'abp.services.app.profile', 'utilities',
        function ($scope, appSession, $uibModalInstance, profileService, utilities) {
            var vm = this;

            vm.saving = false;
            vm.passwordInfo = null;

            vm.passwordValidation = function () {
                vm.checkEnterPassword = utilities.checkPassword(appSession.user.userName, vm.passwordInfo.newPassword);
            }
            vm.save = function () {
                vm.saving = true;
                profileService.changePassword(vm.passwordInfo)
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
