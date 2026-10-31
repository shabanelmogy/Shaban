// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:128381-128514
appModule.controller('tenant.views.crs.accounting.openingBalances.addAccountOpeningBalances', [
        '$scope', 'abp.services.app.openingBalance', 'entryToEdit', '$uibModal', '$filter', 'FileUploader', 'appSession', '$uibModalInstance', 'abp.services.app.account',
        function ($scope, openingBalanceService, entryToEdit, $uibModal, $filter, fileUploader, appSession, $uibModalInstance, accountService) {
            var vm = this;
            vm.loading = false;
            vm.entryToEdit = entryToEdit;
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            vm.accounts = [];
            vm.accountOpeningBalance = {
                voucherLines: []
            };

            vm.searchAccounts = function ($select) {
                if ($select.search == "") {
                    vm.accounts = null;
                    return null;
                }
                //,isLeaf:true
                return accountService.searchAccountsForSubLookUp({ filter: $select.search, isLeaf: true, accountCategory: vm.accountCategory }).then(function (response) {
                    vm.accounts = response.data.items;
                });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            // For Adding Customer Voucher
            function accountLineObject() {

                var line = new Object();
                line.id = null,
                    line.account = null,
                    line.accountId = null,
                    line.locationId = null,
                    line.debit = null;
                line.credit = null;
                line.vehicleId = null;
                return line;
            }
            // For Adding
            vm.localize = function (input) {
                if (input == null)
                    return "";

                return app.localize(input);
            };
            vm.addRow = function () {
                vm.accountOpeningBalance.voucherLines.push(accountLineObject());
            };

            // Removing Customer Row
            vm.removeRow = function (obj) {
                var index = vm.accountOpeningBalance.voucherLines.indexOf(obj);
                vm.accountOpeningBalance.voucherLines.splice(index, 1);

            };

            vm.save = function () {
                vm.saving = true;
                if (vm.accountOpeningBalance.voucherLines.length == 0) return;
                var foundLinesZero = $filter('filter')(vm.accountOpeningBalance.voucherLines, {
                    debit: 0,
                    credit: 0,
                }, true);
                var foundLinesEmpty = $filter('filter')(vm.accountOpeningBalance.voucherLines, {
                    debit: null,
                    credit: null,
                }, true);
                foundLinesZero.forEach(function (value) {
                    vm.removeRow(value);
                });
                foundLinesEmpty.forEach(function (value) {
                    vm.removeRow(value);
                });
                if (vm.entryToEdit && vm.entryToEdit > 0) {
                    vm.accountOpeningBalance.voucherLines[0].id = entryToEdit;
                }
                openingBalanceService.createOrUpdateAccountOpeningBalance(vm.accountOpeningBalance).success(function (data) {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });

            };

            vm.init = function () {
                if (vm.entryToEdit && vm.entryToEdit > 0) {
                    // Edit mode
                    vm.loading = true;
                    openingBalanceService.getCostCenterOpeningBalanceForEdit(entryToEdit)
                        .success(function (result) {

                            if (result) {
                                // Handle different data structure possibilities
                                var voucherLines = [];

                                if (Array.isArray(result)) {
                                    voucherLines = result;
                                } else if (result.voucherLines && Array.isArray(result.voucherLines)) {
                                    voucherLines = result.voucherLines;
                                } else if (result.accountId || result.id) {
                                    voucherLines = [result];
                                }

                                vm.accountOpeningBalance.voucherLines = voucherLines;

                            } else {
                                // No data returned, start with empty row
                                vm.accountOpeningBalance.voucherLines = [accountLineObject()];
                            }
                        })
                        .error(function (error) {
                            console.error('Error loading data:', error);
                            abp.notify.error('Error loading Account opening balance data');
                            vm.accountOpeningBalance.voucherLines = [accountLineObject()];
                        })
                        .finally(function () {
                            vm.loading = false;
                        });
                } else {
                    // Create mode - start with one empty row
                    vm.accountOpeningBalance.voucherLines = [accountLineObject()];
                }
            };

            // Call init when controller loads
            vm.init();

        }
    ]);
