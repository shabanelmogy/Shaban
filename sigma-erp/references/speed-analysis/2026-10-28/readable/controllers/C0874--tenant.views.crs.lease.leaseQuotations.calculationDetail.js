// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:238449-238578
appModule.controller('tenant.views.crs.lease.leaseQuotations.calculationDetail', ['$uibModalInstance', 'utilities', 'quotationLine', 'taxPercent', 'costingParameters', 'viewMode',
        function ($uibModalInstance, utilities, quotationLine, taxPercent, costingParameters, viewMode) {
            var vm = this;
            vm.viewMode = viewMode;
            vm.quotationLine = quotationLine;
            vm.years = [];
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
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
                line.amount3Year =  parseFloat(line.cost) + parseFloat(line.extras) + line.markup;
                line.amount2Year = utilities.round(line.amount3Year / years / 12, 2);
                line.total = utilities.round(line.amount3Year * quantity, 0);
                line.amount1Year = line.total;


                if (vm.isTaxInclusive) {   // prices are with tax. extract include tax amount which will not be added in 
                    //equation solved from following formula... 
                    //chargesWithoutTax + chargesWithoutTax * (taxPercent/100) = chargesWithTax
                    var chargesWithoutTax = (line.amount1Year * 100) / (100 + taxPercent);
                    tax = utilities.round(line.amount1Year - chargesWithoutTax, 2);

                } else {
                    //prices are without tax. calculate tax and include in total
                    tax = utilities.round(line.amount * taxPercent / 100, 2);

                }

                line.tax = tax;
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
        }]);
