// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:417409-417612
appModule.controller('tenant.views.externalLogin.vehicleServiceBooking.index', [
        '$scope', 'abp.services.app.vehicleServiceBookingExternal','$uibModal',
        function ($scope, vehicleServiceBookingExternalService, $uibModal) {
            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.permissions = {
                create: abp.auth.hasPermission('Page.ExternaLogin.VehicleServiceBooking.Add'),
                edit: abp.auth.hasPermission('Page.ExternaLogin.VehicleServiceBooking.Edit'),
                'delete': abp.auth.hasPermission('Page.ExternaLogin.VehicleServiceBooking.Delete'),
                'cancel': abp.auth.hasPermission('Page.ExternaLogin.VehicleServiceBooking.Cancel')
            };

            vm.filters = {
                enableDateRange: false,
                statuses: [{ "id": 1, "name": app.localize("Pending") }, { "id": 2, "name": app.localize("Confirmed") }]
            };

            function getStatuses() {
                vm.statuses = [{ id: 1, name: app.localize("Pending") }, { id: 2, name: app.localize("Confirmed") }, { id: 3, name: app.localize("Closed") }, { id: 4, name: app.localize("Cancel") }];
            };

            //vm.statusChanged = function () {
            //    vm.filters.enableDateRange = true;
            //};

            function initDate() {
                vm.dateRangeModel = {
                    startDate: moment().add(-29, 'days').startOf('day'),
                    endDate: moment().endOf('day')
                };
            }

            //vm.dateRangeModel = {
            //    startDate: moment().add(-29, 'days').startOf('day'),
            //    endDate: moment().endOf('day')
            //};
            vm.dateRangeModelChanged = function () {
                vm.filters.startDate = vm.dateRangeModel.startDate;
                vm.filters.endDate = vm.dateRangeModel.endDate;
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
            };

            function openCreateVehicleServiceBookingModal(booking) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/externalLogin/vehicleServiceBooking/createOrEditModal.cshtml',
                    controller: 'tenant.views.externalLogin.vehicleServiceBooking.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        serviceBooking: function () {
                            return booking;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getOpenServiceRequests();
                });
            }

            vm.createVehicleServiceBooking = function () {
                openCreateVehicleServiceBookingModal(null);
            };

            vm.updateVehicleServiceBooking = function (booking) {
                openCreateVehicleServiceBookingModal(booking);
            };

            vm.updateNotesServiceBooking = function (booking) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/externalLogin/vehicleServiceBooking/createNotesServiceBookingModal.cshtml',
                    controller: 'tenant.views.externalLogin.vehicleServiceBooking.createNotesServiceBookingModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        serviceBooking: function () {
                            return booking;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getOpenServiceRequests();
                });
            };


            vm.deleteVehicleServiceBooking = function (row) {
                abp.message.confirm(
                    app.localize('PressYesToDeleteVehicleServiceBooking'), app.localize('DeleteVehicleServiceBooking'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            vehicleServiceBookingExternalService.deleteVehicleServiceBooking({
                                id: row.id
                            }).success(function () {
                                vm.getOpenServiceRequests();
                                abp.notify.success(app.localize('SuccessfullyDeleteVehicleServiceBooking'));
                            });
                        }
                    }
                );
            };


            vm.cancelVehicleServiceBooking = function (booking) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/externalLogin/vehicleServiceBooking/cancelVehicleServiceBookingModal.cshtml',
                    controller: 'tenant.views.externalLogin.vehicleServiceBooking.cancelVehicleServiceBookingModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        serviceBooking: function () {
                            return booking;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getOpenServiceRequests();
                });
            };

            vm.getOpenServiceRequests = function () {
                vm.loading = true;
                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate !== null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                    vm.filters.toDate = vm.dateRangeModel.endDate !== null ? vm.dateRangeModel.endDate : moment().endOf('day');
                }
                else {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
                vm.filters.status = [];
                angular.forEach(vm.filters.statuses, function (value) {
                    vm.filters.status.push(value.id);
                });
                vehicleServiceBookingExternalService.getOpenServiceRequests(vm.filters)
                    .success(function (data) {
                        if (vm.dateRangeModel.startDate === null && vm.dateRangeModel.endDate === null) {
                            initDate();
                        }
                        vm.openServiceRequests = data.items;
                    }).finally(function () {
                        vm.loading = false;
                    });
            };

            vm.showVehicleServiceBookingLogs = function (row) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/externalLogin/vehicleServiceBooking/serviceBookingLogsModel.cshtml',
                    controller: 'tenant.views.externalLogin.vehicleServiceBooking.serviceBookingLogsModel as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        serviceBooking: function () {
                            return row;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    //vm.getOpenServiceRequests();
                });
            }

            vm.init = function () {
                initDate();
                vm.getOpenServiceRequests();
                getStatuses();
            }

            vm.init();
        }]);
