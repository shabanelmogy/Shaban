// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:84515-84553
appModule.controller('tenant.views.common.agreementGroups.createOrEditModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.agreementGroup', 'agreementGroupId','utilities',
        function ($scope, $uibModalInstance, agreementGroupService, agreementGroupId, utilities) {

            var vm = this;
            vm.saving = false;
            vm.agreementGroup = null;
            vm.loading = false;

            vm.save = function () {
                vm.saving = true;
                agreementGroupService.createOrUpdateAgreementGroup({
                    agreementGroup: vm.agreementGroup,
                }).success(function () {
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
