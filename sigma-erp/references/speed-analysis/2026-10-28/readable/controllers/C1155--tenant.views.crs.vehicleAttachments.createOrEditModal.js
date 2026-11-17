// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:305407-305583
appModule.controller('tenant.views.crs.vehicleAttachments.createOrEditModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.vehicleAttachment','abp.services.app.vehicle', 'attachmentId', 'abp.services.app.vehicleModel', '$q', 'abp.services.app.commonLookup', 'appSession','utilities',
        function ($scope, $uibModal, $uibModalInstance, attachmentService, vehicleService, attachmentId, vehicleModelService, $q, lookupService, appSession, utilities,) {

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

            vm.searchSupplier = function ($select) {

                return lookupService.searchContact({ keyword: $select.search, contactType: 3 }).then(function (response) {
                    vm.suppliers = response.data.items;
                });
            };

            vm.searchVehicles = function ($select) {
                if ($select.search === "") { vm.vehicles = null; return null; }
                return vehicleService.searchVehicles({ plateNo: $select.search }).then(function (response) {
                    vm.vehicles = response.data.items;
                });
            };

            vm.clearVehicle = function () {
                vm.vehicleAttachment.parentVehicle = null;
                vm.vehicleAttachment.parentVehicleId = null;
            };
            function openSearchVehicleModal() {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/searchVehicleModal.cshtml',
                    controller: 'tenant.views.crs.vehicles.searchVehicleModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        options: {
                            //tariffGroupId: null,
                            //modelId = null
                        }
                    }

                });

                modalInstance.result.then(function (result) {
                    if (result !== null) {
                        vm.vehicleAttachment.parentVehicle = result;
                        vm.vehicleAttachment.parentVehicleId = result.id;
                    }
                });
            }
            vm.save = function () {
                vm.saving = true;
                vm.vehicleAttachment.modelId = vm.vehicleAttachment.model.id;

                attachmentService.createOrUpdateVehicleAttachment({
                    vehicleAttachment: {
                        id: vm.vehicleAttachment.id,
                        plateNo: vm.vehicleAttachment.plateNo,
                        locationId: vm.vehicleAttachment.locationId,
                        modelId: vm.vehicleAttachment.modelId,
                        modelYear: vm.vehicleAttachment.modelYear,
                        registrationDate: vm.vehicleAttachment.registrationDate,
                        nextRegistrationDate: vm.vehicleAttachment.nextRegistrationDate,
                        fleetCode: vm.vehicleAttachment.fleetCode,
                        notes: vm.vehicleAttachment.notes,
                        supplierId: vm.vehicleAttachment.supplierId,
                        customField1: vm.vehicleAttachment.customField1,
                        parentVehicleId: vm.vehicleAttachment.parentVehicleId,
                    }
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
                attachmentService.getVehicleAttachmentForEdit({
                    id: attachmentId

                }).success(function (result) {
                    vm.loading = false;
                    if (attachmentId > 0) {
                        vm.editMode = false;
                    }
                    vm.vehicleAttachment = result;

                    if (vm.vehicleAttachment.id > 0)
                        vm.isEditMod = true;
                    else
                        vm.isEditMod = false;
                });
            }

            init();
        }
    ]);
