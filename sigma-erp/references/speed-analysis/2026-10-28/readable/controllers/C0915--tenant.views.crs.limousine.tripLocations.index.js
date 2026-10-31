// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:247686-247836
appModule.controller('tenant.views.crs.limousine.tripLocations.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.tripLocation',
        function ($scope, $uibModal, uiGridConstants, tripLocationService) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.filters = {
                keyword: '',
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
            };
            vm.permissions = {
                create: abp.auth.hasPermission('Pages.Tenant.Limousine.TripLocations.Addnew'),
                view: abp.auth.hasPermission('Pages.Tenant.Limousine.TripLocations'),
                edit: abp.auth.hasPermission('Pages.Tenant.Limousine.TripLocations.Edit'),
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
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize('Actions') + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a ng-if="grid.appScope.permissions.view"   ng-click="grid.appScope.viewTripLocation(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.edit"   ng-click="grid.appScope.editTripLocation(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete" ng-click="grid.appScope.deleteTripLocation(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },

                    {
                        name: app.localize('Title'),
                        field: 'title',

                    },
                       {
                           name: app.localize('Detail'),
                           field: 'detail'
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

                        vm.getTripLocations();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getTripLocations();
                    });
                },
                data: []
            };

            function openCreateOrEditTripLocationModal(tripLocationId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/limousine/tripLocations/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.limousine.tripLocations.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        tripLocationId: function () {
                            return tripLocationId;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getTripLocations();
                });
            }
            function openViewTripLocationModal(tripLocationId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/limousine/tripLocations/viewTripLocationModal.cshtml',
                    controller: 'tenant.views.crs.limousine.tripLocations.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        tripLocationId: function () {
                            return tripLocationId;
                        }
                    }
                });

            }

            vm.addNewTripLocation = function () {
                openCreateOrEditTripLocationModal(null);
            };
            vm.viewTripLocation = function (tripLocation) {
                openViewTripLocationModal(tripLocation.id);

            };
            vm.editTripLocation = function (tripLocation) {
                openCreateOrEditTripLocationModal(tripLocation.id);
            };
            vm.deleteTripLocation = function (tripLocation) {
                abp.message.confirm(
                app.localize('DeleteWarningMessage'),
                function (isConfirmed) {
                    if (isConfirmed) {
                        tripLocationService.deleteTripLocation({
                            id: tripLocation.id
                        }).success(function () {
                            vm.getTripLocations();
                            abp.notify.success(app.localize('SuccessfullyDeleted'));
                        });
                    }
                }
                    );
            };
            vm.getTripLocations = function () {
                vm.loading = true;
                tripLocationService.getTripLocations(vm.filters).success(function (data) {
                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            }
            function init() {
                vm.getTripLocations();
            }

            init();
        }
    ]);
