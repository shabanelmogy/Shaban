// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:257491-257510
appModule.controller('tenant.views.crs.rental.masterAgreements.printtemplates.printDeliveryNote', [
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
                return '~/App/tenant/views/crs/rental/masterAgreements/printtemplates/tenants/' + 'almasaoodDeliveryNote' + '.cshtml';
            };
        }
    ]);
