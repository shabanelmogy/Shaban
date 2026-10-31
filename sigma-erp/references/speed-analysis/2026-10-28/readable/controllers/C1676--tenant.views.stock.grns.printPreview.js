// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:464409-464437
appModule.controller('tenant.views.stock.grns.printPreview', [
        '$scope', 'appSession', 'grnId', '$uibModalInstance',
        function ($scope, appSession, grnId, $uibModalInstance) {

            var vm = this;
            vm.grnId = grnId;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.getTemplateUrl = function () {
                var template = abp.features.getValue('CRS.Vouchers.GRNs.PrintTemplate').toLowerCase();
                if (template == undefined || template == '')
                    template = 'standard';

                if (template == 'custom')
                    return '~/App/tenant/views/stock/grns/printTemplates/tenants/' + appSession.tenant.tenancyName.toLowerCase() + '.cshtml';
                else if (template == 'englisharabic')
                    return '~/App/tenant/views/stock/grns/printTemplates/englisharabic.cshtml';
                else
                    return '~/App/tenant/views/stock/grns/printTemplates/' + template + '.cshtml';
            };
        }
    ]);
