// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:398149-398172
appModule.controller('tenant.views.crs.vouchers.stockAdjustment.printTemplates.printPreview', [
        '$scope','JVId', '$uibModalInstance',
        function ($scope, JVId, $uibModalInstance) {

            var vm = this;
             vm.JVId = JVId;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.getTemplateUrl = function () {
                var template;
                if (template == undefined || template == '')
                    template = 'standard';
                return '~/App/tenant/views/crs/vouchers/stockAdjustment/printTemplates/' + template + '.cshtml';;
            };

        }
    ]);
