// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:292603-292635
appModule.controller('tenant.views.crs.saleOrigins.createOrEditSaleOriginModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.saleOrigin', 'saleOriginId',
        function ($scope, $uibModalInstance, saleOriginService, saleOriginId) {

            var vm = this;
            vm.saving = false;
            vm.location = null;
            vm.saleOriginId = saleOriginId;
            vm.save = function () {

                vm.saving = true;
                saleOriginService.createOrUpdateSaleOrigin({ saleOrigin: vm.saleOrigin }).success(function () {
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
                saleOriginService.getSaleOriginForEdit({
                    id: saleOriginId
                }).success(function (result) {
                    vm.saleOrigin = result;
                });
            }
            init();
        }
    ]);
