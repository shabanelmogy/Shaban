// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:451883-451998
appModule.controller('tenant.views.pos.order.createOrEditModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.product', 'abp.services.app.unitOfMeasure', 'productId',
        function ($scope, $uibModalInstance, productService, unitOfMeasureService, productId) {

            var vm = this;
            vm.saving = false;
            vm.loading = false;

            vm.isposEnabled = abp.features.isEnabled("POS");
            vm.product = {
                productUnitOfMeasures: []
            };
            var productPrices = [];

            vm.save = function () {
                vm.saving = true;

                var arr = Array.from(new Set(vm.product.productUnitOfMeasures.map(x => x.unitOfMeasureId)));

                if (arr.length !== vm.product.productUnitOfMeasures.length) {
                    abp.message.info('Duplication in Unit Of Measure Id');
                    vm.saving = false;
                    return;
                }

                productService.createOrUpdateProduct({
                    product: vm.product
                }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function unitOfMeasuresLineObject() {
                var line = new Object();
                line.productId = null;
                line.unitOfMeasureId = null;
                line.isDefault = false;
                line.productPrices = angular.copy(productPrices);
                return line;

            }

            //Add Row
            vm.addRow = function (line) {
                line = unitOfMeasuresLineObject();
                vm.product.productUnitOfMeasures.push(line);
                $('#unitOfMeasureIdItemsSelectionCombobox').selectpicker('refresh');

            };

            vm.isDefaultChanged = function (val) {
                if (!val.isDefault)
                    return;
                var ObjectIndex = vm.product.productUnitOfMeasures.indexOf(val);
                vm.product.productUnitOfMeasures.forEach(function (valueNested, index) {
                    if (ObjectIndex !== index)
                        valueNested.isDefault = false;
                });
            };

            //Remove row
            vm.removeRow = function (obj) {
                var index = vm.product.productUnitOfMeasures.indexOf(obj);
                if (index > -1 && vm.product.productUnitOfMeasures.length > 1) {
                    vm.product.productUnitOfMeasures.splice(index, 1);
                }
            };

            unitOfMeasureIdItems = function () {
                unitOfMeasureService.getUnitOfMeasures().success(function (result) {
                    vm.unitOfMeasureIdItems = result.items;
                    angular.forEach(vm.unitOfMeasureIdItems, function (value) {
                        value.title = value.name + " (" + value.nameLang + ")";
                    });
                });
            };
            vm.unitOfMeasureChange = function (index) {

                //row.unitOfMeasureId = row.unitOfMeasure.id;

                setTimeout(function () {
                    $('#unitOfMeasureIdItemsSelectionCombobox' + index).selectpicker('refresh');
                }, 0);
            };
            vm.getProductsList = function () {
                localStorage.setItem("productlist", JSON.stringify(vm.product));
            };
            function init() {
                vm.loading = true;
                unitOfMeasureIdItems();
                productService.getProductForEdit({
                    id: productId
                }).success(function (result) {
                    vm.product = result;
                    productPrices = angular.copy(result.productUnitOfMeasures[0].productPrices);
                    productPrices.forEach(function (value) {
                        value.id = 0;
                        value.price = 0;
                    });
                    setTimeout(function () {
                        $('#unitOfMeasureIdItemsSelectionCombobox').selectpicker('refresh');
                    }, 0);
                    vm.loading = false;
                    vm.getProductsList();
                });
            }
            init();
        }
    ]);
