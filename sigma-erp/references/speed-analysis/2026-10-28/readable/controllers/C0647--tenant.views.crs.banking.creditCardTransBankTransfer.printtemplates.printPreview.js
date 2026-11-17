// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:169740-169768
appModule.controller('tenant.views.crs.banking.creditCardTransBankTransfer.printtemplates.printPreview', [
        '$scope', 'appSession', 'creditCardTransBankTransferId', '$uibModalInstance',
        function ($scope, appSession, creditCardTransBankTransferId, $uibModalInstance) {

            var vm = this;
            vm.creditCardTransBankTransferId = creditCardTransBankTransferId;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.getTemplateUrl = function () {
                //var template = abp.features.getValue('CRS.Vouchers.Payments.PrintTemplate').toLowerCase();
                //if (template == undefined || template == '')
                var template = 'standard';

                if (template == 'custom')
                    return '~/App/tenant/views/crs/vouchers/payments/printTemplates/tenants/' + appSession.tenant.tenancyName.toLowerCase() + '.cshtml';
                else if (template == 'englisharabic')
                    return '~/App/tenant/views/crs/vouchers/payments/printTemplates/englisharabic.cshtml';
                else
                    return '~/App/tenant/views/crs/banking/creditCardTransBankTransfer/printTemplates/' + template + '.cshtml';
            };
        }
    ]);
