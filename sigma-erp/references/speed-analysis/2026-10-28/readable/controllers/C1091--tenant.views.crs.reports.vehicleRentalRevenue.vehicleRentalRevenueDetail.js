// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:288602-288795
appModule.controller('tenant.views.crs.reports.vehicleRentalRevenue.vehicleRentalRevenueDetail', [

        '$scope', '$uibModal', '$uibModalInstance', 'uiGridConstants', 'abp.services.app.profitAndLoss', 'abp.services.app.vehicle', 'vehicle','fromDate','toDate','utilities',

        function ($scope, $uibModal, $uibModalInstance, uiGridConstants, vehiclesProfitAndLoss, vehicleService, vehicle, fromDate, toDate, utilities) {
            var vm = this;
            
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            vm.isAccountFeatureEnabled = abp.features.isEnabled("CRS.Accounts");
            vm.expense = 0;
            vm.revenue = 0;
            vm.netActivity = 0;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.vehicle = vehicle;
            vm.loading = false;
            vm.vehicleRentalRevenue = {
                vehicle: null,
                vehicleId: null,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
                fromDate: fromDate,
                toDate: toDate
            }
            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };


            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            vm.getVoucherType = function (type, subType) {
                return utilities.getVoucherType(type, subType);
            };

            vm.getVehicleRentalRevenueDetail = function () {

                vm.loading = true;
                vm.vehicleRentalRevenue.vehicleId = vehicle.id;
                vehiclesProfitAndLoss.getVehicleRentalRevenueDetail(vm.vehicleRentalRevenue).success(function (data) {
                    vm.gridOptions.data = data.items;
                    vm.expense = 0;
                    vm.revenue = 0;
                    angular.forEach(vm.gridOptions.data, function (row) {
                        vm.expense =vm.expense + row.debit;
                        vm.revenue = vm.revenue + row.credit;
                        row.getMakeAndModel = function () {
                            if (this.vehicle != null)
                                return this.vehicle.model.make.name + ' ' + this.vehicle.model.name;
                        };
                        row.getvehicleRentalRevenue = function () {
                            return this.credit - this.debit;
                        }

                    });
                }).finally(function () {
                    vm.loading = false;
                });
            };




            vm.exportToExcelDetails = function () {
                vm.loading = true;
                vehiclesProfitAndLoss.detailsVehicleRentalRevenueExportToExcel(vm.vehicleRentalRevenue)
                    .success(function (result) {
                        app.downloadTempFile(result);
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
                        name: app.localize('Date'),
                        field: 'voucher.date',
                        width: '10%',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDate(row.entity.voucher.date)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('VoucherNo'),
                        width: '20%',
                        field: 'voucher.voucherNo'
                    },
                    {
                        name: app.localize('Type'),
                        field: 'voucher.type',
                        width: '20%',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getVoucherType(row.entity.voucher.type,row.entity.voucher.voucherSubTypeId)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Plate No'),
                        field: 'vehicle.plateNo',
                        width: '10%'
                    },
                    {
                        name: app.localize('Contact'),
                        field: 'voucher.contact.name',
                        width: '20%',
                    },
                    {
                        name: app.localize('Branch'),
                        field: 'voucher.location.name',
                        width: '20%'
                    },
                    {
                        name: app.localize('Payment Method'),
                        field: 'voucher.billingDetail.billingMethod.name',
                        width: '20%'
                    },
                    {
                        name: app.localize('Description'),
                        field: 'description',
                        width: '15%'
                    },
                    {
                        name: app.localize('Revenue'),
                        headerCellClass: "text-center",
                        width: '20%',
                        cellTemplate: '<div style="text-align:right;margin-right:5px">{{grid.appScope.roundingforView(row.entity.credit)}}</div>',

                    },
                   
                ],
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (!sortColumns.length || !sortColumns[0].field) {
                            vm.vehicleRentalRevenue.sorting = null;
                        } else {
                            vm.vehicleRentalRevenue.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
                        }

                        vm.getVehicleRentalRevenueDetail();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.vehicleRentalRevenue.skipCount = (pageNumber - 1) * pageSize;
                        vm.vehicleRentalRevenue.maxResultCount = pageSize;

                        vm.getVehicleRentalRevenueDetail();
                    });
                },
                data: []
            };

            vm.getExpenseType = (vl) => {
                if (abp.features.isEnabled('CRS.Accounts') && vl.account) {
                    return `${vl.account.name} : ${vl.account.accountCode}`;
                } else if (vl.expenseType) {
                    return vl.expenseType.name;
                }
                return '';
            }

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            }

            vm.getVehicleRentalRevenueDetail();
        }
    ]);
