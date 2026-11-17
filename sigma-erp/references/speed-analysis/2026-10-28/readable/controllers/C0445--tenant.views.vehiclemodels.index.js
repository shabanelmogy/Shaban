// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:115437-115560
appModule.controller('tenant.views.vehiclemodels.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.vehicleModel', 'abp.services.app.make',
        function ($scope, $uibModal, uiGridConstants, vehicleModelService, makeService) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.filters = {
                name: '',
                makeId: null
            };
            vm.makes = [];

            vm.permissions = {
                create: true, //abp.auth.hasPermission('Pages.Models.Create'),
                edit: true, //abp.auth.hasPermission('Pages.Models.Edit'),
                'delete': true // abp.auth.hasPermission('Pages.Models.Delete')
            };

            vm.gridOptions = {
                enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                paginationPageSizes: app.consts.grid.defaultPageSizes,
                paginationPageSize: app.consts.grid.defaultPageSize,
                appScopeProvider: vm,
                columnDefs: [
                    {
                        name: app.localize('Actions'),
                        width: 120,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize('Actions') + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a ng-if="grid.appScope.permissions.edit" ng-click="grid.appScope.editVehicleModel(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete" ng-click="grid.appScope.deleteVehicleModel(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('MakeName'),
                        field: 'make'
                    },
                    {
                        name: app.localize('ModelName'),
                        field: 'name'
                    }
                    
                ],
                data: []
            };

            vm.getVehicleModels = function () {
                vm.loading = true;
                vehicleModelService.getVehicleModels(vm.filters).success(function (data) {
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function getMakes() {
                vm.loading = true;
                makeService.getMakes({}).success(function (data) {
                    vm.makes = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function openCreateOrEditVehicleModelModal(vehicleModelId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/vehiclemodels/createOrEditModal.cshtml',
                    controller: 'tenant.views.vehiclemodels.createOrEditModal as vm',
                    backdrop: 'static',
                    resolve: {
                        vehicleModelId: function () {
                            return vehicleModelId;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getVehicleModels();
                });
            }

            vm.createVehicleModel = function () {
                openCreateOrEditVehicleModelModal(null);
            };

            vm.editVehicleModel = function (vehicleModel) {
                openCreateOrEditVehicleModelModal(vehicleModel.id);
            };

            vm.deleteVehicleModel = function (vehicleModel) {
                abp.message.confirm(
                    app.localize('VehicleModelDeleteWarningMessage', vehicleModel.name),
                    function(isConfirmed) {
                        if (isConfirmed) {
                            vehicleModelService.deleteVehicleModel({
                                id: vehicleModel.id
                            }).success(function() {
                                vm.getVehicleModels();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            function initializeFilters() {
                getMakes();
            }
            
            initializeFilters();
            vm.getVehicleModels();
        }
    ]);
