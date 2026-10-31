// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:177916-177939
appModule.controller('tenant.views.chauffeur.agreements.print', [
        '$scope', 'appSession',
        function ($scope, appSession) {

            var vm = this;
            
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.getTemplateUrl = function () {
                var template = abp.features.getValue('CRS.Chauffeur.Agreements.PrintTemplate').toLowerCase();
                if (template == undefined || template == '')
                    template = 'standard';

                if (template == 'custom')
                    return '~/App/tenant/views/crs/chauffeur/agreements/printtemplates/tenants/' + appSession.tenant.tenancyName.toLowerCase() + '.cshtml';
                else if (template == 'englisharabic')
                    return '~/App/tenant/views/crs/chauffeur/agreements/printtemplates/englisharabic.cshtml';
                else
                    return '~/App/tenant/views/crs/chauffeur/agreements/printtemplates/' + template + '.cshtml';
            };
        }
    ]);
