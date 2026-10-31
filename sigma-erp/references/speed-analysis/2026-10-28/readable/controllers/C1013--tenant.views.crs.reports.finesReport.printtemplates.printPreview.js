// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:272534-272566
appModule.controller('tenant.views.crs.reports.finesReport.printtemplates.printPreview', [
        '$scope', 'appSession', 'fineId', '$uibModalInstance',
        function ($scope, appSession, fineId, $uibModalInstance) {
            
            var vm = this;
            vm.fineId = fineId;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.getTemplateUrl = function () {
                var template = abp.features.getValue('CRS.Fines.PrintTemplate').toLowerCase();

                if (template == undefined || template == '')
                    template = 'standard';

                if (template == 'custom')
                    return '~/App/tenant/views/crs/reports/finesReport/printTemplates/tenants/' + appSession.tenant.tenancyName.toLowerCase() + '.cshtml';
                else if (template == 'englisharabic')
                    return '~/App/tenant/views/crs/reports/finesReport/printTemplates/englisharabic.cshtml';
                else
                    return '/App/tenant/views/crs/reports/finesReport/printTemplates/' + template + '.cshtml';


             //   return '~/App/tenant/views/crs/reports/finesReport/printTemplates/standard.cshtml';
            };
        }
    ]);
