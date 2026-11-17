// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:379766-379795
appModule.controller('tenant.views.crs.vouchers.jvs.printTemplates.printPreview', [
        '$scope', 'appSession', 'JVId', '$uibModalInstance',
        function ($scope, appSession, JVId, $uibModalInstance) {

            var vm = this;
            vm.JVId = JVId;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.getTemplateUrl = function () {

                var template = abp.features.getValue('CRS.Vouchers.JVs.PrintTemplate');
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
