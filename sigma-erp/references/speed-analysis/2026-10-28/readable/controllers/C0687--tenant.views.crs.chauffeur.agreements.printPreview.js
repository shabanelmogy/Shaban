// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:177943-177972
appModule.controller('tenant.views.crs.chauffeur.agreements.printPreview', [
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

                var template = abp.features.getValue('CRS.Chauffeur.Agreements.PrintTemplate').toLowerCase();
                if (template === undefined || template === '')
                    template = 'standard';

                if (template === 'custom')
                    return '~/App/tenant/views/crs/chauffeur/agreements/printtemplates/tenants/' + appSession.tenant.tenancyName.toLowerCase() + '.cshtml';
                else if (template === 'englisharabic')
                    return '~/App/tenant/views/crs/chauffeur/agreements/printtemplates/englisharabic.cshtml';
                else
                    return '~/App/tenant/views/crs/chauffeur/agreements/printtemplates/' + template + '.cshtml';
            };
        }
    ]);
