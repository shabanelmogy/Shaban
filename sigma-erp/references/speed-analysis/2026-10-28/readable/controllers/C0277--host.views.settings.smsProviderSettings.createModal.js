// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:81213-81243
appModule.controller('host.views.settings.smsProviderSettings.createModal', ['$scope', '$uibModalInstance', 'abp.services.app.hostSettings',
        function ($scope, $uibModalInstance, hostSettingsService) {

            var vm = this;
            vm.saving = false;
            vm.isEditMode = false;

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            vm.smsProvider = [
                { id: 2, name: app.localize("SmartSmsGateway") },
                { id: 3, name: app.localize("Infosat") }
            ];
            vm.save = function () {
                vm.saving = true;
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
