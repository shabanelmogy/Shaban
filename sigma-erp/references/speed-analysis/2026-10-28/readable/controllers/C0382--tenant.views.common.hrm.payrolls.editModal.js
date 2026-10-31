// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:98827-98959
appModule.controller('tenant.views.common.hrm.payrolls.editModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.payroll', 'payrollId', 'utilities',
        function ($scope, $uibModal, $uibModalInstance, payrollService, payrollId, utilities) {

            var vm = this;
            vm.isSalesCommissionEnabled = abp.features.isEnabled("HRM.SalesCommission");
            vm.showOTAndHOTHours = utilities.parseBoolean(abp.setting.get("App.Speed.Hrm.ShowNormalAndHolidayOverTimeHoursInProcessedPayroll"));
            vm.isShowLeaveSalary = false;
            vm.isShowGratuity = false;
            vm.search = {
                query: ''
            };

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

            vm.openPayrollDetailModal = (payrollDetail) => {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/hrm/payrolls/payrollDetailModal.cshtml',
                    controller: 'tenant.views.common.hrm.payrolls.payrollDetailModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        payrollDetailId: function () {
                            return payrollDetail.id;
                        },
                        deductionLine: function () {
                            return null;
                        },
                        isEditDeduction: function () {
                            return false;
                        },
                    }
                });

                modalInstance.result.then(function (updatedPayrollDetail) {
                    const index = vm.payroll.payrollDetails.findIndex(p => p.id === updatedPayrollDetail.id);
                    if (index !== -1) {
                        const existingDetail = vm.payroll.payrollDetails[index];

                        // Partially update payrolldetail to compute total payroll sum after edit payroll detail
                        existingDetail.totalPayable = updatedPayrollDetail.totalPayable;
                        existingDetail.netPay = updatedPayrollDetail.netPay;
                        existingDetail.netSalary = updatedPayrollDetail.netSalary;
                        existingDetail.deductions = updatedPayrollDetail.deductions;
                        existingDetail.additional = updatedPayrollDetail.additional;
                        existingDetail.leaveSalary = updatedPayrollDetail.leaveSalary;
                        existingDetail.airTicket = updatedPayrollDetail.airTicket;
                        existingDetail.gratuity = updatedPayrollDetail.gratuity;
                    }

                    vm.totalPayrollAmount = 0;
                    vm.payroll.payrollDetails.forEach(function (detail) {
                        vm.totalPayrollAmount += detail.totalPayable;
                    });
                }, function () {

                });

            };

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
                            if (vm.payroll.payrollDetails[0].leaveSalary > 0) {
                                vm.isShowLeaveSalary = true;
                            }
                            if (vm.payroll.payrollDetails[0].gratuity > 0) {
                                vm.isShowGratuity = true;
                            }

                            // Calculate Sum
                            vm.payroll.payrollDetails.forEach(function (detail) {
                                vm.totalPayrollAmount += detail.totalPayable;
                            });
                        }
                    })
                    .finally(() => {
                        vm.loading = false;
                    });
            }

            vm.filteredPayrollDetails = function () {
                if (!vm.payroll || !vm.payroll.payrollDetails) {
                    return [];
                }

                var query = (vm.search && vm.search.query) ? vm.search.query.toLowerCase() : '';

                return vm.payroll.payrollDetails.filter(function (pd) {
                    var matchesCode = pd.staffCode.toLowerCase().includes(query);
                    var matchesName = (pd.staffFirstName + ' ' + pd.staffLastName).toLowerCase().includes(query);

                    return matchesCode || matchesName;
                });
            };

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
