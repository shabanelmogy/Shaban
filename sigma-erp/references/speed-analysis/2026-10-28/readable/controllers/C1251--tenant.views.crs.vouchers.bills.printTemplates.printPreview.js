// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:329002-329031
appModule.controller('tenant.views.crs.vouchers.bills.printTemplates.printPreview', [
        '$scope', 'appSession', 'bill', '$uibModalInstance',
        function ($scope, appSession, bill, $uibModalInstance) {

            var vm = this;
            vm.bill = bill;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.getTemplateUrl = function () {
                var template = abp.features.getValue('CRS.Vouchers.Bills.PrintTemplate').toLowerCase();

                if (template == undefined || template == '')
                    template = 'standard';

                if (template == 'custom')
                    return '~/App/tenant/views/crs/vouchers/bills/printTemplates/tenants/' + appSession.tenant.tenancyName.toLowerCase() + '.cshtml';
                else if (template == 'englisharabic')
                    return '~/App/tenant/views/crs/vouchers/bills/printTemplates/englisharabic.cshtml';
                else
                    return '~/App/tenant/views/crs/vouchers/bills/printTemplates/' + template + '.cshtml';
            };
        }
    ]);
