// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:128193-128378
appModule.controller('tenant.views.crs.monthEndClosing.index', [
        '$scope', 'uiGridConstants', 'abp.services.app.fiscalYear', 'abp.services.app.fiscalMonth',
        function ($scope, uiGridConstants, fiscalYearService, fiscalMonthsService) {

            var vm = this;
            vm.canUncloseFiscalMonth = abp.auth.hasPermission('Pages.Tenant.Accounts.UncloseMonthEnd');

            vm.fiscalYear = {
                startDate: null,
                endDate: null,
                id: null
            };
            vm.monthsList = [];
            //vm.monthsStatus = null;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.getMonthYear = function (date) { return date.add(1, 'days').format('MMM-YYYY'); };
            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
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
                        name: app.localize('Actions'),
                        enableSorting: false,
                        width: '20%',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize('Actions') + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a ng-if="row.entity.isClosed == false" ng-click="grid.appScope.closeFiscalMonth(row.entity.id)">' + app.localize('Close') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.canUncloseFiscalMonth && row.entity.isClosed && row.entity.canUnclose" ng-click="grid.appScope.uncloseFiscalMonth(row.entity.id)">' + app.localize('Unclose') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Month'),
                        width: '40%',
                        field: 'month'

                    },
                    {
                        name: app.localize('Status'),
                        field: 'isClosed',
                        width: '40%',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.monthStatus(row.entity.isClosed)}}</div>' +
                            '</div>'
                    }
                ],
                //onRegisterApi: function (gridApi) {
                //    $scope.gridApi = gridApi;
                //    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                //        if (!sortColumns.length || !sortColumns[0].field) {
                //            vm.filters.sorting = null;
                //        } else {
                //            vm.filters.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
                //        }

                //        vm.getFiscalYears();
                //    });
                //    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                //        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                //        vm.filters.maxResultCount = pageSize;

                //        vm.getFiscalYears();
                //    });
                //},
                data: []
            };

            vm.getOpenFiscalYears = function () {
                vm.loading = true;
                fiscalYearService.getOpenFiscalYears().success(function (data) {

                    vm.fiscalYears = data.items;
                }).finally(function () {
                    vm.loading = false;
                });

            };

            vm.getMonths = function () {
                vm.loading = true;
                var input = vm.fiscalYear;
                if (input == null) {
                    vm.loading = false;
                    vm.monthsList = [];
                    vm.gridOptions.data = vm.monthsList;
                    return;
                }
                //input.startDate = moment(moment(vm.fiscalYear.startDate).format('YYYY-MM-DD')).utc();
                //input.endDate = moment(moment(vm.fiscalYear.endDate).format('YYYY-MM-DD')).utc();
                input.fiscalYearId = vm.fiscalYear.id;
                //input.id = null;


                fiscalMonthsService.getFiscalMonths(input).success(function (data) {
                    vm.monthsList = [];
                    data.items.forEach(function (value) {
                        vm.monthsList.push(
                            {
                                id: value.id,
                                month: vm.getMonthYear(moment(moment(value.startDate).format('YYYY-MM-DD')).utc()),
                                isClosed: value.isClosed,
                                canUnclose: value.canUnclose,
                            });
                    });
                    vm.gridOptions.data = vm.monthsList;

                }).finally(function () {
                    vm.loading = false;
                });

            };

            vm.closeFiscalMonth = function (fiscalMonthid) {

                abp.message.confirm(
                    //app.localize('DeleteWarningMessage', fiscalYear.fineNo),
                    "Please make sure you have completed all financial transactions for this month. After month closing system will not allow any financial transaction for this month. Please confirm If you want to proceed.",
                    function (isConfirmed) {
                        if (isConfirmed) {
                            fiscalMonthsService.closeFiscalMonth({ id: fiscalMonthid })
                                .success(function () {
                                    vm.getMonths();
                                    abp.notify.success(app.localize('ClosedSuccessfully'));
                                }).error(function (data) {
                                    if (data) {
                                        setTimeout(()=>abp.message.info(data.message), 300);
                                    }

                                });
                        }
                    });
            };

            vm.uncloseFiscalMonth = function (fiscalMonthid) {

                abp.message.confirm(
                    //app.localize('DeleteWarningMessage', fiscalYear.fineNo),
                    "Are you sure you want to unclose it?",
                    function (isConfirmed) {
                        if (isConfirmed) {
                            fiscalMonthsService.uncloseFiscalMonth({ id: fiscalMonthid })
                                .success(function () {
                                    vm.getMonths();
                                    abp.notify.success(app.localize('UnclosedSuccessfully'));
                                });
                        }
                    });
            };

            vm.monthStatus = function (status) {
                if (status)
                    return "Closed";
                else
                    return "Open";
            };

            vm.getOpenFiscalYears();
        }
    ]);
