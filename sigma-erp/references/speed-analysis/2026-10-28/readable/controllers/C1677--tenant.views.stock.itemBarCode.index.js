// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:464441-464556
appModule.controller('tenant.views.stock.itemBarCode.index', [
        '$scope', 'abp.services.app.barCodeLabel', 'abp.services.app.location', 'abp.services.app.vehicleModel', 'abp.services.app.itemType', 'abp.services.app.commonLookup', 'abp.services.app.vehicle', 'utilities',
        function ($scope, barCodelabelService, locationService, vehicleModelService, itemTypeAppService, lookupService, utilities) {

            var vm = this;
            vm.labelType = 1;
            vm.tenant = null;
            vm.allowDetailsOnBarcode = abp.setting.getBoolean("App.General.AllowItemDetailsOnBarcode");
            if (vm.allowDetailsOnBarcode) {
                abp.services.app.session.getCurrentLoginInformations({ async: false }).done(function (result) {
                    vm.tenant = result.tenant;
                });
            }
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.labels = null;
            vm.itemTypes = [];
            vm.models = null;
            vm.items = {
                filter: '',
                sorting: '',
                /* itemTypes:'',*/
                itemName: '',
                supplierItemCode: '',
            };
            vm.filters = {
                fleetCode: null,
                location: '',
                labelType: 1,
                vehicleId: ''
            };

            vm.clearVehicle = function () {
                vm.vehicle = null;
                vm.filters.vehicleId = '';
            };
            vm.clearModel = function () {
                vm.items.model = null;
                vm.items.modelId = '';
            };

            vm.getItems = function () {
                vm.loading = true;
                if (vm.items.model)
                    vm.items.modelId = vm.items.model.id;

                itemAppService.getItems(vm.items)
                    .success(function (data) {
                        vm.gridOptions.totalItems = data.totalCount;
                        vm.gridOptions.data = data.items;
                    }).finally(function () {
                        vm.loading = false;
                    });
            };
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
            };

            vm.getLabels = function () {
                vm.loading = true;

                if (vm.items.model)
                    vm.items.modelId = vm.items.model.id;
                barCodelabelService.generateBarCodes(vm.items).success(function (data) {
                    vm.labels = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };
            vm.searchModel = function ($select) {
                vm.filters.name = $select.search;
                if (vm.filters.name == '')
                    vm.filters.name = "~";  //to avoid default suggestions 

                return vehicleModelService.searchPreUsedVehicleModels(vm.filters).then(function (response) {
                    vm.models = response.data.items;
                });
            };
            function getTariffGroups() {
                //vm.loading = true;
                lookupService.getTariffGroups({}).success(function (data) {
                    vm.tariffGroups = data.items;
                });
            };
            function init() {
                locationService.getLocations().success(function (data) {
                    vm.locations = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
            getTariffGroups();
            vm.getItemTypes();
        }
    ]);
