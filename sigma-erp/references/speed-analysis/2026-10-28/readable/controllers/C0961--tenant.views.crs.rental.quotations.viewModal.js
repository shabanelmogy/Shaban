// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:259564-259797
appModule.controller('tenant.views.crs.rental.quotations.viewModal', ['$uibModalInstance', 'utilities',
        'abp.services.app.commonLookup', 'abp.services.app.rentalQuotation', 'quotationId',
        function ($uibModalInstance, utilities, lookupService, rentalQuotationService, quotationId) {
            var vm = this;
            vm.customers = [];
            vm.revisedQuotationId = quotationId;
            var leaseQuotationId = quotationId;
            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };

            vm.paymentAndAddCardInQuotation = abp.features.isEnabled('OnlinePayments.Quotation.PaymentAndAddCardInQuotation');
            vm.rentalQuotationCustomField1 = utilities.parseBoolean(abp.setting.get('App.Speed.Common.RentalQuotation_CustomField1'));
            vm.rentalQuotationCustomField2 = utilities.parseBoolean(abp.setting.get('App.Speed.Common.RentalQuotation_CustomField2'));
            vm.rentalQuotationCustomField3 = utilities.parseBoolean(abp.setting.get('App.Speed.Common.RentalQuotation_CustomField3'));
            vm.rentalQuotationCustomField4 = utilities.parseBoolean(abp.setting.get('App.Speed.Common.RentalQuotation_CustomField4'));
            vm.rentalQuotationDateCustomField1 = utilities.parseBoolean(abp.setting.get('App.Speed.Common.RentalQuotation_DateCustomField1'));
            vm.rentalQuotationDateCustomField2 = utilities.parseBoolean(abp.setting.get('App.Speed.Common.RentalQuotation_DateCustomField2'));
            vm.rentalQuotationDateCustomField3 = utilities.parseBoolean(abp.setting.get('App.Speed.Common.RentalQuotation_DateCustomField3'));
            vm.isDiscountInRentalQuotations = abp.features.isEnabled("CRS.Rental.Quotations.Discount");
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.isTaxOptional = utilities.parseBoolean(abp.setting.get("App.General.IsTaxOptional"));
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
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
                //vm.loading = true;
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

            vm.calculateTaxForShow = function (line) {
                var taxSum = 0.0;
                if (vm.quotation.customer && vm.quotation.customer.isTaxExempted)
                    return line.tax;
                line.extrasLines.forEach(charge => {
                    charge.tax = 0.0;
                    if (charge.taxable && charge.accepted) {
                        if (vm.isTaxInclusive) {   // prices are with tax. extract include tax amount which will not be added in 
                            //equation solved from following formula... 
                            //chargesWithoutTax + chargesWithoutTax * (taxPercent/100) = chargesWithTax
                            var chargesWithoutTax = (charge.charges * 100) / (100 + line.taxPercent);
                            charge.tax = utilities.round(charge.charges - chargesWithoutTax, 2);

                        } else {
                            //prices are without tax. calculate tax and include in total
                            charge.tax = utilities.round(charge.charges * line.taxPercent / 100, 2);
                        }
                    }
                    taxSum += charge.tax;
                });

                return taxSum;
            };

            vm.lineCalc = function (quotationLine) {
                var totalLineCharges = 0;
                var totalLineTax = 0;
                quotationLine.extrasLines.forEach(el => {
                    if (el.accepted) {
                        let charges = 0.0;
                        let rate = isNaN(parseFloat(el.rate)) ? 0 : parseFloat(el.rate);
                        let quantity = isNaN(parseFloat(quotationLine.quantity)) ? 0 : parseFloat(quotationLine.quantity);
                        let period = isNaN(parseFloat(quotationLine.years)) ? 0 : parseFloat(quotationLine.years);
                        if (el.rateTypeId === 6) {
                            charges = quantity * rate;
                        } else if (el.rateTypeId === 1 || el.rateTypeId === 8 || el.rateTypeId === 7 || el.rateTypeId === 3 || el.rateTypeId === 2 || el.rateTypeId === 14) {
                            charges = quantity * period * rate;
                        } else if (el.rateTypeId === 4) {
                            charges = 0;
                        } else {
                            charges = rate;
                        }
                        el.charges = charges;
                        totalLineCharges += charges;
                        totalLineTax += el.tax;

                    }

                });
                quotationLine.total = totalLineCharges;
                quotationLine.totalTax = totalLineTax;

                vm.sumTotal = 0;
                vm.quotation.quotationLines.forEach(line => {
                    line.extrasLines.forEach(el => {
                        if (el.accepted) {
                            vm.sumTotal += el.charges + el.tax;

                        }

                    });
                });
                return totalLineCharges;
            };

            function init() {
                vm.loading = true;
                getAllLocations();

                //vm.getTariffGroups();
                rentalQuotationService.getQuotationForEdit({ id: leaseQuotationId }).success(function (data) {

                    vm.quotation = data;
                    if (vm.isTaxOptional) {
                        angular.forEach(vm.quotation.quotationLines, function (line) {
                            if (line.tax == 0) {
                                line.taxPercent = 0;
                            }
                            else {
                                line.taxPercent = vm.taxPercent;
                            }
                        });
                    }
                    else {
                        angular.forEach(vm.quotation.quotationLines, function (line) {
                            line.taxPercent = vm.taxPercent;
                        });
                    }
                   
                    vm.quotation.quotationLines.forEach(e => {
                        var rentRow = e.extrasLines.find(f => f.chargesTypeId == 1);
                        if (rentRow.discountPercent > 0) {
                            rentRow.discountedRate = rentRow.rate - rentRow.rate * rentRow.discountPercent / 100;
                        }
                    });


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
