// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:200222-200246
appModule.controller('tenant.views.crs.debtCollection.customerBlackListModal',
        [
            '$scope', '$uibModal', '$uibModalInstance', 'contact', 'abp.services.app.debtCollection',
            function ($scope, $uibModal, $uibModalInstance, contact, debtCollectionService) {
                var vm = this;
                vm.contact = contact;
              
                vm.filters = {
                    contactId: vm.contact != null ? contact.id : 0,
                    BlackListReason: null
                };
                vm.save = function () {
                    vm.saving = true;
                    debtCollectionService.blackListContact(vm.filters).success(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close(true);
                    }).finally(function () {
                        vm.saving = false;
                    });
                };
                vm.cancel = function () {
                    $uibModalInstance.dismiss(false);
                };
            }
        ]);
