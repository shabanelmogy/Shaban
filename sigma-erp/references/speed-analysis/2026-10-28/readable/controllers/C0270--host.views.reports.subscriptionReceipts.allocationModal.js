// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:80022-80118
appModule.controller('host.views.reports.subscriptionReceipts.allocationModal', [
        '$scope', 'receiptId', '$uibModalInstance', 'abp.services.app.subscriptionInvoices', 'abp.services.app.directory', 'utilities',
        function ($scope, receiptId, $uibModalInstance, subscriptionInvoicesAppService, directoryService, utilities) {

            var vm = this;
            vm.loading = false;
            vm.saving = false;
            vm.receiptId = receiptId;
            vm.invoices = [];
            vm.isAllocationExceeded = false;

            vm.save = function () {

                vm.saving = true;

                var allocationData = {
                    receipt: vm.receipt,
                    invoices: vm.invoices
                };

                subscriptionInvoicesAppService.createAllocations(allocationData).success(function (result) {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {

                    vm.saving = false;
                });
            };

            vm.sumAmount = function () {
                if (vm.invoices == null)
                    return 0;

                if (vm.invoices.length == 0)
                    return 0;

                var amount = 0;
                angular.forEach(vm.invoices, function (value, key) {

                    if (value.allocatedNow > 0)
                        amount = amount + value.allocatedNow;
                });

                return utilities.round(amount, 2);
            };

            vm.getAllocationForReceipt = function () {
                if (vm.receiptId > 0) {
                    vm.loading = true;
                    subscriptionInvoicesAppService.getReceiptForAllocations({ id: vm.receiptId }).success(function (result) {
                        vm.receipt = result;
                        if (vm.receipt.tenant && vm.receipt.tenant.id && vm.receipt.businessDivision && vm.receipt.businessDivision.id) {
                            vm.getInvoicesFromTenant(vm.receipt.tenant.id, vm.receipt.businessDivision.id)
                        }
                    }).finally(function () {
                        vm.loading = false;
                    });
                }
            };


            vm.rounding = function (value) {
                return utilities.round(value, 4);
            };

            vm.insertDueAmountOnClick = function (row) {
                if (parseFloat(row.allocatedNow) == 0) {
                    row.allocatedNow = vm.rounding(row.totalAmount - row.allocatedAmount - row.allocatedNow);
                }
            };

            vm.getInvoicesFromTenant = function (tenantId, businessDivisionId) {
                if (!tenantId || !businessDivisionId) return;

                vm.loading = true;
                subscriptionInvoicesAppService.getTenantInvoices({
                    tenantId: tenantId,
                    businessDivisionId: businessDivisionId
                }).then(function (response) {
                    vm.invoices = response.data;
                }).finally(function () {
                    vm.loading = false;
                });
            };


            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function init() {
                vm.getAllocationForReceipt();

            }
            init();
        }
    ]);
