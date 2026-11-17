// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:305922-305988
appModule.controller('tenant.views.crs.vehicles.addExternalVehicle', [
        '$uibModalInstance', 'abp.services.app.vehicle', 'abp.services.app.vehicleModel', 'abp.services.app.commonLookup', 'abp.services.app.directory',
        function ($uibModalInstance, vehicleService, vehicleModelService, lookupService, directoryService) {
            var vm = this;
            vm.filters = {
                name: '',
                makeId: null
            };

            vm.vehicle = {
                fleetCode: ''
            };

            vm.localize = function (input) {
                if (input === null)
                    return "";
                return app.localize(input);
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.searchModel = function ($select) {
                vm.filters.name = $select.search;
                if (vm.filters.name === '')
                    vm.filters.name = "~";  //to avoid default suggestions 

                return vehicleModelService.searchVehicleModelsNew(vm.filters).then(function (response) {
                    vm.models = response.data.items;
                });
            };

            vm.getTeriffGroups = function () {

                lookupService.getTariffGroups({}).success(function (data) {
                    vm.tariffGroups = data.items;

                });
            };
            vm.searchSupplier = function ($select) {
                if (!$select.search) return;
                return directoryService.search({ keyword: $select.search, contactType: 3 }).then(function (response) {
                    vm.suppliers = response.data.items;
                });
            };
            function getNextFleetCode() {
                vehicleService.getNextFleetCode().success(function (fleetCode) {
                    vm.vehicle.fleetCode = fleetCode;
                });
            }
            vm.save = function () {
                vm.vehicle.modelId = vm.vehicle.model.id;
                vm.vehicle.ownership = 2;

                if (vm.vehicle.tariffGroup !== null)
                    vm.vehicle.tariffGroupId = vm.vehicle.tariffGroup.id;
                $uibModalInstance.close(vm.vehicle);

            };
            function init() {
                vm.getTeriffGroups();
                getNextFleetCode();
            }
            init();

        }]);
