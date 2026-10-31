// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:411313-411343
appModule.controller('tenant.views.ers.rental.agreements.printTemplates.printPreview', [
        '$scope', 'appSession', 'agreementId', '$uibModalInstance',
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
               // var template = abp.features.getValue('CRS.Vouchers.Receipts.PrintTemplate').toLowerCase();
                var template = '';

                if (template == undefined || template == '')
                    template = 'standard';

                if (template == 'custom')
                    return '~/App/tenant/views/ers/rental/agreements/printTemplates/tenants/' + appSession.tenant.tenancyName.toLowerCase() + '.cshtml';
                else if (template == 'englisharabic')
                    return '~/App/tenant/views/ers/rental/agreements/printTemplates/englisharabic.cshtml';
                else
                    return '~/App/tenant/views/ers/rental/agreements/printTemplates/' + template + '.cshtml';
            };
        }
    ]);
