// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:119818-119829
appModule.controller('tenant.views.crs.accidents.excessChargesInfoModal', [
        '$uibModalInstance', 'excessChargesDetail',
        function ($uibModalInstance, excessChargesDetail) {

            var vm = this;
            vm.excessChargesDetail = excessChargesDetail.replace(/(?:\r\n|\r|\n)/g, '<br>');
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            
        }
    ]);
