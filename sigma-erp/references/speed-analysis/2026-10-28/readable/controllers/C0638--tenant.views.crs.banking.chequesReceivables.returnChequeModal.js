// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:168634-168688
appModule.controller('tenant.views.crs.banking.chequesReceivables.returnChequeModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.bankAccount', 'receipt', 'utilities', '$uibModal', 'abp.services.app.chequesReceivables',
        function ($scope, $uibModalInstance, bankAccountService, receipt, utilities, $uibModal, chequesReceivablesService) {

            var vm = this;
            vm.saving = false;
            vm.receipt = receipt;
            
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
                
                chequesReceivablesService.returnCheque({
                    receiptId: vm.receipt.id,
                    returnDate: vm.receipt.returnDate,
                    reason: vm.receipt.reason,
                }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };

            vm.returnChequePdc = function () {
                vm.saving = true;
                chequesReceivablesService.returnChequePdc({
                    receiptId: vm.receipt.id,
                    returnDate: vm.receipt.returnDate,
                    reason: vm.receipt.reason,
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
        }
    ]);
