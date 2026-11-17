// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:277015-277273
appModule.controller('tenant.views.crs.reports.profitAndLoss.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.profitAndLoss', 'abp.services.app.vehicle','utilities',
        function ($scope, $uibModal, uiGridConstants, vehiclesProfitAndLoss, vehicleService, utilities) {
            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.totalRevenue = 0;
            vm.totalExpense = 0;
            vm.totalProfitAndLoss = 0;
            vm.isAccountFeatureEnabled = abp.features.isEnabled("CRS.Accounts");
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.taxPercentage = abp.setting.get("App.General.TaxPercentage");
            vm.taxInclusive = abp.setting.get("App.General.TaxInclusive");
            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };
            vm.localize = function (input) {
                return app.localize(input);
            };
            vm.profitLoss = {
                vehicle: null,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,

            }

            vm.dateRangeModel = {
                startDate: moment(moment().format('YYYY-MM-DD')).utc(),
                endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc(),
            };

            vm.searchVehicles = function ($select) {
                if ($select.search == "") { vm.vehicles = null; return null; }
                return vehicleService.searchVehicles({ plateNo: $select.search }).then(function (response) {
                    vm.vehicles = response.data.items;
                });
            };

            vm.searchVehiclePopup = function () {
                openSearchVehicleModal();
            };


            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            vm.round = function (amount) {
                if (amount == null) return null;
                return utilities.round(amount,2);
            };

            function openSearchVehicleModal() {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/searchVehicleModal.cshtml',
                    controller: 'tenant.views.crs.vehicles.searchVehicleModal as vm',
                    backdrop: 'static',
                    resolve: {
                        tariffGroup: function () {
                            return null;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    if (result != null) {
                        vm.profitLoss.vehicle = result;
                        //   vm.vehicleSelected();
                    }
                });
            }



            vm.permissions = {
                detail: abp.auth.hasPermission('Pages.Tenant.Reports.VehiclesProfitAndLoss.Detail'),
            };
            vm.getExpenseTypeAmountSummary = function () {
                vm.loading = true;
                vehiclesProfitAndLoss.expenseTypeAmountSummary(vm.profitLoss).success(function (data) {
                    vm.expenseTypeSummary = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };
            //ExpenseTypeAmountSummary
            vm.getChargesTypeAmountSummary = function () {
                vm.loading = true;
                vehiclesProfitAndLoss.chargesTypeAmountSummary(vm.profitLoss).success(function (data) {
                    vm.chargesSummary = data.items;
                    vm.getExpenseTypeAmountSummary();
                }).finally(function () {
                    vm.loading = false;
                });
            };
            vm.getBranchWiseProfitAndLoss = function () {
                vm.loading = true;
                vm.profitLoss.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.profitLoss.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                vehiclesProfitAndLoss.getBranchWiseProfitAndLoss(vm.profitLoss).success(function (data) {
                    vm.getChargesTypeAmountSummary();
                    vm.gridOptions.data = data.items;
                    vm.prftLossList = data.items;
                    vm.totalExpense = 0;
                    vm.totalRevenue = 0;
                    vm.totalProfitAndLoss = 0;
                    angular.forEach(vm.prftLossList, function (row) {
                        vm.totalExpense = vm.totalExpense + row.debit;
                        vm.totalRevenue = vm.totalRevenue + row.credit;
                        vm.totalProfitAndLoss = vm.totalProfitAndLoss + row.profitLoss;

                    });

                    vm.totalExpense = Number(vm.totalExpense).toFixed(0)
                    vm.totalRevenue = Number(vm.totalRevenue).toFixed(0)
                    vm.totalProfitAndLoss = Number(vm.totalProfitAndLoss).toFixed(0)
                }).finally(function () {

                    vm.loading = false;
                });
            };


            vm.gridOptions = {
                enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                paginationPageSizes: app.consts.grid.defaultPageSizes,
                paginationPageSize: app.consts.grid.defaultPageSize,
                appScopeProvider: vm,
                enableSorting: false,
                columnDefs: [
                    {
                        name: app.localize('Location'),
                        field: 'location.name'
                    },
                    {
                        name: app.localize('Revenue'),
                        field: 'credit'
                    },
                    {
                        name: app.localize('Expense'),
                        field: 'debit'
                    },
                    {
                        name: app.localize('Profit/Loss'),
                        field: 'profitLoss'
                    }
                ],
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (!sortColumns.length || !sortColumns[0].field) {
                            vm.profitLoss.sorting = null;
                        } else {
                            vm.profitLoss.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
                        }

                        vm.getVehiclesProfitAndLoss();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.profitLoss.skipCount = (pageNumber - 1) * pageSize;
                        vm.profitLoss.maxResultCount = pageSize;

                        vm.getVehiclesProfitAndLoss();
                    });
                },
                data: []
            };



            vm.getProfitLossBreakUp = function (locationId,isExpense) {
                vm.loading = true;
                vm.profitLoss.locationId = locationId;
                vm.profitLoss.isExpense = isExpense;
                vm.profitLoss.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.profitLoss.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                vehiclesProfitAndLoss.getProfitLossBreakUp(vm.profitLoss).success(function (data) {
                    vm.breakUpReportData = data;
                    if (vm.breakUpReportData != null) {
                        vm.showDetailLines(vm.breakUpReportData.items);
                    }
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.showDetailLines = function (detailLines) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/reports/profitAndLoss/chargesBreakUpModal.cshtml',
                    controller: 'tenant.views.crs.reports.profitAndLoss.chargesBreakUpModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        detailLines: function () {
                            return detailLines;
                        }
                    }
                });

            };

            vm.exportToExcel = function () {
                vm.loading = true;

                //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
                //if null then get as following
                //fromDate: get local date with time 00:00:00 and then convert to utc
                //toDate: get local date of max time of night and then convert to utc
                vm.profitLoss.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.profitLoss.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();

                vehiclesProfitAndLoss.exportToExcel(vm.profitLoss)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };
            vm.viewDetail = function (profitLoss) {
                openProfitLossDetailModal(profitLoss.vehicle);
            }
            vm.getProfitAndLoss = function () {
                vm.loading = true;
                vm.profitLoss.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.profitLoss.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                vehiclesProfitAndLoss.getProfitAndLoss(vm.profitLoss).success(function (data) {
                    vm.reportData = data;
                }).finally(function () {
                    vm.loading = false;
                });
            }
            //   vm.getBranchWiseProfitAndLoss();
            function init() {
                vm.getProfitAndLoss();
            }
            init();
        }
    ]);
