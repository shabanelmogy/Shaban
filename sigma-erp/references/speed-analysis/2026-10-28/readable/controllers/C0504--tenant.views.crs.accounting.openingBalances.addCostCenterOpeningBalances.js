// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:128517-128665
appModule.controller('tenant.views.crs.accounting.openingBalances.addCostCenterOpeningBalances', [
        '$scope', 'abp.services.app.openingBalance', 'entryToEdit', '$uibModal', '$filter', 'utilities', 'FileUploader', 'appSession', '$uibModalInstance', 'abp.services.app.account', 'abp.services.app.costCenter', 'abp.services.app.commonLookup',
        function ($scope, openingBalanceService, entryToEdit, $uibModal, $filter, utilities, fileUploader, appSession, $uibModalInstance, accountService, costCenterService, commonLookupService) {
            var vm = this;
            vm.loading = false;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            vm.locations = [];
            vm.costCenterOpeningBalance = {
                voucherLines: []
            };
            vm.entryToEdit = entryToEdit;
            vm.isCostCenterEnabled = abp.features.isEnabled("Core.CostCenters");
            vm.isCostCenter2Enabled = utilities.parseBoolean(abp.setting.get("App.Speed.Common.IsCostCenterGroup2Enabled"));
            vm.stockMultiBranch = abp.features.isEnabled("Stock_MultiBranch");
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
            function getCostCenters() {
                costCenterService.searchCostCenters({ IncludeInActive: false }).success(function (response) {
                    vm.costCenters = response.items;

                    vm.costCentersGroup1 = vm.costCenters.filter(e => e.group != 2);
                    vm.costCentersGroup2 = vm.costCenters.filter(e => e.group == 2);
                });
            }
            getCostCenters();
            function getLocations() {
                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                });
            }
            getLocations();
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            // For Adding Customer Voucher
            function openingBalanceCostCenterObject() {
                var line = new Object();
                line.id = null,
                    line.account = null,
                    line.accountId = null,
                    line.locationId = null,
                    line.costCenter2Id = null,
                    line.Description = null;
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
            vm.addCostCenterRow = function () {
                vm.costCenterOpeningBalance.voucherLines.push(openingBalanceCostCenterObject());
            };

            // Removing Customer Row
            vm.removeRowCostCenter = function (row) {
                var index = vm.costCenterOpeningBalance.voucherLines.indexOf(row);
                vm.costCenterOpeningBalance.voucherLines.splice(index, 1);
            };

            vm.save = function () {
                vm.saving = true;
                if (vm.costCenterOpeningBalance.voucherLines.length == 0) return;
                var foundLinesZero = $filter('filter')(vm.costCenterOpeningBalance.voucherLines, {
                    debit: 0,
                    credit: 0,
                }, true);
                var foundLinesEmpty = $filter('filter')(vm.costCenterOpeningBalance.voucherLines, {
                    debit: null,
                    credit: null,
                }, true);
                foundLinesZero.forEach(function (value) {
                    vm.removeRowCostCenter(value);
                });
                foundLinesEmpty.forEach(function (value) {
                    vm.removeRowCostCenter(value);
                });
                if (entryToEdit && entryToEdit > 0) {
                    vm.costCenterOpeningBalance.voucherLines[0].id = entryToEdit;
                }
                openingBalanceService.createOrUpdateCostCenterOpeningBalance(vm.costCenterOpeningBalance).success(function (data) {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };

            vm.init = function () {
                if (entryToEdit && entryToEdit > 0) {
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

                                vm.costCenterOpeningBalance.voucherLines = voucherLines;

                            } else {
                                // No data returned, start with empty row
                                vm.costCenterOpeningBalance.voucherLines = [openingBalanceCostCenterObject()];
                            }
                        })
                        .error(function (error) {
                            console.error('Error loading data:', error);
                            abp.notify.error('Error loading Cost Center opening balance data');
                            vm.costCenterOpeningBalance.voucherLines = [openingBalanceCostCenterObject()];
                        })
                        .finally(function () {
                            vm.loading = false;
                        });
                } else {
                    // Create mode - start with one empty row
                    vm.costCenterOpeningBalance.voucherLines = [openingBalanceCostCenterObject()];
                }
            };

            // Call init when controller loads
            vm.init();

        }
    ]);
