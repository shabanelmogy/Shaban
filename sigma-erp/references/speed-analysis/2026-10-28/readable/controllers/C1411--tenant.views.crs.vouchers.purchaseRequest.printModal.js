// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:384626-384769
appModule.controller('tenant.views.crs.vouchers.purchaseRequest.printModal',
        ['$stateParams', 'abp.services.app.purchaseRequest', '$scope', 'appSession', 'abp.services.app.commonLookup', 'utilities',
            function ($stateParams, purchaseRequestService, $scope, appSession, commonLookupService, utilities) {

                var vm = this;
                vm.tenantName = appSession.tenant.name;
                vm.tenancyName = appSession.tenant.tenancyName;
                var purchaseRequestId = 0;
                vm.currency = abp.setting.get("App.General.CurrencyCode");
                vm.locationId = appSession.user.locationId;
                vm.currencyName = abp.setting.get("App.General.CurrencyName");
                vm.isMultiCurrencyEnabled = abp.features.isEnabled('Core.MultiCurrency');
                vm.dateFormat = abp.setting.get("App.General.DateFormat");
                vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
                //vm.userName = appSession.user.name;
                vm.userName = '';
                vm.fileName = vm.tenancyName.toLowerCase() + '-' + 'header.png';
                vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
                vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
                var recordsPerPage = 5;
                if (vm.tenancyName.toLowerCase() == 'rentsolutions')
                    recordsPerPage = 10;
                if (vm.tenancyName.toLowerCase() == 'fixera')
                    recordsPerPage = 10;

                if (vm.tenancyName.toLowerCase() == 'thousandrac')
                    recordsPerPage = 15;
                //if pop-up print
                if ($scope.$parent != null) {
                    if (!isNaN($scope.$parent.vmMain.purchaseRequestId))
                        purchaseRequestId = $scope.$parent.vmMain.purchaseRequestId;
                }


                vm.currencyAndRounding = function (value) {
                    if (value == null) return null;

                    return value.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                };


                //if through url print
                if (purchaseRequestId == 0 && !isNaN($stateParams.query)) {
                    purchaseRequestId = $stateParams.query;
                }

                $scope.$on('$viewContentLoaded', function () {
                    App.initAjax();
                });
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



                function customizePagesDataForVoucherLines() {
                    var customArray = [];
                    customArray = vm.purchaseRequest.voucherLines.filter(v => !v.hidden);
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
                function init() {
                    {
                        vm.loading = true;
                        purchaseRequestService.getPurchaseRequestForPrint({
                            id: purchaseRequestId
                        }).success(function (result) {
                            vm.purchaseRequest = result.purchaseRequest;
                            vm.purchaseRequest.amountInWords = utilities.toWords(vm.purchaseRequest.amount);
                            if (vm.isMultiCurrencyEnabled) {
                                if (vm.purchaseRequest.contact.currency) {
                                    currencyName = vm.purchaseRequest.contact.currency ? vm.purchaseRequest.contact.currency.name : null;
                                    decimalName = vm.purchaseRequest.contact.currency ? vm.purchaseRequest.contact.currency.decimalName : null;
                                    vm.purchaseRequest.amountInWords = utilities.toWords(vm.purchaseRequest.amount, currencyName, decimalName);
                                    vm.currency = vm.purchaseRequest.contact.currency.code;
                                }
                                else {
                                    vm.purchaseRequest.amountInWords = utilities.toWords(vm.purchaseRequest.amount);
                                }
                            }
                            vm.isServicePo = result.isServicePurchaseRequest;
                            vm.vehicle = vm.purchaseRequest.voucherLines.filter(e => e.vehicleId != null)[0];
                            vm.getUserName(vm.purchaseRequest.creatorUserId);
                            customizePagesDataForVoucherLines();
                        }).finally(function () {
                            vm.loading = false;
                        });
                    }
                }

                init();


            }
        ]);
