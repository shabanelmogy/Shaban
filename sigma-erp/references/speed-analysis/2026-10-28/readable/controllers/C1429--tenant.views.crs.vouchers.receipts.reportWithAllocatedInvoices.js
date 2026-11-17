// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:393202-393354
appModule.controller('tenant.views.crs.vouchers.receipts.reportWithAllocatedInvoices', ['$scope', 'abp.services.app.receiptSearch', '$stateParams', 'abp.services.app.commonLookup', 'abp.services.app.billingMethod', 'utilities', 'abp.services.app.currency',
        function ($scope, receiptSearchService, $stateParams, commonLookupService, billingMethodService, utilities, currencyAppService) {

            var vm = this;
            vm.isMultiCurrencyEnabled = abp.features.isEnabled('Core.MultiCurrency');
            vm.billingMethodName = '';
            vm.locationName = '';
            vm.totalAmount = 0;
            vm.totalAllocatedAmount = 0;
            vm.totalLossOrGain = 0;
            vm.totalDueForAllocationAmount = 0;
            vm.filters = null;

            if ($scope.$parent != null) {
                if ($scope.$parent.vmMain != null)
                    vm.filters = $scope.$parent.vmMain.filters;
            }

            if (vm.filters == null)
                vm.filters = $stateParams.filters;

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            if (vm.filters.voucherNo) {
                vm.filters.agreementNo = null;
                vm.filters.locationId = null;
                vm.filters.billingMethodId = null;
                vm.filters.customer = null;
                vm.filters.fromDate = null;
                vm.filters.toDate = null;
            }
            else if (vm.filters.agreementNo) {
                vm.filters.locationId = null;
                vm.filters.billingMethodId = null;
                vm.filters.customer = null;
                //vm.filters.fromDate = null;
                //vm.filters.toDate = null;
            }

            if (vm.filters.voucherSubTypeId == 25)
                vm.receiptType = app.localize('ContactReceipt');
            else if (vm.filters.voucherSubTypeId == 26)
                vm.receiptType = app.localize('GeneralReceipt');
            else if (vm.filters.voucherSubTypeId == 35)
                vm.receiptType = app.localize('AssetSaleReceipt');
            else if (vm.filters.voucherSubTypeId == 69)
                vm.receiptType = app.localize('StaffReceipt');
            else if (vm.filters.voucherSubTypeId == 1003)
                vm.receiptType = app.localize('StaffAdvanceReceipt');
            else if (vm.filters.voucherSubTypeId == 1004)
                vm.receiptType = app.localize('StaffLoanReceipt');


            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };
            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };
            vm.getAgreementTypes = function () {
                if (!vm.filters.agreementType) return '';
                if (vm.filters.agreementType == 1) return 'Daily';
                if (vm.filters.agreementType == 2) return 'Weekly';
                if (vm.filters.agreementType == 3) return 'Monthly';

            };

            function getAllCurrencies() {
                currencyAppService.getCurrencies().then(function (response) {
                    vm.allCurrencies = response.data.items;
                    vm.baseCurrency = vm.allCurrencies.filter(p => p.isBase);
                    vm.baseCurrencyCode = vm.baseCurrency[0].code;
                });
            };
            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            vm.FloatFormate = function () {
                var val = vm.CurrencyFormate(parseFloat(vm.totalAmount));
                return val;
            };

            function init() {

                if (vm.filters) {
                    if (vm.filters.locationId) {
                        commonLookupService.getLocations({}).success(function (data) {
                            vm.locations = data.items;

                            if (vm.locations) {
                                angular.forEach(vm.locations, function (value) {
                                    if (value.id === vm.filters.locationId) {
                                        vm.locationName = value.name;
                                        return;
                                    }
                                });
                            }
                        });
                    }
                }

                getReceiptsWithAllocatedInvoiceReport();
                if (vm.isMultiCurrencyEnabled) {
                    getAllCurrencies();
                }
            }



            function getReceiptsWithAllocatedInvoiceReport() {
                vm.loading = true;
                receiptSearchService.getReceiptsWithAllocatedInvoiceReport(vm.filters).success(function (data) {
                    vm.receiptReportData = data.items;
                    angular.forEach(vm.receiptReportData, function (value, key) {
                        vm.totalAmount += vm.rounding(value.amount);
                        vm.totalAllocatedAmount += vm.rounding(value.allocatedAmount);
                        vm.totalDueForAllocationAmount += value.amount - value.allocatedAmount;
                        if (vm.isMultiCurrencyEnabled) {
                            value.baseAmountWithNewCurrencyRate = value.inputAmount * value.inputCurrency.currencyToBaseRate;
                            value.baseAmountWithOldCurrencyRate = value.inputAmount * value.currencyRate;
                            value.lossOrGain = value.baseAmountWithNewCurrencyRate - value.baseAmountWithOldCurrencyRate;
                            vm.totalLossOrGain += value.lossOrGain;
                        }
                    });


                    if (vm.receiptReportData && vm.receiptReportData.length > 0) {
                        if (vm.filters.billingMethodId) {
                            vm.billingMethodName = vm.receiptReportData[0].billingDetail.billingMethod.name;
                        }
                    }
                }).finally(function () {
                    vm.loading = false;


                });
            }

            init();
        }]);
