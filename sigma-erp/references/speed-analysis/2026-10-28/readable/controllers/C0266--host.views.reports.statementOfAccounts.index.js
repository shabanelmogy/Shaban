// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:79244-79452
appModule.controller('host.views.reports.statementOfAccounts.index', [
        '$scope', '$uibModal', 'abp.services.app.tenantStatementOfAccounts', 'utilities', '$stateParams', 'abp.services.app.tenant',
        function ($scope, $uibModal, tenantStatementOfAccountsService, utilities, $stateParams, tenantAppService) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            vm.agreementDashboardFilters = null;
            if ($stateParams.filters) {
                vm.agreementDashboardFilters = $stateParams.filters;
            }
            vm.loading = false;
            vm.statementOfAccount = null;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.tenants = [];
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
            vm.filters = {
                tenantId: null,
                fromDate: null,
                toDate: null,
                statementOfAccountSearchFilter: 1,
                enableDateRange: true
            };
            vm.searchTenants = function ($select) {
                if ($select.search == "")
                    return null;
                tenantAppService.searchTenants({ filter: $select.search }).then(function (response) {
                    vm.tenants = response.data.items;
                });
            };
            vm.dateRangeModel = {
                startDate: null,
                endDate: null,
            };

            vm.permissions = {

                viewStatementOfAccount: abp.auth.hasPermission('Pages.Tenants.Report.TenantStatementOfAccounts'),
            };

            vm.dateRangeModelChanged = function () {
                vm.filters.startDate = vm.dateRangeModel.startDate;
                vm.filters.endDate = vm.dateRangeModel.endDate;
            };

            vm.radioButtonValueChanged = function () {
                if (vm.filters.statementOfAccountSearchFilter == 2) {
                    vm.filters.enableDateRange = false;
                    vm.getStatementOfAccounts();
                }
                    
                else if (vm.filters.statementOfAccountSearchFilter == 1) {
                    vm.filters.enableDateRange = true;
                    vm.getStatementOfAccounts();
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
            vm.getlocalDateNew = function (date) {
                if (date != null) {
                    return moment.utc(date).format('DD-MM-YYYY');
                } else {
                    return "";
                }
            };

            vm.getVoucherType = function (type){
                if (type == 1) {
                    return "Invoice";
                }
                else if (type == 2) {
                    return "Receipt";
                };
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

            vm.getStatementOfAccounts = function () {

                vm.loading = true;
                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                else {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
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

            };
          
            vm.localize = function (input) {
                if (input == null)
                    return "";

                return app.localize(input);
            };

          
            vm.StatementOfAccountPrintModal = function () {

                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate !== null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate !== null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                else {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }

                $uibModal.open({
                    templateUrl: '~/App/host/views/reports/statementOfAccounts/printtemplates/printPreview.cshtml',
                    controller: 'host.views.reports.statementOfAccounts.printtemplates.printPreview as vmMain',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });

            };

            function init() {
                if (vm.agreementDashboardFilters) {
                    vm.filters.tenant = vm.agreementDashboardFilters.tenant;
                    if (vm.filters.enableDateRange) {
                        vm.dateRangeModel.startDate = moment(moment().format('YYYY-MM-DD')).utc();
                        vm.dateRangeModel.endDate = moment(moment().format('YYYY-MM-DD')).add(1, 'month').add(-1, 'milliseconds').utc();
                    }

                    vm.dateRangeModelChanged()
                    vm.getStatementOfAccounts();
                }
            }

            init();
        }
    ]);
