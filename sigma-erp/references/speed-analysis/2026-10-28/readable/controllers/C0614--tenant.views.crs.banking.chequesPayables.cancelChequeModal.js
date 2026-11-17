// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:165153-165192
appModule.controller('tenant.views.crs.banking.chequesPayables.cancelChequeModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.bankAccount', 'receipt', 'utilities', '$uibModal', 'abp.services.app.chequesPayables',
        function ($scope, $uibModalInstance, bankAccountService, receipt, utilities, $uibModal, chequesPayablesService) {

            var vm = this;
            vm.saving = false;
            vm.receipt = receipt;

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

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

                chequesPayablesService.cancelCheque({
                    receiptId: vm.receipt.id,
                    cancelDate: vm.receipt.cancelDate,
                    reason: vm.receipt.reason
                }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };
        }
    ]);
