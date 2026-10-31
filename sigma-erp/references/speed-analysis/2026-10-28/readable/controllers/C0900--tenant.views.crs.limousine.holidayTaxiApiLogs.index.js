// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:244222-244407
appModule.controller('tenant.views.crs.limousine.holidayTaxiApiLogs.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.limoTrip',
        function ($scope, $uibModal, uiGridConstants, limoTripsService) {
            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };
            vm.loading = false;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));

            vm.dateRangeModel = {
                startDate: moment(moment().format('YYYY-MM-DD')).utc(),
                endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc(),
            };

            vm.filters = {
                fromDate: moment().startOf('day').utc(),
                toDate: moment().endOf('day').utc(),
                manualTripNo: null,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
            };

            vm.mRefNoEnterKeyPress = function (eventOnKeyPress) {
                if (eventOnKeyPress.which === 13) {
                    vm.getHolidayTaxiApiLogs();
                    eventOnKeyPress.preventDefault();
                }
            };

            vm.getHolidayTaxiApiLogs = function () {
                vm.loading = true;
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                limoTripsService.getHolidayTaxiApiLogs(vm.filters).success(function (data) {
                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });;
            };



            vm.gridOptions = {
                enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                paginationPageSizes: app.consts.grid.defaultPageSizes,
                paginationPageSize: app.consts.grid.defaultPageSize,
                useExternalPagination: true,      
                useExternalSorting: true,
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
/*                            '      <li><a  ng-if="grid.appScope.permissions.edit"  ng-click="grid.appScope.editTripType(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a  ng-if="grid.appScope.permissions.tariffSettings" ng-click="grid.appScope.openSettings(row.entity)">' + app.localize('TariffSettings') + '</a></li>' +
                            '      <li><a  ng-if="grid.appScope.permissions.delete" ng-click="grid.appScope.deleteTripType(row.entity)">' + app.localize('Delete') + '</a></li>' +*/
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },

                    {
                        name: app.localize('ManualTripNo'),
                        width: 130,
                        field: 'manualTripNo',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" >{{row.entity.manualTripNo}}</div>' +
                            '</div>'
                    },

                    {
                        name: app.localize('FromDate'),
                        width: 120,
                        field: 'fromDate',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" >{{grid.appScope.getlocalDate(row.entity.fromDate)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('ToDate'),
                        width: 120,
                        field: 'toDate',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" >{{grid.appScope.getlocalDate(row.entity.toDate)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('LastActionDate'),
                        width: 150,
                        field: 'lastActionDate',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" >{{grid.appScope.getlocalDate(row.entity.lastActionDate)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Description'),
                        width: 300,
                        field: 'description',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" >{{row.entity.description}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Success'),
                        width: 120,
                        field: 'success',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                                 ' <span style="text-align: center;margin-left:25px;padding:2;">' + '{{row.entity.success}}' + '</span>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Error'),
                        width: 400,
                        field: 'error',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" >{{row.entity.error}}</div>' +
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

                        vm.getHolidayTaxiApiLogs();
                    });

                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;
                        vm.getHolidayTaxiApiLogs();
                    });
                },

                data: []
            };

            vm.getHolidayTaxiApiLogs();
        }
    ]);
