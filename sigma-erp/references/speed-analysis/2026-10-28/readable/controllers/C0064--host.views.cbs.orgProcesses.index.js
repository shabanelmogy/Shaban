// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:36367-36540
appModule.controller('host.views.cbs.orgProcesses.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.orgProcess', 'appSession', 'utilities',
        function ($scope, $uibModal, uiGridConstants, orgProcessesService, appSession, utilities) {
            var vm = this;
            vm.releases = [];
            //Access Permission
            vm.permissions = {
                process: abp.auth.hasPermission('Page.CBS.OrgProcesses'),
                create: abp.auth.hasPermission('Pages.CBS.OrgProcesses.AddNew'),
                edit: abp.auth.hasPermission('Pages.CBS.OrgProcesses.Edit'),
                'delete': abp.auth.hasPermission('Pages.CBS.OrgProcesses.Delete')
            };

            
            // vm.filterText = $stateParams.filterText || null;
           
            vm.filters = {
                title: null,
            };
            

            vm.loading = false;

            vm.gridOptions = {
                enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                paginationPageSizes: app.consts.grid.defaultPageSizes,
                paginationPageSize: app.consts.grid.defaultPageSize,
                useExternalPagination: true,
                useExternalSorting: true,
                appScopeProvider: vm,
                columnDefs: [
                    {
                        name: app.localize(' '),
                        enableSorting: false,
                        width: 115,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize('Actions') + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a  ng-click="grid.appScope.viewOrgProcess(row.entity.id)">' + app.localize('View') + '</a></li>' +
                            '      <li><a  ng-if="grid.appScope.permissions.edit" ng-click="grid.appScope.openEditOrgProcess(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a  ng-if="grid.appScope.permissions.delete" ng-click="grid.appScope.deleteOrgProcess(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },

                    {
                        name: 'Process No',
                        field: 'processNo'
                    },
                    {
                        name: 'Title',
                        field: 'title'
                    },
                    {
                        name: 'Parent',
                        field: 'parentName'
                    }
                ],

                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (!sortColumns.length || !sortColumns[0].field) {
                            requestParams.sorting = null;
                        } else {
                            requestParams.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
                        }

                        vm.getOrgProcess();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        requestParams.skipCount = (pageNumber - 1) * pageSize;
                        requestParams.maxResultCount = pageSize;

                        vm.getOrgProcess();
                    });
                },
                data: []
            };

            vm.viewOrgProcess = function (id) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/orgProcesses/viewOrgProcess.cshtml',
                    controller: 'host.views.cbs.orgProcesses.viewOrgProcess as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        processId : id
                    }
                });
                modalInstance.result.then(function () {
                    vm.getOrgProcess();

                });
            };

            vm.openCreateOrgProcessModal = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/orgProcesses/createOrgProcessModel.cshtml',
                    controller: 'host.views.cbs.orgProcesses.createOrgProcessModel as vm',
                    size: 'xl',
                    backdrop: 'static',
                    resolve: {
                        process: { id: 0, title: '', detail: ''}
                    }

                });
                modalInstance.result.then(function () {
                    vm.getOrgProcess();

                });
            };

            vm.openEditOrgProcess = function (process) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/orgProcesses/createOrgProcessModel.cshtml',
                    controller: 'host.views.cbs.orgProcesses.createOrgProcessModel as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        process: process
                    }

                });
                modalInstance.result.then(function () {
                    vm.getOrgProcess();

                });
            };

            vm.deleteOrgProcess = function (row) {
                console.info(row);
                console.log(row);
                abp.message.confirm(
                    app.localize('DeleteWarningMessage'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            orgProcessesService.deleteOrgProcess({
                                id: row.id
                            }).success(function () {
                                vm.getOrgProcess();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            vm.getOrgProcess = function () {
                vm.loading = true;

                orgProcessesService.getOrgProcess(vm.filters).success(function (data) {
                    vm.releases = data;

                    vm.gridOptions.data = data;

                }).finally(function () {
                    vm.loading = false;
                });


            };

            function init() {
                vm.getOrgProcess();
            }

            init();
        }
    ]);
