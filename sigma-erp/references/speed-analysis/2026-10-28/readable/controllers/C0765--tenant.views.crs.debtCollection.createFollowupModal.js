// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:200195-200219
appModule.controller('tenant.views.crs.debtCollection.createFollowupModal',
        [
            '$scope', '$uibModal', '$uibModalInstance', 'followupContact', 'abp.services.app.debtCollection',
            function ($scope, $uibModal, $uibModalInstance, followupContact, debtCollectionService) {
                var vm = this;
                vm.followup = {
                    contactId: followupContact,
                    nextFollowupDate: null,
                    isPaymentPromised: false,
                    notes: null
                };
                vm.save = function () {
                    vm.saving = true;
                    debtCollectionService.saveContactPaymentFollowup(vm.followup).success(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                };
                vm.cancel = function () {
                    $uibModalInstance.dismiss();
                };
            }
        ]);
