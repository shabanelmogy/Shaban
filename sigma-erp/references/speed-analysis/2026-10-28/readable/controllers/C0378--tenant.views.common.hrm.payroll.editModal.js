// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:98406-98445
appModule.controller('tenant.views.common.hrm.payroll.editModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.payroll', 'payrollDetail',
        function ($scope, $uibModalInstance, payrollService, payrollDetail) {

            var vm = this;
            //vm.payrollDetail = JSON.parse(JSON.stringify(payrollDetail));
            vm.payrollDetail = payrollDetail;

            init();

            vm.save = () => {
                vm.saving = true;

                payrollService.editStaffPay(vm.payrollDetail)
                    .success((r) => {
                        $uibModalInstance.close(r);
                    })
                    .finally(() => {
                        vm.saving = false;
                    });
            };

            vm.cancel = () => {
                $uibModalInstance.dismiss();
            };

            vm.showSalaryType = (value) => {
                let salaryType = vm.salaryTypes.find(x => x.value === value);
                return salaryType.key;
            }

            function init() {
                vm.saving = false;
                vm.salaryTypes = [
                    { value: 1, key: "Incentive" },
                    { value: 2, key: "Deduction" }
                ];
            }
        }
    ]);
