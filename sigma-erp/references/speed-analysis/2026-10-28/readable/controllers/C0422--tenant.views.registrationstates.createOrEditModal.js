// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:104758-104792
appModule.controller('tenant.views.registrationstates.createOrEditModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.registrationState', 'registrationStateId',
        function ($scope, $uibModalInstance, registrationStateService, registrationStateId) {

            var vm = this;
            vm.saving = false;
            vm.registrationState = null;

            vm.save = function () {
                vm.saving = true;
                registrationStateService.createOrUpdateRegistrationState({
                    registrationState: vm.registrationState,
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
                registrationStateService.getRegistrationStateForEdit({
                    id: registrationStateId
                }).success(function (result) {
                    vm.registrationState = result;
                });
            }

            init();
        }
    ]);
