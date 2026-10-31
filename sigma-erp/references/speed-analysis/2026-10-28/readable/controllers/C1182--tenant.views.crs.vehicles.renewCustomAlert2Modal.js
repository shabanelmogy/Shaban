// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:312384-312416
appModule.controller('tenant.views.crs.vehicles.renewCustomAlert2Modal', [
        '$scope', '$uibModalInstance', 'abp.services.app.vehicleAlerts', 'renewCustomAlerts2',
        function ($scope, $uibModalInstance, vehicleAlertService, customAlerts2) {

            var vm = this;
            vm.saving = false;
            vm.isEditMod = false;

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function init() {
                vm.loading = true;
                vm.renewCustomAlerts2 = customAlerts2;
                vm.loading = false;
            }
            vm.save = function () {
                vm.saving = true;
                vehicleAlertService.renewCustomAlert2({
                    nextCustomAlertDate: vm.customAlert2Date,
                    renewCustomAlertDates: vm.renewCustomAlerts2
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
