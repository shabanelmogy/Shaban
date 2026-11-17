// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:259801-259829
appModule.controller('tenant.views.crs.rental.quotations.printtemplates.printPreview', [
        '$scope', 'appSession', 'quotationId', '$uibModalInstance',
        function ($scope, appSession, quotationId, $uibModalInstance) {

            var vm = this;
            vm.quotationId = quotationId;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.getTemplateUrl = function () {
                var template = abp.features.getValue('CRS.Rental.Quotations.PrintTemplate').toLowerCase();
                if (template == undefined || template == '')
                    template = 'standard';

                if (template == 'custom')
                    return '~/App/tenant/views/crs/rental/quotations/printtemplates/tenants/' + appSession.tenant.tenancyName.toLowerCase() + '.cshtml';
                else if (template == 'englisharabic')
                    return '~/App/tenant/views/crs/rental/quotations/printtemplates/englisharabic.cshtml';
                else
                    return '~/App/tenant/views/crs/rental/quotations/printtemplates/' + template + '.cshtml';
            };
        }
    ]);
