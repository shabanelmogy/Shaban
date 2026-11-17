// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:84312-84341
appModule.controller('host.views.tenants.updateSubscriptionBillingStatusModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.subscription', 'subscription',
        function ($scope, $uibModalInstance, subscriptionService, subscription) {
            var vm = this;
            vm.subscription = angular.copy(subscription);
            vm.billingStatuses = [
                { id: 1, name: "On" },
                { id: 2, name: "Off" },
                { id: 3, name: "Paused" },
                { id: 4, name: "Canceled" }
            ];

            vm.save = function () {
                vm.saving = true;
               
                subscriptionService.updateBillingStatus(vm.subscription)
                    .success(function (result) {
                        abp.notify.info('Subscription Saved');
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

        }
    ]);
