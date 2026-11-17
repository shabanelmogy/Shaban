// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:100768-100798
appModule.controller('tenant.views.common.hrm.paySlips.printTemplates.printPreview', [
        '$scope', 'appSession', 'payrollId', 'staffId', 'paySlipNo', '$uibModalInstance',
        function ($scope, appSession, payrollId, staffId, paySlipNo, $uibModalInstance) {

            var vm = this;
            vm.payrollId = payrollId;
            vm.staffId = staffId;
            vm.paySlipNo = paySlipNo;

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
                    return '~/App/tenant/views/common/hrm/paySlips/printTemplates/tenants/' + appSession.tenant.tenancyName.toLowerCase() + '.cshtml';
                else if (template == 'englisharabic')
                    return '~/App/tenant/views/common/hrm/paySlips/printTemplates/englisharabic.cshtml';
                else
                    return '~/App/tenant/views/common/hrm/paySlips/printTemplates/' + template + '.cshtml';
            };
        }
    ]);
