// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:84700-84726
appModule.controller('tenant.views.common.agreementGroups.viewModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.agreementGroup','agreementGroupId',
        function ($scope, $uibModalInstance, agreementGroupService, agreementGroupId) {

            var vm = this;
            vm.saving = false;
            vm.agreementGroup = null;
            vm.loading = false;

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function init() {
                vm.loading = true;
                agreementGroupService.getAgreementGroupForEdit({
                    id: agreementGroupId
                }).success(function (result) {
                    vm.agreementGroup = result;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
