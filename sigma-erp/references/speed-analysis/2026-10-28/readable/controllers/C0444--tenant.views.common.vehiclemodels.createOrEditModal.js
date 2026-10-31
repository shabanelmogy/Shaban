// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:115383-115433
appModule.controller('tenant.views.common.vehiclemodels.createOrEditModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.vehicleModel', 'vehicleModelId', 'abp.services.app.make',
        function ($scope, $uibModalInstance, vehicleModelService, vehicleModelId, makeService) {

            var vm = this;
            vm.saving = false;
            vm.vehicleModel = null;

            vm.filters = {
                name: '',
            };
            
            vm.searchMake = function ($select) {
                vm.filters.name = $select.search;
                if (vm.filters.name == '')
                    vm.filters.name = "~";  //to avoid default suggestions 

                return makeService.searchMakes(vm.filters).then(function (response) {
                    vm.makes = response.data.items;
                });
            };
            
            vm.save = function () {
                
                vm.saving = true;
                vm.vehicleModel.makeId = vm.vehicleModel.make.id;
                vehicleModelService.createOrUpdateVehicleModel({
                    vehicleModel: vm.vehicleModel,
                }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function() {
                    vm.saving = false;
                });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            
            function init() {
                vehicleModelService.getVehicleModelForEdit({
                    id: vehicleModelId
                }).success(function (result) {
                    vm.vehicleModel = result;
                });
            }

            init();
        }
    ]);
