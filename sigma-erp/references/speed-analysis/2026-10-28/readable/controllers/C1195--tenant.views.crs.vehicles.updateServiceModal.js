// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:314589-314635
appModule.controller('tenant.views.crs.vehicles.updateServiceModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.vehicleAlerts', 'serviceAlert', 'abp.services.app.vehicleService', 'abp.services.app.vehicleServiceLog',
        function ($scope, $uibModalInstance, vehicleAlertService, serviceAlert, vehicleService, vehicleServicelogService) {

            var vm = this;
            vm.saving = false;
            vm.isEditMod = false;

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            function getServicesList() {
                vm.loading = true;
                vehicleService.getVehicleServicesByModelOrDefault({ id: vm.serviceLog.model.id }).success(function (data) {
                    vm.dueServices = data.items;
                }).finally(function () {
                    vm.loading = false;
                })
            }
            function init() {
                vm.loading = true;
                vm.serviceLog = serviceAlert;
                vm.serviceLog.currentKms = vm.serviceLog.kms;
                vm.serviceLog.serviceId = vm.serviceLog.dueService.id;
                if (vm.serviceLog.lastServiceDate == null && vm.serviceLog.lastServiceKms == null) {
                    vm.showServicesList = true;
                    getServicesList();
                }
                vm.loading = false;
            }
            vm.save = function () {
                vm.saving = true;
                vm.serviceLog.vehicleId = vm.serviceLog.id;
                //vm.serviceLog.serviceId = vm.serviceLog.dueService.id,
                vm.serviceLog.kms = vm.serviceLog.serviceKms;
                vm.serviceLog.id = null;
                vehicleServicelogService.createServiceLog(vm.serviceLog).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };

            init();
        }
    ]);
