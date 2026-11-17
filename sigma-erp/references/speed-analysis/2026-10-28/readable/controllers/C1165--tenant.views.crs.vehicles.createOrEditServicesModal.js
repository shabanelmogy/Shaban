// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:308048-308206
appModule.controller('tenant.views.crs.vehicles.createOrEditServicesModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.vehicleService', 'abp.services.app.serviceItem', 'vehicleServiceId', 'modelId', 'makeId', 'abp.services.app.designation', 'abp.services.app.item',
        function ($scope, $uibModal, $uibModalInstance, serviceService, serviceItemService, vehicleServiceId, modelId, makeId, designationAppService, itemAppService) {

            var vm = this;
            vm.isWorkshopfeatureEnabled = abp.features.isEnabled("WORKSHOP");

            vm.serviceItems = [];
            vm.selectedServiceItems = [];
            vm.service = null;
            vm.saving = false;

            vm.openServiceItemsSelector = function () {
                if (vm.service) {
                    if (vm.service.serviceItems)
                        openPopup(vm.service.serviceItems);
                }
                else
                    openPopup(null);
            };

            function getDesignations() {
                vm.loading = true;
                designationAppService.getDesignations()
                    .success(function (result) {
                        vm.designations = result.items;
                        vm.loading = false;

                    })
                    .error(function () {
                        vm.loading = false;
                    });
            }

            vm.searchItems = function ($select) {
                if ($select.search === "") { vm.items = null; return null; }
                return itemAppService.searchItems({ name: $select.search }).then(function (response) {
                    vm.items = response.data.items;
                });
            };


            function openPopup(serviceItems) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/serviceItems/serviceItemsSelectorModal.cshtml',
                    controller: 'tenant.views.crs.vehicles.serviceItems.serviceItemsSelectorModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        serviceItemsSelectedList: function () {
                            return {
                                items: serviceItems
                            };
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    if (result !== null) {
                        for (var index in result)
                            vm.service.serviceItems.push(result[index]);
                    }
                });
            }

            vm.deleteItem = function (index) {
                vm.service.serviceItems.splice(index, 1);
            };

            vm.save = function () {
                vm.saving = true;

                if (!vm.isEditMod) //if not edit mod then ensure modelid is set. it will null in case of default service
                {
                    vm.service.modelId = modelId;
                    vm.service.makeId = makeId;
                }

                serviceService.createOrUpdateService({
                    service: vm.service
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

            function getServiceItems() {
                serviceItemService.getServiceItems({})
                    .success(function (result) {
                        vm.serviceItems = result;
                    });
            }

            function servicePartObject() {
                var line = new Object();
                line.part = null;
                line.quantity = null;

                return line;
            }

            vm.addPartsRow = function (line) {
                if (line == undefined)
                    line = servicePartObject();
                vm.service.serviceParts.push(line);
            };

            vm.removePartsRow = function (obj) {
                var index = vm.service.serviceParts.indexOf(obj);
                vm.service.serviceParts.splice(index, 1);
            };
            
            function serviceLabourObject() {
                var line = new Object();
                line.designationId = null;
                line.minutes = null;
                line.cost = null;

                return line;
            }

            vm.addLabourRow = function (line) {
                if (line == undefined)
                    line = serviceLabourObject();
                vm.service.serviceLabourDetails.push(line);
            };

            vm.removeLabourRow = function (obj) {
                var index = vm.service.serviceLabourDetails.indexOf(obj);
                vm.service.serviceLabourDetails.splice(index, 1);
            };

            function init() {
                vm.loading = true;
                getServiceItems();
                getDesignations();

                serviceService.getVehicleServiceForEdit({
                    id: vehicleServiceId
                }).success(function (result) {
                    vm.service = result;
                    if (vm.service.id > 0) {
                        vm.isEditMod = true;
                    } else {
                        vm.isEditMod = false;
                    }
                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
