// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:167043-167087
appModule.controller('tenant.views.crs.banking.chequesReceivables.bounceChequeModal', [
        '$uibModalInstance', 'receipt', 'abp.services.app.chequesReceivables',
        function ($uibModalInstance, receipt, chequesReceivablesService) {

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

                var receiptId = vm.receipt.id;
                if (vm.receipt.matureVoucherId)
                    receiptId = vm.receipt.matureVoucherId;


                chequesReceivablesService.bounceCheque({
                    receiptId: receiptId,
                    bounceDate: vm.receipt.bounceDate,
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
