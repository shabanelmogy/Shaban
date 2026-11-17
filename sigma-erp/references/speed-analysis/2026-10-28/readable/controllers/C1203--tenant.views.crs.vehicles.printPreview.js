// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:316683-316713
appModule.controller('tenant.views.crs.vehicles.printPreview', [
        '$scope', 'appSession', 'vehicleId','$uibModalInstance',
        function ($scope, appSession, vehicleId, $uibModalInstance) {

            var vm = this;
            vm.vehicleId = vehicleId;
            
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.getTemplateUrl = function () {

                var template = abp.features.getValue('Core.Vehicles.PrintTemplate').toLowerCase();
                if (template == undefined || template == '')
                    template = 'standardVehicle';

                if (template == 'custom')
                    return '~/App/tenant/views/crs/vehicles/printtemplates/tenants/' + appSession.tenant.tenancyName.toLowerCase() + '.cshtml';
                else if (template == 'englisharabic')
                    return '~/App/tenant/views/crs/vehicles/printtemplates/englisharabic.cshtml';
                else
                    return '~/App/tenant/views/crs/vehicles/printtemplates/' + template + '.cshtml';
               
            };
        }
    ]);
