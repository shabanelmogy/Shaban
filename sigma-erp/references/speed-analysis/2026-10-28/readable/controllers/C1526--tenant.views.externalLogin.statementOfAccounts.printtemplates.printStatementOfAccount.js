// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:416787-416934
appModule.controller('tenant.views.externalLogin.statementOfAccounts.printtemplates.printStatementOfAccount', ['$scope', 'utilities', 'abp.services.app.statementOfAccountExternal', 'appSession', 'abp.services.app.receivableAgeAnalysisReport',
        function ($scope, utilities, statementOfAccountsServiceExternal, appSession, receivableAgeAnalysisReportService) {

            var vm = this;
            vm.filters = {};

            if ($scope.$parent) {
                if ($scope.$parent.vmMain && $scope.$parent.vmMain.filters)
                    vm.filters = $scope.$parent.vmMain.filters;
            }

            vm.tenantName = appSession.tenant.name;
            vm.fileName = appSession.tenant.tenancyName.toLowerCase() + '-' + 'header.png';
            vm.showFooter = appSession.tenant.tenancyName.toLowerCase() == 'carleaserentacar' && vm.filters.contactType == 2;
            vm.agreementType = '';
            vm.locationName = '';
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


            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            vm.getVoucherType = function (type, subType) {
                return utilities.getVoucherType(type, subType);
            };



            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            }


            vm.getTypeById = function (row) {

                if (row.voucherSubTypeId == 12) {
                    if (row.billingDetail)
                        return row.billingDetail.billingMethod.name;
                    else
                        return null;
                }
                else
                    return getType(row.voucherSubTypeId);

            };

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
            vm.getAgeAnalysisReport = function () {
                vm.loading = true;
                receivableAgeAnalysisReportService.getAgeAnalysisReport({ asOfDate: moment().endOf('day'), customerId: vm.filters.customer.id }).success(function (data) {
                    vm.data = data.list; 
                    vm.result = data;

                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.getDepositsOnCustomerData = function () {
                if (vm.filters.contactId) {
                    statementOfAccountsServiceExternal.getDepositsOnCustomer(vm.filters).success(function (result) {
                        vm.depositsOnCustomerData = result;
                        vm.depositSum = 0;
                        vm.depositSum = vm.depositsOnCustomerData.reduce(function (previous, current) {
                            return previous + (current.amount - current.alreadyAllocated - current.refunded);
                        }, 0);
                    }).finally(function () {
                        vm.loading = false;
                    });
                }
            };

            function init() {
                vm.loading = true;
                if (!angular.isUndefined(vm.filters.customer)) {
                    vm.filters.contactId = vm.filters.customer.id;
                }

                if (vm.filters.statementOfAccountSearchFilter == 2 && vm.filters.contactType == 2) {
                    statementOfAccountsServiceExternal.getOutStandingInvoices(vm.filters).success(function (result) {
                        vm.statementOfAccount = result;
                        vm.getdebitAndCredit();
                        vm.getAgeAnalysisReport();
                    }).finally(function () {
                        vm.getDepositsOnCustomerData();
                        vm.loading = false;
                    });
                }
                else {
                    statementOfAccountsServiceExternal.getStatementOfAccounts(vm.filters).success(function (result) {
                        vm.statementOfAccount = result;
                        vm.getdebitAndCredit();
                    }).finally(function () {
                        vm.getDepositsOnCustomerData();
                        vm.loading = false;
                    });
                }
            }
            init();
        }]);
