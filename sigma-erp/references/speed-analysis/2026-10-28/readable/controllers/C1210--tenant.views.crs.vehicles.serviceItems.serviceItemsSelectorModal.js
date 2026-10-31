// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:317440-317500
appModule.controller('tenant.views.crs.vehicles.serviceItems.serviceItemsSelectorModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.serviceItem', 'serviceItemsSelectedList',
        function ($scope, $uibModalInstance, serviceItemService, serviceItemsSelectedList) {

            var vm = this;
            vm.saving = false;
            vm.serviceItems = null;
            vm.allSelected = false;

            vm.selectionCommit = function () {
                var list = [];
                for (var i in vm.serviceItems) {
                    if (vm.serviceItems[i].isSelected)
                        list.push(vm.serviceItems[i]);
                }

                $uibModalInstance.close(list);
            };

            vm.selectAllChange = function () {
                if (vm.serviceItems) {
                    
                    for (var x in vm.serviceItems) {
                        vm.serviceItems[x].isSelected = vm.allSelected;
                    }
                }
            };

            vm.removeSelectedItems = function () {
                if (vm.serviceItems)
                    for (var i = 0; i < vm.serviceItems.length; i++) {
                        for (var j = 0; j < serviceItemsSelectedList.items.length; j++) {
                            if (vm.serviceItems[i].id == serviceItemsSelectedList.items[j].id) {
                                vm.serviceItems.splice(i, 1);
                                i--;
                                break;
                            }
                        }
                    }
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function init() {
                vm.loading = true;
                serviceItemService.getServiceItems()
                    .success(function (result) {
                        vm.serviceItems = result.items;
                        vm.removeSelectedItems();
                        vm.loading = false;
                    })
                    .error(function () {
                        vm.loading = false;
                    });
            }

            init();
        }
    ]);
