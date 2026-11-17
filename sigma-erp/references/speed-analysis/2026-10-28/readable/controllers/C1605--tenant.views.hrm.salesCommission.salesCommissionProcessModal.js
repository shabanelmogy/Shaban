// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:442217-442474
appModule.controller('tenant.views.hrm.salesCommission.salesCommissionProcessModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.directory', 'abp.services.app.salesCommission',
        function ($scope, $uibModal, $uibModalInstance, directoryService, salesCommissionService) {

            var vm = this;
            var fromDate = null;
            var todate = null;
            init();

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

            vm.searchStaff = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customers). get customers
                return directoryService.search({ keyword: $select.search, contactType: 1, activeOnly: true }).then(function (response) {
                    vm.staffs = response.data.items;
                });
            };

            vm.processReferesh = () => {
                vm.salesCommissionList = null;
                vm.skipCount = 0;
                vm.filters.startDate = moment(vm.filters.monthYear).startOf('month').startOf('day');
                vm.filters.endDate = moment(vm.filters.monthYear).endOf('month').endOf('day').subtract(1, 'milliseconds');
                vm.isProcess = true;
                salesCommissionService.salesCommissionState(vm.filters)
                    .success((s) => {
                        vm.state = s;
                        if (s === 3) {
                            abp.message.warn('Unable to reprocess this month ,Sales Commission for this month is already Processed and Approved.');
                            vm.isProcess = false;
                        }
                        else if (s === 2) {
                            abp.message.warn('Sales Commission for this month already processed. If you want to re-process, delete record');
                            vm.isProcess = false;
                            $uibModalInstance.dismiss();
                        }
                        else {
                            vm.isProcess = true;
                            vm.isOvertimeForSave = false;
                            vm.filters.isReprocess = false;

                            vm.process();
                        }
                    });
            }
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            vm.process = () => {
                vm.loading = true
                vm.filters.startDate = moment(vm.filters.monthYear).startOf('month').startOf('day');
                toDate = vm.filters.endDate;
                vm.filters.endDate = moment(vm.filters.monthYear).endOf('month').endOf('day').subtract(1, 'milliseconds');
                fromDate = vm.filters.startDate;
                salesCommissionService.getStaffsSalesCommissions(vm.filters).success(function (data) {

                    vm.salesCommissionList = data;
                    vm.salesCommissionCount = data.length;
                    vm.loading = false;

                }).finally(function () {
                    vm.isProcess = false;
                    if (vm.state === 2 && !vm.filters.isReprocess) {
                        vm.isPayrollForSave = false;
                        vm.isPayrollForApprove = true;
                    }
                    else {
                        vm.isOvertimeForSave = true;
                    }
                    vm.isProcessEnabled = false;
                    //vm.isOvertimeForSave = false;
                });

            }


            vm.save = () => {
                vm.isSaving = true;

                // Check if the list is undefined or empty
                if (!vm.salesCommissionList || vm.salesCommissionList.length === 0) {
                    vm.isSaving = false;
                    return;
                }

                // Loop through each sales commission entry to ensure staffId is set
                vm.salesCommissionList.forEach(item => {
                    if (!item.staffId && item.staff) {
                        item.staffId = item.staff.id;
                    }
                    item.staff = null; // Set staff equal to null for save call
                });
                
                salesCommissionService.save({
                    fromDate: fromDate,
                    toDate: toDate,
                    staffSalesCommissions: vm.salesCommissionList
                })
                    .success((id) => {
                        vm.isOverTimeForApprove = true;
                        vm.isSaved = true;
                        abp.notify.success("Successfully saved sales commission.");
                    })
                    .finally(() => {
                        vm.isSaving = false;
                        vm.isOvertimeForSave = false;
                        $uibModalInstance.close();
                    });
            }


            //vm.save = () => {
            //    vm.isSaving = true;

            //    salesCommissionService.save({
            //        fromDate: vm.filters.startDate,
            //        toDate: vm.filters.endDate,
            //        staffSalesCommissions: vm.salesCommissionList
            //    })
            //        .success((id) => {
            //            //vm.overtime.id = id;
            //            vm.isOverTimeForApprove = true;
            //            vm.isSaved = true;
            //            abp.notify.success("Successfully saved sales commission.");
            //        })
            //        .finally(() => {
            //            vm.isSaving = false;
            //            vm.isOvertimeForSave = false;
            //            $uibModalInstance.close();
            //        });
            //}

            //vm.approved = () => {
            //    vm.isApproving = true;

            //    overtimeService.approved(vm.overtime.id)
            //        .success(() => {
            //            abp.notify.success("Successfully approved overtime.");
            //        })
            //        .finally(() => {
            //            vm.isApproving = false;
            //            vm.isOverTimeForApprove = false;
            //            vm.isApproved = true;
            //        });
            //}

            vm.rounding = (value) => {
                if (value === null) return null;

                return value.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            }

            vm.openEditModal = (payrollDetail) => {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/hrm/payroll/editModal.cshtml',
                    controller: 'tenant.views.common.hrm.payroll.editModal as vm',
                    backdrop: 'static',
                    resolve: {
                        payrollDetail: function () {
                            return payrollDetail;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    let index = vm.overtime.payrollDetails.findIndex(pd => pd.staffId === result.staffId);
                    additionAndDeductionValues(result);
                    vm.overtime.payrollDetails[index] = result;
                    if (result.id > 0) {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                    }
                });
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




            ///

            vm.removeSalesCommissionRow = function (row) {
                var index = vm.salesCommissionList.indexOf(row);
                vm.salesCommissionList.splice(index, 1);
            };


            vm.addSalesCommissionRow = function (row) {
                if (vm.salesCommissionList == undefined) {
                    vm.salesCommissionList = [];
                }
                vm.salesCommissionList.push(
                    {
                        staffId: null,
                        notes: null,
                        amount: 0,
                    });
            };


            ///






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
                vm.filters = {
                    skipCount: 0,
                    maxResultCount: vm.batchSize
                };
            }
        }
    ]);
