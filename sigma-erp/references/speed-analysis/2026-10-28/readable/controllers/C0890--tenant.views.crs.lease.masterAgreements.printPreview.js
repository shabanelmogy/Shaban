// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:242405-242433
appModule.controller('tenant.views.crs.lease.masterAgreements.printPreview', [
        '$scope', 'appSession', 'masterAgreementId','$uibModalInstance',
        function ($scope, appSession, masterAgreementId, $uibModalInstance) {

            var vm = this;
            vm.masterAgreementId = masterAgreementId;
            
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.getTemplateUrl = function () {
                var template = abp.features.getValue('CRS.Lease.MasterAgreements.PrintTemplate').toLowerCase();
                if (template == undefined || template == '')
                    template = 'standard';

                if (template == 'custom')
                    return '~/App/tenant/views/crs/lease/masterAgreements/printtemplates/tenants/' + appSession.tenant.tenancyName.toLowerCase() + '.cshtml';
                else if (template == 'englisharabic')
                    return '~/App/tenant/views/crs/lease/masterAgreements/printtemplates/englisharabic.cshtml';
                else
                    return '~/App/tenant/views/crs/lease/masterAgreements/printtemplates/' + template + '.cshtml';
            };
        }
    ]);
