// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:384930-384953
appModule.controller('tenant.views.vouchers.purchaseOrders.printTemplates.print', [
        '$scope', 'appSession',
        function ($scope, appSession) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.getTemplateUrl = function () {
                var template = abp.features.getValue('CRS.Vouchers.PurchaseOrders.PrintTemplate').toLowerCase();
                if (template == undefined || template == '')
                    template = 'standard';

                if (template == 'custom')
                    return '~/App/tenant/views/crs/vouchers/purchaseOrders/printTemplates/tenants/' + appSession.tenant.tenancyName.toLowerCase() + '.cshtml';
                else if (template == 'englisharabic')
                    return '~/App/tenant/views/crs/vouchers/purchaseOrders/printTemplates/englisharabic.cshtml';
                else
                    return '~/App/tenant/views/crs/vouchers/purchaseOrders/printTemplates/' + template + '.cshtml';
            };
        }
    ]);
