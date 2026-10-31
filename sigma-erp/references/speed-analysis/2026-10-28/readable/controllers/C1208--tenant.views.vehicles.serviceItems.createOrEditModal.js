// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:317300-317334
appModule.controller('tenant.views.vehicles.serviceItems.createOrEditModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.serviceItem', 'serviceItemId',
        function ($scope, $uibModalInstance, serviceItemService, serviceItemId) {

            var vm = this;
            vm.saving = false;
            vm.serviceItem = null;

            vm.save = function () {
                vm.saving = true;
                serviceItemService.createOrUpdateServiceItem({
                    serviceItem: vm.serviceItem,
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
                serviceItemService.getServiceItemForEdit({
                    id: serviceItemId
                }).success(function (result) {
                    vm.serviceItem = result;
                });
            }

            init();
        }
    ]);
