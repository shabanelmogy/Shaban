// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:128750-128886
appModule.controller('tenant.views.crs.accounting.openingBalances.addPrepaidOpeningBalance', [
        '$scope', 'abp.services.app.openingBalance', '$uibModal', '$filter', 'abp.services.app.vehicle', 'abp.services.app.account', 'FileUploader', 'appSession', '$uibModalInstance', 'abp.services.app.commonLookup',
        function ($scope, openingBalanceService, $uibModal, $filter, vehicleService, accountService, fileUploader, appSession, $uibModalInstance, commonLookupService) {
            var vm = this;
            vm.loading = false;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            vm.locations = [];
            vm.prepaidOpeningBalance = [];
            vm.isRentalAgreementEnabled = abp.features.isEnabled("CRS.Rental.Agreements");
            vm.isLeaseAgreementEnabled = abp.features.isEnabled("CRS.Lease.Agreements");
            vm.stockMultiBranch = abp.features.isEnabled("Stock_MultiBranch");
            function getLocations() {
                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                });
            }
            getLocations();
            // search from dropdown
            vm.searchAccounts = function ($select) {
                //get leaf accounts only
                if ($select.search == "") { vm.accounts = null; return null; }
                return accountService.searchAccounts({ filter: $select.search, isLeaf: true }).then(function (response) {
                    vm.accounts = response.data.items;
                });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            // For Adding opening Voucher
            function openingBalanceContactObject() {
                var line = new Object();
                line.debit = 0;
                line.credit = 0;
                line.vehicleId = null;
                line.locationId = null;
                return line;
            }

            // For Adding 
            vm.localize = function (input) {
                if (input == null)
                    return "";

                return app.localize(input);
            };

            vm.addPrepaidRow = function () {
                vm.prepaidOpeningBalance.push(openingBalanceContactObject());
            };

            // Removing opening Row
            vm.removeRowPrepaid = function (row) {
                var index = vm.prepaidOpeningBalance.indexOf(row);
                vm.prepaidOpeningBalance.splice(index, 1);
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

            vm.clearVehicle = function (row) {
                row.vehicle = null;
                row.vehicleId = null;
                return true;
            };

            const validate = function () {
                let hasValidationError = false;
                let errorRowIndex = -1;
                for (let i = 0; i < vm.prepaidOpeningBalance.length; i++) {
                    var x = vm.prepaidOpeningBalance[i];
                    if (x.debit == 0 && x.credit == 0) {
                        hasValidationError = true;
                        errorRowIndex = i;
                        break;
                    }
                }
                return {
                    hasValidationError: hasValidationError,
                    errorRowIndex: errorRowIndex
                };
            }

            vm.save = function () {
                const validationResult = validate();
                if (validationResult.hasValidationError) {
                    abp.message.error(`Debit Or Credit must be non zero in row ${(validationResult.errorRowIndex + 1)}`);
                    return false;
                }

                vm.saving = true;

                if (vm.prepaidOpeningBalance.length == 0) return;

                var foundLinesZero = $filter('filter')(vm.prepaidOpeningBalance, {
                    debit: 0,
                    credit: 0,
                }, true);

                var foundLinesEmpty = $filter('filter')(vm.prepaidOpeningBalance, {
                    debit: null,
                    credit: null,
                }, true);

                foundLinesZero.forEach(function (value) {
                    vm.removeRowPrepaid(value);
                });

                foundLinesEmpty.forEach(function (value) {
                    vm.removeRowPrepaid(value);
                });

                openingBalanceService.generateImportedPrepaidOpeningBalances({ openingBalanceList: vm.prepaidOpeningBalance })
                    .success(function (data) {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();

                    }).finally(function () {
                        vm.saving = false;
                    });
            };
        }
    ]);
