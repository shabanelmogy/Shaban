// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:53572-53618
appModule.controller('host.views.cbs.tasks.updateStatusAndProgress',
        [
            '$scope', '$uibModalInstance', 'options', 'abp.services.app.taskDetail',
            function ($scope, $uibModalInstance, options, taskDetailService ) {
                var vm = this;

                vm.statuses = [
                    { id: 1, name: 'New' },
                    { id: 2, name: 'Urgent' },
                    { id: 3, name: 'In Progress' },
                    { id: 4, name: 'Completed' },
                    { id: 5, name: 'On Hold' }
                ];

                vm.progressValues = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

                vm.taskDetail = {
                    id: options.taskId
                };

                vm.cancel = function () {
                    $uibModalInstance.dismiss();
                };

                function getTaskDetailForEdit() {
                    vm.loading = true;
                    taskDetailService.getTaskDetailForEdit(options.taskId).success(function (result) {
                        vm.taskDetail = result;
                        vm.loading = false;
                    });
                }

                vm.save = function () {
                    vm.loading = true;
                    taskDetailService.updateStatusAndProgress(vm.taskDetail).success(function(result) {
                        $uibModalInstance.close(vm.taskDetail);
                        abp.notify.info(app.localize('SavedSuccessfully'));
                    });
                }

                function init() {
                    getTaskDetailForEdit();
                }

                init();
            }
        ]);
