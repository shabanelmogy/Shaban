// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:451611-451880
appModule.controller('tenant.views.vehicles.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.vehicle', 'abp.services.app.vehicleStatus', 'abp.services.app.location',
        function ($scope, $uibModal, uiGridConstants, vehicleService, vehicleStatusService, locationService) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.filters = {
                fleetCode: null,
                plateNo: '',
                statusId: '',
                skipCount: 0,
                locationId: '',
                maxResultCount: app.consts.grid.defaultPageSize,
            };
            vm.statuses = [];
         
            vm.permissions = {
                create: abp.auth.hasPermission('Pages.Tenant.Vehicles.Addnew'),
                view: abp.auth.hasPermission('Pages.Tenant.Vehicles.View'),
                edit: abp.auth.hasPermission('Pages.Tenant.Vehicles.Edit'),
                defleet: abp.auth.hasPermission('Pages.Tenant.Vehicles.DeFleet'),
                onfleet: abp.auth.hasPermission('Pages.Tenant.Vehicles.OnFleet'),
                'delete': abp.auth.hasPermission('Pages.Tenant.Vehicles.Delete')
            };
            vm.onfleetVehicle = function (vehicle) {

                openOnfleetVehicleModal(vehicle.id);
            };
            vm.locations = [];

            function openOnfleetVehicleModal(vehicleId) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/onfleetModal.cshtml',
                    controller: 'tenant.views.crs.vehicles.onfleetModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        vehicleId: function () {
                            return vehicleId;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getVehicles();
                });
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
                            '      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.viewVehicle(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.edit" ng-click="grid.appScope.editVehicle(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.defleet && row.entity.statusId == \'IDL\'" ng-click="grid.appScope.defleetVehicle(row.entity)">' + app.localize('Defleet') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.onfleet && row.entity.statusId == \'DFL\'" ng-click="grid.appScope.onfleetVehicle(row.entity)">' + app.localize('Onfleet') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete" ng-click="grid.appScope.deleteVehicle(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    //{
                    //    name: app.localize('FleetCode'),
                    //    field: 'fleetCode'
                    //},
                    {
                        name: app.localize('PlateNo'),
                        field: 'plateNo'
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
                    },
                    {
                        name: app.localize('Color'),
                        width: "8%",
                        field: 'exteriorColor',
                    },
                    {
                        name: app.localize('KMs'),
                        width: "8%",
                        type: 'number',
                        field: 'kMs'
                    },
                    {
                        name: app.localize('Status'),
                        field: 'status'
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
                vehicleService.getVehicles(vm.filters).success(function (data) {
                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function getLocations() {
                vm.loading = true;
                locationService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function getVehicleStatuses() {
                vm.loading = true;
                vehicleStatusService.getVehicleStatuses({}).success(function (data) {

                    vm.statuses = data.items;

                    if (vm.statuses && vm.statuses.length > 0) {
                        for (var i = 0 ; i < vm.statuses.length; i++) {
                            if (vm.statuses[i].id === 'BKD') {
                                vm.statuses.splice(i, 1);
                                break;
                            }
                        }
                    }

                }).finally(function () {
                    vm.loading = false;
                });
            };

            function openviewVehicleModal(vehicleId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/mcc/vehicles/viewModal.cshtml',
                    controller: 'tenant.views.vehicles.createOrEditModal as vm',
                    backdrop: 'static',
                    resolve: {
                        vehicleId: function () {
                            return vehicleId;
                        }
                    }
                });
            }

            vm.viewVehicle = function (vehicle) {
                openviewVehicleModal(vehicle.id);
            }

            function openCreateOrEditVehicleModal(vehicleId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/mcc/vehicles/createOrEditModal.cshtml',
                    controller: 'tenant.views.vehicles.createOrEditModal as vm',
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

            vm.createVehicle = function () {
                openCreateOrEditVehicleModal(null);
            };

            vm.editVehicle = function (vehicle) {
                openCreateOrEditVehicleModal(vehicle.id);
            };

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
            vm.defleetVehicle = function (vehicle) {

                opendefleetVehicleModal(vehicle.id);
            };

            function opendefleetVehicleModal(vehicleId) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/defleetModal.cshtml',
                    controller: 'tenant.views.crs.vehicles.defleetModal as vm',
                    backdrop: 'static',
                    size: 'md',
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

            function initializeFilters() {
                getVehicleStatuses();
                getLocations();
            }
            vm.exportToExcel = function () {
                vm.loading = true;
                vehicleService.getVehiclesExportToExcel(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };
           
            initializeFilters();
            //vm.getVehicles();
        }
    ]);
