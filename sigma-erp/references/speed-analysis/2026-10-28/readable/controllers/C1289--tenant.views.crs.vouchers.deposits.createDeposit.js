// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:338576-338919
appModule.controller('tenant.views.crs.vouchers.deposits.createDeposit', [
        '$uibModal', '$uibModalInstance', 'abp.services.app.billingMethod', 'options', 'utilities', 'appSession',
        'abp.services.app.commonLookup', '$filter', 'abp.services.app.deposit', 'abp.services.app.billingMethod',
        function ($uibModal, $uibModalInstance, billingMethodService, options, utilities, appSession, commonLookupService, $filter, depositService, billingMethodService) {

            var vm = this;
            vm.saving = false;
            vm.saveAndPrint = false;
            vm.defaultCurrencyCode = abp.setting.get("App.General.CurrencyCode");
            vm.currencyCode = '';
            vm.isMultiCurrencyEnabled = abp.features.isEnabled('Core.MultiCurrency');
            vm.autoCalculateAmountInWords = abp.setting.get("App.General.AutoCalculateAmountInWords");
            vm.billingMethods = [];
            vm.isAccountsEnabled = abp.features.isEnabled("CRS.Accounts");
            vm.depositBillingMethods = [];
            vm.documents = [];
            vm.isOnlinePaymentsEnabled = abp.features.isEnabled("OnlinePayments");
            vm.documentsForDeposit = abp.features.isEnabled("CRS.CustomFeatures.DocumentsForDeposit");

            //vm.deposit.voucherSubType = {

            //}
            vm.depositTypes = [
                { type: app.localize('PreAuthorizationDeposit'), id: 11 },
                //{ type: app.localize('CreditCardDeposit'), id: 20 },
                //{ type: app.localize('CashDeposit'), id: 12 },
                { type: app.localize('ChequeDeposit'), id: 13 }
            ];

            vm.uploadDocument = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/deposits/uploadDocumentsModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.deposits.uploadDocumentsModal as vm',
                    backdrop: 'static'

                });
                modalInstance.result.then(function (result) {
                    vm.documents.push(result);
                });
            };

            vm.removeDocument = function (obj) {
                var index = vm.documents.indexOf(obj);
                vm.documents.splice(index, 1);
            };
            vm.getOriginalName = function (doc) {
                var originalName = doc.name.replace("_" + doc.guid, "");
                return originalName;
            };

            vm.amountChanged = function () {
                if (vm.advance.amount == 0 || angular.isUndefined(vm.advance.amount)) {
                    if (vm.autoCalculateAmountInWords == "true")
                        vm.advance.amountInWords = '';
                    return;
                }
                if (vm.autoCalculateAmountInWords == "true")
                    vm.advance.amountInWords = utilities.toWords(vm.advance.amount);

            };

            vm.depositSubTypeChanged = () => {
                console.log(vm.deposit.voucherSubType);
                if (vm.deposit.voucherSubType.voucherSubTypeId == 12 && vm.deposit.voucherSubType.type == 2) {
                    billingMethodService.getDefaultCreditCard({ id: options.agreement.customer.id })
                        .success(function (result) {
                            vm.deposit.billingDetail.creditCard = result;
                        });
                }
            }

            vm.amountChangedDeposit = function () {
                if (vm.deposit.amount == 0 || angular.isUndefined(vm.deposit.amount)) {
                    if (vm.autoCalculateAmountInWords == "true")
                        vm.deposit.amountInWords = '';
                    return;
                }
                if (vm.autoCalculateAmountInWords == "true") {


                    vm.deposit.amountInWords = utilities.toWords(vm.deposit.amount);
                    if (vm.isMultiCurrencyEnabled) {
                        if (vm.agreement.customer.currency) {
                            vm.currencyCode = vm.agreement.customer.currency.code;
                            currencyName = vm.agreement.customer.currency ? vm.agreement.customer.currency.name : null;
                            decimalName = vm.agreement.customer.currency ? vm.agreement.customer.currency.decimalName : null;
                            vm.deposit.amountInWords = utilities.toWords(vm.deposit.amount, currencyName, decimalName)
                        }
                    }

                }

            };

            vm.cancel = function () {
                $uibModalInstance.close({
                    save: false
                });
            };

            vm.ok = function (isCharge = false) {
                vm.saving = true;
                debugger;
                //if (vm.advance.amount > 0) {
                //    if (vm.advance.billingDetail.billingMethod.type == 2) {
                //        vm.advance.billingDetail.cheque = null;
                //        vm.advance.billingDetail.bankAccountId = null;
                //        vm.advance.billingDetail.creditCard.expiryDate = moment(vm.advance.billingDetail.creditCard.expiryDate).endOf('month').subtract(1, 'seconds');
                //    }
                //    else if (vm.advance.billingDetail.billingMethod.type == 4) {
                //        vm.advance.billingDetail.creditCard = null;
                //        vm.advance.billingDetail.bankAccountId = null;
                //        vm.advance.billingDetail.cheque.chequeDate = moment(vm.advance.billingDetail.cheque.chequeDate).startOf('day');
                //        vm.advance.billingDetail.cheque.status = 1;
                //    }
                //    else if (vm.advance.billingDetail.billingMethod.type == 5) {
                //        vm.advance.billingDetail.creditCard = null;
                //        vm.advance.billingDetail.cheque = null;
                //        if (!vm.isAccountsEnabled)
                //            vm.advance.billingDetail.bankAccountId = null;
                //    }
                //    else {
                //        vm.advance.billingDetail.cheque = null;
                //        vm.advance.billingDetail.creditCard = null;
                //        vm.advance.billingDetail.bankAccountId = null;
                //    }
                //}
                if (vm.deposit.amount > 0) {

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
                        vm.deposit.billingDetail.creditCard.expiryDate = moment(vm.deposit.billingDetail.creditCard.expiryDate).endOf('month').subtract(1, 'seconds');
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
                            vm.deposit.billingDetail.creditCard.expiryDate = moment(vm.deposit.billingDetail.creditCard.expiryDate).endOf('month').subtract(1, 'seconds');
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

                }
                var fromDate;
                vm.deposit.voucherDocuments = vm.documents;
                vm.deposit.fromDate = vm.deposit.date;
                if (!vm.deposit.toDate) {
                    fromDate = angular.copy(vm.deposit.fromDate);
                    vm.deposit.toDate = fromDate.add(vm.deposit.holdForDays, 'day');
                }

                if (!isCharge) {
                    depositService.createDepositForAgreement({
                        agreement: {
                            id: options.agreement.id,
                            locationId: options.agreement.locationId,
                            agreementNo: options.agreement.agreementNo
                        },
                        deposit: vm.deposit,
                    }).success(function (result) {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        vm.deposit.id = result;
                        if (vm.saveAndPrint)
                            saveAndPrint(vm.deposit);
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                } else {
                    depositService.createDepositWithChargeForAgreement({
                        agreement: {
                            id: options.agreement.id,
                            locationId: options.agreement.locationId,
                            agreementNo: options.agreement.agreementNo
                        },
                        deposit: vm.deposit,
                        charge: {
                            amount: vm.deposit.amount,
                            stripeCustomerId: options.agreement.customer.externalId,
                            paymentMethodId: vm.deposit.billingDetail.creditCard.externalId
                        }
                    }).success(function (result) {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        vm.deposit.id = result.depositId;
                        if (vm.saveAndPrint)
                            saveAndPrint(vm.deposit);
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
            };

            function getBillingMethods() {
                vm.loading = true;
                billingMethodService.getBillingMethods({ category: 1 }).success(function (data) {

                    vm.billingMethods = data.items.filter(i => i.isActive && (i.locationId == null || i.locationId === appSession.user.locationId) && (i.userId == null || i.userId === appSession.user.id));
                    vm.depositBillingMethods = angular.copy(vm.billingMethods);

                    vm.depositBillingMethods.forEach(function (value) {
                        value.voucherSubTypeId = 12;
                    });
                    vm.depositTypes.forEach(function (value) {

                        vm.depositBillingMethods.push({
                            name: value.type,
                            voucherSubTypeId: value.id,
                        });
                    });

                    if (vm.deposit) {

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
                commonLookupService.getBankAccountsForSelection().success(function (data) {
                    vm.bankAccounts = data.items;
                    vm.bankAccounts.forEach(e => e.chequePrintTemplate = null);
                });
            };
            function getLocations() {
                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                });
            };

            var saveAndPrint = function (d) {
                debugger;
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/deposits/printTemplates/printPreview.cshtml',
                    controller: 'tenant.views.crs.vouchers.deposits.printTemplates.printPreview as vmMain',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        deposit: function () {
                            return d;
                        }
                    }
                });
            };
            function init() {

                vm.loading = true;
                var depositDefaultDays = Number(abp.setting.get("App.General.SecurityDepositDefaultExpiryDays"));

                console.log(options.agreement);

                vm.agreement = options.agreement;


                depositService.getDepositForEdit({
                    id: null
                }).success(function (result) {
                    vm.deposit = result;
                    vm.documents = vm.deposit.voucherDocuments;
                    vm.deposit.contactId = options.agreement.customerId;
                    if (vm.isMultiCurrencyEnabled) {
                        if (vm.agreement.customer.currency) {
                            vm.currencyCode = vm.agreement.customer.currency.code;
                            vm.deposit.currencyId = vm.agreement.customer.currencyId;
                            vm.deposit.currencyRate = vm.agreement.customer.currency.currencyToBaseRate;
                        }
                        else {
                            vm.currencyCode = vm.defaultCurrencyCode
                        }
                    }

                    vm.deposit.date = moment().utc();
                    if (depositDefaultDays && depositDefaultDays > 0)
                        vm.deposit.holdForDays = depositDefaultDays;
                    getLocations();
                    if (appSession.user.locationId != null && appSession.user.locationId > 0)
                        vm.deposit.locationId = appSession.user.locationId;

                }).finally(function () {
                    getBillingMethods();
                    getBankAccounts();

                    vm.loading = false;
                });

            };

            init();
        }
    ]);
