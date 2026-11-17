// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:442168-442214
appModule.controller('tenant.views.hrm.salesCommission.salesCommissionApprovalModal', [
        '$uibModalInstance', 'abp.services.app.salesCommission', 'utilities', 'options',
        function ($uibModalInstance, salesCommissionService, utilities, options) {

            var vm = this;
            vm.loading = false;

            var salesCommissionId = options.id;

            vm.approveSalesCommission = function () {
                vm.isApproving = true;
                salesCommissionService.salesCommissionApproval(salesCommissionId)
                    .success(() => {
                        abp.notify.success("Successfully approved sales commission.");
                        $uibModalInstance.close(true);
                    })
                    .finally(() => {
                        vm.isApproving = false;
                        vm.isApproved = true;
                    });
            };

            vm.cancel = function () {
                $uibModalInstance.close(false);
            };

            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };


            function init() {
                vm.isApproving = false;
                vm.isApproved = false;
                vm.loading = true;
                salesCommissionService.getSalesCommissionForView({ id: salesCommissionId }).success(function (result) {
                    vm.salesCommission = result;


                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
