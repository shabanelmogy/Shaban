// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:325870-326364
appModule.controller('tenant.views.crs.vouchers.bills.installmentPaymentModal',
        ['$uibModalInstance', '$uibModal', 'abp.services.app.paymentPlan', 'parentVoucherId', 'abp.services.app.bankAccount', 'utilities',
            function ($uibModalInstance, $uibModal, paymentPlanService, parentVoucherId, bankAccountService, utilities) {

                var vm = this;
                vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
                vm.editEMIInterest = utilities.parseBoolean(abp.setting.get("App.General.EditEMIInterest"));
                vm.enterInterestAmount = utilities.parseBoolean(abp.setting.get("App.Speed.Common.EnterInterestAmountForAssetLoanPaymentPlan"));
                vm.loading = false;
                vm.allowAssetLoanBillEdit = utilities.parseBoolean(abp.setting.get("App.General.AllowAssetLoanBillEdit"));
                vm.multiSelectLoanEMI = utilities.parseBoolean(abp.setting.get('App.Speed.Common.MultiSelectLoanEMI'));

                vm.paymentPlan = {
                    installments: []
                };

                vm.paidSeqNo = 0;

                vm.changesInPaymentPlan = false;
                vm.getlocalDateTime = function (date) {
                    if (date == null)
                        return "";

                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('YYYY-MM-DD HH:mm');
                };

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
                vm.paymentPlanTypes = [
                    { name: app.localize('DirectDebit') + " (DD)", id: 1 },
                    { name: "PDCs", id: 2 },

                ];
                vm.financingTypes = [
                    { id: 1, name: "Bank" },
                    { id: 2, name: "Other" }
                ];
                vm.installmentTypes = [
                    { name: "Downpayment", id: 1 },
                    { name: "Installment", id: 2 }
                ]; vm.payAllChanged = function () {
                    if (vm.filters.selectToPay) {
                        angular.forEach(vm.paymentPlan.installments, function (loan) {
                            loan.isSelected = vm.filters.payAll;
                        });
                    }
                };
                vm.saveSelected = function () {

                    var selectedInstallments = vm.paymentPlan.installments.filter(x => x.isSelected && !x.isPaid);
                    if (selectedInstallments.length === 0) {
                        abp.message.info("Please Select at least one Installment.");
                        return;
                    }

                    var invalidInterest = selectedInstallments.some(function (installment) {
                        return parseFloat(installment.interest || 0) > parseFloat(installment.amount || 0);
                    });
                    if (invalidInterest) {
                        abp.message.error("Interest amount cannot be greater than the installment amount.");
                        return;
                    }

                    abp.message.confirm(
                        "Are You Sure you want to Pay EMI?",
                        function (isConfirmed) {
                            if (isConfirmed) {
                                vm.disablePayAllButton = true;
                                vm.saveAllSelectedInstallments();
                            } else {
                                vm.disablePayAllButton = false;
                            }
                        }
                    );
                };
                vm.saveAllSelectedInstallments = async function () {
                    var selectedInstallments = vm.paymentPlan.installments.filter(x => x.isSelected && !x.isPaid);
                    vm.loading = true;

                    for (var installment of selectedInstallments) {

                        installment.isProcessing = true;
                        vm.recoveryAccountId = vm.paymentPlan.bankAccount ? vm.paymentPlan.bankAccount.id : null;
                        await paymentPlanService
                            .payInstallmentAmount({
                                id: installment.id,
                                interest: installment.interest,
                                bankAccountId: vm.recoveryAccountId
                            })
                            .success(function () {
                                installment.isPaid = true;
                                installment.isSelected = false;
                                installment.isProcessing = false;
                                abp.message.success("Saved successfully!");
                            }).catch(function (error) {
                                installment.isProcessing = false;
                                vm.loading = false;
                            });
                    }

                    vm.loading = false;
                    vm.disablePayAllButton = false;
                    vm.refreshPaymentPlan();
                };
                function getBankAccounts() {
                    vm.loading = true;
                    bankAccountService.getBankAccountsForSelection({}).success(function (data) {
                        vm.bankAccounts = data.items;
                    }).finally(function () {
                        vm.loading = false;
                    });
                }

                function installmentObject(isDownPayment) {
                    var obj = new Object();
                    obj.paymentPlanId = vm.paymentPlan.id;
                    obj.no = isDownPayment ? 0 : null;
                    obj.date = null;
                    obj.emi = null;
                    obj.type = isDownPayment ? 1 : 2;
                    obj.principal = null;
                    obj.interest = null;
                    obj.status = null;
                    obj.pvNo = null;
                    return obj;
                }

                //Add row
                vm.addRow = function (isDownPayment) {
                    vm.paymentPlan.installments.push(installmentObject(isDownPayment));
                    assignSeqNO();
                    vm.changesOccured();
                };

                //Remove row
                vm.removeRow = function (obj) {
                    var index = vm.paymentPlan.installments.indexOf(obj);
                    vm.paymentPlan.installments.splice(index, 1);
                    assignSeqNO();
                    vm.changesOccured();
                };

                var assignSeqNO = function () {
                    var seqNo = 1;
                    vm.paymentPlan.installments
                        .forEach(e => { e.no = seqNo++; });
                    //.sort((a, b) => parseFloat(b.no) - parseFloat(a.no));

                };

                vm.prepareInstallments = function () {
                    // vm.paymentPlan.installments.forEach(e => e.date = null);
                    vm.paymentPlan.installments = [];
                    vm.addRow(true); //downpayment row
                    for (var i = 0; i < vm.paymentPlan.noOfInstallments; i++) {
                        vm.addRow();
                    }
                };
                


                vm.interestChanged = function (installment, index) {
                    if (!vm.editEMIInterest) {
                        var prevInterest = installment.amount - installment.principal;
                        installment.principal = installment.amount - installment.interest;
                        adjustLastInstallment(prevInterest - installment.interest);
                        
                    } else {
                        settingBasedInterestCalculateSummary(installment.interest, index);
                    }
                };

                vm.emiChanged = function (emi, index) {
                    if (!vm.editEMIInterest) {


                        var currentRow = vm.paymentPlan.installments[index];

                        currentRow.principal = vm.round(emi - currentRow.interest);
                        currentRow.interest = vm.round(emi - currentRow.principal);

                        adjustLastInstallment(0);

                    } else {
                        settingBasedEMICalculateSummary(emi, index);
                    }
                };

                function settingBasedEMICalculateSummary(emi, index) {
                    var currentRow = vm.paymentPlan.installments[index];
                    currentRow.principal = vm.round(vm.principalAmount / vm.paymentPlan.noOfInstallments);

                    if (emi != null) {
                        currentRow.interest = vm.round(emi - currentRow.principal);
                    } else if (emi == null) {
                        currentRow.emi = 0;
                        currentRow.interest = vm.round(emi - currentRow.principal);
                    }

                    vm.totalInterestAmount = 0;

                    vm.paymentPlan.installments.forEach(e => {
                        vm.totalInterestAmount += e.interest;
                    });

                    vm.dueInterest = vm.totalInterestAmount - vm.paidInterest;
                    vm.totalLoanAmountWithInterest = vm.totalLoanAmount + vm.totalInterestAmount; 
                    vm.dueLoanWithInterest = vm.totalLoanAmountWithInterest - vm.paidLoanAmountWithInterest;

                }

                function settingBasedInterestCalculateSummary(interest, index) {
                    var currentRow = vm.paymentPlan.installments[index];
                    currentRow.principal = vm.round(vm.principalAmount / vm.paymentPlan.noOfInstallments);

                    if (interest != null) {
                        currentRow.amount = vm.round(currentRow.principal + interest);
                    } else if (interest == null) {
                        currentRow.interest = 0;
                        currentRow.amount = vm.round(currentRow.principal + interest);
                    }

                    vm.totalInterestAmount = 0;

                    vm.paymentPlan.installments.forEach(e => {
                        vm.totalInterestAmount += e.interest;
                    });

                    vm.dueInterest = vm.totalInterestAmount - vm.paidInterest;
                    vm.totalLoanAmountWithInterest = vm.totalLoanAmount + vm.totalInterestAmount; 
                    vm.dueLoanWithInterest = vm.totalLoanAmountWithInterest - vm.paidLoanAmountWithInterest;

                }

                function adjustLastInstallment(diffInterest) {

                    vm.paymentPlan.installments = vm.paymentPlan.installments.sort(function (a, b) { return a.no - b.no });

                    var length = vm.paymentPlan.installments.length - 2;
                    var sumOfprincipalAmountExceptLast = vm.paymentPlan.installments
                        .filter((e, i) => e.type != 1 && i <= length)
                        .map(e => e.principal)
                        .reduce((acc, curr) => acc + curr, 0);


                    var lastInstallment = vm.paymentPlan.installments[vm.paymentPlan.installments.length - 1];

                    var principalAmount = vm.totalLoanAmount - sumOfprincipalAmountExceptLast;
                    var interest = lastInstallment.interest + diffInterest;
                    var totalAmount = principalAmount + interest;

                    lastInstallment.amount = vm.round(totalAmount);
                    lastInstallment.principal = vm.round(principalAmount);
                    lastInstallment.interest = vm.round(interest);

                    //vm.calculateSummary();
                }

                vm.dateChanged = function (date, index) {
                    if (index == 1) {
                        var j = 0;
                        //vm.paymentPlan.installments.forEach(e => {
                        var currentDate = angular.copy(date);
                        angular.forEach(vm.paymentPlan.installments, function (obj, i) {
                            if (i != 0) {
                                currentDate.add(j, 'M');
                                var day = currentDate.date();
                                var month = currentDate.month();
                                var year = currentDate.year();

                                obj.date = moment(new Date(year, month, day));
                                currentDate = angular.copy(date);

                                j++;
                            }
                        });
                    }
                };

                vm.cancel = function () {
                    $uibModalInstance.dismiss();
                };

                vm.save = function () {
                    vm.saving = true;
                    paymentPlanService.updatePaymentPlanLines({
                        id: vm.paymentPlan.id,
                        installments: vm.paymentPlan.installments
                    }).success(function () {
                        vm.saving = false;
                        vm.changesInPaymentPlan = false;
                        init();
                    })
                };

                vm.changesOccured = function () {
                    vm.changesInPaymentPlan = true;
                }

                vm.openPayInstallmentModel = function (installment, bankAccount) {
                    if (vm.changesInPaymentPlan) {
                        abp.message.info(app.localize("Save Payment Plan Changes First"));
                    }
                    else {
                        if (installment.type == 2)
                            openPayInstallmentModel(installment, bankAccount);
                        else if (installment.type == 1)
                            openPayDownpaymentModel(installment);
                    }
                };

                var openPayInstallmentModel = function (installment, bankAccount) {
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/tenant/views/crs/vouchers/bills/payInstallmentModal.cshtml',
                        controller: 'tenant.views.crs.vouchers.bills.payInstallmentModal as vm',
                        backdrop: 'static',
                        size: 'sm',
                        resolve: {
                            paymentPlan: function () {
                                return {
                                    installment: installment,
                                    bankAccount: bankAccount,
                                };
                            }
                        }
                    });
                    modalInstance.result.then(function () {
                        init();
                    });
                };

                var openPayDownpaymentModel = function (downpayment) {
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/tenant/views/crs/vouchers/bills/payDownpaymentModal.cshtml',
                        controller: 'tenant.views.crs.vouchers.bills.payDownpaymentModal as vm',
                        backdrop: 'static',
                        size: 'sm',
                        resolve: {
                            downpayment: function () {
                                return downpayment;
                            }
                        }
                    });
                    modalInstance.result.then(function () {
                        init();
                    });
                };

                vm.openInstallmentBreakdownModal = function (installment) {
                    $uibModal.open({
                        templateUrl: '~/App/tenant/views/crs/vouchers/bills/installmentBreakdownModal.cshtml',
                        controller: 'tenant.views.crs.vouchers.bills.installmentBreakdownModal as vm',
                        backdrop: 'static',
                        resolve: {
                            options: function () {
                                return {
                                    installment: installment,
                                    bill: vm.bill,
                                    rate: vm.paymentPlan.rate,
                                };
                            }
                        }
                    }).result.then(function (installmentDetail) {
                        if (installmentDetail) {
                            vm.installment.assetInstallments = installmentDetail;
                        }
                    });
                };

                vm.openLoanRestructureModal = function () {
                    $uibModal.open({
                        templateUrl: '~/App/tenant/views/crs/vouchers/bills/loanRestructureModal.cshtml',
                        controller: 'tenant.views.crs.vouchers.bills.loanRestructureModal as vm',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            options: function () {
                                return {
                                    paymentPlanId: vm.paymentPlan.id,
                                    bill:vm.bill
                                };
                            }
                        }
                    }).result.then(function () {
                        init();
                    });
                };

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
                        vm.downPayment = vm.paymentPlan.downPayment; // vm.paymentPlan.installments.filter(e => !isNaN(e.amount) && e.type == 1).reduce((p, c) => p + c.amount, 0);
                        vm.paidDownPayment = vm.paymentPlan.downPayment; //.installments.filter(e => !isNaN(e.amount) && e.type == 1 && e.isPaid).reduce((p, c) => p + c.amount, 0);
                        debugger
                        vm.totalLoanAmount = vm.paymentPlan.totalAmount - vm.downPayment;
                        vm.totalLoanAmountWithInterest = vm.totalLoanAmount + vm.paymentPlan.interest; // vm.paymentPlan.installments.filter(e => !isNaN(e.amount) && e.type != 1).reduce((p, c) => p + c.amount, 0);
                        vm.totalInterestAmount = vm.paymentPlan.interest;

                        vm.paidLoanAmountWithInterest = vm.paymentPlan.installments.filter(e => !isNaN(e.amount) && e.type != 1 && e.isPaid).reduce((p, c) => p + c.amount, 0);
                        vm.paidInterest = vm.paymentPlan.installments.filter(e => !isNaN(e.interest) && e.type != 1 && e.isPaid).reduce((p, c) => p + c.interest, 0);
                        vm.paidLoanAmountWithoutInterest = vm.paidLoanAmountWithInterest - vm.paidInterest;

                        vm.dueDownPayment = vm.downPayment - vm.paidDownPayment;
                        vm.dueLoanAmount = vm.totalLoanAmount - vm.paidLoanAmountWithoutInterest;
                        vm.dueInterest = vm.totalInterestAmount - vm.paidInterest;
                        vm.dueLoanWithInterest = vm.totalLoanAmountWithInterest - vm.paidLoanAmountWithInterest;
                    }


                };

                //function calculateSummary() {
                //    vm.paymentPlan.totalAmount = vm.bill.amount;
                //    var downPayment = vm.paymentPlan.installments[0];
                //    if (downPayment.isPaid) 
                //        vm.downPayment = vm.paymentPlan.installments[0].amount;
                //    else
                //        vm.downPayment = 0.0;

                //    vm.principalAmount = vm.paymentPlan.totalAmount / 1 - vm.downPayment / 1;
                //    vm.loanAmountWithInterest = 0.0;
                //    vm.paidTotalAmount = 0.0;
                //    vm.paidTotalInterest = 0.0;

                //    vm.paymentPlan.installments.forEach(e => {
                //        if (e.type == 2)
                //            vm.loanAmountWithInterest += e.amount;
                //        if (e.isPaid) {
                //            vm.paidTotalAmount += e.amount;
                //            vm.paidTotalInterest += e.interest;
                //        }
                //    });
                //    vm.paymentPlan.interest = vm.loanAmountWithInterest - vm.principalAmount;
                //}

                function init() {
                    vm.loading = true;
                    getBankAccounts();

                    paymentPlanService.getPaymentPlanToMakeInstallemntPayment({ id: parentVoucherId })
                        .success(function (result) {
                            vm.bill = result.bill;
                            vm.paymentPlan = result.paymentPlan;
                            //vm.paymentPlan.installments.sort((a, b) => parseFloat(b.no) - parseFloat(a.no));
                            if (vm.paymentPlan.installments.some(e => e.isPaid))
                                vm.paidSeqNo = Math.max(...vm.paymentPlan.installments.filter(e => e.isPaid).map(e => e.no));
                            //vm.downpaymentDate = vm.paymentPlan.installments.find(e => e.type == 1).date;
                            vm.firstEMIDate = vm.paymentPlan.installments.filter(e => e.type == 2)[0].date;

                            vm.principalAmount = vm.paymentPlan.totalAmount - vm.paymentPlan.downPayment;

                            vm.calculateSummary();

                        }).finally(function () {
                            vm.loading = false;
                        });
                }

                vm.refreshPaymentPlan = function () {
                    init();
                };

                init();
            }
        ]);
