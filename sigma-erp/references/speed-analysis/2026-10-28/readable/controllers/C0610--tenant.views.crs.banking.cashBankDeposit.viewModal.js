// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:164710-164802
appModule.controller('tenant.views.crs.banking.cashBankDeposit.viewModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.cashBankDeposit', 'cashBankDepositId', 'abp.services.app.commonLookup', 'abp.services.app.bankAccount','utilities',
        function ($scope, $uibModalInstance, cashBankService, cashBankDepositId, commonLookupService, bankAccountService,  utilities) {

            var vm = this;
            vm.saving = false;
            vm.isEditMod = false;
            vm.selectedAccount = null;
          
            vm.allSelected = false;
            vm.cashBankDeposit = [];
            vm.bankAccounts = [];
            vm.saveAndPrint = false;
            
            vm.rounding = function (value)
            {
                return utilities.round(value, 2);
            };
            
            vm.getVoucherType = function (type, subType) {
                return utilities.getVoucherType(type, subType);
            };
           

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function getBankAccounts() {
                commonLookupService.getBankAccountsForSelection().success(function (data) {
                    vm.bankAccounts = data.items;
                    getBankNameForView();
                });
            }

           
          
            vm.formatNumber = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
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

            vm.accountName = "";
            function getBankNameForView() {
                if (vm.bankAccounts && vm.cashBankDeposit) {

                    if (vm.bankAccounts.length > 0 &&
                        vm.cashBankDeposit.depositAccountId > 0) {
                        var account = $.grep(vm.bankAccounts, function (e) { return e.id == vm.cashBankDeposit.depositAccountId; });
                        vm.accountName = account[0].accountNo + ' ' + account[0].bankName;
                    }
                }
            };

            function init() {
                vm.loading = true;

                cashBankService.getCashDepositForView({ id: cashBankDepositId })
                    .success(function (result) {
                        vm.cashBankDeposit = result;
                        getBankAccounts();
                        if (vm.cashBankDeposit.id > 0) {
                            vm.isEditMod = true;
                            vm.cashBankDeposit.netTotal = parseFloat(vm.cashBankDeposit.amount) + parseFloat(vm.cashBankDeposit.roundOffAmount);

                        } else {
                            vm.isEditMod = false;
                            vm.cashBankDeposit.roundOffAmount = 0.0;
                            vm.cashBankDeposit.netTotal = 0.0;
                        }
                        

                        vm.loading = false;
                    }).finally(function () {
                        vm.loading = false;
                    });
            }

            init();
        }
    ]);
