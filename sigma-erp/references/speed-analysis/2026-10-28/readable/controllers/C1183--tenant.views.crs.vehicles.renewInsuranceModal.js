// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:312419-312452
appModule.controller('tenant.views.crs.vehicles.renewInsuranceModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.vehicleAlerts', 'renewInsurances',
        function ($scope, $uibModalInstance, vehicleAlertService, renewInsurances) {

            var vm = this;
            vm.saving = false;
            vm.isEditMod = false;

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function init() {
                vm.loading = true;
                vm.renewInsurances = renewInsurances;
                vm.loading = false;
            }
            vm.save = function () {
                vm.saving = true;
                vehicleAlertService.renewInsurance({
                    nextInsuranceDate: vm.nextInsuranceDate,
                    insurancePolicyNo : vm.insurancePolicyNo,
                    renewInsurances: vm.renewInsurances
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
