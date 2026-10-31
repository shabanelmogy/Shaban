// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:441698-441728
appModule.controller('tenant.views.hrm.overtime.viewModal', [
        '$uibModalInstance', 'abp.services.app.overtime', 'options', 'utilities',
        function ($uibModalInstance, overtimeService, options, utilities) {

            var vm = this;
            vm.loading = false;
            vm.isViewApprovedOvertimeDetails = abp.auth.hasPermission('Pages.HRM.Overtime.ViewApprovedOvertimeDetails');
            var overtimeId = options.id;

            //functions
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };

            function init() {
                vm.loading = true;
                overtimeService.getOvertimeForView({ id: overtimeId }).success(
                    function (result) {
                        vm.overtime = result;
                    }).finally(function () {
                        vm.loading = false;
                    });
            }

            init();
        }
    ]);
