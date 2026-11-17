// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:56178-56627
appModule.controller('host.views.cbs.workspace.index', [
        '$scope', '$uibModal', 'abp.services.app.workspace', 'abp.services.app.taskDetail', 'abp.services.app.project', 'abp.services.app.searchUser', 'utilities',
        function ($scope, $uibModal, workspaceService, taskDetailService, projectService, userService, utilities) {

            var vm = this;
            vm.loading = false;
            vm.workspaceId = 0;

            vm.clearWorkspace = function () {
                vm.workspaceId = null;
                vm.workspaceBoards = null;
                vm.workspaceProjects = null;
                vm.assignedTasks = null;
            };
            vm.searchWorkspaces = function () {
                vm.loading = true;
                workspaceService.searchWorkspaces().then(function (response) {
                    vm.workspaces = response.data.items;
                    vm.loading = false;
                });
            };
            vm.updateStatus = function (row) {
                vm.loading = true;
                workspaceService.updateTaskStatus({id: row.id}).success(function () {
                    if (vm.workspaceId)
                        vm.getBoards(vm.workspaceId);
                    //vm.tasksAssigned();
                    vm.loading = false;
                });
                //row.status = 4;
                //workspaceService.updateTaskStatus(row);
            };
            vm.statuses = [
                { id: 1, name: 'Open' },
                { id: 2, name: 'Closed' }
            ];
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
                        vm.tasksAssigned(vm.workspaceId);

                    }
                });
            };
            vm.heightAdjust = function () {
                setTimeout(function () {
                    var textareas = document.querySelectorAll('textarea');
                    textareas.forEach(function (element) {
                        element.value = element.value.trim();
                        element.style.height = "25px"; // Reset the height to auto
                        element.style.height = (element.scrollHeight) + "px";
                    });
                }, 200);
            };
            vm.autoResizeTextarea = function (event, task) {
                debugger
                task.descriptionAdd = true;
                //document.getElementById("input_" + task.id + "_" + index).click();
                var element = event.target; // Get the specific textarea element
                element.value = element.value.trim();
                element.style.height = "auto"; // Reset the height to auto
                element.style.height = (element.scrollHeight) + "px";

            };
            vm.toogleChild = function (task) {
                //task.showChildren = true;
                task.showChildren = !task.showChildren;
                vm.heightAdjust();
            }
            vm.saveOnBlur = function (task) {

                task.description = task.description ? task.description.trim() : "";
                if (task.id != 0 && task.title != "") {
                    taskDetailService.createOrEdit({
                        taskDetail: task
                    }).success(function (result) {
                        task.descriptionAdd = false;
                        task.id = result.key;
                        vm.tasksAssigned(vm.workspaceId);
                    });
                }
                vm.heightAdjust();
            };
            vm.handleDes = function (task, $index, board) {
                task.descriptionAdd = true;
                setTimeout(function () {
                    document.getElementById("inputDes_" + task.id + "_" + $index + '_' + board.id).focus();
                }, 200);
            };
            vm.saveAssigned = function (task) {
                if (task.id != 0 && task.title != "") {
                    task.assignedToId = task.assignedToUser.id;
                    taskDetailService.createOrEdit({
                        taskDetail: task
                    }).success(function (result) {

                        task.assignedTo = task.assignedToUser;
                        task.isEnabled = false;
                        vm.tasksAssigned(vm.workspaceId);
                    });
                }
            };
            var myInterval = null;
            var tempRow = {};
            vm.assignUser = function (task) {

                task.isEnabled = true;
                setTimeout(function () {
                    $("#uiSelect_" + task.id + " span")[0].click();
                    tempRow = task;
                }, 100);
                myInterval = setInterval(vm.focsOut, 1);
            }
            vm.focsOut = function () {
                $("#uiSelect_" + tempRow.id + " input").focusout(function () {
                    setTimeout(function () {
                        tempRow.isEnabled = false;
                        clearInterval(myInterval);

                    }, 250);

                });
            };
            vm.searchUsers = function ($select) {
                if ($select.search == "")
                    return null;
                userService.searchUsers({ keyword: $select.search }).then(function (response) {
                    vm.users = response.data.items;
                });
            };
            vm.openViewOrEditProjectTaskModal = function (projectId, parentTaskId, taskId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/taskDetails/viewOrEditProjectTaskModal.cshtml',
                    controller: 'host.views.cbs.tasks.createOrEditProjectTaskModal as vm',
                    backdrop: 'static',
                    size: 'xl',
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
                    vm.getBoards(vm.workspaceId);


                });
            };
            vm.getProjects = function (id) {
                if (id == null) {
                    vm.workspaceId = null;
                    vm.workspaceProjects = null;
                    vm.workspaceBoards = null;
                    return;
                }
                workspaceService.getWorkSpaceBoards(id).success(function (data) {
                    vm.workspaceProjects = data;
                });
            };
            vm.addEditCritical = function (taskId, critical) {
                taskDetailService.addRemoveCritical(taskId, critical).success(function () {
                    vm.getBoards(vm.workspaceId);
                });
            };
            vm.getBoards = function (id) {
                if (id == null) {
                    vm.workspaceId = null;
                    vm.workspaceBoards = null;
                    vm.assignedTasks = null;
                    vm.workspaceProjects = null;
                    return;
                }
                vm.loading = true;
                vm.getProjects(id);
                vm.tasksAssigned(id);
                workspaceService.getBoards(id).success(function (data) {
                    vm.workspaceBoards = data;
                    vm.workspaceBoards.forEach(function (board) {
                        if (board.tasks.length > 0) {

                            var maxPriority = board.tasks.reduce(function (max, status) {
                                return status.priority > max ? status.priority : max;
                            }, board.tasks[0].priority);
                            board.tasks.push({ 'title': '', 'id': 0, projectId: board.id, 'children': [], 'parentId': null, 'type': board.boardType ? board.boardType : 8, 'taskStageId': 15, 'status': 1, 'revisedDuration': 0, 'actualHours': 0, 'duration': 0, 'assignedToId': null, 'priority': board.tasks.length > 0 ? (maxPriority + 1) : 1, 'addAboveOrBelowTask': null, 'selectTask': null, 'critical': true });
                        }

                    });
                    vm.heightAdjust();
                }).finally(function () {
                    vm.loading = false;
                });

            };
            vm.editProject = function (project) {
                openCreateOrEditProjectModal(project.id);
            };
            vm.deleteProject = function (deal) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            projectService.deleteProject({
                                id: deal.id
                            }).success(function () {
                                vm.getBoards(vm.workspaceId);
                                //vm.tasksAssigned();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };
            function openCreateOrEditProjectModal(projectId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/projects/createOrEditProjectModal.cshtml',
                    controller: 'host.views.cbs.projects.createOrEditProjectModal as vm',
                    backdrop: 'static',
                    resolve: {
                        projectId: function () {
                            return projectId;
                        }
                    },
                    size: 'lg'
                });

                modalInstance.result.then(function (result) {
                    vm.getBoards(vm.workspaceId);
                });
            }
            vm.handleKeyPress = function (event, task, index, board) {
                

                var taskId = task.id;
                if (task.title) {
                    if (event.key === "Enter") {
                        event.preventDefault();

                        task.title = task.title.trim();
                        taskDetailService.createOrEdit({
                            taskDetail: task,
                            addAboveOrBelowTask: task.addAboveOrBelowTask,
                            selectTaskId: task.selectTask != null ? task.selectTask.id : null
                        }).success(function (result) {

                            task.id = result.key;
                        });
                        if (taskId == 0) {
                            var maxPriority = board.tasks.reduce(function (max, status) {
                                return status.priority > max ? status.priority : max;
                            }, board.tasks[0].priority);
                            board.tasks.push({ 'title': '', 'id': 0, projectId: board.id, 'children': [], 'parentId': null, 'type': board.boardType ? board.boardType:8, 'taskStageId': 15, 'status': 1, 'revisedDuration': 0, 'actualHours': 0, 'duration': 0, 'assignedToId': null, 'priority': board.tasks.length > 0 ? (maxPriority + 1) : 1, 'addAboveOrBelowTask': null, 'selectTask': null, 'critical': true });

                            setTimeout(function () {
                                document.getElementById("input_0" + "_" + (index + 1) + '_' + board.id).focus();
                            }, 200);
                            let project = vm.workspaceProjects.filter(p => p.id === board.id)[0];
                            project.totalCount = project.totalCount + 1;
                            //vm.getProjects(vm.workspaceId);
                        }
                        else {
                            document.getElementById('input_' + task.id + "_" + index + '_' + board.id).blur();
                            vm.tasksAssigned(vm.workspaceId);
                        }


                    }
                }
            };
            vm.openBoardTasksModal = function (project) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/workspaceDashboard/projectTasksModal.cshtml',
                    controller: 'host.views.cbs.workspaceDashboard.projectTasksModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        project: function () {
                            return {
                                id: project.id,
                                company: "",
                                tasks: [],
                                boardType: project.boardType

                            };
                        },
                        prepareRelease: true,
                        releaseId: 0,
                        workspaceId: vm.workspaceId,
                        isInitiateFromCase: null

                    }
                });
                modalInstance.result.then(function () {
                    //vm.tasksAssigned();
                    vm.getBoards(vm.workspaceId);
                });
            }
            vm.openProjectTasksModal = function (row) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/projectsDashboard/projectTasks.cshtml',
                    controller: 'host.views.cbs.projectsDashboard.projectTasks as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        project: function () {
                            return {
                                id: row.projectId,
                                company: null,
                                tasks: []
                            };
                        },
                        prepareRelease: true,
                        releaseId: 0,
                        workspaceId: row.workspaceId,
                        isInitiateFromCase: null
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getBoards(vm.workspaceId);
                });
            };
            function openCreateOrEditWorkspaceModal(workspaceId) {
                debugger
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/workspaceDashboard/createOrEditWorkspaceModal.cshtml',
                    controller: 'host.views.cbs.workspace.createOrEditWorkspaceModal as vm',
                    backdrop: 'static',
                    resolve: {
                        workspaceId: function () {
                            return workspaceId;
                        }
                    },
                    size: 'md'
                });

                modalInstance.result.then(function (result) {
                    vm.searchWorkspaces();
                    vm.getBoards(result.id);
                    vm.workspaceId = result.id;
                });
            }

            vm.getTypeById = function (id) {
                var foundObject = vm.workspaces.find(function (obj) {
                    return obj.id === id;
                });

                if (foundObject) {
                    return foundObject.type;
                } else {
                    return 'Not found'; // or handle the case where the ID is not found
                }
            };

            vm.createWorkspace = function () {
                openCreateOrEditWorkspaceModal(null);
            };
            vm.createOrEditProject = function (id) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/workspaceDashboard/createOrEditBoardModal.cshtml',
                    controller: 'host.views.cbs.workspace.createOrEditBoardModal as vm',
                    backdrop: 'static',
                    resolve: {
                        workspaceId: function () {
                            return vm.workspaceId;
                        },
                        boardId: id,
                        workspaceType: vm.getTypeById(vm.workspaceId)
                    },
                    size: 'md'
                });
                modalInstance.result.then(function (result) {
                    vm.getBoards(vm.workspaceId);
                });
            };



            vm.editWorkspace = function (id) {
                openCreateOrEditWorkspaceModal(id);
            };

            vm.tasksAssigned = function (id) {
                workspaceService.getAssignTasks(id).success(function (data) {
                    vm.assignedTasks = data;
                });
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
            vm.multilineStringToHTMLWordBreak = (s) => utilities.multilineStringToHTMLWordBreak(s);
            vm.getTaskStatus = function (status) {
                if (!status) return '';
                else if (status == 1) return 'New';
                else if (status == 2) return 'To Be Discussed';
                else if (status == 3) return 'In Progress';
                else if (status == 4) return 'Completed';
                else if (status == 5) return 'On Hold';
                else return '';
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
            function init() {

                //vm.tasksAssigned();
                vm.searchWorkspaces();
            }
            init();
        }
    ]);
