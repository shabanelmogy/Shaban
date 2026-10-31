// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:413429-413655
appModule.controller('tenant.views.externalLogin.bookings.index', [
        '$scope', '$state', '$uibModal', '$window', 'uiGridConstants', 'abp.services.app.externalBooking', 'abp.services.app.bookingExport',
        'abp.services.app.chargesSetting', 'abp.services.app.vehicle', 'abp.services.app.directory', 'appSession', 'abp.services.app.commonLookup', 'utilities',
        function ($scope, $state, $uibModal, $window, uiGridConstants, externalBookingService, bookingExportService, chargesSettingService, vehicleService, directoryService, appSession, commonLookupService, utilities) {

            var vm = this;
            var errorMessage = {};
            var isValid = true;
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.isSixt = appSession.tenant.tenancyName.toLowerCase() == 'sixtqatar';
            vm.loading = false;
            var todayAsString = moment().format('YYYY-MM-DD hh:mm:ss');
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.isWeeklyMonthlyEnabled = utilities.parseBoolean(abp.setting.get("App.General.WeeklyMonthlyRental"));
            vm.enableManualBookingNo = utilities.parseBoolean(abp.setting.get("App.General.EnableManualBookingNo"));

            vm.agreementTypes = null;
            vm.chargesSettings = [];
            agreement = null;


            vm.filters = {
                enableDateRange: false,
                bookingNo: null,
                plateNo: null,
                bookingStatus: null,
                agreementType: null,
                startDate: null,
                endDate: null,
                customerId: null,
                locationId: '',
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
                durationType: 1,
                manualBookingNo: null,
                statuses: [{ id: 1, name: app.localize("New") }, { id: 2, name: app.localize("Confirmed") }]
            };

            function getStatuses() {
                vm.statuses = [{ id: 1, name: app.localize("New") }, { id: 2, name: app.localize("Confirmed") }
                    , { id: 3, name: app.localize("Cancelled") }, { id: 5, name: app.localize("NoShow") }, { id: 4, name: app.localize("Closed") }
                ];
            };

            vm.getStatus = function (status) {
                if (status === 1)
                    return "Pending";
                else if (status === 2)
                    return "Confirmed";
                else if (status === 3)
                    return "Closed";
                else
                    return status;
            }

            function initDate() {
                vm.dateRangeModel = {
                    startDate: moment().add(-29, 'days').startOf('day'),
                    endDate: moment().endOf('day')
                };
            }
            vm.dateRangeModelChanged = function () {
                vm.filters.startDate = vm.dateRangeModel.startDate;
                vm.filters.endDate = vm.dateRangeModel.endDate;
            };

            //vm.statusChanged = function () {
            //    vm.filters.enableDateRange = true;
            //};

            vm.permissions = {
                view: abp.auth.hasPermission('Page.ExternaLogin.Bookings'),
                create: abp.auth.hasPermission('Page.ExternaLogin.Bookings.Add'),
                edit: abp.auth.hasPermission('Page.ExternaLogin.Bookings.Edit'),
            };

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    //return moment(localTime).format('YYYY-MM-DD HH:mm:ss');
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('YYYY-MM-DD');
                }
                else {
                    return "";
                }
            };

            vm.getlocalizedString = function (bookingStatus) {
                return app.localize(bookingStatus);
            };

            // Opening CreateAndEditBooking Modal
            function openCreateOrEditBookingModal(bookingId, chargesSettings) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/externalLogin/bookings/createOrEditModal.cshtml',
                    controller: 'tenant.views.externalLogin.bookings.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        bookingId: function () {
                            return bookingId;
                        },
                        chargesSettings: function () {
                            return chargesSettings;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getBookings();
                });

            }
            // Opening ViewBookingModal

            function openViewBookingModal(bookingId, chargesSettings) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/externalLogin/bookings/viewModal.cshtml',
                    controller: 'tenant.views.externalLogin.bookings.viewModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        bookingId: function () {
                            return bookingId;
                        },
                        chargesSettings: function () {
                            return chargesSettings;
                        }
                    }
                });
            }

            // Create Booking
            vm.createBooking = function () {
                openCreateOrEditBookingModal(null, vm.chargesSettings);
            };

            // View Booking
            vm.viewBooking = function (booking) {
                openViewBookingModal(booking.id, vm.chargesSettings);
            };

            // Edit Booking
            vm.editBooking = function (booking) {
                openCreateOrEditBookingModal(booking.id, vm.chargesSettings);
            };

            vm.cancelBooking = function (booking) {
                abp.message.confirm(
                    app.localize('CancelBookingWarningMessage', booking.name),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            externalBookingService.cancelBooking({
                                id: booking.id
                            }).success(function () {
                                vm.getBookings();
                                abp.notify.success(app.localize('SuccessfullyCancelledBooking'));
                            });
                        }
                    }
                );
            };

            function getChargesSettings() {
                vm.loading = true;

                chargesSettingService.getChargesSettings({ module: 1 }).success(function (data) {
                    vm.chargesSettings = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            // Getting All The Bookings
            vm.getBookings = function () {
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
                externalBookingService.getBookings(vm.filters).success(function (data) {
                    if (vm.dateRangeModel.startDate == null && vm.dateRangeModel.endDate == null) {
                        initDate();
                    }
                    vm.bookings = data;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function initializeFilters() {
                initDate();
                //cashe charges settings once to be used while agreement opening/editing
                getChargesSettings();
                vm.getBookings();
                //getLocations();
                getStatuses();
            }

            initializeFilters();
        }
    ]);
