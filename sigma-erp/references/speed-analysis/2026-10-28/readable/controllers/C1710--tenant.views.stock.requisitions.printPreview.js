// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:470574-470602
appModule.controller('tenant.views.stock.requisitions.printPreview', [
        '$scope', 'appSession', 'requisitionId', '$uibModalInstance',
        function ($scope, appSession, requisitionId, $uibModalInstance) {

            var vm = this;
            vm.requisitionId = requisitionId;

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
                    return '~/App/tenant/views/stock/requisitions/printTemplates/tenants/' + appSession.tenant.tenancyName.toLowerCase() + '.cshtml';
                else if (template == 'englisharabic')
                    return '~/App/tenant/views/stock/requisitions/printTemplates/englisharabic.cshtml';
                else
                    return '~/App/tenant/views/stock/requisitions/printTemplates/' + template + '.cshtml';
            };
        }
    ]);
