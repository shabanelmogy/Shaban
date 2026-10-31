// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:327024-327246
appModule.controller('tenant.views.crs.vouchers.bills.payAllInstallmentsModal',
        ['$uibModalInstance', 'abp.services.app.paymentPlan', 'utilities', 'installments','$scope',
            function ($uibModalInstance, paymentPlanService, utilities, installments, $scope) {
                var vm = this;
                vm.loading = false;
                vm.multiSelectLoanEMI = utilities.parseBoolean(abp.setting.get('App.Speed.Common.MultiSelectLoanEMI'));
                vm.installments = installments.map(function (loan) {
                    return {
                        id: loan.id,
                        dealNo: loan.dealNo,
                        billNo: loan.billNo,
                        emiNo: loan.emiNo,
                        amount: loan.amount,
                        interest: loan.interest,
                        date: loan.date,
                        recoveryBankAccountId: loan.recoveryBankAccountId,
                        isProcessing: false,
                        isDone: false,
                        error: null
                    };
                });

                vm.totalAmount = 0;
                vm.totalInterest = 0;
                vm.totalPrincipal = 0;

                vm.CurrencyFormate = function (amount) {
                    if (amount == null) return null;
                    return amount.toLocaleString('en');
                };

                vm.round = function (amount) {
                    if (amount == null) return null;
                    return utilities.round(amount, 2);
                };

                vm.getPrincipal = function (inst) {
                    return vm.round(inst.amount - (inst.interest || 0));
                };

                vm.updateTotals = function () {
                    vm.totalAmount = vm.installments.reduce(function (s, i) {
                        return s + (i.amount || 0);
                    }, 0);
                    vm.totalInterest = vm.installments.reduce(function (s, i) {
                        return s + (i.interest || 0);
                    }, 0);
                    vm.totalPrincipal = vm.installments.reduce(function (s, i) {
                        return s + (i.amount - (i.interest || 0));
                    }, 0);
                };

                vm.updateTotals();

                vm.cancel = function () {
                    $uibModalInstance.dismiss();
                };

                vm.saveAll = function () {
                    var invalidInterest = vm.installments.some(function (installment) {
                        return parseFloat(installment.interest || 0) > parseFloat(installment.amount || 0);
                    });
                    if (invalidInterest) {
                        abp.message.error("Interest amount cannot be greater than the installment amount.");
                        return;
                    }

                    abp.message.confirm(
                        "Are you sure you want to pay all selected EMIs?",
                        function (isConfirmed) {
                            if (isConfirmed) {
                                vm.processAll();
                            }
                        }
                    );
                };
                vm.importData = function () {
                    var input = document.createElement('input');
                    input.type = 'file';
                    input.accept = '.xlsx,.xls';
                    input.onchange = function (e) {
                        vm.selectedFile = e.target.files[0];
                        readFileData();
                    };
                    input.click();
                };

                vm.downloadSample = function () {
                    var rows = [
                        ['Deal No', 'EMI No', 'Interest Amount'],
                        ['43232', 1, 391.65]
                    ];
                    var workbook = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(rows), 'Interest Import');
                    XLSX.writeFile(workbook, 'Loan-EMI-Interest-Sample.xlsx');
                };

                function readFileData() {
                    var file = vm.selectedFile;

                    if (file && ['xlsx', 'xls'].indexOf(file.name.split('.').pop().toLowerCase()) > -1) {

                        var reader = new FileReader();
                        vm.loading = true;

                        reader.onload = function (e) {
                            try {
                                var workbook = XLSX.read(e.target.result, { type: 'array', cellDates: false });
                                var sheet = workbook.Sheets[workbook.SheetNames[0]];
                                var rows = XLSX.utils.sheet_to_json(sheet, { defval: '', raw: true });
                                var normalize = function (value) { return (value == null ? '' : value.toString()).replace(/\s/g, '').toLowerCase(); };
                                var keyFor = function (dealNo, emiNo) { return normalize(dealNo) + '|' + normalize(emiNo); };
                                var selectedByKey = {};
                                vm.installments.forEach(function (inst) {
                                    var key = keyFor(inst.dealNo, inst.emiNo);
                                    if (!selectedByKey[key]) selectedByKey[key] = [];
                                    selectedByKey[key].push(inst);
                                });

                                if (!rows.length) throw new Error('The selected file has no data rows.');
                                var imported = {};
                                var invalidRows = [];
                                rows.forEach(function (row, index) {
                                    var normalized = {};
                                    Object.keys(row).forEach(function (name) { normalized[normalize(name)] = row[name]; });
                                    var dealNo = normalized.dealno;
                                    var emiNo = normalized.emino;
                                    var interest = normalized.interestamount;
                                    if (interest === undefined) interest = normalized.interest;
                                    var amount = typeof interest === 'number' ? interest : parseFloat((interest || '').toString().replace(/,/g, ''));
                                    var key = keyFor(dealNo, emiNo);
                                    if (!normalize(dealNo) || !normalize(emiNo) || interest === '' || interest === undefined || !isFinite(amount) || amount < 0 || Object.prototype.hasOwnProperty.call(imported, key)) {
                                        invalidRows.push(index + 2);
                                    } else {
                                        imported[key] = amount;
                                    }
                                });
                                if (invalidRows.length) throw new Error('Check required columns (Deal No, EMI No, Interest Amount), non-negative amounts, and duplicate rows. Invalid row(s): ' + invalidRows.join(', '));

                                var matched = 0;
                                var unmatched = [];
                                Object.keys(imported).forEach(function (key) {
                                    var matches = selectedByKey[key];
                                    if (!matches || matches.length !== 1) {
                                        unmatched.push(key.replace('|', ' / '));
                                        return;
                                    }
                                    if (matches[0].isDone || matches[0].isProcessing) {
                                        unmatched.push(key.replace('|', ' / '));
                                        return;
                                    }
                                    matches[0].interest = imported[key];
                                    matched++;
                                });
                                if (!matched) throw new Error('No imported Deal No and EMI No matched the selected pending installments.');
                                vm.updateTotals();
                                var message = matched + ' installment(s) updated.';
                                if (unmatched.length) message += ' No selected pending match for: ' + unmatched.join(', ');
                                abp.message.success(message, 'Import complete');
                            } catch (err) {
                                abp.message.error(err.message || 'The file could not be imported.', 'Import failed');
                            } finally {
                                vm.loading = false;
                                $scope.$apply();
                            }
                        };

                        reader.onerror = function () {
                            vm.loading = false;
                            abp.message.error('The selected file could not be read.', 'Import failed');
                            $scope.$apply();
                        };

                        reader.readAsArrayBuffer(file);

                    } else {
                        abp.message.error("Please select a valid file to upload!", "Unknown File");
                        vm.loading = false;
                    }
                }
                vm.processAll = async function () {
                    vm.loading = true;
                    var allSuccess = true;

                    for (var inst of vm.installments) {
                        inst.isProcessing = true;
                        inst.error = null;

                        try {
                            await paymentPlanService.payInstallmentAmount({
                                id: inst.id,
                                interest: inst.interest || 0,
                                bankAccountId: inst.recoveryBankAccountId
                            }).success(function (currentInst) {
                                return function () {
                                    currentInst.isDone = true;
                                    currentInst.isProcessing = false;
                                };
                            }(inst)).catch(function (currentInst) {
                                return function () {
                                    currentInst.error = "Failed";
                                    currentInst.isProcessing = false;
                                    allSuccess = false;
                                };
                            }(inst));
                        } catch (e) {
                            inst.error = "Failed";
                            inst.isProcessing = false;
                            allSuccess = false;
                        }
                    }

                    vm.loading = false;

                    if (allSuccess) {
                        abp.message.success("All installments paid successfully!");
                        $uibModalInstance.close();
                    } else {
                        abp.message.warn("Some installments could not be processed. Please review.");
                    }
                };
            }
        ]);
