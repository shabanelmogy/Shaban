// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:164833-164860
appModule.controller('tenant.views.crs.banking.cashBankDeposit.printtemplates.printPreview', [
        '$scope', 'appSession', 'cashDepositId', '$uibModalInstance',
        function ($scope, appSession, cashDepositId, $uibModalInstance) {

            var vm = this;
            vm.cashDepositId = cashDepositId;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.getTemplateUrl = function () {

                var template = 'standard';

                if (template == 'custom')
                    return '~/App/tenant/views/crs/vouchers/payments/printTemplates/tenants/' + appSession.tenant.tenancyName.toLowerCase() + '.cshtml';
                else if (template == 'englisharabic')
                    return '~/App/tenant/views/crs/vouchers/payments/printTemplates/englisharabic.cshtml';
                else
                    return '~/App/tenant/views/crs/banking/cashBankDeposit/printTemplates/' + template + '.cshtml';
            };
        }
    ]);
