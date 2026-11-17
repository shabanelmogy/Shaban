// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:317338-317437
appModule.controller('tenant.views.vehicles.serviceItems.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.serviceItem',
        function ($scope, $uibModal, uiGridConstants, serviceItemService) {
            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;

            vm.permissions = {
                create: abp.auth.hasPermission('Pages.Tenant.ServiceItems.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.ServiceItems.Edit'),
                'delete': abp.auth.hasPermission('Pages.Tenant.ServiceItems.Delete')
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
                            '      <li><a ng-if="grid.appScope.permissions.edit" ng-click="grid.appScope.editServiceItem(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete" ng-click="grid.appScope.deleteServiceItem(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('ServiceItemName'),
                        field: 'name'
                    }
                ],
                data: []
            };

            vm.getServiceItems = function () {
                vm.loading = true;
                serviceItemService.getServiceItems({}).success(function (data) {
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function openCreateOrEditServiceItemModal(serviceItemId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/serviceItems/createOrEditModal.cshtml',
                    controller: 'tenant.views.vehicles.serviceItems.createOrEditModal as vm',
                    backdrop: 'static',
                    resolve: {
                        serviceItemId: function () {
                            return serviceItemId;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getServiceItems();
                });
            }

            vm.createServiceItem = function () {
                openCreateOrEditServiceItemModal(null);
            };

            vm.editServiceItem = function (serviceItem) {
                openCreateOrEditServiceItemModal(serviceItem.id);
            };

            vm.deleteServiceItem = function (serviceItem) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', serviceItem.name),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            serviceItemService.deleteServiceItem({
                                id: serviceItem.id
                            }).success(function () {
                                vm.getServiceItems();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            vm.getServiceItems();
        }
    ]);
