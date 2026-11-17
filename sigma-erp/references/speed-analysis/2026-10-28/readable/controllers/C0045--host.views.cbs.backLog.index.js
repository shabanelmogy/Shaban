// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:30717-31982
appModule.controller('host.views.cbs.backLog.index', [
        '$scope', '$uibModal', '$timeout', 'abp.services.app.user', 'appSession', 'abp.services.app.projectTask', 'abp.services.app.tenant', 'abp.services.app.organizationUnit', 'abp.services.app.supportRequestHost', 'abp.services.app.dataEntryCorrectionHost', 'abp.services.app.customizationHost', 'utilities', 'abp.services.app.release', 'abp.services.app.taskDetail', 'abp.services.app.workspace',
        function ($scope, $uibModal, $timeout, userService, appSession, projectTaskService, tenantAppService, organizationUnitAppService, supportRequestService, dataEntryCorrectionService, customizationService, utilities, releaseService, taskDetailService, workspaceService) {
            var vm = this;

            vm.permissions = {
                manageRelease: abp.auth.hasPermission('Pages.CBS.Release.ManageRelease'),
                release: abp.auth.hasPermission('Pages.CBS.Release')
            };
            vm.totalActiveReleaseTaskCount = 0;
            vm.totalCompletedTaskCount = 0;
            vm.totalInCompletedTaskCount = 0;
            vm.selectionName = null;
            vm.selectionId = null;
            vm.showOrganization = true;
            vm.canViewOtherTasks = true;
            vm.projectType = null;
            vm.taskType = null;
            vm.prepareRelease = true;
            vm.releaseId = 0;
            vm.activeReleases = null;
            vm.activeRelease = null;
            vm.backLogCount = 0;
            vm.openProjectsList = null; 
            vm.projectTypes = [

                { id: 1, name: "Domestic" },
                { id: 2, name: "International" },
                { id: 3, name: "Internal" }

            ];

            vm.backLogFilter = {
                team: {id:null}
            }
            vm.getReleaseTaskByTeam = function (id) {
                vm.getReleaseTask(id);
            }
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeModel = {
                startDate: moment(moment().format('YYYY-MM-DD')).utc(),
                endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc(),
            };

            
            
            vm.openCreateReleaseModal = function () {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/release/createReleaseModal.cshtml',
                    controller: 'host.views.cbs.release.createOrEditRelease as vm',
                    backdrop: 'static',
                    resolve: {
                        release: {
                            id: 0,
                            name: '',
                            releaseDate: null,
                            releaseApplication: null,
                            developmentDate: null,
                            projectId: null
                        },
                    }

                });
                modalInstance.result.then(function () {
                    vm.prepareReleaseChanged();
                    if (vm.backLogFilter.team != null)
                        vm.getReleaseTask(vm.backLogFilter.team.id);
                    else
                        vm.getReleaseTask(vm.backLogFilter.team);

                });
            };

            
            vm.openEditReleaseModal = function (release) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/release/releaseEditModal.cshtml',
                    controller: 'host.views.cbs.release.createOrEditRelease as vm',
                    backdrop: 'static',
                    resolve: {
                        release: function () {
                            return {
                                id: release.id,
                                releaseApplication: release.releaseApplication,
                                releaseDate: release.releaseDate,
                                name: release.name,
                                plannedDate: release.plannedDate,
                                teams: release.teams
                            };
                        }
                    }

                });
                modalInstance.result.then(function () {
                    if (vm.backLogFilter.team != null)
                        vm.getReleaseTask(vm.backLogFilter.team.id);
                    else
                        vm.getReleaseTask(vm.backLogFilter.team);
                });
            };

            vm.openRevisedReleaseModal = function (release) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/release/releaseReviseModal.cshtml',
                    controller: 'host.views.cbs.release.createOrEditRelease as vm',
                    backdrop: 'static',
                    resolve: {
                        release: function () {
                            return {
                                id: release.id,
                                name: release.name,
                                releaseDate: release.releaseDate,
                                plannedDate: release.plannedDate,
                                releaseApplication: release.releaseApplication,
                                teams: release.teams
                            };
                        }
                    }

                });
                modalInstance.result.then(function () {
                    if (vm.backLogFilter.team != null)
                        vm.getReleaseTask(vm.backLogFilter.team.id);
                    else
                        vm.getReleaseTask(vm.backLogFilter.team);
                });
            };

            vm.releasedMark = function (release) {
                //vm.loading = true;
                abp.message.confirm(
                    app.localize('Do you want to Mark As Released?',),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            release.isReleased = true;
                            releaseService.editRelease(release).success(function (result) {
                                abp.notify.info(app.localize('Marked Successfully!'));
                                if (vm.backLogFilter.team != null)
                                    vm.getReleaseTask(vm.backLogFilter.team.id);
                                else
                                    vm.getReleaseTask(vm.backLogFilter.team);
                                vm.loading = false;
                            });
                        }
                    }
                );
            };

            vm.releaseLock = function (release) {
                abp.message.confirm(
                    app.localize('Do you want to Lock this Released?',),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            release.isLocked = true;
                            releaseService.lockRelease(release).success(function (result) {
                                abp.notify.info(app.localize('Release Locked Successfully!'));
                                if (vm.backLogFilter.team != null)
                                    vm.getReleaseTask(vm.backLogFilter.team.id);
                                else
                                    vm.getReleaseTask(vm.backLogFilter.team);
                                vm.loading = false;
                            });
                        }
                    }
                );
            };

            vm.uncloseReleasedMark = function (release) {
                //vm.loading = true;
                abp.message.confirm(
                    app.localize('Do you want to Mark Release As Unclosed?',),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            release.isReleased = false;
                            releaseService.editRelease(release).success(function (result) {
                                abp.notify.info(app.localize('Unclosed Successfully!'));
                                if (vm.backLogFilter.team != null)
                                    vm.getReleaseTask(vm.backLogFilter.team.id);
                                else
                                    vm.getReleaseTask(vm.backLogFilter.team);
                                vm.loading = false;
                            });
                        }
                    }
                );
            };

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

            vm.searchTenants = function ($select) {
                if ($select.search == "")
                    return null;
                tenantAppService.searchTenants({ filter: $select.search }).then(function (response) {
                    vm.tenants = response.data.items;
                });
            };


            //vm.openProjectTasksModal = function (projectId) {
            //    debugger;
            //    $uibModal.open({
            //        templateUrl: '~/App/host/views/cbs/projectsDashboard/projectTasks.cshtml',
            //        controller: 'host.views.cbs.projectsDashboard.projectTasks as vm',
            //        backdrop: 'static',
            //        size: 'xl',
            //        resolve: {
            //            project: function () {
            //                return {
            //                    id: projectId,
            //                    company: null,
            //                    tasks: []
            //                };
            //            },
            //            prepareRelease: vm.prepareRelease,
            //            releaseId: vm.activeRelease,
            //            isInitiateFromCase: null
            //        }
            //    });
            //};

            $scope.filterProjectTypes = function (row) {
                if (vm.projectType === null) {
                    if (vm.taskType === null) {
                        vm.backLogCount = vm.dueTaskData.length;
                        return true;
                    }
                    else {
                        vm.backLogCount = vm.dueTaskData.filter(f => f.type === vm.taskType).length;
                        if (row.type === vm.taskType) {

                            return true;
                        }
                        else {
                            return false;
                        }
                    }

                }
                else {
                    vm.backLogCount = vm.dueTaskData.filter(f => f.projectType === vm.projectType).length;
                    if (row.projectType === vm.projectType) {
                        if (vm.taskType === null) {

                            return true;
                        }
                        else {
                            vm.backLogCount = vm.dueTaskData.filter(f => f.projectType === vm.projectType && f.type === vm.taskType).length;
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

            vm.types = [
                "Project",
                "Project/CR",
                "Bug",
                "Change Request"
            ];


            vm.loading = false;
            vm.filters = {
                type: "",
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
                isApproved: true
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


            vm.saveAssigned = function (task) {
                clearInterval(myInterval);
                task.assignedToUserName = task.salesPersonUser.name;
                task.assignedToId = task.salesPersonUser.id;
                taskDetailService.createOrEdit({
                    taskDetail: task
                }).success(function (result) {

                    //task.assignedTo = task.assignedToUser;
                    task.isEnabled = false;
                });

            };
            vm.saveType = function (task,index) {
                vm.loading = true;
                taskDetailService.createOrUpdate({
                    taskDetail: task
                }).success(function (result) {
                    if (task.taskType != 1) {
                        const ele = document.getElementById('row' + index);
                        ele.remove();
                        vm.taskLength -= 1;
                    }
                    vm.loading = false;
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
                    vm.getBackLogTasks();
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

            vm.searchProjects = function ($select) {
                if ($select.search == "")
                    return null;
                taskDetailService.searchProjects({ keyword: $select.search }).then(function (response) {
                    vm.projects = response.data.items;
                });
            };

            vm.searchProjectNo = function ($select) {
                if (!$select.search)
                    return null;
                taskDetailService.searchProjectNo({ keyword: $select.search }).then(function (response) {
                    vm.projectNos = response.data.items; 
                });
            };

            vm.searchAssignedToUserName = function ($select) {
                if (!$select.search)
                    return null;
                userService.searchAssignedToUsers({ keyword: $select.search }).then(function (response) {
                    vm.assignedToUserNames = response.data.items;
                });
            };

            vm.searchRequestNo = function ($select) {
                if (!$select.search)
                    return null;
                taskDetailService.search({ keyword: $select.search }).then(function (response) {
                    vm.requestNumbers = response.data.items;
                });
            };

            vm.searchSupportRequestNo = function ($select) {
                if (!$select.search)
                    return null;
                taskDetailService.searchSupportRequest({ keyword: $select.search }).then(function (response) {
                    vm.srNumbers = response.data.items;
                });
            };

            vm.searchBugNumber = function ($select) {
                if (!$select.search)
                    return null;

                projectTaskService.searchBugNo({ keyword: $select.search }).then(function (response) {
                    vm.bugNumbers = response.data.items;
                });
            };
            vm.searchTaskNumber = function ($select) {
                if (!$select.search)
                    return null;

                taskDetailService.searchTaskNo({ keyword: $select.search }).then(function (response) {
                    vm.taskNumbers = response.data.items;
                });
            };

            vm.getNameWithCompany = function (project) {
                return project.title + " (" + project.company.companyName + ")";
            };
            var myInterval = null;
            var tempRow = {};
            vm.assignUser = function (task) {

                task.isEnabled = true;
                setTimeout(function () {
                    $("#uiSelect_" + task.id + " span")[0].click();
                    tempRow = task;
                }, 100);
                myInterval = setInterval(vm.focsOut,1);
            }

            vm.focsOut = function () {

                    $("#uiSelect_" + tempRow.id + " input").focusout(function () {
                        clearInterval(myInterval);
                        setTimeout(function () {
                            tempRow.isEnabled = false;
                        }, 225);

                    });
            };

           

            vm.updateStatus = function (row, index) {
                //vm.loading = true;
                const ele = document.getElementById('row' + index);
                ele.remove();
                vm.taskLength -= 1;
                workspaceService.updateTaskStatus({ id: row.id}).success(function () {
                    
                    //vm.loading = false;
                });
                //row.status = 4;
                //workspaceService.updateTaskStatus(row);
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
                //vm.filters.organizationId = null;
                //if (vm.isOrganization == true) {
                //    vm.filters.userId = null;
                //    vm.filters.organizationId = vm.selectionId;

                //}
                //if (vm.filters.userId != null) {
                //    vm.filters.assignedToUserId = vm.filters.userId;
                //    vm.filters.organizationId = null;
                //}

                if (vm.allowDateRange) {
                    vm.filters.creationDateFrom = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.creationDateTo = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                else {
                    vm.filters.creationDateFrom = null;
                    vm.filters.creationDateTo = null;
                }
                if (vm.backLogFilter.team != null)
                    vm.getReleaseTask(vm.backLogFilter.team.id);
                else
                    vm.getReleaseTask(vm.backLogFilter.team);
                vm.getPriorityTask();
                taskDetailService.getBackLogTasks(vm.filters).success(function (data) {
                    vm.dueTaskData = data;
                    document.querySelectorAll('th i').forEach(i => i.attributes['class'].value = '');
                    vm.taskLength = vm.dueTaskData.length;
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


            // get ActiveRelease List for Dropdown
            vm.prepareReleaseChanged = function () {
                if (vm.prepareRelease === true) {
                    releaseService.getActiveReleasesForPD()
                        .success(function (data) {
                            if (data.length === 0) {
                                //vm.prepareRelease = false;
                                abp.notify.error('No Active Release');
                            }
                            else {
                                vm.activeReleases = data;
                                vm.activeRelease = data[0].id;
                                vm.releaseId = vm.activeRelease;
                            }
                        });
                }
            }

            vm.releaseDetail = function () {

                vm.loading = true;
                taskDetailService.getReleaseTasks(vm.releaseId)
                    .success(function (data) {
                        vm.release = data;
                        vm.released = vm.release.isReleased;

                    })
                    .finally(function () {
                        vm.loading = false;
                    });
            }
            vm.unCheckCriticalTask = function (taskId, critical) {
                //vm.loading = true;
                taskDetailService.updateTaskPriority({ key: taskId, value: critical })
                    .success(function () {
                        vm.getPriorityTask();
                    })
                    .finally(function () {
                        //vm.loading = false;
                    });
            }
            // Release Checkbox
            vm.addEditRelease = function (taskId, rowIndex) {
                vm.loading = true;
                taskDetailService.addRemoveRelease(taskId, vm.activeRelease, true, null)
                    .success(function () {
                        const t = vm.dueTaskData.find(x => x.id == taskId);
                        vm.dueTaskData.splice(vm.dueTaskData.indexOf(t), 1);

                        vm.getPriorityTask();
                        if (vm.backLogFilter.team != null)
                            vm.getReleaseTask(vm.backLogFilter.team.id);
                        else
                            vm.getReleaseTask(vm.backLogFilter.team);

                        abp.notify.success(app.localize('Release Marked Successfully!'));
                    })
                    .error(function (err) {
                        if (err && err.message) {
                            $timeout(function () {
                                vm.dueTaskData[rowIndex].hasReleaseId = false;
                            }, 0);
                        }
                    })
                    .finally(function () {
                        vm.loading = false;
                    });
            };

            vm.openProjectTasksModal = function (row) {
                if (row.type == 'Project') {
                    $uibModal.open({
                        templateUrl: '~/App/host/views/cbs/projectsDashboard/projectTasks.cshtml',
                        controller: 'host.views.cbs.projectsDashboard.projectTasks as vm',
                        backdrop: 'static',
                        size: 'xl',
                        resolve: {
                            project: function () {
                                return {

                                    id: row.projectId,
                                    company: null,
                                    tasks: [],
                                    crHours: row.crHours

                                };
                            },
                            prepareRelease: vm.prepareRelease,
                            releaseId: vm.activeRelease,
                            workspaceId: null,
                            isInitiateFromCase: null
                        }
                    });
                }
                else if (row.type == 'Bug') {
                    editProjectTaskModal(row);
                }
                else if (row.type.indexOf('Change') > -1 || row.type == 'Project/CR') {
                    {
                        $uibModal.open({
                            templateUrl: '~/App/host/views/cbs/projectsDashboard/projectTasks.cshtml',
                            controller: 'host.views.cbs.projectsDashboard.projectTasks as vm',
                            backdrop: 'static',
                            size: 'xl',
                            resolve: {
                                project: function () {
                                    return {
                                        changeRequestId: row.supportRequestId,
                                        id: null,
                                        company: null,
                                        tasks: []
                                    };
                                },
                                prepareRelease: vm.prepareRelease,
                                releaseId: vm.activeRelease,
                                workspaceId: null,
                                isInitiateFromCase: null
                            }
                        });
                    }
                }
                else if (row.supportRequestId || row.type == 'Change Request') {
                    $uibModal.open({
                        templateUrl: '~/App/host/views/cbs/projectsDashboard/changeRequestProjectTaskModal.cshtml',
                        controller: 'host.views.cbs.projectsDashboard.changeRequestProjectTaskModal as vm',
                        backdrop: 'static',
                        size: 'xl',
                        resolve: {
                            changeRequest: function () {
                                return {
                                    id: row.supportRequestId,
                                    reqNo: row.taskFromNo
                                };
                            },
                            releaseId: null
                        }
                    });
                }

            }



            vm.getPriorityTask = function () {
                vm.loading = true;
                taskDetailService.getPriorityTask()
                    .success(function (data) {
                        vm.priorityTaskData = data;
                    })
                    .finally(function () {
                        vm.loading = false;
                    });
            }

            vm.getReleaseTask = function (id) {
                vm.loading = true;
                //debugger;
                taskDetailService.getBackLogSummary(vm.filters.teamId)
                    .success(function (data) {
                        //vm.prepareReleaseChanged();
                        vm.releaseTaskData = data;
                        data.forEach(x => {
                            const plannedDate = moment(x.plannedDate);
                            const releaseDate = moment(x.releaseDate); 
                            x.showPlannedDate = plannedDate.isValid() && releaseDate.isValid() && !releaseDate.isSame(plannedDate, 'day');

                            vm.totalActiveReleaseTaskCount += x.taskCount;
                            vm.totalInCompletedTaskCount += x.completedTask;
                            vm.totalInCompletedTaskCount += x.inCompletedTask;
                        });
                    })
                    .finally(function () {
                        vm.loading = false;
                    });
            }

            vm.viewReleaseTasks = function (id) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/release/viewReleaseTasks.cshtml',
                    controller: 'host.views.cbs.release.viewReleaseTasks as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        releaseId: id
                    }
                });

                modalInstance.result.then(function () {
                    debugger;
                    vm.getPriorityTask();
                    vm.getReleaseTask(vm.filters.teamId);
                    vm.getDueTasks();
                });
            };

            const getCellValue = (tr, idx) => {
                let text = tr.children[idx].innerText || tr.children[idx].textContent;
                if (text.indexOf('-') > -1) {
                    text = moment(text, 'DD-MMM-YY').format('YYMMDD');
                }

                return text;
            }

            const comparer = (idx, asc) => (a, b) => ((v1, v2) =>
                v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)
            )(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));

            // do the work...
            document.querySelectorAll('th').forEach(th => th.addEventListener('click', () => {
                document.querySelectorAll('th i').forEach(i => i.attributes['class'].value = '');
                const table = th.closest('table');
                const tbody = table.querySelector('tbody');
                Array.from(tbody.querySelectorAll('tr'))
                    .sort(comparer(Array.from(th.parentNode.children).indexOf(th), this.asc = !this.asc))
                    .forEach(tr => tbody.appendChild(tr));
                th.children[0].attributes['class'].value = this.asc ? 'fa fa-caret-up' : 'fa fa-caret-down';
            }));

            function init() {
                vm.prepareReleaseChanged();
                vm.loading = true;
                taskDetailService.getBackLogTasks({isApproved: true})
                    .success(function (data) {
                        vm.dueTaskData = data;
                        vm.taskLength = vm.dueTaskData.length;
                    })
                    .finally(() => {
                        vm.loading = false;
                    });
                vm.getPriorityTask();
                if (vm.backLogFilter.team != null)
                    vm.getReleaseTask(vm.backLogFilter.team.id);
                else
                    vm.getReleaseTask(vm.backLogFilter.team);
            }
            vm.searchTeams = function () {

                organizationUnitAppService.getTeams().then(function (response) {
                    vm.teams= response.data.items;
                });
            };
            vm.searchTeams();
            init();
        }
    ]);
