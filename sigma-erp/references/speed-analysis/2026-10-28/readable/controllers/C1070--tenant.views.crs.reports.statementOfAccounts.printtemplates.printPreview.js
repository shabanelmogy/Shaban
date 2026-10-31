// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:284682-284708
appModule.controller('tenant.views.crs.reports.statementOfAccounts.printtemplates.printPreview', [
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
                var template = abp.features.getValue('CRS.Receivables.StatementOfAccount.PrintTemplate').toLowerCase();
                if (template == undefined || template == '')
                    template = 'standard';

                if (template == 'custom')
                    return '~/App/tenant/views/crs/reports/statementOfAccounts/printTemplates/tenants/' + appSession.tenant.tenancyName.toLowerCase() + '.cshtml';
                else
                    return '~/App/tenant/views/crs/reports/statementOfAccounts/printTemplates/' + template + '.cshtml';
            };
        }
    ]);
