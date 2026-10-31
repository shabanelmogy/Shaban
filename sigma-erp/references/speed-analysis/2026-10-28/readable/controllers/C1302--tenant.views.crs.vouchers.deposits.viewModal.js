// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:341153-341518
appModule.controller('tenant.views.crs.vouchers.deposits.viewModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'depositId', 'abp.services.app.agreement', 'abp.services.app.directory', 'abp.services.app.deposit', 'abp.services.app.billingMethod', '$filter','utilities',
        function ($scope, $uibModal, $uibModalInstance, depositId, agreementService, directoryService, depositService, billingMethodService, $filter, utilities) {

            var vm = this;
            vm.loading = false;
            vm.chargesTypes = [];
            vm.documents = [];
            vm.invoice = null;
            vm.defaultCurrencyCode = abp.setting.get("App.General.CurrencyCode");
            vm.currencyCode = '';
            vm.isMultiCurrencyEnabled = abp.features.isEnabled('Core.MultiCurrency');
            vm.localize = function (input) {
                return app.localize(input);
            };
            vm.permissions = {
                
                transfer: abp.auth.hasPermission('Pages.Tenant.Vouchers.Deposits.Transfer'),
                refund: abp.auth.hasPermission('Pages.Tenant.Vouchers.Deposits.Refund'),
                used: abp.auth.hasPermission('Pages.Tenant.Vouchers.Deposits.Used'),
            };
            vm.isAllocationWithChargesTypeEnabled = abp.features.isEnabled("CRS.Vouchers.AllocationWithChargesType");
            vm.isAllowPartialRefund = abp.setting.getBoolean("App.General.AllowPartialRefund");
            vm.documentsForDeposit = abp.features.isEnabled("CRS.CustomFeatures.DocumentsForDeposit");

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.cancel = function () {
                $uibModalInstance.close();
                $uibModalInstance.dismiss();
            };
            vm.isEditUsedDeposit = abp.auth.hasPermission('Pages.Tenant.Vouchers.Deposits.EditUsedDeposit');
            
            vm.depositTypes = [
               { type: app.localize('PreAuthorizationDeposit'), id: 11 },
               { type: app.localize('ChequeDeposit'), id: 13 }
            ];

            vm.getTypeById = function (voucherSubTypeId) {
                if (voucherSubTypeId == 11)
                    return app.localize("PreAuthorizationDeposit");
                if (voucherSubTypeId == 12)
                    return app.localize("CashDeposit");
                if (voucherSubTypeId == 13)
                    return app.localize("ChequeDeposit");
                if (voucherSubTypeId == 20)
                    return app.localize("CreditCardDeposit");
                else
                    return "";
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            vm.useDeposit = function (deposit) {
                debugger;
                if (deposit.isUsedDepositEdit) {

                    if (vm.isAllocationWithChargesTypeEnabled) {
                        openCreateAllocationModal2(deposit);
                    }
                    else {
                        openCreateAllocationModal(deposit);
                    }


                    
                } else {
                    abp.message.info(app.localize(deposit.usedDepositErrorMessage));
                   
                }


               
            };
            function openUseDepositModal() {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/deposits/allocationForDeposit.cshtml',
                    controller: 'tenant.views.crs.vouchers.deposits.allocationForDeposit as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        deposit: function () {
                            return deposit;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    init();
                });
            }
            vm.getOriginalName = function (doc) {
                var originalName = doc.name.replace("_" + doc.guid, "");
                return originalName;
            };

            function openCreateAllocationModal(voucher) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/deposits/editAllocationForDeposit.cshtml',
                    controller: 'tenant.views.crs.vouchers.deposits.editAllocationForDeposit as vm',
                    backdrop: 'static',
                    size: 'lg',
                    //resolve: {
                    //    voucherId: function () {
                    //        return voucherId;
                    //    },

                    //}
                    resolve: {
                        options: function () {
                            return {
                                voucherId: voucher.usedDepositId,
                                voucherSubTypeId: voucher.voucherSubTypeId,
                                tds: voucher.tds,
                                depositId: voucher.id,
                                usedAmount: voucher.amount,
                                voucherNo: voucher.voucherNo
                            };
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    depositService.updateUsedDeposit({ id: vm.deposit.usedDepositId })
                        .success(function (result) {
                            init();
                        }).finally(function () {
                            vm.loading = false;
                        });
                    
                });
            }
            function openCreateAllocationModal2(voucher) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/deposits/editAllocationForDeposit2.cshtml',
                    controller: 'tenant.views.crs.vouchers.deposits.editAllocationForDeposit2 as vm',
                    backdrop: 'static',
                    size: 'lg',
                    //resolve: {
                    //    voucherId: function () {
                    //        return voucherId;
                    //    },

                    //}
                    resolve: {
                        options: function () {
                            return {
                                voucherId: voucher.usedDepositId,
                                voucherSubTypeId: voucher.voucherSubTypeId,
                                tds: voucher.tds,
                                depositId: voucher.id,
                                usedAmount: voucher.amount,
                                voucherNo: voucher.voucherNo
                            };
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    depositService.updateUsedDeposit({ id: vm.deposit.usedDepositId })
                        .success(function (result) {
                            init();
                        }).finally(function () {
                            vm.loading = false;
                        });

                });
            }

            vm.getExpiryOrDays = function (fromdate, todate, voucherSubTypeId) {
                if (voucherSubTypeId == 11) {
                    if (todate != null) {
                        var localTime = moment.utc(todate).toDate();
                        return moment(localTime).format(vm.dateFormat);
                    }
                    else
                        return "";
                }
                if (voucherSubTypeId == 12 || voucherSubTypeId == 13) {
                    var firstDate = moment(fromdate);
                    var secondDate = moment(todate);
                    if (fromdate != null && todate != null) {
                        var diffDays = moment(secondDate.format("LLLL")).diff(moment(firstDate.format("LLLL")), 'days');
                        return diffDays;
                    }
                    else
                        return "";
                }
            };
            function getRefundtAmountOnDeposit() {
                vm.loading = true;

                depositService.getRefundtAmountOnDeposit(depositId)
                    .success(function (result) {
                        vm.refundAmount = result;
                        vm.balance = vm.deposit.amount - vm.receiptAmount - vm.refundAmount;
                    }).finally(function () {
                        vm.loading = false;
                    });
            }
            function getAllocatedAmountOnDeposit() {
                vm.loading = true;

                depositService.getAllocatedAmountOnDeposit(depositId)
                    .success(function (result) {
                        vm.receiptAmount = result;
                        vm.balance = vm.deposit.amount - vm.receiptAmount - vm.refundAmount;
                    }).finally(function () {
                        vm.loading = false;
                    });
            }

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
                    debugger;
                    if (vm.deposit.voucherSubTypeId == 11 || vm.deposit.voucherSubTypeId == 13) {
                        var foundLines = $filter('filter')(vm.depositBillingMethods, {
                            voucherSubTypeId: vm.deposit.voucherSubTypeId,
                        }, true);
                        vm.deposit.voucherSubType = foundLines[0];
                        vm.type = foundLines[0].name;
                    }
                    else  {
                        var foundLines = $filter('filter')(vm.depositBillingMethods, {
                            voucherSubTypeId: vm.deposit.voucherSubTypeId,
                            id: vm.deposit.billingDetail.billingMethodId
                        }, true);
                        vm.deposit.voucherSubType = foundLines[0];
                        if (foundLines[0]) {
                            vm.type = foundLines[0].name;
                        }
                       
                    }



                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.openUseDeposit = function () {
                debugger;
                vm.deposit;
                //deposit;
                if (vm.isAllocationWithChargesTypeEnabled) {
                    openUseDepositModal2();
                }
                else {
                    openUseDepositModal();
                }
            };

            function openUseDepositModal() {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/deposits/allocationForDeposit.cshtml',
                    controller: 'tenant.views.crs.vouchers.deposits.allocationForDeposit as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        deposit: function () {
                            return vm.deposit;
                        }
                        //,
                        //depositId: function () {
                        //    return depositId = deposit.id;
                        //}
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getDeposits();
                });
            }

            function openUseDepositModal2() {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/deposits/allocationForDeposit2.cshtml',
                    controller: 'tenant.views.crs.vouchers.deposits.allocationForDeposit2 as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        deposit: function () {
                            return deposit;
                        }
                        //,
                        //depositId: function () {
                        //    return depositId = deposit.id;
                        //}
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getDeposits();
                });
            }

            vm.openRefundDeposit = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/deposits/depositRefund.cshtml',
                    controller: 'tenant.views.crs.vouchers.deposits.depositRefund as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        deposit: function () {
                            return vm.deposit;
                        }
                        //,
                        //depositId: function () {
                        //    return depositId = deposit.id;
                        //}
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getDeposits();
                });
            }

            function init() {
                vm.loading = true;
                depositService.getDepositForEdit({ id: depositId }).success(
                     function (result) {
                        vm.deposit = result;
                        vm.documents = vm.deposit.voucherDocuments;
                        if (vm.isMultiCurrencyEnabled) {
                            if (vm.deposit.currency) {
                                vm.currencyCode = vm.deposit.currency.code;
                            }
                            else {
                                vm.currencyCode = vm.defaultCurrencyCode;
                            }
                        }
                         getBillingMethods();
                         if (vm.deposit.voucherSubTypeId)
                       //      vm.type = vm.getTypeById(vm.deposit.voucherSubTypeId)
                            if (vm.deposit) {
                                vm.expiryOrDays = vm.getExpiryOrDays(
                                    vm.deposit.fromDate,
                                    vm.deposit.toDate,
                                    vm.deposit.voucherSubTypeId || 0
                                );
                            } else {
                                vm.expiryOrDays = "";
                            }

                         if (vm.deposit) {
                             getRefundtAmountOnDeposit();
                             getAllocatedAmountOnDeposit();                             
                         }        
                     }).finally(function () {
                         vm.loading = false;
                     });
            }

            init();
        }
    ]);
