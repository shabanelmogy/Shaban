// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:134174-134663
appModule.controller('tenant.views.crs.agreements.agreementAdvanceAndDeposit', [
        '$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.agreement', 'abp.services.app.billingMethod', 'options', 'utilities', 'appSession', 'abp.services.app.bankAccount', 'abp.services.app.commonLookup', '$filter', 'abp.services.app.currency',
        function ($scope, $uibModal, $uibModalInstance, agreementService, billingMethodService, options, utilities, appSession, bankAccountService, commonLookupService, $filter, currencyAppService) {

            var vm = this;
            vm.isBooking = options.isBooking;
            vm.deposit = options.deposit;
            vm.saving = false;
            vm.canChangeDate = abp.auth.hasPermission('Pages.Tenant.Vouchers.Receipts.CanChangeDate');
            vm.autoCalculateAmountInWords = abp.setting.get("App.General.AutoCalculateAmountInWords");
            vm.isAgreementStartDateAsAdvanceAndDepositDate = utilities.parseBoolean(abp.setting.get("App.General.AgreementStartDateAsAdvanceAndDepositDate"));
            vm.makeCreditCardInfoRequiredInReceipt = utilities.parseBoolean(abp.setting.get("App.Speed.Common.MakeCreditCardInfoRequiredInReceipt"));
            vm.depositPayble = utilities.parseBoolean(abp.setting.get("App.General.AgreedDepositPayableUponAgreementCreationInBooking"));
            vm.billingMethods = [];
            vm.baseCurrency = [];
            vm.defaultCurrencyCode = abp.setting.get("App.General.CurrencyCode");
            vm.currencyCode = '';
            vm.isMultiCurrencyEnabled = abp.features.isEnabled('Core.MultiCurrency');
            vm.isAccountsEnabled = abp.features.isEnabled("CRS.Accounts");
            vm.isCreditCardCommissionsEnabled = abp.features.isEnabled("CRS.Vouchers.CreditCardCommissions");
            vm.depositBillingMethods = [];
            vm.documents = [];
            vm.advancedocuments = [];
            vm.documentsForDeposit = abp.features.isEnabled("CRS.CustomFeatures.DocumentsForDeposit");
            vm.documentsForReceipt = abp.features.isEnabled("CRS.CustomFeatures.DocumentsForReceipt");

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
            vm.uploadAdvanceDocument = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/receipts/uploadDocumentsModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.receipts.uploadDocumentsModal as vm',
                    backdrop: 'static'

                });
                modalInstance.result.then(function (result) {
                    vm.advancedocuments.push(result);
                });
            };

            vm.removeDocument = function (obj) {
                var index = vm.documents.indexOf(obj);
                vm.documents.splice(index, 1);
            };
            vm.removeAdvanceDocument = function (obj) {
                var index = vm.advancedocuments.indexOf(obj);
                vm.advancedocuments.splice(index, 1);
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
                    if (vm.isMultiCurrencyEnabled && vm.agreement.customer) {
                        currencyName = vm.agreement.customer.currencyDto ? vm.agreement.customer.currencyDto.name : null;
                        decimalName = vm.agreement.customer.currencyDto ? vm.agreement.customer.currencyDto.decimalName : null;
                    }
                vm.advance.amountInWords = utilities.toWords(vm.advance.amount, currencyName, decimalName);
            };

            vm.amountChangedDeposit = function () {
                if (vm.deposit.amount == 0 || angular.isUndefined(vm.deposit.amount)) {
                    if (vm.autoCalculateAmountInWords == "true")
                        vm.deposit.amountInWords = '';
                    return;
                }
                if (vm.autoCalculateAmountInWords == "true")
                    vm.deposit.amountInWords = utilities.toWords(vm.deposit.amount);

            };

            vm.customerCurrencyChanged = function () {
                if (vm.agreement.customer) {
                    if (vm.agreement.customer.currencyDto) {
                        if (vm.advance.inputCurrencyId != vm.agreement.customer.currencyDto.id) {
                            vm.advance.customerCurrency = vm.agreement.customer.currencyDto.name;

                            vm.advance.currencyId = vm.agreement.customer.currencyDto.id;
                            vm.selectedCurrency = vm.allCurrencies.find(e => e.id == vm.advance.inputCurrencyId);
                            vm.selectedCurrencyToBase = vm.advance.inputAmount * vm.selectedCurrency.currencyToBaseRate;
                            vm.baseToContactCurrency = vm.selectedCurrencyToBase * (1 / vm.agreement.customer.currencyDto.currencyToBaseRate);
                            if (vm.advance.inputAmount > 0) {
                                vm.advance.amount = utilities.round(vm.baseToContactCurrency, 2);
                            }

                            vm.advance.currencyRate = vm.selectedCurrency.currencyToBaseRate;
                        }
                        else if (vm.advance.inputCurrencyId == vm.agreement.customer.currencyDto.id) {
                            vm.selectedCurrency = vm.allCurrencies.find(e => e.id == vm.advance.inputCurrencyId);

                        }


                        if (vm.isMultiCurrencyEnabled && vm.agreement.customer) {
                            currencyName = vm.agreement.customer.currencyDto ? vm.agreement.customer.currencyDto.name : null;
                            decimalName = vm.agreement.customer.currencyDto ? vm.agreement.customer.currencyDto.decimalName : null;
                        }
                        vm.advance.amountInWords = utilities.toWords(vm.advance.amount, currencyName, decimalName);
                    }
                }
            };

            vm.amountWithoutCommissionChanged = () => {

                vm.advance.amount = vm.advance.amountWithoutCommission;

                vm.calculateCreditCardCommission();
                vm.amountChanged();
            }

            vm.cancel = function () {
                $uibModalInstance.close({
                    save: false
                });
            };

            vm.calculateCreditCardCommission = () => {
                if (isNaN(vm.advance.amount)) {
                    vm.advance.amount = 0;
                }
                if (isNaN(vm.advance.amountWithoutCommission)) {
                    vm.advance.amountWithoutCommission = 0;
                }
                if (isNaN(vm.advance.creditCardCommissionPercentage)) {
                    vm.advance.creditCardCommissionPercentage = 0;
                }
                if (isNaN(vm.advance.creditCardCommission)) {
                    vm.advance.creditCardCommission = 0;
                }

                if (vm.advance.amountWithoutCommission >= 0 && vm.advance.creditCardCommissionPercentage >= 0) {
                    vm.advance.creditCardCommission = parseFloat(vm.advance.creditCardCommissionPercentage) * (vm.advance.amountWithoutCommission / 100);
                    vm.advance.amount = vm.advance.amountWithoutCommission + vm.advance.creditCardCommission;

                    vm.amountChanged();
                }
            }

            vm.conversionRateChanged = function () {
                vm.selectedCurrencyToBase = vm.advance.inputAmount * vm.advance.currencyRate;
                vm.baseToContactCurrency = vm.selectedCurrencyToBase * (1 / vm.agreement.customer.currencyDto.currencyToBaseRate);
                vm.advance.amount = utilities.round(vm.baseToContactCurrency, 2);
                if (vm.isMultiCurrencyEnabled && vm.agreement.customer) {
                    currencyName = vm.agreement.customer.currencyDto ? vm.agreement.customer.currencyDto.name : null;
                    decimalName = vm.agreement.customer.currencyDto ? vm.agreement.customer.currencyDto.decimalName : null;
                }
                vm.advance.amountInWords = utilities.toWords(vm.advance.amount, currencyName, decimalName);
            };

            vm.onCustomerSelect = function (customer) {
                agreementId = null;
                options.agreement.customerId = customer.id;
                if (options.agreement.customer) {
                    if (!options.agreement.customer.currencyDto) {
                        options.agreement.customer.currencyDto = vm.baseCurrency;

                    }
                    if (options.agreement.customer.currencyDto) {
                        vm.advance.currencyId = options.agreement.customer.currencyDto.id;

                        if (customer.currencyDto?.id && vm.isMultiCurrencyEnabled) {
                            vm.selectedCurrency = options.agreement.customer.currencyDto;
                            vm.advance.inputCurrencyId = customer.currencyDto.id;

                        }
                    }
                }
            };

            function getAllCurrencies() {
                currencyAppService.getCurrencies().then(function (response) {
                    vm.allCurrencies = response.data.items;
                    vm.baseCurrencyId = response.data.items.filter(p => p.isBase)[0].id;
                    vm.baseCurrency = response.data.items.filter(p => p.isBase);
                });
            };

            function getCurrencies() {
                commonLookupService.getCurrenciesAll().success(function (data) {
                    vm.currencies = data.items;
                });
            };

            vm.ok = function () {
                console.log(vm.deposit);
                if (vm.advance.amount > 0) {
                    vm.advance.voucherDocuments = vm.advancedocuments;

                    if (vm.advance.billingDetail.billingMethod.type == 2) {
                        vm.advance.billingDetail.cheque = null;
                        vm.advance.billingDetail.bankAccountId = null;
                        //vm.advance.billingDetail.creditCard.expiryDate = moment(vm.advance.billingDetail.creditCard.expiryDate).endOf('month').subtract(1, 'seconds');
                        if (vm.makeCreditCardInfoRequiredInReceipt) {
                            vm.advance.billingDetail.creditCard.expiryDate = moment(vm.advance.billingDetail.creditCard.expiryDate).endOf('month').subtract(1, 'seconds');
                        }
                    }
                    else if (vm.advance.billingDetail.billingMethod.type == 4) {
                        vm.advance.billingDetail.creditCard = null;
                        vm.advance.billingDetail.bankAccountId = null;
                        vm.advance.billingDetail.cheque.chequeDate = moment(vm.advance.billingDetail.cheque.chequeDate).startOf('day');
                        vm.advance.billingDetail.cheque.status = 1;
                    }
                    else if (vm.advance.billingDetail.billingMethod.type == 5) {
                        vm.advance.billingDetail.creditCard = null;
                        vm.advance.billingDetail.cheque = null;
                        if (!vm.isAccountsEnabled)
                            vm.advance.billingDetail.bankAccountId = null;
                    }
                    else {
                        vm.advance.billingDetail.cheque = null;
                        vm.advance.billingDetail.creditCard = null;
                        vm.advance.billingDetail.bankAccountId = null;
                    }
                }
                if (!vm.depositPayble ||!vm.isBooking) {
                    if (vm.deposit.amount > 0) {
                        vm.deposit.voucherDocuments = vm.documents;
                        if (!vm.deposit.billingDetail) {
                            vm.deposit.billingDetail = new Object();
                        }
                        if (vm.isMultiCurrencyEnabled) {
                            vm.deposit.currencyId = vm.agreement.customer.currencyDto.id;
                            vm.deposit.currencyRate = vm.agreement.customer.currencyDto.currencyToBaseRate;
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
                }

                $uibModalInstance.close({
                    save: true
                });
            };

            function getBillingMethods() {
                vm.loading = true;
                billingMethodService.getBillingMethods({ category: 1 }).success(function (data) {

                    vm.billingMethods = data.items.filter(i => i.isActive && (i.locationId == null || i.locationId === appSession.user.locationId) && (i.userId == null || i.userId === appSession.user.id));
                    if (vm.isMultiCurrencyEnabled) {
                        if (!options.agreement.isBooking) {

                            vm.billingMethods = vm.billingMethods.filter(billingMethod => billingMethod.currencyId === null || billingMethod.currencyId === vm.advance.inputCurrencyId);
                        }
                        else {
                            vm.billingMethods = vm.billingMethods.filter(billingMethod => billingMethod.currencyId === null || billingMethod.currencyId === vm.advance.inputCurrencyId);

                        }
                    }

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
                    if (!vm.depositPayble) {
                        if (options.deposit) {
                          vm.documents = vm.deposit.voucherDocuments;
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
                    }



                }).finally(function () {
                    vm.loading = false;
                });
            };

            function getBankAccounts() {
                commonLookupService.getBankAccountsForSelection().success(function (data) {
                    vm.bankAccounts = data.items;
                    vm.bankAccounts.forEach(e => e.chequePrintTemplate = null);
                    if (vm.isMultiCurrencyEnabled) {
                        if (!options.agreement.isBooking) {
                            vm.bankAccounts = vm.bankAccounts.filter(ba => ba.currencyId === null || ba.currencyId === options.agreement.customer.currencyDto.id);
                        }
                        else {
                            vm.bankAccounts = vm.bankAccounts.filter(ba => ba.currencyId === null || ba.currencyId === options.agreement.customer.currency.id);

                        }
                    }

                });
            }

            vm.dateNullOrNot = function () {
                if (vm.receipt.billingDetail.creditCard.expiryDate == false) {
                    vm.receipt.billingDetail.creditCard.expiryDate = "";
                }
            }

            function init() {
                vm.loading = true;
                if (vm.isMultiCurrencyEnabled) {
                    getCurrencies();
                    getAllCurrencies();
                }
                getBillingMethods();
                getBankAccounts();
                if (options.advance) {
                    vm.advance = options.advance;
                    vm.advancedocuments = vm.advance.voucherDocuments;
                    if (vm.advancedocuments == undefined) {
                        vm.advancedocuments = [];
                    } 
                    //vm.advance.date = options.agreement.startDate;
                    vm.isEditMode = vm.advance.id > 0;
                    if (vm.advance.amount > 0) {
                        vm.onCustomerSelect(options.agreement.customer);
                        vm.advance.amount = Number(options.advance.amount);
                        if (vm.autoCalculateAmountInWords == "true") {

                            vm.advance.amountInWords = utilities.toWords(vm.advance.amount);
                        }
                    }

                    if (vm.advance.date && new Date(vm.advance.date).getFullYear() === 1) {
                        vm.advance.date = null;
                    }

                    vm.advance.amountWithoutCommission = vm.advance.amount;
                }
                if (options.deposit) {
                    vm.deposit = options.deposit;
                    if (vm.deposit.date && new Date(vm.deposit.date).getFullYear() === 1) {
                        vm.deposit.date = null;
                    }
                }
                if (!vm.depositPayble) {
                    if (options.deposit) {
                        vm.deposit = options.deposit;
                        //vm.deposit.date = options.agreement.startDate;
                        var depositDefaultDays = Number(abp.setting.get("App.General.SecurityDepositDefaultExpiryDays"));
                        if (depositDefaultDays && depositDefaultDays > 0)
                            vm.deposit.holdForDays = depositDefaultDays;
                        vm.isEditModeDeposit = vm.deposit.id > 0;
                        if (vm.deposit.amount > 0) {
                            vm.deposit.amount = Number(options.deposit.amount);
                            //vm.deposit.voucherSubType = {
                            //    voucherSubTypeId: 11,
                            //    id: 11,
                            //    name: app.localize('PreAuthorizationDeposit'),
                            //    type: 2,
                            //};
                            if (vm.autoCalculateAmountInWords == "true") {
                                vm.deposit.amountInWords = utilities.toWords(vm.deposit.amount);
                            }
                            if (vm.deposit.date && new Date(vm.deposit.date).getFullYear() === 1) {
                                vm.deposit.date = null;
                            }
                        }
                    }
                }
                if (options.agreement) {
                    vm.agreement = options.agreement;
                    if (vm.advance.amount > 0) {
                        if (vm.isMultiCurrencyEnabled && vm.agreement.customer) {
                            currencyName = vm.agreement.customer.currencyDto ? vm.agreement.customer.currencyDto.name : null;
                            decimalName = vm.agreement.customer.currencyDto ? vm.agreement.customer.currencyDto.decimalName : null;
                            vm.advance.amountInWords = utilities.toWords(vm.advance.amount, currencyName, decimalName);

                        }

                        else {
                            vm.advance.amountInWords = utilities.toWords(vm.advance.amount);
                        }
                    }
                    if (!vm.depositPayble) {
                        if (vm.deposit.amount > 0 && vm.isMultiCurrencyEnabled) {
                            if (vm.agreement.customer.currencyDto) {
                                vm.currencyCode = vm.agreement.customer.currencyDto.code;
                                currencyName = vm.agreement.customer.currencyDto ? vm.agreement.customer.currencyDto.name : null;
                                decimalName = vm.agreement.customer.currencyDto ? vm.agreement.customer.currencyDto.decimalName : null;
                                vm.deposit.amountInWords = utilities.toWords(vm.deposit.amount, currencyName, decimalName);

                            }
                            else {
                                vm.currenyCode = vm.defaultCurrencyCode;
                            }
                        }

                    }
                }
            }

            init();
        }
    ]);
