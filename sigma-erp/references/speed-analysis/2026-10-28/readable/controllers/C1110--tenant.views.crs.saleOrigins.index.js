// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:292639-292751
appModule.controller('tenant.views.crs.saleOrigins.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.saleOrigin',
        function ($scope, $uibModal, uiGridConstants, saleOriginService) {
            
            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;

            vm.permissions = {
                create: abp.auth.hasPermission('Pages.Tenant.SaleOrigins.Addnew') ,
                edit: abp.auth.hasPermission('Pages.Tenant.SaleOrigins.Edit'),
                'delete': abp.auth.hasPermission('Pages.Tenant.SaleOrigins.Delete')
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
                            '      <li><a ng-if="grid.appScope.permissions.edit" ng-click="grid.appScope.editSaleOrigins(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete" ng-click="grid.appScope.deleteSaleOrigin(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Code'),
                        field: 'code'
                    },,
                    {
                        name: app.localize('Name'),
                        field: 'name'
                    },
                 
                ],
                data: []
            };
            
           

            function openCreateOrEditSaleOriginsModal(rowId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/saleOrigins/createOrEditSaleOriginModal.cshtml',
                    controller: 'tenant.views.crs.saleOrigins.createOrEditSaleOriginModal as vm',
                    backdrop: 'static',
                    resolve: {
                        saleOriginId: function () {
                            return rowId;
                        }
                    },
                    size:'md',
                    //for modal width below line
                    swindowClass: 'app-modal-window'
                });

                modalInstance.result.then(function (result) {
                    vm.getSaleOrigins();
                });
            }


            vm.getSaleOrigins = function () {
                vm.loading = true;
                saleOriginService.getSaleOrigins({}).success(function (data) {
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };


            vm.createSaleOrigins = function () {
                openCreateOrEditSaleOriginsModal(null);
            };

            vm.editSaleOrigins = function (row) {
                openCreateOrEditSaleOriginsModal(row.id);
            };

            vm.deleteSaleOrigin = function(row) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', row.name),
                    function(isConfirmed) {
                        if (isConfirmed) {
                            saleOriginService.deleteSaleOrigin({
                                id: row.id
                            }).success(function() {
                                vm.getSaleOrigins();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            vm.getSaleOrigins();
        }
    ]);
