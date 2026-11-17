// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:277277-277637
appModule.controller('tenant.views.crs.reports.profitAndLossForMasterAgreement.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.profitAndLoss', 'abp.services.app.vehicle', 'abp.services.app.vehicleModel', 'utilities', 'abp.services.app.leaseMasterAgreement',
        function ($scope, $uibModal, uiGridConstants, vehiclesProfitAndLoss, vehicleService, vehicleModelService, utilities, leaseMasterAgreementService) {
                var vm = this;

                //$scope.$on('$viewContentLoaded', function () {
                //    App.initAjax();
                //});

                vm.loading = false;
                vm.models = null;              
                vm.dateRangeOptions = app.createDateRangePickerOptions();
                vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
                vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
                vm.dateFormat = abp.setting.get("App.General.DateFormat");
                vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

                vm.selectedVehicle = null;
            
                vm.profitLoss = {
                    //vehicleId: null,
                    agreementNo: null,
                    skipCount: 0,
                    maxResultCount: app.consts.grid.defaultPageSize,
                    enableDateRange: true,
                    startDate: null,
                    endDate: null,
                };
                //vm.dateRangeModel = {
                //    startDate: moment(moment().format('YYYY-MM-DD')).utc(),
                //    endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc(),
                //};
            vm.dateRangeModelChanged = function () {
                
                    vm.profitLoss.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                    vm.profitLoss.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
                };
            function initDate() {
                
                    vm.dateRangeModel = {
                        startDate: moment().add(-29, 'days').startOf('day'),
                        endDate: moment().endOf('day')
                    };
                }
            vm.dateRangeCheck = function () {

                    if (vm.profitLoss.enableDateRange) {
                        vm.profitLoss.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                        vm.profitLoss.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                    }
                    if (!vm.profitLoss.enableDateRange) {
                        vm.profitLoss.fromDate = null;
                        vm.profitLoss.toDate = null;
                    }
                }
                vm.searchVehicles = function ($select) {
                    if ($select.search == "") { vm.vehicles = null; return null; }
                    return vehicleService.searchVehicles({ includeDefleeted:true, plateNo: $select.search }).then(function (response) {
                        vm.vehicles = response.data.items;
                    });
                };
                vm.clearVehicle = function () {
                    vm.profitLoss.vehicle = null;
                };
                vm.searchModel = function ($select) {
                    vm.profitLoss.name = $select.search;
                    if (vm.profitLoss.name == '')
                        vm.profitLoss.name = "~";  //to avoid default suggestions

                    return vehicleModelService.searchPreUsedVehicleModels(vm.profitLoss).then(function (response) {
                        vm.models = response.data.items;
                    });
                };
                //Make/Model
                vm.clearModel = function () {
                    vm.profitLoss.model = null;
                    vm.profitLoss.modelId = null;
                };

               
                vm.vehicleOwnerships = [
                    { name: "Own", id: 1 },
                    { name: "External", id: 2 },
                   // { name: "BuyBack", id: 3 },
                    { name: "TempExternal", id: 4 }
                ];

                vm.searchVehiclePopup = function () {
                    openSearchVehicleModal();
                };


                vm.CurrencyFormate = function (amount) {
                    if (amount == null) return null;
                    return amount.toLocaleString('en');
                };

                function openSearchVehicleModal() {
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/tenant/views/crs/vehicles/searchVehicleModal.cshtml',
                        controller: 'tenant.views.crs.vehicles.searchVehicleModal as vm',
                        backdrop: 'static',
                        resolve: {
                            tariffGroup: function () {
                                return null;
                            },
                            options: function () {
                                return { fromDateTime: null, toDateTime:null, selectable:true }
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

            //vm.onMasterAgreementCall = function () {
            //    if (vm.profitLoss.agreementNo != null) {
            //        vm.getVehiclesProfitAndLoss();
            //    }
            //};
            vm.searchMasterAgreement = function ($select) {
                if ($select.search == "") { vm.masterAgreement = null; return null; }
                leaseMasterAgreementService.searchMasterAgreementsForVouchers({ keyword: $select.search }).then(function (response) {
                    vm.masterAgreement = response.data.items;
                });
            };
            vm.getVehiclesProfitAndLoss = function () {
                    vm.loading = true;
                    if (vm.profitLoss.enableDateRange) {
                        vm.profitLoss.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                        vm.profitLoss.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                    }
                    //vm.profitLoss.vehicleId = vehicle.id;
                    vehiclesProfitAndLoss.getVehiclesProfitAndLossForMasterAgreement(vm.profitLoss).success(function (data) {
                        /*if (vm.dateRangeModel.fromDate == null && vm.dateRangeModel.toDate == null) {
                            initDate();
                        }*/
                        vm.gridOptions.data = data.items;
                        vm.expense = 0;
                        vm.revenue = 0;
                        angular.forEach(vm.gridOptions.data, function (row) {
                            vm.expense = vm.expense + row.debit;
                            vm.revenue = vm.revenue + row.credit;
                            row.getProfitLoss = function () {
                                return this.credit - this.debit;
                            }

                        });
                        //  vm.netActivity = Number(vm.revenue - vm.expense).toFixed(1);
                        vm.netActivity = vm.CurrencyFormate(Number(vm.revenue - vm.expense));
                        vm.revenue = vm.CurrencyFormate(vm.revenue);
                        vm.expense = vm.CurrencyFormate(vm.expense);

                        
                    }).finally(function () {
                        vm.loading = false;
                    });
            };
            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };
            vm.getVoucherType = function (type, subType) {
                return utilities.getVoucherType(type, subType);
            };
            vm.getExpenseType = (vl) => {
                if (abp.features.isEnabled('CRS.Accounts') && vl.account) {
                    return `${vl.account.name} : ${vl.account.accountCode}`;
                } else if (vl.expenseType) {
                    return vl.expenseType.name;
                }
                return '';
            }
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
                            name: app.localize('Expense Type'),
                            field: 'voucher.expenseType',
                            width: '20%',
                            cellTemplate:
                                '<div class=\"ui-grid-cell\">' +
                                '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getExpenseType(row.entity)}}</div>' +
                                '</div>'
                        },
                        //{
                        //    name: app.localize('Payment Method'),
                        //    field: 'voucher.billingDetail.billingMethod.name',
                        //    width: '20%'
                        //},
                        {
                            name: app.localize('Description'),
                            field: 'description',
                            width: '15%'
                        },
                        {
                            name: app.localize('Revenue'),
                            headerCellClass: "text-center",
                            width: '20%',
                            cellTemplate: '<div style="text-align:right;margin-right:5px">{{grid.appScope.CurrencyFormate(row.entity.credit)}}</div>',

                        },
                        {
                            name: app.localize('Expense'),
                            headerCellClass: "text-center",
                            width: '15%',
                            cellTemplate: '<div style="text-align:right;margin-right:5px">{{grid.appScope.CurrencyFormate(row.entity.debit)}}</div>',

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

                vm.exportToExcel = function () {
                    vm.loading = true;

                    //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in profitLoss
                    //if null then get as following
                    //fromDate: get local date with time 00:00:00 and then convert to utc
                    //toDate: get local date of max time of night and then convert to utc
                    if (vm.profitLoss.enableDateRange) {
                        vm.profitLoss.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                        vm.profitLoss.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                    }
                    debugger;
                    vehiclesProfitAndLoss.exportToExcelForMasterAgreement(vm.profitLoss)
                        .success(function (result) {
                            app.downloadTempFile(result);
                        }).finally(function () {
                            vm.loading = false;
                        });
                };
                
               

                vm.exportToExcelWithSellingDetail = function () {
                    vm.loading = true;

                    vm.profitLoss.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.profitLoss.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                    debugger;
                    vehiclesProfitAndLoss.exportToExcelWithSellingDetail(vm.profitLoss)
                        .success(function (result) {
                            app.downloadTempFile(result);
                        }).finally(function () {
                            vm.loading = false;
                        });
                };


                vm.viewDetail = function (profitLoss) {
                    openProfitLossDetailModal(profitLoss.vehicle);
                }
                openProfitLossDetailModal = function (vehicle) {
                    
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/tenant/views/crs/reports/vehiclesProfitAndLoss/profitLossDetail.cshtml',
                        controller: 'tenant.views.crs.reports.vehiclesProfitAndLoss.profitLossDetail as vm',
                        backdrop: 'static',
                        
                        size: 'lg',
                        resolve: {
                            vehicle: function () {
                                return vehicle;
                            },
                            fromDate: function () {
                                return vm.profitLoss.fromDate;
                            },
                            toDate: function () {
                                return vm.profitLoss.toDate;
                            },
                            
                        }
                    });

                }
            function initializer() {
                initDate();
                vm.loading = false;
                //vm.getVehiclesProfitAndLoss();
            };
            initializer();
        }
    ]);
