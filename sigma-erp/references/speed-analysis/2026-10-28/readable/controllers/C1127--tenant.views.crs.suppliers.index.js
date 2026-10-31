// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:297347-297522
appModule.controller('tenant.views.crs.suppliers.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.supplier',
        function ($scope, $uibModal, uiGridConstants, supplierService) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.filters = {
                code: '',
                name: '',
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
            };

            vm.permissions = {
                view: abp.auth.hasPermission('Pages.Tenant.Suppliers'),
                create: abp.auth.hasPermission('Pages.Tenant.Suppliers.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.Suppliers.Edit'),
                exportToExcel: abp.auth.hasPermission('Pages.Tenant.Suppliers.Export'),
                'delete': abp.auth.hasPermission('Pages.Tenant.Suppliers.Delete')
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
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize('Actions') + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.viewSupplier(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.edit" ng-click="grid.appScope.editSupplier(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete" ng-click="grid.appScope.deleteSupplier(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Code'),
                        field: 'code'
                    },
                    {
                        name: app.localize('SupplierName'),
                        field: 'companyName'
                    },
                    {
                        name: app.localize('ContactNo'),
                        field: 'contactNo'
                    },
                    {
                        name: app.localize('Website'),
                        field: 'domain'
                    },
                    {
                        name: app.localize('Email'),
                        field: 'email'
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

                        vm.getSuppliers();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getSuppliers();
                    });
                },
                data: []
            };

            vm.getSuppliers = function () {
                vm.loading = true;
                supplierService.getSuppliers(vm.filters).success(function (data) {

                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };
            vm.exportToExcel = function () {
                vm.loading = true;
                supplierService.exportToExcel(vm.filters).success(function (result) {
                    app.downloadTempFile(result);
                }).finally(function () {
                    vm.loading = false;
                });
            };
            function openCreateOrEditSupplierModal(supplierId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/suppliers/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.suppliers.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        supplierId: function () {
                            return supplierId;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getSuppliers();
                });
            }

            function openViewModal(supplierId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/suppliers/viewModel.cshtml',
                    controller: 'tenant.views.crs.suppliers.createOrEditModal as vm',
                    backdrop: 'static',
                    resolve: {
                        supplierId: function () {
                            return supplierId;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getSuppliers();
                });
            }

            vm.createSupplier = function () {
                openCreateOrEditSupplierModal(null);
            };

            vm.editSupplier = function (supplier) {
                openCreateOrEditSupplierModal(supplier.id);
            };
            vm.viewSupplier = function (supplier) {
                openViewModal(supplier.id);
            };

            vm.deleteSupplier = function (supplier) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            supplierService.deleteSupplier({
                                id: supplier.id
                            }).success(function () {
                                vm.getSuppliers();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            vm.getSuppliers();

        }
    ]);
