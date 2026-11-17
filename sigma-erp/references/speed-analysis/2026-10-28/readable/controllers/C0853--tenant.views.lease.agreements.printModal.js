// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:234391-235197
appModule.controller('tenant.views.lease.agreements.printModal', ['$scope', '$sce', 'appSession', '$stateParams', 'abp.services.app.agreement', 'abp.services.app.agreementPrint', 'abp.services.app.qRLabel', 'abp.services.app.user', '$uibModal', 'utilities', 'abp.services.app.leaseClause', '$filter', 'abp.services.app.commonLookup',
        function ($scope, sce, appSession, $stateParams, agreementService, agreementPrintService, qrService, userService, $uibModal, utilities, leaseClauseService, $filter, commonLookupService) {
            var vm = this;
            vm.loading = false;
            vm.localize = (key) => app.localize(key);
            vm.tenantName = appSession.tenant.name;
            vm.tenancyName = appSession.tenant.tenancyName;
            vm.customerDoc = {};
            vm.driverDoc = {};
            vm.totalRent = null;
            vm.totalMonthlyCharges = null;
            vm.aditionalCharges = null;
            vm.driverPassportDetail = {};
            vm.damageAndLossLiabilityWaivers = null;
            vm.customerDrivingLisence = {};
            vm.driverNationalIdDetail = {};
            vm.additionalDriverDoc = {};
            vm.additionalDriverDrivingLisence = {};
            vm.qrCode = null;
            vm.user = null;
            vm.agreementChargesLengthHalf = 0;
            vm.rentalTex = null;
            vm.rentalTotal = null;
            vm.rentalSum = null;
            vm.advance = 0;
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.currency = abp.setting.get("App.General.CurrencyCode");
            //vm.trafficFineSurCharge = abp.setting.get("App.General.TrafficFineSurCharge");
            vm.trafficFineSurCharge = parseFloat(abp.setting.get("App.General.TrafficFineSurCharge"));
            vm.tollSurcharge = parseFloat(abp.setting.get("App.General.TollsSurCharge"));
            vm.fineSurchargeType = abp.setting.get("App.General.FineSurchargeType");
            vm.tollsSurCharge = abp.setting.get("App.General.TollsSurCharge");
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.termsAndConditions = sce.trustAsHtml(app.localize('RentalTermsAndConditions'));
            vm.showExtendedDate = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ShowExtendedDateInLeaseAgreement"));
            vm.purchasePrice = utilities.parseBoolean(abp.setting.get("App.Speed.Common.PurchasePrice"));

            vm.fileName = vm.tenancyName.toLowerCase() + '-' + 'header.png';
            vm.showSignatureButton = true;
            var agreementId = 0;
            vm.paymentTerms = null;
            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };

            vm.getAmountInWords = function (charges) {
                if (charges != null && charges > 0) {
                    return utilities.toWords(vm.rounding(charges));
                }
            };
            vm.clauseTypeDataName = null;
            //if pop-up print
            if ($scope.$parent != null) {
                if (!isNaN($scope.$parent.vmMain.agreementId))
                    agreementId = $scope.$parent.vmMain.agreementId;
            }

            //if through url print
            if (agreementId == 0 && !isNaN($stateParams.query)) {
                agreementId = $stateParams.query;
            }

            vm.rentRow = {
                discountedRate: null,
                rateType: null,
                discountPercent: null
            };

            vm.currencyAndRounding = function (value) {
                if (value == null) return null;

                return value.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            };

            vm.currencyAndRoundingWithThree = function (value) {
                if (value == null) return null;

                return value.toLocaleString('en', { minimumFractionDigits: 3, maximumFractionDigits: 3 })
            };

            vm.onImageError = function () { vm.imgError = true; };

            vm.localize = function (input) {
                if (input == null)
                    return "";

                return app.localize(input);
            };

            vm.localizeChargesType = function (chargesRow) {
                if (chargesRow.chargesTypeId == 2 && chargesRow.excessRate == 0 && chargesRow.accepted)
                    return app.localize("SCDW");
                return app.localize(chargesRow.chargesType.name);
            };

            vm.localizeArabic = function (input) {
                if (input == "Rent")
                    return "إيجار";
                if (input == "Mileage")
                    return "عدد الأميال";
                if (input == "Fuel")
                    return "وقود";
                if (input == "CDW")
                    return "تطرحها";
                if (input == "PAI")
                    return "التأمين ضد الحوادث الشخصية";
                if (input == "Additional Driver")
                    return "سائق إضافي";
                if (input == "GPS")
                    return "نظام تحديد المواقع";
                if (input == "Baby Seat")
                    return "مقعد الطفل";
                if (input == "Tolls")
                    return "رسوم";
                if (input == "Fines")
                    return "المخالفات";
                if (input == "Other")
                    return "آخر";
                if (input == "Driver Charges")
                    return "رسوم سائق";
                else
                    return "";
            };
            vm.localizeArabicUsingKey = function (input) {
                if (input == null)
                    return "";
                if (input == 'DeliveryCharges')
                    return app.localize('DeliveryLang');
                if (input == 'CollectionCharges')
                    return app.localize('CollectionLang');

                return app.localize(input + 'Lang');
            };
            vm.getClauses = function (row, id) {
                vm.loading = true;
                leaseClauseService.getClausesForEdit({
                    id: id
                }).success(function (data) {
                    row.leaseClauses = data.clauses;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.agreementPreTerminationTypes = [
                { id: 1, name: app.localize('Fixed') },
                { id: 2, name: app.localize('PercentageOfRemainingPeriod') },
                { id: 3, name: app.localize('NoOfMonths') },
            ];

            vm.getPreTerminationRuleByYear = function (year) {
                if (!vm.agreement || !Array.isArray(vm.agreement.preTerminationRules)) {
                    return null;
                }
                const startMonth = (year - 1) * 12 + 1;
                const endMonth = year * 12;
                return vm.agreement.preTerminationRules.find(rule =>
                    rule.fromMonth >= startMonth && rule.fromMonth <= endMonth
                );
            };

            vm.getAgreementPreTerminationTypes = function (type) {
                if (type == 1)
                    return app.localize('Fixed');
                else if (type == 2)
                    return app.localize('PercentageOfRemainingPeriod');
                else if (type == 3)
                    return app.localize('NoOfMonths');
                return null;
            }
            vm.getMonths = function () {
                if (vm.execution) {
                    var months = [];
                    for (var i = 1; i <= vm.noOfMonths; i++) {
                        months.push(i);
                    }
                    return months;
                }
            };

            vm.getlocalDateTime = function (date, format) {
                if (date == null)
                    return "";

                var localTime = moment.utc(date).toDate();
                return moment(localTime).format(format);
            };

            vm.getFuelLevel = function (value) {
                return utilities.getFuelLevel(value);
            };
            function getLeaseClauseTypes() {
                vm.loading = true;
                leaseClauseService.getLeaseClauseTypes({}).success(function (data) {
                    vm.leaseClauseTypes = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };
            vm.agreementDateDiffDays = function (endDate, startDate) {
                var dateDiffrence = (new Date(endDate) - new Date(startDate)) / 1000 / 60 / 60 / 24;
                return dateDiffrence;
            }


            vm.getAccountType = function (account) {
                if (account == 1) {
                    return 'Current';
                }
                else if (account == 2) {
                    return 'Saving';
                }
            };

            vm.startDayOfDate = function (date) {
                vm.firstMonthRental = 0;
                vm.proRataRental = 0;
                var day = moment(date).date();
                if (day === 1) {
                    if (vm.recurringChargesSum) {
                        //if first day of month 
                        vm.firstMonthRental = vm.recurringChargesSum.rate + vm.recurringChargesSum.tax;
                        vm.proRataRental = 0;
                    }
                }
                else {
                    if (vm.recurringChargesSum) {
                        var charges = vm.recurringChargesSum.rate + vm.recurringChargesSum.tax;
                        var endDate = moment(date).endOf('month');
                        var numerOfDays = endDate.diff(date, 'days');
                        vm.proRataRental = vm.rounding((charges / 30) * numerOfDays);
                        vm.firstMonthRental = 0;
                    }
                }
            };

            vm.calculateMileage = function () {
                var mileageDriven = 0;
                for (var x = 0; x < vm.agreement.movements.length; x++) {
                    var diff = vm.agreement.movements[x].inDetail.km - vm.agreement.movements[x].outDetail.km;
                    mileageDriven += diff;
                }
                vm.exceededKms = mileageDriven - vm.allowedKms;
                vm.exceededKmsRate = vm.exceededKms * vm.allowedKmsRate;
                vm.usedKMs = mileageDriven;
            };

            vm.calculateSumForExecutiveTenant = function () {
                var requiredCharges = vm.agreement ? vm.agreement.charges.filter(c => c.rateTypeId == 6 && !c.applyOnClosing) : null;
                if (requiredCharges) {
                    vm.requiredChargesSum = requiredCharges.reduce(function (a, b) {
                        return {
                            rate: a.rate + b.rate,
                        };
                    });
                }
                //var total = (vm.requiredChargesSum ? vm.requiredChargesSum.rate : 0) + vm.advance + vm.proRataRental + vm.firstMonthRental;
                //return vm.rounding(total);
                var total = (vm.requiredChargesSum ? vm.requiredChargesSum.rate : 0) + vm.getFirstMonthRentalVat();
                return vm.rounding(total);
            };

            //Showing Agreement Status 
            vm.getAgreementStatus = function (value) {
                if (value == null) {
                    return "";
                }
                if (value == 1) {
                    return "Open";
                } else if (value == 2) {
                    return "Closed";
                } else {
                    return "";
                }
            };

            // Showing Agreement Type
            vm.getAgreementType = function (agreementType) {
                if (agreementType == null)
                    return "";

                if (agreementType == 1) {
                    return "Daily";
                } else if (agreementType == 2) {
                    return "Weekly";
                } else if (agreementType == 3) {
                    return "Monthly";
                } else {
                    return "";
                }
            };

            vm.sumAgreementRates = function (charges) {
                
                var ratesSum = 0.0;
               
                charges.forEach(charge => {
                    if (charge.rateTypeId == 1 || charge.rateTypeId == 2 || charge.rateTypeId == 3)
                    {
                        ratesSum += charge.rate;
                    }
                        
                });
                
                var totalTax = vm.rounding(ratesSum * vm.agreement.taxPercent / 100);

                vm.totalRent = totalTax + ratesSum;
                

            }

            vm.sumTotalCharges = function (agreement) {

                var chargesSum = 0.0;

                agreement.charges.forEach(charge => {
                    
                    if (charge.chargesTypeId == 26 || charge.chargesTypeId == 54 || charge.chargesTypeId == 55) {
                        chargesSum += charge.rate;
                    }

                });

               

                vm.totalMonthlyCharges = chargesSum + vm.totalRent + agreement.advance;

            }
            vm.getdamageandLossLiabilityWaivers = function (agreement) {

                var chargesSum = 0.0;

                agreement.charges.forEach(charge => {

                    if (charge.chargesTypeId == 1) {
                        chargesSum += charge.rate;
                    }
                    if (charge.chargesTypeId == 2) {
                        chargesSum += charge.rate;
                    }

                });
                vm.damageAndLossLiabilityWaivers = chargesSum;
            }
            vm.getRentalTexAndTotal = function (agreement) {

                var chargesSum = 0.0;

                agreement.charges.forEach(charge => {
                    if (charge.rateTypeId == 3)
                    {
                        chargesSum += charge.rate;
                    }
                    

                });
                
                vm.rentalTex = vm.rounding(chargesSum * vm.agreement.taxPercent / 100);
                vm.rentalTotal = vm.rounding(vm.rentalTex + chargesSum);
                vm.rentalSum = vm.rounding(vm.rentalTotal - vm.rentalTex);
            }
            vm.getAditionalCharges = function (agreement) {

                var chargesSum = 0.0;

                agreement.charges.forEach(charge => {
                    if (charge.chargesTypeId != 2 && charge.chargesTypeId != 1 & charge.rateTypeId==3) {
                        chargesSum += charge.rate;
                    }
                    vm.aditionalCharges = chargesSum;

                });

                
            }









            vm.getTaxForExecutive = function () {
                if (vm.agreement != null) {
                    var rentCharges = vm.agreement.charges.filter(c => c.chargesTypeId == 1)[0] != null ? vm.agreement.charges.filter(c => c.chargesTypeId == 1)[0].rate : 0;
                    var trackingCharges = vm.agreement.charges.filter(c => c.chargesTypeId == 12)[0] != null ? vm.agreement.charges.filter(c => c.chargesTypeId == 12)[0].rate : 0;
                    return vm.rounding((vm.agreement.taxPercent * (rentCharges + trackingCharges)) / 100);
                }
            };
            

            vm.getTotalChargesForExecutive = function () {
                if (vm.agreement != null) {
                    var sum = 0;
                    angular.forEach(vm.agreement.charges, function (row) {
                        if (row.chargesTypeId == 1 || row.chargesTypeId == 12) {
                            sum = sum + row.rate;
                        }
                        else {
                            sum = sum + row.charges;
                        }
                    });
                    sum = sum + vm.getTaxForExecutive();
                    sum = sum - vm.agreement.discount;
                    return sum;
                }
            };


            vm.getFirstMonthRentalVat = function () {
                if (vm.agreement != null) {
                    var rentCharges = vm.agreement.charges.filter(c => c.chargesTypeId == 1)[0] != null ? vm.agreement.charges.filter(c => c.chargesTypeId == 1)[0].rate : 0;
                    return vm.rounding(rentCharges + vm.getTaxForExecutive());
                }
            };
            // Showing Document Type
            vm.getDocumentType = function (value) {

                if (value == null)
                    return "";
                if (value == 1) {
                    return "Trade License";
                } else if (value == 2) {
                    return "Passport";
                } else if (value == 3) {
                    return "National Id";
                } else if (value == 4) {
                    return "Driving License";
                } else {
                    return "";
                }
            };

            vm.getIdentity = function ()
            {
                var documentNo = null;;
                if (vm.agreement) {
                    
                   
                    vm.agreement.customer.identityDocuments.forEach(function (row) {

                        if (row.identityDocumentType == 1) {
                            documentNo= row.documentNo;
                        }
                    });
                    vm.agreement.customer.identityDocuments.forEach(function (row) {

                        if (row.identityDocumentType == 2) {
                            documentNo = row.documentNo;
                        }
                    });
                    vm.agreement.customer.identityDocuments.forEach(function (row) {

                        if (row.identityDocumentType == 3) {
                            documentNo = row.documentNo;
                        }
                    });
                }
                return documentNo;

            }




            //  Showing Document Localized
            vm.getDocumentTypeLocalized = function (value) {

                if (value == null)
                    return "";
                if (value == 1) {
                    return app.localize('TradeLicense');
                } else if (value == 2) {
                    return app.localize('Passport');
                } else if (value == 3) {
                    return app.localize('NationalId');
                } else if (value == 4) {
                    return app.localize('DrivingLicense');
                } else {
                    return "";
                }
            };

            vm.getPreTerminationType = function (value) {
                if (value == null) {
                    return '';
                }
                else if (value == 1) {
                    return 'Fixed';
                }
                else if (value == 2) {
                    return 'Percentage Of Remaining Period';
                }
                else {
                    return 'No Of Months';
                }
            }

            //  Showing RateTypes Localized
            vm.getRateTypesLocalized = function (value) {
                return app.localize(value);
            };
            function getMilageAllow() {

                vm.agreement.charges.forEach(function (value) {
                    if (value.chargesTypeId == 5) {
                        vm.milageLimit = value.limit;
                        vm.milageExcessRate = value.excessRate;
                        //vm.milage = vm.localize('Allowed') + ': ' + value.limit + vm.localize(value.rateType.name) + ', ' + vm.localize('Excess') + ': ' + value.excessRate + vm.localize('/KM');
                    }
                });
            };
            function getCustomerFineSurcharge() {
                if (vm.agreement.customer.fineSurcharge != null) {
                    vm.fineSurcharge = vm.agreement.customer.fineSurcharge;
                    if (vm.agreement.customer.fineSurchargeType == 2)
                        vm.fineSurcharge = vm.fineSurcharge + ' %';
                }
                else {
                    vm.fineSurcharge = vm.trafficFineSurCharge;
                    if (vm.fineSurchargeType == 2)
                        vm.fineSurcharge = vm.fineSurcharge + ' %';
                }
            };
            function getCustomerTollSurcharge() {
                if (vm.agreement.customer.tollSurcharge != null)
                    vm.tollsSurcharge = vm.agreement.customer.tollSurcharge;
                else
                    vm.tollsSurcharge = vm.tollsSurCharge;
            };
            //function getFineSurchargeTypes(id) {
            //    if (id == 1)
            //        return vm.localize('Fixed');
            //    if (id == 2)
            //        return vm.localize('Percentage');
            //    else
            //        return '';
            //};
            function getInvoicingRule(invoicingRule) {
                if (invoicingRule == 1)
                    return app.localize('DateToDate');
                else if (invoicingRule == 2)
                    return app.localize('CalendarMonth');
                else if (invoicingRule == 3)
                    return app.localize('ThirtyDays');
                return null;
            };


            vm.documentsNullCheck = function (myObj) {
                if (Object.entries(myObj).length === 0 && myObj.constructor === Object) {
                    return false;
                }
                else {
                    return true;
                }
            };


            vm.init = function (options) {
                vm.loading = true;

                agreementPrintService.getAgreementForPrint({
                    agreementId: agreementId,
                    printQR: options.printQr,
                    printUser: options.printUser,
                    printDailyWeeklyRentRates: options.printDailyWeeklyRentRates,
                    getDiscountReason: options.getDiscountReason
                }).success(function (result) {
                    vm.agreement = result.agreement;
                    vm.sumAgreementRates(vm.agreement.charges);
                    vm.sumTotalCharges(vm.agreement);
                    vm.getdamageandLossLiabilityWaivers(vm.agreement);
                    vm.getRentalTexAndTotal(vm.agreement);
                    vm.getAditionalCharges(vm.agreement);
                    vm.discountReason = result.discountReason;
                    vm.paymentInstruction = result.paymentInstruction;
                    if (vm.agreement.charges.some(e => e.chargesTypeId == 1)) {
                        vm.monthlyRate = vm.agreement.charges.filter(e => e.chargesTypeId == 1)[0].rate;
                    }
                    if (vm.agreement.charges.some(e => e.chargesTypeId == 5)) {
                        var mileageRow = vm.agreement.charges.filter(e => e.chargesTypeId == 5)[0];
                        vm.annualMileage = mileageRow.limit * 12;
                        vm.excessMileage = mileageRow.excessRate + "/KM";
                    }

                    if (vm.agreement.charges.some(e => e.chargesTypeId == 2)) {
                        vm.insuranceExcess = vm.agreement.charges.filter(e => e.chargesTypeId == 2)[0].excessRate;
                    }
                    if (vm.agreement && vm.agreement.charges) {
                        var foundLines = $filter('filter')(vm.agreement.charges, {
                            chargesTypeId: 1
                        }, true);
                        if (foundLines.length == 1) {
                            if (foundLines[0].discountPercent > 0) {

                                foundLines[0].discountedRate = utilities.round(foundLines[0].rate - (foundLines[0].rate * (foundLines[0].discountPercent / 100)), 2);
                                vm.rentRow.discountedRate = foundLines[0].discountedRate;
                                vm.rentRow.rateType = foundLines[0].rateType;
                                vm.rentRow.discountPercent = foundLines[0].discountPercent;
                            }
                        }
                    }

                    vm.agreement.preTerminationRules = !vm.agreement.preTerminationRules ? [] : vm.agreement.preTerminationRules;
                    vm.agreement.clauses = !vm.agreement.clauses ? [] : vm.agreement.clauses;
                    vm.agreement.clauses.forEach(function (row) {
                        vm.getClauses(row, row.clause.clauseTypeId);
                    });
                    vm.rentChargeRow = vm.agreement.charges.filter(row => row.chargesTypeId == 1)[0];
                    vm.milageKmsYear = vm.agreement.charges.filter(row => row.chargesTypeId == 5)[0];
                    if (vm.agreement.charges.filter(row => row.chargesTypeId == 2).length > 0) {
                        vm.cdwRow = vm.agreement.charges.filter(row => row.chargesTypeId == 2)[0];
                    };
                    //if (vm.agreement.customer) {
                    //    vm.customerTrn = am.agreement.customer
                    //}
                    if (vm.agreement) {
                        vm.agreement.endDate = moment(vm.agreement.endDate);
                        vm.agreement.noOfMonths = vm.agreement.endDate.diff(moment(vm.agreement.movements[0].outDetail.dateTime), 'months');
                    }


                    // Temporary Changes Will Discard Once Update Is Delivered
                    //if (appSession.tenant.tenancyName.toLowerCase() == "galadari") {
                    //    vm.agreement.movements[vm.agreement.movements.length - 1].outDetail.dateTime = vm.agreement.movements[0].outDetail.dateTime;
                    //}

                    vm.getUserName(vm.agreement.creatorUserId);
                    //vm.agreement.clauses.forEach(function (row) {
                    //    vm.getClauses(row, row.clause.clauseTypeId);
                    //  //  vm.getClauses(row, row.clause.clauseId);
                    //});
                    if (vm.agreement.lastModifierUserId && vm.agreement.status == 2)
                        vm.getlastModifierUserName(vm.agreement.lastModifierUserId);
                    //if (vm.agreement.customer.leaseInvoicingRule) {
                    //    vm.paymentTerms = getInvoicingRule(vm.agreement.customer.leaseInvoicingRule);
                    //}
                    //if (!vm.paymentTerms) {
                    //    if (vm.agreement.customer.contactCategory == 1)
                    //        vm.paymentTerms = getInvoicingRule(parseInt(abp.setting.get("App.General.LeaseInvoicingRuleIndividual")))
                    //    else
                    //        vm.paymentTerms = getInvoicingRule(parseInt(abp.setting.get("App.General.LeaseInvoicingRuleCorporate")))
                    //}
                    vm.paymentTerms = vm.agreement.customer.creditPeriod && vm.agreement.customer.creditPeriod > 0 ? vm.agreement.customer.creditPeriod + ' Days' : 'Immediately';
                    if (vm.agreement) {
                        getMilageAllow();
                        getCustomerFineSurcharge();
                        getCustomerTollSurcharge();
                    }
                    if (vm.agreement.signature) {
                        vm.urlWithToken = vm.agreement.signature.url;
                        vm.showSignatureButton = false;
                    }
                    vm.advance = result.advance;
                    vm.agreementChargesLengthHalf = parseInt(vm.agreement.charges.length / 2);
                    vm.dailyRate = result.dailyRate;
                    vm.weeklyRate = result.weeklyRate;
                    // ... Customer Documents
                    if (vm.agreement.customer.identityDocuments.length == 0) {
                        vm.agreement.customer.identityDocuments = [
                            {
                                identityDocumentType: {}
                            }];
                        //vm.agreement.customer.identityDocuments[0].identityDocumentType = {};
                        vm.agreement.customer.identityDocuments[0].identityDocumentType = 2;
                        vm.customerDoc = vm.agreement.customer.identityDocuments[0];
                    } else {
                        for (var i = 0; i < vm.agreement.customer.identityDocuments.length; i++) {
                            if (vm.agreement.customer.identityDocuments[i].identityDocumentType == 2) {
                                vm.customerDoc = vm.agreement.customer.identityDocuments[i];
                                break;
                            }
                            if (vm.agreement.customer.identityDocuments[i].identityDocumentType == 3) {
                                vm.customerDoc = vm.agreement.customer.identityDocuments[i];
                            }
                        }
                        // vm.customerDoc = vm.agreement.customer.identityDocuments[0];
                    }
                    // Customer Driving Lisence
                    if (vm.agreement.customer.identityDocuments.length > 0) {
                        angular.forEach(vm.agreement.customer.identityDocuments, function (value, key) {
                            if (value.identityDocumentType == 4) {
                                vm.customerDrivingLisence = vm.agreement.customer.identityDocuments[key];
                            }
                        });
                    }
                    //// Additional Driver Documents
                    if (vm.agreement.additionalDriver != null) {
                        if (vm.agreement.additionalDriver.identityDocuments.length > 0) {
                            var passportCheck = true;
                            for (var i = 0; i < vm.agreement.additionalDriver.identityDocuments.length; i++) {
                                if (vm.agreement.additionalDriver.identityDocuments[i].identityDocumentType == 4)
                                    vm.additionalDriverDrivingLisence = vm.agreement.additionalDriver.identityDocuments[i];
                                if (vm.agreement.additionalDriver.identityDocuments[i].identityDocumentType == 2) {
                                    vm.additionalDriverDoc = vm.agreement.additionalDriver.identityDocuments[i];
                                    passportCheck = false;
                                }
                                if (vm.agreement.additionalDriver.identityDocuments[i].identityDocumentType == 3) {
                                    if (passportCheck)
                                        vm.additionalDriverDoc = vm.agreement.additionalDriver.identityDocuments[i];
                                }
                            }
                        }
                    }
                    vm.calculateMileage();

                    vm.checkVar = false;
                    //.... Driver Documents
                    if (vm.agreement.driver.identityDocuments.length > 0) {
                        angular.forEach(vm.agreement.driver.identityDocuments, function (value, key) {
                            if (value.identityDocumentType == 4) {
                                //   if (vm.checkVar == false) {
                                vm.driverDoc = vm.agreement.driver.identityDocuments[key];
                                vm.checkVar = true;
                                //   }
                            }

                            if (value.identityDocumentType == 2) {
                                vm.driverPassportDetail = vm.agreement.driver.identityDocuments[key];
                                vm.checkVar = true;
                            }

                            if (value.identityDocumentType == 3) {
                                vm.driverNationalIdDetail = vm.agreement.driver.identityDocuments[key];
                                vm.checkVar = true;
                            }
                        });
                    }
                    if (vm.agreement.driver.identityDocuments.length > 0 && vm.checkVar == false) {
                        vm.driverDoc = vm.agreement.driver.identityDocuments[0];
                    }
                    if (vm.agreement.driver.identityDocuments.length == 0) {
                        vm.agreement.driver.identityDocuments = [
                            {
                                identityDocumentType: {}
                            }];
                        //vm.agreement.customer.identityDocuments[0].identityDocumentType = {};
                        vm.agreement.driver.identityDocuments[0].identityDocumentType = 4;
                        vm.driverDoc = vm.agreement.driver.identityDocuments[0];
                    }

                    if (options.printQr)
                        vm.qrCode = result.qrLabel;
                    if (options.printUser)
                        vm.user = result.user;



                    getLeaseClauseTypes();



                    vm.recurringChargesSum = vm.agreement.charges.filter(c => c.rateTypeId == 1 || c.rateTypeId == 2 || c.rateTypeId == 3).reduce(function (a, b) {
                        return {
                            rate: a.rate + b.rate,
                            tax: a.tax + b.tax
                        };
                    });

                }).finally(function () {
                    vm.loading = false;
                });
            };
            vm.getUserName = function (userId) {
                commonLookupService.getUser({
                    id: userId
                }).success(function (result) {
                    vm.userName = result.name + ' ' + result.surname;
                });
            };
            vm.getlastModifierUserName = function (userId) {
                commonLookupService.getUser({
                    id: userId
                }).success(function (result) {
                    vm.lastModifierUserName = result.name + ' ' + result.surname;
                });
            };
            vm.signaturePopUp = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/signaturePads/wacom/signatureModal.cshtml',
                    controller: 'tenant.views.common.signaturePads.wacom.signatureModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        agreement: function () {
                            return vm.agreement;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.loading = true;
                    agreementService.saveAgreementSignature({
                        agreementId: agreementId,
                        signature: result
                    }).success(function () {
                        vm.urlWithToken = result.urlWithToken;
                        vm.showSignatureButton = false;
                    }).finally(function () {
                        vm.loading = false;
                    });

                });
            };
        }]);
