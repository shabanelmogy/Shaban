// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:333215-333580
appModule.controller('tenant.views.crs.vouchers.creditNotes.printModal', ['$scope', '$stateParams', '$sce', 'appSession', 'abp.services.app.creditNote', 'abp.services.app.commonLookup', 'abp.services.app.allocation', 'utilities',
        function ($scope, $stateParams, sce, appSession, creditNoteService, commonLookupService, allocationService, utilities) {
            var vm = this;
            vm.tenantName = appSession.tenant.name;
            vm.localize = (key) => app.localize(key);
            vm.fileName = appSession.tenant.tenancyName.toLowerCase() + '-' + 'header.png';
            var creditNoteId = 0;
            // vm.userName = appSession.user.name;
            vm.amount = 0;
            vm.totalAmountPerPage = 0;
            vm.totalTaxPerPage = 0;
            vm.isMultiCurrencyEnabled = abp.features.isEnabled('Core.MultiCurrency');
            vm.updateTRN = abp.features.isEnabled("CRS.CustomFeatures.UpdateTRN");
            //vm.customerWiseTrnBasedOnPeriod = abp.features.isEnabled("CRS.CustomFeatures.CustomerWiseTrnBasedOnPeriod");
            vm.locationId = appSession.user.locationId;
            vm.currency = abp.setting.get("App.General.CurrencyCode");
            vm.currencyName = abp.setting.get("App.General.CurrencyName");
            vm.isTaxEnabled = abp.features.isEnabled("CRS.Tax");
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.allowPrintingOfVoidedVouchers = abp.setting.getBoolean("App.General.AllowPrintingOfVoidedVouchers");
            vm.tollLenth = 0;
            var recordsPerPage = 6;

            if (appSession.tenant.tenancyName == 'advanced') {
                recordsPerPage = 6;
            }
            if (appSession.tenant.tenancyName == 'Belhasa') {
                recordsPerPage = 12;
            }
            if (appSession.tenant.tenancyName == 'default') {

                recordsPerPage = 12;
            }
            if (appSession.tenant.tenancyName == "Gargashleasing") {
                recordsPerPage = 8;
            }
            vm.printHeader = true;
            //if pop-up print
            if ($scope.$parent != null) {
                if (!isNaN(typeof $scope.$parent.vmMain.creditNote === 'object' ? $scope.$parent.vmMain.creditNote.id : $scope.$parent.vmMain.creditNote))
                    creditNoteId = typeof $scope.$parent.vmMain.creditNote === 'object' ? $scope.$parent.vmMain.creditNote.id : $scope.$parent.vmMain.creditNote;
            }
            if ($scope.$parent !== null) {
                if (creditNoteId) {
                    vm.printHeader = typeof $scope.$parent.vmMain.creditNote === 'object' ? !($scope.$parent.vmMain.creditNote.printObj.printHeader) : true;
                }
            }
            //if through url print
            if (creditNoteId == 0 && !isNaN($stateParams.query)) {
                creditNoteId = $stateParams.query;
            }

            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            vm.roundingforViewAdvanced = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            vm.getlocalDateTime = function (date, format) {
                if (date != null) {
                    if (format == null) format = vm.dateFormat;

                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(format);
                }
                else {
                    return "";
                }
            };

            //--------------For GargashLeasing---------------

            vm.oldTRN = '100051181400003';
            vm.newTRN = '104681493300003';
            vm.cutoffDate = new Date('2024-10-01');

            vm.getTRN = function (invoiceDateObj) {
                var invoiceDateObj = new Date(vm.creditNote.date);
                return invoiceDateObj < vm.cutoffDate ? vm.oldTRN : vm.newTRN;
            };

            //--------------GargashLeasing End---------------

            vm.currencyAndRounding = function (value) {
                if (value == null) return null;

                return value.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            };

            vm.getUserName = function (userId) {
                commonLookupService.getUser({
                    id: userId
                }).success(function (result) {
                    vm.userName = result.name + ' ' + result.surname;
                });
            };

            vm.getlocalDateTimeForEngAr = function (date, format) {
                if (date != null) {
                    if (format == null) format = vm.dateFormat;

                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(format);
                }
                else {
                    return "";
                }
            };
            vm.sumAmountTax = function () {
                var totalAmount = 0.0;
                var totalTax = 0.0;
                vm.creditNote.voucherLines.forEach(function (value) {
                    if (value.debit > 0)
                        totalAmount = totalAmount + parseFloat(value.debit);
                    if (value.tax > 0) {
                        value.taxable = true;
                        totalTax += utilities.round(value.tax, 2);
                    }
                    else
                        value.taxable = false;

                });
                vm.creditNote.tax = totalTax;
                vm.creditNote.amount = vm.isTaxInclusive ? utilities.round(totalAmount, 2) : (utilities.round(totalAmount, 2) + utilities.round(totalTax, 2)) / 1;
                vm.creditNote.amount = utilities.round(vm.creditNote.amount, 2);
                if (vm.creditNote.amount > 0) {
                    if (vm.autoCalculateAmountInWords == "true")
                        vm.creditNote.amountInWords = utilities.toWords(vm.creditNote.amount);
                }
            };
            function getAllocations() {
                var voucherTypesFilter = [
                    1, 7
                ]
                allocationService.getAllocationsForPrint(
                    {
                        voucherCategory: 2,
                        VoucherId: creditNoteId,
                        voucherTypesFilter: voucherTypesFilter
                    }).success(function (result) {
                        vm.allocationData = result;
                    })
            };

            //vm.convertToWords = function (amount) {
            //  return  utilities.toWords(amount)
            //};
            vm.currencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            }
            function customizePagesDataForVoucherLines() {
                var tenceyName = appSession.tenant.tenancyName.toLowerCase();
                //galadaritrucks
                if (tenceyName == 'galadaritrucks') {

                    recordsPerPage = 4;

                }
                if (tenceyName == 'advanced') {

                    recordsPerPage = 6;

                }
                if (tenceyName == 'Belhasa') {

                    recordsPerPage = 12;

                }
                if (tenceyName == 'default') {

                    recordsPerPage = 12;

                }
                if (tenceyName == 'fixera') {

                    recordsPerPage = 6;

                }
                if (tenceyName == 'gargashleasing') {

                    recordsPerPage = 6;

                }
                var customArray = [];

                if (vm.creditNote.voucherSubTypeId == 22)
                    customArray = vm.creditNote.voucherLines.filter(row => !row.contactId && row.chargesTypeId != 21);
                if (vm.creditNote.voucherSubTypeId == 23)
                    customArray = vm.creditNote.voucherLines.filter(row => !row.contactId && row.chargesTypeId != 21 && !row.hidden);
                else if (vm.creditNote.voucherSubTypeId == 56)
                    customArray = vm.creditNote.voucherLines.filter(v => v.credit != 0 && !v.hidden);

                customArray.forEach((element, index) => element.srNo = index + 1);

                var arrayLength = customArray.length;
                var noOfPages = arrayLength / recordsPerPage;

                vm.pagesData = [];
                for (var i = 0; i < noOfPages; i++) {
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
            vm.getTaxCategoryAlThiqa = function (id, tax) {
                if (id == 1) {
                    return (vm.creditNote.taxPercent || 0) + "%";
                }
                else if (id == 2) {
                    return "Tax Expt";
                }
                else if (id == 3) {
                    return "0%";
                }
                else if (id === 4) {
                    if (tax > 0)
                        return (vm.creditNote.taxPercent || 0) + "%";
                    else
                        return "OOS";
                }
                else {
                    return " ";
                }
            }
            function init() {
                {
                    getAllocations();
                    vm.loading = true;
                    creditNoteService.getCreditNoteForPrint({
                        id: creditNoteId
                    }).success(function (result) {
                        vm.amountWithOutTax = 0;
                        vm.totalTax = 0;
                        vm.creditNote = result.creditNote != null ? result.creditNote : result.creditNoteDelivery;
                        vm.creditNote.voucherLines.forEach(function (value) {

                            if (!value.contactId && value.chargesTypeId != 21 && !value.hidden) {
                                vm.amountWithOutTax += value.debit;
                                vm.totalTax += value.tax;
                            }
                            vm.amountWithOutTax = utilities.round(vm.amountWithOutTax, 2);
                            vm.totalTax = utilities.round(vm.totalTax, 2);

                        });

                        if (vm.isMultiCurrencyEnabled) {
                            if (result.creditNoteDelivery) {
                                if (vm.creditNote.customerCurrency) {
                                    vm.currency = vm.creditNote.customerCurrency.code;
                                    currencyName = vm.creditNote.customerCurrency ? vm.creditNote.customerCurrency.name : null;
                                    decimalName = vm.creditNote.customerCurrency ? vm.creditNote.customerCurrency.decimalName : null;
                                    vm.creditNote.amountInWords = utilities.toWords(vm.creditNote.amount, currencyName, decimalName);
                                }
                                else {
                                    vm.creditNote.amountInWords = utilities.toWords(vm.creditNote.amount)
                                }
                            }
                            else {
                                if (vm.creditNote.contact.currency) {
                                    vm.currency = vm.creditNote.contact.currency.code;
                                    currencyName = vm.creditNote.contact.currency ? vm.creditNote.contact.currency.name : null;
                                    decimalName = vm.creditNote.contact.currency ? vm.creditNote.contact.currency.decimalName : null;
                                    vm.creditNote.amountInWords = utilities.toWords(vm.creditNote.amount, currencyName, decimalName);
                                }
                                else {
                                    vm.creditNote.amountInWords = utilities.toWords(vm.creditNote.amount)
                                }

                            }
                        }


                        vm.trn = vm.creditNote.location.taxId;
                        vm.currentDate = new Date(vm.creditNote.date);

                        if (vm.updateTRN) {

                            if (vm.creditNote.location.trnLogsList && vm.creditNote.location.trnLogsList.length > 0) {
                                for (let i = 0; i < vm.creditNote.location.trnLogsList.length; i++) {
                                    const trnLog = vm.creditNote.location.trnLogsList[i];

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
                        //    if (vm.creditNote && vm.creditNote.contact && vm.creditNote.contact.trnLogsList && vm.creditNote.contact.trnLogsList.length > 0) {
                        //        for (let i = 0; i < vm.creditNote.contact.trnLogsList.length; i++) {
                        //            const trnLog = vm.creditNote.contact.trnLogsList[i];

                        //            if (trnLog && trnLog.fromDate && trnLog.toDate) {
                        //                const fromDate = new Date(trnLog.fromDate);
                        //                const toDate = new Date(trnLog.toDate);
                        //                fromDate.setHours(0, 0, 0, 0); // start of day
                        //                toDate.setHours(23, 59, 59, 999); // end of day

                        //                if (vm.currentDate >= fromDate && vm.currentDate <= toDate) {
                        //                    vm.creditNote.contact.taxId = trnLog.taxId;
                        //                    break;
                        //                }
                        //            }
                        //        }
                        //    }
                        //}
                        vm.getUserName(vm.creditNote.creatorUserId);
                        if (vm.creditNote.voucherSubTypeId == 23) {
                            angular.forEach(vm.creditNote.voucherLines, function (value, key) {
                                if (value.fromDate != null && value.toDate != null)
                                    value.showDate = true;
                                if (value.vehicleId != null && value.vehicleId > 0)
                                    value.vehicleShow = true;
                                if (value.contactId != null && value.contactId > 0) {
                                    value.contactShow = true;
                                }
                                //if (!value.contactId)
                                //    vm.accountChanged(value);
                                if (!value.hidden) {
                                    if (value.debit > 0)
                                        value.taxDebit = value.tax;
                                    if (value.credit > 0)
                                        value.taxCredit = value.tax;
                                }
                                //  vm.sumAmountTax();
                            });
                        }

                        if (vm.creditNote.voucherSubTypeId == 56 || vm.creditNote.voucherSubTypeId == 22 || vm.creditNote.voucherSubTypeId == 23) {

                            customizePagesDataForVoucherLines();
                        }


                    }).finally(function () {
                        vm.loading = false;
                    });
                }

            }

            init();

        }
    ]);
