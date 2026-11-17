// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:240821-240845
appModule.controller('tenant.views.lease.leaseQuotations.printTemplates.print', [
        '$scope', 'appSession',
        function ($scope, appSession) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.getTemplateUrl = function () {
                var template = 'standard';

                //if (template == undefined || template == '')
                //   template = 'standard';

                //if (template == 'custom')
                //    return '~/App/tenant/views/crs/vouchers/receipts/printTemplates/tenants/' + appSession.tenant.tenancyName.toLowerCase() + '.cshtml';
                //else if (template == 'englisharabic')
                //    return '~/App/tenant/views/crs/vouchers/receipts/printTemplates/englisharabic.cshtml';
                //else
                return '~/App/tenant/views/crs/lease/leaseQuotations/printTemplates/' + template + '.cshtml';
            };
        }
    ]);
