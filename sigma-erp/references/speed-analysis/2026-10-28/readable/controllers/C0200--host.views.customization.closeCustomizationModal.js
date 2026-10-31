// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:68280-68304
appModule.controller('host.views.customization.closeCustomizationModal', [
        '$scope', '$uibModalInstance', 'customization','abp.services.app.customizationHost',
    function ($scope, $uibModalInstance,customization, customizationService) {

        var vm = this;
        vm.saving = false;
     
        vm.customization = customization;

        vm.save = function () {
            vm.saving = true;
            customizationService.closeCustomization({ customizationId: customization.id, actualHours: vm.customization.actualHours }).success(function () {
                abp.notify.info(app.localize('ClosedSuccessfully'));
                $uibModalInstance.close();
            }).finally(function () {
                vm.saving = false;
            });
        };

        vm.cancel = function () {
            $uibModalInstance.dismiss();
        };

    }
    ]);
