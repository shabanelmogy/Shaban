// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:66391-66458
appModule.controller('host.views.crm.productVariants.productVariantModal',
        [
            '$scope', '$uibModalInstance', '$uibModal', 'abp.services.app.productVariant', 'product',
            function ($scope, $uibModalInstance, $uibModal, productVariantService, product) {
                var vm = this;
                vm.product = product;

                vm.openCreateOrEditVariantModal = function (row) {
                    if (!row)
                        row = { productId: product.id };

                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/host/views/crm/productVariants/createOrEditProductVariantModal.cshtml',
                        controller: 'host.views.crm.productVariants.createOrEditProductVariantModal as vm',
                        backdrop: 'static',
                        resolve: {
                            productVariant: function () {
                                return row;
                            }
                        }
                    });
                    modalInstance.result.then(function () {
                        init();
                    });
                };
                vm.cancel = function () {
                    $uibModalInstance.close();
                };

                vm.deleteVariant = function (row) {
                    abp.message.confirm(
                        app.localize('DeleteWarningMessage'),
                        function (isConfirmed) {
                            if (isConfirmed) {
                                productVariantService.deleteProductVariant({ id: row.id }).success(function () {
                                    init();
                                    abp.notify.success(app.localize('SuccessfullyDeleted'));
                                });
                            }
                        }
                    );
                };

                vm.openSettingModal = function (row) {
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/host/views/crm/productVariants/productVariantSettingModal.cshtml',
                        controller: 'host.views.crm.productVariants.productVariantSettingModal as vm',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            productVariant: function () {
                                return row;
                            }
                        }
                    });
                }

                function init() {
                    vm.loading = true;
                    productVariantService.getProductVariants({ id: product.id }).success(function (result) {
                        vm.productVariants = result;
                    }).finally(function () {
                        vm.loading = false;
                    });
                }
                init();
            }
        ]);
