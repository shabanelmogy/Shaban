// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:39147-39311
appModule.controller('host.views.cbs.projectsDashboard.CriticalTasks', [
        '$scope', 'projectId', '$uibModalInstance', '$uibModal', 'abp.services.app.user', 'appSession', 'abp.services.app.projectTask', 'abp.services.app.taskDetail', 'abp.services.app.release', 'abp.services.app.supportRequestHost', 'abp.services.app.dataEntryCorrectionHost', 'abp.services.app.customizationHost', 'utilities',
        function ($scope, projectId, $uibModalInstance, $uibModal, userService, appSession, projectTaskService, taskDetailService, releaseService, supportRequestService, dataEntryCorrectionService, customizationService, utilities) {

            var vm = this;
            vm.loading = false;
            

            // Filters of Critical Tasks
            vm.filters = {
                //userId: appSession.user.id,
                //user: appSession.user,
                taskStatusesArray:
                    [
                        { id: 1, name: 'New' },
                        { id: 2, name: 'TBD' },
                        { id: 3, name: 'In Progress' }
                    ],
                maxResultCount: app.consts.grid.defaultPageSize,
            };


            // GetCritical task Data in the Modal.
                vm.CriticalTaskData = [];
                vm.criticalTasksByProjectId = function () {
                vm.loading = true;
                vm.totalTaskNumbers = 0;
                vm.filters.taskStatuses = [];
                vm.filters.ProjectId = projectId;
                if (vm.filters.taskStatusesArray.length > 0) {
                    angular.forEach(vm.filters.taskStatusesArray, function (value) {
                        vm.filters.taskStatuses.push(value.id);
                    });
                }
                projectTaskService.getCriticalTasksByProjectId(vm.filters).success(function (data) {
                    vm.CriticalTaskData = data;
                }).finally(function () {
                    vm.loading = false;
                });
            };


            //Refresh modal.
            vm.refresh = function () {
                vm.criticalTasksByProjectId();
            };


            //Close the Modal.
            vm.cancel = function () {
                $uibModalInstance.close();
            };


            // Make the Task Column in Correct Format.
            vm.multilineStringToHTMLWordBreak = (s) => utilities.multilineStringToHTMLWordBreak(s);

            // Edit Critical Tasks's Project Detail
            vm.editProjectTask = function (projectTask) {
                editProjectTaskModal(projectTask);
            };
            function editProjectTaskModal(projectTask) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/taskDetails/viewOrEditProjectTaskModal.cshtml',
                    controller: 'host.views.cbs.tasks.createOrEditProjectTaskModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        options: function () {
                            return {
                                projectId: projectTask.projectId,
                                parentId: projectTask.parentTaskId,
                                taskId: projectTask.id
                            };
                        }
                    }
                });

                modalInstance.result.then(function (tasks) {
                    vm.criticalTasksByProjectId();
                });
            }


            // Update Critical Tasks's Detail
            vm.openmanageTaskModal = function (task) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/taskDetails/taskManageModal.cshtml',
                    controller: 'host.views.cbs.task.taskManagerModal as vm',
                    backdrop: 'static',
                    resolve: {
                        options: function () {
                            return {
                                projectId: task.projectId,
                                parentId: task.parentId,
                                taskId: task.id
                            };
                        }
                    },
                    size: 'lg'
                });
                modalInstance.result.then(function (updatedTaskDetail) {
                    if (updatedTaskDetail !== null) {
                        vm.criticalTasksByProjectId();

                    }
                });
            };


           // Conversions
            vm.taskStatuses =
                [
                    { id: 1, name: 'New' },
                    { id: 2, name: 'TBD' },
                    { id: 3, name: 'In Progress' },
                    { id: 4, name: 'Completed' }
                ];
            vm.getTaskStatus = function (status) {
                if (!status) return '';
                else if (status == 1) return 'New';
                else if (status == 2) return 'To Be Discussed';
                else if (status == 3) return 'In Progress';
                else if (status == 4) return 'Completed';
                else return '';
            };
            vm.getLocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('DD-MMM-YY');
                }
                else {
                    return "";
                }
            };
            vm.getDateColorClass = function (date) {
                if (date !== null) {
                    var localTime = moment.utc(date).toDate();
                    var todaysDate = new Date();
                    if (localTime.setHours(0, 0, 0, 0) === todaysDate.setHours(0, 0, 0, 0)) {
                        // Date equals today's date
                        return 1;
                    }
                    else if (localTime.setHours(0, 0, 0, 0) < todaysDate.setHours(0, 0, 0, 0)) {
                        // Date equals today's date
                        return 2;
                    }
                    return -1;
                }
                else {
                    return -1;
                }
            };           
            vm.roundOf = function (value) {
                if (!value) return 0;
                return Math.round(value, 2);
            };

            // Default Function
            function init() {
                vm.criticalTasksByProjectId();
            }
            init();
        }
    ]);
