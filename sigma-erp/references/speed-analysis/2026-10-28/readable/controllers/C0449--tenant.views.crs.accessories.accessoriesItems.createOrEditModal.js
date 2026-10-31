// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:115751-115877
appModule.controller('tenant.views.crs.accessories.accessoriesItems.createOrEditModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.accessory', 'vehicleId', 'abp.services.app.vehicleModel', '$q', 'abp.services.app.commonLookup', 'appSession','utilities',
        function ($scope, $uibModal, $uibModalInstance, accessoriesService, vehicleId, vehicleModelService, $q, lookupService, appSession, utilities) {

            var vm = this;
            vm.saving = false;
            vm.states = null;
            vm.models = null;
            vm.allactionsonotherbranch = abp.auth.hasPermission('Pages.Tenant.Vehicles.AllActionsOnOtherBranchVehicles');

            vm.vehicleLocation = utilities.parseBoolean(abp.setting.get('App.General.Vehicle.Location'));

            vm.isEditMod = false;
            vm.selectedModel = null;
            vm.modelSearchText = null;
            vm.locations = [];
            vm.editMode = true;
            vm.filters = {
                name: '',
                makeId: null
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function getLocations() {
                lookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                });
            }


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

            vm.searchModel = function ($select) {
                vm.filters.name = $select.search;
                if (vm.filters.name == '')
                    vm.filters.name = "~";  //to avoid default suggestions 

                return vehicleModelService.searchVehicleModelsNew(vm.filters).then(function (response) {
                    vm.models = response.data.items;
                });
            };

            vm.locationPermission = function (row) {

                if (!vm.permissions.allActionsOnOtherBranch && row.locationId != appSession.user.locationId) {
                vm.disable = false;
                    return false;
                }

                return true;
            };

            vm.save = function () {
                vm.saving = true;
                vm.accessory.modelId = vm.accessory.model.id;
 
                if (!vm.allactionsonotherbranch == true)
                    vm.accessory.locationId = appSession.user.locationId;

                accessoriesService.createOrUpdateAccessory({
                    accessory: vm.accessory,
                }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };

            function init() {
                vm.loading = true;
                getLocations();
                accessoriesService.getAccessoryForEdit({
                    id: vehicleId

                }).success(function (result) {
                    vm.loading = false;
                    if (vehicleId > 0) {
                        vm.editMode = false;
                    }
                    vm.accessory = result;

                    if (vm.accessory.id > 0)
                        vm.isEditMod = true;
                    else
                        vm.isEditMod = false;
                });
            }

            init();
        }
    ]);
