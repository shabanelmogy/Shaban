// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:250544-250619
appModule.controller('tenant.views.crs.limousine.trips.holidayTaxiApiLogsReport', ['$scope', 'abp.services.app.limoTrip', '$stateParams', 'utilities', 'abp.services.app.directory', 'appSession', 'abp.services.app.limoTripSearch',
        function ($scope, limoTripsService, $stateParams, utilities, directoryService, appSession, limoTripSearchService) {

            var vm = this;

            vm.filters = null;

            if ($scope.$parent !== null) {
                if ($scope.$parent.vmMain !== null)
                    vm.filters = $scope.$parent.vmMain.filters;
            }

            if (vm.filters === null)
                vm.filters = $stateParams.filters;

            vm.contactId = appSession.user.contactId;
            vm.tenantName = appSession.tenant.name;
            vm.tenancyName = appSession.tenant.tenancyName.toLowerCase();
            vm.tenantId = appSession.tenant.tenantId;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

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

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            function init() {
                vm.loading = true;
                limoTripsService.getHolidayTaxiApiLogs(vm.filters).success(function (data) {
                    vm.apiLogs = data.items;
                    angular.forEach(vm.apiLogs, function (value, key) {
                    });
                }).finally(function () {
                    vm.loading = false;
                });
            }
            init();
        }]);
