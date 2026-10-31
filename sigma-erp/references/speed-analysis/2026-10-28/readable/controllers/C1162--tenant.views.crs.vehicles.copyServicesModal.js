// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:306873-306951
appModule.controller('tenant.views.crs.vehicles.copyServicesModal', [
        '$uibModalInstance', 'abp.services.app.make', 'abp.services.app.vehicleModel', 'abp.services.app.vehicleService', 'options',
        function ($uibModalInstance, makeService, vehicleModelService, vehicleServiceService, options) {

            var vm = this;
            vm.saving = false;

            vm.filters = {
                copyFrom: null,
                copyFromMake: null,
                copyFromMakeId: null,
                copyFromModel: null,
                copyFromModelId: null,
                copyTo: null,
                copyToMakeId: null,
                copyToModelId: null,
            };

            vm.copyOptions = [
                { id: 1, name: "Default Services" },
                { id: 2, name: "Make Services" },
                { id: 3, name: "Model Services" }
            ];


            if (options.makeId > 0) {
                vm.filters.copyTo = 2; //copy to make
                vm.filters.copyToMakeId = options.makeId;
            } else if (options.modelId > 0) {
                vm.filters.copyTo = 3; //copy to model
                vm.filters.copyToModelId = options.modelId;
            }

            vm.searchMake = function ($select) {
                vm.filters.name = $select.search;
                if (vm.filters.name == '')
                    vm.filters.name = "~";  //to avoid default suggestions 

                return makeService.searchMakes(vm.filters).then(function (response) {
                    vm.makes = response.data.items;
                });
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
                vm.filters.copyFromMakeId = null;
                vm.filters.copyFromModelId = null;

                if (vm.filters.copyFrom == 2) { //copy from make
                    vm.filters.copyFromMakeId = vm.filters.copyFromMake.id;
                } else if (vm.filters.copyFrom == 3) { //copy from model
                    vm.filters.copyFromModelId = vm.filters.copyFromModel.id;
                }

                vehicleServiceService.copyServices(vm.filters)
                    .success(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    })
                    .finally(function () {
                        vm.saving = false;
                    });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
        }
    ]);
