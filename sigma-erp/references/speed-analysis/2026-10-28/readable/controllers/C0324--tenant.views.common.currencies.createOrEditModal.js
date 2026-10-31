// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:86979-87018
appModule.controller('tenant.views.common.currencies.createOrEditModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.currency', 'currencyId',  
        function ($scope, $uibModalInstance, currencyService, currencyId) {

            var vm = this;
            vm.saving = false;
            vm.currency = null;
            vm.loading = false;
         

            vm.save = function () {
                vm.saving = true;
                currencyService.createOrUpdateCurrency({
                    currency: vm.currency,
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
