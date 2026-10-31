// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:45847-45915
appModule.controller('host.views.cbs.projectTaskLogs.projectTaskLog', [
        '$scope', '$uibModal', '$uibModalInstance', 'projectTask', 'abp.services.app.deal', 'uiGridConstants', 'abp.services.app.projectTaskLog',
        function ($scope, $uibModal, $uibModalInstance, projectTask, dealService, uiGridConstants, projectTaskLogService) {
            var vm = this;
            vm.saving = false;
            vm.loading = false;
            vm.projectTaskLog = {};
            vm.projectTask = projectTask;
            var loadTaskLogs = false;
            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('YYYY-MM-DD HH:mm');
                }
                else {
                    return "";
                }
            };
            vm.getTaskStatus = function (status)
            {
                if (!status) return '';
                else if (status == 1) return 'New';
                else if (status == 2) return 'Urgent';
                else if (status == 3) return 'In Progress';
                else if (status == 4) return 'Completed';
            };
            vm.addProjectTaskLog = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/projectTaskLogs/createProjectTaskLogModal.cshtml',
                    controller: 'host.views.cbs.projectTaskLogs.createProjectTaskLogModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        projectTask: function () {
                            return projectTask;
                        }
                    }

                });

                modalInstance.result.then(function (result) {
                    vm.projectTaskLog = result;
                    init();
                    loadTaskLogs = true;
                });
            };

            vm.cancel = function () {
                if (loadTaskLogs) {
                    projectTask.status = vm.projectTaskLog.taskStatus;
                    projectTask.assignedToUser = vm.projectTaskLog.assignedToUser;
                    projectTask.assignedToUserId = vm.projectTaskLog.assignedToUserId;
                    projectTask.percentComplete = vm.projectTaskLog.percentComplete;
                    $uibModalInstance.close(projectTask);
                }
                else $uibModalInstance.dismiss();
            };

            function init() {
                vm.loading = true;
                projectTaskLogService.getProjectTaskLogs({ id: projectTask.id }).success(function (result) {
                    vm.projectTaskLogs = result.items;
                }).finally(function () {
                    vm.loading = false;
                });
            }
            init();
        }
    ]);
