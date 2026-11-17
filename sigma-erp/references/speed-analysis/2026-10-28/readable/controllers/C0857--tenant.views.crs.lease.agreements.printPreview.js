// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:235796-235824
appModule.controller('tenant.views.crs.lease.agreements.printPreview', [
        '$scope', 'appSession', 'agreementId','$uibModalInstance',
        function ($scope, appSession, agreementId, $uibModalInstance) {

            var vm = this;
            vm.agreementId = agreementId;
            
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.getTemplateUrl = function () {
                var template = abp.features.getValue('CRS.Lease.Agreements.PrintTemplate').toLowerCase();
                if (template == undefined || template == '')
                    template = 'standard';

                if (template == 'custom')
                    return '~/App/tenant/views/crs/lease/agreements/printtemplates/tenants/' + appSession.tenant.tenancyName.toLowerCase() + '.cshtml';
                else if (template == 'englisharabic')
                    return '~/App/tenant/views/crs/lease/agreements/printtemplates/englisharabic.cshtml';
                else
                    return '~/App/tenant/views/crs/lease/agreements/printtemplates/' + template + '.cshtml';
            };
        }
    ]);
