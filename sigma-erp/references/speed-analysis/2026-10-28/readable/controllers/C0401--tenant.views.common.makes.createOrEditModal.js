// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:101607-101641
appModule.controller('tenant.views.common.makes.createOrEditModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.make', 'makeId',
        function ($scope, $uibModalInstance, makeService, makeId) {

            var vm = this;
            vm.saving = false;
            vm.make = null;

            vm.save = function () {
                vm.saving = true;
                makeService.createOrUpdateMake({
                    make: vm.make,
                }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function() {
                    vm.saving = false;
                });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
           
            function init() {
                makeService.getMakeForEdit({
                    id: makeId
                }).success(function (result) {
                    vm.make = result;
                });
            }

            init();
        }
    ]);
