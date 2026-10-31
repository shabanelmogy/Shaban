// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:114812-114838
appModule.controller('tenant.views.common.taxCodes.viewModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.taxCode', 'taxCodeId', 'utilities',
        function ($scope, $uibModalInstance, taxCodeService, taxCodeId, utilities) {

            var vm = this;
            vm.saving = false;
            vm.taxCode = null;
            vm.loading = false;

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function init() {
                vm.loading = true;
                taxCodeService.getTaxCodeForEdit({
                    id: taxCodeId
                }).success(function (result) {
                    vm.taxCode = result;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
