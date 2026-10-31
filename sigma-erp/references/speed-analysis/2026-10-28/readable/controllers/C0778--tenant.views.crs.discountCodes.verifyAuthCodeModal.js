// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:202244-202266
appModule.controller('tenant.views.crs.discountCodes.verifyAuthCodeModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.userWiseDiscount', 'appSession', 'abp.services.app.discountAuthCode',
    function ($scope, $uibModalInstance, userWiseDiscountService, appSession, discountAuthCodeAppService) {

        var vm = this;
        vm.saving = false;

        vm.cancel = function () {
            $uibModalInstance.dismiss();
        };

        vm.verifyCode = function () {
            vm.saving = true;
            discountAuthCodeAppService.verifyCode({
                id: vm.discountCode
            }).success(function (result) {
                $uibModalInstance.close(result);
            }).finally(function () {
                vm.saving = false;
            });
        };
    }
    ]);
