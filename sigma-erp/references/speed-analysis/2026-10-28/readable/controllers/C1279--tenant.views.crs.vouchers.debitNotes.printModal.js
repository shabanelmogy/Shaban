// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:337197-337403
appModule.controller('tenant.views.crs.vouchers.debitNotes.printModal', ['$scope', '$stateParams', '$sce', 'appSession', 'abp.services.app.debitNote', 'abp.services.app.commonLookup', 'utilities',
        function ($scope, $stateParams, sce, appSession, debitNoteService, commonLookupService, utilities) {
            var vm = this;
            vm.tenantName = appSession.tenant.name;
            vm.fileName = appSession.tenant.tenancyName.toLowerCase() + '-' + 'header.png';
            var debitNoteId = 0;
            //  vm.userName = appSession.user.name;
            vm.userName = '';
            vm.amount = 0;
            vm.currency = abp.setting.get("App.General.CurrencyCode");
            vm.locationId = appSession.user.locationId;
            vm.updateTRN = abp.features.isEnabled("CRS.CustomFeatures.UpdateTRN");
            //vm.customerWiseTrnBasedOnPeriod = abp.features.isEnabled("CRS.CustomFeatures.CustomerWiseTrnBasedOnPeriod");
            vm.isMultiCurrencyEnabled = abp.features.isEnabled('Core.MultiCurrency');
            vm.currencyName = abp.setting.get("App.General.CurrencyName");
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.isTaxEnabled = abp.features.isEnabled("CRS.Tax");
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.trn = '';
            vm.isCustomer = true;
            vm.tollLenth = 0;
            var recordsPerPage = 5;
            vm.printHeader = true;
            vm.currencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            }
            //if pop-up print
            if ($scope.$parent != null) {
                if (!isNaN($scope.$parent.vmMain.debitNote.id))
                    debitNoteId = $scope.$parent.vmMain.debitNote.id;
            }
            if ($scope.$parent !== null) {
                if (debitNoteId) {
                    vm.printHeader = !($scope.$parent.vmMain.debitNote.printObj.printHeader);
                }
            }
            //if through url print
            if (debitNoteId == 0 && !isNaN($stateParams.query)) {
                debitNoteId = $stateParams.query;
            }

            vm.localize = function (input) {
                return app.localize(input);
            };

            vm.oldTRN = '100051181400003';
            vm.newTRN = '104681493300003';
            vm.cutoffDate = new Date('2024-10-01');

            vm.getTRN = function (invoiceDateObj) {
                var invoiceDateObj = new Date(vm.debitNote.date);
                return invoiceDateObj < vm.cutoffDate ? vm.oldTRN : vm.newTRN;
            };

            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };
            vm.currencyAndRounding = function (value) {
                if (value == null) return null;

                return value.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
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

            vm.getUserName = function (userId) {
                commonLookupService.getUser({
                    id: userId
                }).success(function (result) {
                    vm.userName = result.name + ' ' + result.surname;
                });
            };

            //vm.getlocalDateTimeForEngAr = function (date, format) {
            //    if (date != null) {
            //        if (format == null) format = 'DD-MMM-YYYY';

            //        var localTime = moment.utc(date).toDate();
            //        return moment(localTime).format(format);
            //    }
            //    else {
            //        return "";
            //    }
            //};



            vm.customerSettings = function (customer) {
                vm.isCustomer = true;
                if (customer != 2) {
                    vm.isCustomer = false;
                }
            };


            function customizePagesDataForVoucherLines() {
                var customArray = [];
                customArray = vm.debitNote.voucherLines.filter(v => !v.hidden);
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



            function init() {
                {

                    vm.loading = true;
                    debitNoteService.getDebitNoteForEdit({
                        id: debitNoteId
                    }).success(function (result) {
                        vm.customerSettings(result.contact.contactType)
                        vm.debitNote = result;
                        vm.debitNote.amountInWords = utilities.toWords(vm.debitNote.amount);
                        if (vm.isMultiCurrencyEnabled) {
                            if (vm.debitNote.contact.currency) {
                                currencyName = vm.debitNote.contact.currency ? vm.debitNote.contact.currency.name : null;
                                decimalName = vm.debitNote.contact.currency ? vm.debitNote.contact.currency.decimalName : null;
                                vm.debitNote.amountInWords = utilities.toWords(vm.debitNote.amount, currencyName, decimalName);
                                vm.currency = vm.debitNote.contact.currency.code;
                            }
                            else {
                                vm.debitNote.amountInWords = utilities.toWords(vm.debitNote.amount);
                            }
                        }
                        vm.trn = vm.debitNote.location.taxId;
                        vm.currentDate = new Date(vm.debitNote.date);

                        if (vm.updateTRN) {

                            if (vm.debitNote.location.trnLogsList && vm.debitNote.location.trnLogsList.length > 0) {
                                for (let i = 0; i < vm.debitNote.location.trnLogsList.length; i++) {
                                    const trnLog = vm.debitNote.location.trnLogsList[i];

                                    const fromDate = new Date(trnLog.fromDate);
                                    const toDate = new Date(trnLog.toDate);

                                    if (vm.currentDate >= fromDate && vm.currentDate <= toDate) {
                                        vm.trn = trnLog.taxId;
                                        break;
                                    }
                                }
                            }
                        }
                        //if (vm.customerWiseTrnBasedOnPeriod) {
                        //    if (vm.debitNote && vm.debitNote.contact && vm.debitNote.contact.trnLogsList && vm.debitNote.contact.trnLogsList.length > 0) {
                        //        for (let i = 0; i < vm.debitNote.contact.trnLogsList.length; i++) {
                        //            const trnLog = vm.debitNote.contact.trnLogsList[i];

                        //            if (trnLog && trnLog.fromDate && trnLog.toDate) {
                        //                const fromDate = new Date(trnLog.fromDate);
                        //                const toDate = new Date(trnLog.toDate);
                        //                fromDate.setHours(0, 0, 0, 0); // start of day
                        //                toDate.setHours(23, 59, 59, 999); // end of day

                        //                if (vm.currentDate >= fromDate && vm.currentDate <= toDate) {
                        //                    vm.debitNote.contact.taxId = trnLog.taxId;
                        //                    break;
                        //                }
                        //            }
                        //        }
                        //    }
                        //}
                        vm.getUserName(vm.debitNote.creatorUserId);

                        if (vm.debitNote.onAccountSupEditDelDisable || !vm.debitNote.onAccountSupEditDelDisable ) {

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
