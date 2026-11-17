// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:455007-455030
appModule.controller('tenant.views.pos.product.viewModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.product', 'productId',
        function ($scope, $uibModalInstance, productService, productId) {
            var vm = this;
            vm.loading = false;
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            vm.getProductsList = function () {
                localStorage.setItem("productlist", JSON.stringify(vm.product));
            };
            function init() {
                vm.loading = true;
                productService.getProductForView({
                    id: productId
                }).success(function (result) {
                    vm.product = result;
                    vm.loading = false;
                    vm.getProductsList();
                });
            }
            init();
        }
    ]);
