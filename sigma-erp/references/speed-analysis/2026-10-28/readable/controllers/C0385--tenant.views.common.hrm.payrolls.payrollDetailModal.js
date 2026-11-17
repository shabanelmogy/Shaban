// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:99538-99707
appModule.controller('tenant.views.common.hrm.payrolls.payrollDetailModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.payroll', 'payrollDetailId', 'abp.services.app.salaryItemsSetting', 'utilities', 'deductionLine', 'isEditDeduction',
        function ($scope, $uibModal, $uibModalInstance, payrollService, payrollDetailId, salaryItemsSettingService, utilities, deductionLine, isEditDeduction) {

            var vm = this;

            if (isEditDeduction) {
                vm.deductionLine = deductionLine;
                vm.originalAmount = deductionLine.amount;

                vm.cancel = function () {
                    $uibModalInstance.close();
                };

                vm.toggleCheckbox = function (selected) {
                    if (typeof vm.originalAmount === 'undefined') {
                        vm.originalAmount = vm.deductionLine.amount;
                    }

                    if (vm.deductionLine[selected]) {
                        vm.deductionLine.isPassedOver = false;
                        vm.deductionLine.isWaivedOff = false;
                        vm.deductionLine.isEditPartialDeduction = false;

                        vm.deductionLine.amount = vm.originalAmount;
                    } else {
                        vm.deductionLine.isPassedOver = false;
                        vm.deductionLine.isWaivedOff = false;
                        vm.deductionLine.isEditPartialDeduction = false;

                        vm.deductionLine[selected] = true;

                        if (selected === 'isPassedOver' || selected === 'isWaivedOff') {
                            vm.deductionLine.amount = 0;
                        } else if (selected === 'isEditPartialDeduction') {
                            vm.deductionLine.amount = vm.originalAmount;
                        }
                    }
                };

                return;
            }

            vm.isSalesCommissionEnabled = abp.features.isEnabled("HRM.SalesCommission");
            vm.isShowLeaveSalary = false;
            vm.isShowGratuity = false;

            vm.cancel = () => {
                $uibModalInstance.dismiss();
            };

            vm.roundingforView = function (value) {
                if (isNaN(value) || value === null) return 0;
                return utilities.roundforView(value, 2);
            };

            vm.getPayrollDetail = (payrollDetailId) => {
                vm.loading = true;

                payrollService.getPayrollDetailForEdit({ id: payrollDetailId })
                    .success((r) => {
                        vm.payrollDetail = r;

                        // Round amounts in lines
                        if (vm.payrollDetail && vm.payrollDetail.payrollLines) {
                            vm.payrollDetail.payrollLines.forEach(function (line) {
                                line.amount = vm.roundingforView(line.amount);
                            });
                        }

                        if (vm.payrollDetail) {
                            if (vm.payrollDetail.leaveSalary > 0) {
                                vm.isShowLeaveSalary = true;
                            }
                            if (vm.payrollDetail.gratuity > 0) {
                                vm.isShowGratuity = true;
                            }
                        }
                    })
                    .finally(() => {
                        vm.loading = false;
                    });
            }

            vm.savePayrollDetail = () => {
                vm.saving = true;

                payrollService.savePayrollDetail(vm.payrollDetail)
                    .success((r) => {
                        abp.notify.success("Successfully saved payroll.");
                        $uibModalInstance.close(r);
                    })
                    .finally(() => {
                        vm.saving = false;
                    });
            };

            vm.refreshDeductions = () => {
                vm.loading = true;

                payrollService.getUpdatedDeductions(vm.payrollDetail)
                    .success((result) => {
                        if (result && result.payrollLines) {

                            vm.payrollDetail.payrollLines = result.payrollLines;
                        }
                    })
                    .finally(() => {
                        vm.loading = false;

                    });
            };

            vm.openEditDeductionModal = function (deductionLine) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/hrm/payrolls/updateDeductionModal.cshtml',
                    controller: 'tenant.views.common.hrm.payrolls.payrollDetailModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        deductionLine: function () {
                            return deductionLine;
                        },
                        isEditDeduction: function () {
                            return true;
                        },
                        payrollDetailId: function () {
                            return payrollDetailId;
                        },
                    }
                });
            };

            vm.salaryType = function (value) {

                if (value === 65) {
                    return "Extra Deduction";
                }
                var matchingObjects = vm.salaryTypes.filter(function (obj) {
                    return obj.id === value;
                });
                if (matchingObjects)
                    return abp.localization.localize(matchingObjects[0].type);

            };

            vm.formatDateOnly = function (dateString) {
                var date = new Date(dateString);
                return isNaN(date.getTime()) ? '' : date.toISOString().substring(0, 10);
            };

            vm.rounding = (value) => {
                if (value === null) return null;

                return value.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            }

            salaryItemsSettingService.getSalaryItemTypes().success(function (data) {
                vm.salaryTypes = data;
            });


            function init(payrollDetailId) {
                vm.loading = false;
                vm.getPayrollDetail(payrollDetailId);
            }

            init(payrollDetailId);
        }
    ]);
