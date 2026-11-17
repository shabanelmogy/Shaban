// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:416289-416318
appModule.controller('tenant.views.externalLogin.limoBookings.printTemplates.print', [
        '$scope', 'appSession',
        function ($scope, appSession) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.getTemplateUrl = function () {
                
                // Tenancy Name eastcoast
                var template = '';
                //var template = abp.features.getValue('CRS.Vouchers.Invoices.PrintTemplate').toLowerCase();
                //if (appSession.tenant.tenancyName.toLowerCase() == 'default' || appSession.tenant.tenancyName.toLowerCase() == 'eastcoast')
                //    template = 'custom';

                if (template == undefined || template == '')
                    template = 'standard';

                if (template == 'custom')
                    return '~/App/tenant/views/externalLogin/limoBookings/printTemplates/tenants/' + appSession.tenant.tenancyName.toLowerCase() + '.cshtml';
                else if (template == 'englisharabic')
                    return '~/App/tenant/views/externalLogin/limoBookings/printTemplates/englisharabic.cshtml';
                else
                    return '~/App/tenant/views/externalLogin/limoBookings/printTemplates/' + template + '.cshtml';
            };
        }
    ]);
