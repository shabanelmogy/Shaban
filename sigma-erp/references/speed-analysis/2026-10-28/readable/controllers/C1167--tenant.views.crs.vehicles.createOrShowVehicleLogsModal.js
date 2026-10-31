// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:308269-308320
appModule.controller('tenant.views.crs.vehicles.createOrShowVehicleLogsModal', [
        '$uibModalInstance', 'abp.services.app.vehicle', 'vehicle',
        function ($uibModalInstance, vehicleService, vehicle) {
            var vm = this;

            vm.newVehicleLog = { vehicleId: vehicle.id };
            vm.vehicle = vehicle;
            vm.vehicleLogs = [];

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.cancel = function () {
                $uibModalInstance.close();
            };

            init();

            function init() {
                getVehicleLogs();
            }

            function getVehicleLogs() {
                vm.loading = true;
                vehicleService.getVehicleLogs({ id: vehicle.id }).success(function (data) {
                    vm.vehicleLogs = data;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            vm.saveLog = function () {
                vm.loading = true;
                vehicleService.createVehicleLog(vm.newVehicleLog).success(function (data) {
                    vm.newVehicleLog.notes = "";
                    getVehicleLogs();
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.getlocalDateTime = function (date) {
                if (date !== null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };
        }
    ]);
