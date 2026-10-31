// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:415937-416083
appModule.controller('tenant.views.externalLogin.limoBookings.report', ['$scope', 'abp.services.app.limoTrip', '$stateParams', 'utilities', 'abp.services.app.directory', 'appSession', 'abp.services.app.externalLimoTripSearch',
        function ($scope, limoTripsService, $stateParams, utilities, directoryService, appSession, externalLimoTripSearchService) {

            var vm = this;
            vm.status = '';
            vm.totalAmount = 0;
            vm.totalSupplierCharges = 0;

            vm.filters = null;

            if ($scope.$parent !== null) {
                if ($scope.$parent.vmMain !== null)
                    vm.filters = $scope.$parent.vmMain.filters;
            }

            if (vm.filters === null)
                vm.filters = $stateParams.filters;

            vm.isCustomerLogin = false; //
            vm.contactId = appSession.user.contactId;
            vm.tenantName = appSession.tenant.tenancyName;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.flightDetailEnabled = utilities.parseBoolean(abp.setting.get("App.General.FlightDetailEnabled"));
            vm.customField1Enabled = utilities.parseBoolean(abp.setting.get("App.General.Trip_EnableCustomField1"));
            vm.customField2Enabled = utilities.parseBoolean(abp.setting.get("App.General.Trip_EnableCustomField2"));
            vm.permissions = {
                canViewCharges: abp.auth.hasPermission('Pages.Tenant.Limousine.Trips.CanViewCharges'),
                customerWebApp: abp.auth.hasPermission('Pages.Tenant.Limousine.CustomerWebApp'),
            }
            vm.manualTripNoEnabled = utilities.parseBoolean(abp.setting.get("App.General.ManualTripNoEnabled"));


            if (vm.filters.tripNo) {
                vm.filters.manualTripNo = null;
                vm.filters.fromDate = null;
                vm.filters.toDate = null;
                vm.filters.tripStatus = null;
                vm.filters.vehicle = null;
                vm.filters.customer = null;
                vm.filters.driver = null;
                vm.filters.guestName = null;
            }
            else if (vm.filters.manualTripNo && vm.filters.manualTripNo != null) {
                vm.filters.fromDate = null;
                vm.filters.toDate = null;
                vm.filters.tripStatus = null;
                vm.filters.vehicle = null;
                vm.filters.customer = null;
                vm.filters.driver = null;
                vm.filters.guestName = null;
            }

            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };
            vm.getlocalDateTimeNoYear = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('DD-MM HH:mm');
                }
                else {
                    return "";
                }
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


            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };

            vm.getTripStatus = function (status) {
                if (status == 1)
                    return app.localize("New");
                if (status == 2)
                    return app.localize("Dispatched");
                if (status == 3)
                    return app.localize("Started");
                if (status == 4)
                    return app.localize("Finished");
                if (status == 5)
                    return app.localize("Canceled");
                if (status == 6)
                    return app.localize("NoShow");
                if (status == 7)
                    return app.localize("DriverAccepted");
                if (status == 8)
                    return app.localize("DriverRejected");
                else
                    return '';
            };

            function init() {
                vm.loading = true;
                if (vm.contactId && vm.permissions.customerWebApp) {
                    directoryService.getContactInfo({
                        id: vm.contactId
                    }).success(function (result) {
                        vm.contact = result;
                    }).finally(function () {

                        if (vm.contact) {
                            if (vm.contact.contactType == 2 && vm.contact.contactCategory == 2) //if customer & company
                                vm.isCustomerLogin = true;
                        }
                    });
                }

                if (vm.filters.tripStatus)
                    vm.status = vm.getTripStatus(vm.filters.tripStatus);
                externalLimoTripSearchService.getTripsReport(vm.filters).success(function (data) {
                    vm.tripsReportData = data.items;
                    angular.forEach(vm.tripsReportData, function (value, key) {
                        vm.totalAmount += value.charges;
                        vm.totalSupplierCharges += value.supplierCharges;
                        var pickUptime = moment(value.pickupDateTime);
                        var dropOfftime = moment(value.dropOffDateTime);


                        value.duration = utilities.round((dropOfftime.diff(pickUptime, 'hours', true)), 2);
                        if (value.duration < 0)
                            value.duration = 0;
                    });
                    vm.totalAmount = utilities.round(vm.totalAmount, 2);
                    vm.totalSupplierCharges = utilities.round(vm.totalSupplierCharges, 2);
                }).finally(function () {
                    vm.loading = false;
                });
            }
            init();
        }]);
