// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:98793-98824
appModule.controller('tenant.views.common.hrm.payroll.printPreview', [
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
                var template = abp.features.getValue('CRS.Rental.Agreements.PrintTemplate').toLowerCase();
                if (template == undefined || template == '')
                    template = 'standard';

                if (template == 'custom')
                    return '~/App/tenant/views/common/payroll/printtemplates/tenants/' + appSession.tenant.tenancyName.toLowerCase() + '.cshtml';
                //else if (template == 'bilingual')
                //    return '~/App/tenant/views/crs/agreements/printtemplates/bilingual.cshtml';
                else if (template == 'englisharabic')
                    return '~/App/tenant/views/common/payroll/printtemplates/englisharabic.cshtml';
                else
                    return '~/App/tenant/views/common/payroll/printtemplates/' + template + '.cshtml';
                 
            };
        }
    ]);
