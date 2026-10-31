// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:114620-114659
appModule.controller('tenant.views.common.taxCodes.createOrEditModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.taxCode', 'taxCodeId', 'taxCode', 'abp.services.app.costCenter', 'utilities',
        function ($scope, $uibModalInstance, taxCodeService, taxCodeId, taxCode, costCenterService, utilities) {

            var vm = this;
            vm.saving = false;
            vm.taxCode = null;
            vm.loading = false;
            vm.isEditMode = false;

            vm.save = function () {
                vm.saving = true;
                taxCodeService.createOrUpdateTaxCode({
                    taxCode: vm.taxCode,
                }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };

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
