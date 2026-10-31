// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:382518-382546
appModule.controller('tenant.views.crs.vouchers.deposits.purchaseOrders.printPreview', [
        '$scope', 'appSession', 'purchaseOrderId', '$uibModalInstance',
        function ($scope, appSession, purchaseOrderId, $uibModalInstance) {

            var vm = this;
            vm.purchaseOrderId = purchaseOrderId;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

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
