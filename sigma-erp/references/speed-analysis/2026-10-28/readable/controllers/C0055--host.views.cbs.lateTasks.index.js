// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:35601-35695
appModule.controller('host.views.cbs.lateTasks.index', [
        '$scope', '$uibModal', 'abp.services.app.projectTask',
        function ($scope, $uibModal, projectTaskService) {

            var vm = this;
            vm.loading = false;

            vm.getTaskStatus = function (status) {
                if (!status) return '';
                else if (status == 1) return 'New';
                else if (status == 2) return 'Urgent';
                else if (status == 3) return 'In Progress';
                else if (status == 4) return 'Completed';
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

            function openViewProjectTaskModal(projectTask) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/tasks/viewModal.cshtml',
                    controller: 'host.views.cbs.projectTasks.viewModal as vm',
                    backdrop: 'static',
                    resolve: {
                        options: function () {
                            return {
                                projectTaskId: projectTask.id
                            }
                        }
                    }
                });
            }

            function openProjectTaskLogModal(projectTask) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/projectTaskLogs/projectTaskLog.cshtml',
                    controller: 'host.views.cbs.projectTaskLogs.projectTaskLog as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        projectTask: function () {
                            return projectTask;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    init();
                })
            }

            function editProjectTaskModal(projectTask) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/tasks/createOrEditProjectTaskModal.cshtml',
                    controller: 'host.views.cbs.projectTasks.createOrEditProjectTaskModal as vm',
                    backdrop: 'static',
                    resolve: {
                        options: function () {
                            return {
                                projectTaskId: projectTask.id
                            }
                        }
                    }
                });
            }

            vm.viewProjectTask = function (projectTask) {
                openViewProjectTaskModal(projectTask);
            };

            vm.editProjectTask = function (projectTask) {
                editProjectTaskModal(projectTask);
            };

            vm.projectTaskLog = function (projectTask) {
                openProjectTaskLogModal(projectTask);
            };

            function init() {
                vm.loading = true;
                projectTaskService.getLateTasks().success(function (data) {
                    vm.lateTasksData = data;
                }).success(function () {
                    vm.loading = false;
                });
            }
            init();
        }
    ]);
