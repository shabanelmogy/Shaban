// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:398021-398119
appModule.controller('tenant.views.crs.vouchers.stockAdjustment.report', ['$scope', 'abp.services.app.stockAdjustment', '$stateParams', 'abp.services.app.commonLookup', 'utilities',
        function ($scope, StockAdjustmentService, $stateParams, commonLookupService, utilities) {

            var vm = this;
            vm.locationName = '';
            vm.totalAmount = 0;
            vm.totalCredit = 0;
            vm.totalDebit = 0;
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

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };


            vm.TotalAmountFunc = function () {
                var val = vm.CurrencyFormate(parseFloat(vm.totalAmount));
                return val;
            }
            vm.TotalCreditFunc = function () {
                var val = vm.CurrencyFormate(parseFloat(vm.totalCredit));
                return val;
            };
            vm.TotalDebitFunc = function () {
                var val1 = vm.CurrencyFormate(parseFloat(vm.totalDebit));
                return val1;
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
                StockAdjustmentService.getStockAdjustmentReport(vm.filters).success(function (data) {
                    vm.totalCredit = 0;
                    vm.totalDebit = 0;
                    vm.reportData = data.items;
                    debugger;
                    angular.forEach(vm.reportData, function (voucher, key) {
                        angular.forEach(voucher.voucherLines, function (voucherLine, key) {
                            if (!voucherLine.hidden) {
                                if (voucherLine.credit > 0)
                                    vm.totalCredit += voucherLine.credit;
                                if (voucherLine.debit > 0)
                                    vm.totalDebit += voucherLine.debit;
                            }
                        });
                    });
                }).finally(function () {
                    vm.loading = false;
                });
            }
            init();
        }]);
