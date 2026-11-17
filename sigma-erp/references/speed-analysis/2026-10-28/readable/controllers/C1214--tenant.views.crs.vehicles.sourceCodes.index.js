// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:317972-318137
appModule.controller('tenant.views.crs.vehicles.sourceCodes.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.sourceCode', 'utilities', '$stateParams',
        function ($scope, $uibModal, uiGridConstants, sourceCodeService, utilities, $stateParams) {

            var vm = this;
            vm.isCrsEnabled = abp.features.isEnabled("CRS");

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.type = $stateParams.type;

            vm.filters = {
                Name: '',
                Code: '',
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize
            };

            vm.permissions = {
                view: abp.auth.hasPermission('Pages.Tenant.SourceCodes'),
                create: abp.auth.hasPermission('Pages.Tenant.SourceCodes.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.SourceCodes.Edit'),
                'delete': abp.auth.hasPermission('Pages.Tenant.SourceCodes.Delete'),
            };

            vm.viewSourceCode = function (sourceCode) {

                openViewSourceCodeModal(sourceCode.id);
            };

            function openViewSourceCodeModal(sourceCodeId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/sourceCodes/viewModal.cshtml',
                    controller: 'tenant.views.crs.vehicles.sourceCodes.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        sourceCodeId: function () {
                            return sourceCodeId;
                        },
                        isViewModal: function () {
                            return true;
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
                            '      <li><a  ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.viewSourceCode(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.edit" ng-click="grid.appScope.editSourceCode(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete" ng-click="grid.appScope.deleteSourceCode(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },

                    {
                        name: app.localize('Name'),
                        field: 'name'
                    },
                    {
                        name: app.localize('Code'),
                        field: 'code'
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

                        vm.getSourceCode();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getSourceCode();
                    });
                },
                data: []
            };


            vm.getSourceCode = function () {

                vm.loading = true;
                sourceCodeService.getSourceCode(vm.filters).success(function (data) {
                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function openCreateOrEditSourceCodeModal(sourceCodeId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/sourceCodes/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.vehicles.sourceCodes.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        sourceCodeId: function () {
                            return sourceCodeId;
                        },
                        isViewModal: function () {
                            return false;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getSourceCode();
                });
            }
            vm.createSourceCode = function () {
                openCreateOrEditSourceCodeModal(null);
            };

            vm.editSourceCode = function (sourceCode) {

                openCreateOrEditSourceCodeModal(sourceCode.id);
            };

            vm.deleteSourceCode = function (sourceCode) {

                abp.message.confirm(
                    app.localize('DeleteWarningMessage', ''),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            sourceCodeService.deleteSourceCode({
                                id: sourceCode.id
                            }).success(function () {
                                vm.getSourceCode();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };
            vm.getSourceCode();
        }
    ]);
