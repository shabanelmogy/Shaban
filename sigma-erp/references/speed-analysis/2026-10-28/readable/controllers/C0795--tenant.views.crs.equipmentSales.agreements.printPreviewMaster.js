// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:209890-209913
appModule.controller('tenant.views.crs.equipmentSales.agreements.printPreviewMaster', [
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

                var template = abp.features.getValue('CRS.SalesAgreement.PrintTemplate').toLowerCase();

                return '~/App/tenant/views/crs/equipmentSales/agreements/printtemplates/tenants/' + 'ApSuperRentaCarMasterAgreement' + '.cshtml';

            };
        }
    ]);
