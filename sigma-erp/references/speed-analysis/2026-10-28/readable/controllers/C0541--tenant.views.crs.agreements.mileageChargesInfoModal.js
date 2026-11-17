// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:145442-145453
appModule.controller('tenant.views.crs.agreements.mileageChargesInfoModal', [
        '$scope', '$uibModalInstance', 'mileageCharges',
        function ($scope, $uibModalInstance, mileageCharges) {

            var vm = this;
            vm.mileageCharges = mileageCharges;
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            
        }
    ]);
