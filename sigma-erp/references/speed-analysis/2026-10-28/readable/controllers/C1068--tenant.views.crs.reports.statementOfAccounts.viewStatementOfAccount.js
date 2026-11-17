// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:284557-284645
appModule.controller('tenant.views.crs.reports.statementOfAccounts.viewStatementOfAccount', [
        '$scope', '$uibModal', '$uibModalInstance', '$window', 'uiGridConstants', 'abp.services.app.statementOfAccounts', 'abp.services.app.directory', 'utilities', 'customer',
        function ($scope, $uibModal, $uibModalInstance, $window, uiGridConstants, statementOfAccountsService, directoryService, utilities, customer) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.statementOfAccount = null;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.filters = {
                contactId: null,
                fromDate: moment().startOf('month').format('YYYY-MM-DD '),
                toDate: moment().endOf('month').format('YYYY-MM-DD '),
                customer: customer
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
            
            vm.rounding = function (number) {
                return utilities.round(number, 2);
            };
            
            vm.getVoucherType = function (type, subType) {
                return utilities.getVoucherType(type, subType);
            };
            

            vm.CurrencyFormate = function(amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            }
            vm.formatBalanceAsDrCr = function (balance) {
                //staff or customer
                if (vm.contactType == 1 || vm.contactType == 2) {
                    if (balance > 0)
                        return 'Dr ' + vm.CurrencyFormate(utilities.round(balance, 2));
                    else if (balance < 0)
                        return 'Cr ' + vm.CurrencyFormate(utilities.round(-balance, 2));
                    else
                        return "0";
                }

                //supplier
                if (balance > 0)
                    return 'Cr ' + utilities.round(balance, 2);
                else if (balance < 0)
                    return 'Dr ' + utilities.round(-balance, 2);
                else
                    return "0";
            };
            
            vm.getStatementOfAccounts = function () {
                vm.loading = true;
                if (!angular.isUndefined(vm.filters.customer)) {
                    vm.filters.contactId = vm.filters.customer.id;
                }
                statementOfAccountsService.getStatementOfAccounts(vm.filters).success(function (result) {
                    vm.statementOfAccount = result;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            }
            function init() {
                vm.getStatementOfAccounts();
            }

            init();
        }
    ]);
