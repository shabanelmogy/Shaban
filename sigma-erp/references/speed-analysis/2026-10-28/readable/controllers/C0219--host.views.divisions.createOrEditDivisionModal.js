// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:71046-71091
appModule.controller('host.views.divisions.createOrEditDivisionModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'divisionId', 'abp.services.app.currency', 'abp.services.app.businessDivision',
        function ($scope, $uibModal, $uibModalInstance,  divisionId, currencyService, businessDivisionService) {

            var vm = this;
            vm.loading = false;
            vm.divisionId = divisionId;
            vm.filters = {
                name: ''
            };
            vm.getCurrencies = function () {
                vm.loading = true;
                currencyService.getCurrencies().success(function (data) {
                    vm.currencies = data.items
                }).finally(function () {
                    vm.loading = false;
                });
            }
            vm.save = function () {
                vm.saving = true;
                businessDivisionService.createOrUpdate(vm.division).success(function (result) {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };
            function init() {
                if (divisionId != null) {
                    vm.loading = true;
                    businessDivisionService.getDivisionForEdit(divisionId).success(function (data) {
                        debugger
                        vm.division = data;
                        vm.loading = false;
                    });
                }
            }
            
            
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            vm.getCurrencies();
            init();
        }
    ]);
