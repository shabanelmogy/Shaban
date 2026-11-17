// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:219696-219898
appModule.controller('tenant.views.crs.equipmentSales.salesQuotation.viewModal', ['$uibModalInstance', 'utilities',
        'abp.services.app.commonLookup', 'abp.services.app.salesQuotation', 'quotationId', 'abp.services.app.chargesSetting',
        function ($uibModalInstance, utilities, lookupService, salesQuotationService, quotationId, chargesSettingService) {
            var vm = this;
            vm.customers = [];
            vm.chargesSettings = [];
            vm.revisedQuotationId = quotationId;
            var salesQuotationId = quotationId;
            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };

            vm.paymentAndAddCardInQuotation = abp.features.isEnabled('OnlinePayments.Quotation.PaymentAndAddCardInQuotation');
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.isDiscountInRentalQuotations = abp.features.isEnabled("CRS.Rental.Quotations.Discount");
            vm.invoicePerInstallment = utilities.parseBoolean(abp.setting.get("App.Speed.Common.CreateInvoicePerInstallment"));

            vm.agreementTypes = [
                { type: "Daily", id: 1 },
                { type: "Weekly", id: 2 },
                { type: "Monthly", id: 3 }
            ];

            vm.localize = function (input) {
                return app.localize(input);
            };


            vm.quotation = {
                quotationLines: []
            };

            if (quotationId)
                vm.quotation.type = 3;


            vm.extraHours = {
                chargesTypeId: 68,
                limit: 0,
                rateTypeId: 7,
            };

            vm.currencyAndRoundingWithThree = function (value) {
                if (value == null) return null;

                return value.toLocaleString('en', { minimumFractionDigits: 3, maximumFractionDigits: 3 })
            };
            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            vm.mobilizationCharges = {
                chargesTypeId: 26,
                limit: 0,
                rate: 0,
                rateTypeId: 6
            };

            vm.quotationTypes = [
                { type: vm.localize("Daily"), id: 1 },
                { type: vm.localize("Weekly"), id: 2 },
                { type: vm.localize("Monthly"), id: 3 },
                { type: vm.localize("Lease"), id: 4 },
                { type: vm.localize("LeaseToOwn"), id: 5 }
            ];

            vm.getPeriodType = function (id) {
                if (id == 1)
                    return "Days";
                if (id == 2)
                    return "Weeks";
                if (id >= 3)
                    return "Months";
            };
            var rateTypes = {
                perDay: { id: 1, name: '/Day' },
                perWeek: { id: 2, name: '/Week' },
                perMonth: { id: 3, name: '/Month' },
            };
            function getAllLocations() {
                lookupService.getLocationsActiveAndInActive({}).success(function (data) {
                    vm.locationsAll = data.items;
                });
            }
            vm.getRateType = function () {
                if (vm.quotation.type == 1) {
                    vm.rateType = rateTypes.perDay;
                }
                else if (vm.quotation.type == 2) {
                    vm.rateType = rateTypes.perWeek;
                }
                else if (vm.quotation.type >= 3) {
                    vm.rateType = rateTypes.perMonth;
                }
            };

            vm.getTariffGroups = function () {
                lookupService.getTariffGroups({}).success(function (data) {
                    vm.vehicleTypes = data.items;
                });
            };

            vm.getStatus = function (code) {
                if (code === 1)
                    return "Open";
                else if (code === 2)
                    return "Approved";
                else if (code === 3)
                    return "Rejected";
                else
                    return "Open";
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.calculateChargesForAll = (saleLines) => {
                let amount = 0.0;
                let vehiclePrice = isNaN(parseFloat(saleLines.vehiclePrice)) ? 0 : parseFloat(saleLines.vehiclePrice);
                let quantity = isNaN(parseFloat(saleLines.quantity)) ? 0 : parseFloat(saleLines.quantity);
                amount = quantity * vehiclePrice;
                saleLines.amount = amount;
                let taxRate = vm.taxPercent;
                let tax = (amount * taxRate) / 100;
                saleLines.amount = amount;
                saleLines.tax = tax;
                //saleLines.amount1Year = saleLines.amount + saleLines.tax;
                vm.calculateSums();
               // vm.updateCharges();
            };
            vm.calculateSums = function () {
                vm.sumAmount = 0;
                vm.sumTax = 0;
                vm.sumTotal = 0;

                vm.quotation.quotationLines.forEach(function (line) {
                    vm.sumAmount += isNaN(parseFloat(line.amount)) ? 0 : parseFloat(line.amount);
                    vm.sumTax += isNaN(parseFloat(line.tax)) ? 0 : parseFloat(line.tax);
                });

                vm.sumTotal = vm.sumAmount + vm.sumTax;
            };

            //vm.updateCharges = function (chargesRow) {
            //    vm.quotation.tax = 0;
            //    vm.quotation.amount = 0;
            //    if (chargesRow) {
            //        var amount = chargesRow.amount;
            //        if (chargesRow.tax) {
            //            chargesRow.total = amount + chargesRow.tax;
            //        } else {
            //            var tax = (amount * vm.taxPercent) / 100;
            //            chargesRow.tax = isNaN(tax) ? 0 : tax;
            //            chargesRow.total = isNaN(amount + tax) ? 0 : amount + tax;
            //        }
            //        chargesRow.tax = vm.rounding(chargesRow.tax);
            //        chargesRow.total = vm.rounding(chargesRow.total);
            //    }
            //    vm.quotation.quotationcharges.forEach(row => {
            //        vm.quotation.tax += isNaN(parseFloat(row.tax)) ? 0 : parseFloat(row.tax);
            //        vm.quotation.amount += isNaN(parseFloat(row.total)) ? 0 : parseFloat(row.total);
            //    });
            //    vm.quotation.tax += vm.sumTax;
            //    vm.quotation.amount += vm.sumTotal;
            //};

            function getChargesSettings() {
                vm.loading = true;

                chargesSettingService.getChargesSettings({ module: 9 }).success(function (data) {
                    vm.chargesSettings = data.items;
                    vm.quotation.charges = vm.chargesSettings;
                }).finally(function () {
                    vm.loading = false;
                });
            };
        
            function init() {
                vm.loading = true;
                getAllLocations();
      
                salesQuotationService.getQuotationForEdit({ id: salesQuotationId }).success(function (data) {

                    vm.quotation = data;
                    vm.calculateSums();
                    //vm.quotation.quotationcharges.forEach(chargesRow => {
                    //    vm.updateCharges(chargesRow);
                    //});
                    getChargesSettings();
                }).finally(function () {
                    vm.loading = false;
                });

            }

            function initQuotation() {
                vm.getTariffGroups();
                init();
            }
            initQuotation();
        }]);
