// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:116537-116652
appModule.controller('tenant.views.crs.accessories.accessoriesItems.report', [
        '$scope', '$stateParams', 'abp.services.app.vehicle', 'abp.services.app.accessory', 'abp.services.app.commonLookup', 'abp.services.app.vehicleStatus', 'utilities',
        function ($scope, $stateParams, vehicleService, accessoriesService, commonLookupService, vehicleStatusService, utilities) {

            var vm = this;
            vm.filters = null;

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
            function init() {
                getLocations();

                if (vm.filters.statusId == 'ADFL') {
                    var tempStatusId = vm.filters.statusId;
                    vm.filters.allActive = true;
                    vm.filters.statusId = '';
                } else
                    vm.filters.allActive = false;

                //getVehicleStatuses();
                vm.loading = true;
                if (vm.filters.statusId == 'BKD') {
                    vm.filters.dontPaginate = true;
                    accessoriesService.getBookedVehicles(vm.filters).success(function (data) {
                        vm.vehicleReportData = data.items;
                    }).finally(function () {
                        vm.loading = false;
                    });
                } else {
                    accessoriesService.getAccessoriesReport(vm.filters).success(function (data) {
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
