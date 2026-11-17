// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:65782-65967
appModule.controller('host.views.crm.products.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.hostProduct', 'appSession', 'utilities',
        function ($scope, $uibModal, uiGridConstants, productService, appSession, utilities) {
            var isSupportPermission = abp.auth.hasPermission('Pages.Support');

            var vm = this;


            vm.products = [];

            vm.permissions = {
                view: abp.auth.hasPermission('Pages.CRM.Products'),
                create: abp.auth.hasPermission('Pages.CRM.Products.AddNew'),
                edit: abp.auth.hasPermission('Pages.CRM.Products.Edit'),
                delete: abp.auth.hasPermission('Pages.CRM.Products.Delete')
            };

            vm.filters = {
                maxResultCount: app.consts.grid.defaultPageSize,                
            };

            vm.loading = false;

            var todayAsString = moment(moment().format('YYYY-MM-DD')).utc()
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeModel = {
                startDate: moment(moment().format('YYYY-MM-DD')).utc(),
                endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc()
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
                            '      <li><a  ng-if="grid.appScope.permissions.edit" ng-click="grid.appScope.openCreateProjectTaskModal(row.entity.id)">Edit</a></li>' +
                            '      <li><a  ng-if="grid.appScope.permissions.delete" ng-click="grid.appScope.deleteProduct(row.entity.id)">Delete</a></li>' +
                            '      <li><a  ng-if="grid.appScope.permissions.edit" ng-click="grid.appScope.openProductVariantModal(row.entity)">Variants</a></li>' +
                            '      <li><a  ng-if="grid.appScope.permissions.edit" ng-click="grid.appScope.openProductModulesAndFeatures(row.entity)">Modules And Features</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },

                    {
                        name: 'Code',
                        field: 'code'
                    },
                    {
                        name: 'Name',
                        field: 'name'
                    },
                    {
                        name: 'Edition',
                        field: 'edition.displayName'
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

                        vm.getProducts();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getProducts();
                    });
                },


                data: []
            };

            // In your product controller where you open the modules modal
            vm.openProductModulesAndFeatures = function (row) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/crm/products/productModuleAndFeatures.cshtml',
                    controller: 'host.views.crm.products.productModuleAndFeatures as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        product: function () {
                            return row;
                        }
                    }
                });

                /*// You might want to handle the result
                modalInstance.result.then(function () {
                    // Handle success
                }, function () {
                    // Handle dismissal
                });*/
            };

            vm.openProductVariantModal = function (row) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/crm/productVariants/productVariantModal.cshtml',
                    controller: 'host.views.crm.productVariants.productVariantModal as vm',
                    backdrop: 'static',
                    resolve: {
                        product: function () {
                            return row;
                        }
                    }
                });
            }

            vm.openCreateProjectTaskModal = function (id) {
                let index = null;
                let parent = null;


                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/crm/products/createOrEditProduct.cshtml',
                    controller: 'host.views.crm.products.createOrEditProduct as vm',
                    backdrop: 'static',
                    resolve: {
                        options: function () {
                            return {
                                id: id
                            };
                        }
                    }
                });
                modalInstance.result.then(function () {
                    vm.getProducts();

                });
            };
            vm.deleteProduct = function (id) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            productService.deleteProduct(id).success(function () {
                                vm.getProducts();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            vm.getProducts = function () {
                vm.loading = true;
                productService.getProducts(vm.filters).success(function (data) {
                    vm.gridOptions.data = data.items;
                    vm.gridOptions.totalItems = data.totalCount;
                }).finally(function () {
                    vm.loading = false;
                });
            };




            function init() {
                vm.getProducts();
            }

            init();
        }
    ]);
