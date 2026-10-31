// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:102986-103278
appModule.controller('tenant.views.common.projectDetails.index', [
        '$scope', '$uibModal', 'abp.services.app.tenantProjectTask', '$stateParams', 'utilities',
        function ($scope, $uibModal, tanentProjectTaskService, $stateParams, utilities) {

            var vm = this;
            vm.loading = false;
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            vm.multilineStringToHTMLWordBreak = (s) => utilities.multilineStringToHTMLWordBreak(s);
            vm.projectTasks = [];
            vm.filters = {
                projectStatus: 1,
                taskStatusesArray:
                    [
                        { id: 1, name: 'New' },
                        { id: 2, name: 'To Be Discussed' },
                        { id: 3, name: 'In Progress' }
                    ],
                taskStatuses:
                    [
                       1,2,3
                    ]
            };


            if ($stateParams.filters) {
                vm.filters.projectId = $stateParams.filters.id;
                vm.filters.project = $stateParams.filters;
                vm.filters.projectStatus = null;
                vm.filters.taskStatusesArray = [];
            }

            //vm.getLocalDate = function (date) {
            //    if (date != null) {
            //        var localTime = moment.utc(date).toDate();
            //        return moment(localTime).format('DD-MMM-YY');
            //    }
            //    else {
            //        return "";
            //    }
            //};

            vm.gettotalTasksInProject = function (project) {
                var totalTasksInProject = 0;
                var newTasksProject = 0;
                var urgentTasksProject = 0;
                var inProgressTasksProject = 0;
                var completedTasksProject = 0;
                if (!project.milestones) return { totalTasksInProject: totalTasksInProject, newTasksProject: newTasksProject, urgentTasksProject: urgentTasksProject, inProgressTasksProject: inProgressTasksProject, completedTasksProject: completedTasksProject };
                angular.forEach(project.milestones, function (value, key) {
                    if (value.tasks) {
                        totalTasksInProject = totalTasksInProject + value.tasks.length;
                        angular.forEach(value.tasks, function (valueTask) {
                            if (valueTask.status == 1)
                                newTasksProject++;
                            else if (valueTask.status == 2)
                                urgentTasksProject++;
                            else if (valueTask.status == 3)
                                inProgressTasksProject++;
                            else if (valueTask.status == 4)
                                completedTasksProject++;

                        });
                    }
                });
                return { totalTasksInProject: totalTasksInProject, newTasksProject: newTasksProject, urgentTasksProject: urgentTasksProject, inProgressTasksProject: inProgressTasksProject, completedTasksProject: completedTasksProject };
            };

            vm.gettotalTasksInMilestone = function (milestone) {
                var totalTasksInProject = 0;
                var newTasksMilestone = 0;
                var urgentTasksMilestone = 0;
                var inProgressTasksMilestone = 0;
                var completedTasksMilestone = 0;
                if (!milestone.tasks) return { newTasksMilestone: newTasksMilestone, urgentTasksMilestone: urgentTasksMilestone, inProgressTasksMilestone: inProgressTasksMilestone, completedTasksMilestone: completedTasksMilestone };
                angular.forEach(milestone.tasks, function (value, key) {
                    if (value.status == 1)
                        newTasksMilestone++;
                    else if (value.status == 2)
                        urgentTasksMilestone++;
                    else if (value.status == 3)
                        inProgressTasksMilestone++;
                    else if (value.status == 4)
                        completedTasksMilestone++;

                });
                return { newTasksMilestone: newTasksMilestone, urgentTasksMilestone: urgentTasksMilestone, inProgressTasksMilestone: inProgressTasksMilestone, completedTasksMilestone: completedTasksMilestone };
            }

            // Log ProjectTask
            function openProjectTaskLogModal(projectTask, indexes) {
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

                    vm.projectList[indexes.projectIndex].milestones[indexes.milestoneIndex].tasks[indexes.taskIndex] = result;
                })
            }

            // Log ProjectTask Direct
            function openProjectTaskLogModalDirect(projectTask, indexes) {
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

                    projectTask.status = result.taskStatus;
                    projectTask.assignedToUser = result.assignedToUser;
                    projectTask.assignedToUserId = result.assignedToUserId;
                    projectTask.percentComplete = result.percentComplete;

                    vm.projectList[indexes.projectIndex].milestones[indexes.milestoneIndex].tasks[indexes.taskIndex] = projectTask;
                })
            }

            vm.projectTaskLog = function (projectTask, indexes) {
                openProjectTaskLogModal(projectTask, indexes);
            };

            vm.projectTaskLogDirect = function (projectTask, indexes) {
                openProjectTaskLogModalDirect(projectTask, indexes);
            };

       

            // Project Summary Code
            vm.showProjectForSummary = function (project) {
                var count = 0;
                if (!project.milestones) return false;
                angular.forEach(project.milestones, function (value, key) {
                    if (value.tasks) {
                        angular.forEach(value.tasks, function(taskValue) {
                            if (taskValue.status == 2 || taskValue.status == 3)
                                count++;
                        });
                    }
                });
                return count > 0;
            };

            vm.showMilestoneForSummary = function(milestone) {
                var count = 0;
                if (!milestone.tasks) return false;
                angular.forEach(milestone.tasks, function(taskValue) {
                    if (taskValue.status == 2 || taskValue.status == 3)
                        count++;
                });
                return count > 0;
            };

            vm.showCountBadge = function (type) {
                var check = false;
                if (!vm.filters) return false;
                if (!vm.filters.taskStatusesArray) return false;
                if (vm.filters.taskStatusesArray.length == 0) return true;
                angular.forEach(vm.filters.taskStatusesArray, function (value) {
                    if (value.id == type)
                        check = true;
                });
                return check;
            };








            vm.getLocalDate = function (date) {
                if (date !== null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('DD-MMM-YY');
                }
                else {
                    return "";
                }
            };
            vm.round = function (val) { return Math.round(val, 2); }
            vm.statuses = [
                { id: 1, name: 'New' },
                { id: 2, name: 'To Be Discussed' },
                { id: 3, name: 'In Progress' },
                { id: 4, name: 'Completed' },
                { id: 5, name: 'On Hold' }
            ];
            vm.changeTaskStatusFilter = function () {
                vm.filters.taskStatuses = [];
                if (vm.filters.taskStatusesArray.length > 0) {
                    angular.forEach(vm.filters.taskStatusesArray, function (value) {
                        vm.filters.taskStatuses.push(value.id);
                    });
                }
            }
            function sumUpDuration(parentTask) {
                if (!parentTask.children.length) {
                    return parentTask.duration;
                } else {
                    let val = 0.0;
                    for (let i in parentTask.children) {
                        val += sumUpDuration(parentTask.children[i]);
                    }
                    parentTask.duration = val;
                    return val;
                }
            }
            function sumUpRevisedDuration(parentTask) {
                if (!parentTask.children.length) {
                    return parentTask.revisedDuration;
                } else {
                    let val = 0.0;
                    for (let i in parentTask.children) {
                        val += sumUpRevisedDuration(parentTask.children[i]);
                    }
                    parentTask.revisedDuration = val;
                    return val;
                }
            }
            function sumUpDoneHours(parentTask) {
                if (!parentTask.children.length) {
                    return parentTask.actualHours;
                } else {
                    let val = 0.0;
                    for (let i in parentTask.children) {
                        val += sumUpDoneHours(parentTask.children[i]);
                    }
                    parentTask.actualHours = val;
                    return val;
                }
            }
            vm.calcSummaries = function () {

                vm.totalEstimatedHours = 0;
                vm.totalActualHours = 0;
                vm.totalDueHours = 0;
                vm.totalRevisedEstimatedHours = 0;

                for (let i in vm.projectTasks) {
                    sumUpDuration(vm.projectTasks[i]);
                    sumUpRevisedDuration(vm.projectTasks[i]);
                    sumUpDoneHours(vm.projectTasks[i]);
                }

                for (let i in vm.projectTasks) {
                    vm.totalEstimatedHours += vm.projectTasks[i].duration;
                    vm.totalActualHours += vm.projectTasks[i].actualHours;
                    vm.totalRevisedEstimatedHours += vm.projectTasks[i].revisedDuration;
                }

                vm.totalDueHours = vm.totalRevisedEstimatedHours - vm.totalActualHours;
                vm.totalPercentage = vm.totalRevisedEstimatedHours ? (vm.totalActualHours / vm.totalRevisedEstimatedHours * 100) : 0;
            }
            vm.Project = function () {
                tanentProjectTaskService.getProject().success(function (result) {
                    vm.project = result;
                 });
            };
            vm.refresh = function () {
                vm.loading = true;
                 tanentProjectTaskService.getProjectTasks(vm.filters).success(function (result) {
                     vm.projectTasks = result;
                     vm.count = vm.projectTasks.length;
                     vm.Project();
                }).finally(function () {
                    vm.calcSummaries();
                    vm.loading = false;
                });
            };

            function init() {
                vm.refresh();
            }
            init();
        }
    ]);
