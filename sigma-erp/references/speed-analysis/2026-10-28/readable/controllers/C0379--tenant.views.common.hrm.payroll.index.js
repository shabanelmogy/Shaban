// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:98448-98735
appModule.controller('tenant.views.common.hrm.payroll.index', [
        '$scope', '$uibModal', 'abp.services.app.payroll', 'abp.services.app.businessUnit',
        function ($scope, $uibModal, payrollService, businessUnitService) {

            var vm = this;
            vm.isSalesCommissionEnabled = abp.features.isEnabled("HRM.SalesCommission");
            vm.isBusinessUnitWisePayrollProcess = abp.setting.getBoolean("App.Speed.Hrm.IsBusinessUnitsWisePayrollProcess");
            /*init();*/

            vm.isGranted = (permission) => {
                return abp.auth.isGranted(permission);
            }

            vm.monthChanged = () => {
                vm.isProcessEnabled = true;
                vm.isPayrollForSave = false;
                vm.isPayrollForApprove = false;
                vm.isSaved = false;
                vm.isApproved = false;
            }

            vm.processReferesh = () => {
                vm.payroll = null;
                vm.skipCount = 0;
                vm.filters.fromDate = moment(vm.filters.monthYear).startOf('month').startOf('day');
                vm.filters.toDate = moment(vm.filters.monthYear).endOf('month').endOf('day').subtract(1, 'milliseconds');
                vm.filters.businessUnitId = vm.businessUnitId; // Setting base payroll processing
                vm.isProcess = true;
                payrollService.processState(vm.filters)
                    .success((s) => {
                        vm.state = s;
                        if (s === 3) {
                            abp.message.warn('Unable to reprocess this month ,Payroll for this month is already Processed and Approved.');
                            vm.isProcess = false;
                        }
                        else if (s === 2) {
                            vm.isProcess = true;
                            vm.isPayrollForSave = false;

                            abp.message.confirm(
                                'You want to Reprocess the payroll? Previously saved payroll for this month will be discarded',
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
                            vm.isPayrollForSave = false;
                            vm.filters.isReprocess = false;

                            vm.process();
                        }
                    });
            }


            vm.process = () => {
                vm.filters.skipCount = vm.skipCount;

                payrollService.process(vm.filters)
                    .success((r) => {
                        let payroll = r.payroll;
                        vm.totalCount = r.totalCount;
                        payroll.payrollDetails.forEach(pd => {
                            pd.payrollLines.forEach(pl => {
                                if (pl.type === 1 && !vm.additionHeaders.find(ah => ah.name === pl.name)) {
                                    vm.additionHeaders.push({ name: pl.name, order: pl.order });
                                }
                                else if (pl.type === 2 && !vm.deductionHeaders.find(dh => dh.name === pl.name)) {
                                    vm.deductionHeaders.push({ name: pl.name, order: pl.order });
                                }
                            });

                            additionAndDeductionValues(pd);
                            //payrollCalculation(pd);

                            pd.getSalaryItemAmount = (name) => {
                                let salaryItem = pd.payrollLines.find(pl => pl.name === name);
                                return salaryItem ? salaryItem.amount : 0;
                            }
                        });

                        if (!vm.payroll)
                            vm.payroll = payroll;
                        else {
                            payroll.payrollDetails.forEach(pd => {
                                vm.payroll.payrollDetails.push(pd);
                            });
                        }
                        vm.payroll.payrollDetails.sort((pd1, pd2) => pd1.netPay < pd2.netPay ? 1 : -1);

                        vm.skipCount = vm.skipCount + vm.batchSize;
                        if (vm.skipCount < vm.totalCount)
                            vm.process();
                        else {
                            vm.isProcess = false;
                            if (vm.state === 2 && !vm.filters.isReprocess) {
                                vm.isPayrollForSave = false;
                                vm.isPayrollForApprove = true;
                            }
                            else {
                                vm.isPayrollForSave = true;
                            }
                            vm.isProcessEnabled = false;
                        }
                    })
                    .error((error) => {
                        vm.isProcess = false;
                    });
            }


            vm.save = () => {
                vm.isSaving = true;

                payrollService.save({
                    fromDate: vm.filters.fromDate,
                    toDate: vm.filters.toDate,
                    payroll: vm.payroll
                })
                    .success((id) => {
                        vm.payroll.id = id;
                        vm.isPayrollForApprove = true;
                        vm.isSaved = true;
                        abp.notify.success("Successfully saved payroll.");
                    })
                    .finally(() => {
                        vm.isSaving = false;
                        vm.isPayrollForSave = false;
                    });
            }

            vm.approved = () => {
                vm.isApproving = true;

                payrollService.approved(vm.payroll.id)
                    .success(() => {
                        abp.notify.success("Successfully approved payroll.");
                    })
                    .finally(() => {
                        vm.isApproving = false;
                        vm.isPayrollForApprove = false;
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
                    let index = vm.payroll.payrollDetails.findIndex(pd => pd.staffId === result.staffId);
                    additionAndDeductionValues(result);
                    vm.payroll.payrollDetails[index] = result;
                    if (result.id > 0) {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                    }
                });
            }
            vm.openPayrollDetailModal = (payrollDetail, val) => {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/hrm/payroll/payrollDetailModal.cshtml',
                    controller: 'tenant.views.common.hrm.payroll.payrollDetailModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        payrollDetail: function () {
                            return payrollDetail;
                        },
                        category: val
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
            function payrollCalculation(pd) {
                pd.basic = 0;
                pd.allowances = 0;
                pd.gross = 0;
                pd.overTime = 0;
                pd.additional = 0;
                pd.deductions = 0;
                pd.netPay = 0;
                pd.payrollLines.forEach(pl => {
                    if (pl.salaryItem.id == 1) {
                        pd.basic = pl.amount;
                    }
                    else if (pl.salaryItem.subCategory == 1) {
                        pd.allowances += pl.amount;
                    }
                    else if (pl.salaryItem.id == 29) {
                        pd.gross = pl.amount;
                    }
                    else if (pl.salaryItem.category == 2) {
                        if (pl.salaryItem.id == 30) {
                            pd.overTime += pl.amount * 2;
                        }
                        else if (pl.salaryItem.id == 31) {
                            pd.overTime += pl.amount * 3;
                        }
                    }
                    else if (pl.salaryItem.category == 4) {
                        pd.deductions += pl.amount;
                    }
                });
                pd.netPay = pd.gross + pd.overTime + pd.additional - pd.deductions;
            }

            vm.getAllBusinessUnits = () => {
                vm.loading = true;
                businessUnitService.getBusinessUnits({}).success(function (data) {
                    vm.businessUnits = data;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();

            function init() {

                // Get business units if setting is enabled
                if (vm.isBusinessUnitWisePayrollProcess)
                    vm.getAllBusinessUnits();

                vm.additionHeaders = [];
                vm.deductionHeaders = [];
                vm.isProcessEnabled = false;
                vm.isProcess = false;
                vm.isPayrollForSave = false;
                vm.isSaving = false;
                vm.isPayrollForApprove = false;
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
