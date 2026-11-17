// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:163690-163709
appModule.controller('tenant.views.crs.banking.BankReconciliation.printPreview', [
        '$scope', 'appSession', 'filters', '$uibModalInstance',
        function ($scope, appSession, filters, $uibModalInstance) {
            debugger;
            var vm = this;
            vm.filters = filters;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.getTemplateUrl = function () {
                return '~/App/tenant/views/crs/banking/bankReconciliation/report.cshtml';
            };
        }
    ]);
