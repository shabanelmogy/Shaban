// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:225193-225218
appModule.controller('tenant.views.crs.integrations.tars.tarsPostingStatus.tarsPostingIgnoredReasonModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.tarsPostingStatus', 'tarsPosting',
        function ($scope, $uibModalInstance, tarsPostingStatusService, tarsPosting) {

            var vm = this;
            vm.tarsPosting = tarsPosting;
            
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            
            vm.save = function () {
                vm.saving = true;
                tarsPostingStatusService.saveTarsPostingIgnoreReason({
                    id: tarsPosting.id,
                    reason: vm.tarsPosting.reason
                }).success(function (result) {
                    vm.saving = false;
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close("saved");
                }).finally(function () {
                    vm.saving = false;
                });
            }
        }
    ]);
