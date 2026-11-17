// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:166068-166144
appModule.controller('tenant.views.crs.banking.chequesPayables.matureChequeModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.bankAccount', 'receipt', 'utilities', '$uibModal', 'abp.services.app.chequesPayables',
        function ($scope, $uibModalInstance, bankAccountService, receipt, utilities, $uibModal, chequesPayablesService) {

            var vm = this;
            vm.saving = false;
            vm.receipt = receipt;
            vm.bankAccounts = null;

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            vm.save = function () {
                vm.saving = true;

                if (moment(vm.receipt.billingDetail.cheque.chequeDate) > moment(vm.receipt.matureDate)) {
                    errorMessage = "Maturity Date cannot be less than the Cheque Date";
                    abp.message.info(app.localize(errorMessage));
                    vm.saving = false;
                    return;
                }

                chequesPayablesService.matureCheque({
                    matureDate: vm.receipt.matureDate,
                    receiptId: vm.receipt.id,
                    bankAccount: vm.receipt.bankAccount,
                    bankAccountId: vm.receipt.bankAccountId
                }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function getBankAccounts() {
                vm.loading = true;
                bankAccountService.getBankAccountsForSelection({}).success(function (data) {
                    vm.bankAccounts = data.items;
                    //apply bank selection from cheque > bankAccountId
                    vm.bankAccounts.forEach(e => e.chequePrintTemplate = null);
                    if (vm.receipt.billingDetail.cheque) {
                        var matchs = $.grep(vm.bankAccounts, function (o, i) {
                            return (o.id == vm.receipt.billingDetail.cheque.bankAccountId);
                        });
                        vm.receipt.bankAccount = matchs[0];
                        vm.receipt.bankAccountId = vm.receipt.bankAccount.id;
                        vm.lockBankSelect = true;
                    }

                }).finally(function () {
                    vm.loading = false;
                });
            }

            function init() {
                vm.loading = true;
                vm.lockBankSelect = false;
                getBankAccounts();
                vm.loading = false;
            }
            init();
        }
    ]);
