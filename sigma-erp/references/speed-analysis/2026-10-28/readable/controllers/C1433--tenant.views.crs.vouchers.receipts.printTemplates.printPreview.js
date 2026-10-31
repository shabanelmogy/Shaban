// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:394172-394201
appModule.controller('tenant.views.crs.vouchers.receipts.printTemplates.printPreview', [
        '$scope', 'appSession', 'receipt', '$uibModalInstance',
        function ($scope, appSession, receipt, $uibModalInstance) {
            
            var vm = this;
            vm.receipt = receipt;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

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
