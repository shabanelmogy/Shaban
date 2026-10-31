// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:451472-451607
appModule.controller('tenant.views.vehicles.createOrEditModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.vehicle', 'vehicleId', 'abp.services.app.vehicleModel',
        'abp.services.app.location', '$q', 'abp.services.app.commonLookup', 
        function ($scope, $uibModal, $uibModalInstance, vehicleService, vehicleId, vehicleModelService,
            locationService, $q, lookupService) {

            var vm = this;
            vm.saving = false;
            vm.states = null;
            vm.models = null;
            vm.locations = null;
            vm.fuelLevels = null;
            vm.isEditMod = false;
            vm.selectedModel = null;
            vm.modelSearchText = null;

            vm.isMccEnabled = abp.features.isEnabled('MCC');

            vm.filters = {
                name: '',
                makeId: null
            };

            vm.searchModel = function ($select) {
                vm.filters.name = $select.search;
                if (vm.filters.name == '')
                    vm.filters.name = "~";  //to avoid default suggestions 

                return vehicleModelService.searchVehicleModelsNew(vm.filters).then(function (response) {
                    vm.models = response.data.items;
                });
            };

            vm.save = function () {
                vm.saving = true;
                vm.vehicle.modelId = vm.vehicle.model.id;

                if (vm.vehicle.tariffGroup != null)
                    vm.vehicle.tariffGroupId = vm.vehicle.tariffGroup.id;

                vehicleService.createOrUpdateVehicle({
                    vehicle: vm.vehicle,

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

            function getLocations() {
                vm.loading = true;
                locationService.getLocations({}).success(function (data) {
                    vm.locations = data.items;

                    if (!vm.location && vm.locations.length === 1) {
                        vm.vehicle.locationId = vm.locations[0].id;
                    }

                }).finally(function () {
                    vm.loading = false;
                });
            };

            function getTariffGroups() {               
                vm.loading = true;

                lookupService.getTariffGroups({}).success(function (data) {
                    vm.tariffGroups = data.items;
                }).finally(function () {
                    vm.loading = false;
                });;
            };
            
            vm.createMake = function () {
                openCreateOrEditMakeModal(null);
            };

            function openCreateOrEditMakeModal(makeId) {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/makes/createOrEditModal.cshtml',
                    controller: 'tenant.views.common.makes.createOrEditModal as vm',
                    backdrop: 'static',
                    resolve: {
                        makeId: function () {
                            return makeId;
                        }
                    }
                });
            }

            function openCreateOrEditVehicleModelModal(vehicleModelId) {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/vehiclemodels/createOrEditModal.cshtml',
                    controller: 'tenant.views.common.vehiclemodels.createOrEditModal as vm',
                    backdrop: 'static',
                    resolve: {
                        vehicleModelId: function () {
                            return vehicleModelId;
                        }
                    }
                });
            }

            vm.createVehicleModel = function () {
                openCreateOrEditVehicleModelModal(null);
            };

            function init() {
                getLocations();
                getTariffGroups();

                vehicleService.getVehicleForEdit({
                    id: vehicleId
                }).success(function (result) {
                    vm.vehicle = result;

                    if (vm.vehicle.id > 0) {
                        vm.isEditMod = true;
                    } else {
                        vm.isEditMod = false;
                    }

                    vm.vehicle = result;

                });
            }

            init();
        }
    ]);
