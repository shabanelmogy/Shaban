// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:65720-65778
appModule.controller('host.views.crm.products.createOrEditProductModuleModal',
        [
            '$scope', '$uibModalInstance', 'abp.services.app.productModule', 'abp.services.app.productVariant', 'productModule',
            function ($scope, $uibModalInstance, productModuleService, productVariantService, productModule) {
                var vm = this;
                vm.saving = false;
                vm.productModule = productModule;
                if (!vm.productModule.productVariantId) {
                    vm.productModule.productVariantId = 0;
                }
                vm.productCategories = [
                    { id: 1, name: "Standard" },
                    { id: 2, name: "Add_On" }
                ];
                vm.productVariants = []; // Initialize empty array for product variants

                // Load product variants for the current product using the existing productVariantService
                function loadProductVariants() {
                    if (vm.productModule && vm.productModule.productId) {
                        vm.loading = true;
                        productVariantService.getProductVariants({ id: vm.productModule.productId })
                            .success(function (result) {
                                vm.productVariants = result;
                                vm.productVariants.unshift({ id: 0, name: "Applicable To All Variants"})
                            }).finally(function () {
                                vm.loading = false;
                            });
                    }
                }

                // Initialize by loading product variants
                loadProductVariants();

               
                vm.save = function () {
                    if (vm.saving) {
                        return;
                    }
                    
                    vm.saving = true;
                    var input = {
                        module: vm.productModule
                    };
                    if (parseInt(vm.productModule.productVariantId) == 0) {
                        input.module.productVariantId = null;
                    }
                    productModuleService.createOrUpdateProductModule(input)
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
