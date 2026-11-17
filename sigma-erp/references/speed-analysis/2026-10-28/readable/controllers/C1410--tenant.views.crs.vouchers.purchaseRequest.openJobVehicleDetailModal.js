// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:384572-384622
appModule.controller('tenant.views.crs.vouchers.purchaseRequest.openJobVehicleDetailModal', [
        '$uibModalInstance', 'abp.services.app.vehicle', 'abp.services.app.vehicleModel', 'abp.services.app.commonLookup', 'vehicleDetail',
        function ($uibModalInstance, vehicleService, vehicleModelService, lookupService, vehicleDetail) {
            var vm = this;
            vm.filters = {
                name: '',
                makeId: null
            };
            vm.vehicles = vehicleDetail;

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
            
            function init() {
            }
            init();

        }]);
