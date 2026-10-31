// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:88144-88188
appModule.controller('tenant.views.customLookups.createOrEditModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.customLookup', 'customLookup',
        function ($scope, $uibModalInstance, customLookupService, customLookup) {

            var vm = this;
            vm.saving = false;
            vm.customLookup = null;

            vm.save = function () {
                vm.saving = true;
                customLookupService.createOrUpdateCustomLookup({
                    customLookup: vm.customLookup,
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

            vm.getTitle = function (str) {
                let word = app.localize(str);
                return word + customLookup.lookup;
            };

            function init() {
                if (customLookup.id == null) {
                    vm.customLookup = customLookup;
                    return;
                }

                customLookupService.getCustomLookupForEdit({
                    id: customLookup.id
                }).success(function (result) {
                    vm.customLookup = result;
                });
            }

            init();
        }
    ]);
