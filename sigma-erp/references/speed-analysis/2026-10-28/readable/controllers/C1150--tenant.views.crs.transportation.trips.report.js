// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:300765-300856
appModule.controller('tenant.views.crs.transportation.trips.report', ['$scope', '$stateParams', 'abp.services.app.transTrip',
        function ($scope, $stateParams, transTripService) {

            var vm = this;
            vm.filters = null;

            if ($scope.$parent !== null) {
                if ($scope.$parent.vmMain !== null)
                    vm.filters = $scope.$parent.vmMain.filters;
            }

            if (vm.filters === null)
                vm.filters = $stateParams.filters;

            if (vm.filters.tripNo) {
                vm.filters.agreementNo = null;
                vm.filters.plateNo = null;
                vm.filters.startDate = null;
                vm.filters.endDate = null;
                vm.filters.tripStatus = null;
                vm.filters.customer = null;
                vm.filters.driver = null;
                vm.filters.customerId = null;
                vm.filters.driverId = null;

            }


            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm:ss';


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



            vm.getStatuses = function () {
                if (!vm.filters.tripStatus) return '';
                if (vm.filters.tripStatus == 1)
                    return app.localize("New");
                else if (vm.filters.tripStatus == 4)
                    return app.localize("Finish");
            };

            vm.getlocalizedString = function (tripStatus) {
                if (tripStatus == 1)
                    return app.localize("New");
                if (tripStatus == 4)
                    return app.localize("Finish");
            };

            vm.isExtraTrip = function (trip) {

                if (trip == false) return 'No';
                else
                    return 'Yes';

            }



            function init() {
                vm.loading = true;
                transTripService.getTransTripsReport(vm.filters).success(function (data) {
                    vm.tripReportData = data.items;
                    angular.forEach(vm.tripReportData, function (value, key) {
                        vm.totalAmount += value.amount;
                    });
                }).finally(function () {
                    vm.loading = false;
                });
            }
            init();
        }]);
