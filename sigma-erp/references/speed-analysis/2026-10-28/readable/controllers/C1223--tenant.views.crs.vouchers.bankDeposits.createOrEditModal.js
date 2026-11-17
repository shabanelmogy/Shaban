// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:320170-320209
appModule.controller('tenant.views.crs.vouchers.bankDeposits.createOrEditModal', ['$uibModal', 'bankDepositId', '$uibModalInstance', 'abp.services.app.bankDeposit',
        function ($uibModal, bankDepositId, $uibModalInstance, bankDepositService) {
            var vm = this;

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.save = function () {
                vm.saving = true;
                bankDepositService.createOrUpdateBankDeposit({ bankDeposit: vm.bankDeposit }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };

            function init() {
                vm.loading = true;
                bankDepositService.getBankDepositForEdit({ id: bankDepositId })
                    .success(function (result) {
                        vm.bankDeposit = result;
                        if (vm.bankDeposit.amount == 0)
                            vm.bankDeposit.amount = null;
                        if (vm.bankDeposit.id < 1) {
                            vm.bankDeposit.date = new Date();
                            vm.isEditMode = false;
                        } else {
                            vm.isEditMode = true;
                        }
                        vm.loading = false;
                    }).error(function () {
                        vm.loading = false;
                    });
            }

            init();

        }]);
