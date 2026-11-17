// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:66366-66388
appModule.controller('host.views.crm.productVariants.createOrEditProductVariantModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.productVariant', 'productVariant',
        function ($scope, $uibModalInstance, productVariantService, productVariant) {
            var vm = this;

            vm.saving = false;
            vm.variant = productVariant;

            vm.save = function () {
                vm.saving = true;
                productVariantService.createOrUpdateProductVariant({ variant: vm.variant }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function() {
                    vm.saving = false;
                });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
        }
    ]);
