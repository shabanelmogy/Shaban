// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:150716-150752
appModule.controller('tenant.views.crs.agreements.printPreview', [
        '$scope', 'appSession', 'agreementId', '$uibModalInstance',
        function ($scope, appSession, agreementId, $uibModalInstance) {

            var vm = this;
            if (sessionStorage['printConfig']) {
                vm.printConfig = JSON.parse(sessionStorage['printConfig']);
                sessionStorage.removeItem('printConfig');
            } else
                vm.printConfig = { printHeader: true };

            vm.agreementId = agreementId;

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
                    return '~/App/tenant/views/crs/agreements/printtemplates/tenants/' + appSession.tenant.tenancyName.toLowerCase() + '.cshtml';
                //else if (template == 'bilingual')
                //    return '~/App/tenant/views/crs/agreements/printtemplates/bilingual.cshtml';
                else if (template == 'englisharabic')
                    return '~/App/tenant/views/crs/agreements/printtemplates/englisharabic.cshtml';
                else
                    return '~/App/tenant/views/crs/agreements/printtemplates/' + template + '.cshtml';
            };
        }
    ]);
