// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:62985-63266
appModule.controller('host.views.packages.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.packages', 'abp.services.app.hostProduct', 'abp.services.app.productVariant', 'abp.services.app.regions', 'utilities', 'abp.services.app.businessDivision',
        function ($scope, $uibModal, uiGridConstants, packagesAppService, productService, productVariantService, regionsAppService, utilities, businessDivisionService) {
            var vm = this;
            vm.enumLimitType = [
                { name: "FleetSize", id: 0 }
            ];

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            vm.businessName = utilities.divisionName();
            vm.getProducts = function () {
                productService.getProducts().success(function (data) {
                    console.log(data);
                    vm.products = data;
                    vm.loading = false;
                });
            };
            vm.getbusinessDivisions = function () {
                vm.loading = true;
                businessDivisionService.getBusinessDivisions().success(function (data) {
                    vm.businessDivisions = data.items
                }).finally(function () {
                    vm.loading = false;
                });
            }
            vm.getRegions = function () {
                regionsAppService.getRegions().success(function (data) {
                    console.log(data);
                    vm.regions = data;
                    vm.loading = false;
                });
            };

            vm.permissions = {
                create: abp.auth.hasPermission('Pages.CRM.Packages.Dashboard.CreatePackage'),
                edit: abp.auth.hasPermission('Pages.CRM.Packages.Dashboard.EditPackage'),
                delete: abp.auth.hasPermission('Pages.CRM.Packages.Dashboard.DeletePackage'),
            };

            var requestParams = {
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
                sorting: "title asc"
            };
            vm.filters = {
                isFeatured: false,
            };
            vm.getVariantsByProductId = function (productId) {
                console.log(productId)
                productVariantService.getProductVariants({ id: productId }).success(function (result) {
                    vm.productVariants = result;
                }).finally(function () {
                    vm.loading = false;
                });
            }
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
                            '      <li><a ng-if="grid.appScope.permissions.edit" ng-click="grid.appScope.editPackage(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete" ng-click="grid.appScope.DeletePackage(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },

                    {
                        name: app.localize('Title'),
                        width: 180,
                        field: 'title'
                    },
                    {
                        name: app.localize('Product'),
                        width: 130,
                        field: 'product.name'
                    },
                    {
                        name: app.localize('Variant'),
                        width: 170,
                        field: 'productVariant.name'
                    },
                    {
                        name: app.localize('Limit'),
                        width: 130,
                        field: 'limit'
                    },
                    {
                        name: app.localize('LimitType'),
                        width: 150,
                        field: 'limitType',
                    },
                    {
                        name: app.localize('Rate'),
                        width: 140,
                        field: 'rate'
                    },
                    {
                        name: app.localize('CurrencyCode'),
                        width: 150,
                        field: 'code'
                    },
                    {
                        name: app.localize('Division'),
                        width: 150,
                        field: 'businessDivision.code'
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
                        vm.getPackages();
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
            vm.divisionName = function (id) {
                return utilities.getDivisionName(id);
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
                packagesAppService.getPackages({
                    Title: vm.filters.packageTitle, Division: vm.filters.division, businessDivisionId: vm.filters.businessDivisionId,ProductId: vm.filters.productId, ProductVariantId: vm.filters.variantId, RegionId: vm.filters.regionId, skipCount: requestParams.skipCount, maxResultCount: requestParams.maxResultCount, sorting: requestParams.sorting
                })
                    .then(function (data) {
                    if (data.data != null) {
                        vm.tenantGridOptions.totalItems = data.data.totalCount;
                        let datas = data.data.items;
                        let packages = data.data.items;
                        let modifiedData = [];
                        for (let i = 0; i < datas.length; i++) {
                            let item = datas[i];
                            for (let j = 0; j < vm.enumLimitType.length; j++) {
                                if (vm.enumLimitType[j].id === item.limitType) {
                                    item.limitType = vm.enumLimitType[j].name;
                                    break;
                                }
                            }
                            modifiedData.push(datas[i]);
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
            vm.getPackages = function () {
                vm.loading = true;
                if (requestParams.sorting == null || requestParams.sorting == []) {
                    requestParams.sorting = "title asc"
                }
                    vm.tenantGridOptions.data = [];
                packagesAppService.getPackages({ skipCount: requestParams.skipCount, maxResultCount: requestParams.maxResultCount, sorting: requestParams.sorting }).then(function (data) {
                    vm.tenantGridOptions.totalItems = data.data.totalCount;
                    let datas = data.data.items;
                    let packages = data.data.items;
                    let modifiedData = [];
                    for (let i = 0; i < datas.length; i++) {
                        let item = datas[i];
                        for (let j = 0; j < vm.enumLimitType.length; j++) {
                            if (vm.enumLimitType[j].id === item.limitType) {
                                item.limitType = vm.enumLimitType[j].name;
                                break;
                            }
                        }
                        modifiedData.push(datas[i]);
                    }
                    vm.tenantGridOptions.data = modifiedData;
                }).finally(function () {
                    vm.loading = false;
                }).catch(function (err) {
                    console.log(err);
                });
            };
            vm.addPackage = function (Package) {
                var modalInstance = $uibModal.open({
                    templateUrl: '/App/host/views/crm/crmPackages/createOrEditModal.cshtml',
                    controller: 'host.views.packages.createOrEditModal as vm',
                    backdrop: 'static',
                    resolve: {
                        packageId: function () {
                            return null;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getPackages();
                });
            };
            vm.editPackage = function (package) {
                var modalInstance = $uibModal.open({
                    templateUrl: '/App/host/views/crm/crmPackages/createOrEditModal.cshtml',
                    controller: 'host.views.packages.createOrEditModal as vm',
                    backdrop: 'static',
                    resolve: {
                        packageId: function () {
                            return package.id;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getPackages();
                });
            };
            vm.DeletePackage = function (package) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', ''),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            vm.loading = true;
                            packagesAppService.deletePackage(package.id)
                                .then(function (data) {
                                    console.log("Package Deleted !!")
                                }).finally(function () {
                                    vm.loading = false;
                                    vm.getPackages();
                                });
                        }
                    }
                );
            };

            function init() {
                vm.getbusinessDivisions();
                vm.getProducts();
                vm.getRegions();
                vm.getPackages();
            }
            init();
        }
    ]);
