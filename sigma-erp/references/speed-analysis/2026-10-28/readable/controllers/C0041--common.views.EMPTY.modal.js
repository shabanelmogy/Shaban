// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:29597-29617
appModule.controller('common.views.EMPTY.modal', [
        '$scope', '$uibModalInstance', 
        function ($scope, $uibModalInstance) {
            var vm = this;

            vm.saving = false;

            vm.save = function () {
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function init() {

            }

            init();
        }
    ]);
