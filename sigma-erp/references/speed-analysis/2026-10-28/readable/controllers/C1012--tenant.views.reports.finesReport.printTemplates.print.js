// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:272514-272530
appModule.controller('tenant.views.reports.finesReport.printTemplates.print', [
        '$scope', 'appSession',
        function ($scope, appSession) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.getTemplateUrl = function () {
                
                return '~/App/tenant/views/crs/reports/finesReport/printTemplates/standard.cshtml';

            };
        }
    ]);
