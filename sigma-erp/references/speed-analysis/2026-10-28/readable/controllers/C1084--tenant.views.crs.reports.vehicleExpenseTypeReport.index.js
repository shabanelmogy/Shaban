// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:287078-287329
appModule.controller('tenant.views.crs.reports.vehicleExpenseTypeReport.index', [
        '$scope', 'uiGridConstants', 'abp.services.app.vehicleExpenseReport', 'abp.services.app.directory', '$uibModal', 'utilities', 'abp.services.app.vehicle', 'abp.services.app.expenseType',
        function ($scope, uiGridConstants, vehicleExpenseReportService, directoryService, $uibModal, utilities, vehicleService, expenseTypeService) {
            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.expense = 0;
            vm.revenue = 0;
            vm.suppliers = [];
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.filters = {};

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

            vm.dateRangeModel = {
                startDate: moment(moment().format('YYYY-MM-DD')).utc(),
                endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc(),
            };

            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en', {
                    minimumFractionDigits: 3,
                    maximumFractionDigits: 3
                });
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            vm.getVehicleExpenseTypeReport = function () {

                vm.loading = true;
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();

                vehicleExpenseReportService.getVehicleExpenseTypeReport(vm.filters).success(function (data) {
                    vm.gridOptions.data = data;
                    vm.data = data;
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
                        name: app.localize('Supplier'),
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
                        cellTemplate: '<div style="text-align:right;margin-right:5px">{{grid.appScope.CurrencyFormate(row.entity.credit)}}</div>',

                    },
                    {
                        name: app.localize('Expense'),
                        headerCellClass: "text-center",
                        width: '15%',
                        cellTemplate: '<div style="text-align:right;margin-right:5px">{{grid.appScope.roundingforView(row.entity.debit)}}</div>',

                    },
                ]
            };
            vm.searchContactPopoup = function () {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchContactModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchContactModal as vm',
                    backdrop: 'static',
                    resolve: {
                        category: function () {
                            return null;
                        },
                        type: function () {
                            return 3;
                        }
                    }
                }).result.then(function (supplier) {
                    if (supplier != null) {
                        vm.filters.supplier = supplier;
                        vm.filters.contactId = supplier.id;
                    }
                });
            };

            vm.getExpenseType = (vl) => {
                if (abp.features.isEnabled('CRS.Accounts') && vl.account) {
                    return `${vl.account.name} : ${vl.account.accountCode}`;
                } else if (vl.expenseType) {
                    return vl.expenseType.name;
                }
                return '';
            }
            vm.searchSupplier = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 3, }).then(function (response) {
                    vm.suppliers = response.data.items;
                });
            };
            vm.clearSupplier = function () {
                vm.filters.supplier = null;
                vm.filters.contact = null;
                vm.filters.contactId = null;
            };

            vm.searchVehicles = (select) => {
                vm.loading = true;
                vehicleService.searchVehicles({ plateNo: select.search })
                    .success(data => {
                        vm.vehicles = data.items;
                    })
                    .finally(() => {
                        vm.loading = false;
                    });
            }

            vm.changeVehicle = () => {
                vm.filters.vehicleId = vm.filters.vehicle.id;
            }

            vm.clearVehicle = () => {
                vm.filters.vehicleId = null;
                vm.filters.vehicle = null;
            }

            vm.searchExpenseTypes = (select) => {
                if (!vm.allExpenseTypes) {
                    vm.loading = true;
                    expenseTypeService.getExpenseTypes()
                        .success(data => {
                            vm.allExpenseTypes = data.items;
                            vm.expenseTypes = data.items;
                        })
                        .finally(() => {
                            vm.loading = false;
                        });
                }
                if (vm.allExpenseTypes) {
                    vm.expenseTypes = vm.allExpenseTypes.filter(o => o.name.includes(select.search));
                }
            }

            vm.changeExpenseType = () => {
                console.log(vm.filters.expenseType.id);
                vm.filters.expenseTypeId = vm.filters.expenseType.id;
            }

            vm.clearExpenseType = () => {
                vm.filters.expenseTypeId = null;
                vm.filters.expenseType = null;
            }
            vm.exportToExcel = function () {
                vm.loading = true;

                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();

                vehicleExpenseReportService.exportToExcelVehicleExpenseTypeReport(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };

        }]);
