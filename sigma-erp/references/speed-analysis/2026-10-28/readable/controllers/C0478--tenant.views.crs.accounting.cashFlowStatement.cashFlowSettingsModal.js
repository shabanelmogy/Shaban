// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:122239-122331
appModule.controller('tenant.views.crs.accounting.cashFlowStatement.cashFlowSettingsModal', [
        '$uibModal', '$uibModalInstance', 'abp.services.app.cashFlowStatement', 'abp.services.app.account',
        function ($uibModal, $uibModalInstance, cashFlowStatementService, accountService) {

            var vm = this;
            var accounts = [];
            //vm.creditCard = contactCreditCard;

            //vm.creditCardTypes = [{ id: 1, name: 'MasterCard' }, { id: 2, name: 'Visa' }, { id: 3, name: 'AmericanExpress' }];



            vm.selectAccount = (data) => {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/accounting/cashFlowStatement/selectAccountModal.cshtml',
                    controller: 'tenant.views.crs.accounting.cashFlowStatement.selectAccountModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        accountCategory: function () {
                            return data.accountCategory;
                        },
                        selectedAccountIds: function () {
                            return data.accountIds;
                        }

                    }

                }).result.then(function (result) {
                    data.accountIds = result;
                    fillAccounts();
                });

            }

            function fillAccounts() {
                vm.settingTemplate.operatingActivities.forEach((row) => {
                    row.accountNames = accounts
                        .filter(e => row.accountIds.includes(e.id))
                        .map(e => e.accountCode + "-" + e.name)
                        .join(", ");
                });

                vm.settingTemplate.investingActivities.forEach((row) => {
                    row.accountNames = accounts
                        .filter(e => row.accountIds.includes(e.id))
                        .map(e => e.accountCode + "-" + e.name)
                        .join(", ");
                });

                vm.settingTemplate.financingActivities.forEach((row) => {
                    row.accountNames = accounts
                        .filter(e => row.accountIds.includes(e.id))
                        .map(e => e.accountCode + "-" + e.name)
                        .join(", ");
                });
            }

            function getCashFlowStatementTemplate() {
                cashFlowStatementService.getTemplate().success(function (data) {
                    vm.settingTemplate = data;
                    vm.loading = false;
                    fillAccounts();
                });
            }

            function getAccounts() {
                vm.loading = true;
                accountService.getAccounts().success(function (data) {
                    accounts = data.items.filter(e => e.isLeaf);
                    getCashFlowStatementTemplate();
                })
            }

            vm.save = function () {
                vm.saving = true;
                cashFlowStatementService.saveCashFlowTemplate(vm.settingTemplate).success(function () {
                    vm.saving = false;
                    $uibModalInstance.close(vm.creditCard);
                })
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function init() {
                getAccounts();
            }

            init();
        }
    ]);
