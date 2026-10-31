// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:454866-455004
appModule.controller('tenant.views.pos.product.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.product',
        function ($scope, $uibModal, uiGridConstants, productService) {

            var vm = this;

            vm.isposEnabled = abp.features.isEnabled("POS");

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;

            vm.permissions = {
                create: true
                //create: abp.auth.hasPermission('Pages.Tenant.Locations.Addnew'),
                //edit: abp.auth.hasPermission('Pages.Tenant.Locations.Edit'),
                //'delete': abp.auth.hasPermission('Pages.Tenant.Locations.Delete')
            };
            vm.gridOptions = {
                enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                paginationPageSizes: app.consts.grid.defaultPageSizes,
                paginationPageSize: app.consts.grid.defaultPageSize,
                appScopeProvider: vm,
                enableSorting: false,
                columnDefs: [
                    {
                        name: app.localize('Actions'),
                        width: 120,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize('Actions') + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a ng-click="grid.appScope.viewProduct(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-click="grid.appScope.editProduct(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-click="grid.appScope.deleteProduct(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Code'),
                        field: 'code'
                    },

                    {
                        name: app.localize('ProductName'),
                        field: 'name'
                    },
                    {
                        name: app.localize('ProductNameLang'),
                        field: 'nameLang'
                    },
                    ],
                data: []
            };
            vm.getProducts = function () {
                vm.loading = true;
                productService.getProducts().success(function (data) {
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                    vm.getProductsList();
                    });
            };

            vm.getProductsList = function ()
            {
                localStorage.setItem("productlist", JSON.stringify(vm.gridOptions.data));
            };
            function openCreateOrEditProductModal(Id) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/pos/product/createOrEditModal.cshtml',
                    controller: 'tenant.views.pos.product.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        productId: function () {
                            return Id;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getProducts();
                });
            }

            vm.createProduct = function () {
                openCreateOrEditProductModal(null);
            };
            vm.editProduct = function (Product) {
                openCreateOrEditProductModal(Product.id);
            };

            vm.viewProduct = function (Product) {
                openViewModal(Product.id);
            };

            function openViewModal(id) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/pos/product/viewModal.cshtml',
                    controller: 'tenant.views.pos.product.viewModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        productId: function () {
                            return id;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getProducts();
                });
            }
            
            vm.deleteProduct = function (Product) {
                //debugger;
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', Product.Id),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            productService.deleteProduct({
                                Id: Product.id
                            }).success(function () {
                                vm.getProducts();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };
            vm.getProducts();
        }
    ]);
