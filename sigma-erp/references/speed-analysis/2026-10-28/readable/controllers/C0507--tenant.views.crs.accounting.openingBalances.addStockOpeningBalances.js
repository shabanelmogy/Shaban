// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:128889-129097
appModule.controller('tenant.views.crs.accounting.openingBalances.addStockOpeningBalances', [
        '$scope',
        'abp.services.app.openingBalance',
        'stockId',
        '$uibModal',
        '$filter',
        'utilities',
        'FileUploader',
        'appSession',
        '$uibModalInstance',
        'abp.services.app.account',
        'abp.services.app.item',
        'abp.services.app.commonLookup',
        function ($scope, openingBalanceService, stockId, $uibModal, $filter, utilities, fileUploader, appSession, $uibModalInstance, accountService, itemAppService, commonLookupService) {
            var vm = this;
            vm.loading = false;
            vm.locations = [];
            vm.items = [];
            vm.saving = false;
            vm.entryToEdit = stockId;
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.stockOpeningBalance = {
                id: 0,
                voucherLines: []
            };

            //vm.stockOpeningBalance.id = stockId;
            vm.stockMultiBranch = abp.features.isEnabled("Stock_MultiBranch");

            // Load Locations
            function getLocations() {
                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                });
            }
            getLocations();

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            // Search items using the same pattern as customer opening balance
            vm.searchItems = function ($select) {
                var name = $select.search;
                if (name === '')
                    name = "~";  //to avoid default suggestions 
                return itemAppService.searchItems({ name: name }).then(function (response) {
                    vm.items = response.data.items;
                });
            };

            // Handle product change when item is selected
            vm.changeProduct = function (row) {
                if (row.product) {
                    row.productId = row.product.id;
                    row.unitOfMeasureId = row.product.unitOfMeasureId;

                    // Auto-populate cost if available
                    if (row.product.cost && !row.debit && !row.credit) {
                        row.debit = row.product.cost;
                    }
                } else {
                    row.productId = null;
                    row.unitOfMeasureId = null;
                }
            };

            // Opening balance stock object
            function openingBalanceStockObject() {
                return {
                    debit: null,
                    credit: null,
                    locationId: null,
                    description: null,
                    quantity: 0,
                    productId: null,
                    unitOfMeasureId: null,
                    product: null,
                    hidden: false
                };
            }

            vm.localize = function (input) {
                if (!input) return "";
                return app.localize(input);
            };

            vm.addStockRow = function () {
                if (!vm.stockOpeningBalance.voucherLines) {
                    vm.stockOpeningBalance.voucherLines = [];
                }
                vm.stockOpeningBalance.voucherLines.push(openingBalanceStockObject());
            };

            vm.removeStockRow = function (row) {
                var index = vm.stockOpeningBalance.voucherLines.indexOf(row);
                if (index > -1) {
                    vm.stockOpeningBalance.voucherLines.splice(index, 1);
                }
            };

            // Load existing data for edit mode
            vm.loadExistingData = function (existingLines) {
                if (!existingLines || existingLines.length === 0) {
                    return;
                }

                existingLines.forEach(function (line) {
                    // Find the product in items array if it exists
                    if (line.productId && vm.items && vm.items.length > 0) {
                        var foundItem = vm.items.find(function (item) {
                            return item.id === line.productId;
                        });
                        if (foundItem) {
                            line.product = foundItem;
                        }
                    }

                    // Initialize hidden property
                    line.hidden = false;
                });
            };

            vm.save = function () {
                vm.saving = true;

                vm.stockOpeningBalance.voucherLines.forEach(function (line) {
                    if (line.product) {
                        line.productId = line.product.id;
                        line.unitOfMeasureId = line.product.unitOfMeasureId;
                    }
                    delete line.product;
                });
                if (stockId && stockId > 0) {
                    vm.stockOpeningBalance.voucherLines[0].id = stockId;
                }
                openingBalanceService.createOrEditStockOpeningBalance(vm.stockOpeningBalance)
                    .success(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    })
                    .error(function (error) {
                        abp.notify.error('Error saving stock opening balance');
                        console.error('Save error:', error);
                    })
                    .finally(function () {
                        vm.saving = false;
                    });
            };


            // Init function for edit/create mode
            vm.init = function () {
                if (stockId && stockId > 0) {
                    // Edit mode
                    vm.loading = true;
                    openingBalanceService.getStockOpeningBalanceForEdit(stockId)
                        .success(function (result) {

                            if (result) {
                                // Handle different data structure possibilities
                                var voucherLines = [];

                                if (Array.isArray(result)) {
                                    voucherLines = result;
                                } else if (result.voucherLines && Array.isArray(result.voucherLines)) {
                                    voucherLines = result.voucherLines;
                                } else if (result.productId || result.id) {
                                    voucherLines = [result];
                                }

                                vm.stockOpeningBalance.voucherLines = voucherLines;

                                if (voucherLines.length > 0) {
                                    // Load all items first, then set the existing data

                                    vm.searchItems({ search: '~' }).then(function () {
                                        vm.loadExistingData(vm.stockOpeningBalance.voucherLines);
                                    });
                                } else {
                                    // No existing data, add empty row
                                    vm.stockOpeningBalance.voucherLines = [openingBalanceStockObject()];
                                }
                            } else {
                                // No data returned, start with empty row
                                vm.stockOpeningBalance.voucherLines = [openingBalanceStockObject()];
                            }
                        })
                        .error(function (error) {
                            console.error('Error loading data:', error);
                            abp.notify.error('Error loading stock opening balance data');
                            vm.stockOpeningBalance.voucherLines = [openingBalanceStockObject()];
                        })
                        .finally(function () {
                            vm.loading = false;
                        });
                } else {
                    // Create mode - start with one empty row
                    vm.stockOpeningBalance.voucherLines = [openingBalanceStockObject()];
                }
            };

            // Call init when controller loads
            vm.init();
        }
    ]);
