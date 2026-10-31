// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:368729-368753
appModule.controller('tenant.views.vouchers.jvs.printTemplates.print', [
        '$scope', 'appSession',
        function ($scope, appSession) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            
            vm.getTemplateUrl = function () {
                
                var template = abp.features.getValue('CRS.Vouchers.Jvs.PrintTemplate');
                if (template == undefined || template == '')
                    template = 'standard';

                if (template == 'custom')
                    return '~/App/tenant/views/crs/vouchers/jvs/printTemplates/tenants/' + appSession.tenant.tenancyName.toLowerCase() + '.cshtml';
                else if (template == 'englisharabic')
                    return '~/App/tenant/views/crs/vouchers/jvs/printTemplates/englisharabic.cshtml';
                else
                    return '~/App/tenant/views/crs/vouchers/jvs/printTemplates/' + template + '.cshtml';
            };
        }
    ]);
