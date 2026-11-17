// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:118775-119239
appModule.controller('tenant.views.crs.accidents.createCDWInvoiceModal', [
        '$uibModalInstance', 'movement', 'abp.services.app.movement', 'abp.services.app.chargesSetting', 'abp.services.app.invoice', 'abp.services.app.commonLookup', 'abp.services.app.vehicle', 'utilities', '$filter', 'appSession', 'abp.services.app.accident', 'accident',
        function ($uibModalInstance, movement, movementService, chargesSettingService, invoiceService, commonLookupService, vehicleService, utilities, $filter, appSession, accidentService, accident) {

            var vm = this;
            vm.loading = false;
            //vm.movement = movement;
            vm.chargesTypes = [];
            var isValid = true;
            vm.closedAgreements = false;
            vm.isEditMode = false;
            vm.autoCalculateAmountInWords = abp.setting.get("App.General.AutoCalculateAmountInWords");
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.isPostTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.PostTaxInclusive"));
            vm.isTaxOptional = utilities.parseBoolean(abp.setting.get("App.General.IsTaxOptional"));
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.manualInvoiceNo = utilities.parseBoolean(abp.setting.get("App.General.ManualInvoiceNo"));
            vm.isEastCoast = appSession.tenant.tenancyName.toLowerCase() == 'eastcoast';
            vm.isMergedRentalInvoice = false;
            vm.accident = accident;
            vm.taxAccepted = false;
            vm.saveAndPrint = false;
            if (vm.isPostTaxInclusive)
                vm.isTaxInclusive = false;
            vm.invoice = {
                voucherLines: []
            };
            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };
            vm.chargesTypeVoucherLine = function (item) {
                if (vm.invoice.voucherLines.length > 1) {
                    if (item.refNo == vm.invoice.voucherLines[0].refNo)
                        return true;
                }
                return false;
            };
            vm.getColspan = function () {
                var foundLines = $filter('filter')(vm.invoice.voucherLines, {
                    refNo: vm.invoice.voucherLines[0].refNo
                }, true).length + 2;
                return foundLines;
            };
            vm.chargesTypeVoucherLineRepeat = function (value) {
                if (vm.invoice.voucherLines.length > 1 && value.chargesTypeId == 24) {


                    return true;
                };
                return false;
            };
            vm.sumPerTrip = function (refNo) {
                var sum = 0.0;
                var foundLines = $filter('filter')(vm.invoice.voucherLines, {
                    refNo: refNo
                }, true);
                foundLines.forEach(function (value) {
                    //+parseFloat(value.tax)
                    sum = sum + (parseFloat(value.credit));
                });
                return utilities.round(sum, 2);
            };

            vm.sumTaxPerTrip = function (refNo) {
                var tax = 0.0;
                var foundLines = $filter('filter')(vm.invoice.voucherLines, {
                    refNo: refNo
                }, true);
                foundLines.forEach(function (value) {
                    //+parseFloat(value.tax)
                    tax = tax + (parseFloat(value.tax));
                });
                return utilities.round(tax, 2);
            };

            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };
            function getLocations() {
                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                });
            };
            vm.searchRentalOrLeaseAgreement = function ($select, contactId) {
                if ($select.search == '') return;
                commonLookupService.searchRentalOrLeaseAgreement({ agreementNo: $select.search, contactId: contactId, agreementCategory: vm.enabledModule }).then(function (response) {
                    vm.agreements = response.data.items;
                });
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

            vm.enabledModule = vm.modules.length > 0 ? vm.modules[0].id : null;
            vm.moduleChanged = function () {
                getChargesTypes();
                vm.invoice.voucherLines = [];
                vm.invoice.amount = 0;
                vm.invoice.tax = 0;
                vm.invoice.amountInWords = null;

            };
            var moduleFilter = {
                module: 0 //all enabled modules
            };

            vm.localize = function (input) {
                return app.localize(input);
            };

            vm.agreementChanged = function () {
                moduleFilter.module = vm.invoice.agreement.agreementCategory;
                vm.enabledModule = vm.invoice.agreement.agreementType == 'Rental' || vm.debitNote.agreement.agreementType == 'Weekly' ? 1 : 2;
                getChargesTypes();
            };


            function invoiceLineObject() {
                var line = new Object();
                line.chargesType = 'Damage Charges';
                line.chargesTypeId = 28;
                if (accident.chargingType == 2) {
                    line.chargesType = 'Excess Insurance Charges';
                    line.chargesTypeId = 72;
                }
                line.description = '';
                line.debit = null;
                line.credit = accident.excessAmount;
                line.taxable = false;
                line.tax = accident.excessAmount * vm.movement.agreement.taxPercent/100;
                line.module = vm.enabledModule;
                return line;
            }

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.amountMinValue = 100;

            vm.sumAmount = function () {
                if (vm.invoice == null)
                    return 0;

                if (vm.invoice.voucherLines == null)
                    return 0;

                var sum = 0;
                var totalTax = 0.0;
                for (var i = 0; i < vm.invoice.voucherLines.length; i++) {
                    if (vm.invoice.voucherLines[i].credit != null && vm.invoice.voucherLines[i].module == vm.enabledModule) {
                        sum = sum + parseFloat(vm.invoice.voucherLines[i].credit);

                        if (vm.movement.agreement.taxPercent > 0) {
                            var tax = 0;
                            if (vm.invoice.voucherLines[i].chargesType.taxable || vm.invoice.voucherLines[i].taxable) {
                                if (vm.isTaxInclusive) {   // prices are with tax. extract include tax amount which will not be added in 
                                    //equation solved from following formula... 
                                    //chargesWithoutTax + chargesWithoutTax * (taxPercent/100) = chargesWithTax
                                    var chargesWithoutTax = (vm.invoice.voucherLines[i].credit * 100) / (100 + vm.movement.agreement.taxPercent);
                                    tax = utilities.round(vm.invoice.voucherLines[i].credit - chargesWithoutTax, 2);
                                    totalTax += utilities.round(tax, 2);
                                } else {
                                    //prices are without tax. calculate tax and include in total
                                    tax = utilities.round(vm.invoice.voucherLines[i].credit * vm.movement.agreement.taxPercent / 100, 2);
                                    totalTax += utilities.round(tax, 2);
                                    // vm.tripCharges[i].charges += utilities.round(tax,2);

                                }
                                vm.invoice.voucherLines[i].tax = tax;
                                vm.invoice.voucherLines[i].taxable = true;
                            }
                            else {
                                vm.invoice.voucherLines[i].tax = 0;
                                vm.invoice.voucherLines[i].taxable = (vm.invoice.voucherLines[i].chargesType.taxable || vm.invoice.voucherLines[i].taxable);
                            }

                        }
                        else {
                            vm.invoice.voucherLines[i].tax = 0;
                            vm.invoice.voucherLines[i].taxable = (vm.invoice.voucherLines[i].chargesType.taxable || vm.invoice.voucherLines[i].taxable);
                        }
                    }

                }

                vm.invoice.amountInWords = '';

                vm.invoice.tax = totalTax;
                vm.invoice.amount = vm.isTaxInclusive ? utilities.round(sum, 2) : (utilities.round(sum, 2) + utilities.round(totalTax, 2)) / 1
                vm.invoice.amount = utilities.round(vm.invoice.amount, 2);
                if (vm.invoice.amount > 0) {
                    if (vm.autoCalculateAmountInWords == "true")
                        vm.invoice.amountInWords = utilities.toWords(vm.invoice.amount);
                }

                return { totalCharges: utilities.round(sum, 2), totalTax: utilities.round(totalTax, 2), totalWithTax: (utilities.round(sum, 2) + utilities.round(totalTax, 2)) / 1 };
            };

            vm.calculateTaxPerRow = function (row) {
                if (vm.invoice == null)
                    return 0;

                if (row == null)
                    return 0;

                var sum = 0;
                var totalTax = 0.0;

                //if (row.credit != null && row.module == vm.enabledModule) {
                //    if (vm.movement.agreement.taxPercent > 0) {
                //        var tax = 0;
                //        if (vm.isTaxInclusive) {   // prices are with tax. extract include tax amount which will not be added in 

                //            //equation solved from following formula... 
                //            //chargesWithoutTax + chargesWithoutTax * (taxPercent/100) = chargesWithTax
                //            var chargesWithoutTax = (row.credit * 100) / (100 + vm.movement.agreement.taxPercent);
                //            tax = utilities.round(row.credit - chargesWithoutTax, 2);
                //        } else {
                //            //prices are without tax. calculate tax and include in total
                //            tax = utilities.round(row.credit * vm.movement.agreement.taxPercent / 100, 2);
                //            // vm.tripCharges[i].charges += utilities.round(tax,2);

                //        }
                //        row.tax = tax;
                //        row.taxable = true;


                //    }
                //    else {
                //        row.tax = 0;
                //        row.taxable = (row.chargesType.taxable || row.taxable);
                //    }
                //}
                if (row.credit != null && row.module == vm.enabledModule) {
                    if (vm.movement.agreement.taxPercent > 0) {
                        var tax = 0;
                        if (row.chargesType) {
                            if (vm.isTaxInclusive) {   // prices are with tax. extract include tax amount which will not be added in 
                                //equation solved from following formula... 
                                //chargesWithoutTax + chargesWithoutTax * (taxPercent/100) = chargesWithTax
                                var chargesWithoutTax = (row.credit * 100) / (100 + vm.movement.agreement.taxPercent);
                                tax = utilities.round(row.credit - chargesWithoutTax, 2);
                            } else {
                                //prices are without tax. calculate tax and include in total
                                tax = utilities.round(row.credit * vm.movement.agreement.taxPercent / 100, 2);
                                // vm.tripCharges[i].charges += utilities.round(tax,2);

                            }
                            row.tax = tax;
                            row.taxable = true;
                        }
                        else if (row.accountId) {
                            if (vm.isTaxInclusive) {   // prices are with tax. extract include tax amount which will not be added in 
                                //equation solved from following formula... 
                                //chargesWithoutTax + chargesWithoutTax * (taxPercent/100) = chargesWithTax
                                var chargesWithoutTax = (row.credit * 100) / (100 + vm.movement.agreement.taxPercent);
                                tax = utilities.round(row.credit - chargesWithoutTax, 2);
                            } else {
                                //prices are without tax. calculate tax and include in total
                                tax = utilities.round(row.credit * vm.movement.agreement.taxPercent / 100, 2);
                                // vm.tripCharges[i].charges += utilities.round(tax,2);

                            }
                            row.tax = tax;
                            row.taxable = true;
                        }
                        //else {
                        //    row.tax = 0;
                        //    row.taxable = (row.chargesType.taxable || row.taxable);
                        //}

                    }
                    else {
                        row.tax = 0;
                        row.taxable = (row.chargesType ? row.chargesType.taxable : false) || row.taxable;
                    }
                }

                vm.sumAmountTax();
                row.amount = row.credit + row.tax;
            };

            vm.sumAmountTax = function () {

                var totalAmount = 0.0;
                var totalTax = 0.0;
                vm.invoice.voucherLines.forEach(function (value) {
                    if (value.credit > 0 || value.credit < 0)
                        totalAmount = totalAmount + parseFloat(value.credit);
                    if (value.tax > 0 || value.tax < 0) {
                        //value.taxable = true;
                        totalTax += utilities.round(value.tax, 2);
                    }
                    //else
                    //value.taxable = false;
                    value.amount = value.credit + value.tax;
                });
                vm.invoice.tax = totalTax;
                vm.invoice.amount = !vm.isTaxInclusive ? (utilities.round(totalAmount, 2) + utilities.round(totalTax, 2)) / 1 : utilities.round(totalAmount, 2);
                vm.invoice.amount = utilities.round(vm.invoice.amount, 2);
                if (vm.invoice.amount > 0) {
                    if (vm.autoCalculateAmountInWords == "true")
                        vm.invoice.amountInWords = utilities.toWords(vm.invoice.amount);
                }
            };

            vm.calculateCreditAndTax = (voucherLine) => {
                if (vm.movement.agreement.taxPercent > 0) {
                    voucherLine.credit = parseFloat(voucherLine.amount) * (100 / (100 + vm.movement.agreement.taxPercent));
                    voucherLine.tax = parseFloat(voucherLine.amount) - voucherLine.credit;
                }
                else {
                    voucherLine.credit = parseFloat(voucherLine.amount);
                    voucherLine.tax = 0;
                }

                vm.sumAmountTax();
            }

            vm.taxAcceptedChanged = function () {
                if (vm.taxAccepted)
                    vm.movement.agreement.taxPercent = vm.taxPercent;
                else
                    vm.movement.agreement.taxPercent = 0;
            };

            //Add row
            vm.addRow = function (line) {
                if (line == undefined)
                    line = invoiceLineObject();
                if (vm.movement) {
                    line.vehicle = vm.movement.vehicle;
                    line.vehicleId = vm.movement.vehicle.id;
                }
                vm.invoice.voucherLines.push(line);
                vm.calculateTaxPerRow(line);
                vm.sumAmountTax();
            };


            vm.getlocalDateTime = function (date, format) {
                if (date != null) {
                    if (format == null) format = 'YYYY-MM-DD HH:mm';

                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(format);
                } else {
                    return "";
                }
            };


            //Remove row
            vm.removeRow = function (obj) {
                var index = vm.invoice.voucherLines.indexOf(obj);
                vm.invoice.voucherLines.splice(index, 1);
                //vm.sumAmount();
                vm.sumAmountTax();
            };



            vm.searchVehicles = function ($select) {
                if ($select.search == "") { vm.vehicles = null; return null; }
                return vehicleService.searchVehicles({ plateNo: $select.search }).then(function (response) {
                    vm.vehicles = response.data.items;
                });
            };


            // Saving Invoice
            vm.save = function () {

                vm.invoice.contactId = vm.movement.contactId;
                vm.invoice.agreementId = vm.movement.agreementId;
                vm.invoice.voucherSubTypeId = 30;
                if (accident.chargingType == 2) 
                    vm.invoice.voucherSubTypeId = 57;
                isValid = true;
                var date = new Date(vm.movement.date);

                vm.invoice.date = date;
                vm.invoice.fromDate = date;
                vm.invoice.toDate = date;
                vm.invoice.taxPercent = vm.movement.agreement.taxPercent;

                vm.saving = true;
                vm.invoice.module = vm.enabledModule;
                invoiceService.createOrUpdateInvoice({
                    invoice: vm.invoice,
                    module: vm.enabledModule
                }).success(function (result) {
                    vm.invoice.id = result;
                    saveAccidentDamageInvoice();

                    //if (vm.saveAndPrint)
                    //    saveAndPrint(vm.invoice.id);
                }).finally(function () {
                    //vm.saving = false;
                });

            };

            function saveAccidentDamageInvoice() {
                vm.loading = true;
                accidentService.saveAccidentAfterCreateDamageInvoice({
                    invoiceid: vm.invoice.id,
                    id: accident.id
                }).success(function (result) {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close(true);
                }).finally(function () {
                    vm.saving = false;
                });
            }
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


            vm.agreementCategory = function (id) {
                if (id == 1)
                    return 'Rental';
                if (id == 2)
                    return 'Weekly';
                else
                    return null;
            }

            function init() {
                vm.loading = true;
                movementService.getMovement({ id: movement.id }).success(
                    function (result) {
                        vm.movement = result;
                        vm.movement.date = new Date();
                        vm.movement.agreement = accident.movement.agreement;
                        vehicleService.searchVehicles({ plateNo: vm.movement.vehicle.plateNo }).then(function (response) {
                            vm.vehicles = response.data.items;
                            vm.invoice.voucherLines[0].vehicle = vm.movement.vehicle;
                            vm.invoice.voucherLines[0].vehicleId = vm.movement.vehicle.id;
                            vm.loading = false;
                        });
                        vm.addRow();
                    });
            }

            init();
        }
    ]);
