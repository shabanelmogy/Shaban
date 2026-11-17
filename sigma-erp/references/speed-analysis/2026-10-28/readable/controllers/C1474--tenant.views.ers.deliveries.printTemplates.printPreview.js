// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:402653-402683
appModule.controller('tenant.views.ers.deliveries.printTemplates.printPreview', [
        '$scope', 'appSession', 'deliveryId', '$uibModalInstance',
        function ($scope, appSession, deliveryId, $uibModalInstance) {
            
            var vm = this;
            vm.deliveryId = deliveryId;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.getTemplateUrl = function () {
               // var template = abp.features.getValue('CRS.Vouchers.Receipts.PrintTemplate').toLowerCase();
                var template = abp.features.getValue('ERS.EquipmentDelivery.PrintTemplate');

                if (template == undefined || template == '')
                    template = 'standard';

                if (template == 'custom')
                    return '~/App/tenant/views/ers/deliveries/printTemplates/tenants/' + appSession.tenant.tenancyName.toLowerCase() + '.cshtml';
                else if (template == 'englisharabic')
                    return '~/App/tenant/views/ers/deliveries/printTemplates/englisharabic.cshtml';
                else
                    return '~/App/tenant/views/ers/deliveries/printTemplates/' + template + '.cshtml';
            };
        }
    ]);
