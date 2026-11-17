// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:163072-163119
appModule.controller('tenant.views.crs.banking.bankAccounts.chequaPrintingSettingModal', [
        '$scope', '$uibModalInstance', 'bankAccount', 'utilities', '$uibModal', 'abp.services.app.bankAccount',  
        function ($scope, $uibModalInstance, bankAccount, utilities, $uibModal, bankAccountService) {

            var vm = this;
            vm.saving = false;
            //  vm.receipt = receipt;
            vm.bankAccount = null;
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
            vm.chequePrintingSetting = {

            }
            vm.save = function () {
                vm.saving = true;
                vm.chequePrintingSetting.bankAccountId = bankAccount.id;
                //bankAccount.chequePrintTemplate = vm.chequePrintingSetting;
                bankAccountService.saveChequePrintingSetting(vm.chequePrintingSetting).success(function () {
                    $uibModalInstance.close(vm.chequePrintingSetting);
                })
                .finally(function () {
                    vm.saving = false;
                });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };


            function init() {
                if (bankAccount) {
                    vm.chequePrintingSetting = bankAccount.chequePrintTemplate;
                }
            }

            init();
        }
    ]);
