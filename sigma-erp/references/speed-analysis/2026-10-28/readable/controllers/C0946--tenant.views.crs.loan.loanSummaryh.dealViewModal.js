// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:255957-256070
appModule.controller('tenant.views.crs.loan.loanSummaryh.dealViewModal',
        ['$uibModal', '$uibModalInstance', 'utilities', 'options', 'abp.services.app.bankAccount', 'abp.services.app.paymentPlan',
            function ($uibModal, $uibModalInstance, utilities, options, bankAccountService, paymentPlanService) {

                var vm = this;
                vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
                
                vm.loading = false;

                vm.loan = options.loan;
                vm.loanDetails = options.loan.loanDetails;

                vm.getlocalDateTime = function (date) {
                    if (date == null)
                        return "";

                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('YYYY-MM-DD HH:mm');
                };

                vm.localize = function (string) {
                    return app.localize(string);
                };
                vm.currencyFormat = function (amount) {
                    if (amount == null) return null;
                    return amount.toLocaleString('en');
                };
                vm.rounding = function (amount) {
                    if (amount == null) return null;
                    return utilities.round(amount, 2);
                };
                vm.installmentTypes = [
                    { name: "Downpayment", id: 1 },
                    { name: "Installment", id: 2 }
                ];

                vm.cancel = function () {
                    $uibModalInstance.dismiss();
                };

                function getBankAccounts() {
                    vm.loading = true;
                    bankAccountService.getBankAccountsForSelection({}).success(function (data) {
                        vm.bankAccounts = data.items;
                    }).finally(function () {
                        vm.loading = false;
                    });
                }

                vm.calculateSummary = function () {
                    vm.totalAmount = 0;
                    vm.downPayment = 0;
                    vm.loanAmount = 0;
                    vm.interestAmount = 0;
                    vm.loanWithInterest = 0;


                    vm.totalLoanAmount = 0;
                    vm.totalLoanAmountWithInterest = 0;
                    vm.totalInterestAmount = 0;

                    vm.paidDownPayment = 0;
                    vm.paidLoanAmountWithInterest = 0;
                    vm.paidInterest = 0;
                    vm.paidLoanAmountWithoutInterest = 0;

                    vm.dueDownPayment = 0;
                    vm.dueLoanAmount = 0;
                    vm.dueInterest = 0;
                    vm.dueLoanWithInterest = 0;

                    if (vm.paymentPlan && vm.paymentPlan.installments) {
                        // vm.downPayment = vm.paymentPlan.installments.filter(e => !isNaN(e.amount) && e.type == 1).reduce((p, c) => p + c.amount, 0);
                        vm.downPayment = vm.paymentPlan.downPayment;
                        vm.paidDownPayment = vm.paymentPlan.installments.filter(e => !isNaN(e.amount) && e.type == 1 && e.isPaid).reduce((p, c) => p + c.amount, 0);

                        vm.totalLoanAmount = vm.paymentPlan.totalAmount - vm.downPayment;
                        vm.totalLoanAmountWithInterest = vm.paymentPlan.installments.filter(e => !isNaN(e.amount) && e.type != 1).reduce((p, c) => p + c.amount, 0);
                        vm.totalInterestAmount = vm.totalLoanAmountWithInterest - vm.totalLoanAmount;

                        vm.paidLoanAmountWithInterest = vm.paymentPlan.installments.filter(e => !isNaN(e.amount) && e.type != 1 && e.isPaid).reduce((p, c) => p + c.amount, 0);
                        vm.paidInterest = vm.paymentPlan.installments.filter(e => !isNaN(e.interest) && e.type != 1 && e.isPaid).reduce((p, c) => p + c.interest, 0);
                        vm.paidLoanAmountWithoutInterest = vm.paidLoanAmountWithInterest - vm.paidInterest;

                        vm.dueDownPayment = vm.downPayment - vm.paidDownPayment;
                        vm.dueLoanAmount = vm.totalLoanAmount - vm.paidLoanAmountWithoutInterest;
                        vm.dueInterest = vm.totalInterestAmount - vm.paidInterest;
                        vm.dueLoanWithInterest = vm.totalLoanAmountWithInterest - vm.paidLoanAmountWithInterest;
                    }


                };

                function init() {
                    vm.loading = true;
                    getBankAccounts();

                    paymentPlanService.getPaymentPlanToMakeInstallemntPayment({ id: vm.loan.billId })
                        .success(function (result) {
                            vm.bill = result.bill;
                            vm.paymentPlan = result.paymentPlan;
                            //vm.paymentPlan.installments.sort((a, b) => parseFloat(b.no) - parseFloat(a.no));
                            
                            vm.firstEMIDate = vm.paymentPlan.installments.filter(e => e.type == 2)[0].date;
                            // calculateSummary();

                        }).finally(function () {
                            vm.loading = false;
                        });
                }

                init();
            }
        ]);
