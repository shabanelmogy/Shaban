// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:219452-219679
appModule.controller('tenant.views.equipmentSales.salesQuotation.printModal', [
        '$scope', 'appSession', '$stateParams', 'abp.services.app.commonLookup', 'utilities', 'abp.services.app.salesQuotation',
        function ($scope, appSession, $stateParams, commonLookupService, utilities, salesQuotationService) {

            var vm = this;

            vm.tenantName = appSession.tenant.name;
            vm.fileName = appSession.tenant.tenancyName.toLowerCase() + '-' + 'header.png';
            vm.userName = appSession.user.name;
            vm.locationId = appSession.user.locationId;
            vm.userNameLogin = appSession.user.name + ' ' + appSession.user.surname;
            vm.isAccountFeatureEnabled = abp.features.isEnabled("CRS.Accounts");
            vm.currency = abp.setting.get("App.General.CurrencyCode");
            vm.receiptOnScreenAllocationWithTypesOfCharges = utilities.parseBoolean(abp.setting.get("App.General.ReceiptOnScreenAllocationWithTypesOfCharges"));
            vm.receiptOnScreenAllocationWithReceivables = utilities.parseBoolean(abp.setting.get("App.General.ReceiptOnScreenAllocationWithReceivables"));
            vm.isTaxEnabled = abp.features.isEnabled("CRS.Tax");
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.rentalQuotationCustomField1 = utilities.parseBoolean(abp.setting.get('App.Speed.Common.RentalQuotation_CustomField1'));
            vm.rentalQuotationCustomField2 = utilities.parseBoolean(abp.setting.get('App.Speed.Common.RentalQuotation_CustomField2'));
            vm.rentalQuotationCustomField3 = utilities.parseBoolean(abp.setting.get('App.Speed.Common.RentalQuotation_CustomField3'));
            vm.rentalQuotationCustomField4 = utilities.parseBoolean(abp.setting.get('App.Speed.Common.RentalQuotation_CustomField4'));
            vm.rentalQuotationDateCustomField1 = utilities.parseBoolean(abp.setting.get('App.Speed.Common.RentalQuotation_DateCustomField1'));
            vm.rentalQuotationDateCustomField2 = utilities.parseBoolean(abp.setting.get('App.Speed.Common.RentalQuotation_DateCustomField2'));
            vm.rentalQuotationDateCustomField3 = utilities.parseBoolean(abp.setting.get('App.Speed.Common.RentalQuotation_DateCustomField3'));
            vm.receiptAllocationData = null;
            vm.filteredAllocations = [];
            var agreementId = null;
            vm.grandSumAmount = 0;
            var quotationId = 0;
            vm.totalCharges = 0;
            vm.showGeneralPayment = false;
            vm.billingMethods = [];

            //if pop-up print
            if ($scope.$parent) {
                if ($scope.$parent.vmMain && $scope.$parent.vmMain.quotationId)
                    quotationId = $scope.$parent.vmMain.quotationId;
            }

            //if through url print
            if (quotationId == 0 && !isNaN($stateParams.query)) {
                quotationId = $stateParams.query;
            }


            vm.currencyAndRounding = function (value) {
                if (value == null) return null;

                return value.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            };

            vm.filteringAllocations = function (item) {
                if (item.allocatedNow > 0)
                    return true;
                else
                    return false;
            };

            vm.getAmountInWords = function (amount) {
                if (amount != null && amount > 0) {
                    return utilities.toWords(vm.rounding(amount));
                }
            };

            vm.localize = function (input) {
                return app.localize(input);
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

            vm.rounding = function (value) {

                return utilities.round(value, 2);
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


            vm.getType = function (type) {
                if (type == 1) {
                    return "Days"
                }
                else if (type == 2) {
                    return "Weeks"
                }
                else if (type == 3) {
                    return "Months";
                }
            };

            function init() {
                vm.loading = true;
                salesQuotationService.getQuotationForPrint({ id: quotationId }).success(function (data) {
                    vm.quotation = data;
                    vm.totalCharges = 0;
                    vm.totalChargesRent = 0;
                    vm.totalTax = 0;
                    vm.quotation.quotationLines.forEach(e => {
                        e.extrasLines.forEach(function (value) {
                            if (value.accepted) {
                                let charges = 0.0;
                                let rate = isNaN(parseFloat(value.rate)) ? 0 : parseFloat(value.rate);
                                let quantity = isNaN(parseFloat(e.quantity)) ? 0 : parseFloat(e.quantity);
                                let period = isNaN(parseFloat(e.years)) ? 0 : parseFloat(e.years);
                                if (value.rateTypeId === 6) {
                                    charges = quantity * rate;
                                } else if (value.rateTypeId === 1 || value.rateTypeId === 8 || value.rateTypeId === 7 || value.rateTypeId === 3 || value.rateTypeId === 2 || value.rateTypeId === 14) {
                                    charges = quantity * period * rate;
                                } else if (value.rateTypeId === 4) {
                                    charges = 0;
                                } else {
                                    charges = rate;
                                }
                                value.charges = charges;
                            }
                        });
                    });
                    vm.quotation.quotationLines.forEach(e => {
                        e.total = 0;
                        e.totalTax = 0;
                        vm.totalTax += e.tax;
                        vm.totalChargesRent += e.extrasLines[0].charges;
                        e.extrasLines.forEach(function (value) {

                            if (value.charges > 0 && value.accepted) {
                                vm.totalCharges += value.charges;
                                e.total += value.charges;
                            }
                        });
                        if (vm.isTaxInclusive) {   // prices are with tax. extract include tax amount which will not be added in 
                            //equation solved from following formula... 
                            //chargesWithoutTax + chargesWithoutTax * (taxPercent/100) = chargesWithTax
                            var chargesWithoutTax = (e.total * 100) / (100 + vm.taxPercent);
                            e.totalTax = utilities.round(e.total - chargesWithoutTax, 2);
                        }
                        vm.quotation.amountInWords = utilities.toWords(vm.rounding(vm.totalCharges + vm.totalTax));



                    });



                    vm.quotation.quotationLines.forEach(e => {
                        var rentRow = e.extrasLines.find(f => f.chargesTypeId == 1);
                        if (rentRow.discountPercent > 0) {
                            rentRow.discountedRate = rentRow.rate - rentRow.rate * rentRow.discountPercent / 100;
                        }
                        var amount = 0;
                        e.extrasLines.forEach(q => {
                            if (q.rateTypeId == 1 || q.rateTypeId == 1 || q.rateTypeId == 3) {
                                amount += (q.rate + q.tax) * e.years;
                            } else {
                                amount += q.rate + q.tax;
                            }
                        });
                        e.amount = amount;
                        //rentRow.totalAmount = rentRow.rate * e.years * e.quantity;
                        //vm.grandSumAmount = rentRow.totalAmount + vm.grandSumAmount;
                    });
                }).finally(function () {
                    vm.loading = false;
                });
            }
            init();

            vm.sumAmount = function (v) {
                var amount = 0;
                /*  debugger*/
                angular.forEach(v, function (value, key) {

                    amount = amount + value.rate;
                    if (value.taxable)
                        amount += value.tax;


                });
                return utilities.round(amount, 2);
            };

        }
    ]);
