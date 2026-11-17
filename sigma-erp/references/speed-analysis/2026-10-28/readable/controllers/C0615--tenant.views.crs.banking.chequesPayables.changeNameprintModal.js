// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:165196-165218
appModule.controller('tenant.views.crs.banking.chequesPayables.changeNameprintModal', [
        '$stateParams', 'contactName', '$scope', 'appSession', 'abp.services.app.commonLookup', 'utilities', '$uibModalInstance',
        function ($stateParams, contactName, $scope, appSession, commonLookupService, utilities, $uibModalInstance) {
            var vm = this;
            vm.changedName = '';

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.save = function () {
                if (vm.changedName) {
                    $uibModalInstance.close(vm.changedName);
                }
            };

            function init() {
                vm.changedName = contactName.contactName;
            }

            init();
        }
    ]);
