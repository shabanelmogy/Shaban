// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:58870-59038
appModule.controller('host.views.cloud.db.index', [
        '$scope', '$uibModal', 'abp.services.app.productAdon', 'uiGridConstants', 'abp.services.app.hostProduct', 'abp.services.app.regions', 'abp.services.app.country', 'abp.services.app.cloud', 'abp.services.app.businessDivision',
        function ($scope, $uibModal, productAdonService, uiGridConstants, productService, regionsAppService, countryService, cloudService, businessDivisionService) {
            var vm = this;
            vm.createDB = function () {
                openCreateOrEditDBModal(null);
            };
            vm.editDB = function (row) {
                openCreateOrEditDBModal(row.id);
            };
            vm.filters = {
                name: '',
                poolName: '',
                divisionId: '',
                dbServerId: '',
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
                sorting: null
            };

            vm.getDBServers = function () {
                vm.loading = true;
                cloudService.getDBServers().success(function (data) {
                    vm.dbServers = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            }
            vm.permissions = {
                create: abp.auth.hasPermission('Pages.Cloud.DB.Add'),
                edit: abp.auth.hasPermission('Page.Cloud.DB.Edit'),
                'delete': abp.auth.hasPermission('Page.Cloud.DB.Delete')
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
                        width: 115,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize('Actions') + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li ng-if="grid.appScope.permissions.edit"><a  ng-click="grid.appScope.editDB(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li ng-if="grid.appScope.permissions.delete"><a ng-click="grid.appScope.deleteDB(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +

                            '</div>'
                    },
                    {
                        name: app.localize('Name'),
                        field: 'name'
                    },
                    {
                        name: app.localize('PoolName'),
                        field: 'poolName'
                    },
                    {
                        name: app.localize('Division'),
                        field: 'division.code'
                    },
                    {
                        name: app.localize('MaxTenants'),
                        field: 'maxTenants'
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
                        vm.getDB();

                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;
                        vm.getDB();

                    });
                },
                data: []
            };
            vm.deleteDB = function (row) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', ''),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            vm.loading = true;
                            cloudService.deleteDB(row.id)
                                .then(function (data) {
                                    abp.notify.success(app.localize('SuccessfullyDeleted'));
                                }).finally(function () {
                                    vm.loading = false;
                                    vm.getDB();
                                    vm.getPools();
                                });
                        }
                    }
                );
            };
            function openCreateOrEditDBModal(id) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cloud/db/createOrEditDBModal.cshtml',
                    controller: 'host.views.cloud.db.createOrEditDBModal as vm',
                    backdrop: 'static',
                    resolve: {
                        dbId: function () {
                            return id;
                        }
                     
                    }
                });

                modalInstance.result.then(function () {
                    vm.getDB();
                    vm.getPools();
                });
            }
           
            vm.getDB = function () {
                vm.loading = true;
                cloudService.getDB(vm.filters).success(function (data) {
                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };
            function init() {
                vm.getDB();
                
            }
            vm.getbusinessDivisions = function () {
                vm.loading = true;
                businessDivisionService.getBusinessDivisions().success(function (data) {
                    vm.businessDivisions = data.items
                }).finally(function () {
                    vm.loading = false;
                });
            }
            vm.getPools = function () {
                vm.loading = true;
                cloudService.getDBPools().success(function (data) {
                    vm.dbPools = data.items
                }).finally(function () {
                    vm.loading = false;
                });
            }
            vm.getbusinessDivisions();
            vm.getDBServers();
            vm.getPools();
            init();
        }
    ]);
