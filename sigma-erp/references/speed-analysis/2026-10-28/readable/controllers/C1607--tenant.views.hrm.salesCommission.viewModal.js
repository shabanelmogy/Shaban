// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:442554-442584
appModule.controller('tenant.views.hrm.salesCommission.viewModal', [
        '$uibModalInstance', 'abp.services.app.salesCommission', 'options', 'utilities',
        function ($uibModalInstance, salesCommissionService, options, utilities) {

            var vm = this;
            vm.loading = false;
            vm.isViewApprovedSalesCommissionDetails = abp.auth.hasPermission('Pages.HRM.SalesCommission.ViewApprovedSalesCommissionDetails');
            var salesCommissionId = options.id;

            //functions
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };

            function init() {
                vm.loading = true;
                salesCommissionService.getSalesCommissionForView({ id: salesCommissionId }).success(
                    function (result) {
                        vm.salesCommission = result;
                    }).finally(function () {
                        vm.loading = false;
                    });
            }

            init();
        }
    ]);
