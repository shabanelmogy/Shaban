// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:464234-464336
appModule.controller('tenant.views.stock.grns.taxReport',
        ['$scope', '$stateParams', 'abp.services.app.grn', 'abp.services.app.commonLookup', 'utilities',
        function ($scope, $stateParams, grnService, commonLookupService, utilities) {
            var vm = this;
            vm.locationName = '';
            vm.totalCreditAmount = 0;
            vm.totalDebitAmount = 0;
            vm.totalDueAmount = 0;
            vm.IsInsuranceCompanyAndClaimNoRequired = utilities.parseBoolean(abp.setting.get("App.General.IsInsuranceCompanyAndClaimNoRequired"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.isMultiCurrencyEnabled = abp.features.isEnabled('Core.MultiCurrency');

            vm.filters = null;

            if ($scope.$parent !== null) {
                if ($scope.$parent.vmMain !== null)
                    vm.filters = $scope.$parent.vmMain.filters;
            }

            if (vm.filters === null)
                vm.filters = $stateParams.filters;

            //vm.filters = $stateParams.filters;
            if (vm.filters.voucherNo) {
                vm.filters.agreementNo = null;
                vm.filters.locationId = null;
                vm.filters.supplier = null;
                vm.filters.fromDate = null;
                vm.filters.toDate = null;
            }
            else if (vm.filters.agreementNo) {
                vm.filters.locationId = null;
                vm.filters.supplier = null;
                vm.filters.fromDate = null;
                vm.filters.toDate = null;
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


            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };


            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            vm.getStatuses = function (id) {
                if (id == 1) return app.localize("Open");
                if (id == 2) return app.localize("Closed");
            };

            
            function getLocations() {
                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                    getLocationName();
                });
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
            vm.getStatus = function (id) {
                return utilities.getVoucherStatuses(id);
            };
            function init() {
                vm.loading = true;
                getLocations();

                vm.filters.dontPaginate = true;
                grnService.getTaxReport(vm.filters).success(function (data) {
                    vm.grnReportData = data.items;
                    vm.totalTax = vm.grnReportData.reduce((accu, curr) => accu += curr.tax, 0);
                    vm.totalVatableAmount = vm.grnReportData.reduce((accu, curr) => accu += curr.vatableAmount, 0);
                    vm.totalNonVatableAmount = vm.grnReportData.reduce((accu, curr) => accu += curr.nonVatableAmount, 0);
                    vm.totalAmount = vm.grnReportData.reduce((accu, curr) => accu += curr.amount, 0);
                   
                }).finally(function () {
                    vm.loading = false;
                });
            }
            init();
        }]);
