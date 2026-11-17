// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:467733-467761
appModule.controller('tenant.views.stock.purchaseReturns.printTemplates.printPreview', [
        '$scope', 'appSession', 'purchaseReturnId', '$uibModalInstance',
        function ($scope, appSession, purchaseReturnId, $uibModalInstance) {

            var vm = this;
            vm.purchaseReturnId = purchaseReturnId;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            vm.getTemplateUrl = function () {
                var template = abp.features.getValue('CRS.Vouchers.PurchaseReturns.PrintTemplate').toLowerCase();
                if (template == undefined || template == '')
                    template = 'standard';

                if (template == 'custom')
                    return '~/App/tenant/views/stock/purchaseReturns/printTemplates/tenants/' + appSession.tenant.tenancyName.toLowerCase() + '.cshtml';
                else if (template == 'englisharabic')
                    return '~/App/tenant/views/stock/purchaseReturns/printTemplates/englisharabic.cshtml';
                else
                    return '~/App/tenant/views/stock/purchaseReturns/printTemplates/' + template + '.cshtml';
            };
            
        }
    ]);
