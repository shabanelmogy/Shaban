// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:105037-105084
appModule.controller('tenant.views.locations.createOrEditFuelAccountModal', ['$scope', '$uibModalInstance', 'abp.services.app.fuelAccount', 'id', 'viewMode',
        function ($scope, $uibModalInstance, fuelAccountServices, id, viewMode) {

            var vm = this;
            vm.saving = false;
            vm.ViewOnly = viewMode;

            vm.fuelAccount = {};
            vm.types = [
                {
                    id: 1,
                    name: 'ENOC'
                },
                {
                    id: 2,
                    name: 'ADNOC'
                }
            ];

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.save = function () {
                vm.saving = true;
                debugger;
                fuelAccountServices.createOrUpdate({
                    fuelAccount: vm.fuelAccount
                }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };

            function init() {

                fuelAccountServices.getFuelAccountForEdit({
                    id: id
                }).success(function (result) {
                    vm.fuelAccount = result;
                });
            }
            init();

        }
    ]);
