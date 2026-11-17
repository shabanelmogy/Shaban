// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:247994-248475
appModule.controller('tenant.views.crs.limousine.trips.changeChargesModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.limoTrip', 'options', 'utilities', 'appSession', 'abp.services.app.commonLookup',
        function ($scope, $uibModal, $uibModalInstance, limoTripsService, options, utilities, appSession, commonLookupService) {

            var vm = this;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.saving = false;
            vm.isEditMod = false;
            vm.limoFareReadOnly = false;
            vm.isTaxCodeEnabled = abp.features.isEnabled("CRS.TaxCodes");
            //vm.allowTaxEditingInLimoTrip = utilities.parseBoolean(abp.setting.get("App.General.Limo.AllowTaxEditingInLimoTrip"));
            vm.allowTaxEditingInLimoTrip = true;
            vm.branchTaxPercentage = null;
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.viewMode = options.viewMode;
            vm.customerTaxRule = options.customerTaxRule;
            vm.isTaxLockedDueToCustomerRule = (vm.customerTaxRule === 2);
            vm.isLimoDiscountEnabled = utilities.parseBoolean(abp.setting.get("App.General.Limo.LimoDiscount"));
            vm.quantityAndRateInLimo = utilities.parseBoolean(abp.setting.get("App.General.Limo.QuantityAndRateInLimo"));
            vm.descriptionColumnInChargesCalculator = utilities.parseBoolean(abp.setting.get("App.General.Limo.DescriptionColumnInChargesCalculator"));
            vm.taxPercent = options.trip.taxPercent;
            vm.dontRecalculateChargesOnTripFinish = utilities.parseBoolean(abp.setting.get("App.General.DontRecalculateChargesOnTripFinish"));

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
                    row.taxable = false;
                    if (row.chargesTypeId == 24) {
                        var discountRow = vm.tripCharges.find(item => item.chargesTypeId == 22);
                        if (discountRow) {
                            discountRow.taxable = false;
                        }
                    }
                }
                else {
                    row.taxable = true;
                    if (row.chargesTypeId == 24) {
                        var discountRow = vm.tripCharges.find(item => item.chargesTypeId == 22);
                        if (discountRow) {
                            discountRow.taxable = true;
                        }
                    }
                }
                if (vm.quantityAndRateInLimo) {
                    if (row.chargesTypeId == 24) {
                        var discountRow = vm.tripCharges.find(item => item.chargesTypeId == 22);
                        if (discountRow) {
                            discountRow.taxCategory = row.taxCategory; // Sync tax category
                            vm.calculateTaxPerRow(discountRow); // Recalculate tax
                        }
                    }
                }
                vm.calculateTaxPerRow(row);
            }

            vm.sumCharges = function () {
                if (vm.tripCharges == null) return { totalCharges: 0, totalTax: 0, totalWithTax: 0 };

                var totalCharges = 0.0;
                var totalTax = 0.0;

                for (var i = 0; i < vm.tripCharges.length; i++) {
                    if (vm.tripCharges[i].charges > 0) {
                        var tax = 0;
                        if (vm.tripCharges[i].taxable && options.trip.taxPercent > 0) {
                            if (vm.isTaxInclusive) {   // prices are with tax. extract include tax amount which will not be added in 
                                //equation solved from following formula... 
                                //chargesWithoutTax + chargesWithoutTax * (taxPercent/100) = chargesWithTax
                                var chargesWithoutTax = (vm.tripCharges[i].charges * 100) / (100 + options.trip.taxPercent);
                                tax = utilities.round(vm.tripCharges[i].charges - chargesWithoutTax, 2);
                                vm.tripCharges[i].tax = tax;
                                totalTax += utilities.round(tax, 2);
                            } else {

                                tax = utilities.round(vm.tripCharges[i].charges * options.trip.taxPercent / 100, 2);
                                vm.tripCharges[i].tax = tax;
                                totalTax += utilities.round(tax, 2);

                            }
                        }
                        else {
                            vm.tripCharges[i].tax = 0;
                        }

                        totalCharges += parseFloat(vm.tripCharges[i].charges);
                    }
                    else {
                        vm.tripCharges[i].tax = 0;
                    }

                }

                options.trip.charges = vm.isTaxInclusive ? utilities.round(totalCharges, 2) : (utilities.round(totalCharges, 2) + utilities.round(totalTax, 2)) / 1
                options.trip.charges = utilities.round(options.trip.charges, 2);
                options.trip.tax = utilities.round(totalTax, 2);

                //return totalCharges;
                return { totalCharges: utilities.round(totalCharges, 2), totalTax: utilities.round(totalTax, 2), totalWithTax: (utilities.round(totalCharges, 2) + utilities.round(totalTax, 2)) / 1 };

            };

            vm.sumChargesTax = function () {
                if (vm.tripCharges == null) return;

                vm.totalCharges = 0;
                vm.totalTax = 0;
                vm.totalWithTax = 0;

                vm.tripCharges.forEach(function (value) {

                    // Discount charges should always be negative
                    if (value.chargesTypeId == 22 && value.charges > 0) {
                        value.charges = -value.charges;
                    }

                    if (value.charges > 0 || value.charges < 0) {
                        vm.totalCharges += parseFloat(value.charges);
                    }

                    // Discount tax should always be negative
                    if (value.chargesTypeId == 22 && value.tax > 0) {
                        value.tax = -value.tax;
                    }

                    if (value.tax > 0 || value.tax < 0) {
                        vm.totalTax += utilities.round(value.tax, 2);
                    }
                });

                options.trip.charges = vm.isTaxInclusive
                    ? utilities.round(vm.totalCharges, 2)
                    : (
                        utilities.round(vm.totalCharges, 2) +
                        utilities.round(vm.totalTax, 2)
                    ) / 1;

                options.trip.charges = utilities.round(options.trip.charges, 2);
                options.trip.tax = utilities.round(vm.totalTax, 2);

                vm.totalCharges = utilities.round(vm.totalCharges, 2);
                vm.totalTax = utilities.round(vm.totalTax, 2);
                vm.totalWithTax = utilities.round(
                    (vm.totalCharges + vm.totalTax) / 1,
                    2
                );
            };
            vm.calculateCharges = function (row) {
                if (row.taxCategory == 2 || row.taxCategory == 3) {
                    row.tax = 0;
                }
                if (row.rate) {
                    if (row.quantity == 0) {
                        row.quantity = 1;
                    }
                }
                if (row.quantity && row.rate) {
                    row.charges = row.quantity * row.rate;
                } else {
                    row.charges = 0;
                }
                if (row.chargesTypeId == 22 && row.charges > 0) {
                    row.charges = -row.charges;
                }
                vm.calculateTaxPerRow(row);
                vm.calculateDiscountCharges(row);
            };

            vm.calculateDiscountCharges = function (row) {
                if (vm.isLimoDiscountEnabled) {
                    if (row.chargesTypeId == 22) {
                        if (row.charges) {
                            options.trip.discount = row.charges;   // sirf tracking/display ke liye
                        }
                    }
                    // trip.charges already discount include kar chuka hai (sumChargesTax se), dobara add mat karo
                    options.trip.chargesWithDiscount = options.trip.charges;
                }
            }
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
            vm.setTaxPercentOnTaxCode = function () {
                if (options.trip.id == null || options.trip.id == 0) {
                    if (!options.trip.invoiceTo) {
                        if (vm.isTaxCodeEnabled && !options.trip.customer.taxCodeId) {

                            if (options.trip.customer.taxCodeId > 0) {
                                if (options.trip.customer.taxCode)
                                    options.trip.taxPercent = options.trip.customer.taxCode.taxPercent;
                            }
                            else {
                                if (vm.branchTaxPercentage)
                                    options.trip.taxPercent = vm.branchTaxPercentage;
                            }
                        }
                    }
                    else if (options.trip.invoiceTo.taxCodeId) {
                        if (options.trip.invoiceTo.taxCode)
                            options.trip.taxPercent = options.trip.invoiceTo.taxCode.taxPercent;
                    }
                    else {
                        if (vm.branchTaxPercentage)
                            options.trip.taxPercent = vm.branchTaxPercentage;
                    }
                }


            }






            vm.calculateTaxPerRow = function (row) {
                if (vm.tripCharges == null) return;
                if (row.chargesTypeId == 22 && row.charges > 0) {
                    row.charges = -row.charges;
                }
                if (vm.isTaxCodeEnabled) {
                    vm.setTaxPercentOnTaxCode();
                }
                var totalCharges = 0.0;
                var totalTax = 0.0;

                var isDiscount = row.chargesTypeId == 22;
                var chargesForTax = isDiscount ? Math.abs(row.charges) : row.charges;

                if (chargesForTax > 0) {
                    var tax = 0;
                    if (row.taxable && options.trip.taxPercent > 0) {
                        if (vm.isTaxInclusive) {
                            var chargesWithoutTax = (chargesForTax * 100) / (100 + options.trip.taxPercent);
                            tax = utilities.round(chargesForTax - chargesWithoutTax, 2);
                            row.tax = isDiscount ? -tax : tax;
                            if (vm.quantityAndRateInLimo && (row.taxCategory == 2 || row.taxCategory == 3)) {
                                row.tax = 0;
                            }
                        } else {
                            tax = utilities.round(chargesForTax * options.trip.taxPercent / 100, 2);
                            row.tax = isDiscount ? -tax : tax;
                            if (vm.quantityAndRateInLimo && (row.taxCategory == 2 || row.taxCategory == 3)) {
                                row.tax = 0;
                            }
                        }
                    }
                    else {
                        if (vm.quantityAndRateInLimo && (row.taxCategory != 2 && row.taxCategory != 3)) {
                            if (vm.isTaxInclusive) {
                                var chargesWithoutTax = (chargesForTax * 100) / (100 + options.trip.taxPercent);
                                tax = utilities.round(chargesForTax - chargesWithoutTax, 2);
                                row.tax = isDiscount ? -tax : tax;
                            } else {
                                tax = utilities.round(chargesForTax * options.trip.taxPercent / 100, 2);
                                row.tax = isDiscount ? -tax : tax;
                            }
                        }
                        else {
                            row.tax = 0;
                        }
                    }
                } else {
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
                    var limofare = vm.tripCharges.filter(e => e.chargesTypeId == 24)[0];
                    limofare.charges = 0.0;
                    limofare.rate = 0.0;
                    angular.forEach(limoFareRow.calcDetail, function (item) {
                        limofare.charges += item.charges;
                        limofare.rate += item.rate;
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

            vm.markManualCharges = function (row) {
                if (!row) return; 

                if (vm.dontRecalculateChargesOnTripFinish) {
                    if (row.chargesTypeId === 24) {
                        vm.dontCalcCharges = true;

                        if (Array.isArray(row.calcDetail)) {
                            row.calcDetail.forEach(function (charge) {
                                if (charge && row.rate > 0) {
                                    charge.charges = row.rate;
                                    charge.rate = row.rate;
                                }
                            });
                        }
                    }
                    
                }
            };

            vm.localize = function (input) {
                return app.localize(input);
            };

            vm.save = function () {

                vm.saving = true;

                // Check if anything changed
                if (vm.dontCalcCharges) {

                    // IMPORTANT — set flag on trip object
                    options.trip.dontCalcCharges = true;
                }

                $uibModalInstance.close();
                vm.saving = false;
            };


            vm.showCalculationDetail = function (row) {
                var calculationDetail = JSON.parse(row.calcDetail);
            };

            function init() {
                vm.loading = true;
                vm.branchTaxCode();
                var totalCharges = 0.0;

                vm.tripCharges = options.trip.tripCharges;
                vm.dontCalcCharges = options.trip.dontCalcCharges;
                vm.isPassFromFinish = options.isPassFromFinish;
                if (vm.quantityAndRateInLimo) {
                    var limoFareRow = null;
                    var discountRow = null;

                    vm.tripCharges.forEach(function (value) {
                        if (value.chargesTypeId == 24) {
                            limoFareRow = value; // Store LimoFare row
                            value.quantity = 1;
                            vm.limoFareReadOnly = true;

                            if (value.calcDetail?.length > 0) {
                                value.calcDetail.forEach(function (charge) {
                                    totalCharges += charge.charges;
                                });
                                value.rate = totalCharges;
                                if (value.charges > 0 && totalCharges == 0) {
                                    value.rate = value.charges;
                                }
                            } else if (value.charges > 0) {
                                value.rate = value.charges;
                            }
                        }

                        // Find Discount row
                        if (value.chargesTypeId == 22) {
                            discountRow = value;
                        }
                    });

                    // If LimoFare has a tax category, apply it to Discount row
                    if (limoFareRow && discountRow && limoFareRow.taxCategory && !options.trip.id) {
                        discountRow.taxCategory = limoFareRow.taxCategory;
                    }

                    // Calculate LimoFare total
                    vm.limoFareTotal = 0.0;
                    if (limoFareRow?.calcDetail) {
                        angular.forEach(limoFareRow.calcDetail, function (item) {
                            vm.limoFareTotal += item.charges;
                        });
                    }

                    vm.sumChargesTax();
                    vm.originalTripCharges = angular.copy(vm.tripCharges);
                    vm.loading = false;
                }
                else {
                    vm.tripCharges.forEach(function (value) {
                        if (value.chargesTypeId == 24 && value.charges > 0)
                            vm.limoFareReadOnly = true;
                        //if (value.chargesTypeId == 24) {
                        //    value.quantity = 1;
                        //    vm.limoFareReadOnly = true;

                        //    if (value.chargesTypeId == 24 && value.calcDetail?.length > 0) {
                        //        value.calcDetail.forEach(function (charge) {
                        //            totalCharges += charge.charges;
                        //        });
                        //        value.rate = totalCharges;
                        //        if (value.chargesTypeId == 24 && value.charges > 0 && totalCharges == 0) {
                        //            value.rate = value.charges;
                        //        }
                        //    }
                        //    else if (value.chargesTypeId == 24 && value.charges > 0) {
                        //        value.rate = value.charges;
                        //    }
                        //}
                    });
                        
                    vm.limoFareTotal = 0.0;
                    var limofare = vm.tripCharges.filter(e => e.chargesTypeId == 24)[0];
                    angular.forEach(limofare.calcDetail, function (item) {
                        vm.limoFareTotal += item.charges;
                    });


                    vm.sumChargesTax();
                    vm.originalTripCharges = angular.copy(vm.tripCharges);

                    vm.loading = false;
                }

            }


            init();
        }
    ]);
