// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:32334-33092
appModule.controller('host.views.cbs.bugs.index', [
        '$scope', '$uibModal', '$timeout', 'uiGridConstants', 'abp.services.app.user', 'appSession', 'abp.services.app.projectTask', 'abp.services.app.taskDetail', 'abp.services.app.release', 'abp.services.app.supportRequestHost', 'abp.services.app.dataEntryCorrectionHost', 'abp.services.app.customizationHost', 'utilities', 'abp.services.app.tenant',
        function ($scope, $uibModal, $timeout, uiGridConstants, userService, appSession, projectTaskService, taskDetailService, releaseService, supportRequestService, dataEntryCorrectionService, customizationService, utilities, tenantAppService) {
            var vm = this;  
            var isSupportPermission = abp.auth.hasPermission('Pages.Support');
            vm.isManageRelease = abp.auth.hasPermission('Pages.CBS.Release.ManageRelease');
        

            vm.selectionName = null;
            vm.selectionId = null;
            vm.showOrganization = true;
            vm.canViewOtherTasks = true;
            vm.noOfBugs = 0;
            vm.isOrganization = false;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';


            vm.filters = {
                enableDateRange: true,
                startDate: null,
                endDate: null,
                assignedToUserId: null,
                tenantId: null
            };

            function initDate() {
                vm.dateRangeModel = {
                    startDate: moment().add(-29, 'days').startOf('day'),
                    endDate: moment().endOf('day')
                };
            }
            vm.searchTenants = function ($select) {
                if ($select.search == "")
                    return null;
                tenantAppService.searchTenants({ filter: $select.search }).then(function (response) {
                    vm.tenants = response.data.items;
                });
            };
            vm.dateRangeModelChanged = function () {
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
            };
            vm.dateRangeCheck = function () {
                if (vm.filters.enableDateRange) {
                    vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.startDate = null;
                    vm.filters.endDate = null;
                }
            };
            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                } else {
                    return "";
                }
            };

            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                } else {
                    return "";
                }
            };
            //Release Work
            vm.prepareRelease = true;
            vm.releaseId = 0;
            vm.activeReleases = 0;
            vm.activeRelease = 0;
            // get ActiveRelease List for Dropdown
            vm.prepareReleaseChanged = function () {
                if (vm.prepareRelease === true) {
                    releaseService.getActiveReleasesForPD()
                        .success(function (data) {
                            if (data.length === 0) {
                                vm.prepareRelease = false;
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
            // Add Remove Releases
            vm.addEditRelease = function (status, taskId, task) {
                taskDetailService.addRemoveRelease(taskId, vm.activeRelease, status, null).success(function (data) {
                        abp.notify.success(data);
                    })
                    .error(function (err) {
                        if (err && err.message) {
                            $timeout(function () {
                                task.hasReleaseId = !status;
                            }, 0);
                        }
                    })
                    .finally(function () {
                        vm.loading = false;
                    });
            };


            vm.permissions = {
                release: abp.auth.hasPermission('Pages.CBS.Release')
             
            };


            vm.statusChanged = function () {
                //if (vm.filters.status == 1)
                //    vm.filters.enableDateRange = false;
                //else
                //    vm.filters.enableDateRange = true;
            };

            vm.getStatus = function (id) {
                if (id == 1)
                    return "Open";
                else if (id == 2)
                    return "Closed";
                else return '';
            };
            function getStatuses() {
                vm.statuses = [{ id: 1, name: app.localize("Open") }, { id: 2, name: app.localize("Closed") }];
            };


            vm.deleteBug = function (task) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            projectTaskService.deleteBug({
                                id: task.id
                            }).success(function () {
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                                vm.getDueTasks();
                            });
                        }
                    }
                );
            };

            vm.reopenBug = function (task) {
                abp.message.confirm(
                    app.localize('ReOpenMessage'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            projectTaskService.reopenBug({
                                id: task.id
                            }).then(function () {
                                    
                                abp.notify.success("Bug Reopened Successfully");
                                vm.getDueTasks();
                            });
                        }
                    }
                );
            };

            vm.closeBug = function (id) {
                abp.message.confirm(
                    app.localize('CloseProjectWarningMessage'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            taskDetailService.closeBug({
                                id: id
                            }).success(function () {
                                abp.notify.success(app.localize('SuccessfullyClosed'));
                            });
                        }
                    }
                );
            };

            vm.multilineStringToHTML = (s) => utilities.multilineStringToHTML(s);
            vm.gridOptions = {
                enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                paginationPageSizes: app.consts.grid.defaultPageSizes,
                paginationPageSize: app.consts.grid.defaultPageSize,
                useExternalPagination: true,
                //useExternalSorting: true,
                appScopeProvider: vm,
                columnDefs: [
                    {
                        name: app.localize(' '),
                        enableSorting: false,
                        width: 55,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize(' ') + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a  ng-click="grid.appScope.editProjectTask(row.entity)">View or Edit</a></li>' +
                            '      <li><a  ng-click="grid.appScope.openmanageTaskModal(row.entity)">Assign</a></li>' +
                            '      <li><a  ng-if ="(row.entity.releaseId && row.entity.releaseId!=grid.appScope.releaseId)" ng-click="grid.appScope.reopenBug(row.entity)">Reopen</a></li>' +
                            '      <li><a  ng-click="grid.appScope.deleteBug(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '      <li><a  ng-click="grid.appScope.closeBug(row.entity.id)">Close</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: 'BugNo',
                        field: 'taskNo',
                        width: 80,
                    },
                    {
                        name: 'CreationDate',
                        field: 'creationTime',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDate(row.entity.creationTime)}}</div>' +
                            '</div>'
                    },
                    {
                        name: 'Title',
                        field: 'title',
                        width: 400,
                    },
                    //{
                    //    name: 'Creator',
                    //    field: 'creatorUserName'
                    //},
                    //{
                    //    name: 'Reported By',
                    //    field: 'reportedByUserName'
                    //},
                    {
                        name: 'Assigned To',
                        field: 'assignedToUserName'
                    },
                    {
                        name: 'Tenant',
                        field: 'tenancyName'
                    },
                    {
                        name: 'Stage',
                        field: 'taskStage.name'
                    },
                    {
                        name: app.localize('Status'),

                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '<span ng-if=\"row.entity.status==1\" class=\"label label-success\" style=\"background-color: #bac3d0\">{{grid.appScope.getTaskStatus(row.entity.status)}}</span>' +
                            '<span ng-if=\"row.entity.status==2\" class=\"label label-success\" style=\"background-color: #ed6b75\">{{grid.appScope.getTaskStatus(row.entity.status)}}</span>' +
                            '<span ng-if=\"row.entity.status==3\" class=\"label label-success\" style=\"background-color: #659be0\">{{grid.appScope.getTaskStatus(row.entity.status)}}</span>' +
                            '<span ng-if=\"row.entity.status==4\" class=\"label label-success\" style=\"background-color: #26C281\">{{grid.appScope.getTaskStatus(row.entity.status)}}</span>' +
                            '<span ng-if=\"row.entity.status==6\" class=\"label label-success\" style=\"background-color: #FFA500\">{{grid.appScope.getTaskStatus(row.entity.status)}}</span>' +
                            '</div>'
                    },
                    {
                        name: 'Release',
                        cellTemplate: '<div class=\"md-checkbox-list\">' +
                            '<div class=\"md-checkbox\">' +
                            '<input id=\"cb_{{row.entity.id}}\" class=\"md-check\" type=\"checkbox\" style=\"color:red;\"  name=\"cb_{{row.entity.id}}\" ng-disabled=\"row.entity.releaseId && row.entity.releaseId!=grid.appScope.releaseId || !grid.appScope.prepareRelease\" ng-change=\"grid.appScope.addEditRelease(row.entity.hasReleaseId,row.entity.id, row.entity)\" ng-model=\"row.entity.hasReleaseId\">' +
                            '<label for=\"cb_{{row.entity.id}}\">' +
                            '<span class=\"inc\"></span>' +
                            '<span class=\"check\"></span>' +
                            '<span class=\"box\"></span>' +
                            '</label>' +
                            '</div>' +
                            '</div>',
                        visible: vm.isManageRelease
                    },
                    {
                        name: 'Release Id',
                        field: 'releaseId'
                    },
                    {
                        name: 'ExpectedDate',
                        field: 'endDate',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDate(row.entity.endDate)}}</div>' +
                            '</div>'
                    }

                ],

                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (!sortColumns.length || !sortColumns[0].field) {
                            vm.filters.sorting = null;
                        } else {
                            vm.filters.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
                        }

                        vm.getDueTasks();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getDueTasks();
                    });
                },
                data: []
            };

            vm.loading = false;
            vm.filters = {
                unAllocatedBugs: false,
                status: 1,
                //userId: appSession.user.id,
              //  user: appSession.user,
                taskStatusesArray:
                    [
                        { id: 1, name: 'New' },
                        { id: 2, name: 'TBD' },
                        { id: 3, name: 'In Progress' }
                    ],
                assignedToUserId: null,
                taskStatus: 1,
                maxResultCount: app.consts.grid.defaultPageSize,
            };
            vm.clearSelection = function () {
                vm.selectionName = null;
                vm.selectionId = null;
            };
            vm.openEditAssignToUserModal = function (task) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/bugs/editAssignToUserModal.cshtml',
                    controller: 'host.views.cbs.bugs.createOrEditProjectTaskModal as vm',
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

            vm.taskStatuses =
                [
                    { id: 1, name: 'New' },
                    { id: 2, name: 'TBD' },
                    { id: 3, name: 'In Progress' },
                    { id: 4, name: 'Completed' },
                    { id: 6, name: 'Reopen'}
                ];
            vm.openCreateProjectTaskModal = function (projectId, parentTaskId, taskId, addAboveOrBelowTask, selectTaskId) {
                let index = null;
                let parent = null;


                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/bugs/createOrEditProjectTaskModal.cshtml',
                    controller: 'host.views.cbs.bugs.createOrEditProjectTaskModal as vm',
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
                        },
                        supportRequestid: null
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
                else if (status == 6) return 'Reopen';
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
                    templateUrl: '~/App/host/views/cbs/bugs/viewOrEditProjectTaskModal.cshtml',
                    controller: 'host.views.cbs.bugs.createOrEditProjectTaskModal as vm',
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
                        },
                        supportRequestid: null
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

                    }
                });
            };
            vm.getDueTasks = function () {
                //vm.activeReleases = 0;
              //  vm.prepareRelease = true;
                vm.loading = true;
                vm.totalTaskNumbers = 0;

                vm.filters.taskStatuses = [];
                if (vm.filters.taskStatusesArray.length > 0) {
                    angular.forEach(vm.filters.taskStatusesArray, function (value) {
                        vm.filters.taskStatuses.push(value.id);
                    });
                }

                if (!vm.filters.enableDateRange) {
                    vm.filters.startDate = null;
                    vm.filters.endDate = null;
                }
                else {
                    vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
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

                projectTaskService.getBugs(vm.filters).success(function (data) {
                    vm.noOfBugs = data.totalCount;
                    vm.gridOptions.data = data.items;
                    vm.gridOptions.totalItems = data.totalCount;
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
                initDate();
                vm.prepareReleaseChanged();
                vm.getDueTasks();
                getStatuses();

            }

            init();
        }
    ]);
