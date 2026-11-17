// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:327350-327414
appModule.controller('tenant.views.crs.vouchers.bills.payInstallmentModal',
        ['$uibModalInstance', 'abp.services.app.paymentPlan', 'utilities', 'paymentPlan', 'abp.services.app.bankAccount',
            function ($uibModalInstance, paymentPlanService, utilities, paymentPlan, bankAccountService) {

                var vm = this;

                vm.loading = false;

                vm.installment = paymentPlan.installment;
                vm.recoveryAccount = paymentPlan.bankAccount; // full object
                vm.recoveryAccountId = paymentPlan.bankAccount ? paymentPlan.bankAccount.id : null;
                vm.interest = paymentPlan.installment.interest;
                vm.getlocalDateTime = function (date) {
                    if (date == null)
                        return "";

                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('YYYY-MM-DD HH:mm');
                };
                function getBankAccounts() {
                    vm.loading = true;
                    bankAccountService.getBankAccountsForSelection({})
                        .success(function (data) {
                            vm.bankAccounts = data.items;
                        })
                        .finally(function () {
                            vm.loading = false;
                        });
                }
                getBankAccounts();

                vm.localize = function (string) {
                    return app.localize(string);
                };
                vm.CurrencyFormate = function (amount) {
                    if (amount == null) return null;
                    return amount.toLocaleString('en');
                };
                vm.round = function (amount) {
                    if (amount == null) return null;
                    return utilities.round(amount, 2);
                };


                vm.cancel = function () {
                    $uibModalInstance.dismiss();
                };

                vm.save = function () {
                    if (parseFloat(vm.interest || 0) > parseFloat(vm.installment.amount || 0)) {
                        abp.message.error("Interest amount cannot be greater than the installment amount.");
                        return;
                    }

                    vm.loading = true;;
                    paymentPlanService.payInstallmentAmount({ id: vm.installment.id, interest: vm.interest, bankAccountId: vm.recoveryAccountId })
                        .success(function (result) {
                            $uibModalInstance.close();
                        }).finally(function () {
                            vm.loading = false;
                        });
                };

            }
        ]);
