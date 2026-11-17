// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:284894-284934
appModule.controller('tenant.views.crs.reports.surchargeVarianceReport.index', [
        '$scope', 'uiGridConstants', 'abp.services.app.surchargeVarianceReport', 'utilities', 
        function ($scope, uiGridConstants, surchargeVarianceReportAppService, utilities) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.reportData = null;

            vm.getSurchargeVarianceReport = function () {
                vm.loading = true;

                surchargeVarianceReportAppService.getSurchargeVarianceReport().success(function (result) {
                    vm.reportData = result;
                }).finally(function () {
                    vm.loading = false;
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

            function init() {
                vm.getSurchargeVarianceReport();
            }

            init();
        }
    ]);
