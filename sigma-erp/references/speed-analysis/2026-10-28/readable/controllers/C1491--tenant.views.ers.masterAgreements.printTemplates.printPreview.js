// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:407035-407065
appModule.controller('tenant.views.ers.masterAgreements.printTemplates.printPreview', [
        '$scope', 'appSession', 'masterAgreementId', '$uibModalInstance',
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
                var template = abp.features.getValue('ERS.MasterAgreementPrintTemplate').toLowerCase();
               /* var template = '';*/

                if (template == undefined || template == '')
                    template = 'standard';

                if (template == 'custom')
                    return '~/App/tenant/views/ers/masterAgreements/printTemplates/tenants/' + appSession.tenant.tenancyName.toLowerCase() + '.cshtml';
                else if (template == 'englisharabic')
                    return '~/App/tenant/views/ers/masterAgreements/printTemplates/englisharabic.cshtml';
                else
                    return '~/App/tenant/views/ers/masterAgreements/printTemplates/' + template + '.cshtml';
            };
        }
    ]);
