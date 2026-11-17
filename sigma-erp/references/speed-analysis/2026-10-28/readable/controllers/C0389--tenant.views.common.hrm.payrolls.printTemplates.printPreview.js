// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:100107-100135
appModule.controller('tenant.views.common.hrm.payrolls.printTemplates.printPreview', [
        '$scope', 'appSession', 'payrollId', '$uibModalInstance',
        function ($scope, appSession, payrollId, $uibModalInstance) {

            var vm = this;
            vm.payrollId = payrollId;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.getTemplateUrl = function () {
                var template = abp.features.getValue('HRM.Payroll.Print').toLowerCase();
                if (template == undefined || template == '')
                    template = 'standard';

                if (template == 'custom')
                    return '~/App/tenant/views/common/hrm/payrolls/printTemplates/tenants/' + appSession.tenant.tenancyName.toLowerCase() + '.cshtml';
                else if (template == 'englisharabic')
                    return '~/App/tenant/views/common/hrm/payrolls/printTemplates/englisharabic.cshtml';
                else
                    return '~/App/tenant/views/common/hrm/payrolls/printTemplates/' + template + '.cshtml';
            };
        }
    ]);
