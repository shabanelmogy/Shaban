// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:210322-210481
appModule.controller('tenant.views.crs.equipmentSales.dueInstallments.editPaymentMethodModal',
        ['utilities', '$scope', '$uibModalInstance', 'appSession', 'abp.services.app.salesAgreement', 'abp.services.app.commonLookup', 'abp.services.app.billingMethod', 'installment',
            function (utilities, $scope, $uibModalInstance, appSession, salesAgreementService, commonLookupService, billingMethodService, installment) {

                var vm = this;

                vm.loading = false;
                vm.installment = installment;
                vm.billingMethods = [];
                vm.bankAccounts = [];
                vm.isChequeMethod = false;
                vm.dateFormat = abp.setting.get("App.General.DateFormat");
                vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

                vm.getlocalDateTime = function (date) {
                    if (date != null) {
                        var localTime = moment.utc(date).toDate();
                        return moment(localTime).format(vm.dateFormat);
                    }
                    else {
                        return "";
                    }
                };
                // True if there is currently a cheque attached to the billing detail
                vm.hasCheque = installment.pdcVoucher.billingDetail
                    && installment.pdcVoucher.billingDetail.cheque
                    && installment.pdcVoucher.billingDetail.cheque.chequeNo;

                var existingCheque = installment.pdcVoucher && installment.pdcVoucher.cheque;

                vm.input = {
                    installmentId: installment.installmentId,
                    billingDetailId: installment.billingDetail ? installment.billingDetail.id : null,
                    billingMethodId: installment.billingDetail ? installment.billingDetail.billingMethodId : null,
                    notes: installment.billingDetail ? installment.billingDetail.notes : null,
                    cheque: {
                        chequeNo: existingCheque ? existingCheque.chequeNo : null,
                        bankName: existingCheque ? existingCheque.bankName : null,
                        chequeDate: existingCheque ? existingCheque.chequeDate : null,
                        bankAccountId: existingCheque ? existingCheque.bankAccountId : null
                    }
                };

                vm.getLocalDate = function (date) {
                    if (!date) return '';
                    return moment.utc(date).local().format(vm.dateFormat);
                };

                vm.onBillingMethodChange = function () {
                    var selected = vm.billingMethods.find(function (b) {
                        return b.id === vm.input.billingMethodId;
                    });
                    // Type 4 = Cheque
                    vm.isChequeMethod = selected && selected.type === 4;

                    // Reset cheque fields when switching away from cheque
                    if (!vm.isChequeMethod) {
                        vm.input.cheque = {
                            chequeNo: null,
                            bankName: null,
                            chequeDate: null,
                            bankAccountId: null
                        };
                    }
                };

                vm.detachCheque = function () {
                    abp.message.confirm(
                        app.localize('DetachChequeConfirmMessage'),
                        function (isConfirmed) {
                            if (isConfirmed) {
                                vm.loading = true;
                                salesAgreementService.detachInstallmentCheque({
                                    installmentId: vm.installment.installmentId,
                                    billingDetailId: vm.input.billingDetailId
                                })
                                    .success(function () {
                                        vm.hasCheque = false;
                                        vm.installment.billingDetail.cheque = null;
                                        abp.notify.success(app.localize('ChequeDetachedSuccessfully'));
                                    })
                                    .finally(function () {
                                        vm.loading = false;
                                    });
                            }
                        }
                    );
                };

                vm.save = function () {
                    if (!vm.input.billingMethodId) {
                        abp.notify.warn(app.localize('PleaseSelectPaymentMethod'));
                        return;
                    }

                    // Validate cheque fields when cheque method is selected
                    if (vm.isChequeMethod) {
                        if (!vm.input.cheque.chequeNo) {
                            abp.notify.warn(app.localize('ChequeNoIsRequired'));
                            return;
                        }
                        if (!vm.input.cheque.bankName) {
                            abp.notify.warn(app.localize('BankNameIsRequired'));
                            return;
                        }
                        if (!vm.input.cheque.chequeDate) {
                            abp.notify.warn(app.localize('ChequeDateIsRequired'));
                            return;
                        }
                    }

                    vm.loading = true;

                    salesAgreementService.updateInstallmentPaymentMethod({
                        installmentId: vm.input.installmentId,
                        billingDetailId: vm.input.billingDetailId,
                        billingMethodId: vm.input.billingMethodId,
                        notes: vm.input.notes,
                        cheque: vm.isChequeMethod ? {
                            chequeNo: vm.input.cheque.chequeNo,
                            bankName: vm.input.cheque.bankName,
                            chequeDate: vm.input.cheque.chequeDate,
                            bankAccountId: vm.input.cheque.bankAccountId || null
                        } : null
                    })
                        .success(function () {
                            abp.notify.success(app.localize('SavedSuccessfully'));
                            $uibModalInstance.close();
                        })
                        .finally(function () {
                            vm.loading = false;
                        });
                };

                vm.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };

                function loadBillingMethods() {
                    billingMethodService.getActiveBillingMethods().then(function (response) {
                        vm.billingMethods = response.data.items;
                        // Trigger type detection for currently selected method
                        vm.onBillingMethodChange();
                    });
                }

                function loadBankAccounts() {
                    commonLookupService.getBankAccountsForSelection().then(function (response) {
                        vm.bankAccounts = response.data.items;
                    });
                }

                function init() {
                    loadBillingMethods();
                    loadBankAccounts();
                }

                init();
            }
        ]);
