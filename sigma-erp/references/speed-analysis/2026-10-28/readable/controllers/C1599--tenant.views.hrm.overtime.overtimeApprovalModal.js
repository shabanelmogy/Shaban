// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:441310-441356
appModule.controller('tenant.views.hrm.overtime.overtimeApprovalModal', [
        '$uibModalInstance', 'abp.services.app.overtime', 'utilities', 'options',
        function ($uibModalInstance, overtimeService, utilities, options) {

            var vm = this;
            vm.loading = false;

            var overtimeId = options.id;

            vm.approveOvertime = function () {
                vm.isApproving = true;
                overtimeService.overTimeApproval(overtimeId)
                    .success(() => {
                        abp.notify.success("Successfully approved overtime.");
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
                overtimeService.getOvertimeForView({ id: overtimeId }).success(function (result) {
                    vm.overtime = result;


                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
