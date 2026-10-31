// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:94502-94541
appModule.controller('tenant.views.divisions.createOrEditModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.division', 'divisionId',
        function ($scope, $uibModalInstance, divisionService, divisionId) {

            var vm = this;
            vm.loading = false;
            vm.saving = false;
            vm.division = null;

            vm.save = function () {
                vm.saving = true;
                divisionService.createOrUpdateDivision({
                    division: vm.division,
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
                if (divisionId) {
                    vm.loading = true;
                    divisionService.getDivisionForEdit({
                        id: divisionId
                    }).success(function (result) {
                        vm.division = result;
                        vm.loading = false;
                    });
                }
            }

            init();
        }
    ]);
