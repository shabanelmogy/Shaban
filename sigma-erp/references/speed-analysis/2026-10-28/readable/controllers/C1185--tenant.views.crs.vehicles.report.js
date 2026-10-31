// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:312490-312639
appModule.controller('tenant.views.crs.vehicles.report', ['$scope', '$stateParams', 'abp.services.app.vehicle', 'abp.services.app.commonLookup', 'abp.services.app.vehicleStatus', 'utilities',
        function ($scope, $stateParams, vehicleService, commonLookupService, vehicleStatusService, utilities) {

            var vm = this;
            vm.filters = null;
            vm.allowRateTypeChargesWithVehicle = abp.features.isEnabled("CRS.CustomFeatures.AllowRateTypeChargesWithVehicle");
            vm.replacementOfMakeAndModelInGridForVehicles = utilities.parseBoolean(abp.setting.get('App.Speed.Common.ReplacementOfMakeAndModelInGridForVehicles'));
            vm.fuelAverageforPettyCashPayment = utilities.parseBoolean(abp.setting.get("App.General.FuelAverageUsingPettyCashPayment"));
            vm.showMortgageInVehicle = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ShowMortgageInVehicle"));


            if ($scope.$parent !== null) {
                if ($scope.$parent.vmMain !== null)
                    vm.filters = $scope.$parent.vmMain.filters;
            }

            if (vm.filters === null)
                vm.filters = $stateParams.filters;

            vm.localize = function (text) {
                return app.localize(text);
            };

            if (!vm.filters.ownership) {
                vm.filters.startDate = null;
                vm.filters.endDate = null;
            }
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };
            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };
            vm.isDateBefore = function (paramDate) {
                
                return (new Date(paramDate).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0));
            }
            vm.getFuelLevel = function (value) {
                return utilities.getFuelLevel(value);
            };
            function getLocationName() {
                if (!vm.locations || !vm.filters.locationId)
                    return;
                angular.forEach(vm.locations, function (value, key) {
                    if (value.id == vm.filters.locationId) {
                        vm.locationName = value.name;
                        return;
                    }
                });
            };
            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };

            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };

            function getLocations() {
                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                    getLocationName();
                });
            }
            function getStatusName() {
                if (!vm.statuses || !vm.filters.statusId)
                    return null;
                angular.forEach(vm.statuses, function (value, key) {
                    if (value.id == vm.filters.statusId) {
                        vm.statusName = value.name;
                        return;
                    }
                });
            };
            function getVehicleStatuses() {
                vm.loading = true;
                vehicleStatusService.getVehicleStatuses({}).success(function (data) {
                    vm.statuses = data.items;
                    getStatusName();
                }).finally(function () {
                    vm.loading = false;
                });
            };
            vm.getMortgageName = function (id) {
                if (id == 0)
                    return app.localize("NonMortgage")
                if (id == 1)
                    return app.localize("Mortgage")
            };
            function init() {
                getLocations();
                if (!vm.filters.enablePurchaseDateRange) {
                    vm.filters.purchaseStartDate = null;
                    vm.filters.purchaseEndDate = null;
                }
                if (vm.filters.statusId == 'ADFL') {
                    var tempStatusId = vm.filters.statusId;
                    vm.filters.allActive = true;
                    vm.filters.statusId = '';
                } else
                    vm.filters.allActive = false;

                if (vm.showMortgageInVehicle) {
                    if (vm.filters.mortgage === 1) {
                        vm.filters.isMortgage = true;
                    } else if (vm.filters.mortgage === 2) {
                        vm.filters.isMortgage = false;
                    } else {
                        vm.filters.isMortgage = null; // important!
                    }
                }
                
                //getVehicleStatuses();
                vm.loading = true;
                if (vm.filters.statusId == 'BKD') {
                    vm.filters.dontPaginate = true;
                    vehicleService.getBookedVehicles(vm.filters).success(function (data) {
                        vm.vehicleReportData = data.items;
                    }).finally(function () {
                        vm.loading = false;
                    });
                } else {
                    vehicleService.getVehiclesReport(vm.filters).success(function (data) {
                        if (vm.filters.allActive) {

                            vm.filters.statusId = tempStatusId;
                        }
                        vm.vehicleReportData = data.items;
                    }).finally(function () {
                        vm.loading = false;
                    });
                }
            }
            init();
        }]);
