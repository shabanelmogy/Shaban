// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:52430-53040
appModule.controller('host.views.cbs.tasksDetail.index', [
        '$scope', '$uibModal', 'abp.services.app.taskDetail',
        function ($scope, $uibModal, taskDetailService) {
            var vm = this;
            vm.loading = false;

            vm.openViewProjectTaskModal = function (projectId, parentTaskId, taskId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/taskDetails/viewProjectTaskModal.cshtml',
                    controller: 'host.views.cbs.tasks.createOrEditProjectTaskModal as vm',
                    backdrop: 'static',
                    resolve: {
                        options: function () {
                            return {
                                projectId: projectId,
                                parentId: parentTaskId,
                                taskId: taskId
                            }
                        }
                    }
                });
                modalInstance.result.then(function () {
                    vm.refresh();
                });
            }

            vm.openCreateProjectTaskModal = function (projectId, parentTaskId, taskId, parentTaskName) {
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
                                parentTaskName: parentTaskName
                            }
                        }
                    }
                });
                modalInstance.result.then(function () {
                    vm.refresh();
                });
            }

            vm.moveToDownLevel = function (task, previousSibling) {
                task.parentId = previousSibling.id;
                if (previousSibling.children.length == 0) {
                    task.priority = 1;
                } else {
                    task.priority = previousSibling.children[previousSibling.children.length - 1].priority + 1;
                }
                taskDetailService.updateTaskHierarchy(task).success(function () {
                    vm.refresh();
                    vm.loading = false;
                });
            }

            vm.moveToUpLevel = function (task, grandParentId, parentTask, parentNextSibling) {
                vm.loading = true;
                if (parentNextSibling == undefined) {
                    task.parentId = grandParentId;
                    task.priority = parentTask.priority + 1;
                    taskDetailService.updateTaskHierarchy(task).success(function () {
                        vm.refresh();
                        vm.loading = false;
                    });
                } else {
                    task.parentId = grandParentId;
                    task.priority = (parentNextSibling.priority + parentTask.priority) / 2;
                    taskDetailService.updateTaskHierarchy(task).success(function() {
                        vm.refresh();
                        vm.loading = false;
                    });
                }
            }

            vm.childSortChanged = function (event, ui) {
                vm.loading = true;
                var obj = JSON.parse(ui.item.attr('childData-id'));
                var parentTask = obj.parentTask;
                var updatedIndex = ui.item.index();
                var task = parentTask.children[obj.taskIndex];

                if (updatedIndex == 0) {
                    task.priority = (parentTask.children[0].priority) / 2;
                    var element = task;
                    parentTask.children.splice(obj.taskIndex, 1);
                    parentTask.children.splice(updatedIndex, 0, element);
                }
                else if (updatedIndex == (parentTask.children.length - 1)) {
                    task.priority = (parentTask.children[updatedIndex].priority + parentTask.children[updatedIndex].priority + 1) / 2;
                    var element = task;
                    parentTask.children.splice(obj.taskIndex, 1);
                    parentTask.children.splice(updatedIndex, 0, element);
                }
                else {
                    if (updatedIndex > obj.taskIndex)
                        task.priority = (parentTask.children[updatedIndex + 1].priority + parentTask.children[updatedIndex].priority) / 2;
                    else if (updatedIndex < obj.taskIndex)
                        task.priority = (parentTask.children[updatedIndex - 1].priority + parentTask.children[updatedIndex].priority) / 2;
                    var element = task;
                    parentTask.children.splice(obj.taskIndex, 1);
                    parentTask.children.splice(updatedIndex, 0, element);
                }

                taskDetailService.updateProjectTaskPriority(task).success(function () {
                    vm.refresh();
                }).finally(function () {
                    vm.loading = false;
                });

                $scope.$apply();
            }

            vm.sortChanged = function (event, ui) {
                vm.loading = true;
                var obj = JSON.parse(ui.item.attr('data-id'));
                var updatedIndex = ui.item.index();
                var project = vm.projects.find(x => x.id == obj.projectId);
                //var milestone = project.tasks[obj.milestoneIndex];
                var task = project.tasks[obj.taskIndex];

                if (updatedIndex == 0) {
                    task.priority = (project.tasks[0].priority) / 2;
                    var element = task;
                    project.tasks.splice(obj.taskIndex, 1);
                    project.tasks.splice(updatedIndex, 0, element);
                }
                else if (updatedIndex == (project.tasks.length - 1)) {
                    task.priority = (project.tasks[updatedIndex].priority + project.tasks[updatedIndex].priority + 1) / 2;
                    var element = task;
                    project.tasks.splice(obj.taskIndex, 1);
                    project.tasks.splice(updatedIndex, 0, element);
                }
                else {
                    if (updatedIndex > obj.taskIndex)
                        task.priority = (project.tasks[updatedIndex + 1].priority + project.tasks[updatedIndex].priority) / 2;
                    else if (updatedIndex < obj.taskIndex)
                        task.priority = (project.tasks[updatedIndex - 1].priority + project.tasks[updatedIndex].priority) / 2;
                    var element = task;
                    project.tasks.splice(obj.taskIndex, 1);
                    project.tasks.splice(updatedIndex, 0, element);
                }

                taskDetailService.updateProjectTaskPriority(task).success(function () {
                    vm.refresh();
                }).finally(function () {
                    vm.loading = false;
                });

                $scope.$apply();
            };

            vm.deleteTask = function (taskId) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            taskDetailService.deleteTask(taskId).success(function () {
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                                vm.refresh();
                            });
                        }
                    }
                );
            };

            vm.getProjectPriorityName = function (projectPriorityId) {
                if (projectPriorityId === 1) {
                    return "Critical";
                } else if (projectPriorityId === 2) {
                    return "About To Critical";
                } else if (projectPriorityId === 3) {
                    return "New";
                } else {
                    return "";
                }
            }

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
                    vm.refresh();
                });
            }

            vm.getLocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('DD-MMM-YY');
                }
                else {
                    return "";
                }
            };

            function openViewProjectModal(projectId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/projects/viewModal.cshtml',
                    controller: 'host.views.cbs.projects.viewModal as vm',
                    backdrop: 'static',
                    resolve: {
                        projectId: function () {
                            return projectId;
                        }

                    },

                    size: 'lg'
                });

            }

            vm.OnHoldProjectCount = 0;

            vm.createProject = function () {
                openCreateOrEditProjectModal(null);
            };

            vm.viewProject = function (project) {
                openViewProjectModal(project.id);
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
                                vm.refresh();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            vm.closeProject = function (id) {
                abp.message.confirm(
                    app.localize('CloseProjectWarningMessage'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            projectService.closeProject({
                                id: id
                            }).success(function () {
                                vm.refresh();
                                abp.notify.success(app.localize('SuccessfullyClosed'));
                            });
                        }
                    }
                );
            };

            function init() {
                vm.refresh();
            }

            vm.projectLogsModal = function (row) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/projects/createOrShowProjectLogsModal.cshtml',
                    controller: 'host.views.cbs.projects.createOrShowProjectLogsModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        project: function () {
                            return row;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    //
                });
            };

            vm.refresh = function () {
                vm.loading = true;
                taskDetailService.getTasksForDashboard({ title: null, projectId: null, parentId: null })
                    .success(function (data) {
                        vm.projects = data.items;
                        vm.getOpenProjectsCount = vm.projects.filter(x => x.status === 1).length;
                        vm.OnHoldProjectCount = vm.projects.filter(project => project.status === 3).length;
                        vm.loading = false;
                    });
            };

            init();













            //vm.tasks = [
            //    {
            //        id: 1,
            //        taskName: 'Lease Module',
            //        created_at: Date.now(),
            //        resourceName: 'Arslan',
            //        duration: 1,
            //        predecessor: 0,
            //        complte: 0

            //    }, {
            //        id: 2,
            //        taskName: 'Settings Task',
            //        created_at: Date.now(),
            //        resourceName: 'Arslan',
            //        duration: 1,
            //        predecessor: 1,
            //        complte: 0
            //    }, {
            //        id: 3,
            //        taskName: 'Data Entry Forms',
            //        created_at: Date.now(),
            //        resourceName: 'Arslan',
            //        duration: 1,
            //        predecessor: 1,
            //        complte: 0
            //    }
            //];
            //    vm.tasks = [];
            //    vm.hasChanged = false;
            //    vm.observers = [];
            //    vm.resources = [];

            //    var getTaskObject = function () {
            //        return {
            //            taskNo: (vm.tasks.length ? vm.tasks.length + 1 : 1),
            //            title: '',
            //            duration: 0,
            //            description: '',
            //            status: 1,
            //            taskPredecessors: [],
            //            resources: [],
            //            observers: [],
            //            documents: [],
            //            children: [],
            //            percentComplete: 0
            //        };
            //    };

            //    vm.changeDetected = function (row) {

            //    };

            //    vm.sortableOptions = {
            //        containment: '#items',
            //        placeholder: function (itemScope) {
            //            var tr = itemScope.element[0];
            //            var placeholder = $document[0].createElement("tr");
            //            placeholder.style.display = 'table-row';

            //            for (var i = 0; tr.cells[i]; i++) {
            //                var cell = placeholder.insertCell(i);
            //                cell.innerHTML = tr.cells[i].innerHTML;
            //            }

            //            return placeholder;
            //        }
            //    };
            //    vm.hasPredecessor = function (id) {
            //        if (!vm.tasks) return false;
            //        if (!vm.tasks.taskPredecessors) return false;
            //        return vm.tasks.filter(x => x.taskPredecessors.filter(y => y.taskId === id).length > 0).length > 0;
            //    };

            //    vm.selectUnselectMultiple = function (idx, event) {

            //        if (!vm.tasks.length > 1) return;

            //        if (event.which.toString() !== '1') {
            //            return;
            //        }

            //        var row = vm.tasks[idx];
            //        row.rowIndex = idx;

            //        if (!event.ctrlKey && !event.shiftKey) {
            //            vm.clearAll();
            //            vm.toggleRow(row);
            //            vm.selectionPivot = row;
            //            return;
            //        }
            //        if (event.ctrlKey && event.shiftKey) {
            //            vm.selectRowsBetweenIndexes(vm.selectionPivot.rowIndex, row.rowIndex);
            //            return;
            //        }
            //        if (event.ctrlKey) {
            //            vm.toggleRow(row);
            //            vm.selectionPivot = row;
            //        }
            //        if (event.shiftKey) {

            //            vm.clearAll();
            //            vm.selectRowsBetweenIndexes(vm.selectionPivot.rowIndex, row.rowIndex);
            //        }
            //    }
            //    /* other supported functions */
            //    vm.toggleRow = function (row) {
            //        row.className = row.className === 's' ? '' : 's';
            //    };

            //    vm.selectRowsBetweenIndexes = function (ia, ib) {
            //        var bot = Math.min(ia, ib);
            //        var top = Math.max(ia, ib);

            //        for (var i = bot; i <= top; i++) {
            //            vm.tasks[i].className = 's';
            //        }
            //    };

            //    vm.clearAll = function () {
            //        for (var i = 0; i < vm.tasks.length; i++) {
            //            vm.tasks[i].className = '';
            //        }
            //    };

            //    vm.isRowSelectedUnselect = function (index) {
            //        if (vm.tasks[index].className === 's') { // if found, then select the row.
            //            return true;
            //        }
            //    };

            //    vm.getkeys = function (event) {
            //        console.log(event);

            //    };


            //    var users = [];
            //    vm.refresh = function () {
            //        TaskDetailService.getTasksForDashboard({})
            //            .success(function (r) {
            //                vm.tasks = r.items;
            //                userService.getAllUsers({})
            //                    .success(function (result) {
            //                        let users = result.items;
            //                        for (var i in vm.tasks) {
            //                            let obs = vm.tasks[i].observers;
            //                            let res = vm.tasks[i].resources;

            //                            for (var j in obs) {
            //                                let o = obs[j];
            //                                let observer = users.find(x => x.id === obs[j].observerId);
            //                                obs[j].userName = observer.userName;
            //                            }

            //                            for (var k in res) {
            //                                let o = res[j];
            //                                let resource = users.find(x => x.id === res[j].resourceId);
            //                                res[k].userName = resource.userName;

            //                            }
            //                        }

            //                        vm.tasks.push(getTaskObject());
            //                        vm.tasks.push(getTaskObject());
            //                        vm.tasks.push(getTaskObject());
            //                        vm.tasks.push(getTaskObject());
            //                    });
            //            });
            //    };

            //    vm.rowModified = function (event) {
            //        if (!vm.hasChanged)
            //            vm.hasChanged = true;
            //    };

            //    vm.save = function () {
            //        // let modifiedTasks = vm.tasks.filter(t => t.title && t.hasChanged);

            //        TaskDetailService.saveAll(vm.tasks)
            //            .success(function () {
            //                vm.refresh();
            //            });
            //    };

            //    vm.onResourceSelected = function (item, row) {
            //        row.resources.pop(item);
            //        row.resources.push({
            //            taskId: 0,
            //            resourceId: item.id,
            //            percentAssigned: 0,
            //            percentComplete: 0,
            //            userName: item.userName
            //        });

            //        vm.hasChanged = true;
            //    };

            //    vm.onObserverSelected = function (item, row) {
            //        row.observers.pop(item);
            //        row.observers.push({
            //            taskId: 0,
            //            observerId: item.id,
            //            userName: item.userName
            //        });

            //        vm.hasChanged = true;
            //    };

            //    vm.refreshResources = function (search) {
            //        if (!search) return;
            //        userService.searchUsersOptimized({ keyword: search })
            //            .success(function (users) {
            //                vm.resources = users.items;
            //            });
            //    };

            //    vm.refreshObservers = function (search) {
            //        if (!search) return;
            //        userService.searchUsersOptimized({ keyword: search })
            //            .success(function (users) {
            //                vm.observers = users.items;
            //            });
            //    };

            //    vm.refreshResources("a");
            //    vm.refreshObservers("a");

            //    vm.refresh();

            //    vm.customRendererObserver = function (instance, td, row, col, prop, value, cellProperties) {
            //        var html = `
            //<div class="form-group" style="width:180px; z-index:9999;">
            //    <ui-select ng-model="item.observers" multiple theme="bootstrap" ng-disabled="disabled" style="width: 150px;" title="Choose a person">
            //        <ui-select-match placeholder="">{{$item.userName}}</ui-select-match>
            //        <ui-select-choices repeat="obs in vm.observers track by $index" refresh="vm.refreshObservers($select.search)" refresh-delay="0">
            //            <div ng-if="obs.userName" ng-bind-html="obs.userName | highlight: $select.search"></div>
            //        </ui-select-choices>
            //    </ui-select>
            //</div>`;
            //        var el = angular.element(td);
            //        el.html($compile(html)($scope));
            //        return el;
            //    };

            //    vm.customRendererResource = function (instance, td, row, col, prop, value, cellProperties) {
            //        var html = Handsontable.helper.stringify(`
            //                        <div class="form-group" style="width:180px;">
            //    <ui-select ng-model="item.resources" multiple theme="bootstrap" ng-disabled="disabled" style="width: 150px;" title="Choose a person">
            //        <ui-select-match placeholder="">{{$item.userName}}</ui-select-match>
            //        <ui-select-choices repeat="res in vm.resources track by $index" refresh="vm.refreshResources($select.search)" refresh-delay="0">
            //            <div ng-if="res.userName" ng-bind-html="res.userName | highlight: $select.search"></div>
            //        </ui-select-choices>
            //    </ui-select>
            //</div>`);
            //        var el = angular.element(td);
            //        el.html($compile(html)($scope));
            //        return el;
            //    };

            //    vm.db = {
            //        items: [
            //            {
            //                "id": 1,
            //                "name": {
            //                    "first": "John",
            //                    "last": "Schmidt"
            //                },
            //                "address": "45024 France",
            //                "price": 760.41,
            //                "isActive": "Yes",
            //                "product": {
            //                    "description": "Fried Potatoes",
            //                    "options": [
            //                        {
            //                            "description": "Fried Potatoes",
            //                            "image": "//a248.e.akamai.net/assets.github.com/images/icons/emoji/fries.png"
            //                        },
            //                        {
            //                            "description": "Fried Onions",
            //                            "image": "//a248.e.akamai.net/assets.github.com/images/icons/emoji/fries.png"
            //                        }
            //                    ]
            //                }
            //            },
            //            //more items go here
            //        ]
            //    };

        }
    ]);
