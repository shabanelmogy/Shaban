// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:126760-127510
appModule.controller('tenant.views.crs.accounting.ledger.index', [
        '$scope', '$stateParams', '$uibModal', '$window', 'uiGridConstants', 'abp.services.app.vehicle', 'abp.services.app.journal', 'abp.services.app.account', 'utilities', 'abp.services.app.directory', 'appSession', 'abp.services.app.costCenter', 'abp.services.app.commonLookup',
        function ($scope, $stateParams, $uibModal, $window, uiGridConstants, vehicleService, journalService, accountService, utilities, directoryService, appSession, costCenterService, commonLookupService) {

            var vm = this;
            vm.isLocationLocked = false;   // NEW
            vm.isCostCenterEnabled = abp.features.isEnabled("Core.CostCenters");
            vm.isCostCenter2Enabled = utilities.parseBoolean(abp.setting.get("App.Speed.Common.IsCostCenterGroup2Enabled"));
            vm.fileName = appSession.tenant.tenancyName.toLowerCase() + '-' + 'header.png';
            vm.tenantName = appSession.tenant.name;
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.ledger = null;
            vm.isVehicleShow = false;
            vm.isMultiCurrencyEnabled = abp.features.isEnabled("Core.MultiCurrency");
            vm.isMultiCurrencyForLedgerEnabled = abp.features.isEnabled("CRS.CustomFeatures.MulticurrencyLedger");
            vm.isShowSubLookup = false;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.accounts = [];
            //vm.formatNumber = function (amount) {
            //    if (amount == null) return null;
            //    amount = amount.toFixed(2);
            //    return amount.toLocaleString('en');
            //};
            vm.formatNumber = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en-US');
            };
            vm.currencyAndRoundingWithThree = function (value) {
                if (value == null) return null;

                return value.toLocaleString('en', { minimumFractionDigits: 3, maximumFractionDigits: 3 })
            };
            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            vm.setPrintDateTime = function () {
                vm.printDateTime = moment().format(vm.dateTimeFormat);
            }
            vm.filters = {
                accountId: null,
                fromDate: null,
                costCenterId: null,
                costCenter2Id: null,
                toDate: null,
                state: null,
                locationId: null,
                vehicleId: null,
                showInOriginalCurrency: null,
                chassisNoOrPlateNo: null,
            };
            // NEW: default-lock to the user's own branch when they can't view other branches.
            // If $stateParams.filters arrives below, it fully replaces vm.filters (including
            // locationId), so this default only takes effect on a standalone page load.
            if (!utilities.canViewAnyOtherBranchVouchers() && appSession.user && appSession.user.locationId) {
                vm.filters.locationId = appSession.user.locationId;
                vm.isLocationLocked = true;
            }

            vm.clearLocation = function () {
                if (vm.isLocationLocked) return;
                vm.filters.state = null;
                vm.filters.locationId = null;
                vm.filters.locationName = null;
            };
            vm.stateBranchPopoup = function () {
                if (vm.isLocationLocked) return;
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/locations/stateBranchModal.cshtml',
                    controller: 'tenant.views.common.locations.searchContactModal as vm',
                    backdrop: 'static',
                }).result.then(function (branch) {
                    if (branch.id != null) {
                        vm.filters.state = null;
                        vm.filters.locationName = branch.name;
                        vm.filters.locationId = branch.id;
                    }
                    else {
                        vm.filters.locationId = null;
                        vm.filters.state = branch;
                        vm.filters.locationName = branch;
                    }
                });
            };

            // NEW: resolve the display name for the locked branch
            function getLocations() {
                commonLookupService.getLocationsActiveAndInActive({}).success(function (data) {
                    vm.locations = data.items;
                    if (vm.isLocationLocked && !vm.filters.locationName) {
                        var userLoc = vm.locations.find(l => l.id === vm.filters.locationId);
                        if (userLoc) vm.filters.locationName = userLoc.name;
                    }
                });
            }
            getLocations();
            function getCostCenters() {
                costCenterService.searchCostCenters({ IncludeInActive: false }).success(function (response) {
                    vm.costCenters = response.items;

                    vm.costCentersGroup1 = vm.costCenters.filter(e => e.group != 2);
                    vm.costCentersGroup2 = vm.costCenters.filter(e => e.group == 2);
                });
            }
            getCostCenters();

            if ($stateParams.filters) {
                vm.loading = true;
                //replace signs back to original 
                $stateParams.filters.account.name = $stateParams.filters.account.name.replaceAll('slash', '/');
                $stateParams.filters.account.name = $stateParams.filters.account.name.replaceAll('-and-', '&');

                vm.dateRangeOptions.startDate = moment($stateParams.filters.fromDate);
                vm.dateRangeOptions.endDate = moment($stateParams.filters.toDate);
                vm.dateRangeModel = {
                    startDate: $stateParams.filters.fromDate,
                    endDate: $stateParams.filters.toDate
                };
                vm.filters = $stateParams.filters;
                vm.filters.accountId = vm.filters.account.id;
                if (vm.isMultiCurrencyForLedgerEnabled) {
                    journalService.getLedgerViewForMulticurrency(vm.filters).success(function (result) {
                        vm.ledger = result;
                        //vm.ledger.ledgerView.sort((x, y) => new Date(x.date) - new Date(y.date));
                    }).finally(function () {
                        vm.loading = false;
                    });
                }
                else {
                    journalService.getLedgerView(vm.filters).success(function (result) {
                        vm.ledger = result;
                        //vm.ledger.ledgerView.sort((x, y) => new Date(x.date) - new Date(y.date));
                    }).finally(function () {
                        vm.loading = false;
                    });
                }
            }
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

            vm.getVoucherType = function (type, subType) {
                //if (type == 1) return app.localize('Invoice');
                //else if (type == 2) return app.localize('Receipt');
                //else if (type == 3) return app.localize('Expense');
                //else if (type == 4) return app.localize('Refund');
                //else if (type == 5) return app.localize('Bill');
                //else if (type == 6) return app.localize('JV');
                //else return "";
                return utilities.getVoucherType(type, subType);
            };
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
                else if (voucherTypeId == 36) {
                    openViewInvoiceModal(voucherId);
                }
                else if (voucherTypeId == 37) {
                    openViewInvoiceModal(voucherId);
                }
                else if (voucherTypeId == 8) {
                    if (voucherSubTypeId == 22 || voucherSubTypeId == 56 || !voucherSubTypeId) {
                        openViewCreditNoteModal(voucherId);
                    }
                    else if (voucherSubTypeId == 23) {
                        openViewCreditNoteOnAccountModal(voucherId);
                    }
                }
                else if (voucherTypeId == 38) {
                    openViewCreditNoteModal(voucherId);
                }
                else if (voucherTypeId == 9) {
                    openViewDebitNoteModal(voucherId);
                }
                else if (voucherTypeId == 39) {
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

            };


            vm.accountChanged = function () {

                vm.filters.contact = null;
                vm.isShowSubLookup = false;


                if (vm.filters.account.contactGroup) {
                    vm.filters.contactShow = false;
                    vm.filters.vehicleId = null;
                    vm.filters.account.contactGroupId = null;
                    vm.filters.accountId = vm.filters.account.id;

                    if (!vm.filters.account.contactGroup.isDefault)
                        vm.filters.account.contactGroupId = vm.filters.account.contactGroup.id;
                    if (vm.filters.account.contactGroup.contactType === 1) {
                        vm.filters.showContactMessage = "Please Select Staff";
                        vm.isShowSubLookup = true;
                    }
                    else if (vm.filters.account.contactGroup.contactType === 2) {
                        vm.filters.showContactMessage = "Please Select Customer";
                        vm.isShowSubLookup = true;
                    }
                    else if (vm.filters.account.contactGroup.contactType === 3) {
                        vm.filters.showContactMessage = "Please Select Supplier";
                        vm.isShowSubLookup = true;
                    }
                    else {
                        vm.filters.showContactMessage = "";
                        vm.isShowSubLookup = false;

                    }
                }
                else if (vm.filters.account.accountCategory === 4 || vm.filters.account.accountCategory === 5) {
                    vm.filters.showVehicleMessage = "Please Select Vehicle";
                    vm.isVehicleShow = true;
                }
                else {
                    vm.filters.contactShow = false;
                    vm.isShowSubLookup = false;
                    vm.filters.contactId = null;
                    vm.filters.contact = null;
                    vm.filters.accountId = vm.filters.account.id;
                    vm.filters.showContactMessage = "";
                }

            };
            vm.searchVehicles = function ($select) {
                if ($select.search == "") {
                    vm.vehicles = null;
                    return null;
                }
                return vehicleService.searchVehicles({ plateNo: $select.search, includeDefleeted: true }).then(function (response) {
                    vm.vehicles = response.data.items;
                });
            };
            // search from dropdown
            vm.searchAccounts = function ($select) {
                //get leaf accounts only
                if ($select.search == "") { vm.accounts = null; return null; }
                //return accountService.searchAccounts({ filter: $select.search, isLeaf: true }).then(function (response) {
                //    vm.accounts = response.data.items;
                //});
                return accountService.searchAccountsForSubLookUpInLedger({ filter: $select.search, isLeaf: true }).then(function (response) {
                    vm.accounts = response.data.items;
                });
            };

            // Searching Contacts
            vm.searchContact = function ($select, contactType, contactGroupId) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.searchByContactGroup({ keyword: $select.search, contactType: contactType, contactGroupId: contactGroupId }).then(function (response) {
                    vm.contacts = response.data.items;
                });
            };

            vm.clearContact = function () {
                vm.filters.contact = null;
                vm.filters.contactId = null;
            };
            function initDate() {

                if ($stateParams.filters) {
                    vm.dateRangeOptions.startDate = moment($stateParams.filters.fromDate);
                    vm.dateRangeOptions.endDate = moment($stateParams.filters.toDate);
                    vm.dateRangeModel = {


                        startDate: $stateParams.filters.fromDate,
                        endDate: $stateParams.filters.toDate
                    };
                }
            };
            vm.getLedgerView = function () {
                vm.loading = true;
                if (!vm.dateRangeModel) {
                    initDate();
                }


                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                if (!angular.isUndefined(vm.filters.account)) {
                    vm.filters.accountId = vm.filters.account.id;
                }
                if (vm.isMultiCurrencyEnabled && vm.isMultiCurrencyForLedgerEnabled) {
                    journalService.getLedgerViewForMulticurrency(vm.filters).success(function (result) {
                        vm.ledger = result;
                        //vm.ledger.ledgerView.sort((x, y) => new Date(x.date) - new Date(y.date));
                    }).finally(function () {
                        vm.loading = false;
                    });
                }
                else {
                    journalService.getLedgerView(vm.filters).success(function (result) {
                        vm.ledger = result;
                        //vm.ledger.ledgerView.sort((x, y) => new Date(x.date) - new Date(y.date));
                    }).finally(function () {
                        vm.loading = false;
                    });
                }
            };

            vm.exportToExcel = function () {
                vm.loading = true;
                if (!vm.dateRangeModel) {
                    initDate();
                }
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                if (!angular.isUndefined(vm.filters.account)) {
                    vm.filters.accountId = vm.filters.account.id;
                }

                journalService.exportLedgerToExcel(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };
            vm.getDrCr = function (balance, accountType) {
                if (balance === null || balance === undefined) return '';
                if (!accountType) return '';

                if (accountType === 1) {
                    return balance >= 0 ? ' Dr' : ' Cr';
                }
                if (accountType === 2) {
                    return balance >= 0 ? ' Cr' : ' Dr';
                }
                return '';
            };
            vm.absValue = function (value) {
                if (value === null || value === undefined) return 0;
                return Math.abs(value);
            };

        }
    ]);
