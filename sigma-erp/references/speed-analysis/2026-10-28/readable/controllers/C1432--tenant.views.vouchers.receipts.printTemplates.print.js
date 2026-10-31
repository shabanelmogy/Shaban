// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:394144-394168
appModule.controller('tenant.views.vouchers.receipts.printTemplates.print', [
        '$scope', 'appSession',
        function ($scope, appSession) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.getTemplateUrl = function () {
                var template = abp.features.getValue('CRS.Vouchers.Receipts.PrintTemplate').toLowerCase();
                
                if (template == undefined || template == '')
                    template = 'standard';

                if (template == 'custom')
                    return '~/App/tenant/views/crs/vouchers/receipts/printTemplates/tenants/' + appSession.tenant.tenancyName.toLowerCase() + '.cshtml';
                else if (template == 'englisharabic')
                    return '~/App/tenant/views/crs/vouchers/receipts/printTemplates/englisharabic.cshtml';
                else
                    return '~/App/tenant/views/crs/vouchers/receipts/printTemplates/' + template + '.cshtml';
            };
        }
    ]);
