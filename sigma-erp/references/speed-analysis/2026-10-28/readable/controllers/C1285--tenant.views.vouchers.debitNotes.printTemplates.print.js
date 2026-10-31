// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:337989-338013
appModule.controller('tenant.views.vouchers.debitNotes.printTemplates.print', [
        '$scope', 'appSession',
        function ($scope, appSession) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            
            vm.getTemplateUrl = function () {
                var template = abp.features.getValue('CRS.Vouchers.DebitNotes.PrintTemplate').toLowerCase();
                
                if (template == undefined || template == '')
                    template = 'standard';

                if (template == 'custom')
                    return '~/App/tenant/views/crs/vouchers/debitNotes/printTemplates/tenants/' + appSession.tenant.tenancyName.toLowerCase() + '.cshtml';
                else if (template == 'englisharabic')
                    return '~/App/tenant/views/crs/vouchers/debitNotes/printTemplates/englisharabic.cshtml';
                else
                    return '~/App/tenant/views/crs/vouchers/debitNotes/printTemplates/' + template + '.cshtml';
            };
        }
    ]);
