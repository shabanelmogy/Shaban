// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:327250-327347
appModule.controller('tenant.views.crs.vouchers.bills.payDownpaymentModal',
        ['$uibModalInstance', 'abp.services.app.paymentPlan', 'utilities', 'downpayment', 'abp.services.app.commonLookup', 'abp.services.app.billingMethod',
            function ($uibModalInstance, paymentPlanService, utilities, downpayment, commonLookupService, billingMethodService) {

                var vm = this;

                vm.isAccountFeatureEnabled = abp.features.isEnabled("CRS.Accounts");
                vm.isPostDatedChequePayableDirectlyToBankEnabled = utilities.parseBoolean(abp.setting.get("App.General.EnablePostDatedChequePayableDirectlyToBank"));

                vm.loading = false;

                vm.downpayment = downpayment;
                vm.payment = {
                    billingDetail: {
                        billingMethod: {},
                        creditCard: {},
                        cheque: {},
                        bankAccount: {},
                    },
                };
                vm.getlocalDateTime = function (date) {
                    if (date == null)
                        return "";

                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('YYYY-MM-DD HH:mm');
                };

                function getBillingMethods() {

                    // vm.loading = true;
                    billingMethodService.getBillingMethods({ category: 2 }).success(function (data) {
                        vm.billingMethods = data.items;
                    }).finally(function () {
                        //    vm.loading = false;
                    });
                }


                function getBankAccounts() {
                    commonLookupService.getBankAccountsForSelection().success(function (data) {
                        vm.bankAccounts = data.items;
                        vm.bankAccounts.forEach(e => e.chequePrintTemplate = null);
                    });
                }

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
                    vm.loading = true;
                    if (vm.payment.billingDetail.billingMethod.type == 1) {
                        vm.payment.billingDetail.cheque = null;
                        vm.payment.billingDetail.bankAccount = null;
                        vm.payment.billingDetail.creditCard = null;
                    }
                    if (vm.payment.billingDetail.billingMethod.type == 2 || vm.payment.billingDetail.billingMethod.type == 7) {
                        vm.payment.billingDetail.cheque = null;
                        vm.payment.billingDetail.bankAccount = null;
                    }
                    else if (vm.payment.billingDetail.billingMethod.type == 4) {
                        vm.payment.billingDetail.creditCard = null;
                        vm.payment.billingDetail.bankAccount = null;
                    }
                    else if (vm.payment.billingDetail.billingMethod.type == 5) {
                        vm.payment.billingDetail.creditCard = null;
                        vm.payment.billingDetail.cheque = null;
                    }
                    paymentPlanService.payDownPaymentAmount({ id: downpayment.id, billingDetail: vm.payment.billingDetail })
                        .success(function (result) {
                            $uibModalInstance.close();
                        }).finally(function () {
                            vm.loading = false;
                        });
                };

                function init() {
                    getBillingMethods();
                    getBankAccounts();
                }

                init();
            }
        ]);
