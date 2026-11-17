// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:168752-169160
appModule.controller('tenant.views.crs.banking.creditCardTransBankTransfer.createOrEditModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.creditCardTransBankTransfer', 'creditCardTransBankTransferId', 'abp.services.app.commonLookup', 'abp.services.app.bankAccount', 'abp.services.app.billingMethod', 'appSession', 'utilities', '$filter',
        function ($scope, $uibModalInstance, creditCardTransTransferService, creditCardTransBankTransferId, commonLookupService, bankAccountService, billingMethodService, appSession, utilities, $filter) {

            var vm = this;
            vm.saving = false;
            vm.isEditMod = false;
            vm.selectedAccount = null;
            vm.locations = [];
            vm.allSelected = false;
            vm.creditCardTransBankTransfer = [];
            vm.bankAccounts = [];
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.cardTransferDateRange = utilities.parseBoolean(abp.setting.get("App.General.CardTransactionBankTransferDateRangeBase"));
            vm.isCreditCardCommissionsEnabled = abp.features.isEnabled("CRS.Vouchers.CreditCardCommissions");
            vm.applyVAT = false;
            vm.surchargePerTrans = 0;
            vm.saveAndPrint = false;



            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));


            function initDate() {
                vm.dateRangeModel = {
                    startDate: moment().startOf('day'),
                    endDate: moment().endOf('day')
                };
            }

            vm.dateRangeModelChanged = function () {
                vm.creditCardTransBankTransfer.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                vm.creditCardTransBankTransfer.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
            };

            vm.getVoucherType = function (type, subType) {
                return utilities.getVoucherType(type, subType);
            };
            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };
            vm.applyChangeToAll = function () {

                //if (vm.allSelected) {
                //    angular.forEach(vm.creditCardTransBankTransfer.receiptLines, function (val, key) {
                //        if (vm.selectedReceipts.indexOf(val) < 0) {
                //            vm.selectedReceipts.push(val);
                //            val.selected = true;
                //        }
                //    });
                //    vm.calculateBalance();
                //}
                //else {

                //    angular.forEach(vm.creditCardTransBankTransfer.receiptLines, function (val, ind) {
                //        val.selected = false;
                //    });
                //    vm.selectedReceipts.splice(0, vm.selectedReceipts.length);
                //    vm.creditCardTransBankTransfer.amount = 0;
                //}
                if (vm.allSelected) {
                    angular.forEach(vm.data, function (row) {
                        row.selected = vm.allSelected;
                        vm.commissionChange(row);
                    });
                }
                else {
                    angular.forEach(vm.data, function (row) {
                        row.selected = vm.allSelected;
                        row.commissionPercentage = 0;
                        row.commission = 0;
                        row.tax = 0;
                        row.netAmount = 0;
                    });
                    vm.creditCardTransBankTransfer.amount = 0;
                    vm.creditCardTransBankTransfer.totalCommission = 0;
                    vm.creditCardTransBankTransfer.totalTax = 0;
                    vm.creditCardTransBankTransfer.totalNetAmount = 0;
                }

            };

            function getLocations() {
                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                });
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

            var saveAndPrint = function (Id) {

                window.open('/Report#/tenant/printCreditCardTransTransfer/' + Id);
            };

            vm.save = function () {

                if (vm.creditCardTransBankTransfer.locationId == null || vm.creditCardTransBankTransfer.locationId == 0) {
                    if (appSession.user.locationId != null)
                        vm.creditCardTransBankTransfer.locationId = appSession.user.locationId;
                    else
                        vm.creditCardTransBankTransfer.locationId = vm.locations[0].id;
                }

                var selectedReceipts = $filter('filter')(vm.data, {
                    selected: true
                }, true);

                if (selectedReceipts.length == 0) return;

                vm.creditCardTransBankTransfer.receiptLines = selectedReceipts;
                vm.saving = true;
                vm.creditCardTransBankTransfer.surchargePerTrans = vm.surchargePerTrans;
                creditCardTransTransferService.createOrUpdateCreditCardTransBankTransfer({
                    creditCardTransBankTransfer: vm.creditCardTransBankTransfer,
                }).success(function (result) {
                    vm.creditCardTransBankTransfer.id = result;
                    if (vm.saveAndPrint)
                        saveAndPrint(vm.creditCardTransBankTransfer.id);
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };

            vm.filterVouchersData = function () {

                creditCardTransTransferService.getCreditCardTransBankTransferForEdit({
                    id: vm.creditCardTransBankTransfer.id,
                    date: vm.creditCardTransBankTransfer.date,
                    fromDate: vm.creditCardTransBankTransfer.fromDate,
                    toDate: vm.creditCardTransBankTransfer.toDate
                }).success(function (result) {
                    vm.creditCardTransBankTransfer = result;

                    vm.originalData = angular.copy(vm.creditCardTransBankTransfer.receiptLines);
                    vm.data = vm.originalData;

                    if (vm.filters.billingMethodId > 0) {
                        vm.data = vm.originalData.filter(item => item.billingMethodId === vm.filters.billingMethodId);
                    } else {
                        vm.data = vm.originalData;
                    }
                });
            };

            function init() {
                vm.loading = true;
                initDate();
                getBillingMethods();
                getLocations();

                if (vm.taxPercent > 0 && !vm.isTaxInclusive)
                    vm.applyVAT = true;

                if (vm.cardTransferDateRange) {
                    vm.creditCardTransBankTransfer.fromDate = vm.dateRangeModel.startDate ? vm.dateRangeModel.startDate : null;
                    vm.creditCardTransBankTransfer.toDate = vm.dateRangeModel.endDate ? vm.dateRangeModel.endDate : null;
                }

                vm.creditCardTransBankTransfer.date = new Date();

                creditCardTransTransferService.getCreditCardTransBankTransferForEdit({
                    id: creditCardTransBankTransferId,
                    date: vm.creditCardTransBankTransfer.date,
                    fromDate: vm.creditCardTransBankTransfer.fromDate,
                    toDate: vm.creditCardTransBankTransfer.toDate
                })
                    .success(function (result) {
                        vm.creditCardTransBankTransfer = result;
                        getBankAccounts();
                        if (vm.creditCardTransBankTransfer.id > 0) {
                            vm.isEditMod = true;
                            vm.originalData = angular.copy(vm.creditCardTransBankTransfer.receiptLines);
                            vm.surchargePerTrans = vm.creditCardTransBankTransfer.surchargePerTrans;
                            vm.data = vm.creditCardTransBankTransfer.receiptLines || [];
                            angular.forEach(vm.data, function (val, key) {
                                
                                vm.taxChange(val);
                            });

                        } else {
                            vm.isEditMod = false;
                            vm.data = vm.creditCardTransBankTransfer.receiptLines || [];
                        }
                        vm.loading = false;
                    }).finally(function () {
                        vm.loading = false;
                    });
            }

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function getBankAccounts() {
                commonLookupService.getBankAccountsForSelection().success(function (data) {
                    vm.bankAccounts = data.items;
                    var foundLines = $filter('filter')(vm.bankAccounts, {
                        id: vm.creditCardTransBankTransfer.depositAccountId
                    }, true);
                    if (foundLines.length > 0)
                        vm.selectedAccount = foundLines[0];
                    getBankNameForView();

                });
            }

            vm.selectedReceipts = [];
            //vm.applyChange = function (row) {

            //    if (row.selected)
            //        vm.selectedReceipts.push(row);
            //    else {
            //        var ind = vm.selectedReceipts.indexOf(row);
            //        if (ind > -1)
            //            vm.selectedReceipts.splice(ind, 1)
            //        else {
            //            
            //        }
            //    }
            //    vm.calculateBalance();
            //};
            vm.applyChange = function (row) {

                if (row.selected)
                    vm.commissionChange(row);
                else {
                    row.commission = 0;
                    row.tax = 0;
                    row.netAmount = 0;
                    //row.commissionPercentage = 0;
                }
                vm.calculateBalance();
            };

            vm.calculateBalance = function () {

                vm.creditCardTransBankTransfer.amount = 0;
                vm.creditCardTransBankTransfer.totalCommission = 0;
                vm.creditCardTransBankTransfer.totalTax = 0;
                vm.creditCardTransBankTransfer.totalNetAmount = 0;


                //for (var i in vm.selectedReceipts) {
                //    vm.creditCardTransBankTransfer.amount += vm.selectedReceipts[i].amount;
                //    vm.creditCardTransBankTransfer.totalCommission += vm.selectedReceipts[i].commission;
                //    vm.creditCardTransBankTransfer.totalTax += vm.selectedReceipts[i].tax;
                //    vm.creditCardTransBankTransfer.totalNetAmount += vm.selectedReceipts[i].netAmount;
                //}

                //if (!vm.creditCardTransBankTransfer.totalCommission) vm.creditCardTransBankTransfer.totalCommission = 0;
                //else
                //    vm.creditCardTransBankTransfer.totalCommission = round(vm.creditCardTransBankTransfer.totalCommission, 2);
                //vm.creditCardTransBankTransfer.totalNetAmount = round(vm.creditCardTransBankTransfer.totalNetAmount, 2);
                //vm.creditCardTransBankTransfer.totalTax = round(vm.creditCardTransBankTransfer.totalTax, 2);

                if (vm.creditCardTransBankTransfer != null) {
                    angular.forEach(vm.data, function (row) {
                        if (row.selected) {
                            vm.creditCardTransBankTransfer.amount += vm.rounding(row.amount);
                            vm.creditCardTransBankTransfer.totalCommission += vm.rounding(row.commission);
                            vm.creditCardTransBankTransfer.totalTax += vm.rounding(row.tax);
                            vm.creditCardTransBankTransfer.totalNetAmount += vm.rounding(row.netAmount);
                        }
                    });
                }
                if (!vm.creditCardTransBankTransfer.totalCommission) vm.creditCardTransBankTransfer.totalCommission = 0;
                else
                    vm.creditCardTransBankTransfer.totalCommission = vm.rounding(vm.creditCardTransBankTransfer.totalCommission);
                vm.creditCardTransBankTransfer.totalNetAmount = vm.rounding(vm.creditCardTransBankTransfer.totalNetAmount);
                vm.creditCardTransBankTransfer.totalTax = vm.rounding(vm.creditCardTransBankTransfer.totalTax);
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
                if (vm.bankAccounts && vm.creditCardTransBankTransfer) {

                    if (vm.bankAccounts.length > 0 &&
                        vm.creditCardTransBankTransfer.depositAccountId > 0) {
                        var account = $.grep(vm.bankAccounts, function (e) { return e.id == vm.creditCardTransBankTransfer.depositAccountId; });
                        vm.accountName = account[0].accountNo + ' ' + account[0].bankName;
                    }
                }
            };

            function round(value, decimals) {
                return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
            }
            function roundNumber(num, scale) {
                if (!("" + num).includes("e")) {
                    return +(Math.round(num + "e+" + scale) + "e-" + scale);
                } else {
                    var arr = ("" + num).split("e");
                    var sig = ""
                    if (+arr[1] + scale > 0) {
                        sig = "+";
                    }
                    return +(Math.round(+arr[0] + "e" + sig + (+arr[1] + scale)) + "e-" + scale);
                }
            }
            vm.calculateTaxPerRow = function (row) {
                if (vm.isTaxInclusive) {   // prices are with tax. extract include tax amount which will not be added in 
                    //equation solved from following formula... 
                    //chargesWithoutTax + chargesWithoutTax * (taxPercent/100) = chargesWithTax
                    var chargesWithoutTax = (row.commission * 100) / (100 + vm.taxPercent);
                    row.tax = utilities.round(row.commission - chargesWithoutTax, 2);
                    vm.calculateBalance();
                }
            };

            vm.commissionChange = function (row) {

                if (!vm.surchargePerTrans) vm.surchargePerTrans = 0;
                var calculatedAmount = 0;
                if (vm.isCreditCardCommissionsEnabled && row.creditCardCommission > 0) {
                    calculatedAmount = row.amount - row.creditCardCommission - row.creditCardCommissionVatAmount;

                }
                else
                {
                    calculatedAmount = row.amount;
                }

                var comission = (calculatedAmount * row.commissionPercentage) / 100;
                var comm = vm.rounding(comission);
                // var comm = vm.rounding(comission);
                var commWithSurcharge = vm.rounding(parseFloat(vm.surchargePerTrans) + comm);
                //if (row.voucherType != 3)
                row.commission = vm.rounding(commWithSurcharge);

                if (vm.applyVAT) {
                    row.tax = vm.rounding((row.commission * vm.taxPercent) / 100);
                    row.netAmount = vm.rounding(row.amount - row.commission - row.tax);
                }
                else
                    row.netAmount = vm.rounding(row.amount - row.commission);

                vm.calculateBalance();
            };

            vm.taxChange = function (row) {

                if (vm.applyVAT) {
                    row.netAmount = vm.rounding(row.amount - row.commission - row.tax);
                }
                vm.calculateBalance();
            }

            vm.surchargeChanged = function () {
                if (vm.creditCardTransBankTransfer != null) {
                    angular.forEach(vm.data, function (row, index) {
                        if (row.selected)
                            vm.commissionChange(row);
                    });
                }
            };
            vm.commChange = function (row) {
                row.commissionPercentage = (row.commission / row.amount) * 100;
                if (!vm.surchargePerTrans) vm.surchargePerTrans = 0;
                var comission = (row.amount * row.commissionPercentage) / 100;
                var comm = vm.rounding(comission);
                // var comm = vm.rounding(comission);
                var commWithSurcharge = vm.rounding(parseFloat(vm.surchargePerTrans) + comm);
                //if (row.voucherType != 3)
                row.commission = row.commission ? row.commission : vm.rounding(commWithSurcharge);

                if (vm.applyVAT) {
                    row.tax = vm.rounding((row.commission * vm.taxPercent) / 100);
                    row.netAmount = vm.rounding(row.amount - row.commission - row.tax);
                }
                else
                    row.netAmount = vm.rounding(row.amount - row.commission);

                vm.calculateBalance();

            }

            init();
        }
    ]);
