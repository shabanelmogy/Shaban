// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:169555-169600
appModule.controller('tenant.views.crs.banking.creditCardTransBankTransfer.report', ['$scope', 'abp.services.app.creditCardTransBankTransfer', '$stateParams', 'utilities',
        function ($scope, creditCardTransBankTransferService, $stateParams, utilities) {

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

                creditCardTransBankTransferService.creditCardTransBankTransfersReport(vm.filters).success(function (data) {
                    vm.creditCardTransBankTransferReportData = data.items;
                    angular.forEach(vm.creditCardTransBankTransferReportData, function (value, key) {
                        vm.totalAmount += value.amount;
                    });
                    vm.totalAmount = utilities.round(vm.totalAmount, 2);
                }).finally(function () {
                    vm.loading = false;
                });
            }
            init();
        }]);
