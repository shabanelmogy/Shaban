// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:163122-163193
appModule.controller('tenant.views.crs.banking.bankAccounts.createOrEditModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.bankAccount', 'bankAccountId', 'utilities', '$uibModal', 'abp.services.app.currency',
        function ($scope, $uibModalInstance, bankAccountService, bankAccountId, utilities, $uibModal, currencyService) {

            var vm = this;
            vm.saving = false;
            vm.isEditMod = false;
            vm.selectedCountry = null;
            vm.baseCurrencyId = null;
            vm.addCurrency = false;
            vm.isMulticurrencyEnabled = abp.features.isEnabled("Core.MultiCurrency");
            vm.isCustomerWiseSettingEnabled = utilities.parseBoolean(abp.setting.get("App.General.AllowCustomerWiseSetting"));
            vm.filters = {
                name: ''
            };

            function getCurrencies() {
                currencyService.getCurrencies().success(function (result) {
                    vm.currencies = result.items;
                    vm.baseCurrencyId = result.items.filter(curr => curr.isBase)[0].id;
                    //if (!vm.bankAccount.id)
                    //    vm.bankAccount.currencyId = result.items.filter(p => p.isBase)[0].id;
                    if (vm.bankAccount.currencyId) {
                        vm.addCurrency = true;
                    }
                }).finally(function () { vm.loading = false; });
            }

            vm.save = function () {

                vm.saving = true;
                //if (vm.isMulticurrencyEnabled) {
                //    if (vm.bankAccount.currencyId == vm.baseCurrencyId) {
                //        vm.bankAccount.currencyId = null;
                //    }
                //}
                bankAccountService.createOrUpdateBankAccount({
                    bankAccount: vm.bankAccount,

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



            function init() {
                vm.loading = true;
                bankAccountService.getBankAccountForEdit({
                    id: bankAccountId
                }).success(function (result) {
                    vm.bankAccount = result;
                    if (vm.isMulticurrencyEnabled) {
                        getCurrencies();
                    }
                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();

        }
    ]);
