// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:205898-206329
appModule.controller('tenant.views.crs.equipmentSales.agreements.earlySettlementModal', ['$scope', '$timeout', '$filter', 'utilities', 'appSession', '$uibModal', 'abp.services.app.salesAgreement', 'abp.services.app.commonLookup', 'agreementId', '$uibModalInstance',
        function ($scope, $timeout, $filter, utilities, appSession, $uibModal, salesAgreementService, commonLookupService, agreementId, $uibModalInstance) {

            var vm = this;

            // === Basic info ===
            vm.loading = false;
            vm.tenantName = appSession.tenant.name;
            vm.tenancyName = appSession.tenant.tenancyName;
            vm.locationId = appSession.user.locationId;
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.currency = abp.setting.get("App.General.CurrencyCode");
            vm.taxPercent = 0;
            vm.settlementTotal = 0;
            vm.fileName = vm.tenancyName.toLowerCase() + '-' + 'header.png';
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.timeFormat = 'HH:mm';
            vm.showSignatureButton = true;
            vm.floor = Math.floor;
            vm.rounding = utilities.round;
            vm.roundingWithSeparator = function (value) {
                return utilities.round(value).toLocaleString();
            };
            vm.earlySettlementAdjustment = 0;
            vm.earlySettlementLabel = "Early Settlement Adjustment";

            function calculateEarlySettlementAdjustment() {

                var expectedTotal = vm.agreement.totalAmountEarlySettled || 0;
                //var expectedTotal = vm.agreement.totalAmount || 0;
                var actualTotal = vm.settlementTotal || 0;

                vm.earlySettlementAdjustment = vm.rounding(actualTotal - expectedTotal);

                if (vm.earlySettlementAdjustment < 0) {
                    vm.earlySettlementLabel = "Early Settlement Discount";
                }
                else if (vm.earlySettlementAdjustment > 0) {
                    vm.earlySettlementLabel = "Early Settlement Adjustment";
                }
                else {
                    vm.earlySettlementLabel = "No Adjustment";
                }
            }
            vm.localize = function (input) {
                return input ? app.localize(input) : "";
            };
            vm.onImageError = function () { vm.imgError = true; };
            vm.getlocalDateTime = function (date, format) {
                if (!date) return "";
                var localTime = moment.utc(date).toDate();
                return moment(localTime).format(format);
            };

            vm.save = function () {

                var input = {
                    agreementId: vm.agreement.id,

                    vehiclePrinciple: vm.vehiclePrinciple,
                    vehiclePrincipleTax: vm.vehiclePrincipleTax,
                    otherChargesPrinciple: vm.otherChargesPrinciple,
                    otherChargesPrincipleTax: vm.otherChargesPrincipleTax,
                    vehicleFinance: vm.vehicleFinance,
                    vehicleFinanceTax: vm.vehicleFinanceTax,
                    otherChargesFinance: vm.otherChargesFinance,
                    otherChargesFinanceTax: vm.otherChargesFinanceTax,

                    settlementDate: moment().format()
                };

                vm.saving = true;

                salesAgreementService.earlySettlement(input)
                    .then(function () {

                        abp.notify.success("Early Settlement Saved");

                        $uibModalInstance.close();

                    }).finally(function () {

                        vm.saving = false;

                    });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            vm.getOtherChargesEMI = function () {
                if (!vm.agreement || !vm.agreement.charges) {
                    vm.agreement.otherChargesEMI = 0;
                    return 0;
                }

                var total = vm.agreement.charges
                    .filter(c =>
                        !c.applyOnClosing && c.chargesTypeId != 78 && c.chargesTypeId != 79 &&
                        c.isAddInEMI === true
                    )
                    .reduce((sum, c) => sum + (parseFloat(c.emi) + parseFloat(c.emiTax) || 0), 0);

                vm.agreement.otherChargesEMI = vm.rounding(total);

                vm.agreement.perInstallmentAmount =
                    vm.rounding((vm.agreement.emiCore || 0) + vm.agreement.otherChargesEMI);

                return vm.agreement.otherChargesEMI;
            };
            vm.updateFinanceTax = function () {

                var taxRate = (vm.taxPercent || 0) / 100;

                vm.vehicleFinanceTax = vm.rounding((vm.vehicleFinance || 0) * taxRate);
                vm.otherChargesFinanceTax = vm.rounding((vm.otherChargesFinance || 0) * taxRate);

                vm.totalFinance = (vm.vehicleFinance || 0) + (vm.otherChargesFinance || 0);

                // ✅ Use NEW variable
                vm.settlementTotal =
                    (vm.vehiclePrinciple || 0) +
                    (vm.vehiclePrincipleTax || 0) +
                    (vm.vehicleFinance || 0) +
                    (vm.vehicleFinanceTax || 0) +
                    (vm.otherChargesPrinciple || 0) +
                    (vm.otherChargesPrincipleTax || 0) +
                    (vm.otherChargesFinance || 0) +
                    (vm.otherChargesFinanceTax || 0);

                vm.remaining = vm.totalAmountOfInstallments - (vm.totalPaid || 0);
                calculateEarlySettlementAdjustment();
            };
            vm.excludeTax = function (amountWithTax) {

                if (!(vm.taxPercent > 0)) {
                    return amountWithTax; // no tax → return as-is
                }

                var taxRate = vm.taxPercent / 100;
                return amountWithTax / (1 + taxRate);
            };
            // === Arabic translations for charges ===
            // === Fetch agreement data and map totals ===
            function init() {
                vm.loading = true;

                // If agreementId is 0, check $stateParams
                //if (agreementId === 0 && !isNaN($stateParams.query)) {
                //    agreementId = $stateParams.query;
                //    vm.agreementId = agreementId;
                //}

                salesAgreementService.getSalesAgreementForEdit({ id: agreementId })
                    .success(function (result) {

                        vm.agreement = result.agreement;
                        vm.advance = result.advance ? result.advance.amount || 0 : 0;
                        vm.deposit = result.deposit ? result.deposit.amount || 0 : 0;
                        vm.taxPercent = vm.agreement.taxPercent || 0;

                        //new code start
                        // ===============================
                        // NEW EARLY SETTLEMENT LOGIC
                        // ===============================

                        var installments = vm.agreement.agreementPaymentInstallments || [];
                        let actualInstallments = installments;
                        var remainingAmount = vm.agreement.totalCharges - vm.agreement.advance;
                        vm.agreement.financeCostTotal = vm.rounding(remainingAmount * (vm.agreement.financeCostPercent / 100) * vm.agreement.period);
                        vm.agreement.emiCore = (vm.agreement.financeCostTotal + remainingAmount) / vm.agreement.period;
                        // Total EMIs
                        var totalEmis = installments.length;

                        // If advance exists → exclude first installment
                        if (vm.agreement.advance > 0 && totalEmis > 0) {
                            totalEmis = totalEmis - 1;
                        }
                        // Invoiced EMIs (already billed)
                        var invoicedEmis = installments
                            .filter(function (i, index) {

                                // Ignore first installment (index 0) if advance exists
                                if (vm.agreement.advance > 0 && index === 0) {
                                    return false;
                                }

                                return i.invoiceId && i.invoiceId > 0 && i.isPaid;
                            })
                            .length;
                        // Pending EMIs
                        var pendingEmis = totalEmis - invoicedEmis;
                        // ===============================
                        // VEHICLE PRINCIPAL (NEW FLOW)
                        // ===============================

                        var unpaidInstallments = installments.filter(function (i, index) {

                            // Ignore first installment if advance exists
                            if (vm.agreement.advance > 0 && index === 0) {
                                return false;
                            }

                            return !i.isPaid;
                        });

                        // Vehicle Principal From Unpaid Installments
                        vm.vehiclePrinciple = unpaidInstallments.reduce(function (sum, inst) {

                            return sum + (inst.emiCoreValue || 0);

                        }, 0);

                        // Remove tax if inclusive
                        vm.vehiclePrinciple = vm.rounding(
                            vm.excludeTax(vm.vehiclePrinciple)
                        );

                        // Vehicle Principal Tax
                        vm.vehiclePrincipleTax = vm.rounding(
                            vm.vehiclePrinciple * ((vm.taxPercent || 0) / 100)
                        );

                        // ===============================
                        // VEHICLE PRINCIPAL
                        // ===============================

                        // Vehicle Amount (Sales Price)
                        var vehicleAmount = vm.agreement.agreementVehicles[0].price || 0;
                        vm.salesPrice = vehicleAmount;
                        //// Per EMI
                        //var vehiclePerEmi = remainingAmount / totalEmis;

                        //// Principal
                        //vm.vehiclePrinciple = vm.rounding(vehiclePerEmi * pendingEmis);
                        //vm.vehiclePrinciple = vm.rounding(vm.excludeTax(vm.vehiclePrinciple));


                        // ===============================
                        // VEHICLE FINANCE
                        // ===============================

                        // Total Finance Cost
                        var totalVehicleFinance = vm.agreement.financeCostTotal || 0;

                        // Per EMI Finance
                        var vehicleFinancePerEmi = totalVehicleFinance / totalEmis;

                        // Finance Amount
                        vm.vehicleFinance = vm.rounding(vehicleFinancePerEmi * pendingEmis);
                        vm.vehicleFinance = vm.rounding(vm.excludeTax(vm.vehicleFinance));

                        // ===============================
                        // OTHER CHARGES PRINCIPAL
                        // ===============================

                        var otherCharges = vm.agreement.charges.filter(c =>
                            c.chargesTypeId != 78 &&
                            c.chargesTypeId != 79 &&
                            c.isAddInEMI === true
                        );

                        // Total Other Charges
                        var otherChargesTotal = otherCharges.reduce((sum, c) => sum + (c.charges + c.tax || 0), 0);

                        // Max 12 EMI rule
                        var otherChargesEmiCount = Math.min(12, totalEmis);

                        // Invoiced (only first 12 EMIs)
                        var invoicedOtherEmis = Math.min(invoicedEmis, 12);

                        // Pending
                        var pendingOtherEmis = otherChargesEmiCount - invoicedOtherEmis;

                        // Per EMI
                        var otherPerEmi = otherChargesTotal / otherChargesEmiCount;

                        // Principal
                        vm.otherChargesPrinciple = vm.rounding(otherPerEmi * pendingOtherEmis);
                        vm.otherChargesPrinciple = vm.rounding(vm.excludeTax(vm.otherChargesPrinciple));

                        // ===============================
                        // OTHER CHARGES FINANCE
                        // ===============================

                        // Total Other Finance
                        var otherFinanceTotal = otherCharges.reduce((sum, c) => sum + (c.financeCost + c.financeCostTax || 0), 0);

                        // Per EMI Finance
                        var otherFinancePerEmi = otherFinanceTotal / otherChargesEmiCount;

                        // Finance Amount
                        vm.otherChargesFinance = vm.rounding(otherFinancePerEmi * pendingOtherEmis);
                        vm.otherChargesFinance = vm.rounding(vm.excludeTax(vm.otherChargesFinance));

                        // ===============================
                        // TOTAL / PAID / REMAINING FIXED
                        // ===============================


                        vm.financeCharges = vm.getOtherChargesEMI();
                        // Total Installments Amount
                        var totalInstallmentsAmount = actualInstallments.reduce(function (sum, inst) {
                            return sum + (inst.amount || 0);
                        }, 0);
                        vm.totalAmountOfInstallments = vm.rounding(totalInstallmentsAmount) + vm.agreement.chargesUpfront;
                        // Total unpaid installments amount only
                        vm.totalUnpaidAmountOfInstallments = actualInstallments
                            .filter(function (inst) {
                                return !inst.isPaid;
                            })
                            .reduce(function (sum, inst) {
                                return sum + (inst.amount || 0);
                            }, 0);
                        if (vm.agreement.advance > 0 && actualInstallments.length > 0) {

                            var firstInstallment = actualInstallments[0];

                            if (firstInstallment && !firstInstallment.isPaid) {
                                vm.totalUnpaidAmountOfInstallments +=
                                    (vm.agreement.chargesUpfront || 0);
                            }
                        }

                        vm.totalUnpaidAmountOfInstallments =
                            vm.rounding(vm.totalUnpaidAmountOfInstallments);
                        // Check first installment paid (Downpayment)
                        var firstInstallmentPaid = false;

                        if (vm.agreement.advance > 0 && installments.length > 0) {
                            var firstInstallment = installments[0];
                            firstInstallmentPaid = firstInstallment && firstInstallment.isPaid;
                        }

                        // ✅ TOTAL AMOUNT
                        vm.totalInstallments = totalInstallmentsAmount;

                        if (firstInstallmentPaid) {
                            vm.totalInstallments += (vm.agreement.chargesUpfront || 0);
                        }


                        // ===============================
                        // ALREADY PAID
                        // ===============================

                        vm.totalPaid = installments.reduce(function (sum, inst) {
                            return sum + (inst.isPaid ? (inst.amount || 0) : 0);
                        }, 0);

                        // Add upfront ONLY if first installment paid
                        if (firstInstallmentPaid) {
                            vm.totalPaid += (vm.agreement.chargesUpfront || 0);
                        }


                        // ===============================
                        // REMAINING AMOUNT
                        // ===============================

                        vm.remaining = vm.totalAmountOfInstallments - vm.totalPaid;
                        //new code end 

                        //// exclude downpayment if advance exists
                        var filteredInstallments = installments;

                        if (vm.agreement.advance > 0 && installments.length > 0) {
                            filteredInstallments = installments.slice(1);
                        }

                        vm.installmentCount = filteredInstallments.length;
                        //vm.installmentSettledCount = settlementInstallments.length;

                        vm.paidInstallments = filteredInstallments.filter(function (i) {
                            return i.isPaid === true;
                        }).length;
                        vm.unInvoicedInstallmentsCount = filteredInstallments.filter(function (i) {
                            return i.invoiceId == null;
                        }).length;
                        vm.unPaidInvoicedInstallmentsCount = filteredInstallments.filter(function (i) {
                            return i.invoiceId != null && i.isPaid === false;
                        }).length;
                        vm.remainingInstallments = filteredInstallments.filter(function (i) {
                            return i.isPaid === false;
                        }).length;
                        // ===============================
                        // TAX CALCULATIONS
                        // ===============================
                        if (vm.taxPercent > 0) {

                            var taxRate = vm.taxPercent / 100;

                            // Vehicle Principal Tax
                            vm.vehiclePrincipleTax = vm.rounding(vm.vehiclePrinciple * taxRate);

                            // Vehicle Finance Tax
                            vm.vehicleFinanceTax = vm.rounding(vm.vehicleFinance * taxRate);

                            // Other Charges Principal Tax
                            vm.otherChargesPrincipleTax = vm.rounding(vm.otherChargesPrinciple * taxRate);

                            // Other Charges Finance Tax
                            vm.otherChargesFinanceTax = vm.rounding(vm.otherChargesFinance * taxRate);
                        }

                        else {
                            // Vehicle Principal Tax
                            vm.vehiclePrincipleTax = 0;

                            // Vehicle Finance Tax
                            vm.vehicleFinanceTax = 0;

                            // Other Charges Principal Tax
                            vm.otherChargesPrincipleTax = 0;

                            // Other Charges Finance Tax
                            vm.otherChargesFinanceTax = 0;
                        }
                        vm.updateFinanceTax();
                        // Store initial calculated total (base for comparison)
                        vm.agreement.totalAmountEarlySettled = vm.settlementTotal;

                        calculateEarlySettlementAdjustment();
                    })
                    .finally(function () {
                        vm.loading = false;
                    });
            }

            init();

        }]);
