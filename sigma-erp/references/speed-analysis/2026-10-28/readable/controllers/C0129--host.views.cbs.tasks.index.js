// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:54396-54988
appModule.controller('host.views.cbs.tasks.index', [
        '$scope', 'appSession', '$uibModal', 'uiGridConstants', 'abp.services.app.project', '$stateParams', 'abp.services.app.user', 'abp.services.app.taskDetail', 'utilities',
        function ($scope, appSession, $uibModal, uiGridConstants, projectService, $stateParams, userService, taskDetailService, utilities) {

            var vm = this;
            vm.loading = false;
            vm.projects = [];
            vm.projectsSearchList = [];
            vm.round = function (val) { return Math.round(val, 2); }
            vm.isShowGrandSummary = false;

            vm.canViewOtherTasks = abp.auth.hasPermission('Pages.CBS.Tasks.CanViewOtherTasks');

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format("YYYY-MM-DD");
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format("YYYY-MM-DD");
            vm.dateRangeModel = {
                startDate: moment(moment().format('YYYY-MM-DD')).utc(),
                endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc(),
            };
            vm.projectList = [];
            vm.filters = {
                status: 1,
                projectId: null
            };

            vm.calcSummaries = function (projectId) {

                let projectIndex = vm.projects.findIndex(p => p.id === projectId);
                vm.projects[projectIndex].totalEstimatedHours = 0;
                vm.projects[projectIndex].totalActualHours = 0;
                vm.projects[projectIndex].totalDueHours = 0;
                vm.projects[projectIndex].totalRevisedEstimatedHours = 0;

                for (let i in vm.projects[projectIndex].tasks) {
                    sumUpDuration(vm.projects[projectIndex].tasks[i]);
                    sumUpRevisedDuration(vm.projects[projectIndex].tasks[i]);
                    sumUpDoneHours(vm.projects[projectIndex].tasks[i]);
                }

                for (let i in vm.projects[projectIndex].tasks) {
                    vm.projects[projectIndex].totalEstimatedHours += vm.projects[projectIndex].tasks[i].duration;
                    vm.projects[projectIndex].totalActualHours += vm.projects[projectIndex].tasks[i].actualHours;
                    vm.projects[projectIndex].totalRevisedEstimatedHours += vm.projects[projectIndex].tasks[i].revisedDuration;
                }

                vm.projects[projectIndex].totalDueHours = vm.projects[projectIndex].totalRevisedEstimatedHours - vm.projects[projectIndex].totalActualHours;
                vm.projects[projectIndex].totalPercentage = vm.projects[projectIndex].totalRevisedEstimatedHours ? (vm.projects[projectIndex].totalActualHours / vm.projects[projectIndex].totalRevisedEstimatedHours * 100) : 0;
                vm.calculateGrandSummary();
            }

            vm.calculateGrandSummary = function() {
                vm.grandTotalEstimatedHours = 0;
                vm.grandTotalActualHours = 0;
                vm.grandTotalDueHours = 0;
                vm.grandTotalRevisedEstimatedHours = 0;

                vm.projects.forEach(function(project) {
                    vm.grandTotalEstimatedHours += project.totalEstimatedHours;
                    vm.grandTotalActualHours += project.totalActualHours;
                    vm.grandTotalRevisedEstimatedHours += project.totalRevisedEstimatedHours;
                });
                vm.grandTotalDueHours = vm.grandTotalRevisedEstimatedHours - vm.grandTotalActualHours;
                vm.grandTotalPercentage = vm.grandTotalRevisedEstimatedHours ? (vm.grandTotalActualHours / vm.grandTotalRevisedEstimatedHours * 100) : 0;
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

            vm.searchUsers = function ($select) {
                if ($select.search == "")
                    return null;
                userService.searchUsers({ keyword: $select.search }).then(function (response) {
                    vm.users = response.data.items;
                });
            };

            vm.clearUser = function () {
                vm.filters.user = null;
                vm.filters.userId = null;
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

            vm.searchProjects = function ($select) {
                if ($select.search == "") return;
                
                projectService.searchProjects({ keyword: $select.search, status: vm.filters.status }).success(function (result) {

                    vm.projectsSearchList = result.items;
                });
            };

            vm.multilineStringToHTML = function (input) {
                if (!input) return input;
                var output = input
                    //replace possible line breaks.
                    .replace(/(\r\n|\r|\n)/g, '<br/>')
                    //replace tabs
                    .replace(/\t/g, '&nbsp;&nbsp;&nbsp;')
                    //replace spaces.
                    .replace(/ /g, '&nbsp;');

                return output;
            };
            
            
            vm.getProjectTasks = function () {
                vm.isShowGrandSummary = false;
                taskDetailService.getTasksForDashboard(vm.filters).success(function (result) {
                    vm.projects = result.items;
                    let count = 1;
                    let projectsLength = vm.projects.length;
                    vm.projects.forEach(function (project) {
                        taskDetailService.getProjectTasks({ id: project.id }).success(function (tasksResult) {
                            project.tasks = tasksResult;
                            vm.calcSummaries(project.id);
                            if (count == projectsLength) {
                                vm.isShowGrandSummary = true;
                            }
                            count++;
                        });
                    });
                });
            }

            function nestedSearch(projectId, value) {
                let projectIndex = vm.projects.findIndex(p => p.id === projectId);
                if (value !== null) {
                    return vm.projects[projectIndex].tasks.reduce(function f(acc, val) {
                        return (val.id === value) ? val :
                            (val.children && val.children.length) ? val.children.reduce(f, acc) : acc;
                    }, null);
                } else {
                    return null;
                }
            }

            vm.openCreateProjectTaskModal = function (projectId, parentTaskId, taskId, addAboveOrBelowTask, selectTaskId) {
                let projectIndex = vm.projects.findIndex(p => p.id === projectId);
                let index = null;
                let parent = nestedSearch(projectId,parentTaskId);
                if (parent !== null) {
                    if (parent.children.length > 0)
                        index = parent.children.findIndex(x => x.id === selectTaskId);
                    else
                        index = 0;
                } else
                    index = vm.projects[projectIndex].tasks.findIndex(x => x.id === selectTaskId);
                
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/taskDetails/createOrEditProjectTaskModal.cshtml',
                    controller: 'host.views.cbs.tasks.createOrEditProjectTaskModal as vm',
                    backdrop: 'static',
                    resolve: {
                        options: function () {
                            return {
                                projectId: projectId,
                                parentId: parentTaskId,
                                taskId: taskId,
                                addAboveOrBelowTask: addAboveOrBelowTask,
                                selectTaskId: selectTaskId,
                                parentTaskName: parent !== null ? parent.name : null
                            };
                        }
                    }
                });
                modalInstance.result.then(function (tasks) {
                    tasks.forEach(function (task) {
                        task.children = [];
                        

                        if (addAboveOrBelowTask === 1) //add below
                        {
                            if (parent !== null)
                                parent.children.splice(index + 1, 0, task);
                            else
                                vm.projects[projectIndex].tasks.splice(index + 1, 0, task);
                        }
                        else if (addAboveOrBelowTask === 2) //add above
                        {
                            if (parent !== null)
                                parent.children.splice(index, 0, task);
                            else
                                vm.projects[projectIndex].tasks.splice(index, 0, task);
                        }
                        else {
                            if (parent !== null) {
                                parent.children.push(task);
                            } else {
                                vm.projects[projectIndex].tasks.push(task);
                            }
                        }

                        vm.calcSummaries(task.projectId);
                    });
                });
            };

            vm.deleteTask = function (task) {
                let projectIndex = vm.projects.findIndex(p => p.id === task.projectId); 
                let taskId = task.id;
                let parentTask = nestedSearch(task.projectId,task.parentId);
                abp.message.confirm(
                    app.localize('DeleteWarningMessage'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            taskDetailService.deleteTask(taskId).success(function () {
                                if (parentTask !== null) {
                                    let index = parentTask.children.findIndex(x => x.id === taskId);
                                    parentTask.children.splice(index, 1);
                                } else {
                                    let index = vm.projects[projectIndex].tasks.findIndex(x => x.id === taskId);
                                    vm.projects[projectIndex].tasks.splice(index, 1);
                                }
                                vm.calcSummaries(task.projectId);
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            vm.moveToUpLevel = function (task) {
                let projectIndex = vm.projects.findIndex(p => p.id === task.projectId); 
                vm.loading = true;

                let parentTask = nestedSearch(task.projectId, task.parentId);
                let taskIndex = parentTask.children.findIndex(x => x.id == task.id);
                parentTask.children.splice(taskIndex, 1);

                let grandParentTask = nestedSearch(task.projectId, parentTask.parentId);

                if (grandParentTask !== null) {
                    let parentTaskIndex = grandParentTask.children.findIndex(x => x.id == parentTask.id);
                    let parentNextSibling = grandParentTask.children[parentTaskIndex + 1];
                    if (parentNextSibling === undefined) {
                        task.priority = parentTask.priority + 1;
                        task.parentId = parentTask.parentId;
                    } else {
                        task.priority = (parentNextSibling.priority + parentTask.priority) / 2;
                        task.parentId = parentTask.parentId;
                    }
                    grandParentTask.children.splice(parentTaskIndex + 1, 0, task);
                } else {
                    let parentTaskIndex = vm.projects[projectIndex].tasks.findIndex(x => x.id == parentTask.id);
                    let parentNextSibling = vm.projects[projectIndex].tasks[parentTaskIndex + 1];
                    if (parentNextSibling === undefined) {
                        task.priority = parentTask.priority + 1;
                        task.parentId = parentTask.parentId;
                    } else {
                        task.priority = (parentNextSibling.priority + parentTask.priority) / 2;
                        task.parentId = parentTask.parentId;
                    }
                    vm.projects[projectIndex].tasks.splice(parentTaskIndex + 1, 0, task);
                }

                vm.calcSummaries(task.projectId);

                taskDetailService.updateTaskHierarchy({ taskDetailEdit: task, isIndentOrDedent : 2}).success(function () {
                    //taskDetailService.getTasksForProjectByProjectId(vm.projects[projectIndex].id)
                    //    .success(function (result) {
                            vm.loading = false;
                        //});
                });
            };

            vm.moveToDownLevel = function (task) {
                let projectIndex = vm.projects.findIndex(p => p.id === task.projectId); 
                vm.loading = true;

                let parentTask = nestedSearch(task.projectId, task.parentId);
                if (parentTask === null) {
                    let taskIndex = vm.projects[projectIndex].tasks.findIndex(x => x.id == task.id);
                    vm.projects[projectIndex].tasks.splice(taskIndex, 1);
                    let previousTask = vm.projects[projectIndex].tasks[taskIndex - 1];
                    task.parentId = previousTask.id;
                    if (previousTask.children.length === 0) {
                        task.priority = 1;
                    } else {
                        task.priority = previousTask.children[previousTask.children.length - 1].priority + 1;
                    }
                    previousTask.children.push(task);
                } else {
                    let taskIndex = parentTask.children.findIndex(x => x.id == task.id);
                    parentTask.children.splice(taskIndex, 1);
                    previousTask = parentTask.children[taskIndex - 1];
                    task.parentId = previousTask.id;
                    if (previousTask.children.length === 0) {
                        task.priority = 1;
                    } else {
                        task.priority = previousTask.children[previousTask.children.length - 1].priority + 1;
                    }
                    previousTask.children.push(task);
                }

                vm.calcSummaries(task.projectId);

                taskDetailService.updateTaskHierarchy({ taskDetailEdit: task, isIndentOrDedent: 1 }).success(function () {
                    //taskDetailService.getTasksForProjectByProjectId(vm.projects[projectIndex].id).success(function (result) {
                        vm.loading = false;
                    //});
                });
            };

            vm.childSortChanged = function (event, ui) {
                let u = ui.item.attr('childData-id');
                if (!u) return;

                vm.loading = true;
                var obj = JSON.parse(u);
                var parentTask = obj.parentTask;
                var updatedIndex = ui.item.index();
                var task = parentTask.children[obj.taskIndex];

                if (updatedIndex === 0) {
                    task.priority = (parentTask.children[0].priority) / 2;
                    let element = task;
                    parentTask.children.splice(obj.taskIndex, 1);
                    parentTask.children.splice(updatedIndex, 0, element);
                }
                else if (updatedIndex === (parentTask.children.length - 1)) {
                    task.priority = (parentTask.children[updatedIndex].priority + parentTask.children[updatedIndex].priority + 1) / 2;
                    let element = task;
                    parentTask.children.splice(obj.taskIndex, 1);
                    parentTask.children.splice(updatedIndex, 0, element);
                }
                else {
                    if (updatedIndex > obj.taskIndex)
                        task.priority = (parentTask.children[updatedIndex + 1].priority + parentTask.children[updatedIndex].priority) / 2;
                    else if (updatedIndex < obj.taskIndex)
                        task.priority = (parentTask.children[updatedIndex - 1].priority + parentTask.children[updatedIndex].priority) / 2;
                    let element = task;
                    parentTask.children.splice(obj.taskIndex, 1);
                    parentTask.children.splice(updatedIndex, 0, element);
                }

                taskDetailService.updateProjectTaskPriority(task).success(function () {
                    taskDetailService.getProjectTasks({ id: task.projectId })
                        .success(function (result) {
                            let projectIndex = vm.projects.findIndex(p => p.id === task.projectId);
                            vm.projects[projectIndex].tasks = result;
                            vm.calcSummaries();
                            vm.loading = false;
                        });
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.sortChanged = function (event, ui) {
                let u = ui.item.attr('data-id');
                if (!u) return;

                vm.loading = true;
                var obj = JSON.parse(u);

                let projectIndex = vm.projects.findIndex(p => p.id === obj.projectId); 

                var updatedIndex = ui.item.index();
                var project = vm.projects[projectIndex];
                //var milestone = project.tasks[obj.milestoneIndex];
                var task = project.tasks[obj.taskIndex];

                if (updatedIndex === 0) {
                    task.priority = (project.tasks[0].priority) / 2;
                    let element = task;
                    project.tasks.splice(obj.taskIndex, 1);
                    project.tasks.splice(updatedIndex, 0, element);
                }
                else if (updatedIndex === (project.tasks.length - 1)) {
                    task.priority = (project.tasks[updatedIndex].priority + project.tasks[updatedIndex].priority + 1) / 2;
                    let element = task;
                    project.tasks.splice(obj.taskIndex, 1);
                    project.tasks.splice(updatedIndex, 0, element);
                }
                else {
                    if (updatedIndex > obj.taskIndex)
                        task.priority = (project.tasks[updatedIndex + 1].priority + project.tasks[updatedIndex].priority) / 2;
                    else if (updatedIndex < obj.taskIndex)
                        task.priority = (project.tasks[updatedIndex - 1].priority + project.tasks[updatedIndex].priority) / 2;
                    let element = task;
                    project.tasks.splice(obj.taskIndex, 1);
                    project.tasks.splice(updatedIndex, 0, element);
                }

                taskDetailService.updateProjectTaskPriority(task).success(function () {
                    taskDetailService.getProjectTasks({ id: task.projectId })
                        .success(function (result) {
                            let projectIndex = vm.projects.findIndex(p => p.id === task.projectId);
                            vm.projects[projectIndex].tasks = result;
                            vm.calcSummaries();
                            vm.loading = false;
                        });
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.openViewOrEditProjectTaskModal = function (projectId, parentTaskId, taskId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/taskDetails/viewOrEditProjectTaskModal.cshtml',
                    controller: 'host.views.cbs.tasks.createOrEditProjectTaskModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        options: function () {
                            return {
                                projectId: projectId,
                                parentId: parentTaskId,
                                taskId: taskId
                            };
                        }
                    }
                });
                modalInstance.result.then(function (tasks) {
                    let parentTask = nestedSearch(projectId, tasks[0].parentId);
                    if (parentTask !== null) {
                        let taskIndex = parentTask.children.findIndex(t => t.id === tasks[0].id);
                        let t = parentTask.children[taskIndex];
                        t.title = tasks[0].title;
                        t.description = tasks[0].description;
                        t.startDate = tasks[0].startDate;
                        t.endDate = tasks[0].endDate;
                        t.assignedTo = tasks[0].assignedTo;
                        t.resources = tasks[0].resources;
                    } else {
                        let projectIndex = vm.projects.findIndex(p => p.id === projectId);
                        let taskIndex = vm.projects[projectIndex].tasks.findIndex(t => t.id === tasks[0].id);
                        let t = vm.projects[projectIndex].tasks[taskIndex];
                        t.title = tasks[0].title;
                        t.description = tasks[0].description;
                        t.startDate = tasks[0].startDate;
                        t.endDate = tasks[0].endDate;
                        t.assignedTo = tasks[0].assignedTo;
                        t.resources = tasks[0].resources;
                    }
                });
            };

            vm.openEditAssignToUserModal = function (task) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/taskDetails/editAssignToUserModal.cshtml',
                    controller: 'host.views.cbs.tasks.createOrEditProjectTaskModal as vm',
                    backdrop: 'static',
                    resolve: {
                        options: function () {
                            return {
                                projectId: task.projectId,
                                parentId: task.parentId,
                                taskId: task.id
                            };
                        }
                    }
                });
                modalInstance.result.then(function (updateTask) {
                    let parentTask = nestedSearch(task.projectId, updateTask.parentId);
                    if (parentTask !== null) {
                        let taskIndex = parentTask.children.findIndex(t => t.id === updateTask.id);
                        let t = parentTask.children[taskIndex];
                        t.assignedTo = updateTask.assignedTo;
                        t.resources = updateTask.resources;
                    } else {
                        let projectIndex = vm.projects.findIndex(p => p.id === task.projectId);
                        let taskIndex = vm.projects[projectIndex].tasks.findIndex(t => t.id === updateTask.id);
                        let t = vm.projects[projectIndex].tasks[taskIndex];
                        t.assignedTo = updateTask.assignedTo;
                        t.resources = updateTask.resources;
                    }
                });
            };

            vm.openUpdateActualHoursModal = function (task) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/taskDetails/updateActualHoursModal.cshtml',
                    controller: 'host.views.cbs.tasks.updateActualHoursModal as vm',
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
                    size: 'md'
                });
                modalInstance.result.then(function (updatedTaskDetail) {
                    let parentTask = nestedSearch(task.projectId, updatedTaskDetail.parentId);
                    if (parentTask !== null) {
                        let taskIndex = parentTask.children.findIndex(t => t.id === updatedTaskDetail.id);
                        let t = parentTask.children[taskIndex];
                        t.duration = updatedTaskDetail.duration;
                        t.actualHours = updatedTaskDetail.actualHoursNew;
                        t.revisedDuration = updatedTaskDetail.revisedDuration;
                        t.status = updatedTaskDetail.status;
                    } else {
                        let projectIndex = vm.projects.findIndex(p => p.id === task.projectId);
                        let taskIndex = vm.projects[projectIndex].tasks.findIndex(t => t.id === updatedTaskDetail.id);
                        let t = vm.projects[projectIndex].tasks[taskIndex];
                        t.duration = updatedTaskDetail.duration;
                        t.actualHours = updatedTaskDetail.actualHoursNew;
                        t.revisedDuration = updatedTaskDetail.revisedDuration;
                        t.status = updatedTaskDetail.status;
                    }
                    vm.calcSummaries(task.projectId);
                });
            };
            

            function init() {
                vm.getProjectTasks();
            }

            init();

            
        }
    ]);
