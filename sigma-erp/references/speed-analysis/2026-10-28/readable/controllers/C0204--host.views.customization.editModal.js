// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:69124-69192
appModule.controller('host.views.customization.editModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.customizationHost', 'abp.services.app.user', 'customizationId',
        function ($scope, $uibModalInstance, customizationService, userService, customizationId) {

            var vm = this;
            vm.saving = false;
            vm.isEditMod = true;

            vm.statuses = [
                    { id: 1, name: "Open" },
                    { id: 2, name: "Closed" }
            ];
            
            vm.priorities = [
                    { id: 1, name: "Normal" },
                    { id: 3, name: "High" }
            ];

            vm.getStatus = function (id) {
                if (id == 1)
                    return "Open";
                else if (id == 2)
                    return "Closed";
                else return '';
            };

            vm.searchUsers = function ($select) {
                if ($select.search == "")
                    return;
                
                userService.searchAssignedToUsers({ keyword: $select.search }).then(function (response) {
                    vm.users = response.data.items;
                });
            };
            
            vm.save = function () {
                vm.saving = true;
                debugger
                customizationService.createOrUpdateCustomization({
                    customization: vm.customization,

                }).success(function () {
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
                vm.loading = true;
                
                customizationService.getCustomizationForEdit({
                    id: customizationId
                }).success(function (result) {
                    vm.customization = result;
                    vm.isEditMod = true;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
