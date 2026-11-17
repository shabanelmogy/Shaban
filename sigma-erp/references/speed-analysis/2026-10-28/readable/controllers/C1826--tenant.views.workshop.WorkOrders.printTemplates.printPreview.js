// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:497955-497985
appModule.controller('tenant.views.workshop.WorkOrders.printTemplates.printPreview', [
        '$scope', 'appSession', 'workOrderId', '$uibModalInstance',
        function ($scope, appSession, workOrderId, $uibModalInstance) {

            var vm = this;
            vm.workOrderId = workOrderId;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.getTemplateUrl = function () {

                var template = abp.features.getValue('WORKSHOP.WorkOrders.PrintTemplate');
              //  template = 'standard';
                if (template == undefined || template == '')
                    template = 'standard';

                if (template == 'custom')
                    return '~/App/tenant/views/workshop/WorkOrders/printTemplates/tenants/' + appSession.tenant.tenancyName.toLowerCase() + '.cshtml';
                else if (template == 'englisharabic')
                    return '~/App/tenant/views/workshop/WorkOrders/printTemplates/englisharabic.cshtml';
                else
                    return '~/App/tenant/views/workshop/WorkOrders/printTemplates/' + template + '.cshtml';
            };
        }
    ]);
