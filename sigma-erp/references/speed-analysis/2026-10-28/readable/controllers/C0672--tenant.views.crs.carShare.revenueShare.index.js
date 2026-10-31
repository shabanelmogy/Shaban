// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:174696-174804
appModule.controller('tenant.views.crs.carShare.revenueShare.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.vehicle',
        function ($scope, $uibModal, uiGridConstants, vehicleService) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeModel = {
                startDate: moment(moment().format('YYYY-MM-DD')).utc(),
                endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc(),
            };
            vm.loading = false;
            vm.filters = {
                fleetCode: null,
                plateNo: '',
                statusId: '',
                skipCount: 0,
                pageNumber:1,
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
                        name: 'Car Share Revenue',
                        field: 'carShareRevenue'
                    },
                    {
                        name: 'Lessee Share (20%)',
                        field: 'lesseeRevenueShare'
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
                        vm.filters.pageNumber = pageNumber;
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
                        value.lessee = 'Name' + ' ' + ((key + 1));
                        value.carShareRevenue = Math.floor((Math.random() * 2000) + 1);
                        value.lesseeRevenueShare = Math.floor(value.carShareRevenue * 0.2);
                    });
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function initializeFilters() {
                vm.getVehicles();
            }

            initializeFilters();
        }
    ]);
