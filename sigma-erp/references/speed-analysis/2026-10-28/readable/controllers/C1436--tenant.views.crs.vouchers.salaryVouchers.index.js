// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:394739-395031
appModule.controller('tenant.views.crs.vouchers.salaryVouchers.index', ['abp.services.app.purchaseOrder', 'abp.services.app.salaryVoucher', '$scope', '$uibModal', 'uiGridConstants', 'utilities', 'abp.services.app.businessUnit',
        function (purchaseOrdersService, salaryVouchersService, $scope, $uibModal, uiGridConstants, utilities, businessUnitService) {

            var vm = this;
            vm.loading = false;
            vm.isBusinessUnitWiseSettingEnabled = abp.setting.getBoolean("App.Speed.Hrm.IsBusinessUnitsWisePayrollProcess");
            vm.isBusinessUnitEnabled = abp.features.isEnabled("HRM.Business.Unit");
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
    
            vm.filters = {
                enableDateRange: true,
                voucherNo: null,
                fromDate: null,
                toDate: null,
                contactId: null,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
                paginate: true,
                salaryVoucherType: null,
                businessUnitId: null,
            }
            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            vm.salaryVoucherTypes = function (value) {
                if (value === 111) {
                    return 'Payroll';
                }
                else if (value === 112) {
                    return 'Leave Salary';
                }
                else
                {
                    return 'Final Settlement';
                }
            };

            vm.permissions = {              
                view: abp.auth.hasPermission('Pages.HRM.SalaryVoucher.View'),
                delete: abp.auth.hasPermission('Pages.HRM.SalaryVoucher.Delete'),
            };
            vm.dateRangeCheck = function () {

                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                //if (!vm.filters.enableDateRange) {
                //    vm.filters.fromDate = null;
                //    vm.filters.toDate = null;
                //}
            };

            vm.dateRangeModelChanged = function () {
                vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
            };

            vm.salaryVoucherType = [{ id: 111, name: 'Payroll' }, { id: 112, name: 'Leave Salary' }, { id: 113, name: 'Final Settlement' }];

            vm.isPrintEnabled = function (voucher) {
                return utilities.canPrintVoucher(voucher);
            };

            vm.getAllBusinessUnits = () => {
                vm.loading = true;
                businessUnitService.getBusinessUnits({}).success(function (data) {
                    vm.businessUnits = data;
                }).finally(function () {

                });
            }

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            function initDate() {
                vm.dateRangeModel = {
                    startDate: moment().add(-29, 'days').startOf('day'),
                    endDate: moment().endOf('day')
                };
            }

           
            vm.getSalaryVouchers = function () {

                vm.loading = true;

                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }

                if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
                //if (vm.filters.vehicle != null) {
                //    vm.filters.vehicleId = vm.filters.vehicle.id;
                //}
               
                salaryVouchersService.getSalaryVouchers(vm.filters).success(function (data) {
                    if (vm.dateRangeModel.startDate == null && vm.dateRangeModel.endDate == null)
                        initDate();
                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;


                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.exportToExcel = function () {
                vm.loading = true;              
                salaryVouchersService.exportToExcel(vm.filters)
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
                useExternalPagination: true,
                appScopeProvider: vm,
                columnDefs: [
                    {
                        name: app.localize('Actions'),
                        width: 120,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize('Actions') + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.viewSalaryVoucher(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-show="grid.appScope.isApprovedEnabled && !row.entity.isAuthorized && row.entity.status!=4" ng-if="grid.appScope.permissions.edit && grid.appScope.locationPermission(row.entity)" ng-click="grid.appScope.editPurchaseOrder(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },

                    {
                        name: app.localize('No'),
                        type: 'number',
                        field: 'voucherNo',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span >' + '{{row.entity.voucherNo}}' + '&nbsp' + '</span>' +
                            ' <span  ng-show="grid.appScope.isApprovedEnabled && !row.entity.isAuthorized && row.entity.status!=4" class="label label-warning">' + app.localize('Not Approved') + '</span>' +
                            ' <span  ng-show="grid.appScope.isApprovedEnabled && !row.entity.isAuthorized && row.entity.status==4" class="label label-danger">' + app.localize('Rejected') + '</span>' +
                            ' <span  ng-show="grid.appScope.isApprovedEnabled && row.entity.isAuthorized" class="label label-success">' + app.localize('Approved') + '</span>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Date'),
                        field: 'date',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.date)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Type'),
                        field: 'voucherSubTypeId',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.salaryVoucherTypes(row.entity.voucherSubTypeId)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('TotalAmount'),
                        type: 'number',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.roundingforView(row.entity.amount)}}</div>' +
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


                        vm.getSalaryVouchers();
                    });

                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getSalaryVouchers();
                    });
                },
                data: []
            };
          
            openPayrollApprovalModal = function (voucherId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/salaryVouchers/viewModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.salaryVouchers.viewModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        salaryVoucherId: function () {
                            return voucherId;
                        }
                    }
                });
            }

            vm.report = function () {
                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/crs/vouchers/salaryVouchers/report.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
            };

            vm.viewSalaryVoucher = function (salaryVoucher) {
                openPayrollApprovalModal(salaryVoucher.id);
            };

            vm.deletePurchaseOrder = function (purchaseOrder) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', purchaseOrder.voucherNo),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            purchaseOrdersService.deletePurchaseOrder({
                                id: purchaseOrder.id
                            }).success(function () {
                                vm.getSalaryVouchers();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            vm.enterKeyPress = function (eventOnKeyPress) {
                if (eventOnKeyPress.which === 13) {
                    vm.getSalaryVouchers();
                    eventOnKeyPress.preventDefault();
                }
            }

            function init() {
                initDate();
                // Get business units if setting is enabled
                if (vm.isBusinessUnitWiseSettingEnabled && vm.isBusinessUnitEnabled)
                    vm.getAllBusinessUnits();

                vm.getSalaryVouchers();
            }
            init();
        }]);
