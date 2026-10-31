// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:244932-245198
appModule.controller('tenant.views.crs.limousine.quotations.changeChargesModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'options', 'utilities',
        function ($scope, $uibModal, $uibModalInstance, options, utilities) {

            var vm = this;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.saving = false;
            vm.isEditMod = false;
            vm.limoFareReadOnly = false;
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.isNoOfTripsInLimoEnabled = utilities.parseBoolean(abp.setting.get("App.General.Limo.NoOfTripsInLimo"));
            vm.quantityAndRateInLimo = utilities.parseBoolean(abp.setting.get("App.General.Limo.QuantityAndRateInLimo"));

            vm.viewMode = options.viewMode;

            vm.taxPercent = options.quotation.taxPercent;
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            vm.rounding = function (amount) {
                return utilities.round(amount, 2);
            };
            vm.taxCategories = [
                {
                    id: 1, name: app.localize("Standard")
                },
                {
                    id: 2, name: app.localize("TaxExempted")
                },
                {
                    id: 3, name: app.localize("ZeroRated")
                },

            ];
            vm.taxCategoryChanged = function (row) {
                if (row.taxCategory == 2 || row.taxCategory == 3) {
                    options.trip.taxPercent = 0;
                }
                if (row.taxCategory == 1) {
                    options.trip.taxPercent = vm.taxPercent;
                }
                vm.calculateTaxPerRow(row);

            }
            vm.onChangeTaxCategory = function (row) {
                if (row.taxCategory == 2 || row.taxCategory == 3) {
                    row.tax = 0;
                }
                vm.calculateTaxPerRow(row);
            }
            vm.calculateCharges = function (row) {
                if (row.taxCategory == 2 || row.taxCategory == 3) {
                    row.tax = 0;
                }
                if (row.quantity && row.rate) {
                    row.charges = row.quantity * row.rate;
                } else {
                    row.charges = 0;
                }
                vm.calculateTaxPerRow(row);
            };
            vm.sumCharges = function () {
                if (vm.limoQuotationCharge == null) return { totalCharges: 0, totalTax: 0, totalWithTax: 0 };

                var totalCharges = 0.0;
                var totalTax = 0.0;

                for (var i = 0; i < vm.limoQuotationCharge.length; i++) {
                    if (vm.limoQuotationCharge[i].charges > 0) {
                        var tax = 0;
                        if (vm.limoQuotationCharge[i].taxable && options.quotation.taxPercent > 0) {
                            if (vm.isTaxInclusive) {   // prices are with tax. extract include tax amount which will not be added in 
                                //equation solved from following formula... 
                                //chargesWithoutTax + chargesWithoutTax * (taxPercent/100) = chargesWithTax
                                var chargesWithoutTax = (vm.limoQuotationCharge[i].charges * 100) / (100 + options.quotation.taxPercent);
                                tax = utilities.round(vm.limoQuotationCharge[i].charges - chargesWithoutTax, 2);
                                vm.limoQuotationCharge[i].tax = tax;
                                totalTax += utilities.round(tax, 2);
                            } else {

                                tax = utilities.round(vm.limoQuotationCharge[i].charges * options.quotation.taxPercent / 100, 2);
                                vm.limoQuotationCharge[i].tax = tax;
                                totalTax += utilities.round(tax, 2);

                            }
                        }
                        else {
                            vm.limoQuotationCharge[i].tax = 0;
                        }

                        totalCharges += parseFloat(vm.limoQuotationCharge[i].charges);
                    }
                    else {
                        vm.limoQuotationCharge[i].tax = 0;
                    }

                }

                options.quotation.amount = vm.isTaxInclusive ? utilities.round(totalCharges, 2) : (utilities.round(totalCharges, 2) + utilities.round(totalTax, 2)) / 1
                options.quotation.amount = utilities.round(options.quotation.amount, 2);
                options.quotation.tax = utilities.round(totalTax, 2);
                if (vm.isNoOfTripsInLimoEnabled) {
                    options.quotation.totalCharges = options.quotation.quantity * options.quotation.amount;
                }

                //return totalCharges;
                return { totalCharges: utilities.round(totalCharges, 2), totalTax: utilities.round(totalTax, 2), totalWithTax: (utilities.round(totalCharges, 2) + utilities.round(totalTax, 2)) / 1 };

            };




            vm.sumChargesTax = function () {
                if (vm.limoQuotationCharge == null) return;
                vm.totalCharges = 0;
                vm.totalTax = 0;
                vm.totalWithTax = 0;
                vm.limoQuotationCharge.forEach(function (value) {
                    if (value.charges > 0 || value.charges < 0)
                        vm.totalCharges = vm.totalCharges + parseFloat(value.charges);
                    if (value.tax > 0 || value.tax < 0) {
                        vm.totalTax += utilities.round(value.tax, 2);
                    }

                });

                options.quotation.amount = vm.isTaxInclusive ? utilities.round(vm.totalCharges, 2) : (utilities.round(vm.totalCharges, 2) + utilities.round(vm.totalTax, 2)) / 1
                options.quotation.amount = utilities.round(options.quotation.amount, 2);
                options.quotation.tax = utilities.round(vm.totalTax, 2);
                if (vm.isNoOfTripsInLimoEnabled) {
                    options.quotation.totalCharges = options.quotation.quantity * options.quotation.amount;
                }

                vm.totalCharges = utilities.round(vm.totalCharges, 2);
                vm.totalTax = utilities.round(vm.totalTax, 2);
                vm.totalWithTax = utilities.round((vm.totalCharges + vm.totalTax) / 1, 2);

                //return totalCharges;
                //return { totalCharges: utilities.round(totalCharges, 2), totalTax: utilities.round(totalTax, 2), totalWithTax: (utilities.round(totalCharges, 2) + utilities.round(totalTax, 2)) / 1 };

            };

            vm.calculateTaxPerRow = function (row) {

                if (vm.limoQuotationCharge == null) return;

                var totalCharges = 0.0;
                var totalTax = 0.0;
                if (row.charges > 0) {
                    var tax = 0;
                    if (row.taxable && options.quotation.taxPercent > 0) {
                        if (vm.isTaxInclusive) {   // prices are with tax. extract include tax amount which will not be added in 
                            //equation solved from following formula... 
                            //chargesWithoutTax + chargesWithoutTax * (taxPercent/100) = chargesWithTax
                            var chargesWithoutTax = (row.charges * 100) / (100 + options.quotation.taxPercent);
                            tax = utilities.round(row.charges - chargesWithoutTax, 2);
                            row.tax = tax;
                            if (vm.quantityAndRateInLimo && (row.taxCategory == 2 || row.taxCategory == 3)) {
                                row.tax = 0;
                            }
                        } else {

                            tax = utilities.round(row.charges * options.quotation.taxPercent / 100, 2);
                            row.tax = tax;
                            if (vm.quantityAndRateInLimo && (row.taxCategory == 2 || row.taxCategory == 3)) {
                                row.tax = 0;
                            }
                        }
                    }
                    else {
                        if (vm.quantityAndRateInLimo && (row.taxCategory != 2 && row.taxCategory != 3)) {
                            if (vm.isTaxInclusive) {
                                var chargesWithoutTax = (row.charges * 100) / (100 + options.quotation.taxPercent);
                                tax = utilities.round(row.charges - chargesWithoutTax, 2);
                                row.tax = tax;
                            } else {
                                tax = utilities.round(row.charges * options.quotation.taxPercent / 100, 2);
                                row.tax = tax;
                            }
                        }
                        else {
                            row.tax = 0;
                        }
                    }

                }
                else {
                    row.tax = 0;
                }
                vm.sumChargesTax();

            };


            vm.calculationDetail = function (chargesType) {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/limousine/trips/chargesTypeCalcDetailModal.cshtml',
                    controller: 'tenant.views.crs.limousine.trips.chargesTypeCalcDetailModal as vm',
                    backdrop: 'static',
                    resolve: {
                        chargesType: function () {
                            return chargesType;
                        },
                        viewMode: function () {
                            return vm.viewMode;
                        }
                    }
                }).result.then(function (limoFareRow) {
                    var limofare = vm.limoQuotationCharge.filter(e => e.chargesTypeId == 24)[0];
                    limofare.charges = 0.0;
                    angular.forEach(limoFareRow.calcDetail, function (item) {
                        limofare.charges += item.charges;
                    });
                    vm.calculateTaxPerRow(limofare);
                });
            };

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            vm.localize = function (input) {
                return app.localize(input);
            };

            vm.save = function () {
                vm.saving = true;
                $uibModalInstance.close();
                vm.saving = false;
            }

            vm.showCalculationDetail = function (row) {
                var calculationDetail = JSON.parse(row.calcDetail);
            };

            function init() {

                vm.loading = true;
                vm.limoQuotationCharge = options.quotation.limoQuotationCharge;
                vm.limoQuotationCharge.forEach(function (value) {
                    value.isRoundTrip = options.quotation.isRoundTrip;
                    if (value.chargesTypeId == 24)
                        value.quantity = 1;
                        vm.limoFareReadOnly = true;
                });

                vm.limoFareTotal = 0.0;
                var limofare = vm.limoQuotationCharge.filter(e => e.chargesTypeId == 24)[0];
                angular.forEach(limofare.calcDetail, function (item) {
                    vm.limoFareTotal += item.charges;
                });


                vm.sumChargesTax();
                vm.loading = false;
            }
            init();
        }
    ]);
