// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:300229-300253
appModule.controller('tenant.views.transportation.agreements.print', [
        '$scope', 'appSession',
        function ($scope, appSession) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.getTemplateUrl = function () {
         
                var template = abp.features.getValue('CRS.Transportation.Agreements.PrintTemplate').toLowerCase();
                if (template == undefined || template == '')
                    template = 'standard';

                if (template == 'custom')
                    return '~/App/tenant/views/crs/transportation/agreements/printtemplates/tenants/' + appSession.tenant.tenancyName.toLowerCase() + '.cshtml';
                else if (template == 'englisharabic')
                    return '~/App/tenant/views/crs/transportation/agreements/printtemplates/englisharabic.cshtml';
                else
                    return '~/App/tenant/views/crs/transportation/agreements/printtemplates/' + template + '.cshtml';
            };
        }
    ]);
