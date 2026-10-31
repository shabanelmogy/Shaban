// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:364758-364774
appModule.controller('tenant.views.crs.vouchers.invoices.searchTripModal', ['$uibModal', '$uibModalInstance', 'abp.services.app.commonLookup', 'abp.services.app.trafficFine', 'contactId',
    function ($uibModal, $uibModalInstance, commonLookUpService, trafficFineAppService, contactId) {
        var vm = this;
        // Vehicle Search
        vm.searchTrips = function ($select) {
            if ($select.search == "") return;
            return commonLookUpService.searchTripsForInvoice({ contactId: contactId, tripNo: $select.search }).then(function (response) {
                vm.trips = response.data.items;
            });
        };
        vm.save = function () {
            $uibModalInstance.close(vm.trip);
        };
        vm.cancel = function () {
            $uibModalInstance.dismiss();
        };
    }]);
