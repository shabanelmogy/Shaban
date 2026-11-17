// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:169603-169709
appModule.controller('tenant.views.crs.banking.creditCardTransBankTransfer.viewModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.creditCardTransBankTransfer', 'creditCardTransBankTransferId', 'abp.services.app.commonLookup', 'abp.services.app.bankAccount', 'appSession', 'utilities', '$filter',
        function ($scope, $uibModalInstance, creditCardTransTransferService, creditCardTransBankTransferId, commonLookupService, bankAccountService, appSession, utilities, $filter) {

            var vm = this;
            vm.saving = false;
            vm.isEditMod = false;
            vm.selectedAccount = null;
            vm.locations = [];
            vm.allSelected = false;
            vm.creditCardTransBankTransfer = [];
            vm.bankAccounts = [];
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.applyVAT = false;
            vm.surchargePerTrans = 0;
            
            vm.rounding = function (value) {
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

            vm.calculateBalance = function () {
                vm.creditCardTransBankTransfer.amount = 0;
                vm.creditCardTransBankTransfer.totalCommission = 0;
                vm.creditCardTransBankTransfer.totalTax = 0;
                vm.creditCardTransBankTransfer.totalNetAmount = 0;

                if (vm.creditCardTransBankTransfer != null) {
                    angular.forEach(vm.creditCardTransBankTransfer.receiptLines, function (row) {
                        vm.creditCardTransBankTransfer.amount += vm.rounding(row.amount);
                        vm.creditCardTransBankTransfer.totalCommission += vm.rounding(row.commission);
                        vm.creditCardTransBankTransfer.totalTax += vm.rounding(row.tax);
                        if (vm.applyVAT)
                            vm.creditCardTransBankTransfer.totalNetAmount += vm.rounding(row.amount - row.commission - row.tax);
                        else
                            vm.creditCardTransBankTransfer.totalNetAmount += vm.rounding(row.amount - row.commission);
                    });
                }
                if (!vm.creditCardTransBankTransfer.totalCommission) vm.creditCardTransBankTransfer.totalCommission = 0;
                else
                    vm.creditCardTransBankTransfer.totalCommission = vm.rounding(vm.creditCardTransBankTransfer.totalCommission);
                vm.creditCardTransBankTransfer.totalNetAmount = vm.rounding(vm.creditCardTransBankTransfer.totalNetAmount);
                vm.creditCardTransBankTransfer.totalTax = vm.rounding(vm.creditCardTransBankTransfer.totalTax);
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
                if (vm.bankAccounts && vm.creditCardTransBankTransfer) {
                    
                    if (vm.bankAccounts.length > 0 &&
                        vm.creditCardTransBankTransfer.depositAccountId > 0) {
                        var account = $.grep(vm.bankAccounts, function (e) { return e.id == vm.creditCardTransBankTransfer.depositAccountId; });
                        vm.accountName = account[0].accountNo + ' ' + account[0].bankName;
                    }
                }
            };

            function round(value, decimals) {
                return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
            }

            function init() {
                vm.loading = true;
                if (vm.taxPercent > 0 && !vm.isTaxInclusive)
                    vm.applyVAT = true;
                creditCardTransTransferService.getCreditCardTransBankTransferForView({ id: creditCardTransBankTransferId })
                    .success(function (result) {
                        vm.creditCardTransBankTransfer = result;
                        vm.calculateBalance();
                        getBankAccounts();
                        vm.loading = false;
                    }).finally(function () {
                        vm.loading = false;
                    });
            }

            init();
        }
    ]);
