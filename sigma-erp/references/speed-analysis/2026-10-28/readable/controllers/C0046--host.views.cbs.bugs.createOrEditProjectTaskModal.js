// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:31985-32330
appModule.controller('host.views.cbs.bugs.createOrEditProjectTaskModal',
        [
            '$scope', 'supportRequestid', '$uibModalInstance', '$uibModal', 'options', 'abp.services.app.user', 'abp.services.app.taskDetail', 'appSession', 'abp.services.app.tenant',
            function ($scope, supportRequestid, $uibModalInstance, $uibModal, options, userService, taskDetailService, appSession, tenantAppService) {
                var vm = this;
                vm.assignedToUser = null;
                vm.resources = [];
                vm.observers = [];
                vm.taskDetailLogs = [];
                vm.tenants = [];
                vm.saveAndNewCount = 0;
                vm.documents = [];
                vm.isReadOnly = true;
                vm.oldStage=
                vm.taskDetail = {
                    projectId: options.projectId,
                    parentId: options.parentId,
                    id: options.taskId,
                    parentTaskName: options.parentTaskName,
                    type: 1,
                    taskStageId: 3,
                    status:1,
                    supportRequestId: supportRequestid
                };
                vm.statuses = [
               
                ];
                vm.statusesall = [
                    { id: 1, name: 'New' },
                    { id: 2, name: 'To Be Discussed' },
                    { id: 3, name: 'In Progress' },
                    { id: 4, name: 'Completed' },
                    { id: 5, name: 'On Hold' }
                ];
                vm.uploadDocument = function () {
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/host/views/cbs/bugs/uploadDocumentsModal.cshtml',
                        controller: 'host.views.cbs.bugs.uploadDocumentsModal as vm',
                        backdrop: 'static'


                    });
                    modalInstance.result.then(function (result) {
                        console.log("result");
                        
                        vm.documents.push(result);
                        console.log(vm.documents);
                    });
                };
                vm.getOriginalName = function (doc) {
                    var originalName = doc.name.replace("_" + doc.guid, "");
                    return originalName;
                };
                vm.stageChange = function () {

                    getTaskStageStatus();

                };
                function getTaskStages() {

                    vm.loading = true;
                    taskDetailService.getTaskStages({ taskType: vm.taskDetail.type }).success(function (result) {
                        vm.taskStages = result;
                        getTaskStageStatus();
                        vm.loading = false;
                    });
                }
                vm.getOriginalName = function (doc) {
                    var originalName = doc.name.replace("_" + doc.guid, "");
                    return originalName;
                };
                function getTaskStageStatus() {

                    vm.loading = true;

                    taskDetailService.getTaskStageStatus({ stageId: vm.taskDetail.taskStageId }).success(function (result) {
                        vm.statuses = vm.statusesall.filter(f => result.includes(f.id));
                        vm.loading = false;
                        console.log(result);
                        
                        console.log(vm.statuses);
                        if (vm.statuses.length > 0 && (!vm.taskDetail.status || vm.taskDetail.status === 0)) {
                            vm.taskDetail.status = vm.statuses[0].id;

                        }
                    });
                }
                vm.addAboveOrBelowTask = options.addAboveOrBelowTask;
                vm.selectTaskId = options.selectTaskId;

                vm.taskTypes = [
                    { id: 1, name: 'Development' },
                    { id: 2, name: 'Implementation' },
                    { id: 3, name: 'Support' },
                    { id: 4, name: 'Finance' },
                    { id: 5, name: 'Marketing' },
                    { id: 6, name: 'Sales' },
                    { id: 7, name: 'Admin' }
                ];
                
                vm.dateFormat = abp.setting.get("App.General.DateFormat");
                vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
                vm.getlocalDateTime = function (date) {
                    if (date != null) {
                        var localTime = moment.utc(date).toDate();
                        return moment(localTime).format(vm.dateTimeFormat);
                    }
                    else {
                        return "";
                    }
                };

                vm.searchUsers = function ($select) {
                    if ($select.search == "")
                        return null;
                    userService.searchUsers({ keyword: $select.search }).then(function (response) {
                        vm.users = response.data.items;
                    });
                }

                vm.resourcesChanged = function () {
                    vm.taskDetail.resourcesIds = [];
                    vm.resources.forEach(function (resource) {
                        vm.taskDetail.resourcesIds.push(resource.id);
                    });
                    vm.users = [];
                }

                vm.observersChanged = function () {
                    vm.taskDetail.observersIds = [];
                    vm.observers.forEach(function (observer) {
                        vm.taskDetail.observersIds.push(observer.id);
                    });
                    vm.users = [];
                }

                var returnTasks = new Array();

                vm.cancel = function () {
                    if (vm.saveAndNewCount > 0) {
                        $uibModalInstance.close(returnTasks);
                    } else {
                        $uibModalInstance.dismiss();
                    }
                };


                vm.save = function (isSaveAndNew) {
                    vm.loading = true;
                    vm.taskDetail.documents = vm.documents;
                    taskDetailService.createBug({
                        taskDetail: vm.taskDetail,
                        addAboveOrBelowTask: vm.addAboveOrBelowTask,
                        selectTaskId: vm.selectTaskId
                    }).success(function (result) {
                        
                        if (isSaveAndNew) {
                            vm.taskDetail.duration = null;
                            vm.taskDetail.id = 0;
                            vm.taskDetail.title = null;
                            vm.taskDetail.description = null;
                            //vm.taskDetail.type = null;//donot clear type {development ,implementation etc}
                            vm.taskDetail.startDate = null;
                            vm.taskDetail.endDate = null;
                            vm.assignedToUser = null;
                            vm.taskDetail.assignedToId = null;
                            vm.resources = [];
                            vm.taskDetail.resourcesIds = [];
                            vm.observers = [];
                            vm.taskDetail.observersIds = [];
                            vm.saveAndNewCount++;
                        } else {
                            $uibModalInstance.close();
                        }
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        vm.loading = false;
                    });
                };

                vm.updateTaskAssign = function () {
                    vm.loading = true;
                    taskDetailService.updateTaskAssignment(vm.taskDetail).success(function () {
                        vm.taskDetail.assignedTo = vm.assignedToUser;
                        vm.taskDetail.resources = vm.resources;
                        $uibModalInstance.close(vm.taskDetail);
                        abp.notify.info(app.localize('SavedSuccessfully'));
                    });
                };
                vm.searchTenants = function ($select) {
                    if ($select.search === "")
                        vm.tenants = [];
                    tenantAppService.searchTenants({ filter: $select.search }).then(function (response) {
                        vm.tenants = response.data.items;
                    });
                };
                vm.openTaskLogModel = function () {
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/host/views/cbs/taskDetails/taskDetailLog.cshtml',
                        controller: 'host.views.cbs.tasks.taskDetailLog as vm',
                        backdrop: 'static',
                        size: 'sm',
                        resolve: {
                            taskId: function () {
                                return vm.taskDetail.id;
                            }
                        },
                    });
                    modalInstance.result.then(function (result) {
                        vm.getTaskDetailLogs();
                    });
                };

                function getTaskDetailForEdit() {
                    vm.loading = true;
                    taskDetailService.getBugForEdit(options.taskId).success(function (result) {

                        userService.getHostUserAccounts().success(function (hostUser) {
                            vm.users = hostUser.items;
                            vm.taskDetail = result;
                            if (vm.taskDetail.assignedToId != null) {
                                vm.assignedToUser = vm.users.filter(function (user) {
                                    return user.userId == vm.taskDetail.assignedToId;
                                })[0].user;
                            }
                            vm.observers = [];
                            if (vm.taskDetail.observersIds.length > 0) {
                                vm.taskDetail.observersIds.forEach(function (observersId) {
                                    let observer = vm.users.filter(function (user) {
                                        return user.userId == observersId;
                                    })[0];
                                    if (observer != undefined)
                                        vm.observers.push(observer.user);
                                });
                            }

                            vm.resources = [];
                            if (vm.taskDetail.resourcesIds.length > 0) {
                                vm.taskDetail.resourcesIds.forEach(function (resourcesId) {
                                    let resource = vm.users.filter(function (user) {
                                        return user.userId == resourcesId;
                                    })[0];
                                    if (resource != undefined)
                                        vm.resources.push(resource.user);
                                });
                            }
                            vm.users = [];
                        });
                        vm.loading = false;
                    });
                }

                vm.getTaskDetailLogs = function () {
                    vm.loading = true;
                    taskDetailService.getTaskDetailLogsByTaskId(vm.taskDetail.id).success(function (result) {
                        vm.taskDetailLogs = result;
                        vm.loading = false;
                    });
                };

                vm.setActiveTabIndex = function (index) {
                    vm.isReadOnly = true;
                    vm.activeTabIndex = index;
                    if (index == 2 && vm.taskDetailLogs.length == 0) {
                        vm.getTaskDetailLogs();
                    }
                    else if (index == 3 && vm.taskDetailLogs.length == 0) {
                        vm.getTaskDetailLogs();
                    }
                };

                function init() {
                    if (options.taskId > 0)
                    {
                        getTaskDetailForEdit();
                    }
                    else {
                        if (options.parentChildCount === 0 && options.parentId) {
                            vm.loading = true;
                            taskDetailService.getBugForEdit(options.parentId).success(function (result) {

                                userService.getHostUserAccounts().success(function (hostUser) {
                                    vm.users = hostUser.items;
                                    vm.taskDetail = result;
                                    vm.taskDetail.id = 0;
                                    vm.taskDetail.title = "";
                                    vm.taskDetail.projectId = options.projectId;
                                    vm.taskDetail.parentId = options.parentId;
                                    vm.taskDetail.description = "";
                                    if (vm.taskDetail.assignedToId != null) {
                                        vm.assignedToUser = vm.users.filter(function (user) {
                                            return user.userId == vm.taskDetail.assignedToId;
                                        })[0].user;
                                    }
                                    vm.observers = [];
                                    if (vm.taskDetail.observersIds.length > 0) {
                                        vm.taskDetail.observersIds.forEach(function (observersId) {
                                            let observer = vm.users.filter(function (user) {
                                                return user.userId == observersId;
                                            })[0];
                                            if (observer != undefined)
                                                vm.observers.push(observer.user);
                                        });
                                    }

                                    vm.resources = [];
                                    if (vm.taskDetail.resourcesIds.length > 0) {
                                        vm.taskDetail.resourcesIds.forEach(function (resourcesId) {
                                            let resource = vm.users.filter(function (user) {
                                                return user.userId == resourcesId;
                                            })[0];
                                            if (resource != undefined)
                                                vm.resources.push(resource.user);
                                        });
                                    }
                                    vm.users = [];
                                });
                                vm.loading = false;
                            });
                        }
                        else if (supportRequestid != null)
                        {
                            vm.loading = true;
                            userService.getHostUserAccounts().success(function (hostUser)
                            {
                                    vm.users = hostUser.items;
                                    vm.taskDetail.title = supportRequestid.detail;
                                    vm.taskDetail.tenant = supportRequestid.tenant;
                                    vm.taskDetail.taskStageId = 3;
                                    vm.taskDetail.status = 1;
                                    vm.taskDetail.assignedToId = 40688;
                                    if (vm.taskDetail.assignedToId != null) {
                                        vm.assignedToUser = vm.users.filter(function (user) {
                                            return user.userId == vm.taskDetail.assignedToId;
                                        })[0].user;
                                    }
                                    vm.users = [];
                                });
                                vm.loading = false;

                        }
                    }
                }
                init();
                getTaskStages();
            }
        ]);
