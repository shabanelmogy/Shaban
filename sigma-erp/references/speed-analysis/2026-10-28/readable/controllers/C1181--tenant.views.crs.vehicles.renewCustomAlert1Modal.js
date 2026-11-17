// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:312349-312381
appModule.controller('tenant.views.crs.vehicles.renewCustomAlert1Modal', [
        '$scope', '$uibModalInstance', 'abp.services.app.vehicleAlerts', 'renewCustomAlerts1',
        function ($scope, $uibModalInstance, vehicleAlertService, customAlerts1) {

            var vm = this;
            vm.saving = false;
            vm.isEditMod = false;

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function init() {
                vm.loading = true;
                vm.renewCustomAlerts1 = customAlerts1;
                vm.loading = false;
            }
            vm.save = function () {
                vm.saving = true;
                vehicleAlertService.renewCustomAlert1({
                    nextCustomAlertDate: vm.customAlert1Date,
                    renewCustomAlertDates: vm.renewCustomAlerts1
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
