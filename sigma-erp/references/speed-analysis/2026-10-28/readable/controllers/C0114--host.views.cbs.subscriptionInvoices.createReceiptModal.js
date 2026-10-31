// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:50722-50766
appModule.controller('host.views.cbs.subscriptionInvoices.createReceiptModal', [
        '$scope', '$uibModalInstance', 'invoiceId', 'abp.services.app.subscriptionInvoices',
        function ($scope, $uibModalInstance, invoiceId, subscriptionInvoicesAppService) {

            var vm = this;
            vm.invoiceId = invoiceId;
            vm.loading = false;
            vm.saving = false;
            vm.isEditMode = false;

           

            vm.save = function () {
                
                vm.saving = true;
                subscriptionInvoicesAppService.createReceipt(vm.receipt).success(function (result) {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            vm.getSubscriptionInvoiceById = function () {
                if (vm.invoiceId > 0) {
                    vm.loading = true;
                    subscriptionInvoicesAppService.getSubscriptionInvoiceById(vm.invoiceId).success(function (result) {
                        vm.receipt = result;
                        vm.receipt.date = new Date();
                    }).finally(function () {
                        vm.loading = false;
                    });
                }
            };


            function init() {
                vm.getSubscriptionInvoiceById();
            }
            init();
        }
    ]);
