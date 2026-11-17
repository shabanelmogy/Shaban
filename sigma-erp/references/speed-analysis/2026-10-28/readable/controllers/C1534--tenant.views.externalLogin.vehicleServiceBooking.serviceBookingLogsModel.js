// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:417616-417680
appModule.controller('tenant.views.externalLogin.vehicleServiceBooking.serviceBookingLogsModel', [
        '$scope', 'utilities', '$uibModal', '$uibModalInstance', 'abp.services.app.serviceBookings','serviceBooking',
        function ($scope, utilities, $uibModal, $uibModalInstance, serviceBookingsService, serviceBooking) {

            var vm = this;
            
            vm.saveAndPrint = false;
            vm.loading = false;
            vm.agreements = [];
            vm.serviceBooking = {};
            vm.filters = {};
            vm.serviceBooking = serviceBooking;

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';


            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            vm.localize = function (string) {
                return app.localize(string)
            };

            vm.getStatus = function (status) {
                if (status === 1)
                    return "Pending";
                else if (status === 2)
                    return "Confirmed";
                else if (status === 3)
                    return "Closed";
                else if (status === 4)
                    return "Cancel";
                else
                    return status;
            }

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            
            function init() {
                if (serviceBooking && serviceBooking.id) {
                    vm.loading = true;
                    serviceBookingsService.getVehicleServiceBookingLogs({
                        id: serviceBooking.id
                    }).success(function (result) {
                        vm.serviceBookingLogs = result;
                    }).finally(function () {
                        vm.loading = false;
                    });
                }
            }

            init();

        }
    ]);
