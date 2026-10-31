// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:436547-436763
appModule.controller('tenant.views.hrm.department.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.department',
        function ($scope, $uibModal, uiGridConstants, departmentService) {
            var vm = this;
            vm.filters;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.permissions = {
                create: abp.auth.hasPermission('Pages.HRM.Department.Create'),
                view: abp.auth.hasPermission('Pages.HRM.Department.View'),
                edit: abp.auth.hasPermission('Pages.HRM.Department.Edit'),
                delete: abp.auth.hasPermission('Pages.HRM.Department.Delete'),
            };
            var requestParams = {
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
                sorting: "name asc"
            };

            function convertEnumValueToName(value, enumArray) {
                const enumItem = enumArray.find(item => item.id === value);
                return enumItem ? enumItem.name : '';
            }

            vm.tenantGridOptions = {
                enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                paginationPageSizes: app.consts.grid.defaultPageSizes,
                enableColumnResizing: true,
                paginationPageSize: app.consts.grid.defaultPageSize,
                useExternalPagination: true,
                useExternalSorting: true,
                appScopeProvider: vm,
                rowTemplate: '<div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader}"  ui-grid-cell></div>',
                columnDefs: [
                    {
                        name: app.localize('Actions'),
                        enableSorting: false,
                        width: 115,
                        enableColumnResizing: false,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize('Actions') + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a ng-if="grid.appScope.permissions.edit" ng-click="grid.appScope.editDepartment(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete" ng-click="grid.appScope.DeleteDepartment(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Name'),
                        width: 300,
                        field: 'name'
                    },
                    {
                        name: app.localize('Description'),
                        width: 400,
                        field: 'description'
                    }
                ],

                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (!sortColumns.length || !sortColumns[0].field) {
                            requestParams.sorting = null;
                            console.log(sortColumns);
                        } else {
                            requestParams.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
                            console.log("Else Condition Sort :" + sortColumns[0].field + "Direction  :" + sortColumns[0].sort.direction + "Sort Length :" + sortColumns[0].length);
                            console.log("Sorting params :" + requestParams.sorting);
                        }
                        vm.getDepartments();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        requestParams.skipCount = (pageNumber - 1) * pageSize;
                        requestParams.maxResultCount = pageSize;
                        if (vm.filters != null) {
                            vm.searchItems(requestParams.skipCount, requestParams.maxResultCount);
                        }
                    });
                },
                data: []
            };
            vm.searchButtonCLick = function () {
                requestParams.skipCount = 0;
                requestParams.maxResultCount = 10;
                vm.tenantGridOptions.paginationCurrentPage = 1;
                vm.tenantGridOptions.paginationPageSize = 10;
                vm.searchItems();
            }
            vm.searchItems = function () {
                vm.loading = true;
                if (vm.filters == null) {
                    vm.filters = { isFeatured: false };
                }
                if (requestParams.sorting == null || requestParams.sorting == []) {
                    requestParams.sorting = "name asc"
                }
                departmentService.getDepartment({
                    Name: vm.filters.departmentName, skipCount: requestParams.skipCount, maxResultCount: requestParams.maxResultCount, sorting: requestParams.sorting
                }).then(function (data) {
                    if (data.data != null) {
                        vm.tenantGridOptions.totalItems = data.data.totalCount;
                        let datas = data.data.items;
                        let modifiedData = [];
                        for (let i = 0; i < datas.length; i++) {
                            modifiedData.push(datas[i]);
                        }
                        vm.tenantGridOptions.data = modifiedData;
                    }
                    else {
                        vm.tenantGridOptions.data = [];
                    }
                }).finally(function () {
                    vm.loading = false;
                });
            };
            vm.getDepartments = function () {
                vm.loading = true;
                if (requestParams.sorting == null || requestParams.sorting == []) {
                    requestParams.sorting = "name asc"
                }
                vm.tenantGridOptions.data = [];
                departmentService.getDepartment({ skipCount: requestParams.skipCount, maxResultCount: requestParams.maxResultCount, sorting: requestParams.sorting }).then(function (data) {
                    if (data.data != null) {
                        vm.tenantGridOptions.totalItems = data.data.totalCount;
                        let datas = data.data.items;
                        let modifiedData = [];
                        for (let i = 0; i < datas.length; i++) {
                            modifiedData.push(datas[i]);
                        }
                        vm.tenantGridOptions.data = modifiedData;
                    }
                    else {
                        vm.tenantGridOptions.data = [];
                    }
                }).finally(function () {
                    vm.loading = false;
                }).catch(function (err) {
                    console.log(err);
                });
            };
            vm.addDepartment = function (department) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/hrm/department/createOrEditModal.cshtml',
                    controller: 'tenant.views.hrm.department.createOrEditModal as vm',
                    backdrop: 'static',
                    resolve: {
                        departmentId: function () {
                            return null;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getDepartments();
                });
            };
            vm.viewDepartment = function (department) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/hrm/department/viewModal.cshtml',
                    controller: 'tenant.views.hrm.department.createOrEditModal as vm',
                    backdrop: 'static',
                    resolve: {
                        departmentId: function () {
                            return department.id;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getDepartments();
                });
            };
            vm.editDepartment = function (department) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/hrm/department/createOrEditModal.cshtml',
                    controller: 'tenant.views.hrm.department.createOrEditModal as vm',
                    backdrop: 'static',
                    resolve: {
                        departmentId: function () {
                            return department.id;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getDepartments();
                });
            };
            vm.DeleteDepartment = function (Department) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', ''),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            vm.loading = true;
                            departmentService.deleteDepartment(Department.id)
                                .then(function (data) {
                                    console.log("Department Deleted !!")
                                }).finally(function () {
                                    vm.loading = false;
                                    vm.getDepartments();
                                });
                        }
                    }
                );
            };

            function init() {
                vm.getDepartments();
            }
            init();
        }
    ]);
