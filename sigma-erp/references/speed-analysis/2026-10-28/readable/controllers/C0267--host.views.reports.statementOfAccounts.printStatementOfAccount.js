// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:79456-79559
appModule.controller('host.views.reports.statementOfAccounts.printStatementOfAccount',
        ['$scope', 'utilities', 'abp.services.app.tenantStatementOfAccounts', 'appSession',
        function ($scope, utilities, tenantStatementOfAccountsService, appSession) {

            var vm = this;
            vm.filters = {};

            if ($scope.$parent) {
                if ($scope.$parent.vmMain && $scope.$parent.vmMain.filters)
                    vm.filters = $scope.$parent.vmMain.filters;
            }
            vm.printDate = moment().utc();
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.rounding = function (number) {
                return utilities.round(number, 2);
            };

            vm.formatBalance = function (balance) {
                if (balance != 0) {
                    return balance > 0 ? 'Dr ' + vm.CurrencyFormate(balance) : 'Cr ' + (vm.CurrencyFormate(-balance));
                }
                return balance;
            };
            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            vm.getVoucherType = function (type) {
                if (type == 1) {
                    return "Invoice";
                }
                else if (type == 2) {
                    return "Receipt";
                };
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


            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            }

            vm.formatBalanceAsDrCr = function (balance) {
                if (balance > 0)
                    return 'Dr ' + vm.CurrencyFormate(utilities.round(balance, 2));
                else if (balance < 0)
                    return 'Cr ' + vm.CurrencyFormate(utilities.round(-balance, 2));
                else
                    return "0";
            };
           
            vm.getdebitAndCredit = function () {
                vm.debitSum = 0;
                vm.creditSum = 0;
                if (vm.statementOfAccount.statement) {
                    angular.forEach(vm.statementOfAccount.statement, function (value) {
                        if (value.debit > 0)
                            vm.debitSum += value.debit;
                        if (value.credit > 0)
                            vm.creditSum += value.credit;
                    });
                }
            };

            function init() {
                vm.loading = true;
              
                if (vm.filters.statementOfAccountSearchFilter == 2) {
                    tenantStatementOfAccountsService.getTenantOutStandingInvoices(vm.filters).success(function (result) {
                        vm.statementOfAccount = result;
                        vm.getdebitAndCredit();
                    }).finally(function () {
                        vm.loading = false;
                    });
                }
                
                else {
                    tenantStatementOfAccountsService.getTenantStatementOfAccounts(vm.filters).success(function (result) {
                        vm.statementOfAccount = result;
                        vm.getdebitAndCredit();
                    }).finally(function () {
                        vm.loading = false;
                    });
                }
            }
            init();
        }]);
