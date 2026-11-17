// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:236051-236074
appModule.controller('tenant.views.crs.lease.costingParameters.createOrEditModal', [
        '$scope', '$uibModalInstance', 'costingParameter', 'abp.services.app.costParameter',
        function ($scope, $uibModalInstance, costingParameter, costParameterService) {

            var vm = this;
            vm.saving = false;
            vm.costingParameter = null;
            vm.costingParameter = costingParameter;
            vm.save = function () {
                vm.saving = true;
                costParameterService.createOrUpdateCostParameter(vm.costingParameter).success(function (data) {
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
           
           
        }
    ]);
