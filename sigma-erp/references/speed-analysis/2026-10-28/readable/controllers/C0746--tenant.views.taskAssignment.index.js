// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:194441-194646
appModule.controller('tenant.views.taskAssignment.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.cRMCampaign', 'utilities', 'appSession',
        function ($scope, $uibModal, uiGridConstants, taskAssignmentService, utilities, appSession) {
            var vm = this;
            vm.loading = false;
            vm.filters = {
                taskNumber: '',
                startDate: '',
                endDate: '',
                statusFilter: '',
                taskMaster: '',
                status: '',
                user: null,
                resourceId: '',
                locationId: appSession.user.locationId,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
            };

            vm.taskMasters = [{ name: 'Task Master 1' }, { name: 'Task Master 2' }]; // Dummy data
            vm.statuses = ['Assigned', 'Started', 'Finished'];
            vm.users = [{ id: 1, name: 'User 1' }, { id: 2, name: 'User 2' }]; // Dummy data

            vm.permissions = {
                view: abp.auth.hasPermission('Pages.Tenant.TaskAssignment'),
                create: abp.auth.hasPermission('Pages.Tenant.TaskAssignment.Create'),
                edit: abp.auth.hasPermission('Pages.Tenant.TaskAssignment.Edit'),
                'delete': abp.auth.hasPermission('Pages.Tenant.TaskAssignment.Delete'),
                'export': abp.auth.hasPermission('Pages.Tenant.TaskAssignment.Export'),
                allActionsOnOtherBranch: abp.auth.hasPermission('Pages.Tenant.Customers.AllActionsOnOtherBranchCustomers'),
            };

            vm.locationPermission = function (row) {
                if (row.locationId && !vm.permissions.allActionsOnOtherBranch && row.locationId != appSession.user.locationId) {
                    return false;
                }
                return true;
            };

            vm.gridOptions = {
                enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                paginationPageSizes: app.consts.grid.defaultPageSizes,
                paginationPageSize: app.consts.grid.defaultPageSize,
                useExternalPagination: true,
                appScopeProvider: vm,
                columnDefs: [
                    {
                        name: app.localize('Actions'),
                        enableSorting: false,
                        width: 120,
                        cellTemplate:
                            '<div class="ui-grid-cell-contents">' +
                            '  <div class="btn-group dropdown" uib-dropdown dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle><i class="fa fa-cog"></i> ' + app.localize('Actions') + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a ng-if="grid.appScope.permissions.view && grid.appScope.locationPermission(row.entity)" ng-click="grid.appScope.viewAssignment(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.view && grid.appScope.locationPermission(row.entity)" ng-click="grid.appScope.editAssignment(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.edit && grid.appScope.locationPermission(row.entity)" ng-click="grid.appScope.deleteAssignment(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('TaskNumber'),
                        field: 'taskNumber',
                        cellTemplate: '<div class="ui-grid-cell"><div class="ui-grid-cell-contents">{{row.entity.taskNumber}}</div></div>'
                    },
                    {
                        name: app.localize('DateTime'),
                        field: 'dateTime',
                        cellTemplate: '<div class="ui-grid-cell"><div class="ui-grid-cell-contents">{{row.entity.dateTime}}</div></div>'
                    },
                    {
                        name: app.localize('Task'),
                        field: 'task',
                        cellTemplate: '<div class="ui-grid-cell"><div class="ui-grid-cell-contents">{{row.entity.task}}</div></div>'
                    },
                    {
                        name: app.localize('ResourceID'),
                        field: 'resourceId',
                        cellTemplate: '<div class="ui-grid-cell"><div class="ui-grid-cell-contents">{{row.entity.resourceId}}</div></div>'
                    },
                    {
                        name: app.localize('AssignedTo'),
                        field: 'assignedTo',
                        cellTemplate: '<div class="ui-grid-cell"><div class="ui-grid-cell-contents">{{row.entity.assignedTo}}</div></div>'
                    },
                    {
                        name: app.localize('AssignedBy'),
                        field: 'assignedBy',
                        cellTemplate: '<div class="ui-grid-cell"><div class="ui-grid-cell-contents">{{row.entity.assignedBy}}</div></div>'
                    },
                    {
                        name: app.localize('StartDateTime'),
                        field: 'startDateTime',
                        cellTemplate: '<div class="ui-grid-cell"><div class="ui-grid-cell-contents">{{row.entity.startDateTime}}</div></div>'
                    },
                    {
                        name: app.localize('FinishDateTime'),
                        field: 'finishDateTime',
                        cellTemplate: '<div class="ui-grid-cell"><div class="ui-grid-cell-contents">{{row.entity.finishDateTime}}</div></div>'
                    },
                    {
                        name: app.localize('Status'),
                        field: 'status',
                        cellTemplate:
                            '<div class="ui-grid-cell" ng-class="{\'status-\' + row.entity.status.toLowerCase(): true}">' +
                            '<div class="ui-grid-cell-contents">{{row.entity.status}}</div>' +
                            '</div>'
                    }
                ],
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        vm.filters.sorting = sortColumns.length && sortColumns[0].field ? sortColumns[0].field + ' ' + sortColumns[0].sort.direction : null;
                        vm.getAssignments();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;
                        vm.getAssignments();
                    });
                },
                data: [
                    { id: 1, taskNumber: 'T001', dateTime: '2025-06-30 14:26', task: 'Prepare Report', resourceId: 'R001', assignedTo: 'User 1', assignedBy: 'Admin', startDateTime: '2025-06-30 15:00', finishDateTime: '2025-07-01 17:00', status: 'Assigned' },
                    { id: 2, taskNumber: 'T002', dateTime: '2025-06-29 09:00', task: 'Fix Bug', resourceId: 'R002', assignedTo: 'User 2', assignedBy: 'Manager', startDateTime: '2025-06-29 10:00', finishDateTime: '2025-06-30 12:00', status: 'Started' },
                    { id: 3, taskNumber: 'T003', dateTime: '2025-06-28 13:00', task: 'Team Meeting', resourceId: 'R003', assignedTo: 'User 1', assignedBy: 'Admin', startDateTime: '2025-06-28 14:00', finishDateTime: '2025-06-28 16:00', status: 'Finished' }
                ]
            };

            vm.getAssignments = function () {
                vm.loading = true;
                // Simulate API call with dummy data for now
                var filteredData = vm.gridOptions.data.filter(function (assignment) {
                    return (!vm.filters.taskNumber || assignment.taskNumber.toLowerCase().includes(vm.filters.taskNumber.toLowerCase())) &&
                        (!vm.filters.startDate || !assignment.dateTime || new Date(assignment.dateTime) >= new Date(vm.filters.startDate)) &&
                        (!vm.filters.endDate || !assignment.dateTime || new Date(assignment.dateTime) <= new Date(vm.filters.endDate)) &&
                        (!vm.filters.statusFilter || assignment.status === vm.filters.statusFilter) &&
                        (!vm.filters.taskMaster || assignment.taskMaster === vm.filters.taskMaster) &&
                        (!vm.filters.status || assignment.status === vm.filters.status) &&
                        (!vm.filters.user || assignment.assignedTo === vm.filters.user.name) &&
                        (!vm.filters.resourceId || assignment.resourceId.toLowerCase().includes(vm.filters.resourceId.toLowerCase()));
                });
                vm.gridOptions.totalItems = filteredData.length;
                vm.gridOptions.data = filteredData.slice(vm.filters.skipCount, vm.filters.skipCount + vm.filters.maxResultCount);
                vm.loading = false;
            };

            vm.exportToExcel = function () {
                vm.loading = true;
                taskAssignmentService.exportToExcel(vm.filters).success(function (result) {
                    app.downloadTempFile(result);
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function openCreateOrEditAssignmentModal(assignmentId, editFlag, viewFlag) {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/crm/tasks/taskAssignment/createOrEditModal.cshtml',
                    controller: 'tenant.views.taskAssignment.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        assignmentId: function () { return assignmentId; },
                        editFlag: function () { return editFlag; },
                        viewFlag: function () { return viewFlag; }
                    }
                }).result.then(function () {
                    vm.getAssignments();
                });
            }

            vm.createAssignment = function () {
                openCreateOrEditAssignmentModal(null, false, false);
            };

            vm.editAssignment = function (assignment) {
                openCreateOrEditAssignmentModal(assignment.id, true, false);
            };

            vm.viewAssignment = function (assignment) {
                openCreateOrEditAssignmentModal(assignment.id, false, true);
            };

            vm.deleteAssignment = function (assignment) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            //taskAssignmentService.deleteAssignment({ id: assignment.id }).success(function () {
                            //    vm.getAssignments();
                            //    abp.notify.success(app.localize('SuccessfullyDeleted'));
                            //});
                        }
                    }
                );
            };

            function init() {
                vm.getAssignments();
            }
            init();
        }
    ]);
