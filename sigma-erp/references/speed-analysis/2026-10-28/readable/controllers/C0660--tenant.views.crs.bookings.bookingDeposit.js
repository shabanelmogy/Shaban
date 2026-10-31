// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:171287-171454
appModule.controller('tenant.views.crs.bookings.bookingDeposit', [
        '$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.billingMethod', 'options', 'utilities', 'abp.services.app.commonLookup', 'appSession',
        function ($scope, $uibModal, $uibModalInstance, billingMethodService, options, utilities, commonLookupService, appSession) {

            var vm = this;
            vm.saving = false;
            vm.canChangeDate = abp.auth.hasPermission('Pages.Tenant.Vouchers.Receipts.CanChangeDate');
            vm.amountMinLimit = 0;
            vm.amountMaxLimit = options.totalAmount;

            vm.autoCalculateAmountInWords = abp.setting.get("App.General.AutoCalculateAmountInWords");
            vm.billingMethods = [];
            vm.isAccountsEnabled = abp.features.isEnabled("CRS.Accounts");

            vm.amountChanged = function () {
                if (vm.deposit.amount < vm.amountMinLimit || vm.deposit.amount > vm.amountMaxLimit || angular.isUndefined(vm.deposit.amount)) {
                    if (vm.autoCalculateAmountInWords == "true")
                        vm.deposit.amountInWords = '';
                }
                else {
                    if (vm.autoCalculateAmountInWords == "true")
                        vm.deposit.amountInWords = utilities.toWords(vm.deposit.amount);
                }
            };

            vm.cancel = function () {
                $uibModalInstance.close({
                    save: false
                });
            };


            vm.ok = function () {
                if (vm.deposit.amount > 0) {

                    if (!vm.deposit.billingDetail) {
                        vm.deposit.billingDetail = new Object();
                    }
                    vm.deposit.voucherSubTypeId = vm.deposit.voucherSubType.voucherSubTypeId;
                    if (vm.deposit.voucherSubTypeId == 12) {
                        vm.deposit.billingDetail.billingMethod = {
                            type: vm.deposit.voucherSubType.type
                        };
                        vm.deposit.billingDetail.billingMethodId = vm.deposit.voucherSubType.id;
                    }
                    if (vm.deposit.voucherSubTypeId == 11) { //Pre authorization 
                        vm.deposit.billingDetail.cheque = null;
                        vm.deposit.billingDetail.bankAccountId = null;
                        //vm.deposit.billingDetail.creditCard.expiryDate = moment(vm.deposit.billingDetail.creditCard.expiryDate).endOf('month').subtract(1, 'seconds');
                        if (vm.makeCreditCardInfoRequiredInReceipt) {
                            vm.deposit.billingDetail.creditCard.expiryDate = moment(vm.deposit.billingDetail.creditCard.expiryDate).endOf('month').subtract(1, 'seconds');
                        }
                    }
                    else if (vm.deposit.voucherSubTypeId == 13) {// cheque
                        vm.deposit.billingDetail.creditCard = null;
                        vm.deposit.billingDetail.bankAccountId = null;
                        vm.deposit.billingDetail.cheque.chequeDate = moment(vm.deposit.billingDetail.cheque.chequeDate).startOf('day');
                        vm.deposit.billingDetail.cheque.status = 1;
                    }
                    else if (vm.deposit.voucherSubTypeId == 12) {// Receipt Billing Methods
                        if (vm.deposit.voucherSubType.type == 2) {
                            vm.deposit.billingDetail.cheque = null;
                            vm.deposit.billingDetail.bankAccountId = null;
                            //vm.deposit.billingDetail.creditCard.expiryDate = moment(vm.deposit.billingDetail.creditCard.expiryDate).endOf('month').subtract(1, 'seconds');
                            if (vm.makeCreditCardInfoRequiredInReceipt) {
                                vm.deposit.billingDetail.creditCard.expiryDate = moment(vm.deposit.billingDetail.creditCard.expiryDate).endOf('month').subtract(1, 'seconds');
                            }
                        }
                        else if (vm.deposit.voucherSubType.type == 4) {
                            vm.deposit.billingDetail.creditCard = null;
                            vm.deposit.billingDetail.bankAccountId = null;
                            vm.deposit.billingDetail.cheque.chequeDate = moment(vm.deposit.billingDetail.cheque.chequeDate).startOf('day');
                            vm.deposit.billingDetail.cheque.status = 1;
                        }
                        else if (vm.deposit.voucherSubType.type == 5) {
                            vm.deposit.billingDetail.creditCard = null;
                            vm.deposit.billingDetail.cheque = null;
                            if (!vm.isAccountsEnabled)
                                vm.deposit.billingDetail.bankAccountId = null;
                        }
                        else {
                            vm.deposit.billingDetail.cheque = null;
                            vm.deposit.billingDetail.creditCard = null;
                            vm.deposit.billingDetail.bankAccountId = null;
                            vm.deposit.billingDetail.bankAccount = null;
                        }
                    }

                    else {
                        if (vm.deposit.billingDetail) {
                            vm.deposit.billingDetail.cheque = null;
                            vm.deposit.billingDetail.creditCard = null;
                        }
                    }
                    //if (vm.deposit.billingDetail)
                    //    vm.deposit.billingDetail.billingMethodId = null;
                }
                $uibModalInstance.close({
                    save: true
                });
            };



            function getBillingMethods() {
                vm.loading = true;
                billingMethodService.getBillingMethods({ category: 1 }).success(function (data) {

                    vm.billingMethods = data.items.filter(i => i.isActive && (i.locationId == null || i.locationId === appSession.user.locationId) && (i.userId == null || i.userId === appSession.user.id));

                    vm.depositBillingMethods = angular.copy(vm.billingMethods);

                    vm.depositBillingMethods.forEach(function (value) {
                        value.voucherSubTypeId = 12;
                    });
                    

                    if (options.deposit) {

                        if (vm.isEditModeDeposit && (vm.deposit.voucherSubTypeId == 11 || vm.deposit.voucherSubTypeId == 13)) {
                            var foundLines = $filter('filter')(vm.depositBillingMethods, {
                                voucherSubTypeId: vm.deposit.voucherSubTypeId,
                            }, true);
                            vm.deposit.voucherSubType = foundLines[0];
                        }
                        else if (vm.isEditModeDeposit) {
                            var foundLines = $filter('filter')(vm.depositBillingMethods, {
                                voucherSubTypeId: vm.deposit.voucherSubTypeId,
                                id: vm.deposit.billingDetail.billingMethodId
                            }, true);
                            vm.deposit.voucherSubType = foundLines[0];
                        }

                    }

                }).finally(function () {
                    vm.loading = false;
                });
            };

            function getBankAccounts() {
                vm.loading = true;
                commonLookupService.getBankAccountsForSelection().success(function (data) {
                    vm.bankAccounts = data.items;
                    vm.bankAccounts.forEach(e => e.chequePrintTemplate = null);
                }).finally(function () {
                    vm.loading = false;
                });
            }

            function init() {
                getBillingMethods();
                getBankAccounts();
                if (options.deposit) {
                    vm.deposit = options.deposit;
                    vm.isEditMode = vm.deposit.id > 0;
                    if (vm.deposit.amount > 0) {
                        vm.deposit.amount = Number(options.deposit.amount);
                        if (vm.autoCalculateAmountInWords == "true") {
                            vm.deposit.amountInWords = utilities.toWords(vm.deposit.amount);
                        }
                    }
                }
            }

            init();
        }
    ]);
