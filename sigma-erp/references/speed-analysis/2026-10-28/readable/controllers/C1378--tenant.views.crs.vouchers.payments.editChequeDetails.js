// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:374769-374808
appModule.controller('tenant.views.crs.vouchers.payments.editChequeDetails', [
        '$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.payment', 'paymentId',
        function ($scope, $uibModal, $uibModalInstance, paymentAppService, paymentId) {

            var vm = this;
            vm.saving = false;
            
            vm.save = function () {
                vm.saving = true;
                paymentAppService.updatePaymentChequeDetails({ payment: vm.payment }).success(function (result) {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };

            vm.cancel = function () {
                $uibModalInstance.close();
            };
            vm.getpaymentForEdit = function (paymentId) {
                vm.loading = true;
                paymentAppService.getPaymentForChequeEdit({ id: paymentId }).success(function (data) {

                    vm.payment = data;
                    
                }).finally(function () {
                    vm.loading = false;
                });
            };
            function init() {
                vm.loading = true;
                
                vm.getpaymentForEdit(paymentId);
               
            }
            init();
        }
    ]);
