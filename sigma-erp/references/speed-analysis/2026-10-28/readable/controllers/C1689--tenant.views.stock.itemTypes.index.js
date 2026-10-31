// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:466206-466362
appModule.controller('tenant.views.stock.itemTypes.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.itemType',
        function ($scope, $uibModal, uiGridConstants, itemTypeService) {

            var vm = this;
            vm.isCrsEnabled = abp.features.isEnabled("WorkShop");

            vm.permissions = {
                view: abp.auth.hasPermission('Pages.STOCK.ItemTypes'),
                create: abp.auth.hasPermission('Pages.STOCK.ItemTypes.Create'),
                edit: abp.auth.hasPermission('Pages.STOCK.ItemTypes.Edit'),
                'delete': abp.auth.hasPermission('Pages.STOCK.ItemTypes.Delete')
            };

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;

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
                            '      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.viewItemType(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.edit" ng-click="grid.appScope.editItemType(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete" ng-click="grid.appScope.deleteItemType(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('ItemTypeName'),
                        field: 'name'
                    },

                    {
                        name: app.localize('category'),
                        field: 'category',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.category(row.entity.category)}}</div>' +
                            '</div>'
                    }
                ],
                data: []
            };
            vm.category = function (value) {
                if (value === 1)
                    return 'Part';
                if (value === 2)

                    return app.localize('LiquidSemiLiquid');
                else
                    return value;
            };

            vm.getItemTypes = function () {
                vm.loading = true;

                itemTypeService.getItemTypes({}).success(function (data) {
                    vm.gridOptions.data = data.items;
                    var test = data.items;
                    console.log(test);
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function openCreateOrEditItemTypeModal(Id) {
                
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/stock/itemTypes/createOrEditModal.cshtml',
                    controller: 'tenant.views.stock.itemTypes.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        itemTypeId: function () {
                            return Id;
                        },
                        itemTypeService: function () {
                            return null;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getItemTypes();
                });
            }

            vm.createItemType = function () {
                
                openCreateOrEditItemTypeModal(null);
            };


            vm.editItemType = function (ItemType) {
                
                openCreateOrEditItemTypeModal(ItemType.id);
            };

            vm.viewItemType = function (ItemType) {
                
                openViewModal(ItemType.id);
            };

            function openViewModal(id) {
                
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/stock/itemTypes/viewModal.cshtml',
                    controller: 'tenant.views.stock.itemTypes.createOrEditModal as vm',
                      backdrop: 'static',
                    size: 'md',
                    resolve: {
                        itemTypeId: function () {
                            return id;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getItemTypes();
                });
            }
            vm.deleteItemType = function (ItemType) {
                
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', ItemType.Id),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            itemTypeService.deleteItemType({
                                Id: ItemType.id
                            }).success(function () {
                                vm.getItemTypes();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };
            vm.getItemTypes();
            
        }
    ]);
