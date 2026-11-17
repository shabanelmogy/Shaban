// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:51928-52403
appModule.controller('host.views.cbs.tasks.createOrEditProjectTaskModal',
        [
            '$scope', '$uibModalInstance', '$uibModal', 'options', 'abp.services.app.user', 'abp.services.app.taskDetail', 'utilities', 'appSession', 'abp.services.app.milestone',
            function ($scope, $uibModalInstance, $uibModal, options, userService, taskDetailService, utilities, appSession, milestoneService) {
                var vm = this;
                vm.assignedToUser = null;
                vm.resources = [];
                vm.observers = [];
                vm.taskDetailLogs = [];
                vm.projects = [];
                vm.project = null;
                vm.taskDocuments = null;
                vm.documents = [];
                vm.supportRequest={};
                vm.multilineStringToHTMLWordBreak = (s) => utilities.multilineStringToHTMLWordBreak(s);
                vm.saveAndNewCount = 0;
                vm.getTaskDocuments = function () {
                    vm.loading = true;
                    taskDetailService.getTaskDocuments({
                        id: options.taskId
                    }).success(function (data) {
                        vm.taskDocuments = data;

                    }).finally(function () {
                        vm.loading = false;
                    });
                }
                function getProjectMilestone() {
                    vm.loading = true;
                    milestoneService.getMilestonesByProjectId(options).then(function (response) {
                        vm.mileStones = response.data;
                        vm.loading = false;
                    });

                };
                vm.deleteTaskDocument = function (deal) {
                    abp.message.confirm(
                        app.localize('DeleteWarningMessage'),
                        function (isConfirmed) {
                            if (isConfirmed) {
                                taskDetailService.deleteTaskDocument({
                                    id: deal.id
                                }).success(function () {
                                    vm.getTaskDocuments();
                                    abp.notify.success(app.localize('SuccessfullyDeleted'));
                                });
                            }
                        }
                    );
                };
                vm.getlocalDateTime = function (date) {
                    if (date != null) {
                        var localTime = moment.utc(date).toDate();
                        return moment(localTime).format('YYYY-MM-DD HH:mm');
                    }
                    else {
                        return "";
                    }
                };
                vm.uploadDocument = function () {
                    
                        var modalInstance = $uibModal.open({
                            templateUrl: '~/App/host/views/support/supportRequests/uploadDocumentsModal.cshtml',
                            controller: 'host.views.support.supportRequests.uploadDocumentsModal as vm',
                            backdrop: 'static',
                            resolve: {
                                tenantId: function () {
                                    return 0;
                                }
                            }

                        });
                        modalInstance.result.then(function (result) {
                            taskDetailService.saveTaskDocument({
                                taskId: options.taskId,
                                document: result
                            }).success(function (data) {
                                vm.getTaskDocuments();
                            });
                        });
                    
                };
                vm.getOriginalName = function (doc) {
                    var originalName = doc.name.replace("_" + doc.guid, "");
                    return originalName;
                };
                vm.removeDocument = function (urlWithToken) {
                    vm.taskDetail.documents.forEach(function (item, index) {
                        if (item.urlWithToken === urlWithToken) {
                            vm.taskDetail.documents.splice(index, 1);
                        }
                    });
                };
                vm.isReadOnly = true;
                vm.taskDetail = {
                    projectId: options.projectId,
                    parentId: options.parentId,
                    id: options.taskId,
                    parentTaskName: options.parentTaskName
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
                vm.typeChane = function () {
                    getTaskStages();
                }
                vm.stageChange = function () {

                    getTaskStageStatus();

                };
                vm.clearUser = function () {
                    vm.assignedToUser = null;
                    vm.taskDetail.assignedToId = null;
                };
                function getTaskStages() {

                    vm.loading = true;
                    taskDetailService.getTaskStages({ taskType: vm.taskDetail.type }).success(function (result) {
                        vm.taskStages = result;

                        vm.loading = false;

                        if (vm.taskStages.length > 0 && !vm.taskDetail.taskStage) {
                            vm.taskDetail.taskStageId = vm.taskStages[0].id;

                        }
                        getTaskStageStatus();
                    });
                }
                function getTaskStageStatus() {

                    vm.loading = true;

                    taskDetailService.getTaskStageStatus({ stageId: vm.taskDetail.taskStageId }).success(function (result) {
                        vm.statuses = vm.statusesall.filter(f => result.includes(f.id));
                        vm.loading = false;
                        console.log(result);

                        console.log(vm.statuses);
                        if (vm.statuses.length > 0 && (!vm.taskDetail.status || vm.taskDetail.status===0)) {
                            vm.taskDetail.status = vm.statuses[0].id;

                        }
                    });
                }

                vm.getStatusName = function (status) {
                    if (status === 1) {
                        return 'New';
                    }
                    else if (status === 2) {
                        return 'To Be Discussed';
                    }
                    else if (status === 3) {
                        return 'In Progress';
                    }
                    else if (status === 4) {
                        return 'Completed';
                    }
                    else if (status === 5) {
                        return 'On Hold';
                    }
                };

                vm.addAboveOrBelowTask = options.addAboveOrBelowTask;
                vm.selectTaskId = options.selectTaskId;
                vm.getNameWithCompany = function (project) {
                    return project.title + " (" + project.company.companyName + ")";
                };

                vm.taskTypes = [
                    { id: 1, name: 'Development' },
                    { id: 2, name: 'Implementation' },
                    { id: 3, name: 'Support' },
                    { id: 4, name: 'Finance' },
                    { id: 5, name: 'Marketing' },
                    { id: 6, name: 'Sales' },
                    { id: 7, name: 'Admin' },
                    { id: 8, name: 'Other' }
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
                vm.searchOrganizationContactPopup = function () {
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/host/views/cbs/resourcePlanner/searchOrganizationUnitModal.cshtml',
                        controller: 'host.views.cbs.resourcePlanner.searchOrganizationUnitModal as vm',
                        backdrop: 'static',
                        size: 'lg'
                    });
                    modalInstance.result.then(function (result) {
                        if (result) {
                            vm.taskDetail.organizationUnitId = result.id;
                            vm.taskDetail.organizationUnit = result.name;
                            vm.taskDetail.assignedToId = null;
                            vm.assignedToUser = null;

                        }

                    });
                };
                vm.clearSelection = function () {
                    vm.taskDetail.organizationUnitId = null;
                    vm.taskDetail.organizationUnit = null;
                    //vm.assignedToUser = appSession.user;
                    //vm.taskDetail.assignedToId = vm.assignedToUser.id;
                    vm.taskDetail.assignedToId = null;
                    vm.assignedToUser = null;
                  
                };
                vm.searchUsers = function ($select) {
                    if ($select.search == "")
                        return null;
                    userService.searchUsers({ keyword: $select.search }).then(function (response) {
                        vm.users = response.data.items;
                    });
                };
                vm.searchProjects = function ($select) {
                    if ($select.search == "")
                        return null;
                    taskDetailService.searchProjects({ keyword: $select.search }).then(function (response) {
                        vm.projects = response.data.items;
                    });
                };

                vm.resourcesChanged = function () {
                    vm.taskDetail.resourcesIds = [];
                    vm.resources.forEach(function (resource) {
                        vm.taskDetail.resourcesIds.push(resource.id);
                    });
                    vm.users = [];
                };

                vm.observersChanged = function () {
                    vm.taskDetail.observersIds = [];
                    vm.observers.forEach(function (observer) {
                        vm.taskDetail.observersIds.push(observer.id);
                    });
                    vm.users = [];
                };

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
                    taskDetailService.createOrUpdate({
                        taskDetail: vm.taskDetail,
                        addAboveOrBelowTask: vm.addAboveOrBelowTask,
                        selectTaskId: vm.selectTaskId
                    }).success(function (result) {
                        let taskObj = angular.copy(vm.taskDetail);
                        taskObj.id = result.key;
                        taskObj.priority = result.value;
                        taskObj.resources = vm.resources;
                        taskObj.observers = vm.observers;
                        taskObj.assignedTo = vm.assignedToUser;
                        taskObj.actualHours = 0;
                        taskObj.revisedDuration = vm.taskDetail.duration ? parseInt(vm.taskDetail.duration) : 0;
                        taskObj.estimatedHours = vm.taskDetail.duration ? parseInt(vm.taskDetail.duration) : 0;
                        taskObj.status = 1;
                        taskObj.duration = vm.taskDetail.duration ? parseInt(vm.taskDetail.duration) : 0;
                        returnTasks.push(taskObj);
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
                            $uibModalInstance.close(returnTasks);
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


  vm.openRequestLogModal = function (row) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/support/supportRequests/createOrShowRequestLogsModal.cshtml',
                    controller: 'host.views.support.supportRequests.createOrShowRequestLogsModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        supportRequest: function () {
                            return row;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                });
            }


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
                    taskDetailService.getTaskDetailForEdit(options.taskId).success(function (result) {
                                  vm.supportRequest=result.supportRequest;
                        userService.getHostUserAccounts().success(function (hostUser) {
                            vm.users = hostUser.items;
                            vm.taskDetail = result;
                            if (result.project != null) {
                                vm.taskDetail.projectId = result.project.id;
                            }
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
                            getTaskStages();
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
                    if (options.taskId > 0) {
                        getTaskDetailForEdit();
                    } else {
                        if (options.parentChildCount === 0 && options.parentId) {
                            vm.loading = true;
                            taskDetailService.getTaskDetailForEdit(options.parentId).success(function (result) {
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
                                    getTaskStages();
                                });
                                vm.loading = false;
                            });
                        }
                    }
                }

                init();
                if (vm.taskDetail.projectId)
                    getProjectMilestone();
                vm.getTaskDocuments();
            }
        ]);
