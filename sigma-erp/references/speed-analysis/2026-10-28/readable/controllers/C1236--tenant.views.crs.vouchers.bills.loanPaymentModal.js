// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:326368-326949
appModule.controller('tenant.views.crs.vouchers.bills.loanPaymentModal',
        ['$uibModal', '$uibModalInstance', 'totalBillAmount', 'abp.services.app.bankAccount', 'utilities', 'paymentPlan', 'abp.services.app.directory', "FileUploader", 'abp.services.app.bill', 'isAssetLoanBill',
            function ($uibModal, $uibModalInstance, totalBillAmount, bankAccountService, utilities, paymentPlan, directoryService, fileUploader, billService, isAssetLoanBill) {

                var vm = this;
                vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
                vm.editEMIInterest = utilities.parseBoolean(abp.setting.get("App.General.EditEMIInterest"));
                vm.enterInterestAmount = isAssetLoanBill && utilities.parseBoolean(abp.setting.get("App.Speed.Common.EnterInterestAmountForAssetLoanPaymentPlan"));
                vm.totalBillAmount = totalBillAmount;
                vm.paymentPlan = paymentPlan;
                vm.loading = false;
                vm.allowNonBankFinancing = isAssetLoanBill &&
                    utilities.parseBoolean(abp.setting.get("App.Speed.Common.AllowNonBankFinancingForAssetLoanBills"));

                vm.financingTypes = [
                    { id: 1, name: "Bank" },
                    { id: 2, name: "Other" }
                ];
                vm.canPrepare = false;
                vm.downPayment = 0.0;
                vm.suppliers = [];

                vm.principalAmount = 0;
                //vm.paymentPlan.interest = 0;
                vm.loanAmountWithInterest = 0;
                vm.paymentPlanTypes = [
                    { name: app.localize('DirectDebit') + " (DD)", id: 1 },
                    { name: "PDCs", id: 2 },

                ];
                vm.isImportVoucherLinesEnabled = abp.features.isEnabled("CRS.CustomFeatures.ImportVoucherLines");

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
                vm.installmentTypes = [
                    { name: "Downpayment", id: 1 },
                    { name: "Installment", id: 2 }
                ];

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
                    obj.no = isDownPayment ? 0 : null;
                    //obj.date = isDownPayment ? vm.downpaymentDate : null;
                    obj.date = vm.firstEMIDate;
                    obj.amount = isDownPayment ? vm.downPayment : null;
                    obj.type = isDownPayment ? 1 : 2;
                    obj.principal = null;
                    obj.interest = null;
                    obj.status = null;
                    obj.pvNo = null;
                    return obj;
                }

                function updateRateFromInterestAmount() {
                    var principalAmount = Math.max(Number(vm.principalAmount) || 0, 0);
                    var interestAmount = Number(vm.paymentPlan.interest) || 0;
                    vm.paymentPlan.interest = Math.min(Math.max(interestAmount, 0), principalAmount);
                    vm.paymentPlan.rate = principalAmount ? vm.round(vm.paymentPlan.interest / principalAmount * 100) : 0;
                    vm.loanAmountWithInterest = principalAmount + vm.paymentPlan.interest;
                }

                var assignSeqNO = function () {
                    var seqNo = 1;
                    vm.paymentPlan.installments
                        .forEach(e => { e.no = seqNo++; });
                };

                //Add row
                vm.addRow = function (isDownPayment) {
                    vm.paymentPlan.installments.push(installmentObject(isDownPayment));
                    assignSeqNO();
                };

                //Remove row
                vm.removeRow = function (obj) {
                    var index = vm.paymentPlan.installments.indexOf(obj);
                    vm.paymentPlan.installments.splice(index, 1);
                    assignSeqNO();
                };
                vm.chequeNoChanged = function (installment, index) {
                    var chequeNo = installment.chequeNo;
                    if (!chequeNo) return;

                    // Split into numeric suffix and non-numeric prefix
                    // e.g. "ABC123" → prefix="ABC", num=123
                    var match = chequeNo.match(/^(.*?)(\d+)$/);
                    if (!match) {
                        // No numeric part — just fill all subsequent rows with the same value
                        for (var i = index + 1; i < vm.paymentPlan.installments.length; i++) {
                            if (vm.paymentPlan.installments[i].type == 2) {
                                vm.paymentPlan.installments[i].chequeNo = chequeNo;
                            }
                        }
                        return;
                    }

                    var prefix = match[1];                  // "ABC"
                    var numStr = match[2];                  // "123"
                    var numLength = numStr.length;          // preserve zero-padding width
                    var num = parseInt(numStr, 10);

                    for (var i = index + 1; i < vm.paymentPlan.installments.length; i++) {
                        if (vm.paymentPlan.installments[i].type == 2) {
                            num++;
                            // Pad to original length: "001" → "002", not "2"
                            var nextNum = String(num).padStart(numLength, '0');
                            vm.paymentPlan.installments[i].chequeNo = prefix + nextNum;
                        }
                    }
                };
                vm.prepareInstallments = function () {
                    // vm.paymentPlan.installments.forEach(e => e.date = null);
                    vm.paymentPlan.installments = [];
                    //vm.addRow(true); //downpayment row
                    for (var i = 0; i < vm.paymentPlan.noOfInstallments; i++) {
                        vm.addRow();
                    }
                    var j = 0;
                    angular.forEach(vm.paymentPlan.installments, function (obj, i) {
                        if (obj.type == 2) {
                            //populating all installment dates
                            var firstEMIdate = vm.firstEMIDate;
                            var currentDate = angular.copy(firstEMIdate);
                            currentDate.add(j, 'M');
                            var day = currentDate.date();
                            var month = currentDate.month();
                            var year = currentDate.year();

                            obj.date = moment(new Date(year, month, day));
                            currentDate = angular.copy(firstEMIdate);
                            j++;
                        }
                    });
                    vm.principalAmount = vm.totalBillAmount / 1 - vm.downPayment / 1;
                    if (vm.enterInterestAmount) {
                        updateRateFromInterestAmount();
                    } else {
                        vm.paymentPlan.interest = vm.principalAmount * (vm.paymentPlan.rate / 100);
                    }
                    vm.loanAmountWithInterest = vm.principalAmount + vm.paymentPlan.interest;

                    var eachInstallmentInterest = vm.round(vm.paymentPlan.interest / vm.paymentPlan.noOfInstallments);
                    var eachInstallmentAmount = vm.round(vm.loanAmountWithInterest / vm.paymentPlan.noOfInstallments);
                    vm.paymentPlan.installments.forEach(e => {
                        if (e.type == 2) {
                            e.amount = eachInstallmentAmount;
                            e.interest = eachInstallmentInterest;
                            e.principal = vm.round(e.amount - e.interest);
                        }
                    });

                    //calculateSummary();
                };


                vm.interestChanged = function (installment, index) {
                    if (!vm.editEMIInterest) {
                        installment.principal = installment.amount - installment.interest;
                        adjustLastInstallment();
                    } else {
                        settingBasedInterestCalculateSummary(installment.interest, index);
                    }
                };

                vm.emiChanged = function (emi, index) {
                    if (!vm.editEMIInterest) {
                        if (index == 0) {
                            vm.downPayment = emi;
                        }
                        else {
                            var currentRow = vm.paymentPlan.installments[index];

                            currentRow.principal = vm.round((currentRow.amount * 100) / (100 + vm.paymentPlan.rate / 1));
                            currentRow.interest = vm.round(currentRow.amount - currentRow.principal);

                            //if (index == 1) {
                            //    angular.forEach(vm.paymentPlan.installments, function (obj, i) {
                            //        if (i != 0) {
                            //            obj.amount = emi;
                            //            obj.interest = obj.amount * vm.paymentPlan.rate / 100;
                            //            obj.principal = obj.amount - obj.interest;
                            //        }
                            //    });
                            //}
                        }
                        //vm.principalAmount = vm.totalBillAmount / 1 - vm.downPayment / 1;

                        ////vm.loanAmountWithInterest = vm.loanAmountWithInterest - vm.downPayment;
                        //vm.paymentPlan.interest = vm.loanAmountWithInterest - vm.principalAmount;
                        calculateSummary();
                        //adjustLastInstallment();
                    } else {
                        settingBasedEMICalculateSummary(emi, index);
                    }
                };

                function adjustLastInstallment() {

                    var length = vm.paymentPlan.installments.length - 2;
                    var sumOfprincipalAmountExceptLast = vm.paymentPlan.installments
                        .filter((e, i) => e.type == 2 && i <= length)
                        .map(e => e.principal)
                        .reduce((acc, curr) => acc + curr, 0);


                    var lastInstallment = vm.paymentPlan.installments[vm.paymentPlan.installments.length - 1];

                    var principalAmount = vm.principalAmount - sumOfprincipalAmountExceptLast;
                    var interest = principalAmount * (vm.paymentPlan.rate / 100);
                    var totalAmount = principalAmount + interest;

                    lastInstallment.amount = vm.round(totalAmount);
                    lastInstallment.principal = vm.round(principalAmount);
                    lastInstallment.interest = vm.round(interest);

                    calculateSummary();
                }

                vm.dateChanged = function (date, index) {
                    //if (index == 1) {
                    //    var j = 0;
                    //    //vm.paymentPlan.installments.forEach(e => {
                    //    var currentDate = angular.copy(date);
                    //    angular.forEach(vm.paymentPlan.installments, function (obj, i) {
                    //        if (i != 0) {
                    //            currentDate.add(j, 'M');
                    //            var day = currentDate.date();
                    //            var month = currentDate.month();
                    //            var year = currentDate.year();

                    //            obj.date = moment(new Date(year, month, day));
                    //            currentDate = angular.copy(date);

                    //            j++;
                    //        }
                    //    });
                    //}
                };

                vm.downpaymentChanged = function () {
                    vm.downPayment = vm.paymentPlan.downPayment;
                    //var downpaymentRow = vm.paymentPlan.installments.find(e => e.type == 1);
                    //downpaymentRow.amount = vm.downPayment;
                    vm.principalAmount = vm.totalBillAmount - vm.downPayment;
                    if (vm.enterInterestAmount) {
                        updateRateFromInterestAmount();
                    }
                };

                vm.interestAmountChanged = function () {
                    updateRateFromInterestAmount();
                };

                function calculateSummary() {

                    vm.loanAmountWithInterest = 0.0;
                    vm.paymentPlan.interest = 0.0;

                    vm.paymentPlan.installments.forEach(e => {
                        if (e.type == 2) {
                            vm.loanAmountWithInterest += e.amount;
                            vm.paymentPlan.interest += e.interest;
                        }
                    });
                }

                function settingBasedEMICalculateSummary(emi, index) {
                    var currentRow = vm.paymentPlan.installments[index];
                    currentRow.principal = vm.round(vm.principalAmount / vm.paymentPlan.noOfInstallments);

                    if (emi != null) {
                        currentRow.interest = vm.round(emi - currentRow.principal);
                    } else if (emi == null) {
                        currentRow.emi = 0;
                        currentRow.interest = vm.round(emi - currentRow.principal);
                    }

                    calculateSummary();
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

                    calculateSummary();
                }

                vm.searchSupplier = function ($select) {
                    //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers

                    return directoryService.search({ keyword: $select.search, contactType: 3 }).then(function (response) {
                        vm.suppliers = response.data.items;
                    });
                };

                // extended search using search contact popup
                vm.searchSupplierPopoup = function () {
                    $uibModal.open({
                        templateUrl: '~/App/tenant/views/crs/contacts/searchContactModal.cshtml',
                        controller: 'tenant.views.crs.contacts.searchContactModal as vm',
                        backdrop: 'static',
                        resolve: {
                            category: function () {
                                return null;
                            },
                            type: function () {
                                return 3;
                            }
                        }
                    }).result.then(function (supplier) {
                        if (supplier != null) {
                            vm.paymentPlan.supplierBankAccount = supplier;
                        }
                    });
                };

                vm.cancel = function () {
                    $uibModalInstance.dismiss();
                };

                vm.save = function () {
                    $uibModalInstance.close(vm.paymentPlan);
                };

                vm.uploader = new fileUploader({
                    url: abp.appPath + 'Document/UploadTempFile',
                    queueLimit: 1,
                    autoUpload: true,
                    removeAfterUpload: true,
                    filters: [{
                        name: 'filter',
                        fn: function (item, options) {
                            //File type check
                            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                            if ('|vnd.openxmlformats-officedocument.spreadsheetml.sheet|'.indexOf(type) === -1) {
                                abp.message.warn(app.localize('UploadFile_Warn_FileType'));
                                return false;
                            }

                            //File size check
                            if (item.size > 5242880 * 5) //5MB
                            {
                                abp.message.warn(app.localize('Document_Warn_SizeLimit'));
                                return false;
                            }

                            return true;
                        }
                    }]
                });

                vm.uploader.onSuccessItem = function (fileItem, response, status, headers) {
                    vm.importing = true;
                    vm.paymentPlan.installments = [];
                    if (response) {
                        var fileName = response.result.fileName;
                        vm.importing = false;
                        vm.loading = true;
                        billService.importLoanPaymentPlanFromExcel(fileName)
                            .success(function (result) {
                                vm.paymentPlan.installments = result;
                                if (vm.paymentPlan) {
                                    if (vm.paymentPlan.installments) {
                                        for (i = 0; i < vm.paymentPlan.installments.length; i++) {
                                            vm.paymentPlan.installments[i].type = 2;
                                        }
                                    }

                                }

                                if (vm.bill.voucherLines.length == 0)
                                    vm.addRow();

                            })
                            .finally(function () { vm.loading = false; });
                    }
                    else {
                        abp.message.error(response.error.message);
                    }
                };
                vm.uploader.onErrorItem = function (response, error, errorMessage) {
                    vm.loading = true;
                    if (response.isError) {
                        abp.message.error("Error in File Uploading");
                    }

                };

                vm.calculateCreditAndTax = (row) => {

                    if (vm.bill == null)
                        return 0;
                    if (row == null)
                        return 0;
                    if (row.debit != null) {
                        if (vm.bill.taxPercent > 0) {
                            var tax = 0;

                            if (!vm.bill.contact.isTaxExempted) {

                                row.debit = parseFloat(row.amount) * (100 / (100 + vm.bill.taxPercent));
                                row.tax = parseFloat(row.amount) - row.debit;
                            }

                            else {
                                row.tax = 0;
                                row.taxable = (row.taxable);
                                vm.bill.taxPercent = 0;
                            }

                        }
                        else {
                            row.tax = 0;
                            row.taxable = (row.taxable);
                        }
                        row.amount = row.debit + row.tax;
                    }
                    /////////
                    vm.sumAmountTax();
                }

                vm.sumAmountTax = function () {
                    var totalAmount = 0.0;
                    var totalTax = 0.0;
                    vm.bill.voucherLines.forEach(function (value) {
                        if (value.tax)
                            value.tax = vm.rounding(value.tax);
                        if (value.debit > 0)
                            totalAmount = totalAmount + parseFloat(value.debit);
                        if (value.tax > 0) {
                            value.taxable = true;
                            totalTax += utilities.round(value.tax, 2);
                        }
                        else
                            value.taxable = false;
                        value.amount = value.debit + value.tax;
                    });
                    vm.bill.tax = totalTax;
                    vm.withoutDiscountAmount = vm.isTaxInclusive ? utilities.round(totalAmount, 2) : (utilities.round(totalAmount, 2) + utilities.round(totalTax, 2)) / 1;
                    vm.withoutDiscountAmount = utilities.round(vm.withoutDiscountAmount, 2);
                    if (vm.bill.discount != null) {
                        vm.bill.amount = vm.withoutDiscountAmount - vm.bill.discount;
                    }
                    else {
                        vm.bill.amount = vm.withoutDiscountAmount;
                    }
                    if (vm.bill.amount > 0) {
                        if (vm.autoCalculateAmountInWords === "true")
                            vm.bill.amountInWords = utilities.toWords(vm.bill.amount);
                    }
                };

                vm.sumAmount = function () {

                    if (vm.bill == null)
                        return 0;

                    if (vm.bill.voucherLines == null)
                        return 0;

                    var sum = 0;
                    var totalTax = 0.0;
                    for (var i = 0; i < vm.bill.voucherLines.length; i++) {
                        if (vm.bill.voucherLines[i].debit != null) {
                            sum = sum + parseFloat(vm.bill.voucherLines[i].debit);

                            if (vm.bill.taxPercent > 0) {
                                var tax = 0;
                                if (!vm.bill.contact.isTaxExempted) {
                                    if (vm.isTaxInclusive) {   // prices are with tax. extract include tax amount which will not be added in 
                                        //equation solved from following formula... 
                                        //chargesWithoutTax + chargesWithoutTax * (taxPercent/100) = chargesWithTax
                                        var chargesWithoutTax = (vm.bill.voucherLines[i].debit * 100) / (100 + vm.bill.taxPercent);
                                        tax = utilities.round(vm.bill.voucherLines[i].debit - chargesWithoutTax, 2);
                                        totalTax += utilities.round(tax, 2);
                                    } else {
                                        //prices are without tax. calculate tax and include in total
                                        tax = utilities.round(vm.bill.voucherLines[i].debit * vm.bill.taxPercent / 100, 2);
                                        totalTax += utilities.round(tax, 2);
                                        // vm.tripCharges[i].charges += utilities.round(tax,2);

                                    }
                                    vm.bill.voucherLines[i].tax = tax;
                                    if (tax > 0)
                                        vm.bill.voucherLines[i].taxable = true;
                                    //}
                                    //else {
                                    //    vm.bill.voucherLines[i].tax = 0;
                                    //    vm.bill.voucherLines[i].taxable = false;
                                    //}
                                }
                                else {
                                    vm.bill.voucherLines[i].tax = 0;
                                    vm.bill.voucherLines[i].taxable = false;
                                }
                            }
                            else {
                                vm.bill.voucherLines[i].tax = 0;
                                vm.bill.voucherLines[i].taxable = false;
                            }
                        }

                    }


                    vm.bill.amountInWords = '';

                    vm.bill.tax = totalTax;
                    vm.bill.amount = vm.isTaxInclusive ? utilities.round(sum, 2) : (utilities.round(sum, 2) + utilities.round(totalTax, 2)) / 1;
                    vm.bill.amount = utilities.round(vm.bill.amount, 2);
                    if (vm.bill.amount > 0) {
                        if (vm.autoCalculateAmountInWords == "true")
                            vm.bill.amountInWords = utilities.toWords(vm.bill.amount);
                    }

                    return { totalCharges: utilities.round(sum, 2), totalTax: utilities.round(totalTax, 2), totalWithTax: (utilities.round(sum, 2) + utilities.round(totalTax, 2)) / 1 };
                };


                function init() {
                    vm.loading = true;
                    getBankAccounts();
                    //if (vm.paymentPlan && vm.paymentPlan.installments.length == 0)
                    //    vm.addRow(true);
                    vm.downPayment = vm.paymentPlan.downPayment;
                    if (vm.enterInterestAmount) {
                        vm.principalAmount = vm.totalBillAmount - (vm.downPayment || 0);
                        updateRateFromInterestAmount();
                    }
                    if (vm.paymentPlan && vm.paymentPlan.installments.length > 0) {
                        //vm.downPayment = vm.paymentPlan.installments.filter(e => !isNaN(e.amount) && e.type == 1).reduce((p, c) => p + c.amount, 0);

                        //vm.downpaymentDate = vm.paymentPlan.installments.find(e => e.type == 1) ?.date;
                        vm.firstEMIDate = vm.paymentPlan.installments.find(e => e.type == 2)?.date;

                        vm.loanAmountWithInterest = vm.paymentPlan.installments.filter(e => !isNaN(e.amount) && e.type != 1).reduce((p, c) => p + c.amount, 0);
                        vm.principalAmount = vm.loanAmountWithInterest - vm.paymentPlan.interest;
                        if (vm.enterInterestAmount) {
                            updateRateFromInterestAmount();
                        } else {
                            vm.paymentPlan.interest = vm.principalAmount * (vm.paymentPlan.rate / 100);
                        }
                    }

                }

                init();
            }
        ]);
