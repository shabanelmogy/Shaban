// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:164660-164707
appModule.controller('tenant.views.crs.banking.cashBankDeposit.report', ['$scope', 'abp.services.app.cashBankDeposit', '$stateParams', 'utilities',
        function ($scope, cashBankDepositService, $stateParams, utilities) {

            var vm = this;
            vm.totalAmount = 0;
            vm.filters = null;

            if ($scope.$parent !== null) {
                if ($scope.$parent.vmMain !== null)
                    vm.filters = $scope.$parent.vmMain.filters;
            }

            if (vm.filters === null)
                vm.filters = $stateParams.filters;

            if (vm.filters.voucherNo) {
                vm.filters.fromDate = null;
                vm.filters.toDate = null;
                vm.filters.accountId = null;
            }

            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('YYYY-MM-DD');
                }
                else {
                    return "";
                }
            };


            function init() {
                vm.loading = true;

                cashBankDepositService.cashDepositsReport(vm.filters).success(function (data) {
                    vm.cashDepositsReportReportData = data.items;
                    angular.forEach(vm.cashDepositsReportReportData, function (value, key) {
                        vm.totalAmount += value.amount;
                    });
                    //vm.totalAmount = vm.totalAmount.toFixed(2);
                    vm.totalAmount = utilities.round(vm.totalAmount, 2);
                }).finally(function () {
                    vm.loading = false;
                });
            }
            init();
        }]);
