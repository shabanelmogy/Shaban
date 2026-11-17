// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:168079-168173
appModule.controller('tenant.views.crs.banking.chequesReceivables.matureChequeModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.bankAccount', 'receipt', 'utilities', '$uibModal', 'abp.services.app.chequesReceivables',
        function ($scope, $uibModalInstance, bankAccountService, receipt, utilities, $uibModal, chequesReceivablesService) {

            var vm = this;
            vm.saving = false;
            vm.receipt = receipt;
            vm.bankAccounts = null;
            vm.successMsg = null;
            vm.matureDepositNo = null;
            vm.savedMature = false;

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
                var chequeDay = moment(vm.receipt.cheque.chequeDate).startOf('day');
                var matureDay = moment(vm.receipt.matureDate).startOf('day');

                if (matureDay.isBefore(chequeDay)) {
                    var errorMessage = "Maturity Date cannot be less than the Cheque Date";
                    abp.message.info(app.localize(errorMessage));
                    vm.saving = false;
                    return;
                }
                chequesReceivablesService.matureCheque({
                    bankAccount: vm.receipt.bankAccount,
                    BankAccountId: vm.receipt.bankAccount.id,
                    MatureDate: vm.receipt.matureDate,
                    receiptId: vm.receipt.id,
                }).success(function (res) {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    //$uibModalInstance.close();
                    vm.matureVoucher = res;
                    vm.successMsg = app.localize("MaturedSuccessfully");
                    vm.matureDepositNo = app.localize("DepositNo") + ": " + res.voucherNo;
                    vm.receipt.voucherNo = res.voucherNo;
                    vm.savedMature = true;
                }).finally(function () {
                    vm.saving = false;
                });

            };
            vm.matureChequePdc = function () {
                vm.saving = true;
                chequesReceivablesService.matureChequePdc({
                    bankAccount: vm.receipt.bankAccount,
                    BankAccountId: vm.receipt.bankAccount.id,
                    MatureDate: vm.receipt.matureDate,
                    receiptId: vm.receipt.id,
                    contactId: vm.receipt.contactId
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
                    vm.bankAccounts.forEach(e => e.chequePrintTemplate = null);
                }).finally(function () {
                    vm.loading = false;
                });
            }

            function init() {

                vm.loading = true;
                getBankAccounts();
                vm.loading = false;

            }

            init();
        }
    ]);
