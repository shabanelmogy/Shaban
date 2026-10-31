// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:465612-465775
appModule.controller('tenant.views.stock.items.createOrEditModal', [
        '$scope', 'utilities', '$uibModalInstance', 'itemId', 'abp.services.app.item', 'abp.services.app.itemType', 'abp.services.app.commonLookup', 'abp.services.app.vehicleModel', 'abp.services.app.unitOfMeasure',
        function ($scope, utilities, $uibModalInstance, itemId, itemAppService, itemTypeAppService, commonLookupService, vehicleModelService, unitOfMeasureAppService) {

            var vm = this;
            vm.loading = false;
            vm.isVehicleMakeAndModelRequired = utilities.parseBoolean(abp.setting.get("App.Speed.Common.IsVehicleMakeAndModelRequired"));
            vm.isManualItemCodeEnabled = utilities.parseBoolean(abp.setting.get("App.DocumentNos.ManualItemCode"));
            vm.isMinimumStockValue = utilities.parseBoolean(abp.setting.get("App.Speed.Common.MinimumStockAlerts"));
            vm.autosetItemPrice = utilities.parseBoolean(abp.setting.get("App.Speed.Common.AutosetItemPrice"));
            vm.canEditPrice = abp.auth.hasPermission('Pages.STOCK.Items.Edit.EditPrice');
            //vm.isDisableItemPriceOnItemEditing = utilities.parseBoolean(abp.setting.get("App.Speed.Common.DisableItemPriceOnItemEditing"));
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.item = {};
            vm.filters = {};
            vm.itemTypes = [];
            vm.unitOfMeasures = [];
            vm.locations = [];
            
            vm.searchModel = function ($select) {
                vm.filters.name = $select.search;
                if (vm.filters.name === '')
                    vm.filters.name = "~";  //to avoid default suggestions 
                vehicleModelService.searchVehicleModelsNew(vm.filters).then(function (response) {
                    vm.models = response.data.items;
                });

            };

            vm.searchMake = function ($select) {
                vm.filters.name = $select.search;
                if (vm.filters.name === '')
                    vm.filters.name = "~";  //to avoid default suggestions 

                return vehicleModelService.searchVehicleMakes(vm.filters).then(function (response) {
                    vm.makes = response.data.items;
                });
            };

            vm.clearModelData = function () {
                vm.models = null;
                vm.item.model = null;
                vm.modelId = null;
            };

            vm.createItem = function () {
                vm.loading = true;

                itemAppService.createOrUpdateItem({ item: vm.item })
                    .success(function (result) {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).error(function (result) {
                        abp.notify.error(app.localize('RecordNotSaved.'));
                    }).finally(function () {
                        vm.loading = false;
                    });
            };

            vm.getUnitOfMeasures = function () {
                if (vm.unitOfMeasures.length === 0) {
                    vm.loading = true;
                    unitOfMeasureAppService.getUnitOfMeasures()
                        .success(function (result) {
                            vm.unitOfMeasures = result.items;
                        }).finally(function () {
                            vm.loading = false;
                        });
                }

            };

            function getLocations() {
                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                });
            }

            vm.getItemTypes = function () {
                if (vm.itemTypes.length === 0) {
                    vm.loading = true;
                    itemTypeAppService.getItemTypes()
                        .success(function (result) {
                            vm.itemTypes = result.items;
                        }).finally(function () {
                            vm.loading = false;
                        });
                }
            };

            vm.filterItemType = function (itemTypeId) {
                angular.forEach(vm.itemTypes, function (itemType) {
                    if (itemTypeId === itemType.id) {
                        vm.item.itemType = itemType;
                    }
                });

                if (vm.item.itemType.category == 1) {
                    vm.item.itemVehicleModels = vm.item.itemVehicleModels || [];
                    if (vm.item.itemVehicleModels.length == 0)
                        vm.addRow();
                }

            };

            init();

            function init() {

                if (itemId > 0) {
                    vm.loading = true;
                    getLocations();
                    itemTypeAppService.getItemTypes()
                        .success(function (result) {
                            vm.itemTypes = result.items;

                            unitOfMeasureAppService.getUnitOfMeasures()
                                .success(function (result) {
                                    vm.unitOfMeasures = result.items;

                                    itemAppService.getItem({ id: itemId })
                                        .success(function (result) {
                                            vm.item = result;
                                            if (vm.item.model) {
                                                vm.item.make = vm.item.model.make;
                                            }
                                        }).finally(function () {
                                            vm.loading = false;
                                        });

                                }).error(function () {
                                    vm.loading = false;
                                });

                        }).error(function () {
                            vm.loading = false;
                        });

                }
                else {

                    vm.getItemTypes();
                    getLocations();
                    vm.getUnitOfMeasures();
                    if (vm.autosetItemPrice)
                        vm.item.price = 0;
                }
            }

            vm.addRow = function () {

                vm.item.itemVehicleModels = vm.item.itemVehicleModels || [];
                vm.item.itemVehicleModels.push({});
            }

            vm.removeRow = function (row) {
                var index = vm.item.itemVehicleModels.indexOf(row);
                vm.item.itemVehicleModels.splice(index, 1);
            }
        }
    ]);
