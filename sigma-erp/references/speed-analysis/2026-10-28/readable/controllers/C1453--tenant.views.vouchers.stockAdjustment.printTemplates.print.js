// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:398123-398145
appModule.controller('tenant.views.vouchers.stockAdjustment.printTemplates.print', [
        '$scope', '$uibModalInstance',
        function ($scope, $uibModalInstance) {

            var vm = this;

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
