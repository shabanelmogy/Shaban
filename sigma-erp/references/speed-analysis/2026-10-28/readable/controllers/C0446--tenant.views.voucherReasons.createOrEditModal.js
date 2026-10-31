// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:115563-115596
appModule.controller('tenant.views.voucherReasons.createOrEditModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.voucherReason', 'reasonId',
        function ($scope, $uibModalInstance, voucherReasonService, reasonId) {
            var vm = this;
            vm.saving = false;
            vm.reason = null;

            vm.save = function () {
                vm.saving = true;
                voucherReasonService.createOrUpdateVoucherReason({
                    reason : vm.reason,
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
                voucherReasonService.getVoucherReasonForEdit({
                    id: reasonId
                }).success(function (result) {
                    vm.reason = result;
                });
            }

            init();
        }
    ]);
