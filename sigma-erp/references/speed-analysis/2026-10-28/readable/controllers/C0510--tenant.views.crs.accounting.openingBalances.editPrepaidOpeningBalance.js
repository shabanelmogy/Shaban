// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:129234-129293
appModule.controller('tenant.views.crs.accounting.openingBalances.editPrepaidOpeningBalance',
        ['$uibModal', '$uibModalInstance', 'abp.services.app.openingBalance', 'prepaidOpeningBalanceRow', 'abp.services.app.account', 'abp.services.app.vehicle', 'abp.services.app.commonLookup',
            function ($uibModal, $uibModalInstance, openingBalanceService, prepaidOpeningBalanceRow, accountService, vehicleService, commonLookupService) {
                var vm = this;
                vm.stockMultiBranch = abp.features.isEnabled("Stock_MultiBranch");
                vm.prepaidOpeningBalance = prepaidOpeningBalanceRow;
                vm.locations = [];
                // search from dropdown
                vm.searchAccounts = function ($select) {
                    //get leaf accounts only
                    if ($select.search == "") { vm.accounts = null; return null; }
                    return accountService.searchAccounts({ filter: $select.search, isLeaf: true }).then(function (response) {
                        vm.accounts = response.data.items;
                    });
                };
                function getLocations() {
                    commonLookupService.getLocations({}).success(function (data) {
                        vm.locations = data.items;
                    });
                }
                getLocations();
                vm.cancel = function () {
                    $uibModalInstance.dismiss();
                };

                vm.save = function () {
                    vm.saving = true;

                    openingBalanceService.updatePrepaidOpeningBalance(vm.prepaidOpeningBalance).success(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                };

                vm.vehicles = null;
                vm.searchVehicles = function ($select) {
                    if ($select.search == "") {
                        vm.vehicles = null; return null;
                    }

                    return vehicleService.searchVehicles({
                        plateNo: $select.search
                    }).then(function (response) {
                        vm.vehicles = response.data.items;
                    });
                };

                function init() {
                    vm.loading = true;
                    openingBalanceService.getPrepaidOpeningBalanceForEdit({ id: prepaidOpeningBalanceRow.id }).success(function (result) {
                        vm.prepaidOpeningBalance = result;

                    }).finally(function () {
                        vm.loading = false;
                    });
                }
                init();
            }]);
