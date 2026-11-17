// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:339465-339663
appModule.controller('tenant.views.crs.vouchers.deposits.editDeposit', [
        '$uibModal', '$uibModalInstance', 'abp.services.app.billingMethod', 'options', 'utilities', 'appSession',
        'abp.services.app.commonLookup', '$filter', 'abp.services.app.deposit',
        function ($uibModal, $uibModalInstance, billingMethodService, options, utilities, appSession, commonLookupService, $filter, depositService) {

            var vm = this;
            vm.saving = false;
            vm.defaultCurrencyCode = abp.setting.get("App.General.CurrencyCode");
            vm.currencyCode = '';
            vm.isMultiCurrencyEnabled = abp.features.isEnabled('Core.MultiCurrency');
            vm.autoCalculateAmountInWords = abp.setting.get("App.General.AutoCalculateAmountInWords");
            vm.billingMethods = [];
            vm.isAccountsEnabled = abp.features.isEnabled("CRS.Accounts");
            vm.depositBillingMethods = [];
            vm.documents = [];
            vm.documentsForDeposit = abp.features.isEnabled("CRS.CustomFeatures.DocumentsForDeposit");

            //vm.deposit.voucherSubType = {

            //}
            vm.depositTypes = [
                { type: app.localize('PreAuthorizationDeposit'), id: 11 },
                //{ type: app.localize('CreditCardDeposit'), id: 20 },
                //{ type: app.localize('CashDeposit'), id: 12 },
                { type: app.localize('ChequeDeposit'), id: 13 }
            ];

            vm.amountChangedDeposit = function () {
                if (vm.deposit.amount == 0 || angular.isUndefined(vm.deposit.amount)) {
                    if (vm.autoCalculateAmountInWords == "true")
                        vm.deposit.amountInWords = '';
                    return;
                }
                if (vm.autoCalculateAmountInWords == "true")
                    vm.deposit.amountInWords = utilities.toWords(vm.deposit.amount);
                if (vm.isMultiCurrencyEnabled) {
                    if (vm.deposit.customer.currency) {
                        vm.currencyCode = vm.deposit.customer.currency.code;
                        currencyName = vm.deposit.customer.currency ? vm.deposit.customer.currency.name : null;
                        decimalName = vm.deposit.customer.currency ? vm.deposit.customer.currency.decimalName : null;
                        vm.deposit.amountInWords = utilities.toWords(vm.deposit.amount, currencyName, decimalName)
                    }

                }

            };
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
            vm.cancel = function () {
                $uibModalInstance.close({
                    save: false
                });
            };

            vm.paymentMethodChanged = function () {
                vm.deposit.billingDetail.billingMethodId = vm.deposit.billingDetail.billingMethod.id;
                //vm.deposit.billingDetail.cheque = {};
                //vm.deposit.billingDetail.chequeId = null;
                //vm.deposit.billingDetail.creditCard = {};
                //vm.deposit.billingDetail.creditCardId = null;
                //vm.deposit.billingDetail.bankAccount = {};
                //vm.deposit.billingDetail.bankAccountId = null;
            };

            vm.ok = function () {
                vm.saving = true;

                vm.deposit.fromDate = moment();
                if (vm.deposit.holdForDays) {
                    var fromDate = angular.copy(vm.deposit.fromDate);
                    vm.deposit.toDate = fromDate.add(vm.deposit.holdForDays, 'day');
                }
                vm.deposit.voucherDocuments = vm.documents;
                depositService.createOrUpdateDeposit({
                    deposit: vm.deposit,
                }).success(function (result) {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    vm.deposit.id = result;
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };

            function getBillingMethods() {
                vm.loading = true;
                billingMethodService.getBillingMethods({ category: 1 }).success(function (data) {

                    vm.billingMethods = data.items.filter(i => i.isActive && (i.locationId == null || i.locationId === appSession.user.locationId));

                    vm.depositBillingMethods = angular.copy(vm.billingMethods);

                    vm.depositBillingMethods.forEach(function (value) {
                        value.voucherSubTypeId = 12;
                    });
                    vm.depositTypes.forEach(function (value) {

                        vm.depositBillingMethods.push({
                            name: value.type,
                            billingMethodId: value.id,
                        });
                    });

                    if (vm.deposit) {

                        if (vm.isEditModeDeposit && (vm.deposit.voucherSubTypeId == 11 || vm.deposit.voucherSubTypeId == 13)) {
                            var foundLines = $filter('filter')(vm.depositBillingMethods, {
                                billingMethodId: vm.deposit.billingDetail.billingMethodId,
                            }, true);
                            vm.deposit.billingDetail.billingMethod = foundLines[0];
                        }
                        else if (vm.isEditModeDeposit) {
                            var foundLines = $filter('filter')(vm.depositBillingMethods, {
                                billingMethodId: vm.deposit.billingDetail.billingMethodId,
                                id: vm.deposit.billingDetail.billingMethodId
                            }, true);
                            vm.deposit.billingDetail.billingMethod = foundLines[0];
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

            function init() {

                vm.loading = true;
                getBillingMethods();
                getBankAccounts();

                vm.deposit = options.deposit;
                vm.deposit.voucherNo = options.deposit.voucherNo;
                depositService.getDepositForEdit({
                    id: vm.deposit.id
                }).success(function (result) {
                    vm.deposit = result;
                    vm.documents = vm.deposit.voucherDocuments;
                    // vm.isEditModeDeposit = vm.deposit.id > 0;
                    vm.deposit.voucherSubTypeId = result.voucherSubTypeId;
                    vm.deposit.contactId = options.deposit.agreement.customerId;
                    vm.deposit.date = options.deposit.date;
                    if (vm.isMultiCurrencyEnabled) {
                        if (vm.deposit.customer.currency) {
                            vm.currencyCode = vm.deposit.customer.currency.code;
                            vm.deposit.currencyId = vm.deposit.customer.currencyId;
                        }
                        else {
                            vm.currencyCode = vm.defaultCurrencyCode
                        }
                    }
                    var startDate = moment(vm.deposit.fromDate);
                    var endDate = moment(vm.deposit.toDate);
                    vm.deposit.holdForDays = moment(endDate.format("LLLL")).diff(moment(startDate.format("LLLL")), 'days');
                    getLocations();
                    if (appSession.user.locationId != null && appSession.user.locationId > 0)
                        vm.deposit.locationId = appSession.user.locationId;

                }).finally(function () {

                    vm.loading = false;
                });

            };

            init();
        }
    ]);
