// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:174432-174455
appModule.controller('tenant.views.bookings.print', [
        '$scope', 'appSession',
        function ($scope, appSession) {

            var vm = this;
            
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.getTemplateUrl = function () {
                var template = abp.features.getValue('CRS.Bookings.PrintTemplate').toLowerCase();
                if (template == undefined || template == '')
                    template = 'standard';

                if (template == 'custom')
                    return '~/App/tenant/views/crs/bookings/printtemplates/tenants/' + appSession.tenant.tenancyName.toLowerCase() + '.cshtml';
                else if (template == 'englisharabic')
                    return '~/App/tenant/views/crs/bookings/printtemplates/englisharabic.cshtml';
                else
                    return '~/App/tenant/views/crs/bookings/printtemplates/' + template + '.cshtml';
            };
        }
    ]);
