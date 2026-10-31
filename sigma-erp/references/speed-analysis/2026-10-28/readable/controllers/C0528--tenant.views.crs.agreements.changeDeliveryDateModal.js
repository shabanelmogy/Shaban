// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:135677-135712
appModule.controller('tenant.views.crs.agreements.changeDeliveryDateModal', [
        '$scope', 'appSession', '$filter', 'utilities', '$uibModal', '$uibModalInstance', 'agreementId', 'abp.services.app.agreement',
        function ($scope, appSession, $filter, utilities, $uibModal, $uibModalInstance, agreementId, agreementService) {

            var vm = this;

            vm.save = () => {
                vm.saving = true;
                agreementService.changeDeliveryDate({
                    agreementId: vm.agreement.id,
                    deliveryDate: vm.agreement.expectedDeliveryDate
                }).success(() => {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(() => {
                    vm.saving = false;
                });
            }

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function init() {
                vm.loading = true;
                agreementService.getAgreement({ id: agreementId })
                    .success((a) => {
                        vm.agreement = a;
                    }).finally(() => {
                        vm.loading = false;
                    })
            }

            init();
        }
    ]);
