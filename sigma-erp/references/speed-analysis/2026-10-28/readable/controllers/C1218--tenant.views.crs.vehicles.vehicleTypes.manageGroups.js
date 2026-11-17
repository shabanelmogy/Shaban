// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:319259-319306
appModule.controller('tenant.views.crs.vehicles.vehicleTypes.manageGroups', [
        '$scope', '$uibModalInstance', 'abp.services.app.tariffGroup', '$filter',
        function ($scope, $uibModalInstance, tariffGroupService, $filter ) {

            var vm = this;

            vm.saving = false;
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            vm.onBlur = function ($event) {
                debugger
                vm.manageGroups = $filter('orderBy')(vm.manageGroups, 'groupNo', false);
            }
            vm.updateGroupNo = function () {
                vm.loading = true;
                tariffGroupService.updateGroupNo(vm.manageGroups)
                    .success(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                        
                    }).finally(function () {
                        vm.loading = false;
                    });
            }

            vm.getVehicleForManageGroups = function () {

                vm.loading = true;
                tariffGroupService.getVehicleForManageGroups()
                    .success(function (data) {
                        debugger
                        vm.manageGroups = data;
                    }).finally(function () {
                        vm.loading = false;
                    });
            };

        
        
            function init() {
                vm.getVehicleForManageGroups();
              
            }

            init();
        }
    ]);
