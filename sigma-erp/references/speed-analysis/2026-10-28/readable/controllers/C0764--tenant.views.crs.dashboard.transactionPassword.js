// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:200166-200182
appModule.controller('tenant.views.crs.dashboard.transactionPassword', ['$scope', '$stateParams', '$sce', 'appSession', '$uibModalInstance', 'title',
        function ($scope, $stateParams, sce, appSession, $uibModalInstance, title) {
            var vm = this;
            vm.transactionPassword = '';
            vm.title = title;

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.save = function () {
                if (vm.transactionPassword) {
                    $uibModalInstance.close(vm.transactionPassword);
                }
            };
        }
    ]);
