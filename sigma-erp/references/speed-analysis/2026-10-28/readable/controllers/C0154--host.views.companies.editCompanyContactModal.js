// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:61282-61294
appModule.controller('host.views.companies.editCompanyContactModal',
        [
            '$scope', 'companyContacts', '$uibModalInstance', 'abp.services.app.companyHost',
            function ($scope, companyContacts, $uibModalInstance, companyHostService) {
                var vm = this;

                vm.companyContacts = companyContacts;

                vm.cancel = function () {
                    $uibModalInstance.dismiss();
                };
            }
        ]);
