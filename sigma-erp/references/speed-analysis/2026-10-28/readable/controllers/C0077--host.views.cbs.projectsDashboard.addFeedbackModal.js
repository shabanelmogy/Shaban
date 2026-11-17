// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:38796-38829
appModule.controller('host.views.cbs.projectsDashboard.addFeedbackModal', [
        '$scope', '$uibModalInstance', 'taskDetail', 'abp.services.app.taskFeedback',
        function ($scope, $uibModalInstance, taskDetail, taskFeedbackService) {

            var vm = this;
            vm.saving = false;
            vm.taskDetail = taskDetail;

            vm.categories = [{ id: 3, name: "Enhancement" },
                { id: 4, name: "Change in Scope" },
                { id: 2, name: "Bug" }
            ];

            vm.feedback = {
                taskDetailId: taskDetail.id
            };
            
            vm.save = function () {
                vm.saving = true;
                taskFeedbackService.createFeedback(
                    vm.feedback
                ).success(function (voucherNo) {
                    abp.notify.info("Saved Successfully");
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
