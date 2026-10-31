// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:168580-168631
appModule.controller('tenant.views.crs.banking.chequesReceivables.resubmitChequeModal', [
        '$scope', '$uibModalInstance', 'receipt', 'abp.services.app.chequesReceivables',
        function ($scope, $uibModalInstance, receipt, chequesReceivablesService) {

            var vm = this;
            vm.saving = false;
            vm.receipt = receipt;
            vm.successMsg = null;
            vm.savedResubmit = false;
            vm.resubmitDate = null;

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
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
                if (vm.receipt.returnDate && moment(vm.resubmitDate) < moment(vm.receipt.returnDate)) {
                    abp.message.info(app.localize("ResubmitDateMustBeGreaterOrEqualToReturnDate"));
                    vm.saving = false;
                    return;
                }
                chequesReceivablesService.resubmitCheque({
                    Id: vm.receipt.id,
                    ResubmitDate: vm.resubmitDate
                }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    vm.successMsg = app.localize("SuccessfullyResubmitedCheque");
                    vm.savedResubmit = true;
                }).finally(function () {
                    vm.saving = false;
                });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function init() {
                vm.loading = false;
            }

            init();
        }
    ]);
