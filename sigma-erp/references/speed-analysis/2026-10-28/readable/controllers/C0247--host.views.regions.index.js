// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:76103-76297
appModule.controller('host.views.regions.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.directory', 'abp.services.app.regions',
        function ($scope, $uibModal, uiGridConstants, directoryService, regionsAppService) {
            var vm = this;
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            vm.permissions = {
                create: abp.auth.hasPermission('Pages.CarRental.Dashboard.CreateCompany'),
                edit: abp.auth.hasPermission('Pages.CarRental.Dashboard.EditCompany'),
                delete: abp.auth.hasPermission('Pages.CarRental.Dashboard.DeleteCompany'),
            };
            var requestParams = {
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
                sorting: "name asc"
            };
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
                            '      <li><a ng-if="grid.appScope.permissions.edit" ng-click="grid.appScope.editRegion(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete" ng-click="grid.appScope.DeleteRegion(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Name'),
                        width: 400,
                        field: 'name'
                    },
                    {
                        name: app.localize('Countries'),
                        width: 400,
                        field: 'countries'
                    },
                    {
                        name: app.localize('SalesStaff'),
                        width: 400,
                        field: 'salesStaff'
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
                        vm.getRegion();
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
                regionsAppService.searchRegions({
                    Name: vm.filters.name, Countries: vm.filters.countries, SalesStaff: vm.filters.salesStaff, skipCount: requestParams.skipCount, maxResultCount: requestParams.maxResultCount, sorting: requestParams.sorting
                })
                    .then(function (data) {
                        if (data.data != null) {
                            vm.tenantGridOptions.totalItems = data.data.totalCount;
                            let allData = data.data.items;
                            let modifiedData = [];
                            for (let i = 0; i < allData.length; i++) {
                                modifiedData.push(allData[i]);
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
            vm.getRegion = function () {
                vm.loading = true;
                if (requestParams.sorting == null || requestParams.sorting == []) {
                    requestParams.sorting = "name asc"
                }
                vm.tenantGridOptions.data = [];
                regionsAppService.searchRegions({ skipCount: requestParams.skipCount, maxResultCount: requestParams.maxResultCount, sorting: requestParams.sorting }).then(function (data) {
                    vm.tenantGridOptions.totalItems = data.data.totalCount;
                    let allData = data.data.items;
                    let modifiedData = [];
                    for (let i = 0; i < allData.length; i++) {
                        modifiedData.push(allData[i]);
                    }
                    vm.tenantGridOptions.data = modifiedData;
                }).finally(function () {
                    vm.loading = false;
                }).catch(function (err) {
                    console.log(err);
                });
            };
            vm.addRegion = function (region) {
                var modalInstance = $uibModal.open({
                    templateUrl: '/App/host/views/regions/createOrEditModal.cshtml',
                    controller: 'host.views.regions.createOrEditModal as vm',
                    backdrop: 'static',
                    resolve: {
                        regionId: function () {
                            return null;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getRegion();
                });
            };
            vm.editRegion = function (region) {
                var modalInstance = $uibModal.open({
                    templateUrl: '/App/host/views/regions/createOrEditModal.cshtml',
                    controller: 'host.views.regions.createOrEditModal as vm',
                    backdrop: 'static',
                    resolve: {
                        regionId: function () {
                            return region.id;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getRegion();
                });
            };
            vm.DeleteRegion = function (region) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', ''),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            vm.loading = true;
                            regionsAppService.deleteRegion(region.id)
                                .then(function (data) {
                                    if (data.data[0].speedId) {
                                        directoryService.updatePublishedEntity(data.data[0].speedId, "".toString())
                                        abp.notify.info(app.localize('RecordDeleted.'));
                                    }
                                }).finally(function () {
                                    vm.loading = false;
                                    vm.getRegion();
                                });
                        }
                    }
                );
            };
            function init() {
                vm.getRegion();
            }
            init();
        }
    ]);
