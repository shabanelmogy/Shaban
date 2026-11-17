// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:305991-306050
appModule.controller('tenant.views.crs.vehicles.addExternalWorkshopVehicle', [
        '$uibModalInstance', 'abp.services.app.vehicle', 'abp.services.app.vehicleModel', 'abp.services.app.commonLookup',
        function ($uibModalInstance, vehicleService, vehicleModelService, lookupService) {
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
            vm.getTariffGroups = function () {

                lookupService.getTariffGroups({}).success(function (data) {
                    vm.tariffGroups = data.items;

                });
            };
            function getNextFleetCode() {
                vehicleService.getNextFleetCode().success(function (fleetCode) {
                    vm.vehicle.fleetCode = fleetCode;
                });
            }
            vm.save = function () {
                vm.vehicle.modelId = vm.vehicle.model.id;
                vm.vehicle.ownership = 4;

                if (vm.vehicle.tariffGroup)
                    vm.vehicle.tariffGroupId = vm.vehicle.tariffGroup.id;
                $uibModalInstance.close(vm.vehicle);

            };
            function init() {
                vm.getTariffGroups();
                getNextFleetCode();
            }
            init();

        }]);
