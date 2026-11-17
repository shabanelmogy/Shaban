// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:334392-334413
appModule.controller('tenant.views.vouchers.creditNotes.printTemplates.print', [
        '$scope', 'appSession',
        function ($scope, appSession) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            vm.getTemplateUrl = function () {
                var template = abp.features.getValue('CRS.Vouchers.CreditNotes.PrintTemplate');
                if (template == undefined || template == '')
                    template = 'standard';
                if (template == 'custom')
                    return '~/App/tenant/views/crs/vouchers/creditNotes/printTemplates/tenants/' + appSession.tenant.tenancyName.toLowerCase() + '.cshtml';
                else if (template == 'englisharabic')
                    return '~/App/tenant/views/crs/vouchers/creditNotes/printTemplates/englisharabic.cshtml';
                else
                    return '~/App/tenant/views/crs/vouchers/creditNotes/printTemplates/' + template + '.cshtml';
            };
        }
    ]);
