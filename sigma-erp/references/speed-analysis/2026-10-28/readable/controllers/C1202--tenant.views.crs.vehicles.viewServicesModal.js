// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:316627-316679
appModule.controller('tenant.views.crs.vehicles.viewServicesModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.vehicleService', 'abp.services.app.serviceItem', 'vehicleServiceId', 'abp.services.app.designation',
        function ($scope, $uibModal, $uibModalInstance, serviceService, serviceItemService, vehicleServiceId, designationAppService) {


            var vm = this;
            vm.isWorkshopfeatureEnabled = abp.features.isEnabled("WORKSHOP");

        vm.serviceItems = [];
        vm.service = null;

        vm.cancel = function () {
            $uibModalInstance.dismiss();
        };

        function getServiceItems() {
            serviceItemService.getServiceItems({})
            .success(function (result) {
                vm.serviceItems = result;
            });
        }

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
        function init() {
            vm.loading = true;
            getServiceItems();
            getDesignations();
            serviceService.getVehicleServiceForEdit({ id: vehicleServiceId })
            .success(function (result) {
                vm.service = result;
                if (vm.service.dueOnMonths == 0)
                    vm.service.dueOnMonths = null;
                vm.loading = false;
            })
            .error(function () {
                vm.loading = false;
            });
        }

        init();
    }
    ]);
