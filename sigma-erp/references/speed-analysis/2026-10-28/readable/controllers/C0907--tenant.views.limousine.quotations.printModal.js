// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:246748-246911
appModule.controller('tenant.views.limousine.quotations.printModal', [
        '$scope', 'appSession', '$stateParams', 'abp.services.app.commonLookup', 'utilities', 'abp.services.app.limoQuotation',
        function ($scope, appSession, $stateParams, commonLookupService, utilities, limoQuotationService) {

            var vm = this;

            vm.tenantName = appSession.tenant.name;
            vm.fileName = appSession.tenant.tenancyName.toLowerCase() + '-' + 'header.png';
            vm.userName = '';

            vm.isTaxEnabled = abp.features.isEnabled("CRS.Tax");
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.receiptAllocationData = null;
            vm.filteredAllocations = [];
            var agreementId = null;
            vm.grandSumAmount = 0;
            var quotationId = 0;
            vm.showGeneralPayment = false;
            vm.billingMethods = [];

            vm.filter = {
                filter: '',
            };

            //vm.trustAsHtml = function (value) {
            //    var doc = value.replace(/\n/g, "<br />");
            //    return doc;
            //};

            //if pop-up print
            if ($scope.$parent) {
                if ($scope.$parent.vmMain && $scope.$parent.vmMain.quotationId)
                    quotationId = $scope.$parent.vmMain.quotationId;
            }

            //if through url print
            if (quotationId == 0 && !isNaN($stateParams.query)) {
                quotationId = $stateParams.query;
            }


            vm.getAmountInWords = function (amount) {
                if (amount != null && amount > 0) {
                    // Convert amount to words
                    let amountInWords = utilities.toWords(amount);

                    // Capitalize the first letter of each word
                    amountInWords = amountInWords.replace(/\b\w/g, function (char) {
                        return char.toUpperCase();
                    });
                    return amountInWords;
                }
                return '';
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
            vm.currencyAndRounding = function (value) {
                if (value == null) return null;

                return value.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
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

            vm.getUserName = function (userId) {
                commonLookupService.getUser({
                    id: userId
                }).success(function (result) {
                    vm.userName = result.name + ' ' + result.surname;
                });
            };
            vm.getPaymentTerms = function (id) {
                if (id == 1) {
                    return "Advance";
                }
                else if (id == 2) {
                    return "Credit";
                }
                else {
                    return " ";
                }
            }

            //for sixtPakistan
            vm.getTaxChargesCategory = function (id) {
                if (id == 1) {
                    return "Inclusive";
                }
                else if (id == 2) {
                    return "Exclusive";
                }
                else {
                    return " ";
                }
            }

            function init() {
                vm.loading = true;
                limoQuotationService.getQuotationForPrint({ id: quotationId }).success(function (data) {
                    vm.quotation = data;
                    if (vm.quotation.amount > 0) {
                        vm.quotation.amountInWords = utilities.toWords(vm.quotation.amount);
                    };
                    if (appSession.tenant.tenancyName.toLowerCase() == 'sixtpakistan' || appSession.tenant.tenancyName.toLowerCase() == 'default') {
                        if (vm.quotation && vm.quotation.limoQuotationCharge) {
                            let quotationCharge = vm.quotation.limoQuotationCharge.find(e => e.chargesTypeId == 24);

                            if (quotationCharge) {
                                quotationCharge.amount = 0.0;
                                angular.forEach(quotationCharge.calcDetail, function (item) {
                                    quotationCharge.amount += item.charges;
                                });

                                if (quotationCharge.amount > 0) {
                                    vm.quotation.limoQuotationCharge = vm.quotation.limoQuotationCharge.filter(e => e.chargesTypeId != 24);
                                }
                            }
                        }
                    }

                }).finally(function () {
                    vm.loading = false;
                });
            }
            init();


        }
    ]);
