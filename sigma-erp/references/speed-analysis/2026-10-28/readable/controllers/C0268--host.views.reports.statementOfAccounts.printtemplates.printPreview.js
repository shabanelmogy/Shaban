// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:79563-79582
appModule.controller('host.views.reports.statementOfAccounts.printtemplates.printPreview', [
        '$scope', 'appSession', 'filters', '$uibModalInstance',
        function ($scope, appSession, filters, $uibModalInstance) {

            var vm = this;
            vm.filters = filters;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.getTemplateUrl = function () {            
                    return '~/App/host/views/reports/statementOfAccounts/printStatementOfAccount.cshtml';
            };
        }
    ]);
