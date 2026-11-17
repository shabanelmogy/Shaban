// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:126678-126756
appModule.controller('tenant.views.crs.accounting.journal.viewModal', ['$uibModalInstance', 'abp.services.app.journal', 'voucherId', 'voucherNo', 'utilities',
        function ($uibModalInstance, journalService, voucherId, voucherNo, utilities) {

            var vm = this;
            vm.loading = false;

            vm.voucherNo = voucherNo;
            vm.isMultiCurrencyEnabled = abp.features.isEnabled("Core.MultiCurrency");
            vm.isMultiCurrencyForLedgerEnabled = abp.features.isEnabled("CRS.CustomFeatures.MulticurrencyLedger");
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

            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };

            vm.formatNumber = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };
            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };
            vm.currencyAndRoundingWithThree = function (value) {
                if (value == null) return null;

                return value.toLocaleString('en', { minimumFractionDigits: 3, maximumFractionDigits: 3 })
            };
            vm.getVoucherType = function (type, subType) {
                return utilities.getVoucherType(type, subType);
            };

            vm.cancel = function () {
                $uibModalInstance.close();
            }

            function init() {
                vm.loading = true;
                if (vm.isMultiCurrencyEnabled && vm.isMultiCurrencyForLedgerEnabled) {
                    journalService.getJournalViewForMulticurrency({ id: voucherId }).success(function (result) {
                        vm.journal = result;
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
                    journalService.getJournalView({ id: voucherId }).success(function (result) {
                        vm.journal = result;
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
            }

            init();
        }
    ]);
