// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:156548-157005
appModule.controller('tenant.views.crs.agreementsDashboard2.report', ['$scope', '$stateParams', 'abp.services.app.commonAgreement',
        '$stateParams', 'abp.services.app.commonLookup', 'chargesCalculator', '$filter', 'utilities',
        function ($scope, $stateParams, commonAgreementService, $stateParams, commonLookupService, chargesCalculator, $filter, utilities) {

            var vm = this;
            vm.enableManualAgreementNo = utilities.parseBoolean(abp.setting.get("App.General.EnableManualAgreementNo"));
            vm.showContactNo = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ShowContactNoInDashBoard2"));
            vm.showParkingChargesInAgreementDashboard = utilities.parseBoolean(abp.setting.get("App.Speed.AgreementDashboardTwo.ShowParkingChargesInAgreementDashboard"));
            vm.calculateAndShowAgreementChargesTillNow = utilities.parseBoolean(abp.setting.get("App.General.CalculateAndShowAgreementChargesTillNow"));
            vm.isSalikModuleEnabled = abp.features.isEnabled("CRS.Tolls.Salik");
            vm.isDarbModuleEnabled = abp.features.isEnabled("CRS.Tolls.AbuDhabi");
            vm.isFineModuleEnabled = abp.features.isEnabled("CRS.Fines.AbuDhabiPolice") || abp.features.isEnabled("CRS.Fines.DubaiPolice") || abp.features.isEnabled("CRS.Fines.Qatar"); //added by arslan for Qatar fines
            vm.filters = null;
            vm.skipCount = 0;
            var batchSize = 500;
            if ($scope.$parent !== null) {
                if ($scope.$parent.vmMain !== null)
                    vm.filters = $scope.$parent.vmMain.filters;
            }
            vm.allowRateTypeChargesWithVehicle = abp.features.isEnabled("CRS.CustomFeatures.AllowRateTypeChargesWithVehicle");
            vm.replacementOfMakeAndModelInGridForVehicles = utilities.parseBoolean(abp.setting.get('App.Speed.Common.ReplacementOfMakeAndModelInGridForVehicles'));
            if (vm.filters === null)
                vm.filters = $stateParams.filters;

            //if (vm.filters.agreementNo) {
            //    vm.filters.manualAgreementNo = null;
            //    vm.filters.plateNo = null;
            //    vm.filters.startDate = null;
            //    vm.filters.endDate = null;
            //    vm.filters.locationId = null;
            //    vm.filters.agreementType = null;
            //    vm.filters.status = null;
            //    vm.filters.customer = null;
            //}
            //else if (vm.filters.manualAgreementNo) {
            //    vm.filters.plateNo = null;
            //    vm.filters.startDate = null;
            //    vm.filters.endDate = null;
            //    vm.filters.locationId = null;
            //    vm.filters.agreementType = null;
            //    vm.filters.status = null;
            //    vm.filters.customer = null;
            //}
            //else if (vm.filters.plateNo) {
            //    vm.filters.startDate = null;
            //    vm.filters.endDate = null;
            //    vm.filters.locationId = null;
            //    vm.filters.agreementType = null;
            //    vm.filters.status = null;
            //    vm.filters.customer = null;
            //}
            vm.agreementType = '';
            vm.locationName = '';


            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';


            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };

            vm.filters.skipCount = 0;
            vm.filters.maxResultCount = batchSize;
            function getAgreementTypes() {
                if (!vm.filters.agreementType) return '';
                if (vm.filters.agreementType == 1) vm.agreementType = 'Daily';
                if (vm.filters.agreementType == 2) vm.agreementType = 'Weekly';
                if (vm.filters.agreementType == 3) vm.agreementType = 'Monthly';
            };
            vm.getAgreementType = function (category) {
                if (category === 0)
                    return "NA";
                if (category === 1)
                    return "Daily";
                if (category === 2)
                    return "Weekly";
                if (category === 3)
                    return "Monthly";
                else if (category === 4)
                    return "Lease";
                else if (category === 5)
                    return "LeaseToOwn";
                else
                    return category;
            }
            vm.calculate = function (rowagreement) {
                if (rowagreement == null) return 0;

                if (rowagreement && rowagreement.charges) {
                    var foundLines = $filter('filter')(rowagreement.charges, {
                        chargesTypeId: 1
                    }, true);
                    if (foundLines.length == 1) {
                        if (foundLines[0].discountPercent >= 0) {
                            foundLines[0].discountedRate = utilities.round(foundLines[0].rate - (foundLines[0].rate * (foundLines[0].discountPercent / 100)), 2);
                        }
                    }
                }

                //if ((vm.agreement.agreementType == 1 || vm.agreement.agreementType == 2) && !vm.advanceChanged && !vm.isEditMod) {
                //    vm.advance.amount = chargesCalculator.calculate(vm.agreement);
                //}
                //else if (vm.agreement.agreementType == 3) {
                //    vm.isReadOnlyAdvanceAmount = false;
                //}

                return chargesCalculator.calculate(rowagreement);
            };
            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                amount = utilities.round(amount, 2);
                return amount.toLocaleString('en');
            };
            vm.getStatuses = function () {
                if (!vm.filters.status) return '';
                if (vm.filters.status == 1)
                    return app.localize("Open");
                else if (vm.filters.status == 2)
                    return app.localize("Closed");
            };

            vm.getStatusString = function (status) {
                if (!status) return '';
                if (status == 1)
                    return app.localize("Open");
                else if (status == 2)
                    return app.localize("Closed");
                else if (status == 8)
                    return app.localize("Voided");
            };

            vm.getlocalizedString = function (agreementStatus) {
                return app.localize(agreementStatus);
            };


            function getLocationName() {
                if (!vm.locations || !vm.filters.locationId)
                    return null;
                angular.forEach(vm.locations, function (value, key) {
                    if (value.id == vm.filters.locationId) {
                        vm.locationName = value.name;
                        return;
                    }
                });
            };
            function getLocations() {
                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                    getLocationName();
                });
            }
            vm.sumTotalCharges = 0.0;
            vm.sumTotalTax = 0.0;
            vm.sumTollsCharges = 0.0;
            vm.sumDarbCharges = 0.0;
            vm.sumParkingCharges = 0.0;
            vm.sumFinesCharges = 0.0;
            vm.sumTotal = 0.0;
            vm.sumReceived = 0.0;
            vm.sumReceivedTax = 0.0;
            vm.sumAdditional = 0.0;
            vm.sumRentRate = 0.0;
            vm.sumAgreementDiscount = 0.0;
            vm.sumDue = 0.0;
            vm.sumInvoiced = 0.0;
            vm.sumCreditNote = 0.0;
            vm.sumDeposit = 0.0;
            vm.sumDueDeposit = 0.0;
            vm.sumreceivedTotal = 0.0;
            vm.outStandingCount = 0.0;


            function getAgreements() {
                vm.disableSaveButton = true;
                if (vm.skipCount == 0)
                    vm.agreementReportData = [];
                vm.filters.skipCount = vm.skipCount;
                if (vm.skipCount == 0)
                    vm.agreements = [];
                commonAgreementService.getOpenAgreementsForAgreementsDashboard2(vm.filters).success(function (data) {
                    vm.totalDataCount = data.totalCount;

                    //vm.amortizationData = data.items;


                    angular.forEach(data.agreementsList, function (value, key) {
                        if (vm.calculateAndShowAgreementChargesTillNow && value.status == 1) {
                            vm.calculate(value);
                        }





                        value.rentalCharges = 0;
                        value.reversedCharges = 0;
                        value.reversedAdditionalCharges = 0;
                        value.reversedChargesWithoutTDF = 0;
                        value.reversedChargesOfTolls = 0;
                        value.reversedChargesOfDarbs = 0;
                        value.reversedChargesOfParking = 0;
                        value.reversedChargesOfFines = 0;
                        value.receivedCharges = 0;
                        value.receivedAdditionalCharges = 0;
                        value.receivedChargesWithoutTDF = 0;
                        value.receivedChargesOfTolls = 0;
                        value.receivedChargesOfDarbs = 0;
                        value.receivedChargesOfParking = 0;
                        value.receivedChargesOfFines = 0;
                        value.darbInvoice = 0;
                        value.tollInvoice = 0;
                        value.finesInvoice = 0;
                        value.invoicedTax = 0;
                        value.chargesInvoiceTotal = 0;
                        value.agreementDiscount = 0;
                        value.sumInvoiceTDFCharges = 0;






                        angular.forEach(value.charges, function (item, key) {
                            angular.forEach(value.additionalAgreementChargesList, function (addi, key) {
                                if (addi.chargesTypeId == item.chargesTypeId) {
                                    if (addi.rate) {

                                        if (addi.chargesTypeId == 7 || addi.chargesTypeId == 33) {
                                            value.tollsCharges = value.tollsCharges + addi.rate;
                                            value.totalTax = value.totalTax + addi.tax;
                                        }
                                        if (addi.chargesTypeId == 8 || addi.chargesTypeId == 34) {
                                            value.finesCharges = value.finesCharges + addi.rate;
                                            value.totalTax = value.totalTax + addi.tax;

                                        }
                                        if (addi.chargesTypeId == 73 || addi.chargesTypeId == 74) {
                                            value.darbCharges = value.darbCharges + addi.rate;
                                            value.totalTax = value.totalTax + addi.tax;

                                        }
                                        if (addi.chargesTypeId == 39 || addi.chargesTypeId == 77) {
                                            value.parkingCharges = value.parkingCharges + addi.rate;
                                            value.totalTax = value.totalTax + addi.tax;

                                        } 
                                        else {
                                            item.charges = item.charges + addi.rate;
                                            item.tax = item.tax + addi.tax;
                                        }



                                    }

                                }


                            });

                            if (item.chargesTypeId == 1) {
                                value.rentRate = item.rate - (item.rate * item.discountPercent / 100);
                            }


                            if (
                                !(item.chargesTypeId == 73 ||
                                    item.chargesTypeId == 74 ||
                                    item.chargesTypeId == 7 ||
                                    item.chargesTypeId == 8 ||
                                    item.chargesTypeId == 33 ||
                                    //item.chargesTypeId == 28 ||
                                    item.chargesTypeId == 34
                                )) {
                                value.rentalCharges = value.rentalCharges + item.charges;
                                value.reversedCharges = value.reversedCharges + item.reversed;
                                value.receivedCharges = value.receivedCharges + item.received;
                                if (item.taxable)
                                    value.totalTax = value.totalTax + item.tax;
                                value.invoicedTax = value.invoicedTax + item.invoicedTax;
                                value.chargesInvoiceTotal = value.chargesInvoiceTotal + item.invoiced;
                                value.reversedChargesWithoutTDF = value.reversedChargesWithoutTDF + item.reversed;
                                value.receivedChargesWithoutTDF = value.receivedChargesWithoutTDF + item.received;
                            } else {//toll darb salik invoice sum
                                value.sumInvoiceTDFCharges = value.sumInvoiceTDFCharges + item.invoiced;
                                value.invoicedTax = value.invoicedTax + item.invoicedTax;
                                if (item.chargesTypeId == 33 || item.chargesTypeId == 7) {
                                    value.tollInvoice = value.tollInvoice + item.invoiced;
                                    value.reversedChargesOfTolls = value.reversedChargesOfTolls + item.reversed; // credit notes
                                    value.receivedChargesOfTolls = value.receivedChargesOfTolls + item.received; // receipts
                                }
                                if (item.chargesTypeId == 34 || item.chargesTypeId == 8) {
                                    value.finesInvoice = value.finesInvoice + item.invoiced;
                                    value.reversedChargesOfFines = value.reversedChargesOfFines + item.reversed; // credit notes
                                    value.receivedChargesOfFines = value.receivedChargesOfFines + item.received; // receipts
                                }
                                if (item.chargesTypeId == 73 || item.chargesTypeId == 74) {
                                    value.darbInvoice = value.darbInvoice + item.invoiced;
                                    value.reversedChargesOfDarbs = value.reversedChargesOfDarbs + item.reversed; // credit notes
                                    value.receivedChargesOfDarbs = value.receivedChargesOfDarbs + item.received; // receipts
                                }
                                //if (item.chargesTypeId == 28) {
                                //    value.receivedAdditionalCharges = value.receivedAdditionalCharges + item.received; // receipts
                                //    value.reversedAdditionalCharges = value.reversedAdditionalCharges + item.reversed; // credit notes
                                //}

                            }



                        });
                        value.sumInvoiceTDFCharges = value.sumInvoiceTDFCharges + value.chargesInvoiceTotal;
                        if (value.discount) {
                            value.agreementDiscount = value.discount * -1;
                        }

                        value.totalTax = value.additionalTax + value.totalTax;
                        value.sum = value.additional + value.agreementDiscount + value.rentalCharges + value.tollsCharges + value.finesCharges + value.darbCharges+ value.parkingCharges + value.totalTax;
                        value.due = ((value.sum - value.receivedTotal) - (value.reversed + value.reversedTax));
                        value.invoicedTax = utilities.round(value.invoicedTax, 2) - value.reversedTax;
                        value.totalTax = utilities.round(value.totalTax, 2);
                        value.agreementDiscount = utilities.round(value.agreementDiscount, 2);
                        value.rentalCharges = utilities.round(value.rentalCharges, 2);
                        value.tollsCharges = utilities.round(value.tollsCharges, 2);
                        value.parkingCharges = utilities.round(value.parkingCharges, 2);
                        value.finesCharges = utilities.round(value.finesCharges, 2);
                        value.sum = utilities.round(value.sum, 2);
                        value.additional = utilities.round(value.additional, 2);
                        value.received = utilities.round(value.received, 2);
                        value.receivedTotal = utilities.round(value.receivedTotal, 2);

                        value.due = utilities.round(value.due, 2);
                        value.deposit = utilities.round(value.deposit, 2);
                        value.dueDeposit = utilities.round(value.dueDeposit, 2);
                        value.darbCharges = utilities.round(value.darbCharges, 2);

                        vm.sumAgreementDiscount += value.agreementDiscount;
                        vm.sumInvoiced += value.invoiced;
                        vm.sumCreditNote += value.reversed + value.reversedTax;
                        vm.sumAdditional += value.additional;
                        vm.sumRentRate += value.rentRate;
                        vm.sumTotalCharges += value.rentalCharges;
                        vm.sumTotalTax += value.totalTax;
                        vm.sumTollsCharges += value.tollsCharges;
                        vm.sumDarbCharges += value.darbCharges;
                        vm.sumParkingCharges += value.parkingCharges;
                        vm.sumFinesCharges += value.finesCharges;
                        vm.sumTotal += value.sum;
                        vm.sumReceived += value.received;
                        vm.sumreceivedTotal += value.receivedTotal;
                        vm.sumReceivedTax += value.receivedTax;
                        vm.sumDue += value.due;
                        vm.sumDeposit += value.deposit;
                        vm.sumDueDeposit += value.dueDeposit;
                    });
                    vm.sumAgreementDiscount = utilities.round(vm.sumAgreementDiscount, 2);
                    vm.sumAdditional = utilities.round(vm.sumAdditional, 2);
                    vm.sumRentRate = utilities.round(vm.sumRentRate, 2);
                    vm.sumInvoiced = utilities.round(vm.sumInvoiced, 2);
                    vm.sumTotalTax = utilities.round(vm.sumTotalTax, 2);
                    vm.sumTotalCharges = utilities.round(vm.sumTotalCharges, 2);
                    vm.sumTollsCharges = utilities.round(vm.sumTollsCharges, 2);
                    vm.sumParkingCharges = utilities.round(vm.sumParkingCharges, 2);
                    vm.sumFinesCharges = utilities.round(vm.sumFinesCharges, 2);
                    vm.sumTotal = utilities.round(vm.sumTotal, 2);
                    vm.sumReceived = utilities.round(vm.sumReceived, 2);
                    vm.sumreceivedTotal = utilities.round(vm.sumreceivedTotal, 2);
                    vm.sumReceivedTax = utilities.round(vm.sumReceivedTax, 2);
                    vm.sumDue = utilities.round(vm.sumDue, 2);
                    vm.sumDeposit = utilities.round(vm.sumDeposit, 2);
                    vm.sumDueDeposit = utilities.round(vm.sumDueDeposit, 2);
                    data.agreementsList.forEach(function (value) {

                        if (vm.filters.outstandingDueAmount && value.due == 0) {
                            vm.outStandingCount++;
                            vm.sumAgreementDiscount -= value.agreementDiscount;
                            vm.sumInvoiced -= value.invoiced;
                            vm.sumCreditNote -= value.reversed + value.reversedTax;
                            vm.sumAdditional -= value.additional;
                            vm.sumRentRate -= value.rentRate;
                            vm.sumTotalCharges -= value.rentalCharges;
                            vm.sumTotalTax -= value.totalTax;
                            vm.sumTollsCharges -= value.tollsCharges;
                            vm.sumDarbCharges -= value.darbCharges;
                            vm.sumParkingCharges -= value.parkingCharges;
                            vm.sumFinesCharges -= value.finesCharges;
                            vm.sumTotal -= value.sum;
                            vm.sumReceived -= value.received;
                            vm.sumreceivedTotal -= value.receivedTotal;
                            vm.sumReceivedTax -= value.receivedTax;
                            vm.sumDue -= value.due;
                            vm.sumDeposit -= value.deposit;
                            vm.sumDueDeposit -= value.dueDeposit;


                        } else {
                            vm.agreements.push(value);

                        }


                    });
                    vm.skipCount = vm.skipCount + batchSize;
                    if (vm.skipCount < vm.totalDataCount)
                        getAgreements();
                    else {
                        vm.loading = false;
                        vm.disableSaveButton = false;

                        vm.skipCount = 0;
                    }
                }).finally(function () {
                    vm.loading = false;
                });




            }
            function getAgreementsReport() {
                vm.disableSaveButton = true;
                    vm.agreementReportData = [];


                commonAgreementService.agreementsDashboardTwoView(vm.filters).success(function (data) {
                    vm.totalDataCount = data.totalCount;
                    vm.agreementsReport = data;
                    angular.forEach(vm.agreementsReport.agreements, function (item, key) {
                        if (item.status == 8) {
                            item.due = 0;
                        }
                    });
                   
                }).finally(function () {
                    vm.loading = false;
                    vm.disableSaveButton = false;
                });
            }

            function init() {
             
                getAgreementsReport();
            }
            init();
        }]);
