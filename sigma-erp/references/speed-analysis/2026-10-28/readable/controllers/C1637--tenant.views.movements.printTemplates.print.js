// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:450667-450689
appModule.controller('tenant.views.movements.printTemplates.print', [
        '$scope', 'appSession',
        function ($scope, appSession) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            
            vm.getTemplateUrl = function () {
                var template = abp.features.getValue('MCC.Movements.CheckCard.PrintTemplate').toLowerCase();

                if (template == undefined || template == '')
                    template = 'standard';

                if (template == 'custom')
                    return '~/App/tenant/views/mcc/movements/printTemplates/tenants/' + appSession.tenant.tenancyName.toLowerCase() + '.cshtml';
                else
                    return '~/App/tenant/views/mcc/movements/printTemplates/' + template + '.cshtml';
            };
        }
    ]);
