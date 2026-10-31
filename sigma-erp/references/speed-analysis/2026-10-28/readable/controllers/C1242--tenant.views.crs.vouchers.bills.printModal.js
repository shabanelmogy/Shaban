// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:327472-327749
appModule.controller('tenant.views.crs.vouchers.bills.printModal', ['$scope', '$stateParams', 'abp.services.app.purchaseOrder', '$sce', 'appSession', 'abp.services.app.bill', 'abp.services.app.commonLookup', 'utilities',
        function ($scope, $stateParams, purchaseOrdersService, sce, appSession, billService, commonLookupService, utilities) {
            var vm = this;
            vm.tenantName = appSession.tenant.name;
            vm.fileName = appSession.tenant.tenancyName.toLowerCase() + '-' + 'header.png';
            var billId = 0;
            // vm.userName = appSession.user.name;
            vm.userName = '';
            vm.authorizedUserName = '';
            vm.amount = 0;
            vm.locationId = appSession.user.locationId;
            vm.isLastPage = false;
            vm.loadingF = false;
            vm.isMultiCurrencyEnabled = abp.features.isEnabled('Core.MultiCurrency');
            vm.currency = abp.setting.get("App.General.CurrencyCode");
            vm.currencyName = abp.setting.get("App.General.CurrencyName");
            vm.isCostCenterEnabled = abp.features.isEnabled("Core.CostCenters");
            vm.isCostCenter2Enabled = utilities.parseBoolean(abp.setting.get("App.Speed.Common.IsCostCenterGroup2Enabled"));
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.isTaxEnabled = abp.features.isEnabled("CRS.Tax");
            vm.isAccountsEnabled = abp.features.isEnabled("CRS.Accounts");
            vm.isWorkshopEnabled = abp.features.isEnabled("WORKSHOP");
            vm.autoCalculateAmountInWords = abp.setting.get("App.General.AutoCalculateAmountInWords");
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.isAlmasoodER = appSession.tenant.tenancyName.toLowerCase() == 'almasaooder';
            vm.tollLenth = 0;
            vm.printHeader = true;
            vm.currentDateTime = new Date();
            vm.trn = '';
            vm.customerDrivingLisence = {};
            var recordsPerPage = 9;
            //if pop-up print
            if ($scope.$parent != null) {
                if (!isNaN($scope.$parent.vmMain.bill.id))
                    billId = $scope.$parent.vmMain.bill.id;
            }
            if ($scope.$parent !== null) {
                if (billId) {
                    vm.printHeader = !($scope.$parent.vmMain.bill.printObj.printHeader);
                }
            }
            //if through url print
            if (billId == 0 && !isNaN($stateParams.query)) {
                billId = $stateParams.query;
            }


            vm.oldTRN = '100051181400003';
            vm.newTRN = '104681493300003';
            vm.cutoffDate = new Date('2024-10-01');

            vm.getTRN = function (invoiceDateObj) {
                var invoiceDateObj = new Date(vm.bill.date);
                return invoiceDateObj < vm.cutoffDate ? vm.oldTRN : vm.newTRN;
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

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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

            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };


            vm.colspanForAccountTable = function () {
                var colSpanValue = 3;
                if (vm.isWorkshopEnabled) {
                    colSpanValue = colSpanValue + 1;
                }
                if (vm.isCostCenterEnabled) {
                    colSpanValue = colSpanValue + 1;
                }
                if (vm.isCostCenter2Enabled) {
                    colSpanValue = colSpanValue + 1;
                }
                return colSpanValue;
            };


            vm.fixedCurrencyFormat = function (amount) {
                if (amount == null) {
                    return null;
                }
                else {
                    var formatedAmount = amount.toLocaleString('en');
                    if (formatedAmount.indexOf('.') !== -1) {
                        var fixedAmount = amount.toFixed(2);
                        return parseFloat(fixedAmount).toLocaleString('en');
                    }
                    else {
                        return formatedAmount + '.00';
                    }
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

            function customizeStockGrnDataForVoucherLines() {
                var customArray = vm.grnLines.filter(v => !v.hidden);

                //customArray = vm.bill.voucherLines.filter(v => !v.hidden);

                //customArray.forEach((e, i) => e.srNo = i + 1);

                var arrayLength = customArray.length;

                if (appSession.tenant.tenancyName.toLowerCase() == 'advanced')
                    recordsPerPage = 10;

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

            function customizePagesDataForVoucherLines() {

                if (vm.bill.voucherSubTypeId == 61) {
                    customizeStockGrnDataForVoucherLines();
                    return;
                }

                var customArray = [];

                customArray = vm.bill.voucherLines.filter(v => !v.hidden);

                customArray.forEach((e, i) => e.srNo = i + 1);

                var arrayLength = customArray.length;

                if (appSession.tenant.tenancyName.toLowerCase() == 'advanced')
                    recordsPerPage = 3;

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
                    vm.totalDebit = 0;
                    vm.totalCredit = 0;
                    vm.totalGrnsDebit = 0;
                    vm.totalGrnsTax = 0;
                    vm.loading = true;
                    billService.getBillForPrint({
                        id: billId
                    }).success(function (result) {
                        vm.bill = result.bill;
                        if (vm.isMultiCurrencyEnabled) {
                            if (vm.bill.contact.currency) {
                                vm.currency = vm.bill.contact.currency.code;
                            }
                        }

                        if (vm.bill.contact && vm.bill.contact.identityDocuments && vm.bill.contact.identityDocuments.length > 0) {
                            angular.forEach(vm.bill.contact.identityDocuments, function (value, key) {
                                if (value.identityDocumentType == 4) {
                                    vm.customerDrivingLisence = vm.bill.contact.identityDocuments[key];
                                }
                                if (value.identityDocumentType == 1) {
                                    vm.customerTradeLicense = vm.bill.contact.identityDocuments[key];
                                }
                            });
                        }
                        if (vm.bill.parentVoucherId > 0 && vm.isAlmasoodER) {
                            vm.loadingF = true;
                            purchaseOrdersService.getPurchaseOrderForPrint({
                                id: vm.bill.parentVoucherId
                            }).success(function (result) {
                                vm.purchaseOrder = result.purchaseOrder;
                            }).finally(function () {

                                vm.loadingF = false;
                            });
                        }

                        vm.grnLines = result.grnLines;
                        vm.bill.voucherLines.forEach(function (value) {
                            vm.totalDebit = vm.totalDebit + value.debit;
                            vm.totalCredit = vm.totalCredit + value.credit;
                        });
                        vm.grnLines.filter(e => !e.hidden).forEach(function (value) {
                            vm.totalGrnsDebit = vm.totalGrnsDebit + value.debit;
                            vm.totalGrnsTax = vm.totalGrnsTax + value.tax;
                        });
                        vm.grnAmountInWords = utilities.toWords(vm.totalGrnsDebit + vm.totalGrnsTax);

                        vm.trn = vm.bill.location.taxId;
                        vm.getUserName(vm.bill.creatorUserId);
                        vm.getAuthorizedUserName(vm.bill.authorizedByUserId);
                        customizePagesDataForVoucherLines();
                    }).finally(function () {
                        vm.loading = false;
                    });
                }
            }

            init();

        }
    ]);
