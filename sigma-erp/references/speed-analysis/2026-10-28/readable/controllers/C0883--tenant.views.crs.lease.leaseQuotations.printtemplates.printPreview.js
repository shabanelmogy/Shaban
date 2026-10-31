// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:240849-240877
appModule.controller('tenant.views.crs.lease.leaseQuotations.printtemplates.printPreview', [
        '$scope', 'appSession', 'leaseQuotationId', '$uibModalInstance',
        function ($scope, appSession, leaseQuotationId, $uibModalInstance) {

            var vm = this;
            vm.leaseQuotationId = leaseQuotationId;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.getTemplateUrl = function () {
                var template = abp.features.getValue('CRS.Lease.Quotations.PrintTemplate').toLowerCase();
                if (template == undefined || template == '')
                    template = 'standard';

                if (template == 'custom')
                    return '~/App/tenant/views/crs/lease/leaseQuotations/printtemplates/tenants/' + appSession.tenant.tenancyName.toLowerCase() + '.cshtml';
                else if (template == 'englisharabic')
                    return '~/App/tenant/views/crs/lease/leaseQuotations/printtemplates/englisharabic.cshtml';
                else
                    return '~/App/tenant/views/crs/lease/leaseQuotations/printtemplates/' + template + '.cshtml';
            };
        }
    ]);
