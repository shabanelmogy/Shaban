// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:146989-147881
appModule.controller('tenant.views.agreements.printModal', ['$scope', '$sce', 'appSession', 'abp.services.app.payment', '$stateParams', 'abp.services.app.agreement', 'abp.services.app.agreementPrint', 'abp.services.app.qRLabel', 'abp.services.app.user', '$uibModal', 'utilities', 'abp.services.app.billingMethod', '$filter', 'chargesCalculator', 'abp.services.app.commonLookup',
        function ($scope, sce, appSession, paymentService, $stateParams, agreementService, agreementPrintService, qrService, userService, $uibModal, utilities, billingMethodService, $filter, chargesCalculator, commonLookupService) {
            var vm = this;
            vm.loading = false;
            vm.localize = (key) => app.localize(key);
            vm.tenantName = appSession.tenant.name;
            vm.tenancyName = appSession.tenant.tenancyName;
            vm.locationId = appSession.user.locationId;
            vm.customerDoc = {};
            vm.driverDoc = {};
            vm.customerDrivingLisence = {};
            vm.additionalDriverDoc = {};
            vm.additionalDriverDrivingLisence = {};
            vm.qrCode = null;
            vm.user = null;
            vm.isPrintHeader = true;
            vm.showCharges = true;
            vm.agreementChargesLengthHalf = 0;
            vm.advance = 0;
            vm.enableManualAgreementNo = utilities.parseBoolean(abp.setting.get("App.General.EnableManualAgreementNo"));
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.isHideRate = utilities.parseBoolean(abp.setting.get("App.Speed.Common.HideRatesIfCustomerIsBroker"));
            vm.isShowDriverNameAndDetailInsteadOfCustomer = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ShowDriverNameAndDetailInsteadOfCustomerBroker"));
            vm.currency = abp.setting.get("App.General.CurrencyCode");
            vm.termsAndConditions = sce.trustAsHtml(app.localize('RentalTermsAndConditions'));
            vm.isUserWiseDiscountEnable = abp.features.isEnabled("CRS.UserWiseDiscount");
            vm.invoiceBasedOnAgreedRent = utilities.parseBoolean(abp.setting.get("App.General.InvoiceBasedOnAgreedRent"));
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.contactGroup = parseInt(abp.setting.get("App.General.BrokerContactGroupId"));
            vm.isSaleOrderEnabled = abp.features.isEnabled("CRS.Vouchers.SaleOrders");
            vm.isTaxEnabled = abp.features.isEnabled("CRS.Tax");
            vm.isStartDateOfAgreementAsDeliveryDate = abp.features.isEnabled("CRS.CustomFeatures.StartDateOfAgreementAsDeliveryDate");
            vm.brokerContactGroup = abp.features.isEnabled("CRS.CustomFeatures.BrokerContactGroup");
            vm.isActualClosingDateForClosingAgreement = abp.features.isEnabled("CRS.Rental.Agreements.ActualClosingDateForClosingAgreement");
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.showExtendedDate = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ShowExtendedDateInLeaseAgreement"));
            vm.fileName = vm.tenancyName.toLowerCase() + '-' + 'header.png';
            vm.showSignatureButton = true;
            var agreementId = 0;
            var startDateAsDeliveryDate = false;
            vm.startDateAsDeliveryDate = false;
            vm.printConfig = undefined;

            vm.chargeNotes = [];
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.timeFormat = 'HH:mm';
            vm.getDiscountedRate = function (rate, discountPercent) {
                return utilities.round(rate - (rate * (discountPercent / 100)), 2)
            };
            vm.closedStatus = false;
            vm.depositTypes = [
                { type: app.localize('PreAuthorizationDeposit'), id: 11 },
                { type: app.localize('ChequeDeposit'), id: 13 }
            ];

            //if pop-up print
            if ($scope.$parent != null) {
                if (!isNaN($scope.$parent.vmMain.agreementId))
                    agreementId = $scope.$parent.vmMain.agreementId;
                if ($scope.$parent.vmMain.startDateAsDeliveryDate)
                    startDateAsDeliveryDate = $scope.$parent.vmMain.startDateAsDeliveryDate;
                if (startDateAsDeliveryDate)
                    vm.startDateAsDeliveryDate = startDateAsDeliveryDate;
                if ($scope.$parent.vmMain.printConfig)
                    vm.printConfig = $scope.$parent.vmMain.printConfig;
            }
                  
            $scope.$watch('showCharges', function (newValue) {
                if (newValue === false) {
                    vm.showCharges = false;
                } else {
                    vm.showCharges = true;
                }
            });

            $scope.$on('chargesVisibilityChanged', function (event, value) {
                vm.showCharges = value;
            });

            //if through url print
            if (agreementId == 0 && !isNaN($stateParams.query)) {
                agreementId = $stateParams.query;
            }

            vm.floor = function (value) {
                return Math.floor(value);
            };
            vm.onImageError = function () { vm.imgError = true; };

            vm.localize = function (input) {
                if (input == null)
                    return "";

                return app.localize(input);
            };
            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };

            vm.currencyAndRounding = function (value) {
                if (value == null) return null;

                return value.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            };


            vm.currencyAndRoundingWithThree = function (value) {
                if (value == null) return null;

                return value.toLocaleString('en', { minimumFractionDigits: 3, maximumFractionDigits: 3 })
            };

            vm.hideTable = function () {
                vm.showSummary = !vm.showSummary;
            };
           vm.removeBrTags = function (str) {
                // Replace <br> tags with an empty string
                  if (str)
                  return str.replace(/<br\s*\/?>/gi, ',');
            }

            vm.localizeArabic = function (input) {
                var map = {
                    "Rent": "الايجار",
                    "Mileage": "رسوم الأميال الإضافية",
                    "Unlimited Mileage": "رسوم المسافات غير المحدودة",
                    "Road Assistance": "المساعدة على الطريق",
                    "Fuel": "رسوم وقود",
                    "CDW": "تأمين شامل ضد الحوادث",
                    "SCDW": "اﻟﺗﺄﻣﯾن ﺿد اﻟﺣوادث اﻟﺷﺧﺻﯾﺔ",
                    "PAI": "تأمين ضد الحوادث الشخصية",
                    "Additional Driver": "سائق إضافي",
                    "GPS": "ﺗﺣدﯾد اﻟﻣواﻗﻊ",
                    "Baby Seat": "مقعد الطفل",
                    "Baby Seat (Under 1 year)": "مقعد أطفال (أقل من سنة واحدة)",
                    "Baby Seat (Under 5 years)": "مقعد أطفال (أقل من 5 سنوات)",
                    "Tolls": "رسوم",
                    "Fines": "المخالفات",
                    "Other": "خدمات أخرى",
                    "Other Services": "خدمات أخرى",
                    "Driver Charges": "رسوم التوصيل",
                    "Tolls Surcharge": "رسوم رسوم إضافية",
                    "Fines Surcharge": "غرامات رسوم إضافية",
                    "Delivery Charges": "رسوم التوصيل",
                    "Collection Charges": "رسوم التوصيل (إسترجاع المركبة)",
                    "AgreedRent": "ايجار متفق عليه",
                    "Damage Charges": "رسوم الأضرار",
                    "Interior Cleaning": "تنظيف داخلي",
                    "Parking": "رسوم مواقف السيارات",
                    "Salik": "رسوم سالك",
                    "Darb": "رسوم درب"
                };
                return map[input] || "";
            };
            vm.localizeArabicForAMRACQatar = function (input) {
                var map = {
                    "Rent": "رسوم الإيجار",
                    "Mileage": "رسوم الأميال الإضافية",
                    "Unlimited Mileage": "رسوم المسافات غير المحدودة",
                    "Road Assistance": "المساعدة على الطريق",
                    "Fuel": "رسوم وقود",
                    "CDW": "تأمين شامل ضد الحوادث",
                    "SCDW": "اﻟﺗﺄﻣﯾن ﺿد اﻟﺣوادث اﻟﺷﺧﺻﯾﺔ",
                    "PAI": "تأمين ضد الحوادث الشخصية",
                    "Additional Driver": "سائق إضافي",
                    "GPS": "ﺗﺣدﯾد اﻟﻣواﻗﻊ",
                    "Baby Seat": "مقعد الطفل",
                    "Baby Seat (Under 1 year)": "مقعد أطفال (أقل من سنة واحدة)",
                    "Baby Seat (Under 5 years)": "مقعد أطفال (أقل من 5 سنوات)",
                    "Tolls": "رسوم",
                    "Fines": "المخالفات",
                    "Other": "خدمات أخرى",
                    "Other Services": "خدمات أخرى",
                    "Driver Charges": "رسوم التوصيل",
                    "Tolls Surcharge": "رسوم رسوم إضافية",
                    "Fines Surcharge": "غرامات رسوم إضافية",
                    "Delivery Charges": "رسوم التوصيل",
                    "Collection Charges": "رسوم التوصيل (إسترجاع المركبة)",
                    "AgreedRent": "ايجار متفق عليه",
                    "Damage Charges": "رسوم الأضرار",
                    "Interior Cleaning": "تنظيف داخلي",
                    "Parking": "رسوم مواقف السيارات",
                    "Salik": "رسوم سالك",
                    "Darb": "رسوم درب",
                    "DriverCharges": "رسوم السائق",
                    "BabySeat": "دخل مقعد الطفل",
                    "ExtraHoursCharges": "ساعات العمل الإضافية",
                    "HolidayFeeCharges": "ساعات العمل الإضافية خلال العطلات",
                    "Extra1Charges": "نقل الضيوف",
                    "AdminFee": "دخل آخر",
                    "Extra3Charges": "رسوم التأمين",
                    "VehicleRegistrationFee": "رسوم المرور",
                    "DeliveryCharges": "رسوم التوصيل",
                    "CollectionCharges": "رسوم التحصيل",
                    "AirportsurchargesCharges": "رسوم إضافية للمطار",
                };
                return map[input] || "";
            };
            vm.getAmountInWords = function (charges) {
                if (charges != null && charges > 0) {
                    return utilities.toWords(vm.rounding(charges));
                }
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
            vm.getlocalDateTime = function (date, format) {
                if (date == null)
                    return "";

                var localTime = moment.utc(date).toDate();
                return moment(localTime).format(format);
            };
            // arabic date by RK
            vm.getLocalDateTimeInArabic = function (date, arabicFormat) {
                if (date == null)
                    return "";

                var localTime = moment.utc(date).toDate();
                var arabicFormat = 'D MMMM YYYY'; // Arabic format for date
                var momentObj = moment(localTime);
                momentObj.locale('ar-sa'); // Set the locale to Arabic
                return momentObj.format(arabicFormat);
            };
            //temp work for urgent work should remove after 10/05/2023
            vm.filters = {
                enableDateRange: true,
                voucherNo: null,
                vehicleId: null,
                fromDate: null,
                paymentType: null,
                toDate: null,
                skipCount: 0,
                printingWithoutLogo: false,

            };
            vm.getPayments = function () {
                vm.loading = true;
                vm.filters.contactId = vm.agreement.customerId;
                paymentService.getPayments(vm.filters).success(function (data) {
                    vm.payments = data.items;
                    vm.payment = 0;

                    vm.payments.forEach(function (value) {

                        paymentService.getPaymentForView({ id: value.id }).success(
                            function (result) {
                                if (result.agreementId == vm.agreement.id) {
                                    vm.payment += value.amount;
                                }
                            }).finally(function () {
                            });
                    });
                }).finally(function () {
                    vm.loading = false;
                });
            };
            vm.chargesSum = function () {
                return chargesCalculator.sumCharges(vm.agreement);
            };


            vm.getAccountType = function (account) {
                if (account == 1) {
                    return 'Current';
                }
                else if (account == 2) {
                    return 'Saving';
                }
            };


            vm.getStatusText = function (status) {
                if (status == 0) {
                    return 'NA'
                }        
                if (status == 1) {
                    return 'Open'
                }
                else if (status == 2) {
                    return 'Close'
                }
            }

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
                var total = (vm.requiredChargesSum ? vm.requiredChargesSum.rate : 0) + vm.getOneMonthChargesAndTax();
                return vm.rounding(total);
            };

            vm.getFuelLevel = function (value) {
                return utilities.getFuelLevel(value);
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



            function getBillingMethods() {
                vm.loading = true;
                billingMethodService.getBillingMethods({ category: 1 }).success(function (data) {
                    vm.depositBillingMethods = data.items;
                    vm.depositBillingMethods.forEach(function (value) {
                        value.voucherSubTypeId = 12;
                    });
                    vm.depositTypes.forEach(function (value) {
                        vm.depositBillingMethods.push({
                            name: value.type,
                            voucherSubTypeId: value.id,
                        });
                    });

                    if (vm.deposit.voucherSubTypeId == 11 || vm.deposit.voucherSubTypeId == 13) {
                        var foundLines = $filter('filter')(vm.depositBillingMethods, {
                            voucherSubTypeId: vm.deposit.voucherSubTypeId,
                        }, true);
                        vm.deposit.voucherSubType = foundLines[0];
                        vm.type = foundLines[0].name;
                    }
                    else {
                        var foundLines = $filter('filter')(vm.depositBillingMethods, {
                            voucherSubTypeId: vm.deposit.voucherSubTypeId,
                            id: vm.deposit.billingDetail.billingMethodId
                        }, true);
                        vm.deposit.voucherSubType = foundLines[0];
                        vm.type = foundLines[0].name;
                    }



                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.getRateAfterDiscount = function (row) {
                if (row.discountPercent > 0)
                    return row.rate - (row.rate * (row.discountPercent / 100));
                return row.rate;

            };

            //  Showing RateTypes Localized
            vm.getRateTypesLocalized = function (value) {
                return app.localize(value);
            };
            vm.getUserName = function (userId) {
                commonLookupService.getUser({
                    id: userId
                }).success(function (result) {
                    vm.userName = result.name + ' ' + result.surname;
                    vm.userNameWithSurName = result.name + " " + result.surname;
                });
            };
            vm.getlastModifierUserName = function (userId) {
                commonLookupService.getUser({
                    id: userId
                }).success(function (result) {
                    vm.lastModifierUserName = result.name + " " + result.surname;
                });
            };

            vm.getExcessRateCDW = function (value) {
                if (value) {
                    value.charges.forEach(function (chargesRow) {
                        if (chargesRow.chargesType.chargesCategory == 2 && chargesRow.accepted)
                            vm.cdwRate = chargesRow.excessRate;
                        if (vm.cdwRate == 0)
                            vm.cdwRate = '';
                    });
                }
                return vm.cdwRate;
            };
            //funcation is made for autoLease by saadat
            vm.totalDaysAndTime = function () {
                var startDate = moment(vm.agreement.startDate);
                var endDate = moment(vm.agreement.endDate);

                if (startDate.isValid() && endDate.isValid()) {
                    var duration = moment.duration(moment(endDate.format("LLLL")).diff(moment(startDate.format("LLLL"))));
                    // vm.totalDays = duration.days();
                    vm.totalDays = moment(endDate.format("LLLL")).diff(moment(startDate.format("LLLL")), 'days');

                }

            };


            vm.getOneMonthCharges = function () {
                var result = vm.agreement.charges.find(c => c.chargesTypeId == 1 && c.units > 0);
                if (result != null) {
                    var totalAmount = result.units * result.rate;
                    return (vm.agreement.totalCharges - totalAmount) + result.rate;
                }
            };

            vm.getOneMonthChargesAndTax = function () {
                var rentalCharges = vm.agreement.charges.find(c => c.chargesTypeId == 1 && c.units > 0);
                if (rentalCharges != null) {
                    if (vm.agreement.status == 1) {
                        return rentalCharges.rate + vm.agreement.tax;
                    }
                    else if (vm.agreement.status == 2) {
                        return (rentalCharges.units * rentalCharges.rate) + vm.agreement.tax;
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


            vm.getCardType = function (id) {
                if (id == 1) {
                    return "Master Card";
                }
                else if (id == 2) {
                    return "Visa";
                }
                else if (id == 3) {
                    return "American Express";
                }
                else {
                    return "";
                }
            };


            vm.agreementDateDiffDays = function (endDate, startDate) {
                var dateDiffrence = (new Date(endDate) - new Date(startDate)) / 1000 / 60 / 60 / 24;
                return dateDiffrence;
            }

            var chargesTypes = {
                rent: 1,
                cdw:2,
                fuelCharges: 4,
                mileageCharges: 5,
                tolls: 7,
                fines: 8,
                driverCharges: 23,
                tollsSurcharge: 33,
                finesSurcharge: 34,
                extra1Charges: 54,
                extra2Charges: 55,
                darbTolls: 73,
                darbTollsSurcharge: 74
            };
            vm.init = function (options) {

                vm.loading = true;
                agreementPrintService.getAgreementForPrint({
                    agreementId: agreementId,
                    printQR: options.printQr,
                    printUser: options.printUser,
                    printDailyWeeklyRentRates: options.printDailyWeeklyRentRates,
                    getContactCard: true,
                    getDiscountReason: options.getDiscountReason
                }).success(function (result) {
                    vm.agreement = result.agreement;
                    vm.contactCard = result.contactCard;
                    vm.actualEndDate = null;
                    getSplitCharges();
                    if (vm.isActualClosingDateForClosingAgreement && vm.agreement.status == 2) {
                        for (var i = 0; i < vm.agreement.charges.length; i++) {
                            if (vm.agreement.charges[i].chargesTypeId == chargesTypes.rent) {
                                vm.actualEndDate = vm.agreement.charges[i].notes;
                            }
                        }
                    }

                    if (vm.tenancyName == "SixtQatar") {
                        vm.agreement.charges
                            .filter(charge => charge.chargesTypeId === chargesTypes.extra2Charges)
                            .forEach(charge => {
                                charge.chargesType.name = 'UpSell';
                            });
                    }
                    if (vm.tenancyName == "SixtQatar") {
                        vm.agreement.charges
                            .filter(charge => charge.chargesTypeId === chargesTypes.extra1Charges)
                            .forEach(charge => {
                                charge.chargesType.name = 'Prepaid Fuel';
                            });
                    }
                    if (vm.tenancyName == "Moveo") {
                        vm.agreement.charges
                            .filter(charge => charge.chargesTypeId === chargesTypes.extra2Charges)
                            .forEach(charge => {
                                charge.chargesType.name = 'UpSell';
                            });
                    }
                    if (vm.tenancyName == "Moveo") {
                        vm.agreement.charges
                            .filter(charge => charge.chargesTypeId === chargesTypes.extra1Charges)
                            .forEach(charge => {
                                charge.chargesType.name = 'Prepaid Fuel';
                            });
                    }
                    if (vm.tenancyName == "rentsolutions") {
                        vm.agreement.charges
                            .filter(charge => charge.chargesTypeId === chargesTypes.extra2Charges)
                            .forEach(charge => {
                                charge.chargesType.name = 'Deposit Fee';
                            });
                    }
                   

                    vm.agreement.charges
                        .filter(charge => charge.chargesTypeId === chargesTypes.cdw)
                        .forEach(charge => {
                            if (charge.excessRate === 0) {
                                charge.chargesType.name = 'SCDW';
                            }
                        });

                    if (vm.agreement.clubRentalDriverAndFuelCharges) {
                        let clubChargesTotal = 0;
                        vm.agreement.charges.forEach(charge => {
                            if ([chargesTypes.rent, chargesTypes.driverCharges, chargesTypes.fuelCharges].includes(charge.chargesTypeId)) {
                                clubChargesTotal += charge.charges;
                            }
                        });
                        vm.agreement.clubRentalDriverAndFuelChargesTotal = clubChargesTotal;
                    }

                    if (vm.isStartDateOfAgreementAsDeliveryDate && startDateAsDeliveryDate) {
                        vm.agreement.startDate = vm.agreement.expectedDeliveryDate;
                    }
                    if (appSession.tenant.tenancyName == 'RentyCarRentalLLC')
                        vm.getPayments();
                    vm.discountReason = result.discountReason;
                    vm.deposit = result.deposit;
                    if (vm.agreement.charges.some(e => e.chargesTypeId == 1))
                        vm.rentalRate = vm.agreement.charges.filter(e => e.chargesTypeId == 1)[0].rate;

                    if (vm.agreement.charges.some(e => e.chargesTypeId == 5)) {
                        vm.allowedKms = vm.agreement.charges.filter(e => e.chargesTypeId == 5)[0].limit;
                        vm.allowedKmsRate = vm.agreement.charges.filter(e => e.chargesTypeId == 5)[0].rate;
                        vm.kmsRateType = vm.agreement.charges.filter(e => e.chargesTypeId == 5)[0].rateType.name;
                    }


                    if (vm.agreement.charges.some(e => e.chargesTypeId == 7))
                        vm.tollCharges = vm.agreement.charges.filter(e => e.chargesTypeId == 7)[0].rate;


                    if (vm.agreement.charges.some(e => e.chargesTypeId == 28))
                        vm.damageCharges = vm.agreement.charges.filter(e => e.chargesTypeId == 28)[0].rate;


                    if (vm.deposit) {
                        vm.trn = vm.deposit.location.taxId;
                        getBillingMethods();
                    }
                    vm.getUserName(vm.agreement.creatorUserId);
                    if (vm.agreement.lastModifierUserId && vm.agreement.status == 2)
                        vm.getlastModifierUserName(vm.agreement.lastModifierUserId);

                    if (vm.agreement.signature) {
                        vm.urlWithToken = vm.agreement.signature.url;
                        vm.showSignatureButton = false;
                    }

                    if (vm.agreement && vm.agreement.signature && vm.agreement.signature.url) {
                        vm.customerSignatureURL = vm.agreement.signature.url;
                    }

                    if (vm.agreement && vm.agreement.userSignature && vm.agreement.userSignature.url) {
                        vm.userSignatureURL = vm.agreement.userSignature.url;
                    }

                    if (vm.agreement.movements && vm.agreement.movements.length > 0) {
                        var sig = vm.agreement.movements[0].outDetail.customerSignature;
                        if (sig) {
                            vm.checkoutSignatureUrl = "data:image/png;base64," + sig;
                        }
                    }
                    if (vm.agreement.movements && vm.agreement.movements.length > 0) {
                        var sig = vm.agreement.movements[0].outDetail.staffSignature;
                        if (sig) {
                            vm.checkoutStaffSignatureUrl = "data:image/png;base64," + sig;
                        }
                    }


                    if (vm.agreement.userSignature) {
                        vm.userSignatureUrl = vm.agreement.userSignature.url;
                    }

                    vm.advance = result.advance;
                    vm.refund = result.refund;
                    vm.creditNoteSum = result.creditNoteSum;
                    vm.paymentInstruction = result.paymentInstruction;
                    vm.totalDaysAndTime();
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
                                break;
                            }
                        }
                        // vm.cumtomerDrivingLicense = vm.agreement.customer.identityDocuments.filter(e => e.identityDocumentType == 4)[0];
                        vm.cumtomerPassport = vm.agreement.customer.identityDocuments.filter(e => e.identityDocumentType == 2)[0];
                        vm.cumtomerNationalId = vm.agreement.customer.identityDocuments.filter(e => e.identityDocumentType == 3)[0];
                        vm.cumtomerCreditId = vm.agreement.customer.identityDocuments.filter(e => e.identityDocumentType == 8)[0];
                        // vm.cumtomerOtherDocument = vm.agreement.customer.identityDocuments.filter(e => e.identityDocumentType == 5)[0];
                        //vm.companyTradeLicense = vm.agreement.customer.identityDocuments.filter(e => e.identityDocumentType == 1)[0];
                    }


                    // Customer Driving Lisence
                    if (vm.agreement.customer.identityDocuments.length > 0) {
                        angular.forEach(vm.agreement.customer.identityDocuments, function (value, key) {
                            if (value.identityDocumentType == 4) {
                                vm.customerDrivingLisence = vm.agreement.customer.identityDocuments[key];
                            }
                            if (value.identityDocumentType == 1) {
                                vm.customerTradeLicense = vm.agreement.customer.identityDocuments[key];
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
                        //angular.forEach(vm.agreement.driver.identityDocuments, function (value, key) {
                        //    if (value.identityDocumentType == 4) {

                        //        if (vm.checkVar == false) {
                        //            vm.driverDoc = vm.agreement.driver.identityDocuments[key];
                        //            vm.checkVar = true;
                        //        }
                        //    }
                        //});
                        var passportCheck = true;
                        for (var i = 0; i < vm.agreement.driver.identityDocuments.length; i++) {
                            if (vm.agreement.driver.identityDocuments[i].identityDocumentType == 4 && !vm.checkVar) {
                                vm.driverDrivingLisence = vm.agreement.driver.identityDocuments[i];
                                vm.checkVar = true;
                            }
                            if (vm.agreement.driver.identityDocuments[i].identityDocumentType == 2) {
                                vm.driverDoc = vm.agreement.driver.identityDocuments[i];
                                passportCheck = false;
                            }
                            if (vm.agreement.driver.identityDocuments[i].identityDocumentType == 3) {
                                if (passportCheck) {
                                    vm.driverDoc = vm.agreement.driver.identityDocuments[i];
                                }
                                else {
                                    vm.driverNationalId = vm.agreement.driver.identityDocuments[i];
                                }
                            }
                        }
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


                    vm.contactCard = result.contactCard;

                    var milagenotes = '';
                    angular.forEach(result.agreement.charges, function (value, key) {
                        if (value.notes != null) {
                            milagenotes = value.notes;
                        }
                    }, result.agreement.charges);

                    if (milagenotes != null) {
                        vm.chargeNotes = milagenotes.split(",")
                    }

                    vm.closedStatus = false;
                    if (result.agreement.status == 2) {
                        vm.closedStatus = true;
                    }

                    //sum of all recurring charges
                    vm.recurringChargesSum = vm.agreement.charges.filter(c => c.rateTypeId == 1 || c.rateTypeId == 2 || c.rateTypeId == 3).reduce(function (a, b) {
                        return {
                            rate: a.rate + b.rate,
                            tax: a.tax + b.tax
                        };
                    });
                    
                    function getSplitCharges() {
                        vm.isSplit = false;
                        vm.agreement.charges.forEach(function (charge) {
                            if (charge.invoiceToDriver) {
                                vm.isSplit = true;
                            }
                            });
                    };

                    //var driverCharges = vm.agreement.charges.find(c => c.invoiceToDriver);
                    //if (driverCharges != null) {
                    //    vm.isSplitInvoice = driverCharges.invoiceToDriver;
                    //}

                }).finally(function () {
                    vm.loading = false;
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
