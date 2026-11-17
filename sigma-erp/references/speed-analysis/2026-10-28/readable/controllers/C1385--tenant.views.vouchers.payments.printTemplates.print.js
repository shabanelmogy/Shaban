// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:378219-378242
appModule.controller('tenant.views.vouchers.payments.printTemplates.print', [
        '$scope', 'appSession',
        function ($scope, appSession) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.getTemplateUrl = function () {
                var template = abp.features.getValue('CRS.Vouchers.Payments.PrintTemplate').toLowerCase();
                if (template == undefined || template == '')
                    template = 'standard';

                if (template == 'custom')
                    return '~/App/tenant/views/crs/vouchers/payments/printTemplates/tenants/' + appSession.tenant.tenancyName.toLowerCase() + '.cshtml';
                else if (template == 'englisharabic')
                    return '~/App/tenant/views/crs/vouchers/payments/printTemplates/englisharabic.cshtml';
                else
                    return '~/App/tenant/views/crs/vouchers/payments/printTemplates/' + template + '.cshtml';
            };
        }
    ]);
