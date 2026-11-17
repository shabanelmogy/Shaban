// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:316957-317229
appModule.controller('tenant.views.crs.vehicles.serviceBooking.index', [
        '$scope', 'abp.services.app.serviceBookings', '$uibModal', 'abp.services.app.directory',
        function ($scope, serviceBookingsService, $uibModal, directoryService) {
            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.customers = [];
            vm.filters = {
                enableDateRange: false,
                statuses: [{ "id": 1, "name": app.localize("Pending") }, { "id": 2, "name": app.localize("Confirmed") }]
            };

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

            vm.permissions = {
                create: abp.auth.hasPermission('Pages.Tenant.Vehicle.ServiceBookings.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.Vehicle.ServiceBookings.Edit'),
                'delete': abp.auth.hasPermission('Pages.Tenant.Vehicle.ServiceBookings.Delete'),
                'confirm': abp.auth.hasPermission('Pages.Tenant.Vehicle.ServiceBookings.Confirm'),
                'close': abp.auth.hasPermission('Pages.Tenant.Vehicle.ServiceBookings.Close')
            };

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            vm.exportToExcel = function () {
                vm.loading = true;

                serviceBookingsService.exportToExcel(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };
            // search from dropdown
            vm.searchCustomers = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 2 }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };

            // extended search using search customer popup
            vm.searchCustomerPopoup = function () {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchContactModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchContactModal as vm',
                    backdrop: 'static',
                    resolve: {
                        category: function () {
                            return null;
                        },
                        type: function () {
                            return 2;
                        }
                    }
                }).result.then(function (customer) {
                    if (customer != null) {
                        vm.filters.customer = customer;
                    }
                });
            };
            vm.statusChanged = function () {
                vm.filters.enableDateRange = true;
            };

            function getStatuses() {
                vm.statuses = [{ id: 1, name: app.localize("Pending") }, { id: 2, name: app.localize("Confirmed") }, { id: 3, name: app.localize("Closed") }, { id: 4, name: app.localize("Cancel") }];
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
                    templateUrl: '~/App/tenant/views/crs/vehicles/serviceBookings/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.vehicles.serviceBooking.createOrEditModal as vm',
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
                    templateUrl: '~/App/tenant/views/crs/vehicles/serviceBookings/createNotesServiceBookingModal.cshtml',
                    controller: 'tenant.views.crs.vehicles.serviceBooking.createNotesServiceBookingModal as vm',
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
            }

            vm.deleteVehicleServiceBooking = function (row) {
                abp.message.confirm(
                    app.localize('PressYesToDeleteVehicleServiceBooking'), app.localize('DeleteVehicleServiceBooking'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            serviceBookingsService.deleteVehicleServiceBooking({
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

            vm.confirmVehicleServiceBooking = function (row) {
                abp.message.confirm(
                    app.localize('PressYesToConfirmServiceBooking'), app.localize('ConfirmBooking'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            serviceBookingsService.confirmVehicleServiceBooking({
                                id: row.id
                            }).success(function () {
                                vm.getOpenServiceRequests();
                                abp.notify.success(app.localize('SuccessfullyConfirmedVehicleServiceBooking'));
                            });
                        }
                    }
                );
            };

            vm.closeVehicleServiceBooking = function (row) {
                abp.message.confirm(
                    app.localize('PressYesToCloseVehicleServiceBooking'), app.localize('CloseVehicleServiceBooking'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            serviceBookingsService.closeVehicleServiceBooking({
                                id: row.id
                            }).success(function () {
                                vm.getOpenServiceRequests();
                                abp.notify.success(app.localize('SuccessfullyClosedVehicleServiceBooking'));
                            });
                        }
                    }
                );
            };

            vm.showVehicleServiceBookingLogs = function (row) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/serviceBookings/serviceBookingLogsModel.cshtml',
                    controller: 'tenant.views.crs.vehicles.serviceBooking.serviceBookingLogsModel as vm',
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

            vm.getOpenServiceRequests = function () {
                vm.loading = true;
                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
                }
                else {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
                vm.filters.status = [];
                angular.forEach(vm.filters.statuses, function (value) {
                    vm.filters.status.push(value.id);
                });
                serviceBookingsService.getOpenServiceRequests(vm.filters)
                    .success(function (data) {
                        if (vm.dateRangeModel.startDate == null && vm.dateRangeModel.endDate == null) {
                            initDate();
                        }
                        vm.openServiceRequests = data.items;
                    }).finally(function () {
                        vm.loading = false;
                    });
            }

            vm.init = function () {
                initDate();
                vm.getOpenServiceRequests();
                getStatuses();
            }

            vm.init();
        }]);
