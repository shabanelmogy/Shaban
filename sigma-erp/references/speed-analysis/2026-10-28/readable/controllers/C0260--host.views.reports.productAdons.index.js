// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:77857-78026
appModule.controller('host.views.reports.productAdons.index', [
        '$scope', '$uibModal', 'abp.services.app.productAdon', 'uiGridConstants', 'abp.services.app.hostProduct', 'abp.services.app.regions', 'abp.services.app.country',
        function ($scope, $uibModal, productAdonService, uiGridConstants, productService, regionsAppService, countryService) {
            var vm = this;
            vm.createProductAdons = function () {
                openCreateOrEditProductAdonsModal(null);
            };
            vm.editProductAdon = function (row) {
                openCreateOrEditProductAdonsModal(row.id);
            };
            vm.filter = {
                name: ''
            };
            vm.filters = {
                name: '',
                productId: '',
                countryId: '',
                regionId: '',
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
                sorting: null
            };

            vm.permissions = {
                create: abp.auth.hasPermission('Pages.Tenants.Report.ProductAdons.Create'),
                edit: abp.auth.hasPermission('Pages.Tenants.Report.ProductAdons.Edit'),
                'delete': abp.auth.hasPermission('Pages.Tenants.Report.ProductAdons.Delete')
            };
            vm.searchCountries = function ($select) {
                vm.filter.name = $select.search;
                if (vm.filter.name == '')
                    vm.filter.name = "~";  //to avoid default suggestions 

                return countryService.searchCountries(vm.filter).then(function (response) {
                    vm.countries = response.data.items;
                });
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
                            '      <li ng-if="grid.appScope.permissions.edit"><a  ng-click="grid.appScope.editProductAdon(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li ng-if="grid.appScope.permissions.delete"><a ng-click="grid.appScope.deleteProductAdon(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +

                            '</div>'
                    },
                    {
                        name: app.localize('Title'),
                        field: 'name'
                    },
                    {
                        name: app.localize('Product'),
                        field: 'product.name'
                    },
                    {
                        name: app.localize('Country'),
                        field: 'country.name'
                    },
                    {
                        name: app.localize('Region'),
                        field: 'region.name'
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
                        vm.getProductAdon();

                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;
                        vm.getProductAdon();

                    });
                },
                data: []
            };
            vm.deleteProductAdon = function (row) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', ''),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            vm.loading = true;
                            productAdonService.deleteProductAdon(row.id)
                                .then(function (data) {
                                    abp.notify.success(app.localize('SuccessfullyDeleted'));
                                }).finally(function () {
                                    vm.loading = false;
                                    vm.getProductAdon();
                                });
                        }
                    }
                );
            };
            function openCreateOrEditProductAdonsModal(productAdonId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/reports/productAdons/createOrEditProductAdonsModal.cshtml',
                    controller: 'host.views.reports.productAdons.createOrEditProductAdonsModal as vm',
                    backdrop: 'static',
                    resolve: {
                        productAdonId: function () {
                            return productAdonId;
                        }
                     
                    }
                });

                modalInstance.result.then(function () {
                    vm.getProductAdon();
                });
            }
            vm.clearCountry = function () {
                vm.selectedCountry = null;
                vm.filters.countryId = null;
            };
            vm.getProducts = function () {
                productService.getProducts().success(function (data) {
                    
                    vm.products = data;
                    vm.loading = false;
                });
            };
            vm.getRegions = function () {
                regionsAppService.getRegions().success(function (data) {
                    
                    vm.regions = data;
                    vm.loading = false;
                });
            };
            vm.getProductAdon = function () {
                vm.loading = true;
                productAdonService.getProductAdons(vm.filters).success(function (data) {
                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };
            function init() {
                vm.getProducts();
                vm.getRegions();
                vm.getProductAdon();
                
            }
            init();
        }
    ]);
