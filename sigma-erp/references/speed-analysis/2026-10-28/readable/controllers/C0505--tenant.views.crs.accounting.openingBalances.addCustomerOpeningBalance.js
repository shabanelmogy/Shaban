// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:128668-128747
appModule.controller('tenant.views.crs.accounting.openingBalances.addCustomerOpeningBalance', [
        '$scope', 'abp.services.app.openingBalance', 'abp.services.app.directory', 'abp.services.app.asset', '$uibModal', '$filter', 'abp.services.app.commonLookup', 'FileUploader', 'appSession', '$uibModalInstance',
    function ($scope, openingBalanceService, directoryService, assetService, $uibModal, $filter, commonLookupService, fileUploader, appSession, $uibModalInstance) {
        var vm = this;
        vm.loading = false;

        $scope.$on('$viewContentLoaded', function () {
            App.initAjax();
        });
        vm.customerOpeningBalance = [];
        vm.isRentalAgreementEnabled = abp.features.isEnabled("CRS.Rental.Agreements");
        vm.isLeaseAgreementEnabled = abp.features.isEnabled("CRS.Lease.Agreements");
        vm.searchContacts = function ($select, contactType) {
            //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
            return directoryService.search({ keyword: $select.search, contactType: contactType }).then(function (response) {
                vm.contacts = response.data.items;
            });
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

        // For Adding Customer Voucher
        function openingBalanceContactObject() {
            var line = new Object();
            line.debit = 0;
            line.credit = 0;
            line.vehicleId = null;
            return line;
        }
        // For Adding 
        vm.localize = function (input) {
            if (input == null)
                return "";

            return app.localize(input);
        };
        vm.addCustomerRow = function () {
            vm.customerOpeningBalance.push(openingBalanceContactObject());
        };

        // Removing Customer Row
        vm.removeRowCustomer = function (row) {
            var index = vm.customerOpeningBalance.indexOf(row);
            vm.customerOpeningBalance.splice(index, 1);
        };

        vm.save = function () {
            vm.saving = true;
            if (vm.customerOpeningBalance.length == 0) return;
            var foundLinesZero = $filter('filter')(vm.customerOpeningBalance, {
                debit: 0,
                credit: 0,
            }, true);
            var foundLinesEmpty = $filter('filter')(vm.customerOpeningBalance, {
                debit: null,
                credit: null,
            }, true);
            foundLinesZero.forEach(function (value) {
                vm.removeRowCustomer(value);
            });
            foundLinesEmpty.forEach(function (value) {
                vm.removeRowCustomer(value);
            });
            openingBalanceService.addCustomerOpeningBalance({ openingBalances: vm.customerOpeningBalance }).success(function (data) {
                $uibModalInstance.close();
            }).finally(function () {
                vm.saving = false;
            });
        };

    }
    ]);
