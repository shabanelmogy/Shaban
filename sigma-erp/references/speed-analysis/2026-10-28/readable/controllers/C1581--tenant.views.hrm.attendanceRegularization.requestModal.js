// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:436465-436491
appModule.controller('tenant.views.hrm.attendanceRegularization.requestModal', [
        '$uibModalInstance', 'abp.services.app.attendanceRegularization', 'attendance',
        function ($uibModalInstance, regularizationService, attendance) {

            var vm = this;
            vm.attendance = attendance;
            vm.reason = '';
            vm.saving = false;

            vm.submit = function () {
                if (!vm.reason) return;
                vm.saving = true;
                regularizationService.createRequest({
                    attendanceLineId: vm.attendance.id,
                    reason: vm.reason
                }).success(function () {
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
