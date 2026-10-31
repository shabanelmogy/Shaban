// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:284657-284678
appModule.controller('tenant.views.crs.reports.statementOfAccounts.printTemplates.print', [
        '$scope', 'appSession',
        function ($scope, appSession) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

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
