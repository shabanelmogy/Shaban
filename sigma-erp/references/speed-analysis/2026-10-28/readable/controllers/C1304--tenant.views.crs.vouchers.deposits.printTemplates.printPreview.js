// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:341550-341579
appModule.controller('tenant.views.crs.vouchers.deposits.printTemplates.printPreview', [
        '$scope', 'appSession', 'deposit', '$uibModalInstance',
        function ($scope, appSession, deposit, $uibModalInstance) {

            var vm = this;
            vm.deposit = deposit;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.getTemplateUrl = function () {
                var template = abp.features.getValue('CRS.Vouchers.Deposits.PrintTemplate').toLowerCase();

                if (template == undefined || template == '')
                    template = 'standard';

                if (template == 'custom')
                    return '~/App/tenant/views/crs/vouchers/deposits/printTemplates/tenants/' + appSession.tenant.tenancyName.toLowerCase() + '.cshtml';
                else if (template == 'englisharabic')
                    return '~/App/tenant/views/crs/vouchers/deposits/printTemplates/englisharabic.cshtml';
                else
                    return '~/App/tenant/views/crs/vouchers/deposits/printTemplates/' + template + '.cshtml';
            };
        }
    ]);
