// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:86781-86827
appModule.controller('tenant.views.costCenters.createOrEditModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.costCenter', 'costCenterId',
        function ($scope, $uibModalInstance, costCenterService, costCenterId) {

            var vm = this;
            vm.loading = false;
            vm.saving = false;
            vm.costCenter = {
                type: 2
            };

            vm.costCenterTypes = [
                { id: 1, name: app.localize('CostCenterGroup1') },
                { id: 2, name: app.localize('CostCenterGroup2') }
            ];

            vm.save = function () {
                vm.saving = true;
                costCenterService.createOrUpdateCostCenter({
                    costCenter: vm.costCenter,
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

            function init() {
                if (costCenterId) {
                    vm.loading = true;
                    costCenterService.getCostCenterForEdit({
                        id: costCenterId
                    }).success(function (result) {
                        vm.costCenter = result;
                        vm.loading = false;
                    });
                }
            }

            init();
        }
    ]);
