// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:233255-233266
appModule.controller('tenant.views.crs.lease.agreements.mileageChargesInfoModal', [
        '$scope', '$uibModalInstance', 'mileageCharges',
        function ($scope, $uibModalInstance, mileageCharges) {

            var vm = this;
            vm.mileageCharges = mileageCharges;
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            
        }
    ]);
