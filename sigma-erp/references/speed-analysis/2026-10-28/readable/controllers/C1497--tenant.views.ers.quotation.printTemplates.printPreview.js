// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:408584-408613
appModule.controller('tenant.views.ers.quotation.printTemplates.printPreview', [
        '$scope', 'appSession', 'quotationId', '$uibModalInstance',
        function ($scope, appSession, quotationId, $uibModalInstance) {
            
            var vm = this;
            vm.quotationId = quotationId;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.getTemplateUrl = function () {
               // var template = abp.features.getValue('CRS.Vouchers.Receipts.PrintTemplate').toLowerCase();
                var template = abp.features.getValue('ERS.QuotationPrintTemplate').toLowerCase();
                if (template == undefined || template == '')
                    template = 'standard';

                if (template == 'custom')
                    return '~/App/tenant/views/ers/quotation/printTemplates/tenants/' + appSession.tenant.tenancyName.toLowerCase() + '.cshtml';
                else if (template == 'englisharabic')
                    return '~/App/tenant/views/ers/quotation/printTemplates/englisharabic.cshtml';
                else
                    return '~/App/tenant/views/ers/quotation/printTemplates/' + template + '.cshtml';
            };
        }
    ]);
