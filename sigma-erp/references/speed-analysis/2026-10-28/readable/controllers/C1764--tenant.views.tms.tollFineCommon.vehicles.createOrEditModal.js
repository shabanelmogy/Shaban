// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:482167-482261
appModule.controller('tenant.views.tms.tollFineCommon.vehicles.createOrEditModal',
        [
            '$scope', '$uibModal', '$uibModalInstance', 'vehicleId', 'abp.services.app.vehicle', 'abp.services.app.vehicleModel',
            function ($scope, $uibModal, $uibModalInstance, vehicleId, vehicleService, vehicleModelService) {
                var vm = this;

                vm.vehicle = new Object;
                vm.filters = {
                    name: '',
                    makeId: null
                };
                vm.models = [];

                vm.searchModel = function ($select) {
                    debugger;
                    vm.filters.name = $select.search;
                    if (vm.filters.name == '')
                        vm.filters.name = "~";  //to avoid default suggestions 

                    return vehicleModelService.searchVehicleModelsNew(vm.filters).then(function (response) {
                        vm.models = response.data.items;
                    });
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

                vm.createVehicleModel = function () {
                    openCreateOrEditVehicleModelModal(null);
                };
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

                vm.cancel = function () {
                    $uibModalInstance.dismiss();
                };

                vm.save = function () {
                    debugger;
                    vm.saving = true;
                    if (vm.vehicle.model)
                        vm.vehicle.modelId = vm.vehicle.model.id;
                    vm.vehicle.id = vehicleId;

                    vehicleService.createOrUpdateVehicleForTms(vm.vehicle).success(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                };

                function init() {
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
