// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:122538-122579
appModule.controller('tenant.views.crs.accounting.cashFlowStatement.selectAccountModal', [
        '$scope', 'abp.services.app.account', 'accountCategory', 'selectedAccountIds','$uibModalInstance',
        function ($scope, accountService, accountCategory, selectedAccountIds, $uibModalInstance) {

            var vm = this;
            vm.accounts = [];

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;

            vm.accountCheckedOrUnchecked = function (account) {
                    vm.accounts.filter(e => e.parentId == account.id)
                        .forEach((row) => row.isChecked = account.isChecked);
            }

            vm.getAccounts = function () {
                vm.loading = true;
                accountService.getAccountsOnCategory({ id: accountCategory}).success(function (data) {
                    vm.accounts = data.items;
                    vm.accounts.filter(e => selectedAccountIds.includes(e.id)).forEach(e => e.isChecked = true);

                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.getAccounts();

            vm.save = function () {
                var accountIdsToReturn = vm.accounts.filter(e => e.isChecked).map(r => r.id);
                $uibModalInstance.close(accountIdsToReturn);
            }

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

        }
    ]);
