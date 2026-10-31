// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:236359-236501
appModule.controller('tenant.views.crs.lease.costingSetup.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.costSetting','utilities',
        function ($scope, $uibModal, uiGridConstants, costSettingService,utilities) {
            var vm = this;
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;

            vm.permissions = {
                view: abp.auth.hasPermission('Pages.Tenant.Lease.CostSettings'),
                create: abp.auth.hasPermission('Pages.Tenant.Lease.CostSettings.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.Lease.CostSettings.Edit'),
                'delete': abp.auth.hasPermission('Pages.Tenant.Lease.CostSettings.Delete')
            };
            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
                            '      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.viewCostSetting(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.edit" ng-click="grid.appScope.editCostSetting(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete" ng-click="grid.appScope.deleteCostSetting(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },

                    {
                        name: app.localize('MakeAndModel'),
                        field: 'vehicleModel.name',
                        cellTemplate:
                       '<div class=\"ui-grid-cell\">' +
                       '<div class=\"ui-grid-cell-contents\">{{row.entity.vehicleModel.make.name}} {{row.entity.vehicleModel.name}}</div>' +
                       '</div>'
                    },
                    {
                        name: app.localize('MarkUpPercent'),
                        field: 'markupPercent',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.roundingforView(row.entity.markupPercent)}}</div>' +
                            '</div>'
                    },
                ],
                data: []
            };


            function openCreateOrEditCostSettingModal(costSettingId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/lease/costingSetup/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.lease.costingSetup.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        costSettingId: function () {
                            return costSettingId;
                        }
                    }

                });
                modalInstance.result.then(function (result) {
                    init();
                });
            }

            function openViewCostSettingModal(costSettingId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/lease/costingSetup/viewModal.cshtml',
                    controller: 'tenant.views.crs.lease.costingSetup.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        costSettingId: function () {
                            return costSettingId;
                        }
                    }

                });
             
            }


            vm.createCostSetting = function () {
                openCreateOrEditCostSettingModal(null);
            };

            vm.editCostSetting = function (costSetting) {
                openCreateOrEditCostSettingModal(costSetting.id);
            };

            vm.viewCostSetting = function (costSetting) {
                openViewCostSettingModal(costSetting.id);
            };

            vm.deleteCostSetting = function (costSetting) {
                abp.message.confirm(
                   app.localize('DeleteWarningMessage', location.name),
                   function (isConfirmed) {
                       if (isConfirmed) {
                           costSettingService.deleteCostSetting({
                               id: costSetting.id
                           }).success(function () {
                               init();
                               abp.notify.success(app.localize('SuccessfullyDeleted'));
                           });
                       }
                   }
               );
            };

            // vm.getcostSettings();

            function init() {
                vm.loading = true;
                costSettingService.getCostSettings().success(function (data) {
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });

            }

            init();
        }
    ]);
