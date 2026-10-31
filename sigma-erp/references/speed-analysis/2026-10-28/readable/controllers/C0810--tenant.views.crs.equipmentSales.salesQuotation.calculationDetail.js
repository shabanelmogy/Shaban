// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:217694-217828
appModule.controller('tenant.views.crs.equipmentSales.salesQuotation.calculationDetail', ['$uibModal', '$uibModalInstance', 'utilities', 'quotationLine', 'quotation', 'viewMode', 'tariffHelper',
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
              return false;
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

               
                var years = parseFloat(line.years);
                var quantity = parseFloat(line.quantity);
                var vehiclePrice = parseFloat(line.vehiclePrice);

                if (years <= 0 || quantity <= 0 || vehiclePrice <= 0)
                    return;

                var cost = 0.0;
                var i = 0;

                var extras = 0.0;

                for (i = 0; i <= line.extrasLines.length - 1; i++) {
                    if (line.extrasLines[i].accepted && line.extrasLines[i].rate)
                        line.extrasLines[i].charges = parseFloat(line.extrasLines[i].rate) * parseFloat(line.years);
                    else
                        line.extrasLines[i].charges = 0;

                    extras += line.extrasLines[i].charges;
                }

                line.extras = extras;
                line.markup = utilities.round((parseFloat(line.cost)) * line.profitMarkup / 100, 0);
                line.amountPerVehicle = parseFloat(line.cost) + parseFloat(line.extras) + line.markup;
                line.amountPerMonth = utilities.round(line.amountPerVehicle / years / 12, 2);
                line.total = utilities.round(line.amountPerVehicle * quantity, 0);
                line.amount = line.total;


                if (vm.isTaxInclusive) {   // prices are with tax. extract include tax amount which will not be added in 
                    var chargesWithoutTax = (line.amount * 100) / (100 + vm.quotation.taxPercent);
                    tax = utilities.round(line.amount - chargesWithoutTax, 2);

                } else {
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
                            var chargesWithoutTax = (charge.rate * 100) / (100 + vm.quotation.taxPercent);
                            charge.tax = utilities.round(charge.rate - chargesWithoutTax, 2);

                        } else {
                            charge.tax = utilities.round(charge.rate * vm.quotation.taxPercent / 100, 2);
                        }
                    }
                    vm.quotationLine.tax += charge.tax;
                });

                return vm.quotationLine.tax;
            };

            
            vm.taxAcceptedChanged = function () {
                if (vm.taxAccepted)
                    vm.quotation.taxPercent = vm.quotation.taxPercent;
                else
                    vm.quotation.taxPercent = 0;
            };

            

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            var agreementCategory = 1; // rental
            var groupId = vm.quotationLine.vehicleTypeId;
            var duration = vm.quotationLine.quantity;
            vm.loading = false;

        }]);
