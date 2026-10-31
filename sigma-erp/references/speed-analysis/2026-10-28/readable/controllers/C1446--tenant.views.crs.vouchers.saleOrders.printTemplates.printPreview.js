// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:396432-396460
appModule.controller('tenant.views.crs.vouchers.saleOrders.printTemplates.printPreview', [
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
                var template = abp.features.getValue('CRS.Vouchers.SaleOrders.PrintTemplate').toLowerCase();
                if (template == undefined || template == '')
                    template = 'standard';

                if (template == 'custom')
                    return '~/App/tenant/views/crs/vouchers/saleOrders/printTemplates/tenants/' + appSession.tenant.tenancyName.toLowerCase() + '.cshtml';
                else if (template == 'englisharabic')
                    return '~/App/tenant/views/crs/vouchers/saleOrders/printTemplates/englisharabic.cshtml';
                else
                    return '~/App/tenant/views/crs/vouchers/saleOrders/printTemplates/' + template + '.cshtml';
            };
        }
    ]);
