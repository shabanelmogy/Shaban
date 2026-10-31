// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:223447-223545
appModule.controller('tenant.views.fusionIntegration.mappings.index', [
        '$scope', 'abp.services.app.fusionIntegration', 'abp.services.app.commonLookup', 'abp.services.app.account',
        function ($scope, fusionIntegrationService, commonLookupService, accountService) {

            var vm = this;
            vm.loading = false;
            vm.saving = false;

            vm.voucherTypes = [
                { key: 1, name: 'Invoice' },
                { key: 8, name: 'Credit Note' },
                { key: 9, name: 'Debit Note' },
                { key: 10, name: 'Deposit' },
                { key: 15, name: 'Deposit Refund' }, // VoucherSubTypes
                { key: 20, name: 'Deposit Used' },
            ];

            vm.taxRules = [
                { key: 1, name: 'Standard Rated' },
                { key: 2, name: 'Zero Rated' },
                { key: 3, name: 'Exempted' },
            ];

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            function getMappings() {
                vm.mappingsLoading = true;
                fusionIntegrationService.getMappings()
                    .success(result => {
                       vm.mappings = result;
                    })
                    .finally(() => {
                        vm.mappingsLoading = false;
                    });
            }

            function getLocations() {
                vm.locationsLoading = true;
                commonLookupService.getLocations()
                    .success(result => {
                        vm.locations = result.items;
                    })
                    .finally(() => {
                        vm.locationsLoading = false;
                    });
            }

            vm.searchAccounts = function ($select) {
                if ($select.search == "") {
                    vm.accounts = null;
                    return null;
                }
                return accountService.searchAccountsForSubLookUp({ filter: $select.search, isLeaf: true, accountCategory: vm.accountCategory }).then(function (response) {
                    //let accounts = [];
                    //for (const x of response.data.items) {
                    //    if (!vm.mappings.accountMappings || !vm.mappings.accountMappings.find(am => am.speedAccount.id == x.id)) {
                    //        accounts.push(x);
                    //    }
                    //}
                    //vm.accounts = accounts;

                    vm.accounts = response.data.items;
                });
            };

            vm.addAccountRow = function () {
                if (vm.mappings.accountMappings) {
                    vm.mappings.accountMappings.push({
                        speedAccount: {}
                    });
                }
            };

            vm.removeAccountRow = function (row) {
                var index = vm.mappings.accountMappings.indexOf(row);
                vm.mappings.accountMappings.splice(index, 1);
            };

            vm.save = function () {
                vm.saving = true;
                fusionIntegrationService.updateMappings(vm.mappings)
                    .success(result => {
                        getMappings();
                    })
                    .finally(() => {
                        vm.saving = false;
                    });
            }

            function init() {
                getLocations();
                getMappings();
            }

            init();
        }
    ]);
