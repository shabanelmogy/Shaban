// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:28559-28610
appModule.controller('common.views.profile.mySettingsModal', [
        '$scope', '$uibModal', 'appSession', '$uibModalInstance', 'abp.services.app.profile',
        function ($scope, $uibModal, appSession, $uibModalInstance, profileService) {
            var vm = this;

            vm.isTransactionPasswordEnabled = abp.features.isEnabled("CRS.CustomFeatures.TransactionPassword");

            vm.saving = false;
            vm.user = null;
            vm.canChangeUserName = true;

            vm.save = function () {
                vm.saving = true;
                profileService.updateCurrentUserProfile(vm.user)
                    .success(function () {
                        appSession.user.name = vm.user.name;
                        appSession.user.surname = vm.user.surname;
                        appSession.user.userName = vm.user.userName;
                        appSession.user.emailAddress = vm.user.emailAddress;

                        abp.notify.info(app.localize('SavedSuccessfully'));

                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
            };

            vm.changeTransPassword = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/common/views/profile/changeTransactionPasswordModal.cshtml',
                    controller: 'common.views.profile.changeTransactionPasswordModal as vm',
                    backdrop: 'static'
                });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function init() {
                profileService.getCurrentUserProfileForEdit({
                    id: appSession.user.id
                }).success(function (result) {
                    vm.user = result;
                    vm.canChangeUserName = vm.user.userName != app.consts.userManagement.defaultAdminUserName;
                });
            }

            init();
        }
    ]);
