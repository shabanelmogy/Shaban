// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:274999-275060
appModule.controller('tenant.views.crs.reports.outStandingReport.report', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.outStandingReport', '$stateParams',
        function ($scope, $uibModal, uiGridConstants, outStandingReportService, $stateParams) {

            var vm = this;
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            
            vm.filters = null;

            if ($scope.$parent !== null && $scope.$parent.vmMain !== null) {
                vm.filters = $scope.$parent.vmMain.filters;
            }
            else
                vm.filters.contactType = vm.filters.contactType;


            vm.loading = false;
            vm.getReportData = function () {

                vm.loading = true;
                outStandingReportService.getReportData(vm.filters).success(function (data) {
                    vm.totalAmount = data.totalAmount;
                    if (vm.totalAmount != 0) {
                        vm.totalAmount = vm.totalAmount > 0 ? 'Dr ' + vm.CurrencyFormate(vm.totalAmount) : 'Cr ' + (vm.CurrencyFormate(-vm.totalAmount));
                    }
                    vm.outStandingReportData = data.outstandingList;
                    vm.outStandingReportData.totalCount = data.totalCount;
                }).finally(function () {
                    vm.loading = false;
                });

            };

            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            }

            vm.getBalance = function (balance) {
                if (balance != 0) {
                    return balance > 0 ? 'Dr ' + vm.CurrencyFormate(balance) : 'Cr ' + (vm.CurrencyFormate(-balance));
                }
                return balance;
            };

            vm.getContactType = function () {
                if (!vm.filters.contactType && vm.filters.contactType == '')
                    return null;
                if (vm.filters.contactType == 1)
                    return app.localize('Staff');
                if (vm.filters.contactType == 2)
                    return app.localize('Customers');
                if (vm.filters.contactType == 3)
                    return app.localize('Suppliers');
                return null;
            };

            vm.getReportData();
        }
    ]);
