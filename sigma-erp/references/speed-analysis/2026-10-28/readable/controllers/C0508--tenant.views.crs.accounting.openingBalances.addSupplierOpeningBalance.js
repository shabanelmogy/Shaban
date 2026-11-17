// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:129100-129178
appModule.controller('tenant.views.crs.accounting.openingBalances.addSupplierOpeningBalance', [
        '$scope', 'abp.services.app.openingBalance', 'abp.services.app.directory', 'abp.services.app.asset', '$uibModal', '$filter', 'abp.services.app.commonLookup', 'FileUploader', 'appSession', '$uibModalInstance',
    function ($scope, openingBalanceService, directoryService, assetService, $uibModal, $filter, commonLookupService, fileUploader, appSession, $uibModalInstance) {
        var vm = this;
        vm.loading = false;

        $scope.$on('$viewContentLoaded', function () {
            App.initAjax();
        });
        vm.supplierOpeningBalance = [];
        vm.isRentalAgreementEnabled = abp.features.isEnabled("CRS.Rental.Agreements");
        vm.isLeaseAgreementEnabled = abp.features.isEnabled("CRS.Lease.Agreements");
        vm.searchContacts = function ($select, contactType) {
            //whereas contactType: 1 (staff) and contactType: 2 (supplier). get suppliers
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

        // For Adding Supplier Voucher
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
        vm.addSupplierRow = function () {
            vm.supplierOpeningBalance.push(openingBalanceContactObject());
        };

        // Removing Supplier Row
        vm.removeRowSupplier = function (row) {
            var index = vm.supplierOpeningBalance.indexOf(row);
            vm.supplierOpeningBalance.splice(index, 1);
        };

        vm.save = function () {
            vm.saving = true;
            if (vm.supplierOpeningBalance.length == 0) return;
            var foundLinesZero = $filter('filter')(vm.supplierOpeningBalance, {
                debit: 0,
                credit: 0,
            }, true);
            var foundLinesEmpty = $filter('filter')(vm.supplierOpeningBalance, {
                debit: null,
                credit: null,
            }, true);
            foundLinesZero.forEach(function (value) {
                vm.removeRowSupplier(value);
            });
            foundLinesEmpty.forEach(function (value) {
                vm.removeRowSupplier(value);
            });
            openingBalanceService.addSupplierOpeningBalance({ openingBalances: vm.supplierOpeningBalance }).success(function (data) {
                $uibModalInstance.close();
            }).finally(function () {
                vm.saving = false;
            });
        };

    }
    ]);
