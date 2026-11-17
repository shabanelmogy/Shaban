// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:329034-329205
appModule.controller('tenant.views.crs.vouchers.cashWithdrawals.createOrEditModal', [
        'appSession', 'abp.services.app.billingMethod', 'utilities', 'abp.services.app.commonLookup', '$uibModalInstance',
        'abp.services.app.cashWithdrawal', 'cashWithdrawalId', 'abp.services.app.cashWithdrawalSearch',
        function (appSession, billingMethodService, utilities, commonLookupService, $uibModalInstance, cashWithdrawalService, cashWithdrawalId, cashWithdrawalSearchService) {

            var vm = this;
            vm.locations = [];

            vm.autoCalculateAmountInWords = abp.setting.get("App.General.AutoCalculateAmountInWords");
            vm.isPostDatedChequeDirectlyToBankEnabled = utilities.parseBoolean(abp.setting.get("App.General.EnablePostDatedChequeDirectlyToBank"));

            vm.isMultiCurrencyEnabled = abp.features.isEnabled('Core.MultiCurrency');
            vm.isAccountsEnabled = abp.features.isEnabled("CRS.Accounts");
            
            vm.fromPaymentMethods = [];
            vm.toPaymentMethods = [];
            vm.bankAccounts = [];

            var currencyName = null;
            var decimalName = null;

            vm.loading = false;
            vm.isCurrentDateBigger = false;

            vm.currentDate = moment().endOf('day');

            function getBankAccounts() {
                commonLookupService.getBankAccountsForSelection().success(function (data) {
                    vm.bankAccounts = data.items;
                });
            }
            function getLocations() {
                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                });
            };
            function getFromPaymentMethods() {
                vm.loading = true;
                billingMethodService.getBillingMethods({ type: 4 }).success(function (data) {
                    vm.fromPaymentMethods = data.items.filter(i => i.isActive && (i.locationId == null || i.locationId === appSession.user.locationId) && (i.userId == null || i.userId === appSession.user.id));
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function getToPaymentMethods() {
                vm.loading = true;
                billingMethodService.getBillingMethods({ type: 1 }).success(function (data) {
                    vm.toPaymentMethods = data.items.filter(i => i.isActive && (i.locationId == null || i.locationId === appSession.user.locationId) && (i.userId == null || i.userId === appSession.user.id));
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.amountChanged = function () {
                if (vm.cashWithdrawal.amount == 0 || angular.isUndefined(vm.cashWithdrawal.amount)) {
                    if (vm.autoCalculateAmountInWords == "true")
                        vm.cashWithdrawal.amountInWords = '';
                    return;
                }
                vm.cashWithdrawal.amount = utilities.round(vm.cashWithdrawal.amount, 2);
                if (vm.autoCalculateAmountInWords == "true") {
                    if (vm.isMultiCurrencyEnabled && vm.cashWithdrawal.contact) {
                        currencyName = vm.cashWithdrawal.contact.currencyDto ? vm.cashWithdrawal.contact.currencyDto.name : null;
                        decimalName = vm.cashWithdrawal.contact.currencyDto ? vm.cashWithdrawal.contact.currencyDto.decimalName : null;
                    }
                    vm.cashWithdrawal.amountInWords = utilities.toWords(vm.cashWithdrawal.amount, currencyName, decimalName);
                }
            };

            vm.checkCurrentDate = function () {
                if (vm.currentDate >= vm.cashWithdrawal.fromPaymentMethod.cheque.chequeDate) {
                    vm.isCurrentDateBigger = true;
                } else {
                    vm.isCurrentDateBigger = false;
                }
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.dateNullOrNot = function () {
                if (vm.cashWithdrawal.fromPaymentMethod.cheque.chequeDate == false) {
                    vm.cashWithdrawal.fromPaymentMethod.cheque.chequeDate = "";
                }
                if (vm.cashWithdrawal.date == false) {
                    vm.cashWithdrawal.date = "";
                }
            }

            vm.save = function () {

                vm.saving = true;

                if (vm.cashWithdrawal.locationId == null || vm.cashWithdrawal.locationId == 0) {
                    if (appSession.user.locationId != null)
                        vm.cashWithdrawal.locationId = appSession.user.locationId;
                    else if (vm.locations.length == 1)
                        vm.cashWithdrawal.locationId = vm.locations[0].id;
                }

                var date = new Date(vm.cashWithdrawal.date);
                date.setHours(0);
                date.setMinutes(0);
                date.setSeconds(0);
                vm.cashWithdrawal.date = date;

                vm.cashWithdrawal.fromPaymentMethod.creditCard = null;
                if (vm.isPostDatedChequeDirectlyToBankEnabled && vm.isCurrentDateBigger)
                    vm.cashWithdrawal.fromPaymentMethod.bankAccountId = vm.cashWithdrawal.fromPaymentMethod.bankAccount.id;
                else
                    vm.cashWithdrawal.fromPaymentMethod.bankAccountId = null;

                vm.cashWithdrawal.fromPaymentMethod.cheque.chequeDate = moment(vm.cashWithdrawal.fromPaymentMethod.cheque.chequeDate).startOf('day');
                vm.cashWithdrawal.fromPaymentMethod.cheque.status = 1;
                
                vm.cashWithdrawal.billingDetail = vm.cashWithdrawal.fromPaymentMethod;
                vm.cashWithdrawal.billingDetail.billingMethod = vm.cashWithdrawal.toPaymentMethod.billingMethod;
                vm.cashWithdrawal.billingDetail.billingMethodId = vm.cashWithdrawal.toPaymentMethod.billingMethod.id;

                vm.cashWithdrawal.billingDetail.bankAccount.chequePrintTemplate = null;
                
                cashWithdrawalService.createOrUpdateCashWithdrawal(vm.cashWithdrawal).success(function (result) {
                    
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    vm.cashWithdrawal.id = result;
                    $uibModalInstance.close();

                }).finally(function () {

                    vm.saving = false;

                });
            };

            function init() {
                vm.loading = true;
                getLocations();

                cashWithdrawalSearchService.getCashWithdrawalForEdit({
                    id: cashWithdrawalId
                }).success(function (result) {
                    vm.cashWithdrawal = result;
                    vm.cashWithdrawal.fromPaymentMethod = vm.cashWithdrawal.billingDetail;
                    vm.cashWithdrawal.fromPaymentMethod.cheque.chequeNo = vm.cashWithdrawal.billingDetail.cheque.chequeNo;
                    vm.cashWithdrawal.fromPaymentMethod.cheque.bankName = vm.cashWithdrawal.billingDetail.cheque.bankName;
                    vm.cashWithdrawal.fromPaymentMethod.cheque.chequeDate = vm.cashWithdrawal.billingDetail.cheque.chequeDate;
                    vm.cashWithdrawal.fromPaymentMethod.bankAccount = vm.cashWithdrawal.billingDetail.bankAccount;
                    vm.cashWithdrawal.fromPaymentMethod.bankAccount.id = vm.cashWithdrawal.billingDetail.bankAccountId;
                    vm.cashWithdrawal.toPaymentMethod = vm.cashWithdrawal.billingDetail;
                    vm.cashWithdrawal.toPaymentMethod.billingMethod = vm.cashWithdrawal.billingDetail.billingMethod;
                    vm.cashWithdrawal.toPaymentMethod.billingMethod.id = vm.cashWithdrawal.billingDetail.billingMethodId;
                    vm.isEditMod = true;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            function initializeFilters() {
                getFromPaymentMethods();
                getToPaymentMethods();

                if (vm.isAccountsEnabled) {
                    getBankAccounts();
                }
            }

            init();
            initializeFilters();
        }
    ]);
