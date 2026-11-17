// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:194700-194857
appModule.controller('tenant.views.taskCategories.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.cRMCampaign', 'utilities', 'appSession',
        function ($scope, $uibModal, uiGridConstants, taskCategoryService, utilities, appSession) {
            var vm = this;
            vm.loading = false;
            vm.filters = {
                name: '',
                isActive: null,
                locationId: appSession.user.locationId,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
            };

            vm.permissions = {
                view: abp.auth.hasPermission('Pages.Tenant.TaskCategories'),
                create: abp.auth.hasPermission('Pages.Tenant.TaskCategories.Create'),
                edit: abp.auth.hasPermission('Pages.Tenant.TaskCategories.Edit'),
                'delete': abp.auth.hasPermission('Pages.Tenant.TaskCategories.Delete'),
                'export': abp.auth.hasPermission('Pages.Tenant.TaskCategories.Export'),
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
                            '      <li><a ng-if="grid.appScope.permissions.view && grid.appScope.locationPermission(row.entity)" ng-click="grid.appScope.viewCategory(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.view && grid.appScope.locationPermission(row.entity)" ng-click="grid.appScope.editCategory(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.edit && grid.appScope.locationPermission(row.entity)" ng-click="grid.appScope.deleteCategory(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('CategoryName'),
                        field: 'name',
                        cellTemplate: '<div class="ui-grid-cell"><div class="ui-grid-cell-contents">{{row.entity.name}}</div></div>'
                    },
                    {
                        name: app.localize('Description'),
                        field: 'description',
                        cellTemplate: '<div class="ui-grid-cell"><div class="ui-grid-cell-contents">{{row.entity.description}}</div></div>'
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
                        vm.getCategories();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;
                        vm.getCategories();
                    });
                },
                data: [
                    { id: 1, name: 'General', description: 'General tasks', isActive: true },
                    { id: 2, name: 'Administrative', description: 'Administrative duties', isActive: true },
                    { id: 3, name: 'Development', description: 'Development tasks', isActive: false },
                    { id: 4, name: 'Support', description: 'Support activities', isActive: true }
                ]
            };

            vm.getCategories = function () {
                vm.loading = true;
                // Simulate API call with dummy data for now
                var filteredData = vm.gridOptions.data.filter(function (category) {
                    return (!vm.filters.name || category.name.toLowerCase().includes(vm.filters.name.toLowerCase())) &&
                        (vm.filters.isActive === null || category.isActive === vm.filters.isActive);
                });
                vm.gridOptions.totalItems = filteredData.length;
                vm.gridOptions.data = filteredData.slice(vm.filters.skipCount, vm.filters.skipCount + vm.filters.maxResultCount);
                vm.loading = false;
            };

            vm.exportToExcel = function () {
                vm.loading = true;
                taskCategoryService.exportToExcel(vm.filters).success(function (result) {
                    app.downloadTempFile(result);
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function openCreateOrEditCategoryModal(categoryId, editFlag, viewFlag) {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/crm/tasks/taskCategories/createOrEditModal.cshtml',
                    controller: 'tenant.views.taskCategories.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        categoryId: function () { return categoryId; },
                        editFlag: function () { return editFlag; },
                        viewFlag: function () { return viewFlag; }
                    }
                }).result.then(function () {
                    vm.getCategories();
                });
            }

            vm.createCategory = function () {
                openCreateOrEditCategoryModal(null, false, false);
            };

            vm.editCategory = function (category) {
                openCreateOrEditCategoryModal(category.id, true, false);
            };

            vm.viewCategory = function (category) {
                openCreateOrEditCategoryModal(category.id, false, true);
            };

            vm.deleteCategory = function (category) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            taskCategoryService.deleteCategory({ id: category.id }).success(function () {
                                vm.getCategories();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            function init() {
                vm.getCategories();
            }
            init();
        }
    ]);
