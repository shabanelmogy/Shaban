// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:338922-339202
appModule.controller('tenant.views.crs.vouchers.deposits.depositRefund', [
        '$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.country', 'abp.services.app.receipt', 'abp.services.app.agreement', 'deposit', 'abp.services.app.directory', 'abp.services.app.billingMethod', 'utilities', 'abp.services.app.commonLookup', 'appSession', 'abp.services.app.allocation', 'abp.services.app.deposit',
        function ($scope, $uibModal, $uibModalInstance, countryService, receiptService, agreementService, deposit, directoryService, billingMethodService, utilities, commonLookupService, appSession, allocationService, depositService) {

            var vm = this;
            var depositId = 0;
            vm.amountRefunded = deposit.amountRefunded ? deposit.amountRefunded : 0;
            vm.saving = false;
            vm.isEditMod = false;
            vm.closedAgreements = false;
            vm.customers = [];
            vm.agreements = [];
            vm.defaultCurrencyCode = abp.setting.get("App.General.CurrencyCode");
            vm.currencyCode = '';
            vm.billingMethods = [];
            vm.billingDetails = [];
            vm.isMultiCurrencyEnabled = abp.features.isEnabled('Core.MultiCurrency');
            vm.amountMinValue = 100;
            vm.allActionsOnOtherBranch = abp.auth.hasPermission('Pages.Tenant.Vouchers.Deposits.AllActionsOnOtherBranchDeposit');;
            vm.isAccountFeatureEnabled = abp.features.isEnabled("CRS.Accounts");
            vm.autoCalculateAmountInWords = abp.setting.get("App.General.AutoCalculateAmountInWords");
            vm.isAllowPartialRefund = abp.setting.getBoolean("App.General.AllowPartialRefund");
            vm.manualReceiptNo = utilities.parseBoolean(abp.setting.get("App.General.ManualReceiptNo"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm:ss';
            vm.locations = [];
            vm.saveAndPrint = false;
            vm.allocationData = null;
            vm.amountChanged = function () {
                if (vm.payment.amount == 0 || angular.isUndefined(vm.payment.amount)) {
                    if (vm.autoCalculateAmountInWords == "true")
                        vm.payment.amountInWords = '';
                    return;
                }
                if (vm.autoCalculateAmountInWords == "true")
                    vm.payment.amountInWords = utilities.toWords(vm.payment.amount);

            };


            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };


            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.searchCustomers = function ($select) {
                //any contact (staff, customer, supplier)
                return directoryService.search({ keyword: $select.search }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };



            function getBillingMethods() {
                vm.loading = true;
                billingMethodService.getBillingMethods({ category: 2 }).success(function (data) {
                    vm.billingMethods = data.items.filter(i => i.isActive && (i.locationId == null || i.locationId === appSession.user.locationId) && (i.userId == null || i.userId === appSession.user.id));
                    if (vm.isMultiCurrencyEnabled) {
                        vm.billingMethods = vm.billingMethods.filter(billingMethod => billingMethod.currencyId === null || billingMethod.currencyId === vm.payment.inputCurrencyId);

                    }
                }).finally(function () {
                    vm.loading = false;
                });
            };
            function getLocations() {
                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                });
            };




            vm.onCustomerSelect = function (customer) {

                vm.payment.contactId = customer.id;
                vm.payment.contact = customer;


            };
            vm.sumAmount = function () {
                if (vm.allocationData == null)
                    return 0;

                if (vm.allocationData.allocations.length == 0)
                    return 0;

                var amount = 0;
                angular.forEach(vm.allocationData.allocations, function (value, key) {
                    if (value.allocatedNow > 0)
                        amount = amount + value.allocatedNow;
                });

                return amount;
            };


            //all contacts customers, suppliers, staff
            vm.searchCustomerPopoup = function () {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchContactModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchContactModal as vm',
                    backdrop: 'static',
                    resolve: {
                        category: function () {
                            return null;
                        },
                        type: function () {
                            return null;
                        }
                    }
                }).result.then(function (result) {
                    if (result != null) {

                        vm.onCustomerSelect(result);
                    }
                });
            };
            function getSettledAmount() {
                vm.loading = true;

                //depositService.getReceiptAmountOnDeposit(depositId)
                depositService.getAllocatedAmountOnDeposit(depositId)
                    .success(function (result) {
                        vm.previousSettledAmount = result;
                        vm.totalAmount = vm.payment.amount;
                        vm.availableAmount = vm.payment.amount - vm.previousSettledAmount - vm.amountRefunded;
                        vm.payment.amount = vm.availableAmount;
                    }).finally(function () {
                        vm.loading = false;
                    });
            }
            function init() {

                vm.payment = angular.copy(deposit);
                vm.payment.notes = 'On Deposit No: ' + vm.payment.voucherNo;
                vm.payment.billingDetail.billingMethodId = null;
                vm.payment.billingDetail.chequeId = null;
                vm.payment.billingDetail.creditCardId = null;
                vm.payment.billingDetail.bankAccountId = null;
                if (vm.isMultiCurrencyEnabled) {
                    if (vm.payment.currency) {
                        vm.currencyCode = vm.payment.currency.code;
                        vm.payment.inputCurrencyId = vm.payment.currencyId;
                    }
                }


                vm.payment.billingDetail.billingMethod = null;
                vm.payment.billingDetail.cheque = null;
                vm.payment.billingDetail.creditCard = null;
                vm.payment.billingDetail.bankAccount = null;
                vm.payment.locationId = appSession.user.locationId;
                depositId = vm.payment.id;

                getSettledAmount();

                vm.payment.voucherType = 2;
                vm.payment.toDate = null;
                vm.payment.id = null;
                vm.payment.voucherNo = null;
                vm.payment.date = moment();
                vm.amountChanged();


            };
            function getBankAccounts() {
                commonLookupService.getBankAccountsForSelection().success(function (data) {
                    vm.bankAccounts = data.items;
                    vm.bankAccounts.forEach(e => e.chequePrintTemplate = null);
                    if (vm.isMultiCurrencyEnabled) {
                        vm.bankAccounts = vm.bankAccounts.filter(ba => ba.currencyId === null || ba.currencyId === vm.payment.inputCurrencyId);

                    }
                });
            }

            var saveAndPrint = function (payment) {
                //  var parent = $scope.$parent.filters.printingWithoutLogo;
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/payments/printtemplates/printPreview.cshtml',
                    controller: 'tenant.views.crs.vouchers.payments.printTemplates.printPreview as vmMain',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        payment: function () {
                            return payment;
                        }
                    }
                });
            };

            vm.save = function (printPayment) {

                var datePayment = new Date(vm.payment.date);
                datePayment.setHours(0);
                datePayment.setMinutes(0);
                datePayment.setSeconds(0);
                vm.payment.date = datePayment;
                if (vm.payment.locationId == null || vm.payment.locationId == 0) {
                    if (appSession.user.locationId != null)
                        vm.payment.locationId = appSession.user.locationId;
                    else if (vm.locations.length == 1)
                        vm.payment.locationId = vm.locations[0].id;
                }
                ////For saving allocation
                //if (vm.allocationData) {
                //    var allocations = [];
                //    angular.forEach(vm.allocationData.allocations, function (allocation, key) {
                //        allocations.push({
                //            id: allocation.allocationId,
                //            allocatingVoucherLineId: vm.allocationData.allocatingVoucherLineId,
                //            allocatedToVoucherLineId: allocation.voucherLineId,
                //            amount: allocation.allocatedNow
                //        });
                //    });
                //}
                //
                //var receiptAllocations = {
                //    allocations: allocations
                //};
                //  vm.payment.receiptAllocations = receiptAllocations;
                vm.saving = true;
                //if (vm.payment.billingDetail) {
                //    if (vm.payment.billingDetail.billingMethod.type == 7) {
                //        $scope.date = new Date();
                //        vm.payment.billingDetail.creditCard.expiryDate == new Date();
                //    }
                //}

                depositService.depositRefund({
                    depositId: depositId,
                    isSettled: (vm.availableAmount == vm.payment.amount ? true : false),
                    payment: vm.payment,
                }).success(function (result) {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    vm.payment.id = result;
                    if (printPayment) {
                        //var printHeaderCheck = $rootScope.headerPrintCheck;
                        saveAndPrint(vm.payment);
                    }
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });


            };

            function initializeFilters() {
                getBillingMethods();
                getLocations();
                getBankAccounts();
            }

            init();
            initializeFilters();
        }
    ]);
