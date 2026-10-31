// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:455033-455081
appModule.controller('tenant.views.pos.unitOfMeasure.createOrEditModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.unitOfMeasure', 'unitOfMeasureId',
        function ($scope, $uibModalInstance, unitofmeasureService, unitOfMeasureId) {

            var vm = this;
            vm.saving = false;
            vm.unitOfMeasure = null;
            vm.loading = false;

            vm.isposEnabled = abp.features.isEnabled("POS");
            debugger;
            vm.isBilingualDataInputEnabled = abp.features.isEnabled("CRS.CustomFeatures.BilingualDataInput");

            vm.save = function () {
                vm.saving = true;
                unitofmeasureService.createOrUpdateUnitOfMeasure({
                    unitOfMeasure: vm.unitOfMeasure
                }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };

            vm.categories = [
                { id: 1, name: 'Volume' },
                { id: 2, name: 'Length' },
                { id: 3, name: 'Weight' },
                { id: 4, name: 'Unit' }
            ];

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function init() {
                vm.loading = true;
                unitofmeasureService.getUnitOfMeasureForEdit({
                    id: unitOfMeasureId
                }).success(function (result) {
                    vm.unitOfMeasure = result;
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
