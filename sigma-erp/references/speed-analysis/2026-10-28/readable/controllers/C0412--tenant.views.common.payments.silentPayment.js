// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:102919-102983
appModule.controller('tenant.views.common.payments.silentPayment', [
        '$uibModal', '$uibModalInstance', 'data', 'abp.services.app.booking', 'abp.services.app.invoice', 'abp.services.app.rentalQuotation',
        function ($uibModal, $uibModalInstance, data, bookingService, invoiceService, rentalQuotationService) {

            var vm = this;
            vm.isInvoiced = false;
            vm.isProcess = false;

            vm.cancel = () => {
                $uibModalInstance.dismiss();
            }

            vm.pay = () => {
                if (vm.data.source === 'booking' || vm.data.source === 'agreement') {
                    vm.isProcess = true;
                    bookingService.silentPayment(vm.data).success(r => {
                        abp.message.success('Paid successfully')
                        $uibModalInstance.close(r);
                    }).finally(() => {
                        vm.isProcess = false;
                    });
                } else if (vm.data.source === 'invoice') {
                    vm.isProcess = true;
                    invoiceService.silentPayment(vm.data).success(r => {
                        if (r === false) {
                            abp.message.error('Payment Declined')
                        }
                        else {
                            abp.message.success('Paid successfully')
                            $uibModalInstance.close(r);
                        }
                        
                    }).finally(() => {
                        vm.isProcess = false;
                    });
                }
                else if (vm.data.source === 'quotation') {
                    vm.isProcess = true;
                    rentalQuotationService.silentPayment(vm.data).success(r => {
                        abp.message.success('Paid successfully')
                        $uibModalInstance.close(r);
                    }).finally(() => {
                        vm.isProcess = false;
                    });
                }
            }

            function init() {
                debugger;
                vm.data = data;
                if (vm.data.source === 'invoice')
                {
                    vm.data.amount = vm.data.dueAmount;
                    vm.isInvoiced = true;
                }

                vm.paymentTypes = [
                    "Advance", "Deposit"
                ];
                vm.data.paymentType = "Advance";
            }

            init();
        }
    ]);
