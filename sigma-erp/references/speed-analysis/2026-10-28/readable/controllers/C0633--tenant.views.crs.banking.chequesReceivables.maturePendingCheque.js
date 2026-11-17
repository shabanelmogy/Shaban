// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:168176-168287
appModule.controller('tenant.views.crs.banking.chequesReceivables.maturePendingCheque', [
        '$scope', '$uibModalInstance', 'abp.services.app.bankAccount', 'utilities', '$uibModal', 'abp.services.app.chequesReceivables',
        function ($scope, $uibModalInstance, bankAccountService, utilities, $uibModal, chequesReceivablesService) {

            var vm = this;
            vm.saving = false;
            vm.receipt = null;
            vm.bankAccounts = null;
            vm.successMsg = null;
            vm.matureDepositNo = null;
            vm.allSelected = false;
            vm.savedMature = false;
            vm.all = false;

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
            vm.filters = {
                enableDateRange: true,
                chequeNo: null,
                contactId: null,
                fromDate: null,
                toDate: null,
                amount: null,
                dateTimeType: 4,
                skipCount: 0,
                status: 1,
                maxResultCount: 1000,
            };

            vm.allBoxTicked = function () {
                if (vm.data === null) return;
                angular.forEach(vm.data, function (row) {
                    row.generate = vm.all;
                });
            };

            vm.getChequesReceivables = function () {
                vm.loading = true;
                chequesReceivablesService.getChequesReceivables(vm.filters).success(function (data) {
                    vm.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });

            };

            vm.save = function () {
                vm.saving = true;
                var matureCheques = [];

                angular.forEach(vm.data, function (item) {
                    if (item.generate) {
                        item.receiptId = item.id;
                        item.matureDate = vm.matureDate;
                        item.bankAccountId = vm.bankAccount.id;
                        item.bankAccount = vm.bankAccount;
                        matureCheques.push(item);
                    }
                });

                chequesReceivablesService.pendingMatureCheque({
                    matureDate: vm.matureDate,
                    matureCheque: matureCheques,
                    bankAccount: vm.bankAccount
                })
                    .success(function (data) {
                        debugger;
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    })
                    .error(function (error) {
                        abp.notify.error(app.localize('ErrorOccurred'));
                    })
                    .finally(function () {
                        vm.saving = false;
                    });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function getBankAccounts() {
                vm.loading = true;
                bankAccountService.getBankAccountsForSelection({}).success(function (data) {
                    vm.bankAccounts = data.items;
                    vm.bankAccounts.forEach(e => e.chequePrintTemplate = null);
                }).finally(function () {
                    vm.loading = false;
                });
            }

            function init() {

                vm.loading = true;
                getBankAccounts();
                vm.loading = false;
                vm.getChequesReceivables();
            }

            init();
        }
    ]);
