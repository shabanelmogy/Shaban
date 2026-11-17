// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:467452-467635
appModule.controller('tenant.views.stock.purchaseReturns.printModal',
        ['abp.services.app.commonLookup', 'abp.services.app.purchaseReturn', 'abp.services.app.allocation', 'utilities', 'appSession', 'abp.services.app.grn', '$scope',

            function (commonLookupService, purchaseReturnService, allocationService,
                utilities, appSession, grnService, $scope) {
                var vm = this;
                vm.tenantName = appSession.tenant.name;
                vm.tenancyName = appSession.tenant.tenancyName;
                var purchaseReturnId = 0;
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
                vm.sumAmountAllocation = function () {
                    vm.isEnableDueAmount = true;
                    if (vm.allocationData == null)
                        return 0;

                    if (vm.allocationData.allocations.length == 0)
                        return 0;

                    var amount = 0;
                    angular.forEach(vm.allocationData.allocations, function (value, key) {
                        if (value.allocatedNow > 0)
                            amount = utilities.round(amount + value.allocatedNow, 2);
                        if (value.due < 0) {
                            vm.isEnableDueAmount = false;
                        }
                    });


                    //In Payment module total supplier allocations amount is compared with  amount, we dont have amount in debit note thats why below lines are commented.can be Modified according to requirement

                    //if (amount > 0 && vm.payment.amount != amount)
                    //    vm.supplierPaymentEnableSave = false;
                    //else
                    //    vm.supplierPaymentEnableSave = true;




                    return utilities.round(amount, 2);
                };
                function getAllocations() {
                    var branchId = vm.isMultiBranchStockEnabled ? vm.purchaseReturn.locationId : null;

                    allocationService.getAllocationsForEdit({
                        contactId: vm.purchaseReturn.contact.id,
                        voucherCategory: 1,
                        locationId: branchId,
                        //VoucherId: paymentId,
                        VoucherId: purchaseReturnId,
                    }).success(function (data) {
                        vm.allocationData = data;
                        vm.allocationData.allocations = vm.allocationData.allocations.filter(e => e.voucherSubTypeId != 41); //exclude service bills
                    });
                }



                var recordsPerPage = 10;
                //if pop-up print
                if ($scope.$parent != null) {
                    if (!isNaN($scope.$parent.vmMain.purchaseReturnId))
                        purchaseReturnId = $scope.$parent.vmMain.purchaseReturnId;
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
                if (purchaseReturnId == 0 && !isNaN($stateParams.query)) {
                    purchaseReturnId = $stateParams.query;
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
                vm.localize = function (input) {
                    return app.localize(input);
                };

                function customizePagesData() {
                    var customArray = [];
                    customArray = vm.purchaseReturn.voucherLines.filter(v => !v.hidden);
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
                        purchaseReturnService.getPurchaseReturnForEdit({
                            id: purchaseReturnId
                        }).success(function (result) {
                            vm.purchaseReturn = result;
                            if (vm.isMultiCurrencyEnabled) {
                                if (vm.purchaseReturn.contact.currency) {
                                    vm.currency = vm.purchaseReturn.contact.currency.code;
                                }
                            }
                            vm.vehicle = vm.purchaseReturn.voucherLines.filter(e => e.vehicleId != null)[0];
                            vm.getUserName(vm.purchaseReturn.creatorUserId);
                            if (result.contact != null) {
                                getAllocations();
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
