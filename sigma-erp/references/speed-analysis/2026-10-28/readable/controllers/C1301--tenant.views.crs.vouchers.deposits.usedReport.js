// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:341041-341150
appModule.controller('tenant.views.crs.vouchers.deposits.usedReport', ['$scope', 'abp.services.app.deposit', '$stateParams', 'utilities',
        function ($scope, depositService, $stateParams, utilities) {

            var vm = this;
            vm.billingMethodName = '';
            vm.locationName = '';
            vm.totalAmount = 0;
            vm.totalUsedAmount = 0;
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
                }else {
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
                if (!row)
                    return ' ';
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

                if (vm.filters.voucherSubType) {
                    vm.filters.voucherSubTypeId = vm.filters.voucherSubType.voucherSubTypeId;
                    vm.filters.billingMethodType = vm.filters.voucherSubType.type;

                } else {
                    vm.filters.voucherSubTypeId = null;
                    vm.filters.billingMethodType = null;
                }
                depositService.getUsedDepositReport(vm.filters).success(function (data) {
                    vm.depositReportData = data.items;
                    angular.forEach(vm.depositReportData, function (value, key) {
                        vm.totalAmount += value.amount;
                        vm.totalUsedAmount += value.parentAmount;
                    });
                    vm.totalAmount = vm.totalAmount.toFixed(2);
                    vm.totalUsedAmount = vm.totalUsedAmount.toFixed(2);

                }).finally(function () {
                    vm.loading = false;
                });
            }
            init();
        }]);
