// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:340810-340923
appModule.controller('tenant.views.crs.vouchers.deposits.report', ['$scope', 'abp.services.app.deposit', '$stateParams', 'utilities',
        function ($scope, depositService, $stateParams, utilities) {

            var vm = this;
            vm.billingMethodName = '';
            vm.locationName = '';
            vm.totalAmount = 0;
            vm.totalUsedAmount = 0;
            vm.totalRefundedAmount = 0;
            vm.totalBalance = 0;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.filters = null;

            if ($scope.$parent != null) {
                if ($scope.$parent.vmMain != null)
                    vm.filters = $scope.$parent.vmMain.filters;
            }

            if (vm.filters == null)
                vm.filters = $stateParams.filters;

            vm.filters.doNotPaginate = true;
            if (vm.filters.voucherNo) {
                vm.filters.agreementNo = null;
                vm.filters.customer = null;
                vm.filters.fromDate = null;
                vm.filters.toDate = null;
            }
            else if (vm.filters.agreementNo) {
                vm.filters.customer = null;
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

            vm.getType = function (voucherSubTypeId) {
                if (voucherSubTypeId == 11)
                    return app.localize("PreAuthorizationDeposit");
                if (voucherSubTypeId == 12)
                    return app.localize("CashDeposit");
                if (voucherSubTypeId == 13)
                    return app.localize("ChequeDeposit");
                if (voucherSubTypeId == 20)
                    return app.localize("CreditCardDeposit");
                else
                    return "";
            };

            vm.getTypeReport = function (row) {
                if (!row) return ' ';
                if (row.voucherSubTypeId == 12)
                    return row.billingDetail.billingMethod.name;
                else
                    return vm.getType(row.voucherSubTypeId);

            };

            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };


            vm.currencyAndRoundingWithThree = function (value) {
                if (value == null) return null;

                return value.toLocaleString('en', { minimumFractionDigits: 3, maximumFractionDigits: 3 })
            };

            vm.FloatFormat = function (amount) {
                var val = vm.CurrencyFormate(parseFloat(amount));
                return val;
            }
            function init() {
                vm.loading = true;

                if (vm.filters.depositsSearchFilter == 3) {
                    vm.filters.fromDate = moment().startOf('day');
                    vm.filters.toDate = moment().endOf('day');

                }
                depositService.getDeposits(vm.filters).success(function (data) {
                    vm.depositReportData = data.items;
                    angular.forEach(vm.depositReportData, function (value, key) {
                        vm.totalAmount += value.amount;
                        vm.totalUsedAmount += value.usedAmount;
                        vm.totalRefundedAmount += value.refundedAmount;
                        vm.totalBalance += value.balance;
                    });
                    //vm.totalAmount = vm.totalAmount;
                    //vm.totalUsedAmount = vm.totalUsedAmount;
                    //vm.totalRefundedAmount = vm.totalRefundedAmount;
                    //vm.totalBalance = vm.totalBalance;

                }).finally(function () {
                    vm.loading = false;
                });
            }
            init();
        }]);
