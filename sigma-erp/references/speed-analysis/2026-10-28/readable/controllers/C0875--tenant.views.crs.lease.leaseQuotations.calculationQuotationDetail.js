// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:238581-238885
appModule.controller('tenant.views.crs.lease.leaseQuotations.calculationQuotationDetail', ['$uibModalInstance', 'utilities', 'quotationLine', 'taxPercent', 'costingParameters', 'viewMode', 'abp.services.app.costSetting',
        function ($uibModalInstance, utilities, quotationLine, taxPercent, costingParameters, viewMode, costSettingService) {
            var vm = this;
            vm.viewMode = viewMode;
            vm.quotationLine = angular.copy(quotationLine);
            vm.years = [];
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.isPostTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.PostTaxInclusive"));
            vm.taxPercentage = abp.setting.get("App.General.TaxPercentage");
            vm.permissions = {
                manageVehiceCost: abp.auth.hasPermission('Pages.Tenant.Lease.CostSettings.ManageVehicleCost'),
            };

            vm.costingParameters = costingParameters;
            var noOfYears = Math.ceil(vm.quotationLine.years);
            for (var i = 1; i <= noOfYears; i++) {
                vm.years.push({ year: i });
            }

            vm.includedChanged = function (chargesRow) {
                if (chargesRow.included)
                    chargesRow.rate = 0;
                else
                    chargesRow.rate = chargesRow.tariffRate;

                vm.calculate(vm.quotationLine);
            };
            vm.localize = function (input) {
                return app.localize(input);
            };
            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                //return amount.toLocaleString('en');
                return amount.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            };
            vm.currencyAndRounding = function (value) {
                if (value == null) return null;

                return value.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            };
            //vm.calculate = function (line) {

            //    if (line.years === null || line.quantity === null || line.vehiclePrice === null)
            //        return;

            //    //if (line.costLines.length == 0) {
            //    //    vm.costingParameters.forEach(function (row) {
            //    //        line.costLines.push({
            //    //            costParam: row,
            //    //            costParamId: row.id,
            //    //            detail: ''
            //    //        });
            //    //    });
            //    //}



            //    var years = parseFloat(line.years);
            //    var quantity = parseFloat(line.quantity);
            //    var vehiclePrice = parseFloat(line.vehiclePrice);

            //    if (years <= 0 || quantity <= 0 || vehiclePrice <= 0)
            //        return;

            //    var cost = 0.0;
            //    var i = 0;

            //    //for (i = 0; i < line.costLines.length; i++) {
            //    //    if (line.costLines[i].rateTypeId == 14) { // /year
            //    //        line.costLines[i].amount = utilities.round(line.costLines[i].rate * years, 0);

            //    //    } else { // % /year
            //    //        line.costLines[i].amount = utilities.round(vehiclePrice * line.costLines[i].rate / 100 * years, 0);
            //    //    }

            //    //    cost += line.costLines[i].amount;
            //    //}

            //    //for (i = 0; i < line.costLines.length; i++) {
            //    //    var costLineAmount = 0.0;
            //    //    var description = '';
            //    //    for (j = 1; j <= years; j++) {

            //    //        var filteredRow;
            //    //        for (k = 0; k < line.costDetailLoaded.length; k++) {
            //    //            if (line.costDetailLoaded[k].costParamId == line.costLines[i].costParamId && j >= line.costDetailLoaded[k].from && j <= line.costDetailLoaded[k].to) {
            //    //                filteredRow = line.costDetailLoaded[k];
            //    //                break;
            //    //            }
            //    //        }
            //    //        if (filteredRow.rateTypeId == 14) { // /year
            //    //            costLineAmount = costLineAmount + utilities.round(filteredRow.rate, 0);
            //    //            description = description + 'Year' + j + ': ' + filteredRow.rate + filteredRow.rateType.name + ','

            //    //        } else { // % /year
            //    //            costLineAmount = costLineAmount + utilities.round(vehiclePrice * filteredRow.rate / 100, 0);
            //    //            description = description + 'Year' + j + ': ' + filteredRow.rate + filteredRow.rateType.name + ','
            //    //        }

            //    //    }

            //    //    line.costLines[i].amount = costLineAmount;
            //    //    line.costLines[i].detail = description;
            //    //    cost += line.costLines[i].amount;
            //    //}

            //    //var extras = 0.0;

            //    //for (i = 0; i <= line.extrasLines.length - 1; i++) {
            //    //    if (line.extrasLines[i].accepted && line.extrasLines[i].rate)
            //    //        line.extrasLines[i].charges = parseFloat(line.extrasLines[i].rate) * parseFloat(line.years);
            //    //    else
            //    //        line.extrasLines[i].charges = 0;

            //    //    extras += line.extrasLines[i].charges;
            //    //}

            //    ////  line.cost = cost;
            //    //line.extras = extras;
            //    //line.markup = utilities.round((parseFloat(line.cost) + parseFloat(line.extras)) * line.profitMarkup / 100, 0);
            //    line.markup = utilities.round((parseFloat(line.cost)) * line.profitMarkup / 100, 0);
            //    line.amountPerVehicle =  parseFloat(line.cost) + parseFloat(line.extras) + line.markup;
            //    line.amountPerMonth = utilities.round(line.amountPerVehicle / years / 12, 2);
            //    line.total = utilities.round(line.amountPerVehicle * quantity, 0);
            //    line.amount = line.total;


            //    if (vm.isTaxInclusive) {   // prices are with tax. extract include tax amount which will not be added in 
            //        //equation solved from following formula... 
            //        //chargesWithoutTax + chargesWithoutTax * (taxPercent/100) = chargesWithTax
            //        var chargesWithoutTax = (line.amount * 100) / (100 + taxPercent);
            //        tax = utilities.round(line.amount - chargesWithoutTax, 2);

            //    } else {
            //        //prices are without tax. calculate tax and include in total
            //        tax = utilities.round(line.amount * taxPercent / 100, 2);

            //    }

            //    line.tax = tax;
            //};

            vm.calculateEmi = function () {
                var taxPercent = vm.taxPercentage; // should be forwaded from leaseQuotation get it from settings
                var quotationLine = vm.quotationLine;
                //quotationLine.profitMarkup = 0;
                //quotationLine.vehiclePrice = 100;
                if (!quotationLine.years || !quotationLine.quantity || !quotationLine.vehiclePrice)
                    return;

                if (quotationLine.costLines.length == 0) {
                    vm.costingParameters.forEach(function (row) {
                        quotationLine.costLines.push({
                            costParam: row,
                            costParamId: row.id,
                            detail: ''
                        });
                    });
                }

                var years = parseFloat(quotationLine.years);
                var quantity = parseFloat(quotationLine.quantity);
                var vehiclePrice = !quotationLine.vehiclePrice ? 100 : parseFloat(quotationLine.vehiclePrice);

                if (years <= 0 || quantity <= 0 /*|| vehiclePrice <= 0*/)
                    return;

                var cost = 0.0;
                var i = 0;
                var tax = 0.0;
                var bookValues = [vehiclePrice];

                for (i = 0; i < quotationLine.costLines.length; i++) {
                    var costLineAmount = 0.0;
                    var description = '';

                    for (j = 1; j <= years; j++) {
                        var filteredRow = null;
                        if (quotationLine.costDetailLoaded != null) {
                            for (k = 0; k < quotationLine.costDetailLoaded.length; k++) {
                                if (quotationLine.costDetailLoaded[k].costParamId == quotationLine.costLines[i].costParamId && j >= quotationLine.costDetailLoaded[k].from && (j <= quotationLine.costDetailLoaded[k].to || quotationLine.costDetailLoaded[k].to == 0)) {
                                    filteredRow = quotationLine.costDetailLoaded[k];
                                    break;
                                }
                            }
                        }

                        if (filteredRow && filteredRow.rateTypeId == 14) { // /year
                            costLineAmount = costLineAmount + utilities.round(filteredRow.rate, 0);
                            description = description + 'Year ' + j + ': ' + vm.CurrencyFormate(filteredRow.rate) + ' ' + app.localize(filteredRow.rateType.name) + ', '

                        } else if (filteredRow && filteredRow.rateTypeId == 15) { // % /year
                            costLineAmount = costLineAmount + utilities.round(vehiclePrice * filteredRow.rate / 100, 0);
                            description = description + 'Year ' + j + ': ' + vm.CurrencyFormate(filteredRow.rate) + ' ' + app.localize(filteredRow.rateType.name) + ', '

                        } else if (filteredRow && filteredRow.rateTypeId == 6 && j == 1) { //one time (charge once only)
                            costLineAmount = utilities.round(filteredRow.rate, 0);
                            description = vm.CurrencyFormate(filteredRow.rate) + ' ' + app.localize(filteredRow.rateType.name)

                        } else if (filteredRow && filteredRow.rateTypeId == 16 && j == 1) { //percent of above (cost calculated so far)
                            costLineAmount = utilities.round(cost * filteredRow.rate / 100, 0);
                            description = vm.CurrencyFormate(filteredRow.rate) + ' ' + app.localize(filteredRow.rateType.name) + ' (' + vm.CurrencyFormate(cost) + ')';

                        } else if (filteredRow && filteredRow.rateTypeId == 17) { //percent of Book Values on start of years
                            if (bookValues.length >= j) {
                                var bookValue = bookValues[j - 1];
                                costLineAmount = costLineAmount + utilities.round(bookValue * filteredRow.rate / 100, 0);
                                description = description + 'Year ' + j + ': ' + vm.CurrencyFormate(filteredRow.rate) + ' ' + app.localize(filteredRow.rateType.name) + ' (' + vm.CurrencyFormate(bookValue) + ')' + ', ';
                            }

                        }

                        if (quotationLine.costLines[i].costParam.name.includes("Depreciation")) {
                            bookValues.push(vehiclePrice - costLineAmount);
                        }
                    }
                    quotationLine.costLines[i].amount = costLineAmount;
                    quotationLine.costLines[i].detail = description;


                    cost += quotationLine.costLines[i].amount;
                }

                var extras = 0.0;

                //for (i = 0; i <= quotationLine.extrasLines.length - 1; i++) {
                //    if (quotationLine.extrasLines[i].accepted && quotationLine.extrasLines[i].rate)
                //        quotationLine.extrasLines[i].charges = parseFloat(quotationLine.extrasLines[i].rate) * parseFloat(quotationLine.years);
                //    else
                //        quotationLine.extrasLines[i].charges = 0;

                //    extras += quotationLine.extrasLines[i].charges;
                //}

                quotationLine.cost = cost;
                quotationLine.extras = extras;
                //quotationLine.markup = utilities.round((parseFloat(quotationLine.vehiclePrice) + parseFloat(quotationLine.cost) + parseFloat(quotationLine.extras)) * quotationLine.profitMarkup / 100, 0);
                //quotationLine.markup = utilities.round((parseFloat(quotationLine.cost) + parseFloat(quotationLine.extras)) * quotationLine.profitMarkup / 100, 0);
                quotationLine.markup = utilities.round((parseFloat(quotationLine.cost)) * quotationLine.profitMarkup / 100, 2);
                //quotationLine.amountPerVehicle = parseFloat(quotationLine.vehiclePrice) + parseFloat(quotationLine.cost) + parseFloat(quotationLine.extras) + quotationLine.markup;
                quotationLine.amount3Year = parseFloat(quotationLine.cost) + parseFloat(quotationLine.extras) + quotationLine.markup;
                quotationLine.amount2Year = utilities.round(quotationLine.amount3Year / years / 12, 2);
                quotationLine.total = utilities.round(quotationLine.amount3Year * quantity, 2);
                quotationLine.amount1Year = utilities.round(quotationLine.total, 2);



                if (vm.isTaxInclusive) {   // prices are with tax. extract include tax amount which will not be added in 
                    //equation solved from following formula... 
                    //chargesWithoutTax + chargesWithoutTax * (taxPercent/100) = chargesWithTax
                    var chargesWithoutTax = (quotationLine.amount2Year * 100) / (100 + taxPercent);
                    tax = utilities.round(quotationLine.amount2Year - chargesWithoutTax, 2);

                } else {
                    //prices are without tax. calculate tax and include in total
                    tax = utilities.round(quotationLine.amount2Year * taxPercent / 100, 2);

                }

                quotationLine.tax = tax;

                quotationLine.amount2Year = quotationLine.amount2Year + tax;

                //line.tax = quotationLine.tax;

                //if (quotationLine.years == 1) {
                //    line.amount = quotationLine.amountPerMonth;
                //}
                //else if (quotationLine.years == 2) {
                //    line.amountPerMonth = quotationLine.amountPerMonth;
                //}
                //else if (quotationLine.years == 3) {
                //    line.amountPerVehicle = quotationLine.amountPerMonth;
                //}

                // vm.sum();
            };

            vm.ok = function () {
                $uibModalInstance.close({
                    tax: vm.quotationLine.tax,
                    amount: utilities.round(vm.quotationLine.amount2Year,2),
                    vehiclePrice: vm.quotationLine.vehiclePrice,
                    years: noOfYears
                });
            };
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.modelSelected = function (line) {
                vm.loading = true;
                costSettingService.getCostSettingByModel({ id: line.vehicleModel.id }).success(function (data) {
                    vm.quotationLine.costDetailLoaded = data.settingLines;
                    vm.quotationLine.costLines = [];
                    vm.quotationLine.profitMarkup = data.markupPercent;
                    vm.quotationLine.vehiclePrice = data.vehiclePrice;
                    vm.calculateEmi();
                }).finally(function () {
                    vm.loading = false;
                });
            }

            vm.modelSelected(vm.quotationLine);
        }]);
