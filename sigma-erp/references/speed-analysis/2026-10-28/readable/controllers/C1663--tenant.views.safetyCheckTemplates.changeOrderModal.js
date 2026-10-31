// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:457212-457256
appModule.controller('tenant.views.safetyCheckTemplates.changeOrderModal', [
        '$scope', '$uibModalInstance', 'items',
        function ($scope, $uibModalInstance, items) {

            var vm = this;
            vm.loading = false;
            vm.saving = false;

            vm.items = items;

            vm.sortOfChildrenChanged = function (event, ui) {
                debugger;
                var obj = JSON.parse(ui.item.attr('data-id'));
                var updatedIndex = ui.item.index();
                var children = obj.child;
                var childIndex = obj.childIndex;

                if (updatedIndex == 0) {
                    var element = children;
                    vm.items.splice(childIndex, 1);
                    vm.items.splice(updatedIndex, 0, element);
                }
                else if (updatedIndex == (vm.items.length - 1)) {
                    var element = children;
                    vm.items.splice(childIndex, 1);
                    vm.items.splice(updatedIndex, 0, element);
                }
                else {
                    var element = children;
                    vm.items.splice(childIndex, 1);
                    vm.items.splice(updatedIndex, 0, element);
                }
                $scope.$apply();
            };

            vm.save = function () {
                vm.saving = false;
                $uibModalInstance.close();
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
        }
    ]);
