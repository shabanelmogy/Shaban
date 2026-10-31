// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:60714-60744
appModule.controller('host.views.companies.createOrEditContactBranchModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.companyHost', 'ContactId', 'CompanyName','ContactBranchData',
        function ($scope, $uibModalInstance, companyHostService, ContactId, CompanyName, ContactBranchData) {

            var vm = this;
            vm.saving = false;
            vm.CompanyName = CompanyName;
            vm.ContactBranchData = ContactBranchData;
            vm.show = ContactBranchData;
            if (ContactBranchData == null)
            {
                vm.ContactBranchData = { ContactId: ContactId };
            }
            debugger

            vm.save = function () {
                vm.saving = true;
                companyHostService.createOrUpdateContactBranch(vm.ContactBranchData).success(function () {
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
