// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:247067-247095
appModule.controller('tenant.views.crs.limousine.quotations.printtemplates.printPreview', [
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
                var template = abp.features.getValue('CRS.Limousine.Quotations.PrintTemplate').toLowerCase();
                if (template == undefined || template == '')
                    template = 'standard';

                if (template == 'custom')
                    return '~/App/tenant/views/crs/limousine/quotations/printtemplates/' + appSession.tenant.tenancyName.toLowerCase() + '.cshtml';
                else if (template == 'englisharabic')
                    return '~/App/tenant/views/crs/limousine/quotations/printtemplates/englisharabic.cshtml';
                else
                    return '~/App/tenant/views/crs/limousine/quotations/printtemplates/' + template + '.cshtml';
            };
        }
    ]);
