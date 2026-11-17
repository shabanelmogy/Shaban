// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:320456-320498
appModule.controller('tenant.views.crs.vouchers.bankDeposits.viewModal', ['$uibModal', 'bankDepositId', '$uibModalInstance', 'abp.services.app.bankDeposit','utilities',
        function ($uibModal, bankDepositId, $uibModalInstance, bankDepositService, utilities) {
            var vm = this;

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.save = function () {
                vm.saving = true;
                bankDepositService.createOrUpdateBankDeposit({ bankDeposit: vm.bankDeposit }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            function init() {
                vm.loading = true;
                bankDepositService.getBankDepositForEdit({ id: bankDepositId }).success(
                    function (result) {
                        vm.bankDeposit = result;
                        if (vm.bankDeposit.id < 1) {
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
