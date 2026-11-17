// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:173787-173974
appModule.controller('tenant.views.crs.bookings.listModal', [
        '$scope', '$uibModalInstance', 'uiGridConstants', 'abp.services.app.bookingSearch', 'vehicleStatus', 'vehicleOwnership','vehicleType',
        function ($scope, $uibModalInstance, uiGridConstants, bookingSearchService, bookingStatus, vehicleOwnership, vehicleType) {

            var vm = this;
            vm.date = moment();

            vm.subTitle = function () {
                var result = "";
                if (bookingStatus == 'Due') { result = "DueToCheck-Out"; }
                else if (bookingStatus == 'OverDue') { result = "OverDueCheck-Out"; }
                else if (bookingStatus == 'Opened') { result = "OpenedToday"; }
                else result = bookingStatus;
                return app.localize(result);
            };

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.filters = {
                bookingStatus: bookingStatus,
                vehicleOwnership: vehicleOwnership,
                vehicleType:vehicleType,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.DueToCloseCalender = function () {
                vm.loading = true;

                bookingSearchService.getDueBookings(
                    {
                        fromDate: moment(vm.date).startOf('day'),
                        toDate: moment(vm.date).endOf('day'),
                        vehicleOwnership: vehicleOwnership
                    }).success(function (data) {
                        vm.gridOptions.totalItems = data.totalCount;

                        vm.gridOptions.data = data.items;
                    }).finally(function () {
                        vm.loading = false;
                    });
            };

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('YYYY-MM-DD HH:mm');
                }
                else {
                    return "";
                }
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
                        name: app.localize('No'),
                        field: 'agreementNo',
                        type: 'number',
                        //width: 80
                        minWidth: 130
                    },
                    {
                        name: app.localize('VehicleNo'),
                        field: 'vehicle.plateNo',
                        minWidth: 120
                    },
                    {
                        name: app.localize('MakeAndModel'),
                        field: 'vehicle.makeAndModel',
                        minWidth: 120
                    },
                    {
                        name: app.localize('Customer'),
                        field: 'customer.name',
                        minWidth: 140
                    },
                    {
                        name: app.localize('PickupDate'),
                        field: 'startDate',
                        minWidth: 120,
                        cellTemplate:
                          '<div class=\"ui-grid-cell\">' +
                          '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.startDate)}}</div>' +
                          '</div>'
                    },
                    {
                        name: app.localize('ReturnDate'),
                        field: 'endDate',
                        minWidth: 120,
                        cellTemplate:
                           '<div class=\"ui-grid-cell\">' +
                           '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.endDate)}}</div>' +
                           '</div>'
                    },
                    {
                        name: app.localize('PickupLocation'),
                        field: 'location.name',
                        minWidth: 140,
                          cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div ng-if="row.entity.pickupLocationId" class=\"ui-grid-cell-contents\">{{row.entity.pickupLocation.title}}</div>' +
                            '<div ng-if="!row.entity.pickupLocationId" class=\"ui-grid-cell-contents\">{{row.entity.location}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Branch'),
                        field: 'location',
                        minWidth: 120
                    },
                    {
                        name: app.localize('VehicleType'),
                        field: 'tariffGroup',
                        minWidth: 120
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
                        vm.getBookings();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getBookings();
                    });
                },
                data: []
            };

            vm.getBookings = function () {
                vm.loading = true;

                if (vm.filters.bookingStatus == 'Due') {
                    vm.DueToCloseCalender();
                }
                else if (vm.filters.bookingStatus == 'OverDue') {


                    vm.filters.fromDate = moment().startOf('day');
                    vm.filters.toDate = moment().endOf('day')
                    bookingSearchService.getOverDueBookings(
                        vm.filters).success(function (data) {
                            vm.gridOptions.totalItems = data.totalCount;
                            vm.gridOptions.data = data.items;

                        }).finally(function () {
                            vm.loading = false;
                        });
                }
                else {

                    bookingSearchService.getBookings(vm.filters).success(function (data) {
                        vm.gridOptions.totalItems = data.totalCount;
                        vm.gridOptions.data = data.items;

                    }).finally(function () {
                        vm.loading = false;
                    });
                }
            };

            function init() {
                vm.getBookings();
            }

            init();
        }
    ]);
