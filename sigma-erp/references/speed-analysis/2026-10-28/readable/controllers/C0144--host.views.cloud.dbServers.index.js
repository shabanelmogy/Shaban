// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:59078-59207
appModule.controller('host.views.cloud.dbServers.index', [
        '$scope', '$uibModal', 'abp.services.app.productAdon', 'uiGridConstants', 'abp.services.app.hostProduct', 'abp.services.app.regions', 'abp.services.app.country', 'abp.services.app.cloud',
        function ($scope, $uibModal, productAdonService, uiGridConstants, productService, regionsAppService, countryService, cloudService) {
            var vm = this;
            vm.createDBServer = function () {
                openCreateOrEditDBServerModal(null);
            };
            vm.editDBServer = function (row) {
                openCreateOrEditDBServerModal(row.id);
            };
            vm.filters = {
                name: '',
                url: '',
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
                sorting: null
            };

            vm.permissions = {
                create: abp.auth.hasPermission('Pages.Cloud.DBServers.Add'),
                edit: abp.auth.hasPermission('Pages.Cloud.DBServers.Edit'),
                'delete': abp.auth.hasPermission('Pages.Cloud.DBServers.Delete')
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
                            '      <li ng-if="grid.appScope.permissions.edit"><a  ng-click="grid.appScope.editDBServer(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li ng-if="grid.appScope.permissions.delete"><a ng-click="grid.appScope.deleteDBServer(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +

                            '</div>'
                    },
                    {
                        name: app.localize('Name'),
                        field: 'name'
                    },
                    {
                        name: app.localize('URL'),
                        field: 'url'
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
                        vm.getDBServers();

                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;
                        vm.getDBServers();

                    });
                },
                data: []
            };
            vm.deleteDBServer = function (row) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', ''),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            vm.loading = true;
                            cloudService.deleteDBServer(row.id)
                                .then(function (data) {
                                    abp.notify.success(app.localize('SuccessfullyDeleted'));
                                }).finally(function () {
                                    vm.loading = false;
                                    vm.getDBServers();
                                });
                        }
                    }
                );
            };
            function openCreateOrEditDBServerModal(id) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cloud/DBServers/createOrEditDBServersModal.cshtml',
                    controller: 'host.views.cloud.dbServers.createOrEditDBServersModal as vm',
                    backdrop: 'static',
                    resolve: {
                        id: function () {
                            return id;
                        }
                     
                    }
                });

                modalInstance.result.then(function () {
                    vm.getDBServers();
                });
            }
           
            vm.getDBServers = function () {
                vm.loading = true;
                cloudService.getDBServersList(vm.filters).success(function (data) {
                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };
            function init() {
                vm.getDBServers();
                
            }
            init();
        }
    ]);
