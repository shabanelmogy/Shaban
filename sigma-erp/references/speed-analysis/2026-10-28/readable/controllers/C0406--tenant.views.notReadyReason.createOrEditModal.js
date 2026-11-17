// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:102048-102085
appModule.controller('tenant.views.notReadyReason.createOrEditModal', [
        '$scope', 'utilities', '$uibModalInstance', 'abp.services.app.reason', 'locationId',
        function ($scope, utilities, $uibModalInstance, reasonService, locationId) {
            
            var vm = this;
            vm.saving = false;
            vm.reason = null;
            vm.autoSetVehicleStatus = utilities.parseBoolean(abp.setting.get("App.Speed.Common.AutomaticallySetVehicleStatusNotReadyOnAgreementClosing"));

            vm.save = function () {
                
                vm.saving = true;
                reasonService.createOrUpdateReason({
                    // location: vm.location,
                    reason : vm.reason,
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
                reasonService.getReasonForEdit({
                    id: locationId
                }).success(function (result) {
                    vm.reason = result;
                });
            }

            init();
        }
    ]);
