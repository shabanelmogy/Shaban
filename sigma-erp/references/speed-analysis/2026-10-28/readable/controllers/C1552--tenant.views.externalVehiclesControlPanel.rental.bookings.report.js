// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:428699-428805
appModule.controller('tenant.views.externalVehiclesControlPanel.rental.bookings.report',
        ['$scope', '$stateParams', 'abp.services.app.externalBookingSearch', 'abp.services.app.commonLookup', 'utilities',
        function ($scope, $stateParams, externalBookingSearchService, commonLookupService, utilities) {

            var vm = this;

            if ($scope.$parent != null) {
                if ($scope.$parent.vmMain != null)
                    vm.filters = $scope.$parent.vmMain.filters;
            }

            if (vm.filters == null)
                vm.filters = $stateParams.filters;

            if (vm.filters.bookingNo) {
                vm.filters.fromDate = null;
                vm.filters.toDate = null;
                vm.filters.locationId = null;
                vm.filters.bookingStatus = null;
                vm.filters.customer = null;
                vm.filters.durationType = 1;
            }

            vm.localize = function (input) {
                return app.localize(input);
            };
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.enableManualBookingNo = utilities.parseBoolean(abp.setting.get("App.General.EnableManualBookingNo"));


            vm.agreementType = '';
            vm.locationName = '';
            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            function getAgreementTypes() {
                if (!vm.filters.agreementType) return '';
                if (vm.filters.agreementType == 1) vm.agreementType = 'Daily';
                if (vm.filters.agreementType == 2) vm.agreementType = 'Weekly';
                if (vm.filters.agreementType == 3) vm.agreementType = 'Monthly';
            };
            vm.getStatuses = function () {
                if (!vm.filters.bookingStatus) return '';
                if (vm.filters.bookingStatus == 1)
                    return app.localize("New");
                else if (vm.filters.bookingStatus == 2)
                    return app.localize("Confirmed");
                else if (vm.filters.bookingStatus == 3)
                    return app.localize("Cancelled");
                else if (vm.filters.bookingStatus == 4)
                    return app.localize("Closed");
            };
            vm.getlocalizedString = function (status) {
                return app.localize(status);
            };
            function getLocationName() {
                if (!vm.locations || !vm.filters.locationId)
                    return null;
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
            function init() {
                getLocations();
                vm.loading = true;
                if (vm.filters.agreementType)
                    getAgreementTypes();
                externalBookingSearchService.getBookingsReport(vm.filters).success(function (data) {
                    vm.bookingReportData = data.items;
                    console.clear(); console.log(vm.bookingReportData);
                }).finally(function () {
                    vm.loading = false;
                });
            }
            init();
        }]);
