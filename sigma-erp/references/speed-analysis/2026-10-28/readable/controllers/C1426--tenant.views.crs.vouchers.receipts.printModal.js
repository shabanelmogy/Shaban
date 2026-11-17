// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:392357-392967
appModule.controller('tenant.views.crs.vouchers.receipts.printModal', [
        '$scope', 'appSession', '$stateParams', 'abp.services.app.receiptSearch', 'abp.services.app.commonLookup', 'abp.services.app.receiptChargesAllocation', 'utilities', 'abp.services.app.allocation', 'abp.services.app.billingMethod',
        function ($scope, appSession, $stateParams, receiptSearchService, commonLookupService, receiptChargesAllocationService, utilities, allocationService, billingMethodService) {

            var vm = this;

            vm.tenantName = appSession.tenant.name;
            vm.fileName = appSession.tenant.tenancyName.toLowerCase() + '-' + 'header.png';
            vm.oneReceiptOnMultipleAgreement = abp.features.isEnabled("CRS.CustomFeatures.OneReceiptOnMultipleAgreement");
            vm.userName = '';
            vm.isAccountFeatureEnabled = abp.features.isEnabled("CRS.Accounts");
            vm.isMultiCurrencyEnabled = abp.features.isEnabled('Core.MultiCurrency');
            vm.currency = abp.setting.get("App.General.CurrencyCode");
            vm.locationId = appSession.user.locationId;
            vm.receiptOnScreenAllocationWithTypesOfCharges = utilities.parseBoolean(abp.setting.get("App.General.ReceiptOnScreenAllocationWithTypesOfCharges"));
            vm.receiptOnScreenAllocationWithReceivables = utilities.parseBoolean(abp.setting.get("App.General.ReceiptOnScreenAllocationWithReceivables"));
            vm.allowPrintingOfVoidedVouchers = abp.setting.getBoolean("App.General.AllowPrintingOfVoidedVouchers");
            vm.isCommercialRegistrationNumber = utilities.parseBoolean(abp.setting.get("App.Speed.Common.CommercialRegistrationNumberInPrint"));
            vm.isTaxEnabled = abp.features.isEnabled("CRS.Tax");
            vm.updateTRN = abp.features.isEnabled("CRS.CustomFeatures.UpdateTRN");
            //vm.customerWiseTrnBasedOnPeriod = abp.features.isEnabled("CRS.CustomFeatures.CustomerWiseTrnBasedOnPeriod");
            vm.isAccountsEnabled = abp.features.isEnabled("CRS.Accounts");
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.receiptAllocationData = null;
            vm.allocationData = null;
            vm.filteredAllocations = [];
            var agreementId = null;
            var receiptId = 0;
            vm.showGeneralPayment = false;
            vm.billingMethods = [];
            vm.printHeader = true;
            var recordsPerPage = 10;
            //if pop-up print
            if ($scope.$parent != null) {
                if (!isNaN($scope.$parent.vmMain.receipt.id))
                    receiptId = $scope.$parent.vmMain.receipt.id;
            }
            if ($scope.$parent !== null) {
                if (receiptId) {
                    vm.printHeader = !($scope.$parent.vmMain.receipt.printObj.printHeader);
                }
            }
            //if through url print
            if (receiptId == 0 && !isNaN($stateParams.query)) {
                receiptId = $stateParams.query;
            }
            vm.currentDateTime = new Date();
            vm.filteringAllocations = function (item) {
                if (item.allocatedNow > 0)
                    return true;
                else
                    return false;
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
            vm.localize = function (key) {
                if (key == null)
                    return '';
                return app.localize(key);
            };

            vm.oldTRN = '100051181400003';
            vm.newTRN = '104681493300003';
            vm.cutoffDate = new Date('2024-10-01');

            vm.getTRN = function (invoiceDateObj) {
                var invoiceDateObj = new Date(vm.receipt.date);
                return invoiceDateObj < vm.cutoffDate ? vm.oldTRN : vm.newTRN;
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

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            vm.getlocalDateTimeYearMonth = function (date, format) {
                if (date != null) {
                    if (format == null) format = 'YYYY/MM';

                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(format);
                }
                else {
                    return "";
                }
            };
            vm.sumAllocatedAmount = function () {
                if (vm.allocationData == null)
                    return 0;

                if (vm.allocationData.length == 0)
                    return 0;

                var amount = 0;
                angular.forEach(vm.allocationData, function (value, key) {
                    if (value.amount > 0)
                        amount = amount + value.amount;
                });

                return amount;
            };
            vm.getUserName = function (userId) {
                commonLookupService.getUser({
                    id: userId
                }).success(function (result) {
                    vm.userName = result.name + ' ' + result.surname;
                });
            };
            function getReceiptChargesAllocationData() {
                vm.loading = true;
                receiptChargesAllocationService.getReceiptChargesAllocationsForEdit({
                    voucherId: receiptId
                }).success(
                    function (data) {
                        vm.allocationData = data.items;
                        vm.totalAllocatedAmount = vm.sumAllocatedAmount();
                        //customizePagesDataForAllocations();

                    }).finally(function () {
                        vm.loading = false;
                    });
            };
            function getReceiptNotes() {

                if (vm.receipt.billingDetail) {
                    if (vm.receipt.billingDetail.billingMethod.type === 2) {// Credit Card
                        if (vm.receipt.billingDetail.creditCard.transactionNo)
                            vm.notes = 'Transaction No: ' + vm.receipt.billingDetail.creditCard.transactionNo;
                        if (vm.receipt.billingDetail.creditCard.cardNoLastDigits)
                            vm.notes += ', Last 4 Digits: ' + vm.receipt.billingDetail.creditCard.cardNoLastDigits;
                        if (vm.receipt.billingDetail.creditCard.expiryDate)
                            vm.notes += ', Expiry Date: ' + vm.getlocalDateTimeYearMonth(vm.receipt.billingDetail.creditCard.expiryDate);
                        if (vm.receipt.notes)
                            vm.notes += ', ' + vm.receipt.notes;
                        return;
                    }

                    if (vm.receipt.billingDetail.billingMethod.type === 4) {// Cheque
                        if (vm.receipt.billingDetail.cheque.chequeNo)
                            vm.notes = 'No: ' + vm.receipt.billingDetail.cheque.chequeNo;
                        if (vm.receipt.billingDetail.cheque.bankName)
                            vm.notes += ', Bank: ' + vm.receipt.billingDetail.cheque.bankName;
                        if (vm.receipt.billingDetail.cheque.chequeDate)
                            vm.notes += ', Date: ' + vm.getlocalDateTime(vm.receipt.billingDetail.cheque.chequeDate);
                        if (vm.receipt.notes)
                            vm.notes += ', ' + vm.receipt.notes;
                        return;
                    }


                    if (vm.receipt.billingDetail.billingMethod.type === 5) {// BankTransfer
                        if (vm.receipt.billingDetail.bankAccount) {
                            if (vm.receipt.billingDetail.bankAccount.bankName && vm.isAccountFeatureEnabled)
                                vm.notes = 'Bank: ' + vm.receipt.billingDetail.bankAccount.bankName;
                            if (vm.receipt.billingDetail.notes)
                                vm.notes += ', ' + vm.receipt.billingDetail.notes;
                            if (vm.receipt.notes)
                                vm.notes += ', ' + vm.receipt.notes;
                            return;
                        }
                        else {
                            vm.notes = vm.receipt.notes;
                            return;
                        }
                    }
                    else {
                        vm.notes = vm.receipt.notes;
                        return;
                    }
                }
                else {
                    vm.notes = vm.receipt.notes;
                    return;
                }
            };


            function getBillingMethods() {

                //   vm.loading = true;
                billingMethodService.getBillingMethods({ category: 1 }).success(function (data) {

                    vm.billingMethods = data.items;
                }).finally(function () {
                    //      vm.loading = false;
                });
            };

            vm.checkCurrentDate = function () {
                if (vm.currentDate >= vm.receipt.billingDetail.cheque.chequeDate) {
                    vm.isCurrentDateBigger = true;
                } else {
                    vm.isCurrentDateBigger = false;
                }
            };

            function getAllocationData() {

                vm.loading = true;
                allocationService.getAllocationsForPrint({ voucherCategory: 2, VoucherId: receiptId }).success(
                    function (data) {
                        vm.receiptAllocationData = data;
                        vm.filteredAllocations = [];
                        vm.receiptAllocationData.allocations.forEach(function (value) {
                            if (value.allocatedNow > 0)
                                vm.filteredAllocations.push(value);
                        });

                        customizePagesDataForAllocations();

                    }).finally(function () {
                        vm.loading = false;
                    });

                if (vm.isAllocationWithChargesTypeEnabled && vm.receipt.voucherSubTypeId != 35) {
                    allocationService.getAllocationsForEdit2({ contactId: vm.receipt.contactId, voucherCategory: 2, VoucherId: receiptId, agreementId: agreementId }).success(
                        function (data) {

                            vm.allocationData = data;

                        }).finally(function () {
                            vm.loading = false;
                        });
                } else {
                    allocationService.getAllocationsForEdit({ contactId: vm.receipt.contactId, voucherCategory: 2, VoucherId: receiptId, agreementId: agreementId }).success(
                        function (data) {

                            vm.allocationData = data;

                        }).finally(function () {
                            vm.loading = false;
                        });

                }


            };

            vm.sumAmount = function () {
                if (vm.receiptAllocationData == null)
                    return 0;

                if (vm.receiptAllocationData.allocations.length == 0)
                    return 0;

                var amount = 0;
                angular.forEach(vm.receiptAllocationData.allocations, function (value, key) {
                    if (value.allocatedNow > 0)
                        amount = amount + value.allocatedNow;
                });

                return amount;
            };



            function customizePagesDataForVoucherLines() {

                var customArray = [];
                customArray = vm.receipt.voucherLines.filter(v => !v.hidden);
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

                if (vm.pagesData.length == 0) {
                    vm.pagesData.push({
                        pageNo: 1,
                        voucherLinesdataToIterate: []
                    })
                }
            }

            function customizePagesDataForAllocations() {


                if (appSession.tenant.tenancyName == "gargashERL") {
                    recordsPerPage = 8;
                }
                var customArray = [];
                customArray = vm.filteredAllocations;
                customArray.forEach((e, index) => e.srNo = index + 1);
                var arrayLength = customArray.length;
                var noOfPages = arrayLength / recordsPerPage;
                vm.pagesData = [];
                for (var i = 0; i < noOfPages; i++) {
                    var subArray = [];
                    var start = i * recordsPerPage;
                    var end = start + recordsPerPage;
                    subArray = customArray.slice(start, end);
                    var startingSerialNumber = i * recordsPerPage + 1;
                    vm.pagesData.push({
                        pageNo: i + 1,
                        startingSerialNumber: startingSerialNumber,
                        AllocationsDataToIterate: subArray
                    })
                }

                if (vm.pagesData.length == 0) {
                    vm.pagesData.push({
                        pageNo: 1,
                        startingSerialNumber: 1,
                        AllocationsDataToIterate: []
                    })
                }
            }

            function init() {

                vm.loading = true;
                receiptSearchService.getReceipt({
                    id: receiptId
                }).success(function (result) {

                    vm.receipt = result;
                    vm.trn = vm.receipt.location.taxId;
                    vm.getUserName(vm.receipt.creatorUserId);
                    getAllocationData();
                    getReceiptNotes();
                    getBillingMethods();
                    if (vm.receiptOnScreenAllocationWithTypesOfCharges)
                        getReceiptChargesAllocationData();

                }).finally(function () {
                    vm.loading = false;
                });
            };

            function initPrintReceipt() {
                vm.loading = true;

                receiptSearchService.getReceiptForPrint({
                    id: receiptId
                }).success(function (result) {
                    vm.receipt = result;
                    if (vm.isMultiCurrencyEnabled) {
                        if (vm.receipt.currency) {
                            vm.currency = vm.receipt.currency.code;
                        }
                    }
                    if (!receiptId) {
                        vm.receipt.voucherSubTypeId = 25; // by default contact receipt selection
                    }
                    if (vm.manualReceiptNo)
                        vm.receipt.voucherNo = parseInt(vm.receipt.voucherNo);
                    if (vm.receipt.contactId) {
                        getAllocationData();
                    }
                    if (vm.receipt.billingDetail.billingMethodId == 0)
                        vm.receipt.billingDetail.billingMethodId = null;

                    if (vm.receipt.voucherNo <= 0)
                        vm.receipt.voucherNo = null;

                    if (vm.receipt.id > 0) {
                        vm.isEditMod = true;
                        vm.trn = vm.receipt.location.taxId;
                        vm.currentDate = new Date(vm.receipt.date);

                        if (vm.updateTRN) {

                            if (vm.receipt.location.trnLogsList && vm.receipt.location.trnLogsList.length > 0) {
                                for (let i = 0; i < vm.receipt.location.trnLogsList.length; i++) {
                                    const trnLog = vm.receipt.location.trnLogsList[i];

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

                        //    if (vm.receipt.contact.trnLogsList && vm.receipt.contact.trnLogsList.length > 0) {
                        //        for (let i = 0; i < vm.receipt.contact.trnLogsList.length; i++) {
                        //            const trnLog = vm.receipt.contact.trnLogsList[i];

                        //            const fromDate = new Date(trnLog.fromDate);
                        //            const toDate = new Date(trnLog.toDate);

                        //            if (vm.currentDate >= fromDate && vm.currentDate <= toDate) {
                        //                vm.trn = trnLog.taxId;
                        //                break;
                        //            }
                        //        }
                        //    }
                        //}

                        vm.getUserName(vm.receipt.creatorUserId);
                        getAllocationData();
                        getReceiptNotes();
                        getBillingMethods();
                        if (vm.receipt.voucherSubTypeId == 26) {
                            vm.receiptType = app.localize('GeneralReceipt');
                            vm.showGeneralPayment = true;
                            vm.contactTypeLabel = app.localize("Customer");
                            vm.contactType = 2;
                            vm.accountCategory = null;
                            angular.forEach(vm.receipt.voucherLines, function (value, key) {
                                if (value.vehicleId != null && value.vehicleId > 0)
                                    value.vehicleShow = true;
                                if (value.contactId != null && value.contactId > 0)
                                    value.contactShow = true;
                                //for edit case, get tax
                                //vm.accountChangedGeneralPayment(value);
                                if (!value.hidden) {
                                    if (value.debit > 0) {
                                        value.taxDebit = value.tax;
                                        //  value.showDebitField = true; 
                                    }
                                    if (value.credit > 0) {
                                        value.taxCredit = value.tax;
                                        // value.showCreditField = true;

                                    }
                                    if (value.tax > 0) {
                                        value.showTax = true;
                                    }
                                }
                                vm.sumAmount();
                            });
                            //vm.calculateGeneralReceiptAmount();
                        }
                    }

                    if (vm.receipt.id > 0) {
                        vm.isEditMod = true;



                        if (vm.receipt && vm.receipt.amountInWords == "") {
                            vm.receipt.amountInWords = utilities.toWords(vm.receipt.amount);
                        }


                    } else {
                        vm.isEditMod = false;
                    }

                    customizePagesDataForVoucherLines();

                    //customizePagesDataForAllocations();

                }).finally(function () {
                    vm.loading = false;
                });
            }
            vm.billingMethodSelected = function () {
                if (vm.receipt.billingDetail.billingMethod.type == 2 && vm.receipt.contact && vm.contactCardsList.length == 0) {
                    commonLookupService.getContactCards({ id: vm.receipt.contact.id })
                        .success(function (result) {
                            vm.contactCardsList = result;
                            vm.hasContactCards = vm.contactCardsList.length > 0;
                            var foundLines = $filter('filter')(vm.contactCardsList, {
                                isDefault: true,
                            }, true);
                            if (foundLines.length > 0)
                                foundLines[0].default = "Default";
                        });
                }

            };
            vm.accountChangedGeneralPayment = function (line) {
                line.contact = null;
                if ((line.account.accountCategory == 4 || line.account.accountCategory == 5) && vm.taxPercent > 0 && !vm.isTaxInclusive) {
                    line.showTax = true;
                    if (line.debit > 0)
                        line.showDebitField = true;
                    else if (line.credit > 0)
                        line.showCreditField = true;

                } else
                    line.showTax = false;

                if (line.account.accountCategory == 4 || line.account.accountCategory == 5) {
                    line.vehicleShow = true;
                    line.contactShow = false;
                    line.contactId = null;
                    line.contact = null;
                    line.accountId = line.account.id;
                    line.showVehicleMessage = "Please Select Vehicle";
                }
                else if (line.account.contactGroup != null) {
                    line.vehicleShow = false;
                    line.contactShow = true;
                    line.vehicleId = null,
                        line.vehicle = null;
                    line.account.contactGroupId = null;
                    line.accountId = line.account.id;
                    if (!line.account.contactGroup.isDefault)
                        line.account.contactGroupId = line.account.contactGroup.id;
                    if (line.account.contactGroup.contactType == 1) {
                        line.showContactMessage = "Please Select Staff";
                    }
                    if (line.account.contactGroup.contactType == 2) {
                        line.showContactMessage = "Please Select Customer";
                    }
                    if (line.account.contactGroup.contactType == 3) {
                        line.showContactMessage = "Please Select Supplier";
                    }

                }
                else {
                    line.vehicleShow = false;
                    line.contactShow = false;
                    line.vehicleId = null,
                        line.vehicle = null;
                    line.contactId = null;
                    line.contact = null;
                    line.accountId = line.account.id;
                }

                line.taxCredit = 0;
                line.taxDebit = 0;
                // line.tax = 0;
                vm.sumReceiptAmount();
            };
            vm.sumReceiptAmount = function () {
                if (vm.receipt == null)
                    return 0;

                if (vm.receipt.voucherLines == null)
                    return 0;
                var sum = 0;
                var debitSum = 0;
                var creditSum = 0;
                for (var i = 0; i < vm.receipt.voucherLines.length; i++) {
                    if (vm.receipt.voucherLines[i].debit != null && !vm.receipt.voucherLines[i].hidden)
                        debitSum = debitSum + utilities.round(vm.receipt.voucherLines[i].debit, 2);
                    if (vm.receipt.voucherLines[i].taxDebit && !vm.receipt.voucherLines[i].hidden) {
                        debitSum = debitSum + utilities.round(vm.receipt.voucherLines[i].taxDebit, 2);
                        vm.receipt.voucherLines[i].tax = vm.receipt.voucherLines[i].taxDebit;
                    }
                    debitSum = utilities.round(debitSum, 2);

                    if (vm.receipt.voucherLines[i].credit != null && !vm.receipt.voucherLines[i].hidden)
                        creditSum = creditSum + utilities.round(vm.receipt.voucherLines[i].credit, 2);
                    if (vm.receipt.voucherLines[i].taxCredit && !vm.receipt.voucherLines[i].hidden) {
                        creditSum = creditSum + utilities.round(vm.receipt.voucherLines[i].taxCredit, 2);
                        vm.receipt.voucherLines[i].tax = vm.receipt.voucherLines[i].taxCredit;
                    }
                    creditSum = utilities.round(creditSum, 2);
                }
                sum = creditSum - debitSum;


                if (sum > 0) {
                    if (vm.autoCalculateAmountInWords == "true")
                        vm.receipt.amountInWords = utilities.toWords(sum);
                } else {
                    if (vm.autoCalculateAmountInWords == "true")
                        vm.receipt.amountInWords = '';
                }

                vm.receipt.amount = sum;
                vm.receipt.debit = debitSum;
                vm.receipt.credit = creditSum;
            };
            //GetVehicleType:
            vm.getVehicleType = function (id) {
                if (id == 1) return app.localize("Rental");
                if (id == 2) return app.localize("Lease");
                if (id == 3) return app.localize("Replacement");
                if (id == 4) return app.localize("Limousine");
                if (id == 5) return app.localize("Workshop");
                if (id == 6) return app.localize("Staff");
            };
            //init();
            initPrintReceipt();
        }
    ]);
