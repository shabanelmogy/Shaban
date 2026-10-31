// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:375812-376381
appModule.controller('tenant.views.crs.vouchers.payments.printModal', [
        '$scope', 'appSession', '$stateParams', 'abp.services.app.payment', 'abp.services.app.allocation', 'utilities', 'abp.services.app.commonLookup', 'abp.services.app.expenseType', '$uibModal',
        function ($scope, appSession, $stateParams, paymentService, allocationService, utilities, commonLookupService, expenseTypeService, $uibModal) {

            var vm = this;

            vm.tenantName = appSession.tenant.name;
            vm.userName = appSession.user.name;
            vm.tenancyName = appSession.tenant.tenancyName.toLowerCase();
            vm.fileName = appSession.tenant.tenancyName.toLowerCase() + '-' + 'header.png';
            vm.currency = abp.setting.get("App.General.CurrencyCode");
            vm.isAccountFeatureEnabled = abp.features.isEnabled("CRS.Accounts");
            vm.isTaxEnabled = abp.features.isEnabled("CRS.Tax");
            vm.updateTRN = abp.features.isEnabled("CRS.CustomFeatures.UpdateTRN");
            //vm.customerWiseTrnBasedOnPeriod = abp.features.isEnabled("CRS.CustomFeatures.CustomerWiseTrnBasedOnPeriod");         
            vm.locationId = appSession.user.locationId;
            vm.isMultiCurrencyEnabled = abp.features.isEnabled('Core.MultiCurrency');
            vm.showExpensePayment = false;
            vm.showCustomerPayment = false;
            vm.showSupplierPayment = false;
            vm.showStaffPayment = false;
            vm.showNotes = true;
            vm.printHeader = true;
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            var paymentId = 0;
            vm.creditSum = 0;
            vm.debitSum = 0;
            vm.taxSum = 0;
            var srNo = 0;           
            vm.expenseTypes = [];
            vm.pagesData = [];
            vm.currentDateTime = new Date();
            var recordsPerPage = 18;
            if (vm.tenancyName.toLowerCase() == 'galadaritrucks') {
                recordsPerPage = 6;
            }
            if (vm.tenancyName.toLowerCase() == 'globalwings') {
                recordsPerPage = 18;
            }
            if (vm.tenancyName.toLowerCase() == 'default') {
                recordsPerPage = 18;
            }

            if (!isNaN($stateParams.query)) {
                paymentId = $stateParams.query;
            }
            //if pop-up print
            if ($scope.$parent != null) {
                if (!isNaN($scope.$parent.vmMain.payment.id))
                    paymentId = $scope.$parent.vmMain.payment.id;
            }
            if ($scope.$parent !== null) {
                if (paymentId) {
                    vm.printHeader = !($scope.$parent.vmMain.payment.printObj.printHeader);
                }
            }
            //if through url print
            if (paymentId == 0 && !isNaN($stateParams.query)) {
                paymentId = $stateParams.query;
            }

            vm.getAmountInWords = function (amount) {
                if (amount != null && amount > 0) {
                    return utilities.toWords(vm.rounding(amount));
                }
            };


            vm.removeDirhamWord = function (text) {
                return text.replace('Dirhams', '');
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };
            vm.currencyAndRounding = function (value) {
                if (value == null) return null;

                return value.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            };
            vm.currencyAndRoundingWithThree = function (value) {
                if (value == null) return null;

                return value.toLocaleString('en', { minimumFractionDigits: 3, maximumFractionDigits: 3 })
            };

            vm.rounding = function (value) {
                return utilities.round(value, 2);
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
            vm.contactTypeById = function (id) {
                if (id == 1) {
                    return "Staff";
                }
                else if (id == 2) {
                    return "Customer";
                }
                else if (id == 3) {
                    return "Supplier";
                }
                else {
                    return "";
                }
            };
            vm.getPaymentType = function (type) {
                if (type == 6) {
                    if (vm.isAccountFeatureEnabled)
                        return app.localize('PettyCashExpensePayment');
                    else
                        return app.localize('ExpensePayment');
                }
                if (type == 3)
                    return app.localize('CustomerPayment');
                if (type == 4)
                    return app.localize('SupplierPayment');
                if (type == 5)
                    return app.localize('StaffPayment');
                if (type == 21)
                    return app.localize('GeneralPayment');
                if (type == 15)
                    return app.localize('DepositRefund');
                if (type == 71)
                    return app.localize('AdvancePayment');
                return '';
            };

            function getAllocations(callbackFunction) {
                allocationService.getAllocationsForPrint({
                    contactId: vm.payment.contact.id,
                    voucherCategory: 1,
                    VoucherId: paymentId,
                }).success(function (data) {
                    vm.allocationData = data;
                    callbackFunction();
                });
            };



            vm.changeNamePopUp = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/banking/chequesPayables/changeNameprintModal.cshtml',
                    controller: 'tenant.views.crs.banking.chequesPayables.changeNameprintModal as vm',
                    backdrop: 'static',
                    size: 'sm',
                    resolve: {
                        contactName: function () {
                            return {
                                contactName: vm.payment.contact ? vm.payment.contact.name : '',
                            }
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    if (vm.payment.contact == null) {
                        vm.payment.contact = { name: '' };
                        vm.payment.contact.name = result;
                    }
                    else {
                        vm.payment.contact.name = result;
                    }
                });
            };



            function getExpenses() {
                expenseTypeService.getExpenseTypes().success(function (data) {
                    vm.expenseTypes = data.items;
                });
            }



            vm.getExpenseNameById = function (id) {
                if (id != null) {
                    var result = vm.expenseTypes.filter(e => e.id == id)[0].name;
                    return result;
                }
            };

            vm.getUserName = function (userId) {
                commonLookupService.getUser({
                    id: userId
                }).success(function (result) {
                    vm.userName = result.name + ' ' + result.surname;
                });
            };

            vm.getAuthorizedUserName = function (userId) {
                commonLookupService.getUser({
                    id: userId
                }).success(function (result) {
                    vm.authorizedUserName = result.name + ' ' + result.surname;
                });
            };

            function customizePagesDataForVoucherLines() {
                //advanced
                if (appSession.tenant.tenancyName.toLowerCase() == 'advanced') {
                    recordsPerPage = 3;
                }

                if (appSession.tenant.tenancyName.toLowerCase() == 'autobahn') {
                    recordsPerPage = 13;
                }
                if (appSession.tenant.tenancyName.toLowerCase() == 'autobahnws') {
                    recordsPerPage = 13;
                }
                if (appSession.tenant.tenancyName.toLowerCase() == 'galadaritrucks') {
                    recordsPerPage = 6;
                }
                if (appSession.tenant.tenancyName.toLowerCase() == 'globalwings') {
                    recordsPerPage = 15;
                }
                if (appSession.tenant.tenancyName.toLowerCase() == 'default') {
                    recordsPerPage = 15;
                }
                if (appSession.tenant.tenancyName.toLowerCase() == 'almuftahbahrain') {
                    recordsPerPage = 9;
                }

                var customArray = [];
                customArray = vm.payment.voucherLines;
                if (vm.payment.voucherSubTypeId != 21)
                    customArray = vm.payment.voucherLines.filter(v => !v.hidden);
                var arrayLength = customArray.length;
                customArray.forEach((e, index) => e.srNo = index + 1);
                var noOfPages = arrayLength / recordsPerPage;
                vm.pagesData = [];
                var isExceed = false;
                if (arrayLength > 3 && ((arrayLength %  9 > 2) || arrayLength % 9 == 0 || (arrayLength > 3)) && (vm.tenancyName.toLowerCase() == 'globalwings' || vm.tenancyName.toLowerCase() == 'default')) {
                    noOfPages = noOfPages + 1;
                    isExceed = true;
                }

                for (var i = 0; i < noOfPages; i++) {
                    var start = i * recordsPerPage;
                    var end = start + recordsPerPage;

                    if (vm.tenancyName.toLowerCase() == 'globalwings' || vm.tenancyName.toLowerCase() == 'default') {
                        if (i == 0) {
                            var start = i * recordsPerPage;
                            var end = start + 6;
                        } else {
                            if (isExceed) {
                                var start = i * recordsPerPage;
                                var end = start + recordsPerPage;
                            } else {
                                var start = i * recordsPerPage;
                                var end = start + recordsPerPage;
                            }
                        }
                    } else {
                        var start = i * recordsPerPage;
                        var end = start + recordsPerPage;
                    }

                    var subArray = [];
                    if (start != 0 && ((vm.tenancyName.toLowerCase() == 'globalwings') || (vm.tenancyName.toLowerCase() == 'default'))) {
                        start = start - 9;
                        end = start + recordsPerPage;

                    }
                    subArray = customArray.slice(start, end);
                    vm.pagesData.push({
                        pageNo: i + 1,
                        voucherLinesdataToIterate: subArray
                    })
                }

                if (!vm.pagesData || vm.pagesData.length == 0) {
                    vm.pagesData.push({
                        pageNo: 1,
                        voucherLinesdataToIterate: []
                    })
                }
            }

            function customizePagesDataForAllocations() {
                var customArray = [];
                //advanced
                if (appSession.tenant.tenancyName.toLowerCase() == 'advanced') {
                    recordsPerPage = 20;
                }

                if (appSession.tenant.tenancyName.toLowerCase() == 'galadaritrucks') {
                    recordsPerPage = 6;
                }
                if (appSession.tenant.tenancyName.toLowerCase() == 'globalwings') {
                    recordsPerPage = 18;
                }
                if (appSession.tenant.tenancyName.toLowerCase() == 'default') {
                    recordsPerPage = 18;
                }

                if (!vm.allocationData) {
                    return;
                }
                customArray = vm.allocationData.allocations.filter(v => v.allocatedNow > 0);
                customArray.forEach((e, index) => e.srNo = index + 1);
                var srNo = 1;
                angular.forEach(customArray, function (value) {
                    value.customSrNo = srNo;
                    srNo++;
                });
                var arrayLength = customArray.length;
                var noOfPages = arrayLength / recordsPerPage;
                vm.pagesData = [];

                var isExceed = false;
                if (arrayLength > 3 && ((arrayLength % 6 > 2) || arrayLength % 6 == 0 || (arrayLength > 3)) && (vm.tenancyName.toLowerCase() == 'globalwings' || vm.tenancyName.toLowerCase() == 'default')) {
                    noOfPages = noOfPages + 1;
                    isExceed = true;
                }

                for (var i = 0; i < noOfPages; i++) {
                    var start = i * recordsPerPage;
                    var end = start + recordsPerPage;

                    if (vm.tenancyName.toLowerCase() == 'globalwings' || vm.tenancyName.toLowerCase() == 'default') {
                        if (i == 0) {
                            var start = i * recordsPerPage;
                            var end = start + 12;
                        } else {
                            if (isExceed) {
                                var start = i * recordsPerPage;
                                var end = start + recordsPerPage;
                            } else {
                                var start = i * recordsPerPage;
                                var end = start + recordsPerPage;
                            }
                        }
                    } else {
                        var start = i * recordsPerPage;
                        var end = start + recordsPerPage;
                    }

                    var subArray = [];
                    if (start != 0 && ((vm.tenancyName.toLowerCase() == 'globalwings') || (vm.tenancyName.toLowerCase() == 'default'))) {
                        start = start - 6;
                        end = start + recordsPerPage;

                    }
                    subArray = customArray.slice(start, end);
                    vm.pagesData.push({
                        pageNo: i + 1,
                        allocationsdataToIterate: subArray
                    })
                }

                if (!vm.pagesData || vm.pagesData.length == 0) {
                    vm.pagesData.push({
                        pageNo: 1,
                        allocationsdataToIterate: []
                    })
                }
            }

            /*Data Allocation function*/

            function getAllocationData() {

                vm.loading = true;
                allocationService.getAllocationsForPrint({ voucherCategory: 2, VoucherId: vm.payment.id }).success(
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
                    allocationService.getAllocationsForEdit2({ contactId: vm.payment.contactId, voucherCategory: 2, VoucherId: vm.payment.id/*, agreementId: agreementId*/ }).success(
                        function (data) {

                            vm.allocationData = data;

                        }).finally(function () {
                            vm.loading = false;
                        });
                } else {
                    allocationService.getAllocationsForEdit({ contactId: vm.payment.contactId, voucherCategory: 2, VoucherId: vm.payment.id /*agreementId: agreementId*/ }).success(
                        function (data) {

                            vm.allocationData = data;

                        }).finally(function () {
                            vm.loading = false;
                        });

                }


            };

            /*End of Data Allocation function*/



            function init() {
                vm.loading = true;
                getExpenses();
                paymentService.getPayment({
                    id: paymentId
                }).success(function (result) {
                    vm.payment = result;
                    if (vm.isMultiCurrencyEnabled) {
                        if (vm.payment.contact) {
                            if (vm.payment.contact.currency) {
                                vm.currency = vm.payment.contact.currency.code;
                            }
                        }
                    }
                    if (vm.payment.voucherLines.some(x => x.contactId)) {
                        getAllocationData();
                    }
                    if (!angular.isUndefined(vm.payment.creatorUserId)) {
                        vm.getUserName(vm.payment.creatorUserId);
                    }
                    if (!angular.isUndefined(vm.payment.authorizedByUserId)) {
                        vm.getAuthorizedUserName(vm.payment.authorizedByUserId);
                    }

                    if (vm.payment.contact && vm.payment.contact.identityDocuments && vm.payment.contact.identityDocuments.length > 0) {
                        angular.forEach(vm.payment.contact.identityDocuments, function (value, key) {
                            if (value.identityDocumentType == 4) {
                                vm.customerDrivingLisence = vm.payment.contact.identityDocuments[key];
                            }
                            if (value.identityDocumentType == 1) {
                                vm.customerTradeLicense = vm.payment.contact.identityDocuments[key];
                            }
                        });
                    }
                    vm.notes = '';
                    vm.trn = vm.payment.location.taxId;
                    vm.currentDate = new Date(vm.payment.date);

                    if (vm.updateTRN) {
                        if (vm.payment.location.trnLogsList && vm.payment.location.trnLogsList.length > 0) {
                            for (let i = 0; i < vm.payment.location.trnLogsList.length; i++) {
                                const trnLog = vm.payment.location.trnLogsList[i];

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
                    //    if (vm.payment && vm.payment.contact && vm.payment.contact.trnLogsList && vm.payment.contact.trnLogsList.length > 0) {
                    //        for (let i = 0; i < vm.payment.contact.trnLogsList.length; i++) {
                    //            const trnLog = vm.payment.contact.trnLogsList[i];

                    //            if (trnLog && trnLog.fromDate && trnLog.toDate) {
                    //                const fromDate = new Date(trnLog.fromDate);
                    //                const toDate = new Date(trnLog.toDate);
                    //                fromDate.setHours(0, 0, 0, 0); // start of day
                    //                toDate.setHours(23, 59, 59, 999); // end of day

                    //                if (vm.currentDate >= fromDate && vm.currentDate <= toDate) {
                    //                    vm.payment.contact.taxId = trnLog.taxId;
                    //                    break;
                    //                }
                    //            }
                    //        }
                    //    }
                    //}
                    if (vm.payment.voucherSubTypeId == 21) {
                        for (i = 0; i < vm.payment.voucherLines.length; i++) {
                            if (vm.payment.voucherLines[i].debit > 0) {
                                vm.account = vm.payment.voucherLines[i].account;
                                break;
                            }
                        }
                    }
                    if (vm.payment.billingDetail) {
                        if (vm.payment.billingDetail.billingMethod) {
                            if (vm.payment.billingDetail.billingMethod.type == 2 || vm.payment.billingDetail.billingMethod.type == 7) // Credit Card
                            {
                                vm.notes = 'Transaction No: ' + vm.payment.billingDetail.creditCard.transactionNo + ', Last4Digits: ' + vm.payment.billingDetail.creditCard.cardNoLastDigits + ', Expiry: ' + vm.getlocalDateTime(vm.payment.billingDetail.creditCard.expiryDate, 'YYYY-MM');
                            }
                            else if (vm.payment.billingDetail.billingMethod.type == 4) // Cheque
                            {
                                vm.notes = 'Cheque No: ' + vm.payment.billingDetail.cheque.chequeNo + ', Cheque Date: ' + vm.getlocalDateTime(vm.payment.billingDetail.cheque.chequeDate, 'YYYY-MM-DD') + ', Bank: ';
                                if (vm.isAccountFeatureEnabled)
                                    vm.notes = vm.notes + vm.payment.billingDetail.cheque.bankAccount.accountNo + ' ' + vm.payment.billingDetail.cheque.bankAccount.bankName;
                                else
                                    vm.notes = vm.notes + vm.payment.billingDetail.cheque.bankName;

                            }
                            else if (vm.payment.billingDetail.billingMethod.type == 5) // BankTransfer
                            {
                                if (vm.isAccountFeatureEnabled)
                                    vm.notes = 'Bank: ' + vm.payment.billingDetail.bankAccount.accountNo + ' ' + vm.payment.billingDetail.bankAccount.bankName;
                            }
                        }

                    }
                    if (appSession.tenant.tenancyName.toLowerCase() == 'autolease') {
                        vm.showNotes = false;
                    }
                    if (vm.notes && vm.payment.notes && vm.showNotes) {
                        vm.notes = vm.notes + ', ';
                    }
                    if (vm.payment.notes && vm.showNotes)
                        vm.notes = vm.notes + vm.payment.notes;

                    if (vm.payment.voucherSubTypeId == 4)
                        getAllocations(customizePagesDataForAllocations);
                    if (vm.payment.voucherSubTypeId == 21) {
                        vm.payment.creditAmount = 0;
                        vm.payment.debitAmount = 0;
                        angular.forEach(vm.payment.voucherLines, function (value, key) {
                            if (value.vehicleId != null && value.vehicleId > 0)
                                value.vehicleShow = true;
                            if (value.contactId != null && value.contactId > 0)
                                value.contactShow = true;
                            if (value.credit)
                                vm.payment.creditAmount = vm.payment.creditAmount + value.credit;
                            if (value.debit)
                                vm.payment.debitAmount = vm.payment.debitAmount + value.debit;

                        });
                    }

                    vm.creditSum = 0;
                    vm.debitSum = 0;
                    vm.taxSum = 0;

                    angular.forEach(vm.payment.voucherLines, function (value, key) {
                        vm.creditSum += value.credit;
                        vm.debitSum += value.debit;
                        vm.taxSum += value.tax;
                    });
                    if (vm.payment.voucherSubTypeId != 4)
                        customizePagesDataForVoucherLines();

                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
