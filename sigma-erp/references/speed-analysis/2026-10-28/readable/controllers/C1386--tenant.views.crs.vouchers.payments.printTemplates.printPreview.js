// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:378246-378274
appModule.controller('tenant.views.crs.vouchers.payments.printTemplates.printPreview', [
        '$scope', 'appSession', 'payment', '$uibModalInstance',
        function ($scope, appSession, payment, $uibModalInstance) {

            var vm = this;
            vm.payment = payment;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.getTemplateUrl = function () {
                var template = abp.features.getValue('CRS.Vouchers.Payments.PrintTemplate').toLowerCase();
                if (template == undefined || template == '')
                    template = 'standard';

                if (template == 'custom')
                    return '~/App/tenant/views/crs/vouchers/payments/printTemplates/tenants/' + appSession.tenant.tenancyName.toLowerCase() + '.cshtml';
                else if (template == 'englisharabic')
                    return '~/App/tenant/views/crs/vouchers/payments/printTemplates/englisharabic.cshtml';
                else
                    return '~/App/tenant/views/crs/vouchers/payments/printTemplates/' + template + '.cshtml';
            };
        }
    ]);
