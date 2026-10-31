// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:81248-81275
appModule.controller('host.views.settings.smsProviderSettings.whatsAppCreateModal', ['$scope', '$uibModalInstance', 'abp.services.app.hostSettings',
        function ($scope, $uibModalInstance, hostSettingsService) {

            var vm = this;
            vm.saving = false;
            vm.isEditMode = false;

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            vm.save = function () {
                vm.saving = true;
                vm.setting.smsProvider = 4;
                hostSettingsService.createOrUpdateSmsProviderSetting(vm.setting).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };

            function init() {

            }

            init();

        }]);
