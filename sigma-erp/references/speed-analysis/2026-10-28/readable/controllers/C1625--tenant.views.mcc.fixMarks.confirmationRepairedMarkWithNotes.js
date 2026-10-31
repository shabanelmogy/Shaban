// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:445874-445912
appModule.controller('tenant.views.mcc.fixMarks.confirmationRepairedMarkWithNotes', [
        'mark', '$uibModalInstance', 'abp.services.app.movement',
        function (mark, $uibModalInstance, movementService) {

            var vm = this;
            vm.loading = false;
            vm.mark = mark;

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.save = function () {
                vm.loading = true;
                if (vm.mark.length > 0) {
                    movementService.repairAllMarks({
                        marks: vm.mark,
                        notes: vm.mark.notes
                    }).success(function () {
                        $uibModalInstance.close(true);
                    }).finally(function () {
                        vm.loading = false;
                    });

                }
                else {
                    movementService.repairMark({
                        markId: vm.mark.mark.id,
                        checkType: vm.mark.checkType,
                        notes: vm.mark.notes
                    }).success(function () {
                        $uibModalInstance.close(true);
                    }).finally(function () {
                        vm.loading = false;
                    });
                }
            }
        }
    ]);
