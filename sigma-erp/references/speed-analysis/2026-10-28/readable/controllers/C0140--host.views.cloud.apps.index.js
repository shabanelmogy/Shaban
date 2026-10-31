// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:58651-58802
appModule.controller('host.views.cloud.apps.index', [
        '$scope', '$uibModal', 'uiGridConstants',  'abp.services.app.cloud',
        function ($scope, $uibModal, uiGridConstants,  cloudService) {
            var vm = this;
            vm.createApp = function () {
                openCreateOrEditAppModal(null);
            };
            vm.editApp = function (row) {
                openCreateOrEditAppModal(row.id);
            };
            vm.hostingTypes = [
                { id: 1, name: "Speed Cloud" },
                { id: 2, name: "External Cloud" },
            ];
            vm.filters = {
                url: '',
                hosting: 0,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
                sorting: null
            };

            vm.permissions = {
                create: abp.auth.hasPermission('Page.Cloud.Apps.Add'),
                edit: abp.auth.hasPermission('Page.Cloud.Apps.Edit'),
                'delete': abp.auth.hasPermission('Pages.Cloud.Apps.Delete')
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
                            '      <li ng-if="grid.appScope.permissions.edit"><a  ng-click="grid.appScope.editApp(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li ng-if="grid.appScope.permissions.delete"><a ng-click="grid.appScope.deleteApp(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +

                            '</div>'
                    },
                    {
                        name: app.localize('Url'),
                        field: 'url'
                    },
                    {
                        name: app.localize('Name'),
                        field: 'name'
                    },
                    {
                        name: app.localize('Hosting'),
                        field: 'hosting',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getHosting(row.entity.hosting)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Notes'),
                        field: 'notes'
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
                        vm.getApps();

                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;
                        vm.getApps();

                    });
                },
                data: []
            };
            vm.getHosting = function (id) {
                if (id==1)
                    return "Speed Cloud";
                else if (id==2)
                    return "External Cloud";

            };
            vm.deleteApp = function (row) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', ''),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            vm.loading = true;
                            cloudService.deleteApp(row.id)
                                .then(function (data) {
                                    abp.notify.success(app.localize('SuccessfullyDeleted'));
                                }).finally(function () {
                                    vm.loading = false;
                                    vm.getApps();
                                });
                        }
                    }
                );
            };
            function openCreateOrEditAppModal(id) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cloud/apps/createOrEditAppsModal.cshtml',
                    controller: 'host.views.cloud.apps.createOrEditAppsModal as vm',
                    backdrop: 'static',
                    resolve: {
                        appId: function () {
                            return id;
                        }
                     
                    }
                });

                modalInstance.result.then(function () {
                    vm.getApps();
                });
            }
          
            vm.getApps = function () {
                vm.loading = true;
                cloudService.getApps(vm.filters).success(function (data) {
                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };
            function init() {
                vm.getApps();
                
            }
            init();
        }
    ]);
