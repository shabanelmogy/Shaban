// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:51888-51925
appModule.controller('host.views.cbs.subscriptionInvoices.viewReceiptModal', [
        '$scope', '$uibModalInstance', 'invoiceId', 'abp.services.app.subscriptionInvoices',
        function ($scope, $uibModalInstance, invoiceId, subscriptionInvoicesAppService) {

            var vm = this;
            vm.invoiceId = invoiceId;
            vm.loading = false;
            
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            vm.getReceiptById = function () {
                if (vm.invoiceId > 0) {
                    vm.loading = true;
                    subscriptionInvoicesAppService.getReceiptById(vm.invoiceId).success(function (result) {
                        vm.receipt = result;
                        vm.receipt.date = vm.getlocalDateTime(vm.receipt.date);
                    }).finally(function () {
                        vm.loading = false;
                    });
                }
            };
            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('DD-MMM-YY');
                }
                else {
                    return "";
                }
            };

            function init() {
                vm.getReceiptById();
            }
            init();
        }
    ]);
