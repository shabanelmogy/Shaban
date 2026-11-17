// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:381681-382003
appModule.controller('tenant.views.crs.vouchers.purchaseOrders.printModal',
        ['$stateParams', 'abp.services.app.purchaseOrder', '$scope', 'appSession', 'abp.services.app.commonLookup', 'utilities',
            function ($stateParams, purchaseOrdersService, $scope, appSession, commonLookupService, utilities) {

                var vm = this;
                vm.tenantName = appSession.tenant.name;
                vm.tenancyName = appSession.tenant.tenancyName;
                var purchaseOrderId = 0;
                vm.currency = abp.setting.get("App.General.CurrencyCode");
                vm.currencyName = abp.setting.get("App.General.CurrencyName");
                vm.dateFormat = abp.setting.get("App.General.DateFormat");
                vm.locationId = appSession.user.locationId;
                vm.isMultiCurrencyEnabled = abp.features.isEnabled('Core.MultiCurrency');
                vm.updateTRN = abp.features.isEnabled("CRS.CustomFeatures.UpdateTRN");
                //vm.customerWiseTrnBasedOnPeriod = abp.features.isEnabled("CRS.CustomFeatures.CustomerWiseTrnBasedOnPeriod");
                vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
                //vm.userName = appSession.user.name;
                vm.userName = '';
                vm.userEmail = '';
                vm.fileName = vm.tenancyName.toLowerCase() + '-' + 'header.png';
                vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
                vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
                vm.isEnablePoCustomFeild1 = utilities.parseBoolean(abp.setting.get("App.Speed.Common.PoCustomFeild1"));
                vm.isEnablePoCustomFeild2 = utilities.parseBoolean(abp.setting.get("App.Speed.Common.PoCustomFeild2"));
                vm.isEnablePoCustomFeild4 = utilities.parseBoolean(abp.setting.get("App.Speed.Common.PoCustomFeild4"));
                vm.isEnablePoCustomFeild5 = utilities.parseBoolean(abp.setting.get("App.Speed.Common.PoCustomFeild5"));
                vm.isEnablePoCustomFeild6 = utilities.parseBoolean(abp.setting.get("App.Speed.Common.PoCustomFeild6"));
                vm.isEnablePoCustomFeild7 = utilities.parseBoolean(abp.setting.get("App.Speed.Common.PoCustomFeild7"));
                vm.isEnablePoCustomDate = utilities.parseBoolean(abp.setting.get("App.Speed.Common.PoCustomDate"));
                vm.customFiedInPoVoucherLines = utilities.parseBoolean(abp.setting.get("App.Speed.Common.PoCustomFeildInVoucherLines"));
                vm.showPRNotesInPoPrint = vm.tenancyName.toLowerCase() == 'thousandrac';


                var recordsPerPage = 15;
                if (vm.tenancyName.toLowerCase() == 'rentsolutions') {
                    recordsPerPage = 2;
                }
                if (vm.tenancyName.toLowerCase() == 'thousandrac') {
                    recordsPerPage = 7;
                }
                if (vm.tenancyName.toLowerCase() == 'HeadwayRentACar') {
                    recordsPerPage = 15;
                }
                if (vm.tenancyName.toLowerCase() == 'galadaritrucks') {
                    recordsPerPage = 7;
                }
                if (vm.tenancyName.toLowerCase() == 'althiqa' || vm.tenancyName.toLowerCase() == 'default') {
                    recordsPerPage = 5;
                }
                if (vm.tenancyName.toLowerCase() == 'fixera' || vm.tenancyName.toLowerCase() == 'rentsolutions') {
                    recordsPerPage = 15;
                }

                //if pop-up print
                if ($scope.$parent != null) {
                    if (!isNaN($scope.$parent.vmMain.purchaseOrderId))
                        purchaseOrderId = $scope.$parent.vmMain.purchaseOrderId;
                }


                vm.currencyAndRounding = function (value) {
                    if (value == null) return null;

                    return value.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                };

                vm.roundingforView = function (value) {
                    var roundedValue = utilities.roundforView(value, 2);
                    return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                };
                //if through url print
                if (purchaseOrderId == 0 && !isNaN($stateParams.query)) {
                    purchaseOrderId = $stateParams.query;
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
                        vm.userEmail = result.emailAddress;
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
                //vm.sumAmountTax = function () {

                //    var totalAmount = 0.0;
                //    var totalTax = 0.0;
                //    vm.purchaseOrder.voucherLines.forEach(function (value) {
                //        if (value.debit > 0)
                //            totalAmount = totalAmount + parseFloat(value.debit);
                //        if (value.tax > 0) {
                //            value.taxable = true;
                //            totalTax += utilities.round(value.tax, 2);
                //        }
                //        else
                //            value.taxable = false;

                //    });
                //    vm.purchaseOrder.tax = totalTax;
                //    vm.purchaseOrder.amount = vm.isTaxInclusive ? utilities.round(totalAmount, 2) : (utilities.round(totalAmount, 2) + utilities.round(totalTax, 2)) / 1;
                //    vm.purchaseOrder.amount = utilities.round(vm.purchaseOrder.amount, 2);
                //    if (vm.purchaseOrder.amount > 0) {
                //        if (vm.autoCalculateAmountInWords == "true")
                //            vm.purchaseOrder.amountInWords = utilities.toWords(vm.purchaseOrder.amount);
                //    }
                //};
                //vm.sumAmount = function () {

                //    if (vm.purchaseOrder == null)
                //        return 0;

                //    if (vm.purchaseOrder.voucherLines == null)
                //        return 0;

                //    var sum = 0;
                //    var totalTax = 0.0;
                //    for (var i = 0; i < vm.purchaseOrder.voucherLines.length; i++) {
                //        if (vm.purchaseOrder.voucherLines[i].debit != null) {
                //            sum = sum + parseFloat(vm.purchaseOrder.voucherLines[i].debit);

                //            if (vm.purchaseOrder.taxPercent > 0) {
                //                var tax = 0;

                //                if (vm.isTaxInclusive) {   // prices are with tax. extract include tax amount which will not be added in 
                //                    //equation solved from following formula... 
                //                    //chargesWithoutTax + chargesWithoutTax * (taxPercent/100) = chargesWithTax
                //                    var chargesWithoutTax = (vm.purchaseOrder.voucherLines[i].debit * 100) / (100 + vm.purchaseOrder.taxPercent);
                //                    tax = utilities.round(vm.purchaseOrder.voucherLines[i].debit - chargesWithoutTax, 2);
                //                    totalTax += utilities.round(tax, 2);
                //                } else {
                //                    //prices are without tax. calculate tax and include in total
                //                    tax = utilities.round(vm.purchaseOrder.voucherLines[i].debit * vm.purchaseOrder.taxPercent / 100, 2);
                //                    totalTax += utilities.round(tax, 2);
                //                    // vm.tripCharges[i].charges += utilities.round(tax,2);

                //                }
                //                vm.purchaseOrder.voucherLines[i].tax = tax;
                //                if (tax > 0)
                //                    vm.purchaseOrder.voucherLines[i].taxable = true;
                //                //}
                //                //else {
                //                //    vm.purchaseOrder.voucherLines[i].tax = 0;
                //                //    vm.purchaseOrder.voucherLines[i].taxable = false;
                //                //}
                //            }
                //            else {
                //                vm.purchaseOrder.voucherLines[i].tax = 0;
                //                vm.purchaseOrder.voucherLines[i].taxable = false;
                //            }
                //        }

                //    }


                //    vm.purchaseOrder.amountInWords = '';

                //    vm.purchaseOrder.tax = totalTax;
                //    vm.purchaseOrder.amount = vm.isTaxInclusive ? utilities.round(sum, 2) : (utilities.round(sum, 2) + utilities.round(totalTax, 2)) / 1;
                //    vm.purchaseOrder.amount = utilities.round(vm.purchaseOrder.amount, 2);
                //    if (vm.purchaseOrder.amount > 0) {
                //        if (vm.autoCalculateAmountInWords == "true")
                //            vm.purchaseOrder.amountInWords = utilities.toWords(vm.purchaseOrder.amount);
                //    }

                //    return { totalCharges: utilities.round(sum, 2), totalTax: utilities.round(totalTax, 2), totalWithTax: (utilities.round(sum, 2) + utilities.round(totalTax, 2)) / 1 };
                //};



                function customizePagesData() {
                    var customArray = vm.purchaseOrder.voucherLines.filter(v => !v.hidden);
                    var arrayLength = customArray.length;
                    vm.pagesData = [];
                    var noOfPages = Math.ceil(arrayLength / recordsPerPage);

                    var isExceed = false;

                    if (arrayLength > 3 && ((arrayLength % 7 > 2) || arrayLength % 7 == 0) &&
                        (vm.tenancyName.toLowerCase() == 'althiqa' || vm.tenancyName.toLowerCase() == 'default')) {
                        noOfPages += 1;
                        isExceed = true;
                    }

                    if (arrayLength > 3 && ((arrayLength % 7 > 2) || arrayLength % 7 == 0) &&
                        (vm.tenancyName.toLowerCase() == 'fixera' || vm.tenancyName.toLowerCase() == 'rentsolutions')) {
                        noOfPages += 1;
                        isExceed = true;
                    }

                    for (var i = 0; i < noOfPages; i++) {
                        var start = i * recordsPerPage;
                        var end = start + recordsPerPage;

                        if (isExceed && i > 0) {
                            start = i * recordsPerPage;
                            end = start + recordsPerPage;
                        }

                        if (start >= arrayLength) break;
                        end = Math.min(end, arrayLength);

                        var subArray = customArray.slice(start, end);
                        vm.pagesData.push({
                            pageNo: i + 1,
                            voucherLinesdataToIterate: subArray
                        });
                    }
                }




                function init() {
                    {

                        vm.loading = true;
                        purchaseOrdersService.getPurchaseOrderForPrint({
                            id: purchaseOrderId
                        }).success(function (result) {
                            vm.purchaseOrder = result.purchaseOrder;
                            vm.isServicePo = result.isServicePo;
                            vm.purchaseOrder.voucherLines = vm.purchaseOrder.voucherLines.sort((a, b) => a.srNo - b.srNo);
                            if (vm.isMultiCurrencyEnabled) {
                                if (vm.purchaseOrder.contact.currency) {
                                    vm.currency = vm.purchaseOrder.contact.currency.code;
                                }
                            }
                            else {
                                vm.purchaseOrder.amountInWords = utilities.toWords(vm.purchaseOrder.amount)
                            }
                            vm.vehicle = vm.purchaseOrder.voucherLines.filter(e => e.vehicleId != null)[0];

                            vm.trn = vm.purchaseOrder.location.taxId;
                            vm.currentDate = new Date(vm.purchaseOrder.date);

                            if (vm.updateTRN) {
                                if (vm.purchaseOrder.location.trnLogsList && vm.purchaseOrder.location.trnLogsList.length > 0) {
                                    for (let i = 0; i < vm.purchaseOrder.location.trnLogsList.length; i++) {
                                        const trnLog = vm.purchaseOrder.location.trnLogsList[i];

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
                            //    if (vm.purchaseOrder.contact.trnLogsList && vm.purchaseOrder.contact.trnLogsList.length > 0) {
                            //        for (let i = 0; i < vm.purchaseOrder.contact.trnLogsList.length; i++) {
                            //            const trnLog = vm.purchaseOrder.contact.trnLogsList[i];

                            //            const fromDate = new Date(trnLog.fromDate);
                            //            const toDate = new Date(trnLog.toDate);

                            //            if (vm.currentDate >= fromDate && vm.currentDate <= toDate) {
                            //                vm.trn = trnLog.taxId;
                            //                break;
                            //            }
                            //        }
                            //    }
                            //}

                            vm.getUserName(vm.purchaseOrder.creatorUserId);
                            vm.getAuthorizedUserName(vm.purchaseOrder.authorizedByUserId);
                            if (vm.tenancyName.toLowerCase() == 'almasaood') {
                                vm.purchaseOrder.voucherLines = vm.purchaseOrder.voucherLines.filter(e => !e.hidden);
                            }
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
