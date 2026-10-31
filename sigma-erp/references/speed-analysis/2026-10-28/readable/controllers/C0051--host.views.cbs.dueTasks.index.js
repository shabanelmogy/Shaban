// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:34166-34978
appModule.controller('host.views.cbs.dueTasks.index', [
        '$scope', '$timeout', '$uibModal', 'abp.services.app.user', 'appSession', 'abp.services.app.projectTask', 'abp.services.app.taskDetail', 'abp.services.app.release', 'abp.services.app.supportRequestHost', 'abp.services.app.dataEntryCorrectionHost', 'abp.services.app.customizationHost', 'utilities','abp.services.app.timeSheetReport',
        function ($scope, $timeout, $uibModal, userService, appSession, projectTaskService, taskDetailService, releaseService, supportRequestService, dataEntryCorrectionService, customizationService, utilities, timeSheetReportService) {
            var isSupportPermission = abp.auth.hasPermission('Pages.Support');

            var vm = this;
            vm.loading = false;
            vm.taskDetailLogs = [];
            vm.multilineStringToHTMLWordBreak = (s) => utilities.multilineStringToHTMLWordBreak(s);
            // User Dropdown
            vm.canViewOtherTasks = true;
            //Orgaization
            vm.selectionName = null;
            vm.selectionId = null;
            vm.showOrganization = true;
            vm.isOrganization = false;
            // Releases
            vm.prepareRelease = true;
            vm.releaseId = 0;
            vm.activeReleases = null;
            vm.activeRelease = null;


            //Page permission
            vm.permissions = {
                manageRelease: abp.auth.hasPermission('Pages.CBS.Release.ManageRelease'),
                release: abp.auth.hasPermission('Pages.CBS.Release')
            };

            //Add New Task
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

            // Get All Tasks when page Reload.
            vm.getDueTasks = function () {
                vm.loading = true;
                //vm.activeReleases = null;
                vm.filters.organizationId = null;
                vm.filters.taskStatuses = [];

                if (vm.filters.taskStatusesArray.length > 0) {
                    angular.forEach(vm.filters.taskStatusesArray, function (value) {
                        vm.filters.taskStatuses.push(value.id);
                    });
                }
                if (vm.isOrganization == true) {
                    vm.filters.userId = null;
                    vm.filters.organizationId = vm.selectionId;
                    vm.filters.assignedToUserId = null;
                }
                if (vm.filters.userId != null) {
                    vm.filters.assignedToUserId = vm.filters.userId;
                    vm.filters.organizationId = null;
                }
                if (isSupportPermission) {
                    supportRequestService.getSRForDueTask(vm.filters).success(function (data) {
                        vm.allUserData = data.items;
                    }).finally(function () {

                    });
                }
                projectTaskService.getDueTasksTeamLead(vm.filters).success(function (data) {
                    vm.dueTaskData = data;
                    if (vm.selectionId != null || vm.selectionId != undefined)
                    {
                        vm.organizationtasks = vm.dueTaskData.filter(x => x.organizationUnitId == vm.selectionId).length;
                    }
                }).finally(function () {
                    vm.loading = false;
                });
            };

            // Get User's work per Hours weekly(Timesheet)
            vm.getUserWorkingHoursWeekly = function () {
                vm.loading = true;
                vm.filters.organizationId = null;
                if (vm.isOrganization == true) {
                    vm.filters.userId = null;
                    vm.filters.organizationId = vm.selectionId;
                }
                if (vm.filters.userId != null) {
                    vm.filters.assignedToUserId = vm.filters.userId;
                    vm.filters.organizationId = null;
                }
                timeSheetReportService.getUserWorkingHours(vm.filters).success(function (result) {
                    vm.taskDetailLogs = [];
                    result.forEach(function (item, index) {
                        vm.taskDetailLogs.push({ day: item.day, endDate: item.endDate, hours: item.hours, startDate: item.startDate, startDateinString: item.startDateinString, userId: item.userId });
                    });
                    vm.loading = false;
                });
            };
            vm.refresh = function () {
                vm.loading = true;
                vm.getDueTasks();
                vm.getUserWorkingHoursWeekly();
                vm.loading = false;
            };

            vm.clearSelection = function () {
                vm.selectionName = null;
                vm.selectionId = null;
                vm.filters.user = appSession.user;
                vm.filters.userId = appSession.user.id;
                vm.isOrganization = false;
                vm.getUserWorkingHoursWeekly();
                vm.getDueTasks();
            };

            // Get All Users When Page Reload
            vm.getAllUsersData = function () {
                userService.getAllUsers({}).success(function (data) {
                    vm.allUsers = data.items;
                });
            };
            vm.searchUsers = function ($select) {
                if ($select.search == "")
                    return null;

                userService.searchScopeUsers({ keyword: $select.search }).then(function (response) {
                    vm.users = response.data.items;
                });
            };
            vm.clearUser = function () {
                vm.loading = true;
                vm.selectionName = null;
                vm.selectionId = null;
                vm.filters.user = appSession.user;
                vm.filters.userId = appSession.user.id;
                vm.isOrganization = false;
                vm.getDueTasks();
                vm.getUserWorkingHoursWeekly();
                vm.loading = false;

            };

           

            vm.ViewTasks = function (startdate, enddate, userId, hours) {
                if (hours> 0) {
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/host/views/cbs/timeSheetReport/ViewDailyWorkingHours.cshtml',
                        controller: 'host.views.cbs.timeSheetReport.ViewDailyWorkingHours as vm',
                        backdrop: 'static',
                        size: 'lg',
                        resolve:
                        {
                            startdate: function () {
                                return startdate;
                            },
                            enddate: function () {
                                return enddate;
                            },
                            userId: function () {
                                return userId;
                            },

                        }
                    });
                    modalInstance.result.then(function () {
                        vm.taskDetailLogs = [];
                        vm.getUserWorkingHoursWeekly();
                        vm.refresh();
                    });
                }
             };

            vm.searchOrganizationContactPopup = function () {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/dueTasks/searchOrganizationUnitContactModal.cshtml',
                    controller: 'host.views.cbs.dueTasks.searchOrganizationUnitContactModal as vm',
                    backdrop: 'static',
                    size: 'lg'
                });
                modalInstance.result.then(function (result) {
                    if (result) {
                        vm.selectionId = result.id;
                        vm.selectionName = result.name;
                        vm.isOrganization = result.isOrganization;
                        if (vm.isOrganization == true) {
                            vm.getDueTasks();
                            vm.getUserWorkingHoursWeekly();
                            vm.filters.userId = vm.selectionId;
                            vm.filters.user = { id: vm.selectionId, name: result.name };
                        }
                        else {
                            vm.filters.userId = vm.selectionId;
                            vm.filters.user = { id: vm.selectionId, name: result.name };
                            vm.getDueTasks();
                            vm.getUserWorkingHoursWeekly();
                        }

                    }

                });
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

            //Input Filters
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
            vm.taskStatuses =
                [
                    { id: 1, name: 'New' },
                    { id: 2, name: 'TBD' },
                    { id: 3, name: 'In Progress' },
                    { id: 4, name: 'Completed' }
                ];

             

            // Add Remove Releases
            vm.addEditRelease = function (status, row) {
                vm.loading = true;

                taskDetailService.addRemoveRelease(row.id, vm.activeRelease, status, null)
                    .success(function () {
                        abp.notify.success(app.localize('Release Marked Successfully!'));
                        vm.getDueTasks();
                    })
                    .error(function (err) {
                        if (err && err.message) {
                            $timeout(function () {
                                row.hasReleaseId = !status;
                            }, 0);
                        }
                    })
                    .finally(function () {
                        vm.loading = false;
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
                    vm.getDueTasks();
                });
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
                }).finally(function () {
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
            vm.openProjectTasksModal = function (row) {
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
                        vm.getUserWorkingHoursWeekly();

                    }
                });
            };
          
            vm.userSelectionChanged = function () {
                vm.isOrganization = false;
                vm.filters.userId = vm.filters.user.id;
                vm.getDueTasks();
                vm.getUserWorkingHoursWeekly();
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
                vm.prepareReleaseChanged();
                vm.getAllUsersData();
                vm.getDueTasks();
                vm.getUserWorkingHoursWeekly();
            }
            init();
        }
    ]);
