// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:470770-470972
appModule.controller('tenant.views.stock.stockTransfer.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.stockTransfer', 
        function ($scope, $uibModal, uiGridConstants, stockTransferService ) {

            var vm = this;

            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");

            vm.loading = false;

            vm.filters = {
                enableDateRange: true,
                fromDate: null,
                toDate: null,
                voucherNo: null,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
            };

            vm.dateRangeModelChanged = function () {
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
            };

            function initDate() {
                vm.dateRangeModel = {
                    startDate: moment().add(-29, 'days').startOf('day'),
                    endDate: moment().endOf('day')
                };
            };

            vm.dateRangeCheck = function () {

                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format(abp.setting.get("App.General.DateFormat"))).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format(abp.setting.get("App.General.DateFormat"))).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
            };

            vm.getlocalDateTime = function (date) {
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
                        width: 120,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize('Actions') + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a ng-click="grid.appScope.openViewModal(row.entity.id)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="row.entity.job.status == 1" ng-click="grid.appScope.openCreateOrEditModel(row.entity.id)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="row.entity.job.status == 1" ng-click="grid.appScope.deleteItem(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('StockTransfer') + " " + app.localize('No'),
                        field: 'voucherNo',
                        minWidth: 100
                    },
                    {
                        name: app.localize('Date'),
                        field: 'date',
                        minWidth: 100,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.date)}}</div>' +
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
                        vm.getStockTransfers();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getStockTransfers();
                    });
                },
                data: []
            };

            vm.openCreateOrEditModel = function (stockTransferId) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/stock/stockTransfer/createOrEditModal.cshtml',
                    controller: 'tenant.views.stock.stockTransfer.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        options: function () {
                            return { id: stockTransferId };
                        }               

                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getStockTransfers();
                });
            };

            vm.openViewModal = function (stockTransferId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/stock/stockTransfer/viewModal.cshtml',
                    controller: 'tenant.views.stock.stockTransfer.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        options: function () {
                            return { id: stockTransferId };
                        }

                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getStockTransfers();
                });
            };

           
            vm.deleteItem = function (item) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', item.name),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            vm.loading = true;
                            itemIssueService.deleteItemIssue({ id: item.id })
                                .success(function (result) {
                                    abp.notify.info(app.localize('DeletedSuccessfully'));
                                    vm.getItemIssues();
                                }).error(function (result) {
                                    abp.notify.error(app.localize('Error'));
                                }).finally(function () {
                                    vm.loading = false;
                                });
                        }
                    }
                );
            };

            vm.getStockTransfers = function () {
                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate !== null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate !== null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                vm.loading = true;
                stockTransferService.getStockTransfers(vm.filters)
                    .success(function (data) {
                        if (vm.dateRangeModel.startDate == null && vm.dateRangeModel.endDate == null)
                            initDate();

                        vm.gridOptions.totalItems = data.totalCount;
                        vm.gridOptions.data = data.items;
                    }).finally(function () {
                        vm.loading = false;
                    });
            };


            function init() {
                initDate();
                vm.getStockTransfers();
            }

            init();

        }
    ]);
