// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:311204-311287
appModule.controller('tenant.views.crs.vehicles.investorLogsModal', [
        '$uibModalInstance', '$uibModal', 'abp.services.app.vehicleInvestorsLog', 'vehicle',
        function ($uibModalInstance, $uibModal, vehicleInvestorService, vehicle) {
            var vm = this;

            vm.newVehicleLog = { vehicleId: vehicle.id };
            vm.vehicle = vehicle;
            vm.vehicleLogs = [];

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.openVehicleLogsModal = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/createOrShowInvestorLogsModal.cshtml',
                    controller: 'tenant.views.crs.vehicles.createOrShowInvestorLogsModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        investor: function () {
                            return vm.vehicleInvestorLogs.length > 0 ? vm.vehicleInvestorLogs[0] : null;
                        },
                        vehicleId: function () { return vehicle.id; }
                    }
                });
            modalInstance.result.then(function (result) {
                    vm.getVehicleLogs();
                });
            }

            vm.getVehicleLogs=function () {
                vm.loading = true;
                vehicleInvestorService.getLogsForVehicle({ id: vehicle.id }).success(function (data) {
                    vm.vehicleInvestorLogs = data;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('DD-MMM-YY');
                }
                else {
                    return "";
                }
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
            vm.cancel = function () {
                $uibModalInstance.close();
            };

            init();

            function init() {
               vm.getVehicleLogs();
            }





            //vm.saveLog = function () {
            //    vm.loading = true;
            //    vehicleService.createVehicleLog(vm.newVehicleLog).success(function (data) {
            //        vm.newVehicleLog.notes = "";
            //        getVehicleLogs();
            //    }).finally(function () {
            //        vm.loading = false;
            //    });
            //};

        }
    ]);
