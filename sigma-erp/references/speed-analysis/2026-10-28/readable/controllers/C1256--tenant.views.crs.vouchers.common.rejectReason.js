// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:329629-329651
appModule.controller('tenant.views.crs.vouchers.common.rejectReason', ['$scope', '$stateParams', '$sce', 'appSession', '$uibModalInstance', 'message',
        function ($scope, $stateParams, sce, appSession, $uibModalInstance, message) {
            var vm = this;
            vm.rejectionReason = '';
            vm.message = message;

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.save = function () {
                if (vm.rejectionReason) {
                    $uibModalInstance.close(vm.rejectionReason);
                }
            };

            //function init() {
            //    vm.rejectionReason = Reason;
            //}

            //init();
        }
    ]);
