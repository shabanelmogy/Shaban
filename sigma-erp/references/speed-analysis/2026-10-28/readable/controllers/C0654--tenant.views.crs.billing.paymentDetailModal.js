// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:170477-170557
appModule.controller('tenant.views.crs.billing.paymentDetailModal', [
        '$scope', '$uibModal', 'invoiceDetail', 'voucherId', '$uibModalInstance', 'abp.services.app.billing', 'abp.services.app.customerCareTenant', 'utilities',
        function ($scope, $uibModal, invoiceDetail, voucherId, $uibModalInstance, billingAppService, customerCareTenantService, utilities) {

            var vm = this;
            vm.loading = false;
            vm.voucherId = voucherId;
            vm.allocations = [];
            vm.invoiceDetail = invoiceDetail;

            vm.sumAmount = function () {
                if (vm.allocations == null)
                    return 0;

                if (vm.allocations.length == 0)
                    return 0;

                var amount = 0;
                angular.forEach(vm.allocations, function (value, key) {

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
                else {
                    return "Receipt";
                }
            };

            vm.getReceiptsByInvoice = function () {
                vm.loading = true;
                customerCareTenantService.getReceiptsByInvoiceId({
                    id : voucherId
                }).then(function (response) {
                    vm.currency = response.data.currency;
                    vm.allocations = response.data.allocations;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.receipt = function (row) {

                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/billing/receiptPrintTemplate.cshtml',
                    controller: 'tenant.views.crs.billing.receiptPrintTemplate as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        filters: function () {
                            return row.voucherId;
                        },
                        invoiceDetail: function () {
                            return vm.invoiceDetail;
                        }
                    }
                });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function init() {
                vm.getReceiptsByInvoice();

            }
            init();
        }
    ]);
