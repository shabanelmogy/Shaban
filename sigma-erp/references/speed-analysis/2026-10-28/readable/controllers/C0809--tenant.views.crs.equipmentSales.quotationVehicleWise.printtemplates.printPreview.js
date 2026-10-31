// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:217665-217691
appModule.controller('tenant.views.crs.equipmentSales.quotationVehicleWise.printtemplates.printPreview', [
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
                var template = abp.features.getValue('CRS.QuotationVehicleWise.PrintTemplate').toLowerCase();
                if (template == undefined || template == '')
                    template = 'standard';

                if (template == 'custom')
                    return '~/App/tenant/views/crs/equipmentSales/quotationVehicleWise/printtemplates/tenants/' + appSession.tenant.tenancyName.toLowerCase() + '.cshtml';
                else
                    return '~/App/tenant/views/crs/equipmentSales/quotationVehicleWise/printtemplates/' + template + '.cshtml';
            };
        }
    ]);
