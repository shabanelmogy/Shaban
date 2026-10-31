// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:340557-340758
appModule.controller('tenant.views.crs.vouchers.deposits.printModal', [
        '$scope', 'appSession', '$stateParams', 'abp.services.app.deposit', 'abp.services.app.commonLookup', 'utilities', 'abp.services.app.allocation', 'abp.services.app.billingMethod', '$filter',
        function ($scope, appSession, $stateParams, depositService, commonLookupService, utilities, allocationService, billingMethodService, $filter) {

            var vm = this;

            vm.tenantName = appSession.tenant.name;
            vm.fileName = appSession.tenant.tenancyName.toLowerCase() + '-' + 'header.png';
            vm.userName = '';
            vm.currency = abp.setting.get("App.General.CurrencyCode"); 
            vm.isTaxEnabled = abp.features.isEnabled("CRS.Tax");
            vm.updateTRN = abp.features.isEnabled("CRS.CustomFeatures.UpdateTRN");
            //vm.customerWiseTrnBasedOnPeriod = abp.features.isEnabled("CRS.CustomFeatures.CustomerWiseTrnBasedOnPeriod");
            vm.locationId = appSession.user.locationId;
            var agreementId = null;
            var depositId = 0;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.printHeader = true;
            //if pop-up print
            if ($scope.$parent != null) {
                if (!isNaN($scope.$parent.vmMain.deposit.id))
                    depositId = $scope.$parent.vmMain.deposit.id;
            }
            if ($scope.$parent !== null) {
                if (depositId) {
                   // vm.printHeader = !($scope.$parent.vmMain.deposit.printObj.printHeader);
                }
            }
            //if through url print
            if (depositId == 0 && !isNaN($stateParams.query)) {
                depositId = $stateParams.query;
            }

            vm.depositTypes = [
                       { type: app.localize('PreAuthorizationDeposit'), id: 11 },
                       { type: app.localize('ChequeDeposit'), id: 13 }
            ];
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

            vm.currencyAndRounding = function (value) {
                if (value == null) return null;

                return value.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            vm.currencyAndRoundingWithThree = function (value) {
                if (value == null) return null;

                return value.toLocaleString('en', { minimumFractionDigits: 3, maximumFractionDigits: 3 })
            };

            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };

            vm.getTypeById = function (voucherSubTypeId) {
                if (voucherSubTypeId == 11)
                    return app.localize("PreAuthorizationDeposit");
                if (voucherSubTypeId == 12)
                    return app.localize("AmountReceivedDeposit");
                if (voucherSubTypeId == 13)
                    return app.localize("GuaranteeChequeDeposit");
                if (voucherSubTypeId == 20)
                    return app.localize("CreditCardDeposit");
                else
                    return "";
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
     
            function getBillingMethods() {
                vm.loading = true;
                billingMethodService.getBillingMethods({ category: 1 }).success(function (data) {
                    vm.depositBillingMethods = data.items;
                    vm.depositBillingMethods.forEach(function (value) {
                        value.voucherSubTypeId = 12;
                    });
                    vm.depositTypes.forEach(function (value) {
                        vm.depositBillingMethods.push({
                            name: value.type,
                            voucherSubTypeId: value.id,
                        });
                    });
                    
                    if (vm.deposit.voucherSubTypeId == 11 || vm.deposit.voucherSubTypeId == 13) {
                        var foundLines = $filter('filter')(vm.depositBillingMethods, {
                            voucherSubTypeId: vm.deposit.voucherSubTypeId,
                        }, true);
                        vm.deposit.voucherSubType = foundLines[0];
                        vm.type = foundLines[0].name;
                    }
                    else {
                        var foundLines = $filter('filter')(vm.depositBillingMethods, {
                            voucherSubTypeId: vm.deposit.voucherSubTypeId,
                            id: vm.deposit.billingDetail.billingMethodId
                        }, true);
                        vm.deposit.voucherSubType = foundLines[0];
                        vm.type = foundLines[0].name;
                    }



                }).finally(function () {
                    vm.loading = false;
                });
            };
           

            function init() {
                vm.loading = true;
                depositService.getDeposit({
                    id: depositId
                }).success(function (result) { 
                    vm.deposit = result;
                    vm.trn = vm.deposit.location.taxId;
                    vm.currentDate = new Date(vm.deposit.date);

                    if (vm.updateTRN) {
                        if (vm.deposit.location.trnLogsList && vm.deposit.location.trnLogsList.length > 0) {
                            for (let i = 0; i < vm.deposit.location.trnLogsList.length; i++) {
                                const trnLog = vm.deposit.location.trnLogsList[i];

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
                    //    if (vm.deposit.contact.trnLogsList && vm.deposit.contact.trnLogsList.length > 0) {
                    //        for (let i = 0; i < vm.deposit.contact.trnLogsList.length; i++) {
                    //            const trnLog = vm.deposit.contact.trnLogsList[i];

                    //            const fromDate = new Date(trnLog.fromDate);
                    //            const toDate = new Date(trnLog.toDate);

                    //            if (vm.currentDate >= fromDate && vm.currentDate <= toDate) {
                    //                vm.trn = trnLog.taxId;
                    //                break;
                    //            }
                    //        }
                    //    }
                    //}
                    getBillingMethods();
                    //if (vm.deposit.voucherSubTypeId)
                    //    vm.type = vm.getTypeById(vm.deposit.voucherSubTypeId)
                    vm.getUserName(vm.deposit.creatorUserId); 
                }).finally(function () {
                    vm.loading = false;
                });
            };

            init();
            
        }
    ]);
