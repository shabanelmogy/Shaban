// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:51744-51781
appModule.controller('host.views.cbs.subscriptionInvoices.silentPaymentModal', [
        '$uibModal', '$uibModalInstance', 'invoice', 'abp.services.app.billing',
        function ($uibModal, $uibModalInstance, invoice, billingService) {

            var vm = this;
            vm.isProcess = false;
            vm.invoice = invoice;
            vm.data = {
                invoiceId: invoice.id,
                tenantId: invoice.tenantId
            }
            vm.cancel = () => {
                $uibModalInstance.dismiss();
            }

            vm.pay = () => {
                vm.isProcess = true;
                billingService.invoiceSilentPayment({
                    id: vm.invoice.id

                }).success(r => {
                    if (r == 'succeeded') {

                        abp.message.success('Paid successfully')
                        $uibModalInstance.close(r);
                    }
                    else {
                        abp.message.error(r)
                        $uibModalInstance.close(r);
                    }
                }).finally(() => {
                    vm.isProcess = false;
                });

            }

        }
    ]);
