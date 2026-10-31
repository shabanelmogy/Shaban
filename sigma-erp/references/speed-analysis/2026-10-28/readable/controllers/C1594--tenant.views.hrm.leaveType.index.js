// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:439745-440016
appModule.controller('tenant.views.hrm.leaveType.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.leaveType',
        function ($scope, $uibModal, uiGridConstants, leaveTypeService) {
            var vm = this;
            vm.filters;

            //enums
            vm.enumLeaveCategories = [
                { name: "Short Leave", id: 1 },
                { name: "Long Leave", id: 2 }
            ];
            vm.enumLeaveQuotaTypes = [
                { name: "Monthly", id: 1 },
                { name: "Quarterly", id: 2 },
                { name: "Yearly", id: 3 },
                { name: "Two Yearly", id: 4 },
                { name: "Occasional", id: 5 }
            ];
            vm.enumAccrualPeriod = [
                { name: "None", id: 0 },
                { name: "Date To Date", id: 1 },
                { name: "Calendar Month Or Year", id: 2 }
            ];
            vm.enumLeaveQuotaRules = [
                { name: "Start Of Period", id: 1 },
                { name: "End Of Period", id: 2 },
                { name: "Occasional For Staff", id: 3 }
            ];
            vm.enumLeaveStartFromOptions = [
                { name: "Date Of Joining", id: 1 },
                { name: "Date Of Confirmation", id: 2 }
            ];

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.permissions = {
                create: abp.auth.hasPermission('Pages.HRM.LeaveType.Create'),
                view: abp.auth.hasPermission('Pages.HRM.LeaveType.View'),
                edit: abp.auth.hasPermission('Pages.HRM.LeaveType.Edit'),
                delete: abp.auth.hasPermission('Pages.HRM.LeaveType.Delete'),
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
                useExternalPagination: false, // set false for leave type pagination
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
                            '      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.viewLeaveType(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.edit" ng-click="grid.appScope.editLeaveType(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete" ng-click="grid.appScope.DeleteLeaveType(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Type'),
                        width: 200,
                        field: 'name'
                    },
                    {
                        name: app.localize('Category'),
                        width: 200,
                        field: 'leaveCategory'
                    },
                    {
                        name: app.localize('QuotaType'),
                        width: 200,
                        field: 'leaveQuotaTypes'
                    },
                    {
                        name: app.localize('AccrualPeriod'),
                        width: 200,
                        field: 'accrualPeriod'
                    },
                    {
                        name: app.localize('QuotaRule'),
                        width: 200,
                        field: 'leaveQuotaRule',
                    },
                    {
                        name: app.localize('NoOfLeaves'),
                        width: 200,
                        field: 'noOfLeaves'
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
                        vm.getLeaveTypes();
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
                leaveTypeService.getLeaveType({
                    Name: vm.filters.leaveTypeName, leaveCategory: vm.filters.leaveCategory, leaveQuotaTypes: vm.filters.leaveQuotaTypes, accrualPeriod: vm.filters.accrualPeriod, leaveQuotaRule: vm.filters.leaveQuotaRule, leaveStartFrom: vm.filters.leaveStartFromOption, skipCount: requestParams.skipCount, maxResultCount: requestParams.maxResultCount, sorting: requestParams.sorting
                }).then(function (data) {
                    if (data.data != null) {
                        vm.tenantGridOptions.totalItems = data.data.totalCount;
                        let datas = data.data.items;
                        let modifiedData = datas.map(item => ({
                            ...item,
                            leaveCategory: convertEnumValueToName(item.leaveCategory, vm.enumLeaveCategories),
                            leaveQuotaTypes: convertEnumValueToName(item.leaveQuotaTypes, vm.enumLeaveQuotaTypes),
                            accrualPeriod: convertEnumValueToName(item.accrualPeriod, vm.enumAccrualPeriod),
                            leaveQuotaRule: convertEnumValueToName(item.leaveQuotaRule, vm.enumLeaveQuotaRules),
                            leaveStartFrom: convertEnumValueToName(item.leaveStartFrom, vm.enumLeaveStartFromOptions),
                        }));
                        vm.tenantGridOptions.data = modifiedData;
                    }
                    else {
                        vm.tenantGridOptions.data = [];
                    }
                }).finally(function () {
                    vm.loading = false;
                });
            };
            vm.getLeaveTypes = function () {
                vm.loading = true;
                if (requestParams.sorting == null || requestParams.sorting == []) {
                    requestParams.sorting = "name asc"
                }
                vm.tenantGridOptions.data = [];
                leaveTypeService.getLeaveType({ skipCount: requestParams.skipCount, maxResultCount: requestParams.maxResultCount, sorting: requestParams.sorting }).then(function (data) {
                    vm.tenantGridOptions.totalItems = data.data.totalCount;
                    let datas = data.data.items;
                    let modifiedData = datas.map(item => ({
                        ...item,
                        leaveCategory: convertEnumValueToName(item.leaveCategory, vm.enumLeaveCategories),
                        leaveQuotaTypes: convertEnumValueToName(item.leaveQuotaTypes, vm.enumLeaveQuotaTypes),
                        accrualPeriod: convertEnumValueToName(item.accrualPeriod, vm.enumAccrualPeriod),
                        leaveQuotaRule: convertEnumValueToName(item.leaveQuotaRule, vm.enumLeaveQuotaRules),
                        leaveStartFrom: convertEnumValueToName(item.leaveStartFrom, vm.enumLeaveStartFromOptions),
                    }));
                    vm.tenantGridOptions.data = modifiedData;
                }).finally(function () {
                    vm.loading = false;
                }).catch(function (err) {
                    console.log(err);
                });
            };
            vm.addLeaveType = function (LeaveType) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/hrm/leaveType/createOrEditModal.cshtml',
                    controller: 'tenant.views.hrm.leaveType.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        leaveTypeId: function () {
                            return null;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.searchItems();
                });
            };
            vm.viewLeaveType = function (leaveType) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/hrm/leaveType/viewModal.cshtml',
                    controller: 'tenant.views.hrm.leaveType.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        leaveTypeId: function () {
                            return leaveType.id;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.searchItems();
                });
            };
            vm.editLeaveType = function (leaveType) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/hrm/leaveType/createOrEditModal.cshtml',
                    controller: 'tenant.views.hrm.leaveType.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        leaveTypeId: function () {
                            return leaveType.id;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.searchItems();
                });
            };
            vm.DeleteLeaveType = function (LeaveType) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', ''),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            vm.loading = true;
                            leaveTypeService.deleteLeaveType(LeaveType.id)
                                .then(function (data) {
                                    /*console.log("LeaveType Deleted !!")*/
                                }).finally(function () {
                                    vm.loading = false;
                                    vm.searchItems();
                                });
                        }
                    }
                );
            };

            function init() {
                vm.searchItems();
                /*vm.getLeaveTypes();*/
            }
            init();
        }
    ]);
