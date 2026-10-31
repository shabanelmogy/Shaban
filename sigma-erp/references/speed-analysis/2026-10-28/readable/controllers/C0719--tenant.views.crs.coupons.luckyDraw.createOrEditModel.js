// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:186783-186824
appModule.controller('tenant.views.crs.coupons.luckyDraw.createOrEditModel', [
        '$scope', '$uibModalInstance', 'abp.services.app.luckyDraw', 'luckyDrawId',
        function ($scope, $uibModalInstance, luckyDrawService, luckyDrawId) {

            var vm = this;
            vm.saving = false;
            vm.location = null;
            vm.rowToUpdateIsDefault = {};
            vm.luckyDrawIdForEdit = luckyDrawId;
            

           

            vm.save = function () {

                vm.saving = true;
                luckyDrawService.createOrUpdate(vm.luckyDraw).success(function () {
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
                luckyDrawService.getLuckyDrawForEdit({
                    id: luckyDrawId
                }).success(function (result) {

                    vm.luckyDraw = result;
                    
                });
            }
            init();
        }
    ]);
