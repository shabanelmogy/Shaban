// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:443144-443177
appModule.controller('tenant.views.hrm.sponsorship.createOrEditModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'sponsorshipsEdit', 'abp.services.app.sponsorship',
        function ($scope, $uibModal, $uibModalInstance, sponsorshipsEdit, sponsorships) {

            var vm = this;
            vm.saving = false;
            vm.sponsorship = sponsorshipsEdit;
            vm.isEditMod = false;

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.save = function () {
                vm.saving = true;
                sponsorships.createOrUpdateSponsorships(vm.sponsorships).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });

            };

            function init() {

                if (vm.sponsorship != null) {
                    vm.sponsorships = { id: vm.sponsorship.id, name: vm.sponsorship.name, notes: vm.sponsorship.notes, inActive: vm.sponsorship.inActive };
                }
            }

            init();
        }
    ]);
