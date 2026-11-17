// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:470605-470766
appModule.controller('tenant.views.stock.stockTransfer.createOrEditModal', [
        '$uibModalInstance', 'abp.services.app.item', 'options', 'abp.services.app.stockTransfer', 'abp.services.app.commonLookup', 'utilities', 'appSession',
        function ($uibModalInstance, itemAppService, options, stockTransferService, commonLookupService, utilities, appSession) {

            var vm = this;
            vm.loading = false;

            vm.autoCalculateAmountInWords = abp.setting.get("App.General.AutoCalculateAmountInWords");

            vm.userBranch = "";
            vm.branchTo = "";

            vm.stockTransfer = {
                voucherLines: []
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.filters = {};

            function stockTransferObject() {
                var line = new Object();
                line.productId = null;
                line.quantity = null;
                //line.locationId = null;
                vm.getBranchTo();
                return line;
            }

            vm.clearModelData = function () {
                vm.models = null;
                vm.item.model = null;
                vm.modelId = null;
            };

            vm.productSelected = function (line) {
                line.productId = line.product.id;
                line.unitOfMeasureId = line.product.unitOfMeasureId;
            };

            //Add row
            vm.addRow = function (line) {
                if (line == undefined)
                    item = stockTransferObject();

                vm.stockTransfer.voucherLines.push(item);
            };

            //Remove row
            vm.removeRow = function (obj) {
                var index = vm.stockTransfer.voucherLines.indexOf(obj);
                vm.stockTransfer.voucherLines.splice(index, 1);

            };

            vm.searchItems = function ($select) {
                if ($select.search == "") { vm.items = null; return null; }
                return itemAppService.searchItems({ name: $select.search }).then(function (response) {
                    vm.items = response.data.items;
                });
            };

            function getLocations() {
                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                    vm.userBranch = vm.locations.find(e => e.id == appSession.user.locationId).name;
                    vm.locations = vm.locations.filter(e => e.id != appSession.user.locationId);
                });
            }
            vm.getBranchTo = function () {
                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                    vm.locations = vm.locations.filter(e => e.id != appSession.user.locationId);
                    var selectedBranch = vm.locations.find(e => e.id == vm.branchTo);

                    // ✅ if branch selected, apply it to all rows
                    if (selectedBranch && vm.stockTransfer && vm.stockTransfer.voucherLines) {
                        vm.stockTransfer.voucherLines.forEach(function (line) {
                            line.locationId = selectedBranch.id;
                        });
                    }
                });
            };


            vm.save = function () {

                if (!appSession.user.locationId)
                    abp.message.info("Attach branch with user");

                vm.loading = true;

                if ([...new Set(vm.stockTransfer.voucherLines.map(e => e.productId))].length != vm.stockTransfer.voucherLines.length) {
                    abp.message.info("Cannot save items are duplicated!");
                    vm.loading = false;
                    return;
                }

                if (vm.stockTransfer.voucherLines.some(e => e.quantity > e.product.quantity)) {
                    abp.message.info("Cannot save transfer quantity is greater than available quantity!");
                    vm.loading = false;
                    return;
                }

                vm.stockTransfer.voucherLines.forEach(e => {
                    e.debit = e.quantity * e.product.cost;
                    e.credit = 0;
                });

                var voucherLinesCopy = JSON.parse(JSON.stringify(vm.stockTransfer.voucherLines));

                voucherLinesCopy.forEach((row) => {
                    vm.stockTransfer.voucherLines.push({
                        productId: row.productId,
                        product: row.product,
                        quantity: row.quantity,
                        debit: 0,
                        credit: row.debit,
                        locationId: appSession.user.locationId,
                        hidden:true
                    });
                });



                stockTransferService.createOrUpdateStockTransfer({ stockTransfer: vm.stockTransfer })
                    .success(function (result) {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).error(function (result) {
                        abp.notify.error(app.localize('RecordNotSaved.'));
                    }).finally(function () {
                        vm.loading = false;
                    });
            };

            init();
            getLocations();

            function init() {
                vm.loading = true;
                stockTransferService.getStockTransferForEdit({
                    id: options.id
                }).success(function (result) {
                    if (result) {
                        vm.stockTransfer = result;
                        vm.stockTransfer.date = result.date;
                        angular.forEach(result.voucherLines, function (line) {
                            line.product.unitOfMeasure = line.unitOfMeasure;
                            line.product.unitOfMeasureId = line.unitOfMeasureId;
                        });
                    }
                })
                    .finally(function () {
                        vm.loading = false;
                    });
            }
        }

    ]);
