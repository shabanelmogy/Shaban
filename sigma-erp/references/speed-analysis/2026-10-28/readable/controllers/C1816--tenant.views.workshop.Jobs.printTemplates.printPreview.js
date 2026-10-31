// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:496071-496101
appModule.controller('tenant.views.workshop.Jobs.printTemplates.printPreview', [
        '$scope', 'appSession', 'jobId', '$uibModalInstance',
        function ($scope, appSession, jobId, $uibModalInstance) {

            var vm = this;
            vm.jobId = jobId;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.getTemplateUrl = function () {

                var template = abp.features.getValue('WORKSHOP.Jobs.PrintTemplate');
              //  template = 'standard';
                if (template == undefined || template == '')
                    template = 'standard';

                if (template == 'custom')
                    return '~/App/tenant/views/workshop/Jobs/printTemplates/tenants/' + appSession.tenant.tenancyName.toLowerCase() + '.cshtml';
                else if (template == 'englisharabic')
                    return '~/App/tenant/views/workshop/Jobs/printTemplates/englisharabic.cshtml';
                else
                    return '~/App/tenant/views/workshop/Jobs/printTemplates/' + template + '.cshtml';
            };
        }
    ]);
