// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:161758-161778
appModule.controller('tenant.views.crs.assets.assets.printtemplates.printPreview', [
        '$scope', 'appSession', 'assetId', '$uibModalInstance',
        function ($scope, appSession, assetId, $uibModalInstance) {

            var vm = this;
            vm.assetId = assetId;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.getTemplateUrl = function () {

                return '~/App/tenant/views/crs/assets/assets/printTemplates/standard.cshtml';
            };
        }
    ]);
