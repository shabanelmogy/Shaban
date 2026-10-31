// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:53621-53718
appModule.controller('host.views.cbs.projectTasks.createOrEditProjectTaskModal', [
        '$scope', '$filter', '$uibModalInstance', 'abp.services.app.projectTask', 'options', 'abp.services.app.user',
        function ($scope, $filter, $uibModalInstance, projectTaskService, options, userService) {

            var vm = this;
            vm.loading = false;
            vm.saving = false;
            vm.isEditMode = false;
            vm.taskTypes = [];
            vm.taskSubTypes = [];
            var taskSubTypeFullArray = [];

            vm.getTaskStatus = function (status) {
                if (!status) return '';
                else if (status == 1) return 'New';
                else if (status == 2) return 'Urgent';
                else if (status == 3) return 'In Progress';
                else if (status == 4) return 'Completed';
            };

           

            vm.searchUsers = function ($select) {
                if ($select.search == "")
                    return null;
                userService.searchUsers({ keyword: $select.search }).then(function (response) {
                    vm.users = response.data.items;
                });
            };

            vm.taskTypeChanged = function () {
                vm.projectTask.taskSubTypeId = null;
                vm.taskSubTypes = $filter('filter')(taskSubTypeFullArray, {
                    taskTypeId: vm.projectTask.taskTypeId
                }, true);
            };

            vm.save = function () {
                debugger
                vm.saving = true;
                projectTaskService.createOrUpdateProjectTask({
                    projectTask: vm.projectTask,
                }).success(function (result) {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close(result);
                }).finally(function () {
                    vm.saving = false;
                });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            function getTaskType() {
                projectTaskService.getTaskTypes().success(function (data) {
                    vm.taskTypes = data;
                    //set default value in Type ui-select
                    if (data != null) {
                        vm.projectTask.taskType = data[0];
                    }
                    getTaskSubType();
                });
            }
            function getTaskSubType() {
                projectTaskService.getTaskSubTypes().success(function (data) {
                    vm.taskSubTypes = data;
                    taskSubTypeFullArray = data;
                    if (vm.isEditMode)
                        vm.taskSubTypes = $filter('filter')(taskSubTypeFullArray, {
                            taskTypeId: vm.projectTask.taskTypeId
                        }, true);

                });
            }
            function init() {
                debugger
                vm.loading = true;
                projectTaskService.getProjectTaskForEdit({
                    id: options.projectTaskId
                }).success(function (result) {
                    vm.projectTask = result;
                    vm.projectTask.milestoneId = options.milestoneId;
                    getTaskType();
                    if (vm.projectTask.id > 0) {
                        vm.isEditMode = true;
                    } else {
                        vm.projectTask.priority = options.priority;
                        vm.isEditMode = false;
                    }
                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();

        }
    ]);
