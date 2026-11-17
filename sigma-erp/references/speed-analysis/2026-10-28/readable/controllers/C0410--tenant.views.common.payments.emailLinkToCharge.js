// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:102725-102822
appModule.controller('tenant.views.common.payments.emailLinkToCharge', [
        '$scope', '$uibModalInstance', 'data', 'abp.services.app.booking', 'abp.services.app.invoice',
        function ($scope, $uibModalInstance, data, bookingService, invoiceService) {

            var vm = this;

            vm.isOnlinePaymentsEnabled = abp.features.isEnabled("OnlinePayments");
            vm.isAddCardEnabled = abp.features.isEnabled("OnlinePayments.Customer.AddCard");
            vm.isOneTimePaymentEnabled = abp.features.isEnabled("OnlinePayments.Customer.OneTimePayment");

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.filters = {
            };

            vm.isOneTimePaymentOnChange = () => {
                if (!vm.info.isOneTimePayment) {
                    vm.info.amount = 0;
                }
            }

            vm.send = () => {
                if (data.source === 'booking' || data.source === 'agreement') {
                    vm.isLoading = true;
                    bookingService.sendEmailForBookingPayment(vm.info)
                        .success(() => {
                            abp.notify.success('Successfully Sent Email');
                        })
                        .finally(() => {
                            vm.isLoading = false;
                            $uibModalInstance.dismiss();
                        });
                } else if (data.source === 'invoice' || data.source === 'addCard') {
                    vm.isLoading = true;
                    invoiceService.sendEmailForInvoicePayment(vm.info)
                        .success(() => {

                            abp.notify.success('Successfully Sent Email');


                        })
                        .finally(() => {
                            vm.isLoading = false;
                            $uibModalInstance.close();
                        });
                }
            }

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('YYYY-MM-DD HH:mm');
                }
                else {
                    return "";
                }
            };

            function init() {
                vm.isAddCardEnabled = vm.isAddCardEnabled && !data.hasCard;
                vm.info = {
                    source: data.source,
                    customerId: data.customerId,
                    customerName: data.customerName,
                    customerEmail: data.customerEmail,
                    isAddCreditCard: abp.features.isEnabled('OnlinePayments.Customer.AddCard') && !data.hasCard,
                    isOneTimePayment: abp.features.isEnabled('OnlinePayments.Customer.OneTimePayment'),
                    amount: data.dueAmount,
                    isPaymentEmailSent: data.isPaymentEmailSent,
                };
                if (data.source === 'addCard') {
                    vm.isOneTimePaymentEnabled = false;
                    vm.info.isOneTimePayment = false;
                }
                else if (data.source === 'booking' || data.source === 'agreement') {
                    vm.info.agreementId = data.agreementId;
                    vm.info.agreementNo = data.agreementNo;
                    vm.paymentTypes = [
                        "Advance"
                    ];
                    if (data.sourceInfo?.deposit == 0)
                        vm.paymentTypes.push('Deposit');
                    vm.info.paymentType = "Advance";
                } else if (data.source === 'invoice') {
                    vm.info.voucherId = data.voucherId;
                    vm.info.voucherNo = data.voucherNo;
                }
            }

            init();
        }
    ]);
