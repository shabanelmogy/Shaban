// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:37616-38245
appModule.controller('host.views.cbs.projects.printProject', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.project', 'abp.services.app.directory', 'abp.services.app.projectTask', 'abp.services.app.milestone', '$stateParams', 'abp.services.app.user',
        function ($scope, $uibModal, uiGridConstants, projectService, directoryService, projectTaskService, milestoneService, $stateParams, userService) {

            var vm = this;
            vm.loading = false;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.projectList = [];
            vm.filters = {
                projectStatus: 1,
                projectId: null,
                taskStatusesArray: [{ id: 1, name: 'New' },
                        { id: 2, name: 'Urgent' },
                        { id: 3, name: 'In Progress' }
                ],
                users: []
            };


            if ($stateParams.filters) {
                vm.filters.projectId = $stateParams.filters.id;
                vm.filters.project = $stateParams.filters;
                vm.filters.projectStatus = null;
                vm.filters.taskStatusesArray = [];
            }

            vm.projectStatuses = [
                       { id: 1, name: 'Open' },
                       { id: 2, name: 'Closed' },
                       { id: 3, name: 'On Hold' },
                       { id: 4, name: 'Cancelled' },
            ];

            vm.taskStatuses = [
                        { id: 1, name: 'New' },
                        { id: 2, name: 'Urgent' },
                        { id: 3, name: 'In Progress' },
                        { id: 4, name: 'Completed' },
            ];


            vm.taskStatus = function (status) {
                
                var name = "";
                if (status == 1) {
                    name = "Due";

                }
                else if (status == 2) {
                    name = "Due";

                }
                else if (status == 3) {
                    name = "In Progress";

                }
                else if (status == 4) {
                    name = "Completed";

                }

                return app.localize(name);
            };

            vm.searchUsers = function ($select) {
                if ($select.search == "")
                    return null;
                userService.searchUsers({ keyword: $select.search }).then(function (response) {
                    vm.users = response.data.items;
                });
            };

            vm.getAllUsers = function () {
                userService.getAllUsers({}).success(function (data) {
                    vm.allUsers = data.items;
                });
            };

            vm.clearUser = function () {
                vm.filters.user = null;
                vm.filters.userId = null;
            };

            vm.searchProjects = function ($select) {
                if ($select.search == "") return;

                projectService.searchProjects({ keyword: $select.search, status: vm.filters.projectStatus }).success(function (result) {

                    vm.projects = result.items;
                });
            };

            vm.clearProject = function () {
                vm.filters.project = null;
                vm.filters.projectId = null;
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

            function arraymove(arr, fromIndex, toIndex) {
                var element = arr[fromIndex];
                arr.splice(fromIndex, 1);
                arr.splice(toIndex, 0, element);
            }

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

            vm.sortChanged = function (event, ui) {
                vm.loading = true;
                var obj = JSON.parse(ui.item.attr('data-id'));
                var updatedIndex = ui.item.index();

                var project = vm.projectList[obj.projectIndex];
                var milestone = project.milestones[obj.milestoneIndex];
                var task = milestone.tasks[obj.taskIndex];

                if (updatedIndex == 0) {
                    task.priority = (milestone.tasks[0].priority) / 2;
                    var element = task;
                    milestone.tasks.splice(obj.taskIndex, 1);
                    milestone.tasks.splice(updatedIndex, 0, element);
                }
                else if (updatedIndex == (milestone.tasks.length - 1)) {
                    task.priority = (milestone.tasks[updatedIndex].priority + milestone.tasks[updatedIndex].priority + 1) / 2;
                    var element = task;
                    milestone.tasks.splice(obj.taskIndex, 1);
                    milestone.tasks.splice(updatedIndex, 0, element);
                }
                else {
                    if (updatedIndex > obj.taskIndex)
                        task.priority = (milestone.tasks[updatedIndex + 1].priority + milestone.tasks[updatedIndex].priority) / 2;
                    else if (updatedIndex < obj.taskIndex)
                        task.priority = (milestone.tasks[updatedIndex - 1].priority + milestone.tasks[updatedIndex].priority) / 2;
                    var element = task;
                    milestone.tasks.splice(obj.taskIndex, 1);
                    milestone.tasks.splice(updatedIndex, 0, element);
                }

                projectTaskService.updateProjectTaskPriority(task).success(function () {

                }).finally(function () {
                    vm.loading = false;
                });

                $scope.$apply();
            };

            // MoveUp Project
            vm.moveUpProject = function (milestone, indexes) {

                vm.loading = true;
                var projectObj = angular.copy(vm.projectList[indexes.projectIndex]);
                projectObj.priority = vm.projectList[indexes.projectIndex - 1].priority;
                var projectMoveUpObj = angular.copy(vm.projectList[indexes.projectIndex - 1]);
                projectMoveUpObj.priority = vm.projectList[indexes.projectIndex].priority;
                vm.projectList[indexes.projectIndex - 1].priority = vm.projectList[indexes.projectIndex].priority;

                projectService.moveUpProject({
                    projectId: projectObj.id,
                    priority: projectObj.priority,
                    moveUpProjectId: projectMoveUpObj.id,
                    moveUpPriority: projectMoveUpObj.priority
                }).success(function () {
                    vm.projectList.splice(indexes.projectIndex, 1);
                    vm.projectList.splice(indexes.projectIndex - 1, 0, projectObj);
                }).finally(function () {
                    vm.loading = false;
                });


            };

            // MoveDown Project
            vm.moveDownProject = function (milestone, indexes) {
                vm.loading = true;
                var projectObj = angular.copy(vm.projectList[indexes.projectIndex]);
                projectObj.priority = vm.projectList[indexes.projectIndex + 1].priority;
                var projectMoveDownObj = angular.copy(vm.projectList[indexes.projectIndex + 1]);
                projectMoveDownObj.priority = vm.projectList[indexes.projectIndex].priority;
                vm.projectList[indexes.projectIndex + 1].priority = vm.projectList[indexes.projectIndex].priority;

                projectService.moveDownProject({
                    projectId: projectObj.id,
                    priority: projectObj.priority,
                    moveDownProjectId: projectMoveDownObj.id,
                    moveDownPriority: projectMoveDownObj.priority
                }).success(function () {
                    vm.projectList.splice(indexes.projectIndex, 1);
                    vm.projectList.splice(indexes.projectIndex + 1, 0, projectObj);
                }).finally(function () {
                    vm.loading = false;
                });
                //vm.projectList[indexes.projectIndex].milestones.splice(indexes.milestoneIndex, 1);
                //vm.projectList[indexes.projectIndex].milestones.splice(indexes.milestoneIndex +1, 0, milestoneObj);
                //vm.loading = false;
            };

            // MoveUp Milestone
            vm.moveUpMilestone = function (milestone, indexes) {
                vm.loading = true;
                var milestoneObj = angular.copy(vm.projectList[indexes.projectIndex].milestones[indexes.milestoneIndex]);
                milestoneObj.priority = vm.projectList[indexes.projectIndex].milestones[indexes.milestoneIndex - 1].priority;
                var milestoneMoveupObj = angular.copy(vm.projectList[indexes.projectIndex].milestones[indexes.milestoneIndex - 1]);
                milestoneMoveupObj.priority = vm.projectList[indexes.projectIndex].milestones[indexes.milestoneIndex].priority;
                vm.projectList[indexes.projectIndex].milestones[indexes.milestoneIndex - 1].priority = vm.projectList[indexes.projectIndex].milestones[indexes.milestoneIndex].priority;

                milestoneService.moveUpMilestone({
                    milestoneId: milestoneObj.id,
                    priority: milestoneObj.priority, moveUpMilestoneId: milestoneMoveupObj.id,
                    moveUpPriority: milestoneMoveupObj.priority
                }).success(function () {
                    vm.projectList[indexes.projectIndex].milestones.splice(indexes.milestoneIndex, 1);
                    vm.projectList[indexes.projectIndex].milestones.splice(indexes.milestoneIndex - 1, 0, milestoneObj);
                }).finally(function () {
                    vm.loading = false;
                });


            };

            // MoveDown Milestone
            vm.moveDownMilestone = function (milestone, indexes) {
                vm.loading = true;
                var milestoneObj = angular.copy(vm.projectList[indexes.projectIndex].milestones[indexes.milestoneIndex]);
                milestoneObj.priority = vm.projectList[indexes.projectIndex].milestones[indexes.milestoneIndex + 1].priority;
                var milestoneMoveDownObj = angular.copy(vm.projectList[indexes.projectIndex].milestones[indexes.milestoneIndex + 1]);
                milestoneMoveDownObj.priority = vm.projectList[indexes.projectIndex].milestones[indexes.milestoneIndex].priority;
                vm.projectList[indexes.projectIndex].milestones[indexes.milestoneIndex + 1].priority = vm.projectList[indexes.projectIndex].milestones[indexes.milestoneIndex].priority;

                milestoneService.moveDownMilestone({
                    milestoneId: milestoneObj.id,
                    priority: milestoneObj.priority, moveDownMilestoneId: milestoneMoveDownObj.id,
                    moveDownPriority: milestoneMoveDownObj.priority
                }).success(function () {
                    vm.projectList[indexes.projectIndex].milestones.splice(indexes.milestoneIndex, 1);
                    vm.projectList[indexes.projectIndex].milestones.splice(indexes.milestoneIndex + 1, 0, milestoneObj);
                }).finally(function () {
                    vm.loading = false;
                });
                //vm.projectList[indexes.projectIndex].milestones.splice(indexes.milestoneIndex, 1);
                //vm.projectList[indexes.projectIndex].milestones.splice(indexes.milestoneIndex +1, 0, milestoneObj);
                //vm.loading = false;
            };

            // Creating MileStone 
            function openCreateMileStoneModal(milestoneId, indexes) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/milestones/createOrEditMilestoneModal.cshtml',
                    controller: 'host.views.cbs.milestones.createOrEditMilestoneModal as vm',
                    backdrop: 'static',
                    resolve: {
                        options: function () {
                            return {
                                milestoneId: indexes.milestoneId,
                                projectId: indexes.projectId,
                                priority: indexes.priority
                            }
                        }
                    }

                });
                modalInstance.result.then(function (result) {
                    vm.projectList[indexes.projectIndex].milestones.push(result);
                });
            }

            // Updating MileStone
            function openEditMilestoneModal(milestone, indexes) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/milestones/createOrEditMilestoneModal.cshtml',
                    controller: 'host.views.cbs.milestones.createOrEditMilestoneModal as vm',
                    backdrop: 'static',
                    resolve: {
                        options: function () {
                            return {
                                milestoneId: milestone.id,
                            }
                        }
                    }

                });
                modalInstance.result.then(function (result) {
                    vm.projectList[indexes.projectIndex].milestones[indexes.milestoneIndex].title = result.title;
                    vm.projectList[indexes.projectIndex].milestones[indexes.milestoneIndex].startDate = result.startDate;
                    vm.projectList[indexes.projectIndex].milestones[indexes.milestoneIndex].expectedEndDate = result.expectedEndDate;
                    vm.projectList[indexes.projectIndex].milestones[indexes.milestoneIndex].endDate = result.endDate;
                });
            }

            // Viewing Milestone
            function openViewMilestoneModal(milestone) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/milestones/viewModal.cshtml',
                    controller: 'host.views.cbs.milestones.viewModal as vm',
                    backdrop: 'static',
                    resolve: {
                        options: function () {
                            return {
                                milestoneId: milestone.id
                            }
                        }
                    }
                });
            }

            // Creating ProjectTask
            function openCreateProjectTaskModal(projectTaskId, indexes) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/tasks/createOrEditProjectTaskModal.cshtml',
                    controller: 'host.views.cbs.projectTasks.createOrEditProjectTaskModal as vm',
                    backdrop: 'static',
                    resolve: {
                        options: function () {
                            return {
                                projectTaskId: projectTaskId,
                                priority: indexes.priority,
                                milestoneId: indexes.milestoneId
                            }
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.projectList[indexes.projectIndex].milestones[indexes.milestoneIndex].tasks.push(result);

                });
            }

            // Viewing ProjectTask
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

            // View Project Modal
            function openViewProjectModal(projectId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/projects/viewModal.cshtml',
                    controller: 'host.views.cbs.projects.viewModal as vm',
                    backdrop: 'static',
                    resolve: {
                        projectId: function () {
                            return projectId;
                        }

                    }
                });

            }

            // Updating ProjectTask
            function openEditProjectTaskModal(projectTask, indexes) {
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
                modalInstance.result.then(function (result) {

                    vm.projectList[indexes.projectIndex].milestones[indexes.milestoneIndex].tasks[indexes.taskIndex] = result;
                });
            }

            // View Project
            vm.viewProject = function (project) {
                openViewProjectModal(project.id);
            };

            vm.createMilestone = function (projectIndex, projectId) {
                var priority;
                if (!vm.projectList[projectIndex].milestones) {
                    vm.projectList[projectIndex].milestones = [];
                    priority = 1;
                }
                else if (vm.projectList[projectIndex].milestones.length == 0) {
                    priority = 1;
                }
                else
                    priority = vm.projectList[projectIndex].milestones[vm.projectList[projectIndex].milestones.length - 1].priority + 1;
                openCreateMileStoneModal(null, { projectIndex: projectIndex, projectId: projectId, priority: priority });
            };

            vm.viewMilestone = function (milestone) {
                openViewMilestoneModal(milestone);
            };

            vm.updateMilestone = function (milestone, indexes) {
                openEditMilestoneModal(milestone, indexes);
            };

            vm.deleteMilestone = function (milestone, indexes) {
                abp.message.confirm(
                                    app.localize('DeleteWarningMessage'),
                                    function (isConfirmed) {
                                        if (isConfirmed) {
                                            milestoneService.deleteMilestone({
                                                id: milestone.id
                                            }).success(function () {
                                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                                                vm.projectList[indexes.projectIndex].milestones.splice(indexes.milestoneIndex, 1);
                                            });
                                        }
                                    }
                                );
            };

            vm.createProjectTask = function (milestoneIndex, projectIndex, milestoneId) {
                var priority;
                if (!vm.projectList[projectIndex].milestones[milestoneIndex].tasks) {
                    vm.projectList[projectIndex].milestones[milestoneIndex].tasks = [];
                    priority = 1;
                }
                else if (vm.projectList[projectIndex].milestones[milestoneIndex].tasks.length == 0) {
                    priority = 1;
                }
                else
                    priority = vm.projectList[projectIndex].milestones[milestoneIndex].tasks[vm.projectList[projectIndex].milestones[milestoneIndex].tasks.length - 1].priority + 1;
                openCreateProjectTaskModal(null, { milestoneIndex: milestoneIndex, projectIndex: projectIndex, priority: priority, milestoneId: milestoneId });
            };

            vm.viewProjectTask = function (projectTask) {
                openViewProjectTaskModal(projectTask);
            };

            vm.projectTaskLog = function (projectTask, indexes) {
                openProjectTaskLogModal(projectTask, indexes);
            };

            vm.projectTaskLogDirect = function (projectTask, indexes) {
                openProjectTaskLogModalDirect(projectTask, indexes);
            };

            vm.updateProjectTask = function (projectTask, indexes) {
                openEditProjectTaskModal(projectTask, indexes);
            };

            vm.deleteProjectTask = function (projectTask, indexes) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            projectTaskService.deleteProjectTask({
                                id: projectTask.id
                            }).success(function () {
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                                vm.projectList[indexes.projectIndex].milestones[indexes.milestoneIndex].tasks.splice(indexes.taskIndex, 1);

                            });
                        }
                    }
                );
            };

            vm.getProjectsAndTasks = function () {
                vm.loading = true;
                vm.filters.taskStatuses = [];
                if (vm.filters.taskStatusesArray.length > 0) {
                    angular.forEach(vm.filters.taskStatusesArray, function (value, key) {
                        vm.filters.taskStatuses.push(value.id);
                    });
                }
                projectTaskService.getProjectsAndTasks(vm.filters).success(function (result) {
                    vm.projectList = result;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function init() {
                vm.getProjectsAndTasks();
                vm.getAllUsers();
            }

            init();

            // Project Summary Code
            vm.showProjectForSummary = function (project) {

                var count = 0;
                if (!project.milestones) return false;
                angular.forEach(project.milestones, function (value, key) {
                    if (value.tasks) {
                        angular.forEach(value.tasks, function (taskValue) {
                            if (taskValue.status == 2 || taskValue.status == 3)
                                count++
                        })
                    }
                });
                return count > 0;
            };

            vm.showMilestoneForSummary = function (milestone) {
                var count = 0;
                if (!milestone.tasks) return false;
                angular.forEach(milestone.tasks, function (taskValue) {
                    if (taskValue.status == 2 || taskValue.status == 3)
                        count++
                });
                return count > 0;
            }

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
        }
    ]);
