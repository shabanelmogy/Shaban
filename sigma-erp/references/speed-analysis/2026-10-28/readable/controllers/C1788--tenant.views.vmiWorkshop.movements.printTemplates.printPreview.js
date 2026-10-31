// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:488038-488066
appModule.controller('tenant.views.vmiWorkshop.movements.printTemplates.printPreview', [
        '$scope', 'appSession', 'movementId', '$uibModalInstance',
        function ($scope, appSession, movementId, $uibModalInstance) {

            var vm = this;
            vm.movementId = movementId;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.getTemplateUrl = function () {
                var template = abp.features.getValue('MCC.Movements.CheckCard.PrintTemplate').toLowerCase();

                if (template == undefined || template == '')
                    template = 'standard';

                if (template == 'custom')
                    return '~/App/tenant/views/vmiWorkshop/movements/printTemplates/tenants/' + appSession.tenant.tenancyName.toLowerCase() + '.cshtml';
                else
                    return '~/App/tenant/views/vmiWorkshop/movements/printTemplates/' + template + '.cshtml';
               
            };
        }
    ]);
