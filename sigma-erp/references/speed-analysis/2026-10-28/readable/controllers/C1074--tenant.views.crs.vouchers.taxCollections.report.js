// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:285157-285241
appModule.controller('tenant.views.crs.vouchers.taxCollections.report', ['$scope', '$stateParams', 'abp.services.app.taxCollection', '$stateParams', 'abp.services.app.commonLookup', 'utilities',
        function ($scope, $stateParams, taxCollectionAppService, $stateParams, commonLookupService, utilities) {

            var vm = this;
            vm.locationName = '';
            //vm.totalCreditAmount = 0;
            //vm.totalDebitAmount = 0;
            //vm.totalDueAmount = 0;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.filters = null;

            if ($scope.$parent !== null) {
                if ($scope.$parent.vmMain !== null)
                    vm.filters = $scope.$parent.vmMain.filters;
            }

            if (vm.filters === null)
                vm.filters = $stateParams.filters;

            //if (vm.filters.voucherNo) {
            //    vm.filters.agreementNo = null;
            //    vm.filters.locationId = null;
            //    vm.filters.invoiceType = null;
            //    vm.filters.customer = null;
            //    vm.filters.fromDate = null;
            //    vm.filters.toDate = null;
            //}
            //else if (vm.filters.agreementNo) {
            //    vm.filters.locationId = null;
            //    vm.filters.invoiceType = null;
            //    vm.filters.customer = null;
            //    vm.filters.fromDate = null;
            //    vm.filters.toDate = null;
            //}
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

            vm.localize = function (input) {
                var localizeValue;
                if (input) {
                    localizeValue = app.localize(input);
                    return localizeValue;
                }
                return;
            };
            function calculateTotalTax() {
                if (vm.taxCollectionReportData) {

                    vm.totalTax = 0;
                    angular.forEach(vm.taxCollectionReportData, function (value) {
                        vm.totalTax = vm.totalTax + value.tax;
                    });
                }
            }
            function init() {
                vm.loading = true;

                taxCollectionAppService.getTaxCollectionReport(vm.filters).success(function (data) {
                    vm.taxCollectionReportData = data.items;
                    calculateTotalTax();
                }).finally(function () {
                    vm.loading = false;
                });
            }
            init();
        }]);
