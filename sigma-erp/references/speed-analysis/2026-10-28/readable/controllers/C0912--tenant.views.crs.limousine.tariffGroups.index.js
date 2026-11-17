// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:247428-247579
appModule.controller('tenant.views.crs.limousine.tariffGroups.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.tariffGroup',
        function ($scope, $uibModal, uiGridConstants, tariffGroupService) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.filters = {
                Title: '',
                SubTitle: '',
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize
            };

            vm.permissions = {
                view: abp.auth.hasPermission('Pages.Tenant.Limousine.TariffGroups'),
                create: abp.auth.hasPermission('Pages.Tenant.Limousine.TariffGroups.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.Limousine.TariffGroups.Edit'),
                'delete': abp.auth.hasPermission('Pages.Tenant.Limousine.TariffGroups.Delete')
            };

            vm.viewtariffGroup = function (tariffGroup) {
                openViewTariffGroupModal(tariffGroup.id);
            };

            function openViewTariffGroupModal(tariffGroupId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/limousine/tariffGroups/viewModal.cshtml',
                    controller: 'tenant.views.crs.limousine.tariffGroups.createOrEditModal as vm',
                    backdrop: 'static',
                    resolve: {
                        tariffGroupId: function () {
                            return tariffGroupId;
                        }
                    }
                });
            }

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
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize('Actions') + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a  ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.viewtariffGroup(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.edit" ng-click="grid.appScope.editTariffGroup(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete" ng-click="grid.appScope.deleteTariffGroup(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
               
                    {
                        name: app.localize('Name'),
                        field: 'title'
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

                        vm.getTariffGroups();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getTariffGroups();
                    });
                },
                data: []
            };


            vm.getTariffGroups = function () {
                
                vm.loading = true;
                tariffGroupService.getTariffGroup(vm.filters).success(function (data) {
                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function openCreateOrEditTariffGroupModal(tariffGroupId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/limousine/tariffGroups/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.limousine.tariffGroups.createOrEditModal as vm',
                    backdrop: 'static',
                    resolve: {
                        tariffGroupId: function () {
                            return tariffGroupId;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                     vm.getTariffGroups();
                });
            }

            vm.createTariffGroup = function () {
                openCreateOrEditTariffGroupModal(null);
            };

            vm.editTariffGroup = function (tariffGroup) {
                
                openCreateOrEditTariffGroupModal(tariffGroup.id);
            };

            vm.deleteTariffGroup = function (tariffGroup) {
                
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', ''),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            tariffGroupService.deleteTariffGroup({
                                id: tariffGroup.id
                            }).success(function () {
                                vm.getTariffGroups();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };
          
            vm.getTariffGroups();
        }
    ]);
