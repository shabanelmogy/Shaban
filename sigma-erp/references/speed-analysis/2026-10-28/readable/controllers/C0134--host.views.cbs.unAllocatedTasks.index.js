// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:55313-56014
appModule.controller('host.views.cbs.unAllocatedTasks.index', [
        '$scope', '$uibModal', 'abp.services.app.user', 'appSession', 'abp.services.app.projectTask', 'abp.services.app.supportRequestHost', 'abp.services.app.dataEntryCorrectionHost', 'abp.services.app.customizationHost', 'utilities',
        function ($scope, $uibModal, userService, appSession, projectTaskService, supportRequestService, dataEntryCorrectionService, customizationService, utilities) {
            var isSupportPermission = abp.auth.hasPermission('Pages.Support');

            var vm = this;
            vm.selectionName = null;
            vm.selectionId = null;
            vm.showOrganization = true;
            vm.canViewOtherTasks = true;
            vm.projectType = null;
            vm.taskType = null;
            vm.unallocatedTasksCount = 0;
            vm.projectTypes = [

                { id: 1, name: "Domestic" },
                { id: 2, name: "International" },
                { id: 3, name: "Internal" }

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
                        vm.getDueTasks();

                    }
                });
            };
            vm.taskTypes = [
                { id: 1, name: 'Development' },
                { id: 2, name: 'Implementation' },
                { id: 3, name: 'Support' },
                { id: 4, name: 'Finance' },
                { id: 5, name: 'Marketing' },
                { id: 6, name: 'Sales' },
                { id: 7, name: 'Admin' }
            ];
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
                    vm.getDueTasks();
                });
            };
            vm.openProjectTasksModal = function (projectId) {
                $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/projectsDashboard/projectTasks.cshtml',
                    controller: 'host.views.cbs.projectsDashboard.projectTasks as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        project: function () {
                            return {
                                id: projectId,
                                company: null,
                                tasks: []
                            };
                        },
                        isInitiateFromCase: null
                    }
                });
            };
            $scope.filterProjectTypes = function (row) {
                if (vm.projectType === null) {
                    if (vm.taskType === null) {
                        vm.unallocatedTasksCount = vm.dueTaskData.length;
                        return true;
                    }
                    else {
                        vm.unallocatedTasksCount = vm.dueTaskData.filter(f => f.type === vm.taskType).length;
                        if (row.type === vm.taskType) {
                            
                            return true;
                        }
                        else {
                            return false;
                        }
                    }
                    
                }
                else {
                    vm.unallocatedTasksCount = vm.dueTaskData.filter(f => f.projectType === vm.projectType).length;
                    if (row.projectType === vm.projectType) {
                        if (vm.taskType === null) {
                            
                            return true;
                        }
                        else {
                            vm.unallocatedTasksCount = vm.dueTaskData.filter(f => f.projectType === vm.projectType && f.type === vm.taskType).length;
                            if (row.type === vm.taskType) {
                                
                                return true;
                            }
                            else {
                                return false;
                            }
                        }
                    }
                    else {
                        return false;
                    }
                }
            };


            vm.isOrganization = false;
            vm.multilineStringToHTML = (s) => utilities.multilineStringToHTML(s);
            vm.multilineStringToHTMLWordBreak = (s) => utilities.multilineStringToHTMLWordBreak(s);



            vm.loading = false;
            vm.filters = {
                userId: appSession.user.id,
                user: appSession.user,
                taskStatusesArray:
                    [
                        { id: 1, name: 'New' },
                        { id: 2, name: 'TBD' },
                        { id: 3, name: 'In Progress' }
                    ],
                assignedToUserId: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
            };
            vm.clearSelection = function () {
                vm.selectionName = null;
                vm.selectionId = null;
            };
           
            vm.taskStatuses =
                [
                    { id: 1, name: 'New' },
                    { id: 2, name: 'TBD' },
                    { id: 3, name: 'In Progress' },
                    { id: 4, name: 'Completed' }
                ];
            vm.openCreateProjectTaskModal = function (projectId, parentTaskId, taskId, addAboveOrBelowTask, selectTaskId) {
                let index = null;
                let parent = null;


                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/dueTasks/createOrEditProjectTaskModal.cshtml',
                    controller: 'host.views.cbs.dueTasks.createOrEditProjectTaskModal as vm',
                    backdrop: 'static',
                    resolve: {
                        options: function () {
                            return {
                                projectId: projectId,
                                parentId: parentTaskId,
                                taskId: taskId,
                                addAboveOrBelowTask: addAboveOrBelowTask,
                                selectTaskId: selectTaskId,
                                parentTaskName: parent !== null ? parent.name : null,
                                parentChildCount: parent && parent.children ? parent.children.length : 0
                            };
                        }
                    }
                });
                modalInstance.result.then(function () {
                    vm.getDueTasks();

                });
            };


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


            vm.openCustomizationLogModal = function (row) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/customization/createOrShowCustomizationLogsModal.cshtml',
                    controller: 'host.views.customization.createOrShowCustomizationLogsModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        customization: function () {
                            return row;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    //    vm.getCustomizations();
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
                    //  vm.getSupportRequests();
                });
            };


            vm.editSupportRequest = function (supportRequest) {
                editSupportRequestModal(supportRequest.id);
            };

            vm.supportRequestClose = function (request) {
                abp.message.confirm(
                    app.localize('CloseRequestMessage', request.requestNo),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            supportRequestService.closeRequest({
                                id: request.id
                            }).success(function () {
                                //   vm.getSupportRequests();
                                abp.notify.success(app.localize('SuccessfullySaved'));
                            });
                        }
                    }
                );
            };
            vm.supportRequestMovetoCustomization = function (request) {
                abp.message.confirm(
                    app.localize('MoveToCustomizationRequestMessage', request.requestNo),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            supportRequestService.moveToCustomization({
                                id: request.id
                            }).success(function () {
                                //    vm.getSupportRequests();
                                abp.notify.success(app.localize('SuccessfullySaved'));
                            });
                        }
                    }
                );
            };


            vm.supportRequestMovetoDataEntryCorrection = function (request) {
                abp.message.confirm(
                    app.localize('MoveToDataEntryRequestMessage', request.requestNo),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            supportRequestService.moveToDataEntryCorrection({
                                id: request.id
                            }).success(function () {
                                //   vm.getSupportRequests();
                                abp.notify.success(app.localize('SuccessfullySaved'));
                            });
                        }
                    }
                );
            };


            function editSupportRequestModal(id) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/support/supportRequests/editModal.cshtml',
                    controller: 'host.views.support.supportRequests.editModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        supportRequestId: function () {
                            return id;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    //  vm.getSupportRequests();
                });
            };

            vm.editCustomization = function (customization) {
                editCustomizationModal(customization.id);
            };
            function editCustomizationModal(id) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/customization/editModal.cshtml',
                    controller: 'host.views.customization.editModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        customizationId: function () {
                            return id;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    //  vm.getCustomizations();
                });
            };



            vm.customizationClose = function (request) {
                abp.message.confirm(
                    app.localize('CloseRequestMessage', request.requestNo),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            customizationService.closeCustomization({
                                id: request.id
                            }).success(function () {
                                //  vm.getCustomizations();
                                abp.notify.success(app.localize('SuccessfullySaved'));
                            });
                        }
                    }
                );
            };

            vm.customizationApprove = function (request) {
                abp.message.confirm(
                    app.localize('ApproveRequestMessage', request.requestNo),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            customizationService.approveCustomization({
                                id: request.id
                            }).success(function () {
                                //  vm.getCustomizations();
                                abp.notify.success(app.localize('SuccessfullySaved'));
                            });
                        }
                    }
                );
            };



            vm.openDataEntryLogModal = function (row) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/dataEntry/dataEntryCorrections/createOrShowDataEntryLogsModal.cshtml',
                    controller: 'host.views.dataEntry.dataEntryCorrections.createOrShowEntryLogsModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        dataEntry: function () {
                            return row;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    //   vm.getDataEntryCorrection();
                });
            };


            vm.editDataEntryCorrection = function (dataEntry) {
                editDataEntryCorrectionModal(dataEntry.id);
            };

            function editDataEntryCorrectionModal(id) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/dataEntry/dataEntryCorrections/editModal.cshtml',
                    controller: 'host.views.dataEntry.dataEntryCorrections.editModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        dataEntryId: function () {
                            return id;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    //   vm.getDataEntryCorrection();
                });
            };


            vm.dataEntryCorrectionClose = function (request) {
                abp.message.confirm(
                    app.localize('CloseRequestMessage', request.requestNo),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            dataEntryCorrectionService.closeDataEntryCorrection({
                                id: request.id
                            }).success(function () {
                                //   vm.getDataEntryCorrection();
                                abp.notify.success(app.localize('SuccessfullySaved'));
                            });
                        }
                    }
                );
            };


            vm.getRequestTypeName = function (id) {
                if (id == 1) {
                    return 'Support';
                }
                else if (id == 2) {
                    return 'Data Entry Correction';
                }
                else {
                    return 'Customization';
                }
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
                });
            }

            function editProjectTaskModal(projectTask) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/taskDetails/viewOrEditProjectTaskModal.cshtml',
                    controller: 'host.views.cbs.tasks.createOrEditProjectTaskModal as vm',
                    //controller: 'host.views.cbs.projectTasks.createOrEditProjectTaskModal as vm',
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
                    vm.getDueTasks();
                });
            }

            function openViewProjectTaskModal(projectTask) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/app/host/views/cbs/taskDetails/viewModal.cshtml',
                    //templateUrl: '~/App/host/views/cbs/tasks/viewModal.cshtml',
                    controller: 'host.views.cbs.tasks.viewModal as vm',
                    //controller: 'host.views.cbs.projectTasks.viewModal as vm',
                    backdrop: 'static',
                    resolve: {
                        options: function () {
                            return {
                                projectTaskId: projectTask.id
                            };
                        }
                    }
                });
            }

            // Log ProjectTask Direct
            function openProjectTaskLogModalDirect(projectTask) {
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

                    //projectTask.status = result.taskStatus;
                    //projectTask.assignedToUser = result.assignedToUser;
                    //projectTask.assignedToUserId = result.assignedToUserId;
                    //projectTask.percentComplete = result.percentComplete;
                    vm.getDueTasks();
                    vm.getUnallocatedTasks();
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

            vm.projectTaskLogDirect = function (projectTask) {
                openProjectTaskLogModalDirect(projectTask);
            };

            vm.getAllUsersData = function () {
                userService.getAllUsers({}).success(function (data) {

                    vm.allUsers = data.items;
                });
            };
            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('DD-MMM-YY HH:mm');
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

            vm.getStatus = function (id) {
                if (id == 1)
                    return "Open";
                else if (id == 2)
                    return "Closed";
                else if (id == 5)
                    return "Estimation Pending";
                else if (id == 6)
                    return "Estimated, Customer Confirmation Pending";
                else if (id == 7)
                    return "Finance Approval Pending";
                else if (id == 8)
                    return "Finance Approved";
                else if (id == 9)
                    return "In Progress";

                else return '';
            };

            vm.getPriority = function (priority) {
                if (priority == 3)
                    return app.localize("High");
                else
                    return "";
            };
            vm.getDueTasks = function () {

                vm.loading = true;
                vm.totalTaskNumbers = 0;

                vm.filters.taskStatuses = [];
                if (vm.filters.taskStatusesArray.length > 0) {
                    angular.forEach(vm.filters.taskStatusesArray, function (value) {
                        vm.filters.taskStatuses.push(value.id);
                    });
                }
                vm.filters.organizationId = null;
                if (vm.isOrganization == true) {
                    vm.filters.userId = null;
                    vm.filters.organizationId = vm.selectionId;

                }
                if (vm.filters.userId != null) {
                    vm.filters.assignedToUserId = vm.filters.userId;
                    vm.filters.organizationId = null;
                }


                if (isSupportPermission) {
                    supportRequestService.getUnallocatedSupportTasks(vm.filters).success(function (data) {
                        vm.allUserData = data.items;
                    }).finally(function () {

                    });
                }

                projectTaskService.getUnAllocatedTasks(vm.filters).success(function (data) {
                    vm.dueTaskData = data;

                }).finally(function () {
                    vm.loading = false;
                });


            };
            vm.userSelectionChanged = function () {
                vm.isOrganization = false;
                vm.filters.userId = vm.filters.user.id;
                vm.getDueTasks();
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
                    if (updatedTaskDetail !== null) {
                        vm.getDueTasks();
                    }
                });
            };

            vm.roundOf = function (value) {
                if (!value) return 0;
                return Math.round(value, 2);
            };

            function init() {
                vm.getAllUsersData();
                vm.getDueTasks();
            }

            init();
        }
    ]);
