// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:329664-329760
appModule.controller('tenant.views.crs.vouchers.creditNotes.allocatedNowForOpeningBalanceModal', [
        '$scope', 'abp.services.app.commonLookup', '$uibModalInstance', 'utilities', 'abp.services.app.account', 'allocation', 'abp.services.app.chargesSetting',
        function ($scope, commonLookupService, $uibModalInstance, utilities, accountService, allocation, chargesSettingService) {
        var vm = this;
        vm.loading = false;

        $scope.$on('$viewContentLoaded', function () {
            App.initAjax();
        });
        vm.data =allocation.allocatedList?allocation.allocatedList:[];
        vm.customerOpeningBalance = [];
        vm.isRentalAgreementEnabled = abp.features.isEnabled("CRS.Rental.Agreements");
        vm.isAccountEnabled = abp.features.isEnabled("CRS.Accounts");
        
        vm.isAllocationWithChargesTypeEnabled = abp.features.isEnabled("CRS.Vouchers.AllocationWithChargesType");
            if (vm.isAllocationWithChargesTypeEnabled)
                vm.isAccountEnabled = false;

        vm.isLeaseAgreementEnabled = abp.features.isEnabled("CRS.Lease.Agreements");

        vm.searchAccounts = function ($select, accountCategory) {
            if ($select.search == "") { vm.accounts = null; return null; }
            return accountService.searchAccounts({ filter: $select.search, isLeaf: true }).then(function (response) {
                vm.accounts = response.data.items;
            });
            };
            vm.rounding = function (value) {
                return utilities.round(parseFloat(value), 2);
            };

        vm.sumAmount = function () {
            var sum = 0.0;
            vm.data.forEach(function (value) {
                sum = sum + value.amount;
                sum = vm.rounding(sum);
            });
            return sum;
        };
        vm.searchRentalOrLeaseAgreement = function ($select, contactId) {

            if ($select.search == '') return;
            commonLookupService.searchRentalOrLeaseAgreement({ agreementNo: $select.search, contactId: contactId }).then(function (response) {
                vm.agreements = response.data.items;
            });
        };
        vm.cancel = function () {
            $uibModalInstance.dismiss();
        };

        function getChargesTypes() {
            vm.loading = true;
            chargesSettingService.getConfiguredChargesTypesDistinct().success(function (data) {
                vm.chargesTypes = data.items;
                angular.forEach(vm.chargesTypes, function (row) {
                    row.name = app.localize(row.name);
                });
            }).finally(function () {
                vm.loading = false;
            });
        }

        // For Adding Customer Voucher
        function allocatedNowObject() {
            var line = new Object();
            line.amount = 0;
            line.accountId = null;
            line.chargesTypeId = null;
            return line;
        }
        // For Adding 
        vm.localize = function (input) {
            if (input == null)
                return "";

            return app.localize(input);
        };
        vm.addRow = function () {
            vm.data.push(allocatedNowObject());
        };

        // Removing Customer Row
        vm.removeRow = function (row) {
            var index = vm.data.indexOf(row);
            vm.data.splice(index, 1);
        };

        vm.save = function () {
            allocation.allocatedNow = vm.sumAmount();
            allocation.allocatedList = vm.data;
            $uibModalInstance.close();
          
        };

        getChargesTypes();
        
    }
    ]);
