// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:290171-290381
appModule.controller('tenant.views.crs.reports.vehiclesProfitAndLossByChassisNo.index', [
        '$scope', 'uiGridConstants', 'abp.services.app.profitAndLoss', 'utilities',
        function($scope, uiGridConstants, vehiclesProfitAndLoss, utilities) {
            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.expense = 0;
            vm.revenue = 0;               
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.getlocalDate = function(date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            vm.getVoucherType = function(type, subType) {
                return utilities.getVoucherType(type, subType);
            };

            vm.profitLoss = {                    
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
            };

            vm.dateRangeModel = {
                startDate: moment(moment().format('YYYY-MM-DD')).utc(),
                endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc(),
            };
                             
            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };                             

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            vm.getVehiclesProfitAndLossByChassisNo = function() {

                vm.loading = true;
                vm.profitLoss.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.profitLoss.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                   
                vehiclesProfitAndLoss.getVehicleProfitAndLossByChassisNo(vm.profitLoss).success(function(data) {
                    vm.gridOptions.data = data.items;
                    vm.expense = 0;
                    vm.revenue = 0;
                    angular.forEach(vm.gridOptions.data, function(row) {
                        vm.expense = vm.expense + row.debit;
                        vm.revenue = vm.revenue + row.credit;                         
                    });                                              
                    vm.revenue = vm.CurrencyFormate(vm.revenue);
                    vm.expense = vm.CurrencyFormate(vm.expense);
                }).finally(function() {
                    vm.loading = false;
                });
            };



            vm.gridOptions = {
                enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                paginationPageSizes: app.consts.grid.defaultPageSizes,
                paginationPageSize: app.consts.grid.defaultPageSize,
                appScopeProvider: vm,
                //useExternalPagination: true,
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
                        width: '15%',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.vehicle.plateNo}} <span ng-show="row.entity.vehicle.statusId==\'DFL\'" class="label label-danger">Defleeted</span></div>' +
                            '</div>',
                            
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
                        name: app.localize('Expense Type'),
                        field: 'voucher.expenseType',
                        width: '20%',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getExpenseType(row.entity)}}</div>' +
                            '</div>'
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
                    {
                        name: app.localize('Expense'),
                        headerCellClass: "text-center",
                        width: '15%',
                        cellTemplate: '<div style="text-align:right;margin-right:5px">{{grid.appScope.roundingforView(row.entity.debit)}}</div>',

                    },
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

            vm.getExpenseType = (vl) => {
                if (abp.features.isEnabled('CRS.Accounts') && vl.account) {
                    return `${vl.account.name} : ${vl.account.accountCode}`;
                } else if (vl.expenseType) {
                    return vl.expenseType.name;
                }
                return '';
            }

            vm.exportToExcelByChassisNo = function () {
                    vm.loading = true;

                    //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
                    //if null then get as following
                    //fromDate: get local date with time 00:00:00 and then convert to utc
                    //toDate: get local date of max time of night and then convert to utc
                vm.profitLoss.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.profitLoss.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();

                vehiclesProfitAndLoss.exportToExcelByChassisNo(vm.profitLoss)
                        .success(function (result) {
                            app.downloadTempFile(result);
                        }).finally(function () {
                            vm.loading = false;
                        });
                };                         
            }
    ]);
