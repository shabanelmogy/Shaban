// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:170023-170042
appModule.controller('tenant.views.crs.banking.reconciledReport.printPreview', [
        '$scope', 'appSession', 'reportId', '$uibModalInstance',
        function ($scope, appSession, reportId, $uibModalInstance) {

            var vm = this;
            vm.reportId = reportId;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.getTemplateUrl = function () {
                return '~/App/tenant/views/crs/banking/reconciledReport/report.cshtml';
            };
        }
    ]);
