// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:482264-482422
appModule.controller('tenant.views.tms.tollFineCommon.vehicles',
        [
            '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.vehicle',
            function ($scope, $uibModal, uiGridConstants, vehicleService) {
                var vm = this;

                $scope.$on('$viewContentLoaded', function () {
                    App.initAjax();
                });

                vm.loading = false;
                vm.filters = {
                    plateNo: "",
                    eTag : ""
                };

                vm.createVehicle = function () {
                    openCreateOrEditVehicleModal(null);
                };

                vm.editVehicle = function(vehicle) {
                    openCreateOrEditVehicleModal(vehicle.id);
                }

                function openCreateOrEditVehicleModal(vehicleId) {
                    debugger;
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/tenant/views/tms/tollFineCommon/vehicles/createOrEditModal.cshtml',
                        controller: 'tenant.views.tms.tollFineCommon.vehicles.createOrEditModal as vm',
                        backdrop: 'static',
                        resolve: {
                            vehicleId: function () {
                                return vehicleId;
                            }
                        }
                    });

                    modalInstance.result.then(function (result) {
                        vm.getVehicles();
                    });
                }

                vm.viewVehicle = function (vehicle) {
                    openviewVehicleModal(vehicle.id);
                }
                function openviewVehicleModal(vehicleId) {
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/tenant/views/tms/tollFineCommon/vehicles/viewModal.cshtml',
                        controller: 'tenant.views.tms.tollFineCommon.vehicles.createOrEditModal as vm',
                        backdrop: 'static',
                        resolve: {
                            vehicleId: function () {
                                return vehicleId;
                            }
                        }
                    });
                }

                vm.deleteVehicle = function (vehicle) {
                    abp.message.confirm(
                        app.localize('VehicleDeleteWarningMessage', vehicle.name),
                        function (isConfirmed) {
                            if (isConfirmed) {
                                vehicleService.deleteVehicle({
                                    id: vehicle.id
                                }).success(function () {
                                    vm.getVehicles();
                                    abp.notify.success(app.localize('SuccessfullyDeleted'));
                                });
                            }
                        }
                    );
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
                            width: 120,
                            cellTemplate:
                                '<div class=\"ui-grid-cell-contents\">' +
                                '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                                '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize('Actions') + ' <span class="caret"></span></button>' +
                                '    <ul uib-dropdown-menu>' +
                                '      <li><a ng-click="grid.appScope.viewVehicle(row.entity)">' + app.localize('View') + '</a></li>' +
                                '      <li><a ng-click="grid.appScope.editVehicle(row.entity)">' + app.localize('Edit') + '</a></li>' +
                                '      <li><a ng-click="grid.appScope.deleteVehicle(row.entity)">' + app.localize('Delete') + '</a></li>' +
                                '    </ul>' +
                                '  </div>' +
                                '</div>'
                        },
                        {
                            name: app.localize('PlateNo'),
                            field: 'plateNo'
                        },
                        {
                            name: app.localize('TagNo'),
                            field: 'eTag'
                        },
                        {
                            name: app.localize('ChassisNo'),
                            field: 'chassisNo'
                        },
                        {
                            name: app.localize('Make'),
                            field: 'model.make'
                        },
                        {
                            name: app.localize('Model'),
                            field: 'model.name'
                        },
                        {
                            name: app.localize('Year'),
                            field: 'modelYear'
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
                            vm.getVehicles();
                        });
                        gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                            vm.filters.skipCount = (pageNumber - 1) * pageSize;
                            vm.filters.maxResultCount = pageSize;

                            vm.getVehicles();
                        });
                    },
                    data: []
                };

                vm.getVehicles = function () {
                    vm.loading = true;
                    vehicleService.getVehiclesForTms(vm.filters).success(function (data) {
                        vm.gridOptions.totalItems = data.totalCount;
                        vm.gridOptions.data = data.items;
                    }).finally(function () {
                        vm.loading = false;
                    });
                };

                function init() {
                    vm.getVehicles();
                }

                init();
            }
        ]);
