// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:379591-379663
appModule.controller('tenant.views.crs.vouchers.provisions.report', ['$scope', 'abp.services.app.jV', '$stateParams', 'abp.services.app.commonLookup',
        function ($scope, JVService, $stateParams, commonLookupService) {

            var vm = this;
            vm.locationName = '';
            vm.totalAmount = 0;
            vm.filters = null;

            if ($scope.$parent != null) {
                if ($scope.$parent.vmMain != null)
                    vm.filters = $scope.$parent.vmMain.filters;
            }

            if (vm.filters == null)
                vm.filters = $stateParams.filters;

            if (vm.filters.voucherNo) {
                vm.filters.locationId = null;
                vm.filters.fromDate = null;
                vm.filters.toDate = null;
            }
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };
            vm.TotalAmountFunc = function () {
                var val = vm.CurrencyFormate(parseFloat(vm.totalAmount));
                return val;
            }

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
                JVService.getJVsReport(vm.filters).success(function (data) {
                    debugger
                    vm.jvReportData = data.items;
                    angular.forEach(vm.jvReportData, function (value, key) {
                        vm.totalAmount += value.amount;
                    });
                }).finally(function () {
                    vm.loading = false;
                });
            }
            init();
        }]);
