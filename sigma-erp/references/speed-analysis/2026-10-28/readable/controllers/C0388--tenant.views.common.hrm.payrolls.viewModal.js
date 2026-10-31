// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:99983-100103
appModule.controller('tenant.views.common.hrm.payrolls.viewModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.payroll', 'payrollId', 'utilities', 'departmentId',
        function ($scope, $uibModalInstance, payrollService, payrollId, utilities, departmentId) {

            var vm = this;
            vm.isSalesCommissionEnabled = abp.features.isEnabled("HRM.SalesCommission");
            vm.showOTAndHOTHours = utilities.parseBoolean(abp.setting.get("App.Speed.Hrm.ShowNormalAndHolidayOverTimeHoursInProcessedPayroll"));
            vm.isDepartmentwiseSalaryPaymentForPayrollEnabled = utilities.parseBoolean(abp.setting.get("App.Speed.Hrm.DepartmentwiseSalaryPaymentForPayroll"));

            vm.departmentId = departmentId;
            vm.isShowLeaveSalary = false;
            vm.isShowGratuity = false;

            init(payrollId);

            vm.showSalaryType = (value) => {
                let salaryType = vm.salaryTypes.find(x => x.value === value);
                return salaryType.key;
            }

            vm.cancel = () => {
                $uibModalInstance.dismiss();
            };

            vm.rounding = (value) => {
                if (value === null) return null;

                return value.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            }

            function getPayroll() {
                vm.loading = true;

                payrollService.getPayroll({ id: payrollId })
                    .success((r) => {

                        //r.payrollDetails.forEach(pd => {

                        //    payrollCalculation(pd);
                        //});
                        vm.payroll = r;
                        // Show leave salary and gruity feilds
                        if (vm.payroll != null && vm.payroll.payrollDetails) {

                            var payrollDetails = vm.payroll.payrollDetails;

                            // Filter by department if departmentId is provided
                            if (vm.departmentId != null && vm.isDepartmentwiseSalaryPaymentForPayrollEnabled) {
                                payrollDetails = payrollDetails.filter(function (detail) {
                                    return detail.departmentId === vm.departmentId;
                                });
                            }

                            // Replace the list if you only want to display that department
                            vm.payroll.payrollDetails = payrollDetails;

                            if (payrollDetails.length > 0) {

                                if (payrollDetails[0].leaveSalary > 0) {
                                    vm.isShowLeaveSalary = true;
                                }

                                if (payrollDetails[0].gratuity > 0) {
                                    vm.isShowGratuity = true;
                                }

                                vm.totalPayrollAmount = 0;

                                payrollDetails.forEach(function (detail) {
                                    vm.totalPayrollAmount += detail.totalPayable;
                                });
                            }
                        }
                    })
                    .finally(() => {
                        vm.loading = false;
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
            function init(payrollId) {
                vm.loading = false;
                vm.totalPayrollAmount = 0;
                vm.salaryTypes = [
                    { value: 1, key: "Incentive" },
                    { value: 2, key: "Deduction" }
                ];
                getPayroll(payrollId);
            }
        }
    ]);
