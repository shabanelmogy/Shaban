// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:335457-336425
appModule.controller('tenant.views.crs.vouchers.debitNotes.createOrEditOnAccountModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'debitNoteId', 'abp.services.app.directory', 'abp.services.app.debitNote', 'abp.services.app.vehicle', 'utilities',
        'abp.services.app.commonLookup', 'appSession', 'abp.services.app.agreement', 'abp.services.app.commonAgreement', '$filter', 'abp.services.app.chargesSetting',
        'abp.services.app.account', 'abp.services.app.allocation', 'abp.services.app.jV', 'abp.services.app.costCenter', "FileUploader",
        function ($scope, $uibModal, $uibModalInstance, debitNoteId, directoryService, debitNoteService, vehicleService, utilities, commonLookupService, appSession, agreementService,
            commonAgreementService, $filter, chargesSettingService, accountService, allocationService, JVService, costCenterService, fileUploader) {

            var vm = this;
            vm.branchTaxPercentage = null;
            vm.loading = false;
            vm.chargesTypes = [];
            vm.documents = [];
            var isValid = true;
            vm.closedAgreements = false;
            vm.defaultCurrencyCode = abp.setting.get("App.General.CurrencyCode");
            vm.currencyCode = '';
            vm.agreementNoInDebitNote = utilities.parseBoolean(abp.setting.get("App.General.AgreementNoInCreditAndDebitNote")); //CommentedByOmarKhan
            vm.isMultiCurrencyEnabled = abp.features.isEnabled('Core.MultiCurrency');
            vm.isApprovedEnabled = abp.features.isEnabled("CRS.Vouchers.Approval.DebitNotes");
            vm.autoCalculateAmountInWords = abp.setting.get("App.General.AutoCalculateAmountInWords");
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.isPostTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.PostTaxInclusive"));
            if (vm.isPostTaxInclusive)
                vm.isTaxInclusive = false;
            vm.isTaxOptional = utilities.parseBoolean(abp.setting.get("App.General.IsTaxOptional"));
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            // vm.isCustomerFeature = abp.features.isEnabled("CRS.Fines.DubaiPolice")
            vm.moduleWiseReceivables = abp.features.isEnabled("CRS.ModuleWiseReceivables");
            vm.isAccountFeatureEnabled = abp.features.isEnabled("CRS.Accounts");
            vm.documentsForJournal = abp.features.isEnabled("CRS.CustomFeatures.DocumentsForDebitNote");
            vm.allActionsOnOtherBranch = abp.auth.hasPermission('Pages.Tenant.Vouchers.DebitNotes.AllActionsOnOtherBranchDebitNotes');
            vm.isVipCustomer = utilities.parseBoolean(abp.setting.get("App.General.IsVipCustomer"));
            vm.isCostCenterEnabled = abp.features.isEnabled("Core.CostCenters");
            vm.isCostCenter2Enabled = utilities.parseBoolean(abp.setting.get("App.Speed.Common.IsCostCenterGroup2Enabled"));
            vm.isTaxCodeEnabled = abp.features.isEnabled("CRS.TaxCodes");
            //new settings
            vm.costCenterGroup1Required = utilities.parseBoolean(abp.setting.get("App.Speed.Common.CostCenterGroup1Required"));
            vm.costCenterGroup2Required = utilities.parseBoolean(abp.setting.get("App.Speed.Common.CostCenterGroup2Required"));
            vm.assignVehicleBranchInVoucherLine = utilities.parseBoolean(abp.setting.get("App.Speed.Common.AssignVehicleBranchInVoucherLine"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.taxAccepted = false;
            vm.isEnableDueAmount = true;
            vm.supplierPaymentEnableSave = true;
            vm.isCustomer = true;
            vm.isSetting = true;
            vm.debitNote = {
                voucherLines: []
            };
            vm.filters = {
                customerId: null,
                module: null
            }
            vm.onAgreementSelection = function (line) {
                if (line) {
                    line.agreementId = line.agreement.id;
                    if (line.agreement.permanentVehicleId) {
                        line.vehicleId = line.agreement.permanentVehicle.id;
                        line.vehicle = line.agreement.permanentVehicle;
                    }
                    else {
                        line.vehicleId = line.agreement.vehicle.id;
                        line.vehicle = line.agreement.vehicle;
                    }
                }
            } //CommentedByOmarKhan
            var chargesInput = {
                agreementCategory: null
            }
            vm.localize = function (input) {
                return app.localize(input);
            };
            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };
            vm.modules = [];
            if (abp.features.isEnabled("CRS.Rental"))
                vm.modules.push({ name: 'Rental', id: 1 });
            if (abp.features.isEnabled("CRS.Lease"))
                vm.modules.push({ name: 'Lease', id: 2 });
            if (abp.features.isEnabled("CRS.Limo"))
                vm.modules.push({ name: 'Limousine', id: 3 });
            if (abp.features.isEnabled("CRS.Transportation"))
                vm.modules.push({ name: 'Transportation', id: 4 });
            if (abp.features.isEnabled("CRS.Chauffeur"))
                vm.modules.push({ name: 'Chauffeur', id: 5 });
            if (abp.features.isEnabled("WORKSHOP"))
                vm.modules.push({ name: 'Workshop', id: 6 });
            if (abp.features.isEnabled("ERS"))
                vm.modules.push({ name: 'Equipment', id: 7 });
            if (abp.features.isEnabled("CRS.AccessoriesRental"))
                vm.modules.push({ name: 'Accessories Rental', id: 8 });
            if (abp.features.isEnabled("CRS.SalesModule"))
                vm.modules.push({ name: 'Sales', id: 9 });


            vm.enabledModule = vm.modules.length > 0 ? vm.modules[0].id : null;

            vm.agreementChanged = function () {
                chargesInput.agreementCategory = vm.debitNote.agreement.agreementCategory;
                if (vm.debitNote.agreement.agreementCategory == 1 && (vm.debitNote.agreement.agreementType == 1 || vm.debitNote.agreement.agreementType == 2 || vm.debitNote.agreement.agreementType == 3)) {
                    vm.enabledModule = 1;
                }
                else if (vm.debitNote.agreement.agreementCategory == 2 && vm.debitNote.agreement.agreementType == 4) {
                    vm.enabledModule = 2;
                }
                else if (vm.debitNote.agreement.agreementCategory == 4) {
                    vm.enabledModule = 5;
                }
                getChargesTypes();
            };
            function debitNoteLineObject() {
                var line = new Object();
                line.chargesTypeId = null;
                line.description = '';
                line.debitNote = null;
                line.credit = null;
                line.amount = null;
                line.taxable = false;
                line.module = vm.enabledModule;
                return line;
            }

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.amountMinValue = 100;
            vm.customerSettings = function (customer) {
                vm.isCustomer = true;
                if (customer != 2) {
                    vm.isCustomer = false;
                }
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };
            vm.GetCostCenterName = function (id) {
                console.log(vm.costCenters.filter(i => i.id == id)[0].name);
                return vm.costCenters.filter(i => i.id == id)[0].name;
            }
            function getCostCenters() {

                costCenterService.searchCostCenters({ IncludeInActive: false }).success(function (response) {
                    vm.costCenters = response.items;

                    vm.costCentersGroup1 = vm.costCenters.filter(e => e.group != 2);
                    vm.costCentersGroup2 = vm.costCenters.filter(e => e.group == 2);
                });
            };
            function loadCostCenterInLine(line) {
                line.showCostCenter = false;
                line.costCenters = [];
                if (line.account.accountCategory === 4 || line.account.accountCategory === 5 || line.showDate) {
                    line.showCostCenter = true;
                }
                if (line.account.accountCategory === 1 || line.account.accountCategory === 2 || line.account.accountCategory === 3) {
                    line.disableCostCenter = true;
                    if (line.showDate)
                        line.disableCostCenter = false;
                }
                else if (line.account.accountCategory === 4 || line.account.accountCategory === 5) {
                    line.disableCostCenter = false;
                }
            }

            vm.searchAgreements = function ($select) {
                if ($select.search == "") { vm.agreements = null; return null; }
                agreementService.searchAgreementForVoucherLines({ agreementNo: $select.search, manualAgreementNo: $select.search }).then(function (response) {
                    vm.agreements = response.data.items;
                });
            } //CommentedByOmarKhan
            vm.calculateCreditAndTax = (row) => {

                if (vm.debitNote == null)
                    return 0;
                if (row == null)
                    return 0;
                if (vm.debitNote.taxPercent > 0) {
                    var tax = 0;
                    row.credit = 0;
                    row.tax = 0;
                    if (!vm.debitNote.contact.isTaxExempted) {

                        row.credit = parseFloat(row.amount) * (100 / (100 + vm.debitNote.taxPercent));
                        row.tax = parseFloat(row.amount) - row.credit;
                    }

                    else {
                        row.tax = 0;
                        row.taxable = (row.taxable);
                        vm.debitNote.taxPercent = 0;
                    }

                }
                else {
                    row.tax = 0;
                    row.taxable = (row.taxable);
                }
                row.amount = row.credit + row.tax;
                row.credit = utilities.round(row.credit, 2);
                row.amount = utilities.round(row.amount, 2);
                row.tax = utilities.round(row.tax, 2);

                /////////
                vm.sumAmount();


            }
            vm.onTaxChange = function (voucherLine) {

                if (voucherLine) {
                    var sum = 0;
                    var totalTax = 0.0;
                    for (var i = 0; i < vm.debitNote.voucherLines.length; i++) {
                        if (vm.debitNote.voucherLines[i].credit != null && vm.debitNote.voucherLines[i].module == vm.enabledModule) {
                            sum = sum + parseFloat(vm.debitNote.voucherLines[i].credit);
                        }
                        if (vm.debitNote.voucherLines[i].tax != null)
                            totalTax = totalTax + utilities.round(vm.debitNote.voucherLines[i].tax, 2);
                    }

                    vm.debitNote.amountInWords = '';

                    vm.debitNote.tax = utilities.round(totalTax, 2);
                    //vm.debitNote.amount = vm.isTaxInclusive ? utilities.round(sum, 2) : (utilities.round(sum, 2) + utilities.round(totalTax, 2)) / 1
                    vm.debitNote.amount = !vm.isTaxInclusive ? (utilities.round(sum, 2) + utilities.round(totalTax, 2)) / 1 : utilities.round(sum, 2);
                    vm.debitNote.amount = utilities.round(vm.debitNote.amount, 2);
                    if (vm.debitNote.amount > 0) {
                        if (vm.autoCalculateAmountInWords == "true")
                            vm.debitNote.amountInWords = utilities.toWords(vm.debitNote.amount);
                        if (vm.isMultiCurrencyEnabled) {
                            currencyName = vm.debitNote.contact.currencyDto ? vm.debitNote.contact.currencyDto.name : null;
                            decimalName = vm.debitNote.contact.currencyDto ? vm.debitNote.contact.currencyDto.decimalName : null;
                            vm.debitNote.amountInWords = utilities.toWords(vm.debitNote.amount, currencyName, decimalName);
                        }
                    }
                }
            };
            vm.sumAmountTaxEditable = function (taxEditCheck, voucherLinesParam) {

                if (vm.debitNote == null)
                    return 0;

                if (vm.debitNote.voucherLines == null)
                    return 0;

                if (vm.isCustomer) {
                    if (vm.debitNote.taxPercent > 0) {
                        var tax = 0;

                        // Check if voucherlines include chargesType or Account dropdown, if account  then no need of chargestype code.

                        if (voucherLinesParam.chargesType.taxable || voucherLinesParam.taxable) {
                            if (vm.isTaxInclusive) {   // prices are with tax. extract include tax amount which will not be added in 
                                //equation solved from following formula... 
                                //chargesWithoutTax + chargesWithoutTax * (taxPercent/100) = chargesWithTax
                                var chargesWithoutTax = (voucherLinesParam.credit * 100) / (100 + vm.debitNote.taxPercent);
                                tax = utilities.round(voucherLinesParam.credit - chargesWithoutTax, 2);
                                totalTax += utilities.round(tax, 2);
                            } else {
                                //prices are without tax. calculate tax and include in total
                                tax = taxEditCheck == true ? voucherLinesParam.tax : utilities.round(voucherLinesParam.credit * vm.debitNote.taxPercent / 100, 2);
                                totalTax += utilities.round(tax, 2);

                                // vm.tripCharges[i].charges += utilities.round(tax,2);

                            }
                            voucherLinesParam.tax = tax;
                            voucherLinesParam.taxable = true;
                        }
                        else {
                            voucherLinesParam.tax = 0;
                            voucherLinesParam.taxable = (voucherLinesParam.chargesType.taxable || voucherLinesParam.taxable);
                        }
                    }
                    else {
                        voucherLinesParam.tax = 0;
                        voucherLinesParam.taxable = (voucherLinesParam.chargesType.taxable || voucherLinesParam.taxable);
                    }
                }
                else {

                    //  tax = vm.debitNote.voucherLines[i].tax == null ? 0 : vm.debitNote.voucherLines[i].tax;
                    //  totalTax += utilities.round(tax, 2);





                    if (vm.isTaxInclusive) {   // prices are with tax. extract include tax amount which will not be added in 
                        //equation solved from following formula... 
                        //chargesWithoutTax + chargesWithoutTax * (taxPercent/100) = chargesWithTax
                        var chargesWithoutTax = (voucherLinesParam.credit * 100) / (100 + vm.debitNote.taxPercent);
                        tax = utilities.round(voucherLinesParam.credit - chargesWithoutTax, 2);
                        //totalTax += utilities.round(tax, 2);
                    } else {
                        //prices are without tax. calculate tax and include in total
                        tax = taxEditCheck == true ? utilities.round(voucherLinesParam.tax, 2) : utilities.round(voucherLinesParam.credit * vm.debitNote.taxPercent / 100, 2)
                        // tax = utilities.round(vm.debitNote.voucherLines[i].credit * vm.debitNote.taxPercent / 100, 2);
                        //totalTax += utilities.round(tax, 2);
                    }
                    voucherLinesParam.tax = tax;
                    voucherLinesParam.taxable = true;

                }

                voucherLinesParam.amount = parseFloat(voucherLinesParam.credit) + voucherLinesParam.tax;

                var sum = 0;
                var totalTax = 0.0;
                for (var i = 0; i < vm.debitNote.voucherLines.length; i++) {
                    if (vm.debitNote.voucherLines[i].credit != null && vm.debitNote.voucherLines[i].module == vm.enabledModule) {
                        sum = sum + parseFloat(vm.debitNote.voucherLines[i].credit);
                    }
                    if (vm.debitNote.voucherLines[i].tax != null)
                        totalTax = totalTax + utilities.round(vm.debitNote.voucherLines[i].tax, 2);
                }

                vm.debitNote.amountInWords = '';

                vm.debitNote.tax = utilities.round(totalTax, 2);
                //vm.debitNote.amount = vm.isTaxInclusive ? utilities.round(sum, 2) : (utilities.round(sum, 2) + utilities.round(totalTax, 2)) / 1
                vm.debitNote.amount = !vm.isTaxInclusive ? (utilities.round(sum, 2) + utilities.round(totalTax, 2)) / 1 : utilities.round(sum, 2);
                vm.debitNote.amount = utilities.round(vm.debitNote.amount, 2);
                if (vm.debitNote.amount > 0) {
                    if (vm.autoCalculateAmountInWords == "true")
                        vm.debitNote.amountInWords = utilities.toWords(vm.debitNote.amount);
                    if (vm.isMultiCurrencyEnabled) {
                        currencyName = vm.debitNote.contact.currencyDto ? vm.debitNote.contact.currencyDto.name : null;
                        decimalName = vm.debitNote.contact.currencyDto ? vm.debitNote.contact.currencyDto.decimalName : null;
                        vm.debitNote.amountInWords = utilities.toWords(vm.debitNote.amount, currencyName, decimalName);
                    }
                }


                return { totalCharges: utilities.round(sum, 2), totalTax: utilities.round(totalTax, 2), totalWithTax: (utilities.round(sum, 2) + utilities.round(totalTax, 2)) / 1 };
            };

            vm.sumAmount = function (taxEditCheck) {

                if (vm.debitNote == null)
                    return 0;

                if (vm.debitNote.voucherLines == null)
                    return 0;

                var sum = 0;
                var totalTax = 0.0;
                for (var i = 0; i < vm.debitNote.voucherLines.length; i++) {
                    if (vm.debitNote.voucherLines[i].credit != null && vm.debitNote.voucherLines[i].module == vm.enabledModule) {
                        sum = sum + parseFloat(vm.debitNote.voucherLines[i].credit);


                        if (vm.isCustomer) {
                            if (vm.debitNote.taxPercent > 0) {
                                var tax = 0;

                                // Check if voucherlines include chargesType or Account dropdown, if account  then no need of chargestype code.

                                if (vm.debitNote.voucherLines[i].chargesType.taxable || vm.debitNote.voucherLines[i].taxable) {
                                    if (vm.isTaxInclusive) {   // prices are with tax. extract include tax amount which will not be added in 
                                        //equation solved from following formula... 
                                        //chargesWithoutTax + chargesWithoutTax * (taxPercent/100) = chargesWithTax
                                        var chargesWithoutTax = (vm.debitNote.voucherLines[i].credit * 100) / (100 + vm.debitNote.taxPercent);
                                        tax = utilities.round(vm.debitNote.voucherLines[i].credit - chargesWithoutTax, 2);
                                        totalTax += utilities.round(tax, 2);
                                    } else {
                                        //prices are without tax. calculate tax and include in total
                                        tax = utilities.round(vm.debitNote.voucherLines[i].credit * vm.debitNote.taxPercent / 100, 2);
                                        totalTax += utilities.round(tax, 2);

                                        // vm.tripCharges[i].charges += utilities.round(tax,2);

                                    }
                                    vm.debitNote.voucherLines[i].tax = tax;
                                    vm.debitNote.voucherLines[i].taxable = true;
                                }
                                else {
                                    vm.debitNote.voucherLines[i].tax = 0;
                                    vm.debitNote.voucherLines[i].taxable = (vm.debitNote.voucherLines[i].chargesType.taxable || vm.debitNote.voucherLines[i].taxable);
                                }
                            }
                            else {
                                vm.debitNote.voucherLines[i].tax = 0;
                                vm.debitNote.voucherLines[i].taxable = (vm.debitNote.voucherLines[i].chargesType.taxable || vm.debitNote.voucherLines[i].taxable);
                            }
                        }
                        else {

                            //  tax = vm.debitNote.voucherLines[i].tax == null ? 0 : vm.debitNote.voucherLines[i].tax;
                            //  totalTax += utilities.round(tax, 2);





                            if (vm.isTaxInclusive) {   // prices are with tax. extract include tax amount which will not be added in 
                                //equation solved from following formula... 
                                //chargesWithoutTax + chargesWithoutTax * (taxPercent/100) = chargesWithTax
                                var chargesWithoutTax = (vm.debitNote.voucherLines[i].credit * 100) / (100 + vm.debitNote.taxPercent);
                                tax = utilities.round(vm.debitNote.voucherLines[i].credit - chargesWithoutTax, 2);
                                totalTax += utilities.round(tax, 2);
                            } else {
                                //prices are without tax. calculate tax and include in total
                                tax = taxEditCheck == true ? vm.debitNote.voucherLines[i].tax : utilities.round(vm.debitNote.voucherLines[i].credit * vm.debitNote.taxPercent / 100, 2)
                                // tax = utilities.round(vm.debitNote.voucherLines[i].credit * vm.debitNote.taxPercent / 100, 2);
                                totalTax += utilities.round(tax, 2);
                            }
                            vm.debitNote.voucherLines[i].tax = tax;
                            vm.debitNote.voucherLines[i].taxable = true;

                        }

                        vm.debitNote.voucherLines[i].amount = parseFloat(vm.debitNote.voucherLines[i].credit) + vm.debitNote.voucherLines[i].tax;

                    }

                }

                vm.debitNote.amountInWords = '';

                vm.debitNote.tax = utilities.round(totalTax, 2);
                //vm.debitNote.amount = vm.isTaxInclusive ? utilities.round(sum, 2) : (utilities.round(sum, 2) + utilities.round(totalTax, 2)) / 1
                vm.debitNote.amount = !vm.isTaxInclusive ? (utilities.round(sum, 2) + utilities.round(totalTax, 2)) / 1 : utilities.round(sum, 2);
                vm.debitNote.amount = utilities.round(vm.debitNote.amount, 2);
                if (vm.debitNote.amount > 0) {
                    if (vm.autoCalculateAmountInWords == "true")
                        vm.debitNote.amountInWords = utilities.toWords(vm.debitNote.amount);
                }

                return { totalCharges: utilities.round(sum, 2), totalTax: utilities.round(totalTax, 2), totalWithTax: (utilities.round(sum, 2) + utilities.round(totalTax, 2)) / 1 };
            };

            vm.taxAcceptedChanged = function () {
                if (vm.taxAccepted)
                    vm.debitNote.taxPercent = vm.taxPercent;
                else
                    vm.debitNote.taxPercent = 0;
            };

            //Add row
            vm.addRow = function (line) {
                if (line == undefined)
                    line = debitNoteLineObject();

                vm.debitNote.voucherLines.push(line);
            };

            //Remove row
            vm.removeRow = function (obj) {
                var index = vm.debitNote.voucherLines.indexOf(obj);
                vm.debitNote.voucherLines.splice(index, 1);
                vm.isSetting ? vm.sumAmount(true) : vm.sumAmount();
            };

            vm.branchTaxCode = function () {
                var userLocationId = appSession.user.locationId;
                if (userLocationId) {
                    commonLookupService.getLocationById({ id: userLocationId })
                        .success(function (data) {
                            var userLocation = data;
                            if (userLocation.taxCode) {
                                vm.branchTaxPercentage = userLocation.taxCode.taxPercent;
                            }
                        })
                }
            }

            vm.onCustomerSelect = function (customer) {
                vm.debitNote.contactId = customer.id;
                vm.debitNote.contact = customer;
                vm.debitNote.agreement = null;
                vm.debitNote.agreementId = null;
                if (customer.contactType == 3) {
                    getAllocations();
                }
                if (vm.isEditMode && vm.debitNoteTaxPercent > 0) {
                    vm.debitNote.taxPercent = vm.debitNote.contact.isTaxExempted ? 0 : vm.debitNoteTaxPercent;
                    vm.debitNote.isTaxExempted = vm.debitNote.contact.isTaxExempted;
                    if (vm.isTaxCodeEnabled && !vm.debitNote.contact.isTaxExempted) {
                        if (vm.debitNote.contact.taxCodeId > 0) {
                            vm.debitNote.taxPercent = vm.debitNote.contact.taxCode.taxPercent;
                        }
                        else {
                            if (vm.branchTaxPercentage)
                                vm.debitNote.taxPercent = vm.debitNote.contact.isTaxExempted ? 0 : vm.branchTaxPercentage;
                        }
                    }
                }
                else {
                    vm.debitNote.taxPercent = vm.debitNote.contact.isTaxExempted ? 0 : vm.taxPercent;
                    vm.debitNote.isTaxExempted = vm.debitNote.contact.isTaxExempted;

                    if (vm.isTaxCodeEnabled && !vm.debitNote.contact.isTaxExempted) {
                        if (vm.debitNote.contact.taxCodeId > 0) {
                            vm.debitNote.taxPercent = vm.debitNote.contact.taxCode.taxPercent;
                        }
                        else {
                            if (vm.branchTaxPercentage)
                                vm.debitNote.taxPercent = vm.debitNote.contact.isTaxExempted ? 0 : vm.branchTaxPercentage;
                        }
                    }
                }
                if (vm.isMultiCurrencyEnabled) {
                    if (vm.debitNote.contact.currencyDto) {
                        vm.currencyCode = vm.debitNote.contact.currencyDto.code;
                        vm.debitNote.currencyId = vm.debitNote.contact.currencyDto.id;
                        vm.debitNote.currencyRate = vm.debitNote.contact.currencyDto.currencyToBaseRate;
                    }
                    else {
                        vm.currencyCode = vm.defaultCurrencyCode;

                    }
                }
                vm.sumAmount();
                getAgreements(customer.id);
            };

            vm.moduleChanged = function () {
                getChargesTypes();
                vm.debitNote.voucherLines = [];
                vm.debitNote.amount = 0;
                vm.debitNote.tax = 0;
                vm.debitNote.amountInWords = null;
                if (vm.moduleWiseReceivables) {

                    vm.filters.customerId = vm.debitNote.contact.id;
                    if (!vm.filters.customerId) {
                        abp.notify.warn("Please select customer first.");
                        return;
                    }

                    // agreement category from dropdown
                    vm.filters.module = vm.enabledModule || null;

                    // Call backend
                    commonAgreementService.getAllAgreementsOnCustomer(vm.filters).then(function (result) {
                        if (!result || !result.data) {
                            vm.agreements = [];
                            return;
                        }

                        vm.agreements = result.data.items || result.data || [];
                    });
                }
            };

            function getAgreements(customerId) {

                vm.loading = true;
                var agreement = null;
                vm.debitNote.agreement = null;
                vm.debitNote.agreementId = null;
                //if (vm.closedAgreements == false) {
                //    agreement = agreementService.getOpenAgreementsOnCustomer({ id: customerId });
                //}
                //else {
                //    agreement = agreementService.getClosedAgreementsOnCustomer({ id: customerId });
                //}
                vm.filters.module = vm.enabledModule || null;
                vm.filters.customerId = vm.debitNote.contactId
                agreement = commonAgreementService.getAllAgreementsOnCustomer(vm.filters);
                agreement.success(function (data) {
                    if (data) {
                        vm.agreements = data.items;
                        if (vm.agreements.length == 0) {
                            vm.debitNote.agreement = vm.agreements[0];
                        }
                    } else { vm.agreements = null; }

                }).finally(function () {
                    vm.loading = false;
                });
            };

            // search from dropdown
            vm.searchCustomers = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                //contactType = vm.isAccountFeatureEnabled == true ? 2 : null;
                return directoryService.search({ keyword: $select.search, activeOnly: true, contactType: vm.isAccountFeatureEnabled == false ? 2 : null }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };



            vm.searchAccounts = function ($select) {
                if ($select.search == "") {
                    vm.accounts = null;
                    return null;
                }
                //,isLeaf:true
                return accountService.searchAccountsForSubLookUp({ filter: $select.search, isLeaf: true }).then(function (response) {
                    vm.accounts = response.data.items;
                });
            };


            vm.searchVehicles = function ($select) {
                if ($select.search == "") { vm.vehicles = null; return null; }
                return vehicleService.searchVehicles({ plateNo: $select.search, includeDefleeted: true }).then(function (response) {
                    vm.vehicles = response.data.items;
                });
            };
            // extended search using search customer popup
            vm.searchCustomerPopoup = function () {

                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchContactModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchContactModal as vm',
                    backdrop: 'static',
                    resolve: {
                        category: function () {
                            return null;
                        },
                        type: function () {
                            // return null;
                            return vm.isAccountFeatureEnabled == false ? 2 : null;
                        }
                    }
                }).result.then(function (result) {
                    if (result != null) {
                        vm.onCustomerSelect(result);
                    }
                    if (result.contactType == 3) {
                        getAllocations();
                    }
                });
            };


            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                } else {
                    return "";
                }
            };


            vm.sumAmountAllocation = function () {
                vm.isEnableDueAmount = true;
                if (vm.allocationData == null)
                    return 0;

                if (vm.allocationData.allocations.length == 0)
                    return 0;

                var amount = 0;
                angular.forEach(vm.allocationData.allocations, function (value, key) {
                    if (value.allocatedNow > 0)
                        amount = utilities.round(amount + value.allocatedNow, 2);
                    if (value.due < 0) {
                        vm.isEnableDueAmount = false;
                    }
                });


                //In Payment module total supplier allocations amount is compared with  amount, we dont have amount in debit note thats why below lines are commented.can be Modified according to requirement

                //if (amount > 0 && vm.payment.amount != amount)
                //    vm.supplierPaymentEnableSave = false;
                //else
                //    vm.supplierPaymentEnableSave = true;


                vm.supplierPaymentEnableSave = true;

                return utilities.round(amount, 2);
            };


            vm.searchPrepaidExpense = function (voucherLine, accountId) {
                return JVService.getexpenseaccounts({ id: accountId }).then(function (result) {
                    voucherLine.showDate = result.data;
                });
            };

            vm.uploadDocument = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/debitNotes/uploadDocumentsModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.debitNotes.uploadDocumentsModal as vm',
                    backdrop: 'static'
                });

                modalInstance.result.then(function (result) {
                    if (!vm.documents) {
                        vm.documents = [];
                    }
                    vm.documents.push(result);
                });
            };

            vm.getOriginalName = function (doc) {
                var originalName = doc.name.replace("_" + doc.guid, "");
                return originalName;
            };

            vm.removeDocument = function (obj) {
                var index = vm.documents.indexOf(obj);
                vm.documents.splice(index, 1);
            };

            vm.save = function () {
                vm.isValidForSave = true;
                angular.forEach(vm.debitNote.voucherLines, function (value, key) {
                    if (value.fromDate > value.toDate) {
                        vm.isValidForSave = false;
                        abp.message.info(app.localize('From Date should be less then To Date'));
                        return
                    }

                });
                if (vm.isValidForSave) {
                    isValid = true;
                    var date = new Date(vm.debitNote.date);
                    date.setHours(0);
                    date.setMinutes(0);
                    date.setSeconds(0);
                    vm.debitNote.date = date;
                    //vm.debitNote.voucherSubTypeId = 9
                    angular.forEach(vm.debitNote.voucherLines, function (value, key) {
                        value.id = 0;
                        // value.chargesType = null;
                    });

                    vm.saving = true;
                    if (vm.debitNote.locationId == null || vm.debitNote.locationId == 0) {
                        if (vm.locations.length == 1)
                            vm.debitNote.locationId = vm.locations[0].id;
                    }


                    var foundLines = $filter('filter')(vm.debitNote.voucherLines, {
                        module: vm.enabledModule,
                    }, true);

                    vm.debitNote.voucherLines.forEach(row => {
                        if (row.fromDate != null)
                            row.fromDate = row.fromDate.startOf('day');
                        if (row.toDate != null)
                            row.toDate = row.toDate.startOf('day');

                    });

                    vm.debitNote.voucherLines = foundLines;
                    vm.debitNote.voucherDocuments = vm.documents;

                    if (vm.assignVehicleBranchInVoucherLine) {
                        vm.debitNote.voucherLines.forEach(function (line) {
                            if (line.vehicle && !line.locationId) {
                                line.locationId = line.vehicle.locationId;
                            }
                        });

                    }

                    debitNoteService.createOrUpdateDebitNoteOnAccount({ debitNote: vm.debitNote }
                    ).success(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
            };

            vm.localize = function (input) {
                return app.localize(input);
            };

            function getChargesTypes() {

                vm.loading = true;
                chargesSettingService.getConfiguredChargesTypes({ module: vm.enabledModule }).success(function (data) {
                    vm.chargesTypes = data.items;
                    angular.forEach(vm.chargesTypes, function (row) {
                        row.name = app.localize(row.name);
                    });
                }).finally(function () {
                    vm.loading = false;
                });
            }

            function getLocations() {
                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                });
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
                vm.debitNote.voucherLines = [];
                if (response) {
                    var fileName = response.result.fileName;
                    vm.importing = false;
                    vm.loading = true;
                    debitNoteService.importFromExcel(fileName)
                        .success(function (result) {
                            vm.debitNote.voucherLines = result;
                            angular.forEach(vm.debitNote.voucherLines, function (value) {
                                value.debit = 0;
                            });

                            vm.debitNote.voucherLines = vm.debitNote.voucherLines.filter(function (value) {
                                return !(value.credit === 0 && value.debit === 0);
                            });

                            angular.forEach(vm.debitNote.voucherLines, function (value, key) {
                                value.module = vm.enabledModule;
                                if (value.fromDate && value.toDate)
                                    value.showDate = true;
                                if (vm.debitNote.fromDate === "0001-01-01T00:00:00")
                                    vm.debitNote.fromDate = null;
                                if (value.vehicleId !== null && value.vehicleId > 0)
                                    value.vehicleShow = true;
                                if (value.contactId !== null && value.contactId > 0)
                                    value.contactShow = true;
                                vm.sumAmount(value)

                            });

                            if (vm.debitNote.voucherLines.length == 0)
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


            function getAllocations() {
                var module = null;
                if (vm.enabledModule) {
                    module = vm.enabledModule;
                }
                allocationService.getAllocationsForEdit({
                    contactId: vm.debitNote.contact.id,
                    voucherCategory: 1,
                    //VoucherId: paymentId,
                    VoucherId: debitNoteId,
                    module: module
                }).success(function (data) {
                    vm.allocationData = data;
                });
            }

            function init() {
                getChargesTypes();
                getLocations();
                getCostCenters();
                vm.branchTaxCode();
                debitNoteService.getDebitNoteForEdit({ id: debitNoteId }).success(
                    function (result) {

                        if (result.contact != null) {
                            vm.customerSettings(result.contact.contactType)
                        }
                        vm.debitNote = result;
                        vm.documents = vm.debitNote.voucherDocuments;

                        if (vm.isMultiCurrencyEnabled) {
                            if (vm.debitNote.contact) {
                                if (vm.debitNote.contact.currency) {
                                    vm.currencyCode = vm.debitNote.contact.currency.code;
                                    currencyName = vm.debitNote.contact.currency ? vm.debitNote.contact.currency.name : null;
                                    decimalName = vm.debitNote.contact.currency ? vm.debitNote.contact.currency.decimalName : null;
                                    vm.debitNote.amountInWords = utilities.toWords(vm.debitNote.amount, currencyName, decimalName);
                                }
                                else {
                                    vm.currencyCode = vm.defaultCurrencyCode;

                                }
                            }
                            else {
                                vm.currencyCode = vm.defaultCurrencyCode;
                            }
                        }

                        vm.isEditMode = debitNoteId > 0;
                        if (vm.isEditMode) {
                            if (vm.isPostTaxInclusive) {
                                if (vm.debitNote) {
                                    if (vm.debitNote.voucherLines.length > 0) {
                                        vm.debitNote.voucherLines.forEach(function (value) {
                                            value.amount = value.credit + value.tax;
                                        });
                                    }
                                }
                            }

                            vm.debitNoteTaxPercent = vm.debitNote.taxPercent;
                            vm.enabledModule = vm.debitNote.voucherLines[0].module;
                            vm.debitNote.voucherLines.forEach(row => {
                                if (row.fromDate && row.toDate)
                                    row.showDate = true;
                            });
                        }
                        else {
                            vm.debitNote.taxPercent = vm.taxPercent;
                            vm.debitNote.locationId = appSession.user.locationId;
                        }
                        //if (vm.debitNote.voucherNo <= 0) {
                        //   // vm.debitNote.voucherNo = null;

                        //}

                        if (vm.debitNote.voucherLines.length == 0)
                            vm.addRow();

                        if (result.contact != null) {
                            if (result.contact.contactType == 3) {
                                getAllocations();
                            }
                        }

                    });
            }
            init();
        }
    ]);
