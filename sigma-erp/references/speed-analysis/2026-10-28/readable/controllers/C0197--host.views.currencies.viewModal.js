// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:67953-67979
appModule.controller('host.views.currencies.viewModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.currency', 'currencyId',
        function ($scope, $uibModalInstance, currencyService, currencyId) {

            var vm = this;
            vm.saving = false;
            vm.currency = null;
            vm.loading = false;

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function init() {
                vm.loading = true;
                currencyService.getCurrencyForEdit({
                    id: currencyId
                }).success(function (result) {
                    vm.currency = result;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
