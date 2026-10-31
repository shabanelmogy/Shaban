// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:129297-129346
appModule.controller('tenant.views.crs.accounting.openingBalances.editSupplierOpeningBalance', ['$uibModal', '$uibModalInstance', 'abp.services.app.openingBalance', 'openingBalanceId', 'abp.services.app.directory', 'abp.services.app.commonLookup',
    function ($uibModal, $uibModalInstance, openingBalanceService, openingBalanceId, directoryService, commonLookupService) {
        var vm = this;
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
        vm.localize = function (input) {
            if (input == null)
                return "";
            return app.localize(input);
        };
        vm.save = function () {
            vm.saving = true;
            openingBalanceService.updateSupplierOpeningBalance(vm.supplierOpeningBalance).success(function () {
                abp.notify.info(app.localize('SavedSuccessfully'));
                $uibModalInstance.close();
            }).finally(function () {
                vm.saving = false;
            });
        };

        vm.cancel = function () {
            $uibModalInstance.dismiss();
        };

        function init() {
            vm.loading = true;
            openingBalanceService.getSupplierOpeningBalanceForEdit({
                id: openingBalanceId
            }).success(function (result) {
                vm.supplierOpeningBalance = result;
            }).finally(function () {
                vm.loading = false;
            });
        }
        init();

    }]);
