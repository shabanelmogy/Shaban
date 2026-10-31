// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:36907-36956
appModule.controller('host.views.cbs.projects.addProductModal', [
    '$uibModalInstance', '$scope', 'abp.services.app.productVariant', 'abp.services.app.hostProduct',
    function ($uibModalInstance, $scope, productVariantService, productService) {
        var vm = this;
        vm.selectedProduct = null;
        vm.selectedVariant = null;
        vm.variants = [];
        vm.showVariantDropdown = false;
        vm.showOkButton = false; 

        vm.getProductsForVariants = function () {
            vm.loading = true;
            productService.getProductsForVariants({}).then(function (response) {
                vm.data = response.data;
            }).finally(function () {
                vm.loading = false;
            });
        };

        vm.onProductSelected = function () {
            vm.showOkButton = false;
            vm.showVariantDropdown = false;
            vm.selectedVariant = null;

            if (!vm.selectedProduct) return;

            productVariantService.getVariantsByProductId({ Id: vm.selectedProduct.id }).then(function (response) {
                vm.variants = response.data;
                vm.showVariantDropdown = vm.variants.length > 0;
                vm.showOkButton = true;
            });
        };
        
        vm.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        vm.save = function () {
            $uibModalInstance.close({
                product: vm.selectedProduct,
                variant: vm.selectedVariant
            });
        };
        
        function init() {
            vm.getProductsForVariants();
        }

        init();
    }
]);
