// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:253632-253824
appModule.controller('tenant.views.crs.limousine.trips.report', ['$scope', 'abp.services.app.limoTrip', '$stateParams', 'utilities', 'abp.services.app.directory', 'appSession', 'abp.services.app.limoTripSearch',
        function ($scope, limoTripsService, $stateParams, utilities, directoryService, appSession, limoTripSearchService) {

            var vm = this;
            vm.status = '';
            vm.totalAmount = 0;
            vm.sumAmount = 0;
            vm.taxSum = 0;
            vm.allowTripDispatchSubstatus = utilities.parseBoolean(abp.setting.get("App.General.Limo.AllowTripDispatchSubstatus"));
            vm.currentFuelPrice = parseFloat(abp.setting.get("App.General.CurrentFuelPrice"));
            vm.hideSpecificColoumns = utilities.parseBoolean(abp.setting.get("App.General.HideSpecificColoumnsInTripReport"));
            vm.isLimoDriverNotesEnabled = abp.features.isEnabled('CRS.LimoDriverNotes');
            vm.separateDateAndTime = utilities.parseBoolean(abp.setting.get("App.General.Limo.SeparateDateAndTime"));
            vm.customerExperience = utilities.parseBoolean(abp.setting.get("App.General.Limo.CustomerExperienceInTripReport"));
            vm.donotShowExtraFieldsInTrip = utilities.parseBoolean(abp.setting.get("App.General.Limo.DonotShowExtraFieldsInTrip"));
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
            vm.tenantName = appSession.tenant.name;
            vm.tenancyName = appSession.tenant.tenancyName.toLowerCase();
            vm.tenantId = appSession.tenant.tenantId;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.flightDetailEnabled = utilities.parseBoolean(abp.setting.get("App.General.FlightDetailEnabled"));
            vm.customField1Enabled = utilities.parseBoolean(abp.setting.get("App.General.Trip_EnableCustomField1"));
            vm.customField2Enabled = utilities.parseBoolean(abp.setting.get("App.General.Trip_EnableCustomField2"));
            vm.isInvoiceToEnabled = abp.features.isEnabled('CRS.Limousine.InvoiceTo');
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
                vm.filters.invoceTo = null;
                vm.filters.driver = null;
                vm.filters.guestName = null;
            }
            else if (vm.filters.manualTripNo && vm.filters.manualTripNo != null) {
                vm.filters.fromDate = null;
                vm.filters.toDate = null;
                vm.filters.tripStatus = null;
                vm.filters.vehicle = null;
                vm.filters.customer = null;
                vm.filters.invoceTo = null;
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
                if (vm.separateDateAndTime) {
                    if (date != null) {
                        var localTime = moment.utc(date);
                        var localDateTime = localTime.local();
                        return localDateTime.format('DD-MM HH:mm');
                    } else {
                        return "";
                    }
                } else {
                    if (date != null) {
                        var localTime = moment.utc(date).toDate();
                        return moment(localTime).format('DD-MM HH:mm');
                    } else {
                        return "";
                    }
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
            vm.currencyAndRounding = function (value) {
                if (value == null) return null;

                return value.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
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
                if (status == 9)
                    return app.localize("Assigned");
                if (status == 10)
                    return app.localize("Tentative");
                else
                    return '';
            };

            vm.getTripSubStatus = function (status) {

                if (status == 1)
                    return app.localize("DriverReady");
                else if (status == 2)
                    return app.localize("DriverMovedForPickup");
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
                limoTripSearchService.getTripsReport(vm.filters).success(function (data) {
                    vm.tripsReportData = data.items;
                    angular.forEach(vm.tripsReportData, function (value, key) {
                        vm.totalAmount += value.charges;
                        vm.taxSum += value.tax;
                        vm.sumAmount += (value.charges - value.tax);
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
