// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:53043-53065
appModule.controller('host.views.cbs.tasks.taskDetailLog',
        [
            '$scope', '$uibModalInstance', 'taskId', 'abp.services.app.taskDetail',
            function ($scope, $uibModalInstance, taskId, taskDetailService) {
                var vm = this;
                vm.taskDetailLogs = {
                    'taskId': taskId
                };

                vm.cancel = function () {
                    $uibModalInstance.dismiss();
                };

                vm.save = function () {
                    vm.loading = true;
                    taskDetailService.addTaskDetailLogs(vm.taskDetailLogs).success(function () {
                        $uibModalInstance.close();
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        vm.loading = false;
                    });
                }
            }
        ]);
