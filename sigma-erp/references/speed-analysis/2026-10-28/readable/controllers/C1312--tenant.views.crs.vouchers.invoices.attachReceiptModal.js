// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:342630-342672
appModule.controller('tenant.views.crs.vouchers.invoices.attachReceiptModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'invoiceId', 'abp.services.app.invoiceSearch', 'abp.services.app.receipt', 'abp.services.app.invoice',

        function ($scope, $uibModal, $uibModalInstance, invoiceId, invoiceSearchService, receiptService, invoiceAppService) {
            var vm = this;
            vm.invoice = null;

            function getAdvanceReceipts(contactId, voucherNo) {
                receiptService.getAdvanceReceipts({ contactId, voucherNo })
                    .success(result => {
                        vm.advanceReceipts = result;
                    });
            }

            vm.searchAdvanceReceipts = ($select) => {
                getAdvanceReceipts(vm.invoice.contactId, $select.search);
            };

            vm.save = function () {

                invoiceAppService.addReceiptToAdvanceTaxInvoice({ invoice: vm.invoice }).success(
                    function (response) {
                        $uibModalInstance.close(response);
                        abp.notify.info(app.localize('ReceiptAttachedSuccessfully'));
                    });

            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };


            function init() {
                invoiceSearchService.getInvoiceForView({ id: invoiceId }).success(
                    function (result) {
                        vm.invoice = result;
                        console.log(vm.invoice.contact.name);
                    });
            }
            init();

        }]);
