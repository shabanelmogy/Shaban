// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:455084-455238
appModule.controller('tenant.views.pos.unitOfMeasure.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.unitOfMeasure',
        function ($scope, $uibModal, uiGridConstants, unitOfMeasureService) {

            var vm = this;
   
            vm.isposEnabled = abp.features.isEnabled("POS");
            vm.isBilingualDataInputEnabled = abp.features.isEnabled("CRS.CustomFeatures.BilingualDataInput");
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;

            vm.permissions = {
                view: abp.auth.hasPermission('Pages.STOCK.UnitOfMeasures'),
                create: abp.auth.hasPermission('Pages.STOCK.UnitOfMeasures.Create'),
                edit: abp.auth.hasPermission('Pages.STOCK.UnitOfMeasures.Edit'),
                'delete': abp.auth.hasPermission('Pages.STOCK.UnitOfMeasures.Delete')
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
                            //'      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.viewUnitOfMeasure(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.edit" ng-click="grid.appScope.editUnitOfMeasure(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete" ng-click="grid.appScope.deleteUnitOfMeasure(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('UnitOfMeasureName'),
                        field: 'name'
                    },
                    {
                        visible : abp.features.isEnabled("CRS.CustomFeatures.BilingualDataInput"),
                        name: app.localize('UnitOfMeasureNameLang'),
                        field: 'nameLang'
                    }
                    //{
                    //    name: app.localize('Category'),
                    //    field: 'category',
                    //    cellTemplate:
                    //        '<div class=\"ui-grid-cell\">' +
                    //        '<div class=\"ui-grid-cell-contents\">{{grid.appScope.category(row.entity.category)}}</div>' +
                    //        '</div>'
                    //}
                ],
                data: []
            };
            vm.category = function (value) {
                if (value === 1)
                    return 'Volume';
                if (value === 2)
                    return 'Length';
                if (value === 3)
                    return 'Weight';
                if (value === 4)
                    return 'Unit';
                else
                    return value;
            };
                
            

            vm.getUnitOfMeasures = function () {
                vm.loading = true;

                unitOfMeasureService.getUnitOfMeasures({}).success(function (data) {
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function openCreateOrEditUnitOfMeasureModal(Id) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/pos/unitOfMeasure/createOrEditModal.cshtml',
                    controller: 'tenant.views.pos.unitOfMeasure.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        unitOfMeasureId: function () {
                            return Id;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getUnitOfMeasures();
                });
            }

            vm.createUnitOfMeasure = function () {
                openCreateOrEditUnitOfMeasureModal(null);
            };

            vm.editUnitOfMeasure = function (UnitOfMeasure ) {
                openCreateOrEditUnitOfMeasureModal(UnitOfMeasure.id);
            };

            vm.viewUnitOfMeasure = function (UnitOfMeasure ) {
                openViewModal(UnitOfMeasure.id);
            };

            function openViewModal(id) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/pos/unitOfMeasure/viewModal.cshtml',
                    controller: 'tenant.views.pos.unitOfMeasure.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        unitOfMeasureId: function () {
                            return id;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getUnitOfMeasures();
                });
            }

            vm.deleteUnitOfMeasure = function (UnitOfMeasure) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', UnitOfMeasure.Id),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            unitOfMeasureService.deleteUnitOfMeasure({
                                Id: UnitOfMeasure.id
                            }).success(function () {
                                vm.getUnitOfMeasures();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };
            vm.getUnitOfMeasures();
        }
    ]);
