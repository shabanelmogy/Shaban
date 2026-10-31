// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:195040-195216
appModule.controller('tenant.views.taskMaster.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.cRMCampaign', 'utilities', 'appSession',
        function ($scope, $uibModal, uiGridConstants, taskService, utilities, appSession) {
            var vm = this;
            vm.loading = false;
            vm.filters = {
                name: '',
                category: '',
                type: '',
                isApprovalRequired: null,
                isActive: null,
                locationId: appSession.user.locationId,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
            };

            vm.categories = ['General', 'Administrative', 'Development', 'Support']; // Dummy categories
            vm.types = ['Routine', 'Urgent', 'Project', 'Maintenance']; // Dummy types

            vm.permissions = {
                view: abp.auth.hasPermission('Pages.Tenant.TaskMaster'),
                create: abp.auth.hasPermission('Pages.Tenant.TaskMaster.Create'),
                edit: abp.auth.hasPermission('Pages.Tenant.TaskMaster.Edit'),
                'delete': abp.auth.hasPermission('Pages.Tenant.TaskMaster.Delete'),
                'export': abp.auth.hasPermission('Pages.Tenant.TaskMaster.Export'),
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
                            '      <li><a ng-if="grid.appScope.permissions.view && grid.appScope.locationPermission(row.entity)" ng-click="grid.appScope.viewTask(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.view && grid.appScope.locationPermission(row.entity)" ng-click="grid.appScope.editTask(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.edit && grid.appScope.locationPermission(row.entity)" ng-click="grid.appScope.deleteTask(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('TaskName'),
                        field: 'name',
                        cellTemplate: '<div class="ui-grid-cell"><div class="ui-grid-cell-contents">{{row.entity.name}}</div></div>'
                    },
                    {
                        name: app.localize('TaskCategory'),
                        field: 'category',
                        cellTemplate: '<div class="ui-grid-cell"><div class="ui-grid-cell-contents">{{row.entity.category}}</div></div>'
                    },
                    {
                        name: app.localize('TaskType'),
                        field: 'type',
                        cellTemplate: '<div class="ui-grid-cell"><div class="ui-grid-cell-contents">{{row.entity.type}}</div></div>'
                    },
                    {
                        name: app.localize('IsApprovalRequired'),
                        field: 'isApprovalRequired',
                        cellTemplate: '<div class="ui-grid-cell"><div class="ui-grid-cell-contents">{{row.entity.isApprovalRequired ? "Yes" : "No"}}</div></div>'
                    },
                    {
                        name: app.localize('IsActive'),
                        field: 'isActive',
                        cellTemplate: '<div class="ui-grid-cell"><div class="ui-grid-cell-contents">{{row.entity.isActive ? "Yes" : "No"}}</div></div>'
                    }
                ],
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        vm.filters.sorting = sortColumns.length && sortColumns[0].field ? sortColumns[0].field + ' ' + sortColumns[0].sort.direction : null;
                        vm.getTasks();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;
                        vm.getTasks();
                    });
                },
                data: [
                    { id: 1, name: 'Prepare Report', category: 'Administrative', type: 'Routine', isApprovalRequired: true, isActive: true },
                    { id: 2, name: 'Fix Bug #123', category: 'Development', type: 'Urgent', isApprovalRequired: false, isActive: true },
                    { id: 3, name: 'Team Meeting', category: 'General', type: 'Project', isApprovalRequired: false, isActive: false },
                    { id: 4, name: 'Update Website', category: 'Support', type: 'Maintenance', isApprovalRequired: true, isActive: true }
                ]
            };

            vm.getTasks = function () {
                vm.loading = true;
                // Simulate API call with dummy data for now
                var filteredData = vm.gridOptions.data.filter(function (task) {
                    return (!vm.filters.name || task.name.toLowerCase().includes(vm.filters.name.toLowerCase())) &&
                        (!vm.filters.category || task.category === vm.filters.category) &&
                        (!vm.filters.type || task.type === vm.filters.type) &&
                        (vm.filters.isApprovalRequired === null || task.isApprovalRequired === vm.filters.isApprovalRequired) &&
                        (vm.filters.isActive === null || task.isActive === vm.filters.isActive);
                });
                vm.gridOptions.totalItems = filteredData.length;
                vm.gridOptions.data = filteredData.slice(vm.filters.skipCount, vm.filters.skipCount + vm.filters.maxResultCount);
                vm.loading = false;
            };

            vm.exportToExcel = function () {
                vm.loading = true;
                taskService.exportToExcel(vm.filters).success(function (result) {
                    app.downloadTempFile(result);
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function openCreateOrEditTaskModal(taskId, editFlag, viewFlag) {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/crm/tasks/taskMaster/createOrEditModal.cshtml',
                    controller: 'tenant.views.taskMaster.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        taskId: function () { return taskId; },
                        editFlag: function () { return editFlag; },
                        viewFlag: function () { return viewFlag; }
                    }
                }).result.then(function () {
                    vm.getTasks();
                });
            }

            vm.createTask = function () {
                openCreateOrEditTaskModal(null, false, false);
            };

            vm.editTask = function (task) {
                openCreateOrEditTaskModal(task.id, true, false);
            };

            vm.viewTask = function (task) {
                openCreateOrEditTaskModal(task.id, false, true);
            };

            vm.deleteTask = function (task) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            taskService.deleteTask({ id: task.id }).success(function () {
                                vm.getTasks();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            function init() {
                vm.getTasks();
            }
            init();
        }
    ]);
