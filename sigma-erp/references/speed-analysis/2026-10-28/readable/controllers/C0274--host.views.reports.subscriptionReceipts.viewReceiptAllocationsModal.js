// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:80545-80625
appModule.controller('host.views.reports.subscriptionReceipts.viewReceiptAllocationsModal', [
        '$scope', 'voucherId', 'fromReceipt','$uibModalInstance', 'abp.services.app.subscriptionInvoices', 'utilities',
        function ($scope, voucherId, fromReceipt, $uibModalInstance, subscriptionInvoicesAppService, utilities) {

            var vm = this;
            vm.loading = false;
            vm.voucherId = voucherId;
            vm.fromReceipt = fromReceipt;
            vm.invoices = [];

            vm.sumAmount = function () {
                if (vm.invoices == null)
                    return 0;

                if (vm.invoices.length == 0)
                    return 0;

                var amount = 0;
                angular.forEach(vm.invoices, function (value, key) {

                    if (value.allocatedAmount > 0)
                        amount = amount + value.allocatedAmount;
                });

                return utilities.round(amount, 2);
            };

            vm.rounding = function (value) {
                return utilities.round(value, 4);
            };

            vm.getType = function (type) {
                if (type == 1) {
                    return "Invoice";
                }
                else{
                    return "Receipt";
                }
            };

            vm.viewReceiptAllocations = function () {
                if (!vm.voucherId) return;

                vm.loading = true;
                if (fromReceipt) {
                    subscriptionInvoicesAppService.viewReceiptAllocations({
                       
                        voucherId: voucherId
                    }).then(function (response) {
                        vm.currency = response.data.currency;
                        vm.invoices = response.data.allocations;
                    }).finally(function () {
                        vm.loading = false;
                    });
                }
                else {
                    subscriptionInvoicesAppService.getReceiptsByInvoice({
                        
                        voucherId: voucherId
                    }).then(function (response) {
                        vm.currency = response.data.currency;
                        vm.invoices = response.data.allocations;
                    }).finally(function () {
                        vm.loading = false;
                    });
                }
                
            };


            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function init() {
                vm.viewReceiptAllocations();

            }
            init();
        }
    ]);
