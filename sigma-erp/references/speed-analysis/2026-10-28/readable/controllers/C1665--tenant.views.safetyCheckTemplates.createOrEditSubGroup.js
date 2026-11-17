// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:457298-457334
appModule.controller('tenant.views.safetyCheckTemplates.createOrEditSubGroup', [
        '$scope', '$uibModalInstance', 'item', 'isEdit',
        function ($scope, $uibModalInstance, item, isEdit) {

            var vm = this;
            vm.loading = false;
            vm.saving = false;

            vm.isEdit = isEdit;

            vm.safetyGroup = {
                "guid": Math.random().toString(36).substring(2) + Date.now().toString(36),
                "detail": isEdit ? item.detail: "",
                "value": null,
                "type": null,
                "choices": [],
                "category": 1,
                "children": []
            }

            vm.save = function () {
                vm.saving = true;
                if (vm.isEdit) {
                    item.detail = vm.safetyGroup.detail;
                }
                else {
                    item.children.push(vm.safetyGroup);
                }
                vm.saving = false;
                $uibModalInstance.dismiss();
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
        }
    ]);
