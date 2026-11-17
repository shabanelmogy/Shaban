// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:441731-442164
appModule.controller('tenant.views.hrm.salesCommission.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.salesCommission',
        function ($scope, $uibModal, uiGridConstants, salesCommissionService) {

            var vm = this;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat;
            var todayAsString = moment().format('YYYY-MM-DD');
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));

            vm.permissions = {
                view: abp.auth.hasPermission('Pages.HRM.SalesCommission.View'),
                edit: abp.auth.hasPermission('Pages.HRM.SalesCommission.Edit'),
                approve: abp.auth.hasPermission('Pages.HRM.SalesCommission.Approve'),
                delete: abp.auth.hasPermission('Pages.HRM.SalesCommission.Delete'),
            };

            vm.filters = {
                enableDateRange: true
            };
            function initDate() {
                vm.dateRangeModel = {
                    startDate: moment().add(-29, 'days').startOf('day'),
                    endDate: moment().endOf('day')
                };
            }
            vm.isGranted = (permission) => {
                return abp.auth.isGranted(permission);
            }

            vm.monthChanged = () => {
                vm.isProcessEnabled = true;
                vm.isOvertimeForSave = false;
                vm.isOverTimeForApprove = false;
                vm.isSaved = false;
                vm.isApproved = false;
            }

            //vm.processReferesh = () => {
            //    vm.salesCommissionList = null;
            //    vm.skipCount = 0;
            //    vm.filters.startDate = moment(vm.filters.monthYear).startOf('month').startOf('day');
            //    vm.filters.endDate = moment(vm.filters.monthYear).endOf('month').endOf('day').subtract(1, 'milliseconds');
            //    vm.isProcess = true;
            //    salesCommissionService.salesCommissionState(vm.filters)
            //        .success((s) => {
            //            vm.state = s;
            //            if (s === 3) {
            //                abp.message.warn('Unable to reprocess this month ,Sales Commission for this month is already Processed and Approved.');
            //                vm.isProcess = false;
            //            }
            //            else if (s === 2) {
            //                abp.message.warn('Sales Commission for this month already processed. If you want to re-process, delete record');
            //                vm.isProcess = false;
            //                $uibModalInstance.dismiss();
            //            }
            //            else {
            //                vm.isProcess = true;
            //                vm.isOvertimeForSave = false;
            //                vm.filters.isReprocess = false;

            //                vm.process();
            //            }
            //        });
            //}
            vm.dateRangeModelChanged = function () {
                vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
            };
            vm.dateRangeCheck = function () {
                if (vm.filters.enableDateRange) {
                    vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.startDate = null;
                    vm.filters.endDate = null;
                }
            };
            vm.getSalesCommissions = function () {
                vm.loading = true;

                if (vm.filters.enableDateRange) {
                    vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }

                if (vm.filters.staff != null) {
                    vm.filters.staffId = vm.filters.staff.id;
                }

                if (!vm.filters.enableDateRange) {
                    vm.filters.startDate = null;
                    vm.filters.endDate = null;
                }

                salesCommissionService.getAllSalesCommissions(vm.filters).success(function (data) {

                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;

                }).finally(function () {
                    vm.loading = false;
                });

            };
            //vm.process = () => {
            //    vm.loading = true
            //    vm.filters.startDate = moment(vm.filters.monthYear).startOf('month').startOf('day');
            //    vm.filters.endDate = moment(vm.filters.monthYear).endOf('month').endOf('day').subtract(1, 'milliseconds');

            //    salesCommissionService.getStaffsSalesCommissions(vm.filters).success(function (data) {

            //        vm.salesCommissionList = data;
            //        vm.salesCommissionCount = data.length;
            //        vm.loading = false;

            //    }).finally(function () {
            //        vm.isProcess = false;
            //        if (vm.state === 2 && !vm.filters.isReprocess) {
            //            vm.isPayrollForSave = false;
            //            vm.isPayrollForApprove = true;
            //        }
            //        else {
            //            vm.isOvertimeForSave = true;
            //        }
            //        vm.isProcessEnabled = false;
            //        //vm.isOvertimeForSave = false;
            //    });

            //}

            //vm.save = () => {
            //    vm.isSaving = true;

            //    overtimeService.save({
            //        fromDate: vm.filters.fromDate,
            //        toDate: vm.filters.endDate,
            //        staffOvertimes: vm.overtime
            //    })
            //        .success((id) => {
            //            //vm.overtime.id = id;
            //            vm.isOverTimeForApprove = true;
            //            vm.isSaved = true;
            //            abp.notify.success("Successfully saved overtime.");
            //        })
            //        .finally(() => {
            //            vm.isSaving = false;
            //            vm.isOvertimeForSave = false;
            //        });
            //}

            //Delete overtime
            vm.deleteSalesCommission = (salesCommission) => {
                abp.message.confirm(
                    'Are you sure? You want to delete',
                    function (isConfirmed) {
                        if (isConfirmed) {
                            salesCommissionService.delete({
                                id: salesCommission.id,
                            })
                                .success(() => {
                                    abp.notify.success("Sales Commission Deleted Successfully.");
                                    vm.getSalesCommissions();
                                })
                                .finally(() => {
                                });
                        }

                    }
                );
            }

            vm.rounding = (value) => {
                if (value === null) return null;

                return value.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            }
            vm.processSalesCommissionPopup = () => {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/hrm/salesCommission/salesCommissionProcessModal.cshtml',
                    controller: 'tenant.views.hrm.salesCommission.salesCommissionProcessModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        salesCommissionId: function () {
                        return null;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    //vm.getStaffRoles();
                });
            };

            vm.openCreateOrEditMOdal = (overTime) => {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/hrm/overtime/createOrEditModal.cshtml',
                    controller: 'tenant.views.hrm.overtime.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        overtimeId: function () {
                            return overTime.id;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    //vm.getStaffRoles();
                });
            };

            vm.openUpdateSalesCommissionModal = (salesCommission) => {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/hrm/salesCommission/updateSalesCommissionModal.cshtml',
                    controller: 'tenant.views.hrm.salesCommission.updateSalesCommissionModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        options: function () {
                            return salesCommission;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    //vm.getStaffRoles();
                });
            };

            //vm.openViewModal = (overtime) => {
            //    var modalInstance = $uibModal.open({
            //        templateUrl: '~/App/tenant/views/hrm/overtime/viewModal.cshtml',
            //        controller: 'tenant.views.hrm.overtime.viewModal as vm',
            //        backdrop: 'static',
            //        resolve: {
            //            overtimeDetail: function () {
            //                return overtime;
            //            }
            //        }
            //    });

            //    modalInstance.result.then(function (result) {
            //        if (result.id > 0) {
            //            abp.notify.info(app.localize('SavedSuccessfully'));
            //        }
            //    });
            //}
            vm.openViewModal = (salesCommission) => {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/hrm/salesCommission/viewModal.cshtml',
                    controller: 'tenant.views.hrm.salesCommission.viewModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        options: function () {
                            return salesCommission;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    if (result.id > 0) {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                    }
                });
            }

            vm.approveSalesCommission = function (salesCommission) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/hrm/salesCommission/salesCommissionApprovalModal.cshtml',
                    controller: 'tenant.views.hrm.salesCommission.salesCommissionApprovalModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        options: function () {
                            return salesCommission;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    if (result) {
                        vm.getSalesCommissions();
                    }
                });
            };

            vm.getlocalDateTime = function (date) {
                if (date !== null) {
                    return moment(date).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };
            vm.getStatusName = function (status) {
                if (status) {
                    return "Approved";
                }
                else {
                    return "UnApproved"
                }
            }
            function additionAndDeductionValues(pd) {
                pd.additionValues = [];
                pd.deductionValues = [];
                vm.additionHeaders.forEach(h => {
                    let v = pd.additionValues.find(x => x.name === h.name);
                    if (!v) {
                        let pl = pd.payrollLines.find(x => x.name === h.name);
                        pd.additionValues.push({ name: h.name, order: h.order, amount: pl ? pl.amount : 0 });
                    }

                });
                vm.deductionHeaders.forEach(h => {
                    let v = pd.deductionValues.find(x => x.name === h.name);
                    if (!v) {
                        let pl = pd.payrollLines.find(x => x.name === h.name);
                        pd.deductionValues.push({ name: h.name, order: h.order, amount: pl ? pl.amount : 0 });
                    }
                });
            }

            function init() {
                vm.additionHeaders = [];
                vm.deductionHeaders = [];
                vm.isProcessEnabled = false;
                vm.isProcess = false;
                vm.isOvertimeForSave = false;
                vm.isSaving = false;
                vm.isOverTimeForApprove = false;
                vm.isApproving = false;
                vm.skipCount = 0;
                vm.batchSize = 10;
                vm.totalCount = 0;
                vm.isSaved = false;
                vm.isApproved = false;
                vm.state = 1;
                initDate();
                vm.getSalesCommissions();
            }
            init();

            vm.gridOptions = {
                enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                paginationPageSizes: app.consts.grid.defaultPageSizes,
                paginationPageSize: app.consts.grid.defaultPageSize,
                useExternalPagination: true,
                appScopeProvider: vm,
                columnDefs: [
                    {
                        name: app.localize(' '),
                        enableSorting: false,
                        width: 55,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown " uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize(' ') + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a ng-click="grid.appScope.openViewModal(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="!row.entity.isApproved && grid.appScope.permissions.edit" ng-click="grid.appScope.openUpdateSalesCommissionModal(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="!row.entity.isApproved && grid.appScope.permissions.delete" ng-click="grid.appScope.deleteSalesCommission(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '      <li><a ng-show="!row.entity.isApproved && grid.appScope.permissions.approve" ng-click="grid.appScope.approveSalesCommission(row.entity)">' + app.localize('Approve') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    //{
                    //    name: app.localize('HolidayOTHours'),
                    //    field: 'holidayOTHours',
                    //},
                    ////{
                    ////    name: app.localize('Code'),
                    ////    field: 'Code',
                    ////},
                    //{
                    //    name: app.localize('NormalOTHours'),
                    //    field: 'normalOTHours',
                    //},
                    //{
                    //    name: app.localize('Designation'),
                    //    field: 'staff.designationName',
                    //},
                    //{
                    //    name: app.localize('Shift'),
                    //    field: 'shift.name',
                    //},
                    {
                        name: app.localize('From'),
                        field: 'from',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.from)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('To'),
                        field: 'to',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.to)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Status'),
                        field: 'status',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getStatusName(row.entity.isApproved)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('ApprovedBy'),
                        field: 'approvedByUser.userName',
                    },


                ],
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getSalesCommissions();
                    });
                },
                data: []
            };

        }
    ]);
