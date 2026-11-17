// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:490795-490825
appModule.controller('tenant.views.workshop.jobEstimations.printTemplates.printPreview', [
        '$scope', 'appSession', 'jobEstimationId', '$uibModalInstance',
        function ($scope, appSession, jobEstimationId, $uibModalInstance) {

            var vm = this;
            vm.jobEstimationId = jobEstimationId;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.getTemplateUrl = function () {

                var template = abp.features.getValue('WORKSHOP.JobEstimations.PrintTemplate');
              //  template = 'standard';
                if (template == undefined || template == '')
                    template = 'standard';

                if (template == 'custom')
                    return '~/App/tenant/views/workshop/jobEstimations/printTemplates/tenants/' + appSession.tenant.tenancyName.toLowerCase() + '.cshtml';
                else if (template == 'englisharabic')
                    return '~/App/tenant/views/workshop/jobEstimations/printTemplates/englisharabic.cshtml';
                else
                    return '~/App/tenant/views/workshop/jobEstimations/printTemplates/' + template + '.cshtml';
            };
        }
    ]);
