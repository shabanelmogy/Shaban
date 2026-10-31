// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:170266-170348
appModule.controller('tenant.views.crs.billing.invoicePaymentModal', [
        '$scope', '$uibModalInstance', '$uibModal', 'invoice', 'abp.services.app.billing', 'abp.services.app.customerCareTenant',
        function ($scope, $uibModalInstance, $uibModal, invoice, billingService, customerCareTenantService) {
            var vm = this;
            vm.isSaving = false
            vm.invoice = invoice;
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.payment = {
                type: 1,
                card:null
            };

            if (vm.invoice.tenant.hasCard)
                vm.payment.card = 1;

            vm.save = function () {
                if (vm.payment.card == 1) {
                    vm.saving = true;
                    customerCareTenantService.invoiceSilentPayment({
                        id: vm.invoice.id

                    }).success(function (result) {
                        if (result == 'succeeded') {
                            abp.message.success('Paid successfully');
                            $uibModalInstance.close();
                        }
                        else {
                            abp.message.error(result);
                            $uibModalInstance.close();
                        }
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
                else  {
                    let url = `/StripePayment/CheckoutSession?id=${vm.invoice.id}&type=${vm.payment.type}`;

                    // Redirect to the constructed URL
                    window.location.href = url;
                }
            };

            vm.cardType = function (type) {
                if (type == 1) {
                    return 'Master Card';
                } else if (type == 2) {
                    return 'Visa';
                } else if (type == 3) {
                    return 'American Express';
                } else if (type == 4) {
                    return 'Union Pay';
                } else if (type == 225) {
                    return 'Unknown';
                }
            };
            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('MM/YYYY');
                }
                else {
                    return "";
                }
            };
            vm.init = function () {
                vm.loading = true;
                customerCareTenantService.getTenantCardById({
                    id: vm.invoice.tenant.id
                }).success(function (result) {
                    vm.tenantCard = result;
                }).finally(function () {
                    vm.loading = false;
                });

            };
            if (vm.invoice.tenant.hasCard)
                vm.init();
            
        }
    ]);
