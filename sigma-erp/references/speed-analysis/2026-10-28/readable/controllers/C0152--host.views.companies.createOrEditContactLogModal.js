// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:60747-60768
appModule.controller('host.views.companies.createOrEditContactLogModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'contactId', 'abp.services.app.contactLog',
        function ($scope, $uibModal, $uibModalInstance, contactId, contactLogService) {
            var vm = this;
            vm.saving = false;
            vm.contactLog = null;
            vm.save = function () {
                vm.saving = true;
                vm.contactLog.contactId = contactId;
                contactLogService.createOrUpdateContactLog({ contactLog: vm.contactLog }).success(function () {
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
