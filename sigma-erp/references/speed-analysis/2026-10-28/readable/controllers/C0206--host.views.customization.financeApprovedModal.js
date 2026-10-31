// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:69238-69264
appModule.controller('host.views.customization.financeApprovedModal', [
        '$scope', '$uibModalInstance', 'customization', 'abp.services.app.customizationHost',
    function ($scope, $uibModalInstance, customization, customizationService) {

        var vm = this;
        vm.saving = false;

        vm.costPerHour = 35;
        vm.customization = angular.copy(customization);
        vm.estimatedHours = customization.estimatedHours;
        vm.customization.cost = vm.customization.estimatedHours * vm.costPerHour;
        vm.save = function () {
            vm.saving = true;
            customizationService.setPaymentReceivedCustomization({ customizationId: vm.customization.id, estimatedHours: vm.customization.estimatedHours, cost: vm.customization.cost }).success(function () {
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
