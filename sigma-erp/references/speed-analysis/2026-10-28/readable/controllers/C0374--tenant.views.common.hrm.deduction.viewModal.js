// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:96876-96972
appModule.controller('tenant.views.common.hrm.deduction.viewModal', [
        '$uibModalInstance', 'abp.services.app.directory', 'abp.services.app.deduction', 'utilities', 'options', 'abp.services.app.salaryItemsSetting',
        function ($uibModalInstance, directoryService, deductionService, utilities, options, salaryItemsSettingService) {

            var vm = this;
            vm.loading = false;
            vm.totalPaidAmount = 0;
            var deductionId = options.id;

            //functions
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };

            vm.getTypeOfDeduction = function (salaryItemId) {

                if (salaryItemId != null && vm.salaryTypes != null) {
                    var salaryType = vm.salaryTypes.find(salaryType => salaryType.id === salaryItemId);

                    if (salaryType != null) {

                        if (salaryType.id == 65)
                            return abp.localization.localize("Extra Deduction" || '');

                        return abp.localization.localize(salaryType.type || '');
                    }
                }
                return '';
            };

            vm.getStatusTypes = function (status) {
                if (status == 0) {
                    return app.localize("Pending");
                } else if (status == 1) {
                    return app.localize("Deducted");
                } else if (status == 1) {
                    return app.localize("WaivedOff");
                } else {
                    return "";
                }
            };
            vm.getDeductionEmiStatus = function (status) {
                if (status == 1) {
                    return app.localize("Payroll");
                } else if (status == 2) {
                    return app.localize("Cash");
                } else {
                    return "";
                }
            };
            //vm.getTypeOfDeduction = function (type) {
            //    if (type == 1) {
            //        return app.localize("LoanDeduction");
            //    } else if (type == 2)
            //        return app.localize("AdvanceDeduction");
            //    else if (type == 3)
            //        return app.localize("FinesDeduction");
            //    else if (type == 4)
            //        return app.localize("ExtraDeduction");
            //    else {
            //        return "";
            //    }
            //};
            function init() {
                vm.loading = true;
                deductionService.getDeductionForView({ id: deductionId }).success(
                    function (result) {
                        vm.deduction = result;
                        if (vm.deduction.deductionDetails && vm.deduction.deductionDetails.length > 0) {
                            vm.totalPaidAmount = vm.deduction.deductionDetails.reduce(function (sum, deduction) {
                                return sum + deduction.amount;
                            }, 0);
                        }

                        /* vm.deduction.type = vm.getTypeOfDeduction(vm.deduction.type);*/

                    }).finally(function () {
                        vm.loading = false;
                    });
            }
            function getSalaryItemTypes() {
                vm.loading = true;
                salaryItemsSettingService.getSalaryItemTypes().success(function (data) {

                    vm.salaryTypes = data;
                    init();
                }).finally(function () {
                    vm.loading = false;
                });
            }
            getSalaryItemTypes();
        }
    ]);
