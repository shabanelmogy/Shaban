// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:440293-440501
appModule.controller('tenant.views.hrm.overtime.createOrEditModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.overtime', 'overtimeId',
        function ($scope, $uibModal, $uibModalInstance, overtimeService, overtimeId) {

            var vm = this;
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

            vm.processReferesh = () => {
                vm.overtime = null;
                vm.skipCount = 0;
                vm.filters.fromDate = moment(vm.filters.monthYear).startOf('month').startOf('day');
                vm.filters.toDate = moment(vm.filters.monthYear).endOf('month').endOf('day').subtract(1, 'milliseconds');
                vm.isProcess = true;
                overtimeService.overtimeState(vm.filters)
                    .success((s) => {
                        vm.state = s;
                        if (s === 3) {
                            abp.message.warn('Unable to reprocess this month ,Overtime for this month is already Processed and Approved.');
                            vm.isProcess = false;
                        }
                        else if (s === 2) {
                            vm.isProcess = true;
                            vm.isOvertimeForSave = false;

                            abp.message.confirm(
                                'You want to Reprocess the overtime? Previously saved overtime for this month will be discarded',
                                'Are you sure?',
                                function (isConfirmed) {
                                    if (isConfirmed) {
                                        vm.filters.isReprocess = true;
                                        vm.process();
                                    }
                                    else {
                                        vm.filters.isReprocess = false;
                                        vm.process();
                                    }
                                }
                            );
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
                vm.filters.endDate = moment(vm.filters.monthYear).endOf('month').endOf('day').subtract(1, 'milliseconds');

                overtimeService.getStaffsOvertimes(vm.filters).success(function (data) {

                    vm.overtime = data;
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

                overtimeService.save({
                    fromDate: vm.filters.fromDate,
                    toDate: vm.filters.toDate,
                    staffOvertimes: vm.overtime
                })
                    .success((id) => {
                        //vm.overtime.id = id;
                        vm.isOverTimeForApprove = true;
                        vm.isSaved = true;
                        abp.notify.success("Successfully saved overtime.");
                    })
                    .finally(() => {
                        vm.isSaving = false;
                        vm.isOvertimeForSave = false;
                        $uibModalInstance.close();
                    });
            }

            vm.approved = () => {
                vm.isApproving = true;

                overtimeService.approved(vm.overtime.id)
                    .success(() => {
                        abp.notify.success("Successfully approved overtime.");
                    })
                    .finally(() => {
                        vm.isApproving = false;
                        vm.isOverTimeForApprove = false;
                        vm.isApproved = true;
                    });
            }

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

            function getOverTime() {
                if (overtimeId) {
                    vm.loading = true;
                    overtimeService.getOverTimeForEdit({ id: overtimeId }).success(
                        function (result) {
                            vm.overtime = result;
                        }).finally(function () {
                            vm.loading = false;
                        });
                }

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
                vm.filters = {
                    skipCount: 0,
                    maxResultCount: vm.batchSize
                };
                getOverTime();

            }
        }
    ]);
