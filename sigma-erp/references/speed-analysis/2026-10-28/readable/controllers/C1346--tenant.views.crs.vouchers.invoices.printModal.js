// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:360849-363870
appModule.controller('tenant.views.crs.vouchers.invoices.printModal', ['$stateParams', '$scope', '$sce', '$uibModal', 'appSession', 'abp.services.app.invoicePrint', 'abp.services.app.agreementPrint', 'abp.services.app.qRLabel',
        'abp.services.app.commonLookup', 'abp.services.app.toll', 'abp.services.app.parkingTicket', 'abp.services.app.rentalMasterAgreement', 'abp.services.app.limoTrip', '$filter', 'utilities', 'abp.services.app.uaeFine', 'abp.services.app.dataTranslation', 'abp.services.app.asset', 'abp.services.app.qRLabel', 'abp.services.app.invoice',
        function ($stateParams, $scope, sce, $uibModal, appSession, invoicePrintService, agreementPrintService, qrService, commonLookupService, tollService, parkingTicketService, masterAgreementService, limoTrips, $filter, utilities, fineService, dataTranslationService, assetService, qrlabelService, invoiceService) {

            var vm = this;
            vm.tenantName = appSession.tenant.name;
            vm.tenancyName = appSession.tenant.tenancyName;
            vm.tenantId = appSession.tenant.tenantId;
            vm.locationId = appSession.user.locationId;
            vm.chargesTypes = [];
            vm.tollsData = [];
            vm.finesData = [];
            vm.invoice = null;
            vm.qrCode = null;
            vm.vehicleId = 0;
            vm.saving = false;
            vm.skipCount = 0;
            vm.printDocumentsWithInvoice = false;
            vm.printInvoiceDocumentsWithInvoice = false;
            vm.chargesTypeWiseSummary = false;
            vm.loadingMasterAgreement = false;
            vm.vehicles = null;
            vm.printHeader = true;
            vm.printDetails = true;
            vm.isLogin = true;
            vm.imageUrls = [];
            vm.invoiceImageUrls = [];
            vm.assetDiscountTax = 0;
            vm.incrementValue = 1;
            vm.salikTransectionInvDate = false;
            vm.userName = appSession.user.name;
            vm.userNameLogin = appSession.user.name + ' ' + appSession.user.surname;
            var invoiceId = 0;
            var previewInvoice = null;
            vm.localize = (key) => app.localize(key);
            vm.currency = abp.setting.get("App.General.CurrencyCode");
            vm.defaultCurrencyCode = abp.setting.get("App.General.CurrencyCode");
            vm.isMultiCurrencyEnabled = abp.features.isEnabled('Core.MultiCurrency');
            vm.isCreditNoteAmountInInvoice = abp.features.isEnabled('CRS.CustomFeatures.CreditNoteAmountInInvoice');
            vm.isPointJuntion = appSession.tenant.tenancyName.toLowerCase() == 'pointjunction';
            vm.isThousand = appSession.tenant.tenancyName.toLowerCase() == 'thousandrac';
            vm.currencyName = abp.setting.get("App.General.CurrencyName");
            vm.isSalikModuleEnabled = abp.features.isEnabled("CRS.Tolls.Salik");
            vm.isParkingModuleEnabled = abp.features.isEnabled("CRS.Parking");
            vm.castleLimoAmountInWords = "";
            //Modified by arslan for Qatar fines
            vm.isDxbFinesModuleEnabled = abp.features.isEnabled("CRS.Fines.DubaiPolice");
            vm.isAuhFinesModuleEnabled = abp.features.isEnabled("CRS.Fines.AbuDhabiPolice");
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.isQtrFinesModuleEnabled = abp.features.isEnabled("CRS.Fines.Qatar");
            vm.isWorkshopModuleEnabled = abp.features.isEnabled("WORKSHOP");
            vm.isFineModuleEnabled = vm.isAuhFinesModuleEnabled || vm.isDxbFinesModuleEnabled || vm.isQtrFinesModuleEnabled ? true : false;
            vm.fileName = appSession.tenant.tenancyName.toLowerCase() + '-' + 'header.png';
            vm.invoicePaymentDetail = sce.trustAsHtml(app.localize('InvoicePaymentDetail'));
            vm.invoicePaymentDetailAr = sce.trustAsHtml(app.localize('InvoicePaymentDetailAr'));
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.isTaxEnabled = abp.features.isEnabled("CRS.Tax");
            vm.isAccountsEnabled = abp.features.isEnabled('CRS.Accounts');
            vm.updateTRN = abp.features.isEnabled("CRS.CustomFeatures.UpdateTRN");
            //vm.customerWiseTrnBasedOnPeriod = abp.features.isEnabled("CRS.CustomFeatures.CustomerWiseTrnBasedOnPeriod");
            vm.tollSurcharge = parseFloat(abp.setting.get("App.General.TollsSurCharge"));
            vm.darbTollsSurCharge = parseFloat(abp.setting.get("App.General.DarbTollsSurCharge"));
            vm.parKingSurcharge = parseFloat(abp.setting.get("App.General.ParkingSurCharge"));
            vm.trafficFineSurCharge = parseFloat(abp.setting.get("App.General.TrafficFineSurCharge"));
            vm.isSaleOrderEnabled = abp.features.isEnabled("CRS.Vouchers.SaleOrders");
            vm.allowPrintingOfVoidedVouchers = abp.setting.getBoolean("App.General.AllowPrintingOfVoidedVouchers");
            vm.isPrintSaleOrderInvoice = utilities.parseBoolean(abp.setting.get("App.General.PrintSaleOrderWithInvoice"));
            vm.isCommercialRegistrationNumber = utilities.parseBoolean(abp.setting.get("App.Speed.Common.CommercialRegistrationNumberInPrint"));
            vm.selectChargesTypeInMiscInvoice = utilities.parseBoolean(abp.setting.get("App.Speed.Common.SelectChargesTypeInMiscInvoice"));
            vm.agreementNotesInInvoiceDescription = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ShowAgreementNotesInInvoiceDescription"));
            vm.isEInvoicingUAEEnabled = abp.features.isEnabled("Core.Integration.EInvoicingUAE");
            vm.isCustomerCutoffDateForInvoicePrint = abp.features.isEnabled("Core.Integration.EInvoicingUAE.CustomerCutoffDateForInvoicePrint");

            vm.isPrintSaleOrderWithInvoiceEnabled = vm.isSaleOrderEnabled && vm.isPrintSaleOrderInvoice ? true : false;
            vm.trn = '';
            vm.totalSurcharge = 0;
            vm.amount = 0;
            vm.amountWithSurcharge = 0;
            vm.tollLenth = 0;
            vm.isSameVehicle = false;
            vm.isSameVessel = false;
            vm.customSerial = 0;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.tripsPerPage = 5;
            vm.noOfpages = 0;
            vm.pages = [];
            vm.isMergedRentalInvoice = false;
            vm.isPostTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.PostTaxInclusive"));
            vm.isTaxInclusivePrint = vm.isTaxInclusive;
            // Convert ng-src (~ path) to full absolute URL before export
            vm.logoUrl = window.location.origin + '/App/images/tenantImages/' + vm.fileName;
            vm.isCar2Go = false
            vm.isCar2GoLbn = false;
            vm.currentDateTime = new Date();
            var recordsPerPage = 6;
            if (vm.isPostTaxInclusive) {
                vm.isTaxInclusivePrint = false;
            }
            if (appSession.tenant.tenancyName == "Galadaritrucks") {
                recordsPerPage = 5;
            }
            if (appSession.tenant.tenancyName == "MorningStarWS") {
                recordsPerPage = 8;
            }
            if (appSession.tenant.tenancyName == "advanced") {
                recordsPerPage = 8;
            }
            if (appSession.tenant.tenancyName == "GargashLeasing") {
                recordsPerPage = 5;
            }
            if (appSession.tenant.tenancyName == "qabandi") {
                recordsPerPage = 5;
            }
            if (appSession.tenant.tenancyName == "fixera") {
                recordsPerPage = 10;
            }
            if (appSession.tenant.tenancyName == "rentsolutions") {
                recordsPerPage = 7;
            }
            if (appSession.tenant.tenancyName == "AMRACSQatar") {
                recordsPerPage = 10;
            }
            if (appSession.tenant.tenancyName == "Car2Go") {
                vm.isCar2Go = true;
            }
            if (appSession.tenant.tenancyName == "Car2GoLbn") {
                vm.isCar2GoLbn = true;
            }
            if ($scope.$parent !== null) {
                if ($scope.$parent.invoiceId.id) {
                    invoiceId = $scope.$parent.invoiceId.id;
                    vm.printHeader = !($scope.$parent.invoiceId.printHeader);
                    vm.printDetails = !($scope.$parent.invoiceId.printDetails);
                }
                else {
                    previewInvoice = $scope.$parent.$parent.vmMain.previewVoucher;
                }
            }
            $scope.$watch('printDocumentsWithInvoice', function (newValue) {
                if (newValue === true) {
                    vm.printDocumentsWithInvoice = newValue;
                } else {
                    vm.printDocumentsWithInvoice = false;
                }
            });
            $scope.$watch('printInvoiceDocumentsWithInvoice', function (newValue) {
                if (newValue === true) {
                    vm.printInvoiceDocumentsWithInvoice = newValue;
                } else {
                    vm.printInvoiceDocumentsWithInvoice = false;
                }
            });
            $scope.$watch('chargesTypeWiseSummary', function (newValue) {
                if (newValue === true) {
                    vm.chargesTypeWiseSummary = newValue;
                } else {
                    vm.chargesTypeWiseSummary = false;
                }
            });
            $scope.$on('nameChanged', function (event, value) {
                vm.chargesTypeWiseSummary = value;
            });
            if (invoiceId <= 0) {
                if (!isNaN($stateParams.query)) {
                    invoiceId = $stateParams.query;
                }
            }
            vm.getRateAfterDiscount = function (row) {
                if (row.discountPercent > 0)
                    return row.rate - (row.rate * (row.discountPercent / 100));
                return row.rate;

            };
            vm.getServerName = function (server) {
                if (server == 1) {
                    return app.localize('Dubai');
                }
                else if (server == 2) {
                    return app.localize('AbuDhabi');
                }
            }
            vm.currencyAndRounding = function (value) {
                if (value == null) return null;

                return value.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            };
            //for enjoy car rental
            vm.currencyAndRoundingEnjoy = function (value) {
                if (value == null) return null;

                var rounded = Math.round(value * 100) / 100;
                if (rounded === 0) {
                    rounded = 0; 
                }

                return vm.currencyAndRounding(rounded);
            };

            //--------------For GargashLeasing---------------

            vm.oldTRN = '100051181400003';
            vm.newTRN = '104681493300003';
            vm.cutoffDate = new Date('2024-10-01');

            vm.getTRN = function (invoiceDateObj) {
                var invoiceDateObj = new Date(vm.invoice.date);
                return invoiceDateObj < vm.cutoffDate ? vm.oldTRN : vm.newTRN;
            };

            //--------------GargashLeasing End---------------


            vm.currencyAndRoundingWithThree = function (value) {
                if (value == null) return null;

                return value.toLocaleString('en', { minimumFractionDigits: 3, maximumFractionDigits: 3 })
            };
            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };
            vm.removeBrTags = function (str) {
                // Replace <br> tags with an empty string
                return str.replace(/<br\s*\/?>/gi, ', ');
            }

            vm.extractNumber = function (text) {
                return text.match(/\d+/)[0];
            };

            vm.getColspan = function () {
                if (!vm.trips && vm.trips.length <= 0) return;
                if (!vm.trips[0].tripCharges && vm.trips[0].tripCharges.length <= 0) return;
                return vm.trips[0].tripCharges.length + 2;
            };

            vm.currencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };


            vm.getColspanForRegency = function () {
                if (!vm.trips && vm.trips.length <= 0) return;
                if (!vm.trips[0].tripCharges && vm.trips[0].tripCharges.length <= 0) return;

                var discountCharges = vm.trips[0].tripCharges.filter(r => r.chargesTypeId == 22)[0];
                if (discountCharges) {
                    return vm.trips[0].tripCharges.length + 1;
                }
                else {
                    return vm.trips[0].tripCharges.length + 2;
                }
            };
            vm.getColspanForAutobahn = function () {
                if (!vm.trips && vm.trips.length <= 0) return;
                if (!vm.trips[0].tripCharges && vm.trips[0].tripCharges.length <= 0) return 2;

                var discountCharges = vm.trips[0].tripCharges.filter(r => r.chargesTypeId == 22)[0];
                if (discountCharges) {
                    return vm.trips[0].tripCharges.length + 3;
                }
                else {
                    return vm.trips[0].tripCharges.length + 4;
                }
            };

            vm.getTotalRate = function () {
                var total = 0;

                angular.forEach(vm.pagesData[vm.pagesData.length - 1].voucherLinesdataToIterate, function (voucherLine) {
                    if (voucherLine.credit != 0 && !voucherLine.hidden && vm.invoice.voucherSubTypeId != 17) {
                        // skip discounts
                        if (voucherLine.chargesType && voucherLine.chargesType.name === "Discount") {
                            return;
                        }

                        if (voucherLine.chargesType.id == 1) {
                            // loop through charges inside agreement
                            angular.forEach(vm.invoice.agreement.charges, function (chargesRow) {
                                if (chargesRow.chargesTypeId == 1) {
                                    total += parseFloat(chargesRow.rate) || 0;
                                }
                            });
                        } else {
                            total += parseFloat(voucherLine.rate) || 0;
                        }
                    }
                });

                return total;
            };





            vm.incrementFunction = function (item) {
                vm.incrementValue += 1;
                return vm.incrementValue;
            };

            vm.getDaysInDate = function (startDate, endDate) {
                var dateDiffrence = (new Date(endDate) - new Date(startDate)) / 1000 / 60 / 60 / 24;
                var result = Math.round(parseFloat(dateDiffrence));
                //var result = dateDiffrence.toString().split(".")[0]
                if (result == 0) {
                    //for only one day agreement open and close on same date
                    return 1;
                }
                else {
                    return result;
                }
            };
            vm.getDaysInDateGoldStar = function (startDate, endDate) {
                var start = new Date(startDate);
                var end = new Date(endDate);

                // Difference in milliseconds
                var diffMs = end - start;

                // Full days
                var days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

                // Remaining milliseconds
                var remainderMs = diffMs % (1000 * 60 * 60 * 24);

                // Convert remainder to minutes
                var remainderMinutes = remainderMs / (1000 * 60);

                // If remainder > 60 minutes → add 1 extra day
                if (remainderMinutes > 60) {
                    days += 1;
                }

                // If still 0 days → return 1 (same-day case)
                if (days === 0) {
                    return 1;
                }
                if (days >= 30) {
                    return 1;
                }
                return days;
            };

            vm.getDays = function (voucherLine) {

                vm.invoice.agreement.charges.forEach(function (chargesRow) {
                    if (chargesRow.chargesTypeId == 1) {
                        var dailyRate = 0;
                        if (chargesRow.rateTypeId == 3)
                            dailyRate = chargesRow.rate / 30
                        if (chargesRow.rateTypeId == 2)
                            dailyRate = chargesRow.rate / 7;
                        if (chargesRow.rateTypeId == 1)
                            dailyRate = chargesRow.rate / 1;

                        vm.totalDays = Math.round(voucherLine.credit / dailyRate);

                    }
                });
                return vm.totalDays;
            };


            vm.getColspanForClassWorlWide = function () {
                if (!vm.trips) return;
                if (!vm.trips[0].tripCharges) return;

                var value = 2;
                var limoFare = vm.trips[0].tripCharges.filter(r => r.chargesTypeId == 23)[0];
                var driverCharges = vm.trips[0].tripCharges.filter(r => r.chargesTypeId == 24)[0];
                var waitingCharges = vm.trips[0].tripCharges.filter(r => r.chargesTypeId == 25)[0];
                if (limoFare) {
                    value = value + 1;
                }
                if (driverCharges) {
                    value = value + 1;
                }
                if (waitingCharges) {
                    value = value + 1;
                }
                return value;
            };
            vm.getChargesAfterDiscount = function (row) {
                if (row.chargesTypeId == 1) {
                    var discountRow = vm.invoice.voucherLines.filter(row => row.chargesTypeId == 22);
                    if (discountRow.length > 0) {
                        if (discountRow[0].credit > 0) {
                            return row.credit - discountRow[0].credit;
                        }
                        else {
                            return row.credit + discountRow[0].credit;
                        }
                    }
                    else {
                        return row.credit;
                    }
                }
                else {
                    return row.credit;
                }
            };

            vm.getChargesAfterDiscountByChargesType = (voucherLines) => {
                let credit = 0;
                voucherLines.forEach(vl => {
                    credit += vm.getChargesAfterDiscount(vl)
                });
                return credit;
            }

            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };
            vm.findQty = function (credit, row) {
                var taxPercentage = 5; // 5% tax

                var originalPrice = row.rate / (1 + taxPercentage / 100);
                if (row.rate == 0)
                    originalPrice = row.charges / (1 + taxPercentage / 100);

                if (row.chargesTypeId == 5) {
                    originalPrice = row.excessRate / (1 + taxPercentage / 100);
                }


                var qty = credit / originalPrice;
                vm.ratePerDays = 0;
                vm.isRatePerDays = false;

                if (qty < 1) {
                    if (row.rateTypeId == 3) {
                        var ratePerDay = row.rate / 30;

                        qty = credit / ratePerDay;
                        vm.isRatePerDays = true;
                        row.ratePerDay = ratePerDay;

                    }


                }

                return vm.roundingZero(qty);
            };

            vm.calculateDiscountedPrice = function (inclusivePrice) {
                var taxPercentage = 5; // 5% tax
                var originalPrice = inclusivePrice / (1 + taxPercentage / 100);

                return vm.currencyAndRounding(originalPrice);
            }
            vm.getSrNo = function (index, isEven) {
                var tmp = index % 2;
                if (isEven == 1) {
                    if (tmp == 0)
                        return index;
                    else
                        return index + 1;

                } else {
                    if (tmp == 0)
                        return index + 1;
                    else
                        return index;

                }
            }
            vm.calculateDiscountedPriceTax = function (inclusivePrice) {
                var taxPercentage = 5; // 5% tax
                var originalPrice = inclusivePrice / (1 + taxPercentage / 100);

                return vm.currencyAndRounding(inclusivePrice - originalPrice);
            }

            vm.roundingWithZero = function (value) {
                var amount = Math.round(value, 0);
                return amount.toFixed(2);
            };
            vm.roundingZero = function (value) {
                var amount = Math.round(value, 0);
                return amount;
            }
            vm.getSalikInvoiceVehicle = function (value) {
                value.voucherLines.forEach(function (vehicleList) {
                    if (!vehicleList.hidden)
                        vm.plateNoForSalik = vehicleList.vehicle.plateNo;
                });
                return vm.plateNoForSalik;
            };

            vm.getVoucherType = function (subType) {
                return utilities.getVoucherType(1, subType);
            };

            vm.onImageError = function () { vm.imgError = true; };

            vm.localize = function (input) {
                var localizeValue;
                if (input) {
                    localizeValue = app.localize(input);
                    return localizeValue;
                }
                return;
            };
            vm.getFuelLevel = function (value) {
                return utilities.getFuelLevel(value);
            };

            function bottomFunction(contentHeight) {
                //1058 per A4 page height
                if (contentHeight <= 1058) {
                    $('#signatureRow').height(1058 - contentHeight);
                }
                else if (contentHeight > 1058 && contentHeight <= 2116) {
                    //170 is header and footer height so 370 is included for second page bottom footer.
                    $('#signatureRow').height(2116 - (contentHeight + 370));
                }

                //else {
                //    var divideResult = parseInt(contentHeight / 1058, 10);
                //    var finalHeight = contentHeight - (1058 * divideResult);
                //    $('#signatureRow').height(finalHeight - (170 * divideResult));
                //}


            }


            //window.onbeforeprint = function () {
            //Galadari fotter issue
            //    var contentHeight = $('#print-content').height();
            //    bottomFunction(contentHeight);
            //};


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
                } else if (agreementType == 4) {
                    return "Lease";
                } else {
                    return "";
                }
            };

            vm.getRateType = function (agreementType) {
                if (agreementType == null)
                    return "";

                if (agreementType == 1) {
                    return "Daily";
                } else if (agreementType == 2) {
                    return "Weekly";
                } else if (agreementType == 3 || agreementType == 4) {
                    return "Monthly";
                } else {
                    return "";
                }
            };
            vm.getlocalDateYear = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format("YYYY");
                }
                else {
                    return "";
                }
            };
            vm.getlocalDate = function (date, format) {
                if (date != null) {
                    if (!format) format = vm.dateTimeFormat;

                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(format);
                } else {
                    return "";
                }
            };
            vm.getlocalDateTime = function (date, format) {
                if (date != null) {
                    if (format == null) format = vm.dateTimeFormat;

                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(format);
                } else {
                    return "";
                }
            };

            vm.getDateTimeFormet = function (date) {
                if (date != null) {
                    return moment(date, 'YYYY-MM-DD HH:mm:ss.SSS').format(vm.dateTimeFormat);
                } else {
                    return "";
                }
            };

            // this function is also using in gargashleasing
            vm.getlocalDateTimeNew = function (date) {
                if (date != null) {
                    //var localTime = moment.utc(date).toDate();
                    //return moment(localTime).format(vm.dateTimeFormat);
                    return moment(date).utc().format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };
            var groupBy = function (data, key) {
                let groupByArray = data.reduce((r, a) => {
                    r[a[key]] = [...r[a[key]] || [], a];
                    return r;
                }, {});
                return groupByArray;
            };


            vm.getDateTimeForSalik = function (date) {
                if (date != null) {
                    return moment(date).utc().format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            }

            vm.getOriginalDateTime = function (date, format) {
                if (date != null) {
                    if (format == null) format = vm.dateTimeFormat;

                    return moment(date).utc().format(format);
                } else {
                    return "";
                }
            };
            vm.getOriginalDateYear = function (date) {
                if (date != null) {
                    //var localTime = moment.utc(date).toDate();
                    return moment(date).utc().format("YYYY");
                }
                else {
                    return "";
                }
            };
            vm.getfourdigitserial = function (number) {

                var str = "" + number;
                while (str.length < 4) str = "0" + str;
                return str;


            };
            vm.getDetailsForMergPrint = function () {

                vm.invoice.voucherLines.forEach(function (row) {
                    if (!row.hidden) {
                        row.tariffGroupId = row.vehicle.tariffGroupId;
                        row.tariffGroupTitle = row.vehicle.tariffGroup.title;

                    }
                });
                vm.groupByTariffGroup = [];
                vm.groupByTariffGroup = groupBy(vm.invoice.voucherLines.filter(e => !e.hidden), 'tariffGroupId');
                vm.tariffGroupWiseData = [];

                for (var row in vm.groupByTariffGroup) {
                    vm.totalChargesTarrifGroup = 0;
                    vm.rateAverage = 0;
                    vm.ratesum = 0;
                    for (var inner in vm.groupByTariffGroup[row]) {

                        vm.totalChargesTarrifGroup = vm.groupByTariffGroup[row][inner].credit + vm.groupByTariffGroup[row][inner].tax + vm.totalChargesTarrifGroup;
                        for (var chargerow in vm.groupByTariffGroup[row][inner].agreement.charges) {
                            vm.ratesum = vm.groupByTariffGroup[row][inner].agreement.charges[chargerow].rate + vm.ratesum;
                            if (vm.groupByTariffGroup[row][inner].agreement.charges[chargerow].taxable) {

                                vm.ratesum = vm.ratesum + ((vm.groupByTariffGroup[row][inner].agreement.taxPercent / 100) * vm.groupByTariffGroup[row][inner].agreement.charges[chargerow].rate);

                            }

                        }



                    }
                    vm.rateAverage = vm.ratesum / vm.groupByTariffGroup[row].length;
                    var obj = {





                        vehicleType: vm.groupByTariffGroup[row][0].tariffGroupTitle,
                        agreementsCount: [...new Set(vm.groupByTariffGroup[row].map(item => item.agreementId))].length,
                        rate: vm.rounding(vm.rateAverage),//vm.groupByTariffGroup[row][0].agreement.charges[0].rate,
                        rateType: vm.groupByTariffGroup[row][0].agreement.charges[0].rateType.name,
                        totalCharges: vm.rounding(vm.totalChargesTarrifGroup)//vm.groupByTariffGroup[row][0].agreement.totalCharges,
                    }
                    obj.totalDuration = vm.rounding(obj.totalCharges / (obj.agreementsCount * obj.rate));
                    //obj.totalCharges = vm.rounding(obj.totalCharges * obj.rate * obj.agreementsCount);
                    vm.tariffGroupWiseData.push(obj);
                }

                vm.getTotalAmountInWordsTarrifGroup();

            };

            vm.decriptionBreakOnFuel = function (description) {
                if (description == null) {
                    return '';
                }
                else {
                    // var splitDescription = description.split("fuel").join('<br/>');
                    // splitDescription[0] = splitDescription[0].concat("fuel");
                    // return replaceLineBreaksWithHTML(splitDescription);
                    var splitDescription = description.split(".");
                    splitDescription[0] = splitDescription[0].concat('<br/>');
                    return splitDescription.length > 1 ? splitDescription[0].concat(splitDescription[1]) : splitDescription[0];
                    //return splitDescription;
                }
            };

            vm.getlocalDateTimeWithMonth = function (date, format) {
                if (date != null) {
                    if (format == null) format = vm.dateFormat;

                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format("DD-MMM-YYYY");
                } else {
                    return "";
                }
            };
            vm.getInvoiceTypeById = function (voucherSubTypeId) {
                if (voucherSubTypeId == 1) return app.localize("RentalInvoice");
                else if (voucherSubTypeId == 8) return app.localize("TollInvoice");
                else if (voucherSubTypeId == 7) return app.localize("FineInvoice");
                else if (voucherSubTypeId == 2) return app.localize("LimousineInvoice");
                else if (voucherSubTypeId == 14) return app.localize("LeaseInvoice");
                else if (voucherSubTypeId == 16) return app.localize('TransportationInvoice');
                else if (voucherSubTypeId == 17) return app.localize("AssetSaleInvoice");
                else if (voucherSubTypeId == 9) return app.localize("MiscellaneousInvoice")
                else if (voucherSubTypeId == 29) return app.localize("FuelInvoice");
                else if (voucherSubTypeId == 55) return app.localize("AccessoriesInvoice");

            };
            vm.findArrayLength = function (array, length) {
                var arrayLengthNull = $filter('filter')(array, {
                    description: null
                }, true).length;
                var arrayLengthEmpty = $filter('filter')(array, {
                    description: ''
                }, true).length;
                var a = length - (arrayLengthNull + arrayLengthEmpty);
                return a - 1;
            };

            vm.getlocalDateTimeForEngAr = function (date, format) {
                if (date != null) {
                    if (format == null) format = vm.dateFormat;

                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(format);
                } else {
                    return "";
                }
            };
            vm.getlocalDateShortFormat = function (date, format) {
                if (date != null) {
                    if (format == null) format = vm.dateFormat;

                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(format);
                } else {
                    return "";
                }
            };

            vm.getContractType = function (agreementTypeNo) {
                if (agreementTypeNo !== null) {
                    if (agreementTypeNo === 1)
                        return "Daily";
                    if (agreementTypeNo === 2)
                        return "Weekly";
                    if (agreementTypeNo === 3)
                        return "Monthly";
                }
            };

            vm.getDiscountedRate = function (rentRate, discountPercent) {
                let discount = utilities.round(rentRate * discountPercent / 100, 2);
                rentRate = rentRate - discount;

                return utilities.round(rentRate, 2);
            };

            //vm.getSalikInvoiceDetail = function (id) {
            //    
            //    vm.loading = true;
            //    tollService.getTollsForInvoice({
            //        invoiceId: id
            //    }).success(function (result) {
            //       // vm.tollsData = result;
            //        vm.getSalikInvoiceDetail = result;
            //        angular.forEach(vm.getSalikInvoiceDetail, function (value) {
            //            
            //            vm.totalSurcharge = vm.totalSurcharge + value.surcharge;
            //            vm.amount = vm.amount + value.amount;
            //            vm.amountWithSurcharge = vm.amountWithSurcharge + value.amountWithSurcharge;
            //            vm.tollLenth = vm.tollLenth + 1;
            //        })
            //        
            //    }).finally(function () {
            //        vm.loading = false;
            //    });

            //}
            function getTollsForAlthiqa() {

                vm.loading = true;

                tollService.getTollsForInvoice({
                    invoiceId: invoiceId,
                    server: 1
                }).success(function (result) {

                    vm.tollsData = result;

                    vm.groupedTolls = [];
                    vm.groupedTollsByAgreement = [];

                    vm.total = 0;
                    vm.tollAmount = 0;
                    vm.tollSurcharge = 0;

                    vm.isSalik = false;
                    vm.isMergedCase = false;

                    if (vm.tollsData.length > 0) {

                        vm.salikTransectionInvDate = true;

                        var lastIndex = vm.tollsData.length - 1;
                        vm.tollInvoiceFromDate = vm.tollsData[0].tripDateTime;
                        vm.tollInvoiceToDate = vm.tollsData[lastIndex].tripDateTime;

                        vm.isSalik =
                            vm.isSalikModuleEnabled &&
                            vm.invoice.voucherSubTypeId === 8;

                        var agreementIds = {};

                        angular.forEach(vm.tollsData, function (toll) {

                            vm.total += toll.amountWithSurcharge || 0;
                            vm.tollAmount += toll.amount || 0;
                            vm.tollSurcharge += toll.surcharge || 0;

                            agreementIds[toll.agreementId] = true;
                        });

                        var uniqueAgreementCount = Object.keys(agreementIds).length;

                        // =========================
                        // SALIK
                        // =========================
                        if (vm.isSalik) {

                            // SINGLE
                            if (uniqueAgreementCount === 1) {

                                vm.isMergedCase = false;

                                var tollsByAmount = {};

                                angular.forEach(vm.tollsData, function (toll) {

                                    if (!tollsByAmount[toll.amount]) {
                                        tollsByAmount[toll.amount] = [];
                                    }

                                    tollsByAmount[toll.amount].push(toll);
                                });

                                angular.forEach(tollsByAmount, function (tolls, amount) {

                                    vm.groupedTolls.push({
                                        amount: amount,
                                        count: tolls.length,
                                        tolls: tolls
                                    });
                                });
                            }

                            // MERGED
                            else {

                                vm.isMergedCase = true;

                                var groupedByAgreement = {};

                                angular.forEach(vm.tollsData, function (toll) {

                                    var agreementId = toll.agreementId;

                                    if (!groupedByAgreement[agreementId]) {
                                        groupedByAgreement[agreementId] = {
                                            agreementId: agreementId,
                                            agreementName: toll.agreementName || ('Agreement ' + agreementId),
                                            tollsByAmount: {}
                                        };
                                    }

                                    var group = groupedByAgreement[agreementId];

                                    if (!group.tollsByAmount[toll.amount]) {
                                        group.tollsByAmount[toll.amount] = [];
                                    }

                                    group.tollsByAmount[toll.amount].push(toll);
                                });

                                angular.forEach(groupedByAgreement, function (agreement) {

                                    var amounts = [];

                                    angular.forEach(agreement.tollsByAmount, function (tolls, amount) {

                                        amounts.push({
                                            amount: amount,
                                            count: tolls.length,
                                            tolls: tolls
                                        });
                                    });

                                    vm.groupedTollsByAgreement.push({
                                        agreementId: agreement.agreementId,
                                        agreementName: agreement.agreementName,
                                        amounts: amounts
                                    });
                                });
                            }
                        }

                        // =========================
                        // NON-SALIK
                        // =========================
                        else {

                            var tollsByAmount = {};

                            angular.forEach(vm.tollsData, function (toll) {

                                if (!tollsByAmount[toll.amount]) {
                                    tollsByAmount[toll.amount] = [];
                                }

                                tollsByAmount[toll.amount].push(toll);
                            });

                            angular.forEach(tollsByAmount, function (tolls, amount) {

                                vm.groupedTolls.push({
                                    amount: amount,
                                    count: tolls.length,
                                    tolls: tolls
                                });
                            });
                        }
                    }

                }).finally(function () {
                    vm.loading = false;
                });
            }
            function getTolls() {
                vm.loading = true;
                tollService.getTollsForInvoice({
                    invoiceId: invoiceId,
                    server: 1
                }).success(function (result) {
                    vm.tollsData = result;
                    vm.totalItems = result.length;
                    if (vm.tollsData.length > 0) {
                        vm.salikTransectionInvDate = true;
                        var lastIndex = vm.tollsData.length - 1;
                        vm.tollInvoiceFromDate = vm.tollsData[0].tripDateTime;
                        vm.tollInvoiceToDate = vm.tollsData[lastIndex].tripDateTime;
                        vm.total = 0;

                        var tollsByAmount = {};

                        vm.tollAmount = 0;
                        vm.tollSurcharge = 0;
                        angular.forEach(vm.tollsData, function (toll) {
                            vm.total += toll.amountWithSurcharge;

                            vm.tollAmount += toll.amount || 0;
                            vm.tollSurcharge += toll.surcharge || 0;

                            if (!tollsByAmount[toll.amount]) {
                                tollsByAmount[toll.amount] = [];
                            }
                            tollsByAmount[toll.amount].push(toll);
                        });

                        vm.groupedTolls = [];
                        for (var amount in tollsByAmount) {
                            if (tollsByAmount.hasOwnProperty(amount)) {
                                vm.groupedTolls.push({
                                    amount: amount, // Base amount
                                    count: tollsByAmount[amount].length,
                                    tolls: tollsByAmount[amount]
                                });
                            }
                        }
                    }

                }).finally(function () {
                    vm.loading = false;
                });
            }

            // Helper function to group tolls by amount
            function groupTollsByAmount(tolls) {
                let grouped = {};

                // Iterate through tolls and group them by their amount
                angular.forEach(tolls, function (toll) {
                    const amount = toll.amountWithSurcharge;

                    if (!grouped[amount]) {
                        grouped[amount] = 0;
                    }
                    grouped[amount]++;
                });

                // Convert grouped object to an array of objects
                let groupedArray = [];
                angular.forEach(grouped, function (count, amount) {
                    groupedArray.push({ amount: amount, count: count });
                });

                return groupedArray;
            }

            function getDarbTolls() {
                vm.loading = true;
                tollService.getTollsForInvoice({
                    invoiceId: invoiceId,
                    server: 2
                }).success(function (result) {
                    vm.darbTollsData = result;
                    if (vm.darbTollsData.length > 0) {
                        //vm.salikTransectionInvDate = true;
                        var lastIndex = vm.darbTollsData.length - 1;
                        vm.darbInvoiceFromDate = vm.darbTollsData[0].tripDateTime;
                        vm.darbInvoiceToDate = vm.darbTollsData[lastIndex].tripDateTime;
                        vm.darbTotal = 0;
                        vm.darbAmount = 0;
                        vm.darbSurcharge = 0;
                        angular.forEach(vm.darbTollsData, function (toll) {
                            vm.darbTotal += toll.amountWithSurcharge;
                            vm.darbAmount = toll.amount || 0;
                            vm.darbSurcharge = toll.surcharge || 0;
                        });
                    }

                }).finally(function () {
                    vm.loading = false;
                });
            }
            function getParkings() {
                vm.loading = true;
                parkingTicketService.getParkingsforInvoice({
                    invoiceId: invoiceId,
                    maxResultCount: 999,
                    skipCount: 0
                }).success(function (result) {
                    vm.parkingData = result.items;
                    if (vm.parkingData.length > 0) {
                        vm.parkingTotal = 0;
                        vm.totalAmount = 0;
                        vm.parkingAmount = 0;
                        vm.parkingSurcharge = 0;
                        angular.forEach(vm.parkingData, function (parking) {
                            vm.parkingTotal += parking.amountWithSurcharge;
                            vm.totalAmount += parking.totalAmount;
                            vm.parkingAmount = parking.paymentAmount || 0;
                            vm.parkingSurcharge = parking.surcharge || 0;
                        });
                    }

                }).finally(function () {
                    vm.loading = false;
                });
            }

            function getFines() {
                vm.loading = true;
                fineService.getFinesForInvoice({
                    invoiceId: invoiceId,
                }).success(function (result) {
                    vm.finesData = result;
                    vm.sRnoFine = 2;
                    vm.fineamount = 0;
                    vm.fineSurchargeAmount = 0;
                    vm.acknowledgmentAmount = 0;
                    vm.finesData.forEach(function (value) {
                        value.srNo = vm.sRnoFine;
                        vm.sRnoFine = vm.sRnoFine + 2;
                        vm.fineamount = value.amount || 0;
                        vm.fineSurchargeAmount = value.surcharge || 0;
                        vm.acknowledgmentAmount = value.acknowledgment || 0;
                    });
                    vm.fines = result; //remove after shifting dependencies to finesData


                }).finally(function () {
                    vm.loading = false;
                });
            }

            vm.getTaxCategory = function (id) {
                if (id == 1) {
                    return "5%";
                }
                else if (id == 2) {
                    return "Tax Exempted";
                }
                else if (id == 3) {
                    return "Zero Rated";
                }
                else {
                    return " ";
                }
            }
            vm.getTaxCategoryAlThiqa = function (id, tax) {
                if (id == 1) {
                    return (vm.invoice.taxPercent || 0) + "%";
                }
                else if (id == 2) {
                    return "Tax Expt";
                }
                else if (id == 3) {
                    return "0%";
                }
                else if (id === 4) {
                    if (tax > 0)
                        return (vm.invoice.taxPercent || 0) + "%";
                    else
                        return "OOS";
                }
                else {
                    return " ";
                }
            }
            vm.getTaxCategoryG = function (id, tax) {
                if (id == 1) {
                    return "5%";
                }
                else if (id == 2) {
                    return "Tax Exempted";
                }
                else if (id == 3) {
                    return "Zero Rated";
                }
                else if (id === 0) {
                    if (tax > 0)
                        return "5%";
                    else
                        return "Tax Exempted";
                }
                else {
                    return " ";
                }
            }

            vm.getTaxCategoryNew = function (id) {
                if (id == 1) {
                    return "Standard";
                } else {
                    return "Tax Exempted";
                }

            }

            vm.getNumberOfDays = function (fromDate, toDate) {
                const startDate = new Date(fromDate);
                const endDate = new Date(toDate);
                const timeDifference = endDate - startDate;
                const numberOfDays = Math.round(timeDifference / (1000 * 3600 * 24));

                return numberOfDays;
            };


            vm.getDescription = function () {

                var des = "";
                if (vm.invoice.fromDate != null && vm.invoice.toDate != null) {
                    "<br>"
                    des = "Period : " + vm.getlocalDateTime(vm.invoice.fromDate, 'DD-MMM-YYYY HH:mm') + " to " + vm.getlocalDateTime(vm.invoice.toDate, 'DD-MMM-YYYY HH:mm')
                }
                if (vm.invoice.agreement && vm.invoice.agreement.movements) {
                    var fromDate = new Date(vm.invoice.fromDate);
                    var toDate = new Date(vm.invoice.toDate);
                    var matched = null;

                    vm.invoice.agreement.movements.forEach(function (mov) {
                        var outDate = mov.outDetail && mov.outDetail.dateTime ? new Date(mov.outDetail.dateTime) : null;
                        var inDate = mov.inDetail && mov.inDetail.dateTime ? new Date(mov.inDetail.dateTime) : null;

                        if (outDate && inDate) {
                            if (fromDate <= inDate && toDate >= outDate) {
                                if (!matched || inDate > new Date(matched.outDetail.dateTime)) {
                                    matched = mov;
                                }
                            }
                        }
                    });

                    if (matched && matched.vehicle && vm.invoice.agreement.status == 2) {
                        des += ", " + matched.vehicle.make + " " + matched.vehicle.model + ", Vehicle : " + (matched.vehicle.plateNo || "");
                    }
                    else {
                        if (vm.invoice.agreement && vm.invoice.agreement.vehicle) {
                            des += ", " + vm.invoice.agreement.vehicle.make + " " + vm.invoice.agreement.vehicle.model + ", Vehicle : " + (vm.invoice.agreement.vehicle.plateNo || "");
                        }
                    }
                }

                if (vm.invoice.notes != null) {
                    des = des + ", " + vm.invoice.notes
                }
                vm.description = des;
            };

            vm.getUserName = function (userId) {
                commonLookupService.getUser({
                    id: userId
                }).success(function (result) {
                    vm.userName = result.name + ' ' + result.surname;
                });
            };

            vm.getToDateForDateToDateRule = function (date, format) {
                if (date != null) {
                    if (format == null) format = 'DD-MMM-YYYY';

                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).subtract(1, "days").format(format);
                } else {
                    return "";
                }
            };
            vm.validateDateCheck = function (invoice, format) {
                if (!invoice) return false;
                var dateTodate = false;
                var sameDay = false;
                var month = new Date(vm.getlocalDateTimeForEngAr(invoice.toDate, 'YYYY-MM-DD HH:mm')).getMonth() - new Date(vm.getlocalDateTimeForEngAr(invoice.fromDate, 'YYYY-MM-DD HH:mm')).getMonth();
                var fromDay = new Date(vm.getlocalDateTimeForEngAr(invoice.fromDate, 'YYYY-MM-DD HH:mm')).getDate();
                var toDay = new Date(vm.getlocalDateTimeForEngAr(invoice.toDate, 'YYYY-MM-DD HH:mm')).getDate();
                if (fromDay == toDay && month == 1)
                    sameDay = true;
                if (invoice.contact.invoicingRule == null) {
                    if (invoice.contact.contactType == 2 && invoice.contact.contactCategory == 1)
                        dateTodate = parseInt(abp.setting.get("App.General.InvoicingRuleIndividual")) == 1 ? true : false;
                    else if ((invoice.contact.contactType == 2 && invoice.contact.contactCategory == 2))
                        dateTodate = parseInt(abp.setting.get("App.General.InvoicingRuleCorporate")) == 1 ? true : false;
                } else {
                    dateTodate = invoice.contact.invoicingRule == 1 ? true : false;
                }
                return invoice.voucherSubTypeId && invoice.voucherSubTypeId == 1 && dateTodate && sameDay;
            };
            vm.sumPerTrip = function (tripCharges) {
                var sum = 0.0;
                tripCharges.forEach(function (value) {
                    sum = sum + (parseFloat(value.charges));
                });
                return utilities.round(sum, 2);
            };
            vm.sumTaxPerTrip = function (tripCharges) {
                var sum = 0.0;
                tripCharges.forEach(function (value) {
                    sum = sum + (parseFloat(value.tax));
                });
                return utilities.round(sum, 2);
            };
            function getTrips(invoiceId) {

                vm.loading = true;
                vm.loadingTrips = true;
                limoTrips.getInvoiceTrips({
                    id: invoiceId,
                }).success(function (result) {
                    vm.trips = result.items;
                    vm.srNo = 1;
                    angular.forEach(vm.trips, function (trip) {

                        angular.forEach(trip.tripCharges, function (voucherLine) {
                            if (voucherLine.charges > 0) {

                                voucherLine.srNo = angular.copy(vm.srNo);
                                vm.srNo++;
                                if (appSession.tenant.tenancyName == "GlobalWings") {
                                    if (voucherLine.rate == 0 || voucherLine.rate == null || voucherLine.quantity == 0 || voucherLine.quantity == null) {
                                        voucherLine.rate = voucherLine.charges;
                                        voucherLine.quantity = 1
                                    }
                                }

                            }
                        });
                    });
                    vm.noOfpages = Math.ceil((vm.trips.length + 2) / vm.tripsPerPage); // +2 done due last page total/customer generated blocks. almost taking 2 trips space
                    vm.pages = [];
                    for (var i = 1; i <= vm.noOfpages; i++) {
                        vm.pages.push(i);
                    }

                }).finally(function () {
                    vm.loading = false;
                    vm.loadingTrips = false;
                });
            }

            function getAssets(assetId) {
                vm.loading = true;
                assetService.getAssetForEdit({ id: vm.assetId }).success(function (result) {
                    vm.asset = result;
                    vm.assetDiscountTax = utilities.round(vm.asset.discount * vm.taxPercent / 100, 2);
                }).finally(function () {
                    vm.loading = false;
                });
            }

            vm.sumPartCharges = function () {
                var result = 0;
                angular.forEach(vm.invoice.voucherLines, function (value) {
                    if (value.chargesTypeId == 41) {
                        result = result + value.credit;
                    }
                });
                return vm.rounding(result);
            };

            vm.getTaxableChargesSum = function (trip, excludeWaitingCharges) {
                if (trip == null) return 0.0;
                if (trip.tripCharges == null) return 0.0;

                var sum = 0.0;
                angular.forEach(trip.tripCharges, function (chargesRow) {
                    if (chargesRow.taxable) {
                        if (!(excludeWaitingCharges && chargesRow.chargesTypeId == 25)) {
                            sum += chargesRow.charges;
                        }
                    }
                });

                return sum;
            };

            vm.getNonTaxableChargesSum = function (trip) {
                if (trip == null) return 0.0;
                if (trip.tripCharges == null) return 0.0;

                var sum = 0.0;
                angular.forEach(trip.tripCharges, function (chargesRow) {
                    if (!chargesRow.taxable)
                        sum += chargesRow.charges;
                });

                return sum;
            };

            vm.getNonEmptyCustomField3Value = function () {
                if (vm.trips == null) return "";

                var customField3Value = "";
                angular.forEach(vm.trips, function (trip) {
                    if (trip.customField3 != null || trip.customField3 != '') {
                        if (customField3Value == null || customField3Value == "")
                            customField3Value = trip.customField3;
                    }
                });

                return customField3Value;
            };

            function getDublicateVehicle() {
                var foundLines = $filter('filter')(vm.trips, {
                    tariffGroupId: vm.trips[0].tariffGroupId
                }, true).length;

                if (foundLines == vm.trips.length) {
                    vm.isSameVehicle = true;
                }
            };

            function getDublicateVessel() {

                var foundLines = $filter('filter')(vm.trips, {
                    customField2: vm.trips[0].customField2
                }, true).length;

                if (foundLines == vm.trips.length) {
                    vm.isSameVessel = true;
                }
            };
            var originalTexts = [];
            vm.translations = [

            ];

            vm.translateData = function (text) {
                var foundLines = $filter('filter')(vm.translations, {
                    originalText: text
                }, true);
                if (foundLines.length > 0)
                    return foundLines[0].translatedText;

                return "";
            };

            vm.getMilageCharges = function () {
                if (vm.invoice.agreement != null) {
                    vm.milageCharges = vm.invoice.agreement.charges.filter(x => x.chargesTypeId == 5);
                }
            };

            vm.getAmountWithoutTax = function (amount, tax) {
                var final = amount - tax;
                return final;
            };

            vm.getTotalAmountInWordsTarrifGroup = function () {
                vm.totalAmountofTarriffGroup = 0;
                angular.forEach(vm.tariffGroupWiseData, function (value) {
                    vm.totalAmountofTarriffGroup = value.totalCharges + vm.totalAmountofTarriffGroup;
                });

                vm.amountInWordsTariffGroup = utilities.toWords((vm.totalAmountofTarriffGroup));
            };
            vm.getVehicleType = function () {

                if (vm.invoice.agreement != null) {
                    vm.milageCharges = vm.invoice.agreement.charges.filter(x => x.chargesTypeId == 5);
                }
            };

            vm.getVoucherStatuses = function (status) {
                if (status == 0) {
                    return 'NA'
                }
                if (status == 1) {
                    return 'Open'
                }
                else if (status == 2) {
                    return 'Closed'
                }
                else if (status == 5) {
                    return 'Voided'
                }
            }

            vm.getVehicleTypesEnums = function (vehicleType) {
                if (vehicleType == 0) {
                    return 'NA'
                }
                if (vehicleType == 1) {
                    return 'Rental'
                }
                else if (vehicleType == 2) {
                    return 'Lease'
                }
                else if (vehicleType == 3) {
                    return 'Replacement'
                }
                else if (vehicleType == 4) {
                    return 'Limousine'
                }
                else if (vehicleType == 5) {
                    return 'Workshop'
                }
                else if (vehicleType == 6) {
                    return 'Staff'
                }
            }

            vm.dataTranslatorPopUp = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/dataTranslator/dataTranslatorModal.cshtml',
                    controller: 'tenant.views.common.dataTranslator.dataTranslatorModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        options: function () {
                            return {
                                translations: vm.translations
                            };
                        }
                    }
                });
                modalInstance.result.then(function (result) {

                });

            };

            vm.getAmountAfterDiscount = function (voucherLine) {
                //var discountRows = vm.invoice.voucherLines.filter(e => e.agreementId == voucherLine.agreementId && e.chargesTypeId == 22);
                //if (discountRows.length > 0) {
                //    if (discountRows[0].credit > 0) {
                //        return voucherLine.credit - discountRows[0].credit;
                //    }
                //    else {
                //        return voucherLine.credit + discountRows[0].credit;
                //    }
                //}
                //else {
                //    return voucherLine.credit;
                //}
                var lineToReturn = voucherLine.credit;
                if (voucherLine.chargesTypeId == 22)
                    return lineToReturn;

                var discountRow = vm.invoice.voucherLines
                    .find(e => e.agreementId == voucherLine.agreementId
                        && e.chargesTypeId == 22);

                if (discountRow) {
                    lineToReturn = voucherLine.chargesTypeId == 1 ? voucherLine.credit + discountRow.credit : voucherLine.credit;
                }
                return lineToReturn;

            };


            vm.getFineLocation = function (desciption) {

            };

            vm.getDiscountedRate = function (chargesRow) {
                return chargesRow.rate - (chargesRow.rate * chargesRow.discountPercent / 100);
            };
            vm.getAmountInWords = function (amount) {
                if (amount != null && amount > 0) {
                    return utilities.toWords(vm.rounding(amount));
                }
            };

            vm.isWithOperator = function (data, row) {
                if (data != null) {
                    var rentalCharges = null;
                    var operatorCharges = null;
                    var attachmentCharges = 0;
                    var attahmnetTax = 0;
                    var attachmentArray = data.filter(e => e.chargesTypeId == 71 && e.agreementId == row.agreementId && e.valueField1 == row.valueField1);
                    var hasAttachmentCharges = attachmentArray.length > 0;

                    row.isRentChargesWithOperator = data.some(e => e.chargesTypeId == 1 && e.agreementId == row.agreementId && e.withOperator);
                    row.rentalWithOperatorCredit = 0;
                    rentalCharges = data.find(e => e.chargesTypeId == 1 && e.agreementId == row.agreementId && e.valueField1 == row.valueField1 && e.refNo != "overtime");
                    operatorCharges = data.find(e => e.chargesTypeId == 70 && e.agreementId == row.agreementId && e.valueField1 == row.valueField1 && e.refNo != "overtime");

                    attachmentCharges = attachmentArray.reduce((acc, curr) => acc += curr.credit, 0);
                    attahmnetTax = attachmentArray.reduce((acc, curr) => acc += curr.tax, 0);

                    if (rentalCharges) {
                        row.rentalWithOperatorCredit = rentalCharges.credit;
                        row.rentalWithOperatorTax = rentalCharges.tax;
                    }

                    var hasAttachmentOrOperatorCharges = rentalCharges && (operatorCharges || hasAttachmentCharges);
                    if (hasAttachmentOrOperatorCharges) {
                        row.rentalWithOperatorCredit = rentalCharges.credit + operatorCharges.credit + attachmentCharges;
                        row.rentalWithOperatorTax = rentalCharges.tax + operatorCharges.tax + attahmnetTax;
                    }
                }
            };

            vm.getAttachmentDescription = function (data, row) {
                if (data != null) {
                    var attachmentArray = data.filter(e => e.chargesTypeId == 71 && e.valueField1 == row.valueField1);
                    var hasAttachmentCharges = attachmentArray.length > 0;
                    return hasAttachmentCharges ? attachmentArray.map(e => e.description).join() : null;
                }
                return null;
            };

            vm.isDayShiftExist = function (parentRow) {
                if (parentRow.rowData) {
                    return parentRow.rowData.some(childRow => childRow.valueField1 == 1 && !((childRow.chargesTypeId == 70 || childRow.chargesTypeId == 71) && childRow.refNo != 'overtime'))
                }
                return false;
            };

            vm.isNightShiftExist = function (parentRow) {
                if (parentRow.rowData) {
                    return parentRow.rowData.some(childRow => childRow.valueField1 == 2 && !((childRow.chargesTypeId == 70 || childRow.chargesTypeId == 71) && childRow.refNo != 'overtime'))
                }
                return false;
            };

            var assignOrderByField = function (dataToIterate) {
                let regularExpressionToMatch = /\d+/;
                dataToIterate.forEach(row => {
                    if (row.vehicle && row.vehicle.customField1) {
                        row.orderByField = parseInt(row.vehicle.customField1.match(regularExpressionToMatch));
                    }
                });
            };

            function customizePagesDataForVoucherLines() {
                if (appSession.tenant.tenancyName == "GargashLeasing" && vm.invoice.voucherSubTypeId == 14) {
                    recordsPerPage = 2;
                }
                if (appSession.tenant.tenancyName == "Galadaritrucks" && vm.invoice.voucherSubTypeId == 9) {
                    recordsPerPage = 12;
                }
                if (appSession.tenant.tenancyName == "MorningStarWS") {
                    recordsPerPage = 8;
                }
                if (appSession.tenant.tenancyName == "Galadaritrucks" && vm.invoice.voucherSubTypeId != 9) {
                    recordsPerPage = 15;
                }

                if (appSession.tenant.tenancyName == "Advanced") {
                    recordsPerPage = 8;
                }
                if (appSession.tenant.tenancyName == "qabandi") {
                    recordsPerPage = 5;
                }
                if (appSession.tenant.tenancyName == "AMRACSQatar") {
                    recordsPerPage = 10;
                }

                var customArray = [];
                if (vm.invoice.voucherSubTypeId == 17) {
                    if (vm.invoice.voucherLines && vm.invoice.voucherLines.length > 0) {
                        var customObject = vm.invoice.voucherLines || [];
                        if (customObject) customArray.push(customObject);
                    }
                }
                else {
                    if (vm.invoice.voucherSubTypeId != 37) {
                        customArray = vm.invoice.voucherLines.filter(v => v.credit != 0 && !v.hidden);
                    }
                    else if (vm.invoice.voucherSubTypeId == 37) {
                        customArray = vm.chargesTypeSequence.filter(v => v.credit != 0 && !v.hidden);
                    }
                }

                if (appSession.tenant.tenancyName != "SilverArrowRAC") {
                    customArray.forEach((e, index) => e.srNo = index + 1);
                } else {
                    if (vm.invoice.voucherSubTypeId != 17) {
                        customArray.forEach((e, index) => e.srNo = index + 1);
                    }

                }

                if (appSession.tenant.tenancyName == "autobahn" && (!vm.isMergedRentalInvoice && vm.invoice.voucherSubTypeId != 2)) {
                    recordsPerPage = 13;
                    customArray.sort((a, b) => a.id - b.id);
                    console.log(customArray);
                    customArray.forEach((e, index) => e.srNo = index + 1);
                }

                if (appSession.tenant.tenancyName == "alnammur") {
                    recordsPerPage = 13;
                    customArray.sort((a, b) => a.id - b.id);
                    console.log(customArray);
                    customArray.forEach((e, index) => e.srNo = index + 1);
                }

                var arrayLength = customArray.length;
                var noOfPages = arrayLength / recordsPerPage;
                vm.pagesData = [];
                for (var i = 0; i < noOfPages; i++) {
                    //if (i >= 1) {
                    //    recordPerpage += 5;
                    //}
                    var subArray = [];
                    var start = i * recordsPerPage;
                    var end = start + recordsPerPage;
                    subArray = customArray.slice(start, end);
                    vm.pagesData.push({
                        pageNo: i + 1,
                        voucherLinesdataToIterate: subArray
                    })
                }
            }

            function groupByChargesTypeId() {


                vm.lines = vm.invoice.voucherLines.reduce((acc, item) => {
                    const found = acc.find(el => el.chargesTypeId === item.chargesTypeId);
                    if (found) {
                        found.credit += item.credit;
                    } else {
                        acc.push({ chargesTypeId: item.chargesTypeId, credit: item.credit, chargesType: item.chargesType });
                    }
                    return acc;
                }, []);


            }



            function customizePagesData() {

                if (!(vm.dataToIterate && vm.dataToIterate.length > 0))
                    return;
                if (appSession.tenant.tenancyName == "gargashERL") {
                    recordsPerPage = 3;
                }
                var customArray = [];
                vm.dataToIterate.forEach(e => {
                    if (vm.isDayShiftExist(e) && vm.isNightShiftExist(e)) {
                        customArray.push({ vehicle: e.vehicle, orderByField: e.orderByField, rowData: e.rowData.filter(r => r.valueField1 == 1) }); // dayShift Array 
                        customArray.push({ vehicle: e.vehicle, orderByField: e.orderByField, rowData: e.rowData.filter(r => r.valueField1 == 2) }); // Night Shift Array
                        customArray.push({ vehicle: e.vehicle, orderByField: e.orderByField, rowData: e.rowData.filter(r => r.valueField1 == 0) });
                    }

                    else
                        customArray.push(e);
                });

                customArray.sort((a, b) => a.orderByField - b.orderByField);

                //testCustomArray code seems wrong and commented, 
                //due to this code other / mobilization charges added in invoice through editing were missing, specially in merged invoice case

                //var testCustomArray = customArray.filter(e => (vm.isDayShift && vm.isDayShiftExist(e)) || (vm.isNightShift && vm.isNightShiftExist(e)));
                //var arrayLength = testCustomArray.length;
                var customArray1 = customArray.filter(e => e.rowData.length > 0);
                var arrayLength = customArray1.length;

                var noOfPages = arrayLength / recordsPerPage;
                vm.pagesData = [];
                var srNo = 0;
                for (var i = 0; i < noOfPages; i++) {
                    var subArray = [];
                    var start = i * recordsPerPage;
                    var end = start + recordsPerPage;
                    subArray = customArray1.slice(start, end);

                    var flatArray = subArray.flatMap(e => e.rowData);
                    var netAmount = 0;
                    var tax = 0;
                    var grossAmount = 0;

                    netAmount = flatArray.reduce((accumulator, currValue) => accumulator += currValue.credit, 0);
                    tax = flatArray.reduce((accumulator, currValue) => accumulator += currValue.tax, 0);
                    netAmount += tax;
                    grossAmount = netAmount - tax;

                    subArray.filter(e => (vm.isDayShift && vm.isDayShiftExist(e)) || (vm.isNightShift && vm.isNightShiftExist(e))).forEach(r => {
                        r.srNo = ++srNo;
                    });

                    vm.pagesData.push({
                        pageNo: i + 1,
                        netAmount: netAmount,
                        tax: tax,
                        grossAmount: grossAmount,
                        dataToIterate: subArray
                    })

                    console.log(vm.pagesData);
                }
            }

            function onlyUnique(value, index, self) {
                return self.indexOf(value) === index;
            }
            vm.getPickupDateByTripNo = function (tripNo) {
                if (tripNo) {
                    if (vm.trips) {
                        const tripItem = vm.trips.find(item => item.tripNo.toString() === tripNo.toString());

                        if (tripItem) {
                            return vm.getlocalDateTime(tripItem.pickupDateTime);
                        } else {
                            return null; // Trip not found
                        }
                    }

                }

            }
            //QRlabel
            vm.getLabels = function () {
                vm.loading = true;
                qrlabelService.generateInvoiceQRLabels({ id: invoiceId }).success(function (data) {
                    vm.labels = data;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.totalCredit = (voucher) => {
                let totalCredit = 0;
                voucher.voucherLines.forEach(vl => totalCredit += vl.credit);
                return totalCredit;
            }

            vm.totalDebit = (voucher) => {
                let totalDebit = 0;
                voucher.voucherLines.forEach(vl => totalDebit += vl.debit);
                return totalDebit;
            }

            vm.groupByChargesTypeId = (data) => {
                const groupedData = data.reduce((acc, curr) => {
                    const key = curr.chargesType.id;
                    if (!acc[key]) {
                        acc[key] = [];
                    }
                    acc[key].push(curr);
                    return acc;
                }, {});
                return groupedData;
            }
            function moveItemsToEndOfList(invoiceList) {
                const chargesTypeId13Items = invoiceList.filter(item => item.chargesTypeId === 13);
                const nonChargesTypeId13Items = invoiceList.filter(item => item.chargesTypeId !== 13);
                const resultList = nonChargesTypeId13Items.concat(chargesTypeId13Items);
                vm.vouhcerLinesList = angular.copy(resultList);
                var srNo = 1;
                vm.vouhcerLinesList.forEach(voucherLine => {
                    if (voucherLine.credit != 0 && !voucherLine.hidden) {
                        voucherLine.srNo = srNo;
                        srNo++;
                    }

                })
            }
            var groupByTwoKeys = function (data, key1, key2) {
                let groupByArray = data.reduce((r, a) => {
                    const groupKey = a[key1] + '-' + a[key2]; // Combining two keys for grouping
                    r[groupKey] = [...r[groupKey] || [], a];
                    return r;
                }, {});
                return groupByArray;
            };
            vm.sumlines = function () {
                const creditSums = {};

                // Iterate through the voucherLines and calculate credit sums
                if (vm.invoice.voucherSubTypeId == 1) {

                    if (vm.invoice.agreement) {
                        var srNo = 1;
                        angular.forEach(vm.invoice.voucherLines, function (voucherLine, key) {

                            if (voucherLine.credit != 0 && voucherLine.chargesTypeId == 1 && voucherLine.chargesTypeId != 13 && voucherLine.chargesTypeId != 22 && !voucherLine.hidden) {
                                voucherLine.srNo = angular.copy(srNo);
                                srNo++;
                            }
                        });
                        angular.forEach(vm.invoice.voucherLines, function (voucherLine, key) {

                            if (voucherLine.credit != 0 && voucherLine.chargesTypeId != 1 && voucherLine.chargesTypeId != 13 && voucherLine.chargesTypeId != 22 && !voucherLine.hidden) {
                                voucherLine.srNo = angular.copy(srNo);
                                srNo++;
                            }
                        });
                        angular.forEach(vm.invoice.voucherLines, function (voucherLine, key) {

                            if (voucherLine.credit != 0 && !voucherLine.hidden && voucherLine.chargesTypeId == 13) {
                                voucherLine.srNo = angular.copy(srNo);
                                srNo++;
                            }
                        });
                        angular.forEach(vm.invoice.voucherLines, function (voucherLine, key) {

                            if (voucherLine.credit != 0 && !voucherLine.hidden && voucherLine.chargesTypeId == 22) {
                                voucherLine.srNo = angular.copy(srNo);
                                srNo++;
                            }
                        });

                    }
                    else {

                        var liness = vm.invoice.voucherLines.filter(e => e.agreement != null && e.chargesTypeId == 1);
                        liness.forEach(line => {
                            line.modelId = line.agreement.vehicle.modelId;
                            line.tariffGroupId = line.agreement.vehicle.tariffGroupId;

                        });

                        vm.mergInvoiceLines = [];
                        var arrayList = groupByTwoKeys(liness, 'modelId', 'tariffGroupId');
                        var srNo = 1;
                        angular.forEach(arrayList, function (gpBy, key) {
                            var line = new Object();
                            line.quantity = gpBy.length;
                            line.srNo = angular.copy(srNo);
                            line.amount = calculateSum(gpBy);
                            line.tax = calculateSumTax(gpBy);
                            line.desciption = gpBy[0].agreement.notes;
                            line.agreementId = gpBy[0].agreement.id;
                            line.engineCapacity = gpBy[0].agreement.vehicle.engineCapacity;
                            vm.mergInvoiceLines.push(line);
                            srNo++;
                        });

                        angular.forEach(vm.invoice.voucherLines, function (voucherLine, key) {

                            if (voucherLine.credit != 0 && voucherLine.chargesTypeId != 1 && voucherLine.chargesTypeId != 13 && voucherLine.chargesTypeId != 22 && !voucherLine.hidden) {
                                voucherLine.srNo = angular.copy(srNo);
                                srNo++;
                            }
                        });
                        angular.forEach(vm.invoice.voucherLines, function (voucherLine, key) {

                            if (voucherLine.credit != 0 && !voucherLine.hidden && voucherLine.chargesTypeId == 13) {
                                voucherLine.srNo = angular.copy(srNo);
                                srNo++;
                            }
                        });
                        angular.forEach(vm.invoice.voucherLines, function (voucherLine, key) {

                            if (voucherLine.credit != 0 && !voucherLine.hidden && voucherLine.chargesTypeId == 22) {
                                voucherLine.srNo = angular.copy(srNo);
                                srNo++;
                            }
                        });

                    }

                }

            }
            vm.getDateMonth = function (dateString) {
                const [datePart] = dateString.split(' ');
                const [day, month, year] = datePart.split('/');
                const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                const monthName = monthNames[parseInt(month, 10) - 1];
                return `${monthName}-${year}`;
            }
            vm.getDateMonthEnglish = function (date, format) {
                if (date != null) {
                    if (format == null) format = vm.dateMotnh;

                    var localTime = moment.utc(date).toDate();

                    // Return only the full month name
                    return moment(localTime).format("MMMM");  // "MMMM" gives full month name like "January"
                } else {
                    return "";
                }
            };

            vm.getDateMonthArabic = function (date, format) {
                if (date != null) {
                    if (format == null) format = vm.dateMotnh;

                    var localTime = moment.utc(date).toDate();

                    // Create a new moment instance with the Arabic locale for this specific date
                    var arabicMonth = moment(localTime).locale('ar').format("MMMM");  // "MMMM" gives full month name in Arabic

                    // Return the Arabic month name
                    return arabicMonth;
                } else {
                    return "";
                }
            };

            vm.convertAmountWordsToArabic = function (englishAmountInWords) {
                if (!englishAmountInWords) return '';

                const map = {
                    "zero": "صفر",
                    "one": "واحد",
                    "two": "اثنان",
                    "three": "ثلاثة",
                    "four": "أربعة",
                    "five": "خمسة",
                    "six": "ستة",
                    "seven": "سبعة",
                    "eight": "ثمانية",
                    "nine": "تسعة",
                    "ten": "عشرة",
                    "eleven": "أحد عشر",
                    "twelve": "اثنا عشر",
                    "thirteen": "ثلاثة عشر",
                    "fourteen": "أربعة عشر",
                    "fifteen": "خمسة عشر",
                    "sixteen": "ستة عشر",
                    "seventeen": "سبعة عشر",
                    "eighteen": "ثمانية عشر",
                    "nineteen": "تسعة عشر",
                    "twenty": "عشرون",
                    "thirty": "ثلاثون",
                    "forty": "أربعون",
                    "fifty": "خمسون",
                    "sixty": "ستون",
                    "seventy": "سبعون",
                    "eighty": "ثمانون",
                    "ninety": "تسعون",
                    "hundred": "مائة",
                    "thousand": "ألف",
                    "million": "مليون",
                    "billion": "مليار",
                    "and": "و",
                    "dirham": "درهمًا",
                    "dirhams": "درهمًا",
                    "fils": "فلسًا",
                    "fils only": "فلسًا فقط",
                    "only": "فقط"
                };

                return englishAmountInWords
                    .toLowerCase()
                    .split(' ')
                    .map(word => map[word] || word)
                    .join(' ');
            };




            function calculateSum(list) {
                let sum = 0;
                for (let i = 0; i < list.length; i++) {
                    sum += list[i].credit;
                }
                return sum;
            }
            function calculateSumTax(list) {
                let sum = 0;
                for (let i = 0; i < list.length; i++) {
                    sum += list[i].tax;
                }
                return sum;
            }
            function invoiceLineObject() {
                var line = new Object();
                line.chargesTypeId = null;
                line.description = '';
                line.debit = null;
                line.credit = null;
                line.taxable = false;
                line.module = vm.enabledModule;
                return line;
            }

            var chargesTypes = {
                rent: 1,
                cdw: 2,
                fuelCharges: 4,
                mileageCharges: 5,
                tolls: 7,
                fines: 8,
                driverCharges: 23,
                tollsSurcharge: 33,
                finesSurcharge: 34,
                parkingCharges: 39,
                extra1Charges: 54,
                extra2Charges: 55,
                darbTolls: 73,
                darbTollsSurcharge: 74,
                parkingSurcharge: 77,
            };

            vm.save = function () {
                vm.saving = true;
                var lPONo = vm.invoice.customField4;
                invoiceService.saveInvoiceNotes(vm.invoice.id, vm.invoice.notes, lPONo)
                    .success(function (result) {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                    }).finally(function () {
                        vm.saving = false;
                    });
            };

            vm.filterVisibleLines = function (line) {
                return line && line.hidden === false && line.credit !== 0;
            };
            
            vm.isPastCutOff = function () {
                if (!vm.eInvoicingCutOffDate)
                    return false; 

                if (vm.currentDateTime.getTime() < vm.eInvoicingCutOffDate.getTime() && vm.isEInvoicingUAEEnabled && vm.isCustomerCutoffDateForInvoicePrint)
                    return false;
                if (vm.currentDateTime.getTime() >= vm.eInvoicingCutOffDate.getTime() && vm.isEInvoicingUAEEnabled && vm.isCustomerCutoffDateForInvoicePrint)
                    return true;

            };

            vm.init = function (options) {
                vm.loading = true;
                if (previewInvoice) {
                    vm.invoice = previewInvoice;
                    if (vm.invoice.voucherLines)
                        vm.invoice.voucherLines = vm.invoice.voucherLines.sort((a, b) => a.srNo - b.srNo);
                    vm.invoiceForAc = angular.copy(previewInvoice);
                    vm.masterAgreementNo = previewInvoice.masterAgreementNo;
                    vm.agreementNo = previewInvoice.masterAgreementNo;

                    $scope.$parent.$parent.vmMain.previewVoucher = vm.invoice;
                    if (vm.isCreditNoteAmountInInvoice) {
                        vm.invoice.amountInWords = utilities.toWords(vm.rounding(vm.invoice.amount - vm.invoice.discount - vm.invoice.creditNoteAmount - vm.invoice.creditNoteTax));
                    }
                    else {
                        vm.invoice.amountInWords = utilities.toWords(vm.rounding(vm.invoice.amount));
                    }
                    vm.isMergedEquipmentInvoice = (vm.invoice.voucherSubTypeId == 46 || vm.invoice.voucherSubTypeId == 47) && !vm.invoice.agreementId;
                    vm.agreement = vm.invoice.agreement;
                    if (vm.isMergedEquipmentInvoice) {
                        vm.invoiceRowWithAgreement = vm.invoice.voucherLines.filter(e => e.agreementId != null)[0].agreement;
                        vm.agreement = vm.invoiceRowWithAgreement;

                        vm.invoice.voucherLines.forEach(e => {
                            if (e.vehicle && e.agreement)
                                e.vehicle.model.make = e.agreement.vehicle.model.make.name;

                        })
                    }

                    if (!vm.agreementNo) {
                        if (vm.isMergedEquipmentInvoice) {
                            var manualAgreementNo = vm.invoice.voucherLines.filter(e => e.agreementId != null)[0].agreement.manualAgreementNo;
                            var agreementNo = vm.invoice.voucherLines.filter(e => e.agreementId != null)[0].agreement.agreementNo;
                            vm.agreementNo = manualAgreementNo ? manualAgreementNo : agreementNo;
                        }
                        else if (vm.invoice.voucherSubTypeId == 46 || vm.invoice.voucherSubTypeId == 47) {
                            var manualAgreementNo = vm.invoice.agreement.manualAgreementNo;
                            var agreementNo = vm.invoice.agreement.agreementNo;
                            vm.agreementNo = manualAgreementNo ? manualAgreementNo : agreementNo;
                        }
                    }

                    vm.getDescription();
                    vm.getUserName(vm.invoice.creatorUserId);

                    vm.getMilageCharges();
                    vm.getVehicleType();
                    if (vm.invoice.agreement != null) {
                        vm.invoice.agreement.vehicle.model.make = vm.invoice.agreement.vehicle.model.make.name;
                        vm.rentalDiscountExcludeAmount = vm.invoice.agreement.charges.filter(e => e.chargesTypeId == 1)[0].rate;

                        vm.invoice.voucherLines.forEach(e => {
                            if (e.vehicle)
                                e.vehicle.model.make = vm.invoice.agreement.vehicle.model.make.name;

                        })
                    }
                    if (vm.isWorkshopModuleEnabled) {
                        angular.forEach(vm.invoice.voucherLines, function (row) {
                            if (row.credit != 0 && !row.hidden && row.chargesTypeId != 41) {
                                if (vm.customSerial == 0) {
                                    row.customSrNo = 2;
                                    vm.customSerial = 2;
                                }
                                else {
                                    row.customSrNo = vm.customSerial + 1;
                                    vm.customSerial = vm.customSerial + 1;
                                }
                            }
                        });
                    }
                    if (!vm.isMergedEquipmentInvoice && vm.invoice.voucherSubTypeId == 46) // only for equipment invoice
                        vm.invoice.voucherLines.filter(e => !e.hidden).forEach(e => e.agreementId = vm.invoice.agreementId);


                    vm.groupByInvoiceData = groupBy(vm.invoice.voucherLines.filter(e => !e.hidden), 'agreementId');

                    vm.dataToIterate = [];
                    angular.forEach(vm.groupByInvoiceData, function (value, key) {
                        var result = [];
                        if (value.some(e => e.chargesTypeId != 71 && e.vehicleId)) {
                            result.vehicle = value.find(e => e.chargesTypeId != 71 && e.vehicleId).vehicle;
                        }
                        result.rowData = angular.copy(value);
                        vm.dataToIterate.push(result);

                        vm.isDayShift = false;
                        vm.isNightShift = false;
                        vm.hasMobilizationCharges = false;

                        vm.dataToIterate.forEach(e => {
                            if (e.rowData.some(r => r.valueField1 == 1))
                                vm.isDayShift = true;
                            if (e.rowData.some(r => r.valueField1 == 2))
                                vm.isNightShift = true;
                            if (e.rowData.some(r => r.valueField1 != 1 && r.valueField1 != 2))
                                vm.hasMobilizationCharges = true;
                        });

                    });
                    assignOrderByField(vm.dataToIterate);


                    customizePagesData();
                    vm.loading = false;
                }
                else {
                    invoicePrintService.getInvoiceForPrint({
                        id: invoiceId
                    }).success(function (result) {

                        //QRlabel
                        if (appSession.tenant.tenancyName.toLowerCase() == 'abctksa')
                            vm.getLabels();

                        vm.masterAgreementNo = result.masterAgreementNo;
                        vm.poNo = result.poNo;
                        vm.invoice = result.printInvoice;

                        
                        vm.eInvoicingCutOffDate = vm.invoice.contact.eInvoicingCutOffDate ? new Date(vm.invoice.contact.eInvoicingCutOffDate) : null;
                        vm.uuid = vm.invoice.uuid;

                        
                        
                        //include vat in creditnote amount
                        if (vm.invoice.voucherLines) {
                            vm.invoice.voucherLines.forEach(function (vl) {
                                if (vl.creditNoteAmount > 0) {
                                    if (vl.tax > 0) {
                                        var taxAmount = vl.creditNoteAmount * (vm.invoice.taxPercent / 100);
                                        vl.creditNoteAmountWithTax = vl.creditNoteAmount + taxAmount;
                                    } else {
                                        vl.creditNoteAmountWithTax = vl.creditNoteAmount;
                                    }
                                } else {
                                    vl.creditNoteAmountWithTax = 0;
                                }
                            });
                        }
                        if (vm.invoice.voucherSubTypeId === 9) {
                            vm.invoice.voucherLines.forEach(vl => {
                                if (vl.tax > 0) {
                                    vl.taxCategory = 1
                                }
                                //else {
                                //    vl.taxCategory = 3;
                                //}

                            });
                        }
                        if (!vm.isMergedRentalInvoice && vm.invoice.voucherSubTypeId === 7 && vm.invoice.voucherLines) {

                            var fineLine = vm.invoice.voucherLines.find(function (line) {
                                return line &&
                                    !line.hidden &&
                                    line.credit !== 0 &&
                                    line.chargesType &&
                                    line.chargesType.id === 8;
                            });

                            if (fineLine) {
                                vm.taxCategoryForFineSurcharge = fineLine.taxCategory;
                            }
                        }
                        if (appSession.tenant.tenancyName == "advanced") {
                            if (vm.invoice.agreement) {
                                var logs = vm.invoice.agreement.driverLogs;

                                // Filter driver logs that are active within the invoice date range
                                var filteredLogs = logs.filter(dl =>
                                    new Date(dl.outDateTime) <= new Date(vm.invoice.toDate) &&
                                    (dl.inDateTime === null || new Date(dl.inDateTime) >= new Date(vm.invoice.fromDate))
                                );


                                if (filteredLogs.length > 0) {
                                    // Get the latest driver in the invoice date range
                                    var latestDriverLog = filteredLogs.reduce((prev, current) =>
                                        new Date(prev.outDateTime) > new Date(current.outDateTime) ? prev : current
                                    );
                                }

                                // Set the selected driver name if found
                                vm.selectedDriver = latestDriverLog ? latestDriverLog.driver.name : "";
                            }

                        }


                        if (appSession.tenant.tenancyName == "GlobalWings") {
                            vm.invoice.voucherLines.forEach(voucherLine => {
                                if (voucherLine.price == 0 || voucherLine.price == null || voucherLine.quantity == 0 || voucherLine.quantity == null) {
                                    voucherLine.price = voucherLine.credit;
                                    voucherLine.quantity = 1
                                }
                            });
                        }
                        vm.invoice.imageUrls = result.imageURL;
                        vm.invoice.invoiceImageUrls = result.imageURL;
                        if (vm.isMultiCurrencyEnabled) {
                            if (vm.invoice.contact.currency) {
                                vm.currency = vm.invoice.contact.currency.code;
                                vm.invoice.currencyRate = vm.invoice.contact.currency.currencyToBaseRate;
                                if (vm.invoice.currencyRate > 0) {
                                    vm.tax = vm.invoice.tax * vm.invoice.currencyRate;
                                }
                                else {
                                    vm.tax = vm.invoice.tax;
                                }
                            }
                            else {
                                vm.tax = vm.invoice.tax;
                            }

                        }

                        if (vm.invoice.agreement) {
                            if (vm.invoice.agreement.clubRentalDriverAndFuelCharges) {
                                let clubChargesTotal = 0;
                                let clubChargesTaxTotal = 0;
                                let clubChargesTotalWithTax = 0;
                                let voucherLines = [];
                                let clubChargesVehicle = null; // Store vehicle details
                                let clubChargesAgreement = null; // Store agreement details

                                vm.invoice.voucherLines.forEach((voucherLine, index) => {
                                    if (voucherLine.credit !== 0 && !voucherLine.hidden) {
                                        if ([chargesTypes.rent, chargesTypes.fuelCharges, chargesTypes.driverCharges].includes(voucherLine.chargesType.id)) {
                                            clubChargesTotal += voucherLine.credit || 0;
                                            clubChargesTaxTotal += voucherLine.tax || 0;
                                            clubChargesTotalWithTax += (voucherLine.credit || 0) + (voucherLine.tax || 0);

                                            // Capture vehicle and agreement details from the first relevant charge
                                            if (!clubChargesVehicle && voucherLine.vehicle) {
                                                clubChargesVehicle = voucherLine.vehicle;
                                            }
                                            if (!clubChargesAgreement && voucherLine.agreement) {
                                                clubChargesAgreement = voucherLine.agreement;
                                            }
                                        } else {
                                            voucherLine.srNo = voucherLines.length + 1;
                                            voucherLines.push(voucherLine);
                                        }
                                    }
                                });

                                if (clubChargesTotal > 0) {
                                    // Create the combined charge line with vehicle details
                                    const clubChargesLine = {
                                        srNo: voucherLines.length + 1,
                                        chargesType: {
                                            id: 'clubRentalDriverAndFuelCharges',
                                            name: 'Club Rental, Driver, and Fuel Charges'
                                        },
                                        chargesTypeId: 'clubRentalDriverAndFuelCharges', // Add this for compatibility
                                        description: 'Club Rental, Driver, and Fuel Charges',
                                        credit: clubChargesTotal,
                                        tax: clubChargesTaxTotal,
                                        amountWithTax: clubChargesTotalWithTax,
                                        vehicle: clubChargesVehicle, // Include vehicle details
                                        agreement: clubChargesAgreement, // Include agreement details
                                        vehicleId: clubChargesVehicle ? clubChargesVehicle.id : null,
                                        agreementId: clubChargesAgreement ? clubChargesAgreement.id : null,
                                        hidden: false,
                                        taxable: clubChargesTaxTotal > 0
                                    };

                                    voucherLines.push(clubChargesLine);

                                    // Store totals in agreement object for reference
                                    vm.invoice.agreement.clubRentalDriverAndFuelChargesTotal = clubChargesTotal;
                                    vm.invoice.agreement.clubRentalDriverAndFuelChargesTaxTotal = clubChargesTaxTotal;
                                    vm.invoice.agreement.clubRentalDriverAndFuelChargesTotalWithTax = clubChargesTotalWithTax;
                                }

                                // Reassign serial numbers
                                voucherLines.forEach((line, index) => {
                                    line.srNo = index + 1;
                                });

                                vm.invoice.voucherLines = voucherLines;
                            }
                        }
                        if (vm.invoice.voucherSubTypeId == 1) {
                            if (vm.invoice.voucherLines && vm.invoice.voucherLines.length > 0) {
                                // Group by agreementId
                                let groupedByAgreement = {};

                                vm.invoice.voucherLines.forEach((voucherLine) => {
                                    if (voucherLine.credit !== 0 && !voucherLine.hidden) {
                                        const agreementId = voucherLine.agreement ? voucherLine.agreement.id : "no-agreement";

                                        if (!groupedByAgreement[agreementId]) {
                                            groupedByAgreement[agreementId] = {
                                                agreement: voucherLine.agreement || null,
                                                vehicle: voucherLine.vehicle || null,
                                                clubChargesTotal: 0,
                                                clubChargesTaxTotal: 0,
                                                clubChargesTotalWithTax: 0,
                                                otherLines: []
                                            };
                                        }

                                        // Check if clubbing is enabled for this agreement
                                        const isClubEnabled = voucherLine.agreement && voucherLine.agreement.clubRentalDriverAndFuelCharges;

                                        if (isClubEnabled && [chargesTypes.rent, chargesTypes.fuelCharges, chargesTypes.driverCharges].includes(voucherLine.chargesType.id)) {
                                            // Add to clubbed totals only (don’t push separate rent/driver/fuel rows)
                                            groupedByAgreement[agreementId].clubChargesTotal += voucherLine.credit || 0;
                                            groupedByAgreement[agreementId].clubChargesTaxTotal += voucherLine.tax || 0;
                                            groupedByAgreement[agreementId].clubChargesTotalWithTax += (voucherLine.credit || 0) + (voucherLine.tax || 0);
                                            groupedByAgreement[agreementId].taxCategory = voucherLine.taxCategory || 0;
                                        } else {
                                            // Push all other charges normally (including Salik, Darb, Fine, etc.)
                                            groupedByAgreement[agreementId].otherLines.push(voucherLine);
                                        }
                                    }
                                });

                                let finalVoucherLines = [];
                                Object.values(groupedByAgreement).forEach(group => {
                                    // Push non-clubbed lines first
                                    group.otherLines.forEach(line => {
                                        line.srNo = finalVoucherLines.length + 1;
                                        finalVoucherLines.push(line);
                                    });

                                    // Then add the clubbed line if totals > 0 and clubbing is enabled
                                    if (group.agreement && group.agreement.clubRentalDriverAndFuelCharges && group.clubChargesTotal > 0) {
                                        const clubChargesLine = {
                                            srNo: finalVoucherLines.length + 1,
                                            chargesType: {
                                                id: 'clubRentalDriverAndFuelCharges',
                                                name: 'Club Rental, Driver, and Fuel Charges'
                                            },
                                            chargesTypeId: 'clubRentalDriverAndFuelCharges',
                                            description: 'Rental and Driver Clubbed Charges',
                                            credit: group.clubChargesTotal,
                                            tax: group.clubChargesTaxTotal,
                                            amountWithTax: group.clubChargesTotalWithTax,
                                            vehicle: group.vehicle,
                                            agreement: group.agreement,
                                            vehicleId: group.vehicle ? group.vehicle.id : null,
                                            agreementId: group.agreement ? group.agreement.id : null,
                                            hidden: false,
                                            taxable: group.clubChargesTaxTotal > 0,
                                            taxCategory: group.taxCategory
                                        };

                                        finalVoucherLines.push(clubChargesLine);

                                        // Save totals back to the agreement
                                        group.agreement.clubRentalDriverAndFuelChargesTotal = group.clubChargesTotal;
                                        group.agreement.clubRentalDriverAndFuelChargesTaxTotal = group.clubChargesTaxTotal;
                                        group.agreement.clubRentalDriverAndFuelChargesTotalWithTax = group.clubChargesTotalWithTax;
                                    }
                                });

                                // Reassign serial numbers at the end
                                finalVoucherLines.forEach((line, index) => {
                                    line.srNo = index + 1;
                                });

                                vm.invoice.voucherLines = finalVoucherLines;
                            }
                        }


                        if (vm.invoice.voucherSubTypeId == 37) {
                            vm.chargesTypeSequence = [];
                            vm.srNo = 1;

                            vm.invoice.voucherLines.forEach(voucherLine => {
                                if (voucherLine.chargesTypeId == 41) {
                                    voucherLine.srNo = vm.srNo;
                                    var line = angular.copy(voucherLine);
                                    vm.srNo++;
                                    vm.chargesTypeSequence.push(line);
                                }
                            });
                            vm.invoice.voucherLines.forEach(voucherLine => {
                                if (voucherLine.chargesTypeId == 42) {
                                    voucherLine.srNo = vm.srNo;
                                    var line = angular.copy(voucherLine);
                                    vm.srNo++;
                                    vm.chargesTypeSequence.push(line);
                                }
                            });

                            vm.invoice.voucherLines.forEach(voucherLine => {
                                if (voucherLine.chargesTypeId == 43) {
                                    voucherLine.srNo = vm.srNo;
                                    var line = angular.copy(voucherLine);
                                    vm.srNo++;
                                    vm.chargesTypeSequence.push(line);
                                }
                            });

                            vm.invoice.voucherLines.forEach(voucherLine => {
                                if (voucherLine.chargesTypeId == 69) {
                                    voucherLine.srNo = vm.srNo;
                                    var line = angular.copy(voucherLine);
                                    vm.srNo++;
                                    vm.chargesTypeSequence.push(line);
                                }
                            });

                            vm.invoice.voucherLines.forEach(voucherLine => {
                                if (voucherLine.chargesTypeId == 22) {
                                    voucherLine.srNo = vm.srNo;
                                    var line = angular.copy(voucherLine);
                                    vm.srNo++;
                                    vm.chargesTypeSequence.push(line);
                                }
                            });

                            vm.invoice.voucherLines.forEach(voucherLine => {
                                if (voucherLine.chargesTypeId != 41 && voucherLine.chargesTypeId != 43 && voucherLine.chargesTypeId != 69 && voucherLine.chargesTypeId != 22 && voucherLine.chargesTypeId != 42) {
                                    voucherLine.srNo = vm.srNo;
                                    var line = angular.copy(voucherLine);
                                    vm.srNo++;
                                    vm.chargesTypeSequence.push(line);
                                }
                            });

                        }


                        var invoiceDate = new Date(vm.invoice.date);
                        var creditPeriod = vm.invoice.contact.creditPeriod;
                        var dueDate = new Date(invoiceDate.getTime() + (creditPeriod * 24 * 60 * 60 * 1000));
                        vm.invoice.dueDate = dueDate;


                        if (vm.invoice.voucherLines)
                            vm.invoice.voucherLines = vm.invoice.voucherLines.sort((a, b) => a.srNo - b.srNo);
                        vm.invoiceForAc = angular.copy(result.printInvoice);
                        moveItemsToEndOfList(vm.invoice.voucherLines);
                        groupByChargesTypeId();
                        if (appSession.tenant.tenancyName == "classww") {
                            if (vm.invoice.agreementId) {
                                vm.loadingA = true;
                                agreementPrintService.getAgreementForPrint({
                                    agreementId: vm.invoice.agreementId,

                                }).success(function (result) {
                                    vm.agreementP = result.agreement;
                                    if (!vm.invoice.agreement.poNo)
                                        vm.invoice.agreement.poNo = vm.agreementP.saleOrderRefNo;

                                }).finally(function () {
                                    vm.loadingA = false;
                                });
                            }
                        }
                        if (appSession.tenant.tenancyName == "gargashERL") {
                            if (vm.invoice.agreementId) {
                                vm.loadingA = true;
                                agreementPrintService.getAgreementForPrint({
                                    agreementId: vm.invoice.agreementId,

                                }).success(function (agreementresult) {
                                    vm.agreementP = agreementresult.agreement;
                                    if (vm.agreementP.masterAgreement)
                                        vm.invoice.agreement.poNo = vm.agreementP.masterAgreement.poNo;
                                }).finally(function () {
                                    vm.loadingA = false;
                                });
                            }
                        }



                        if (appSession.tenant.tenancyName == "AlmasaoodER") {
                            if (vm.invoice.voucherSubTypeId == 1) {
                                vm.rentalDiscount = 0;
                                angular.forEach(vm.invoice.voucherLines, function (value) {
                                    if (value.chargesTypeId == 22) {
                                        vm.rentalDiscount += value.credit;
                                    }
                                });



                                if (vm.invoice.agreementId) {
                                    if (vm.invoice.agreement.masterAgreementId) {
                                        vm.loadingMasterAgreement = true;
                                        masterAgreementService.getMasterAgreementForView({ id: vm.invoice.agreement.masterAgreementId })
                                            .success(function (masterData) {

                                                vm.masterAgreementView = masterData;


                                            }).finally(function () {
                                                vm.loadingMasterAgreement = false;
                                            });
                                    }

                                } else {
                                    var agreementLine = vm.invoice.voucherLines.find(voucherLine => voucherLine.agreementId);
                                    if (agreementLine) {

                                        if (agreementLine.agreement.masterAgreementId) {
                                            vm.loadingMasterAgreement = true;
                                            masterAgreementService.getMasterAgreementForView({ id: agreementLine.agreement.masterAgreementId })
                                                .success(function (masterData) {
                                                    vm.loading = false;
                                                    vm.masterAgreementView = masterData;


                                                }).finally(function () {
                                                    vm.loadingMasterAgreement = false;
                                                });
                                        }
                                    }

                                }


                            }

                        }



                        if (vm.isThousand) {
                            vm.driverChargesAmount = 0;
                            vm.driverChargesTax = 0;
                            angular.forEach(vm.invoice.voucherLines, function (value) {
                                if (!value.hidden) {
                                    if (value.chargesTypeId == 23) {
                                        vm.driverChargesAmount = vm.driverChargesAmount + value.credit;
                                        vm.driverChargesTax = vm.driverChargesTax + value.tax;
                                    }
                                }
                            });
                        }
                        vm.groupVehicle = groupBy(vm.invoice.voucherLines.filter(e => !e.hidden), 'vehicleId');
                        if (vm.invoice.notes2)
                            vm.invoice.notes2 = vm.invoice.notes2.replace(/(\n)/g, '<br/>');
                        //vm.invoice.notes2 = 'a<br/>b<br/>'; 
                        vm.quotationNo = result.quotationNo;
                        vm.agreementNo = result.masterAgreementNo;
                        vm.contactPerson = result.contactPersonName;


                        if (vm.invoice.job)
                            vm.isInsuranceInvoice = vm.invoice.job.insuranceCompanyId == vm.invoice.contact.id;

                        if (vm.invoice.voucherSubTypeId == 9) {
                            if (!(vm.invoice.fromDate && vm.invoice.toDate))
                                vm.oneTime = true;
                        }
                        if (vm.invoice.voucherSubTypeId == 17 || vm.invoice.voucherSubTypeId == 7) {
                            angular.forEach(vm.invoice.voucherLines, function (value) {
                                if (value.assetId)
                                    vm.assetId = value.assetId;
                                if (value.vehicle) {
                                    if (value.vehicle.id) {
                                        if (value.vehicle.id != vm.vehicleId) {
                                            vm.vehicleId = value.vehicle.id;
                                            if (vm.vehicles != null)
                                                vm.vehicles = vm.vehicles + ', ' + value.vehicle.plateNo;
                                            else
                                                vm.vehicles = value.vehicle.plateNo;
                                        }
                                    }
                                }
                            });

                            if (abp.auth.hasPermission("Pages.Tenant.Assets.Assets"))
                                getAssets(vm.assetId);
                        };

                        //if (vm.invoice.contact.name) {
                        //    vm.translations.push({ originalText: vm.invoice.contact.name });
                        //}
                        //if (vm.invoice.agreement && vm.invoice.agreement.driver) {
                        //    vm.translations.push({ originalText: vm.invoice.agreement.driver.name });
                        //}
                        //if (vm.invoice.contact.address && vm.invoice.contact.address.zipCode) {
                        //    vm.translations.push({ originalText: vm.invoice.contact.address.zipCode });
                        //}
                        //if (vm.invoice.contact.address && vm.invoice.contact.address.addressLine1) {
                        //    vm.translations.push({ originalText: vm.invoice.contact.address.addressLine1  });
                        //}
                        //if (vm.invoice.contact.address && vm.invoice.contact.address.city) {
                        //    vm.translations.push({ originalText: vm.invoice.contact.address.city });
                        //}
                        //if (vm.invoice.contact.address && vm.invoice.contact.address.country) {
                        //    vm.translations.push({ originalText: vm.invoice.contact.address.country });
                        //}

                        //dataTranslationService.getTranslations(vm.translations).success(function (result) {
                        //    vm.translations = result;
                        //});
                        vm.castleLimoAmountInWords = utilities.toWords(vm.rounding(vm.invoice.amount));

                        if (vm.isMultiCurrencyEnabled) {
                            if (vm.invoice.contact) {
                                var currencyName = vm.invoice.contact.currency ? vm.invoice.contact.currency.name : null;
                                var decimalName = vm.invoice.contact.currency ? vm.invoice.contact.currency.decimalName : null;
                                if (vm.isCreditNoteAmountInInvoice) {
                                    vm.invoice.amountInWords = utilities.toWords(vm.rounding(vm.invoice.amount - vm.invoice.discount - vm.invoice.creditNoteAmount - vm.invoice.creditNoteTax));
                                }
                                else {
                                    vm.invoice.amountInWords = utilities.toWords(vm.rounding(vm.invoice.amount));
                                }
                            }

                        } else {
                            if (vm.isCreditNoteAmountInInvoice) {
                                vm.invoice.amountInWords = utilities.toWords(vm.rounding(vm.invoice.amount - vm.invoice.discount - vm.invoice.creditNoteAmount - vm.invoice.creditNoteTax));
                            }
                            else {
                                vm.invoice.amountInWords = utilities.toWords(vm.rounding(vm.invoice.amount));
                            }
                        }
                        vm.isMergedRentalInvoice = (vm.invoice.voucherSubTypeId == 1 || vm.invoice.voucherSubTypeId == 14) && !vm.invoice.agreementId;
                        vm.isMergedEquipmentInvoice = (vm.invoice.voucherSubTypeId == 46 || vm.invoice.voucherSubTypeId == 47) && !vm.invoice.agreementId;
                        vm.agreement = vm.invoice.agreement;
                        vm.vehiclesTotalPrice = 0;   // store total on vm
                        vm.amountInWords = '';        // store amount in words on vm

                        if (vm.agreement && vm.agreement.agreementVehicles) {
                            for (var i = 0; i < vm.agreement.agreementVehicles.length; i++) {
                                var vehicle = vm.agreement.agreementVehicles[i];
                                if (vehicle.price) {
                                    vm.vehiclesTotalPrice += vehicle.price;
                                }
                            }
                            vm.advance = vm.invoice.agreement.advance / (1 + (vm.invoice.agreement.taxPercent / 100));
                            vm.advanceWithVAT = vm.invoice.agreement.advance;
                            vm.amountAfterAdvance = vm.vehiclesTotalPrice - vm.advance;
                            vm.amountAfterAdvanceVAT = vm.vehiclesTotalPrice - vm.advanceWithVAT;
                            vm.taxAmount = vm.amountAfterAdvance * (vm.invoice.taxPercent / 100);
                            vm.taxAmountWithVAT = vm.vehiclesTotalPrice * (vm.invoice.taxPercent / 100);
                            vm.remainingAmount = vm.amountAfterAdvance + vm.taxAmount;
                            vm.remainingAmountWithVAT = vm.amountAfterAdvanceVAT + vm.taxAmountWithVAT;
                            vm.totalAmount = vm.vehiclesTotalPrice + vm.taxAmountWithVAT;
                            vm.totalChargesAmount = vm.invoice.agreement.totalCharges;
                            // now store amount in words on vm
                            vm.amountInWords = vm.getAmountInWords(vm.vehiclesTotalPrice);
                        }

                        if (vm.isMergedEquipmentInvoice) {
                            vm.invoiceRowWithAgreement = vm.invoice.voucherLines.filter(e => e.agreementId != null)[0].agreement;
                            vm.agreement = vm.invoiceRowWithAgreement;
                        }

                        if (!vm.agreementNo) {
                            if (vm.isMergedEquipmentInvoice) {
                                var manualAgreementNo = vm.invoice.voucherLines.filter(e => e.agreementId != null)[0].agreement.manualAgreementNo;
                                var agreementNo = vm.invoice.voucherLines.filter(e => e.agreementId != null)[0].agreement.agreementNo;
                                vm.agreementNo = manualAgreementNo ? manualAgreementNo : agreementNo;
                            }
                            else if (vm.invoice.voucherSubTypeId == 46 || vm.invoice.voucherSubTypeId == 47) {
                                var manualAgreementNo = vm.invoice.agreement.manualAgreementNo;
                                var agreementNo = vm.invoice.agreement.agreementNo;
                                vm.agreementNo = manualAgreementNo ? manualAgreementNo : agreementNo;
                            }
                        }
                        vm.qrCode = vm.invoice.qrCodeImage;
                        vm.trn = vm.invoice.location.taxId;
                        vm.currentDate = new Date(vm.invoice.date);

                        if (vm.updateTRN) {

                            if (vm.invoice.location.trnLogsList && vm.invoice.location.trnLogsList.length > 0) {
                                for (let i = 0; i < vm.invoice.location.trnLogsList.length; i++) {
                                    const trnLog = vm.invoice.location.trnLogsList[i];

                                    const fromDate = new Date(trnLog.fromDate);
                                    fromDate.setHours(0, 0, 0, 0); //strat of day
                                    const toDate = new Date(trnLog.toDate);
                                    toDate.setHours(23, 59, 59, 999); // end of day

                                    if (vm.currentDate >= fromDate && vm.currentDate <= toDate) {
                                        vm.trn = trnLog.taxId;
                                        break;
                                    }
                                }
                            }
                        }
                        //if (vm.customerWiseTrnBasedOnPeriod) {
                        //    if (vm.invoice && vm.invoice.contact && vm.invoice.contact.trnLogsList && vm.invoice.contact.trnLogsList.length > 0) {
                        //        for (let i = 0; i < vm.invoice.contact.trnLogsList.length; i++) {
                        //            const trnLog = vm.invoice.contact.trnLogsList[i];

                        //            if (trnLog && trnLog.fromDate && trnLog.toDate) {
                        //                const fromDate = new Date(trnLog.fromDate);
                        //                const toDate = new Date(trnLog.toDate);
                        //                fromDate.setHours(0, 0, 0, 0); // start of day
                        //                toDate.setHours(23, 59, 59, 999); // end of day

                        //                if (vm.currentDate >= fromDate && vm.currentDate <= toDate) {
                        //                    vm.invoice.contact.taxId = trnLog.taxId;
                        //                    break;
                        //                }
                        //            }
                        //        }
                        //    }
                        //}


                        if (vm.invoice.id && vm.invoice.voucherSubTypeId == 2)
                            getTrips(vm.invoice.id);
                        //vm.invoice.agreement.movements.forEach(function (value) {
                        //    if (value.moment.outDetail.dateTime <= vm.invoice.toDate)
                        //        vm.vehicleWithFine = value.movement.vehicle.plateNo;
                        //});
                        vm.getDescription();

                        vm.getUserName(vm.invoice.creatorUserId);

                        if (vm.isPrintSaleOrderWithInvoiceEnabled) {
                            vm.saleOrder = result.saleOrder;
                        }
                        vm.fines = result.fines;

                        var isFineLineExists = false;
                        var isTollLineExists = false;
                        var isParkingLineExists = false;
                        var isDarbLineExist = vm.invoice.voucherLines.some(e => e.chargesTypeId == 73);

                        if (isDarbLineExist)
                            getDarbTolls();

                        if (vm.isSalikModuleEnabled) {
                            angular.forEach(vm.invoice.voucherLines, function (value) {
                                if (value.chargesTypeId == 7)
                                    isTollLineExists = true;
                            });

                            if (isTollLineExists) {
                                if (appSession.tenant.tenancyName == "althiqa") {
                                    getTollsForAlthiqa();
                                }
                                else {
                                    getTolls();
                                }
                            }
                        }

                        if (vm.isParkingModuleEnabled) {
                            angular.forEach(vm.invoice.voucherLines, function (value) {
                                if (value.chargesTypeId == 39)
                                    isParkingLineExists = true;
                            });

                            if (isParkingLineExists) {
                                getParkings();
                            }
                        }

                        //if (isDarbLineExist)

                        if (vm.isFineModuleEnabled) {
                            angular.forEach(vm.invoice.voucherLines, function (value) {
                                if (value.chargesTypeId == 8)
                                    isFineLineExists = true;
                            });

                            if (isFineLineExists)
                                getFines();
                        }
                        if (vm.invoice.agreement) {
                            if (vm.invoice.agreement.driver != null) {
                                if (vm.invoice.agreement.driver.identityDocuments.length > 0) {
                                    var driverDocuments = $filter('filter')(vm.invoice.agreement.driver.identityDocuments, {
                                        identityDocumentType: 4
                                    }, true);
                                    vm.driverDoc = driverDocuments[0];
                                }
                            }
                        }

                        if (vm.invoice.voucherSubTypeId == 7 || vm.invoice.voucherSubTypeId == 8 || vm.invoice.voucherSubTypeId == 95) {
                            vm.invoice.voucherLines.forEach(function (value) {
                                if (value.description == 'Surcharge')
                                    value.description = '';
                            })
                        }

                        vm.getMilageCharges();

                        vm.getVehicleType();
                        if (vm.invoice.agreement != null) {
                            if (vm.invoice.voucherSubTypeId != 98 && vm.invoice.voucherSubTypeId != 104) {
                                // vm.rentalDiscountExcludeAmount = vm.invoice.agreement.charges.filter(e => e.chargesTypeId == 1)[0].rate;
                                var charge = vm.invoice.agreement.charges.find(e => e.chargesTypeId == 1);
                                vm.rentalDiscountExcludeAmount = charge ? charge.rate : 0;
                            }
                        }

                        if (vm.isWorkshopModuleEnabled) {
                            angular.forEach(vm.invoice.voucherLines, function (row) {
                                if (row.credit != 0 && !row.hidden && row.chargesTypeId != 41) {
                                    if (vm.customSerial == 0) {
                                        row.customSrNo = 2;
                                        vm.customSerial = 2;
                                    }
                                    else {
                                        row.customSrNo = vm.customSerial + 1;
                                        vm.customSerial = vm.customSerial + 1;
                                    }
                                }
                            });
                        }
                        if (!vm.isMergedEquipmentInvoice && vm.invoice.voucherSubTypeId == 46) // only for equipment invoice
                            vm.invoice.voucherLines.filter(e => !e.hidden).forEach(e => e.agreementId = vm.invoice.agreementId);


                        if (vm.isPointJuntion) {
                            if (vm.isMergedRentalInvoice) {
                                vm.getDetailsForMergPrint();

                            }

                        }





                        vm.groupByInvoiceData = groupBy(vm.invoice.voucherLines.filter(e => !e.hidden), 'agreementId');

                        vm.dataToIterate = [];
                        angular.forEach(vm.groupByInvoiceData, function (value, key) {
                            var result = [];
                            if (value.some(e => e.chargesTypeId != 71 && e.vehicleId)) {
                                result.vehicle = value.find(e => e.chargesTypeId != 71 && e.vehicleId).vehicle;
                            }
                            result.rowData = angular.copy(value);
                            vm.dataToIterate.push(result);

                            vm.isDayShift = false;
                            vm.isNightShift = false;
                            vm.hasMobilizationCharges = false;

                            vm.dataToIterate.forEach(e => {
                                if (e.rowData.some(r => r.valueField1 == 1))
                                    vm.isDayShift = true;
                                if (e.rowData.some(r => r.valueField1 == 2))
                                    vm.isNightShift = true;
                                if (e.rowData.some(r => r.valueField1 != 1 && r.valueField1 != 2))
                                    vm.hasMobilizationCharges = true;
                            });

                        });
                        assignOrderByField(vm.dataToIterate);

                        if (vm.invoice.voucherSubTypeId == 46)
                            customizePagesData();
                        else
                            customizePagesDataForVoucherLines();

                        vm.sumlines();
                        if (appSession.tenant.tenancyName == "AMRACSQatar" && vm.isMergedRentalInvoice) {
                            var printSrNo = 1;
                            vm.pagesData.forEach(page => {
                                page.voucherLinesdataToIterate.forEach(voucherLine => {
                                    if (voucherLine.credit != 0 && !voucherLine.hidden && voucherLine.chargesType.name != 'Discount') {
                                        voucherLine.srNo = printSrNo++;
                                    }
                                });
                            });
                        }
                    }).finally(function () {
                        vm.loading = false;
                    });
                }
                if (options.printTrips) {

                    limoTrips.getInvoiceTrips({
                        id: invoiceId,
                    }).success(function (result) {
                        vm.trips = result.items;
                        vm.srNo = 1;
                        angular.forEach(vm.trips, function (trip) {

                            angular.forEach(trip.tripCharges, function (voucherLine) {
                                if (voucherLine.charges > 0) {
                                    voucherLine.srNo = angular.copy(vm.srNo);
                                    vm.srNo++;
                                }
                            });
                        });
                        getDublicateVehicle();
                        getDublicateVessel();

                    }).finally(function () {
                        //$(':contains("By:")').each(function () {
                        //    $(this).html($(this).html().split("By:").join(""));
                        //});
                        //$(voucherLine.description).html($(this).html().split(", Surcharge").join(""));
                        //var str = $("#abc").text();
                        //$("#abc").text(str.substring(3));

                        vm.loading = false;
                    });
                }
            };
        }
    ]);
