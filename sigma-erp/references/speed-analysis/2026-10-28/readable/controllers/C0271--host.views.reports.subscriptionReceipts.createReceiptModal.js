// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:80121-80171
appModule.controller('host.views.reports.subscriptionReceipts.createReceiptModal', [
        '$scope', 'utilities', '$uibModalInstance', 'abp.services.app.subscriptionInvoices', 'abp.services.app.tenant', 'abp.services.app.businessDivision',
        function ($scope, utilities, $uibModalInstance, subscriptionInvoicesAppService, tenantAppService, businessDivisionService) {

            var vm = this;
            vm.loading = false;
            vm.saving = false;
            vm.isEditMode = false;

            vm.tenants = [];
            vm.invoices = [];

            vm.getbusinessDivisions = function () {
                vm.loading = true;
                businessDivisionService.getBusinessDivisionsWithCurrency().success(function (data) {
                    vm.businessDivisions = data.items
                }).finally(function () {
                    vm.loading = false;
                });
            }

            vm.save = function () {

                vm.saving = true;
                subscriptionInvoicesAppService.createReceipt(vm.receipt).success(function (result) {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };

            vm.searchTenants = function ($select) {
                if ($select.search == "")
                    return null;
                tenantAppService.searchTenants({ filter: $select.search }).then(function (response) {
                    vm.tenants = response.data.items;
                });
            };


            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function init() {
                vm.getbusinessDivisions();
            }
            init();
        }
    ]);
