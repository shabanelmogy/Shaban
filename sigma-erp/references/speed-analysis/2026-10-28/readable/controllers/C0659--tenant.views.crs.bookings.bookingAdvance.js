// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:171178-171284
appModule.controller('tenant.views.crs.bookings.bookingAdvance', [
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
                if (vm.advance.amount < vm.amountMinLimit || vm.advance.amount > vm.amountMaxLimit || angular.isUndefined(vm.advance.amount)) {
                    if (vm.autoCalculateAmountInWords == "true")
                        vm.advance.amountInWords = '';
                }
                else {
                    if (vm.autoCalculateAmountInWords == "true")
                        vm.advance.amountInWords = utilities.toWords(vm.advance.amount);
                }
            };

            vm.cancel = function () {
                $uibModalInstance.close({
                    save: false
                });
            };

            vm.ok = function () {
                if (vm.advance.amount > 0) {
                    if (vm.advance.billingDetail.billingMethod.type == 2) {
                        vm.advance.billingDetail.cheque = null;
                        vm.advance.billingDetail.bankAccountId = null;
                        vm.advance.billingDetail.creditCard.expiryDate = moment(vm.advance.billingDetail.creditCard.expiryDate).endOf('month').subtract(1, 'seconds');

                        if (moment(vm.advance.billingDetail.creditCard.expiryDate, 'YYYY-MM') < moment()) {
                            abp.message.info("Card is expired.");
                            return;
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
                $uibModalInstance.close({
                    save: true
                });
            };

            function getBillingMethods() {
                vm.loading = true;
                billingMethodService.getBillingMethods({ category: 1 }).success(function (data) 
                {
                    vm.billingMethods = data.items.filter(i => i.isActive && (i.locationId == null || i.locationId === appSession.user.locationId) && (i.userId == null || i.userId === appSession.user.id));

                    
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
                if (options.advance) {
                    vm.advance = options.advance;
                    vm.isEditMode = vm.advance.id > 0;
                    if (vm.advance.amount > 0) {
                        vm.advance.amount = Number(options.advance.amount);
                        if (vm.autoCalculateAmountInWords == "true") {
                            vm.advance.amountInWords = utilities.toWords(vm.advance.amount);
                        }
                    }
                }
            }

            init();
        }
    ]);
