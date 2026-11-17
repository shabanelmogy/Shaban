// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:466152-466202
appModule.controller('tenant.views.stock.itemTypes.createOrEditModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.itemType', 'itemTypeId',
        function ($scope, $uibModalInstance, itemTypeService, itemTypeId) {

            var vm = this;
            vm.saving = false;
            vm.itemType = null;
            vm.loading = false;

            vm.isCrsEnabled = abp.features.isEnabled("WorkShop");

            vm.save = function () {
                
                vm.saving = true;
                itemTypeService.createOrUpdateItemType({
                    itemType: vm.itemType
                }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };

            vm.categories = [
                { id: 1, name: 'Part' },
                {
                    id: 2,
                    name: app.localize('LiquidSemiLiquid')
                }
            ];
            
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function init() {
                
                vm.loading = true;
                itemTypeService.getItemTypeForEdit({
                    id: itemTypeId
                }).success(function (result) {
                    vm.itemType = result;
                    vm.loading = false;
                });
            }

            init();

        }
    ]);
