// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:175233-175363
appModule.controller('tenant.views.crs.carShare.vehicles.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.vehicle',
        function ($scope, $uibModal, uiGridConstants, vehicleService) {

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
                maxResultCount: app.consts.grid.defaultPageSize,
            };

            vm.getStatusShared = function (status) {
                return status == 'Shared' ? true : false;
            };
            vm.getStatusUnShared = function (status) {
                return status == 'Un Shared' ? true : false;
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
                        enableSorting: false,
                        width: 120,
                        cellTemplate:
                            //grid.appScope.permissions.onfleet &&
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize('Actions') + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a ng-if="row.entity.status == \'Shared\'" ng-click="grid.appScope.unShareVehicle(row.entity)">' + 'Un Share' + '</a></li>' +
                            '      <li><a ng-if="row.entity.status == \'Un Shared\'" ng-click="grid.appScope.shareVehicle(row.entity)">' + 'Share' + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
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
                         name: 'Lessee',
                         field: 'lessee'
                     },
                    {
                        name: 'Lease Agreement',
                        field: 'leaseAgreement'
                    },
           {
               name: app.localize('Status'),
               field: 'modelYear',
               cellTemplate:
               '<div class=\"ui-grid-cell-contents\">' +
               ' <span class="label label-success" style="background-color:#44B6AE" ng-show="grid.appScope.getStatusShared(row.entity.status)">' + '{{row.entity.status}}' + '</span>' +
               ' <span class="label label-warning" style="background-color:#FF7F50" ng-show="grid.appScope.getStatusUnShared(row.entity.status)">' + 'Not Shared' + '</span>' +
                 '</div>'
           },
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
                    vm.gridOptions.data.forEach(function (value, key) {
                        value.leaseAgreement = 'Les000'+(key+1);
                        value.lessee = 'Name' +' '+ (key+1);
                        if (key < vm.gridOptions.data.length / 2)
                            value.status = 'Shared';
                        else
                            value.status = 'Un Shared';
                    });
                }).finally(function () {
                    vm.loading = false;
                });
            };
            vm.shareVehicle = function (vehicle) {
                vehicle.status = "Shared";
            };
            vm.unShareVehicle = function (vehicle) {
                vehicle.status = "Un Shared";
            };

            function initializeFilters() {
                vm.getVehicles();
            }

            initializeFilters();
        }
    ]);
