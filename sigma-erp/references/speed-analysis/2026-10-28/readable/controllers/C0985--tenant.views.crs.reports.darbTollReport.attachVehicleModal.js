// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:267615-267650
appModule.controller('tenant.views.crs.reports.darbTollReport.attachVehicleModal',
        ['$uibModalInstance', 'tollData', 'abp.services.app.toll', 'abp.services.app.vehicle',
            function ($uibModalInstance, tollData, tollsService, vehicleService) {

                var vm = this;
                vm.toll = tollData;
                vm.saving = false;
                vm.vehicle = null;
                vm.plateInfo = `${tollData.plateCode} ${tollData.plateNo}`;

                vm.cancel = function () {
                    $uibModalInstance.dismiss();
                };

                vm.searchVehicles = function ($select) {
                    if ($select.search == "") { vm.vehicles = null; return null; }
                    return vehicleService.searchVehicles({
                        plateNo: $select.search,
                        includeDefleeted: true,
                    }).then(function (response) {
                        vm.vehicles = response.data.items;
                    });
                };
                

                vm.save = function () {
                    vm.saving = true;
                    tollsService.attachVehicleForDarb(vm.toll).success(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                    }).finally(function () {
                        vm.saving = false;
                        $uibModalInstance.close(true);
                    });
                };

            }]);
