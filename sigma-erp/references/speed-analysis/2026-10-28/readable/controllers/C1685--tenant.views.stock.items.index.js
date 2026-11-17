// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:465779-466046
appModule.controller('tenant.views.stock.items.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'appSession', 'abp.services.app.commonLookup', 'utilities', 'abp.services.app.item', 'abp.services.app.itemType', 'abp.services.app.vehicleModel',
        function ($scope, $uibModal, uiGridConstants, appSession, lookupService, utilities, itemAppService, itemTypeAppService, vehicleModelService) {

            var vm = this;
            vm.loading = false;
            vm.itemTypes = [];
            vm.models = null;
            vm.items = {
                filter: '',
                sorting: ''
            };

            vm.permissions = {
                view: abp.auth.hasPermission('Pages.STOCK.Items'),
                create: abp.auth.hasPermission('Pages.STOCK.Items.Create'),
                edit: abp.auth.hasPermission('Pages.STOCK.Items.Edit'),
                'delete': abp.auth.hasPermission('Pages.STOCK.Items.Delete')
            };

            vm.searchModel = function ($select) {
                vm.items.name = $select.search;
                if (vm.items.name == '')
                    vm.items.name = "~";  //to avoid default suggestions 

                return vehicleModelService.searchVehicleModelsNew(vm.items).then(function (response) {
                    vm.models = response.data.items;
                });
            };

            vm.getItems = function () {
                vm.loading = true;
                if (vm.items.model)
                    vm.items.modelId = vm.items.model.id;

                itemAppService.getItems(vm.items)
                    .success(function (data) {
                        vm.gridOptions.totalItems = data.totalCount;
                        vm.gridOptions.data = data.items;
                    }).finally(function () {
                        vm.loading = false;
                    });
            };

            vm.getItemTypes = function () {
                if (vm.itemTypes.length === 0) {
                    vm.loading = true;
                    itemTypeAppService.getItemTypes()
                        .success(function (result) {
                            vm.itemTypes = result.items;
                        }).finally(function () {
                            vm.loading = false;
                        });
                }
            };

            vm.filterItemType = function (itemTypeId) {
                angular.forEach(vm.itemTypes, function (itemType) {
                    if (itemTypeId === itemType.id) {
                        vm.item.itemType = itemType;
                    }
                });
            };

            vm.clearModel = function () {
                vm.items.model = null;
                vm.items.modelId = null;
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
                            '      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.openItemsViesModel(row.entity.id)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.edit" ng-click="grid.appScope.openCreateItemsModel(row.entity.id)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete" ng-click="grid.appScope.deleteItem(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('ItemNo'),
                        field: 'itemNo',
                        minWidth: 100,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span >' + '{{row.entity.itemNo}}' + '&nbsp' + '</span>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Name'),
                        field: 'name',
                        minWidth: 160,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span >' + '{{row.entity.name}}' + '&nbsp' + '</span>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Type'),
                        field: 'itemType',
                        minWidth: 100,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span >' + '{{row.entity.itemType.name}}' + '&nbsp' + '</span>' +
                            '</div>'
                    },
                    {
                        name: app.localize('SupplierItemCode'),
                        field: 'supplierItemCode',
                        minWidth: 180,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span >' + '{{row.entity.supplierItemCode}}' + '&nbsp' + '</span>' +
                            '</div>'
                    },
                    //{
                    //    name: app.localize('Make'),
                    //    field: 'model',
                    //    minWidth: 120,
                    //    cellTemplate:
                    //        '<div class=\"ui-grid-cell-contents\">' +
                    //        ' <span >' + '{{row.entity.model.make.name}}' + '&nbsp' + '</span>' +
                    //        '</div>'
                    //},
                    //{
                    //    name: app.localize('Model'),
                    //    field: 'model',
                    //    minWidth: 120,
                    //    cellTemplate:
                    //        '<div class=\"ui-grid-cell-contents\">' +
                    //        ' <span >' + '{{row.entity.model.name}}' + '&nbsp' + '</span>' +
                    //        '</div>'
                    //}
                    //,
                    //{
                    //    name: app.localize('Year'),
                    //    field: 'modelYear',
                    //    minWidth: 50,
                    //    cellTemplate:
                    //        '<div class=\"ui-grid-cell-contents\">' +
                    //        ' <span >' + '{{row.entity.modelYear}}' + '&nbsp' + '</span>' +
                    //        '</div>'
                    //}
                ],
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (!sortColumns.length || !sortColumns[0].field) {
                            vm.items.sorting = null;
                        } else {
                            vm.items.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
                        }
                        vm.getItems();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.items.skipCount = (pageNumber - 1) * pageSize;
                        vm.items.maxResultCount = pageSize;

                        vm.getItems();
                    });
                },
                data: []
            };

            vm.openCreateItemsModel = function (itemId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/stock/items/createOrEditModal.cshtml',
                    controller: 'tenant.views.stock.items.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        itemId: function () {
                            return itemId;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getItems();
                });
            };

            vm.openItemsViesModel = function (itemId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/stock/items/viewModal.cshtml',
                    controller: 'tenant.views.stock.items.viewModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        itemId: function () {
                            return itemId;
                        }
                    }
                });

            };

            vm.deleteItem = function (item) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', item.name),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            vm.loading = true;
                            itemAppService.deleteItem({ id: item.id })
                                .success(function (result) {
                                    abp.notify.info(app.localize('DeletedSuccessfully'));
                                    vm.getItems();
                                }).error(function (result) {
                                    abp.notify.error(app.localize('Error'));
                                }).finally(function () {
                                    vm.loading = false;
                                });
                        }
                    }
                );
            };

            vm.exportToExcel = function () {
                vm.loading = true;

                itemAppService.exportToExcel(vm.items)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };

            vm.report = function () {
                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/stock/items/report.cshtml';
                        },
                        filters: function () {
                            return vm.items;
                        }
                    }
                });
            };

            function init() {
                vm.getItemTypes();
                vm.getItems();
            }

            init();

        }
    ]);
