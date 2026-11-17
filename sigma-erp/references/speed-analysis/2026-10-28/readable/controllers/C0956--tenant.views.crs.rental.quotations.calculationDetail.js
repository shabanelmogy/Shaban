// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:257545-257787
appModule.controller('tenant.views.crs.rental.quotations.calculationDetail', ['$uibModal', '$uibModalInstance', 'utilities', 'quotationLine', 'quotation', 'viewMode', 'tariffHelper',
        function ($uibModal, $uibModalInstance, utilities, quotationLine, quotation, viewMode, tariffHelper) {
            var vm = this;
            vm.viewMode = viewMode;
            vm.quotationLine = quotationLine;
            vm.quotation = quotation;
            vm.years = [];
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            
            vm.taxAccepted = false;
            var noOfYears = Math.ceil(vm.quotationLine.years);
            vm.discountAuthCode = null;
            vm.quotationLine.tax = 0.0;
            vm.isUserWiseDiscountEnable = abp.features.isEnabled("CRS.UserWiseDiscount");

            vm.disableRate = function (chargesRow) {
                //if (chargesRow.tariff.length > 1) {

                //    var foundLine = chargesRow.tariff
                //        .find(e => e.included == chargesRow.included
                //            && e.rate == chargesRow.rate
                //            && e.excessRate == chargesRow.excessRate
                //            && e.limit == chargesRow.limit);

                //    if (foundLine)
                //        return foundLine.rate > 0;
                //    else
                        return false;
                //}

                //return chargesRow.tariff[0].rate > 0;
            };

            vm.tariffOptionSelected = function (chargesRow, tariffLine) {
                chargesRow.included = tariffLine.included;
                chargesRow.rate = tariffLine.rate;
                chargesRow.excessRate = tariffLine.excessRate;
                chargesRow.limit = tariffLine.limit;
            };

            vm.includedChanged = function (chargesRow) {
                if (chargesRow.included)
                    chargesRow.rate = 0;
            };

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
            vm.calculate = function (line) {

                if (line.years == null || line.quantity == null || line.vehiclePrice == null)
                    return;

                //if (line.costLines.length == 0) {
                //    vm.costingParameters.forEach(function (row) {
                //        line.costLines.push({
                //            costParam: row,
                //            costParamId: row.id,
                //            detail: ''
                //        });
                //    });
                //}



                var years = parseFloat(line.years);
                var quantity = parseFloat(line.quantity);
                var vehiclePrice = parseFloat(line.vehiclePrice);

                if (years <= 0 || quantity <= 0 || vehiclePrice <= 0)
                    return;

                var cost = 0.0;
                var i = 0;

                //for (i = 0; i < line.costLines.length; i++) {
                //    if (line.costLines[i].rateTypeId == 14) { // /year
                //        line.costLines[i].amount = utilities.round(line.costLines[i].rate * years, 0);

                //    } else { // % /year
                //        line.costLines[i].amount = utilities.round(vehiclePrice * line.costLines[i].rate / 100 * years, 0);
                //    }

                //    cost += line.costLines[i].amount;
                //}

                //for (i = 0; i < line.costLines.length; i++) {
                //    var costLineAmount = 0.0;
                //    var description = '';
                //    for (j = 1; j <= years; j++) {

                //        var filteredRow;
                //        for (k = 0; k < line.costDetailLoaded.length; k++) {
                //            if (line.costDetailLoaded[k].costParamId == line.costLines[i].costParamId && j >= line.costDetailLoaded[k].from && j <= line.costDetailLoaded[k].to) {
                //                filteredRow = line.costDetailLoaded[k];
                //                break;
                //            }
                //        }
                //        if (filteredRow.rateTypeId == 14) { // /year
                //            costLineAmount = costLineAmount + utilities.round(filteredRow.rate, 0);
                //            description = description + 'Year' + j + ': ' + filteredRow.rate + filteredRow.rateType.name + ','

                //        } else { // % /year
                //            costLineAmount = costLineAmount + utilities.round(vehiclePrice * filteredRow.rate / 100, 0);
                //            description = description + 'Year' + j + ': ' + filteredRow.rate + filteredRow.rateType.name + ','
                //        }

                //    }

                //    line.costLines[i].amount = costLineAmount;
                //    line.costLines[i].detail = description;
                //    cost += line.costLines[i].amount;
                //}

                var extras = 0.0;

                for (i = 0; i <= line.extrasLines.length - 1; i++) {
                    if (line.extrasLines[i].accepted && line.extrasLines[i].rate)
                        line.extrasLines[i].charges = parseFloat(line.extrasLines[i].rate) * parseFloat(line.years);
                    else
                        line.extrasLines[i].charges = 0;

                    extras += line.extrasLines[i].charges;
                }

                //  line.cost = cost;
                line.extras = extras;
                //line.markup = utilities.round((parseFloat(line.cost) + parseFloat(line.extras)) * line.profitMarkup / 100, 0);
                line.markup = utilities.round((parseFloat(line.cost)) * line.profitMarkup / 100, 0);
                line.amountPerVehicle = parseFloat(line.cost) + parseFloat(line.extras) + line.markup;
                line.amountPerMonth = utilities.round(line.amountPerVehicle / years / 12, 2);
                line.total = utilities.round(line.amountPerVehicle * quantity, 0);
                line.amount = line.total;


                if (vm.isTaxInclusive) {   // prices are with tax. extract include tax amount which will not be added in 
                    //equation solved from following formula... 
                    //chargesWithoutTax + chargesWithoutTax * (taxPercent/100) = chargesWithTax
                    var chargesWithoutTax = (line.amount * 100) / (100 + vm.quotation.taxPercent);
                    tax = utilities.round(line.amount - chargesWithoutTax, 2);

                } else {
                    //prices are without tax. calculate tax and include in total
                    tax = utilities.round(line.amount * vm.quotation.taxPercent / 100, 2);

                }

                line.tax = tax;

            };

            vm.calculateTax = function () {
                vm.quotationLine.tax = 0.0;
                if (vm.quotation.customer && vm.quotation.customer.isTaxExempted)
                    return vm.quotationLine.tax;
                vm.quotationLine.extrasLines.forEach(charge => {
                    charge.tax = 0.0;
                    if (charge.taxable && charge.accepted) {
                        if (vm.isTaxInclusive) {   // prices are with tax. extract include tax amount which will not be added in 
                            //equation solved from following formula... 
                            //chargesWithoutTax + chargesWithoutTax * (taxPercent/100) = chargesWithTax
                            var chargesWithoutTax = (charge.rate * 100) / (100 + vm.quotation.taxPercent);
                            charge.tax = utilities.round(charge.rate - chargesWithoutTax, 2);

                        } else {
                            //prices are without tax. calculate tax and include in total
                            charge.tax = utilities.round(charge.rate * vm.quotation.taxPercent / 100, 2);
                        }
                    }
                    vm.quotationLine.tax += charge.tax;
                });

                return vm.quotationLine.tax;
            };

            //vm.applyDiscount = function (chargesRow) {

            //    openApplyDiscountModal(chargesRow);
            //};

            vm.taxAcceptedChanged = function () {
                if (vm.taxAccepted)
                    vm.quotation.taxPercent = vm.quotation.taxPercent;
                else
                    vm.quotation.taxPercent = 0;
            };

            //function openApplyDiscountModal(chargesRow) {

            //    var modalInstance = $uibModal.open({
            //        templateUrl: '~/App/tenant/views/crs/discountCodes/applyDiscountModal.cshtml',
            //        controller: 'tenant.views.crs.discountCodes.applyDiscountModal as vm',
            //        backdrop: 'static',
            //        resolve: {
            //            options: function () {
            //                return {
            //                    chargesRow: chargesRow,
            //                    discountAuthCode: vm.discountAuthCode,
            //                    isDiscountFromQuotation: true
            //                };
            //            }
            //        }
            //    });
            //    modalInstance.result.then(function (result) {
            //        vm.discountAuthCode = result.discountAuthCode;
            //        chargesRow.discountPercent = result.chargesRow.discountPercent;
            //        chargesRow.discountedRate = result.chargesRow.discountedRate;
            //        chargesRow.rate = chargesRow.discountedRate > chargesRow.rate ? chargesRow.discountedRate : chargesRow.rate;
            //    });
            //}

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            var agreementCategory = 1; // rental
            var groupId = vm.quotationLine.vehicleTypeId;
            var duration = vm.quotationLine.quantity;
            vm.loading = false;

            //(() => {
            //    vm.loading = true;

            //    tariffHelper.loadTariff(groupId, agreementCategory, function () {
            //        vm.loading = false;

            //        tariffHelper.applyTariffOnRentalQuotation(vm.quotationLine.extrasLines,duration);
            //    }, null);
            //})();

        }]);
