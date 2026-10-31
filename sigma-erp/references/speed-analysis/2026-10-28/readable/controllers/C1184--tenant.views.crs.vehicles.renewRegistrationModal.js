// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:312455-312487
appModule.controller('tenant.views.crs.vehicles.renewRegistrationModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.vehicleAlerts', 'renewRegistrations',
        function ($scope, $uibModalInstance, vehicleAlertService, renewRegistrations) {

            var vm = this;
            vm.saving = false;
            vm.isEditMod = false;

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function init() {
                vm.loading = true;
                vm.renewRegistrations = renewRegistrations;
                vm.loading = false;
            }
            vm.save = function () {
                vm.saving = true;
                vehicleAlertService.renewRegistration({
                    nextRegistrationDate: vm.nextRegistrationDate,
                    renewRegistrations: vm.renewRegistrations
                }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };

            init();
        }
    ]);
