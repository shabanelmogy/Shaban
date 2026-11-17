// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:45771-45844
appModule.controller('host.views.cbs.projectTaskLogs.createProjectTaskLogModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.deal', 'abp.services.app.user', 'projectTask', 'abp.services.app.projectTaskLog',
    function ($scope, $uibModalInstance, dealService, userService, projectTask, projectTaskLogService) {

        var vm = this;
        vm.saving = false;
        vm.isEditMod = false;
        vm.selectedCountry = null;
     
        vm.projectTask = projectTask;
      
        vm.projectTaskLog = {
            taskId: projectTask.id,
            taskStatus: projectTask.status,
            assignedToUser: projectTask.assignedToUser,
            assignedToUserId: projectTask.assignedToUserId,
            percentComplete: projectTask.percentComplete,
            actualHours: projectTask.actualHours
        };

        vm.statuses = [
                        { id: 1, name: 'New' },
                        { id: 2, name: 'Urgent' },
                        { id: 3, name: 'In Progress' },
                        { id: 4, name: 'Completed' },
        ];
        vm.percentCompleteArray = [0, 25, 50, 75, 95, 100];
        vm.getTaskStatus = function (status) {
            if (!status) return '';
            else if (status == 1) return 'New';
            else if (status == 2) return 'Urgent';
            else if (status == 3) return 'In Progress';
            else if (status == 4) return 'Completed';
        };


        vm.statusChanged = function (id) {
            if (id == 4) {
                vm.projectTaskLog.percentComplete = 100;
            }
        };

        vm.completeStatusChange = function (taskStatus) {
            if (taskStatus == 100) {
                vm.projectTaskLog.taskStatus = 4;
            }
        };
        vm.searchUsers = function ($select) {
            if ($select.search == "")
                return null;
            userService.searchUsers({ keyword: $select.search }).then(function (response) {
                vm.users = response.data.items;
            });
        };
        vm.save = function () {
            
            vm.saving = true;
            projectTaskLogService.createProjectTaskLog(vm.projectTaskLog).success(function () {
                abp.notify.info(app.localize('SavedSuccessfully'));
                //vm.projectTask.status = vm.projectTaskLog.taskStatus;
                //vm.projectTask.assignedToUser = vm.projectTaskLog.assignedToUser;
                //vm.projectTask.assignedToUserId = vm.projectTaskLog.assignedToUserId;
                $uibModalInstance.close(vm.projectTaskLog);
            }).finally(function () {
                vm.saving = false;
            });
        };

        vm.cancel = function () {
            $uibModalInstance.dismiss();
        };

    }
    ]);
