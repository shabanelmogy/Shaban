// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:163931-164267
appModule.controller('tenant.views.crs.banking.cashBankDeposit.createOrEditModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.cashBankDeposit', 'cashBankDepositId', 'abp.services.app.commonLookup', 'abp.services.app.bankAccount', 'abp.services.app.billingMethod', 'appSession', '$filter', 'utilities',
        function ($scope, $uibModalInstance, cashBankService, cashBankDepositId, commonLookupService, bankAccountService, billingMethodService, appSession, $filter, utilities) {

            var vm = this;
            vm.saving = false;
            vm.isEditMod = false;
            vm.selectedAccount = null;
            vm.locations = [];
            vm.allSelected = false;
            vm.cashBankDeposit = [];
            vm.bankAccounts = [];
            vm.saveAndPrint = false;
            var currentBankId = 0;
            vm.allowAutoAllocationOnCashDeposits = utilities.parseBoolean(abp.setting.get("App.Speed.Common.AllowAutoAllocationOnCashDeposits"));
            /*var amount = 0;*/
            vm.amountCashDeposit = null;
            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };
            //vm.filters.amount = 0;
            vm.getVoucherType = function (type, subType) {
                return utilities.getVoucherType(type, subType);
            };

            vm.applyChangeToAll = function () {
                vm.cashBankDeposit.receiptLines.forEach(function (value) {
                    value.selected = vm.allSelected;
                    if (!vm.allSelected)
                        value.depositedNow = 0;
                });
                vm.autoAllocation();
                vm.calculateBalance();
                //if (vm.allSelected) {
                //    angular.forEach(vm.cashBankDeposit.receiptLines, function (val, key) {
                //        if (vm.selectedReceipts.indexOf(val) < 0) {
                //            vm.selectedReceipts.push(val);
                //            val.selected = true;
                //        }
                //    });
                //    vm.calculateBalance();
                //}
                //else {

                //    angular.forEach(vm.cashBankDeposit.receiptLines, function (val, ind) {
                //        val.selected = false;
                //    });
                //    vm.selectedReceipts.splice(0, vm.selectedReceipts.length);
                //    vm.cashBankDeposit.amount = 0;
                //}
            };

            function getLocations() {
                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                });
            };
            vm.autoAllocation = function () {
                if (!vm.allowAutoAllocationOnCashDeposits || !vm.isAmountConfirmed || !vm.allSelected) return;
                if (!vm.cashBankDeposit.receiptLines || vm.cashBankDeposit.receiptLines.length === 0) return;

                // Start with total amount to allocate
                var amountForAllocation = vm.amountCashDeposit;

                vm.cashBankDeposit.receiptLines.forEach(function (line) {
                    if (amountForAllocation <= 0) {
                        line.depositedNow = 0;
                        return;
                    }

                    // Remaining amount that can be deposited for this line
                    var remaining = line.amount - line.deposited;

                    if (remaining > 0) {
                        if (remaining >= amountForAllocation) {
                            line.depositedNow = amountForAllocation;
                            amountForAllocation = 0;
                        } else {
                            line.depositedNow = remaining;
                            amountForAllocation -= remaining;
                        }
                    } else {
                        line.depositedNow = 0;
                    }
                });

                // Recalculate total
                vm.calculateBalance();

            };


            vm.changeRoundOffAmount = function () {
                var sum = 0.0;
                if (vm.cashBankDeposit.amount) {
                    sum = sum + parseFloat(vm.cashBankDeposit.amount);
                }
                if (vm.cashBankDeposit.roundOffAmount) {
                    sum = sum + parseFloat(vm.cashBankDeposit.roundOffAmount);
                }
                vm.cashBankDeposit.netTotal = sum;
            }

            var saveAndPrint = function (Id) {
                window.open('/Report#/tenant/printCashBankDeposit/' + Id);
            };
            function getBillingMethods() {
                vm.loading = true;
                var request = {};
                if (vm.cardTransferDateRange) {
                    request.type = 2;
                }

                billingMethodService.getBillingMethods(request).success(function (data) {
                    vm.billingMethods = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };
            vm.save = function () {
                vm.saving = true;

                if (vm.cashBankDeposit.locationId == null || vm.cashBankDeposit.locationId == 0) {
                    if (appSession.user.locationId != null)
                        vm.cashBankDeposit.locationId = appSession.user.locationId;
                    else
                        vm.cashBankDeposit.locationId = vm.locations[0].id;
                }
                //var selectedReceipts = $filter('filter')(vm.cashBankDeposit.receiptLines, {
                //    selected: true
                //}, true);

                var selectedReceipts = vm.cashBankDeposit.receiptLines.filter(row => row.selected && row.depositedNow != 0);

                if (selectedReceipts.length == 0) return;

                var errorLines = selectedReceipts.filter(row => row.depositedNow > (row.amount - row.deposited));
                if (errorLines.length > 0) {
                    vm.saving = false;
                    abp.message.info('Voucher No: ' + errorLines[0].voucherNo + ' has invalid Deposited Now Value');
                    return;
                }

                // vm.creditCardTransBankTransfer.receiptLines = selectedReceipts;
                vm.cashBankDeposit.receiptLines = selectedReceipts;
                cashBankService.createOrUpdateCashDeposit({
                    cashDeposit: vm.cashBankDeposit,
                }).success(function (result) {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    vm.cashBankDeposit.id = result;
                    if (vm.saveAndPrint)
                        saveAndPrint(vm.cashBankDeposit.id);
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };



            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function getBankAccounts() {
                commonLookupService.getBankAccountsForSelection().success(function (data) {
                    vm.bankAccounts = data.items;
                    vm.selectedAccount = vm.bankAccounts.filter(e => e.id == vm.cashBankDeposit.depositAccountId)[0];
                    getBankNameForView();
                });
            }

            vm.selectedReceipts = [];
            vm.applyChange = function (row) {
                if (!row.selected)
                    row.depositedNow = 0;
                row.depositedNow = vm.rounding(row.depositedNow, 2);
                vm.calculateBalance();
                //if (row.selected)
                //    vm.selectedReceipts.push(row);
                //else {
                //    var ind = vm.selectedReceipts.indexOf(row);
                //    if (ind > -1)
                //        vm.selectedReceipts.splice(ind, 1)
                //    else {

                //    }
                //}

            };

            vm.calculateBalance = function () {
                vm.cashBankDeposit.amount = 0;
                vm.cashBankDeposit.receiptLines.forEach(function (value) {
                    if (value.selected)
                        vm.cashBankDeposit.amount += value.depositedNow;
                });
                vm.changeRoundOffAmount();
                //for (var i in vm.selectedReceipts) {
                //    vm.cashBankDeposit.amount += vm.selectedReceipts[i].depositedNow;
                //}
                //return amount;
            };

            vm.formatNumber = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            vm.accountName = "";
            function getBankNameForView() {
                if (vm.bankAccounts && vm.cashBankDeposit) {

                    if (vm.bankAccounts.length > 0 &&
                        vm.cashBankDeposit.depositAccountId > 0) {
                        var account = $.grep(vm.bankAccounts, function (e) { return e.id == vm.cashBankDeposit.depositAccountId; });
                        vm.accountName = account[0].accountNo + ' ' + account[0].bankName;

                    }
                }
            };
            vm.filterVouchersData = function () {
                cashBankService.getCashDepositForEdit({ id: cashBankDepositId })
                    .success(function (result) {
                        vm.cashBankDeposit = result;

                        vm.allocationDataOriginal = angular.copy(vm.cashBankDeposit.receiptLines);
                        vm.cashBankDeposit.receiptLines = vm.allocationDataOriginal;

                        if (vm.filters && vm.filters.billingMethodId > 0) {
                            vm.cashBankDeposit.receiptLines = vm.allocationDataOriginal.filter(item => item.billingMethodId === vm.filters.billingMethodId);
                        }

                        commonLookupService.getBankAccountsForSelection().success(function (data) {
                            vm.bankAccounts = data.items;

                            if (vm.cashBankDeposit.depositAccountId) {
                                vm.selectedAccount = vm.bankAccounts.find(
                                    e => e.id === vm.cashBankDeposit.depositAccountId
                                );
                            }

                            if (!vm.selectedAccount && vm.bankAccounts.length > 0) {
                                vm.selectedAccount = null;
                            }

                            getBankNameForView();
                        });
                    })
                    .finally(function () {
                        vm.loading = false;
                    });
            };


            function init() {
                vm.loading = true;
                getBillingMethods();
                getLocations();
                if (cashBankDepositId > 0) {
                    cashBankService.getCashDepositForEdit({ id: cashBankDepositId })
                        .success(function (result) {
                            vm.cashBankDeposit = result;
                            vm.allocationDataOriginal = angular.copy(result);
                            if (vm.cashBankDeposit.id > 0) {
                                vm.isEditMod = true;
                                vm.cashBankDeposit.netTotal = parseFloat(vm.cashBankDeposit.amount) + parseFloat(vm.cashBankDeposit.roundOffAmount);

                            } else {
                                vm.isEditMod = false;
                                vm.cashBankDeposit.roundOffAmount = 0.0;
                                vm.cashBankDeposit.netTotal = 0.0;
                            }
                            getBankAccounts();
                            vm.loading = false;
                        }).finally(function () {
                            vm.loading = false;
                        });
                }
                else if (!cashBankDepositId && (appSession.tenant.id == 403 || appSession.tenant.id == 4858 || appSession.tenant.id == 5430)) {
                    cashBankService.getCashDepositForEditView({ id: cashBankDepositId })
                        .success(function (result) {
                            vm.cashBankDeposit = result;
                            vm.allocationDataOriginal = angular.copy(result);
                            if (vm.cashBankDeposit.id > 0) {
                                vm.isEditMod = true;
                                vm.cashBankDeposit.netTotal = parseFloat(vm.cashBankDeposit.amount) + parseFloat(vm.cashBankDeposit.roundOffAmount);

                            } else {
                                vm.isEditMod = false;
                                vm.cashBankDeposit.roundOffAmount = 0.0;
                                vm.cashBankDeposit.netTotal = 0.0;
                            }
                            getBankAccounts();
                            vm.loading = false;
                        }).finally(function () {
                            vm.loading = false;
                        });
                }
                else if (!cashBankDepositId && !(appSession.tenant.id == 403 || appSession.tenant.id == 4858 || appSession.tenant.id == 5430)) {
                    cashBankService.getCashDepositForEdit({ id: cashBankDepositId })
                        .success(function (result) {
                            vm.cashBankDeposit = result;
                            vm.allocationDataOriginal = angular.copy(result);
                            if (vm.cashBankDeposit.id > 0) {
                                vm.isEditMod = true;
                                vm.cashBankDeposit.netTotal = parseFloat(vm.cashBankDeposit.amount) + parseFloat(vm.cashBankDeposit.roundOffAmount);

                            } else {
                                vm.isEditMod = false;
                                vm.cashBankDeposit.roundOffAmount = 0.0;
                                vm.cashBankDeposit.netTotal = 0.0;
                            }
                            getBankAccounts();
                            vm.loading = false;
                        }).finally(function () {
                            vm.loading = false;
                        });
                }

            }

            init();
        }
    ]);
