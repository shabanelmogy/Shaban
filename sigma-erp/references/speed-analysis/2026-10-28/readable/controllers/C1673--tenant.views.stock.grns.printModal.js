// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:464043-464231
appModule.controller('tenant.views.stock.grns.printModal',
        ['abp.services.app.commonLookup', 'utilities', 'appSession', 'abp.services.app.grn', '$scope', 'abp.services.app.purchaseOrder',
           
            function (commonLookupService,
                utilities, appSession, grnService, $scope, purchaseOrdersService) {
                var vm = this;
                vm.tenantName = appSession.tenant.name;
                vm.tenancyName = appSession.tenant.tenancyName;
                var grnId = 0;
                vm.currency = abp.setting.get("App.General.CurrencyCode");
                vm.currencyName = abp.setting.get("App.General.CurrencyName");
                vm.isMultiCurrencyEnabled = abp.features.isEnabled('Core.MultiCurrency');
                vm.dateFormat = abp.setting.get("App.General.DateFormat");
                vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
                //vm.userName = appSession.user.name;
                vm.userName = '';
                vm.fileName = vm.tenancyName.toLowerCase() + '-' + 'header.png';
                vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
                vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
                var recordsPerPage = 10;
                if (vm.tenancyName == 'fixera')
                {
                     recordsPerPage = 3;
                }
                //if pop-up print
                if ($scope.$parent != null) {
                    if (!isNaN($scope.$parent.vmMain.grnId))
                        grnId = $scope.$parent.vmMain.grnId;
                }


                vm.currencyAndRounding = function (value) {
                    if (value == null) return null;

                    return value.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                };
                vm.currencyAndRoundingWithThree = function (value) {
                    if (value == null) return null;

                    return value.toLocaleString('en', { minimumFractionDigits: 3, maximumFractionDigits: 3 })
                };

                //if through url print
                if (grnId == 0 && !isNaN($stateParams.query)) {
                    grnId = $stateParams.query;
                }

                $scope.$on('$viewContentLoaded', function () {
                    App.initAjax();
                });
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
           

                function customizePagesData() {
                    var customArray = [];
                    customArray = vm.grn.voucherLines.filter(v => !v.hidden);
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



                vm.calculateQtyAlreadyReceived = function (VoucherLine, value = 0) {
                    vm.loading = true;
                    vm.qtyAlreadyReceived = [];
                    grnService.getGrnByParentVoucherId({ id: vm.grn.parentVoucherId }).success(function (result) {
                        vm.qtyAlreadyReceived = result;
                        vm.qtyAlreadyReceived.forEach(function (voucher) {
                            voucher.voucherLines.forEach(function (voucherline) {
                                if (voucherline.productId === VoucherLine.productId) {
                                    if (!VoucherLine.quantityAlreadyReceived)
                                        VoucherLine.quantityAlreadyReceived = 0;
                                    VoucherLine.quantityAlreadyReceived += voucherline.quantity;
                                };
                            });
                        });

                    }).finally(function () {
                        vm.loading = false;
                    });
                };

                vm.calculateQtyOrdered = function (VoucherLine, value = 0) {
                    vm.loading = true;
                    vm.qtyOrdered = [];
                    purchaseOrdersService.getPOById(vm.grn.parentVoucherId).success(function (result) {
                        vm.parentVoucher = result;
                    }).finally(function () {
                        VoucherLine.quantityOrdered = 0;
                        vm.parentVoucher.voucherLines.forEach(function (voucherline) {
                            if (voucherline.productId === VoucherLine.productId) {
                                VoucherLine.quantityOrdered += voucherline.quantity;
                            };
                        });
                        if (value === 0)
                            vm.loading = false;
                    });

                }
                function init() {
                    {

                        vm.loading = true;
                        grnService.getGrnForPrint({
                            id: grnId
                        }).success(function (result) {
                            vm.grn = result;
                            if (vm.isMultiCurrencyEnabled) {
                                if (vm.grn.contact.currency) {
                                    currencyName = vm.grn.contact.currency ? vm.grn.contact.currency.name : null;
                                    decimalName = vm.grn.contact.currency ? vm.grn.contact.currency.decimalName : null;
                                    vm.grn.amountInWords = utilities.toWords(vm.grn.amount, currencyName, decimalName);
                                    vm.currency = vm.grn.contact.currency.code;
                                }
                                else {
                                    vm.grn.amountInWords = utilities.toWords(vm.grn.amount);
                                }
                            }
                            angular.forEach(vm.grn.voucherLines, function (line) {
                                if (line.product) {
                                    line.product.unitOfMeasure = line.unitOfMeasure;
                                    line.product.unitOfMeasureId = line.unitOfMeasureId;
                                }
                                line.quantityAlreadyReceived = 0;
                                line.quantityOrdered = 0;
                                vm.calculateQtyAlreadyReceived(line, 1);
                                vm.calculateQtyOrdered(line, 1);
                            });
                            vm.vehicle = vm.grn.voucherLines.filter(e => e.vehicleId != null)[0];
                            vm.getUserName(vm.grn.creatorUserId);
                            
                            customizePagesData();
                        }).finally(function () {
                            //vm.sumAmountTax();
                            //vm.sumAmount();
                            vm.loading = false;
                        });
                    }
                }

                init();


            }
        ]);
