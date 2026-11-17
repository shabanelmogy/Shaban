// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:65592-65681
appModule.controller('host.views.crm.products.createOrEditProduct',
        [
            '$scope', '$uibModalInstance', '$uibModal', 'options', 'abp.services.app.hostProduct', 'abp.services.app.commonLookup',
            function ($scope, $uibModalInstance, $uibModal, options, productService, commonLookupService) {
                var vm = this;

                vm.isReadOnly = false;
                vm.product = {
                    id: options.id
                };

                vm.getEditionValue = function (item) {
                    return parseInt(item.value);
                };

                function getEditions() {
                    vm.loading = true;
                    commonLookupService.getEditionsForCombobox({}).success(function (result) {
                        debugger;
                        vm.editions = result.items;
                    }).finally(function () {
                        vm.loading = false;
                    });

                }


                vm.save = function (isSaveAndNew) {
                    vm.loading = true;

                    if (vm.product.id > 0) {
                        productService.editProduct(
                            vm.product
                        ).success(function (result) {

                            $uibModalInstance.close();
                            abp.notify.info(app.localize('SavedSuccessfully'));
                            vm.loading = false;
                        });
                    }
                    else {
                        productService.addProduct(
                            vm.product
                        ).success(function (result) {

                            if (isSaveAndNew) {
                                vm.product.id = 0;
                                vm.product.code = null;
                                vm.product.name = null;

                            } else {
                                $uibModalInstance.close();
                            }
                            abp.notify.info(app.localize('SavedSuccessfully'));
                            vm.loading = false;
                        });
                    }
                };
                vm.cancel = function () {
                    $uibModalInstance.close();
                };



                function getProductDetailForEdit() {
                    vm.loading = true;
                    productService.getProductForEdit(options.id).success(function (result) {

                        vm.product.id = result.id;
                        vm.product.code = result.code;
                        vm.product.name = result.name;
                        vm.product.edition = result.edition;
                        vm.product.editionId = result.edition.id;
                        vm.loading = false;
                    });
                }


                function init() {
                    if (options.id > 0) {
                        getProductDetailForEdit();
                    }
                    getEditions();


                }

                init();
            }
        ]);
