// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:145595-145864
appModule.controller('tenant.views.crs.agreements.paymentInstructionsModal',
        ['abp.services.app.commonAgreement', '$uibModalInstance', 'abp.services.app.billingMethod', 'agreementId', 'abp.services.app.bankAccount', 'utilities',
            function (commonAgreementService, $uibModalInstance, billingMethodService, agreementId, bankAccountService, utilities) {

                var vm = this;
                vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
                var totalCharges = 0.0;
                vm.isEnabledDda = abp.features.isEnabled("CRS.Vouchers.Receipts.DdaProcessAutomation");
                vm.loading = false;
                vm.paymentInstruction = {};
                //vm.agreement = agreement;

                vm.pdcCheques = [];
                vm.getlocalDateTime = function (date) {
                    if (date == null)
                        return "";

                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('YYYY-MM-DD HH:mm');
                };

                vm.paymentMethods = [
                    //{ name: "Cash", id: 1 },
                    { name: "Direct Debit", id: 2 },
                    { name: "Cheque", id: 3 },
                    //{ name: "CreditCard", id: 4 }
                ];

                vm.accountTypes = [
                    { name: "Current", id: 1 },
                    { name: "Saving", id: 2 }
                ];

                vm.getPaymentMethod = function (id) {
                    if (id == null)
                        return "";

                    if (id == 1)
                        return app.localize("Cash");
                    else if (id == 2)
                        return app.localize("DirectDebit");
                    else if (id == 3)
                        return app.localize("Cheque");
                    else if (id == 4)
                        return app.localize("CreditCard");
                    else {
                        return "";
                    }
                };

                function getBillingMethods() {
                    vm.loading = true;
                    billingMethodService.getBillingMethods({ category: 1, type: 4 }).success(function (data) {
                        vm.billingMethods = data.items;
                    }).finally(function () {
                        vm.loading = false;
                    });
                };

                function getBankAccounts() {
                    vm.loading = true;
                    bankAccountService.getBankAccountsForSelection({}).success(function (data) {
                        vm.bankAccounts = data.items;
                    }).finally(function () {
                        vm.loading = false;
                    });
                }

                //function chequeObject() {
                //    var obj = new Object();
                //    obj.chequeNo = null;
                //    obj.chequeDate = null;
                //    obj.bankName = null;
                //}
                //function billingDetailObject() {
                //    var obj = new Object();
                //    obj.billingMethod = null;
                //    obj.cheque = chequeObject;
                //}

                function pdcObject() {

                    var obj = new Object();
                    //obj.billingDetail = billingDetailObject();
                    obj.billingDetail = {
                        billingMethodId: null,
                        billingMethod: null,
                        chequeId: null,
                        cheque: {
                            chequeNo: null,
                            chequeDate: null,
                            bankName: null
                        }
                    };
                    obj.amount = totalCharges;
                    obj.contactId = vm.agreement.customerId;

                    return obj;
                }

                //Add row
                vm.addRow = function () {
                    if (vm.pdcCheques.length > 0) {
                        //if (vm.pdcCheques[vm.pdcCheques.length - 1] != 0) {
                        var prevRow = vm.pdcCheques[vm.pdcCheques.length - 1];
                        var prevRowDate = angular.copy(prevRow.billingDetail.cheque.chequeDate); // to avoid prevoius row date to be changed bcz of being refernce type

                        var obj = new Object();
                       // obj.billingDetailId = prevRow.billingDetailId;
                        obj.billingDetail = {
                            billingMethodId: prevRow.billingDetail.billingMethodId,
                            billingMethod: prevRow.billingDetail.billingMethod,
                            chequeId: prevRow.billingDetail.chequeId,
                            cheque: {
                                chequeNo: prevRow.billingDetail.cheque.chequeNo / 1 + 1,
                                chequeDate: prevRowDate.add(1, 'M'),
                                bankName: prevRow.billingDetail.cheque.bankName
                            }
                        };
                        obj.amount = totalCharges;
                        obj.contactId = vm.agreement.customerId;
                        vm.pdcCheques.push(obj);
                    }
                    else
                        vm.pdcCheques.push(pdcObject());
                };

                //Remove row
                vm.removeRow = function (obj) {
                    var index = vm.pdcCheques.indexOf(obj);
                    vm.pdcCheques.splice(index, 1);

                };

                vm.paymentMethodChanged = function (id) {
                    vm.pdcCheques = [];

                    if (id == 3) {
                        for (var i = 0; i < vm.noOfMonths; i++) {
                            vm.pdcCheques.push(pdcObject());
                        }
                    }
                };

                vm.chequeNoChanged = function (chequeNo, index) {
                    if (index == 0) {
                        var i = 0;
                        vm.pdcCheques.forEach(e => {
                            e.billingDetail.cheque.chequeNo = chequeNo / 1 + i;
                            i++;
                        });
                    }
                };
                vm.chequeDateChanged = function (chequeDate, index) {
                    if ( index == 0) {
                        var i = 0;
                        var currentDate = angular.copy(chequeDate);
                        vm.pdcCheques.forEach(e => {
                            currentDate.add(i, 'M');
                            var day = currentDate.date();
                            var month = currentDate.month();
                            var year = currentDate.year();

                            e.billingDetail.cheque.chequeDate = moment(new Date(year, month, day));
                            currentDate = angular.copy(chequeDate);

                            i++;
                        });
                    }
                    //else {
                    //    var prevDate = vm.pdcCheques[index - 1].billingDetail.cheque.chequeDate;
                    //    chequeDate = prevDate.add(1, 'M');
                    //}
                };
                vm.chequeMethodChanged = function (pdc,index) {
                    pdc.billingDetail.billingMethodId = pdc.billingDetail.billingMethod.id;
                    if (index == 0) {
                        vm.pdcCheques.forEach(e => {
                            e.billingDetail.billingMethod = pdc.billingDetail.billingMethod;
                            e.billingDetail.billingMethodId = pdc.billingDetail.billingMethod.id;

                        });
                    }
                };
                //vm.chequeBankChanged = function (bankAccount, index) {
                //    if (index == 0) {
                //        vm.pdcCheques.forEach(e => {
                //            e.billingDetail.cheque.bankAccount = bankAccount;
                //            e.billingDetail.cheque.bankAccountId = bankAccount.id;
                //        });
                //    }
                //};
                vm.chequeBankChanged = function (bank, index) {
                    if (index == 0) {
                        vm.pdcCheques.forEach(e => {
                            e.billingDetail.cheque.bankName = bank;
                        });
                    }
                };
                vm.cancel = function () {
                    $uibModalInstance.dismiss();
                };

                vm.startDateChanged = function () {
                    vm.paymentInstruction.dayOfMonth = vm.paymentInstruction.startDate.date();
                };

                function getDaysOfMonth() {
                    vm.daysOfMonth = [];

                    for (var i = 1; i < 31; i++) {
                        vm.daysOfMonth.push({ name: i, id: i });
                    }
                };

                vm.save = function () {
                    vm.saving = true;
                    vm.paymentInstruction.agreementId = vm.agreement.id;
                    vm.paymentInstruction.pdcReceivables = vm.pdcCheques;
                    commonAgreementService.createOrUpdatePaymentInstruction(vm.paymentInstruction).success(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });

                };

                function init() {
                    vm.loading = true;
                    getDaysOfMonth();
                    getBillingMethods();
                    //getBankAccounts();
                    commonAgreementService.getPaymentInstructionsByAgreementId({
                        id: agreementId
                    }).success(function (result) {
                        vm.paymentInstruction = result;
                        vm.agreement = vm.paymentInstruction.agreement;

                        var agreementEndDate = moment(vm.agreement.endDate);
                        var agreementStartDate = moment(vm.agreement.startDate);
                        vm.noOfMonths = agreementEndDate.diff(agreementStartDate.startDate, 'months', true);

                        totalCharges = 0;
                        vm.agreement.charges.forEach(e => {
                            if (e.rateTypeId != 6 && !e.applyOnClosing) {
                                totalCharges += e.rate;
                                if (!vm.agreement.customer.isTaxExempted) {
                                    var tax = vm.taxPercent * e.rate / 100;
                                    totalCharges += tax;
                                }
                            }
                        });
                        
                        totalCharges = utilities.round(totalCharges, 2); //round to two decimals

                        totalCharges = totalCharges; //round to two decimals

                        vm.pdcCheques = vm.paymentInstruction.pdcReceivables;
                        //vm.pdcCheques.forEach(pdc => {
                        //    pdc.billingDetail.cheque.bankAccount = vm.bankAccounts.find(e => e.id == pdc.billingDetail.cheque.bankAccountId);
                        //});
                    }).finally(function () {
                        vm.loading = false;
                    });
                }

                init();
            }
        ]);
