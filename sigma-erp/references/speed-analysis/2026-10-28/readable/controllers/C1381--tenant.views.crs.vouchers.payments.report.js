// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:376384-376519
appModule.controller('tenant.views.crs.vouchers.payments.report', ['$scope', 'abp.services.app.payment', '$stateParams', 'abp.services.app.commonLookup', 'utilities', 'abp.services.app.currency',
        function ($scope, paymentService, $stateParams, commonLookupService, utilities, currencyAppService) {

            var vm = this;
            vm.isAccountFeatureEnabled = abp.features.isEnabled("CRS.Accounts");
            vm.totalLossOrGain = 0;
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.isTaxOptional = utilities.parseBoolean(abp.setting.get("App.General.IsTaxOptional"));
            vm.isMultiCurrencyEnabled = abp.features.isEnabled('Core.MultiCurrency');
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));

            vm.locationName = '';
            vm.isFMSEnabled = abp.features.isEnabled("FMS");
            vm.totalAmount = 0;

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.filters = null;

            if ($scope.$parent != null) {
                if ($scope.$parent.vmMain != null)
                    vm.filters = $scope.$parent.vmMain.filters;
            }

            if (vm.filters == null)
                vm.filters = $stateParams.filters;
            if (vm.filters.voucherNo) {
                vm.filters.locationId = null;
                vm.filters.customer = null;
                vm.filters.fromDate = null;
                vm.filters.toDate = null;
                vm.filters.paymentType = null;
            }
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

            function getAllCurrencies() {
                currencyAppService.getCurrencies().then(function (response) {
                    vm.allCurrencies = response.data.items;
                    vm.baseCurrency = vm.allCurrencies.filter(p => p.isBase);
                    vm.baseCurrencyCode = vm.baseCurrency[0].code;
                });
            };

            vm.getPaymentType = function (type) {
                if (type == 6) {
                    if (vm.isAccountFeatureEnabled)
                        return app.localize('PettyCashExpensePayment')
                    else
                        return app.localize('ExpensePayment')
                }
                if (type == 3)
                    return app.localize('CustomerPayment');
                if (type == 4)
                    return app.localize('SupplierPayment');
                if (type == 5)
                    return app.localize('StaffPayment');
                if (type == 59)
                    return app.localize('StockPurchasePayment');
                if (type == 71)
                    return app.localize('AdvancePayment');
                if (type == 114)
                    return app.localize('SalaryPayment');
                if (type == 1001)
                    return app.localize('StaffAdvancePayment');
                if (type == 1002)
                    return app.localize('StaffLoanPayment');
                return '';
            };
            function getLocationName() {
                if (!vm.locations)
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

                vm.loading = true;

                if (vm.filters.locationId)
                    getLocations();

                paymentService.getPaymentsReport(vm.filters).success(function (data) {
                    vm.paymentReportData = data.items;
                    angular.forEach(vm.paymentReportData, function (value, key) {
                        vm.totalAmount += value.amount;
                        if (vm.isMultiCurrencyEnabled) {
                            value.baseAmountWithNewCurrencyRate = value.inputAmount * value.inputCurrency?.currencyToBaseRate;
                            value.baseAmountWithOldCurrencyRate = value.inputAmount * value.currencyRate;
                            value.lossOrGain = value.baseAmountWithOldCurrencyRate - value.baseAmountWithNewCurrencyRate;
                            vm.totalLossOrGain += value.lossOrGain;
                        }
                    });
                    
                    vm.totalAmount = vm.totalAmount.toFixed(2);
                }).finally(function () {
                    vm.loading = false;
                });
                if (vm.isMultiCurrencyEnabled) {
                    getAllCurrencies();
                }
            }
            init();
        }]);
