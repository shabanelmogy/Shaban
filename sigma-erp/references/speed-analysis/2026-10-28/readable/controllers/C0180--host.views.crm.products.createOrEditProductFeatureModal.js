// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:65684-65717
appModule.controller('host.views.crm.products.createOrEditProductFeatureModal',
        [
            '$scope', '$uibModalInstance', 'abp.services.app.productModuleFeature', 'productModuleFeature',
            function ($scope, $uibModalInstance, productModuleFeatureService, productModuleFeature) {
                var vm = this;
                vm.saving = false;
                vm.productModuleFeature = productModuleFeature;

                vm.save = function () {
                    if (vm.saving) {
                        return;
                    }

                    vm.saving = true;

                    // Create the input object structure as expected by the service
                    var input = {
                        moduleFeature: vm.productModuleFeature
                    };

                    productModuleFeatureService.createOrUpdateProductModuleFeature(input)
                        .success(function () {
                            abp.notify.success(app.localize('SavedSuccessfully'));
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
