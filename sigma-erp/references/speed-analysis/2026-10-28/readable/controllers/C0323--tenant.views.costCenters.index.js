// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:86831-86976
appModule.controller('tenant.views.costCenters.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.costCenter',
        function ($scope, $uibModal, uiGridConstants, costCenterService) {
            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;

            vm.permissions = {
                create: abp.auth.hasPermission('Pages.Tenant.CostCenter.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.CostCenter.Edit'),
                delete: abp.auth.hasPermission('Pages.Tenant.CostCenter.Delete')
            };


            vm.getCostCenterType = function (id) {
                if (id == 1)
                    return app.localize('CostCenterGroup1');
                else if (id == 2)
                    return app.localize('CostCenterGroup2');
                return "";
            }

            

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
                            '      <li><a ng-if="grid.appScope.permissions.edit" ng-click="grid.appScope.editCostCenter(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete" ng-click="grid.appScope.deleteCostCenter(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },

                    {
                        name: app.localize('CostCenterName'),
                        field: 'name'
                    },

                    {
                        name: app.localize('Code'),
                        field: 'code'
                    },
                    {
                        name: app.localize('Group'),
                        field: 'group',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <span>{{grid.appScope.getCostCenterType(row.entity.group)}}</span>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Active'),
                        field: 'isActive',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <span ng-show="row.entity.isActive" class="label label-success">' + app.localize('Yes') + '</span>' +
                            '  <span ng-show="!row.entity.isActive" class="label label-danger">' + app.localize('No') + '</span>' +
                            '</div>'
                    }
                ],
                data: []
            };

            vm.getCostCenterTypeName = function (type) {
                if (type == 1) {
                    return app.localize('BalanceSheet');
                }
                else if (type == 2) {
                    return app.localize('ProfitAndLoss');
                }
            }

            vm.getCostCenters = function () {

                vm.loading = true;
                costCenterService.getCostCenters(vm.filters).success(function (data) {
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function openCreateOrEditCostCenterModal(costCenterId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/costCenters/createOrEditModal.cshtml',
                    controller: 'tenant.views.costCenters.createOrEditModal as vm',
                    backdrop: 'static',
                    resolve: {
                        costCenterId: function () {
                            return costCenterId;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getCostCenters();
                });
            }

            vm.createCostCenter = function () {
                openCreateOrEditCostCenterModal(null);
            };

            vm.editCostCenter = function (costCenter) {
                openCreateOrEditCostCenterModal(costCenter.id);
            };

            vm.deleteCostCenter = function (costCenter) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', costCenter.name),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            vm.loading = true;
                            costCenterService.deleteCostCenter({
                                id: costCenter.id
                            }).success(function () {
                                vm.loading = false;
                                vm.getCostCenters();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            vm.getCostCenters();
        }
    ]);
