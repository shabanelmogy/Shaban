// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:126033-126675
appModule.controller('tenant.views.crs.accounting.journal.index', [
        '$scope', '$uibModal', '$window', 'uiGridConstants', 'abp.services.app.journal', 'abp.services.app.account', 'utilities',
        function ($scope, $uibModal, $window, uiGridConstants, journalService, accountService, utilities) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.journal = null;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            //vm.dateRangeOptions.min = moment().startOf('month').format('YYYY-MM-DD');
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.accounts = [];
            vm.isMultiCurrencyEnabled = abp.features.isEnabled("Core.MultiCurrency");
            vm.isMultiCurrencyForLedgerEnabled = abp.features.isEnabled("CRS.CustomFeatures.MulticurrencyLedger");
            vm.voucherTypes = null;
            vm.formatNumber = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };

            vm.filters = {
                voucherNo: null,
                voucherType: null,
                accountId: null,
                fromDate: null,
                toDate: null,
                chassisNoOrPlateNo: null,
            };

            vm.dateRangeModel = {
                startDate: null,
                endDate: null,
            };
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };
            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            vm.currencyAndRoundingWithThree = function (value) {
                if (value == null) return null;

                return value.toLocaleString('en', { minimumFractionDigits: 3, maximumFractionDigits: 3 })
            };
            vm.clearAccount = function () {
                vm.filters.account = null;
                vm.filters.accountId = null;
            };

            function getAllVoucherTypes() {
                vm.voucherTypes = utilities.getAllVoucherTypesArray();
            };

            vm.getVoucherType = function (type, subType) {
                return utilities.getVoucherType(type, subType);
            };
            // Mapping of voucher keyword → modal config
            // Map voucher names to their modals

            function openViewInvoiceModal(voucherId) {
                var templateUrl = "";
                var controller = "";
                if (abp.features.isEnabled("POS") === true) {
                    templateUrl = '~/App/tenant/views/crs/vouchers/invoices/posInvoiceviewModel.cshtml';
                    controller = 'tenant.views.crs.vouchers.invoices.posInvoiceviewModal as vm';
                }
                else {
                    templateUrl = '~/App/tenant/views/crs/vouchers/invoices/viewModal.cshtml';
                    controller = 'tenant.views.crs.vouchers.invoices.viewModal as vm';

                }

                $uibModal.open({
                    templateUrl: templateUrl,
                    controller: controller,

                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        invoiceId: function () {
                            return voucherId;
                        }
                    }
                });

            }
            function openViewLimoInvoiceModal(voucherId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/invoices/viewLimoModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.invoices.createOrEditLimoModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        invoiceId: function () {
                            return voucherId;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                });
            }
            function openViewReceiptModal(voucherId, agreement) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/receipts/viewModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.receipts.viewModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        receiptId: function () {
                            return voucherId;
                        },
                        agreement: function () {
                            return agreement;
                        }
                    }
                });
            }
            function openViewCreditNoteModal(creditNoteId, agreement) {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/creditNotes/viewModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.creditNotes.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        creditNoteId: function () {
                            return creditNoteId;
                        },
                        agreement: null
                    }
                });

            };

            function openViewCreditNoteOnAccountModal(voucherId, agreement) {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/creditNotes/OnAccountviewModal.cshtml',
                    //  controller: 'tenant.views.crs.vouchers.creditNotes.createOrEditModal as vm',
                    controller: 'tenant.views.crs.vouchers.creditNotes.createOrEditModalOnAccount as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        creditNoteId: function () {
                            return voucherId;
                        },
                        agreement: null
                    }
                });
            }
            function openViewDebitNoteModal(voucherId, agreement) {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/debitNotes/viewModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.debitNotes.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        debitNoteId: function () {
                            return voucherId;
                        }
                    }
                });

            }
            function openViewDepositModal(voucherId, agreement, deposit) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/deposits/viewModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.deposits.viewModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        depositId: function () {
                            return voucherId;
                        },
                        agreement: function () {
                            return agreement;
                        },
                        deposit: function () {
                            return deposit;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getDeposits();
                });
            };
            openViewPurchaseOrderModal = function (voucherId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/purchaseOrders/viewModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.purchaseOrders.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'full',
                    //resolve: {
                    //    purchaseOrderId: function () {
                    //        return purchaseOrderId;
                    //    }
                    //}
                    resolve: {
                        options: function () {
                            return {
                                purchaseOrderId: voucherId,
                            }
                        }
                    }
                });

            }
            function openViewCashWithdrawalModal(voucherId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/cashWithdrawals/viewModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.cashWithdrawals.viewModal as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        cashWithdrawalId: function () {
                            return voucherId;
                        }
                    }
                });
            }
            openViewbillModal = function (voucherId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/bills/viewModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.bills.viewModal as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        //billId: function () {
                        //    return billId;
                        //}
                        options: function () {
                            return {
                                purchaseOrder: null,
                                billId: voucherId
                            };
                        }
                    }
                });

            };
            openViewPaymentModal = function (voucherId, agreement) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/payments/viewModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.payments.viewModal as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        paymentId: function () {
                            return voucherId;
                        },
                        agreement: function () {
                            return agreement;
                        }
                    }
                });

            };
            openViewJVModal = function (voucherId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/jvs/viewModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.jvs.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        JVId: function () {
                            return voucherId;
                        },
                        IsClone: function () {
                            return false;
                        },
                    }
                });

            }
            openPayrollApprovalModal = function (voucherId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/salaryVouchers/viewModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.salaryVouchers.viewModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        salaryVoucherId: function () {
                            return voucherId;
                        }
                    }
                });
            }
            openViewStockAdjustmentModal = function (voucherId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/stockAdjustment/viewModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.stockAdjustment.createOrEdit as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        JVId: function () {
                            return voucherId;
                        }
                    }
                });

            }
            openViewbankDepositModal = function (voucherId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/bankDeposits/viewModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.bankDeposits.viewModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        bankDepositId: function () {
                            return bankDepositId;
                        }
                    }
                });

            }
            function openViewPurchaseReturnModal(purchaseReturnId) {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/stock/purchaseReturns/viewModal.cshtml',
                    controller: 'tenant.views.stock.purchaseReturns.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        purchaseReturnId: function () {
                            return purchaseReturnId;
                        }
                    }
                });

            }
            function openViewStockTransferModal(stockTransferId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/stock/stockTransfer/viewModal.cshtml',
                    controller: 'tenant.views.stock.stockTransfer.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        options: function () {
                            return { id: stockTransferId };
                        }

                    }
                });
            }
            openViewItemReturnsModal = function (returnId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/stock/itemReturns/viewModal.cshtml',
                    controller: 'tenant.views.stock.itemReturns.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        returnId: function () {
                            return returnId;
                        },
                        options: function () {
                            return null;
                        }
                    }
                });
            };
            openViewItemIssuesModal = function (issueId) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/stock/itemIssues/createOrEditModal.cshtml',
                    controller: 'tenant.views.stock.itemIssues.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        options: function () {
                            return { itemReqId: null, id: issueId };
                        }

                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getItemIssues();
                });
            };
            function openCreateOrEditCashBankDepositModal(cashBankDepositId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/banking/cashBankDeposit/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.banking.cashBankDeposit.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        cashBankDepositId: function () {
                            return cashBankDepositId;
                        }
                    }
                });
            }

            vm.openVoucher = function (voucherTypeId, voucherSubTypeId, voucherNo, voucherId) {
                if (!voucherTypeId) {
                    abp.message.warn('Invalid voucher type.');
                    return;
                }
                if (voucherTypeId == 1) {
                    if (voucherSubTypeId != 2) {
                        openViewInvoiceModal(voucherId);
                    }
                    if (voucherSubTypeId == 2) {
                            openViewLimoInvoiceModal(voucherId);
                    }
                }
                else if (voucherTypeId == 2) {
                        openViewReceiptModal(voucherId);
                }
                else if (voucherTypeId == 8) {
                    if (voucherSubTypeId == 22 || voucherSubTypeId == 56 || !voucherSubTypeId) {
                            openViewCreditNoteModal(voucherId);
                    }
                    else if (voucherSubTypeId == 23) {
                            openViewCreditNoteOnAccountModal(voucherId);
                    }
                }
                else if (voucherTypeId == 9) {
                        openViewDebitNoteModal(voucherId);
                }
                else if (voucherTypeId == 10) {
                        openViewDepositModal(voucherId);
                }
                else if (voucherTypeId == 12) {
                        openViewPurchaseOrderModal(voucherId);
                }
                else if (voucherTypeId == 48) {
                        openViewCashWithdrawalModal(voucherId);
                }
                else if (voucherTypeId == 5) {
                        openViewbillModal(voucherId);
                }
                else if (voucherTypeId == 3) {
                        openViewPaymentModal(voucherId);
                }
                else if (voucherTypeId == 6) {
                        openViewJVModal(voucherId);
                }
                else if (voucherTypeId == 50) {
                        openPayrollApprovalModal(voucherId);
                }
                else if (voucherTypeId == 47) {
                        openViewStockAdjustmentModal(voucherId);
                }
                else if (voucherTypeId == 16) {
                    openCreateOrEditCashBankDepositModal(voucherId);
                }
                else if (voucherTypeId == 36) {
                    openViewInvoiceModal(voucherId);
                }
                else if (voucherTypeId == 37) {
                    openViewInvoiceModal(voucherId);
                }
                else if (voucherTypeId == 38) {
                    openViewCreditNoteModal(voucherId);
                }
                else if (voucherTypeId == 39) {
                    openViewDebitNoteModal(voucherId);
                }
                else if (voucherTypeId == 30) {
                    openViewPurchaseReturnModal(voucherId);
                }
                else if (voucherTypeId == 35) {
                    openViewStockTransferModal(voucherId);
                }
                else if (voucherTypeId == 27) {
                    openViewItemReturnsModal(voucherId);
                }
                else if (voucherTypeId == 26) {
                    openViewItemIssuesModal(voucherId);
                }
                else if (voucherTypeId == 20) {
                    openCreateOrEditCashBankDepositModal(voucherId);
                }

                //var modalInfo = voucherTypeMap[voucherTypeId];

                //if (!modalInfo) {
                //    abp.message.warn('No modal configuration found for voucher type: ' + voucherTypeId);
                //    return;
                //}

                //$uibModal.open({
                //    templateUrl: modalInfo.templateUrl,
                //    controller: modalInfo.controller + ' as vm',
                //    backdrop: 'static',
                //    resolve: (function () {
                //        var resolveObj = {};
                //        resolveObj[modalInfo.paramName] = function () {
                //            return id; // Pass your actual ID here
                //        };
                //        return resolveObj;
                //    })()
                //});
            };


            // search from dropdown
            vm.searchAccounts = function ($select) {
                //get leaf accounts only
                if ($select.search == "") { vm.accounts = null; return null; }
                return accountService.searchAccounts({ filter: $select.search, isLeaf: true }).then(function (response) {
                    vm.accounts = response.data.items;
                });
            };
            vm.getType = function (value) {


                return app.localize(value)
            }

            vm.getJournalView = function () {
                vm.filters.voucherType = null;
                vm.filters.voucherSubType = null;
                //if (vm.filters.voucherNo != null && vm.filters.voucherNo != "" && vm.filters.type == null) {
                //    abp.message.info(app.localize('SelectTypeInfoMsg'));
                //}
                //  else {
                vm.loading = true;
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                //if (!angular.isUndefined(vm.filters.account) && vm.filters.account!=null) {
                //    vm.filters.accountId = vm.filters.account.id;
                //}
                if (vm.filters.account) {
                    vm.filters.accountId = vm.filters.account.id;
                    //    vm.filters.account = vm.filters.account.name;
                }
                if (vm.filters.type) {
                    vm.filters.voucherType = vm.filters.type.voucherType;
                    vm.filters.voucherSubType = vm.filters.type.voucherSubType;
                }

                if (vm.isMultiCurrencyForLedgerEnabled && vm.isMultiCurrencyEnabled) {
                    journalService.getJournalViewForMulticurrency(vm.filters).success(function (result) {
                        vm.journal = result;
                        //vm.journal.sort((x, y) => new Date(x.date) - new Date(y.date));
                        vm.journal.totalDebit = 0;
                        vm.journal.totalCredit = 0;
                        angular.forEach(vm.journal, function (obj) {
                            vm.journal.totalDebit += obj.debit;
                            vm.journal.totalCredit += obj.credit;
                        });
                    }).finally(function () {
                        vm.loading = false;
                    });
                }
                else {
                    journalService.getJournalView(vm.filters).success(function (result) {
                        vm.journal = result;
                        //vm.journal.sort((x, y) => new Date(x.date) - new Date(y.date));
                        vm.journal.totalDebit = 0;
                        vm.journal.totalCredit = 0;
                        angular.forEach(vm.journal, function (obj) {
                            vm.journal.totalDebit += obj.debit;
                            vm.journal.totalCredit += obj.credit;
                        });
                    }).finally(function () {
                        vm.loading = false;
                    });
                }
                // }
            };

            vm.exportToExcel = function () {
                debugger;
                vm.filters.voucherType = null;
                vm.filters.voucherSubType = null;
                //if (vm.filters.voucherNo != null && vm.filters.voucherNo != "" && vm.filters.type == null) {
                //    abp.message.info(app.localize('SelectTypeInfoMsg'));
                //}
                //else {
                vm.loading = true;
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                if (!angular.isUndefined(vm.filters.account)) {
                    vm.filters.accountId = vm.filters.account.id;

                }
                if (vm.filters.type) {
                    vm.filters.voucherType = vm.filters.type.voucherType;
                    vm.filters.voucherSubType = vm.filters.type.voucherSubType;
                }
                journalService.exportJournalToExcel(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
                // }
            };


            vm.exportToExcel2 = function () {
                vm.filters.voucherType = null;
                vm.filters.voucherSubType = null;
                //if (vm.filters.voucherNo != null && vm.filters.voucherNo != "" && vm.filters.type == null) {
                //    abp.message.info(app.localize('SelectTypeInfoMsg'));
                //}
                //else {
                vm.loading = true;
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                if (!angular.isUndefined(vm.filters.account)) {
                    vm.filters.accountId = vm.filters.account.id;
                }
                if (vm.filters.type) {
                    vm.filters.voucherType = vm.filters.type.voucherType;
                    vm.filters.voucherSubType = vm.filters.type.voucherSubType;
                }
                journalService.exportJournalToExcelView2(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
                //    }
            };

            function init() {
                getAllVoucherTypes();
            }

            init();
        }
    ]);
