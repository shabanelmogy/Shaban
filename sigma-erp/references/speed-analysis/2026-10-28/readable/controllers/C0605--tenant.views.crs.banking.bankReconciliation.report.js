// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:163713-163928
appModule.controller('tenant.views.crs.banking.bankReconciliation.report', [
        '$scope', 'uiGridConstants', 'abp.services.app.bankReconciliation', 'utilities', 'abp.services.app.billingMethod', 'abp.services.app.commonLookup', '$filter', '$stateParams',
        function ($scope, uiGridConstants, bankReconciliationAppService, utilities, billingMethodService, commonLookupService, $filter, $stateParams) {

            var vm = this;
            vm.filters = {};

            if ($scope.$parent) {
                if ($scope.$parent.vmMain && $scope.$parent.vmMain.filters)
                    vm.filters = $scope.$parent.vmMain.filters;
            }

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            vm.start = true;
            vm.loading = false;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.enable = false;
            vm.reconciliation = {
                reconciliationDetail: []
            };

            vm.permissions = {
                viewOtherBranch: abp.auth.hasPermission('Pages.Tenant.Vouchers.Receipts.ViewOtherBranchReceipts'),
            };


            vm.filterChanged = function () {
                vm.allReconciled = false;
                vm.getBankReconciliation();
            };

            vm.dateRangeModel = {
                startDate: null,
                endDate: null,
            };


            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('YYYY-MM-DD');
                }
                else {
                    return "";
                }
            };


            vm.getBankAccounts = function getBankAccounts() {
                commonLookupService.getBankAccountsForSelection().success(function (data) {
                    vm.bankAccounts = data.items;
                });
            };


            //Location related code Start ------------
            vm.locationPermission = function (row) {
                if (row.locationId) {
                    if (!vm.permissions.allActionsOnOtherBranch && row.locationId != appSession.user.locationId)
                        return false;
                }
                return true;
            };

            function getLocations() {
                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                    vm.LocationsForAgreement = data.items;

                });
            };

            //Location related code END ---------------

            vm.getBankReconciliation = function () {
                vm.loading = true;
                //vm.filters.bankStatmentDate = vm.filters.bankStatmentDate.endOf('day')

                bankReconciliationAppService.getCurrentReconciliationForPrint(vm.filters).success(function (result) {
                    vm.lastReconciledBalance = result.lastReconciledBalance;
                    vm.lastReconciliationDate = result.lastReconciliationDate;
                    vm.bankReconciledData = result.bankReconciliations.items;
                    vm.ledgerBalance = result.ledgerBalance;
                    vm.pendingEntriesBalance = result.pendingEntriesBalance;
                    //vm.reconciledBalance = result.reconciledBalance;
                    vm.calculateBalance();

                    vm.bankReconciledMatchedData = vm.bankReconciledData.filter(e => e.reconciled);
                    vm.bankReconciledUnMatchedData = vm.bankReconciledData.filter(e => !e.reconciled);

                    var sumReconciledDebit = 0.0;
                    var sumReconciledCredit = 0.0;
                    var sumNotReconciledDebit = 0.0;
                    var sumNotReconciledCredit = 0.0;
                    vm.bankReconciledMatchedData.forEach(function (value, key) {
                        // in case of Debit
                        sumReconciledDebit = sumReconciledDebit + value.debit;
                        // in case of Credit
                        sumReconciledCredit = sumReconciledCredit + value.credit;
                    });
                    vm.sumReconciledDebit = utilities.round(sumReconciledDebit, 2);
                    vm.sumReconciledCredit = utilities.round(sumReconciledCredit, 2);

                    vm.bankReconciledUnMatchedData.forEach(function (value, key) {
                        sumNotReconciledDebit = sumNotReconciledDebit + value.debit;
                        // in case of Credit
                        sumNotReconciledCredit = sumNotReconciledCredit + value.credit;
                    });
                    vm.sumNotReconciledDebit = utilities.round(sumNotReconciledDebit, 2);
                    vm.sumNotReconciledCredit = utilities.round(sumNotReconciledCredit, 2);


                    vm.start = false;
                }).finally(function () {
                    vm.loading = false;
                    vm.allReconciled = false;
                    vm.enable = true;
                });
            };

            vm.calculateBalance = function () {

                var reconcileBalance = 0;
                var diff = 0;
                var sumDebitAmount = 0;
                var sumCreditAmount = 0;
                vm.bankReconciledData.forEach(function (value, key) {
                    if (value.reconciled) {
                        // in case of Debit
                        reconcileBalance = reconcileBalance + value.debit;
                        diff = diff - value.debit;
                        // in case of Credit
                        reconcileBalance = reconcileBalance - value.credit;
                        diff = diff + value.credit;

                        sumDebitAmount = sumDebitAmount + value.debit;
                        sumCreditAmount = sumCreditAmount + value.credit;
                    }

                });
                vm.reconciledBalance = utilities.round(reconcileBalance + vm.lastReconciledBalance, 2);
                vm.diff = utilities.round(vm.filters.bankStatementBalance - vm.reconciledBalance, 2);
                vm.sumDebitAmount = utilities.round(sumDebitAmount, 2);
                vm.sumCreditAmount = utilities.round(sumCreditAmount, 2);
            };


            // Reconciled And UnReconciled
            vm.reconcileUnReconcileVoucher = function (row) {
                if (row.reconciled) {
                    bankReconciliationAppService.reconcileVoucher({ id: row.voucherLineId }).success(function () {
                        row.reconciled = true;
                    }).finally(function () {
                    })
                }
                else {
                    bankReconciliationAppService.unReconcileVoucher({ id: row.voucherLineId }).success(function () {
                        row.reconciled = false;
                    }).finally(function () {
                    })
                }

            };

            vm.save = function () {
                vm.saving = true;
                vm.reconciliation.reconciliationDetail = [];
                vm.reconciliation.reconciliationDetail = $filter('filter')(vm.bankReconciledData, {
                    reconciled: true
                }, true);
                vm.reconciliation.bankAccountId = vm.filters.linkedAccount.id;
                vm.reconciliation.reconciliationDate = vm.filters.bankStatmentDate;
                vm.reconciliation.reconciledBalance = vm.reconciledBalance;
                if (vm.reconciliation.reconciliationDetail.length == 0) {
                    vm.saving = false;
                    return;
                }
                bankReconciliationAppService.createOrUpdateReconciliation({ reconciliation: vm.reconciliation }
                ).success(function () {
                    vm.isReconciled = true;
                    abp.notify.info(app.localize('SavedSuccessfully'));
                }).finally(function () {
                    vm.saving = false;
                });

            };

            vm.clear = function () {
                vm.enable = false;
                vm.filters.linkedAccount = null;
                vm.filters.bankStatementBalance = null;
                vm.bankReconciledData = null;
                vm.reconciledBalance = 0;
                vm.diff = 0;
                vm.sumDebitAmount = 0;
                vm.sumCreditAmount = 0;
                vm.lastReconciledBalance = null;
                vm.isReconciled = false;
                vm.start = true;


            };


            function init() {
                vm.getBankAccounts();
                vm.getBankReconciliation();
            }

            init();
        }
    ]);
