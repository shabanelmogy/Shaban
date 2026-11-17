// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:94913-94947
appModule.controller('tenant.views.expenseTypes.createOrEditModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.expenseType', 'expenseTypeId',
        function ($scope, $uibModalInstance, expenseTypeService, expenseTypeId) {

            var vm = this;
            vm.saving = false;
            vm.expenseType = null;

            vm.save = function () {
                vm.saving = true;
                expenseTypeService.createOrUpdateExpenseType({
                    expenseType: vm.expenseType,
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
                expenseTypeService.getExpenseTypeForEdit({
                    id: expenseTypeId
                }).success(function (result) {
                    vm.expenseType = result;
                });
            }

            init();
        }
    ]);
