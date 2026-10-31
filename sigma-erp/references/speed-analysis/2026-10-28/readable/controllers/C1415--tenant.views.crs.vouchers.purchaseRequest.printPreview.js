// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:384957-384985
appModule.controller('tenant.views.crs.vouchers.purchaseRequest.printPreview', [
        '$scope', 'appSession', 'purchaseRequestId', '$uibModalInstance',
        function ($scope, appSession, purchaseRequestId, $uibModalInstance) {

            var vm = this;
            vm.purchaseRequestId = purchaseRequestId;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.getTemplateUrl = function () {
                var template = abp.features.getValue('CRS.Vouchers.PurchaseRequest.PrintTemplate').toLowerCase();
                if (template == undefined || template == '')
                    template = 'standard';

                if (template == 'custom')
                    return '~/App/tenant/views/crs/vouchers/purchaseRequest/printTemplates/tenants/' + appSession.tenant.tenancyName.toLowerCase() + '.cshtml';
                else if (template == 'englisharabic')
                    return '~/App/tenant/views/crs/vouchers/purchaseRequest/printTemplates/englisharabic.cshtml';
                else
                    return '~/App/tenant/views/crs/vouchers/purchaseRequest/printTemplates/' + template + '.cshtml';
            };
        }
    ]);
