// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:496608-496638
appModule.controller('tenant.views.workshop.serviceItems.serviceItemsSelectorModal', [
        '$uibModalInstance','serviceItemsSelectedList',
        function ($uibModalInstance,serviceItemsSelectedList) {

            var vm = this;
            vm.saving = false;
            vm.serviceItems = null;
            vm.allSelected = false;

            vm.selectionCommit = function () {
                $uibModalInstance.close();
            };

            vm.selectAllChange = function () {
                if (vm.serviceItems)
                    vm.serviceItems.forEach(e => e.isSelected = vm.allSelected);
            };


            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function init() {
                vm.serviceItems = serviceItemsSelectedList.items;
                vm.allSelected = true;
            }

            init();
        }
    ]);
