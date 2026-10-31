// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:430932-430963
appModule.controller('tenant.views.fms.organizationChart.createOrEditUnitModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.organizationChart', 'organizationUnit',
        function ($scope, $uibModalInstance, organizationUnitService, organizationUnit) {
            var vm = this;

            vm.organizationUnit = organizationUnit;

            vm.saving = false;

            vm.save = function () {
                if (vm.organizationUnit.id) {
                    organizationUnitService
                        .updateOrganizationUnit(vm.organizationUnit)
                        .success(function(result) {
                            abp.notify.info(app.localize('SavedSuccessfully'));
                            $uibModalInstance.close(result);
                        });
                } else {
                    organizationUnitService
                        .createOrganizationUnit(vm.organizationUnit)
                        .success(function(result) {
                            abp.notify.info(app.localize('SavedSuccessfully'));
                            $uibModalInstance.close(result);
                        });
                }
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
        }
    ]);
