// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:150599-150624
appModule.controller('tenant.views.agreements.print', [
        '$scope', 'appSession',
        function ($scope, appSession) {

            var vm = this;
            
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.getTemplateUrl = function () {
                var template = abp.features.getValue('CRS.Rental.Agreements.PrintTemplate').toLowerCase();
                if (template == undefined || template == '')
                    template = 'standard';

                if (template == 'custom')
                    return '~/App/tenant/views/crs/agreements/printtemplates/tenants/' + appSession.tenant.tenancyName.toLowerCase() + '.cshtml';
                //else if (template == 'bilingual')
                //    return '~/App/tenant/views/crs/agreements/printtemplates/bilingual.cshtml';
                else if (template == 'englisharabic')
                    return '~/App/tenant/views/crs/agreements/printtemplates/englisharabic.cshtml';
                else
                     return '~/App/tenant/views/crs/agreements/printtemplates/' + template + '.cshtml';
            };
        }
    ]);
