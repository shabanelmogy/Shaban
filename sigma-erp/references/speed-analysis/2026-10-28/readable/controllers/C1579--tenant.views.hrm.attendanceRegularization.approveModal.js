// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:436294-436328
appModule.controller('tenant.views.hrm.attendanceRegularization.approveModal', [
        '$uibModalInstance', 'abp.services.app.attendanceRegularization', 'regularization', 'action',
        function ($uibModalInstance, regularizationService, regularization, action) {

            var vm = this;
            vm.regularization = regularization;
            vm.isApprove = action === 'approve';
            vm.note = '';
            vm.saving = false;

            vm.getlocalDate = function (date) {
                if (!date) return '';
                return moment.utc(date).local().format(abp.setting.get('App.General.DateFormat') || 'DD/MM/YYYY');
            };

            vm.confirm = function () {
                vm.saving = true;
                var method = vm.isApprove
                    ? regularizationService.approveRequest
                    : regularizationService.rejectRequest;

                method({ id: vm.regularization.id, note: vm.note })
                    .success(function () {
                        abp.notify.success(app.localize(vm.isApprove ? 'Approved' : 'Rejected'));
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
