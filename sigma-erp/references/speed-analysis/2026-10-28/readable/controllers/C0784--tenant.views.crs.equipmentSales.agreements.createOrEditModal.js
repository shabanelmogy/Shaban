// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:203488-205893
appModule.controller('tenant.views.crs.equipmentSales.agreements.createOrEditModal', [
        '$scope', '$timeout', '$filter', 'utilities', '$uibModal', '$uibModalInstance', 'chargesCalculator', 'FileUploader',
        'agreementId', 'abp.services.app.accessory', 'abp.services.app.directory', 'chargesSettings', 'abp.services.app.equipmentSales', 'abp.services.app.salesAgreement', 'abp.services.app.agreementAdditionalCharges', 'quotationId', 'abp.services.app.quotationVehicleWise', 'abp.services.app.vehicleModel', 'abp.services.app.salesQuotation', 'abp.services.app.billingMethod', 'abp.services.app.chargesSetting', 'appSession',
        function ($scope, $timeout, $filter, utilities, $uibModal, $uibModalInstance, chargesCalculator, fileUploader, agreementId,
            accessoriesService, directoryService, chargesSettings, equipmentSalesService, salesAgreementService, agreementAdditionalChargesService, quotationId, quotationVehicleWise, vehicleModelService, salesQuotationService, billingMethodService, chargesSettingService, appSession) {

            var vm = this;
            vm.activeTab = 0;
            vm.billingDetails = null;
            vm.canChangeRates = abp.auth.hasPermission('Pages.Tenant.Agreements.Edit.CanChangeRates');
            vm.backdated = abp.auth.hasPermission('Pages.Tenant.SalesModule.SalesAgreement.BackDatedEntry');
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.isTaxOptional = utilities.parseBoolean(abp.setting.get("App.General.IsTaxOptional"));
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.manualAgreementNo = utilities.parseBoolean(abp.setting.get("App.General.ManualAgreementNo"));
            vm.enableManualAgreementNo = utilities.parseBoolean(abp.setting.get("App.General.EnableManualAgreementNo"));
            vm.isSalesPersonRequired = utilities.parseBoolean(abp.setting.get("App.General.IsSalesPersonRequired"));
            vm.isWeeklyMonthlyEnabled = utilities.parseBoolean(abp.setting.get("App.General.WeeklyMonthlyRental"));
            vm.enableAdditionalNotes = utilities.parseBoolean(abp.setting.get("App.General.EnableAdditionalNotes"));
            vm.isTaxCodeEnabled = abp.features.isEnabled("CRS.TaxCodes");
            vm.isSalesAgreementVehicleWiseEnabled = abp.features.isEnabled("CRS.SalesAgreementVehicleWise");
            vm.documentsForSalesAgreement = abp.features.isEnabled("CRS.CustomFeatures.DocumentsForSalesAgreement");
            vm.invoicePerInstallment = utilities.parseBoolean(abp.setting.get("App.Speed.Common.CreateInvoicePerInstallment"));
            vm.taxAccepted = false;
            vm.showAdvancePopupOnSave = false;
            vm.showDepositPopupOnSave = false;
            vm.saveAndPrint = false;
            vm.processingFeeCharges = 0;
            vm.processingFeeTax = 0;
            vm.loading = false;
            vm.tariffGroupId = null;
            vm.tariffGroup = null;
            vm.cheques = [];
            vm.periodCheck = 0;
            vm.downPaymentCheck = 0;
            vm.installments = [];
            vm.searchOtherGroupsVehicle = false;
            vm.chargesSettings = chargesSettings;
            vm.isUserWiseDiscountEnable = abp.features.isEnabled("CRS.UserWiseDiscount");
            vm.isAdvancePaymentRequired = utilities.parseBoolean(abp.setting.get("App.General.IsAdvancePaymentRequired"));
            vm.invoiceBasedOnAgreedRent = utilities.parseBoolean(abp.setting.get("App.General.InvoiceBasedOnAgreedRent"));
            vm.isDepositsEnable = abp.features.isEnabled("CRS.Vouchers.Deposits");
            vm.isReadOnlyAdvanceAmount = false;
            vm.vehicles = [];
            vm.customers = [];
            vm.documents = [];
            vm.drivers = [];
            vm.billingMethods = [];
            var isValid = true;
            vm.discountCodeId = null;
            var errorMessage = {};
            $timeout(function () {
                vm.activeTab = 0;
            });
            //var isTariffEnabled = abp.features.isEnabled("CRS.Tariff");
            vm.discountAuthCode = null;
            var agreementCategory = 9; //Accessories
            vm.isTotalDaysAndHrs = false;
            vm.disableTariffCard = false;
            vm.rounding = function (value) {
                if (!value) return 0;
                return Math.round(value * 100) / 100; // always two decimals
            };
            vm.agreementTypes = [
                { type: "Daily", id: 1 },
                { type: "Weekly", id: 2 },
                { type: "Monthly", id: 3 }
            ];

            var rateTypes = {
                perDay: { id: 1, name: '/Day' },
                perWeek: { id: 2, name: '/Week' },
                perMonth: { id: 3, name: '/Month' },
            };
            //commented by usmankhalid salesModule
            var SA = 'Pages.Tenant.SalesModule.SalesAgreement.';
            var SAV = 'Pages.Tenant.SalesModule.SalesAgreementVehicleWise.';

            function hasBoth(permission) {
                return abp.auth.hasPermission(SA + permission) ||
                    abp.auth.hasPermission(SAV + permission);
            }
            vm.permissions = {
                add: hasBoth('AgreementAdditionalCharges.Addnew'),
                edit: hasBoth('AgreementAdditionalCharges.Edit'),
                delete: hasBoth('AgreementAdditionalCharges.Delete')
            };

            //vm.permissions = {
            //    add: abp.auth.hasPermission('Pages.Tenant.SalesModule.SalesAgreement.AgreementAdditionalCharges.Addnew'),
            //    edit: abp.auth.hasPermission('Pages.Tenant.SalesModule.SalesAgreement.AgreementAdditionalCharges.Edit'),
            //    'delete': abp.auth.hasPermission('Pages.Tenant.SalesModule.SalesAgreement.AgreementAdditionalCharges.Delete'),
            //};


            //vm.tariffCards = [];
            //vm.tariffCard = null;
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


            vm.additionaldrivers = [];

            vm.rateTypes = [
                { id: 2, name: app.localize('/One Time') }
            ];

            vm.searchAdditionalDrivers = function ($select) {
                return directoryService.search({
                    keyword: $select.search,
                    contactCategory: 1,
                    contactType: 2
                }).then(function (response) {
                    vm.additionaldrivers = response.data.items;
                });
            };

            vm.addAdditionalChargeRow = function () {
                vm.agreement.additionalCharges.push({
                    chargesTypeId: null,
                    notes: null,
                    rateTypeId: null,
                    fromDate: null,
                    toDate: null,
                    rate: null,
                    charges: 0
                });
            };

            vm.removeAdditionalChargeRow = function (row) {
                var index = vm.agreement.dditionalCharges.indexOf(row);
                vm.agreement.dditionalCharges.splice(index, 1);
            };

            vm.calculateAdditionalCharges = function (row) {

                if (row.rateTypeId == 1) { // Per Day
                    if (row.fromDate && row.toDate) {

                        var start = moment.utc(row.fromDate).startOf('day');
                        var end = moment.utc(row.toDate).startOf('day');

                        var days = end.diff(start, 'days') + 1;

                        row.charges = days > 0 ? days * row.rate : 0;
                    }
                }
                else if (row.rateTypeId == 2) { // One Time
                    row.charges = row.rate;
                }
                else {
                    row.charges = 0;
                }
            };
            // new code 
            vm.priceChanged = function (row) {
                if (vm.isSalesAgreementVehicleWiseEnabled) {

                    row.price = vm.rounding(parseFloat(row.price) || 0);

                    vm.agreement.charges[0].charges = vm.agreement.agreementVehicles.reduce(
                        (sum, vehicle) => sum + (vehicle.price > 0 ? vm.rounding(vehicle.price) : 0),
                        0
                    );

                    let totalChargesList = vm.agreement.charges.filter(e => e.chargesTypeId === 78).reduce(
                        (sum, item) => sum + (item.charges || 0),
                        0
                    );

                    if ((vm.taxAccepted)) {
                        vm.agreement.tax = vm.rounding(
                            (totalChargesList * vm.agreement.taxPercent) / 100
                        );
                    }
                    vm.agreement.amount = vm.rounding(
                        totalChargesList + vm.agreement.tax
                    );

                    if (vm.agreement.period > 0) {
                        vm.perInstallmentChanged();
                        vm.calculateEachInstallment();
                    }
                    vm.downPaymentChanged();
                }
                else {
                    row.price = vm.rounding(parseFloat(row.price) || 0);

                    vm.agreement.charges[0].charges = vm.agreement.agreementVehicles.reduce(
                        (sum, vehicle) => sum + (vehicle.price > 0 ? vm.rounding(vehicle.price) : 0),
                        0
                    );

                    let totalChargesList = vm.agreement.charges.reduce(
                        (sum, item) => sum + (item.charges || 0),
                        0
                    );

                    totalChargesList -= (vm.agreement.discount > 0 ? vm.agreement.discount : 0);

                    if (!(vm.agreement.quotationId > 0)) {
                        vm.agreement.tax = vm.rounding(
                            (totalChargesList * vm.agreement.taxPercent) / 100
                        );
                        vm.agreement.totalCharges = vm.rounding(
                            totalChargesList + vm.agreement.tax
                        );
                    }

                    if (vm.agreement.period > 0) {
                        vm.onNumOfInstallmentsChange();
                        vm.calculateEachInstallment();
                    }
                }
            };

            vm.taxAcceptedChanged = function () {
                if (vm.taxAccepted)
                    vm.agreement.taxPercent = vm.taxPercent;
                else
                    vm.agreement.taxPercent = 0;
                if (vm.isSalesAgreementVehicleWiseEnabled) {

                    vm.updateCharges();
                    vm.perInstallmentChanged();
                    vm.downPaymentChanged();
                    vm.onEmiFlagChanged();
                }

            };

            vm.roundingWithSeparator = function (value) {
                if (value == null) return null;

                // Round to 2 decimals
                var roundedValue = utilities.round(value, 2);

                // Convert to string with thousand separators
                var parts = roundedValue.toString().split('.');

                // Add thousand separators to integer part
                parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

                // Only keep decimals if > 0
                if (parts[1] && parseInt(parts[1]) > 0) {
                    return parts.join('.');
                } else {
                    return parts[0];
                }
            };
            vm.onFincanceCostChanged = function () {
                vm.updateCharges();
                vm.downPaymentChanged();
                vm.onNumOfInstallmentsChange();
                //vm.perInstallmentChanged();
                //vm.recalculateOtherChargesEMI();
            };
            vm.recalculateOtherChargesEMI = function () {

                let percent = parseFloat(vm.agreement.financeCostPercent) || 0;

                // 🔒 Restrict to 12 installments maximum
                let installments = Math.min(
                    parseInt(vm.agreement.period) || 1,
                    12
                );

                if (installments <= 0) {
                    installments = 1;
                }

                angular.forEach(vm.agreement.charges, function (charge) {

                    if (charge.isAddInEMI) {

                        let amount = parseFloat(charge.charges) || 0;

                        charge.financeCost = vm.rounding(
                            amount * (percent / 100) * installments
                        );

                        charge.emi = vm.rounding(
                            (amount + charge.financeCost) / installments
                        );
                    }
                    else {
                        charge.financeCost = 0;
                        charge.emi = 0;
                    }

                });

                vm.getIncludedChargesTotal();
                vm.getOtherChargesEMI();
                vm.applyFinanceCostRules();
            };

            //vm.updateCharges = function () {
            //    vm.agreement.amount = 0;
            //    vm.agreement.tax = 0;
            //    vm.agreement.charges.forEach(function (c) {
            //        let chargeAmount = parseFloat(c.amount) || 0;
            //        if (c.chargesTypeId == 78) {
            //            vm.agreement.amount += chargeAmount;
            //            if (c.taxable && !isNaN(chargeAmount)) {
            //                let taxAmount = (chargeAmount * vm.agreement.taxPercent) / 100;
            //                vm.agreement.tax += taxAmount;
            //            }
            //        }
            //        else if (c.chargesTypeId == 79 && c.taxable && !isNaN(chargeAmount)) {
            //            c.tax = (chargeAmount * vm.agreement.taxPercent) / 100;
            //        }
            //    });
            //    vm.processingFeeCharges =
            //        (vm.agreement.charges.filter(e => e.chargesTypeId === 79)[0] || {}).amount || 0;

            //    vm.agreement.amount += vm.agreement.tax;
            //    if (vm.agreement.amount < 0) {
            //        vm.agreement.amount = 0;
            //    }
            //    vm.agreement.amount -= (vm.agreement.discount > 0 ? vm.agreement.discount : 0);

            //    var perInstallmentAmount = utilities.round(parseFloat(vm.agreement.totalCharges - vm.agreement.advance) / parseFloat(vm.agreement.period));
            //    vm.agreement.perInstallmentAmount = perInstallmentAmount;
            //    for (let i = 0; i < vm.agreement.quotationPaymentInstallments.length; i++) {
            //        if (vm.agreement.advance > 0) {

            //            vm.agreement.quotationPaymentInstallments[i + 1].amount = vm.agreement.perInstallmentAmount;  // Set the same value for 'amount' property
            //        }
            //        else {
            //            vm.agreement.quotationPaymentInstallments[i].amount = vm.agreement.perInstallmentAmount;  // Set the same value for 'amount' property

            //        }
            //    }
            //};

            vm.downPaymentChanged = function () {

                let excludedTotal = vm.getExcludedChargesTotal();
                let downPayment = parseFloat(vm.agreement.downPayment) || 0;

                //if (excludedTotal > downPayment) {
                //    abp.message.error(
                //        'Down Payment should be greater than or equal to excluded charges'
                //    );
                //    return;
                //}

                // existing logic
                vm.agreement.remainingAmount =
                    vm.agreement.amount - downPayment;

                vm.perInstallmentChanged();
                vm.recalculateOtherChargesEMI();
            };
            vm.recalculateAmount = function (row) {

                let core = parseFloat(row.emiCoreValue) || 0;
                let finance = parseFloat(row.emiFinanceCost) || 0;
                let cost = parseFloat(row.financeCost) || 0;

                row.amount = vm.rounding(core + finance + cost);
            };
            vm.onEmiFlagChanged = function (charge) {

                if (!charge) {
                    if (vm.agreement && vm.agreement.charges) {
                        vm.agreement.charges.forEach(function (c) {
                            vm.onEmiFlagChanged(c);
                        });
                    }

                    vm.getIncludedChargesTotal();
                    vm.getOtherChargesEMI();
                    vm.applyFinanceCostRules();
                    vm.getExcludedChargesTotal();
                    vm.onNumOfInstallmentsChange();
                    return;
                }

                if (charge && charge.isAddInEMI === true) {
                    let amount = parseFloat(charge.charges) || 0;

                    let percent = parseFloat(vm.agreement.financeCostPercent) || 0;

                    let installments = Math.min(
                        parseInt(vm.agreement.period) || 1,
                        12
                    );

                    charge.financeCost = vm.rounding(
                        amount * (percent / 100) * installments
                    );
                    charge.emi = vm.rounding((amount + charge.financeCost) / installments);
                    charge.emi = vm.rounding(charge.emi);
                    if (vm.agreement.taxPercent > 0) {

                        charge.financeCostTax = vm.rounding(charge.financeCost * (vm.agreement.taxPercent / 100));
                        charge.financeCostTax = vm.rounding(charge.financeCostTax);
                        charge.emiTax = vm.rounding(charge.emi * (vm.agreement.taxPercent / 100));
                        charge.emiTax = vm.rounding(charge.emiTax);
                    }
                    else {
                        charge.tax = 0;
                        charge.financeCostTax = 0;
                        charge.emiTax = 0;
                    }
                    charge.financeCostWithTax = vm.rounding(charge.financeCost + charge.financeCostTax);
                    charge.tax = vm.rounding(charge.tax);
                    charge.emiTax = vm.rounding(charge.emiTax);
                    charge.emiWithTax = charge.emi + charge.emiTax;
                    charge.emiWithTax = vm.rounding(charge.emiWithTax);
                }
                else if (charge && charge.isAddInEMI !== true) {
                    if (vm.agreement.taxPercent > 0) {
                        let amount = parseFloat(charge.charges) || 0;
                        charge.financeCost = 0;
                        charge.financeCostTax = 0;
                        charge.emi = 0;
                        charge.emiTax = 0;
                        //charge.tax = 0;
                    }
                    else {

                        charge.financeCost = 0;
                        charge.financeCostTax = 0;
                        charge.emi = 0;
                        charge.emiTax = 0;
                        charge.tax = 0;
                    }
                }

                vm.getIncludedChargesTotal();
                vm.getOtherChargesEMI();
                vm.applyFinanceCostRules();
                vm.onNumOfInstallmentsChange();
            };
            vm.perInstallmentChanged = function () {

                if (!vm.agreement.period || vm.agreement.period == 0) {
                    vm.agreement.emiCore = 0;
                    return;
                }

                var totalCharges = parseFloat(vm.agreement.totalCharges) || 0;
                var advance = parseFloat(vm.agreement.advance) || 0;
                var period = parseInt(vm.agreement.period) || 1;
                var taxPercent = parseFloat(vm.agreement.taxPercent) || 0;
                var financePercent = parseFloat(vm.agreement.financeCostPercent) || 0;

                var remainingAmount = totalCharges - advance;

                if (vm.isSalesAgreementVehicleWiseEnabled) {

                    var remainingAmountWithoutTax = remainingAmount / (1 + taxPercent / 100);

                    vm.agreement.financeCostTotal =
                        vm.rounding(remainingAmountWithoutTax * (financePercent / 100) * period);

                    vm.agreement.financeCostTotalTax =
                        vm.rounding(vm.agreement.financeCostTotal * (taxPercent / 100));

                    vm.agreement.financeCostTotalWithTax =
                        vm.rounding(vm.agreement.financeCostTotal + vm.agreement.financeCostTotalTax);

                    vm.agreement.emiCore =
                        vm.rounding((vm.agreement.financeCostTotalWithTax + remainingAmount) / period);
                }
                else {

                    vm.agreement.financeCostTotal =
                        vm.rounding(remainingAmount * (financePercent / 100) * period);

                    vm.agreement.emiCore =
                        vm.rounding((vm.agreement.financeCostTotal + remainingAmount) / period);
                }

                vm.recalculateOtherChargesEMI();
                if (vm.agreement.period > 0) {
                    vm.agreement.emiFinanceCostSale = vm.rounding((vm.agreement.financeCostTotal + vm.agreement.financeCostTotalTax) / vm.agreement.period);
                }
            };
            vm.costPriceOrMarginChanged2 = function (row) {
                if (row.amount) {
                    row.amount = vm.rounding(row.amount);
                }

                vm.priceChanged(row);
            };

            vm.downPaymentOrInstallmentsChanged = function () {
                let remainingAmount = vm.agreement.amount - (parseFloat(vm.agreement.downPayment) || 0);
                vm.agreement.remainingAmount = vm.rounding(remainingAmount);

                let noOfInstallments = parseFloat(vm.agreement.period) || 0;
                vm.agreement.perInstallmentAmount = noOfInstallments > 0
                    ? vm.rounding(remainingAmount / noOfInstallments)
                    : 0;
            };

            // When sale price changes
            vm.onSalePriceChanged = function (row) {
                let quantity = parseFloat(row.quantity) || 0;
                let price = parseFloat(row.price) || 0;
                row.amount = vm.rounding(quantity * price);

                // Recalculate all totals
                vm.updateTotalWithTax();
            };
            vm.getExcludedChargesTotal = function () {
                if (!vm.agreement || !vm.agreement.charges) {
                    vm.agreement.chargesUpfront = 0;
                    return 0;
                }

                var isTaxApplicable = vm.agreement.taxPercent > 0;

                vm.agreement.charges.forEach(function (c) {
                    if (c.isAddInEMI === undefined) {
                        c.isAddInEMI = false;
                    }

                    // ✅ Reset tax if not applicable
                    if (!isTaxApplicable) {
                        c.tax = 0;
                    }
                });

                var excludedTotal = vm.agreement.charges
                    .filter(function (c) {
                        return !c.applyOnClosing &&
                            c.chargesTypeId != 78 &&
                            c.chargesTypeId != 79 &&
                            c.charges > 0 &&
                            c.isAddInEMI === false;
                    })
                    .reduce(function (sum, c) {
                        var tax = isTaxApplicable ? (c.tax || 0) : 0;
                        return sum + (c.charges || 0) + tax;
                    }, 0);

                vm.agreement.chargesUpfront = excludedTotal;

                return excludedTotal;
            };
            vm.getIncludedChargesTotal = function () {
                if (!vm.agreement || !vm.agreement.charges) {
                    vm.agreement.chargesFinanceCost = 0;
                    return 0;
                }

                var isTaxApplicable = vm.agreement.taxPercent > 0;

                vm.agreement.charges.forEach(function (c) {
                    if (!isTaxApplicable) {
                        c.financeCostTax = 0;
                    }
                });

                var includedTotal = vm.agreement.charges
                    .filter(function (c) {
                        return !c.applyOnClosing &&
                            c.chargesTypeId != 78 &&
                            c.chargesTypeId != 79 &&
                            c.financeCost > 0 &&
                            c.isAddInEMI === true;
                    })
                    .reduce(function (sum, c) {
                        var tax = isTaxApplicable ? (c.financeCostTax || 0) : 0;
                        return sum + (c.financeCost || 0) + tax;
                    }, 0);

                vm.agreement.chargesFinanceCost = includedTotal;

                return includedTotal;
            };
            vm.getOtherChargesEMI = function () {
                if (!vm.agreement || !vm.agreement.charges) {
                    vm.agreement.otherChargesEMI = 0;
                    return 0;
                }

                var isTaxApplicable = vm.agreement.taxPercent > 0;

                vm.agreement.charges.forEach(function (c) {
                    if (!isTaxApplicable) {
                        c.emiTax = 0;
                    }
                });

                var total = vm.agreement.charges
                    .filter(c =>
                        !c.applyOnClosing &&
                        c.chargesTypeId != 78 &&
                        c.chargesTypeId != 79 &&
                        c.isAddInEMI === true
                    )
                    .reduce((sum, c) => {
                        var tax = isTaxApplicable ? (parseFloat(c.emiTax) || 0) : 0;
                        return sum + (parseFloat(c.emi) || 0) + tax;
                    }, 0);

                vm.agreement.otherChargesEMI = vm.rounding(total);

                vm.agreement.perInstallmentAmount =
                    vm.rounding((vm.agreement.emiCore || 0) + vm.agreement.otherChargesEMI);

                return vm.agreement.otherChargesEMI;
            };
            vm.applyFinanceCostRules = function () {

                if (!vm.agreement || !vm.agreement.agreementPaymentInstallments) return;

                let period = vm.agreement.period || 1;

                //let perInstallmentFinance = totalFinance / period;

                vm.agreement.agreementPaymentInstallments.forEach((x, index) => {

                    let isAdvanceRow =
                        vm.agreement.advance > 0 && index === 0;

                    if (isAdvanceRow) {
                        x.financeCost = 0;
                        return;
                    }

                    let installmentIndex =
                        vm.agreement.advance > 0
                            ? index - 1
                            : index;

                    if (installmentIndex >= 0 && installmentIndex < 12) {
                        x.financeCost =
                            vm.rounding(vm.agreement.otherChargesEMI || 0);
                    } else {
                        x.financeCost = 0;
                    }
                });
            };


            // end of new code 


            vm.removeDocument = function (obj) {
                var index = vm.documents.indexOf(obj);
                vm.documents.splice(index, 1);
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

            vm.getInstallmentIndex = function (index) {
                // If there's a down payment, subtract 1 from index
                return vm.agreement.advance > 0 ? index : index + 1;
            };

            vm.getOriginalName = function (doc) {
                var originalName = doc.name.replace("_" + doc.guid, "");
                return originalName;
            };

            vm.uploadDocument = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/equipmentSales/agreements/uploadDocumentsModal.cshtml',
                    controller: 'tenant.views.crs.equipmentSales.agreements.uploadDocumentsModal as vm',
                    backdrop: 'static'

                });
                modalInstance.result.then(function (result) {
                    vm.documents.push(result);
                });
            };

            vm.localize = function (input) {
                return app.localize(input);
            };

            vm.removeRow = function (row) {
                var index = vm.agreement.agreementVehicles.indexOf(row);
                vm.agreement.agreementVehicles.splice(index, 1);
            };

            vm.addChargesRow = function () {
                vm.agreement.additionalCharges.push({
                    chargesTypeId: null,
                    notes: null,
                    rateTypeId: null,
                    date: moment(),
                    fromDate: null,
                    toDate: null,
                    rate: null,
                });
            };

            vm.removeChargesRow = function (row) {
                var index = vm.agreement.additionalCharges.indexOf(row);
                vm.agreement.additionalCharges.splice(index, 1);
            };

            vm.addRow = function () {
                vm.agreement.agreementVehicles.push(agreementVehiclesList());
            };
            vm.addQuotationRow = function (quotationdata) {
                quotationdata.quotationLines.forEach(function (line) {
                    if (line.quantity && line.quantity > 0) {
                        var rowsToAdd = line.quantity;
                        for (var i = 0; i < rowsToAdd; i++) {
                            var newRow = agreementVehiclesList();
                            //newRow.price = line.quantity;
                            if (vm.invoicePerInstallment) {
                                newRow.costPrice = line.vehiclePrice;
                                newRow.marginPercent = line.marginPercent;

                                newRow.costPrice = vm.rounding(parseFloat(newRow.costPrice) || 0);
                                newRow.marginPercent = vm.rounding(parseFloat(newRow.marginPercent) || 0);

                                if (newRow.costPrice) {
                                    newRow.price = vm.rounding(
                                        newRow.costPrice * (1 + newRow.marginPercent / 100)
                                    );
                                } else {
                                    newRow.price = 0;
                                }

                            }
                            else {
                                newRow.price = line.vehiclePrice;

                            }
                            // Fetch make name once for this line
                            vm.getVehicleMakeName(line.vehicleModel).then(function (fullName) {
                                newRow.modalAndMake = fullName;

                                // Copy row and push to list
                                var rowCopy = angular.copy(newRow);
                                vm.agreement.agreementVehicles.push(rowCopy);
                                vm.priceChanged(rowCopy);
                            });
                            //newRow.modalAndMake = line.vehicleModel.make.name + " " + line.vehicleModel.name;
                            //newRow.vehicleModelId = line.vehicleModelId;
                            //vm.agreement.agreementVehicles.push(newRow);
                            //vm.priceChanged(newRow);

                        }
                    }

                });
            };
            vm.addQuotationRowAp = function (quotationdata) {
                quotationdata.quotationLines.forEach(function (line) {

                    if (!line.quantity || line.quantity <= 0) return;

                    var newRow = agreementVehiclesList();

                    // Price calculation
                    if (vm.invoicePerInstallment) {
                        newRow.costPrice = vm.rounding(parseFloat(line.vehiclePrice) || 0);
                        newRow.marginPercent = vm.rounding(parseFloat(line.marginPercent) || 0);
                        newRow.price = newRow.costPrice
                            ? vm.rounding(newRow.costPrice * (1 + newRow.marginPercent / 100))
                            : 0;
                    } else {
                        newRow.price = line.vehiclePrice;
                    }

                    newRow.vehicleModelId = line.vehicleModelId;

                    // Fetch make name once for this line
                    vm.getVehicleMakeName(line.vehicleModel).then(function (fullName) {
                        newRow.modalAndMake = fullName;

                        // Copy row and push to list
                        var rowCopy = angular.copy(newRow);
                        vm.agreement.agreementVehicles.push(rowCopy);
                        vm.priceChanged(rowCopy);
                    });

                });
            };
            vm.getVehicleMakeName = function (vehicleModel) {
                // Returns a promise
                return vehicleModelService.getVehicleModels({
                    name: vehicleModel.name,
                    makeId: vehicleModel.makeId
                }).then(function (response) {
                    if (response.data.items && response.data.items.length > 0) {
                        var model = response.data.items[0];
                        return model.make + " " + model.name;
                    }
                    return vehicleModel.name; // fallback if not found
                });
            };
            vm.removeChequeRow = function (obj) {
                var index = vm.agreement.agreementPaymentInstallments.indexOf(obj);
                vm.agreement.agreementPaymentInstallments.splice(index, 1);
            };

            function agreementVehiclesList() {

                var agreementVehicles = new Object();
                agreementVehicles.modalAndMake = null;
                agreementVehicles.modelYear = null;
                agreementVehicles.chassisNo = null;
                agreementVehicles.price = 0;
                agreementVehicles.id = null;
                agreementVehicles.vehicleId = null;
                return agreementVehicles;
            }

            function openApplyDiscountModal(chargesRow) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/discountCodes/applyDiscountModal.cshtml',
                    controller: 'tenant.views.crs.discountCodes.applyDiscountModal as vm',
                    backdrop: 'static',
                    resolve: {
                        options: function () {
                            return {
                                chargesRow: chargesRow,
                                discountAuthCode: vm.discountAuthCode
                            };
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.discountAuthCode = result.discountAuthCode;
                    chargesRow.discountPercent = result.chargesRow.discountPercent;
                    chargesRow.discountedRate = result.chargesRow.discountedRate;
                    chargesRow.rate = chargesRow.discountedRate > chargesRow.rate ? chargesRow.discountedRate : chargesRow.rate;
                });
            }

            vm.applyDiscount = function (chargesRow) {

                openApplyDiscountModal(chargesRow);
            };

            vm.calculateCharges = function (row) {
                //if (row.rateTypeId == 1) {
                //    if (row.toDate != null) {
                //        var start = moment.utc(row.fromDate).startOf('day'); //todays date
                //        var end = moment.utc(row.toDate).startOf('day'); // another date
                //        var days = end.diff(start, 'days') + 1;
                //        row.charges = days > 0 ? days * row.rate : 0;
                //    }
                //}
                if (row.rateTypeId == 2) {
                    row.charges = row.rate;
                }

                else {
                    row.charges = 0;
                }
            };

            vm.validateBaseAmount = function (amount) {
                if (amount == null || amount === undefined) return false;
                return parseFloat(amount) > 0;
            };
            vm.setOldValues = function (row) {
                row.__oldEmiCoreValue = row.emiCoreValue;
                row.__oldEmiFinanceCost = row.emiFinanceCost;
            };
            vm.onEmiValuesChange = function (row) {

                //if (!row.emiCoreValue || row.emiCoreValue <= 0) {
                //    abp.message.error("EMI Core Value must be greater than 0");
                //    row.emiCoreValue = row.__oldEmiCoreValue || 1;
                //    return;
                //}
                //if (!row.emiFinanceCost || row.emiFinanceCost <= 0) {
                //    abp.message.error("EMI Finance Cost must be greater than 0");
                //    row.emiFinanceCost = row.__emiFinanceCost || 1;
                //    return;
                //}

                vm.redistributeField(row, 'emiCoreValue', row.__oldEmiCoreValue);
                vm.redistributeField(row, 'emiFinanceCost', row.__oldEmiFinanceCost);

                // update old values after change
                row.__oldEmiCoreValue = row.emiCoreValue;
                row.__oldEmiFinanceCost = row.emiFinanceCost;
            };

            vm.redistributeField = function (baseRow, fieldName, oldValue) {

                var newValue = baseRow[fieldName];

                if (oldValue == null || newValue == null) return;

                var diff = newValue - oldValue;

                if (diff === 0) return;

                var unpaid = vm.agreement.agreementPaymentInstallments
                    .filter((x, index) => {

                        // ❌ skip down payment
                        if (vm.agreement.advance > 0 && index === 0) return false;

                        // ❌ skip invoiced + base row
                        return !x.invoiceId && x !== baseRow;
                    });

                if (!unpaid.length) return;

                var perRowAdjustment = diff / unpaid.length;

                unpaid.forEach(x => {

                    var updated = x[fieldName] - perRowAdjustment;

                    // rules:
                    if (fieldName === 'emiCoreValue') {
                        x[fieldName] = Math.max(1, updated);
                    } else {
                        x[fieldName] = Math.max(0, updated);
                    }
                    vm.recalculateAmount(x);
                });
                vm.recalculateAmount(baseRow);
            };
            vm.syncEmiToOtherRows = function (baseRow) {

                var unpaid = vm.agreement.agreementPaymentInstallments
                    .filter(x => !x.invoiceId && x !== baseRow);

                if (!unpaid.length) return;

                var emiCore = baseRow.emiCoreValue;
                var emiFinance = baseRow.emiFinanceCost;

                unpaid.forEach(x => {

                    x.emiCoreValue = emiCore;
                    x.emiFinanceCost = emiFinance;
                });
            };

            vm.getBaseEditableRowIndex = function () {

                if (!vm.agreement || !vm.agreement.agreementPaymentInstallments) return -1;

                for (let i = 0; i < vm.agreement.agreementPaymentInstallments.length; i++) {

                    // skip down payment (first row)
                    if (vm.agreement.advance > 0 && i === 0) continue;

                    if (!vm.agreement.agreementPaymentInstallments[i].invoiceId) {
                        return i;
                    }
                }

                return -1;
            };
            vm.updateChequeRows = function () {
                if (vm.agreement.advance > 0) {
                    if (vm.agreement.agreementPaymentInstallments.length > 0) {
                        if (vm.agreement.agreementPaymentInstallments.length === vm.agreement.period) {
                            var downPayment = {
                                amount: vm.isSalesAgreementVehicleWiseEnabled
                                    ? (parseFloat(vm.agreement.advance) || 0) + (vm.agreement.chargesUpfront || 0)
                                    : vm.agreement.advance,
                                installmentDate: new Date(),
                            };
                            vm.agreement.agreementPaymentInstallments.unshift(downPayment);
                            var perInstallmentAmount = utilities.round(parseFloat(vm.agreement.totalCharges - vm.agreement.advance) / parseFloat(vm.agreement.period));
                            vm.agreement.perInstallmentAmount = perInstallmentAmount;
                            for (let i = 0; i < vm.agreement.agreementPaymentInstallments.length; i++) {
                                if (vm.isSalesAgreementVehicleWiseEnabled) {

                                    let emiCoreValue = vm.agreement.remainingAmount / vm.agreement.period;

                                    let paymentPlanFinanceCost =
                                        (vm.agreement.financeCostTotal || 0) +
                                        (vm.agreement.financeCostTotalTax || 0);

                                    let emiFinanceCost = paymentPlanFinanceCost / vm.agreement.period;

                                    let index = i + 1;
                                    let effectiveIndex = vm.agreement.advance > 0 ? index - 1 : index;

                                    let row = vm.agreement.agreementPaymentInstallments[index];

                                    if (row) {

                                        row.amount = vm.agreement.perInstallmentAmount;

                                        row.emiCoreValue = emiCoreValue;
                                        row.emiFinanceCost = emiFinanceCost;

                                        // ✅ financeCost rule (12 installments only)
                                        if (effectiveIndex >= 0 && effectiveIndex < 12) {
                                            row.financeCost = vm.agreement.otherChargesEMI || 0;
                                        } else {
                                            row.financeCost = 0;
                                        }
                                    }
                                }
                                else {

                                    vm.agreement.agreementPaymentInstallments[i + 1].amount = vm.agreement.perInstallmentAmount;  // Set the same value for 'amount' property
                                }

                            }
                        }
                        else {
                            vm.agreement.agreementPaymentInstallments.shift();
                            var downPayment = {
                                amount: vm.isSalesAgreementVehicleWiseEnabled
                                    ? (parseFloat(vm.agreement.advance) || 0) + (vm.agreement.chargesUpfront || 0)
                                    : vm.agreement.advance,
                                installmentDate: new Date(),
                            };
                            vm.agreement.agreementPaymentInstallments.unshift(downPayment);
                            var perInstallmentAmount = utilities.round(parseFloat(vm.agreement.totalCharges - vm.agreement.advance) / parseFloat(vm.agreement.period));
                            vm.agreement.perInstallmentAmount = perInstallmentAmount;
                            for (let i = 0; i < vm.agreement.agreementPaymentInstallments.length; i++) {
                                if (vm.isSalesAgreementVehicleWiseEnabled) {

                                    let emiCoreValue = vm.agreement.remainingAmount / vm.agreement.period;

                                    let paymentPlanFinanceCost =
                                        (vm.agreement.financeCostTotal || 0) +
                                        (vm.agreement.financeCostTotalTax || 0);

                                    let emiFinanceCost = paymentPlanFinanceCost / vm.agreement.period;

                                    let index = i + 1;
                                    let effectiveIndex = vm.agreement.advance > 0 ? index - 1 : index;

                                    let row = vm.agreement.agreementPaymentInstallments[index];

                                    if (row) {

                                        row.amount = vm.agreement.perInstallmentAmount;

                                        row.emiCoreValue = emiCoreValue;
                                        row.emiFinanceCost = emiFinanceCost;

                                        // ✅ financeCost rule (12 installments only)
                                        if (effectiveIndex >= 0 && effectiveIndex < 12) {
                                            row.financeCost = vm.agreement.otherChargesEMI || 0;
                                        } else {
                                            row.financeCost = 0;
                                        }
                                    }
                                }
                                else {
                                    vm.agreement.agreementPaymentInstallments[i + 1].amount = vm.agreement.perInstallmentAmount;  // Set the same value for 'amount' property

                                }
                            }
                        }


                    }
                    else {

                        vm.agreement.agreementPaymentInstallments.push({
                            installmentNo: null,
                            installmentDate: vm.agreement.startDate,
                            bankName: null,
                            amount: vm.isSalesAgreementVehicleWiseEnabled
                                ? (parseFloat(vm.agreement.advance) || 0) + (vm.agreement.chargesUpfront || 0)
                                : vm.agreement.advance,
                        });
                    }
                }
                else {
                    if (vm.agreement.agreementPaymentInstallments.length > 0) {
                        if (vm.agreement.period != vm.agreement.agreementPaymentInstallments.length)
                            vm.agreement.agreementPaymentInstallments.shift();
                        var perInstallmentAmount = utilities.round(parseFloat(vm.agreement.totalCharges - vm.agreement.advance) / parseFloat(vm.agreement.period));
                        vm.agreement.perInstallmentAmount = perInstallmentAmount;
                        for (let i = 0; i < vm.agreement.agreementPaymentInstallments.length; i++) {
                            vm.agreement.agreementPaymentInstallments[i].amount = vm.agreement.perInstallmentAmount;  // Set the same value for 'amount' property
                        }
                    }
                }
                //let excludedTotal = vm.getExcludedChargesTotal();
                //let downPayments = parseFloat(vm.agreement.advance) || 0;

                ////if (excludedTotal > downPayment) {
                ////    abp.message.error(
                ////        'Down Payment should be greater than or equal to excluded charges'
                ////    );
                ////    return;
                ////}

                //// existing logic
                //vm.agreement.remainingAmount =
                //    vm.agreement.amount - downPayments;
                if (vm.isSalesAgreementVehicleWiseEnabled) {

                    vm.perInstallmentChanged();
                    vm.recalculateOtherChargesEMI();
                }
            };

            vm.onBankNameChange = function (name) {
                vm.agreement.agreementPaymentInstallments.forEach(installment => {
                    if (installment.billingDetail && installment.billingDetail.billingMethod &&
                        installment.billingDetail.billingMethod.type == 4) {
                        installment.bankName = name;
                    }
                });
            }

            //vm.onChequeNoChange = function (name) {

            //    for (var i = 0; i < vm.agreement.agreementPaymentInstallments.length - 1; i++) {
            //        var installment = vm.agreement.agreementPaymentInstallments[i];

            //        // Only auto-increment chequeNo if type == 4
            //        if (installment.billingDetail &&
            //            installment.billingDetail.billingMethod &&
            //            installment.billingDetail.billingMethod.type == 4) {
            //            vm.agreement.agreementPaymentInstallments[i + 1].chequeNo = vm.agreement.agreementPaymentInstallments[i + 1].chequeNo || parseInt(vm.agreement.agreementPaymentInstallments[i].chequeNo) + 1;
            //        }
            //    }
            //};

            vm.onChequeNoChange = function (chequeNo, editedIndex) {

                var installments = vm.agreement.agreementPaymentInstallments;

                // Parse the chequeNo entered by user
                var lastChequeNo = parseInt(chequeNo);
                if (isNaN(lastChequeNo)) return; // user didn't enter a valid number

                // Start from the next installment after the one user edited
                for (var i = editedIndex + 1; i < installments.length; i++) {

                    var inst = installments[i];

                    // Only auto-fill type = 4 installments
                    if (inst.billingDetail &&
                        inst.billingDetail.billingMethod &&
                        inst.billingDetail.billingMethod.type == 4) {

                        // Only fill if empty
                        if (!inst.chequeNo) {
                            lastChequeNo++;
                            inst.chequeNo = lastChequeNo;
                        } else {
                            // Update lastChequeNo if user already entered a number
                            lastChequeNo = parseInt(inst.chequeNo);
                        }
                    }
                }
            };


            vm.onBillingMethodChange = function () {

                var installments = vm.agreement.agreementPaymentInstallments;

                for (var i = 1; i < installments.length; i++) {

                    var item = installments[i];

                    if (item.billingDetail &&
                        item.billingDetail.billingMethod &&
                        item.billingDetail.billingMethod.id) {

                        item.billingDetail.billingMethodId = item.billingDetail.billingMethod.id;
                    }
                }
            };


            vm.onPaymentMethodChange = function (method, currentIndex) {
                var installments = vm.agreement.agreementPaymentInstallments;

                for (var i = currentIndex; i < installments.length - 1; i++) {
                    var nextInstallment = installments[i + 1];

                    nextInstallment.billingDetail = nextInstallment.billingDetail || {};

                    if (!nextInstallment.billingDetail.billingMethod) {
                        nextInstallment.billingDetail.billingMethod = method;
                    }
                }

                var currentInstallment = installments[currentIndex];
                currentInstallment.billingDetail = currentInstallment.billingDetail || {};
                currentInstallment.billingDetail.billingMethod = method;

                if (method.type != 4) {
                    currentInstallment.chequeNo = null;
                    currentInstallment.bankName = null;
                }
                vm.onBillingMethodChange();
            };


            vm.onNumOfInstallmentsChange = function () {

                if (vm.isSalesAgreementVehicleWiseEnabled) {
                    vm.updateCharges();
                    vm.downPaymentChanged();
                    vm.applyFinanceCostRules();
                    var installments = vm.agreement.agreementPaymentInstallments || [];

                    var totalInstallmentsAmount = installments.reduce(function (sum, inst) {
                        return sum + (inst.amount || 0);
                    }, 0);

                    // Check first installment paid (Downpayment case)
                    var firstInstallmentPaid = false;

                    var totalAmount = totalInstallmentsAmount;
                    if (vm.agreement.advance > 0 && installments.length > 0) {
                        var firstInstallment = installments[0];
                        totalAmount += (vm.agreement.chargesUpfront || 0);

                        //firstInstallmentPaid = firstInstallment && firstInstallment.status === 1;
                    }
                    vm.agreement.totalAmount = totalAmount;
                }

                vm.agreement.agreementPaymentInstallments = [];
                vm.agreement.period = parseInt(vm.agreement.period);

                if (vm.agreement.advance > 0) {

                    for (let i = 0; i < vm.agreement.period + 1; i++) {

                        let startDate = vm.agreement.startDate ? new Date(vm.agreement.startDate) : new Date();
                        let nextMonthDate = new Date(startDate);
                        nextMonthDate.setMonth(nextMonthDate.getMonth() + i);


                        let installmentAmount;

                        if (i === 0) {
                            // 🔹 First record = advance (+ upfront charges, only when Vehicle-Wise agreement)
                            let downPaymentAmount = parseFloat(vm.agreement.advance) || 0;
                            if (vm.isSalesAgreementVehicleWiseEnabled) {
                                downPaymentAmount += (vm.agreement.chargesUpfront || 0);
                            }
                            installmentAmount = utilities.round(downPaymentAmount);
                        } else {
                            if (i < 13) {
                                installmentAmount = utilities.round(vm.agreement.perInstallmentAmount);
                            } else {
                                installmentAmount = utilities.round(vm.agreement.emiCore);
                            }
                        }
                        if (vm.isSalesAgreementVehicleWiseEnabled) {

                            let emiCoreValue = (vm.agreement.totalCharges - vm.agreement.advance) / vm.agreement.period;
                            let paymentPlanFinanceCost = vm.agreement.financeCostTotal + vm.agreement.financeCostTotalTax
                            let emiFinanceCost = paymentPlanFinanceCost / vm.agreement.period;
                            vm.addChequeRow(i + 1, nextMonthDate, installmentAmount, emiCoreValue, emiFinanceCost);
                        }
                        else {

                            vm.addChequeRow(i + 1, nextMonthDate, installmentAmount, 0, 0);
                        }
                    }

                } else {

                    for (let i = 0; i < vm.agreement.period; i++) {

                        let nextMonthDate = new Date();
                        nextMonthDate.setMonth(nextMonthDate.getMonth() + i);

                        let installmentAmount;

                        if (i < 12) {
                            installmentAmount = utilities.round(vm.agreement.perInstallmentAmount);
                        } else {
                            installmentAmount = utilities.round(vm.agreement.emiCore);
                        }
                        if (vm.isSalesAgreementVehicleWiseEnabled) {

                            let emiCoreValue = (vm.agreement.totalCharges - vm.agreement.advance) / vm.agreement.period;
                            let paymentPlanFinanceCost = vm.agreement.financeCostTotal + vm.agreement.financeCostTotalTax
                            let emiFinanceCost = paymentPlanFinanceCost / vm.agreement.period;
                            vm.addChequeRow(i + 1, nextMonthDate, installmentAmount, emiCoreValue, emiFinanceCost);
                        }
                        else {

                            vm.addChequeRow(i + 1, nextMonthDate, installmentAmount, 0, 0);
                        }
                    }
                }
            };
            vm.isFirstUninvoicedRow = function (cheque, index) {
                if (!vm.agreement || !vm.agreement.agreementPaymentInstallments) return false;

                var uninvoicedRows = vm.agreement.agreementPaymentInstallments
                    .filter(x => !x.invoiceId);

                if (uninvoicedRows.length <= 1) return false;

                return uninvoicedRows[0] === cheque;
            };
            vm.calculateEachInstallment = function () {
                if (!vm.agreement.period) {
                    vm.agreement.perInstallmentAmount = 0;
                    return;
                }
                else {
                    if (vm.agreement.charges.length > 0) {
                        if (vm.isSalesAgreementVehicleWiseEnabled) {
                            vm.processingFeeCharges =
                                (vm.agreement.charges.filter(e => e.chargesTypeId === 79)[0] || {}).amount || 0;

                        }
                        else {
                            vm.processingFeeCharges = vm.agreement.charges.filter(e => e.chargesTypeId === 79)[0].charges;

                        }


                    }
                    var perInstallmentAmount = utilities.round(parseFloat(vm.agreement.totalCharges - vm.agreement.advance) / parseFloat(vm.agreement.period));
                    vm.agreement.perInstallmentAmount = perInstallmentAmount;
                    vm.agreement.agreementPaymentInstallments.forEach(function (value, index) {
                        if (index === 0 && vm.agreement.advance > 0) {
                            value.amount = vm.agreement.advance;  // Show down payment
                        } else {
                            value.amount = vm.agreement.perInstallmentAmount;  // Show per installment
                        }
                    });
                }
            }

            function installmentsObject() {
                var obj = new Object();
                obj.installmentNo = null;
                obj.installmentDate = null;
                obj.amount = null;

                return obj;
            }

            vm.addInstallmentRow = function (num, date, amount) {

                var newInstallment = installmentsObject();
                newInstallment.installmentDate = date || vm.getlocalDateTime;
                newInstallment.amount = amount || 0;
                newInstallment.installmentNo = num || 0;
                // Add the new row to the array
                vm.installments.push(newInstallment);
            };

            function chequesObject() {
                var obj = new Object();
                obj.installmentNo = null;
                obj.installmentDate = vm.getlocalDateTime;
                obj.bankName = null;
                obj.amount = null;
                obj.notes = null;

                return obj;
            }

            vm.addChequeRow = function (num, chequeDate, amount, emiCoreValue, emiFinanceCost) {
                var newCheque = chequesObject();
                if (vm.agreement.agreementPaymentInstallments.length == 0) {
                    if (vm.agreement.advance > 0) {
                        newCheque.financeCost = 0
                    }
                    else if (vm.agreement.advance == 0) {
                        newCheque.financeCost = vm.agreement.otherChargesEMI || null;
                    }
                    newCheque.installmentNo = 0;
                    newCheque.amount = amount;
                    newCheque.emiCoreValue = emiCoreValue;
                    newCheque.emiFinanceCost = emiFinanceCost;
                    newCheque.installmentDate = chequeDate || vm.agreement.startDate || new Date();

                }

                // Check if there are existing rows
                if (vm.agreement.agreementPaymentInstallments.length > 0) {
                    // Get the last row
                    var lastCheque = vm.agreement.agreementPaymentInstallments[vm.agreement.agreementPaymentInstallments.length - 1];

                    // Copy data from the last row to the new row
                    //newCheque.chequeNo = lastCheque.chequeNo ? (parseInt(lastCheque.chequeNo) + 1).toString() : null;
                    newCheque.installmentDate = chequeDate || lastCheque.installmentDate;
                    newCheque.bankName = lastCheque.bankName;
                    newCheque.amount = amount || null;
                    newCheque.emiCoreValue = emiCoreValue || null;
                    if (vm.isSalesAgreementVehicleWiseEnabled) {

                        let index = vm.agreement.agreementPaymentInstallments.length;

                        // if advance exists, first row is advance
                        // otherwise first row is installment #1
                        let installmentIndex = vm.agreement.advance > 0
                            ? index - 1
                            : index;

                        let isInstallmentRow =
                            vm.agreement.advance > 0
                                ? index > 0
                                : true;

                        // first row is installment too when advance = 0
                        if (installmentIndex >= 0 && installmentIndex < 12) {

                            newCheque.financeCost =
                                vm.rounding(parseFloat(vm.agreement.otherChargesEMI) || 0);

                        } else {

                            newCheque.financeCost = 0;
                        }
                    }
                    newCheque.emiFinanceCost = emiFinanceCost || null;
                    newCheque.financeCost = vm.agreement.otherChargesEMI || null;
                    newCheque.installmentNo = 'INST0' + (num || vm.agreement.agreementPaymentInstallments.length).toString();
                    //newCheque.notes = 'Installment description';
                }

                // Add the new row to the array
                vm.agreement.agreementPaymentInstallments.push(newCheque);
            };

            vm.agreementTypeSelected = function () {

                //convert time based rates to corresponding rate type based on selected agreement type
                for (var i = 0; i < vm.agreement.charges.length; i++) {
                    if (vm.agreement.charges[i].rateTypeId == 1 || vm.agreement.charges[i].rateTypeId == 2 || vm.agreement.charges[i].rateTypeId == 3) {
                        if (vm.agreement.agreementType == 2) {
                            vm.agreement.charges[i].rateTypeId = rateTypes.perWeek.id;
                            vm.agreement.charges[i].rateType = rateTypes.perWeek;
                        }
                        else if (vm.agreement.agreementType == 1) {
                            vm.agreement.charges[i].rateTypeId = rateTypes.perDay.id;
                            vm.agreement.charges[i].rateType = rateTypes.perDay;
                        }
                        else if (vm.agreement.agreementType == 3) {
                            vm.agreement.charges[i].rateTypeId = rateTypes.perMonth.id;
                            vm.agreement.charges[i].rateType = rateTypes.perMonth;
                        }
                    }
                }
            };

            vm.searchCustomers = function ($select) {
                if (!$select.search) return;
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 2, activeOnly: true, includeSalesPerson: true }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };

            vm.searchStaff = function ($select) {
                if (!$select.search) return;
                return directoryService.search({ keyword: $select.search, contactType: 1 }).then(function (response) {
                    vm.staffList = response.data.items;
                });
            };

            vm.searchCustomerPopoup = function () {
                var modalInstance = openSearchContactModel(null, 2);

                modalInstance.result.then(function (result) {
                    if (result != null) {
                        vm.agreement.customer = result;
                        vm.customerSelected();
                    }
                });
            };

            vm.vehicleSelected = function (row) {
                row.modalAndMake = row.vehicle.make + " " + row.vehicle.model;
                row.modelYear = row.vehicle.modelYear;
                row.chassisNo = row.vehicle.chassisNo;
                row.vehicleId = row.vehicle.id;
                if (vm.isSalesAgreementVehicleWiseEnabled) {

                    row.costPrice = row.vehicle.purchasePrice;
                }

            }

            vm.searchVehicles = function ($select, row) {
                if (vm.isSalesAgreementVehicleWiseEnabled) {
                    if ($select.search == "") { vm.vehicles = null; return null; }
                    var subStatuses = [3]; //1: Available, 7: Ready to go
                    var ownerships = [1, 10];
                    return equipmentSalesService.searchEquipmentsForQuotationVehicleWise({ plateNo: $select.search, chassisNo: $select.search, statusId: 'IDL', subStatuses: subStatuses, ownerships: ownerships }).then(function (response) {
                        vm.vehicles = response.data.items;
                    });
                }
                else {
                    if ($select.search == "") { vm.vehicles = null; return null; }
                    var subStatuses = [1, 7]; //1: Available, 7: Ready to go
                    equipmentSalesService.searchEquipments({ plateNo: $select.search, statusId: 'IDL', subStatuses: subStatuses, ownership: 10 }).then(function (response) {
                        vm.vehicles = response.data.items;
                        if (vm.agreement.agreementVehicles.length > 0) {
                            vm.vehicles = vm.vehicles.filter(v => {
                                return !vm.agreement.agreementVehicles.some(agreementVehicle => agreementVehicle.vehicleId === v.id); /*Already selected Vehicle should not be selected again*/
                            });
                        }
                        else {
                            return vm.vehicles;
                        }
                    });

                }
            };
            vm.searchVehiclesForAgreement = function ($select, row) {
                if ($select.search == "") { vm.vehicles = null; return null; }
                equipmentSalesService.searchEquipmentsForAgreement({ plateNo: $select.search, statusId: 'DFL', ownership: 10, modelId: row.vehicleModelId }).then(function (response) {
                    vm.vehicles = response.data.items;
                    if (vm.agreement.agreementVehicles.length > 0) {
                        vm.vehicles = vm.vehicles.filter(v => {
                            return !vm.agreement.agreementVehicles.some(agreementVehicle => agreementVehicle.vehicleId === v.id);
                        });
                    }
                    else {
                        return vm.vehicles;
                    }
                });
            };

            //vm.searchVehiclePopup = function () {
            //    openSearchVehicleModal();
            //};
            //function openSearchVehicleModal() {

            //    var modalInstance = $uibModal.open({
            //        templateUrl: '~/App/tenant/views/crs/vehicles/searchVehicleModal.cshtml',
            //        controller: 'tenant.views.crs.vehicles.searchVehicleModal as vm',
            //        backdrop: 'static',
            //        size: 'lg',
            //        resolve: {
            //            options: function () {
            //                return {
            //                    fromDateTime: moment(vm.agreement.movements[0].outDetail.dateTime ? vm.agreement.movements[0].outDetail.dateTime : moment().startOf('day')).utc(),
            //                    toDateTime: moment(vm.agreement.endDate ? vm.agreement.endDate : moment().endOf('day')).utc(),
            //                    //tariffGroup: vm.searchOtherGroupsVehicle ? null : vm.tariffGroup,
            //                    //tariffGroupId: vm.searchOtherGroupsVehicle ? null : vm.tariffGroupId,
            //                    statusId: 'IDL',
            //                    subStatuses: [1, 7], //1: Available, 7: Ready to go
            //                    source: 'openagreement',
            //                    selectable: true,
            //                    ownership: 5,
            //                    //doNotIncludeReplacementVehicle: doNotIncludeReplacementVehicle
            //                };
            //            }
            //        }
            //    });

            //    modalInstance.result.then(function (result) {
            //        if (result != null) {
            //            vm.agreement.vehicle = result;
            //            vm.vehicleSelected();
            //        }
            //    });
            //}

            vm.customerSelected = function () {

                //if contact (i.e individual person)
                if (vm.agreement.customer.contactCategory == 1) {
                    vm.agreement.driver = vm.agreement.customer;
                    vm.isCompany = false;
                }
                if (vm.agreement.customer.contactCategory == 2) {
                    vm.isCompany = true;
                }
                if (vm.isEditMod && vm.agreementTaxPercent > 0) {
                    vm.agreement.taxPercent = vm.agreement.customer.isTaxExempted ? 0 : vm.agreementTaxPercent;
                    vm.agreement.isTaxExempted = vm.agreement.customer.isTaxExempted;
                }
                else {
                    vm.agreement.taxPercent = vm.agreement.customer.isTaxExempted ? 0 : vm.taxPercent;
                    vm.agreement.isTaxExempted = vm.agreement.customer.isTaxExempted;
                }


                vm.agreement.salesPerson = vm.agreement.customer.salesPerson;
                vm.agreement.salesPersonId = vm.agreement.customer.salesPerson != null ? vm.agreement.customer.salesPerson.id : null;

            };

            function getBillingMethods() {
                vm.loading = true;
                billingMethodService.getBillingMethods({ category: 1 }).success(function (data) {
                    vm.billingMethods = data.items.filter(i => i.isActive && (i.locationId == null || i.locationId === appSession.user.locationId) && (i.userId == null || i.userId === appSession.user.id));
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function openSearchContactModel(category, type) {
                return $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchContactModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchContactModal as vm',
                    backdrop: 'static',
                    resolve: {
                        category: function () {
                            return category;
                        },
                        type: function () {
                            return type;
                        }
                    }
                });
            }

            // Validating CreateOrUpdateAgreement 




            vm.save = function () {
                if (!vm.isSalesAgreementVehicleWiseEnabled && !vm.isEditMod) {
                    var remaining = vm.rounding((parseFloat(vm.agreement.totalCharges) || 0) - (parseFloat(vm.agreement.advance) || 0));
                    var total = vm.rounding(vm.getInstallmentsTotal());

                    if (Math.abs(total - remaining) > 0.01) {
                        abp.message.error(
                            'The total installment amount (' + vm.roundingWithSeparator(total) + ') must equal the remaining amount (' + vm.roundingWithSeparator(remaining) + '). Please adjust the installment amounts before saving.'
                        );
                        return;
                    }
                }
                vm.saving = true;
                //if (vm.agreement.customer.contactCategory != 2) {
                //    vm.agreement.charges.forEach(function (value) {
                //        value.invoiceToDriver = false;
                //    });
                //}
                vm.advanceChanged = true;
                //popup for advance or deposit if needed
                if (vm.showAdvancePopupOnSave || vm.showDepositPopupOnSave) {
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/tenant/views/crs/agreements/agreementAdvanceAndDeposit.cshtml',
                        controller: 'tenant.views.crs.agreements.agreementAdvanceAndDeposit as vm',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            options: function () {
                                return {
                                    agreement: vm.agreement,
                                    advance: vm.advance,
                                    deposit: vm.deposit,

                                };
                            }
                        }
                    });
                    modalInstance.result.then(function (result) {
                        var continueSaving = false;
                        if (result != null && result.save != null)
                            continueSaving = result.save;

                        vm.saving = continueSaving;
                        if (continueSaving) {
                            vm.advanceChanged = true;
                            if (vm.deposit.voucherSubTypeId != 11) // all types except pre authoriation
                            {
                                //put hold for days in the from of fromdate & todate
                                vm.deposit.fromDate = moment();
                                var fromDate = angular.copy(vm.deposit.fromDate);
                                vm.deposit.toDate = fromDate.add(vm.deposit.holdForDays, 'day');
                            }

                            save(); //save on closing of popup
                        }
                        else
                            vm.saving = false; //saving cacelled on popup
                    });

                } else //if advance or deposit popup is not shown then save directly
                    save();
            };

            function save() {

                vm.saving = true;

                if (isValid) {
                    // ===============================
                    // CALCULATE TOTAL INSTALLMENTS
                    // ===============================
                    var installments = vm.agreement.agreementPaymentInstallments || [];

                    var totalInstallmentsAmount = installments.reduce(function (sum, inst) {
                        return sum + (inst.amount || 0);
                    }, 0);

                    // Check first installment paid (Downpayment case)
                    var firstInstallmentPaid = false;

                    var totalAmount = totalInstallmentsAmount;
                    if (vm.agreement.advance > 0 && installments.length > 0) {
                        var firstInstallment = installments[0];
                        totalAmount += (vm.agreement.chargesUpfront || 0);

                        //firstInstallmentPaid = firstInstallment && firstInstallment.status === 1;
                    }


                    //if (firstInstallmentPaid) {
                    //}

                    // Save into agreement
                    vm.agreement.totalAmount = totalAmount;
                    //update ids for selected records
                    if (vm.agreement.vehicle)
                        vm.agreement.vehicleId = vm.agreement.vehicle.id;
                    if (vm.agreement.customer)
                        vm.agreement.customerId = vm.agreement.customer.id;

                    if (vm.agreement.documents) {
                        vm.agreement.documents = vm.documents;
                    }
                    //vm.agreement.additionalCharges.forEach(c => {
                    //    delete c.chargesType;
                    //});
                    salesAgreementService.createOrUpdateAgreement({
                        agreement: vm.agreement,
                        billingDetail: vm.billingDetails,
                        discountAuthCodeId: vm.discountAuthCode == null ? null : vm.discountAuthCode.id,
                        //tariffCardId: vm.tariffCard
                    }).success(function (result) {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        vm.agreement.id = result;
                        if (vm.saveAndPrint)
                            saveAndPrint(vm.agreement.id);
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
                else {
                    abp.message.info(app.localize(errorMessage));
                    vm.saving = false;
                }
            }

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            var saveAndPrint = function (id) {
                window.open('/Report#/tenant/printModalAgreement/' + id);
            };
            function loadChargesFromSettings() {
                for (var i = 0; i < vm.chargesSettings.length; i++) {

                    var foundLines = $filter('filter')(vm.agreement.charges, {
                        chargesTypeId: vm.chargesSettings[i].chargesTypeId
                    }, true);



                    if (foundLines.length == 0) {
                        vm.agreement.charges.push(
                            {
                                agreementId: null,
                                order: vm.chargesSettings[i].order,
                                chargesTypeId: vm.chargesSettings[i].chargesTypeId,
                                rateTypeId: vm.chargesSettings[i].rateTypeId,
                                discountPercent: 0,
                                rate: null,
                                units: null,
                                charges: vm.chargesSettings[i].charges,
                                applyOnClosing: vm.chargesSettings[i].applyOnClosing,
                                isMandatory: vm.chargesSettings[i].isMandatory,
                                taxable: vm.chargesSettings[i].taxable,
                                accepted: ((vm.chargesSettings[i].chargesType.chargesCategory == 2 || vm.chargesSettings[i].chargesType.chargesCategory == 3 || vm.chargesSettings[i].chargesType.chargesCategory == 4) ? false : true),
                                included: false,
                                excessRate: null,
                                limit: null,
                                chargesType: vm.chargesSettings[i].chargesType,
                                rateType: vm.chargesSettings[i].rateType,
                                tariff: []

                            }
                        );
                    }
                    //    }
                }
            }

            vm.tariffOptionSelected = function (chargesRow, tariffLine) {
                chargesRow.included = tariffLine.included;
                chargesRow.rate = tariffLine.rate;
                chargesRow.excessRate = tariffLine.excessRate;
                chargesRow.limit = tariffLine.limit;
            };

            vm.disableRate = function (chargesRow) {

                if (chargesRow.tariff.length > 1) {
                    var foundLines = $filter('filter')(chargesRow.tariff, {
                        included: chargesRow.included,
                        rate: chargesRow.rate,
                        excessRate: chargesRow.excessRate,
                        limit: chargesRow.limit
                    }, true);
                    if (foundLines.length > 0) {
                        return foundLines[0].rate > 0;
                    }
                    else {
                        return false;
                    }
                }

                return chargesRow.tariff[0].rate > 0;
            };

            //vm.calculate = function () {
            //    if (vm.agreement == null) return 0;

            //    if (vm.agreement && vm.agreement.charges) {
            //        var foundLines = $filter('filter')(vm.agreement.charges, {
            //            chargesTypeId: 1
            //        }, true);
            //        if (foundLines.length == 1) {
            //            if (foundLines[0].discountPercent >= 0) {
            //                foundLines[0].discountedRate = utilities.round(foundLines[0].rate - (foundLines[0].rate * (foundLines[0].discountPercent / 100)), 2);
            //            }
            //        }
            //    }
            //    return chargesCalculator.calculate(vm.agreement);
            //};
            vm.calculateDiscount = function () {
                if (vm.agreement == null) return 0;
                vm.agreement.discount || 0;
                let totalChargesList = vm.agreement.charges.reduce(
                    (sum, item) => sum + (item.charges || 0),
                    0
                );
                if (!(vm.agreement.quotationId > 0)) {
                    vm.agreement.tax = (totalChargesList * vm.agreement.taxPercent) / 100;
                    vm.agreement.totalCharges = (totalChargesList - vm.agreement.discount) + vm.agreement.tax;
                }
                if (vm.agreement.period > 0) {
                    vm.onNumOfInstallmentsChange();
                    vm.calculateEachInstallment();
                }
            };

            vm.includedChanged = function (chargesRow) {
                if (chargesRow.included)
                    chargesRow.rate = 0;
            };

            //vm.taxAcceptedChanged = function () {
            //    if (vm.taxAccepted) {

            //        vm.agreement.taxPercent = vm.taxPercent;
            //        vm.agreement.tax =
            //            (vm.agreement.totalCharges * vm.agreement.taxPercent) / 100;

            //    }
            //    else {

            //        vm.agreement.taxPercent = 0;
            //    }

            //};

            vm.discountApplied = function () {
                if (vm.taxAccepted)
                    vm.agreement.taxPercent = vm.taxPercent;
                else
                    vm.agreement.taxPercent = 0;
            };


            vm.updateCharges = function () {
                if (vm.isSalesAgreementVehicleWiseEnabled) {

                    vm.agreement.totalCharges = 0;
                    vm.agreement.tax = 0;
                    vm.agreement.charges.forEach(function (c) {
                        let chargeAmount = parseFloat(c.charges) || 0;
                        if (c.chargesTypeId == 78) {
                            vm.agreement.totalCharges += chargeAmount;
                            if (vm.taxAccepted && !isNaN(chargeAmount)) {
                                let taxAmount = (chargeAmount * vm.agreement.taxPercent) / 100;
                                vm.agreement.tax += taxAmount;
                                c.tax = taxAmount;
                            }
                        }
                        else if (c.chargesTypeId == 79 && c.taxable && !isNaN(chargeAmount)) {
                            c.tax = (chargeAmount * vm.agreement.taxPercent) / 100;
                        }
                        else {
                            if (c.taxable && vm.agreement.taxPercent > 0) {
                                c.tax = chargeAmount * (vm.agreement.taxPercent / 100);
                                c.amountWithTax = c.charge + c.tax;
                            }
                        }
                    });
                    vm.processingFeeCharges =
                        (vm.agreement.charges.filter(e => e.chargesTypeId === 79)[0] || {}).amount || 0;
                    vm.agreement.totalCharges += vm.agreement.tax;
                    if (vm.agreement.totalCharges < 0) {
                        vm.agreement.totalCharges = 0;
                    }
                    vm.agreement.totalCharges -= (vm.agreement.discount > 0 ? vm.agreement.discount : 0);

                    var perInstallmentAmount = utilities.round(parseFloat(vm.agreement.totalCharges - vm.agreement.advance) / parseFloat(vm.agreement.period));
                    vm.agreement.perInstallmentAmount = perInstallmentAmount;
                    for (let i = 0; i < vm.agreement.agreementPaymentInstallments.length; i++) {
                        if (vm.agreement.advance > 0) {

                            if (i + 1 < vm.agreement.agreementPaymentInstallments.length) {
                                vm.agreement.agreementPaymentInstallments[i + 1].amount =
                                    vm.agreement.perInstallmentAmount;
                            }  // Set the same value for 'amount' property
                        }
                        else {
                            vm.agreement.agreementPaymentInstallments[i].amount = vm.agreement.perInstallmentAmount;  // Set the same value for 'amount' property

                        }
                    }
                }
                else {
                    vm.agreement.totalCharges = 0;
                    vm.agreement.tax = 0;
                    vm.agreement.charges.forEach(function (c) {
                        let chargeAmount = parseFloat(c.charges) || 0;
                        if (c.chargesTypeId == 79) {
                            c.tax = 0;
                        }
                        if (c.chargesTypeId != 79) {
                            vm.agreement.totalCharges += chargeAmount;
                            if (c.taxable && !isNaN(chargeAmount)) {
                                let taxAmount = (chargeAmount * vm.agreement.taxPercent) / 100;
                                vm.agreement.tax += taxAmount;
                            }
                        }
                        else if (c.chargesTypeId == 79 && c.taxable && !isNaN(chargeAmount)) {
                            c.tax = (chargeAmount * vm.agreement.taxPercent) / 100;
                        }
                    });
                    var processingFee = vm.agreement.charges.filter(e => e.chargesTypeId === 79)[0] || {};
                    vm.processingFeeCharges = parseFloat(processingFee.charges) || 0;
                    vm.processingFeeTax = parseFloat(processingFee.tax) || 0;
                    vm.agreement.totalCharges += vm.agreement.tax;
                    if (vm.agreement.totalCharges < 0) {
                        vm.agreement.totalCharges = 0;
                    }
                    vm.agreement.totalCharges -= (vm.agreement.discount > 0 ? vm.agreement.discount : 0);
                    // In the standard (non vehicle-wise) flow, totalCharges is the grand total.
                    vm.agreement.totalCharges += vm.processingFeeCharges + vm.processingFeeTax;

                    var perInstallmentAmount = utilities.round(parseFloat(vm.agreement.totalCharges - vm.agreement.advance) / parseFloat(vm.agreement.period));
                    vm.agreement.perInstallmentAmount = perInstallmentAmount;
                    for (let i = 0; i < vm.agreement.agreementPaymentInstallments.length; i++) {
                        if (vm.agreement.advance > 0) {

                            vm.agreement.agreementPaymentInstallments[i + 1].amount = vm.agreement.perInstallmentAmount;  // Set the same value for 'amount' property
                        }
                        else {
                            vm.agreement.agreementPaymentInstallments[i].amount = vm.agreement.perInstallmentAmount;  // Set the same value for 'amount' property

                        }
                    }
                }
            };
            vm.getTotalCharges = function () {
                if (!vm.agreement || !vm.agreement.charges) return 0;

                return vm.agreement.charges
                    .filter(c => !c.applyOnClosing && c.chargesTypeId != 78 && c.chargesTypeId != 79)
                    .reduce((total, c) => total + (parseFloat(c.charges) || 0), 0);
            };


            vm.changeStatusReceiptCreation = function () {
                if (vm.advance.amount > 0)
                    vm.showAdvancePopupOnSave = true;
                else
                    vm.showAdvancePopupOnSave = false;
            };
            vm.changeStatusDepositCreation = function () {
                if (vm.deposit.amount > 0)
                    vm.showDepositPopupOnSave = true;
                else
                    vm.showDepositPopupOnSave = false;
            };

            vm.costPriceOrMarginChanged = function (row) {
                if (vm.isSalesAgreementVehicleWiseEnabled) {

                    //row.costPrice = vm.rounding(parseFloat(row.costPrice) || 0);
                    //row.marginPercent = vm.rounding(parseFloat(row.marginPercent) || 0);

                    //if (row.costPrice > 0) {
                    //    row.price = vm.rounding(
                    //        row.costPrice * (1 + row.marginPercent / 100)
                    //    );
                    //} else {
                    //    row.price = 0;
                    //}

                    vm.priceChanged(row);
                    vm.taxAcceptedChanged();
                }
                else {
                    row.costPrice = vm.rounding(parseFloat(row.costPrice) || 0);
                    row.marginPercent = vm.rounding(parseFloat(row.marginPercent) || 0);

                    if (row.costPrice > 0) {
                        row.price = vm.rounding(
                            row.costPrice * (1 + row.marginPercent / 100)
                        );
                    } else {
                        row.price = 0;
                    }

                    vm.priceChanged(row);
                }

            };

            function getChargesTypes() {
                vm.loading = true;
                chargesSettingService.getConfiguredChargesTypes({ module: 9 }).success(function (data) {
                    vm.chargesTypes = data.items;
                    angular.forEach(vm.chargesTypes, function (row) {
                        row.name = app.localize(row.name);
                    });
                }).finally(function () {
                    vm.loading = false;
                });
            }
            //gargash ERL new CR
            //vm.onInstallmentAmountChanged = function (changedCheque) {

            //    // ye check sirf tab lagay ga jab feature disabled ho aur naya agreement create ho raha ho
            //    if (vm.isSalesAgreementVehicleWiseEnabled || vm.isEditMod) return;

            //    var remaining = vm.rounding((parseFloat(vm.agreement.totalCharges) || 0) - (parseFloat(vm.agreement.advance) || 0));
            //    var total = vm.rounding(vm.getInstallmentsTotal());

            //    if (total !== remaining) {
            //        abp.message.error('Total installment amount (' + total + ') remaining amount (' + remaining + ') ke barabar hona chahiye');
            //    }
            //};
            vm.getInstallmentsTotal = function () {
                if (!vm.agreement || !vm.agreement.agreementPaymentInstallments) return 0;

                var installments = vm.agreement.agreementPaymentInstallments;
                var total = 0;

                for (var i = 0; i < installments.length; i++) {

                    var isDownPaymentRow = (vm.agreement.advance > 0 && i === 0);

                    if (!isDownPaymentRow) {
                        total += (parseFloat(installments[i].amount) || 0);
                    }
                }

                return total;
            };
            //end of gargashERL changes 
            function getAdditionalCharges() {
                agreementAdditionalChargesService.getAdditionalAgreementCharges({
                    id: agreementId
                }).success(function (result) {
                    vm.additionalCharges = result.additionalCharges;
                    //vm.additionalCharges = vm.additionalCharges.filter(a => a.rateTypeId == 6);
                    vm.agreementEndDate = utilities.jsonUtcDateToLocalMoment(result.endDate);
                    //getChargesTypes();

                }).finally(function () {
                    vm.loading = false;
                });
            }
            vm.priceChanged2 = function (row) {
                row.price = vm.rounding(parseFloat(row.price) || 0);

                vm.agreement.charges[0].charges = vm.agreement.agreementVehicles.reduce(
                    (sum, vehicle) => sum + (vehicle.price > 0 ? vm.rounding(vehicle.price) : 0),
                    0
                );

                let totalChargesList = vm.agreement.charges.reduce(
                    (sum, item) => sum + (item.charges || 0),
                    0
                );

                totalChargesList -= (vm.agreement.discount > 0 ? vm.agreement.discount : 0);

                if (!(vm.agreement.quotationId > 0)) {
                    vm.agreement.tax = vm.rounding(
                        (totalChargesList * vm.agreement.taxPercent) / 100
                    );
                    vm.agreement.totalCharges = vm.rounding(
                        totalChargesList + vm.agreement.tax
                    );
                }

                if (vm.agreement.period > 0) {
                    vm.onNumOfInstallmentsChange();
                    vm.calculateEachInstallment();
                }
            };
            vm.calculateTotalAmount = function () {

                var installments = vm.agreement.agreementPaymentInstallments || [];

                var totalInstallmentsAmount = installments.reduce(function (sum, inst) {
                    return sum + (inst.amount || 0);
                }, 0);

                var totalAmount = totalInstallmentsAmount;

                // Add upfront charges in downpayment case
                if (vm.agreement.advance > 0 && installments.length > 0) {
                    totalAmount += (vm.agreement.chargesUpfront || 0);
                }

                vm.agreement.totalAmount = totalAmount;

                return totalAmount;
            };
            function init() {
                getBillingMethods();
                getChargesTypes();
                if (agreementId != null) {
                    getAdditionalCharges();
                }
                vm.loading = true;
                salesAgreementService.getSalesAgreementForEdit({
                    id: agreementId
                }).success(function (result) {
                    vm.agreement = result.agreement;
                    vm.periodCheck = angular.copy(vm.agreement.period);
                    vm.downPaymentCheck = angular.copy(vm.agreement.advance);
                    vm.taxAccepted = vm.agreement.taxPercent > 0;
                    if (vm.agreement.charges.length > 0) {
                        debugger
                        if (vm.isSalesAgreementVehicleWiseEnabled) {

                            vm.processingFeeCharges =
                                (vm.agreement.charges.filter(e => e.chargesTypeId === 79)[0] || {}).amount || 0;
                        }
                        else {

                            vm.processingFeeCharges = (vm.agreement.charges.filter(e => e.chargesTypeId === 79)[0] || {}).amount || 0;
                        }
                    }
                    if (!agreementId)
                        vm.agreement.additionalCharges = vm.additionalCharges || [];
                    vm.agreement.perInstallmentAmount = 0;
                    var installmentTotal = vm.isSalesAgreementVehicleWiseEnabled
                        ? vm.agreement.totalCharges - vm.processingFeeCharges
                        : vm.agreement.totalCharges;
                    vm.agreement.perInstallmentAmount = utilities.round(parseFloat(installmentTotal - vm.agreement.advance) / parseFloat(vm.agreement.period));
                    if (quotationId == null) {
                        vm.perInstallmentChanged();
                    }
                    if (!vm.agreement.id > 0) {
                        vm.agreement.startDate = new Date();
                    }
                    if (vm.agreement.id > 0) {
                        for (var i = 0; i < vm.agreement.agreementVehicles.length; i++) {
                            vm.agreement.agreementVehicles[i].modalAndMake = vm.agreement.agreementVehicles[i].vehicle.model.name + " " + vm.agreement.agreementVehicles[i].vehicle.model.make.name;
                            vm.agreement.agreementVehicles[i].modelYear = vm.agreement.agreementVehicles[i].vehicle.modelYear;
                            vm.agreement.agreementVehicles[i].chassisNo = vm.agreement.agreementVehicles[i].vehicle.chassisNo;

                        }
                        for (var i = 1; i < vm.agreement.agreementPaymentInstallments.length; i++) {
                            if (vm.agreement.agreementPaymentInstallments[i].pdcVoucher) {
                                if (vm.agreement.agreementPaymentInstallments[i].pdcVoucher.billingDetail) {
                                    if (vm.agreement.agreementPaymentInstallments[i].pdcVoucher.billingDetail.billingMethod.type == 4) {
                                        vm.agreement.agreementPaymentInstallments[i].chequeNo = vm.agreement.agreementPaymentInstallments[i].pdcVoucher.billingDetail.cheque.chequeNo;
                                        vm.agreement.agreementPaymentInstallments[i].bankName = vm.agreement.agreementPaymentInstallments[i].pdcVoucher.billingDetail.cheque.bankName;
                                    }

                                    vm.agreement.agreementPaymentInstallments[i].pdcVoucher.billingDetail = vm.agreement.agreementPaymentInstallments[i].pdcVoucher.billingDetail;

                                }

                            }



                            //vm.agreement.agreementPaymentInstallments[i].installmentDate = vm.agreement.agreementPaymentInstallments[i].pdcVoucher.billingDetail.cheque.chequeDate;
                            //vm.agreement.agreementPaymentInstallments[i].notes = vm.agreement.agreementPaymentInstallments[i].notes;
                        }

                    }
                    //vm.tariffCard = vm.agreement.tariffCardId;
                    if (vm.agreement.vehicle != null) {
                        vm.agreement.vehicle.makeAndModel = vm.agreement.vehicle.make + ' ' + vm.agreement.vehicle.model.name + ', ' + vm.agreement.vehicle.modelYear;
                    }
                    vm.advance = result.advance;
                    vm.deposit = result.deposit;

                    if (vm.agreement.id > 0) {
                        vm.isEditMod = true;
                        vm.agreementTaxPercent = vm.agreement.taxPercent;
                        vm.agreement.startDate = vm.agreement.startDate;
                        if (vm.agreement.customer)
                            vm.disableTariffCard = vm.agreement.customer.tariffCardId != null;

                        if (vm.agreement.documents)
                            vm.documents = vm.agreement.documents;

                        //calculate hold for days using fromdate and todate if cash or check deposit
                        if (vm.deposit.voucherSubTypeId != 11) // all types except
                        {
                            var td = moment(vm.deposit.toDate);
                            var duration = moment.duration(td.diff(vm.deposit.fromDate));
                            vm.deposit.holdForDays = utilities.round(duration.asDays(), 0);
                        }


                    } else {
                        vm.agreement.agreementNo = null;
                        vm.agreement.period = 0;
                        vm.agreement.perInstallmentAmount = 0;
                        vm.agreement.advance = 0;
                        vm.isEditMod = false;
                    }
                    if (vm.isSalesAgreementVehicleWiseEnabled && (!quotationId > 0 && !(vm.agreement.id > 0))) {
                        vm.addRow();
                    }
                    loadChargesFromSettings();

                    //vm.taxAccepted = vm.agreement.taxPercent > 0 ? true : false;

                    // If quotationId exists, fetch its data
                    if (quotationId) {
                        if (vm.isSalesAgreementVehicleWiseEnabled) {

                            quotationVehicleWise.getQuotationForEdit({
                                id: quotationId
                            }).success(function (quotationResult) {
                                var quotationdata = quotationResult;
                                vm.agreement.quotationId = quotationId;
                                vm.agreement.notes = quotationdata.notes;
                                vm.agreement.customer = quotationdata.customer;
                                vm.agreement.charges = quotationdata.quotationcharges;
                                if (vm.isSalesAgreementVehicleWiseEnabled) {

                                    vm.agreement.agreementVehicles = quotationdata.quotationLines;
                                    vm.agreement.agreementVehicles = vm.agreement.agreementVehicles.map(costPrice => {
                                        const { vehiclePrice, ...rest } = costPrice;
                                        return { costPrice: vehiclePrice, ...rest };
                                    });
                                    vm.agreement.agreementVehicles = vm.agreement.agreementVehicles.map(price => {
                                        const { amount, ...rest } = price;
                                        return { price: amount, ...rest };
                                    });
                                }
                                vm.agreement.charges = vm.agreement.charges.map(charge => {
                                    const { amount, ...rest } = charge;
                                    return { charges: amount, ...rest };
                                });

                                vm.agreement.tax = quotationdata.tax;
                                vm.agreement.taxPercent = quotationdata.taxPercent;
                                vm.agreement.totalCharges = quotationdata.amount;
                                vm.agreement.remainingAmount = quotationdata.remainingAmount;
                                vm.agreement.advance = quotationdata.downPayment;
                                vm.agreement.period = quotationdata.noOfInstallment;
                                vm.periodCheck = angular.copy(vm.agreement.period);
                                vm.downPaymentCheck = angular.copy(vm.agreement.advance);
                                if (vm.isSalesAgreementVehicleWiseEnabled) {

                                    vm.agreement.costPrice = quotationdata.quotationLines[0].vehiclePrice;
                                    vm.agreement.price = quotationdata.quotationLines[0].amount;
                                    vm.agreement.financeCostPercent = quotationdata.financeCostPercent;
                                    vm.agreement.financeCostTotal = quotationdata.financeCostTotal;
                                    vm.agreement.financeCostTotalTax = quotationdata.financeCostTotalTax;
                                    vm.agreement.totalAmountWithFinance = quotationdata.totalAmountWithFinance;
                                    vm.agreement.chargesUpfront = quotationdata.chargesUpfront;
                                    vm.agreement.chargesFinanceCost = quotationdata.chargesFinanceCost;
                                }

                                vm.agreement.perInstallmentAmount = utilities.round(quotationdata.perInstallmentAmount);
                                if (vm.agreement.advance) {
                                    vm.updateChequeRows();
                                }

                                vm.taxAccepted = vm.agreement.tax > 0;

                                if (vm.agreement.period) {
                                    vm.onNumOfInstallmentsChange(vm.agreement.perInstallmentAmount);
                                }
                                vm.addQuotationRowAp(quotationResult);
                                if (quotationdata.quotationPaymentInstallments && quotationdata.quotationPaymentInstallments.length) {
                                    vm.agreement.agreementPaymentInstallments = quotationdata.quotationPaymentInstallments.map(inst => ({
                                        tenantId: inst.tenantId,
                                        agreementId: vm.agreement.id || 0,
                                        pdcVoucherId: inst.pdcVoucherId,
                                        amount: inst.amount,
                                        notes: inst.notes,
                                        chequeNo: inst.chequeNo,
                                        bankName: inst.bankName,
                                        billingDetailId: inst.billingDetailId,
                                        installmentDate: inst.installmentDate,
                                        invoiceId: inst.invoiceId,
                                        paymentMethod: inst.paymentMethod,
                                        emiCoreValue: inst.emiCoreValue,
                                        emiFinanceCost: inst.emiFinanceCost,
                                        financeCost: inst.financeCost,
                                        status: inst.status
                                    }));
                                }
                                vm.agreement.emiCore = vm.agreement.perInstallmentAmount - vm.agreement.otherChargesEMI;
                                vm.calculateTotalAmount();
                            }).finally(function () {
                                vm.loading = false;
                            });
                        }
                        else {
                            salesQuotationService.getQuotationForEdit({
                                id: quotationId
                            }).success(function (quotationResult) {
                                var quotationdata = quotationResult;
                                vm.agreement.quotationId = quotationId;
                                vm.agreement.notes = quotationdata.notes;
                                vm.agreement.customer = quotationdata.customer;
                                vm.agreement.charges = quotationdata.quotationcharges;
                                vm.agreement.charges = vm.agreement.charges.map(charge => {
                                    const { amount, ...rest } = charge;
                                    return { charges: amount, ...rest };
                                });
                                vm.agreement.tax = quotationdata.tax;
                                vm.agreement.totalCharges = quotationdata.amount;
                                vm.agreement.advance = quotationdata.downPayment;
                                vm.agreement.period = quotationdata.noOfInstallment;
                                vm.periodCheck = angular.copy(vm.agreement.period);
                                vm.downPaymentCheck = angular.copy(vm.agreement.advance);
                                vm.agreement.perInstallmentAmount = utilities.round(quotationdata.perInstallmentAmount);
                                if (vm.agreement.advance) {
                                    vm.updateChequeRows();
                                }
                                if (vm.agreement.period) {
                                    vm.onNumOfInstallmentsChange(vm.agreement.perInstallmentAmount);
                                }
                                vm.addQuotationRow(quotationResult);
                            }).finally(function () {
                                vm.loading = false;
                            });
                        }
                    } else {
                        vm.loading = false;
                    }
                    vm.agreement.emiFinanceCostSale = 0;
                    if (vm.agreement.period > 0) {
                        vm.agreement.emiFinanceCostSale = vm.rounding((vm.agreement.financeCostTotal + vm.agreement.financeCostTotalTax) / vm.agreement.period);
                    }

                }).finally(function () {
                    if (!quotationId) {
                        vm.loading = false;
                    }
                });
            }

            init();

        }
    ]);
