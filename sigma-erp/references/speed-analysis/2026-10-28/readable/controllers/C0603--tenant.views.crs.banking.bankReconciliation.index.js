// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:163393-163686
appModule.controller('tenant.views.crs.banking.bankReconciliation.index', [
        '$scope', '$uibModal', 'abp.services.app.bankReconciliation', 'utilities', 'abp.services.app.commonLookup', 'abp.services.app.billingMethod', '$filter',
        function ($scope, $uibModal, bankReconciliationAppService, utilities, commonLookupService, billingMethodService, $filter) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };


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

            vm.filters = {
                date: null,
                bankStatmentDate: null,
                linkedAccountId: null,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
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

            vm.bankDataAll = function () {

                if (vm.bankReconciledData == null) return;

                angular.forEach(vm.bankReconciledData, function (row) {
                    row.reconciled = vm.allReconciled;
                    vm.reconcileUnReconcileVoucher(row);
                });
                vm.calculateBalance();

            }

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
            function getBillingMethods() {
                vm.loading = true;
                var request = {};
                if (vm.cardTransferDateRange) {
                    request.type = 2;
                }

                billingMethodService.getBillingMethods(request).success(function (data) {
                    vm.billingMethods = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };
            //Location related code END ---------------
            vm.pendingEntriesBalance = 0.0;
            vm.getBankReconciliation = function () {
                vm.loading = true;
                vm.filters.bankStatmentDate = vm.filters.bankStatmentDate.endOf('day')

                bankReconciliationAppService.getBankEntryOfReconciliation(vm.filters).success(function (result) {
                    vm.lastReconciledBalance = result.lastReconciledBalance;
                    vm.lastReconciliationDate = result.lastReconciliationDate;
                    vm.bankReconciledData = result.bankReconciliations.items;
                    vm.ledgerBalance = result.ledgerBalance;
                    vm.pendingEntriesBalance = result.pendingEntriesBalance;

                    vm.originalBankData = angular.copy(vm.bankReconciledData);

                    if (vm.filters.billingMethodId && vm.filters.billingMethodId > 0) {
                        vm.bankReconciledData = vm.originalBankData.filter(item =>
                            item.billingMethodId === vm.filters.billingMethodId
                        );
                    } else {
                        vm.bankReconciledData = vm.originalBankData;
                    }

                    vm.calculateBalance();
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

            vm.bankReconciliationReportModal = function () {
                debugger;
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/banking/BankReconciliation/printPreview.cshtml',
                    controller: 'tenant.views.crs.banking.BankReconciliation.printPreview as vmMain',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
            };
            // Reconciled And UnReconciled
            vm.reconcileUnReconcileVoucher = function (row) {
                vm.loading = true;
                if (row.reconciled) {
                    bankReconciliationAppService.reconcileVoucher({ id: row.voucherLineId }).success(function () {
                        row.reconciled = true;
                        //vm.getBankReconciliation();
                    }).finally(function () {
                        vm.loading = false;
                    })
                }
                else {
                    bankReconciliationAppService.unReconcileVoucher({ id: row.voucherLineId }).success(function () {
                        row.reconciled = false;
                        //vm.getBankReconciliation();
                    }).finally(function () {
                        vm.loading = false;
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
                vm.reconciliation.reconciliationDate = moment(vm.filters.bankStatmentDate).subtract(3, 'milliseconds'); //vm.filters.bankStatmentDate;
                vm.reconciliation.reconciledBalance = vm.reconciledBalance;
                vm.reconciliation.ledgerBalance = vm.ledgerBalance;
                vm.reconciliation.pendingEntriesBalance = parseFloat(vm.ledgerBalance) - parseFloat(vm.reconciledBalance);
                if (vm.reconciliation.reconciliationDetail.length == 0) {
                    vm.saving = false;
                    return;
                }
                //return;
                bankReconciliationAppService.createOrUpdateReconciliation({ reconciliation: vm.reconciliation }
                ).success(function (result) {
                    vm.isReconciled = true;
                    vm.filters.reconciliationId = result;
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
                vm.filters.billingMethodId = null;


            };

            vm.exportToExcel = function () {
                vm.exportToExcelButtonPressed = true;
                var tab_text = "<h2>Bank Reconciliation</h2><br/>";
                tab_text = tab_text + "<table border='1px'><tr>";
                var j = 0;
                var tab1 = document.getElementById('bankReconcileTable'); // id of table

                for (j = 0; j < tab1.rows.length; j++) {

                    //tab_text = tab_text;

                    tab_text = tab_text + tab1.rows[j].innerHTML.toUpperCase() + "</tr>";
                    //tab_text=tab_text+"</tr>";
                }
                tab_text = tab_text + "</table>";
                tab_text = tab_text + "</br>";
                //tab_text = tab_text.replace(/<A[^>]*>|<\/A>/g, ""); //remove if u want links in your table
                // tab_text = tab_text.replace(/<img[^>]*>/gi, ""); //remove if u want images in your table
                // tab_text = tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); //remove input params

                var ua = window.navigator.userAgent;
                var msie = ua.indexOf("MSIE ");

                if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer

                {
                    txtArea1.document.open("txt/html", "replace");
                    txtArea1.document.write('sep=,\r\n' + tab_text);
                    txtArea1.document.close();
                    txtArea1.focus();
                    sa = txtArea1.document.execCommand("SaveAs", true, "BankReconciliation.xls");
                }

                else {
                    sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));
                }

                return (sa);
            }

            function init() {
                getBillingMethods();
                vm.getBankAccounts();
                //getLocations();
                // vm.getBankReconciliation();
            }

            init();
        }
    ]);
